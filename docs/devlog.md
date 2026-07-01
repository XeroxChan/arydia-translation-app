# Development Log

## 2026-07-01

Started the Arydia bilingual translation app project.

Main motivation:

- I want to play Arydia on iPad with English and Traditional Chinese side by side.
- I want accurate game-rule translation, not loose paraphrasing.
- I want a glossary-controlled workflow so key terms stay consistent.

Decisions made today:

- Use Next.js, TypeScript, and Tailwind CSS.
- Use structured data instead of one giant HTML file.
- Do not paste the full Claude-generated HTML into the app.
- Build the glossary page first.
- Build the Quick Start Guide page after the glossary works.
- Use GitHub to record the development journey and keep version history.
- Keep copyrighted Arydia text, scans, and full translations out of the public repository.

Problems encountered:

- Initial project inside OneDrive caused dependency / `node_modules` issues.
- Restarted the project in a cleaner folder:
  `C:\Users\User\arydia project`
- Accidentally had an extra `package.json`, `package-lock.json`, and `node_modules` directly inside:
  `C:\Users\User`
- Next.js detected the wrong workspace root because of those extra files.
- Moved the accidental Node project files into a backup folder.
- Manually created a `src` folder and moved the app structure into `src/app`.
- Gemini Code Assist created a `page.tsx` file in the wrong folder, so I learned to create route files manually when needed.
- Learned that a Next.js App Router page for `/glossary` must be placed at:
  `src/app/glossary/page.tsx`
- Encountered a corrupted Next.js dev cache / manifest error, fixed by deleting `.next` and restarting the dev server.

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

Glossary milestone:
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

GitHub milestone:

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


Next step:

- Build the first `/quick-start` sample page.
- Use structured data instead of one giant HTML file.
- Create reusable components for bilingual English / Traditional Chinese display.