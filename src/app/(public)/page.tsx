import type { Metadata } from 'next'

import { LabLanding } from './_components/lab-landing'
import { GOOGLE_REVIEWS_FALLBACK } from './_constants/google-reviews-fallback'

export const metadata: Metadata = {
  title: 'Thais Dantas | Psicóloga',
  description: 'Atendimento psicológico com Thais Dantas.',
}

export default function Home() {
  return <LabLanding googlePlace={GOOGLE_REVIEWS_FALLBACK} />
}
