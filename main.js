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

// All dropdown IDs
const ALL_DROPDOWNS = [
  'helms-dropdown', 'merchelms-dropdown', 'armors-dropdown', 'mercarmors-dropdown',
  'mercweapons-dropdown', 'weapons-dropdown', 'offs-dropdown', 'mercoffs-dropdown',
  'gloves-dropdown', 'mercgloves-dropdown', 'belts-dropdown', 'mercbelts-dropdown',
  'boots-dropdown', 'mercboots-dropdown', 'ringsone-dropdown', 'ringstwo-dropdown',
  'amulets-dropdown'
];

// Base type to category mapping - DEFINITIVE source of truth
window.BASE_TYPE_CATEGORIES = {
  // Helms
  'Cap': 'helm', 'Skull Cap': 'helm', 'Helm': 'helm', 'Full Helm': 'helm',
  'Great Helm': 'helm', 'Crown': 'helm', 'Mask': 'helm', 'Bone Helm': 'helm',
  'War Hat': 'helm', 'Sallet': 'helm', 'Casque': 'helm', 'Basinet': 'helm',
  'Winged Helm': 'helm', 'Grand Crown': 'helm', 'Death Mask': 'helm', 'Grim Helm': 'helm',
  'Bone Visage': 'helm', 'Diadem': 'helm', 'Circlet': 'helm', 'Coronet': 'helm',
  'Tiara': 'helm', 'Wolf Head': 'helm', 'Hawk Helm': 'helm', 'Falcon Mask': 'helm',
  'Alpha Helm': 'helm', 'Spirit Mask': 'helm', 'Jaw Bone': 'helm', 'Fanged Helm': 'helm',
  'Horned Helm': 'helm', 'Totemic Mask': 'helm', 'Assault Helmet': 'helm',
  'Avenger Guard': 'helm', 'Sky Spirit': 'helm', 'Targe Helm': 'helm',
  'Blood Spirit': 'helm', 'Sun Spirit': 'helm', 'Earth Spirit': 'helm',
  'Lion Helm': 'helm', 'Rage Mask': 'helm', 'Fury Visor': 'helm', 'Destroyer Helm': 'helm',
  'Conqueror Crown': 'helm', 'Guardian Crown': 'helm', 'Sacred Mask': 'helm',
  'Shako': 'helm', 'Corona': 'helm', 'Hydraskull': 'helm', 'Giant Conch': 'helm', 'Spired Helm': 'helm', 'Demonhead': 'helm',

  // Armors
  'Quilted Armor': 'armor', 'Leather Armor': 'armor', 'Hard Leather Armor': 'armor',
  'Studded Leather': 'armor', 'Ring Mail': 'armor', 'Scale Mail': 'armor',
  'Chain Mail': 'armor', 'Breast Plate': 'armor', 'Splint Mail': 'armor',
  'Plate Mail': 'armor', 'Field Plate': 'armor', 'Gothic Plate': 'armor',
  'Full Plate Mail': 'armor', 'Ancient Armor': 'armor', 'Light Plate': 'armor',
  'Mage Plate': 'armor', 'Ornate Plate': 'armor', 'Templar Coat': 'armor',
  'Sharktooth Armor': 'armor', 'Embossed Plate': 'armor', 'Chaos Armor': 'armor',
  'Sacred Armor': 'armor', 'Ghost Armor': 'armor', 'Serpentskin Armor': 'armor',
  'Demonhide Armor': 'armor', 'Trellised Armor': 'armor', 'Linked Mail': 'armor',
  'Tigulated Mail': 'armor', 'Mesh Armor': 'armor', 'Cuirass': 'armor',
  'Russet Armor': 'armor', 'Boneweave': 'armor', 'Great Hauberk': 'armor',
  'Balrog Skin': 'armor', 'Hellforge Plate': 'armor', 'Kraken Shell': 'armor',
  'Lacquered Plate': 'armor', 'Shadow Plate': 'armor', 'Scarab Husk': 'armor',
  'Wire Fleece': 'armor', 'Diamond Mail': 'armor', 'Loricated Mail': 'armor',
  'Archon Plate': 'armor', 'Wyrmhide': 'armor', 'Dusk Shroud': 'armor',

  // Shields
  'Buckler': 'shield', 'Small Shield': 'shield', 'Large Shield': 'shield',
  'Kite Shield': 'shield', 'Tower Shield': 'shield', 'Gothic Shield': 'shield',
  'Bone Shield': 'shield', 'Spiked Shield': 'shield', 'Defender': 'shield',
  'Round Shield': 'shield', 'Scutum': 'shield', 'Dragon Shield': 'shield',
  'Pavilion Shield': 'shield', 'Ancient Shield': 'shield', 'Targe': 'shield',
  'Rondache': 'shield', 'Heater': 'shield', 'Luna': 'shield', 'Hyperion': 'shield',
  'Monarch': 'shield', 'Aegis': 'shield', 'Ward': 'shield', 'Grim Shield': 'shield',
  'Barbed Shield': 'shield', 'Blade Barrier': 'shield', 'Troll Nest': 'shield',
  'Akaran Targe': 'shield', 'Akaran Rondache': 'shield', 'Protector Shield': 'shield',
  'Gilded Shield': 'shield', 'Royal Shield': 'shield', 'Sacred Targe': 'shield',
  'Sacred Rondache': 'shield', 'Kurast Shield': 'shield', 'Zakarum Shield': 'shield',
  'Vortex Shield': 'shield', 'Blunt Arrows': 'shield',

  // Gloves
  'Leather Gloves': 'gloves', 'Heavy Gloves': 'gloves', 'Chain Gloves': 'gloves',
  'Light Gauntlets': 'gloves', 'Gauntlets': 'gloves', 'Demonhide Gloves': 'gloves',
  'Sharkskin Gloves': 'gloves', 'Heavy Bracers': 'gloves', 'Battle Gauntlets': 'gloves',
  'War Gauntlets': 'gloves', 'Bramble Mitts': 'gloves', 'Vampirebone Gloves': 'gloves',
  'Vambraces': 'gloves', 'Crusader Gauntlets': 'gloves', 'Ogre Gauntlets': 'gloves',

  // Belts
  'Sash': 'belts', 'Light Belt': 'belts', 'Belt': 'belts', 'Heavy Belt': 'belts',
  'Plated Belt': 'belts', 'Demonhide Sash': 'belts', 'Sharkskin Belt': 'belts',
  'Mesh Belt': 'belts', 'Battle Belt': 'belts', 'War Belt': 'belts',
  'Spiderweb Sash': 'belts', 'Vampirefang Belt': 'belts', 'Mithril Coil': 'belts',
  'Troll Belt': 'belts', 'Colossus Girdle': 'belts',

  // Boots
  'Boots': 'boots', 'Heavy Boots': 'boots', 'Chain Boots': 'boots',
  'Light Plated Boots': 'boots', 'Greaves': 'boots', 'Demonhide Boots': 'boots',
  'Sharkskin Boots': 'boots', 'Mesh Boots': 'boots', 'Battle Boots': 'boots',
  'War Boots': 'boots', 'Wyrmhide Boots': 'boots', 'Scarabshell Boots': 'boots',
  'Boneweave Boots': 'boots', 'Mirrored Boots': 'boots', 'Myrmidon Greaves': 'boots',

  // Rings
  'Ring': 'ringsone',

  // Amulets
  'Amulet': 'amulets',

  // Weapons - Axes
  'Hand Axe': 'weapon', 'Axe': 'weapon', 'Double Axe': 'weapon',
  'Military Pick': 'weapon', 'War Axe': 'weapon', 'Large Axe': 'weapon',
  'Broad Axe': 'weapon', 'Battle Axe': 'weapon', 'Great Axe': 'weapon',
  'Giant Axe': 'weapon', 'Hatchet': 'weapon', 'Cleaver': 'weapon',
  'Twin Axe': 'weapon', 'Crowbill': 'weapon', 'Naga': 'weapon',
  'Military Axe': 'weapon', 'Bearded Axe': 'weapon', 'Tabar': 'weapon',
  'Gothic Axe': 'weapon', 'Ancient Axe': 'weapon', 'Tomahawk': 'weapon',
  'Small Crescent': 'weapon', 'Ettin Axe': 'weapon', 'War Spike': 'weapon',
  'Berserker Axe': 'weapon', 'Feral Axe': 'weapon', 'Silver Edged Axe': 'weapon',
  'Decapitator': 'weapon', 'Champion Axe': 'weapon', 'Glorious Axe': 'weapon',

  // Weapons - Swords
  'Short Sword': 'weapon', 'Scimitar': 'weapon', 'Sabre': 'weapon',
  'Falchion': 'weapon', 'Crystal Sword': 'weapon', 'Broad Sword': 'weapon',
  'Long Sword': 'weapon', 'War Sword': 'weapon', 'Two-Handed Sword': 'weapon',
  'Claymore': 'weapon', 'Giant Sword': 'weapon', 'Bastard Sword': 'weapon',
  'Flamberge': 'weapon', 'Great Sword': 'weapon', 'Gladius': 'weapon',
  'Cutlass': 'weapon', 'Shamshir': 'weapon', 'Tulwar': 'weapon',
  'Dimensional Blade': 'weapon', 'Battle Sword': 'weapon', 'Rune Sword': 'weapon',
  'Ancient Sword': 'weapon', 'Espandon': 'weapon', 'Dacian Falx': 'weapon',
  'Tusk Sword': 'weapon', 'Gothic Sword': 'weapon', 'Zweihander': 'weapon',
  'Executioner Sword': 'weapon', 'Blade': 'weapon', 'Falcata': 'weapon',
  'Ataghan': 'weapon', 'Elegant Blade': 'weapon', 'Hydra Edge': 'weapon',
  'Phase Blade': 'weapon', 'Conquest Sword': 'weapon', 'Cryptic Sword': 'weapon',
  'Mythical Sword': 'weapon', 'Legend Sword': 'weapon', 'Highland Blade': 'weapon',
  'Balrog Blade': 'weapon', 'Champion Sword': 'weapon', 'Colossus Sword': 'weapon',
  'Colossus Blade': 'weapon',

  // Weapons - Maces/Hammers
  'Club': 'weapon', 'Spiked Club': 'weapon', 'Mace': 'weapon',
  'Morning Star': 'weapon', 'Flail': 'weapon', 'War Hammer': 'weapon',
  'Maul': 'weapon', 'Great Maul': 'weapon', 'Cudgel': 'weapon',
  'Barbed Club': 'weapon', 'Flanged Mace': 'weapon', 'Jagged Star': 'weapon',
  'Knout': 'weapon', 'Battle Hammer': 'weapon', 'War Club': 'weapon',
  'Martel de Fer': 'weapon', 'Truncheon': 'weapon', 'Tyrant Club': 'weapon',
  'Reinforced Mace': 'weapon', 'Devil Star': 'weapon', 'Scourge': 'weapon',
  'Legendary Mallet': 'weapon', 'Ogre Maul': 'weapon', 'Thunder Maul': 'weapon',

  // Weapons - Spears/Javelins/Polearms
  'Javelin': 'weapon', 'Maiden Javelin': 'weapon', 'Pilum': 'weapon', 'Short Spear': 'weapon',
  'Glaive': 'weapon', 'Throwing Spear': 'weapon', 'Spear': 'weapon',
  'Trident': 'weapon', 'Brandistock': 'weapon', 'Spetum': 'weapon',
  'Pike': 'weapon', 'Bardiche': 'weapon', 'Voulge': 'weapon',
  'Scythe': 'weapon', 'Poleaxe': 'weapon', 'Halberd': 'weapon',
  'War Scythe': 'weapon', 'War Javelin': 'weapon', 'Great Pilum': 'weapon',
  'Simbilan': 'weapon', 'Spiculum': 'weapon', 'Harpoon': 'weapon',
  'War Spear': 'weapon', 'Fuscina': 'weapon', 'War Fork': 'weapon',
  'Yari': 'weapon', 'Lance': 'weapon', 'Lochaber Axe': 'weapon',
  'Bill': 'weapon', 'Battle Scythe': 'weapon', 'Partizan': 'weapon',
  'Bec-de-Corbin': 'weapon', 'Grim Scythe': 'weapon', 'Hyperion Javelin': 'weapon',
  'Stygian Pilum': 'weapon', 'Balrog Spear': 'weapon', 'Ghost Glaive': 'weapon',
  'Winged Harpoon': 'weapon', 'Hyperion Spear': 'weapon', 'Stygian Pike': 'weapon',
  'Mancatcher': 'weapon', 'Ghost Spear': 'weapon', 'War Pike': 'weapon',
  'Ogre Axe': 'weapon', 'Colossus Voulge': 'weapon', 'Thresher': 'weapon',
  'Cryptic Axe': 'weapon', 'Great Poleaxe': 'weapon', 'Giant Thresher': 'weapon',

  // Weapons - Bows/Crossbows
  'Short Bow': 'weapon', 'Hunter\'s Bow': 'weapon', 'Long Bow': 'weapon',
  'Composite Bow': 'weapon', 'Short Battle Bow': 'weapon', 'Long Battle Bow': 'weapon',
  'Short War Bow': 'weapon', 'Long War Bow': 'weapon', 'Edge Bow': 'weapon',
  'Razor Bow': 'weapon', 'Cedar Bow': 'weapon', 'Double Bow': 'weapon',
  'Short Siege Bow': 'weapon', 'Large Siege Bow': 'weapon', 'Rune Bow': 'weapon',
  'Gothic Bow': 'weapon', 'Spider Bow': 'weapon', 'Blade Bow': 'weapon',
  'Shadow Bow': 'weapon', 'Great Bow': 'weapon', 'Diamond Bow': 'weapon',
  'Crusader Bow': 'weapon', 'Ward Bow': 'weapon', 'Hydra Bow': 'weapon',
  'Light Crossbow': 'weapon', 'Crossbow': 'weapon', 'Heavy Crossbow': 'weapon',
  'Repeating Crossbow': 'weapon', 'Arbalest': 'weapon', 'Siege Crossbow': 'weapon',
  'Ballista': 'weapon', 'Chu-Ko-Nu': 'weapon', 'Pellet Bow': 'weapon',
  'Gorgon Crossbow': 'weapon', 'Colossus Crossbow': 'weapon', 'Demon Crossbow': 'weapon',

  // Weapons - Staves/Wands
  'Short Staff': 'weapon', 'Long Staff': 'weapon', 'Gnarled Staff': 'weapon',
  'Battle Staff': 'weapon', 'War Staff': 'weapon', 'Jo Staff': 'weapon',
  'Quarterstaff': 'weapon', 'Cedar Staff': 'weapon', 'Gothic Staff': 'weapon',
  'Rune Staff': 'weapon', 'Walking Stick': 'weapon', 'Stalagmite': 'weapon',
  'Elder Staff': 'weapon', 'Shillelagh': 'weapon', 'Archon Staff': 'weapon',
  'Wand': 'weapon', 'Yew Wand': 'weapon', 'Bone Wand': 'weapon',
  'Grim Wand': 'weapon', 'Burnt Wand': 'weapon', 'Petrified Wand': 'weapon',
  'Tomb Wand': 'weapon', 'Grave Wand': 'weapon', 'Polished Wand': 'weapon',
  'Ghost Wand': 'weapon', 'Lich Wand': 'weapon', 'Unearthed Wand': 'weapon',

  // Weapons - Scepters
  'Scepter': 'weapon', 'Grand Scepter': 'weapon', 'War Scepter': 'weapon',
  'Rune Scepter': 'weapon', 'Holy Water Sprinkler': 'weapon', 'Divine Scepter': 'weapon',
  'Mighty Scepter': 'weapon', 'Seraph Rod': 'weapon', 'Caduceus': 'weapon',

  // Weapons - Daggers/Throwing
  'Dagger': 'weapon', 'Dirk': 'weapon', 'Kriss': 'weapon',
  'Blade': 'weapon', 'Throwing Knife': 'weapon', 'Throwing Axe': 'weapon',
  'Balanced Knife': 'weapon', 'Balanced Axe': 'weapon', 'Poignard': 'weapon',
  'Rondel': 'weapon', 'Cinquedeas': 'weapon', 'Stiletto': 'weapon',
  'Battle Dart': 'weapon', 'Francisca': 'weapon', 'War Dart': 'weapon',
  'Hurlbat': 'weapon', 'Bone Knife': 'weapon', 'Mithril Point': 'weapon',
  'Fanged Knife': 'weapon', 'Legend Spike': 'weapon', 'Flying Knife': 'weapon',
  'Flying Axe': 'weapon', 'Winged Knife': 'weapon', 'Winged Axe': 'weapon',

  // Weapons - Class-specific
  'Katar': 'weapon', 'Wrist Blade': 'weapon', 'Hatchet Hands': 'weapon',
  'Cestus': 'weapon', 'Claws': 'weapon', 'Blade Talons': 'weapon',
  'Scissors Katar': 'weapon', 'Quhab': 'weapon', 'Wrist Spike': 'weapon',
  'Fascia': 'weapon', 'Hand Scythe': 'weapon', 'Greater Claws': 'weapon',
  'Greater Talons': 'weapon', 'Scissors Quhab': 'weapon', 'Suwayyah': 'weapon',
  'Wrist Sword': 'weapon', 'War Fist': 'weapon', 'Battle Cestus': 'weapon',
  'Feral Claws': 'weapon', 'Runic Talons': 'weapon', 'Scissors Suwayyah': 'weapon',
  'Orb': 'weapon', 'Eagle Orb': 'weapon', 'Sacred Globe': 'weapon',
  'Smoked Sphere': 'weapon', 'Clasped Orb': 'weapon', 'Jared\'s Stone': 'weapon',
  'Stag Bow': 'weapon', 'Matriarchal Bow': 'weapon', 'Ceremonial Bow': 'weapon',
  'Ashwood Bow': 'weapon', 'Ceremonial Spear': 'weapon', 'Matriarchal Spear': 'weapon',
  'Ceremonial Javelin': 'weapon', 'Matriarchal Javelin': 'weapon'
};

