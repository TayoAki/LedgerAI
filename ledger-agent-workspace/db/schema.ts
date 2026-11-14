import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const workspace = sqliteTable('workspace', {id:text('id').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(0)});
export const workspaceMeta = sqliteTable('workspace_meta', {id:text('id').primaryKey(),revision:integer('revision').notNull().default(0),token:text('token').notNull(),payload:text('payload').notNull()});
export const workspaceRecords = sqliteTable('workspace_records', {key:text('key').primaryKey(),kind:text('kind').notNull(),payload:text('payload').notNull()});
export const portalIntakes=sqliteTable('portal_intakes',{id:text('id').primaryKey(),payload:text('payload').notNull(),binding:text('binding').notNull().default('{}'),synced_at:text('synced_at').notNull()});
