import { ProjectCategoriesTable } from '../_components/project-categories-table'

export const metadata = {
  title: 'Projetos — Categorias | Gestor LEMM',
}

export default function ProjetosCategoriasPage() {
  return (
    <div className="pb-16 pt-8">
      <ProjectCategoriesTable />
    </div>
  )
}
