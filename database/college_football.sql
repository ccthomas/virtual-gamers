-- SCHEMA: college_football

-- DROP SCHEMA IF EXISTS college_football ;

CREATE SCHEMA IF NOT EXISTS college_football

-- Table: college_football.team

-- DROP TABLE IF EXISTS college_football.team;

CREATE TABLE IF NOT EXISTS college_football.team
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    uid character varying COLLATE pg_catalog."default",
    slug character varying COLLATE pg_catalog."default",
    abbreviation character varying COLLATE pg_catalog."default",
    display_name character varying COLLATE pg_catalog."default",
    short_display_name character varying COLLATE pg_catalog."default",
    name character varying COLLATE pg_catalog."default",
    nickname character varying COLLATE pg_catalog."default",
    location character varying COLLATE pg_catalog."default",
    color character varying COLLATE pg_catalog."default",
    alternate_color character varying COLLATE pg_catalog."default",
    is_active boolean,
    is_all_star boolean,
    logos jsonb DEFAULT '[]'::jsonb,
    links jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT team_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS college_football.team
    OWNER to myuser;
-- Index: index_team_on_id

-- DROP INDEX IF EXISTS college_football.index_team_on_id;

CREATE UNIQUE INDEX IF NOT EXISTS index_team_on_id
    ON college_football.team USING btree
    (id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: college_football.athlete

-- DROP TABLE IF EXISTS college_football.athlete;

CREATE TABLE IF NOT EXISTS college_football.athlete
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    uid character varying COLLATE pg_catalog."default",
    guid uuid,
    alternate_ids jsonb,
    first_name character varying COLLATE pg_catalog."default",
    last_name character varying COLLATE pg_catalog."default",
    full_name character varying COLLATE pg_catalog."default",
    display_name character varying COLLATE pg_catalog."default",
    short_name character varying COLLATE pg_catalog."default",
    weight double precision,
    display_weight character varying COLLATE pg_catalog."default",
    height double precision,
    display_height character varying COLLATE pg_catalog."default",
    links jsonb,
    birth_place jsonb,
    birth_country jsonb,
    college jsonb,
    slug character varying COLLATE pg_catalog."default",
    headshot jsonb,
    jersey character varying COLLATE pg_catalog."default",
    flag jsonb,
    "position" jsonb,
    injuries jsonb,
    teams jsonb,
    experience jsonb,
    status jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    team_id character varying(36) COLLATE pg_catalog."default",
    position_name character varying COLLATE pg_catalog."default",
    CONSTRAINT athlete_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS college_football.athlete
    OWNER to myuser;
-- Index: idx_athletes_full_name

-- DROP INDEX IF EXISTS college_football.idx_athletes_full_name;

CREATE INDEX IF NOT EXISTS idx_athletes_full_name
    ON college_football.athlete USING btree
    (full_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_athletes_position

-- DROP INDEX IF EXISTS college_football.idx_athletes_position;

CREATE INDEX IF NOT EXISTS idx_athletes_position
    ON college_football.athlete USING btree
    (position_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_athletes_team

-- DROP INDEX IF EXISTS college_football.idx_athletes_team;

CREATE INDEX IF NOT EXISTS idx_athletes_team
    ON college_football.athlete USING btree
    (team_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: college_football.event

-- DROP TABLE IF EXISTS college_football.event;

CREATE TABLE IF NOT EXISTS college_football.event
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    year numeric,
    week numeric,
    date timestamp with time zone,
    name character varying COLLATE pg_catalog."default",
    short_name character varying COLLATE pg_catalog."default",
    home_id character varying COLLATE pg_catalog."default",
    away_id character varying COLLATE pg_catalog."default",
    weather character varying COLLATE pg_catalog."default",
    completed boolean,
    is_processed boolean DEFAULT false,
    CONSTRAINT event_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS college_football.event
    OWNER to myuser;

-- Table: college_football.event_summary

-- DROP TABLE IF EXISTS college_football.event_summary;

CREATE TABLE IF NOT EXISTS college_football.event_summary
(
    event_id character varying COLLATE pg_catalog."default",
    external_id varchar, -- PK ID for team or id.
    type character varying(20) COLLATE pg_catalog."default", -- TEAM | ATHLETE
    passing_yards numeric,
    passing_touchdowns numeric,
    interceptions_thrown numeric,
    rushing_yards numeric,
    rushing_touchdowns numeric,
    receptions numeric,
    receptions_receiving_yards numeric,
    receiving_touchdowns numeric,
    fumbles numeric,
    fumbles_lost numeric,
    fumbles_recovered numeric,
    solo_tackles numeric,
    sacks numeric,
    tackle_for_loss numeric,
    defencive_touchdowns numeric,
    interceptions numeric,
    interception_yards numeric,
    interception_touchdowns numeric,
    kick_return_yards numeric,
    kick_return_touchdowns numeric,
    punt_return_yards numeric,
    punt_return_touchdowns numeric,
    field_goal numeric,
    extra_point numeric,
    points_allowed numeric
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS college_football.event_summary
    OWNER to myuser;