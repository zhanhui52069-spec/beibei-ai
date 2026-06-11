import { completeAiTask, releaseAiTask, reserveAiTask } from '@/lib/usage-store'
import { getUsageSubject, usageCookieHeader } from '@/lib/usage-subject'

export const maxDuration = 60
const promptVersion = 'global-seller-v10'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatContext = {
  locale?: 'en' | 'zh'
  market?: 'china' | 'usa' | 'europe'
}

const marketNames = {
  china: 'China',
  usa: 'the United States',
  europe: 'Europe',
} as const

function createSystemPrompt({ locale, market }: ChatContext) {
  const responseLanguage = locale === 'zh' ? 'Simplified Chinese' : 'English'
  const targetMarket = market ? marketNames[market] : 'the market specified by the user'

  return `You are Nexus AI, a professional AI commerce assistant built for global sellers.

Your job is to help sellers work faster and produce publish-ready results for cross-border e-commerce. You specialize in:
- Product research, positioning, buyer personas, offers, and differentiation
- Marketplace listings for Amazon, Shopify, Etsy, eBay, TikTok Shop, and similar channels
- SEO titles, bullet points, descriptions, keywords, A+ content, and storefront copy
- Paid social ads, short-video hooks, scripts, landing-page copy, and email campaigns
- Customer support replies, review responses, refund and shipping communication
- Translation and localization that sounds native rather than literal
- Market-entry ideas, competitor analysis frameworks, and conversion optimization
- Practical compliance checks for claims, prohibited wording, platform rules, and cultural sensitivity

Working rules:
1. Reply in ${responseLanguage} unless the user explicitly requests another language.
2. Treat ${targetMarket} as the current target market unless the user specifies a different one.
3. Produce specific, usable deliverables instead of generic advice. Use short plain-text labels and simple numbered lists when structure is useful.
4. Adapt tone, spelling, units, currency, buyer expectations, and cultural references to the target market and sales channel.
5. Never invent or infer product facts. This includes dimensions, capacity, materials, ingredients, compatibility, performance duration, safety claims, certifications, test results, prices, guarantees, shipping times, customer reviews, or legal claims. Use an obvious placeholder such as [capacity], [material], or [verified performance] only where the missing fact is essential; otherwise omit the claim.
6. If essential product, audience, platform, or goal information is missing, ask only the few questions needed. You may still provide a useful first draft, but assumptions may cover only tone, structure, audience framing, and creative direction. Never use assumptions to create product specifications or factual selling claims.
7. For listings and ads, prioritize clarity, buyer benefit, credibility, differentiation, and conversion while avoiding spammy keyword stuffing.
8. For customer service, remain calm, empathetic, concise, and solution-oriented. Do not promise refunds or compensation unless authorized by the seller.
9. For legal, tax, safety, or marketplace-policy questions, provide operational guidance but clearly recommend verification against current official rules.
10. A product category or ordinary industry practice is not evidence of a product fact. For example: "insulated" does not prove vacuum construction or any hot/cold duration; "stainless steel" does not prove 18/8 grade, rust resistance, BPA-free status, leak resistance, or a sweat-free exterior. Do not include such claims unless the user supplied them.
11. Before drafting commercial copy, silently inventory the facts explicitly supplied by the user. Every factual claim in the output must be traceable to that inventory. If it is not traceable, omit it or replace it with a bracketed placeholder.
12. If the user supplies only a product category and one or two basic facts, do not fabricate a finished listing. Ask 3 to 5 concise questions for the missing verified selling facts. You may include a short fill-in template containing placeholders only, but no inferred benefits or features.
13. Write like an experienced human ecommerce operator. Be direct, natural, and concise. Do not begin with canned phrases such as "Sure", "Certainly", "Here is", "好的", "当然", or "以下是".
14. Output plain text only. Never use Markdown control characters such as #, **, >, ---, ___, or backticks. Avoid excessive headings, decorative punctuation, slogans, and repetitive conclusions. Do not wrap every list item in quotation marks unless it is actual spoken dialogue.
15. Avoid recognizable AI-copy cliches and inflated phrases such as "game changer", "cheat code", "unlock", "elevate", "revolutionize", "say goodbye to", or their Chinese equivalents. Prefer concrete, conversational wording.
16. Never invent first-person experience, testimonials, customer reactions, or before-and-after stories. Use a first-person UGC voice only when the user explicitly requests a fictional script and clearly label placeholders that require real proof.
17. Do not mention the underlying model or provider. Present yourself only as Nexus AI.`
}

