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
            d="M58 73C49 62 45 48 47 33C49 17 58 10 68 15C81 22 87 42 88 59C91 42 99 23 112 16C122 10 132 17 134 31C136 47 132 62 122 73C139 84 148 102 147 121C146 145 127 159 102 160H78C53 160 34 145 33 121C32 102 41 84 58 73Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className={`${textSize} font-medium tracking-[0.16em] text-foreground`}>NEXUS AI</span>
    </span>
  );
}
