---
title: 'Cursor 0.50 changelog'
summary: 'Cursor 0.50 changelog for developers navigating through the AI era'
tags: ['AI']
date: '2025-05-18 19:00:00'
---

### We are going to be AI first

This was revealed by the CEO of Duolingo, one of my most frequently used apps, through a company-wide email. ([Link](https://www.linkedin.com/posts/duolingo_below-is-an-all-hands-email-from-our-activity-7322560534824865792-l9vh?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEKLTvsB-PmtVOClCaU8HcMHmXT-4d8leSw))
The company will transition to an "AI-first" organization, and AI utilization will be included in hiring and evaluation criteria.

When I first used AI tools that help me as a developer (github copilot, cursor, etc.), my feeling was literally "this can help me."

However, in just a few years, these tools have given me the feeling of "this can do work instead of me."
And for good reason - I just throw some context and a few lines of code, go to the bathroom, and come back to find it has implemented everything on its own..

While I'm not without fear that AI might replace me, more than that, **I want to become a better developer who is needed by my team by utilizing AI better**, so I plan to research with more interest than I currently do.

This post is a simple translation and understanding of the cursor 0.50 version changelog that my company started using as a paid service. Including myself, fellow developers are also going back and forth with cursor, oscillating between "it works well" vs "it's stupid," so I want to use it better.

- [Original Link - Cursor 0.50 changelog](https://www.cursor.com/changelog/0-50)
---

### Simpler, unified pricing

A unified pricing policy has been launched to prevent user confusion.
- All model usage is unified on a per-request basis. (request-based billing)
- Premium tool call and long context modes have been removed to simplify the pricing structure.

I didn't know about this since I haven't used max mode or long context mode, but previously there were different billing methods for each model, and additional costs were incurred depending on additional modes, making it difficult for users to accurately understand their usage and costs.
([Reddit user who lost $30 by having multiple "edit" requests classified as "premium-tool-call", "claude-3.7-sonnet-max" despite using Agent mode](https://www.reddit.com/r/ClaudeAI/comments/1jm4zo4/is_anyone_else_getting_overcharged_on_cursorai_i/?utm_source=chatgpt.com))

### Max Mode for all top models

> #### [Max Mode](https://docs.cursor.com/context/max-mode)
> - Enables use of all features of the latest AI models
> - The biggest difference from normal mode is that Max Mode is optimized to consider as much context as possible at once
> - Provides "larger Context Window (the range of context AI can refer to at once)", "200 tool calls", and "ability to read up to 750 lines of code"

Max Mode can now be used with all latest models.
Billing is based on the number of tokens used, and when new models are released, they will be immediately provided through Max Mode.
(This seems to indicate that the pipeline from model release → service integration with pricing policy is well established)

### New Tab model

A new Tab model that suggests changes across multiple files!
(The model that enables the feature where you press TAB to apply cursor's suggestions)
It enables refactoring, cascading modifications, multi-file editing, and movement between related code.

### Background Agent (preview)

Cursor agent can now operate in the background. (Settings > Beta > Background Agent)

This allows multiple agents to work in parallel and efficiently handle large-scale tasks. Each agent runs in an independent environment, reducing local resource burden. Also, you can monitor work status in real-time and intervene whenever necessary.

Although it's still a beta feature, the cursor team found it useful for bug fixes, investigations, and drafting (quite long) PRs.

### Include your entire codebase in context

You can add your entire codebase to the model's context using `@folders`.
(`Full folder contents` must be enabled)
However, if folders or files are too large, they may not be included.

### Refreshed Inline Edit (Cmd/Ctrl+K) with Agent integration

The UI for Inline Edit (asking and editing directly in code) has been redesigned, and new options have been added.

- full file edits (⌘⇧⏎)
  - Enables changes to entire files without using the agent
- sending to agent (⌘L)
  - Can send selected code blocks to the agent for additional work

### Fast edits for long files with Agent

The agent can now find and change only necessary parts without reading entire files, improving editing speed for long files.
Looking at the example video of editing Postgres codebase files, search & edit operations became almost twice as fast.
It will be applied to Anthropic models first, then gradually to other models.

This is a feature I'm personally curious about and think will be useful. When I request edits, it finds related code → finds related files → if importing libraries, it reviews those too... and often I don't get the answer I want. I should experience this once.

### Work in multiple codebases with workspaces

You can manage multiple codebases in one workspace (!) This can be effectively used when multiple projects are in different folders (!!) It even supports `.cursor/rules` added to each folder (!!!)
![omg](https://pbs.twimg.com/media/FFjWQ78WUAME5w-?format=jpg&name=large)

I often need to work on multiple codebases simultaneously and review modifications from various angles, and this is exactly the feature I need most. I haven't actively utilized `rules` yet, but I should quickly create them, test, and share with my team!!

### Working with Chat

Sharing in markdown format and duplicating existing chats is now possible.

Duplicating existing chats means it's now possible to keep the path of existing conversations intact while exploring different paths in new conversations. Like Doctor Strange examining all possible futures through the Time Stone.
![](https://static1.cbrimages.com/wordpress/wp-content/uploads/2018/05/Avengers-Infinity-War-Doctor-Strange-Time-Stone.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5)

---

What I thought was just a simple update note turned out to be very interesting and surprising as I read about how actual developers work being added as features. Of course, other IDEs are probably adding amazing features daily and competing, but I'm excited to see what features cursor will surprise us with in the future.

Side note #1) I need to quickly create `cursor/rules` for each project. There's significant time consumption every time I start a new conversation. It's like going on a blind date and introducing yourself for the first time..

Side note #2) The cursor blog is really well written. Of course, a blog with technically deep content would be difficult, but in the case of this changelog, it simply describes `what the changes are` in a plain manner, so it didn't take even two hours to read and understand the article.