"use client";

import Link from "next/link";
import { ArrowRight, Bot, Send } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="soft-reveal mx-auto mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-muted-foreground">
          {t.hero.badge}
        </div>

        <h1 className="soft-reveal text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
          {t.hero.titleTop}
          <span className="block text-accent">{t.hero.titleAccent}</span>
        </h1>

        <p className="soft-reveal mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
          {t.hero.description}
        </p>

        <div className="soft-reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/chat">
            <Button size="lg" className="group w-full bg-foreground text-background hover:bg-foreground/90 sm:w-auto">
              {t.hero.primary}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-muted-foreground hover:bg-white/[0.04] hover:text-foreground sm:w-auto"
            >
              {t.hero.secondary}
            </Button>
          </Link>
        </div>
      </div>

      <div className="soft-reveal mx-auto mt-16 max-w-3xl [animation-delay:120ms]">
        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-2 shadow-[0_32px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="rounded-md border border-white/8 bg-background/78">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4 text-accent" />
                {t.hero.workspace}
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-300" />
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              <div className="ml-auto max-w-[82%] rounded-lg bg-foreground px-4 py-3 text-left text-sm leading-6 text-background">
                {t.hero.command}
              </div>
              <div className="max-w-[88%] rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 text-left text-sm leading-6 text-foreground">
                {t.hero.answer}
              </div>
            </div>

            <div className="border-t border-white/8 p-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
                <span className="flex-1 text-left text-sm text-muted-foreground">{t.hero.signal}</span>
                <Send className="h-4 w-4 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
