"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/nyc-night-purple.svg')" }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl items-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="soft-reveal max-w-3xl">
          <p className="mb-5 text-sm font-medium text-fuchsia-100/80">{t.hero.badge}</p>
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
            {t.hero.titleTop}
            <span className="block text-fuchsia-200">{t.hero.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">
            {t.hero.description}
          </p>
          <div className="mt-9">
            <Link href="/chat">
              <Button size="lg" className="group bg-white text-black hover:bg-white/90">
                {t.hero.primary}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
