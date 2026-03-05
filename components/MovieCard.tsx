import Image from "next/image";
import Link from "next/link";
import { ApiMovie } from "@/types/api";

/** Derive a short display label from current_episode */
function episodeBadge(ep: string): string {
  if (!ep) return "";
  const up = ep.toUpperCase();
  if (up === "FULL") return "FULL";
  if (up.startsWith("HOÀN TẤT") || up.startsWith("HOAN TAT")) return "Full";
  return ep;
}

export default function MovieCard({ movie }: { movie: ApiMovie }) {
  const badge = episodeBadge(movie.current_episode);
  const isComplete = badge === "FULL" || badge === "Full";

  return (
    <Link href={`/movie/${movie.slug}`} className="group block movie-card">
      {/* Poster */}
      <div
        className="relative w-full overflow-hidden rounded-xl mb-3"
        style={{
          aspectRatio: "2/3",
          background: "#141d33",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Image
          src={movie.thumb_url}
          alt={movie.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          style={{ objectFit: "cover" }}
          className="group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />

        {/* Quality — top left */}
        <span
          className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-emerald-400"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
        >
          {movie.quality}
        </span>

        {/* Episode — top right */}
        {badge && (
          <span
            className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{
              background: isComplete ? "rgba(168,85,247,0.88)" : "rgba(0,0,0,0.72)",
              backdropFilter: "blur(4px)",
              color: "white",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="text-white text-sm font-semibold truncate group-hover:text-purple-300 transition-colors leading-snug mb-0.5">
          {movie.name}
        </h3>
        {movie.original_name && (
          <p className="text-[#6b7a99] text-[11px] truncate mb-1">{movie.original_name}</p>
        )}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-purple-300"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
          >
            {movie.language}
          </span>
          {movie.total_episodes > 1 && (
            <span className="text-[10px] text-[#4a5568]">{movie.total_episodes} tập</span>
          )}
          {movie.time && (
            <span className="text-[10px] text-[#4a5568]">{movie.time}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
