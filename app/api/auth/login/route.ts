import { appendSetCookies, sessionCookies, signInWithPassword } from '@/lib/supabase-auth'
import { mergeUsageSubject } from '@/lib/usage-store'
import { getDeviceSubjectId, usageCookieHeader } from '@/lib/usage-subject'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    if (!email || !password) return Response.json({ error: 'Email and password are required.' }, { status: 400 })

    const session = await signInWithPassword(email, password)
    const subjectId = `user:${session.user.id}`
    const deviceSubjectId = getDeviceSubjectId(req)
    if (deviceSubjectId) {
      await mergeUsageSubject(deviceSubjectId, subjectId, session.user.email || email).catch((error) => {
        console.error('[auth] Device credit migration will retry on the next request:', error)
      })
    }

    const headers = new Headers()
    appendSetCookies(headers, [...sessionCookies(session), usageCookieHeader(subjectId)])
    return Response.json({ user: { id: session.user.id, email: session.user.email || email } }, { headers })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Could not log in.' }, { status: 401 })
  }
}
