'use client'

import Link from 'next/link'
import { useState, useMemo, useRef, useEffect } from 'react'
import { ArrowRight, ChevronDown, Clock, Eye, Search, X } from 'lucide-react'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/* ─── Mock data ─────────────────────────────────────────────────────────── */
const ARTICLES = [
  {
    id: '1', slug: 'comer-emocional', category: 'Saúde Mental', num: '01',
    title: 'Comer emocional: por que comemos quando não estamos com fome?',
    excerpt: 'Entender a relação entre emoções e alimentação é o primeiro passo para transformar padrões que parecem impossíveis de mudar.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80',
    readTime: '8 min', date: '12 Jun 2026', dateMs: new Date('2026-06-12').getTime(), views: 1247,
  },
  {
    id: '2', slug: 'tcc-na-pratica', category: 'TCC', num: '02',
    title: 'TCC: como mudar os pensamentos que moldam nossos comportamentos',
    excerpt: 'A Terapia Cognitivo Comportamental parte de uma premissa simples mas poderosa: o que pensamos influencia como nos sentimos e agimos.',
    image: null,
    readTime: '6 min', date: '5 Jun 2026', dateMs: new Date('2026-06-05').getTime(), views: 983,
  },
  {
    id: '3', slug: 'bariatrica-e-mente', category: 'Cirurgia Bariátrica', num: '03',
    title: 'O caminho psicológico antes e depois da bariátrica',
    excerpt: 'A cirurgia muda o corpo em semanas. A mente precisa de meses — e de acompanhamento — para acompanhar essa transformação.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
    readTime: '7 min', date: '28 Mai 2026', dateMs: new Date('2026-05-28').getTime(), views: 2104,
  },
  {
    id: '4', slug: 'endometriose-saude-mental', category: 'Endometriose', num: '04',
    title: 'Endometriose e saúde mental: a dor que ninguém vê',
    excerpt: 'A dor crônica deixa marcas que vão além do físico. Ansiedade, isolamento e depressão são companheiras silenciosas de quem convive com a endometriose.',
    image: null,
    readTime: '9 min', date: '18 Mai 2026', dateMs: new Date('2026-05-18').getTime(), views: 3567,
  },
  {
    id: '5', slug: 'obesidade-emocoes', category: 'Obesidade', num: '05',
    title: 'Obesidade além da balança: o papel invisível das emoções',
    excerpt: 'Gatilhos emocionais, histórias de vida e padrões inconscientes — entender o que está por trás do peso é o que torna a mudança duradoura.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80',
    readTime: '10 min', date: '8 Mai 2026', dateMs: new Date('2026-05-08').getTime(), views: 1891,
  },
  {
    id: '6', slug: 'transtornos-alimentares', category: 'Transtornos Alimentares', num: '06',
    title: 'Quando a relação com a comida adoece: sinais e caminhos',
    excerpt: 'Anorexia, bulimia e compulsão alimentar vão muito além da mesa. O sofrimento é real — e o tratamento psicológico é parte central da recuperação.',
    image: null,
    readTime: '11 min', date: '30 Abr 2026', dateMs: new Date('2026-04-30').getTime(), views: 4213,
  },
  {
    id: '7', slug: 'emagrecimento-sustentavel', category: 'Emagrecimento', num: '07',
    title: 'Emagrecimento sustentável começa na mente',
    excerpt: 'Dietas funcionam no curto prazo, mas a mudança real exige compreender o que nos leva a comer de formas que não nos servem.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80',
    readTime: '5 min', date: '20 Abr 2026', dateMs: new Date('2026-04-20').getTime(), views: 788,
  },
  {
    id: '8', slug: 'ansiedade-e-comida', category: 'Saúde Mental', num: '08',
    title: 'Ansiedade e comida: o ciclo que se repete',
    excerpt: 'Quando a ansiedade bate, muitos buscam alívio na comida. Entender esse ciclo é o primeiro passo para quebrá-lo.',
    image: null,
    readTime: '7 min', date: '10 Abr 2026', dateMs: new Date('2026-04-10').getTime(), views: 2340,
  },
]

