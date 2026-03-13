-- Move completed status from User to Todo.
ALTER TABLE "Todo"
ADD COLUMN "completed" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "User"
DROP COLUMN "completed";
