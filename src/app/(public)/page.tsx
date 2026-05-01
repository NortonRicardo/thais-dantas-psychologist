import type { Metadata } from 'next'

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
      <PublicFooter />
    </>
  )
}
