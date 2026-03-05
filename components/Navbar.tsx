"use client";

import Link from "next/link";
import { useState, useRef } from "react";

// ── Dữ liệu dropdown ──────────────────────────────────────────────────────────

const GENRES = [
  { label: "Hành Động",           slug: "hanh-dong" },
  { label: "Phiêu Lưu",           slug: "phieu-luu" },
  { label: "Hoạt Hình",           slug: "hoat-hinh" },
  { label: "Hài",                  slug: "hai" },
  { label: "Hình Sự",             slug: "hinh-su" },
  { label: "Tài Liệu",            slug: "tai-lieu" },
  { label: "Chính Kịch",          slug: "chinh-kich" },
  { label: "Gia Đình",            slug: "gia-dinh" },
  { label: "Giả Tưởng",           slug: "gia-tuong" },
  { label: "Lịch Sử",             slug: "lich-su" },
  { label: "Kinh Dị",             slug: "kinh-di" },
  { label: "Nhạc",                 slug: "nhac" },
  { label: "Bí Ẩn",               slug: "bi-an" },
  { label: "Lãng Mạn",            slug: "lang-man" },
  { label: "Khoa Học Viễn Tưởng", slug: "khoa-hoc-vien-tuong" },
  { label: "Gây Cấn",             slug: "gay-can" },
  { label: "Chiến Tranh",         slug: "chien-tranh" },
  { label: "Tâm Lý",              slug: "tam-ly" },
  { label: "Tình Cảm",            slug: "tinh-cam" },
  { label: "Cổ Trang",            slug: "co-trang" },
  { label: "Miền Tây",            slug: "mien-tay" },
  { label: "Phim 18+",            slug: "phim-18" },
];

const COUNTRIES = [
  { label: "Âu Mỹ",          slug: "au-my" },
  { label: "Anh",             slug: "anh" },
  { label: "Trung Quốc",     slug: "trung-quoc" },
  { label: "Indonesia",       slug: "indonesia" },
  { label: "Việt Nam",       slug: "viet-nam" },
  { label: "Pháp",            slug: "phap" },
  { label: "Hồng Kông",      slug: "hong-kong" },
  { label: "Hàn Quốc",      slug: "han-quoc" },
  { label: "Nhật Bản",      slug: "nhat-ban" },
  { label: "Thái Lan",       slug: "thai-lan" },
  { label: "Đài Loan",       slug: "dai-loan" },
  { label: "Nga",             slug: "nga" },
  { label: "Hà Lan",         slug: "ha-lan" },
  { label: "Philippines",    slug: "philippines" },
  { label: "Ấn Độ",         slug: "an-do" },
  { label: "Quốc Gia Khác", slug: "quoc-gia-khac" },
];

const YEARS = Array.from({ length: 23 }, (_, i) => {
  const y = 2026 - i;
  return { label: String(y), slug: String(y) };
});

// ── Dropdown Item component ───────────────────────────────────────────────────

function DropdownLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-1.5 rounded-lg text-xs text-[#8892b0] hover:text-white hover:bg-white/08 transition-colors whitespace-nowrap"
      style={{ fontSize: 12 }}
    >
      {label}
    </Link>
  );
}

// ── Nav dropdown wrapper ──────────────────────────────────────────────────────

