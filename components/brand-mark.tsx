import Image from "next/image";

type BrandMarkProps = {
  size?: "sm" | "md";
};

export function BrandMark({ size = "md" }: BrandMarkProps) {
  const markSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${markSize} relative grid place-items-center`}
      >
        <Image
          src="/brand-rabbit-black.png"
          alt=""
          width={256}
          height={256}
          className="h-full w-full object-contain drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]"
          priority
        />
      </span>
      <span className={`${textSize} font-medium tracking-[0.16em] text-foreground`}>NEXUS AI</span>
    </span>
  );
}
