"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiEpisodeServer } from "@/types/api";

interface Props {
  slug: string;
  episodes: ApiEpisodeServer[];
  currentEp?: string;
  currentServer?: number;
}

export default function ApiEpisodeSection({ slug, episodes, currentEp, currentServer = 0 }: Props) {
  const [activeServer, setActiveServer] = useState(currentServer);

  if (!episodes || episodes.length === 0) return null;

  const server = episodes[activeServer] ?? episodes[0];

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">
          Danh sách tập
          <span className="ml-2 text-xs font-normal text-[#8892b0]">
            ({server.items.length} tập)
          </span>
        </h3>
      </div>

      {/* Server tabs */}
      {episodes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {episodes.map((srv, idx) => (
            <button
              key={idx}
              onClick={() => setActiveServer(idx)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={{
                background: activeServer === idx
                  ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                  : "rgba(255,255,255,0.05)",
                border: activeServer === idx
                  ? "none"
                  : "1px solid rgba(255,255,255,0.08)",
                color: activeServer === idx ? "white" : "#8892b0",
              }}
            >
              {srv.server_name}
            </button>
          ))}
        </div>
      )}

      {/* Episode grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {server.items.map((item) => {
          const isCurrent = item.slug === currentEp && activeServer === currentServer;
          return (
            <Link
              key={item.slug}
              href={`/watch/${slug}?ep=${item.slug}&server=${activeServer}`}
              className="flex items-center justify-center h-10 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{
                background: isCurrent
                  ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                  : "rgba(255,255,255,0.05)",
                border: isCurrent
                  ? "none"
                  : "1px solid rgba(255,255,255,0.08)",
                color: isCurrent ? "white" : "#8892b0",
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
