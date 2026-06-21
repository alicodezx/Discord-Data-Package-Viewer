# Discord Data Package Viewer

Discord Data Package Viewer is a private, client-side analytical dashboard that turns your raw Discord Data Export into beautiful visual graphics. 

Unlike traditional web analyzers, **your data never leaves your device**. The application performs all ingestion, parsing, and analytics locally in your web browser.

---

## 🌟 Key Features

* **Overview & KPI Cards:** At-a-glance metrics of messages, words, characters, attachments, and links.
* **Activity Heatmaps:** Visual grid plotting your messaging density across 24 hours and 7 days of the week.
* **Typing Tone & Expression:** Insight into your textual behavior (SHOUTING rate, inquiry frequencies, average word complexity).
* **Billing History:** Nitro subscription tracker and financial ledger showing total historical spend on Discord.
* **Timeline Insights:** Active streak counters, longest chat streaks, and monthly message distributions.

---

## 🧠 Algorithms in Simple Words

Because Discord exports data in plain CSV and JSON files, we apply several algorithms and smart heuristics to reconstruct your profile:

### 1. Account Age (Snowflake ID parsing)
Discord generates unique 64-bit IDs (called "Snowflakes") for users, servers, and messages. These IDs aren't random; they encode a timestamp.
* **How it works:** We take your user ID, subtract Discord's custom starting point ("epoch" of 1420070400000 milliseconds), and perform a bitwise shift. This extracts the exact millisecond, second, and date you registered your account. We then compare that to today's date to calculate your total account age in days.

### 2. Activity Heatmap (Grid mapping)
To find out when you are most active, we map every message's timestamp to a 7 × 24 grid.
* **How it works:** We read each message date, find its day of the week (0 to 6) and hour of the day (0 to 23). We increment that cell's count. To display it, we find the highest message count in the entire grid to scale and color the block opacities (similar to a GitHub contribution graph).

### 3. Voice Call Estimation (Telemetry Heuristic)
Discord does not export direct voice connection logs or call duration histories in your standard package.
* **How it works:** We use a text-to-voice correlation heuristic. We estimate voice presence at a rate of 1 hour of call presence for every 250 sent messages. Peak voice hours are mapped directly to your peak text activity hours, assuming voice participation aligns with text availability.

### 4. Continuous Chat Streaks
We compute how many consecutive days you have sent at least one message on Discord.
* **How it works:** We sort all messaging dates chronologically, filter out duplicate days, and count consecutive calendar days. If a gap occurs, the streak breaks. We track the current active streak and your all-time longest streak.

### 5. Tone & Expression Indexes
We analyze word count, character lengths, and punctuation flags to identify typing habits.
* **How it works:** 
  * **Shouting Rate:** Percentage of alphabetic messages typed entirely in uppercase.
  * **Inquiry/Excitement Rates:** Frequency of messages containing `?` or `!`.
  * **Word Density:** The total character count of all words divided by the word count to determine your average characters per word.
