import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'
import { SheLeadsSection } from './_components/sheleads-section'

export const metadata: Metadata = {
  title: 'Data SheLeads | LEMM',
  description:
    'Formação, inclusão e liderança feminina em ciência de dados, IA e tecnologias emergentes — iniciativa do ecossistema LEMM.',
}

export default function DataSheLeadsPage() {
  return (
    <PublicPageShell
      aria-label="Data SheLeads LEMM"
      title="Data SheLeads"
      lead="Formação, inclusão e liderança feminina em STEM, conectada ao ecossistema de pesquisa do LEMM."
      fullWidthContent={<SheLeadsSection />}
    />
  )
}
