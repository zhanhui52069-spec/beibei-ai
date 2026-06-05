"use client";

import Link from "next/link";
import { ArrowRight, Bot, Code2, FileText, Play, Sparkle } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

const chartBars = [42, 64, 50, 76, 58, 88, 72, 96];

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="ambient-grid absolute inset-0 -z-10" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="soft-reveal">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t.hero.badge}
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t.hero.titleTop}
            <span className="block bg-gradient-to-b from-white via-accent to-emerald-200 bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t.hero.description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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

          <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            {t.hero.metrics.map((metric) => (
              <div
                key={metric}
                className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-muted-foreground backdrop-blur-xl"
              >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                {metric}
              </div>
            ))}
          </div>
        </div>

        <div className="soft-reveal [animation-delay:160ms]">
          <div className="glass-panel sheen relative rounded-lg border p-2">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-sm text-muted-foreground">{t.hero.workspace}</span>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                {t.hero.signal}
              </span>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="rounded-lg border border-border/45 bg-background/42 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkle className="h-4 w-4 text-accent" />
                    {t.hero.command}
                  </div>
                  <div className="rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm leading-6 text-foreground">
                    {t.hero.answer}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Bot, label: t.hero.chat, color: "text-accent bg-accent/12" },
                    { icon: Code2, label: t.hero.code, color: "text-cyan-200 bg-cyan-300/12" },
                    { icon: FileText, label: t.hero.content, color: "text-emerald-200 bg-emerald-300/12" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="surface-lift rounded-lg border border-border/45 bg-secondary/36 p-4"
                      >
                        <div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${item.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-border/45 bg-background/42 p-4">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.hero.chartTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.hero.chartLabel}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
                </div>

                <div className="flex h-40 items-end gap-2">
                  {chartBars.map((height, index) => (
                    <div key={height + index} className="flex flex-1 items-end">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-accent/35 via-cyan-300/70 to-emerald-200"
                        style={{
                          height: `${height}%`,
                          animation: `bar-rise 900ms ${index * 80}ms ease both`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  <div className="h-2 w-full rounded bg-white/8" />
                  <div className="h-2 w-4/5 rounded bg-white/8" />
                  <div className="h-2 w-2/3 rounded bg-white/8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
