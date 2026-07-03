# Development Log

## 2026-07-03 - Rulebook content pass and reader navigation upgrade

### Completed today

- Continued the private Rulebook translation workspace through the remaining useful gameplay sections.
- Added private Rulebook sections for pages 1-34:
  - Pages 1-5: Welcome, components, character setup, play space setup, and ready-to-play setup
  - Pages 6-15: Exiles, skills, equipment, items, universal rules, index system, card/text types, jobs, day cards, adventure, Squills, and dossiers
  - Pages 16-25: Worldmaps, travel, town/guild actions, locations, maps, movement, borders, range, ability types, targeting, threat, combo, foes, threat cards, AI cards, and foe components
  - Pages 26-34: Foe turns, foe targeting, foe attacks, exile turns, KO'd, Surge, hit grids, basic attacks, attack patterns, combat end, save/load, difficulty, reset, and Green Legacy
- Added/updated public-safe glossary terms for the above rulebook systems.
- Decided to skip Rulebook page 35 because it is mostly soundtrack, credits, special thanks, and backer acknowledgements.
- Decided to skip Rulebook page 36 because it is mostly index / quick-reference material rather than core reader content.
- Improved the Rulebook app UI:
  - Converted the Rulebook from a long all-pages scroll into a single-page reader by default.
  - Added a sticky desktop page navigator.
  - Added a mobile jump-to-page dropdown.
  - Added Previous / Next navigation buttons.
  - Added an optional Show all pages toggle.
  - Added URL support such as /rulebook?page=28.
  - Preserved search, status filters, translation progress, and display mode controls.
  - Adjusted Previous / Next scrolling so it jumps to the rulebook content area instead of the very top of the page.
- Fixed UI text encoding issues in public components where Traditional Chinese labels had become mojibake.
- Fixed Previous / Next arrow rendering.
- Fixed iPad local-network use:
  - Confirmed the desktop can serve the private Rulebook JSON to iPad Safari over the local network.
  - Added/updated local dev origin settings so client-side buttons work from iPad.
  - Converted Rulebook page navigation controls to real links where useful, so Previous / Next and page navigation remain reliable on iPad.

### Important decisions

- Private exact/near-exact Rulebook content remains in ignored private data only.
- Public source files should only contain app logic, UI, public-safe glossary entries, and public-safe schema/dev notes.
- Page 35 and Page 36 are intentionally not included in the in-app Rulebook reader for now.
- The Rulebook reader should prioritize practical gameplay navigation over reproducing the physical rulebook layout exactly.

### Files touched today

Private / local-only:

- private-data/rulebook.private.json

Public-safe:

- src/app/rulebook/page.tsx
- src/components/GuideViewer.tsx
- src/components/GuideSection.tsx
- src/components/BilingualPair.tsx
- src/data/glossary.ts
- next.config.ts / next.config.*
- docs/devlog.md

### Next steps

- Review the Rulebook reader in the browser and confirm navigation feels good on desktop, iPad, and mobile widths.
- Check for duplicate or inconsistent glossary terms after the large combat terminology pass.
- Commit public-safe files only.
- Do not commit private-data/rulebook.private.json.
- After the Rulebook reader is stable, consider adding a compact glossary/search panel or cross-links from glossary terms to the relevant Rulebook pages.


## 2026-07-02

### Next step

Continue the rulebook translation workflow carefully:

1. Keep `/rulebook` as a pure translation workspace.
2. Store exact/close English rulebook wording and Traditional Chinese translation only in `private-data/rulebook.private.json`.
3. Store schema conclusions only in `docs/schema-notes.md`.
4. Continue with the next schema-relevant rulebook pass:
   - card indexes
   - active/inactive decks
   - card states
   - banish / party inventory / cleared state
5. Use the findings to refine card database structure before entering real card content.

### Rulebook translation workflow cleanup milestone

