/**
 * SetTracker - Tracks equipped set items and applies set bonuses
 */
class SetTracker {
  constructor() {
    this.equippedSets = new Map(); // Map of setName -> {items: [], bonuses: []}
    this.setupItemListeners();
  }

  /**
   * Extract set name from item name
   * Examples: "Arcanna's Flesh" -> "Arcanna's"
   *           "Angelic Mantle" -> "Angelic"
   */
  extractSetName(itemName) {
    if (!itemName) return null;

    // Set items typically have pattern: "SetName's ItemType" or "SetName ItemType"
    // Extract everything before the last word (which is usually the item type)
    const parts = itemName.trim().split(' ');

    if (parts.length >= 2) {
      // Take all but the last word
      const setName = parts.slice(0, -1).join(' ');
      return setName;
    }

    return null;
  }

  /**
   * Check if an item is a set item by looking for set bonus markers in description
   */
  isSetItem(item) {
    if (!item || !item.description) return false;
    // Set items have patterns like "(2 Items)", "(3 Items)", "(Complete Set)"
    return /\(\d+\s+Items?\)|\(Complete Set\)/i.test(item.description);
  }

  /**
   * Parse set bonuses from item description
   * Returns array of {itemCount: number, bonuses: [{stat: string, value: any, text: string}]}
   */
  parseSetBonuses(description) {
    if (!description) return [];

    const bonuses = [];
    const lines = description.split('<br>');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Match patterns like "+100 Defense (2 Items)" or "(2 Items) +100 Defense"
      const match = line.match(/^(?:\((\d+)\s+Items?\)|.*?)\s*(.*?)\s*\((\d+)\s+Items?\)$/i);
      const completeSetMatch = line.match(/^(.*?)\s*\(Complete Set\)$/i);

      if (match) {
        const itemCount = parseInt(match[1] || match[3]);
        const bonusText = (match[2] || match[1]).trim();

        if (bonusText && itemCount) {
          const parsedBonus = this.parseStatBonus(bonusText, line);
          if (parsedBonus) {
            let bonus = bonuses.find(b => b.itemCount === itemCount);
            if (!bonus) {
              bonus = { itemCount, bonuses: [] };
              bonuses.push(bonus);
            }
            bonus.bonuses.push(parsedBonus);
          }
        }
      } else if (completeSetMatch) {
        const bonusText = completeSetMatch[1].trim();
        const parsedBonus = this.parseStatBonus(bonusText, line);

        if (parsedBonus) {
          let bonus = bonuses.find(b => b.itemCount === 'complete');
          if (!bonus) {
            bonus = { itemCount: 'complete', bonuses: [] };
            bonuses.push(bonus);
          }
          bonus.bonuses.push(parsedBonus);
        }
      }
    }

