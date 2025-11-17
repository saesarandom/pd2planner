# Item Description System - Refactor Design

## Core Principles

### 1. Single Source of Truth
- **Original Properties**: `item.properties` NEVER modified by corruptions/sockets/upgrades
- **Modifiers**: Stored separately (corruptions, socket bonuses, set bonuses, etc.)
- **Computed Properties**: Original + Modifiers = Final Properties (calculated on-demand)

### 2. Clear Separation of Concerns
- **Data Layer**: Properties and modifiers (pure data)
- **Display Layer**: Description generation (presentation)
- **Computation Layer**: Stat calculations (for character stats)

### 3. Preserve HTML Integrity
- Never parse/mangle HTML to add corruption
- Display corruption as separate visual layer
- Keep input boxes functional

## New Architecture

### Data Structure

```javascript
// Per item slot (e.g., "helm-dropdown", "armor-dropdown")
window.itemState = {
  [slotId]: {
    itemName: string,
    baseProperties: {...},          // Deep clone of original item.properties
    modifiers: {
      corruption: {
        text: string,                // Display text
        stats: [{type, value}]       // Parsed stats for calculations
      },
      sockets: [{itemName, stats: [{type, value}]}],
      setBonus: {stats: [{type, value}]},
      upgrade: {stats: [{type, value}]}
    },
    computedProperties: {...}        // Cached result of base + modifiers
  }
}
```

### Key Functions

1. **getBaseProperties(itemName)** - Returns deep clone of original properties
2. **getModifiers(slotId)** - Returns all modifiers for a slot
3. **computeFinalProperties(slotId)** - Applies modifiers to base properties
4. **generateDescription(itemName, properties, slotId)** - Creates HTML from properties
5. **displayCorruption(description, corruptionText)** - Appends corruption visually

## Implementation Flow

### When Item is Selected
```
1. Get base properties from itemList[itemName].properties
2. Initialize itemState[slotId] with baseProperties
3. Load saved modifiers (if any) from persistence
4. Compute final properties
5. Generate description from final properties
6. Append corruption/modifier text visually
```

### When Corruption is Applied
```
1. Parse corruption text into stats [{type, value}]
2. Store in itemState[slotId].modifiers.corruption
3. Recompute final properties (base + corruption)
4. Regenerate description from final properties
5. Append corruption text in red
```

### When Socket is Added
```
1. Parse socket stats into [{type, value}]
2. Add to itemState[slotId].modifiers.sockets
3. Recompute final properties (base + corruption + sockets)
4. Regenerate description from final properties
5. Display modifiers visually
```

### For Dynamic Items with Input Boxes
```
1. Generate description from final properties
   - Variable stats create input boxes
   - Input box values come from computedProperties
2. On input change:
   - Update computedProperties.statName.current
   - Trigger stat counter update
   - NO regeneration needed
```

## Benefits

### No Double Counting
- Base properties never modified
- Corruption applied once during computation
- Description generated from already-computed properties

### HTML Preservation
- Corruption displayed separately (not inserted into description)
- Input boxes remain intact
- Event listeners never broken

### Consistent Stats
- Character counter reads computedProperties
- Description shows computedProperties
- Everything synchronized from single source

### Maintainability
- Clear data flow: base → modifiers → computed → display
- Easy to add new modifier types (auras, shrine buffs, etc.)
- Easy to debug (inspect itemState to see everything)

## Migration Path

1. Create new itemState management functions
2. Update applyCorruptionToItem to use new system
3. Update generateItemDescription to accept computed properties
4. Update updateItemDisplay to use new flow
5. Update stat counter to read computedProperties
6. Remove old property modification code
7. Test all item types

## Testing Strategy

- Regular items (Shako, Harlequin Crest)
- Dynamic items (Arcanna's Deathwand with input boxes)
- Set items (Immortal King's armor, regular and dynamic)
- Multiple corruptions on armor
- Socket + corruption combination
- Variable stats + corruption interaction
