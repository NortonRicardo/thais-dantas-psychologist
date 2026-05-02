import type { Metadata } from 'next'

import { LabAreaSections } from './_components/lab-area-sections'
import { LabLanding } from './_components/lab-landing'
import { PublicFooter } from './_components/public-footer'

export const metadata: Metadata = {
  title: 'LEMM | Laboratório de Estudos e Modelagem Matemática — PUC Goiás',
  description:
    'Laboratório de Estudos e Modelagem Matemática (PUC Goiás / PPGEIIA): modelagem climática, IA, HPC, otimização e software aplicado à decisão.',
}

export default function Home() {
  return (
    <>
      <LabLanding />
      <LabAreaSections />
      <PublicFooter topBlur={false} />
    </>
  )
}
