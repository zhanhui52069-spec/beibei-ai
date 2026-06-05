"use client";

import Link from "next/link";
import { ArrowRight, Bot, Code2, FileText, Play } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      <div className="ambient-grid absolute inset-0 -z-10" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="soft-reveal mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t.hero.badge}
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t.hero.titleTop}
            <span className="block bg-gradient-to-b from-white via-accent to-cyan-300 bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t.hero.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/chat">
              <Button
                size="lg"
                className="group w-full bg-foreground text-background shadow-[0_0_28px_rgba(78,151,255,0.22)] hover:bg-foreground/90 sm:w-auto"
              >
                {t.hero.primary}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-border/50 bg-transparent text-foreground hover:bg-secondary sm:w-auto"
              >
                <Play className="mr-2 h-4 w-4" />
                {t.hero.secondary}
              </Button>
            </Link>
          </div>

          <div className="mt-16">
            <p className="mb-6 text-sm text-muted-foreground">{t.hero.trusted}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-60">
              {["Vercel", "Stripe", "Notion", "Linear", "Supabase"].map((company) => (
                <span key={company} className="text-lg font-semibold text-foreground">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="soft-reveal mt-20 [animation-delay:160ms]">
          <div className="relative mx-auto max-w-5xl">
            <div className="glass-panel sheen relative rounded-lg border p-2">
              <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-sm text-muted-foreground">{t.hero.workspace}</span>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="surface-lift rounded-lg border border-border/40 bg-secondary/45 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                        <Bot className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{t.hero.chat}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-4/5 rounded bg-muted" />
                      <div className="h-3 w-3/5 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="surface-lift rounded-lg border border-border/40 bg-secondary/45 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{t.hero.code}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-3/4 rounded bg-accent/30" />
                      <div className="h-3 w-full rounded bg-accent/20" />
                      <div className="h-3 w-2/3 rounded bg-accent/30" />
                    </div>
                  </div>
                  <div className="surface-lift rounded-lg border border-border/40 bg-secondary/45 p-4 md:translate-y-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{t.hero.content}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-5/6 rounded bg-emerald-300/25" />
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-2/3 rounded bg-emerald-300/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
