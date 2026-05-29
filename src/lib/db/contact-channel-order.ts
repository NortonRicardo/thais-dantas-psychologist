import { asc, eq } from 'drizzle-orm'

import { db } from './index'
import { contactChannels } from './schema'

/** Reindexa sort_order para 0..n-1 após remoção, preservando a ordem de exibição. */
export async function compactContactChannelSortOrders(contactInfoId: string) {
  const rows = await db
    .select({ id: contactChannels.id })
    .from(contactChannels)
    .where(eq(contactChannels.contactInfoId, contactInfoId))
    .orderBy(asc(contactChannels.sortOrder), asc(contactChannels.createdAt))

  await Promise.all(
    rows.map((row, index) =>
      db
        .update(contactChannels)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(contactChannels.id, row.id))
    )
  )
}
