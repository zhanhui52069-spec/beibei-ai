"use client";

import { Globe2 } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();
  const nextLocale = locale === "en" ? "zh" : "en";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setLocale(nextLocale)}
      className="gap-2 text-muted-foreground hover:text-foreground"
      aria-label={t.nav.language}
    >
      <Globe2 className="h-4 w-4" />
      <span className="text-xs font-medium">{locale === "en" ? "EN" : "ZH"}</span>
    </Button>
  );
}
