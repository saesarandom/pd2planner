# PD2 Planner - Development Guide

**Quick Reference for AI Assistant**  
Last Updated: 2025-12-27

---

## 🎯 Critical Patterns & Rules

### ⚠️ GOLDEN RULE: Two-Pass Loading
**When loading saved data, ALWAYS use this pattern:**
```javascript
// ❌ WRONG - Dispatches events while setting values
for (const [key, val] of Object.entries(data)) {
    input.value = val;
    input.dispatchEvent(new Event('input')); // Triggers validation too early!
}

// ✅ CORRECT - Set all values first, then dispatch events
// Pass 1: Set values
for (const [key, val] of Object.entries(data)) {
    input.value = val;
}
// Pass 2: Dispatch events
for (const [key, val] of Object.entries(data)) {
    input.dispatchEvent(new Event('input'));
}
```

**Why:** Dispatching events while setting values triggers validation/recalculation before all data is loaded, causing:
- Stats to reset to default values
- Skills to show "Prerequisites not met"
- Items to appear unusable due to level requirements

**Applied to:**
- `character-data.js` - Stats loading (lines 122-145)
- `character-data.js` - Skills loading (lines 270-295)

---

## 🏗️ Architecture Overview

### Key Global Objects
- `window.characterManager` - Character stats, level, class
- `window.unifiedSocketSystem` - Equipment, sockets, stat calculations
- `window.skillSystem` - Skills, prerequisites, damage
- `window.charmInventory` - Charm inventory system
- `window.craftedItemsSystem` - Custom crafted items
- `window.itemList` - All game items (from items.js)

### Update Flow
```
User Action → dispatchEvent('change')
    ↓
unifiedSocketSystem.updateAll()
    ↓
characterManager.updateTotalStats()
    ↓
DOM Updates
```

**Always trigger via `updateAll()`, never individual stat updates.**

---

## 📁 File Responsibilities

| File | Purpose |
|------|---------|
| `character-data.js` | Export/Import character builds |
| `character.js` | CharacterManager class, stats, level |
| `socket.js` | UnifiedSocketSystem, equipment, sockets |
| `skills.js` | SkillSystem, prerequisites, damage |
| `inventory.js` | CharmInventory, charm management |
| `main.js` | Initialization, dropdowns, event handlers |
| `items.js` | Item database (itemList) |

---

## 🐛 Known Issues & Solutions

### Issue: Character/Merc Level Resets to 1
**Cause:** `handleLevelChange()` calls `validateStats()` during load, which resets stats based on level 1.  
**Solution:** Skip `validateStats()` during load:
```javascript
// character.js - handleLevelChange()
if (!window._isLoadingCharacterData) {
    this.validateStats(); // Only validate when NOT loading
}
```

### Issue: Skills Show "Prerequisites Not Met"
**Cause:** Prerequisite checking runs before all skill values are loaded.  
**Solution:** Two-pass loading (see Golden Rule above) + call `updateSkillVisuals()` after loading.

### Issue: Charms Not Saving/Loading
**Cause:** Wrong method name - `exportCharms()` doesn't exist.  
**Solution:** Use `getAllCharms()` for export, `restoreAllCharms()` for import.

---

## 🔧 Common Tasks

### Adding a New Stat
1. Add to `socket.js` - `calculateAllStats()`
2. Add to `character.js` - `updateTotalStats()`
3. Add display element in HTML
4. Update `character-data.js` export/import if needed

### Modifying Item Properties
1. Edit `items.js` - `itemList` object
2. Clear browser cache (items are cached)
3. Test with `unifiedSocketSystem.updateAll()`

### Debugging Stat Calculations
1. Check `unifiedSocketSystem.stats` object in console
2. Verify `characterManager.currentLevel` is correct
3. Check `window.itemCorruptions` for corruption data
4. Use `updateAll()` to force recalculation

---

## 📝 Recent Fixes (2025-12-27)

### Build Loading System Overhaul
**Problem:** Levels, stats, and skills were resetting to default values when loading saved builds.

**Root Cause:** Race condition - events were dispatched while values were being set, triggering validation before all data was loaded.

**Solution:** Implemented two-pass loading pattern across:
- Character/mercenary level loading
- Stat loading (str, dex, vit, enr)
- Skill loading with prerequisite checking

**Files Modified:**
- `character-data.js` - `loadCharacterFromData()` function
- `character.js` - `handleLevelChange()` guard for loading state

**Result:** All build data now loads correctly:
✅ Character level  
✅ Mercenary level  
✅ Stats  
✅ Skills (with prerequisites)  
✅ Charms  
✅ Corruptions  
✅ Sockets  
✅ Variable stats  
✅ Equipment  

---

## 💡 Best Practices

1. **Always set `window._isLoadingCharacterData = true`** when bulk-loading data
2. **Clear it in a `finally` block** to ensure it's always reset
3. **Use `setTimeout()` for async operations** that depend on DOM updates
4. **Call `updateAll()` after bulk changes**, not after each individual change
5. **Check `window.characterManager.currentLevel`** for level-dependent logic
6. **Use `window.dropdownItemCache`** for dynamic item properties
7. **Test save/load** after any changes to export/import logic

---

## 🚨 Never Do This

