'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { FilterCombobox } from '@/components/filter-combobox'
import { Button } from '@/components/ui/button'
import { ProjectCard, type PublicProject } from './project-card'
import { slugifyThemeSlug } from '@/lib/project-taxonomy-styles'

export type ThemeFilterOption = {
  slug: string
  name: string
  filterBg: string
  filterBorder: string
  filterText: string
  filterActiveBg: string
}

type CategoryFilterOption = {
  slug: string
  title: string
  chipBg: string
  chipBorder: string
  chipText: string
}

function useDebouncedQuerySync(
  searchParamsString: string,
  pathname: string,
  router: ReturnType<typeof useRouter>,
  draft: string,
  paramKey: string
) {
  useEffect(() => {
    const searchParams = new URLSearchParams(searchParamsString)
    const fromUrl = searchParams.get(paramKey)?.trim() ?? ''
    if (draft === fromUrl) return
    const id = window.setTimeout(() => {
      const p = new URLSearchParams(searchParamsString)
      if (draft.trim()) p.set(paramKey, draft.trim())
      else p.delete(paramKey)
      const qs = p.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, 400)
    return () => window.clearTimeout(id)
  }, [draft, paramKey, pathname, router, searchParamsString])
}

export function ProjectsGrid({
  projects,
  themeFilters,
}: {
  projects: PublicProject[]
  themeFilters: ThemeFilterOption[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const qFromUrl = searchParams.get('q')?.trim() ?? ''
  const [titleDraft, setTitleDraft] = useState(qFromUrl)

  useEffect(() => {
    setTitleDraft(qFromUrl)
  }, [qFromUrl])

  useDebouncedQuerySync(
    searchParams.toString(),
    pathname,
    router,
    titleDraft,
    'q'
  )

  const categoryOptions = useMemo((): CategoryFilterOption[] => {
    const byTitle = new Map<string, PublicProject>()
    for (const p of projects) {
      if (!byTitle.has(p.category)) byTitle.set(p.category, p)
    }
    return [...byTitle.entries()]
      .map(([title, sample]) => ({
        slug: slugifyThemeSlug(title),
        title,
        chipBg: sample.categoryChipBg,
        chipBorder: sample.categoryChipBorder,
        chipText: sample.categoryChipText,
      }))
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
  }, [projects])

  const categoryTitles = useMemo(
    () => categoryOptions.map(c => c.title),
    [categoryOptions]
  )

  function replaceQuery(updates: Record<string, string | null | undefined>) {
    const p = new URLSearchParams(searchParams.toString())
    for (const [key, val] of Object.entries(updates)) {
      if (val === undefined) continue
      if (val) p.set(key, val)
      else p.delete(key)
    }
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const temaSlug = searchParams.get('tema')
  const activeTheme = temaSlug
    ? (themeFilters.find(t => t.slug === temaSlug) ?? null)
    : null
  const activeThemeName = activeTheme?.name ?? null

  const categoriaSlug = searchParams.get('categoria')
  const activeCategory = categoriaSlug
    ? (categoryOptions.find(c => c.slug === categoriaSlug) ?? null)
    : null

  const qFilter = titleDraft.trim().toLowerCase()

  let filtered = projects
  if (qFilter) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(qFilter))
  }
  if (activeCategory) {
    filtered = filtered.filter(p => p.category === activeCategory.title)
  }
  if (activeThemeName) {
    filtered = filtered.filter(p => p.themes.includes(activeThemeName))
  }

  const neutralChip = {
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.2)',
    text: 'rgba(255,255,255,0.45)',
    activeBg: 'rgba(255,255,255,0.15)',
    activeText: 'rgba(255,255,255,0.95)',
  }

  const hasTitleOrCategoryFilter = Boolean(titleDraft.trim() || activeCategory)

  function clearTitleAndCategory() {
    setTitleDraft('')
    replaceQuery({ q: null, categoria: null })
  }

  function handleCategoryTitle(title: string) {
    if (!title) {
      replaceQuery({ categoria: null })
      return
    }
    const opt = categoryOptions.find(c => c.title === title)
    replaceQuery({ categoria: opt?.slug ?? slugifyThemeSlug(title) })
  }

  return (
    <div className="mt-8 pb-16">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-start gap-2">
          <span className="text-[0.65rem] font-medium uppercase tracking-wider text-white/35">
            Tema
          </span>
          <button
            type="button"
            onClick={() => replaceQuery({ tema: null })}
            className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: !activeTheme ? neutralChip.activeBg : neutralChip.bg,
              border: `1px solid ${neutralChip.border}`,
              color: !activeTheme ? neutralChip.activeText : neutralChip.text,
            }}
          >
            Todos
          </button>

          {themeFilters.map(theme => {
            const isActive = activeTheme?.slug === theme.slug
            return (
              <button
                key={theme.slug}
                type="button"
                onClick={() =>
                  replaceQuery({ tema: isActive ? null : theme.slug })
                }
                className="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: isActive ? theme.filterActiveBg : theme.filterBg,
                  border: `1px solid ${theme.filterBorder}`,
                  color: theme.filterText,
                  opacity: activeThemeName && !isActive ? 0.5 : 1,
                }}
              >
                {theme.name}
              </button>
            )
          })}
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-2">
          <div className="relative w-full min-w-0 sm:w-1/2 sm:flex-none">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              aria-hidden
            />
            <input
              id="filtro-titulo-projetos"
              type="search"
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              placeholder="Filtrar por título…"
              autoComplete="off"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-8 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/20"
            />
            {titleDraft ? (
              <button
                type="button"
                onClick={() => {
                  setTitleDraft('')
                  replaceQuery({ q: null })
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                aria-label="Limpar filtro de título"
              >
                <X size={13} />
              </button>
            ) : null}
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-none">
            <FilterCombobox
              value={activeCategory?.title ?? ''}
              onChange={handleCategoryTitle}
              placeholder="Todas as categorias"
              clearLabel="Limpar categoria"
              options={categoryTitles}
              width="flex-1 sm:w-52 sm:flex-none"
              renderOption={title => {
                const opt = categoryOptions.find(c => c.title === title)
                return (
                  <>
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: opt?.chipText }}
                    />
                    {title}
                  </>
                )
              }}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasTitleOrCategoryFilter}
              onClick={clearTitleAndCategory}
              className="h-auto shrink-0 rounded-lg border-white/10 bg-white/5 py-2 text-white/80 hover:bg-white/8 hover:text-white/90 disabled:opacity-40"
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/40">
          Nenhum projeto corresponde aos filtros.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}
