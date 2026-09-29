// Path 1 - TypeScript: the API, and your first trigger.
//
// What this file does, in one breath: load the data once, then answer
// questions OVER THE NETWORK - /counts, /open-by-team, /tickets?team=... -
// and once a minute, all by itself, check a rule and raise an alert.
// Your week-6 screen is here too, now fed by the API instead of the files.
//
// COPY THIS FILE INTO YOUR PROJECT's code/ folder - it needs your data/ and
// your node_modules next to it. From your project folder:
//     npm.cmd install    (only if you haven't already - the .cmd matters)
//     node code/path-typescript-api.mts      (needs Node 24 or newer)
// then open  http://localhost:8000  in your browser, and try:
//     http://localhost:8000/counts
//     http://localhost:8000/open-by-team
//     http://localhost:8000/tickets?team=TCS-ServiceDesk-L1-NA-WE
//     http://localhost:8000/alerts
// Stop it with Ctrl+C.

import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";
import { createServer, type ServerResponse } from "node:http";

// The shapes the API trades in. Write them down once and the checker keeps
// every route honest - misspell a field and the code won't even start.
type Row = Record<string, string>;
type TeamCount = { team: string; open: number };
type Alert = { team: string; open: number; rule: string; at: string };

const EXPECTED: Record<string, number> = {
  incident: 23334, change_request: 1969, sc_req_item: 17501,
  sc_task: 16321, change_approvals: 9942, ritm_approvals: 5379,
};

// Load everything ONCE, when the server starts.
const tables: Record<string, Row[]> = {};
for (const name of Object.keys(EXPECTED)) {
  tables[name] = parse(readFileSync(`data/${name}.csv`), { columns: true }) as Row[];
}

// ---- The questions the API can answer. Each one is just a function. ----
// An API is functions that answer over the network - T7A's functions,
// grown up. Add your own: write a function, add a route below.

const qCounts = (): Record<string, number> =>
  Object.fromEntries(Object.entries(tables).map(([n, rows]) => [n, rows.length]));

const openIncidents = (): Row[] =>
  tables.incident.filter((r) => r.State !== "Resolved" && r.State !== "Closed");

function qOpenByTeam(): TeamCount[] {
  // "Which teams carry the most open incidents?" - week 6's question.
  const byTeam: Record<string, number> = {};
  for (const r of openIncidents()) {
    byTeam[r["Assignment group"]] = (byTeam[r["Assignment group"]] ?? 0) + 1;
  }
  return Object.entries(byTeam)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([team, open]) => ({ team, open }));
}

function qTickets(team: string) {
  // "Show me MY team's open tickets" - the first filter a real user asks for.
  return openIncidents()
    .filter((r) => r["Assignment group"] === team)
    .slice(0, 25)
    .map((r) => ({
      number: r.Number, state: r.State,
      created: r.Created ?? "",
      short_description: r["Short description"] ?? "",
    }));
}

// ---- The trigger: code that runs on a clock, not on a click. ----
// Once a minute the server re-checks a rule. When the rule trips, an alert
// is recorded - nobody asked, it just noticed. Change the rule to watch
// what YOUR client actually worries about.

const ALERT_WHEN_OPEN_OVER = 40;
const alerts: Alert[] = [];

function checkAlertRule(): void {
  for (const row of qOpenByTeam()) {
    if (row.open > ALERT_WHEN_OPEN_OVER && !alerts.some((a) => a.team === row.team)) {
      const alert: Alert = {
        team: row.team, open: row.open,
        rule: `more than ${ALERT_WHEN_OPEN_OVER} open incidents`,
        at: new Date().toLocaleTimeString(),
      };
      alerts.push(alert);
      console.log(`ALERT  ${alert.at}  ${alert.team} has ${alert.open} open incidents`);
    }
  }
}

// ---- The screen, now fed by the API. ----
// Same page as week 6 - but look at the <script>: the numbers arrive by
// fetch() from /counts and /open-by-team. The screen no longer touches the
// files. THAT is the week: a layer in between.

const PAGE = `<!doctype html>
<html><head><meta charset="utf-8"><title>ServiceNow - fed by the API</title>
<style>
  body { font: 16px/1.5 system-ui, sans-serif; margin: 40px auto; max-width: 860px; color: #14202b; }
  h1 { margin-bottom: 4px; }  p.sub { color: #5b6b7a; margin-top: 0; }
  .cards { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0; }
  .card { border: 1px solid #d5dde5; border-radius: 10px; padding: 14px 18px; min-width: 140px; }
  .card b { display: block; font-size: 24px; }
  .card span { color: #5b6b7a; font-size: 13px; }
  table { border-collapse: collapse; width: 100%; }
  td, th { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e3e9ef; }
  td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
</style></head><body>
<h1>The client's tickets</h1>
<p class="sub">Same screen as week 6 - but every number below arrives through the API.</p>
<div class="cards" id="cards"></div>
<h2>Open incidents per team (top 10)</h2>
<table id="top"><tr><th>Team</th><th>Open</th></tr></table>
<script>
  fetch("/counts").then(r => r.json()).then(counts => {
    document.getElementById("cards").innerHTML = Object.entries(counts)
      .map(([name, n]) => "<div class='card'><b>" + n.toLocaleString() + "</b><span>" + name + "</span></div>")
      .join("");
  });
  fetch("/open-by-team").then(r => r.json()).then(rows => {
    document.getElementById("top").innerHTML += rows
      .map(r => "<tr><td>" + r.team + "</td><td>" + r.open + "</td></tr>").join("");
  });
</script>
</body></html>`;

const json = (res: ServerResponse, status: number, body: unknown): void => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

setInterval(checkAlertRule, 60 * 1000);
checkAlertRule();   // check once right away, so the first alert shows in seconds

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(PAGE);
  }
  if (url.pathname === "/counts") return json(res, 200, qCounts());
  if (url.pathname === "/open-by-team") return json(res, 200, qOpenByTeam());
  if (url.pathname === "/tickets") {
    const team = url.searchParams.get("team");
    if (!team) return json(res, 400, { error: "Say which team: /tickets?team=NAME" });
    return json(res, 200, qTickets(team));
  }
  if (url.pathname === "/alerts") return json(res, 200, alerts);
  return json(res, 404, { error: "No such endpoint. Try /counts, /open-by-team, /tickets?team=NAME, /alerts" });
}).listen(8000, "127.0.0.1", () => {
  console.log("Your API is at  http://localhost:8000  (Ctrl+C stops it)");
  console.log("Try /counts, /open-by-team, /tickets?team=..., /alerts");
});
