# Relatório de Segurança — LEMM

**Data:** 2026-05-15
**Analista de código:** Claude (Anthropic)
**Insights externos:** Mateus (pentester)
**Repositório:** `/Volumes/Files/Climora/lemm`
**Stack:** Next.js 16, Drizzle ORM, PostgreSQL, Bun, Docker, Coolify

---

## Índice

1. [Resumo Executivo](#1-resumo-executivo)
2. [CRÍTICO — Autenticação e Sessões](#2-crítico--autenticação-e-sessões)
3. [CRÍTICO — Endpoints de API sem Proteção](#3-crítico--endpoints-de-api-sem-proteção)
4. [ALTO — Upload de Arquivos Inseguro](#4-alto--upload-de-arquivos-inseguro)
5. [ALTO — Ausência de Rate Limiting](#5-alto--ausência-de-rate-limiting)
6. [ALTO — Security Headers Ausentes](#6-alto--security-headers-ausentes)
7. [ALTO — CSRF sem Proteção](#7-alto--csrf-sem-proteção)
8. [MÉDIO — Credenciais Padrão no Repositório](#8-médio--credenciais-padrão-no-repositório)
9. [MÉDIO — Validação de Input Inconsistente](#9-médio--validação-de-input-inconsistente)
10. [MÉDIO — Identificação do Cookie de Sessão](#10-médio--identificação-do-cookie-de-sessão)
11. [MÉDIO — Content-Type Confiado do Cliente em Imagens](#11-médio--content-type-confiado-do-cliente-em-imagens)
12. [BAIXO — Ausência de Username no Login](#12-baixo--ausência-de-username-no-login)
13. [Configurações de Servidor / Coolify](#13-configurações-de-servidor--coolify)

---

## 1. Resumo Executivo

A aplicação possui **brechas críticas de autenticação e autorização** que permitem a qualquer pessoa na internet modificar dados sem autenticação. A sessão utiliza um token de valor fixo previsível. Não há rate limiting, CSRF protection, nem security headers. O pentester externo confirmou a ausência de proteção de diretórios e apontou risco de directory traversal em `/media`. A aplicação precisa de correções antes de qualquer exposição pública em produção.

| Severidade | Quantidade |
|------------|-----------|
| CRÍTICO    | 2         |
| ALTO       | 4         |
| MÉDIO      | 4         |
| BAIXO      | 1         |
| Servidor/Coolify | 8   |

---

## 2. CRÍTICO — Autenticação e Sessões

**Arquivo:** [src/lib/auth.ts](src/lib/auth.ts)

### 2.1 Senha comparada em texto puro

```typescript
// src/lib/auth.ts:8-11
export function verifyPassword(password: string): boolean {
  if (!PASSWORD) return false
  return password === PASSWORD  // ← comparação direta, sem hash
}
```

A senha armazenada em `MANAGER_PASSWORD` é comparada em texto puro com a entrada do usuário. Não há uso de bcrypt, argon2 ou qualquer função de hash com salt. Qualquer pessoa que obtenha o valor da variável de ambiente (log de servidor, backup, `.env` em disco) tem acesso imediato ao painel.

**Correção:**
```bash
bun add bcryptjs
bun add -d @types/bcryptjs
```
```typescript
// src/lib/auth.ts — armazene o hash em MANAGER_PASSWORD_HASH
import bcrypt from 'bcryptjs'

const PASSWORD_HASH = process.env.MANAGER_PASSWORD_HASH ?? ''

export async function verifyPassword(password: string): Promise<boolean> {
  if (!PASSWORD_HASH) return false
  return bcrypt.compare(password, PASSWORD_HASH)
}

// Para gerar o hash da senha (rodar uma vez):
// node -e "const b=require('bcryptjs'); b.hash('SuaSenhaForte',12).then(console.log)"
```

### 2.2 Token de sessão é uma string fixa e previsível

```typescript
// src/lib/auth.ts:13-22
export async function createSession(): Promise<void> {
  jar.set(SESSION_COOKIE, 'authenticated', {  // ← valor fixo
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    ...
  })
}

// src/lib/auth.ts:29-32
export async function isAuthenticated(): Promise<boolean> {
  return jar.get(SESSION_COOKIE)?.value === 'authenticated'  // ← compara string fixa
}
```

O cookie de sessão sempre tem o valor `"authenticated"`. Qualquer pessoa que defina manualmente `lemm_session=authenticated` no browser terá acesso ao painel sem precisar da senha. Esse é um bypass de autenticação trivial.

**Correção:** Usar tokens aleatórios e armazenar sessão server-side (banco ou cache):
```typescript
import { randomBytes } from 'crypto'

// Ao criar sessão: gerar token aleatório e persistir no DB
const token = randomBytes(32).toString('hex')
await db.insert(sessions).values({ token, expiresAt: new Date(Date.now() + 7 * 86400000) })
jar.set(SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 604800 })

// Ao verificar: buscar token no DB
const session = await db.select().from(sessions).where(eq(sessions.token, cookieValue)).limit(1)
return session.length > 0 && session[0].expiresAt > new Date()
```

---

## 3. CRÍTICO — Endpoints de API sem Proteção

**Arquivo:** [src/proxy.ts](src/proxy.ts)

O middleware protege apenas 5 grupos de rotas. Os seguintes endpoints com operações de **criação, edição e exclusão (POST/PUT/DELETE)** estão completamente desprotegidos e podem ser chamados por qualquer pessoa sem autenticação:

| Endpoint | Operações expostas |
|----------|-------------------|
| `/api/team/**` | POST, PUT, DELETE em membros, categorias, prefixos, graus |
| `/api/projects/**` | POST, PUT, DELETE em projetos, imagens, PDFs |
| `/api/project-categories/**` | POST, PUT, DELETE |
| `/api/project-themes/**` | POST, PUT, DELETE |
| `/api/event-types/**` | POST, PUT, DELETE |
| `/api/contato/**` | POST, PUT, DELETE em contatos e canais |
| `/api/hardware-modules/**` | PUT, DELETE |

**Exemplo de ataque:**
```bash
# Deletar todos os membros da equipe sem autenticação:
curl -X DELETE https://seu-site.com/api/team/1
curl -X DELETE https://seu-site.com/api/team/2
# ... iterar por IDs
```

**Correção — adicionar todos os endpoints ao proxy:**

```typescript
// src/proxy.ts — versão corrigida

const PROTECTED_PREFIXES = [
  '/api/team',
  '/api/projects',
  '/api/project-categories',
  '/api/project-themes',
  '/api/event-types',
  '/api/contato',
  '/api/hardware',
  '/api/hardware-modules',
  '/api/events',
  '/api/about-timeline',
  '/api/collaboration-partners',
  '/api/developed-platforms',
]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/manager/login') return NextResponse.next()

  const session = req.cookies.get(SESSION_COOKIE)?.value

  if (pathname.startsWith('/manager') && session !== 'authenticated') {
    const url = req.nextUrl.clone()
    url.pathname = '/manager/login'
    return NextResponse.redirect(url)
  }

  const isProtectedMutation =
    req.method !== 'GET' &&
    PROTECTED_PREFIXES.some(p => pathname.startsWith(p))

  if (isProtectedMutation && session !== 'authenticated') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manager/:path*', '/api/:path*'],
}
```

---

## 4. ALTO — Upload de Arquivos Inseguro

**Arquivos:** [src/app/api/projects/route.ts](src/app/api/projects/route.ts), [src/app/api/team/[id]/photo/route.ts](src/app/api/team/%5Bid%5D/photo/route.ts)

```typescript
// src/app/api/projects/route.ts:88-98
if (imageFile && imageFile.size > 0) {
  image = Buffer.from(await imageFile.arrayBuffer())
  imageMimeType = imageFile.type  // ← MIME type enviado pelo cliente, não verificado
}

if (pdfFile && pdfFile.size > 0) {
  pdf = Buffer.from(await pdfFile.arrayBuffer())
  pdfMimeType = pdfFile.type  // ← idem
}
```

**Problemas identificados:**
1. O `Content-Type` é fornecido pelo cliente e não validado — um atacante pode enviar um arquivo `.html`/`.js`/`.exe` com MIME type `image/jpeg`
2. Não há verificação de magic bytes (assinatura do arquivo)
3. Não há limite de tamanho de arquivo — arquivos muito grandes sobrecarregam o banco
4. O MIME type armazenado no banco é usado diretamente no `Content-Type` da resposta ([src/app/api/projects/[id]/image/route.ts](src/app/api/projects/%5Bid%5D/image/route.ts:22)), criando potencial para servir conteúdo ativo

**Correção:**
```typescript
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const ALLOWED_PDF_TYPES = new Set(['application/pdf'])
const MAX_IMAGE_SIZE = 5 * 1024 * 1024  // 5 MB
const MAX_PDF_SIZE = 20 * 1024 * 1024   // 20 MB

// Verificar magic bytes para imagens:
function detectImageMime(buffer: Buffer): string | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png'
  if (buffer.slice(0, 4).toString() === 'RIFF') return 'image/webp'
  return null
}

if (imageFile && imageFile.size > 0) {
  if (imageFile.size > MAX_IMAGE_SIZE)
    return NextResponse.json({ error: 'Imagem muito grande (máx 5MB)' }, { status: 400 })
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
  const detectedMime = detectImageMime(imageBuffer)
  if (!detectedMime || !ALLOWED_IMAGE_TYPES.has(detectedMime))
    return NextResponse.json({ error: 'Tipo de arquivo inválido' }, { status: 400 })
  image = imageBuffer
  imageMimeType = detectedMime  // usar o detectado, não o enviado pelo cliente
}
```

---

## 5. ALTO — Ausência de Rate Limiting

**Arquivo:** [src/app/api/auth/route.ts](src/app/api/auth/route.ts)

O endpoint de login não tem nenhum mecanismo de defesa contra força bruta. Um atacante pode testar milhares de senhas por segundo sem qualquer bloqueio.

**Instalar:**
```bash
bun add @upstash/ratelimit @upstash/redis
# ou para solução sem Redis externo:
bun add rate-limiter-flexible
```

**Implementação simples com cache em memória (sem dependência externa):**
```typescript
// src/lib/rate-limit.ts
const attempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }) // janela de 15 min
    return { allowed: true }
  }

  if (entry.count >= 10) {  // máx 10 tentativas por 15 min
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { allowed: true }
}

// src/app/api/auth/route.ts
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed, retryAfter } = checkRateLimit(ip)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }
  // ... resto do handler
}
```

---

## 6. ALTO — Security Headers Ausentes

**Arquivo:** [next.config.ts](next.config.ts)

Nenhum security header está configurado. Isso expõe o site a:
- Clickjacking (sem `X-Frame-Options`)
- MIME sniffing (sem `X-Content-Type-Options`)
- XSS via injeção de scripts externos (sem `Content-Security-Policy`)
- Downgrade de HTTPS (sem `Strict-Transport-Security`)
- Vazamento de referrer (sem `Referrer-Policy`)

**Correção — adicionar ao `next.config.ts`:**

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // reduzir gradualmente
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://www.plantareducacao.com.br",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  // ... resto da config
}
```

---

## 7. ALTO — CSRF sem Proteção

**Arquivo:** [src/app/api/auth/route.ts](src/app/api/auth/route.ts) e todos os endpoints de mutação

O cookie usa `sameSite: 'lax'`, o que oferece proteção parcial (bloqueia requisições cross-site de links de terceiros), mas **não protege requisições POST de formulários cross-origin**. Sem um token CSRF explícito, páginas maliciosas podem executar ações em nome de usuários autenticados.

**Correção — implementar Double Submit Cookie ou token CSRF:**
```typescript
// src/lib/csrf.ts
import { randomBytes } from 'crypto'

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

export function validateCsrfToken(token: string | null, cookieToken: string | null): boolean {
  if (!token || !cookieToken) return false
  return token === cookieToken  // timing-safe compare recomendado
}

// No formulário: enviar X-CSRF-Token no header
// No handler: validar req.headers.get('x-csrf-token') contra cookie
```

Alternativamente, migrar para `sameSite: 'strict'` reduz bastante a superfície sem implementação extra.

---

## 8. MÉDIO — Credenciais Padrão no Repositório

**Arquivos:** [.env.sample](.env.sample), [docker-compose.yml](docker-compose.yml)

```
# .env.sample
DATABASE_URL=postgres://lemm:lemm@localhost:5432/lemm
MANAGER_PASSWORD=lemm2025
```

```yaml
# docker-compose.yml:38-40
environment:
  POSTGRES_USER: lemm
  POSTGRES_PASSWORD: lemm
  POSTGRES_DB: lemm
```

O `.env` real está no `.gitignore` (correto), mas o `.env.sample` expõe a senha padrão `lemm2025` e as credenciais do banco. Qualquer pessoa com acesso ao repositório sabe as credenciais default.

**Correções:**
1. Substituir valores reais no `.env.sample` por placeholders:
   ```
   DATABASE_URL=postgres://USER:PASS@HOST:5432/DB
   MANAGER_PASSWORD=ESCOLHA_UMA_SENHA_FORTE
   ```
2. No `docker-compose.yml`, usar variáveis de ambiente para o banco:
   ```yaml
   environment:
     POSTGRES_USER: ${POSTGRES_USER}
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
     POSTGRES_DB: ${POSTGRES_DB}
   ```
3. Trocar todas as credenciais em produção imediatamente se foram usadas
4. Verificar histórico Git com `git log --all --diff-filter=A -- .env` para garantir que o `.env` real nunca foi commitado

---

## 9. MÉDIO — Validação de Input Inconsistente

A validação é feita manualmente e de forma inconsistente entre os endpoints. Alguns campos críticos como `slug` e `title` não têm validação de formato, tamanho máximo ou caracteres permitidos.

**Exemplo de problema — slug sem validação:**
```typescript
// src/app/api/projects/route.ts:47
const slug = (fd.get('slug') as string | null)?.trim()
// Sem validação de formato: aceita qualquer string, incluindo "../../../etc/passwd"
```

**Correção — instalar Zod e centralizar validação:**
```bash
bun add zod
```
```typescript
import { z } from 'zod'

const createProjectSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  categoryId: z.string().uuid(),
  gitUrl: z.string().url().optional().nullable(),
  publicationUrl: z.string().url().optional().nullable(),
})

// No handler:
const parsed = createProjectSchema.safeParse(Object.fromEntries(fd))
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
}
```

---

## 10. MÉDIO — Identificação do Cookie de Sessão

**Arquivo:** [src/lib/auth.ts:5](src/lib/auth.ts)

```typescript
const SESSION_COOKIE = 'lemm_session'
```

O nome do cookie `lemm_session` revela:
1. O nome da aplicação (`lemm`)
2. O propósito do cookie (`session`)

Isso facilita reconhecimento e ataques direcionados (enumerar usuários logados, construir exploits específicos).

**Correção:** Usar um nome genérico e não descritivo:
```typescript
const SESSION_COOKIE = '__Host-sid'
// Prefixo __Host- também força: Secure, Path=/, sem Domain — mais seguro
```

---

## 11. MÉDIO — Content-Type Confiado do Cliente em Imagens

**Arquivo:** [src/app/api/projects/[id]/image/route.ts:22](src/app/api/projects/%5Bid%5D/image/route.ts)

```typescript
return new NextResponse(row.image as BodyInit, {
  headers: {
    'Content-Type': row.imageMimeType,  // ← valor vem do BD, que veio do cliente
    ...
  },
})
```

O MIME type armazenado no banco veio originalmente do campo `imageFile.type` enviado pelo cliente no upload. Um atacante poderia fazer upload de um arquivo HTML com `Content-Type: text/html`, que seria servido pelo servidor e renderizado pelo browser como uma página ativa (potencial para XSS stored).

**Correção:** Adicionar `X-Content-Type-Options: nosniff` na resposta e usar apenas tipos de mídia conhecidos. Com a correção do item 4 (magic bytes), o MIME type no banco já será confiável.

---

## 12. BAIXO — Ausência de Username no Login

**Arquivo:** [src/app/api/auth/route.ts](src/app/api/auth/route.ts)

O login aceita apenas senha, sem username. Isso significa que um atacante sabe de antemão que só precisa testar senhas — não precisa enumerar usuários. Adicionar um username (mesmo que fixo) aumenta a entropia do ataque de força bruta.

Como o analista Mateus apontou: se o atacante não souber o username, o custo de um brute force muda de O(N) para O(N²).

**Correção:**
```typescript
// src/lib/auth.ts
const USERNAME = process.env.MANAGER_USERNAME ?? ''
const PASSWORD_HASH = process.env.MANAGER_PASSWORD_HASH ?? ''

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (!USERNAME || !PASSWORD_HASH) return false
  if (username !== USERNAME) return false
  return bcrypt.compare(password, PASSWORD_HASH)
}
```
```typescript
// src/app/api/auth/route.ts
const { username, password } = await req.json()
if (!verifyCredentials(username, password)) { ... }
```

---

## 13. Configurações de Servidor / Coolify

Esta seção endereça os pontos levantados pelo pentester que dependem de configuração de infraestrutura, **não de código**. A aplicação está sendo implantada em servidor Contabo com Coolify.

---

### 13.1 Obfuscar portas adjacentes

O servidor provavelmente expõe portas além da aplicação (banco de dados, SSH, painel do Coolify, etc.). O `docker-compose.yml` expõe a porta `5432` do PostgreSQL diretamente para a interface de rede.

**Ações:**
- No `docker-compose.yml` de produção, remover o binding da porta do banco (`5432:5432`) — o banco só precisa ser acessível internamente via rede Docker:
  ```yaml
  # Remover esta linha do serviço db:
  ports:
    - '5432:5432'
  ```
- No servidor Contabo: configurar firewall (UFW/iptables) para bloquear todas as portas exceto 80, 443 e a porta SSH (preferencialmente não-padrão):
  ```bash
  ufw default deny incoming
  ufw allow 22/tcp   # ou porta SSH customizada
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
  ```
- Mover SSH para porta não-padrão (ex: 2222) e desabilitar login por senha (apenas chave pública)
- Bloquear acesso externo ao painel do Coolify (porta 8000/3000 etc.) via firewall ou VPN

---

### 13.2 Evitar indexação de scripts JS e assets

Next.js expõe os bundles JS em `/_next/static/`. Embora seja necessário para o funcionamento, é possível dificultar o acesso direto e a indexação.

**Ações:**
- Adicionar ao `robots.txt`:
  ```
  User-agent: *
  Disallow: /_next/
  Disallow: /api/
  Disallow: /manager/
  ```
- No Coolify (Nginx), adicionar header para `/_next/static/`:
  ```nginx
  location /_next/static/ {
    add_header X-Robots-Tag "noindex, nofollow" always;
    # Cache longo para assets imutáveis
    expires 1y;
    access_log off;
  }
  ```

---

### 13.3 Alterar indexes de diretórios (evitar directory listing)

Se o servidor Nginx não estiver configurado corretamente, pode expor listagem de diretórios.

**No Coolify / Nginx:**
```nginx
# Desabilitar autoindex globalmente
autoindex off;

# Para diretórios específicos, retornar 403:
location ~ /\. {
  deny all;
  return 403;
}
```

---

### 13.4 Proteção do diretório `/media` (path traversal)

O pentester mencionou que havia algo acessível em `../media`. Isso sugere que o Nginx pode estar servindo diretórios fora do root do projeto.

**Ações:**
- Verificar a configuração do Nginx no Coolify e garantir que o `root` aponta apenas para o diretório correto da aplicação
- Garantir que nenhum alias ou proxy_pass aponta para caminhos relativos com `..`
- Confirmar que não há diretório `media` acessível no servidor além do que a aplicação Next.js serve intencionalmente

---

### 13.5 Implementar WAF (Web Application Firewall)

**Opções:**
1. **Cloudflare (recomendado):** Colocar o domínio atrás do Cloudflare Free/Pro. Oferece WAF automático, proteção DDoS, e oculta o IP real do servidor
2. **Nginx ModSecurity:** Instalar ModSecurity no servidor com ruleset OWASP CRS
3. **Coolify:** Verificar se o Coolify suporta integração com Traefik (que tem middlewares de segurança)

Cloudflare é a opção mais prática e imediata: basta apontar os nameservers do domínio para o Cloudflare e ativar o proxy (ícone laranja).

---

### 13.6 Proteção contra força bruta via Fail2Ban

**Instalação no servidor Contabo:**
```bash
apt install fail2ban
```

**Configuração (`/etc/fail2ban/jail.local`):**
```ini
[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 5
bantime = 3600

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 600
```

---

### 13.7 Censurar email no Whois

O email do registrante do domínio fica público no Whois e pode ser usado para phishing, engenharia social ou spam.

**Ações:**
- Acessar o painel do registrador do domínio (ex: Registro.br, GoDaddy, Namecheap)
- Ativar **Privacy Protection / WHOIS Privacy** (geralmente gratuito)
- Para domínios `.br` no Registro.br: atualizar os dados de contato para usar email genérico ou contato da organização

---

### 13.8 Configuração segura do Git no servidor

O pentester mencionou que conseguiu alterar algo no Git do servidor. Isso indica que o repositório Git pode estar acessível publicamente (diretório `.git` exposto) ou que as permissões de arquivo estão incorretas.

**Ações:**
1. **Verificar exposição do `.git`:**
   ```bash
   curl -s https://seu-site.com/.git/config
   # Se retornar o conteúdo do arquivo, o .git está exposto — CRÍTICO
   ```
2. **Bloquear acesso ao `.git` no Nginx:**
   ```nginx
   location ~ /\.git {
     deny all;
     return 404;
   }
   ```
3. **Verificar permissões de arquivo no servidor:**
   ```bash
   chmod -R 750 /path/to/app
   chown -R www-data:www-data /path/to/app
   ```
4. **Revogar e regenerar todos os tokens de acesso ao repositório** se o comprometimento for confirmado
5. Não manter o repositório Git clonado diretamente em `/var/www` — usar CI/CD com build de imagem Docker

---

## Checklist de Correção Prioritária

### Imediato (antes de qualquer acesso público)
- [ ] Implementar hash de senha com bcrypt (`src/lib/auth.ts`)
- [ ] Gerar token de sessão aleatório em vez de string fixa
- [ ] Adicionar todos os endpoints ao middleware de autenticação (`src/proxy.ts`)
- [ ] Remover porta 5432 do binding externo no docker-compose de produção
- [ ] Trocar credenciais padrão (`lemm`/`lemm2025`) por valores fortes e únicos

### Curto prazo (1-2 sprints)
- [ ] Implementar rate limiting no `/api/auth`
- [ ] Adicionar security headers no `next.config.ts`
- [ ] Validar MIME type de uploads por magic bytes
- [ ] Adicionar limite de tamanho aos uploads
- [ ] Adicionar username ao processo de login
- [ ] Renomear cookie de sessão para nome não descritivo
- [ ] Adicionar `robots.txt` bloqueando `/api/` e `/manager/`

### Médio prazo (infraestrutura)
- [ ] Instalar Cloudflare na frente do servidor (WAF + DDoS)
- [ ] Configurar UFW/firewall no servidor Contabo
- [ ] Configurar Fail2Ban
- [ ] Desabilitar directory listing no Nginx/Coolify
- [ ] Bloquear acesso ao `.git` no Nginx
- [ ] Ativar Privacy Protection no Whois do domínio
- [ ] Instalar Zod para validação de schemas nos endpoints
- [ ] Implementar CSRF tokens

---

*Relatório gerado em 2026-05-15. Revisão recomendada após implementação das correções.*
