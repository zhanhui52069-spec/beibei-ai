import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            全新 AI 模型现已上线
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            构建未来的
            <span className="block text-accent">AI 驱动产品</span>
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            借助先进的 AI 技术，让你的工作效率提升 10 倍。智能对话、内容创作、代码生成，一站式解决方案。
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/chat">
              <Button
                size="lg"
                className="group w-full bg-foreground text-background hover:bg-foreground/90 sm:w-auto"
              >
                免费开始使用
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-border/50 bg-transparent text-foreground hover:bg-secondary sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4" />
              观看演示
            </Button>
          </div>

          <div className="mt-16">
            <p className="mb-6 text-sm text-muted-foreground">深受全球领先企业信赖</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-60">
              {["Vercel", "Stripe", "Notion", "Linear", "Supabase"].map((company) => (
                <span key={company} className="text-lg font-semibold text-foreground">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 rounded-2xl bg-accent/5 blur-3xl" />
            <div className="relative rounded-2xl border border-border/50 bg-card/50 p-2 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-sm text-muted-foreground">NexusAI 工作区</span>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-accent/20" />
                      <span className="text-sm font-medium text-foreground">智能对话</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-4/5 rounded bg-muted" />
                      <div className="h-3 w-3/5 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-accent/20" />
                      <span className="text-sm font-medium text-foreground">代码生成</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-3/4 rounded bg-accent/30" />
                      <div className="h-3 w-full rounded bg-accent/20" />
                      <div className="h-3 w-2/3 rounded bg-accent/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