/**
 * Get item category from base type
 */
function getItemCategory(item) {
  if (!item) return null;

  // Check if item has explicit baseType
  if (item.baseType && BASE_TYPE_CATEGORIES[item.baseType]) {
    return BASE_TYPE_CATEGORIES[item.baseType];
  }

  // Fallback: try to extract from description
  if (item.description) {
    const lines = item.description.split('<br>');
    if (lines.length > 1) {
      const baseTypeLine = lines[1].trim();
      if (BASE_TYPE_CATEGORIES[baseTypeLine]) {
        return BASE_TYPE_CATEGORIES[baseTypeLine];
      }
    }
  }

  return null;
}

/**
 * Detect item type from description or baseType
 */
function detectItemType(itemName, item) {
  // Use the new category system
  return getItemCategory(item);
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

    // Add crafted items (from user's account or loaded from shared build)
    if (window.craftedItemsSystem) {
      let craftedItemType = itemType;

      // Handle mercenary dropdowns: remove 'merc' prefix
      if (craftedItemType.startsWith('merc')) {
        craftedItemType = craftedItemType.replace(/^merc/, '');
        // mercoff -> shield
        if (craftedItemType === 'off') craftedItemType = 'shield';
      }

      // Both ring slots should get the same ring items
      if (craftedItemType === 'ringstwo') craftedItemType = 'ringsone';

      const craftedItems = window.craftedItemsSystem.getCraftedItemsByType(craftedItemType);
      craftedItems.forEach(craftedItem => {
        const option = document.createElement('option');
        option.value = craftedItem.fullName;
        option.textContent = craftedItem.fullName;
        dropdown.appendChild(option);
      });
    }
  }
}

// Expose for use from character-data.js when loading builds
window.populateItemDropdowns = populateItemDropdowns;

/**
 * Global item lookup - checks both regular items and crafted items
 * @param {string} itemName - Item name (full name for crafted items)
 * @returns {Object|null} Item data or null if not found
 */
window.getItemData = function (itemName) {
  // Check if it's a crafted item first
  if (window.craftedItemsSystem?.isCraftedItem(itemName)) {
    return window.craftedItemsSystem.getCraftedItemByName(itemName);
  }
  // Otherwise check regular items
  return itemList[itemName] || null;
};

/**
 * Get the current value of a property (handles both fixed values and ranges)
 */
function getPropertyValue(prop) {
  if (typeof prop === 'object' && prop !== null) {
    // If it's a variable stat object with min/max
    if ('max' in prop) {
      // Return current if valid, otherwise default to max
      if ('current' in prop && typeof prop.current === 'number') {
        return prop.current;
      }
      return prop.max;
    }
    // If current exists but no max, return current
    if ('current' in prop) {
      return prop.current;
    }
  }
  return prop;
}

/**
 * Generate item description HTML with input boxes for variable stats
 */
