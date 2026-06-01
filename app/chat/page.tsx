'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Bot, Loader2, Send, Sparkles, Trash2, User } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  }
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || `请求失败，状态码 ${response.status}`)
      }

      if (!data?.text) {
        throw new Error('接口没有返回可显示的回复')
      }

      setMessages((current) => [...current, createMessage('assistant', data.text)])
    } catch (err) {
      setError(err instanceof Error ? err.message : '聊天请求失败，请稍后重试')
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

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">NexusAI</span>
          </div>
        </div>
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
      </header>

      <ScrollArea ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20">
                <Bot className="h-10 w-10 text-accent" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-foreground">欢迎使用 NexusAI</h2>
              <p className="mb-8 max-w-md text-muted-foreground">
                我是你的智能助手，可以帮你解答问题、创作内容、编写代码。有什么我可以帮你的吗？
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  '帮我写一封商务邮件',
                  '解释量子计算的原理',
                  '生成一个 React 组件',
                  '给我一个产品增长方案',
                ].map((suggestion) => (
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
                      'max-w-[85%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'border border-border/50 bg-card'
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
                  <div className="rounded-2xl border border-border/50 bg-card px-4 py-3">
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
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">出错了：{error}</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t border-border/50 bg-background/80 p-4 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-card p-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              disabled={isLoading}
              className="max-h-[200px] min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 shrink-0 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">由 DeepSeek AI 提供支持</p>
        </form>
      </div>
    </div>
  )
}
