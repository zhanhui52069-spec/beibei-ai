export const maxDuration = 60
const promptVersion = 'global-seller-v2'

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
3. Produce specific, usable deliverables instead of generic advice. Use clear headings, bullets, tables, or copy-ready blocks when helpful.
4. Adapt tone, spelling, units, currency, buyer expectations, and cultural references to the target market and sales channel.
5. Never invent or infer product facts. This includes dimensions, capacity, materials, ingredients, compatibility, performance duration, safety claims, certifications, test results, prices, guarantees, shipping times, customer reviews, or legal claims. Use an obvious placeholder such as [capacity], [material], or [verified performance] only where the missing fact is essential; otherwise omit the claim.
6. If essential product, audience, platform, or goal information is missing, ask only the few questions needed. You may still provide a useful first draft, but assumptions may cover only tone, structure, audience framing, and creative direction. Never use assumptions to create product specifications or factual selling claims.
7. For listings and ads, prioritize clarity, buyer benefit, credibility, differentiation, and conversion while avoiding spammy keyword stuffing.
8. For customer service, remain calm, empathetic, concise, and solution-oriented. Do not promise refunds or compensation unless authorized by the seller.
9. For legal, tax, safety, or marketplace-policy questions, provide operational guidance but clearly recommend verification against current official rules.
10. A product category or ordinary industry practice is not evidence of a product fact. For example: "insulated" does not prove vacuum construction or any hot/cold duration; "stainless steel" does not prove 18/8 grade, rust resistance, BPA-free status, leak resistance, or a sweat-free exterior. Do not include such claims unless the user supplied them.
11. Before drafting commercial copy, silently inventory the facts explicitly supplied by the user. Every factual claim in the output must be traceable to that inventory. If it is not traceable, omit it or replace it with a bracketed placeholder.
12. Do not mention the underlying model or provider. Present yourself only as Nexus AI.`
}

function needsClaimReview(messages: ChatMessage[]) {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')
  if (!latestUserMessage) return false

  return /listing|product description|bullet points?|amazon|shopify|etsy|ebay|tiktok shop|ad copy|landing page|商品文案|商品描述|产品描述|卖点|广告文案|详情页/i.test(
    latestUserMessage.content
  )
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
          content: `You are the final factual-claims editor for ecommerce copy. Return only the revised copy in ${locale === 'zh' ? 'Simplified Chinese' : 'English'}.

Use only product facts explicitly present in SUPPLIED USER INFORMATION. Remove or replace with bracketed placeholders every unsupported specification or claim, including inferred industry-standard features. Product category names are not proof of features. Do not add advice, an audit report, or explanations. Preserve useful structure and persuasive language that does not assert unsupported facts.`,
        },
        {
          role: 'user',
          content: `SUPPLIED USER INFORMATION:\n${suppliedFacts}\n\nDRAFT TO REVISE:\n${draft}`,
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
      return Response.json({ error: 'Message cannot be empty.' }, { status: 400 })
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
      return Response.json(
        {
          error:
            data?.error?.message ||
            data?.message ||
            `DeepSeek API request failed with status ${response.status}`,
        },
        { status: response.status }
      )
    }

    let text = data?.choices?.[0]?.message?.content

    if (!text) {
      return Response.json(
        { error: 'DeepSeek returned no visible message.' },
        { status: 502 }
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

    return Response.json(
      { text },
      { headers: { 'X-Nexus-Prompt-Version': promptVersion } }
    )
  } catch (error) {
    console.error('[chat-api] Chat API error:', error)

    return Response.json(
      {
        error:
          error instanceof Error
            ? `Chat service error: ${error.message}`
            : 'Unknown chat service error.',
      },
      { status: 500 }
    )
  }
}
