// Clean Stats Calculator System - With Complete Socket System
class StatsCalculator {
  constructor() {
    this.stats = {
      // Core Stats
      allSkills: 0,
      magicFind: 0,
      goldFind: 0,
      
      // Defensive Stats  
      defense: 0,
      blockChance: 0,
      dr: 0,        // Damage Reduction %
      pdr: 0,       // Physical Damage Reduction
      mdr: 0,       // Magic Damage Reduction
      plr: 0,       // Poison Length Reduction
      cbf: false,   // Cannot Be Frozen
      
      // Speed Stats
      ias: 0,       // Increased Attack Speed
      fcr: 0,       // Faster Cast Rate
      frw: 0,       // Faster Run/Walk
      fhr: 0,       // Faster Hit Recovery
      
      // Resistances
      fireResist: 0,
      coldResist: 0,
      lightResist: 0,
      poisonResist: 0,
      curseResist: 0,
      
      // Combat Stats
      openWounds: 0,
      openWoundsDmg: 0,
      crushingBlow: 0,
      crushingBlowDmg: 0,
      criticalHit: 0,
      deadlyStrike: 0,
      weaponMastery: 0,
      critHitMultiplier: 2.0,
      
      // Enemy Resistance Pierce
      piercePhys: 0,
      pierceFire: 0,
      pierceCold: 0,
      pierceLight: 0,
      piercePoison: 0,
      pierceMagic: 0,
      
      // Added Damage
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
      
      // Socket-only stats
      life: 0,
      mana: 0,
      attackRating: 0,
      strength: 0,
      dexterity: 0,
      vitality: 0,
      energy: 0,
      lifeSteal: 0,
      manaSteal: 0
    };
    
    this.equipmentMap = {
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
    
    // Socket system data
    this.socketData = {
      gems: {
        'perfect-topaz': { 
          name: 'Perfect Topaz', 
          img: 'img/perfecttopaz.png', 
          stats: { 
            weapon: 'Adds 1-40 Lightning Damage', 
            helm: '24% Better Chance of Getting Magic Items', 
            armor: '24% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +40%' 
          }
        },
        'perfect-ruby': { 
          name: 'Perfect Ruby', 
          img: 'img/perfectruby.png', 
          stats: { 
            weapon: '+15-20 Fire Damage', 
            helm: '+38 to Life', 
            armor: '+38 to Life', 
            shield: 'Fire Resist +40%' 
          }
        },
        'perfect-sapphire': { 
          name: 'Perfect Sapphire', 
          img: 'img/perfectsapphire.png', 
          stats: { 
            weapon: '+10-14 Cold Damage', 
            helm: '+38 to Mana', 
            armor: '+38 to Mana', 
            shield: 'Cold Resist +40%' 
          }
        },
        'perfect-emerald': { 
          name: 'Perfect Emerald', 
          img: 'img/perfectemerald.png', 
          stats: { 
            weapon: '+100 Poison Damage over 7 Seconds', 
            helm: '+10 to Dexterity', 
            armor: '+10 to Dexterity', 
            shield: 'Poison Resist +40%' 
          }
        },
        'perfect-amethyst': { 
          name: 'Perfect Amethyst', 
          img: 'img/perfectamethyst.png', 
          stats: { 
            weapon: '+150 to Attack Rating', 
            helm: '+10 to Strength', 
            armor: '+10 to Strength', 
            shield: '+30 Defense' 
          }
        },
        'perfect-diamond': { 
          name: 'Perfect Diamond', 
          img: 'img/perfectdiamond.png', 
          stats: { 
            weapon: '+68% Damage to Undead', 
            helm: '+100 to Attack Rating', 
            armor: '+100 to Attack Rating', 
            shield: 'All Resistances +19%' 
          }
        }
      },
      runes: {
        'el': { 
          name: 'El Rune', 
          img: 'img/elrune.png', 
          levelReq: 11, // Required level
          stats: { 
            weapon: '+50 Attack Rating, +1 Light Radius', 
            helm: '+15 Defense, +1 Light Radius', 
            armor: '+15 Defense, +1 Light Radius', 
            shield: '+15 Defense, +1 Light Radius' 
          }
        },
        'eld': { 
          name: 'Eld Rune', 
          img: 'img/eldrune.png', 
          levelReq: 11, // Required level
          stats: { 
            weapon: '+75% Damage vs Undead, +50 Attack Rating vs Undead', 
            helm: '15% Slower Stamina Drain', 
            armor: '15% Slower Stamina Drain', 
            shield: '7% Increased Chance of Blocking' 
          }
        },
        'tir': { 
          name: 'Tir Rune', 
          img: 'img/tirrune.png', 
          levelReq: 13, // Required level
          stats: { 
            weapon: '+2 to Mana after each Kill', 
            helm: '+2 to Mana after each Kill', 
            armor: '+2 to Mana after each Kill', 
            shield: '+2 to Mana after each Kill' 
          }
        },
        'nef': { 
          name: 'Nef Rune', 
          img: 'img/nefrune.png', 
          levelReq: 13, // Required level
          stats: { 
            weapon: 'Knockback', 
            helm: '+30 Defense vs. Missile', 
            armor: '+30 Defense vs. Missile', 
            shield: '+30 Defense vs. Missile' 
          }
        },
        'eth': { 
          name: 'Eth Rune', 
          img: 'img/ethrune.png', 
          levelReq: 15, // Required level
          stats: { 
            weapon: '-25% Target Defense', 
            helm: 'Regenerate Mana 15%', 
            armor: 'Regenerate Mana 15%', 
            shield: 'Regenerate Mana 15%' 
          }
        },
        'ith': { 
          name: 'Ith Rune', 
          img: 'img/ithrune.png', 
          stats: { 
            weapon: '+9 to Maximum Damage', 
            helm: '15% Damage Taken Gained as Mana when Hit', 
            armor: '15% Damage Taken Gained as Mana when Hit', 
            shield: '15% Damage Taken Gained as Mana when Hit' 
          }
        },
        'tal': { 
          name: 'Tal Rune', 
          img: 'img/talrune.png', 
          stats: { 
            weapon: '+75 Poison Damage over 5 Seconds', 
            helm: 'Poison Resist +30%', 
            armor: 'Poison Resist +30%', 
            shield: 'Poison Resist +35%' 
          }
        },
        'ral': { 
          name: 'Ral Rune', 
          img: 'img/ralrune.png', 
          levelReq: 19, // Required level
          stats: { 
            weapon: 'Adds 5-30 Fire Damage', 
            helm: 'Fire Resist +30%', 
            armor: 'Fire Resist +30%', 
            shield: 'Fire Resist +35%' 
          }
        },
        'ort': { 
          name: 'Ort Rune', 
          img: 'img/ortrune.png', 
          stats: { 
            weapon: 'Adds 1-50 Lightning Damage', 
            helm: 'Lightning Resist +30%', 
            armor: 'Lightning Resist +30%', 
            shield: 'Lightning Resist +35%' 
          }
        },
        'thul': { 
          name: 'Thul Rune', 
          img: 'img/thulrune.png', 
          stats: { 
            weapon: 'Adds 3-14 Cold Damage', 
            helm: 'Cold Resist +30%', 
            armor: 'Cold Resist +30%', 
            shield: 'Cold Resist +35%' 
          }
        },
        'amn': { 
          name: 'Amn Rune', 
          img: 'img/amnrune.png', 
          stats: { 
            weapon: '7% Life Stolen per Hit', 
            helm: 'Attacker Takes Damage of 14', 
            armor: 'Attacker Takes Damage of 14', 
            shield: 'Attacker Takes Damage of 14' 
          }
        },
        'sol': { 
          name: 'Sol Rune', 
          img: 'img/solrune.png', 
          stats: { 
            weapon: '+9 to Minimum Damage', 
            helm: 'Physical Damage Taken Reduced by 7', 
            armor: 'Physical Damage Taken Reduced by 7', 
            shield: 'Physical Damage Taken Reduced by 7' 
          }
        },
        'shael': { 
          name: 'Shael Rune', 
          img: 'img/shaelrune.png', 
          stats: { 
            weapon: '+20% Increased Attack Speed', 
            helm: '+20% Faster Hit Recovery', 
            armor: '+20% Faster Hit Recovery', 
            shield: '+20% Faster Block Rate' 
          }
        },
        'dol': { 
          name: 'Dol Rune', 
          img: 'img/dolrune.png', 
          stats: { 
            weapon: '+20% Enhanced Damage', 
            helm: 'Replenish Life +10', 
            armor: 'Replenish Life +10', 
            shield: 'Replenish Life +10' 
          }
        },
        'hel': { 
          name: 'Hel Rune', 
          img: 'img/helrune.png', 
          stats: { 
            weapon: 'Requirements -20%', 
            helm: 'Requirements -20%', 
            armor: 'Requirements -20%', 
            shield: 'Requirements -20%' 
          }
        },
        'io': { 
          name: 'Io Rune', 
          img: 'img/iorune.png', 
          stats: { 
            weapon: '+10 to Vitality', 
            helm: '+10 to Vitality', 
            armor: '+10 to Vitality', 
            shield: '+10 to Vitality' 
          }
        },
        'lum': { 
          name: 'Lum Rune', 
          img: 'img/lumrune.png', 
          stats: { 
            weapon: '+10 to Energy', 
            helm: '+10 to Energy', 
            armor: '+10 to Energy', 
            shield: '+10 to Energy' 
          }
        },
        'ko': { 
          name: 'Ko Rune', 
          img: 'img/korune.png', 
          stats: { 
            weapon: '+10 to Dexterity', 
            helm: '+10 to Dexterity', 
            armor: '+10 to Dexterity', 
            shield: '+10 to Dexterity' 
          }
        },
        'fal': { 
          name: 'Fal Rune', 
          img: 'img/falrune.png', 
          stats: { 
            weapon: '+10 to Strength', 
            helm: '+10 to Strength', 
            armor: '+10 to Strength', 
            shield: '+10 to Strength' 
          }
        },
        'lem': { 
          name: 'Lem Rune', 
          img: 'img/lemrune.png', 
          stats: { 
            weapon: '75% Extra Gold From Monsters', 
            helm: '50% Extra Gold From Monsters', 
            armor: '50% Extra Gold From Monsters', 
            shield: '50% Extra Gold From Monsters' 
          }
        },
        'pul': { 
          name: 'Pul Rune', 
          img: 'img/pulrune.png', 
          stats: { 
            weapon: '+75% Damage to Demons, +100 to Attack Rating against Demons', 
            helm: '+30% Enhanced Defense', 
            armor: '+30% Enhanced Defense', 
            shield: '+30% Enhanced Defense' 
          }
        },
        'um': { 
          name: 'Um Rune', 
          img: 'img/umrune.png', 
          stats: { 
            weapon: '10% Chance of Open Wounds, +120 Open Wounds Damage per Second', 
            helm: 'All Resistances +15', 
            armor: 'All Resistances +15', 
            shield: 'All Resistances +22' 
          }
        },
        'mal': { 
          name: 'Mal Rune', 
          img: 'img/malrune.png', 
          stats: { 
            weapon: 'Prevent Monster Heal', 
            helm: 'Magic Damage Taken Reduced by 7', 
            armor: 'Magic Damage Taken Reduced by 7', 
            shield: 'Magic Damage Taken Reduced by 7' 
          }
        },
        'ist': { 
          name: 'Ist Rune', 
          img: 'img/istrune.png', 
          stats: { 
            weapon: '30% Better Chance of Getting Magic Items', 
            helm: '30% Better Chance of Getting Magic Items', 
            armor: '30% Better Chance of Getting Magic Items', 
            shield: '30% Better Chance of Getting Magic Items' 
          }
        },
        'gul': { 
          name: 'Gul Rune', 
          img: 'img/gulrune.png', 
          stats: { 
            weapon: '20% Bonus to Attack Rating', 
            helm: '+4% to Maximum Poison Resist', 
            armor: '+4% to Maximum Poison Resist', 
            shield: '+4% to Maximum Poison Resist' 
          }
        },
        'vex': { 
          name: 'Vex Rune', 
          img: 'img/vexrune.png', 
          stats: { 
            weapon: '7% Mana Stolen per Hit', 
            helm: '+4% to Maximum Fire Resist', 
            armor: '+4% to Maximum Fire Resist', 
            shield: '+4% to Maximum Fire Resist' 
          }
        },
        'ohm': { 
          name: 'Ohm Rune', 
          img: 'img/ohmrune.png', 
          stats: { 
            weapon: '+45% Enhanced Damage', 
            helm: '+4% to Maximum Cold Resist', 
            armor: '+4% to Maximum Cold Resist', 
            shield: '+4% to Maximum Cold Resist' 
          }
        },
        'lo': { 
          name: 'Lo Rune', 
          img: 'img/lorune.png', 
          stats: { 
            weapon: '20% Deadly Strike', 
            helm: '+4% to Maximum Lightning Resist', 
            armor: '+4% to Maximum Lightning Resist', 
            shield: '+4% to Maximum Lightning Resist' 
          }
        },
        'sur': { 
          name: 'Sur Rune', 
          img: 'img/surrune.png', 
          stats: { 
            weapon: '+4 Life after each Kill', 
            helm: 'Increase Maximum Mana 5%', 
            armor: 'Increase Maximum Mana 5%', 
            shield: '50 to Mana' 
          }
        },
        'ber': { 
          name: 'Ber Rune', 
          img: 'img/berrune.png', 
          stats: { 
            weapon: '20% Chance of Crushing Blow', 
            helm: 'Physical Damage Taken Reduced by 5%', 
            armor: 'Physical Damage Taken Reduced by 5%', 
            shield: 'Physical Damage Taken Reduced by 5%' 
          }
        },
        'jah': { 
          name: 'Jah Rune', 
          img: 'img/jahrune.png', 
          stats: { 
            weapon: 'Ignore Target\'s Defense', 
            helm: 'Increase Maximum Life 5%', 
            armor: 'Increase Maximum Life 5%', 
            shield: '+75 to Life' 
          }
        },
        'cham': { 
          name: 'Cham Rune', 
          img: 'img/chamrune.png', 
          stats: { 
            weapon: 'Freezes Target +3', 
            helm: 'Cannot Be Frozen', 
            armor: 'Cannot Be Frozen', 
            shield: 'Cannot Be Frozen' 
          }
        },
        'zod': { 
          name: 'Zod Rune', 
          img: 'img/zodrune.png', 
          stats: { 
            weapon: 'Indestructible', 
            helm: 'Indestructible', 
            armor: 'Indestructible', 
            shield: 'Indestructible' 
          }
        }
      },
      jewels: {
        'rare-jewel': { 
          name: 'Rare Jewel', 
          img: 'img/jewel1.png', 
          stats: { 
            weapon: '+15% Enhanced Damage', 
            helm: '+15% Enhanced Damage', 
            armor: '+15% Enhanced Damage', 
            shield: '+15% Enhanced Damage' 
          }
        }
      }
    };
    
    this.currentSocket = null;
    this.targetSocket = null;

    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.initializeSocketSystem();
    this.addLevelValidationStyles();
    this.createJewelModal();
    this.calculateAllStats();
    console.log('📊 Clean Stats Calculator with Complete Socket System initialized');
  }
  
  // ========== LEVEL REQUIREMENT METHODS ==========
  calculateActualRequiredLevel(section, selectedItem) {
    if (!selectedItem || !itemList[selectedItem]) return 1;
    
    const baseItem = itemList[selectedItem];
    const baseLevel = baseItem.properties?.reqlvl || 1;
    
    // Find all sockets for this section
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    
    let highestLevel = baseLevel;
    
    // Check each socket's level requirement
    sockets.forEach(socket => {
      const itemKey = socket.dataset.itemKey;
      const category = socket.dataset.category;
      
      if (this.socketData?.[category]?.[itemKey]?.levelReq) {
        const socketLevel = this.socketData[category][itemKey].levelReq;
        if (socketLevel > highestLevel) {
          highestLevel = socketLevel;
        }
      }
    });
    
    return highestLevel;
  }

  checkLevelRequirement(requiredLevel) {
    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
    return currentLevel >= requiredLevel;
  }

  // ========== SOCKET SYSTEM METHODS ==========
  initializeSocketSystem() {
    this.createSocketModal();
    this.addSocketStyles();
    this.setupSocketEventListeners();
    this.initializeSocketContainers();
  }
  
  createSocketModal() {
    // Remove existing modal
    const existing = document.getElementById('socketModal');
    if (existing) existing.remove();
    
    const modalHTML = `
      <div id="socketModal" class="socket-modal" style="display: none;">
        <div class="socket-modal-content">
          <span class="socket-close">&times;</span>
          <h3>Select Socket Item</h3>
          <div class="socket-categories">
            <button class="socket-category-tab active" data-category="gems">Gems</button>
            <button class="socket-category-tab" data-category="runes">Runes</button>
            <button class="socket-category-tab" data-category="jewels">Jewels</button>
          </div>
          <div id="socketItemGrid" class="socket-item-grid"></div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.populateSocketItems('gems');
  }
  
  addSocketStyles() {
    if (document.getElementById('socket-styles')) return;
    
    const styles = `
      <style id="socket-styles">
        .socket-modal {
          position: fixed;
          z-index: 10000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .socket-modal-content {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 2px solid #0f3460;
          border-radius: 10px;
          padding: 20px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .socket-close {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 28px;
          color: #aaa;
          cursor: pointer;
        }
        
        .socket-categories {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .socket-category-tab {
          padding: 8px 16px;
          background: #2a2a4e;
          border: 1px solid #0f3460;
          color: #fff;
          cursor: pointer;
          border-radius: 5px;
        }
        
        .socket-category-tab.active {
          background: #0f3460;
        }
        
        .socket-item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .socket-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          background: #2a2a4e;
          border: 1px solid #0f3460;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .socket-item:hover {
          background: #3a3a6e;
          transform: translateY(-2px);
        }
        
        .socket-item img {
          width: 32px;
          height: 32px;
          margin-bottom: 5px;
        }
        
        .socket-item-name {
          font-size: 10px;
          text-align: center;
          color: #fff;
        }
        
        .socket-container {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .socket-grid {
          display: flex;
          gap: 3px;
        }
        
        .socket-slot {
          width: 25px;
          height: 25px;
          border: 1px solid #555;
          background: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.2s;
        }
        
        .socket-slot:hover {
          border-color: #888;
          background: #333;
        }
        
        .socket-slot.filled {
          background: #444;
          border-color: #777;
        }
        
        .socket-slot.filled img {
          width: 20px;
          height: 20px;
        }
        
        .socket-slot.empty::after {
          content: '+';
          color: #666;
          font-size: 14px;
        }
        
        .add-socket-btn {
          background: #0f3460;
          border: 1px solid #1a5490;
          color: #fff;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .add-socket-btn:hover {
          background: #1a5490;
        }
        
        .socket-enhanced-stat {
          color: #00BFFF !important;
          font-weight: bold !important;
          text-shadow: 0 0 3px rgba(0, 191, 255, 0.3);
          border-left: 2px solid #00BFFF;
          padding-left: 4px;
          margin-left: 2px;
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }
  
  addLevelValidationStyles() {
    if (document.getElementById('level-validation-styles')) return;
    
    const styles = `
      <style id="level-validation-styles">
        .level-requirement-met {
          color: #00ff00 !important;
          font-weight: bold;
        }
        
        .level-requirement-not-met {
          color: #ff5555 !important;
          font-weight: bold;
          text-shadow: 0 0 3px rgba(255, 85, 85, 0.5);
        }
        
        .item-unusable {
          opacity: 0.6;
          filter: grayscale(50%);
          border: 1px solid #ff5555;
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }
  
  setupSocketEventListeners() {
    // Socket slot clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('socket-slot')) {
        this.currentSocket = e.target;
        this.showSocketModal();
      }
    });

    // Modal close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('socket-close') || e.target.id === 'socketModal') {
        this.hideSocketModal();
      }
    });

    // Tab switching
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('socket-category-tab')) {
        document.querySelectorAll('.socket-category-tab').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        this.populateSocketItems(e.target.dataset.category);
      }
    });

    // Socket item selection
    document.addEventListener('click', (e) => {
      if (e.target.closest('.socket-item') && !e.target.closest('.custom-jewel-item')) {
        const item = e.target.closest('.socket-item');
        const itemKey = item.dataset.itemKey;
        const category = item.dataset.category;
        this.socketItem(itemKey, category);
      }
    });

    // Add socket button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-socket-btn')) {
        const container = e.target.closest('.socket-container');
        if (container && container.dataset.section) {
          this.addSocket(container.dataset.section);
        }
      }
    });

    // Remove socketed items
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG' && e.target.closest('.socket-slot.filled')) {
        const socket = e.target.closest('.socket-slot');
        this.removeSocketedItem(socket);
      }
    });
  }

  initializeSocketContainers() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots'];
    
    sections.forEach(section => {
      const infoDiv = document.getElementById(`${section === 'shield' ? 'off' : section}-info`);
      if (infoDiv && !infoDiv.parentElement.querySelector('.socket-container')) {
        const socketContainer = document.createElement('div');
        socketContainer.className = 'socket-container';
        socketContainer.dataset.section = section;
        
        const socketGrid = document.createElement('div');
        socketGrid.className = 'socket-grid sockets-0';
        
        const addButton = document.createElement('button');
        addButton.className = 'add-socket-btn';
        addButton.textContent = '+';
        
        socketContainer.appendChild(socketGrid);
        socketContainer.appendChild(addButton);
        infoDiv.parentElement.appendChild(socketContainer);
      }
    });
  }
  
  populateSocketItems(category) {
    const grid = document.getElementById('socketItemGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (category === 'jewels') {
      // Add custom jewel creation option first
      const customJewelDiv = document.createElement('div');
      customJewelDiv.className = 'socket-item custom-jewel-item';
      customJewelDiv.innerHTML = `
        <img src="img/jewel1.png" alt="Custom Jewel" onerror="this.src='img/placeholder.png'">
        <div class="socket-item-name">Create Custom</div>
      `;
      customJewelDiv.addEventListener('click', () => {
        if (!this.currentSocket) {
          alert('Error: No socket selected. Please try clicking the socket again.');
          return;
        }
        this.targetSocket = this.currentSocket;
        this.hideSocketModal();
        this.showJewelModal();
      });
      grid.appendChild(customJewelDiv);
    }
    
    const items = this.socketData[category];
    for (const [key, item] of Object.entries(items)) {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'socket-item';
      itemDiv.dataset.itemKey = key;
      itemDiv.dataset.category = category;
      
      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}" onerror="this.src='img/placeholder.png'">
        <div class="socket-item-name">${item.name}</div>
      `;
      
      grid.appendChild(itemDiv);
    }
  }
  
  showSocketModal() {
    const modal = document.getElementById('socketModal');
    if (modal) modal.style.display = 'flex';
  }

  hideSocketModal() {
    const modal = document.getElementById('socketModal');
    if (modal) modal.style.display = 'none';
    this.currentSocket = null;
  }
  
  socketItem(itemKey, category) {
    if (!this.currentSocket) return;
    
    const item = this.socketData[category][itemKey];
    const section = this.currentSocket.closest('.socket-container')?.dataset.section || 'weapon';
    const stat = item.stats[section] || item.stats.weapon;
    
    // Update socket appearance
    this.currentSocket.classList.remove('empty');
    this.currentSocket.classList.add('filled');
    this.currentSocket.innerHTML = `<img src="${item.img}" alt="${item.name}" onerror="this.src='img/placeholder.png'">`;
    
    // Store socket data INCLUDING level requirement
    this.currentSocket.dataset.itemKey = itemKey;
    this.currentSocket.dataset.category = category;
    this.currentSocket.dataset.itemName = item.name;
    this.currentSocket.dataset.stats = stat;
    this.currentSocket.dataset.levelReq = item.levelReq || 1;
    
    this.hideSocketModal();
    
    // 🔥 FORCE immediate display update with new level requirements
    this.updateItemDisplay(section);
    
    setTimeout(() => {
      this.calculateAllStats();
      console.log('✅ Socket item complete - all systems updated');
    }, 50);
  }

  removeSocketedItem(socket) {
    // Clear socket data
    socket.classList.remove('filled');
    socket.classList.add('empty');
    socket.innerHTML = '';
    
    // Clear datasets
    delete socket.dataset.itemKey;
    delete socket.dataset.category;
    delete socket.dataset.itemName;
    delete socket.dataset.stats;
    delete socket.dataset.levelReq;
    
    // Get section for updates
    const section = socket.closest('.socket-container')?.dataset.section || 'weapon';
    
    // Update displays and recalculate stats
    this.updateItemDisplay(section);
    
    setTimeout(() => {
      this.calculateAllStats();
      console.log('🗑️ Socket cleared - all systems updated');
    }, 50);
  }

  addSocket(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) return;
    
    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) return;
    
    const existingSockets = socketGrid.querySelectorAll('.socket-slot').length;
    const maxSockets = 6;
    
    if (existingSockets >= maxSockets) {
      console.log(`Max sockets reached for ${section}: ${maxSockets}`);
      return;
    }
    
    const newSocket = document.createElement('div');
    newSocket.className = 'socket-slot empty';
    newSocket.dataset.index = existingSockets.toString();
    
    socketGrid.appendChild(newSocket);
    
    const newSocketCount = existingSockets + 1;
    socketGrid.className = `socket-grid sockets-${newSocketCount}`;
    
    console.log(`Added socket to ${section}: ${newSocketCount}/${maxSockets}`);
  }

  // ========== ITEM DISPLAY METHODS ==========
  updateItemDisplay(section) {
    const infoIdMap = {
      'weapon': 'weapon-info',
      'helm': 'helm-info', 
      'armor': 'armor-info',
      'shield': 'off-info',
      'gloves': 'glove-info',
      'belts': 'belt-info',
      'boots': 'boot-info'
    };
    
    const dropdownIdMap = {
      'weapon': 'weapons-dropdown',
      'helm': 'helms-dropdown',
      'armor': 'armors-dropdown', 
      'shield': 'offs-dropdown',
      'gloves': 'gloves-dropdown',
      'belts': 'belts-dropdown',
      'boots': 'boots-dropdown'
    };
    
    const infoDiv = document.getElementById(infoIdMap[section]);
    if (!infoDiv) return;
    
    const dropdown = document.getElementById(dropdownIdMap[section]);
    let baseHtml = '';
    
    if (dropdown && dropdown.value && typeof itemList !== 'undefined' && itemList[dropdown.value]) {
      const baseItem = itemList[dropdown.value];
      baseHtml = baseItem.description;
      
      // 🔥 ALWAYS calculate and enforce the highest required level
      const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
      const meetsRequirement = this.checkLevelRequirement(actualRequiredLevel);
      
      // 🎯 Create the level requirement line with proper color
      const levelColor = meetsRequirement ? '#00ff00' : '#ff5555';
      const levelRequirementLine = `<span style="color: ${levelColor}; font-weight: bold;">Required Level: ${actualRequiredLevel}</span>`;
      
      // Update level requirement in description EVERY TIME with color
      const levelRegex = /<span[^>]*>Required Level: \d+<\/span>|Required Level: \d+/i;
      if (levelRegex.test(baseHtml)) {
        baseHtml = baseHtml.replace(levelRegex, levelRequirementLine);
      } else {
        // Add level requirement if it doesn't exist
        const lines = baseHtml.split('<br>');
        lines.splice(2, 0, levelRequirementLine);
        baseHtml = lines.join('<br>');
      }
      
      // 🔥 If player doesn't meet level requirement, gray out the entire item
      if (!meetsRequirement) {
        infoDiv.style.opacity = '0.6';
        infoDiv.style.filter = 'grayscale(50%)';
        infoDiv.title = `You need level ${actualRequiredLevel} to use this item`;
      } else {
        infoDiv.style.opacity = '1';
        infoDiv.style.filter = 'none';
        infoDiv.title = '';
      }
      
      console.log(`📊 Updated ${section} display - required level: ${actualRequiredLevel} (${meetsRequirement ? 'MET' : 'NOT MET'})`);
    }
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);

if (sockets.length > 0) {
  // Add all socket stats as enhanced stats
  sockets.forEach(socket => {
    const stats = socket.dataset.stats;
    if (stats) {
      // Handle multiple stats (some socket items have multiple properties)
      const statLines = stats.split(/[,\n]/).map(s => s.trim()).filter(s => s);
      statLines.forEach(statLine => {
        if (statLine) {
          baseHtml += `<br><span class="socket-enhanced-stat">${statLine}</span>`;
        }
      });
    }
  });
}


    infoDiv.innerHTML = baseHtml;
  }

  // Update ALL equipment displays when level changes
  updateAllEquipmentDisplays() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots'];
    sections.forEach(section => {
      this.updateItemDisplay(section);
    });
  }

