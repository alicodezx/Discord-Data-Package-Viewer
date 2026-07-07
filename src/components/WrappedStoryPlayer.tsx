"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Server, Users, Trophy, Type, Calendar, Play, Pause, Share2, Download, ArrowRight } from "lucide-react";

interface WrappedStoryPlayerProps {
  user: {
    global_name?: string;
    username: string;
    id?: string;
    avatar_hash?: string | null;
  };
  analytics: {
    totalMessages: number;
    totalWords: number;
    totalAttachments: number;
    averageMessagesPerDay: number;
    longestStreak: { days: number; start: string; end: string };
    currentStreak: number;
    topServers: Array<{ name: string; count: number }>;
    topFriends: Array<{ name: string; messageCount: number }>;
    topWords: Array<{ word: string; count: number }>;
    topEmojis: Array<{ emoji: string; count: number }>;
    accountAge: number;
    mostActiveDay: string;
    messagesByHour: number[];
    genesisMessage?: {
      content: string;
      timestamp: string;
      channelName: string;
    };
    peakMessageDay?: {
      date: string;
      count: number;
    };
  };
  isShared?: boolean;
  onClearShared?: () => void;
}

const SLIDE_DURATION = 6000;
const slides = [
  "intro",
  "messages",
  "topServer",
  "topFriend",
  "streaks",
  "words",
  "activity",
  "outro",
] as const;

