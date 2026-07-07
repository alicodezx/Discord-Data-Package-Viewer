"use client";

import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Calendar, Compass, History, Activity, Zap } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { CHART_TOOLTIP_STYLE } from "@/lib/ui";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function TimelineSection() {
  const { analytics } = useDataStore();
  if (!analytics) return null;

  
  const yearData: Record<string, number> = {};
  for (const [month, count] of Object.entries(analytics.messagesByMonth)) {
    const year = month.substring(0, 4);
    yearData[year] = (yearData[year] ?? 0) + count;
  }

  const allMonths = Object.entries(analytics.messagesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      label: `${MONTHS[parseInt(month.substring(5, 7)) - 1]} ${month.substring(2, 4)}`,
      month,
      count,
    }));

  const years = Object.entries(yearData).sort(([a], [b]) => a.localeCompare(b));

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeekData = analytics.messagesByDayOfWeek.map((count, index) => ({
    name: DAYS[index],
    count
  }));

  const hourOfDayData = analytics.messagesByHour.map((count, index) => {
    const ampm = index >= 12 ? 'PM' : 'AM';
    const hour = index % 12 || 12;
    return {
      name: `${hour}${ampm}`,
      count
    };
  });

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      <SectionHeader
        title="Timeline"
        meta={
          <span className="text-[#9DA7B3] text-xs font-medium bg-[#12151A] border border-[#252B34] px-4 py-2 rounded-lg font-mono">
            {analytics.firstMessageDate}
            <span className="mx-2 text-[#5E6976]">→</span>
            {analytics.lastMessageDate}
          </span>
        }
      />

      {/* Year overview grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {years.map(([year, count], i) => (
          <motion.div
            key={year}
            className={`border-l-2 pl-4 py-3 flex flex-col gap-2 ${year === analytics.mostActiveYear ? "border-[#5865F2]" : "border-[#252B34]"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[#5E6976] text-sm font-bold font-mono tracking-wider">{year}</span>
              {year === analytics.mostActiveYear && (
                <div className="flex items-center gap-1 text-[#7C8CFF]">
                  <Zap size={11} className="fill-[#7C8CFF]" />
                  <span className="text-[10px] font-bold uppercase">Peak</span>
                </div>
              )}
            </div>
            <div className="text-3xl font-black text-white tracking-tight leading-none">{count.toLocaleString()}</div>
            <div className="text-[#5E6976] text-xs font-semibold uppercase tracking-wider">Messages</div>
          </motion.div>
        ))}
      </div>

      {/* Full timeline chart */}
      <motion.div
        className="premium-card p-6 flex flex-col"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-white text-base font-bold flex items-center gap-2">
              <History size={16} className="text-[#5865F2]" />
              All-Time Message History
            </h2>

          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={allMonths} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5865F2" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5865F2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} interval={Math.max(1, Math.floor(allMonths.length / 10))} />
              <YAxis tickLine={false} axisLine={false} tickMargin={12} />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                {...CHART_TOOLTIP_STYLE}
              />
              <Area type="monotone" dataKey="count" stroke="#5865F2" strokeWidth={2} fill="url(#timeGrad)" activeDot={{ r: 4, strokeWidth: 0, fill: "#7C8CFF" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Activity Heatmaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="premium-card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6">
            <h2 className="text-white text-base font-bold flex items-center gap-2">
              <Calendar size={16} className="text-[#34D399]" />
              Activity by Day of Week
            </h2>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={dayOfWeekData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={12} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  {...CHART_TOOLTIP_STYLE}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                   {dayOfWeekData.map((d, i) => {
                    const max = Math.max(...dayOfWeekData.map(x => x.count));
                    return <Cell key={i} fill={d.count === max ? "#34D399" : "var(--border)"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="premium-card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6">
            <h2 className="text-white text-base font-bold flex items-center gap-2">
              <Activity size={16} className="text-[#e91e8c]" />
              Activity by Hour of Day
            </h2>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={hourOfDayData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={12} interval={2} />
                <YAxis tickLine={false} axisLine={false} tickMargin={12} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  {...CHART_TOOLTIP_STYLE}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {hourOfDayData.map((d, i) => {
                    const max = Math.max(...hourOfDayData.map(x => x.count));
                    const intensity = d.count / (max || 1);
                    return <Cell key={i} fill={d.count === max ? "#e91e8c" : `rgba(233, 30, 140, ${0.1 + intensity * 0.5})`} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Milestones / Account History Log */}
      <motion.div
        className="premium-card p-5 md:p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6 flex items-center gap-2">
          <Compass size={15} className="text-[#5865F2]" />
          <h2 className="text-white text-sm font-bold">Historical Milestones</h2>
        </div>

        <div className="relative">
          {/* Vertical line — inset so it spans between dots only */}
          <div className="absolute left-[7px] top-4 bottom-4 w-px bg-gradient-to-b from-[#5865F2] via-[#252B34] to-[#34D399]" />

          <div className="space-y-4 pl-8">
            {[
              {
                label: "Digital Journey Begins",
                date: analytics.firstMessageDate,
                desc: "Your very first tracked message was sent on Discord.",
                color: "#5865F2",
              },
              analytics.nitroSince && {
                label: "Nitro Supporter",
                date: new Date(analytics.nitroSince).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
                desc: analytics.nitroDays ? `You unlocked Discord Nitro. You've held it for ${analytics.nitroDays} days.` : "You became a Discord Nitro subscriber.",
                color: "#F59E0B",
              },
              {
                label: "Peak Activity Era",
                date: analytics.mostActiveMonth,
                desc: `Your busiest month on record. You sent ${analytics.messagesByMonth[analytics.mostActiveMonth]?.toLocaleString() ?? "N/A"} messages.`,
                color: "#e91e8c",
              },
              {
                label: "Most Recent Activity",
                date: analytics.lastMessageDate,
                desc: "The last tracked message in your data export.",
                color: "#34D399",
              },
            ]
              .filter((m): m is { label: string; date: string; desc: string; color: string } => Boolean(m))
              .map((m: { label: string; date: string; desc: string; color: string }, i) => (
                <div key={i} className="relative group flex items-center gap-4">
                  {/* Dot — centered vertically via flex alignment */}
                  <div
                    className="absolute -left-8 w-3.5 h-3.5 rounded-full border-2 border-[#0B0D10] z-10 flex-shrink-0 transition-transform group-hover:scale-125"
                    style={{ backgroundColor: m.color, boxShadow: `0 0 6px ${m.color}60` }}
                  />
                  <div className="flex-1 bg-[#12151A] border border-[#252B34] px-4 py-3 rounded-xl transition-all group-hover:border-white/20 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-white font-bold text-sm block">{m.label}</span>
                      <p className="text-[#9DA7B3] text-xs leading-relaxed mt-0.5">{m.desc}</p>
                    </div>
                    <span
                      className="text-[11px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-lg border whitespace-nowrap flex-shrink-0"
                      style={{ color: m.color, backgroundColor: `${m.color}15`, borderColor: `${m.color}30` }}
                    >{m.date}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