function NavDropdown({
  label,
  items,
  hrefPrefix,
  cols = 3,
}: {
  label: string;
  items: { label: string; slug: string }[];
  hrefPrefix: string;
  cols?: number;
}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  function show() {
    clearTimeout(timerRef.current);
    setOpen(true);
  }
  function hide() {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Trigger */}
      <button
        className="flex items-center gap-1 text-[#8892b0] text-sm hover:text-white transition-colors"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          width={12}
          height={12}
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full left-1/2 mt-3 rounded-xl py-3 px-2 z-50"
          style={{
            transform: "translateX(-50%)",
            background: "rgba(13,17,35,0.97)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            backdropFilter: "blur(16px)",
            minWidth: cols === 4 ? 200 : cols === 2 ? 280 : 340,
          }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Arrow pointer */}
          <div
            className="absolute"
            style={{
              top: -6, left: "50%", transform: "translateX(-50%)",
              width: 12, height: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 10, height: 10,
                background: "rgba(13,17,35,0.97)",
                border: "1px solid rgba(255,255,255,0.08)",
                transform: "rotate(45deg)",
                margin: "3px auto 0",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 2,
            }}
          >
            {items.map((item) => (
              <DropdownLink
                key={item.slug}
                href={`${hrefPrefix}/${item.slug}`}
                label={item.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  function toggleMobile(key: string) {
    setMobileExpanded((prev) => (prev === key ? null : key));
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10, 15, 30, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <nav className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-lg tracking-tight">BOF</span>
            <span className="text-[#8892b0] font-normal tracking-wide" style={{ fontSize: 9 }}>
              A Bunch of Film
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/movies" className="text-[#8892b0] text-sm hover:text-white transition-colors">
            Phim Lẻ
          </Link>
          <Link href="/tv-series" className="text-[#8892b0] text-sm hover:text-white transition-colors">
            Phim Bộ
          </Link>
          <Link href="/tv-shows" className="text-[#8892b0] text-sm hover:text-white transition-colors">
            Chương Trình TV
          </Link>
          <Link href="/upcoming" className="text-[#8892b0] text-sm hover:text-white transition-colors">
            Đang Chiếu
          </Link>

          {/* Dropdowns */}
          <NavDropdown label="Thể Loại"  items={GENRES}    hrefPrefix="/genre"   cols={3} />
          <NavDropdown label="Quốc Gia"  items={COUNTRIES} hrefPrefix="/country" cols={2} />
          <NavDropdown label="Năm"       items={YEARS}     hrefPrefix="/year"    cols={4} />
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signin"
            className="text-[#8892b0] text-sm font-medium px-4 py-2 rounded-full hover:text-white transition-colors"
          >
            Đăng Nhập
          </Link>
          <Link
            href="/signup"
            className="text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            Đăng Ký
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#8892b0] hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-5 flex flex-col"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Plain links */}
          {[
            { label: "Phim Lẻ",        href: "/movies" },
            { label: "Phim Bộ",        href: "/tv-series" },
            { label: "Chương Trình TV", href: "/tv-shows" },
            { label: "Đang Chiếu",     href: "/upcoming" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#8892b0] text-sm hover:text-white transition-colors py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              {item.label}
            </Link>
          ))}

          {/* Accordion dropdowns */}
          {[
            { key: "genre",   label: "Thể Loại",  items: GENRES,    prefix: "/genre" },
            { key: "country", label: "Quốc Gia",  items: COUNTRIES, prefix: "/country" },
            { key: "year",    label: "Năm",        items: YEARS,     prefix: "/year" },
          ].map((group) => (
            <div key={group.key} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <button
                onClick={() => toggleMobile(group.key)}
                className="w-full flex items-center justify-between text-[#8892b0] text-sm hover:text-white transition-colors py-3"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                {group.label}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  width={13}
                  height={13}
                  style={{
                    transition: "transform 0.2s",
                    transform: mobileExpanded === group.key ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {mobileExpanded === group.key && (
                <div className="flex flex-wrap gap-2 pb-3">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`${group.prefix}/${item.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-[#8892b0] hover:text-white transition-colors"
                      style={{
                        background: "rgba(168,85,247,0.08)",
                        border: "1px solid rgba(168,85,247,0.15)",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <Link
              href="/signin"
              className="flex-1 text-center text-sm font-medium py-2 rounded-full text-white"
              style={{ border: "1px solid rgba(168,85,247,0.4)" }}
            >
              Đăng Nhập
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center text-sm font-semibold py-2 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
            >
              Đăng Ký
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
