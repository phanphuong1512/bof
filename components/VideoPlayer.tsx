"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getIsPlaying: () => boolean;
}

interface Props {
  movieTitle: string;
  episodeNumber?: number;
  embedUrl?: string;
  m3u8Url?: string;
  onUserPlay?: (time: number) => void;
  onUserPause?: (time: number) => void;
  onUserSeek?: (time: number) => void;
  onReady?: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, Props>(function VideoPlayer(
  { movieTitle, episodeNumber, embedUrl, m3u8Url, onUserPlay, onUserPause, onUserSeek, onReady },
  ref
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Track remote actions to prevent feedback loops
  const remotePlayCount = useRef(0);
  const remotePauseCount = useRef(0);
  const remoteSeekCount = useRef(0);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        remotePlayCount.current++;
        videoRef.current.play().catch(() => {});
      }
    },
    pause: () => {
      if (videoRef.current) {
        remotePauseCount.current++;
        videoRef.current.pause();
      }
    },
    seekTo: (time: number) => {
      if (videoRef.current) {
        remoteSeekCount.current++;
        videoRef.current.currentTime = time;
      }
    },
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    getDuration: () => videoRef.current?.duration || 0,
    getIsPlaying: () => videoRef.current ? !videoRef.current.paused : false,
  }));

  // Handle HLS luồng m3u8
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !m3u8Url) return;

    let hls: any = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Hỗ trợ HLS mặc định (Safari, iOS Safari)
      video.src = m3u8Url;
    } else {
      // Sử dụng hls.js cho các trình duyệt khác (Chrome, Firefox, Edge...)
      import("hls.js").then((M) => {
        const HlsClass = M.default;
        if (HlsClass.isSupported()) {
          hls = new HlsClass({
            maxMaxBufferLength: 10, // Giới hạn bộ đệm để giảm độ trễ
          });
          hls.loadSource(m3u8Url);
          hls.attachMedia(video);
        }
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.src = "";
    };
  }, [m3u8Url]);

  // Video event handlers
  const handlePlay = () => {
    if (remotePlayCount.current > 0) {
      remotePlayCount.current--;
      return;
    }
    if (onUserPlay && videoRef.current) {
      onUserPlay(videoRef.current.currentTime);
    }
  };

  const handlePause = () => {
    if (remotePauseCount.current > 0) {
      remotePauseCount.current--;
      return;
    }
    if (onUserPause && videoRef.current) {
      onUserPause(videoRef.current.currentTime);
    }
  };

  const handleSeeked = () => {
    if (remoteSeekCount.current > 0) {
      remoteSeekCount.current--;
      return;
    }
    if (onUserSeek && videoRef.current) {
      onUserSeek(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (onReady) {
      onReady();
    }
  };

  return (
    <div className="w-full">
      {/* Player container — 16:9 */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          aspectRatio: "16/9",
          background: "#000",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {m3u8Url ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeeked}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ border: "none" }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(168,85,247,0.2)", border: "2px solid rgba(168,85,247,0.5)" }}
            >
              <svg viewBox="0 0 24 24" fill="#a855f7" width={36} height={36}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg text-center px-4">
              {movieTitle}
              {episodeNumber != null && episodeNumber > 0 && (
                <span className="text-[#8892b0] font-normal text-base block mt-1">
                  Tập {episodeNumber}
                </span>
              )}
            </p>
            <p className="text-[#4a5568] text-xs">Chọn tập để bắt đầu xem</p>
          </div>
        )}
      </div>

      {/* Controls bar below player */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-3 mt-1 rounded-b-xl flex-wrap"
        style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <ControlBtn icon="heart" label="Yêu thích" />
          <ControlBtn icon="plus" label="Danh sách" />
          <ControlBtn icon="share" label="Chia sẻ" />
          <ControlBtn icon="flag" label="Báo lỗi" />
        </div>

        <div className="flex items-center gap-3">
          {m3u8Url && (
            <a
              href={m3u8Url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{
                color: "#a855f7",
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
              title="Mở luồng HLS (M3U8) trong trình phát ngoài"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">HLS</span>
            </a>
          )}
          <ToggleBtn label="Tự động phát" defaultOn />
          <ToggleBtn label="Rạp chiếu" />
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;

function ControlBtn({ icon, label }: { icon: string; label: string }) {
  const paths: Record<string, React.ReactNode> = {
    heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
  };

  return (
    <button
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#8892b0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
      title={label}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={14} height={14}>
        {paths[icon]}
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ToggleBtn({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  return (
    <button className="flex items-center gap-2 text-xs text-[#8892b0] cursor-pointer group">
      <span className="group-hover:text-white transition-colors">{label}</span>
      <div
        className="relative w-8 h-[18px] rounded-full transition-colors"
        style={{
          background: defaultOn
            ? "linear-gradient(135deg, #a855f7, #7c3aed)"
            : "rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform"
          style={{ left: defaultOn ? 14 : 2 }}
        />
      </div>
    </button>
  );
}
