import Navbar from "@/components/Navbar";
import MovieDetailHero from "@/components/MovieDetailHero";
import MovieInfo from "@/components/MovieInfo";
import ApiEpisodeSection from "@/components/ApiEpisodeSection";
import CommentSection from "@/components/CommentSection";
import { getFilmDetail } from "@/lib/api";

type Params = Promise<{ id: string }>;

export default async function MovieDetailPage({ params }: { params: Params }) {
  const { id } = await params; // id is the movie slug
  const data = await getFilmDetail(id);
  const movie = data.movie;

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <Navbar />

      {/* Hero banner — full width */}
      <MovieDetailHero movie={movie} />

      {/* Main content — two column layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left sidebar — movie info */}
          <div className="w-full lg:w-[300px] flex-shrink-0 order-2 lg:order-1">
            <MovieInfo movie={movie} />
          </div>

          {/* Right content — episodes + comments */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            <ApiEpisodeSection
              slug={movie.slug}
              episodes={movie.episodes}
            />
            <CommentSection />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
