export type Event = {
  id: string
  title: string
  description: string
  date: string        // ISO string
  link?: string       // saiba mais / página do evento
  meetLink?: string   // link de sala (Google Meet, Teams, Zoom...)
  image?: string
  organizer?: string
  speaker?: string
  type: 'Conferência' | 'Workshop' | 'Seminário' | 'Desafio' | 'Minicurso' | 'Defesa'
  featured?: boolean
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Weather Brasil no WCERE 2026',
    description:
      'Apresentação da plataforma Weather Brasil no World Congress of Environmental and Resource Economists (WCERE 2026), em Lisboa, Portugal. A plataforma integra dados climáticos nacionais com foco em risco ambiental e políticas públicas.',
    date: '2026-06-15T09:00:00',
    link: 'https://wcere2026.org',
    image: '/wamen-work.png',
    organizer: 'WCERE 2026 — Lisboa, Portugal',
    speaker: 'Norton Ricardo Pereira',
    type: 'Conferência',
    featured: true,
  },
  {
    id: '2',
    title: 'DataSheLeads: Oficina de IA Climática',
    description:
      'Oficina prática voltada a meninas e jovens mulheres em ciência de dados aplicada ao clima. Inclui exploração de bases do INMET, visualização de séries temporais e introdução a modelos de machine learning.',
    date: '2026-05-20T14:00:00',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    organizer: 'DataSheLeads · LEMM',
    speaker: 'Dra. Maria José Pereira Dantas',
    type: 'Workshop',
  },
  {
    id: '3',
    title: 'Desafio Científico em Ciência de Dados',
    description:
      'Competição aberta a estudantes de graduação e pós-graduação. Os participantes recebem uma base de dados real e têm 48 horas para desenvolver modelos preditivos e apresentar resultados.',
    date: '2026-05-28T08:00:00',
    link: 'https://lemm.pucgoias.edu.br/desafio',
    organizer: 'LEMM · PPGEIIA / PUC Goiás',
    type: 'Desafio',
  },
  {
    id: '4',
    title: 'Seminário: Transformers para Modelagem Climática',
    description:
      'Apresentação dos resultados de pesquisa sobre arquiteturas Transformer aplicadas à predição de precipitação no Cerrado Goiano, com comparativo de mecanismos de atenção e experimentos em HPC.',
    date: '2026-06-05T16:00:00',
    meetLink: 'https://teams.microsoft.com/l/meetup-join/mock-link',
    organizer: 'LEMM · INPE',
    speaker: 'Salatiel A. A. Jordão',
    type: 'Seminário',
  },
  {
    id: '5',
    title: 'Minicurso: Metaheurísticas Aplicadas',
    description:
      'Introdução a algoritmos metaheurísticos (PSO, GA, SA) com aplicações em problemas de otimização combinatória, logística e portfólios financeiros. Material prático com Python e plataforma META TOOL BOX.',
    date: '2026-07-10T09:00:00',
    organizer: 'LEMM · UFCAT',
    speaker: 'Prof. Dr. Wanderlei Malaquias Pereira Junior',
    type: 'Minicurso',
  },
  {
    id: '6',
    title: 'Defesa de Dissertação — IA para Predição de Seca',
    description:
      'Defesa pública de dissertação de mestrado sobre modelos híbridos IA-física para predição de eventos de seca no Cerrado, com dados ERA5-Land e INMET integrados via pipeline de data healing.',
    date: '2026-04-10T10:00:00',
    organizer: 'PPGEIIA / PUC Goiás',
    type: 'Defesa',
  },
  {
    id: '7',
    title: 'Seminário: Risco Climático em Cadeias Agroindustriais',
    description:
      'Seminário sobre modelagem de risco climático aplicada às cadeias de soja e carne bovina no Centro-Oeste brasileiro. Inclui discussão de blockchain para rastreabilidade e decisão sob incerteza.',
    date: '2026-03-22T14:30:00',
    organizer: 'LEMM · UFCAT',
    speaker: 'Prof. Dr. Antônio Zamuner',
    type: 'Seminário',
  },
]
