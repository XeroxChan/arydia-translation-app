# Arydia Translation Content Workflow

This app is a private fan/learning project for gameplay support.

Do not commit full copyrighted Arydia rulebook, guide, card, or story text into the public repository.

## Before adding a new guide section

1. Choose a small section only.
2. Check whether important game terms already exist in `src/data/glossary.ts`.
3. Add missing glossary terms before translating the section.
4. Translate with glossary consistency in mind.
5. Mark each guide item with the correct status:
   - `draft` for rough translation
   - `reviewed` for checked translation
   - `approved` for final gameplay-ready text

## Content rules

- Use placeholders when testing layout.
- Use only small reviewed excerpts when adding real content.
- Do not paste full pages from the rulebook or guide.
- Do not add scans, screenshots, or base64 images from copyrighted materials.
- Keep structured data in `src/data`.
- Keep reusable UI in `src/components`.
- Keep route pages in `src/app`.

## Review checklist

Before committing new guide content:

- Glossary terms are consistent.
- Traditional Chinese translation keeps the original rule meaning.
- Status labels are accurate.
- Search still finds English and Chinese text.
- `/quick-start` still renders correctly.
- `npm run lint` passes.