// Clean Stats Calculator System - With Complete Socket System
class StatsCalculator {
  constructor() {
      this.selectedJewelColor = 'white';
  this.selectedJewelPrefix = '';
  this.selectedJewelSuffix = '';
  this.currentJewelSocket = null;
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
      'ringsone-dropdown': 'ringone',
      'ringstwo-dropdown': 'ringtwo',
      'amulets-dropdown': 'amulet',
    };
    
    // Custom jewel prefixes and suffixes
    this.jewelPrefixes = {
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
    
    this.jewelSuffixes = {
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
    
    
    
    // Socket system data
    this.socketData = {
      gems: {
        'perfect-topaz': { 
          name: 'Perfect Topaz', 
          img: 'img/perfecttopaz.png', 
          levelReq: 18,
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
          levelReq: 18,
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
          levelReq: 18,
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
          levelReq: 18,
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
          levelReq: 18,
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
          levelReq: 18,
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
          levelReq: 15,
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
          levelReq: 17,
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
          levelReq: 21,
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
          levelReq: 23,
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
          levelReq: 25,
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
          levelReq: 27,
          stats: { 
            weapon: '+9 to Minimum Damage', 
            helm: 'Physical Damage Taken Reduced by 7', 
            armor: 'Physical Damage Taken Reduced by 7', 
            shield: 'Physical Damage Taken Reduced by 7' 
          }
        },
        'shael': { 
          name: 'Shael Rune', 
          levelReq: 29,
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
          levelReq: 31,
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
          levelReq: 1,
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
          levelReq: 35,
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
          levelReq: 37,
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
          levelReq: 39,
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
          levelReq: 41,
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
          levelReq: 43,
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
          levelReq: 45,
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
          levelReq: 47,
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
          levelReq: 49,
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
          levelReq: 51, 
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
          levelReq: 53,
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
          levelReq: 55,
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
          levelReq: 57,
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
          levelReq: 59, 
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
          levelReq: 61,
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
          levelReq: 63,
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
          levelReq: 65,
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
          levelReq: 67,
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
          levelReq: 69,
          stats: { 
            weapon: 'Indestructible', 
            helm: 'Indestructible', 
            armor: 'Indestructible', 
            shield: 'Indestructible' 
          }
        }
      },
      jewels: {
        'rare-jewel': { name: 'Rare Jewel', img: 'img/jewel1.png', levelReq: 1, stats: { weapon: '+15% Enhanced Damage', helm: '+15% Enhanced Damage', armor: '+15% Enhanced Damage', shield: '+15% Enhanced Damage' }, levelReq: 1 }
      }
    };
    
    this.currentSocket = null;
    this.targetSocket = null;
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.initializeSocketSystem();
    // this.addLevelValidationStyles();
    this.createJewelModal();
    this.calculateAllStats();
    console.log('📊 Enhanced Socket System with Custom Jewels initialized');
  }
  
  // ========== JEWEL CREATION SYSTEM ==========
  createJewelModal() {
    const existingModal = document.getElementById('jewelModal');
    if (existingModal) existingModal.remove();
    
    const modalHTML = `
      <div id="jewelModal" class="socket-modal" style="display: none;">
        <div class="socket-modal-content">
          <span class="socket-close">&times;</span>
          <h3>Create Custom Jewel</h3>
          
          <div class="jewel-creation-section">
            <h4>1. Choose Jewel Color</h4>
            <div class="jewel-color-selection">
              <div class="color-option selected" data-color="white" style="background: white; color: black;">White</div>
              <div class="color-option" data-color="blue" style="background: #4169E1; color: white;">Blue</div>
              <div class="color-option" data-color="yellow" style="background: #FFD700; color: black;">Yellow</div>
              <div class="color-option" data-color="green" style="background: #32CD32; color: black;">Green</div>
              <div class="color-option" data-color="orange" style="background: #FFA500; color: black;">Orange</div>
              <div class="color-option" data-color="red" style="background: #FF4500; color: white;">Red</div>
            </div>
            
            <h4>2. Choose Prefix (Optional)</h4>
            <select id="jewelPrefixSelect">
              <option value="">No Prefix</option>
              ${Object.entries(this.jewelPrefixes).map(([key, data]) => 
                `<option value="${key}">${key} - ${data.effect} (Level ${data.reqLevel})</option>`
              ).join('')}
            </select>
            <div id="prefixValueContainer" style="display: none;">
              <label for="prefixValue">Value:</label>
              <input type="range" id="prefixValue" min="1" max="10" value="5">
              <span id="prefixValueDisplay">5</span>
            </div>
            
            <h4>3. Choose Suffix (Optional)</h4>
            <select id="jewelSuffixSelect">
              <option value="">No Suffix</option>
              ${Object.entries(this.jewelSuffixes).map(([key, data]) => 
                `<option value="${key}">${key} - ${data.effect} (Level ${data.reqLevel})</option>`
              ).join('')}
            </select>
            <div id="suffixValueContainer" style="display: none;">
              <label for="suffixValue">Value:</label>
              <input type="range" id="suffixValue" min="1" max="10" value="5">
              <span id="suffixValueDisplay">5</span>
            </div>
            
            <div class="jewel-preview">
              <h4>Preview:</h4>
              <div id="jewelPreview">
                <div class="jewel-name" style="color: white;">White Jewel</div>
                <div class="jewel-stats">
                  <div id="jewelPrefixStat" style="display: none;"></div>
                  <div id="jewelSuffixStat" style="display: none;"></div>
                </div>
              </div>
            </div>
            
            <div class="jewel-actions">
              <button id="createJewelBtn">Create Jewel</button>
              <button id="cancelJewelBtn">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.setupJewelModalEvents();
  }
  
  setupJewelModalEvents() {
    // Color selection
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('color-option')) {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedJewelColor = e.target.dataset.color;
        this.updateJewelPreview();
      }
    });
    
    // Prefix selection
    document.addEventListener('change', (e) => {
      if (e.target.id === 'jewelPrefixSelect') {
        this.selectedJewelPrefix = e.target.value || null;
        this.updatePrefixValueInput();
        this.updateJewelPreview();
      }
    });
    
    // Suffix selection
    document.addEventListener('change', (e) => {
      if (e.target.id === 'jewelSuffixSelect') {
        this.selectedJewelSuffix = e.target.value || null;
        this.updateSuffixValueInput();
        this.updateJewelPreview();
      }
    });
    
    // Value sliders
    document.addEventListener('input', (e) => {
      if (e.target.id === 'prefixValue') {
        this.selectedJewelPrefixValue = e.target.value;
        document.getElementById('prefixValueDisplay').textContent = e.target.value;
        this.updateJewelPreview();
      } else if (e.target.id === 'suffixValue') {
        this.selectedJewelSuffixValue = e.target.value;
        document.getElementById('suffixValueDisplay').textContent = e.target.value;
        this.updateJewelPreview();
      }
    });
    
    // Create jewel button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'createJewelBtn') {
        this.createCustomJewel();
      } else if (e.target.id === 'cancelJewelBtn') {
        this.hideJewelModal();
      }
    });
  }
  
  updatePrefixValueInput() {
    const container = document.getElementById('prefixValueContainer');
    const valueInput = document.getElementById('prefixValue');
    const valueDisplay = document.getElementById('prefixValueDisplay');
    
    if (this.selectedJewelPrefix) {
      const prefixData = this.jewelPrefixes[this.selectedJewelPrefix];
      const range = this.extractValueRange(prefixData.effect);
      
      container.style.display = 'block';
      valueInput.min = range.min;
      valueInput.max = range.max;
      valueInput.value = range.min;
      valueDisplay.textContent = range.min;
      this.selectedJewelPrefixValue = range.min;
    } else {
      container.style.display = 'none';
      this.selectedJewelPrefixValue = null;
    }
  }
  
  updateSuffixValueInput() {
    const container = document.getElementById('suffixValueContainer');
    const valueInput = document.getElementById('suffixValue');
    const valueDisplay = document.getElementById('suffixValueDisplay');
    
    if (this.selectedJewelSuffix) {
      const suffixData = this.jewelSuffixes[this.selectedJewelSuffix];
      const range = this.extractValueRange(suffixData.effect);
      
      container.style.display = 'block';
      valueInput.min = range.min;
      valueInput.max = range.max;
      valueInput.value = range.min;
      valueDisplay.textContent = range.min;
      this.selectedJewelSuffixValue = range.min;
    } else {
      container.style.display = 'none';
      this.selectedJewelSuffixValue = null;
    }
  }
  
  extractValueRange(effect) {
    const match = effect.match(/\[(\d+)-(\d+)\]/);
    if (match) {
      return {
        min: parseInt(match[1]),
        max: parseInt(match[2])
      };
    }
    return { min: 1, max: 10 };
  }
  
  updateJewelPreview() {
    const preview = document.getElementById('jewelPreview');
    const jewelName = document.querySelector('.jewel-name');
    const prefixStat = document.getElementById('jewelPrefixStat');
    const suffixStat = document.getElementById('jewelSuffixStat');
    
    // Update jewel name color
    const colorMap = {
      'white': '#FFFFFF',
      'blue': '#4169E1',
      'yellow': '#FFD700',
      'green': '#32CD32',
      'orange': '#FFA500',
      'red': '#FF4500'
    };
    
    let jewelDisplayName = this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1);
    if (this.selectedJewelPrefix) {
      jewelDisplayName = `${this.selectedJewelPrefix} ${jewelDisplayName}`;
    }
    if (this.selectedJewelSuffix) {
      jewelDisplayName = `${jewelDisplayName} of ${this.selectedJewelSuffix}`;
    }
    jewelDisplayName += ' Jewel';
    
    jewelName.textContent = jewelDisplayName;
    jewelName.style.color = colorMap[this.selectedJewelColor];
    
    // Update prefix stat
    if (this.selectedJewelPrefix && this.selectedJewelPrefixValue) {
      const prefixData = this.jewelPrefixes[this.selectedJewelPrefix];
      const stat = prefixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefixValue);
      prefixStat.textContent = stat;
      prefixStat.style.display = 'block';
    } else {
      prefixStat.style.display = 'none';
    }
    
    // Update suffix stat
    if (this.selectedJewelSuffix && this.selectedJewelSuffixValue) {
      const suffixData = this.jewelSuffixes[this.selectedJewelSuffix];
      const stat = suffixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffixValue);
      suffixStat.textContent = stat;
      suffixStat.style.display = 'block';
    } else {
      suffixStat.style.display = 'none';
    }
  }
  
  createCustomJewel() {
    const socketToUse = this.targetSocket || this.currentSocket;
    
    if (!socketToUse) {
      alert('No socket selected! Please try clicking the socket again.');
      return;
    }
    
    // Calculate required level (highest of prefix/suffix)
    let requiredLevel = 1;
    if (this.selectedJewelPrefix) {
      requiredLevel = Math.max(requiredLevel, this.jewelPrefixes[this.selectedJewelPrefix].reqLevel);
    }
    if (this.selectedJewelSuffix) {
      requiredLevel = Math.max(requiredLevel, this.jewelSuffixes[this.selectedJewelSuffix].reqLevel);
    }
    
    // Create jewel stats array
    const stats = [];
    if (this.selectedJewelPrefix && this.selectedJewelPrefixValue) {
      const prefixData = this.jewelPrefixes[this.selectedJewelPrefix];
      const stat = prefixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefixValue);
      stats.push(stat);
    }
    if (this.selectedJewelSuffix && this.selectedJewelSuffixValue) {
      const suffixData = this.jewelSuffixes[this.selectedJewelSuffix];
      const stat = suffixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffixValue);
      stats.push(stat);
    }
    
    // Create jewel name
    let jewelName = this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1);
    if (this.selectedJewelPrefix) {
      jewelName = `${this.selectedJewelPrefix} ${jewelName}`;
    }
    if (this.selectedJewelSuffix) {
      jewelName = `${jewelName} of ${this.selectedJewelSuffix}`;
    }
    jewelName += ' Jewel';
    
    // Choose jewel image based on color
    const jewelImages = {
      'white': 'img/jewel1.png',
      'blue': 'img/jewel2.png',
      'yellow': 'img/jewel3.png',
      'green': 'img/jewel4.png',
      'orange': 'img/jewel5.png',
      'red': 'img/jewel6.png'
    };
    
    const jewelImage = jewelImages[this.selectedJewelColor] || 'img/jewel1.png';
    
    // Update socket appearance
    socketToUse.classList.remove('empty');
    socketToUse.classList.add('filled');
    socketToUse.innerHTML = `<img src="${jewelImage}" alt="${jewelName}" style="width: 20px; height: 20px;">`;
    
    // Store jewel data
    socketToUse.dataset.itemKey = 'custom-jewel';
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = jewelName;
    socketToUse.dataset.stats = stats.join(', ');
    socketToUse.dataset.levelReq = requiredLevel;
    
    // Update displays
    const section = socketToUse.closest('.socket-container')?.dataset.section || 'weapon';
    
    this.hideJewelModal();
    this.updateItemDisplay(section);
    this.calculateAllStats();
    
    // Reset selections
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;
    this.targetSocket = null;
  }
  
  showJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) {
      modal.style.display = 'flex';
      // Reset to defaults
      this.selectedJewelColor = 'white';
      this.selectedJewelPrefix = null;
      this.selectedJewelSuffix = null;
      this.selectedJewelPrefixValue = null;
      this.selectedJewelSuffixValue = null;
      
      // Reset UI
      document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      document.querySelector('.color-option[data-color="white"]').classList.add('selected');
      document.getElementById('jewelPrefixSelect').value = '';
      document.getElementById('jewelSuffixSelect').value = '';
      document.getElementById('prefixValueContainer').style.display = 'none';
      document.getElementById('suffixValueContainer').style.display = 'none';
      
      this.updateJewelPreview();
    }
  }
  

  
  // ========== LEVEL REQUIREMENT METHODS ==========
 calculateActualRequiredLevel(section, selectedItem) {
  if (!selectedItem || !itemList[selectedItem]) {
    console.log(`⚠️ calculateActualRequiredLevel: No item data for ${selectedItem}`);
    return 1;
  }
  
  const baseItem = itemList[selectedItem];
  const baseLevel = baseItem.properties?.reqlvl || 1;
  
  console.log(`📊 === CALCULATING ACTUAL LEVEL for ${section.toUpperCase()} ===`);
  console.log(`📊 Base item: ${selectedItem} (level ${baseLevel})`);
  
  // Find all sockets for this section
  const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
  console.log(`📊 Found ${sockets.length} filled sockets`);
  
  let highestLevel = baseLevel;
  
  // Check each socket's level requirement
  sockets.forEach((socket, index) => {
    const itemKey = socket.dataset.itemKey;
    const category = socket.dataset.category;
    const itemName = socket.dataset.itemName || 'Unknown';
    const storedLevelReq = socket.dataset.levelReq;
    
    console.log(`📊 Socket ${index + 1}:`, {
      itemKey,
      category, 
      itemName,
      storedLevelReq
    });
    
    let socketLevel = 1;
    
    // Check if it's a custom jewel
    if (itemKey === 'custom-jewel') {
      socketLevel = parseInt(storedLevelReq) || 1;
      console.log(`📊 - Custom jewel level requirement: ${socketLevel}`);
    } else if (category && itemKey) {
      // Regular socket item - get level from socket data
      const socketItem = this.socketData?.[category]?.[itemKey];
      if (socketItem?.levelReq) {
        socketLevel = socketItem.levelReq;
        console.log(`📊 - Regular ${category} "${itemName}" level requirement: ${socketLevel}`);
      } else {
        console.warn(`📊 - Could not find level req for ${category}/${itemKey}`);
        // Fallback to stored level req
        socketLevel = parseInt(storedLevelReq) || 1;
      }
    }
    
    if (socketLevel > highestLevel) {
      console.log(`📊 - 🔥 NEW HIGHEST LEVEL: ${socketLevel} (was ${highestLevel}) from ${itemName}`);
      highestLevel = socketLevel;
    } else {
      console.log(`📊 - Socket level ${socketLevel} <= current highest ${highestLevel}`);
    }
  });
  
  console.log(`📊 === FINAL ACTUAL REQUIRED LEVEL: ${highestLevel} ===`);
  return highestLevel;
}

  // ========== SOCKET SYSTEM METHODS ==========
  initializeSocketSystem() {
    this.createSocketModal();
    this.addSocketStyles();
    this.setupSocketEventListeners();
    this.initializeSocketContainers();
  }init() {
    this.setupEventListeners();
    this.initializeSocketSystem();
    this.addLevelValidationStyles();
    this.createJewelModal();
    this.calculateAllStats();
    console.log('📊 Enhanced Socket System with Custom Jewels initialized');
  }
  
 
  
  updatePrefixValueInput() {
    const container = document.getElementById('prefixValueContainer');
    const valueInput = document.getElementById('prefixValue');
    const valueDisplay = document.getElementById('prefixValueDisplay');
    
    if (this.selectedJewelPrefix) {
      const prefixData = this.jewelPrefixes[this.selectedJewelPrefix];
      const range = this.extractValueRange(prefixData.effect);
      
      container.style.display = 'block';
      valueInput.min = range.min;
      valueInput.max = range.max;
      valueInput.value = range.min;
      valueDisplay.textContent = range.min;
      this.selectedJewelPrefixValue = range.min;
    } else {
      container.style.display = 'none';
      this.selectedJewelPrefixValue = null;
    }
  }
  
  updateSuffixValueInput() {
    const container = document.getElementById('suffixValueContainer');
    const valueInput = document.getElementById('suffixValue');
    const valueDisplay = document.getElementById('suffixValueDisplay');
    
    if (this.selectedJewelSuffix) {
      const suffixData = this.jewelSuffixes[this.selectedJewelSuffix];
      const range = this.extractValueRange(suffixData.effect);
      
      container.style.display = 'block';
      valueInput.min = range.min;
      valueInput.max = range.max;
      valueInput.value = range.min;
      valueDisplay.textContent = range.min;
      this.selectedJewelSuffixValue = range.min;
    } else {
      container.style.display = 'none';
      this.selectedJewelSuffixValue = null;
    }
  }
  
  extractValueRange(effect) {
    const match = effect.match(/\[(\d+)-(\d+)\]/);
    if (match) {
      return {
        min: parseInt(match[1]),
        max: parseInt(match[2])
      };
    }
    return { min: 1, max: 10 };
  }
  
  updateJewelPreview() {
    const preview = document.getElementById('jewelPreview');
    const jewelName = document.querySelector('.jewel-name');
    const prefixStat = document.getElementById('jewelPrefixStat');
    const suffixStat = document.getElementById('jewelSuffixStat');
    
    // Update jewel name color
    const colorMap = {
      'white': '#FFFFFF',
      'blue': '#4169E1',
      'yellow': '#FFD700',
      'green': '#32CD32',
      'orange': '#FFA500',
      'red': '#FF4500'
    };
    
    let jewelDisplayName = this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1);
    if (this.selectedJewelPrefix) {
      jewelDisplayName = `${this.selectedJewelPrefix} ${jewelDisplayName}`;
    }
    if (this.selectedJewelSuffix) {
      jewelDisplayName = `${jewelDisplayName} of ${this.selectedJewelSuffix}`;
    }
    jewelDisplayName += ' Jewel';
    
    jewelName.textContent = jewelDisplayName;
    jewelName.style.color = colorMap[this.selectedJewelColor];
    
    // Update prefix stat
    if (this.selectedJewelPrefix && this.selectedJewelPrefixValue) {
      const prefixData = this.jewelPrefixes[this.selectedJewelPrefix];
      const stat = prefixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefixValue);
      prefixStat.textContent = stat;
      prefixStat.style.display = 'block';
    } else {
      prefixStat.style.display = 'none';
    }
    
    // Update suffix stat
    if (this.selectedJewelSuffix && this.selectedJewelSuffixValue) {
      const suffixData = this.jewelSuffixes[this.selectedJewelSuffix];
      const stat = suffixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffixValue);
      suffixStat.textContent = stat;
      suffixStat.style.display = 'block';
    } else {
      suffixStat.style.display = 'none';
    }
  }
  
  createCustomJewel() {
    const socketToUse = this.targetSocket || this.currentSocket;
    
    if (!socketToUse) {
      alert('No socket selected! Please try clicking the socket again.');
      return;
    }
    
    // Calculate required level (highest of prefix/suffix)
    let requiredLevel = 1;
    if (this.selectedJewelPrefix) {
      requiredLevel = Math.max(requiredLevel, this.jewelPrefixes[this.selectedJewelPrefix].reqLevel);
    }
    if (this.selectedJewelSuffix) {
      requiredLevel = Math.max(requiredLevel, this.jewelSuffixes[this.selectedJewelSuffix].reqLevel);
    }
    
    // Create jewel stats array
    const stats = [];
    if (this.selectedJewelPrefix && this.selectedJewelPrefixValue) {
      const prefixData = this.jewelPrefixes[this.selectedJewelPrefix];
      const stat = prefixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefixValue);
      stats.push(stat);
    }
    if (this.selectedJewelSuffix && this.selectedJewelSuffixValue) {
      const suffixData = this.jewelSuffixes[this.selectedJewelSuffix];
      const stat = suffixData.effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffixValue);
      stats.push(stat);
    }
    
    // Create jewel name
    let jewelName = this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1);
    if (this.selectedJewelPrefix) {
      jewelName = `${this.selectedJewelPrefix} ${jewelName}`;
    }
    if (this.selectedJewelSuffix) {
      jewelName = `${jewelName} of ${this.selectedJewelSuffix}`;
    }
    jewelName += ' Jewel';
    
    // Choose jewel image based on color
    const jewelImages = {
      'white': 'img/jewel1.png',
      'blue': 'img/jewel2.png',
      'yellow': 'img/jewel3.png',
      'green': 'img/jewel4.png',
      'orange': 'img/jewel5.png',
      'red': 'img/jewel6.png'
    };
    
    const jewelImage = jewelImages[this.selectedJewelColor] || 'img/jewel1.png';
    
    // Update socket appearance
    socketToUse.classList.remove('empty');
    socketToUse.classList.add('filled');
    socketToUse.innerHTML = `<img src="${jewelImage}" alt="${jewelName}" style="width: 20px; height: 20px;">`;
    
    // Store jewel data
    socketToUse.dataset.itemKey = 'custom-jewel';
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = jewelName;
    socketToUse.dataset.stats = stats.join(', ');
    socketToUse.dataset.levelReq = requiredLevel;
    
    // Update displays
    const section = socketToUse.closest('.socket-container')?.dataset.section || 'weapon';
    
    this.hideJewelModal();
    this.updateItemDisplay(section);
    this.calculateAllStats();
    
    // Reset selections
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;
    this.targetSocket = null;
  }
  
  showJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) {
      modal.style.display = 'flex';
      // Reset to defaults
      this.selectedJewelColor = 'white';
      this.selectedJewelPrefix = null;
      this.selectedJewelSuffix = null;
      this.selectedJewelPrefixValue = null;
      this.selectedJewelSuffixValue = null;
      
      // Reset UI
      document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      document.querySelector('.color-option[data-color="white"]').classList.add('selected');
      document.getElementById('jewelPrefixSelect').value = '';
      document.getElementById('jewelSuffixSelect').value = '';
      document.getElementById('prefixValueContainer').style.display = 'none';
      document.getElementById('suffixValueContainer').style.display = 'none';
      
      this.updateJewelPreview();
    }
  }
  
  hideJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) modal.style.display = 'none';
    this.currentSocket = null;
    this.targetSocket = null;
  }
  

 createSocketModal() {
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
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #0f3460;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
        }
        
        .socket-categories {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .socket-category-tab {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .socket-category-tab:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .socket-category-tab.active {
          background: #0f3460;
          border-color: #4a90e2;
        }
        
        .socket-item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .socket-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .socket-item:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        
        .socket-item img {
          width: 32px;
          height: 32px;
          margin-bottom: 5px;
        }
        
        .socket-item-name {
          font-size: 12px;
          text-align: center;
          color: white;
        }
        
        .custom-jewel-item {
          border: 2px solid #FFD700;
          background: rgba(255, 215, 0, 0.1);
        }
        
        .socket-container {
          margin: 10px 0;
        }
        
        .socket-grid {
          display: flex;
          gap: 5px;
          margin-bottom: 10px;
        }
        
        .socket-slot {
          width: 30px;
          height: 30px;
          border: 2px solid #666;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .socket-slot.empty {
          background: #333;
          border-color: #666;
        }
        
        .socket-slot.filled {
          background: #555;
          border-color: #999;
        }
        
        .socket-slot:hover {
          border-color: #4a90e2;
        }
        
        .socket-slot img {
          width: 20px;
          height: 20px;
        }
        
        .add-socket-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .add-socket-btn:hover {
          background: #218838;
        }
        
        .socket-close {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 24px;
          cursor: pointer;
          color: #aaa;
        }
        
        .socket-close:hover {
          color: white;
        }
        
        .socket-enhanced-stat {
          color: #4a90e2;
          font-weight: bold;
        }
        
        .jewel-creation-section h4 {
          color: #FFD700;
          margin: 15px 0 10px 0;
        }
        
        .jewel-color-selection {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .color-option {
          padding: 8px 12px;
          border: 2px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .color-option.selected {
          border-color: #FFD700;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .jewel-creation-section select {
          width: 100%;
          padding: 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          border: 1px solid #666;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .jewel-preview {
          background: rgba(0,0,0,0.3);
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid #666;
        }
        
        .jewel-name {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
        }
        
        .jewel-stats div {
          margin: 5px 0;
          color: #4a90e2;
        }
        
        .jewel-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .jewel-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        #createJewelBtn {
          background: #28a745;
          color: white;
        }
        
        #createJewelBtn:hover {
          background: #218838;
        }
        
        #cancelJewelBtn {
          background: #6c757d;
          color: white;
        }
        
        #cancelJewelBtn:hover {
          background: #5a6268;
        }
        
        #prefixValueContainer, #suffixValueContainer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        #prefixValueContainer input, #suffixValueContainer input {
          flex: 1;
        }
        
        #prefixValueDisplay, #suffixValueDisplay {
          min-width: 30px;
          text-align: center;
          font-weight: bold;
          color: #FFD700;
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
      } else if (e.target.classList.contains('socket-close') || e.target.id === 'jewelModal') {
        this.hideJewelModal();
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
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
    
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
  
  // ========== COMPLETELY FIXED SOCKET LEVEL REQUIREMENT SYSTEM ==========

// ✅ FIXED: calculateActualRequiredLevel - ensure it finds the TRUE highest level
calculateActualRequiredLevel(section, selectedItem) {
  if (!selectedItem || !itemList[selectedItem]) {
    console.log(`⚠️ calculateActualRequiredLevel: No item data for ${selectedItem}`);
    return 1;
  }
  
  const baseItem = itemList[selectedItem];
  const baseLevel = baseItem.properties?.reqlvl || 1;
  
  console.log(`📊 === CALCULATING ACTUAL LEVEL for ${section.toUpperCase()} ===`);
  console.log(`📊 Base item: ${selectedItem} (level ${baseLevel})`);
  
  // Find all sockets for this section
  const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
  console.log(`📊 Found ${sockets.length} filled sockets`);
  
  let highestLevel = baseLevel;
  
  // Check each socket's level requirement
  sockets.forEach((socket, index) => {
    const itemKey = socket.dataset.itemKey;
    const category = socket.dataset.category;
    const itemName = socket.dataset.itemName || 'Unknown';
    const storedLevelReq = socket.dataset.levelReq;
    
    console.log(`📊 Socket ${index + 1}:`, {
      itemKey,
      category, 
      itemName,
      storedLevelReq
    });
    
    let socketLevel = 1;
    
    // Check if it's a custom jewel
    if (itemKey === 'custom-jewel') {
      socketLevel = parseInt(storedLevelReq) || 1;
      console.log(`📊 - Custom jewel level requirement: ${socketLevel}`);
    } else if (category && itemKey) {
      // Regular socket item - get level from socket data
      const socketItem = this.socketData?.[category]?.[itemKey];
      if (socketItem?.levelReq) {
        socketLevel = socketItem.levelReq;
        console.log(`📊 - Regular ${category} "${itemName}" level requirement: ${socketLevel}`);
      } else {
        console.warn(`📊 - Could not find level req for ${category}/${itemKey}`);
        // Fallback to stored level req
        socketLevel = parseInt(storedLevelReq) || 1;
      }
    }
    
    if (socketLevel > highestLevel) {
      console.log(`📊 - 🔥 NEW HIGHEST LEVEL: ${socketLevel} (was ${highestLevel}) from ${itemName}`);
      highestLevel = socketLevel;
    } else {
      console.log(`📊 - Socket level ${socketLevel} <= current highest ${highestLevel}`);
    }
  });
  
  console.log(`📊 === FINAL ACTUAL REQUIRED LEVEL: ${highestLevel} ===`);
  return highestLevel;
}

// ✅ CRITICAL FIX: Ensure sockets store level requirements correctly when added
socketItem(itemKey, category) {
  if (!this.currentSocket) {
    console.error('❌ No socket selected for socketing!');
    return;
  }
  
  const item = this.socketData[category][itemKey];
  const section = this.currentSocket.closest('.socket-container')?.dataset.section || 'weapon';
  const stat = item.stats[section] || item.stats.weapon;
  
  console.log(`🔧 Socketing ${item.name} into ${section}:`);
  console.log(`- Item key: ${itemKey}`);
  console.log(`- Category: ${category}`);
  console.log(`- Level requirement: ${item.levelReq}`);
  console.log(`- Stats: ${stat}`);
  
  // Update socket appearance
  this.currentSocket.classList.remove('empty');
  this.currentSocket.classList.add('filled');
  this.currentSocket.innerHTML = `<img src="${item.img}" alt="${item.name}" onerror="this.src='img/placeholder.png'">`;
  
  // ✅ CRITICAL: Store socket data INCLUDING correct level requirement
  this.currentSocket.dataset.itemKey = itemKey;
  this.currentSocket.dataset.category = category;
  this.currentSocket.dataset.itemName = item.name;
  this.currentSocket.dataset.stats = stat;
  this.currentSocket.dataset.levelReq = item.levelReq || 1; // ✅ ENSURE this is stored!
  
  console.log(`✅ Socket data stored:`, {
    itemKey: this.currentSocket.dataset.itemKey,
    category: this.currentSocket.dataset.category,
    itemName: this.currentSocket.dataset.itemName,
    levelReq: this.currentSocket.dataset.levelReq,
    stats: this.currentSocket.dataset.stats
  });
  
  this.hideSocketModal();
  
  // ✅ CRITICAL: Update display AND recalculate stats
  this.updateItemDisplay(section);
  
  // Force recalculation after a short delay to ensure DOM is updated
  setTimeout(() => {
    this.calculateAllStats();
    console.log('✅ Socket operation complete - all systems updated');
  }, 50);
}
  
  removeSocketedItem(socket) {
    socket.classList.remove('filled');
    socket.classList.add('empty');
    socket.innerHTML = '';
    
    // Clear socket data
    delete socket.dataset.itemKey;
    delete socket.dataset.category;
    delete socket.dataset.itemName;
    delete socket.dataset.stats;
    delete socket.dataset.levelReq;
    
    const section = socket.closest('.socket-container')?.dataset.section || 'weapon';
    this.updateItemDisplay(section);
    this.calculateAllStats();
  }
  
  addSocket(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    const socketGrid = container?.querySelector('.socket-grid');
    
    if (!container || !socketGrid) return;
    
    const existingSockets = socketGrid.children.length;
    const maxSockets = 6;
    
    if (existingSockets >= maxSockets) {
      alert(`Maximum ${maxSockets} sockets allowed`);
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
  
  updateSocketsForItem(section) {
    const dropdownIdMap = {
      'weapon': 'weapons-dropdown',
      'helm': 'helms-dropdown',
      'armor': 'armors-dropdown',
      'shield': 'offs-dropdown',
      'gloves': 'gloves-dropdown',
      'belts': 'belts-dropdown',
      'boots': 'boots-dropdown',
      'ringone': 'ringsone-dropdown',
      'ringtwo': 'ringstwo-dropdown',
      'amulet': 'amulets-dropdown'


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
  
  // ========== ITEM DISPLAY METHODS ==========
  // ✅ FIXED: Keep the level-checking stats calculation, but fix the display system

// This method should ONLY handle stats calculation, not display
calculateEquipmentStats() {
  console.log('🔧 === CALCULATING EQUIPMENT STATS ===');
  
  const equipmentIds = {
    'weapon': 'weapons-dropdown',
    'helm': 'helms-dropdown',
    'armor': 'armors-dropdown',
    'shield': 'offs-dropdown',
    'gloves': 'gloves-dropdown',
    'belts': 'belts-dropdown',
    'boots': 'boots-dropdown',
    'ringone': 'ringsone-dropdown',
    'ringtwo': 'ringstwo-dropdown',
    'amulet': 'amulets-dropdown'
  };
  
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  console.log(`🎯 Character level: ${currentLevel}`);
  
  Object.entries(equipmentIds).forEach(([section, dropdownId]) => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value || !itemList[dropdown.value]) {
      console.log(`⏭️ Skipping ${section} - no item selected`);
      return;
    }
    
    const item = itemList[dropdown.value];
    
    // ✅ CRITICAL: Calculate the ACTUAL required level INCLUDING all sockets
    const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
    
    console.log(`🔍 ${section.toUpperCase()}:`);
    console.log(`  - Item: ${dropdown.value}`);
    console.log(`  - Actual required level: ${actualRequiredLevel}`);
    console.log(`  - Character level: ${currentLevel}`);
    console.log(`  - Can use item: ${currentLevel >= actualRequiredLevel}`);
    
    // ✅ LEVEL CHECK: Only apply item stats if player meets the ACTUAL required level
    if (currentLevel >= actualRequiredLevel) {
      console.log(`  - ✅ APPLYING STATS (level requirement met)`);
      this.parseItemStats(item, section);
      
      // Log what attribute bonuses were added
      const beforeStr = this.stats.strength;
      const beforeDex = this.stats.dexterity;
      const beforeVit = this.stats.vitality;
      const beforeEnr = this.stats.energy;
      
      if (item.properties?.str) console.log(`    + ${item.properties.str} Strength`);
      if (item.properties?.dex) console.log(`    + ${item.properties.dex} Dexterity`);
      if (item.properties?.vit) console.log(`    + ${item.properties.vit} Vitality`);
      if (item.properties?.enr) console.log(`    + ${item.properties.enr} Energy`);
      
    } else {
      console.log(`  - ❌ BLOCKING ALL STATS (need level ${actualRequiredLevel}, have ${currentLevel})`);
    }
  });
  
  console.log('🔧 === EQUIPMENT STATS CALCULATION COMPLETE ===');
}

// ✅ FIXED: Item display method - ALWAYS show description, just update colors and visual feedback
updateItemDisplay(section) {
  const infoIdMap = {
    'weapon': 'weapon-info',
    'helm': 'helm-info',
    'armor': 'armor-info',
    'shield': 'off-info',
    'gloves': 'glove-info',
    'belts': 'belt-info',
    'boots': 'boot-info',
    'ringone': 'ringsone-info',
    'ringtwo': 'ringstwo-info',
    'amulet': 'amulet-info'
  };
  
  const dropdownIdMap = {
    'weapon': 'weapons-dropdown',
    'helm': 'helms-dropdown',
    'armor': 'armors-dropdown',
    'shield': 'offs-dropdown',
    'gloves': 'gloves-dropdown',
    'belts': 'belts-dropdown',
    'boots': 'boots-dropdown',
    'ringone': 'ringsone-dropdown',
    'ringtwo': 'ringstwo-dropdown',
    'amulet': 'amulets-dropdown'
  };
  
  const infoDiv = document.getElementById(infoIdMap[section]);
  if (!infoDiv) return;
  
  const dropdown = document.getElementById(dropdownIdMap[section]);
  let baseHtml = '';
  
  // ✅ ALWAYS show the item description if an item is selected
  if (dropdown && dropdown.value && typeof itemList !== 'undefined' && itemList[dropdown.value]) {
    const baseItem = itemList[dropdown.value];
    baseHtml = baseItem.description || '';
    
    // ✅ Calculate and show the ACTUAL required level (including sockets)
    const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
    const meetsRequirement = currentLevel >= actualRequiredLevel;
    
    console.log(`🖼️ Updating display for ${section}: actual level ${actualRequiredLevel}, meets req: ${meetsRequirement}`);
    
    // ✅ Update the level requirement line with proper color
    const levelColor = meetsRequirement ? '#00ff00' : '#ff5555';
    const levelRequirementLine = `<span style="color: ${levelColor}; font-weight: bold;">Required Level: ${actualRequiredLevel}</span>`;
    
    // Replace or add level requirement
    const levelRegex = /<span[^>]*>Required Level: \d+<\/span>|Required Level: \d+/i;
    if (levelRegex.test(baseHtml)) {
      baseHtml = baseHtml.replace(levelRegex, levelRequirementLine);
    } else {
      const lines = baseHtml.split('<br>');
      lines.splice(2, 0, levelRequirementLine);
      baseHtml = lines.join('<br>');
    }
    
    // ✅ Visual feedback for unusable items (grayed out)
    if (!meetsRequirement) {
      infoDiv.style.opacity = '0.6';
      infoDiv.style.filter = 'grayscale(50%)';
      infoDiv.title = `You need level ${actualRequiredLevel} to use this item`;
    } else {
      infoDiv.style.opacity = '1';
      infoDiv.style.filter = 'none';
      infoDiv.title = '';
    }
    
    // ✅ FIXED: Socket stats display - all gray when item unusable
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    
    if (sockets.length > 0) {
      sockets.forEach(socket => {
        const stats = socket.dataset.stats;
        const socketLevel = parseInt(socket.dataset.levelReq) || 1;
        
        if (stats) {
          const statLines = stats.split(/[,\n]/).map(s => s.trim()).filter(s => s);
          statLines.forEach(statLine => {
            if (statLine) {
              // ✅ CRITICAL FIX: If the ITEM can't be used, ALL socket stats are gray
              let statColor, statStyle;
              
              if (!meetsRequirement) {
                // Item unusable - ALL socket stats are gray and italic
                statColor = '#888888';
                statStyle = 'font-style: italic; opacity: 0.7;';
                console.log(`🔒 ${section}: Graying out socket stat "${statLine}" - item unusable (need level ${actualRequiredLevel})`);
              } else {
                // Item usable - socket stats colored based on individual socket requirements
                const socketUsable = currentLevel >= socketLevel;
                statColor = socketUsable ? '#4a90e2' : '#888888';
                statStyle = socketUsable ? 'font-weight: bold;' : 'font-style: italic;';
                console.log(`✅ ${section}: Socket stat "${statLine}" - ${socketUsable ? 'active' : 'inactive'}`);
              }
              
              baseHtml += `<br><span style="color: ${statColor}; ${statStyle}">${statLine}</span>`;
            }
          });
        }
      });
    }
  }
  
  // ✅ Always update the display
  infoDiv.innerHTML = baseHtml;
}
  updateAllEquipmentDisplays() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet' ];
    sections.forEach(section => {
      this.updateItemDisplay(section);
    });
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
        }
        
        .item-unusable {
          opacity: 0.6;
          filter: grayscale(50%);
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
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
        
        // ✅ Update both display and stats
        this.updateItemDisplay(section);
        this.calculateAllStats();
      });
    }
  });
  
  // Character stat changes
  ['str', 'dex', 'vit', 'enr'].forEach(statId => {
    const input = document.getElementById(statId);
    if (input) {
      input.addEventListener('input', () => {
        this.calculateAllStats();
      });
    }
  });
  
  // ✅ Level changes trigger complete update
  const levelInput = document.getElementById('lvlValue');
  if (levelInput) {
    const handleLevelChange = () => {
      console.log('🔄 Level changed - updating displays and stats...');
      
      // ✅ Update stats calculation
      this.calculateAllStats();
      
      // ✅ Update ALL equipment displays
      setTimeout(() => {
        this.updateAllEquipmentDisplays();
      }, 50);
    };
    
    levelInput.addEventListener('input', handleLevelChange);
    levelInput.addEventListener('change', handleLevelChange);
  }
  
  // Socket changes
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('socket-slot')) {
      this.currentSocket = e.target;
      this.showSocketModal();
    }
  });
}

// ✅ Ensure this method updates ALL equipment displays
updateAllEquipmentDisplays() {
  console.log('🖼️ Updating all equipment displays...');
  const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
  sections.forEach(section => {
    this.updateItemDisplay(section);
  });
}
  
  // ========== STATS CALCULATION ==========
  calculateAllStats() {
  console.log('🔄 Starting complete stats recalculation...');
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  console.log(`🎯 Current character level: ${currentLevel}`);
  
  // ✅ STEP 1: COMPLETELY reset all stats to zero
  this.resetAllStats();
  
  // ✅ STEP 2: Calculate base character stats (always applied)
  this.calculateBaseStats();
  
  // ✅ STEP 3: Calculate equipment stats (with level checking)
  this.calculateEquipmentStats();
  
  // ✅ STEP 4: Calculate socket stats (with level checking)
  this.calculateSocketStats();
  
  // ✅ STEP 5: Update all displays
  this.updateAllStatsDisplays();
  
  // ✅ DEBUG: Log final attribute stats
  console.log('✅ Final attribute bonuses applied:', {
    strength: this.stats.strength,
    dexterity: this.stats.dexterity,
    vitality: this.stats.vitality,
    energy: this.stats.energy
  });
  
  console.log('✅ Stats recalculation complete!');
}

// ✅ FIXED: Proper stats reset method
resetAllStats() {
  console.log('🧹 Resetting all stats to zero...');
  
  // Reset ALL stats to their default values
  Object.keys(this.stats).forEach(key => {
    if (key === 'cbf') {
      this.stats[key] = false;
    } else if (key === 'critHitMultiplier') {
      this.stats[key] = 2.0;
    } else {
      this.stats[key] = 0; // ✅ This ensures everything is zeroed out
    }
  });
  
  console.log('✅ All stats reset to defaults');
}

// ✅ IMPROVED: Base stats calculation (always applied regardless of equipment)
calculateBaseStats() {
  const str = parseInt(document.getElementById('str')?.value) || 0;
  const dex = parseInt(document.getElementById('dex')?.value) || 0;
  const vit = parseInt(document.getElementById('vit')?.value) || 0;
  const enr = parseInt(document.getElementById('enr')?.value) || 0;
  
  // Base life calculation (Amazon base: 2 life per vitality + 45 base)
  this.stats.life = (vit * 2) + 45;
  
  // Base mana calculation (Amazon base: 2 mana per energy + 15 base)
  this.stats.mana = (enr * 2) + 15;
  
  // Base defense from dexterity (1 defense per 4 dexterity)
  this.stats.defense = Math.floor(dex / 4);
  
  console.log(`📊 Base stats calculated: Life=${this.stats.life}, Mana=${this.stats.mana}, Defense=${this.stats.defense}`);
}

// ✅ IMPROVED: Equipment stats with better level checking
calculateEquipmentStats() {
  console.log('🔧 === CALCULATING EQUIPMENT STATS ===');
  
  const equipmentIds = {
    'weapon': 'weapons-dropdown',
    'helm': 'helms-dropdown',
    'armor': 'armors-dropdown',
    'shield': 'offs-dropdown',
    'gloves': 'gloves-dropdown',
    'belts': 'belts-dropdown',
    'boots': 'boots-dropdown',
    'ringone': 'ringsone-dropdown',
    'ringtwo': 'ringstwo-dropdown',
    'amulet': 'amulets-dropdown'
  };
  
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  console.log(`🎯 Character level: ${currentLevel}`);
  
  Object.entries(equipmentIds).forEach(([section, dropdownId]) => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value || !itemList[dropdown.value]) {
      console.log(`⏭️ Skipping ${section} - no item selected`);
      return;
    }
    
    const item = itemList[dropdown.value];
    
    // ✅ CRITICAL: Calculate the ACTUAL required level INCLUDING all sockets FIRST
    const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
    
    console.log(`🔍 ${section.toUpperCase()}:`);
    console.log(`  - Item: ${dropdown.value}`);
    console.log(`  - Actual required level: ${actualRequiredLevel}`);
    console.log(`  - Character level: ${currentLevel}`);
    console.log(`  - Can use item: ${currentLevel >= actualRequiredLevel}`);
    
    // ✅ LEVEL CHECK: Only apply item stats if player meets the ACTUAL required level
    if (currentLevel >= actualRequiredLevel) {
      console.log(`  - ✅ APPLYING ALL STATS (level requirement met)`);
      this.parseItemStats(item, section);
      
      // Log what attribute bonuses were applied
      if (item.properties?.str) console.log(`    + ${item.properties.str} Strength from base item`);
      if (item.properties?.dex) console.log(`    + ${item.properties.dex} Dexterity from base item`);
      if (item.properties?.vit) console.log(`    + ${item.properties.vit} Vitality from base item`);
      if (item.properties?.enr) console.log(`    + ${item.properties.enr} Energy from base item`);
      
    } else {
      console.log(`  - ❌ BLOCKING ALL STATS (need level ${actualRequiredLevel}, have ${currentLevel})`);
      console.log(`    - This includes the base item stats like +8 Strength from Gnasher!`);
    }
  });
  
  console.log('🔧 === EQUIPMENT STATS CALCULATION COMPLETE ===');
}

// ✅ IMPROVED: Socket stats with better level checking  
calculateSocketStats() {
  console.log('💎 Calculating socket stats...');
  
  const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
  
  sections.forEach(section => {
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    
    // Get the parent item for this section
    const dropdownIdMap = {
      'weapon': 'weapons-dropdown',
      'helm': 'helms-dropdown', 
      'armor': 'armors-dropdown',
      'shield': 'offs-dropdown',
      'gloves': 'gloves-dropdown',
      'belts': 'belts-dropdown',
      'boots': 'boots-dropdown',
      'ringone': 'ringsone-dropdown',
      'ringtwo': 'ringstwo-dropdown',
      'amulet': 'amulets-dropdown'
    };
    
    const dropdown = document.getElementById(dropdownIdMap[section]);
    const selectedItem = dropdown?.value;
    
    if (!selectedItem) {
      console.log(`⏭️ Skipping socket stats for ${section} - no parent item`);
      return;
    }
    
    // ✅ CRITICAL: Calculate the ACTUAL required level for this item (including all sockets)
    const actualRequiredLevel = this.calculateActualRequiredLevel(section, selectedItem);
    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
    
    // ✅ FIXED: Only process socket stats if player meets the ACTUAL required level
    if (currentLevel < actualRequiredLevel) {
      console.log(`❌ BLOCKING ALL SOCKET STATS for ${section} - need level ${actualRequiredLevel}, have ${currentLevel}`);
      console.log(`🔒 This means NO socket bonuses are applied, even if individual sockets have lower requirements`);
      return; // Skip all sockets for this item - NONE of them work!
    }
    
    console.log(`✅ Processing socket stats for ${section} - item level requirement met`);
    
    // If player meets the item level requirement, process each socket normally
    sockets.forEach(socket => {
      const stats = socket.dataset.stats;
      const socketLevelReq = parseInt(socket.dataset.levelReq) || 1;
      
      if (stats && currentLevel >= socketLevelReq) {
        this.parseSocketStats(stats, section);
        console.log(`✅ Applied socket stats from ${socket.dataset.itemName}`);
      } else if (currentLevel < socketLevelReq) {
        console.log(`❌ Skipped socket ${socket.dataset.itemName} - individual socket level requirement not met`);
      }
    });
  });
}

  // ========== COMPLETELY FIXED EQUIPMENT STATS WITH LEVEL CHECKING ==========

// ✅ FIXED: calculateEquipmentStats method with proper level checking
calculateEquipmentStats() {
  console.log('🔧 Calculating equipment stats with proper level checking...');
  
  const equipmentIds = {
    'weapon': 'weapons-dropdown',
    'helm': 'helms-dropdown',
    'armor': 'armors-dropdown',
    'shield': 'offs-dropdown',
    'gloves': 'gloves-dropdown',
    'belts': 'belts-dropdown',
    'boots': 'boots-dropdown',
    'ringone': 'ringsone-dropdown',
    'ringtwo': 'ringstwo-dropdown',
    'amulet': 'amulets-dropdown'
  };
  
  Object.entries(equipmentIds).forEach(([section, dropdownId]) => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value || !itemList[dropdown.value]) {
      console.log(`⏭️ Skipping ${section} - no item selected`);
      return;
    }
    
    const item = itemList[dropdown.value];
    
    // ✅ CRITICAL: Calculate the ACTUAL required level INCLUDING all sockets
    const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
    
    console.log(`🔍 ${section}: Item="${dropdown.value}", ActualReqLevel=${actualRequiredLevel}, CharLevel=${currentLevel}`);
    
    // ✅ LEVEL CHECK: Only apply item stats if player meets the ACTUAL required level
    if (currentLevel >= actualRequiredLevel) {
      this.parseItemStats(item, section);
      console.log(`✅ Applied ${section} stats - meets level requirement`);
    } else {
      console.log(`❌ BLOCKED ${section} stats - need level ${actualRequiredLevel}, have ${currentLevel}`);
    }
  });
}

// ✅ FIXED: parseItemStats method - no longer needs level checking (done in parent)
parseItemStats(item, section) {
  if (!item.properties) return;
  
  console.log(`🔧 Parsing stats for ${section}:`);
  
  // ✅ NOTE: This method now only runs AFTER level checking passes in calculateEquipmentStats
  // So all stats parsed here are automatically level-gated
  
  // Basic Stats from properties
  if (item.properties.defense) {
    this.stats.defense += item.properties.defense;
    console.log(`🛡️ +${item.properties.defense} Defense`);
  }
  if (item.properties.life) {
    this.stats.life += item.properties.life;
    console.log(`❤️ +${item.properties.life} Life`);
  }
  if (item.properties.mana) {
    this.stats.mana += item.properties.mana;
    console.log(`💙 +${item.properties.mana} Mana`);
  }
  if (item.properties.magicfind) {
    this.stats.magicFind += item.properties.magicfind;
    console.log(`✨ +${item.properties.magicfind}% Magic Find`);
  }
  if (item.properties.toatt) {
    this.stats.attackRating += item.properties.toatt;
    console.log(`⚔️ +${item.properties.toatt} Attack Rating`);
  }
  
  // ✅ ATTRIBUTE BONUSES from properties - now properly level-gated
  if (item.properties.str) {
    this.stats.strength += item.properties.str;
    console.log(`💪 +${item.properties.str} Strength`);
  }
  if (item.properties.dex) {
    this.stats.dexterity += item.properties.dex;
    console.log(`🏹 +${item.properties.dex} Dexterity`);
  }
  if (item.properties.vit) {
    this.stats.vitality += item.properties.vit;
    console.log(`❤️ +${item.properties.vit} Vitality`);
  }
  if (item.properties.enr) {
    this.stats.energy += item.properties.enr;
    console.log(`⚡ +${item.properties.enr} Energy`);
  }
  
  // Basic Resistances from properties
  if (item.properties.firres) {
    this.stats.fireResist += item.properties.firres;
    console.log(`🔥 +${item.properties.firres}% Fire Resist`);
  }
  if (item.properties.coldres) {
    this.stats.coldResist += item.properties.coldres;
    console.log(`❄️ +${item.properties.coldres}% Cold Resist`);
  }
  if (item.properties.ligres) {
    this.stats.lightResist += item.properties.ligres;
    console.log(`⚡ +${item.properties.ligres}% Lightning Resist`);
  }
  if (item.properties.poisres) {
    this.stats.poisonResist += item.properties.poisres;
    console.log(`☠️ +${item.properties.poisres}% Poison Resist`);
  }

  // Lightning damage properties
  if (item.properties.lightdmgmin) {
    this.stats.flatLightMin += item.properties.lightdmgmin;
    console.log(`⚡ +${item.properties.lightdmgmin} Lightning Damage Min`);
  }
  
  if (item.properties.lightdmgmax) {
    this.stats.flatLightMax += item.properties.lightdmgmax;
    console.log(`⚡ +${item.properties.lightdmgmax} Lightning Damage Max`);
  }
  
  // ✅ Parse description stats (includes MORE attribute bonuses from descriptions)
  if (item.description) {
    console.log(`📖 Parsing description stats for ${section}...`);
    this.parseDescriptionStats(item.description);
  }
}


  
  // 🆕 NEW METHOD: Parse stats from item descriptions
  parseDescriptionStats(description) {
  // ✅ NOTE: This method is only called from parseItemStats AFTER level check passes
  // So all stats parsed here are automatically level-gated
  
  // Speed Stats
  this.extractStatFromDescription(description, /(\d+)%\s*Faster Cast Rate/i, 'fcr');
  this.extractStatFromDescription(description, /(\d+)%\s*Increased Attack Speed/i, 'ias');
  this.extractStatFromDescription(description, /(\d+)%\s*Faster Run\/Walk/i, 'frw');
  this.extractStatFromDescription(description, /(\d+)%\s*Faster Hit Recovery/i, 'fhr');
  
  // Defensive Stats
  this.extractStatFromDescription(description, /(\d+)%\s*Damage Reduced/i, 'dr');
  this.extractStatFromDescription(description, /Physical Damage.*Reduced by (\d+)/i, 'pdr');
  this.extractStatFromDescription(description, /Magic Damage.*Reduced by (\d+)/i, 'mdr');
  this.extractStatFromDescription(description, /Poison Length Reduced by (\d+)%/i, 'plr');
  
  // Enhanced Damage
  this.extractStatFromDescription(description, /(\d+)%\s*Enhanced Damage/i, 'enhancedDamage');
  
  // Gold Find
  this.extractStatFromDescription(description, /(\d+)%\s*Extra Gold from Monsters/i, 'goldFind');
  
  // All Skills
  this.extractStatFromDescription(description, /\+(\d+)\s*to All Skills/i, 'allSkills');
  
  // Block Chance
  this.extractStatFromDescription(description, /(\d+)%\s*Increased Chance of Blocking/i, 'blockChance');
  
  // Combat Stats
  this.extractStatFromDescription(description, /(\d+)%\s*Chance of Open Wounds/i, 'openWounds');
  this.extractStatFromDescription(description, /(\d+)%\s*Chance of Crushing Blow/i, 'crushingBlow');
  this.extractStatFromDescription(description, /(\d+)%\s*Chance of Deadly Strike/i, 'deadlyStrike');
  this.extractStatFromDescription(description, /(\d+)%\s*Critical Strike/i, 'criticalHit');
  
  // Leech
  this.extractStatFromDescription(description, /(\d+)%\s*Life Stolen per Hit/i, 'lifeSteal');
  this.extractStatFromDescription(description, /(\d+)%\s*Mana Stolen per Hit/i, 'manaSteal');
  
  // ✅ ATTRIBUTES FROM DESCRIPTIONS - now properly level-gated
  this.extractStatFromDescription(description, /\+(\d+)\s*to Strength/i, 'strength');
  this.extractStatFromDescription(description, /\+(\d+)\s*to Dexterity/i, 'dexterity');
  this.extractStatFromDescription(description, /\+(\d+)\s*to Vitality/i, 'vitality');
  this.extractStatFromDescription(description, /\+(\d+)\s*to Energy/i, 'energy');
  
  // Cannot Be Frozen
  if (description.toLowerCase().includes('cannot be frozen')) {
    this.stats.cbf = true;
  }
  
  // All Resistances
  const allResMatch = description.match(/All Resistances \+(\d+)/i);
  if (allResMatch) {
    const value = parseInt(allResMatch[1]);
    this.stats.fireResist += value;
    this.stats.coldResist += value;
    this.stats.lightResist += value;
    this.stats.poisonResist += value;
  }
}
  
  // 🆕 HELPER METHOD: Extract stat from description
  extractStatFromDescription(description, regex, statKey) {
    const match = description.match(regex);
    if (match) {
      const value = parseInt(match[1]);
      if (!isNaN(value)) {
        this.stats[statKey] += value;
        console.log(`📊 Found ${statKey}: +${value} from equipment`);
      }
    }
  }
  
  parseSocketStats(statsString, section) {
  const statLines = statsString.split(/[,\n]/).map(s => s.trim()).filter(s => s);
  
  statLines.forEach(statLine => {
    console.log(`🔍 Parsing: "${statLine}"`);
    
    // Enhanced Damage (multiple formats)
    if (statLine.includes('Enhanced Damage') || (statLine.includes('%') && statLine.includes('Damage'))) {
      const match = statLine.match(/(\d+)%?\s*Enhanced Damage|(\d+)%\s*Damage/);
      if (match) {
        const value = parseInt(match[1] || match[2]);
        this.stats.enhancedDamage += value;
        console.log(`💪 +${value}% Enhanced Damage (total: ${this.stats.enhancedDamage}%)`);
      }
    }
    
    // Life (multiple formats)
    if (statLine.includes('to Life') || (statLine.includes('Life') && statLine.includes('+'))) {
      const match = statLine.match(/\+(\d+)\s*(?:to\s+)?Life/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.life += value;
        console.log(`❤️ +${value} Life (total: ${this.stats.life})`);
      }
    }
    
    // Mana (multiple formats) 
    if (statLine.includes('to Mana') || (statLine.includes('Mana') && statLine.includes('+'))) {
      const match = statLine.match(/\+(\d+)\s*(?:to\s+)?Mana/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.mana += value;
        console.log(`💙 +${value} Mana (total: ${this.stats.mana})`);
      }
    }
    
    // Defense (be more specific to avoid conflicts)
    if (statLine.includes('Defense') && !statLine.includes('Enhanced Defense') && !statLine.includes('vs.') && !statLine.includes('Target')) {
      const match = statLine.match(/\+(\d+)\s*Defense/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.defense += value;
        console.log(`🛡️ +${value} Defense (total: ${this.stats.defense})`);
      }
    }
    
    // Magic Find - FIXED multiple formats
    if (statLine.includes('Better Chance of Getting Magic Items') || statLine.includes('Magic Items')) {
      const match = statLine.match(/(\d+)%?\s*Better Chance of Getting Magic Items/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.magicFind += value;
        console.log(`✨ +${value}% Magic Find (total: ${this.stats.magicFind}%)`);
      }
    }
    
    // Attack Rating - FIXED
    if (statLine.includes('Attack Rating') && statLine.includes('+')) {
      const match = statLine.match(/\+(\d+)\s*(?:to\s+)?Attack Rating/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.attackRating += value;
        console.log(`⚔️ +${value} Attack Rating (total: ${this.stats.attackRating})`);
      }
    }
    
    // RESISTANCES - FIXED parsing
    if (statLine.includes('Fire Resist')) {
      const match = statLine.match(/Fire Resist \+(\d+)%?/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.fireResist += value;
        console.log(`🔥 +${value}% Fire Resist (total: ${this.stats.fireResist}%)`);
      }
    }
    
    if (statLine.includes('Cold Resist')) {
      const match = statLine.match(/Cold Resist \+(\d+)%?/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.coldResist += value;
        console.log(`❄️ +${value}% Cold Resist (total: ${this.stats.coldResist}%)`);
      }
    }
    
    if (statLine.includes('Lightning Resist')) {
      const match = statLine.match(/Lightning Resist \+(\d+)%?/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.lightResist += value;
        console.log(`⚡ +${value}% Lightning Resist (total: ${this.stats.lightResist}%)`);
      }
    }
    
    if (statLine.includes('Poison Resist')) {
      const match = statLine.match(/Poison Resist \+(\d+)%?/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.poisonResist += value;
        console.log(`☠️ +${value}% Poison Resist (total: ${this.stats.poisonResist}%)`);
      }
    }
    
    // All Resistances - FIXED
    if (statLine.includes('All Resistances')) {
      const match = statLine.match(/All Resistances \+(\d+)%?/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.fireResist += value;
        this.stats.coldResist += value;
        this.stats.lightResist += value;
        this.stats.poisonResist += value;
        console.log(`🌈 +${value}% All Resistances`);
      }
    }
    
    // ELEMENTAL DAMAGE - FIXED multiple formats
    if (statLine.includes('Fire Damage')) {
      let match = statLine.match(/Adds (\d+)-(\d+) Fire Damage/i);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        this.stats.flatFireMin += min;
        this.stats.flatFireMax += max;
        console.log(`🔥 +${min}-${max} Fire Damage`);
      } else {
        // Try alternative format: "+X-Y Fire Damage"
        match = statLine.match(/\+(\d+)-(\d+) Fire Damage/i);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);
          this.stats.flatFireMin += min;
          this.stats.flatFireMax += max;
          console.log(`🔥 +${min}-${max} Fire Damage`);
        }
      }
    }
    
    if (statLine.includes('Cold Damage')) {
      let match = statLine.match(/Adds (\d+)-(\d+) Cold Damage/i);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        this.stats.flatColdMin += min;
        this.stats.flatColdMax += max;
        console.log(`❄️ +${min}-${max} Cold Damage`);
      } else {
        match = statLine.match(/\+(\d+)-(\d+) Cold Damage/i);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);
          this.stats.flatColdMin += min;
          this.stats.flatColdMax += max;
          console.log(`❄️ +${min}-${max} Cold Damage`);
        }
      }
    }
    
    if (statLine.includes('Lightning Damage')) {
      // Special case: "Adds 1-X Lightning Damage"
      let match = statLine.match(/Adds 1-(\d+) Lightning Damage/i);
      if (match) {
        this.stats.flatLightMin += 1;
        this.stats.flatLightMax += parseInt(match[1]);
        console.log(`⚡ +1-${match[1]} Lightning Damage`);
      } else {
        // Regular format: "Adds X-Y Lightning Damage"
        match = statLine.match(/Adds (\d+)-(\d+) Lightning Damage/i);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);
          this.stats.flatLightMin += min;
          this.stats.flatLightMax += max;
          console.log(`⚡ +${min}-${max} Lightning Damage`);
        } else {
          // Alternative: "+X-Y Lightning Damage"
          match = statLine.match(/\+(\d+)-(\d+) Lightning Damage/i);
          if (match) {
            const min = parseInt(match[1]);
            const max = parseInt(match[2]);
            this.stats.flatLightMin += min;
            this.stats.flatLightMax += max;
            console.log(`⚡ +${min}-${max} Lightning Damage`);
          }
        }
      }
    }
    
    // Min/Max Damage
    if (statLine.includes('to Minimum Damage')) {
      const match = statLine.match(/\+(\d+)\s*to Minimum Damage/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.flatFireMin += value; // Adding to physical/fire
        console.log(`⚔️ +${value} to Minimum Damage`);
      }
    }
    
    if (statLine.includes('to Maximum Damage')) {
      const match = statLine.match(/\+(\d+)\s*to Maximum Damage/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.flatFireMax += value; // Adding to physical/fire
        console.log(`⚔️ +${value} to Maximum Damage`);
      }
    }
    
    // ATTRIBUTES - FIXED
    if (statLine.includes('to Strength')) {
      const match = statLine.match(/\+(\d+)\s*to Strength/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.strength += value;
        console.log(`💪 +${value} Strength`);
      }
    }
    
    if (statLine.includes('to Dexterity')) {
      const match = statLine.match(/\+(\d+)\s*to Dexterity/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.dexterity += value;
        console.log(`🏹 +${value} Dexterity`);
      }
    }
    
    if (statLine.includes('to Vitality')) {
      const match = statLine.match(/\+(\d+)\s*to Vitality/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.vitality += value;
        console.log(`❤️ +${value} Vitality`);
      }
    }
    
    if (statLine.includes('to Energy')) {
      const match = statLine.match(/\+(\d+)\s*to Energy/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.energy += value;
        console.log(`⚡ +${value} Energy`);
      }
    }
    
    // LEECH STATS - FIXED
    if (statLine.includes('Life Stolen per Hit')) {
      const match = statLine.match(/(\d+)%\s*Life Stolen per Hit/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.lifeSteal += value;
        console.log(`🩸 +${value}% Life Steal`);
      }
    }
    
    if (statLine.includes('Mana Stolen per Hit')) {
      const match = statLine.match(/(\d+)%\s*Mana Stolen per Hit/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.manaSteal += value;
        console.log(`💙 +${value}% Mana Steal`);
      }
    }
    
    // COMBAT STATS - FIXED
    if (statLine.includes('Increased Attack Speed')) {
      const match = statLine.match(/\+?(\d+)%\s*Increased Attack Speed/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.ias += value;
        console.log(`⚡ +${value}% IAS`);
      }
    }
    
    if (statLine.includes('Deadly Strike')) {
      const match = statLine.match(/(\d+)%\s*Deadly Strike/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.deadlyStrike += value;
        console.log(`💀 +${value}% Deadly Strike`);
      }
    }
    
    if (statLine.includes('Chance of Open Wounds')) {
      const match = statLine.match(/(\d+)%\s*Chance of Open Wounds/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.openWounds += value;
        console.log(`🩸 +${value}% Open Wounds`);
      }
    }
    
    if (statLine.includes('Chance of Crushing Blow')) {
      const match = statLine.match(/(\d+)%\s*Chance of Crushing Blow/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.crushingBlow += value;
        console.log(`💥 +${value}% Crushing Blow`);
      }
    }
    
    // GOLD FIND - FIXED
    if (statLine.includes('Extra Gold From Monsters')) {
      const match = statLine.match(/(\d+)%\s*Extra Gold From Monsters/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.goldFind += value;
        console.log(`💰 +${value}% Gold Find`);
      }
    }
    
    // Block Chance - FIXED
    if (statLine.includes('Increased Chance of Blocking')) {
      const match = statLine.match(/(\d+)%\s*Increased Chance of Blocking/i);
      if (match) {
        const value = parseInt(match[1]);
        this.stats.blockChance += value;
        console.log(`🛡️ +${value}% Block Chance`);
      }
    }
    
    // Cannot Be Frozen
    if (statLine.includes('Cannot Be Frozen')) {
      this.stats.cbf = true;
      console.log(`❄️ Cannot Be Frozen`);
    }
  });
}
  
  updateAllStatsDisplays() {
  console.log('📊 Updating all stats displays...');
  
  // Core Stats
  this.updateContainer('lifecontainer', this.stats.life);
  this.updateContainer('manacontainer', this.stats.mana);
  this.updateContainer('defensecontainer', this.stats.defense);
  this.updateContainer('attackratingcontainer', this.stats.attackRating);
  
  // Magic Find & Gold Find
  this.updateContainer('magicfindcontainer', this.stats.magicFind);
  this.updateContainer('goldfindcontainer', this.stats.goldFind);
  
  // Enhanced Damage
  this.updateContainer('enhanceddamagecontainer', this.stats.enhancedDamage);
  
  // Resistances
  this.updateContainer('fireresistcontainer', this.stats.fireResist);
  this.updateContainer('coldresistcontainer', this.stats.coldResist);
  this.updateContainer('lightresistcontainer', this.stats.lightResist);
  this.updateContainer('poisonresistcontainer', this.stats.poisonResist);
  this.updateContainer('curseresistcontainer', this.stats.curseResist);
  
  // Pierce Resistances (if containers exist)
  this.updateContainer('piercefirecontainer', this.stats.pierceFire);
  this.updateContainer('piercecoldcontainer', this.stats.pierceCold);
  this.updateContainer('piercelightcontainer', this.stats.pierceLight);
  this.updateContainer('piercepoisoncontainer', this.stats.piercePoison);
  this.updateContainer('piercemagiccontainer', this.stats.pierceMagic);
  this.updateContainer('piercephyscontainer', this.stats.piercePhys);
  
  // Added Elemental Damage
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
  
  // ✅ ATTRIBUTE BONUSES - now properly level-gated
  this.updateContainer('strengthcontainer', this.stats.strength);
  this.updateContainer('dexteritycontainer', this.stats.dexterity);
  this.updateContainer('vitalitycontainer', this.stats.vitality);
  this.updateContainer('energycontainer', this.stats.energy);
  
  // ✅ ALSO update the character display totals if they exist
  this.updateCharacterAttributeTotals();
  
  // Leech Stats
  this.updateContainer('lifestealcontainer', this.stats.lifeSteal);
  this.updateContainer('manastealcontainer', this.stats.manaSteal);
  
  // Speed Stats
  this.updateContainer('iascontainer', this.stats.ias);
  this.updateContainer('fcrcontainer', this.stats.fcr);
  this.updateContainer('frwcontainer', this.stats.frw);
  this.updateContainer('fhrcontainer', this.stats.fhr);
  
  // Combat Stats
  this.updateContainer('deadlystrikecontainer', this.stats.deadlyStrike);
  this.updateContainer('openwoundscontainer', this.stats.openWounds);
  this.updateContainer('crushingblowcontainer', this.stats.crushingBlow);
  this.updateContainer('criticalhitcontainer', this.stats.criticalHit);
  
  // Defensive Stats
  this.updateContainer('blockchancecontainer', this.stats.blockChance);
  this.updateContainer('drcontainer', this.stats.dr);
  this.updateContainer('pdrcontainer', this.stats.pdr);
  this.updateContainer('mdrcontainer', this.stats.mdr);
  this.updateContainer('plrcontainer', this.stats.plr);
  
  // Special Stats
  this.updateContainer('allskillscontainer', this.stats.allSkills);
  this.updateContainer('cbfcontainer', this.stats.cbf ? 'Yes' : 'No');
  
  console.log('📊 Stats display update complete!');
  
  // ✅ Log attribute bonuses for debugging
  console.log('Attribute bonuses:', {
    strength: this.stats.strength,
    dexterity: this.stats.dexterity,
    vitality: this.stats.vitality,
    energy: this.stats.energy
  });
}

updateCharacterAttributeTotals() {
  // Update total attribute displays if character system exists
  if (window.characterSystem) {
    const baseStr = parseInt(document.getElementById('str')?.value) || 0;
    const baseDex = parseInt(document.getElementById('dex')?.value) || 0;
    const baseVit = parseInt(document.getElementById('vit')?.value) || 0;
    const baseEnr = parseInt(document.getElementById('enr')?.value) || 0;
    
    // Show totals including equipment bonuses
    this.updateTotalDisplay('str', baseStr + this.stats.strength);
    this.updateTotalDisplay('dex', baseDex + this.stats.dexterity);
    this.updateTotalDisplay('vit', baseVit + this.stats.vitality);
    this.updateTotalDisplay('enr', baseEnr + this.stats.energy);
  }
}

// ✅ HELPER METHOD: Update total display for character attributes
updateTotalDisplay(statId, total) {
  let totalDiv = document.getElementById(statId + 'Total');
  if (!totalDiv) {
    totalDiv = document.createElement('span');
    totalDiv.id = statId + 'Total';
    totalDiv.style.cssText = 'color: #00ff00; font-weight: bold; margin-left: 10px;';
    
    const statRow = document.getElementById(statId)?.closest('.stat-row');
    if (statRow) statRow.appendChild(totalDiv);
  }
  
  const base = parseInt(document.getElementById(statId)?.value) || 0;
  totalDiv.textContent = total > base ? ` (${total})` : '';
}

// ENHANCED: updateContainer with better error handling and visual feedback
updateContainer(containerId, value) {
  const container = document.getElementById(containerId);
  if (container) {
    if (typeof value === 'boolean') {
      container.textContent = value ? 'Yes' : 'No';
      container.style.color = value ? '#00ff00' : '#ffffff';
    } else if (typeof value === 'string') {
      container.textContent = value;
    } else {
      container.textContent = Math.round(value).toString();
      
      // Add visual feedback for positive values
      if (value > 0) {
        container.style.color = '#4a90e2';
        container.style.fontWeight = 'bold';
      } else {
        container.style.color = '';
        container.style.fontWeight = '';
      }
    }
  } else {
    // Only warn about containers we expect to exist
    const expectedContainers = [
      'lifecontainer', 'manacontainer', 'defensecontainer', 'magicfindcontainer',
      'fireresistcontainer', 'coldresistcontainer', 'lightresistcontainer', 'poisonresistcontainer',
      'flatfiremincontainer', 'flatfiremaxcontainer', 'flatcoldmincontainer', 'flatcoldmaxcontainer',
      'flatlightmincontainer', 'flatlightmaxcontainer', 'attackratingcontainer', 'enhanceddamagecontainer'
    ];
    
    if (expectedContainers.includes(containerId)) {
      console.warn(`⚠️ Container '${containerId}' not found in DOM`);
    }
  }
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
    