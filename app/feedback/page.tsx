"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox, Loader2, Send } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setRole(t.feedback.roles[0]);
    setCategory(t.feedback.categories[0]);
  }, [locale, t.feedback.categories, t.feedback.roles]);

  const submitFeedback = async () => {
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, category, message, locale }),
      });

      if (!response.ok) {
        throw new Error("Feedback request failed");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitFeedback();
  };

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

          <form onSubmit={handleSubmit} className="glass-panel soft-reveal rounded-lg border p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="feedback-name">{t.feedback.name}</Label>
                <Input
                  id="feedback-name"
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
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t.feedback.messagePlaceholder}
                required
                className="min-h-40 border-white/10 bg-background/70"
              />
            </div>

            {status === "success" && (
              <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-200">
                {t.feedback.success}
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-200">
                {t.feedback.error}
              </p>
            )}

            <Button
              type="button"
              onClick={() => void submitFeedback()}
              disabled={isSubmitting || !message.trim()}
              className="mt-5 w-full bg-foreground text-background hover:bg-foreground/90"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isSubmitting ? t.feedback.submitting : t.feedback.submit}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
