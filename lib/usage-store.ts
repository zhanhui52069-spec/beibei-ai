export type UsageBalance = {
  subjectId: string
  plan: 'free' | 'seller' | 'team'
  unlimited: boolean
  freeRemaining: number
  creditRemaining: number
  totalRemaining: number
  nextResetAt: string
  metering: boolean
}

type UsageReservation = UsageBalance & {
  allowed: boolean
  reservationId?: string
  reason?: string
}

function getUsageConfig() {
  const supabaseURL = process.env.SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return { supabaseURL, serviceRoleKey, configured: Boolean(supabaseURL && serviceRoleKey) }
}

function fallbackBalance(subjectId: string): UsageBalance {
  return {
    subjectId,
    plan: 'free',
    unlimited: false,
    freeRemaining: 5,
    creditRemaining: 0,
    totalRemaining: 5,
    nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    metering: false,
  }
}

async function callRpc<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const config = getUsageConfig()
  if (!config.configured) throw new Error('Usage database is not configured')

  const response = await fetch(`${config.supabaseURL.replace(/\/$/, '')}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Usage RPC ${name} failed: ${response.status} ${detail}`)
  }

  return response.json() as Promise<T>
}

function withMetering(balance: Omit<UsageBalance, 'metering'>): UsageBalance {
  return { ...balance, metering: true }
}

export async function getUsageBalance(subjectId: string) {
  if (!getUsageConfig().configured) return fallbackBalance(subjectId)

  try {
    const balance = await callRpc<Omit<UsageBalance, 'metering'>>('get_ai_balance', {
      p_subject_id: subjectId,
    })
    return withMetering(balance)
  } catch (error) {
    console.error('[usage] Balance unavailable, allowing unmetered access:', error)
    return fallbackBalance(subjectId)
  }
}

export async function reserveAiTask(subjectId: string, requestId: string): Promise<UsageReservation> {
  if (!getUsageConfig().configured) {
    return { ...fallbackBalance(subjectId), allowed: true, reservationId: requestId }
  }

  try {
    const reservation = await callRpc<Omit<UsageReservation, 'metering'>>('reserve_ai_task', {
      p_subject_id: subjectId,
      p_request_id: requestId,
    })
    return { ...reservation, metering: true }
  } catch (error) {
    console.error('[usage] Reservation unavailable, allowing unmetered access:', error)
    return { ...fallbackBalance(subjectId), allowed: true, reservationId: requestId }
  }
}

export async function completeAiTask(subjectId: string, requestId: string, metering: boolean) {
  if (!metering) return fallbackBalance(subjectId)

  try {
    return withMetering(
      await callRpc<Omit<UsageBalance, 'metering'>>('complete_ai_task', {
        p_subject_id: subjectId,
        p_request_id: requestId,
      }),
    )
  } catch (error) {
    console.error('[usage] Could not complete reservation, attempting release:', error)
    return releaseAiTask(subjectId, requestId, 'Completion sync failed', true)
  }
}

export async function releaseAiTask(subjectId: string, requestId: string, reason: string, metering: boolean) {
  if (!metering) return fallbackBalance(subjectId)
  try {
    return withMetering(
      await callRpc<Omit<UsageBalance, 'metering'>>('release_ai_task', {
        p_subject_id: subjectId,
        p_request_id: requestId,
        p_reason: reason,
      }),
    )
  } catch (error) {
    console.error('[usage] Could not release reservation:', error)
    return fallbackBalance(subjectId)
  }
}

export async function adjustAiCredits(input: {
  subjectId: string
  amount: number
  eventType: 'purchase' | 'refund' | 'adjustment'
  note?: string
  email?: string
}) {
  return withMetering(
    await callRpc<Omit<UsageBalance, 'metering'>>('adjust_ai_credits', {
      p_subject_id: input.subjectId,
      p_amount: input.amount,
      p_event_type: input.eventType,
      p_note: input.note || '',
      p_email: input.email || '',
    }),
  )
}

export async function setTeamAccess(subjectId: string, active: boolean, email = '') {
  return withMetering(
    await callRpc<Omit<UsageBalance, 'metering'>>('set_team_access', {
      p_subject_id: subjectId,
      p_active: active,
      p_email: email,
    }),
  )
}

export async function mergeUsageSubject(sourceSubjectId: string, targetSubjectId: string, email = '') {
  if (!getUsageConfig().configured || sourceSubjectId === targetSubjectId) {
    return getUsageBalance(targetSubjectId)
  }

  return withMetering(
    await callRpc<Omit<UsageBalance, 'metering'>>('merge_usage_subject', {
      p_source_subject_id: sourceSubjectId,
      p_target_subject_id: targetSubjectId,
      p_email: email,
    }),
  )
}

export async function fulfillAiPurchase(input: {
  providerReference: string
  subjectId: string
  email: string
  packId: string
  tasks: number
  amountCents: number
  currency: string
}) {
  return withMetering(
    await callRpc<Omit<UsageBalance, 'metering'>>('fulfill_ai_purchase', {
      p_provider_reference: input.providerReference,
      p_subject_id: input.subjectId,
      p_email: input.email,
      p_pack_id: input.packId,
      p_tasks: input.tasks,
      p_amount_cents: input.amountCents,
      p_currency: input.currency,
    }),
  )
}
