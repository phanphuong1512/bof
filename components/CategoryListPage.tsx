import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { ApiMovie, ApiPaginate } from "@/types/api";

interface Props {
  /** Short category type label shown in breadcrumb, e.g. "Thể loại", "Quốc gia", "Năm" */
  label: string;
  /** Display title from cat.title, e.g. "Hành Động", "Âu Mỹ", "2024" */
  catTitle: string;
  movies: ApiMovie[];
  paginate: ApiPaginate;
  /** Base href for pagination, e.g. "/genre/hanh-dong" */
  baseHref: string;
}

export default function CategoryListPage({ label, catTitle, movies, paginate, baseHref }: Props) {
  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <Navbar />
      <div className="h-16" />

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <p className="text-xs text-[#4a5568] mb-2 flex items-center gap-1.5">
            <span>Trang chủ</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={10} height={10}><path d="M9 18l6-6-6-6" /></svg>
            <span>{label}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={10} height={10}><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-[#8892b0]">{catTitle}</span>
          </p>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg,#a855f7,#7c3aed)" }} />
            <h1 className="text-xl font-bold text-white">
              {label}:{" "}
              <span style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {catTitle}
              </span>
            </h1>
          </div>
          <p className="text-sm text-[#8892b0] pl-4">
            {paginate.total_items.toLocaleString("vi-VN")} phim &middot; Trang {paginate.current_page}/{paginate.total_page}
          </p>
        </div>

        {/* Movie grid */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 mb-12">
            {movies.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-[#8892b0] text-lg">Không có phim nào</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination current={paginate.current_page} total={paginate.total_page} baseHref={baseHref} />
      </div>

      {/* Footer */}
      <footer className="py-8 mt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[#8892b0] text-sm">&copy; 2025 BOF. All rights reserved.</span>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="text-[#8892b0] text-sm hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
