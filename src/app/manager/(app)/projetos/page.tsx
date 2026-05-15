import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Projetos | Gestor LEMM',
}

export default function ProjetosIndexPage() {
  redirect('/manager/projetos/lista')
}