function cleanAssistantText(text: string) {
  let cleaned = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line))
    .map((line) =>
      line
        .replace(/^\s{0,3}#{1,6}\s*/, '')
        .replace(/^\s*>\s?/, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^(\s*(?:\d+[.)]|[-•])\s*)["“](.+)["”]\s*$/, '$1$2')
        .replace(/^\s*["“](.+)["”]\s*$/, '$1')
        .trimEnd()
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const lines = cleaned.split('\n')
  if (
    lines.length > 1 &&
    /^(?:好的|当然|没问题|可以|sure|certainly|of course)[，,！!\s].*(?:以下|下面|为你|针对|here|below)/i.test(
      lines[0]
    )
  ) {
    cleaned = lines.slice(1).join('\n').trim()
  }

  return cleaned
}

function needsClaimReview(messages: ChatMessage[]) {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')
  if (!latestUserMessage) return false

  return /listing|product description|bullet points?|amazon|shopify|etsy|ebay|tiktok(?:\s+shop|\s+ad|\s+hook|\s+script)?|ad copy|landing page|商品文案|商品描述|产品描述|卖点|广告文案|详情页/i.test(
    latestUserMessage.content
  )
}

function createBriefRequest(messages: ChatMessage[], locale?: 'en' | 'zh') {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')
  if (!latestUserMessage || !needsClaimReview(messages)) return null

  const content = latestUserMessage.content
  const allowsPlaceholders = /placeholder|template|use assumptions|先写|占位符|模板|可以假设/i.test(content)
  const explicitlyMissing = /unknown|not sure|do not know|missing|未知|不清楚|不知道|没有提供|缺少/i.test(content)
  const isSparse = content.replace(/\s+/g, ' ').trim().length < 220

  if (allowsPlaceholders || (!explicitlyMissing && !isSparse)) return null

  if (locale === 'zh') {
    return `为了写出可以直接发布、且不虚构卖点的专业文案，请补充以下信息：

1. 产品的准确规格、尺寸、容量、材质或款式
2. 已验证的核心功能、性能数据和认证
3. 与竞品相比最重要的差异化卖点
4. 目标买家、主要使用场景和销售平台
5. 品牌语气、关键词以及必须避免的表述

如果暂时没有完整资料，也可以回复“使用占位符先写”，我会生成一份便于填写的文案模板。`
  }

  return `To create professional, publish-ready copy without inventing product claims, please provide:

1. Exact specifications, dimensions, capacity, materials, or variants
2. Verified features, performance data, and certifications
3. The most important differentiators versus competing products
4. Target buyer, primary use case, and sales platform
5. Brand tone, required keywords, and wording to avoid

If those details are not available yet, reply "use placeholders" and I will create a structured fill-in template.`
}

