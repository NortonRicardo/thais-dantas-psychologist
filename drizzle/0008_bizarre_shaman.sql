ALTER TABLE "developed_platforms" ALTER COLUMN "icon_key" SET DEFAULT 'cloud-sun';--> statement-breakpoint
ALTER TABLE "hardware_modules" ALTER COLUMN "icon_key" SET DEFAULT 'Cpu';--> statement-breakpoint
ALTER TABLE "hardware_modules" ADD COLUMN "title" text DEFAULT '' NOT NULL;
