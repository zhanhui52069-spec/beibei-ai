"use client";

import { SimplePage } from "@/components/simple-page";
import { useLanguage } from "@/components/language-provider";

export default function DocsPage() {
  const { t } = useLanguage();
  const page = t.pages.docs;

  return (
    <SimplePage
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      sections={page.sections}
    />
  );
}