- Added the `/rulebook` translation workspace and homepage/header links.
- Confirmed the rulebook page loads private ignored rulebook data locally.
- Confirmed `private-data/rulebook.private.json` remains ignored by Git.
- Added `docs/schema-notes.md` as the public-safe place for database/schema conclusions.
- Started using the rulebook as a schema-discovery source before entering real card content.
- Added glossary terms for rulebook/card structure, including text types, card state, active/inactive cards, locations, pointers, interaction actions, cleared/unexplored, and related map terms.
- Fixed terminology convention:
  - Use `文字` instead of `文` for UI/database text types.
  - Example: `Choice Text` = `選項文字`, not `選項文`.
- Identified and corrected an important workflow mistake:
  - `/rulebook` should contain English rulebook text + Traditional Chinese translation only.
  - Database design notes should live in `docs/schema-notes.md`, not in the rulebook translation page.
- Cleaned `/rulebook` wording:
  - Changed the page title from rulebook translation + structure notes to rulebook translation only.
  - Removed schema-note wording from the public fallback rulebook data.
- Established encoding rule for future work:
  - Do not write raw Chinese through PowerShell + Node here-strings.
  - Use Unicode escapes or edit files directly in VS Code with UTF-8 to avoid corrupted Chinese characters.

### Rulebook schema discovery workspace milestone

- Added a new `/rulebook` workspace page.
- Added public-safe demo rulebook data:
  - `src/data/rulebook.ts`
- Added a private rulebook loader:
  - `src/data/loadRulebook.ts`
- Added Rulebook navigation to the app header.
- Added public-safe schema notes:
  - `docs/schema-notes.md`
- Created ignored private test data:
  - `private-data/rulebook.private.json`
- Confirmed `/rulebook` loads ignored private data locally.
- Confirmed private rulebook JSON is not tracked by Git.

### Encounter progress import/export milestone

- Added encounter progress backup tools to the card library.
- Added `Export progress`, which downloads a JSON backup of encountered card IDs.
- Added `Import progress`, which restores encountered card IDs from a JSON file.
- Import validates IDs against the current card library and ignores unknown card IDs.
- Backup files contain only encounter progress IDs.
- Backup files do not contain card text, translations, or private Arydia content.
- Confirmed export, reset, import, and refresh behavior works locally.

### Spoiler-safe card encounter tracker milestone

- Added browser-local card encounter tracking using `localStorage`.
- Added a reusable encounter progress hook:
  - `src/hooks/useEncounteredCards.ts`
- Added a reusable card encounter toggle component:
  - `src/components/CardEncounterToggle.tsx`
- Updated the card library page to support encountered status:
  - All cards
  - Encountered only
  - Not encountered only
- Added spoiler protection for unencountered cards.
- Unencountered cards hide spoiler-sensitive content by default:
  - title
  - subtitle
  - story/rules text
  - tags
  - notes
- Added separate workflow modes:
  - Play mode / 遊玩模式
  - Translation review / 翻譯檢查
- Play mode hides translation workflow information by default.
- Translation review mode shows translation progress and draft/review/approved badges.
- Encounter progress is private to the browser and is not committed to Git.
- Confirmed the tracker works after refresh.

### Private data loader workflow milestone

- Added a safe public/private data loading workflow.
- Public GitHub mode continues to use demo placeholder data from `src/data/`.
- Local private mode can use ignored JSON files from `private-data/`.
- Added `.env.example` to document the private data flag:
  - `ARYDIA_USE_PRIVATE_DATA=false`
- Created local `.env.local` with private mode enabled, but confirmed it is ignored by Git.
- Created safe local test JSON files:
  - `private-data/quick-start.private.json`
  - `private-data/cards.private.json`
- Confirmed `/quick-start` can load ignored private guide data locally.
- Confirmed `/cards` can load ignored private card data locally.
- Fixed private JSON parsing by stripping the hidden UTF-8 BOM character before `JSON.parse`.
- Confirmed Git safety:
  - `.env.local` was not tracked.
  - private JSON files were not tracked.
  - only `.env.example` and loader code were committed.
- Committed and pushed:
  - `Handle private JSON encoding safely`

## 2026-07-01

### Next step

Tomorrow, build the safe public/private data workflow:

1. Keep public repo data as demo/placeholder content.
2. Prepare a clean structure for private local translated content.
3. Create or plan a loader pattern so the public app can use demo data while the local private version can later use ignored private files.
4. After that, start translating the Quick Start Guide first, storing real translated content only in private ignored files.

### Naming, glossary, and private content safeguard milestone

- Renamed the app identity away from â€œTranslation Helper / ç¿»è­¯åŠ©æ‰‹â€ toward a database-style name: `Arydia: The Paths We Dare Tread ä¸­è‹±è³‡æ–™åº«`.
- Cleaned up glossary thinking around duplicated-looking terms:
  - Kept separate concepts such as `Foe` / `Foe cards` and `Point of Interest` / `Point of Interest cards`.
  - Confirmed there is no separate `AI Card` card type in the current Arydia component structure.
  - Chose `è·æ¥­è¦å‰‡å¡` for `path-rules-cards`.
- Confirmed the long-term goal of the app:
  - store English source content,
  - provide accurate Traditional Chinese translations,
  - keep glossary terms consistent,
  - support cards, maps, Quick Start Guide, rulebooks, and other gameplay reference material.
- Decided the future public GitHub repository should be portfolio-safe and should not include full copyrighted Arydia rulebook text, card text, map text, scans, OCR output, or full translations.
- Added private content storage safeguards:
  - updated `.gitignore`,
  - added `private-data/`,
  - added `src/data/private/`,
  - added private data README files,
  - added `docs/content-notice.md`,
  - added README copyright/content notice.
- Tested the ignore rule by creating a fake private file and confirming Git did not track it.
- Committed and pushed the private content storage safeguard milestone.

### Naming and glossary cleanup milestone

- Renamed the app to Arydia: The Paths We Dare Tread ä¸­è‹±è³‡æ–™åº«.
- Removed old â€œtranslation helper / ç¿»è­¯åŠ©æ‰‹â€ wording from the app identity.
- Cleaned up glossary card terms and aligned card type translations with the real Arydia component types.
- Confirmed that the card library uses real Arydia card types rather than generic placeholder categories.

### Card library type refactor milestone

- Locked the real Arydia card type translations in the glossary.
- Added real Arydia card types for NPC, JOB, THR, FOE, KEY, DAY, EVT, TRV, REF, POI, Character, Skill Tree, and Path Rules cards.
- Replaced the early generic card categories with real Arydia card type data.
- Added flexible bilingual card text blocks so different card structures can be represented later.
- Kept current card entries as safe placeholder content only.
- Added `/cards` navigation through the header and homepage.
- Added display mode support for the card library: side-by-side, Chinese-only, and English-only.

### Card library foundation milestone

- Added a `/cards` route for the Arydia card translation index.
- Added placeholder card entries using safe non-copyrighted sample text.
- Added search across card titles, subtitles, body blocks, tags, codes, and card type metadata.
- Updated the card model to use real Arydia card types instead of generic categories.
- Added flexible bilingual card text blocks so different card structures can be handled later.
- Locked real card type translations in the glossary.
- Added Cards å¡ç‰Œ navigation to the header and homepage.

### Quick Start search and review summary milestone

- Added search to the Quick Start Guide viewer.
- Search works across section titles, English text, and Traditional Chinese text.
- Search combines with the existing translation status filter.
- Search also works together with the display mode toggle.
- Added a review summary panel showing how many guide items are draft, reviewed, or approved.
- This prepares the guide for adding more real translated sections later.

### Quick Start search milestone

- Added search to the Quick Start Guide viewer.
- Search works across section titles, English text, and Traditional Chinese text.
- Search combines with the existing translation status filter.
- Search also works together with the display mode toggle.
- This prepares the guide for adding more real translated sections later.

### Quick Start display mode milestone

- Added display mode controls for the Quick Start Guide.
- The guide can now show:
  - side-by-side English / Traditional Chinese
  - Traditional Chinese only
  - English only
- Updated `BilingualPair`, `GuideSection`, and `GuideViewer` to support display modes.
- This makes the app more practical for iPad gameplay, where I may want a cleaner single-language view.

### Quick Start status filter milestone

