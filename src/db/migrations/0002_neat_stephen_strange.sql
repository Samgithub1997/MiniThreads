CREATE TABLE "followers-followee" (
	"follower_id" bigint NOT NULL,
	"followee_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "followers-followee_follower_id_followee_id_pk" PRIMARY KEY("follower_id","followee_id")
);
--> statement-breakpoint
ALTER TABLE "followers-followee" ADD CONSTRAINT "followers-followee_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers-followee" ADD CONSTRAINT "followers-followee_followee_id_users_id_fk" FOREIGN KEY ("followee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "follower_idx" ON "followers-followee" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "followee_idx" ON "followers-followee" USING btree ("followee_id");