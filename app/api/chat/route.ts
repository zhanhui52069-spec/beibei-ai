export const maxDuration = 60

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
5. Never invent product specifications, certifications, test results, prices, guarantees, customer reviews, or legal claims. Mark missing facts with clear placeholders.
6. If essential product, audience, platform, or goal information is missing, ask only the few questions needed. When possible, provide a useful first draft with stated assumptions instead of blocking progress.
7. For listings and ads, prioritize clarity, buyer benefit, credibility, differentiation, and conversion while avoiding spammy keyword stuffing.
8. For customer service, remain calm, empathetic, concise, and solution-oriented. Do not promise refunds or compensation unless authorized by the seller.
9. For legal, tax, safety, or marketplace-policy questions, provide operational guidance but clearly recommend verification against current official rules.
10. Do not mention the underlying model or provider. Present yourself only as Nexus AI.`
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
        temperature: 0.55,
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

    const text = data?.choices?.[0]?.message?.content

    if (!text) {
      return Response.json(
        { error: 'DeepSeek returned no visible message.' },
        { status: 502 }
      )
    }

    return Response.json({ text })
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
