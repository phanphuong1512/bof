import Image from "next/image";
import Link from "next/link";
import { ApiMovie } from "@/types/api";

interface Props {
  movies: ApiMovie[];
}

export default function TrendingSection({ movies }: Props) {
  // Take first 5
  const items = movies.slice(0, 5);

  return (
    <section className="py-12">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg,#a855f7,#7c3aed)" }} />
            <h2 className="text-xl font-bold text-white">Phim Thịnh Hành</h2>
          </div>
          <Link
            href="/movies"
            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            Xem tất cả
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid — 5 equal columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {items.map((movie, idx) => (
            <TrendingCard key={movie.slug} movie={movie} rank={idx + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingCard({ movie, rank }: { movie: ApiMovie; rank: number }) {
  return (
    <Link
      href={`/movie/${movie.slug}`}
      className="group relative cursor-pointer w-full block"
    >
      {/* Number + poster layered */}
      <div className="relative w-full" style={{ height: 280 }}>
        {/* Big rank number */}
        <span
          className="select-none absolute bottom-0 leading-none"
          style={{
            left: "5%",
            fontSize: "clamp(100px, 11vw, 185px)",
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: -4,
            WebkitTextStroke: "2.5px rgba(255,255,255,0.25)",
            color: "transparent",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {rank}
        </span>

        {/* Poster */}
        <div
          className="absolute rounded-xl overflow-hidden movie-card"
          style={{
            width: "62%",
            aspectRatio: "2/3",
            right: 0,
            bottom: 0,
            zIndex: 2,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          <Image
            src={movie.poster_url || movie.thumb_url}
            alt={movie.name}
            fill
            sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 13vw"
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          {/* Episode badge */}
          <span
            className="absolute bottom-1 left-1 text-[9px] font-bold px-1 py-0.5 rounded text-white"
            style={{ background: "rgba(168,85,247,0.85)" }}
          >
            {movie.current_episode}
          </span>
        </div>
      </div>

      {/* Title — aligned below the poster (poster starts at 38% from left) */}
      <p
        className="mt-3 text-sm font-medium text-[#8892b0] group-hover:text-white transition-colors line-clamp-2 text-left leading-snug"
        style={{ marginLeft: "38%" }}
      >
        {movie.name}
      </p>
    </Link>
  );
}
