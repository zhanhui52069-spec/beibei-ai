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
        d="M0 502c128-38 244-42 348-12 96 28 188 20 276-24 106-53 210-48 312 14 94 57 196 62 306 14 78-34 144-38 198-14v140H0V502Z"
        fill="currentColor"
        opacity="0.1"
        strokeWidth="0"
      />
      <path d="M112 476h520M156 430h430M210 392h318" strokeWidth="2.5" opacity="0.42" />
      <path d="M142 430l86-54h230l86 54M198 392l66-42h198l66 42" strokeWidth="2.5" opacity="0.4" />
      <path d="M176 476V430M264 476V392M366 476V392M498 476V430" strokeWidth="2" opacity="0.34" />
      <path d="M740 470c78-82 170-122 276-120 92 2 174 36 246 102" strokeWidth="4" opacity="0.28" />
      <path d="M786 438c62-48 132-72 210-72 74 0 142 23 204 68" strokeWidth="2.5" opacity="0.32" />
      <path d="M850 510c86-20 174-20 264 0M124 538c154-34 296-34 426 0s262 34 396 0 298-34 494 0" strokeWidth="2" opacity="0.34" />
      <path d="M872 224v80M930 194v110M1002 214v92M1124 188v112M1190 224v78" strokeWidth="1.5" opacity="0.16" />
      <path d="M1090 292c18-62 10-126-24-192M1126 292c22-74 16-142-18-204M1164 294c16-54 16-108 0-162" strokeWidth="2" opacity="0.18" />
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
      <path d="M82 470c90-32 178-32 264 0s174 32 264 0 176-32 264 0" />
      <path d="M116 520c108-28 214-28 318 0s206 28 306 0" />
      <path d="M188 364c62-56 128-84 198-84s136 28 198 84" />
      <path d="M248 364c38-30 84-45 138-45s100 15 138 45" />
      <path d="M128 258h338M170 218h250M224 184h144" />
      <path d="M146 258l68-44h170l68 44M214 218l54-34h110l54 34" />
      <path d="M632 132v338M678 154v300M724 112v352M770 174v248" opacity="0.42" />
      <path d="M706 126c38 72 30 142-24 210M748 112c46 86 34 168-36 246" opacity="0.5" />
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
