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
        'rare-jewel': { name: 'Rare Jewel', img: 'img/jewel1.png', levelReq: 1, stats: { weapon: '+15% Enhanced Damage', helm: '+15% Enhanced Damage', armor: '+15% Enhanced Damage', shield: '+15% Enhanced Damage' }, levelReq: 1 }
      }
    };
     this.isInitializing = true; 
    this.currentSocket = null;
    this.targetSocket = null;
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;
    

  this.init();
  
  // Add this at the end:
  setTimeout(() => {
    this.isInitializing = false;
    console.log('✅ Initialization complete');
  }, 100);
}
  
  init() {
    this.setupEventListeners();
    this.initializeSocketSystem();
    this.createJewelModal();


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
          background: rgba(14, 11, 11, 0.86);
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
          gap: 3px;
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
          background: #000000;
          border-color: #999;
        }
        
        .socket-slot:hover {
          border-color: #4a90e2;
        }
        
        .socket-slot img {
          width: 30px;
          height: 30px;
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
// Smart Socket Property Stacking System
// Replaces updateItemDisplay method in your socket-system.js

// ULTRA QUICK FIX - Replace ONLY the updateItemDisplay method
// This preserves stacking while keeping the level requirement fix

updateItemDisplay(section) {
  console.log(`🎨 Updating item display for ${section}...`);
  
  // ✅ FIXED: Use the new getSectionInfoId method
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
  
  // ✅ CRITICAL: Calculate actual required level INCLUDING sockets
  const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
  const meetsRequirement = currentLevel >= actualRequiredLevel;
  
  console.log(`🔍 ${section}: Level ${currentLevel}/${actualRequiredLevel} - ${meetsRequirement ? 'USABLE' : 'BLOCKED'}`);
  
  // ✅ RESTORE STACKING: Use the existing stacking system
  let baseDescription = item.description || '';
  
  // Parse base item stats into a map
  const baseStats = this.parseStatsToMap(baseDescription);
  
  // Get socket stats and merge them with base stats
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
        usable: currentLevel >= levelReq && meetsRequirement  // ✅ Socket unusable if item unusable
      });
      
      // Only merge stats if both item and socket are usable
      if (meetsRequirement && currentLevel >= levelReq) {
        const parsedSocketStats = this.parseStatsToMap(stats);
        this.mergeStatsMaps(baseStats, parsedSocketStats);
      }
    }
  });
  
  // Generate the final description with stacked properties
  let finalDescription = this.generateStackedDescription(baseDescription, baseStats, socketItems);
  
  // ✅ CLEAN FIX: Update the existing "Required Level" line in place (don't add new one)
  const levelColor = meetsRequirement ? '#00ff00' : '#ff5555';
  const newLevelLine = `<span style="color: ${levelColor}; font-weight: bold;">Required Level: ${actualRequiredLevel}</span>`;
  
  // Replace the existing "Required Level" with updated value and color
  const levelPattern = /(?:<span[^>]*>)?Required Level: \d+(?:<\/span>)?/gi;
  if (levelPattern.test(finalDescription)) {
    finalDescription = finalDescription.replace(levelPattern, newLevelLine);
  } else {
    // If no "Required Level" found in description, don't add one
    console.log(`No "Required Level" found in ${section} description - keeping original`);
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
  
  // ✅ Update display keeping original "Required Level" position
  infoDiv.innerHTML = finalDescription;
}
// Parse stats text into a map for easy merging
parseStatsToMap(statsText) {
  const statsMap = new Map();
  const lines = statsText.split('<br>').filter(line => line.trim());
  
  lines.forEach(line => {
    const cleanLine = line.replace(/<[^>]*>/g, '').trim();
    if (!cleanLine) return;
    
    // Lightning Damage
    const lightningMatch = cleanLine.match(/(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Lightning\s+Damage/i);
    if (lightningMatch) {
      const min = parseInt(lightningMatch[1]);
      const max = parseInt(lightningMatch[2] || lightningMatch[1]);
      this.addToStatsMap(statsMap, 'lightning_damage', { min, max });
      return;
    }
    
    // Fire Damage
    const fireMatch = cleanLine.match(/(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Fire\s+Damage/i);
    if (fireMatch) {
      const min = parseInt(fireMatch[1]);
      const max = parseInt(fireMatch[2] || fireMatch[1]);
      this.addToStatsMap(statsMap, 'fire_damage', { min, max });
      return;
    }
    
    // Cold Damage
    const coldMatch = cleanLine.match(/(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Cold\s+Damage/i);
    if (coldMatch) {
      const min = parseInt(coldMatch[1]);
      const max = parseInt(coldMatch[2] || coldMatch[1]);
      this.addToStatsMap(statsMap, 'cold_damage', { min, max });
      return;
    }
    
    // Poison Damage
    const poisonMatch = cleanLine.match(/(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Poison\s+Damage/i);
    if (poisonMatch) {
      const min = parseInt(poisonMatch[1]);
      const max = parseInt(poisonMatch[2] || poisonMatch[1]);
      this.addToStatsMap(statsMap, 'poison_damage', { min, max });
      return;
    }
    
    // Life
    const lifeMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Life/i);
    if (lifeMatch) {
      const value = parseInt(lifeMatch[1]);
      this.addToStatsMap(statsMap, 'life', { value });
      return;
    }
    
    // Mana
    const manaMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Mana/i);
    if (manaMatch) {
      const value = parseInt(manaMatch[1]);
      this.addToStatsMap(statsMap, 'mana', { value });
      return;
    }
    
    // Defense
    const defenseMatch = cleanLine.match(/(?:\+)?(\d+)\s+Defense/i);
    if (defenseMatch && !cleanLine.includes('Enhanced') && !cleanLine.includes('vs.')) {
      const value = parseInt(defenseMatch[1]);
      this.addToStatsMap(statsMap, 'defense', { value });
      return;
    }
    
    // Attack Rating
    const arMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?Attack\s+Rating/i);
    if (arMatch) {
      const value = parseInt(arMatch[1]);
      this.addToStatsMap(statsMap, 'attack_rating', { value });
      return;
    }
    
    // Magic Find
    const mfMatch = cleanLine.match(/(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i);
    if (mfMatch) {
      const value = parseInt(mfMatch[1]);
      this.addToStatsMap(statsMap, 'magic_find', { value });
      return;
    }
    
    // All Resistances
    const allResMatch = cleanLine.match(/All\s+Resistances?\s+(?:\+)?(\d+)%?/i);
    if (allResMatch) {
      const value = parseInt(allResMatch[1]);
      this.addToStatsMap(statsMap, 'all_resistances', { value });
      return;
    }
    
    // Individual Resistances
    const resMatch = cleanLine.match(/(Fire|Cold|Lightning|Poison)\s+Resist\s+(?:\+)?(\d+)%?/i);
    if (resMatch) {
      const type = resMatch[1].toLowerCase();
      const value = parseInt(resMatch[2]);
      this.addToStatsMap(statsMap, `${type}_resist`, { value });
      return;
    }
    
    // Attributes (Strength, Dexterity, etc.)
    const attrMatch = cleanLine.match(/(?:\+)?(\d+)\s+to\s+(Strength|Dexterity|Vitality|Energy)/i);
    if (attrMatch) {
      const value = parseInt(attrMatch[1]);
      const attr = attrMatch[2].toLowerCase();
      this.addToStatsMap(statsMap, attr, { value });
      return;
    }
    
    // Store other stats as-is
    statsMap.set(`other_${Date.now()}_${Math.random()}`, { text: cleanLine, stackable: false });
  });
  
  return statsMap;
}

// Helper to add stats to map with proper stacking
addToStatsMap(statsMap, key, data) {
  if (statsMap.has(key)) {
    const existing = statsMap.get(key);
    if (data.min !== undefined && data.max !== undefined) {
      // Damage ranges
      existing.min = (existing.min || 0) + data.min;
      existing.max = (existing.max || 0) + data.max;
      existing.stacked = true;
    } else if (data.value !== undefined) {
      // Single values
      existing.value = (existing.value || 0) + data.value;
      existing.stacked = true;
    }
  } else {
    statsMap.set(key, { ...data, stacked: false });
  }
}

// Merge socket stats into base stats
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
      // New stat from sockets
      baseStats.set(key, { ...socketData, fromSocket: true });
    }
  });
}

