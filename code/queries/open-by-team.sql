-- Which teams carry the most open incidents? Week 6's question, now an endpoint.
SELECT "Assignment group" AS team, COUNT(*) AS open
FROM incident
WHERE State NOT IN ('Resolved', 'Closed')
GROUP BY "Assignment group"
ORDER BY open DESC
LIMIT 10;
