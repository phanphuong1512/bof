"use client";

import Link from "next/link";
import { useState } from "react";

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

type Tab = "genre" | "country" | "year";

const TABS: { id: Tab; label: string }[] = [
  { id: "genre",   label: "Thể loại" },
  { id: "country", label: "Quốc gia" },
  { id: "year",    label: "Năm" },
];

const DATA: Record<Tab, { label: string; slug: string }[]> = {
  genre:   GENRES,
  country: COUNTRIES,
  year:    YEARS,
};

const HREF_PREFIX: Record<Tab, string> = {
  genre:   "/genre",
  country: "/country",
  year:    "/year",
};

export default function FilterBar() {
  const [active, setActive] = useState<Tab>("genre");
  const items = DATA[active];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Header row */}
      <div className="flex items-center gap-2 mb-5">
        <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth={2} width={16} height={16}>
          <path d="M3 6h18M7 12h10M11 18h2" />
        </svg>
        <span className="text-white font-semibold text-base">Lọc phim</span>

        {/* Tabs */}
        <div className="flex items-center gap-1 ml-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                active === tab.id
                  ? { background: "linear-gradient(135deg, #a855f7, #7c3aed)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.06)", color: "#8892b0", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tag chips — horizontally scrollable */}
      <div
        className="flex flex-wrap gap-2"
        style={{ maxHeight: 112, overflow: "hidden" }}
      >
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${HREF_PREFIX[active]}/${item.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
              color: "#c4b5fd",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.22)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.5)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.2)";
              (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
