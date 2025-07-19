// ===================================================================
// ULTRA-LIGHTWEIGHT UNIFIED SOCKET SYSTEM v3.0
// Combines main-init.js, socket-system.js, and character.js
// Everything works from the start - no recursions needed!
// ===================================================================

class UnifiedSocketSystem {
  constructor() {
    this.isInitializing = true;
    this.currentLevel = 1;
    this.currentSocket = null;
    this.targetSocket = null;
    
    // Character base stats by class
    this.classStats = {
      'Amazon': { str: 20, dex: 25, vit: 20, enr: 15 },
      'Necromancer': { str: 15, dex: 25, vit: 15, enr: 25 },
      'Barbarian': { str: 30, dex: 20, vit: 25, enr: 10 },
      'Sorceress': { str: 10, dex: 25, vit: 10, enr: 35 },
      'Paladin': { str: 25, dex: 20, vit: 25, enr: 15 },
      'Assassin': { str: 20, dex: 20, vit: 20, enr: 25 },
      'Druid': { str: 15, dex: 20, vit: 25, enr: 20 }
    };
    
    // Equipment mapping for ultra-fast lookups
    this.equipmentMap = {
      'weapons-dropdown': { info: 'weapon-info', section: 'weapon' },
      'helms-dropdown': { info: 'helm-info', section: 'helm' },
      'armors-dropdown': { info: 'armor-info', section: 'armor' },
      'offs-dropdown': { info: 'off-info', section: 'shield' },
      'gloves-dropdown': { info: 'glove-info', section: 'gloves' },
      'belts-dropdown': { info: 'belt-info', section: 'belts' },
      'boots-dropdown': { info: 'boot-info', section: 'boots' },
      'ringsone-dropdown': { info: 'ringsone-info', section: 'ringone' },
      'ringstwo-dropdown': { info: 'ringstwo-info', section: 'ringtwo' },
      'amulets-dropdown': { info: 'amulet-info', section: 'amulet' }
    };
    
    // Fast stats tracking
    this.stats = {
      strength: 0, dexterity: 0, vitality: 0, energy: 0,
      allSkills: 0, magicFind: 0, goldFind: 0, defense: 0,
      ias: 0, fcr: 0, frw: 0, fhr: 0,
      fireResist: 0, coldResist: 0, lightResist: 0, poisonResist: 0,
      allResistances: 0, crushingBlow: 0, deadlyStrike: 0, openWounds: 0,
      life: 0, mana: 0, dr: 0, pdr: 0, mdr: 0, cbf: false,
      lightDmgMin: 0, lightDmgMax: 0, fireDmgMin: 0, fireDmgMax: 0,
      coldDmgMin: 0, coldDmgMax: 0, poisonDmgMin: 0, poisonDmgMax: 0
    };
    
    // Jewel system
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;
    
    this.initializeSocketData();
    this.initializeJewelData();
    this.init();
  }
  
  init() {

    
    try {
      this.addStyles();
      this.createSocketModal();
      this.createJewelModal();
      this.initializeSocketContainers();
      this.setupEventListeners();
      this.setInitialCharacterStats();
      
      // Make addSocket globally available immediately
      window.addSocket = (section) => this.addSocket(section);

      
      setTimeout(() => {
        this.isInitializing = false;
        this.updateAll();

      }, 100);
      
    } catch (error) {

    }
  }

