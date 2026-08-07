-- iMDb Clone Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  year INTEGER,
  poster TEXT,
  rating REAL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/edit their own watchlist
CREATE POLICY "Users can view own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ratings" ON ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ratings" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Recently viewed table
CREATE TABLE IF NOT EXISTS recently_viewed (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('movie', 'person')),
  title TEXT NOT NULL,
  poster TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recently viewed" ON recently_viewed
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recently viewed" ON recently_viewed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id);
