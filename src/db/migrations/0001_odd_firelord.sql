ALTER TABLE "usersTable" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "usersTable_username_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");