import { TeamCategoriesTable } from '../_components/team-categories-table'

export const metadata = {
  title: 'Equipe — Categorias | Gestor LEMM',
}

export default function EquipeCategoriasPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <TeamCategoriesTable />
    </div>
  )
}
