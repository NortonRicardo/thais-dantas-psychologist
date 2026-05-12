# CONTRATO DE PRESTAÇÃO DE SERVIÇOS
# DESENVOLVIMENTO E MANUTENÇÃO DE SOFTWARE

---

## IDENTIFICAÇÃO DAS PARTES

### CONTRATADA

> **Razão Social:** IADA LTDA
> **CNPJ:** 47.917.618/0001-84

> **Representante Legal:**

&emsp;&emsp; **Norton Pereira Ricardo** CPF: 052.172.041-92

> **Desenvolvedora Responsável:**

&emsp;&emsp; **Luciana Lopes de Freitas** CPF: 051.362.691-38

---

### CONTRATANTE

> **Maria José Pereira Dantas**
> CPF: 281.401.411-00

---

As partes acima identificadas têm entre si justo e acertado o presente **Contrato de Prestação de Serviços de Desenvolvimento e Manutenção de Software**, que se regerá pelas cláusulas e condições a seguir estipuladas.

---

## CLÁUSULA PRIMEIRA — DO OBJETO

O presente contrato tem por objeto a **entrega, implantação e manutenção do sistema web denominado LEMM** — Laboratório de Estatística e Modelagem Matemática — sistema de gerenciamento de conteúdo (CMS) fullstack, já desenvolvido, aprovado e validado pela CONTRATANTE, conforme demonstração prévia realizada antes da assinatura deste instrumento.

O sistema objeto deste contrato encontra-se na versão **0.1.0** e compreende todas as funcionalidades detalhadas nas cláusulas seguintes.

---

## CLÁUSULA SEGUNDA — DECLARAÇÃO DE APROVAÇÃO PRÉVIA

A CONTRATANTE declara, para todos os fins de direito, que o sistema LEMM foi previamente demonstrado e apresentado pela CONTRATADA, tendo sido **expressamente aprovado** pela CONTRATANTE em todos os seus módulos, funcionalidades, design e fluxos de uso. A assinatura do presente contrato confirma essa aprovação e autoriza o processo de deploy e ativação em produção.

---

## CLÁUSULA TERCEIRA — DESCRIÇÃO COMPLETA DO SISTEMA ENTREGUE

### 3.1 Visão Geral

O sistema **LEMM** é uma plataforma web completa, composta por dois ambientes:

1. **Portal Público** — site institucional acessível a qualquer visitante, sem necessidade de autenticação;
2. **Painel de Gerenciamento Administrativo** — área restrita para gestão de todo o conteúdo do sistema, acessível exclusivamente pela CONTRATANTE mediante senha.

---

### 3.2 Páginas e Módulos do Portal Público

O portal público é composto pelas seguintes páginas e funcionalidades:

#### 3.2.1 Página Inicial — Home / Landing Page

- Apresentação institucional do laboratório
- Seção hero com identidade visual
- Destaques das principais áreas de atuação
- Navegação para demais seções do site
- Rodapé (footer) com informações gerais

#### 3.2.2 Sobre Nós — `/sobre-nos`

- Histórico e missão do laboratório
- **Timeline interativa** com marcos históricos ordenados cronologicamente
- Cada entrada de timeline exibe: mês/ano, título do evento e descrição detalhada
- Visualização responsiva adaptada para desktop e dispositivos móveis

#### 3.2.3 Projetos — `/projetos`

- Catálogo completo de produções acadêmicas e técnicas do laboratório
- Categorias disponíveis: **TCC**, **Iniciação Científica (IC)**, **Mestrado**, **Plataforma**, **Pesquisa**
- Sistema de filtros por categoria, temas e palavras-chave
- Grid de cards com imagem de capa, título, autores e categoria
- Paginação dos resultados

#### 3.2.4 Detalhes do Projeto — `/projetos/[id]`

- Visualização detalhada de projeto individual
- Exibe: título, descrição completa, categoria, temas, autores, datas de início e fim
- Informações de orientação: orientador, co-orientador e pesquisador principal
- Links externos: repositório GitHub e publicação acadêmica (quando disponíveis)
- **Visualização e download de PDF** do trabalho completo (quando disponível)
- Imagem de capa em destaque

