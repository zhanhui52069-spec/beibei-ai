"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="border-t border-white/8 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-accent">{t.pricing.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {t.pricing.description}
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {t.pricing.plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group tech-card relative rounded-lg border p-6 transition duration-300 hover:-translate-y-2 hover:border-accent/55 hover:bg-white/[0.085] hover:shadow-[0_24px_80px_rgba(217,70,239,0.18)] ${
                index === 1 ? "border-accent/40 bg-white/[0.07]" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/0 to-transparent transition duration-300 group-hover:via-fuchsia-200/70" />
              <div className="flex min-h-10 items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                </div>
                {index === 1 && (
                  <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                    {t.pricing.popular}
                  </span>
                )}
              </div>

              <div className="mt-8">
                <span className="text-4xl font-semibold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={index === 0 ? "/register" : index === 1 ? "/checkout?plan=pro" : "/contact"}
                className="mt-8 block"
              >
                <Button
                  className={`w-full ${
                    index === 1
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-white/[0.06] text-foreground hover:bg-white/[0.12]"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
