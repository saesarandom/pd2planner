// ===================================================================
// MAIN.JS - Core Application Logic
// Extracted and modernized from index2.html
// ===================================================================

console.log('🚀🚀🚀 MAIN.JS IS LOADING - VERSION 2023 🚀🚀🚀');

// Global state
window.checkboxResistBonus = 0;

// REMOVED: itemDropdownData - now loading directly from itemList in items.js
// This approach is simpler and always in sync with items.json

// Dropdown ID mapping
const DROPDOWN_MAP = {
  helm: 'helms-dropdown',
  merchelm: 'merchelms-dropdown',
  armor: 'armors-dropdown',
  mercarmor: 'mercarmors-dropdown',
  weapon: 'weapons-dropdown',
  mercweapon: 'mercweapons-dropdown',
  shield: 'offs-dropdown',
  mercoff: 'mercoffs-dropdown',
  gloves: 'gloves-dropdown',
  mercgloves: 'mercgloves-dropdown',
  belts: 'belts-dropdown',
  mercbelts: 'mercbelts-dropdown',
  boots: 'boots-dropdown',
  mercboots: 'mercboots-dropdown',
  ringsone: 'ringsone-dropdown',
  ringstwo: 'ringstwo-dropdown',
  amulets: 'amulets-dropdown'
};

// Info div ID mapping
const INFO_DIV_MAP = {
  'weapons-dropdown': 'weapon-info',
  'helms-dropdown': 'helm-info',
  'merchelms-dropdown': 'merc-helm-info',
  'mercarmors-dropdown': 'merc-armor-info',
  'mercweapons-dropdown': 'merc-weapon-info',
  'armors-dropdown': 'armor-info',
  'offs-dropdown': 'off-info',
  'mercoffs-dropdown': 'merc-off-info',
  'gloves-dropdown': 'glove-info',
  'mercgloves-dropdown': 'merc-glove-info',
  'belts-dropdown': 'belt-info',
  'mercbelts-dropdown': 'merc-belt-info',
  'boots-dropdown': 'boot-info',
  'mercboots-dropdown': 'merc-boot-info',
  'ringsone-dropdown': 'ringsone-info',
  'ringstwo-dropdown': 'ringstwo-info',
  'amulets-dropdown': 'amulet-info'
};

// All dropdown IDs
const ALL_DROPDOWNS = [
  'helms-dropdown', 'merchelms-dropdown', 'armors-dropdown', 'mercarmors-dropdown',
  'mercweapons-dropdown', 'weapons-dropdown', 'offs-dropdown', 'mercoffs-dropdown',
  'gloves-dropdown', 'mercgloves-dropdown', 'belts-dropdown', 'mercbelts-dropdown',
  'boots-dropdown', 'mercboots-dropdown', 'ringsone-dropdown', 'ringstwo-dropdown',
  'amulets-dropdown'
];

/**
 * Detect item type from description or baseType
 */