#### 3.2.5 Equipe — `/equipe`

- Catálogo de membros organizados por categoria:
  - **Professores** — corpo docente e pesquisadores titulares
  - **Colaboradores** — pesquisadores associados e parceiros
  - **Convidados** — membros temporários e visitantes
- Cards individuais com foto, nome completo, qualificação acadêmica/profissional e biografia
- Ordenação customizável definida no painel administrativo

#### 3.2.6 Infraestrutura — `/infraestrutura`

Seção dividida em três subáreas:

**Hardware / Equipamentos HPC**
- Listagem de equipamentos de alto desempenho computacional
- Cada equipamento possui módulos detalhados com ícone representativo e especificações técnicas

**Plataformas Desenvolvidas**
- Catálogo de sistemas e softwares criados pelo laboratório
- Exibe: nome, descrição, badge de status (ex.: "Beta", "Produção"), ícone visual
- Links para projeto (GitHub) e acesso à plataforma

**Rede de Colaboração**
- Lista de instituições e organizações parceiras
- Exibe: nome e descrição do relacionamento institucional

#### 3.2.7 Eventos — `/eventos`

- Listagem de eventos científicos e acadêmicos ordenados por data
- Tipos de evento suportados: **Conferência**, **Workshop**, **Seminário**, **Desafio**, **Minicurso**, **Defesa**, **Palestra**, **Mesa-Redonda**, **Encontro**
- Cada evento exibe: título, data, tipo, palestrante/organizador, links de acesso/transmissão
- Suporte a destaque (featured) para eventos de maior relevância
- Imagem de capa por evento

#### 3.2.8 Contato — `/contato`

- Informações oficiais de contato do laboratório
- Exibe: nome e cargo do diretor/gestor, e-mail institucional, telefone e perfil LinkedIn

#### 3.2.9 Data SheLeads — `/data-sheleads`

- Página dedicada à iniciativa de inclusão e liderança feminina em STEM
- Apresentação da proposta, objetivos e ações da iniciativa

---

### 3.3 Painel de Gerenciamento Administrativo

Acessível via `/manager`, protegido por autenticação com senha exclusiva da CONTRATANTE. O painel possui os seguintes módulos:

#### 3.3.1 Login — `/manager/login`

- Autenticação por senha configurável via variável de ambiente segura
- Sessão com duração de **7 dias**, renovável automaticamente ao usar o sistema
- Cookie HTTP-only (inacessível por scripts externos, por segurança)
- Logout disponível em qualquer tela do painel

#### 3.3.2 Dashboard — `/manager`

- Tela inicial do painel com acesso rápido a todos os módulos
- Visão geral dos conteúdos gerenciados

#### 3.3.3 Gerenciar Eventos — `/manager/eventos`

- Criar, editar e excluir eventos
- Campos: título, descrição, data/hora, tipo, palestrante, organizador, link do evento, link Google Meet, destaque (sim/não)
- Upload de imagem de capa do evento
- Confirmação antes de exclusão (dialog de alerta)

#### 3.3.4 Gerenciar Sobre Nós — `/manager/sobre-nos`

- CRUD completo das entradas da timeline histórica
- Campos: mês/ano, título do marco, descrição
- Ordenação cronológica automática

#### 3.3.5 Gerenciar Plataformas — `/manager/plataformas`

- CRUD completo das plataformas desenvolvidas pelo laboratório
- Campos: título, descrição, link do projeto (GitHub), link de acesso, badge de status, ícone visual

#### 3.3.6 Gerenciar Hardware — `/manager/hardware`

- CRUD completo de equipamentos HPC
- Cada equipamento suporta múltiplos módulos aninhados
- Módulos possuem: título, ícone, descrição técnica e ordem de exibição
- Limite de 24 equipamentos e 48 módulos por equipamento

#### 3.3.7 Gerenciar Rede de Colaboração — `/manager/rede-colaboracao`

