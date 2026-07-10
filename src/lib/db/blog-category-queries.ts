import { asc, eq } from 'drizzle-orm'
import { db } from './index'
import { blogCategories, type BlogCategory } from './schema'

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

/** Renomeia a categoria — os artigos referenciam por id, então nada mais precisa mudar. */
export async function renameCategory(
  id: string,
  name: string
): Promise<BlogCategory | undefined> {
  const [updated] = await db
    .update(blogCategories)
    .set({ name })
    .where(eq(blogCategories.id, id))
    .returning()
  return updated
}
