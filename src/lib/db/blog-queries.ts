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
import { blogPosts, type BlogPost, type NewBlogPost } from './schema'
import { deriveExcerpt } from '@/lib/blog/excerpt'
import { estimateReadTimeMinutes } from '@/lib/blog/reading-time'
import { sanitizeArticleHtml } from '@/lib/blog/sanitize'
import { slugify } from '@/lib/blog/slug'

const ADMIN_LIST_FIELDS = {
  id: blogPosts.id,
  slug: blogPosts.slug,
  title: blogPosts.title,
  category: blogPosts.category,
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
  category: blogPosts.category,
  coverImageUrl: blogPosts.coverImageUrl,
  views: blogPosts.views,
  readTimeMinutes: blogPosts.readTimeMinutes,
  publishedAt: blogPosts.publishedAt,
}

/* ─── Admin ──────────────────────────────────────────────────────────────── */

export async function listPostsForAdmin() {
  return db
    .select(ADMIN_LIST_FIELDS)
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)
  return row
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
  category: string
  slug?: string
  coverImageUrl?: string | null
  bodyHtml: string
  published: boolean
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const bodyHtml = sanitizeArticleHtml(input.bodyHtml)
  const slug = await generateUniqueSlug(slugify(input.slug || input.title))

  const values: NewBlogPost = {
    title: input.title,
    subtitle: input.subtitle,
    category: input.category,
    slug,
    coverImageUrl: input.coverImageUrl,
    bodyHtml,
    excerpt: deriveExcerpt(bodyHtml),
    readTimeMinutes: estimateReadTimeMinutes(bodyHtml),
    published: input.published,
    publishedAt: input.published ? new Date() : null,
  }

  const [created] = await db.insert(blogPosts).values(values).returning()
  return created
}

export async function updatePost(
  id: string,
  input: BlogPostInput
): Promise<BlogPost | undefined> {
  const existing = await getPostById(id)
  if (!existing) return undefined

  const bodyHtml = sanitizeArticleHtml(input.bodyHtml)
  const slug = input.slug
    ? await generateUniqueSlug(slugify(input.slug), id)
    : existing.slug

  const justPublished = input.published && !existing.published

  const [updated] = await db
    .update(blogPosts)
    .set({
      title: input.title,
      subtitle: input.subtitle,
      category: input.category,
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

  return updated
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
  if (categories && categories.length > 0)
    conditions.push(inArray(blogPosts.category, categories))
  if (search) {
    const term = `%${search}%`
    const searchCondition = or(
      ilike(blogPosts.title, term),
      ilike(blogPosts.excerpt, term),
      ilike(blogPosts.category, term)
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

  return { items, total: totalRows[0]?.value ?? 0, page, perPage }
}

export async function getPublishedCategories(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: blogPosts.category })
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
  return rows.map(r => r.category).sort((a, b) => a.localeCompare(b, 'pt'))
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
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

  return row
}