function detectItemType(itemName, item) {
  // If item has baseType, use that directly
  if (item.baseType) {
    const baseType = item.baseType.toLowerCase();

    // Weapons
    if (baseType.includes('sword') || baseType.includes('axe') || baseType.includes('mace') ||
        baseType.includes('hammer') || baseType.includes('spear') || baseType.includes('bow') ||
        baseType.includes('staff') || baseType.includes('dagger') || baseType.includes('wand') ||
        baseType.includes('claw') || baseType.includes('orb') || baseType.includes('javelin') ||
        baseType.includes('polearm') || baseType.includes('scepter') || baseType.includes('scythe')) {
      return 'weapon';
    }

    // Helms
    if (baseType.includes('helm') || baseType.includes('crown') || baseType.includes('cap') ||
        baseType.includes('skull') || baseType.includes('mask') || baseType.includes('circlet') ||
        baseType.includes('headgear') || baseType.includes('horns') || baseType.includes('coif') ||
        baseType.includes('hat')) {
      return 'helm';
    }

    // Armor
    if (baseType.includes('armor') || baseType.includes('mail') || baseType.includes('plate') ||
        baseType.includes('hide') || baseType.includes('leather') || baseType.includes('robe') ||
        baseType.includes('chain') || baseType.includes('coat') || baseType.includes('garb')) {
      return 'armor';
    }

    // Shields
    if (baseType.includes('shield') || baseType.includes('buckler') || baseType.includes('ward')) {
      return 'shield';
    }

    // Gloves
    if (baseType.includes('gloves') || baseType.includes('gauntlet') || baseType.includes('hand')) {
      return 'gloves';
    }

    // Belts
    if (baseType.includes('belt') || baseType.includes('sash')) {
      return 'belts';
    }

    // Boots
    if (baseType.includes('boots') || baseType.includes('greaves') || baseType.includes('treads') ||
        baseType.includes('shoes')) {
      return 'boots';
    }

    // Rings
    if (baseType.includes('ring')) return 'ringsone';

    // Amulets
    if (baseType.includes('amulet')) return 'amulets';
  }

  // Fallback to description-based detection
  if (item.description) {
    const desc = item.description.toLowerCase();

    // Extract base type (second line after first <br>)
    // Format: "ItemName<br>BaseType<br>..."
    const lines = desc.split('<br>');
    const baseTypeLine = lines.length > 1 ? lines[1].trim() : '';

    // Check base type line first for more accurate detection
    if (baseTypeLine) {
      // Belts - check first to avoid "skull" in item names matching helms
      if (baseTypeLine.includes('belt') || baseTypeLine.includes('sash')) {
        return 'belts';
      }

      // Gloves
      if (baseTypeLine.includes('gloves') || baseTypeLine.includes('gauntlet') ||
          baseTypeLine.includes('hand')) {
        return 'gloves';
      }

      // Boots
      if (baseTypeLine.includes('boots') || baseTypeLine.includes('greaves') ||
          baseTypeLine.includes('treads') || baseTypeLine.includes('shoes')) {
        return 'boots';
      }

      // Weapons - use word boundary regex to avoid false matches
      const weaponPattern = /\b(sword|axe|mace|hammer|spear|bow|staff|dagger|wand|claw|orb|javelin|polearm|scepter|scythe|pick|club|flail|blade|knout|star|crossbow|ballista|decapitator|tabar|spetum|trident|halberd|bardiche|partisan|bill|glaive|lance|pike|voulge|maul|martel|whip)\b/;
      if (weaponPattern.test(baseTypeLine)) {
        return 'weapon';
      }

      // Helms
      if (baseTypeLine.includes('helm') || baseTypeLine.includes('crown') ||
          baseTypeLine.includes('cap') || baseTypeLine.includes('mask') ||
          baseTypeLine.includes('circlet') || baseTypeLine.includes('headgear') ||
          baseTypeLine.includes('horns') || baseTypeLine.includes('coif') ||
          baseTypeLine.includes('hat')) {
        return 'helm';
      }

      // Armor
      if (baseTypeLine.includes('armor') || baseTypeLine.includes('mail') ||
          baseTypeLine.includes('plate') || baseTypeLine.includes('hide') ||
          baseTypeLine.includes('leather') || baseTypeLine.includes('robe') ||
          baseTypeLine.includes('chain') || baseTypeLine.includes('coat') ||
          baseTypeLine.includes('garb')) {
        return 'armor';
      }

      // Shields
      if (baseTypeLine.includes('shield') || baseTypeLine.includes('buckler') ||
          baseTypeLine.includes('ward')) {
        return 'shield';
      }

      // Rings
      if (baseTypeLine.includes('ring')) return 'ringsone';

      // Amulets
      if (baseTypeLine.includes('amulet')) return 'amulets';
    }

    // Fallback to full description check if base type line didn't match
    // Weapons - use word boundary regex to avoid false matches (e.g., "absorb" contains "orb")
    const weaponPattern = /\b(sword|axe|mace|hammer|spear|bow|staff|dagger|wand|claw|orb|javelin|polearm|scepter|scythe)\b/;
    if (weaponPattern.test(desc)) {
      return 'weapon';
    }

    // Helms
    if (desc.includes('helm') || desc.includes('crown') || desc.includes('cap') ||
        desc.includes('skull') || desc.includes('mask') || desc.includes('circlet') ||
        desc.includes('headgear') || desc.includes('horns') || desc.includes('coif') ||
        desc.includes('hat')) {
      return 'helm';
    }

    // Armor
    if (desc.includes('armor') || desc.includes('mail') || desc.includes('plate') ||
        desc.includes('hide') || desc.includes('leather') || desc.includes('robe') ||
        desc.includes('chain') || desc.includes('coat') || desc.includes('garb')) {
      return 'armor';
    }

    // Shields
    if (desc.includes('shield') || desc.includes('buckler') || desc.includes('ward')) {
      return 'shield';
    }

    // Gloves
    if (desc.includes('gloves') || desc.includes('gauntlet') || desc.includes('hand')) {
      return 'gloves';
    }

    // Belts
    if (desc.includes('belt') || desc.includes('sash')) {
      return 'belts';
    }

    // Boots
    if (desc.includes('boots') || desc.includes('greaves') || desc.includes('treads') ||
        desc.includes('shoes')) {
      return 'boots';
    }

    // Rings
    if (desc.includes('ring')) return 'ringsone';

    // Amulets
    if (desc.includes('amulet')) return 'amulets';
  }

  return null;
}

