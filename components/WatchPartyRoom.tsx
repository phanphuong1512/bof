"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ref, onValue, set, push, serverTimestamp, update } from "firebase/database";
import { db } from "@/lib/firebase";
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer";

interface Props {
  movieTitle: string;
  movieSlug: string;
  episodeNumber?: number;
  embedUrl?: string;
  m3u8Url?: string;
  episodeSlug?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export default function WatchPartyRoom({
  movieTitle,
  movieSlug,
  episodeNumber,
  embedUrl,
  m3u8Url,
  episodeSlug,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partyRoomId = searchParams.get("party");

  const playerRef = useRef<VideoPlayerRef>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // States
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [hostId, setHostId] = useState<string>("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);

  const [isLoadingRoom, setIsLoadingRoom] = useState(false);

  const isHost = userId === hostId;

  // 1. Khởi tạo userId và username ngẫu nhiên từ localStorage/sessionStorage
  useEffect(() => {
    let savedUserId = localStorage.getItem("bof_wp_user_id");
    if (!savedUserId) {
      savedUserId = "user_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("bof_wp_user_id", savedUserId);
    }
    setUserId(savedUserId);

    let savedUsername = localStorage.getItem("bof_wp_username");
    if (!savedUsername) {
      savedUsername = "Người xem " + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem("bof_wp_username", savedUsername);
    }
    setUsername(savedUsername);
    setTempUsername(savedUsername);
  }, []);

  // 2. Kết nối và đồng bộ phòng từ Firebase
  useEffect(() => {
    if (!partyRoomId || !userId || !db) return;

    setIsLoadingRoom(true);
    const roomRef = ref(db, `rooms/${partyRoomId}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setIsLoadingRoom(false);

      if (!data) {
        // Phòng không tồn tại, tự động tạo phòng mới hoặc thoát
        return;
      }

      setHostId(data.hostId || "");
      
      // Đếm số người tham gia (nếu có lưu)
      if (data.participants) {
        setParticipantCount(Object.keys(data.participants).length);
      } else {
        setParticipantCount(1);
      }

      // Đồng bộ trạng thái chơi nhạc/phim của Guest từ Host
      if (data.state && userId !== data.hostId) {
        const { isPlaying, currentTime, updatedAt } = data.state;
        const player = playerRef.current;
        if (player) {
          // Tính độ lệch thời gian do độ trễ truyền tin
          const elapsed = (Date.now() - updatedAt) / 1000;
          const expectedTime = isPlaying ? currentTime + elapsed : currentTime;
          
          const localIsPlaying = player.getIsPlaying();
          const localTime = player.getCurrentTime();

          // Đồng bộ Play/Pause
          if (isPlaying && !localIsPlaying) {
            player.seekTo(expectedTime);
            player.play();
          } else if (!isPlaying && localIsPlaying) {
            player.pause();
            player.seekTo(expectedTime);
          }

          // Đồng bộ Tua (Seek) nếu lệch quá 1.5 giây
          const drift = Math.abs(localTime - expectedTime);
          if (drift > 1.8) {
            player.seekTo(expectedTime);
          }
        }
      }

      // Load tin nhắn chat
      if (data.chat) {
        const messages: ChatMessage[] = Object.entries(data.chat).map(([key, val]: any) => ({
          id: key,
          sender: val.sender,
          text: val.text,
          timestamp: val.timestamp,
        }));
        setChatMessages(messages.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setChatMessages([]);
      }
    });

    if (!db || !partyRoomId) return;

    // Đăng ký sự có mặt của người xem (Participants)
    const myParticipantRef = ref(db, `rooms/${partyRoomId}/participants/${userId}`);
    set(myParticipantRef, {
      username: username,
      joinedAt: serverTimestamp(),
    });

    return () => {
      unsubscribe();
      // Rời phòng: xóa trạng thái có mặt
      set(ref(db, `rooms/${partyRoomId}/participants/${userId}`), null);
    };
  }, [partyRoomId, userId, username]);

  // Tự động cuộn chat xuống dưới cùng
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 3. Tạo phòng Watch Party mới
  const handleCreateParty = () => {
    const newRoomId = "party_" + Math.random().toString(36).substring(2, 15);
    const roomRef = ref(db, `rooms/${newRoomId}`);
    
    // Ghi cấu trúc dữ liệu phòng ban đầu
    set(roomRef, {
      roomId: newRoomId,
      hostId: userId,
      movieSlug: movieSlug,
      episodeSlug: episodeSlug || "full",
      movieTitle: movieTitle,
      createdAt: serverTimestamp(),
      state: {
        isPlaying: false,
        currentTime: 0,
        updatedAt: Date.now(),
        lastAction: "INIT",
      },
      chat: {
        system_init: {
          sender: "Hệ thống",
          text: `Phòng xem chung đã được tạo bởi ${username}. Hãy chia sẻ link để bạn bè cùng tham gia!`,
          timestamp: Date.now(),
        }
      }
    }).then(() => {
      router.push(`/watch/${movieSlug}?ep=${episodeSlug || ""}&server=0&party=${newRoomId}`);
    });
  };

  // 4. Rời phòng xem chung
  const handleLeaveParty = () => {
    if (partyRoomId) {
      set(ref(db, `rooms/${partyRoomId}/participants/${userId}`), null);
      router.push(`/watch/${movieSlug}?ep=${episodeSlug || ""}&server=0`);
    }
  };

  // 5. Cập nhật trạng thái video lên Firebase (Chỉ dành cho Host)
  const updateFirebaseState = (action: string, time: number, isPlaying: boolean) => {
    if (!partyRoomId || !isHost) return;
    
    const stateRef = ref(db, `rooms/${partyRoomId}/state`);
    update(stateRef, {
      isPlaying,
      currentTime: time,
      updatedAt: Date.now(),
      lastAction: action,
    });
  };

  const handleUserPlay = (time: number) => {
    if (isHost) {
      updateFirebaseState("PLAY", time, true);
    }
  };

  const handleUserPause = (time: number) => {
    if (isHost) {
      updateFirebaseState("PAUSE", time, false);
    }
  };

  const handleUserSeek = (time: number) => {
    if (isHost) {
      // Giữ nguyên trạng thái play/pause hiện tại của Host
      const player = playerRef.current;
      const isPlaying = player ? player.getIsPlaying() : false;
      updateFirebaseState("SEEK", time, isPlaying);
    }
  };

  // 6. Gửi tin nhắn chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !partyRoomId) return;

    const chatRef = ref(db, `rooms/${partyRoomId}/chat`);
    push(chatRef, {
      sender: username,
      text: inputText.trim(),
      timestamp: Date.now(),
    });

    setInputText("");
  };

  // 7. Thay đổi tên hiển thị
  const handleSaveUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      localStorage.setItem("bof_wp_username", tempUsername.trim());
      setIsEditingUsername(false);
      
      // Cập nhật tên trong danh sách participants nếu đang ở trong phòng
      if (partyRoomId && userId) {
        set(ref(db, `rooms/${partyRoomId}/participants/${userId}/username`), tempUsername.trim());
      }
    }
  };

  // 8. Sao chép link mời
  const copyInviteLink = () => {
    const inviteUrl = window.location.href;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* CỘT TRÁI: Trình phát Video + Panel cài đặt xem chung */}
      <div className="flex-1 min-w-0">
        <VideoPlayer
          ref={playerRef}
          movieTitle={movieTitle}
          episodeNumber={episodeNumber}
          embedUrl={embedUrl}
          m3u8Url={m3u8Url}
          onUserPlay={handleUserPlay}
          onUserPause={handleUserPause}
          onUserSeek={handleUserSeek}
        />

        {/* Bảng điều khiển Watch Party phía dưới Player */}
        <div 
          className="mt-4 p-5 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md"
        >
          {!db ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-base mb-1">Xem Phim Chung (Watch Party)</h4>
                <p className="text-xs text-[#8892b0]">
                  Tính năng Xem Chung hiện chưa được cấu hình trên môi trường này (Thiếu biến môi trường Firebase API Key). Vui lòng thêm các khóa cấu hình trong bảng điều khiển Cloudflare.
                </p>
              </div>
            </div>
          ) : !partyRoomId ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-base mb-1">Xem Phim Chung (Watch Party)</h4>
                <p className="text-xs text-[#8892b0]">
                  Tạo phòng xem chung, rủ bạn bè tham gia để phim tự động đồng bộ thời gian phát và chat cùng nhau.
                </p>
              </div>
              <button
                onClick={handleCreateParty}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer shadow-lg shadow-purple-500/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Tạo Watch Party
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-purple-600">
                      Đang xem chung
                    </span>
                    <span className="text-xs text-[#8892b0]">
                      Mã phòng: <code className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px]">{partyRoomId.substring(6, 12)}</code>
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      &bull; {participantCount} người đang xem
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8892b0]">
                    {isHost 
                      ? "Bạn là Chủ phòng (Host). Mọi thao tác Play/Pause/Tua của bạn sẽ đồng bộ tới mọi người."
                      : "Bạn đang xem chung. Trình phát sẽ tự động đồng bộ theo thời gian của Chủ phòng."
                    }
                  </p>
                </div>
                <button
                  onClick={handleLeaveParty}
                  className="px-4 py-2 rounded-full text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
                >
                  Thoát Phòng
                </button>
              </div>

              {/* Tên hiển thị người dùng */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8892b0]">Biệt danh của bạn:</span>
                {isEditingUsername ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      maxLength={18}
                      className="px-2 py-1 rounded bg-white/10 text-white border border-white/10 text-xs focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="px-2 py-1 rounded bg-purple-600 text-white font-semibold cursor-pointer"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => { setTempUsername(username); setIsEditingUsername(false); }}
                      className="px-2 py-1 rounded bg-white/5 text-[#8892b0] cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{username}</span>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      (Thay đổi)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: Khung Chat thời gian thực (Chỉ hiển thị khi đang ở trong phòng) */}
      {partyRoomId && (
        <div 
          className="w-full lg:w-[340px] flex-shrink-0 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-4 flex flex-col justify-between"
          style={{ height: "clamp(450px, 60vh, 580px)" }}
        >
          {/* Header phòng chat */}
          <div className="border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Trò chuyện nhóm
            </h4>
            
            {/* Box sao chép link mời */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/5 border border-white/5">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="flex-1 min-w-0 bg-transparent text-[10px] text-[#8892b0] focus:outline-none select-all px-1"
              />
              <button
                onClick={copyInviteLink}
                className="px-2.5 py-1 rounded text-[10px] font-bold text-white bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all cursor-pointer flex-shrink-0"
              >
                {isCopied ? "Đã copy" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-4">
                <p className="text-[11px] text-[#4a5568]">Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!</p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isSystem = msg.sender === "Hệ thống";
                const isMe = msg.sender === username;

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center py-1">
                      <span className="text-[9px] text-[#6b7a99] bg-white/5 px-2 py-0.5 rounded-full inline-block">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-[#8892b0] mb-0.5 px-1">{msg.sender}</span>
                    <div 
                      className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs ${
                        isMe 
                          ? "bg-purple-600 text-white rounded-tr-none" 
                          : "bg-white/10 text-white rounded-tl-none"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form nhập tin nhắn */}
          <form onSubmit={handleSendMessage} className="border-t border-white/5 pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập nội dung tin nhắn..."
                maxLength={200}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 focus:bg-white/[0.08]"
              />
              <button
                type="submit"
                className="px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center cursor-pointer transition-colors active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
