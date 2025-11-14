// Cloudflare Worker for PD2 Planner Auth & Database

import { neon } from '@neondatabase/serverless';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Generate random 32-char token for sessions
function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Generate random 6-char hash
function generateHash() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < 6; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

// Simple password hashing (in production, use bcrypt or similar)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Extract token from Authorization header and validate it
async function getUserIdFromToken(authHeader, sql) {
  if (!authHeader) return null;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const result = await sql`
      SELECT user_id FROM session_tokens
      WHERE token = ${token} AND expires_at > NOW()
    `;
    return result.length > 0 ? result[0].user_id : null;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

// Check all possible achievements (conditions hidden from client)
async function checkAllAchievements(userId, characterData, sql) {
  const newlyUnlocked = [];
  const level = parseInt(characterData?.character?.level ?? 0, 10); // Use optional chaining and default value
  const charms = characterData?.charms || []; // Use optional chaining and default value

  const existing = await sql`
    SELECT achievement_id FROM achievements WHERE user_id = ${userId}
  `;
  const existingIds = new Set(existing.map(a => a.achievement_id));

  // Fresh Start: Reach level 99
  if (level === 99 && !existingIds.has('fresh_start')) {
    try {
      await sql`
        INSERT INTO achievements (user_id, achievement_id, achievement_data)
        VALUES (${userId}, 'fresh_start', ${JSON.stringify({ level: 99, earnedAt: new Date().toISOString() })})
      `;
      newlyUnlocked.push({
        id: 'fresh_start',
        name: 'Fresh Start',
        description: 'Reach level 99'
      });
    } catch (e) {
      console.error('Error awarding fresh_start:', e);
    }
  }

  // Charm Collector: Fill entire charm inventory (20 slots)
  if (Array.isArray(charms) && charms.length >= 20 && !existingIds.has('charm_collector')) {
    try {
      await sql`
        INSERT INTO achievements (user_id, achievement_id, achievement_data)
        VALUES (${userId}, 'charm_collector', ${JSON.stringify({ charms: charms.length, earnedAt: new Date().toISOString() })})
      `;
      newlyUnlocked.push({
        id: 'charm_collector',
        name: 'Charm Collector',
        description: 'Fill your entire charm inventory'
      });
    } catch (e) {
      console.error('Error awarding charm_collector:', e);
    }
  }

  // Resistance: All resistances at 75%+
  if (characterData?.resistances && // Use optional chaining
      characterData.resistances.fire >= 75 &&
      characterData.resistances.cold >= 75 &&
      characterData.resistances.lightning >= 75 &&
      characterData.resistances.poison >= 75 &&
      !existingIds.has('resistance')) {
    try {
      await sql`
        INSERT INTO achievements (user_id, achievement_id, achievement_data)
        VALUES (${userId}, 'resistance', ${JSON.stringify({
          fire: characterData.resistances.fire,
          cold: characterData.resistances.cold,
          lightning: characterData.resistances.lightning,
          poison: characterData.resistances.poison,
          earnedAt: new Date().toISOString()
        })})
      `;
      newlyUnlocked.push({
        id: 'resistance',
        name: 'Resistance',
        description: 'Reach 75% resistance to all elements'
      });
    } catch (e) {
      console.error('Error awarding resistance:', e);
    }
  }

  return newlyUnlocked;
}

// Legacy wrapper
async function checkAndAwardAchievements(userId, characterData, sql) {
  try {
    return await checkAllAchievements(userId, characterData, sql);
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

// ===== CRAFTED ITEMS ENDPOINTS =====

async function getCraftedItems(sql, userId) {
  try {
    console.log('Fetching crafted items for user:', userId);
    const result = await sql`
      SELECT item_data FROM crafted_items WHERE user_id = ${userId} ORDER BY created_at
    `;
    console.log('Found', result.length, 'crafted items');
    // item_data is JSONB - already parsed by neon
    const craftedItems = result.map(row => row.item_data);
    return new Response(JSON.stringify({ craftedItems }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching crafted items:', error);
    console.error('Error details:', error.message);
    return new Response(JSON.stringify({
      error: 'Failed to fetch crafted items',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function createCraftedItem(request, sql, userId) {
  try {
    const itemData = await request.json();
    console.log('Creating crafted item for user:', userId, 'item:', itemData.fullName);

    if (!itemData?.id || !itemData?.fullName) {
      console.error('Invalid item data:', itemData);
      return new Response(JSON.stringify({ error: 'Invalid item data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user already has an item with this name
    try {
      const existing = await sql`
        SELECT id FROM crafted_items
        WHERE user_id = ${userId}
        AND item_data->>'fullName' = ${itemData.fullName}
      `;

      if (existing.length > 0) {
        console.log('Duplicate item name:', itemData.fullName);
        return new Response(JSON.stringify({
          error: `You already have an item named "${itemData.fullName}". Please use a different name or delete the old item from the list below.`
        }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (checkError) {
      console.error('Error checking for existing item:', checkError);
      // Continue anyway - might be first item or table schema issue
    }

    // Insert the item (item_data is JSONB - neon handles conversion automatically)
    const result = await sql`
      INSERT INTO crafted_items (user_id, craft_id, item_data, created_at, updated_at)
      VALUES (${userId}, ${itemData.id}, ${sql.json(itemData)}, NOW(), NOW())
      RETURNING id, craft_id, item_data
    `;

    console.log('Successfully created crafted item:', result[0].craft_id);
    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating crafted item:', error);
    console.error('Error details:', error.message, error.stack);
    return new Response(JSON.stringify({
      error: 'Failed to create crafted item',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function deleteCraftedItem(sql, userId, craftId) {
  try {
    const checkOwnership = await sql`
      SELECT id FROM crafted_items WHERE craft_id = ${craftId} AND user_id = ${userId}
    `;

    if (checkOwnership.length === 0) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await sql`
      DELETE FROM crafted_items WHERE craft_id = ${craftId} AND user_id = ${userId}
    `;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting crafted item:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete crafted item' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleRequest(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!env.DATABASE_URL) {
    return new Response(JSON.stringify({ error: 'DATABASE_URL not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const sql = neon(env.DATABASE_URL);
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    const authHeader = request.headers.get('Authorization');
    const userIdParam = url.searchParams.get('userId');

    // Register
    if (path === '/api/register' && request.method === 'POST') {
      const { username, password, email } = await request.json();

      if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Username and password required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const passwordHash = await hashPassword(password);

      try {
        const result = await sql`
          INSERT INTO users (username, password_hash, email)
          VALUES (${username}, ${passwordHash}, ${email || null})
          RETURNING id, username, created_at
        `;

        await sql`
          INSERT INTO user_settings (user_id, dark_mode)
          VALUES (${result[0].id}, true)
        `;

        const token = generateToken();
        const userId = result[0].id;

        await sql`
          INSERT INTO session_tokens (user_id, token, expires_at)
          VALUES (${userId}, ${token}, NOW() + INTERVAL '30 days')
        `;

        return new Response(JSON.stringify({
          success: true,
          user: result[0],
          token: token
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        if (e.message.includes('unique')) {
          return new Response(JSON.stringify({ error: 'Username already exists' }), {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        throw e;
      }
    }

    // Login
    if (path === '/api/login' && request.method === 'POST') {
      const { username, password } = await request.json();
      const passwordHash = await hashPassword(password);

      const result = await sql`
        UPDATE users
        SET last_login = CURRENT_TIMESTAMP
        WHERE username = ${username} AND password_hash = ${passwordHash}
        RETURNING id, username, email, created_at
      `;

      if (result.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const token = generateToken();
      const userId = result[0].id;

      await sql`
        DELETE FROM session_tokens WHERE user_id = ${userId}
      `;

      await sql`
        INSERT INTO session_tokens (user_id, token, expires_at)
        VALUES (${userId}, ${token}, NOW() + INTERVAL '30 days')
      `;

      return new Response(JSON.stringify({
        success: true,
        user: result[0],
        token: token
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check character state and award achievements
    if (path === '/api/check-state' && request.method === 'POST') {
      const { userId, token, characterData } = await request.json();

      if (!userId || !token || !characterData) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const tokenCheck = await sql`
        SELECT user_id FROM session_tokens
        WHERE user_id = ${userId} AND token = ${token} AND expires_at > NOW()
      `;

      if (tokenCheck.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const newAchievements = await checkAllAchievements(userId, characterData, sql);

      return new Response(JSON.stringify({
        success: true,
        newAchievements: newAchievements
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Save character
    if (path === '/api/characters/save' && request.method === 'POST') {
      const { userId, characterName, characterData } = await request.json();

      if (!userId || !characterName || !characterData) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const buildId = characterName + generateHash();

      const result = await sql`
        INSERT INTO characters (user_id, build_id, character_name, character_data)
        VALUES (${userId}, ${buildId}, ${characterName}, ${JSON.stringify(characterData)})
        RETURNING id, build_id, character_name, created_at
      `;

      const newAchievements = await checkAndAwardAchievements(userId, characterData, sql);

      const underCloudsCheck = await sql`
        SELECT id FROM achievements WHERE user_id = ${userId} AND achievement_id = 'under_clouds'
      `;
      if (underCloudsCheck.length === 0) {
        try {
          await sql`
            INSERT INTO achievements (user_id, achievement_id, achievement_data)
            VALUES (${userId}, 'under_clouds', ${JSON.stringify({ saved: true, earnedAt: new Date().toISOString() })})
          `;
          newAchievements.push({
            id: 'under_clouds',
            name: 'Under Clouds',
            description: 'Save your first build'
          });
        } catch (e) {
          console.error('Error awarding under_clouds:', e);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        character: result[0],
        newAchievements: newAchievements
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's characters
    if (path === '/api/characters' && request.method === 'GET') {
      const userId = url.searchParams.get('userId');

      const characters = await sql`
        SELECT id, build_id, character_name, character_data, views, created_at, updated_at
        FROM characters
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
      `;

      return new Response(JSON.stringify({ characters }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get public build by buildId
    if (path.startsWith('/api/build/') && request.method === 'GET') {
      const buildId = path.split('/api/build/')[1];

      const result = await sql`
        UPDATE characters
        SET views = views + 1
        WHERE build_id = ${buildId} AND is_public = true
        RETURNING id, build_id, character_name, character_data, views, created_at
      `;

      if (result.length === 0) {
        return new Response(JSON.stringify({ error: 'Build not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ build: result[0] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update character
    if (path === '/api/characters/update' && request.method === 'PUT') {
      const { userId, buildId, characterData } = await request.json();

      const result = await sql`
        UPDATE characters
        SET character_data = ${JSON.stringify(characterData)}, updated_at = CURRENT_TIMESTAMP
        WHERE build_id = ${buildId} AND user_id = ${userId}
        RETURNING id, build_id, character_name, updated_at
      `;

      if (result.length === 0) {
        return new Response(JSON.stringify({ error: 'Character not found or unauthorized' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, character: result[0] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Delete character
    if (path === '/api/characters/delete' && request.method === 'DELETE') {
      const { userId, buildId } = await request.json();

      const result = await sql`
        DELETE FROM characters
        WHERE build_id = ${buildId} AND user_id = ${userId}
        RETURNING id
      `;

      if (result.length === 0) {
        return new Response(JSON.stringify({ error: 'Character not found or unauthorized' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get/Update user settings
    if (path === '/api/settings' && request.method === 'GET') {
      const userId = url.searchParams.get('userId');

      const result = await sql`
        SELECT dark_mode, settings
        FROM user_settings
        WHERE user_id = ${userId}
      `;

      return new Response(JSON.stringify({ settings: result[0] || {} }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/settings' && request.method === 'PUT') {
      const { userId, darkMode, settings } = await request.json();

      await sql`
        INSERT INTO user_settings (user_id, dark_mode, settings)
        VALUES (${userId}, ${darkMode}, ${JSON.stringify(settings || {})})
        ON CONFLICT (user_id)
        DO UPDATE SET
          dark_mode = ${darkMode},
          settings = ${JSON.stringify(settings || {})},
          updated_at = CURRENT_TIMESTAMP
      `;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Unlock achievement
    if (path === '/api/achievements/unlock' && request.method === 'POST') {
      const { userId, token, achievementId, achievementData } = await request.json();

      if (!token) {
        return new Response(JSON.stringify({ error: 'Token required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const tokenResult = await sql`
        SELECT user_id FROM session_tokens
        WHERE user_id = ${userId} AND token = ${token} AND expires_at > NOW()
      `;

      if (tokenResult.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      try {
        await sql`
          INSERT INTO achievements (user_id, achievement_id, achievement_data)
          VALUES (${userId}, ${achievementId}, ${JSON.stringify(achievementData || {})})
          ON CONFLICT (user_id, achievement_id) DO NOTHING
        `;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to unlock achievement' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Get user achievements
    if (path === '/api/achievements' && request.method === 'GET') {
      const userId = url.searchParams.get('userId');

      const achievements = await sql`
        SELECT achievement_id, achievement_data, unlocked_at
        FROM achievements
        WHERE user_id = ${userId}
        ORDER BY unlocked_at DESC
      `;

      return new Response(JSON.stringify({ achievements }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ===== CRAFTED ITEMS ENDPOINTS =====

    // GET /api/crafted-items
    if (path === '/api/crafted-items' && request.method === 'GET') {
      const userId = await getUserIdFromToken(authHeader, sql);
      if (!userId) {
        return new Response(JSON.stringify({ error: 'userId required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return await getCraftedItems(sql, userId);
    }

    // POST /api/crafted-items
    if (path === '/api/crafted-items' && request.method === 'POST') {
      const userId = await getUserIdFromToken(authHeader, sql);
      if (!userId) {
        return new Response(JSON.stringify({ error: 'userId required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return await createCraftedItem(request, sql, userId);
    }

    // DELETE /api/crafted-items/:craftId
    if (path.startsWith('/api/crafted-items/') && request.method === 'DELETE') {
      const userId = await getUserIdFromToken(authHeader, sql);
      if (!userId) {
        return new Response(JSON.stringify({ error: 'userId required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      const craftId = path.split('/api/crafted-items/')[1];
      return await deleteCraftedItem(sql, userId, craftId);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
