"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataStore } from "@/store/dataStore";
import {
  Users, MessageSquare, UserCheck, UserX, Clock, Heart, ChevronLeft, ChevronRight,
  ArrowLeft, Send, Phone, Video, Pin, UserPlus, Inbox, HelpCircle, Smile, Gift, PlusCircle
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  reactions: Reaction[];
}

const MOCK_DIALOGS: Record<string, Array<{ sender: string; content: string }>> = {
  octocat: [
    { sender: "friend", content: "Hey! Did you check out the new repository I set up?" },
    { sender: "you", content: "Oh, not yet! What is it?" },
    { sender: "friend", content: "It's the Discord Data Package Viewer! Built with Next.js and Tailwind. It runs entirely on the client, which is awesome for privacy." },
    { sender: "you", content: "That's neat! Let's push some code." },
    { sender: "friend", content: "Beep boop! Pushing directly to main branch! 🚀 Let's go!" }
  ],
  lorem_ipsum: [
    { sender: "friend", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { sender: "you", content: "Uh, what does that mean?" },
    { sender: "friend", content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { sender: "you", content: "Are you speaking Latin?" },
    { sender: "friend", content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }
  ],
  clippy: [
    { sender: "friend", content: "Hi! It looks like you're trying to explore your Discord behavioral data. Would you like help with that?" },
    { sender: "you", content: "No thanks Clippy, I'm good." },
    { sender: "friend", content: "Are you sure? I can show you how to read your billing logs, server counts, or message timeline! 📎" },
    { sender: "you", content: "Please stop." },
    { sender: "friend", content: "Excellent! I will stay right here to assist you anyway!" }
  ],
  midjourney: [
    { sender: "friend", content: "**[Generating grid of 4 concepts...]**\nPrompt: `futuristic cyberpunk discord data dashboard design, neon lighting, dark mode, high-fidelity --v 6.0`" },
    { sender: "you", content: "Upscale image #4 please." },
    { sender: "friend", content: "**[Upscaling Image #4 (1024x1024)]**\n🎨 Here is your high-fidelity UI rendering. It looks absolutely stunning!" }
  ],
  clyde: [
    { sender: "friend", content: "Hello! I am Clyde, your friendly Discord AI assistant. Ask me anything about your server or messages." },
    { sender: "you", content: "Who sent the most messages in my DMs?" },
    { sender: "friend", content: "According to your Discord Data Export, your best friend is the one with the highest count! You can check the DMs dashboard for full stats." }
  ]
};

const GENERIC_FRIEND_RESPONSES = [
  "No way! That's wild.",
  "Haha true, let's play some games tonight?",
  "Wait, did you see the new update?",
  "Ah cool, I was just reading about that.",
  "Yeah, I agree with you.",
  "Wait, what time are we hanging out?",
  "That sounds like a plan! 👍",
  "Hmm, let me check and get back to you.",
  "Can you send that link again?",
  "Oh wow, nice!"
];

export default function FriendsSection() {
  const { analytics, user } = useDataStore();
  const [friendPage, setFriendPage] = useState(0);
  const FRIENDS_PER_PAGE = 10;

  // Active chat state
  const [activeChat, setActiveChat] = useState<{ friendName: string; friendId: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (!analytics) return null;

  const friends = user?.relationships?.filter((r) => r.type === "FRIEND") ?? [];
  const pending = user?.relationships?.filter((r) => r.type === "PENDING_INCOMING") ?? [];
  const blocked = user?.relationships?.filter((r) => r.type === "BLOCKED") ?? [];

  const topFriends = analytics.topFriends.slice(0, 20);
  const maxMsgs = topFriends[0]?.messageCount ?? 1;

  const bff = topFriends.length > 0 ? topFriends[0] : null;
  const bffName = bff ? bff.name.replace("Direct Message with ", "").replace(/#\d+$/, "") : "";

  const totalFriendPages = Math.ceil(friends.length / FRIENDS_PER_PAGE);
  const paginatedFriends = friends.slice(friendPage * FRIENDS_PER_PAGE, (friendPage + 1) * FRIENDS_PER_PAGE);

  const handleOpenChat = (friendName: string, friendId: string) => {
    setActiveChat({ friendName, friendId });

    // Look for matching DM channel in the export
    const channel = analytics.channels.find(
      (c) =>
        c.info.type === "DM" &&
        c.info.recipients?.some(
          (r) =>
            r.username.toLowerCase().includes(friendName.toLowerCase()) ||
            r.id === friendId
        )
    );

    if (channel && channel.messages.length > 0) {
      // Load real messages
      const sortedMsgs = [...channel.messages].sort(
        (a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
      );

      const displayMsgs: ChatMessage[] = [];
      sortedMsgs.slice(-25).forEach((msg, idx) => {
        displayMsgs.push({
          id: `msg-user-${idx}`,
          sender: "you",
          senderName: user?.global_name || user?.username || "You",
          content: msg.Contents,
          timestamp: new Date(msg.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: true,
          reactions: []
        });

        // Interlace generic friend messages to represent dialog
        if (idx % 3 === 0 && idx < sortedMsgs.length - 1) {
          displayMsgs.push({
            id: `msg-friend-${idx}`,
            sender: "friend",
            senderName: friendName,
            content: GENERIC_FRIEND_RESPONSES[(idx * 7) % GENERIC_FRIEND_RESPONSES.length],
            timestamp: new Date(msg.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: false,
            reactions: []
          });
        }
      });
      setChatMessages(displayMsgs);
    } else {
      // Mock dialogue for demo mode
      const preset = MOCK_DIALOGS[friendId] || MOCK_DIALOGS[friendName.toLowerCase()] || [
        { sender: "friend", content: `Hey! Thanks for viewing our DM stats. 🎮` },
        { sender: "you", content: `Yeah, it shows we've sent quite a few messages!` },
        { sender: "friend", content: `That's awesome! Let's chat more to get our streak even higher.` }
      ];

      const displayMsgs = preset.map((m, idx) => ({
        id: `preset-${idx}`,
        sender: m.sender,
        senderName: m.sender === "you" ? (user?.global_name || user?.username || "You") : friendName,
        content: m.content,
        timestamp: new Date(Date.now() - (preset.length - idx) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: m.sender === "you",
        reactions: []
      }));
      setChatMessages(displayMsgs);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    const userMsg: ChatMessage = {
      id: `user-sent-${Date.now()}`,
      sender: "you",
      senderName: user?.global_name || user?.username || "You",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      reactions: []
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Simulate response delay
    setTimeout(() => {
      const friendReplies = [
        "That's interesting! Tell me more.",
        "Oh wow, I didn't know that!",
        "Haha standard! 🎯",
        "Wait, are we still playing today?",
        "Sounds good to me!",
        "Let me know when you're online.",
        "Awesome! 🚀",
        "Brb, grabbing a snack!",
        "Wait, what? 😂"
      ];

      const specificReplies: Record<string, string[]> = {
        octocat: [
          "Beep boop! Pushed a hotfix. 🔧",
          "Let's review the code! 💻",
          "Git commit -m 'respond to user request'",
          "Ah! Let's submit a pull request."
        ],
        clippy: [
          "It looks like you're sending messages! Would you like help formatting them? 📎",
          "I can help you add emojis to that sentence!",
          "Would you like me to proofread your text?",
          "Did you know that 85% of statistics are made up on the spot?"
        ],
        midjourney: [
          "**[Rendering concept v6.0...]** 🎨 99% complete.",
          "Prompt: `high resolution digital render of a coder laughing with an assistant`",
          "Would you like to upscale variation U1, U2, U3, or U4?",
          "Here is a masterfully upscaled detail asset."
        ]
      };

      const pool = specificReplies[activeChat.friendId] || specificReplies[activeChat.friendName.toLowerCase()] || friendReplies;
      const randomReply = pool[Math.floor(Math.random() * pool.length)];

      const friendMsg: ChatMessage = {
        id: `friend-reply-${Date.now()}`,
        sender: "friend",
        senderName: activeChat.friendName,
        content: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        reactions: []
      };

      setChatMessages((prev) => [...prev, friendMsg]);
    }, 1000 + Math.random() * 500);
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;

        const existing = msg.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          if (existing.users.includes("you")) {
            // Remove
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== "you") }
                    : r
                )
                .filter((r) => r.count > 0)
            };
          } else {
            // Increment
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, users: [...r.users, "you"] }
                  : r
              )
            };
          }
        } else {
          // Add new
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, users: ["you"] }]
          };
        }
      })
    );
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    handleAddReaction(msgId, emoji);
  };

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-[1400px]">
      {/* Header */}
      <SectionHeader label="RELATIONSHIPS" title="Friends & DMs" />

      <AnimatePresence mode="wait">
        {!activeChat ? (
          <motion.div
            key="friends-list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {/* BFF / Top friend insight card */}
            {bff && bff.messageCount > 0 && (
              <motion.div
                className="premium-card overflow-hidden cursor-pointer group hover:border-[#5865F2] transition-colors"
                onClick={() => handleOpenChat(bffName, bff.id)}
                whileHover={{ y: -2 }}
              >
                <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-[#12151A] border-4 border-[#171B21] flex items-center justify-center flex-shrink-0 relative">
                      <span className="text-4xl font-bold text-[#5865F2]">
                        {bffName[0]?.toUpperCase() || "?"}
                      </span>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#171B21] border border-[#252B34] flex items-center justify-center">
                        <Heart size={14} className="text-[#e91e8c] fill-[#e91e8c]" />
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-[#9DA7B3] text-sm font-bold tracking-wider uppercase mb-2">Your Best Friend</h2>
                      <p className="text-2xl md:text-3xl font-medium text-white leading-tight">
                        You and <span className="font-extrabold text-white">{bffName}</span> exchanged <span className="font-extrabold text-white text-[#7C8CFF] group-hover:underline">{bff.messageCount.toLocaleString()}</span> messages.
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                    <MessageSquare size={14} />
                    Open Chat
                  </button>
                </div>
              </motion.div>
            )}

            {/* Primary KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: UserCheck, label: "Friends", value: friends.length, color: "#34D399" },
                { icon: MessageSquare, label: "DM Threads", value: analytics.dmChannels.length, color: "#5865F2" },
                { icon: Clock, label: "Pending", value: pending.length, color: "#F59E0B" },
                { icon: UserX, label: "Blocked", value: blocked.length, color: "#EF4444" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="border-l border-[#252B34] pl-4 py-1 flex flex-col justify-between h-[76px]"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[#5E6976] text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
                    <s.icon size={12} style={{ color: s.color }} className="opacity-70" />
                  </div>
                  <div className="text-2xl font-extrabold text-white tracking-tight">{s.value.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top friends by messages */}
              {topFriends.length > 0 && (
                <div className="lg:col-span-2 premium-card overflow-hidden">
                  <div className="p-6 border-b border-[#252B34]">
                    <h2 className="text-white text-base font-bold flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#5865F2]" />
                      Most Messaged People
                    </h2>
                    <p className="text-[#9DA7B3] text-xs mt-1">Click a row to simulate chat logs.</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {topFriends.map((f, i) => {
                      const pct = (f.messageCount / maxMsgs) * 100;
                      const name = f.name.replace("Direct Message with ", "").replace(/#\d+$/, "");
                      return (
                        <div
                          key={f.id}
                          onClick={() => handleOpenChat(name, f.id)}
                          className="flex items-center gap-4 p-2 rounded-xl cursor-pointer hover:bg-[#12151A]/60 group transition-all"
                        >
                          <span className="text-[#5E6976] text-xs font-mono w-4 text-right flex-shrink-0">{i + 1}</span>
                          <div className="w-10 h-10 rounded-full bg-[#12151A] border border-[#252B34] flex items-center justify-center flex-shrink-0 text-[#7C8CFF] font-bold text-xs group-hover:border-[#5865F2] transition-colors">
                            {name[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-white text-sm font-semibold truncate group-hover:text-[#7C8CFF] transition-colors">{name}</span>
                              <span className="text-[#9DA7B3] text-xs font-mono flex items-center gap-2">
                                <span className="group-hover:opacity-100 opacity-0 transition-opacity text-[10px] text-[#5865F2] font-semibold uppercase tracking-wider">Chat</span>
                                {f.messageCount.toLocaleString()} <span className="text-[#5E6976]">msgs</span>
                              </span>
                            </div>
                            <div className="h-1.5 bg-[#12151A] rounded-full overflow-hidden border border-[#252B34]/50">
                              <div
                                className="h-full rounded-full bg-[#5865F2] transition-all duration-800"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Friend list — paginated */}
              {friends.length > 0 && (
                <div className="premium-card flex flex-col overflow-hidden self-start">
                  <div className="p-5 border-b border-[#252B34] flex items-center justify-between">
                    <h2 className="text-white text-base font-bold flex items-center gap-2">
                      <Users size={16} className="text-[#34D399]" />
                      Friend List
                      <span className="text-[#5E6976] text-xs font-mono font-normal ml-1">({friends.length})</span>
                    </h2>
                    <span className="text-[#5E6976] text-[11px] font-mono">
                      {friendPage + 1}/{totalFriendPages}
                    </span>
                  </div>

                  <div className="flex-1">
                    {paginatedFriends.map((rel, i) => {
                      const name = rel.user.global_name || rel.user.username;
                      return (
                        <div
                          key={rel.id}
                          onClick={() => handleOpenChat(name, rel.user.id)}
                          className={`flex items-center justify-between px-5 py-2.5 hover:bg-[#12151A]/60 transition-colors cursor-pointer group ${i !== paginatedFriends.length - 1 ? 'border-b border-[#252B34]/40' : ''}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-[#171B21] border border-[#252B34] flex items-center justify-center flex-shrink-0 text-[#7C8CFF] text-[11px] font-bold group-hover:border-[#5865F2] transition-colors">
                              {name[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-[13px] font-semibold truncate leading-tight group-hover:text-[#7C8CFF] transition-colors">{name}</p>
                              <p className="text-[#5E6976] text-[10px] font-mono truncate">@{rel.user.username}</p>
                            </div>
                          </div>
                          <MessageSquare size={13} className="text-[#5E6976] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination controls */}
                  {totalFriendPages > 1 && (
                    <div className="p-3 border-t border-[#252B34] flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setFriendPage((p) => Math.max(0, p - 1))}
                        disabled={friendPage === 0}
                        className="w-7 h-7 rounded-lg bg-[#12151A] border border-[#252B34] flex items-center justify-center text-[#9DA7B3] hover:text-white hover:border-[#5865F2] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {(() => {
                        const pages: (number | '...')[] = [];
                        if (totalFriendPages <= 5) {
                          for (let i = 0; i < totalFriendPages; i++) pages.push(i);
                        } else {
                          pages.push(0);
                          if (friendPage > 2) pages.push('...');
                          for (let i = Math.max(1, friendPage - 1); i <= Math.min(totalFriendPages - 2, friendPage + 1); i++) {
                            pages.push(i);
                          }
                          if (friendPage < totalFriendPages - 3) pages.push('...');
                          pages.push(totalFriendPages - 1);
                        }
                        return pages.map((p, i) =>
                          p === '...' ? (
                            <span key={`dots-${i}`} className="w-7 h-7 flex items-center justify-center text-[#5E6976] text-[11px] font-mono">…</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setFriendPage(p)}
                              className={`w-7 h-7 rounded-lg border text-[11px] font-bold font-mono flex items-center justify-center transition-all ${
                                p === friendPage
                                  ? 'bg-[#5865F2] border-[#5865F2] text-white'
                                  : 'bg-[#12151A] border-[#252B34] text-[#5E6976] hover:text-white hover:border-[#5865F2]'
                              }`}
                            >
                              {p + 1}
                            </button>
                          )
                        );
                      })()}
                      <button
                        onClick={() => setFriendPage((p) => Math.min(totalFriendPages - 1, p + 1))}
                        disabled={friendPage === totalFriendPages - 1}
                        className="w-7 h-7 rounded-lg bg-[#12151A] border border-[#252B34] flex items-center justify-center text-[#9DA7B3] hover:text-white hover:border-[#5865F2] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Active Chat Simulator Panel */
          <motion.div
            key="chat-simulator-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col bg-[#12151A] border border-[#252B34] rounded-2xl overflow-hidden h-[600px] shadow-2xl relative font-sans"
          >
            {/* Chat Header */}
            <div className="px-4 py-3 bg-[#1e2229] border-b border-[#252B34] flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-1 rounded hover:bg-[#35373c] text-[#9DA7B3] hover:text-white transition-colors"
                  title="Back to Friends"
                >
                  <ArrowLeft size={16} />
                </button>
                
                {/* Friend details */}
                <div className="w-8 h-8 rounded-full bg-[#12151A] border border-[#252B34] flex items-center justify-center text-[#7C8CFF] font-bold text-xs relative flex-shrink-0">
                  {activeChat.friendName[0]?.toUpperCase() ?? "?"}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#1e2229]" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-bold font-sans leading-none">{activeChat.friendName}</h3>
                  <span className="text-[#9DA7B3] text-[9px] font-sans">Active in Direct Messages</span>
                </div>
              </div>

              {/* Chat action icons */}
              <div className="flex items-center gap-3 text-[#9DA7B3]">
                <Phone size={14} className="cursor-pointer hover:text-white transition-colors" />
                <Video size={14} className="cursor-pointer hover:text-white transition-colors" />
                <Pin size={14} className="cursor-pointer hover:text-white transition-colors" />
                <UserPlus size={14} className="cursor-pointer hover:text-white transition-colors" />
                <div className="w-px h-4 bg-[#252B34]" />
                <Inbox size={14} className="cursor-pointer hover:text-white transition-colors" />
                <HelpCircle size={14} className="cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Chat History Messages Scroll area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e2229]/40 select-text">
              {chatMessages.length > 0 ? (
                chatMessages.map((msg, idx) => {
                  // Determine message grouping: consecutive sender within short timeframe does not show details
                  const consecutive = idx > 0 && chatMessages[idx - 1].sender === msg.sender;

                  return (
                    <div key={msg.id} className="group relative flex items-start gap-4 hover:bg-[#12151A]/30 px-4 py-1.5 -mx-4 rounded transition-all">
                      
                      {/* Message hover reaction bar */}
                      <div className="absolute right-4 -top-3.5 hidden group-hover:flex items-center gap-0.5 bg-[#313338] border border-[#252B34] rounded-lg shadow-md px-1 py-0.5 z-20">
                        {["👍", "❤️", "😂", "🎉", "😮", "😢"].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className="p-1 hover:bg-[#35373c] rounded text-xs transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      {/* Sender Avatar */}
                      {!consecutive ? (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold border ${
                          msg.isUser
                            ? "bg-[#5865F2]/10 border-[#5865F2]/40 text-[#7C8CFF]"
                            : "bg-[#171B21] border-[#252B34] text-[#9DA7B3]"
                        }`}>
                          {msg.senderName[0]?.toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-9 text-right text-[8px] text-[#5e6976] opacity-0 group-hover:opacity-100 font-mono select-none flex-shrink-0 pt-1">
                          {msg.timestamp.split(" ")[0]}
                        </div>
                      )}

                      {/* Content block */}
                      <div className="flex-1 min-w-0">
                        {!consecutive && (
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className={`text-[13px] font-bold leading-tight font-sans ${
                              msg.isUser ? "text-white" : "text-[#7C8CFF]"
                            }`}>
                              {msg.senderName}
                            </span>
                            <span className="text-[#5E6976] text-[9px] font-mono">{msg.timestamp}</span>
                          </div>
                        )}
                        <p className="text-[13px] text-[#dbdee1] font-sans font-normal leading-relaxed whitespace-pre-wrap break-words pr-4 select-text">
                          {msg.content}
                        </p>

                        {/* Reaction badges */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {msg.reactions.map((r, rIdx) => (
                              <button
                                key={rIdx}
                                onClick={() => handleToggleReaction(msg.id, r.emoji)}
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold ${
                                  r.users.includes("you")
                                    ? "bg-[#5865F2]/10 border-[#5865F2] text-[#7C8CFF]"
                                    : "bg-[#2b2d31] border-[#3f4248] text-[#9DA7B3]"
                                } hover:bg-[#35373c] transition-all`}
                              >
                                <span>{r.emoji}</span>
                                <span>{r.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-[#5E6976] text-xs">
                  Beginning of direct messaging history.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#1e2229] border-t border-[#252B34] flex items-center gap-3">
              <div className="relative flex-1">
                {/* Attachments Dummy */}
                <button
                  type="button"
                  className="absolute left-3.5 top-2.5 text-[#9DA7B3] hover:text-white transition-colors"
                >
                  <PlusCircle size={16} />
                </button>
                
                <input
                  type="text"
                  placeholder={`Message @${activeChat.friendName}`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="w-full pl-11 pr-20 py-2.5 bg-[#383a40] border-none rounded-xl text-xs text-[#dbdee1] placeholder-[#5e6976] focus:outline-none focus:ring-1 focus:ring-[#5865F2] font-sans"
                />

                {/* Input accessory badges */}
                <div className="absolute right-3.5 top-2.5 flex items-center gap-2.5 text-[#9DA7B3]">
                  <Gift size={16} className="cursor-pointer hover:text-white transition-colors" />
                  <Smile size={16} className="cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-[#35373c] text-white disabled:text-[#9DA7B3] transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
