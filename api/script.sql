CREATE TABLE "users" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL
);