window.generateItemDescription = function generateItemDescription(itemName, item, dropdownId) {
  if (!item) return '';

  // Items with baseType are dynamic - always regenerate them (includes crafted items)
  const isDynamic = item.baseType || item.isCrafted;

  // If item has a static description AND is not dynamic, use it
  // (Dynamic items always regenerate, even if description was set by corruption)
  if (item.description && !isDynamic) {
    return item.description;
  }

  // Generate dynamic description for items with variable stats
  const props = item.properties || {};

  // CRITICAL FIX: Ensure weapons never have a defense property
  // This prevents "Defense: 0" or "Defense: NaN" from appearing at the top of the tooltip
  const isWeapon = item.itemType === 'weapon' ||
    (item.baseType && window.BASE_TYPE_CATEGORIES && window.BASE_TYPE_CATEGORIES[item.baseType] === 'weapon') ||
    (item.baseType && window.baseDamages && (window.baseDamages[item.baseType] || window.baseDamages[item.baseType + " (1h)"] || window.baseDamages[item.baseType + " (melee)"]));

  if (isWeapon && props.defense !== undefined) {
    delete props.defense;
  }

  let html = '';

  // Special display for crafted items: show name + craft type label
  if (item.isCrafted && item.craftTypeLabel) {
    html += `<span style="color: #FF9900;">${item.name} ${item.craftTypeLabel}</span><br>`;
  } else {
    html += `${itemName}<br>`;
  }

  // Add base type if available
  if (item.baseType) {
    html += `${item.baseType}<br>`;
  }

  // Calculate weapon damage for dynamic items with baseType
  // This includes both crafted items AND regular dynamic items like True Silver
  if (item.baseType && typeof baseDamages !== 'undefined' && baseDamages[item.baseType]) {
    const baseDmg = baseDamages[item.baseType];
    const edmgValue = getPropertyValue(props.edmg || 0);

    // Apply ethereal multiplier to base damage if ethereal
    const ethMult = props.ethereal ? 1.5 : 1;
    const ethBaseMin = Math.floor(baseDmg.min * ethMult);
    const ethBaseMax = Math.floor(baseDmg.max * ethMult);

    // Calculate damage with enhanced damage modifier
    // Formula: floor(base * (1 + edmg/100))
    let minDmg = Math.floor(ethBaseMin * (1 + edmgValue / 100));
    let maxDmg = Math.floor(ethBaseMax * (1 + edmgValue / 100));

    // Add level-scaled damage bonus if present (e.g., True Silver's +2.25 max damage per level)
    if (props.maxdmgperlvl) {
      const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
      const levelScaledBonus = Math.floor(currentLevel * getPropertyValue(props.maxdmgperlvl));
      maxDmg += levelScaledBonus;
    }

    // Determine weapon type
    const isTwoHandedOnly = typeof twoHandedOnlyWeapons !== 'undefined' && twoHandedOnlyWeapons.has(item.baseType);
    const isVersatile = typeof versatileWeapons !== 'undefined' && versatileWeapons.has(item.baseType);

    // Add to properties so it gets displayed
    if (isTwoHandedOnly) {
      // Two-handed only: show only two-hand damage
      props.twohandmin = minDmg;
      props.twohandmax = maxDmg;
    } else if (isVersatile) {
      // Versatile weapons: show both one-hand and two-hand damage (same values)
      props.onehandmin = minDmg;
      props.onehandmax = maxDmg;
      props.twohandmin = minDmg;
      props.twohandmax = maxDmg;
    } else {
      // One-handed only
      props.onehandmin = minDmg;
      props.onehandmax = maxDmg;
    }
  }

  // Calculate defense for dynamic armor/helms with baseType
  // ONLY if it's a defensive item (helm, armor, shield, etc.) present in baseDefenses
  if (!isWeapon && item.baseType && window.baseDefenses && window.baseDefenses[item.baseType]) {
    // Check if this is armor or helm
    if (window.baseDefenses && window.baseDefenses[item.baseType]) {
      const baseDef = window.baseDefenses[item.baseType];
      const edefValue = getPropertyValue(props.edef || 0);
      const todefValue = getPropertyValue(props.todef || 0);

      // Apply ethereal multiplier to base defense if ethereal
      const ethMult = props.ethereal ? 1.5 : 1;
      const ethBaseDef = Math.floor(baseDef * ethMult);

      // Calculate defense with enhanced defense modifier and flat defense bonus
      // Formula: floor(base * (1 + edef/100)) + todef
      const finalDef = Math.floor(ethBaseDef * (1 + edefValue / 100)) + todefValue;

      // Just set the property - DON'T add html here
      // The propertyDisplay loop will handle displaying it
      props.defense = finalDef;
    }
  }

  // Base defense values for different item types
  const baseDefenseMap = {
    'Buckler': 6,
    'Kite Shield': 18,
    'Light Plate': 99,
    'Skull Cap': 11,
    'Demonhide Sash': 34,
    'Small Shield': 10,
    'Large Shield': 14,
    'Spiked Shield': 25,
    'Bone Shield': 30,
    'Tower Shield': 25,
    'Gothic Shield': 35,
    'Defender': 49,
    'Demonhide Gloves': 35,
    'Sharkskin Belt': 36,
    'Mesh Belt': 40,
  };

  // Calculate dynamic defense if item has edef
  let calculatedDefense = null;
  let defenseDisplay = null;
  if (!isWeapon && props.edef && item.baseType && baseDefenseMap[item.baseType]) {
    const baseItemDefense = baseDefenseMap[item.baseType];
    const edefValue = getPropertyValue(props.edef || 0);
    const todefValue = getPropertyValue(props.todef || 0);

    // Apply ethereal multiplier to base defense if ethereal
    const ethMult = props.ethereal ? 1.5 : 1;
    const ethBaseDef = Math.floor(baseItemDefense * ethMult);

    // Formula: floor((base + 1) * (1 + edef/100)) + todef
    calculatedDefense = Math.floor((ethBaseDef + 1) * (1 + edefValue / 100)) + todefValue;

    // TODO: Add min/max defense range display in future
    // For now, just show the current calculated defense value
    // const edefProp = props.edef;
    // if (typeof edefProp === 'object' && edefProp.min && edefProp.max) {
    //   const minDef = Math.floor((baseItemDefense + 1) * (1 + edefProp.min / 100)) + todefValue;
    //   const maxDef = Math.floor((baseItemDefense + 1) * (1 + edefProp.max / 100)) + todefValue;
    //   if (minDef !== maxDef) {
    //     defenseDisplay = `Defense: ${calculatedDefense} (${minDef}-${maxDef})`;
    //   } else {
    //     defenseDisplay = `Defense: ${calculatedDefense}`;
    //   }
    // } else {
    //   defenseDisplay = `Defense: ${calculatedDefense}`;
    // }

    defenseDisplay = `Defense: ${calculatedDefense}`;
  }

  // Map property keys to display format
  const propertyDisplay = {
    defense: (val) => {
      // Secondary safety check: don't show defense line for weapons, 0 value, or NaN
      const isWeapon = item.itemType === 'weapon' ||
        (item.baseType && window.BASE_TYPE_CATEGORIES && window.BASE_TYPE_CATEGORIES[item.baseType] === 'weapon') ||
        (item.baseType && window.baseDamages && (window.baseDamages[item.baseType] || window.baseDamages[item.baseType + " (1h)"] || window.baseDamages[item.baseType + " (melee)"]));
      if (isWeapon || !val || isNaN(val)) return '';
      // If defenseDisplay is set (from edef calculation), use it
      if (defenseDisplay !== null) return defenseDisplay;

      // Calculate defense per level bonus if it exists
      let defenseBonus = 0;
      if (props.defperlevel) {
        const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
        defenseBonus = Math.floor(props.defperlevel * currentLevel);
      }

      // For static defense values with ethereal, recalculate from base defense
      if (props.ethereal && val && item.baseType) {
        // Look up base defense from baseDefenses table (defined in itemUpgrade.js)
        const baseDefense = window.baseDefenses ? window.baseDefenses[item.baseType] : null;

        if (baseDefense !== null && baseDefense !== undefined) {
          // Apply ethereal to base: floor(base * 1.5)
          const ethBase = Math.floor(baseDefense * 1.5);

          // Add todef if it exists
          const todefValue = getPropertyValue(props.todef || 0);
          const finalDefense = ethBase + todefValue + defenseBonus;

          return `Defense: ${finalDefense}`;
        }
      }

      return `Defense: ${val + defenseBonus}`;
    },
    smitedmgmin: (val, prop) => `Smite Damage: ${val} to ${props.smitedmgmax || '?'}`,
    smitedmgmax: () => '', // Skip, handled by smitedmgmin
    onehandmin: (val, prop) => `One-Hand Damage: ${val} to ${props.onehandmax || '?'}, Avg ${Math.round((val + (props.onehandmax || 0)) / 2 * 10) / 10}`,
    twohandmin: (val, prop) => `Two-Hand Damage: ${val} to ${props.twohandmax || '?'}, Avg ${Math.round((val + (props.twohandmax || 0)) / 2 * 10) / 10}`,
    throwmin: (val, prop) => `Throw Damage: ${val} to ${props.throwmax || '?'}, Avg ${Math.round((val + (props.throwmax || 0)) / 2 * 10) / 10}`,
    onehandmax: () => '', // Skip, handled by onehandmin
    twohandmax: () => '', // Skip, handled by twohandmin
    throwmax: () => '', // Skip, handled by throwmin
    reqlvl: (val) => `Required Level: ${val}`,
    reqstr: (val) => `Required Strength: ${val}`,
    reqdex: (val) => `Required Dexterity: ${val}`,
    dur: (val) => ` +${val} Durability`,
    block1: (val) => `Chance to Block: ${val}%`,
    edmg: (val, prop) => formatVariableStat('+', val, '% Enhanced Damage', prop, itemName, 'edmg', dropdownId),
    toatt: (val, prop) => formatVariableStat('+', val, ' to Attack Rating', prop, itemName, 'toatt', dropdownId),
    toattpercent: (val, prop) => formatVariableStat('+', val, '% Bonus to Attack Rating', prop, itemName, 'toattpercent', dropdownId),
    attpercent: (val, prop) => formatVariableStat('+', val, '% Bonus to Attack Rating', prop, itemName, 'attpercent', dropdownId),
    attperlevel: (val, prop) => formatLevelScaledStat(val, prop, itemName, 'attperlevel', dropdownId, ' to Attack Rating'),
    todef: (val, prop) => formatVariableStat('+', val, ' Defense', prop, itemName, 'todef', dropdownId),
    tolife: (val) => `+${val} to Life`,
    tomana: (val) => `+${val} to Mana`,
    tomaxdmg: (val, prop) => formatVariableStat('+', val, ' to Maximum Damage', prop, itemName, 'tomaxdmg', dropdownId),
    ias: (val, prop) => formatVariableStat('+', val, '% Increased Attack Speed', prop, itemName, 'ias', dropdownId),
    fbr: (val, prop) => formatVariableStat('+', val, '% Faster Block Rate', prop, itemName, 'fbr', dropdownId),
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
    allres: (val, prop) => formatVariableStat('All Resistances +', val, '', prop, itemName, 'allres', dropdownId),
    cb: (val, prop) => formatVariableStat('', val, '% Chance of Crushing Blow', prop, itemName, 'cb', dropdownId),
    deadly: (val, prop) => formatVariableStat('', val, '% Deadly Strike', prop, itemName, 'deadly', dropdownId),
    dmgtoun: (val, prop) => formatVariableStat('+', val, '% Damage to Undead', prop, itemName, 'dmgtoun', dropdownId),
    toattun: (val, prop) => formatVariableStat('+', val, ' to Attack Rating against Undead', prop, itemName, 'toattun', dropdownId),
    skmastery: (val, prop) => formatVariableStat('+', val, ' to Skeleton Mastery (Necromancer Only)', prop, itemName, 'skmastery', dropdownId),
    raiseskwarrior: (val, prop) => formatVariableStat('+', val, ' to Raise Skeleton Warrior (Necromancer Only)', prop, itemName, 'raiseskwarrior', dropdownId),
    sorsk: (val, prop) => formatVariableStat('+', val, ' to Sorceress Skill Levels', prop, itemName, 'sorsk', dropdownId),
    amask: (val, prop) => formatVariableStat('+', val, ' to Amazon Skill Levels', prop, itemName, 'amask', dropdownId),
    necsk: (val, prop) => formatVariableStat('+', val, ' to Necromancer Skill Levels', prop, itemName, 'necsk', dropdownId),
    barsk: (val, prop) => formatVariableStat('+', val, ' to Barbarian Skill Levels', prop, itemName, 'barsk', dropdownId),
    palsk: (val, prop) => formatVariableStat('+', val, ' to Paladin Skill Levels', prop, itemName, 'palsk', dropdownId),
    drusk: (val, prop) => formatVariableStat('+', val, ' to Druid Skill Levels', prop, itemName, 'drusk', dropdownId),
    assk: (val, prop) => formatVariableStat('+', val, ' to Assassin Skill Levels', prop, itemName, 'assk', dropdownId),
    irongolemoskill: (val, prop) => formatVariableStat('+', val, ' to Iron Golem', prop, itemName, 'irongolemoskill', dropdownId),
    golemmasteryoskill: (val, prop) => formatVariableStat('+', val, ' to Golem Mastery', prop, itemName, 'golemmasteryoskill', dropdownId),
    maidencharges: (val, prop) => {
      const level = props.maidenchargeslevel || 12;
      return `Level ${level} Iron Maiden (${val} Charges)`;
    },
    maidenchargeslevel: () => '', // Skip, handled by maidencharges
    fcr: (val, prop) => formatVariableStat('+', val, '% Faster Cast Rate', prop, itemName, 'fcr', dropdownId),
    // lightrad: (val, prop) => formatVariableStat(val >= 0 ? '+' : '', val, ' to Light Radius', prop, itemName, 'lightrad', dropdownId),
    plr: (val, prop) => formatVariableStat('Poison Length Reduced by ', val, '%', prop, itemName, 'plr', dropdownId),
    bonearmorctcstruck: (val, prop) => {
      // val is an object like { chance: 10, level: 15 }
      if (typeof val === 'object' && val.chance && val.level) {
        return `${val.chance}% Chance to Cast Level ${val.level} Bone Armor when Struck`;
      }
      // Fallback for old format or simple values
      return `${val}% Chance to Cast Level 15 Bone Armor when Struck`;
    },
    defperlevel: (val, prop) => {
      // Calculate total defense based on character level
      const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
      const totalDefense = Math.floor(val * currentLevel);
      return `+${totalDefense} Defense (+${val} per Character Level)`;
    },
    ctcbonespearcast: (val, prop) => {
      const level = props.ctcbonespearcastlevel || 2;
      return `${val}% Chance to Cast Level ${level} Bone Spear on Cast`;
    },
    magicfind: (val, prop) => formatVariableStat('', val, '% Better Chance of Getting Magic Items', prop, itemName, 'magicfind', dropdownId),
    goldfind: (val, prop) => formatVariableStat('', val, '% Extra Gold from Monsters', prop, itemName, 'goldfind', dropdownId),
    poisonpierce: (val, prop) => formatVariableStat('-', val, '% to Enemy Poison Resistance', prop, itemName, 'poisonpierce', dropdownId),
    coldsk: (val, prop) => formatVariableStat('+', val, ' to Cold Skills', prop, itemName, 'coldsk', dropdownId),
    magicsk: (val, prop) => formatVariableStat('+', val, ' to Magic Skills', prop, itemName, 'magicsk', dropdownId),
    firesk: (val, prop) => formatVariableStat('+', val, ' to Fire Skills', prop, itemName, 'firesk', dropdownId),
    owdmg: (val, prop) => formatVariableStat('+', val, ' Open Wounds Damage per Second', prop, itemName, 'owdmg', dropdownId),
    sancaura: (val, prop) => formatVariableStat('Level ', val, ' Sanctuary Aura when Equipped', prop, itemName, 'sancaura', dropdownId),
    maxdmgperlvl: (val, prop) => formatLevelScaledStat(val, prop, itemName, 'maxdmgperlvl', dropdownId),
    todeflvl: (val, prop) => formatLevelScaledStat(val, prop, itemName, 'todeflvl', dropdownId, ' Defense'),
    lleech: (val, prop) => formatVariableStat('', val, '% Life Stolen per Hit', prop, itemName, 'lleech', dropdownId),
    mleech: (val, prop) => formatVariableStat('', val, '% Mana Stolen per Hit', prop, itemName, 'mleech', dropdownId),
    coldres: (val, prop) => formatVariableStat('Cold Resist +', val, '%', prop, itemName, 'coldres', dropdownId),
    firres: (val, prop) => formatVariableStat('Fire Resist +', val, '%', prop, itemName, 'firres', dropdownId),
    ligres: (val, prop) => formatVariableStat('Lightning Resist +', val, '%', prop, itemName, 'ligres', dropdownId),
    poisres: (val, prop) => formatVariableStat('Poison Resist +', val, '%', prop, itemName, 'poisres', dropdownId),
    curseres: (val, prop) => formatVariableStat('Curse Resistance ', val, '%', prop, itemName, 'curseres', dropdownId),
    physdr: (val, prop) => formatVariableStat('Physical Damage Taken Reduced by ', val, '%', prop, itemName, 'physdr', dropdownId),
    mdr: (val, prop) => formatVariableStat('Magic Damage Reduced by ', val, '', prop, itemName, 'mdr', dropdownId),
    todefmiss: (val, prop) => formatVariableStat('+', val, ' Defense vs. Melee', prop, itemName, 'todefmiss', dropdownId),
    attpercent: (val, prop) => formatVariableStat('+', val, '% Bonus to Attack Rating', prop, itemName, 'attpercent', dropdownId),

    // Corruption-specific stats added to display
    laek: (val, prop) => formatVariableStat('+', val, ' Life after each Kill', prop, itemName, 'laek', dropdownId),
    maek: (val, prop) => formatVariableStat('+', val, ' to Mana after each Kill', prop, itemName, 'maek', dropdownId),
    ow: (val, prop) => formatVariableStat('', val, '% Chance of Open Wounds', prop, itemName, 'ow', dropdownId),
    openwounds: (val, prop) => formatVariableStat('', val, '% Chance of Open Wounds', prop, itemName, 'openwounds', dropdownId),
    atdmg: (val, prop) => formatVariableStat('Attacker Takes Damage of ', val, '', prop, itemName, 'atdmg', dropdownId),
    mindmg: (val, prop) => {
      const maxVal = props.maxdmg || val;
      return `Adds ${val}-${maxVal} Damage`;
    },
    maxdmg: () => '', // Skip, handled by mindmg
    blind: (val, prop) => val ? 'Hit Blinds Target' : '',
    pdr: (val, prop) => formatVariableStat('Physical Damage Taken Reduced by ', val, '', prop, itemName, 'pdr', dropdownId),
    regmana: (val, prop) => formatVariableStat('Regenerate Mana ', val, '%', prop, itemName, 'regmana', dropdownId),
    firedmgmin: (val, prop) => {
      const maxVal = props.firedmgmax || val;
      return `Adds ${val}-${maxVal} Fire Damage`;
    },
    firedmgmax: () => '', // Skip, handled by firedmgmin
    cbf: (val, prop) => formatVariableStat('', val ? 'Cannot Be Frozen' : '', '', prop, itemName, 'cbf', dropdownId),


    // Missing display handlers for dynamic items
    maxfirres: (val, prop) => formatVariableStat('+', val, '% to Maximum Fire Resist', prop, itemName, 'maxfirres', dropdownId),
    maxcoldres: (val, prop) => formatVariableStat('+', val, '% to Maximum Cold Resist', prop, itemName, 'maxcoldres', dropdownId),
    maxligres: (val, prop) => formatVariableStat('+', val, '% to Maximum Lightning Resist', prop, itemName, 'maxligres', dropdownId),
    maxpoisres: (val, prop) => formatVariableStat('+', val, '% to Maximum Poison Resist', prop, itemName, 'maxpoisres', dropdownId),
    maxlife: (val, prop) => formatVariableStat('Increase Maximum Life ', val, '%', prop, itemName, 'maxlife', dropdownId),
    maxmana: (val, prop) => formatVariableStat('Increase Maximum Mana ', val, '%', prop, itemName, 'maxmana', dropdownId),
    indestructible: (val, prop) => formatVariableStat('', val ? 'Indestructible' : '', '', prop, itemName, 'indestructible', dropdownId),

    //anothjer series
    lightdmgmin: (val, prop) => `Adds ${val}-${props.lightdmgmax || val} Lightning Damage`,
    lightdmgmax: () => '',
    lightdamage: (val, prop) => formatVariableStat('+', val, '% to Lightning Skill Damage', prop, itemName, 'lightdamage', dropdownId),
    atligdmg: (val, prop) => formatVariableStat('Attacker Takes Lightning Damage of ', val, '', prop, itemName, 'atligdmg', dropdownId),
    poisondamage: (val, prop) => formatVariableStat('+', val, '% to Poison Skill Damage', prop, itemName, 'poisondamage', dropdownId),
    firedamage: (val, prop) => formatVariableStat('+', val, '% to Fire Skill Damage', prop, itemName, 'firedamage', dropdownId),
    colddamage: (val, prop) => formatVariableStat('+', val, '% to Cold Skill Damage', prop, itemName, 'colddamage', dropdownId),
    magicdamage: (val, prop) => formatVariableStat('+', val, '% to Magic Skill Damage', prop, itemName, 'magicdamage', dropdownId),
    lightdamage: (val, prop) => formatVariableStat('+', val, '% to Lightning Skill Damage', prop, itemName, 'lightdamage', dropdownId),
    ravenoskill: (val, prop) => formatVariableStat('+', val, ' to Raven', prop, itemName, 'ravenoskill', dropdownId),
    ligrad: (val, prop) => formatVariableStat(val >= 0 ? '+' : '', val, ' to Light Radius', prop, itemName, 'ligrad', dropdownId),
    defvsmiss: (val, prop) => formatVariableStat('+', val, ' Defense vs. Missile', prop, itemName, 'defvsmiss', dropdownId),
    firepierce: (val, prop) => formatVariableStat('-', val, '% to Enemy Fire Resistance', prop, itemName, 'firepierce', dropdownId),
    coldpierce: (val, prop) => formatVariableStat('-', val, '% to Enemy Cold Resistance', prop, itemName, 'coldpierce', dropdownId),
    lightpierce: (val, prop) => formatVariableStat('-', val, '% to Enemy Lightning Resistance', prop, itemName, 'lightpierce', dropdownId),
    physpierce: (val, prop) => formatVariableStat('-', val, '% to Enemy Physical Resistance', prop, itemName, 'physpierce', dropdownId),
    coldskilldmg: (val, prop) => formatVariableStat('+', val, '% to Cold Skill Damage', prop, itemName, 'coldskilldmg', dropdownId),
    lightskilldmg: (val, prop) => formatVariableStat('+', val, '% to Lightning Skill Damage', prop, itemName, 'lightskilldmg', dropdownId),
    coldabsorb: (val, prop) => formatVariableStat('+', val, ' Cold Absorb', prop, itemName, 'coldabsorb', dropdownId),
    freezedur: (val, prop) => val === 0.5 ? 'Half Freeze Duration' : formatVariableStat('Freeze Duration Reduced by ', val * 100, '%', prop, itemName, 'freezedur', dropdownId),
    req: (val, prop) => formatVariableStat('Requirements ', val, '%', prop, itemName, 'req', dropdownId),
  };
  // Build description from properties
  // Skip certain properties that are metadata or handled elsewhere
  const skipProperties = ['javelin', 'speed', 'onehandmax', 'twohandmax', 'throwmax', 'smitedmgmax', 'maxdmg'];

  // Iterate through propertyDisplay keys in order to control display order
  // This ensures damage lines appear in the correct position, not at the end
  // Iterate through propertyDisplay keys in order to control display order
  // This ensures damage lines appear in the correct position, not at the end
  for (const key of Object.keys(propertyDisplay)) {
    if (skipProperties.includes(key)) continue;
    if (!(key in props)) continue;

    // CRITICAL FIX: Handle corrupted properties to prevent duplicate display
    // Check multiple potential tracking keys (ID and Name) to match how it was stored
    const keysToCheck = [dropdownId, itemName];
    let isCorrupted = false;

    if (window.corruptedProperties) {
      for (const trackKey of keysToCheck) {
        if (trackKey && window.corruptedProperties[trackKey]) {
          if (window.corruptedProperties[trackKey].has(key) ||
            window.corruptedProperties[trackKey].has(key.toLowerCase())) {
            isCorrupted = true;
            break;
          }
        }
      }
    }

    // Debug Filter Logic
    /*
    if (isCorrupted) {
       console.log(`[Filter] Skipping Corrupted Key: ${key} for ${itemName}`);
    }
    */

    // STRATEGY CHANGE: Do NOT skip corrupted properties.
    // We want main.js to handle ALL display (showing the merged Total).
    // If isCorrupted is true, formatVariableStat will try to color it Red.
    // If check fails, it shows White. In both cases, we avoid duplicates found in socket.js.

    /* REMOVED AGGRESSIVE FILTER
    if (isCorrupted) {
        continue;
    }
    */

    const prop = props[key]; // Use props[key] directly as propToDisplay was removed
    const value = getPropertyValue(prop);
    const displayText = propertyDisplay[key](value, prop);
    if (displayText) { // Skip empty strings (for properties that are already handled)
      html += displayText + '<br>';
    }
  }

  // Add set bonuses if this is a dynamic set item
  if (item.setBonuses && Array.isArray(item.setBonuses)) {
    item.setBonuses.forEach(bonus => {
      html += bonus + '<br>';
    });
  }

  // Add ethereal text if the item is ethereal
  if (props.ethereal) {
    html += ' <span style="color: #C0C0C0">Ethereal</span>';
  }

  return html;
}

