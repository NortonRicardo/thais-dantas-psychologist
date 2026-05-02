import Link from 'next/link'

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const cards = [
  {
    id: 'eventos',
    title: 'Eventos',
    description:
      'Calendário e cadastro de eventos: palestras, workshops e encontros do laboratório.',
    href: '/manager/eventos',
  },
  {
    id: 'sobre-nos',
    title: 'Sobre Nós',
    description:
      'Linha do tempo institucional exibida na página pública — marcos, anos e textos.',
    href: '/manager/sobre-nos',
  },
  {
    id: 'plataformas',
    title: 'Plataformas desenvolvidas',
    description:
      'Weather Brasil, META TOOL BOX e demais — textos, selos e links na Infraestrutura.',
    href: '/manager/plataformas',
  },
  {
    id: 'rede-colaboracao',
    title: 'Rede de colaboração',
    description:
      'Parceiros institucionais mostrados na página Infraestrutura — nomes e descrições.',
    href: '/manager/rede-colaboracao',
  },
  {
    id: 'projetos',
    title: 'Projetos',
    description:
      'Linhas de pesquisa, equipes e entregas — organize e acompanhe os projetos do LEMM.',
    href: '#projetos',
  },
] as const

export function ManagerView() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 pb-16 pt-8">
      <div className="mb-14 text-center">
        <p className="mb-2 text-xs uppercase tracking-[3px] text-[#00d4ff]">
          Área do Gestor
        </p>
        <h1 className="text-5xl font-black tracking-tight text-white/90">
          LEMM
        </h1>
        <p className="mt-3 text-sm font-light text-white/40">
          Laboratório de Estudos e Modelagem Matemática
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        {cards.map(card => (
          <article
            key={card.id}
            id={card.id}
            className="flex flex-col rounded-2xl p-6"
            style={glass}
          >
            <h2 className="mb-2 text-base font-semibold text-white/90">
              {card.title}
            </h2>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-white/50">
              {card.description}
            </p>
            <Link
              href={card.href}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-xs font-medium text-white/75 transition-colors hover:bg-white/15 hover:text-white"
            >
              Acessar →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
