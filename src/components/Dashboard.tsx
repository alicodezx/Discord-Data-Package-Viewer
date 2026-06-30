"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, MessageSquare, Users, Server, Star, Clock, Hash, Home, RefreshCw, Menu, X, CreditCard, Shield, Info, Brain, Trophy, Compass
} from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import OverviewSection from "./sections/OverviewSection";
import MessagesSection from "./sections/MessagesSection";
import ServersSection from "./sections/ServersSection";
import FriendsSection from "./sections/FriendsSection";
import TimelineSection from "./sections/TimelineSection";
import BehaviorSection from "./sections/BehaviorSection";
import WrappedSection from "./sections/WrappedSection";
import AccountSection from "./sections/AccountSection";
import BillingSection from "./sections/BillingSection";
import QuestsSection from "./sections/QuestsSection";
import InformationSection from "./sections/InformationSection";
import ArcheologistSection from "./sections/ArcheologistSection";

const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "servers", label: "Servers", icon: Server },
  { id: "friends", label: "Friends & DMs", icon: Users },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "archeologist", label: "Time Capsule", icon: Compass },
  { id: "behavior", label: "Deep Patterns", icon: Brain },
  { id: "wrapped", label: "Insights Wrapped", icon: Star },
  { id: "account", label: "Account Info", icon: Hash },
  { id: "billing", label: "Billing & Spent", icon: CreditCard },
  { id: "quests", label: "Quests", icon: Trophy },
  { id: "information", label: "System Info", icon: Info },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, analytics, reset } = useDataStore();

  if (!analytics) return null;

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection />;
      case "messages": return <MessagesSection />;
      case "servers": return <ServersSection />;
      case "friends": return <FriendsSection />;
      case "timeline": return <TimelineSection />;
      case "archeologist": return <ArcheologistSection />;
      case "behavior": return <BehaviorSection />;
      case "wrapped": return <WrappedSection />;
      case "account": return <AccountSection />;
      case "billing": return <BillingSection />;
      case "quests": return <QuestsSection />;
      case "information": return <InformationSection />;
      default: return <OverviewSection />;
    }
  };

  const displayName = user?.global_name || user?.username || "User";
  const avatarUrl = user?.avatar_hash
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar_hash}.webp?size=64`
    : null;

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">
      {/* Sidebar navigation */}
      <AnimatePresence>
        <aside className={`sidebar flex flex-col justify-between ${mobileMenuOpen ? "open" : ""}`}>
          <div>
            <div className="px-6 py-5 border-b border-[#252B34] flex items-center gap-3">
              <div>
                <h2 className="text-white font-extrabold text-xs tracking-wide">DISCORD DATA PACKAGE VIEWER</h2>
                <p className="text-[#5E6976] text-[10px] uppercase font-bold mt-0.5 tracking-wider">Dashboard</p>
              </div>
            </div>

            {/* Profile section */}
            <div className="px-6 py-4 border-b border-[#252B34] bg-[#171B21]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#171B21] border border-[#252B34] overflow-hidden flex-shrink-0 flex items-center justify-center text-[#5865F2] font-semibold text-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    displayName[0]?.toUpperCase()
                  )}
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-white text-xs font-semibold truncate leading-tight">{displayName}</p>
                  <p className="text-[#9DA7B3] text-[10px] truncate leading-none mt-0.5">@{user?.username || "unknown"}</p>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`nav-btn ${activeSection === item.id ? "active" : ""}`}
                >
                  <item.icon size={15} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar footer / settings */}
          <div className="p-4 border-t border-[#252B34]">
            <div className="flex items-center justify-between text-[11px] text-[#5E6976] bg-[#0B0D10] px-3 py-2 rounded-lg border border-[#252B34] mb-2">
              <span className="flex items-center gap-1.5">
                <Shield size={11} className="text-[#34D399]" /> Client execution
              </span>
            </div>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#171B21] border border-[#252B34] text-[#9DA7B3] hover:text-[#EF4444] text-[11px] font-semibold transition-all"
            >
              <RefreshCw size={12} />
              <span>Reset Data</span>
            </button>
          </div>
        </aside>
      </AnimatePresence>

      {/* Mobile responsive header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#12151A] border-b border-[#252B34] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xs tracking-tight">Discord Data Package Viewer</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white bg-[#171B21] border border-[#252B34] p-1.5 rounded-lg"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Main dashboard content area */}
      <main className="main-with-sidebar min-h-screen">
        <div className="pt-14 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
