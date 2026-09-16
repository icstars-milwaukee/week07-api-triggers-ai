# Path 1 - Python: the API, and your first trigger.
#
# What this file does, in one breath: load the data once, then answer
# questions OVER THE NETWORK - /counts, /open-by-team, /tickets?team=... -
# and once a minute, all by itself, check a rule and raise an alert.
# Your week-6 screen is here too, now fed by the API instead of the files.
#
# COPY THIS FILE INTO YOUR PROJECT's code/ folder - it needs your data/ next
# to it. Nothing to install. From your project folder:
#     python code/path-python-api.py
# then open  http://localhost:8000  in your browser, and try:
#     http://localhost:8000/counts
#     http://localhost:8000/open-by-team
#     http://localhost:8000/tickets?team=TCS-ServiceDesk-L1-NA-WE
#     http://localhost:8000/alerts
# Stop it with Ctrl+C.

import csv
import json
import threading
import time
from datetime import datetime
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

EXPECTED = {
    "incident": 23334, "change_request": 1969, "sc_req_item": 17501,
    "sc_task": 16321, "change_approvals": 9942, "ritm_approvals": 5379,
}

# Load everything ONCE, when the server starts.
tables = {}
for name in EXPECTED:
    with open(f"data/{name}.csv", newline="", encoding="utf-8") as f:
        tables[name] = list(csv.DictReader(f))


# ---- The questions the API can answer. Each one is just a function. ----
# An API is functions that answer over the network - T7A's functions,
# grown up. Add your own: write a function, add a route below.

def q_counts():
    # "Did the load tell the truth?" - the lie detector, as an endpoint.
    return {name: len(rows) for name, rows in tables.items()}


def open_incidents():
    return [r for r in tables["incident"] if r["State"] not in ("Resolved", "Closed")]


def q_open_by_team():
    # "Which teams carry the most open incidents?" - week 6's question.
    by_team = {}
    for r in open_incidents():
        team = r["Assignment group"]
        by_team[team] = by_team.get(team, 0) + 1
    ranked = sorted(by_team.items(), key=lambda kv: kv[1], reverse=True)
    return [{"team": t, "open": n} for t, n in ranked[:10]]


def q_tickets(team):
    # "Show me MY team's open tickets" - the first filter a real user asks for.
    mine = [r for r in open_incidents() if r["Assignment group"] == team]
    return [{"number": r["Number"], "state": r["State"],
             "created": r.get("Created", ""),
             "short_description": r.get("Short description", "")}
            for r in mine[:25]]


# ---- The trigger: code that runs on a clock, not on a click. ----
# Once a minute the server re-checks a rule. When the rule trips, an alert
# is recorded - nobody asked, it just noticed. Change the rule to watch
# what YOUR client actually worries about.

ALERT_WHEN_OPEN_OVER = 40
alerts = []


def check_alert_rule():
    for row in q_open_by_team():
        if row["open"] > ALERT_WHEN_OPEN_OVER:
            already = any(a["team"] == row["team"] for a in alerts)
            if not already:
                alert = {"team": row["team"], "open": row["open"],
                         "rule": f"more than {ALERT_WHEN_OPEN_OVER} open incidents",
                         "at": datetime.now().strftime("%H:%M:%S")}
                alerts.append(alert)
                print(f"ALERT  {alert['at']}  {alert['team']} has {alert['open']} open incidents")


def trigger_loop():
    while True:
        check_alert_rule()
        time.sleep(60)


# ---- The screen, now fed by the API. ----
# Same page as week 6 - but look at the <script>: the numbers arrive by
# fetch() from /counts and /open-by-team. The screen no longer touches the
# files. THAT is the week: a layer in between.

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
</body></html>"""


class Api(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)
        qs = parse_qs(url.query)

        if url.path == "/":
            return self.reply(200, PAGE, "text/html")
        if url.path == "/counts":
            return self.reply(200, json.dumps(q_counts()))
        if url.path == "/open-by-team":
            return self.reply(200, json.dumps(q_open_by_team()))
        if url.path == "/tickets":
            team = (qs.get("team") or [""])[0]
            if not team:
                return self.reply(400, json.dumps({"error": "Say which team: /tickets?team=NAME"}))
            return self.reply(200, json.dumps(q_tickets(team)))
        if url.path == "/alerts":
            return self.reply(200, json.dumps(alerts))
        return self.reply(404, json.dumps({"error": "No such endpoint. Try /counts, /open-by-team, /tickets?team=NAME, /alerts"}))

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
print("Try /counts, /open-by-team, /tickets?team=..., /alerts")
HTTPServer(("127.0.0.1", 8000), Api).serve_forever()
