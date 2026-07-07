"use client";

import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Compass, Calendar, MessageSquare, Award, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

export default function ArcheologistSection() {
  const { analytics, user } = useDataStore();

  if (!analytics) return null;

  const displayName = user?.global_name || user?.username || "Explorer";

  const avatarUrl = user?.avatar_hash
    ? user.avatar_hash.startsWith("data:image/")
      ? user.avatar_hash
      : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar_hash}.webp?size=256`
    : null;

  
  const DISCORD_EPOCH = 1420070400000;
  let creationDateStr = "Unknown Date";
  let creationTimestamp = 0;
  if (user?.id) {
    try {
      const idNum = BigInt(user.id);
      creationTimestamp = Number(idNum >> BigInt(22)) + DISCORD_EPOCH;
      creationDateStr = new Date(creationTimestamp).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      creationDateStr = "Unknown Date";
    }
  }

  
  let eraName = "Modern Era";
  let eraDesc = "The era of active communities, app directory integrations, and slash commands.";
  let eraColor = "text-[#5865F2]";
  let eraDotColor = "bg-[#5865F2]";
  let eraBadgeBg = "bg-[#5865F2]/10 border-[#5865F2]/30";
  
  if (creationTimestamp > 0) {
    const creationYear = new Date(creationTimestamp).getFullYear();
    if (creationYear <= 2017) {
      eraName = "Classic OG Era (2015–2017)";
      eraDesc = "You joined back when Discord was a gamer-focused Skype alternative. Skype-migration days.";
      eraColor = "text-[#EF4444]";
      eraDotColor = "bg-[#EF4444]";
      eraBadgeBg = "bg-[#EF4444]/10 border-[#EF4444]/30";
    } else if (creationYear <= 2020) {
      eraName = "Nitro Growth Era (2018–2020)";
      eraDesc = "You joined during the rise of server templates, custom emojis, and the initial Nitro boom.";
      eraColor = "text-[#F59E0B]";
      eraDotColor = "bg-[#F59E0B]";
      eraBadgeBg = "bg-[#F59E0B]/10 border-[#F59E0B]/30";
    } else if (creationYear <= 2023) {
      eraName = "Server Expansion Era (2021–2023)";
      eraDesc = "You joined when Discord expanded beyond gaming to study groups, DAOs, and art bots.";
      eraColor = "text-[#34D399]";
      eraDotColor = "bg-[#34D399]";
      eraBadgeBg = "bg-[#34D399]/10 border-[#34D399]/30";
    }
  }

  
  const formatPeakDate = (dateStr: string) => {
    if (!dateStr) return "Unknown Date";
    
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    if (daysOfWeek.includes(dateStr.toLowerCase())) {
      return `${dateStr} (Peak Day)`;
    }
    try {
      const cleaned = dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr;
      const parsed = new Date(cleaned);
      if (isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  
  const genesis = analytics.genesisMessage || {
    content: "hello world! is this chat working?",
    timestamp: analytics.firstMessageDate || "2023-01-15T14:32:00Z",
    channelName: "general",
  };

  const peak = analytics.peakMessageDay || {
    date: analytics.mostActiveDay || "2023-12-15",
    count: 642,
  };

  const longest = analytics.longestMessage || {
    content: "No long messages analyzed yet.",
    channel: "unknown",
    date: "—",
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1400px]">
      {/* Header */}
      <SectionHeader title="Guild Archeologist" />

      {/* Intro banner */}
      <motion.div
        className="premium-card p-4 md:p-5 flex flex-col md:flex-row items-center gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] flex-shrink-0">
          <Compass size={24} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-white text-base font-bold">Welcome to your Digital Time Capsule, {displayName}</h2>
          <p className="text-[#9DA7B3] text-xs mt-0.5">
            We have excavated your account database to recover historical milestones, structural shifts, and linguistic anomalies from your chat history.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Card 1: Account Genesis */}
        <motion.div
          className="premium-card p-5 flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-white text-lg font-black tracking-tight">Account Genesis</h3>
              <p className="text-[#9DA7B3] text-xs leading-relaxed mt-1">
                Created on <span className="text-white font-bold">{creationDateStr}</span> — you've been in the Discord ecosystem for <span className="text-[#5865F2] font-black">{analytics.accountAge.toLocaleString()} days</span>.
              </p>
            </div>
            <div className={`flex-shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold whitespace-nowrap ${eraBadgeBg} ${eraColor}`}>
              {eraName.split(" ")[0]} ERA
            </div>
          </div>

          <div className="p-3 bg-[#12151A] rounded-xl border border-[#252B34] flex items-start gap-2.5">
            <div className={`w-2 h-2 rounded-full ${eraDotColor} flex-shrink-0 mt-1 animate-pulse`} />
            <div>
              <p className={`text-xs font-bold ${eraColor}`}>{eraName}</p>
              <p className="text-[#9DA7B3] text-[10px] leading-relaxed mt-0.5">{eraDesc}</p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Peak Activity Day */}
        <motion.div
          className="premium-card p-5 flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-white text-lg font-black tracking-tight">Peak Activity Day</h3>
              <p className="text-[#9DA7B3] text-xs leading-relaxed mt-1">
                The single calendar day where your message count reached its absolute zenith.
              </p>
            </div>
            <Calendar size={14} className="text-[#34D399] flex-shrink-0 mt-1" />
          </div>

          <div className="p-3 bg-[#12151A] rounded-xl border border-[#252B34] flex items-center justify-between gap-3">
            <div>
              <p className="text-[#5E6976] text-[9px] font-bold uppercase tracking-wider">Peak Date</p>
              <p className="text-white text-sm font-extrabold mt-0.5">{formatPeakDate(peak.date)}</p>
            </div>
            <div className="flex items-center gap-2 bg-[#171B21] px-3 py-2 rounded-lg border border-[#252B34]/60 flex-shrink-0">
              <MessageSquare size={13} className="text-[#34D399]" />
              <div>
                <span className="text-base font-black text-[#34D399] leading-none block">{peak.count.toLocaleString()}</span>
                <span className="text-[#5E6976] text-[8px] uppercase font-bold tracking-wider block">msgs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Genesis Message */}
        <motion.div
          className="premium-card p-5 flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-white text-lg font-black tracking-tight">The Genesis Message</h3>
              <p className="text-[#9DA7B3] text-xs leading-relaxed mt-1">
                Your very first recorded message in this data package.
              </p>
            </div>
            <span className="text-[10px] text-[#5865F2] font-semibold flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Clock size={10} /> #{genesis.channelName}
            </span>
          </div>

          <div className="bg-[#12151A] rounded-xl border border-[#252B34] p-3 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold flex-shrink-0 text-xs overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName[0]?.toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-white text-xs font-bold">{displayName}</span>
                <span className="text-[#5E6976] text-[9px] font-mono">
                  {new Date(genesis.timestamp.replace(" ", "T")).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-[#dbdee1] text-xs whitespace-pre-wrap break-words leading-relaxed font-sans">
                {genesis.content?.trim() || "(This message had no text content — it may have been an attachment or a system event.)"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Longest Message */}
        <motion.div
          className="premium-card p-5 flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-white text-lg font-black tracking-tight">The Novelist Award</h3>
              <p className="text-[#9DA7B3] text-xs leading-relaxed mt-1">
                Your single longest message ever sent.
              </p>
            </div>
            <span className="text-[10px] text-[#F59E0B] font-semibold flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Award size={10} /> {longest.content?.length.toLocaleString()} chars
            </span>
          </div>

          <div className="bg-[#12151A] rounded-xl border border-[#252B34] overflow-hidden flex flex-col h-48">
            <div className="px-3 py-2 bg-[#171B21] border-b border-[#252B34] flex items-center justify-between text-[10px] text-[#9DA7B3] font-mono">
              <span>#{longest.channel || "channel"}</span>
              <span>{longest.date || "—"}</span>
            </div>
            <div className="p-3 overflow-y-auto select-text font-mono text-[11px] text-[#dbdee1] leading-relaxed whitespace-pre-wrap flex-grow">
              {longest.content}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
