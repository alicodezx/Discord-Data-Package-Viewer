# Discord Data Package Viewer: Current Features & Statistics

This document lists the features and statistics currently implemented in the Discord Data Package Viewer website codebase.

---

## 🚀 Active Web Features

1. **Local Data Package Parser**
   - 100% client-side data reading from dropped/selected Discord data folder directories or `package.zip` files.
   - Interactive progress bar indicating parsing stages (e.g. reading channels, parsing message CSVs, analyzing billing records).
   - "Demo Data" trigger allowing exploration of the website's dashboards using sample analytics when no upload is provided.

2. **Dashboard Navigation & User Context**
   - Collapsible desktop navigation sidebar and responsive mobile top bar.
   - User profile card loading the active avatar, global name, and username from the uploaded data.
   - Client execution safety indicator and a global data reset button.

3. **Insights Wrapped Slideshow**
   - An 8-slide story slideshow summarizing activity history (Intro, Messages, Top Server, Top Friend, Streaks, Words, Activity, Outro).
   - Controls to play/pause the slideshow, segment progress lines, and skip back/forth.
   - **Recap Card Download:** Generates and downloads a custom high-resolution PNG image containing key statistics.
   - **URL Sharing:** Serializes, compresses, and copies a base64 URL to the clipboard so other users can view interactive wrapped statistics.

4. **Interactive Analytical Charts**
   - Integrated Recharts components showing active text volume ranks, chronologies, and financial spending.

---

## 📊 Current Statistics Extracted & Displayed

### 1. Overview Section
* **Core KPI Metrics:** Cumulative sums of Total Messages, Total Words, Total Characters, Total Attachments, and Total Links.
* **Basic Timeline Range:** The first and last recorded message dates in the package.

### 2. Messages Section
* **Content Rates:** Word counts per message and attachment rates.
* **Top Channels Table:** Lists the top text channels sorted by total message volume.
* **Word Cloud List:** Ranks the top 20 most frequent vocabularies (common pronouns and articles automatically excluded).

### 3. Servers Section
* **Joined Communities Count:** Total count of unique guilds.
* **Top Community:** Name of the server with the highest user activity.
* **Average Guild Activity:** Total message volume divided by joined server counts.
* **Server Detail Grid:** Ranks of joined servers displaying message volumes, channel counts, and relative activity bars.

### 4. Friends & DMs Section
* **Top DM Conversations:** Close direct messaging partners ranked by message volume.
* **DM Streaks:** Active consecutive messaging days.
* **Reply Latency Heuristics:** Calculated average reply speeds in seconds (user replies vs. friend replies).

### 5. Timeline Section
* **Volume Distribution Chart:** Chronological line/area charts tracking monthly message densities across active years.
* **Weekly Activity Chart:** Bar chart mapping messaging volume from Sunday to Saturday.
* **Hourly Activity Chart:** Line chart tracking active times of day (0-23 hours).

### 6. Time Capsule (Guild Archeologist)
* **Account Genesis:** The account creation date (derived from the user's Snowflake ID epoch) and total age in days.
* **Discord Era Badge:** Auto-assigns the user an era badge (Classic OG, Nitro Growth, Server Expansion, or Modern Era) based on registration year.
* **Peak Activity Day:** The single day in the user's history with the highest message volume, plus the exact count.
* **The Genesis Message:** The exact content, timestamp, and channel name of the first message sent by the user in this package.
* **The Novelist Award:** Displays the exact content, character length, channel, and date of the user's single longest message.

### 7. Deep Patterns (Behavior & Dynamics)
* **Activity Heatmap (Punch Card Grid):** Interactive 7×24 grid tracking message volume densities across hours of the day (0-23) and days of the week (Sun-Sat).
* **Typing Tone Indexes:**
  - *Shouting Rate:* Percentage of alphabetic messages typed entirely in uppercase.
  - *Inquiry Rate:* Percentage of messages containing `?`.
  - *Excitement Rate:* Percentage of messages containing `!`.
  - *Word Density:* Average character count per word.
* **Voice Calls Telemetry:**
  - *Total Voice Presence:* Estimated hours spent in voice channels.
  - *Average Call Length:* Estimated minutes per call.
  - *Longest Call Session:* Longest continuous call duration.
  - *Peak Calling Hour:* Time of day when the user most frequently connects to voice.

### 8. Billing & spent Section
* **Top Stats:** Total spent in fiat currency, total orbs spent (digital currency), transaction counts, first transaction date, and last transaction date.
* **Filters:** Toggles to filter statistics by currency type (Fiat money, digital Orbs) and timeframes (7D, 30D, 1Y, All-time).
* **Spending Chart:** Bar chart showing monthly transaction volumes.
* **Ledger Table:** Detailed transaction records including item description, timestamp, cost, and transaction status (Success, Pending, Failed, Refunded).

### 9. Quests Section
* **Gamified Metrics:** Total quests joined, quests completed, estimated rewards claimed, and streaming hours.
* **Quest Log:** Table of quest details (game name, quest name, reward name/type, completion date, claim status).

### 10. Account Section
* **Profile Metadata:** Account ID, email, verified status, registered phone, IP address, and account flags.
* **Active Sessions list:** Login metadata showing browser client type, OS, location, IP address, and last active times.
* **Integrations:** Verified connected third-party accounts (Spotify, GitHub, Steam, etc.).

### 11. System Info Section
* **System Metrics:** Read speeds, file counts loaded, device user agents, and browser storage details.
