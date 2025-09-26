-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.competitions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type = ANY (ARRAY['league'::text, 'cup'::text])),
  nation_id uuid,
  number_of_teams integer,
  CONSTRAINT competitions_pkey PRIMARY KEY (id),
  CONSTRAINT competitions_nation_id_fkey FOREIGN KEY (nation_id) REFERENCES public.nations(id)
);
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  season_id uuid,
  competition_id uuid,
  date timestamp with time zone NOT NULL,
  home_team_id uuid,
  away_team_id uuid,
  home_score integer NOT NULL,
  away_score integer NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  team_id uuid,
  opponent_team_id uuid,
  match_date date,
  is_home_match boolean,
  stadium text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id),
  CONSTRAINT matches_competition_id_fkey FOREIGN KEY (competition_id) REFERENCES public.competitions(id),
  CONSTRAINT matches_home_team_id_fkey FOREIGN KEY (home_team_id) REFERENCES public.teams(id),
  CONSTRAINT matches_away_team_id_fkey FOREIGN KEY (away_team_id) REFERENCES public.teams(id),
  CONSTRAINT matches_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT matches_opponent_team_id_fkey FOREIGN KEY (opponent_team_id) REFERENCES public.teams(id)
);
CREATE TABLE public.nations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  flag_url text,
  CONSTRAINT nations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.player_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid,
  player_id uuid,
  team_id uuid,
  goals integer DEFAULT 0,
  assists integer DEFAULT 0,
  yellow_cards integer DEFAULT 0,
  red_cards integer DEFAULT 0,
  minutes_played integer,
  rating numeric,
  CONSTRAINT player_stats_pkey PRIMARY KEY (id),
  CONSTRAINT player_stats_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id),
  CONSTRAINT player_stats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);
CREATE TABLE public.seasons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  start_year integer NOT NULL,
  end_year integer NOT NULL,
  club_id uuid,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT seasons_pkey PRIMARY KEY (id),
  CONSTRAINT seasons_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.teams(id)
);
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  nation_id uuid,
  is_national_team boolean NOT NULL DEFAULT false,
  CONSTRAINT teams_pkey PRIMARY KEY (id),
  CONSTRAINT teams_nation_id_fkey FOREIGN KEY (nation_id) REFERENCES public.nations(id)
);
CREATE TABLE public.trophies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL,
  competition_id uuid,
  team_id uuid,
  is_individual boolean DEFAULT false,
  trophy_type text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trophies_pkey PRIMARY KEY (id),
  CONSTRAINT trophies_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id),
  CONSTRAINT trophies_competition_id_fkey FOREIGN KEY (competition_id) REFERENCES public.competitions(id),
  CONSTRAINT trophies_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);