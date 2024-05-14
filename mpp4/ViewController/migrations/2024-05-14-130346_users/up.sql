-- Your SQL goes here
CREATE TABLE  users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(255) NOT NULL
);