  updateSocketsForItem(section) {
    const dropdownIdMap = {
      'weapon': 'weapons-dropdown',
      'helm': 'helms-dropdown',
      'armor': 'armors-dropdown',
      'shield': 'offs-dropdown',
      'gloves': 'gloves-dropdown',
      'belts': 'belts-dropdown',
      'boots': 'boots-dropdown'
    };
    
    const dropdownId = dropdownIdMap[section];
    const dropdown = document.getElementById(dropdownId);
    
    if (!dropdown) return;
    
    const selectedItem = dropdown.value;
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    const socketGrid = container?.querySelector('.socket-grid');
    
    if (!container || !socketGrid) return;
    
    // Clear existing sockets when item changes
    socketGrid.innerHTML = '';
    
    // If no item selected, hide sockets
    if (!selectedItem || selectedItem === '') {
      socketGrid.className = 'socket-grid sockets-0';
      return;
    }
    
    // Default to 2 sockets for items
    const defaultSocketCount = 2;
    
    // Create socket slots
    for (let i = 0; i < defaultSocketCount; i++) {
      const socketSlot = document.createElement('div');
      socketSlot.className = 'socket-slot empty';
      socketSlot.dataset.index = i.toString();
      socketGrid.appendChild(socketSlot);
    }
    
    socketGrid.className = `socket-grid sockets-${defaultSocketCount}`;
  }
  
