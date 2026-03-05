// Shared data types — swap with API shapes when ready
export interface Movie {
  id: number;
  title: string;
  poster: string;        // URL
  rating: number;        // 0–10
  year: number;
  language: string;      // e.g. "EN", "VI"
  genre?: string[];
}

export interface TrendingMovie extends Movie {
  rank: number;
}

export interface CastMember {
  id: number;
  name: string;
  avatar: string;        // URL
  role?: string;
}

export interface Episode {
  number: number;
  title?: string;
  isCurrent?: boolean;
}

export interface MovieDetail extends Movie {
  originalTitle?: string;
  backdrop: string;      // URL — banner image
  synopsis: string;
  duration?: string;     // e.g. "45m", "2h 30m"
  country: string;
  status?: string;       // e.g. "Đã hoàn thành", "Đang chiếu"
  quality?: string;      // e.g. "FHD", "HD", "CAM"
  imdbRating?: number;
  totalEpisodes: number;
  currentEpisodes: number;
  seasons?: number;
  cast: CastMember[];
  episodes: Episode[];
  tags?: string[];
}
