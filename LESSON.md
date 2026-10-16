# The TypeScript Path — Week 7 Lesson

> **Two spaces.** This lesson is the practice field - follow it here, break
> things here. The deliverable lives in **your team's project**: when a step
> works here, go make your project do it. Both count: your **practice branch**
> is Deliverable A (shows your team understands), the **milestone on main** is
> Deliverable B (shows your project does it). Friday, the project is what runs.

The week runs front to back: the **screen** first, the **AI spec** second, the
**API** underneath both. The trigger is a stretch goal at the end — it already
works in the starter, so making it yours is extra credit, not a gap.

## Step 0 — The practice branch first

In **your team's project** folder, make this week's practice bench:

```
git switch main
git pull
git switch -c practice/week7
```

(`-c` means create: a new branch that starts as a copy of main.) Every step
of this lesson happens on it. This branch IS Deliverable A - push it as you
go, messy allowed. The polished version ships to `main` in Step 10.

## Step 1 — Look at the screen before you run anything

Before any terminal: open `code/frontend/index.html` from this lesson by
**double-clicking it**. No server, no database, no API. It still draws - tiles,
a bar chart, a table - from a made-up sample built into the file, and an orange
banner at the top tells you so.

That banner matters. When this file is served by your API it turns green and
says "Live". **Nobody should ever demo sample numbers believing they are real**,
so the page says which it is, every single time.

Now read the comment block at the very top of that file. Four rules. You will be
asked about three of them on Friday.

## Step 2 — Bring the starter into your project

Two things to copy this week: the API starter **and** the screen.

```
copy ..\week07-api-triggers-ai\code\path-typescript-api.mts code\
xcopy ..\week07-api-triggers-ai\code\frontend code\frontend\ /E /I
```

