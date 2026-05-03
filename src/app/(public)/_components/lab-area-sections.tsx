import Image from 'next/image'
import Link from 'next/link'
import { Orbitron } from 'next/font/google'

import { cn } from '@/lib/utils'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

const fontOrbitron = '[font-family:var(--font-orbitron),sans-serif]'

/** Escurecimento uniforme original + gradiente horizontal dramático (escuro no lado do texto). */
const overlayScrim = 'rgba(5,10,15,0.58)'
const overlayGradientLeft =
  'linear-gradient(90deg,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.75) 35%,rgba(0,0,0,0.25) 65%,transparent 100%)'
const overlayGradientRight =
  'linear-gradient(90deg,transparent 0%,rgba(0,0,0,0.25) 35%,rgba(0,0,0,0.75) 65%,rgba(0,0,0,0.92) 100%)'

/**
 * Ordem visual: Formação → Eventos → linhas de pesquisa… Software antes do HPC (#area9).
 */
const areas = [
  {
    id: 'area1',
    imageSrc: '/area1-laboratorio.jpg',
    imageAlt: 'Formação em laboratório — IC, TCC e mestrado',
    tag: 'Formação & Redes',
    title: 'Formação e Articulação Institucional',
    description:
      'A infraestrutura sustenta IC, TCC e mestrado (PPGEIIA), com planos de trabalho articulados entre ciência de dados, IA, clima e otimização. Integramos graduação e pós-graduação e rede com INPE, UnB (LAMFO, SEM FOGO), UFCAT e outros parceiros estratégicos.',
    cta: 'FORMAÇÃO',
    href: '/sobre-nos',
  },
  {
    id: 'area2',
    imageSrc: '/class.png',
    imageAlt: 'Eventos e sala de aula — extensão e capacitação',
    tag: 'Extensão',
    title: 'Eventos, Minicursos e Capacitação',
    description:
      'Organizamos eventos, mesas-redondas e encontros com a comunidade acadêmica e parceiros; conduzimos minicursos práticos (Python para dados, deep learning introdutório, modelagem climática, otimização e ferramentas alinhadas às linhas do laboratório), reforçando a ponte entre formação e pesquisa aplicada.',
    cta: 'EVENTOS',
    href: '/events',
  },
  {
    id: 'area3',
    imageSrc: '/area3-clima.jpg',
    imageAlt:
      'Paisagem e clima — modelagem climática e ambiental no Centro-Oeste',
    tag: 'Ciência Climática & Pesquisa',
    title: 'Modelagem Climática e Ambiental',
    description:
      'A região Centro-Oeste concentra exposição a secas, ondas de calor e anomalias hidrometeorológicas; integramos dados do INMET, reanálises (ERA5), séries espaciais e modelos regionais (WRF, MPAS) para diagnósticos locais, eventos extremos e reconstrução observacional.',
    cta: 'LINHA CLIMÁTICA',
    href: '/projetos?tema=clima',
  },
  {
    id: 'area4',
    imageSrc: '/dashboards-scaled-2.jpg',
    imageAlt:
      'Painéis analíticos — IA, aprendizado profundo e ciência de dados',
    tag: 'Inteligência Artificial',
    title: 'IA e Ciência de Dados',
    description:
      'Desenvolvemos Transformers, modelos híbridos IA–física e fluxos RAG sobre uma base curada com centenas de artigos em clima, em articulação com o repositório do LEMM — revisão assistida por IA, mineração de literatura e recuperação qualificada de conhecimento.',
    cta: 'IA & DADOS',
    href: '/projetos?tema=matematica',
  },
  {
    id: 'area5',
    imageSrc: '/area5-otimizacao.jpg',
    imageAlt: 'Visualização de dados — otimização e metaheurísticas',
    tag: 'Matemática Aplicada',
    title: 'Otimização e Metaheurísticas',
    description:
      'Pesquisa operacional, metaheurísticas e otimização matemática aplicadas a problemas combinatórios, finanças, logística de cadeias agroindustriais e decisão sob risco climático. Consolidamos rotinas e ferramentas de software registradas para apoio à decisão e reprodutibilidade.',
    cta: 'OTIMIZAÇÃO',
    href: '/projetos?tema=otimizacao',
  },
  {
    id: 'area6',
    imageSrc: '/area6-agro.jpg',
    imageAlt: 'Agronegócio — cadeias agroindustriais e sustentabilidade',
    tag: 'Agro & Sustentabilidade',
    title: 'Cadeias Agroindustriais e Precisão',
    description:
      'Estudos sobre logística da soja, emissões de CO₂, conservação de solo, rastreabilidade, gêmeos digitais e visão computacional voltados ao agronegócio do Centro-Oeste e à agricultura de precisão, em rede com Agronomia e parceiros.',
    cta: 'LINHA AGRO',
    href: '/projetos?tema=agro',
  },
  {
    id: 'area7',
    imageSrc: '/area7-cidades.jpg',
    imageAlt: 'Cidade e infraestrutura — clima urbano e smart cities',
    tag: 'Smart Cities',
    title: 'Clima Urbano e Cidades Inteligentes',
    description:
      'Ilhas de calor, microclimas e impactos em saúde e planejamento territorial: apoiamos decisões sobre infraestrutura verde, mitigação térmica e soluções de smart cities, em articulação com linhas de pesquisa em ondas de calor e microclima urbano.',
    cta: 'CIDADES',
    href: '/projetos?tema=clima',
  },
  {
    id: 'area8',
    imageSrc: '/system.png',
    imageAlt:
      'Interfaces de software — automação analítica e produtos computacionais',
    tag: 'Software & Integração',
    title: 'Software, Automação Analítica e Produtos Computacionais',
    description:
      'Desenvolvemos e integramos pipelines de dados, rotinas de imputação e qualidade, automação analítica e fluxos de recuperação de conhecimento aplicados à literatura científica — soluções multiusuárias para apoio à decisão, reprodutibilidade e cooperação institucional, sem depender de um único produto comercial.',
    cta: 'SOLUÇÕES',
    href: '/projetos',
  },
  {
    id: 'area9',
    imageSrc: '/data-center.png',
    imageAlt: 'Infraestrutura computacional — HPC, GPU e ambiente multiusuário',
    tag: 'Alta Performance',
    title: 'Computação de Alto Desempenho (HPC)',
    description:
      'Ambiente multiusuário para armazenamento centralizado, filas e uso intensivo de GPU em Big Data espacial, treinamento e inferência. A ampliação com NAS e estação de IA de alta VRAM escala MPAS, WRF e experimentos que excedem a capacidade típica de VRAM.',
    cta: 'INFRAESTRUTURA',
    href: '/infraestrutura',
  },
] as const

