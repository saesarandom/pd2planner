# PD2 Planner Cloudflare Worker API

This is the serverless API backend for PD2 Planner authentication and database.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Set Database URL

```bash
wrangler secret put DATABASE_URL
```

Paste your Neon PostgreSQL connection string when prompted.

### 4. Deploy

```bash
npm run deploy
```

## Development

### Local Development

```bash
npm run dev
```

This starts a local worker at `http://localhost:8787`.

### View Logs

```bash
npm run tail
```

## Configuration

### Environment Variables

Set via `wrangler secret put`:

- `DATABASE_URL` - Neon PostgreSQL connection string (required)

### wrangler.toml

Configure worker settings:
- `name` - Worker name
- `compatibility_date` - Worker compatibility date
- `node_compat` - Enable Node.js compatibility

## API Endpoints

All endpoints return JSON.

### POST /api/register
Register new user.

**Request:**
```json
{
  "username": "player1",
  "password": "password123",
  "email": "player1@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "player1",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/login
Login user.

**Request:**
```json
{
  "username": "player1",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "player1",
    "email": "player1@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/characters/save
Save character build.

**Request:**
```json
{
  "userId": 1,
  "characterName": "My Sorc Build",
  "characterData": { /* character data object */ }
}
```

**Response:**
```json
{
  "success": true,
  "character": {
    "id": 1,
    "build_id": "MySorcBuildAbc123",
    "character_name": "My Sorc Build",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/characters?userId=X
Get user's characters.

**Response:**
```json
{
  "characters": [
    {
      "id": 1,
      "build_id": "MySorcBuildAbc123",
      "character_name": "My Sorc Build",
      "character_data": { /* data */ },
      "views": 42,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PUT /api/characters/update
Update character build.

**Request:**
```json
{
  "userId": 1,
  "buildId": "MySorcBuildAbc123",
  "characterData": { /* updated data */ }
}
```

### DELETE /api/characters/delete
Delete character build.

**Request:**
```json
{
  "userId": 1,
  "buildId": "MySorcBuildAbc123"
}
```

### GET /api/build/:buildId
Get public build (increments view count).

**Response:**
```json
{
  "build": {
    "id": 1,
    "build_id": "MySorcBuildAbc123",
    "character_name": "My Sorc Build",
    "character_data": { /* data */ },
    "views": 43,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/settings?userId=X
Get user settings.

### PUT /api/settings
Update user settings.

**Request:**
```json
{
  "userId": 1,
  "darkMode": true,
  "settings": { /* custom settings */ }
}
```

### POST /api/achievements/unlock
Unlock achievement.

**Request:**
```json
{
  "userId": 1,
  "achievementId": "first_save",
  "achievementData": { "buildName": "My First Build" }
}
```

### GET /api/achievements?userId=X
Get user achievements.

## Database Schema

See `schema.sql` for complete schema.

### Tables

- `users` - User accounts
- `characters` - Character builds
- `user_settings` - User preferences
- `achievements` - User achievements

## Security

- Passwords hashed with SHA-256 (upgrade to bcrypt recommended)
- Database credentials stored in Worker secrets
- CORS restricted to pd2planner.net

## Monitoring

View logs in real-time:
```bash
wrangler tail
```

View analytics in Cloudflare dashboard:
- Workers → pd2-planner-api → Analytics

## Troubleshooting

### Database Connection Failed
- Check `DATABASE_URL` secret is set
- Verify Neon database is active (not paused)
- Test connection string

### CORS Errors
- Verify domain in `corsHeaders`
- Check request origin matches allowed origin

### Deployment Failed
- Run `wrangler login` again
- Check `wrangler.toml` is valid
- Verify npm dependencies installed

## Updating

### Update Dependencies
```bash
npm update
```

### Redeploy
```bash
npm run deploy
```

### Update Secrets
```bash
wrangler secret put DATABASE_URL
```

## License

Same as main PD2 Planner project.