    return bonuses;
  }

  /**
   * Parse individual stat bonus from text
   * Returns {stat: string, value: number, text: string} or null
   */
  parseStatBonus(bonusText, fullLine) {
    if (!bonusText) return null;

    // Patterns to match:
    // "+100 Defense" -> {stat: 'defense', value: 100}
    // "+3 Defense per Character Level" -> {stat: 'defensePerLevel', value: 3}
    // "+20 to Energy" -> {stat: 'energy', value: 20}
    // "+20% Faster Cast Rate" -> {stat: 'fcr', value: 20}
    // "Lightning Resist +25%" -> {stat: 'lightningResist', value: 25}
    // "Regenerate Mana 20%" -> {stat: 'regenMana', value: 20}

    const result = {
      stat: null,
      value: 0,
      text: fullLine,
      rawText: bonusText
    };

    // Try to extract numeric value
    const numMatch = bonusText.match(/([+-]?\d+)/);
    if (numMatch) {
      result.value = parseInt(numMatch[1]);
    }

    // Detect stat type
    const lowerText = bonusText.toLowerCase();

    // Defense
    if (lowerText.includes('defense') && lowerText.includes('per character level')) {
      result.stat = 'defensePerLevel';
    } else if (lowerText.includes('defense')) {
      result.stat = 'defense';
    }
    // Energy
    else if (lowerText.includes('energy')) {
      result.stat = 'energy';
    }
    // Strength
    else if (lowerText.includes('strength')) {
      result.stat = 'strength';
    }
    // Dexterity
    else if (lowerText.includes('dexterity')) {
      result.stat = 'dexterity';
    }
    // Vitality
    else if (lowerText.includes('vitality')) {
      result.stat = 'vitality';
    }
    // Resistances
    else if (lowerText.includes('lightning resist')) {
      result.stat = 'lightningResist';
    } else if (lowerText.includes('fire resist')) {
      result.stat = 'fireResist';
    } else if (lowerText.includes('cold resist')) {
      result.stat = 'coldResist';
    } else if (lowerText.includes('poison resist')) {
      result.stat = 'poisonResist';
    } else if (lowerText.includes('all resist')) {
      result.stat = 'allResist';
    }
    // Faster Cast Rate
    else if (lowerText.includes('faster cast rate') || lowerText.includes('fcr')) {
      result.stat = 'fcr';
    }
    // Mana regeneration
    else if (lowerText.includes('regenerate mana')) {
      result.stat = 'regenMana';
    }
    // Life regeneration
    else if (lowerText.includes('regenerate life') || lowerText.includes('replenish life')) {
      result.stat = 'regenLife';
    }
    // Life
    else if (lowerText.includes('to life')) {
      result.stat = 'life';
    }
    // Mana
    else if (lowerText.includes('to mana')) {
      result.stat = 'mana';
    }
    // IAS
    else if (lowerText.includes('increased attack speed') || lowerText.includes('ias')) {
      result.stat = 'ias';
    }
    // FHR
    else if (lowerText.includes('faster hit recovery') || lowerText.includes('fhr')) {
      result.stat = 'fhr';
    }
    // FRW
    else if (lowerText.includes('faster run/walk') || lowerText.includes('frw')) {
      result.stat = 'frw';
    }
    // Skills
    else if (lowerText.includes('to all skills')) {
      result.stat = 'allSkills';
    }

    // If we detected a stat, return it
    if (result.stat) {
      return result;
    }

    // Fallback: return the text for display even if we can't parse it
    return {
      stat: 'unknown',
      value: result.value,
      text: fullLine,
      rawText: bonusText
    };
  }

  /**
   * Setup listeners on all item dropdowns
   */
  setupItemListeners() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._setupListeners());
    } else {
      this._setupListeners();
    }
  }

  _setupListeners() {
    // Listen to all item dropdowns
    const dropdownIds = [
      'helms-dropdown', 'armors-dropdown', 'weapons-dropdown', 'offs-dropdown',
      'gloves-dropdown', 'belts-dropdown', 'boots-dropdown',
      'ringsone-dropdown', 'ringstwo-dropdown', 'amulets-dropdown'
    ];

    dropdownIds.forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => this.updateSetTracking());
      }
    });

    // Listen to level changes
    const levelSlider = document.getElementById('lvl');
    if (levelSlider) {
      levelSlider.addEventListener('input', () => this.updateSetTracking());
      levelSlider.addEventListener('change', () => this.updateSetTracking());
    }

    // Listen to stat changes (strength/dexterity)
    const strInput = document.getElementById('str');
    const dexInput = document.getElementById('dex');

    if (strInput) {
      strInput.addEventListener('input', () => this.updateSetTracking());
      strInput.addEventListener('change', () => this.updateSetTracking());
    }

    if (dexInput) {
      dexInput.addEventListener('input', () => this.updateSetTracking());
      dexInput.addEventListener('change', () => this.updateSetTracking());
    }
  }

  /**
   * Check if character meets level requirement for an item
   */
  meetsLevelRequirement(item) {
    if (!item || !item.properties) return true;

    const requiredLevel = item.properties.reqlvl || 1;
    const characterLevel = this.getCharacterLevel();

    return characterLevel >= requiredLevel;
  }

  /**
   * Check if character meets stat requirements (str/dex) for an item
   */
  meetsStatRequirements(item) {
    if (!item || !item.properties) return true;

    const requiredStr = item.properties.reqstr || 0;
    const requiredDex = item.properties.reqdex || 0;

    // Get current character stats from inputs
    const strInput = parseInt(document.getElementById('str')?.value) || 0;
    const dexInput = parseInt(document.getElementById('dex')?.value) || 0;

    return strInput >= requiredStr && dexInput >= requiredDex;
  }

  /**
   * Get current character level
   */
  getCharacterLevel() {
    // Try to get from UnifiedSocketSystem first
    if (window.unifiedSocketSystem && window.unifiedSocketSystem.currentLevel) {
      return window.unifiedSocketSystem.currentLevel;
    }

    // Fallback to level slider
    const levelSlider = document.getElementById('lvl');
    if (levelSlider) {
      return parseInt(levelSlider.value) || 1;
    }

    return 1;
  }

  /**
   * Update set tracking based on currently equipped items
   */
  updateSetTracking() {
    // Clear current tracking
    this.equippedSets.clear();

    // Get all equipped items
    const dropdownIds = [
      'helms-dropdown', 'armors-dropdown', 'weapons-dropdown', 'offs-dropdown',
      'gloves-dropdown', 'belts-dropdown', 'boots-dropdown',
      'ringsone-dropdown', 'ringstwo-dropdown', 'amulets-dropdown'
    ];

    const equippedItems = [];

    dropdownIds.forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown && dropdown.value && dropdown.value !== '') {
        const itemName = dropdown.value;
        const item = itemList[itemName];

        if (item && this.isSetItem(item)) {
          // Check if character meets requirements for this item
          const meetsLevel = this.meetsLevelRequirement(item);
          const meetsStats = this.meetsStatRequirements(item);

          // Only count the item toward the set if requirements are met
          if (meetsLevel && meetsStats) {
            const setName = this.extractSetName(itemName);
            if (setName) {
              const bonuses = this.parseSetBonuses(item.description);

              equippedItems.push({
                name: itemName,
                setName: setName,
                slot: dropdownId,
                item: item,
                bonuses: bonuses
              });
            }
          }
        }
      }
    });

    // Group items by set
    equippedItems.forEach(equipped => {
      if (!this.equippedSets.has(equipped.setName)) {
        this.equippedSets.set(equipped.setName, {
          items: [],
          allBonuses: []
        });
      }

      const setData = this.equippedSets.get(equipped.setName);
      setData.items.push(equipped);

      // Collect all possible bonuses (we'll filter by count later)
      equipped.bonuses.forEach(bonusGroup => {
        const existing = setData.allBonuses.find(b => b.itemCount === bonusGroup.itemCount);
        if (!existing) {
          setData.allBonuses.push(bonusGroup);
        } else {
          // Merge bonuses
          existing.bonuses.push(...bonusGroup.bonuses);
        }
      });
    });

    // Update buff display
    this.updateBuffDisplay();

    // Apply bonuses to character stats
    this.applySetBonuses();
  }

  /**
   * Get active set bonuses based on equipped item counts
   */
  getActiveBonuses() {
    const activeBonuses = [];

    this.equippedSets.forEach((setData, setName) => {
      const itemCount = setData.items.length;

      console.log(`[SetTracker] Getting active bonuses for ${setName}: ${itemCount} items equipped`);
      console.log('[SetTracker] All possible bonuses:', setData.allBonuses);

      // Find bonuses that are active for this item count
      setData.allBonuses.forEach(bonusGroup => {
        console.log(`[SetTracker] Checking bonus group: itemCount requirement = ${bonusGroup.itemCount}`);

        if (bonusGroup.itemCount === 'complete') {
          console.log('[SetTracker] Skipping "Complete Set" bonus');
          // For now, skip "Complete Set" bonuses (would need to know full set size)
          // TODO: Add complete set detection
        } else if (typeof bonusGroup.itemCount === 'number' && itemCount >= bonusGroup.itemCount) {
          console.log(`[SetTracker] ✓ Activating: ${itemCount} >= ${bonusGroup.itemCount}`);
          activeBonuses.push({
            setName: setName,
            itemCount: itemCount,
            requiredCount: bonusGroup.itemCount,
            bonuses: bonusGroup.bonuses
          });
        } else {
          console.log(`[SetTracker] ✗ Not activated: ${itemCount} < ${bonusGroup.itemCount}`);
        }
      });
    });

    console.log('[SetTracker] Final active bonuses:', activeBonuses);
    return activeBonuses;
  }

  /**
   * Update buff icon display
   */
  updateBuffDisplay() {
    if (!window.buffSystem) return;

    // Remove old set buffs
    this.equippedSets.forEach((setData, setName) => {
      window.buffSystem.removeBuff(`set-${setName}`);
    });

    // Add new set buffs
    this.equippedSets.forEach((setData, setName) => {
      const itemCount = setData.items.length;
      if (itemCount === 0) return;

      // Build tooltip
      let tooltipHTML = `<strong style="color: #00ff00;">${setName} Set (${itemCount} items)</strong><br><br>`;

      // List equipped items
      tooltipHTML += '<span style="color: #8888ff;">Equipped:</span><br>';
      setData.items.forEach(equipped => {
        tooltipHTML += `• ${equipped.name}<br>`;
      });

      // List active bonuses
      const activeBonuses = this.getActiveBonuses();
      const setBonuses = activeBonuses.filter(ab => ab.setName === setName);

      if (setBonuses.length > 0) {
        tooltipHTML += '<br><span style="color: #00ff00;">Active Bonuses:</span><br>';

        // Group by required count
        const byCount = {};
        setBonuses.forEach(ab => {
          if (!byCount[ab.requiredCount]) {
            byCount[ab.requiredCount] = [];
          }
          byCount[ab.requiredCount].push(...ab.bonuses);
        });

        Object.keys(byCount).sort((a, b) => parseInt(a) - parseInt(b)).forEach(count => {
          tooltipHTML += `<br><span style="color: #ffff88;">(${count} Items):</span><br>`;
          byCount[count].forEach(bonus => {
            tooltipHTML += `${bonus.rawText}<br>`;
          });
        });
      }

      // Add set buff to buff system
      // We'll create a simple green icon placeholder
      window.buffSystem.addBuff({
        id: `set-${setName}`,
        name: `${setName} Set`,
        image: 'set-placeholder.png', // Will fallback to SVG if not found
        type: 'Set Bonus',
        description: tooltipHTML,
        tooltipType: 'set'
      });
    });
  }

  /**
   * Apply set bonuses to character stats
   */
  applySetBonuses() {
    const activeBonuses = this.getActiveBonuses();

    // Calculate total bonuses from all active sets
    const totalBonuses = {
      defense: 0,
      defensePerLevel: 0,
      strength: 0,
      dexterity: 0,
      vitality: 0,
      energy: 0,
      life: 0,
      mana: 0,
      lightningResist: 0,
      fireResist: 0,
      coldResist: 0,
      poisonResist: 0,
      allResist: 0,
      fcr: 0,
      ias: 0,
      fhr: 0,
      frw: 0,
      regenMana: 0,
      regenLife: 0,
      allSkills: 0
    };

    // Debug: Log what we're applying
    console.log('[SetTracker] Applying set bonuses:', activeBonuses);

    activeBonuses.forEach(activeBonus => {
      console.log(`[SetTracker] Processing set: ${activeBonus.setName}, itemCount: ${activeBonus.itemCount}, requiredCount: ${activeBonus.requiredCount}`);

      // Double-check that we meet the requirement (safety check)
      if (activeBonus.itemCount >= activeBonus.requiredCount) {
        activeBonus.bonuses.forEach(bonus => {
          console.log(`[SetTracker] Applying bonus: ${bonus.stat} = ${bonus.value}`);

          if (bonus.stat && bonus.stat !== 'unknown' && totalBonuses.hasOwnProperty(bonus.stat)) {
            totalBonuses[bonus.stat] += bonus.value;
          }
        });
      } else {
        console.warn(`[SetTracker] Skipping bonus - requirement not met: ${activeBonus.itemCount} < ${activeBonus.requiredCount}`);
      }
    });

    console.log('[SetTracker] Total bonuses to apply:', totalBonuses);

    // Store bonuses for access by other systems
    this.currentBonuses = totalBonuses;

    // Trigger character stats recalculation
    if (window.unifiedSocketSystem) {
      window.unifiedSocketSystem.calculateAllStats();
      window.unifiedSocketSystem.updateStatsDisplay();
    }
  }

  /**
   * Get current set bonuses for a specific stat
   */
  getSetBonus(stat) {
    if (!this.currentBonuses) return 0;
    return this.currentBonuses[stat] || 0;
  }

  /**
   * Get all current set bonuses
   */
  getAllSetBonuses() {
    return this.currentBonuses || {};
  }
}

// Initialize when DOM is loaded
let setTracker;

document.addEventListener('DOMContentLoaded', () => {
  setTracker = new SetTracker();
  window.setTracker = setTracker; // Make it globally accessible
});
