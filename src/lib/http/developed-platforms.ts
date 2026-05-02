import 'server-only'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { developedPlatforms } from '@/lib/db/schema'

export type PublicDevelopedPlatform = {
  id: string
  title: string
  description: string
  projectLink: string | null
  platformLink: string | null
  badge: string | null
  iconKey: string
  updatedAt: string
}

export async function getPublicDevelopedPlatforms(): Promise<
  PublicDevelopedPlatform[]
> {
  const rows = await db
    .select({
      id: developedPlatforms.id,
      title: developedPlatforms.title,
      description: developedPlatforms.description,
      projectLink: developedPlatforms.projectLink,
      platformLink: developedPlatforms.platformLink,
      badge: developedPlatforms.badge,
      iconKey: developedPlatforms.iconKey,
      updatedAt: developedPlatforms.updatedAt,
    })
    .from(developedPlatforms)
    .orderBy(asc(developedPlatforms.createdAt), asc(developedPlatforms.title))

  return rows.map(r => ({
    ...r,
    updatedAt: r.updatedAt.toISOString(),
  }))
}
