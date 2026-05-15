import { DevelopedPlatformsTable } from './_components/developed-platforms-table'

export const metadata = {
  title: 'Plataformas | Gestor LEMM',
}

export default function PlataformasManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <DevelopedPlatformsTable />
    </div>
  )
}