/**
 * Format a stat that might have a variable range
 */
function formatVariableStat(prefix, value, suffix, prop, itemName, propKey, dropdownId) {
  // Determine if this property is modified (corrupted)
  let isModified = false;
  let corruptionBonus = 0;

  // Check the corruptedProperties set using slot-specific ID
  if (window.corruptedProperties && window.corruptedProperties[dropdownId]) {
    isModified = window.corruptedProperties[dropdownId].has(propKey);

    // If corrupted, calculate the corruption bonus
    if (isModified && window.originalItemProperties && window.originalItemProperties[itemName]) {
      const originalProps = window.originalItemProperties[itemName];
      const originalVal = originalProps[propKey];

      if (typeof prop === 'object' && 'current' in prop) {
        const origValue = (typeof originalVal === 'object' && 'current' in originalVal) ? originalVal.current :
          (typeof originalVal === 'object' && 'max' in originalVal) ? originalVal.max : originalVal;
        corruptionBonus = prop.current - origValue;
      }
    }
  }

  // Define Red Style
  const redStyle = "color: #ff5555; font-weight: bold; text-shadow: 0 0 3px #ff5555";
  const inputRedStyle = "width: 45px; padding: 2px; background: #1a1a2e; color: #ff5555; font-weight: bold; border: 1px solid #ff5555; border-radius: 3px;";
  const inputNormalStyle = "width: 45px; padding: 2px; background: #1a1a2e; color: #fff; border: 1px solid #0f3460; border-radius: 3px;";

  if (typeof prop === 'object' && prop !== null && 'min' in prop && 'max' in prop) {
    // Variable stat - show with range and input box
    const style = isModified ? inputRedStyle : inputNormalStyle;

    // If corrupted, expand the range to show the new effective range
    let displayMin = prop.min;
    let displayMax = prop.max;
    if (isModified && corruptionBonus > 0 && window.originalItemProperties && window.originalItemProperties[itemName]) {
      const originalVal = window.originalItemProperties[itemName][propKey];
      if (typeof originalVal === 'object' && 'min' in originalVal && 'max' in originalVal) {
        displayMin = originalVal.min + corruptionBonus;
        displayMax = originalVal.max + corruptionBonus;
      }
    }

    const textStyle = isModified ? redStyle : "";
    const textWrapper = isModified ? `<span style="${textStyle}">` : "";
    const textWrapperEnd = isModified ? "</span>" : "";

    return `${textWrapper}${prefix}${value}${suffix}${textWrapperEnd} <span style="color: #888;">[${displayMin}-${displayMax}]</span> <input type="number" class="stat-input" data-item="${itemName}" data-prop="${propKey}" data-dropdown="${dropdownId}" min="${displayMin}" max="${displayMax}" value="${value}" style="${style}">`;
  }

  // Fixed stat - show normally, wrapped in span if modified
  const text = `${prefix}${value}${suffix}`;
  if (isModified) {
    return `<span style="${redStyle}">${text}</span>`;
  }
  return text;
}

/**
 * Format stats that scale with character level (like maxdmgperlvl)
 */
function formatLevelScaledStat(perLevelValue, prop, itemName, propKey, dropdownId, suffix) {
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  const scaledValue = Math.floor(currentLevel * perLevelValue);

  // Calculate min and max range
  const minScaled = Math.floor(1 * perLevelValue); // At level 1
  const maxScaled = Math.floor(99 * perLevelValue); // At level 99

  suffix = suffix || ' to Maximum Damage';
  return `+[${minScaled}-${maxScaled}]${suffix} (+${perLevelValue} per Character Level)`;
}

/**
 * Handle changes to variable stat inputs
 */
