"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiMovie } from "@/types/api";

interface Props {
  featuredMovies: ApiMovie[];
}

export default function HeroSection({ featuredMovies }: Props) {
  const [query, setQuery] = useState("");

  // Pick 3 movies for the poster fan
  const posters = featuredMovies
    .slice(0, 3)
    .map((m) => ({ src: m.poster_url || m.thumb_url, slug: m.slug }));

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#0a0f1e" }}>

      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: "50%", left: "30%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            top: "20%", right: "15%",
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* Left: Text + Search */}
          <div className="flex-1 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-medium text-purple-300"
              style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Đang thịnh hành
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4">
              Khám Phá{" "}
              <span className="gradient-text">Phim Hay</span>
              <br />
              Không Còn
              <br />
              Phiền Phức
            </h1>

            <p className="text-[#8892b0] text-base sm:text-lg mb-8 leading-relaxed">
              Hàng ngàn bộ phim, phim bộ và hoạt hình đang chờ bạn.
              Khám phá ngay hôm nay.
            </p>

            {/* Search bar */}
            <form
              className="search-bar rounded-2xl p-2 flex items-center gap-2 mb-6"
              style={{ maxWidth: 520 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
              }}
            >
              <div className="flex items-center gap-3 flex-1 px-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#8892b0" strokeWidth={2} className="flex-shrink-0" width={18} height={18}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm phim, phim bộ..."
                  className="w-full bg-transparent text-white placeholder-[#4a5568] text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex-shrink-0 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
              >
                Tìm kiếm
              </button>
            </form>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { value: "10K+", label: "Phim" },
                { value: "5K+",  label: "Phim bộ" },
                { value: "Vietsub", label: "Đầy đủ" },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{value}</span>
                  <span className="text-[#8892b0]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Poster fan */}
          {posters.length >= 3 && (
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto">
              <PosterFan posters={posters} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PosterFan({ posters }: { posters: { src: string; slug: string }[] }) {
  const styles = [
    { rotate: "-15deg", translateX: "-60px", translateY: "20px", z: 0, scale: 0.88, shadow: "0 8px 32px rgba(0,0,0,0.6)" },
    { rotate: "0deg",   translateX: "0px",   translateY: "0px",  z: 2, scale: 1,    shadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(168,85,247,0.2)" },
    { rotate: "15deg",  translateX: "60px",  translateY: "20px", z: 1, scale: 0.88, shadow: "0 8px 32px rgba(0,0,0,0.6)" },
  ];

  return (
    <div className="relative" style={{ width: 280, height: 380 }}>
      {posters.map((poster, i) => (
        <Link
          key={poster.slug}
          href={`/movie/${poster.slug}`}
          className="absolute rounded-2xl overflow-hidden block"
          style={{
            width: 180, height: 270,
            top: "50%", left: "50%",
            transform: `translate(-50%, -50%) translateX(${styles[i].translateX}) translateY(${styles[i].translateY}) rotate(${styles[i].rotate}) scale(${styles[i].scale})`,
            zIndex: styles[i].z,
            boxShadow: styles[i].shadow,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Image
            src={poster.src}
            alt={`Featured movie ${i + 1}`}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </Link>
      ))}
    </div>
  );
}
