export type Locale = "en" | "zh";

export const dictionaries = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      docs: "Docs",
      blog: "Blog",
      login: "Log in",
      start: "Start",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      language: "Language",
    },
    hero: {
      badge: "DeepSeek-powered assistant is live",
      titleTop: "Build faster with",
      titleAccent: "AI that works with you",
      description:
        "NexusAI helps global teams write, code, research, and think faster with a focused AI chat experience.",
      primary: "Start for free",
      secondary: "View docs",
      trusted: "Trusted tools for modern workflows",
      workspace: "NexusAI Workspace",
      chat: "AI Chat",
      code: "Code Assistant",
      content: "Content Studio",
    },
    features: {
      eyebrow: "Core Features",
      title: "Everything you need for daily AI work",
      description:
        "A clean assistant experience for writing, coding, planning, and exploring ideas across languages.",
      items: [
        {
          title: "Smart Chat",
          description:
            "Ask questions, refine ideas, and get context-aware answers for work, study, and everyday decisions.",
        },
        {
          title: "Code Generation",
          description:
            "Draft components, explain errors, review snippets, and speed up common development tasks.",
        },
        {
          title: "Content Writing",
          description:
            "Create emails, outlines, posts, product copy, and polished drafts with clear structure.",
        },
        {
          title: "Multilingual Output",
          description:
            "Switch between English and Chinese experiences, with more languages ready to add later.",
        },
        {
          title: "Multi-turn Context",
          description:
            "Continue complex tasks naturally while the assistant follows the conversation flow.",
        },
        {
          title: "Fast Response",
          description:
            "A focused interface and direct model connection keep the chat experience quick and simple.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Choose a plan that fits your workflow",
      description: "Start free, then upgrade when you need higher limits or team support.",
      popular: "Most popular",
      plans: [
        {
          name: "Free",
          price: "$0",
          period: "/mo",
          description: "For individuals exploring AI assistance",
          features: ["20 chats per day", "Basic model access", "Standard response speed", "Community support"],
          cta: "Start free",
        },
        {
          name: "Pro",
          price: "$14",
          period: "/mo",
          description: "For professionals and small teams",
          features: [
            "Higher chat limits",
            "All assistant features",
            "Priority response speed",
            "Code and content workflows",
            "Early access features",
            "Email support",
          ],
          cta: "Try Pro",
        },
        {
          name: "Enterprise",
          price: "Custom",
          period: "",
          description: "For organizations with custom needs",
          features: [
            "Everything in Pro",
            "Team onboarding",
            "Custom deployment options",
            "Advanced API access",
            "Dedicated support",
            "Security review support",
          ],
          cta: "Contact sales",
        },
      ],
    },
    cta: {
      title: "Ready to bring AI into your workflow?",
      description: "Start with chat today, then expand into documents, coding, and team workflows.",
      primary: "Start for free",
      secondary: "Book a demo",
    },
    footer: {
      tagline: "A clean AI assistant for faster writing, coding, and thinking.",
      product: "Product",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
      copyright: "All rights reserved.",
      links: {
        features: "Features",
        pricing: "Pricing",
        docs: "Docs",
        chat: "Try Chat",
        about: "About",
        blog: "Blog",
        contact: "Contact",
        demo: "Book Demo",
        help: "Help Center",
        developerDocs: "Developer Docs",
        cases: "Use Cases",
        partners: "Partners",
        terms: "Terms",
        privacy: "Privacy",
        cookies: "Cookies",
      },
    },
  },
  zh: {
    nav: {
      features: "功能",
      pricing: "价格",
      docs: "文档",
      blog: "博客",
      login: "登录",
      start: "开始使用",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
      language: "语言",
    },
    hero: {
      badge: "DeepSeek 智能助手已上线",
      titleTop: "构建未来的",
      titleAccent: "AI 驱动产品",
      description:
        "NexusAI 帮助全球团队更快地写作、编码、研究和思考，提供专注、简洁的 AI 对话体验。",
      primary: "免费开始使用",
      secondary: "查看文档",
      trusted: "为现代工作流而生",
      workspace: "NexusAI 工作区",
      chat: "智能对话",
      code: "代码助手",
      content: "内容创作",
    },
    features: {
      eyebrow: "核心功能",
      title: "日常 AI 工作所需的一切",
      description: "一个清爽的 AI 助手体验，适合写作、编码、规划和跨语言探索想法。",
      items: [
        {
          title: "智能对话",
          description: "提问、打磨想法、获得理解上下文的回答，适合工作、学习和日常决策。",
        },
        {
          title: "代码生成",
          description: "生成组件、解释报错、审查片段，加速常见开发任务。",
        },
        {
          title: "内容写作",
          description: "生成邮件、大纲、文章、产品文案和结构清晰的初稿。",
        },
        {
          title: "多语言输出",
          description: "支持中英文体验切换，后续可以继续扩展更多语言。",
        },
        {
          title: "多轮上下文",
          description: "自然延续复杂任务，让助手跟随完整对话脉络。",
        },
        {
          title: "快速响应",
          description: "专注的界面和直连模型调用，让聊天体验保持简单快速。",
        },
      ],
    },
    pricing: {
      eyebrow: "价格方案",
      title: "选择适合你的工作流方案",
      description: "免费开始体验，需要更高额度或团队支持时再升级。",
      popular: "最受欢迎",
      plans: [
        {
          name: "免费版",
          price: "$0",
          period: "/月",
          description: "适合个人用户体验 AI 能力",
          features: ["每日 20 次对话", "基础模型访问", "标准响应速度", "社区支持"],
          cta: "免费开始",
        },
        {
          name: "专业版",
          price: "$14",
          period: "/月",
          description: "适合专业人士和小团队",
          features: ["更高对话额度", "全部助手功能", "优先响应速度", "代码和内容工作流", "抢先体验功能", "邮件支持"],
          cta: "试用专业版",
        },
        {
          name: "企业版",
          price: "定制",
          period: "",
          description: "适合大型企业和定制需求",
          features: ["专业版全部功能", "团队导入支持", "定制部署选项", "高级 API 访问", "专属支持", "安全审查支持"],
          cta: "联系销售",
        },
      ],
    },
    cta: {
      title: "准备把 AI 带入你的工作流了吗？",
      description: "从智能对话开始，再逐步扩展到文档、代码和团队协作。",
      primary: "免费开始使用",
      secondary: "预约演示",
    },
    footer: {
      tagline: "一个用于写作、编码和思考的简洁 AI 助手。",
      product: "产品",
      company: "公司",
      resources: "资源",
      legal: "法律",
      copyright: "保留所有权利。",
      links: {
        features: "功能介绍",
        pricing: "价格方案",
        docs: "使用文档",
        chat: "立即体验",
        about: "关于我们",
        blog: "博客",
        contact: "联系我们",
        demo: "预约演示",
        help: "帮助中心",
        developerDocs: "开发者文档",
        cases: "使用案例",
        partners: "合作伙伴",
        terms: "服务条款",
        privacy: "隐私政策",
        cookies: "Cookie 政策",
      },
    },
  },
} as const;
