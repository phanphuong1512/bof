"use client";

import Link from "next/link";
import { Episode } from "@/types/movie";

interface Props {
  movieId: number;
  episodes: Episode[];
  totalEpisodes: number;
  currentEpisodes: number;
}

export default function EpisodeList({ movieId, episodes, totalEpisodes, currentEpisodes }: Props) {
  if (totalEpisodes <= 1) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">
          Episodes
          <span className="ml-2 text-xs font-normal text-[#8892b0]">
            ({currentEpisodes}/{totalEpisodes})
          </span>
        </h3>
      </div>

      {/* Episode grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {episodes.map((ep) => (
          <Link
            key={ep.number}
            href={`/watch/${movieId}?ep=${ep.number}`}
            className="flex items-center justify-center h-10 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              background: ep.isCurrent
                ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                : "rgba(255,255,255,0.05)",
              border: ep.isCurrent
                ? "none"
                : "1px solid rgba(255,255,255,0.08)",
              color: ep.isCurrent ? "white" : "#8892b0",
            }}
          >
            {ep.number}
          </Link>
        ))}
      </div>
    </div>
  );
}
