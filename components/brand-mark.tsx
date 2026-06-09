type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  const markSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${markSize} relative grid place-items-center overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]`}
      >
        <span className="absolute inset-0 bg-[linear-gradient(135deg,#17D6FF,#2563EB_48%,#5B21B6)]" />
        <svg
          viewBox="0 0 180 180"
          aria-hidden="true"
          className="relative h-[82%] w-[82%] drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
        >
          <path d="M55 65C47 39 52 22 66 19C80 16 89 38 91 59C96 38 107 17 121 22C135 27 137 48 126 72C139 82 146 97 143 114C139 138 118 153 90 153C62 153 41 138 37 114C34 94 41 77 55 65Z" fill="white" />
          <path d="M66 62C61 43 63 33 68 32C73 31 80 45 82 66C76 64 71 63 66 62Z" fill="#78E7FF" fillOpacity="0.34" />
          <path d="M116 65C119 46 118 36 113 35C108 34 101 48 98 68C104 66 110 65 116 65Z" fill="#78E7FF" fillOpacity="0.34" />
          <path d="M65 99C69 93 75 91 82 94" stroke="#0B1020" strokeWidth="8" strokeLinecap="round" />
          <path d="M109 94C116 91 122 93 126 99" stroke="#0B1020" strokeWidth="8" strokeLinecap="round" />
          <path d="M87 111C89 113 92 113 94 111" stroke="#0B1020" strokeWidth="6" strokeLinecap="round" />
          <path d="M74 129C84 136 97 137 108 129" stroke="#0B1020" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`${textSize} font-semibold tracking-normal text-foreground`}>NexusAI</span>
    </span>
  );
}
