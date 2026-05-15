CREATE TABLE "team_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "category_id" uuid;
--> statement-breakpoint
INSERT INTO "team_categories" ("title", "color", "created_at", "updated_at")
VALUES
	('Professores', 'bg-sky-500', now(), now()),
	('Colaboradores', 'bg-purple-600', now(), now()),
	('Convidados', 'bg-teal-600', now(), now());
--> statement-breakpoint
UPDATE "team_members" SET "category_id" = (SELECT "id" FROM "team_categories" WHERE "title" = 'Professores' LIMIT 1) WHERE "category" = 'professores';
--> statement-breakpoint
UPDATE "team_members" SET "category_id" = (SELECT "id" FROM "team_categories" WHERE "title" = 'Colaboradores' LIMIT 1) WHERE "category" = 'colaboradores';
--> statement-breakpoint
UPDATE "team_members" SET "category_id" = (SELECT "id" FROM "team_categories" WHERE "title" = 'Convidados' LIMIT 1) WHERE "category" = 'convidados';
--> statement-breakpoint
UPDATE "team_members" SET "category_id" = (SELECT "id" FROM "team_categories" ORDER BY "created_at" LIMIT 1) WHERE "category_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "category_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "category";
--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "sort_order";
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_category_id_team_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."team_categories"("id") ON DELETE restrict ON UPDATE no action;
