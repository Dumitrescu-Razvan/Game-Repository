-- This file should undo anything in `up.sql`
ALTER TABLE games DROP COLUMN added_by;
ALTER TABLE companies DROP COLUMN added_by;