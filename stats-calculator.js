// Stats Calculator System - Calculates and displays all character stats
class StatsCalculator {
  constructor() {
    this.stats = {
      allSkills: 0,
      magicFind: 0,
      goldFind: 0,
      defense: 0,
  blockChance: 0,
  ias: 0,           // Increased Attack Speed
  fcr: 0,           // Faster Cast Rate
  frw: 0,           // Faster Run/Walk
  fhr: 0,           // Faster Hit Recovery
  cbf: 0,           // Cannot Be Frozen
  plr: 0,           // Poison Length Reduction
  dr: 0,            // Damage Reduction %
  pdr: 0,           // Physical Damage Reduction
  mdr: 0,           // Magic Damage Reduction
  fireResist: 0,
  coldResist: 0,
  lightResist: 0,
  poisonResist: 0,
  curseResist: 0,
      openWounds: 0,
      openWoundsDmg: 0,
      crushingBlow: 0,
      crushingBlowDmg: 0,
      pierceFire: 0,
      pierceCold: 0,
      pierceLight: 0,
      piercePoison: 0,
      pierceMagic: 0,
      piercePhys: 0,
      flatFireMin: 0,
      flatFireMax: 0,
      flatColdMin: 0,
      flatColdMax: 0,
      flatLightMin: 0,
      flatLightMax: 0,
      flatPoisonMin: 0,
      flatPoisonMax: 0,
      flatMagicMin: 0,
      flatMagicMax: 0,
      criticalHit: 0,
      deadlyStrike: 0,
      weaponMastery: 0,
      critHitMultiplier: 0
    };
    
    this.dropdownMap = {
      'weapons-dropdown': 'weapon',
      'helms-dropdown': 'helm',
      'armors-dropdown': 'armor',
      'offs-dropdown': 'shield',
      'gloves-dropdown': 'gloves',
      'belts-dropdown': 'belts',
      'boots-dropdown': 'boots',
      'ringsone-dropdown': 'ring',
      'ringstwo-dropdown': 'ring',
      'amulets-dropdown': 'amulet'
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.calculateAllStats();
  }
  
  setupEventListeners() {
    // Listen to all equipment dropdowns
    Object.keys(this.dropdownMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          this.calculateAllStats();
        });
      }
    });
    
    // Listen to character stats changes
    ['str', 'dex', 'vit', 'enr', 'lvlValue'].forEach(statId => {
      const input = document.getElementById(statId);
      if (input) {
        input.addEventListener('input', () => {
          this.calculateAllStats();
        });
      }
    });
    
    // Listen to socket changes
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('socket-slot')) {
        // Recalculate after socket changes with a small delay
        setTimeout(() => this.calculateAllStats(), 100);
      }
    });
  }
  
  calculateAllStats() {
    this.resetStats();
    
    // Calculate stats from equipment
    this.calculateEquipmentStats();
    
    // Calculate stats from sockets
    this.calculateSocketStats();
    
    // Update all display containers
    this.updateDisplay();
  }
  
  resetStats() {
    Object.keys(this.stats).forEach(key => {
      this.stats[key] = 0;
    });
  }
  
  calculateEquipmentStats() {
    Object.entries(this.dropdownMap).forEach(([dropdownId, itemType]) => {
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown || !dropdown.value) return;
      
      const itemName = dropdown.value;
      const item = itemList[itemName];
      
      if (!item || !item.properties) return;
      
      // Parse item stats
      this.addItemStats(item.properties, item.description);
    });
  }
  
  addItemStats(properties, description) {
    // Add stats from properties object
    if (properties.allskills) this.stats.allSkills += properties.allskills;
    if (properties.magicfind) this.stats.magicFind += properties.magicfind;
    if (properties.goldfind) this.stats.goldFind += properties.goldfind;
    if (properties.openwounds) this.stats.openWounds += properties.openwounds;
    if (properties.crushingblow) this.stats.crushingBlow += properties.crushingblow;
    if (properties.criticalstrike) this.stats.criticalHit += properties.criticalstrike;
    if (properties.deadlystrike) this.stats.deadlyStrike += properties.deadlystrike;
    
    // Parse description for additional stats not in properties
    if (description) {
      this.parseDescriptionStats(description);
    }
  }
  
  parseDescriptionStats(description) {
    const lines = description.split('<br>');
    
    lines.forEach(line => {
      const cleanLine = line.trim();
      
      // Magic Find
      if (cleanLine.includes('Better Chance of Getting Magic Items')) {
        const match = cleanLine.match(/(\d+)%.*Better Chance of Getting Magic Items/);
        if (match) this.stats.magicFind += parseInt(match[1]);
      }
      
      // Gold Find
      if (cleanLine.includes('Extra Gold')) {
        const match = cleanLine.match(/(\d+)%.*Extra Gold/);
        if (match) this.stats.goldFind += parseInt(match[1]);
      }
      
      // All Skills
      if (cleanLine.includes('to All Skills')) {
        const match = cleanLine.match(/\+(\d+) to All Skills/);
        if (match) this.stats.allSkills += parseInt(match[1]);
      }
      
      // Open Wounds
      if (cleanLine.includes('Chance of Open Wounds')) {
        const match = cleanLine.match(/(\d+)% Chance of Open Wounds/);
        if (match) this.stats.openWounds += parseInt(match[1]);
      }
      
      // Crushing Blow
      if (cleanLine.includes('Chance of Crushing Blow')) {
        const match = cleanLine.match(/(\d+)% Chance of Crushing Blow/);
        if (match) this.stats.crushingBlow += parseInt(match[1]);
      }
      
      // Deadly Strike
      if (cleanLine.includes('Deadly Strike')) {
        const match = cleanLine.match(/(\d+)% Deadly Strike/);
        if (match) this.stats.deadlyStrike += parseInt(match[1]);
      }
      
      // Critical Hit
      if (cleanLine.includes('Critical Strike')) {
        const match = cleanLine.match(/(\d+)% Critical Strike/);
        if (match) this.stats.criticalHit += parseInt(match[1]);
      }
      
      // Fire Damage
      if (cleanLine.includes('Fire Damage')) {
        const match = cleanLine.match(/Adds (\d+)-(\d+) Fire Damage/);
        if (match) {
          this.stats.flatFireMin += parseInt(match[1]);
          this.stats.flatFireMax += parseInt(match[2]);
        }
      }
      
      // Cold Damage
      if (cleanLine.includes('Cold Damage')) {
        const match = cleanLine.match(/Adds (\d+)-(\d+) Cold Damage/);
        if (match) {
          this.stats.flatColdMin += parseInt(match[1]);
          this.stats.flatColdMax += parseInt(match[2]);
        }
      }
      
      // Lightning Damage
      if (cleanLine.includes('Lightning Damage')) {
        const match = cleanLine.match(/Adds (\d+)-(\d+) Lightning Damage/);
        if (match) {
          this.stats.flatLightMin += parseInt(match[1]);
          this.stats.flatLightMax += parseInt(match[2]);
        }
      }
      
      // Poison Damage
      if (cleanLine.includes('Poison Damage')) {
        const match = cleanLine.match(/\+(\d+) Poison Damage/);
        if (match) {
          this.stats.flatPoisonMin += parseInt(match[1]);
          this.stats.flatPoisonMax += parseInt(match[1]);
        }
      }
      
      // Pierce stats
      if (cleanLine.includes('Enemy Fire Resistance')) {
        const match = cleanLine.match(/-(\d+)% Enemy Fire Resistance/);
        if (match) this.stats.pierceFire += parseInt(match[1]);
      }
      
      if (cleanLine.includes('Enemy Cold Resistance')) {
        const match = cleanLine.match(/-(\d+)% Enemy Cold Resistance/);
        if (match) this.stats.pierceCold += parseInt(match[1]);
      }
      
      if (cleanLine.includes('Enemy Lightning Resistance')) {
        const match = cleanLine.match(/-(\d+)% Enemy Lightning Resistance/);
        if (match) this.stats.pierceLight += parseInt(match[1]);
      }
      
      if (cleanLine.includes('Enemy Poison Resistance')) {
        const match = cleanLine.match(/-(\d+)% Enemy Poison Resistance/);
        if (match) this.stats.piercePoison += parseInt(match[1]);
      }

      if (cleanLine.includes('Defense:')) {
      const match = cleanLine.match(/Defense: (\d+)/);
      if (match) this.stats.defense += parseInt(match[1]);
    }
    
    // IAS - Increased Attack Speed
    if (cleanLine.includes('Increased Attack Speed')) {
      const match = cleanLine.match(/(\d+)% Increased Attack Speed/);
      if (match) this.stats.ias += parseInt(match[1]);
    }
    
    // FCR - Faster Cast Rate
    if (cleanLine.includes('Faster Cast Rate')) {
      const match = cleanLine.match(/(\d+)% Faster Cast Rate/);
      if (match) this.stats.fcr += parseInt(match[1]);
    }
    
    // FRW - Faster Run/Walk
    if (cleanLine.includes('Faster Run/Walk')) {
      const match = cleanLine.match(/(\d+)% Faster Run\/Walk/);
      if (match) this.stats.frw += parseInt(match[1]);
    }
    
    // FHR - Faster Hit Recovery
    if (cleanLine.includes('Faster Hit Recovery')) {
      const match = cleanLine.match(/(\d+)% Faster Hit Recovery/);
      if (match) this.stats.fhr += parseInt(match[1]);
    }
    
    // CBF - Cannot Be Frozen
    if (cleanLine.includes('Cannot Be Frozen')) {
      this.stats.cbf = 1;
    }
    
    // PLR - Poison Length Reduction
    if (cleanLine.includes('Poison Length Reduced')) {
      const match = cleanLine.match(/Poison Length Reduced by (\d+)%/);
      if (match) this.stats.plr += parseInt(match[1]);
    }
    
    // DR - Damage Reduction %
    if (cleanLine.includes('Damage Reduced by') && cleanLine.includes('%')) {
      const match = cleanLine.match(/Damage Reduced by (\d+)%/);
      if (match) this.stats.dr += parseInt(match[1]);
    }
    
    // PDR - Physical Damage Reduction
    if (cleanLine.includes('Physical Damage Taken Reduced')) {
      const match = cleanLine.match(/Physical Damage Taken Reduced by (\d+)/);
      if (match) this.stats.pdr += parseInt(match[1]);
    }
    
    // MDR - Magic Damage Reduction
    if (cleanLine.includes('Magic Damage Taken Reduced')) {
      const match = cleanLine.match(/Magic Damage Taken Reduced by (\d+)/);
      if (match) this.stats.mdr += parseInt(match[1]);
    }
    
    // RESISTANCES
    if (cleanLine.includes('Fire Resist')) {
      const match = cleanLine.match(/Fire Resist \+(\d+)%/);
      if (match) this.stats.fireResist += parseInt(match[1]);
    }
    
    if (cleanLine.includes('Cold Resist')) {
      const match = cleanLine.match(/Cold Resist \+(\d+)%/);
      if (match) this.stats.coldResist += parseInt(match[1]);
    }
    
    if (cleanLine.includes('Lightning Resist')) {
      const match = cleanLine.match(/Lightning Resist \+(\d+)%/);
      if (match) this.stats.lightResist += parseInt(match[1]);
    }
    
    if (cleanLine.includes('Poison Resist')) {
      const match = cleanLine.match(/Poison Resist \+(\d+)%/);
      if (match) this.stats.poisonResist += parseInt(match[1]);
    }
    
    if (cleanLine.includes('All Resistances')) {
      const match = cleanLine.match(/All Resistances \+(\d+)/);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.fireResist += value;
        this.stats.coldResist += value;
        this.stats.lightResist += value;
        this.stats.poisonResist += value;
      }
    }
    
    // Block Chance (from shields)
    if (cleanLine.includes('Chance to Block')) {
      const match = cleanLine.match(/(\d+)% Chance to Block/);
      if (match) this.stats.blockChance += parseInt(match[1]);
    }
  });
}
   
  
  calculateSocketStats() {
    // Get stats from all socketed items
    document.querySelectorAll('.socket-slot.filled').forEach(socket => {
      const stats = socket.dataset.stats;
      if (stats) {
        this.parseSocketStats(stats);
      }
    });
  }
  
  parseSocketStats(statsString) {
    if (!statsString) return;
    
    // Parse socket stats similar to description parsing
    const lines = statsString.split(',');
    
    lines.forEach(line => {
      const cleanLine = line.trim();
      
      // Better Chance of Getting Magic Items (from gems/runes)
      if (cleanLine.includes('Better Chance of Getting Magic Items')) {
        const match = cleanLine.match(/(\d+)% Better Chance of Getting Magic Items/);
        if (match) this.stats.magicFind += parseInt(match[1]);
      }
      
      // Gold find from runes
      if (cleanLine.includes('Extra Gold')) {
        const match = cleanLine.match(/(\d+)% Extra Gold/);
        if (match) this.stats.goldFind += parseInt(match[1]);
      }
      
      // Fire damage from gems/runes
      if (cleanLine.includes('Fire Damage')) {
        const match = cleanLine.match(/Adds (\d+)-(\d+) Fire Damage/);
        if (match) {
          this.stats.flatFireMin += parseInt(match[1]);
          this.stats.flatFireMax += parseInt(match[2]);
        }
      }
      
      // Similar parsing for other socket stats...
    });
  }
  
  updateDisplay() {
    // Update all stat containers
    this.updateContainer('allskillscontainer', this.stats.allSkills);
    this.updateContainer('magicfindcontainer', this.stats.magicFind);
    this.updateContainer('goldfindcontainer', this.stats.goldFind);
     this.updateContainer('defensecontainer', this.stats.defense);
  this.updateContainer('realblockcontainer', this.stats.blockChance);
  this.updateContainer('iascontainer', this.stats.ias);
  this.updateContainer('fcrcontainer', this.stats.fcr);
  this.updateContainer('frwcontainer', this.stats.frw);
  this.updateContainer('fhrcontainer', this.stats.fhr);
  this.updateContainer('cbfcontainer', this.stats.cbf ? 'Yes' : 'No');
  this.updateContainer('plrcontainer', this.stats.plr);
  this.updateContainer('drcontainer', this.stats.dr);
  this.updateContainer('pdrcontainer', this.stats.pdr);
  this.updateContainer('mdrcontainer', this.stats.mdr);
  this.updateContainer('fireresistcontainer', this.stats.fireResist);
  this.updateContainer('coldresistcontainer', this.stats.coldResist);
  this.updateContainer('lightresistcontainer', this.stats.lightResist);
  this.updateContainer('poisonresistcontainer', this.stats.poisonResist);
  this.updateContainer('curseresistcontainer', this.stats.curseResist);
    this.updateContainer('owcontainer', this.stats.openWounds);
    this.updateContainer('owdmgcontainer', this.calculateOpenWoundsDamage());
    this.updateContainer('cbcontainer', this.stats.crushingBlow);
    this.updateContainer('cbdmgcontainer', this.calculateCrushingBlowDamage());
    
    // Pierce stats
    this.updateContainer('piercephyscontainer', this.stats.piercePhys);
    this.updateContainer('piercefirecontainer', this.stats.pierceFire);
    this.updateContainer('piercecoldcontainer', this.stats.pierceCold);
    this.updateContainer('piercelightcontainer', this.stats.pierceLight);
    this.updateContainer('piercepoisoncontainer', this.stats.piercePoison);
    this.updateContainer('piercemagiccontainer', this.stats.pierceMagic);
    
    // Flat damage stats
    this.updateContainer('flatfiremincontainer', this.stats.flatFireMin);
    this.updateContainer('flatfiremaxcontainer', this.stats.flatFireMax);
    this.updateContainer('flatcoldmincontainer', this.stats.flatColdMin);
    this.updateContainer('flatcoldmaxcontainer', this.stats.flatColdMax);
    this.updateContainer('flatlightmincontainer', this.stats.flatLightMin);
    this.updateContainer('flatlightmaxcontainer', this.stats.flatLightMax);
    this.updateContainer('flatpoisonmincontainer', this.stats.flatPoisonMin);
    this.updateContainer('flatpoisonmaxcontainer', this.stats.flatPoisonMax);
    this.updateContainer('flatmagicmincontainer', this.stats.flatMagicMin);
    this.updateContainer('flatmagicmaxcontainer', this.stats.flatMagicMax);
    
    // Combat stats
    this.updateContainer('criticalhitcontainer', this.stats.criticalHit);
    this.updateContainer('deadlystrikecontainer', this.stats.deadlyStrike);
    this.updateContainer('weaponmasterycontainer', this.stats.weaponMastery);
    this.updateContainer('crithitmultipliercontainer', this.calculateCritMultiplier());
  }
  
  updateContainer(containerId, value) {
  const container = document.getElementById(containerId);
  if (container) {
    if (containerId === 'cbfcontainer') {
      container.textContent = value; // Already formatted as 'Yes'/'No'
    } else {
      container.textContent = Math.round(value);
    }
  }
}
  
  calculateOpenWoundsDamage() {
    // Open wounds damage calculation
    const level = parseInt(document.getElementById('lvlValue')?.value || 1);
    return Math.floor(this.stats.openWounds * level * 0.5); // Simplified calculation
  }
  
  calculateCrushingBlowDamage() {
    // Crushing blow damage is percentage-based
    return this.stats.crushingBlow > 0 ? 25 : 0; // 25% of monster's current HP
  }
  
  calculateCritMultiplier() {
    // Critical hit damage multiplier
    return 2.0 + (this.stats.weaponMastery * 0.1); // Base 2x + weapon mastery bonus
  }
  
  // Public method to force recalculation
  recalculate() {
    this.calculateAllStats();
  }
}

// Initialize the stats calculator
let statsCalculator;

function initStatsCalculator() {
  if (statsCalculator) {
    console.warn('Stats calculator already initialized');
    return;
  }
  
  statsCalculator = new StatsCalculator();
  
  // Expose global function for manual recalculation
  window.recalculateStats = () => {
    if (statsCalculator) {
      statsCalculator.recalculate();
    }
  };
  
  console.log('📊 Stats Calculator initialized');
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initStatsCalculator, 200);
  });
} else {
  setTimeout(initStatsCalculator, 200);
}

// Also initialize after window load to ensure all other scripts are loaded
window.addEventListener('load', () => {
  setTimeout(initStatsCalculator, 300);
});

// Export for use in other scripts
window.StatsCalculator = StatsCalculator;