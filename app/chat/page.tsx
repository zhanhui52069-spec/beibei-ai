'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Bot, Coins, Infinity, Loader2, Send, Trash2, User } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { LanguageToggle } from '@/components/language-toggle'
import { MarketSwitcher } from '@/components/market-switcher'
import { useLanguage } from '@/components/language-provider'
import { useMarket } from '@/components/market-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type UsageBalance = {
  subjectId: string
  plan: 'free' | 'seller' | 'team'
  unlimited: boolean
  freeRemaining: number
  creditRemaining: number
  totalRemaining: number
  nextResetAt: string
  metering: boolean
}

const taskPacks = [
  { id: 'starter', price: '$7', tasks: 200 },
  { id: 'growth', price: '$15', tasks: 500 },
  { id: 'scale', price: '$29', tasks: 1200 },
]

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  }
}

export default function ChatPage() {
  const { t, locale } = useLanguage()
  const { market } = useMarket()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<UsageBalance | null>(null)
  const [quotaOpen, setQuotaOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    void fetch('/api/usage', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setBalance(data.balance || null))
      .catch(() => setBalance(null))
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading, error])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const text = input.trim()
    if (!text || isLoading) return

    const userMessage = createMessage('user', text)
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          market,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      })

      const data = await response.json().catch(() => null)

      if (data?.balance) setBalance(data.balance)

      if (!response.ok) {
        if (data?.code === 'quota_exhausted') setQuotaOpen(true)
        throw new Error(data?.error || `Request failed with status ${response.status}`)
      }

      if (!data?.text) {
        throw new Error(t.chatPage.emptyReply)
      }

      setMessages((current) => [...current, createMessage('assistant', data.text)])
    } catch (err) {
      setError(err instanceof Error ? err.message : t.chatPage.requestFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const usageLabel = balance?.unlimited
    ? locale === 'zh' ? '团队版不限次数' : 'Unlimited team access'
    : locale === 'zh'
      ? `剩余 ${balance?.totalRemaining ?? '...'} 次`
      : `${balance?.totalRemaining ?? '...'} tasks left`

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-35" />
      <header className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-background/72 px-4 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BrandMark size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MarketSwitcher />
          <LanguageToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setMessages([])
              setError(null)
            }}
            className="text-muted-foreground hover:text-foreground"
            disabled={messages.length === 0 && !error}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <ScrollArea ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20">
                <Bot className="h-10 w-10 text-accent" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-foreground">{t.chatPage.title}</h2>
              <p className="mb-8 max-w-md text-muted-foreground">
                {t.chatPage.description}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {t.chatPage.prompts.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion)
                      textareaRef.current?.focus()
                    }}
                    className="rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex gap-4', message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={cn(
                        message.role === 'user'
                          ? 'bg-foreground text-background'
                          : 'bg-accent text-accent-foreground'
                      )}
                    >
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-4 py-3',
                      message.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'border border-border/50 bg-card/70 backdrop-blur-xl'
                    )}
                  >
                    <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg border border-border/50 bg-card/70 px-4 py-3 backdrop-blur-xl">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 flex gap-4">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-destructive/20 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">
                  {t.chatPage.errorPrefix} {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="relative z-10 shrink-0 border-t border-white/10 bg-background/72 p-4 backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="glass-panel relative flex items-end gap-2 rounded-lg border p-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatPage.placeholder}
              disabled={isLoading}
              className="max-h-[200px] min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <button
              type="button"
              onClick={() => setQuotaOpen(true)}
              className="mb-2 hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-foreground sm:flex"
            >
              {balance?.unlimited ? <Infinity className="h-3.5 w-3.5" /> : <Coins className="h-3.5 w-3.5" />}
              {usageLabel}
            </button>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 shrink-0 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <button type="button" onClick={() => setQuotaOpen(true)} className="mr-2 text-accent sm:hidden">
              {usageLabel}
            </button>
            {t.chatPage.disclaimer}
          </p>
        </form>
      </div>

      <Dialog open={quotaOpen} onOpenChange={setQuotaOpen}>
        <DialogContent className="border-white/10 bg-[#0b0910]/95 text-foreground backdrop-blur-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '添加 AI 任务次数' : 'Add AI task credits'}</DialogTitle>
            <DialogDescription>
              {locale === 'zh'
                ? '免费版每 24 小时提供 5 次。充值次数有效期为 12 个月，请求失败不会扣除。'
                : 'Free includes 5 tasks every 24 hours. Purchased tasks last 12 months, and failed requests are not charged.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            {taskPacks.map((pack) => (
              <Link
                key={pack.id}
                href={`/checkout?plan=seller&pack=${pack.id}`}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-accent/45 hover:bg-white/[0.08]"
              >
                <p className="text-2xl font-semibold">{pack.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pack.tasks} {locale === 'zh' ? '次任务' : 'AI tasks'}
                </p>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
            <span className="text-muted-foreground">
              {locale === 'zh' ? '当前设备编号' : 'Current device ID'}
            </span>
            <code className="text-xs text-foreground">{balance?.subjectId?.slice(0, 8) || '--------'}</code>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
