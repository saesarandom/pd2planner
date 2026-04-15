# PD2 Planner — Data Patterns & Bug Playbook
**kind**: guideline  
**doc_id**: pd2planner-data-patterns  
**tags**: patterns, bugs, loading, skills, charms, defense, corruption  
**edge_hints**:
  - source: "character-data.js", type: file_requires
  - source: "character.js", type: file_requires
  - source: "skills.js", type: file_requires
  - source: "inventory.js", type: file_requires
  - source: "itemUpgrade.js", type: file_requires
  - source: "main.js", type: file_requires
  - source: "randomBuild.js", type: file_requires

---

## ⚠️ GOLDEN RULE: Two-Pass Loading

**This is the #1 source of bugs. Every load function must follow this pattern.**

```javascript
// ❌ WRONG — events fire before all data is set
for (const [key, val] of Object.entries(data)) {
    input.value = val;
    input.dispatchEvent(new Event('input')); // validation runs too early!
}

// ✅ CORRECT — set everything, then fire everything
// Pass 1: Set all values silently
for (const [key, val] of Object.entries(data)) {
    input.value = val;
}
// Pass 2: Dispatch events to trigger validation
for (const [key, val] of Object.entries(data)) {
    input.dispatchEvent(new Event('input'));
}
```

**Applied in**: `character-data.js` — `loadCharacterFromData()` (stats, skills, equipment)

---

## Loading State Guard

```javascript
// ALWAYS wrap bulk loads:
window._isLoadingCharacterData = true;
try {
    // ... load data ...
} finally {
    window._isLoadingCharacterData = false;
}

// character.js — handleLevelChange() MUST check this flag:
if (!window._isLoadingCharacterData) {
    this.validateStats(); // only validate when NOT bulk-loading
}
```

**Why**: `validateStats()` resets stats based on current level. If level is loaded before stats, it resets stats to level 1 defaults.

**Rule**: Level MUST be set before equipment and stats are loaded.

---

## Charm System Patterns

```javascript
// WRONG — this function does not exist:
window.charmInventory.exportCharms(); // ❌ ReferenceError

// CORRECT:
const charms = window.charmInventory.getAllCharms();      // export
window.charmInventory.restoreAllCharms(charmsArray);      // import
```

---

## Dynamic Defense Calculation

Items with a `baseType` property calculate defense dynamically:

```javascript
// itemUpgrade.js — window.baseDefenses MUST contain the baseType key
window.baseDefenses = {
    "Round Shield": 55,
    "Monarch": 148,
    // ALL baseTypes used in items.js must be here
};

// main.js — generateItemDescription()
if (item.baseType && window.baseDefenses[item.baseType]) {
    const baseDef = window.baseDefenses[item.baseType];
    const edefValue = getPropertyValue(props.edef || 0);
    props.defense = Math.floor(baseDef * (1 + edefValue / 100));
}
```

**Rule**: If you add an item with a `baseType` in `items.js`, you MUST add that `baseType` key to `window.baseDefenses` in `itemUpgrade.js`. Otherwise defense = 0 silently.

---

## Property Display Pattern

Every item property key needs a handler in `main.js`:

```javascript
// main.js — propertyDisplay object
const propertyDisplay = {
    openwounds: (val, prop) => formatVariableStat('', val, '% Chance of Open Wounds', ...),
    mindmg: (val, prop) => `Adds ${val}-${props.maxdmg || val} Damage`,
    maxdmg: () => '',       // handled by mindmg — return empty string
    amask: (val) => `+${val} to Amazon Skill Levels`,
    // class skill keys: amask, necsk, barsk, palsk, drusk, assk
};

// Properties that are sub-parts of others go in skipProperties:
const skipProperties = ['javelin', 'speed', 'onehandmax', 'twohandmax', 'throwmax', 'smitedmgmax', 'maxdmg'];
```

**Rule**: Missing handler → property invisible in tooltip. Missing from `skipProperties` → duplicate display.

---

## Skill System Patterns

### Skill IDs
```javascript
// Skill IDs ALWAYS end in "container"
"jabcontainer"             // ✅ correct
"lightningfurycontainer"   // ✅ correct
"Lightning Fury"           // ❌ wrong — this is the display name

// Active skill dropdown values = skill IDs, not display names
skillDropdown.value = 'lightningfurycontainer'; // ✅
skillDropdown.value = 'Lightning Fury';          // ❌ — no-op
```

### Programmatic Skill Setting (e.g. randomBuild.js)
```javascript
// Correct sequence — order matters:
skillSystemInstance.setSkillValue(skillId, value);          // 1. set
skillSystemInstance.updateSkillVisuals();                    // 2. update UI
skillSystemInstance.updatePointsDisplay();                   // 3. update spent points

for (const [skillId, value] of Object.entries(skills)) {
    const el = document.getElementById(skillId);
    el.setAttribute('data-old-value', value);               // 4. mark old value
    skillSystemInstance.handleSkillInput(el);               // 5. validate prereqs
}

skillSystemInstance.updateSkillDropdown();                   // 6. populate dropdown
setTimeout(() => { dropdown.value = 'skillcontainer'; }, 200); // 7. set active skill (delayed)
```

**Note**: The 200ms delay on step 7 is required — `updateSkillDropdown()` is async in effect.

---

## Class Skills from Equipment

`character.js` — `getEquipmentClassSkills()`:
- Loops all equipped items
- Checks class-specific skill properties: `amask`, `necsk`, `barsk`, `palsk`, `drusk`, `assk`
- Returns total bonus for current class
- Called in `updateTotalStats()` → merged into `window.statsCalculator.stats.classSkills`
- Feeds into `skillSystem.updateSkillBonuses(allSkills, classSkills)`

---

## Party Build System

`party-manager.js` — `window.partyManager`:
- 8 party slots (P1-P8)
- Save: all 8 slots in one MongoDB document with `isPartyBuild: true`
- Load from "My Builds": all 8 slots restored
- Load from shared URL: P1 only (by design — keeps sharing clean)

---

## Timing Patterns

```javascript
// DOM updates need a frame for async ops:
setTimeout(() => {
    dropdown.value = 'skillId';
}, 200);

// Class switch then skills (from randomBuild.js):
// 1. Trigger class change (500ms settle time)
// 2. Set skills
// 3. Update dropdown (200ms delay for value set)
```

---

## Saving/Loading Protocol (character-data.js)

Load order is strict — violations cause stat resets:
1. Set `window._isLoadingCharacterData = true`
2. Set character **level** (MUST be first)
3. Set **stats** (str/dex/vit/enr)
4. Set **skills** (all values pass 1)
5. Set **equipment** (all slots pass 1)
6. Dispatch events for stats (pass 2)
7. Dispatch events for skills (pass 2)
8. Call `updateAll()` once at the end
9. Set `window._isLoadingCharacterData = false` in `finally`