function handleVariableStatChange(itemName, propKey, newValue, dropdownId, skipRegeneration = false) {
  // CRITICAL FIX: Get item from dropdown-specific cache, not shared itemList
  // This prevents mercenary changes from affecting player items
  if (!window.dropdownItemCache) window.dropdownItemCache = {};

  const cacheKey = `${dropdownId}_${itemName}`;
  let item = window.dropdownItemCache[cacheKey];

  // If not in cache, get from itemList and cache it
  if (!item) {
    const sourceItem = itemList[itemName];
    if (!sourceItem) return;

    // Create a deep copy so we don't modify the shared itemList
    item = JSON.parse(JSON.stringify(sourceItem));
    window.dropdownItemCache[cacheKey] = item;
  }

  if (!item || !item.properties || !item.properties[propKey]) return;

  const prop = item.properties[propKey];
  if (typeof prop === 'object' && 'min' in prop && 'max' in prop) {
    // Calculate the effective range (expanded if corrupted)
    let effectiveMin = prop.min;
    let effectiveMax = prop.max;

    // CRITICAL FIX: Check if this property is corrupted using corruptedProperties
    // This prevents infinite value growth by using a FIXED corruption bonus
    // Use slot-specific key to prevent cross-contamination
    const uniqueKey = dropdownId ? `${dropdownId}_${itemName}` : itemName;
    const isCorrupted = window.corruptedProperties &&
      window.corruptedProperties[uniqueKey] &&
      window.corruptedProperties[uniqueKey].has(propKey);

    if (isCorrupted && window.originalItemProperties && window.originalItemProperties[itemName]) {
      const originalVal = window.originalItemProperties[itemName][propKey];
      if (typeof originalVal === 'object' && 'min' in originalVal && 'max' in originalVal) {
        // Calculate FIXED corruption bonus from the original value
        // Use the original max as the baseline (not current, which changes)
        const originalMax = originalVal.max;
        const currentMax = prop.max;
        const corruptionBonus = currentMax - originalMax;

        if (corruptionBonus > 0) {
          effectiveMin = originalVal.min + corruptionBonus;
          effectiveMax = originalVal.max + corruptionBonus;
        }
      }
    }

    // Clamp value to the effective range
    const clampedValue = Math.max(effectiveMin, Math.min(effectiveMax, parseInt(newValue) || effectiveMax));
    prop.current = clampedValue;

    // UPDATE PERSISTENCE (itemBaseProperties)
    // We must update the base property so it doesn't reset on switch
    // CRITICAL FIX: Use unique key (dropdownId_itemName) to prevent shared state
    // This ensures changing Mercenary item stats doesn't affect Player item
    const basePropKey = `${dropdownId}_${itemName}`;

    if (window.itemBaseProperties) {
      if (!window.itemBaseProperties[basePropKey]) {
        // If prop missing in base, init it
        window.itemBaseProperties[basePropKey] = {};
      }
      if (!window.itemBaseProperties[basePropKey][propKey]) {
        window.itemBaseProperties[basePropKey][propKey] = JSON.parse(JSON.stringify(prop));
      }

      let corruptionValue = 0;
      // Check for active corruption to subtract
      if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
        const corr = window.itemCorruptions[dropdownId];
        if (corr.itemName === itemName && corr.text) {
          // We need to parse corruption to find value for THIS propKey
          // This is tricky without exposing parseCorruptionText or similar helper
          // Simplification: If the input is Red, it's modified.
          // We can try to use the diff between current prop and base to guess? No.

          // Better: Expose a helper or just update Base = (Current - Corruption)
        }
      }

      // Simpler approach for now:
      // Update the base property to match the new current value
      // BUT if there IS corruption on this property, the User Input includes it.
      // So Base = UserInput - Corruption.

      // For now, let's assume valid Base Update requires Recalculation logic
      // But to fix "Returns to Max Range" for NON-CORRUPTED stats, direct update works.
      // For CORRUPTED stats, if we direct update, we bake in the corruption (Double Stack on Reload).

      // To do this safely: 
      // 1. Get Corruption Value for this prop.
      // 2. Base = clampedValue - CorruptionValue.

      // We need to parse!
      // Let's rely on window.itemCorruptions[dropdownId].text
      // We can re-parse it locally using regex if needed, or call window.parseCorruptionText if exposed?
      // Check corrupt.js: parseCorruptionText is NOT exposed.

      // We should expose it in corrupt.js or copy simplistic logic here.
      // Let's assume for now we update Base = Current. 
      // RISK: Double Stacking if corruption exists.

      // Let's TRY to respect corruption.
      // If we can't calculate corruption, we skip updating Base for Corrupted props?
      // That effectively means User Edits on Corrupted Props don't persist on Switch.
      // User Edits on Uncorrupted Props DO persist.
      // This is a good compromise for now.

      // CRITICAL FIX: Use corruptedProperties to check if this property is corrupted
      // Don't update itemBaseProperties for corrupted properties
      // Use slot-specific key to prevent cross-contamination
      const uniqueKeyForCheck = dropdownId ? `${dropdownId}_${itemName}` : itemName;
      const isPropertyCorrupted = window.corruptedProperties &&
        window.corruptedProperties[uniqueKeyForCheck] &&
        window.corruptedProperties[uniqueKeyForCheck].has(propKey);

      if (!isPropertyCorrupted) {
        if (typeof window.itemBaseProperties[basePropKey][propKey] === 'object') {
          window.itemBaseProperties[basePropKey][propKey].current = clampedValue;
        } else {
          window.itemBaseProperties[basePropKey][propKey] = clampedValue;
        }
      }
    }

    // If changing edef or todef, recalculate defense property
    // ONLY for items that actually have a base defense (prevent "Defense: NaN" on weapons)
    if ((propKey === 'edef' || propKey === 'todef') && item.baseType && window.baseDefenses?.[item.baseType] > 0 && typeof window.calculateItemDefense === 'function') {
      // Determine category from dropdownId
      let category = 'helm';
      if (dropdownId.includes('armor')) category = 'armor';
      else if (dropdownId.includes('belt')) category = 'belts';
      else if (dropdownId.includes('glove')) category = 'gloves';
      else if (dropdownId.includes('boot')) category = 'boots';
      else if (dropdownId.includes('off') || dropdownId.includes('shield')) category = 'shield';

      item.properties.defense = window.calculateItemDefense(item, item.baseType, category);
    }

    if (!skipRegeneration) {
      // Save focus state before regenerating
      const activeElement = document.activeElement;
      const isFocusedInput = activeElement &&
        activeElement.classList.contains('stat-input') &&
        activeElement.dataset.item === itemName &&
        activeElement.dataset.prop === propKey;
      const cursorPosition = isFocusedInput ? activeElement.selectionStart : null;

      // Let the socket system handle the update - it will regenerate the description
      // AND include socket stats, preserving input boxes correctly
      if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
        const config = window.unifiedSocketSystem.equipmentMap[dropdownId];
        if (config && config.section) {
          window.unifiedSocketSystem.updateItemDisplay(config.section);
        }
      }

      // Restore focus and cursor position if we were focused on this input
      if (isFocusedInput) {
        // Need to wait for the display update to complete
        setTimeout(() => {
          // CRITICAL FIX: Include data-dropdown to find the correct input (player vs mercenary)
          const newInput = document.querySelector(`.stat-input[data-item="${itemName}"][data-prop="${propKey}"][data-dropdown="${dropdownId}"]`);
          if (newInput) {
            newInput.focus();
            if (cursorPosition !== null) {
              newInput.setSelectionRange(cursorPosition, cursorPosition);
            }
          }
        }, 0);
      }
    }

    // Trigger stat recalculation - SKIP during initial character load to prevent crashes
    if (window.unifiedSocketSystem && !window._isLoadingCharacterData) {
      window.unifiedSocketSystem.calculateAllStats();
      window.unifiedSocketSystem.updateStatsDisplay();
    }

    if (window.characterManager && !window._isLoadingCharacterData) {
      window.characterManager.updateTotalStats();
    }

    // CRITICAL FIX: Refresh saved state to persist the change immediately
    // This ensures the new value is saved and will be restored when switching items
    if (window.refreshSavedState && typeof window.refreshSavedState === 'function') {
      const config = window.unifiedSocketSystem?.equipmentMap?.[dropdownId];
      if (config && config.section) {
        window.refreshSavedState(dropdownId, config.section);
      }
    }

    // For static items with description, notify socket system to update
    // (Dynamic items are already handled by updateItemDisplay above)
    if (window.unifiedSocketSystem && typeof window.unifiedSocketSystem.updateAll === 'function' && item.description) {
      window.unifiedSocketSystem.updateAll();
    }

    // Update crit multiplier display if deadly strike changed
    if (propKey === 'deadly' && typeof updateCritDisplay === 'function') {
      updateCritDisplay();
    }

    // Update weapon damage display if this is a weapon stat change
    if (dropdownId === 'weapons-dropdown' && typeof window.updateWeaponDamageDisplay === 'function') {
      window.updateWeaponDamageDisplay();
    }

    // For properties that affect displayed stats, recalculate and update immediately
    // This ensures ALL stat counters update instantly when you change input boxes
    const immediateUpdateProps = [
      // Attributes
      'str', 'dex', 'vit', 'enr',
      // Resistances (both long and short forms)
      'fireresist', 'coldresist', 'lightresist', 'poisonresist', 'curseresist', 'allres',
      'firres', 'coldres', 'ligres', 'poisres',  // Short forms used in item properties
      // Speed stats
      'ias', 'fcr', 'frw', 'fhr',
      // Combat stats
      'ow', 'owdmg', 'cb', 'deadly', 'critchance', 'lleech', 'mleech',
      // Defensive stats
      'dr', 'pdr', 'mdr', 'physdr', 'plr', 'blockchance', 'block',
      // Core stats
      'allsk', 'allskills', 'classsk', 'magicfind', 'goldfind', 'defense',
      // Boolean stats
      'cbf',
      // Flat damage
      'tomindmg', 'tomaxdmg', 'flatfiremin', 'flatfiremax', 'flatcoldmin', 'flatcoldmax',
      'flatlightmin', 'flatlightmax', 'flatpoisonmin', 'flatpoisonmax',
      'colddmgmin', 'colddmgmax', 'firedmgmin', 'firedmgmax', 'lightdmgmin', 'lightdmgmax',
      'poisondmgmin', 'poisondmgmax', 'magicdmgmin', 'magicdmgmax',
      // Skill damage
      'firedamage', 'colddamage', 'lightdamage', 'poisondamage', 'magicdamage', 'poisonpierce', 'firepierce', 'lightpierce', 'coldpierce', 'magicpierce',
      // Pierce TADY JE CHYBA, ty TO NEBUDOU UZIVANE, dal jsem to uz na ten predhcozi radekj
      'piercefireresist', 'piercecoldresist', 'piercelightningresist', 'piercepoisonresist', 'piercephysresist',
      // Life/Mana
      'tolife', 'tomana', 'life', 'mana'
    ];
    if (immediateUpdateProps.includes(propKey) && window.unifiedSocketSystem) {
      if (typeof window.unifiedSocketSystem.calculateAllStats === 'function') {
        window.unifiedSocketSystem.calculateAllStats();
      }
      if (typeof window.unifiedSocketSystem.updateStatsDisplay === 'function') {
        window.unifiedSocketSystem.updateStatsDisplay();
      }
    }
  }
}

/**
 * Attach event listeners to stat input boxes using event delegation
 * This approach attaches a single listener at the document level, so it works
 * even when input elements are dynamically created/destroyed
 */
