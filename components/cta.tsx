"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
        <div className="mt-9 flex justify-center">
          <Link href="/chat">
            <Button size="lg" className="group w-full bg-foreground text-background hover:bg-foreground/90 sm:w-auto">
              {t.cta.primary}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