- CRUD completo de parceiros institucionais
- Campos: nome da instituição e descrição do relacionamento

#### 3.3.8 Gerenciar Equipe — `/manager/equipe`

- CRUD completo de membros da equipe
- Campos: categoria, nome, qualificação, biografia, foto (upload de imagem), ordem de exibição
- Realocação da ordem de exibição por módulo

#### 3.3.9 Gerenciar Contato — `/manager/contato`

- Edição das informações oficiais de contato
- Campos: nome do diretor, cargo, e-mail, telefone, LinkedIn, foto do diretor (upload)

#### 3.3.10 Gerenciar Projetos — `/manager/projetos`

- CRUD completo de projetos e produções acadêmicas
- Campos: título, slug (URL única), categoria, temas (múltiplos), descrição, imagem de capa (upload), autores (múltiplos), data de início, data de fim, link GitHub, link de publicação, orientador, co-orientador e pesquisador principal (vinculados à equipe cadastrada)
- Upload de **arquivo PDF** do trabalho completo
- Visualização pré-entrega com prévia dos dados

---

## CLÁUSULA QUARTA — INFRAESTRUTURA E TECNOLOGIA

### 4.1 Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework Web | Next.js | 16.2.4 |
| Linguagem | TypeScript | 5 |
| Runtime | Node.js + Bun | — |
| Estilização | Tailwind CSS | 4 |
| Componentes UI | Radix UI + Base UI | — |
| Ícones | Lucide React | 0.574.0 |
| ORM | Drizzle ORM | 0.45.2 |
| Banco de Dados | PostgreSQL | 15+ |
| Notificações | Sonner | 2.0.7 |
| Containerização | Docker + Docker Compose | — |

### 4.2 Banco de Dados — Estrutura das Tabelas

O banco de dados PostgreSQL é composto pelas seguintes tabelas:

| Tabela | Descrição |
|---|---|
| `projects` | Projetos, TCCs, dissertações e plataformas acadêmicas |
| `events` | Eventos científicos (conferências, workshops, defesas, etc.) |
| `team_members` | Membros da equipe (professores, colaboradores, convidados) |
| `hardware` | Equipamentos de alta performance (HPC) |
| `hardware_modules` | Módulos detalhados de cada equipamento |
| `developed_platforms` | Plataformas e sistemas desenvolvidos pelo laboratório |
| `collaboration_partners` | Instituições parceiras e rede de colaboração |
| `about_timeline_entries` | Marcos históricos para a timeline de "Sobre Nós" |
| `contact_info` | Informações de contato do diretor e do laboratório |

Todas as tabelas possuem identificadores únicos (UUID v4) gerados automaticamente e campos de auditoria (`createdAt` e `updatedAt` com timezone).

### 4.3 Processamento e Armazenamento de Imagens e Arquivos

Todas as imagens e documentos PDF são processados da seguinte forma:

1. **Recebidos via upload** diretamente pelo painel administrativo, em formulários seguros
2. **Processados em memória** pelo servidor Node.js/Next.js sem gravação temporária em disco
3. **Armazenados no banco de dados PostgreSQL** como dados binários (`bytea`), junto com o tipo MIME do arquivo
4. **Servidos ao usuário final** via rotas de API dedicadas que entregam o arquivo diretamente ao navegador com os cabeçalhos HTTP corretos
5. **Sem dependência de serviços externos** de armazenamento — sem Amazon S3, sem Cloudinary, sem CDN de terceiros. Todo o conteúdo de mídia reside no próprio banco de dados

Formatos suportados: **JPEG** e **PNG** (imagens) · **PDF** (documentos)

### 4.4 Autenticação e Segurança

- Autenticação via senha única armazenada como variável de ambiente no servidor (não exposta no código-fonte)
- Sessão gerenciada por **cookie HTTP-only** com TTL de 7 dias (inacessível por JavaScript externo)
- Middleware de proteção em todas as rotas administrativas — acesso bloqueado automaticamente sem autenticação válida
- Sem dependência de provedores externos de autenticação (sem Google OAuth, sem Auth0)

