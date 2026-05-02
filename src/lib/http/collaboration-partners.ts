import 'server-only'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { collaborationPartners } from '@/lib/db/schema'

export type PublicCollaborationPartner = {
  id: string
  name: string
  description: string
  updatedAt: string
}

export async function getPublicCollaborationPartners(): Promise<
  PublicCollaborationPartner[]
> {
  const rows = await db
    .select({
      id: collaborationPartners.id,
      name: collaborationPartners.name,
      description: collaborationPartners.description,
      updatedAt: collaborationPartners.updatedAt,
    })
    .from(collaborationPartners)
    .orderBy(
      asc(collaborationPartners.createdAt),
      asc(collaborationPartners.name)
    )

  return rows.map(r => ({
    ...r,
    updatedAt: r.updatedAt.toISOString(),
  }))
}
