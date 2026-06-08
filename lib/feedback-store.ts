export type FeedbackRecord = {
  id?: string
  name: string
  email: string
  role: string
  category: string
  message: string
  locale: string
  status?: string
  created_at?: string
  createdAt?: string
}

type StoreStatus = {
  configured: boolean
  missing: string[]
  supabaseURL: string
  serviceRoleKey: string
}

function getStoreStatus(): StoreStatus {
  const supabaseURL = process.env.SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const missing = []

  if (!supabaseURL) missing.push('SUPABASE_URL')
  if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')

  return {
    configured: missing.length === 0,
    missing,
    supabaseURL,
    serviceRoleKey,
  }
}

function getHeaders(status: StoreStatus) {
  return {
    apikey: status.serviceRoleKey,
    Authorization: `Bearer ${status.serviceRoleKey}`,
    'Content-Type': 'application/json',
  }
}

export function getFeedbackStoreStatus() {
  const status = getStoreStatus()

  return {
    configured: status.configured,
    missing: status.missing,
  }
}

export async function saveFeedback(feedback: FeedbackRecord) {
  const status = getStoreStatus()

  if (!status.configured) {
    return { stored: false, reason: 'missing_supabase_config' }
  }

  const response = await fetch(`${status.supabaseURL.replace(/\/$/, '')}/rest/v1/feedback`, {
    method: 'POST',
    headers: {
      ...getHeaders(status),
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: feedback.name,
      email: feedback.email,
      role: feedback.role,
      category: feedback.category,
      message: feedback.message,
      locale: feedback.locale,
      status: feedback.status || 'new',
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Supabase feedback insert failed: ${response.status} ${detail}`)
  }

  return { stored: true }
}

export async function listFeedback() {
  const status = getStoreStatus()

  if (!status.configured) {
    return { configured: false, missing: status.missing, items: [] as FeedbackRecord[] }
  }

  const response = await fetch(
    `${status.supabaseURL.replace(/\/$/, '')}/rest/v1/feedback?select=*&order=created_at.desc&limit=100`,
    {
      method: 'GET',
      headers: getHeaders(status),
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Supabase feedback query failed: ${response.status} ${detail}`)
  }

  const items = (await response.json()) as FeedbackRecord[]

  return { configured: true, missing: [] as string[], items }
}
