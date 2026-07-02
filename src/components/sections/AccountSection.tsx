"use client";

import { motion } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Shield, Globe, Monitor, Link, Star, UserCheck, CalendarDays, Laptop } from "lucide-react";
import * as LucideIcons from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

export default function AccountSection() {
  const { user, analytics } = useDataStore();
  if (!user || !analytics) return null;

  const displayName = user.global_name || user.username;
  const sessions = user.user_sessions ?? [];
  const connections = user.connections ?? [];

  const avatarUrl = user.avatar_hash
    ? user.avatar_hash.startsWith("data:image/")
      ? user.avatar_hash
      : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar_hash}.webp?size=256`
    : null;

  // Session OSes
  const osCounts: Record<string, number> = {};
  for (const s of sessions) {
    const os = s.user_data.client_info.os ?? "Unknown";
    osCounts[os] = (osCounts[os] ?? 0) + 1;
  }

  const flags = user.flags ?? [];
  const settings = user.settings?.settings;

  // Account Age Progress
  const accountAgeYears = (analytics.accountAge / 365).toFixed(1);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader label="USER IDENTITY" title="Account Details" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Identity Card */}
        <motion.div
          className="lg:col-span-2 premium-card overflow-hidden flex flex-col md:flex-row items-center md:items-stretch"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Avatar side */}
          <div className="w-full md:w-1/3 bg-[#12151A] border-b md:border-b-0 md:border-r border-[#252B34] flex flex-col items-center justify-center p-8 relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#171B21] shadow-xl mb-4 relative z-10">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#5865F2] to-[#7C8CFF] flex items-center justify-center text-white text-5xl font-black">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
            </div>
            {analytics.nitroStatus && (
              <div className="premium-badge border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] relative z-10">
                <Star size={12} className="fill-[#F59E0B]" />
                Nitro Subscriber
              </div>
            )}
          </div>
          
          {/* Info side */}
          <div className="flex-1 p-8 flex flex-col justify-center w-full">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-white tracking-tight mb-1">{displayName}</h2>
              <div className="flex items-center gap-3">
                <span className="text-[#9DA7B3] font-mono text-sm">@{user.username}#{user.discriminator ?? "0"}</span>
                <span className="w-1 h-1 rounded-full bg-[#252B34]" />
                <span className="text-[#5E6976] font-mono text-[10px]">ID: {user.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-l border-[#252B34] pl-4 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={12} className="text-[#34D399]" />
                  <span className="text-[#5E6976] text-[10px] uppercase font-bold tracking-wider">Account Age</span>
                </div>
                <div className="text-white font-extrabold text-lg">{analytics.accountAge} <span className="text-[#5E6976] text-xs font-medium">days</span></div>
              </div>
              <div className="border-l border-[#252B34] pl-4 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <Laptop size={12} className="text-[#7C8CFF]" />
                  <span className="text-[#5E6976] text-[10px] uppercase font-bold tracking-wider">Sessions</span>
                </div>
                <div className="text-white font-extrabold text-lg">{sessions.length} <span className="text-[#5E6976] text-xs font-medium">active</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Age Visual */}
        <motion.div
          className="premium-card p-6 flex flex-col justify-between relative overflow-hidden self-start"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#5865F2] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <h3 className="text-white text-base font-bold flex items-center gap-2 mb-2">
              <UserCheck size={16} className="text-[#34D399]" />
              Discord Veteran
            </h3>
            <p className="text-[#9DA7B3] text-sm">You have been on Discord for over <span className="text-white font-bold">{accountAgeYears} years</span>.</p>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between text-[#9DA7B3] text-[10px] font-mono font-bold tracking-wider mb-2 uppercase">
              <span>Created</span>
              <span>Today</span>
            </div>
            <div className="h-2 w-full bg-[#12151A] rounded-full overflow-hidden border border-[#252B34]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#5865F2] to-[#34D399] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badges */}
        <motion.div
          className="premium-card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-white text-base font-bold mb-6 flex items-center gap-2">
            <Star size={16} className="text-[#F59E0B]" />
            Profile Badges
          </h3>
          {analytics.userBadges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {analytics.userBadges.map((badge) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Icon = (LucideIcons as any)[badge.icon] || LucideIcons.Tag;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252B34] interactive-action"
                  >
                    <Icon size={16} className="text-[#F59E0B]" />
                    <span className="text-white text-xs font-semibold">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-[#252B34] rounded-xl">
              <span className="text-[#9DA7B3] text-sm">No badges available.</span>
            </div>
          )}
        </motion.div>

        {/* Connected Accounts */}
        <motion.div
          className="premium-card p-6 self-start"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-white text-base font-bold mb-6 flex items-center gap-2">
            <Link size={16} className="text-[#5865F2]" />
            Integrations ({connections.length})
          </h3>
          {connections.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {connections.map((conn) => (
                <div
                  key={`${conn.type}-${conn.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#12151A] border border-[#252B34] hover:border-[#5E6976] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#171B21] border border-[#252B34] flex items-center justify-center text-[#9DA7B3] font-bold text-xs uppercase flex-shrink-0">
                    {conn.type.substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold capitalize truncate">{conn.type}</p>
                    <p className="text-[#5E6976] text-[10px] truncate">{conn.name ?? conn.id}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-[#252B34] rounded-xl">
              <span className="text-[#9DA7B3] text-sm">No connected accounts.</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings/Flags */}
        <motion.div
          className="premium-card p-6 self-start"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-white text-base font-bold mb-6 flex items-center gap-2">
            <Globe size={16} className="text-[#5865F2]" />
            Preferences & Flags
          </h3>
          <div className="space-y-4">
            {settings && (
              <div className="space-y-3 p-4 bg-[#12151A] rounded-xl border border-[#252B34]">
                {settings.localization?.locale && (
                  <Row label="Language" value={settings.localization.locale} />
                )}
                {settings.appearance?.theme && (
                  <Row label="Theme" value={settings.appearance.theme} />
                )}
                {settings.status?.status && (
                  <Row label="Status" value={settings.status.status} />
                )}
                {settings.appearance?.developerMode !== undefined && (
                  <Row label="Developer Mode" value={settings.appearance.developerMode ? "Enabled" : "Disabled"} />
                )}
              </div>
            )}
            
            {flags.length > 0 && (
              <div>
                <h4 className="text-[#9DA7B3] text-[10px] font-bold uppercase tracking-wider mb-2">System Flags</h4>
                <div className="flex flex-wrap gap-2">
                  {flags.map((flag) => (
                    <span key={flag} className="premium-badge border-[#252B34] text-[10px]">
                      <Shield size={10} className="text-[#EF4444]" />
                      {flag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sessions overview */}
        <motion.div
          className="premium-card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-white text-base font-bold mb-6 flex items-center gap-2">
            <Monitor size={16} className="text-[#7C8CFF]" />
            Active Sessions
          </h3>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {Object.entries(osCounts).map(([os, count]) => (
                <div key={os} className="px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252B34] flex items-center gap-2">
                  <span className="text-white text-xs font-semibold">{os}</span>
                  <span className="w-5 h-5 rounded bg-[#171B21] flex items-center justify-center text-[#9DA7B3] text-[10px] font-mono">{count}</span>
                </div>
              ))}
            </div>

            <div className="max-h-[280px] overflow-y-auto pr-2 space-y-2">
              {sessions.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-[#252B34] bg-[#12151A]">
                  <div>
                    <p className="text-white text-xs font-semibold">{s.user_data.client_info.os ?? "Unknown OS"}</p>
                    <p className="text-[#5E6976] text-[10px]">{s.user_data.client_info.platform ?? "Unknown Client"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#9DA7B3] text-xs font-mono">{s.user_data.city ?? "Unknown"}, {s.user_data.country_code ?? "??"}</p>
                    <p className="text-[#5E6976] text-[10px]">{s.user_data.approx_last_used_time ? (() => { const d = new Date(s.user_data.approx_last_used_time); return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString(); })() : 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-[#9DA7B3] text-xs font-medium">{label}</span>
      <span className="text-white text-xs font-bold capitalize bg-[#171B21] px-2 py-0.5 rounded border border-[#252B34]">{value}</span>
    </div>
  );
}