window.attachStatInputListeners = function attachStatInputListeners() {
  // Check if already initialized
  if (window.statInputListenerAttached) return;
  window.statInputListenerAttached = true;

  // Use event delegation - one listener handles all .stat-input elements
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('stat-input')) {
      const itemName = e.target.dataset.item;
      const propKey = e.target.dataset.prop;
      const dropdownId = e.target.dataset.dropdown;
      const newValue = e.target.value;

      handleVariableStatChange(itemName, propKey, newValue, dropdownId);
    }
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

  // CRITICAL FIX: Use dropdown-specific item cache to prevent shared state
  // This ensures player and mercenary items are independent
  if (!window.dropdownItemCache) window.dropdownItemCache = {};

  const cacheKey = `${dropdown.id}_${selectedItemName}`;
  let item = window.dropdownItemCache[cacheKey];

  // If not in cache or item changed, get fresh copy from itemList
  if (!item) {
    const sourceItem = window.getItemData(selectedItemName);
    if (!sourceItem) {
      infoDiv.innerHTML = '';
      return;
    }

    // Create a deep copy so we don't modify the shared itemList
    item = JSON.parse(JSON.stringify(sourceItem));
    window.dropdownItemCache[cacheKey] = item;
  }

  // CRITICAL FIX: Clear corruption if item changed
  if (window.itemCorruptions && window.itemCorruptions[dropdown.id]) {
    const corruption = window.itemCorruptions[dropdown.id];
    // If the corrupted item name doesn't match the currently selected item,
    // it means we switched items, so we should clear the corruption
    if (corruption.itemName !== selectedItemName) {
      // Restore original socket count if needed before clearing
      if (corruption.type === 'socket_corruption' && corruption.originalSocketCount !== undefined) {
        const section = window.SECTION_MAP && window.SECTION_MAP[dropdown.id];
        if (section && window.unifiedSocketSystem && typeof window.unifiedSocketSystem.setSocketCount === 'function') {
          window.unifiedSocketSystem.setSocketCount(section, corruption.originalSocketCount);
        }
      }

      delete window.itemCorruptions[dropdown.id];
      // Note: We DON'T delete originalItemProperties/corruptedProperties here
      // because corruptions persist per-item via slotItemCorruptions system
    }
  }

  // CRITICAL FIX: Restore corruption from persistent memory if available
  if (window.slotItemCorruptions && window.slotItemCorruptions[dropdown.id]) {
    const savedCorruption = window.slotItemCorruptions[dropdown.id][selectedItemName];
    if (savedCorruption) {
      if (!window.itemCorruptions) window.itemCorruptions = {};
      window.itemCorruptions[dropdown.id] = savedCorruption;
    } else {
      // CRITICAL FIX: Clear itemCorruptions if no saved corruption for this item
      // This prevents previous item's corruption from being applied to new item
      if (window.itemCorruptions && window.itemCorruptions[dropdown.id]) {
        delete window.itemCorruptions[dropdown.id];
      }
    }
  }

  if (item) {
    // CRITICAL STABILITY FIX: Manage Property State with "User Persistence"
    // Use itemBaseProperties to track USER STATE (including manual rolls), separate from Factory Defaults
    if (!window.itemBaseProperties) window.itemBaseProperties = {};

    // Use unique key to separate player vs mercenary instances of same item
    const uniqueKey = `${dropdown.id}_${selectedItemName}`;

    // 1. Capture Base State if not present (First load / Clean load)
    if (!window.itemBaseProperties[uniqueKey]) {
      // Seed with current item properties (assuming clean on startup)
      // Check if we have a generic one to copy from (legacy fallback)
      if (window.itemBaseProperties[selectedItemName]) {
        window.itemBaseProperties[uniqueKey] = JSON.parse(JSON.stringify(window.itemBaseProperties[selectedItemName]));
      } else {
        window.itemBaseProperties[uniqueKey] = JSON.parse(JSON.stringify(item.properties || {}));
      }
    }

    // 2. Check if this item has a saved corruption
    const hasSavedCorruption = window.slotItemCorruptions &&
      window.slotItemCorruptions[dropdown.id] &&
      window.slotItemCorruptions[dropdown.id][selectedItemName];

    // 3. RESTORE from appropriate state
    // CRITICAL FIX: Skip restoration if we're currently applying corruption (properties already set)
    if (!window.isApplyingCorruption) {
      if (hasSavedCorruption && window.itemBaseProperties[uniqueKey]) {
        // CRITICAL FIX: If item has corruption, restore from our saved BASE state (with user rolls)
        // This ensures variable stats (like ED) don't reset to max when loading a corrupted item
        item.properties = JSON.parse(JSON.stringify(window.itemBaseProperties[uniqueKey]));
      } else if (window.itemBaseProperties[uniqueKey]) {
        // No corruption: restore from Base State (user's specific rolls)
        item.properties = JSON.parse(JSON.stringify(window.itemBaseProperties[uniqueKey]));
      }
    }

    // 4. Re-Apply Saved Corruption if it matches this item
    // CRITICAL FIX: Skip property application if we just applied it (prevents double-application)
    // But still allow the rest of updateItemInfo to run for display refresh
    if (window.itemCorruptions && window.itemCorruptions[dropdown.id]) {
      const corruption = window.itemCorruptions[dropdown.id];

      // Double check it matches current item
      if (corruption.itemName === selectedItemName && corruption.text) {
        // Only apply to properties if we're NOT currently in the middle of applying corruption
        if (!window.isApplyingCorruption && typeof window.applyCorruptionToProperties === 'function') {
          // CRITICAL FIX: Pass itemName string instead of item object to ensure correct tracking
          // CRITICAL FIX: Pass ITEM OBJECT (cached item) instead of name string
          // This ensures we modify the specific instance for this slot, not the global shared object
          // Also pass dropdown.id for slot-specific corruption tracking
          // And pass itemName explicitly since the object reference won't match itemList
          window.applyCorruptionToProperties(item, corruption.text, dropdown.id, selectedItemName);

          // CRITICAL FIX: After applying corruption, restore user-modified values
          // This allows manual input changes to persist for corrupted properties
          if (window.pendingUserValues && window.pendingUserValues[selectedItemName]) {
            const userValues = window.pendingUserValues[selectedItemName];
            for (const key in userValues) {
              if (item.properties[key] && typeof item.properties[key] === 'object' && 'current' in item.properties[key]) {
                item.properties[key].current = userValues[key];
              }
            }
            delete window.pendingUserValues[selectedItemName];
          }
        }
      }
    }

    // CRITICAL FIX: Recalculate defense from edef after restoring properties/corruption
    // ONLY for defensive items (helm, armor, shield, etc.) to prevent "Defense: NaN" on weapons
    const isActuallyWeapon = item.itemType === 'weapon' || (item.baseType && window.BASE_TYPE_CATEGORIES && window.BASE_TYPE_CATEGORIES[item.baseType] === 'weapon');
    if (!isActuallyWeapon && item.properties && item.properties.edef && item.baseType && window.baseDefenses?.[item.baseType] > 0 && typeof window.calculateItemDefense === 'function') {
      // Determine category from dropdown
      let category = 'helm';
      if (dropdown.id.includes('armor')) category = 'armor';
      else if (dropdown.id.includes('belt')) category = 'belts';
      else if (dropdown.id.includes('glove')) category = 'gloves';
      else if (dropdown.id.includes('boot')) category = 'boots';
      else if (dropdown.id.includes('off') || dropdown.id.includes('shield')) category = 'shield';

      item.properties.defense = window.calculateItemDefense(item, item.baseType, category);
    } else if (item.properties && item.properties.defense !== undefined && item.baseType && !window.baseDefenses?.[item.baseType]) {
      // Cleanup: remove defense property from non-defensive items (like weapons with edef)
      delete item.properties.defense;
    }



    // For dynamic items (no static description), delegate to socket system
    // This ensures proper handling of corruptions, upgrades, and socket stats
    if (!item.description && window.unifiedSocketSystem) {
      const section = window.SECTION_MAP && window.SECTION_MAP[dropdown.id];
      if (section) {
        // Adjust socket count for new item if needed
        if (typeof window.unifiedSocketSystem.adjustSocketsForItem === 'function') {
          window.unifiedSocketSystem.adjustSocketsForItem(section);
        }
        // Update display with full socket system integration
        window.unifiedSocketSystem.updateItemDisplay(section);

        return; // Socket system handles everything for dynamic items
      }
    }

    // For static items, generate description normally
    const description = generateItemDescription(selectedItemName, item, dropdown.id);
    infoDiv.innerHTML = description;

    // Attach event listeners to any stat input boxes
    attachStatInputListeners();

    // Check if we can/should defer to socket system for display
    const section = window.SECTION_MAP && window.SECTION_MAP[dropdown.id];

    // DEBUG LOG
    /*
    console.log('[updateItemInfo] Debug:', {
        dropdownId: dropdown.id,
        itemName: selectedItemName,
        section: section,
        unifiedSocketSystem: !!window.unifiedSocketSystem,
        corruptedProps: window.corruptedProperties[dropdown.id || selectedItemName]
    });
    */

    // Update socket system if available
    if (section && window.unifiedSocketSystem) {
      if (typeof window.unifiedSocketSystem.updateItemDisplay === 'function') {
        // Force update immediately for this section
        window.unifiedSocketSystem.updateItemDisplay(section);
      }
      // Also trigger full update to handle dependencies
      window.unifiedSocketSystem.updateAll();
    }

  } else {
    // If not in itemList, try to show a basic placeholder
    infoDiv.innerHTML = selectedItemName;
  }

  // Update socket system if available
  // Re-fetch section as it might be needed for adjustSocketsForItem even if we are in the else block (edge case)
  // But typically only if we have a valid dropdown ID
  const sectionForUpdate = window.SECTION_MAP && window.SECTION_MAP[dropdown.id];

  if (window.unifiedSocketSystem) {
    // Use setTimeout to ensure DOM is fully updated and avoid race conditions
    // This forces the "Red Div" display logic from socket.js to run effectively
    setTimeout(() => {
      if (sectionForUpdate && typeof window.unifiedSocketSystem.adjustSocketsForItem === 'function') {
        window.unifiedSocketSystem.adjustSocketsForItem(sectionForUpdate);
      }
      if (typeof window.unifiedSocketSystem.updateAll === 'function') {
        window.unifiedSocketSystem.updateAll();
      }
    }, 50);
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
    tab.addEventListener('click', function () {
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
 * Save current build to the cloud
 * Now saves all 8 party members
 */
async function saveCurrentBuild() {
  if (!window.auth?.isLoggedIn()) {
    alert('Please login to save builds!');
    document.getElementById('profile-btn')?.click();
    return;
  }

  const buildName = prompt('Enter a name for this build:');
  if (!buildName || buildName.trim() === '') {
    return;
  }

  try {
    // Save current slot before exporting
    if (window.partyManager) {
      window.partyManager.saveCurrentSlot();
    }

    // Get all party data (8 players)
    const partyData = window.partyManager ? window.partyManager.partyData : [];
    const activeIndex = window.partyManager ? window.partyManager.activeIndex : 0;

    // Create the full party build object
    const characterData = {
      isPartyBuild: true,
      activeIndex: activeIndex,
      party: partyData
    };

    const result = await window.auth.saveCharacter(buildName.trim(), characterData);

    // Show alerts for newly unlocked achievements
    if (result.newAchievements && result.newAchievements.length > 0) {
      result.newAchievements.forEach(achievement => {
        alert(`🏆 Achievement Unlocked!\n\n${achievement.name}\n\n${achievement.description}`);
      });
    }

    if (window.notificationSystem) {
      const shareUrl = `https://pd2planner.net/?build=${result.character.build_id}`;
      window.notificationSystem.success(
        'Build Saved!',
        'Your build has been saved successfully.',
        {
          url: shareUrl,
          duration: 8000
        }
      );
    } else {
      alert(`Build saved successfully!\n\nShare URL: https://pd2planner.net/?build=${result.character.build_id}\n\nClick "Share" in My Builds to copy the link.`);
    }
  } catch (error) {
    console.error('Failed to save build:', error);
    if (window.notificationSystem) {
      window.notificationSystem.error('Save Failed', 'Failed to save build: ' + error.message, { duration: 6000 });
    } else {
      alert('Failed to save build: ' + error.message);
    }
  }
}

/**
 * Quick save - updates existing build
 */
async function quickSaveBuild() {
  if (!window.auth?.isLoggedIn()) {
    if (window.notificationSystem) {
      window.notificationSystem.info('Login Required', 'Please login to save builds!', { duration: 4000 });
    } else {
      alert('Please login to save builds!');
    }
    return;
  }

  const currentBuildId = window.currentLoadedBuildId;
  if (!currentBuildId) {
    // No build loaded, do a regular save
    await saveCurrentBuild();
    return;
  }

  try {
    const characterData = window.exportCharacterData();
    await window.auth.updateCharacter(currentBuildId, characterData);
    alert('Build updated successfully!');
  } catch (error) {
    console.error('Failed to update build:', error);
    alert('Failed to update build: ' + error.message);
  }
}

/**
 * Refresh all dropdowns (used when logging in/out to add/remove crafted items)
 */
function refreshItemDropdowns() {
  populateItemDropdowns();
}

/**
 * Populate base items dropdown based on craft type
 */
function populateBaseItemsByType(craftType) {
  const baseTypeSelect = document.getElementById('craftBaseType');
  if (!baseTypeSelect) return;

  let baseItems = [];
  let placeholder = 'Select base item...';

  // Get craft config to determine item type
  if (window.craftedItemsSystem && window.craftedItemsSystem.craftTypes[craftType]) {
    const craftConfig = window.craftedItemsSystem.craftTypes[craftType];
    const itemType = craftConfig.itemType;

    if (itemType === 'weapon') {
      placeholder = 'Select base weapon...';
      // Get all base weapons from baseDamages
      if (typeof baseDamages !== 'undefined') {
        for (const weaponName in baseDamages) {
          if (!weaponName.includes('(melee)')) {
            baseItems.push(weaponName);
          }
        }
      }
    } else if (itemType === 'armor') {
      placeholder = 'Select base armor...';
      // Get all armor items from itemTypeCategories
      if (window.itemTypeCategories && window.itemTypeCategories['Armor']) {
        baseItems = Array.from(window.itemTypeCategories['Armor']).sort();
      }
    } else if (itemType === 'helm') {
      placeholder = 'Select base helm...';
      // Get all helms from itemTypeCategories
      if (window.itemTypeCategories && window.itemTypeCategories['Helm']) {
        baseItems = Array.from(window.itemTypeCategories['Helm']).sort();
      }
    } else if (itemType === 'shield') {
      placeholder = 'Select base shield...';
      // Get all shields from itemTypeCategories
      if (window.itemTypeCategories && window.itemTypeCategories['Shield']) {
        baseItems = Array.from(window.itemTypeCategories['Shield']).sort();
      }
    } else if (itemType === 'boots') {
      placeholder = 'Select base boots...';
      // Get all boots from itemTypeCategories
      if (window.itemTypeCategories && window.itemTypeCategories['Boots']) {
        baseItems = Array.from(window.itemTypeCategories['Boots']).sort();
      }
    } else if (itemType === 'gloves') {
      placeholder = 'Select base gloves...';
      // Get all gloves from itemTypeCategories
      if (window.itemTypeCategories && window.itemTypeCategories['Gloves']) {
        baseItems = Array.from(window.itemTypeCategories['Gloves']).sort();
      }
    } else if (itemType === 'belts') {
      placeholder = 'Select base belt...';
      // Get all belts from itemTypeCategories
      if (window.itemTypeCategories && window.itemTypeCategories['Belt']) {
        baseItems = Array.from(window.itemTypeCategories['Belt']).sort();
      }
    } else if (itemType === 'ringsone') {
      placeholder = 'Ring';
      baseItems = ['Ring'];
    } else if (itemType === 'amulets') {
      placeholder = 'Amulet';
      baseItems = ['Amulet'];
    }
  }

  // Populate dropdown
  baseTypeSelect.innerHTML = `<option value="">${placeholder}</option>`;
  baseItems.sort().forEach(itemName => {
    const option = document.createElement('option');
    option.value = itemName;
    option.textContent = itemName;
    baseTypeSelect.appendChild(option);
  });
}

/**
 * Populate fixed properties sliders based on craft type
 */
function populateFixedProperties(craftType) {
  const container = document.getElementById('fixedPropertiesContainer');
  if (!container || !window.craftedItemsSystem) return;

  // Get craft config
  const craftConfig = window.craftedItemsSystem.craftTypes[craftType];
  if (!craftConfig || !craftConfig.fixedProperties) {
    container.innerHTML = '<p style="color: #999; padding: 10px;">No fixed properties for this craft type</p>';
    return;
  }

  container.innerHTML = '';

  // Property labels matching the ones used in createAffixSlider
  const propLabels = {
    edmg: '+% Enhanced Damage',
    edef: '+% Enhanced Defense',
    tolife: '+ to Life',
    tomana: '+ to Mana',
    repl: 'Replenish Life +',
    lleech: '+% Life Stolen per Hit',
    mleech: '+% Mana Stolen per Hit',
    cb: '+% Chance of Crushing Blow',
    ow: '+% Chance of Open Wounds',
    laek: '+ Life after each Kill',
    block: '+% Increased Chance of Blocking',
    block2: '+% Increased Chance of Blocking',
    frw: '+% Faster Run/Walk',
    ias: '+% Increased Attack Speed',
    str: '+ to Strength',
    dex: '+ to Dexterity',
    vit: '+ to Vitality',
    enr: '+ to Energy',
    coldres: 'Cold Resist +%',
    firres: 'Fire Resist +%',
    ligres: 'Lightning Resist +%',
    poisres: 'Poison Resist +%',
    todefmiss: '+ Defense vs. Melee',
    physdr: 'Physical Damage Taken Reduced by +%',
    attpercent: '+% Bonus to Attack Rating'
  };

  // Create a slider for each fixed property
  Object.entries(craftConfig.fixedProperties).forEach(([propKey, propData]) => {
    const label = propLabels[propKey] || propKey;
    const minVal = propData.min;
    const maxVal = propData.max;

    const propDiv = document.createElement('div');
    propDiv.className = 'fixed-property-control';
    propDiv.style.cssText = `
      margin-bottom: 12px;
      padding: 10px;
      background: rgba(15, 52, 96, 0.4);
      border: 1px solid #ffd700;
      border-radius: 4px;
    `;

    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;';

    const labelText = document.createElement('span');
    labelText.textContent = label;
    labelText.style.cssText = 'color: #ffd700; font-weight: bold; font-size: 12px;';

    const valueSpan = document.createElement('span');
    valueSpan.id = `fixed-${propKey}-value`;
    valueSpan.textContent = maxVal; // Default to max value
    valueSpan.style.cssText = 'color: #00ff00; font-weight: bold; font-size: 12px;';

    labelDiv.appendChild(labelText);
    labelDiv.appendChild(valueSpan);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = minVal;
    slider.max = maxVal;
    slider.value = maxVal; // Default to max value
    slider.id = `fixed-${propKey}`;
    slider.dataset.propKey = propKey;
    slider.style.cssText = 'width: 100%; cursor: pointer;';

    slider.addEventListener('input', function () {
      valueSpan.textContent = this.value;
    });

    propDiv.appendChild(labelDiv);
    propDiv.appendChild(slider);
    container.appendChild(propDiv);
  });
}

/**
 * Open the crafting modal and populate base items list
 */
function openCraftingModal() {
  if (!window.auth?.isLoggedIn()) {
    alert('You must be logged in to create crafted items!');
    return;
  }

  const modal = document.getElementById('craftingModal');
  if (!modal) return;

  // Setup craft type change listener
  const craftTypeSelect = document.getElementById('craftType');
  if (craftTypeSelect) {
    craftTypeSelect.addEventListener('change', function () {
      populateBaseItemsByType(this.value);
      populateFixedProperties(this.value);
      refreshAffixesForBaseType(''); // Clear affixes initially
    });
  }

  // Setup base type change listener
  const baseTypeSelect = document.getElementById('craftBaseType');
  if (baseTypeSelect) {
    baseTypeSelect.addEventListener('change', function () {
      refreshAffixesForBaseType(this.value);
    });
  }

  // Initially populate with blood weapon items
  populateBaseItemsByType('blood');
  populateFixedProperties('blood');

  // Initially show message to select a base type
  const affixesContainer = document.getElementById('affixesContainer');
  if (affixesContainer) {
    affixesContainer.innerHTML = '<p style="color: #999; padding: 10px;">Select a base item to see available affixes</p>';
  }

  // Clear form fields
  document.getElementById('craftName').value = '';
  document.getElementById('craftType').value = 'blood';

  // Populate existing items list
  populateCraftedItemsList();

  // Show modal and backdrop
  modal.style.display = 'block';
  const backdrop = document.getElementById('craftingModalBackdrop');
  if (backdrop) {
    backdrop.style.display = 'block';
  }
}

/**
 * Refresh affixes based on selected base type
 */
function refreshAffixesForBaseType(baseType) {
  const affixesContainer = document.getElementById('affixesContainer');
  if (!affixesContainer || !window.craftedItemsSystem) return;

  if (!baseType) {
    affixesContainer.innerHTML = '<p style="color: #999; padding: 10px;">Select a base item to see available affixes</p>';
    return;
  }

  affixesContainer.innerHTML = '';

  // Helper function to create affix slider
  const createAffixSlider = (affixKey, affixData, affixType) => {
    // Extract the first stat from affixData.stats
    const statEntries = Object.entries(affixData.stats || {});
    if (statEntries.length === 0) return null;

    const [propKey, propData] = statEntries[0];
    const minVal = propData.min;
    const maxVal = propData.max;

    // Property key to label mapping
    const propLabels = {
      edmg: '+% Enhanced Damage',
      edef: '+% Enhanced Defense',
      toatt: '+ to Attack Rating',
      tolife: '+ to Life',
      tomana: '+ to Mana',
      str: '+ to Strength',
      dex: '+ to Dexterity',
      coldres: 'Cold Resist +%',
      firres: 'Fire Resist +%',
      ligres: 'Lightning Resist +%',
      poisres: 'Poison Resist +%',
      allres: 'All Resistances +%',
      magicdmg: '+ Magic Damage',
      regen: '+ Regenerate',
      repl: 'Replenish Life +',
      manasteal: '+% Mana Steal',
      lifesteal: '+% Life Steal',
      lleech: '+% Life Stolen per Hit',
      mleech: '+% Mana Stolen per Hit',
      cb: '+% Chance of Crushing Blow',
      ow: '+% Chance of Open Wounds',
      crushblow: '+% Chance of Crushing Blow',
      laek: '+ Life after each Kill',
      block: '+% Increased Chance of Blocking',
      block2: '+% Increased Chance of Blocking',
      deadly: '+% Deadly Strike',
      ias: '+% Increased Attack Speed',
      fcr: '+% Faster Cast Rate',
      frw: '+% Faster Run/Walk',
      todefmiss: '+ Defense vs. Melee',
      physdr: 'Physical Damage Taken Reduced by +%',
      attpercent: '+% Bonus to Attack Rating',
      amazonskills: '+ to Amazon Skill Levels',
      sorceressskills: '+ to Sorceress Skill Levels',
      necromancerskills: '+ to Necromancer Skill Levels',
      paladinskills: '+ to Paladin Skill Levels',
      barbarianskills: '+ to Barbarian Skill Levels',
      drusk: '+ to Druid Skill Levels',
      assassinskills: '+ to Assassin Skill Levels',

      // Amazon skill trees
      bowskills: '+ to Bow and Crossbow Skills (Amazon Only)',
      amazonmagic: '+ to Passive and Magic Skills (Amazon Only)',
      javskills: '+ to Javelin and Spear Skills (Amazon Only)',

      // Sorceress skill trees
      firespells: '+ to Fire Skills (Sorceress Only)',
      lightspells: '+ to Lightning Skills (Sorceress Only)',
      coldspells: '+ to Cold Skills (Sorceress Only)',

      // Necromancer skill trees
      curses: '+ to Curses (Necromancer Only)',
      necromancersummoning: '+ to Summoning Skills (Necromancer Only)',
      poisonandbone: '+ to Poison and Bone Skills (Necromancer Only)',

      // Paladin skill trees
      paladinoffensive: '+ to Offensive Auras (Paladin Only)',
      paladindefensive: '+ to Defensive Auras (Paladin Only)',
      paladincombat: '+ to Combat Skills (Paladin Only)',

      // Barbarian skill trees  
      barbariancombat: '+ to Combat Skills (Barbarian Only)',
      barbarianmasteries: '+ to Combat Masteries (Barbarian Only)',
      warcries: '+ to Warcries (Barbarian Only)',

      // Druid skill trees
      druidsummoning: '+ to Summoning Skills (Druid Only)',
      shapeshifting: '+ to Shape Shifting Skills (Druid Only)',
      druidelemental: '+ to Elemental Skills (Druid Only)',

      // Assassin skill trees
      traps: '+ to Trap Skills (Assassin Only)',
      martialarts: '+ to Martial Arts (Assassin Only)',
      shadowdisciplines: '+ to Shadow Disciplines (Assassin Only)',

      // All skills (generic)
      allskills: '+ to All Skills'
    };

    const affixDiv = document.createElement('div');
    affixDiv.className = 'affix-control';
    affixDiv.style.cssText = `
      margin-bottom: 12px;
      padding: 10px;
      background: rgba(15, 52, 96, 0.4);
      border: 1px solid #0f9eff;
      border-radius: 4px;
    `;

    const label = document.createElement('label');
    label.style.cssText = 'display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 8px; color: #FF9900; text-shadow: 0 0 3px rgba(255, 215, 0, 0.3);';
    const displayLabel = `${affixKey} (${propLabels[propKey] || propKey})`;
    const reqLvlText = affixData.reqLvl ? `<span style="color: #888; font-size: 11px; margin-left: 10px;">Req Lvl: ${affixData.reqLvl}</span>` : '';
    label.innerHTML = `<span>${displayLabel} <span id="val_${affixType}_${affixKey}" style="color: #0f9eff; margin-left: 5px;">[0]</span></span>${reqLvlText}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `check_${affixType}_${affixKey}`;
    checkbox.style.cssText = 'margin-right: 8px;';
    checkbox.dataset.group = affixData.group; // Store the affix group
    checkbox.dataset.affixType = affixType; // Store affix type
    checkbox.dataset.affixKey = affixKey; // Store affix key

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = minVal;
    slider.max = maxVal;
    slider.value = minVal;
    slider.disabled = true;
    slider.style.cssText = `
      width: calc(100% - 30px);
      height: 6px;
      background: #0f3460;
      border: 1px solid #0f9eff;
      border-radius: 3px;
      outline: none;
      cursor: pointer;
      margin-left: 8px;
    `;
    slider.id = `affix_${affixType}_${affixKey}`;
    slider.dataset.propKey = propKey; // Store the property key for later retrieval

    checkbox.addEventListener('change', (e) => {
      const affixGroup = e.target.dataset.group;
      const currentAffixType = e.target.dataset.affixType;

      if (e.target.checked) {
        // Check if another affix from the same group is already checked
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"][data-group]');
        const conflictingAffix = Array.from(allCheckboxes).find(cb =>
          cb !== e.target &&
          cb.checked &&
          cb.dataset.group === affixGroup &&
          cb.dataset.affixType === currentAffixType
        );

        if (conflictingAffix) {
          // Show error message and uncheck
          alert(`Cannot select this affix! Another affix from group ${affixGroup} is already selected (${conflictingAffix.dataset.affixKey})`);
          e.target.checked = false;
          return;
        }
      }

      // Toggle slider enabled state
      slider.disabled = !e.target.checked;
      if (e.target.checked) {
        document.getElementById(`val_${affixType}_${affixKey}`).textContent = `[${slider.value}]`;
      } else {
        document.getElementById(`val_${affixType}_${affixKey}`).textContent = `[0]`;
      }
    });

    slider.addEventListener('input', (e) => {
      document.getElementById(`val_${affixType}_${affixKey}`).textContent = `[${e.target.value}]`;
    });

    const controlWrapper = document.createElement('div');
    controlWrapper.style.cssText = 'display: flex; align-items: center;';
    controlWrapper.appendChild(checkbox);
    controlWrapper.appendChild(slider);

    affixDiv.appendChild(label);
    affixDiv.appendChild(controlWrapper);
    return affixDiv;
  };

  // Get available affixes using the system method
  const availablePrefixes = window.craftedItemsSystem.getAvailableAffixes(baseType, 'prefixes', []);
  const availableSuffixes = window.craftedItemsSystem.getAvailableAffixes(baseType, 'suffixes', []);

  // Add Prefixes section
  const prefixHeader = document.createElement('h4');
  prefixHeader.textContent = 'Prefixes (select 1-3)';
  prefixHeader.style.cssText = 'color: #ffd700; margin: 10px 0; font-size: 14px;';
  affixesContainer.appendChild(prefixHeader);

  if (availablePrefixes.length === 0) {
    const noPrefixes = document.createElement('p');
    noPrefixes.textContent = 'No prefixes available for this item type';
    noPrefixes.style.cssText = 'color: #999; font-size: 12px; margin: 5px 0;';
    affixesContainer.appendChild(noPrefixes);
  } else {
    availablePrefixes.forEach(affix => {
      const sliderElement = createAffixSlider(affix.name, affix, 'prefix');
      if (sliderElement) affixesContainer.appendChild(sliderElement);
    });
  }

  // Add Suffixes section
  const suffixHeader = document.createElement('h4');
  suffixHeader.textContent = 'Suffixes (select 1-3)';
  suffixHeader.style.cssText = 'color: #ffd700; margin: 15px 0 10px 0; font-size: 14px;';
  affixesContainer.appendChild(suffixHeader);

  if (availableSuffixes.length === 0) {
    const noSuffixes = document.createElement('p');
    noSuffixes.textContent = 'No suffixes available for this item type';
    noSuffixes.style.cssText = 'color: #999; font-size: 12px; margin: 5px 0;';
    affixesContainer.appendChild(noSuffixes);
  } else {
    availableSuffixes.forEach(affix => {
      const sliderElement = createAffixSlider(affix.name, affix, 'suffix');
      if (sliderElement) affixesContainer.appendChild(sliderElement);
    });
  }
}

/**
 * Populate the list of existing crafted items with delete buttons
 */
function populateCraftedItemsList() {
  const listContainer = document.getElementById('craftedItemsList');
  if (!listContainer || !window.craftedItemsSystem) return;

  const items = window.craftedItemsSystem.getAllCraftedItems();

  if (items.length === 0) {
    listContainer.innerHTML = `
      <p style="color: #888; text-align: center; padding: 10px;">No crafted items yet</p>
      <button onclick="reloadCraftedItemsFromBackend()" style="width: 100%; padding: 8px; background: #3498db; border: 1px solid #0f9eff; color: white; border-radius: 3px; cursor: pointer; font-size: 12px; margin-top: 10px;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">🔄 RELOAD FROM SERVER</button>
    `;
    return;
  }

  listContainer.innerHTML = `
    <div style="margin-bottom: 10px;">
      ${items.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(15, 52, 96, 0.3); border: 1px solid #0f9eff; border-radius: 4px; margin-bottom: 8px;">
          <span style="color: #FF9900; font-size: 13px;">${item.fullName}</span>
          <button onclick="deleteCraftedItemConfirm('${item.id}')" style="background: #e74c3c; border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 11px; transition: all 0.2s;" onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">DELETE</button>
        </div>
      `).join('')}
    </div>
    <button onclick="reloadCraftedItemsFromBackend()" style="width: 100%; padding: 8px; background: #3498db; border: 1px solid #0f9eff; color: white; border-radius: 3px; cursor: pointer; font-size: 12px;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">🔄 RELOAD FROM SERVER</button>
  `;
}

/**
 * Reload crafted items from backend
 */
async function reloadCraftedItemsFromBackend() {
  if (!window.auth?.isLoggedIn() || !window.craftedItemsSystem) {
    alert('Must be logged in to reload items');
    return;
  }

  try {
    const craftedItems = await window.auth.getCraftedItems();
    window.craftedItemsSystem.loadFromData(craftedItems);
    populateCraftedItemsList();
    refreshItemDropdowns();

    // Update stats display
    if (typeof window.unifiedSocketSystem?.calculateAllStats === 'function') {
      window.unifiedSocketSystem.calculateAllStats();
    }
    if (typeof window.unifiedSocketSystem?.updateStatsDisplay === 'function') {
      window.unifiedSocketSystem.updateStatsDisplay();
    }

    alert(`Reloaded ${craftedItems.length} items from server`);
  } catch (error) {
    console.error('Failed to reload crafted items:', error);
    alert('Failed to reload items: ' + error.message);
  }
}

/**
 * Delete a crafted item with confirmation
 */
async function deleteCraftedItemConfirm(craftId) {
  const item = window.craftedItemsSystem.getAllCraftedItems().find(i => i.id === craftId);
  if (!item) return;

  if (!confirm(`Delete "${item.fullName}"? This cannot be undone.`)) {
    return;
  }

  try {
    // Delete from backend
    if (window.auth?.isLoggedIn()) {
      await window.auth.deleteCraftedItem(craftId);
    }

    // Delete from local system
    window.craftedItemsSystem.deleteCraftedItem(craftId);

    // Refresh UI
    populateCraftedItemsList();
    refreshItemDropdowns();

    // Update stats display to reflect deletion of crafted item
    if (typeof window.unifiedSocketSystem?.calculateAllStats === 'function') {
      window.unifiedSocketSystem.calculateAllStats();
    }
    if (typeof window.unifiedSocketSystem?.updateStatsDisplay === 'function') {
      window.unifiedSocketSystem.updateStatsDisplay();
    }

    alert(`Deleted "${item.fullName}"`);
  } catch (error) {
    console.error('Failed to delete crafted item:', error);
    alert('Failed to delete item: ' + error.message);
  }
}

/**
 * Close the crafting modal
 */
function closeCraftingModal() {
  const modal = document.getElementById('craftingModal');
  const backdrop = document.getElementById('craftingModalBackdrop');
  if (modal) {
    modal.style.display = 'none';
  }
  if (backdrop) {
    backdrop.style.display = 'none';
  }
}

/**
 * Setup modal event listeners (click outside to close)
 */
function setupCraftingModalHandlers() {
  const backdrop = document.getElementById('craftingModalBackdrop');
  if (!backdrop) return;

  // Close when clicking backdrop
  backdrop.addEventListener('click', () => {
    closeCraftingModal();
  });
}

/**
 * Create a crafted item from the modal form
 */
function createCraftedItem() {
  if (!window.craftedItemsSystem) {
    alert('Crafted items system not initialized!');
    return;
  }

  const name = document.getElementById('craftName').value.trim();
  const baseType = document.getElementById('craftBaseType').value;
  const craftType = document.getElementById('craftType').value;

  if (!name) {
    alert('Please enter an item name');
    return;
  }

  if (!baseType) {
    alert('Please select a base item type');
    return;
  }

  // Collect selected affixes (prefixes and suffixes separately)
  const affixes = {
    prefixes: {},
    suffixes: {}
  };

  // Collect affix names for required level calculation
  const affixSelection = {
    prefixes: {},
    suffixes: {}
  };

  // Collect prefixes
  const prefixCheckboxes = document.querySelectorAll('input[id^="check_prefix_"]');
  prefixCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const affixKey = checkbox.id.replace('check_prefix_', '');
      const slider = document.getElementById(`affix_prefix_${affixKey}`);
      if (slider && slider.dataset.propKey) {
        // Use the property key (e.g., 'edmg') instead of affix name (e.g., 'Jagged')
        const propKey = slider.dataset.propKey;
        const value = parseInt(slider.value);
        // Add to existing value if property already exists (multiple affixes with same property)
        affixes.prefixes[propKey] = (affixes.prefixes[propKey] || 0) + value;
        // Store affix name for required level calculation
        affixSelection.prefixes[affixKey] = true;
      }
    }
  });

  // Collect suffixes
  const suffixCheckboxes = document.querySelectorAll('input[id^="check_suffix_"]');
  suffixCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const affixKey = checkbox.id.replace('check_suffix_', '');
      const slider = document.getElementById(`affix_suffix_${affixKey}`);
      if (slider && slider.dataset.propKey) {
        // Use the property key instead of affix name
        const propKey = slider.dataset.propKey;
        const value = parseInt(slider.value);
        // Add to existing value if property already exists
        affixes.suffixes[propKey] = (affixes.suffixes[propKey] || 0) + value;
        // Store affix name for required level calculation
        affixSelection.suffixes[affixKey] = true;
      }
    }
  });

  // Collect fixed properties from sliders
  const fixedProperties = {};
  const fixedSliders = document.querySelectorAll('input[id^="fixed-"]');
  fixedSliders.forEach(slider => {
    const propKey = slider.dataset.propKey;
    if (propKey) {
      fixedProperties[propKey] = parseInt(slider.value);
    }
  });

  // Create the crafted item
  const craftedItem = window.craftedItemsSystem.createCraftedItem(name, baseType, craftType, affixes, fixedProperties, affixSelection);

  if (!craftedItem) {
    alert('Failed to create crafted item. Check your inputs and try again.');
    return;
  }

  // Save to backend
  if (window.auth?.isLoggedIn()) {
    window.auth.saveCraftedItem(craftedItem)
      .then(() => {
        // Refresh dropdowns to show the new crafted item
        refreshItemDropdowns();

        // Refresh items list in modal
        populateCraftedItemsList();

        // Update stats display to reflect crafted item properties
        if (typeof window.unifiedSocketSystem?.calculateAllStats === 'function') {
          window.unifiedSocketSystem.calculateAllStats();
        }
        if (typeof window.unifiedSocketSystem?.updateStatsDisplay === 'function') {
          window.unifiedSocketSystem.updateStatsDisplay();
        }

        // Show success message
        if (window.notificationSystem) {
          window.notificationSystem.success('Crafted Item Created!', `${craftedItem.fullName} has been created and saved.`, { duration: 4000 });
        } else {
          alert(`Crafted item created: ${craftedItem.fullName}`);
        }
      })
      .catch(error => {
        alert(`Failed to save crafted item: ${error.message}`);
        // Remove from local system if backend save failed
        window.craftedItemsSystem.deleteCraftedItem(craftedItem.id);
      });
  } else {
    // No login - just update local
    refreshItemDropdowns();
    populateCraftedItemsList();

    // Update stats display to reflect crafted item properties
    if (typeof window.unifiedSocketSystem?.calculateAllStats === 'function') {
      window.unifiedSocketSystem.calculateAllStats();
    }
    if (typeof window.unifiedSocketSystem?.updateStatsDisplay === 'function') {
      window.unifiedSocketSystem.updateStatsDisplay();
    }

    if (window.notificationSystem) {
      window.notificationSystem.success('Crafted Item Created!', `${craftedItem.fullName} has been created.`, { duration: 4000 });
    } else {
      alert(`Crafted item created: ${craftedItem.fullName}`);
    }
  }
}

