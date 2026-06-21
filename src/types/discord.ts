// Discord Data Package Types

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: number;
  global_name: string;
  email?: string;
  verified: boolean;
  avatar_hash?: string;
  has_mobile: boolean;
  premium_until?: string;
  phone?: string;
  ip?: string;
  flags: string[];
  settings?: UserSettings;
  relationships?: Relationship[];
  guild_settings?: GuildSetting[];
  user_sessions?: UserSession[];
  connections?: Connection[];
  frecency?: FrecencyData;
}

export interface PaymentRecord {
  amount: number;
  currency: string;
  status: number;
  description: string;
  created_at: string;
  payment_gateway: number;
}

export interface BillingData {
  payments: PaymentRecord[];
  totalSpentInCents: number;
  totalTransactions: number;
  firstTransactionDate?: string;
  lastTransactionDate?: string;
}

export interface UserSettings {
  settings?: {
    status?: {
      status?: string;
      customStatus?: { text?: string; emojiName?: string };
    };
    localization?: {
      locale?: string;
      timezoneOffset?: number;
    };
    appearance?: {
      theme?: string;
      developerMode?: boolean;
    };
    textAndImages?: {
      defaultReactionEmoji?: { emojiName?: string; emojiId?: string };
    };
  };
}

export interface Relationship {
  id: string;
  type: string; // FRIEND, BLOCKED, PENDING_INCOMING, PENDING_OUTGOING
  nickname?: string;
  user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string;
    public_flags?: number;
  };
}

export interface GuildSetting {
  guild_id: string;
  suppress_everyone?: boolean;
  muted?: boolean;
  message_notifications?: number;
}

export interface UserSession {
  id_hash: string;
  user_data: {
    creation_time: string;
    expiration_time?: string;
    approx_last_used_time?: string;
    client_info: {
      ip?: string;
      os?: string;
      platform?: string;
      location?: string;
    };
    city?: string;
    country_code?: string;
  };
}

export interface Connection {
  type: string;
  id: string;
  name?: string;
  visibility?: number;
  verified?: boolean;
}

export interface FrecencyData {
  emojiFrecency?: {
    emojis: Record<string, { totalUses: number; recentUses: string[] }>;
  };
  emojiReactionFrecency?: {
    emojis: Record<string, { totalUses: number; score?: number }>;
  };
  stickerFrecency?: {
    stickers: Record<string, { totalUses: number }>;
  };
  favoriteEmojis?: { emojis: string[] };
}

export interface DiscordMessage {
  ID: number | string;
  Timestamp: string;
  Contents: string;
  Attachments: string;
}

export interface ChannelInfo {
  id: string;
  type: string; // GUILD_TEXT, DM, GROUP_DM
  name?: string;
  guild?: { id: string; name: string };
  recipients?: Array<{ id: string; username: string }>;
}

export interface ParsedChannel {
  id: string;
  info: ChannelInfo;
  indexName: string; // from Messages/index.json
  messages: DiscordMessage[];
  messageCount: number;
}

export interface AnalyticsData {
  // Core stats
  totalMessages: number;
  totalWords: number;
  totalChars: number;
  totalAttachments: number;
  totalLinks: number;
  totalEmojis: number;
  totalSlashCommands: number;
  nightOwlPercentage: number;
  weekendWarriorPercentage: number;

  // Channels
  channels: ParsedChannel[];
  guildChannels: ParsedChannel[];
  dmChannels: ParsedChannel[];
  groupChannels: ParsedChannel[];

  // Server stats
  servers: ServerStats[];

  // Timeline
  messagesByMonth: Record<string, number>;
  messagesByDayOfWeek: number[]; // 0=Sun..6=Sat
  messagesByHour: number[]; // 0..23

  // Top lists
  topChannels: { id: string; name: string; count: number }[];
  topServers: { id: string; name: string; count: number }[];
  topWords: { word: string; count: number }[];
  topEmojis: { emoji: string; count: number }[];
  topFriends: { id: string; name: string; messageCount: number; sentMessages: number }[];

  // Date range
  firstMessageDate: string;
  lastMessageDate: string;
  mostActiveYear: string;
  mostActiveMonth: string;
  mostActiveDay: string;

  // Patterns
  averageMessagesPerDay: number;
  averageWordsPerMessage: number;
  longestMessage: { content: string; channel: string; date: string };
  longestStreak: { days: number; start: string; end: string };
  currentStreak: number;
  activeDaysTotal: number;

  // Account
  accountAge: number; // days
  friendCount: number;
  serverCount: number;
  nitroStatus: boolean;
  nitroSince: string | null;
  nitroDays: number | null;
  userBadges: { label: string; icon: string }[];

  billing?: BillingData;
  hourlyByDayOfWeek?: number[][];
  toneMetrics?: {
    capsPercentage: number;
    questionPercentage: number;
    exclamationPercentage: number;
    avgWordLength: number;
  };
  voiceCallStats?: {
    totalHours: number;
    averageCallMinutes: number;
    longestCallMinutes: number;
    favoriteCallHour: number;
  };
  dmSpeedMetrics?: {
    friendId: string;
    friendName: string;
    userAvgReplySeconds: number;
    friendAvgReplySeconds: number;
    streakDays: number;
  }[];
}

export interface ServerStats {
  id: string;
  name: string;
  messageCount: number;
  channelCount: number;
  firstMessage?: string;
  lastMessage?: string;
}

export interface ParseProgress {
  stage: string;
  current: number;
  total: number;
  percent: number;
}

export interface ParsedDataStore {
  user: DiscordUser | null;
  analytics: AnalyticsData | null;
  progress: ParseProgress | null;
  isLoading: boolean;
  error: string | null;
}