  // === SOCKET DATA INITIALIZATION ===
  initializeSocketData() {
    this.socketData = {
      gems: {
        'chipped-topaz': { 
          name: 'Chipped Topaz', 
          img: 'img/chippedtopaz.png', 
          levelReq: 1,
          stats: { 
            weapon: 'Adds 1-8 Lightning Damage', 
            helm: '9% Better Chance of Getting Magic Items', 
            armor: '9% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +40%' 
          }
        },
        'flawed-topaz': { 
          name: 'Flawed Topaz', 
          img: 'img/flawedtopaz.png', 
          levelReq: 5,
          stats: { 
            weapon: 'Adds 1-14 Lightning Damage', 
            helm: '13% Better Chance of Getting Magic Items', 
            armor: '13% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +40%' 
          }
        },
        'topaz': { 
          name: 'Topaz', 
          img: 'img/topaz.png', 
          levelReq: 12,
          stats: { 
            weapon: 'Adds 1-22 Lightning Damage', 
            helm: '16% Better Chance of Getting Magic Items', 
            armor: '16% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +40%' 
          }
        },
        'flawless-topaz': { 
          name: 'Flawless Topaz', 
          img: 'img/flawlesstopaz.png', 
          levelReq: 15,
          stats: { 
            weapon: 'Adds 1-30 Lightning Damage', 
            helm: '20% Better Chance of Getting Magic Items', 
            armor: '20% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +40%' 
          }
        },
        'perfect-topaz': { 
          name: 'Perfect Topaz', 
          img: 'img/perfecttopaz2.png', 
          levelReq: 18,
          stats: { 
            weapon: 'Adds 1-40 Lightning Damage', 
            helm: '24% Better Chance of Getting Magic Items', 
            armor: '24% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +40%' 
          }
        },
        'chipped-ruby': { 
          name: 'Chipped Ruby', 
          img: 'img/chippedruby.png', 
          levelReq: 1,
          stats: { 
            weapon: 'Adds 3-4 Fire Damage', 
            helm: '+10 to Life', 
            armor: '+10 to Life', 
            shield: 'Fire Resist +12%' 
          }
        },
        'flawed-ruby': { 
          name: 'Flawed ruby', 
          img: 'img/flawedruby.png', 
          levelReq: 5,
          stats: { 
            weapon: 'Adds 5-8 Fire Damage', 
            helm: '+17 to Life', 
            armor: '+17 to Life', 
            shield: 'Fire Resist +16%' 
          }
        },
        'ruby': { 
          name: 'ruby', 
          img: 'img/Ruby.png', 
          levelReq: 12,
          stats: { 
            weapon: 'Adds 8-12 Fire Damage', 
            helm: '+24 to Life', 
            armor: '+24 to Life', 
            shield: 'Fire Resist +22%' 
          }
        },
        'flawless-ruby': { 
          name: 'Flawless Ruby', 
          img: 'img/flawlessruby.png', 
          levelReq: 15,
          stats: { 
            weapon: 'Adds 10-16 Fire Damage', 
            helm: '+31 to Life', 
            armor: '+31 to Life', 
            shield: 'Fire Resist +28%' 
          }
        },
        'perfect-ruby': { 
          name: 'Perfect Ruby', 
          img: 'img/perfectruby2.png', 
          levelReq: 18,
          stats: { 
            weapon: 'Adds 15-20 Fire Damage', 
            helm: '+38 to Life', 
            armor: '+38 to Life', 
            shield: 'Fire Resist +40%' 
          }
        },
        'chipped-sapphire': { 
          name: 'Chipped Sapphire', 
          img: 'img/chippedsapphire.png', 
          levelReq: 1,
          stats: { 
            weapon: 'Adds 1-3 Cold Damage', 
            helm: '+10 to Mana', 
            armor: '+10 to Mana', 
            shield: 'Cold Resist +12%' 
          }
        },
        'flawed-sapphire': { 
          name: 'Flawed Sapphire', 
          img: 'img/flawedsapphire.png', 
          levelReq: 5,
          stats: { 
            weapon: 'Adds 3-5 Cold Damage', 
            helm: '+17 to Mana', 
            armor: '+17 to Mana', 
            shield: 'Cold Resist +16%' 
          }
        },
        'sapphire': { 
          name: 'Sapphire', 
          img: 'img/sapphire.png', 
          levelReq: 12,
          stats: { 
            weapon: 'Adds 4-7 Cold Damage', 
            helm: '+24 to Mana', 
            armor: '+24 to Mana', 
            shield: 'Cold Resist +22%' 
          }
        },
        'flawless-sapphire': { 
          name: 'Flawless Sapphire', 
          img: 'img/flawlesssapphire.png', 
          levelReq: 15,
          stats: { 
            weapon: 'Adds 6-10 Cold Damage', 
            helm: '+31 to Mana', 
            armor: '+31 to Mana', 
            shield: 'Cold Resist +28%' 
          }
        },
        'perfect-sapphire': { 
          name: 'Perfect Sapphire', 
          img: 'img/perfectsapphire2.png', 
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
            weapon: 'Adds 100-100 Poison Damage over 7 Seconds', 
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
        },
        'perfect-skull': { 
          name: 'Perfect Skull', 
          img: 'img/perfectskull2.png', 
          levelReq: 18,
          stats: { 
            weapon: '4% Life Stolen per Hit, 3% Mana Stolen per Hit', 
            helm: 'Regenerate Mana 19%, Replenish Life +5', 
            armor: 'Regenerate Mana 19%, Replenish Life +5', 
            shield: 'Attacker Takes Damage of 20' 
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
        'rare-jewel': { 
          name: 'Rare Jewel', img: 'img/jewel1.png', levelReq: 1, 
          stats: { weapon: '+15% Enhanced Damage', armor: '+15% Enhanced Damage', 
                  helm: '+15% Enhanced Damage', shield: '+15% Enhanced Damage' }
        }
      }
    };
  }

  initializeJewelData() {
    this.jewelPrefixes = {
      'sharp': { name: 'Sharp', effect: '1 to 50 Enhanced Damage', range: [1, 50] },
      'fine': { name: 'Fine', effect: '51 to 100 Enhanced Damage', range: [51, 100] },
      'warrior\'s': { name: 'Warrior\'s', effect: '101 to 150 Enhanced Damage', range: [101, 150] },
      'sturdy': { name: 'Sturdy', effect: '1 to 25 to Life', range: [1, 25] },
      'strong': { name: 'Strong', effect: '26 to 50 to Life', range: [26, 50] },
      'glorious': { name: 'Glorious', effect: '51 to 75 to Life', range: [51, 75] },
      'ruby': { name: 'Ruby', effect: '+[10-30] to Attack Rating', range: [10, 30] },
      'garnet': { name: 'Garnet', effect: '+[31-60] to Attack Rating', range: [31, 60] },
      'crimson': { name: 'Crimson', effect: '+[101-150] to Attack Rating', range: [101, 150] },
      'red': { name: 'Red', effect: 'Fire Resist +[5-15]%', range: [5, 15] },
      'vermillion': { name: 'Vermillion', effect: 'Fire Resist +[16-30]%', range: [16, 30] },
      'coral': { name: 'Coral', effect: 'Lightning Resist +[5-15]%', range: [5, 15] },
      'azure': { name: 'Azure', effect: 'Cold Resist +[5-15]%', range: [5, 15] },
      'emerald': { name: 'Emerald', effect: 'Poison Resist +[5-15]%', range: [5, 15] }
    };
    
    this.jewelSuffixes = {
      'of_the_mammoth': { name: 'of the Mammoth', effect: '21 to 30 to Life', range: [21, 30] },
      'of_the_colossus': { name: 'of the Colossus', effect: '31 to 40 to Life', range: [31, 40] },
      'of_the_squid': { name: 'of the Squid', effect: '21 to 30 to Mana', range: [21, 30] },
      'of_the_whale': { name: 'of the Whale', effect: '31 to 40 to Mana', range: [31, 40] },
      'of_perfection': { name: 'of Perfection', effect: '15 to All Resistances', range: [15, 15] },
      'of_balance': { name: 'of Balance', effect: '20 Faster Cast Rate', range: [20, 20] },
      'of_speed': { name: 'of Speed', effect: '20 Increased Attack Speed', range: [20, 20] },
      'of_luck': { name: 'of Luck', effect: '40 Better Chance of Getting Magic Items', range: [40, 40] },
      'of_greed': { name: 'of Greed', effect: '80 Extra Gold from Monsters', range: [80, 80] },
      'of_slaughter': { name: 'of Slaughter', effect: '25 Deadly Strike', range: [25, 25] },
      'of_carnage': { name: 'of Carnage', effect: '25 Crushing Blow', range: [25, 25] },
      'of_maiming': { name: 'of Maiming', effect: '25 Open Wounds', range: [25, 25] }
    };
  }

  // === CHARACTER STATS INITIALIZATION ===
  setInitialCharacterStats() {
    const classDropdown = document.getElementById('selectClass');
    const currentClass = classDropdown?.value || 'Amazon';
    const baseStats = this.classStats[currentClass];
    
    if (baseStats) {
      const strInput = document.getElementById('str');
      const dexInput = document.getElementById('dex');
      const vitInput = document.getElementById('vit');
      const enrInput = document.getElementById('enr');
      const lvlInput = document.getElementById('lvlValue');
      
      if (strInput) strInput.value = baseStats.str;
      if (dexInput) dexInput.value = baseStats.dex;
      if (vitInput) vitInput.value = baseStats.vit;
      if (enrInput) enrInput.value = baseStats.enr;
      if (lvlInput) lvlInput.value = 1;
      
      this.currentLevel = 1;

    }
  }

  // === SOCKET CONTAINER INITIALIZATION ===
  initializeSocketContainers() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
    
    sections.forEach(section => {
      const infoId = this.getSectionInfoId(section);
      const infoDiv = document.getElementById(infoId);
      
      if (infoDiv && !infoDiv.querySelector('.socket-container')) {
        const socketContainer = document.createElement('div');
        socketContainer.className = 'socket-container';
        socketContainer.dataset.section = section;
        socketContainer.innerHTML = `
          <div class="socket-grid sockets-0"></div>
          <button class="add-socket-btn" onclick="addSocket('${section}')">Add Socket</button>
        `;
        infoDiv.appendChild(socketContainer);
      }
    });
  }

  // === EVENT LISTENERS ===
  setupEventListeners() {
    // Class change
    const classDropdown = document.getElementById('selectClass');
    if (classDropdown) {
      classDropdown.addEventListener('change', () => this.setInitialCharacterStats());
    }
    
    // Level change
    const levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', () => {
        this.currentLevel = parseInt(levelInput.value) || 1;
        this.updateAll();
      });
    }
    
    // Equipment changes
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          setTimeout(() => this.updateAll(), 50);
        });
      }
    });
    
    // Socket clicks (delegated)
     // Socket slot clicks - THE KEY FEATURE YOU WANTED
  document.addEventListener('click', (e) => {
  // Check if we clicked a socket slot OR anything inside it (like the img)
  const socketSlot = e.target.closest('.socket-slot');
  
  if (socketSlot) {
    this.currentSocket = socketSlot; // Always get the socket container
    this.showSocketModal();          // Open modal to change/add item
  }
});
    
    // Stat changes
    ['str', 'dex', 'vit', 'enr'].forEach(stat => {
      const input = document.getElementById(stat);
      if (input) {
        input.addEventListener('input', () => this.updateStatsDisplay());
      }
    });
  }

  // === SOCKET MANAGEMENT ===
  addSocket(section) {

    
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      console.error(`❌ No socket container found for section: ${section}`);
      return;
    }
    
    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      console.error(`❌ No socket grid found in container for section: ${section}`);
      return;
    }
    
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
    

  }

  handleSocketClick(e) {
    const socket = e.target;
    
    if (socket.classList.contains('filled')) {
      if (e.shiftKey || e.ctrlKey) {
        this.clearSocket(socket);
      } else {
        this.currentSocket = socket;
        this.showSocketModal();
      }
    } else {
      this.currentSocket = socket;
      this.showSocketModal();
    }
  }
  
  clearSocket(socket) {
    socket.className = 'socket-slot empty';
    socket.innerHTML = '';
    
    ['itemKey', 'category', 'itemName', 'stats', 'levelReq'].forEach(attr => {
      delete socket.dataset[attr];
    });
    
    this.updateAll();
  }

  fillSocket(itemKey, category) {
  if (!this.currentSocket) return;
  
  const item = this.socketData[category]?.[itemKey];
  if (!item) return;
  
  // Clear old data first (in case it was filled)
  ['itemKey', 'category', 'itemName', 'stats', 'levelReq'].forEach(attr => {
    delete this.currentSocket.dataset[attr];
  });
  
  // Fill with new item (replaces old one)
  this.currentSocket.className = 'socket-slot filled';
  this.currentSocket.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
  
  // Store new socket data
  this.currentSocket.dataset.itemKey = itemKey;
  this.currentSocket.dataset.category = category;
  this.currentSocket.dataset.itemName = item.name;
  this.currentSocket.dataset.levelReq = item.levelReq || 1;
  
  const section = this.currentSocket.closest('.socket-container')?.dataset.section;
  const stats = typeof item.stats === 'object' ? item.stats[section] : item.stats;
  
  if (stats) {
    this.currentSocket.dataset.stats = stats;
  }
  
  this.hideSocketModal();
  this.currentSocket = null;
  this.updateAll();
}
  // === MODAL CREATION ===
  createSocketModal() {
    if (document.getElementById('socketModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'socketModal';
    modal.className = 'socket-modal';
    modal.innerHTML = `
      <div class="socket-modal-content">
        <span class="socket-close">&times;</span>
        <h3>Select Socket Item</h3>
        <div class="socket-tabs">
          <button class="socket-tab active" data-category="gems">Gems</button>
          <button class="socket-tab" data-category="runes">Runes</button>
          <button class="socket-tab" data-category="jewels">Jewels</button>
        </div>
        <div id="socketItemGrid" class="socket-item-grid"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event handlers
    modal.querySelector('.socket-close').onclick = () => this.hideSocketModal();
    modal.onclick = (e) => {
      if (e.target === modal) this.hideSocketModal();
    };
    
    modal.querySelectorAll('.socket-tab').forEach(tab => {
      tab.onclick = () => this.switchSocketTab(tab.dataset.category);
    });
  }

  createJewelModal() {
    if (document.getElementById('jewelModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'jewelModal';
    modal.className = 'socket-modal';
    modal.innerHTML = `
      <div class="socket-modal-content">
        <span class="socket-close">&times;</span>
        <h3>Create Custom Jewel</h3>
        
        <div class="jewel-creation-section">
          <h4>1. Select Color</h4>
          <div class="jewel-color-grid">
            ${['white', 'blue', 'yellow', 'green', 'orange', 'red'].map(color => `
              <div class="color-option ${color === 'white' ? 'selected' : ''}" data-color="${color}" 
                   style="background: ${color}; border: 2px solid ${color === 'white' ? '#000' : color};">
                ${color.charAt(0).toUpperCase() + color.slice(1)}
              </div>
            `).join('')}
          </div>
          
          <h4>2. Select Prefix</h4>
          <select id="jewelPrefixSelect">
            <option value="">No Prefix</option>
            ${Object.entries(this.jewelPrefixes).map(([key, prefix]) => 
              `<option value="${key}">${prefix.name} - ${prefix.effect}</option>`
            ).join('')}
          </select>
          
          <div id="prefixValueContainer" style="display: none;">
            <label>Prefix Value: <span id="prefixValueDisplay">0</span></label>
            <input type="range" id="prefixValue" min="0" max="100" value="0">
          </div>
          
          <h4>3. Select Suffix</h4>
          <select id="jewelSuffixSelect">
            <option value="">No Suffix</option>
            ${Object.entries(this.jewelSuffixes).map(([key, suffix]) => 
              `<option value="${key}">${suffix.name} - ${suffix.effect}</option>`
            ).join('')}
          </select>
          
          <div id="suffixValueContainer" style="display: none;">
            <label>Suffix Value: <span id="suffixValueDisplay">0</span></label>
            <input type="range" id="suffixValue" min="0" max="100" value="0">
          </div>
          
          <div id="jewelPreview" class="jewel-preview">
            White Jewel
          </div>
          
          <button id="createJewelBtn" class="create-jewel-btn">Create Jewel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.setupJewelModalEvents();
  }

  setupJewelModalEvents() {
    const modal = document.getElementById('jewelModal');
    
    // Close handlers
    modal.querySelector('.socket-close').onclick = () => this.hideJewelModal();
    modal.onclick = (e) => {
      if (e.target === modal) this.hideJewelModal();
    };
    
    // Color selection
    modal.querySelectorAll('.color-option').forEach(option => {
      option.onclick = () => {
        modal.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedJewelColor = option.dataset.color;
        this.updateJewelPreview();
      };
    });
    
    // Prefix selection
    modal.querySelector('#jewelPrefixSelect').onchange = (e) => {
      this.selectedJewelPrefix = e.target.value;
      this.updatePrefixValueInput();
      this.updateJewelPreview();
    };
    
    // Suffix selection
    modal.querySelector('#jewelSuffixSelect').onchange = (e) => {
      this.selectedJewelSuffix = e.target.value;
      this.updateSuffixValueInput();
      this.updateJewelPreview();
    };
    
    // Value inputs
    modal.querySelector('#prefixValue').oninput = (e) => {
      this.selectedJewelPrefixValue = e.target.value;
      modal.querySelector('#prefixValueDisplay').textContent = e.target.value;
      this.updateJewelPreview();
    };
    
    modal.querySelector('#suffixValue').oninput = (e) => {
      this.selectedJewelSuffixValue = e.target.value;
      modal.querySelector('#suffixValueDisplay').textContent = e.target.value;
      this.updateJewelPreview();
    };
    
    // Create jewel button
    modal.querySelector('#createJewelBtn').onclick = () => this.createCustomJewel();
  }

  // === MODAL MANAGEMENT ===
  showSocketModal() {
    const modal = document.getElementById('socketModal');
    if (modal) {
      modal.style.display = 'flex';
      this.switchSocketTab('gems'); // Default to gems
    }
  }
  
  hideSocketModal() {
    const modal = document.getElementById('socketModal');
    if (modal) modal.style.display = 'none';
    this.currentSocket = null;
  }
  
  showJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) {
      modal.style.display = 'flex';
      this.resetJewelModal();
    }
  }
  
  hideJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) modal.style.display = 'none';
    this.targetSocket = null;
  }

  switchSocketTab(category) {
    const tabs = document.querySelectorAll('.socket-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    this.populateSocketItems(category);
  }
  
  populateSocketItems(category) {
    const grid = document.getElementById('socketItemGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Add custom jewel option for jewels category
    if (category === 'jewels') {
      const customJewelDiv = document.createElement('div');
      customJewelDiv.className = 'socket-item custom-jewel-item';
      customJewelDiv.innerHTML = `
        <img src="img/jewel1.png" alt="Custom Jewel">
        <div class="socket-item-name">Create Custom Jewel</div>
      `;
      customJewelDiv.onclick = () => {
        if (!this.currentSocket) {
          alert('Please try clicking the socket again.');
          this.hideSocketModal();
          return;
        }
        this.targetSocket = this.currentSocket;
        this.hideSocketModal();
        this.showJewelModal();
      };
      grid.appendChild(customJewelDiv);
    }
    
    // Add regular items
    const items = this.socketData[category] || {};
    Object.entries(items).forEach(([itemKey, item]) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'socket-item';
      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="socket-item-name">${item.name}</div>
        <div class="socket-item-level">Req Level: ${item.levelReq}</div>
      `;
      itemDiv.onclick = () => this.fillSocket(itemKey, category);
      grid.appendChild(itemDiv);
    });
  }

  // === JEWEL CREATION ===
  updatePrefixValueInput() {
    const container = document.getElementById('prefixValueContainer');
    const input = document.getElementById('prefixValue');
    const display = document.getElementById('prefixValueDisplay');
    
    if (this.selectedJewelPrefix && this.jewelPrefixes[this.selectedJewelPrefix]) {
      const range = this.jewelPrefixes[this.selectedJewelPrefix].range;
      container.style.display = 'block';
      input.min = range[0];
      input.max = range[1];
      input.value = range[0];
      display.textContent = range[0];
      this.selectedJewelPrefixValue = range[0];
    } else {
      container.style.display = 'none';
      this.selectedJewelPrefixValue = null;
    }
  }
  
  updateSuffixValueInput() {
    const container = document.getElementById('suffixValueContainer');
    const input = document.getElementById('suffixValue');
    const display = document.getElementById('suffixValueDisplay');
    
    if (this.selectedJewelSuffix && this.jewelSuffixes[this.selectedJewelSuffix]) {
      const range = this.jewelSuffixes[this.selectedJewelSuffix].range;
      container.style.display = 'block';
      input.min = range[0];
      input.max = range[1];
      input.value = range[0];
      display.textContent = range[0];
      this.selectedJewelSuffixValue = range[0];
    } else {
      container.style.display = 'none';
      this.selectedJewelSuffixValue = null;
    }
  }
  
  updateJewelPreview() {
    const preview = document.getElementById('jewelPreview');
    if (!preview) return;
    
    let jewelName = `${this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1)} Jewel`;
    let stats = [];
    
    if (this.selectedJewelPrefix && this.selectedJewelPrefixValue) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix];
      let effect = prefix.effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefixValue);
      stats.push(`<span style="color: #8888ff;">${effect}</span>`);
    }
    
    if (this.selectedJewelSuffix && this.selectedJewelSuffixValue) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix];
      let effect = suffix.effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffixValue);
      stats.push(`<span style="color: #8888ff;">${effect}</span>`);
    }
    
    preview.innerHTML = `
      <div style="color: ${this.getJewelColor()}; font-weight: bold;">${jewelName}</div>
      ${stats.length > 0 ? stats.join('<br>') : '<span style="color: #888;">No special properties</span>'}
    `;
  }
  
  getJewelColor() {
    const colors = {
      white: '#ffffff',
      blue: '#6666ff',
      yellow: '#ffff66',
      green: '#66ff66',
      orange: '#ff8800',
      red: '#ff6666'
    };
    return colors[this.selectedJewelColor] || '#ffffff';
  }
  
  resetJewelModal() {
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
  
  createCustomJewel() {
    const socketToUse = this.targetSocket || this.currentSocket;
    if (!socketToUse) {
      alert('No socket selected!');
      return;
    }
    
    // Create jewel stats string
    let stats = [];
    
    if (this.selectedJewelPrefix && this.selectedJewelPrefixValue) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix];
      let effect = prefix.effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefixValue);
      stats.push(effect);
    }
    
    if (this.selectedJewelSuffix && this.selectedJewelSuffixValue) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix];
      let effect = suffix.effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffixValue);
      stats.push(effect);
    }
    
    const jewelStats = stats.join(', ');
    const jewelName = `${this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1)} Jewel`;
    
    // Fill the socket
    socketToUse.className = 'socket-slot filled';
    socketToUse.innerHTML = `<img src="img/jewel1.png" alt="${jewelName}">`;
    socketToUse.dataset.itemKey = 'custom-jewel';
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = jewelName;
    socketToUse.dataset.stats = jewelStats;
    socketToUse.dataset.levelReq = '1';
    
    const section = socketToUse.closest('.socket-container')?.dataset.section || 'weapon';
    
    this.hideJewelModal();
    this.updateAll();
    
    // Reset selections
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;
    this.targetSocket = null;
  }

  // === STATS CALCULATION ===
  calculateActualRequiredLevel(section, itemName) {
    if (!itemList[itemName]) return 1;
    
    const item = itemList[itemName];
    let actualLevel = item.properties?.reqlvl || 1;
    
    // Check socket requirements
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    sockets.forEach(socket => {
      const socketLevel = parseInt(socket.dataset.levelReq) || 1;
      if (socketLevel > actualLevel) {
        actualLevel = socketLevel;
      }
    });
    
    return actualLevel;
  }

  updateAll() {
    if (this.isInitializing) return;
    
    this.updateAllItemDisplays();
    this.calculateAllStats();
    this.updateStatsDisplay();
  }

  updateAllItemDisplays() {
    Object.entries(this.equipmentMap).forEach(([dropdownId, config]) => {
      this.updateItemDisplay(config.section);
    });
  }

  // Replace your existing updateItemDisplay method with this enhanced version

updateItemDisplay(section) {
  
  
  const infoId = this.getSectionInfoId(section);
  const infoDiv = document.getElementById(infoId);
  if (!infoDiv) {
    console.warn(`❌ Info div '${infoId}' not found for section '${section}'`);
    return;
  }
  
  const dropdownId = this.getSectionDropdownId(section);
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown || !dropdown.value || !itemList[dropdown.value]) {
    infoDiv.innerHTML = '';
    return;
  }
  
  const item = itemList[dropdown.value];
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
  const meetsRequirement = currentLevel >= actualRequiredLevel;
  
  // Parse base item stats
  let baseDescription = item.description || '';
  const baseStats = this.parseStatsToMap(baseDescription);
  
  // Get socket stats and merge with base stats
  const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
  const socketItems = [];
  
  sockets.forEach(socket => {
    const stats = socket.dataset.stats;
    const itemName = socket.dataset.itemName;
    const levelReq = parseInt(socket.dataset.levelReq) || 1;
    
    if (stats && itemName) {
      socketItems.push({ 
        name: itemName, 
        stats, 
        levelReq, 
        usable: currentLevel >= levelReq && meetsRequirement
      });
      
      // Only merge stats if both item and socket are usable
      if (meetsRequirement && currentLevel >= levelReq) {
        const parsedSocketStats = this.parseStatsToMap(stats);
        this.mergeStatsMaps(baseStats, parsedSocketStats);
      }
    }
  });
  
  // Generate final description with stacked properties
  let finalDescription = this.generateStackedDescription(baseDescription, baseStats, socketItems);
  
  // Update Required Level display
  const levelColor = meetsRequirement ? '#00ff00' : '#ff5555';
  const newLevelLine = `<span style="color: ${levelColor}; font-weight: bold;">Required Level: ${actualRequiredLevel}</span>`;
  
  const levelPattern = /(?:<span[^>]*>)?Required Level: \d+(?:<\/span>)?/gi;
  if (levelPattern.test(finalDescription)) {
    finalDescription = finalDescription.replace(levelPattern, newLevelLine);
  }
  
  // Visual feedback for unusable items
  if (!meetsRequirement) {
    infoDiv.style.opacity = '0.6';
    infoDiv.style.filter = 'grayscale(50%)';
    infoDiv.title = `You need level ${actualRequiredLevel} to use this item`;
  } else {
    infoDiv.style.opacity = '1';
    infoDiv.style.filter = 'none';
    infoDiv.title = '';
  }
  
  infoDiv.innerHTML = finalDescription;
}

// Generate final description with stacked properties and visual indicators
generateStackedDescription(originalDescription, mergedStats, socketItems) {
  let finalDescription = originalDescription;
  
  // Replace stacked stats in original description with blue colored versions
  mergedStats.forEach((data, key) => {
    if (data.stacked || data.fromSocket) {
      const replacement = this.formatStackedStat(key, data);
      if (replacement) {
        const pattern = this.getStatPattern(key);
        if (pattern && !data.fromSocket) {
          // Replace existing stat line with stacked version
          finalDescription = finalDescription.replace(pattern, replacement);
        } else if (data.fromSocket) {
          // Add new socket-only stats in blue
          finalDescription += `${replacement}<br>`;
        }
      }
    }
  });
  
  // Add unusable socket items in gray
  const unusableEffects = socketItems.filter(item => !item.usable);
  unusableEffects.forEach(item => {
    const lines = item.stats.split(',');
    lines.forEach(line => {
      if (line.trim()) {
        finalDescription += `<br><span style="color: #888; font-style: italic;">${line.trim()} (Level ${item.levelReq} Required)</span>`;
      }
    });
  });
  
  return finalDescription;
}

// Add stacking styles
addStackingStyles() {
  const styles = `
    <style id="socket-stacking-styles">
      .stacked-stat {
        color: #4a90e2 !important;
        font-weight: bold !important;
      }
      
      .socket-stat {
        color: #4a90e2 !important;
        font-weight: bold !important;
      }
      
      .unusable-socket-stat {
        color: #888 !important;
        font-style: italic !important;
      }
      
      .item-unusable {
        opacity: 0.6;
        filter: grayscale(50%);
      }
    </style>
  `;
  
  if (!document.getElementById('socket-stacking-styles')) {
    document.head.insertAdjacentHTML('beforeend', styles);
  }
}

  getSocketEnhancements(section) {
    const enhancements = [];
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    
    sockets.forEach(socket => {
      if (socket.dataset.stats) {
        enhancements.push(socket.dataset.stats);
      }
    });
    
    return enhancements;
  }

  calculateAllStats() {
    // Reset stats
    Object.keys(this.stats).forEach(key => {
      this.stats[key] = typeof this.stats[key] === 'boolean' ? false : 0;
    });
    
  
    
    // Calculate equipment stats
    Object.entries(this.equipmentMap).forEach(([dropdownId, config]) => {
      this.calculateEquipmentStats(dropdownId, config.section);
    });
    
    // Calculate socket stats
    this.calculateSocketStats();
    
if (window.characterStatManager) {
  window.characterStatManager.updateAllStatDisplays();
}
  }

  calculateEquipmentStats(dropdownId, section) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value || !itemList[dropdown.value]) return;
    
    const item = itemList[dropdown.value];
    const actualLevel = this.calculateActualRequiredLevel(section, dropdown.value);
    
    // Only apply stats if level requirement is met
    if (this.currentLevel >= actualLevel && item.properties) {
      this.parseItemStats(item, section);
    }
  }

  calculateSocketStats() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
    
    sections.forEach(section => {
      const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
      
      sockets.forEach(socket => {
        const levelReq = parseInt(socket.dataset.levelReq) || 1;
        
        // Only apply socket stats if level requirement is met
        if (this.currentLevel >= levelReq && socket.dataset.stats) {
          this.parseSocketStats(socket.dataset.stats, section);
        }
      });
    });
  }

  parseItemStats(item, section) {
    if (!item.description) return;
    
    const lines = item.description.split('<br>');
    lines.forEach(line => this.parseStatLine(line.trim()));
  }

  parseSocketStats(statsText, section) {
    if (!statsText) return;
    
    const lines = statsText.split(',');
    lines.forEach(line => this.parseStatLine(line.trim()));
  }

  parseStatLine(line) {
    if (!line) return;
    
    const cleanLine = line.replace(/<[^>]*>/g, '').trim();
    if (!cleanLine) return;
    
    // Attributes
    const strMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?(?:Strength|STR)/i);
    if (strMatch) { this.stats.strength += parseInt(strMatch[1]); return; }
    
    const dexMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?(?:Dexterity|DEX)/i);
    if (dexMatch) { this.stats.dexterity += parseInt(dexMatch[1]); return; }
    
    const vitMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?(?:Vitality|VIT)/i);
    if (vitMatch) { this.stats.vitality += parseInt(vitMatch[1]); return; }
    
    const enrMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?(?:Energy|ENR)/i);
    if (enrMatch) { this.stats.energy += parseInt(enrMatch[1]); return; }
    
    // Life and Mana
    const lifeMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Life/i);
    if (lifeMatch) { this.stats.life += parseInt(lifeMatch[1]); return; }
    
    const manaMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Mana/i);
    if (manaMatch) { this.stats.mana += parseInt(manaMatch[1]); return; }
    
    // Resistances
    const allResMatch = cleanLine.match(/All\s+Resistances?\s+(?:\+)?(\d+)%?/i);
    if (allResMatch) { 
      const value = parseInt(allResMatch[1]);
      this.stats.allResistances += value;
      this.stats.fireResist += value;
      this.stats.coldResist += value;
      this.stats.lightResist += value;
      this.stats.poisonResist += value;
      return; 
    }
    
    const fireResMatch = cleanLine.match(/Fire\s+Resist\s+(?:\+)?(\d+)%?/i);
    if (fireResMatch) { this.stats.fireResist += parseInt(fireResMatch[1]); return; }
    
    const coldResMatch = cleanLine.match(/Cold\s+Resist\s+(?:\+)?(\d+)%?/i);
    if (coldResMatch) { this.stats.coldResist += parseInt(coldResMatch[1]); return; }
    
    const lightResMatch = cleanLine.match(/Lightning\s+Resist\s+(?:\+)?(\d+)%?/i);
    if (lightResMatch) { this.stats.lightResist += parseInt(lightResMatch[1]); return; }
    
    const poisonResMatch = cleanLine.match(/Poison\s+Resist\s+(?:\+)?(\d+)%?/i);
    if (poisonResMatch) { this.stats.poisonResist += parseInt(poisonResMatch[1]); return; }
    
    // Magic Find
    const mfMatch = cleanLine.match(/(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i);
    if (mfMatch) { this.stats.magicFind += parseInt(mfMatch[1]); return; }
    
    // Gold Find
    const gfMatch = cleanLine.match(/(\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i);
    if (gfMatch) { this.stats.goldFind += parseInt(gfMatch[1]); return; }
    
    // Combat stats
    const cbMatch = cleanLine.match(/(\d+)%\s+Chance\s+of\s+Crushing\s+Blow/i);
    if (cbMatch) { this.stats.crushingBlow += parseInt(cbMatch[1]); return; }
    
    const dsMatch = cleanLine.match(/(\d+)%\s+Deadly\s+Strike/i);
    if (dsMatch) { this.stats.deadlyStrike += parseInt(dsMatch[1]); return; }
    
    const owMatch = cleanLine.match(/(\d+)%\s+Chance\s+of\s+Open\s+Wounds/i);
    if (owMatch) { this.stats.openWounds += parseInt(owMatch[1]); return; }
    
    // Speed stats
    const iasMatch = cleanLine.match(/(\d+)%\s+Increased\s+Attack\s+Speed/i);
    if (iasMatch) { this.stats.ias += parseInt(iasMatch[1]); return; }
    
    const fcrMatch = cleanLine.match(/(\d+)%\s+Faster\s+Cast\s+Rate/i);
    if (fcrMatch) { this.stats.fcr += parseInt(fcrMatch[1]); return; }
    
    const frwMatch = cleanLine.match(/(\d+)%\s+Faster\s+Run\/Walk/i);
    if (frwMatch) { this.stats.frw += parseInt(frwMatch[1]); return; }
    
    const fhrMatch = cleanLine.match(/(\d+)%\s+Faster\s+Hit\s+Recovery/i);
    if (fhrMatch) { this.stats.fhr += parseInt(fhrMatch[1]); return; }
    
    // Damage ranges
    const lightDmgMatch = cleanLine.match(/Adds\s+(\d+)(?:-(\d+))?\s+Lightning\s+Damage/i);
    if (lightDmgMatch) {
      this.stats.lightDmgMin += parseInt(lightDmgMatch[1]);
      this.stats.lightDmgMax += parseInt(lightDmgMatch[2] || lightDmgMatch[1]);
      return;
    }
    
    const fireDmgMatch = cleanLine.match(/Adds\s+(\d+)(?:-(\d+))?\s+Fire\s+Damage/i);
    if (fireDmgMatch) {
      this.stats.fireDmgMin += parseInt(fireDmgMatch[1]);
      this.stats.fireDmgMax += parseInt(fireDmgMatch[2] || fireDmgMatch[1]);
      return;
    }
    
    const coldDmgMatch = cleanLine.match(/Adds\s+(\d+)(?:-(\d+))?\s+Cold\s+Damage/i);
    if (coldDmgMatch) {
      this.stats.coldDmgMin += parseInt(coldDmgMatch[1]);
      this.stats.coldDmgMax += parseInt(coldDmgMatch[2] || coldDmgMatch[1]);
      return;
    }
    
    const poisonDmgMatch = cleanLine.match(/Adds\s+(\d+)(?:-(\d+))?\s+Poison\s+Damage/i);
    if (poisonDmgMatch) {
      this.stats.poisonDmgMin += parseInt(poisonDmgMatch[1]);
      this.stats.poisonDmgMax += parseInt(poisonDmgMatch[2] || poisonDmgMatch[1]);
      return;
    }
    // Cannot be frozen
    if (cleanLine.match(/Cannot\s+Be\s+Frozen/i)) {
      this.stats.cbf = true;
      return;
    }
    
    // Defense
  const defMatch = cleanLine.match(/^Defense:\s*(\d+)/i);
if (defMatch) {
  this.stats.defense += parseInt(defMatch[1]);
  return;
}
    
    // All Skills
    const skillsMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?All\s+Skills/i);
    if (skillsMatch) { this.stats.allSkills += parseInt(skillsMatch[1]); return; }
  }

// Add these methods to your existing socket.js class

// Enhanced stat parsing with stacking support
parseStatsToMap(statsText) {
  const statsMap = new Map();
  const lines = statsText.split('<br>').filter(line => line.trim());
  
  lines.forEach(line => {
    const cleanLine = line.replace(/<[^>]*>/g, '').trim();
    if (!cleanLine) return;
    
    // Lightning Damage: 1-55, Adds 1-55 Lightning Damage
    const lightningMatch = cleanLine.match(/(?:Adds\s+)?(\d+)-(\d+)\s+Lightning\s+Damage/i);
    if (lightningMatch) {
      const min = parseInt(lightningMatch[1]);
      const max = parseInt(lightningMatch[2]);
      this.addToStatsMap(statsMap, 'lightning_damage', { min, max, type: 'lightning' });
      return;
    }
    
    // Fire Damage: 1-6, Adds 1-6 Fire Damage  
    const fireMatch = cleanLine.match(/(?:Adds\s+)?(\d+)-(\d+)\s+Fire\s+Damage/i);
    if (fireMatch) {
      const min = parseInt(fireMatch[1]);
      const max = parseInt(fireMatch[2]);
      this.addToStatsMap(statsMap, 'fire_damage', { min, max, type: 'fire' });
      return;
    }
    
    // Cold Damage: 1-3, Adds 1-3 Cold Damage
    const coldMatch = cleanLine.match(/(?:Adds\s+)?(\d+)-(\d+)\s+Cold\s+Damage/i);
    if (coldMatch) {
      const min = parseInt(coldMatch[1]);
      const max = parseInt(coldMatch[2]);
      this.addToStatsMap(statsMap, 'cold_damage', { min, max, type: 'cold' });
      return;
    }
    
    // Poison Damage: 1-4 over 2 seconds, +5 Poison Damage over 2 Seconds
    const poisonMatch = cleanLine.match(/(?:\+)?(\d+)(?:-(\d+))?\s+Poison\s+Damage/i);
    if (poisonMatch) {
      const min = parseInt(poisonMatch[1]);
      const max = poisonMatch[2] ? parseInt(poisonMatch[2]) : min;
      this.addToStatsMap(statsMap, 'poison_damage', { min, max, type: 'poison' });
      return;
    }
    
    // Resistances: Fire Resist +30%, Lightning Resist +30%
    const resMatch = cleanLine.match(/(Fire|Cold|Lightning|Poison)\s+Resist\s+\+?(\d+)%?/i);
    if (resMatch) {
      const type = resMatch[1].toLowerCase();
      const value = parseInt(resMatch[2]);
      this.addToStatsMap(statsMap, `${type}_resist`, { value });
      return;
    }
    
    // All Resistances +15%
    const allResMatch = cleanLine.match(/All\s+Resistances\s+\+?(\d+)%?/i);
    if (allResMatch) {
      const value = parseInt(allResMatch[1]);
      ['fire', 'cold', 'lightning', 'poison'].forEach(type => {
        this.addToStatsMap(statsMap, `${type}_resist`, { value });
      });
      return;
    }
    
    // Attributes: +10 to Strength, +15 Dexterity, 20 to Vitality
    const attrMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?(Strength|Dexterity|Vitality|Energy)/i);
    if (attrMatch) {
      const value = parseInt(attrMatch[1]);
      const attr = attrMatch[2].toLowerCase();
      this.addToStatsMap(statsMap, attr, { value });
      return;
    }
    
    // Attack Rating: +50 to Attack Rating, +120 Attack Rating
    const arMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Attack\s+Rating/i);
    if (arMatch) {
      const value = parseInt(arMatch[1]);
      this.addToStatsMap(statsMap, 'attack_rating', { value });
      return;
    }
    
const fhrMatch = cleanLine.match(/(?:\+)?(\d+)%?\s+Faster\s+Hit\s+Recovery/i);
    if (fhrMatch) {
      const value = parseInt(fhrMatch[1]);
      this.addToStatsMap(statsMap, 'faster_hit_recovery', { value });
      return;
    }
    
    // Faster Block Rate: +10% Faster Block Rate
    const fbrMatch = cleanLine.match(/(?:\+)?(\d+)%?\s+Faster\s+Block\s+Rate/i);
    if (fbrMatch) {
      const value = parseInt(fbrMatch[1]);
      this.addToStatsMap(statsMap, 'faster_block_rate', { value });
      return;
    }
    
    // Faster Cast Rate: +10% Faster Cast Rate
    const fcrMatch = cleanLine.match(/(?:\+)?(\d+)%?\s+Faster\s+Cast\s+Rate/i);
    if (fcrMatch) {
      const value = parseInt(fcrMatch[1]);
      this.addToStatsMap(statsMap, 'faster_cast_rate', { value });
      return;
    }
    
    // Increased Attack Speed: +10% Increased Attack Speed
    const iasMatch = cleanLine.match(/(?:\+)?(\d+)%?\s+Increased\s+Attack\s+Speed/i);
    if (iasMatch) {
      const value = parseInt(iasMatch[1]);
      this.addToStatsMap(statsMap, 'increased_attack_speed', { value });
      return;
    }
    
    // Faster Run/Walk: +20% Faster Run/Walk
    const frwMatch = cleanLine.match(/(?:\+)?(\d+)%?\s+Faster\s+Run\/Walk/i);
    if (frwMatch) {
      const value = parseInt(frwMatch[1]);
      this.addToStatsMap(statsMap, 'faster_run_walk', { value });
      return;
    }
    
    // Magic Find: 25% Better Chance of Getting Magic Items
    const mfMatch = cleanLine.match(/(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i);
    if (mfMatch) {
      const value = parseInt(mfMatch[1]);
      this.addToStatsMap(statsMap, 'magic_find', { value });
      return;
    }
    
    // Gold Find: 50% Extra Gold from Monsters
    const gfMatch = cleanLine.match(/(\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i);
    if (gfMatch) {
      const value = parseInt(gfMatch[1]);
      this.addToStatsMap(statsMap, 'gold_find', { value });
      return;
    }
    
    // Life: +20 to Life, 15 to Life
    const lifeMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Life/i);
    if (lifeMatch) {
      const value = parseInt(lifeMatch[1]);
      this.addToStatsMap(statsMap, 'life', { value });
      return;
    }
    
    // Mana: +30 to Mana, 25 to Mana
    const manaMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Mana/i);
    if (manaMatch) {
      const value = parseInt(manaMatch[1]);
      this.addToStatsMap(statsMap, 'mana', { value });
      return;
    }
    
    // All Skills: +1 to All Skills, +2 All Skills
    const allSkillsMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?All\s+Skills/i);
    if (allSkillsMatch) {
      const value = parseInt(allSkillsMatch[1]);
      this.addToStatsMap(statsMap, 'all_skills', { value });
      return;
    }
    
    // Crushing Blow: 25% Chance of Crushing Blow
    const cbMatch = cleanLine.match(/(\d+)%\s+Chance\s+of\s+Crushing\s+Blow/i);
    if (cbMatch) {
      const value = parseInt(cbMatch[1]);
      this.addToStatsMap(statsMap, 'crushing_blow', { value });
      return;
    }
    
    // Deadly Strike: 20% Deadly Strike
    const dsMatch = cleanLine.match(/(\d+)%\s+Deadly\s+Strike/i);
    if (dsMatch) {
      const value = parseInt(dsMatch[1]);
      this.addToStatsMap(statsMap, 'deadly_strike', { value });
      return;
    }
    
    // Open Wounds: 25% Chance of Open Wounds
    const owMatch = cleanLine.match(/(\d+)%\s+Chance\s+of\s+Open\s+Wounds/i);
    if (owMatch) {
      const value = parseInt(owMatch[1]);
      this.addToStatsMap(statsMap, 'open_wounds', { value });
      return;
    }

    // Store other stats as non-stackable
    statsMap.set(`other_${Date.now()}_${Math.random()}`, { text: cleanLine, stackable: false });
  });
  
  return statsMap;
}

// Helper to add stats to map with proper stacking
addToStatsMap(statsMap, key, data) {
  if (statsMap.has(key)) {
    const existing = statsMap.get(key);
    if (data.min !== undefined && data.max !== undefined) {
      // Damage ranges - stack them
      existing.min = (existing.min || 0) + data.min;
      existing.max = (existing.max || 0) + data.max;
      existing.stacked = true;
    } else if (data.value !== undefined) {
      // Single values - stack them
      existing.value = (existing.value || 0) + data.value;
      existing.stacked = true;
    }
  } else {
    statsMap.set(key, { ...data, stacked: false });
  }
}

// Merge socket stats into base item stats
mergeStatsMaps(baseStats, socketStats) {
  socketStats.forEach((socketData, key) => {
    if (baseStats.has(key)) {
      const baseData = baseStats.get(key);
      if (socketData.min !== undefined && socketData.max !== undefined) {
        // Damage ranges
        baseData.min = (baseData.min || 0) + socketData.min;
        baseData.max = (baseData.max || 0) + socketData.max;
        baseData.stacked = true;
      } else if (socketData.value !== undefined) {
        // Single values  
        baseData.value = (baseData.value || 0) + socketData.value;
        baseData.stacked = true;
      }
    } else {
      // New stat from sockets only
      baseStats.set(key, { ...socketData, fromSocket: true });
    }
  });
}

// Format stacked stat for display with blue color
formatStackedStat(key, data) {
  const color = data.stacked || data.fromSocket ? '#4a90e2' : 'inherit';
  
  switch(key) {
    case 'lightning_damage':
      return `<span style="color: ${color}; font-weight: bold;">Adds ${data.min}-${data.max} Lightning Damage</span>`;
    case 'fire_damage':
      return `<span style="color: ${color}; font-weight: bold;">Adds ${data.min}-${data.max} Fire Damage</span>`;
    case 'cold_damage':
      return `<span style="color: ${color}; font-weight: bold;">Adds ${data.min}-${data.max} Cold Damage</span>`;
    case 'poison_damage':
      return `<span style="color: ${color}; font-weight: bold;">+${data.min}${data.max !== data.min ? '-' + data.max : ''} Poison Damage</span>`;
    case 'fire_resist':
      return `<span style="color: ${color}; font-weight: bold;">Fire Resist +${data.value}%</span>`;
    case 'cold_resist':
      return `<span style="color: ${color}; font-weight: bold;">Cold Resist +${data.value}%</span>`;
    case 'lightning_resist':
      return `<span style="color: ${color}; font-weight: bold;">Lightning Resist +${data.value}%</span>`;
    case 'poison_resist':
      return `<span style="color: ${color}; font-weight: bold;">Poison Resist +${data.value}%</span>`;
    case 'strength':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Strength</span>`;
    case 'dexterity':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Dexterity</span>`;
    case 'vitality':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Vitality</span>`;
    case 'energy':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Energy</span>`;
    case 'attack_rating':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Attack Rating</span>`;
      case 'faster_hit_recovery':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value}% Faster Hit Recovery</span>`;
    case 'faster_block_rate':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value}% Faster Block Rate</span>`;
    case 'faster_cast_rate':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value}% Faster Cast Rate</span>`;
    case 'increased_attack_speed':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value}% Increased Attack Speed</span>`;
    case 'faster_run_walk':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value}% Faster Run/Walk</span>`;
      case 'magic_find':
      return `<span style="color: ${color}; font-weight: bold;">${data.value}% Better Chance of Getting Magic Items</span>`;
    case 'gold_find':
      return `<span style="color: ${color}; font-weight: bold;">${data.value}% Extra Gold from Monsters</span>`;
    case 'life':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Life</span>`;
    case 'mana':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Mana</span>`;
    case 'all_skills':
      return `<span style="color: ${color}; font-weight: bold;">+${data.value} to All Skills</span>`;
    case 'crushing_blow':
      return `<span style="color: ${color}; font-weight: bold;">${data.value}% Chance of Crushing Blow</span>`;
    case 'deadly_strike':
      return `<span style="color: ${color}; font-weight: bold;">${data.value}% Deadly Strike</span>`;
    case 'open_wounds':
      return `<span style="color: ${color}; font-weight: bold;">${data.value}% Chance of Open Wounds</span>`;
    default:
      return data.text || '';
  }
}

// Get regex pattern to find original stat line for replacement
getStatPattern(key) {
  switch(key) {
    case 'lightning_damage':
      return /(?:Adds\s+)?\d+-\d+\s+Lightning\s+Damage/gi;
    case 'fire_damage':
      return /(?:Adds\s+)?\d+-\d+\s+Fire\s+Damage/gi;
    case 'cold_damage':
      return /(?:Adds\s+)?\d+-\d+\s+Cold\s+Damage/gi;
    case 'poison_damage':
      return /(?:\+)?\d+(?:-\d+)?\s+Poison\s+Damage/gi;
    case 'fire_resist':
      return /Fire\s+Resist\s+\+?\d+%?/gi;
    case 'cold_resist':
      return /Cold\s+Resist\s+\+?\d+%?/gi;
    case 'lightning_resist':
      return /Lightning\s+Resist\s+\+?\d+%?/gi;
    case 'poison_resist':
      return /Poison\s+Resist\s+\+?\d+%?/gi;
    case 'strength':
      return /(?:\+)?\d+\s+(?:to\s+)?Strength/gi;
    case 'dexterity':
      return /(?:\+)?\d+\s+(?:to\s+)?Dexterity/gi;
    case 'vitality':
      return /(?:\+)?\d+\s+(?:to\s+)?Vitality/gi;
    case 'energy':
      return /(?:\+)?\d+\s+(?:to\s+)?Energy/gi;
    case 'attack_rating':
      return /(?:\+)?\d+\s+(?:to\s+)?Attack\s+Rating/gi;
      case 'faster_hit_recovery':
      return /(?:\+)?\d+%?\s+Faster\s+Hit\s+Recovery/gi;
    case 'faster_block_rate':
      return /(?:\+)?\d+%?\s+Faster\s+Block\s+Rate/gi;
    case 'faster_cast_rate':
      return /(?:\+)?\d+%?\s+Faster\s+Cast\s+Rate/gi;
    case 'increased_attack_speed':
      return /(?:\+)?\d+%?\s+Increased\s+Attack\s+Speed/gi;
    case 'faster_run_walk':
      return /(?:\+)?\d+%?\s+Faster\s+Run\/Walk/gi;
    case 'magic_find':
      return /\d+%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/gi;
    case 'gold_find':
      return /\d+%\s+Extra\s+Gold\s+from\s+Monsters/gi;
    case 'life':
      return /(?:\+)?\d+\s+(?:to\s+)?Life/gi;
    case 'mana':
      return /(?:\+)?\d+\s+(?:to\s+)?Mana/gi;
    case 'all_skills':
      return /(?:\+)?\d+\s+(?:to\s+)?All\s+Skills/gi;
    case 'crushing_blow':
      return /\d+%\s+Chance\s+of\s+Crushing\s+Blow/gi;
    case 'deadly_strike':
      return /\d+%\s+Deadly\s+Strike/gi;
    case 'open_wounds':
      return /\d+%\s+Chance\s+of\s+Open\s+Wounds/gi;
    default:
      return null;
  }
}

  updateStatsDisplay() {
    // Get base character stats
    const baseStr = parseInt(document.getElementById('str')?.value) || 0;
    const baseDex = parseInt(document.getElementById('dex')?.value) || 0;
    const baseVit = parseInt(document.getElementById('vit')?.value) || 0;
    const baseEnr = parseInt(document.getElementById('enr')?.value) || 0;
    
    // Calculate totals
    const totalStr = baseStr + this.stats.strength;
    const totalDex = baseDex + this.stats.dexterity;
    const totalVit = baseVit + this.stats.vitality;
    const totalEnr = baseEnr + this.stats.energy;
    
    // Update attribute totals (next to base stats)
    this.updateElement('total-str', totalStr);
    this.updateElement('total-dex', totalDex);
    this.updateElement('total-vit', totalVit);
    this.updateElement('total-enr', totalEnr);
    
    // Update the actual stat containers with correct IDs from HTML
    this.updateElement('strengthcontainer', this.stats.strength);
    this.updateElement('dexteritycontainer', this.stats.dexterity);
    this.updateElement('vitalitycontainer', this.stats.vitality);
    this.updateElement('energycontainer', this.stats.energy);
    
    // Resistances - using correct HTML IDs
    this.updateElement('fireresistcontainer', this.stats.fireResist);
    this.updateElement('coldresistcontainer', this.stats.coldResist);
    this.updateElement('lightresistcontainer', this.stats.lightResist);
    this.updateElement('poisonresistcontainer', this.stats.poisonResist);
    this.updateElement('curseresistcontainer', this.stats.curseResist || 0);
    
    // Speed stats - using correct HTML IDs
    this.updateElement('iascontainer', this.stats.ias);
    this.updateElement('fcrcontainer', this.stats.fcr);
    this.updateElement('frwcontainer', this.stats.frw);
    this.updateElement('fhrcontainer', this.stats.fhr);
    
    // Combat stats - using correct HTML IDs
    this.updateElement('owcontainer', this.stats.openWounds);
    this.updateElement('owdmgcontainer', this.stats.openWounds * 5); // OW damage per second approximation
    this.updateElement('cbcontainer', this.stats.crushingBlow);
    this.updateElement('cbdmgcontainer', this.stats.crushingBlow); // CB damage %
    this.updateElement('deadlystrikecontainer', this.stats.deadlyStrike);
    this.updateElement('criticalhitcontainer', this.stats.criticalHit || 0);
    
    // Defensive stats - using correct HTML IDs
    this.updateElement('drcontainer', this.stats.dr);
    this.updateElement('pdrcontainer', this.stats.pdr);
    this.updateElement('mdrcontainer', this.stats.mdr);
    this.updateElement('plrcontainer', this.stats.plr || 0);
    this.updateElement('blockchancecontainer', this.stats.blockChance || 0);
    
    // Core stats
    this.updateElement('allskillscontainer', this.stats.allSkills);
    this.updateElement('magicfindcontainer', this.stats.magicFind);
    this.updateElement('goldfindcontainer', this.stats.goldFind);
    this.updateElement('defensecontainer', this.stats.defense);
    // this.updateElement('lifecontainer', this.stats.life);
    // this.updateElement('manacontainer', this.stats.mana);
    
    // Boolean stats
    this.updateElement('cbfcontainer', this.stats.cbf ? 'Yes' : 'No');
    
    // Damage ranges
    this.updateElement('flatfiremincontainer', this.stats.fireDmgMin);
    this.updateElement('flatfiremaxcontainer', this.stats.fireDmgMax);
    this.updateElement('flatcoldmincontainer', this.stats.coldDmgMin);
    this.updateElement('flatcoldmaxcontainer', this.stats.coldDmgMax);
    this.updateElement('flatlightmincontainer', this.stats.lightDmgMin);
    this.updateElement('flatlightmaxcontainer', this.stats.lightDmgMax);
    this.updateElement('flatpoisonmincontainer', this.stats.poisonDmgMin);
    this.updateElement('flatpoisonmaxcontainer', this.stats.poisonDmgMax);
    

  }

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  // === UTILITY METHODS ===
  getSectionInfoId(section) {
    const mapping = {
      'weapon': 'weapon-info', 'helm': 'helm-info', 'armor': 'armor-info',
      'shield': 'off-info', 'gloves': 'glove-info', 'belts': 'belt-info',
      'boots': 'boot-info', 'ringone': 'ringsone-info', 'ringtwo': 'ringstwo-info',
      'amulet': 'amulet-info'
    };
    return mapping[section] || `${section}-info`;
  }
  
  getSectionDropdownId(section) {
    const mapping = {
      'weapon': 'weapons-dropdown', 'helm': 'helms-dropdown', 'armor': 'armors-dropdown',
      'shield': 'offs-dropdown', 'gloves': 'gloves-dropdown', 'belts': 'belts-dropdown',
      'boots': 'boots-dropdown', 'ringone': 'ringsone-dropdown', 'ringtwo': 'ringstwo-dropdown',
      'amulet': 'amulets-dropdown'
    };
    return mapping[section] || `${section}s-dropdown`;
  }





  // === STYLES ===
  addStyles() {
    if (document.getElementById('unified-socket-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'unified-socket-styles';
    styles.textContent = `
      /* Socket Container Styles */
      .socket-container {
        margin-top: 10px;
        padding: 10px;
        background: rgba(0,0,0,0.3);
        border: 1px solid #333;
        border-radius: 4px;
      }
      
      .socket-grid {
        display: grid;
        gap: 5px;
        margin-bottom: 10px;
        justify-content: center;
        align-items: center;
      }
      
      .socket-grid.sockets-0 { display: none; }
      
      /* 1 socket - center */
      .socket-grid.sockets-1 { 
        grid-template-columns: 30px;
      }
      
      /* 2 sockets - vertical line */
      .socket-grid.sockets-2 { 
        grid-template-columns: 30px;
        grid-template-rows: repeat(2, 30px);
      }
      
      /* 3 sockets - triangle: 2 top, 1 bottom center */
      .socket-grid.sockets-3 { 
        grid-template-columns: repeat(3, 30px);
        grid-template-rows: repeat(2, 30px);
      }
      .socket-grid.sockets-3 .socket-slot:nth-child(1) { grid-column: 1; grid-row: 1; }
      .socket-grid.sockets-3 .socket-slot:nth-child(2) { grid-column: 3; grid-row: 1; }
      .socket-grid.sockets-3 .socket-slot:nth-child(3) { grid-column: 2; grid-row: 2; }
      
      /* 4 sockets - 2x2 square */
      .socket-grid.sockets-4 { 
        grid-template-columns: repeat(2, 30px);
        grid-template-rows: repeat(2, 30px);
      }
      
      /* 5 sockets - cross pattern */
      .socket-grid.sockets-5 { 
        grid-template-columns: repeat(3, 30px);
        grid-template-rows: repeat(3, 30px);
      }
      .socket-grid.sockets-5 .socket-slot:nth-child(1) { grid-column: 2; grid-row: 1; }
      .socket-grid.sockets-5 .socket-slot:nth-child(2) { grid-column: 1; grid-row: 2; }
      .socket-grid.sockets-5 .socket-slot:nth-child(3) { grid-column: 2; grid-row: 2; }
      .socket-grid.sockets-5 .socket-slot:nth-child(4) { grid-column: 3; grid-row: 2; }
      .socket-grid.sockets-5 .socket-slot:nth-child(5) { grid-column: 2; grid-row: 3; }
      
      /* 6 sockets - 2 columns x 3 rows */
      .socket-grid.sockets-6 { 
        grid-template-columns: repeat(2, 30px);
        grid-template-rows: repeat(3, 30px);
      }
      
      .socket-slot {
        width: 30px;
        height: 30px;
        border: 2px solid #666;
        border-radius: 50%;
        background: #000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .socket-slot.empty:hover {
        border-color: #999;
        background: #111;
      }
      
      .socket-slot.filled {
        border-color: #00ff00;
        background: #001100;
      }
      
      .socket-slot img {
        width: 30px;
        height: 30px;
        object-fit: contain;
      }
      
      .add-socket-btn {
        padding: 5px 15px;
        background: #333;
        color: #fff;
        border: 1px solid #666;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        width: 100%;
      }
      
      .add-socket-btn:hover {
        background: #444;
        border-color: #888;
      }
      
      /* Socket Modal */
      .socket-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }
      
      .socket-modal-content {
        background: #1a1a1a;
        border: 2px solid #444;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        color: #fff;
      }
      
      .socket-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #999;
      }
      
      .socket-close:hover {
        color: #fff;
      }
      
      .socket-tabs {
        display: flex;
        margin: 20px 0;
        border-bottom: 1px solid #444;
      }
      
      .socket-tab {
        background: #333;
        border: none;
        color: #ccc;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 4px 4px 0 0;
        margin-right: 2px;
      }
      
      .socket-tab.active {
        background: #555;
        color: #fff;
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
        background: rgba(14, 11, 11, 0.86);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }
      
      .socket-item:hover {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.5);
      }
      
      .socket-item img {
        width: 32px;
        height: 32px;
        margin-bottom: 5px;
      }
      
      .socket-item-name {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 2px;
      }
      
      .socket-item-level {
        font-size: 10px;
        color: #ccc;
      }
      
      .custom-jewel-item {
        border: 2px solid #ffd700;
      }
      
      /* Jewel Creation Styles */
      .jewel-creation-section h4 {
        margin: 15px 0 10px 0;
        color: #ffd700;
      }
      
      .jewel-color-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 15px;
      }
      
      .color-option {
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .color-option.selected {
        box-shadow: 0 0 10px rgba(255,255,255,0.5);
        transform: scale(1.05);
      }
      
      .jewel-creation-section select {
        width: 100%;
        background: #333;
        color: #fff;
        border: 1px solid #666;
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      
      .jewel-creation-section input[type="range"] {
        width: 100%;
        margin: 10px 0;
      }
      
      .jewel-preview {
        background: #2a2a2a;
        border: 2px solid #666;
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
        text-align: center;
        min-height: 60px;
      }
      
      .create-jewel-btn {
        background: #007700;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        width: 100%;
        margin-top: 10px;
      }
      
      .create-jewel-btn:hover {
        background: #009900;
      }
      
      /* Enhanced item descriptions */
      .socket-enhanced-stat {
        color: #8888ff !important;
      }
    `;
    
    document.head.appendChild(styles);

  }
}






// === AUTO-INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {

  
  // Create global instance
  window.unifiedSocketSystem = new UnifiedSocketSystem();
  
  // Also create legacy function names for compatibility
  window.updateItemInfo = () => {
    if (window.unifiedSocketSystem) {
      window.unifiedSocketSystem.updateAll();
    }
  };
  
  window.validateAllItems = () => {
    if (window.unifiedSocketSystem) {
      window.unifiedSocketSystem.updateAll();
    }
  };

});

// === FALLBACK FOR IMMEDIATE AVAILABILITY ===
window.addSocket = function(section) {

  
  if (window.unifiedSocketSystem) {
    window.unifiedSocketSystem.addSocket(section);
    return;
  }
  
  // Simple fallback if system not ready yet
  const container = document.querySelector(`.socket-container[data-section="${section}"]`);
  if (!container) {
    console.error(`❌ No socket container found for section: ${section}`);
    return;
  }
  
  const socketGrid = container.querySelector('.socket-grid');
  if (!socketGrid) {
    console.error(`❌ No socket grid found in container for section: ${section}`);
    return;
  }
  
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
  

};

