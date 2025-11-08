// ===================================================================
// MAIN.JS - Core Application Logic
// Extracted and modernized from index2.html
// ===================================================================

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

// Section mapping
const SECTION_MAP = {
  'weapons-dropdown': 'weapon',
  'merchelms-dropdown': 'merchelm',
  'mercweapons-dropdown': 'mercweapon',
  'mercarmors-dropdown': 'mercarmor',
  'mercoffs-dropdown': 'mercoff',
  'mercgloves-dropdown': 'mercgloves',
  'mercbelts-dropdown': 'mercbelts',
  'mercboots-dropdown': 'mercboots',
  'helms-dropdown': 'helm',
  'armors-dropdown': 'armor',
  'offs-dropdown': 'shield',
  'gloves-dropdown': 'gloves',
  'belts-dropdown': 'belts',
  'boots-dropdown': 'boots',
  'ringsone-dropdown': 'ringone',
  'ringstwo-dropdown': 'ringtwo',
  'amulets-dropdown': 'amulet'
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
 * Detect item type from description
 */
function detectItemType(itemName, description) {
  const desc = description.toLowerCase();

  // Weapons
  if (desc.includes('sword') || desc.includes('axe') || desc.includes('mace') ||
      desc.includes('hammer') || desc.includes('spear') || desc.includes('bow') ||
      desc.includes('staff') || desc.includes('dagger') || desc.includes('wand') ||
      desc.includes('claw') || desc.includes('orb') || desc.includes('javelin') ||
      desc.includes('polearm') || desc.includes('scepter') || desc.includes('scythe')) {
    return 'weapon';
  }

  // Helms
  if (desc.includes('helm') || desc.includes('crown') || desc.includes('cap') ||
      desc.includes('skull') || desc.includes('mask') || desc.includes('circlet') ||
      desc.includes('headgear') || desc.includes('horns') || desc.includes('coif')) {
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

  return null;
}

/**
 * Populate all item dropdowns by loading from itemList
 */
function populateItemDropdowns() {
  console.log('🔍 populateItemDropdowns called');
  console.log('itemList type:', typeof itemList);
  console.log('itemList available:', typeof itemList !== 'undefined');

  // Check if itemList is available
  if (typeof itemList === 'undefined') {
    console.warn('⚠️  itemList not available yet, retrying in 100ms');
    setTimeout(populateItemDropdowns, 100);
    return;
  }

  console.log('✅ itemList is available, starting population...');

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
    amulets: []
  };

  let itemCount = 0;

  // Iterate through all items in itemList
  for (const itemName in itemList) {
    const item = itemList[itemName];
    if (!item || !item.description) {
      console.warn(`⚠️  Item ${itemName} missing description`);
      continue;
    }

    itemCount++;
    const itemType = detectItemType(itemName, item.description);
    console.log(`📦 ${itemName} -> ${itemType}`);

    if (itemType && itemsByType[itemType]) {
      itemsByType[itemType].push(itemName);
    }
  }

  console.log(`📊 Total items processed: ${itemCount}`);
  console.log('📊 Items by type:', {
    weapons: itemsByType.weapon.length,
    helms: itemsByType.helm.length,
    armor: itemsByType.armor.length,
    shields: itemsByType.shield.length,
    gloves: itemsByType.gloves.length,
    belts: itemsByType.belts.length,
    boots: itemsByType.boots.length,
    rings: itemsByType.ringsone.length,
    amulets: itemsByType.amulets.length
  });

  // Add items to their respective dropdowns
  for (const [itemType, items] of Object.entries(itemsByType)) {
    const dropdownId = DROPDOWN_MAP[itemType];
    if (!dropdownId) {
      console.warn(`⚠️  No dropdown mapped for type: ${itemType}`);
      continue;
    }

    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
      console.warn(`⚠️  Dropdown element not found: ${dropdownId}`);
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

    console.log(`✅ Added ${items.length} items to ${dropdownId}`);
  }

  console.log('✅ Dropdowns populated successfully!');
}

/**
 * Update item info display when dropdown selection changes
 */
function updateItemInfo(event) {
  const dropdown = event.target;
  const selectedItemName = dropdown.value;

  const infoDivId = INFO_DIV_MAP[dropdown.id];
  if (!infoDivId) return;

  const infoDiv = document.getElementById(infoDivId);
  if (!infoDiv) return;

  if (!selectedItemName) {
    infoDiv.innerHTML = '';
    return;
  }

  // Try to get item info from itemList
  const item = itemList && itemList[selectedItemName];

  if (item && item.description) {
    infoDiv.innerHTML = item.description;
  } else {
    // If not in itemList, try to show a basic placeholder
    infoDiv.innerHTML = selectedItemName;
  }

  // Trigger unified socket system update if available
  const section = SECTION_MAP[dropdown.id];
  if (section && window.unifiedSocketSystem && typeof window.unifiedSocketSystem.updateAll === 'function') {
    try {
      window.unifiedSocketSystem.updateAll();
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
      dropdown.addEventListener('change', updateItemInfo);
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
  console.log("🎯 Initializing PD2 Planner...");

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

  console.log("✅ PD2 Planner initialized successfully!");
});
