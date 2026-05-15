# Guia de Segurança — LEMM

**Última revisão:** 2026-05-15  
**Stack:** Next.js 16 · Better Auth 1.6 · PostgreSQL 16 · Drizzle ORM · Bun · Docker · Coolify

Este documento define **todos** os critérios de segurança do projeto: o que já está implementado, como funciona, e o que ainda precisa ser feito na infraestrutura. Nenhuma brecha deve ser ignorada.

---

## Índice

1. [Autenticação](#1-autenticação)
2. [Autorização e Controle de Acesso](#2-autorização-e-controle-de-acesso)
3. [Rate Limiting](#3-rate-limiting)
4. [Validação de Input](#4-validação-de-input)
5. [Upload de Arquivos](#5-upload-de-arquivos)
6. [Security Headers](#6-security-headers)
7. [Cookies e CSRF](#7-cookies-e-csrf)
8. [Segurança do Banco de Dados](#8-segurança-do-banco-de-dados)
9. [Gestão de Segredos](#9-gestão-de-segredos)
10. [Infraestrutura Docker](#10-infraestrutura-docker)
11. [Servidor (Contabo)](#11-servidor-contabo)
12. [Coolify e Nginx](#12-coolify-e-nginx)
13. [DNS e Domínio](#13-dns-e-domínio)
14. [Crawlers e Exposição de Rotas](#14-crawlers-e-exposição-de-rotas)
15. [Checklist Geral](#15-checklist-geral)

---

## 1. Autenticação

**Status: ✅ Implementado**  
**Arquivo:** [`src/lib/auth.ts`](../src/lib/auth.ts)

### Como funciona

- Biblioteca: **Better Auth 1.6** com plugin `username`
- Login por **username + senha** (sem email)
- Senhas armazenadas com **bcrypt** (gerenciado internamente pelo Better Auth)
- Sessões geradas com **token aleatório criptograficamente seguro** (não previsível)
- Sessões armazenadas no PostgreSQL (tabela `auth_session`)

### Configuração de sessão

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7,   // expira em 7 dias
  updateAge: 60 * 60 * 24,        // renova o cookie se > 1 dia velho
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,               // cache local de 5 min (evita hit no DB a cada request)
  },
},
```

### Regras

- Nunca usar senha em texto puro — o Better Auth gerencia o hash automaticamente
- O admin é criado **uma única vez** via `bun db:seed` lendo `ADMIN_USERNAME` e `ADMIN_PASSWORD` do `.env`
- `ADMIN_PASSWORD` deve ter **no mínimo 8 caracteres** (validação do Better Auth)
- Em produção, usar senha forte (mínimo 16 caracteres, letras + números + símbolos)

---

## 2. Autorização e Controle de Acesso

**Status: ✅ Implementado**  
**Arquivo:** [`src/proxy.ts`](../src/proxy.ts)

### Modelo de acesso

| Área | Quem pode acessar |
|------|------------------|
| `/` (páginas públicas) | Qualquer pessoa — dados lidos diretamente no banco via Server Components |
| `/manager/*` | Apenas usuários autenticados — redireciona para `/manager/login` sem sessão |
| `/api/auth/*` | Qualquer pessoa — endpoints internos do Better Auth (login, logout, get-session) |
| `/api/*` (todos os outros) | Apenas usuários autenticados — retorna `401` sem sessão |

### Como o middleware funciona

```
Request chega
  ↓
É /api/auth/* ? → Passa direto (Better Auth cuida)
  ↓
É /manager/login ? → Passa direto
  ↓
Tem sessão válida ? → Passa direto
  ↓
Rate limit excedido ? → 429 Too Many Requests
  ↓
É /manager/* ? → Redireciona para /manager/login
  ↓
É /api/* ? → 401 Unauthorized
  ↓
Qualquer outra rota → Passa direto
```

### Regras

- **Todos** os endpoints `/api/*` exigem autenticação — incluindo GET
- As páginas públicas **nunca** chamam `/api/*` diretamente; leem o banco via Server Components com Drizzle
- Nunca adicionar um novo endpoint `/api/*` sem verificar que o proxy o cobre
- Nunca mover lógica de autenticação para dentro dos route handlers — o proxy é a única camada de guarda

---

## 3. Rate Limiting

**Status: ✅ Implementado (duas camadas)**

### Camada 1 — Proxy (unauthenticated requests)

**Arquivo:** [`src/proxy.ts`](../src/proxy.ts)

- **Limite:** 30 requisições por minuto por IP
- **Escopo:** qualquer request sem sessão válida
- **Armazenamento:** `Map` em memória (por processo)
- **Resposta:** `429` com header `Retry-After: 60`

```typescript
// 30 req/min por IP para requests sem sessão
const rlMap = new Map<string, { count: number; resetAt: number }>()
```

### Camada 2 — Better Auth (login endpoint)

**Arquivo:** [`src/lib/auth.ts`](../src/lib/auth.ts)

- **Global:** 100 req/min por IP em qualquer endpoint `/api/auth/*`
- **Login:** máximo **5 tentativas por 60 segundos** por IP em `/sign-in/username`
- **Armazenamento:** memória (por processo)

```typescript
rateLimit: {
  enabled: true,
  window: 60,
  max: 100,
  storage: 'memory',
  customRules: {
    '/sign-in/username': { window: 60, max: 5 },
  },
},
```

### Limitações conhecidas

> O armazenamento em memória é **por processo e por container**. Em produção com múltiplas instâncias, os contadores não são compartilhados. Para escalar horizontalmente, migrar para Redis (`storage: 'redis'`).

### Regras

- Nunca remover o rate limiting do login — é a principal defesa contra brute force
- Se adicionar um novo endpoint público (sem autenticação), avaliar se precisa de rate limit próprio
- Em caso de deploy multi-instância: migrar para Redis antes de escalar

---

## 4. Validação de Input

**Status: ✅ Implementado**  
**Arquivos:** [`src/lib/validation/`](../src/lib/validation/)

### Princípio

**Todo input de usuário que chega ao servidor deve ser validado com Zod antes de tocar o banco.**

### Padrão de uso

```typescript
// 1. Definir schema em src/lib/validation/
export const myFormSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  id: z.string().uuid(),
})

// 2. Validar no handler antes de qualquer operação
const parsed = myFormSchema.safeParse(Object.fromEntries(fd))
if (!parsed.success) return validationErrorResponse(parsed.error)
```

### Regras específicas

| Tipo de campo | Validação obrigatória |
|--------------|----------------------|
| IDs (UUIDs) | `z.string().uuid()` — nunca interpolar direto na query |
| Slug | Regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` |
| URLs | `z.string().url()` com max 2000 caracteres |
| Strings livres | `.trim()` + `.min()` + `.max()` |
| Campos opcionais | `.transform(s => s \|\| null)` + union com `z.null()` |
| Datas | `.refine(s => !isNaN(Date.parse(s)))` |

### Proteção contra SQL Injection

O Drizzle ORM usa **queries parametrizadas** internamente — nunca interpolação de string em SQL. Contudo, a validação Zod é obrigatória mesmo assim para garantir integridade dos dados e evitar erros silenciosos.

**Nunca** usar `db.execute(sql\`... ${userInput} ...\`)` com input não sanitizado.

---

## 5. Upload de Arquivos

**Status: ✅ Implementado**  
**Arquivo:** [`src/lib/upload-validation.ts`](../src/lib/upload-validation.ts)

### Validações aplicadas

Para **imagens** (JPEG, PNG):

| Verificação | Implementação |
|------------|--------------|
| MIME type permitido | `Set(['image/jpeg', 'image/png'])` |
| Tamanho máximo | 5 MB (`MAX_IMAGE_BYTES`) |
| Magic bytes JPEG | `FF D8 FF` |
| Magic bytes PNG | `89 50 4E 47` |
| Header de resposta | `X-Content-Type-Options: nosniff` |

Para **PDFs**:

| Verificação | Implementação |
|------------|--------------|
| MIME type permitido | `Set(['application/pdf'])` |
| Tamanho máximo | 20 MB (`MAX_PDF_BYTES`) |
| Magic bytes PDF | `25 50 44 46` (`%PDF`) |
| Header de resposta | `X-Content-Type-Options: nosniff` |

### Por que magic bytes?

O `Content-Type` enviado pelo browser é controlado pelo cliente — pode ser falsificado. Os magic bytes são os primeiros bytes do arquivo real e não podem ser alterados sem corromper o arquivo.

### Regras

- **Nunca** confiar no `file.type` do cliente como única validação
- Sempre ler os primeiros bytes do buffer e comparar com a assinatura esperada
- O MIME type armazenado no banco deve ser o **detectado** pelos magic bytes, não o enviado pelo cliente
- Todos os endpoints que servem binários devem ter `X-Content-Type-Options: nosniff`
- Ao adicionar novos tipos de arquivo: adicionar magic bytes correspondentes antes de aceitar uploads

---

## 6. Security Headers

**Status: ✅ Implementado**  
**Arquivo:** [`next.config.ts`](../next.config.ts)

### Headers configurados

| Header | Valor | Proteção |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Vazamento de URL |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Downgrade HTTPS → HTTP |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Acesso a sensores |
| `Content-Security-Policy` | Ver abaixo | XSS, injeção de recursos |

### Content-Security-Policy

```
default-src 'self'
script-src  'self' 'unsafe-inline' ['unsafe-eval' apenas em dev]
style-src   'self' 'unsafe-inline'
img-src     'self' data: blob: https://images.unsplash.com https://www.plantareducacao.com.br
font-src    'self'
connect-src 'self'
frame-src   https://www.google.com https://maps.google.com
frame-ancestors 'none'
object-src  'none'
base-uri    'self'
form-action 'self'
```

### Regras

- `unsafe-eval` é habilitado **apenas em desenvolvimento** (necessário para Turbopack source maps)
- Em produção, `unsafe-eval` está ausente
- Se adicionar um novo domínio externo (fonte de imagem, iframe, etc.), adicionar explicitamente à CSP
- Nunca usar `default-src *` ou `script-src *`
- O header `frame-ancestors 'none'` e `X-Frame-Options: DENY` se complementam (cobertura de browsers antigos)

---

## 7. Cookies e CSRF

**Status: ✅ Implementado**

### Atributos do cookie de sessão

| Atributo | Valor | Proteção |
|----------|-------|---------|
| Prefixo | `__Host-` | Força `Secure`, `Path=/`, sem `Domain` — cookie não pode ser downgraded |
| `sameSite` | `strict` | CSRF — cookie não é enviado em requests cross-site |
| `httpOnly` | `true` (padrão Better Auth) | XSS não consegue ler o cookie via JavaScript |
| `secure` | `true` em produção | Cookie só viaja por HTTPS |

### Por que `sameSite: strict` previne CSRF

Com `strict`, o browser **nunca** envia o cookie em uma requisição originada de outro domínio. Isso torna desnecessário o uso de CSRF tokens para a maioria dos cenários — qualquer formulário ou `fetch()` de um site malicioso não terá o cookie junto.

### Por que o prefixo `__Host-`

O prefixo `__Host-` impõe ao browser que:
- O cookie só é enviado por HTTPS (`Secure` implícito)
- O caminho é sempre `/` (`Path=/` forçado)
- Não pode ter atributo `Domain` (impede subdomain injection)

### Regras

- Nunca remover o `cookiePrefix: '__Host'`
- Nunca mudar `sameSite` para `lax` ou `none` sem justificativa de segurança documentada
- Nunca expor o conteúdo do cookie em logs ou respostas da API

---

## 8. Segurança do Banco de Dados

**Status: ✅ Implementado**

### Proteções em uso

- **Drizzle ORM:** todas as queries usam **prepared statements / queries parametrizadas** — sem concatenação de strings com input do usuário
- **Validação Zod** antes de qualquer insert/update — garante que apenas dados válidos chegam ao ORM
- **UUIDs como chaves primárias** — não há IDs sequenciais enumeráveis
- **Banco não exposto externamente** — porta `5432` não tem binding externo no `docker-compose.yml` de produção
- **Rede Docker isolada** — o banco (`lemm-db`) só é acessível internamente via `app-network`

### Regras

- **Nunca** usar `db.execute(sql\`...\`)` com interpolação de variáveis de usuário
- **Nunca** expor a porta `5432` no `docker-compose.yml` de produção
- Backups do banco devem ser armazenados criptografados
- `DATABASE_URL` nunca deve aparecer em logs de aplicação

---

## 9. Gestão de Segredos

**Status: ✅ Implementado (parcial — depende de ação na infra)**

### Variáveis sensíveis

| Variável | Uso | Requisito em produção |
|----------|-----|----------------------|
| `BETTER_AUTH_SECRET` | Assinar tokens de sessão | Mínimo 32 bytes aleatórios: `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | Senha do admin inicial | Mínimo 16 caracteres, alta entropia |
| `POSTGRES_PASSWORD` | Senha do banco | Mínimo 24 caracteres aleatórios |
| `DATABASE_URL` | Conexão com o banco | Nunca logar |

### Regras

- **Nunca** commitar `.env` com valores reais — apenas `.env.sample` vai para o Git
- `.env` está no `.gitignore` — verificar que nunca foi commitado: `git log --all -- .env`
- Em produção (Coolify): configurar variáveis pelo painel de **Environment Variables** do serviço, não via arquivo `.env` no servidor
- Rotacionar `BETTER_AUTH_SECRET` invalida **todas** as sessões ativas — planejar janela de manutenção
- Nunca logar `process.env.DATABASE_URL` ou qualquer secret

### Gerar segredos seguros

```bash
# BETTER_AUTH_SECRET
openssl rand -hex 32

# POSTGRES_PASSWORD
openssl rand -base64 24

# ADMIN_PASSWORD (legível por humanos)
openssl rand -base64 16
```

---

## 10. Infraestrutura Docker

**Status: ✅ Implementado**

### Dois ambientes separados

| Arquivo | Uso | Porta web | Porta DB |
|---------|-----|-----------|---------|
| `docker-compose-dev.yml` | Desenvolvimento local | `3000` | `5432` (exposta para dev tools) |
| `docker-compose.yml` | Produção | `3020` | Não exposta |

### docker-compose.yml (produção)

- Porta `5432` **não está exposta** externamente
- Banco acessível apenas pela rede Docker interna (`app-network`)
- Build via `Dockerfile` multi-stage (standalone output, imagem mínima)
- Credenciais lidas de `${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`, `${POSTGRES_DB}` — nunca hardcoded

### Dockerfile (produção)

- Multi-stage build: `deps` → `builder` → `runner`
- Stage final baseado em `node:20-slim` (imagem mínima)
- Usuário `nextjs` sem privilégios de root (`USER nextjs`)
- `output: 'standalone'` no Next.js — minimiza artefatos na imagem
- Migrations rodam automaticamente no startup: `CMD ["sh", "-c", "bun run db:migrate && node server.js"]`

### Regras

- **Nunca** usar `docker-compose-dev.yml` em produção
- **Nunca** expor porta `5432` no compose de produção
- **Nunca** rodar o container como `root`
- Verificar periodicamente se há atualizações de segurança nas imagens base (`node:20-slim`, `postgres:16-alpine`)

---

## 11. Servidor (Contabo)

**Status: ⚠️ Pendente — configuração manual necessária**

### 11.1 Firewall UFW

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 2222/tcp    # SSH em porta não-padrão
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status verbose
```

> Substituir `2222` pela porta SSH escolhida.

### 11.2 Hardening do SSH

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
systemctl restart sshd
```

> Garantir que a chave pública está em `~/.ssh/authorized_keys` **antes** de desabilitar senha.

### 11.3 Fail2Ban

```bash
apt install fail2ban -y
```

`/etc/fail2ban/jail.local`:

```ini
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
```

```bash
systemctl enable fail2ban
systemctl start fail2ban
fail2ban-client status
```

### 11.4 Verificar exposição do `.git`

```bash
curl -s https://seu-dominio.com/.git/config
# Se retornar conteúdo → CRÍTICO
```

Se exposto:
1. Bloquear no Nginx imediatamente (ver seção 12)
2. Revogar e regenerar **todos** os tokens de acesso ao repositório
3. Auditar o histórico do Git para garantir que nenhum secret foi commitado

---

## 12. Coolify e Nginx

**Status: ⚠️ Pendente — configuração manual necessária**

### 12.1 Bloquear painel do Coolify externamente

```bash
# Bloquear porta do painel (ajustar conforme versão do Coolify)
ufw deny 8000/tcp
ufw deny 8080/tcp
```

Acessar o painel apenas via SSH tunnel:

```bash
ssh -L 8000:localhost:8000 usuario@servidor -p 2222
# Abrir http://localhost:8000 no browser local
```

### 12.2 Configuração Nginx (Custom Config no Coolify)

```nginx
# Bloquear acesso ao repositório Git
location ~ /\.git {
    deny all;
    return 404;
}

# Bloquear arquivos ocultos
location ~ /\. {
    deny all;
    return 403;
}

# Desabilitar directory listing
autoindex off;

# Assets estáticos Next.js — cache imutável + sem indexação
location /_next/static/ {
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}
```

### 12.3 Verificar o diretório `/media`

O pentester identificou conteúdo acessível via `../media`. Verificar:

```bash
# Checar se há diretório media exposto
ls -la /var/www/
ls -la /opt/coolify/

# Checar configuração do Nginx
grep -r "alias\|root\|media" /etc/nginx/sites-enabled/
```

Garantir que o `root` do Nginx aponta **exclusivamente** para o diretório da aplicação, sem caminhos com `..`.

### 12.4 Variáveis de ambiente no Coolify

Configurar **pelo painel de Environment Variables** do serviço — não criar arquivo `.env` no servidor:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

---

## 13. DNS e Domínio

**Status: ⚠️ Pendente — configuração manual necessária**

### 13.1 Cloudflare (recomendado)

1. Criar conta em [cloudflare.com](https://cloudflare.com)
2. Adicionar o domínio e apontar nameservers para o Cloudflare
3. Registros A/CNAME com proxy ativo (ícone laranja ☁️) — oculta o IP real do servidor
4. **Security → WAF:** ativar regras gerenciadas
5. **SSL/TLS:** modo **Full (strict)**
6. **Security → Bots:** ativar Bot Fight Mode (plano Free)

> O Cloudflare oculta o IP do servidor. Se o IP for descoberto de outra forma, o servidor continua vulnerável — por isso o firewall UFW é obrigatório mesmo com Cloudflare.

### 13.2 Privacy Protection no Whois

O email do registrante fica público no Whois — alvo fácil para phishing e engenharia social.

```bash
# Verificar exposição atual
whois seu-dominio.com | grep -i "email\|registrant"
```

- **Registro.br:** atualizar contato para email genérico da organização
- **GoDaddy / Namecheap:** ativar **Domain Privacy / WHOIS Privacy** (geralmente gratuito)

---

## 14. Crawlers e Exposição de Rotas

**Status: ✅ Implementado**  
**Arquivo:** [`public/robots.txt`](../public/robots.txt)

```
User-agent: *
Disallow: /api/
Disallow: /manager/
Disallow: /_next/
```

### Regras

- `robots.txt` é uma instrução, não uma barreira — bots maliciosos a ignoram
- A proteção real das rotas `/api/*` e `/manager/*` é o middleware em `proxy.ts`
- Nunca colocar em `robots.txt` um path "secreto" esperando que bots não o encontrem

---

## 15. Checklist Geral

### Código (já implementado)

- [x] Autenticação com Better Auth (bcrypt, sessões aleatórias no banco)
- [x] Login por username + senha (aumenta entropia do brute force)
- [x] Todos os endpoints `/api/*` protegidos pelo middleware `proxy.ts`
- [x] Rate limiting no proxy: 30 req/min para requests sem sessão
- [x] Rate limiting no Better Auth: 5 tentativas/min no endpoint de login
- [x] Validação Zod em todos os endpoints de mutação
- [x] UUID validation nos parâmetros de rota
- [x] Upload com validação de magic bytes (JPEG, PNG, PDF)
- [x] Limite de tamanho: 5 MB imagens, 20 MB PDFs
- [x] Security headers: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- [x] Cookie `__Host-` prefix + `sameSite: strict` + `httpOnly`
- [x] `X-Content-Type-Options: nosniff` nas rotas que servem binários
- [x] Porta `5432` não exposta no docker-compose de produção
- [x] `robots.txt` bloqueando `/api/`, `/manager/`, `/_next/`
- [x] `.env` no `.gitignore`

### Servidor / Infra (pendente)

- [ ] UFW configurado: bloquear tudo exceto 80, 443, SSH
- [ ] SSH em porta não-padrão, apenas chave pública, sem root login
- [ ] Fail2Ban instalado e ativo
- [ ] Painel Coolify inacessível externamente (firewall + SSH tunnel)
- [ ] Nginx: bloquear `.git`, `autoindex off`, header `/_next/static/`
- [ ] Verificar e corrigir exposição do diretório `/media`
- [ ] Variáveis de ambiente configuradas pelo Coolify (não arquivo `.env` no servidor)
- [ ] Cloudflare na frente do domínio (WAF + DDoS + oculta IP)
- [ ] Privacy Protection ativo no Whois do domínio

---

*Documento mantido pela equipe de desenvolvimento. Atualizar sempre que uma nova funcionalidade de segurança for adicionada ou uma vulnerabilidade for corrigida.*
