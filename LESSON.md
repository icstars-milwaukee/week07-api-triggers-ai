# The SQL Path — Week 7 Lesson

> **Two spaces.** This lesson is the practice field - follow it here, break
> things here. The deliverable lives in **your team's project**: when a step
> works here, go make your project do it. Friday, the project is what runs.

## Step 0 — A work branch first

In **your team's project** folder (not this lesson's), make this week's branch —
one branch per deliverable, shared by whoever works on it:

```
git switch main
git pull
git switch -c api-work
```

(`-c` means create: a new branch that starts as a copy of main.)

## Step 1 — Bring the starter into your project

On this road your work stays SQL: every `.sql` file in a `queries/`
folder becomes an endpoint, and a ready-made server runs them for you.
Copy the server AND the queries folder from this lesson into **your
project's** `code/` folder (drag both in File Explorer, or from your
project folder):

```
copy ..\week07-api-triggers-ai\code\path-sql-api.py code\
xcopy ..\week07-api-triggers-ai\code\queries code\queries\ /E /I
```

You will not need to edit the server. Your API is the `.sql` files.

## Step 2 — Run it

Your project needs its `servicenow.db` (week 6's import built it - if it's
missing, re-run `sqlite3 servicenow.db < code/path-sql.sql`). Then:

```
python code/path-sql-api.py
```

(The server is Python, but it ships with Python itself - nothing to
install, and you never edit it.) The terminal says the API is at
http://localhost:8000 - and within a few seconds it prints an ALERT line
all by itself. That's `alert-rule.sql` firing; more in Step 5. Open
**http://localhost:8000** - your dashboard is back, but read the small
print: every number now arrives through the API.

## Step 3 — Meet your endpoints

Every file in `code/queries/` is an endpoint. Try each in the browser:

- `http://localhost:8000/q/counts` — counts.sql, answering as JSON
- `http://localhost:8000/q/open-by-team` — week 6's question
- `http://localhost:8000/q/tickets?arg=TCS-ServiceDesk-L1-NA-WE` — the
  `?` inside tickets.sql gets filled from the address. Only this way -
  gluing values into SQL text yourself is how injection attacks happen.
- `http://localhost:8000/q/nothing` — on purpose, wrong: the error lists
  every query you actually have. A good API explains itself.
- `http://localhost:8000/alerts` — what the trigger has noticed so far

## Step 4 — Read one query, see the whole trick

Open `code/queries/open-by-team.sql`. It's week 6's exact query - the only
new thing this week is WHERE it runs: behind an address, answering anyone
who asks. The API is your SQL, given a front door.

## Step 5 — Make the trigger yours

Open `code/queries/alert-rule.sql`. Any row it returns becomes an alert,
checked once a minute. Make it your team's rule:

1. Change the HAVING line, or write a different rule entirely (oldest
   unresolved ticket over N days? a team with zero movement?).
2. Restart the server (`Ctrl+C`, run again) and prove your rule fires -
   or prove it correctly stays quiet.
3. One sentence in the milestone: why would the client want to be told
   this without asking?

## Step 6 — Add an endpoint of your own

Your DEL-1009 had two questions your team wrote. Pick one, save it as
`code/queries/your-name-here.sql` - and it's already an endpoint at
`/q/your-name-here`. No server changes, ever. Keep the habits: a comment
saying what question it answers, readable aliases, LIMIT when you're just
looking. Paste its JSON into the milestone.

## Step 7 — Draft the AI use cases

Copy `AI-USE-CASES.md` from this lesson into your project and fill it in as
a team - 3 to 5 one-sentence use cases, each naming the endpoint that would
feed it. It's a draft in pencil: next week's AI classes grade it, and cutting
a line then is success, not failure.

## Step 8 — Ship it

1. Copy `MILESTONE-1016-api-triggers-ai.md` from this lesson into your
   project and fill it in: endpoints with sample answers, the screen
   screenshot, the trigger's alert, the use cases.
2. Push the branch, open a Pull Request into `main`. A teammate who didn't
   write it pulls it, runs it, and checks the boxes.
3. Merged = your project now answers over an API, reacts on its own, and
   knows what its AI will do. That's the milestone sentence, made true.
