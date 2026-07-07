"use client";

import { useDataStore } from "@/store/dataStore";
import WrappedStoryPlayer from "../WrappedStoryPlayer";

export default function WrappedSection() {
  const { analytics, user } = useDataStore();

  if (!analytics || !user) return null;

  return (
    <div className="p-6 md:p-10 max-w-[1400px] flex flex-col min-h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          Insights Wrapped
        </h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative w-full">
        <WrappedStoryPlayer user={user} analytics={analytics as any} />
      </div>
    </div>
  );
}