async function reviewProductClaims({
  apiKey,
  baseURL,
  modelName,
  messages,
  draft,
  locale,
}: {
  apiKey: string
  baseURL: string
  modelName: string
  messages: ChatMessage[]
  draft: string
  locale?: 'en' | 'zh'
}) {
  const suppliedFacts = messages
    .filter((message) => message.role === 'user')
    .map((message) => message.content)
    .join('\n\n')

  const response = await fetch(`${baseURL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: `You are the final factual-claims editor for ecommerce copy. The draft is untrusted. Return only the revised copy in ${locale === 'zh' ? 'Simplified Chinese' : 'English'}.

Use only product facts explicitly present in SUPPLIED USER INFORMATION. Remove or replace with bracketed placeholders every unsupported specification or claim, including inferred industry-standard features. Product category names are not proof of features. Placeholders may represent missing product specifications only. They never permit invented personal experiences, testimonials, elapsed-time stories, before-and-after results, medical outcomes, or guaranteed performance. Rewrite ad hooks as neutral questions, observations, product demonstrations, or everyday scenarios without using I, my, we, or fake customer stories. Do not add advice, an audit report, or explanations. Preserve useful structure and persuasive language that does not assert unsupported facts.`,
        },
        {
          role: 'user',
          content: `SUPPLIED USER INFORMATION (the only trusted source):\n${suppliedFacts}\n\nUNTRUSTED DRAFT TO REVISE:\n${draft}\n\nMANDATORY REMOVAL CHECK:\nUnless the exact fact appears in the trusted source above, remove claims about double-wall construction, vacuum insulation, temperature duration, leak-proofing, BPA-free status, sweat or condensation resistance, material grade such as 18/8, rust resistance, dishwasher safety, wide mouths, included lids or accessories, cup-holder fit, dimensions, capacity, compatibility, certifications, warranties, shipping speed, health benefits, or test results. Remove invented first-person experiences, testimonials, before-and-after stories, pain relief, medical advice, body-height changes, guaranteed outcomes, and claims that a condition fixes itself. Rewrite them as neutral product-focused or everyday-scenario copy. Do not soften unsupported claims; delete them or use a clear bracketed placeholder.`,
        },
      ],
      temperature: 0.1,
    }),
  })

  if (!response.ok) return draft

  const data = await response.json().catch(() => null)
  return data?.choices?.[0]?.message?.content?.trim() || draft
}

function normalizeMessages(messages: any[] = []): ChatMessage[] {
  return messages
    .map((message) => {
      const role = message.role
      const content =
        message.content ||
        message.parts
          ?.filter((part: any) => part.type === 'text' && part.text)
          .map((part: any) => part.text)
          .join('\n') ||
        ''

      if (!['user', 'assistant'].includes(role)) return null
      if (!content.trim()) return null

      return { role, content: content.trim() }
    })
    .filter(Boolean) as ChatMessage[]
}

export async function POST(req: Request) {
  const subject = getUsageSubject(req)
  const requestId = crypto.randomUUID()
  let reservation: Awaited<ReturnType<typeof reserveAiTask>> | null = null

  const responseHeaders = () => ({
    'X-Nexus-Prompt-Version': promptVersion,
    ...(subject.isNew ? { 'Set-Cookie': usageCookieHeader(subject.subjectId) } : {}),
  })

  try {
    const apiKey = process.env.OPENAI_API_KEY
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.deepseek.com/v1'
    const modelName = process.env.MODEL_NAME || 'deepseek-chat'

    if (!apiKey) {
      return Response.json(
        { error: 'Missing OPENAI_API_KEY in Vercel environment variables.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const messages = normalizeMessages(body.messages)
    const context: ChatContext = {
      locale: body.locale === 'zh' ? 'zh' : 'en',
      market: ['china', 'usa', 'europe'].includes(body.market) ? body.market : undefined,
    }

    if (!messages.length) {
      return Response.json({ error: 'Message cannot be empty.' }, { status: 400, headers: responseHeaders() })
    }

    reservation = await reserveAiTask(subject.subjectId, requestId)

    if (!reservation.allowed) {
      return Response.json(
        {
          error: 'Your available AI tasks have been used. Add a Seller task pack to continue.',
          code: 'quota_exhausted',
          balance: reservation,
        },
        { status: 402, headers: responseHeaders() },
      )
    }

    const briefRequest = createBriefRequest(messages, context.locale)
    if (briefRequest) {
      const balance = await completeAiTask(subject.subjectId, requestId, reservation.metering)
      return Response.json(
        { text: cleanAssistantText(briefRequest), balance },
        { headers: responseHeaders() }
      )
    }

    const response = await fetch(`${baseURL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: createSystemPrompt(context),
          },
          ...messages,
        ],
        temperature: 0.35,
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const balance = await releaseAiTask(
        subject.subjectId,
        requestId,
        `Provider status ${response.status}`,
        reservation.metering,
      )
      return Response.json(
        {
          error:
            data?.error?.message ||
            data?.message ||
            `DeepSeek API request failed with status ${response.status}`,
          balance,
        },
        { status: response.status, headers: responseHeaders() }
      )
    }

    let text = data?.choices?.[0]?.message?.content

    if (!text) {
      const balance = await releaseAiTask(
        subject.subjectId,
        requestId,
        'Provider returned no visible message',
        reservation.metering,
      )
      return Response.json(
        { error: 'DeepSeek returned no visible message.', balance },
        { status: 502, headers: responseHeaders() }
      )
    }

    if (needsClaimReview(messages)) {
      text = await reviewProductClaims({
        apiKey,
        baseURL,
        modelName,
        messages,
        draft: text,
        locale: context.locale,
      })
    }

    const balance = await completeAiTask(subject.subjectId, requestId, reservation.metering)
    return Response.json({ text: cleanAssistantText(text), balance }, { headers: responseHeaders() })
  } catch (error) {
    console.error('[chat-api] Chat API error:', error)

    const balance = reservation?.allowed
      ? await releaseAiTask(
          subject.subjectId,
          requestId,
          error instanceof Error ? error.message : 'Unknown chat error',
          reservation.metering,
        )
      : undefined

    return Response.json(
      {
        error:
          error instanceof Error
            ? `Chat service error: ${error.message}`
            : 'Unknown chat service error.',
        balance,
      },
      { status: 500, headers: responseHeaders() }
    )
  }
}
