"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock3, Loader2, LockKeyhole } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const packs = [
  { id: "starter", price: 7, tasks: 200 },
  { id: "growth", price: 15, tasks: 500 },
  { id: "scale", price: 29, tasks: 1200 },
] as const;

export default function CheckoutPage() {
  const { locale } = useLanguage();
  const [selected, setSelected] = useState<(typeof packs)[number]>(packs[1]);
  const [email, setEmail] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [paymentEnabled, setPaymentEnabled] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "cancelled" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const requestedPack = new URLSearchParams(window.location.search).get("pack");
    const cancelled = new URLSearchParams(window.location.search).get("cancelled");
    const match = packs.find((pack) => pack.id === requestedPack);
    if (match) setSelected(match);
    if (cancelled === "1") setStatus("cancelled");

    void fetch("/api/checkout", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setPaymentEnabled(Boolean(data.enabled)))
      .catch(() => setPaymentEnabled(false));

    void fetch("/api/usage", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setSubjectId(data.balance?.subjectId || ""))
      .catch(() => setSubjectId(""));

    const savedUser = window.localStorage.getItem("nexusai_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.email) setEmail(user.email);
      } catch {
        // Ignore invalid legacy local account data.
      }
    }
  }, []);

  const submitRequest = async () => {
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          packId: selected.id,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.url) throw new Error(data?.error || "Could not start secure checkout.");
      window.location.assign(data.url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not start secure checkout.");
      setStatus("error");
      setIsSubmitting(false);
    }
  };

  const zh = locale === "zh";

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="ambient-grid absolute inset-0 opacity-45" />
      <header className="relative z-10 border-b border-white/10 bg-background/72 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/"><BrandMark size="sm" /></Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/#pricing"><ArrowLeft className="mr-2 h-4 w-4" />{zh ? "返回价格" : "Back to pricing"}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.82fr]">
        <div>
          <p className="text-sm font-medium text-accent">Seller · Pay as you go</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            {zh ? "按需购买 AI 任务次数" : "Buy AI tasks when you need them"}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {zh ? "没有订阅，没有自动续费。任务包有效期为 12 个月，失败请求不会扣除次数。" : "No subscription and no automatic renewal. Packs last 12 months, and failed requests never use a task."}
          </p>

          <div className="mt-9 grid grid-cols-3 gap-3">
            {packs.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => { setSelected(pack); setStatus("idle"); setErrorMessage(""); }}
                className={`rounded-lg border p-4 text-left transition hover:-translate-y-1 ${selected.id === pack.id ? "border-accent bg-accent/12" : "border-white/10 bg-white/[0.035] hover:border-white/25"}`}
              >
                <span className="block text-2xl font-semibold text-foreground">${pack.price}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{pack.tasks} {zh ? "次" : "tasks"}</span>
              </button>
            ))}
          </div>

          <section className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <Label htmlFor="checkout-email">{zh ? "接收开通通知的邮箱" : "Email for activation notice"}</Label>
            <Input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setStatus("idle"); setErrorMessage(""); }}
              placeholder="you@company.com"
              className="mt-3 border-white/10 bg-background/70"
            />
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{zh ? "设备编号" : "Device ID"}</span>
              <code>{subjectId ? subjectId.slice(0, 8) : "--------"}</code>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-accent/30 bg-white/[0.055] p-6 shadow-[0_24px_80px_rgba(217,70,239,0.12)] backdrop-blur-xl">
          <p className="text-sm font-medium text-accent">{zh ? "所选任务包" : "Selected task pack"}</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div><h2 className="text-2xl font-semibold">Seller</h2><p className="mt-1 text-sm text-muted-foreground">{selected.tasks} AI tasks</p></div>
            <span className="text-4xl font-semibold">${selected.price}</span>
          </div>
          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
            {[zh ? "12 个月有效" : "Valid for 12 months", zh ? "可与以后购买的任务包累加" : "Stacks with future purchases", zh ? "优先使用每日免费次数" : "Daily free tasks are used first", zh ? "失败请求不扣次数" : "Failed requests are not charged"].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground"><Check className="h-4 w-4 shrink-0 text-accent" />{item}</li>
            ))}
          </ul>

          <Button onClick={submitRequest} disabled={!email.trim() || isSubmitting || paymentEnabled !== true} className="mt-8 w-full bg-foreground text-background hover:bg-foreground/90">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
            {isSubmitting ? (zh ? "正在打开安全付款" : "Opening secure checkout") : (zh ? `使用 Stripe 支付 $${selected.price}` : `Pay $${selected.price} with Stripe`)}
          </Button>

          {paymentEnabled === false && <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">{zh ? "Stripe 商户密钥尚未配置，付款按钮暂时关闭。" : "Stripe merchant keys are not configured yet, so payments are temporarily disabled."}</p>}
          {status === "cancelled" && <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-muted-foreground">{zh ? "付款已取消，没有产生扣款。" : "Checkout was cancelled. You were not charged."}</p>}
          {status === "error" && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{errorMessage || (zh ? "无法打开付款页面，请稍后重试。" : "Could not open checkout. Please try again.")}</p>}

          <p className="mt-4 flex gap-2 text-xs leading-5 text-muted-foreground"><Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />{zh ? "银行卡信息由 Stripe 安全处理。付款确认后，任务次数会自动添加到当前设备。" : "Card details are handled securely by Stripe. Credits are added automatically after payment confirmation."}</p>
        </aside>
      </section>
    </main>
  );
}