### 4.5 Containerização e Deployment

O sistema é entregue com configuração completa de containerização:

- **`Dockerfile`** — imagem de produção otimizada
- **`Dockerfile.dev`** — imagem para ambiente de desenvolvimento
- **`docker-compose.yml`** — orquestração dos serviços (aplicação + banco de dados)
- Migrações do banco de dados executadas automaticamente na inicialização
- Build de produção via `next build` + execução via `next start`

---

## CLÁUSULA QUINTA — DO VALOR E FORMA DE PAGAMENTO

### 5.1 Composição e Valor Total

| # | Item | Valor |
|---|---|---|
| 1 | Desenvolvimento do sistema LEMM | R$ 3.100,00 |
| 2 | Registro de domínio — 2 anos (`lemm.com.br`, venc. 28/04/2028) | R$ 200,00 |
| 3 | Hospedagem do servidor — 1 ano (venc. 15/05/2027) | R$ 500,00 |
| 4 | Imposto sobre nota fiscal | R$ 380,00 |
| | **TOTAL** | **R$ 4.180,00** |

> **Valor Total: R$ 4.180,00**
> *(quatro mil, cento e oitenta reais)*
> Pago **à vista**, contra entrega e ativação do sistema em ambiente de produção.

### 5.2 O Que Está Incluso no Valor

O valor total compreende integralmente:

| Item | Descrição |
|---|---|
| **Desenvolvimento do Sistema LEMM** | Entrega do sistema completo descrito neste contrato |
| **Registro de Domínio** | Domínio `lemm.com.br` registrado e mantido por **2 (dois) anos** |
| **Hospedagem do Servidor** | Servidor dedicado pelo período de **1 (um) ano** (venc. 15/05/2027) |
| **Deploy e Ativação** | Configuração e implantação do sistema em ambiente de produção |
| **Manutenção do Servidor** | Gerenciamento técnico do ambiente de execução pelo período de 1 ano |
| **Backup Mensal** | Backup completo do banco de dados todo dia **25** de cada mês, durante 1 ano |
| **Correção de Bugs** | Correção de falhas funcionais pelo período de **1 (um) ano** |
| **Pequenos Ajustes** | Alterações de baixo impacto conforme definido na Cláusula Sétima |

### 5.3 O Que NÃO Está Incluso no Valor

Os seguintes itens **não estão incluídos** no valor contratado e serão objeto de orçamento e cobrança separados:

| Item | Observação |
|---|---|
| **Renovação de Hospedagem (após 1 ano)** | Após 15/05/2027, a renovação será orçada e formalizada em Aditivo Contratual |
| **Novas Telas ou Funcionalidades** | Desenvolvimento de páginas ou módulos não presentes neste contrato |
| **Mudanças Estruturais** | Alterações na arquitetura, banco de dados, infraestrutura ou stack tecnológica |
| **Integrações com Terceiros** | Integrações com APIs externas, sistemas de pagamento, e-mail marketing, etc. |

---

## CLÁUSULA SEXTA — DO DOMÍNIO, HOSPEDAGEM E ATIVAÇÃO EM PRODUÇÃO

### 6.1 Domínio

| Campo | Informação |
|---|---|
| **Endereço** | `lemm.com.br` |
| **Registrador** | GoDaddy |
| **Titularidade** | IADA LTDA (em nome da CONTRATANTE) |
| **Vencimento** | **28 de abril de 2028** |
| **Transferência de posse** | Disponível a partir de **27 de junho de 2026** |

O domínio encontra-se registrado e gerenciado pela **IADA LTDA** em benefício da CONTRATANTE. A transferência da titularidade para conta própria da CONTRATANTE poderá ser solicitada a qualquer momento após **27 de junho de 2026** (data de liberação pela plataforma GoDaddy), mediante simples solicitação e indicação de conta GoDaddy de destino, sem custo adicional.

### 6.2 Servidor de Hospedagem

