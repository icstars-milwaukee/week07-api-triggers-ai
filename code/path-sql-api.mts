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

// ---- The screen: a file you own, served by this API. ----
// The page itself now lives in  code/frontend/index.html  - a real frontend
// file you can open in an editor and in a browser. This server just hands it
// over. Open it: that is where week 7's front half lives - which form fits
// which question, one colour per series, labels that stay out of the data's
// way, and a table for the readers a chart does not reach.
//
// ONE EDIT FIRST: on this road the endpoints are /q/counts and /q/open-by-team,
// so switch the API line at the top of that file to the SQL road's. It is marked.

const SCREEN = join(dirname(fileURLToPath(import.meta.url)), "frontend", "index.html");

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
