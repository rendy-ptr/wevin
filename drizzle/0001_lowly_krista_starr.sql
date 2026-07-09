ALTER TABLE "invitation_rsvps" DROP CONSTRAINT "invitation_rsvps_invitation_guest_id_invitation_guests_id_fk";
--> statement-breakpoint
ALTER TABLE "invitation_guests" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "invitation_guests" ALTER COLUMN "status" SET DEFAULT 'idle'::text;--> statement-breakpoint
DROP TYPE "public"."invitation_guest_status";--> statement-breakpoint
CREATE TYPE "public"."invitation_guest_status" AS ENUM('idle', 'delivered', 'opened', 'responded');--> statement-breakpoint
ALTER TABLE "invitation_guests" ALTER COLUMN "status" SET DEFAULT 'idle'::"public"."invitation_guest_status";--> statement-breakpoint
ALTER TABLE "invitation_guests" ALTER COLUMN "status" SET DATA TYPE "public"."invitation_guest_status" USING "status"::"public"."invitation_guest_status";--> statement-breakpoint
ALTER TABLE "invitation_rsvps" ALTER COLUMN "invitation_guest_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invitation_rsvps" ADD CONSTRAINT "invitation_rsvps_invitation_guest_id_invitation_guests_id_fk" FOREIGN KEY ("invitation_guest_id") REFERENCES "public"."invitation_guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation_rsvps" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "invitation_rsvps" ADD CONSTRAINT "invitation_rsvps_invitation_guest_id_unique" UNIQUE("invitation_guest_id");