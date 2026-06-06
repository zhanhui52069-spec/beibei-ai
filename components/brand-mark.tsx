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
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,70,239,0.76),rgba(168,85,247,0.38)_52%,rgba(255,255,255,0.08))]" />
        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
        <span className="absolute bottom-2 left-2 h-px w-5 rotate-[-34deg] bg-white/55" />
        <span className="absolute right-2 top-2 h-5 w-px rotate-[34deg] bg-white/40" />
        <span className="relative text-[13px] font-black tracking-normal text-white">N</span>
      </span>
      <span className={`${textSize} font-semibold tracking-normal text-foreground`}>NexusAI</span>
    </span>
  );
}
