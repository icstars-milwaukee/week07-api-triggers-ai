-- The lie detector, as an endpoint: one row per table with its count.
SELECT 'incident' AS "table", COUNT(*) AS rows FROM incident
UNION ALL SELECT 'change_request', COUNT(*) FROM change_request
UNION ALL SELECT 'sc_req_item',    COUNT(*) FROM sc_req_item
UNION ALL SELECT 'sc_task',        COUNT(*) FROM sc_task
UNION ALL SELECT 'change_approvals', COUNT(*) FROM change_approvals
UNION ALL SELECT 'ritm_approvals',   COUNT(*) FROM ritm_approvals;
