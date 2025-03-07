-- Create the stock_control schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS stock_control;

-- Create Materials table
CREATE TABLE stock_control.materials (
  material_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  chemical_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Drums table
CREATE TABLE stock_control.drums (
  drum_id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL,
  date_ordered TIMESTAMP NOT NULL,
  date_received TIMESTAMP NOT NULL,
  batch_code TEXT,
  po_number TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-stock', 'staged', 'loaded', 'repro')),
  scheduled BOOLEAN DEFAULT FALSE,
  reprocessed_from_drum_id INTEGER,
  volume_remaining DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Foreign keys
  CONSTRAINT fk_drums_material FOREIGN KEY (material_id) REFERENCES stock_control.materials(material_id),
  CONSTRAINT fk_drums_reprocessed FOREIGN KEY (reprocessed_from_drum_id) REFERENCES stock_control.drums(drum_id) ON DELETE SET NULL
);

-- Create indexes for Drums
CREATE INDEX idx_drums_status ON stock_control.drums(status);
CREATE INDEX idx_drums_material_id ON stock_control.drums(material_id);

-- Create Suppliers table
CREATE TABLE stock_control.suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Create Distillations table
CREATE TABLE stock_control.distillations (
  distillation_id SERIAL PRIMARY KEY,
  still_id INTEGER NOT NULL UNIQUE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_input_volume DECIMAL(10, 2) NOT NULL,
  expected_output_volume DECIMAL(10, 2) NOT NULL,
  actual_output_volume DECIMAL(10, 2) NOT NULL,
  loss_volume DECIMAL(10, 2) NOT NULL
);

-- Add a comment explaining how to use this script
COMMENT ON SCHEMA stock_control IS 'Schema for stock control management'; 