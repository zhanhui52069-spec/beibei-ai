import { SimplePage } from "@/components/simple-page";

export default function DocsPage() {
  return (
    <SimplePage
      eyebrow="Docs"
      title="NexusAI 使用文档"
      description="快速了解如何使用聊天助手、组织提示词，并把 NexusAI 融入日常创作、学习和工作流程。"
      sections={[
        {
          title: "开始对话",
          body: "进入聊天页后输入你的问题或任务。你可以让 NexusAI 解释概念、撰写文案、整理计划、生成代码或优化已有内容。",
        },
        {
          title: "写出更好的提示词",
          body: "描述你的目标、背景、输出格式和限制条件。越具体的任务说明，越容易得到可直接使用的结果。",
        },
        {
          title: "适合的场景",
          body: "适用于内容创作、邮件撰写、学习辅导、代码辅助、方案脑暴和日常问答等高频工作流。",
        },
        {
          title: "安全提醒",
          body: "不要在对话里输入密码、密钥、身份证件、银行卡等敏感信息。重要结论建议结合专业判断复核。",
        },
      ]}
    />
  );
}
