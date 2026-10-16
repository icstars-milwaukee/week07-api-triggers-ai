// Path 1 - TypeScript: the API, and your first trigger.
//
// What this file does, in one breath: load the data once, then answer
// questions OVER THE NETWORK - /counts, /open-by-team, /tickets?team=... -
// and once a minute, all by itself, check a rule and raise an alert.
// Your screen is served from code/frontend/index.html, fed by the API.
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

// ---- The screen: a file you own, served by this API. ----
// The page itself now lives in  code/frontend/index.html  - a real frontend
// file you can open in an editor and in a browser. This server just hands it
// over. Open it: that is where week 7's front half lives - which form fits
// which question, one colour per series, labels that stay out of the data's
// way, and a table for the readers a chart does not reach.

const SCREEN = "code/frontend/index.html";

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
    // Read fresh on every request: edit the frontend file, refresh the
    // browser, see the change. No restart.
    return res.end(readFileSync(SCREEN));
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
