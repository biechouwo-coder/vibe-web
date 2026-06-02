# vibe.web — Page 1: Study Desk (Home)

A warm, sophisticated academic dashboard for daily English study. Premium research tool feel with refined serif typography, navy accent, and polished card design.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first responsive
- Theme: Light & Dark modes, academic-warm, refined-scholarly
- Background: Warm Paper (#faf8f3) for page, Off-white (#fefcf9) for workspace
- Primary Accent: Academic Navy (#013E75) for interactive elements, active states, links
- Destructive/Highlight: Academic Red (#A42423) for streaks, important markers
- Text Primary: Deep Charcoal (#1c1917) for headings
- Text Secondary: Warm Stone (#78716c) for descriptions, metadata
- Surface Cards: Clean White (#ffffff) with subtle warm gray borders
- Dark Cards: Deep Ink (#1a1817) background for contrast cards
- Typography: Noto Serif for headings, Geist Sans for body/UI
- Radius: Panels 16px, Controls 10px, Small elements 6px
- Spacing: Generous, breathing room, 24px grid

**Page Structure:**
1. **Date & Title Header:** Uppercase date with wide tracking, "Study Desk" in large serif font with tight tracking
2. **Hero Row (2-col grid, 3:2 ratio):**
   - **Today's Focus Card (left, larger):** White card with subtle border. Label "TODAY'S FOCUS" in tracked uppercase, passage title in serif, descriptive text below, "Open reading →" link button
   - **Task Summary Card (right, dark accent):** Deep navy/dark card. Shows "Tasks" label, large completed/total number, slim progress bar, streak badge with flame icon, "Open task planner" full-width subtle button
3. **Today's Tasks Section:** Section heading "Today's Tasks" with "Manage all →" link. White card containing task list with checkbox items, strikethrough for completed
4. **Learning Queue Section:** Section heading "Learning Queue" with "View all →" link. 3-column card grid: Conversation Practice (scenario preview), Vocabulary (term count + tags), Reading Passage (journal excerpt)

---

# vibe.web — Page 2: Readings

A clean content browsing page displaying daily academic English readings in an elegant three-column card grid with content history.

**Page Structure:**
1. **Page Header:** "Today's Readings" in serif heading, formatted date below in muted text
2. **Reading Cards Grid (3 columns):**
   - Conversation Practice card: Type badge, topic title, scenario preview text, difficulty/type tags, "Practice →" action
   - Vocabulary card: Type badge, theme title, term count, IPA phonetic snippets, academic keyword tags, "Review terms →" action
   - Reading Passage card: Type badge, paper title, journal/citation info, excerpt text, writing focus tags, "Read excerpt →" action
3. **Content History Section:** Chronological list of past readings with dates and type indicators

---

# vibe.web — Page 3: Daily Plans

A focused task management page for daily study planning with streak tracking and progress visualization.

**Page Structure:**
1. **Header Row:** "Daily Plans" serif title with date below on left, streak badge (flame icon + count) on right
2. **Progress Card:** White card showing "X/Y tasks completed" with percentage, slim progress bar with navy fill
3. **Add Task Form:** Horizontal input row — text field with placeholder "Add a new task..." + "Add" submit button in navy accent
4. **Task List:** White card with stacked task items. Each item: checkbox, task text (strikethrough when completed), due time if set. Completed items visually muted. Empty state shows "No tasks yet — add your first one above"
5. **History Link:** Subtle link "View completed tasks →" to history page

---

# vibe.web — Page 4: Settings

A minimal, well-organized settings page with clear section grouping and polished form controls.

**Page Structure:**
1. **Page Header:** "Settings" serif title with "Configure integrations and preferences" subtitle
2. **Theme Section Card:** "Theme" heading, three radio options in a horizontal pill selector — Light (sun icon), Dark (moon icon), Auto (system icon). Selected state uses navy accent fill
3. **Notion Integration Card:** "Notion Integration" heading, description text about pushing content to Notion. Setup instructions in a nested info box with numbered steps, external link to Notion integrations page. Status indicator showing whether connected
4. **About/Info:** Subtle footer with app version and links

---

💡 **Tip:** After generating these screens, run the `design-md` skill to extract a reusable DESIGN.md for future iterations.
