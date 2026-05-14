# LEMM

Website institucional do laboratório LEMM com painel administrativo para gerenciamento de projetos, equipe, eventos e infraestrutura.

## Tecnologias

- **Next.js 16** (App Router) + **TypeScript**
- **PostgreSQL 16** + **Drizzle ORM**
- **Tailwind CSS 4** + Radix UI
- **Bun** como runtime e gerenciador de pacotes
- **Docker** para orquestração

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados

---

## Passo a passo

### 1. Clone o repositório

```sh
git clone <url-do-repositório>
cd lemm
```

### 2. Configure as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```sh
cp .env.sample .env
```

> Edite o `.env` conforme necessário. Valores padrão para desenvolvimento local:

```env
DATABASE_URL=postgres://lemm:lemm@localhost:5432/lemm
MANAGER_PASSWORD=lemm2025
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão com o PostgreSQL |
| `MANAGER_PASSWORD` | Senha de acesso ao painel `/manager` |

> A `DATABASE_URL` dentro do Docker usa `db` como host (não `localhost`). O `docker-compose.yml` já sobrescreve isso automaticamente.

### 3. Suba os containers

```sh
docker compose up
```

Isso irá:
- Construir a imagem da aplicação (`Dockerfile.dev`)
- Subir o banco de dados PostgreSQL na porta `5432`
- Aguardar o banco estar saudável
- Rodar as migrations automaticamente
- Subir a aplicação Next.js na porta `3000`

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### 4. Popule o banco com dados iniciais (opcional)

```sh
docker compose exec web bun db:seed
```

---

## Acesso ao painel administrativo

Acesse [http://localhost:3000/manager/login](http://localhost:3000/manager/login) e use a senha definida em `MANAGER_PASSWORD`.

O painel permite gerenciar:
- Projetos e TCCs
- Membros da equipe
- Eventos
- Hardware e módulos
- Plataformas desenvolvidas
- Rede de colaboração
- Linha do tempo (Sobre Nós)
- Informações de contato

---

## Comandos úteis

### Banco de dados

```sh
# Rodar migrations
docker compose exec web bun db:migrate

# Popular com seed
docker compose exec web bun db:seed

# Resetar o banco
docker compose exec web bun db:reset

# Resetar + migrar + seed (banco limpo)
docker compose exec web bun db:fresh

# Push direto do schema (sem arquivo de migration)
docker compose exec web bun db:push

# Gerar nova migration a partir de mudanças no schema
docker compose exec web bun db:generate

# Abrir o Drizzle Studio (interface visual do banco)
docker compose exec web bun db:studio
```

### Containers

```sh
# Subir em background
docker compose up -d

# Ver logs
docker compose logs -f

# Parar containers
docker compose down

# Parar e remover volumes (apaga dados do banco)
docker compose down -v
```

---

## Estrutura de rotas

### Público

| Rota | Descrição |
|---|---|
| `/` | Página inicial |
| `/projetos` | Listagem de projetos |
| `/projetos/[id]` | Detalhes do projeto |
| `/sobre-nos` | Linha do tempo institucional |
| `/equipe` | Membros da equipe |
| `/infraestrutura` | Hardware, plataformas e parceiros |
| `/eventos` | Listagem de eventos |
| `/contato` | Página de contato |

### Painel (`/manager`)

Protegido por senha. Acesso via `/manager/login`.
