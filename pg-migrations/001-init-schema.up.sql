-- Create Traces table
CREATE TABLE IF NOT EXISTS traces (
  organisation_id UUID NOT NULL,
  project_id UUID NOT NULL,
  pipeline_id UUID NOT NULL,
  trace_id UUID NOT NULL,
  status TEXT NOT NULL,
  start_ts TIMESTAMP NOT NULL DEFAULT NOW(),
  end_ts TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organisation_id, project_id, pipeline_id, trace_id)
);

-- Create Trace_Nodes table
CREATE TABLE IF NOT EXISTS trace_nodes (
  organisation_id UUID NOT NULL,
  project_id UUID NOT NULL,
  pipeline_id UUID NOT NULL,
  trace_id UUID NOT NULL,
  node_id UUID NOT NULL,
  status TEXT NOT NULL,
  start_ts TIMESTAMP NOT NULL DEFAULT NOW(),
  end_ts TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organisation_id, project_id, pipeline_id, trace_id, node_id)
);

CREATE TABLE IF NOT EXISTS queue_log (
  processor TEXT,
  message_id TEXT,
  file_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (file_key, message_id)
);

CREATE INDEX idx_queue_status_created 
ON queue_log (processor, status, created_at);