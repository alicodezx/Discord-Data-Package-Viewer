"use client";

import { useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FolderOpen, Zap, BarChart3, Users, MessageSquare, Shield, Star, AlertTriangle } from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import { parseDiscordPackage, type FileEntry } from "@/lib/parsers/packageParser";
import { getDemoUser, getDemoAnalytics } from "@/lib/demoData";

const features = [
  {
    icon: MessageSquare,
    title: "Message Breakdown",
    desc: "See your total messages, top channels, busiest hours, and word frequency across your entire history.",
  },
  {
    icon: BarChart3,
    title: "Activity Over Time",
    desc: "Monthly and yearly charts showing when you were most active and how your usage changed.",
  },
  {
    icon: Users,
    title: "Top Conversations",
    desc: "Find out who you messaged the most, which servers you contributed to, and your closest DMs.",
  },
  {
    icon: Star,
    title: "Personal Recap",
    desc: "A slide-by-slide summary of your Discord stats — messages, friends, servers, and vocabulary.",
  },
];

export default function LandingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipFileInputRef = useRef<HTMLInputElement>(null);
  const { setUser, setAnalytics, setProgress, setLoading, setError, setIsParsed, isLoading, progress, error } = useDataStore();

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (!files.length) return;

      setLoading(true);
      setError(null);

      const entries: FileEntry[] = files.map((f) => ({
        path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
        file: f,
      }));

      try {
        const result = await parseDiscordPackage(entries, (p) => {
          setProgress(p);
          setLoadingMsg(p.stage);
        });
        setUser(result.user);
        setAnalytics(result.analytics);
        setIsParsed(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to parse package");
      } finally {
        setLoading(false);
      }
    },
    [setAnalytics, setError, setIsParsed, setLoading, setProgress, setUser]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (!e.dataTransfer.items) {
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        return;
      }

      setLoading(true);
      setError(null);

      const files: File[] = [];
      const queue: FileSystemEntry[] = [];

      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry) queue.push(entry);
        }
      }

      const readEntriesPromise = async (dirReader: FileSystemDirectoryReader) => {
        return new Promise<FileSystemEntry[]>((resolve, reject) => {
          dirReader.readEntries(resolve, reject);
        });
      };

      const getFilePromise = async (fileEntry: FileSystemFileEntry) => {
        return new Promise<File>((resolve, reject) => {
          fileEntry.file(resolve, reject);
        });
      };

      try {
        while (queue.length > 0) {
          const entry = queue.shift();
          if (!entry) continue;

          if (entry.isFile) {
            const file = await getFilePromise(entry as FileSystemFileEntry);
            Object.defineProperty(file, "webkitRelativePath", {
              value: entry.fullPath.replace(/^\//, ""),
            });
            files.push(file);
          } else if (entry.isDirectory) {
            const dirReader = (entry as FileSystemDirectoryEntry).createReader();
            let entries = await readEntriesPromise(dirReader);
            while (entries.length > 0) {
              queue.push(...entries);
              entries = await readEntriesPromise(dirReader);
            }
          }
        }

        if (files.length) {
          handleFiles(files);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to read dropped folder. Please use the 'Select ZIP File' button instead.");
        setLoading(false);
      }
    },
    [handleFiles, setLoading, setError]
  );

  const handleFolderInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const handleZipInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    },
    [handleFiles]
  );

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA] font-sans selection:bg-[#5865F2]/30 selection:text-white">

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[#252B34] bg-[#0B0D10]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white text-base tracking-tight">Discord Data Package Viewer</span>
        </div>
      </nav>

      {/* Hero / Upload zone */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-3xl mx-auto">
            See who you talked to,<br />
            when, and how much.
          </h1>

          <p className="text-base md:text-lg text-[#9DA7B3] max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your Discord data export and get a full breakdown of your messages, servers, friends, and activity patterns — processed entirely in your browser.
          </p>

          {/* Interactive Upload Box */}
          {!isLoading ? (
            <motion.div
              className={`premium-drop-zone max-w-xl mx-auto p-10 cursor-pointer relative ${isDragging ? "dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => zipFileInputRef.current?.click()}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                {...{ webkitdirectory: "" }}
                multiple
                onChange={handleFolderInput}
              />
              <input
                ref={zipFileInputRef}
                type="file"
                className="hidden"
                accept=".zip"
                onChange={handleZipInput}
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#171B21] border border-[#252B34] flex items-center justify-center transition-all duration-300 group-hover:border-[#5865F2]">
                  <Upload size={24} className="text-[#9DA7B3]" />
                </div>
                <div>
                  <h3 className="text-white text-base font-semibold mb-1">
                    Upload your Discord data package
                  </h3>
                  <p className="text-[#9DA7B3] text-xs">
                    Drag and drop your <code className="text-[#7C8CFF] bg-[#171B21] px-1.5 py-0.5 rounded font-mono">package.zip</code> or folder here
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 mt-2 w-full">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        zipFileInputRef.current?.click();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold transition-all border border-[#5865F2]"
                    >
                      Select ZIP File
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12151A] hover:bg-[#171B21] text-white text-xs font-semibold border border-[#252B34] transition-all"
                    >
                      <FolderOpen size={13} className="text-[#9DA7B3]" />
                      Select Folder
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUser(getDemoUser());
                      setAnalytics(getDemoAnalytics());
                      setIsParsed(true);
                    }}
                    className="mt-1 text-xs text-[#9DA7B3] hover:text-white transition-colors underline underline-offset-4 decoration-[#252B34] hover:decoration-white font-medium"
                  >
                    No export handy? Explore with demo data
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <LoadingView loadingMsg={loadingMsg} progress={progress} />
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto mt-6 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium flex items-center gap-3 justify-center"
            >
              <AlertTriangle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <p className="text-[#5E6976] text-xs mt-6 flex items-center justify-center gap-4">
            <span>100% private</span>
            <span>·</span>
            <span>No data uploaded</span>
            <span>·</span>
            <span>Runs in your browser</span>
          </p>
        </motion.div>
      </main>

      {/* Grid of Key Benefits / Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-5 rounded-xl border border-[#252B34] bg-[#12151A] hover:border-[#5E6976] transition-colors"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#171B21] border border-[#252B34] flex items-center justify-center mb-4">
                <f.icon size={15} className="text-[#9DA7B3]" />
              </div>
              <h3 className="text-white text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-[#9DA7B3] text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Structured Instructions section */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <div className="premium-card p-6 bg-[#12151A]/80">
          <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
            <FolderOpen size={16} className="text-[#5865F2]" />
            <span>How to download your package</span>
          </h3>
          <div className="space-y-4">
            {[
              "In Discord, navigate to User Settings → Privacy & Safety.",
              "Scroll down and click 'Request all of my Data' under the data category.",
              "Discord will send you a downloadable ZIP link to your registered email (typically takes 1-30 days).",
              "Save the ZIP file, then drop or select it in the upload area above."
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-5 h-5 rounded-full bg-[#171B21] border border-[#252B34] flex-shrink-0 flex items-center justify-center text-[#9DA7B3] text-xs font-semibold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[#9DA7B3] text-xs pt-1 leading-normal">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal clean footer */}
      <footer className="relative z-10 border-t border-[#252B34] py-8 text-center text-[#5E6976] text-xs">
        <p>© {new Date().getFullYear()} Discord Data Package Viewer. Not affiliated with Discord Inc.</p>
      </footer>
    </div>
  );
}

function LoadingView({ loadingMsg, progress }: { loadingMsg: string; progress: ReturnType<typeof useDataStore.getState>["progress"] }) {
  return (
    <div className="max-w-xl mx-auto p-10 premium-card bg-[#12151A] text-center border-[#252B34]">
      <div className="flex flex-col items-center gap-5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2] pulse-glow" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2] pulse-glow [animation-delay:0.2s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#5865F2] pulse-glow [animation-delay:0.4s]" />
        </div>
        <div>
          <h3 className="text-white text-base font-semibold mb-1">Analyzing Data</h3>
          <p className="text-[#9DA7B3] text-xs">{loadingMsg}</p>
        </div>
        {progress && (
          <div className="w-full mt-2">
            <div className="h-1.5 bg-[#171B21] rounded-full overflow-hidden border border-[#252B34]">
              <div
                className="h-full bg-gradient-to-r from-[#7C8CFF] to-[#5865F2] rounded-full transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="text-[#5E6976] text-[10px] mt-1.5 text-right font-mono">{progress.percent}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
