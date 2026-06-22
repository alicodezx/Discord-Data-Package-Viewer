"use client";

import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Trophy, Gamepad2, Gift, Tv, CheckCircle2, AlertCircle } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

export default function QuestsSection() {
  const { analytics } = useDataStore();
  if (!analytics || !analytics.questStats) return null;

  const {
    totalQuestsJoined,
    questsCompleted,
    estimatedRewardsClaimed,
    totalQuestStreamingHours,
    questHistory,
  } = analytics.questStats;

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader label="TELEMETRY & REWARDS" title="Discord Quests" />

      {/* Heuristic Information Notice */}
      <motion.div
        className="premium-card p-5 bg-[#12151A]/60 border-[#252B34] flex gap-3.5 items-start"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
      >
        <AlertCircle size={20} className="text-[#7C8CFF] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white text-sm font-bold mb-1">Quest Estimation Disclosure</h4>
          <p className="text-[#9DA7B3] text-xs leading-relaxed">
            Standard Discord data exports do not record individual quest logs. The statistics below are heuristically estimated based on game integration timestamps, active streaming timeframes, and historical Discord Quest release events matching your active gaming sessions.
          </p>
        </div>
      </motion.div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Quests Joined", value: totalQuestsJoined, icon: Gamepad2, color: "text-[#7C8CFF]", bg: "bg-[#7C8CFF]/5" },
          { label: "Completed", value: questsCompleted, icon: Trophy, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/5" },
          { label: "Rewards Claimed", value: estimatedRewardsClaimed, icon: Gift, color: "text-[#34D399]", bg: "bg-[#34D399]/5" },
          { label: "Streaming Hours", value: `${totalQuestStreamingHours}h`, icon: Tv, color: "text-[#5865F2]", bg: "bg-[#5865F2]/5" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className="premium-card p-6 flex flex-col justify-between"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#5E6976] text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className={item.color} />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{item.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Quest History Table */}
      <motion.div
        className="premium-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="text-white text-base font-bold mb-6 flex items-center gap-2">
          <Trophy size={16} className="text-[#F59E0B]" />
          Quest Logs & Rewards history
        </h3>

        <div className="table-responsive">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252B34] text-[#5E6976] text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3 pr-4">Game</th>
                <th className="pb-3 pr-4">Quest Name</th>
                <th className="pb-3 pr-4">Reward Type</th>
                <th className="pb-3 pr-4">Reward Name</th>
                <th className="pb-3 pr-4">Completed Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B34]/60 text-xs text-[#9DA7B3]">
              {questHistory.map((quest) => (
                <tr key={quest.id} className="hover:bg-[#12151A]/40 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-white">{quest.gameName}</td>
                  <td className="py-3.5 pr-4">{quest.questName}</td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2 py-0.5 rounded bg-[#12151A] border border-[#252B34] text-[10px]">
                      {quest.rewardType}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-[#F5F7FA] font-medium">{quest.rewardName}</td>
                  <td className="py-3.5 pr-4 font-mono text-[10px]">{quest.completedAt}</td>
                  <td className="py-3.5 text-right">
                    {quest.completedAt === "—" ? (
                      <span className="inline-flex items-center gap-1 text-[#5E6976] font-semibold text-[10px] uppercase">
                        In Progress
                      </span>
                    ) : quest.claimed ? (
                      <span className="inline-flex items-center gap-1 text-[#34D399] font-semibold text-[10px] uppercase">
                        <CheckCircle2 size={10} />
                        Claimed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#F59E0B] font-semibold text-[10px] uppercase">
                        Unclaimed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
