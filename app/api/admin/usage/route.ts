import { adjustAiCredits, getUsageBalance, setTeamAccess } from '@/lib/usage-store'

function verifyAdmin(req: Request) {
  return Boolean(process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD)
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) return Response.json({ error: 'Invalid admin password.' }, { status: 401 })
  const url = new URL(req.url)
  const subjectId = url.searchParams.get('subjectId')?.trim()
  if (!subjectId) return Response.json({ error: 'subjectId is required.' }, { status: 400 })

  return Response.json({ balance: await getUsageBalance(subjectId) })
}

export async function POST(req: Request) {
  if (!verifyAdmin(req)) return Response.json({ error: 'Invalid admin password.' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const subjectId = body?.subjectId?.trim()
  if (!subjectId) return Response.json({ error: 'subjectId is required.' }, { status: 400 })

  if (body.action === 'team') {
    return Response.json({ balance: await setTeamAccess(subjectId, Boolean(body.active), body.email || '') })
  }

  const amount = Number(body.amount)
  if (!Number.isInteger(amount) || amount === 0) {
    return Response.json({ error: 'amount must be a non-zero integer.' }, { status: 400 })
  }

  const eventType = ['purchase', 'refund', 'adjustment'].includes(body.eventType)
    ? body.eventType
    : 'adjustment'

  return Response.json({
    balance: await adjustAiCredits({
      subjectId,
      amount,
      eventType,
      note: body.note,
      email: body.email,
    }),
  })
}
