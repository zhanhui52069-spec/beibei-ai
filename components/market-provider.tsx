"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Market = "china" | "japan" | "usa" | "europe";

type MarketContextValue = {
  market: Market;
  setMarket: (market: Market) => void;
};

const MarketContext = createContext<MarketContextValue | null>(null);

export const markets: Array<{ id: Market; label: string; shortLabel: string }> = [
  { id: "china", label: "China", shortLabel: "CN" },
  { id: "japan", label: "Japan", shortLabel: "JP" },
  { id: "usa", label: "United States", shortLabel: "US" },
  { id: "europe", label: "Europe", shortLabel: "EU" },
];

function isMarket(value: string | null): value is Market {
  return value === "china" || value === "japan" || value === "usa" || value === "europe";
}

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarketState] = useState<Market>("usa");

  useEffect(() => {
    const savedMarket = window.localStorage.getItem("nexusai_market");

    if (isMarket(savedMarket)) {
      setMarketState(savedMarket);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.market = market;
    window.localStorage.setItem("nexusai_market", market);
    window.dispatchEvent(new CustomEvent("nexusai-market-change", { detail: market }));
  }, [market]);

  const value = useMemo(
    () => ({
      market,
      setMarket: setMarketState,
    }),
    [market],
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  const context = useContext(MarketContext);

  if (!context) {
    throw new Error("useMarket must be used inside MarketProvider");
  }

  return context;
}
