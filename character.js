// ===== CHARACTER.JS - LIGHTWEIGHT VERSION =====
// Handles stat bonuses from items/sockets and stat point management

class CharacterManager {
  constructor() {
    this.currentLevel = 1;
    this.currentClass = 'Amazon';
    
    // Base stats for each class
    this.classStats = {
      'Amazon': { str: 20, dex: 25, vit: 20, enr: 15 },
      'Assassin': { str: 20, dex: 20, vit: 20, enr: 25 },
      'Barbarian': { str: 30, dex: 20, vit: 25, enr: 10 },
      'Druid': { str: 15, dex: 20, vit: 25, enr: 20 },
      'Necromancer': { str: 15, dex: 25, vit: 15, enr: 25 },
      'Paladin': { str: 25, dex: 20, vit: 25, enr: 15 },
      'Sorceress': { str: 10, dex: 25, vit: 10, enr: 35 }
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupSocketListeners();
    this.updateTotalStats();
    this.updateStatPointsDisplay();
  }

  setupEventListeners() {
    // Level change listener
    const levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', () => {
        this.currentLevel = parseInt(levelInput.value) || 1;
        this.updateTotalStats();
        this.updateStatPointsDisplay();
      });
    }

    // Stat input listeners
    ['str', 'dex', 'vit', 'enr'].forEach(stat => {
      const input = document.getElementById(stat);
      if (input) {
        input.addEventListener('input', () => {
          this.validateStatInput(stat);
          this.updateTotalStats();
          this.updateStatPointsDisplay();
        });
      }
    });

    // Equipment change listeners
    const dropdowns = [
      'weapons-dropdown', 'helms-dropdown', 'armors-dropdown', 'offs-dropdown',
      'gloves-dropdown', 'belts-dropdown', 'boots-dropdown', 'ringsone-dropdown',
      'ringstwo-dropdown', 'amulets-dropdown'
    ];
    
    dropdowns.forEach(id => {
      const dropdown = document.getElementById(id);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          setTimeout(() => this.updateTotalStats(), 100);
        });
      }
    });
  }

  setupSocketListeners() {
    console.log('🔌 Setting up socket event listeners...');
    
    // Watch for changes in socket containers using MutationObserver
    const observer = new MutationObserver((mutations) => {
      let shouldRecalculate = false;
      
      mutations.forEach((mutation) => {
        // Check for class changes (filled/empty) or attribute changes
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (target.classList?.contains('socket-slot') && 
              (mutation.attributeName === 'class' || 
               mutation.attributeName === 'data-stats' || 
               mutation.attributeName === 'data-level-req')) {
            shouldRecalculate = true;
            console.log('🔌 Socket attribute changed:', mutation.attributeName, target);
          }
        }
        
        // Check for child changes (socket being filled/removed)
        if (mutation.type === 'childList') {
          const target = mutation.target;
          if (target.classList?.contains('socket-slot') || 
              target.closest?.('.socket-container')) {
            shouldRecalculate = true;
            console.log('🔌 Socket child changed:', target);
          }
        }
      });
      
      if (shouldRecalculate) {
        console.log('🔄 Socket change detected, forcing stats recalculation...');
        setTimeout(() => {
          this.updateTotalStats();
        }, 100);
      }
    });

    // Observe all socket containers
    const socketContainers = document.querySelectorAll('.socket-container');
    socketContainers.forEach(container => {
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-stats', 'data-level-req', 'data-item-name']
      });
    });

    // Also observe the entire document for dynamic socket creation
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    // Backup: periodic check every 2 seconds
    setInterval(() => {
      this.updateTotalStats();
    }, 2000);
    
    console.log('✅ Socket observers setup complete');
  }

  validateStatInput(statType) {
    const input = document.getElementById(statType);
    if (!input) return;

    const currentValue = parseInt(input.value) || 0;
    const baseStats = this.classStats[this.currentClass];
    const minValue = baseStats[statType];
    
    // Check minimum value
    if (currentValue < minValue) {
      input.value = minValue;
      return;
    }

    // Check if total stat points exceed available
    const availablePoints = this.getAvailableStatPoints();
    const usedPoints = this.getUsedStatPoints();
    
    if (usedPoints > availablePoints) {
      // Reduce this stat to fit within limits
      const excess = usedPoints - availablePoints;
      const newValue = Math.max(minValue, currentValue - excess);
      input.value = newValue;
    }
  }

  // ==> STAT POINTS MANAGEMENT <==
  getAvailableStatPoints() {
    // Level 1 = 15 points, +5 per level, max at level 99 = 505 points
    return Math.min(505, 15 + (this.currentLevel - 1) * 5);
  }

  getTotalBaseStats() {
    const baseStats = this.classStats[this.currentClass];
    return baseStats.str + baseStats.dex + baseStats.vit + baseStats.enr;
  }

  getCurrentStatTotal() {
    const str = parseInt(document.getElementById('str')?.value) || 0;
    const dex = parseInt(document.getElementById('dex')?.value) || 0;
    const vit = parseInt(document.getElementById('vit')?.value) || 0;
    const enr = parseInt(document.getElementById('enr')?.value) || 0;
    return str + dex + vit + enr;
  }

  getUsedStatPoints() {
    const baseTotal = this.getTotalBaseStats();
    const currentTotal = this.getCurrentStatTotal();
    return Math.max(0, currentTotal - baseTotal);
  }

  // ==> ITEM & SOCKET BONUSES <==
  getAllItemBonuses() {
    const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;

    const equipmentSections = [
      { dropdown: 'weapons-dropdown', section: 'weapon' },
      { dropdown: 'helms-dropdown', section: 'helm' },
      { dropdown: 'armors-dropdown', section: 'armor' },
      { dropdown: 'offs-dropdown', section: 'shield' },
      { dropdown: 'gloves-dropdown', section: 'gloves' },
      { dropdown: 'belts-dropdown', section: 'belts' },
      { dropdown: 'boots-dropdown', section: 'boots' },
      { dropdown: 'ringsone-dropdown', section: 'ring' },
      { dropdown: 'ringstwo-dropdown', section: 'ring' },
      { dropdown: 'amulets-dropdown', section: 'amulet' }
    ];

    console.log(`🔍 Checking item bonuses for level ${currentLevel}...`);

    equipmentSections.forEach(({ dropdown, section }) => {
      const dropdownElement = document.getElementById(dropdown);
      if (!dropdownElement || !dropdownElement.value) return;

      // Try multiple ways to access itemList
      const itemData = window.itemList || itemList;
      if (!itemData) return;

      const item = itemData[dropdownElement.value];
      if (!item) return;

      // CRITICAL: Calculate actual required level INCLUDING sockets
      const actualRequiredLevel = this.getActualRequiredLevel(section, dropdownElement.value);

      // Debug logging
      console.log(`🔍 ${section}: ${dropdownElement.value}`);
      console.log(`   Base level req: ${item.properties?.reqlvl || 1}`);
      console.log(`   Actual level req (with sockets): ${actualRequiredLevel}`);
      console.log(`   Character level: ${currentLevel}`);
      console.log(`   Can use item: ${currentLevel >= actualRequiredLevel}`);

      // Only apply bonuses if level requirement is met
      if (currentLevel >= actualRequiredLevel && item.properties) {
        const itemStr = item.properties.str || 0;
        const itemDex = item.properties.dex || 0;
        const itemVit = item.properties.vit || 0;
        const itemEnr = item.properties.enr || 0;

        bonuses.str += itemStr;
        bonuses.dex += itemDex;
        bonuses.vit += itemVit;
        bonuses.enr += itemEnr;

        if (itemStr || itemDex || itemVit || itemEnr) {
          console.log(`   ✅ APPLIED bonuses: +${itemStr} str, +${itemDex} dex, +${itemVit} vit, +${itemEnr} enr`);
        }
      } else {
        console.log(`   ❌ BLOCKED bonuses - need level ${actualRequiredLevel}, have ${currentLevel}`);
      }
    });

    console.log('📊 Final item bonuses:', bonuses);
    return bonuses;
  }

  getSocketBonuses() {
    const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;

    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots'];
    
    sections.forEach(section => {
      const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
      
      sockets.forEach(socket => {
        const socketLevel = parseInt(socket.dataset.levelReq) || 1;
        
        // Only apply socket bonuses if level requirement is met
        if (currentLevel >= socketLevel) {
          const stats = socket.dataset.stats;
          if (stats) {
            const strengthMatch = stats.match(/\+(\d+) (?:to )?Strength/i);
            const dexterityMatch = stats.match(/\+(\d+) (?:to )?Dexterity/i);
            const vitalityMatch = stats.match(/\+(\d+) (?:to )?Vitality/i);
            const energyMatch = stats.match(/\+(\d+) (?:to )?Energy/i);
            
            if (strengthMatch) bonuses.str += parseInt(strengthMatch[1]);
            if (dexterityMatch) bonuses.dex += parseInt(dexterityMatch[1]);
            if (vitalityMatch) bonuses.vit += parseInt(vitalityMatch[1]);
            if (energyMatch) bonuses.enr += parseInt(energyMatch[1]);
          }
        }
      });
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

  getActualRequiredLevel(section, itemName) {
    // Try multiple ways to access itemList
    const itemData = window.itemList || itemList;
    if (!itemData || !itemData[itemName]) return 1;
    
    const baseLevel = itemData[itemName].properties?.reqlvl || 1;
    
    // Check socketed items for higher requirements
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    let highestLevel = baseLevel;
    
    sockets.forEach(socket => {
      const socketLevel = parseInt(socket.dataset.levelReq) || 1;
      if (socketLevel > highestLevel) {
        highestLevel = socketLevel;
      }
    });
    
    return highestLevel;
  }

  // ==> DISPLAY UPDATES <==
  updateTotalDisplay(statId, total) {
    let totalDiv = document.getElementById(statId + 'Total');
    if (!totalDiv) {
      totalDiv = document.createElement('span');
      totalDiv.id = statId + 'Total';
      totalDiv.style.cssText = 'color: #00ff00; font-weight: bold; margin-left: 10px;';
      
      const statRow = document.getElementById(statId)?.closest('.stat-row');
      if (statRow) {
        statRow.appendChild(totalDiv);
      } else {
        // Fallback: append to parent element
        const statInput = document.getElementById(statId);
        if (statInput && statInput.parentElement) {
          statInput.parentElement.appendChild(totalDiv);
        }
      }
    }
    
    const base = parseInt(document.getElementById(statId)?.value) || 0;
    const bonus = total - base;
    
    if (bonus > 0) {
      totalDiv.textContent = ` ${total}`;
      totalDiv.style.color = '#00ff00'; // Green for positive bonus
    } else {
      totalDiv.textContent = ''; // No bonus, hide
    }
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
      
      // Insert after the last stat row or energy input
      const lastStatInput = document.getElementById('enr');
      if (lastStatInput && lastStatInput.parentElement) {
        lastStatInput.parentElement.appendChild(statPointsDiv);
      }
    }
    
    // Color based on remaining points
    let color = '#00bfff'; // Default blue
    if (remaining < 0) color = '#ff5555'; // Red for over-allocated
    else if (remaining === 0) color = '#00ff00'; // Green for perfectly allocated
    
    statPointsDiv.innerHTML = `
      <div>Stat Points: ${remaining}/${available}</div>
    `;
    statPointsDiv.style.color = color;
  }

  updateTotalStats() {
    // Get base stats from inputs
    const baseStats = {
      str: parseInt(document.getElementById('str')?.value) || 0,
      dex: parseInt(document.getElementById('dex')?.value) || 0,
      vit: parseInt(document.getElementById('vit')?.value) || 0,
      enr: parseInt(document.getElementById('enr')?.value) || 0
    };

    // Get all bonuses
    const itemBonuses = this.getAllItemBonuses();
    const socketBonuses = this.getSocketBonuses();
    const charmBonuses = this.getCharmBonuses();

    // Calculate total bonuses
    const totalBonuses = {
      str: itemBonuses.str + socketBonuses.str + charmBonuses.str,
      dex: itemBonuses.dex + socketBonuses.dex + charmBonuses.dex,
      vit: itemBonuses.vit + socketBonuses.vit + charmBonuses.vit,
      enr: itemBonuses.enr + socketBonuses.enr + charmBonuses.enr
    };

    // Update total displays
    this.updateTotalDisplay('str', baseStats.str + totalBonuses.str);
    this.updateTotalDisplay('dex', baseStats.dex + totalBonuses.dex);
    this.updateTotalDisplay('vit', baseStats.vit + totalBonuses.vit);
    this.updateTotalDisplay('enr', baseStats.enr + totalBonuses.enr);

    console.log('📊 Character stats updated:', {
      base: baseStats,
      bonuses: totalBonuses,
      totals: {
        str: baseStats.str + totalBonuses.str,
        dex: baseStats.dex + totalBonuses.dex,
        vit: baseStats.vit + totalBonuses.vit,
        enr: baseStats.enr + totalBonuses.enr
      }
    });
  }

  // ==> PUBLIC API <==
  getCharacterStats() {
    return {
      class: this.currentClass,
      level: this.currentLevel,
      str: parseInt(document.getElementById('str')?.value) || 0,
      dex: parseInt(document.getElementById('dex')?.value) || 0,
      vit: parseInt(document.getElementById('vit')?.value) || 0,
      enr: parseInt(document.getElementById('enr')?.value) || 0,
      statPoints: {
        available: this.getAvailableStatPoints(),
        used: this.getUsedStatPoints(),
        remaining: this.getAvailableStatPoints() - this.getUsedStatPoints()
      }
    };
  }

  forceStatsUpdate() {
    setTimeout(() => {
      this.updateTotalStats();
      this.updateStatPointsDisplay();
    }, 50);
  }
}

// Initialize when DOM is ready
let characterManager;

function initCharacterManager() {
  if (!characterManager) {
    characterManager = new CharacterManager();
    window.characterManager = characterManager;
    
    // Override legacy methods for compatibility
    if (window.characterStats) {
      window.characterStats.getAllItemBonuses = () => characterManager.getAllItemBonuses();
      window.characterStats.getSocketBonuses = () => characterManager.getSocketBonuses();
      window.characterStats.getCharmBonuses = () => characterManager.getCharmBonuses();
      window.characterStats.updateTotalStats = () => characterManager.updateTotalStats();
    }
    
    console.log('✅ Lightweight Character Manager initialized');
  }
}

// Auto-initialize after a short delay
setTimeout(initCharacterManager, 500);

// Also try to initialize on different events
document.addEventListener('DOMContentLoaded', initCharacterManager);
window.addEventListener('load', initCharacterManager);

// Manual initialization function for testing
window.initCharacter = initCharacterManager;
window.testCharacterBonuses = function() {
  if (window.characterManager) {
    console.log('🧪 Testing character bonuses...');
    const itemBonuses = window.characterManager.getAllItemBonuses();
    const socketBonuses = window.characterManager.getSocketBonuses();
    console.log('Item bonuses:', itemBonuses);
    console.log('Socket bonuses:', socketBonuses);
    window.characterManager.updateTotalStats();
  } else {
    console.log('❌ Character manager not initialized');
  }
};