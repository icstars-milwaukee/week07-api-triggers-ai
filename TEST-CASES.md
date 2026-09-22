# Test Cases — written first, run second

A test case is one check, written down BEFORE you run it. Pass or fail, no
vibes. Professionals test before the client sees it, so failures happen in
private, where they're cheap.

Last week you tested the data. This week you test **the promise** — an API is
a promise that asking a question a certain way gets you a certain answer. A
test case is how you check the promise holds, including when somebody asks it
something silly. Users will.

**The rule: at least 6 cases, at least 2 of them edge cases.** At least one
case must cover your trigger. Your QA leads this file; everyone contributes
cases and runs some.

Two examples to steal the shape from (then delete them and write your own):

| # | What we check | How we check it | We expect | Pass/Fail | What we actually saw |
|---|---|---|---|---|---|
| ex1 | `/counts` agrees with the database | Call the endpoint, then run the same count in SQL | The two numbers match exactly | | |
| ex2 | EDGE: filter matches nothing | Call `/tickets?team=zzzzzz` | An empty list and a normal response — not an error, not a crash | | |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |

**Case ideas** (write your own too): every endpoint answers at all · a
filtered endpoint returns only rows matching the filter · the numbers on the
screen match the numbers the API returned · the screen really is reading the
API — stop the server, refresh, and see what happens · your trigger fires when
its condition is met.

**Edge case ideas:** the trigger's condition *not* met — does it stay quiet, or
alert anyway? · a team name with `&` or an apostrophe in the URL · an endpoint
called with no parameters at all · a filter value in the wrong format (a word
where a number goes) · two requests fired back to back.

## The Trigger, Tested Both Ways

A trigger that always fires is a broken alarm. Prove it behaves in both
directions:

| | What we did | What happened |
|---|---|---|
| **Condition met** | | |
| **Condition not met** | | |

## Failures

Every FAIL either gets fixed (say what you changed) or goes here as a known
issue, owned out loud on Friday:

| Case # | Fixed or Known issue? | The story in one sentence |
|---|---|---|
| | | |
