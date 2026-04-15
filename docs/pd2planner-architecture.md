# PD2 Planner — Architecture Guide
**kind**: guideline  
**doc_id**: pd2planner-architecture  
**tags**: architecture, update-flow, global-objects, file-responsibilities  
**edge_hints**:
  - source: "*.js", type: path_requires
  - source: "socket.js", type: file_requires
  - source: "character.js", type: file_requires
  - source: "skills.js", type: file_requires
  - source: "main.js", type: file_requires
  - source: "character-data.js", type: file_requires
  - source: "inventory.js", type: file_requires
  - source: "items.js", type: file_requires
  - source: "itemUpgrade.js", type: file_requires

---

## Stack Constraints

**NO TypeScript. NO frameworks. NO build step.**  
Pure browser-native HTML/CSS/JS. Node.js only for the Express auth backend (`auth.js`).  
Heroku deploys via `node auth.js`. All game logic runs in the browser.

---

## Global Object Registry

Every major system is a `window.*` singleton. These are initialized in order at page load.

| Object | File | Role |
|:---|:---|:---|
| `window.characterManager` | `character.js` | str/dex/vit/enr stats, level, class switching |
| `window.unifiedSocketSystem` | `socket.js` | Equipment slots, sockets, **central stat engine** |
| `window.skillSystem` + `window.skillSystemInstance` | `skills.js` | All 7 classes, prerequisites, damage math |
| `window.charmInventory` | `inventory.js` | Charm grid, small/large/grand slots |
| `window.craftedItemsSystem` | `craftedItems.js` | User-created custom items |
| `window.itemList` | `items.js` | Master database of all game items |
| `window.baseDefenses` | `itemUpgrade.js` | Base defense lookup (required for dynamic items) |
| `window.partyManager` | `party-manager.js` | 8-slot party build system |
| `window.dropdownItemCache` | `main.js` | Cached dynamic item properties |
| `window.statsCalculator` | `socket.js` | Computed stat totals (read by other systems) |

---

## Canonical Update Flow

**This is the ONLY valid path for triggering stat recalculation:**

```
User Action
  → dispatchEvent('change') on any input
  → window.unifiedSocketSystem.updateAll()
  → window.characterManager.updateTotalStats()
  → DOM updates
```

**NEVER call individual stat update methods directly. Always use `updateAll()`.**

### Why This Matters
- `updateAll()` ensures all interdependencies are resolved in the correct order
- Calling individual methods (e.g. `updateStrength()`) skips dependent calculations
- Bypassing this flow causes stale stats to persist in the UI

---

## File Size & Criticality

| File | Size | Criticality | Notes |
|:---|:---|:---|:---|
| `skills.js` | ~600KB | CORE | Largest file — 7 classes, all skills, all prereqs |
| `socket.js` | ~250KB | CORE | Stat engine, equipment, all bonus aggregation |
| `items.js` | ~200KB | DATA | itemList master, never modify at runtime |
| `itemUpgrade.js` | ~185KB | DATA | Upgrade paths + `window.baseDefenses` |
| `craftedItems.js` | ~111KB | FEATURE | Crafted item system |
| `inventory.js` | ~112KB | FEATURE | Charm grid |
| `main.js` | ~120KB | INIT | App bootstrap, `generateItemDescription()`, `propertyDisplay` |
| `character.js` | ~38KB | CORE | CharacterManager class |
| `corrupt.js` | ~78KB | FEATURE | Corruption/alteration system |
| `index.html` | ~41KB | UI | Single-page app, all HTML |

---

## Adding a New Stat (Protocol)

1. `socket.js` → `calculateAllStats()` — add computation logic
2. `character.js` → `updateTotalStats()` — integrate into total
3. `index.html` → add display element with unique ID
4. `character-data.js` → add to export/import if it should persist in saved builds

## Adding a New Item Property Display (Protocol)

1. Add handler to `propertyDisplay` object in `main.js`
2. If it's a sub-property (like `maxdmg`), add to `skipProperties` array in `main.js`
3. If new `baseType`, MUST add to `window.baseDefenses` in `itemUpgrade.js`

## Adding a New Item (Protocol)

1. Add to `window.itemList` in `items.js`
2. If it has a `baseType`, ensure that baseType key exists in `window.baseDefenses`
3. If it has new properties, add display handlers in `main.js`
4. Clear browser cache after changes

---

## Critical Constraints

- **No TypeScript** — Nreki operates in AST-only mode (Layer 1 tree-sitter)
- **No imports/exports** — all files loaded via `<script>` tags in `index.html`
- **Shared mutable state** — `window.*` objects are not cloned, direct mutation is fine but intentional
- **items.js is shared** — never `.push()` or delete from `window.itemList` at runtime

---

## Backend Separation

`auth.js` is the ONLY server-side file. It handles:
- JWT auth (bcrypt passwords, jsonwebtoken)
- MongoDB build persistence (Mongoose)
- Build sharing via `?build=BUILD_ID` URL param

Party build format saved to MongoDB:
```json
{ "isPartyBuild": true, "activeIndex": 0, "party": [P1, P2, P3, P4, P5, P6, P7, P8] }
```
- Loading from "My Builds" → restores all 8 slots
- Loading from shared URL → restores P1 only
