import { SimplePage } from "@/components/simple-page";

export default function PrivacyPage() {
  return (
    <SimplePage
      eyebrow="Privacy"
      title="隐私政策"
      description="我们会尽量减少不必要的数据收集，并提醒你不要在对话中输入敏感信息。"
      sections={[
        {
          title: "聊天内容",
          body: "聊天请求会发送到服务端并调用模型接口生成回复。请避免输入密码、密钥、身份证件等敏感信息。",
        },
        {
          title: "本地演示账号",
          body: "当前登录和注册页面主要用于演示，会把基础信息保存在浏览器本地，尚未接入正式账号系统。",
        },
        {
          title: "分析数据",
          body: "生产环境可能使用 Vercel Analytics 了解页面访问情况，用于改进站点稳定性和体验。",
        },
        {
          title: "后续完善",
          body: "当正式账号、支付或历史记录功能上线时，隐私说明会同步更新并明确数据处理方式。",
        },
      ]}
    />
  );
}
