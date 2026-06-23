"use client";

import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Server, Zap, Globe, AlignLeft } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { CHART_TOOLTIP_STYLE } from "@/lib/ui";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const CustomYAxisTick = ({ x, y, payload }: { x?: number, y?: number, payload?: { value: string } }) => {
  const maxLen = 22;
  const text = payload?.value ?? "";
  let line1 = text;
  let line2 = "";
  
  if (text.length > maxLen) {
    const splitIndex = text.lastIndexOf(" ", maxLen);
    if (splitIndex > 0) {
      line1 = text.substring(0, splitIndex);
      line2 = text.substring(splitIndex + 1);
      if (line2.length > maxLen) {
        line2 = line2.substring(0, maxLen - 1) + "…";
      }
    } else {
      line1 = text.substring(0, maxLen);
      line2 = text.substring(maxLen, maxLen * 2 - 1) + (text.length > maxLen * 2 - 1 ? "…" : "");
    }
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={line2 ? -4 : 4} textAnchor="end" fill="var(--text-secondary)" fontSize={11}>
        {line1}
      </text>
      {line2 && (
        <text x={0} y={10} textAnchor="end" fill="var(--text-secondary)" fontSize={11}>
          {line2}
        </text>
      )}
    </g>
  );
};

export default function ServersSection() {
  const { analytics } = useDataStore();
  if (!analytics) return null;

  const topServers = analytics.topServers.slice(0, 15);
  const maxCount = topServers[0]?.count ?? 1;

  // Insight calculations
  const totalServerMessages = analytics.guildChannels.reduce((acc, c) => acc + c.messageCount, 0);
  const averageMessagesPerServer = analytics.serverCount > 0 ? (totalServerMessages / analytics.serverCount).toFixed(0) : "0";
  const mostActiveServerName = topServers[0]?.name || "N/A";

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader label="COMMUNITIES & GUILDS" title="Servers" />

      {/* Hero Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          className="border-l border-[#252B34] pl-4 py-1 flex flex-col justify-between h-[76px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Communities Joined</span>
            <Globe size={12} className="text-[#7C8CFF] opacity-70" />
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{analytics.serverCount}</div>
        </motion.div>

        <motion.div
          className="border-l border-[#252B34] pl-4 py-1 flex flex-col justify-between h-[76px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Top Community</span>
            <Zap size={12} className="text-[#F59E0B] opacity-70" />
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight truncate" title={mostActiveServerName}>{mostActiveServerName}</div>
        </motion.div>

        <motion.div
          className="border-l border-[#252B34] pl-4 py-1 flex flex-col justify-between h-[76px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">Average Activity</span>
            <AlignLeft size={12} className="text-[#34D399] opacity-70" />
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight">{averageMessagesPerServer} <span className="text-[#5E6976] text-xs font-semibold">avg msgs/server</span></div>
        </motion.div>
      </div>

      {/* Top Servers Chart */}
      <motion.div
        className="premium-card p-6 flex flex-col"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-white text-base font-bold">Top Servers by Volume</h2>
            <p className="text-[#9DA7B3] text-xs mt-1">Ranking of the top 15 most active servers.</p>
          </div>
        </div>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={Math.max(320, topServers.length * 40)} minWidth={0} minHeight={0}>
            <BarChart data={topServers.map((s) => ({ name: s.name, count: s.count }))} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <CartesianGrid horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={<CustomYAxisTick />} tickLine={false} axisLine={false} width={180} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                {...CHART_TOOLTIP_STYLE}
                formatter={(value: unknown) => [Number(value).toLocaleString(), "Messages"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {topServers.map((_, i) => (
                  <Cell key={i} fill={`rgba(88, 101, 242, ${1 - (i / topServers.length) * 0.7})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Server Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {analytics.servers.slice(0, 18).map((server, i) => {
          const pct = (server.messageCount / maxCount) * 100;
          return (
            <motion.div
              key={server.id}
              className="premium-card p-5 interactive-action"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.02, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#12151A] border border-[#252B34] flex items-center justify-center flex-shrink-0">
                    <Server size={16} className="text-[#5865F2]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm truncate max-w-[150px] sm:max-w-[180px]">{server.name}</p>
                    <p className="text-[#9DA7B3] text-[11px] mt-0.5">{server.channelCount} channels · Rank #{i + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold text-sm">{server.messageCount.toLocaleString()}</p>
                  <p className="text-[#9DA7B3] text-[10px] uppercase font-bold tracking-wider">Msgs</p>
                </div>
              </div>
              
              <div className="w-full h-1.5 bg-[#12151A] rounded-full overflow-hidden border border-[#252B34]/50">
                <motion.div
                  className="h-full rounded-full bg-[#7C8CFF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>



    </div>
  );
}
