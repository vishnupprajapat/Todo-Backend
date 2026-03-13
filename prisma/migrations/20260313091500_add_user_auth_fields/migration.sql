-- Backfill nullable emails before making the column required.
UPDATE "User"
SET "email" = CONCAT('user-', "id", '@example.local')
WHERE "email" IS NULL;

-- Add hashed password storage.
ALTER TABLE "User"
ADD COLUMN "password" TEXT;

-- Existing users will need to reset password for real login usage.
UPDATE "User"
SET "password" = 'legacy-user-no-password'
WHERE "password" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
