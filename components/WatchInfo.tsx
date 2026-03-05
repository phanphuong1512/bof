import Image from "next/image";
import Link from "next/link";
import { ApiMovieDetail, getCategoryList, stripHtml } from "@/types/api";

interface Props {
  movie: ApiMovieDetail;
}

export default function WatchInfo({ movie }: Props) {
  const genres = getCategoryList(movie.category, "Thể loại");
  const years = getCategoryList(movie.category, "Năm");
  const description = stripHtml(movie.description ?? "");

  return (
    <div className="flex flex-col sm:flex-row gap-5">
      {/* Poster */}
      <Link
        href={`/movie/${movie.slug}`}
        className="relative flex-shrink-0 rounded-lg overflow-hidden hidden sm:block"
        style={{
          width: 120,
          height: 180,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Image
          src={movie.poster_url || movie.thumb_url}
          alt={movie.name}
          fill
          sizes="120px"
          style={{ objectFit: "cover" }}
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/movie/${movie.slug}`} className="hover:text-purple-300 transition-colors">
          <h2 className="text-lg font-bold text-white">{movie.name}</h2>
        </Link>
        {movie.original_name && movie.original_name !== movie.name && (
          <p className="text-purple-400 text-xs font-medium mt-0.5">{movie.original_name}</p>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {years[0] && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
              {years[0]}
            </span>
          )}
          {movie.quality && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
              {movie.quality}
            </span>
          )}
          {movie.language && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-purple-300" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.15)" }}>
              {movie.language}
            </span>
          )}
          {movie.current_episode && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
              {movie.current_episode}
            </span>
          )}
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {genres.map((g) => (
              <span key={g} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-purple-300" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.15)" }}>
                {g}
              </span>
            ))}
          </div>
        )}

        {description && (
          <p className="text-xs text-[#8892b0] mt-3 leading-relaxed line-clamp-3">
            {description}
          </p>
        )}

        <Link
          href={`/movie/${movie.slug}`}
          className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2 font-medium transition-colors"
        >
          Chi tiết phim
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12} height={12}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </div>
  );
}
