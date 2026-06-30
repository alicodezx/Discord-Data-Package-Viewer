"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Star, MessageSquare, Server, Users, Trophy, Type, Calendar, Play, Pause, Share2, RefreshCw, Volume2, VolumeX, ShieldAlert } from "lucide-react";

const SLIDE_DURATION = 6000; // 6 seconds per slide

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

type Slide = (typeof slides)[number];

export default function WrappedSection() {
  const { analytics, user } = useDataStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copyStatus, setCopyStatus] = useState<"idle" | "rendering" | "success" | "error">("idle");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentSlide = slides[activeIdx];

  // Auto-progress handler
  useEffect(() => {
    if (isPaused || copyStatus === "rendering") return;

    const intervalTime = 100;
    const steps = SLIDE_DURATION / intervalTime;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next slide
          if (activeIdx < slides.length - 1) {
            setActiveIdx((idx) => idx + 1);
            return 0;
          } else {
            // Loop back or hold at outro
            setIsPaused(true);
            return 100;
          }
        }
        return prev + (100 / steps);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeIdx, isPaused, copyStatus]);

  if (!analytics) return null;

  const displayName = user?.global_name || user?.username || "Discord Explorer";
  const topServer = analytics.topServers[0] || { name: "No Guild", count: 0 };
  const topFriend = analytics.topFriends[0] || { name: "No Friend", messageCount: 0 };
  const topWord = analytics.topWords[0] || { word: "none", count: 0 };
  const topEmoji = analytics.topEmojis[0] || { emoji: "💬", count: 0 };

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

  // Generate PNG image on canvas and copy to clipboard
  const copyStatsCard = async () => {
    setCopyStatus("rendering");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // 1. Draw Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 600, 800);
      grad.addColorStop(0, "#1a1235"); // dark purple
      grad.addColorStop(0.5, "#0b0d10"); // deep dark
      grad.addColorStop(1, "#1c183a"); // indigo accent
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 800);

      // 2. Draw Decorative Glow Circles
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

      // 3. Draw Border Frame
      ctx.strokeStyle = "rgba(88, 101, 242, 0.3)";
      ctx.lineWidth = 12;
      ctx.strokeRect(16, 16, 568, 768);

      // 4. Header Branding
      ctx.fillStyle = "#5865F2";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("DISCORD WRAPPED RECAP", 45, 65);

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "normal 11px sans-serif";
      ctx.fillText("DATA INSIGHTS ENGINE", 45, 82);

      // 5. User Profile Card
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      
      // Draw rounded rect helper
      const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
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

      drawRoundRect(45, 115, 510, 110, 16);

      // User avatar background
      ctx.fillStyle = "#5865F2";
      ctx.beginPath();
      ctx.arc(105, 170, 32, 0, Math.PI * 2);
      ctx.fill();

      // Avatar Initial letter
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(displayName[0]?.toUpperCase() || "?", 105, 181);

      // User details text
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
      drawRoundRect(380, 148, 150, 42, 8);
      ctx.fillStyle = "#7C8CFF";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("VETERAN ERA", 455, 168);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "normal 10px sans-serif";
      ctx.fillText(`${years}+ Years of Service`, 455, 181);

      // 6. Stats Grid
      ctx.textAlign = "left";
      const drawStatBox = (x: number, y: number, w: number, h: number, label: string, value: string, icon: string) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        drawRoundRect(x, y, w, h, 14);

        // Icon representation circle
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
        ctx.font = "bold 20px sans-serif";
        // Check text width to prevent overflow
        let fontSz = 20;
        ctx.font = `bold ${fontSz}px sans-serif`;
        while (ctx.measureText(value).width > w - 85 && fontSz > 11) {
          fontSz--;
          ctx.font = `bold ${fontSz}px sans-serif`;
        }
        ctx.fillText(value, x + 70, y + 60);
      };

      drawStatBox(45, 245, 245, 90, "Total Messages", analytics.totalMessages.toLocaleString(), "💬");
      drawStatBox(310, 245, 245, 90, "Active Streak", `${analytics.longestStreak.days} Days`, "🔥");
      
      drawStatBox(45, 355, 245, 90, "Top Community", topServer.name, "🌐");
      drawStatBox(310, 355, 245, 90, "Top Buddy", topFriend.name, "❤️");

      drawStatBox(45, 465, 245, 90, "Frequent Word", `"${topWord.word}"`, "✍️");
      drawStatBox(310, 465, 245, 90, "Top Emoji", topEmoji.emoji, "✨");

      // 7. Time Capsule genesis quote box
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.strokeStyle = "rgba(88, 101, 242, 0.15)";
      drawRoundRect(45, 575, 510, 110, 16);

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

      // 8. Footer Watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DISCORD DATA PACKAGE VIEWER  |  ALICODEZX.GITHUB.IO", 300, 735);

      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "normal 8px sans-serif";
      ctx.fillText("Rendered locally inside web client. Safe and private.", 300, 750);

      // Convert to blob and write to clipboard
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Blob creation failed");
        
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          setCopyStatus("success");
          setTimeout(() => setCopyStatus("idle"), 4000);
        } catch (err) {
          console.error(err);
          setCopyStatus("error");
          setTimeout(() => setCopyStatus("idle"), 4000);
        }
      }, "image/png");

    } catch (err) {
      console.error(err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 4000);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] flex flex-col min-h-[calc(100vh-80px)] select-none">
      
      {/* Top Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[#5865F2] text-xs font-bold uppercase tracking-wider mb-1">Interactive Story Player</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Star className="text-[#F59E0B] fill-[#F59E0B]" size={28} />
            Insights Wrapped
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 bg-[#12151A] hover:bg-[#252B34] border border-[#252B34] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            <span>{isPaused ? "Play" : "Pause"}</span>
          </button>
          <div className="text-[#9DA7B3] text-xs font-mono bg-[#12151A] px-3 py-1.5 rounded-lg border border-[#252B34]">
            {activeIdx + 1} / {slides.length}
          </div>
        </div>
      </div>

      {/* Progress Bars (Story Indicators) */}
      <div className="flex gap-1.5 mb-8 w-full max-w-2xl mx-auto z-10">
        {slides.map((s, i) => (
          <div
            key={s}
            onClick={() => jumpToSlide(i)}
            className="h-1.5 flex-1 bg-[#252B34] rounded-full overflow-hidden cursor-pointer relative"
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#5865F2] to-[#7C8CFF] transition-all duration-100 ease-linear"
              style={{
                width: i < activeIdx ? "100%" : i === activeIdx ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Primary Slide Wrapper */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full pb-16">
        <div className="w-full max-w-xl relative aspect-[9/16] max-h-[720px] rounded-3xl border border-[#252B34] overflow-hidden flex flex-col shadow-2xl bg-black">
          
          {/* Overlay Navigation Click Zones (Invisible left/right buttons to tap through stories) */}
          <div className="absolute inset-0 z-20 flex pointer-events-auto">
            <div className="w-1/4 h-full cursor-west-resize" onClick={handlePrev} />
            <div className="w-2/4 h-full" onClick={() => setIsPaused(!isPaused)} />
            <div className="w-1/4 h-full cursor-east-resize" onClick={handleNext} />
          </div>

          {/* Animating Slides */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="absolute inset-0 flex flex-col p-8 md:p-10 justify-between z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Dynamic colorful gradient backgrounds matching slides */}
              <div 
                className={`absolute inset-0 bg-gradient-to-b -z-10 transition-colors duration-1000 ${
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

              {/* Glowing pulsing orbs in background */}
              <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-radial from-[#5865F2]/10 to-transparent blur-3xl -z-10 animate-pulse pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-radial from-[#e91e8c]/5 to-transparent blur-3xl -z-10 pointer-events-none" />

              {/* Slide 1: Intro */}
              {currentSlide === "intro" && (
                <>
                  <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-xs uppercase tracking-widest mt-4">
                    <Star size={14} className="fill-[#F59E0B]" />
                    <span>Wrapped Recap</span>
                  </div>
                  
                  <div className="my-auto text-center space-y-4">
                    <motion.div 
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-24 h-24 rounded-[2rem] bg-[#5865F2] flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-8 shadow-xl"
                    >
                      {displayName[0]?.toUpperCase()}
                    </motion.div>
                    <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                      This is your year in chat, <span className="text-[#7C8CFF]">{displayName}</span>.
                    </h2>
                    <p className="text-[#9DA7B3] text-sm leading-relaxed max-w-sm mx-auto">
                      Let&apos;s step back and look at your entire footprint in the Discord ecosystem.
                    </p>
                  </div>

                  <div className="text-center text-[#5E6976] text-xs font-medium uppercase tracking-wider mb-4 animate-bounce">
                    Tap right to begin
                  </div>
                </>
              )}

              {/* Slide 2: Messages */}
              {currentSlide === "messages" && (
                <>
                  <div className="flex items-center gap-2 text-[#7C8CFF] font-bold text-xs uppercase tracking-widest mt-4">
                    <MessageSquare size={14} />
                    <span>Linguistic Volume</span>
                  </div>

                  <div className="my-auto text-center space-y-4">
                    <p className="text-[#9DA7B3] text-xs uppercase tracking-widest font-bold">You typed and sent</p>
                    <motion.h2 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter"
                    >
                      {analytics.totalMessages.toLocaleString()}
                    </motion.h2>
                    <p className="text-[#7C8CFF] font-bold text-base">total messages across all log entries.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#252B34]/60">
                      <div>
                        <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block">Words Written</span>
                        <span className="text-white text-xl font-bold font-mono">{analytics.totalWords.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block">Attachments Shared</span>
                        <span className="text-white text-xl font-bold font-mono">{analytics.totalAttachments.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[#5E6976] text-[11px]">
                    Averaging about {analytics.averageMessagesPerDay.toFixed(0)} messages every single day.
                  </div>
                </>
              )}

              {/* Slide 3: Top Server */}
              {currentSlide === "topServer" && (
                <>
                  <div className="flex items-center gap-2 text-[#34D399] font-bold text-xs uppercase tracking-widest mt-4">
                    <Server size={14} />
                    <span>Primary Habitat</span>
                  </div>

                  <div className="my-auto text-center space-y-6">
                    <p className="text-[#9DA7B3] text-xs uppercase tracking-widest font-bold">Your main community was</p>
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-24 h-24 rounded-[1.8rem] bg-[#34D399]/15 border-2 border-[#34D399]/40 flex items-center justify-center mx-auto text-[#34D399]"
                    >
                      <Server size={44} />
                    </motion.div>
                    <h2 className="text-3xl font-black text-white tracking-tight px-4 leading-tight">
                      {topServer.name}
                    </h2>
                    <div className="inline-block bg-[#12151A] px-4 py-2 rounded-xl border border-[#252B34]">
                      <span className="text-white font-bold">{topServer.count.toLocaleString()}</span>
                      <span className="text-[#9DA7B3] text-xs ml-2">messages sent here.</span>
                    </div>
                  </div>

                  <div className="text-center text-[#5E6976] text-[11px]">
                    Making up {((topServer.count / analytics.totalMessages) * 100).toFixed(1)}% of your lifetime history.
                  </div>
                </>
              )}

              {/* Slide 4: Top Friend */}
              {currentSlide === "topFriend" && (
                <>
                  <div className="flex items-center gap-2 text-[#e91e8c] font-bold text-xs uppercase tracking-widest mt-4">
                    <Users size={14} />
                    <span>Best Buddy</span>
                  </div>

                  <div className="my-auto text-center space-y-6">
                    <p className="text-[#9DA7B3] text-xs uppercase tracking-widest font-bold">You chatted most with</p>
                    <motion.div 
                      initial={{ scale: 0.7, rotate: 15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#e91e8c] to-[#7c8cff] flex items-center justify-center mx-auto text-white text-4xl font-extrabold shadow-lg"
                    >
                      {topFriend.name[0]?.toUpperCase() || "?"}
                    </motion.div>
                    <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                      {topFriend.name}
                    </h2>
                    <div className="inline-block bg-[#12151A] px-4 py-2 rounded-xl border border-[#252B34]">
                      <span className="text-[#e91e8c] font-extrabold">{topFriend.messageCount.toLocaleString()}</span>
                      <span className="text-[#9DA7B3] text-xs ml-2">exchanged logs.</span>
                    </div>
                  </div>

                  <div className="text-center text-[#5E6976] text-[11px]">
                    Your DMs are active. True linguistic alignment!
                  </div>
                </>
              )}

              {/* Slide 5: Streaks */}
              {currentSlide === "streaks" && (
                <>
                  <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-xs uppercase tracking-widest mt-4">
                    <Trophy size={14} />
                    <span>Chat Persistence</span>
                  </div>

                  <div className="my-auto text-center space-y-6">
                    <p className="text-[#9DA7B3] text-xs uppercase tracking-widest font-bold">Your longest daily streak is</p>
                    <motion.h2 
                      initial={{ scale: 0.8, y: -10 }}
                      animate={{ scale: 1, y: 0 }}
                      className="text-7xl font-black text-[#F59E0B] tracking-tighter"
                    >
                      {analytics.longestStreak.days}
                    </motion.h2>
                    <p className="text-white text-lg font-bold">Consecutive Days Online</p>
                    
                    <p className="text-[#9DA7B3] text-xs font-mono mt-4">
                      From {new Date(analytics.longestStreak.start.replace(" ", "T")).toLocaleDateString()} to {new Date(analytics.longestStreak.end.replace(" ", "T")).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-center text-[#5E6976] text-[11px]">
                    Current active streak is {analytics.currentStreak} days. Keep it up!
                  </div>
                </>
              )}

              {/* Slide 6: Words */}
              {currentSlide === "words" && (
                <>
                  <div className="flex items-center gap-2 text-[#7C8CFF] font-bold text-xs uppercase tracking-widest mt-4">
                    <Type size={14} />
                    <span>Signature Vocabulary</span>
                  </div>

                  <div className="my-auto text-center space-y-8">
                    <p className="text-[#9DA7B3] text-xs uppercase tracking-widest font-bold">Your favorite word was</p>
                    <motion.div 
                      initial={{ scale: 0.6, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-5xl md:text-6xl font-black text-[#7C8CFF] tracking-tight leading-none"
                    >
                      &quot;{topWord.word}&quot;
                    </motion.div>
                    <p className="text-white text-sm font-semibold">used {topWord.count.toLocaleString()} times.</p>

                    <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
                      {analytics.topWords.slice(1, 6).map((w, idx) => (
                        <span key={w.word} className="px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252B34] text-[#9DA7B3] text-xs" style={{ opacity: 1 - idx * 0.15 }}>
                          {w.word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-[#5E6976] text-[11px]">
                    We filtered common structural stop words.
                  </div>
                </>
              )}

              {/* Slide 7: Activity */}
              {currentSlide === "activity" && (
                <>
                  <div className="flex items-center gap-2 text-[#5865F2] font-bold text-xs uppercase tracking-widest mt-4">
                    <Calendar size={14} />
                    <span>Weekly Rhythm</span>
                  </div>

                  <div className="my-auto text-center space-y-6">
                    <p className="text-[#9DA7B3] text-xs uppercase tracking-widest font-bold">Your peak activity hour occurs at</p>
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-5xl font-black text-white"
                    >
                      {analytics.messagesByHour.indexOf(Math.max(...analytics.messagesByHour))}:00 UTC
                    </motion.h2>
                    <p className="text-white text-sm leading-relaxed max-w-xs mx-auto">
                      Your favorite day to send messages is <span className="text-[#5865F2] font-bold">{analytics.mostActiveDay}</span>.
                    </p>
                  </div>

                  <div className="text-center text-[#5E6976] text-[11px]">
                    Habits calculated from message timestamps.
                  </div>
                </>
              )}

              {/* Slide 8: Outro & Stats Card */}
              {currentSlide === "outro" && (
                <>
                  <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-xs uppercase tracking-widest mt-2">
                    <Star size={14} className="fill-[#F59E0B]" />
                    <span>Recap Completed</span>
                  </div>

                  <div className="my-auto w-full flex flex-col items-center">
                    <div className="bg-[#12151A]/90 p-5 rounded-2xl border border-[#252B34] w-full text-center relative overflow-hidden shadow-xl mb-4">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-[#5865F2]/10 to-transparent pointer-events-none" />
                      
                      <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md">
                        {displayName[0]?.toUpperCase()}
                      </div>
                      <p className="text-white text-base font-black truncate">{displayName}</p>
                      <p className="text-[#5E6976] text-[10px] uppercase font-bold tracking-wider mb-4">Discord Explorer</p>

                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="bg-[#171B21] p-2.5 rounded-xl border border-[#252B34]">
                          <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Messages</span>
                          <span className="text-white text-sm font-bold">{analytics.totalMessages.toLocaleString()}</span>
                        </div>
                        <div className="bg-[#171B21] p-2.5 rounded-xl border border-[#252B34]">
                          <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Streak</span>
                          <span className="text-white text-sm font-bold">{analytics.longestStreak.days} Days</span>
                        </div>
                        <div className="bg-[#171B21] p-2.5 rounded-xl border border-[#252B34]">
                          <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Top Server</span>
                          <span className="text-white text-xs font-bold truncate block">{topServer.name}</span>
                        </div>
                        <div className="bg-[#171B21] p-2.5 rounded-xl border border-[#252B34]">
                          <span className="text-[#5E6976] text-[8px] font-bold uppercase tracking-wider block">Top Friend</span>
                          <span className="text-white text-xs font-bold truncate block">{topFriend.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Copy to Clipboard Actions */}
                    <button
                      onClick={copyStatsCard}
                      disabled={copyStatus === "rendering"}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-black transition-all ${
                        copyStatus === "success" 
                          ? "bg-[#34D399] hover:bg-[#34D399]" 
                          : copyStatus === "error" 
                          ? "bg-red-500 text-white" 
                          : "bg-white hover:bg-white/90"
                      }`}
                    >
                      {copyStatus === "rendering" && <RefreshCw className="animate-spin" size={14} />}
                      {copyStatus === "success" && "Copied PNG to Clipboard!"}
                      {copyStatus === "error" && "Copy Failed! Try Again."}
                      {copyStatus === "idle" && (
                        <>
                          <Share2 size={14} />
                          <span>Copy Stats Card (PNG)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={() => jumpToSlide(0)}
                      className="text-xs text-[#9DA7B3] hover:text-white transition-colors py-1.5"
                    >
                      Watch recap again
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
