# Week 7 — Friendly UI (L7)

**Mission: make the window so easy that nobody needs a manual.**

## The Story So Far

The data is loaded and queries work — for *you*. But our users are project managers and planners, not engineers. The RFP is clear: the solution must be **self-service** with **minimal technical background**. If a user needs help, we failed.

## The System This Week

```
  WHAT COMES IN             WHAT WE DO                    WHAT GOES OUT
  ─────────────             ──────────                    ─────────────
  Working queries      ──►  Design for real people:  ──►  Final solution design
  Sprint 1 feedback         who are they? what do          UI spec (labels, layout,
  Mockups (Week 3)          they need in 10 seconds?       words on every screen)
                            Kill the jargon                Updated sprint plan
```

Where this fits in the machine: **this is the control panel.** A great engine with confusing buttons is a bad machine.

## What You Already Know (from class)

- Turning user stories into designs (T7B, this week!)
- Functions, errors & debugging (T7A, this week!)

Class teaches design thinking. **This repo points it at our three real users.**

## New Words & Ideas (the RFP-only stuff)

| Word | What it really means |
|------|---------------------|
| **Self-service** | Users help themselves. No training class, no manual, no calling us. |
| **Persona** | A pretend-but-realistic user: "Pat the Project Manager checks her team's tickets every morning." |
| **Jargon** | Insider words that lock people out. `cmdb_ci` is jargon; "the thing that broke" is not. |
| **Accessibility** | Design that works for everyone — readable colors, clear labels, keyboard-friendly. |

## Your AI Coworker This Week

**AI helps you:**
- Play your persona: *"Act as a project manager who has never written a query. I'll describe our dashboard screen — tell me where you get confused."*
- Hunt jargon: *"Here are our screen labels. Flag anything a non-technical manager wouldn't instantly get, and suggest plainer words."*
- Brainstorm layouts: *"Three common ways to organize a ticket dashboard for scanning speed?" * — then *you* choose and say why.

**You do (AI doesn't):**
- Make the design decisions and write the UI spec. Your name is on the demo.
- Test with real humans — grab someone from another team and watch them try it.

**Never:** real client data in AI chats. Persona conversations use made-up ticket examples.

## What You Will Build

- [ ] **Personas** — 2–3 realistic users with names, jobs, and morning questions
- [ ] **Final solution design** — updated with Sprint 1 feedback
- [ ] **UI spec** — every screen's labels, filters, and words, jargon-free
- [ ] **Updated sprint plan** — what changed and why

## You're Done When…

…someone outside your team can look at your screen design and answer "which team has the most open tickets?" in under ten seconds, with no help from you.

## How This Connects

- **Builds on Week 6:** the queries become the numbers behind each screen.
- **Feeds into Week 8:** you build these screens for real, with filters and drill-down.
