import { TimelineTable } from './_components/timeline-table'

export const metadata = {
  title: 'Sobre Nós | Gestor LEMM',
}

export default function SobreNosManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/90">Sobre Nós</h1>
        <p className="mt-0.5 text-sm text-white/40">
          Gerencie os marcos da linha do tempo exibida na página pública Sobre
          Nós.
        </p>
      </div>
      <TimelineTable />
    </div>
  )
}
