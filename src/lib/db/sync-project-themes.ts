import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectProjectThemes } from '@/lib/db/schema'

export async function syncProjectThemes(projectId: string, themeIds: string[]) {
  await db
    .delete(projectProjectThemes)
    .where(eq(projectProjectThemes.projectId, projectId))
  const unique = [...new Set(themeIds)]
  if (unique.length === 0) return
  await db
    .insert(projectProjectThemes)
    .values(unique.map(themeId => ({ projectId, themeId })))
}
