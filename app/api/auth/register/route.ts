import { appendSetCookies, sessionCookies, signUpWithPassword } from '@/lib/supabase-auth'
import { mergeUsageSubject } from '@/lib/usage-store'
import { getDeviceSubjectId, usageCookieHeader } from '@/lib/usage-subject'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    if (!name || !email || password.length < 6) {
      return Response.json({ error: 'Name, email, and a password of at least 6 characters are required.' }, { status: 400 })
    }

    const result = await signUpWithPassword(email, password, name)
    if (!result.access_token || !result.refresh_token) {
      return Response.json({ confirmationRequired: true, email })
    }

    const session = result as Required<Pick<typeof result, 'access_token' | 'refresh_token' | 'user'>> & typeof result
    const subjectId = `user:${session.user.id}`
    const deviceSubjectId = getDeviceSubjectId(req)
    if (deviceSubjectId) {
      await mergeUsageSubject(deviceSubjectId, subjectId, session.user.email || email).catch((error) => {
        console.error('[auth] Device credit migration will retry on the next request:', error)
      })
    }

    const headers = new Headers()
    appendSetCookies(headers, [
      ...sessionCookies({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        user: session.user,
      }),
      usageCookieHeader(subjectId),
    ])
    return Response.json({ user: { id: session.user.id, email: session.user.email || email } }, { headers })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Could not create account.' }, { status: 400 })
  }
}
