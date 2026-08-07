-- iMDb CMS: Full schema with movies table + storage
-- Run this in Supabase SQL Editor to set up your database

-- 1. Drop old tables if re-creating
DROP TABLE IF EXISTS recently_viewed CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS watchlist CASCADE;

-- 2. Movies table (replaces mock data)
CREATE TABLE IF NOT EXISTS movies (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER,
  runtime TEXT,
  genres TEXT[] DEFAULT '{}',
  rating REAL DEFAULT 0,
  votes INTEGER DEFAULT 0,
  plot TEXT DEFAULT '',
  poster_url TEXT DEFAULT '',
  backdrop_url TEXT DEFAULT '',
  director TEXT DEFAULT '',
  writers TEXT[] DEFAULT '{}',
  cast_data JSONB DEFAULT '[]',
  trailer TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  is_series BOOLEAN DEFAULT false,
  streaming_on TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view movies" ON movies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert" ON movies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update" ON movies
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete" ON movies
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Recently viewed table
CREATE TABLE IF NOT EXISTS recently_viewed (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recently viewed" ON recently_viewed
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recently viewed" ON recently_viewed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_movies_featured ON movies(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id);
