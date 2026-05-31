import { createOpenAI } from '@ai-sdk/openai'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'

export const maxDuration = 60

const baseURL = process.env.OPENAI_BASE_URL || 'https://api.deepseek.com/v1'
const modelName = process.env.MODEL_NAME || 'deepseek-chat'

const deepseek = createOpenAI({
  baseURL,
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'compatible',
})

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: '请在 Vercel 环境变量中配置 OPENAI_API_KEY。' },
        { status: 500 }
      )
    }

    const { messages }: { messages?: UIMessage[] } = await req.json()

    if (!messages?.length) {
      return Response.json({ error: '消息不能为空。' }, { status: 400 })
    }

    const result = streamText({
      model: deepseek(modelName),
      system:
        '你是 NexusAI 的智能助手，由 DeepSeek 提供支持。请用中文友好、专业、简洁地回答用户问题。',
      messages: convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[chat-api] Chat API error:', error)
    const message = error instanceof Error ? error.message : '未知错误'

    return Response.json(
      { error: `聊天服务出错：${message}` },
      { status: 500 }
    )
  }
}
