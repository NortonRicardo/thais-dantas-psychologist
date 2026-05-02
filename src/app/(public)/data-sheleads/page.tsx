import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'

export const metadata: Metadata = {
  title: 'Data SheLeads | LEMM',
  description: 'Iniciativa Data SheLeads no âmbito do LEMM — PUC Goiás.',
}

export default function DataSheLeadsPage() {
  return (
    <PublicPageShell
      aria-label="Data SheLeads LEMM"
      title="Data SheLeads"
      lead="Informações sobre o programa Data SheLeads serão publicadas em breve."
    />
  )
}
