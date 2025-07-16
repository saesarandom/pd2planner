// character.js - Clean Character Stats System
class CharacterStats {
  constructor() {
    this.classStats = {
      'Amazon': { str: 20, dex: 25, vit: 20, enr: 15 },
      'Assassin': { str: 20, dex: 20, vit: 20, enr: 25 },
      'Barbarian': { str: 30, dex: 20, vit: 25, enr: 10 },
      'Druid': { str: 15, dex: 20, vit: 25, enr: 20 },
      'Necromancer': { str: 15, dex: 25, vit: 15, enr: 25 },
      'Paladin': { str: 25, dex: 20, vit: 25, enr: 15 },
      'Sorceress': { str: 10, dex: 25, vit: 10, enr: 35 }
    };
    
    this.currentClass = 'Amazon';
    this.level = 1;
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setInitialStats();
    console.log('📊 Character Stats System initialized');
  }
  
  setupEventListeners() {
    // Level input
    const lvlInput = document.getElementById('lvlValue');
    if (lvlInput) {
      lvlInput.addEventListener('input', () => this.handleLevelChange());
      lvlInput.addEventListener('blur', () => this.validateLevel());
    }
    
    // Class selection
    const classSelect = document.getElementById('selectClass');
    if (classSelect) {
      classSelect.addEventListener('change', () => this.handleClassChange());
    }
    
    // Stat inputs
    ['str', 'dex', 'vit', 'enr'].forEach(statId => {
      const input = document.getElementById(statId);
      if (input) {
        input.addEventListener('input', () => this.handleStatChange(statId));
        input.addEventListener('blur', () => this.validateStats());
      }
    });

    // Equipment dropdown changes - immediate total update
    const equipmentDropdowns = ['weapons-dropdown', 'helms-dropdown', 'armors-dropdown', 'offs-dropdown', 'gloves-dropdown', 'belts-dropdown', 'boots-dropdown', 'ringsone-dropdown', 'ringstwo-dropdown', 'amulets-dropdown'];
    
    equipmentDropdowns.forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          setTimeout(() => this.updateTotalStats(), 100);
        });
      }
    });

    // Socket clicks - immediate total update
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('socket-slot') || e.target.classList.contains('socket-item')) {
        setTimeout(() => this.updateTotalStats(), 200);
      }
    });
  }
  
  setInitialStats() {
    // Get the current class from dropdown or default to Amazon
    this.currentClass = document.getElementById('selectClass')?.value || 'Amazon';
    
    // Make sure the class exists in our classStats
    if (!this.classStats[this.currentClass]) {
      console.warn(`Class ${this.currentClass} not found, defaulting to Amazon`);
      this.currentClass = 'Amazon';
    }
    
    const baseStats = this.classStats[this.currentClass];
    
    console.log(`Setting initial stats for ${this.currentClass}:`, baseStats);
    
    // Set base stats with explicit values
    const strInput = document.getElementById('str');
    const dexInput = document.getElementById('dex');
    const vitInput = document.getElementById('vit');
    const enrInput = document.getElementById('enr');
    
    if (strInput) strInput.value = baseStats.str;
    if (dexInput) dexInput.value = baseStats.dex;
    if (vitInput) vitInput.value = baseStats.vit;
    if (enrInput) enrInput.value = baseStats.enr;
    
    // Set level to 1
    const lvlInput = document.getElementById('lvlValue');
    if (lvlInput) lvlInput.value = 1;
    this.level = 1;
    
    console.log('Stats set - STR:', strInput?.value, 'DEX:', dexInput?.value, 'VIT:', vitInput?.value, 'ENR:', enrInput?.value);
    
    this.updateStatPointsDisplay();
  }
  
  handleClassChange() {
    const newClass = document.getElementById('selectClass').value;
    if (newClass !== this.currentClass) {
      this.currentClass = newClass;
      this.resetToBaseStats();
    }
  }
  
  resetToBaseStats() {
    // Ensure we have the current class
    this.currentClass = document.getElementById('selectClass')?.value || 'Amazon';
    
    if (!this.classStats[this.currentClass]) {
      console.warn(`Class ${this.currentClass} not found, defaulting to Amazon`);
      this.currentClass = 'Amazon';
    }
    
    const baseStats = this.classStats[this.currentClass];
    
    console.log(`Resetting to base stats for ${this.currentClass}:`, baseStats);
    
    // Force set the values
    document.getElementById('str').value = baseStats.str;
    document.getElementById('dex').value = baseStats.dex;
    document.getElementById('vit').value = baseStats.vit;
    document.getElementById('enr').value = baseStats.enr;
    
    this.updateStatPointsDisplay();
    this.recalculateStats();
  }
  
  handleLevelChange() {
    const lvlInput = document.getElementById('lvlValue');
    let level = parseInt(lvlInput.value) || 1;
    
    // Auto-correct level bounds
    if (level > 99) {
      level = 99;
      lvlInput.value = 99;
    } else if (level < 1) {
      level = 1;
      lvlInput.value = 1;
    }
    
    this.level = level;
    this.validateStats();
    this.updateStatPointsDisplay();
    this.recalculateStats();
    
    // Validate items with socket requirements
    if (typeof validateAllItems === 'function') {
      validateAllItems();
    }
    
    // Update character stats
    if (window.characterStats?.updateTotalStats) {
      window.characterStats.updateTotalStats();
    }
  }
  
  validateLevel() {
    const lvlInput = document.getElementById('lvlValue');
    let level = parseInt(lvlInput.value) || 1;
    
    if (level > 99 || level < 1 || isNaN(level)) {
      level = Math.max(1, Math.min(99, level));
      lvlInput.value = level;
      this.level = level;
      this.validateStats();
      this.updateStatPointsDisplay();
    }
  }
 
  handleStatChange(statId) {
    this.validateStats();
    this.updateStatPointsDisplay();
    this.recalculateStats();
  }
  
  validateStats() {
    const baseStats = this.classStats[this.currentClass];
    const availablePoints = this.getAvailableStatPoints();
    const maxTotal = this.getTotalBaseStats() + availablePoints;
    
    let currentTotal = 0;
    const statInputs = ['str', 'dex', 'vit', 'enr'];
    const currentStats = {};
    
    // Get current values and ensure minimums
    statInputs.forEach(statId => {
      const input = document.getElementById(statId);
      let value = parseInt(input.value) || baseStats[statId];
      
      // Ensure minimum base stat
      if (value < baseStats[statId]) {
        value = baseStats[statId];
        input.value = value;
      }
      
      currentStats[statId] = value;
      currentTotal += value;
    });
    
    // If over budget, reduce proportionally
    if (currentTotal > maxTotal) {
      const excess = currentTotal - maxTotal;
      this.reduceStatsProportionally(currentStats, baseStats, excess);
    }
  }
  
  reduceStatsProportionally(currentStats, baseStats, excess) {
    let remaining = excess;
    const statIds = ['str', 'dex', 'vit', 'enr'];
    
    // Simple reduction: reduce from highest stats first
    while (remaining > 0) {
      let reduced = false;
      
      // Find the highest stat above base that can be reduced
      let highestStat = null;
      let highestValue = 0;
      
      statIds.forEach(statId => {
        const current = currentStats[statId];
        const base = baseStats[statId];
        if (current > base && current > highestValue) {
          highestValue = current;
          highestStat = statId;
        }
      });
      
      if (highestStat) {
        currentStats[highestStat]--;
        document.getElementById(highestStat).value = currentStats[highestStat];
        remaining--;
        reduced = true;
      }
      
      if (!reduced) break; // Safety break
    }
  }
  
  getAvailableStatPoints() {
    // Level 1 = 15 points, +5 per level
    return 15 + (this.level - 1) * 5;
  }
  
  getTotalBaseStats() {
    const baseStats = this.classStats[this.currentClass];
    return baseStats.str + baseStats.dex + baseStats.vit + baseStats.enr;
  }
  
  getCurrentStatTotal() {
    const str = parseInt(document.getElementById('str').value) || 0;
    const dex = parseInt(document.getElementById('dex').value) || 0;
    const vit = parseInt(document.getElementById('vit').value) || 0;
    const enr = parseInt(document.getElementById('enr').value) || 0;
    return str + dex + vit + enr;
  }
  
  getUsedStatPoints() {
    const baseTotal = this.getTotalBaseStats();
    const currentTotal = this.getCurrentStatTotal();
    return Math.max(0, currentTotal - baseTotal);
  }
  
  updateStatPointsDisplay() {
    const available = this.getAvailableStatPoints();
    const used = this.getUsedStatPoints();
    const remaining = available - used;
    
    // Create or update stat points display
    let statPointsDiv = document.getElementById('stat-points-display');
    if (!statPointsDiv) {
      statPointsDiv = document.createElement('div');
      statPointsDiv.id = 'stat-points-display';
      statPointsDiv.style.cssText = `
        margin-top: 10px;
        padding: 8px;
        background: rgba(15, 52, 96, 0.3);
        border: 1px solid #0f3460;
        border-radius: 5px;
        text-align: center;
        color: #00bfff;
        font-weight: bold;
      `;
      
      // Insert after the last stat row
      const lastStatRow = document.querySelector('.stat-row:last-child');
      if (lastStatRow && lastStatRow.parentElement) {
        lastStatRow.parentElement.appendChild(statPointsDiv);
      }
    }
    
    // Calculate percentage remaining
    const percentageRemaining = available > 0 ? (remaining / available) * 100 : 0;
    
    let color;
    if (remaining < 0) {
      color = '#ff5555'; // Red for over budget
    } else if (remaining === 0) {
      color = '#ffd700'; // Gold for exactly used
    } else if (percentageRemaining <= 5) {
      color = '#ff5555'; // Red for 5% or less
    } else if (percentageRemaining <= 25) {
      color = '#ff8c00'; // Orange for 25% or less
    } else if (percentageRemaining <= 50) {
      color = '#ffff00'; // Yellow for 50% or less
    } else {
      color = '#00ff00'; // Green for more than 50%
    }
    
    statPointsDiv.innerHTML = `
      <div style="color: ${color}">Used: ${used} | Remaining: ${remaining}</div>
    `;
  }
  
  recalculateStats() {
    // Trigger stats calculator recalculation
    if (typeof window.recalculateStats === 'function') {
      window.recalculateStats();
    }
    
    // Update total stats display
    setTimeout(() => this.updateTotalStats(), 100);
  }

  updateTotalStats() {
    const baseStats = {
      str: parseInt(document.getElementById('str').value) || 0,
      dex: parseInt(document.getElementById('dex').value) || 0,
      vit: parseInt(document.getElementById('vit').value) || 0,
      enr: parseInt(document.getElementById('enr').value) || 0
    };

    // Get bonuses from items (now level-filtered)
    const itemBonuses = this.getAllItemBonuses();
    
    // Get bonuses from charms via statsCalculator
    const charmBonuses = this.getCharmBonuses();
    
    // Calculate total bonuses
    const totalBonuses = {
      str: itemBonuses.str + charmBonuses.str,
      dex: itemBonuses.dex + charmBonuses.dex,
      vit: itemBonuses.vit + charmBonuses.vit,
      enr: itemBonuses.enr + charmBonuses.enr
    };
    
    // Update total displays
    this.updateTotalDisplay('str', baseStats.str + totalBonuses.str);
    this.updateTotalDisplay('dex', baseStats.dex + totalBonuses.dex);
    this.updateTotalDisplay('vit', baseStats.vit + totalBonuses.vit);
    this.updateTotalDisplay('enr', baseStats.enr + totalBonuses.enr);
    
    // ALSO calculate life with level requirements in mind
    this.updateLifeCalculation(itemBonuses, baseStats);
  }

  updateLifeCalculation(itemBonuses, baseStats) {
    const currentLevel = parseInt(document.getElementById('lvlValue').value) || 1;
    
    // Base life calculation
    let totalLife = 100; // Base life for all classes
    
    // Life from vitality (3.5 life per vit point)
    const totalVit = baseStats.vit + itemBonuses.vit;
    totalLife += totalVit * 3.5;
    
    // Life from items (only if level requirement met)
    let lifeFromItems = 0;
    if (window.levelRequirementSystem) {
      const validStats = window.levelRequirementSystem.getValidItemStats();
      lifeFromItems = validStats.tolife || 0;
      lifeFromItems += (validStats.tolifeperlevel || 0) * currentLevel;
    }
    
    totalLife += lifeFromItems;
    
    // Update life display
    const totalLifeElement = document.getElementById('totalLifeValue');
    if (totalLifeElement) {
      totalLifeElement.textContent = `Total Life: ${Math.floor(totalLife)}`;
    }
  }

  forceStatsUpdate() {
    console.log('Forcing stats update with level requirements...');
    
    // Trigger a complete recalculation
    setTimeout(() => {
      this.updateTotalStats();
      
      // Also trigger any other stats systems
      if (window.statsCalculator && window.statsCalculator.calculateAllStats) {
        window.statsCalculator.calculateAllStats();
      }
    }, 50);
  }

  getAllItemBonuses() {
    const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
    
    // NEW: Check if level requirement system exists and use its filtered stats
    if (window.levelRequirementSystem) {
      const validStats = window.levelRequirementSystem.getValidItemStats();
      
      bonuses.str = validStats.str || 0;
      bonuses.dex = validStats.dex || 0;
      bonuses.vit = validStats.vit || 0;
      bonuses.enr = validStats.enr || 0;
      
      console.log('Using level-filtered stats:', bonuses);
      return bonuses;
    }
    
    // FALLBACK: Original method if level requirement system not available
    const currentLevel = parseInt(document.getElementById('lvlValue').value) || 1;
    const equipmentDropdowns = [
      'weapons-dropdown', 'helms-dropdown', 'armors-dropdown', 'offs-dropdown',
      'gloves-dropdown', 'belts-dropdown', 'boots-dropdown', 
      'ringsone-dropdown', 'ringstwo-dropdown', 'amulets-dropdown'
    ];

    equipmentDropdowns.forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown || !dropdown.value) return;

      // Check if item exists in itemList
      if (typeof itemList !== 'undefined' && itemList[dropdown.value]) {
        const item = itemList[dropdown.value];
        const requiredLevel = item.properties?.reqlvl || 1;
        
        // ONLY count stats if character level meets requirement
        if (currentLevel >= requiredLevel) {
          // Parse stat bonuses from item properties (more reliable than HTML parsing)
          if (item.properties) {
            bonuses.str += item.properties.str || 0;
            bonuses.dex += item.properties.dex || 0;
            bonuses.vit += item.properties.vit || 0;
            bonuses.enr += item.properties.enr || 0;
          }
        }
      }
    });
    
    console.log('Using manual level-filtered stats:', bonuses);
    return bonuses;
  }

  getCharmBonuses() {
    const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
    
    // Get charm stats from the statsCalculator if it exists
    if (window.statsCalculator && window.statsCalculator.stats) {
      const stats = window.statsCalculator.stats;
      bonuses.str = stats.str || 0;
      bonuses.dex = stats.dex || 0;
      bonuses.vit = stats.vit || 0;
      bonuses.enr = stats.enr || 0;
    }
    
    return bonuses;
  }

  updateTotalDisplay(statId, total) {
    let totalDiv = document.getElementById(statId + 'Total');
    if (!totalDiv) {
      totalDiv = document.createElement('span');
      totalDiv.id = statId + 'Total';
      totalDiv.style.cssText = 'color: #00ff00; font-weight: bold; margin-left: 10px;';
      
      const statRow = document.getElementById(statId).closest('.stat-row');
      if (statRow) statRow.appendChild(totalDiv);
    }
    
    const base = parseInt(document.getElementById(statId).value) || 0;
    totalDiv.textContent = total > base ? ` ${total}` : '';
  }

  // Public method to get character stats
  getCharacterStats() {
    return {
      class: this.currentClass,
      level: this.level,
      str: parseInt(document.getElementById('str').value) || 0,
      dex: parseInt(document.getElementById('dex').value) || 0,
      vit: parseInt(document.getElementById('vit').value) || 0,
      enr: parseInt(document.getElementById('enr').value) || 0,
      statPoints: {
        available: this.getAvailableStatPoints(),
        used: this.getUsedStatPoints(),
        remaining: this.getAvailableStatPoints() - this.getUsedStatPoints()
      }
    };
  }
}

