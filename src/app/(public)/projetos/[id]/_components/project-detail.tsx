'use client'

import {
  Github,
  ExternalLink,
  CalendarDays,
  Users,
  GraduationCap,
  FlaskConical,
  FileText,
} from 'lucide-react'
import type { Project } from '../../_data/projects-data'

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[0.58rem] uppercase tracking-[2px] text-white/30">
        {label}
      </span>
      <span className="flex items-start gap-1.5 text-xs text-white/70">
        <Icon
          size={11}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-white/35"
        />
        {value}
      </span>
    </div>
  )
}

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="flex w-full flex-col gap-8 pb-16 lg:flex-row lg:items-start">
      {/* Sidebar — 1/4 */}
      <aside className="w-full shrink-0 lg:w-1/4">
        <div
          className="sticky top-6 flex flex-col gap-5 rounded-2xl px-5 py-6"
          style={glass}
        >
          {project.authors.length > 0 && (
            <MetaRow
              icon={Users}
              label={project.authors.length > 1 ? 'Autores' : 'Autor'}
              value={project.authors.join(', ')}
            />
          )}

          <MetaRow
            icon={CalendarDays}
            label="Início"
            value={formatDate(project.startDate)}
          />

          {project.endDate ? (
            <MetaRow
              icon={CalendarDays}
              label="Conclusão"
              value={formatDate(project.endDate)}
            />
          ) : (
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.58rem] uppercase tracking-[2px] text-white/30">
                Status
              </span>
              <span className="flex w-fit items-center gap-1.5 rounded-full border border-green-400/35 bg-green-400/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-green-300">
                Em andamento
              </span>
            </div>
          )}

          {project.advisor && (
            <MetaRow
              icon={GraduationCap}
              label="Orientador(a)"
              value={project.advisor}
            />
          )}

          {project.coAdvisor && (
            <MetaRow
              icon={GraduationCap}
              label="Coorientador(a)"
              value={project.coAdvisor}
            />
          )}

          {project.researchLead && (
            <MetaRow
              icon={FlaskConical}
              label="Responsável pela pesquisa"
              value={project.researchLead}
            />
          )}

          {(project.gitUrl || project.publicationUrl) && (
            <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
              {project.gitUrl && (
                <a
                  href={project.gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white/90"
                >
                  <Github size={13} strokeWidth={1.5} /> Repositório GitHub
                </a>
              )}
              {project.publicationUrl && (
                <a
                  href={project.publicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white/90"
                >
                  <ExternalLink size={13} strokeWidth={1.5} /> Publicação /
                  Artigo
                </a>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Conteúdo principal — 3/4 */}
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        {/* Título e descrição */}
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
            {project.title}
          </h1>
          <p className="text-sm leading-relaxed text-white/65">
            {project.description}
          </p>
        </div>

        {/* PDF */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[3px] text-white/40">
            <FileText size={12} strokeWidth={1.5} />
            Documento
          </div>

          {project.pdfPath ? (
            <div
              className="overflow-hidden rounded-2xl border border-white/15"
              style={{ height: '70vh' }}
            >
              <iframe
                src={project.pdfPath}
                className="h-full w-full"
                title={`PDF — ${project.title}`}
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-2xl py-16 text-center"
              style={glass}
            >
              <FileText size={32} strokeWidth={1} className="text-white/20" />
              <p className="text-sm text-white/40">Aguardando arquivo final</p>
              <p className="text-xs text-white/25">
                O documento será disponibilizado após a conclusão do trabalho.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
