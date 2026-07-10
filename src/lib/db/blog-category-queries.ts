import { asc, eq } from 'drizzle-orm'
import { db } from './index'
import { blogCategories, blogPosts, type BlogCategory } from './schema'

export async function listCategories(): Promise<BlogCategory[]> {
  return db.select().from(blogCategories).orderBy(asc(blogCategories.name))
}

export async function isCategoryNameTaken(name: string): Promise<boolean> {
  const [row] = await db
    .select({ id: blogCategories.id })
    .from(blogCategories)
    .where(eq(blogCategories.name, name))
    .limit(1)
  return !!row
}

export async function createCategory(name: string): Promise<BlogCategory> {
  const [created] = await db
    .insert(blogCategories)
    .values({ name })
    .returning()
  return created
}

export async function getCategoryById(
  id: string
): Promise<BlogCategory | undefined> {
  const [row] = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.id, id))
    .limit(1)
  return row
}

/** Renomeia a categoria e propaga o novo nome para todos os artigos que a usam. */
export async function renameCategory(
  id: string,
  name: string
): Promise<BlogCategory | undefined> {
  return db.transaction(async tx => {
    const [existing] = await tx
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1)
    if (!existing) return undefined

    const [updated] = await tx
      .update(blogCategories)
      .set({ name })
      .where(eq(blogCategories.id, id))
      .returning()

    if (existing.name !== name) {
      await tx
        .update(blogPosts)
        .set({ category: name })
        .where(eq(blogPosts.category, existing.name))
    }

    return updated
  })
}
