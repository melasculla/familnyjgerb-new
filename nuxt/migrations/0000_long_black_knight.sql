CREATE TABLE "user_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(256) NOT NULL,
	"provider_account_id" varchar(256) NOT NULL,
	CONSTRAINT "user_accounts_provider_provider_account_id_unique" UNIQUE("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"name_ru" varchar(256) NOT NULL,
	"name_en" varchar(256)
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
	CONSTRAINT "gallery_categories_name_gallery_id_unique" UNIQUE("name","gallery_id")
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" varchar(256),
	"title" varchar(256),
	"alt_en" varchar(256),
	"alt_ru" varchar(256),
	"order" integer,
	"category_id" serial NOT NULL,
	CONSTRAINT "gallery_items_order_category_id_unique" UNIQUE("order","category_id"),
	CONSTRAINT "gallery_items_image_category_id_unique" UNIQUE("image","category_id")
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
	"description" text,
	"content" json,
	"gallery" json,
	"thumbnail" json,
	"status" varchar(256) DEFAULT 'published' NOT NULL,
	"planned_at" timestamp,
	"edited_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"seo_keys" text,
	"category_id" integer,
	"lang_id" integer DEFAULT 1 NOT NULL,
	"lang_group" integer,
	CONSTRAINT "posts_slug_lang_id_unique" UNIQUE("slug","lang_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(256),
	"content" json,
	"usage" json,
	"sketches" json,
	"thumbnail" json,
	"video" varchar(256),
	"status" varchar(256) DEFAULT 'published' NOT NULL,
	"edited_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"seo_keys" varchar(256),
	"og_image" varchar(256),
	"lang_id" integer DEFAULT 1 NOT NULL,
	"lang_group" integer,
	CONSTRAINT "projects_slug_lang_id_unique" UNIQUE("slug","lang_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"uid" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_categories" ADD CONSTRAINT "gallery_categories_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_category_id_gallery_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gallery_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_lang_id_langs_id_fk" FOREIGN KEY ("lang_id") REFERENCES "public"."langs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_lang_group_posts_id_fk" FOREIGN KEY ("lang_group") REFERENCES "public"."posts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lang_id_langs_id_fk" FOREIGN KEY ("lang_id") REFERENCES "public"."langs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lang_group_projects_id_fk" FOREIGN KEY ("lang_group") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;