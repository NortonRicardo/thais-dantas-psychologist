import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  MousePointerClick,
  Newspaper,
  TrendingUp,
} from 'lucide-react'
import { getDashboardStats } from '@/lib/db/dashboard-queries'

export const metadata: Metadata = {
  title: 'Dashboard | Gestor Thais Dantas',
}

export const dynamic = 'force-dynamic'

const GLASS = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.13)',
} satisfies React.CSSProperties

const shortcuts = [
  {
    href: '/manager/contato',
    label: 'Contato',
    description:
      'Gerencie localização, canais e formas de contato exibidos no site.',
  },
  {
    href: '/manager/blog',
    label: 'Blog',
    description: 'Crie, edite e publique artigos para o blog do site.',
  },
]

export default async function ManagerPage() {
  const {
    articlesThisWeek,
    articlesThisMonth,
    siteVisits30d,
    mostReadThisWeek,
    mostReadThisMonth,
  } = await getDashboardStats()

  const stats = [
    {
      icon: Newspaper,
      label: 'Artigos esta semana',
      value: String(articlesThisWeek),
      sub: 'publicados',
    },
    {
      icon: BookOpen,
      label: 'Artigos este mês',
      value: String(articlesThisMonth),
      sub: 'publicados',
    },
    {
      icon: MousePointerClick,
      label: 'Visitas ao site',
      value: siteVisits30d.toLocaleString('pt-BR'),
      sub: 'últimos 30 dias',
    },
  ]

  const mostRead = [
    { label: 'Mais lido da semana', post: mostReadThisWeek },
    { label: 'Mais lido do mês', post: mostReadThisMonth },
  ]

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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {stats.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} style={GLASS} className="rounded-2xl p-5 sm:p-6">
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

        {/* Mais lidos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mostRead.map(({ label, post }) => (
            <div key={label} style={GLASS} className="rounded-2xl p-5 sm:p-6">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <TrendingUp size={16} className="text-white/70" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                {label}
              </p>
              {post ? (
                <>
                  <Link
                    href={`/blog/${post.slug}`}
                    title={post.title}
                    className="mt-1 block truncate font-[family-name:var(--font-inter)] text-xl font-semibold text-white hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-white/35">
                    {post.reads} {post.reads === 1 ? 'leitura' : 'leituras'}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-xl font-semibold text-white/40">
                  Sem dados ainda
                </p>
              )}
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
