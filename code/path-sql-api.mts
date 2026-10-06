// Path 3 - SQL: the API, and your first trigger.
//
// On this road YOUR work stays SQL. The files in code/queries/ are the API:
// each .sql file becomes an endpoint, and this ready-made server runs them
// for you. You don't edit this file to add an endpoint - you write SQL.
//
//   code/queries/counts.sql        ->  http://localhost:8000/q/counts
//   code/queries/open-by-team.sql  ->  http://localhost:8000/q/open-by-team
//   code/queries/tickets.sql       ->  http://localhost:8000/q/tickets?arg=TEAM
//   code/queries/alert-rule.sql    ->  the trigger's rule, checked every minute
//   anything-you-add.sql           ->  /q/anything-you-add   (instantly)
//
// COPY this file AND the queries/ folder into your project's code/. It needs
// your servicenow.db next to it (the one week 6's import built). Nothing to
// install - SQLite ships inside Node itself. From your project:
//     node code/path-sql-api.mts      (needs Node 24 or newer)
// then open  http://localhost:8000  in your browser. Stop it with Ctrl+C.

import { DatabaseSync } from "node:sqlite";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createServer, type ServerResponse } from "node:http";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DB = "servicenow.db";
const QUERIES = join(dirname(fileURLToPath(import.meta.url)), "queries");

type Alert = Record<string, unknown> & { rule: string; at: string };

function runQuery(name: string, args: string[] = []): Record<string, unknown>[] {
  // One .sql file in, rows out - as a list of {column: value} objects,
  // which is exactly what JSON wants to be.
  const sql = readFileSync(join(QUERIES, name + ".sql"), "utf8");
  const con = new DatabaseSync(DB, { readOnly: true });
  try {
    return con.prepare(sql).all(...args) as Record<string, unknown>[];
  } finally {
    con.close();
  }
}

// ---- The trigger: code that runs on a clock, not on a click. ----
// Once a minute the server runs alert-rule.sql. Any row it returns is a
// team over the line - recorded as an alert, nobody asked.

const alerts: Alert[] = [];

function checkAlertRule(): void {
  for (const row of runQuery("alert-rule")) {
    if (!alerts.some((a) => a.team === row.team)) {
      const alert: Alert = {
        ...row,
        rule: "alert-rule.sql matched",
        at: new Date().toLocaleTimeString(),
      };
      alerts.push(alert);
      console.log(`ALERT  ${alert.at}  ${row.team} has ${row.open} open incidents`);
    }
  }
}

// ---- The screen, now fed by the API. ----
// Same page as week 6's dashboard - but look at the <script>: the
// numbers arrive by fetch() from /q/counts and /q/open-by-team. The screen
// no longer touches the database. THAT is the week: a layer in between.

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
  fetch("/q/counts").then(r => r.json()).then(rows => {
    document.getElementById("cards").innerHTML = rows
      .map(r => "<div class='card'><b>" + r.rows.toLocaleString() + "</b><span>" + r.table + "</span></div>")
      .join("");
  });
  fetch("/q/open-by-team").then(r => r.json()).then(rows => {
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
  if (url.pathname === "/alerts") return json(res, 200, alerts);
  if (url.pathname.startsWith("/q/")) {
    const name = url.pathname.slice(3).replace(/\/+$/, "");
    if (!existsSync(join(QUERIES, name + ".sql"))) {
      const have = readdirSync(QUERIES)
        .filter((f) => f.endsWith(".sql"))
        .map((f) => f.replace(/\.sql$/, ""))
        .sort();
      return json(res, 404, { error: `No queries/${name}.sql. You have: ${have.join(", ")}` });
    }
    // A ? in the .sql is filled from ?arg=... in the address - and ONLY
    // this way. Gluing the value into the SQL text yourself is how
    // injection attacks happen; the ? keeps data and code separate.
    const args = url.searchParams.getAll("arg");
    try {
      return json(res, 200, runQuery(name, args));
    } catch (e) {
      return json(res, 400, { error: String((e as Error).message || e) });
    }
  }
  return json(res, 404, { error: "Try /q/counts, /q/open-by-team, /q/tickets?arg=TEAM, /alerts" });
}).listen(8000, "127.0.0.1", () => {
  console.log("Your API is at  http://localhost:8000  (Ctrl+C stops it)");
  console.log("Every .sql in code/queries/ is an endpoint: /q/<name>");
});
