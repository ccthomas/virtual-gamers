CREATE SCHEMA IF NOT EXISTS user_account;

CREATE TABLE user_account.user_account (
  id VARCHAR(36) PRIMARY KEY,
  icon_name VARCHAR NOT NULL,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE user_account.auth (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  password_hash VARCHAR(72) NOT NULL,
  UNIQUE(username)
);