const CATEGORIES = [...new Set(ARTICLES.map(a => a.category))].sort()
const PER_PAGE = 4

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'most_read', label: 'Mais lidos' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)

  const hasFilters = search.length > 0 || selectedCategories.length > 0 || sort !== 'recent'

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    )

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setSort('recent')
    setPage(1)
  }

  const filtered = useMemo(() => {
    let result = [...ARTICLES]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
      )
    }
    if (selectedCategories.length > 0) {
      result = result.filter(a => selectedCategories.includes(a.category))
    }
    result.sort((a, b) => {
      if (sort === 'recent') return b.dateMs - a.dateMs
      if (sort === 'oldest') return a.dateMs - b.dateMs
      if (sort === 'most_read') return b.views - a.views
      if (sort === 'az') return a.title.localeCompare(b.title, 'pt')
      if (sort === 'za') return b.title.localeCompare(a.title, 'pt')
      return 0
    })
    return result
  }, [search, selectedCategories, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const [featured, ...rest] = paginated

  const goToPage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="text-[#2D2D2D]">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="flex flex-col bg-[#556040] px-6 py-6 sm:px-10 sm:py-8">
        {/* Nav */}
        <header>
          <div className="mx-auto flex max-w-7xl items-center gap-4 sm:gap-5">
            <nav aria-label="Navegação principal" className="relative flex min-w-0 flex-1 items-center rounded-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.02)_88%,transparent)] py-2.5 pl-5 pr-3 backdrop-blur-sm sm:py-3 sm:pl-8 sm:pr-4">
              <Link href="/" className="relative z-10 shrink-0 font-[family-name:var(--font-cinzel)] text-sm font-medium tracking-wide text-white transition-colors hover:text-white/90 sm:text-base">
                Thais Dantas
              </Link>
              <ul className="pointer-events-none absolute inset-0 flex list-none items-center justify-center gap-x-4 p-0 sm:gap-x-8">
                {homeNavItems.map(({ href, label }) => (
                  <li key={label} className="pointer-events-auto">
                    <Link href={href} className="text-sm font-medium text-white/80 transition-colors hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a href={WHATSAPP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#3A4424] shadow-sm transition-colors hover:bg-white sm:px-6 sm:py-2.5">
              Agendar horário
            </a>
          </div>
        </header>

        {/* Editorial */}
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-between border-b border-white/15 pb-4 pt-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Blog & Reflexões</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">{ARTICLES.length} artigos</span>
          </div>
          <div className="pb-8 pt-6">
            <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.02] text-white">
              Onde a ciência <em className="italic text-white/45">encontra o cotidiano.</em>
            </h1>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/50">
              Artigos sobre saúde mental, alimentação emocional e bem-estar — escritos para quem quer entender mais sobre si mesmo.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTERS ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-[#2D2D2D]/8 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3 sm:px-10">

          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#2D2D2D]/35" />
            <input
              type="text"
              placeholder="Buscar artigos…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="h-9 w-full rounded-full border border-[#2D2D2D]/12 bg-[#556040]/4 pl-8 pr-4 text-sm text-[#2D2D2D] placeholder:text-[#2D2D2D]/35 focus:border-[#556040]/40 focus:outline-none"
            />
          </div>

          {/* Category multi-select */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen(o => !o)}
              className="flex h-9 items-center gap-2 rounded-full border border-[#2D2D2D]/12 bg-[#556040]/4 px-4 text-sm text-[#2D2D2D]/70 transition-colors hover:border-[#556040]/30"
            >
              {selectedCategories.length === 0 ? 'Temas' : `${selectedCategories.length} tema${selectedCategories.length > 1 ? 's' : ''}`}
              <ChevronDown className={`size-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full mt-1.5 z-50 min-w-[200px] rounded-xl border border-[#2D2D2D]/10 bg-white p-1.5 shadow-lg">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-[#556040]/6">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => { toggleCategory(cat); setPage(1) }}
                      className="size-3.5 rounded accent-[#556040]"
                    />
                    <span className="text-[12px] text-[#2D2D2D]/70">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <Select value={sort} onValueChange={v => { setSort(v); setPage(1) }}>
            <SelectTrigger className="h-9 w-auto min-w-[150px] rounded-full border-[#2D2D2D]/12 bg-[#556040]/4 px-4 text-sm text-[#2D2D2D]/70 focus:ring-[#556040]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex h-9 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 text-sm text-red-500 transition-colors hover:bg-red-100"
            >
              <X className="size-3.5" />
              Limpar filtros
            </button>
          )}

          <span className="ml-auto text-[11px] text-[#2D2D2D]/35">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── ARTICLES ────────────────────────────────────────────────────── */}
      <div className="bg-white px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-7xl">

          {filtered.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
              <p className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2D2D2D]/40">Nenhum artigo encontrado</p>
              <p className="text-sm text-[#2D2D2D]/30">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && page === 1 && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group mb-6 grid overflow-hidden rounded-2xl border border-[#2D2D2D]/8 transition-shadow hover:shadow-lg sm:grid-cols-[55fr_45fr]"
                >
                  {featured.image ? (
                    <div className="relative min-h-[280px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-[1.03]" />
                      <div className="absolute inset-0 bg-[#556040]/20" />
                      <TagBadge category={featured.category} className="absolute bottom-5 left-5" light />
                    </div>
                  ) : (
                    <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-[#556040] p-8">
                      <span className="pointer-events-none absolute -right-4 -top-4 select-none font-[family-name:var(--font-cormorant)] text-[14rem] font-light leading-none text-white/5">{featured.num}</span>
                      <TagBadge category={featured.category} light />
                    </div>
                  )}
                  <div className="flex flex-col justify-between bg-white p-8">
                    <div>
                      <span className="font-[family-name:var(--font-cormorant)] text-[6rem] font-light leading-none text-[#556040]/8 select-none">{featured.num}</span>
                      <h2 className="-mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(1.6rem,2.4vw,2.4rem)] font-light leading-[1.1] text-[#2D2D2D]">{featured.title}</h2>
                      <p className="mt-3 text-sm leading-relaxed text-[#2D2D2D]/50">{featured.excerpt}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-4 border-t border-[#556040]/10 pt-5">
                      <span className="text-[11px] text-[#2D2D2D]/40">{featured.date}</span>
                      <Clock className="size-3 text-[#2D2D2D]/25" strokeWidth={1.5} />
                      <span className="text-[11px] text-[#2D2D2D]/40">{featured.readTime}</span>
                      <Eye className="ml-1 size-3 text-[#2D2D2D]/25" strokeWidth={1.5} />
                      <span className="text-[11px] text-[#2D2D2D]/40">{featured.views.toLocaleString('pt-BR')}</span>
                      <ArrowRight className="ml-auto size-4 text-[#556040]/40 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(page === 1 ? rest : paginated).map((a, i) => (
                    <ArticleCard key={a.id} article={a} index={i} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-14">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={e => { e.preventDefault(); if (page > 1) goToPage(page - 1) }}
                      className={page === 1 ? 'pointer-events-none opacity-40' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={e => { e.preventDefault(); goToPage(p) }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => { e.preventDefault(); if (page < totalPages) goToPage(page + 1) }}
                      className={page === totalPages ? 'pointer-events-none opacity-40' : ''}
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
function TagBadge({ category, className = '', light = false }: { category: string; className?: string; light?: boolean }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] ${light ? 'bg-white/20 text-white' : 'bg-[#556040]/10 text-[#556040]'} ${className}`}>
      {category}
    </span>
  )
}

/* ─── Article card ───────────────────────────────────────────────────────── */
type Article = (typeof ARTICLES)[number]

function ArticleCard({ article: a, index }: { article: Article; index: number }) {
  const hasImage = !!a.image
  const isDark = !hasImage && index % 2 === 0
  const bg = isDark ? 'bg-[#556040]' : hasImage ? 'bg-white' : 'bg-[#B8AEA4]/30'
  const titleColor = isDark ? 'text-white' : 'text-[#2D2D2D]'
  const mutedColor = isDark ? 'text-white/45' : 'text-[#2D2D2D]/45'
  const borderColor = isDark ? 'border-white/10' : 'border-[#556040]/10'

  return (
    <Link
      href={`/blog/${a.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[#2D2D2D]/8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${bg}`}
    >
      {/* Image */}
      {hasImage && (
        <div className="relative h-48 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image!} alt={a.title} className="h-full w-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-[#556040]/15" />
          <TagBadge category={a.category} className="absolute bottom-4 left-4" light />
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-1 flex-col justify-between p-5">
        {!hasImage && (
          <>
            <span className={`pointer-events-none absolute -right-3 -top-4 select-none font-[family-name:var(--font-cormorant)] text-[8rem] font-light leading-none ${isDark ? 'text-white/6' : 'text-[#2D2D2D]/5'}`} aria-hidden>{a.num}</span>
            <TagBadge category={a.category} light={isDark} className="relative mb-3" />
          </>
        )}
        <div className="relative">
          <h3 className={`font-[family-name:var(--font-cormorant)] text-xl font-light leading-snug ${titleColor}`}>{a.title}</h3>
          <p className={`mt-2 text-[12px] leading-relaxed ${mutedColor} line-clamp-3`}>{a.excerpt}</p>
        </div>
        <div className={`relative mt-4 flex items-center gap-3 border-t pt-4 ${borderColor}`}>
          <span className={`text-[10px] ${mutedColor}`}>{a.date}</span>
          <Clock className={`ml-auto size-3 ${mutedColor}`} strokeWidth={1.5} />
          <span className={`text-[10px] ${mutedColor}`}>{a.readTime}</span>
          <Eye className={`size-3 ${mutedColor}`} strokeWidth={1.5} />
          <span className={`text-[10px] ${mutedColor}`}>{a.views.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </Link>
  )
}
