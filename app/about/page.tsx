import { SimplePage } from "@/components/simple-page";

export default function AboutPage() {
  return (
    <SimplePage
      eyebrow="About"
      title="关于 NexusAI"
      description="NexusAI 是一个面向个人和小团队的 AI 助手平台，目标是让高质量智能对话变得简单、稳定、易用。"
      sections={[
        {
          title: "我们的定位",
          body: "我们专注于把 AI 对话能力包装成清晰、轻量、可持续使用的产品体验，而不是复杂的技术演示。",
        },
        {
          title: "适合谁使用",
          body: "适合创作者、学生、运营、开发者、自由职业者，以及希望提高日常效率的小团队。",
        },
        {
          title: "产品原则",
          body: "界面清晰、响应稳定、入口明确、结果可用。后续功能会围绕真实工作流逐步扩展。",
        },
        {
          title: "当前阶段",
          body: "聊天功能已经接入 DeepSeek。账号、套餐、历史记录和更多工具能力会在后续版本逐步完善。",
        },
      ]}
    />
  );
}
