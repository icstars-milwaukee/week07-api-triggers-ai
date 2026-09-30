# Week 7 — API, Triggers & AI (L7)

**Mission: give your data a front door, teach it to react, and draft its AI helper.**

## The Story So Far

Week 6 ended with data loaded and a first screen showing it. But that screen talks
straight to the files on one laptop. Real products put a layer in between — an **API** —
so any screen (yours, a teammate's, the client's) can ask the same questions and get
the same answers. And the RFP wants more than a window: it wants a tool that reacts
on its own and answers plain-language questions. That plumbing is this week.

## The System This Week

```
  WHAT COMES IN             WHAT WE DO                    WHAT GOES OUT
  ─────────────             ──────────                    ─────────────
  Loaded tables (W6)   ──►  Build the API:           ──►  Working API endpoints
  First screen (W6)         /counts /tickets /teams       First trigger working
  UI spec ideas             Add a trigger that reacts     AI use cases draft
                            Draft the AI helper           Screen now talks to API
```

Where this fits in the machine: **this is the wiring behind the wall.** Users never
see it — but every screen, alert, and AI answer runs through it.

## The Kit Is In This Repo

| Where | What |
|---|---|
| `code/path-typescript-api.mts` | TypeScript road: the API + trigger starter, ready to copy into your project |
| `code/path-sql-api.mts` + `code/queries/` | SQL road: your .sql files ARE the endpoints; the given server runs them |
| `AI-USE-CASES.md` | The pencil draft your team fills in |
| `TEST-CASES.md` | Write at least 6 API and trigger checks first, then run them - 2+ edge cases |
| `DEL-1016-api-triggers-ai.md` | The deliverable: what your project does by Friday |
| `REF-week7-workshop-deck.html` | Monday's workshop deck |

Pick your road's branch for the step-by-step walkthrough: `git switch path-typescript` · `path-sql`.

## What You Already Know (from class)

- Functions, errors & debugging (T7A, this week!) — an API is functions that answer
  over the network, and debugging them is the week's real sport
- Turning user stories into designs (T7B, this week!) — every endpoint exists to
  serve a user's question, not the other way round

Heads up: the AI classes (T8A/T8B) land **next week**. This week you *draft* what the
AI helper should do; next week's classes sharpen it before you build it into the
prototype. Draft in pencil.

## New Words & Ideas (the RFP-only stuff)

| Word | What it really means |
|------|---------------------|
| **API** | A menu of questions your data answers over the network: ask `/counts`, get counts back. |
| **Endpoint** | One item on that menu. `/tickets?team=ServiceDesk` is an endpoint with a filter. |
| **JSON** | The answer's format — data dressed for machines, readable by humans. |
| **Trigger** | Code that runs when something happens, not when someone clicks: "new export lands → counts refresh", "backlog passes 50 → flag it". |
| **AI use case** | One sentence: "A user asks the AI ___, and it answers ___ using ___ data." |

## Your AI Coworker This Week

**AI helps you (fluency):**
- Be the debug duck: *"My endpoint returns 500. Here's the error text and the shape of my code (no real data). Walk me through likely causes."*
- Design the menu: *"A project manager wants to know if her project is still being worked. What 3 endpoints would serve that?"*
- Pressure-test a trigger: *"When could 'alert when backlog > 50' fire wrongly or too often?"*

**AI is becoming the product (building):** your use cases draft defines what the
client's AI helper will do — e.g., *"Where is ticket INC0012345?"* answered in plain
words from your own API. Keep each use case honest: if your API can't answer it,
the AI can't either.

**You do (AI doesn't):**
- Write and debug the endpoints. When a number is wrong, *you* trace it.
- Decide what the trigger watches. It fires on *your* client's real pain, not a demo trick.

**Never:** real ticket data in AI chats — table shapes and fake IDs like INC0000001 only.

## What You Will Build

- [ ] **Three working endpoints** in your team's path — at minimum: counts,
      a filtered ticket list, and one question from your DEL-1009 queries
- [ ] **Your week-6 screen fed by the API** instead of reading files directly
- [ ] **One working trigger** — refresh, threshold alert, or a better one you propose
- [ ] **AI use cases draft** — 3–5 one-sentence use cases the API can actually serve

## You're Done When…

…a teammate on a *different* laptop can hit your endpoints and see the same numbers
your screen shows — and one thing in your system happens without anyone clicking.

## How This Connects

- **Next week (Week 8):** everything snaps together — UI + API + AI become the
  prototype, tested against written test cases and rehearsed for the Sprint 2 demo
  on **Friday 10/23**.
- The AI classes T8A/T8B arrive next week and grade your use-cases draft against
  what AI is actually good at.
