import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  sql,
} from 'drizzle-orm'
import { db } from './index'
import {
  blogCategories,
  blogPostCategories,
  blogPosts,
  type BlogPost,
  type NewBlogPost,
} from './schema'
import { deriveExcerpt } from '@/lib/blog/excerpt'
import { estimateReadTimeMinutes } from '@/lib/blog/reading-time'
import { sanitizeArticleHtml } from '@/lib/blog/sanitize'
import { slugify } from '@/lib/blog/slug'

export type PostCategory = { id: string; name: string }

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0]

async function getCategoriesForPost(
  postId: string,
  executor: Executor = db
): Promise<PostCategory[]> {
  return executor
    .select({ id: blogCategories.id, name: blogCategories.name })
    .from(blogPostCategories)
    .innerJoin(blogCategories, eq(blogPostCategories.categoryId, blogCategories.id))
    .where(eq(blogPostCategories.postId, postId))
    .orderBy(asc(blogCategories.name))
}

async function getCategoriesForPosts(
  postIds: string[],
  executor: Executor = db
): Promise<Map<string, PostCategory[]>> {
  const map = new Map<string, PostCategory[]>()
  if (postIds.length === 0) return map

  const rows = await executor
    .select({
      postId: blogPostCategories.postId,
      id: blogCategories.id,
      name: blogCategories.name,
    })
    .from(blogPostCategories)
    .innerJoin(blogCategories, eq(blogPostCategories.categoryId, blogCategories.id))
    .where(inArray(blogPostCategories.postId, postIds))
    .orderBy(asc(blogCategories.name))

  for (const row of rows) {
    const list = map.get(row.postId) ?? []
    list.push({ id: row.id, name: row.name })
    map.set(row.postId, list)
  }
  return map
}

async function setPostCategories(
  postId: string,
  categoryIds: string[],
  tx: Executor
) {
  await tx.delete(blogPostCategories).where(eq(blogPostCategories.postId, postId))
  if (categoryIds.length > 0) {
    await tx
      .insert(blogPostCategories)
      .values(categoryIds.map(categoryId => ({ postId, categoryId })))
  }
}

const ADMIN_LIST_FIELDS = {
  id: blogPosts.id,
  slug: blogPosts.slug,
  title: blogPosts.title,
  coverImageUrl: blogPosts.coverImageUrl,
  published: blogPosts.published,
  views: blogPosts.views,
  readTimeMinutes: blogPosts.readTimeMinutes,
  publishedAt: blogPosts.publishedAt,
  createdAt: blogPosts.createdAt,
  updatedAt: blogPosts.updatedAt,
}

const PUBLISHED_LIST_FIELDS = {
  id: blogPosts.id,
  slug: blogPosts.slug,
  title: blogPosts.title,
  subtitle: blogPosts.subtitle,
  excerpt: blogPosts.excerpt,
  coverImageUrl: blogPosts.coverImageUrl,
  views: blogPosts.views,
  readTimeMinutes: blogPosts.readTimeMinutes,
  publishedAt: blogPosts.publishedAt,
}

/* ─── Admin ──────────────────────────────────────────────────────────────── */

export async function listPostsForAdmin() {
  const rows = await db
    .select(ADMIN_LIST_FIELDS)
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
  const categoriesByPost = await getCategoriesForPosts(rows.map(r => r.id))
  return rows.map(row => ({
    ...row,
    categories: categoriesByPost.get(row.id) ?? [],
  }))
}

export async function getPostById(id: string) {
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)
  if (!row) return undefined
  const categories = await getCategoriesForPost(id)
  return { ...row, categories }
}

async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const conditions = excludeId
    ? and(eq(blogPosts.slug, slug), ne(blogPosts.id, excludeId))
    : eq(blogPosts.slug, slug)
  const [row] = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(conditions)
    .limit(1)
  return !!row
}

async function generateUniqueSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  const root = base || 'artigo'
  let candidate = root
  let suffix = 2
  while (await isSlugTaken(candidate, excludeId)) {
    candidate = `${root}-${suffix}`
    suffix++
  }
  return candidate
}

export type BlogPostInput = {
  title: string
  subtitle?: string
  categoryIds: string[]
  slug?: string
  coverImageUrl?: string | null
  bodyHtml: string
  published: boolean
}

