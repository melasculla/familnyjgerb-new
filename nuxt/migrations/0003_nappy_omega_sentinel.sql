ALTER TABLE "gallery_items" RENAME COLUMN "project" TO "project_ru";--> statement-breakpoint
ALTER TABLE "gallery_items" DROP CONSTRAINT "gallery_items_project_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "project_en" integer;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_project_ru_projects_id_fk" FOREIGN KEY ("project_ru") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_project_en_projects_id_fk" FOREIGN KEY ("project_en") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;