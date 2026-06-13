import { randomUUID } from 'crypto'
import { getAuthUser } from '@/lib/supabase-auth'
import { mergeUsageSubject } from '@/lib/usage-store'

export const usageCookieName = 'nexusai_subject'

export function getDeviceSubjectId(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${usageCookieName}=([^;]+)`))
  const existing = match?.[1] ? decodeURIComponent(match[1]) : ''

  return /^[0-9a-f-]{36}$/i.test(existing) ? existing : ''
}

export async function getUsageSubject(req: Request) {
  const auth = await getAuthUser(req)
  const deviceSubjectId = getDeviceSubjectId(req)

  if (auth.user) {
    const subjectId = `user:${auth.user.id}`
    if (deviceSubjectId) {
      await mergeUsageSubject(deviceSubjectId, subjectId, auth.user.email || '').catch((error) => {
        console.error('[usage] Could not merge device credits into account:', error)
      })
    }

    return {
      subjectId,
      isNew: false,
      authenticated: true,
      email: auth.user.email || '',
      setCookies: [...auth.setCookies, usageCookieHeader(subjectId)],
    }
  }

  if (deviceSubjectId) {
    return { subjectId: deviceSubjectId, isNew: false, authenticated: false, email: '', setCookies: auth.setCookies }
  }

  return { subjectId: randomUUID(), isNew: true, authenticated: false, email: '', setCookies: auth.setCookies }
}

export function usageCookieHeader(subjectId: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${usageCookieName}=${encodeURIComponent(subjectId)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`
}
