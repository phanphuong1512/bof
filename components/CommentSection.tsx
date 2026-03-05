"use client";

export default function CommentSection() {
  return (
    <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-sm font-bold text-white">Comments</h3>
        <span className="text-xs text-[#8892b0]">(0)</span>
      </div>

      {/* Comment input */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <textarea
          placeholder="Write a comment..."
          rows={3}
          className="w-full bg-transparent text-sm text-white placeholder-[#4a5568] resize-none focus:outline-none"
        />
        <div className="flex justify-end mt-2">
          <button
            className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            Post
          </button>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center py-12 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="#2d3a5a" strokeWidth={1.2} width={48} height={48} className="mb-3">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <p className="text-sm text-[#4a5568]">No comments yet. Be the first to share your thoughts.</p>
      </div>
    </div>
  );
}
