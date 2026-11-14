CREATE TABLE `portal_intakes` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`binding` text DEFAULT '{}' NOT NULL,
	`synced_at` text NOT NULL
);
