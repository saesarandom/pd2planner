// Clean Socket System - Fixed Version
class SocketSystem {
  constructor() {
    this.currentSocket = null;
    this.isInitialized = false;
    this.socketData = {
      gems: {
        // Sapphires
        'chipped-sapphire': { 
          name: 'Chipped Sapphire', 
          img: 'img/chippedsapphire.png', 
          stats: { 
            weapon: '+1-3 Cold Damage', 
            helm: '+10 to Mana', 
            armor: '+10 to Mana', 
            shield: 'Cold Resist +12%' 
          }
        },
        'flawed-sapphire': { 
          name: 'Flawed Sapphire', 
          img: 'img/flawedsapphire.png', 
          stats: { 
            weapon: '+3-5 Cold Damage', 
            helm: '+17 to Mana', 
            armor: '+17 to Mana', 
            shield: 'Cold Resist +16%' 
          }
        },
        'sapphire': { 
          name: 'Sapphire', 
          img: 'img/sapphire.png', 
          stats: { 
            weapon: '+4-7 Cold Damage', 
            helm: '+24 to Mana', 
            armor: '+24 to Mana', 
            shield: 'Cold Resist +22%' 
          }
        },
        'flawless-sapphire': { 
          name: 'Flawless Sapphire', 
          img: 'img/flawlesssapphire.png', 
          stats: { 
            weapon: '+6-10 Cold Damage', 
            helm: '+31 to Mana', 
            armor: '+31 to Mana', 
            shield: 'Cold Resist +22%' 
          }
        },
        'perfect-sapphire': { 
          name: 'Perfect Sapphire', 
          img: 'img/sapphire.png', 
          stats: { 
            weapon: '+10-14 Cold Damage', 
            helm: '+38 to Mana', 
            armor: '+38 to Mana', 
            shield: 'Cold Resist +22%' 
          }
        },

        // Emeralds
        'chipped-emerald': { 
          name: 'Chipped Emerald', 
          img: 'img/chippedemerald.png', 
          stats: { 
            weapon: '+10 Poison Damage over 3 Seconds', 
            helm: '+3 to Dexterity', 
            armor: '+3 to Dexterity', 
            shield: 'Poison Resist +12%' 
          }
        },
        'flawed-emerald': { 
          name: 'Flawed Emerald', 
          img: 'img/flawedemerald.png', 
          stats: { 
            weapon: '+20 Poison Damage over 4 Seconds', 
            helm: '+4 to Dexterity', 
            armor: '+4 to Dexterity', 
            shield: 'Poison Resist +16%' 
          }
        },
        'emerald': { 
          name: 'Emerald', 
          img: 'img/emerald.png', 
          stats: { 
            weapon: '+40 Poison Damage over 5 Seconds', 
            helm: '+6 to Dexterity', 
            armor: '+6 to Dexterity', 
            shield: 'Poison Resist +22%' 
          }
        },
        'flawless-emerald': { 
          name: 'Flawless Emerald', 
          img: 'img/flawlessemerald.png', 
          stats: { 
            weapon: '+60 Poison Damage over 6 Seconds', 
            helm: '+8 to Dexterity', 
            armor: '+8 to Dexterity', 
            shield: 'Poison Resist +28%' 
          }
        },
        'perfect-emerald': { 
          name: 'Perfect Emerald', 
          img: 'img/emerald.png', 
          stats: { 
            weapon: '+100 Poison Damage over 7 Seconds', 
            helm: '+10 to Dexterity', 
            armor: '+10 to Dexterity', 
            shield: 'Poison Resist +40%' 
          }
        },

        // Topaz
        'chipped-topaz': { 
          name: 'Chipped Topaz', 
          img: 'img/chippedtopaz.png', 
          stats: { 
            weapon: 'Adds 1-8 Lightning Damage', 
            helm: '9% Better Chance of Getting Magic Items', 
            armor: '9% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +12%' 
          }
        },
        'flawed-topaz': { 
          name: 'Flawed Topaz', 
          img: 'img/flawedtopaz.png', 
          stats: { 
            weapon: 'Adds 1-14 Lightning Damage', 
            helm: '13% Better Chance of Getting Magic Items', 
            armor: '13% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +16%' 
          }
        },
        'topaz': { 
          name: 'Topaz', 
          img: 'img/topaz.png', 
          stats: { 
            weapon: 'Adds 1-22 Lightning Damage', 
            helm: '16% Better Chance of Getting Magic Items', 
            armor: '16% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +22%' 
          }
        },
        'flawless-topaz': { 
          name: 'Flawless Topaz', 
          img: 'img/flawlesstopaz.png', 
          stats: { 
            weapon: 'Adds 1-30 Lightning Damage', 
            helm: '20% Better Chance of Getting Magic Items', 
            armor: '20% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +28%' 
          }
        },
        'perfect-topaz': { 
          name: 'Perfect Topaz', 
          img: 'img/topaz.png', 
          stats: { 
            weapon: 'Adds 1-40 Lightning Damage', 
            helm: '24% Better Chance of Getting Magic Items', 
            armor: '24% Better Chance of Getting Magic Items', 
            shield: 'Lightning Resist +40%' 
          }
        },

        // Rubies
        'chipped-ruby': { 
          name: 'Chipped Ruby', 
          img: 'img/chippedruby.png', 
          stats: { 
            weapon: 'Adds 3-4 Fire Damage', 
            helm: '+10 to Life', 
            armor: '+10 to Life', 
            shield: 'Fire Resist +12%' 
          }
        },
        'flawed-ruby': { 
          name: 'Flawed Ruby', 
          img: 'img/flawedruby.png', 
          stats: { 
            weapon: 'Adds 5-8 Fire Damage', 
            helm: '+17 to Life', 
            armor: '+17 to Life', 
            shield: 'Fire Resist +16%' 
          }
        },
        'ruby': { 
          name: 'Ruby', 
          img: 'img/ruby.png', 
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
          stats: { 
            weapon: 'Adds 10-16 Fire Damage', 
            helm: '+31 to Life', 
            armor: '+31 to Life', 
            shield: 'Fire Resist +28%' 
          }
        },
        'perfect-ruby': { 
          name: 'Perfect Ruby', 
          img: 'img/ruby.png', 
          stats: { 
            weapon: 'Adds 15-20 Fire Damage', 
            helm: '+38 to Life', 
            armor: '+38 to Life', 
            shield: 'Fire Resist +40%' 
          }
        },

        // Amethyst
        'chipped-amethyst': { 
          name: 'Chipped Amethyst', 
          img: 'img/chippedamethyst.png', 
          stats: { 
            weapon: '+40 to Attack Rating', 
            helm: '+3 to Strength', 
            armor: '+3 to Strength', 
            shield: '+8 Defense' 
          }
        },
        'flawed-amethyst': { 
          name: 'Flawed Amethyst', 
          img: 'img/flawedamethyst.png', 
          stats: { 
            weapon: '+60 to Attack Rating', 
            helm: '+4 to Strength', 
            armor: '+4 to Strength', 
            shield: '+12 Defense' 
          }
        },
        'amethyst': { 
          name: 'Amethyst', 
          img: 'img/amethyst.png', 
          stats: { 
            weapon: '+80 to Attack Rating', 
            helm: '+6 to Strength', 
            armor: '+6 to Strength', 
            shield: '+18 Defense' 
          }
        },
        'flawless-amethyst': { 
          name: 'Flawless Amethyst', 
          img: 'img/flawlessamethyst.png', 
          stats: { 
            weapon: '+100 to Attack Rating', 
            helm: '+8 to Strength', 
            armor: '+8 to Strength', 
            shield: '+24 Defense' 
          }
        },
        'perfect-amethyst': { 
          name: 'Perfect Amethyst', 
          img: 'img/amethyst2.png', 
          stats: { 
            weapon: '+150 to Attack Rating', 
            helm: '+10 to Strength', 
            armor: '+10 to Strength', 
            shield: '+30 Defense' 
          }
        },

        // Diamonds
        'chipped-diamond': { 
          name: 'Chipped Diamond', 
          img: 'img/chippeddiamond.png', 
          stats: { 
            weapon: '+28% Damage to Undead', 
            helm: '+20 to Attack Rating', 
            armor: '+20 to Attack Rating', 
            shield: 'All Resistances +6' 
          }
        },
        'flawed-diamond': { 
          name: 'Flawed Diamond', 
          img: 'img/flaweddiamond.png', 
          stats: { 
            weapon: '+34% Damage to Undead', 
            helm: '+40 to Attack Rating', 
            armor: '+40 to Attack Rating', 
            shield: 'All Resistances +8' 
          }
        },
        'diamond': { 
          name: 'Diamond', 
          img: 'img/diamond.png', 
          stats: { 
            weapon: '+44% Damage to Undead', 
            helm: '+60 to Attack Rating', 
            armor: '+60 to Attack Rating', 
            shield: 'All Resistances +11' 
          }
        },
        'flawless-diamond': { 
          name: 'Flawless Diamond', 
          img: 'img/flawlessdiamond.png', 
          stats: { 
            weapon: '+54% Damage to Undead', 
            helm: '+80 to Attack Rating', 
            armor: '+80 to Attack Rating', 
            shield: 'All Resistances +14' 
          }
        },
        'perfect-diamond': { 
          name: 'Perfect Diamond', 
          img: 'img/diamond.png', 
          stats: { 
            weapon: '+68% Damage to Undead', 
            helm: '+100 to Attack Rating', 
            armor: '+100 to Attack Rating', 
            shield: 'All Resistances +19' 
          }
        },

        // Skulls
        'chipped-skull': { 
          name: 'Chipped Skull', 
          img: 'img/chippedskull.png', 
          stats: { 
            weapon: '2% Life Stolen per Hit, 1% Mana Stolen per Hit', 
            helm: 'Regenerate Mana 8%, Replenish Life +2', 
            armor: 'Regenerate Mana 8%, Replenish Life +2', 
            shield: 'Attacker Takes Damage of 4' 
          }
        },
        'flawed-skull': { 
          name: 'Flawed Skull', 
          img: 'img/flawedskull.png', 
          stats: { 
            weapon: '2% Life Stolen per Hit, 2% Mana Stolen per Hit', 
            helm: 'Regenerate Mana 8%, Replenish Life +3', 
            armor: 'Regenerate Mana 8%, Replenish Life +3', 
            shield: 'Attacker Takes Damage of 8' 
          }
        },
        'skull': { 
          name: 'Skull', 
          img: 'img/skull.png', 
          stats: { 
            weapon: '3% Life Stolen per Hit, 2% Mana Stolen per Hit', 
            helm: 'Regenerate Mana 12%, Replenish Life +3', 
            armor: 'Regenerate Mana 12%, Replenish Life +3', 
            shield: 'Attacker Takes Damage of 12' 
          }
        },
        'flawless-skull': { 
          name: 'Flawless Skull', 
          img: 'img/skull.png', 
          stats: { 
            weapon: '3% Life Stolen per Hit, 3% Mana Stolen per Hit', 
            helm: 'Regenerate Mana 12%, Replenish Life +4', 
            armor: 'Regenerate Mana 12%, Replenish Life +4', 
            shield: 'Attacker Takes Damage of 16' 
          }
        },
        'perfect-skull': { 
          name: 'Perfect Skull', 
          img: 'img/skull.png', 
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
          stats: { 
            weapon: '+50 AR, +1 Light Radius', 
            helm: '+15 Defense, +1 Light Radius', 
            armor: '+15 Defense, +1 Light Radius', 
            shield: '+15 Defense, +1 Light Radius' 
          }
        },
        'eld': { 
          name: 'Eld Rune', 
          img: 'img/eldrune.png', 
          stats: { 
            weapon: '+75% Damage to Undead, +50 to Attack Rating against Undead', 
            helm: '15% Slower Stamina Drain', 
            armor: '15% Slower Stamina Drain', 
            shield: '7% Increased Chance of Blocking' 
          }
        },
        'tir': { 
          name: 'Tir Rune', 
          img: 'img/tirrune.png', 
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
            weapon: '20% Enhanced Damage', 
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
        },
        'rare-jewel2': { 
          name: 'Rare Jewel', 
          img: 'img/jewel2.png', 
          stats: { 
            weapon: '+15% Enhanced Damage', 
            helm: '+15% Enhanced Damage', 
            armor: '+15% Enhanced Damage', 
            shield: '+15% Enhanced Damage' 
          }
        },
        'rare-jewel3': { 
          name: 'Rare Jewel', 
          img: 'img/jewel3.png', 
          stats: { 
            weapon: '+15% Enhanced Damage', 
            helm: '+15% Enhanced Damage', 
            armor: '+15% Enhanced Damage', 
            shield: '+15% Enhanced Damage' 
          }
        },
        'rare-jewel4': { 
          name: 'Rare Jewel', 
          img: 'img/jewel4.png', 
          stats: { 
            weapon: '+15% Enhanced Damage', 
            helm: '+15% Enhanced Damage', 
            armor: '+15% Enhanced Damage', 
            shield: '+15% Enhanced Damage' 
          }
        }
      }
    };
    
    this.init();
  }

  
init() {
    // Prevent double initialization
    if (this.isInitialized) {
      console.warn('Socket system already initialized');
      return;
    }
    
    this.cleanup();
    this.createModal();
    this.setupEventListeners();
    
    // OVERRIDE createElement to prevent optgroups
    this.preventOptgroups();
    
    // Remove any existing optgroups with more aggressive timing
    setTimeout(() => this.removeAllOptgroups(), 100);
    setTimeout(() => this.removeAllOptgroups(), 1000);
    setTimeout(() => this.removeAllOptgroups(), 3000);
    
    this.isInitialized = true;
    console.log('Socket system initialized');
  }
  // IMPROVED: More robust filtering with better error handling

