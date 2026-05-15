# Padrões e Boas Práticas — Next.js + PostgreSQL

**Stack de referência:** Next.js 16 · Better Auth · PostgreSQL · Drizzle ORM · Bun · Docker · Coolify

Este documento define os padrões obrigatórios de **arquitetura, implementação e segurança** para qualquer projeto construído nesta stack. É o guia de desenvolvimento: toda nova feature, endpoint ou infraestrutura deve seguir estes critérios.

---

## Índice

1. [Arquitetura Next.js](#1-arquitetura-nextjs)
2. [Convenções de API](#2-convenções-de-api)
3. [Middleware — Autenticação e Autorização](#3-middleware--autenticação-e-autorização)
4. [Rate Limiting](#4-rate-limiting)
5. [Validação de Input](#5-validação-de-input)
6. [Upload de Arquivos](#6-upload-de-arquivos)
7. [Security Headers](#7-security-headers)
8. [Cookies e CSRF](#8-cookies-e-csrf)
9. [Banco de Dados](#9-banco-de-dados)
10. [Índices do Banco](#10-índices-do-banco)
11. [Gestão de Segredos](#11-gestão-de-segredos)
12. [Docker](#12-docker)
13. [Servidor](#13-servidor)
14. [CDN e Performance](#14-cdn-e-performance)
15. [Backup](#15-backup)

---

## 1. Arquitetura Next.js

### Separação de responsabilidades

Todo projeto deve ter duas faces bem delimitadas:

| Face | Route group | Renderização | Acesso ao banco |
|------|-------------|--------------|-----------------|
| **Pública** | `(public)/` | Server Components | Drizzle direto (sem `/api`) |
| **Gestor/Admin** | `manager/` ou `admin/` | Client Components | Via `/api/*` |

### Páginas públicas — Server Components

Páginas públicas **nunca** chamam `/api/*`. Os dados chegam no HTML via Server Components com Drizzle direto:

```typescript
// ✅ Correto
export default async function Page() {
  const data = await db.select().from(table)
  return <Component data={data} />
}

// ❌ Errado — expõe dados via fetch no client
export default function Page() {
  const [data, setData] = useState([])
  useEffect(() => { fetch('/api/resource').then(...) }, [])
}
```

Vantagens:
- Dados nunca passam pelo browser
- SEO: HTML já renderizado com conteúdo
- Sem waterfall de requests

### Painel admin — Client Components + API

O painel **sempre** usa `fetch('/api/*')` para mutations e listagens, pois precisa de interatividade (formulários, modals, tabelas com filtro).

```typescript
'use client'

// Listar
useEffect(() => {
  fetch('/api/resources').then(r => r.json()).then(setItems)
}, [])

// Criar
async function handleSubmit(fd: FormData) {
  const res = await fetch('/api/resources', { method: 'POST', body: fd })
  if (!res.ok) { /* tratar erro */ }
}
```

### `force-dynamic` nas páginas públicas

Sempre adicionar em páginas que exibem dados mutáveis para evitar cache stale:

```typescript
export const dynamic = 'force-dynamic'
```

### Organização de arquivos

```
src/
├── app/
│   ├── (public)/          ← Server Components, SEO, sem autenticação
│   │   └── _components/   ← componentes de UI desta área
│   ├── manager/           ← Client Components, autenticado
│   │   └── _components/
│   └── api/               ← Route Handlers (exclusivo para o gestor)
├── lib/
│   ├── db/
│   │   ├── index.ts       ← conexão singleton
│   │   ├── schema.ts      ← todas as tabelas e índices
│   │   └── seed.ts        ← dados iniciais
│   ├── validation/        ← schemas Zod por domínio
│   └── upload-validation.ts
└── proxy.ts               ← middleware (Next.js 16: proxy.ts)
```

---

## 2. Convenções de API

### Estrutura de um route handler

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { myTable } from '@/lib/db/schema'
import { myFormSchema } from '@/lib/validation/my-api'
import { validationErrorResponse } from '@/lib/validation/shared'

// GET — listar
export async function GET() {
  try {
    const rows = await db.select().from(myTable).orderBy(asc(myTable.name))
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/resources]', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

// POST — criar
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const parsed = myFormSchema.safeParse(Object.fromEntries(fd))
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const [created] = await db.insert(myTable).values(parsed.data).returning({ id: myTable.id })
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/resources]', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
```

### Validação de UUID nos parâmetros de rota

**Sempre** validar o `id` antes de qualquer query:

```typescript
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }
  // ...
}
```

### Códigos de status padrão

| Situação | Status |
|----------|--------|
| Listagem / leitura bem-sucedida | 200 |
| Criação bem-sucedida | 201 |
| Validação falhou (Zod) | 422 |
| ID inválido / não encontrado | 404 |
| Tipo de arquivo inválido | 415 |
| Arquivo muito grande | 413 |
| Não autenticado | 401 |
| Erro interno | 500 |

### Nomenclatura de rotas

Seguir o padrão REST:

```
GET    /api/resources          → listar
POST   /api/resources          → criar
GET    /api/resources/[id]     → buscar um
PUT    /api/resources/[id]     → atualizar
DELETE /api/resources/[id]     → apagar
GET    /api/resources/[id]/file → servir binário (imagem, pdf)
```

### Log de erro padrão

```typescript
console.error('[MÉTODO /api/recurso]', err)
```

Sempre incluir método e path para facilitar busca nos logs.

---

## 3. Middleware — Autenticação e Autorização

### Arquivo correto por versão do Next.js

| Versão | Arquivo |
|--------|---------|
| Next.js ≤ 15 | `middleware.ts` |
| Next.js 16+ | `proxy.ts` |

### Responsabilidades do middleware

O middleware é a **única camada de guarda** — nunca duplicar verificação de autenticação dentro dos route handlers.

```typescript
// src/proxy.ts
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Liberar endpoints internos de auth
  if (pathname.startsWith('/api/auth')) return NextResponse.next()

  // 2. Liberar página de login
  if (pathname === '/manager/login') return NextResponse.next()

  // 3. Verificar sessão
  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: req.nextUrl.origin,
    headers: { cookie: req.headers.get('cookie') ?? '' },
  })
  if (session) return NextResponse.next()

  // 4. Rate limit para requests sem sessão
  if (isRateLimited(getIp(req))) {
    return NextResponse.json({ error: 'Muitas requisições.' }, { status: 429, headers: { 'Retry-After': '60' } })
  }

  // 5. Redirecionar manager para login
  if (pathname.startsWith('/manager')) {
    const url = req.nextUrl.clone()
    url.pathname = '/manager/login'
    return NextResponse.redirect(url)
  }

  // 6. Bloquear toda /api/* sem sessão
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manager/:path*', '/api/:path*'],
}
```

### Regras

- **Todos** os endpoints `/api/*` devem exigir sessão — incluindo GET
- Páginas públicas nunca devem estar no matcher do middleware
- Nunca adicionar lógica de auth dentro dos route handlers — o middleware é suficiente
- Manter `/api/auth/*` sempre liberado (Better Auth gerencia internamente)

---

## 4. Rate Limiting

### Duas camadas obrigatórias

**Camada 1 — Middleware (requests sem sessão):**

```typescript
// 30 req/min por IP para qualquer request não autenticado
const rlMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rlMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rlMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 30) return true
  entry.count++
  return false
}
```

**Camada 2 — Better Auth (endpoint de login):**

```typescript
rateLimit: {
  enabled: true,
  window: 60,
  max: 100,       // global em /api/auth/*
  storage: 'memory',
  customRules: {
    '/sign-in/username': { window: 60, max: 5 },  // 5 tentativas/min no login
  },
},
```

### Extração de IP com Cloudflare

```typescript
function getIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ??          // Cloudflare
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??  // Nginx
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
```

### Escalabilidade

O `Map` em memória é por processo e por container. Para múltiplas instâncias, migrar para Redis:

```typescript
rateLimit: {
  storage: 'redis',
  // ...
}
```

---

## 5. Validação de Input

### Regra fundamental

**Todo input de usuário que chega ao servidor deve ser validado com Zod antes de tocar o banco.**

### Estrutura de um schema

```typescript
// src/lib/validation/my-api.ts
import { z } from 'zod'

export const myFormSchema = z.object({
  // String obrigatória com limites
  title: z.string().trim().min(1, 'Título obrigatório.').max(300, 'Máximo 300 caracteres.'),

  // Slug com regex
  slug: z.string().trim()
    .min(1, 'Slug obrigatório.')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Apenas letras minúsculas, números e hífens.'),

  // UUID obrigatório
  categoryId: z.string().uuid('Categoria inválida.'),

  // UUID opcional
  advisorId: z.string().trim()
    .transform(s => s || null)
    .pipe(z.union([z.null(), z.string().uuid('ID inválido.')])),

  // URL opcional
  url: z.string().trim().max(2000).url('URL inválida.').nullable().optional(),

  // Data
  startDate: z.string().trim()
    .min(1, 'Data obrigatória.')
    .refine(s => !isNaN(Date.parse(s)), 'Data inválida.'),

  // Array de UUIDs
  themeIds: z.array(z.string().uuid()).min(1, 'Selecione ao menos um tema.'),
})
```

### Pipeline de validação no handler

```typescript
const fd = await req.formData()
const parsed = myFormSchema.safeParse(Object.fromEntries(fd))
if (!parsed.success) return validationErrorResponse(parsed.error)
// parsed.data está tipado e seguro
```

### Proteção contra SQL Injection

O Drizzle ORM usa queries parametrizadas internamente. Mesmo assim, **nunca** usar `db.execute(sql\`...${userInput}...\`)` com input não sanitizado — a validação Zod é a primeira linha de defesa.

---

## 6. Upload de Arquivos

### Nunca confiar no `file.type` do cliente

O `Content-Type` enviado pelo browser é controlado pelo cliente e pode ser falsificado. Sempre verificar os **magic bytes** (primeiros bytes do arquivo real):

```typescript
// Magic bytes de referência
const JPEG_MAGIC = [0xff, 0xd8, 0xff]
const PNG_MAGIC  = [0x89, 0x50, 0x4e, 0x47]
const PDF_MAGIC  = [0x25, 0x50, 0x44, 0x46]  // %PDF

function matchesMagic(buf: Uint8Array, magic: number[]): boolean {
  return magic.every((b, i) => buf[i] === b)
}
```

### Limites de tamanho obrigatórios

| Tipo | Limite recomendado |
|------|--------------------|
| Imagem (JPEG/PNG) | 5 MB |
| PDF | 20 MB |
| Avatar/foto | 2 MB |

### Pipeline completa de validação de upload

```typescript
export function validateImageUpload(file: File, buf: Uint8Array): UploadError | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type))
    return { error: 'Formato inválido. Use JPEG ou PNG.', status: 415 }
  if (file.size > MAX_IMAGE_BYTES)
    return { error: 'Imagem muito grande. Máximo 5 MB.', status: 413 }
  if (!isValidImage(file.type, buf))
    return { error: 'Arquivo corrompido ou inválido.', status: 415 }
  return null
}
```

### MIME type na resposta

O MIME type armazenado no banco deve ser o **detectado pelos magic bytes**, nunca o enviado pelo cliente. Toda rota que serve binários deve incluir:

```typescript
return new NextResponse(data, {
  headers: {
    'Content-Type': row.mimeType,         // valor do banco (confiável)
    'X-Content-Type-Options': 'nosniff',  // obrigatório
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
})
```

---

## 7. Security Headers

### Configuração obrigatória em `next.config.ts`

```typescript
const isDev = process.env.NODE_ENV === 'development'

const securityHeaders = [
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval' apenas em dev (Turbopack source maps)
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",        // adicionar domínios externos conforme necessário
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### Regras

- `unsafe-eval` **nunca** em produção — apenas em desenvolvimento para Turbopack
- Adicionar domínios externos à CSP explicitamente — nunca usar `*`
- `frame-ancestors 'none'` e `X-Frame-Options: DENY` se complementam para cobertura de browsers antigos
- `HSTS` com `preload` assegura que o domínio seja adicionado à lista de preload dos browsers

---

## 8. Cookies e CSRF

### Configuração obrigatória no Better Auth

```typescript
advanced: {
  cookiePrefix: '__Host',               // força Secure, Path=/, sem Domain
  defaultCookieAttributes: {
    sameSite: 'strict',                 // bloqueia CSRF cross-site
  },
},
```

### Por que cada atributo importa

| Atributo | Valor | O que previne |
|----------|-------|---------------|
| `__Host-` prefix | Obrigatório | Subdomain injection — cookie não pode ser definido por subdomínio comprometido |
| `sameSite: strict` | Obrigatório | CSRF — browser não envia o cookie em requests cross-site |
| `httpOnly: true` | Padrão Better Auth | XSS — JavaScript não consegue ler o cookie |
| `secure: true` | Produção automático | Cookie só trafega por HTTPS |

### `sameSite: strict` substitui CSRF tokens?

Para a maioria dos cenários: **sim**. Com `strict`, qualquer form ou `fetch()` originado de outro domínio não terá o cookie, tornando o ataque inviável. CSRF tokens só são necessários em cenários com `sameSite: none`.

---

## 9. Banco de Dados

### Conexão singleton com pool

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const globalForDb = globalThis as unknown as { client?: postgres.Sql }

const client = globalForDb.client ?? postgres(process.env.DATABASE_URL!, { max: 10 })

// Reutilizar conexão em dev (evita esgotar pool em hot-reloads)
if (process.env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle(client, { schema })
```

- `max: 10` — limite de conexões simultâneas (ajustar conforme carga)
- Nunca criar `postgres()` sem `max` — PostgreSQL tem limite de 100 conexões por padrão

### Queries parametrizadas — sempre

```typescript
// ✅ Correto — Drizzle gera queries parametrizadas
await db.select().from(projects).where(eq(projects.slug, slug))

// ❌ Errado — SQL com interpolação direta
await db.execute(sql`SELECT * FROM projects WHERE slug = '${slug}'`)
```

### Migrações

- Uma migration por mudança lógica — nunca editar migrations existentes
- Arquivos em `drizzle/XXXX_descricao.sql`
- Rodar automaticamente no startup do container:

```
CMD ["sh", "-c", "bun run db:migrate && node server.js"]
```

### UUIDs como chaves primárias

Sempre usar UUID em vez de inteiro sequencial. IDs sequenciais são enumeráveis — atacantes podem iterar `/api/resources/1`, `/api/resources/2`, etc.

```typescript
id: uuid('id').defaultRandom().primaryKey()
```

### Regras

- `DATABASE_URL` **nunca** aparece em logs
- Porta `5432` **nunca** exposta externamente no compose de produção
- Backups configurados antes do primeiro deploy em produção (ver §15)

---

## 10. Índices do Banco

### Quando criar um índice

| Criar índice em | Motivo |
|-----------------|--------|
| Colunas em `WHERE` frequente | Query table scan → index scan |
| Colunas em `ORDER BY` | Elimina sort em memória |
| Foreign keys | JOINs e cascades sem seq scan |
| Tabelas de relação N:N | Lookup em ambas as direções |
| Colunas de filtragem (status, active, featured) | Queries com poucos resultados |

### Sintaxe Drizzle

```typescript
import { pgTable, uuid, text, boolean, index } from 'drizzle-orm/pg-core'

export const myTable = pgTable(
  'my_table',
  {
    id:         uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id').notNull().references(() => categories.id),
    active:     boolean('active').default(true).notNull(),
    createdAt:  timestamp('created_at').defaultNow().notNull(),
  },
  t => [
    index('idx_my_table_category_id').on(t.categoryId),
    index('idx_my_table_active').on(t.active),
  ]
)
```

### O que o PostgreSQL já cria automaticamente

- `PRIMARY KEY` → índice único implícito
- `UNIQUE` → índice único implícito

Portanto, **não** criar índices manuais nestas colunas.

### Tabela de relação N:N — sempre indexar ambas as FKs

```typescript
export const postTags = pgTable(
  'post_tags',
  {
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    tagId:  uuid('tag_id').notNull().references(() => tags.id,  { onDelete: 'cascade' }),
  },
  t => [
    primaryKey({ columns: [t.postId, t.tagId] }),
    index('idx_post_tags_post_id').on(t.postId),
    index('idx_post_tags_tag_id').on(t.tagId),
  ]
)
```

---

## 11. Gestão de Segredos

### Regras absolutas

- `.env` **nunca** vai para o Git — verificar com `git log --all -- .env`
- `.env.sample` vai para o Git, mas **sem valores reais**
- Em produção, configurar variáveis pelo painel do Coolify, não via arquivo `.env` no servidor

### Geração de segredos seguros

```bash
# Segredo de sessão (32 bytes = 64 chars hex)
openssl rand -hex 32

# Senha de banco (legível, alta entropia)
openssl rand -base64 24

# Senha de admin (legível por humanos)
openssl rand -base64 16
```

### Variáveis obrigatórias em qualquer projeto

| Variável | Requisito |
|----------|-----------|
| `DATABASE_URL` | Nunca logar |
| `BETTER_AUTH_SECRET` | Mínimo 32 bytes aleatórios |
| Senhas de banco | Mínimo 24 caracteres |
| Senhas de usuário admin | Mínimo 16 caracteres |

### Rotação de segredos

- Rotacionar `BETTER_AUTH_SECRET` invalida **todas** as sessões ativas — planejar janela de manutenção
- Rotacionar senha do banco requer atualização do `DATABASE_URL` e restart do container

---

## 12. Docker

### Multi-stage build obrigatório em produção

```dockerfile
# Stage 1 — dependências
FROM oven/bun:1-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2 — build
FROM node:20-slim AS builder
WORKDIR /app
RUN npm i -g bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 3 — runtime mínimo
FROM node:20-slim AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs                          # ← nunca rodar como root
EXPOSE 3020
CMD ["sh", "-c", "bun run db:migrate && node server.js"]
```

### `output: 'standalone'` no Next.js

Obrigatório para Docker — gera apenas os arquivos necessários para o runtime, sem `node_modules` completo:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
}
```

### Dois compose files separados

| Arquivo | Uso | Características |
|---------|-----|-----------------|
| `docker-compose.yml` | Produção | Sem volume mounts, sem porta 5432, Dockerfile multi-stage |
| `docker-compose-dev.yml` | Desenvolvimento | Volume mounts para hot-reload, porta 5432 exposta |

### Regras Docker

- **Nunca** rodar container como `root` — usar usuário sem privilégios
- **Nunca** expor porta do banco (`5432`) no compose de produção
- **Nunca** usar `docker-compose-dev.yml` em produção
- Banco e app na mesma rede Docker interna — comunicação sem expor portas

---

## 13. Servidor

### 13.1 Firewall — UFW

Executar como `root` no servidor. Bloqueia tudo exceto SSH, HTTP e HTTPS:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp       # trocar para porta customizada após hardening SSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status verbose
```

### 13.2 Hardening do SSH

Editar `/etc/ssh/sshd_config`:

```
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 20
```

```bash
# Atualizar firewall e reiniciar SSH
ufw allow 2222/tcp
ufw delete allow 22/tcp
systemctl restart sshd
```

> **Atenção:** abrir nova sessão na porta 2222 **antes** de fechar a atual.

### 13.3 Fail2Ban

```bash
apt install fail2ban -y

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = 2222

[nginx-http-auth]
enabled  = true
port     = http,https
filter   = nginx-http-auth
logpath  = /var/log/nginx/error.log

[nginx-limit-req]
enabled  = true
port     = http,https
filter   = nginx-limit-req
logpath  = /var/log/nginx/error.log
maxretry = 10
bantime  = 600
EOF

systemctl enable fail2ban
systemctl start fail2ban
fail2ban-client status
```

### 13.4 Nginx hardening (Coolify)

Adicionar em **Advanced → Custom Nginx Configuration**:

```nginx
# Bloquear repositório Git
location ~ /\.git { deny all; return 404; }

# Bloquear arquivos ocultos
location ~ /\.    { deny all; return 403; }

# Sem listagem de diretórios
autoindex off;

# Assets Next.js — cache imutável, sem indexação
location /_next/static/ {
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}
```

Verificar após aplicar:

```bash
curl -sv https://dominio.com/.git/config
# Esperado: 404
```

### 13.5 Bloquear painel do Coolify

```bash
ufw deny 8000/tcp
ufw deny 8080/tcp
```

Acessar o painel via SSH tunnel:

```bash
ssh -L 8000:localhost:8000 usuario@servidor -p 2222
# Acessar http://localhost:8000 no browser local
```

### 13.6 Checklist de execução no servidor

Seguir nesta ordem para não perder acesso SSH:

- [ ] Adicionar chave pública SSH ao servidor
- [ ] Configurar UFW mantendo porta 22 aberta
- [ ] Editar `sshd_config` (porta 2222, sem senha, sem root)
- [ ] Abrir porta 2222 no UFW e **testar em nova aba antes de continuar**
- [ ] Fechar porta 22 no UFW
- [ ] Instalar e configurar Fail2Ban
- [ ] Bloquear portas do Coolify no UFW
- [ ] Aplicar Nginx custom config no Coolify
- [ ] Verificar `.git` bloqueado com `curl`

---

## 14. CDN e Performance

### Cloudflare — recomendado para todos os projetos

Cloudflare na frente do servidor resolve CDN, WAF e DDoS sem custo adicional (plano Free):

1. Adicionar domínio no Cloudflare → apontar nameservers do registrador
2. Registros A/CNAME com proxy ativo (ícone laranja ☁️) — oculta IP real
3. **SSL/TLS** → Full (strict)
4. **Security → WAF** → regras gerenciadas ativas
5. **Security → Bots** → Bot Fight Mode

**Cache Rules** para assets Next.js:

```
URL: dominio.com/_next/static/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 year
```

Verificar cache funcionando:

```bash
curl -sI https://dominio.com/_next/static/css/app.css | grep -i cf-cache
# CF-Cache-Status: HIT
```

### `Cache-Control` obrigatório em rotas de binário

```typescript
'Cache-Control': 'public, max-age=31536000, immutable'
```

Assets imutáveis (imagens, PDFs que nunca mudam após upload) devem ter `max-age` longo para evitar re-download.

### `cookieCache` no Better Auth

Evita query ao banco em **cada** request para validar sessão:

```typescript
session: {
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,  // 5 minutos de cache local
  },
},
```

### Connection pool adequado

```typescript
postgres(process.env.DATABASE_URL!, { max: 10 })
```

Ajustar `max` conforme:
- Número de workers do Node
- Limite de conexões do PostgreSQL (`max_connections` = 100 por padrão)
- Fórmula prática: `max = (max_connections / workers) * 0.8`

---

## 15. Backup

### Regra fundamental

> Backup não testado não é backup. Testar restauração ao menos uma vez antes de considerar o processo funcional.

### Opção A — Coolify (recomendado)

Coolify → **Databases → [banco] → Backups**:
- Destino: S3, Backblaze B2 ou SFTP
- Frequência: diária (mínimo)
- Retenção: 30 dias

### Opção B — Cron com `pg_dump`

```bash
# /opt/app/backup.sh
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/opt/app/backups"
DATE=$(date +%Y-%m-%d_%H-%M)
FILE="$BACKUP_DIR/db_$DATE.sql.gz"

mkdir -p "$BACKUP_DIR"

docker exec app-db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > "$FILE"

# Reter apenas últimos 30 dias
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "Backup: $FILE"
```

```bash
chmod +x /opt/app/backup.sh
crontab -e
# 0 3 * * * /opt/app/backup.sh >> /var/log/app-backup.log 2>&1
```

### Restaurar

```bash
docker compose down
zcat /opt/app/backups/db_2026-05-15_03-00.sql.gz \
  | docker exec -i app-db psql -U "$POSTGRES_USER" "$POSTGRES_DB"
docker compose up -d --build
```

### Checklist de backup

- [ ] Backup automatizado configurado antes do primeiro deploy
- [ ] Destino de backup **fora do servidor** (S3, Backblaze — não disco local)
- [ ] Restauração testada com sucesso pelo menos uma vez
- [ ] Alerta configurado para falha de backup (email, Slack, etc.)
