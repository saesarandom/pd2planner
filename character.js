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
      // lvlInput.addEventListener('blur', () => this.validateLevel());
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
  const level = parseInt(document.getElementById('lvlValue')?.value) || 1;
  const charClass = document.getElementById('selectClass')?.value || 'Amazon';
  
  const baseLife = this.classBaseLifeMana[charClass].life;
  const baseMana = this.classBaseLifeMana[charClass].mana;
  
  // FIXED: Get base stat values from inputs, not total displays
  const baseVit = parseInt(document.getElementById('vit')?.value) || this.classStats[charClass].vit;
  const baseEnr = parseInt(document.getElementById('enr')?.value) || this.classStats[charClass].enr;
  
  // Get item/socket bonuses for vitality and energy
  const itemBonuses = this.getAllItemBonuses();
  const socketBonuses = this.getSocketBonuses();
  const charmBonuses = this.getCharmBonuses();
  
  // Calculate TOTAL vitality and energy (base + bonuses)
  const totalVit = baseVit + (itemBonuses.vit || 0) + (socketBonuses.vit || 0) + (charmBonuses.vit || 0);
  const totalEnr = baseEnr + (itemBonuses.enr || 0) + (socketBonuses.enr || 0) + (charmBonuses.enr || 0);
  
  // Starting stats for this class
  const startingVit = this.classStats[charClass].vit;
  const startingEnr = this.classStats[charClass].enr;
  
  // Calculate base life/mana from character level and stats
  let calculatedLife = baseLife;
  calculatedLife += (level - 1) * 2; // 2 life per level
  calculatedLife += (totalVit - startingVit) * 3; // 3 life per vitality point (including bonuses)
  
  let calculatedMana = baseMana;
  calculatedMana += (level - 1) * 1.5; // 1.5 mana per level  
  calculatedMana += (totalEnr - startingEnr) * 2; // 2 mana per energy point (including bonuses)
  
  // Add direct life/mana bonuses from items/sockets
  const directLifeMana = this.getDirectLifeManaFromItems();
  calculatedLife += directLifeMana.life;
  calculatedMana += directLifeMana.mana;
  
  // Add charm life/mana bonuses
  const charmBonuses_LifeMana = this.getCharmLifeManaBonus();
  calculatedLife += charmBonuses_LifeMana.life;
  calculatedMana += charmBonuses_LifeMana.mana;
  
  // Final totals
  const totalLife = Math.floor(calculatedLife);
  const totalMana = Math.floor(calculatedMana);
  
  // Update the displays
  this.updateElement('lifecontainer', totalLife);
  this.updateElement('manacontainer', totalMana);
  

  
  // Style life container if charm bonus exists
  const lifeContainer = document.getElementById('lifecontainer');
  if (lifeContainer) {
    if (charmBonuses_LifeMana.life > 0) {
      lifeContainer.style.color = '#d0d007ff'; // Same yellow color as other charm bonuses
    } else {
      lifeContainer.style.color = ''; // Reset to default
    }
  
  
  // Style mana container if charm bonus exists
  const manaContainer = document.getElementById('manacontainer');
  if (manaContainer) {
    if (charmBonuses_LifeMana.mana > 0) {
      manaContainer.style.color = '#d0d007ff'; // Same yellow color as other charm bonuses
    } else {
      manaContainer.style.color = ''; // Reset to default
    }
  }
  }

  //(`🔢 Life: ${totalLife}, Mana: ${totalMana} (Class: ${charClass}, Level: ${level})`);
  return { life: totalLife, mana: totalMana };
}

