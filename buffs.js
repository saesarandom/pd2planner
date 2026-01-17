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

    // Also refresh party buffs whenever mercenary changes just in case
    this.refreshPartyBuffs();
  }

  /**
   * Refresh icons for buffs provided by any party member (BO, BC, Shout, Spirits, etc.)
   */
  refreshPartyBuffs() {
    if (!window.partyManager) return;

    // 1. Battle Orders
    const bo = window.partyManager.getBestBuff('battle-orders');
    if (bo) {
      this.addBuff({
        id: 'party-bo',
        name: 'Battle Orders',
        image: 'battleorders2.png',
        type: 'Buff',
        level: bo.level,
        description: `+${bo.life} Life<br>+${bo.mana} Mana<br>Party-wide flat Life/Mana bonus`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-bo');
    }

    // 2. Battle Command
    const bc = window.partyManager.getBestBuff('battle-command');
    if (bc) {
      this.addBuff({
        id: 'party-bc',
        name: 'Battle Command',
        image: 'battlecommand.png', // Reuse BO icon for now as BC image is missing
        type: 'Buff',
        level: bc.level,
        description: `+${bc.allSkills} to All Skills<br>+${bc.damage}% Enhanced Damage`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-bc');
    }

    // 3. Shout
    const shout = window.partyManager.getBestBuff('shout');
    if (shout) {
      this.addBuff({
        id: 'party-shout',
        name: 'Shout',
        image: 'shout.png', // Shout image missing, use Defiance as it matches Defense theme
        type: 'Buff',
        level: shout.level,
        description: `+${shout.defenseBonus}% Enhanced Defense`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-shout');
    }

    const grimward = window.partyManager.getBestBuff('grim-ward');
    if (grimward) {
      this.addBuff({
        id: 'party-grimward',
        name: 'Grim Ward',
        image: 'grimward.png',
        type: 'Buff',
        level: grimward.level,
        description: `+${grimward.attackRating} Attack Rating<br>+${grimward.damageBonus}% Damage`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-grimward');
    }

    // 4. Oak Sage
    const oak = window.partyManager.getBestBuff('oak-sage');
    if (oak) {
      this.addBuff({
        id: 'party-oak',
        name: 'Oak Sage',
        image: 'oaksage.png', // Healing theme
        type: 'Spirit',
        level: oak.level,
        description: `+${oak.lifeBonus} Life<br>+${oak.lifeReplenish} Life Replenish`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-oak');
    }

    // 5. Heart of Wolverine
    const how = window.partyManager.getBestBuff('heart-of-wolverine');
    if (how) {
      this.addBuff({
        id: 'party-how',
        name: 'Heart of Wolverine',
        image: 'heartofwolverine.png', // Damage theme
        type: 'Spirit',
        level: how.level,
        description: `+${how.damageBonus}% Enhanced Damage<br>+${how.arBonus}% Attack Rating`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-how');
    }

    const sob = window.partyManager.getBestBuff('spirit-of-barbs');
    if (sob) {
      this.addBuff({
        id: 'party-sob',
        name: 'Spirit of Barbs',
        image: 'spiritofbarbs.png',
        type: 'Spirit',
        level: sob.level,
        description: `Returns ${sob.damageReturn} Damage to Attackers`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-sob');
    }

    // Fire Enchant
    const fireEnchant = window.partyManager.getBestBuff('fire-enchant');
    if (fireEnchant) {
      this.addBuff({
        id: 'party-fire-enchant',
        name: 'Enchant Fire',
        image: 'enchant.png',
        type: 'Buff',
        level: fireEnchant.level,
        description: `Fire Damage: ${fireEnchant.fireMin}-${fireEnchant.fireMax}<br>+${fireEnchant.attackRating}% Attack Rating`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-fire-enchant');
    }

    // Cold Enchant
    const coldEnchant = window.partyManager.getBestBuff('cold-enchant');
    if (coldEnchant) {
      this.addBuff({
        id: 'party-cold-enchant',
        name: 'Cold Enchant',
        image: 'coldenchant.png',
        type: 'Buff',
        level: coldEnchant.level,
        description: `Cold Damage: ${coldEnchant.coldMin}-${coldEnchant.coldMax}<br>+${coldEnchant.attackRating}% Attack Rating`,
        tooltipType: 'buff'
      });
    } else {
      this.removeBuff('party-cold-enchant');
    }

    // Amplify Damage
    const amp = window.partyManager.getBestBuff('amplify-damage');
    if (amp) {
      this.addBuff({
        id: 'party-amplify-damage',
        name: 'Amplify Damage',
        image: 'amplifydamage2.png',
        type: 'Curse',
        level: amp.level,
        description: `Cursed enemies physical resistance is lowered by<br>+${amp.physicalDamage}%<br>Duration: ${amp.duration}s`,
        tooltipType: 'curse'
      });
    } else {
      this.removeBuff('party-amplify-damage');
    }

    // Lower Resist
    const lr = window.partyManager.getBestBuff('lower-resist');
    if (lr) {
      this.addBuff({
        id: 'party-lower-resist',
        name: 'Lower Resist',
        image: 'lowerresist.png',
        type: 'Curse',
        level: lr.level,
        description: `Cursed enemies have<br>-${lr.resistReduction}% to All Resistances<br>Duration: ${lr.duration}s`,
        tooltipType: 'curse'
      });
    } else {
      this.removeBuff('party-lower-resist');
    }

    // Curse Mastery (passive bonus indicator)
    const cm = window.partyManager.getBestBuff('curse-mastery');
    if (cm) {
      this.addBuff({
        id: 'party-curse-mastery',
        name: 'Curse Mastery',
        image: 'cursemastery.png',
        type: 'Passive',
        level: cm.level,
        description: `Max active curses: ${cm.maxCurses}<br>All Curses also benefit from<br>increased Radius and Duration`,
        tooltipType: 'passive'
      });
    } else {
      this.removeBuff('party-curse-mastery');
    }
  }

  addBuff(buff) {
    const existing = this.activeBuffs.get(buff.id);
    if (existing && existing.level == buff.level && existing.description == buff.description) {
      return; // Already exists and same
    }

    this.activeBuffs.set(buff.id, buff);
    this.fullRefresh();
  }

  removeBuff(id) {
    if (this.activeBuffs.has(id)) {
      this.activeBuffs.delete(id);
      this.fullRefresh();
    }
  }

  /**
   * Re-renders all active buffs to the container
   */
  fullRefresh() {
    if (!this.buffContainer) return;
    this.buffContainer.innerHTML = '';

    // Sort buffs maybe? For now just render in insertion order
    this.activeBuffs.forEach(buff => {
      this.renderBuff(buff);
    });
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
      const line1 = buff.name.slice(0, 3).toUpperCase();
      const line2 = buff.name.length > 3 ? buff.name.slice(3, 6).toUpperCase() : '';

      img.src = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="32" height="32" x="2" y="2" rx="4" fill="#0a2412" stroke="#00ff00" stroke-width="1.5" filter="url(#glow)"/>
          <text x="18" y="${line2 ? '17' : '22'}" text-anchor="middle" fill="#c9f7c9" font-size="11" font-family="Oswald, sans-serif" font-weight="bold" filter="url(#glow)">
            <tspan x="18" dy="0">${line1}</tspan>
            ${line2 ? `<tspan x="18" dy="11">${line2}</tspan>` : ''}
          </text>
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