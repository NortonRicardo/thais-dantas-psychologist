'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Users,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

export type EquipeProjectSummary = {
  slug: string
  title: string
  category: string
  description: string
  themes: string[]
  authors: string[]
  startDate: string
  endDate: string | null
  gitUrl: string | null
  publicationUrl: string | null
  /** Papéis do membro neste projeto (ex.: Orientador(a)) */
  roles: string[]
}

export type EquipeMemberView = {
  id: string
  displayName: string
  professionalLine: string
  description: string | null
  linkedinUrl: string | null
  lattesUrl: string | null
  hasPhoto: boolean
  projects: EquipeProjectSummary[]
}

export type EquipeSectionView = {
  categoryId: string
  title: string
  members: EquipeMemberView[]
}

type Props = {
  sections: EquipeSectionView[]
}

const categoryBadgeStyle: Record<string, { bg: string; border: string; text: string }> = {
  TCC: {
    bg: 'rgba(0,180,255,0.12)',
    border: 'rgba(0,180,255,0.35)',
    text: 'rgb(120,210,255)',
  },
  'Iniciação Científica': {
    bg: 'rgba(0,200,120,0.12)',
    border: 'rgba(0,200,120,0.35)',
    text: 'rgb(100,230,160)',
  },
  Mestrado: {
    bg: 'rgba(160,0,255,0.12)',
    border: 'rgba(160,0,255,0.35)',
    text: 'rgb(210,160,255)',
  },
  Plataforma: {
    bg: 'rgba(255,140,0,0.12)',
    border: 'rgba(255,140,0,0.35)',
    text: 'rgb(255,190,120)',
  },
  Pesquisa: {
    bg: 'rgba(0,160,220,0.12)',
    border: 'rgba(0,160,220,0.35)',
    text: 'rgb(120,200,255)',
  },
}

