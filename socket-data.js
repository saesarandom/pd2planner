// ===================================================================
// PD2 PLANNER - SOCKET DATA MODULE
// Static data and initialization templates for UnifiedSocketSystem
// ===================================================================

window.UnifiedSocketData = {
    // PD2 Open Wounds damage per second by Character Level (1-99)
    openWoundsBaseDamage: [
        3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 26, 28, 30, 32, 33,
        35, 37, 39, 40, 42, 45, 47, 50, 53, 55, 58, 61, 63, 66, 68, 71, 74, 76, 79, 82, 85, 89, 92, 96, 99,
        103, 106, 110, 113, 117, 120, 124, 127, 131, 134, 139, 143, 148, 152, 156, 161, 165, 170, 174, 178, 183, 187, 191, 196, 200,
        205, 209, 213, 218, 222, 227, 231, 235, 240, 244, 249, 253, 257, 262, 266, 271, 275, 279, 284, 288, 293, 297, 301, 306
    ],

    // Character base stats by class
    classStats: {
        'Amazon': { str: 20, dex: 25, vit: 20, enr: 15, arConstant: 5 },
        'Necromancer': { str: 15, dex: 25, vit: 15, enr: 25, arConstant: -10 },
        'Barbarian': { str: 30, dex: 20, vit: 25, enr: 10, arConstant: 20 },
        'Sorceress': { str: 10, dex: 25, vit: 10, enr: 35, arConstant: -15 },
        'Paladin': { str: 25, dex: 20, vit: 25, enr: 15, arConstant: 20 },
        'Assassin': { str: 20, dex: 20, vit: 20, enr: 25, arConstant: 15 },
        'Druid': { str: 15, dex: 20, vit: 25, enr: 20, arConstant: 5 }
    },

    // Equipment mapping for ultra-fast lookups
    equipmentMap: {
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
        'mercweapons-dropdown': { info: 'merc-weapon-info', section: 'mercweapon' },
        'merchelms-dropdown': { info: 'merc-helm-info', section: 'merchelm' },
        'mercarmors-dropdown': { info: 'merc-armor-info', section: 'mercarmor' },
        'mercoffs-dropdown': { info: 'merc-off-info', section: 'mercoff' },
        'mercgloves-dropdown': { info: 'merc-glove-info', section: 'mercgloves' },
        'mercbelts-dropdown': { info: 'merc-belt-info', section: 'mercbelts' },
        'mercboots-dropdown': { info: 'merc-boot-info', section: 'mercboots' }
    },

    baseTypeSocketLimits: {
        'Cap': 2, 'Skull Cap': 2, 'Helm': 3, 'Full Helm': 3, 'Great Helm': 3, 'Crown': 3, 'Mask': 3, 'Bone Helm': 3,
        'War Hat': 2, 'Sallet': 2, 'Casque': 2, 'Basinet': 3, 'Winged Helm': 3, 'Grand Crown': 3, 'Death Mask': 3,
        'Grim Helm': 3, 'Bone Visage': 3, 'Shako': 2, 'Hydraskull': 2, 'Armet': 2, 'Giant Conch': 3, 'Spired Helm': 3,
        'Corona': 3, 'Demonhead': 3, 'Circlet': 2, 'Coronet': 2, 'Tiara': 3, 'Diadem': 3,
        'Quilted Armor': 2, 'Leather Armor': 2, 'Hard Leather Armor': 2, 'Studded Leather': 2, 'Ring Mail': 3,
        'Scale Mail': 2, 'Chain Mail': 2, 'Breast Plate': 3, 'Splint Mail': 2, 'Plate Mail': 2, 'Field Plate': 2,
        'Gothic Plate': 4, 'Full Plate Mail': 4, 'Ancient Armor': 4, 'Light Plate': 3, 'Mage Plate': 3,
        'Ghost Armor': 2, 'Serpentskin Armor': 2, 'Demonhide Armor': 2, 'Trellised Armor': 2, 'Linked Mail': 3,
        'Tigulated Mail': 3, 'Mesh Armor': 3, 'Cuirass': 3, 'Russet Armor': 3, 'Templar Coat': 3, 'Archon Plate': 4,
        'Dusk Shroud': 4, 'Wyrmhide': 4, 'Scarab Husk': 4, 'Wire Fleece': 4, 'Great Hauberk': 4, 'Boneweave': 4,
        'Kraken Shell': 4, 'Lacquered Plate': 4, 'Shadow Plate': 4, 'Sacred Armor': 4,
        'Buckler': 3, 'Small Shield': 3, 'Large Shield': 4, 'Kite Shield': 4, 'Tower Shield': 4, 'Gothic Shield': 4,
        'Bone Shield': 3, 'Spiked Shield': 3, 'Defender': 4, 'Round Shield': 4, 'Scutum': 4, 'Dragon Shield': 4,
        'Monarch': 4, 'Aegis': 4
    },

    jewelPrefixes: {
        'Cinnabar': { effect: '+[5-10]% Enhanced Damage', reqLevel: 1, range: [5, 10] },
        'Rusty': { effect: '+[11-20]% Enhanced Damage', reqLevel: 9, range: [11, 20] },
        'Realgar': { effect: '+[21-30]% Enhanced Damage', reqLevel: 37, range: [21, 30] },
        'Ruby': { effect: '+[31-40]% Enhanced Damage', reqLevel: 58, range: [31, 40] },
        'Stout': { effect: '+[5-8] Defense', reqLevel: 1, range: [5, 8] },
        'Burly': { effect: '+[9-20] Defense', reqLevel: 12, range: [9, 20] },
        'Bone': { effect: '+[21-40] Defense', reqLevel: 24, range: [21, 40] },
        'Ivory': { effect: '+[41-64] Defense', reqLevel: 56, range: [41, 64] },
        'Scarlet': { effect: '+[1-4] to Minimum Damage', reqLevel: 6, range: [1, 4] },
        'Crimson': { effect: '+[5-8] to Minimum Damage', reqLevel: 30, range: [5, 8] },
        'Cardinal': { effect: '+[10-14] to Minimum Damage', reqLevel: 30, range: [10, 14] },
        'Carbuncle': { effect: '+[1-5] to Maximum Damage', reqLevel: 9, range: [1, 5] },
        'Carmine': { effect: '+[6-9] to Maximum Damage', reqLevel: 27, range: [6, 9] },
        'Vermillion': { effect: '+[11-15] to Maximum Damage', reqLevel: 50, range: [11, 15] },
        'Dun': { effect: '+[7-12]% Damage Taken Gained as Mana when Hit', reqLevel: 5, range: [7, 12] },
        'Nickel': { effect: '+[10-20] to Attack Rating', reqLevel: 1, range: [10, 20] },
        'Tin': { effect: '+[21-40] to Attack Rating', reqLevel: 6, range: [21, 40] },
        'Silver': { effect: '+[41-60] to Attack Rating', reqLevel: 18, range: [41, 60] },
        'Argent': { effect: '+[61-100] to Attack Rating', reqLevel: 36, range: [61, 100] },
        'Bright': { effect: '+1 to Light Radius, +10 to Attack Rating', reqLevel: 1, range: [10, 10] },
        'Emerald': { effect: '[3-7]% Better Chance of Getting Magic Items', reqLevel: 12, range: [3, 7] },
        'Zircon': { effect: '+[5-10] to Mana', reqLevel: 2, range: [5, 10] },
        'Jacinth': { effect: '+[11-15] to Mana', reqLevel: 12, range: [11, 15] },
        'Turquoise': { effect: '+[16-20] to Mana', reqLevel: 21, range: [16, 20] },
        'Cerulean': { effect: '+[21-30] to Mana', reqLevel: 41, range: [21, 30] },
        'Shimmering': { effect: 'All Resistances +[5-10]', reqLevel: 12, range: [5, 10] },
        'Scintillating': { effect: 'All Resistances +[11-15]', reqLevel: 26, range: [11, 15] },
        'Lapis': { effect: 'Cold Resist +[5-15]%', reqLevel: 1, range: [5, 15] },
        'Sapphire': { effect: 'Cold Resist +[16-30]%', reqLevel: 14, range: [16, 30] },
        'Garnet': { effect: 'Fire Resist +[5-15]%', reqLevel: 1, range: [5, 15] },
        'Ruby': { effect: 'Fire Resist +[16-30]%', reqLevel: 14, range: [16, 30] },
        'Camphor': { effect: 'Lightning Resist +[5-15]%', reqLevel: 1, range: [5, 15] },
        'Ambergris': { effect: 'Lightning Resist +[16-30]%', reqLevel: 14, range: [16, 30] },
        'Beryl': { effect: 'Poison Resist +[5-15]%', reqLevel: 1, range: [5, 15] },
        'Jade': { effect: 'Poison Resist +[16-30]%', reqLevel: 14, range: [16, 30] },
        'Aureolic': { effect: '[1-3] Mana After Each Kill', reqLevel: 9, range: [1, 3] },
        'Diamond': { effect: '[25-50] to Attack Rating against Demons', reqLevel: 19, range: [25, 50] },
        'Pearl': { effect: '[25-50] to Attack Rating against Undead', reqLevel: 13, range: [25, 50] },
        'Cultists': { effect: '5% Chance of Open Wounds, +[30-40] Open Wounds Damage per Second', reqLevel: 25, range: [30, 40] },
        'Bloodthirsters': { effect: '5% Chance of Open Wounds, +[65-85] Open Wounds Damage per Second', reqLevel: 45, range: [65, 85] },
        'Gorelusts': { effect: '5% Chance of Open Wounds, +[95-125] Open Wounds Damage per Second', reqLevel: 65, range: [95, 125] },
        'Blood Sucking': { effect: '[1-3] Life After Each Kill', reqLevel: 26, range: [1, 3] }
    },

    jewelSuffixes: {
        'Malice': { effect: 'Attacker Takes Damage of [30-40]', reqLevel: 29, range: [30, 40] },
        'Fervor': { effect: '+15% Increased Attack Speed', reqLevel: 31, range: [15, 15] },
        'Frigidity': { effect: 'Adds [1-1] to [3-5] Cold Damage', reqLevel: 12, minRange: [1, 1], maxRange: [3, 5] },
        'Icicle': { effect: 'Adds [2-3] to [6-10] Cold Damage', reqLevel: 29, minRange: [2, 3], maxRange: [6, 10] },
        'Glacier': { effect: 'Adds [4-5] to [11-15] Cold Damage', reqLevel: 50, minRange: [4, 5], maxRange: [11, 15] },
        'Passion': { effect: 'Adds [1-3] to [6-10] Fire Damage', reqLevel: 11, minRange: [1, 3], maxRange: [6, 10] },
        'Fire': { effect: 'Adds [4-10] to [11-30] Fire Damage', reqLevel: 28, minRange: [4, 10], maxRange: [11, 30] },
        'Burning': { effect: 'Adds [11-25] to [31-50] Fire Damage', reqLevel: 49, minRange: [11, 25], maxRange: [31, 50] },
        'Ennui': { effect: 'Adds [1-1] to [10-20] Lightning Damage', reqLevel: 11, minRange: [1, 1], maxRange: [10, 20] },
        'Lightning': { effect: 'Adds [1-1] to [21-60] Lightning Damage', reqLevel: 28, minRange: [1, 1], maxRange: [21, 60] },
        'Thunder': { effect: 'Adds [1-1] to [61-100] Lightning Damage', reqLevel: 49, minRange: [1, 1], maxRange: [61, 100] },
        'Ire': { effect: '+[2-5] to Maximum Damage', reqLevel: 3, range: [2, 5] },
        'Wrath': { effect: '+[6-10] to Maximum Damage', reqLevel: 8, range: [6, 10] },
        'Carnage': { effect: '+[11-15] to Maximum Damage', reqLevel: 18, range: [11, 15] },
        'Joyfulness': { effect: '+[1-4] to Minimum Damage', reqLevel: 3, range: [1, 4] },
        'Bliss': { effect: '+[5-10] to Minimum Damage', reqLevel: 37, range: [5, 10] },
        'Envy': { effect: 'Adds 20 Poison Damage', reqLevel: 1, range: [20, 20] },
        'Daring': { effect: '+[1-3] to Dexterity', reqLevel: 1, range: [1, 3] },
        'Truth': { effect: '+7% Faster Hit Recovery', reqLevel: 36, range: [7, 7] },
        'Virility': { effect: '+[1-4] to Strength', reqLevel: 13, range: [1, 4] }
    },

    // Main Socket Database
    socketData: {
        gems: {
            'chipped-topaz': { name: 'Chipped Topaz', img: 'img/chippedtopaz.png', levelReq: 1, stats: { weapon: 'Adds 1-8 Lightning Damage', helm: '9% Better Chance of Getting Magic Items', armor: '9% Better Chance of Getting Magic Items', shield: 'Lightning Resist +40%' } },
            'flawed-topaz': { name: 'Flawed Topaz', img: 'img/flawedtopaz.png', levelReq: 5, stats: { weapon: 'Adds 1-14 Lightning Damage', helm: '13% Better Chance of Getting Magic Items', armor: '13% Better Chance of Getting Magic Items', shield: 'Lightning Resist +40%' } },
            'topaz': { name: 'Topaz', img: 'img/topaz.png', levelReq: 12, stats: { weapon: 'Adds 1-22 Lightning Damage', helm: '16% Better Chance of Getting Magic Items', armor: '16% Better Chance of Getting Magic Items', shield: 'Lightning Resist +40%' } },
            'flawless-topaz': { name: 'Flawless Topaz', img: 'img/flawlesstopaz.png', levelReq: 15, stats: { weapon: 'Adds 1-30 Lightning Damage', helm: '20% Better Chance of Getting Magic Items', armor: '20% Better Chance of Getting Magic Items', shield: 'Lightning Resist +40%' } },
            'perfect-topaz': { name: 'Perfect Topaz', img: 'img/perfecttopaz2.png', levelReq: 18, stats: { weapon: 'Adds 1-40 Lightning Damage', helm: '24% Better Chance of Getting Magic Items', armor: '24% Better Chance of Getting Magic Items', shield: 'Lightning Resist +40%' } },
            'chipped-ruby': { name: 'Chipped Ruby', img: 'img/chippedruby.png', levelReq: 1, stats: { weapon: 'Adds 3-4 Fire Damage', helm: '+10 to Life', armor: '+10 to Life', shield: 'Fire Resist +12%' } },
            'flawed-ruby': { name: 'Flawed ruby', img: 'img/flawedruby.png', levelReq: 5, stats: { weapon: 'Adds 5-8 Fire Damage', helm: '+17 to Life', armor: '+17 to Life', shield: 'Fire Resist +16%' } },
            'ruby': { name: 'ruby', img: 'img/ruby.png', levelReq: 12, stats: { weapon: 'Adds 8-12 Fire Damage', helm: '+24 to Life', armor: '+24 to Life', shield: 'Fire Resist +22%' } },
            'flawless-ruby': { name: 'Flawless Ruby', img: 'img/flawlessruby.png', levelReq: 15, stats: { weapon: 'Adds 10-16 Fire Damage', helm: '+31 to Life', armor: '+31 to Life', shield: 'Fire Resist +28%' } },
            'perfect-ruby': { name: 'Perfect Ruby', img: 'img/perfectruby2.png', levelReq: 18, stats: { weapon: 'Adds 15-20 Fire Damage', helm: '+38 to Life', armor: '+38 to Life', shield: 'Fire Resist +40%' } },
            'chipped-sapphire': { name: 'Chipped Sapphire', img: 'img/chippedsapphire.png', levelReq: 1, stats: { weapon: 'Adds 1-3 Cold Damage', helm: '+10 to Mana', armor: '+10 to Mana', shield: 'Cold Resist +12%' } },
            'flawed-sapphire': { name: 'Flawed Sapphire', img: 'img/flawedsapphire.png', levelReq: 5, stats: { weapon: 'Adds 3-5 Cold Damage', helm: '+17 to Mana', armor: '+17 to Mana', shield: 'Cold Resist +16%' } },
            'sapphire': { name: 'Sapphire', img: 'img/sapphire.png', levelReq: 12, stats: { weapon: 'Adds 4-7 Cold Damage', helm: '+24 to Mana', armor: '+24 to Mana', shield: 'Cold Resist +22%' } },
            'flawless-sapphire': { name: 'Flawless Sapphire', img: 'img/flawlesssapphire.png', levelReq: 15, stats: { weapon: 'Adds 6-10 Cold Damage', helm: '+31 to Mana', armor: '+31 to Mana', shield: 'Cold Resist +28%' } },
            'perfect-sapphire': { name: 'Perfect Sapphire', img: 'img/perfectsapphire2.png', levelReq: 18, stats: { weapon: 'Adds 10-14 Cold Damage', helm: '+38 to Mana', armor: '+38 to Mana', shield: 'Cold Resist +40%' } },
            'perfect-emerald': { name: 'Perfect Emerald', img: 'img/perfectemerald.png', levelReq: 18, stats: { weapon: 'Adds 100-100 Poison Damage over 7 Seconds', helm: '+10 to Dexterity', armor: '+10 to Dexterity', shield: 'Poison Resist +40%' } },
            'perfect-amethyst': { name: 'Perfect Amethyst', img: 'img/perfectamethyst.png', levelReq: 18, stats: { weapon: '+150 to Attack Rating', helm: '+10 to Strength', armor: '+10 to Strength', shield: '+30 Defense' } },
            'perfect-diamond': { name: 'Perfect Diamond', img: 'img/perfectdiamond.png', levelReq: 18, stats: { weapon: '+68% Damage to Undead', helm: '+100 to Attack Rating', armor: '+100 to Attack Rating', shield: 'All Resistances +19%' } },
            'perfect-skull': { name: 'Perfect Skull', img: 'img/perfectskull2.png', levelReq: 18, stats: { weapon: '4% Life Stolen per Hit, 3% Mana Stolen per Hit', helm: 'Regenerate Mana 19%, Replenish Life +5', armor: 'Regenerate Mana 19%, Replenish Life +5', shield: 'Attacker Takes Damage of 20' } }
        },
        runes: {
            'el': { name: 'El Rune', img: 'img/elrune.png', levelReq: 11, stats: { weapon: '+50 Attack Rating, +1 Light Radius', helm: '+15 Defense, +1 Light Radius', armor: '+15 Defense, +1 Light Radius', shield: '+15 Defense, +1 Light Radius' } },
            'eld': { name: 'Eld Rune', img: 'img/eldrune.png', levelReq: 11, stats: { weapon: '+75% Damage vs Undead, +50 Attack Rating vs Undead', helm: '15% Slower Stamina Drain', armor: '15% Slower Stamina Drain', shield: '7% Increased Chance of Blocking' } },
            'tir': { name: 'Tir Rune', img: 'img/tirrune.png', levelReq: 13, stats: { weapon: '+2 to Mana after each Kill', helm: '+2 to Mana after each Kill', armor: '+2 to Mana after each Kill', shield: '+2 to Mana after each Kill' } },
            'nef': { name: 'Nef Rune', img: 'img/nefrune.png', levelReq: 13, stats: { weapon: 'Knockback', helm: '+30 Defense vs. Missile', armor: '+30 Defense vs. Missile', shield: '+30 Defense vs. Missile' } },
            'eth': { name: 'Eth Rune', img: 'img/ethrune.png', levelReq: 15, stats: { weapon: '-25% Target Defense', helm: 'Regenerate Mana 15%', armor: 'Regenerate Mana 15%', shield: 'Regenerate Mana 15%' } },
            'ith': { name: 'Ith Rune', img: 'img/ithrune.png', levelReq: 15, stats: { weapon: '+9 to Maximum Damage', helm: '15% Damage Taken Gained as Mana when Hit', armor: '15% Damage Taken Gained as Mana when Hit', shield: '15% Damage Taken Gained as Mana when Hit' } },
            'tal': { name: 'Tal Rune', img: 'img/talrune.png', levelReq: 17, stats: { weapon: '+75 Poison Damage over 5 Seconds', helm: 'Poison Resist +30%', armor: 'Poison Resist +30%', shield: 'Poison Resist +35%' } },
            'ral': { name: 'Ral Rune', img: 'img/ralrune.png', levelReq: 19, stats: { weapon: 'Adds 5-30 Fire Damage', helm: 'Fire Resist +30%', armor: 'Fire Resist +30%', shield: 'Fire Resist +35%' } },
            'ort': { name: 'Ort Rune', img: 'img/ortrune.png', levelReq: 21, stats: { weapon: 'Adds 1-50 Lightning Damage', helm: 'Lightning Resist +30%', armor: 'Lightning Resist +30', shield: 'Lightning Resist +35%' } },
            'thul': { name: 'Thul Rune', img: 'img/thulrune.png', levelReq: 23, stats: { weapon: 'Adds 3-14 Cold Damage', helm: 'Cold Resist +30%', armor: 'Cold Resist +30%', shield: 'Cold Resist +35%' } },
            'amn': { name: 'Amn Rune', img: 'img/amnrune.png', levelReq: 25, stats: { weapon: '7% Life Stolen per Hit', helm: 'Attacker Takes Damage of 14', armor: 'Attacker Takes Damage of 14', shield: 'Attacker Takes Damage of 14' } },
            'sol': { name: 'Sol Rune', img: 'img/solrune.png', levelReq: 27, stats: { weapon: '+9 to Minimum Damage', helm: 'Physical Damage Taken Reduced by 7', armor: 'Physical Damage Taken Reduced by 7', shield: 'Physical Damage Taken Reduced by 7' } },
            'shael': { name: 'Shael Rune', img: 'img/shaelrune.png', levelReq: 29, stats: { weapon: '+20% Increased Attack Speed', helm: '+20% Faster Hit Recovery', armor: '+20% Faster Hit Recovery', shield: '+20% Faster Block Rate' } },
            'dol': { name: 'Dol Rune', img: 'img/dolrune.png', levelReq: 31, stats: { weapon: '+20% Enhanced Damage', helm: 'Replenish Life +10', armor: 'Replenish Life +10', shield: 'Replenish Life +10' } },
            'hel': { name: 'Hel Rune', img: 'img/helrune.png', levelReq: 1, stats: { weapon: 'Requirements -20%', helm: 'Requirements -20%', armor: 'Requirements -20%', shield: 'Requirements -20%' } },
            'io': { name: 'Io Rune', img: 'img/iorune.png', levelReq: 35, stats: { weapon: '+10 to Vitality', helm: '+10 to Vitality', armor: '+10 to Vitality', shield: '+10 to Vitality' } },
            'lum': { name: 'Lum Rune', img: 'img/lumrune.png', levelReq: 37, stats: { weapon: '+10 to Energy', helm: '+10 to Energy', armor: '+10 to Energy', shield: '+10 to Energy' } },
            'ko': { name: 'Ko Rune', img: 'img/korune.png', levelReq: 39, stats: { weapon: '+10 to Dexterity', helm: '+10 to Dexterity', armor: '+10 to Dexterity', shield: '+10 to Dexterity' } },
            'fal': { name: 'Fal Rune', img: 'img/falrune.png', levelReq: 41, stats: { weapon: '+10 to Strength', helm: '+10 to Strength', armor: '+10 to Strength', shield: '+10 to Strength' } },
            'lem': { name: 'Lem Rune', img: 'img/lemrune.png', levelReq: 43, stats: { weapon: '75% Extra Gold From Monsters', helm: '50% Extra Gold From Monsters', armor: '50% Extra Gold From Monsters', shield: '50% Extra Gold From Monsters' } },
            'pul': { name: 'Pul Rune', img: 'img/pulrune.png', levelReq: 45, stats: { weapon: '+75% Damage to Demons, +100 to Attack Rating against Demons', helm: '+30% Enhanced Defense', armor: '+30% Enhanced Defense', shield: '+30% Enhanced Defense' } },
            'um': { name: 'Um Rune', img: 'img/umrune.png', levelReq: 47, stats: { weapon: '10% Chance of Open Wounds, +120 Open Wounds Damage per Second', helm: 'All Resistances +15', armor: 'All Resistances +15', shield: 'All Resistances +22' } },
            'mal': { name: 'Mal Rune', img: 'img/malrune.png', levelReq: 49, stats: { weapon: 'Prevent Monster Heal', helm: 'Magic Damage Taken Reduced by 7', armor: 'Magic Damage Taken Reduced by 7', shield: 'Magic Damage Taken Reduced by 7' } },
            'ist': { name: 'Ist Rune', img: 'img/istrune.png', levelReq: 51, stats: { weapon: '30% Better Chance of Getting Magic Items', helm: '30% Better Chance of Getting Magic Items', armor: '30% Better Chance of Getting Magic Items', shield: '30% Better Chance of Getting Magic Items' } },
            'gul': { name: 'Gul Rune', img: 'img/gulrune.png', levelReq: 53, stats: { weapon: '20% Bonus to Attack Rating', helm: '+4% to Maximum Poison Resist', armor: '+4% to Maximum Poison Resist', shield: '+4% to Maximum Poison Resist' } },
            'vex': { name: 'Vex Rune', img: 'img/vexrune.png', levelReq: 55, stats: { weapon: '7% Mana Stolen per Hit', helm: '+4% to Maximum Fire Resist', armor: '+4% to Maximum Fire Resist', shield: '+4% to Maximum Fire Resist' } },
            'ohm': { name: 'Ohm Rune', img: 'img/ohmrune.png', levelReq: 57, stats: { weapon: '+45% Enhanced Damage', helm: '+4% to Maximum Cold Resist', armor: '+4% to Maximum Cold Resist', shield: '+4% to Maximum Cold Resist' } },
            'lo': { name: 'Lo Rune', img: 'img/lorune.png', levelReq: 59, stats: { weapon: '20% Deadly Strike', helm: '+4% to Maximum Lightning Resist', armor: '+4% to Maximum Lightning Resist', shield: '+4% to Maximum Lightning Resist' } },
            'sur': { name: 'Sur Rune', img: 'img/surrune.png', levelReq: 61, stats: { weapon: '+4 Life after each Kill', helm: 'Increase Maximum Mana 5%', armor: 'Increase Maximum Mana 5%', shield: '+50 to Mana' } },
            'ber': { name: 'Ber Rune', img: 'img/berrune.png', levelReq: 63, stats: { weapon: '20% Chance of Crushing Blow', helm: 'Physical Damage Taken Reduced by 5%', armor: 'Physical Damage Taken Reduced by 5%', shield: 'Physical Damage Taken Reduced by 5%' } },
            'jah': { name: 'Jah Rune', img: 'img/jahrune.png', levelReq: 65, stats: { weapon: 'Ignore Target\'s Defense', helm: 'Increase Maximum Life 5%', armor: 'Increase Maximum Life 5%', shield: '+75 to Life' } },
            'cham': { name: 'Cham Rune', img: 'img/chamrune.png', levelReq: 67, stats: { weapon: 'Freezes Target +3', helm: 'Cannot Be Frozen', armor: 'Cannot Be Frozen', shield: 'Cannot Be Frozen' } },
            'zod': { name: 'Zod Rune', img: 'img/zodrune.png', levelReq: 69, stats: { weapon: 'Indestructible', helm: 'Indestructible', armor: 'Indestructible', shield: 'Indestructible' } }
        },
        jewels: {
            'rainbow-facet': { name: 'Rainbow Facet', img: 'img/jewelgreen.png', levelReq: 49, stats: { weapon: 'Dynamic Rainbow Facet Stats', armor: 'Dynamic Rainbow Facet Stats', helm: 'Dynamic Rainbow Facet Stats', shield: 'Dynamic Rainbow Facet Stats' } }
        }
    }
};
