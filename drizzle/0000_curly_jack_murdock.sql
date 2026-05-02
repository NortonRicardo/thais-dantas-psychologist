CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"type" text NOT NULL,
	"speaker" text,
	"organizer" text,
	"link" text,
	"meet_link" text,
	"featured" boolean DEFAULT false NOT NULL,
	"image" "bytea",
	"image_mime_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
