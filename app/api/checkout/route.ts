import { createStripeCheckoutSession, isSellerPackId, stripeConfigured } from '@/lib/stripe-rest'
import { getUsageSubject, usageCookieHeader } from '@/lib/usage-subject'
import { appendSetCookies } from '@/lib/supabase-auth'

export const runtime = 'nodejs'

export async function GET() {
  return Response.json({ enabled: stripeConfigured() })
}

export async function POST(req: Request) {
  try {
    if (!stripeConfigured()) {
      return Response.json({ error: 'Secure payment is not configured yet.' }, { status: 503 })
    }

    const body = await req.json().catch(() => null)
    if (!isSellerPackId(body?.packId)) {
      return Response.json({ error: 'Invalid task pack.' }, { status: 400 })
    }

    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const subject = await getUsageSubject(req)
    const origin = new URL(req.url).origin
    const configuredURL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    const appURL = configuredURL || origin
    const session = await createStripeCheckoutSession({
      packId: body.packId,
      subjectId: subject.subjectId,
      email,
      appURL,
    })

    const headers = new Headers()
    appendSetCookies(headers, subject.setCookies)
    if (subject.isNew) headers.append('Set-Cookie', usageCookieHeader(subject.subjectId))
    return Response.json({ url: session.url }, { headers })
  } catch (error) {
    console.error('[checkout] Could not create Stripe session:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Could not start secure checkout.' },
      { status: 500 },
    )
  }
}
