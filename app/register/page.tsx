'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError(t.auth.missingRegister)
      return
    }

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch)
      return
    }

    if (password.length < 6) {
      setError(t.auth.passwordTooShort)
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.setItem('nexusai_user', JSON.stringify({ name, email }))
    router.push('/chat')

    setIsLoading(false)
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

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="glass-panel soft-reveal w-full max-w-sm rounded-lg border p-6">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <BrandMark />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t.auth.registerTitle}</h1>
            <p className="mt-2 text-muted-foreground">{t.auth.registerDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">{t.auth.name}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t.auth.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border/50 bg-card pl-10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

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
                  placeholder={t.auth.passwordHint}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">{t.auth.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.auth.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-border/50 bg-card pl-10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              disabled={isLoading}
            >
              {isLoading ? t.auth.registering : t.auth.registerButton}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t.auth.hasAccount}{' '}
            <Link href="/login" className="text-accent hover:underline">
              {t.auth.loginLink}
            </Link>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            {t.auth.termsPrefix}{' '}
            <Link href="/terms" className="text-accent hover:underline">{t.auth.terms}</Link>
            {' '}{t.auth.and}{' '}
            <Link href="/privacy" className="text-accent hover:underline">{t.auth.privacy}</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
