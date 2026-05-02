import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hardware, hardwareModules } from '@/lib/db/schema'

const MAX_MODULES_PER_HW = 48

type ModulePayload = {
  title: string
  iconKey: string
  description: string
}

function validateModules(modules: ModulePayload[], title: string) {
  if (modules.length > MAX_MODULES_PER_HW) {
    return `No máximo ${MAX_MODULES_PER_HW} módulos neste equipamento`
  }
  for (let i = 0; i < modules.length; i++) {
    const m = modules[i]
    const modTitle = (m.title ?? '').trim()
    const description = (m.description ?? '').trim()
    if (!modTitle || !description) {
      return `“${title}”, módulo ${i + 1}: título e descrição obrigatórios`
    }
  }
  return null
}

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const body = (await req.json()) as {
      title?: string
      modules?: ModulePayload[]
    }

    const title = (body.title ?? '').trim()
    const modules = Array.isArray(body.modules) ? body.modules : []

    if (!title) {
      return NextResponse.json({ error: 'Título obrigatório' }, { status: 400 })
    }

    const modErr = validateModules(modules, title)
    if (modErr) {
      return NextResponse.json({ error: modErr }, { status: 400 })
    }

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
            title: m.title.trim(),
            iconKey: (m.iconKey ?? '').trim(),
            description: m.description.trim(),
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
