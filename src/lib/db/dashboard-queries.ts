import { and, count, desc, eq, gte, sql } from 'drizzle-orm'
import { startOfMonth, startOfWeek } from 'date-fns'
import { db } from './index'
import { blogPostViews, blogPosts, pageViews } from './schema'

export async function getPublishedArticleCountSince(
  since: Date
): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(blogPosts)
    .where(
      and(eq(blogPosts.published, true), gte(blogPosts.publishedAt, since))
    )
  return row?.value ?? 0
}

export async function getSiteVisitCountSince(since: Date): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
  return row?.value ?? 0
}

export type MostReadPost = {
  id: string
  title: string
  slug: string
  reads: number
}

export async function getMostReadPostSince(
  since: Date
): Promise<MostReadPost | undefined> {
  const [row] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      reads: count(blogPostViews.id),
    })
    .from(blogPostViews)
    .innerJoin(blogPosts, eq(blogPostViews.postId, blogPosts.id))
    .where(gte(blogPostViews.createdAt, since))
    .groupBy(blogPosts.id)
    .orderBy(desc(sql`count(${blogPostViews.id})`))
    .limit(1)
  return row
}

export async function getDashboardStats() {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const monthStart = startOfMonth(now)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    articlesThisWeek,
    articlesThisMonth,
    siteVisits30d,
    mostReadThisWeek,
    mostReadThisMonth,
  ] = await Promise.all([
    getPublishedArticleCountSince(weekStart),
    getPublishedArticleCountSince(monthStart),
    getSiteVisitCountSince(thirtyDaysAgo),
    getMostReadPostSince(weekStart),
    getMostReadPostSince(monthStart),
  ])

  return {
    articlesThisWeek,
    articlesThisMonth,
    siteVisits30d,
    mostReadThisWeek,
    mostReadThisMonth,
  }
}
