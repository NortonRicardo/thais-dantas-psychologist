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

/** Escurecimento uniforme + gradiente horizontal (escuro no lado do texto). */
const overlayScrim = 'rgba(5,10,15,0.58)'
const overlayGradientLeft =
  'linear-gradient(90deg,rgba(5,10,15,0.97)_0%,rgba(5,10,15,0.78)_42%,rgba(5,10,15,0.58)_100%)'
const overlayGradientRight =
  'linear-gradient(90deg,rgba(5,10,15,0.58)_0%,rgba(5,10,15,0.78)_58%,rgba(5,10,15,0.97)_100%)'

const areas = [
  {
    id: 'area1',
    imageSrc:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070',
    imageAlt:
      'Paisagem montanhosa — Ciência climática e modelagem ambiental no LEMM',
    tag: 'Ciência Climática & Pesquisa',
    title: 'Modelagem Climática e Ambiental',
    description:
      'Estudo de eventos extremos como secas e ondas de calor. Utilizamos modelos regionais (WRF, MPAS) e integração de dados do INMET e ERA5 para diagnósticos precisos.',
    cta: 'CONHEÇA NOSSA PESQUISA',
    href: '#',
  },
  {
    id: 'area2',
    imageSrc:
      'https://www.plantareducacao.com.br/wp-content/uploads/2022/09/Dashboards-scaled-2.jpg',
    imageAlt: 'Dashboard de dados — IA e ciência de dados no LEMM',
    tag: 'Inteligência Artificial',
    title: 'IA e Ciência de Dados',
    description:
      'Desenvolvimento de arquiteturas Transformers, modelos híbridos (IA + Física) e fluxos de RAG para recuperação de informação científica qualificada.',
    cta: 'VER MODELOS',
    href: '#',
  },
  {
    id: 'area3',
    imageSrc: '/data-center.png',
    imageAlt: 'Data center e infraestrutura — computação de alto desempenho no LEMM',
    tag: 'Alta Performance',
    title: 'Computação de Alto Desempenho (HPC)',
    description:
      'Infraestrutura multiusuária escalável para processamento de Big Data espacial e treinamento intensivo em GPU para modelos complexos.',
    cta: 'INFRAESTRUTURA',
    href: '#',
  },
  {
    id: 'area4',
    imageSrc:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000',
    imageAlt: 'Visualização analítica — otimização e metaheurísticas',
    tag: 'Matemática Aplicada',
    title: 'Otimização e Metaheurísticas',
    description:
      'Pesquisa operacional aplicada a problemas combinatórios de grande escala, finanças e tomada de decisão sob risco climático.',
    cta: 'ALGORITMOS',
    href: '#',
  },
  {
    id: 'area5',
    imageSrc:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000',
    imageAlt: 'Campo agrícola — aplicações agroindustriais e sustentabilidade',
    tag: 'Agro & Sustentabilidade',
    title: 'Aplicações Agroindustriais',
    description:
      'Estudos sobre logística da soja, emissões de CO₂ e agricultura de precisão através de gêmeos digitais e visão computacional.',
    cta: 'SOLUÇÕES AGRO',
    href: '#',
  },
  {
    id: 'area6',
    imageSrc:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000',
    imageAlt: 'Vista urbana — cidades inteligentes e clima urbano',
    tag: 'Smart Cities',
    title: 'Cidades Inteligentes e Clima Urbano',
    description:
      'Análise de ilhas de calor e microclimas para suporte ao planejamento urbano, infraestrutura verde e saúde pública.',
    cta: 'PLANEJAMENTO',
    href: '#',
  },
  {
    id: 'area7',
    imageSrc:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000',
    imageAlt: 'Interface digital — plataformas e produtos tecnológicos',
    tag: 'Produtos Digitais',
    title: 'Plataformas e Produtos Tecnológicos',
    description:
      'Desenvolvimento e expansão de soluções como Weather Brasil e META TOOL BOX para automação analítica e apoio à decisão.',
    cta: 'ACESSAR PLATAFORMAS',
    href: '#',
  },
  {
    id: 'area8',
    imageSrc:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070',
    imageAlt: 'Laboratório e equipamentos — formação de recursos humanos',
    tag: 'Educação & Pesquisa',
    title: 'Formação de Recursos Humanos',
    description:
      'Integração estruturada entre graduação e pós-graduação, formando novos talentos em ciência de dados e modelagem avançada.',
    cta: 'NOSSA EQUIPE',
    href: '#',
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
              background: textRight ? overlayGradientRight : overlayGradientLeft,
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
