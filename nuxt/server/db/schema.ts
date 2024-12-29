import { pgTable, text, varchar, integer, timestamp, serial, json, primaryKey, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { OutputData } from '@editorjs/editorjs';

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

// ### Блог
// Заголовок
// Редактор
// Галерея
// Превью
// Кнопки (возможно) (в конце)
// Категории
// Поиск
// Дата создания (редактируемая)
// Мета теги отдельные
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