/**
 * Populate all item dropdowns by loading from itemList
 */
function populateItemDropdowns() {
  // Check if itemList is available
  if (typeof itemList === 'undefined') {
    setTimeout(populateItemDropdowns, 100);
    return;
  }

  // Create a map to collect items by type
  const itemsByType = {
    weapon: [],
    helm: [],
    armor: [],
    shield: [],
    gloves: [],
    belts: [],
    boots: [],
    ringsone: [],
    ringstwo: [],
    amulets: [],
    // Mercenary item types (same items as regular, just for merc slots)
    mercweapon: [],
    merchelm: [],
    mercarmor: [],
    mercoff: [],
    mercgloves: [],
    mercbelts: [],
    mercboots: []
  };

  let itemCount = 0;

  // Iterate through all items in itemList
  for (const itemName in itemList) {
    const item = itemList[itemName];
    if (!item) {
      continue;
    }

    // Items need either description or baseType
    if (!item.description && !item.baseType) {
      continue;
    }

    itemCount++;
    const itemType = detectItemType(itemName, item);

    // Debug logging for specific problematic items
    if (itemName === "Blackhorn's Face" || itemName === "Raven Frost") {
      console.log(`🐛 Detected ${itemName} as type: ${itemType}`);
      console.log(`   baseType: ${item.baseType}`);
      console.log(`   has description: ${!!item.description}`);
    }

    if (itemType && itemsByType[itemType]) {
      itemsByType[itemType].push(itemName);

      // Rings should appear in BOTH ring slots (you can wear 2 different rings in D2)
      if (itemType === 'ringsone') {
        itemsByType.ringstwo.push(itemName);
      }

      // Add items to mercenary slots as well
      const mercType = 'merc' + itemType;
      if (itemsByType[mercType]) {
        itemsByType[mercType].push(itemName);
      }
    }
  }

  // Add items to their respective dropdowns
  for (const [itemType, items] of Object.entries(itemsByType)) {
    const dropdownId = DROPDOWN_MAP[itemType];
    if (!dropdownId) {
      continue;
    }

    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
      continue;
    }

    // Clear the dropdown first
    dropdown.innerHTML = '<option value="">None</option>';

    // Sort items alphabetically
    items.sort().forEach(itemName => {
      const option = document.createElement('option');
      option.value = itemName;
      option.textContent = itemName;
      dropdown.appendChild(option);
    });
  }
}

/**
 * Get the current value of a property (handles both fixed values and ranges)
 */
function getPropertyValue(prop) {
  if (typeof prop === 'object' && prop !== null && 'current' in prop) {
    return prop.current;
  }
  return prop;
}

/**
 * Generate item description HTML with input boxes for variable stats
 */
