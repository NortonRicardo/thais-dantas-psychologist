# LEMM

## Requisitos

- [Docker](https://www.docker.com/) e Docker Compose

## Configuração

Copie o arquivo de variáveis de ambiente e preencha os valores:

```sh
cp .env.example .env
```

> Defina `MANAGER_PASSWORD` com a senha desejada para o painel de administração.

## Rodando o projeto

Suba os containers (app + banco de dados):

```sh
docker compose up
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Banco de dados

**Rodar migrations:**

```sh
docker compose exec web bun db:migrate
```

**Popular com seed:**

```sh
docker compose exec web bun db:seed
```

**Push direto (sem gerar arquivo de migration):**

```sh
docker compose exec web bun db:push
```

**Abrir o Drizzle Studio:**

```sh
docker compose exec web bun db:studio
```
