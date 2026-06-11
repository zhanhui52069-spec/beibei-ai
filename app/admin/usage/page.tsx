"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Coins, Infinity, Loader2, Search } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Balance = {
  subjectId: string;
  plan: "free" | "seller" | "team";
  unlimited: boolean;
  freeRemaining: number;
  creditRemaining: number;
  totalRemaining: number;
  nextResetAt: string;
  metering: boolean;
};

export default function UsageAdminPage() {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const [password, setPassword] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("200");
  const [note, setNote] = useState("");
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPassword(window.sessionStorage.getItem("nexusai_admin_password") || "");
  }, []);

  const request = async (options?: { action?: "credits" | "team"; active?: boolean }) => {
    if (!password || !subjectId.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const isMutation = Boolean(options?.action);
      const response = await fetch(
        isMutation ? "/api/admin/usage" : `/api/admin/usage?subjectId=${encodeURIComponent(subjectId.trim())}`,
        {
          method: isMutation ? "POST" : "GET",
          headers: { "Content-Type": "application/json", "x-admin-password": password },
          body: isMutation
            ? JSON.stringify(options?.action === "team"
              ? { action: "team", subjectId: subjectId.trim(), active: options.active, email: email.trim() }
              : { action: "credits", subjectId: subjectId.trim(), amount: Number(amount), eventType: Number(amount) < 0 ? "refund" : "purchase", note, email: email.trim() })
            : undefined,
          cache: "no-store",
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Request failed");
      window.sessionStorage.setItem("nexusai_admin_password", password);
      setBalance(data.balance);
      if (isMutation) setMessage(zh ? "账户已更新" : "Account updated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const search = (event: FormEvent) => { event.preventDefault(); void request(); };

  return (
    <main className="min-h-screen bg-[#07050a] text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <BrandMark size="sm" />
        <div className="flex items-center gap-2"><LanguageToggle /><Button asChild variant="ghost"><Link href="/admin"><ArrowLeft className="h-4 w-4" />{zh ? "意见后台" : "Feedback admin"}</Link></Button></div>
      </header>
      <section className="mx-auto max-w-5xl px-5 pb-20 pt-8">
        <p className="text-sm text-accent">Usage ledger</p>
        <h1 className="mt-3 text-4xl font-semibold">{zh ? "AI 额度管理" : "AI credit management"}</h1>
        <p className="mt-3 max-w-2xl text-white/60">{zh ? "通过购买登记中的完整设备编号查询账户，添加充值次数、处理退款或开通团队权限。" : "Use the full device ID from a purchase request to add credits, process refunds, or enable Team access."}</p>

        <form onSubmit={search} className="mt-9 grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[0.8fr_1.2fr_auto]">
          <div><Label htmlFor="admin-password">{zh ? "后台密码" : "Admin password"}</Label><Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 border-white/10 bg-black/20" /></div>
          <div><Label htmlFor="subject-id">{zh ? "完整设备编号" : "Full device ID"}</Label><Input id="subject-id" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="mt-2 border-white/10 bg-black/20" /></div>
          <Button type="submit" disabled={loading || !password || !subjectId.trim()} className="self-end bg-white text-black hover:bg-white/90">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{zh ? "查询" : "Find"}</Button>
        </form>

        {balance && (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Metric icon={<Coins className="h-5 w-5" />} label={zh ? "充值余额" : "Purchased credits"} value={String(balance.creditRemaining)} />
            <Metric icon={<Check className="h-5 w-5" />} label={zh ? "免费余额" : "Free tasks"} value={String(balance.freeRemaining)} />
            <Metric icon={<Infinity className="h-5 w-5" />} label={zh ? "账户方案" : "Account plan"} value={balance.unlimited ? "Team" : balance.plan} />
          </div>
        )}

        <div className="mt-5 grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:grid-cols-2">
          <div className="space-y-4">
            <div><Label htmlFor="credit-email">Email</Label><Input id="credit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 border-white/10 bg-black/20" /></div>
            <div><Label htmlFor="credit-amount">{zh ? "次数，退款填负数" : "Credits, use a negative number for refunds"}</Label><Input id="credit-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2 border-white/10 bg-black/20" /></div>
            <div><Label htmlFor="credit-note">{zh ? "备注" : "Note"}</Label><Input id="credit-note" value={note} onChange={(e) => setNote(e.target.value)} className="mt-2 border-white/10 bg-black/20" /></div>
            <Button type="button" onClick={() => void request({ action: "credits" })} disabled={loading || !subjectId.trim()} className="bg-white text-black hover:bg-white/90">{zh ? "更新充值次数" : "Update credits"}</Button>
          </div>
          <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-black/15 p-5">
            <div><h2 className="text-lg font-medium">Team</h2><p className="mt-2 text-sm leading-6 text-white/55">{zh ? "团队版在公平使用规则下不显示剩余次数。正式收款前，请先确认至少 2 个席位。" : "Team accounts do not show a remaining balance under fair use. Confirm at least two seats before activation."}</p></div>
            <div className="mt-6 flex gap-2"><Button type="button" onClick={() => void request({ action: "team", active: true })} disabled={loading || !subjectId.trim()}>{zh ? "开通团队版" : "Enable Team"}</Button><Button type="button" variant="outline" onClick={() => void request({ action: "team", active: false })} disabled={loading || !subjectId.trim()}>{zh ? "关闭" : "Disable"}</Button></div>
          </div>
        </div>
        {message && <p className="mt-4 text-sm text-accent">{message}</p>}
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5"><div className="text-accent">{icon}</div><p className="mt-4 text-sm text-white/55">{label}</p><p className="mt-1 text-2xl font-semibold capitalize">{value}</p></div>;
}
