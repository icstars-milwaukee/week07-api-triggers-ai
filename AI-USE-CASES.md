# The AI Helper — the spec, in pencil

The RFP asks for a tool people can ask questions in plain words. This file is
where your team decides what that helper actually does — **before** anyone builds
it. Next week's classes grade this draft (T8A: SQL joins and aggregates, T8B: AI
fundamentals — what AI is genuinely good and bad at). Expect to cut a line.
That is what pencil is for.

Four sections, in order. Do not skip to section 3 — the order is the point.

---

## 1. What it answers

Every use case is ONE sentence, and every one names the endpoint that feeds it:

> "A user asks the AI **___**, and it answers **___** using **___**."

Steal the shape, not the words:

> "A project manager asks the AI *'where is ticket INC0012345?'*, and it answers
> with the ticket's state, team, and latest activity, using the incident table
> through `/tickets`."

| # | The question a user asks | What the AI answers | Which endpoint feeds it |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

**The honesty rule.** If your API cannot fetch the data a use case needs, the AI
cannot answer it. No endpoint, no use case — or better: go write the missing
endpoint. A use case with an empty third column is a wish, not a spec.

---

## 2. What it refuses

**At least two.** This is the half teams skip, and it is the half a reviewer
pushes on. An AI that answers everything is an AI that makes things up when it
runs out of facts — and your client cannot tell the difference until it costs
them something.

A refusal is also one sentence: the question, and what it says instead.

| A user asks… | …and it says this instead | Why it must not guess |
|---|---|---|
| | | |
| | | |

Starting points — pick the ones that are real for your client, do not just copy:

- A question about data you were never given ("who approved this budget?")
- A question that needs a number you cannot verify ("will this be fixed by Friday?")
- A question about one person's performance ("is Dana slow?")
- Anything where being wrong is worse than saying "I don't know"

---

## 3. The dry run — one of you plays the AI

Before you build anything, test the spec with a human. One teammate reads the
screen and the endpoint output; another asks questions like a project manager.
Nobody writes code. You are testing whether the spec **can** answer, not whether
your code does.

Write down what actually happened:

| The question asked | What the human-AI could answer from your data | Held up? |
|---|---|---|
| | | |
| | | |
| | | |

Any question your human could not answer from your real endpoints is a use case
to cut or an endpoint to go build. Mark which you chose.

---

## 4. The one you are least sure about

Which line in section 1 is most likely to get cut next week, and why?

> 

Naming your weakest idea out loud is a professional habit. It beats defending it
in front of the client on Friday.

---

**Never paste real ticket rows into an AI tool.** Describe table shapes and use
made-up IDs like INC0000001. The sample data built into
`code/frontend/index.html` is safe to share; the client's extract is not.
