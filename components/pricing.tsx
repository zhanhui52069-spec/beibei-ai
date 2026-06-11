"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock3, Infinity, Sparkles } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

const packs = [
  { id: "starter", price: 7, tasks: 200 },
  { id: "growth", price: 15, tasks: 500 },
  { id: "scale", price: 29, tasks: 1200 },
] as const;

const copy = {
  en: {
    eyebrow: "Simple pricing",
    title: "Pay for the way your team sells",
    description: "Start with five free tasks a day, top up when you need more, or give your team unlimited everyday access.",
    popular: "Best for sellers",
    free: {
      name: "Free",
      description: "Explore real seller workflows before paying",
      price: "$0",
      period: "forever",
      features: ["5 AI tasks every 24 hours", "Listings, ads, and customer replies", "All markets and interface languages", "No credit card required"],
      cta: "Start free",
    },
    seller: {
      name: "Seller · Pay as you go",
      description: "One-time task packs for independent sellers",
      unit: "AI tasks",
      validity: "Valid for 12 months · packs stack automatically",
      features: ["Free daily tasks are used first", "Failed requests are never charged", "Oldest credits are used first", "No recurring subscription"],
      cta: "Choose this pack",
      from: "from about $0.024 per task",
    },
    team: {
      name: "Team",
      description: "For teams producing seller content every day",
      price: "$19",
      period: "/seat/mo",
      annual: "$190 per seat yearly · minimum 2 seats",
      features: ["Unlimited normal human use", "Unified billing and usage reporting", "Coming soon: members and shared prompts", "Coming soon: shared brand voices"],
      cta: "Apply for Team",
      note: "Fair-use limits apply. No account sharing, resale, or automated bulk requests.",
    },
  },
  zh: {
    eyebrow: "简单透明的价格",
    title: "按你的实际使用方式付费",
    description: "每天免费使用 5 次，个人卖家按需充值，团队获得日常工作不限次数使用权限。",
    popular: "个人卖家首选",
    free: {
      name: "Free 免费版",
      description: "付费前先体验真实卖家工作流",
      price: "$0",
      period: "永久免费",
      features: ["每 24 小时恢复 5 次", "商品 Listing、广告和客服回复", "支持全部市场和界面语言", "无需信用卡"],
      cta: "免费开始",
    },
    seller: {
      name: "Seller 个人充值",
      description: "为个人卖家准备的一次性任务包",
      unit: "次 AI 任务",
      validity: "12 个月有效 · 多次购买可累加",
      features: ["优先使用每日免费次数", "请求失败绝不扣次数", "优先使用最早到期额度", "没有自动续费"],
      cta: "选择此任务包",
      from: "最低约 $0.024 / 次",
    },
    team: {
      name: "Team 团队版",
      description: "适合每天持续产出内容的团队",
      price: "$19",
      period: "/人/月",
      annual: "$190 / 人 / 年 · 至少 2 人",
      features: ["正常人工使用不限次数", "统一账单和使用统计", "即将推出：成员与共享提示词", "即将推出：共享品牌语气"],
      cta: "申请团队版",
      note: "适用公平使用规则，不允许共享账号、转售或自动化批量请求。",
    },
  },
};

export function Pricing() {
  const { locale } = useLanguage();
  const text = copy[locale];
  const [selectedPack, setSelectedPack] = useState<(typeof packs)[number]>(packs[1]);

  return (
    <section id="pricing" className="border-t border-white/8 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-accent">{text.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-normal text-foreground sm:text-5xl">
            {text.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">{text.description}</p>
        </div>

        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">
          <article className="tech-card flex rounded-lg border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-2 hover:border-accent/45 hover:bg-white/[0.065]">
            <div className="flex w-full flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-accent"><Clock3 className="h-5 w-5" /></div>
              <h3 className="mt-5 text-lg font-medium text-foreground">{text.free.name}</h3>
              <p className="mt-1 min-h-12 text-sm leading-6 text-muted-foreground">{text.free.description}</p>
              <div className="mt-7"><span className="text-4xl font-semibold">{text.free.price}</span><span className="ml-2 text-sm text-muted-foreground">{text.free.period}</span></div>
              <FeatureList items={text.free.features} />
              <Button asChild className="mt-auto w-full bg-white/[0.06] text-foreground hover:bg-white/[0.12]"><Link href="/chat">{text.free.cta}</Link></Button>
            </div>
          </article>

          <article className="tech-card relative flex rounded-lg border border-accent/45 bg-white/[0.075] p-6 shadow-[0_24px_80px_rgba(217,70,239,0.14)] transition duration-300 hover:-translate-y-2 hover:border-accent/70">
            <span className="absolute right-5 top-5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">{text.popular}</span>
            <div className="flex w-full flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent"><Sparkles className="h-5 w-5" /></div>
              <h3 className="mt-5 text-lg font-medium text-foreground">{text.seller.name}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{text.seller.description}</p>
              <div className="mt-6 grid grid-cols-3 gap-2" role="group" aria-label="Task pack">
                {packs.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`min-w-0 rounded-lg border px-2 py-3 text-center transition ${selectedPack.id === pack.id ? "border-accent bg-accent/12 text-foreground" : "border-white/10 bg-black/10 text-muted-foreground hover:border-white/25"}`}
                  >
                    <span className="block text-lg font-semibold">${pack.price}</span>
                    <span className="mt-0.5 block text-xs">{pack.tasks}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5"><span className="text-4xl font-semibold">${selectedPack.price}</span><span className="ml-2 text-sm text-muted-foreground">/ {selectedPack.tasks} {text.seller.unit}</span></div>
              <p className="mt-2 text-xs text-accent">{text.seller.from}</p>
              <p className="mt-1 text-xs text-muted-foreground">{text.seller.validity}</p>
              <FeatureList items={text.seller.features} />
              <Button asChild className="mt-auto w-full bg-foreground text-background hover:bg-foreground/90"><Link href={`/checkout?plan=seller&pack=${selectedPack.id}`}>{text.seller.cta}</Link></Button>
            </div>
          </article>

          <article className="tech-card flex rounded-lg border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-2 hover:border-accent/45 hover:bg-white/[0.065]">
            <div className="flex w-full flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-accent"><Infinity className="h-5 w-5" /></div>
              <h3 className="mt-5 text-lg font-medium text-foreground">{text.team.name}</h3>
              <p className="mt-1 min-h-12 text-sm leading-6 text-muted-foreground">{text.team.description}</p>
              <div className="mt-7"><span className="text-4xl font-semibold">{text.team.price}</span><span className="text-sm text-muted-foreground">{text.team.period}</span></div>
              <p className="mt-2 text-xs text-accent">{text.team.annual}</p>
              <FeatureList items={text.team.features} />
              <p className="mb-5 text-xs leading-5 text-muted-foreground">{text.team.note}</p>
              <Button asChild className="mt-auto w-full bg-white/[0.06] text-foreground hover:bg-white/[0.12]"><Link href="/contact?topic=team">{text.team.cta}</Link></Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="my-7 space-y-3">
      {items.map((feature) => (
        <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          {feature}
        </li>
      ))}
    </ul>
  );
}
