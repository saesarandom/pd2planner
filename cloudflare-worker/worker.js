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

async function handleRequest(request, env) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

        return new Response(JSON.stringify({
          success: true,
          user: result[0]
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

      return new Response(JSON.stringify({
        success: true,
        user: result[0]
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

      return new Response(JSON.stringify({
        success: true,
        character: result[0]
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
      const { userId, achievementId, achievementData } = await request.json();

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
    return handleRequest(request, env);
  }
};
