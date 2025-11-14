// Crafted Items System
// Manages creation, storage, and retrieval of player-crafted items

class CraftedItemsSystem {
  constructor() {
    this.craftedItems = []; // Array of crafted items
    this.nextId = 1;

    // Craft types with their fixed properties
    this.craftTypes = {
      blood: {
        label: 'Blood Craft',
        fixedProperties: {
          'Enhanced Damage': { min: 50, max: 80, type: 'percentage' },
          'Life Stolen per Hit': { min: 3, max: 6, type: 'percentage' },
          '+Life': { min: 10, max: 20, type: 'flat' }
        }
      }
      // More craft types can be added here later
    };

    // Possible affixes that can spawn on crafted items (with value ranges)
    // Categorized by prefix/suffix
    this.affixesPool = {
      // PREFIXES (damage, attack rating, defense, skills)
      prefixes: {
        enhancedDamage: { min: 50, max: 80, label: '+Enhanced Damage %' },
        attackRating: { min: 50, max: 150, label: '+Attack Rating' },
        enhancedDefense: { min: 25, max: 50, label: '+Enhanced Defense %' },
        allSkills: { min: 1, max: 2, label: '+All Skills' }
      },

      // SUFFIXES (life, mana, stats, resistances, utility)
      suffixes: {
        life: { min: 10, max: 30, label: '+Life' },
        mana: { min: 10, max: 30, label: '+Mana' },
        strength: { min: 5, max: 10, label: '+Strength' },
        dexterity: { min: 5, max: 10, label: '+Dexterity' },
        vitality: { min: 5, max: 10, label: '+Vitality' },
        energy: { min: 5, max: 10, label: '+Energy' },
        allResist: { min: 5, max: 10, label: '+All Resistances' },
        fireResist: { min: 10, max: 20, label: '+Fire Resist' },
        coldResist: { min: 10, max: 20, label: '+Cold Resist' },
        lightningResist: { min: 10, max: 20, label: '+Lightning Resist' },
        poisonResist: { min: 10, max: 20, label: '+Poison Resist' },
        magicFind: { min: 10, max: 20, label: '+Magic Find %' },
        goldFind: { min: 10, max: 20, label: '+Gold Find %' },
        fastCastRate: { min: 10, max: 20, label: '+FCR' },
        fasterHitRecovery: { min: 10, max: 20, label: '+FHR' },
        fasterRunWalk: { min: 5, max: 10, label: '+FRW %' },
        increasedAttackSpeed: { min: 5, max: 10, label: '+IAS %' }
      }
    };
  }

  /**
   * Create a new crafted item
   * @param {string} name - Item name (up to 11 chars, alphanumeric + space)
   * @param {string} baseType - Base item type (e.g., "War Pike", "Hand Axe")
   * @param {string} craftType - Craft type (blood, etc.)
   * @param {Object} affixes - Selected affixes {prefixes: {key: value}, suffixes: {key: value}}
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

    // Build base weapon properties from lookup tables
    const baseProperties = {};

    // Add damage from baseDamages
    if (baseDamages[baseType]) {
      baseProperties.damage = { ...baseDamages[baseType] };
    }

    // Add strength requirement from baseStrengths (if defined)
    if (typeof baseStrengths !== 'undefined' && baseStrengths[baseType]) {
      baseProperties.reqstr = baseStrengths[baseType];
    }

    // Get fixed properties from craft type
    const craftConfig = this.craftTypes[craftType];
    const fixedProperties = {};
    for (const [propName, propData] of Object.entries(craftConfig.fixedProperties)) {
      // Roll a random value within the range
      const value = Math.floor(Math.random() * (propData.max - propData.min + 1)) + propData.min;
      fixedProperties[propName] = { value, type: propData.type };
    }

    // Create crafted item as a complete item object
    const fullName = `${name} ${baseType}`;

    // Build description dynamically
    let description = `<span style="color: #ffd700; font-weight: bold;">${fullName}</span><br>`;
    description += `<span style="color: #8888ff;">${craftConfig.label}</span><br>`;
    description += `${baseType}<br>`;

    // Base properties
    if (baseProperties.damage) {
      description += `Damage: ${baseProperties.damage.min}-${baseProperties.damage.max}<br>`;
    }
    if (baseProperties.reqstr) {
      description += `Required Strength: ${baseProperties.reqstr}<br>`;
    }
    description += '<br>';

    // Fixed properties (from craft type)
    for (const [propName, propData] of Object.entries(fixedProperties)) {
      const sign = propData.value > 0 ? '+' : '';
      const suffix = propData.type === 'percentage' ? '%' : '';
      description += `<span style="color: #0f9eff;">${sign}${propData.value}${suffix} ${propName}</span><br>`;
    }

    // Prefixes
    if (affixes.prefixes && Object.keys(affixes.prefixes).length > 0) {
      for (const [affixKey, affixValue] of Object.entries(affixes.prefixes)) {
        const affixDef = this.affixesPool.prefixes[affixKey];
        if (affixDef) {
          description += `<span style="color: #8888ff;">${affixDef.label.replace('+', '')}: ${affixValue}</span><br>`;
        }
      }
    }

    // Suffixes
    if (affixes.suffixes && Object.keys(affixes.suffixes).length > 0) {
      for (const [affixKey, affixValue] of Object.entries(affixes.suffixes)) {
        const affixDef = this.affixesPool.suffixes[affixKey];
        if (affixDef) {
          description += `<span style="color: #8888ff;">${affixDef.label.replace('+', '')}: ${affixValue}</span><br>`;
        }
      }
    }
    const craftedItem = {
      id: `craft_${this.nextId++}`,
      name: name, // Short name (e.g. "myTestWeapon")
      baseType: baseType, // Base type (e.g. "War Pike")
      baseItemName: baseType, // Reference to original base item name
      fullName: fullName, // Full display name (e.g. "myTestWeapon War Pike")
      isCrafted: true, // Flag to identify crafted items
      craftType: craftType,
      craftTypeLabel: craftConfig.label,
      itemType: 'weapon', // Weapons only for now
      baseProperties: baseProperties, // Base weapon properties (damage, requirements)
      fixedProperties: fixedProperties, // Fixed craft properties
      affixes: affixes, // Selected affixes with their values
      description: description, // Dynamically built description
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
