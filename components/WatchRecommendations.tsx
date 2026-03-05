import Image from "next/image";
import Link from "next/link";
import { ApiMovie } from "@/types/api";

interface Props {
  movies: ApiMovie[];
}

export default function WatchRecommendations({ movies }: Props) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth={2} width={16} height={16}>
          <path d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10" />
          <path d="M3.5 15h17l-1.5 5H5L3.5 15z" />
        </svg>
        Đề xuất cho bạn
      </h3>

      <div className="flex flex-col gap-0.5">
        {movies.map((movie, idx) => (
          <Link
            key={movie.slug}
            href={`/watch/${movie.slug}`}
            className="group flex gap-3 p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{
              borderBottom:
                idx < movies.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            {/* Thumbnail */}
            <div
              className="relative flex-shrink-0 rounded-lg overflow-hidden"
              style={{ width: 100, height: 60 }}
            >
              <Image
                src={movie.thumb_url}
                alt={movie.name}
                fill
                sizes="100px"
                style={{ objectFit: "cover" }}
              />
              {/* Episode overlay */}
              <span
                className="absolute bottom-1 right-1 text-[8px] font-bold text-white px-1 py-0.5 rounded"
                style={{ background: "rgba(0,0,0,0.75)" }}
              >
                {movie.current_episode}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              <p className="text-xs font-medium text-white group-hover:text-purple-300 transition-colors leading-snug line-clamp-2">
                {movie.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span
                  className="text-[9px] font-bold px-1 py-0.5 rounded text-purple-300"
                  style={{ background: "rgba(168,85,247,0.1)" }}
                >
                  {movie.language}
                </span>
                <span className="text-[10px] text-[#4a5568]">&middot;</span>
                <span className="text-[9px] text-emerald-400 font-bold">{movie.quality}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
