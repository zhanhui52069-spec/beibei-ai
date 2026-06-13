const accessCookieName = 'nexusai_access_token'
const refreshCookieName = 'nexusai_refresh_token'

type AuthUser = {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

type AuthSession = {
  access_token: string
  refresh_token: string
  expires_in?: number
  user: AuthUser
}

function getAuthConfig() {
  const supabaseURL = process.env.SUPABASE_URL || ''
  const apiKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''

  return { supabaseURL: supabaseURL.replace(/\/$/, ''), apiKey, configured: Boolean(supabaseURL && apiKey) }
}

function readCookie(req: Request, name: string) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : ''
}

function authCookie(name: string, value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`
}

export function clearAuthCookies() {
  return [authCookie(accessCookieName, '', 0), authCookie(refreshCookieName, '', 0)]
}

export function sessionCookies(session: AuthSession) {
  return [
    authCookie(accessCookieName, session.access_token, Math.max(60, session.expires_in || 3600)),
    authCookie(refreshCookieName, session.refresh_token, 60 * 60 * 24 * 30),
  ]
}

async function authRequest(path: string, init: RequestInit) {
  const config = getAuthConfig()
  if (!config.configured) throw new Error('Account login is not configured yet.')

  return fetch(`${config.supabaseURL}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: config.apiKey,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })
}

async function parseAuthError(response: Response) {
  const data = await response.json().catch(() => null)
  return data?.msg || data?.message || data?.error_description || data?.error || `Authentication failed (${response.status}).`
}

export async function signInWithPassword(email: string, password: string) {
  const response = await authRequest('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) throw new Error(await parseAuthError(response))
  return response.json() as Promise<AuthSession>
}

export async function signUpWithPassword(email: string, password: string, name: string) {
  const redirectURL = `${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')}/login?confirmed=1`
  const response = await authRequest(`/signup${redirectURL.startsWith('http') ? `?redirect_to=${encodeURIComponent(redirectURL)}` : ''}`, {
    method: 'POST',
    body: JSON.stringify({ email, password, data: { name } }),
  })

  if (!response.ok) throw new Error(await parseAuthError(response))
  return response.json() as Promise<Partial<AuthSession> & { user: AuthUser }>
}

async function getUser(accessToken: string) {
  const response = await authRequest('/user', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) return null
  return response.json() as Promise<AuthUser>
}

async function refreshSession(refreshToken: string) {
  const response = await authRequest('/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!response.ok) return null
  return response.json() as Promise<AuthSession>
}

export async function getAuthUser(req: Request) {
  const accessToken = readCookie(req, accessCookieName)
  const refreshToken = readCookie(req, refreshCookieName)

  if (accessToken) {
    const user = await getUser(accessToken).catch(() => null)
    if (user) return { user, setCookies: [] as string[] }
  }

  if (refreshToken) {
    const session = await refreshSession(refreshToken).catch(() => null)
    if (session?.user) return { user: session.user, setCookies: sessionCookies(session) }
  }

  return { user: null, setCookies: accessToken || refreshToken ? clearAuthCookies() : [] }
}

export function appendSetCookies(headers: Headers, cookies: string[]) {
  for (const cookie of cookies) headers.append('Set-Cookie', cookie)
}
