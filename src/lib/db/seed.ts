import { db } from './index'
import {
  aboutTimelineEntries,
  collaborationPartners,
  developedPlatforms,
  events,
} from './schema'

const seedEvents = [
  {
    title: 'Weather Brasil no WCERE 2026',
    description:
      'Apresentação da plataforma Weather Brasil no World Congress of Environmental and Resource Economists (WCERE 2026), em Lisboa, Portugal. A plataforma integra dados climáticos nacionais com foco em risco ambiental e políticas públicas.',
    date: new Date('2026-06-15T09:00:00'),
    type: 'Conferência',
    link: 'https://wcere2026.org',
    organizer: 'WCERE 2026 — Lisboa, Portugal',
    speaker: 'Norton Ricardo Pereira',
    featured: true,
  },
  {
    title: 'DataSheLeads: Oficina de IA Climática',
    description:
      'Oficina prática voltada a meninas e jovens mulheres em ciência de dados aplicada ao clima. Inclui exploração de bases do INMET, visualização de séries temporais e introdução a modelos de machine learning.',
    date: new Date('2026-05-20T14:00:00'),
    type: 'Workshop',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    organizer: 'DataSheLeads · LEMM',
    speaker: 'Dra. Maria José Pereira Dantas',
  },
  {
    title: 'Desafio Científico em Ciência de Dados',
    description:
      'Competição aberta a estudantes de graduação e pós-graduação. Os participantes recebem uma base de dados real e têm 48 horas para desenvolver modelos preditivos e apresentar resultados.',
    date: new Date('2026-05-28T08:00:00'),
    type: 'Desafio',
    link: 'https://lemm.pucgoias.edu.br/desafio',
    organizer: 'LEMM · PPGEIIA / PUC Goiás',
  },
  {
    title: 'Seminário: Transformers para Modelagem Climática',
    description:
      'Apresentação dos resultados de pesquisa sobre arquiteturas Transformer aplicadas à predição de precipitação no Cerrado Goiano, com comparativo de mecanismos de atenção e experimentos em HPC.',
    date: new Date('2026-06-05T16:00:00'),
    type: 'Seminário',
    meetLink: 'https://teams.microsoft.com/l/meetup-join/mock-link',
    organizer: 'LEMM · INPE',
    speaker: 'Salatiel A. A. Jordão',
  },
  {
    title: 'Minicurso: Metaheurísticas Aplicadas',
    description:
      'Introdução a algoritmos metaheurísticos (PSO, GA, SA) com aplicações em problemas de otimização combinatória, logística e portfólios financeiros. Material prático com Python e plataforma META TOOL BOX.',
    date: new Date('2026-07-10T09:00:00'),
    type: 'Minicurso',
    organizer: 'LEMM · UFCAT',
    speaker: 'Prof. Dr. Wanderlei Malaquias Pereira Junior',
  },
  {
    title: 'Defesa de Dissertação — IA para Predição de Seca',
    description:
      'Defesa pública de dissertação de mestrado sobre modelos híbridos IA-física para predição de eventos de seca no Cerrado, com dados ERA5-Land e INMET integrados via pipeline de data healing.',
    date: new Date('2026-04-10T10:00:00'),
    type: 'Defesa',
    organizer: 'PPGEIIA / PUC Goiás',
  },
  {
    title: 'Seminário: Risco Climático em Cadeias Agroindustriais',
    description:
      'Seminário sobre modelagem de risco climático aplicada às cadeias de soja e carne bovina no Centro-Oeste brasileiro. Inclui discussão de blockchain para rastreabilidade e decisão sob incerteza.',
    date: new Date('2026-03-22T14:30:00'),
    type: 'Seminário',
    organizer: 'LEMM · UFCAT',
    speaker: 'Prof. Dr. Antônio Zamuner',
  },
]

