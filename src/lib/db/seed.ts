import { db } from './index'
import {
  aboutTimelineEntries,
  collaborationPartners,
  contactInfo,
  developedPlatforms,
  eventTypes,
  events,
  hardware,
  hardwareModules,
  teamMembers,
  projects,
} from './schema'

const seedEventTypes = [
  { name: 'Conferência', iconKey: 'Presentation', color: 'bg-sky-800' },
  { name: 'Workshop', iconKey: 'Wrench', color: 'bg-purple-800' },
  { name: 'Seminário', iconKey: 'BookOpen', color: 'bg-blue-800' },
  { name: 'Desafio', iconKey: 'Trophy', color: 'bg-orange-800' },
  { name: 'Minicurso', iconKey: 'GraduationCap', color: 'bg-green-800' },
  { name: 'Defesa', iconKey: 'Shield', color: 'bg-rose-800' },
  { name: 'Palestra', iconKey: 'Mic', color: 'bg-cyan-800' },
  { name: 'Mesa-Redonda', iconKey: 'Users', color: 'bg-yellow-800' },
  { name: 'Encontro', iconKey: 'Handshake', color: 'bg-teal-800' },
]

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

const seedHardwareBlocks = [
  {
    title: 'Estação de trabalho LEMM',
    modules: [
      {
        iconKey: 'Cpu',
        title: 'AMD Ryzen Threadripper PRO 5965WX',
        description:
          'Processador de alto desempenho para workloads paralelos de modelagem e HPC.',
      },
      {
        iconKey: 'MemoryStick',
        title: '512 GB de Memória RAM',
        description:
          'Capacidade para processar grandes bases de dados climáticas e reanálises atmosféricas simultaneamente.',
      },
      {
        iconKey: 'MonitorCheck',
        title: '5× NVIDIA RTX A4000',
        description:
          '16 GB de VRAM cada. Suporte a treinamento de redes neurais, inferência e simulações com GPU.',
      },
    ],
  },
  {
    title: 'Armazenamento e rede',
    modules: [
      {
        iconKey: 'HardDrive',
        title: 'Armazenamento NVMe em RAID',
        description: 'Backups incrementais e datasets climáticos versionados.',
      },
      {
        iconKey: 'Network',
        title: 'Conectividade com parceiros',
        description:
          'Link dedicado para troca de dados com parceiros (INPE, universidades).',
      },
    ],
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

const seedTeamMembers = [
  // Professores
  {
    category: 'professores',
    name: 'Dra. Maria José Pereira Dantas',
    qualification: 'Doutora em Ciência da Computação',
    description:
      'Coordenadora do LEMM. Pesquisa em IA, dados climáticos e otimização.',
    sortOrder: 0,
  },
  {
    category: 'professores',
    name: 'Dr. José Elmo de Menezes',
    qualification: 'Doutor em Estatística',
    description:
      'Vice-coordenador do LEMM. Apoio metodológico em estatística, modelagem quantitativa e articulação de estudos internacionais.',
    sortOrder: 1,
  },
  {
    category: 'professores',
    name: 'Prof. Dr. Wanderlei Malaquias Pereira Junior',
    qualification: 'Doutor em Engenharia de Produção',
    description:
      'Pesquisa em metaheurísticas, otimização combinatória e logística. Coorientador de ICs e colaborador no desenvolvimento da plataforma META TOOL BOX.',
    sortOrder: 2,
  },
  {
    category: 'professores',
    name: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    qualification: 'Doutor em Ciências Atmosféricas',
    description:
      'Pesquisa em modelagem climática urbana, ondas de calor e HPC. Estuda modelos WRF e experimentos de alto desempenho.',
    sortOrder: 3,
  },
  {
    category: 'professores',
    name: 'Prof. Dr. Felipe Veloso',
    qualification: 'Doutor em Computação Aplicada',
    description:
      'Pesquisa em gêmeos digitais e sistemas ciber-físicos para agricultura.',
    sortOrder: 4,
  },
  // Colaboradores
  {
    category: 'colaboradores',
    name: 'Norton Ricardo Pereira',
    qualification: 'Pesquisador e Desenvolvedor Full-Stack',
    description:
      'Desenvolvedor da plataforma Weather Brasil. Premiado no Troféu Seriema 2025.',
    sortOrder: 0,
  },
  {
    category: 'colaboradores',
    name: 'Salatiel A. A. Jordão',
    qualification: 'Pesquisador em IA e Clima — Mestrando INPE',
    description:
      'Pesquisa em Transformers para predição de precipitação no Cerrado. Egresso da PUC Goiás, mestrando em Computação Aplicada no INPE.',
    sortOrder: 1,
  },
  {
    category: 'colaboradores',
    name: 'Mirela Marques',
    qualification: 'Pesquisadora em Clima e Urbanismo',
    description: 'Estudo sobre ondas de calor urbanas em centros goianos.',
    sortOrder: 2,
  },
  {
    category: 'colaboradores',
    name: 'Matheus Henrique Campos',
    qualification: 'Pesquisador em Otimização e Agronegócio',
    description:
      'Metaheurísticas aplicadas à logística em cadeias agroindustriais.',
    sortOrder: 3,
  },
  {
    category: 'colaboradores',
    name: 'Davi Aquila',
    qualification: 'Pesquisador em Ciência de Dados Climáticos',
    description:
      'Curadoria e imputação de dados meteorológicos do Centro-Oeste.',
    sortOrder: 4,
  },
  {
    category: 'colaboradores',
    name: 'Gabriela',
    qualification: 'Iniciação Científica — Transformers e Clima',
    description:
      'Investigação de arquiteturas Transformer para predição de precipitação.',
    sortOrder: 5,
  },
  {
    category: 'colaboradores',
    name: 'Sophia',
    qualification: 'Iniciação Científica — Agricultura de Precisão',
    description:
      'Desenvolvimento de gêmeos digitais para agricultura de precisão.',
    sortOrder: 6,
  },
  {
    category: 'colaboradores',
    name: 'Mateus Newmann',
    qualification: 'Iniciação Científica — Gêmeo Digital',
    description:
      'Arquiteturas fog computing para tomada de decisão distribuída.',
    sortOrder: 7,
  },
  // IC 2026/2027
  {
    category: 'colaboradores',
    name: 'Carlos',
    qualification: 'Iniciação Científica — Eventos Extremos do Clima',
    description:
      'Estudo de eventos extremos do clima articulado ao projeto Tecnologias Disruptivas e à plataforma Weather Brasil.',
    sortOrder: 8,
  },
  {
    category: 'colaboradores',
    name: 'Alysson',
    qualification: 'Iniciação Científica — HPC e WRF',
    description:
      'Modelagem climática com HPC e WRF em colaboração com o INPE e o mestrando Salatiel Jordão.',
    sortOrder: 9,
  },
  {
    category: 'colaboradores',
    name: 'Arthur Felipe',
    qualification: 'Iniciação Científica — IA e Mercado Financeiro',
    description:
      'Pesquisa em IA aplicada ao mercado financeiro, continuidade de linha com publicações em congressos, Springer e revista Production. Alto potencial de gerar produto em trading com IA.',
    sortOrder: 10,
  },
  {
    category: 'colaboradores',
    name: 'Vitor Hugo',
    qualification: 'Iniciação Científica — LSTM e Metaheurísticas Financeiras',
    description:
      'Pesquisa em LSTM e metaheurísticas com variáveis de rastreabilidade e sustentabilidade incorporadas na função objetivo.',
    sortOrder: 11,
  },
  {
    category: 'colaboradores',
    name: 'Gabriel Fonseca',
    qualification: 'Iniciação Científica — Eventos Climáticos Extremos',
    description:
      'Estudo de eventos climáticos extremos com potencial de aplicação no Cerrado. Grande potencial de publicação.',
    sortOrder: 12,
  },
  {
    category: 'colaboradores',
    name: 'Matheus Mendanha',
    qualification: 'Iniciação Científica — Clima Urbano e Smart Cities',
    description:
      'Determinação de localizações ideais para infraestruturas verdes e soluções de Smart Cities, maximizando a redução térmica urbana.',
    sortOrder: 13,
  },
  {
    category: 'colaboradores',
    name: 'Mateus Teixeira',
    qualification: 'Iniciação Científica — Precipitação e Estações Virtuais',
    description:
      'Ampliação da cobertura de dados meteorológicos de temperatura e precipitação no Cerrado Goiano, com estações meteorológicas virtuais.',
    sortOrder: 14,
  },
  {
    category: 'colaboradores',
    name: 'Pedro Mota',
    qualification: 'Iniciação Científica — Queimadas e Monitoramento Ambiental',
    description:
      'Incorporação de variáveis climáticas a modelos de predição de incêndios no Cerrado, em articulação com o projeto SEM FOGO da UnB.',
    sortOrder: 15,
  },
  {
    category: 'colaboradores',
    name: 'Rogério Torres',
    qualification: 'Iniciação Científica — Risco Aeronáutico e Meteorologia',
    description:
      'Estimativa de risco de ocorrência aeronáutica a partir de variáveis meteorológicas observadas, com inclusão de variáveis de clima como elemento inovador.',
    sortOrder: 16,
  },
  // Convidados
  {
    category: 'convidados',
    name: 'Dr. Reinaldo Rosa (INPE)',
    qualification: 'Pesquisador Sênior, INPE',
    description:
      'Colaboração em modelos híbridos IA-física para predição de seca no Cerrado.',
    sortOrder: 0,
  },
  {
    category: 'convidados',
    name: 'Profa. Dra. Marta Luz',
    qualification: 'Pesquisadora — Furnas',
    description:
      'Integração entre variáveis climáticas, conservação do solo, cadeias agroindustriais e políticas/regulações públicas e privadas.',
    sortOrder: 1,
  },
  {
    category: 'convidados',
    name: 'Prof. Dr. Antônio Zamuner',
    qualification: 'Doutor em Engenharia de Produção — UFCAT',
    description:
      'Pesquisa em cadeias agroindustriais, emissões de CO₂, microclima, ondas de calor urbano, blockchain e rastreabilidade logística.',
    sortOrder: 2,
  },
]

type ProjectSeed = {
  slug: string
  title: string
  category: string
  themes: string[]
  description: string
  authors: string[]
  startDate: Date
  endDate?: Date
  gitUrl?: string
  publicationUrl?: string
  advisorName?: string
  coAdvisorName?: string
  researchLeadName?: string
  pdfPath?: string
}

const seedProjectsData: ProjectSeed[] = [
  // ── Plataformas ──────────────────────────────────────────────────────────────
  {
    slug: 'weather-brasil',
    title: 'Weather Brasil',
    category: 'Plataforma',
    themes: ['Clima'],
    description:
      'Plataforma de curadoria, visualização e análise de dados climáticos brasileiros, integrando séries do INMET, mapas interativos e indicadores de risco climático. Premiada no Troféu Seriema 2025 (2º lugar — Inovação) e aceita para apresentação no WCERE 2026, em Lisboa, Portugal.',
    authors: [],
    startDate: new Date('2023-03-01'),
    gitUrl: 'https://github.com/lemm-pucgoias/weather-brasil',
    advisorName: 'Dra. Maria José Pereira Dantas',
    researchLeadName: 'Norton Ricardo Pereira',
  },
  {
    slug: 'meta-tool-box',
    title: 'META TOOL BOX — Plataforma de Otimização e Metaheurísticas',
    category: 'Plataforma',
    themes: ['Otimização e Metaheurísticas', 'Matemática'],
    description:
      'Plataforma computacional com registro de software dedicada a algoritmos de otimização e metaheurísticas (PSO, GA, SA, ACO). Desenvolvida desde 2016, conta com módulos para problemas combinatórios, logística, portfólios financeiros e cadeias agroindustriais. Integra aprendizado de máquina com métodos exatos (Learning to Optimize).',
    authors: [],
    startDate: new Date('2016-01-01'),
    gitUrl: 'https://github.com/lemm-pucgoias/meta-tool-box',
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Wanderlei Malaquias Pereira Junior',
    researchLeadName: 'Dra. Maria José Pereira Dantas',
  },
  // ── TCC ─────────────────────────────────────────────────────────────────────
  {
    slug: 'tcc-davi-aquila',
    title: 'Curadoria e Imputação de Dados Meteorológicos do Centro-Oeste',
    category: 'TCC',
    themes: ['Clima', 'Matemática'],
    description:
      'Trabalho de Conclusão de Curso focado na construção de um dataset curado e imputado de variáveis meteorológicas (temperatura, precipitação, umidade) para o Centro-Oeste brasileiro, utilizando dados do INMET e técnicas de machine learning para preenchimento de falhas.',
    authors: [],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-12-10'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    researchLeadName: 'Davi Aquila',
    pdfPath: '/TCC1 - Davi Aquila.pdf',
  },
  // ── Mestrado ─────────────────────────────────────────────────────────────────
  {
    slug: 'mestrado-ia-fisica-seca',
    title: 'Modelos Híbridos IA-Física para Predição de Seca no Cerrado',
    category: 'Mestrado',
    themes: ['Clima', 'Matemática'],
    description:
      'Dissertação de mestrado que desenvolve e valida modelos híbridos combinando física atmosférica e aprendizado profundo (Transformers, LSTM) para predição de eventos de seca no Cerrado brasileiro. Utiliza dados ERA5-Land, INMET e pipeline de data healing desenvolvido no LEMM.',
    authors: ['Discente PPGEIIA'],
    startDate: new Date('2024-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Dr. Reinaldo Rosa (INPE)',
  },
  // ── Pesquisa ─────────────────────────────────────────────────────────────────
  {
    slug: 'logistica-agro-metaheuristica',
    title: 'Otimização Logística em Cadeias Agroindustriais do Centro-Oeste',
    category: 'Pesquisa',
    themes: ['Otimização e Metaheurísticas', 'Agro & Sustentabilidade'],
    description:
      'Pesquisa em modelagem matemática e metaheurísticas aplicadas a problemas de roteamento e logística em cadeias de soja e carne bovina no Centro-Oeste. Incorpora variáveis de risco climático e sustentabilidade na função objetivo.',
    authors: [],
    startDate: new Date('2025-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Wanderlei Malaquias Pereira Junior',
    researchLeadName: 'Matheus Henrique Campos',
  },
  // ── Iniciação Científica ─────────────────────────────────────────────────────
  {
    slug: 'ic-transformers-precipitacao',
    title: 'Arquiteturas Transformer para Predição de Precipitação no Cerrado',
    category: 'Iniciação Científica',
    themes: ['Clima', 'Matemática'],
    description:
      'Investigação de arquiteturas Transformer e mecanismos de atenção aplicados à predição de precipitação no Cerrado Goiano. Compara múltiplos modelos de baseline, utiliza dados ERA5 e INMET e integra técnicas de HPC. Resultados submetidos ao COMPSAC 2026.',
    authors: [],
    startDate: new Date('2025-03-01'),
    gitUrl: 'https://github.com/lemm-pucgoias/transformer-precipitacao',
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Salatiel A. A. Jordão',
    researchLeadName: 'Gabriela',
  },
  {
    slug: 'ic-ondas-de-calor',
    title: 'Modelagem de Ondas de Calor Urbanas no Centro-Oeste',
    category: 'Pesquisa',
    themes: ['Clima'],
    description:
      'Estudo sobre identificação, modelagem e impacto de ondas de calor em centros urbanos goianos, com análise de perfis tipológicos, ilhas de calor e séries de temperatura. Articula dados do INMET com modelagem em WRF e aprendizado de máquina.',
    authors: [],
    startDate: new Date('2025-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    researchLeadName: 'Mirela Marques',
  },
  {
    slug: 'ic-gemeo-digital-agro',
    title: 'Gêmeo Digital para Agricultura de Precisão',
    category: 'Iniciação Científica',
    themes: ['Agro & Sustentabilidade', 'Matemática'],
    description:
      'Desenvolvimento de arquitetura híbrida voltada à tomada de decisão distribuída e adaptativa na agricultura de precisão, integrando fog computing, visão computacional e gêmeos digitais. Articula dados ambientais e sensoriamento remoto para apoio à decisão em campo.',
    authors: [],
    startDate: new Date('2025-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Felipe Veloso',
    researchLeadName: 'Sophia',
  },
  {
    slug: 'ic-fog-computing-agro',
    title: 'Fog Computing para Tomada de Decisão em Cadeias Agroindustriais',
    category: 'Iniciação Científica',
    themes: ['Agro & Sustentabilidade'],
    description:
      'Estudo de arquiteturas fog computing voltadas à tomada de decisão distribuída em cadeias agroindustriais do Centro-Oeste. Segunda iniciação científica do aluno, com avanços importantes e artigo em redação para envio ao ENIAC 2026 (BRACIS 2026).',
    authors: [],
    startDate: new Date('2025-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Felipe Veloso',
    researchLeadName: 'Mateus Newmann',
  },
  // ── IC 2026/2027 ─────────────────────────────────────────────────────────────
  {
    slug: 'ic-eventos-extremos-carlos',
    title: 'Estudo de Eventos Extremos do Clima no Cerrado',
    category: 'Iniciação Científica',
    themes: ['Clima'],
    description:
      'Investigação de eventos extremos do clima no Cerrado Goiano, integrado ao projeto "Tecnologias Disruptivas..." e à plataforma Weather Brasil. Inclui estudos de modelagem atmosférica com suporte de HPC. Acompanhado pelo mestrando Norton Ricardo Pereira e pelo Prof. Dr. Roussian Di Amaro Alves Gaioso.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    researchLeadName: 'Carlos',
  },
  {
    slug: 'ic-hpc-wrf-alysson',
    title: 'Modelagem Climática com HPC e WRF no Cerrado',
    category: 'Iniciação Científica',
    themes: ['Clima'],
    description:
      'Estudo de modelagem climática utilizando computação de alto desempenho (HPC) e o modelo WRF, articulado ao projeto "Tecnologias Disruptivas..." e à rede INPE–PUC Goiás. Acompanhado pelo mestrando do INPE Salatiel A. A. Jordão e pelo Dr. Reinaldo Rosa.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    researchLeadName: 'Alysson',
  },
  {
    slug: 'ic-mercado-financeiro-arthur',
    title: 'IA e Metaheurísticas Aplicadas ao Mercado Financeiro',
    category: 'Iniciação Científica',
    themes: ['Otimização e Metaheurísticas'],
    description:
      'Pesquisa em inteligência artificial e trading aplicados ao mercado financeiro, em continuidade à linha do grupo desde 2020, com publicações em congressos nacionais, capítulo de livro Springer e revista Production. Alto potencial de gerar produto em trading com IA.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    researchLeadName: 'Arthur Felipe',
  },
  {
    slug: 'ic-mercado-financeiro-vitor',
    title:
      'LSTM e Metaheurísticas com Rastreabilidade e Sustentabilidade Financeira',
    category: 'Iniciação Científica',
    themes: ['Otimização e Metaheurísticas'],
    description:
      'Pesquisa em mercado financeiro com uso de LSTM e metaheurísticas, incorporando variáveis de rastreabilidade e sustentabilidade diretamente na função objetivo. Articulado com artigo científico em desenvolvimento pelo egresso Danilo Milhomem.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    researchLeadName: 'Vitor Hugo',
  },
  {
    slug: 'ic-eventos-extremos-gabriel',
    title: 'Predição de Eventos Climáticos Extremos no Cerrado',
    category: 'Iniciação Científica',
    themes: ['Clima'],
    description:
      'Estudo de eventos climáticos extremos com potencial de aplicação no Cerrado, com grande potencial de publicação. Articulado com frentes de modelagem climática e agronomia do laboratório.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    researchLeadName: 'Gabriel Fonseca',
  },
  {
    slug: 'ic-clima-urbano-smart-cities',
    title: 'Infraestruturas Verdes e Smart Cities para Redução Térmica Urbana',
    category: 'Iniciação Científica',
    themes: ['Clima'],
    description:
      'Determinação de localizações ideais para implementação de infraestruturas verdes e soluções de Smart Cities, maximizando a redução térmica em centros urbanos. Articulado com estudos de ondas de calor e clima urbano do laboratório, com colaboração do Prof. Dr. Antônio Zamuner (UFCAT) e Prof. Dr. Roussian Di Amaro Alves Gaioso.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    researchLeadName: 'Matheus Mendanha',
  },
  {
    slug: 'ic-precipitacao-cerrado-mateus-teixeira',
    title: 'Ampliação da Cobertura Meteorológica no Cerrado Goiano',
    category: 'Iniciação Científica',
    themes: ['Clima'],
    description:
      'Pesquisa voltada à ampliação da cobertura de dados meteorológicos de temperatura e precipitação no Cerrado Goiano, com desenvolvimento de estações meteorológicas virtuais. Articulada com estudos do pós-doutoramento no INPE (supervisor Dr. Reinaldo Rosa) e com HPC pelo Prof. Dr. Roussian Di Amaro Alves Gaioso.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    coAdvisorName: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    researchLeadName: 'Mateus Teixeira',
  },
  {
    slug: 'ic-queimadas-sem-fogo',
    title: 'Predição de Incêndios no Cerrado com Variáveis Climáticas',
    category: 'Iniciação Científica',
    themes: ['Clima', 'Agro & Sustentabilidade'],
    description:
      'Incorporação de variáveis climáticas (temperatura, umidade, vento e precipitação) a modelos de predição de incêndios no bioma Cerrado, em articulação com o projeto SEM FOGO da UnB (Profa. Priscilla Solis). Utilizará dataset curado do Centro-Oeste produzido no TCC de Davi Aquila.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    researchLeadName: 'Pedro Mota',
  },
  {
    slug: 'ic-risco-aeronautico',
    title:
      'Estimativa de Risco Aeronáutico a partir de Variáveis Meteorológicas',
    category: 'Iniciação Científica',
    themes: ['Clima'],
    description:
      'Pesquisa com objetivo de estimar o risco de ocorrência aeronáutica a partir de variáveis meteorológicas observadas. A inclusão de variáveis climáticas (temperatura, umidade, vento e precipitação) é elemento inovador ao modelo de predição, com grande potencial de publicação.',
    authors: [],
    startDate: new Date('2026-03-01'),
    advisorName: 'Dra. Maria José Pereira Dantas',
    researchLeadName: 'Rogério Torres',
  },
]

async function main() {
  console.warn('🌱 Seeding tipos de evento…')
  await db.delete(eventTypes)
  await db.insert(eventTypes).values(seedEventTypes)
  console.warn(`✅ ${seedEventTypes.length} tipos inseridos.`)

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

  console.warn('🌱 Seeding hardware (vários equipamentos + módulos)…')
  await db.delete(hardware)
  for (const block of seedHardwareBlocks) {
    const [hw] = await db
      .insert(hardware)
      .values({ title: block.title })
      .returning({ id: hardware.id })
    await db.insert(hardwareModules).values(
      block.modules.map((m, i) => ({
        hardwareId: hw.id,
        title: m.title,
        iconKey: m.iconKey,
        description: m.description,
        sortOrder: i,
      }))
    )
  }
  const modCount = seedHardwareBlocks.reduce((n, b) => n + b.modules.length, 0)
  console.warn(
    `✅ ${seedHardwareBlocks.length} equipamentos e ${modCount} módulos inseridos.`
  )

  console.warn('🌱 Seeding Parcerias…')
  await db.delete(collaborationPartners)
  await db.insert(collaborationPartners).values(seedCollaborationPartners)
  console.warn(`✅ ${seedCollaborationPartners.length} parceiros inseridos.`)

  console.warn('🌱 Seeding equipe…')
  await db.delete(teamMembers)
  const insertedMembers = await db
    .insert(teamMembers)
    .values(seedTeamMembers)
    .returning({ id: teamMembers.id, name: teamMembers.name })
  const memberNameToId = Object.fromEntries(
    insertedMembers.map(m => [m.name, m.id])
  )
  console.warn(`✅ ${insertedMembers.length} membros inseridos.`)

  console.warn('🌱 Seeding contato…')
  await db.delete(contactInfo)
  await db.insert(contactInfo).values({
    mapUrl:
      'https://maps.google.com/maps?q=-16.6784792,-49.2453736&z=17&output=embed',
  })
  console.warn('✅ Contato inserido.')

  console.warn('🌱 Seeding projetos…')
  await db.delete(projects)
  const projectValues = seedProjectsData.map(p => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    themes: p.themes,
    description: p.description,
    authors: p.authors,
    startDate: p.startDate,
    endDate: p.endDate ?? null,
    gitUrl: p.gitUrl ?? null,
    publicationUrl: p.publicationUrl ?? null,
    advisorId: p.advisorName ? (memberNameToId[p.advisorName] ?? null) : null,
    coAdvisorId: p.coAdvisorName
      ? (memberNameToId[p.coAdvisorName] ?? null)
      : null,
    researchLeadId: p.researchLeadName
      ? (memberNameToId[p.researchLeadName] ?? null)
      : null,
    pdfPath: p.pdfPath ?? null,
  }))
  await db.insert(projects).values(projectValues)
  console.warn(`✅ ${projectValues.length} projetos inseridos.`)

  process.exit(0)
}

main().catch(err => {
  console.error('❌ Seed falhou:', err)
  process.exit(1)
})
