"use client";

import Image from "next/image";
import Link from "next/link";
import { ApiMovieDetail, getCategoryList } from "@/types/api";

interface Props {
  movie: ApiMovieDetail;
}

export default function MovieDetailHero({ movie }: Props) {
  const years = getCategoryList(movie.category, "Năm");
  const firstEp = movie.episodes?.[0]?.items?.[0]?.slug ?? "";
  const watchHref = firstEp
    ? `/watch/${movie.slug}?ep=${firstEp}&server=0`
    : `/watch/${movie.slug}`;

  return (
    <section className="relative w-full">
      {/* Backdrop image */}
      <div className="relative w-full" style={{ height: "clamp(280px, 42vw, 520px)" }}>
        <Image
          src={movie.poster_url || movie.thumb_url}
          alt={movie.name}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
          priority
          unoptimized
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0f1e 0%, rgba(10,15,30,0.3) 60%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,15,30,0.9) 0%, transparent 55%)" }} />
      </div>

      {/* Content over backdrop */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-[1400px] mx-auto px-6 pb-8">
          <div className="flex items-end gap-6">
            {/* Poster */}
            <div
              className="relative flex-shrink-0 rounded-xl overflow-hidden hidden sm:block"
              style={{
                width: 160,
                height: 240,
                border: "2px solid rgba(255,255,255,0.1)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}
            >
              <Image
                src={movie.thumb_url}
                alt={movie.name}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>

            {/* Title + meta */}
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {movie.name}
              </h1>
              {movie.original_name && movie.original_name !== movie.name && (
                <p className="text-purple-400 text-sm mb-3 font-medium">{movie.original_name}</p>
              )}

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {years[0] && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
                    {years[0]}
                  </span>
                )}
                {movie.quality && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold text-emerald-400" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}>
                    {movie.quality}
                  </span>
                )}
                {movie.time && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
                    {movie.time}
                  </span>
                )}
                {movie.current_episode && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
                    {movie.current_episode}
                  </span>
                )}
                {movie.language && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-purple-300" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    {movie.language}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={watchHref}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
                >
                  <svg viewBox="0 0 24 24" fill="white" width={16} height={16}><path d="M8 5v14l11-7z" /></svg>
                  Xem Phim
                </Link>
                <ActionBtn icon="heart" label="Yêu thích" />
                <ActionBtn icon="plus" label="Danh sách" />
                <ActionBtn icon="share" label="Chia sẻ" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionBtn({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
  };

  return (
    <button className="flex flex-col items-center gap-1 group cursor-pointer" title={label}>
      <span
        className="flex items-center justify-center w-10 h-10 rounded-full transition-colors group-hover:bg-white/15"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#8892b0" strokeWidth={1.8} width={16} height={16} className="group-hover:stroke-white transition-colors">
          {icons[icon]}
        </svg>
      </span>
      <span className="text-[10px] text-[#8892b0] group-hover:text-white transition-colors hidden sm:block">{label}</span>
    </button>
  );
}