export async function createPost(input: BlogPostInput) {
  const bodyHtml = sanitizeArticleHtml(input.bodyHtml)
  const slug = await generateUniqueSlug(slugify(input.slug || input.title))

  const values: NewBlogPost = {
    title: input.title,
    subtitle: input.subtitle,
    slug,
    coverImageUrl: input.coverImageUrl,
    bodyHtml,
    excerpt: deriveExcerpt(bodyHtml),
    readTimeMinutes: estimateReadTimeMinutes(bodyHtml),
    published: input.published,
    publishedAt: input.published ? new Date() : null,
  }

  return db.transaction(async tx => {
    const [created] = await tx.insert(blogPosts).values(values).returning()
    await setPostCategories(created.id, input.categoryIds, tx)
    const categories = await getCategoriesForPost(created.id, tx)
    return { ...created, categories }
  })
}

export async function updatePost(id: string, input: BlogPostInput) {
  const [existing] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)
  if (!existing) return undefined

  const bodyHtml = sanitizeArticleHtml(input.bodyHtml)
  const slug = input.slug
    ? await generateUniqueSlug(slugify(input.slug), id)
    : existing.slug

  const justPublished = input.published && !existing.published

  return db.transaction(async tx => {
    const [updated] = await tx
      .update(blogPosts)
      .set({
        title: input.title,
        subtitle: input.subtitle,
        slug,
        coverImageUrl: input.coverImageUrl,
        bodyHtml,
        excerpt: deriveExcerpt(bodyHtml),
        readTimeMinutes: estimateReadTimeMinutes(bodyHtml),
        published: input.published,
        publishedAt: justPublished ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning()

    await setPostCategories(id, input.categoryIds, tx)
    const categories = await getCategoriesForPost(id, tx)
    return { ...updated, categories }
  })
}

export async function deletePost(id: string): Promise<boolean> {
  const deleted = await db
    .delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning({ id: blogPosts.id })
  return deleted.length > 0
}

/* ─── Público ────────────────────────────────────────────────────────────── */

export type PublishedPostsFilter = {
  search?: string
  categories?: string[]
  sort?: 'recent' | 'oldest' | 'most_read' | 'az' | 'za'
  page?: number
  perPage?: number
}

export async function getPublishedPosts(filters: PublishedPostsFilter = {}) {
  const { search, categories, sort = 'recent', page = 1, perPage = 6 } = filters

  const conditions = [eq(blogPosts.published, true)]
  if (categories && categories.length > 0) {
    const matchingPostIds = db
      .select({ postId: blogPostCategories.postId })
      .from(blogPostCategories)
      .innerJoin(
        blogCategories,
        eq(blogPostCategories.categoryId, blogCategories.id)
      )
      .where(inArray(blogCategories.name, categories))
    conditions.push(inArray(blogPosts.id, matchingPostIds))
  }
  if (search) {
    const term = `%${search}%`
    const searchCondition = or(
      ilike(blogPosts.title, term),
      ilike(blogPosts.excerpt, term)
    )
    if (searchCondition) conditions.push(searchCondition)
  }
  const where = and(...conditions)

  const orderBy =
    sort === 'oldest'
      ? asc(blogPosts.publishedAt)
      : sort === 'most_read'
        ? desc(blogPosts.views)
        : sort === 'az'
          ? asc(blogPosts.title)
          : sort === 'za'
            ? desc(blogPosts.title)
            : desc(blogPosts.publishedAt)

  const [items, totalRows] = await Promise.all([
    db
      .select(PUBLISHED_LIST_FIELDS)
      .from(blogPosts)
      .where(where)
      .orderBy(orderBy)
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ value: count() }).from(blogPosts).where(where),
  ])

  const categoriesByPost = await getCategoriesForPosts(items.map(i => i.id))
  const itemsWithCategories = items.map(item => ({
    ...item,
    categories: categoriesByPost.get(item.id) ?? [],
  }))

  return {
    items: itemsWithCategories,
    total: totalRows[0]?.value ?? 0,
    page,
    perPage,
  }
}

export async function getPublishedCategories(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ name: blogCategories.name })
    .from(blogCategories)
    .innerJoin(
      blogPostCategories,
      eq(blogPostCategories.categoryId, blogCategories.id)
    )
    .innerJoin(blogPosts, eq(blogPostCategories.postId, blogPosts.id))
    .where(eq(blogPosts.published, true))
  return rows.map(r => r.name).sort((a, b) => a.localeCompare(b, 'pt'))
}

export async function getPublishedPostBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
    .limit(1)

  if (!row) return undefined

  db.update(blogPosts)
    .set({ views: sql`${blogPosts.views} + 1` })
    .where(eq(blogPosts.id, row.id))
    .catch(err => console.error('[blog] falha ao incrementar views', err))

  const categories = await getCategoriesForPost(row.id)
  return { ...row, categories }
}