  // ========== EVENT LISTENERS ==========
  setupEventListeners() {
    // Equipment dropdown changes
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          const section = this.equipmentMap[dropdownId];
          this.updateSocketsForItem(section);
          this.calculateAllStats();
        });
      }
    });
    
    // Character stat changes
    ['str', 'dex', 'vit', 'enr'].forEach(statId => {
      const input = document.getElementById(statId);
      if (input) {
        input.addEventListener('input', () => this.calculateAllStats());
      }
    });
    
    // 🔥 SPECIAL handling for level changes - update ALL equipment displays
    const levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', () => {
        this.calculateAllStats();
        // Force update ALL equipment displays to show correct colors
        setTimeout(() => this.updateAllEquipmentDisplays(), 50);
      });
    }
    
    // Socket changes
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('socket-slot')) {
        setTimeout(() => this.calculateAllStats(), 100);
      }
    });
  }
  
  // ========== STATS CALCULATION ==========
  calculateAllStats() {
    this.resetStats();
    this.calculateEquipmentStats();
    this.calculateSocketStats();
    this.calculateCharmStats();
    this.calculateDerivedStats();
    this.updateDisplay();
  }
  
  resetStats() {
    Object.keys(this.stats).forEach(key => {
      if (key === 'cbf') {
        this.stats[key] = false;
      } else if (key === 'critHitMultiplier') {
        this.stats[key] = 2.0;
      } else {
        this.stats[key] = 0;
      }
    });
  }
  
  calculateEquipmentStats() {
    Object.entries(this.equipmentMap).forEach(([dropdownId, itemType]) => {
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown || !dropdown.value) return;
      
      const itemName = dropdown.value;
      if (typeof itemList === 'undefined' || !itemList[itemName]) return;
      
      const item = itemList[itemName];
      this.parseItemStats(item);
    });
  }
  
  parseItemStats(item) {
    if (!item.description) return;
    
    const desc = item.description;
    
    // Get Defense directly from properties
    if (item.properties && item.properties.defense) {
      this.stats.defense += item.properties.defense;
    }
    
    // Core Stats
    this.extractStat(desc, /\+(\d+) to All Skills/, 'allSkills');
    
    // Get Magic Find and Gold Find directly from properties first
    if (item.properties && item.properties.magicfind) {
      this.stats.magicFind += item.properties.magicfind;
    }
    if (item.properties && item.properties.goldfind) {
      this.stats.goldFind += item.properties.goldfind;
    }
    
    // Speed Stats
    this.extractStat(desc, /(\d+)%.*Faster Cast Rate/i, 'fcr');
    this.extractStat(desc, /(\d+)%.*Increased Attack Speed/i, 'ias');
    this.extractStat(desc, /(\d+)%.*Faster Run.*Walk/i, 'frw');
    this.extractStat(desc, /(\d+)%.*Faster Hit Recovery/i, 'fhr');
    
    // Defensive Stats
    this.extractStat(desc, /(\d+)%.*Damage Reduced/i, 'dr');
    this.extractStat(desc, /Physical Damage.*Reduced by (\d+)/i, 'pdr');
    this.extractStat(desc, /Magic Damage.*Reduced by (\d+)/i, 'mdr');
    this.extractStat(desc, /Poison Length Reduced by (\d+)%/i, 'plr');
    
    // Resistances
    this.extractStat(desc, /Fire Resist \+(\d+)%/i, 'fireResist');
    this.extractStat(desc, /Cold Resist \+(\d+)%/i, 'coldResist');
    this.extractStat(desc, /Lightning Resist \+(\d+)%/i, 'lightResist');
    this.extractStat(desc, /Poison Resist \+(\d+)%/i, 'poisonResist');
    
    // All Resistances
    const allResMatch = desc.match(/All Resistances \+(\d+)/i);
    if (allResMatch) {
      const value = parseInt(allResMatch[1]);
      this.stats.fireResist += value;
      this.stats.coldResist += value;
      this.stats.lightResist += value;
      this.stats.poisonResist += value;
    }
    
    // Combat Stats
    this.extractStat(desc, /(\d+)% Chance of Open Wounds/i, 'openWounds');
    this.extractStat(desc, /(\d+)% Chance of Crushing Blow/i, 'crushingBlow');
    this.extractStat(desc, /(\d+)% Chance of Critical Strike/i, 'criticalHit');
    this.extractStat(desc, /(\d+)% Chance of Deadly Strike/i, 'deadlyStrike');
    
    // Pierce stats
    this.extractStat(desc, /-(\d+)%.*Enemy.*Physical/i, 'piercePhys');
    this.extractStat(desc, /-(\d+)%.*Enemy.*Fire/i, 'pierceFire');
    this.extractStat(desc, /-(\d+)%.*Enemy.*Cold/i, 'pierceCold');
    this.extractStat(desc, /-(\d+)%.*Enemy.*Lightning/i, 'pierceLight');
    this.extractStat(desc, /-(\d+)%.*Enemy.*Poison/i, 'piercePoison');
    this.extractStat(desc, /-(\d+)%.*Enemy.*Magic/i, 'pierceMagic');
    
    // Added damage ranges
    this.extractDamageRange(desc, /Adds (\d+)-(\d+) Fire Damage/i, 'flatFire');
    this.extractDamageRange(desc, /Adds (\d+)-(\d+) Cold Damage/i, 'flatCold');
    this.extractDamageRange(desc, /Adds (\d+)-(\d+) Lightning Damage/i, 'flatLight');
    this.extractDamageRange(desc, /Adds (\d+)-(\d+) Poison Damage/i, 'flatPoison');
    this.extractDamageRange(desc, /Adds (\d+)-(\d+) Magic Damage/i, 'flatMagic');
    
    // Cannot Be Frozen
    if (desc.toLowerCase().includes('cannot be frozen')) {
      this.stats.cbf = true;
    }
  }
  
  extractStat(description, regex, statName) {
    const match = description.match(regex);
    if (match && this.stats.hasOwnProperty(statName)) {
      this.stats[statName] += parseInt(match[1]);
    }
  }
  
  extractDamageRange(description, regex, baseName) {
    const match = description.match(regex);
    if (match) {
      this.stats[baseName + 'Min'] += parseInt(match[1]);
      this.stats[baseName + 'Max'] += parseInt(match[2]);
    }
  }
  
  calculateSocketStats() {
    // Get stats from all filled sockets - CHECK LEVEL REQUIREMENTS FIRST
    const filledSockets = document.querySelectorAll('.socket-slot.filled');
    
    filledSockets.forEach(socket => {
      const stats = socket.dataset.stats;
      const itemKey = socket.dataset.itemKey;
      const category = socket.dataset.category;
      
      if (!stats) return;
      
      // CHECK LEVEL REQUIREMENTS BEFORE PROCESSING SOCKET STATS
      const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
      const parentSection = socket.closest('.socket-container')?.dataset.section;
      
      // Get the item that contains this socket
      let parentItem = null;
      if (parentSection) {
        const dropdown = document.getElementById(`${parentSection}s-dropdown`) || 
                       document.getElementById(`${parentSection}-dropdown`);
        if (dropdown?.value && itemList[dropdown.value]) {
          parentItem = itemList[dropdown.value];
        }
      }
      
      // If parent item doesn't meet level requirements, skip this socket's stats
      if (parentItem && parentItem.properties?.reqlvl) {
        if (currentLevel < parentItem.properties.reqlvl) {
          console.log(`🚫 Skipping socket stats - parent item level requirement not met: ${parentItem.properties.reqlvl} > ${currentLevel}`);
          return;
        }
      }
      
      // Also check if the socketed item itself has level requirements
      if (this.socketData?.[category]?.[itemKey]) {
        const socketedItem = this.socketData[category][itemKey];
        if (socketedItem.levelReq && currentLevel < socketedItem.levelReq) {
          console.log(`🚫 Skipping socket stats - socketed item level requirement not met: ${socketedItem.levelReq} > ${currentLevel}`);
          return;
        }
      }
      
      // Only process stats if level requirements are met
      this.parseSocketStats(stats);
    });
  }
  
  parseSocketStats(socketStats) {
    // Lightning damage
    let match = socketStats.match(/\+?(\d+)-(\d+) Lightning Damage/i);
    if (match) {
      this.stats.flatLightMin += parseInt(match[1]);
      this.stats.flatLightMax += parseInt(match[2]);
      return;
    }
    
    // Fire damage
    match = socketStats.match(/\+?(\d+)-(\d+) Fire Damage/i);
    if (match) {
      this.stats.flatFireMin += parseInt(match[1]);
      this.stats.flatFireMax += parseInt(match[2]);
      return;
    }
    
    // Cold damage
    match = socketStats.match(/\+?(\d+)-(\d+) Cold Damage/i);
    if (match) {
      this.stats.flatColdMin += parseInt(match[1]);
      this.stats.flatColdMax += parseInt(match[2]);
      return;
    }
    
    // Enhanced damage
    match = socketStats.match(/\+?(\d+)%.*Enhanced.*Damage/i);
    if (match) {
      this.stats.enhancedDamage += parseInt(match[1]);
      return;
    }
    
    // Attack Rating
    match = socketStats.match(/\+(\d+).*Attack Rating/i);
    if (match) {
      this.stats.attackRating += parseInt(match[1]);
      return;
    }
    
    // Life
    match = socketStats.match(/\+(\d+) to Life/i);
    if (match) {
      this.stats.life += parseInt(match[1]);
      return;
    }
    
    // Mana
    match = socketStats.match(/\+(\d+) to Mana/i);
    if (match) {
      this.stats.mana += parseInt(match[1]);
      return;
    }
    
    // Defense
    match = socketStats.match(/\+(\d+) Defense/i);
    if (match) {
      this.stats.defense += parseInt(match[1]);
      return;
    }
    
    // Resistances
    match = socketStats.match(/Fire Resist \+(\d+)%/i);
    if (match) {
      this.stats.fireResist += parseInt(match[1]);
      return;
    }
    
    match = socketStats.match(/Cold Resist \+(\d+)%/i);
    if (match) {
      this.stats.coldResist += parseInt(match[1]);
      return;
    }
    
    match = socketStats.match(/Lightning Resist \+(\d+)%/i);
    if (match) {
      this.stats.lightResist += parseInt(match[1]);
      return;
    }
    
    match = socketStats.match(/Poison Resist \+(\d+)%/i);
    if (match) {
      this.stats.poisonResist += parseInt(match[1]);
      return;
    }
    
    match = socketStats.match(/All Resistances \+(\d+)%?/i);
    if (match) {
      const value = parseInt(match[1]);
      this.stats.fireResist += value;
      this.stats.coldResist += value;
      this.stats.lightResist += value;
      this.stats.poisonResist += value;
      return;
    }
    
    // Attributes
    match = socketStats.match(/\+(\d+) to Strength/i);
    if (match) {
      this.stats.strength += parseInt(match[1]);
      return;
    }
    
    match = socketStats.match(/\+(\d+) to Dexterity/i);
    if (match) {
      this.stats.dexterity += parseInt(match[1]);
      return;
    }
    
    match = socketStats.match(/\+(\d+) to Vitality/i);
    if (match) {
      this.stats.vitality += parseInt(match[1]);
      return;
    }
    
    match = socketStats.match(/\+(\d+) to Energy/i);
    if (match) {
      this.stats.energy += parseInt(match[1]);
      return;
    }
    
    // Magic Find
    match = socketStats.match(/(\d+)%.*Better Chance.*Magic/i);
    if (match) {
      this.stats.magicFind += parseInt(match[1]);
      return;
    }
    
    // Gold Find
    match = socketStats.match(/(\d+)%.*Extra Gold/i);
    if (match) {
      this.stats.goldFind += parseInt(match[1]);
      return;
    }
    
    // IAS
    match = socketStats.match(/\+?(\d+)%.*Increased Attack Speed/i);
    if (match) {
      this.stats.ias += parseInt(match[1]);
      return;
    }
    
    // FHR
    match = socketStats.match(/\+?(\d+)%.*Faster Hit Recovery/i);
    if (match) {
      this.stats.fhr += parseInt(match[1]);
      return;
    }
    
    // FCR
    match = socketStats.match(/\+?(\d+)%.*Faster Cast Rate/i);
    if (match) {
      this.stats.fcr += parseInt(match[1]);
      return;
    }
  }
  
  calculateCharmStats() {
    const container = document.querySelector('.inventorycontainer');
    if (!container) return;
    
    // Get all charm slots with data
    const charmSlots = container.querySelectorAll('.charm1[data-charm-data]');
    const charmOverlays = container.querySelectorAll('.charm-overlay[data-charm-data]');
    
    // Process regular charm slots (small charms)
    charmSlots.forEach(slot => {
      const charmData = slot.dataset.charmData;
      if (charmData && charmData.trim()) {
        this.parseCharmStats(charmData);
      }
    });
    
    // Process overlay charms (large/grand charms)
    charmOverlays.forEach(overlay => {
      const charmData = overlay.dataset.charmData;
      if (charmData && charmData.trim()) {
        this.parseCharmStats(charmData);
      }
    });
  }

  parseCharmStats(charmData) {
    const lines = charmData.split('\n');
    
    // Skip the first line (charm name) and process stats
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      this.parseCharmStatLine(line);
    }
  }

  parseCharmStatLine(line) {
    // Core Stats
    this.extractStatFromLine(line, /\+(\d+) to All Skills/, 'allSkills');
    this.extractStatFromLine(line, /\+(\d+) to Strength/, 'strength');
    this.extractStatFromLine(line, /\+(\d+) to Dexterity/, 'dexterity');
    this.extractStatFromLine(line, /\+(\d+) to Vitality/, 'vitality');
    this.extractStatFromLine(line, /\+(\d+) to Energy/, 'energy');
    
    // Life and Mana
    this.extractStatFromLine(line, /\+(\d+) to Life/, 'life');
    this.extractStatFromLine(line, /\+(\d+) to Mana/, 'mana');
    
    // Resistances
    this.extractStatFromLine(line, /Fire Resist \+(\d+)%/, 'fireResist');
    this.extractStatFromLine(line, /Cold Resist \+(\d+)%/, 'coldResist');
    this.extractStatFromLine(line, /Lightning Resist \+(\d+)%/, 'lightResist');
    this.extractStatFromLine(line, /Poison Resist \+(\d+)%/, 'poisonResist');
    this.extractStatFromLine(line, /All Resistances \+(\d+)/, 'allResist');
    
    // Speed Stats
    this.extractStatFromLine(line, /(\d+)% Faster Cast Rate/, 'fcr');
    this.extractStatFromLine(line, /(\d+)% Increased Attack Speed/, 'ias');
    this.extractStatFromLine(line, /(\d+)% Faster Run\/Walk/, 'frw');
    this.extractStatFromLine(line, /(\d+)% Faster Hit Recovery/, 'fhr');
    
    // Magic Find and Gold Find
    this.extractStatFromLine(line, /(\d+)% Better Chance of Getting Magic Items/, 'magicFind');
    this.extractStatFromLine(line, /(\d+)% Extra Gold from Monsters/, 'goldFind');
    
    // Handle all resistances
    const allResMatch = line.match(/All Resistances \+(\d+)/);
    if (allResMatch) {
      const value = parseInt(allResMatch[1]);
      this.stats.fireResist += value;
      this.stats.coldResist += value;
      this.stats.lightResist += value;
      this.stats.poisonResist += value;
    }
  }

  extractStatFromLine(line, regex, statKey) {
    const match = line.match(regex);
    if (match) {
      const value = parseInt(match[1]);
      if (!isNaN(value)) {
        this.stats[statKey] += value;
      }
    }
  }
  
  calculateDerivedStats() {
    // Calculate derived stats
    this.stats.openWoundsDmg = this.calculateOpenWoundsDamage();
    this.stats.crushingBlowDmg = this.calculateCrushingBlowDamage();
    this.stats.critHitMultiplier = this.calculateCritMultiplier();
  }
  
  calculateOpenWoundsDamage() {
    const levelInput = document.getElementById('lvlValue');
    const level = levelInput ? parseInt(levelInput.value) || 1 : 1;
    return Math.floor(this.stats.openWounds * level * 0.8);
  }
  
  calculateCrushingBlowDamage() {
    return this.stats.crushingBlow > 0 ? 25 : 0;
  }
  
  calculateCritMultiplier() {
    return 2.0 + (this.stats.weaponMastery * 0.05);
  }

  updateDisplay() {
    // Core Stats
    this.updateContainer('allskillscontainer', this.stats.allSkills);
    this.updateContainer('magicfindcontainer', this.stats.magicFind);
    this.updateContainer('goldfindcontainer', this.stats.goldFind);
    
    // Defensive Stats
    this.updateContainer('defensecontainer', this.stats.defense);
    this.updateContainer('realblockcontainer', this.stats.blockChance);
    this.updateContainer('drcontainer', this.stats.dr);
    this.updateContainer('pdrcontainer', this.stats.pdr);
    this.updateContainer('mdrcontainer', this.stats.mdr);
    this.updateContainer('plrcontainer', this.stats.plr);
    this.updateContainer('cbfcontainer', this.stats.cbf ? 'Yes' : 'No');
    
    // Speed Stats
    this.updateContainer('iascontainer', this.stats.ias);
    this.updateContainer('fcrcontainer', this.stats.fcr);
    this.updateContainer('frwcontainer', this.stats.frw);
    this.updateContainer('fhrcontainer', this.stats.fhr);
    
    // Resistances
    this.updateContainer('fireresistcontainer', this.stats.fireResist);
    this.updateContainer('coldresistcontainer', this.stats.coldResist);
    this.updateContainer('lightresistcontainer', this.stats.lightResist);
    this.updateContainer('poisonresistcontainer', this.stats.poisonResist);
    this.updateContainer('curseresistcontainer', this.stats.curseResist);
    
    // Combat Stats
    this.updateContainer('owcontainer', this.stats.openWounds);
    this.updateContainer('owdmgcontainer', this.stats.openWoundsDmg);
    this.updateContainer('cbcontainer', this.stats.crushingBlow);
    this.updateContainer('cbdmgcontainer', this.stats.crushingBlowDmg);
    this.updateContainer('criticalhitcontainer', this.stats.criticalHit);
    this.updateContainer('deadlystrikecontainer', this.stats.deadlyStrike);
    this.updateContainer('weaponmasterycontainer', this.stats.weaponMastery);
    this.updateContainer('crithitmultipliercontainer', this.stats.critHitMultiplier.toFixed(1));
    
    // Pierce Stats
    this.updateContainer('piercephyscontainer', this.stats.piercePhys);
    this.updateContainer('piercefirecontainer', this.stats.pierceFire);
    this.updateContainer('piercecoldcontainer', this.stats.pierceCold);
    this.updateContainer('piercelightcontainer', this.stats.pierceLight);
    this.updateContainer('piercepoisoncontainer', this.stats.piercePoison);
    this.updateContainer('piercemagiccontainer', this.stats.pierceMagic);
    
    // Added Damage
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
  }
  
  updateContainer(containerId, value) {
    const container = document.getElementById(containerId);
    if (container) {
      if (typeof value === 'string') {
        container.textContent = value;
      } else {
        container.textContent = Math.round(value).toString();
      }
    }
  }

  // ========== JEWEL SYSTEM (SIMPLIFIED) ==========
  createJewelModal() {
    // Simplified jewel modal - just create basic structure
    const existingModal = document.getElementById('jewelModal');
    if (existingModal) existingModal.remove();
    
    const modalHTML = `
      <div id="jewelModal" class="socket-modal" style="display: none;">
        <div class="socket-modal-content">
          <span class="socket-close">&times;</span>
          <h3>Custom Jewel (Simplified)</h3>
          <p>This is a placeholder for the jewel creation system.</p>
          <button id="createSimpleJewel">Create +15% Enhanced Damage Jewel</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Simple jewel creation
    document.addEventListener('click', (e) => {
      if (e.target.id === 'createSimpleJewel') {
        this.createSimpleJewel();
      }
    });
  }

  showJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) modal.style.display = 'flex';
  }

  hideJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) modal.style.display = 'none';
    this.currentSocket = null;
    this.targetSocket = null;
  }

  createSimpleJewel() {
    const socketToUse = this.targetSocket || this.currentSocket;
    
    if (!socketToUse) {
      alert('No socket selected!');
      return;
    }
    
    // Update socket appearance
    socketToUse.classList.remove('empty');
    socketToUse.classList.add('filled');
    socketToUse.innerHTML = '<img src="img/jewel1.png" alt="Custom Jewel" style="width: 20px; height: 20px;">';
    
    // Store jewel data
    socketToUse.dataset.itemKey = 'custom-jewel';
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = 'Custom Jewel';
    socketToUse.dataset.stats = '+15% Enhanced Damage';
    socketToUse.dataset.levelReq = 1;
    
    // Update displays
    const section = socketToUse.closest('.socket-container')?.dataset.section || 'weapon';
    
    this.hideJewelModal();
    this.updateItemDisplay(section);
    this.calculateAllStats();
    
    this.targetSocket = null;
  }
  
  // Public method for external recalculation
  recalculate() {
    this.calculateAllStats();
  }
}

// Global initialization
let statsCalculator;

function initStatsCalculator() {
  if (statsCalculator) {
    console.warn('Stats calculator already exists');
    return;
  }
  
  statsCalculator = new StatsCalculator();
  
  // Make statsCalculator globally accessible
  window.statsCalculator = statsCalculator;
  
  // Global functions for external use
  window.recalculateStats = () => {
    if (statsCalculator) {
      statsCalculator.recalculate();
    }
  };
  
  window.getStats = () => {
    return statsCalculator ? statsCalculator.stats : null;
  };
}

// Multiple initialization approaches
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initStatsCalculator, 300);
  });
} else {
  setTimeout(initStatsCalculator, 300);
}

window.addEventListener('load', () => {
  setTimeout(initStatsCalculator, 400);
});

// Export for external use
window.StatsCalculator = StatsCalculator;