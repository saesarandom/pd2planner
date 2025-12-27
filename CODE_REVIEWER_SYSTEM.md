# PD2 Planner - Code Reviewer/Explainer System

## Project Overview

**Project Type:** Diablo 2 Project Diablo 2 Character Build Planner  
**Tech Stack:** Vanilla JavaScript, HTML5, CSS3  
**Architecture:** Module-based with global window namespace pattern  
**Database:** Supabase (backend), Local itemList (items.js)  
**State Management:** Global window objects + DOM-driven updates

---

## Core Architecture Analysis

### 1. **Module Structure & Dependencies**

```
INITIALIZATION ORDER (Critical):
1. items.js → itemList data
2. character.js → CharacterManager class
3. socket.js → UnifiedSocketSystem class  
4. skills.js → SkillSystem class
5. inventory.js → CharmInventory class
6. buffs.js → BuffSystem class
7. setTracker.js → SetTracker class
8. craftedItems.js → CraftedItemsSystem class
9. main.js → DOMContentLoaded handlers
10. character-data.js → Import/Export functions
11. auth.js + auth-ui.js → Authentication layer
```

**Key Dependency Chain:**
```
itemList (items.js)
    ↓
UnifiedSocketSystem → CharacterManager → SkillSystem
    ↓                        ↓
setTracker              CharmInventory
    ↓                        ↓
    ← updateAll() triggers → updateTotalStats()
```

---

### 2. **Critical Global Objects**

| Object | Location | Purpose | Used By |
|--------|----------|---------|---------|
| `window.unifiedSocketSystem` | socket.js | Equipment, sockets, stat calculation | Character, Main, Inventory |
| `window.characterManager` | character.js | Base stats, level, class | Socket, Skills, Inventory |
| `window.skillSystem` | skills.js | Skill points, bonuses | Character, Main |
| `window.charmInventory` | inventory.js | Charm storage & stats | Character, Main |
| `window.setTracker` | setTracker.js | Set item bonuses | Socket |
| `window.buffSystem` | buffs.js | Active buff tracking | Skills |
| `window.craftedItemsSystem` | craftedItems.js | Custom crafted items | Main, Socket |
| `window.itemList` | items.js | All game items database | All modules |

---

### 3. **State Update Flow**

```
USER ACTION (equipment change, socket add, etc.)
    ↓
dropdown.dispatchEvent(new Event('change'))
    ↓
UnifiedSocketSystem.updateAll()
    ↓
├─ calculateEquipmentStats()
├─ calculateSocketStats()  
├─ calculateAllStats()
└─ updateStatsDisplay()
    ↓
CharacterManager.updateTotalStats()
    ↓
├─ getAllItemBonuses()
├─ getSocketBonuses()
├─ getCharmBonuses()
└─ updateTotalDisplay()
    ↓
DOM UPDATES (resistance containers, stat totals, etc.)
```

**Important:** Always trigger updates via `updateAll()` not individual stat updates.

---

## File-by-File Responsibilities

### **main.js** - Central orchestrator
- Dropdown population from itemList
- Event handler setup
- Anya quest bonuses (checkboxResistBonus)
- DOMContentLoaded initialization
- Build loading from URL
- Save/Load UI buttons

### **socket.js** - Equipment & Stats Engine
- `UnifiedSocketSystem` class (3000+ lines)
- Equipment stat parsing
- Socket management (gems, runes, jewels)
- Stat calculation & aggregation
- Item requirement validation
- Rainbow facet modal
- Corruptions handling

### **character.js** - Character Management
- `CharacterManager` class
- Base stats by class
- Stat point allocation
- Life/Mana calculation
- Level management
- Bonus aggregation (items + sockets + charms)
- Achievement watching (MutationObserver)

### **skills.js** - Skill System
- `SkillSystem` class
- All 7 class skill trees
- Skill point allocation
- Prerequisites validation
- Skill bonuses from equipment
- Active skill selection

### **inventory.js** - Charm System
- `CharmInventory` class
- 10x4 grid management
- Large/Grand charm overlays
- Charm stat parsing & aggregation
- Clear/Restore functionality

