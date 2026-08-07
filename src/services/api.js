import movies from '../data/movies';
import people from '../data/people';
import news from '../data/news';
import { genres } from '../data/genres';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomDelay = () => delay(300 + Math.random() * 500);

export async function fetchMovies({ genre, category, limit } = {}) {
  await randomDelay();
  let results = [...movies];
  if (genre) results = results.filter(m => m.genres.includes(genre));
  if (category === 'series') results = results.filter(m => m.isSeries);
  if (category === 'movies') results = results.filter(m => !m.isSeries);
  if (limit) results = results.slice(0, limit);
  return results;
}

export async function fetchMovieById(id) {
  await randomDelay();
  return movies.find(m => m.id === Number(id)) || null;
}

export async function fetchFeaturedMovie() {
  await randomDelay();
  return movies.find(m => m.isFeatured) || movies[0];
}

export async function fetchTop10() {
  await randomDelay();
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
}

export async function fetchFanFavorites() {
  await randomDelay();
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6);
}

export async function fetchBoxOffice() {
  await randomDelay();
  return [...movies].sort((a, b) => b.votes - a.votes).slice(0, 5);
}

export async function fetchComingSoon() {
  await randomDelay();
  return movies.filter(m => m.year >= 2026).slice(0, 6).map(m => ({
    ...m,
    releaseDate: `Aug ${15 + Math.floor(Math.random() * 30)}`,
  }));
}

export async function fetchPeople() {
  await randomDelay();
  return people;
}

export async function fetchPersonById(id) {
  await randomDelay();
  return people.find(p => p.id === Number(id)) || null;
}

export async function fetchTrendingPeople() {
  await randomDelay();
  return people.slice(0, 10);
}

export async function fetchBornToday() {
  await randomDelay();
  return people.filter(p => p.birthDate.includes('August 7')).slice(0, 8);
}

export async function fetchNews({ limit } = {}) {
  await randomDelay();
  return limit ? news.slice(0, limit) : news;
}

export async function fetchGenres() {
  await randomDelay();
  return genres;
}

export async function searchMovies(query) {
  await randomDelay();
  const q = query.toLowerCase();
  return movies.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.genres.some(g => g.toLowerCase().includes(q)) ||
    (m.director && m.director.toLowerCase().includes(q)) ||
    m.cast.some(c => c.name.toLowerCase().includes(q))
  );
}

export async function searchPeople(query) {
  await randomDelay();
  const q = query.toLowerCase();
  return people.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.bio.toLowerCase().includes(q)
  );
}
