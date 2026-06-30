"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import {
  Users, MessageSquare, UserCheck, UserX, Clock, Heart, ChevronLeft, ChevronRight
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

export default function FriendsSection() {
  const { analytics, user } = useDataStore();
  const [friendPage, setFriendPage] = useState(0);
  const FRIENDS_PER_PAGE = 10;

  if (!analytics) return null;

  const friends = user?.relationships?.filter((r) => r.type === "FRIEND") ?? [];
  const pending = user?.relationships?.filter((r) => r.type === "PENDING_INCOMING") ?? [];
  const blocked = user?.relationships?.filter((r) => r.type === "BLOCKED") ?? [];

  const topFriends = analytics.topFriends.slice(0, 20);
  const maxMsgs = topFriends[0]?.messageCount ?? 1;

  const bff = topFriends.length > 0 ? topFriends[0] : null;
  const bffName = bff ? bff.name.replace("Direct Message with ", "").replace(/#\d+$/, "") : "";

  const totalFriendPages = Math.ceil(friends.length / FRIENDS_PER_PAGE);
  const paginatedFriends = friends.slice(friendPage * FRIENDS_PER_PAGE, (friendPage + 1) * FRIENDS_PER_PAGE);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader label="RELATIONSHIPS" title="Friends & DMs" />

      {/* BFF / Top friend insight card */}
      {bff && bff.messageCount > 0 && (
        <motion.div
          className="premium-card overflow-hidden group"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ y: -2 }}
        >
          <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-[#12151A] border-4 border-[#171B21] flex items-center justify-center flex-shrink-0 relative">
                <span className="text-4xl font-bold text-[#5865F2]">
                  {bffName[0]?.toUpperCase() || "?"}
                </span>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#171B21] border border-[#252B34] flex items-center justify-center">
                  <Heart size={14} className="text-[#e91e8c] fill-[#e91e8c]" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-[#9DA7B3] text-sm font-bold tracking-wider uppercase mb-2">Your Best Friend</h2>
                <p className="text-2xl md:text-3xl font-medium text-white leading-tight">
                  You and <span className="font-extrabold text-white">{bffName}</span> exchanged <span className="font-extrabold text-[#7C8CFF]">{bff.messageCount.toLocaleString()}</span> messages.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: UserCheck, label: "Friends", value: friends.length, color: "#34D399" },
          { icon: MessageSquare, label: "DM Threads", value: analytics.dmChannels.length, color: "#5865F2" },
          { icon: Clock, label: "Pending", value: pending.length, color: "#F59E0B" },
          { icon: UserX, label: "Blocked", value: blocked.length, color: "#EF4444" },
        ].map((s) => (
          <div
            key={s.label}
            className="border-l border-[#252B34] pl-4 py-1 flex flex-col justify-between h-[76px]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
              <s.icon size={12} style={{ color: s.color }} className="opacity-70" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight">{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top friends by messages */}
        {topFriends.length > 0 && (
          <div className="lg:col-span-2 premium-card overflow-hidden">
            <div className="p-6 border-b border-[#252B34]">
              <h2 className="text-white text-base font-bold flex items-center gap-2">
                <MessageSquare size={16} className="text-[#5865F2]" />
                Most Messaged People
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {topFriends.map((f, i) => {
                const pct = (f.messageCount / maxMsgs) * 100;
                const name = f.name.replace("Direct Message with ", "").replace(/#\d+$/, "");
                return (
                  <div
                    key={f.id}
                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-[#12151A]/30 transition-colors"
                  >
                    <span className="text-[#5E6976] text-xs font-mono w-4 text-right flex-shrink-0">{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-[#12151A] border border-[#252B34] flex items-center justify-center flex-shrink-0 text-[#7C8CFF] font-bold text-xs">
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white text-sm font-semibold truncate">{name}</span>
                        <span className="text-[#9DA7B3] text-xs font-mono">
                          {f.messageCount.toLocaleString()} <span className="text-[#5E6976]">msgs</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#12151A] rounded-full overflow-hidden border border-[#252B34]/50">
                        <div
                          className="h-full rounded-full bg-[#5865F2] transition-all duration-800"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Friend list — paginated */}
        {friends.length > 0 && (
          <div className="premium-card flex flex-col overflow-hidden self-start">
            <div className="p-5 border-b border-[#252B34] flex items-center justify-between">
              <h2 className="text-white text-base font-bold flex items-center gap-2">
                <Users size={16} className="text-[#34D399]" />
                Friend List
                <span className="text-[#5E6976] text-xs font-mono font-normal ml-1">({friends.length})</span>
              </h2>
              <span className="text-[#5E6976] text-[11px] font-mono">
                {friendPage + 1}/{totalFriendPages}
              </span>
            </div>

            <div className="flex-1">
              {paginatedFriends.map((rel, i) => {
                const name = rel.user.global_name || rel.user.username;
                return (
                  <div
                    key={rel.id}
                    className={`flex items-center justify-between px-5 py-2.5 hover:bg-[#12151A]/30 transition-colors ${i !== paginatedFriends.length - 1 ? 'border-b border-[#252B34]/40' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#171B21] border border-[#252B34] flex items-center justify-center flex-shrink-0 text-[#7C8CFF] text-[11px] font-bold">
                        {name[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-[13px] font-semibold truncate leading-tight">{name}</p>
                        <p className="text-[#5E6976] text-[10px] font-mono truncate">@{rel.user.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination controls */}
            {totalFriendPages > 1 && (
              <div className="p-3 border-t border-[#252B34] flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setFriendPage((p) => Math.max(0, p - 1))}
                  disabled={friendPage === 0}
                  className="w-7 h-7 rounded-lg bg-[#12151A] border border-[#252B34] flex items-center justify-center text-[#9DA7B3] hover:text-white hover:border-[#5865F2] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                {(() => {
                  const pages: (number | '...')[] = [];
                  if (totalFriendPages <= 5) {
                    for (let i = 0; i < totalFriendPages; i++) pages.push(i);
                  } else {
                    pages.push(0);
                    if (friendPage > 2) pages.push('...');
                    for (let i = Math.max(1, friendPage - 1); i <= Math.min(totalFriendPages - 2, friendPage + 1); i++) {
                      pages.push(i);
                    }
                    if (friendPage < totalFriendPages - 3) pages.push('...');
                    pages.push(totalFriendPages - 1);
                  }
                  return pages.map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className="w-7 h-7 flex items-center justify-center text-[#5E6976] text-[11px] font-mono">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setFriendPage(p)}
                        className={`w-7 h-7 rounded-lg border text-[11px] font-bold font-mono flex items-center justify-center transition-all ${
                          p === friendPage
                            ? 'bg-[#5865F2] border-[#5865F2] text-white'
                            : 'bg-[#12151A] border-[#252B34] text-[#5E6976] hover:text-white hover:border-[#5865F2]'
                        }`}
                      >
                        {p + 1}
                      </button>
                    )
                  );
                })()}
                <button
                  onClick={() => setFriendPage((p) => Math.min(totalFriendPages - 1, p + 1))}
                  disabled={friendPage === totalFriendPages - 1}
                  className="w-7 h-7 rounded-lg bg-[#12151A] border border-[#252B34] flex items-center justify-center text-[#9DA7B3] hover:text-white hover:border-[#5865F2] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
