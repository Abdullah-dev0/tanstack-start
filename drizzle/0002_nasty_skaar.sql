ALTER TABLE "notes" DROP CONSTRAINT "notes_user_id_users_id_fk";--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;
