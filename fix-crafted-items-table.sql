-- Fix Crafted Items Table
-- Run this in your Neon database SQL editor

-- 1. Check if table exists and see its structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'crafted_items'
ORDER BY ordinal_position;

-- 2. If table doesn't exist or has wrong schema, drop and recreate
DROP TABLE IF EXISTS crafted_items CASCADE;

CREATE TABLE crafted_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  craft_id VARCHAR(50) NOT NULL,
  item_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, craft_id)
);

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_crafted_items_user_id ON crafted_items(user_id);
CREATE INDEX IF NOT EXISTS idx_crafted_items_fullname ON crafted_items USING GIN ((item_data->>'fullName'));

-- 4. Verify table was created
SELECT * FROM crafted_items LIMIT 5;
