import type { Metadata } from 'next'

import { LabLanding } from './_components/lab-landing'

export const metadata: Metadata = {
  title: 'Thais Dantas | Psicóloga',
  description: 'Atendimento psicológico com Thais Dantas.',
}

export default function Home() {
  return <LabLanding />
}
