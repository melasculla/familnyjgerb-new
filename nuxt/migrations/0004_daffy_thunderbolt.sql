ALTER TABLE "projects" ADD COLUMN "lang_group" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lang_group_projects_id_fk" FOREIGN KEY ("lang_group") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_order_category_id_unique" UNIQUE("order","category_id");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_lang_id_unique" UNIQUE("slug","lang_id");