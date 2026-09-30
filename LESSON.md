# The TypeScript Path — Week 7 Lesson

> **Two spaces.** This lesson is the practice field - follow it here, break
> things here. The deliverable lives in **your team's project**: when a step
> works here, go make your project do it. Both count: your **practice branch**
> is Deliverable A (shows your team understands), the **milestone on main** is
> Deliverable B (shows your project does it). Friday, the project is what runs.

## Step 0 — The practice branch first

In **your team's project** folder, make this week's practice bench:

```
git switch main
git pull
git switch -c practice/week7
```

(`-c` means create: a new branch that starts as a copy of main.) Every step
of this lesson happens on it. This branch IS Deliverable A - push it as you
go, messy allowed. The polished version ships to `main` in Step 8.

## Step 1 — Bring the starter into your project

The API starter lives in this lesson repo at `code/path-typescript-api.mts`.
Copy that one file into **your project's** `code/` folder (drag it in File
Explorer, or from your project folder):

```
copy ..\week07-api-triggers-ai\code\path-typescript-api.mts code\
```

(This assumes you cloned the lesson next to your project. Any way the file
gets there is fine - it's yours now.)

## Step 2 — Run it

From your project folder (`npm.cmd install` first if this laptop never has;
Node 24+ runs TypeScript directly):

```
node code/path-typescript-api.mts
```

The terminal says the API is at http://localhost:8000 - and within a few
seconds it prints an ALERT line all by itself. That's the trigger; more on
it in Step 5. Open **http://localhost:8000** - your week-6 screen is back,
but read the small print: every number now arrives through the API.

## Step 3 — Meet your endpoints

Try each of these in the browser. This is your API's whole menu:

- `http://localhost:8000/counts` — the lie detector, as JSON
- `http://localhost:8000/open-by-team` — week 6's question, as JSON
- `http://localhost:8000/tickets?team=TCS-ServiceDesk-L1-NA-WE` — the first real filter
- `http://localhost:8000/tickets` — on purpose, wrong: read the error it
  answers with. A good API explains itself when you ask it badly.
- `http://localhost:8000/alerts` — what the trigger has noticed so far

That JSON format is data dressed for machines: your screen reads it, a
teammate's tool could read it, next week's AI helper will read it. The
class's cloud sandbox speaks the same way - its `/api/query` door answers
any browser or `fetch` with JSON, which is exactly what your week-8
dashboard will lean on.

## Step 4 — Read the code: an API is typed functions

Open `code/path-typescript-api.mts`. Find `qCounts`, `qOpenByTeam`,
`qTickets` - each endpoint is just a function (T7A's functions, grown up),
and the routing in `createServer` is a short list of "this address calls
this function." That's the entire trick. Now read the top of the file:
`type Row`, `type TeamCount`, `type Alert` - the shapes the API trades in,
written down once. Hover `qOpenByTeam` in VS Code: the editor tells you it
returns `TeamCount[]` because the label travels with the data.

## Step 5 — Make the trigger yours

Find `ALERT_WHEN_OPEN_OVER = 40`. That rule fired within seconds of
starting (the service desk carries 52). Now make it your team's rule:

1. Change the threshold, or better - write a different rule entirely
   (oldest unresolved ticket over N days? a team with zero movement?).
2. Restart the server (`Ctrl+C`, run again) and prove your rule fires -
   or prove it correctly stays quiet.
3. One sentence in the milestone: why would the client want to be told
   this without asking?

## Step 6 — Add an endpoint of your own

Your DEL-1009 had two questions your team wrote. Pick one and make it an
endpoint: write a function like `qOpenByTeam` (give its return value a
type - that's the habit), then add one route line in `createServer`.
Restart, open its address, and paste the JSON into the milestone. When the
number is wrong, read the function - you wrote it, you can trace it. That's
the debugging habit T7A is teaching this week.

## Step 7 — Draft the AI use cases

Copy `AI-USE-CASES.md` from this lesson into your project and fill it in as
a team - 3 to 5 one-sentence use cases, each naming the endpoint that would
feed it. It's a draft in pencil: next week's AI classes grade it, and cutting
a line then is success, not failure.

## Step 8 — Ship both deliverables

**Deliverable A — the practice branch.** You're on it. Push it:

```
git push -u origin practice/week7
```

Done. No PR, no review - practice is allowed to be messy. It just has to
exist, run, and show everyone's commits.

**Deliverable B — your project does it.** Promote the version that deserves
to ship:

```
git switch main
git switch -c api-work
git checkout practice/week7 -- code/
```

(That last line reads: "from the practice branch, take the code folder."
Promotion, not re-typing.)

1. Copy `DEL-1016-api-triggers-ai.md` and `AI-USE-CASES.md` from this
   lesson into your project and fill them in: endpoints with sample answers,
   the screen screenshot, the trigger's alert, the use cases.
2. Push the branch, open a Pull Request into `main`. A teammate who didn't
   write it pulls it, runs it, and checks the boxes.
3. Merged = the milestone sentence is true: your project answers over an
   API, reacts on its own, and knows what its AI will do.
