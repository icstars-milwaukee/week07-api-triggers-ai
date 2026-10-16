# Week 7 — Frontend Data Visualization & AI (L7)

**Mission: turn your numbers into a screen people can read, and decide what your AI helper will do.**

> ### 🧭 New here, or not sure what to do next?
> **Open the guide: https://icstars-milwaukee.github.io/week07-api-triggers-ai/**
> One page: pick your road, three things to do right now, the boxes you hand in,
> and every file in this repo labelled with whether you touch it. Your ticks are saved.

## The Story So Far

Week 6 ended with the data loaded and a first screen showing it. That screen
works — for you. It is a wall of numbers, reading straight off the files on one
laptop.

The RFP does not ask for a wall of numbers. It asks for something a project
manager can read **without training**, and something she can ask questions of in
plain words. So this week has two halves, in this order:

1. **The screen becomes readable.** The right shape for each question, one
   colour, labels that say what the thing is, and a table for everyone a chart
   leaves behind.
2. **The AI helper gets decided.** On paper, in pencil, before anyone builds it —
   what it answers, what data feeds each answer, and what it must refuse.

Underneath both sits the **API**: the layer that hands your screen its numbers so
any screen — yours, a teammate's, the client's — gets the same answer.

## The System This Week

```
  WHAT COMES IN             WHAT WE DO                    WHAT GOES OUT
  ─────────────             ──────────                    ─────────────
  Loaded tables (W6)   ──►  Make the screen readable ──►  A screen people can read
  First screen (W6)         (form, colour, labels,        AI helper spec, in pencil
  User stories (T7B)         the table view)              3 endpoints feeding it
                            Decide what the AI does       Test cases, run
                            Serve it over an API
```

Where this fits in the machine: **this is the part people actually look at.** Every
week before this one was plumbing nobody sees.

## The Kit Is In This Repo

| Where | What |
|---|---|
| `code/frontend/index.html` | **The screen.** A real frontend file — open it, read it, change it. The chart, the tiles, the table view, and the four rules it follows |
| `code/path-typescript-api.mts` | TypeScript road: the API that feeds the screen (and serves it) |
| `code/path-sql-api.mts` + `code/queries/` | SQL road: your `.sql` files **are** the endpoints; the given server runs them |
| `AI-USE-CASES.md` | The AI helper spec: what it answers, what feeds it, what it refuses |
| `TEST-CASES.md` | Write at least 6 checks first, then run them — 2+ edge cases |
| `DEL-1016-api-triggers-ai.md` | The deliverable: what your project does by Friday |
| `REF-week7-workshop-deck.html` | Monday's workshop deck |

Pick your road's branch for the step-by-step walkthrough: `git switch path-typescript` · `path-sql`.

**`code/frontend/index.html` runs two ways.** Served by your API it shows the
client's real numbers. Double-clicked off disk, with no server running at all, it
draws from a made-up sample built into the file — same chart, same decisions,
no client data anywhere. A banner on the page always says which one you are
looking at. Learn the chart in the sample; demo with the API.

## What You Already Know (from class)

- **From Stories to Design (T7B, this week!)** — this is the week's backbone. A
  user story picks the chart: *"as a PM I need to know which team is drowning"*
  is a comparison across teams, so it is a bar chart, not a pie and not a table
  of 400 rows.
- **Functions, errors & debugging (T7A, this week!)** — the screen is functions
  (one draws tiles, one draws the chart, one draws the table), and the fetch that
  fails when your server is down is the debugging.
- **Portfolio Publishing & Professional Presence (T7C, this week)** — this screen
  is the first thing you have built this cycle that belongs in a portfolio. Treat
  it like it will be seen.

Heads up on the two things class has **not** taught yet:

- **APIs properly arrive in Week 9 (T9A).** The API is here because your screen
  needs a source, and the starter hands you a working one. You will wire it and
  read it; Week 9 is where it gets taught from the ground up.
- **The AI classes arrive next week** (T8A SQL Joins & Aggregates, T8B AI
  Fundamentals I). So the AI work this week is a **pencil draft** — next week's
  T8B grades it and you cut what AI cannot honestly do.

## New Words & Ideas (the RFP-only stuff)

| Word | What it really means |
|------|---------------------|
| **Form** | The shape you draw the data in. One number is a tile. A comparison is bars. The question picks the form, not your taste. |
| **Series** | One set of related numbers. One series gets one colour — bar length already says who is biggest, so shading by size says it twice. |
| **Table view** | The same numbers as plain text. Screen readers, colourblind readers, and anyone copying a figure all land here. The chart enhances; the table guarantees. |
| **API** | A menu of questions your data answers over the network: ask `/counts`, get counts back. |
| **Endpoint** | One item on that menu. `/tickets?team=ServiceDesk` is an endpoint with a filter. |
| **AI use case** | One sentence: "A user asks the AI ___, and it answers ___ using ___ data." |
| **Refusal** | What your AI says when it does not know. An AI with no refusals is a liar with good manners. |

## Your AI Coworker This Week

**AI helps you (fluency):**
- Critique the screen: *"Here is my dashboard layout in words. A project manager
  has ten seconds. What does she see first, and is that the most important thing?"*
- Be the debug duck: *"My chart draws but every bar is the same length. Here is
  the function (no real data). Where would you look first?"*
- Pressure-test your refusals: *"Here are three questions my AI helper answers.
  What is a question a user will definitely ask that it should refuse instead of
  guessing at?"*

**AI is becoming the product (building):** `AI-USE-CASES.md` is where your team
decides what the client's AI helper will do. Keep every line honest — if your API
cannot fetch the data a use case needs, the AI cannot answer it either.

**You do (AI doesn't):**
- Choose the form for each question, and be able to say why that one.
- Decide what the AI refuses. That is a judgement call about your client, and it
  is the part a reviewer will push on hardest.

**Never:** real ticket data in AI chats — table shapes and fake IDs like
INC0000001 only. The sample built into `code/frontend/index.html` is safe to
paste anywhere; the client's rows are not.

## What You Will Build

- [ ] **A screen someone can read in ten seconds** — the right form per question,
      one colour per series, labels on everything, and a working table view
- [ ] **AI helper spec, in pencil** — 3–5 use cases, the endpoint feeding each
      one, and at least 2 things it refuses
- [ ] **Three working endpoints** in your road's stack — at minimum counts, a
      filtered ticket list, and one question from your DEL-1009 queries
- [ ] **Your screen fed by the API** instead of reading the files directly
- [ ] **Test cases, run** — at least 6, at least 2 edge cases
- [ ] *Stretch:* **one working trigger** — something your system notices on its
      own, with nobody clicking. Take this on once the screen and the spec are done.

## You're Done When…

…someone from another team can open your screen, answer *"which team has the most
open tickets?"* in under ten seconds without you talking, and then read your AI
spec and tell you which use case is the weak one — because you already know which
one it is.

## How This Connects

- **Builds on Week 6:** the queries you wrote become the numbers behind each mark
  on the screen.
- **Next week (Week 8):** the filter and the drill-down go on top of this screen,
  T8B grades your AI spec, and the lot becomes the prototype you demo at **Sprint
  2 Presentations, Friday 10/23**.