// Generate final description with stacked properties
generateStackedDescription(originalDescription, mergedStats, socketItems) {
  let finalDescription = originalDescription;
  
  // Replace stacked stats in the original description
  mergedStats.forEach((data, key) => {
    if (data.stacked || data.fromSocket) {
      const replacement = this.formatStackedStat(key, data);
      if (replacement) {
        // Find and replace the original stat line
        const pattern = this.getStatPattern(key);
        if (pattern && !data.fromSocket) {
          finalDescription = finalDescription.replace(pattern, replacement);
        } else if (data.fromSocket) {
          // Add new socket-only stats at the end
          finalDescription += `<br>${replacement}`;
        }
      }
    }
  });
  
  // Add non-stackable socket effects
  const nonStackableEffects = [];
  socketItems.forEach(socketItem => {
    if (socketItem.usable) {
      // Extract non-stackable effects like "Knockback", "Requirements -20%", etc.
      const effects = this.extractNonStackableEffects(socketItem.stats);
      effects.forEach(effect => {
        if (!nonStackableEffects.includes(effect)) {
          nonStackableEffects.push(effect);
        }
      });
    }
  });
  
  // Add non-stackable effects
  nonStackableEffects.forEach(effect => {
    finalDescription += `<br><span style="color: #4a90e2; font-weight: bold;">${effect}</span>`;
  });
  
  // Add unusable socket items in gray
  const unusableEffects = socketItems.filter(item => !item.usable);
  unusableEffects.forEach(item => {
    finalDescription += `<br><span style="color: #888; font-style: italic;">${item.name}: ${item.stats} (Level ${item.levelReq} Required)</span>`;
  });
  
  return finalDescription;
}

