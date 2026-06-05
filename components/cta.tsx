import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel sheen relative overflow-hidden rounded-lg border">
          <div className="ambient-grid absolute inset-0 opacity-40" />

          <div className="relative px-6 py-16 sm:px-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                准备好开启 AI 之旅了吗？
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                立即开始使用，体验智能对话、内容创作和代码生成能力。
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="group w-full bg-foreground text-background hover:bg-foreground/90 sm:w-auto"
                  >
                    免费开始使用
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-border/50 bg-transparent text-foreground hover:bg-secondary sm:w-auto"
                  >
                    预约演示
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
