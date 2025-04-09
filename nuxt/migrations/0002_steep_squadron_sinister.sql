ALTER TABLE "gallery_items" ADD COLUMN "project" integer;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "type" smallint[];--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "usage" smallint[];--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "info" smallint[];--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_project_projects_id_fk" FOREIGN KEY ("project") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;