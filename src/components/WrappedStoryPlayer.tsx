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

  const currentSlide = slides[activeIdx];

  // Auto-progress handler
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

  // Helper to draw rounded rectangle on canvas
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

  // Core function to draw stats to Canvas
  const generateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Draw Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 800);
    grad.addColorStop(0, "#1a1235");
    grad.addColorStop(0.5, "#0b0d10");
    grad.addColorStop(1, "#1c183a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 800);

    // Decorative Glows
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

    // Stroke Border Frame
    ctx.strokeStyle = "rgba(88, 101, 242, 0.3)";
    ctx.lineWidth = 12;
    ctx.strokeRect(16, 16, 568, 768);

    // Header Branding
    ctx.fillStyle = "#5865F2";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("DISCORD WRAPPED RECAP", 45, 65);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "normal 11px sans-serif";
    ctx.fillText("DATA INSIGHTS ENGINE", 45, 82);

    // Profile Card background
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    drawRoundRect(ctx, 45, 115, 510, 110, 16);

    // Profile Avatar
    ctx.fillStyle = "#5865F2";
    ctx.beginPath();
    ctx.arc(105, 170, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(displayName[0]?.toUpperCase() || "?", 105, 181);

    // Profile Info text
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(displayName, 160, 165);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "normal 14px sans-serif";
    ctx.fillText(`@${user?.username || "unknown"}`, 160, 188);

    // Era Badge
    const years = analytics.accountAge ? Math.floor(analytics.accountAge / 365) : 0;
    ctx.fillStyle = "rgba(88, 101, 242, 0.2)";
    ctx.strokeStyle = "rgba(88, 101, 242, 0.4)";
    drawRoundRect(ctx, 380, 148, 150, 42, 8);
    ctx.fillStyle = "#7C8CFF";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("INSIGHTS MEMBER", 455, 168);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "normal 10px sans-serif";
    ctx.fillText(`${years > 0 ? `${years}+ Years` : "Active Member"}`, 455, 181);

    // Stats boxes drawing helper
    const drawStatBox = (x: number, y: number, w: number, h: number, label: string, value: string, icon: string) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      drawRoundRect(ctx, x, y, w, h, 14);

      // Icon circle
      ctx.fillStyle = "rgba(88, 101, 242, 0.15)";
      ctx.beginPath();
      ctx.arc(x + 35, y + 45, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#7C8CFF";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(icon, x + 35, y + 50);

      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText(label.toUpperCase(), x + 70, y + 36);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px sans-serif";
      let fontSz = 18;
      ctx.font = `bold ${fontSz}px sans-serif`;
      while (ctx.measureText(value).width > w - 85 && fontSz > 10) {
        fontSz--;
        ctx.font = `bold ${fontSz}px sans-serif`;
      }
      ctx.fillText(value, x + 70, y + 60);
    };

    drawStatBox(45, 245, 245, 90, "Total Messages", analytics.totalMessages.toLocaleString(), "💬");
    drawStatBox(310, 245, 245, 90, "Active Streak", `${analytics.longestStreak?.days || 0} Days`, "🔥");
    
    drawStatBox(45, 355, 245, 90, "Top Community", topServer.name, "🌐");
    drawStatBox(310, 355, 245, 90, "Top Buddy", topFriend.name, "❤️");

    drawStatBox(45, 465, 245, 90, "Frequent Word", `"${topWord.word}"`, "✍️");
    drawStatBox(310, 465, 245, 90, "Top Emoji", topEmoji.emoji, "✨");

    // Quote Box
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    ctx.strokeStyle = "rgba(88, 101, 242, 0.15)";
    drawRoundRect(ctx, 45, 575, 510, 110, 16);

    ctx.fillStyle = "#7C8CFF";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("GENESIS MESSAGE ARCHIVE", 65, 604);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "italic 13px sans-serif";
    const quote = analytics.genesisMessage?.content || "hello world!";
    let quoteText = quote.length > 55 ? quote.substring(0, 52) + "..." : quote;
    ctx.fillText(`"${quoteText}"`, 65, 634);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "normal 10px sans-serif";
    const chan = analytics.genesisMessage?.channelName || "general";
    const timeStr = analytics.genesisMessage?.timestamp 
      ? new Date(analytics.genesisMessage.timestamp.replace(" ", "T")).toLocaleDateString()
      : "Initial Join";
    ctx.fillText(`Sent in #${chan} on ${timeStr}`, 65, 655);

    // Watermark
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DISCORD DATA PACKAGE VIEWER  |  ALICODEZX.GITHUB.IO", 300, 735);

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.font = "normal 8px sans-serif";
    ctx.fillText("Rendered locally inside web client. Safe and private.", 300, 750);

    return canvas;
  };

  // 1. Share Stats Action
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

      const serialized = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
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

  // 2. Download Action
  const downloadStatsCard = async () => {
    setDownloadStatus("rendering");
    try {
      // Delay slightly to let the button active animation complete
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
        <div className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-w-resize" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/4 z-20 cursor-e-resize" onClick={handleNext} />
        <div className="absolute inset-y-0 left-1/4 right-1/4 z-20" onClick={() => setIsPaused(!isPaused)} />

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
                <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold text-[10px] uppercase tracking-widest">
                  <Star size={12} className="fill-[#F59E0B]" />
                  <span>Wrapped Recap</span>
                </div>
                
                <div className="my-auto text-center space-y-3">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4 shadow-xl"
                  >
                    {displayName[0]?.toUpperCase()}
                  </motion.div>
                  <h2 className="text-3xl font-black text-white leading-tight tracking-tight px-4">
                    Your year in chat, <span className="text-[#7C8CFF]">{displayName}</span>.
                  </h2>
                  <p className="text-[#9DA7B3] text-xs leading-relaxed max-w-[280px] mx-auto">
                    Let&apos;s step back and look at your entire footprint in the Discord ecosystem.
                  </p>
                </div>

                <div className="text-center text-[#5E6976] text-[9px] uppercase tracking-wider animate-pulse">
                  Tap right to start
                </div>
              </>
            )}

            {/* Slide 2: Messages */}
            {currentSlide === "messages" && (
              <>
                <div className="flex items-center gap-1.5 text-[#7C8CFF] font-bold text-[10px] uppercase tracking-widest">
                  <MessageSquare size={12} />
                  <span>Linguistic Volume</span>
                </div>

                <div className="my-auto text-center space-y-2">
                  <p className="text-[#9DA7B3] text-[10px] uppercase tracking-widest font-bold">You typed and sent</p>
                  <h2 className="text-5xl font-black text-white leading-none tracking-tighter">
                    {analytics.totalMessages.toLocaleString()}
                  </h2>
                  <p className="text-[#7C8CFF] font-bold text-sm">messages sent across your data.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#252B34]/60 max-w-[280px] mx-auto">
                    <div>
                      <span className="text-[#5E6976] text-[9px] font-bold uppercase tracking-wider block">Words</span>
                      <span className="text-white text-base font-bold font-mono">{analytics.totalWords.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[#5E6976] text-[9px] font-bold uppercase tracking-wider block">Attachments</span>
                      <span className="text-white text-base font-bold font-mono">{analytics.totalAttachments.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-[10px]">
                  Averaging about {analytics.averageMessagesPerDay.toFixed(0)} messages daily.
                </div>
              </>
            )}

            {/* Slide 3: Top Server */}
            {currentSlide === "topServer" && (
              <>
                <div className="flex items-center gap-1.5 text-[#34D399] font-bold text-[10px] uppercase tracking-widest">
                  <Server size={12} />
                  <span>Primary Habitat</span>
                </div>

                <div className="my-auto text-center space-y-4">
                  <p className="text-[#9DA7B3] text-[10px] uppercase tracking-widest font-bold">Your main community was</p>
                  <div className="w-16 h-16 rounded-2xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center mx-auto text-[#34D399]">
                    <Server size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight px-4 leading-tight">
                    {topServer.name}
                  </h2>
                  <div className="inline-block bg-[#12151A] px-3.5 py-1.5 rounded-lg border border-[#252B34] text-xs">
                    <span className="text-white font-bold">{topServer.count.toLocaleString()}</span>
                    <span className="text-[#9DA7B3] text-[11px] ml-1.5">messages sent.</span>
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-[10px]">
                  Making up {((topServer.count / analytics.totalMessages) * 100).toFixed(1)}% of your timeline.
                </div>
              </>
            )}

            {/* Slide 4: Top Friend */}
            {currentSlide === "topFriend" && (
              <>
                <div className="flex items-center gap-1.5 text-[#e91e8c] font-bold text-[10px] uppercase tracking-widest">
                  <Users size={12} />
                  <span>Best Buddy</span>
                </div>

                <div className="my-auto text-center space-y-4">
                  <p className="text-[#9DA7B3] text-[10px] uppercase tracking-widest font-bold">You chatted most with</p>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e91e8c] to-[#7c8cff] flex items-center justify-center mx-auto text-white text-2xl font-extrabold shadow-lg">
                    {topFriend.name[0]?.toUpperCase() || "?"}
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-tight px-4">
                    {topFriend.name}
                  </h2>
                  <div className="inline-block bg-[#12151A] px-3.5 py-1.5 rounded-lg border border-[#252B34] text-xs">
                    <span className="text-[#e91e8c] font-extrabold">{topFriend.messageCount.toLocaleString()}</span>
                    <span className="text-[#9DA7B3] text-[11px] ml-1.5">exchanged.</span>
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-[10px]">
                  True linguistic alignment!
                </div>
              </>
            )}

            {/* Slide 5: Streaks */}
            {currentSlide === "streaks" && (
              <>
                <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold text-[10px] uppercase tracking-widest">
                  <Trophy size={12} />
                  <span>Chat Persistence</span>
                </div>

                <div className="my-auto text-center space-y-4">
                  <p className="text-[#9DA7B3] text-[10px] uppercase tracking-widest font-bold">Your longest daily streak is</p>
                  <h2 className="text-6xl font-black text-[#F59E0B] tracking-tighter">
                    {analytics.longestStreak?.days || 0}
                  </h2>
                  <p className="text-white text-sm font-bold">Consecutive Days Online</p>
                  
                  {analytics.longestStreak?.start && (
                    <p className="text-[#9DA7B3] text-[10px] font-mono">
                      From {new Date(analytics.longestStreak.start.replace(" ", "T")).toLocaleDateString()} to {new Date(analytics.longestStreak.end.replace(" ", "T")).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="text-center text-[#5E6976] text-[10px]">
                  Current active streak is {analytics.currentStreak} days.
                </div>
              </>
            )}

            {/* Slide 6: Words */}
            {currentSlide === "words" && (
              <>
                <div className="flex items-center gap-1.5 text-[#7C8CFF] font-bold text-[10px] uppercase tracking-widest">
                  <Type size={12} />
                  <span>Signature Vocabulary</span>
                </div>

                <div className="my-auto text-center space-y-4">
                  <p className="text-[#9DA7B3] text-[10px] uppercase tracking-widest font-bold">Your favorite word was</p>
                  <div className="text-4xl font-black text-[#7C8CFF] tracking-tight leading-none">
                    &quot;{topWord.word}&quot;
                  </div>
                  <p className="text-white text-xs font-semibold">used {topWord.count.toLocaleString()} times.</p>

                  <div className="flex flex-wrap gap-1.5 justify-center max-w-[260px] mx-auto">
                    {analytics.topWords?.slice(1, 5).map((w, idx) => (
                      <span key={w.word} className="px-2.5 py-1 rounded bg-[#12151A] border border-[#252B34] text-[#9DA7B3] text-[10px]" style={{ opacity: 1 - idx * 0.18 }}>
                        {w.word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center text-[#5E6976] text-[10px]">
                  Filtered common structure words.
                </div>
              </>
            )}

            {/* Slide 7: Activity */}
            {currentSlide === "activity" && (
              <>
                <div className="flex items-center gap-1.5 text-[#5865F2] font-bold text-[10px] uppercase tracking-widest">
                  <Calendar size={12} />
                  <span>Weekly Rhythm</span>
                </div>

                <div className="my-auto text-center space-y-4">
                  <p className="text-[#9DA7B3] text-[10px] uppercase tracking-widest font-bold">Your peak activity hour occurs at</p>
                  <h2 className="text-4xl font-black text-white">
                    {analytics.messagesByHour ? `${analytics.messagesByHour.indexOf(Math.max(...analytics.messagesByHour))}:00 UTC` : "—"}
                  </h2>
                  <p className="text-white text-xs leading-relaxed max-w-[240px] mx-auto">
                    Your favorite day to send messages is <span className="text-[#5865F2] font-bold">{analytics.mostActiveDay}</span>.
                  </p>
                </div>

                <div className="text-center text-[#5E6976] text-[10px]">
                  Calculated from message timestamps.
                </div>
              </>
            )}

            {/* Slide 8: Outro & Share Card */}
            {currentSlide === "outro" && (
              <>
                <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold text-[10px] uppercase tracking-widest">
                  <Star size={12} className="fill-[#F59E0B]" />
                  <span>Recap Completed</span>
                </div>

                <div className="my-auto w-full flex flex-col items-center">
                  <div className="bg-[#12151A]/90 p-4 rounded-2xl border border-[#252B34] w-full text-center relative overflow-hidden shadow-xl mb-3">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-radial from-[#5865F2]/10 to-transparent pointer-events-none" />
                    
                    <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-lg font-bold mx-auto mb-2 shadow-md">
                      {displayName[0]?.toUpperCase()}
                    </div>
                    <p className="text-white text-sm font-black truncate">{displayName}</p>
                    <p className="text-[#5E6976] text-[9px] uppercase font-bold tracking-wider mb-3">Discord Explorer</p>

                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="bg-[#171B21] p-2 rounded-xl border border-[#252B34]">
                        <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Messages</span>
                        <span className="text-white text-xs font-bold">{analytics.totalMessages.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#171B21] p-2 rounded-xl border border-[#252B34]">
                        <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Streak</span>
                        <span className="text-white text-xs font-bold">{(analytics.longestStreak?.days || 0)} Days</span>
                      </div>
                      <div className="bg-[#171B21] p-2 rounded-xl border border-[#252B34]">
                        <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Top Server</span>
                        <span className="text-white text-[10px] font-bold truncate block">{topServer.name}</span>
                      </div>
                      <div className="bg-[#171B21] p-2 rounded-xl border border-[#252B34]">
                        <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Top Friend</span>
                        <span className="text-white text-[10px] font-bold truncate block">{topFriend.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Share & Download Actions */}
                  <div className="w-full grid grid-cols-2 gap-2 z-30">
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
            You are viewing a shared Discord Insights recap page!
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
