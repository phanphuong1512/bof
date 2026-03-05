"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(10, 15, 30, 0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <nav className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">BOF</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-white font-medium text-sm hover:text-purple-400 transition-colors">
            Home
          </Link>
          <Link href="/movies" className="text-[#8892b0] text-sm hover:text-white transition-colors">
            Movies
          </Link>
          <Link href="/tv-series" className="text-[#8892b0] text-sm hover:text-white transition-colors">
            TV Series
          </Link>
          <Link href="/upcoming" className="text-[#8892b0] text-sm hover:text-white transition-colors">
            Upcoming
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signin"
            className="text-[#8892b0] text-sm font-medium px-4 py-2 rounded-full hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            Sign Up
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
        <div className="md:hidden px-6 pb-5 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {["Home", "Movies", "TV Series", "Upcoming"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase().replace(" ", "-")}`} className="text-[#8892b0] text-sm hover:text-white transition-colors pt-3">
              {item}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/signin" className="flex-1 text-center text-sm font-medium py-2 rounded-full text-white" style={{ border: "1px solid rgba(168,85,247,0.4)" }}>Sign In</Link>
            <Link href="/signup" className="flex-1 text-center text-sm font-semibold py-2 rounded-full text-white" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
