CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
-- Preserva as categorias já usadas em artigos existentes.
INSERT INTO "blog_categories" ("name")
SELECT DISTINCT "category" FROM "blog_posts"
ON CONFLICT ("name") DO NOTHING;
