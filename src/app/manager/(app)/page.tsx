import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Mail, MousePointerClick, Newspaper } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard | Gestor Thais Dantas',
}

const GLASS = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.13)',
} satisfies React.CSSProperties

const stats = [
  {
    icon: Newspaper,
    label: 'Artigos esta semana',
    value: '2',
    sub: 'publicados',
  },
  {
    icon: BookOpen,
    label: 'Artigos este mês',
    value: '8',
    sub: 'publicados',
  },
  {
    icon: MousePointerClick,
    label: 'Visitas ao site',
    value: '1.247',
    sub: 'últimos 30 dias',
  },
  {
    icon: Mail,
    label: 'Newsletter',
    value: '94',
    sub: 'e-mails cadastrados',
  },
]

const shortcuts = [
  {
    href: '/manager/contato',
    label: 'Contato',
    description: 'Gerencie localização, canais e formas de contato exibidos no site.',
  },
  {
    href: '/manager/blog',
    label: 'Blog',
    description: 'Crie, edite e publique artigos para o blog do site.',
  },
  {
    href: '/manager/newsletter',
    label: 'Newsletter',
    description: 'Visualize e gerencie os e-mails cadastrados na lista.',
  },
]

export default function ManagerPage() {
  return (
    <div className="px-6 pb-12 sm:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Saudação */}
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-white sm:text-4xl">
            Visão geral
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Resumo da atividade do site
          </p>
        </div>

        {/* Cards de status */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              style={GLASS}
              className="rounded-2xl p-5 sm:p-6"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Icon size={16} className="text-white/70" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                {label}
              </p>
              <p className="mt-1 font-[family-name:var(--font-inter)] text-4xl font-semibold text-white">
                {value}
              </p>
              <p className="mt-0.5 text-xs text-white/35">{sub}</p>
            </div>
          ))}
        </div>

        {/* Atalhos */}
        <div>
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-white sm:text-3xl">
            Atalhos
          </h2>
        <div className="flex justify-center gap-4">
          {shortcuts.map(({ href, label, description }) => (
            <Link
              key={href}
              href={href}
              style={GLASS}
              className="group flex aspect-square w-52 flex-col items-center justify-center rounded-2xl p-6 text-center transition-all hover:bg-white/[0.06]"
            >
              <h2 className="font-[family-name:var(--font-cinzel)] text-base font-medium text-white transition-colors group-hover:text-white/90">
                {label}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-white/50">
                {description}
              </p>
              <span className="mt-4 inline-block text-xs font-medium text-white/30 transition-colors group-hover:text-white/60">
                Acessar →
              </span>
            </Link>
          ))}
        </div>
        </div>

      </div>
    </div>
  )
}
