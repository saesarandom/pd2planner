-- Clean up double-encoded crafted items
-- Run this AFTER deploying the fixed workers.js

-- 1. Check current data (you'll see double-encoded JSON if there's an issue)
SELECT id, user_id, craft_id, item_data FROM crafted_items;

-- 2. Delete all existing crafted items (they're corrupted with double-encoding)
-- Users will need to recreate them, but it's the cleanest fix
DELETE FROM crafted_items;

-- 3. Verify table is empty
SELECT COUNT(*) FROM crafted_items;

-- Now users can create fresh items with proper JSON encoding