window.generateItemDescription = function generateItemDescription(itemName, item, dropdownId) {
  if (!item) return '';

  // Items with baseType are dynamic - always regenerate them
  const isDynamic = item.baseType;

  // If item has a static description AND is not dynamic, use it
  // (Dynamic items always regenerate, even if description was set by corruption)
  if (item.description && !isDynamic) {
    return item.description;
  }

  // Generate dynamic description for items with variable stats
  const props = item.properties || {};

  let html = `${itemName}<br>`;

  // Add base type if available
  if (item.baseType) {
    html += `${item.baseType}<br>`;
  }

  // Map property keys to display format
  const propertyDisplay = {
    defense: (val) => `Defense: ${val}`,
    onehandmin: (val, prop) => `One-Hand Damage: ${val} to ${props.onehandmax || '?'}, Avg ${Math.round((val + (props.onehandmax || 0)) / 2 * 10) / 10}`,
    throwmin: (val, prop) => `Throw Damage: ${val} to ${props.throwmax || '?'}, Avg ${Math.round((val + (props.throwmax || 0)) / 2 * 10) / 10}`,
    onehandmax: () => '', // Skip, handled by onehandmin
    throwmax: () => '', // Skip, handled by throwmin
    reqlvl: (val) => `Required Level: ${val}`,
    reqstr: (val) => `Required Strength: ${val}`,
    reqdex: (val) => `Required Dexterity: ${val}`,
    edmg: (val, prop) => formatVariableStat('+', val, '% Enhanced Damage', prop, itemName, 'edmg', dropdownId),
    toatt: (val, prop) => formatVariableStat('', val, ' to Attack Rating', prop, itemName, 'toatt', dropdownId),
    todef: (val) => `+${val} Defense`,
    tolife: (val) => `+${val} to Life`,
    tomana: (val) => `+${val} to Mana`,
    ias: (val, prop) => formatVariableStat('+', val, '% Increased Attack Speed', prop, itemName, 'ias', dropdownId),
    fhr: (val, prop) => formatVariableStat('+', val, '% Faster Hit Recovery', prop, itemName, 'fhr', dropdownId),
    frw: (val, prop) => formatVariableStat('+', val, '% Faster Run/Walk', prop, itemName, 'frw', dropdownId),
    block: (val, prop) => formatVariableStat('', val, '% Increased Chance of Blocking', prop, itemName, 'block', dropdownId),
    edef: (val, prop) => formatVariableStat('+', val, '% Enhanced Defense', prop, itemName, 'edef', dropdownId),
    repl: (val, prop) => formatVariableStat('Replenish Life +', val, '', prop, itemName, 'repl', dropdownId),
    allsk: (val, prop) => formatVariableStat('+', val, ' to All Skills', prop, itemName, 'allsk', dropdownId),
    str: (val, prop) => formatVariableStat('+', val, ' to Strength', prop, itemName, 'str', dropdownId),
    dex: (val, prop) => formatVariableStat('+', val, ' to Dexterity', prop, itemName, 'dex', dropdownId),
    vit: (val, prop) => formatVariableStat('+', val, ' to Vitality', prop, itemName, 'vit', dropdownId),
    enr: (val, prop) => formatVariableStat('+', val, ' to Energy', prop, itemName, 'enr', dropdownId),
    cb: (val, prop) => formatVariableStat('', val, '% Chance of Crushing Blow', prop, itemName, 'cb', dropdownId),
    magicfind: (val, prop) => formatVariableStat('', val, '% Better Chance of Getting Magic Items', prop, itemName, 'magicfind', dropdownId),
    maxdmgperlvl: (val, prop) => formatLevelScaledStat(val, prop, itemName, 'maxdmgperlvl', dropdownId),
  };

  // Build description from properties
  // Skip certain properties that are metadata or handled elsewhere
  const skipProperties = ['javelin', 'speed', 'onehandmax', 'throwmax'];

  for (const [key, prop] of Object.entries(props)) {
    if (skipProperties.includes(key)) continue;

    console.log('Processing property:', key, prop);
    if (propertyDisplay[key]) {
      const value = getPropertyValue(prop);
      const displayText = propertyDisplay[key](value, prop);
      console.log('Adding to html:', displayText);
      if (displayText) { // Skip empty strings (for properties that are already handled)
        html += displayText + '<br>';
      }
    }
  }

  console.log('Final HTML:', html);
  return html;
}

/**
 * Format a stat that might have a variable range
 */
function formatVariableStat(prefix, value, suffix, prop, itemName, propKey, dropdownId) {
  if (typeof prop === 'object' && prop !== null && 'min' in prop && 'max' in prop) {
    // Variable stat - show with range and input box
    return `${prefix}${value}${suffix} <span style="color: #888;">[${prop.min}-${prop.max}]</span> <input type="number" class="stat-input" data-item="${itemName}" data-prop="${propKey}" data-dropdown="${dropdownId}" min="${prop.min}" max="${prop.max}" value="${value}" style="width: 45px; padding: 2px; background: #1a1a2e; color: #fff; border: 1px solid #0f3460; border-radius: 3px;">`;
  }
  // Fixed stat - show normally
  return `${prefix}${value}${suffix}`;
}

