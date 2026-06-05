import { Bot, Code2, FileText, ImageIcon, MessageSquare, Zap } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "智能对话",
    description: "基于最先进的大语言模型，提供自然流畅的对话体验，理解上下文，给出精准回答。",
  },
  {
    icon: Code2,
    title: "代码生成",
    description: "支持多种编程语言，一键生成高质量代码，自动补全、代码审查、Bug 修复一应俱全。",
  },
  {
    icon: FileText,
    title: "内容创作",
    description: "从文章撰写到营销文案，AI 助手帮您快速生成专业内容，提升创作效率。",
  },
  {
    icon: ImageIcon,
    title: "图像生成",
    description: "文字描述即可生成精美图像，支持多种风格，满足设计、营销等多场景需求。",
  },
  {
    icon: MessageSquare,
    title: "多轮对话",
    description: "智能记忆对话历史，支持复杂任务的多轮交互，像与真人交流一样自然。",
  },
  {
    icon: Zap,
    title: "极速响应",
    description: "优化的推理引擎确保毫秒级响应，无论任务多复杂都能快速完成。",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            核心功能
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            全方位 AI 能力，助您高效完成工作
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            集成最新 AI 技术，为您提供全面的智能助手功能
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="surface-lift group relative rounded-lg border border-border/50 bg-card/55 p-6 backdrop-blur-xl"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
