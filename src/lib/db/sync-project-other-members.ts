import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectOtherMembers } from '@/lib/db/schema'

export async function syncProjectOtherMembers(
  projectId: string,
  memberIds: string[]
) {
  await db
    .delete(projectOtherMembers)
    .where(eq(projectOtherMembers.projectId, projectId))
  const unique = [...new Set(memberIds)]
  if (unique.length === 0) return
  await db
    .insert(projectOtherMembers)
    .values(unique.map((memberId, i) => ({ projectId, memberId, sortOrder: i })))
}
