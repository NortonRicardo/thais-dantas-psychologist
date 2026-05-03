CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"themes" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"description" text NOT NULL,
	"image" "bytea",
	"image_mime_type" text,
	"authors" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"git_url" text,
	"publication_url" text,
	"advisor_id" uuid,
	"co_advisor_id" uuid,
	"research_lead_id" uuid,
	"pdf_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_advisor_id_team_members_id_fk" FOREIGN KEY ("advisor_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_co_advisor_id_team_members_id_fk" FOREIGN KEY ("co_advisor_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_research_lead_id_team_members_id_fk" FOREIGN KEY ("research_lead_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;