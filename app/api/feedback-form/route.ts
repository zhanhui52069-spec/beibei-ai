import { saveFeedback } from '@/lib/feedback-store'

export const maxDuration = 20

function html(message: string, status = 200) {
  return new Response(
    `<!doctype html><html><body><p>${message}</p></body></html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const message = String(form.get('message') || '').trim()

    if (!message) {
      return html('Message is required.', 400)
    }

    const feedback = {
      name: String(form.get('name') || '').trim() || 'Anonymous',
      email: String(form.get('email') || '').trim(),
      role: String(form.get('role') || '').trim(),
      category: String(form.get('category') || '').trim(),
      message,
      locale: String(form.get('locale') || 'en'),
      createdAt: new Date().toISOString(),
    }

    console.log('[feedback-form]', feedback)

    await saveFeedback(feedback).catch((error) => {
      console.error('[feedback-form] Database storage failed:', error)
    })

    return html('Feedback saved.')
  } catch (error) {
    console.error('[feedback-form] Feedback form error:', error)
    return html('Feedback service error.', 500)
  }
}
