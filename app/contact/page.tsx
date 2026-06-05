import { SimplePage } from "@/components/simple-page";

export default function ContactPage() {
  return (
    <SimplePage
      eyebrow="Contact"
      title="联系与演示预约"
      description="如果你想了解企业版、定制部署、团队使用或产品合作，可以先通过当前页面了解可沟通方向。"
      ctaLabel="先体验聊天"
      ctaHref="/chat"
      sections={[
        {
          title: "企业咨询",
          body: "适合需要团队额度、统一管理、私有化部署或专属支持的企业客户。",
        },
        {
          title: "产品反馈",
          body: "如果你在使用中遇到问题，记录页面、操作步骤和错误提示，会帮助我们更快定位。",
        },
        {
          title: "合作方向",
          body: "欢迎围绕 AI 工具、内容生产、教育培训、开发者效率等方向展开合作。",
        },
        {
          title: "下一步",
          body: "正式联系表单和邮件入口会在后续版本补齐。当前可以先通过聊天页体验核心能力。",
        },
      ]}
    />
  );
}
