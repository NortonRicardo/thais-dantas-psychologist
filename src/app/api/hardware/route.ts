import { NextRequest, NextResponse } from 'next/server'
import { asc, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hardware, hardwareModules } from '@/lib/db/schema'

const MAX_HARDWARE = 24
const MAX_MODULES_PER_HW = 48

export async function GET() {
  try {
    const hws = await db
      .select({
        id: hardware.id,
        title: hardware.title,
        createdAt: hardware.createdAt,
        updatedAt: hardware.updatedAt,
      })
      .from(hardware)
      .orderBy(asc(hardware.createdAt), asc(hardware.title))

    if (hws.length === 0) {
      return NextResponse.json({ items: [] })
    }

    const hwIds = hws.map(h => h.id)
    const mods = await db
      .select({
        id: hardwareModules.id,
        hardwareId: hardwareModules.hardwareId,
        title: hardwareModules.title,
        iconKey: hardwareModules.iconKey,
        description: hardwareModules.description,
        sortOrder: hardwareModules.sortOrder,
        createdAt: hardwareModules.createdAt,
        updatedAt: hardwareModules.updatedAt,
      })
      .from(hardwareModules)
      .where(inArray(hardwareModules.hardwareId, hwIds))
      .orderBy(
        asc(hardwareModules.hardwareId),
        asc(hardwareModules.sortOrder),
        asc(hardwareModules.createdAt),
        asc(hardwareModules.id)
      )

    const byHw = new Map<string, typeof mods>()
    for (const m of mods) {
      const list = byHw.get(m.hardwareId) ?? []
      list.push(m)
      byHw.set(m.hardwareId, list)
    }

    const items = hws.map(hw => ({
      id: hw.id,
      title: hw.title,
      createdAt: hw.createdAt.toISOString(),
      updatedAt: hw.updatedAt.toISOString(),
      modules: (byHw.get(hw.id) ?? []).map(m => ({
        id: m.id,
        title: m.title,
        iconKey: m.iconKey,
        description: m.description,
        sortOrder: m.sortOrder,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      })),
    }))

    return NextResponse.json({ items })
  } catch (err) {
    console.error('[GET /api/hardware]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar hardware' },
      { status: 500 }
    )
  }
}

type ModulePayload = {
  title: string
  iconKey: string
  description: string
}

/** Cria um único equipamento (usado pelo gestor ao adicionar). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      title?: string
      modules?: ModulePayload[]
    }

    const title = (body.title ?? '').trim()
    const modules = Array.isArray(body.modules) ? body.modules : []

    if (!title) {
      return NextResponse.json({ error: 'Título obrigatório' }, { status: 400 })
    }

    const rows = await db.select({ id: hardware.id }).from(hardware)
    if (rows.length >= MAX_HARDWARE) {
      return NextResponse.json(
        { error: `No máximo ${MAX_HARDWARE} equipamentos` },
        { status: 400 }
      )
    }

    if (modules.length > MAX_MODULES_PER_HW) {
      return NextResponse.json(
        { error: `No máximo ${MAX_MODULES_PER_HW} módulos` },
        { status: 400 }
      )
    }

    for (let i = 0; i < modules.length; i++) {
      const m = modules[i]
      const title = (m.title ?? '').trim()
      const description = (m.description ?? '').trim()
      if (!title || !description) {
        return NextResponse.json(
          { error: `Módulo ${i + 1}: título e descrição obrigatórios` },
          { status: 400 }
        )
      }
    }

    const [hw] = await db
      .insert(hardware)
      .values({ title })
      .returning({ id: hardware.id })

    if (modules.length > 0) {
      await db.insert(hardwareModules).values(
        modules.map((m, i) => ({
          hardwareId: hw.id,
          title: m.title.trim(),
          iconKey: (m.iconKey ?? '').trim(),
          description: m.description.trim(),
          sortOrder: i,
        }))
      )
    }

    return NextResponse.json({ id: hw.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/hardware]', err)
    return NextResponse.json(
      { error: 'Erro ao criar equipamento' },
      { status: 500 }
    )
  }
}
