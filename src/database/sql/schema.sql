-- PostgreSQL Schema for Stock Control

CREATE TABLE inventory.stock_orders (
    order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    po_number TEXT UNIQUE NOT NULL, -- We generate this internally, so always available
    date_ordered TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Ensures correct order tracking
    supplier_id INT,
    eta DATERANGE, -- Native PostgreSQL range type for expected delivery range
    notes TEXT
);

-- Add FK constraint `on supplier_id`:

ALTER TABLE inventory.stock_orders
ADD CONSTRAINT stock_orders_supplier_id_fkey
FOREIGN KEY (supplier_id)
REFERENCES public.suppliers(supplier_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- FK Actions:
-- **On DELETE** of referenced row, the referencing row in `stock_order_details` is also deleted via **CASCADE**.

CREATE TABLE inventory.stock_order_details (
    detail_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES inventory.stock_orders(order_id) ON DELETE CASCADE,
    batch_code TEXT UNIQUE, -- Usually unknown at order time
    material_id INT NOT NULL,
    material_description TEXT NOT NULL,
    drum_quantity INT NOT NULL CHECK (drum_quantity > 0), -- Ensures valid input
    drum_weight NUMERIC(6,2) CHECK (drum_weight >= 0), -- kg, optional
    drum_volume NUMERIC(6,2), -- Will be calculated by trigger
    status TEXT CHECK (status IN ('en route', 'completed', 'overdue')) DEFAULT 'en route',
    notes TEXT
);

ALTER TABLE inventory.stock_order_details
ADD CONSTRAINT stock_order_details_material_id_fkey
FOREIGN KEY (material_id)
REFERENCES public.raw_materials(material_id)
ON DELETE SET NULL
ON UPDATE CASCADE;


-- Trigger Functions and Stored Procedures

-- Function to calculate volume from mass using density from raw_materials
CREATE OR REPLACE FUNCTION mass_to_volume(material_id INT, weight NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
    density NUMERIC;
BEGIN
    -- If weight is NULL, return default drum volume
    IF weight IS NULL THEN
        RETURN 200;
    END IF;
    
    -- Try to get density from raw_materials
    SELECT density INTO density 
    FROM public.raw_materials rm 
    WHERE rm.material_id = material_id;
    
    -- Calculate volume if density found
    IF FOUND THEN
        RETURN weight / density;
    ELSE
        -- Default if material not found
        RETURN 200;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update drum_volume when weight or material changes
CREATE OR REPLACE FUNCTION update_drum_volume()
RETURNS TRIGGER AS $$
BEGIN
    -- Keep existing drum_volume if provided
    IF NEW.drum_volume IS NOT NULL THEN
        -- Do nothing, keep the provided drum_volume
        RETURN NEW;
    END IF;
    
    -- Otherwise calculate drum_volume from weight
    NEW.drum_volume := mass_to_volume(NEW.material_id, NEW.drum_weight);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_drum_volume_trigger
BEFORE INSERT OR UPDATE OF material_id, drum_weight ON inventory.stock_order_details
FOR EACH ROW
EXECUTE FUNCTION update_drum_volume();

CREATE OR REPLACE FUNCTION set_material_description()
RETURNS TRIGGER AS $$
BEGIN
    NEW.material_description := (SELECT material_name FROM public.raw_materials rm WHERE rm.material_id = NEW.material_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_material_description_trigger
BEFORE INSERT OR UPDATE ON inventory.stock_order_details
FOR EACH ROW
EXECUTE FUNCTION set_material_description();


-- Later, change this to an intelligent prediction based on supplier lead times
CREATE OR REPLACE FUNCTION set_eta_range()
RETURNS TRIGGER AS $$
BEGIN
    NEW.eta := DATERANGE(NEW.date_ordered, NEW.date_ordered + INTERVAL '6 weeks');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_eta_range_trigger
BEFORE INSERT OR UPDATE ON inventory.stock_orders
FOR EACH ROW
EXECUTE FUNCTION set_eta_range();
