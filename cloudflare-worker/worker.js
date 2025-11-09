// Cloudflare Worker for PD2 Planner Auth & Database
// Deploy this to Cloudflare Workers

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

// Check all possible achievements (conditions hidden from client)
// Returns array of newly unlocked achievement details
async function checkAllAchievements(userId, characterData, sql) {
  const newlyUnlocked = [];
  const level = parseInt(characterData.character?.level);
  const charms = characterData.charms || [];

  // Get existing achievements for this user
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

  // Charm Collector: Fill entire charm inventory (16 slots)
  if (Array.isArray(charms) && charms.length >= 16 && !existingIds.has('charm_collector')) {
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

  return newlyUnlocked;
}

// Legacy wrapper - calls the new checkAllAchievements
async function checkAndAwardAchievements(userId, characterData, sql) {
  try {
    return await checkAllAchievements(userId, characterData, sql);
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

async function handleRequest(request, env) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate DATABASE_URL exists
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

        // Create default settings
        await sql`
          INSERT INTO user_settings (user_id, dark_mode)
          VALUES (${result[0].id}, true)
        `;

        // Generate session token for new user
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

      // Generate session token
      const token = generateToken();
      const userId = result[0].id;

      // Store token (replace any existing token for this user)
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

    // Check character state and award any applicable achievements (conditions stay hidden)
    if (path === '/api/check-state' && request.method === 'POST') {
      const { userId, token, characterData } = await request.json();

      if (!userId || !token || !characterData) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Validate token
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

      // Check all achievements (conditions hidden from client)
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

      // Check and award achievements based on character data
      const newAchievements = await checkAndAwardAchievements(userId, characterData, sql);

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

    // Unlock achievement (requires valid token)
    if (path === '/api/achievements/unlock' && request.method === 'POST') {
      const { userId, token, achievementId, achievementData } = await request.json();

      if (!token) {
        return new Response(JSON.stringify({ error: 'Token required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Validate token
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
