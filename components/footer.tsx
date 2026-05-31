import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  产品: [
    { name: "功能介绍", href: "#features" },
    { name: "价格方案", href: "#pricing" },
    { name: "API 文档", href: "#" },
    { name: "更新日志", href: "#" },
  ],
  公司: [
    { name: "关于我们", href: "#" },
    { name: "博客", href: "#" },
    { name: "加入我们", href: "#" },
    { name: "联系我们", href: "#" },
  ],
  资源: [
    { name: "帮助中心", href: "#" },
    { name: "开发者文档", href: "#" },
    { name: "社区论坛", href: "#" },
    { name: "合作伙伴", href: "#" },
  ],
  法律: [
    { name: "服务条款", href: "#" },
    { name: "隐私政策", href: "#" },
    { name: "Cookie 政策", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NexusAI</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              借助先进的 AI 技术，让您的工作效率提升 10 倍。
            </p>
          </div>

          {/* Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 xl:justify-end">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">产品</h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.产品.map((link) => (
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
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">公司</h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.公司.map((link) => (
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
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">资源</h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.资源.map((link) => (
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
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">法律</h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.法律.map((link) => (
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
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border/50 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NexusAI. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
}
