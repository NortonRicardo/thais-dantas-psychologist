import { ProjectsTable } from '../_components/projects-table'

export const metadata = {
  title: 'Projetos — Lista | Gestor LEMM',
}

export default function ProjetosListaPage() {
  return (
    <div className="pb-16 pt-8">
      <ProjectsTable />
    </div>
  )
}
