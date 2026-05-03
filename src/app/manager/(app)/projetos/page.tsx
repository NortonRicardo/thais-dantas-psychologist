import type { Metadata } from 'next'
import { ProjectsTable } from './_components/projects-table'

export const metadata: Metadata = {
  title: 'Projetos | Gestor LEMM',
}

export default function ProjetosManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/90">Projetos</h1>
        <p className="mt-0.5 text-sm text-white/40">
          Gerencie pesquisas, TCCs, dissertações e plataformas do laboratório.
        </p>
      </div>
      <ProjectsTable />
    </div>
  )
}
