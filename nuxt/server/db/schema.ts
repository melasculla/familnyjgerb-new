import { pgTable, text, varchar, integer, timestamp, serial, json, primaryKey, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { OutputData } from '@editorjs/editorjs';

export const usersTable = pgTable('users', {
   id: serial('id').primaryKey(),
   name: varchar('name', { length: 256 }).notNull(),
   email: varchar('email', { length: 256 }).notNull(),
   role: varchar('role', { length: 20 }).$type<Roles>().notNull().default('user'),
   uid: varchar('uid').notNull().unique(),
   nickname: varchar('nickname', { length: 256 }),
   location: text('location'),
   website: varchar('website', { length: 256 }),
})

export type Roles = 'user' | 'client' | 'admin'
export const rolesList: Roles[] = ['user', 'client']
export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert
export type UserColumns = typeof usersTable._.columns
export type UserSession = Omit<User, 'password'>