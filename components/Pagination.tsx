import Link from "next/link";

interface Props {
  current: number;
  total: number;
  /** Base path, e.g. "/" or "/movies". Page param is appended as ?page=N */
  baseHref: string;
}

export default function Pagination({ current, total, baseHref }: Props) {
  if (total <= 1) return null;

  const href = (p: number) => `${baseHref}?page=${p}`;

  // Build page list with ellipsis: 1 ... (current-2)..(current+2) ... total
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

  const btn =
    "flex items-center justify-center min-w-[40px] h-10 px-2 rounded-lg text-sm font-medium transition-all";

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {/* Prev */}
      {current > 1 ? (
        <Link
          href={href(current - 1)}
          className={btn}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892b0" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      ) : (
        <span
          className={btn}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#4a5568", cursor: "default" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="flex items-end pb-1 text-[#4a5568] text-sm px-1">
            &hellip;
          </span>
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

      {/* Next */}
      {current < total ? (
        <Link
          href={href(current + 1)}
          className={btn}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#8892b0" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span
          className={btn}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#4a5568", cursor: "default" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </div>
  );
}
