"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Database, Loader2, LockKeyhole, RefreshCw } from "lucide-react"

import { BrandMark } from "@/components/brand-mark"
import { LanguageToggle } from "@/components/language-toggle"
import { MarketSwitcher } from "@/components/market-switcher"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type FeedbackItem = {
  id?: string
  name: string
  email: string
  role: string
  category: string
  message: string
  locale: string
  status?: string
  created_at?: string
}

const copy = {
  en: {
    title: "Admin",
    subtitle: "Review customer feedback and site signals from one private workspace",
    password: "Admin password",
    passwordPlaceholder: "Enter ADMIN_PASSWORD",
    signIn: "Sign in",
    loading: "Loading",
    refresh: "Refresh",
    back: "Back to site",
    total: "Total feedback",
    today: "Today",
    emails: "With email",
    databaseReady: "Database connected",
    databaseMissing: "Database not connected",
    missingEnv: "Missing environment variables",
    feedback: "Feedback inbox",
    empty: "No feedback yet",
    anonymous: "Anonymous",
    noCategory: "General",
    noRole: "Visitor",
  },
  zh: {
    title: "后台",
    subtitle: "在一个私密工作台查看用户反馈和网站信号",
    password: "后台密码",
    passwordPlaceholder: "输入 ADMIN_PASSWORD",
    signIn: "登录",
    loading: "加载中",
    refresh: "刷新",
    back: "返回网站",
    total: "反馈总数",
    today: "今日新增",
    emails: "留下邮箱",
    databaseReady: "数据库已连接",
    databaseMissing: "数据库未连接",
    missingEnv: "缺少环境变量",
    feedback: "意见箱",
    empty: "还没有收到反馈",
    anonymous: "匿名用户",
    noCategory: "普通反馈",
    noRole: "访客",
  },
}

export default function AdminPage() {
  const { locale } = useLanguage()
  const text = copy[locale]
  const [password, setPassword] = useState("")
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [missing, setMissing] = useState<string[]>([])
  const [configured, setConfigured] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const loadFeedback = async (nextPassword = password) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/feedback", {
        headers: {
          "x-admin-password": nextPassword,
        },
        cache: "no-store",
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load admin data.")
      }

      window.sessionStorage.setItem("nexusai_admin_password", nextPassword)
      setIsAuthed(true)
      setItems(data.items || [])
      setMissing(data.missing || [])
      setConfigured(Boolean(data.configured))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load admin data.")
      setIsAuthed(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const savedPassword = window.sessionStorage.getItem("nexusai_admin_password")

    if (savedPassword) {
      setPassword(savedPassword)
      void loadFeedback(savedPassword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toDateString()

    return {
      total: items.length,
      today: items.filter((item) => {
        if (!item.created_at) return false
        return new Date(item.created_at).toDateString() === today
      }).length,
      emails: items.filter((item) => item.email).length,
    }
  }, [items])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void loadFeedback()
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07050a] text-white">
      <div className="fixed inset-0 -z-10 bg-[url('/images/nyc-night-purple.svg')] bg-cover bg-center opacity-45" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(236,72,153,0.22),transparent_32%),linear-gradient(180deg,rgba(7,5,10,0.76),#07050a_70%)]" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <BrandMark size="sm" />
        <div className="flex items-center gap-2">
          <MarketSwitcher />
          <LanguageToggle />
          <Button asChild variant="ghost" className="text-white/70 hover:text-white">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              {text.back}
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-4 border-white/15 bg-white/5 text-white/70">
              <LockKeyhole className="h-3.5 w-3.5" />
              Private
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">{text.title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/64">{text.subtitle}</p>
          </div>
          {isAuthed ? (
            <Button
              type="button"
              onClick={() => loadFeedback()}
              disabled={isLoading}
              className="bg-white text-black hover:bg-white/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {text.refresh}
            </Button>
          ) : null}
        </div>

        {!isAuthed ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-md rounded-lg border border-white/12 bg-black/42 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl"
          >
            <label className="text-sm font-medium text-white/78" htmlFor="admin-password">
              {text.password}
            </label>
            <div className="mt-3 flex gap-2">
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={text.passwordPlaceholder}
                className="border-white/12 bg-white/8 text-white placeholder:text-white/36"
              />
              <Button type="submit" disabled={isLoading || !password.trim()} className="bg-white text-black hover:bg-white/90">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {text.signIn}
              </Button>
            </div>
            {error ? <p className="mt-3 text-sm text-pink-200">{error}</p> : null}
          </form>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label={text.total} value={stats.total} />
              <Metric label={text.today} value={stats.today} />
              <Metric label={text.emails} value={stats.emails} />
              <div className="rounded-lg border border-white/12 bg-white/[0.055] p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-white/58">
                  <Database className="h-4 w-4" />
                  {configured ? text.databaseReady : text.databaseMissing}
                </div>
                <p className="mt-3 text-sm text-white/76">
                  {configured ? "Supabase" : `${text.missingEnv}: ${missing.join(", ") || "SUPABASE_URL"}`}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-white/12 bg-black/42 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <h2 className="text-lg font-semibold">{text.feedback}</h2>
                <Badge variant="outline" className="border-white/15 text-white/64">
                  {items.length}
                </Badge>
              </div>

              {items.length ? (
                <div className="divide-y divide-white/10">
                  {items.map((item, index) => (
                    <article key={item.id || `${item.created_at}-${index}`} className="px-5 py-4 transition hover:bg-white/[0.045]">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/52">
                        <Badge variant="outline" className="border-pink-300/20 bg-pink-300/10 text-pink-100">
                          {item.category || text.noCategory}
                        </Badge>
                        <span>{item.role || text.noRole}</span>
                        <span>{item.locale?.toUpperCase()}</span>
                        <span>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/82">{item.message}</p>
                      <p className="mt-3 text-xs text-white/48">
                        {item.name || text.anonymous}
                        {item.email ? ` · ${item.email}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-14 text-center text-white/54">{text.empty}</div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/[0.055] p-4 backdrop-blur-xl">
      <p className="text-sm text-white/58">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  )
}
