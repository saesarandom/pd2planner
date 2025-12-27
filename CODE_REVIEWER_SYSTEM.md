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
