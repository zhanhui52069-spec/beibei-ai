"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function CTA() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-white/8 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {t.cta.description}
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/chat">
            <Button size="lg" className="group w-full bg-foreground text-background hover:bg-foreground/90 sm:w-auto">
              {t.cta.primary}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-muted-foreground hover:bg-white/[0.04] hover:text-foreground sm:w-auto"
            >
              {t.cta.secondary}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
