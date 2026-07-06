import Navbar from "@/components/Navbar";
import WatchPartyRoom from "@/components/WatchPartyRoom";
import WatchRecommendations from "@/components/WatchRecommendations";
import WatchInfo from "@/components/WatchInfo";
import ApiEpisodeSection from "@/components/ApiEpisodeSection";
import CommentSection from "@/components/CommentSection";
import { getFilmDetail, getRecentMovies } from "@/lib/api";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ep?: string; server?: string; party?: string }>;

async function fetchM3u8FromOphim(movieSlug: string, episodeName: string): Promise<string> {
  try {
    const res = await fetch(`https://phimapi.com/phim/${movieSlug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return "";
    const data = await res.json();
    
    const serverItems = data.episodes?.[0]?.server_data || [];
    
    const cleanNum = (name: string) => {
      if (!name) return null;
      const match = name.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    };
    
    const targetNum = cleanNum(episodeName);
    if (targetNum === null) return "";
    
    const epItem = serverItems.find((ep: any) => cleanNum(ep.name) === targetNum);
    return epItem?.link_m3u8 || "";
  } catch (error) {
    console.error("Failed to fetch m3u8 from Ophim:", error);
    return "";
  }
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params; // id is the movie slug
  const { ep, server, party } = await searchParams;
  const serverIdx = Number(server ?? 0);

  const [detailData, recData] = await Promise.all([
    getFilmDetail(id),
    getRecentMovies(1),
  ]);

  const movie = detailData.movie;
  const recommendations = recData.items.slice(0, 12);

  // Find the embed URL for the requested episode + server
  const serverData = movie.episodes?.[serverIdx] ?? movie.episodes?.[0];
  const episodeItem = ep
    ? serverData?.items.find((item) => item.slug === ep)
    : serverData?.items[0];
  const embedUrl = episodeItem?.embed ?? "";
  const episodeName = episodeItem?.name ?? "";

  // Fetch direct HLS m3u8Url to enable custom player & watch party sync
  let m3u8Url = "";
  if (episodeName) {
    m3u8Url = await fetchM3u8FromOphim(movie.slug, episodeName);
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* ===== Main area: Player + Recommendations/Chat sidebar ===== */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4">
        {party ? (
          /* Watch Party active: Full-width layout handled internally (splits into Player + Chat) */
          <WatchPartyRoom
            movieTitle={movie.name}
            movieSlug={movie.slug}
            episodeNumber={episodeName ? Number(episodeName) || undefined : undefined}
            embedUrl={embedUrl || undefined}
            m3u8Url={m3u8Url || undefined}
            episodeSlug={ep}
          />
        ) : (
          /* Normal mode: Split layout with recommendations sidebar */
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left — Player with Watch Party trigger */}
            <div className="w-full lg:flex-1 min-w-0">
              <WatchPartyRoom
                movieTitle={movie.name}
                movieSlug={movie.slug}
                episodeNumber={episodeName ? Number(episodeName) || undefined : undefined}
                embedUrl={embedUrl || undefined}
                m3u8Url={m3u8Url || undefined}
                episodeSlug={ep}
              />
            </div>

            {/* Right — Recommendations sidebar */}
            <div
              className="w-full lg:w-[340px] lg:flex-shrink-0 rounded-xl p-4 lg:max-h-[580px] lg:overflow-y-auto"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <WatchRecommendations movies={recommendations} />
            </div>
          </div>
        )}
      </div>

      {/* ===== Below player: Info + Episodes + Comments ===== */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div
          className="rounded-xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <WatchInfo movie={movie} />

          <div className="my-6" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

          <ApiEpisodeSection
            slug={movie.slug}
            episodes={movie.episodes}
            currentEp={ep}
            currentServer={serverIdx}
          />

          <CommentSection />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[#8892b0] text-sm">&copy; 2025 BOF. All rights reserved.</span>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="text-[#8892b0] text-sm hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
