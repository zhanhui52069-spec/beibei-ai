"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <div className="market-hero-backdrop absolute inset-0" />
      <div className="china-hero-mist absolute inset-[-5%]" />
      <div className="china-hero-gold absolute inset-0" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="tech-scan absolute inset-0 opacity-70" />
      <div className="neon-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl items-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="soft-reveal max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/24 px-3 py-1 text-sm font-medium text-white/86 shadow-[0_0_34px_var(--market-glow-a)] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--market-primary)] shadow-[0_0_16px_var(--market-primary)]" />
            {t.hero.badge}
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
            {t.hero.titleTop}
            <span className="text-glow block text-[color:var(--market-primary)]">{t.hero.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">
            {t.hero.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/chat">
              <Button size="lg" className="group glow-button bg-white text-black hover:bg-white/90">
                {t.hero.primary}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="hidden items-center gap-3 rounded-lg border border-white/10 bg-black/28 px-4 py-3 text-xs text-white/68 backdrop-blur-xl sm:flex">
              {t.hero.metrics.map((metric) => (
                <span key={metric} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[color:var(--market-primary)]" />
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
