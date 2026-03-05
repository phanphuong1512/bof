// API response shapes from phim.nguonc.com

// ─── List endpoints ─────────────────────────────────────────────────────────

export interface ApiMovie {
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;   // thumbnail — used for cards
  poster_url: string;  // larger poster — used for detail/hero
  description: string;
  total_episodes: number;
  current_episode: string;  // e.g. "Tập 18", "FULL", "Hoàn tất (7/7)"
  time:     string | null;
  quality:  string;         // "HD", "FHD", "CAM"
  language: string;         // "Vietsub", "Thuyết minh", "Lồng tiếng"
  director: string | null;
  casts:    string | null;
  created:  string;
  modified: string;
}

export interface ApiPaginate {
  current_page: number;
  total_page:   number;
  total_items:  number;
  items_per_page: number;
}

export interface ApiMovieListResponse {
  status:   string;
  paginate: ApiPaginate;
  items:    ApiMovie[];
  cat?: { name: string; title: string; slug: string };
}

// ─── Detail endpoint ─────────────────────────────────────────────────────────

export interface ApiEpisodeItem {
  name:  string;  // "1", "2", …
  slug:  string;  // "tap-1", "tap-2", …
  embed: string;  // iframe src
  m3u8:  string;  // HLS stream URL
}

export interface ApiEpisodeServer {
  server_name: string;   // "Vietsub #1", "Lồng Tiếng #1", …
  items: ApiEpisodeItem[];
}

export interface ApiCategoryEntry {
  group: { id: string; name: string };
  list:  Array<{ id: string; name: string }>;
}

export interface ApiMovieDetail {
  id:               string;
  name:             string;
  slug:             string;
  original_name:    string;
  thumb_url:        string;
  poster_url:       string;
  created:          string;
  modified:         string;
  description:      string;  // may contain HTML
  total_episodes:   number;
  current_episode:  string;
  time:             string | null;
  quality:          string;
  language:         string;
  director:         string | null;
  casts:            string | null;
  category:         Record<string, ApiCategoryEntry>;
  episodes:         ApiEpisodeServer[];
}

export interface ApiMovieDetailResponse {
  status: string;
  movie:  ApiMovieDetail;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract a flat list of names from the category map by group name */
export function getCategoryList(
  category: Record<string, ApiCategoryEntry>,
  groupName: string
): string[] {
  return Object.values(category)
    .filter((c) => c.group.name === groupName)
    .flatMap((c) => c.list.map((l) => l.name));
}

/** Extract id+name pairs from the category map by group name.
 *  The `id` field serves as the URL slug (e.g. "hanh-dong", "au-my", "2024"). */
export function getCategoryEntries(
  category: Record<string, ApiCategoryEntry>,
  groupName: string
): Array<{ id: string; name: string }> {
  return Object.values(category)
    .filter((c) => c.group.name === groupName)
    .flatMap((c) => c.list);
}

/** Strip HTML tags from a description string */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}
