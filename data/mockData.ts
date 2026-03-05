import { Movie, TrendingMovie, MovieDetail } from "@/types/movie";

// Placeholder poster images (replace with API data)
const PLACEHOLDER = (i: number) =>
  `https://placehold.co/300x450/141d33/8892b0?text=Movie+${i}`;

const BACKDROP = (i: number) =>
  `https://placehold.co/1280x520/0d1526/2d3a5a?text=Backdrop+${i}`;

const AVATAR = (i: number) =>
  `https://placehold.co/120x120/1c2840/8892b0?text=Actor+${i}`;

export const TRENDING_MOVIES: TrendingMovie[] = [
  { id: 1, rank: 1, title: "Dune: Part Two", poster: PLACEHOLDER(1), rating: 8.8, year: 2024, language: "EN" },
  { id: 2, rank: 2, title: "Oppenheimer", poster: PLACEHOLDER(2), rating: 8.9, year: 2023, language: "EN" },
  { id: 3, rank: 3, title: "Poor Things", poster: PLACEHOLDER(3), rating: 8.1, year: 2023, language: "EN" },
  { id: 4, rank: 4, title: "The Zone of Interest", poster: PLACEHOLDER(4), rating: 7.4, year: 2023, language: "EN" },
  { id: 5, rank: 5, title: "Anatomy of a Fall", poster: PLACEHOLDER(5), rating: 7.7, year: 2023, language: "FR" },
];

export const ALL_MOVIES: Movie[] = [
  { id: 6,  title: "Killers of the Flower Moon", poster: PLACEHOLDER(6),  rating: 7.7, year: 2023, language: "EN" },
  { id: 7,  title: "Past Lives",                 poster: PLACEHOLDER(7),  rating: 7.9, year: 2023, language: "EN" },
  { id: 8,  title: "The Holdovers",              poster: PLACEHOLDER(8),  rating: 7.9, year: 2023, language: "EN" },
  { id: 9,  title: "Maestro",                    poster: PLACEHOLDER(9),  rating: 6.8, year: 2023, language: "EN" },
  { id: 10, title: "May December",               poster: PLACEHOLDER(10), rating: 7.1, year: 2023, language: "EN" },
  { id: 11, title: "American Fiction",           poster: PLACEHOLDER(11), rating: 7.5, year: 2023, language: "EN" },
  { id: 12, title: "Society of the Snow",        poster: PLACEHOLDER(12), rating: 7.8, year: 2023, language: "ES" },
  { id: 13, title: "Io Capitano",                poster: PLACEHOLDER(13), rating: 7.3, year: 2023, language: "IT" },
  { id: 14, title: "The Boy and the Heron",      poster: PLACEHOLDER(14), rating: 7.7, year: 2023, language: "JP" },
  { id: 15, title: "Robot Dreams",               poster: PLACEHOLDER(15), rating: 8.0, year: 2023, language: "ES" },
  { id: 16, title: "Four Daughters",             poster: PLACEHOLDER(16), rating: 7.9, year: 2023, language: "FR" },
  { id: 17, title: "20 Days in Mariupol",        poster: PLACEHOLDER(17), rating: 8.3, year: 2023, language: "UK" },
];

export const HERO_POSTERS = [
  PLACEHOLDER(100),
  PLACEHOLDER(101),
  PLACEHOLDER(102),
];

// Movie detail mock — used for /movie/[id]
export function getMovieDetail(id: number): MovieDetail {
  const base = [...TRENDING_MOVIES, ...ALL_MOVIES].find((m) => m.id === id);

  return {
    id: base?.id ?? id,
    title: base?.title ?? "Untitled Movie",
    originalTitle: "Original Title",
    poster: base?.poster ?? PLACEHOLDER(id),
    backdrop: BACKDROP(id),
    rating: base?.rating ?? 7.5,
    year: base?.year ?? 2024,
    language: base?.language ?? "EN",
    genre: base?.genre ?? ["Action", "Sci-Fi", "Drama"],
    synopsis:
      "In a world of extraordinary events, a group of unlikely heroes must come together to face an unprecedented threat. Through courage, sacrifice, and the bonds of friendship, they discover that the greatest power lies within. As ancient prophecies unfold and hidden truths are revealed, the fate of civilization hangs in the balance. With breathtaking visuals and a story that transcends time, this epic adventure will keep audiences on the edge of their seats from start to finish.",
    duration: "2h 35m",
    country: "United States",
    status: "Completed",
    quality: "FHD",
    imdbRating: base?.rating ?? 7.5,
    totalEpisodes: 1,
    currentEpisodes: 1,
    seasons: 1,
    tags: [base?.title ?? "Movie", "2024", "Action"],
    cast: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Actor ${i + 1}`,
      avatar: AVATAR(i + 1),
      role: `Character ${i + 1}`,
    })),
    episodes: Array.from({ length: 1 }, (_, i) => ({
      number: i + 1,
      title: `Full Movie`,
      isCurrent: i === 0,
    })),
  };
}

// Series detail mock (multi-episode)
export function getSeriesDetail(id: number): MovieDetail {
  const detail = getMovieDetail(id);
  return {
    ...detail,
    totalEpisodes: 16,
    currentEpisodes: 16,
    status: "Completed",
    duration: "45m",
    episodes: Array.from({ length: 16 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      isCurrent: i === 0,
    })),
  };
}
