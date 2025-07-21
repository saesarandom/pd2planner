class BuffSystem {
  constructor() {
    this.activeBuffs = new Map();
    this.buffContainer = document.querySelector('.buffcontainer');
    this.initializeStyles();
    this.setupMercenaryListener();
  }

  initializeStyles() {
    // Update buffcontainer styles for horizontal layout
    if (this.buffContainer) {
      this.buffContainer.style.flexDirection = 'row';
      this.buffContainer.style.flexWrap = 'wrap';
      this.buffContainer.style.gap = '4px';
      this.buffContainer.style.justifyContent = 'center';
      this.buffContainer.innerHTML = ''; // Clear placeholder text
    }
  }

  setupMercenaryListener() {
    const mercDropdown = document.getElementById('mercclass');
    if (mercDropdown) {
      mercDropdown.addEventListener('change', () => {
        this.handleMercenaryChange(mercDropdown.value);
      });
    }
  }

  handleMercenaryChange(mercValue) {
    // Remove previous mercenary auras
    this.removeBuff('vigor');
    this.removeBuff('meditation');
    this.removeBuff('defiance');
    this.removeBuff('blessed-aim');
    this.removeBuff('cleansing');
    this.removeBuff('prayer');
    this.removeBuff('might');

    // Get mercenary level for tooltips
    const mercLevel = document.getElementById('merclvlValue')?.value || 1;

    // Add new aura based on selection
    if (mercValue.includes('Vigor')) {
      this.addBuff({
        id: 'vigor',
        name: 'Vigor',
        image: 'vigor2.png',
        type: 'Aura',
        level: mercLevel,
        description: '+30% Faster Run/Walk<br>+30% Faster Hit Recovery<br>+60% Stamina Recovery',
        tooltipType: 'aura'
      });
    } else if (mercValue.includes('Meditation')) {
      this.addBuff({
        id: 'meditation',
        name: 'Meditation',
        image: 'meditation2.png',
        type: 'Aura',
        level: mercLevel,
        description: '+100% Faster Mana Regeneration<br>All Party Members Gain<br>Faster Mana Regeneration',
        tooltipType: 'aura'
      });
    } else if (mercValue.includes('Defiance')) {
      this.addBuff({
        id: 'defiance',
        name: 'Defiance',
        image: 'defiance2.png',
        type: 'Aura',
        level: mercLevel,
        description: '+100% Enhanced Defense<br>All Party Members Gain<br>Enhanced Defense',
        tooltipType: 'aura'
      });
    } else if (mercValue.includes('Blessed Aim')) {
      this.addBuff({
        id: 'blessed-aim',
        name: 'Blessed Aim',
        image: 'blessedaim2.png',
        type: 'Aura',
        level: mercLevel,
        description: '+75% Bonus to Attack Rating<br>All Party Members Gain<br>Bonus to Attack Rating',
        tooltipType: 'aura'
      });
    } else if (mercValue.includes('Cleansing')) {
      this.addBuff({
        id: 'cleansing',
        name: 'Cleansing',
        image: 'cleansing2.png',
        type: 'Aura',
        level: mercLevel,
        description: 'Reduces Duration of<br>Poison and Curses by 75%<br>Heals 6 Life per Second',
        tooltipType: 'aura'
      });
    } else if (mercValue.includes('Prayer')) {
      this.addBuff({
        id: 'prayer',
        name: 'Prayer',
        image: 'prayer2.png',
        type: 'Aura',
        level: mercLevel,
        description: 'Heals 4 Life per Second<br>All Party Members Gain<br>Life Regeneration',
        tooltipType: 'aura'
      });
    } else if (mercValue.includes('Might')) {
      this.addBuff({
        id: 'might',
        name: 'Might',
        image: 'might2.png',
        type: 'Aura',
        level: mercLevel,
        description: '+230% Enhanced Damage<br>All Party Members Gain<br>Enhanced Damage',
        tooltipType: 'aura'
      });
    }
  }

  addBuff(buff) {
    if (this.activeBuffs.has(buff.id)) {
      return; // Already exists
    }

    this.activeBuffs.set(buff.id, buff);
    this.renderBuff(buff);
  }

  removeBuff(buffId) {
    if (this.activeBuffs.has(buffId)) {
      this.activeBuffs.delete(buffId);
      const buffElement = document.getElementById(`buff-${buffId}`);
      if (buffElement) {
        buffElement.remove();
      }
    }
  }

  renderBuff(buff) {
    const buffElement = document.createElement('div');
    buffElement.id = `buff-${buff.id}`;
    buffElement.className = 'buff-icon';
    
    const img = document.createElement('img');
    img.src = `img/${buff.image}`;
    img.alt = buff.name;
    img.style.width = '28px';
    img.style.height = '28px';
    img.style.cursor = 'pointer';
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = `buff-tooltip ${buff.tooltipType || ''}`;
    
    // Build tooltip content
    let tooltipHTML = `<span class="buff-name">${buff.name}</span>`;
    
    if (buff.type) {
      tooltipHTML += `<span class="buff-type">${buff.type}</span>`;
    }
    
    if (buff.level) {
      tooltipHTML += `<span class="buff-level">Level ${buff.level}</span>`;
    }
    
    if (buff.description) {
      tooltipHTML += `<span class="buff-description">${buff.description}</span>`;
    }
    
    tooltip.innerHTML = tooltipHTML;
    
    // Handle image load error
    img.onerror = () => {
      img.src = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" fill="#333"/>
          <text x="18" y="20" text-anchor="middle" fill="#fff" font-size="10">${buff.name.slice(0,3)}</text>
        </svg>
      `);
    };

    buffElement.appendChild(img);
    buffElement.appendChild(tooltip);
    this.buffContainer.appendChild(buffElement);
  }

  // Public methods for external use
  addCustomBuff(id, name, image, tooltip, level, type = '', description = '', tooltipType = '') {
    this.addBuff({ 
      id, 
      name, 
      image, 
      tooltip, 
      level, 
      type, 
      description, 
      tooltipType 
    });
  }

// buffSystem.addCustomBuff('amplify', 'Amplify Damage', 'amplify.png', '', 1, 'Curse', 
//   'Cursed enemies take<br>+100% Physical Damage', 'curse');

  removeCustomBuff(id) {
    this.removeBuff(id);
  }

  getActiveBuffs() {
    return Array.from(this.activeBuffs.values());
  }

  clearAllBuffs() {
    this.activeBuffs.clear();
    this.buffContainer.innerHTML = '';
  }
}

// Initialize when DOM is loaded
let buffSystem;

document.addEventListener('DOMContentLoaded', () => {
  buffSystem = new BuffSystem();
  window.buffSystem = buffSystem; // Make it globally accessible
});