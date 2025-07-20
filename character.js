// ===== CHARACTER.JS - CLEAN VERSION =====
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
    
    this.classBaseLifeMana = {
      'Amazon': { life: 50, mana: 15 },
      'Assassin': { life: 81, mana: 25 },
      'Barbarian': { life: 92, mana: 10 },
      'Druid': { life: 84, mana: 20 },
      'Necromancer': { life: 75, mana: 25 },
      'Paladin': { life: 89, mana: 15 },
      'Sorceress': { life: 56, mana: 35 }
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupSocketListeners();

    const classSelect = document.getElementById('selectClass');
    if (classSelect && classSelect.value) {
      this.currentClass = classSelect.value;
    }
    
    // Immediate calculation - no delays
    this.updateTotalStats();
    this.updateStatPointsDisplay();
    this.calculateLifeAndMana();
  }

  setupEventListeners() {
    // Level input
    const lvlInput = document.getElementById('lvlValue');
    if (lvlInput) {
      lvlInput.addEventListener('input', () => this.handleLevelChange());
      lvlInput.addEventListener('blur', () => this.validateLevel());
    }
    
    // Class change
    const classSelect = document.getElementById('selectClass');
    if (classSelect) {
      classSelect.addEventListener('change', () => this.handleClassChange());
    }
    
    // Stat inputs with real-time life/mana updates
    ['str', 'dex', 'vit', 'enr'].forEach(statId => {
      const input = document.getElementById(statId);
      if (input) {
        input.addEventListener('input', () => {
          this.handleStatChange(statId);
        });
        
        input.addEventListener('blur', () => {
          this.validateStats();
          this.updateTotalStats();
        });
      }
    });

    // Equipment changes
    const dropdowns = [
      'weapons-dropdown', 'helms-dropdown', 'armors-dropdown', 'offs-dropdown',
      'gloves-dropdown', 'belts-dropdown', 'boots-dropdown', 'ringsone-dropdown',
      'ringstwo-dropdown', 'amulets-dropdown'
    ];
    
    dropdowns.forEach(id => {
      const dropdown = document.getElementById(id);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          this.updateTotalStats();
        });
      }
    });
  }

  setupSocketListeners() {

    
    const observer = new MutationObserver((mutations) => {
      let shouldRecalculate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (target.classList?.contains('socket-slot') && 
              (mutation.attributeName === 'class' || 
               mutation.attributeName === 'data-stats' || 
               mutation.attributeName === 'data-level-req')) {
            shouldRecalculate = true;
          }
        }
        
        if (mutation.type === 'childList') {
          const target = mutation.target;
          if (target.classList?.contains('socket-slot') || 
              target.closest?.('.socket-container')) {
            shouldRecalculate = true;
          }
        }
      });
      
      if (shouldRecalculate) {

        this.updateTotalStats();
      }
    });

    const socketContainers = document.querySelectorAll('.socket-container');
    socketContainers.forEach(container => {
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-stats', 'data-level-req', 'data-item-name']
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });


  }

  calculateLifeAndMana() {
  const level = this.currentLevel;
  const charClass = this.currentClass;
  const baseStats = this.classStats[this.currentClass];
  const totalVit = parseInt(document.getElementById('vit')?.value) || baseStats.vit;
  const totalEnr = parseInt(document.getElementById('enr')?.value) || baseStats.enr;
  
  
  
  // Get bonuses from items/sockets/charms (but NOT the socket life/mana)
  const itemBonuses = this.getAllItemBonuses();
  const socketBonuses = this.getSocketBonuses();
  const charmBonuses = this.getCharmBonuses();
  
  // Calculate final stats including bonuses
  const finalVit = totalVit + itemBonuses.vit + socketBonuses.vit + charmBonuses.vit;
  const finalEnr = totalEnr + itemBonuses.enr + socketBonuses.enr + charmBonuses.enr;
  
  // Get base values for this class
  const baseLife = this.classBaseLifeMana[charClass].life;
  const baseMana = this.classBaseLifeMana[charClass].mana;
  const startingVit = this.classStats[charClass].vit;
  const startingEnr = this.classStats[charClass].enr;
  
  // Calculate base life/mana from character level and stats
  let calculatedLife = baseLife;
  calculatedLife += (level - 1) * 2; // 2 life per level
  calculatedLife += (finalVit - startingVit) * 3; // 3 life per vitality point
  
  let calculatedMana = baseMana;
  calculatedMana += (level - 1) * 1.5; // 1.5 mana per level  
  calculatedMana += (finalEnr - startingEnr) * 2; // 2 mana per energy point
  
  // NOW add the direct life/mana bonuses from items/sockets
  let itemLifeBonus = 0;
  let itemManaBonus = 0;
  
  const directLifeMana = this.getDirectLifeManaFromItems();
itemLifeBonus = directLifeMana.life;
itemManaBonus = directLifeMana.mana;
  
  // Final totals
  const totalLife = Math.floor(calculatedLife + itemLifeBonus);
  const totalMana = Math.floor(calculatedMana + itemManaBonus);

   if (window.statsCalculator && window.statsCalculator.stats) {
    // Store current values
    const currentSocketLife = window.statsCalculator.stats.life || 0;
    
    // Force socket system to recalculate
    if (window.statsCalculator.resetAllStats) {
      window.statsCalculator.resetAllStats();
    }
    if (window.statsCalculator.updateAll) {
      window.statsCalculator.updateAll();
    }
    
    // Now get the fresh values
    itemLifeBonus = window.statsCalculator.stats.life || 0;
    itemManaBonus = window.statsCalculator.stats.mana || 0;
    

  }
  

  
  // Update the displays
  this.updateElement('lifecontainer', totalLife);
  this.updateElement('manacontainer', totalMana);
  
  return { life: totalLife, mana: totalMana };
}

