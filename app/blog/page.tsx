import { SimplePage } from "@/components/simple-page";

export default function BlogPage() {
  return (
    <SimplePage
      eyebrow="Blog"
      title="NexusAI 博客"
      description="这里会持续更新 AI 使用技巧、产品更新和实用案例。当前先提供几篇入门方向，帮助你快速上手。"
      sections={[
        {
          title: "如何让 AI 更懂你的需求",
          body: "把任务拆成目标、背景、格式和语气四部分，能显著提升回复质量，减少来回修改。",
        },
        {
          title: "用 AI 提升内容创作效率",
          body: "从大纲、初稿、润色到标题优化，NexusAI 可以承担重复劳动，让你把时间放在判断和表达上。",
        },
        {
          title: "开发者如何使用聊天助手",
          body: "可以让 AI 解释报错、生成组件、审查代码片段，也可以要求它给出逐步排查方案。",
        },
        {
          title: "产品更新",
          body: "后续会在这里发布模型能力、界面体验、账号系统和套餐功能的更新说明。",
        },
      ]}
    />
  );
}
