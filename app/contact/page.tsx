"use client";

import { SimplePage } from "@/components/simple-page";
import { useLanguage } from "@/components/language-provider";

export default function ContactPage() {
  const { t } = useLanguage();
  const page = t.pages.contact;

  return (
    <SimplePage
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      ctaLabel={page.ctaLabel}
      ctaHref="/chat"
      sections={page.sections}
    />
  );
}
