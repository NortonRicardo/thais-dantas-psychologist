import type { Metadata } from 'next'

import { LabAreaSections } from './_components/lab-area-sections'
import { LabLanding } from './_components/lab-landing'
import { PublicFooter } from './_components/public-footer'

export const metadata: Metadata = {
  title: 'LEMM | Laboratório de Pesquisa Avançada',
  description:
    'Ciência que antecipa: clima, IA, modelagem e alta computação no LEMM.',
}

export default function Home() {
  return (
    <>
      <LabLanding />
      <LabAreaSections />
      <PublicFooter />
    </>
  )
}
