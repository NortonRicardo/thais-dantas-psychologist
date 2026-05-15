CREATE TABLE "team_degree_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_degree_levels_label_unique" UNIQUE("label")
);
--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "degree_level_id" uuid;
--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "formation_institution" text;
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_degree_level_id_team_degree_levels_id_fk" FOREIGN KEY ("degree_level_id") REFERENCES "public"."team_degree_levels"("id") ON DELETE set null ON UPDATE no action;
