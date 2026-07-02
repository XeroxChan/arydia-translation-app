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


## Rulebook pass 1: Text Types and branching card text

Source focus: rulebook text-type and early card-type explanations.

### Schema conclusions

Cards and rulebook sections should not store all text as one undifferentiated field. Arydia uses different text roles, and those roles affect both gameplay and spoiler handling.

Recommended text block categories:

- narrative
- rules
- roleplay
- verbal
- actionDescription
- choice
- response
- nestedChoice
- nestedResponse
- townGuildAction
- fallbackChoice

### Branching cards

NPC and POI style cards likely need structured branching data.

Potential structure:

- front narrative
- visible choice prompts
- response sections keyed by choice
- fallback / any-other-topic response
- nested choices inside responses
- nested response sections
- checks inside responses
- rewards or draw instructions
- cleared / uncleared return behavior

### Event cards

Event cards may be more linear than NPC or POI interactions, but they still need separate block types.

Potential structure:

- title
- narrative blocks
- rules blocks
- optional prompt/choice blocks
- resolution instruction
- banish / return / clear behavior

### Translation implications

Translation status should be tracked per block, not only per whole card. A card may have reviewed title text but draft response text.

### Spoiler implications

Choice labels, titles, and response headings can be spoilers. Safe metadata should remain limited to card type, code, state, and encounter/progress status unless the card has been encountered or spoiler guard is disabled.


## Rulebook pass 2: Locations, pointers, and interactions

Source focus: location structure, map pointers, interact actions, NPC/POI interaction flow, and cleared/unexplored behavior.

### Schema conclusions

Locations are not single objects. A location may contain one or more map records, and each map may contain multiple typed pointers.

Potential map fields:

- id
- code
- state
- title
- narrationBlocks
- rulesBlocks
- pointerGroups
  - mapPointers
  - npcPointers
  - poiPointers
  - eventPointers
  - foePointers
  - chestPointers
  - stairsPointers

### Pointer records

Pointers should be structured rather than stored as plain text.

Potential pointer fields:

- pointerId
- pointerType
- targetCode
- targetType
- label
- locationOnMap
- encounterVisibility
- notes

### Interaction records

Interact actions should be modeled by target type.

Potential interaction types:

- poiInteraction
- eventTrigger
- npcConversation
- chestOpen

Each interaction type may need a different UI and different progress handling.

### NPC and POI records

NPC and POI records should support:

- code
- state
- title/name
- role or descriptor
- opening narrative
- topic choices
- response blocks
- fallback response
- nested choices
- checks
- rewards
- draw/update/banish instructions
- RP availability
- cleared condition

### Progress implications

Encountered and cleared are not identical.

Potential future progress fields:

- encounteredIds
- clearedIds
- claimedRpIds
- activeStateByBaseId
- partyInventoryIds
- banishedIds

For now, the app only tracks encountered card IDs in browser storage. Later, campaign profiles may need separate cleared and active-state tracking.

### Spoiler implications

Safe metadata can include card type, code, state, and encountered/cleared status. Pointer labels, NPC names, POI titles, choices, and responses may all be spoilers depending on context.

