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
