CREATE TABLE "project_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"color" text NOT NULL,
	"chip_bg" text NOT NULL,
	"chip_border" text NOT NULL,
	"chip_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_categories_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "project_themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"color" text NOT NULL,
	"pill_color" text NOT NULL,
	"filter_bg" text NOT NULL,
	"filter_border" text NOT NULL,
	"filter_text" text NOT NULL,
	"filter_active_bg" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_themes_name_unique" UNIQUE("name"),
	CONSTRAINT "project_themes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
INSERT INTO "project_categories" ("title", "color", "chip_bg", "chip_border", "chip_text") VALUES
('TCC', 'bg-sky-500/15 text-sky-300 border-sky-500/30', 'rgba(0,180,255,0.18)', 'rgba(0,180,255,0.4)', 'rgb(80,200,255)'),
('Iniciação Científica', 'bg-teal-500/15 text-teal-300 border-teal-500/30', 'rgba(0,200,120,0.18)', 'rgba(0,200,120,0.4)', 'rgb(60,220,140)'),
('Mestrado', 'bg-purple-500/15 text-purple-300 border-purple-500/30', 'rgba(160,0,255,0.18)', 'rgba(160,0,255,0.4)', 'rgb(200,120,255)'),
('Plataforma', 'bg-orange-500/15 text-orange-300 border-orange-500/30', 'rgba(255,140,0,0.18)', 'rgba(255,140,0,0.4)', 'rgb(255,180,60)'),
('Pesquisa', 'bg-blue-500/15 text-blue-300 border-blue-500/30', 'rgba(0,160,220,0.18)', 'rgba(0,160,220,0.4)', 'rgb(60,190,255)');
--> statement-breakpoint
INSERT INTO "project_themes" ("name", "slug", "color", "pill_color", "filter_bg", "filter_border", "filter_text", "filter_active_bg") VALUES
('Clima', 'clima', 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', 'rgba(0,180,255,0.6)', 'rgba(0,180,255,0.08)', 'rgba(0,180,255,0.25)', 'rgb(80,200,255)', 'rgba(0,180,255,0.22)'),
('Matemática', 'matematica', 'bg-purple-500/15 text-purple-300 border-purple-500/30', 'rgba(200,120,255,0.6)', 'rgba(160,0,255,0.08)', 'rgba(160,0,255,0.25)', 'rgb(200,120,255)', 'rgba(160,0,255,0.22)'),
('Otimização e Metaheurísticas', 'otimizacao', 'bg-orange-500/15 text-orange-300 border-orange-500/30', 'rgba(255,180,60,0.6)', 'rgba(255,140,0,0.08)', 'rgba(255,140,0,0.25)', 'rgb(255,180,60)', 'rgba(255,140,0,0.22)'),
('Agro & Sustentabilidade', 'agro', 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', 'rgba(60,220,140,0.6)', 'rgba(0,200,100,0.08)', 'rgba(0,200,100,0.25)', 'rgb(60,220,140)', 'rgba(0,200,100,0.22)');
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "category_id" uuid;
--> statement-breakpoint
UPDATE "projects" p SET "category_id" = c.id FROM "project_categories" c WHERE c.title = p.category;
--> statement-breakpoint
UPDATE "projects" SET "category_id" = (SELECT id FROM "project_categories" WHERE title = 'Pesquisa' LIMIT 1) WHERE "category_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "category";
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_project_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."project_categories"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "category_id" SET NOT NULL;
--> statement-breakpoint
CREATE TABLE "project_project_themes" (
	"project_id" uuid NOT NULL,
	"theme_id" uuid NOT NULL,
	CONSTRAINT "project_project_themes_project_id_theme_id_pk" PRIMARY KEY("project_id","theme_id")
);
--> statement-breakpoint
ALTER TABLE "project_project_themes" ADD CONSTRAINT "project_project_themes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "project_project_themes" ADD CONSTRAINT "project_project_themes_theme_id_project_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."project_themes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "project_project_themes" ("project_id", "theme_id")
SELECT p.id, t.id
FROM "projects" p
CROSS JOIN LATERAL unnest(p.themes) AS theme_row(name)
INNER JOIN "project_themes" t ON t.name = trim(theme_row.name);
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "themes";
