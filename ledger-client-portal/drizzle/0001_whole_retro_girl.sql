CREATE TABLE `portal_connections` (
	`account_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`auth_config_id` text NOT NULL,
	`connected_account_id` text,
	`status` text NOT NULL,
	`redirect_url` text,
	`expires_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`last_checked_at` text
);
--> statement-breakpoint
CREATE TABLE `portal_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`item_id` text NOT NULL,
	`sender` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `portal_files` ADD `request_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `portal_files_account_period_sha_unique` ON `portal_files` (`account_id`,`period`,`sha256`);
--> statement-breakpoint
CREATE TRIGGER portal_messages_no_update BEFORE UPDATE ON portal_messages BEGIN SELECT RAISE(ABORT, 'Messages are append-only'); END;
--> statement-breakpoint
CREATE TRIGGER portal_messages_no_delete BEFORE DELETE ON portal_messages BEGIN SELECT RAISE(ABORT, 'Messages are append-only'); END;
