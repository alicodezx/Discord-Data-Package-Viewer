"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Hash, Type, AtSign, Compass, MessageCircle, Search } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { CHART_TOOLTIP_STYLE } from "@/lib/ui";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, CartesianGrid
} from "recharts";

export default function MessagesSection() {
  const { analytics } = useDataStore();
  const [searchQuery, setSearchQuery] = useState("");
  if (!analytics) return null;

  const topChannelsData = analytics.topChannels.slice(0, 8).map((c) => ({
    name: c.name.replace(/Direct Message with /, "DM: ").replace(/.*in /, "").slice(0, 20) + (c.name.length > 20 ? "…" : ""),
    count: c.count,
  }));

  const pieData = [
    { name: "Server Chat", value: analytics.guildChannels.reduce((a, c) => a + c.messageCount, 0), fill: "#5865F2" },
    { name: "Direct Messages", value: analytics.dmChannels.reduce((a, c) => a + c.messageCount, 0), fill: "#7C8CFF" },
    { name: "Group DMs", value: analytics.groupChannels.reduce((a, c) => a + c.messageCount, 0), fill: "#34D399" },
  ].filter((d) => d.value > 0);

  // Creative "Wrapped" style insights
  const wordsPerBook = 90000;
  const booksWritten = (analytics.totalWords / wordsPerBook).toFixed(1);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader title="Messages" />

      {/* Storytelling Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="p-6 rounded-xl border border-[#252B34] bg-[#12151A]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#171B21] border border-[#252B34] flex items-center justify-center flex-shrink-0">
              <Type size={24} className="text-[#9DA7B3]" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-1">Word Count</h3>
              <p className="text-[#9DA7B3] text-sm leading-relaxed">
                You&apos;ve typed <span className="text-white font-semibold">{analytics.totalWords.toLocaleString()}</span> words on Discord. That&apos;s enough to fill approximately <span className="text-white font-semibold">{booksWritten}</span> standard novels.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl border border-[#252B34] bg-[#12151A]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#171B21] border border-[#252B34] flex items-center justify-center flex-shrink-0">
              <Compass size={24} className="text-[#9DA7B3]" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-1">Files &amp; Links</h3>
              <p className="text-[#9DA7B3] text-sm leading-relaxed">
                You&apos;ve uploaded <span className="text-white font-semibold">{analytics.totalAttachments.toLocaleString()}</span> files and shared <span className="text-white font-semibold">{analytics.totalLinks.toLocaleString()}</span> links across your conversations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Channels */}
        <motion.div
          className="premium-card p-6 flex flex-col"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6">
            <h3 className="text-white text-base font-bold flex items-center gap-2">
              <MessageCircle size={16} className="text-[#5865F2]" />
              Where You Talk Most
            </h3>

          </div>
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={topChannelsData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={130} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  {...CHART_TOOLTIP_STYLE}
                  formatter={(value: unknown) => [Number(value).toLocaleString(), "Messages"]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {topChannelsData.map((_, i) => (
                    <Cell key={i} fill={`rgba(88, 101, 242, ${1 - i * 0.08})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Message type breakdown */}
        <motion.div
          className="premium-card p-6 flex flex-col"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6">
            <h3 className="text-white text-base font-bold flex items-center gap-2">
              <Hash size={16} className="text-[#7C8CFF]" />
              Public vs Private
            </h3>

          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip
                    {...CHART_TOOLTIP_STYLE}
                    formatter={(value: unknown) => Number(value).toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-3 px-4">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: d.fill }} />
                    <span className="text-[#9DA7B3] text-sm font-medium">{d.name}</span>
                  </div>
                  <span className="text-white font-mono font-bold text-sm">{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Word Cloud */}
        <motion.div
          className="premium-card p-6 self-start flex flex-col min-h-[380px]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h3 className="text-white text-base font-bold flex items-center gap-2">
              <AtSign size={16} className="text-[#F59E0B]" />
              Interactive Word Cloud
            </h3>
            
            <div className="relative w-full sm:w-44">
              <input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-[#12151A]/80 border border-[#252B34] rounded-lg text-xs text-white placeholder-[#5E6976] focus:border-[#5865F2] focus:outline-none transition-colors font-sans"
              />
              <Search size={12} className="absolute left-2.5 top-2 text-[#5E6976]" />
            </div>
          </div>

          {analytics.topWords.length > 0 ? (
            (() => {
              const maxCount = analytics.topWords[0]?.count ?? 1;
              const filtered = searchQuery.trim()
                ? analytics.topWords.filter((w) => w.word.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 35)
                : analytics.topWords.slice(0, 35);

              if (filtered.length === 0) {
                return (
                  <div className="text-center p-8 bg-[#12151A] rounded-xl border border-[#252B34] flex-1 flex flex-col justify-center">
                    <p className="text-[#9DA7B3] text-xs">No matching words found.</p>
                  </div>
                );
              }

              return (
                <div className="flex-1 flex flex-wrap gap-x-3 gap-y-2 justify-center items-center p-4 bg-[#12151A]/40 rounded-xl border border-[#252B34]/60">
                  {filtered.map((w, idx) => {
                    const ratio = w.count / maxCount;
                    const fontSize = Math.max(11, Math.min(26, 11 + ratio * 15));
                    const opacity = Math.max(0.5, Math.min(1, 0.5 + ratio * 0.5));
                    const hue = 220 + (idx * 8) % 65;
                    const saturation = 80 + (idx % 15);
                    const lightness = 65 + (idx % 10);
                    const colorHex = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

                    return (
                      <motion.span
                        key={w.word}
                        style={{ fontSize: `${fontSize}px`, color: colorHex, opacity }}
                        className="font-extrabold tracking-tight cursor-default select-none transition-all px-1.5 py-0.5 rounded hover:bg-[#5865F2]/10"
                        title={`${w.count.toLocaleString()} uses`}
                        whileHover={{ scale: 1.2, color: "#FFFFFF", opacity: 1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 12 }}
                      >
                        {w.word}
                        <span className="text-[9px] font-mono opacity-30 ml-1 font-normal select-none">
                          ({w.count})
                        </span>
                      </motion.span>
                    );
                  })}
                </div>
              );
            })()
          ) : (
            <div className="text-center p-8 bg-[#12151A] rounded-xl border border-[#252B34] flex-1 flex flex-col justify-center">
              <p className="text-[#9DA7B3] text-sm">Not enough textual data to analyze vocabulary.</p>
            </div>
          )}
        </motion.div>

        {/* Emojis & Longest Message */}
        <div className="space-y-6 flex flex-col">
          {/* Top Emojis */}
          <motion.div
            className="premium-card p-6 flex-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-white text-base font-bold mb-6">Top Reactions & Emojis</h3>
            {analytics.topEmojis.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {analytics.topEmojis.slice(0, 10).map((e, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#12151A] border border-[#252B34] hover:border-[#5865F2] hover:bg-[#5865F2]/5 transition-all">
                    <div className="text-2xl mb-1">
                      {e.emoji.startsWith(":") ? <span className="text-[10px] text-[#9DA7B3] font-mono break-all">{e.emoji}</span> : e.emoji}
                    </div>
                    <span className="text-[#5E6976] text-[10px] font-bold">{e.count}</span>
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center p-8 bg-[#12151A] rounded-xl border border-[#252B34]">
                <p className="text-[#9DA7B3] text-sm">No emoji data available.</p>
              </div>
            )}
          </motion.div>

          {/* Longest message */}
          {analytics.longestMessage.content && (
            <motion.div
              className="premium-card p-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                🏆 Longest Monologue
              </h3>
              <div className="bg-[#12151A] rounded-xl p-4 border border-[#252B34]">
                <div className="flex items-center flex-wrap gap-2 mb-3 text-[10px] uppercase font-bold text-[#5E6976] tracking-wider">
                  <span className="text-[#7C8CFF]">{analytics.longestMessage.channel}</span>
                  <span>•</span>
                  <span>{new Date(analytics.longestMessage.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="text-[#34D399]">{analytics.longestMessage.content.length} chars</span>
                </div>
                <p className="text-[#9DA7B3] text-sm leading-relaxed line-clamp-4 italic">
                  &quot;{analytics.longestMessage.content}&quot;
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
