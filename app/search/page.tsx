import Navbar from "@/components/Navbar";
import MovieGrid from "@/components/MovieGrid";
import Link from "next/link";
import { searchFilms } from "@/lib/api";

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, page } = await searchParams;
  const keyword = q?.trim() ?? "";
  const currentPage = Number(page ?? 1);

  const data = keyword ? await searchFilms(keyword, currentPage) : null;
  const movies = data?.items ?? [];
  const paginate = data?.paginate;

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* Search heading */}
        <div className="mb-8">
          {keyword ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">
                Kết quả tìm kiếm:{" "}
                <span style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  &ldquo;{keyword}&rdquo;
                </span>
              </h1>
              {paginate && (
                <p className="text-sm text-[#8892b0]">
                  Tìm thấy <span className="text-white font-semibold">{paginate.total_items}</span> phim
                  {paginate.total_page > 1 && (
                    <> — trang {paginate.current_page} / {paginate.total_page}</>
                  )}
                </p>
              )}
            </>
          ) : (
            <h1 className="text-2xl font-bold text-white">Tìm kiếm phim</h1>
          )}
        </div>

        {/* Results */}
        {movies.length > 0 ? (
          <MovieGrid
            movies={movies}
            title=""
            showViewAll={false}
          />
        ) : keyword ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth={1.5} width={64} height={64}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-[#8892b0] text-lg">Không tìm thấy phim nào cho &ldquo;{keyword}&rdquo;</p>
            <p className="text-[#4a5568] text-sm">Thử từ khoá khác hoặc các từ ngắn hơn</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth={1.5} width={64} height={64}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-[#8892b0] text-lg">Nhập tên phim để tìm kiếm</p>
          </div>
        )}

        {/* Pagination */}
        {paginate && paginate.total_page > 1 && (
          <SearchPagination
            current={currentPage}
            total={paginate.total_page}
            keyword={keyword}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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

// ─── Pagination ────────────────────────────────────────────────────────────

function SearchPagination({ current, total, keyword }: { current: number; total: number; keyword: string }) {
  const href = (p: number) => `/search?q=${encodeURIComponent(keyword)}&page=${p}`;

  const pages: (number | "...")[] = [];
  const delta = 2;
  let prev = 0;
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - delta && p <= current + delta)) {
      if (prev && p - prev > 1) pages.push("...");
      pages.push(p);
      prev = p;
    }
  }

  const btn = "flex items-center justify-center min-w-[40px] h-10 px-2 rounded-lg text-sm font-medium transition-all";

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap mt-10">
      {current > 1 ? (
        <Link href={href(current - 1)} className={btn} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892b0" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
      ) : (
        <span className={btn} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#4a5568", cursor: "default" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}><path d="M15 18l-6-6 6-6" /></svg>
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="flex items-end pb-1 text-[#4a5568] text-sm px-1">&hellip;</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={btn}
            style={
              p === current
                ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "white", border: "none" }
                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892b0" }
            }
          >
            {p}
          </Link>
        )
      )}

      {current < total ? (
        <Link href={href(current + 1)} className={btn} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892b0" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}><path d="M9 18l6-6-6-6" /></svg>
        </Link>
      ) : (
        <span className={btn} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#4a5568", cursor: "default" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}><path d="M9 18l6-6-6-6" /></svg>
        </span>
      )}
    </div>
  );
}
