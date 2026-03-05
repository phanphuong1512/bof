"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiMovie } from "@/types/api";

interface SearchResult {
  items: ApiMovie[];
  total: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiMovie[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Debounced search
  const search = useCallback((q: string) => {
    clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      setTotal(0);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data: SearchResult = await res.json();
        setResults(data.items);
        setTotal(data.total);
        setIsOpen(data.items.length > 0);
        setActiveIdx(-1);
      } catch {
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    search(query);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    const total = results.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      router.push(`/movie/${results[activeIdx].slug}`);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-2xl px-3 py-2"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${isOpen ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: isOpen ? "0 0 0 3px rgba(168,85,247,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {/* Search icon / spinner */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {isLoading ? (
            <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth={2} width={18} height={18}>
              <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#8892b0" strokeWidth={2} width={18} height={18}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Tìm phim, phim bộ, diễn viên..."
          className="flex-1 bg-transparent text-white placeholder-[#4a5568] focus:outline-none"
          style={{ fontSize: 16, minHeight: 40 }}
          autoComplete="off"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false); inputRef.current?.focus(); }}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-[#4a5568] hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          className="flex-shrink-0 px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", minHeight: 40 }}
        >
          Tìm kiếm
        </button>
      </form>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {results.map((movie, i) => (
            <Link
              key={movie.slug}
              href={`/movie/${movie.slug}`}
              onClick={() => { setIsOpen(false); setQuery(""); }}
              className="flex items-center gap-3 px-4 py-3 transition-colors"
              style={{
                background: i === activeIdx ? "rgba(168,85,247,0.12)" : "transparent",
                borderBottom: i < results.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(-1)}
            >
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 48, height: 68 }}>
                <Image
                  src={movie.thumb_url}
                  alt={movie.name}
                  fill
                  sizes="48px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{movie.name}</p>
                {movie.original_name && (
                  <p className="text-xs text-[#6b7a99] truncate mt-0.5">{movie.original_name}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-emerald-400"
                    style={{ background: "rgba(52,211,153,0.1)" }}
                  >
                    {movie.quality}
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded text-purple-300"
                    style={{ background: "rgba(168,85,247,0.1)" }}
                  >
                    {movie.language}
                  </span>
                  {movie.current_episode && (
                    <span className="text-[10px] text-[#8892b0]">{movie.current_episode}</span>
                  )}
                  {movie.time && (
                    <span className="text-[10px] text-[#4a5568]">{movie.time}</span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth={2} width={14} height={14} className="flex-shrink-0">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}

          {/* View all footer */}
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
          >
            <span>
              Xem tất cả{" "}
              {total > 0 && <span className="text-white font-semibold">{total.toLocaleString("vi-VN")}</span>}{" "}
              kết quả cho &ldquo;{query}&rdquo;
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