### **character-data.js** - Serialization
- `exportCharacterData()` - Save build
- `loadCharacterFromData()` - Restore build
- Handles: equipment, sockets, corruptions, charms, skills, stats

### **craftedItems.js** - Custom Item System
- `CraftedItemsSystem` class
- Affix database (prefixes/suffixes)
- Item creation & validation
- Integration with itemList

---

## Common Patterns & Best Practices

### ✅ **DO:**

1. **Use `updateAll()` for any change:**
```javascript
window.unifiedSocketSystem.updateAll();
```

2. **Check system initialization:**
```javascript
if (window.characterManager) {
    window.characterManager.updateTotalStats();
}
```

3. **Use `setTimeout` for DOM-dependent code:**
```javascript
setTimeout(() => {
    if (window.charmInventory?.initialized) {
        // Safe to use
    }
}, 500);
```

4. **Follow the dropdown pattern:**
```javascript
const dropdown = document.getElementById('weapons-dropdown');
dropdown.value = 'itemName';
dropdown.dispatchEvent(new Event('change', { bubbles: true }));
```

5. **Use global `getItemData()` helper:**
```javascript
const item = window.getItemData(itemName); // Checks both itemList and crafted items
```

### ❌ **DON'T:**

1. **Manually update stat containers** - Let `updateStatsDisplay()` handle it
2. **Create circular update loops** - One-way flow: user action → updateAll() → DOM
3. **Assume systems are ready immediately** - Always check initialization
4. **Modify itemList directly** - Use craftedItemsSystem for custom items
5. **Forget to export new data** in `exportCharacterData()`

---

## Critical DOM Elements

### Stat Containers (ID reference)
```javascript
// Character Stats
'strengthcontainer', 'dexteritycontainer', 'vitalitycontainer', 'energycontainer'
'total-str', 'total-dex', 'total-vit', 'total-enr'

// Resistances  
'fireresistcontainer', 'coldresistcontainer', 'lightresistcontainer', 
'poisonresistcontainer', 'curseresistcontainer'

// Combat Stats
'lifestealcontainer', 'manastealcontainer', 'owcontainer', 'cbcontainer', 
'dscontainer', 'drcontainer', 'pdrcontainer', 'mdrcontainer'

// Speed Stats
'iascontainer', 'fcrcontainer', 'frwcontainer', 'fhrcontainer'

// Misc
'mfcontainer', 'gfcontainer', 'defensecontainer', 'plrcontainer', 'cbfcontainer'
```

### Equipment Dropdowns
```javascript
'weapons-dropdown', 'helms-dropdown', 'armors-dropdown', 'offs-dropdown',
'gloves-dropdown', 'belts-dropdown', 'boots-dropdown',
'ringsone-dropdown', 'ringstwo-dropdown', 'amulets-dropdown'

// Mercenary
'mercweapons-dropdown', 'merchelms-dropdown', 'mercarmors-dropdown', 
'mercoffs-dropdown', 'mercgloves-dropdown', 'mercbelts-dropdown', 'mercboots-dropdown'
```

---

## Data Flow Diagrams

### Equipment Change Flow
```
User selects item in dropdown
    ↓
onChange event fires
    ↓
UnifiedSocketSystem.handleDropdownChange()
    ↓
updateInfoDisplay(dropdownId)  // Show item stats
    ↓
Trigger socket container refresh
    ↓
updateAll()  // Recalculate everything
    ↓
updateStatsDisplay()  // Update all stat containers
    ↓
CharacterManager.updateTotalStats()  // Update character totals
    ↓
DOM reflects all changes
```

### Socket Addition Flow
```
User clicks "+ socket" button
    ↓
addSocket(section)
    ↓
Create .socket-slot.empty element
    ↓
Update socket-grid class (sockets-N)
    ↓
User clicks socket → showSocketModal()
    ↓
User selects gem/rune/jewel
    ↓
fillSocketWithSelection()
    ↓
socket.dataset.stats = "stat string"
    ↓
updateAll()  // Recalculate with new socket
```

