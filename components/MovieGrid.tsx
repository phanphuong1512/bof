import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { ApiMovie } from "@/types/api";

interface MovieGridProps {
  title?: string;
  movies: ApiMovie[];
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function MovieGrid({
  title = "Phim Mới Cập Nhật",
  movies,
  showViewAll = true,
  viewAllHref = "/movies",
}: MovieGridProps) {
  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg,#a855f7,#7c3aed)" }} />
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          {showViewAll && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              Xem tất cả
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          {movies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}
