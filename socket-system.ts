// @ts-nocheck
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
    
    infoDiv.innerHTML = baseHtml;
  }

  // Update ALL equipment displays when level changes
  updateAllEquipmentDisplays() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots'];
    sections.forEach(section => {
      this.updateItemDisplay(section);
    });
  }

  // ========== SOCKET STAT STACKING METHODS ==========
  getSocketStatsForSection(section) {
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    const stackableStats = {};
    const pureSocketStats = [];
    
    sockets.forEach(socket => {
      const stats = socket.dataset.stats;
      if (stats) {
        const parsed = this.parseSocketStatForDisplay(stats);
        if (parsed.stackable) {
          if (!stackableStats[parsed.type]) {
            stackableStats[parsed.type] = {
              min: 0,
              max: 0,
              value: 0,
              unit: parsed.unit,
              displayName: parsed.displayName
            };
          }
          stackableStats[parsed.type].min += parsed.min || 0;
          stackableStats[parsed.type].max += parsed.max || 0;
          stackableStats[parsed.type].value += parsed.value || 0;
        } else {
          pureSocketStats.push(stats);
        }
      }
    });
    
    return { stackableStats, pureSocketStats };
  }
  
  parseSocketStatForDisplay(stat) {
    // Lightning damage
    let match = stat.match(/\+?(\d+)-(\d+) Lightning Damage/i);
    if (match) {
      return {
        stackable: true,
        type: 'lightning',
        min: parseInt(match[1]),
        max: parseInt(match[2]),
        displayName: 'Lightning Damage',
        unit: 'damage'
      };
    }
    
    // Fire damage
    match = stat.match(/\+?(\d+)-(\d+) Fire Damage/i);
    if (match) {
      return {
        stackable: true,
        type: 'fire',
        min: parseInt(match[1]),
        max: parseInt(match[2]),
        displayName: 'Fire Damage',
        unit: 'damage'
      };
    }
    
    // Cold damage
    match = stat.match(/\+?(\d+)-(\d+) Cold Damage/i);
    if (match) {
      return {
        stackable: true,
        type: 'cold',
        min: parseInt(match[1]),
        max: parseInt(match[2]),
        displayName: 'Cold Damage',
        unit: 'damage'
      };
    }
    
    // Enhanced Damage
    match = stat.match(/\+(\d+)% Enhanced Damage/i);
    if (match) {
      return {
        stackable: true,
        type: 'enhancedDamage',
        value: parseInt(match[1]),
        displayName: 'Enhanced Damage',
        unit: '%'
      };
    }
    
    // Resistances
    match = stat.match(/Fire Resist \+(\d+)%/i);
    if (match) {
      return {
        stackable: true,
        type: 'fireResist',
        value: parseInt(match[1]),
        displayName: 'Fire Resist',
        unit: '%'
      };
    }
    
    match = stat.match(/Cold Resist \+(\d+)%/i);
    if (match) {
      return {
        stackable: true,
        type: 'coldResist',
        value: parseInt(match[1]),
        displayName: 'Cold Resist',
        unit: '%'
      };
    }
    
    match = stat.match(/Lightning Resist \+(\d+)%/i);
    if (match) {
      return {
        stackable: true,
        type: 'lightResist',
        value: parseInt(match[1]),
        displayName: 'Lightning Resist',
        unit: '%'
      };
    }
    
    match = stat.match(/Poison Resist \+(\d+)%/i);
    if (match) {
      return {
        stackable: true,
        type: 'poisonResist',
        value: parseInt(match[1]),
        displayName: 'Poison Resist',
        unit: '%'
      };
    }
    
    // All Resistances
    match = stat.match(/All Resistances \+(\d+)%?/i);
    if (match) {
      return {
        stackable: true,
        type: 'allResist',
        value: parseInt(match[1]),
        displayName: 'All Resistances',
        unit: '%'
      };
    }
    
    // Magic Find
    match = stat.match(/(\d+)%.*Better Chance.*Magic/i);
    if (match) {
      return {
        stackable: true,
        type: 'magicFind',
        value: parseInt(match[1]),
        displayName: 'Better Chance of Getting Magic Items',
        unit: '%'
      };
    }
    
    // Life
    match = stat.match(/\+(\d+) to Life/i);
    if (match) {
      return {
        stackable: true,
        type: 'life',
        value: parseInt(match[1]),
        displayName: 'to Life',
        unit: ''
      };
    }
    
    // Mana
    match = stat.match(/\+(\d+) to Mana/i);
    if (match) {
      return {
        stackable: true,
        type: 'mana',
        value: parseInt(match[1]),
        displayName: 'to Mana',
        unit: ''
      };
    }
    
    // Defense
    match = stat.match(/\+(\d+) Defense/i);
    if (match) {
      return {
        stackable: true,
        type: 'defense',
        value: parseInt(match[1]),
        displayName: 'Defense',
        unit: ''
      };
    }
    
    // IAS
    match = stat.match(/\+?(\d+)%.*Increased Attack Speed/i);
    if (match) {
      return {
        stackable: true,
        type: 'ias',
        value: parseInt(match[1]),
        displayName: 'Increased Attack Speed',
        unit: '%'
      };
    }
    
    // FHR
    match = stat.match(/\+?(\d+)%.*Faster Hit Recovery/i);
    if (match) {
      return {
        stackable: true,
        type: 'fhr',
        value: parseInt(match[1]),
        displayName: 'Faster Hit Recovery',
        unit: '%'
      };
    }
    
    // FCR
    match = stat.match(/\+?(\d+)%.*Faster Cast Rate/i);
    if (match) {
      return {
        stackable: true,
        type: 'fcr',
        value: parseInt(match[1]),
        displayName: 'Faster Cast Rate',
        unit: '%'
      };
    }
    
    // Attributes
    match = stat.match(/\+(\d+)\s+(?:to\s+)?Strength/i);
    if (match) {
      return { 
        stackable: true, 
        type: 'strength', 
        value: parseInt(match[1]), 
        displayName: 'to Strength', 
        unit: '' 
      };
    }

    match = stat.match(/\+(\d+)\s+(?:to\s+)?Dexterity/i);
    if (match) {
      return { 
        stackable: true, 
        type: 'dexterity', 
        value: parseInt(match[1]), 
        displayName: 'to Dexterity', 
        unit: '' 
      };
    }

    match = stat.match(/\+(\d+)\s+(?:to\s+)?Vitality/i);
    if (match) {
      return { 
        stackable: true, 
        type: 'vitality', 
        value: parseInt(match[1]), 
        displayName: 'to Vitality', 
        unit: '' 
      };
    }

    match = stat.match(/\+(\d+)\s+(?:to\s+)?Energy/i);
    if (match) {
      return { 
        stackable: true, 
        type: 'energy', 
        value: parseInt(match[1]), 
        displayName: 'to Energy', 
        unit: '' 
      };
    }
    
    // Not stackable - return as pure socket stat
    return {
      stackable: false,
      original: stat
    };
  }
  
  itemHasProperty(itemHtml, statType) {
    const patterns = this.getStatPatterns(statType);
    return patterns.some(pattern => pattern.regex.test(itemHtml));
  }
  
  formatNewSocketStat(socketStat, type) {
    if (socketStat.min && socketStat.max) {
      // Damage ranges
      return `Adds ${socketStat.min}-${socketStat.max} ${socketStat.displayName}`;
    } else {
      // Single values
      switch (type) {
        case 'fireResist':
        case 'coldResist':
        case 'lightResist':
        case 'poisonResist':
          return `${socketStat.displayName} +${socketStat.value}%`;
        case 'allResist':
          return `All Resistances +${socketStat.value}`;
        case 'magicFind':
          return `${socketStat.value}% Better Chance of Getting Magic Items`;
        case 'life':
          return `+${socketStat.value} to Life`;
        case 'mana':
          return `+${socketStat.value} to Mana`;
        case 'defense':
          return `+${socketStat.value} Defense`;
        case 'enhancedDamage':
          return `+${socketStat.value}% Enhanced Damage`;
        case 'ias':
          return `${socketStat.value}% Increased Attack Speed`;
        case 'fhr':
          return `${socketStat.value}% Faster Hit Recovery`;
        case 'strength':
          return `+${socketStat.value} to Strength`;
        case 'dexterity':
          return `+${socketStat.value} to Dexterity`;
        case 'vitality':
          return `+${socketStat.value} to Vitality`;
        case 'energy':
          return `+${socketStat.value} to Energy`;
        case 'fcr':
          return `${socketStat.value}% Faster Cast Rate`;
        default:
          return `+${socketStat.value} ${socketStat.displayName}`;
      }
    }
  }
  
  mergeSocketStatsWithItem(itemHtml, socketStats) {
    let modifiedHtml = itemHtml;
    
    Object.entries(socketStats.stackableStats).forEach(([type, socketStat]) => {
      const patterns = this.getStatPatterns(type);
      
      patterns.forEach(pattern => {
        const match = modifiedHtml.match(pattern.regex);
        if (match) {
          let newValue;
          if (socketStat.min && socketStat.max) {
            // Damage ranges
            const existingMin = parseInt(match[1]);
            const existingMax = parseInt(match[2]);
            const newMin = existingMin + socketStat.min;
            const newMax = existingMax + socketStat.max;
            newValue = `${newMin}-${newMax}`;
          } else {
            // Single values
            const existingValue = parseInt(match[1]);
            const newTotal = existingValue + socketStat.value;
            newValue = newTotal.toString();
          }
          
          const replacement = pattern.replacement(newValue);
          modifiedHtml = modifiedHtml.replace(pattern.regex, `<span class="socket-enhanced-stat">${replacement}</span>`);
        }
      });
    });
    
    return modifiedHtml;
  }
  
  getStatPatterns(type) {
    const patterns = {
      lightning: [{
        regex: /Adds (\d+)-(\d+) Lightning Damage/i,
        replacement: (value) => `Adds ${value} Lightning Damage`
      }],
      fire: [{
        regex: /Adds (\d+)-(\d+) Fire Damage/i,
        replacement: (value) => `Adds ${value} Fire Damage`
      }],
      cold: [{
        regex: /Adds (\d+)-(\d+) Cold Damage/i,
        replacement: (value) => `Adds ${value} Cold Damage`
      }],
      fireResist: [{
        regex: /Fire Resist \+(\d+)%/i,
        replacement: (value) => `Fire Resist +${value}%`
      }],
      coldResist: [{
        regex: /Cold Resist \+(\d+)%/i,
        replacement: (value) => `Cold Resist +${value}%`
      }],
      lightResist: [{
        regex: /Lightning Resist \+(\d+)%/i,
        replacement: (value) => `Lightning Resist +${value}%`
      }],
      poisonResist: [{
        regex: /Poison Resist \+(\d+)%/i,
        replacement: (value) => `Poison Resist +${value}%`
      }],
      allResist: [{
        regex: /All Resistances \+(\d+)/i,
        replacement: (value) => `All Resistances +${value}`
      }],
      magicFind: [{
        regex: /(\d+)% Better Chance of Getting Magic Items/i,
        replacement: (value) => `${value}% Better Chance of Getting Magic Items`
      }],
      life: [{
        regex: /\+(\d+) to Life/i,
        replacement: (value) => `+${value} to Life`
      }],
      mana: [{
        regex: /\+(\d+) to Mana/i,
        replacement: (value) => `+${value} to Mana`
      }],
      defense: [{
        regex: /Defense: (\d+)/i,
        replacement: (value) => `Defense: ${value}`
      }],
      enhancedDamage: [{
        regex: /\+(\d+)% Enhanced Damage/i,
        replacement: (value) => `+${value}% Enhanced Damage`
      }],
      ias: [{
        regex: /(\d+)% Increased Attack Speed/i,
        replacement: (value) => `${value}% Increased Attack Speed`
      }],
      fhr: [{
        regex: /(\d+)% Faster Hit Recovery/i,
        replacement: (value) => `${value}% Faster Hit Recovery`
      }],
      strength: [{
        regex: /\+(\d+) to Strength/i,
        replacement: (value) => `+${value} to Strength`
      }],
      dexterity: [{
        regex: /\+(\d+) to Dexterity/i,
        replacement: (value) => `+${value} to Dexterity`
      }],
      vitality: [{
        regex: /\+(\d+) to Vitality/i,
        replacement: (value) => `+${value} to Vitality`
      }],
      energy: [{
        regex: /\+(\d+) to Energy/i,
        replacement: (value) => `+${value} to Energy`
      }],
      fcr: [{
        regex: /(\d+)% Faster Cast Rate/i,
        replacement: (value) => `${value}% Faster Cast Rate`
      }]
    };
    
    return patterns[type] || [];
  }
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

  // ========== COMPLETE JEWEL SYSTEM ==========
  createJewelModal() {
    const existingModal = document.getElementById('jewelModal');
    if (existingModal) existingModal.remove();
    
    const modalHTML = `
      <div id="jewelModal" class="socket-modal" style="display: none;">
        <div class="socket-modal-content" style="max-width: 600px; max-height: 90vh;">
          <span class="socket-close">&times;</span>
          <h3>Create Custom Jewel</h3>
          
          <div class="jewel-creation">
            <!-- Jewel Color Selection -->
            <div class="jewel-color-section" style="margin-bottom: 20px;">
              <h4 style="color: #0f3460; margin-bottom: 10px;">Jewel Color:</h4>
              <div class="jewel-colors" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div class="jewel-color-option selected" data-color="blue">
                  <img src="img/jewel1.png" alt="Blue Jewel" style="width: 32px; height: 32px; cursor: pointer; border: 2px solid #0f3460;">
                  <span>Blue</span>
                </div>
                <div class="jewel-color-option" data-color="red">
                  <img src="img/jewel2.png" alt="Red Jewel" style="width: 32px; height: 32px; cursor: pointer; border: 2px solid transparent;">
                  <span>Red</span>
                </div>
                <div class="jewel-color-option" data-color="green">
                  <img src="img/jewel3.png" alt="Green Jewel" style="width: 32px; height: 32px; cursor: pointer; border: 2px solid transparent;">
                  <span>Green</span>
                </div>
                <div class="jewel-color-option" data-color="yellow">
                  <img src="img/jewel4.png" alt="Yellow Jewel" style="width: 32px; height: 32px; cursor: pointer; border: 2px solid transparent;">
                  <span>Yellow</span>
                </div>
              </div>
            </div>
            
            <!-- Jewel Quality Selection -->
            <div class="jewel-quality-section" style="margin-bottom: 20px;">
              <h4 style="color: #0f3460; margin-bottom: 10px;">Jewel Quality:</h4>
              <div class="jewel-quality-options">
                <label style="display: block; margin-bottom: 5px;">
                  <input type="radio" name="jewelQuality" value="magic" checked> 
                  <span style="color: #4169E1;">Magic (1 prefix + 1 suffix)</span>
                </label>
                <label style="display: block; margin-bottom: 5px;">
                  <input type="radio" name="jewelQuality" value="rare"> 
                  <span style="color: #FFFF00;">Rare (up to 3 prefixes + 3 suffixes)</span>
                </label>
              </div>
            </div>
            
            <!-- Prefix Section -->
            <div class="prefix-section" style="margin-bottom: 20px;">
              <h4 style="color: #0f3460; margin-bottom: 10px;">Prefixes:</h4>
              <div class="affix-controls" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: end;">
                <div style="flex: 1;">
                  <select id="jewelPrefixSelect" style="width: 100%; padding: 5px; background: #2a2a4e; color: white; border: 1px solid #0f3460;">
                    <option value="">Select Prefix</option>
                  </select>
                </div>
                <div style="width: 80px;">
                  <input type="number" id="jewelPrefixValue" style="width: 100%; padding: 5px; background: #2a2a4e; color: white; border: 1px solid #0f3460;" placeholder="Value">
                </div>
                <button id="addJewelPrefix" style="padding: 5px 15px; background: #0f3460; color: white; border: none; cursor: pointer;">Add</button>
              </div>
              <div id="selectedPrefixes" class="selected-affixes"></div>
            </div>
            
            <!-- Suffix Section -->
            <div class="suffix-section" style="margin-bottom: 20px;">
              <h4 style="color: #0f3460; margin-bottom: 10px;">Suffixes:</h4>
              <div class="affix-controls" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: end;">
                <div style="flex: 1;">
                  <select id="jewelSuffixSelect" style="width: 100%; padding: 5px; background: #2a2a4e; color: white; border: 1px solid #0f3460;">
                    <option value="">Select Suffix</option>
                  </select>
                </div>
                <div style="width: 80px;">
                  <input type="number" id="jewelSuffixValue" style="width: 100%; padding: 5px; background: #2a2a4e; color: white; border: 1px solid #0f3460;" placeholder="Value">
                </div>
                <button id="addJewelSuffix" style="padding: 5px 15px; background: #0f3460; color: white; border: none; cursor: pointer;">Add</button>
              </div>
              <div id="selectedSuffixes" class="selected-affixes"></div>
            </div>
            
            <!-- Preview Section -->
            <div class="jewel-preview" style="margin-bottom: 20px;">
              <h4 style="color: #0f3460; margin-bottom: 10px;">Preview:</h4>
              <div id="jewelPreview" style="background: #2a2a4e; border: 1px solid #0f3460; padding: 15px; border-radius: 5px; min-height: 80px; color: white;">
                <div style="color: #4169E1; font-weight: bold;">Magic Jewel</div>
                <div style="color: #666; font-size: 12px; margin-top: 5px;">Select affixes to preview</div>
              </div>
            </div>
            
            <!-- Create Button -->
            <button id="createJewelBtn" style="width: 100%; padding: 12px; background: #0f3460; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              Create Jewel
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.addJewelModalStyles();
    this.setupJewelModalEvents();
    this.populateJewelAffixes();
    
    // Initialize
    this.selectedJewelColor = 'blue';
    this.selectedJewelImage = 'img/jewel1.png';
    this.selectedPrefixes = [];
    this.selectedSuffixes = [];
  }

  addJewelModalStyles() {
    if (document.getElementById('jewel-modal-styles')) return;
    
    const styles = `
      <style id="jewel-modal-styles">
        .jewel-colors {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .jewel-color-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          border-radius: 5px;
          transition: background 0.3s;
        }
        
        .jewel-color-option:hover {
          background: rgba(15, 52, 96, 0.3);
        }
        
        .jewel-color-option.selected img {
          border-color: #0f3460 !important;
        }
        
        .jewel-color-option span {
          color: white;
          font-size: 12px;
        }
        
        .selected-affixes {
          max-height: 120px;
          overflow-y: auto;
          background: rgba(15, 52, 96, 0.2);
          border-radius: 3px;
          padding: 8px;
          min-height: 40px;
        }
        
        .selected-affix {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(42, 42, 78, 0.8);
          padding: 5px 8px;
          margin-bottom: 5px;
          border-radius: 3px;
          color: #87CEEB;
          font-size: 12px;
        }
        
        .remove-affix-btn {
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .remove-affix-btn:hover {
          background: #c0392b;
        }
        
        .jewel-quality-options label {
          cursor: pointer;
          padding: 5px;
          border-radius: 3px;
          transition: background 0.3s;
        }
        
        .jewel-quality-options label:hover {
          background: rgba(15, 52, 96, 0.2);
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }

  setupJewelModalEvents() {
    // Color selection
    document.addEventListener('click', (e) => {
      if (e.target.closest('.jewel-color-option')) {
        const colorOption = e.target.closest('.jewel-color-option');
        const color = colorOption.dataset.color;
        const img = colorOption.querySelector('img').src;
        
        // Update selection
        document.querySelectorAll('.jewel-color-option').forEach(opt => opt.classList.remove('selected'));
        colorOption.classList.add('selected');
        
        this.selectedJewelColor = color;
        this.selectedJewelImage = img;
        this.updateJewelPreview();
      }
    });
    
    // Quality change
    document.addEventListener('change', (e) => {
      if (e.target.name === 'jewelQuality') {
        this.updateJewelPreview();
      }
    });
    
    // Add prefix
    document.addEventListener('click', (e) => {
      if (e.target.id === 'addJewelPrefix') {
        this.addJewelAffix('prefix');
      }
    });
    
    // Add suffix
    document.addEventListener('click', (e) => {
      if (e.target.id === 'addJewelSuffix') {
        this.addJewelAffix('suffix');
      }
    });
    
    // Remove affix
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-affix-btn')) {
        const type = e.target.dataset.type;
        const index = parseInt(e.target.dataset.index);
        this.removeJewelAffix(type, index);
      }
    });
    
    // Create jewel
    document.addEventListener('click', (e) => {
      if (e.target.id === 'createJewelBtn') {
        this.createCustomJewel();
      }
    });
    
    // Affix select changes
    document.addEventListener('change', (e) => {
      if (e.target.id === 'jewelPrefixSelect') {
        this.updateValueInput('prefix', e.target.value);
      } else if (e.target.id === 'jewelSuffixSelect') {
        this.updateValueInput('suffix', e.target.value);
      }
    });
  }

  populateJewelAffixes() {
    const prefixes = {
      'Cinnabar': { effect: '+[5-10]% Enhanced Damage', reqLevel: 1 },
      'Rusty': { effect: '+[11-20]% Enhanced Damage', reqLevel: 9 },
      'Realgar': { effect: '+[21-30]% Enhanced Damage', reqLevel: 37 },
      'Ruby': { effect: '+[31-40]% Enhanced Damage', reqLevel: 58 },
      'Stout': { effect: '+[5-8] Defense', reqLevel: 1 },
      'Burly': { effect: '+[9-20] Defense', reqLevel: 12 },
      'Bone': { effect: '+[21-40] Defense', reqLevel: 24 },
      'Ivory': { effect: '+[41-64] Defense', reqLevel: 56 },
      'Scarlet': { effect: '+[1-4] to Minimum Damage', reqLevel: 6 },
      'Crimson': { effect: '+[5-8] to Minimum Damage', reqLevel: 30 },
      'Cardinal': { effect: '+[10-14] to Minimum Damage', reqLevel: 30 },
      'Carbuncle': { effect: '+[1-5] to Maximum Damage', reqLevel: 9 },
      'Carmine': { effect: '+[6-9] to Maximum Damage', reqLevel: 27 },
      'Vermillion': { effect: '+[11-15] to Maximum Damage', reqLevel: 50 },
      'Nickel': { effect: '+[10-20] to Attack Rating', reqLevel: 1 },
      'Tin': { effect: '+[21-40] to Attack Rating', reqLevel: 6 },
      'Silver': { effect: '+[41-60] to Attack Rating', reqLevel: 18 },
      'Argent': { effect: '+[61-100] to Attack Rating', reqLevel: 36 },
      'Emerald': { effect: '[3-7]% Better Chance of Getting Magic Items', reqLevel: 12 },
      'Zircon': { effect: '+[5-10] to Mana', reqLevel: 2 },
      'Jacinth': { effect: '+[11-15] to Mana', reqLevel: 12 },
      'Turquoise': { effect: '+[16-20] to Mana', reqLevel: 21 },
      'Cerulean': { effect: '+[21-30] to Mana', reqLevel: 41 },
      'Shimmering': { effect: 'All Resistances +[5-10]', reqLevel: 12 },
      'Scintillating': { effect: 'All Resistances +[11-15]', reqLevel: 26 },
      'Lapis': { effect: 'Cold Resist +[5-15]%', reqLevel: 1 },
      'Sapphire': { effect: 'Cold Resist +[16-30]%', reqLevel: 14 }
    };
    
    const suffixes = {
      'Malice': { effect: 'Attacker Takes Damage of [30-40]', reqLevel: 29 },
      'Fervor': { effect: '+[15-15]% Increased Attack Speed', reqLevel: 31 },
      'Maiming': { effect: '[5-8]% Chance of Open Wounds', reqLevel: 24 },
      'Slaying': { effect: '[1-3]% Deadly Strike', reqLevel: 38 },
      'Gore': { effect: '[4-10]% Deadly Strike', reqLevel: 63 },
      'Carnage': { effect: '[11-15]% Deadly Strike', reqLevel: 77 },
      'Slaughter': { effect: '[16-20]% Deadly Strike', reqLevel: 85 },
      'Frost': { effect: 'Adds [1-3] to [4-6] Cold Damage', reqLevel: 6 },
      'Frigidity': { effect: 'Adds 1 to [3-5] Cold Damage', reqLevel: 12 },
      'Icicle': { effect: 'Adds [2-3] to [6-10] Cold Damage', reqLevel: 29 },
      'Glacier': { effect: 'Adds [4-5] to [11-15] Cold Damage', reqLevel: 50 },
      'Passion': { effect: 'Adds [1-3] to [6-10] Fire Damage', reqLevel: 11 },
      'Fire': { effect: 'Adds [4-10] to [11-30] Fire Damage', reqLevel: 28 },
      'Burning': { effect: 'Adds [11-25] to [31-50] Fire Damage', reqLevel: 49 },
      'Ennui': { effect: 'Adds 1-[10-20] Lightning Damage', reqLevel: 11 },
      'Lightning': { effect: 'Adds 1-[21-60] Lightning Damage', reqLevel: 28 },
      'Thunder': { effect: 'Adds 1-[61-100] Lightning Damage', reqLevel: 49 }
    };
    
    // Populate prefix dropdown
    const prefixSelect = document.getElementById('jewelPrefixSelect');
    if (prefixSelect) {
      for (const [name, data] of Object.entries(prefixes)) {
        const option = document.createElement('option');
        option.value = data.effect;
        option.textContent = `${name} - ${data.effect} [Lvl ${data.reqLevel}]`;
        prefixSelect.appendChild(option);
      }
    }
    
    // Populate suffix dropdown
    const suffixSelect = document.getElementById('jewelSuffixSelect');
    if (suffixSelect) {
      for (const [name, data] of Object.entries(suffixes)) {
        const option = document.createElement('option');
        option.value = data.effect;
        option.textContent = `${name} - ${data.effect} [Lvl ${data.reqLevel}]`;
        suffixSelect.appendChild(option);
      }
    }
  }

  updateValueInput(type, effect) {
    const valueInput = document.getElementById(`jewel${type.charAt(0).toUpperCase() + type.slice(1)}Value`);
    if (!valueInput || !effect) return;
    
    const range = this.extractJewelRange(effect);
    if (range) {
      valueInput.min = range.min;
      valueInput.max = range.max;
      valueInput.value = range.min;
      valueInput.style.display = 'block';
    } else {
      valueInput.style.display = 'none';
    }
  }

  extractJewelRange(effect) {
    const match = effect.match(/\[(\d+)-(\d+)\]/);
    if (match) {
      return {
        min: parseInt(match[1]),
        max: parseInt(match[2])
      };
    }
    return null;
  }

  addJewelAffix(type) {
    const select = document.getElementById(`jewel${type.charAt(0).toUpperCase() + type.slice(1)}Select`);
    const valueInput = document.getElementById(`jewel${type.charAt(0).toUpperCase() + type.slice(1)}Value`);
    const quality = document.querySelector('input[name="jewelQuality"]:checked').value;
    
    if (!select.value) return;
    
    const affixes = type === 'prefix' ? this.selectedPrefixes : this.selectedSuffixes;
    const maxAffixes = quality === 'rare' ? 3 : 1;
    const maxTotal = quality === 'rare' ? 6 : 2;
    
    // Check limits
    if (affixes.length >= maxAffixes) {
      alert(`Maximum ${maxAffixes} ${type}es for ${quality} jewels`);
      return;
    }
    
    if ((this.selectedPrefixes.length + this.selectedSuffixes.length) >= maxTotal) {
      alert(`Maximum ${maxTotal} total affixes for ${quality} jewels`);
      return;
    }
    
    const range = this.extractJewelRange(select.value);
    let value = null;
    
    if (range) {
      value = parseInt(valueInput.value);
      if (isNaN(value) || value < range.min || value > range.max) {
        alert(`Value must be between ${range.min} and ${range.max}`);
        return;
      }
    }
    
    // Create affix
    const effectText = range ? select.value.replace(/\[\d+-\d+\]/, value) : select.value;
    const affix = {
      template: select.value,
      effect: effectText,
      value: value,
      stat: effectText
    };
    
    affixes.push(affix);
    this.updateJewelAffixDisplay(type);
    this.updateJewelPreview();
    
    // Clear inputs
    select.value = '';
    valueInput.value = '';
    valueInput.style.display = 'none';
  }

  removeJewelAffix(type, index) {
    const affixes = type === 'prefix' ? this.selectedPrefixes : this.selectedSuffixes;
    affixes.splice(index, 1);
    this.updateJewelAffixDisplay(type);
    this.updateJewelPreview();
  }

  updateJewelAffixDisplay(type) {
    const container = document.getElementById(`selected${type.charAt(0).toUpperCase() + type.slice(1)}es`);
    const affixes = type === 'prefix' ? this.selectedPrefixes : this.selectedSuffixes;
    
    if (affixes.length === 0) {
      container.innerHTML = '<div style="color: #666; font-size: 12px;">No ' + type + 'es selected</div>';
      return;
    }
    
    container.innerHTML = affixes.map((affix, index) => `
      <div class="selected-affix">
        <span>${affix.effect}</span>
        <button class="remove-affix-btn" data-type="${type}" data-index="${index}">×</button>
      </div>
    `).join('');
  }

  updateJewelPreview() {
    const preview = document.getElementById('jewelPreview');
    const quality = document.querySelector('input[name="jewelQuality"]:checked').value;
    const qualityColor = quality === 'rare' ? '#FFFF00' : '#4169E1';
    const qualityName = quality === 'rare' ? 'Rare' : 'Magic';
    
    let html = `<div style="color: ${qualityColor}; font-weight: bold;">${qualityName} Jewel</div>`;
    
    // Add prefix effects
    this.selectedPrefixes.forEach(prefix => {
      html += `<div style="color: #87CEEB; font-size: 12px;">${prefix.effect}</div>`;
    });
    
    // Add suffix effects
    this.selectedSuffixes.forEach(suffix => {
      html += `<div style="color: #87CEEB; font-size: 12px;">${suffix.effect}</div>`;
    });
    
    if (this.selectedPrefixes.length === 0 && this.selectedSuffixes.length === 0) {
      html += '<div style="color: #666; font-size: 12px; margin-top: 5px;">Select affixes to preview</div>';
    }
    
    preview.innerHTML = html;
  }

  showJewelModal() {
    // Reset selections
    this.selectedPrefixes = [];
    this.selectedSuffixes = [];
    
    // Clear displays
    this.updateJewelAffixDisplay('prefix');
    this.updateJewelAffixDisplay('suffix');
    this.updateJewelPreview();
    
    // Reset color selection to blue
    document.querySelectorAll('.jewel-color-option').forEach(opt => opt.classList.remove('selected'));
    const blueOption = document.querySelector('.jewel-color-option[data-color="blue"]');
    if (blueOption) blueOption.classList.add('selected');
    this.selectedJewelColor = 'blue';
    this.selectedJewelImage = 'img/jewel1.png';
    
    // Show modal
    const modal = document.getElementById('jewelModal');
    if (modal) modal.style.display = 'flex';
  }

  hideJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) modal.style.display = 'none';
    this.currentSocket = null;
    this.targetSocket = null;
  }

  createCustomJewel() {
    const socketToUse = this.targetSocket || this.currentSocket;
    
    if (!socketToUse) {
      alert('No socket selected! Please click a socket first.');
      return;
    }
    
    const quality = document.querySelector('input[name="jewelQuality"]:checked').value;
    
    if (this.selectedPrefixes.length === 0 && this.selectedSuffixes.length === 0) {
      alert('Please add at least one affix');
      return;
    }
    
    // Combine all stats
    const stats = [
      ...this.selectedPrefixes.map(p => p.stat || p.effect),
      ...this.selectedSuffixes.map(s => s.stat || s.effect)
    ].join('\n');
    
    // Update socket appearance
    socketToUse.classList.remove('empty');
    socketToUse.classList.add('filled');
    
    // Create jewel image
    const img = document.createElement('img');
    img.src = this.selectedJewelImage || 'img/jewel1.png';
    img.alt = `${quality} Jewel`;
    img.style.width = '20px';
    img.style.height = '20px';
    
    socketToUse.innerHTML = '';
    socketToUse.appendChild(img);
    
    // Store jewel data
    socketToUse.dataset.itemKey = 'custom-jewel';
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = `${quality} Jewel`;
    socketToUse.dataset.stats = stats;
    socketToUse.dataset.levelReq = 1; // Custom jewels level 1 by default
    
    // Update displays
    const section = socketToUse.closest('.socket-container')?.dataset.section || 'weapon';
    
    this.hideJewelModal();
    this.updateItemDisplay(section);
    this.calculateAllStats();
    
    // Reset selections
    this.selectedPrefixes = [];
    this.selectedSuffixes = [];
    this.targetSocket = null;
    
    console.log('✅ Custom jewel created successfully!');
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