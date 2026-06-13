import { appendSetCookies, clearAuthCookies } from '@/lib/supabase-auth'

export async function POST() {
  const headers = new Headers()
  appendSetCookies(headers, clearAuthCookies())
  return Response.json({ ok: true }, { headers })
}
