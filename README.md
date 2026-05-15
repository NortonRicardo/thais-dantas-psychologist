# LEMM

Website institucional do laboratório LEMM com painel administrativo para gerenciamento de projetos, equipe, eventos e infraestrutura.

## Tecnologias

- **Next.js 16** (App Router) + **TypeScript**
- **PostgreSQL 16** + **Drizzle ORM**
- **Better Auth** — autenticação com username + senha
- **Tailwind CSS 4** + Radix UI
- **Bun** como runtime e gerenciador de pacotes
- **Docker** para orquestração

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados
- `make` disponível no terminal

---

## Desenvolvimento local

### 1. Clone o repositório

```sh
git clone <url-do-repositório>
cd lemm
```

### 2. Configure as variáveis de ambiente

```sh
cp .env.sample .env
```

Os valores padrão do `.env.sample` já funcionam para desenvolvimento local sem nenhuma alteração.

| Variável             | Descrição                                        |
| -------------------- | ------------------------------------------------ |
| `POSTGRES_USER`      | Usuário do banco (padrão: `lemm`)                |
| `POSTGRES_PASSWORD`  | Senha do banco (padrão: `lemm`)                  |
| `POSTGRES_DB`        | Nome do banco (padrão: `lemm`)                   |
| `DATABASE_URL`       | String de conexão com o PostgreSQL               |
| `BETTER_AUTH_SECRET` | Segredo da sessão — gere com `openssl rand -hex 32` |
| `BETTER_AUTH_URL`    | URL pública da aplicação                         |
| `ADMIN_USERNAME`     | Usuário admin criado no seed                     |
| `ADMIN_PASSWORD`     | Senha admin criada no seed (mínimo 8 caracteres) |

### 3. Suba o ambiente

```sh
make dev
```

Isso irá:

- Subir o banco PostgreSQL na porta `5432`
- Rodar as migrations automaticamente
- Subir a aplicação Next.js em modo dev na porta `3000` com hot-reload

