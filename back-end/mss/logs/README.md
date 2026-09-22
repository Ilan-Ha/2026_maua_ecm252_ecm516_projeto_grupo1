# Logs query MSS (NestJS)

Read-only API for the localhost logs console.

- `GET /logs?service=&level=&q=&from=&to=&cursor=&limit=`
- `GET /logs/:id`

Writes come from each service via shared Mongo `allforone_logs.app_logs`.
