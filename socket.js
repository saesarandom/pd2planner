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

    // PD2 Open Wounds damage per second by Character Level (1-99)
    this.openWoundsBaseDamage = [
      3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 26, 28, 30, 32, 33,
      35, 37, 39, 40, 42, 45, 47, 50, 53, 55, 58, 61, 63, 66, 68, 71, 74, 76, 79, 82, 85, 89, 92, 96, 99,
      103, 106, 110, 113, 117, 120, 124, 127, 131, 134, 139, 143, 148, 152, 156, 161, 165, 170, 174, 178, 183, 187, 191, 196, 200,
      205, 209, 213, 218, 222, 227, 231, 235, 240, 244, 249, 253, 257, 262, 266, 271, 275, 279, 284, 288, 293, 297, 301, 306
    ];

    // Character base stats by class
    this.classStats = {
      'Amazon': { str: 20, dex: 25, vit: 20, enr: 15, arConstant: 5 },
      'Necromancer': { str: 15, dex: 25, vit: 15, enr: 25, arConstant: -10 },
      'Barbarian': { str: 30, dex: 20, vit: 25, enr: 10, arConstant: 20 },
      'Sorceress': { str: 10, dex: 25, vit: 10, enr: 35, arConstant: -15 },
      'Paladin': { str: 25, dex: 20, vit: 25, enr: 15, arConstant: 20 },
      'Assassin': { str: 20, dex: 20, vit: 20, enr: 25, arConstant: 15 },
      'Druid': { str: 15, dex: 20, vit: 25, enr: 20, arConstant: 5 }
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
      'amulets-dropdown': { info: 'amulet-info', section: 'amulet' },
      // Mercenary equipment
      'mercweapons-dropdown': { info: 'merc-weapon-info', section: 'mercweapon' },
      'merchelms-dropdown': { info: 'merc-helm-info', section: 'merchelm' },
      'mercarmors-dropdown': { info: 'merc-armor-info', section: 'mercarmor' },
      'mercoffs-dropdown': { info: 'merc-off-info', section: 'mercoff' },
      'mercgloves-dropdown': { info: 'merc-glove-info', section: 'mercgloves' },
      'mercbelts-dropdown': { info: 'merc-belt-info', section: 'mercbelts' },
      'mercboots-dropdown': { info: 'merc-boot-info', section: 'mercboots' }
    };

    // Fast stats tracking
    this.stats = {
      strength: 0, dexterity: 0, vitality: 0, energy: 0,
      allSkills: 0, classSkills: 0, magicFind: 0, goldFind: 0, defense: 0,
      ias: 0, fcr: 0, frw: 0, fhr: 0, plr: 0,
      fireResist: 0, coldResist: 0, lightResist: 0, poisonResist: 0, curseResist: 0,
      allResistances: 0, crushingBlow: 0, deadlyStrike: 0, openWounds: 0, openWoundsDamage: 0,
      life: 0, mana: 0, lifeSteal: 0, manaSteal: 0, dr: 0, pdr: 0, mdr: 0, cbf: false,
      toatt: 0, toattPercent: 0, lightRadius: 0,
      toMinDmg: 0, toMaxDmg: 0,
      lightDmgMin: 0, lightDmgMax: 0, fireDmgMin: 0, fireDmgMax: 0,
      coldDmgMin: 0, coldDmgMax: 0, poisonDmgMin: 0, poisonDmgMax: 0, fireSkillDamage: 0,
      coldSkillDamage: 0,
      lightningSkillDamage: 0,
      poisonSkillDamage: 0,
      magicSkillDamage: 0,

      // Enemy resistance pierce
      pierceFire: 0,
      pierceCold: 0,
      pierceLightning: 0,
      piercePoison: 0,
      piercePhysical: 0,
      pierceMagic: 0,

      // Proc chances (these won't add to totals, just for display)
      levelUpProcs: [],
      deathProcs: []
    };

    // Mercenary stats tracking (separate from player stats)
    this.mercenaryStats = {
      allSkills: 0, magicFind: 0, goldFind: 0, defense: 0,
      ias: 0, fcr: 0, frw: 0, fhr: 0,
      fireResist: 0, coldResist: 0, lightResist: 0, poisonResist: 0, curseResist: 0,
      dr: 0, pdr: 0, mdr: 0, plr: 0, cbf: false
    };

    // Jewel system
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;

    // Base type socket limits (for corruption)
    this.baseTypeSocketLimits = {
      // Helms
      'Cap': 2,
      'Skull Cap': 2,
      'Helm': 3,
      'Full Helm': 3,
      'Great Helm': 3,
      'Crown': 3,
      'Mask': 3,
      'Bone Helm': 3,
      'War Hat': 2,
      'Sallet': 2,
      'Casque': 2,
      'Basinet': 3,
      'Winged Helm': 3,
      'Grand Crown': 3,
      'Death Mask': 3,
      'Grim Helm': 3,
      'Bone Visage': 3,
      'Shako': 2,
      'Hydraskull': 2,
      'Armet': 2,
      'Giant Conch': 3,
      'Spired Helm': 3,
      'Corona': 3,
      'Demonhead': 3,
      'Circlet': 2,
      'Coronet': 2,
      'Tiara': 3,
      'Diadem': 3,

      // Armors
      'Quilted Armor': 2,
      'Leather Armor': 2,
      'Hard Leather Armor': 2,
      'Studded Leather': 2,
      'Ring Mail': 3,
      'Scale Mail': 2,
      'Chain Mail': 2,
      'Breast Plate': 3,
      'Splint Mail': 2,
      'Plate Mail': 2,
      'Field Plate': 2,
      'Gothic Plate': 4,
      'Full Plate Mail': 4,
      'Ancient Armor': 4,
      'Light Plate': 3,
      'Mage Plate': 3,
      'Ghost Armor': 2,
      'Serpentskin Armor': 2,
      'Demonhide Armor': 2,
      'Trellised Armor': 2,
      'Linked Mail': 3,
      'Tigulated Mail': 3,
      'Mesh Armor': 3,
      'Cuirass': 3,
      'Russet Armor': 3,
      'Templar Coat': 3,
      'Archon Plate': 4,
      'Dusk Shroud': 4,
      'Wyrmhide': 4,
      'Scarab Husk': 4,
      'Wire Fleece': 4,
      'Great Hauberk': 4,
      'Boneweave': 4,
      'Kraken Shell': 4,
      'Lacquered Plate': 4,
      'Shadow Plate': 4,
      'Sacred Armor': 4,

      // Shields
      'Buckler': 3,
      'Small Shield': 3,
      'Large Shield': 4,
      'Kite Shield': 4,
      'Tower Shield': 4,
      'Gothic Shield': 4,
      'Bone Shield': 3,
      'Spiked Shield': 3,
      'Defender': 4,
      'Round Shield': 4,
      'Scutum': 4,
      'Dragon Shield': 4,
      'Monarch': 4,
      'Aegis': 4,

      // Weapons - Swords
      'Short Sword': 3, 'Scimitar': 3, 'Sabre': 3, 'Falchion': 3, 'Crystal Sword': 6,
      'Broad Sword': 4, 'Long Sword': 4, 'War Sword': 4, 'Two-Handed Sword': 6,
      'Claymore': 6, 'Giant Sword': 6, 'Bastard Sword': 5, 'Flamberge': 6, 'Great Sword': 6,
      'Gladius': 3, 'Cutlass': 3, 'Shamshir': 3, 'Tulwar': 3, 'Dimensional Blade': 6,
      'Battle Sword': 4, 'Rune Sword': 4, 'Ancient Sword': 4, 'Espandon': 6,
      'Dacian Falx': 6, 'Tusk Sword': 6, 'Gothic Sword': 5, 'Zweihander': 6, 'Executioner Sword': 6,
      'Blade': 2, 'Falcata': 3, 'Ataghan': 3, 'Elegant Blade': 3, 'Hydra Edge': 6,
      'Phase Blade': 6, 'Conquest Sword': 5, 'Cryptic Sword': 4, 'Mythical Sword': 6, 'Legend Sword': 6,
      'Highland Blade': 6, 'Balrog Blade': 6, 'Champion Sword': 5, 'Colossus Sword': 6, 'Colossus Blade': 6,

      // Weapons - Axes
      'Hand Axe': 4, 'Axe': 5, 'Double Axe': 6, 'Military Pick': 5, 'War Axe': 6,
      'Large Axe': 6, 'Broad Axe': 6, 'Battle Axe': 6, 'Great Axe': 6, 'Giant Axe': 6,
      'Hatchet': 4, 'Cleaver': 5, 'Twin Axe': 6, 'Crowbill': 5, 'Naga': 6,
      'Military Axe': 6, 'Bearded Axe': 6, 'Tabar': 6, 'Gothic Axe': 6, 'Ancient Axe': 6,
      'Tomahawk': 4, 'Small Crescent': 5, 'Ettin Axe': 6, 'War Spike': 5, 'Berserker Axe': 6,
      'Feral Axe': 6, 'Silver-Edged Axe': 6, 'Decapitator': 6, 'Champion Axe': 6, 'Glorious Axe': 6,

      // Weapons - Maces/Clubs/Hammers
      'Club': 3, 'Spiked Club': 5, 'Mace': 5, 'Morning Star': 5, 'Flail': 5,
      'War Hammer': 6, 'Maul': 6, 'Great Maul': 6, 'Cudgel': 3, 'Barbed Club': 5,
      'Flanged Mace': 5, 'Jagged Star': 5, 'Knout': 5, 'Battle Hammer': 6, 'War Club': 6,
      'Martel de Fer': 6, 'Truncheon': 3, 'Tyrant Club': 5, 'Reinforced Mace': 5,
      'Devil Star': 5, 'Scourge': 5, 'Legendary Mallet': 6, 'Ogre Maul': 6, 'Thunder Maul': 6,

      // Weapons - Staves
      'Short Staff': 2, 'Long Staff': 4, 'Gnarled Staff': 4, 'Battle Staff': 6, 'War Staff': 6,
      'Jo Staff': 2, 'Quarterstaff': 4, 'Cedar Staff': 4, 'Gothic Staff': 6, 'Rune Staff': 6,
      'Walking Stick': 2, 'Stalagmite': 4, 'Elder Staff': 4, 'Shillelagh': 6, 'Archon Staff': 6,

      // Weapons - Bows/Crossbows
      'Short Bow': 3, 'Hunter\'s Bow': 4, 'Long Bow': 3, 'Composite Bow': 3, 'Short Battle Bow': 4,
      'Long Battle Bow': 4, 'Short War Bow': 5, 'Long War Bow': 5, 'Light Crossbow': 3, 'Crossbow': 4,
      'Heavy Crossbow': 6, 'Repeating Crossbow': 6, 'Edge Bow': 3, 'Razor Bow': 4, 'Cedar Bow': 3,
      'Double Bow': 3, 'Short Siege Bow': 4, 'Large Siege Bow': 4, 'Rune Bow': 5, 'Gothic Bow': 5,
      'Arbalest': 3, 'Siege Crossbow': 4, 'Ballista': 6, 'Chu-Ko-Nu': 6, 'Spider Bow': 3,
      'Blade Bow': 4, 'Shadow Bow': 3, 'Great Bow': 3, 'Diamond Bow': 4, 'Crusader Bow': 4,
      'Ward Bow': 5, 'Hydra Bow': 5, 'Pellet Bow': 3, 'Gorgon Crossbow': 4, 'Colossus Crossbow': 6,
      'Demon Crossbow': 6,

      // Weapons - Polearms
      'Bardiche': 6, 'Voulge': 6, 'Scythe': 6, 'Poleaxe': 6, 'Halberd': 6,
      'War Scythe': 5, 'Lochaber Axe': 6, 'Bill': 6, 'Battle Scythe': 6, 'Partisan': 6,
      'Bec-de-Corbin': 6, 'Grim Scythe': 5, 'Ogre Axe': 6, 'Colossus Voulge': 6, 'Thresher': 6,
      'Cryptic Axe': 6, 'Great Poleaxe': 6, 'Giant Thresher': 6,

      // Weapons - Spears
      'Spear': 3, 'Trident': 5, 'Brandistock': 5, 'Spetum': 5, 'Pike': 6,
      'Lance': 6, 'Fuscina': 6, 'War Fork': 6, 'Yari': 6, 'War Spear': 6,
      'Hyperion Spear': 6, 'Stygian Pike': 6, 'Mancatcher': 6, 'Ghost Spear': 6, 'War Pike': 6,

      // Weapons - Daggers/Throwing
      'Dagger': 3, 'Dirk': 3, 'Kris': 3, 'Blade': 2, 'Throwing Knife': 2,
      'Throwing Axe': 4, 'Balanced Knife': 3, 'Poignard': 3, 'Rondel': 3, 'Cinquedeas': 3,
      'Stiletto': 3, 'Battle Dart': 2, 'Francisca': 4, 'War Dart': 2, 'Bone Knife': 3,
      'Mithril Point': 3, 'Fanged Knife': 3, 'Legend Spike': 3,

      // Weapons - Javelins FIXED
      'Javelin': 1, 'Pilum': 2, 'Short Spear': 2, 'Glaive': 3, 'Throwing Spear': 3,
      'Maiden Javelin': 2, 'Ceremonial Javelin': 2, 'Matriarchal Javelin': 2,
      'War Javelin': 2, 'Great Pilum': 2, 'Simbilan': 2, 'Spiculum': 3, 'Harpoon': 3,
      'Hyperion Javelin': 2, 'Stygian Pilum': 2, 'Balrog Spear': 2, 'Ghost Glaive': 3, 'Winged Harpoon': 3,

      // Weapons - Wands
      'Wand': 2, 'Yew Wand': 2, 'Bone Wand': 2, 'Grim Wand': 2, 'Burnt Wand': 2,
      'Petrified Wand': 2, 'Tomb Wand': 2, 'Grave Wand': 2, 'Polished Wand': 2, 'Ghost Wand': 2,
      'Lich Wand': 2, 'Unearthed Wand': 2,

      // Weapons - Scepters
      'Scepter': 5, 'Grand Scepter': 5, 'War Scepter': 5, 'Rune Scepter': 5, 'Holy Water Sprinkler': 5,
      'Divine Scepter': 5, 'Barbed Club': 5, 'Caduceus': 5, 'Tyrant Club': 5,

      // Weapons - Orbs
      'Orb': 2, 'Eldritch Orb': 2, 'Demon Heart': 2, 'Vortex Orb': 2, 'Dimensional Shard': 2,
      'Heavenly Stone': 2, 'Swirling Crystal': 2,

      // Weapons - Barbarian (cannot socket)
      // Weapons - Druid (Pelts - cannot socket)
      // Weapons - Necromancer (Shrunken Heads - cannot socket)
      // Weapons - Assassin
      'Katar': 3, 'Wrist Blade': 3, 'Hatchet Hands': 3, 'Cestus': 3, 'Claws': 3,
      'Blade Talons': 3, 'Scissors Katar': 3, 'Quhab': 3, 'Wrist Spike': 3, 'Fascia': 3,
      'Hand Scythe': 3, 'Greater Claws': 3, 'Greater Talons': 3, 'Scissors Quhab': 3,
      'Suwayyah': 3, 'Wrist Sword': 3, 'War Fist': 3, 'Battle Cestus': 3, 'Feral Claws': 3,
      'Runic Talons': 3, 'Scissors Suwayyah': 3

      // Note: Class-specific items (Barb helms, Druid pelts, Necro heads, Paladin shields, Amazon items)
      // may have different socket rules - handle via item.properties.maxSockets if needed

      // Note: Only weapons, helms, armors, and shields are socketable
      // Gloves, belts, boots, rings, and amulets cannot have sockets
      // (rare exceptions can be handled via item.properties.maxSockets)
    };

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
          img: 'img/ruby.png',
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
            weapon: 'Adds 10-14 Cold Damage',
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
        'rainbow-facet': {
          name: 'Rainbow Facet',
          img: 'img/jewelgreen.png', // Default, will be randomized
          levelReq: 49,
          stats: {
            weapon: 'Dynamic Rainbow Facet Stats',
            armor: 'Dynamic Rainbow Facet Stats',
            helm: 'Dynamic Rainbow Facet Stats',
            shield: 'Dynamic Rainbow Facet Stats'
          }
        }
      }
    };
  }

  initializeJewelData() {
    this.jewelPrefixes = {
      'Cinnabar': {
        effect: '+[5-10]% Enhanced Damage',
        reqLevel: 1,
        range: [5, 10]
      },
      'Rusty': {
        effect: '+[11-20]% Enhanced Damage',
        reqLevel: 9,
        range: [11, 20]
      },
      'Realgar': {
        effect: '+[21-30]% Enhanced Damage',
        reqLevel: 37,
        range: [21, 30]
      },
      'Ruby': {
        effect: '+[31-40]% Enhanced Damage',
        reqLevel: 58,
        range: [31, 40]
      },
      'Stout': {
        effect: '+[5-8] Defense',
        reqLevel: 1,
        range: [5, 8]
      },
      'Burly': {
        effect: '+[9-20] Defense',
        reqLevel: 12,
        range: [9, 20]
      },
      'Bone': {
        effect: '+[21-40] Defense',
        reqLevel: 24,
        range: [21, 40]
      },
      'Ivory': {
        effect: '+[41-64] Defense', //magic only
        reqLevel: 56,
        range: [41, 64]
      },
      'Scarlet': {
        effect: '+[1-4] to Minimum Damage',
        reqLevel: 6,
        range: [1, 4]
      },
      'Crimson': {
        effect: '+[5-8] to Minimum Damage',
        reqLevel: 30,
        range: [5, 8]
      },
      'Cardinal': {
        effect: '+[10-14] to Minimum Damage',
        reqLevel: 30,
        range: [10, 14]
      },
      'Carbuncle': {
        effect: '+[1-5] to Maximum Damage',
        reqLevel: 9,
        range: [1, 5]
      },
      'Carmine': {
        effect: '+[6-9] to Maximum Damage',
        reqLevel: 27,
        range: [6, 9]
      },
      'Vermillion': {
        effect: '+[11-15] to Maximum Damage',
        reqLevel: 50,
        range: [11, 15]
      },
      'Dun': {
        effect: '+[7-12]% Damage Taken Gained as Mana when Hit',
        reqLevel: 5,
        range: [7, 12]
      },

      'Nickel': {
        effect: '+[10-20] to Attack Rating',
        reqLevel: 1,
        range: [10, 20]
      },
      'Tin': {
        effect: '+[21-40] to Attack Rating',
        reqLevel: 6,
        range: [21, 40]
      },
      'Silver': {
        effect: '+[41-60] to Attack Rating',
        reqLevel: 18,
        range: [41, 60]
      },
      'Argent': {
        effect: '+[61-100] to Attack Rating',
        reqLevel: 36,
        range: [61, 100]
      },
      'Bright': {
        effect: '+1 to Light Radius, +10 to Attack Rating',
        reqLevel: 1,
        range: [10, 10]
      },
      'Emerald': {
        effect: '[3-7]% Better Chance of Getting Magic Items',
        reqLevel: 12,
        range: [3, 7]
      },
      'Zircon': {
        effect: '+[5-10] to Mana',
        reqLevel: 2,
        range: [5, 10]
      },
      'Jacinth': {
        effect: '+[11-15] to Mana',
        reqLevel: 12,
        range: [11, 15]
      },
      'Turquoise': {
        effect: '+[16-20] to Mana',
        reqLevel: 21,
        range: [16, 20]
      },
      'Cerulean': {
        effect: '+[21-30] to Mana',
        reqLevel: 41,
        range: [21, 30]
      },
      'Shimmering': {
        effect: 'All Resistances +[5-10]',
        reqLevel: 12,
        range: [5, 10]
      },
      'Scintillating': {
        effect: 'All Resistances +[11-15]', //magic only
        reqLevel: 26,
        range: [11, 15]
      },
      'Lapis': {
        effect: 'Cold Resist +[5-15]%',
        reqLevel: 1,
        range: [5, 15]
      },
      'Sapphire': {
        effect: 'Cold Resist +[16-30]%',
        reqLevel: 14,
        range: [16, 30]
      },
      'Garnet': {
        effect: 'Fire Resist +[5-15]%',
        reqLevel: 1,
        range: [5, 15]
      },
      'Ruby': {
        effect: 'Fire Resist +[16-30]%',
        reqLevel: 14,
        range: [16, 30]
      },
      'Camphor': {
        effect: 'Lightning Resist +[5-15]%',
        reqLevel: 1,
        range: [5, 15]
      },
      'Ambergris': {
        effect: 'Lightning Resist +[16-30]%',
        reqLevel: 14,
        range: [16, 30]
      },
      'Beryl': {
        effect: 'Poison Resist +[5-15]%',
        reqLevel: 1,
        range: [5, 15]
      },
      'Jade': {
        effect: 'Poison Resist +[16-30]%',
        reqLevel: 14,
        range: [16, 30]
      },
      'Aureolic': {
        effect: '[1-3] Mana After Each Kill',
        reqLevel: 9,
        range: [1, 3]
      },
      'Diamond': {
        effect: '[25-50] to Attack Rating against Demons',
        reqLevel: 19,
        range: [25, 50]
      },
      'Pearl': {
        effect: '[25-50] to Attack Rating against Undead',
        reqLevel: 13,
        range: [25, 50]
      },
      'Cultists': {
        effect: '5% Chance of Open Wounds, +[30-40] Open Wounds Damage per Second',
        reqLevel: 25,
        range: [30, 40]
      },
      'Bloodthirsters': {
        effect: '5% Chance of Open Wounds, +[65-85] Open Wounds Damage per Second',
        reqLevel: 45,
        range: [65, 85]
      },
      'Gorelusts': {
        effect: '5% Chance of Open Wounds, +[95-125] Open Wounds Damage per Second',
        reqLevel: 65,
        range: [95, 125]
      },
      'Blood Sucking': {
        effect: '[1-3] Life After Each Kill',
        reqLevel: 26,
        range: [1, 3]
      },
    };

    this.jewelSuffixes = {
      'Malice': {
        effect: 'Attacker Takes Damage of [30-40]',
        reqLevel: 29,
        range: [30, 40]
      },
      'Fervor': {
        effect: '+15% Increased Attack Speed', //magic only
        reqLevel: 31,
        range: [15, 15]  // Fixed value
      },

      'Frigidity': {
        effect: 'Adds [1-1] to [3-5] Cold Damage',
        reqLevel: 12,
        minRange: [1, 1],
        maxRange: [3, 5]
      },
      'Icicle': {
        effect: 'Adds [2-3] to [6-10] Cold Damage',
        reqLevel: 29,
        minRange: [2, 3],
        maxRange: [6, 10]
      },
      'Glacier': {
        effect: 'Adds [4-5] to [11-15] Cold Damage', //magiconly
        reqLevel: 50,
        minRange: [4, 5],
        maxRange: [11, 15]
      },
      'Passion': {
        effect: 'Adds [1-3] to [6-10] Fire Damage',
        reqLevel: 11,
        minRange: [1, 3],
        maxRange: [6, 10]
      },
      'Fire': {
        effect: 'Adds [4-10] to [11-30] Fire Damage',
        reqLevel: 28,
        minRange: [4, 10],
        maxRange: [11, 30]
      },
      'Burning': {
        effect: 'Adds [11-25] to [31-50] Fire Damage',
        reqLevel: 49,
        minRange: [11, 25],
        maxRange: [31, 50]
      },
      'Ennui': {
        effect: 'Adds [1-1] to [10-20] Lightning Damage',
        reqLevel: 11,
        minRange: [1, 1],
        maxRange: [10, 20]
      },
      'Lightning': {
        effect: 'Adds [1-1] to [21-60] Lightning Damage',
        reqLevel: 28,
        minRange: [1, 1],
        maxRange: [21, 60]
      },
      'Thunder': {
        effect: 'Adds [1-1] to [61-100] Lightning Damage',
        reqLevel: 49,
        minRange: [1, 1],
        maxRange: [61, 100]
      },
      'Ire': {
        effect: '+[2-5] to Maximum Damage',
        reqLevel: 3,
        range: [2, 5]
      },
      'Wrath': {
        effect: '+[6-10] to Maximum Damage',
        reqLevel: 8,
        range: [6, 10]
      },
      'Carnage': {
        effect: '+[11-15] to Maximum Damage',
        reqLevel: 18,
        range: [11, 15]
      },
      'Joyfulness': {
        effect: '+[1-4] to Minimum Damage',
        reqLevel: 3,
        range: [1, 4]
      },
      'Bliss': {
        effect: '+[5-10] to Minimum Damage',
        reqLevel: 37,
        range: [5, 10]
      },
      'Envy': {
        effect: 'Adds 20 Poison Damage',
        reqLevel: 1,
        range: [20, 20]
      },
      'Daring': {
        effect: '+[1-3] to Dexterity',
        reqLevel: 1,
        range: [1, 3]
      },
      'Daring2': {
        effect: '+[4-6] to Dexterity',
        reqLevel: 14,
        range: [4, 6]
      },
      'Daring3': {
        effect: '+[7-9] to Dexterity',
        reqLevel: 28,
        range: [7, 9]
      },
      'Truth': {
        effect: '+7% Faster Hit Recovery',
        reqLevel: 36,
        range: [7, 7]
      },
      'Honor': {
        effect: 'Replenish Life+ [1-4]',
        reqLevel: 35,
        range: [1, 4]
      },
      'Avarice': {
        effect: '+[10-30]% Extra Gold from Monsters',
        reqLevel: 1,
        range: [10, 30]
      },
      'Prosperity': {
        effect: '+[5-10]% Better Chance of Getting Magic Items',
        reqLevel: 19,
        range: [5, 10]
      },
      'Knowledge': {
        effect: '+[1-5] to Energy',
        reqLevel: 6,
        range: [1, 5]
      },
      'Knowledge2': {
        effect: '+[4-6] to Energy',
        reqLevel: 18,
        range: [4, 6]
      },
      'Knowledge3': {
        effect: '+[7-9] to Energy',
        reqLevel: 33,
        range: [7, 9]
      },
      'Spirit': {
        effect: '+[3-8] to Life',
        reqLevel: 1,
        range: [3, 8]
      },
      'Hope': {
        effect: '+[9-20] to Life', //maic only
        reqLevel: 37,
        range: [9, 20]
      },
      'Freedom': {
        effect: 'Requirements -15%',
        reqLevel: 33,
        range: [-15, -15]
      },
      'Virility': {
        effect: '+[1-4] to Strength',
        reqLevel: 13,
        range: [1, 4]
      },
      'Virility2': {
        effect: '+[5-6] to Strength',
        reqLevel: 25,
        range: [5, 6]
      },
      'Virility3': {
        effect: '+[7-9] to Strength',
        reqLevel: 42,
        range: [7, 9]
      },
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
    // Only weapons, helms, armors, and shields can have sockets
    // (rare exceptions for other slots can be handled via item.properties.maxSockets)
    const sections = ['weapon', 'helm', 'armor', 'shield'];

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

    // Mercenary class change - recalculate when switching between mercenary types or "No Mercenary"
    const mercClassDropdown = document.getElementById('mercclass');
    if (mercClassDropdown) {
      mercClassDropdown.addEventListener('change', () => {
        this.updateAll(); // Recalculate all stats when mercenary class changes
      });
    }

    // Mercenary level change
    const mercLevelInput = document.getElementById('merclvlValue');
    if (mercLevelInput) {
      mercLevelInput.addEventListener('input', () => {
        this.updateAll(); // Recalculate when mercenary level changes
      });
    }

    // Equipment changes
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          const section = this.equipmentMap[dropdownId].section;
          const oldItemName = dropdown.dataset.previousValue;
          const newItemName = dropdown.value;

          // Only save/restore if actually switching to a different item
          if (oldItemName === newItemName) {
            // Same item - just update display, don't save/restore
            this.calculateAllStats();
            this.updateStatsDisplay();
            // BUGFIX: Removed setTimeout updateAll - was causing skill damage to reset
            // setTimeout(() => this.updateAll(), 50);
            return;
          }

          // SAVE current item state BEFORE switching
          if (oldItemName && typeof window.saveItemState === 'function') {
            window.saveItemState(dropdownId, oldItemName, section);
          }

          // Store current value for next change
          dropdown.dataset.previousValue = newItemName;

          // Check if we should clear state due to requirements
          if (newItemName && typeof window.clearItemStateIfRequirementsNotMet === 'function') {
            const shouldClear = window.clearItemStateIfRequirementsNotMet(dropdownId, newItemName);
            if (shouldClear) {
              // Requirements not met - clear corruptions and sockets
              if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
                delete window.itemCorruptions[dropdownId];
              }
              const socketableSections = ['weapon', 'helm', 'armor', 'shield'];
              if (socketableSections.includes(section)) {
                this.adjustSocketsForItem(section);
              }
              this.calculateAllStats();
              this.updateStatsDisplay();
              // BUGFIX: Removed setTimeout updateAll - was causing skill damage to reset
              // setTimeout(() => this.updateAll(), 50);
              return;
            }
          }

          // RESTORE item state AFTER switching (or clear if no saved state)
          if (newItemName) {
            const stateKey = `${dropdownId}_${newItemName}`;
            const hasSavedState = window.itemStates && window.itemStates[stateKey];

            if (hasSavedState && typeof window.restoreItemState === 'function') {
              // Restore saved state
              window.restoreItemState(dropdownId, newItemName, section);
            } else {
              // No saved state - clear corruption and reset to default
              if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
                delete window.itemCorruptions[dropdownId];
              }

              // Reset ethereal button to default state
              const category = section;
              const etherealBtn = document.querySelector(`button[onclick*="makeEtherealItem('${category}')"]`);
              if (etherealBtn) {
                etherealBtn.classList.remove('active');
                etherealBtn.textContent = 'Make Ethereal';
              }

              // Adjust sockets for new item
              const socketableSections = ['weapon', 'helm', 'armor', 'shield'];
              if (socketableSections.includes(section)) {
                this.adjustSocketsForItem(section);
              }
            }
          }

          // Immediately recalculate stats when item changes
          this.calculateAllStats();
          this.updateStatsDisplay();
          // BUGFIX: Removed setTimeout updateAll - was causing skill damage to reset
          // setTimeout(() => this.updateAll(), 50);
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

  // === UI CLEARING ===
  clearAll() {
    // 1. Reset all equipment dropdowns to "None"
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.value = '';
        dropdown.dataset.previousValue = '';
        // If there's an active item icon in the UI, we might need to hide it
        // but usually the next steps handle the socket grids.
      }
    });

    // 2. Clear all socket slots
    const socketContainers = document.querySelectorAll('.socket-container');
    socketContainers.forEach(container => {
      const socketGrid = container.querySelector('.socket-grid');
      if (socketGrid) {
        socketGrid.innerHTML = '';
        socketGrid.className = 'socket-grid sockets-0';
      }
    });

    // 3. Reset ethereal buttons
    document.querySelectorAll('button[onclick*="makeEtherealItem"]').forEach(btn => {
      btn.classList.remove('active');
      btn.textContent = 'Make Ethereal';
    });

    // 4. Clear item corruptions (visual and data)
    window.itemCorruptions = {};
    document.querySelectorAll('.corruption-text').forEach(el => el.remove());

    // 5. Reset internal state
    this.calculateAllStats();
    this.updateStatsDisplay();
  }

  // === SOCKET MANAGEMENT ===

  // Get max sockets for current item in a section
  getMaxSocketsForSection(section) {
    // Get the dropdown for this section
    const dropdownId = this.getSectionDropdownId(section);
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown || !dropdown.value) {
      return 1; // Default to 1 socket if no item selected
    }

    const itemName = dropdown.value;
    // Use window.getItemData to support both regular and crafted items
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];

    if (!item) {
      return 1; // Default to 1 socket if item not found
    }

    // Check if item has custom maxSockets property
    if (item.properties && item.properties.maxSockets !== undefined) {
      return item.properties.maxSockets;
    }

    // Try to get base type from item.baseType or parse from description
    let baseType = item.baseType;

    if (!baseType && item.description) {
      // Parse base type from description (it's usually the second line)
      const lines = item.description.split('<br>');
      if (lines.length >= 2) {
        baseType = lines[1].trim();
      }
    }

    // Lookup socket limit by base type
    if (baseType) {
      let limit = this.baseTypeSocketLimits[baseType];
      if (limit !== undefined) {
        // For armor section, cap at 3 for unique/set items (even if base allows 4)
        // 3rd socket requires corruption
        if (section === 'armor' && limit > 3) {
          limit = 3;
        }
        return limit;
      }
    }

    // Default to 1 socket for any unspecified items
    return 1;
  }

  addSocket(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return;
    }

    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      return;
    }

    const existingSockets = socketGrid.children.length;
    const maxSockets = this.getMaxSocketsForSection(section);

    if (existingSockets >= maxSockets) {
      alert(`Maximum ${maxSockets} sockets allowed for this item`);
      return;
    }

    const newSocket = document.createElement('div');
    newSocket.className = 'socket-slot empty';
    newSocket.dataset.index = existingSockets.toString();

    socketGrid.appendChild(newSocket);

    const newSocketCount = existingSockets + 1;
    socketGrid.className = `socket-grid sockets-${newSocketCount}`;

    // Auto-apply socket corruption when adding 3rd socket to armor, helm, or shield
    if ((section === 'armor' || section === 'helm' || section === 'shield') && newSocketCount === 3) {
      const dropdownId = this.getSectionDropdownId(section);
      if (dropdownId && typeof window.applySocketCorruption === 'function') {
        window.applySocketCorruption(dropdownId, 3);
      }
    }

  }

  // Adjust socket count when item changes to ensure it doesn't exceed new item's max
  adjustSocketsForItem(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return;
    }

    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      return;
    }

    const currentSocketCount = socketGrid.children.length;
    const maxSockets = this.getMaxSocketsForSection(section);

    // If current socket count exceeds max for new item, remove excess sockets
    if (currentSocketCount > maxSockets) {

      // Remove sockets from the end (highest indices first)
      while (socketGrid.children.length > maxSockets) {
        const lastSocket = socketGrid.lastElementChild;
        socketGrid.removeChild(lastSocket);
      }

      // Update grid class to reflect new socket count
      const newSocketCount = socketGrid.children.length;
      socketGrid.className = `socket-grid sockets-${newSocketCount}`;

      // Update stats after removing sockets
      this.updateAll();
    }
  }

  // Set socket count to exact number (for corruption system)
  getSocketCount(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return 0;
    }

    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      return 0;
    }

    return socketGrid.children.length;
  }

  setSocketCount(section, targetCount) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return;
    }

    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      return;
    }

    const currentCount = socketGrid.children.length;

    // Remove all existing sockets first
    while (socketGrid.firstChild) {
      socketGrid.removeChild(socketGrid.firstChild);
    }

    // Add the target number of sockets
    for (let i = 0; i < targetCount; i++) {
      const socket = document.createElement('div');
      socket.className = 'socket-slot empty';
      socket.dataset.index = i.toString();
      socketGrid.appendChild(socket);
    }

    // Update grid class
    socketGrid.className = `socket-grid sockets-${targetCount}`;

    // Update stats
    this.updateAll();
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

    // Refresh saved state AFTER updateAll completes
    const container = socket.closest('.socket-container');
    const section = container?.dataset.section;
    if (section && typeof window.refreshSavedState === 'function') {
      const dropdownId = this.getSectionDropdownId(section);
      if (dropdownId) {
        setTimeout(() => window.refreshSavedState(dropdownId, section), 100);
      }
    }
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

    // Refresh saved state AFTER updateAll completes
    if (section && typeof window.refreshSavedState === 'function') {
      const dropdownId = this.getSectionDropdownId(section);
      if (dropdownId) {
        setTimeout(() => window.refreshSavedState(dropdownId, section), 100);
      }
    }
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
        <div class="socket-modal-content jewel-modal-content">
          <span class="socket-close">&times;</span>
          <h3>Create Custom Jewel</h3>
          <div class="jewel-creation-section">
            
            <h4>1. Select Color</h4>
            <div class="jewel-color-grid">
              ${['white', 'blue', 'yellow', 'green', 'purple', 'red'].map(color => `
                <div class="color-option ${color === 'white' ? 'selected' : ''}" data-color="${color}" 
                    style="background: ${color}; border: 2px solid ${color === 'white' ? '#000' : color};">
                  ${color.charAt(0).toUpperCase() + color.slice(1)}
                </div>
              `).join('')}
            </div>
            
            <h4>2. Select Prefixes (up to 3)</h4>
            ${[1, 2, 3].map(num => `
              <div style="margin-bottom: 15px;">
                <label>Prefix ${num}:</label>
                <select id="jewelPrefix${num}Select">
                  <option value="">No Prefix</option>
                  ${Object.entries(this.jewelPrefixes).map(([key, prefix]) =>
      `<option value="${key}">${prefix.effect} (Req Level: ${prefix.reqLevel || 1})</option>`
    ).join('')}
                </select>
                <div id="prefix${num}ValueContainer" style="display: none;"></div>
              </div>
            `).join('')}
            
            <h4>3. Select Suffixes (up to 3)</h4>
            ${[1, 2, 3].map(num => `
              <div style="margin-bottom: 15px;">
                <label>Suffix ${num}:</label>
                <select id="jewelSuffix${num}Select">
                  <option value="">No Suffix</option>
                  ${Object.entries(this.jewelSuffixes).map(([key, suffix]) =>
      `<option value="${key}">${suffix.effect} (Req Level: ${suffix.reqLevel || 1})</option>`
    ).join('')}
                </select>
                <div id="suffix${num}ValueContainer" style="display: none;"></div>
              </div>
            `).join('')}
            
            <div id="jewelPreview" class="jewel-preview">
              White Jewel<br>
              <span style="color: #888; font-size: 12px;">Required Level: 1</span>
            </div>
            
            <button id="createJewelBtn" class="create-jewel-btn">Create Jewel</button>
          </div>
        </div>
      `;

    document.body.appendChild(modal);
    this.setupEnhancedJewelModalEvents();
  }
  setupEnhancedJewelModalEvents() {
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

    // Prefix selections with validation
    [1, 2, 3].forEach(num => {
      modal.querySelector(`#jewelPrefix${num}Select`).onchange = (e) => {
        this[`selectedJewelPrefix${num}`] = e.target.value;
        this.validateAffixLimit();
        this.updatePrefixValueInput(num);
        this.updateJewelPreview();
      };
    });

    // Suffix selections with validation
    [1, 2, 3].forEach(num => {
      modal.querySelector(`#jewelSuffix${num}Select`).onchange = (e) => {
        this[`selectedJewelSuffix${num}`] = e.target.value;
        this.validateAffixLimit();
        this.updateSuffixValueInput(num);
        this.updateJewelPreview();
      };
    });

    // Create jewel button
    modal.querySelector('#createJewelBtn').onclick = () => this.createCustomJewel();
  }

  // Validate affix limit and disable selectors when needed
  validateAffixLimit() {
    const prefixCount = [this.selectedJewelPrefix1, this.selectedJewelPrefix2, this.selectedJewelPrefix3].filter(p => p).length;
    const suffixCount = [this.selectedJewelSuffix1, this.selectedJewelSuffix2, this.selectedJewelSuffix3].filter(s => s).length;
    const totalAffixes = prefixCount + suffixCount;

    // Disable/enable selectors based on current count
    const modal = document.getElementById('jewelModal');
    if (modal) {
      // If we have 4 affixes, disable empty selectors
      if (totalAffixes >= 4) {
        [1, 2, 3].forEach(num => {
          const select = modal.querySelector(`#jewelPrefix${num}Select`);
          if (select && !this[`selectedJewelPrefix${num}`]) {
            select.disabled = true;
            select.style.opacity = '0.5';
          }
        });

        [1, 2, 3].forEach(num => {
          const select = modal.querySelector(`#jewelSuffix${num}Select`);
          if (select && !this[`selectedJewelSuffix${num}`]) {
            select.disabled = true;
            select.style.opacity = '0.5';
          }
        });
      } else {
        // Re-enable all selectors
        [1, 2, 3].forEach(num => {
          const select = modal.querySelector(`#jewelPrefix${num}Select`);
          if (select) {
            select.disabled = false;
            select.style.opacity = '1';
          }
        });

        [1, 2].forEach(num => {
          const select = modal.querySelector(`#jewelSuffix${num}Select`);
          if (select) {
            select.disabled = false;
            select.style.opacity = '1';
          }
        });
      }
    }
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

  // Replace your populateSocketItems method with this:

  populateSocketItems(category) {
    const grid = document.getElementById('socketItemGrid');

    if (!grid) {
      return;
    }

    grid.innerHTML = '';

    const items = this.socketData[category] || {};

    // Add regular items (skip rainbow-facet to avoid duplicates)
    Object.entries(items).forEach(([itemKey, item]) => {
      if (itemKey === 'rainbow-facet') {
        return; // Skip basic rainbow-facet
      }

      const itemDiv = document.createElement('div');
      itemDiv.className = 'socket-item';

      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}" style="width: 32px; height: 32px;">
        <div class="socket-item-name">${item.name}</div>
        <div class="socket-item-level">Level ${item.levelReq}</div>
      `;

      itemDiv.onclick = () => {
        this.fillSocket(itemKey, category);
      };

      grid.appendChild(itemDiv);
    });

    // Add special jewel options ONLY for jewels category
    if (category === 'jewels') {
      // Add Rainbow Facet option
      const rainbowDiv = document.createElement('div');
      rainbowDiv.className = 'socket-item rainbow-facet-item';
      rainbowDiv.style.border = '2px solid gold';
      rainbowDiv.innerHTML = `
        <img src="img/jewelgreen.png" alt="Rainbow Facet" style="width: 32px; height: 32px;">
        <div class="socket-item-name">Rainbow Facet</div>
        <div class="socket-item-level">Level 49</div>
      `;

      rainbowDiv.onclick = () => {


        if (!this.currentSocket) {
          alert('Please click on a socket first, then try again.');
          this.hideSocketModal();
          return;
        }

        // CRITICAL FIX: Store the socket reference in a way that won't get lost
        this.rainbowFacetTargetSocket = this.currentSocket;

        this.hideSocketModal();
        this.createRainbowFacetModal();
      };
      grid.appendChild(rainbowDiv);

      // Add Custom Jewel option
      const customJewelDiv = document.createElement('div');
      customJewelDiv.className = 'socket-item custom-jewel-item';
      customJewelDiv.style.border = '2px solid purple';
      customJewelDiv.innerHTML = `
        <img src="img/jewel1.png" alt="Custom Jewel" style="width: 32px; height: 32px;">
        <div class="socket-item-name">Create Custom Jewel</div>
        <div class="socket-item-level">Custom</div>
      `;
      customJewelDiv.onclick = () => {
        if (!this.currentSocket) {
          alert('Please click on a socket first, then try again.');
          this.hideSocketModal();
          return;
        }
        this.targetSocket = this.currentSocket;
        this.hideSocketModal();
        this.showJewelModal();
      };
      grid.appendChild(customJewelDiv);
    }
  }
  // === JEWEL CREATION ===
  updatePrefixValueInput(num) {
    const container = document.getElementById(`prefix${num}ValueContainer`);
    const selectedPrefix = this[`selectedJewelPrefix${num}`];

    if (selectedPrefix && this.jewelPrefixes[selectedPrefix]) {
      const prefixData = this.jewelPrefixes[selectedPrefix];

      if (prefixData.minRange && prefixData.maxRange) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Min: <span id="prefix${num}MinValueDisplay">${prefixData.minRange[0]}</span></label>
                    <input type="range" id="prefix${num}MinValue" min="${prefixData.minRange[0]}" max="${prefixData.minRange[1]}" value="${prefixData.minRange[0]}">
                </div>
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Max: <span id="prefix${num}MaxValueDisplay">${prefixData.maxRange[0]}</span></label>
                    <input type="range" id="prefix${num}MaxValue" min="${prefixData.maxRange[0]}" max="${prefixData.maxRange[1]}" value="${prefixData.maxRange[0]}">
                </div>
            `;

        this[`selectedJewelPrefix${num}MinValue`] = prefixData.minRange[0];
        this[`selectedJewelPrefix${num}MaxValue`] = prefixData.maxRange[0];

        document.getElementById(`prefix${num}MinValue`).oninput = (e) => {
          this[`selectedJewelPrefix${num}MinValue`] = e.target.value;
          document.getElementById(`prefix${num}MinValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

        document.getElementById(`prefix${num}MaxValue`).oninput = (e) => {
          this[`selectedJewelPrefix${num}MaxValue`] = e.target.value;
          document.getElementById(`prefix${num}MaxValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

      } else if (prefixData.range) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Value: <span id="prefix${num}ValueDisplay">${prefixData.range[0]}</span></label>
                    <input type="range" id="prefix${num}Value" min="${prefixData.range[0]}" max="${prefixData.range[1]}" value="${prefixData.range[0]}">
                </div>
            `;

        this[`selectedJewelPrefix${num}Value`] = prefixData.range[0];

        document.getElementById(`prefix${num}Value`).oninput = (e) => {
          this[`selectedJewelPrefix${num}Value`] = e.target.value;
          document.getElementById(`prefix${num}ValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };
      }

      container.style.display = 'block';
    } else {
      container.style.display = 'none';
      this[`selectedJewelPrefix${num}Value`] = null;
      this[`selectedJewelPrefix${num}MinValue`] = null;
      this[`selectedJewelPrefix${num}MaxValue`] = null;
    }
  }

  updateSuffixValueInput(num) {
    const container = document.getElementById(`suffix${num}ValueContainer`);
    const selectedSuffix = this[`selectedJewelSuffix${num}`];

    if (selectedSuffix && this.jewelSuffixes[selectedSuffix]) {
      const suffixData = this.jewelSuffixes[selectedSuffix];

      if (suffixData.minRange && suffixData.maxRange) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Min: <span id="suffix${num}MinValueDisplay">${suffixData.minRange[0]}</span></label>
                    <input type="range" id="suffix${num}MinValue" min="${suffixData.minRange[0]}" max="${suffixData.minRange[1]}" value="${suffixData.minRange[0]}">
                </div>
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Max: <span id="suffix${num}MaxValueDisplay">${suffixData.maxRange[0]}</span></label>
                    <input type="range" id="suffix${num}MaxValue" min="${suffixData.maxRange[0]}" max="${suffixData.maxRange[1]}" value="${suffixData.maxRange[0]}">
                </div>
            `;

        this[`selectedJewelSuffix${num}MinValue`] = suffixData.minRange[0];
        this[`selectedJewelSuffix${num}MaxValue`] = suffixData.maxRange[0];

        document.getElementById(`suffix${num}MinValue`).oninput = (e) => {
          this[`selectedJewelSuffix${num}MinValue`] = e.target.value;
          document.getElementById(`suffix${num}MinValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

        document.getElementById(`suffix${num}MaxValue`).oninput = (e) => {
          this[`selectedJewelSuffix${num}MaxValue`] = e.target.value;
          document.getElementById(`suffix${num}MaxValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

      } else if (suffixData.range) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Value: <span id="suffix${num}ValueDisplay">${suffixData.range[0]}</span></label>
                    <input type="range" id="suffix${num}Value" min="${suffixData.range[0]}" max="${suffixData.range[1]}" value="${suffixData.range[0]}">
                </div>
            `;

        this[`selectedJewelSuffix${num}Value`] = suffixData.range[0];

        document.getElementById(`suffix${num}Value`).oninput = (e) => {
          this[`selectedJewelSuffix${num}Value`] = e.target.value;
          document.getElementById(`suffix${num}ValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };
      }

      container.style.display = 'block';
    } else {
      container.style.display = 'none';
      this[`selectedJewelSuffix${num}Value`] = null;
      this[`selectedJewelSuffix${num}MinValue`] = null;
      this[`selectedJewelSuffix${num}MaxValue`] = null;
    }
  }

  updateJewelPreview() {
    const preview = document.getElementById('jewelPreview');
    if (!preview) return;

    let jewelName = `${this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1)} Jewel`;
    let stats = [];
    let maxRequiredLevel = 1;

    // Handle all prefixes
    [1, 2, 3].forEach(num => {
      const selectedPrefix = this[`selectedJewelPrefix${num}`];
      if (selectedPrefix) {
        const prefix = this.jewelPrefixes[selectedPrefix];
        let effect = prefix.effect;

        const minVal = this[`selectedJewelPrefix${num}MinValue`];
        const maxVal = this[`selectedJewelPrefix${num}MaxValue`];
        const singleVal = this[`selectedJewelPrefix${num}Value`];

        if (minVal && maxVal) {
          effect = effect.replace(/\[\d+-\d+\]/g, (match, offset) => {
            const beforeMatch = effect.substring(0, offset);
            const minRangeCount = (beforeMatch.match(/\[\d+-\d+\]/g) || []).length;
            return minRangeCount === 0 ? minVal : maxVal;
          });
        } else if (singleVal) {
          effect = effect.replace(/\[\d+-\d+\]/, singleVal);
        }

        stats.push(`<span style="color: #8888ff;">${effect}</span>`);
        maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
      }
    });

    // Handle all suffixes
    [1, 2, 3].forEach(num => {
      const selectedSuffix = this[`selectedJewelSuffix${num}`];
      if (selectedSuffix) {
        const suffix = this.jewelSuffixes[selectedSuffix];
        let effect = suffix.effect;

        const minVal = this[`selectedJewelSuffix${num}MinValue`];
        const maxVal = this[`selectedJewelSuffix${num}MaxValue`];
        const singleVal = this[`selectedJewelSuffix${num}Value`];

        if (minVal && maxVal) {
          effect = effect.replace(/\[\d+-\d+\]/g, (match, offset) => {
            const beforeMatch = effect.substring(0, offset);
            const minRangeCount = (beforeMatch.match(/\[\d+-\d+\]/g) || []).length;
            return minRangeCount === 0 ? minVal : maxVal;
          });
        } else if (singleVal) {
          effect = effect.replace(/\[\d+-\d+\]/, singleVal);
        }

        stats.push(`<span style="color: #8888ff;">${effect}</span>`);
        maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
      }
    });

    preview.innerHTML = `
        <div style="color: ${this.getJewelColor()}; font-weight: bold;">${jewelName}</div>
        <div style="color: #888; font-size: 12px;">Required Level: ${maxRequiredLevel}</div>
        ${stats.length > 0 ? stats.join('<br>') : '<span style="color: #888;">No special properties</span>'}
    `;
  }

  getJewelColor() {
    const colors = {
      white: '#ffffff',
      blue: '#6666ff',
      yellow: '#ffff66',
      green: '#66ff66',
      purple: '#c412caff',
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


  resetJewelSelections() {
    this.selectedJewelColor = 'white';

    // Reset all prefixes
    this.selectedJewelPrefix1 = null;
    this.selectedJewelPrefix2 = null;
    this.selectedJewelPrefix3 = null;
    this.selectedJewelPrefix1Value = null;
    this.selectedJewelPrefix2Value = null;
    this.selectedJewelPrefix3Value = null;
    this.selectedJewelPrefix1MinValue = null;
    this.selectedJewelPrefix2MinValue = null;
    this.selectedJewelPrefix3MinValue = null;
    this.selectedJewelPrefix1MaxValue = null;
    this.selectedJewelPrefix2MaxValue = null;
    this.selectedJewelPrefix3MaxValue = null;

    // Reset all suffixes
    this.selectedJewelSuffix1 = null;
    this.selectedJewelSuffix2 = null;
    this.selectedJewelSuffix3 = null;
    this.selectedJewelSuffix3Value = null;
    this.selectedJewelSuffix3MinValue = null;
    this.selectedJewelSuffix3MaxValue = null;
    this.selectedJewelSuffix1Value = null;
    this.selectedJewelSuffix2Value = null;
    this.selectedJewelSuffix1MinValue = null;
    this.selectedJewelSuffix2MinValue = null;
    this.selectedJewelSuffix1MaxValue = null;
    this.selectedJewelSuffix2MaxValue = null;
  }



  createCustomJewel() {
    const socketToUse = this.targetSocket || this.currentSocket;
    if (!socketToUse) {
      alert('No socket selected!');
      return;
    }

    // Collect all selected affixes
    let stats = [];
    let maxRequiredLevel = 1;

    // Handle prefix 1
    if (this.selectedJewelPrefix1) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix1];
      let effect = prefix.effect;

      if (this.selectedJewelPrefix1MinValue && this.selectedJewelPrefix1MaxValue) {
        effect = `Adds ${this.selectedJewelPrefix1MinValue}-${this.selectedJewelPrefix1MaxValue} ${prefix.effect.includes('Cold') ? 'Cold' : prefix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelPrefix1Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefix1Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
    }

    // Handle prefix 2
    if (this.selectedJewelPrefix2) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix2];
      let effect = prefix.effect;

      if (this.selectedJewelPrefix2MinValue && this.selectedJewelPrefix2MaxValue) {
        effect = `Adds ${this.selectedJewelPrefix2MinValue}-${this.selectedJewelPrefix2MaxValue} ${prefix.effect.includes('Cold') ? 'Cold' : prefix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelPrefix2Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefix2Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
    }

    // Handle prefix 3
    if (this.selectedJewelPrefix3) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix3];
      let effect = prefix.effect;

      if (this.selectedJewelPrefix3MinValue && this.selectedJewelPrefix3MaxValue) {
        effect = `Adds ${this.selectedJewelPrefix3MinValue}-${this.selectedJewelPrefix3MaxValue} ${prefix.effect.includes('Cold') ? 'Cold' : prefix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelPrefix3Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefix3Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
    }

    // Handle suffix 1
    if (this.selectedJewelSuffix1) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix1];
      let effect = suffix.effect;

      if (this.selectedJewelSuffix1MinValue && this.selectedJewelSuffix1MaxValue) {
        effect = `Adds ${this.selectedJewelSuffix1MinValue}-${this.selectedJewelSuffix1MaxValue} ${suffix.effect.includes('Cold') ? 'Cold' : suffix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelSuffix1Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffix1Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
    }

    // Handle suffix 2
    if (this.selectedJewelSuffix2) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix2];
      let effect = suffix.effect;

      if (this.selectedJewelSuffix2MinValue && this.selectedJewelSuffix2MaxValue) {
        effect = `Adds ${this.selectedJewelSuffix2MinValue}-${this.selectedJewelSuffix2MaxValue} ${suffix.effect.includes('Cold') ? 'Cold' : suffix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelSuffix2Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffix2Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
    }

    if (this.selectedJewelSuffix3) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix3];
      let effect = suffix.effect;

      if (this.selectedJewelSuffix3MinValue && this.selectedJewelSuffix3MaxValue) {
        effect = `Adds ${this.selectedJewelSuffix3MinValue}-${this.selectedJewelSuffix3MaxValue} ${suffix.effect.includes('Cold') ? 'Cold' : suffix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelSuffix3Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffix3Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
    }

    // Validate affix requirements
    const prefixCount = [this.selectedJewelPrefix1, this.selectedJewelPrefix2, this.selectedJewelPrefix3].filter(p => p).length;
    const suffixCount = [this.selectedJewelSuffix1, this.selectedJewelSuffix2, this.selectedJewelSuffix3].filter(s => s).length;
    const totalAffixes = prefixCount + suffixCount;

    if (prefixCount === 0 || suffixCount === 0) {
      alert('You must select at least 1 prefix and 1 suffix!');
      return;
    }

    if (totalAffixes > 4) {
      alert('Maximum 4 affixes allowed! You have selected ' + totalAffixes + ' affixes.');
      return;
    }

    const jewelStats = stats.join(', ');
    const jewelName = `${this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1)} Jewel`;

    // Get the correct colored jewel image
    const jewelImage = `img/jewel${this.selectedJewelColor}.png`;

    // Fill the socket
    socketToUse.className = 'socket-slot filled';
    socketToUse.innerHTML = `<img src="${jewelImage}" alt="${jewelName}">`;
    socketToUse.dataset.itemKey = 'custom-jewel';
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = jewelName;
    socketToUse.dataset.stats = jewelStats;
    socketToUse.dataset.levelReq = maxRequiredLevel.toString();

    this.hideJewelModal();
    this.updateAll();

    // Reset selections
    this.resetJewelSelections();
  }
  // === STATS CALCULATION ===
  calculateActualRequiredLevel(section, itemName) {
    // Use window.getItemData to support both regular and crafted items
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];
    if (!item) return 1;

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

  isItemUsableByCharacterClass(itemName) {
    // Use window.getItemData to support both regular and crafted items
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];
    if (!item) return true;

    // Crafted items have no class restrictions
    if (item.isCrafted) return true;

    if (!item.description) return true;

    // Look for class restriction pattern: "(ClassName Only)"
    const classPattern = /\(([A-Za-z]+)\s+Only\)/i;
    const match = item.description.match(classPattern);

    if (match && match[1]) {
      const restrictedClass = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      const currentClass = document.getElementById('selectClass')?.value || 'Amazon';
      return restrictedClass === currentClass;
    }

    return true; // No class restriction
  }

  doesCharacterMeetStatRequirements(itemName) {
    // Use window.getItemData to support both regular and crafted items
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];
    if (!item) return true;
    if (!item.properties) return true;

    const requiredStr = item.properties.reqstr || 0;
    const requiredDex = item.properties.reqdex || 0;

    // Get current character stats from inputs
    const strInput = parseInt(document.getElementById('str')?.value);
    const dexInput = parseInt(document.getElementById('dex')?.value);

    // If inputs are not available, return true (allow display)
    if (isNaN(strInput) || isNaN(dexInput)) return true;

    return strInput >= requiredStr && dexInput >= requiredDex;
  }

  getItemRequiredStats(itemName) {
    // Use window.getItemData to support both regular and crafted items
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];
    if (!item) return { str: 0, dex: 0 };
    if (!item.properties) return { str: 0, dex: 0 };

    return {
      str: item.properties.reqstr || 0,
      dex: item.properties.reqdex || 0
    };
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

  // NUCLEAR OPTION: Post-Processing Deduplication to satisfy user request ("Recalculate duplicate text")
  // This checks if the Red Corruption Text appears elsewhere (as White Text) and removes the Red Text if found.
  cleanDuplicateCorruptionText(html) {
    if (!html || !html.includes('corruption-enhanced-stat')) return html;

    let cleanedHtml = html;

    // 1. Remove Exact Red Duplicates (Double Red Lines)
    const redPattern = /(<div class="corruption-enhanced-stat">[^<]+<\/div>|<span class="corruption-enhanced-stat">[^<]+<\/span>)/gi;
    const redMatches = cleanedHtml.match(redPattern);

    if (redMatches && redMatches.length > 1) {
      const uniqueMatches = new Set();
      for (const match of redMatches) {
        const content = match.replace(/<[^>]+>/g, '').toLowerCase().trim();
        if (uniqueMatches.has(content)) {
          // Replace only the first occurrence found (which effectively removes duplicates one by one)
          cleanedHtml = cleanedHtml.replace(match, '');
        } else {
          uniqueMatches.add(content);
        }
      }
    }

    // 2. Remove Red if Fuzzy Matched in White
    // Helper to strip tags and normalize
    const normalize = (s) => s.replace(/<[^>]+>/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const tokenize = (s) => s.replace(/<[^>]+>/g, '').toLowerCase().match(/[a-z]+/g) || [];

    const divPattern = /<div class="corruption-enhanced-stat">([^<]+)<\/div>/gi;
    const spanPattern = /<span class="corruption-enhanced-stat">([^<]+)<\/span>/gi;

    // Function to process matches
    const processMatches = (pattern) => {
      let match;
      // We must reset lastIndex or create new regex loop if reusing global regex, 
      // but here we create new regex logic or just iterate 'cleanedHtml' which changes.
      // Iterating a changing string with exec is tricky.
      // Simpler approach: find all matches first, then process?
      // No, because removing one might affect others (overlap?). Unlikely for distinct div/span blocks.

      // Let's use a standard while loop but be careful about infinite loops if string doesn't shrink.
      // But we always replace with '' if match found.

      while ((match = pattern.exec(cleanedHtml)) !== null) {
        const fullTag = match[0];
        const textContent = match[1];
        if (!textContent) continue;

        const corruptTokens = tokenize(textContent);
        if (corruptTokens.length === 0) continue;

        // Temporarily remove this tag to check the REST of the description
        const tempHtml = cleanedHtml.replace(fullTag, '');
        const restTokens = tokenize(tempHtml);

        const significantTokens = corruptTokens.filter(t => t.length > 2);
        if (significantTokens.length === 0) continue;

        // Check for Magic Find specifically
        const isMagicFind = significantTokens.includes('magic') && significantTokens.includes('find');
        const isMFInDescription = restTokens.includes('magic') && restTokens.includes('items') && restTokens.includes('chance');

        // Check all tokens
        let matchCount = 0;
        for (const token of significantTokens) {
          if (restTokens.includes(token)) matchCount++;
        }
        const matchRatio = matchCount / significantTokens.length;

        if (matchRatio >= 1.0 || (isMagicFind && isMFInDescription)) {
          // Duplicate found! Remove it.
          cleanedHtml = cleanedHtml.replace(fullTag, '');
          // Since we modified cleanedHtml, the regex index is invalid. Return true to restart loop?
          return true;
        }
      }
      return false;
    };

    // Loop until stable
    let mutated = true;
    let maxLoops = 5;
    while (mutated && maxLoops > 0) {
      // Re-create regexes each pass to ensure clean state
      const p1 = /<div class="corruption-enhanced-stat">([^<]+)<\/div>/gi;
      const p2 = /<span class="corruption-enhanced-stat">([^<]+)<\/span>/gi;
      mutated = processMatches(p1) || processMatches(p2);
      maxLoops--;
    }

    return cleanedHtml;
  }

  updateItemDisplay(section) {
    const infoId = this.getSectionInfoId(section);
    const infoDiv = document.getElementById(infoId);
    if (!infoDiv) {
      return;
    }

    const dropdownId = this.getSectionDropdownId(section);
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown || !dropdown.value) {
      infoDiv.innerHTML = '';
      return;
    }

    // CRITICAL FIX: Use dropdown-specific cache to get the modified item
    // This ensures we use the item with updated properties from handleVariableStatChange
    const cacheKey = `${dropdownId}_${dropdown.value}`;
    let item = window.dropdownItemCache?.[cacheKey];

    // If not in cache, this is the first time - shouldn't happen if updateItemInfo ran first
    // but handle it gracefully
    if (!item) {
      item = window.getItemData(dropdown.value);
    }

    if (!item) {
      infoDiv.innerHTML = '';
      return;
    }

    // NOTE: We do NOT reset properties here in socket.js because it would wipe
    // manual user input changes (e.g. perfect rolls).
    // The "Reset on Switch" logic is handled in main.js updateItemInfo.
    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
    const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
    const meetsRequirement = currentLevel >= actualRequiredLevel;
    const isUsableByClass = this.isItemUsableByCharacterClass(dropdown.value);
    const meetsStatRequirements = this.doesCharacterMeetStatRequirements(dropdown.value);

    // Get socket stats
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);

    // Handle dynamic items (no static description, or has baseType)
    if (!item.description || item.baseType) {
      // Always regenerate description for dynamic items to re-attach event listeners
      // (This is critical for items like Arcanna's Deathwand with variable stats)
      let baseDescription = window.generateItemDescription(dropdown.value, item, dropdownId);


      // TODO: Potential fix for skill damage stats resetting to 0 after input changes:
      // Store the regenerated description back into item.description so that when
      // calculateAllStats() is called by other systems (setTracker, character manager, etc.),
      // they parse the UPDATED description with current property values.
      // However, this currently breaks input box functionality, so it's disabled for now.
      // item.description = baseDescription;

      // Check if item has corruption applied
      // NOTE: We do NOT use addCorruptionWithStacking here because properties are already updated via corrupt.js
      // Using it would cause double-counting (e.g. 24% base + 24% corruption text = 48%)
      // We will handle visual "Red" styling separately if needed
      if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
        // Handled by main.js formatVariableStat
      }

      // Parse base stats from the generated description (strip input elements first)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = baseDescription;
      tempDiv.querySelectorAll('.stat-input').forEach(input => input.remove());
      const cleanBaseDescription = tempDiv.innerHTML;

      const baseStats = this.parseStatsToMap(cleanBaseDescription);

      // Build socket items and merge stats
      const socketItems = [];
      sockets.forEach(socket => {
        const stats = socket.dataset.stats;
        const itemName = socket.dataset.itemName;
        const levelReq = parseInt(socket.dataset.levelReq) || 1;
        const socketUsable = currentLevel >= levelReq;

        if (stats && itemName) {
          socketItems.push({
            name: itemName,
            stats,
            levelReq,
            usable: socketUsable && meetsRequirement && isUsableByClass && meetsStatRequirements
          });

          // Merge stats if usable
          if (socketUsable && meetsRequirement && isUsableByClass && meetsStatRequirements) {
            const parsedSocketStats = this.parseStatsToMap(stats);
            this.mergeStatsMaps(baseStats, parsedSocketStats);
          }
        }
      });

      // For ALL dynamic items, use generateStackedDescription to show merged stats
      // This function now preserves input boxes while stacking non-variable stats
      // For example, Biggin's Bonnet will keep edmg/toatt inputs but stack +life from rubies
      //
      // TODO: Future enhancement for items where socket bonuses affect the SAME variable stats
      // (e.g., weapon with variable edmg + jewel with +edmg%). Currently those don't combine.
      let finalDescription = this.generateStackedDescription(baseDescription, baseStats, socketItems);

      // Update Required Level display - only check level requirement
      const levelColor = meetsRequirement ? '#00ff00' : '#ff5555';
      const newLevelLine = `<span style="color: ${levelColor}; font-weight: bold;">Required Level: ${actualRequiredLevel}</span>`;
      const levelPattern = /(?:<span[^>]*>)?Required Level: \d+(?:<\/span>)?/gi;
      if (levelPattern.test(finalDescription)) {
        finalDescription = finalDescription.replace(levelPattern, newLevelLine);
      }

      // Update Required Strength and Dexterity colors - check individually
      finalDescription = this.updateStatRequirementColors(finalDescription, dropdown.value);

      // Update display
      infoDiv.innerHTML = finalDescription;

      // Re-attach input listeners
      if (typeof attachStatInputListeners === 'function') {
        attachStatInputListeners();
      } else if (typeof window.attachStatInputListeners === 'function') {
        window.attachStatInputListeners();
      }

      // Update visual feedback
      if (!meetsRequirement || !isUsableByClass || !meetsStatRequirements) {
        infoDiv.style.opacity = '0.6';
        infoDiv.style.filter = 'grayscale(50%)';
        if (!meetsRequirement) {
          infoDiv.title = `You need level ${actualRequiredLevel} to use this item`;
        } else if (!isUsableByClass) {
          infoDiv.title = `This item is restricted to a different class`;
        } else {
          infoDiv.title = `You don't have the required strength or dexterity to use this item`;
        }
      } else {
        infoDiv.style.opacity = '1';
        infoDiv.style.filter = 'none';
        infoDiv.title = '';
      }
      return;
    }

    // From here on, handle static description items
    // CRITICAL FIX: Use the ORIGINAL description as base for merging corruption/sockets
    // This prevents double-counting if item.description already contains the corruption
    let baseDescription = (window.originalItemDescriptions && window.originalItemDescriptions[dropdown.value]) || item.description;
    const baseStats = this.parseStatsToMap(baseDescription);

    // Build socket items array
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
          usable: currentLevel >= levelReq && meetsRequirement && isUsableByClass && meetsStatRequirements
        });

        // Only merge stats if both item and socket are usable
        if (meetsRequirement && currentLevel >= levelReq && isUsableByClass && meetsStatRequirements) {
          const parsedSocketStats = this.parseStatsToMap(stats);
          this.mergeStatsMaps(baseStats, parsedSocketStats);
        }
      }
    });

    // CRITICAL FIX: Use addCorruptionWithStacking for Static Items
    // This function from corrupt.js properly handles multi-line corruptions
    // by stacking what can be stacked and displaying the rest in red
    let corruptionMerged = false;
    if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
      const corruption = window.itemCorruptions[dropdownId];
      if (corruption.text && corruption.itemName === dropdown.value) {
        // Use the corruption stacking function from corrupt.js
        if (typeof window.addCorruptionWithStacking === 'function') {
          baseDescription = window.addCorruptionWithStacking(baseDescription, corruption.text);
          corruptionMerged = true;
        }
      }
    }

    // Generate final description with stacked properties
    let finalDescription = this.generateStackedDescription(baseDescription, baseStats, socketItems);

    // CRITICAL FIX: Smart Corruption Display for Static Items
    // ONLY run this fallback if we didn't successfully merge the corruption logic above
    if (!corruptionMerged && window.itemCorruptions && window.itemCorruptions[dropdownId]) {
      const corruption = window.itemCorruptions[dropdownId];
      if (corruption.text && corruption.itemName === dropdown.value) {
        // Smart Strip: Preserve input values
        let plainDescription = finalDescription.replace(/<input[^>]+value=["']([^"']+)["'][^>]*>/gi, '$1');
        plainDescription = plainDescription.replace(/<[^>]+>/g, '');

        // Normalize for comparison
        const normalize = (s) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
        const plainNorm = normalize(plainDescription);
        const corruptNorm = normalize(corruption.text);

        if (plainNorm.includes(corruptNorm)) {
          // Found - Skip append
        } else {
          // Corruption text not found - Append new Red Div
          finalDescription += `<div class="corruption-enhanced-stat">${corruption.text}</div>`;
        }
      }
    }

    // Update Required Level display - only check level requirement
    const levelColor = meetsRequirement ? '#00ff00' : '#ff5555';
    const newLevelLine = `<span style="color: ${levelColor}; font-weight: bold;">Required Level: ${actualRequiredLevel}</span>`;

    const levelPattern = /(?:<span[^>]*>)?Required Level: \d+(?:<\/span>)?/gi;
    if (levelPattern.test(finalDescription)) {
      finalDescription = finalDescription.replace(levelPattern, newLevelLine);
    }

    // Update Required Strength and Dexterity colors - check individually
    finalDescription = this.updateStatRequirementColors(finalDescription, dropdown.value);

    // NUCLEAR OPTION: Post-Processing Deduplication
    finalDescription = this.cleanDuplicateCorruptionText(finalDescription);

    // Visual feedback for unusable items
    if (!meetsRequirement || !isUsableByClass || !meetsStatRequirements) {
      infoDiv.style.opacity = '0.6';
      infoDiv.style.filter = 'grayscale(50%)';
      if (!meetsRequirement) {
        infoDiv.title = `You need level ${actualRequiredLevel} to use this item`;
      } else if (!isUsableByClass) {
        infoDiv.title = `This item is restricted to a different class`;
      } else {
        infoDiv.title = `You don't have the required strength or dexterity to use this item`;
      }
    } else {
      infoDiv.style.opacity = '1';
      infoDiv.style.filter = 'none';
      infoDiv.title = '';
    }

    infoDiv.innerHTML = finalDescription;
  }

  // Generate final description with stacked properties and visual indicators
  generateStackedDescription(originalDescription, mergedStats, socketItems) {
    // Extract ethereal text if present, to re-add at the very end
    const etherealMatch = originalDescription.match(/\s*<span[^>]*>Ethereal<\/span>/i);
    const etherealText = etherealMatch ? etherealMatch[0] : '';
    let finalDescription = etherealText ? originalDescription.replace(/\s*<span[^>]*>Ethereal<\/span>/i, '') : originalDescription;

    // EXTRACT CORRUPTION BUTTON Logic
    // Socket system would accidentally strip the button because it rebuilds the description
    // match any button calling openCorruptionModal
    const buttonMatch = finalDescription.match(/<button[^>]*openCorruptionModal[^>]*>.*?<\/button>/i);
    const buttonText = buttonMatch ? buttonMatch[0] : '';
    if (buttonText) {
      // Temporarily remove it so it doesn't get messed up by regex replacements
      finalDescription = finalDescription.replace(buttonText, '');
    }

    const sortedKeys = Array.from(mergedStats.keys()).sort((a, b) => {
      // Process percentage patterns first (e.g., physical_damage_reduced_percent before physical_damage_reduced)
      if (a.includes('_percent') && !b.includes('_percent')) return -1;
      if (!a.includes('_percent') && b.includes('_percent')) return 1;
      return 0;
    });

    // Replace stacked stats in original description with blue colored versions
    sortedKeys.forEach(key => {
      const data = mergedStats.get(key);
      if (data.stacked || data.fromSocket) {
        const replacement = this.formatStackedStat(key, data);
        if (replacement) {
          const pattern = this.getStatPattern(key);
          if (pattern && !data.fromSocket) {
            // Replace existing stat line with stacked version
            // BUT preserve any stat-input elements that are in the original line
            finalDescription = finalDescription.replace(pattern, (match) => {
              // Check if the matched text contains a stat-input element
              const inputMatch = match.match(/<input[^>]*class="stat-input"[^>]*>/);
              if (inputMatch) {
                // Keep the input element and append it to the replacement
                return replacement + ' ' + inputMatch[0];
              }
              return replacement;
            });
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

    // Re-add ethereal at the very end if it was present
    if (etherealText) {
      finalDescription += etherealText;
    }

    // CRITICAL FIX: Re-add the corruption button
    if (buttonText) {
      finalDescription += `<br>${buttonText}`;
    }

    return finalDescription;
  }

  updateStatRequirementColors(description, itemName) {
    let updatedDescription = description;
    const reqStats = this.getItemRequiredStats(itemName);

    // Get current character stats from inputs
    const strInput = parseInt(document.getElementById('str')?.value) || 0;
    const dexInput = parseInt(document.getElementById('dex')?.value) || 0;

    // Check each requirement independently
    const meetsStrRequirement = strInput >= reqStats.str;
    const meetsDexRequirement = dexInput >= reqStats.dex;

    // Determine color based on EACH requirement independently
    const strColor = meetsStrRequirement ? '#00ff00' : '#ff5555';
    const dexColor = meetsDexRequirement ? '#00ff00' : '#ff5555';

    // Replace Required Strength
    if (reqStats.str > 0) {
      const strPattern = /(?:<span[^>]*>)?Required Strength: \d+(?:<\/span>)?/gi;
      const newStrLine = `<span style="color: ${strColor}; font-weight: bold;">Required Strength: ${reqStats.str}</span>`;
      updatedDescription = updatedDescription.replace(strPattern, newStrLine);
    }

    // Replace Required Dexterity
    if (reqStats.dex > 0) {
      const dexPattern = /(?:<span[^>]*>)?Required Dexterity: \d+(?:<\/span>)?/gi;
      const newDexLine = `<span style="color: ${dexColor}; font-weight: bold;">Required Dexterity: ${reqStats.dex}</span>`;
      updatedDescription = updatedDescription.replace(dexPattern, newDexLine);
    }

    return updatedDescription;
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
      if (Array.isArray(this.stats[key])) {
        this.stats[key] = [];
      } else {
        this.stats[key] = typeof this.stats[key] === 'boolean' ? false : 0;
      }
    });

    // Explicitly reset Rainbow Facet stats to be sure
    this.stats.fireSkillDamage = 0;
    this.stats.coldSkillDamage = 0;
    this.stats.lightningSkillDamage = 0;
    this.stats.poisonSkillDamage = 0;
    this.stats.magicSkillDamage = 0;
    this.stats.pierceFire = 0;
    this.stats.pierceCold = 0;
    this.stats.pierceLightning = 0;
    this.stats.piercePoison = 0;
    this.stats.piercePhysical = 0;
    this.stats.pierceMagic = 0;

    // CRITICAL: Reset treeSkills object (not in initial stats, so Object.keys won't reset it)
    this.stats.treeSkills = {};

    // Reset mercenary stats
    Object.keys(this.mercenaryStats).forEach(key => {
      this.mercenaryStats[key] = typeof this.mercenaryStats[key] === 'boolean' ? false : 0;
    });

    // Calculate equipment stats (ONLY player equipment, exclude mercenary)
    Object.entries(this.equipmentMap).forEach(([dropdownId, config]) => {
      // Skip mercenary equipment for player stats
      if (config.section.startsWith('merc')) return;
      this.calculateEquipmentStats(dropdownId, config.section);
    });

    // Calculate socket stats
    this.calculateSocketStats();

    // Calculate mercenary equipment stats separately
    this.calculateMercenaryStats();

    // Update mercenary stats display
    this.updateMercenaryStatsDisplay();

    // INTEGRATION: Add charm and equipment class bonuses
    // ALL charm bonuses are read from DOM via getCharmBonuses() - single source of truth
    if (typeof getCharmBonuses === 'function') {
      const charmBonuses = getCharmBonuses();

      // Merge charm bonuses into socket stats
      this.stats.allSkills = (this.stats.allSkills || 0) + (charmBonuses.allSkills || 0);
      this.stats.classSkills = (this.stats.classSkills || 0) + (charmBonuses.classSkills || 0);

      // ALSO add equipment class-specific skills (e.g. amask: 2 from Blastbark)
      if (window.characterManager && typeof window.characterManager.getEquipmentClassSkills === 'function') {
        this.stats.classSkills += window.characterManager.getEquipmentClassSkills();
      }

      // Add tree-specific skill bonuses (e.g. +3 to Javelin and Spear Skills)
      this.stats.treeSkills = charmBonuses.treeSkills || {};
      if (window.characterManager && typeof window.characterManager.getEquipmentTreeSkills === 'function') {
        const equipTreeBonuses = window.characterManager.getEquipmentTreeSkills();
        Object.keys(equipTreeBonuses).forEach(treeId => {
          this.stats.treeSkills[treeId] = (this.stats.treeSkills[treeId] || 0) + equipTreeBonuses[treeId];
        });
      }

      // Add charm bonuses 
      this.stats.strength = (this.stats.strength || 0) + (charmBonuses.str || 0);
      this.stats.dexterity = (this.stats.dexterity || 0) + (charmBonuses.dex || 0);
      this.stats.vitality = (this.stats.vitality || 0) + (charmBonuses.vit || 0);
      this.stats.energy = (this.stats.energy || 0) + (charmBonuses.enr || 0);

      this.stats.life = (this.stats.life || 0) + (charmBonuses.life || 0);
      this.stats.mana = (this.stats.mana || 0) + (charmBonuses.mana || 0);
      this.stats.defense = (this.stats.defense || 0) + (charmBonuses.defense || 0);
      this.stats.magicFind = (this.stats.magicFind || 0) + (charmBonuses.magicFind || 0);
      this.stats.goldFind = (this.stats.goldFind || 0) + (charmBonuses.goldFind || 0);
      this.stats.frw = (this.stats.frw || 0) + (charmBonuses.frw || 0);
      this.stats.fhr = (this.stats.fhr || 0) + (charmBonuses.fhr || 0);
      this.stats.coldResist = (this.stats.coldResist || 0) + (charmBonuses.coldResist || 0);
      this.stats.fireResist = (this.stats.fireResist || 0) + (charmBonuses.fireResist || 0);
      this.stats.lightResist = (this.stats.lightResist || 0) + (charmBonuses.lightResist || 0);
      this.stats.poisonResist = (this.stats.poisonResist || 0) + (charmBonuses.poisonResist || 0);

      // Add flat AR from charms
      this.stats.toatt = (this.stats.toatt || 0) + (charmBonuses.attackrating || 0);

      // Add damage bonuses from charms
      this.stats.lightDmgMin = (this.stats.lightDmgMin || 0) + (charmBonuses.lightDmgMin || 0);
      this.stats.lightDmgMax = (this.stats.lightDmgMax || 0) + (charmBonuses.lightDmgMax || 0);
      this.stats.fireDmgMin = (this.stats.fireDmgMin || 0) + (charmBonuses.fireDmgMin || 0);
      this.stats.fireDmgMax = (this.stats.fireDmgMax || 0) + (charmBonuses.fireDmgMax || 0);
      this.stats.coldDmgMin = (this.stats.coldDmgMin || 0) + (charmBonuses.coldDmgMin || 0);
      this.stats.coldDmgMax = (this.stats.coldDmgMax || 0) + (charmBonuses.coldDmgMax || 0);
      this.stats.poisonDmgMin = (this.stats.poisonDmgMin || 0) + (charmBonuses.poisonDmgMin || 0);
      this.stats.poisonDmgMax = (this.stats.poisonDmgMax || 0) + (charmBonuses.poisonDmgMax || 0);
    }

    // INTEGRATION: Add bonuses from passive skills (Barbarian masteries, etc.)
    if (window.skillSystem) {
      // 1. Initial update with gear/charms only (needed for BC itself to calculate its level)
      const gearAllSkills = this.stats.allSkills || 0;
      window.skillSystem.skillBonuses.allSkills = gearAllSkills;
      window.skillSystem.skillBonuses.classSkills = this.stats.classSkills || 0;
      window.skillSystem.skillBonuses.treeSkills = this.stats.treeSkills || {};

      // 2. Battle Command integration (adds to allSkills)
      // Check party for better BC
      const partyBC = window.partyManager?.getBestBuff('battle-command');
      const partyBCSkills = partyBC ? partyBC.allSkills : 0;

      let ownBCSkills = window.skillSystem.getBattleCommandSkills?.() || 0;
      let bcSkills = Math.max(ownBCSkills, partyBCSkills);
      this.stats.allSkills = gearAllSkills + bcSkills;

      // Update SkillSystem with the first-pass total and check if BC bonus increased
      window.skillSystem.skillBonuses.allSkills = this.stats.allSkills;
      ownBCSkills = window.skillSystem.getBattleCommandSkills?.() || 0;
      bcSkills = Math.max(ownBCSkills, partyBCSkills);

      // Final allSkills total (Gear + BC bonus)
      this.stats.allSkills = gearAllSkills + bcSkills;

      const partyBCDamage = partyBC ? partyBC.damage : 0;
      this.stats.enhancedPhysicalDamage = (this.stats.enhancedPhysicalDamage || 0) + Math.max(partyBCDamage, window.skillSystem.getBattleCommandDamageBonus?.() || 0);

      // 3. Update SkillSystem one last time with the absolute total allSkills
      // This ensures skills like Natural Resistance or Battle Orders use the latest level
      window.skillSystem.skillBonuses.allSkills = this.stats.allSkills || 0;

      // Natural Resistance (All Res)
      const natRes = window.skillSystem.getNaturalResistanceBonus?.() || 0;
      this.stats.fireResist += natRes;
      this.stats.coldResist += natRes;
      this.stats.lightResist += natRes;
      this.stats.poisonResist += natRes;

      // Defense bonuses (Iron Skin) - Skill-based %Def multipliers are applied in updateStatsDisplay to include Dex bonus
      const ironSkinBonus = window.skillSystem.getIronSkinDefenseBonus?.() || 0;
      this.stats.dr += (window.skillSystem.getIronSkinPDRBonus?.() || 0);

      // Increased Speed (FRW and IAS)
      this.stats.frw += (window.skillSystem.getIncreasedSpeedFRW?.() || 0);
      this.stats.ias += (window.skillSystem.getIncreasedSpeedIAS?.() || 0);

      // Skill-based AR bonuses (Passives, Active Skill, Enchant)
      this.stats.toattPercent = (this.stats.toattPercent || 0) +
        (window.skillSystem.getPassiveARBonus?.() || 0) +
        (window.skillSystem.getActiveSkillARBonus?.() || 0) +
        (window.skillSystem.getEnchantARBonus?.() || 0);

      // Combat Reflexes (FHR, Life, Stamina)
      this.stats.fhr += (window.skillSystem.getCombatReflexesFHR?.() || 0);
      this.stats.life += (window.skillSystem.getCombatReflexesLifeBonus?.() || 0);

      // Deep Wounds / Hunger / Thorns Open Wounds
      this.stats.openWounds = (this.stats.openWounds || 0) + (window.skillSystem.getDeepWoundsChance?.() || 0) + (window.skillSystem.getHungerChance?.() || 0) + (window.skillSystem.getThornsOpenWoundsChance?.() || 0);

      // PD2 Open Wounds damage Calculation: Base(from Level) + Skills + Items
      const baseOWDamage = this.openWoundsBaseDamage[Math.min(this.currentLevel - 1, 98)] || 0;
      this.stats.openWoundsDamage = baseOWDamage + (this.stats.openWoundsDamage || 0) + (window.skillSystem.getDeepWoundsDamage?.() || 0) + (window.skillSystem.getHungerDamage?.() || 0) + (window.skillSystem.getThornsOpenWoundsDamage?.() || 0);

      // Druid Spirit Buffs (Party Aware)
      const partyHOW = window.partyManager?.getBestBuff('heart-of-wolverine');
      const howDmg = Math.max(partyHOW?.damageBonus || 0, window.skillSystem.getHeartOfWolverineDamageBonus?.() || 0);
      const howAR = Math.max(partyHOW?.arBonus || 0, window.skillSystem.getHeartOfWolverineARBonus?.() || 0);

      this.stats.enhancedPhysicalDamage = (this.stats.enhancedPhysicalDamage || 0) + howDmg;
      this.stats.toattPercent = (this.stats.toattPercent || 0) + howAR;

      const partyOak = window.partyManager?.getBestBuff('oak-sage');
      const oakLife = Math.max(partyOak?.lifeBonus || 0, window.skillSystem.getOakSageLifeBonus?.() || 0);
      const oakReplenish = Math.max(partyOak?.lifeReplenish || 0, window.skillSystem.getOakSageLifeReplenish?.() || 0);

      this.stats.life = (this.stats.life || 0) + oakLife;
      this.stats.replenishLife = (this.stats.replenishLife || 0) + oakReplenish;

      const partySOB = window.partyManager?.getBestBuff('spirit-of-barbs');
      this.stats.damageReturn = (this.stats.damageReturn || 0) + Math.max(partySOB?.damageReturn || 0, window.skillSystem.getSpiritOfBarbsReturn?.() || 0);

      // Battle Orders / Buffs (Party Aware)
      const partyBO = window.partyManager?.getBestBuff('battle-orders');
      const boLife = Math.max(partyBO?.life || 0, window.skillSystem.getBattleOrdersLifeBonus?.() || 0);
      const boMana = Math.max(partyBO?.mana || 0, window.skillSystem.getBattleOrdersManaBonus?.() || 0);

      this.stats.life = (this.stats.life || 0) + boLife;
      this.stats.mana = (this.stats.mana || 0) + boMana;

      // Sorceress Mastery Skills (Fire, Cold, Lightning)
      // Fire Mastery - adds to fire skill damage and enemy fire resistance pierce
      const fireMasteryLevel = window.skillSystem?.getSkillTotalLevel?.('firemasterycontainer') || 0;
      if (fireMasteryLevel > 0 && window.skillSystem?.skillData?.firemasterycontainer) {
        const fireMasteryData = window.skillSystem.skillData.firemasterycontainer;
        if (fireMasteryData.fireDamage && fireMasteryData.fireDamage[fireMasteryLevel - 1] !== undefined) {
          this.stats.fireSkillDamage = (this.stats.fireSkillDamage || 0) + fireMasteryData.fireDamage[fireMasteryLevel - 1];
        }
        if (fireMasteryData.enemyFireResist && fireMasteryData.enemyFireResist[fireMasteryLevel - 1] !== undefined) {
          this.stats.pierceFire = (this.stats.pierceFire || 0) + Math.abs(fireMasteryData.enemyFireResist[fireMasteryLevel - 1]);
        }
      }

      // Cold Mastery - adds to cold skill damage and enemy cold resistance pierce
      const coldMasteryLevel = window.skillSystem?.getSkillTotalLevel?.('coldmasterycontainer') || 0;
      if (coldMasteryLevel > 0 && window.skillSystem?.skillData?.coldmasterycontainer) {
        const coldMasteryData = window.skillSystem.skillData.coldmasterycontainer;
        if (coldMasteryData.coldDamage && coldMasteryData.coldDamage[coldMasteryLevel - 1] !== undefined) {
          this.stats.coldSkillDamage = (this.stats.coldSkillDamage || 0) + coldMasteryData.coldDamage[coldMasteryLevel - 1];
        }
        if (coldMasteryData.enemyColdResist && coldMasteryData.enemyColdResist[coldMasteryLevel - 1] !== undefined) {
          this.stats.pierceCold = (this.stats.pierceCold || 0) + Math.abs(coldMasteryData.enemyColdResist[coldMasteryLevel - 1]);
        }
      }

      // Lightning Mastery - adds to lightning skill damage (no pierce in the data)
      const lightningMasteryLevel = window.skillSystem?.getSkillTotalLevel?.('lightningmasterycontainer') || 0;
      if (lightningMasteryLevel > 0 && window.skillSystem?.skillData?.lightningmasterycontainer) {
        const lightningMasteryData = window.skillSystem.skillData.lightningmasterycontainer;
        if (lightningMasteryData.lightningDamage && lightningMasteryData.lightningDamage[lightningMasteryLevel - 1] !== undefined) {
          this.stats.lightningSkillDamage = (this.stats.lightningSkillDamage || 0) + lightningMasteryData.lightningDamage[lightningMasteryLevel - 1];
        }
      }

      // Update weapon swap buff cache BEFORE reporting (so we have current data)
      if (window.weaponSwapSystem) {
        window.weaponSwapSystem.updateCachedBuffs();
      }

      // REPORT BUFFS TO PARTY MANAGER - Only if not currently loading a character to prevent inconsistencies
      if (window.partyManager && !window._isLoadingCharacterData) {
        const idx = window.partyManager.activeIndex;
        const pkBuffs = {};

        // BO - use max level from both weapon sets
        let boLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('battleorderscontainer') : 0;
        if (window.weaponSwapSystem) {
          boLevel = window.weaponSwapSystem.getMaxBuffLevel('bo');
        }
        if (boLevel > 0) {
          pkBuffs['battle-orders'] = {
            level: boLevel,
            life: typeof window.skillSystem.getBattleOrdersLifeBonus === 'function' ? window.skillSystem.getBattleOrdersLifeBonus() : 0,
            mana: typeof window.skillSystem.getBattleOrdersManaBonus === 'function' ? window.skillSystem.getBattleOrdersManaBonus() : 0
          };
        }

        // BC - use max level from both weapon sets
        let bcLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('battlecommandcontainer') : 0;
        if (window.weaponSwapSystem) {
          bcLevel = window.weaponSwapSystem.getMaxBuffLevel('bc');
        }
        if (bcLevel > 0) {
          pkBuffs['battle-command'] = {
            level: bcLevel,
            allSkills: typeof window.skillSystem.getBattleCommandSkills === 'function' ? window.skillSystem.getBattleCommandSkills() : 0,
            damage: typeof window.skillSystem.getBattleCommandDamageBonus === 'function' ? window.skillSystem.getBattleCommandDamageBonus() : 0
          };
        }

        // Shout - use max level from both weapon sets
        let shoutLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('shoutcontainer') : 0;
        if (window.weaponSwapSystem) {
          shoutLevel = window.weaponSwapSystem.getMaxBuffLevel('shout');
        }
        if (shoutLevel > 0) {
          pkBuffs['shout'] = {
            level: shoutLevel,
            defenseBonus: typeof window.skillSystem.getShoutDefenseBonus === 'function' ? window.skillSystem.getShoutDefenseBonus() : 0
          };
        }

        // Grim Ward - use max level from both weapon sets
        let grimWardLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('grimwardcontainer') : 0;
        if (window.weaponSwapSystem) {
          grimWardLevel = window.weaponSwapSystem.getMaxBuffLevel('grimWard');
        }
        if (grimWardLevel > 0) {
          const levelIndex = Math.min(grimWardLevel - 1, 59);
          const skill = window.skillSystem.skillData.grimwardcontainer;
          pkBuffs['grim-ward'] = {
            level: grimWardLevel,
            attackRating: skill.attackRating[levelIndex] || 0,
            damageBonus: skill.damageBonus[levelIndex] || 0
          };
        }

        // Heart of Wolverine - use max level from both weapon sets
        let howLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('heartofwolverinecontainer') : 0;
        if (window.weaponSwapSystem) {
          howLevel = window.weaponSwapSystem.getMaxBuffLevel('how');
        }
        if (howLevel > 0) {
          pkBuffs['heart-of-wolverine'] = {
            level: howLevel,
            damageBonus: typeof window.skillSystem.getHeartOfWolverineDamageBonus === 'function' ? window.skillSystem.getHeartOfWolverineDamageBonus() : 0,
            arBonus: typeof window.skillSystem.getHeartOfWolverineARBonus === 'function' ? window.skillSystem.getHeartOfWolverineARBonus() : 0
          };
        }

        // Oak Sage - use max level from both weapon sets
        let oakLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('oaksagecontainer') : 0;
        if (window.weaponSwapSystem) {
          oakLevel = window.weaponSwapSystem.getMaxBuffLevel('oak');
        }
        if (oakLevel > 0) {
          pkBuffs['oak-sage'] = {
            level: oakLevel,
            lifeBonus: typeof window.skillSystem.getOakSageLifeBonus === 'function' ? window.skillSystem.getOakSageLifeBonus() : 0,
            lifeReplenish: typeof window.skillSystem.getOakSageLifeReplenish === 'function' ? window.skillSystem.getOakSageLifeReplenish() : 0
          };
        }

        // Spirit of Barbs - use max level from both weapon sets
        let sobLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('spiritofbarbscontainer') : 0;
        if (window.weaponSwapSystem) {
          sobLevel = window.weaponSwapSystem.getMaxBuffLevel('sob');
        }
        if (sobLevel > 0) {
          pkBuffs['spirit-of-barbs'] = {
            level: sobLevel,
            damageReturn: typeof window.skillSystem.getSpiritOfBarbsReturn === 'function' ? window.skillSystem.getSpiritOfBarbsReturn() : 0
          };
        }

        // Fire Enchant - use max level from both weapon sets
        let fireEnchantLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('enchantfirecontainer') : 0;
        if (window.weaponSwapSystem) {
          fireEnchantLevel = window.weaponSwapSystem.getMaxBuffLevel('fireEnchant');
        }
        if (fireEnchantLevel > 0) {
          const levelIndex = Math.min(fireEnchantLevel - 1, 59);
          const skill = window.skillSystem.skillData.enchantfirecontainer;
          const baseFireMin = skill.fireDamageMin[levelIndex] || 0;
          const baseFireMax = skill.fireDamageMax[levelIndex] || 0;
          const synergyBonus = typeof window.skillSystem.calculateSynergyBonus === 'function' ? window.skillSystem.calculateSynergyBonus('enchantfirecontainer', 'fire') : 0;

          // Get Fire Mastery bonus
          let fireMasteryBonus = 0;
          const fireMasteryLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('firemasterycontainer') : 0;
          if (fireMasteryLevel > 0 && window.skillSystem.skillData.firemasterycontainer && window.skillSystem.skillData.firemasterycontainer.fireDamage) {
            fireMasteryBonus = window.skillSystem.skillData.firemasterycontainer.fireDamage[Math.min(fireMasteryLevel - 1, 59)] || 0;
          }

          pkBuffs['fire-enchant'] = {
            level: fireEnchantLevel,
            fireMin: Math.floor(baseFireMin * (1 + (synergyBonus + fireMasteryBonus) / 100)),
            fireMax: Math.floor(baseFireMax * (1 + (synergyBonus + fireMasteryBonus) / 100)),
            attackRating: skill.attackRating[levelIndex] || 0
          };
        }

        // Cold Enchant - use max level from both weapon sets
        let coldEnchantLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('coldenchantcontainer') : 0;
        if (window.weaponSwapSystem) {
          coldEnchantLevel = window.weaponSwapSystem.getMaxBuffLevel('coldEnchant');
        }
        if (coldEnchantLevel > 0) {
          const levelIndex = Math.min(coldEnchantLevel - 1, 59);
          const skill = window.skillSystem.skillData.coldenchantcontainer;
          const baseColdMin = skill.coldDamageMin[levelIndex] || 0;
          const baseColdMax = skill.coldDamageMax[levelIndex] || 0;
          const synergyBonus = typeof window.skillSystem.calculateSynergyBonus === 'function' ? window.skillSystem.calculateSynergyBonus('coldenchantcontainer', 'cold') : 0;

          // Get Cold Mastery bonus
          let coldMasteryBonus = 0;
          const coldMasteryLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('coldmasterycontainer') : 0;
          if (coldMasteryLevel > 0 && window.skillSystem.skillData.coldmasterycontainer && window.skillSystem.skillData.coldmasterycontainer.coldDamage) {
            coldMasteryBonus = window.skillSystem.skillData.coldmasterycontainer.coldDamage[Math.min(coldMasteryLevel - 1, 59)] || 0;
          }

          pkBuffs['cold-enchant'] = {
            level: coldEnchantLevel,
            coldMin: Math.floor(baseColdMin * (1 + (synergyBonus + coldMasteryBonus) / 100)),
            coldMax: Math.floor(baseColdMax * (1 + (synergyBonus + coldMasteryBonus) / 100)),
            attackRating: skill.attackRating[levelIndex] || 0
          };
        }

        // Amplify Damage
        let ampLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('amplifydamagecontainer') : 0;
        if (window.weaponSwapSystem) {
          ampLevel = window.weaponSwapSystem.getMaxBuffLevel('amplifyDamage');
        }
        if (ampLevel > 0) {
          const levelIndex = Math.min(ampLevel - 1, 59);
          const skill = window.skillSystem.skillData.amplifydamagecontainer;
          pkBuffs['amplify-damage'] = {
            level: ampLevel,
            physicalDamage: Math.abs(skill?.enemyPhysicalResist?.[levelIndex] || 20),
            duration: skill?.duration?.[levelIndex] || 20
          };
        }

        // Lower Resist
        let lrLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('lowerresistcontainer') : 0;
        if (window.weaponSwapSystem) {
          lrLevel = window.weaponSwapSystem.getMaxBuffLevel('lowerResist');
        }
        if (lrLevel > 0) {
          const levelIndex = Math.min(lrLevel - 1, 59);
          const skill = window.skillSystem.skillData.lowerresistcontainer;
          pkBuffs['lower-resist'] = {
            level: lrLevel,
            resistReduction: Math.abs(skill?.enemyElementalResist?.[levelIndex] || 31),
            duration: skill?.duration?.[levelIndex] || 40
          };
        }

        // Curse Mastery
        let cmLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('cursemasterycontainer') : 0;
        if (window.weaponSwapSystem) {
          cmLevel = window.weaponSwapSystem.getMaxBuffLevel('curseMastery');
        }
        if (cmLevel > 0) {
          const levelIndex = Math.min(cmLevel - 1, 59);
          const skill = window.skillSystem.skillData.cursemasterycontainer;
          pkBuffs['curse-mastery'] = {
            level: cmLevel,
            maxCurses: skill?.maxCurses?.[levelIndex] || 1
          };
        }

        window.partyManager.updatePlayerBuffs(idx, pkBuffs);
      }

      // Add Fire Enchant damage from party (after buff reporting so we get updated values)
      const partyFireEnchant = window.partyManager?.getBestBuff('fire-enchant');
      if (partyFireEnchant) {
        this.stats.fireDmgMin = (this.stats.fireDmgMin || 0) + partyFireEnchant.fireMin;
        this.stats.fireDmgMax = (this.stats.fireDmgMax || 0) + partyFireEnchant.fireMax;
      }

      // Add Cold Enchant damage from party (after buff reporting so we get updated values)
      const partyColdEnchant = window.partyManager?.getBestBuff('cold-enchant');
      if (partyColdEnchant) {
        this.stats.coldDmgMin = (this.stats.coldDmgMin || 0) + partyColdEnchant.coldMin;
        this.stats.coldDmgMax = (this.stats.coldDmgMax || 0) + partyColdEnchant.coldMax;
      }

      // Re-calculate Final Basic Stats (Life, Mana, etc.) incorporating Skill Bonuses
      if (window.characterManager) {
        window.characterManager.updateTotalStats();
      }
    }
  }

  calculateEquipmentStats(dropdownId, section) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value) return;

    // Use window.getItemData to support both regular and crafted items
    // CRITICAL FIX: Check cache first for slot-specific modified items (e.g. corrupted)
    let item = window.dropdownItemCache && window.dropdownItemCache[`${dropdownId}_${dropdown.value}`];

    if (!item) {
      item = window.getItemData ? window.getItemData(dropdown.value) : itemList[dropdown.value];
    }
    if (!item) return;

    const actualLevel = this.calculateActualRequiredLevel(section, dropdown.value);
    const meetsStatRequirements = this.doesCharacterMeetStatRequirements(dropdown.value);

    // Parse item stats if level and stat requirements are met
    // Check for either properties OR description (description might have corruption stats)
    if (this.currentLevel >= actualLevel && meetsStatRequirements && (item.properties || item.description)) {
      this.parseItemStats(item, section);


    }
  }

  calculateSocketStats() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];



    sections.forEach(section => {
      const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);


      sockets.forEach((socket, index) => {
        const levelReq = parseInt(socket.dataset.levelReq) || 1;
        const itemName = socket.dataset.itemName;
        const stats = socket.dataset.stats;



        // Only apply socket stats if level requirement is met
        if (this.currentLevel >= levelReq && stats) {

          this.parseSocketStats(stats, section);
        }
      });
    });


    // Add checkbox bonus ONCE at the end (Anya quest - does NOT apply to curse resistance)
    this.stats.fireResist += window.checkboxResistBonus || 0;
    this.stats.coldResist += window.checkboxResistBonus || 0;
    this.stats.lightResist += window.checkboxResistBonus || 0;
    this.stats.poisonResist += window.checkboxResistBonus || 0;
    // Curse resistance is NOT affected by Anya checkbox bonus

    // Add set bonuses if setTracker is available
    if (window.setTracker) {
      const setBonuses = window.setTracker.getAllSetBonuses();

      // Apply set bonuses to stats
      if (setBonuses.defense) this.stats.defense += setBonuses.defense;
      if (setBonuses.defensePerLevel) {
        // Defense per level needs character level
        const charLevel = this.currentLevel || 1;
        this.stats.defense += setBonuses.defensePerLevel * charLevel;
      }
      if (setBonuses.strength) this.stats.strength += setBonuses.strength;
      if (setBonuses.dexterity) this.stats.dexterity += setBonuses.dexterity;
      if (setBonuses.vitality) this.stats.vitality += setBonuses.vitality;
      if (setBonuses.energy) this.stats.energy += setBonuses.energy;
      if (setBonuses.life) this.stats.life += setBonuses.life;
      if (setBonuses.mana) this.stats.mana += setBonuses.mana;
      if (setBonuses.lightningResist) this.stats.lightResist += setBonuses.lightningResist;
      if (setBonuses.fireResist) this.stats.fireResist += setBonuses.fireResist;
      if (setBonuses.coldResist) this.stats.coldResist += setBonuses.coldResist;
      if (setBonuses.poisonResist) this.stats.poisonResist += setBonuses.poisonResist;
      if (setBonuses.allResist) {
        this.stats.fireResist += setBonuses.allResist;
        this.stats.coldResist += setBonuses.allResist;
        this.stats.lightResist += setBonuses.allResist;
        this.stats.poisonResist += setBonuses.allResist;
      }
      if (setBonuses.fcr) this.stats.fcr += setBonuses.fcr;
      if (setBonuses.ias) this.stats.ias += setBonuses.ias;
      if (setBonuses.fhr) this.stats.fhr += setBonuses.fhr;
      if (setBonuses.frw) this.stats.frw += setBonuses.frw;
      if (setBonuses.allSkills) this.stats.allSkills += setBonuses.allSkills;
    }
  }

  // Calculate mercenary equipment stats separately from player stats
  calculateMercenaryStats() {
    // CRITICAL: Check if mercenary exists first - if "No Mercenary" selected, ignore all merc equipment
    const mercClass = document.getElementById('mercclass')?.value;
    if (!mercClass || mercClass === 'No Mercenary') {
      return; // Early exit - no mercenary means no mercenary stats
    }

    // Get mercenary level
    const mercLevel = parseInt(document.getElementById('merclvlValue')?.value) || 1;

    // Only process mercenary equipment
    Object.entries(this.equipmentMap).forEach(([dropdownId, config]) => {
      if (!config.section.startsWith('merc')) return; // Only mercenary items

      const dropdown = document.getElementById(dropdownId);
      if (!dropdown || !dropdown.value) return;

      // Use window.getItemData to support both regular and crafted items
      // CRITICAL FIX: Check cache first for slot-specific modified items
      let item = window.dropdownItemCache && window.dropdownItemCache[`${dropdownId}_${dropdown.value}`];

      if (!item) {
        item = window.getItemData ? window.getItemData(dropdown.value) : itemList[dropdown.value];
      }
      if (!item) return;

      // Check if mercenary meets level requirement for this item
      const actualLevel = this.calculateActualRequiredLevel(config.section, dropdown.value);

      // TODO: Add mercenary strength/dexterity requirements check here in the future
      // For now, only check level requirement

      // Only apply stats if mercenary level requirement is met
      if (mercLevel >= actualLevel && item.properties) {
        this.parseMercenaryItemStats(item, config.section);
      }
    });

    // Calculate mercenary socket stats (only from items that meet level req)
    const mercLevel2 = parseInt(document.getElementById('merclvlValue')?.value) || 1;
    const mercSections = ['mercweapon', 'merchelm', 'mercarmor', 'mercoff', 'mercgloves', 'mercbelts', 'mercboots'];
    mercSections.forEach(section => {
      // Check if the item in this section meets level requirement
      const dropdownId = Object.entries(this.equipmentMap).find(
        ([_, config]) => config.section === section
      )?.[0];

      if (dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown && dropdown.value) {
          const actualLevel = this.calculateActualRequiredLevel(section, dropdown.value);

          // Only add socket stats if item meets level requirement
          if (mercLevel2 >= actualLevel) {
            const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
            sockets.forEach((socket) => {
              const levelReq = parseInt(socket.dataset.levelReq) || 1;
              // Also check if mercenary meets the socket item's level requirement
              if (mercLevel2 >= levelReq) {
                const stats = socket.dataset.stats;
                if (stats) {
                  this.parseMercenarySocketStats(stats);
                }
              }
            });
          }
        }
      }
    });
  }

  parseMercenaryItemStats(item, section) {
    let description = item.description;

    // 1. For dynamic items without a static description (or has baseType), generate it FIRST
    // This provides the base stats (Defense, Damage, etc.) for the parser
    if (!description || item.baseType) {
      const dropdownId = Object.entries(this.equipmentMap).find(
        ([_, config]) => config.section === section
      )?.[0];

      if (dropdownId) {
        const itemName = document.getElementById(dropdownId)?.value;
        if (itemName) {
          description = window.generateItemDescription(itemName, item, dropdownId);
        }
      }
    }

    // 2. Safely append corruption text for parsing (ONLY for static items)
    // Dynamic items already have corruption built into their properties and base description
    const dropdownId = Object.entries(this.equipmentMap).find(
      ([_, config]) => config.section === section
    )?.[0];

    if (!item.baseType && dropdownId && window.itemCorruptions && window.itemCorruptions[dropdownId]) {
      const corruption = window.itemCorruptions[dropdownId];
      if (corruption.text && corruption.itemName) {
        const currentName = document.getElementById(dropdownId)?.value;
        if (currentName === corruption.itemName) {
          // Only append if the corruption text isn't already in the description
          const cleanCorruption = corruption.text.replace(/<[^>]*>/g, '').trim();
          const cleanDescription = (description || '').replace(/<[^>]*>/g, '').trim();

          if (!cleanDescription.includes(cleanCorruption)) {
            description = (description ? description + '<br>' : '') + corruption.text;
          }
        }
      }
    }

    if (!description) return;

    const lines = description.split('<br>');
    lines.forEach(line => this.parseMercenaryStatLine(line.trim()));
  }

  parseMercenarySocketStats(statsText) {
    if (!statsText) return;
    const statLines = statsText.split(',').map(line => line.trim()).filter(line => line);
    statLines.forEach(line => {
      this.parseMercenaryStatLine(line);
    });
  }

  parseMercenaryStatLine(line) {
    if (!line) return;

    const cleanLine = line.replace(/<[^>]*>/g, '').trim();
    if (!cleanLine) return;

    // Skip set bonus lines
    if (/\(\d+\s+Items?\)|\(Complete Set\)/i.test(cleanLine)) {
      return;
    }

    try {
      // All Skills
      const allSkillsMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?All\s+Skills/i);
      if (allSkillsMatch) {
        this.mercenaryStats.allSkills += parseInt(allSkillsMatch[1]);
        return;
      }

      // Defense
      const defMatch = cleanLine.match(/^Defense:\s*(\d+)/i);
      if (defMatch) {
        this.mercenaryStats.defense += parseInt(defMatch[1]);
        return;
      }

      // Magic Find
      const mfMatch = cleanLine.match(/(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i);
      if (mfMatch) {
        this.mercenaryStats.magicFind += parseInt(mfMatch[1]);
        return;
      }

      // Gold Find
      const gfMatch = cleanLine.match(/([+-]?\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i);
      if (gfMatch) {
        this.mercenaryStats.goldFind += parseInt(gfMatch[1]);
        return;
      }

      // Speed stats
      const iasMatch = cleanLine.match(/(\d+)%\s+Increased\s+Attack\s+Speed/i);
      if (iasMatch) {
        this.mercenaryStats.ias += parseInt(iasMatch[1]);
        return;
      }

      const fcrMatch = cleanLine.match(/(\d+)%\s+Faster\s+Cast\s+Rate/i);
      if (fcrMatch) {
        this.mercenaryStats.fcr += parseInt(fcrMatch[1]);
        return;
      }

      const frwMatch = cleanLine.match(/(\d+)%\s+Faster\s+Run\/Walk/i);
      if (frwMatch) {
        this.mercenaryStats.frw += parseInt(frwMatch[1]);
        return;
      }

      const fhrMatch = cleanLine.match(/(\d+)%\s+Faster\s+Hit\s+Recovery/i);
      if (fhrMatch) {
        this.mercenaryStats.fhr += parseInt(fhrMatch[1]);
        return;
      }

      // Resistances
      const allResMatch = cleanLine.match(/All\s+Resistances?\s+(?:\+)?(\d+)%?/i);
      if (allResMatch) {
        const value = parseInt(allResMatch[1]);
        this.mercenaryStats.fireResist += value;
        this.mercenaryStats.coldResist += value;
        this.mercenaryStats.lightResist += value;
        this.mercenaryStats.poisonResist += value;
        return;
      }

      const fireResMatch = cleanLine.match(/Fire\s+Resist\s+(?:\+)?(\d+)%?/i);
      if (fireResMatch) {
        this.mercenaryStats.fireResist += parseInt(fireResMatch[1]);
        return;
      }

      const coldResMatch = cleanLine.match(/Cold\s+Resist\s+(?:\+)?(\d+)%?/i);
      if (coldResMatch) {
        this.mercenaryStats.coldResist += parseInt(coldResMatch[1]);
        return;
      }

      const lightResMatch = cleanLine.match(/Lightning\s+Resist\s+(?:\+)?(\d+)%?/i);
      if (lightResMatch) {
        this.mercenaryStats.lightResist += parseInt(lightResMatch[1]);
        return;
      }

      const poisonResMatch = cleanLine.match(/Poison\s+Resist\s+(?:\+)?(\d+)%?/i);
      if (poisonResMatch) {
        this.mercenaryStats.poisonResist += parseInt(poisonResMatch[1]);
        return;
      }

      const curseResMatch = cleanLine.match(/Curse\s+Resist\s+(?:\+)?(\d+)%?/i);
      if (curseResMatch) {
        this.mercenaryStats.curseResist += parseInt(curseResMatch[1]);
        return;
      }

      // Damage Reduction stats
      // Physical Damage Taken Reduced by X (flat -> PDR)
      const pdrMatch = cleanLine.match(/Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)(?!%)/i);
      if (pdrMatch) {
        this.mercenaryStats.pdr += parseInt(pdrMatch[1]);
        return;
      }

      // Physical Damage Reduced by X% (percentage -> DR)
      const drMatch = cleanLine.match(/(?:Physical\s+)?Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)%/i);
      if (drMatch) {
        this.mercenaryStats.dr += parseInt(drMatch[1]);
        return;
      }

      // Magic Damage Reduced by X (flat -> MDR)
      const mdrMatch = cleanLine.match(/Magic\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)(?!%)/i);
      if (mdrMatch) {
        this.mercenaryStats.mdr += parseInt(mdrMatch[1]);
        return;
      }

      const plrMatch = cleanLine.match(/Poison\s+Length\s+Reduced\s+by\s+(\d+)%?/i);
      if (plrMatch) {
        this.mercenaryStats.plr += parseInt(plrMatch[1]);
        return;
      }

      // Cannot be Frozen
      if (/Cannot\s+be\s+Frozen/i.test(cleanLine)) {
        this.mercenaryStats.cbf = true;
        return;
      }
    } catch (error) {
      // Silently skip unparseable lines
    }
  }

  parseItemStats(item, section) {
    let description = item.description;

    // 1. For dynamic items without a static description (or has baseType), generate it FIRST
    // This provides the base stats (Defense, Damage, etc.) for the parser
    if (!description || item.baseType) {
      const dropdownId = Object.entries(this.equipmentMap).find(
        ([_, config]) => config.section === section
      )?.[0];

      if (dropdownId) {
        const itemName = document.getElementById(dropdownId)?.value;
        if (itemName) {
          description = window.generateItemDescription(itemName, item, dropdownId);
        }
      }
    }

    // 2. Safely append corruption text for parsing (ONLY for static items)
    // Dynamic items already have corruption built into their properties and base description
    const dropdownId = Object.entries(this.equipmentMap).find(
      ([_, config]) => config.section === section
    )?.[0];

    if (!item.baseType && dropdownId && window.itemCorruptions && window.itemCorruptions[dropdownId]) {
      const corruption = window.itemCorruptions[dropdownId];
      if (corruption.text && corruption.itemName) {
        const currentName = document.getElementById(dropdownId)?.value;
        if (currentName === corruption.itemName) {
          // CRITICAL FIX: Smart duplicate detection for identical base + corruption values
          // Instead of checking if corruption text exists, check if the STACKED value exists
          // This fixes the bug where "+1 All Skills" base + "+1 All Skills" corruption
          // would not be appended because the text already exists, even though it should show "+2"

          const cleanCorruption = corruption.text.replace(/<[^>]*>/g, '').trim();
          const cleanDescription = (description || '').replace(/<[^>]*>/g, '').trim();

          // Extract the numeric value from corruption text (e.g., "+1" from "+1 to All Skills")
          const corruptionValueMatch = cleanCorruption.match(/[+\-]?\d+/);
          const corruptionValue = corruptionValueMatch ? parseInt(corruptionValueMatch[0]) : null;

          // Extract the stat type (e.g., "to All Skills", "% Faster Cast Rate")
          const statTypeMatch = cleanCorruption.match(/(?:[+\-]?\d+\s*)(.+)/);
          const statType = statTypeMatch ? statTypeMatch[1].trim() : null;

          let shouldAppend = true;

          if (corruptionValue !== null && statType) {
            // Look for this stat type in the description and check if it has the stacked value
            // Create a regex that matches the stat type with any numeric value
            const statPattern = new RegExp(`([+\\-]?\\d+)\\s*${statType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
            const descMatch = cleanDescription.match(statPattern);

            if (descMatch) {
              const descValue = parseInt(descMatch[1]);
              // If the description already has a value GREATER than the corruption value,
              // it means the corruption was already merged/stacked
              // Only skip appending if the value is exactly the stacked amount or higher
              if (descValue > corruptionValue) {
                shouldAppend = false;
              }
            }
          } else {
            // Fallback to simple text matching for non-numeric corruptions
            if (cleanDescription.includes(cleanCorruption)) {
              shouldAppend = false;
            }
          }

          if (shouldAppend) {
            description = (description ? description + '<br>' : '') + corruption.text;
          }
        }
      }
    }

    if (!description) return;

    // Check if this item has a base Defense line (e.g., "Defense: 834")
    // If it does, we should NOT parse "+X Defense" lines because todef is already included in the total
    const hasBaseDefense = /Defense:\s*\d+/i.test(description);

    const lines = description.split('<br>');
    lines.forEach(line => this.parseStatLine(line.trim(), hasBaseDefense));
  }

  // parseSocketStats(statsText, section) {
  //   if (!statsText) return;

  //   const lines = statsText.split(',');
  //   lines.forEach(line => this.parseStatLine(line.trim()));
  // }

  parseSocketStats(statsText, section) {
    if (!statsText) return;


    // Split by comma and process each stat separately
    const statLines = statsText.split(',').map(line => line.trim()).filter(line => line);


    statLines.forEach((line, index) => {
      try {

        this.parseStatLine(line);

      } catch (error) {
        // Silent error - skip invalid stat lines
      }
    });

  }


  parseStatLine(line, hasBaseDefense = false) {
    if (!line) return;

    const cleanLine = line.replace(/<[^>]*>/g, '').trim();
    if (!cleanLine) return;

    // IMPORTANT: Skip set bonus lines - these are handled by setTracker.js
    // Set bonuses have patterns like "(2 Items)", "(3 Items)", "(Complete Set)"
    if (/\(\d+\s+Items?\)|\(Complete Set\)/i.test(cleanLine)) {
      return; // Skip this line entirely
    }

    try {
      // === RAINBOW FACET PATTERNS FIRST (most specific) ===

      // Skill damage bonuses: +5% to Fire Skill Damage
      if (cleanLine.match(/\+\d+%\s+to\s+Fire\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.fireSkillDamage = (this.stats.fireSkillDamage || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/\+\d+%\s+to\s+Cold\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.coldSkillDamage = (this.stats.coldSkillDamage || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/\+\d+%\s+to\s+Lightning\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.lightningSkillDamage = (this.stats.lightningSkillDamage || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/\+\d+%\s+to\s+Poison\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.poisonSkillDamage = (this.stats.poisonSkillDamage || 0) + value;
          return;
        }
      }

      // Enemy resistance pierce: -3% to Enemy Fire Resistance
      if (cleanLine.match(/-\d+%\s+to\s+Enemy\s+Fire\s+Resistance/i)) {
        const match = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Fire\s+Resistance/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.pierceFire = (this.stats.pierceFire || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/-\d+%\s+to\s+Enemy\s+Cold\s+Resistance/i)) {
        const match = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Cold\s+Resistance/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.pierceCold = (this.stats.pierceCold || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/-\d+%\s+to\s+Enemy\s+Lightning\s+Resistance/i)) {
        const match = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Lightning\s+Resistance/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.pierceLightning = (this.stats.pierceLightning || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/-\d+%\s+to\s+Enemy\s+Poison\s+Resistance/i)) {
        const match = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Poison\s+Resistance/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.piercePoison = (this.stats.piercePoison || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/-\d+%\s+to\s+Enemy\s+Physical\s+Resistance/i)) {
        const match = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Physical\s+Resistance/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.piercePhysical = (this.stats.piercePhysical || 0) + value;
          return;
        }
      }

      if (cleanLine.match(/-\d+%\s+to\s+Enemy\s+Magic\s+Resistance/i)) {
        const match = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Magic\s+Resistance/i);
        if (match) {
          const value = parseInt(match[1]);
          this.stats.pierceMagic = (this.stats.pierceMagic || 0) + value;
          return;
        }
      }

      // === ELEMENTAL DAMAGE PATTERNS (after Rainbow Facet patterns) ===

      // Fire Damage: Adds 17-45 Fire Damage
      const fireDmgMatch = cleanLine.match(/(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Fire\s+Damage/i);
      if (fireDmgMatch) {
        const min = parseInt(fireDmgMatch[1]);
        const max = parseInt(fireDmgMatch[2] || fireDmgMatch[1]);
        this.stats.fireDmgMin += min;
        this.stats.fireDmgMax += max;
        return;
      }

      // Lightning Damage: Adds 1-50 Lightning Damage
      const lightDmgMatch = cleanLine.match(/(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Lightning\s+Damage/i);
      if (lightDmgMatch) {
        const min = parseInt(lightDmgMatch[1]);
        const max = parseInt(lightDmgMatch[2] || lightDmgMatch[1]);
        this.stats.lightDmgMin += min;
        this.stats.lightDmgMax += max;
        return;
      }

      // Cold Damage: Adds 25-35 Cold Damage
      const coldDmgMatch = cleanLine.match(/(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Cold\s+Damage/i);
      if (coldDmgMatch) {
        const min = parseInt(coldDmgMatch[1]);
        const max = parseInt(coldDmgMatch[2] || coldDmgMatch[1]);
        this.stats.coldDmgMin += min;
        this.stats.coldDmgMax += max;
        return;
      }

      // Poison Damage: Adds 15-25 Poison Damage
      const poisonDmgMatch = cleanLine.match(/(?:Adds\s+|\+)?(\d+)(?:-(\d+))?\s+Poison\s+Damage/i);
      if (poisonDmgMatch) {
        const min = parseInt(poisonDmgMatch[1]);
        const max = parseInt(poisonDmgMatch[2] || poisonDmgMatch[1]);
        this.stats.poisonDmgMin += min;
        this.stats.poisonDmgMax += max;
        return;
      }

      // Proc effects (store for display, don't calculate)
      const levelUpProcMatch = cleanLine.match(/(\d+)%\s+Chance\s+to\s+Cast\s+Level\s+(\d+)\s+(.+?)\s+when\s+you\s+Level[- ]Up/i);
      if (levelUpProcMatch) {
        this.stats.levelUpProcs = this.stats.levelUpProcs || [];
        this.stats.levelUpProcs.push({
          chance: parseInt(levelUpProcMatch[1]),
          level: parseInt(levelUpProcMatch[2]),
          skill: levelUpProcMatch[3]
        });
        return;
      }

      const deathProcMatch = cleanLine.match(/(\d+)%\s+Chance\s+to\s+Cast\s+Level\s+(\d+)\s+(.+?)\s+when\s+you\s+Die/i);
      if (deathProcMatch) {
        this.stats.deathProcs = this.stats.deathProcs || [];
        this.stats.deathProcs.push({
          chance: parseInt(deathProcMatch[1]),
          level: parseInt(deathProcMatch[2]),
          skill: deathProcMatch[3]
        });
        return;
      }

      const defMatch = cleanLine.match(/^Defense:\s*(\d+)/i);
      if (defMatch) {
        this.stats.defense += parseInt(defMatch[1]);
        return;
      }

      // Additional defense bonus: +X Defense (but not "Defense: X" which is handled above)
      // This handles items like amulets/rings that don't have base defense but get +Defense from todef
      // ONLY parse this if the item doesn't have a "Defense: X" line (hasBaseDefense = false)
      // For items with base defense (like helms/armor), the +X Defense is already included in the total
      // Pattern allows for HTML tags and input elements after "Defense" (from dynamic stats)
      // Negative lookahead (?!\s+vs) excludes "Defense vs. Missile" and "Defense vs. Melee"
      if (!hasBaseDefense) {
        const toDefMatch = cleanLine.match(/^\+(\d+)\s+Defense(?!\s+vs)/i);
        if (toDefMatch) {
          this.stats.defense += parseInt(toDefMatch[1]);
          return;
        }
      }

      // All Attributes: +2 to All Attributes
      // This should be parsed BEFORE individual attributes to avoid conflicts
      const allAttrsMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?All\s+Attributes/i);
      if (allAttrsMatch) {
        const value = parseInt(allAttrsMatch[1]);
        this.stats.strength += value;
        this.stats.dexterity += value;
        this.stats.vitality += value;
        this.stats.energy += value;
        return;
      }

      const strMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?(?:Strength|STR)/i);
      if (strMatch) { this.stats.strength += parseInt(strMatch[1]); return; }

      const dexMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?(?:Dexterity|DEX)/i);
      if (dexMatch) { this.stats.dexterity += parseInt(dexMatch[1]); return; }

      const vitMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?(?:Vitality|VIT)/i);
      if (vitMatch) { this.stats.vitality += parseInt(vitMatch[1]); return; }

      const enrMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?(?:Energy|ENR)/i);
      if (enrMatch) { this.stats.energy += parseInt(enrMatch[1]); return; }

      // Life and Mana
      const lifeMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?Life/i);
      if (lifeMatch) { this.stats.life += parseInt(lifeMatch[1]); return; }

      const manaMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?Mana/i);
      if (manaMatch) { this.stats.mana += parseInt(manaMatch[1]); return; }

      // Light Radius
      const lightRadiusMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Light\s+Radius/i);
      if (lightRadiusMatch) { this.stats.lightRadius += parseInt(lightRadiusMatch[1]); return; }

      // Per Level Stats (Attack Rating, Max Damage, Defense)
      const perLvlMatch = cleanLine.match(/\(\+([0-9.]+)\s+per\s+Character\s+Level\)/i);
      if (perLvlMatch) {
        const perLvl = parseFloat(perLvlMatch[1]);
        const value = Math.floor(perLvl * this.currentLevel);
        if (cleanLine.includes('Attack Rating')) {
          this.stats.toatt += value;
        } else if (cleanLine.includes('Maximum Damage')) {
          this.stats.toMaxDmg += value;
        } else if (cleanLine.includes('Defense')) {
          this.stats.defense += value;
        }
        return;
      }

      // All Skills
      const allSkillsMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?All\s+Skills/i);
      if (allSkillsMatch) { this.stats.allSkills += parseInt(allSkillsMatch[1]); return; }

      // Resistances
      const allResMatch = cleanLine.match(/All\s+Resistances?\s+([+-]?\d+)%?/i);
      if (allResMatch) {
        const value = parseInt(allResMatch[1]);
        this.stats.allResistances += value;
        this.stats.fireResist += value;
        this.stats.coldResist += value;
        this.stats.lightResist += value;
        this.stats.poisonResist += value;
        // Curse resistance is NOT included in "All Resistances"
        return;
      }

      const fireResMatch = cleanLine.match(/Fire\s+Resist\s+([+-]?\d+)%?/i);
      if (fireResMatch) { this.stats.fireResist += parseInt(fireResMatch[1]); return; }

      const coldResMatch = cleanLine.match(/Cold\s+Resist\s+([+-]?\d+)%?/i);
      if (coldResMatch) { this.stats.coldResist += parseInt(coldResMatch[1]); return; }

      const lightResMatch = cleanLine.match(/Lightning\s+Resist\s+([+-]?\d+)%?/i);
      if (lightResMatch) { this.stats.lightResist += parseInt(lightResMatch[1]); return; }

      const poisonResMatch = cleanLine.match(/Poison\s+Resist\s+([+-]?\d+)%?/i);
      if (poisonResMatch) { this.stats.poisonResist += parseInt(poisonResMatch[1]); return; }

      const curseResMatch = cleanLine.match(/Curse\s+Resist(?:ance)?\s+([+-]?\d+)%?/i);
      if (curseResMatch) { this.stats.curseResist += parseInt(curseResMatch[1]); return; }

      // Life Steal
      const lifeStealMatch = cleanLine.match(/(\d+)%\s+Life\s+Stolen\s+per\s+Hit/i);
      if (lifeStealMatch) { this.stats.lifeSteal += parseInt(lifeStealMatch[1]); return; }

      // Mana Steal
      const manaStealMatch = cleanLine.match(/(\d+)%\s+Mana\s+Stolen\s+per\s+Hit/i);
      if (manaStealMatch) { this.stats.manaSteal += parseInt(manaStealMatch[1]); return; }

      // Magic Find
      const mfMatch = cleanLine.match(/(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i);
      if (mfMatch) { this.stats.magicFind += parseInt(mfMatch[1]); return; }

      // Gold Find
      // const gfMatch = cleanLine.match(/(\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i);
      const gfMatch = cleanLine.match(/([+-]?\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i);
      if (gfMatch) { this.stats.goldFind += parseInt(gfMatch[1]); return; }

      // Combat stats
      const cbMatch = cleanLine.match(/(\d+)%\s+Chance\s+of\s+Crushing\s+Blow/i);
      if (cbMatch) { this.stats.crushingBlow += parseInt(cbMatch[1]); return; }

      const dsMatch = cleanLine.match(/(\d+)%\s+Deadly\s+Strike/i);
      if (dsMatch) { this.stats.deadlyStrike += parseInt(dsMatch[1]); return; }

      const owMatch = cleanLine.match(/(\d+)%\s+Chance\s+of\s+Open\s+Wounds/i);
      if (owMatch) { this.stats.openWounds += parseInt(owMatch[1]); return; }

      const owdmgMatch = cleanLine.match(/(\d+)\s+Open\s+Wounds\s+Damage\s+per\s+Second/i);
      if (owdmgMatch) { this.stats.openWoundsDamage += parseInt(owdmgMatch[1]); return; }

      // Speed stats
      const iasMatch = cleanLine.match(/(\d+)%\s+Increased\s+Attack\s+Speed/i);
      if (iasMatch) { this.stats.ias += parseInt(iasMatch[1]); return; }

      const fcrMatch = cleanLine.match(/(\d+)%\s+Faster\s+Cast\s+Rate/i);
      if (fcrMatch) { this.stats.fcr += parseInt(fcrMatch[1]); return; }

      const frwMatch = cleanLine.match(/(\d+)%\s+Faster\s+Run\/Walk/i);
      if (frwMatch) { this.stats.frw += parseInt(frwMatch[1]); return; }

      const fhrMatch = cleanLine.match(/(\d+)%\s+Faster\s+Hit\s+Recovery/i);
      if (fhrMatch) { this.stats.fhr += parseInt(fhrMatch[1]); return; }

      // Cannot Be Frozen
      if (cleanLine.match(/Cannot\s+Be\s+Frozen/i)) { this.stats.cbf = true; return; }

      // Attack Rating (multiple formats for rune compatibility)
      // Percentage: "20% Bonus to Attack Rating"
      const toattPercentMatch = cleanLine.match(/(\d+)%\s+(?:Bonus\s+)?to\s+Attack\s+Rating/i);
      if (toattPercentMatch) { this.stats.toattPercent += parseInt(toattPercentMatch[1]); return; }

      // Flat: "+50 to Attack Rating" or "+50 Attack Rating"
      const toattFlatMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Attack\s+Rating/i);
      if (toattFlatMatch) { this.stats.toatt += parseInt(toattFlatMatch[1]); return; }

      // Target Defense modification (Eth rune: "-25% Target Defense")
      // Note: This is parsed but not currently used in calculations
      const targetDefMatch = cleanLine.match(/([+-]?\d+)%\s+Target\s+Defense/i);
      if (targetDefMatch) { return; } // Recognized but not tracked (special effect)

      // Flat Physical Damage bonuses (jewels, runes, gems, items)
      // Minimum Damage: "+X to Minimum Damage"
      const toMinDmgMatch = cleanLine.match(/(?:\+)?(\d+)\s+to\s+Minimum\s+Damage/i);
      if (toMinDmgMatch) { this.stats.toMinDmg += parseInt(toMinDmgMatch[1]); return; }

      // Maximum Damage: "+X to Maximum Damage"
      const toMaxDmgMatch = cleanLine.match(/(?:\+)?(\d+)\s+to\s+Maximum\s+Damage/i);
      if (toMaxDmgMatch) { this.stats.toMaxDmg += parseInt(toMaxDmgMatch[1]); return; }

      // Damage Reduction stats
      // Physical Damage Reduced by X% OR Physical Damage Taken Reduced by X% (percentage -> DR)
      // Check percentage first (more specific) before flat patterns
      const drPercentMatch = cleanLine.match(/Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)\s*%/i);
      if (drPercentMatch) {
        this.stats.dr += parseInt(drPercentMatch[1]);
        return;
      }

      // Physical Damage Taken Reduced by X (flat -> PDR)
      // FIXED: Added \b word boundary
      const pdrFlatMatch = cleanLine.match(/Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)\b(?!\s*%)/i);
      if (pdrFlatMatch) {
        this.stats.pdr += parseInt(pdrFlatMatch[1]);
        return;
      }

      // Magic Damage Reduced by X (flat -> MDR)
      const mdrMatch = cleanLine.match(/Magic\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)/i);
      if (mdrMatch) {
        this.stats.mdr += parseInt(mdrMatch[1]);
        return;
      }

      // If we get here, the stat wasn't recognized

    } catch (error) {
      throw error; // Re-throw to be caught by parseSocketStats
    }

  }

  // Add these methods to your existing socket.js class

  // Enhanced stat parsing with stacking support
  parseStatsToMap(statsText) {
    const statsMap = new Map();
    let lines;
    if (statsText.includes('<br>')) {
      lines = statsText.split('<br>').filter(line => line.trim());
    } else if (statsText.includes(',')) {
      lines = statsText.split(',').filter(line => line.trim());
    } else {
      lines = [statsText].filter(line => line.trim());
    }

    lines.forEach(line => {
      const cleanLine = line.replace(/<[^>]*>/g, '').trim();
      if (!cleanLine) return;


      // Rainbow Facet skill damage patterns
      const fireSkillDmgMatch = cleanLine.match(/\+(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i);
      if (fireSkillDmgMatch) {
        const value = parseInt(fireSkillDmgMatch[1]);
        this.addToStatsMap(statsMap, 'fire_skill_damage', { value });
        return;
      }

      const coldSkillDmgMatch = cleanLine.match(/\+(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i);
      if (coldSkillDmgMatch) {
        const value = parseInt(coldSkillDmgMatch[1]);
        this.addToStatsMap(statsMap, 'cold_skill_damage', { value });
        return;
      }

      const lightningSkillDmgMatch = cleanLine.match(/\+(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i);
      if (lightningSkillDmgMatch) {
        const value = parseInt(lightningSkillDmgMatch[1]);
        this.addToStatsMap(statsMap, 'lightning_skill_damage', { value });
        return;
      }

      const poisonSkillDmgMatch = cleanLine.match(/\+(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i);
      if (poisonSkillDmgMatch) {
        const value = parseInt(poisonSkillDmgMatch[1]);
        this.addToStatsMap(statsMap, 'poison_skill_damage', { value });
        return;
      }

      // Rainbow Facet resistance pierce patterns
      const fireResistPierceMatch = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Fire\s+Resistance/i);
      if (fireResistPierceMatch) {
        const value = parseInt(fireResistPierceMatch[1]);
        this.addToStatsMap(statsMap, 'fire_resist_pierce', { value });
        return;
      }

      const coldResistPierceMatch = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Cold\s+Resistance/i);
      if (coldResistPierceMatch) {
        const value = parseInt(coldResistPierceMatch[1]);
        this.addToStatsMap(statsMap, 'cold_resist_pierce', { value });
        return;
      }

      const lightningResistPierceMatch = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Lightning\s+Resistance/i);
      if (lightningResistPierceMatch) {
        const value = parseInt(lightningResistPierceMatch[1]);
        this.addToStatsMap(statsMap, 'lightning_resist_pierce', { value });
        return;
      }

      const poisonResistPierceMatch = cleanLine.match(/-(\d+)%\s+to\s+Enemy\s+Poison\s+Resistance/i);
      if (poisonResistPierceMatch) {
        const value = parseInt(poisonResistPierceMatch[1]);
        this.addToStatsMap(statsMap, 'poison_resist_pierce', { value });
        return;
      }

      // Proc effects - store as special non-stackable stats

      const levelUpProcMatch = cleanLine.match(/(\d+)%\s+Chance\s+to\s+Cast\s+Level\s+(\d+)\s+(.+)\s+when\s+you\s+Level\s+Up/i);
      if (levelUpProcMatch) {
        const [, chance, level, skill] = levelUpProcMatch;
        // Use skill name as key so identical procs stack
        const skillKey = `level_up_proc_${skill.trim().replace(/\s+/g, '_').toLowerCase()}`;
        this.addToStatsMap(statsMap, skillKey, {
          chance: parseInt(chance),
          level: parseInt(level),
          skill: skill.trim(),
          stackable: true,  // Now they can stack
          fromSocket: true
        });
        return;
      }

      const deathProcMatch = cleanLine.match(/(\d+)%\s+Chance\s+to\s+Cast\s+Level\s+(\d+)\s+(.+)\s+when\s+you\s+Die/i);
      if (deathProcMatch) {
        const [, chance, level, skill] = deathProcMatch;
        // Use skill name as key so identical procs stack
        const skillKey = `death_proc_${skill.trim().replace(/\s+/g, '_').toLowerCase()}`;
        this.addToStatsMap(statsMap, skillKey, {
          chance: parseInt(chance),
          level: parseInt(level),
          skill: skill.trim(),
          stackable: true,  // Now they can stack
          fromSocket: true
        });
        return;
      }
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
      const poisonMatch = cleanLine.match(/(?:Adds\s+)?(\d+)-(\d+)\s+Poison\s+Damage/i);
      if (poisonMatch) {
        const min = parseInt(poisonMatch[1]);
        const max = parseInt(poisonMatch[2]);
        this.addToStatsMap(statsMap, 'poison_damage', { min, max, type: 'poison' });
        return;
      }

      // Resistances: Fire Resist +30%, Lightning Resist +30%, Curse Resistance +10%
      const resMatch = cleanLine.match(/(Fire|Cold|Lightning|Poison|Curse)\s+Resist(?:ance)?\s+([+-]?\d+)%?/i);
      if (resMatch) {
        const type = resMatch[1].toLowerCase();
        const value = parseInt(resMatch[2]);
        this.addToStatsMap(statsMap, `${type}_resist`, { value });
        return;
      }

      // All Resistances +15%
      const allResMatch = cleanLine.match(/All\s+Resistances\s+([+-]?\d+)%?/i);
      if (allResMatch) {
        const value = parseInt(allResMatch[1]);
        ['fire', 'cold', 'lightning', 'poison'].forEach(type => {
          this.addToStatsMap(statsMap, `${type}_resist`, { value });
        });
        return;
      }

      // Maximum Resistances: "+4% to Maximum Fire Resist", etc. (Vex, Ohm, Lo, Gul runes)
      const maxResMatch = cleanLine.match(/\+?(\d+)%\s+to\s+Maximum\s+(Fire|Cold|Lightning|Poison)\s+Resist/i);
      if (maxResMatch) {
        const value = parseInt(maxResMatch[1]);
        const type = maxResMatch[2].toLowerCase();
        this.addToStatsMap(statsMap, `max_${type}_resist`, { value });
        return;
      }

      // All Maximum Resistances: "+2% to All Maximum Resistances"
      const allMaxResMatch = cleanLine.match(/\+?(\d+)%\s+to\s+All\s+Maximum\s+Resistances/i);
      if (allMaxResMatch) {
        const value = parseInt(allMaxResMatch[1]);
        ['fire', 'cold', 'lightning', 'poison'].forEach(type => {
          this.addToStatsMap(statsMap, `max_${type}_resist`, { value });
        });
        return;
      }

      // Attributes: +10 to Strength, +15 Dexterity, 20 to Vitality
      const attrMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?(Strength|Dexterity|Vitality|Energy)/i);
      if (attrMatch) {
        const value = parseInt(attrMatch[1]);
        const attr = attrMatch[2].toLowerCase();
        this.addToStatsMap(statsMap, attr, { value });
        return;
      }

      // Attack Rating: +50 to Attack Rating, +120 Attack Rating
      const arMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?Attack\s+Rating/i);
      if (arMatch) {
        const value = parseInt(arMatch[1]);
        this.addToStatsMap(statsMap, 'attack_rating', { value });
        return;
      }

      // Attack Rating Percentage: "20% Bonus to Attack Rating" (Gul rune)
      const arPercentMatch = cleanLine.match(/(\d+)%\s+(?:Bonus\s+)?to\s+Attack\s+Rating/i);
      if (arPercentMatch) {
        const value = parseInt(arPercentMatch[1]);
        this.addToStatsMap(statsMap, 'attack_rating_percent', { value });
        return;
      }

      // Light Radius: +1 Light Radius, +3 to Light Radius
      const lightRadiusMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Light\s+Radius/i);
      if (lightRadiusMatch) {
        const value = parseInt(lightRadiusMatch[1]);
        this.addToStatsMap(statsMap, 'lightRadius', { value });
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
      const manaMatch = cleanLine.match(/(?:\+)?(\d+)\s+to\s+Mana(?!\s*[a-zA-Z])/i);
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

      const owdmgMatch = cleanLine.match(/(\d+)\s+Open\s+Wounds\s+Damage\s+per\s+Second/i);
      if (owdmgMatch) {
        const value = parseInt(owdmgMatch[1]);
        this.addToStatsMap(statsMap, 'open_wounds_damage', { value });
        return;
      }

      // Minimum Damage: +X to Minimum Damage (Sol rune, jewels)
      const minDmgMatch = cleanLine.match(/\+(\d+)\s+to\s+Minimum\s+Damage/i);
      if (minDmgMatch) {
        const value = parseInt(minDmgMatch[1]);
        this.addToStatsMap(statsMap, 'minimum_damage', { value });
        return;
      }

      // Maximum Damage: +X to Maximum Damage (jewels)
      const maxDmgMatch = cleanLine.match(/\+(\d+)\s+to\s+Maximum\s+Damage/i);
      if (maxDmgMatch) {
        const value = parseInt(maxDmgMatch[1]);
        this.addToStatsMap(statsMap, 'maximum_damage', { value });
        return;
      }

      // Mana after each Kill: +X to Mana after each Kill (Tir rune)
      const manaKillMatch = cleanLine.match(/\+(\d+)\s+to\s+Mana\s+after\s+each\s+Kill/i);
      if (manaKillMatch) {
        const value = parseInt(manaKillMatch[1]);
        this.addToStatsMap(statsMap, 'mana_after_kill', { value });
        return;
      }

      // Replenish Life: Replenish Life +X (Dol rune)
      const replenishLifeMatch = cleanLine.match(/Replenish\s+Life\s+\+(\d+)/i);
      if (replenishLifeMatch) {
        const value = parseInt(replenishLifeMatch[1]);
        this.addToStatsMap(statsMap, 'replenish_life', { value });
        return;
      }

      // Damage vs Undead: +X% Damage vs Undead (Eld rune) OR +X% Damage to Undead (Items)
      // Expanded regex to catch both "vs" and "to"
      const dmgUndeadMatch = cleanLine.match(/\+(\d+)%\s+Damage\s+(?:vs|to)\s+Undead/i);
      if (dmgUndeadMatch) {
        const value = parseInt(dmgUndeadMatch[1]);
        this.addToStatsMap(statsMap, 'damage_vs_undead', { value });
        return;
      }

      // Attack Rating vs Undead: +X Attack Rating vs Undead (Eld rune)
      const arUndeadMatch = cleanLine.match(/\+(\d+)\s+Attack\s+Rating\s+(?:vs|to)\s+Undead/i);
      if (arUndeadMatch) {
        const value = parseInt(arUndeadMatch[1]);
        this.addToStatsMap(statsMap, 'ar_vs_undead', { value });
        return;
      }

      // Physical Damage Reduced by X% (percentage - String of Ears)
      const drPercentMapMatch = cleanLine.match(/Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)\s*%/i);
      if (drPercentMapMatch) {
        const value = parseInt(drPercentMapMatch[1]);
        this.addToStatsMap(statsMap, 'physical_damage_reduced_percent', { value });
        return;
      }

      // Physical Damage Taken Reduced by X (flat - Sol rune in helm/armor/shield)
      // FIXED: Added \b word boundary to prevent matching "1" in "10%"
      const pdrFlatMapMatch = cleanLine.match(/Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)\b(?!\s*%)/i);
      if (pdrFlatMapMatch) {
        const value = parseInt(pdrFlatMapMatch[1]);
        this.addToStatsMap(statsMap, 'physical_damage_reduced', { value });
        return;
      }



      // Store other stats as non-stackable
      statsMap.set(`other_${Date.now()}_${Math.random()}`, { text: cleanLine, stackable: false });
    });

    return statsMap;
  }

  // Helper to add stats to map with proper stacking
  // Add this to your addToStatsMap function
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
      } else if (data.chance !== undefined && key.includes('_proc_')) {
        // Proc chances - stack them
        existing.chance = (existing.chance || 0) + data.chance;
        existing.stacked = true;
        // Keep the first skill name and level (they should be the same for stacking)
        if (!existing.skill) existing.skill = data.skill;
        if (!existing.level) existing.level = data.level;
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

        // CRITICAL FIX: Preserve corruption flag
        if (socketData.isCorrupted) {
          baseData.isCorrupted = true;
        }
      } else {
        // New stat from sockets only
        baseStats.set(key, { ...socketData, fromSocket: true });
      }
    });
  }

  // Format stacked stat for display with blue color
  formatStackedStat(key, data) {
    // CRITICAL FIX: Use Red for Corruption, Blue for Sockets
    let color = '#4a90e2'; // Default Blue
    let shadow = '';

    if (data.isCorrupted) {
      color = '#ff5555'; // Red for Corruption
      shadow = 'text-shadow: 0 0 3px #ff5555;'; // Add Glow
    }

    if (key.startsWith('level_up_proc_')) {
      return `<span style="color: ${color}; font-weight: bold;">${data.chance}% Chance to Cast Level ${data.level} ${data.skill} when you Level Up</span>`;
    }
    if (key.startsWith('death_proc_')) {
      return `<span style="color: ${color}; font-weight: bold;">${data.chance}% Chance to Cast Level ${data.level} ${data.skill} when you Die</span>`;
    }


    switch (key) {
      case 'lightning_damage':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Adds ${data.min}-${data.max} Lightning Damage</span>`;
      case 'fire_damage':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Adds ${data.min}-${data.max} Fire Damage</span>`;
      case 'cold_damage':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Adds ${data.min}-${data.max} Cold Damage</span>`;
      case 'poison_damage':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Adds ${data.min}-${data.max} Poison Damage</span>`;
      case 'fire_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Fire Resist +${data.value}%</span>`;
      case 'cold_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Cold Resist +${data.value}%</span>`;
      case 'lightning_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Lightning Resist +${data.value}%</span>`;
      case 'poison_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">Poison Resist +${data.value}%</span>`;
      case 'max_fire_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% to Maximum Fire Resist</span>`;
      case 'max_cold_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% to Maximum Cold Resist</span>`;
      case 'max_lightning_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% to Maximum Lightning Resist</span>`;
      case 'max_poison_resist':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% to Maximum Poison Resist</span>`;
      case 'strength':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Strength</span>`;
      case 'dexterity':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Dexterity</span>`;
      case 'vitality':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Vitality</span>`;
      case 'energy':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Energy</span>`;
      case 'attack_rating':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Attack Rating</span>`;
      case 'attack_rating_percent':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% to Attack Rating</span>`;
      case 'faster_hit_recovery':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% Faster Hit Recovery</span>`;
      case 'faster_block_rate':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% Faster Block Rate</span>`;
      case 'faster_cast_rate':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% Faster Cast Rate</span>`;
      case 'increased_attack_speed':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% Increased Attack Speed</span>`;
      case 'faster_run_walk':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value}% Faster Run/Walk</span>`;
      case 'magic_find':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">${data.value}% Better Chance of Getting Magic Items</span>`;
      case 'gold_find':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">${data.value}% Extra Gold from Monsters</span>`;
      case 'life':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Life</span>`;
      case 'mana':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Mana</span>`;
      case 'all_skills':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to All Skills</span>`;
      case 'crushing_blow':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">${data.value}% Chance of Crushing Blow</span>`;
      case 'deadly_strike':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">${data.value}% Deadly Strike</span>`;
      case 'open_wounds':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">${data.value}% Chance of Open Wounds</span>`;
      case 'minimum_damage':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Minimum Damage</span>`;
      case 'maximum_damage':
        return `<span style="color: ${color}; font-weight: bold; ${shadow}">+${data.value} to Maximum Damage</span>`;
      case 'mana_after_kill':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Mana after each Kill</span>`;
      case 'replenish_life':
        return `<span style="color: ${color}; font-weight: bold;">Replenish Life +${data.value}</span>`;
      case 'damage_vs_undead':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value}% Damage vs Undead</span>`;
      case 'ar_vs_undead':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value} Attack Rating vs Undead</span>`;
      case 'physical_damage_reduced':
        return `<span style="color: ${color}; font-weight: bold;">Physical Damage Taken Reduced by ${data.value}</span>`;
      case 'physical_damage_reduced_percent':
        return `<span style="color: ${color}; font-weight: bold;">Physical Damage Taken Reduced by ${data.value}%</span>`;
      case 'magic_damage_reduced':
        return `<span style="color: ${color}; font-weight: bold;">Magic Damage Reduced by ${data.value}</span>`;
      case 'fire_skill_damage':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value}% to Fire Skill Damage</span>`;
      case 'cold_skill_damage':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value}% to Cold Skill Damage</span>`;
      case 'lightning_skill_damage':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value}% to Lightning Skill Damage</span>`;
      case 'poison_skill_damage':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value}% to Poison Skill Damage</span>`;
      case 'fire_resist_pierce':
        return `<span style="color: ${color}; font-weight: bold;">-${data.value}% to Enemy Fire Resistance</span>`;
      case 'cold_resist_pierce':
        return `<span style="color: ${color}; font-weight: bold;">-${data.value}% to Enemy Cold Resistance</span>`;
      case 'lightning_resist_pierce':
        return `<span style="color: ${color}; font-weight: bold;">-${data.value}% to Enemy Lightning Resistance</span>`;
      case 'poison_resist_pierce':
        return `<span style="color: ${color}; font-weight: bold;">-${data.value}% to Enemy Poison Resistance</span>`;
      case 'lightRadius':
        return `<span style="color: ${color}; font-weight: bold;">+${data.value} to Light Radius</span>`;

      default:
        return data.text || '';
    }
  }

  // Get regex pattern to find original stat line for replacement
  getStatPattern(key) {
    switch (key) {
      case 'lightning_damage':
        return /(?:Adds\s+)?\d+-\d+\s+Lightning\s+Damage/gi;
      case 'fire_damage':
        return /(?:Adds\s+)?\d+-\d+\s+Fire\s+Damage/gi;
      case 'cold_damage':
        return /(?:Adds\s+)?\d+-\d+\s+Cold\s+Damage/gi;
      case 'poison_damage':
        return /(?:Adds\s+)?\d+-\d+\s+Poison\s+Damage/gi;
      case 'fire_resist':
        return /Fire\s+Resist\s+\+?\d+%?/gi;
      case 'cold_resist':
        return /Cold\s+Resist\s+\+?\d+%?/gi;
      case 'lightning_resist':
        return /Lightning\s+Resist\s+\+?\d+%?/gi;
      case 'poison_resist':
        return /Poison\s+Resist\s+\+?\d+%?/gi;
      case 'max_fire_resist':
        return /\+?\d+%\s+to\s+Maximum\s+Fire\s+Resist/gi;
      case 'max_cold_resist':
        return /\+?\d+%\s+to\s+Maximum\s+Cold\s+Resist/gi;
      case 'max_lightning_resist':
        return /\+?\d+%\s+to\s+Maximum\s+Lightning\s+Resist/gi;
      case 'max_poison_resist':
        return /\+?\d+%\s+to\s+Maximum\s+Poison\s+Resist/gi;
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
      case 'attack_rating_percent':
        return /\d+%\s+(?:Bonus\s+)?to\s+Attack\s+Rating/gi;
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
      case 'minimum_damage':
        return /\+\d+\s+to\s+Minimum\s+Damage/gi;
      case 'maximum_damage':
        return /\+\d+\s+to\s+Maximum\s+Damage/gi;
      case 'mana_after_kill':
        return /\+\d+\s+to\s+Mana\s+after\s+each\s+Kill/gi;
      case 'replenish_life':
        return /Replenish\s+Life\s+\+\d+/gi;
      case 'damage_vs_undead':
        return /\+\d+%\s+Damage\s+vs\s+Undead/gi;
      case 'ar_vs_undead':
        return /\+\d+\s+Attack\s+Rating\s+vs\s+Undead/gi;
      case 'physical_damage_reduced_percent':
        return /Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+\d+\s*%/gi;
      case 'physical_damage_reduced':
        return /Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+\d+\b(?!\s*%)/gi;
      case 'magic_damage_reduced':
        return /Magic\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+\d+\b/gi;
      case 'fire_skill_damage':
        return /\+(\d+)%\s+to\s+Fire\s+Skill\s+Damage/gi;
      case 'cold_skill_damage':
        return /\+(\d+)%\s+to\s+Cold\s+Skill\s+Damage/gi;
      case 'lightning_skill_damage':
        return /\+(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/gi;
      case 'poison_skill_damage':
        return /\+(\d+)%\s+to\s+Poison\s+Skill\s+Damage/gi;
      case 'fire_resist_pierce':
        return /-(\d+)%\s+to\s+Enemy\s+Fire\s+Resistance/gi;
      case 'cold_resist_pierce':
        return /-(\d+)%\s+to\s+Enemy\s+Cold\s+Resistance/gi;
      case 'lightning_resist_pierce':
        return /-(\d+)%\s+to\s+Enemy\s+Lightning\s+Resistance/gi;
      case 'poison_resist_pierce':
        return /-(\d+)%\s+to\s+Enemy\s+Poison\s+Resistance/gi;
      case 'level_up_proc':
        return /(\d+)%\s+Chance\s+to\s+Cast\s+Level\s+(\d+)\s+(.+?)\s+when\s+you\s+Level\s+Up/gi;
      case 'death_proc':
        return /(\d+)%\s+Chance\s+to\s+Cast\s+(.+?)\s+when\s+you\s+Die/gi;
      case 'lightRadius':
        return /(?:\+)?\d+\s+(?:to\s+)?Light\s+Radius/gi;
      default:
        return null;
    }
  }

  // Replace the updateStatsDisplay method with this CRAZY DEBUG version:

  updateStatsDisplay() {
    // Get base character stats
    const charClass = document.getElementById('selectClass')?.value || 'Amazon';
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
    const checkboxBonus = (document.querySelectorAll('.checkbox:checked').length * 10);
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

    // Attack Rating calculation
    const classConstant = this.classStats[charClass]?.arConstant || 0;
    const baseAR = (totalDex - 7) * 5 + classConstant;
    const gearAR = this.stats.toatt;
    const arBonus = 1 + (this.stats.toattPercent / 100);
    const totalAR = Math.floor((baseAR + gearAR) * arBonus);
    this.updateElement('attackratingcontainer', totalAR);

    // PD2 Open Wounds damage: Display only if chance > 0
    const finalOWDamage = this.stats.openWounds > 0 ? this.stats.openWoundsDamage : 0;
    this.updateElement('owdmgcontainer', finalOWDamage);
    this.updateElement('cbcontainer', this.stats.crushingBlow);
    this.updateElement('cbdmgcontainer', this.stats.crushingBlow);
    this.updateElement('deadlystrikecontainer', this.stats.deadlyStrike);
    this.updateElement('criticalhitcontainer', this.stats.criticalHit || 0);
    this.updateElement('lifestealcontainer', this.stats.lifeSteal);
    this.updateElement('manastealcontainer', this.stats.manaSteal);

    // Defensive stats - using correct HTML IDs
    this.updateElement('drcontainer', this.stats.dr);
    this.updateElement('pdrcontainer', this.stats.pdr);
    this.updateElement('mdrcontainer', this.stats.mdr);
    this.updateElement('plrcontainer', this.stats.plr || 0);
    this.updateElement('blockchancecontainer', this.stats.blockChance || 0);


    // Calculate total defense including dexterity bonus (totalDex / 4)
    const dexDefenseBonus = Math.floor(totalDex / 4);
    let totalDefense = this.stats.defense + dexDefenseBonus;

    // Apply Shout, Iron Skin, and Cloak of Shadows bonuses to the total defense
    const ownShoutBonus = window.skillSystem?.getShoutDefenseBonus?.() || 0;
    const partyShout = window.partyManager?.getBestBuff('shout');
    const shoutBonus = Math.max(ownShoutBonus, partyShout?.defenseBonus || 0);

    const ironSkinBonus = window.skillSystem?.getIronSkinDefenseBonus?.() || 0;
    const cloakBonus = window.skillSystem?.getCloakOfShadowsDefenseBonus?.() || 0;

    const totalDefPercent = shoutBonus + ironSkinBonus + cloakBonus;

    if (totalDefPercent > 0) {
      totalDefense = Math.floor(totalDefense * (1 + totalDefPercent / 100));
    }

    const defenseContainer = document.getElementById('defensecontainer');
    if (defenseContainer) {
      defenseContainer.textContent = totalDefense;
      defenseContainer.style.color = (totalDefPercent > 0) ? '#d0d007ff' : '';
    }

    // Core stats
    const ownBCSkills = window.skillSystem?.getBattleCommandSkills?.() || 0;
    const partyBC = window.partyManager?.getBestBuff('battle-command');
    const partyBCSkills = partyBC ? partyBC.allSkills : 0;
    const bestBC = Math.max(ownBCSkills, partyBCSkills);

    const allSkillsContainer = document.getElementById('allskillscontainer');
    if (allSkillsContainer) {
      allSkillsContainer.textContent = this.stats.allSkills;
      allSkillsContainer.style.color = bestBC > 0 ? '#d0d007ff' : '';
    }

    // Update skill bonus indicators if skill system is available (include both all skills and class skills)
    if (window.skillSystem) {
      window.skillSystem.updateSkillBonuses(this.stats.allSkills, this.stats.classSkills, this.stats.treeSkills);
    }

    this.updateElement('magicfindcontainer', this.stats.magicFind);
    this.updateElement('goldfindcontainer', this.stats.goldFind);

    // Boolean stats
    this.updateElement('cbfcontainer', this.stats.cbf ? 'Yes' : 'No');

    // Damage ranges - Apply skill damage % bonuses to flat elemental damage
    // This makes flat damage from items/gems/jewels benefit from Fire/Cold/Lightning Mastery
    const fireSkillDmgBonus = this.stats.fireSkillDamage || 0;
    const coldSkillDmgBonus = this.stats.coldSkillDamage || 0;
    const lightningSkillDmgBonus = this.stats.lightningSkillDamage || 0;
    const poisonSkillDmgBonus = this.stats.poisonSkillDamage || 0;

    this.updateElement('flatfiremincontainer', Math.floor(this.stats.fireDmgMin * (1 + fireSkillDmgBonus / 100)));
    this.updateElement('flatfiremaxcontainer', Math.floor(this.stats.fireDmgMax * (1 + fireSkillDmgBonus / 100)));
    this.updateElement('flatcoldmincontainer', Math.floor(this.stats.coldDmgMin * (1 + coldSkillDmgBonus / 100)));
    this.updateElement('flatcoldmaxcontainer', Math.floor(this.stats.coldDmgMax * (1 + coldSkillDmgBonus / 100)));
    this.updateElement('flatlightmincontainer', Math.floor(this.stats.lightDmgMin * (1 + lightningSkillDmgBonus / 100)));
    this.updateElement('flatlightmaxcontainer', Math.floor(this.stats.lightDmgMax * (1 + lightningSkillDmgBonus / 100)));
    this.updateElement('flatpoisonmincontainer', Math.floor(this.stats.poisonDmgMin * (1 + poisonSkillDmgBonus / 100)));
    this.updateElement('flatpoisonmaxcontainer', Math.floor(this.stats.poisonDmgMax * (1 + poisonSkillDmgBonus / 100)));

    // Physical damage bonuses (for skill tooltips)
    this.updateElement('tomindmgcontainer', this.stats.toMinDmg);
    this.updateElement('tomaxdmgcontainer', this.stats.toMaxDmg);

    this.updateElement('fireskilldmgcontainer', this.stats.fireSkillDamage);
    this.updateElement('coldskilldmgcontainer', this.stats.coldSkillDamage);
    this.updateElement('lightningskilldmgcontainer', this.stats.lightningSkillDamage);
    this.updateElement('poisonskilldmgcontainer', this.stats.poisonSkillDamage);
    this.updateElement('magicskilldmgcontainer', this.stats.magicSkillDamage);

    // Enemy resistance pierce
    this.updateElement('piercefirecontainer', this.stats.pierceFire);
    this.updateElement('piercecoldcontainer', this.stats.pierceCold);
    this.updateElement('piercelightningcontainer', this.stats.pierceLightning);
    this.updateElement('piercepoisoncontainer', this.stats.piercePoison);
    this.updateElement('piercephyscontainer', this.stats.piercePhysical);
    this.updateElement('piercemagiccontainer', this.stats.pierceMagic);

    // Update crit multiplier when stats change (including deadly strike)
    if (typeof window.updateCritDisplay === 'function') {
      window.updateCritDisplay();
    }

    // NOTE: We do NOT call onEquipmentOrSocketChange here because it triggers updateCharmDisplay
    // which calls getCharmBonuses() again, causing double-counting.
    // Charm bonuses are already read by calculateAllStats() above.

    // BUT we DO need to update character stats to show green bonus numbers for str/dex/vit/enr
    if (window.characterManager && typeof window.characterManager.updateTotalStats === 'function') {
      window.characterManager.updateTotalStats();
    }

    // CRITICAL: Update character total stats display (green bonus numbers)
    // This ensures str/dex/vit/enr show correct totals after equipment/corruption changes
    if (window.characterManager && typeof window.characterManager.updateTotalStats === 'function') {
      window.characterManager.updateTotalStats();
    }

    // Recalculate skill damage whenever stats change (including when jewels are inserted)
    if (window.skillSystem && typeof window.skillSystem.calculateSkillDamage === 'function') {
      window.skillSystem.calculateSkillDamage();
    }
  }

  updateMercenaryStatsDisplay() {
    // Get party buffs for mercenary
    const ownShoutBonus = window.skillSystem?.getShoutDefenseBonus?.() || 0;
    const partyShout = window.partyManager?.getBestBuff('shout');
    const shoutBonus = Math.max(ownShoutBonus, partyShout?.defenseBonus || 0);

    const cloakBonus = window.skillSystem?.getCloakOfShadowsDefenseBonus?.() || 0;
    const totalDefBonus = shoutBonus + cloakBonus;

    let finalDef = this.mercenaryStats.defense;
    if (totalDefBonus > 0) {
      finalDef = Math.floor(finalDef * (1 + totalDefBonus / 100));
    }

    const bcBonus = window.skillSystem?.getBattleCommandSkills?.() || 0;
    const partyBC = window.partyManager?.getBestBuff('battle-command');
    const totalBC = Math.max(bcBonus, partyBC?.allSkills || 0);

    // Update mercenary stats display with values from mercenaryStats object
    this.updateElement('merc-allskills', this.mercenaryStats.allSkills + totalBC);
    const mercAllSkillsElem = document.getElementById('merc-allskills');
    if (mercAllSkillsElem) mercAllSkillsElem.style.color = totalBC > 0 ? '#d0d007ff' : '';

    this.updateElement('merc-mf', this.mercenaryStats.magicFind);
    this.updateElement('merc-gf', this.mercenaryStats.goldFind);

    this.updateElement('merc-defense', finalDef);
    const mercDefElem = document.getElementById('merc-defense');
    if (mercDefElem) mercDefElem.style.color = totalDefBonus > 0 ? '#d0d007ff' : '';

    this.updateElement('merc-dr', this.mercenaryStats.dr);
    this.updateElement('merc-pdr', this.mercenaryStats.pdr);
    this.updateElement('merc-mdr', this.mercenaryStats.mdr);
    this.updateElement('merc-plr', this.mercenaryStats.plr);
    this.updateElement('merc-cbf', this.mercenaryStats.cbf ? 'Yes' : 'No');
    this.updateElement('merc-ias', this.mercenaryStats.ias);
    this.updateElement('merc-fcr', this.mercenaryStats.fcr);
    this.updateElement('merc-frw', this.mercenaryStats.frw);
    this.updateElement('merc-fhr', this.mercenaryStats.fhr);
    this.updateElement('merc-fire-res', this.mercenaryStats.fireResist);
    this.updateElement('merc-cold-res', this.mercenaryStats.coldResist);
    this.updateElement('merc-light-res', this.mercenaryStats.lightResist);
    this.updateElement('merc-poison-res', this.mercenaryStats.poisonResist);
    this.updateElement('merc-curse-res', this.mercenaryStats.curseResist);
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
      'amulet': 'amulet-info',
      // Mercenary equipment
      'mercweapon': 'merc-weapon-info', 'merchelm': 'merc-helm-info', 'mercarmor': 'merc-armor-info',
      'mercoff': 'merc-off-info', 'mercgloves': 'merc-glove-info', 'mercbelts': 'merc-belt-info',
      'mercboots': 'merc-boot-info'
    };
    return mapping[section] || `${section}-info`;
  }

  getSectionDropdownId(section) {
    const mapping = {
      'weapon': 'weapons-dropdown', 'helm': 'helms-dropdown', 'armor': 'armors-dropdown',
      'shield': 'offs-dropdown', 'gloves': 'gloves-dropdown', 'belts': 'belts-dropdown',
      'boots': 'boots-dropdown', 'ringone': 'ringsone-dropdown', 'ringtwo': 'ringstwo-dropdown',
      'amulet': 'amulets-dropdown',
      // Mercenary equipment
      'mercweapon': 'mercweapons-dropdown', 'merchelm': 'merchelms-dropdown', 'mercarmor': 'mercarmors-dropdown',
      'mercoff': 'mercoffs-dropdown', 'mercgloves': 'mercgloves-dropdown', 'mercbelts': 'mercbelts-dropdown',
      'mercboots': 'mercboots-dropdown'
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
        
        .socket-grid.sockets-3 {
    grid-template-columns: repeat(2, 25px);
    grid-template-rows: repeat(2, 25px);
    gap: 8px;
  }
  .socket-grid.sockets-3 .socket-slot:nth-child(1) { grid-column: 1; grid-row: 1; }
  .socket-grid.sockets-3 .socket-slot:nth-child(2) { grid-column: 2; grid-row: 1; }
  .socket-grid.sockets-3 .socket-slot:nth-child(3) { grid-column: 1 / span 2; grid-row: 2; justify-self: center; }

  /* 4 sockets - 2x2 square */
  .socket-grid.sockets-4 {
    grid-template-columns: repeat(2, 25px);
    grid-template-rows: repeat(2, 25px);
    gap: 8px;
  }

  .socket-grid.sockets-5 {
    grid-template-columns: repeat(3, 22px);
    grid-template-rows: repeat(3, 22px);
    gap: 4px;
  }
  .socket-grid.sockets-5 .socket-slot:nth-child(1) { grid-column: 1; grid-row: 1; }
  .socket-grid.sockets-5 .socket-slot:nth-child(2) { grid-column: 3; grid-row: 1; }
  .socket-grid.sockets-5 .socket-slot:nth-child(3) { grid-column: 2; grid-row: 2; }
  .socket-grid.sockets-5 .socket-slot:nth-child(4) { grid-column: 1; grid-row: 3; }
  .socket-grid.sockets-5 .socket-slot:nth-child(5) { grid-column: 3; grid-row: 3; }
        
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



  createRainbowFacetModal() {

    // Remove existing modal first
    const existingModal = document.getElementById('rainbowFacetModal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'rainbowFacetModal';
    modal.className = 'socket-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="socket-modal-content">
        <span class="socket-close">&times;</span>
        <h3>Create Rainbow Facet</h3>
        
        <div class="jewel-creation-section">
          <h4>Choose Element Type:</h4>
          <div class="element-selection" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
            <div class="element-option" data-element="fire" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">🔥</div>
              <div style="color: #ff4500;">Fire</div>
            </div>
            <div class="element-option" data-element="cold" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">❄️</div>
              <div style="color: #4169e1;">Cold</div>
            </div>
            <div class="element-option" data-element="lightning" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">⚡</div>
              <div style="color: #ffd700;">Lightning</div>
            </div>
            <div class="element-option" data-element="poison" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">☠️</div>
              <div style="color: #32cd32;">Poison</div>
            </div>
          </div>
          
          <div id="facetPreview" class="jewel-preview">Select an element type</div>
          
          <div style="margin-top: 20px;">
            <button id="createRainbowFacetBtn" style="
              background-color: #666; 
              color: white; 
              border: none; 
              padding: 15px 30px; 
              border-radius: 6px; 
              font-size: 16px; 
              width: 100%; 
              cursor: not-allowed;
              pointer-events: none;
            ">
              Select an element first
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Reset selection state
    this.selectedFacetElement = null;

    // SIMPLE CLOSE HANDLERS
    modal.querySelector('.socket-close').onclick = () => {
      this.hideRainbowFacetModal();
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        this.hideRainbowFacetModal();
      }
    };

    // SIMPLE ELEMENT SELECTION
    const elementOptions = modal.querySelectorAll('.element-option');
    elementOptions.forEach(option => {
      option.onclick = () => {
        const element = option.dataset.element;

        // Clear previous selections
        elementOptions.forEach(opt => {
          opt.style.borderColor = '#333';
          opt.style.backgroundColor = 'transparent';
        });

        // Select this one
        option.style.borderColor = '#ffd700';
        option.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';

        this.selectedFacetElement = element;

        // Enable button with DIRECT onclick (not addEventListener)
        const btn = document.getElementById('createRainbowFacetBtn');
        btn.style.backgroundColor = '#00aa00';
        btn.style.cursor = 'pointer';
        btn.style.pointerEvents = 'auto';
        btn.textContent = 'Create Rainbow Facet';

        // CRITICAL: Use onclick directly, not addEventListener
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.createRainbowFacet();
        };

        this.updateRainbowFacetPreview();
      };
    });

    this.updateRainbowFacetPreview();
  }

  selectRainbowFacetElement(element) {

    // Clear previous selection
    document.querySelectorAll('.element-option').forEach(opt => {
      opt.classList.remove('selected');
      opt.style.borderColor = '#333';
      opt.style.backgroundColor = 'transparent';
      opt.style.boxShadow = 'none';
    });

    // Select new element
    const selectedOption = document.querySelector(`[data-element="${element}"]`);
    if (selectedOption) {
      selectedOption.classList.add('selected');
      selectedOption.style.borderColor = '#ffd700';
      selectedOption.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
      selectedOption.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';

      this.selectedFacetElement = element;

      // Enable the create button
      const createButton = document.getElementById('createRainbowFacetBtn');
      if (createButton) {
        createButton.style.backgroundColor = '#00aa00';
        createButton.style.cursor = 'pointer';
        createButton.disabled = false;
        createButton.textContent = 'Create Rainbow Facet';
      }

      this.updateRainbowFacetPreview();
    }
  }

  updateRainbowFacetPreview() {
    const preview = document.getElementById('facetPreview');
    if (!preview || !this.selectedFacetElement) {
      if (preview) preview.innerHTML = '<span style="color: #888;">Select an element type</span>';
      return;
    }

    const facetData = this.getRainbowFacetData(this.selectedFacetElement);
    const jewelColor = this.getRandomJewelColor();

    preview.innerHTML = `
      <div style="color: #ffd700; font-weight: bold; margin-bottom: 10px;">
        ${facetData.name}
      </div>
      <div style="color: #4169e1; font-size: 12px; margin-bottom: 8px;">
        ${facetData.onLevelUp}
      </div>
      <div style="color: #4169e1; font-size: 12px; margin-bottom: 8px;">
        ${facetData.onDeath}
      </div>
      <div style="color: #4169e1; font-size: 12px; margin-bottom: 8px;">
        ${facetData.damage}
      </div>
      <div style="color: #4169e1; font-size: 12px; margin-bottom: 8px;">
        ${facetData.skillDamage}
      </div>
      <div style="color: #4169e1; font-size: 12px;">
        ${facetData.resistance}
      </div>
      <div style="color: #888; font-size: 10px; margin-top: 8px;">
        Jewel Color: ${jewelColor}
      </div>
    `;
  }

  getRainbowFacetData(element) {
    const facets = {
      fire: {
        name: 'Rainbow Facet (Fire)',
        onLevelUp: '100% Chance to Cast Level 29 Blaze when you Level Up',
        onDeath: '100% Chance to Cast Level 31 Meteor when you Die',
        damage: 'Adds 17-45 Fire Damage',
        skillDamage: `+${this.getRandomValue(3, 5)}% to Fire Skill Damage`,
        resistance: `-${this.getRandomValue(3, 5)}% to Enemy Fire Resistance`
      },
      lightning: {
        name: 'Rainbow Facet (Lightning)',
        onLevelUp: '100% Chance to Cast Level 41 Nova when you Level Up',
        onDeath: '100% Chance to Cast Level 47 Chain Lightning when you Die',
        damage: 'Adds 1-74 Lightning Damage',
        skillDamage: `+${this.getRandomValue(3, 5)}% to Lightning Skill Damage`,
        resistance: `-${this.getRandomValue(3, 5)}% to Enemy Lightning Resistance`
      },
      cold: {
        name: 'Rainbow Facet (Cold)',
        onLevelUp: '100% Chance to Cast Level 35 Frozen Orb when you Level Up',
        onDeath: '100% Chance to Cast Level 40 Blizzard when you Die',
        damage: 'Adds 25-35 Cold Damage',
        skillDamage: `+${this.getRandomValue(3, 5)}% to Cold Skill Damage`,
        resistance: `-${this.getRandomValue(3, 5)}% to Enemy Cold Resistance`
      },
      poison: {
        name: 'Rainbow Facet (Poison)',
        onLevelUp: '100% Chance to Cast Level 33 Poison Nova when you Level Up',
        onDeath: '100% Chance to Cast Level 38 Poison Explosion when you Die',
        damage: 'Adds 15-25 Poison Damage',
        skillDamage: `+${this.getRandomValue(3, 5)}% to Poison Skill Damage`,
        resistance: `-${this.getRandomValue(3, 5)}% to Enemy Poison Resistance`
      }
    };

    return facets[element];
  }

  getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomJewelColor() {
    const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'white'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createRainbowFacet() {

    const socketToUse = this.currentSocket || this.rainbowFacetTargetSocket;

    if (!socketToUse || !this.selectedFacetElement) {
      alert('Error: Missing socket or element selection');
      return;
    }

    const facetData = this.getRainbowFacetData(this.selectedFacetElement);
    const jewelColor = this.getRandomJewelColor();
    const imagePath = `img/jewel${jewelColor}.png`;

    // Clear old socket data
    ['itemKey', 'category', 'itemName', 'stats', 'levelReq'].forEach(attr => {
      delete socketToUse.dataset[attr];
    });

    // Fill the socket
    socketToUse.className = 'socket-slot filled';
    socketToUse.innerHTML = `<img src="${imagePath}" alt="Rainbow Facet">`;

    // CRITICAL: Create properly formatted stats string
    const randomProc = Math.random() < 0.5 ? facetData.onLevelUp : facetData.onDeath;

    const statsArray = [
      randomProc,  // Only one proc instead of both
      facetData.damage,
      facetData.skillDamage,
      facetData.resistance
    ];

    const statsText = statsArray.join(', ');


    // Set socket data
    socketToUse.dataset.itemKey = 'rainbow-facet-' + this.selectedFacetElement;
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = facetData.name;
    socketToUse.dataset.stats = statsText;
    socketToUse.dataset.levelReq = '49';

    // Get section for updates
    const section = socketToUse.closest('.socket-container')?.dataset.section || 'weapon';

    // Close modal and cleanup
    this.hideRainbowFacetModal();
    this.currentSocket = null;
    this.rainbowFacetTargetSocket = null;
    this.selectedFacetElement = null;

    // Force immediate update
    this.updateAll();

  }

  hideRainbowFacetModal() {
    const modal = document.getElementById('rainbowFacetModal');
    if (modal) {
      modal.remove();
    }
    // Don't clear the socket references here, let createRainbowFacet do it
    this.selectedFacetElement = null;
  }

  // === EXPORT/IMPORT METHODS ===
  exportSocketData() {
    const socketData = {};



    // Iterate through all socket containers on the page
    const containers = document.querySelectorAll('.socket-container');


    containers.forEach(container => {
      const section = container.dataset.section;

      if (!section) return;

      socketData[section] = [];

      // Get all socket slots (both filled and empty to understand structure)
      const allSlots = container.querySelectorAll('.socket-slot');


      // Get all filled sockets in this container
      const filledSockets = container.querySelectorAll('.socket-slot.filled');


      filledSockets.forEach((socket, idx) => {
        const socketInfo = {
          itemKey: socket.dataset.itemKey || '',
          category: socket.dataset.category || '',
          itemName: socket.dataset.itemName || '',
          stats: socket.dataset.stats || '',
          levelReq: socket.dataset.levelReq || '1'
        };

        socketData[section].push(socketInfo);
      });
    });


    return socketData;
  }

  importSocketData(socketData) {
    if (!socketData || typeof socketData !== 'object') {
      console.warn('Invalid socket data provided for import');
      return;
    }



    // Iterate through each section's sockets
    for (const [section, sockets] of Object.entries(socketData)) {
      const container = document.querySelector(`.socket-container[data-section="${section}"]`);
      if (!container) {
        console.warn(`Socket container not found for section: ${section}`);
        continue;
      }

      const socketGrid = container.querySelector('.socket-grid');
      if (!socketGrid) {
        console.warn(`Socket grid not found for section: ${section}`);
        continue;
      }



      // First, ensure we have enough socket slots
      const currentSlotCount = socketGrid.children.length;
      const requiredSlotCount = sockets.length;

      // Add empty sockets if we need more
      while (socketGrid.children.length < requiredSlotCount) {
        const newSocket = document.createElement('div');
        newSocket.className = 'socket-slot empty';
        newSocket.dataset.index = socketGrid.children.length.toString();
        socketGrid.appendChild(newSocket);

      }

      // Update the socket grid CSS class to reflect socket count
      socketGrid.className = `socket-grid sockets-${socketGrid.children.length}`;

      // Get all socket slots in this container
      const socketSlots = container.querySelectorAll('.socket-slot');

      // Fill each slot with the corresponding data
      sockets.forEach((socketData, index) => {
        if (index >= socketSlots.length) {
          console.warn(`More socket data than slots available for section: ${section}`);
          return;
        }

        const slot = socketSlots[index];

        // Clear the slot first
        slot.className = 'socket-slot empty';
        slot.innerHTML = '';
        delete slot.dataset.itemKey;
        delete slot.dataset.category;
        delete slot.dataset.itemName;
        delete slot.dataset.stats;
        delete slot.dataset.levelReq;

        // Skip empty socket data
        if (!socketData.itemKey || !socketData.category) {

          return;
        }

        // Handle custom jewels specially (they're not in the static database)
        if (socketData.itemKey === 'custom-jewel') {
          slot.className = 'socket-slot filled';
          // Extract color from jewel name (e.g., "White Jewel" -> "white")
          const color = socketData.itemName.split(' ')[0].toLowerCase();
          slot.innerHTML = `<img src="img/jewel${color}.png" alt="${socketData.itemName}">`;
          slot.dataset.itemKey = socketData.itemKey;
          slot.dataset.category = socketData.category;
          slot.dataset.itemName = socketData.itemName;
          slot.dataset.stats = socketData.stats;
          slot.dataset.levelReq = socketData.levelReq || '1';
          return;
        }

        // Get the item data from the socket system
        const item = this.socketData[socketData.category]?.[socketData.itemKey];

        if (!item) {
          console.warn(`Item not found: ${socketData.category}/${socketData.itemKey}`);
          return;
        }

        // Fill the socket
        slot.className = 'socket-slot filled';
        slot.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
        slot.dataset.itemKey = socketData.itemKey;
        slot.dataset.category = socketData.category;
        slot.dataset.itemName = socketData.itemName;
        slot.dataset.levelReq = socketData.levelReq || '1';

        // Set stats based on section
        const stats = typeof item.stats === 'object' ? item.stats[section] : item.stats;
        if (stats) {
          slot.dataset.stats = stats;
        }


      });
    }



    this.updateAll();
  }
}

document.addEventListener('DOMContentLoaded', function () {

  window.unifiedSocketSystem = new UnifiedSocketSystem();

  // Legacy function for compatibility
  window.validateAllItems = () => {
    if (window.unifiedSocketSystem) {
      window.unifiedSocketSystem.updateAll();
    }
  };
});

// === FALLBACK FOR IMMEDIATE AVAILABILITY ===
window.addSocket = function (section) {


  if (window.unifiedSocketSystem) {
    window.unifiedSocketSystem.addSocket(section);
    return;
  }

  // Simple fallback if system not ready yet
  const container = document.querySelector(`.socket-container[data-section="${section}"]`);
  if (!container) {
    return;
  }

  const socketGrid = container.querySelector('.socket-grid');
  if (!socketGrid) {
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

