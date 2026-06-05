"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();
  const footerLinks = {
    [t.footer.product]: [
      { name: t.footer.links.features, href: "/#features" },
      { name: t.footer.links.pricing, href: "/#pricing" },
      { name: t.footer.links.docs, href: "/docs" },
      { name: t.footer.links.chat, href: "/chat" },
    ],
    [t.footer.company]: [
      { name: t.footer.links.about, href: "/about" },
      { name: t.footer.links.blog, href: "/blog" },
      { name: t.footer.links.contact, href: "/contact" },
      { name: t.footer.links.demo, href: "/contact" },
    ],
    [t.footer.resources]: [
      { name: t.footer.links.help, href: "/docs" },
      { name: t.footer.links.developerDocs, href: "/docs" },
      { name: t.footer.links.cases, href: "/blog" },
      { name: t.footer.links.partners, href: "/contact" },
    ],
    [t.footer.legal]: [
      { name: t.footer.links.terms, href: "/terms" },
      { name: t.footer.links.privacy, href: "/privacy" },
      { name: t.footer.links.cookies, href: "/privacy" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NexusAI</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h3 className="text-sm font-semibold text-foreground">{group}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NexusAI. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
