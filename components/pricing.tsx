import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "/月",
    description: "适合个人用户体验 AI 能力",
    features: [
      "每日 20 次对话",
      "基础模型访问",
      "标准响应速度",
      "社区支持",
    ],
    cta: "免费开始",
    popular: false,
  },
  {
    name: "专业版",
    price: "¥99",
    period: "/月",
    description: "适合专业人士和小团队",
    features: [
      "无限对话次数",
      "所有模型访问",
      "优先响应速度",
      "代码生成功能",
      "图像生成功能",
      "邮件支持",
    ],
    cta: "立即订阅",
    popular: true,
  },
  {
    name: "企业版",
    price: "定制",
    period: "",
    description: "适合大型企业和定制需求",
    features: [
      "专业版全部功能",
      "私有化部署",
      "自定义模型训练",
      "API 高级访问",
      "专属客户经理",
      "7x24 小时支持",
    ],
    cta: "联系销售",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            价格方案
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            选择适合您的方案
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            灵活的定价策略，满足不同规模的需求
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-accent bg-card shadow-lg shadow-accent/10"
                  : "border-border/50 bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.name === "企业版" ? "#" : "/chat"}>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
