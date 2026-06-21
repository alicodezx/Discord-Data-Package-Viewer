"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Database, CreditCard, Users, MessageSquare } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

export default function InformationSection() {
  const sections = [
    {
      icon: Database,
      color: "#5865F2",
      title: "Data Source & Privacy",
      content: "All insights are generated directly from the JSON/CSV files provided in your official Discord Data Export. This application runs entirely in your browser locally. None of your data is ever uploaded to a remote server, ensuring complete and absolute privacy."
    },
    {
      icon: CreditCard,
      color: "#F59E0B",
      title: "Billing & Nitro Estimates",
      content: "Financial metrics are aggregated from your export's ledger in 'payments.json'. Discrepancies between this dashboard and your bank accounts can happen because gifted subscriptions, promotional trials, regional localized pricing, and payment gateway issues (Apple Pay/Google Play) might be logged differently. Nitro duration is computed by scanning the earliest Nitro-related payment entry and calculating the elapsed days up to your subscription's expiration date."
    },
    {
      icon: Users,
      color: "#34D399",
      title: "Voice Channel Estimation",
      content: "Voice call logs (e.g., call durations and connections) are NOT included in the standard Discord Data Export. To provide a voice summary, we estimate metrics using a session-based heuristic: total call duration is calculated at 1 hour of call presence for every 250 text messages sent, bounded by your overall active days. Peak voice times are mapped to your peak text activity hours under the assumption that call times align with messaging."
    },
    {
      icon: MessageSquare,
      color: "#9b59b6",
      title: "DM Limits & Sent Messages Only",
      content: "A major limitation of the Discord Data Export is that message folders contain ONLY your own sent messages. Messages sent to you by friends or server members are not included in the CSVs. Because of this, comparative metrics—like calculating response speed, reply matchups, or who replied first—cannot be determined from your raw files. (These stats are fully simulated in demo mode to showcase conversational possibilities)."
    },
    {
      icon: AlertTriangle,
      color: "#EF4444",
      title: "Discrepancy Disclaimer",
      content: "Discord Insights is an unofficial data wrapper. The metrics, graphs, and figures shown are approximations based entirely on the provided raw JSON/CSV data. We make various assumptions (e.g., mapping internal status flags to 'Success' or 'Pending') to reconstruct the UI. Consequently, figures can have discrepancies compared to the live Discord app."
    }
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader label="SYSTEM INFORMATION" title="How It Works & Assumptions" />
      
      {/* Content columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {sections.map((sec, i) => {
          if (sec.title === 'Discrepancy Disclaimer') return null;
          return (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="border-l border-[#252B34] pl-5 py-1.5 flex flex-col break-inside-avoid"
            >
              <div className="flex items-center gap-3 mb-3">
                <sec.icon size={16} style={{ color: sec.color }} className="opacity-80" />
                <h3 className="text-sm font-bold text-white tracking-tight">{sec.title}</h3>
              </div>
              <p className="text-[#9DA7B3] text-xs leading-relaxed">
                {sec.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Discrepancy Disclaimer block */}
      {sections.map((sec, i) => {
        if (sec.title !== 'Discrepancy Disclaimer') return null;
        return (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="border-l border-[#EF4444]/60 pl-5 py-1.5 flex flex-col mt-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <sec.icon size={16} style={{ color: sec.color }} className="opacity-85" />
              <h3 className="text-sm font-bold text-white tracking-tight">{sec.title}</h3>
            </div>
            <p className="text-[#9DA7B3] text-xs leading-relaxed font-sans">
              {sec.content}
            </p>
          </motion.div>
        );
      })}
      
      {/* Bottom privacy feature banner */}
      <motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
         className="mt-8 p-5 rounded-xl border border-[#252B34] bg-[#12151A]/40 text-center flex flex-col items-center justify-center gap-2"
      >
        <ShieldCheck size={20} className="text-[#34D399]" />
        <div>
          <h4 className="text-white text-sm font-bold">100% Client-Side Processing</h4>
          <p className="text-[#5E6976] text-xs mt-0.5">Your data never leaves your device. Designed with privacy as the highest priority.</p>
        </div>
      </motion.div>
    </div>
  );
}