export function TeamEquipeInteractive({ sections }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<EquipeMemberView | null>(null)

  const openMember = useCallback((m: EquipeMemberView) => {
    setSelected(m)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setSelected(null)
  }, [])

  return (
    <>
      <div className="mt-10 w-full space-y-12 pb-16">
        {sections.map(section => (
          <section key={section.categoryId}>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[4px] text-white/40">
              {section.title}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {section.members.map(m => (
                <MemberCard key={m.id} member={m} onSelect={() => openMember(m)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton
          className="max-h-[min(92vh,800px)] max-w-[calc(100%-1.5rem)] gap-0 overflow-y-auto border-white/15 bg-[#071525]/95 p-0 text-white shadow-2xl sm:max-w-3xl [&_[data-slot='dialog-close']]:text-white/50 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white"
        >
          {selected ? (
            <>
              <DialogTitle className="sr-only">{selected.displayName}</DialogTitle>
              <div className="grid min-h-0 gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:items-stretch md:gap-10">
                {/* Esquerda: foto, nome, links, formação (centralizados na coluna) */}
                <div className="flex h-full min-h-0 flex-col items-center gap-4 border-b border-white/10 pb-6 text-center md:border-b-0 md:border-r md:border-white/10 md:pb-0 md:pr-8">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-2xl font-bold text-white/45">
                    {selected.hasPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/team/${selected.id}/photo`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initialsFromName(selected.displayName)
                    )}
                  </div>
                  <div className="w-full min-w-0 text-center">
                    <p className="text-base font-semibold text-white">{selected.displayName}</p>
                    <div className="mt-3 flex flex-col items-center gap-2">
                      {selected.linkedinUrl ? (
                        <a
                          href={selected.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-sm text-sky-400/95 transition hover:text-sky-300"
                        >
                          <Linkedin className="h-4 w-4 shrink-0" />
                          LinkedIn
                        </a>
                      ) : null}
                      {selected.lattesUrl ? (
                        <a
                          href={selected.lattesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-sm text-teal-400/95 transition hover:text-teal-300"
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          Currículo Lattes
                        </a>
                      ) : null}
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4 text-center">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/40">
                        Formação
                      </p>
                      <p className="mt-1.5 text-pretty text-sm leading-snug text-[#00d4ff]/85">
                        {selected.professionalLine || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direita: descrição + projetos */}
                <div className="flex min-h-0 min-w-0 flex-col gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[3px] text-white/40">
                      Descrição
                    </h3>
                    {selected.description?.trim() ? (
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        {selected.description}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-white/35">Sem descrição cadastrada.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[3px] text-white/40">
                      Projetos
                    </h3>
                    {selected.projects.length > 0 ? (
                      <ul className="mt-3 flex flex-col gap-3">
                        {selected.projects.map(p => (
                          <li key={p.slug}>
                            <MemberProjectCard project={p} onNavigate={() => setOpen(false)} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-white/35">
                        Nenhum projeto vinculado (orientação, coorientação ou liderança de
                        pesquisa).
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

function MemberProjectCard({
  project,
  onNavigate,
}: {
  project: EquipeProjectSummary
  onNavigate: () => void
}) {
  const cat = categoryBadgeStyle[project.category] ?? {
    bg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.12)',
    text: 'rgba(255,255,255,0.65)',
  }
  const period = formatProjectPeriod(project.startDate, project.endDate)
  const authorsLine =
    project.authors?.filter(Boolean).slice(0, 4).join(', ') +
    (project.authors && project.authors.length > 4 ? '…' : '')

  return (
    <div
      className="rounded-xl border border-white/10 bg-white/4 p-4 transition hover:border-sky-500/35 hover:bg-white/[0.06]"
      style={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider"
          style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
        >
          {project.category}
        </span>
        {project.roles.length > 0 ? (
          <span className="max-w-[55%] text-right text-[0.65rem] leading-snug text-sky-300/90">
            {project.roles.join(' · ')}
          </span>
        ) : null}
      </div>
      <Link
        href={`/projetos/${project.slug}`}
        className="mt-2 block group"
        onClick={onNavigate}
      >
        <span className="text-[0.95rem] font-semibold text-white/95 transition group-hover:text-sky-200">
          {project.title}
        </span>
        <span className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-sky-400/80 group-hover:text-sky-300">
          Ver página do projeto
          <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
        </span>
      </Link>
      {project.themes && project.themes.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {project.themes.slice(0, 6).map(t => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[0.6rem] text-white/55"
            >
              {t}
            </span>
          ))}
          {project.themes.length > 6 ? (
            <span className="text-[0.6rem] text-white/35">+{project.themes.length - 6}</span>
          ) : null}
        </div>
      ) : null}
      {project.description?.trim() ? (
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/50">{project.description}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.65rem] text-white/40">
        {period ? (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white/35" />
            {period}
          </span>
        ) : null}
        {authorsLine ? (
          <span className="inline-flex min-w-0 items-center gap-1">
            <Users className="h-3.5 w-3.5 shrink-0 text-white/35" />
            <span className="truncate">{authorsLine}</span>
          </span>
        ) : null}
      </div>
      {(project.gitUrl || project.publicationUrl) && (
        <div className="mt-3 flex flex-wrap gap-3 border-t border-white/10 pt-3">
          {project.gitUrl ? (
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.7rem] text-white/55 transition hover:text-white/85"
              onClick={e => e.stopPropagation()}
            >
              <Github className="h-3.5 w-3.5" />
              Repositório
            </a>
          ) : null}
          {project.publicationUrl ? (
            <a
              href={project.publicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.7rem] text-white/55 transition hover:text-white/85"
              onClick={e => e.stopPropagation()}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Publicação
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ) : null}
        </div>
      )}
    </div>
  )
}

function formatProjectPeriod(startIso: string, endIso: string | null): string | null {
  try {
    const s = new Date(startIso)
    if (Number.isNaN(s.getTime())) return null
    const opt: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }
    const a = s.toLocaleDateString('pt-BR', opt)
    if (!endIso) return `Desde ${a}`
    const e = new Date(endIso)
    if (Number.isNaN(e.getTime())) return `Desde ${a}`
    const b = e.toLocaleDateString('pt-BR', opt)
    return `${a} — ${b}`
  } catch {
    return null
  }
}

function initialsFromName(displayName: string): string {
  return displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

function MemberCard({
  member,
  onSelect,
}: {
  member: EquipeMemberView
  onSelect: () => void
}) {
  const initials = initialsFromName(member.displayName)

  let photoSrc: string | null = null
  if (member.hasPhoto) {
    photoSrc = `/api/team/${member.id}/photo`
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl px-5 py-6 text-center outline-none transition ring-offset-2 ring-offset-[#0a1628] focus-visible:ring-2 focus-visible:ring-sky-500/60"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
      }}
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white/50 transition group-hover:border-white/25">
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90 group-hover:text-white">
          {member.displayName}
        </p>
        <p className="mt-0.5 text-xs text-[#00d4ff]/80">{member.professionalLine}</p>
        {(member.linkedinUrl || member.lattesUrl) && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {member.linkedinUrl ? (
              <span
                className="inline-flex items-center gap-1 text-xs text-sky-400/90"
                onClick={e => e.stopPropagation()}
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </span>
            ) : null}
            {member.lattesUrl ? (
              <span className="inline-flex items-center gap-1 text-xs text-teal-400/90">
                <FileText className="h-3.5 w-3.5" />
                Lattes
              </span>
            ) : null}
          </div>
        )}
      </div>
      {member.description && (
        <p className="line-clamp-3 text-xs leading-relaxed text-white/50">{member.description}</p>
      )}
    </button>
  )
}
