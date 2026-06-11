import { fulfillAiPurchase } from '@/lib/usage-store'
import { isSellerPackId, sellerPacks, verifyStripeWebhook } from '@/lib/stripe-rest'

export const runtime = 'nodejs'

type StripeCheckoutSession = {
  id?: string
  payment_status?: string
  amount_total?: number
  currency?: string
  customer_details?: { email?: string | null }
  customer_email?: string | null
  metadata?: Record<string, string>
}

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('stripe-signature') || ''

    if (!verifyStripeWebhook(payload, signature)) {
      return Response.json({ error: 'Invalid Stripe signature.' }, { status: 400 })
    }

    const event = JSON.parse(payload) as { id?: string; type?: string; data?: { object?: StripeCheckoutSession } }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data?.object
      const packId = session?.metadata?.pack_id
      const subjectId = session?.metadata?.subject_id

      if (session?.payment_status === 'paid' && session.id && subjectId && isSellerPackId(packId)) {
        const pack = sellerPacks[packId]
        const amountCents = Number(session.amount_total)
        const currency = (session.currency || '').toLowerCase()

        if (amountCents !== pack.amountCents || currency !== 'usd') {
          console.error('[stripe-webhook] Payment mismatch:', { sessionId: session.id, packId, amountCents, currency })
          return Response.json({ error: 'Payment amount mismatch.' }, { status: 400 })
        }

        await fulfillAiPurchase({
          providerReference: session.id,
          subjectId,
          email: session.customer_details?.email || session.customer_email || '',
          packId,
          tasks: pack.tasks,
          amountCents: pack.amountCents,
          currency,
        })
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('[stripe-webhook] Webhook processing failed:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Stripe webhook processing failed.' },
      { status: 500 },
    )
  }
}
