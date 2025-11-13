// Crafted Items System
// Manages creation, storage, and retrieval of player-crafted items

class CraftedItemsSystem {
  constructor() {
    this.craftedItems = []; // Array of crafted items
    this.nextId = 1;

    // Craft types with their benefits
    this.craftTypes = {
      blood: 'Blood Craft',
      caster: 'Caster Craft',
      hitpower: 'Hit Power Craft',
      safety: 'Safety Craft',
      vampiric: 'Vampiric Craft',
      bountiful: 'Bountiful Craft',
      brilliant: 'Brilliant Craft'
    };

    // Possible affixes that can spawn on crafted items (with value ranges)
    this.affixesPool = {
      // Combat
      enhancedDamage: { min: 50, max: 80, label: 'Enhanced Damage' },
      lifeSteal: { min: 3, max: 6, label: 'Life Steal %' },
      attackRating: { min: 50, max: 150, label: 'Attack Rating' },

      // Defense
      enhancedDefense: { min: 25, max: 50, label: 'Enhanced Defense' },
      blockChance: { min: 10, max: 20, label: 'Block Chance %' },

      // Stats
      strength: { min: 5, max: 10, label: '+Strength' },
      dexterity: { min: 5, max: 10, label: '+Dexterity' },
      vitality: { min: 5, max: 10, label: '+Vitality' },
      energy: { min: 5, max: 10, label: '+Energy' },

      // Resistances
      allResist: { min: 5, max: 10, label: 'All Resistances' },
      fireResist: { min: 10, max: 20, label: 'Fire Resist' },
      coldResist: { min: 10, max: 20, label: 'Cold Resist' },
      lightningResist: { min: 10, max: 20, label: 'Lightning Resist' },
      poisonResist: { min: 10, max: 20, label: 'Poison Resist' },

      // Utility
      magicFind: { min: 10, max: 20, label: 'Magic Find %' },
      goldFind: { min: 10, max: 20, label: 'Gold Find %' },
      fastCastRate: { min: 10, max: 20, label: 'FCR' },
      fasterHitRecovery: { min: 10, max: 20, label: 'FHR' },
      fasterRunWalk: { min: 5, max: 10, label: 'FRW %' },
      increasedAttackSpeed: { min: 5, max: 10, label: 'IAS %' },

      // Life/Mana
      life: { min: 10, max: 30, label: '+Life' },
      mana: { min: 10, max: 30, label: '+Mana' },

      // Special
      allSkills: { min: 1, max: 3, label: '+All Skills' },
      curseResist: { min: 10, max: 20, label: 'Curse Resist' }
    };
  }

  /**
   * Create a new crafted item
   * @param {string} name - Item name (up to 11 chars, alphanumeric + space)
   * @param {string} baseType - Base item type (e.g., "War Pike", "Archon Plate")
   * @param {string} craftType - Craft type (blood, caster, hitpower, safety, vampiric, bountiful, brilliant)
   * @param {Object} affixes - Selected affixes with their values {affixKey: value}
   * @returns {Object} Created crafted item or null if validation fails
   */
  createCraftedItem(name, baseType, craftType, affixes = {}) {
    // Validate name
    if (!name || name.length > 11) {
      console.error('Crafted item name must be 1-11 characters');
      return null;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
      console.error('Crafted item name can only contain letters, numbers, and spaces');
      return null;
    }

    // Validate base type exists
    if (!baseType || typeof itemList === 'undefined' || !itemList[baseType]) {
      console.error(`Invalid base item type: ${baseType}`);
      return null;
    }

    // Validate craft type
    if (!this.craftTypes[craftType]) {
      console.error(`Invalid craft type: ${craftType}`);
      return null;
    }

    // Get base item to determine category and copy properties
    const baseItem = itemList[baseType];
    const itemType = detectItemType(baseType, baseItem);

    // Deep copy all properties from base item
    const copiedProperties = {};
    if (baseItem.properties) {
      for (const [key, value] of Object.entries(baseItem.properties)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Deep copy objects (like {min, max, current})
          copiedProperties[key] = JSON.parse(JSON.stringify(value));
        } else {
          // Copy primitives and arrays directly
          copiedProperties[key] = value;
        }
      }
    }

    // Create crafted item as a complete item object
    const fullName = `${name} ${baseType}`;
    const craftedItem = {
      id: `craft_${this.nextId++}`,
      name: name, // Short name (e.g. "myTestWeapon")
      baseType: baseType, // Base type (e.g. "War Pike")
      baseItemName: baseType, // Reference to original base item name
      fullName: fullName, // Full display name (e.g. "myTestWeapon War Pike")
      isCrafted: true, // Flag to identify crafted items
      craftType: craftType,
      craftTypeLabel: this.craftTypes[craftType],
      itemType: itemType, // For dropdown categorization (weapon, armor, etc.)
      affixes: { ...affixes }, // Selected affixes and their values
      description: baseItem.description || '', // Copy description from base item
      properties: copiedProperties, // Copy all base item properties
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
   * @param {Array} data - Array of crafted items from character_data.crafted_items
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
   * Export crafted items for saving
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
