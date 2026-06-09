"use client";

import { ChevronDown, MapPin } from "lucide-react";

import { markets, type Market, useMarket } from "@/components/market-provider";

export function MarketSwitcher() {
  const { market, setMarket } = useMarket();
  const current = markets.find((item) => item.id === market) || markets[0];

  return (
    <label className="group relative inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition hover:border-[color:var(--market-primary-soft)] hover:text-foreground">
      <MapPin className="h-3.5 w-3.5 text-[color:var(--market-primary)]" />
      <span className="hidden lg:inline">{current.label}</span>
      <span className="lg:hidden">{current.shortLabel}</span>
      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      <select
        value={market}
        onChange={(event) => setMarket(event.target.value as Market)}
        aria-label="Target market"
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {markets.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
