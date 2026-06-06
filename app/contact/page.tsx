import { SimplePage } from "@/components/simple-page";

export default function ContactPage() {
  return (
    <SimplePage
      eyebrow="Contact"
      title="Work with NexusAI"
      description="For agencies, seller teams, and operators who want AI workflows for product copy, ads, and customer support."
      ctaLabel="Try the workspace"
      ctaHref="/chat"
      sections={[
        {
          title: "Seller teams",
          body: "Use NexusAI to speed up product launches, weekly ad testing, listing rewrites, and support reply drafts.",
        },
        {
          title: "Agencies",
          body: "Create first drafts for multiple stores faster, then refine the output with each client's brand voice and compliance rules.",
        },
        {
          title: "Feedback",
          body: "If a workflow feels useful or missing, note the product type, marketplace, target country, and example prompt so it can be improved.",
        },
        {
          title: "Next step",
          body: "The fastest way to evaluate NexusAI is to open the chat page and test it with a real product or customer support issue.",
        },
      ]}
    />
  );
}
