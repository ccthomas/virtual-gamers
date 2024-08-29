-- Create schema if it does not exist
CREATE SCHEMA IF NOT EXISTS college_football;

-- Create table if it does not exist
CREATE TABLE IF NOT EXISTS college_football.team (
    id VARCHAR PRIMARY KEY,
    uid VARCHAR,
    slug VARCHAR,
    abbreviation VARCHAR,
    display_name VARCHAR,
    short_display_name VARCHAR,
    name VARCHAR,
    nickname VARCHAR,
    location VARCHAR,
    color VARCHAR,
    alternate_color VARCHAR,
    is_active BOOLEAN,
    is_all_star BOOLEAN,
    logos JSONB DEFAULT '[]',
    links JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS college_football.athlete (
    id VARCHAR PRIMARY KEY,
    uid VARCHAR,
    guid UUID,
    alternate_ids JSONB,
    first_name VARCHAR,
    last_name VARCHAR,
    full_name VARCHAR,
    display_name VARCHAR,
    short_name VARCHAR,
    weight FLOAT,
    display_weight VARCHAR,
    height FLOAT,
    display_height VARCHAR,
    links JSONB,
    birth_place JSONB,
    birth_country JSONB,
    college JSONB,
    slug VARCHAR,
	headshot JSONB,
    jersey VARCHAR,
    flag JSONB,
    position JSONB,
    injuries JSONB,
    teams JSONB,
    experience JSONB,
    status JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
