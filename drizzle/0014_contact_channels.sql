ALTER TABLE "contact_info" ADD CONSTRAINT "contact_info_director_team_member_id_fk" FOREIGN KEY ("director_team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "contact_channels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_info_id" uuid NOT NULL,
	"label" text NOT NULL,
	"icon_key" text DEFAULT 'mail' NOT NULL,
	"value" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_channels" ADD CONSTRAINT "contact_channels_contact_info_id_fk" FOREIGN KEY ("contact_info_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