   preventOptgroups() {
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      if (tagName.toLowerCase() === 'optgroup') {
        console.log('Blocked optgroup creation');
        return document.createDocumentFragment(); // Return harmless fragment
      }
      return originalCreateElement.call(this, tagName);
    };
  }

  removeAllOptgroups() {
  // Safe fallback if dropdownMap is undefined
  const dropdownIds = [
    'helms-dropdown',
    'armors-dropdown', 
    'weapons-dropdown',
    'offs-dropdown',
    'gloves-dropdown',
    'belts-dropdown',
    'boots-dropdown',
    'ringsone-dropdown',
    'ringstwo-dropdown',
    'amulets-dropdown'
  ];
  
  dropdownIds.forEach(dropdownId => {
    try {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        const optgroups = dropdown.querySelectorAll('optgroup');
        optgroups.forEach(optgroup => {
          // Move options out before removing optgroup
          Array.from(optgroup.children).forEach(option => {
            if (option.tagName === 'OPTION') {
              dropdown.appendChild(option);
            }
          });
          optgroup.remove();
        });
      }
    } catch (error) {
      console.warn(`Could not process dropdown: ${dropdownId}`, error);
    }
  });
}

  filterDropdowns() {
    console.log('Starting dropdown filtering...');
    
    const dropdownMap = {
      helm: 'helms-dropdown',
      armor: 'armors-dropdown',
      weapon: 'weapons-dropdown',
      shield: 'offs-dropdown',
      gloves: 'gloves-dropdown',
      belts: 'belts-dropdown',
      boots: 'boots-dropdown',
      ringsone: 'ringsone-dropdown',
      ringstwo: 'ringstwo-dropdown',
      amulets: 'amulets-dropdown'
    };

    // Check if itemDropdownData exists
    if (typeof itemDropdownData === 'undefined') {
      console.error('itemDropdownData not found! Make sure it is loaded.');
      return;
    }

    let totalRemoved = 0;
    let totalKept = 0;

    Object.entries(dropdownMap).forEach(([category, dropdownId]) => {
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown) {
        console.warn(`Dropdown ${dropdownId} not found`);
        return;
      }

      // Get allowed items from itemDropdownData
      const allowedItems = itemDropdownData[category];
      if (!allowedItems) {
        console.warn(`No items defined for category: ${category}`);
        return;
      }

      // Create set of allowed item names for fast lookup
      const allowedNames = new Set(allowedItems.map(item => item.name));
      
      console.log(`Filtering ${category}: ${allowedNames.size} allowed items`);
      console.log(`Current options in dropdown: ${dropdown.options.length}`);

      // Keep track of what we remove
      let removedFromThis = 0;
      let keptFromThis = 0;

      // Convert to array to avoid live NodeList issues
      const options = Array.from(dropdown.options);
      
      options.forEach(option => {
        // Always keep "None" option
        if (option.value === "" || option.value === "None") {
          keptFromThis++;
          return;
        }

        // Check if item is allowed
        if (!allowedNames.has(option.value)) {
          console.log(`Removing: "${option.value}" from ${category}`);
          option.remove();
          removedFromThis++;
          totalRemoved++;
        } else {
          // Add quality styling to allowed items
          const itemData = allowedItems.find(item => item.name === option.value);
          if (itemData) {
            if (itemData.quality === 'unique') {
              option.style.color = '#D4AF37'; // Gold
              option.style.fontWeight = 'bold';
            } else if (itemData.quality === 'set') {
              option.style.color = '#32CD32'; // Green
              option.style.fontWeight = 'bold';
            }
            keptFromThis++;
            totalKept++;
          } else {
            // Item in allowedNames but no quality data - remove it
            console.log(`Removing item with no quality data: "${option.value}"`);
            option.remove();
            removedFromThis++;
            totalRemoved++;
          }
        }
      });

      console.log(`${category}: Removed ${removedFromThis}, Kept ${keptFromThis}`);
    });

    console.log(`Filtering complete: Removed ${totalRemoved} items, Kept ${totalKept} items`);
  }






  
  cleanup() {
    // Remove existing modal
    const existing = document.getElementById('socketModal');
    if (existing) existing.remove();
    
    // Remove global listeners (they'll be re-added)
    document.removeEventListener('click', this.boundClickHandler);
    document.removeEventListener('click', this.boundModalHandler);
    document.removeEventListener('click', this.boundTabHandler);
    document.removeEventListener('click', this.boundItemHandler);
  }

  createModal() {
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
    this.populateItems('gems');
  }

  setupEventListeners() {
    // Socket slot clicks - use event delegation
    this.boundClickHandler = (e) => {
      if (e.target.classList.contains('socket-slot')) {
        this.currentSocket = e.target;
        this.showModal();
      }
    };
    document.addEventListener('click', this.boundClickHandler);

    // Modal close handlers
    this.boundModalHandler = (e) => {
      if (e.target.classList.contains('socket-close') || e.target.id === 'socketModal') {
        this.hideModal();
      }
    };
    document.addEventListener('click', this.boundModalHandler);

    // Tab switching
    this.boundTabHandler = (e) => {
      if (e.target.classList.contains('socket-category-tab')) {
        document.querySelectorAll('.socket-category-tab').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        this.populateItems(e.target.dataset.category);
      }
    };
    document.addEventListener('click', this.boundTabHandler);

    // Socket item selection
    this.boundItemHandler = (e) => {
      if (e.target.closest('.socket-item')) {
        const item = e.target.closest('.socket-item');
        const itemKey = item.dataset.itemKey;
        const category = item.dataset.category;
        this.socketItem(itemKey, category);
      }
    };
    document.addEventListener('click', this.boundItemHandler);

    // Dropdown listeners for socket updates
    this.setupDropdownListeners();
  }

  setupDropdownListeners() {
    const dropdownMap = {
      'weapon': 'weapons-dropdown',
      'helm': 'helms-dropdown',
      'armor': 'armors-dropdown',
      'shield': 'offs-dropdown',
      'gloves': 'gloves-dropdown',
      'belts': 'belts-dropdown',
      'boots': 'boots-dropdown'
    };
    
    Object.entries(dropdownMap).forEach(([section, dropdownId]) => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          this.updateSocketsForItem(section);
        });
      }
    });
  }

  showModal() {
    const modal = document.getElementById('socketModal');
    if (modal) modal.style.display = 'block';
  }

  hideModal() {
    const modal = document.getElementById('socketModal');
    if (modal) modal.style.display = 'none';
    this.currentSocket = null;
  }

  populateItems(category) {
    const grid = document.getElementById('socketItemGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
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

  socketItem(itemKey, category) {
    if (!this.currentSocket) return;
    
    const item = this.socketData[category][itemKey];
    const section = this.currentSocket.closest('.socket-container')?.dataset.section || 'weapon';
    const stat = item.stats[section] || item.stats.weapon;
    
    // Update socket appearance
    this.currentSocket.classList.remove('empty');
    this.currentSocket.classList.add('filled');
    this.currentSocket.innerHTML = `<img src="${item.img}" alt="${item.name}" onerror="this.src='img/placeholder.png'">`;
    
    // Store data
    this.currentSocket.dataset.itemKey = itemKey;
    this.currentSocket.dataset.category = category;
    this.currentSocket.dataset.itemName = item.name;
    this.currentSocket.dataset.stats = stat;
    
    this.hideModal();
    this.updateItemDisplay(section);
  }

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
    
    // Get base item info
    const dropdown = document.getElementById(dropdownIdMap[section]);
    let baseHtml = '';
    
    if (dropdown && dropdown.value && typeof itemList !== 'undefined' && itemList[dropdown.value]) {
      baseHtml = itemList[dropdown.value].description;
    }
    
    // Add socket stats
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    if (sockets.length > 0) {
      sockets.forEach(socket => {
        if (socket.dataset.stats) {
          baseHtml += `<span style="color:rgb(67, 4, 224);">${socket.dataset.stats}</span><br>`;
        }
      });
    }
    
    infoDiv.innerHTML = baseHtml;
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
    
    // If no item selected, hide all sockets
    if (!selectedItem || selectedItem === '') {
      socketGrid.innerHTML = '';
      socketGrid.className = 'socket-grid sockets-0';
      return;
    }
    
    // Get max sockets for the item
    let maxSocketCount = 6; // absolute max
    let startingSocketCount = 2; // default starting amount
    
    try {
      let baseType = '';
      
      if (section === 'weapon' && typeof getBaseWeaponType === 'function') {
        baseType = getBaseWeaponType(selectedItem);
      } else if (typeof itemList !== 'undefined' && itemList[selectedItem]) {
        const itemData = itemList[selectedItem];
        baseType = itemData?.description?.split("<br>")[1]?.trim() || '';
      }
      
      // Get max sockets from maxSockets object (if available)
      if (typeof maxSockets !== 'undefined' && maxSockets[baseType] !== undefined) {
        maxSocketCount = maxSockets[baseType];
      }
      
      // Determine starting socket count based on item's max
      if (maxSocketCount === 0) {
        startingSocketCount = 0;
      } else if (maxSocketCount === 1) {
        startingSocketCount = 1;
      } else {
        startingSocketCount = 2; // Start with 2 if item can have 2+
      }
      
    } catch (e) {
      console.error('Error getting base type:', e);
    }
    
    console.log(`${section}: Starting with ${startingSocketCount} sockets (max: ${maxSocketCount})`);
    
    // Create socket slots based on starting count
    socketGrid.innerHTML = '';
    for (let i = 0; i < startingSocketCount; i++) {
      const socketSlot = document.createElement('div');
      socketSlot.className = 'socket-slot empty';
      socketSlot.dataset.index = i;
      socketGrid.appendChild(socketSlot);
    }
    
    // Store max for the addSocket function
    socketGrid.dataset.maxSockets = maxSocketCount;
    
    // Update grid layout class
    socketGrid.className = `socket-grid sockets-${startingSocketCount}`;
  }

  // Updated addSocket method to respect max limits
  addSocket(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) return;
    
    let socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) return;
    
    const existingSockets = socketGrid.querySelectorAll('.socket-slot').length;
    const maxSocketCount = parseInt(socketGrid.dataset.maxSockets) || 6;
    
    if (existingSockets >= maxSocketCount) {
      console.log(`Max sockets reached for ${section}: ${maxSocketCount}`);
      return;
    }
    
    const newSocket = document.createElement('div');
    newSocket.className = 'socket-slot empty';
    newSocket.dataset.index = existingSockets;
    
    socketGrid.appendChild(newSocket);
    this.updateSocketGrid(section);
    
    console.log(`Added socket to ${section}: ${existingSockets + 1}/${maxSocketCount}`);
  }

  updateSocketGrid(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) return;
    
    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) return;
    
    const socketCount = socketGrid.querySelectorAll('.socket-slot').length;
    
    // Remove all socket count classes
    socketGrid.classList.remove('sockets-0', 'sockets-1', 'sockets-2', 'sockets-3', 'sockets-4', 'sockets-5', 'sockets-6');
    
    // Add appropriate class based on socket count
    socketGrid.classList.add(`sockets-${socketCount}`);
  }
}

// Global function for add socket buttons (backward compatibility)
function addSocket(section) {
  if (window.socketSystem && window.socketSystem.addSocket) {
    window.socketSystem.addSocket(section);
  }
}


// Initialize socket system
function initSockets() {
  // Prevent multiple initializations
  if (window.socketSystem) {
    console.warn('Socket system already exists');
    return;
  }
  
  window.socketSystem = new SocketSystem();
}

// Safe initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSockets);
} else {
  // DOM already loaded
  setTimeout(initSockets, 100); // Small delay to ensure other scripts load
}