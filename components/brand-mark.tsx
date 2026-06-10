type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  const markSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${markSize} relative grid place-items-center text-[color:var(--market-primary)]`}
      >
        <svg
          viewBox="0 0 180 180"
          aria-hidden="true"
          className="h-full w-full drop-shadow-[0_8px_20px_var(--market-primary-soft)]"
        >
          <path
            d="M47 75C38 49 42 24 57 18C71 13 84 33 88 60C94 31 109 11 124 18C140 25 141 54 126 80C139 91 146 107 142 123C137 146 116 160 89 160C61 160 40 145 36 121C33 102 37 87 47 75Z"
            fill="currentColor"
          />
          <circle cx="112" cy="101" r="5.5" fill="var(--background)" />
        </svg>
      </span>
      <span className={`${textSize} font-semibold tracking-normal text-foreground`}>NexusAI</span>
    </span>
  );
}
