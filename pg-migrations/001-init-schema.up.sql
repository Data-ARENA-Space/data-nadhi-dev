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