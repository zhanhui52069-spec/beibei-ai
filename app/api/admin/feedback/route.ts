import { getFeedbackStoreStatus, listFeedback } from '@/lib/feedback-store'

function verifyAdmin(req: Request): { ok: true } | { ok: false; response: Response } {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return {
      ok: false,
      response: Response.json(
        { error: 'Missing ADMIN_PASSWORD in environment variables.' },
        { status: 503 },
      ),
    }
  }

  if (req.headers.get('x-admin-password') !== adminPassword) {
    return {
      ok: false,
      response: Response.json({ error: 'Invalid admin password.' }, { status: 401 }),
    }
  }

  return { ok: true }
}

export async function GET(req: Request) {
  try {
    const auth = verifyAdmin(req)

    if (!auth.ok) {
      return auth.response
    }

    const status = getFeedbackStoreStatus()
    const feedback = await listFeedback()

    return Response.json({
      configured: status.configured,
      missing: status.missing,
      items: feedback.items,
    })
  } catch (error) {
    console.error('[admin-feedback] Admin feedback API error:', error)
    return Response.json(
      {
        error:
          error instanceof Error
            ? `Admin feedback service error: ${error.message}`
            : 'Unknown admin feedback service error.',
      },
      { status: 500 },
    )
  }
}