Acesse em [http://localhost:3000](http://localhost:3000).

### 4. Crie o usuário admin

```sh
make db-seed
```

O seed lê `ADMIN_USERNAME` e `ADMIN_PASSWORD` do `.env` e cria o usuário uma única vez.

---

## Painel administrativo

Acesse [http://localhost:3000/manager/login](http://localhost:3000/manager/login) com as credenciais definidas em `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

O painel permite gerenciar:

- Projetos e TCCs
- Membros da equipe
- Eventos
- Hardware e módulos
- Plataformas desenvolvidas
- Parcerias
- Linha do tempo (Sobre Nós)
- Informações de contato

---

## Comandos (Makefile)

### Desenvolvimento

| Comando       | Descrição                              |
| ------------- | -------------------------------------- |
| `make dev`    | Sobe os containers de dev              |
| `make dev-build` | Sobe forçando rebuild da imagem     |
| `make dev-down`  | Para e remove os containers         |
| `make dev-logs`  | Acompanha os logs em tempo real     |
| `make dev-shell` | Abre um shell no container web      |

### Banco de dados

| Comando          | Descrição                                     |
| ---------------- | --------------------------------------------- |
| `make db-migrate`  | Roda as migrations pendentes                |
| `make db-seed`     | Popula o banco (cria admin + dados iniciais)|
| `make db-reset`    | Apaga todos os dados do banco               |
| `make db-fresh`    | Reset + migrate + seed (banco do zero)      |
| `make db-studio`   | Abre o Drizzle Studio (UI visual do banco)  |
| `make db-generate` | Gera nova migration a partir do schema      |

### Produção

| Comando            | Descrição                                  |
| ------------------ | ------------------------------------------ |
| `make prod-up`     | Build e sobe os containers de produção     |
| `make prod-down`   | Para e remove os containers de produção    |
| `make prod-logs`   | Acompanha os logs de produção              |
| `make prod-shell`  | Abre um shell no container web de produção |
| `make prod-migrate`| Roda as migrations no container de prod    |
| `make prod-seed`   | Roda o seed no container de prod           |

---

## Deploy em produção (Coolify)

### 1. Configure as variáveis de ambiente no servidor

Crie o `.env` na raiz do projeto no servidor com valores de produção:

```env
POSTGRES_USER=seu_usuario_db
POSTGRES_PASSWORD=senha_forte_db
POSTGRES_DB=lemm
DATABASE_URL=postgres://seu_usuario_db:senha_forte_db@db:5432/lemm
BETTER_AUTH_SECRET=<saída de: openssl rand -hex 32>
BETTER_AUTH_URL=https://seu-dominio.com
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=sua_senha_forte
```

### 2. Suba os containers

```sh
make prod-up
```

O build de produção usa o `Dockerfile` multi-stage (standalone output) e sobe na porta `3020`.

> As migrations rodam automaticamente no startup do container via `CMD`.

### 3. Crie o usuário admin (primeira vez)

```sh
make prod-seed
```

---

## Segurança em Produção

Checklist obrigatório antes de qualquer acesso público. Dividido entre configurações do **servidor (Contabo)** e do **Coolify**.

---

### Servidor (Contabo)

#### 1. Firewall com UFW

Bloquear tudo exceto SSH, HTTP e HTTPS:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp        # ou a porta SSH customizada
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status verbose
```

> A porta `5432` (PostgreSQL) **não deve** estar exposta. O banco só é acessível internamente via rede Docker.

#### 2. Endurecer o SSH

Editar `/etc/ssh/sshd_config`:

```
Port 2222                        # trocar para porta não-padrão
PermitRootLogin no
PasswordAuthentication no        # apenas chave pública
PubkeyAuthentication yes
MaxAuthTries 3
```

Reiniciar o serviço:

```bash
systemctl restart sshd
```

> Antes de desabilitar senha, garantir que a chave pública está em `~/.ssh/authorized_keys`.

#### 3. Fail2Ban

Instalar e configurar proteção contra brute force:

```bash
apt install fail2ban -y
```

Criar `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = 2222          # mesma porta do SSH acima

[nginx-http-auth]
enabled = true
port    = http,https
filter  = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port    = http,https
filter  = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
bantime  = 600
```

```bash
systemctl enable fail2ban
systemctl start fail2ban
fail2ban-client status
```

#### 4. Verificar exposição do `.git`

```bash
curl -s https://seu-dominio.com/.git/config
# Se retornar conteúdo → CRÍTICO, o repositório está exposto
```

Se estiver exposto, bloquear imediatamente no Nginx (ver seção Coolify abaixo) e **revogar e regenerar todos os tokens de acesso ao repositório**.

---

### Coolify

#### 5. Bloquear acesso externo ao painel do Coolify

O painel do Coolify (porta 8000 ou 3000) não deve estar acessível pela internet. Restringir via UFW:

```bash
ufw deny 8000/tcp
ufw deny 8080/tcp
```

Acesse o painel apenas via **SSH tunnel**:

```bash
ssh -L 8000:localhost:8000 usuario@servidor -p 2222
# Depois abrir http://localhost:8000 no browser local
```

#### 6. Configuração Nginx no Coolify

No Coolify, em **Configurações → Custom Nginx Config** (ou via arquivo de proxy reverso), adicionar:

```nginx
# Bloquear acesso ao .git
location ~ /\.git {
    deny all;
    return 404;
}

# Bloquear acesso a arquivos ocultos
location ~ /\. {
    deny all;
    return 403;
}

# Desabilitar directory listing
autoindex off;

# Assets estáticos do Next.js — cache longo + sem indexação
location /_next/static/ {
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}

# Bloquear acesso direto à porta do banco (camada extra)
location ~ ^/(5432|5433) {
    deny all;
    return 403;
}
```

#### 7. Verificar o diretório `/media`

O pentester identificou conteúdo acessível em `../media`. Verificar:

```bash
# No servidor, checar se há diretório media exposto
ls -la /var/www/
ls -la /opt/coolify/

# Confirmar que o Nginx não serve nenhum alias com caminho relativo
grep -r "alias\|root\|media" /etc/nginx/sites-enabled/
```

Garantir que o `root` do Nginx aponta **apenas** para o diretório da aplicação, sem paths com `..`.

---

### DNS / Domínio

#### 8. Cloudflare (recomendado)

Colocar o domínio atrás do Cloudflare oculta o IP real do servidor e ativa WAF automático:

1. Criar conta em [cloudflare.com](https://cloudflare.com)
2. Adicionar o domínio e apontar os **nameservers** para o Cloudflare
3. Garantir que o proxy está ativo (ícone laranja ☁️) para os registros A/CNAME
4. Em **Security → WAF**: ativar regras gerenciadas (plano Free já inclui proteção básica)
5. Em **SSL/TLS**: modo **Full (strict)**

#### 9. Privacy Protection no Whois

O email do registrante fica público no Whois e pode ser alvo de phishing.

- **Registro.br**: no painel, atualizar contato para email da organização ou ativar proteção de dados
- **GoDaddy / Namecheap**: ativar **Domain Privacy / WHOIS Privacy** (geralmente gratuito)

Verificar exposição atual:

```bash
whois seu-dominio.com | grep -i "email\|registrant"
```

---

### Checklist rápido

| Item | Onde | Prioridade |
| ---- | ---- | ---------- |
| UFW bloqueando todas as portas exceto 80, 443, SSH | Servidor | CRÍTICO |
| Porta `5432` não exposta externamente | Servidor / docker-compose.yml | CRÍTICO |
| `.git` bloqueado no Nginx | Coolify | CRÍTICO |
| SSH apenas por chave pública, porta não-padrão | Servidor | ALTO |
| Fail2Ban instalado e ativo | Servidor | ALTO |
| Painel Coolify inacessível externamente | Servidor | ALTO |
| Cloudflare na frente do domínio | DNS | ALTO |
| Verificar e corrigir exposição do `/media` | Servidor | ALTO |
| `autoindex off` no Nginx | Coolify | MÉDIO |
| Privacy Protection no Whois | Registrador | MÉDIO |

---

## Estrutura de rotas

### Público

| Rota              | Descrição                         |
| ----------------- | --------------------------------- |
| `/`               | Página inicial                    |
| `/projetos`       | Listagem de projetos              |
| `/projetos/[id]`  | Detalhes do projeto               |
| `/sobre-nos`      | Linha do tempo institucional      |
| `/equipe`         | Membros da equipe                 |
| `/infraestrutura` | Hardware, plataformas e parceiros |
| `/eventos`        | Listagem de eventos               |
| `/contato`        | Página de contato                 |

### Painel (`/manager`)

Protegido por autenticação. Acesso via `/manager/login`.