---

## Common Issues & Solutions

### Issue 1: Stats not updating
**Cause:** Forgot to call `updateAll()`  
**Solution:**
```javascript
// After any equipment/socket/charm change:
if (window.unifiedSocketSystem) {
    window.unifiedSocketSystem.updateAll();
}
```

### Issue 2: System not initialized
**Cause:** Code runs before DOMContentLoaded  
**Solution:**
```javascript
setTimeout(() => {
    if (window.characterManager?.initialized) {
        // Safe to proceed
    }
}, 100);
```

### Issue 3: Circular dependency
**Cause:** Module A calls B which calls A  
**Solution:** Use event-driven pattern with `updateAll()` as single entry point

### Issue 4: Save/Load broken
**Cause:** New data not added to `exportCharacterData()`  
**Solution:** Always update `character-data.js` when adding new features

### Issue 5: Item not appearing in dropdown
**Cause:** Not in itemList or not matching category  
**Solution:** Check `items.js` and `BASE_TYPE_CATEGORIES` in main.js

---

## Performance Considerations

1. **Debounce rapid updates:**
```javascript
let updateTimeout;
function debouncedUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        window.unifiedSocketSystem.updateAll();
    }, 100);
}
```

2. **Minimize DOM queries:**
```javascript
// Cache selectors at module level
const container = document.getElementById('fireresistcontainer');
```

3. **Use event delegation:**
```javascript
document.body.addEventListener('click', (e) => {
    if (e.target.matches('.socket-slot')) {
        // Handle socket click
    }
});
```

---

## Testing Checklist

Before implementing new features, verify:

- [ ] Does it affect stat calculation? → Update `UnifiedSocketSystem`
- [ ] Does it need persistence? → Update `character-data.js`
- [ ] Does it change character state? → Update `CharacterManager`
- [ ] Does it add new items? → Update `items.js` or `craftedItemsSystem`
- [ ] Does it require UI updates? → Ensure `updateAll()` is called
- [ ] Does it work after save/load? → Test import/export cycle
- [ ] Does it work with existing builds? → Test backwards compatibility
- [ ] Does it cause performance issues? → Profile with large builds

---

## Code Review Process

### For New Features:

1. **Planning Phase:**
   - Identify affected modules
   - Map data flow
   - Check for circular dependencies
   - Plan backwards compatibility

2. **Implementation Phase:**
   - Follow existing patterns
   - Use global window objects
   - Call `updateAll()` after changes
   - Add to export/import functions

3. **Testing Phase:**
   - Test with empty build
   - Test with full build
   - Test save/load cycle
   - Test with different classes
   - Test mercenary interaction

4. **Integration Phase:**
   - Update documentation
   - Check console for errors
   - Verify stat calculations
   - Test edge cases

---

## Quick Reference: Adding a New Feature

### Example: Adding a new stat bonus (e.g., "Poison Length Reduced")

1. **Add to stats object** (socket.js):
```javascript
this.stats = {
    // ... existing stats
    poisonLengthReduced: 0
};
```

2. **Add parsing logic** (socket.js):
```javascript
parseItemStats(item, section) {
    // ... existing parsing
    if (match = stats.match(/Poison Length Reduced by (\d+)%/i)) {
        this.stats.poisonLengthReduced += parseInt(match[1]);
    }
}
```

3. **Add display container** (index.html):
```html
<div class="stat-item">
    <span class="stat-label">PLR:</span>
    <span id="plrcontainer" class="stat-value">0</span>%
</div>
```

4. **Update display function** (socket.js):
```javascript
updateStatsDisplay() {
    // ... existing updates
    this.updateElement('plrcontainer', this.stats.poisonLengthReduced);
}
```

5. **Reset in calculateAllStats()** (socket.js):
```javascript
this.stats.poisonLengthReduced = 0;
```

6. **Test:**
   - Equip item with stat
   - Verify display updates
   - Save and reload build
   - Check calculation accuracy

---

## Advanced Topics

