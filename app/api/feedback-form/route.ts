import { saveFeedback } from '@/lib/feedback-store'

export const maxDuration = 20

export async function POST(req: Request) {
  const redirectURL = new URL('/feedback', req.url)

  try {
    const form = await req.formData()
    const message = String(form.get('message') || '').trim()

    if (!message) {
      redirectURL.searchParams.set('error', '1')
      return Response.redirect(redirectURL, 303)
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

    redirectURL.searchParams.set('sent', '1')
    return Response.redirect(redirectURL, 303)
  } catch (error) {
    console.error('[feedback-form] Feedback form error:', error)
    redirectURL.searchParams.set('error', '1')
    return Response.redirect(redirectURL, 303)
  }
}
