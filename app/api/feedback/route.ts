export const maxDuration = 20

import { saveFeedback } from '@/lib/feedback-store'

type FeedbackPayload = {
  name?: string
  email?: string
  role?: string
  category?: string
  message?: string
  locale?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as FeedbackPayload | null

    if (!body?.message?.trim()) {
      return Response.json({ error: 'Feedback message is required.' }, { status: 400 })
    }

    const feedback = {
      name: body.name?.trim() || 'Anonymous',
      email: body.email?.trim() || '',
      role: body.role?.trim() || '',
      category: body.category?.trim() || '',
      message: body.message.trim(),
      locale: body.locale || 'en',
      createdAt: new Date().toISOString(),
    }

    console.log('[feedback]', feedback)

    const storeResult = await saveFeedback(feedback).catch((error) => {
      console.error('[feedback] Database storage failed:', error)
      return { stored: false, reason: 'database_storage_failed' }
    })

    const webhookURL = process.env.FEEDBACK_WEBHOOK_URL

    if (webhookURL) {
      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      }).catch((error) => {
        console.error('[feedback] Webhook delivery failed:', error)
      })
    }

    return Response.json({ ok: true, stored: storeResult.stored })
  } catch (error) {
    console.error('[feedback] Feedback API error:', error)
    return Response.json({ error: 'Feedback service error.' }, { status: 500 })
  }
}
