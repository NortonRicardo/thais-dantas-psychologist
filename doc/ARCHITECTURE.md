# Arquitetura — LEMM

**Última revisão:** 2026-05-15

Website institucional do laboratório LEMM com painel administrativo para gerenciamento de projetos, equipe, eventos e infraestrutura.

> Para padrões de implementação, segurança e infraestrutura, ver [`doc/STANDARDS.md`](./STANDARDS.md).

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Diagrama de Camadas](#2-diagrama-de-camadas)
3. [Domínios e Entidades](#3-domínios-e-entidades)
4. [Mapa de Rotas Públicas](#4-mapa-de-rotas-públicas)
5. [Mapa de Endpoints API](#5-mapa-de-endpoints-api)
6. [Schema do Banco](#6-schema-do-banco)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Ambientes e Deploy](#8-ambientes-e-deploy)

---

## 1. Visão Geral

O LEMM é um monolito Next.js com duas faces:

| Face | Área | Acesso |
|------|------|--------|
| Site público | `/` | Aberto — qualquer visitante |
| Painel gestor | `/manager` | Autenticado — admin do laboratório |

Páginas públicas leem o banco diretamente via Server Components (sem chamadas a `/api`). O painel gestor usa Client Components que consomem os endpoints `/api/*`.

---

## 2. Diagrama de Camadas

```
Internet
    │
    ▼
Cloudflare  (WAF + CDN)
    │
    ▼
Coolify / Nginx  (TLS, reverse proxy → porta 3020)
    │
    ▼
Docker: web (lemm)
    ├── proxy.ts          ← autenticação + rate limit
    ├── (public)/*        ← Server Components — lê banco direto
    ├── manager/*         ← Client Components — consome /api/*
    └── api/*             ← Route Handlers (CRUD + uploads)
    │
    ▼
Docker: db (lemm-db)
    PostgreSQL 16 — rede interna, porta 5432 não exposta
```

---

## 3. Domínios e Entidades

| Domínio | Entidades |
|---------|-----------|
| **Projetos** | Projeto, Categoria de Projeto, Tema de Projeto |
| **Equipe** | Membro, Categoria de Membro, Tratamento (prefixo), Grau Acadêmico |
| **Eventos** | Evento, Tipo de Evento, Organização Promotora |
| **Infraestrutura** | Hardware, Módulo de Hardware, Plataforma Desenvolvida, Parceiro |
| **Institucional** | Entrada da Linha do Tempo, Informação de Contato, Canal de Contato |
| **Auth** | Usuário, Sessão, Conta, Verificação (tabelas Better Auth) |

---

## 4. Mapa de Rotas Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/projetos` | Listagem de projetos com filtro por tema |
| `/projetos/[slug]` | Detalhes de um projeto |
| `/equipe` | Membros ativos agrupados por categoria |
| `/eventos` | Listagem de eventos |
| `/infraestrutura` | Hardware, plataformas e parceiros |
| `/sobre-nos` | Linha do tempo institucional |
| `/contato` | Informações e canais de contato |
| `/manager/login` | Login do painel (público) |

---

## 5. Mapa de Endpoints API

Todos os endpoints `/api/*` (exceto `/api/auth/*`) exigem sessão autenticada.

### Projetos

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/api/projects` | Listar projetos |
| POST | `/api/projects` | Criar projeto (+ imagem e PDF) |
| GET | `/api/projects/[id]` | Buscar projeto |
| PUT | `/api/projects/[id]` | Editar projeto |
| DELETE | `/api/projects/[id]` | Apagar projeto |
| GET | `/api/projects/[id]/image` | Servir imagem |
| GET | `/api/projects/[id]/pdf` | Servir PDF |
| GET/POST | `/api/project-categories` | Listar / criar categorias |
| PUT/DELETE | `/api/project-categories/[id]` | Editar / apagar categoria |
| GET/POST | `/api/project-themes` | Listar / criar temas |
| PUT/DELETE | `/api/project-themes/[id]` | Editar / apagar tema |

### Equipe

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/api/team` | Listar membros |
| POST | `/api/team` | Criar membro (+ foto) |
| PUT/DELETE | `/api/team/[id]` | Editar / apagar membro |
| GET | `/api/team/[id]/photo` | Servir foto |
| GET/POST | `/api/team/categories` | Listar / criar categorias |
| PUT/DELETE | `/api/team/categories/[id]` | Editar / apagar categoria |
| GET/POST | `/api/team/prefixes` | Listar / criar tratamentos |
| PUT/DELETE | `/api/team/prefixes/[id]` | Editar / apagar tratamento |
| GET/POST | `/api/team/degree-levels` | Listar / criar graus |
| PUT/DELETE | `/api/team/degree-levels/[id]` | Editar / apagar grau |

### Eventos

| Método | Endpoint | Ação |
|--------|----------|------|
| GET/POST | `/api/events` | Listar / criar eventos (+ imagem) |
| PUT/DELETE | `/api/events/[id]` | Editar / apagar evento |
| GET | `/api/events/[id]/image` | Servir imagem |
| GET/POST | `/api/event-types` | Listar / criar tipos |
| PUT/DELETE | `/api/event-types/[id]` | Editar / apagar tipo |
| GET/POST | `/api/event-organizations` | Listar / criar organizações |
| PUT/DELETE | `/api/event-organizations/[id]` | Editar / apagar organização |

### Infraestrutura

| Método | Endpoint | Ação |
|--------|----------|------|
| GET/POST | `/api/hardware` | Listar / criar hardware |
| PUT/DELETE | `/api/hardware/[id]` | Editar / apagar hardware |
| PUT/DELETE | `/api/hardware-modules/[id]` | Editar / apagar módulo |
| GET/POST | `/api/developed-platforms` | Listar / criar plataformas |
| PUT/DELETE | `/api/developed-platforms/[id]` | Editar / apagar plataforma |
| GET/POST | `/api/collaboration-partners` | Listar / criar parceiros |
| PUT/DELETE | `/api/collaboration-partners/[id]` | Editar / apagar parceiro |

### Institucional

| Método | Endpoint | Ação |
|--------|----------|------|
| GET/POST | `/api/about-timeline` | Listar / criar entradas |
| PUT/DELETE | `/api/about-timeline/[id]` | Editar / apagar entrada |
| GET/PUT | `/api/contato` | Ler / atualizar informações de contato |
| POST | `/api/contato/channels` | Criar canal |
| PUT/DELETE | `/api/contato/channels/[id]` | Editar / apagar canal |

### Auth

| Endpoint | Descrição |
|----------|-----------|
| `/api/auth/[...all]` | Gerenciado pelo Better Auth (login, logout, get-session) |

---

## 6. Schema do Banco

### Tabelas de domínio

```
projects               (slug único, FK category, bytea image+pdf)
  └── project_project_themes  (N:N com project_themes)
project_categories     (title único, estilos de chip)
project_themes         (name único, slug único, estilos de filtro)

team_members           (FK category, FK prefix, FK degree, bytea photo, active)
team_categories
team_name_prefixes     (label único)
team_degree_levels     (label único)

events                 (date, featured, FK organization, FK speaker, bytea image)
event_types            (name único)
event_organizations    (name único)

hardware
  └── hardware_modules (FK hardware, sort_order)

developed_platforms
collaboration_partners
about_timeline_entries (date)

contact_info           (registro único, FK director_member)
  └── contact_channels (FK contact_info, sort_order)
```

### Tabelas do Better Auth

```
auth_user        (username único, email único)
auth_session     (token único, FK user)
auth_account     (FK user)
auth_verification
```

### Índices definidos

| Índice | Tabela | Colunas |
|--------|--------|---------|
| `idx_projects_category_id` | `projects` | `category_id` |
| `idx_projects_start_date` | `projects` | `start_date DESC` |
| `idx_ppt_project_id` | `project_project_themes` | `project_id` |
| `idx_ppt_theme_id` | `project_project_themes` | `theme_id` |
| `idx_team_members_category_id` | `team_members` | `category_id` |
| `idx_team_members_active` | `team_members` | `active` |
| `idx_events_date` | `events` | `date DESC` |
| `idx_events_featured` | `events` | `featured` |
| `idx_events_organization_id` | `events` | `organization_id` |
| `idx_hardware_modules_hardware_id` | `hardware_modules` | `(hardware_id, sort_order)` |
| `idx_contact_channels_info_id` | `contact_channels` | `(contact_info_id, sort_order)` |
| `idx_timeline_date` | `about_timeline_entries` | `date DESC` |
| `idx_auth_session_user_id` | `auth_session` | `user_id` |

---

## 7. Regras de Negócio

### Projetos

- Todo projeto tem exatamente **uma categoria** e **um ou mais temas**
- Slug deve ser único e seguir o formato `[a-z0-9]+(?:-[a-z0-9]+)*`
- Imagem: JPEG ou PNG, máx 5 MB
- PDF: máx 20 MB
- Apagar uma categoria só é permitido se nenhum projeto a referenciar (`onDelete: 'restrict'`)
- Apagar um tema remove automaticamente a relação com projetos (`onDelete: 'cascade'`)
- Membros vinculados como orientador/co-orientador ficam com `null` ao ser apagados (`onDelete: 'set null'`)

### Equipe

- Membro com `active = false` é ocultado na página pública mas mantém vínculos em projetos
- Apagar uma categoria de membro é bloqueado se houver membros vinculados (`onDelete: 'restrict'`)
- Tratamento e grau ficam `null` ao ser apagados (`onDelete: 'set null'`)
- Foto: JPEG ou PNG, máx 5 MB

### Eventos

- Eventos marcados como `featured` são destacados na página pública
- Apagar organização ou membro speaker define o campo como `null` no evento (`onDelete: 'set null'`)
- Imagem: JPEG ou PNG, máx 5 MB

### Contato

- `contact_info` é um **registro único** — existe apenas uma linha no sistema
- Canais são ordenados por `sort_order` e vinculados ao único registro de contato

### Admin

- Apenas um usuário admin — criado via `bun db:seed` lendo `ADMIN_USERNAME` e `ADMIN_PASSWORD` do `.env`
- O seed verifica se o usuário já existe antes de criar
- Senha mínima de 8 caracteres (validação do Better Auth)

---

## 8. Ambientes e Deploy

### Variáveis de ambiente

| Variável | Dev (`.env`) | Produção (Coolify) |
|----------|-------------|-------------------|
| `POSTGRES_USER` | `lemm` | usuário único |
| `POSTGRES_PASSWORD` | `lemm` | `openssl rand -base64 24` |
| `POSTGRES_DB` | `lemm` | `lemm` |
| `DATABASE_URL` | `postgres://lemm:lemm@localhost:5432/lemm` | `postgres://user:pass@db:5432/lemm` |
| `BETTER_AUTH_SECRET` | valor dev | `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | `http://localhost:3000` | `https://dominio.com` |
| `ADMIN_USERNAME` | `admin` | valor escolhido |
| `ADMIN_PASSWORD` | `admin123123` | senha forte (16+ chars) |

### Comandos

```bash
make dev          # sobe dev (docker-compose-dev.yml, porta 3000)
make dev-build    # rebuild forçado do dev
make db-migrate   # roda migrations no dev
make db-seed      # cria admin + dados iniciais no dev
make prod-up      # build + sobe produção (docker-compose.yml, porta 3020)
make prod-seed    # cria admin na produção (primeira vez)
```
