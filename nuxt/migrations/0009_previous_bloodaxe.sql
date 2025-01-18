ALTER TABLE "projects" ALTER COLUMN "lang_id" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "lang_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery_categories" ADD CONSTRAINT "gallery_categories_name_gallery_id_unique" UNIQUE("name","gallery_id");