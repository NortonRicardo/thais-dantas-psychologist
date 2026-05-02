import Image from 'next/image'
import { BookOpen, Users, BarChart2, FlaskConical, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const pillars: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BookOpen,
    title: 'Oficinas & Minicursos',
    description:
      'Trilhas práticas em ciência de dados, IA, modelagem matemática e ferramentas computacionais, desenhadas para meninas e jovens mulheres.',
  },
  {
    icon: Users,
    title: 'Mentorias',
    description:
      'Conexão com pesquisadoras, professoras e profissionais de STEM para orientação de carreira, pesquisa e desenvolvimento pessoal.',
  },
  {
    icon: BarChart2,
    title: 'Desafios de Dados',
    description:
      'Competições e projetos aplicados em temas reais — clima, cidades inteligentes, sustentabilidade e inovação social.',
  },
  {
    icon: FlaskConical,
    title: 'Iniciação Científica',
    description:
      'Porta de entrada para trilhas de pesquisa do ecossistema LEMM, com publicações, repositórios e apresentações em eventos.',
  },
  {
    icon: Globe,
    title: 'Impacto & Extensão',
    description:
      'Articulação com escolas, políticas públicas e programas de fomento (FAPEG, CNPq) para ampliar o acesso feminino à ciência.',
  },
]

const topics = [
  'Inteligência Artificial',
  'Ciência de Dados',
  'Modelagem Climática',
  'Cidades Inteligentes',
  'Sustentabilidade',
  'Inovação Social',
  'Otimização',
  'Tecnologias Emergentes',
]

export function SheLeadsSection() {
  return (
    <div className="mt-8 flex w-full flex-col gap-12 pb-16">

      {/* Hero */}
      <div
        className="relative w-full overflow-hidden rounded-3xl"
        style={glass}
      >
        {/* Imagem de fundo com overlay */}
        <div className="absolute inset-0">
          <Image
            src="/wamen-work.png"
            alt=""
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0033]/80 via-[#050a0f]/60 to-transparent" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-start gap-6 px-8 py-10 sm:flex-row sm:items-center sm:px-12 sm:py-14">
          {/* Logo */}
          <div className="shrink-0">
            <Image
              src="/she_leads_data_logo.jpeg"
              alt="DataSheLeads logo"
              width={100}
              height={100}
              className="rounded-2xl"
              style={{ boxShadow: '0 0 40px rgba(180,0,255,0.3)' }}
            />
          </div>

          {/* Texto */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Data<span className="text-purple-400">She</span>Leads
              </h2>
              <span
                className="rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[2px] text-purple-200"
                style={{
                  background: 'rgba(160,0,255,0.2)',
                  border: '1px solid rgba(160,0,255,0.35)',
                }}
              >
                LEMM · PUC Goiás
              </span>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              A marca de formação, inclusão e liderança feminina do ecossistema LEMM.
              Ampliar a participação de meninas e jovens mulheres em ciência de dados,
              IA, modelagem matemática e tecnologias emergentes — com ciência real,
              projetos reais e impacto real.
            </p>
          </div>
        </div>
      </div>

      {/* Pilares */}
      <div>
        <p className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-white/50">
          Como atuamos
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl px-6 py-7"
              style={glass}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-purple-300"
                style={{ background: 'rgba(160,0,255,0.15)', border: '1px solid rgba(160,0,255,0.25)' }}
              >
                <Icon size={17} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white/90">{title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/50">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tópicos */}
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[3px] text-white/50">
          Áreas de atuação
        </p>
        <div className="flex flex-wrap gap-3">
          {topics.map((t) => (
            <span
              key={t}
              className="rounded-full px-4 py-1.5 text-xs text-white/70"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0))',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
