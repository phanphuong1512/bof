import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingSection from "@/components/TrendingSection";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import { getRecentMovies } from "@/lib/api";

type SearchParams = Promise<{ page?: string }>;

const Divider = () => (
  <div className="max-w-[1400px] mx-auto px-6">
    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
  </div>
);

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));

  // Fetch page 1 always (for hero + trending).
  // If currentPage > 1, fetch that page too in parallel.
  const [page1Data, pageNData] = await Promise.all([
    getRecentMovies(1),
    currentPage > 1 ? getRecentMovies(currentPage) : Promise.resolve(null),
  ]);

  const gridData = pageNData ?? page1Data;
  const { items: gridMovies, paginate } = gridData;
  const trendingMovies = page1Data.items.slice(0, 5);
  const heroMovies = page1Data.items.slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <Navbar />

      {/* Hero + Trending only on first page */}
      {currentPage === 1 && (
        <>
          <HeroSection featuredMovies={heroMovies} />
          <Divider />
          <TrendingSection movies={trendingMovies} />
          <Divider />
        </>
      )}

      {/* Spacer for fixed navbar on page 2+ */}
      {currentPage > 1 && <div className="h-20" />}

      {/* Movie grid */}
      <MovieGrid
        movies={gridMovies}
        title="Phim Mới Cập Nhật"
        showViewAll={false}
      />

      {/* Pagination */}
      <div className="max-w-[1400px] mx-auto px-6 pb-14">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-[#4a5568]">
            Trang {paginate.current_page} / {paginate.total_page}
            &ensp;&middot;&ensp;
            {paginate.total_items.toLocaleString("vi-VN")} phim
          </p>
          <Pagination current={paginate.current_page} total={paginate.total_page} baseHref="/" />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[#8892b0] text-sm">© 2025 BOF. All rights reserved.</span>
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