// Format a stacked stat for display
formatStackedStat(key, data) {
  const color = data.stacked || data.fromSocket ? '#4a90e2' : 'inherit';
  const style = `color: ${color}; font-weight: bold;`;
  
  switch (key) {
    case 'lightning_damage':
      return `<span style="${style}">Adds ${data.min}-${data.max} Lightning Damage</span>`;
    case 'fire_damage':
      return `<span style="${style}">Adds ${data.min}-${data.max} Fire Damage</span>`;
    case 'cold_damage':
      return `<span style="${style}">Adds ${data.min}-${data.max} Cold Damage</span>`;
    case 'poison_damage':
      return `<span style="${style}">Adds ${data.min}-${data.max} Poison Damage over X Seconds</span>`;
    case 'life':
      return `<span style="${style}">+${data.value} to Life</span>`;
    case 'mana':
      return `<span style="${style}">+${data.value} to Mana</span>`;
    case 'defense':
      return `<span style="${style}">+${data.value} Defense</span>`;
    case 'attack_rating':
      return `<span style="${style}">+${data.value} to Attack Rating</span>`;
    case 'magic_find':
      return `<span style="${style}">${data.value}% Better Chance of Getting Magic Items</span>`;
    case 'all_resistances':
      return `<span style="${style}">All Resistances +${data.value}</span>`;
    case 'fire_resist':
      return `<span style="${style}">Fire Resist +${data.value}%</span>`;
    case 'cold_resist':
      return `<span style="${style}">Cold Resist +${data.value}%</span>`;
    case 'lightning_resist':
      return `<span style="${style}">Lightning Resist +${data.value}%</span>`;
    case 'poison_resist':
      return `<span style="${style}">Poison Resist +${data.value}%</span>`;
    case 'strength':
      return `<span style="${style}">+${data.value} to Strength</span>`;
    case 'dexterity':
      return `<span style="${style}">+${data.value} to Dexterity</span>`;
    case 'vitality':
      return `<span style="${style}">+${data.value} to Vitality</span>`;
    case 'energy':
      return `<span style="${style}">+${data.value} to Energy</span>`;
    default:
      if (data.text) {
        return `<span style="${style}">${data.text}</span>`;
      }
      return null;
  }
}

