CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"uid" varchar NOT NULL,
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
