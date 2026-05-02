import { db } from './index'
import { events } from './schema'

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

async function main() {
  console.log('🌱 Seeding events…')
  await db.delete(events)
  await db.insert(events).values(seedEvents)
  console.log(`✅ ${seedEvents.length} eventos inseridos.`)
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Seed falhou:', err)
  process.exit(1)
})
