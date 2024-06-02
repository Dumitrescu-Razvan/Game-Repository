-- Your SQL goes here
ALTER TABLE games ADD COLUMN added_by INT REFERENCES users (id);
ALTER TABLE companies ADD COLUMN added_by INT REFERENCES users (id);