| Especificação | Configuração |
|---|---|
| **Processamento** | 4 vCPU Cores |
| **Memória RAM** | 8 GB |
| **Armazenamento** | 300 GB SSD |
| **Snapshots** | 1 Snapshot |
| **Largura de banda** | 200 Mbit/s |
| **Latência** | ~127 ms |
| **Vencimento** | **15 de maio de 2027** |

O servidor está contratado e gerenciado pela **IADA LTDA** pelo período de 1 (um) ano incluso no valor deste contrato. Após o vencimento em **15/05/2027**, a renovação deverá ser acordada entre as partes mediante Aditivo Contratual.

### 6.3 Processo de Ativação

1. Após o pagamento do valor contratado, a CONTRATADA realizará o **deploy do sistema** e a **ativação do domínio**
2. A CONTRATADA entregará à CONTRATANTE as credenciais de acesso ao painel administrativo após a ativação
3. A partir da ativação, o período de manutenção e garantia de 1 ano tem início

### 6.4 Responsabilidades sobre a Infraestrutura

- A gestão técnica do domínio e do servidor (configurações, atualizações de segurança, monitoramento) é de responsabilidade da **CONTRATADA** pelo período contratado
- Após o vencimento dos serviços de hospedagem (15/05/2027), a indisponibilidade do sistema por falta de renovação não configura descumprimento contratual pela CONTRATADA

---

## CLÁUSULA SÉTIMA — DA MANUTENÇÃO E GARANTIA

### 7.1 Período de Manutenção

A CONTRATADA prestará serviços de manutenção pelo período de **1 (um) ano**, com **vencimento em 15 de maio de 2027**, podendo ser renovado mediante Aditivo Contratual celebrado antes dessa data.

### 7.2 Serviços Incluídos na Manutenção

**a) Backup Mensal**

- Realização de backup completo do banco de dados no dia **25 (vinte e cinco)** de cada mês
- Armazenamento seguro dos 3 backups mais recentes
- Restauração em caso de falha crítica

**b) Correção de Bugs**

- Identificação e correção de falhas funcionais no sistema
- Prazo de resposta: até **5 (cinco) dias úteis** para bugs de baixa criticidade
- Prazo de resposta: até **48 (quarenta e oito) horas** para falhas críticas que impossibilitem o uso do sistema

**c) Pequenos Ajustes** *(sem custo adicional)*

Entende-se por pequenos ajustes toda e qualquer alteração que **não modifique a estrutura do banco de dados, a arquitetura do sistema ou requeira novas telas**, incluindo:

- Troca ou atualização de imagens (fotos de equipe, capa de eventos, etc.)
- Alteração de textos e conteúdos já existentes
- Adição de novos filtros simples em listagens existentes
- Adição de campos de texto simples em formulários já existentes
- Ajustes de ordenação e exibição de elementos já presentes no sistema

### 7.3 O Que NÃO Está Coberto pela Manutenção

- Desenvolvimento de novas telas ou páginas
- Criação de novos módulos no painel administrativo
- Mudanças de layout ou identidade visual que requeiram reestruturação
- Integrações com novos sistemas ou APIs
- Alterações na infraestrutura ou migração de servidor
- Danos causados por uso indevido do painel administrativo ou por senhas comprometidas por ação da CONTRATANTE

### 7.4 Prorrogação do Período de Manutenção

Findo o período contratado (venc. **15/05/2027**), as partes poderão celebrar **Aditivo Contratual** para prorrogação dos serviços de manutenção por mais 1 (um) ano, mediante novo acordo de valores e condições a ser negociado antes do vencimento. A renovação abrange manutenção do sistema, backup mensal e pequenos ajustes, podendo incluir também a renovação do servidor de hospedagem.

---

## CLÁUSULA OITAVA — DOS SERVIÇOS FORA DO ESCOPO

Qualquer solicitação de desenvolvimento que extrapole o escopo descrito neste contrato — incluindo novas telas, mudanças estruturais, novas integrações ou redesign — será:

1. Avaliada pela CONTRATADA em prazo de até **10 (dez) dias úteis**
2. Orçada e apresentada à CONTRATANTE por escrito (e-mail ou outro meio formal)
3. Executada somente após aprovação expressa e acordo de valores formalizado em **Aditivo Contratual**

