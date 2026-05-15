CREATE TABLE "team_name_prefixes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_name_prefixes_label_unique" UNIQUE("label")
);
--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "name_prefix_id" uuid;
--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "linkedin_url" text;
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_name_prefix_id_team_name_prefixes_id_fk" FOREIGN KEY ("name_prefix_id") REFERENCES "public"."team_name_prefixes"("id") ON DELETE set null ON UPDATE no action;