/**
 * Create craft item button and add to UI
 */
function createCraftingButton() {
  // Find save button container
  const saveContainer = document.getElementById('save-build-container');
  if (!saveContainer) return;

  // Create craft button
  const craftBtn = document.createElement('button');
  craftBtn.id = 'craft-item-btn';
  craftBtn.innerHTML = 'Craft Item';
  craftBtn.style.cssText = `
    background: linear-gradient(135deg, #963a16ff, #da7400ff);
    color: #ffffff;
    padding: 5px 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(26, 92, 26, 0.8);
    transition: all 0.3s ease;
    width: 66%;
    white-space: normal;
    word-wrap: break-word;
  `;

  craftBtn.addEventListener('click', () => {
    if (!window.auth?.isLoggedIn()) {
      alert('You must be logged in to craft items!');
      document.getElementById('profile-btn')?.click();
      return;
    }
    openCraftingModal();
  });

  craftBtn.addEventListener('mouseenter', () => {
    craftBtn.style.transform = 'translateY(-2px)';
    craftBtn.style.boxShadow = '0 6px 20px rgba(201, 96, 11, 0.6)';
    craftBtn.style.background = 'linear-gradient(135deg, #c55d34ff, #da7400ff)';
  });

  craftBtn.addEventListener('mouseleave', () => {
    craftBtn.style.transform = 'translateY(0)';
    craftBtn.style.boxShadow = '0 4px 15px rgba(216, 105, 2, 0.8)';
    craftBtn.style.background = 'linear-gradient(135deg, #745042ff, #d84d23ff))';
  });

  // Add craft button below save button
  saveContainer.appendChild(craftBtn);
}

