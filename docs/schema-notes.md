# Arydia Schema Notes

This document records public-safe database design notes for the Arydia bilingual database project.

Do not copy full rulebook text, full card text, story text, map text, scans, OCR output, or full translations into this file.

## Purpose

The rulebook translation workflow is also a schema discovery workflow. As rulebook sections are translated privately, this file records abstract design conclusions that can safely be committed to the public repository.

## Current design principles

- Keep public demo data separate from private translated content.
- Keep gameplay progress separate from card/rulebook content.
- Store real translated rulebook and card text only in ignored private files.
- Store public schema conclusions only as abstract notes.
- Prefer small, reviewable translation chunks.
- Keep English and Traditional Chinese side by side during review.
- Use translation statuses while drafting:
  - draft
  - reviewed
  - approved

## Candidate content layers

1. Public demo/reference data
2. Private translated content
3. Browser-local gameplay progress
4. Public-safe schema notes

## Questions to answer while translating the rulebook

- Which card types have state variants?
- Which card types are active/inactive deck based?
- Which card types should be treated as party inventory?
- Which card types contain dialogue options or topic prompts?
- Which card types contain map/location pointers?
- Which card types contain checks, rewards, or draw instructions?
- Which cards are safe to reveal before encounter?
- Which fields should be spoiler-protected?
- Which fields are safe metadata?
- Which parts of campaign state should eventually be tracked digitally?

## Early schema ideas

### Shared card fields

Potential shared fields:

- id
- code
- type
- state
- title
- subtitle
- text blocks
- tags
- glossary term links
- translation status
- spoiler visibility metadata

### Gameplay progress fields

Gameplay progress should remain separate from card content.

Potential progress fields:

- encountered card IDs
- active/inactive state if later needed
- party inventory card IDs if later needed
- campaign profile name if later needed

### Rulebook fields

Potential rulebook translation fields:

- section ID
- page number
- English heading
- Traditional Chinese heading
- paragraph/list blocks
- translation status
- schema notes derived from the section