// Get regex pattern for finding stats in description
getStatPattern(key) {
  switch (key) {
    case 'lightning_damage':
      return /(?:Adds\s+)?\d+(?:-\d+)?\s+Lightning\s+Damage/i;
    case 'fire_damage':
      return /(?:Adds\s+)?\d+(?:-\d+)?\s+Fire\s+Damage/i;
    case 'cold_damage':
      return /(?:Adds\s+)?\d+(?:-\d+)?\s+Cold\s+Damage/i;
    case 'poison_damage':
      return /(?:Adds\s+)?\d+(?:-\d+)?\s+Poison\s+Damage/i;
    case 'life':
      return /(?:\+)?\d+\s+(?:to\s+)?Life/i;
    case 'mana':
      return /(?:\+)?\d+\s+(?:to\s+)?Mana/i;
    case 'defense':
      return /(?:\+)?\d+\s+Defense(?!\s+vs\.)/i;
    case 'attack_rating':
      return /(?:\+)?\d+\s+(?:to\s+)?Attack\s+Rating/i;
    case 'magic_find':
      return /\d+%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i;
    case 'all_resistances':
      return /All\s+Resistances?\s+(?:\+)?\d+%?/i;
    case 'fire_resist':
      return /Fire\s+Resist\s+(?:\+)?\d+%?/i;
    case 'cold_resist':
      return /Cold\s+Resist\s+(?:\+)?\d+%?/i;
    case 'lightning_resist':
      return /Lightning\s+Resist\s+(?:\+)?\d+%?/i;
    case 'poison_resist':
      return /Poison\s+Resist\s+(?:\+)?\d+%?/i;
    case 'strength':
      return /(?:\+)?\d+\s+to\s+Strength/i;
    case 'dexterity':
      return /(?:\+)?\d+\s+to\s+Dexterity/i;
    case 'vitality':
      return /(?:\+)?\d+\s+to\s+Vitality/i;
    case 'energy':
      return /(?:\+)?\d+\s+to\s+Energy/i;
    default:
      return null;
  }
}

// Extract effects that don't stack (like Knockback, requirements reduction, etc.)
extractNonStackableEffects(statsText) {
  const effects = [];
  const lines = statsText.split(',').map(line => line.trim());
  
  const nonStackablePatterns = [
    /Knockback/i,
    /Requirements?\s+[-+]?\d+%?/i,
    /Prevent\s+Monster\s+Heal/i,
    /Regenerate\s+Mana\s+\d+%?/i,
    /\d+%\s+Chance\s+of/i,
    /\d+%\s+Life\s+Stolen/i,
    /\d+%\s+Mana\s+Stolen/i,
    /\d+%\s+Enhanced\s+Damage/i,
    /\d+%\s+Increased\s+Attack\s+Speed/i,
    /\d+%\s+Faster\s+Hit\s+Recovery/i,
    /\d+%\s+Faster\s+Block\s+Rate/i,
    /Attacker\s+Takes\s+Damage/i,
    /Physical\s+Damage\s+Taken\s+Reduced/i,
    /Magic\s+Damage\s+Taken\s+Reduced/i,
    /Target\s+Defense/i,
    /Light\s+Radius/i,
    /Replenish\s+Life/i,
    /Damage\s+(?:vs\.?|to)\s+/i
  ];
  
  lines.forEach(line => {
    const cleanLine = line.replace(/<[^>]*>/g, '').trim();
    
    // Skip if it matches any stackable pattern we already handle
    const stackablePatterns = [
      /(?:Adds\s+)?\d+(?:-\d+)?\s+(?:Lightning|Fire|Cold|Poison)\s+Damage/i,
      // /(?:\+)?\d+\s+Poison\s+Damage/i,
      /(?:\+)?\d+\s+(?:to\s+)?(?:Life|Mana|Defense|Attack\s+Rating)/i,
      /\d+%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i,
      /(?:All\s+Resistances?|Fire|Cold|Lightning|Poison)\s+Resist/i,
      /(?:\+)?\d+\s+to\s+(?:Strength|Dexterity|Vitality|Energy)/i
    ];
    
    const isStackable = stackablePatterns.some(pattern => pattern.test(cleanLine));
    if (isStackable) return;
    
    // Check if it's a non-stackable effect
    const isNonStackable = nonStackablePatterns.some(pattern => pattern.test(cleanLine));
    if (isNonStackable && cleanLine) {
      effects.push(cleanLine);
    }
  });
  
  return effects;
}

