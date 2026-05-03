CREATE TABLE "contact_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"director_name" text DEFAULT '' NOT NULL,
	"director_role" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"linkedin" text DEFAULT '' NOT NULL,
	"director_photo" "bytea",
	"director_photo_mime_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