/**
 * Handle logout - refresh dropdowns to remove crafted items
 */
function handleLogout() {
  // Clear crafted items system
  if (window.craftedItemsSystem) {
    window.craftedItemsSystem.clear();
  }

  // Refresh dropdowns
  refreshItemDropdowns();
}

/**
 * Handle login - load crafted items from backend
 */
async function handleLogin() {
  // Load crafted items from backend
  if (window.auth?.isLoggedIn() && window.craftedItemsSystem) {
    try {
      const craftedItems = await window.auth.getCraftedItems();
      window.craftedItemsSystem.loadFromData(craftedItems);
      // Refresh dropdowns to show crafted items
      refreshItemDropdowns();
    } catch (error) {
      console.error('Failed to load crafted items on login:', error);
    }
  }
}

/**
 * Create save button and add to UI
 */
function createSaveButton() {
  // Create save button container (positioned below profile button)
  const saveContainer = document.createElement('div');
  saveContainer.id = 'save-build-container';
  saveContainer.style.cssText = `
    position: fixed;
    right: 10px;
    top: calc(50% + 80px);
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 3;
    width: 200px;
  `;

  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.id = 'save-build-btn';
  saveBtn.innerHTML = 'Save Build';
  saveBtn.style.cssText = `
    background: linear-gradient(135deg, black, #000447);
    color: #ffffff;
    padding: 5px 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(34, 8, 44, 0.8);
    transition: all 0.3s ease;
    width: 66%;
    white-space: normal;
    word-wrap: break-word;
  `;

  saveBtn.addEventListener('click', saveCurrentBuild);

  saveBtn.addEventListener('mouseenter', () => {
    saveBtn.style.transform = 'translateY(-2px)';
    saveBtn.style.boxShadow = '0 6px 20px rgba(81, 2, 83, 0.6)';
    saveBtn.style.background = 'linear-gradient(135deg, #a00e80ff, #4d041aff)';
  });

  saveBtn.addEventListener('mouseleave', () => {
    saveBtn.style.transform = 'translateY(0)';
    saveBtn.style.boxShadow = '0 4px 15px rgba(160, 9, 190, 0.4)';
    saveBtn.style.background = 'linear-gradient(135deg, #630366ff, #4e0222ff)';
  });

  saveContainer.appendChild(saveBtn);
  document.body.appendChild(saveContainer);
}

/**
 * Load build from URL parameter (for shared builds)
 * Shared URLs only load P1, not the full party
 */
async function loadBuildFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildId = urlParams.get('build') || urlParams.get('id');


  if (buildId && window.auth) {
    try {
      const build = await window.auth.getBuild(buildId);

      if (build && build.character_data) {
        // For shared URLs, extract only P1 if it's a party build
        let dataToLoad = build.character_data;

        if (build.character_data.isPartyBuild && build.character_data.party && Array.isArray(build.character_data.party)) {

          // Extract P1 only for shared links
          const p1Data = build.character_data.party[0];

          if (p1Data && p1Data.character) {
            dataToLoad = p1Data;
          } else {
            alert('This build has no character in P1 slot');
            return;
          }
        }
        window.loadCharacterFromData(dataToLoad);
        window.currentLoadedBuildId = buildId;

        // Show notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 80px;
          right: 20px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: #00ff88;
          padding: 15px 20px;
          border-radius: 10px;
          border: 2px solid #00ff88;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
          z-index: 10001;
          font-weight: bold;
        `;
        notification.textContent = `Loaded build: ${build.character_name}`;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
      }
    } catch (error) {
      console.error('Failed to load build from URL:', error);
      alert('Failed to load build: ' + error.message);
    }
  }
}

/**
 * Setup mercenary level validation
 * Ensures mercenary level is between 1 and player level
 */
function setupMercLevelValidation() {
  const playerLevelInput = document.getElementById('lvlValue');
  const mercLevelInput = document.getElementById('merclvlValue');

  if (!playerLevelInput || !mercLevelInput) return;

  // Validate mercenary level when it changes
  mercLevelInput.addEventListener('input', () => {
    let mercLevel = parseInt(mercLevelInput.value) || 1;
    const playerLevel = parseInt(playerLevelInput.value) || 1;

    // Clamp between 1 and player level
    if (mercLevel < 1) {
      mercLevel = 1;
    } else if (mercLevel > playerLevel) {
      mercLevel = playerLevel;
    }

    mercLevelInput.value = mercLevel;

    // Recalculate mercenary stats when level changes
    if (window.unifiedSocketSystem) {
      window.unifiedSocketSystem.updateAll();
    }
  });

  // Update mercenary max level when player level changes
  playerLevelInput.addEventListener('input', () => {
    const playerLevel = parseInt(playerLevelInput.value) || 1;
    let mercLevel = parseInt(mercLevelInput.value) || 1;

    // If mercenary level exceeds new player level, cap it
    if (mercLevel > playerLevel) {
      mercLevelInput.value = playerLevel;

      // Recalculate mercenary stats since level was capped
      if (window.unifiedSocketSystem) {
        window.unifiedSocketSystem.updateAll();
      }
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

  // 5. Setup mercenary level validation
  setupMercLevelValidation();

  // 6. Setup crit display listeners
  setupCritListeners();

  // 7. Initialize crit display
  setTimeout(updateCritDisplay, 500);

  // 9. Initialize other systems if available
  if (typeof updatePolyLife === 'function') updatePolyLife();

  // 9. Create save button - REMOVED (now in party bar)
  // setTimeout(createSaveButton, 500);

  // 9.5. Create crafting button - REMOVED (now in party bar)
  // setTimeout(createCraftingButton, 600);

  // 9.7. Setup crafting modal handlers
  setTimeout(setupCraftingModalHandlers, 700);

  // 10. Load build from URL if present (wait for auth to be ready)
  setTimeout(async () => {
    // Wait for auth to initialize
    let attempts = 0;
    while (!window.auth && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    loadBuildFromURL();
  }, 1000);

  // 11. Check login state (legacy)
  const username = localStorage.getItem('username');
  if (username && typeof updateUIState === 'function') {
    updateUIState(username);
  }

  // 12. Load crafted items if user is already logged in
  setTimeout(async () => {
    if (window.auth?.isLoggedIn() && window.craftedItemsSystem) {
      try {
        const craftedItems = await window.auth.getCraftedItems();
        window.craftedItemsSystem.loadFromData(craftedItems);

        // Only refresh dropdowns if NOT loading a build from URL
        // (If loading from URL, the build load will handle adding crafted items)
        const urlParams = new URLSearchParams(window.location.search);
        const buildId = urlParams.get('build') || urlParams.get('id');

        if (!buildId && typeof populateItemDropdowns === 'function') {
          populateItemDropdowns();
        }
      } catch (error) {
        console.error('Failed to load crafted items on page load:', error);
      }
    }
  }, 800);
});