// Helper to get section dropdown ID (existing method from your code)
getSectionDropdownId(section) {
  const mapping = {
    'weapon': 'weapons-dropdown',
    'helm': 'helms-dropdown', 
    'armor': 'armors-dropdown',
    'shield': 'offs-dropdown',        // ✅ FIXED: was missing proper mapping
    'gloves': 'gloves-dropdown',      // ✅ FIXED: was missing proper mapping  
    'belts': 'belts-dropdown',        // ✅ FIXED: was missing proper mapping
    'boots': 'boots-dropdown',        // ✅ FIXED: was missing proper mapping
    'ringone': 'ringsone-dropdown',   // ✅ FIXED: was missing proper mapping
    'ringtwo': 'ringstwo-dropdown',   // ✅ FIXED: was missing proper mapping
    'amulet': 'amulets-dropdown'
  };
  return mapping[section] || '';
}

// ALSO add this method right after getSectionDropdownId to fix the info div mapping:

getSectionInfoId(section) {
  const mapping = {
    'weapon': 'weapon-info',
    'helm': 'helm-info',
    'armor': 'armor-info', 
    'shield': 'off-info',           // ✅ Note: shield uses 'off-info' not 'shield-info'
    'gloves': 'glove-info',         // ✅ Note: gloves uses 'glove-info' not 'gloves-info'
    'belts': 'belt-info',           // ✅ Note: belts uses 'belt-info' not 'belts-info'
    'boots': 'boot-info',           // ✅ Note: boots uses 'boot-info' not 'boots-info'
    'ringone': 'ringsone-info',     // ✅ Should work as-is
    'ringtwo': 'ringstwo-info',     // ✅ Should work as-is
    'amulet': 'amulet-info'
  };
  return mapping[section] || '';
}

// Enhanced styling for stacked properties
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
      
      .level-requirement-warning {
        color: #ff6b6b !important;
        font-weight: bold !important;
        font-size: 12px;
        margin-bottom: 5px;
      }
    </style>
  `;
  
  if (!document.getElementById('socket-stacking-styles')) {
    document.head.insertAdjacentHTML('beforeend', styles);
  }
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
     if (this.isInitializing) {
    console.log('🚫 Skipping calculation during initialization...');
    return;
  }
   console.trace();
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
 
  

  this.resetAllStats();
  

  this.calculateBaseStats();
  

  this.calculateEquipmentStats();
  
 
  this.calculateSocketStats();
  

  this.updateAllStatsDisplays();
  
 
  console.log('✅ Final attribute bonuses applied:', {
    strength: this.stats.strength,
    dexterity: this.stats.dexterity,
    vitality: this.stats.vitality,
    energy: this.stats.energy
  });
  
  console.log('✅ Stats recalculation complete!');
}


resetAllStats() {
  console.log('🧹 Resetting all stats to zero...');
   console.log('🧹 BEFORE RESET - strength:', this.stats.strength, 'dexterity:', this.stats.dexterity);
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
  
const allSockets = document.querySelectorAll('.socket-slot.filled');
allSockets.forEach(socket => {
  delete socket.dataset.alreadyProcessed;
});

  console.log('✅ All stats reset to defaults');
   console.log('🧹 AFTER RESET - strength:', this.stats.strength, 'dexterity:', this.stats.dexterity);
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
      
  if (socket.dataset.alreadyProcessed === 'true') {
        console.log(`🚫 Socket ${index} already processed, skipping...`);
        return; // Skip this socket
      }
      


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
     console.log('💎 === PARSING SOCKET STATS ===');
  console.log('💎 Section:', section);
  console.log('💎 Stats string:', statsString);
  console.log('💎 BEFORE parsing - strength:', this.stats.strength, 'dexterity:', this.stats.dexterity);
  


  const statLines = statsString.split(/[,\n]/).map(s => s.trim()).filter(s => s);
  
  statLines.forEach(statLine => {
    if (statLine.includes('Requirements') || statLine.includes('vs.')) {
  console.log(`🚫 Skipping non-trackable stat: "${statLine}"`);
  return; 
}
    
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
    