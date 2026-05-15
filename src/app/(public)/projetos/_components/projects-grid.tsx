'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import { ProjectCard, type PublicProject } from './project-card'

export type ThemeFilterOption = {
  slug: string
  name: string
  filterBg: string
  filterBorder: string
  filterText: string
  filterActiveBg: string
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

  const slug = searchParams.get('tema')
  const activeTheme = slug
    ? (themeFilters.find(t => t.slug === slug) ?? null)
    : null
  const activeName = activeTheme?.name ?? null

  function select(theme: ThemeFilterOption | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (theme) params.set('tema', theme.slug)
    else params.delete('tema')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const filtered = activeName
    ? projects.filter(p => p.themes.includes(activeName))
    : projects

  return (
    <div className="mt-8 pb-16">
      <div className="mb-8 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => select(null)}
          className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
          style={{
            background:
              activeName === null
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.2)',
            color:
              activeName === null
                ? 'rgba(255,255,255,0.95)'
                : 'rgba(255,255,255,0.45)',
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
              onClick={() => select(isActive ? null : theme)}
              className="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
              style={{
                background: isActive ? theme.filterActiveBg : theme.filterBg,
                border: `1px solid ${theme.filterBorder}`,
                color: theme.filterText,
                opacity: activeName && !isActive ? 0.5 : 1,
              }}
            >
              {theme.name}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  )
}
