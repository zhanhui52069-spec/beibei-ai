"use client";

import { Headphones, Megaphone, ShoppingBag } from "lucide-react";

import { useLanguage } from "@/components/language-provider";

const icons = [ShoppingBag, Megaphone, Headphones];

export function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="relative border-t border-white/8 py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium text-accent">{t.features.eyebrow}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t.features.title}
            </h2>
            <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {t.features.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {t.features.items.slice(0, 3).map((feature, index) => {
              const FeatureIcon = icons[index];

              return (
                <div key={feature.title} className="group tech-card rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-200/14 bg-fuchsia-200/[0.06] text-accent transition duration-300 group-hover:scale-110 group-hover:border-fuchsia-200/40">
                    <FeatureIcon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-medium text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