/**
 * Format stats that scale with character level (like maxdmgperlvl)
 */
function formatLevelScaledStat(perLevelValue, prop, itemName, propKey, dropdownId) {
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  const scaledValue = Math.floor(currentLevel * perLevelValue);

  // Calculate min and max range
  // Assuming min is 2 and max is current value * max level (99)
  const minScaled = Math.floor(1 * perLevelValue); // At level 1
  const maxScaled = Math.floor(99 * perLevelValue); // At level 99

  // For True Silver with 2.25: min=2 (at lvl 1), max=222 (at lvl 99), current=scaled value
  return `+[${minScaled}-${maxScaled}] to Maximum Damage (+${perLevelValue} per Character Level)`;
}

/**
 * Handle changes to variable stat inputs
 */
function handleVariableStatChange(itemName, propKey, newValue, dropdownId, skipRegeneration = false) {
  const item = itemList[itemName];
  if (!item || !item.properties || !item.properties[propKey]) return;

  const prop = item.properties[propKey];
  if (typeof prop === 'object' && 'min' in prop && 'max' in prop) {
    // Clamp value to range
    const clampedValue = Math.max(prop.min, Math.min(prop.max, parseInt(newValue) || prop.max));
    prop.current = clampedValue;

    if (!skipRegeneration) {
      // Update the description display
      const infoDivId = INFO_DIV_MAP[dropdownId];
      if (infoDivId) {
        const infoDiv = document.getElementById(infoDivId);
        if (infoDiv) {
          let description = generateItemDescription(itemName, item, dropdownId);

          // If item has corruption, we need to reapply it to the regenerated description
          if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
            const corruption = window.itemCorruptions[dropdownId];
            if (corruption.text) {
              // Get the original description (dynamic, without corruption)
              const originalDynamic = description;
              // Add corruption back to the regenerated description
              if (typeof window.addCorruptionWithStacking === 'function') {
                description = window.addCorruptionWithStacking(originalDynamic, corruption.text);
              }
            }
          }

          infoDiv.innerHTML = description;

          // Re-attach event listeners to the new input boxes
          attachStatInputListeners();
        }
      }
    }

    // Trigger stat recalculation
    if (window.characterManager) {
      window.characterManager.updateTotalStats();
    }

    // Notify socket system to update with the new innerHTML
    if (window.unifiedSocketSystem && typeof window.unifiedSocketSystem.updateAll === 'function') {
      window.unifiedSocketSystem.updateAll();
    }
  }
}

/**
 * Attach event listeners to stat input boxes
 */
window.attachStatInputListeners = function attachStatInputListeners() {
  document.querySelectorAll('.stat-input').forEach(input => {
    // Skip if already has listeners attached
    if (input.dataset.listenersAttached === 'true') return;
    input.dataset.listenersAttached = 'true';

    // Simple input handler - just update the value
    input.addEventListener('input', (e) => {
      const itemName = e.target.dataset.item;
      const propKey = e.target.dataset.prop;
      const dropdownId = e.target.dataset.dropdown;
      const newValue = e.target.value;

      handleVariableStatChange(itemName, propKey, newValue, dropdownId);
    });
  });
}

/**
 * Update item info display when dropdown selection changes
 */
