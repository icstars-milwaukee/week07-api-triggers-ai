# Path 3 - SQL: the API, and your first trigger.
#
# On this road YOUR work stays SQL. The files in code/queries/ are the API:
# each .sql file becomes an endpoint, and this ready-made server runs them
# for you. You don't edit this file to add an endpoint - you write SQL.
#
#   code/queries/counts.sql        ->  http://localhost:8000/q/counts
#   code/queries/open-by-team.sql  ->  http://localhost:8000/q/open-by-team
#   code/queries/tickets.sql       ->  http://localhost:8000/q/tickets?arg=TEAM
#   code/queries/alert-rule.sql    ->  the trigger's rule, checked every minute
#   anything-you-add.sql           ->  /q/anything-you-add   (instantly)
#
# COPY this file AND the queries/ folder into your project's code/. It needs
# your servicenow.db next to it (the one week 6's import built). Nothing to
# install - the server uses only what Python ships with. From your project:
#     python code/path-sql-api.py
# then open  http://localhost:8000  in your browser. Stop it with Ctrl+C.

import json
import sqlite3
import threading
import time
from datetime import datetime
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs

DB = "servicenow.db"
QUERIES = Path(__file__).parent / "queries"


def run_query(name, args=()):
    # One .sql file in, rows out - as a list of {column: value} dictionaries,
    # which is exactly what JSON wants to be.
    sql = (QUERIES / (name + ".sql")).read_text(encoding="utf-8")
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    try:
        rows = con.execute(sql, args).fetchall()
        return [dict(r) for r in rows]
    finally:
        con.close()


# ---- The trigger: code that runs on a clock, not on a click. ----
# Once a minute the server runs alert-rule.sql. Any row it returns is a
# team over the line - recorded as an alert, nobody asked.

alerts = []


def check_alert_rule():
    for row in run_query("alert-rule"):
        if not any(a["team"] == row["team"] for a in alerts):
            alert = {**row, "rule": "alert-rule.sql matched",
                     "at": datetime.now().strftime("%H:%M:%S")}
            alerts.append(alert)
            print(f"ALERT  {alert['at']}  {row['team']} has {row['open']} open incidents")


def trigger_loop():
    while True:
        check_alert_rule()
        time.sleep(60)


# ---- The screen, now fed by the API. ----
# Same page as week 6's dashboard.html - but look at the <script>: the
# numbers arrive by fetch() from /q/counts and /q/open-by-team. The screen
# no longer touches the database. THAT is the week: a layer in between.

PAGE = """<!doctype html>
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
</body></html>"""


class Api(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)
        qs = parse_qs(url.query)

        if url.path == "/":
            return self.reply(200, PAGE, "text/html")
        if url.path == "/alerts":
            return self.reply(200, json.dumps(alerts))
        if url.path.startswith("/q/"):
            name = url.path[3:].strip("/")
            if not (QUERIES / (name + ".sql")).exists():
                have = sorted(p.stem for p in QUERIES.glob("*.sql"))
                return self.reply(404, json.dumps(
                    {"error": f"No queries/{name}.sql. You have: {', '.join(have)}"}))
            # A ? in the .sql is filled from ?arg=... in the address - and ONLY
            # this way. Gluing the value into the SQL text yourself is how
            # injection attacks happen; the ? keeps data and code separate.
            args = tuple(qs.get("arg") or [])
            try:
                return self.reply(200, json.dumps(run_query(name, args)))
            except sqlite3.Error as e:
                return self.reply(400, json.dumps({"error": str(e)}))
        return self.reply(404, json.dumps({"error": "Try /q/counts, /q/open-by-team, /q/tickets?arg=TEAM, /alerts"}))

    def reply(self, status, body, ctype="application/json"):
        data = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", ctype + "; charset=utf-8")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *args):
        pass


threading.Thread(target=trigger_loop, daemon=True).start()
check_alert_rule()   # check once right away, so the first alert shows in seconds
print("Your API is at  http://localhost:8000  (Ctrl+C stops it)")
print("Every .sql in code/queries/ is an endpoint: /q/<name>")
HTTPServer(("127.0.0.1", 8000), Api).serve_forever()
