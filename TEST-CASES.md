# Test Cases — written first, run second

A test case is one check, written down BEFORE you run it. Pass or fail, no vibes.
Professionals test before the client sees it, so failures happen in private,
where they are cheap.

Week 6 tested the data. This week you test two things:

- **The promise** — an API is a promise that asking a question a certain way gets
  you a certain answer, including when somebody asks it something silly. Users
  will.
- **The screen** — that the numbers a person reads off the chart are the numbers
  the API actually sent, and that the screen still works for someone who cannot
  use the chart.

**The rule: at least 6 cases, at least 2 of them edge cases.** At least two cases
must be about the screen, not just the endpoints. Your QA leads this file;
everyone contributes cases and runs some.

Two examples to steal the shape from (then delete them and write your own):

| # | What we check | How we check it | We expect | Pass/Fail | What we actually saw |
|---|---|---|---|---|---|
| ex1 | The chart agrees with the API | Read the top bar's value off the screen, then call `/open-by-team` and read the first row | The two numbers are identical | | |
| ex2 | EDGE: filter matches nothing | Call `/tickets?team=zzzzzz` | An empty list and a normal response — not an error, not a crash | | |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |

**Case ideas for the screen** (write your own too): the value at the tip of each
bar matches that bar's row in the table view · the table view opens and closes,
and shows the full team name the chart had to shorten · the longest team name
does not overflow or get clipped · the banner says "live" when the server is up
and "sample" when it is down · every tile has a label saying what the number is ·
the page is still readable at a narrow window width.

**Case ideas for the API:** every endpoint answers at all · a filtered endpoint
returns only rows matching the filter · the screen really is reading the API —
stop the server, refresh, and see what happens.

**Edge case ideas:** a team name with `&` or an apostrophe in the URL · an
endpoint called with no parameters at all · a filter value in the wrong format (a
word where a number goes) · a team with one open ticket (does the tiny bar still
draw, and is its label still readable?) · two requests fired back to back · the
API returns an empty list — does the chart draw nothing, or does it break?

## The AI Spec, Dry-Run

Not code — the dry run from `AI-USE-CASES.md` section 3. One line per use case:
could a human, holding only your real endpoint output, actually answer it?

| Use case # | Could it be answered from real data? | What you changed as a result |
|---|---|---|
| | | |
| | | |

## Stretch: The Trigger, Tested Both Ways

Only if you built the trigger. A trigger that always fires is a broken alarm, so
prove it behaves in both directions:

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