getDirectLifeManaFromItems() {
  const bonuses = { life: 0, mana: 0 };
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;

  // Get life/mana from base items
  const equipmentSections = [
    { dropdown: 'weapons-dropdown', section: 'weapon' },
    { dropdown: 'helms-dropdown', section: 'helm' },
    // ... other sections
  ];

  equipmentSections.forEach(({ dropdown, section }) => {
    const dropdownElement = document.getElementById(dropdown);
    if (!dropdownElement || !dropdownElement.value) return;

    const itemData = window.itemList || itemList;
    if (!itemData) return;

    const item = itemData[dropdownElement.value];
    if (!item) return;

    const actualRequiredLevel = this.getActualRequiredLevel(section, dropdownElement.value);

    if (currentLevel >= actualRequiredLevel && item.properties) {
      // Get base item life/mana (use tolife, not life)
      bonuses.life += item.properties.tolife || 0;
      bonuses.mana += item.properties.tomana || 0;
    }
  });

  // ADD: Get life/mana from sockets
  const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots'];
  
  sections.forEach(section => {
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    
    sockets.forEach(socket => {
      const socketLevel = parseInt(socket.dataset.levelReq) || 1;
      
      if (currentLevel >= socketLevel) {
        const stats = socket.dataset.stats;
        if (stats) {
          // Parse life/mana from socket stats text
          const lifeMatch = stats.match(/\+(\d+)\s+(?:to\s+)?Life/i);
          if (lifeMatch) bonuses.life += parseInt(lifeMatch[1]);
          
          const manaMatch = stats.match(/\+(\d+)\s+(?:to\s+)?Mana/i);
          if (manaMatch) bonuses.mana += parseInt(manaMatch[1]);
        }
      }
    });
  });

  return bonuses;
}

  updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }

  getAvailableStatPoints() {
    return 15 + (this.currentLevel - 1) * 5;
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

    equipmentSections.forEach(({ dropdown, section }) => {
      const dropdownElement = document.getElementById(dropdown);
      if (!dropdownElement || !dropdownElement.value) return;

      const itemData = window.itemList || itemList;
      if (!itemData) return;

      const item = itemData[dropdownElement.value];
      if (!item) return;

      const actualRequiredLevel = this.getActualRequiredLevel(section, dropdownElement.value);

      if (currentLevel >= actualRequiredLevel && item.properties) {
        bonuses.str += item.properties.str || 0;
        bonuses.dex += item.properties.dex || 0;
        bonuses.vit += item.properties.vit || 0;
        bonuses.enr += item.properties.enr || 0;
      }
    });

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
    const itemData = window.itemList || itemList;
    if (!itemData || !itemData[itemName]) return 1;
    
    const baseLevel = itemData[itemName].properties?.reqlvl || 1;
    
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
      totalDiv.style.color = '#00ff00';
    } else {
      totalDiv.textContent = '';
    }
  }

  updateStatPointsDisplay() {
    const available = this.getAvailableStatPoints();
    const used = this.getUsedStatPoints();
    const remaining = available - used;
    
    let statPointsDiv = document.getElementById('stat-points-display');
    if (!statPointsDiv) {
      statPointsDiv = document.createElement('div');
      statPointsDiv.id = 'stat-points-display';
      statPointsDiv.style.cssText = `
        // margin-top: 10px;
        padding: 0;
        background: rgba(15, 52, 96, 0.3);
        border: 1px solid #0f3460;
        border-radius: 5px;
        text-align: center;
        color: #00bfff;
        font-weight: bold;
      `;
      
      const lastStatInput = document.getElementById('enrTotal');
      if (lastStatInput && lastStatInput.parentElement) {
        lastStatInput.parentElement.appendChild(statPointsDiv);
      }
    }
    
    let color = '#00bfff';
    if (remaining < 0) color = '#ff5555';
    else if (remaining === 0) color = '#00ff00';
    
    statPointsDiv.innerHTML = `<div>Stat Points: ${remaining}/${available}</div>`;
    statPointsDiv.style.color = color;
  }

  updateTotalStats() {
    const baseStats = {
      str: parseInt(document.getElementById('str')?.value) || 0,
      dex: parseInt(document.getElementById('dex')?.value) || 0,
      vit: parseInt(document.getElementById('vit')?.value) || 0,
      enr: parseInt(document.getElementById('enr')?.value) || 0
    };

    const itemBonuses = this.getAllItemBonuses();
    const socketBonuses = this.getSocketBonuses();
    const charmBonuses = this.getCharmBonuses();

    const totalBonuses = {
      str: itemBonuses.str + socketBonuses.str + charmBonuses.str,
      dex: itemBonuses.dex + socketBonuses.dex + charmBonuses.dex,
      vit: itemBonuses.vit + socketBonuses.vit + charmBonuses.vit,
      enr: itemBonuses.enr + socketBonuses.enr + charmBonuses.enr
    };

    this.updateTotalDisplay('str', baseStats.str + totalBonuses.str);
    this.updateTotalDisplay('dex', baseStats.dex + totalBonuses.dex);
    this.updateTotalDisplay('vit', baseStats.vit + totalBonuses.vit);
    this.updateTotalDisplay('enr', baseStats.enr + totalBonuses.enr);

    this.calculateLifeAndMana();
  }

  handleLevelChange() {
    const lvlInput = document.getElementById('lvlValue');
    let level = parseInt(lvlInput.value) || 1;
    
    if (level > 99) {
      level = 99;
      lvlInput.value = 99;
    } else if (level < 1) {
      level = 1;
      lvlInput.value = 1;
    }
    
    this.level = level;
    this.currentLevel = level;
    
    this.validateStats();
    this.updateStatPointsDisplay();
    this.updateTotalStats();
  }

  handleClassChange() {
    const classSelect = document.getElementById('selectClass');
    if (!classSelect) return;
    
    const selectedClass = classSelect.value;
    const baseStats = this.classStats[selectedClass];
    
    if (baseStats) {
      this.currentClass = selectedClass;
      document.getElementById('str').value = baseStats.str;
      document.getElementById('dex').value = baseStats.dex;
      document.getElementById('vit').value = baseStats.vit;
      document.getElementById('enr').value = baseStats.enr;
      
      this.updateTotalStats();
      this.updateStatPointsDisplay();
    }
  }

  validateStats() {
    const baseStats = this.classStats[this.currentClass];
    const availablePoints = this.getAvailableStatPoints();
    const maxTotal = this.getTotalBaseStats() + availablePoints;
    
    let currentTotal = 0;
    const statInputs = ['str', 'dex', 'vit', 'enr'];
    const currentStats = {};
    
    statInputs.forEach(statId => {
      const input = document.getElementById(statId);
      let value = parseInt(input.value) || baseStats[statId];
      
      if (value < baseStats[statId]) {
        value = baseStats[statId];
        input.value = value;
      }
      
      currentStats[statId] = value;
      currentTotal += value;
    });
    
    if (currentTotal > maxTotal) {
      const excess = currentTotal - maxTotal;
      this.reduceStatsProportionally(currentStats, baseStats, excess);
    }
  }

  reduceStatsProportionally(currentStats, baseStats, excess) {
    let remaining = excess;
    const statIds = ['str', 'dex', 'vit', 'enr'];
    
    while (remaining > 0) {
      let reduced = false;
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
      
      if (!reduced) break;
    }
  }

  handleStatChange(statId) {
    const input = document.getElementById(statId);
    const baseValue = this.classStats[this.currentClass][statId];
    let value = parseInt(input.value) || baseValue;
    
    if (value < baseValue) {
      input.value = baseValue;
      value = baseValue;
    }
    
    const availablePoints = this.getAvailableStatPoints();
    const currentUsed = this.getUsedStatPoints();
    
    if (currentUsed > availablePoints) {
      this.validateStats();
    }
    
    this.updateStatPointsDisplay();
    
    // Real-time life/mana updates for vit/enr
    if (statId === 'vit' || statId === 'enr') {
      this.calculateLifeAndMana();
    }
  }

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
    this.updateTotalStats();
    this.updateStatPointsDisplay();
    this.calculateLifeAndMana();
  }
}

// Initialize
let characterManager;

function initCharacterManager() {
  if (!characterManager) {
    characterManager = new CharacterManager();
    window.characterManager = characterManager;
    
    if (window.characterStats) {
      window.characterStats.getAllItemBonuses = () => characterManager.getAllItemBonuses();
      window.characterStats.getSocketBonuses = () => characterManager.getSocketBonuses();
      window.characterStats.getCharmBonuses = () => characterManager.getCharmBonuses();
      window.characterStats.updateTotalStats = () => characterManager.updateTotalStats();
    }
    

  }
}

setTimeout(initCharacterManager, 100);
document.addEventListener('DOMContentLoaded', initCharacterManager);
window.addEventListener('load', initCharacterManager);

window.initCharacter = initCharacterManager;
window.testCharacterBonuses = function() {
  if (window.characterManager) {

    const itemBonuses = window.characterManager.getAllItemBonuses();
    const socketBonuses = window.characterManager.getSocketBonuses();

    window.characterManager.updateTotalStats();
  } else {

  }
};