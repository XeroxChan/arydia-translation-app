# Development Log

## 2026-07-01

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
- Added Cards 卡牌 navigation to the header and homepage.

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
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── glossary/
│       └── page.tsx
└── data/
    └── glossary.ts
```