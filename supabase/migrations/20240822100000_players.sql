-- Fase 3: anonymous player accounts (no PII)
-- Run via: supabase db push (after supabase link)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  display_name_normalized TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_progress (
  player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  progress_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  progress_version INT NOT NULL DEFAULT 3,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_prefs (
  player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  class_level TEXT,
  adventure_id TEXT NOT NULL DEFAULT 'part1',
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_players_last_seen ON players(last_seen_at DESC);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_prefs ENABLE ROW LEVEL SECURITY;

-- API uses service role; no public policies for MVP
