import { createHmac, timingSafeEqual } from 'crypto'

export const sellerPacks = {
  starter: { id: 'starter', price: 7, amountCents: 700, tasks: 200 },
  growth: { id: 'growth', price: 15, amountCents: 1500, tasks: 500 },
  scale: { id: 'scale', price: 29, amountCents: 2900, tasks: 1200 },
} as const

export type SellerPackId = keyof typeof sellerPacks

export function isSellerPackId(value: unknown): value is SellerPackId {
  return typeof value === 'string' && value in sellerPacks
}

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export async function createStripeCheckoutSession(input: {
  packId: SellerPackId
  subjectId: string
  email: string
  appURL: string
}) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) throw new Error('Stripe is not configured')

  const pack = sellerPacks[input.packId]
  const params = new URLSearchParams()
  params.set('mode', 'payment')
  params.set('success_url', `${input.appURL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`)
  params.set('cancel_url', `${input.appURL}/checkout?plan=seller&pack=${pack.id}&cancelled=1`)
  params.set('customer_email', input.email)
  params.set('client_reference_id', input.subjectId)
  params.set('line_items[0][price_data][currency]', 'usd')
  params.set('line_items[0][price_data][unit_amount]', String(pack.amountCents))
  params.set('line_items[0][price_data][product_data][name]', `NexusAI Seller · ${pack.tasks} AI tasks`)
  params.set('line_items[0][price_data][product_data][description]', 'AI task credits valid for 12 months')
  params.set('line_items[0][quantity]', '1')
  params.set('metadata[subject_id]', input.subjectId)
  params.set('metadata[pack_id]', pack.id)
  params.set('metadata[tasks]', String(pack.tasks))
  params.set('metadata[amount_cents]', String(pack.amountCents))
  params.set('payment_intent_data[metadata][subject_id]', input.subjectId)
  params.set('payment_intent_data[metadata][pack_id]', pack.id)

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.url || !data?.id) {
    throw new Error(data?.error?.message || `Stripe checkout failed with status ${response.status}`)
  }

  return { id: data.id as string, url: data.url as string }
}

export function verifyStripeWebhook(payload: string, signatureHeader: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) throw new Error('Stripe webhook secret is not configured')

  const parts = signatureHeader.split(',').map((part) => part.trim().split('='))
  const timestamp = parts.find(([key]) => key === 't')?.[1]
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value)

  if (!timestamp || signatures.length === 0) return false
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false

  const expected = createHmac('sha256', webhookSecret).update(`${timestamp}.${payload}`, 'utf8').digest('hex')
  const expectedBuffer = Buffer.from(expected, 'hex')

  return signatures.some((signature) => {
    try {
      const receivedBuffer = Buffer.from(signature, 'hex')
      return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
    } catch {
      return false
    }
  })
}
