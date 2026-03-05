import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import WatchRecommendations from "@/components/WatchRecommendations";
import WatchInfo from "@/components/WatchInfo";
import ApiEpisodeSection from "@/components/ApiEpisodeSection";
import CommentSection from "@/components/CommentSection";
import { getFilmDetail, getRecentMovies } from "@/lib/api";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ep?: string; server?: string }>;

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params; // id is the movie slug
  const { ep, server } = await searchParams;
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
  const m3u8Url = episodeItem?.m3u8 ?? "";
  const episodeName = episodeItem?.name ?? "";

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* ===== Main area: Player + Recommendations sidebar ===== */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4">
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Left — Video player */}
          <div className="w-full lg:flex-1 min-w-0">
            <VideoPlayer
              movieTitle={movie.name}
              episodeNumber={episodeName ? Number(episodeName) || undefined : undefined}
              embedUrl={embedUrl || undefined}
              m3u8Url={m3u8Url || undefined}
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
