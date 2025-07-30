---
title: 'Cursor 0.50 changelog'
summary: 'Cursor 0.50 changelog for developers in the AI era'
tags: ['AI']
date: '2025-05-18 19:00:00'
---

### We are going to be AI first

This is what the CEO of Duolingo, one of my favorite apps, announced in a company-wide email. The company will transition to an "AI-first" organization, and AI utilization will be included in hiring and evaluation criteria.

When I first used AI tools that help me as a developer (GitHub Copilot, Cursor, etc.), I felt like "they can really help me." However, in just a few years, these tools have made me feel like "they can do the work instead of me."

### Simpler, unified pricing

A unified pricing policy has been launched to prevent user confusion.
- All model usage is unified on a per-request basis (request-based billing)
- Max mode now uses token-based pricing
- Premium tool call and long context modes have been removed to simplify the pricing structure

### Max Mode for all top models

All latest AI models now support Max Mode. Billing is based on the number of tokens used, and new models will be immediately available through Max Mode when released.

### New Tab model

A new Tab model that suggests changes across multiple files! It enables refactoring, cascading modifications, multi-file edits, and navigation between related code.

### Background Agent (preview)

Cursor agents can now run in the background. This allows multiple agents to work in parallel and efficiently handle large-scale tasks.

### Include your entire codebase in context

You can add your entire codebase to the model's context using `@folders`.

### Refreshed Inline Edit with Agent integration

The Inline Edit UI has been redesigned with new options.

### Fast edits for long files with Agent

Agents can now find and modify only the necessary parts without reading the entire file, improving editing speed for long files.

### Work in multiple codebases with workspaces

You can manage multiple codebases in a single workspace. This is the feature I need most!

### Working with Chat

Sharing in markdown format and cloning existing chats is now possible.

---

I thought this was just a simple update note, but reading through it, I was amazed to see that actual developer workflows are being added as features. I'm excited to see what features Cursor will surprise us with in the future.