import { ProjectThemesTable } from '../_components/project-themes-table'

export const metadata = {
  title: 'Projetos — Temas | Gestor LEMM',
}

export default function ProjetosTemasPage() {
  return (
    <div className="pb-16 pt-8">
      <ProjectThemesTable />
    </div>
  )
}