export default function WrappedStoryPlayer({
  user,
  analytics,
  isShared = false,
  onClearShared,
}: WrappedStoryPlayerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [shareStatus, setShareStatus] = useState<"idle" | "success" | "error">("idle");
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "rendering" | "success" | "error">("idle");

  const [avatarImg, setAvatarImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const hash = user?.avatar_hash;
    if (!hash) return;
    const getAvatarSrc = () => {
      if (hash.startsWith("data:image/")) {
        return hash;
      }
      return `https://cdn.discordapp.com/avatars/${user.id || "0"}/${hash}.webp?size=128`;
    };
    const src = getAvatarSrc();
    if (src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setAvatarImg(img);
      img.onerror = () => console.warn("Failed to load user avatar for canvas drawing");
      img.src = src;
    }
  }, [user?.avatar_hash, user?.id]);

  const currentSlide = slides[activeIdx];

  
  useEffect(() => {
    if (isPaused || downloadStatus === "rendering") return;

    const intervalTime = 100;
    const steps = SLIDE_DURATION / intervalTime;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeIdx < slides.length - 1) {
            setActiveIdx((idx) => idx + 1);
            return 0;
          } else {
            setIsPaused(true);
            return 100;
          }
        }
        return prev + (100 / steps);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeIdx, isPaused, downloadStatus]);

  const displayName = user?.global_name || user?.username || "Discord Explorer";
  const topServer = analytics.topServers?.[0] || { name: "No Guild", count: 0 };
  const topFriend = analytics.topFriends?.[0] || { name: "No Friend", messageCount: 0 };
  const topWord = analytics.topWords?.[0] || { word: "none", count: 0 };
  const topEmoji = analytics.topEmojis?.[0] || { emoji: "💬", count: 0 };

  const handleNext = () => {
    if (activeIdx < slides.length - 1) {
      setActiveIdx((idx) => idx + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx((idx) => idx - 1);
      setProgress(0);
    }
  };

  const jumpToSlide = (index: number) => {
    setActiveIdx(index);
    setProgress(0);
  };

  
  const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  
  const generateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    
    const grad = ctx.createLinearGradient(0, 0, 600, 800);
    grad.addColorStop(0, "#1a1235");
    grad.addColorStop(0.5, "#0b0d10");
    grad.addColorStop(1, "#1c183a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 800);

    
    ctx.globalAlpha = 0.15;
    const glowGrad1 = ctx.createRadialGradient(100, 100, 50, 100, 100, 250);
    glowGrad1.addColorStop(0, "#5865F2");
    glowGrad1.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad1;
    ctx.beginPath();
    ctx.arc(100, 100, 250, 0, Math.PI * 2);
    ctx.fill();

    const glowGrad2 = ctx.createRadialGradient(500, 700, 50, 500, 700, 300);
    glowGrad2.addColorStop(0, "#F59E0B");
    glowGrad2.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad2;
    ctx.beginPath();
    ctx.arc(500, 700, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    
    ctx.strokeStyle = "rgba(88, 101, 242, 0.3)";
    ctx.lineWidth = 12;
    ctx.strokeRect(16, 16, 568, 768);

    
    ctx.fillStyle = "#5865F2";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("DISCORD INSIGHTS", 45, 74);

    
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    drawRoundRect(ctx, 45, 115, 510, 110, 16);

    
    ctx.save();
    ctx.beginPath();
    ctx.arc(105, 170, 32, 0, Math.PI * 2);
    ctx.clip();

    if (avatarImg) {
      ctx.drawImage(avatarImg, 105 - 32, 170 - 32, 64, 64);
    } else {
      ctx.fillStyle = "#5865F2";
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(displayName[0]?.toUpperCase() || "?", 105, 181);
    }
    ctx.restore();

    
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(displayName, 160, 165);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "normal 16px sans-serif";
    ctx.fillText(`@${user?.username || "unknown"}`, 160, 188);

    
    const years = analytics.accountAge ? Math.floor(analytics.accountAge / 365) : 0;
    ctx.fillStyle = "rgba(88, 101, 242, 0.2)";
    ctx.strokeStyle = "rgba(88, 101, 242, 0.4)";
    drawRoundRect(ctx, 380, 145, 150, 48, 8);
    ctx.fillStyle = "#7C8CFF";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("INSIGHTS MEMBER", 455, 167);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "normal 12px sans-serif";
    ctx.fillText(`${years > 0 ? `${years}+ Years` : "Active Member"}`, 455, 182);

    
    const drawStatBox = (x: number, y: number, w: number, h: number, label: string, value: string, iconKey: string) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      drawRoundRect(ctx, x, y, w, h, 14);

      
      const cx = x + 35;
      const cy = y + 45;
      ctx.fillStyle = "rgba(88, 101, 242, 0.15)";
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      
      ctx.strokeStyle = "#7C8CFF";
      ctx.fillStyle = "#7C8CFF";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (iconKey === "messages") {
        ctx.beginPath();
        ctx.ellipse(cx, cy - 2, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy + 2);
        ctx.lineTo(cx - 8, cy + 7);
        ctx.lineTo(cx - 1, cy + 3);
        ctx.fill();
      } else if (iconKey === "streak") {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 9);
        ctx.bezierCurveTo(cx + 5, cy - 4, cx + 7, cy + 1, cx + 4, cy + 7);
        ctx.bezierCurveTo(cx, cy + 11, cx - 7, cy + 7, cx - 7, cy + 1);
        ctx.bezierCurveTo(cx - 7, cy - 4, cx - 2, cy - 5, cx, cy - 9);
        ctx.closePath();
        ctx.fill();
      } else if (iconKey === "community") {
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(cx, cy + 8);
        ctx.moveTo(cx - 8, cy);
        ctx.lineTo(cx + 8, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, 3.5, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (iconKey === "buddy") {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 3);
        ctx.bezierCurveTo(cx, cy - 7, cx - 7, cy - 7, cx - 7, cy - 2);
        ctx.bezierCurveTo(cx - 7, cy + 2, cx - 2, cy + 5, cx, cy + 8);
        ctx.bezierCurveTo(cx + 2, cy + 5, cx + 7, cy + 2, cx + 7, cy - 2);
        ctx.bezierCurveTo(cx + 7, cy - 7, cx, cy - 7, cx, cy - 3);
        ctx.closePath();
        ctx.fill();
      } else if (iconKey === "word") {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-Math.PI / 4);
        ctx.fillRect(-2, -7, 4, 11);
        ctx.beginPath();
        ctx.moveTo(-2, 4);
        ctx.lineTo(0, 8);
        ctx.lineTo(2, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (iconKey === "emoji") {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 9);
        ctx.quadraticCurveTo(cx, cy, cx + 9, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + 9);
        ctx.quadraticCurveTo(cx, cy, cx - 9, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - 9);
        ctx.closePath();
        ctx.fill();
      }

      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(label.toUpperCase(), x + 70, y + 36);

      let fontSz = 24;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${fontSz}px sans-serif`;
      while (ctx.measureText(value).width > w - 85 && fontSz > 12) {
        fontSz--;
        ctx.font = `bold ${fontSz}px sans-serif`;
      }
      ctx.fillText(value, x + 70, y + 62);
    };

    drawStatBox(45, 245, 245, 90, "Total Messages", analytics.totalMessages.toLocaleString(), "messages");
    drawStatBox(310, 245, 245, 90, "Active Streak", `${analytics.longestStreak?.days || 0} Days`, "streak");
    
    drawStatBox(45, 355, 245, 90, "Top Community", topServer.name, "community");
    drawStatBox(310, 355, 245, 90, "Top Buddy", topFriend.name, "buddy");

    drawStatBox(45, 465, 245, 90, "Frequent Word", `"${topWord.word}"`, "word");
    drawStatBox(310, 465, 245, 90, "Top Emoji", topEmoji.emoji, "emoji");

    
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    ctx.strokeStyle = "rgba(88, 101, 242, 0.15)";
    drawRoundRect(ctx, 45, 575, 510, 110, 16);

    ctx.fillStyle = "#7C8CFF";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("GENESIS MESSAGE ARCHIVE", 65, 604);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "italic 16px sans-serif";
    const quote = analytics.genesisMessage?.content || "hello world!";
    let quoteText = quote.length > 55 ? quote.substring(0, 52) + "..." : quote;
    ctx.fillText(`"${quoteText}"`, 65, 634);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "normal 12px sans-serif";
    const chan = analytics.genesisMessage?.channelName || "general";
    const timeStr = analytics.genesisMessage?.timestamp 
      ? new Date(analytics.genesisMessage.timestamp.replace(" ", "T")).toLocaleDateString()
      : "Initial Join";
    ctx.fillText(`Sent in #${chan} on ${timeStr}`, 65, 657);

    
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DISCORD INSIGHTS  |  ALICODEZX.GITHUB.IO", 300, 735);

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.font = "normal 10px sans-serif";
    ctx.fillText("Rendered locally inside web client. Safe and private.", 300, 752);

    return canvas;
  };

  
  const shareStats = async () => {
    try {
      const payload = {
        user: {
          username: user.username,
          global_name: user.global_name,
        },
        stats: {
          totalMessages: analytics.totalMessages,
          totalWords: analytics.totalWords,
          totalAttachments: analytics.totalAttachments,
          averageMessagesPerDay: analytics.averageMessagesPerDay,
          longestStreak: analytics.longestStreak,
          currentStreak: analytics.currentStreak,
          topServers: analytics.topServers ? analytics.topServers.slice(0, 3) : [],
          topFriends: analytics.topFriends ? analytics.topFriends.slice(0, 3) : [],
          topWords: analytics.topWords ? analytics.topWords.slice(0, 6) : [],
          topEmojis: analytics.topEmojis ? analytics.topEmojis.slice(0, 3) : [],
          accountAge: analytics.accountAge,
          mostActiveDay: analytics.mostActiveDay,
          messagesByHour: analytics.messagesByHour,
          genesisMessage: analytics.genesisMessage,
          peakMessageDay: analytics.peakMessageDay,
        }
      };

      const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const serialized = base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${serialized}`;

      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("success");
      setTimeout(() => setShareStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      setShareStatus("error");
      setTimeout(() => setShareStatus("idle"), 3000);
    }
  };

  
  const downloadStatsCard = async () => {
    setDownloadStatus("rendering");
    try {
      
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const canvas = generateCanvas();
      if (!canvas) throw new Error("Failed to generate canvas");

      const link = document.createElement("a");
      link.download = `${displayName.replace(/\s+/g, "_")}_discord_insights.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      setDownloadStatus("success");
      setTimeout(() => setDownloadStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full select-none">
      
      {/* Play/Pause controls */}
      <div className="absolute top-[-30px] right-2 flex items-center gap-2 z-30">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#12151A]/80 border border-[#252B34] text-white hover:bg-[#252B34] transition-all"
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>

      {/* Progress indicators */}
      <div className="flex gap-1 mb-4 w-full max-w-lg z-20 px-2">
        {slides.map((s, i) => (
          <div
            key={s}
            onClick={() => jumpToSlide(i)}
            className="h-1 flex-1 bg-[#252B34] rounded-full overflow-hidden cursor-pointer relative"
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#5865F2] to-[#7C8CFF]"
              style={{
                width: i < activeIdx ? "100%" : i === activeIdx ? `${progress}%` : "0%",
                transition: "width 100ms linear",
              }}
            />
          </div>
        ))}
      </div>

      {/* Shortened Card Wrapper: height restricted to 520px / 560px for compact visual hierarchy */}
      <div className="w-full max-w-lg relative h-[520px] md:h-[550px] rounded-3xl border border-[#252B34] overflow-hidden flex flex-col shadow-2xl bg-black">
        
        {/* Navigation tap overlays */}
        {currentSlide !== "outro" && (
          <>
            <div className="absolute top-0 bottom-28 left-0 w-1/4 z-20 cursor-w-resize" onClick={handlePrev} />
            <div className="absolute top-0 bottom-28 right-0 w-1/4 z-20 cursor-e-resize" onClick={handleNext} />
            <div className="absolute top-0 bottom-28 left-1/4 right-1/4 z-20" onClick={() => setIsPaused(!isPaused)} />
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 flex flex-col p-6 md:p-8 justify-between z-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Slide Gradients */}
            <div 
              className={`absolute inset-0 bg-gradient-to-b -z-10 transition-all duration-1000 ${
                currentSlide === "intro" ? "from-[#1a1235] via-[#0B0D10] to-[#12151A]" :
                currentSlide === "messages" ? "from-[#1b2a47] via-[#0B0D10] to-[#12151A]" :
                currentSlide === "topServer" ? "from-[#0f3224] via-[#0B0D10] to-[#12151A]" :
                currentSlide === "topFriend" ? "from-[#44132c] via-[#0B0D10] to-[#12151A]" :
                currentSlide === "streaks" ? "from-[#38260c] via-[#0B0D10] to-[#12151A]" :
                currentSlide === "words" ? "from-[#2b183a] via-[#0B0D10] to-[#12151A]" :
                currentSlide === "activity" ? "from-[#1a2b3c] via-[#0B0D10] to-[#12151A]" :
                "from-[#21153b] via-[#0B0D10] to-[#12151A]"
              }`}
            />

            {/* Glowing background circles */}
            <div className="absolute top-1/4 left-1/4 w-56 h-56 rounded-full bg-radial from-[#5865F2]/10 to-transparent blur-2xl -z-10 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-radial from-[#e91e8c]/5 to-transparent blur-2xl -z-10 pointer-events-none" />

            {/* Slide 1: Intro */}
            {currentSlide === "intro" && (
              <>

                
                <div className="my-auto text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-3xl bg-[#5865F2] flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4 shadow-xl overflow-hidden"
                  >
                    {user?.avatar_hash ? (
                      <img 
                        src={user.avatar_hash.startsWith("data:image/") ? user.avatar_hash : `https://cdn.discordapp.com/avatars/${user.id || "0"}/${user.avatar_hash}.webp?size=128`} 
                        alt={displayName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      displayName[0]?.toUpperCase()
                    )}
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight px-4">
                    Your year in chat, <span className="text-[#7C8CFF]">{displayName}</span>.
                  </h2>
                  <p className="text-[#9DA7B3] text-sm md:text-base leading-relaxed max-w-[340px] mx-auto">
                    Let&apos;s step back and look at your entire footprint in the Discord ecosystem.
                  </p>
                </div>

                <div className="text-center text-[#5E6976] text-xs font-semibold uppercase tracking-wider animate-pulse">
                  Tap right to start
                </div>
              </>
            )}

            {/* Slide 2: Messages */}
            {currentSlide === "messages" && (
              <>


                <div className="my-auto text-center space-y-3">
                  <p className="text-[#9DA7B3] text-xs md:text-sm uppercase tracking-widest font-bold">You typed and sent</p>
                  <h2 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter">
                    {analytics.totalMessages.toLocaleString()}
                  </h2>
                  <p className="text-[#7C8CFF] font-bold text-base md:text-lg">messages sent across your data.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#252B34]/60 max-w-[320px] mx-auto">
                    <div>
                      <span className="text-[#5E6976] text-xs font-bold uppercase tracking-wider block mb-1">Words</span>
                      <span className="text-white text-lg md:text-xl font-black font-mono">{analytics.totalWords.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#5E6976] text-xs font-bold uppercase tracking-wider block mb-1">Attachments</span>
                      <span className="text-white text-lg md:text-xl font-black font-mono">{analytics.totalAttachments.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-xs md:text-sm font-medium">
                  Averaging about {analytics.averageMessagesPerDay.toFixed(0)} messages daily.
                </div>
              </>
            )}

            {/* Slide 3: Top Server */}
            {currentSlide === "topServer" && (
              <>


                <div className="my-auto text-center space-y-5">
                  <p className="text-[#9DA7B3] text-xs md:text-sm uppercase tracking-widest font-bold">Your main community was</p>
                  <div className="w-20 h-20 rounded-3xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center mx-auto text-[#34D399]">
                    <Server size={40} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight px-4 leading-tight">
                    {topServer.name}
                  </h2>
                  <div className="inline-block bg-[#12151A] px-4 py-2 rounded-xl border border-[#252B34] text-sm">
                    <span className="text-white font-extrabold">{topServer.count.toLocaleString()}</span>
                    <span className="text-[#9DA7B3] text-[12px] ml-1.5 font-medium">messages sent.</span>
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-xs md:text-sm font-medium">
                  Making up {((topServer.count / analytics.totalMessages) * 100).toFixed(1)}% of your timeline.
                </div>
              </>
            )}

            {/* Slide 4: Top Friend */}
            {currentSlide === "topFriend" && (
              <>


                <div className="my-auto text-center space-y-5">
                  <p className="text-[#9DA7B3] text-xs md:text-sm uppercase tracking-widest font-bold">You chatted most with</p>
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#e91e8c] to-[#7c8cff] flex items-center justify-center mx-auto text-white text-3xl font-black shadow-lg">
                    {topFriend.name[0]?.toUpperCase() || "?"}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight px-4">
                    {topFriend.name}
                  </h2>
                  <div className="inline-block bg-[#12151A] px-4 py-2 rounded-xl border border-[#252B34] text-sm">
                    <span className="text-[#e91e8c] font-black">{topFriend.messageCount.toLocaleString()}</span>
                    <span className="text-[#9DA7B3] text-[12px] ml-1.5 font-medium">exchanged.</span>
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-xs md:text-sm font-medium">
                  True linguistic alignment!
                </div>
              </>
            )}

            {/* Slide 5: Streaks */}
            {currentSlide === "streaks" && (
              <>


                <div className="my-auto text-center space-y-5">
                  <p className="text-[#9DA7B3] text-xs md:text-sm uppercase tracking-widest font-bold">Your longest daily streak is</p>
                  <h2 className="text-7xl md:text-8xl font-black text-[#F59E0B] tracking-tighter">
                    {analytics.longestStreak?.days || 0}
                  </h2>
                  <p className="text-white text-base md:text-lg font-black">Consecutive Days Online</p>
                  
                  {analytics.longestStreak?.start && (
                    <p className="text-[#9DA7B3] text-xs md:text-sm font-mono">
                      From {new Date(analytics.longestStreak.start.replace(" ", "T")).toLocaleDateString()} to {new Date(analytics.longestStreak.end.replace(" ", "T")).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="text-center text-[#5E6976] text-xs md:text-sm font-medium">
                  Current active streak is {analytics.currentStreak} days.
                </div>
              </>
            )}

            {/* Slide 6: Words */}
            {currentSlide === "words" && (
              <>


                <div className="my-auto text-center space-y-5">
                  <p className="text-[#9DA7B3] text-xs md:text-sm uppercase tracking-widest font-bold">Your favorite word was</p>
                  <div className="text-5xl md:text-6xl font-black text-[#7C8CFF] tracking-tight leading-none">
                    &quot;{topWord.word}&quot;
                  </div>
                  <p className="text-white text-sm md:text-base font-semibold">used {topWord.count.toLocaleString()} times.</p>

                  <div className="flex flex-wrap gap-2 justify-center max-w-[300px] mx-auto">
                    {analytics.topWords?.slice(1, 5).map((w, idx) => (
                      <span key={w.word} className="px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252B34] text-[#9DA7B3] text-xs font-medium" style={{ opacity: 1 - idx * 0.18 }}>
                        {w.word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-xs md:text-sm font-medium">
                  Filtered common structure words.
                </div>
              </>
            )}

            {/* Slide 7: Activity */}
            {currentSlide === "activity" && (
              <>


                <div className="my-auto text-center space-y-4">
                  <p className="text-[#9DA7B3] text-xs md:text-sm uppercase tracking-widest font-bold">Your peak activity hour occurs at</p>
                  <h2 className="text-5xl md:text-6xl font-black text-white">
                    {analytics.messagesByHour ? `${analytics.messagesByHour.indexOf(Math.max(...analytics.messagesByHour))}:00 UTC` : "—"}
                  </h2>
                  <p className="text-white text-sm md:text-base leading-relaxed max-w-[280px] mx-auto">
                    Your favorite day to send messages is <span className="text-[#5865F2] font-bold">{analytics.mostActiveDay}</span>.
                  </p>
                </div>

                <div className="text-center text-[#5E6976] text-xs md:text-sm font-medium">
                  Calculated from message timestamps.
                </div>
              </>
            )}

            {/* Slide 8: Outro & Share Card */}
            {currentSlide === "outro" && (
              <>


                <div className="my-auto w-full flex flex-col items-center">
                  <div className="bg-[#12151A]/90 p-5 rounded-2xl border border-[#252B34] w-full text-center relative overflow-hidden shadow-xl mb-4">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-radial from-[#5865F2]/10 to-transparent pointer-events-none" />
                    
                    <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-xl font-bold mx-auto mb-2 shadow-md overflow-hidden border-2 border-[#252B34]">
                      {user?.avatar_hash ? (
                        <img 
                          src={user.avatar_hash.startsWith("data:image/") ? user.avatar_hash : `https://cdn.discordapp.com/avatars/${user.id || "0"}/${user.avatar_hash}.webp?size=128`} 
                          alt={displayName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        displayName[0]?.toUpperCase()
                      )}
                    </div>
                    <p className="text-white text-base font-black truncate leading-tight">{displayName}</p>
                    <p className="text-[#5E6976] text-[10px] uppercase font-bold tracking-wider mb-4">Discord Explorer</p>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="bg-[#171B21] py-3 px-3.5 rounded-xl border border-[#252B34] flex flex-col justify-between min-h-[64px]">
                        <span className="text-[#5E6976] text-[9px] font-bold uppercase tracking-wider block mb-0.5">Messages</span>
                        <span className="text-white text-base md:text-lg font-black tracking-tight leading-none">{analytics.totalMessages.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#171B21] py-3 px-3.5 rounded-xl border border-[#252B34] flex flex-col justify-between min-h-[64px]">
                        <span className="text-[#5E6976] text-[9px] font-bold uppercase tracking-wider block mb-0.5">Streak</span>
                        <span className="text-white text-base md:text-lg font-black tracking-tight leading-none">{(analytics.longestStreak?.days || 0)} Days</span>
                      </div>
                      <div className="bg-[#171B21] py-3 px-3.5 rounded-xl border border-[#252B34] flex flex-col justify-between min-h-[64px]">
                        <span className="text-[#5E6976] text-[9px] font-bold uppercase tracking-wider block mb-0.5">Top Server</span>
                        <span className="text-white text-xs md:text-sm font-bold truncate block leading-tight">{topServer.name}</span>
                      </div>
                      <div className="bg-[#171B21] py-3 px-3.5 rounded-xl border border-[#252B34] flex flex-col justify-between min-h-[64px]">
                        <span className="text-[#5E6976] text-[9px] font-bold uppercase tracking-wider block mb-0.5">Top Friend</span>
                        <span className="text-white text-xs md:text-sm font-bold truncate block leading-tight">{topFriend.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Share & Download Actions */}
                  <div className="w-full grid grid-cols-2 gap-2 relative z-30">
                    <button
                      onClick={shareStats}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[11px] font-bold text-black transition-all ${
                        shareStatus === "success" 
                          ? "bg-[#34D399] hover:bg-[#34D399]" 
                          : shareStatus === "error" 
                          ? "bg-red-500 text-white" 
                          : "bg-white hover:bg-white/90"
                      }`}
                    >
                      <Share2 size={12} />
                      <span>{shareStatus === "success" ? "Link Copied!" : shareStatus === "error" ? "Failed" : "Share Stats"}</span>
                    </button>
                    <button
                      onClick={downloadStatsCard}
                      disabled={downloadStatus === "rendering"}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[11px] font-bold text-white transition-all bg-[#171B21] border border-[#252B34] hover:bg-[#252B34] ${
                        downloadStatus === "success" ? "text-[#34D399]" : ""
                      }`}
                    >
                      <Download size={12} />
                      <span>{downloadStatus === "rendering" ? "Saving..." : downloadStatus === "success" ? "Saved!" : "Download Card"}</span>
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => jumpToSlide(0)}
                    className="text-[10px] text-[#9DA7B3] hover:text-white transition-colors"
                  >
                    Watch recap again
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shared landing callout header */}
      {isShared && (
        <div className="mt-6 text-center max-w-sm px-4">
          <p className="text-xs text-[#9DA7B3] mb-3">
            You are viewing a shared Discord Data Package Viewer recap page!
          </p>
          <button
            onClick={onClearShared}
            className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#7C8CFF] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
          >
            <span>Analyze Your Own Discord Data</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
