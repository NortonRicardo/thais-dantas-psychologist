import Image from 'next/image'
import Link from 'next/link'
import { Github, CalendarDays, Users, ArrowRight } from 'lucide-react'
import type {
  Project,
  ProjectCategory,
  ProjectTheme,
} from '../_data/projects-data'

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const categoryColor: Record<ProjectCategory, string> = {
  TCC: 'rgba(0,180,255,0.18)',
  'Iniciação Científica': 'rgba(0,200,120,0.18)',
  Mestrado: 'rgba(160,0,255,0.18)',
  Plataforma: 'rgba(255,140,0,0.18)',
  Pesquisa: 'rgba(0,160,220,0.18)',
}
const categoryBorder: Record<ProjectCategory, string> = {
  TCC: 'rgba(0,180,255,0.4)',
  'Iniciação Científica': 'rgba(0,200,120,0.4)',
  Mestrado: 'rgba(160,0,255,0.4)',
  Plataforma: 'rgba(255,140,0,0.4)',
  Pesquisa: 'rgba(0,160,220,0.4)',
}
const categoryText: Record<ProjectCategory, string> = {
  TCC: 'rgb(80,200,255)',
  'Iniciação Científica': 'rgb(60,220,140)',
  Mestrado: 'rgb(200,120,255)',
  Plataforma: 'rgb(255,180,60)',
  Pesquisa: 'rgb(60,190,255)',
}

const themeColor: Record<ProjectTheme, string> = {
  Clima: 'rgba(0,180,255,0.6)',
  Matemática: 'rgba(200,120,255,0.6)',
  'Otimização e Metaheurísticas': 'rgba(255,180,60,0.6)',
  'Agro & Sustentabilidade': 'rgba(60,220,140,0.6)',
}

function ThemePill({ theme }: { theme: ProjectTheme }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[0.55rem] font-medium uppercase tracking-[1.5px]"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: themeColor[theme],
      }}
    >
      {theme}
    </span>
  )
}

function CategoryBadge({ category }: { category: ProjectCategory }) {
  return (
    <span
      className="w-fit rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[2px]"
      style={{
        background: categoryColor[category],
        border: `1px solid ${categoryBorder[category]}`,
        color: categoryText[category],
      }}
    >
      {category}
    </span>
  )
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  })
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl" style={glass}>
      {/* Imagem opcional */}
      {project.image && (
        <div className="relative h-36 w-full shrink-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050a0f]/80" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={project.category} />
          {project.themes.map(t => (
            <ThemePill key={t} theme={t} />
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="text-sm font-bold leading-snug text-white/90">
            {project.title}
          </h3>
          <p className="line-clamp-3 text-xs leading-relaxed text-white/50">
            {project.description}
          </p>
        </div>

        {/* Autores */}
        <div className="flex items-center gap-1.5 text-[0.68rem] text-white/40">
          <Users size={11} strokeWidth={1.5} />
          <span className="line-clamp-1">{project.authors.join(', ')}</span>
        </div>

        {/* Datas */}
        <div className="flex items-center gap-1.5 text-[0.68rem] text-white/40">
          <CalendarDays size={11} strokeWidth={1.5} />
          <span>
            {formatDateShort(project.startDate)}
            {project.endDate
              ? ` → ${formatDateShort(project.endDate)}`
              : ' · Em andamento'}
          </span>
        </div>

        {/* Ações */}
        <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
          <Link
            href={`/projetos/${project.id}`}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-[0.7rem] font-medium text-white/75 transition-colors hover:bg-white/15 hover:text-white"
          >
            Ver mais <ArrowRight size={11} />
          </Link>

          {project.gitUrl && (
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/45 transition-colors hover:border-white/30 hover:text-white/80"
              aria-label="Repositório GitHub"
            >
              <Github size={14} strokeWidth={1.5} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
