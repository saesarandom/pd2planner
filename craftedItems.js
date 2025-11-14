// Crafted Items System
// Manages creation, storage, and retrieval of player-crafted items

// Weapon classification for damage display
const twoHandedOnlyWeapons = new Set([
  // Axes (two-handed only)
  'Large Axe', 'Broad Axe', 'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe',
  // Maces/Hammers (two-handed only)
  'Maul', 'Great Maul',
  // Spears & Polearms (two-handed only)
  'Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike', 'Bardiche', 'Voulge', 'Scythe',
  'Poleaxe', 'Halberd', 'War Scythe',
  // Staves (two-handed only)
  'Short Staff', 'Long Staff', 'Gnarled Staff', 'Battle Staff', 'War Staff',
  // Bows/Crossbows (all two-handed only)
  'Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow',
  'Short War Bow', 'Long War Bow', 'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow'
]);

// Weapons that can be wielded both one-handed and two-handed
const versatileWeapons = new Set([
  'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword'
]);

// Item type category definitions for affix matching
const itemTypeCategories = {
  // Weapon categories
  'WeaponP': new Set([
    // Axes
    'Hand Axe', 'Axe', 'Double Axe', 'Military Pick', 'War Axe', 'Large Axe', 'Broad Axe',
    'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe',
    // Swords
    'Short Sword', 'Scimitar', 'Sabre', 'Falchion', 'Crystal Sword', 'Broad Sword', 'Long Sword',
    'War Sword', 'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword',
    // Daggers/Knives
    'Dagger', 'Dirk', 'Kris', 'Blade',
    // Maces/Clubs/Hammers
    'Club', 'Spiked Club', 'Mace', 'Morning Star', 'Flail', 'War Hammer', 'Maul', 'Great Maul',
    // Spears/Polearms
    'Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike', 'Bardiche', 'Voulge', 'Scythe', 'Poleaxe', 'Halberd', 'War Scythe',
    // Javelins/Throwing
    'Javelin', 'Pilum', 'Short Spear', 'Glaive', 'Throwing Spear', 'Throwing Knife', 'Throwing Axe',
    // Bows/Crossbows
    'Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow',
    'Short War Bow', 'Long War Bow', 'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow',
    // Scepters
    'Scepter',
    // Claws
    'Katar', 'Wrist Blade', 'Hatchet Hands', 'Cestus', 'Claws'
  ]),

  'WeaponPS': new Set([
    // All WeaponP items plus Staff (excludes only Orb & Wand)
    'Hand Axe', 'Axe', 'Double Axe', 'Military Pick', 'War Axe', 'Large Axe', 'Broad Axe',
    'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe',
    'Short Sword', 'Scimitar', 'Sabre', 'Falchion', 'Crystal Sword', 'Broad Sword', 'Long Sword',
    'War Sword', 'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword',
    'Dagger', 'Dirk', 'Kris', 'Blade',
    'Club', 'Spiked Club', 'Mace', 'Morning Star', 'Flail', 'War Hammer', 'Maul', 'Great Maul',
    'Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike', 'Bardiche', 'Voulge', 'Scythe', 'Poleaxe', 'Halberd', 'War Scythe',
    'Javelin', 'Pilum', 'Short Spear', 'Glaive', 'Throwing Spear', 'Throwing Knife', 'Throwing Axe',
    'Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow',
    'Short War Bow', 'Long War Bow', 'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow',
    'Scepter', 'Katar', 'Wrist Blade', 'Hatchet Hands', 'Cestus', 'Claws',
    // Staff
    'Short Staff', 'Long Staff', 'Gnarled Staff', 'Battle Staff', 'War Staff'
  ]),

  'Axe': new Set(['Hand Axe', 'Axe', 'Double Axe', 'Military Pick', 'War Axe', 'Large Axe', 'Broad Axe', 'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe']),
  'Sword': new Set(['Short Sword', 'Scimitar', 'Sabre', 'Falchion', 'Crystal Sword', 'Broad Sword', 'Long Sword', 'War Sword', 'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword']),
  'Mace': new Set(['Mace', 'Morning Star', 'Flail', 'War Hammer']),
  'Club': new Set(['Club', 'Spiked Club']),
  'Hammer': new Set(['War Hammer', 'Maul', 'Great Maul']),
  'Spear': new Set(['Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike']),
  'Polearm': new Set(['Pike', 'Bardiche', 'Voulge', 'Scythe', 'Poleaxe', 'Halberd', 'War Scythe']),
  'Knife': new Set(['Dagger', 'Dirk', 'Kris', 'Blade', 'Throwing Knife']),
  'Missile Weapon': new Set(['Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow', 'Short War Bow', 'Long War Bow', 'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow']),
};

