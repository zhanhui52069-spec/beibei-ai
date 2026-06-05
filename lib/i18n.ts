export type Locale = "en" | "zh";

export const dictionaries = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      docs: "Docs",
      login: "Log in",
      start: "Start",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      language: "Language",
    },
    hero: {
      badge: "Global AI workspace is live",
      titleTop: "A calmer way to",
      titleAccent: "think, write, and build",
      description:
        "NexusAI gives creators, founders, and teams a focused assistant for chat, writing, code, and planning across languages.",
      primary: "Start chatting",
      secondary: "View docs",
      metrics: ["Multilingual UI", "Private prompts", "Fast workspace"],
      workspace: "NexusAI Control",
      command: "Draft a launch plan for a global AI product",
      answer:
        "I will turn this into a clear plan with positioning, tasks, and launch copy. Choose the region and tone first.",
      signal: "Live response",
      chartTitle: "Workspace activity",
      chartLabel: "Productivity",
      chat: "Chat",
      code: "Code",
      content: "Write",
    },
    features: {
      eyebrow: "Core Features",
      title: "Useful AI tools without the noise",
      description:
        "A compact assistant experience for everyday work: fewer distractions, clearer answers, and practical workflows.",
      items: [
        {
          title: "Focused Chat",
          description:
            "Ask questions, refine ideas, and get context-aware answers for work, study, and everyday decisions.",
        },
        {
          title: "Code Support",
          description:
            "Draft components, explain errors, review snippets, and speed up common development tasks.",
        },
        {
          title: "Writing Studio",
          description:
            "Create emails, outlines, posts, product copy, and polished drafts with clear structure.",
        },
        {
          title: "Language Switch",
          description:
            "Move between English and Chinese now, with a structure ready for more global languages.",
        },
        {
          title: "Task Memory",
          description:
            "Continue complex tasks naturally while the assistant follows the conversation flow.",
        },
        {
          title: "Fast Workspace",
          description:
            "A lean interface and secure server connection keep the chat experience quick and simple.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Simple plans for real use",
      description: "Start free, then upgrade when you need higher limits or team support.",
      popular: "Most popular",
      plans: [
        {
          name: "Free",
          price: "$0",
          period: "/mo",
          description: "For individuals exploring AI assistance",
          features: ["20 chats per day", "Core assistant access", "Standard response speed", "Community support"],
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
      title: "Bring a cleaner AI workspace into your day",
      description: "Start with chat today, then expand into writing, code, and team workflows.",
      primary: "Start chatting",
      secondary: "Contact us",
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
        contact: "Contact",
        demo: "Book Demo",
        help: "Help Center",
        developerDocs: "Developer Docs",
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
      login: "登录",
      start: "开始使用",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
      language: "语言",
    },
    hero: {
      badge: "全球 AI 工作台已上线",
      titleTop: "用更清爽的方式",
      titleAccent: "思考、写作与构建",
      description:
        "NexusAI 为创作者、创业者和团队提供专注的智能助手，支持对话、写作、代码和跨语言规划。",
      primary: "开始对话",
      secondary: "查看文档",
      metrics: ["多语言界面", "提示词私密", "快速工作台"],
      workspace: "NexusAI 控制台",
      command: "为一个全球 AI 产品制定上线计划",
      answer:
        "我会把它整理成清晰计划，包括定位、任务和发布文案。先选择目标地区和表达语气。",
      signal: "实时响应",
      chartTitle: "工作台动态",
      chartLabel: "效率趋势",
      chat: "对话",
      code: "代码",
      content: "写作",
    },
    features: {
      eyebrow: "核心功能",
      title: "少一点噱头，多一点可用",
      description: "面向日常工作的紧凑 AI 助手：减少干扰、回答更清楚、流程更实用。",
      items: [
        {
          title: "专注对话",
          description: "提问、打磨想法、获得理解上下文的回答，适合工作、学习和日常决策。",
        },
        {
          title: "代码辅助",
          description: "生成组件、解释报错、审查片段，加速常见开发任务。",
        },
        {
          title: "写作工作室",
          description: "生成邮件、大纲、文章、产品文案和结构清晰的初稿。",
        },
        {
          title: "语言切换",
          description: "当前支持中英文界面切换，并为更多全球语言预留扩展结构。",
        },
        {
          title: "任务延续",
          description: "自然延续复杂任务，让助手跟随完整对话脉络。",
        },
        {
          title: "快速工作台",
          description: "轻量界面和安全服务端连接，让聊天体验保持简单快速。",
        },
      ],
    },
    pricing: {
      eyebrow: "价格方案",
      title: "为真实使用设计的简单方案",
      description: "免费开始体验，需要更高额度或团队支持时再升级。",
      popular: "最受欢迎",
      plans: [
        {
          name: "免费版",
          price: "$0",
          period: "/月",
          description: "适合个人用户体验 AI 能力",
          features: ["每日 20 次对话", "核心助手能力", "标准响应速度", "社区支持"],
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
      title: "把更清爽的 AI 工作台带进日常",
      description: "从智能对话开始，再逐步扩展到写作、代码和团队协作。",
      primary: "开始对话",
      secondary: "联系我们",
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
        contact: "联系我们",
        demo: "预约演示",
        help: "帮助中心",
        developerDocs: "开发者文档",
        partners: "合作伙伴",
        terms: "服务条款",
        privacy: "隐私政策",
        cookies: "Cookie 政策",
      },
    },
  },
} as const;
