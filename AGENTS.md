# AGENTS.md — PD2 Planner

> **THREE-LAYER AI STACK**: Nreki (safety/tokens) → Aegis (architecture context) → Athena (memory)
> **CRITICAL**: Read this ENTIRE file before touching any code. It contains non-obvious patterns that WILL cause bugs if missed.

---

## 🎯 Project Identity

**PD2 Planner** (`pd2planner`) is a web-based character build planner for **Project Diablo 2** (PD2), a modded version of Diablo 2 Resurrected. It is a **browser-first, vanilla JS application** served via a Node.js Express backend at [pd2planner.net](https://pd2planner.net).

**Tech stack**: HTML + Vanilla CSS + Vanilla JS (NO frameworks, NO TypeScript, NO build step)  
**Backend**: Node.js + Express (`auth.js`) — handles auth, MongoDB (user builds), JWT tokens  
**Hosting**: Heroku (`Procfile`) — `node auth.js`

---

## 🏗️ Architecture Overview

### Global Object Map
| Object | File | Purpose |
|:---|:---|:---|
| `window.characterManager` | `character.js` | Stats (str/dex/vit/enr), level, class |
| `window.unifiedSocketSystem` | `socket.js` | Equipment, sockets, ALL stat calculations |
| `window.skillSystem` / `window.skillSystemInstance` | `skills.js` | Skills, prerequisites, damage formulas |
| `window.charmInventory` | `inventory.js` | Charm grid management |
| `window.craftedItemsSystem` | `craftedItems.js` | Custom crafted item creation |
| `window.itemList` | `items.js` | Master item database (ALL items) |
| `window.baseDefenses` | `itemUpgrade.js` | Base defense lookup for dynamic items |
| `window.partyManager` | `party-manager.js` | 8-slot party build management |
| `window.dropdownItemCache` | `main.js` | Dynamic item property cache |
| `window.itemCorruptions` | various | Per-item corruption data |
| `window.statsCalculator` | `socket.js` | Computed stat totals |
| `window._isLoadingCharacterData` | global flag | Guards against early event dispatch during load |

### Update Flow (NEVER bypass this)
```
User Action → dispatchEvent('change')
  ↓
window.unifiedSocketSystem.updateAll()
  ↓
window.characterManager.updateTotalStats()
  ↓
DOM Updates
```
**Always trigger via `updateAll()`, never individual stat updates.**

---

## 📁 File Responsibilities

| File | Size | Purpose |
|:---|:---|:---|
| `items.js` | ~200KB | Item database — `itemList` object (ALL game items) |
| `socket.js` | ~250KB | UnifiedSocketSystem — equipment, sockets, stat engine |
| `skills.js` | ~600KB | SkillSystem — ALL 7 classes, prerequisites, damage |
| `inventory.js` | ~112KB | CharmInventory — charm grid logic |
| `itemUpgrade.js` | ~185KB | Item upgrade paths, `window.baseDefenses` |
| `craftedItems.js` | ~111KB | Crafted item creation system |
| `character.js` | ~38KB | CharacterManager — stats, level, class switching |
| `main.js` | ~120KB | Initialization, dropdowns, event handlers, `generateItemDescription()` |
| `index.html` | ~41KB | Single-page app, all UI |
| `character-data.js` | ~15KB | Export/Import character builds (JSON) |
| `auth.js` | ~12KB | Express server — auth, MongoDB, JWT |
| `auth-ui.js` | ~18KB | Auth UI components |
| `party-manager.js` | ~10KB | 8-slot party build system |
| `buffs.js` | ~14KB | Buff/aura tracking |
| `setTracker.js` | ~30KB | Set item bonus tracking |
| `randomBuild.js` | ~13KB | SHIFT+R random build generator |
| `weapon-swap.js` | ~9KB | Weapon swap (W/S keys) |
| `runeword.js` | ~13KB | Runeword logic |
| `power-rating.js` | ~22KB | Build power score |
| `notification.js` | ~9KB | In-app notifications |
| `corrupt.js` | ~78KB | Corruption/alteration system |

---

## ⚠️ GOLDEN RULE: Two-Pass Loading

**When loading saved data, ALWAYS use this pattern:**
```javascript
// ❌ WRONG — dispatches events while setting values
for (const [key, val] of Object.entries(data)) {
    input.value = val;
    input.dispatchEvent(new Event('input')); // Too early!
}

// ✅ CORRECT — set ALL values first, then dispatch ALL events
// Pass 1: Set values
for (const [key, val] of Object.entries(data)) { input.value = val; }
// Pass 2: Dispatch events
for (const [key, val] of Object.entries(data)) { input.dispatchEvent(new Event('input')); }
```
**Why:** Early dispatch triggers validation before all data is loaded → stats reset, skills show "Prerequisites not met", items appear unusable.

---

## 🐛 Known Bugs & Solutions

### Level Resets to 1 on Load
```javascript
// character.js — handleLevelChange()
if (!window._isLoadingCharacterData) {
    this.validateStats(); // Only validate when NOT loading
}
```

### Skills Show "Prerequisites Not Met" on Load
- Two-pass loading (above) + call `updateSkillVisuals()` after all skills loaded.

### Charms Not Saving/Loading
- `exportCharms()` does NOT exist → use `getAllCharms()` for export, `restoreAllCharms()` for import.

### Dynamic Item Defense Not Calculating
```javascript
// items must have baseType property AND window.baseDefenses must have that baseType key
if (item.baseType && window.baseDefenses[item.baseType]) {
    const baseDef = window.baseDefenses[item.baseType];
    const edefValue = getPropertyValue(props.edef || 0);
    props.defense = Math.floor(baseDef * (1 + edefValue/100));
}
```
**If a `baseType` is missing from `window.baseDefenses` → defense won't calculate!**

### Property Not Displaying in Tooltip
Every item property needs a display handler in `main.js`'s `propertyDisplay` object AND properties that are sub-parts of others (e.g. `maxdmg`) must be in `skipProperties` array.

---

## 🔧 Common Tasks

### Adding a New Stat
1. `socket.js` → `calculateAllStats()`
2. `character.js` → `updateTotalStats()`
3. `index.html` → add display element
4. `character-data.js` → update export/import if persistent

### Modifying Item Properties
1. Edit `items.js` → `itemList` object
2. Clear browser cache (items are cached)
3. Test with `unifiedSocketSystem.updateAll()`

### Adding a New Item Property Display
1. Add handler to `propertyDisplay` object in `main.js`
2. If sub-property (like `maxdmg`), add to `skipProperties` array
3. If new `baseType`, add to `window.baseDefenses` in `itemUpgrade.js`

### Programmatic Skill Activation (e.g. random build)
```javascript
skillSystemInstance.setSkillValue(skillId, value);
skillSystemInstance.updateSkillVisuals();
skillSystemInstance.updatePointsDisplay();
for (const [skillId, value] of Object.entries(skills)) {
    const skillInput = document.getElementById(skillId);
    skillInput.setAttribute('data-old-value', value);
    skillSystemInstance.handleSkillInput(skillInput);
}
skillSystemInstance.updateSkillDropdown();
// Skill IDs end in "container" — e.g. "lightningfurycontainer"
setTimeout(() => { dropdown.value = 'lightningfurycontainer'; }, 200);
```

### Class Skills from Equipment
```javascript
// character.js — getEquipmentClassSkills()
// Returns total class skill bonus from equipped items (amask, necsk, barsk, palsk, drusk, assk)
// Called in updateTotalStats() → feeds into skillSystem.updateSkillBonuses()
```

---

## 💡 Patterns & Best Practices

1. **Always set `window._isLoadingCharacterData = true`** when bulk-loading, clear in `finally` block
2. **Use `setTimeout()`** for async ops that depend on DOM updates
3. **Call `updateAll()` after bulk changes**, not after each individual change
4. **Use `window.dropdownItemCache`** for dynamic item properties
5. **Test save/load** after any changes to export/import logic
6. **Skill IDs** always end in `"container"` (e.g., `jabcontainer`)
7. **Active skill dropdown** uses skill IDs as values, NOT display names

---

## ❌ Never Do This

- Dispatch events while setting values during bulk load
- Call `validateStats()` during character data loading
- Modify `itemList` directly (shared state)
- Forget `updateAll()` after equipment changes
- Use `exportCharms()` (doesn't exist)
- Set level AFTER loading equipment (level must be set first)
- Add a `baseType` to items without adding it to `window.baseDefenses`

---

## 🔐 Backend (auth.js)

Express server responsible for:
- User authentication (JWT + bcrypt)
- Build persistence (MongoDB/Mongoose)
- Build sharing via URL (`?build=BUILD_ID`)

**Party Build format:**
```json
{ "isPartyBuild": true, "activeIndex": 0, "party": [P1, P2, ..., P8] }
```
- Save: all 8 party slots saved together
- Load from "My Builds": restores all 8 slots
- Load from shared URL: P1 only (keeps sharing simple)

---

## 🤖 AI Layer Stack

```
┌─────────────────────────────────────────────┐
│  Layer 1: Athena Memory (C:/Fatamata)       │
│  → Persistent session memory, context       │
│  → Vectorized knowledge via Supabase/pgvec  │
├─────────────────────────────────────────────┤
│  Layer 2: Aegis (.aegis/aegis.db)           │
│  → DAG-based architecture context compiler  │
│  → Deterministic: which docs for which file │
├─────────────────────────────────────────────┤
│  Layer 3: Nreki (CLAUDE.md)                 │
│  → RAM validation before disk write         │
│  → TFC compression (85-98% token savings)   │
│  → Auto-heals TS/JS errors in RAM           │
└─────────────────────────────────────────────┘
```

**Workflow for any code task:**
1. Aegis: `aegis_compile_context` → get architecture rules for target files
2. Nreki: `nreki_navigate action:"outline"` → structural map (not raw read)
3. Nreki: `nreki_code action:"compress" focus:"targetMethod"` → focused read
4. Nreki: `nreki_code action:"batch_edit"` → atomic validated write

---

## 🌐 Deployment

- **Live URL**: https://pd2planner.net
- **Repo**: https://github.com/saesarandom/pd2planner
- **Hosting**: Heroku
- **Start command**: `node auth.js`
- **MongoDB**: Cloud (Mongoose)

---

*Last updated: 2026-04-15 | Framework: Athena v9.6.5 + Aegis + Nreki v10*

<!-- aegis:start -->
## Aegis Process Enforcement

You MUST consult Aegis for every coding-related interaction — implementation tasks AND questions about architecture, patterns, or conventions. No exceptions.

### When Writing Code

1. **Create a Plan** — Before touching any file, articulate what you intend to do.
2. **Consult Aegis** — Call `aegis_compile_context` with:
   - `target_files`: the files you plan to edit
   - `plan`: your natural-language plan (optional but recommended)
   - `command`: the type of operation (scaffold, refactor, review, etc.)
3. **Read and follow** the returned architecture guidelines.
   - `delivery: "inline"` — content is included; read it directly.
   - `delivery: "deferred"` — content is NOT included. You MUST Read the file via `source_path` before proceeding. Prioritize by `relevance` score (high first); skip only documents with very low relevance (< 0.25) unless specifically needed.
   - `delivery: "omitted"` — excluded by budget or policy. Increase `max_inline_bytes` or use `content_mode: "always"` if needed.
4. **Self-Review** — After writing code, check your implementation against the returned guidelines.
5. **Report Compile Misses** — If Aegis failed to provide a needed guideline:
   ```
   aegis_observe({
     event_type: "compile_miss",
     related_compile_id: "<from step 2>",
     related_snapshot_id: "<from step 2>",
     payload: {
       target_files: ["<files>"],
       review_comment: "<what was missing or insufficient>",
       target_doc_id: "<optional: base.documents[*].doc_id whose content was insufficient>",
       missing_doc: "<optional: doc_id that should have been returned but was not>"
     }
   })
   ```
   - `target_doc_id`: A doc_id from the **base.documents** section of the compile result whose content was insufficient. Do NOT use expanded or template doc_ids.
   - `missing_doc`: A doc_id that should have been included in the compile result but was absent.
   - If neither can be identified, `review_comment` alone is sufficient.

### When Answering Questions

If the user asks about architecture, patterns, conventions, or how to write code — even without requesting implementation:

1. **Identify representative files** — Find 1–3 real file paths in the codebase that are relevant to the question (e.g. `modules/Member/Application/Member/UpdateMemberInteractor.php`). Use directory listings or search if needed. Do NOT guess paths or use directories. **Do NOT read the files** — Aegis already has the relevant guidelines; reading files wastes tokens.
2. **Consult Aegis** — Call `aegis_compile_context` with:
   - `target_files`: the real file paths from step 1
   - `plan`: the user's question in natural language
   - `command`: `"review"`
3. **Answer using Aegis context** — Base your answer on the guidelines returned by Aegis, supplemented by your own knowledge. Cite specific guidelines when relevant. When documents include a `relevance` score, prioritize high-scoring documents and skim or skip low-scoring ones.

### When Knowledge Base Is Empty

If `aegis_compile_context` returns no documents, the knowledge base has not been populated yet.
Ask the user to run initial setup using the **admin surface** with `aegis_import_doc` to add architecture documents with `edge_hints`.

### Rules

- NEVER skip the Aegis consultation step — for both implementation and questions.
- NEVER ignore guidelines returned by Aegis.
- The compile_id and snapshot_id from the consultation are required for observation reporting.
<!-- aegis:end -->
