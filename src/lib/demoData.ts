import type { DiscordUser, AnalyticsData } from "@/types/discord";

export const getDemoUser = (): DiscordUser => ({
  id: "123456789012345678",
  username: "wumpus_dev",
  discriminator: 0,
  global_name: "Wumpus Explorer",
  email: "wumpus@example.com",
  verified: true,
  avatar_hash: undefined,
  has_mobile: true,
  premium_until: "2026-12-31T23:59:59Z",
  flags: ["HOUSE_BALANCE", "EARLY_SUPPORTER"],
  relationships: [
    {
      id: "friend1",
      type: "FRIEND",
      user: { id: "f1", username: "octocat", global_name: "GitHub Octocat" }
    },
    {
      id: "friend2",
      type: "FRIEND",
      user: { id: "f2", username: "lorem_ipsum", global_name: "Lorem Ipsum" }
    },
    {
      id: "friend3",
      type: "FRIEND",
      user: { id: "f3", username: "clippy", global_name: "Office Clippy" }
    },
    {
      id: "friend4",
      type: "FRIEND",
      user: { id: "f4", username: "midjourney", global_name: "Midjourney Bot" }
    },
    {
      id: "friend5",
      type: "FRIEND",
      user: { id: "f5", username: "clyde", global_name: "Clyde" }
    },
    {
      id: "pending1",
      type: "PENDING_INCOMING",
      user: { id: "p1", username: "stranger_danger", global_name: "Stranger" }
    },
    {
      id: "blocked1",
      type: "BLOCKED",
      user: { id: "b1", username: "spambot99", global_name: "Spam Bot 99" }
    }
  ]
});

