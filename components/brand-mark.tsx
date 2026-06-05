type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  const markSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${markSize} relative grid place-items-center overflow-hidden rounded-lg border border-white/15 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_28px_rgba(56,189,248,0.24)]`}
      >
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.9),rgba(34,211,238,0.48)_48%,rgba(16,185,129,0.74))]" />
        <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-white/35 blur-xl" />
        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
        <span className="absolute bottom-2 left-2 h-px w-5 rotate-[-34deg] bg-white/75" />
        <span className="absolute right-2 top-2 h-5 w-px rotate-[34deg] bg-white/60" />
        <span className="relative text-[13px] font-black tracking-normal text-white">N</span>
      </span>
      <span className={`${textSize} font-semibold tracking-normal text-foreground`}>NexusAI</span>
    </span>
  );
}
