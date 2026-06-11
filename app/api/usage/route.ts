import { getUsageBalance } from '@/lib/usage-store'
import { getUsageSubject, usageCookieHeader } from '@/lib/usage-subject'

export async function GET(req: Request) {
  const subject = getUsageSubject(req)
  const balance = await getUsageBalance(subject.subjectId)
  const headers = subject.isNew ? { 'Set-Cookie': usageCookieHeader(subject.subjectId) } : undefined

  return Response.json({ balance }, { headers })
}

