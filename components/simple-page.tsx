import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type SimplePageSection = {
  title: string;
  body: string;
};

type SimplePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: SimplePageSection[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function SimplePage({
  eyebrow,
  title,
  description,
  sections,
  ctaLabel = "开始使用",
  ctaHref = "/chat",
}: SimplePageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="ambient-grid absolute inset-0 opacity-60" />
      <header className="relative border-b border-white/10 bg-background/72 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">NexusAI</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="soft-reveal max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">
            {description}
          </p>
          <div className="mt-8">
            <Link href={ctaHref}>
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                {ctaLabel}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="surface-lift rounded-lg border border-border/50 bg-card/55 p-6 backdrop-blur-xl"
            >
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