---

## CLÁUSULA NONA — DA PROPRIEDADE INTELECTUAL

### 9.1 Titularidade

O código-fonte, design, banco de dados, documentação e demais artefatos que compõem o sistema LEMM são de **propriedade intelectual da IADA LTDA**.

### 9.2 Licença de Uso

Com o pagamento integral do valor contratado, a CONTRATANTE recebe **licença de uso exclusiva, irrevogável e não sublicenciável** do sistema para operação em seu domínio e finalidade descritos neste contrato.

### 9.3 Restrições

A CONTRATANTE não poderá:

- Comercializar ou ceder o sistema a terceiros sem autorização escrita da CONTRATADA
- Contratar terceiros para modificar o código-fonte sem comunicar e obter anuência da CONTRATADA
- Remover créditos ou marcas da CONTRATADA presentes no sistema

---

## CLÁUSULA DÉCIMA — DAS OBRIGAÇÕES DA CONTRATADA

A CONTRATADA obriga-se a:

1. Entregar o sistema conforme descrito neste contrato, em pleno funcionamento
2. Realizar o deploy e ativação após confirmação do pagamento do servidor pela CONTRATANTE
3. Fornecer credenciais de acesso ao painel administrativo
4. Prestar suporte técnico conforme prazos e escopo da Cláusula Sétima
5. Realizar backups mensais no dia 25 de cada mês
6. Manter sigilo sobre dados e informações da CONTRATANTE
7. Comunicar com antecedência mínima de **30 (trinta) dias** qualquer necessidade de manutenção programada que gere indisponibilidade

---

## CLÁUSULA DÉCIMA PRIMEIRA — DAS OBRIGAÇÕES DA CONTRATANTE

A CONTRATANTE obriga-se a:

1. Efetuar o pagamento do valor contratado conforme acordado
2. Manifestar interesse na renovação da hospedagem e efetuar o pagamento correspondente com antecedência mínima de **5 (cinco) dias úteis** antes do vencimento (**15/05/2027**), a fim de garantir a continuidade do sistema sem interrupção
3. Manter sigilo sobre as credenciais de acesso ao painel administrativo
4. Comunicar imediatamente à CONTRATADA qualquer falha, incidente ou comportamento anormal do sistema
5. Não compartilhar a senha de acesso ao painel com pessoas não autorizadas
6. Fornecer informações e conteúdos necessários para operação do sistema

---

## CLÁUSULA DÉCIMA SEGUNDA — DA RESCISÃO

### 12.1 Rescisão por Descumprimento

O presente contrato poderá ser rescindido por qualquer das partes em caso de descumprimento das obrigações aqui previstas, mediante notificação por escrito com antecedência mínima de **30 (trinta) dias**.

### 12.2 Não Renovação da Hospedagem

Caso a CONTRATANTE não manifeste interesse na renovação ou não efetue o pagamento da hospedagem até **5 (cinco) dias úteis** antes do vencimento em **15/05/2027**, a CONTRATADA estará desobrigada de manter o servidor ativo, e eventual interrupção do sistema não configura descumprimento contratual pela CONTRATADA.

### 12.3 Efeitos da Rescisão

Em caso de rescisão, os valores já pagos não são reembolsáveis, salvo em casos de comprovado inadimplemento por parte da CONTRATADA.

---

## CLÁUSULA DÉCIMA TERCEIRA — DO FORO

As partes elegem o **Foro da Comarca de Goiânia — GO** para dirimir quaisquer dúvidas ou litígios oriundos do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.

---

## CLÁUSULA DÉCIMA QUARTA — DAS DISPOSIÇÕES GERAIS

1. O presente contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores
2. Qualquer alteração ao presente instrumento somente será válida mediante **Aditivo Contratual** assinado por ambas as partes
3. A tolerância de uma das partes quanto ao descumprimento de qualquer cláusula não implica novação ou renúncia ao direito de exigi-la futuramente
4. As comunicações entre as partes poderão ser realizadas por e-mail, sendo consideradas válidas para todos os fins legais

