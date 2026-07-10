'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Search, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'most_read', label: 'Mais lidos' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

export function BlogFilters({
  categories,
  totalResults,
}: {
  categories: string[]
  totalResults: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlSearch = searchParams.get('search') ?? ''
  const urlCategories =
    searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  const urlSort = searchParams.get('sort') ?? 'recent'

  const [search, setSearch] = useState(urlSearch)
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)

  useEffect(() => setSearch(urlSearch), [urlSearch])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node))
        setCatOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== urlSearch) updateParams({ search: search || null })
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function toggleCategory(cat: string) {
    const next = urlCategories.includes(cat)
      ? urlCategories.filter(c => c !== cat)
      : [...urlCategories, cat]
    updateParams({ categories: next.length ? next.join(',') : null })
  }

  function clearFilters() {
    setSearch('')
    router.push(pathname)
  }

  const hasFilters =
    urlSearch.length > 0 || urlCategories.length > 0 || urlSort !== 'recent'

  return (
    <div className="sticky top-0 z-40 border-b border-[#2D2D2D]/8 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3 sm:px-10">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#2D2D2D]/35" />
          <input
            type="text"
            placeholder="Buscar artigos…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 w-full rounded-full border border-[#2D2D2D]/12 bg-[#556040]/4 pl-8 pr-4 text-sm text-[#2D2D2D] placeholder:text-[#2D2D2D]/35 focus:border-[#556040]/40 focus:outline-none"
          />
        </div>

        {/* Category multi-select */}
        <div ref={catRef} className="relative">
          <button
            onClick={() => setCatOpen(o => !o)}
            className="flex h-9 items-center gap-2 rounded-full border border-[#2D2D2D]/12 bg-[#556040]/4 px-4 text-sm text-[#2D2D2D]/70 transition-colors hover:border-[#556040]/30"
          >
            {urlCategories.length === 0
              ? 'Temas'
              : `${urlCategories.length} tema${urlCategories.length > 1 ? 's' : ''}`}
            <ChevronDown
              className={`size-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {catOpen && (
            <div className="absolute top-full mt-1.5 z-50 min-w-[200px] rounded-xl border border-[#2D2D2D]/10 bg-white p-1.5 shadow-lg">
              {categories.length === 0 ? (
                <p className="px-3 py-2 text-[12px] text-[#2D2D2D]/35">
                  Nenhuma categoria
                </p>
              ) : (
                categories.map(cat => (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-[#556040]/6"
                  >
                    <input
                      type="checkbox"
                      checked={urlCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="size-3.5 rounded accent-[#556040]"
                    />
                    <span className="text-[12px] text-[#2D2D2D]/70">{cat}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sort */}
        <Select
          value={urlSort}
          onValueChange={v => updateParams({ sort: v === 'recent' ? null : v })}
        >
          <SelectTrigger className="h-9 w-auto min-w-[150px] rounded-full border-[#2D2D2D]/12 bg-[#556040]/4 px-4 text-sm text-[#2D2D2D]/70 focus:ring-[#556040]/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
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
          {totalResults} resultado{totalResults !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
