CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  wpm VARCHAR(255)
);

CREATE TABLE stats (
  user_id SERIAL PRIMARY KEY NOT NULL,
  wpm VARCHAR(255),
  passage_id VARCHAR(255) NOT NULL
);

CREATE TABLE passages (
  id SERIAL PRIMARY KEY NOT NULL,
  string text NOT NULL
);

CREATE TABLE wpm (
  user_id SERIAL PRIMARY KEY NOT NULL,
  string text NOT NULL
);