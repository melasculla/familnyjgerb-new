import { pgTable, text, varchar, integer, timestamp, serial, json, primaryKey, boolean, unique, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { OutputData } from '@editorjs/editorjs';

export type ImageJSON = { path: string, alt?: string }

export const usersTable = pgTable('users', {
   id: serial('id').primaryKey(),
   name: varchar('name', { length: 256 }).notNull(),
   email: varchar('email', { length: 256 }).notNull(),
   role: varchar('role', { length: 20 }).$type<Roles>().notNull().default('user'),
   uid: varchar('uid').notNull().unique(),
})

export type Roles = 'user' | 'client' | 'admin'
export const rolesList: Roles[] = ['user', 'client']
export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert



export const langsTable = pgTable('langs', {
   id: serial('id').primaryKey(),
   lang: varchar('lang', { length: 256 }).notNull().unique(),
})

export type Lang = typeof langsTable.$inferSelect
export type NewLang = typeof langsTable.$inferInsert



export const postsTable = pgTable('posts', {
   id: serial('id').primaryKey(),
   slug: varchar('slug', { length: 256 }).notNull(),
   title: varchar('title', { length: 256 }).notNull(),
   description: text('description'),
   content: json('content').$type<OutputData>(),
   gallery: json('gallery').$type<ImageJSON[]>(),
   thumbnail: json('thumbnail').$type<ImageJSON>(),
   status: varchar('status', { length: 256 }).$type<PostStatus>().notNull().default('published'),
   plannedAt: timestamp('planned_at'),
   editedAt: timestamp('edited_at').defaultNow().notNull(),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   seoKeys: text('seo_keys'),
   categoryId: integer('category_id').references(() => categoriesTable.id),
   langId: integer('lang_id').references(() => langsTable.id).notNull().default(1),
   langGroup: integer('lang_group').references((): AnyPgColumn => postsTable.id, { onDelete: 'restrict' }),
}, (table) => [
   unique().on(table.slug, table.langId)
])

export const postsStatusList = ['hidden', 'deleted', 'published'] as const
export type PostStatus = typeof postsStatusList[number]
export type Post = typeof postsTable.$inferSelect
export type PostList = Array<
   Pick<Post, 'id' | 'slug' | 'title' | 'thumbnail' | 'createdAt'> & {
      lang: Lang | null
      category: Category | null
   }
>
export type NewPost = typeof postsTable.$inferInsert

export const postsRelations = relations(postsTable, ({ one }) => ({
   lang: one(langsTable, {
      fields: [postsTable.langId],
      references: [langsTable.id]
   }),
   category: one(categoriesTable, {
      fields: [postsTable.categoryId],
      references: [categoriesTable.id]
   })
}))



export const categoriesTable = pgTable('categories', {
   id: serial('id').primaryKey(),
   slug: varchar('slug', { length: 256 }).notNull(),
   nameRu: varchar('name_ru', { length: 256 }).notNull(),
   nameEn: varchar('name_en', { length: 256 }),
})

export type Category = typeof categoriesTable.$inferSelect
export type NewCategory = typeof categoriesTable.$inferInsert

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
   posts: many(postsTable),
}))



export const projectsTable = pgTable('projects', {
   id: serial('id').primaryKey(),
   slug: varchar('slug', { length: 256 }).notNull().unique(),
   title: varchar('title', { length: 256 }).notNull(),
   description: varchar('description', { length: 256 }),
   content: json('content').$type<OutputData>(),
   usage: json('usage').$type<ImageJSON[]>(),
   sketches: json('sketches').$type<ImageJSON[]>(),
   thumbnail: json('thumbnail').$type<ImageJSON>(),
   video: varchar('video', { length: 256 }),
   status: varchar('status', { length: 256 }).$type<ProjectStatus>().notNull().default('published'),
   editedAt: timestamp('edited_at').defaultNow().notNull(),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   seoKeys: varchar('seo_keys', { length: 256 }),
   ogImage: varchar('og_image', { length: 256 }),
   langId: integer('lang_id').references(() => langsTable.id).notNull().default(1),
   langGroup: integer('lang_group').references((): AnyPgColumn => projectsTable.id, { onDelete: 'restrict' }),
}, (table) => [
   unique().on(table.slug, table.langId)
])
// Похожие

export const projectsStatusList = ['hidden', 'deleted', 'published'] as const
export type ProjectStatus = typeof projectsStatusList[number]
export type Project = typeof projectsTable.$inferSelect
export type NewProject = typeof projectsTable.$inferInsert
export type ProjectList = Array<
   Pick<Project, 'id' | 'slug' | 'title' | 'description' | 'thumbnail' | 'createdAt'> & {
      lang: Lang | null
   }
>

export const projectsRelations = relations(projectsTable, ({ one }) => ({
   lang: one(langsTable, {
      fields: [projectsTable.langId],
      references: [langsTable.id]
   }),
}))



export const galleriesTable = pgTable('galleries', {
   id: serial('id').primaryKey(),
   name: varchar('name', { length: 256 }).notNull().unique(),
})

export type Gallery = typeof galleriesTable.$inferSelect
export type NewGallery = typeof galleriesTable.$inferInsert

export const galleryCategoriesTable = pgTable('gallery_categories', {
   id: serial('id').primaryKey(),
   name: varchar('name', { length: 256 }).notNull(),
   galleryId: serial('gallery_id').references(() => galleriesTable.id),
}, (table) => [
   unique().on(table.name, table.galleryId)
])

export type GalleryCategory = typeof galleryCategoriesTable.$inferSelect
export type NewGalleryCategory = typeof galleryCategoriesTable.$inferInsert

export const galleryCategoriesRelations = relations(galleryCategoriesTable, ({ one }) => ({
   gallery: one(galleriesTable, {
      fields: [galleryCategoriesTable.galleryId],
      references: [galleriesTable.id]
   }),
}))

export const galleryItemsTable = pgTable('gallery_items', {
   id: serial('id').primaryKey(),
   image: varchar('image', { length: 256 }),
   title: varchar('title', { length: 256 }),
   altEn: varchar('alt_en', { length: 256 }),
   altRu: varchar('alt_ru', { length: 256 }),
   order: integer('order'),
   categoryId: serial('category_id').references(() => galleryCategoriesTable.id).notNull(),
}, (table) => [
   unique().on(table.order, table.categoryId),
   unique().on(table.image, table.categoryId)
])

export type GalleryItem = typeof galleryItemsTable.$inferSelect
export type NewGalleryItem = typeof galleryItemsTable.$inferInsert

export const galleryItemsRelations = relations(galleryItemsTable, ({ one }) => ({
   category: one(galleryCategoriesTable, {
      fields: [galleryItemsTable.categoryId],
      references: [galleryCategoriesTable.id]
   }),
}))

// ### Видео
// Отдельная страница с видео