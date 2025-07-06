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
    this.currentClass = document.getElementById('selectClass')?.value || 'Amazon';
    const baseStats = this.classStats[this.currentClass];
    
    // Set base stats
    document.getElementById('str').value = baseStats.str;
    document.getElementById('dex').value = baseStats.dex;
    document.getElementById('vit').value = baseStats.vit;
    document.getElementById('enr').value = baseStats.enr;
    
    // Set level to 1
    document.getElementById('lvlValue').value = 1;
    this.level = 1;
    
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
    const baseStats = this.classStats[this.currentClass];
    
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



// Add this method to the CharacterStats class
// Add this method to CharacterStats class
updateTotalStats() {
  const baseStats = {
    str: parseInt(document.getElementById('str').value) || 0,
    dex: parseInt(document.getElementById('dex').value) || 0,
    vit: parseInt(document.getElementById('vit').value) || 0,
    enr: parseInt(document.getElementById('enr').value) || 0
  };

  // Get bonuses from all equipped items
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
}

getAllItemBonuses() {
  const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
  const infoContainers = ['weapon-info', 'helm-info', 'armor-info', 'off-info', 'glove-info', 'belt-info', 'boot-info', 'ringsone-info', 'ringstwo-info', 'amulet-info'];
  
  infoContainers.forEach(containerId => {
    const container = document.getElementById(containerId);
    if (container && container.innerHTML) {
      const text = container.innerHTML;
      
      // Parse stat bonuses from item descriptions
      const strMatch = text.match(/\+(\d+)\s+(?:to\s+)?Strength/gi);
      const dexMatch = text.match(/\+(\d+)\s+(?:to\s+)?Dexterity/gi);
      const vitMatch = text.match(/\+(\d+)\s+(?:to\s+)?Vitality/gi);
      const enrMatch = text.match(/\+(\d+)\s+(?:to\s+)?Energy/gi);
      
      if (strMatch) strMatch.forEach(match => bonuses.str += parseInt(match.match(/\+(\d+)/)[1]));
      if (dexMatch) dexMatch.forEach(match => bonuses.dex += parseInt(match.match(/\+(\d+)/)[1]));
      if (vitMatch) vitMatch.forEach(match => bonuses.vit += parseInt(match.match(/\+(\d+)/)[1]));
      if (enrMatch) enrMatch.forEach(match => bonuses.enr += parseInt(match.match(/\+(\d+)/)[1]));
    }
  });
  
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
window.CharacterStats = CharacterStats;