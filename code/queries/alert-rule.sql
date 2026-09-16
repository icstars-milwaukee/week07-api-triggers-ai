-- The trigger's rule: any team over the line. The server runs this once a
-- minute, all by itself - change the rule to watch what YOUR client fears.
SELECT "Assignment group" AS team, COUNT(*) AS open
FROM incident
WHERE State NOT IN ('Resolved', 'Closed')
GROUP BY "Assignment group"
HAVING open > 40;