window.updateItemInfo = function updateItemInfo(event) {
  const dropdown = event.target;
  const selectedItemName = dropdown.value;

  const infoDivId = INFO_DIV_MAP[dropdown.id];

  if (!infoDivId) {
    return;
  }

  const infoDiv = document.getElementById(infoDivId);

  if (!infoDiv) {
    return;
  }

  if (!selectedItemName) {
    infoDiv.innerHTML = '';
    return;
  }

  // Try to get item info from itemList
  const item = itemList && itemList[selectedItemName];

  if (item) {
    // Generate description (handles both static and dynamic with variable stats)
    const description = generateItemDescription(selectedItemName, item, dropdown.id);
    infoDiv.innerHTML = description;

    // Attach event listeners to any stat input boxes
    attachStatInputListeners();
  } else {
    // If not in itemList, try to show a basic placeholder
    infoDiv.innerHTML = selectedItemName;
  }

  // Adjust socket count for new item if needed, then update socket system
  const section = SECTION_MAP[dropdown.id];
  if (section && window.unifiedSocketSystem) {
    try {
      // Adjust socket count to match new item's max
      if (typeof window.unifiedSocketSystem.adjustSocketsForItem === 'function') {
        window.unifiedSocketSystem.adjustSocketsForItem(section);
      }

      // Always update to add socket stats to description
      if (typeof window.unifiedSocketSystem.updateAll === 'function') {
        window.unifiedSocketSystem.updateAll();
      }
    } catch (error) {
      console.error('Error updating socket system:', error);
    }
  }
}

/**
 * Set up event handlers for all dropdowns
 */
function setupDropdownHandlers() {
  ALL_DROPDOWNS.forEach(dropdownId => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.addEventListener('change', (event) => {
        try {
          window.updateItemInfo(event);
        } catch (error) {
          console.error('Error in updateItemInfo:', error);
        }
      });
    }
  });
}

/**
 * Initialize socket click handlers
 */
function setupSocketHandlers() {
  let currentSocket = null;

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('socketz')) {
      currentSocket = e.target;
      showItemModal();
    }
  });

  // Socket category tabs
  document.querySelectorAll('.socket-category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.socket-category-tab').forEach(t =>
        t.classList.remove('active'));
      document.querySelectorAll('.socket-content').forEach(c =>
        c.classList.remove('active'));

      this.classList.add('active');
      document.querySelector(`.socket-content[data-category="${this.dataset.category}"]`)
        ?.classList.add('active');
    });
  });
}

/**
 * Update critical hit display
 */
function updateCritDisplay() {
  if (window.skillSystemInstance) {
    const criticalStrike = skillSystemInstance.getCriticalStrikeChance();
    const deadlyStrike = skillSystemInstance.getDeadlyStrikeChance();
    const weaponMastery = skillSystemInstance.getWeaponMasteryChance();

    const combinedCritChance = 1 - ((1 - criticalStrike / 100) * (1 - deadlyStrike / 100) * (1 - weaponMastery / 100));
    const critMultiplier = 1 + (combinedCritChance * 0.5);

    const critElement = document.getElementById('crithitmultipliercontainer');
    if (critElement) {
      critElement.textContent = critMultiplier.toFixed(2);
    }
  }
}

/**
 * Setup checkbox listeners for Anya resistance bonuses
 */
function setupAnyaCheckboxes() {
  document.querySelectorAll('.checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      window.checkboxResistBonus = document.querySelectorAll('.checkbox:checked').length * 10;

      if (window.unifiedSocketSystem?.updateAll) {
        window.unifiedSocketSystem.updateAll();
      }
    });
  });
}

/**
 * Setup event listeners for crit-related changes
 */
function setupCritListeners() {
  // Critical Strike skill input
  document.addEventListener('input', (e) => {
    if (e.target?.id === 'criticalstrikecontainer' || e.target?.id === 'javelinandspearmasterycontainer') {
      updateCritDisplay();
    }
  });

  // Weapon changes (affects deadly strike)
  document.addEventListener('change', (e) => {
    if (e.target?.id === 'weapons-dropdown') {
      updateCritDisplay();
    }
  });
}

/**
 * Main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Populate dropdowns first
  populateItemDropdowns();

  // 2. Setup dropdown event listeners
  setupDropdownHandlers();

  // 3. Setup socket handlers
  setupSocketHandlers();

  // 4. Setup Anya checkbox listeners (delayed to ensure DOM is ready)
  setTimeout(setupAnyaCheckboxes, 100);

  // 5. Setup crit display listeners
  setupCritListeners();

  // 6. Initialize crit display
  setTimeout(updateCritDisplay, 500);

  // 7. Initialize other systems if available
  if (typeof updatePolyLife === 'function') updatePolyLife();

  // 8. Check login state
  const username = localStorage.getItem('username');
  if (username && typeof updateUIState === 'function') {
    updateUIState(username);
  }
});
