import Link from "next/link";
import { ApiMovieDetail, getCategoryEntries, stripHtml } from "@/types/api";

interface Props {
  movie: ApiMovieDetail;
}

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function MovieInfo({ movie }: Props) {
  const genres    = getCategoryEntries(movie.category, "Thể loại");
  const countries = getCategoryEntries(movie.category, "Quốc gia");
  const years     = getCategoryEntries(movie.category, "Năm");
  const description = stripHtml(movie.description ?? "");
  const casts = movie.casts ? movie.casts.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <aside className="w-full">
      {/* Genre */}
      {genres.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider mb-2">Thể loại</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <Link
                key={g.id}
                href={`/genre/${g.id}`}
                className="px-3 py-1 rounded-full text-xs font-medium text-purple-300 transition-colors hover:text-white hover:bg-purple-600/20"
                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Synopsis */}
      {description && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider mb-2">Nội dung</h3>
          <p className="text-sm text-[#c8cee0] leading-relaxed">{description}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-col gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="pt-4" />
        {movie.current_episode && (
          <InfoRow label="Trạng thái" value={movie.current_episode} />
        )}
        {movie.time && <InfoRow label="Thời lượng" value={movie.time} />}
        {countries.length > 0 && (
          <div className="flex items-start gap-3">
            <span className="text-xs text-[#8892b0] w-24 flex-shrink-0 pt-0.5">Quốc gia</span>
            <div className="flex flex-wrap gap-1.5">
              {countries.map((c) => (
                <Link
                  key={c.id}
                  href={`/country/${c.id}`}
                  className="text-sm text-white hover:text-purple-300 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        {years.length > 0 && (
          <div className="flex items-start gap-3">
            <span className="text-xs text-[#8892b0] w-24 flex-shrink-0 pt-0.5">Năm</span>
            <div className="flex flex-wrap gap-1.5">
              {years.map((y) => (
                <Link
                  key={y.id}
                  href={`/year/${y.id}`}
                  className="text-sm text-white hover:text-purple-300 transition-colors"
                >
                  {y.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        {movie.language && <InfoRow label="Ngôn ngữ" value={movie.language} />}
        {movie.total_episodes > 1 && (
          <InfoRow label="Số tập" value={`${movie.total_episodes} tập`} />
        )}
        {movie.director && <InfoRow label="Đạo diễn" value={movie.director} />}
        {movie.modified && (
          <InfoRow label="Cập nhật" value={formatDate(movie.modified)} />
        )}
      </div>

      {/* Cast */}
      {casts.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider mb-3">Diễn viên</h3>
          <div className="flex flex-wrap gap-2">
            {casts.map((actor) => (
              <span
                key={actor}
                className="px-2.5 py-1 rounded-full text-xs text-[#c8cee0] hover:text-white cursor-pointer transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {actor}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-[#8892b0] w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
