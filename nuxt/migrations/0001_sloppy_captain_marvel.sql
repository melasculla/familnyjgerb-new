CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "galleries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	CONSTRAINT "galleries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "gallery_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"gallery_id" serial NOT NULL,
	CONSTRAINT "gallery_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"image" varchar(256),
	"alt_en" varchar(256),
	"alt_ru" varchar(256),
	"category_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "langs" (
	"id" serial PRIMARY KEY NOT NULL,
	"lang" varchar(256) NOT NULL,
	CONSTRAINT "langs_lang_unique" UNIQUE("lang")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" json,
	"gallery" json,
	"thumbnail" json,
	"status" varchar(256) DEFAULT 'published' NOT NULL,
	"planned_at" timestamp,
	"edited_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"seo_title" varchar(256) NOT NULL,
	"seo_description" varchar(256),
	"seo_keys" varchar(256),
	"category_id" integer,
	"lang_id" integer,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" json,
	"usuage" json,
	"sketches" json,
	"thumbnail" json,
	"video" varchar(256),
	"status" varchar(256) DEFAULT 'published' NOT NULL,
	"edited_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"seo_title" varchar(256) NOT NULL,
	"seo_description" varchar(256),
	"seo_keys" varchar(256),
	"lang_id" integer,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "gallery_categories" ADD CONSTRAINT "gallery_categories_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_category_id_gallery_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gallery_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_lang_id_langs_id_fk" FOREIGN KEY ("lang_id") REFERENCES "public"."langs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lang_id_langs_id_fk" FOREIGN KEY ("lang_id") REFERENCES "public"."langs"("id") ON DELETE no action ON UPDATE no action;