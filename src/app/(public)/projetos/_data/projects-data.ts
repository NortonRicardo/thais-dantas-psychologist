export type ProjectCategory =
  | 'TCC'
  | 'Iniciação Científica'
  | 'Mestrado'
  | 'Plataforma'
  | 'Pesquisa'

export type ProjectTheme =
  | 'Clima'
  | 'Matemática'
  | 'Otimização e Metaheurísticas'
  | 'Agro & Sustentabilidade'

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  themes: ProjectTheme[]
  description: string
  image?: string
  authors: string[]
  startDate: string        // YYYY-MM-DD
  endDate?: string         // undefined = em andamento
  gitUrl?: string
  publicationUrl?: string
  advisor?: string
  coAdvisor?: string
  researchLead?: string
  pdfPath?: string
}

export const projects: Project[] = [
  {
    id: 'weather-brasil',
    title: 'Weather Brasil',
    category: 'Plataforma',
    themes: ['Clima'],
    description:
      'Plataforma de curadoria, visualização e análise de dados climáticos brasileiros, integrando séries do INMET, mapas interativos e indicadores de risco climático. Desenvolvida no contexto do LEMM com foco em apoio à decisão em políticas públicas, agricultura e adaptação climática. Premiada no Troféu Seriema 2025 (2º lugar — Inovação) e aceita para apresentação no WCERE 2026, em Lisboa, Portugal.',
    image: '/wamen-work.png',
    authors: ['Norton Ricardo Pereira'],
    startDate: '2023-03-01',
    gitUrl: 'https://github.com/lemm-pucgoias/weather-brasil',
    advisor: 'Dra. Maria José Pereira Dantas',
    researchLead: 'Norton Ricardo Pereira',
  },
  {
    id: 'tcc-davi-aquila',
    title: 'Curadoria e Imputação de Dados Meteorológicos do Centro-Oeste',
    category: 'TCC',
    themes: ['Clima', 'Matemática'],
    description:
      'Trabalho de Conclusão de Curso focado na construção de um dataset curado e imputado de variáveis meteorológicas (temperatura, precipitação, umidade) para o Centro-Oeste brasileiro, utilizando dados do INMET e técnicas de machine learning para preenchimento de falhas. O dataset produzido serve de base para modelos de predição de eventos climáticos extremos e projetos de iniciação científica do LEMM.',
    authors: ['Davi Aquila'],
    startDate: '2024-03-01',
    endDate: '2024-12-10',
    advisor: 'Dra. Maria José Pereira Dantas',
    researchLead: 'Davi Aquila',
    pdfPath: '/TCC1 - Davi Aquila.pdf',
  },
  {
    id: 'meta-tool-box',
    title: 'META TOOL BOX — Plataforma de Otimização e Metaheurísticas',
    category: 'Plataforma',
    themes: ['Otimização e Metaheurísticas', 'Matemática'],
    description:
      'Plataforma computacional com registro de software dedicada a algoritmos de otimização e metaheurísticas (PSO, GA, SA, ACO). Desenvolvida desde 2016, conta com módulos para problemas combinatórios, logística, portfólios financeiros e cadeias agroindustriais. Integra aprendizado de máquina com métodos exatos (Learning to Optimize) e serve como base para pesquisas de IC, TCC e mestrado.',
    authors: ['Dra. Maria José Pereira Dantas', 'Prof. Dr. Wanderlei Malaquias Pereira Junior'],
    startDate: '2016-01-01',
    gitUrl: 'https://github.com/lemm-pucgoias/meta-tool-box',
    advisor: 'Dra. Maria José Pereira Dantas',
    coAdvisor: 'Prof. Dr. Wanderlei Malaquias Pereira Junior',
    researchLead: 'Dra. Maria José Pereira Dantas',
  },
  {
    id: 'ic-transformers-precipitacao',
    title: 'Arquiteturas Transformer para Predição de Precipitação no Cerrado',
    category: 'Iniciação Científica',
    themes: ['Clima', 'Matemática'],
    description:
      'Investigação de arquiteturas Transformer e mecanismos de atenção aplicados à predição de precipitação no Cerrado Goiano. O trabalho compara múltiplos modelos de baseline, utiliza dados ERA5 e INMET e integra técnicas de HPC para processamento de séries temporais longas. Resultados preliminares submetidos ao COMPSAC 2026.',
    authors: ['Gabriela (IC)'],
    startDate: '2025-03-01',
    gitUrl: 'https://github.com/lemm-pucgoias/transformer-precipitacao',
    advisor: 'Dra. Maria José Pereira Dantas',
    coAdvisor: 'Salatiel A. A. Jordão',
    researchLead: 'Gabriela (IC)',
  },
  {
    id: 'ic-ondas-de-calor',
    title: 'Modelagem de Ondas de Calor Urbanas no Centro-Oeste',
    category: 'Pesquisa',
    themes: ['Clima'],
    description:
      'Estudo sobre identificação, modelagem e impacto de ondas de calor em centros urbanos goianos, com análise de perfis tipológicos, ilhas de calor e séries de temperatura. Articula dados do INMET com modelagem em WRF e aprendizado de máquina para predição de eventos extremos de temperatura.',
    authors: ['Mirela Marques', 'Prof. Dr. Roussian Di Amaro Alves Gaioso'],
    startDate: '2025-03-01',
    advisor: 'Dra. Maria José Pereira Dantas',
    coAdvisor: 'Prof. Dr. Roussian Di Amaro Alves Gaioso',
    researchLead: 'Mirela Marques',
  },
  {
    id: 'mestrado-ia-fisica-seca',
    title: 'Modelos Híbridos IA-Física para Predição de Seca no Cerrado',
    category: 'Mestrado',
    themes: ['Clima', 'Matemática'],
    description:
      'Dissertação de mestrado que desenvolve e valida modelos híbridos combinando física atmosférica e aprendizado profundo (Transformers, LSTM) para predição de eventos de seca no Cerrado brasileiro. Utiliza dados ERA5-Land, INMET e pipeline de data healing desenvolvido no LEMM. Inclui experimentos em infraestrutura HPC e análise comparativa com modelos climáticos tradicionais.',
    authors: ['Discente PPGEIIA'],
    startDate: '2024-03-01',
    advisor: 'Dra. Maria José Pereira Dantas',
    coAdvisor: 'Dr. Reinaldo Rosa (INPE)',
    researchLead: 'Discente PPGEIIA',
  },
  {
    id: 'logistica-agro-metaheuristica',
    title: 'Otimização Logística em Cadeias Agroindustriais do Centro-Oeste',
    category: 'Pesquisa',
    themes: ['Otimização e Metaheurísticas', 'Agro & Sustentabilidade'],
    description:
      'Pesquisa em modelagem matemática e metaheurísticas aplicadas a problemas de roteamento e logística em cadeias de soja e carne bovina no Centro-Oeste. Incorpora variáveis de risco climático e sustentabilidade na função objetivo, com foco em decisão sob incerteza e rastreabilidade.',
    authors: ['Matheus Henrique Campos'],
    startDate: '2025-03-01',
    advisor: 'Dra. Maria José Pereira Dantas',
    coAdvisor: 'Prof. Dr. Wanderlei Malaquias Pereira Junior',
    researchLead: 'Matheus Henrique Campos',
  },
  {
    id: 'gemeo-digital-agro',
    title: 'Gêmeo Digital para Agricultura de Precisão',
    category: 'Iniciação Científica',
    themes: ['Agro & Sustentabilidade', 'Matemática'],
    description:
      'Desenvolvimento de arquitetura híbrida voltada à tomada de decisão distribuída e adaptativa na agricultura de precisão, integrando fog computing, visão computacional e gêmeos digitais. Articula dados ambientais e sensoriamento remoto para apoio à decisão em campo.',
    authors: ['Sophia (IC)', 'Mateus Newmann (IC)'],
    startDate: '2025-03-01',
    advisor: 'Dra. Maria José Pereira Dantas',
    coAdvisor: 'Prof. Dr. Felipe Veloso',
    researchLead: 'Sophia (IC)',
  },
]

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id)
}
