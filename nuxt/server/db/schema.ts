import { pgTable, text, varchar, integer, timestamp, serial, json, primaryKey, boolean } from 'drizzle-orm/pg-core';
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



export const postsTable = pgTable('posts', {
   id: serial('id').primaryKey(),
   slug: varchar('slug', { length: 256 }).notNull().unique(),
   title: varchar('title', { length: 256 }).notNull(),
   content: json('content').$type<OutputData>(),
   gallery: json('gallery').$type<ImageJSON[]>(),
   thumbnail: json('thumbnail').$type<ImageJSON>(),
   status: varchar('status', { length: 256 }).$type<PostStatus>().notNull().default('published'),
   plannedAt: timestamp('planned_at'),
   editedAt: timestamp('edited_at').defaultNow().notNull(),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   seoTitle: varchar('seo_title', { length: 256 }).notNull(),
   seoDescription: varchar('seo_description', { length: 256 }),
   seoKeys: varchar('seo_keys', { length: 256 }),
})

export const postStatusList = ['hidden', 'deleted', 'published'] as const
export type PostStatus = typeof postStatusList[number]



export const categoriesTable = pgTable('categories', {
   id: serial('id').primaryKey(),
   name: varchar('name', { length: 256 }).notNull().unique(),
})


// ### Блог
// Заголовок
// Редактор = Кнопки (возможно) (в конце)
// Галерея
// Превью
// Категории
// Дата создания (редактируемая)
// Мета теги отдельные

// Поиск
// Похожие

// ### Галерея 
// Гербы 3 категории 
// Монограммы 4 категории

// ### Проекты
// Заголовок
// Превью
// Применение
// Эскизы 
// Видео отдельно
// След предыдущие
// Похожие

// ### Видео
// Отдельная страница с видео