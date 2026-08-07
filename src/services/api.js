import { supabase } from './supabase';

// ============ MOVIES (from Supabase) ============

export async function fetchMovies({ genre, category, limit } = {}) {
  let query = supabase.from('movies').select('*').order('created_at', { ascending: false });
  if (genre) query = query.contains('genres', [genre]);
  if (category === 'series') query = query.eq('is_series', true);
  if (category === 'movies') query = query.eq('is_series', false);
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) { console.error('fetchMovies error:', error); return []; }
  return data || [];
}

export async function fetchMovieById(id) {
  const { data, error } = await supabase.from('movies').select('*').eq('id', id).single();
  if (error) { console.error('fetchMovieById error:', error); return null; }
  return data;
}

export async function fetchFeaturedMovie() {
  const { data } = await supabase.from('movies').select('*').eq('is_featured', true).limit(1).single();
  if (!data) {
    const { data: fallback } = await supabase.from('movies').select('*').limit(1).single();
    return fallback;
  }
  return data;
}

export async function fetchTop10() {
  const { data } = await supabase.from('movies').select('*').order('rating', { ascending: false }).limit(10);
  return data || [];
}

export async function fetchFanFavorites() {
  const { data } = await supabase.from('movies').select('*').order('rating', { ascending: false }).limit(6);
  return data || [];
}

export async function fetchBoxOffice() {
  const { data } = await supabase.from('movies').select('*').order('votes', { ascending: false }).limit(5);
  return data || [];
}

export async function fetchComingSoon() {
  const { data } = await supabase.from('movies').select('*').gte('year', 2026).limit(6);
  return (data || []).map(m => ({ ...m, releaseDate: `Aug ${15 + Math.floor(Math.random() * 30)}` }));
}

export async function searchMovies(query) {
  const q = `%${query}%`;
  const { data } = await supabase.from('movies').select('*').or(`title.ilike.${q},director.ilike.${q}`);
  return data || [];
}

// ============ CMS: Admin CRUD ============

export async function createMovie(movie) {
  const { data, error } = await supabase.from('movies').insert(movie).select().single();
  if (error) throw error;
  return data;
}

export async function updateMovie(id, updates) {
  const { data, error } = await supabase.from('movies').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMovie(id) {
  const { error } = await supabase.from('movies').delete().eq('id', id);
  if (error) throw error;
}

// ============ STORAGE ============

export async function uploadMovieImage(file, folder = 'posters') {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { data, error } = await supabase.storage.from('movie-images').upload(`${folder}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('movie-images').getPublicUrl(`${folder}/${fileName}`);
  return urlData.publicUrl;
}

// ============ PEOPLE (mock fallback) ============

import people from '../data/people';

export async function fetchPersonById(id) {
  return people.find(p => p.id === Number(id)) || null;
}

export async function fetchTrendingPeople() {
  return people.slice(0, 10);
}

export async function fetchBornToday() {
  return people.filter(p => p.birthDate.includes('August 7')).slice(0, 8);
}

export async function searchPeople(query) {
  const q = query.toLowerCase();
  return people.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.bio.toLowerCase().includes(q)
  );
}

// ============ NEWS (mock fallback) ============

import news from '../data/news';

export async function fetchNewsData({ limit } = {}) {
  return limit ? news.slice(0, limit) : news;
}

// ============ GENRES ============

import { genres } from '../data/genres';
export async function fetchGenres() { return genres; }

// ============ WATCHLIST (Supabase) ============

export async function fetchWatchlist(userId) {
  const { data } = await supabase.from('watchlist').select('movie_id, movies(*)').eq('user_id', userId);
  return (data || []).map(row => row.movies).filter(Boolean);
}

export async function addToWatchlistDB(userId, movieId) {
  const { error } = await supabase.from('watchlist').insert({ user_id: userId, movie_id: movieId });
  if (error && error.code !== '23505') throw error;
}

export async function removeFromWatchlistDB(userId, movieId) {
  const { error } = await supabase.from('watchlist').delete().eq('user_id', userId).eq('movie_id', movieId);
  if (error) throw error;
}

// ============ RECENTLY VIEWED (Supabase) ============

export async function fetchRecentlyViewed(userId) {
  const { data } = await supabase.from('recently_viewed').select('movie_id, movies(*)').eq('user_id', userId).order('viewed_at', { ascending: false }).limit(20);
  return (data || []).map(row => row.movies).filter(Boolean);
}

export async function addRecentlyViewed(userId, movieId) {
  const { error } = await supabase.from('recently_viewed').upsert(
    { user_id: userId, movie_id: movieId, viewed_at: new Date().toISOString() },
    { onConflict: 'user_id,movie_id' }
  );
  if (error) console.error('addRecentlyViewed:', error);
}
