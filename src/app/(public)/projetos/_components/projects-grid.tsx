'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ProjectCard, type PublicProject } from './project-card'

type ProjectTheme = 'Clima' | 'Matemática' | 'Otimização e Metaheurísticas' | 'Agro & Sustentabilidade'

const themes: ProjectTheme[] = [
  'Clima',
  'Matemática',
  'Otimização e Metaheurísticas',
  'Agro & Sustentabilidade',
]

const themeColor: Record<
  ProjectTheme,
  { bg: string; border: string; text: string; activeBg: string }
> = {
  Clima: {
    bg: 'rgba(0,180,255,0.08)',
    border: 'rgba(0,180,255,0.25)',
    text: 'rgb(80,200,255)',
    activeBg: 'rgba(0,180,255,0.22)',
  },
  Matemática: {
    bg: 'rgba(160,0,255,0.08)',
    border: 'rgba(160,0,255,0.25)',
    text: 'rgb(200,120,255)',
    activeBg: 'rgba(160,0,255,0.22)',
  },
  'Otimização e Metaheurísticas': {
    bg: 'rgba(255,140,0,0.08)',
    border: 'rgba(255,140,0,0.25)',
    text: 'rgb(255,180,60)',
    activeBg: 'rgba(255,140,0,0.22)',
  },
  'Agro & Sustentabilidade': {
    bg: 'rgba(0,200,100,0.08)',
    border: 'rgba(0,200,100,0.25)',
    text: 'rgb(60,220,140)',
    activeBg: 'rgba(0,200,100,0.22)',
  },
}

const slugToTheme: Record<string, ProjectTheme> = {
  clima: 'Clima',
  matematica: 'Matemática',
  otimizacao: 'Otimização e Metaheurísticas',
  agro: 'Agro & Sustentabilidade',
}

const themeToSlug: Record<ProjectTheme, string> = {
  Clima: 'clima',
  Matemática: 'matematica',
  'Otimização e Metaheurísticas': 'otimizacao',
  'Agro & Sustentabilidade': 'agro',
}

export function ProjectsGrid({ projects }: { projects: PublicProject[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const slug = searchParams.get('tema')
  const active = slug ? (slugToTheme[slug] ?? null) : null

  function select(theme: ProjectTheme | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (theme) params.set('tema', themeToSlug[theme])
    else params.delete('tema')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const filtered = active
    ? projects.filter(p => p.themes.includes(active))
    : projects

  return (
    <div className="mt-8 pb-16">
      {/* Filtros */}
      <div className="mb-8 flex flex-wrap justify-end gap-2">
        <button
          onClick={() => select(null)}
          className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
          style={{
            background:
              active === null
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.2)',
            color:
              active === null
                ? 'rgba(255,255,255,0.95)'
                : 'rgba(255,255,255,0.45)',
          }}
        >
          Todos
        </button>

        {themes.map(theme => {
          const c = themeColor[theme]
          const isActive = active === theme
          return (
            <button
              key={theme}
              onClick={() => select(isActive ? null : theme)}
              className="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
              style={{
                background: isActive ? c.activeBg : c.bg,
                border: `1px solid ${c.border}`,
                color: c.text,
                opacity: active && !isActive ? 0.5 : 1,
              }}
            >
              {theme}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-white/30">
          Nenhum projeto neste tema ainda.
        </p>
      )}
    </div>
  )
}
