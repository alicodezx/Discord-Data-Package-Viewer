"use client";

import WrappedStoryPlayer from "./WrappedStoryPlayer";
import { Star } from "lucide-react";

interface SharedWrappedViewProps {
  payload: {
    user: {
      username: string;
      global_name?: string;
    };
    stats: any;
  };
  onClear: () => void;
}

export default function SharedWrappedView({ payload, onClear }: SharedWrappedViewProps) {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] flex flex-col items-center justify-center p-6 md:p-10 select-none">
      
      {/* Top watermark branding */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/25 text-xs text-[#7C8CFF] font-bold mb-3">
          <Star size={12} className="fill-[#7C8CFF]" />
          <span>Shared Recap Card</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Discord Insights Wrapped
        </h1>
        <p className="text-[#9DA7B3] text-xs mt-1">
          Explore the annual chat patterns of @{payload.user.username}
        </p>
      </div>

      {/* Main player component */}
      <WrappedStoryPlayer
        user={payload.user}
        analytics={payload.stats}
        isShared={true}
        onClearShared={onClear}
      />
      
    </div>
  );
}
