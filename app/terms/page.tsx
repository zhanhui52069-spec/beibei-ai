import { SimplePage } from "@/components/simple-page";

export default function TermsPage() {
  return (
    <SimplePage
      eyebrow="Terms"
      title="服务条款"
      description="以下为当前阶段的简版服务说明，用于明确基本使用边界。正式条款会在商业化功能上线前完善。"
      sections={[
        {
          title: "合理使用",
          body: "请勿使用 NexusAI 生成违法、侵权、欺诈、骚扰或有害内容。平台可能根据安全需要限制异常使用。",
        },
        {
          title: "结果复核",
          body: "AI 生成内容可能存在错误或遗漏。涉及法律、医疗、金融等高风险场景时，请咨询专业人士。",
        },
        {
          title: "账号与安全",
          body: "当前账号系统仍为演示体验。请勿在站内提交真实密码、密钥或其他敏感凭据。",
        },
        {
          title: "服务变化",
          body: "产品功能、模型、额度和定价可能随版本调整。重要变化会尽量通过页面说明或更新日志提示。",
        },
      ]}
    />
  );
}
