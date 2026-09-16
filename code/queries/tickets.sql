-- Show me MY team's open tickets - the first filter a real user asks for.
-- The ? is filled in from the web address: /tickets?team=NAME
SELECT Number AS number, State AS state, Created AS created,
       "Short description" AS short_description
FROM incident
WHERE State NOT IN ('Resolved', 'Closed') AND "Assignment group" = ?
LIMIT 25;
