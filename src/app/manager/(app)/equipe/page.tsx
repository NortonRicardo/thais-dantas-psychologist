import type { Metadata } from 'next'
import { TeamTable } from './_components/team-table'

export const metadata: Metadata = {
  title: 'Equipe | Gestor LEMM',
}

export default function EquipeManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/90">Equipe</h1>
        <p className="mt-0.5 text-sm text-white/40">
          Gerencie professores, colaboradores e convidados do laboratório.
        </p>
      </div>
      <TeamTable />
    </div>
  )
}
