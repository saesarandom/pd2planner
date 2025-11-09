# PD2 Planner - Authentication & Database Setup Guide

## Overview
This setup adds user authentication and database functionality to PD2 Planner using:
- **Neon Database** - PostgreSQL database for storing users, characters, achievements
- **Cloudflare Workers** - Serverless API that connects your frontend to the database
- **Custom Auth** - Lightweight username/password authentication

---

## Prerequisites

Before you begin, you'll need:
- A Cloudflare account (free tier works)
- A Neon database account (free tier works)
- Node.js and npm installed locally
- Your PD2 Planner GitHub repository

---

## Step 1: Set Up Neon Database

### 1.1 Create Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or use existing one
3. Note your connection string - it looks like:
   ```
   postgresql://username:password@host/database?sslmode=require
   ```

### 1.2 Run Database Schema

1. In Neon dashboard, go to "SQL Editor" or "Query" tab
2. Open the file `cloudflare-worker/schema.sql`
3. Copy and paste the entire SQL script
4. Run the query to create all tables

### 1.3 Verify Tables

Check that these tables were created:
- `users` - User accounts
- `characters` - Saved character builds
- `user_settings` - User preferences
- `achievements` - User achievements

---

## Step 2: Deploy Cloudflare Worker

### 2.1 Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2.2 Login to Cloudflare

```bash
wrangler login
```

This opens a browser window to authenticate.

### 2.3 Navigate to Worker Directory

```bash
cd cloudflare-worker
```

### 2.4 Install Dependencies

```bash
npm install
```

### 2.5 Set Database URL Secret

```bash
wrangler secret put DATABASE_URL
```

When prompted, paste your Neon connection string (from Step 1.1).

### 2.6 Deploy Worker

```bash
npm run deploy
# or
wrangler deploy
```

After deployment, you'll get a URL like:
```
https://pd2-planner-api.your-subdomain.workers.dev
```

**SAVE THIS URL!** You need it in the next step.

---

## Step 3: Configure Frontend

### 3.1 Update API URL

1. Open `auth.js` in your project root
2. Find line 5:
   ```javascript
   const API_URL = 'https://your-worker.your-subdomain.workers.dev';
   ```
3. Replace with YOUR actual Cloudflare Worker URL from Step 2.6

### 3.2 Update CORS in Worker (if using custom domain)

If you're using a custom domain (not `pd2planner.net`):

1. Open `cloudflare-worker/worker.js`
2. Find line 7:
   ```javascript
   'Access-Control-Allow-Origin': 'https://pd2planner.net',
   ```
3. Replace with your domain

---

## Step 4: Test the Integration

### 4.1 Local Testing

```bash
# In cloudflare-worker directory
npm run dev
```

This starts a local development server. Update `auth.js` temporarily to point to `http://localhost:8787`.

### 4.2 Test on Live Site

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Add authentication system"
   git push
   ```

2. Wait for GitHub Pages to deploy (usually 1-2 minutes)

3. Visit your site: `https://pd2planner.net`

4. Click the green profile button (middle-right)

5. Register a new account

6. Create a character build and save it

7. Check "My Builds" to see your saved build

---

## Step 5: Verify Database

### 5.1 Check Users

In Neon SQL Editor, run:
```sql
SELECT * FROM users;
```

You should see your test account.

### 5.2 Check Characters

```sql
SELECT * FROM characters;
```

You should see your saved build.

---

## Features Implemented

### User Authentication
- ✅ User registration with username/password
- ✅ Login/logout functionality
- ✅ Session persistence (localStorage)
- ✅ Profile modal UI

### Character Management
- ✅ Save character builds to cloud
- ✅ Load saved builds
- ✅ Update existing builds
- ✅ Delete builds
- ✅ View all user builds

### Build Sharing
- ✅ Public build URLs (`/build.html?id=BuildID`)
- ✅ View counter for shared builds
- ✅ Copy share link to clipboard

### UI Components
- ✅ Bright green profile button (middle-right)
- ✅ Save Build button (top-right)
- ✅ Login/Register modal
- ✅ My Builds list
- ✅ Build viewer page

---

## File Structure

```
pd2planner/
├── cloudflare-worker/
│   ├── worker.js           # Cloudflare Worker API
│   ├── package.json        # Worker dependencies
│   ├── wrangler.toml       # Worker configuration
│   └── schema.sql          # Database schema
├── auth.js                 # Authentication client
├── auth-ui.js              # UI components (modals, buttons)
├── auth-styles.css         # Auth UI styles
├── character-data.js       # Save/load character data
├── build.html              # Shared build viewer page
├── index.html              # Main planner (updated)
└── main.js                 # Updated with save/load
```

