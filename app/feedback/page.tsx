"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox, Send } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackPage() {
  const { locale, t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(t.feedback.roles[0]);
  const [category, setCategory] = useState(t.feedback.categories[0]);
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    setRole(t.feedback.roles[0]);
    setCategory(t.feedback.categories[0]);
  }, [locale, t.feedback.categories, t.feedback.roles]);

  const statusText =
    submitState === "sent"
      ? locale === "zh"
        ? "已收到你的反馈，可在后台意见箱查看。"
        : "Feedback received. You can view it in the admin inbox."
      : submitState === "sending"
        ? locale === "zh"
          ? "正在提交，请稍等。"
          : "Sending. Please wait."
        : locale === "zh"
          ? "提交后页面会保持不变，反馈会进入后台意见箱。"
          : "After sending, this page stays open and your feedback goes to the admin inbox.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="ambient-grid absolute inset-0 opacity-45" />

      <header className="relative z-10 border-b border-white/10 bg-background/72 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.page.backHome}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="soft-reveal">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-accent">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-accent">{t.pages.feedback.eyebrow}</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t.pages.feedback.title}
            </h1>
            <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {t.pages.feedback.description}
            </p>
            <p className="mt-6 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-muted-foreground">
              {t.feedback.note}
            </p>
          </div>

          <form
            action="/api/feedback-form"
            method="post"
            target="feedback-submit-frame"
            onSubmit={() => setSubmitState("sending")}
            className="glass-panel soft-reveal rounded-lg border p-5 sm:p-6"
          >
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="feedback-name">{t.feedback.name}</Label>
                <Input
                  id="feedback-name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t.feedback.namePlaceholder}
                  className="border-white/10 bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-email">{t.feedback.email}</Label>
                <Input
                  id="feedback-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t.feedback.emailPlaceholder}
                  className="border-white/10 bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-role">{t.feedback.role}</Label>
                <select
                  id="feedback-role"
                  name="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="h-10 w-full rounded-md border border-white/10 bg-background/70 px-3 text-sm text-foreground"
                >
                  {t.feedback.roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-category">{t.feedback.category}</Label>
                <select
                  id="feedback-category"
                  name="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-10 w-full rounded-md border border-white/10 bg-background/70 px-3 text-sm text-foreground"
                >
                  {t.feedback.categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="feedback-message">{t.feedback.message}</Label>
              <Textarea
                id="feedback-message"
                name="message"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (submitState === "sent") setSubmitState("idle");
                }}
                placeholder={t.feedback.messagePlaceholder}
                required
                className="min-h-40 border-white/10 bg-background/70"
              />
            </div>

            <Button type="submit" className="mt-5 w-full bg-foreground text-background hover:bg-foreground/90">
              <Send className="mr-2 h-4 w-4" />
              {submitState === "sending" ? (locale === "zh" ? "提交中..." : "Sending...") : t.feedback.submit}
            </Button>

            <p
              className={`mt-3 rounded-lg border p-3 text-center text-sm ${
                submitState === "sent"
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                  : "border-white/10 bg-white/[0.035] text-muted-foreground"
              }`}
            >
              {statusText}
            </p>

            <iframe
              name="feedback-submit-frame"
              title="Feedback submit"
              className="hidden"
              onLoad={() => {
                if (submitState === "sending") {
                  setSubmitState("sent");
                }
              }}
            />
          </form>
        </div>
      </section>
    </main>
  );
}
