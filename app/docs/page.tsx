import { SimplePage } from "@/components/simple-page";

export default function DocsPage() {
  return (
    <SimplePage
      eyebrow="Docs"
      title="How sellers use NexusAI"
      description="Use NexusAI to turn rough product notes into publishable copy for overseas marketplaces, ads, and customer support."
      sections={[
        {
          title: "Start with product details",
          body: "Share the product name, target country, platform, audience, key benefits, and any claims you want to avoid. The more specific the input, the more usable the copy.",
        },
        {
          title: "Generate marketplace copy",
          body: "Ask for Amazon titles, bullet points, Shopify descriptions, Etsy listings, SEO keywords, comparison tables, or localized versions for different markets.",
        },
        {
          title: "Create ads and scripts",
          body: "Turn product benefits into TikTok hooks, short video scripts, Meta ad variations, email promos, and landing page copy.",
        },
        {
          title: "Review before publishing",
          body: "Always verify product claims, prohibited words, marketplace rules, pricing, delivery promises, and compliance-sensitive statements before using AI output.",
        },
      ]}
    />
  );
}
