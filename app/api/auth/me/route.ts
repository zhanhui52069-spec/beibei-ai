import { appendSetCookies, getAuthUser } from '@/lib/supabase-auth'

export async function GET(req: Request) {
  const auth = await getAuthUser(req)
  const headers = new Headers()
  appendSetCookies(headers, auth.setCookies)
  return Response.json(
    { user: auth.user ? { id: auth.user.id, email: auth.user.email || '', name: auth.user.user_metadata?.name || '' } : null },
    { headers },
  )
}