### Custom Item Integration
- Items created via `craftedItemsSystem` are stored separately
- They're merged into dropdowns via `populateItemDropdowns()`
- Use `window.getItemData(itemName)` to fetch from both sources
- Export via `craftedItemsSystem.exportToData()`
- Import via `craftedItemsSystem.loadFromData()`

### Authentication Flow
- `auth.js` handles Supabase connection
- Builds saved to `characters` table
- Achievements tracked via `character_achievements` table
- `auth-ui.js` handles modal UI
- Profile button shows login state

### Skill Damage Calculation
- `calculateSkillDamage()` in skills.js
- Uses weapon base damage + skill modifiers
- Applies elemental skill damage bonuses
- Shows synergy bonuses
- Updates `#damage-results` container

---

## Known Limitations

1. **No undo/redo system** - All changes are immediate
2. **Limited to 6 sockets per item** - Hard-coded max
3. **Charm inventory fixed at 40 slots** - 10x4 grid
4. **Mercenary stats separate** - Not included in player totals
5. **Skill synergies hard-coded** - Not data-driven
6. **No item comparison** - Can't compare equipped vs hovering

---

## Future Improvement Opportunities

1. **Modularize socket.js** - Split into smaller files
2. **Data-driven skill trees** - Move to JSON configuration
3. **State management library** - Consider Redux or Zustand
4. **TypeScript migration** - Add type safety
5. **Unit tests** - Test stat calculations
6. **Performance profiling** - Optimize `updateAll()`
7. **Accessibility** - Add ARIA labels and keyboard navigation

---

## Recent Bug Fixes

### Snakecord Poison Skill Damage Issue (2025-12-27)
**Problem:** Dynamic unique item Snakecord's `poisondamage` property (range [4-6]) was not persisting user-selected values. When changing the input from 6 to 5, it would flicker to 5 and immediately revert to 6 (the default max).

**Root Cause:** The stat property name mismatch and cache persistence issue:
- Item property: `poisondamage` (in items.js)
- Socket.js stat tracker: `poisonSkillDamage` 
- main.js display handler: `poisondamage`
- The value was being parsed correctly from the description, but the cache wasn't being updated properly for this specific stat

**Solution:** 
The issue was in `itemState.js` - the `refreshSavedState` function was using `window.getItemData(itemName)` which returns the original item from `itemList`, not the modified version from `window.dropdownItemCache`. This meant that when saving state, it was saving the default max value (6) instead of the user-selected value (4).

**Fix Applied:**
Modified `itemState.js` line 16-17 to check `window.dropdownItemCache` first before falling back to `window.getItemData()`:
```javascript
const cacheKey = `${dropdownId}_${itemName}`;
let item = window.dropdownItemCache && window.dropdownItemCache[cacheKey];

// Fallback to getItemData if not in cache
if (!item) {
  item = window.getItemData(itemName);
}
```

This ensures that when the user changes a variable stat value:
1. `handleVariableStatChange` updates `window.dropdownItemCache[cacheKey]` with the new value
2. `refreshSavedState` reads from the same cache to save the modified state
3. When switching items and back, the saved state is restored with the correct user-selected value

**Related Files:**
- `items.js` (Snakecord definition, line 4449-4460)
- `main.js` (formatVariableStat, handleVariableStatChange, line 814-1148)
- `socket.js` (parseStatLine, poisonSkillDamage tracking, line 3495-3545)

**Testing:**
1. Equip Snakecord belt
2. Change poisondamage input from 6 to 4
3. Verify stat stays at 4 and doesn't revert to 6
4. Switch to another belt and back to Snakecord
5. Verify poisondamage value persists at 4

---

## Contact & Support

- File location: `c:\pd2planner\CODE_REVIEWER_SYSTEM.md`
- Last updated: 2025-12-27
- Version: 1.1

**When asking for code review, provide:**
1. Feature description
2. Affected modules
3. Expected behavior
4. Test cases

**For bug reports, include:**
1. Steps to reproduce
2. Expected vs actual result
3. Browser console errors
4. Build configuration (class, level, equipment)
