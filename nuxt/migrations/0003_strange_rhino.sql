ALTER TABLE "posts" ADD COLUMN "description" varchar(256);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" varchar(256);--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "seo_title";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "seo_description";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "seo_title";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "seo_description";