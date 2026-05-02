import Link from 'next/link'

const navItems = [
  { href: '/manager', label: 'Home' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#projetos', label: 'Projetos' },
] as const

const cards = [
  {
    id: 'eventos' as const,
    title: 'Eventos',
    description:
      'Calendário e cadastro de eventos: palestras, workshops e encontros do laboratório.',
    href: '#eventos',
  },
  {
    id: 'projetos' as const,
    title: 'Projetos',
    description:
      'Linhas de pesquisa, equipes e entregas — organize e acompanhe os projetos do LEMM.',
    href: '#projetos',
  },
] as const

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const headerShadow = [
  '0 8px 8px rgba(0,0,0,0.1)',
  '0 4px 4px rgba(0,0,0,0.1)',
  '0 2px 2px rgba(0,0,0,0.1)',
  '0 0 0 1px rgba(0,0,0,0.1)',
  'inset 0 0 0 1px rgba(255,255,255,0.03)',
  'inset 0 1px 0 rgba(255,255,255,0.03)',
].join(', ')

export function ManagerView() {
  return (
    <div
      className="min-h-screen text-[#e4e4e7]"
      style={{
        background:
          'radial-gradient(circle at left center, rgba(0,212,255,0.08) 0%, transparent 40%), radial-gradient(circle at 75% 50%, #002d5a 0%, #050a0f 65%)',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div className="mx-auto max-w-[1700px] px-4">
        <header
          className="flex w-full flex-wrap items-center gap-2 px-4 py-2"
          style={{
            background: '#071525',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '0 0 1rem 1rem',
            boxShadow: headerShadow,
          }}
          role="banner"
        >
          {/* Brand */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[1.125rem] font-semibold leading-7 text-[#e4e4e7]">
              LEMM
            </span>
          </div>

          {/* Nav — centered */}
          <nav
            className="mx-auto flex flex-wrap items-center gap-1"
            aria-label="Principal"
          >
            {navItems.map(({ href, label }, i) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm leading-5 transition-colors duration-150"
                style={{
                  color: i === 0 ? '#fafafa' : '#d4d4d8',
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
      </div>

      {/* Page content */}
      <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 pb-16 pt-16">
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
    </div>
  )
}
