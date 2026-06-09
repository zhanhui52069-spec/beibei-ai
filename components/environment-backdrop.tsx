"use client";

import { useMarket } from "@/components/market-provider";

export function EnvironmentBackdrop() {
  const { market } = useMarket();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        className="landmark-scene absolute inset-x-0 bottom-[-2%] h-[58vh] w-full text-[color:var(--market-line)] transition-all duration-700"
        viewBox="0 0 1440 620"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        {market === "china" && <ChinaScene />}
        {market === "usa" && <UsaScene />}
        {market === "europe" && <EuropeScene />}
      </svg>
      <svg
        className="market-motif absolute right-[-10%] top-10 h-[78vh] w-[78vw] max-w-6xl text-[color:var(--market-line)] transition-all duration-700"
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

function ChinaScene() {
  return (
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M0 500c120-54 226-68 318-42 92 26 174 22 246-12 112-53 222-42 330 34 80 56 176 61 288 14 94-39 180-42 258-10v136H0V500Z"
        fill="currentColor"
        opacity="0.12"
        strokeWidth="0"
      />
      <path d="M102 430h472M150 394h374M202 356h270" strokeWidth="3" opacity="0.5" />
      <path d="M126 430c42-48 92-72 150-72s108 24 150 72" strokeWidth="3" opacity="0.56" />
      <path d="M216 356c22-42 50-64 84-64s62 22 84 64" strokeWidth="3" opacity="0.56" />
      <path d="M184 394v84M270 356v122M356 356v122M476 394v84" strokeWidth="2" opacity="0.42" />
      <path d="M794 466c90-80 190-118 300-114 92 3 172 32 242 86" strokeWidth="6" opacity="0.26" />
      <path d="M832 430c70-48 146-72 228-72 76 0 146 20 210 60" strokeWidth="3" opacity="0.34" />
      <path d="M930 388c12-30 32-46 60-48 32-2 54 14 66 48" strokeWidth="2" opacity="0.36" />
      <path d="M96 514c136-62 250-72 342-30s188 36 288-18 202-50 306 12 238 68 408 18" strokeWidth="2" opacity="0.35" />
    </g>
  );
}

function UsaScene() {
  return (
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M0 496h1440v124H0V496Z"
        fill="currentColor"
        opacity="0.08"
        strokeWidth="0"
      />
      <path d="M90 496V342h72v154M194 496V286h86v210M318 496V206h68v290M424 496V318h104v178M574 496V252h86v244M704 496V138h98v358M846 496V294h78v202M970 496V224h90v272M1104 496V330h74v166M1222 496V270h96v226" strokeWidth="3" opacity="0.48" />
      <path d="M114 378h38M214 326h46M334 244h36M448 354h56M590 292h48M722 184h62M990 266h48M1240 312h54" strokeWidth="2" opacity="0.5" />
      <path d="M58 544c144-42 254-42 330 0s186 42 330 0 254-42 330 0 238 42 392 0" strokeWidth="3" opacity="0.34" />
      <path d="M96 430h1220" strokeWidth="1" opacity="0.2" />
    </g>
  );
}

function EuropeScene() {
  return (
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M0 510c118-36 230-44 336-24 94 18 178 12 252-18 108-44 216-40 324 12s220 52 336 0c72-32 136-36 192-12v152H0V510Z"
        fill="currentColor"
        opacity="0.1"
        strokeWidth="0"
      />
      <path d="M214 500V312l86-82 86 82v188" strokeWidth="3" opacity="0.5" />
      <path d="M254 500V362h92v138" strokeWidth="2" opacity="0.46" />
      <path d="M556 500V250l112-108 112 108v250" strokeWidth="3" opacity="0.55" />
      <path d="M608 500V326c0-50 120-50 120 0v174" strokeWidth="2" opacity="0.48" />
      <path d="M956 500V296l86-82 86 82v204" strokeWidth="3" opacity="0.5" />
      <path d="M998 500V358h88v142" strokeWidth="2" opacity="0.46" />
      <path d="M556 250h224M214 312h172M956 296h172" strokeWidth="2" opacity="0.38" />
      <path d="M668 142V72M640 102h56M300 230v-58M276 198h48M1042 214v-58M1018 184h48" strokeWidth="2" opacity="0.4" />
      <path d="M106 542c142-42 252-42 330 0s184 42 318 0 246-42 336 0 204 42 344 0" strokeWidth="2" opacity="0.36" />
    </g>
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
