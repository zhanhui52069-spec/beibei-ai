import { randomUUID } from 'crypto'

export const usageCookieName = 'nexusai_subject'

export function getUsageSubject(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${usageCookieName}=([^;]+)`))
  const existing = match?.[1] ? decodeURIComponent(match[1]) : ''

  if (/^[0-9a-f-]{36}$/i.test(existing)) {
    return { subjectId: existing, isNew: false }
  }

  return { subjectId: randomUUID(), isNew: true }
}

export function usageCookieHeader(subjectId: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${usageCookieName}=${encodeURIComponent(subjectId)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`
}

