import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Eye } from 'lucide-react'

import { homeNavItems } from '../_constants/home-nav-items'
import { WHATSAPP_BOOKING_URL } from '../_constants/contact-links'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  getPublishedCategories,
  getPublishedPosts,
} from '@/lib/db/blog-queries'
import { formatPostDate } from '@/lib/blog/format'
import { BlogFilters } from './_components/blog-filters'

export const dynamic = 'force-dynamic'

const PER_PAGE = 4
const VALID_SORTS = ['recent', 'oldest', 'most_read', 'az', 'za'] as const
type SortValue = (typeof VALID_SORTS)[number]

type PublishedPost = Awaited<
  ReturnType<typeof getPublishedPosts>
>['items'][number]

function buildHref(
  sp: Record<string, string | undefined>,
  page: number
): string {
  const params = new URLSearchParams()
  if (sp.search) params.set('search', sp.search)
  if (sp.categories) params.set('categories', sp.categories)
  if (sp.sort) params.set('sort', sp.sort)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/blog?${qs}` : '/blog'
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawSp = await searchParams
  const search = typeof rawSp.search === 'string' ? rawSp.search : undefined
  const categoriesParam =
    typeof rawSp.categories === 'string' ? rawSp.categories : undefined
  const categories = categoriesParam
    ? categoriesParam.split(',').filter(Boolean)
    : []
  const sortParam = typeof rawSp.sort === 'string' ? rawSp.sort : 'recent'
  const sort: SortValue = (VALID_SORTS as readonly string[]).includes(sortParam)
    ? (sortParam as SortValue)
    : 'recent'
  const page = Math.max(1, Number(rawSp.page) || 1)

  const [{ items, total }, availableCategories] = await Promise.all([
    getPublishedPosts({ search, categories, sort, page, perPage: PER_PAGE }),
    getPublishedCategories(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const [featured, ...rest] = items
  const gridItems = page === 1 ? rest : items

  const sp = {
    search,
    categories: categoriesParam,
    sort: sortParam === 'recent' ? undefined : sortParam,
  }

  return (
    <div className="text-[#2D2D2D]">
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="flex flex-col bg-[#556040] px-6 py-6 sm:px-10 sm:py-8">
        <header>
          <div className="mx-auto flex max-w-7xl items-center gap-4 sm:gap-5">
            <nav
              aria-label="Navegação principal"
              className="relative flex min-w-0 flex-1 items-center rounded-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.02)_88%,transparent)] py-2.5 pl-5 pr-3 backdrop-blur-sm sm:py-3 sm:pl-8 sm:pr-4"
            >
              <Link
                href="/"
                className="relative z-10 shrink-0 font-[family-name:var(--font-cinzel)] text-sm font-medium tracking-wide text-white transition-colors hover:text-white/90 sm:text-base"
              >
                Thais Dantas
              </Link>
              <ul className="pointer-events-none absolute inset-0 flex list-none items-center justify-center gap-x-4 p-0 sm:gap-x-8">
                {homeNavItems.map(({ href, label }) => (
                  <li key={label} className="pointer-events-auto">
                    <Link
                      href={href}
                      className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a
              href={WHATSAPP_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#3A4424] shadow-sm transition-colors hover:bg-white sm:px-6 sm:py-2.5"
            >
              Agendar horário
            </a>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-between border-b border-white/15 pb-4 pt-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Blog & Reflexões
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
              {total} artigo{total !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="pb-8 pt-6">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.02] text-white">
              Onde a ciência{' '}
              <em className="italic text-white/45">encontra o cotidiano.</em>
            </h1>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/50">
              Artigos sobre saúde mental, alimentação emocional e bem-estar —
              escritos para quem quer entender mais sobre si mesmo.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTERS ─────────────────────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="h-[57px] border-b border-[#2D2D2D]/8 bg-white/95" />
        }
      >
        <BlogFilters categories={availableCategories} totalResults={total} />
      </Suspense>

      {/* ── ARTICLES ────────────────────────────────────────────────────── */}
      <div className="bg-white px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-7xl">
          {items.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
              <p className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2D2D2D]/40">
                Nenhum artigo encontrado
              </p>
              <p className="text-sm text-[#2D2D2D]/30">
                Tente ajustar os filtros de busca
              </p>
            </div>
          ) : (
            <>
              {featured && page === 1 && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group mb-6 grid overflow-hidden rounded-2xl border border-[#2D2D2D]/8 transition-shadow hover:shadow-lg sm:grid-cols-[55fr_45fr]"
                >
                  {featured.coverImageUrl ? (
                    <div className="relative min-h-[280px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featured.coverImageUrl}
                        alt={featured.title}
                        className="absolute inset-0 h-full w-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-[#556040]/20" />
                      <TagBadge
                        categories={featured.categories}
                        className="absolute bottom-5 left-5"
                        light
                      />
                    </div>
                  ) : (
                    <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-[#556040] p-8">
                      <span className="pointer-events-none absolute -right-4 -top-4 select-none font-[family-name:var(--font-cormorant)] text-[14rem] font-light leading-none text-white/5">
                        01
                      </span>
                      <TagBadge categories={featured.categories} light />
                    </div>
                  )}
                  <div className="flex flex-col justify-between bg-white p-8">
                    <div>
                      <span className="font-[family-name:var(--font-cormorant)] text-[6rem] font-light leading-none text-[#556040]/8 select-none">
                        01
                      </span>
                      <h2 className="-mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(1.6rem,2.4vw,2.4rem)] font-light leading-[1.1] text-[#2D2D2D]">
                        {featured.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-[#2D2D2D]/50">
                        {featured.excerpt}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-4 border-t border-[#556040]/10 pt-5">
                      <span className="text-[11px] text-[#2D2D2D]/40">
                        {featured.publishedAt
                          ? formatPostDate(featured.publishedAt)
                          : ''}
                      </span>
                      <Clock
                        className="size-3 text-[#2D2D2D]/25"
                        strokeWidth={1.5}
                      />
                      <span className="text-[11px] text-[#2D2D2D]/40">
                        {featured.readTimeMinutes} min
                      </span>
                      <Eye
                        className="ml-1 size-3 text-[#2D2D2D]/25"
                        strokeWidth={1.5}
                      />
                      <span className="text-[11px] text-[#2D2D2D]/40">
                        {featured.views.toLocaleString('pt-BR')}
                      </span>
                      <ArrowRight
                        className="ml-auto size-4 text-[#556040]/40 transition-transform group-hover:translate-x-1"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </Link>
              )}

              {gridItems.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gridItems.map((a, i) => (
                    <ArticleCard
                      key={a.id}
                      article={a}
                      index={(page - 1) * PER_PAGE + i}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {totalPages > 1 && (
            <div className="mt-14">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={buildHref(sp, Math.max(1, page - 1))}
                      className={
                        page === 1 ? 'pointer-events-none opacity-40' : ''
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    p => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href={buildHref(sp, p)}
                          isActive={p === page}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href={buildHref(sp, Math.min(totalPages, page + 1))}
                      className={
                        page === totalPages
                          ? 'pointer-events-none opacity-40'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Tag badge ──────────────────────────────────────────────────────────── */
function TagBadge({
  categories,
  className = '',
  light = false,
}: {
  categories: { id: string; name: string }[]
  className?: string
  light?: boolean
}) {
  if (categories.length === 0) return null
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {categories.map(c => (
        <span
          key={c.id}
          className={`inline-block rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] ${light ? 'bg-white/20 text-white' : 'bg-[#556040]/10 text-[#556040]'}`}
        >
          {c.name}
        </span>
      ))}
    </div>
  )
}

/* ─── Article card ───────────────────────────────────────────────────────── */
function ArticleCard({
  article: a,
  index,
}: {
  article: PublishedPost
  index: number
}) {
  const hasImage = !!a.coverImageUrl
  const isDark = !hasImage && index % 2 === 0
  const bg = isDark ? 'bg-[#556040]' : hasImage ? 'bg-white' : 'bg-[#B8AEA4]/30'
  const titleColor = isDark ? 'text-white' : 'text-[#2D2D2D]'
  const mutedColor = isDark ? 'text-white/45' : 'text-[#2D2D2D]/45'
  const borderColor = isDark ? 'border-white/10' : 'border-[#556040]/10'
  const num = String(index + 2).padStart(2, '0')

  return (
    <Link
      href={`/blog/${a.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[#2D2D2D]/8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${bg}`}
    >
      {hasImage && (
        <div className="relative h-48 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.coverImageUrl!}
            alt={a.title}
            className="h-full w-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[#556040]/15" />
          <TagBadge
            categories={a.categories}
            className="absolute bottom-4 left-4"
            light
          />
        </div>
      )}

      <div className="relative flex flex-1 flex-col justify-between p-5">
        {!hasImage && (
          <>
            <span
              className={`pointer-events-none absolute -right-3 -top-4 select-none font-[family-name:var(--font-cormorant)] text-[8rem] font-light leading-none ${isDark ? 'text-white/6' : 'text-[#2D2D2D]/5'}`}
              aria-hidden
            >
              {num}
            </span>
            <TagBadge
              categories={a.categories}
              light={isDark}
              className="relative mb-3"
            />
          </>
        )}
        <div className="relative">
          <h3
            className={`font-[family-name:var(--font-cormorant)] text-xl font-light leading-snug ${titleColor}`}
          >
            {a.title}
          </h3>
          <p
            className={`mt-2 text-[12px] leading-relaxed ${mutedColor} line-clamp-3`}
          >
            {a.excerpt}
          </p>
        </div>
        <div
          className={`relative mt-4 flex items-center gap-3 border-t pt-4 ${borderColor}`}
        >
          <span className={`text-[10px] ${mutedColor}`}>
            {a.publishedAt ? formatPostDate(a.publishedAt) : ''}
          </span>
          <Clock className={`ml-auto size-3 ${mutedColor}`} strokeWidth={1.5} />
          <span className={`text-[10px] ${mutedColor}`}>
            {a.readTimeMinutes} min
          </span>
          <Eye className={`size-3 ${mutedColor}`} strokeWidth={1.5} />
          <span className={`text-[10px] ${mutedColor}`}>
            {a.views.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </Link>
  )
}