export function LabAreaSections() {
  return (
    <div
      className={cn(
        orbitron.variable,
        'bg-[#050a0f] text-white [font-family:var(--font-inter),sans-serif]'
      )}
    >
      {areas.map((area, index) => {
        const textRight = index % 2 === 1
        return (
          <section
            key={area.id}
            id={area.id}
            className="relative isolate flex min-h-screen items-center overflow-hidden px-[8%] max-md:px-[5%]"
            aria-labelledby={`${area.id}-heading`}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={area.imageSrc}
                alt={area.imageAlt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
                quality={85}
              />
            </div>

            {/* Sombra uniforme sobre toda a foto */}
            <div
              className="pointer-events-none absolute inset-0 z-1"
              style={{ backgroundColor: overlayScrim }}
              aria-hidden
            />

            <div
              className="pointer-events-none absolute inset-0 z-2"
              style={{
                background: textRight
                  ? overlayGradientRight
                  : overlayGradientLeft,
              }}
              aria-hidden
            />

            {/* Gradiente de transição: topo */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-3 h-[22%]"
              style={{
                background: 'linear-gradient(to bottom, #050a0f, transparent)',
              }}
              aria-hidden
            />
            {/* Gradiente de transição: base */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-3 h-[22%]"
              style={{
                background: 'linear-gradient(to top, #050a0f, transparent)',
              }}
              aria-hidden
            />

            <div
              className={cn(
                'relative z-10 w-full max-w-[600px] py-16',
                textRight && 'ml-auto text-right'
              )}
            >
              <span
                className={cn(
                  'mb-4 block text-[0.8rem] font-bold uppercase tracking-[4px] text-[#00d4ff]',
                  fontOrbitron
                )}
              >
                {area.tag}
              </span>
              <h2
                id={`${area.id}-heading`}
                className={cn(
                  'mb-6 text-[clamp(1.8rem,4vw,2.8rem)] font-black uppercase leading-snug',
                  fontOrbitron
                )}
              >
                {area.title}
              </h2>
              <p className="mb-8 text-[1.05rem] font-light leading-relaxed text-[#cbd5e0] sm:text-[1.1rem]">
                {area.description}
              </p>
              <Link
                href={area.href}
                className={cn(
                  'inline-block border border-white/30 px-8 py-3 text-[0.7rem] uppercase tracking-[2px] transition-colors duration-300 hover:bg-white hover:text-black',
                  fontOrbitron
                )}
              >
                {area.cta}
              </Link>
            </div>
          </section>
        )
      })}
    </div>
  )
}
