"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import { Star, MessageSquare, Server, Users, Trophy, Calendar, Type, ArrowRight, ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";

const slides = [
  "intro",
  "messages",
  "topServer",
  "topFriend",
  "streaks",
  "words",
  "activity",
  "outro",
] as const;

type Slide = (typeof slides)[number];

export default function WrappedSection() {
  const { analytics, user } = useDataStore();
  const [currentSlide, setCurrentSlide] = useState<Slide>("intro");

  if (!analytics) return null;

  const idx = slides.indexOf(currentSlide);
  const canPrev = idx > 0;
  const canNext = idx < slides.length - 1;

  const go = (dir: 1 | -1) => {
    const newIdx = idx + dir;
    if (newIdx >= 0 && newIdx < slides.length) setCurrentSlide(slides[newIdx]);
  };

  const displayName = user?.global_name || user?.username || "User";
  const topServer = analytics.topServers[0];
  const topFriend = analytics.topFriends[0];
  const topWord = analytics.topWords[0];

  return (
    <div className="p-6 md:p-10 max-w-[1400px] flex flex-col min-h-[calc(100vh-80px)]">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[#9DA7B3] text-xs font-bold uppercase tracking-wider mb-1">ANNUAL REVIEW</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Star className="text-[#F59E0B] fill-[#F59E0B]" size={28} />
            Insights Wrapped
          </h1>
        </div>
        <div className="text-[#9DA7B3] text-xs font-mono bg-[#12151A] px-3 py-1.5 rounded-lg border border-[#252B34]">
          Slide {idx + 1} of {slides.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-10 w-full max-w-3xl mx-auto">
        {slides.map((s, i) => (
          <button
            key={s}
            onClick={() => setCurrentSlide(s)}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${
              i <= idx ? "bg-[#5865F2]" : "bg-[#252B34]"
            }`}
          />
        ))}
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="w-full max-w-3xl"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {currentSlide === "intro" && (
              <WrappedCard
                icon={<Star size={40} className="text-[#F59E0B]" />}
                title={`${displayName}\u2019s Recap`}
                subtitle="Here\u2019s what your Discord data says about you."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                  <MiniStat label="Messages Sent" value={analytics.totalMessages.toLocaleString()} />
                  <MiniStat label="Communities" value={analytics.serverCount.toLocaleString()} />
                  <MiniStat label="Friends" value={analytics.friendCount.toLocaleString()} />
                </div>
              </WrappedCard>
            )}

            {currentSlide === "messages" && (
              <WrappedCard
                icon={<MessageSquare size={40} className="text-[#7C8CFF]" />}
                title="Your Messages"
                subtitle="Total output across all channels and DMs."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="mt-8 flex flex-col items-center">
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#7C8CFF] font-mono text-sm mb-6">
                    {analytics.averageMessagesPerDay.toFixed(0)} messages daily
                  </div>
                  <p className="text-7xl md:text-8xl font-black text-white tracking-tight mb-2 text-center leading-none">
                    {analytics.totalMessages.toLocaleString()}
                  </p>
                  <p className="text-[#9DA7B3] text-lg mb-10 uppercase tracking-widest font-bold">Total Messages</p>
                  
                  <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-[#171B21] border border-[#252B34] rounded-2xl p-6 text-center">
                      <p className="text-3xl font-black text-white">{analytics.totalWords.toLocaleString()}</p>
                      <p className="text-[#5E6976] text-xs font-bold uppercase tracking-wider mt-1">Words Typed</p>
                    </div>
                    <div className="bg-[#171B21] border border-[#252B34] rounded-2xl p-6 text-center">
                      <p className="text-3xl font-black text-white">{analytics.totalAttachments.toLocaleString()}</p>
                      <p className="text-[#5E6976] text-xs font-bold uppercase tracking-wider mt-1">Files Shared</p>
                    </div>
                  </div>
                </div>
              </WrappedCard>
            )}

            {currentSlide === "topServer" && (
              <WrappedCard
                icon={<Server size={40} className="text-[#34D399]" />}
                title="Most Active Server"
                subtitle="The community where you sent the most messages."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="mt-10 text-center">
                  {topServer ? (
                    <>
                      <div className="w-32 h-32 rounded-[2rem] bg-[#171B21] border-2 border-[#252B34] flex items-center justify-center mx-auto mb-8">
                        <Server size={48} className="text-[#34D399]" />
                      </div>
                      <p className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{topServer.name}</p>
                      <div className="inline-flex items-center gap-3 bg-[#171B21] border border-[#252B34] rounded-xl px-6 py-3">
                        <span className="text-2xl font-bold text-[#34D399]">{topServer.count.toLocaleString()}</span>
                        <span className="text-[#9DA7B3] text-sm uppercase tracking-wider font-bold">Messages</span>
                      </div>
                      <p className="text-[#5E6976] mt-6 text-sm font-medium">
                        That is {((topServer.count / analytics.totalMessages) * 100).toFixed(1)}% of all your messages.
                      </p>
                    </>
                  ) : (
                    <p className="text-[#9DA7B3]">No community data found.</p>
                  )}
                </div>
              </WrappedCard>
            )}

            {currentSlide === "topFriend" && (
              <WrappedCard
                icon={<Users size={40} className="text-[#e91e8c]" />}
                title="Most Messaged Person"
                subtitle="The person you DM\u2019d the most."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="mt-10 text-center">
                  {topFriend ? (
                    <>
                      <div className="w-32 h-32 rounded-full bg-[#171B21] border-2 border-[#252B34] flex items-center justify-center mx-auto mb-8 text-white text-5xl font-black">
                        {topFriend.name[0]?.toUpperCase() ?? "?"}
                      </div>
                      <p className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{topFriend.name}</p>
                      <div className="inline-flex items-center gap-3 bg-[#171B21] border border-[#252B34] rounded-xl px-6 py-3">
                        <span className="text-2xl font-bold text-[#e91e8c]">{topFriend.messageCount.toLocaleString()}</span>
                        <span className="text-[#9DA7B3] text-sm uppercase tracking-wider font-bold">Messages</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-[#9DA7B3]">No direct message data found.</p>
                  )}
                </div>
              </WrappedCard>
            )}

            {currentSlide === "streaks" && (
              <WrappedCard
                icon={<Trophy size={40} className="text-[#F59E0B]" />}
                title="Account Milestones"
                subtitle="Your subscription status and profile badges."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="mt-10 text-center flex flex-col items-center">
                  {analytics.nitroSince ? (
                    <div className="bg-[#171B21] border border-[#252B34] rounded-2xl p-8 w-full mb-6">
                      <Star size={48} className="text-[#F59E0B] mx-auto mb-4" />
                      <p className="text-6xl font-black text-[#F59E0B] tracking-tight mb-2">
                        {analytics.nitroDays ? `${Math.floor(analytics.nitroDays / 30)}` : "Active"}
                      </p>
                      <p className="text-white font-bold text-xl mb-4">Months of Nitro</p>
                      <p className="text-[#5E6976] text-sm font-mono">Since {new Date(analytics.nitroSince).toLocaleDateString()}</p>
                    </div>
                  ) : (
                    <p className="text-[#5E6976] text-lg mb-8">No active subscription found.</p>
                  )}
                  {analytics.userBadges.length > 0 && (
                    <div className="w-full">
                      <p className="text-[#9DA7B3] text-xs font-bold uppercase tracking-wider mb-4">Profile Badges</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {analytics.userBadges.map((b) => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const Icon = (LucideIcons as Record<string, any>)[b.icon] || LucideIcons.Tag;
                          return (
                            <span key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171B21] border border-[#252B34] text-white text-sm font-medium">
                              <Icon size={20} className="text-[#F59E0B]" /> {b.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </WrappedCard>
            )}

            {currentSlide === "words" && (
              <WrappedCard
                icon={<Type size={40} className="text-[#34D399]" />}
                title="Most Used Words"
                subtitle="The words you typed the most."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="mt-10 text-center">
                  {topWord ? (
                    <>
                      <div className="inline-block relative">
                        <p className="text-7xl md:text-8xl font-black text-[#34D399] tracking-tighter mb-6 relative z-10">&quot;{topWord.word}&quot;</p>
                      </div>
                      <div className="inline-flex items-center gap-3 bg-[#171B21] border border-[#252B34] rounded-xl px-6 py-3 mb-10">
                        <span className="text-2xl font-bold text-white">{topWord.count.toLocaleString()}</span>
                        <span className="text-[#9DA7B3] text-sm uppercase tracking-wider font-bold">Uses</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                        {analytics.topWords.slice(1, 10).map((w) => (
                          <span key={w.word} className="px-3 py-1.5 rounded-lg bg-[#171B21] border border-[#252B34] text-[#9DA7B3] text-sm">
                            {w.word}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-[#9DA7B3]">No vocabulary data found.</p>
                  )}
                </div>
              </WrappedCard>
            )}

            {currentSlide === "activity" && (
              <WrappedCard
                icon={<Calendar size={40} className="text-[#5865F2]" />}
                title="Weekly Patterns"
                subtitle="When you were most active during the week."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="mt-10 text-center flex flex-col items-center">
                  <div className="bg-[#171B21] border border-[#252B34] rounded-[2rem] p-8 w-full mb-8">
                    <p className="text-6xl md:text-7xl font-black text-[#5865F2] tracking-tight mb-2">{analytics.mostActiveDay}</p>
                    <p className="text-[#9DA7B3] text-lg font-medium">was your most active day of the week.</p>
                  </div>
                  
                  <div className="w-full flex items-end justify-between h-32 gap-1 border-b border-[#252B34] pb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
                      const max = Math.max(...analytics.messagesByDayOfWeek);
                      const h = Math.max(15, (analytics.messagesByDayOfWeek[i] / max) * 100);
                      const isTop = analytics.messagesByDayOfWeek[i] === max;
                      
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center justify-end group">
                          <motion.div 
                            className={`w-full rounded-t-sm transition-colors ${isTop ? 'bg-[#5865F2]' : 'bg-[#252B34] group-hover:bg-[#5E6976]'}`}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
                          />
                          <span className={`text-[10px] mt-2 font-mono uppercase tracking-widest ${isTop ? 'text-white font-bold' : 'text-[#5E6976]'}`}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </WrappedCard>
            )}

            {currentSlide === "outro" && (
              <WrappedCard
                icon={<Star size={40} className="text-[#F59E0B]" />}
                title="That\u2019s Your Recap"
                subtitle="Thanks for reviewing your data."
                bg="from-[#12151A] via-[#12151A] to-[#0B0D10]"
              >
                <div className="mt-12 text-center">
                  <button 
                    onClick={() => setCurrentSlide("intro")}
                    className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-[#F5F7FA] transition-colors"
                  >
                    Watch Again
                  </button>
                </div>
              </WrappedCard>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 p-6 md:p-0 flex justify-center gap-4 z-50 md:z-auto bg-[#0B0D10]/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-[#252B34] md:border-t-0">
        <button
          onClick={() => go(-1)}
          disabled={!canPrev}
          className={`flex items-center justify-center w-14 h-14 rounded-2xl border transition-all ${
            canPrev ? "bg-[#171B21] border-[#252B34] hover:bg-[#252B34] text-white" : "bg-[#12151A] border-[#171B21] text-[#5E6976] opacity-50 cursor-not-allowed"
          }`}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={() => go(1)}
          disabled={!canNext}
          className={`flex items-center justify-center w-14 h-14 rounded-2xl border transition-all ${
            canNext ? "bg-[#5865F2] border-[#5865F2] hover:bg-[#7C8CFF] text-white" : "bg-[#12151A] border-[#171B21] text-[#5E6976] opacity-50 cursor-not-allowed"
          }`}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}

function WrappedCard({
  icon,
  title,
  subtitle,
  children,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  bg: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-[#252B34] bg-gradient-to-br ${bg} p-8 md:p-12`}>
      <div className="relative z-10">
        <div className="mb-8">
          {icon}
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-[#9DA7B3] font-medium leading-relaxed">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#171B21]/80 backdrop-blur-sm rounded-2xl p-5 border border-[#252B34] text-center shadow-lg">
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-[#9DA7B3] text-[10px] font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
}
