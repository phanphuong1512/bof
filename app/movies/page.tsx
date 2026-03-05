import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { getRecentMovies } from "@/lib/api";

type SearchParams = Promise<{ page?: string }>;

export default async function MoviesPage({ searchParams }: { searchParams: SearchParams }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));

  const data = await getRecentMovies(currentPage);
  const { items, paginate } = data;

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <Navbar />
      <div className="h-16" />

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg,#a855f7,#7c3aed)" }} />
              <h1 className="text-xl font-bold text-white">Phim Mới Cập Nhật</h1>
            </div>
            <p className="text-sm text-[#8892b0] pl-4">
              {paginate.total_items.toLocaleString("vi-VN")} phim &middot; Trang {paginate.current_page}/{paginate.total_page}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 mb-12">
          {items.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination current={paginate.current_page} total={paginate.total_page} baseHref="/movies" />
      </div>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