getDirectLifeManaFromItems() {
  const bonuses = { life: 0, mana: 0 };
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;

  // FIXED: Complete list of all equipment sections
  const equipmentSections = [
    { dropdown: 'weapons-dropdown', section: 'weapon' },
    { dropdown: 'helms-dropdown', section: 'helm' },
    { dropdown: 'armors-dropdown', section: 'armor' },
    { dropdown: 'offs-dropdown', section: 'shield' },
    { dropdown: 'gloves-dropdown', section: 'gloves' },
    { dropdown: 'belts-dropdown', section: 'belts' },
    { dropdown: 'boots-dropdown', section: 'boots' },
    { dropdown: 'ringsone-dropdown', section: 'ringone' },
    { dropdown: 'ringstwo-dropdown', section: 'ringtwo' },
    { dropdown: 'amulets-dropdown', section: 'amulet' }
  ];

  //('🔍 Checking equipment for life/mana bonuses:');

  equipmentSections.forEach(({ dropdown, section }) => {
    const dropdownElement = document.getElementById(dropdown);
    if (!dropdownElement || !dropdownElement.value) {
      //(`  ❌ ${section}: No item selected`);
      return;
    }

    const itemData = window.itemList || itemList;
    if (!itemData) {
      //(`  ❌ ${section}: No itemList found`);
      return;
    }

    const item = itemData[dropdownElement.value];
    if (!item) {
      //(`  ❌ ${section}: Item not found in itemList`);
      return;
    }

    const actualRequiredLevel = this.getActualRequiredLevel(section, dropdownElement.value);

    if (currentLevel >= actualRequiredLevel) {
      // Check multiple possible property names for life/mana
      let itemLife = 0;
      let itemMana = 0;
      
      if (item.properties) {
        // Try different property names
        itemLife = item.properties.tolife || item.properties.life || 0;
        itemMana = item.properties.tomana || item.properties.mana || 0;
      }
      
      // Also parse from description if not in properties
      if (item.description && (itemLife === 0 || itemMana === 0)) {
        const lifeMatch = item.description.match(/\+(\d+)\s+(?:to\s+)?Life/i);
        if (lifeMatch && itemLife === 0) {
          itemLife = parseInt(lifeMatch[1]);
        }
        
        const manaMatch = item.description.match(/\+(\d+)\s+(?:to\s+)?Mana/i);
        if (manaMatch && itemMana === 0) {
          itemMana = parseInt(manaMatch[1]);
        }
      }
      
      bonuses.life += itemLife;
      bonuses.mana += itemMana;
      
      //(`  ✅ ${section} (${dropdownElement.value}): +${itemLife} life, +${itemMana} mana`);
    } else {
      //(`  ⚠️ ${section}: Level requirement not met (${actualRequiredLevel} > ${currentLevel})`);
    }
  });

  // Get life/mana from sockets
  const socketSections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
  
  socketSections.forEach(section => {
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    
    sockets.forEach(socket => {
      const socketLevel = parseInt(socket.dataset.levelReq) || 1;
      
      if (currentLevel >= socketLevel) {
        const stats = socket.dataset.stats;
        if (stats) {
          const lifeMatch = stats.match(/\+(\d+)\s+(?:to\s+)?Life/i);
          if (lifeMatch) {
            const socketLife = parseInt(lifeMatch[1]);
            bonuses.life += socketLife;
            //(`  🔷 ${section} socket: +${socketLife} life`);
          }
          
          const manaMatch = stats.match(/\+(\d+)\s+(?:to\s+)?Mana/i);
          if (manaMatch) {
            const socketMana = parseInt(manaMatch[1]);
            bonuses.mana += socketMana;
            //(`  🔷 ${section} socket: +${socketMana} mana`);
          }
        }
      }
    });
  });

  //(`  🎯 Total from equipment+sockets: +${bonuses.life} life, +${bonuses.mana} mana`);
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

  getCharmLifeManaBonus() {
  let charmLifeBonus = 0;
  let charmManaBonus = 0;
  
  // Get charm bonuses from inventory system
  const charms = document.querySelectorAll('[data-charm-data]');
  charms.forEach(charm => {
    const data = charm.dataset.charmData;
    if (!data) return;
    
    data.split('\n').forEach(line => {
      const lifeMatch = line.match(/\+(\d+)\s+to\s+Life/i);
      if (lifeMatch) {
        charmLifeBonus += parseInt(lifeMatch[1]);
      }
      
      const manaMatch = line.match(/\+(\d+)\s+to\s+Mana/i);
      if (manaMatch) {
        charmManaBonus += parseInt(manaMatch[1]);
      }
    });
  });
  
  return { life: charmLifeBonus, mana: charmManaBonus };
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