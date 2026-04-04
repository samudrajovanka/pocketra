CREATE TYPE "public"."budget_period" AS ENUM('daily', 'weekly', 'monthly');--> statement-breakpoint
CREATE TABLE "pocket_budgets" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"pocket_id" uuid NOT NULL,
	"limit_amount" numeric(19, 4) NOT NULL,
	"period" "budget_period" DEFAULT 'monthly' NOT NULL,
	"alert_threshold" numeric(3, 2) DEFAULT '0.8' NOT NULL,
	"period_start_date" date NOT NULL,
	"next_reset_date" date NOT NULL,
	CONSTRAINT "pocket_budgets_pocket_id_unique" UNIQUE("pocket_id")
);
--> statement-breakpoint
ALTER TABLE "pocket_budgets" ADD CONSTRAINT "pocket_budgets_pocket_id_pockets_id_fk" FOREIGN KEY ("pocket_id") REFERENCES "public"."pockets"("id") ON DELETE cascade ON UPDATE no action;