---

## ASSINATURAS

Assim, por estarem justas e contratadas, as partes assinam o presente instrumento em **2 (duas) vias de igual teor e forma**, na presença das testemunhas abaixo.

**Local e Data:** Goiânia — GO, 15 de maio de 2026.

---

### CONTRATADA

**Razão Social:** IADA LTDA
**CNPJ:** 47.917.618/0001-84

---

**Representante Legal:**

| | |
|---|---|
| Nome: | **Norton Pereira Ricardo** |
| CPF: | 052.172.041-92 |

&emsp;&emsp;&emsp;&emsp;Assinatura: _______________________________________________

---

**Desenvolvedora Responsável:**

| | |
|---|---|
| Nome: | **Luciana Lopes de Freitas** |
| CPF: | 051.362.691-38 |

&emsp;&emsp;&emsp;&emsp;Assinatura: _______________________________________________

---

### CONTRATANTE

| | |
|---|---|
| Nome: | **Maria José Pereira Dantas** |
| CPF: | 281.401.411-00 |

&emsp;&emsp;&emsp;&emsp;Assinatura: _______________________________________________

---

---

# ANEXO I — ESPECIFICAÇÃO TÉCNICA DETALHADA DO SISTEMA

## A. Arquitetura do Sistema

```
┌────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR (Cliente)                      │
│        Portal Público              Painel Administrativo       │
└─────────────┬──────────────────────────────┬───────────────────┘
              │                              │
              ▼                              ▼
┌────────────────────────────────────────────────────────────────┐
│               SERVIDOR NEXT.JS (Node.js / Bun)                 │
│                                                                │
│   ┌───────────────────────┐   ┌──────────────────────────┐    │
│   │   Server Components   │   │   API Routes (REST)      │    │
│   │   (renderização SSR)  │   │   POST / PUT / DELETE    │    │
│   └───────────┬───────────┘   └──────────────┬───────────┘    │
│               │                              │                 │
│               └──────────────┬───────────────┘                 │
│                              ▼                                 │
│              ┌───────────────────────────────┐                │
│              │    Drizzle ORM (camada dados) │                │
│              └───────────────┬───────────────┘                │
└──────────────────────────────┼─────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                  PostgreSQL 15+ (Banco de Dados)               │
│                                                                │
│  Tabelas: projects · events · team_members · hardware          │
│           hardware_modules · developed_platforms               │
│           collaboration_partners · about_timeline_entries      │
│           contact_info                                         │
│                                                                │
│  Mídia: imagens e PDFs armazenados como bytea                  │
└────────────────────────────────────────────────────────────────┘
```

---

## B. Fluxo de Upload e Armazenamento de Arquivos

```
CONTRATANTE (Painel Admin)
        │
        │  1. Seleciona imagem ou PDF no formulário
        ▼
SERVIDOR (Next.js — API Route)
        │
        │  2. Recebe arquivo via multipart/form-data
        │  3. Lê o conteúdo em buffer de memória
        │  4. Valida tipo MIME
        │     (image/jpeg · image/png · application/pdf)
        ▼
PostgreSQL (campo bytea)
        │
        │  5. Armazena binário + mimeType na tabela correspondente
        ▼
VISITANTE PÚBLICO (Portal)
        │
        │  6. Solicita arquivo via GET /api/[modulo]/[id]/image
        │  7. Servidor lê bytea do banco
        │  8. Entrega com header Content-Type correto
        ▼
    Navegador exibe imagem / abre PDF
```

---

## C. Fluxo de Autenticação do Painel Administrativo

```
CONTRATANTE
    │
    │  1. Acessa /manager (qualquer rota protegida)
    ▼
MIDDLEWARE (Next.js)
    │
    │  2. Verifica cookie "lemm_session"
    │     Ausente → redireciona para /manager/login
    ▼
PÁGINA DE LOGIN (/manager/login)
    │
    │  3. Contratante insere senha
    ▼
API /api/auth (POST)
    │
    │  4. Compara com MANAGER_PASSWORD (variável de ambiente)
    │  5. Correto → gera cookie HTTP-only com TTL 7 dias
    │  6. Redireciona para /manager
    ▼
PAINEL ADMINISTRATIVO (acesso liberado)
```