// Level validation functions
function getActualRequiredLevel(section, itemName) {
  if (!itemList[itemName]) return 1;
  
  const baseLevel = itemList[itemName].properties?.reqlvl || 1;
  
  // Check socketed items for higher requirements
  const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
  let highestLevel = baseLevel;
  
  sockets.forEach(socket => {
    const itemKey = socket.dataset.itemKey;
    const category = socket.dataset.category;
    
    if (window.statsCalculator?.socketData?.[category]?.[itemKey]?.levelReq) {
      const socketLevel = window.statsCalculator.socketData[category][itemKey].levelReq;
      if (socketLevel > highestLevel) {
        highestLevel = socketLevel;
      }
    }
  });
  
  return highestLevel;
}

function validateAllItems() {
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  
  const equipmentSections = [
    { dropdown: 'weapons-dropdown', section: 'weapon' },
    { dropdown: 'helms-dropdown', section: 'helm' },
    { dropdown: 'armors-dropdown', section: 'armor' },
    { dropdown: 'offs-dropdown', section: 'off' },
    { dropdown: 'gloves-dropdown', section: 'glove' },
    { dropdown: 'belts-dropdown', section: 'belt' },
    { dropdown: 'boots-dropdown', section: 'boot' },
    { dropdown: 'ringsone-dropdown', section: 'ring' },
    { dropdown: 'ringstwo-dropdown', section: 'ring' },
    { dropdown: 'amulets-dropdown', section: 'amulet' }
  ];
  
  equipmentSections.forEach(({ dropdown, section }) => {
    const dropdownElement = document.getElementById(dropdown);
    if (!dropdownElement || !dropdownElement.value) return;
    
    // Get actual required level including sockets
    const actualRequiredLevel = getActualRequiredLevel(section, dropdownElement.value);
    
   
    
    // Also update the item info display to show correct level
    updateItemLevelDisplay(section, actualRequiredLevel);
  });
}

function updateItemLevelDisplay(section, requiredLevel) {
  const infoContainer = document.getElementById(`${section}-info`);
  if (!infoContainer) return;
  
  let description = infoContainer.innerHTML;
  const levelRegex = /Required Level: \d+/i;
  
  if (levelRegex.test(description)) {
    description = description.replace(levelRegex, `Required Level: ${requiredLevel}`);
    infoContainer.innerHTML = description;
  }
}

// Global initialization
let characterStats;

function initCharacterStats() {
  if (characterStats) {
    console.warn('Character stats already exists');
    return;
  }
  
  characterStats = new CharacterStats();
  
  // Make globally accessible
  window.characterStats = characterStats;
  
  // Global helper functions
  window.getCharacterStats = () => {
    return characterStats ? characterStats.getCharacterStats() : null;
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCharacterStats, 200);
  });
} else {
  setTimeout(initCharacterStats, 200);
}

window.addEventListener('load', () => {
  setTimeout(initCharacterStats, 300);
});

// Export for external use
window.getActualRequiredLevel = getActualRequiredLevel;
window.validateAllItems = validateAllItems;
window.CharacterStats = CharacteraStats;