- Created a reusable `GuideViewer` component.
- Added status filtering for Quick Start Guide content.
- The guide can now filter content by:
  - `all`
  - `draft`
  - `reviewed`
  - `approved`
- This helps separate rough translations from reviewed and approved translations.
- Moved guide rendering logic out of the route page and into a reusable client component.

### Translation status milestone

- Added translation status tracking for guide content.
- Created three statuses:
  - `draft`
  - `reviewed`
  - `approved`
- Added a reusable `StatusBadge` component.
- Updated `BilingualPair` so each English / Traditional Chinese pair shows its translation status.
- This will help separate rough AI-assisted translations from reviewed and approved translations later.

### Glossary search milestone

- Created a reusable `GlossaryTable` component.
- Added glossary search by English, Traditional Chinese, notes, and tags.
- Added tag filter buttons.
- Added a result count so I can see how many terms match the current search.
- Split the glossary page into a route page and a reusable client component.

### Shared navigation milestone

- Added a reusable `AppHeader` component.
- Added navigation links for Home, Glossary, and Quick Start Guide.
- Updated `src/app/layout.tsx` so the header appears on all pages.
- Added active page highlighting using `usePathname`.

### Shared navigation milestone

- Added a reusable `AppHeader` component.
- Added navigation links for Home, Glossary, and Quick Start Guide.
- Updated `src/app/layout.tsx` so the header appears on all pages.
- Added active page highlighting using `usePathname`.

### Homepage milestone

- Replaced the default Next.js homepage with a custom Arydia translation helper homepage.
- Added navigation cards for:
  - `/glossary`
  - `/quick-start`
- Used the same dark parchment / brass visual theme as the glossary page.
- Accidentally edited the wrong `page.tsx` at first, then fixed it by updating the correct file:
  `src/app/page.tsx`

Working route:

```text
http://localhost:3000
```
### Quick Start Guide sample milestone

- Created the first `/quick-start` route.
- Added `src/data/quickStartGuide.ts` to store guide content as structured TypeScript data.
- Created reusable components:
  - `BilingualPair.tsx`
  - `GuideSection.tsx`
- Built a sample bilingual guide layout with English and Traditional Chinese side by side.
- Fixed an error where the `GuideSection` component code was accidentally placed inside `src/app/quick-start/page.tsx`.
- Learned that route pages and reusable components should be kept separate.

Working route:

```text
http://localhost:3000/quick-start
```

### Theme update

- Applied the first Arydia-inspired dark parchment theme to the glossary page.
- Used warm parchment text, brass/gold headings, dark panel backgrounds, and bordered tag chips.
- Decided to keep the styling simple for now and polish later after more pages are built.

### Theme update

- Applied the first Arydia-inspired dark parchment theme to the glossary page.
- Used warm parchment text, brass/gold headings, dark panel backgrounds, and bordered tag chips.
- Decided to keep the styling simple for now and polish later after more pages are built.

### GitHub milestone:

- Connected the project to GitHub.
- Committed the move from `app/` to `src/app/`.
- Added the first glossary data and glossary page.
- Learned to use the basic Git workflow:

```powershell
git status
git add .
git commit -m "message"
git push
```
### Glossary milestone:
- Created `src/data/glossary.ts`.
- Added the first Arydia glossary terms.
- Decided to use these fields:
  - `id`  
  - `en`
  - `zh`
  - `description`
  - `tags`
- Kept `id` because it will help with editing, searching, and stable references later.
- Kept `tags` because they can support filtering and categories later.


First working route:

```text
http://localhost:3000/glossary
```


### Started project

Started the Arydia bilingual translation app project.

Main motivation:

- I want to play Arydia on iPad with English and Traditional Chinese side by side.
- I want accurate game-rule translation, not loose paraphrasing.
- I want a glossary-controlled workflow so key terms stay consistent.

Current project structure:

```text
src/
|-- app/
|   |-- page.tsx
|   |-- layout.tsx
|   |-- globals.css
|   `-- glossary/
|       `-- page.tsx
`-- data/
    `-- glossary.ts
```
