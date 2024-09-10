-- SCHEMA: user_account

-- DROP SCHEMA IF EXISTS user_account ;

CREATE SCHEMA IF NOT EXISTS user_account
    AUTHORIZATION myuser;

-- Table: user_account.user_account

-- DROP TABLE IF EXISTS user_account.user_account;

CREATE TABLE IF NOT EXISTS user_account.user_account
(
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    icon_name character varying COLLATE pg_catalog."default" NOT NULL,
    preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT user_account_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS user_account.user_account
    OWNER to myuser;

-- Table: user_account.auth

-- DROP TABLE IF EXISTS user_account.auth;

CREATE TABLE IF NOT EXISTS user_account.auth
(
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    username character varying(25) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(72) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT auth_pkey PRIMARY KEY (id),
    CONSTRAINT auth_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS user_account.auth
    OWNER to myuser;