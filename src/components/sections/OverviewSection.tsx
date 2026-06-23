"use client";

import { motion } from "framer-motion";
import {
  MessageSquare, Hash, Users, Server, Zap, Clock, TrendingUp,
  Calendar, Type, Star
} from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import SectionHeader from "@/components/SectionHeader";
import { CHART_TOOLTIP_STYLE, FADE_UP_DELAY } from "@/lib/ui";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid
} from "recharts";

export default function OverviewSection() {
  const { analytics, user } = useDataStore();
  if (!analytics) return null;

  const displayName = user?.global_name || user?.username || "User";

  // Activity by month chart data
  const monthlyData = Object.entries(analytics.messagesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-24)
    .map(([month, count]) => ({
      month: month.replace(/^\d{4}-/, ""),
      year: month.substring(0, 4),
      count,
      label: formatMonth(month),
    }));

  // Hourly data
  const hourlyData = analytics.messagesByHour.map((count, hour) => ({
    hour: `${hour}:00`,
    count,
  }));

  // DOW data
  const dowLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dowData = analytics.messagesByDayOfWeek.map((count, i) => ({
    day: dowLabels[i],
    count,
  }));

  const statCards = [
    {
      icon: MessageSquare,
      label: "Total Messages",
      value: analytics.totalMessages.toLocaleString(),
      sub: `${analytics.averageMessagesPerDay.toFixed(1)} avg/day`,
      color: "#5865F2",
    },
    {
      icon: Type,
      label: "Words Typed",
      value: analytics.totalWords.toLocaleString(),
      sub: `${analytics.averageWordsPerMessage.toFixed(1)} avg/msg`,
      color: "#7C8CFF",
    },
    {
      icon: Server,
      label: "Servers",
      value: analytics.serverCount.toLocaleString(),
      sub: `${analytics.guildChannels.length} channels`,
      color: "#34D399",
    },
    {
      icon: Users,
      label: "Friends",
      value: analytics.friendCount.toLocaleString(),
      sub: `${analytics.dmChannels.length} DMs`,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader
        label="WORKSPACE INSIGHTS"
        title={`${displayName}\u2019s Activity`}
        meta={
          <span className="text-[#9DA7B3] text-xs font-medium bg-[#12151A] border border-[#252B34] px-4 py-2 rounded-lg font-mono">
            {formatSimpleDate(analytics.firstMessageDate)}
            <span className="mx-2 text-[#5E6976]">→</span>
            {formatSimpleDate(analytics.lastMessageDate)}
          </span>
        }
      />

      {/* Primary stats — Messages and Words are dominant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statCards.slice(0, 2).map((card, i) => (
          <motion.div
            key={card.label}
            className="p-6 rounded-xl border border-[#252B34] bg-[#12151A]"
            {...FADE_UP_DELAY(0.05 + i * 0.05)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9DA7B3] text-xs font-semibold uppercase tracking-wider">{card.label}</span>
              <card.icon size={16} className="text-[#5865F2]" />
            </div>
            <div className="text-4xl font-extrabold text-white tracking-tight leading-none mb-2">{card.value}</div>
            <div className="text-[#9DA7B3] text-xs font-medium font-mono">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Secondary stats — Servers and Friends are subordinate */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.slice(2).map((card, i) => (
          <motion.div
            key={card.label}
            className="p-4 rounded-xl border border-[#252B34] bg-[#12151A]"
            {...FADE_UP_DELAY(0.15 + i * 0.05)}
          >
            <span className="text-[#5E6976] text-[10px] font-semibold uppercase tracking-wider">{card.label}</span>
            <div className="text-xl font-bold text-white tracking-tight mt-2">{card.value}</div>
            <div className="text-[#5E6976] text-[10px] font-mono mt-1">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Insights Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main: Message Activity */}
        <motion.div
          className="lg:col-span-2 premium-card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-base font-bold">Message History</h3>
              <p className="text-[#9DA7B3] text-xs">Total volume of messages sent per month</p>
            </div>
            <span className="premium-badge font-mono text-[10px]">24M WINDOW</span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5865F2" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#5865F2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                  {...CHART_TOOLTIP_STYLE}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#5865F2"
                  strokeWidth={2}
                  fill="url(#areaGlow)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#7C8CFF" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right side: Day of Week */}
        <motion.div
          className="premium-card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6">
            <h3 className="text-white text-base font-bold">Weekly Distribution</h3>
            <p className="text-[#9DA7B3] text-xs">Total volume split across days of the week</p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={dowData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={12} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  {...CHART_TOOLTIP_STYLE}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {dowData.map((_, i) => {
                    const maxIdx = analytics.messagesByDayOfWeek.indexOf(Math.max(...analytics.messagesByDayOfWeek));
                    return (
                      <Cell
                        key={i}
                        fill={i === maxIdx ? "#5865F2" : "var(--border)"}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Hourly patterns heatmap widget */}
      <motion.div
        className="premium-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-base font-bold">24-Hour Timeline</h3>
            <p className="text-[#9DA7B3] text-xs">Communication habits by hour of day (UTC)</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9DA7B3] font-mono">
            <Clock size={12} className="text-[#5865F2]" />
            <span>Peak activity: {hourlyData.reduce((a, b) => a.count > b.count ? a : b).hour}</span>
          </div>
        </div>

        <div className="h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={hourlyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={10} interval={2} />
              <YAxis tickLine={false} axisLine={false} hide />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                {...CHART_TOOLTIP_STYLE}
              />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {hourlyData.map((d, i) => {
                  const max = Math.max(...hourlyData.map((x) => x.count));
                  const intensity = d.count / (max || 1);
                  return (
                    <Cell
                      key={i}
                      fill={d.count === max ? "#5865F2" : `rgba(124, 140, 255, ${0.1 + intensity * 0.75})`}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Shareable facts & metadata row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Peak Activity Year",
            value: analytics.mostActiveYear,
            icon: TrendingUp,
            color: "#5865F2",
          },
          {
            title: "Busiest Weekday",
            value: analytics.mostActiveDay,
            icon: Calendar,
            color: "#7C8CFF",
          },
          {
            title: "Nitro Subscribed",
            value: analytics.nitroSince ? new Date(analytics.nitroSince).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : "None",
            icon: Star,
            color: "#F59E0B",
          },
          {
            title: "Night Owl Ratio",
            value: `${analytics.nightOwlPercentage.toFixed(1)}%`,
            icon: Clock,
            color: "#34D399",
          },
          {
            title: "Weekend Ratio",
            value: `${analytics.weekendWarriorPercentage.toFixed(1)}%`,
            icon: Zap,
            color: "#EF4444",
          },
          {
            title: "Slash Commands",
            value: analytics.totalSlashCommands.toLocaleString(),
            icon: Hash,
            color: "#5E6976",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            className="border-l border-[#252B34] pl-4 py-1 flex flex-col justify-between h-[76px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">{item.title}</span>
              <item.icon size={12} style={{ color: item.color }} className="opacity-70" />
            </div>
            <div className="text-xl font-extrabold text-white tracking-tight">{item.value || "—"}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}

function formatSimpleDate(d: string): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}
