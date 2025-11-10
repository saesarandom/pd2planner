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
const BASE_TYPE_CATEGORIES = {
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
  'Vortex Shield': 'shield',

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
  }
}

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

  // Base defense values for different item types
  const baseDefenseMap = {
    'Buckler': 6,
    'Kite Shield': 18,
    'Light Plate': 90,
    'Skull Cap': 8,
    // Add more as needed
  };

  // Calculate dynamic defense if item has edef
  let calculatedDefense = null;
  let defenseDisplay = null;
  if (props.edef && item.baseType && baseDefenseMap[item.baseType]) {
    const baseItemDefense = baseDefenseMap[item.baseType];
    const edefValue = getPropertyValue(props.edef || 0);
    const todefValue = props.todef || 0;

    // Formula: floor((base + 1) * (1 + edef/100)) + todef
    // The +1 is the same as in damage calculation
    calculatedDefense = Math.floor((baseItemDefense + 1) * (1 + edefValue / 100)) + todefValue;

    // Calculate min and max for display
    const edefProp = props.edef;
    if (typeof edefProp === 'object' && edefProp.min && edefProp.max) {
      const minDef = Math.floor((baseItemDefense + 1) * (1 + edefProp.min / 100)) + todefValue;
      const maxDef = Math.floor((baseItemDefense + 1) * (1 + edefProp.max / 100)) + todefValue;
      defenseDisplay = `Defense: ${calculatedDefense} (${minDef}-${maxDef})`;
    } else {
      defenseDisplay = `Defense: ${calculatedDefense}`;
    }
  }

  // Map property keys to display format
  const propertyDisplay = {
    defense: (val) => defenseDisplay !== null ? defenseDisplay : `Defense: ${val}`,
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
    dur: (val) => `Durability: ${val}`,
    block1: (val) => `Chance to Block: ${val}%`,
    edmg: (val, prop) => formatVariableStat('+', val, '% Enhanced Damage', prop, itemName, 'edmg', dropdownId),
    toatt: (val, prop) => formatVariableStat('', val, ' to Attack Rating', prop, itemName, 'toatt', dropdownId),
    todef: (val) => `+${val} Defense`,
    tolife: (val) => `+${val} to Life`,
    tomana: (val) => `+${val} to Mana`,
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
    sorsk: (val, prop) => formatVariableStat('+', val, ' to Sorceress Skill Levels', prop, itemName, 'sorsk', dropdownId),
    fcr: (val, prop) => formatVariableStat('+', val, '% Faster Cast Rate', prop, itemName, 'fcr', dropdownId),
    lightrad: (val) => `+${val} to Light Radius`,
    ctcbonespearcast: (val, prop) => {
      const level = props.ctcbonespearcastlevel || 2;
      return `${val}% Chance to Cast Level ${level} Bone Spear on Cast`;
    },
    magicfind: (val, prop) => formatVariableStat('', val, '% Better Chance of Getting Magic Items', prop, itemName, 'magicfind', dropdownId),
    maxdmgperlvl: (val, prop) => formatLevelScaledStat(val, prop, itemName, 'maxdmgperlvl', dropdownId),
  };

  // Build description from properties
  // Skip certain properties that are metadata or handled elsewhere
  const skipProperties = ['javelin', 'speed', 'onehandmax', 'twohandmax', 'throwmax', 'smitedmgmax'];

  // Iterate through propertyDisplay keys in order to control display order
  // This ensures damage lines appear in the correct position, not at the end
  for (const key of Object.keys(propertyDisplay)) {
    if (skipProperties.includes(key)) continue;
    if (!(key in props)) continue;

    const prop = props[key];
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

    // Update crit multiplier display if deadly strike changed
    if (propKey === 'deadly' && typeof updateCritDisplay === 'function') {
      updateCritDisplay();
    }

    // Update weapon damage display if this is a weapon stat change
    if (dropdownId === 'weapons-dropdown' && typeof window.updateWeaponDamageDisplay === 'function') {
      window.updateWeaponDamageDisplay();
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

  // Try to get item info from itemList
  const item = itemList && itemList[selectedItemName];

  if (item) {
    // Reset any .current values for dynamic items to ensure fresh regeneration
    // This prevents values from "sticking" when switching between items
    // BUT skip if we're loading a saved build (to preserve the saved values)
    if (item.properties && item.baseType && !window._isLoadingCharacterData) {
      Object.keys(item.properties).forEach(key => {
        const prop = item.properties[key];
        if (typeof prop === 'object' && prop !== null && 'max' in prop) {
          // Reset to max value instead of deleting to avoid [object Object] display
          prop.current = prop.max;
        }
      });
    }

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
  const section = window.SECTION_MAP && window.SECTION_MAP[dropdown.id];
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
 * Save current build to the cloud
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
    const characterData = window.exportCharacterData();

    const result = await window.auth.saveCharacter(buildName.trim(), characterData);

    // Show alerts for newly unlocked achievements
    if (result.newAchievements && result.newAchievements.length > 0) {
      result.newAchievements.forEach(achievement => {
        alert(`🏆 Achievement Unlocked!\n\n${achievement.name}\n\n${achievement.description}`);
      });
    }

    alert(`Build saved successfully!\n\nShare URL: https://pd2planner.net/?build=${result.character.build_id}\n\nClick "Share" in My Builds to copy the link.`);
  } catch (error) {
    console.error('Failed to save build:', error);
    alert('Failed to save build: ' + error.message);
  }
}

/**
 * Quick save - updates existing build
 */
async function quickSaveBuild() {
  if (!window.auth?.isLoggedIn()) {
    alert('Please login to save builds!');
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
  saveBtn.innerHTML = '💾 Save Build';
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
 */
async function loadBuildFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const buildId = urlParams.get('build') || urlParams.get('id');

  if (buildId && window.auth) {
    try {
      const build = await window.auth.getBuild(buildId);
      if (build && build.character_data) {
        window.loadCharacterFromData(build.character_data);
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

  // 8. Create save button
  setTimeout(createSaveButton, 500);

  // 9. Load build from URL if present
  setTimeout(loadBuildFromURL, 1000);

  // 10. Check login state (legacy)
  const username = localStorage.getItem('username');
  if (username && typeof updateUIState === 'function') {
    updateUIState(username);
  }
});
