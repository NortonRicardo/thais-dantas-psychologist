const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const yearGlass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.22)',
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.5)',
} as const

const events = [
  {
    year: '2016',
    title: 'Fundação do LEMM',
    description:
      'O laboratório é criado na PUC Goiás com foco em modelagem matemática aplicada. Início do desenvolvimento da plataforma META TOOL BOX, voltada a otimização e metaheurísticas.',
  },
  {
    year: '2018',
    title: 'Primeiras Parcerias Institucionais',
    description:
      'Estabelecimento de colaboração com a UFCAT no eixo de cadeias agroindustriais e engenharia de produção. Primeiras publicações em congressos nacionais.',
  },
  {
    year: '2020',
    title: 'Grupo de Estudos em IA e Mercado Financeiro',
    description:
      'Consolidação do grupo de pesquisa em IA aplicada a mercado financeiro, com publicações em congressos relevantes, capítulo de livro Springer e revista Production.',
  },
  {
    year: '2022',
    title: 'Parceria com Furnas e Expansão em HPC',
    description:
      'Início da colaboração com Furnas nas frentes de variáveis climáticas e conservação do solo. Primeiros experimentos com modelagem de alto desempenho (HPC) e WRF.',
  },
  {
    year: '2023',
    title: 'Rede INPE e UnB',
    description:
      'Articulação com INPE e UnB (LAMFO e projeto SEM FOGO). Expansão do ecossistema de IC com foco em eventos extremos, seca e ondas de calor no Cerrado.',
  },
  {
    year: '2024',
    title: '13 Alunos de IC e Lançamento do Weather Brasil',
    description:
      'Ciclo mais amplo de Iniciação Científica com 13 alunos ativos. Lançamento da plataforma Weather Brasil para curadoria e análise de dados meteorológicos nacionais.',
  },
  {
    year: '2025',
    title: 'Troféu Seriema — 2º lugar em Inovação',
    description:
      'Weather Brasil conquista o 2º lugar no Troféu Seriema 2025 na categoria Inovação. A plataforma é aceita para apresentação no WCERE 2026, em Portugal.',
  },
]

function TimelineCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="max-w-xs rounded-2xl px-5 py-5 sm:max-w-sm"
      style={glass}
    >
      <p className="text-sm font-semibold text-white/90">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-white/55">{description}</p>
    </div>
  )
}

function YearBubble({ year }: { year: string }) {
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-widest text-white/90"
      style={yearGlass}
    >
      {year}
    </div>
  )
}

export function Timeline() {
  return (
    <div className="mt-12 w-full pb-16">
      <div className="relative flex flex-col items-center">
        {/* Linha vertical */}
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        <div className="flex w-full flex-col gap-12">
          {events.map((event, i) => {
            const isLeft = i % 2 === 0
            return (
              <div key={event.year} className="relative flex items-center justify-center gap-0">
                {/* Lado esquerdo */}
                <div className="flex w-1/2 justify-end pr-8">
                  {isLeft ? (
                    <TimelineCard title={event.title} description={event.description} />
                  ) : (
                    <div />
                  )}
                </div>

                {/* Bolinha do ano */}
                <YearBubble year={event.year} />

                {/* Lado direito */}
                <div className="flex w-1/2 justify-start pl-8">
                  {!isLeft ? (
                    <TimelineCard title={event.title} description={event.description} />
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
