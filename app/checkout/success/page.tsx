"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const { locale } = useLanguage();
  const zh = locale === "zh";

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-5"><BrandMark size="sm" /><LanguageToggle /></header>
      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-300"><CheckCircle2 className="h-8 w-8" /></div>
        <h1 className="mt-6 text-3xl font-semibold">{zh ? "付款已完成" : "Payment complete"}</h1>
        <p className="mt-4 leading-7 text-muted-foreground">{zh ? "Stripe 正在确认订单并添加任务次数，通常几秒内完成。返回聊天页即可查看最新余额。" : "Stripe is confirming the order and adding your AI tasks. This usually finishes within a few seconds."}</p>
        <Button asChild className="mt-8 bg-foreground text-background hover:bg-foreground/90"><Link href="/chat">{zh ? "返回聊天" : "Return to chat"}</Link></Button>
      </section>
    </main>
  );
}
