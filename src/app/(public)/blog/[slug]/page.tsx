import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Eye } from 'lucide-react'

import { homeNavItems } from '../../_constants/home-nav-items'
import { WHATSAPP_BOOKING_URL } from '../../_constants/contact-links'
import { getPublishedPostBySlug } from '@/lib/db/blog-queries'
import { formatPostDate } from '@/lib/blog/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) notFound()

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

        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/blog"
            className="mt-8 flex w-fit items-center gap-1.5 text-[12px] text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={13} /> Blog
          </Link>
          <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] text-white">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="mt-3 text-base leading-relaxed text-white/55">
              {post.subtitle}
            </p>
          )}
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            {post.categories.map(c => (
              <span
                key={c.id}
                className="inline-block rounded-full bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white"
              >
                {c.name}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 border-t border-white/15 pb-8 pt-5">
            <span className="text-[11px] text-white/40">
              {post.publishedAt ? formatPostDate(post.publishedAt) : ''}
            </span>
            <Clock className="size-3 text-white/25" strokeWidth={1.5} />
            <span className="text-[11px] text-white/40">
              {post.readTimeMinutes} min
            </span>
            <Eye className="size-3 text-white/25" strokeWidth={1.5} />
            <span className="text-[11px] text-white/40">
              {post.views.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </section>

      {/* ── COVER ───────────────────────────────────────────────────────── */}
      {post.coverImageUrl && (
        <div className="mx-auto -mt-10 max-w-4xl px-6 sm:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
      )}

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="bg-white px-6 py-12 sm:px-10">
        <div
          className="article-body prose prose-lg mx-auto max-w-3xl prose-headings:font-[family-name:var(--font-cormorant)] prose-headings:font-light prose-a:text-[#556040]"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      </div>
    </div>
  )
}