---

## API Endpoints

All endpoints are on your Cloudflare Worker URL.

### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - Login

### Characters
- `POST /api/characters/save` - Save new build
- `GET /api/characters?userId=X` - Get user's builds
- `PUT /api/characters/update` - Update existing build
- `DELETE /api/characters/delete` - Delete build
- `GET /api/build/:buildId` - Get public build (increments views)

### Settings
- `GET /api/settings?userId=X` - Get user settings
- `PUT /api/settings` - Update settings

### Achievements
- `POST /api/achievements/unlock` - Unlock achievement
- `GET /api/achievements?userId=X` - Get user achievements

---

## Security Notes

### Current Implementation
- Passwords hashed with SHA-256
- Database credentials stored in Cloudflare Worker secrets
- CORS configured for your domain only

### Production Recommendations
- Upgrade to bcrypt for password hashing
- Add rate limiting to prevent abuse
- Implement email verification
- Add password reset functionality
- Consider JWT tokens instead of localStorage

---

## Troubleshooting

### Worker Not Connecting to Database
- Verify `DATABASE_URL` secret is set: `wrangler secret list`
- Check Neon database is not paused (free tier auto-pauses)
- Test connection string with a PostgreSQL client

### CORS Errors
- Verify worker URL in `auth.js` is correct
- Check CORS headers in `worker.js` match your domain
- Clear browser cache and cookies

### Builds Not Saving
- Open browser console for errors
- Verify you're logged in
- Check Cloudflare Worker logs: `wrangler tail`

### Modal Not Appearing
- Verify all CSS/JS files loaded (check Network tab)
- Check for JavaScript errors in console
- Verify files are in correct order in HTML

### Shared Builds Not Loading
- Check build ID is correct in URL
- Verify build is set to `is_public = true`
- Check Cloudflare Worker logs for errors

---

## Monitoring & Analytics

### View User Stats

```sql
-- Total users
SELECT COUNT(*) FROM users;

-- Total builds
SELECT COUNT(*) FROM characters;

-- Most popular builds
SELECT character_name, views, created_at
FROM characters
ORDER BY views DESC
LIMIT 10;

-- Recent registrations
SELECT username, created_at, last_login
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- User engagement
SELECT
    u.username,
    COUNT(c.id) as total_builds,
    SUM(c.views) as total_views
FROM users u
LEFT JOIN characters c ON u.id = c.user_id
GROUP BY u.id, u.username
ORDER BY total_builds DESC;
```

### Cloudflare Worker Analytics

View in Cloudflare dashboard:
- Request count
- Response time
- Error rate
- Geographic distribution

---

## Next Steps

### Future Enhancements
1. **Achievements System** - Framework already in place
2. **Dark Mode Toggle** - Saves to user settings
3. **Build Comments/Ratings** - Community feedback
4. **Build Tags/Categories** - Organize builds
5. **Leaderboards** - Most viewed/highest rated
6. **Build Import/Export** - JSON download
7. **Social Features** - Follow users, like builds
8. **Build Comparisons** - Side-by-side view

### Database Maintenance
- Set up automated backups (Neon does this automatically)
- Monitor database size (free tier has limits)
- Archive old/inactive builds
- Implement soft deletes for recovery

---

## Cost Estimates

### Free Tier Limits
- **Cloudflare Workers**: 100,000 requests/day
- **Neon Database**: 3GB storage, always available
- **GitHub Pages**: Unlimited (for public repos)

### When to Upgrade
- **Cloudflare**: >100k requests/day → $5/month for 10M requests
- **Neon**: >3GB storage → $19/month for unlimited

---

## Support

### Useful Commands

```bash
# Deploy worker
cd cloudflare-worker && npm run deploy

# View worker logs (real-time)
wrangler tail

# Test worker locally
npm run dev

# Update database secret
wrangler secret put DATABASE_URL

# List all secrets
wrangler secret list
```

### Getting Help
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Neon Database: https://neon.tech/docs/
- Issues: Create an issue on GitHub

---

## Changelog

### Version 1.0 (Initial Release)
- User authentication (register/login)
- Character build saving/loading
- Public build sharing
- Build viewer page
- User profile management
- Achievement framework
- Settings persistence

---

You're all set! 🎮 Your PD2 Planner now has user authentication and cloud storage!
