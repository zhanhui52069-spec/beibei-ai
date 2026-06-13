'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError(t.auth.missingLogin)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || 'Could not log in.')
      router.push('/chat')
      router.refresh()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : locale === 'zh' ? '登录失败，请重试' : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="ambient-grid fixed inset-0 opacity-60" />

      <header className="relative z-10 flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.auth.backHome}
          </Button>
        </Link>
        <LanguageToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4">
        <div className="glass-panel soft-reveal w-full max-w-sm rounded-lg border p-6">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <BrandMark />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t.auth.loginTitle}</h1>
            <p className="mt-2 text-muted-foreground">{t.auth.loginDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border/50 bg-card pl-10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">{t.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border/50 bg-card pl-10 pr-10 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              disabled={isLoading}
            >
              {isLoading ? t.auth.loggingIn : t.auth.loginButton}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t.auth.noAccount}{' '}
            <Link href="/register" className="text-accent hover:underline">
              {t.auth.createAccountLink}
            </Link>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t.auth.or}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full border-border/50 bg-transparent text-foreground hover:bg-secondary"
              onClick={() => router.push('/chat')}
            >
              {t.auth.guestAccess}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