(This assumes you cloned the lesson next to your project. Any way the files
get there is fine - they're yours now.)

## Step 3 — Run it

From your project folder (`npm.cmd install` first if this laptop never has;
Node 24+ runs TypeScript directly):

```
node code/path-typescript-api.mts
```

The terminal says the API is at http://localhost:8000. Open it: the same screen
you opened off disk in Step 1 — except the banner is now **green**, and the team
names are the client's real ones.

The server reads `code/frontend/index.html` fresh on every request. So: edit the
file, refresh the browser, see the change. **No restart.** That loop is how you
will work for the rest of the week.

Now prove where the numbers come from: stop the server (`Ctrl+C`) and refresh.
The banner goes orange and the sample comes back. That is your answer to "how do
you know it's the API talking?"

## Step 4 — Meet your endpoints

Try each of these in the browser. This is your API's whole menu:

- `http://localhost:8000/counts` — the lie detector, as JSON
- `http://localhost:8000/open-by-team` — week 6's question, as JSON
- `http://localhost:8000/tickets?team=TCS-ServiceDesk-L1-NA-WE` — the first real filter
- `http://localhost:8000/tickets` — on purpose, wrong: read the error it
  answers with. A good API explains itself when you ask it badly.
- `http://localhost:8000/alerts` — what the trigger has noticed so far

That JSON format is data dressed for machines: your screen reads it, a
teammate's tool could read it, next week's AI helper will read it.

Then check one number by hand: read the top bar's value off the screen, and
compare it with the first row of `/open-by-team`. They must be identical. That
is a test case, and it goes in `TEST-CASES.md`.

## Step 5 — Make the screen readable, and make it yours

This is the week's main event. Open `code/frontend/index.html` and work through
the three decisions.

**1. The question picks the form.** Every mark on the screen exists to answer one
question. "How many incidents are there?" is one number — that is a tile, not a
one-bar chart. "Which team carries the most?" is a comparison — that is bars, and
sideways, because team names are long. "Show me every ticket" is 400 rows — that
is a table, and no chart at all is the right answer.

**2. One series, one colour.** Every bar is the same blue. The temptation is to
shade the big ones darker; resist it. Bar length already says who is biggest, so
colouring by size says it twice — and spends the one channel you still need next
week, when colour has to mean *"this one is filtered."* Colour means **which
thing is this**. Length means **how big is it**.

**3. Somebody cannot read your chart.** About one man in twelve cannot reliably
tell your colours apart; somebody is on a phone in the sun; somebody uses a
screen reader. They all need the table view — the same numbers as plain text,
full team names, nothing shortened. The chart enhances; the table guarantees.
Which is why **a number that exists only in a tooltip does not exist.**

Now break it on purpose. Change one thing, refresh, see what it teaches:

| Change this | And learn |
|---|---|
| `BAR_H` from 20 to 60 | why bars are capped — thick blocks read loud and childish |
| `--series-1` to a pale yellow | why a colour has to earn its contrast against the surface |
| `short(r.team)` to `r.team` | what a label does when nobody measured it first |
| delete the `.val` text line | how much the axis alone can carry — and where it stops |

Then make it your project's: add one more thing to the screen that answers a
question from your DEL-1009, and be ready to say why you chose that form.

## Step 6 — Read the code: an API is typed functions

Open `code/path-typescript-api.mts`. Find `qCounts`, `qOpenByTeam`, `qTickets` -
each endpoint is just a function (T7A's functions, grown up), and the routing in
`createServer` is a short list of "this address calls this function." That's the
entire trick. Now read the top of the file: `type Row`, `type TeamCount`,
`type Alert` - the shapes the API trades in, written down once. Hover
`qOpenByTeam` in VS Code: the editor tells you it returns `TeamCount[]` because
the label travels with the data.

Heads up: APIs get taught properly in **T9A, Week 9**. This week you wire one and
read it. You are not behind.

## Step 7 — Add an endpoint of your own

Your DEL-1009 had two questions your team wrote. Pick one and make it an
endpoint: write a function like `qOpenByTeam` (give its return value a type -
that's the habit), then add one route line in `createServer`. Restart, open its
address, and paste the JSON into the milestone. When the number is wrong, read
the function - you wrote it, you can trace it. That's the debugging habit T7A is
teaching this week.

## Step 8 — Write the AI spec

Copy `AI-USE-CASES.md` from this lesson into your project and fill in **all four
sections** as a team. Not just the first one — the first one is the easy half.

1. **What it answers** — 3 to 5 one-sentence use cases, each naming the endpoint
   that feeds it. No endpoint, no use case: if your API can't fetch it, the AI
   can't answer it, it can only make something up that sounds right.
2. **What it refuses** — at least two. "Will this be fixed by Friday?" has no
   answer in your data. An AI that answers everything is a liar with good
   manners, and the client won't find out until it has cost them something.
3. **The dry run** — before any code: one teammate holds the endpoint output and
   the screen, another asks questions like a project manager. Nobody types. Any
   question the human can't answer is a use case to cut or an endpoint to go
   build. Write down which you chose.
4. **Your weakest line** — name it yourself. It beats defending it on Friday.

It's a draft in pencil: **T8B next week grades it**, and cutting a line then is
success, not failure.

## Step 9 — Stretch: make the trigger yours

Only once Steps 5 and 8 are done. The starter already ships a working trigger -
that ALERT line that printed by itself. Find `ALERT_WHEN_OPEN_OVER = 40`. To make
it your team's rule:

1. Change the threshold, or better - write a different rule entirely
   (oldest unresolved ticket over N days? a team with zero movement?).
2. Restart the server (`Ctrl+C`, run again) and prove your rule fires -
   **and** prove it correctly stays quiet when it shouldn't fire. A trigger that
   always fires is a broken alarm.
3. One sentence in the milestone: why would the client want to be told
   this without asking?

## Step 10 — Ship both deliverables

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
git switch -c screen-and-ai
git checkout practice/week7 -- code/
```

(That last line reads: "from the practice branch, take the code folder."
Promotion, not re-typing. It brings `code/frontend/` along with the server.)

1. Copy `DEL-1016-api-triggers-ai.md` and `AI-USE-CASES.md` from this
   lesson into your project and fill them in: the screen screenshot with the
   form you chose per question, the AI spec's four sections, the endpoints with
   sample answers, the stop-the-server proof, and your test cases.
2. Push the branch, open a Pull Request into `main`. A teammate who didn't
   write it pulls it, runs it, reads one number off the chart and checks it
   against the endpoint, then checks the boxes.
3. Merged = the milestone sentence is true: your project has a screen people
   can read, a written spec for its AI helper, and an API feeding both.
