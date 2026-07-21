import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { pageViews } from '@/lib/db/schema'

const trackViewSchema = z.object({
  path: z.string().trim().min(1).max(500),
})

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null)
  const parsed = trackViewSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  await db.insert(pageViews).values({ path: parsed.data.path })
  return NextResponse.json({ ok: true })
}
