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

Problems encountered:

- Initial project inside OneDrive caused dependency / node_modules issues.
- Restarted the project in a cleaner folder:
  `C:\Users\User\arydia project`

Next step:

- Create the glossary data file.
- Build the first `/glossary` page.