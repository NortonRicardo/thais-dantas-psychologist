import type { Metadata } from 'next'

import { PublicPageShell } from '../_components/public-page-shell'

export const metadata: Metadata = {
  title: 'Projetos | LEMM',
  description:
    'Projetos de pesquisa e desenvolvimento do Laboratório de Estudos e Modelagem Matemática.',
}

export default function ProjetosPage() {
  return (
    <PublicPageShell
      aria-label="Projetos LEMM"
      title="Projetos"
      lead="Linhas de pesquisa, equipes e entregas do LEMM. Conteúdo detalhado em construção."
    />
  )
}
