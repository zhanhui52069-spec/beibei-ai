export const maxDuration = 60

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
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

      if (!['user', 'assistant', 'system'].includes(role)) return null
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
            content:
              'You are NexusAI, a helpful AI assistant powered by DeepSeek. Reply clearly and helpfully.',
          },
          ...messages,
        ],
        temperature: 0.7,
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
