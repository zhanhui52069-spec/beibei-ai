import { getUsageBalance } from '@/lib/usage-store'
import { getUsageSubject, usageCookieHeader } from '@/lib/usage-subject'
import { appendSetCookies } from '@/lib/supabase-auth'

export async function GET(req: Request) {
  const subject = await getUsageSubject(req)
  const balance = await getUsageBalance(subject.subjectId)
  const headers = new Headers()
  appendSetCookies(headers, subject.setCookies)
  if (subject.isNew) headers.append('Set-Cookie', usageCookieHeader(subject.subjectId))

  return Response.json({ balance, authenticated: subject.authenticated, email: subject.email }, { headers })
}
