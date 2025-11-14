// Crafted Items System
// Manages creation, storage, and retrieval of player-crafted items

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

    // Possible affixes that can spawn on crafted items (with value ranges)
    // Categorized by prefix/suffix
    // IMPORTANT: propKey must match the property keys used in items.js and main.js propertyDisplay
    this.affixesPool = {
      // PREFIXES (damage, attack rating, defense, skills)
      prefixes: {
        edmg: { min: 50, max: 80, label: '+% Enhanced Damage', propKey: 'edmg' },
        toatt: { min: 50, max: 150, label: 'to Attack Rating', propKey: 'toatt' },
        edef: { min: 25, max: 50, label: '+% Enhanced Defense', propKey: 'edef' },
        allsk: { min: 1, max: 2, label: 'to All Skills', propKey: 'allsk' }
      },

      // SUFFIXES (life, mana, stats, resistances, utility)
      suffixes: {
        tolife: { min: 10, max: 30, label: 'to Life', propKey: 'tolife' },
        tomana: { min: 10, max: 30, label: 'to Mana', propKey: 'tomana' },
        str: { min: 5, max: 10, label: 'to Strength', propKey: 'str' },
        dex: { min: 5, max: 10, label: 'to Dexterity', propKey: 'dex' },
        vit: { min: 5, max: 10, label: 'to Vitality', propKey: 'vit' },
        enr: { min: 5, max: 10, label: 'to Energy', propKey: 'enr' },
        allres: { min: 5, max: 10, label: 'All Resistances', propKey: 'allres' },
        firres: { min: 10, max: 20, label: 'Fire Resist', propKey: 'firres' },
        coldres: { min: 10, max: 20, label: 'Cold Resist', propKey: 'coldres' },
        ligres: { min: 10, max: 20, label: 'Lightning Resist', propKey: 'ligres' },
        poisres: { min: 10, max: 20, label: 'Poison Resist', propKey: 'poisres' },
        magicfind: { min: 10, max: 20, label: 'Better Chance of Getting Magic Items', propKey: 'magicfind' },
        goldfind: { min: 10, max: 20, label: 'Better Chance of Getting Gold', propKey: 'goldfind' },
        fcr: { min: 10, max: 20, label: 'Faster Cast Rate', propKey: 'fcr' },
        fhr: { min: 10, max: 20, label: 'Faster Hit Recovery', propKey: 'fhr' },
        frw: { min: 5, max: 10, label: 'Faster Run/Walk', propKey: 'frw' },
        ias: { min: 5, max: 10, label: 'Increased Attack Speed', propKey: 'ias' }
      }
    };
  }

  /**
   * Create a new crafted item
   * @param {string} name - Item name (up to 11 chars, alphanumeric + space)
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
