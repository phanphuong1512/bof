import { ApiMovieListResponse, ApiMovieDetailResponse } from "@/types/api";

const BASE = "https://phim.nguonc.com/api";

/** Phim mới cập nhật — revalidates every 5 minutes */
export async function getRecentMovies(page = 1): Promise<ApiMovieListResponse> {
  const res = await fetch(
    `${BASE}/films/phim-moi-cap-nhat?page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Phim theo danh mục */
export async function getMoviesByCategory(
  slug: string,
  page = 1
): Promise<ApiMovieListResponse> {
  const res = await fetch(
    `${BASE}/films/danh-sach/${slug}?page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Chi tiết phim + danh sách tập */
export async function getFilmDetail(slug: string): Promise<ApiMovieDetailResponse> {
  const res = await fetch(
    `${BASE}/film/${slug}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Tìm kiếm phim */
export async function searchFilms(
  keyword: string,
  page = 1
): Promise<ApiMovieListResponse> {
  const res = await fetch(
    `${BASE}/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Phim theo thể loại */
export async function getFilmsByGenre(
  slug: string,
  page = 1
): Promise<ApiMovieListResponse> {
  const res = await fetch(
    `${BASE}/films/the-loai/${slug}?page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Phim theo quốc gia */
export async function getFilmsByCountry(
  slug: string,
  page = 1
): Promise<ApiMovieListResponse> {
  const res = await fetch(
    `${BASE}/films/quoc-gia/${slug}?page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Phim theo năm phát hành */
export async function getFilmsByYear(
  slug: string,
  page = 1
): Promise<ApiMovieListResponse> {
  const res = await fetch(
    `${BASE}/films/nam-phat-hanh/${slug}?page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Category slugs ────────────────────────────────────────────────────────
export const CATEGORY_SLUGS = {
  nowShowing:  "phim-dang-chieu",
  series:      "phim-bo",
  movie:       "phim-le",
  anime:       "hoat-hinh",
  tvShow:      "tv-shows",
} as const;
