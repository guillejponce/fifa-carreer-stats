-- ⚽ FIFA Career Stats - Database Schema
-- Este script crea todas las tablas según el esquema definido en SCHEMA.md

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla nations
CREATE TABLE IF NOT EXISTS nations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL
);

-- 2. Tabla teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_national_team BOOLEAN NOT NULL DEFAULT false,
    nation_id UUID REFERENCES nations(id)
);

-- 3. Tabla competitions
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('liga', 'copa', 'continental', 'internacional', 'amistoso')),
    level TEXT NOT NULL CHECK (level IN ('club', 'selección')),
    nation_id UUID REFERENCES nations(id)
);

-- 4. Tabla seasons
CREATE TABLE IF NOT EXISTS seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    club_id UUID REFERENCES teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla matches
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    competition_id UUID NOT NULL REFERENCES competitions(id),
    home_team_id UUID NOT NULL REFERENCES teams(id),
    away_team_id UUID NOT NULL REFERENCES teams(id),
    is_home BOOLEAN NOT NULL DEFAULT true,
    is_national_team BOOLEAN NOT NULL DEFAULT false,
    result TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla player_stats
CREATE TABLE IF NOT EXISTS player_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    goals INTEGER NOT NULL DEFAULT 0,
    assists INTEGER NOT NULL DEFAULT 0,
    yellow_cards INTEGER NOT NULL DEFAULT 0,
    red_cards INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3,1) DEFAULT 0.0,
    minutes_played INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_teams_nation_id ON teams(nation_id);
CREATE INDEX IF NOT EXISTS idx_competitions_nation_id ON competitions(nation_id);
CREATE INDEX IF NOT EXISTS idx_seasons_club_id ON seasons(club_id);
CREATE INDEX IF NOT EXISTS idx_matches_season_id ON matches(season_id);
CREATE INDEX IF NOT EXISTS idx_matches_competition_id ON matches(competition_id);
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_match_id ON player_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);

-- Insertar algunas naciones por defecto
INSERT INTO nations (name) VALUES 
    ('España'),
    ('Inglaterra'),
    ('Francia'),
    ('Alemania'),
    ('Italia'),
    ('Brasil'),
    ('Argentina'),
    ('Países Bajos'),
    ('Portugal'),
    ('Bélgica')
ON CONFLICT (name) DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE nations IS 'Países para clubes y selecciones nacionales';
COMMENT ON TABLE teams IS 'Clubes y selecciones nacionales';
COMMENT ON TABLE competitions IS 'Competiciones: ligas, copas, torneos continentales e internacionales';
COMMENT ON TABLE seasons IS 'Temporadas del jugador';
COMMENT ON TABLE matches IS 'Partidos jugados por el jugador';
COMMENT ON TABLE player_stats IS 'Rendimiento del jugador en cada partido'; 