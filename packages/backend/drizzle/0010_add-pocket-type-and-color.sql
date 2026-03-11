CREATE TYPE "public"."pocket_type" AS ENUM('cash', 'bank', 'ewallet');--> statement-breakpoint
ALTER TABLE "pockets" ADD COLUMN "type" "pocket_type" DEFAULT 'cash' NOT NULL;--> statement-breakpoint
ALTER TABLE "pockets" ADD COLUMN "color" varchar;