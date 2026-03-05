import Image from "next/image";
import Link from "next/link";
import { ApiMovie } from "@/types/api";
import SearchBar from "@/components/SearchBar";

interface Props {
  featuredMovies: ApiMovie[];
}

export default function HeroSection({ featuredMovies }: Props) {
  // Pick 3 movies for the poster fan
  const posters = featuredMovies
    .slice(0, 3)
    .map((m) => ({ src: m.poster_url || m.thumb_url, slug: m.slug, name: m.name }));

  return (
    <section
      className="relative"
      style={{ background: "#0a0f1e", paddingTop: "5rem" }}
    >
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 800, height: 800,
            top: "30%", left: "25%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            top: "10%", right: "10%",
            background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">

        {/* ── Row 1: Text left + Poster fan right ── */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 pt-10 pb-10">

          {/* Left — heading + description + stats */}
          <div className="flex-1 max-w-xl">
            

            {/* Heading — fix: no <p> inside <h1> */}
            <h1 className="font-bold leading-tight text-white mb-4" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
              A <span className="gradient-text">Bunch</span> of Film
              <span
                className="block font-normal text-[#8892b0]"
                style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.35rem)", margin: "0.3em 0" }}
              >
                hay còn được gọi là
              </span>
              Một <span className="gradient-text">Nùi</span> Phim
            </h1>

            <p className="text-[#8892b0] text-base sm:text-lg mb-8 leading-relaxed">
              Hàng ngàn bộ phim, phim bộ và hoạt hình đang chờ bạn.
              Khám phá ngay hôm nay.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { value: "10K+",    label: "Phim" },
                { value: "5K+",     label: "Phim bộ" },
                { value: "Vietsub", label: "Đầy đủ" },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{value}</span>
                  <span className="text-[#8892b0]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — poster fan */}
          {posters.length >= 3 && (
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto">
              <PosterFan posters={posters} />
            </div>
          )}
        </div>

        {/* ── Row 2: Large centered search bar ── */}
        <div
          className="pb-12"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}
        >
          <p className="text-center text-xs text-[#4a5568] mb-3 uppercase tracking-widest font-medium">
            Tìm kiếm phim
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>

      </div>
    </section>
  );
}

function PosterFan({ posters }: { posters: { src: string; slug: string; name: string }[] }) {
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
            alt={poster.name}
            fill
            sizes="180px"
            style={{ objectFit: "cover" }}
          />
        </Link>
      ))}
    </div>
  );
}
