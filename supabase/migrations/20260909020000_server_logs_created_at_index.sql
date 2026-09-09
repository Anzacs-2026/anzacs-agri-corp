-- Speed up the admin Logs page's "most recent N" query.
create index server_logs_created_at_idx on server_logs (created_at desc);