// Affix database - Prefixes only (suffixes to be added later)
const affixDatabase = {
  prefixes: {
    // Enhanced Defense
    'Sturdy': { stats: { edef: { min: 20, max: 30 } }, itemTypes: ['Armor'], reqLvl: 3, group: 101 },
    'Strong': { stats: { edef: { min: 31, max: 40 } }, itemTypes: ['Armor'], reqLvl: 6, group: 101 },
    'Glorious': { stats: { edef: { min: 41, max: 50 } }, itemTypes: ['Armor'], reqLvl: 14, group: 101 },
    'Blessed': { stats: { edef: { min: 51, max: 65 } }, itemTypes: ['Armor'], reqLvl: 18, group: 101 },
    'Saintly': { stats: { edef: { min: 66, max: 80 } }, itemTypes: ['Armor'], reqLvl: 23, group: 101 },
    'Holy': { stats: { edef: { min: 81, max: 100 } }, itemTypes: ['Armor'], reqLvl: 27, group: 101 },
    'Godly': { stats: { edef: { min: 101, max: 200 } }, itemTypes: ['Armor'], reqLvl: 38, group: 101 },

    // Enhanced Damage
    'Jagged': { stats: { edmg: { min: 10, max: 20 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 1, group: 105 },
    'Deadly': { stats: { edmg: { min: 21, max: 30 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 3, group: 105 },
    'Vicious': { stats: { edmg: { min: 31, max: 40 } }, itemTypes: ['WeaponP'], reqLvl: 6, group: 105 },
    'Brutal': { stats: { edmg: { min: 41, max: 50 } }, itemTypes: ['WeaponP'], reqLvl: 10, group: 105 },
    'Massive': { stats: { edmg: { min: 51, max: 65 } }, itemTypes: ['WeaponP'], reqLvl: 15, group: 105 },
    'Savage': { stats: { edmg: { min: 66, max: 80 } }, itemTypes: ['WeaponP'], reqLvl: 19, group: 105 },
    'Merciless': { stats: { edmg: { min: 81, max: 100 } }, itemTypes: ['WeaponP'], reqLvl: 24, group: 105 },
    'Ferocious': { stats: { edmg: { min: 101, max: 200 } }, itemTypes: ['WeaponP'], reqLvl: 33, group: 105 },
    'Cruel': { stats: { edmg: { min: 201, max: 300 } }, itemTypes: ['WeaponP'], reqLvl: 43, group: 105 },

    // Attack Rating
    'Bronze': { stats: { toatt: { min: 10, max: 20 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 1, group: 110 },
    'Iron': { stats: { toatt: { min: 21, max: 40 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 3, group: 110 },
    'Steel': { stats: { toatt: { min: 41, max: 60 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 6, group: 110 },
    'Silver': { stats: { toatt: { min: 61, max: 80 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 9, group: 110 },
    'Gold': { stats: { toatt: { min: 81, max: 100 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 12, group: 110 },
    'Platinum': { stats: { toatt: { min: 101, max: 120 } }, itemTypes: ['WeaponP', 'Circlet'], reqLvl: 16, group: 110 },
    'Meteoric': { stats: { toatt: { min: 121, max: 150 } }, itemTypes: ['WeaponP'], reqLvl: 20, group: 110 },
    'Strange': { stats: { toatt: { min: 151, max: 300 } }, itemTypes: ['WeaponP'], reqLvl: 24, group: 110 },
    'Weird': { stats: { toatt: { min: 301, max: 450 } }, itemTypes: ['WeaponP'], reqLvl: 27, group: 110 },

    // Attack Rating + Enhanced Damage (hybrid)
    'Sharp': { stats: { toatt: { min: 10, max: 20 }, edmg: { min: 10, max: 20 } }, itemTypes: ['WeaponP'], reqLvl: 3, group: 111 },
    'Fine': { stats: { toatt: { min: 21, max: 40 }, edmg: { min: 21, max: 30 } }, itemTypes: ['WeaponP'], reqLvl: 9, group: 111 },
    "Warrior's": { stats: { toatt: { min: 41, max: 60 }, edmg: { min: 31, max: 40 } }, itemTypes: ['WeaponP'], reqLvl: 13, group: 111 },
    "Soldier's": { stats: { toatt: { min: 61, max: 80 }, edmg: { min: 41, max: 50 } }, itemTypes: ['WeaponP'], reqLvl: 19, group: 111 },
    "Knight's": { stats: { toatt: { min: 81, max: 100 }, edmg: { min: 51, max: 65 } }, itemTypes: ['WeaponP'], reqLvl: 30, group: 111 },
    "Lord's": { stats: { toatt: { min: 101, max: 120 }, edmg: { min: 66, max: 80 } }, itemTypes: ['WeaponP'], reqLvl: 39, group: 111 },
    "King's": { stats: { toatt: { min: 121, max: 150 }, edmg: { min: 81, max: 100 } }, itemTypes: ['WeaponP'], reqLvl: 48, group: 111 },
    "Master's": { stats: { toatt: { min: 151, max: 250 }, edmg: { min: 101, max: 150 } }, itemTypes: ['WeaponP'], reqLvl: 48, group: 111 },
    "Grandmaster's": { stats: { toatt: { min: 251, max: 300 }, edmg: { min: 151, max: 200 } }, itemTypes: ['WeaponP', 'Missile Weapon'], reqLvl: 61, group: 111 },

    // Damage to Undead + Attack Rating vs Undead
    'Consecrated': { stats: { dmgtoun: { min: 25, max: 75 }, toattun: { min: 25, max: 75 } }, itemTypes: ['WeaponPS'], reqLvl: 1, group: 142 },
    'Pure': { stats: { dmgtoun: { min: 76, max: 125 }, toattun: { min: 76, max: 175 } }, itemTypes: ['WeaponPS'], reqLvl: 11, group: 142 },
    'Sacred': { stats: { dmgtoun: { min: 126, max: 200 }, toattun: { min: 175, max: 250 } }, itemTypes: ['WeaponPS'], reqLvl: 18, group: 142 },
    'Hallowed': { stats: { dmgtoun: { min: 201, max: 275 }, toattun: { min: 251, max: 325 } }, itemTypes: ['WeaponPS'], reqLvl: 27, group: 142 },
    'Divine': { stats: { dmgtoun: { min: 276, max: 350 }, toattun: { min: 326, max: 450 } }, itemTypes: ['WeaponPS', 'Missile Weapon'], reqLvl: 37, group: 142 },
  },

  suffixes: {
    // To be added later
  }
};

/**
 * Check if a base item type matches an item category
 * @param {string} baseType - The base item (e.g., "Ancient Axe")
 * @param {string} categories - Comma-separated categories (e.g., "WeaponP, Circlet")
 * @returns {boolean} True if the item matches any of the categories
 */
function itemMatchesCategories(baseType, categories) {
  if (!categories || !baseType) return false;

  const categoryList = categories.split(',').map(c => c.trim());

  for (const category of categoryList) {
    // Check if the category exists in our mapping
    if (itemTypeCategories[category]?.has(baseType)) {
      return true;
    }

    // Direct match (for specific item types not in categories)
    if (category === baseType) {
      return true;
    }
  }

  return false;
}

class CraftedItemsSystem {
  constructor() {
    this.craftedItems = []; // Array of crafted items
    this.nextId = 1;

    // Craft types with their fixed properties
    // IMPORTANT: Use the same property keys as regular items (edmg, lleech, tolife, etc.)
    this.craftTypes = {
      blood: {
        label: 'Blood Craft',
        fixedProperties: {
          edmg: { min: 50, max: 80 },      // Enhanced Damage
          lleech: { min: 3, max: 6 },      // Life Stolen per Hit
          tolife: { min: 10, max: 20 }     // +Life
        }
      }
      // More craft types can be added here later
    };
  }

  /**
   * Get available affixes for a base item type
   * @param {string} baseType - Base item (e.g., "Ancient Axe")
   * @param {string} affixType - 'prefixes' or 'suffixes'
   * @param {Array<number>} excludeGroups - Groups to exclude (already selected affixes)
   * @returns {Array} Available affixes with their data
   */
  getAvailableAffixes(baseType, affixType = 'prefixes', excludeGroups = []) {
    const affixes = [];
    const affixPool = affixDatabase[affixType];

    if (!affixPool) return affixes;

    for (const [name, data] of Object.entries(affixPool)) {
      // Skip if group is already used
      if (excludeGroups.includes(data.group)) continue;

      // Check if this affix can spawn on this base type
      const matchesType = data.itemTypes.some(category =>
        itemMatchesCategories(baseType, category)
      );

      if (matchesType) {
        affixes.push({
          name,
          ...data,
          // Add property keys for easy access
          propKeys: Object.keys(data.stats)
        });
      }
    }

    return affixes;
  }

  /**
   * Validate that selected affixes don't have duplicate groups
   * @param {Object} affixes - {prefixes: {name: value}, suffixes: {name: value}}
   * @returns {Object} {valid: boolean, error: string}
   */
  validateAffixGroups(affixes) {
    const usedGroups = new Set();

    // Check prefixes
    for (const name of Object.keys(affixes.prefixes || {})) {
      const affix = affixDatabase.prefixes[name];
      if (!affix) continue;

      if (usedGroups.has(affix.group)) {
        return { valid: false, error: `Cannot have multiple affixes from group ${affix.group}` };
      }
      usedGroups.add(affix.group);
    }

    // Check suffixes
    for (const name of Object.keys(affixes.suffixes || {})) {
      const affix = affixDatabase.suffixes[name];
      if (!affix) continue;

      if (usedGroups.has(affix.group)) {
        return { valid: false, error: `Cannot have multiple affixes from group ${affix.group}` };
      }
      usedGroups.add(affix.group);
    }

    return { valid: true };
  }

  /**
   * Roll affix values and convert to properties
   * @param {Object} affixSelection - {prefixes: {name: true/false}, suffixes: {name: true/false}}
   * @returns {Object} {prefixes: {propKey: value}, suffixes: {propKey: value}}
   */
  rollAffixValues(affixSelection) {
    const result = { prefixes: {}, suffixes: {} };

    // Roll prefix values
    for (const name of Object.keys(affixSelection.prefixes || {})) {
      const affix = affixDatabase.prefixes[name];
      if (!affix) continue;

      // Roll each stat in the affix
      for (const [propKey, range] of Object.entries(affix.stats)) {
        const value = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        // If propKey already exists, add to it (for multi-stat affixes)
        result.prefixes[propKey] = (result.prefixes[propKey] || 0) + value;
      }
    }

    // Roll suffix values
    for (const name of Object.keys(affixSelection.suffixes || {})) {
      const affix = affixDatabase.suffixes[name];
      if (!affix) continue;

      for (const [propKey, range] of Object.entries(affix.stats)) {
        const value = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        result.suffixes[propKey] = (result.suffixes[propKey] || 0) + value;
      }
    }

    return result;
  }

  /**
   * Create a new crafted item
   * @param {string} name - Item name (up to 21 chars, alphanumeric + space)
   * @param {string} baseType - Base item type (e.g., "War Pike", "Hand Axe")
   * @param {string} craftType - Craft type (blood, etc.)
   * @param {Object} affixes - Selected affixes {prefixes: {propKey: value}, suffixes: {propKey: value}}
   * @returns {Object} Created crafted item or null if validation fails
   */
  createCraftedItem(name, baseType, craftType, affixes = { prefixes: {}, suffixes: {} }) {
    // Validate name
    if (!name || name.length > 21) {
      console.error('Crafted item name must be 1-21 characters');
      return null;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
      console.error('Crafted item name can only contain letters, numbers, and spaces');
      return null;
    }

    // Validate base type exists in baseDamages (for weapons)
    if (!baseType || typeof baseDamages === 'undefined' || !baseDamages[baseType]) {
      console.error(`Invalid base weapon type: ${baseType}`);
      return null;
    }

    // Validate craft type
    if (!this.craftTypes[craftType]) {
      console.error(`Invalid craft type: ${craftType}`);
      return null;
    }

    // Validate affixes
    const prefixCount = Object.keys(affixes.prefixes || {}).length;
    const suffixCount = Object.keys(affixes.suffixes || {}).length;
    const totalAffixes = prefixCount + suffixCount;

    if (totalAffixes < 3 || totalAffixes > 6) {
      console.error(`Total affixes must be between 3-6 (got ${totalAffixes})`);
      return null;
    }

    if (prefixCount > 3 || suffixCount > 3) {
      console.error(`Maximum 3 prefixes and 3 suffixes (got ${prefixCount} prefixes, ${suffixCount} suffixes)`);
      return null;
    }

    // Build properties object (same structure as regular items)
    const properties = {};

    // Add strength requirement from baseStrengths (if defined)
    if (typeof baseStrengths !== 'undefined' && baseStrengths[baseType]) {
      properties.reqstr = baseStrengths[baseType];
    }

    // Add required level from baseRequiredLevels lookup table
    if (typeof baseRequiredLevels !== 'undefined' && baseRequiredLevels[baseType]) {
      properties.reqlvl = baseRequiredLevels[baseType];
    }

    // Get fixed properties from craft type and roll their values
    const craftConfig = this.craftTypes[craftType];
    for (const [propKey, propData] of Object.entries(craftConfig.fixedProperties)) {
      // Roll a random value within the range
      const value = Math.floor(Math.random() * (propData.max - propData.min + 1)) + propData.min;
      // If property already exists, add to it; otherwise set it
      properties[propKey] = (properties[propKey] || 0) + value;
    }

    // Add affix properties using their correct property keys
    if (affixes.prefixes) {
      for (const [propKey, value] of Object.entries(affixes.prefixes)) {
        // If property already exists, add to it; otherwise set it
        properties[propKey] = (properties[propKey] || 0) + value;
      }
    }

    if (affixes.suffixes) {
      for (const [propKey, value] of Object.entries(affixes.suffixes)) {
        // If property already exists, add to it; otherwise set it
        properties[propKey] = (properties[propKey] || 0) + value;
      }
    }

    // Create crafted item as a complete item object
    const fullName = `${name} ${baseType}`;

    const craftedItem = {
      id: `craft_${this.nextId++}`,
      name: name, // Short name (e.g. "myTestWeapon")
      baseType: baseType, // Base type (e.g. "War Pike") - needed for dynamic generation
      baseItemName: baseType, // Reference to original base item name
      fullName: fullName, // Full display name (e.g. "myTestWeapon War Pike")
      isCrafted: true, // Flag to identify crafted items
      craftType: craftType,
      craftTypeLabel: craftConfig.label,
      itemType: 'weapon', // Weapons only for now
      properties: properties, // Properties using same keys as regular items
      // NO description property - let generateItemDescription() handle it
      createdAt: new Date().toISOString()
    };

    this.craftedItems.push(craftedItem);
    return craftedItem;
  }

  /**
   * Get all crafted items of a specific type (weapon, armor, etc.)
   * @param {string} itemType - Item type (weapon, helm, armor, etc.)
   * @returns {Array} Array of crafted items for that type
   */
  getCraftedItemsByType(itemType) {
    return this.craftedItems.filter(item => item.itemType === itemType);
  }

  /**
   * Get all crafted items
   * @returns {Array} All crafted items
   */
  getAllCraftedItems() {
    return [...this.craftedItems];
  }

  /**
   * Get a crafted item by its full name
   * @param {string} fullName - The crafted item's full name (e.g. "myTestWeapon War Pike")
   * @returns {Object|null} The crafted item or null if not found
   */
  getCraftedItemByName(fullName) {
    return this.craftedItems.find(item => item.fullName === fullName) || null;
  }

  /**
   * Check if an item name refers to a crafted item
   * @param {string} itemName - Item name to check
   * @returns {boolean} True if it's a crafted item
   */
  isCraftedItem(itemName) {
    return this.craftedItems.some(item => item.fullName === itemName);
  }

  /**
   * Delete a crafted item by ID
   * @param {string} id - Crafted item ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteCraftedItem(id) {
    const index = this.craftedItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.craftedItems.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Load crafted items from saved data
   * @param {Array} data - Array of crafted items from backend or character_data
   */
  loadFromData(data) {
    if (!Array.isArray(data)) return;

    this.craftedItems = [...data];

    // Update nextId to ensure no conflicts
    if (data.length > 0) {
      const maxId = Math.max(...data.map(item => parseInt(item.id.split('_')[1]) || 0));
      this.nextId = maxId + 1;
    }
  }

  /**
   * Export crafted items for saving to character_data
   * @returns {Array} Serialized crafted items
   */
  exportToData() {
    return JSON.parse(JSON.stringify(this.craftedItems));
  }

  /**
   * Clear all crafted items
   */
  clear() {
    this.craftedItems = [];
    this.nextId = 1;
  }
}

// Initialize global crafted items system
window.craftedItemsSystem = new CraftedItemsSystem();

// Expose affix database and item type categories globally for UI access
window.affixDatabase = affixDatabase;
window.itemTypeCategories = itemTypeCategories;

// Debug: Confirm exposure
console.log('craftedItems.js loaded - affixDatabase exposed:', {
  hasPrefixes: !!window.affixDatabase?.prefixes,
  prefixCount: Object.keys(window.affixDatabase?.prefixes || {}).length,
  hasSuffixes: !!window.affixDatabase?.suffixes,
  suffixCount: Object.keys(window.affixDatabase?.suffixes || {}).length
});