---

## D. Modelo de Dados Detalhado

### Tabela `projects`

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único gerado automaticamente |
| slug | TEXT UNIQUE | URL amigável do projeto |
| title | TEXT | Título do projeto |
| category | TEXT | TCC / IC / Mestrado / Plataforma / Pesquisa |
| themes | TEXT[] | Array de temas e palavras-chave |
| description | TEXT | Descrição completa |
| image | BYTEA | Imagem de capa (binário) |
| imageMimeType | TEXT | Tipo MIME da imagem |
| authors | TEXT[] | Lista de autores |
| startDate | TIMESTAMP | Data de início |
| endDate | TIMESTAMP | Data de conclusão |
| gitUrl | TEXT | Link repositório GitHub |
| publicationUrl | TEXT | Link publicação acadêmica |
| advisorId | UUID FK | Orientador (ref. team_members) |
| coAdvisorId | UUID FK | Co-orientador (ref. team_members) |
| researchLeadId | UUID FK | Pesquisador principal (ref. team_members) |
| pdf | BYTEA | Documento PDF completo (binário) |
| pdfMimeType | TEXT | Tipo MIME do PDF |
| createdAt | TIMESTAMPTZ | Data de criação |
| updatedAt | TIMESTAMPTZ | Data de atualização |

### Tabela `events`

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único |
| title | TEXT | Título do evento |
| description | TEXT | Descrição |
| date | TIMESTAMP | Data e hora do evento |
| type | TEXT | Tipo (conferência, workshop, etc.) |
| speaker | TEXT | Palestrante |
| organizer | TEXT | Organizador |
| link | TEXT | Link do evento |
| meetLink | TEXT | Link Google Meet |
| featured | BOOLEAN | Destaque (sim/não) |
| image | BYTEA | Imagem de capa (binário) |
| imageMimeType | TEXT | Tipo MIME da imagem |
| createdAt | TIMESTAMPTZ | Data de criação |
| updatedAt | TIMESTAMPTZ | Data de atualização |

### Tabela `team_members`

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único |
| category | TEXT | professores / colaboradores / convidados |
| name | TEXT | Nome completo |
| qualification | TEXT | Titulação e cargo |
| description | TEXT | Biografia |
| photo | BYTEA | Foto do membro (binário) |
| photoMimeType | TEXT | Tipo MIME da foto |
| sortOrder | INTEGER | Posição de exibição |
| createdAt | TIMESTAMPTZ | Data de criação |
| updatedAt | TIMESTAMPTZ | Data de atualização |

### Tabela `hardware`

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único |
| title | TEXT | Nome do equipamento |
| createdAt | TIMESTAMPTZ | Data de criação |
| updatedAt | TIMESTAMPTZ | Data de atualização |

### Tabela `hardware_modules`

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único |
| hardwareId | UUID FK | Referência ao equipamento (cascade delete) |
| title | TEXT | Nome do módulo |
| iconKey | TEXT | Chave do ícone Lucide |
| description | TEXT | Especificação técnica |
| sortOrder | INTEGER | Ordem de exibição |
| createdAt | TIMESTAMPTZ | Data de criação |
| updatedAt | TIMESTAMPTZ | Data de atualização |

### Demais Tabelas

| Tabela | Campos Principais |
|---|---|
| `developed_platforms` | título, descrição, links (projeto/acesso), badge, ícone |
| `collaboration_partners` | nome, descrição |
| `about_timeline_entries` | data (mês/ano), título, descrição |
| `contact_info` | nome do diretor, cargo, email, telefone, LinkedIn, foto |

---

*Este Anexo I é parte integrante do contrato e complementa a descrição técnica do sistema entregue.*

---

**Documento elaborado por:** IADA LTDA
**Data:** 15 de maio de 2026
**Versão do sistema:** LEMM 0.1.0