- ❌ Dispatch events while setting values during bulk load
- ❌ Call `validateStats()` during character data loading
- ❌ Modify `itemList` directly (it's shared state)
- ❌ Forget to call `updateAll()` after equipment changes
- ❌ Use `exportCharms()` (doesn't exist - use `getAllCharms()`)
- ❌ Set level after loading equipment (level must be set first)

---

**End of Guide** - Keep this concise and update only with critical patterns/fixes.

---

## 📝 Recent Updates (2025-12-29)

### Dynamic Item System - Defense Calculation
**Pattern:** Items with `baseType` property calculate defense dynamically:
```javascript
// itemUpgrade.js - window.baseDefenses object
window.baseDefenses = {
  "Round Shield": 55,
  "Monarch": 148,
  // ... must include ALL base types used in items.js
};

// main.js - generateItemDescription()
if (item.baseType && window.baseDefenses[item.baseType]) {
  const baseDef = window.baseDefenses[item.baseType];
  const edefValue = getPropertyValue(props.edef || 0);
  props.defense = Math.floor(baseDef * (1 + edefValue/100));
}
```

**Critical:** If a `baseType` is missing from `window.baseDefenses`, defense won't calculate!

### Property Display Handlers
**Pattern:** Every item property needs a display handler in `main.js`:
```javascript
// main.js - propertyDisplay object
const propertyDisplay = {
  openwounds: (val, prop) => formatVariableStat('', val, '% Chance of Open Wounds', ...),
  atdmg: (val, prop) => formatVariableStat('Attacker Takes Damage of ', val, '', ...),
  mindmg: (val, prop) => `Adds ${val}-${props.maxdmg || val} Damage`,
  maxdmg: () => '', // Skip, handled by mindmg
  // ...
};

// Don't forget to add maxdmg to skipProperties array!
const skipProperties = ['javelin', 'speed', 'onehandmax', 'twohandmax', 'throwmax', 'smitedmgmax', 'maxdmg'];
```

**Common mistake:** Forgetting to add the handler → property doesn't display in tooltip.

### Skill Activation Pattern (Random Build Generator)
**Pattern:** Setting skill values programmatically requires proper activation:
```javascript
// 1. Set skill values
skillSystemInstance.setSkillValue(skillId, value);

// 2. Update visuals and validate
skillSystemInstance.updateSkillVisuals();
skillSystemInstance.updatePointsDisplay();

// 3. Trigger handleSkillInput for each skill (validates prerequisites)
for (const [skillId, value] of Object.entries(skills)) {
  const skillInput = document.getElementById(skillId);
  skillInput.setAttribute('data-old-value', value); // Important!
  skillSystemInstance.handleSkillInput(skillInput);
}

// 4. Update skill dropdown (populates active skill options)
skillSystemInstance.updateSkillDropdown();

// 5. Set active skill (use skill ID, not name!)
setTimeout(() => {
  dropdown.value = 'lightningfurycontainer'; // ✅ Correct
  // NOT 'Lightning Fury' ❌
}, 200);
```

**Why the delay?** `updateSkillDropdown()` needs time to populate the dropdown before setting the value.

### Random Build Generator (randomBuild.js)
**Feature:** SHIFT+R keyboard shortcut to randomize entire build.

**Key learnings:**
- Skill IDs end in "container" (e.g., `jabcontainer`, `lightningfurycontainer`)
- Active skill dropdown uses skill IDs as values, not display names
- Must call `updateSkillDropdown()` before setting active skill
- Use `window.skillSystemInstance` for all skill operations
- Timing matters: class change (500ms) → skills set → dropdown update (200ms)

**Files:**
- `randomBuild.js` - Main feature implementation
- `index.html` - Script tag added after main.js

Summary of Changes:
1. Added Display Handlers in main.js ✅
Added property display handlers for all class-specific skill properties:

amask
 - Amazon Skill Levels
necsk
 - Necromancer Skill Levels
barsk
 - Barbarian Skill Levels
palsk
 - Paladin Skill Levels
drusk
 - Druid Skill Levels
assk
 - Assassin Skill Levels
2. Added Equipment Class Skills Collection in character.js ✅
New Function: 
getEquipmentClassSkills()
 (lines 544-608)

Loops through all equipped items
Checks for class-specific skill properties based on current character class
Returns total class skill bonus from equipment
Updated: 
updateTotalStats()
 (lines 786-808)

Calls 
getEquipmentClassSkills()
 to get equipment bonuses
Adds equipment class skills to window.statsCalculator.stats.classSkills
Combines with charm class skills (Hellfire Torch)
This feeds into the skill system's updateSkillBonuses() call
How It Works:
Equipment with amask: 2 (like Blastbark) is now collected
Added to window.statsCalculator.stats.classSkills
Hellfire Torch's charm class skills are ALSO in window.statsCalculator.stats.classSkills
Socket.js line 4576 calls window.skillSystem.updateSkillBonuses(this.stats.allSkills, this.stats.classSkills)
Skills show the green bonus number next to skill levels! ✅
No existing functionality was changed - I only added new code that follows the same pattern as Hellfire Torch!

737 liny     // Call the global getCharmBonuses from inventory.js
    if (typeof window.getCharmBonuses === 'function') {
      const charmBonuses = window.getCharmBonuses();
      bonuses.str = charmBonuses.str || 0;
      bonuses.dex = charmBonuses.dex || 0;
      bonuses.vit = charmBonuses.vit || 0;
      bonuses.enr = charmBonuses.enr || 0;
    }

---
