import Link from 'next/link'
import { Github, CalendarDays, Users, ArrowRight } from 'lucide-react'

export type PublicProject = {
  id: string
  slug: string
  title: string
  category: string
  categoryChipBg: string
  categoryChipBorder: string
  categoryChipText: string
  themes: string[]
  themeTags: { name: string; pillColor: string }[]
  description: string
  imageMimeType: string | null
  pdfMimeType: string | null
  authors: string[]
  startDate: string
  endDate: string | null
  gitUrl: string | null
  publicationUrl: string | null
  advisorName: string | null
  coAdvisorName: string | null
  researchLeadName: string | null
  updatedAt: string
}

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

function ThemePill({ name, pillColor }: { name: string; pillColor: string }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[0.55rem] font-medium uppercase tracking-[1.5px]"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: pillColor,
      }}
    >
      {name}
    </span>
  )
}

function CategoryBadge({
  category,
  chipBg,
  chipBorder,
  chipText,
}: {
  category: string
  chipBg: string
  chipBorder: string
  chipText: string
}) {
  return (
    <span
      className="w-fit rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[2px]"
      style={{
        background: chipBg,
        border: `1px solid ${chipBorder}`,
        color: chipText,
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

export function ProjectCard({ project }: { project: PublicProject }) {
  const imgSrc = project.imageMimeType
    ? `/api/projects/${project.id}/image?t=${new Date(project.updatedAt).getTime()}`
    : null

  const tagByName = Object.fromEntries(
    project.themeTags.map(t => [t.name, t.pillColor])
  )

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl" style={glass}>
      {imgSrc && (
        <div className="relative h-36 w-full shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={project.title}
            className="h-full w-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050a0f]/80" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge
            category={project.category}
            chipBg={project.categoryChipBg}
            chipBorder={project.categoryChipBorder}
            chipText={project.categoryChipText}
          />
          {project.themes.map(tn => (
            <ThemePill
              key={tn}
              name={tn}
              pillColor={tagByName[tn] ?? 'rgba(255,255,255,0.5)'}
            />
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

        <div className="flex items-center gap-1.5 text-[0.68rem] text-white/40">
          <Users size={11} strokeWidth={1.5} />
          <span className="line-clamp-1">
            {[
              project.advisorName,
              project.coAdvisorName,
              project.researchLeadName,
              ...project.authors,
            ]
              .filter((n, i, a): n is string => !!n && a.indexOf(n) === i)
              .join(', ') || '—'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[0.68rem] text-white/40">
          <CalendarDays size={11} strokeWidth={1.5} />
          <span>
            {formatDateShort(project.startDate)}
            {project.endDate
              ? ` → ${formatDateShort(project.endDate)}`
              : ' · Em andamento'}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
          <Link
            href={`/projetos/${project.slug}`}
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
