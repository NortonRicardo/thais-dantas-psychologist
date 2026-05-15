import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hardware, hardwareModules } from '@/lib/db/schema'
import { hardwareUpsertBodySchema } from '@/lib/validation/infraestrutura-api'
import {
  validationErrorResponse,
  uuidParamSafeParse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const raw = await req.json()
    const parsed = hardwareUpsertBodySchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { title, modules } = parsed.data

    const [existing] = await db
      .select({ id: hardware.id })
      .from(hardware)
      .where(eq(hardware.id, id))
      .limit(1)

    if (!existing) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    await db.transaction(async tx => {
      await tx
        .update(hardware)
        .set({ title, updatedAt: new Date() })
        .where(eq(hardware.id, id))

      await tx.delete(hardwareModules).where(eq(hardwareModules.hardwareId, id))

      if (modules.length > 0) {
        await tx.insert(hardwareModules).values(
          modules.map((m, i) => ({
            hardwareId: id,
            title: m.title,
            iconKey: m.iconKey,
            description: m.description,
            sortOrder: i,
          }))
        )
      }
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[PUT /api/hardware/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar equipamento' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const [existing] = await db
      .select({ id: hardware.id })
      .from(hardware)
      .where(eq(hardware.id, id))
      .limit(1)

    if (!existing) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    await db.delete(hardware).where(eq(hardware.id, id))
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/hardware/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover equipamento' },
      { status: 500 }
    )
  }
}
