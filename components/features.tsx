"use client";

import { Bot, Code2, FileText, Globe2, MessageSquare, Zap } from "lucide-react";

import { useLanguage } from "@/components/language-provider";

const icons = [Bot, Code2, FileText, Globe2, MessageSquare, Zap];

export function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {t.features.eyebrow}
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.features.title}
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {t.features.description}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((feature, index) => {
            const FeatureIcon = icons[index];

            return (
              <div
                key={feature.title}
                className="surface-lift group relative rounded-lg border border-border/50 bg-card/55 p-6 backdrop-blur-xl"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <FeatureIcon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
