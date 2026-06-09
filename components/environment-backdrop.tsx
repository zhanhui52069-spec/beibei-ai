"use client";

import { useMarket } from "@/components/market-provider";

export function EnvironmentBackdrop() {
  const { market } = useMarket();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        className="market-motif absolute right-[-10%] top-10 h-[78vh] w-[78vw] max-w-6xl text-[color:var(--market-line)] opacity-[0.13] transition-all duration-700"
        viewBox="0 0 900 640"
        fill="none"
      >
        {market === "china" && <ChinaMotif />}
        {market === "usa" && <UsaMotif />}
        {market === "europe" && <EuropeMotif />}
      </svg>
      <div className="environment-aura absolute inset-0 transition-opacity duration-700" />
    </div>
  );
}

function ChinaMotif() {
  return (
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M72 452c76-74 126-92 184-56 34 21 72 22 118-15 62-50 128-42 190 18 56 54 118 62 206 7" />
      <path d="M84 506c76-58 145-70 210-38 50 25 104 24 158-4 87-45 166-31 250 44" />
      <path d="M130 310c60-25 118-25 174 0 56 25 114 25 174 0 60-25 118-25 174 0" />
      <path d="M166 256c34-22 68-22 102 0 34 22 68 22 102 0 34-22 68-22 102 0" />
      <path d="M684 176c18 48-5 95-54 112 52 13 82 58 72 108" />
      <path d="M714 172c33 63 15 122-54 176" />
      <path d="M536 154c22 48 20 94-6 138" />
      <path d="M506 194c40-10 72-2 96 24" />
    </g>
  );
}

function UsaMotif() {
  return (
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M78 478h760" />
      <path d="M122 478V304h62v174" />
      <path d="M210 478V236h78v242" />
      <path d="M320 478V162h54v316" />
      <path d="M398 478V272h96v206" />
      <path d="M526 478V208h76v270" />
      <path d="M632 478V124h84v354" />
      <path d="M746 478V286h58v192" />
      <path d="M118 338h64M214 278h70M402 316h88M532 250h66M638 168h72M750 322h50" />
      <path d="M94 540c92-44 172-44 240 0s148 44 240 0 172-44 240 0" />
    </g>
  );
}

function EuropeMotif() {
  return (
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M96 492h720" />
      <path d="M156 492V310l76-72 76 72v182" />
      <path d="M186 492V350h92v142" />
      <path d="M380 492V248l88-86 88 86v244" />
      <path d="M420 492V312c0-40 96-40 96 0v180" />
      <path d="M628 492V286l70-66 70 66v206" />
      <path d="M660 492V340h76v152" />
      <path d="M382 248h174M156 310h152M628 286h140" />
      <path d="M468 162V92M444 116h48" />
      <path d="M230 238v-58M206 204h48" />
      <path d="M698 220v-58M674 186h48" />
    </g>
  );
}