const seedAboutTimeline = [
  {
    date: new Date(Date.UTC(2016, 0, 1)),
    title: 'Fundação do LEMM',
    description:
      'O laboratório é criado na PUC Goiás com foco em modelagem matemática aplicada. Início do desenvolvimento da plataforma META TOOL BOX, voltada a otimização e metaheurísticas.',
  },
  {
    date: new Date(Date.UTC(2018, 0, 1)),
    title: 'Primeiras Parcerias Institucionais',
    description:
      'Estabelecimento de colaboração com a UFCAT no eixo de cadeias agroindustriais e engenharia de produção. Primeiras publicações em congressos nacionais.',
  },
  {
    date: new Date(Date.UTC(2020, 0, 1)),
    title: 'Grupo de Estudos em IA e Mercado Financeiro',
    description:
      'Consolidação do grupo de pesquisa em IA aplicada a mercado financeiro, com publicações em congressos relevantes, capítulo de livro Springer e revista Production.',
  },
  {
    date: new Date(Date.UTC(2022, 0, 1)),
    title: 'Parceria com Furnas e Expansão em HPC',
    description:
      'Início da colaboração com Furnas nas frentes de variáveis climáticas e conservação do solo. Primeiros experimentos com modelagem de alto desempenho (HPC) e WRF.',
  },
  {
    date: new Date(Date.UTC(2023, 0, 1)),
    title: 'Rede INPE e UnB',
    description:
      'Articulação com INPE e UnB (LAMFO e projeto SEM FOGO). Expansão do ecossistema de IC com foco em eventos extremos, seca e ondas de calor no Cerrado.',
  },
  {
    date: new Date(Date.UTC(2024, 0, 1)),
    title: '13 Alunos de IC e Lançamento do Weather Brasil',
    description:
      'Ciclo mais amplo de Iniciação Científica com 13 alunos ativos. Lançamento da plataforma Weather Brasil para curadoria e análise de dados meteorológicos nacionais.',
  },
  {
    date: new Date(Date.UTC(2025, 0, 1)),
    title: 'Troféu Seriema — 2º lugar em Inovação',
    description:
      'Weather Brasil conquista o 2º lugar no Troféu Seriema 2025 na categoria Inovação. A plataforma é aceita para apresentação no WCERE 2026, em Portugal.',
  },
]

const seedDevelopedPlatforms = [
  {
    title: 'Weather Brasil',
    description:
      'Plataforma de dados meteorológicos premiada no Troféu Seriema 2025 (Inovação). Será apresentada no WCERE 2026, em Portugal.',
    projectLink: null,
    platformLink: null,
    badge: '2º lugar Seriema 2025',
    iconKey: 'cloud-sun',
  },
  {
    title: 'META TOOL BOX',
    description:
      'Plataforma de otimização e metaheurísticas com registro de software. Em desenvolvimento contínuo desde 2016, orientada a problemas reais de grande escala.',
    projectLink: null,
    platformLink: null,
    badge: 'Registro de Software',
    iconKey: 'wrench',
  },
]

const seedCollaborationPartners = [
  {
    name: 'INPE',
    description: 'Modelagem climática, HPC e big data espacial',
  },
  {
    name: 'UnB',
    description: 'LAMFO (Finanças e IA) e projeto SEM FOGO',
  },
  {
    name: 'UFCAT',
    description: 'Cadeias agroindustriais, otimização e engenharia civil',
  },
  {
    name: 'Furnas',
    description:
      'Variáveis climáticas, conservação do solo e regulação ambiental (2022–2024)',
  },
]

async function main() {
  console.warn('🌱 Seeding events…')
  await db.delete(events)
  await db.insert(events).values(seedEvents)
  console.warn(`✅ ${seedEvents.length} eventos inseridos.`)

  console.warn('🌱 Seeding sobre nós (linha do tempo)…')
  await db.delete(aboutTimelineEntries)
  await db.insert(aboutTimelineEntries).values(seedAboutTimeline)
  console.warn(`✅ ${seedAboutTimeline.length} marcos inseridos.`)

  console.warn('🌱 Seeding plataformas desenvolvidas…')
  await db.delete(developedPlatforms)
  await db.insert(developedPlatforms).values(seedDevelopedPlatforms)
  console.warn(`✅ ${seedDevelopedPlatforms.length} plataformas inseridas.`)

  console.warn('🌱 Seeding rede de colaboração…')
  await db.delete(collaborationPartners)
  await db.insert(collaborationPartners).values(seedCollaborationPartners)
  console.warn(`✅ ${seedCollaborationPartners.length} parceiros inseridos.`)

  process.exit(0)
}

main().catch(err => {
  console.error('❌ Seed falhou:', err)
  process.exit(1)
})
