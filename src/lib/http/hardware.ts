import 'server-only'
import { asc, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hardware, hardwareModules } from '@/lib/db/schema'

export type PublicHardwareModule = {
  id: string
  title: string
  iconKey: string
  description: string
  updatedAt: string
}

export type PublicHardwareBlock = {
  id: string
  title: string
  modules: PublicHardwareModule[]
}

/** Vários equipamentos; cada um com seus módulos (ordem: data de cadastro do hardware). */
export async function getPublicHardwareList(): Promise<PublicHardwareBlock[]> {
  const hws = await db
    .select({
      id: hardware.id,
      title: hardware.title,
    })
    .from(hardware)
    .orderBy(asc(hardware.createdAt), asc(hardware.title))

  if (hws.length === 0) return []

  const hwIds = hws.map(h => h.id)
  const allMods = await db
    .select({
      id: hardwareModules.id,
      hardwareId: hardwareModules.hardwareId,
      title: hardwareModules.title,
      iconKey: hardwareModules.iconKey,
      description: hardwareModules.description,
      updatedAt: hardwareModules.updatedAt,
      sortOrder: hardwareModules.sortOrder,
      createdAt: hardwareModules.createdAt,
    })
    .from(hardwareModules)
    .where(inArray(hardwareModules.hardwareId, hwIds))
    .orderBy(
      asc(hardwareModules.hardwareId),
      asc(hardwareModules.sortOrder),
      asc(hardwareModules.createdAt),
      asc(hardwareModules.id)
    )

  const byHw = new Map<string, typeof allMods>()
  for (const m of allMods) {
    const list = byHw.get(m.hardwareId) ?? []
    list.push(m)
    byHw.set(m.hardwareId, list)
  }

  return hws.map(hw => ({
    id: hw.id,
    title: hw.title,
    modules: (byHw.get(hw.id) ?? []).map(m => ({
      id: m.id,
      title: m.title,
      iconKey: m.iconKey,
      description: m.description,
      updatedAt: m.updatedAt.toISOString(),
    })),
  }))
}