export const getDemoAnalytics = (): AnalyticsData => {
  const totalMessages = 48293;
  const totalWords = 328402;
  const totalChars = 1642010;
  
  return {
    totalMessages,
    totalWords,
    totalChars,
    totalAttachments: 1842,
    totalLinks: 942,
    totalEmojis: 5493,
    totalSlashCommands: 382,
    nightOwlPercentage: 35.8,
    weekendWarriorPercentage: 28.4,

    channels: [],
    guildChannels: [
      { id: "c1", info: { id: "c1", type: "GUILD_TEXT", name: "general" }, indexName: "general", messages: [], messageCount: 15430 },
      { id: "c2", info: { id: "c2", type: "GUILD_TEXT", name: "memes" }, indexName: "memes", messages: [], messageCount: 8493 },
      { id: "c3", info: { id: "c3", type: "GUILD_TEXT", name: "coding" }, indexName: "coding", messages: [], messageCount: 6281 },
      { id: "c4", info: { id: "c4", type: "GUILD_TEXT", name: "music-bot" }, indexName: "music-bot", messages: [], messageCount: 1204 }
    ],
    dmChannels: [
      { id: "dm1", info: { id: "dm1", type: "DM", recipients: [{ id: "f1", username: "octocat" }] }, indexName: "octocat", messages: [], messageCount: 9482 },
      { id: "dm2", info: { id: "dm2", type: "DM", recipients: [{ id: "f2", username: "lorem_ipsum" }] }, indexName: "lorem_ipsum", messages: [], messageCount: 4201 }
    ],
    groupChannels: [
      { id: "g1", info: { id: "g1", type: "GROUP_DM", name: "Hackathon Team" }, indexName: "hackathon-team", messages: [], messageCount: 3202 }
    ],

    servers: [
      { id: "s1", name: "Wumpus Fan Club", messageCount: 18492, channelCount: 8 },
      { id: "s2", name: "Next.js Developers", messageCount: 7892, channelCount: 14 },
      { id: "s3", name: "Indie Hackers", messageCount: 4280, channelCount: 6 },
      { id: "s4", name: "Retro Gaming Central", messageCount: 1042, channelCount: 3 }
    ],

    messagesByMonth: {
      "2023-01": 840,
      "2023-02": 1200,
      "2023-03": 1540,
      "2023-04": 2010,
      "2023-05": 1890,
      "2023-06": 2400,
      "2023-07": 3100,
      "2023-08": 2840,
      "2023-09": 3500,
      "2023-10": 4200,
      "2023-11": 4800,
      "2023-12": 5200,
      "2024-01": 5600,
      "2024-02": 6120,
      "2024-03": 3311
    },
    messagesByDayOfWeek: [5402, 6204, 7120, 6890, 7540, 8942, 6195], // Sun-Sat
    messagesByHour: [
      940, 480, 210, 80, 50, 110, 320, 840, 1200, 1500, 
      1800, 2100, 2400, 2300, 2600, 2900, 3200, 3800, 
      4200, 4500, 3900, 3100, 2000, 1300
    ],

    topChannels: [
      { id: "c1", name: "general in Wumpus Fan Club", count: 15430 },
      { id: "dm1", name: "Direct Message with octocat", count: 9482 },
      { id: "c2", name: "memes in Wumpus Fan Club", count: 8493 },
      { id: "c3", name: "coding in Next.js Developers", count: 6281 },
      { id: "dm2", name: "Direct Message with lorem_ipsum", count: 4201 },
      { id: "g1", name: "Hackathon Team", count: 3202 }
    ],
    topServers: [
      { id: "s1", name: "Wumpus Fan Club", count: 23923 },
      { id: "s2", name: "Next.js Developers", count: 7892 },
      { id: "s3", name: "Indie Hackers", count: 4280 },
      { id: "s4", name: "Retro Gaming Central", count: 1042 }
    ],
    topWords: [
      { word: "discord", count: 1243 },
      { word: "project", count: 942 },
      { word: "awesome", count: 820 },
      { word: "code", count: 711 },
      { word: "wumpus", count: 692 },
      { word: "coffee", count: 580 },
      { word: "nextjs", count: 493 },
      { word: "server", count: 412 },
      { word: "bug", count: 382 },
      { word: "fixed", count: 310 }
    ],
    topEmojis: [
      { emoji: "💀", count: 942 },
      { emoji: "😂", count: 812 },
      { emoji: "🔥", count: 654 },
      { emoji: "👀", count: 532 },
      { emoji: "👍", count: 421 }
    ],
    topFriends: [
      { id: "f1", name: "Direct Message with octocat", messageCount: 9482, sentMessages: 4890 },
      { id: "f2", name: "Direct Message with lorem_ipsum", messageCount: 4201, sentMessages: 2150 }
    ],

    firstMessageDate: "Jan 15, 2023",
    lastMessageDate: "Mar 28, 2024",
    mostActiveYear: "2023",
    mostActiveMonth: "December 2023",
    mostActiveDay: "Friday",

    averageMessagesPerDay: 110.2,
    averageWordsPerMessage: 6.8,
    longestMessage: {
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      channel: "coding",
      date: "Nov 12, 2023"
    },
    longestStreak: { days: 42, start: "Oct 01, 2023", end: "Nov 11, 2023" },
    currentStreak: 5,
    activeDaysTotal: 382,

    accountAge: 1250,
    friendCount: 5,
    serverCount: 4,
    nitroStatus: true,
    nitroSince: "2023-04-12T15:20:00Z",
    nitroDays: 432,
    userBadges: [
      { label: "Early Supporter", icon: "Award" },
      { label: "Active Developer", icon: "Terminal" },
      { label: "HypeSquad Balance", icon: "ShieldAlert" }
    ],
    
    billing: {
      payments: [
        { amount: 999, currency: "usd", status: 1, description: "Nitro Monthly Subscription", created_at: "2024-03-12T15:20:00Z", payment_gateway: 1 },
        { amount: 999, currency: "usd", status: 1, description: "Nitro Monthly Subscription", created_at: "2024-02-12T15:20:00Z", payment_gateway: 1 },
        { amount: 999, currency: "usd", status: 1, description: "Nitro Monthly Subscription", created_at: "2024-01-12T15:20:00Z", payment_gateway: 1 },
        { amount: 499, currency: "usd", status: 1, description: "Server Boost (Next.js Developers)", created_at: "2023-12-25T10:15:00Z", payment_gateway: 1 },
        { amount: 999, currency: "usd", status: 1, description: "Nitro Monthly Subscription", created_at: "2023-12-12T15:20:00Z", payment_gateway: 1 }
      ],
      totalSpentInCents: 4495,
      totalTransactions: 5,
      firstTransactionDate: "2023-12-12T15:20:00Z",
      lastTransactionDate: "2024-03-12T15:20:00Z"
    },
    hourlyByDayOfWeek: [
      [50, 30, 10, 5, 2, 8, 20, 50, 80, 100, 120, 140, 150, 160, 180, 190, 200, 220, 240, 250, 230, 200, 150, 80],
      [40, 20, 8, 4, 1, 10, 30, 90, 130, 150, 140, 160, 170, 150, 180, 200, 220, 260, 290, 310, 280, 210, 130, 70],
      [35, 18, 5, 3, 0, 12, 35, 95, 125, 145, 135, 155, 165, 145, 175, 195, 215, 255, 285, 305, 275, 205, 125, 65],
      [38, 19, 6, 2, 1, 11, 32, 92, 128, 148, 138, 158, 168, 148, 178, 198, 218, 258, 288, 308, 278, 208, 128, 68],
      [42, 22, 7, 4, 2, 13, 38, 98, 132, 152, 142, 162, 172, 152, 182, 202, 222, 262, 292, 312, 282, 212, 132, 72],
      [55, 35, 15, 8, 3, 15, 45, 110, 150, 170, 160, 180, 190, 180, 210, 230, 250, 300, 340, 360, 320, 250, 180, 100],
      [65, 45, 20, 12, 5, 8, 25, 60, 90, 110, 130, 150, 170, 180, 190, 200, 210, 230, 260, 280, 270, 240, 190, 120]
    ],
    toneMetrics: {
      capsPercentage: 6.4,
      questionPercentage: 14.8,
      exclamationPercentage: 9.2,
      avgWordLength: 4.8
    },
    voiceCallStats: {
      totalHours: 342,
      averageCallMinutes: 38,
      longestCallMinutes: 480,
      favoriteCallHour: 21
    },
    dmSpeedMetrics: [
      { friendId: "f1", friendName: "octocat", userAvgReplySeconds: 142, friendAvgReplySeconds: 198, streakDays: 42 },
      { friendId: "f2", friendName: "lorem_ipsum", userAvgReplySeconds: 280, friendAvgReplySeconds: 210, streakDays: 18 },
      { friendId: "f3", friendName: "clippy", userAvgReplySeconds: 90, friendAvgReplySeconds: 540, streakDays: 5 },
      { friendId: "f4", friendName: "midjourney", userAvgReplySeconds: 45, friendAvgReplySeconds: 1200, streakDays: 2 },
      { friendId: "f5", friendName: "clyde", userAvgReplySeconds: 15, friendAvgReplySeconds: 5, streakDays: 30 }
    ],
    questStats: {
      totalQuestsJoined: 8,
      questsCompleted: 7,
      estimatedRewardsClaimed: 6,
      totalQuestStreamingHours: 1.8,
      questHistory: [
        { id: "q-0", gameName: "Minecraft", questName: "Minecraft 15th Anniversary Quest", rewardType: "In-game Item", rewardName: "TikTok Cape & Cherry Blossom Decor", completedAt: "May 15, 2024", claimed: true },
        { id: "q-1", gameName: "Fortnite", questName: "Fortnite High Stakes Quest", rewardType: "Profile Effect", rewardName: "Llama Legend Profile Effect", completedAt: "Jun 02, 2024", claimed: false },
        { id: "q-2", gameName: "Genshin Impact", questName: "Genshin Impact Version 4.7 Quest", rewardType: "In-game Code", rewardName: "60 Primogems & Hero's Wit", completedAt: "Jun 18, 2024", claimed: true },
        { id: "q-3", gameName: "Valorant", questName: "Valorant Champions 2024 Quest", rewardType: "Avatar Decoration", rewardName: "Champions Aura Avatar Decor", completedAt: "Aug 05, 2024", claimed: true },
        { id: "q-4", gameName: "Honkai: Star Rail", questName: "Honkai: Star Rail Version 2.3 Quest", rewardType: "In-game Code", rewardName: "30 Stellar Jades & Credits", completedAt: "Sep 12, 2024", claimed: true },
        { id: "q-5", gameName: "Wuthering Waves", questName: "Wuthering Waves Version 1.1 Quest", rewardType: "Profile Effect", rewardName: "Echo Waves Profile Effect", completedAt: "Oct 01, 2024", claimed: true },
        { id: "q-6", gameName: "League of Legends", questName: "LoL Arena Showdown Quest", rewardType: "In-game Item", rewardName: "Hextech Chest & Key", completedAt: "Nov 15, 2024", claimed: true },
        { id: "q-7", gameName: "Apex Legends", questName: "Apex Legends Breakout Quest", rewardType: "Avatar Decoration", rewardName: "Nessie Avatar Decoration", completedAt: "—", claimed: false }
      ]
    }
  };
};
