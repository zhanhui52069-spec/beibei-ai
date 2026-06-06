"use client";

import Link from "next/link";
import { ArrowLeft, Check, CreditCard, LockKeyhole } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="ambient-grid absolute inset-0 opacity-45" />

      <header className="relative z-10 border-b border-white/10 bg-background/72 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.checkout.backHome}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.82fr]">
        <div>
          <p className="text-sm font-medium text-accent">{t.checkout.eyebrow}</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.checkout.title}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {t.checkout.description}
          </p>

          <div className="mt-10 space-y-4">
            <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h2 className="text-base font-medium text-foreground">{t.checkout.accountTitle}</h2>
              <div className="mt-4 space-y-2">
                <Label htmlFor="checkout-email">{t.checkout.emailLabel}</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder={t.checkout.emailPlaceholder}
                  className="border-white/10 bg-background/70"
                />
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-foreground">{t.checkout.paymentTitle}</h2>
                  <p className="text-sm text-muted-foreground">{t.checkout.cardHint}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Visa", "Mastercard", "Amex"].map((card) => (
                  <div key={card} className="rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                    {card}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-accent/30 bg-white/[0.055] p-6 shadow-[0_24px_80px_rgba(217,70,239,0.12)] backdrop-blur-xl">
          <p className="text-sm font-medium text-accent">{t.checkout.planTitle}</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{t.checkout.planName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.checkout.planNote}</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-semibold text-foreground">{t.checkout.planPrice}</span>
              <span className="text-muted-foreground">{t.checkout.planPeriod}</span>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-sm font-medium text-foreground">{t.checkout.includedTitle}</h3>
            <ul className="mt-4 space-y-3">
              {t.checkout.included.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button className="mt-8 w-full bg-foreground text-background hover:bg-foreground/90">
            <LockKeyhole className="mr-2 h-4 w-4" />
            {t.checkout.cta}
          </Button>

          <p className="mt-4 rounded-lg border border-white/10 bg-background/55 p-3 text-xs leading-5 text-muted-foreground">
            {t.checkout.testNotice}
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">{t.checkout.secureNote}</p>
        </aside>
      </section>
    </main>
  );
}
