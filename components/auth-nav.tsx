'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, UserRound } from 'lucide-react'

import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'

type User = { email: string; name?: string }

export function AuthNav({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { locale, t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
  }, [])

  if (!user) {
    return (
      <Link href="/login" onClick={onNavigate}>
        <Button variant="ghost" size={mobile ? 'default' : 'sm'} className={mobile ? 'w-full justify-start text-muted-foreground' : 'text-muted-foreground hover:text-foreground'}>
          {t.nav.login}
        </Button>
      </Link>
    )
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    onNavigate?.()
    window.location.href = '/'
  }

  return (
    <div className={mobile ? 'flex items-center justify-between gap-2' : 'flex items-center gap-2'}>
      <span className="flex max-w-40 items-center gap-2 truncate text-sm text-muted-foreground" title={user.email}>
        <UserRound className="h-4 w-4 shrink-0" />
        <span className="truncate">{user.name || user.email}</span>
      </span>
      <Button variant="ghost" size="icon" onClick={logout} aria-label={locale === 'zh' ? '退出登录' : 'Log out'} title={locale === 'zh' ? '退出登录' : 'Log out'}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
