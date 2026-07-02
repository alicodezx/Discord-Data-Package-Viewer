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

  // Derive account creation date from user ID (Discord snowflake)
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

  // Determine Discord Era
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

  // Safe helper to format peak day / active day cleanly
  const formatPeakDate = (dateStr: string) => {
    if (!dateStr) return "Unknown Date";
    // Check if it's already a clean day name rather than date string
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

  // Fallback for genesis message
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
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader label="TIMELINE DIG" title="Guild Archeologist" />

      {/* Intro banner */}
      <motion.div
        className="premium-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] flex-shrink-0">
          <Compass size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-white text-lg font-bold">Welcome to your Digital Time Capsule, {displayName}</h2>
          <p className="text-[#9DA7B3] text-sm mt-1">
            We have excavated your account database to recover historical milestones, structural shifts, and linguistic anomalies from your chat history.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Account Genesis & Era */}
        <motion.div
          className="premium-card p-6 md:p-8 flex flex-col justify-between min-h-[320px]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Historical Marker #1</span>
              <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${eraBadgeBg} ${eraColor}`}>
                {eraName.split(" ")[0]} ERA
              </div>
            </div>
            <h3 className="text-white text-2xl font-black mb-2 tracking-tight">Account Genesis</h3>
            <p className="text-[#9DA7B3] text-sm leading-relaxed mb-6">
              Your account was created on <span className="text-white font-bold">{creationDateStr}</span>. You have been a part of the Discord ecosystem for <span className="text-[#5865F2] font-black">{analytics.accountAge.toLocaleString()} days</span>.
            </p>
          </div>

          <div className="p-4 bg-[#12151A] rounded-xl border border-[#252B34] flex gap-4 items-center">
            <div className={`w-2.5 h-2.5 rounded-full ${eraDotColor} flex-shrink-0 animate-pulse`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${eraColor}`}>{eraName}</p>
              <p className="text-[#9DA7B3] text-[11px] mt-0.5">{eraDesc}</p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Peak Message Day */}
        <motion.div
          className="premium-card p-6 md:p-8 flex flex-col justify-between min-h-[320px]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Historical Marker #2</span>
              <Calendar size={14} className="text-[#34D399]" />
            </div>
            <h3 className="text-white text-2xl font-black mb-2 tracking-tight">Peak Activity Day</h3>
            <p className="text-[#9DA7B3] text-sm leading-relaxed mb-6">
              The single calendar day in your history where your message count reached its absolute zenith.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#12151A] p-4 rounded-xl border border-[#252B34]">
            <div className="text-center sm:text-left flex-1 min-w-0">
              <p className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Peak Date</p>
              <p className="text-white text-base font-extrabold mt-0.5 truncate">
                {formatPeakDate(peak.date)}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-[#171B21] px-4 py-2.5 rounded-xl border border-[#252B34]/60 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center text-[#34D399] flex-shrink-0">
                <MessageSquare size={15} />
              </div>
              <div className="text-left">
                <span className="text-xl font-black text-[#34D399] block leading-none">{peak.count.toLocaleString()}</span>
                <span className="text-[#5E6976] text-[9px] uppercase font-bold tracking-wider block mt-0.5">Messages Sent</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Genesis Message */}
      <motion.div
        className="premium-card p-6 md:p-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Historical Marker #3</span>
          <span className="text-xs text-[#5865F2] font-semibold flex items-center gap-1">
            <Clock size={12} /> Discovered in #{genesis.channelName}
          </span>
        </div>
        <h3 className="text-white text-2xl font-black mb-4 tracking-tight">The Genesis Message</h3>
        <p className="text-[#9DA7B3] text-sm leading-relaxed mb-6">
          This is the very first recorded message sent by you in this data package. The beginning of your logs.
        </p>

        <div className="bg-[#12151A] rounded-2xl border border-[#252B34] p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-radial from-[#5865F2]/5 to-transparent pointer-events-none" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold flex-shrink-0 text-sm shadow-md overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName[0]?.toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-white text-sm font-bold">{displayName}</span>
                <span className="text-[#5E6976] text-[10px] font-mono">
                  {new Date(genesis.timestamp.replace(" ", "T")).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-[#dbdee1] text-sm whitespace-pre-wrap break-words leading-relaxed font-sans mt-1">
                {genesis.content?.trim() || "[System Message or Empty Content]"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Row 3: Longest Message */}
      <motion.div
        className="premium-card p-6 md:p-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Historical Marker #4</span>
          <span className="text-xs text-[#F59E0B] font-semibold flex items-center gap-1">
            <Award size={12} /> {longest.content?.length.toLocaleString()} characters
          </span>
        </div>
        <h3 className="text-white text-2xl font-black mb-4 tracking-tight">The Novelist Award</h3>
        <p className="text-[#9DA7B3] text-sm leading-relaxed mb-6">
          Your single longest message ever sent. Equivalent to a short technical brief or a story chapter.
        </p>

        <div className="bg-[#12151A] rounded-2xl border border-[#252B34] overflow-hidden flex flex-col">
          <div className="px-5 py-3 bg-[#171B21] border-b border-[#252B34] flex items-center justify-between text-xs text-[#9DA7B3] font-mono">
            <span>#{longest.channel || "channel"}</span>
            <span>{longest.date || "date"}</span>
          </div>
          <div className="p-6 max-h-[160px] overflow-y-auto select-text font-mono text-xs text-[#dbdee1] leading-relaxed whitespace-pre-wrap">
            {longest.content}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
