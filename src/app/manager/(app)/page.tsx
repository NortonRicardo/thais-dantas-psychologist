import type { Metadata } from 'next'

import { ManagerView } from '../_components/manager-view'

export const metadata: Metadata = {
  title: 'Gestor | LEMM',
  description:
    'Acesso rápido a eventos e projetos do Laboratório de Estudos e Modelagem Matemática.',
}

export default function ManagerPage() {
  return <ManagerView />
}
