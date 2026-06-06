import { SimplePage } from "@/components/simple-page";

export default function AboutPage() {
  return (
    <SimplePage
      eyebrow="About"
      title="Built for global sellers"
      description="NexusAI helps small sellers and operators write faster for overseas buyers without opening a dozen separate tools."
      sections={[
        {
          title: "Positioning",
          body: "We focus on practical selling tasks: listings, ad scripts, email copy, and customer support replies. The product is intentionally narrow so the output can be more useful.",
        },
        {
          title: "Who it is for",
          body: "NexusAI is best for Shopify sellers, Amazon operators, Etsy sellers, TikTok Shop creators, dropshippers, and agencies serving cross-border brands.",
        },
        {
          title: "Product principles",
          body: "Keep the interface simple, make prompts easy to start, and help users get copy they can edit and publish quickly.",
        },
        {
          title: "Current stage",
          body: "The chat workflow is live. Payments, saved templates, brand voice, and team features can be added after the positioning is validated with real users.",
        },
      ]}
    />
  );
}
