"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Brain, Clock, Volume2, Sparkles } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function BehaviorSection() {
  const { analytics } = useDataStore();
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number; count: number } | null>(null);

  const rawHourlyGrid = analytics?.hourlyByDayOfWeek;
  const toneMetrics = analytics?.toneMetrics;
  const voiceCallStats = analytics?.voiceCallStats;

  const hourlyGrid = useMemo(() => {
    if (rawHourlyGrid && rawHourlyGrid.length === 7) return rawHourlyGrid;
    return Array.from({ length: 7 }, () => new Array(24).fill(0));
  }, [rawHourlyGrid]);

  const maxGridCount = useMemo(() => {
    let maxVal = 0;
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        if (hourlyGrid[d][h] > maxVal) {
          maxVal = hourlyGrid[d][h];
        }
      }
    }
    return maxVal || 1;
  }, [hourlyGrid]);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      <SectionHeader title="Deep Patterns" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          className="xl:col-span-2 p-6 rounded-xl border border-[#252B34] bg-[#12151A] flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h3 className="text-white text-base font-bold flex items-center gap-2 mb-1">
              <Clock size={16} className="text-[#5865F2]" />
              Activity Heatmap (Punch Card)
            </h3>
            <p className="text-[#9DA7B3] text-xs">Your message frequency mapped by hour and day of week (UTC).</p>
          </div>

          <div className="mt-8 overflow-x-auto pb-2 scrollbar-thin">
            <div className="min-w-[650px] flex flex-col gap-1.5">
              <div className="flex pl-10 mb-1 text-[9px] font-mono text-[#5E6976] font-bold">
                {Array.from({ length: 24 }).map((_, h) => (
                  <div key={h} className="flex-1 text-center truncate">
                    {h.toString().padStart(2, "0")}
                  </div>
                ))}
              </div>

              {hourlyGrid.map((row, d) => (
                <div key={d} className="flex items-center gap-1">
                  <div className="w-9 text-[10px] font-bold font-mono text-[#9DA7B3] uppercase">
                    {DAYS_SHORT[d]}
                  </div>
                  <div className="flex-1 flex gap-1">
                    {row.map((count, h) => {
                      const ratio = count / maxGridCount;
                      let bgStyle = "bg-[#252B34]/30";
                      if (ratio > 0.05) bgStyle = "bg-[#5865F2]/20";
                      if (ratio > 0.25) bgStyle = "bg-[#5865F2]/40";
                      if (ratio > 0.5) bgStyle = "bg-[#5865F2]/75";
                      if (ratio > 0.8) bgStyle = "bg-[#5865F2]";

                      return (
                        <div
                          key={h}
                          className={`flex-1 h-5 rounded-sm transition-all duration-150 cursor-pointer hover:ring-1 hover:ring-white/50 ${bgStyle}`}
                          onMouseEnter={() => setHoveredCell({ day: d, hour: h, count })}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#252B34]/60 pt-4">
            <div className="text-xs font-mono text-[#9DA7B3] h-5">
              {hoveredCell ? (
                <span>
                  {DAYS_FULL[hoveredCell.day]}s at {hoveredCell.hour.toString().padStart(2, "0")}:00 UTC:{" "}
                  <strong className="text-white font-bold">{hoveredCell.count.toLocaleString()} messages</strong>
                </span>
              ) : (
                <span className="text-[#5E6976]">Hover over any block to see detailed counts</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#5E6976]">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-[#252B34]/30" />
              <div className="w-3 h-3 rounded-sm bg-[#5865F2]/20" />
              <div className="w-3 h-3 rounded-sm bg-[#5865F2]/40" />
              <div className="w-3 h-3 rounded-sm bg-[#5865F2]/75" />
              <div className="w-3 h-3 rounded-sm bg-[#5865F2]" />
              <span>More</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl border border-[#252B34] bg-[#12151A] flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h3 className="text-white text-base font-bold flex items-center gap-2 mb-1">
              <Brain size={16} className="text-[#7C8CFF]" />
              Typing Tone & Expression
            </h3>

          </div>

          <div className="space-y-6 my-6">
            <div className="border-l border-[#252B34] pl-4 py-0.5">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Shouting Rate (ALL CAPS)</span>
              <div className="text-xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                {toneMetrics?.capsPercentage.toFixed(1)}%
                <span className="text-[#5E6976] text-xs font-mono font-normal">of messages</span>
              </div>
            </div>

            <div className="border-l border-[#252B34] pl-4 py-0.5">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Inquiry Rate (Contains &apos;?&apos;)</span>
              <div className="text-xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                {toneMetrics?.questionPercentage.toFixed(1)}%
                <span className="text-[#5E6976] text-xs font-mono font-normal">of messages</span>
              </div>
            </div>

            <div className="border-l border-[#252B34] pl-4 py-0.5">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Excitement Rate (Contains &apos;!&apos;)</span>
              <div className="text-xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                {toneMetrics?.exclamationPercentage.toFixed(1)}%
                <span className="text-[#5E6976] text-xs font-mono font-normal">of messages</span>
              </div>
            </div>

            <div className="border-l border-[#252B34] pl-4 py-0.5">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Average Word Density</span>
              <div className="text-xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                {toneMetrics?.avgWordLength.toFixed(1)}
                <span className="text-[#5E6976] text-xs font-mono font-normal">characters / word</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0D10]/50 border border-[#252B34]/60 rounded-lg p-3 text-[10px] text-[#9DA7B3] leading-relaxed flex items-start gap-2">
            <Sparkles size={12} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <span>
              {toneMetrics && toneMetrics.capsPercentage > 10 ? (
                "Your shouting rate is relatively high. You likely use ALL CAPS for emphasis or excited reactions frequently."
              ) : (
                "Your shouting rate is low. You maintain a calm and structured typography profile."
              )}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="p-6 rounded-xl border border-[#252B34] bg-[#12151A]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6">
          <h3 className="text-white text-base font-bold flex items-center gap-2 mb-1">
            <Volume2 size={16} className="text-[#34D399]" />
            Voice Channels & Calls (Telemetry Estimate)
          </h3>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
          <div className="border-l border-[#252B34] pl-4 py-1">
            <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-1">Total Voice Presence</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">{voiceCallStats?.totalHours.toLocaleString()} <span className="text-[#5E6976] text-xs font-medium font-sans">hours</span></div>
          </div>

          <div className="border-l border-[#252B34] pl-4 py-1">
            <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-1">Average Call Length</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">{voiceCallStats?.averageCallMinutes} <span className="text-[#5E6976] text-xs font-medium font-sans">mins</span></div>
          </div>

          <div className="border-l border-[#252B34] pl-4 py-1">
            <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-1">Longest Session</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">{( (voiceCallStats?.longestCallMinutes ?? 0) / 60 ).toFixed(1)} <span className="text-[#5E6976] text-xs font-medium font-sans">hours</span></div>
          </div>

          <div className="border-l border-[#252B34] pl-4 py-1">
            <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider block mb-1">Peak Active Time</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {voiceCallStats ? `${voiceCallStats.favoriteCallHour.toString().padStart(2, "0")}:00` : "N/A"}
              <span className="text-[#5E6976] text-xs font-medium font-mono ml-1">UTC</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
