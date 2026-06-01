type IncomingMessage = {
  role?: string
  content?: string
  parts?: Array<{
    type?: string
    text?: string
  }>
}

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export const maxDuration = 60

const baseURL = process.env.OPENAI_BASE_URL || 'https://api.deepseek.com/v1'
const modelName = process.env.MODEL_NAME || 'deepseek-chat'

function normalizeMessages(messages: IncomingMessage[] = []): ChatMessage[] {
  return messages
    .map((message) => {
      if (message.role !== 'user' && message.role !== 'assistant' && message.role !== 'system') {
        return null
      }

      const content =
        message.content ||
        message.parts
          ?.filter((part) => part.type === 'text' && part.text)
          .map((part) => part.text)
          .join('\n') ||
        ''

      return {
        role: message.role,
        content: content.trim(),
      }
    })
    .filter((message): message is ChatMessage => Boolean(message?.content))
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: '请在 Vercel 环境变量中配置 OPENAI_API_KEY。' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const messages = normalizeMessages(body.messages)

    if (!messages.length) {
      return Response.json({ error: '消息不能为空。' }, { status: 400 })
    }

    const response = await fetch(`${baseURL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content:
              '你是 NexusAI 的智能助手，由 DeepSeek 提供支持。请用中文友好、专业、简洁地回答用户问题。',
          },
          ...messages,
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.message ||
        `DeepSeek API 请求失败，状态码 ${response.status}`

      return Response.json({ error: message }, { status: response.status })
    }

    const text = data?.choices?.[0]?.message?.content

    if (!text) {
      return Response.json({ error: 'DeepSeek 没有返回可显示的回复。' }, { status: 502 })
    }

    return Response.json({ text })
  } catch (error) {
    console.error('[chat-api] Chat API error:', error)
    const message = error instanceof Error ? error.message : '未知错误'

    return Response.json(
      { error: `聊天服务出错：${message}` },
      { status: 500 }
    )
  }
}
