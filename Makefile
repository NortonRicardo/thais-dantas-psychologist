DEV_COMPOSE  = docker compose -f docker-compose-dev.yml
PROD_COMPOSE = docker compose

# ─── Desenvolvimento local ────────────────────────────────────────────────────

dev:
	$(DEV_COMPOSE) up -d

dev-build:
	$(DEV_COMPOSE) up -d --build

dev-down:
	$(DEV_COMPOSE) down

dev-logs:
	$(DEV_COMPOSE) logs -f web

dev-shell:
	$(DEV_COMPOSE) exec web sh

# ─── Banco de dados (dev) ─────────────────────────────────────────────────────

db-migrate:
	$(DEV_COMPOSE) exec web bun db:migrate

db-seed:
	$(DEV_COMPOSE) exec web bun db:seed

db-reset:
	$(DEV_COMPOSE) exec web bun db:reset

db-fresh:
	$(DEV_COMPOSE) exec web bun db:fresh

db-studio:
	$(DEV_COMPOSE) exec web bun db:studio

db-generate:
	$(DEV_COMPOSE) exec web bun db:generate

# ─── Produção ─────────────────────────────────────────────────────────────────

prod-up:
	$(PROD_COMPOSE) up -d --build

prod-down:
	$(PROD_COMPOSE) down

prod-logs:
	$(PROD_COMPOSE) logs -f web

prod-shell:
	$(PROD_COMPOSE) exec web sh

prod-migrate:
	$(PROD_COMPOSE) exec web bun db:migrate

prod-seed:
	$(PROD_COMPOSE) exec web bun db:seed

.PHONY: dev dev-build dev-down dev-logs dev-shell \
        db-migrate db-seed db-reset db-fresh db-studio db-generate \
        prod-up prod-down prod-logs prod-shell prod-migrate prod-seed
