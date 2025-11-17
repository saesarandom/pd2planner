# Item Description System Issues - PRs #304-310 Summary

## Timeline of Failed Fixes (from commit 1ae681d to 2e71bf7)

### Root Problems Encountered:
1. **Corruption stats not appearing in character counter**
2. **Stats being counted multiple times** (e.g., +1 to All Skills showing as +2 or +3)
3. **Corruption text appearing TWICE in item descriptions**
4. **Input boxes breaking for dynamic items with variable stats**

### PRs #304-310 - Attempted Fixes (All Failed):

**PR #304** (5831b12): Fix corruption +to All Skills not appearing in stats counter
- Added 'allskills' case in applyCorruptionToProperties
- Modified: corrupt.js

**PR #305** (cfb038d): Fix corruption allskills property name
- Changed 'allskills' to 'allsk' to match property naming
- Modified: corrupt.js

**PR #306** (7282e10): Fix corruption stat stacking losing the + sign
- Preserved + sign when stacking corruption values
- Modified: corrupt.js

**PR #307** (ce5b318): Fix corruption stats being counted multiple times
- Stored original properties FIRST before corruption logic
- Generated descriptions from original properties to prevent double-counting
- Modified: corrupt.js

**PR #308** (43025b7): Fix allsk corruption being counted twice for dynamic items
- Removed addCorruptionWithStacking call for dynamic items (corruption already in properties)
- Modified: socket.js

**PR #309** (87cf665): Fix corruption display for dynamic items
- Re-added corruption stacking to fix red text and multiple corruptions on armor
- Generated description from ORIGINAL properties, then applied stacking
- Modified: socket.js

**PR #310** (dfcec27): Fix input boxes breaking for corrupted dynamic items
- Removed complex stacking logic that mangled HTML
- Simple append of corruption text instead
- Modified: socket.js

## Core Issue Analysis

The fundamental problem is that the **item description generation system doesn't have a unified approach** for:
- **Regular items** (static descriptions)
- **Dynamic items** (generated descriptions with input boxes)
- **Set items** (regular and dynamic)
- **Corrupted items** (all types above)

### Key Confusion Points:
1. **When to apply corruption to properties vs description**
2. **Original vs corrupted state storage** timing
3. **Property-based generation vs description-based display**
4. **Stacking logic breaking HTML structure** (input boxes)
5. **Corruption being applied in multiple places** (properties AND description)

## Files Involved:
- `corrupt.js` - Corruption application and property modification
- `socket.js` - Item display update and description generation

## Next Steps:
**COMPLETE REFACTOR** of item description system with clear separation:
1. Single source of truth for item state (original vs modified)
2. Unified generation flow for all item types
3. Corruption as a modifier layer, not baked into base properties
4. HTML-safe corruption display that preserves input boxes
5. Clear distinction between display logic and stat calculation logic
