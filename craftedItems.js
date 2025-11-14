// Crafted Items System
// Manages creation, storage, and retrieval of player-crafted items

// Weapon classification for damage display
const twoHandedOnlyWeapons = new Set([
  // Axes (two-handed only)
  'Large Axe', 'Broad Axe', 'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe',
  // Maces/Hammers (two-handed only)
  'Maul', 'Great Maul',
  // Spears & Polearms (two-handed only)
  'Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike', 'Bardiche', 'Voulge', 'Scythe',
  'Poleaxe', 'Halberd', 'War Scythe',
  // Staves (two-handed only)
  'Short Staff', 'Long Staff', 'Gnarled Staff', 'Battle Staff', 'War Staff',
  // Bows/Crossbows (all two-handed only)
  'Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow',
  'Short War Bow', 'Long War Bow', 'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow'
]);

// Weapons that can be wielded both one-handed and two-handed
const versatileWeapons = new Set([
  'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword'
]);

// Item type category definitions for affix matching
const itemTypeCategories = {
  // WeaponP: ALL physical weapons (melee + bows/crossbows)
  'WeaponP': new Set([
    // Axes - ALL tiers
    'Hand Axe', 'Axe', 'Double Axe', 'Military Pick', 'War Axe', 'Large Axe', 'Broad Axe',
    'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe',
    'Hatchet', 'Cleaver', 'Twin Axe', 'Crowbill', 'Naga', 'Military Axe', 'Bearded Axe',
    'Tabar', 'Gothic Axe',
    'Tomahawk', 'Small Crescent', 'Ettin Axe', 'War Spike', 'Berserker Axe', 'Feral Axe',
    'Silver-Edged Axe', 'Decapitator', 'Champion Axe', 'Glorious Axe',

    // Swords - ALL tiers
    'Short Sword', 'Scimitar', 'Sabre', 'Falchion', 'Crystal Sword', 'Broad Sword', 'Long Sword',
    'War Sword', 'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword',
    'Gladius', 'Cutlass', 'Shamshir', 'Tulwar', 'Dimensional Blade', 'Battle Sword', 'Rune Sword', 'Ancient Sword',
    'Espandon', 'Dacian Falx', 'Tusk Sword', 'Gothic Sword', 'Zweihander', 'Executioner Sword',
    'Blade', 'Falcata', 'Ataghan', 'Elegant Blade', 'Hydra Edge', 'Phase Blade', 'Conquest Sword',
    'Cryptic Sword', 'Mythical Sword', 'Legend Sword', 'Highland Blade', 'Balrog Blade', 'Champion Sword',
    'Colossus Sword', 'Colossus Blade',

    // Daggers/Knives - ALL tiers
    'Dagger', 'Dirk', 'Kris', 'Blade', 'Poignard', 'Rondel', 'Cinquedeas', 'Stiletto',
    'Bone Knife', 'Mithril Point', 'Fanged Knife', 'Legend Spike',

    // Maces/Clubs/Hammers - ALL tiers
    'Club', 'Spiked Club', 'Mace', 'Morning Star', 'Flail', 'War Hammer', 'Maul', 'Great Maul',
    'Cudgel', 'Barbed Club', 'Flanged Mace', 'Jagged Star', 'Knout', 'Battle Hammer', 'War Club', 'Martel de Fer',
    'Truncheon', 'Tyrant Club', 'Reinforced Mace', 'Devil Star', 'Scourge', 'Legendary Mallet',
    'Ogre Maul', 'Thunder Maul',

    // Spears/Polearms - ALL tiers
    'Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike', 'Bardiche', 'Voulge', 'Scythe',
    'Poleaxe', 'Halberd', 'War Scythe',
    'War Spear', 'Fuscina', 'War Fork', 'Yari', 'Lance', 'Lochaber Axe', 'Bill',
    'Battle Scythe', 'Partizan', 'Bec-de-Corbin', 'Grim Scythe',
    'Hyperion Spear', 'Stygian Pike', 'Mancatcher', 'Ghost Spear', 'War Pike', 'Ogre Axe',
    'Colossus Voulge', 'Thresher', 'Cryptic Axe', 'Great Poleaxe', 'Giant Thresher',

    // Javelins/Throwing - ALL tiers
    'Javelin', 'Pilum', 'Short Spear', 'Glaive', 'Throwing Spear', 'Throwing Knife', 'Throwing Axe',
    'War Javelin', 'Great Pilum', 'Simbilan', 'Spiculum', 'Harpoon',
    'Hyperion Javelin', 'Stygian Pilum', 'Balrog Spear', 'Ghost Glaive', 'Winged Harpoon',
    'Battle Dart', 'Francisca', 'War Dart', 'Hurlbat', 'Flying Knife', 'Flying Axe',
    'Winged Knife', 'Winged Axe', 'Balanced Knife', 'Balanced Axe',

    // Bows - ALL tiers
    'Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow',
    'Short War Bow', 'Long War Bow',
    'Edge Bow', 'Razor Bow', 'Cedar Bow', 'Double Bow', 'Short Siege Bow', 'Large Siege Bow',
    'Rune Bow', 'Gothic Bow',
    'Spider Bow', 'Blade Bow', 'Shadow Bow', 'Great Bow', 'Diamond Bow', 'Crusader Bow',
    'Ward Bow', 'Hydra Bow',
    'Stag Bow', 'Reflex Bow', 'Maiden Bow', 'Ashwood Bow', 'Ceremonial Bow', 'Matriarchal Bow',
    'Grand Matron Bow',

    // Crossbows - ALL tiers
    'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow',
    'Arbalest', 'Siege Crossbow', 'Ballista', 'Chu-Ko-Nu',
    'Pellet Bow', 'Gorgon Crossbow', 'Colossus Crossbow', 'Demon Crossbow',

    // Scepters - ALL tiers
    'Scepter', 'Grand Scepter', 'War Scepter', 'Rune Scepter', 'Holy Water Sprinkler',
    'Divine Scepter', 'Mighty Scepter', 'Seraph Rod', 'Caduceus',

    // Claws - ALL tiers
    'Katar', 'Wrist Blade', 'Hatchet Hands', 'Cestus', 'Claws', 'Blade Talons', 'Scissors Katar',
    'Quhab', 'Wrist Spike', 'Fascia', 'Hand Scythe', 'Greater Claws', 'Greater Talons',
    'Scissors Quhab', 'Suwayyah', 'Wrist Sword', 'War Fist', 'Battle Cestus', 'Feral Claws',
    'Runic Talons', 'Scissors Suwayyah',

    // Amazon-specific
    'Maiden Javelin', 'Maiden Spear', 'Maiden Pike', 'Ceremonial Javelin', 'Ceremonial Spear',
    'Ceremonial Pike', 'Matriarchal Javelin', 'Matriarchal Spear', 'Matriarchal Pike',
  ]),

  // WeaponPS: All WeaponP + Staves (excludes Orb & Wand)
  'WeaponPS': new Set([
    // All from WeaponP
    'Hand Axe', 'Axe', 'Double Axe', 'Military Pick', 'War Axe', 'Large Axe', 'Broad Axe',
    'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe',
    'Hatchet', 'Cleaver', 'Twin Axe', 'Crowbill', 'Naga', 'Military Axe', 'Bearded Axe',
    'Tabar', 'Gothic Axe',
    'Tomahawk', 'Small Crescent', 'Ettin Axe', 'War Spike', 'Berserker Axe', 'Feral Axe',
    'Silver-Edged Axe', 'Decapitator', 'Champion Axe', 'Glorious Axe',
    'Short Sword', 'Scimitar', 'Sabre', 'Falchion', 'Crystal Sword', 'Broad Sword', 'Long Sword',
    'War Sword', 'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword',
    'Gladius', 'Cutlass', 'Shamshir', 'Tulwar', 'Dimensional Blade', 'Battle Sword', 'Rune Sword', 'Ancient Sword',
    'Espandon', 'Dacian Falx', 'Tusk Sword', 'Gothic Sword', 'Zweihander', 'Executioner Sword',
    'Blade', 'Falcata', 'Ataghan', 'Elegant Blade', 'Hydra Edge', 'Phase Blade', 'Conquest Sword',
    'Cryptic Sword', 'Mythical Sword', 'Legend Sword', 'Highland Blade', 'Balrog Blade', 'Champion Sword',
    'Colossus Sword', 'Colossus Blade',
    'Dagger', 'Dirk', 'Kris', 'Poignard', 'Rondel', 'Cinquedeas', 'Stiletto',
    'Bone Knife', 'Mithril Point', 'Fanged Knife', 'Legend Spike',
    'Club', 'Spiked Club', 'Mace', 'Morning Star', 'Flail', 'War Hammer', 'Maul', 'Great Maul',
    'Cudgel', 'Barbed Club', 'Flanged Mace', 'Jagged Star', 'Knout', 'Battle Hammer', 'War Club', 'Martel de Fer',
    'Truncheon', 'Tyrant Club', 'Reinforced Mace', 'Devil Star', 'Scourge', 'Legendary Mallet',
    'Ogre Maul', 'Thunder Maul',
    'Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike', 'Bardiche', 'Voulge', 'Scythe',
    'Poleaxe', 'Halberd', 'War Scythe',
    'War Spear', 'Fuscina', 'War Fork', 'Yari', 'Lance', 'Lochaber Axe', 'Bill',
    'Battle Scythe', 'Partizan', 'Bec-de-Corbin', 'Grim Scythe',
    'Hyperion Spear', 'Stygian Pike', 'Mancatcher', 'Ghost Spear', 'War Pike', 'Ogre Axe',
    'Colossus Voulge', 'Thresher', 'Cryptic Axe', 'Great Poleaxe', 'Giant Thresher',
    'Javelin', 'Pilum', 'Short Spear', 'Glaive', 'Throwing Spear', 'Throwing Knife', 'Throwing Axe',
    'War Javelin', 'Great Pilum', 'Simbilan', 'Spiculum', 'Harpoon',
    'Hyperion Javelin', 'Stygian Pilum', 'Balrog Spear', 'Ghost Glaive', 'Winged Harpoon',
    'Battle Dart', 'Francisca', 'War Dart', 'Hurlbat', 'Flying Knife', 'Flying Axe',
    'Winged Knife', 'Winged Axe', 'Balanced Knife', 'Balanced Axe',
    'Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow',
    'Short War Bow', 'Long War Bow',
    'Edge Bow', 'Razor Bow', 'Cedar Bow', 'Double Bow', 'Short Siege Bow', 'Large Siege Bow',
    'Rune Bow', 'Gothic Bow',
    'Spider Bow', 'Blade Bow', 'Shadow Bow', 'Great Bow', 'Diamond Bow', 'Crusader Bow',
    'Ward Bow', 'Hydra Bow',
    'Stag Bow', 'Reflex Bow', 'Maiden Bow', 'Ashwood Bow', 'Ceremonial Bow', 'Matriarchal Bow',
    'Grand Matron Bow',
    'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow',
    'Arbalest', 'Siege Crossbow', 'Ballista', 'Chu-Ko-Nu',
    'Pellet Bow', 'Gorgon Crossbow', 'Colossus Crossbow', 'Demon Crossbow',
    'Scepter', 'Grand Scepter', 'War Scepter', 'Rune Scepter', 'Holy Water Sprinkler',
    'Divine Scepter', 'Mighty Scepter', 'Seraph Rod', 'Caduceus',
    'Katar', 'Wrist Blade', 'Hatchet Hands', 'Cestus', 'Claws', 'Blade Talons', 'Scissors Katar',
    'Quhab', 'Wrist Spike', 'Fascia', 'Hand Scythe', 'Greater Claws', 'Greater Talons',
    'Scissors Quhab', 'Suwayyah', 'Wrist Sword', 'War Fist', 'Battle Cestus', 'Feral Claws',
    'Runic Talons', 'Scissors Suwayyah',
    'Maiden Javelin', 'Maiden Spear', 'Maiden Pike', 'Ceremonial Javelin', 'Ceremonial Spear',
    'Ceremonial Pike', 'Matriarchal Javelin', 'Matriarchal Spear', 'Matriarchal Pike',

    // + Staves (ALL tiers)
    'Short Staff', 'Long Staff', 'Gnarled Staff', 'Battle Staff', 'War Staff',
    'Jo Staff', 'Quarterstaff', 'Cedar Staff', 'Gothic Staff', 'Rune Staff',
    'Walking Stick', 'Stalagmite', 'Elder Staff', 'Shillelagh', 'Archon Staff',
  ]),

  // Specific weapon subcategories
  'Axe': new Set([
    'Hand Axe', 'Axe', 'Double Axe', 'Military Pick', 'War Axe', 'Large Axe', 'Broad Axe',
    'Battle Axe', 'Great Axe', 'Giant Axe', 'Ancient Axe',
    'Hatchet', 'Cleaver', 'Twin Axe', 'Crowbill', 'Naga', 'Military Axe', 'Bearded Axe',
    'Tabar', 'Gothic Axe',
    'Tomahawk', 'Small Crescent', 'Ettin Axe', 'War Spike', 'Berserker Axe', 'Feral Axe',
    'Silver-Edged Axe', 'Decapitator', 'Champion Axe', 'Glorious Axe'
  ]),

  'Sword': new Set([
    'Short Sword', 'Scimitar', 'Sabre', 'Falchion', 'Crystal Sword', 'Broad Sword', 'Long Sword',
    'War Sword', 'Two-Handed Sword', 'Claymore', 'Giant Sword', 'Bastard Sword', 'Flamberge', 'Great Sword',
    'Gladius', 'Cutlass', 'Shamshir', 'Tulwar', 'Dimensional Blade', 'Battle Sword', 'Rune Sword', 'Ancient Sword',
    'Espandon', 'Dacian Falx', 'Tusk Sword', 'Gothic Sword', 'Zweihander', 'Executioner Sword',
    'Blade', 'Falcata', 'Ataghan', 'Elegant Blade', 'Hydra Edge', 'Phase Blade', 'Conquest Sword',
    'Cryptic Sword', 'Mythical Sword', 'Legend Sword', 'Highland Blade', 'Balrog Blade', 'Champion Sword',
    'Colossus Sword', 'Colossus Blade'
  ]),

  'Mace': new Set([
    'Mace', 'Morning Star', 'Flail', 'War Hammer', 'Flanged Mace', 'Jagged Star', 'Knout',
    'Battle Hammer', 'Reinforced Mace', 'Devil Star', 'Scourge'
  ]),

  'Club': new Set([
    'Club', 'Spiked Club', 'Cudgel', 'Barbed Club', 'War Club', 'Truncheon', 'Tyrant Club'
  ]),

  'Hammer': new Set([
    'War Hammer', 'Maul', 'Great Maul', 'Battle Hammer', 'Martel de Fer', 'Legendary Mallet',
    'Ogre Maul', 'Thunder Maul'
  ]),

  'Spear': new Set([
    'Spear', 'Trident', 'Brandistock', 'Spetum', 'Pike', 'War Spear', 'Fuscina', 'War Fork',
    'Yari', 'Lance', 'Hyperion Spear', 'Stygian Pike', 'Mancatcher', 'Ghost Spear', 'War Pike',
    'Maiden Spear', 'Maiden Pike', 'Ceremonial Spear', 'Ceremonial Pike', 'Matriarchal Spear',
    'Matriarchal Pike'
  ]),

  'Polearm': new Set([
    'Pike', 'Bardiche', 'Voulge', 'Scythe', 'Poleaxe', 'Halberd', 'War Scythe',
    'Lochaber Axe', 'Bill', 'Battle Scythe', 'Partizan', 'Bec-de-Corbin', 'Grim Scythe',
    'Ogre Axe', 'Colossus Voulge', 'Thresher', 'Cryptic Axe', 'Great Poleaxe', 'Giant Thresher'
  ]),

  'Knife': new Set([
    'Dagger', 'Dirk', 'Kris', 'Blade', 'Throwing Knife', 'Poignard', 'Rondel', 'Cinquedeas',
    'Stiletto', 'Bone Knife', 'Mithril Point', 'Fanged Knife', 'Legend Spike'
  ]),

  'Missile Weapon': new Set([
    'Short Bow', 'Hunter\'s Bow', 'Long Bow', 'Composite Bow', 'Short Battle Bow', 'Long Battle Bow',
    'Short War Bow', 'Long War Bow', 'Light Crossbow', 'Crossbow', 'Heavy Crossbow', 'Repeating Crossbow',
    'Edge Bow', 'Razor Bow', 'Cedar Bow', 'Double Bow', 'Short Siege Bow', 'Large Siege Bow',
    'Rune Bow', 'Gothic Bow', 'Arbalest', 'Siege Crossbow', 'Ballista', 'Chu-Ko-Nu',
    'Spider Bow', 'Blade Bow', 'Shadow Bow', 'Great Bow', 'Diamond Bow', 'Crusader Bow',
    'Ward Bow', 'Hydra Bow', 'Pellet Bow', 'Gorgon Crossbow', 'Colossus Crossbow', 'Demon Crossbow',
    'Stag Bow', 'Reflex Bow', 'Maiden Bow', 'Ashwood Bow', 'Ceremonial Bow', 'Matriarchal Bow',
    'Grand Matron Bow'
  ]),

  'Armor': new Set([
    // Normal/Light
    'Quilted Armor', 'Leather Armor', 'Hard Leather Armor', 'Studded Leather', 'Ring Mail', 'Scale Mail',
    'Chain Mail', 'Breast Plate', 'Splint Mail', 'Plate Mail', 'Field Plate', 'Gothic Plate',
    'Full Plate Mail', 'Ancient Armor', 'Light Plate',
    // Exceptional
    'Ghost Armor', 'Serpentskin Armor', 'Demonhide Armor', 'Trellised Armor',
    'Linked Mail', 'Tigulated Mail', 'Mesh Armor', 'Cuirass', 'Russet Armor',
    'Templar Coat', 'Sharktooth Armor', 'Embossed Plate', 'Mage Plate', 'Chaos Armor', 'Ornate Plate',
    // Elite
    'Dusk Shroud', 'Wyrmhide', 'Scarab Husk', 'Wire Fleece', 'Diamond Mail',
    'Loricated Mail', 'Boneweave', 'Great Hauberk', 'Balrog Skin', 'Hellforge Plate',
    'Kraken Shell', 'Lacquered Plate', 'Archon Plate', 'Shadow Plate', 'Sacred Armor'
  ]),

  'Chest': new Set([
    // Normal/Light
    'Quilted Armor', 'Leather Armor', 'Hard Leather Armor', 'Studded Leather', 'Ring Mail', 'Scale Mail',
    'Chain Mail', 'Breast Plate', 'Splint Mail', 'Plate Mail', 'Field Plate', 'Gothic Plate',
    'Full Plate Mail', 'Ancient Armor', 'Light Plate',
    // Exceptional
    'Ghost Armor', 'Serpentskin Armor', 'Demonhide Armor', 'Trellised Armor',
    'Linked Mail', 'Tigulated Mail', 'Mesh Armor', 'Cuirass', 'Russet Armor',
    'Templar Coat', 'Sharktooth Armor', 'Embossed Plate', 'Mage Plate', 'Chaos Armor', 'Ornate Plate',
    // Elite
    'Dusk Shroud', 'Wyrmhide', 'Scarab Husk', 'Wire Fleece', 'Diamond Mail',
    'Loricated Mail', 'Boneweave', 'Great Hauberk', 'Balrog Skin', 'Hellforge Plate',
    'Kraken Shell', 'Lacquered Plate', 'Archon Plate', 'Shadow Plate', 'Sacred Armor'
  ]),

  'Helm': new Set([
    // Normal helms
    'Cap', 'Skull Cap', 'Helm', 'Full Helm', 'Great Helm', 'Crown', 'Mask', 'Bone Helm',
    // Exceptional helms
    'War Hat', 'Sallet', 'Casque', 'Basinet', 'Winged Helm', 'Grand Crown',
    'Death Mask', 'Grim Helm',
    // Elite helms
    'Bone Visage', 'Shako', 'Hydraskull', 'Armet', 'Giant Conch', 'Spired Helm',
    'Corona', 'Demonhead',
    // Circlets (all tiers)
    'Circlet', 'Coronet', 'Tiara', 'Diadem',
    // Druid Helms (all tiers)
    'Wolf Head', 'Hawk Helm', 'Antlers', 'Falcon Mask', 'Spirit Mask',
    'Jawbone Cap', 'Fanged Helm', 'Horned Helm', 'Assault Helmet', 'Avenger Guard',
    'Alpha Helm', 'Jaw Bone', 'Totemic Mask', 'Sky Spirit', 'Blood Spirit',
    'Sun Spirit', 'Earth Spirit', 'Slayer Guard', 'Guardian Crown', 'Sacred Mask',
    // Barbarian Helms (all tiers)
    'Jawbone Visor', 'Lion Helm', 'Rage Mask', 'Carnage Helm', 'Fury Visor',
    'Destroyer Helm', 'Conqueror Crown', 'Targe Helm'
  ]),

  'Circlet': new Set(['Circlet', 'Coronet', 'Tiara', 'Diadem']),

  'Shield': new Set([
    // Normal shields
    'Buckler', 'Small Shield', 'Large Shield', 'Kite Shield', 'Tower Shield', 'Gothic Shield', 'Bone Shield', 'Spiked Shield',
    // Exceptional shields
    'Defender', 'Round Shield', 'Scutum', 'Dragon Shield', 'Pavilion Shield',
    'Ancient Shield', 'Grim Shield', 'Barbed Shield', 'Blade Barrier',
    // Elite shields
    'Troll Nest', 'Ward', 'Aegis', 'Monarch',
    // Paladin Shields (all tiers)
    'Targe', 'Rondache', 'Heraldic Shield', 'Aerin Shield', 'Crown Shield',
    'Akaran Targe', 'Akaran Rondache', 'Protector Shield', 'Gilded Shield',
    'Royal Shield', 'Sacred Targe', 'Sacred Rondache', 'Kurast Shield',
    'Zakarum Shield', 'Vortex Shield',
    // Necromancer Shields (all tiers)
    'Preserved Head', 'Zombie Head', 'Unraveller Head', 'Gargoyle Head',
    'Demon Head', 'Mummified Trophy', 'Fetish Trophy', 'Sexton Trophy',
    'Cantor Trophy', 'Hierophant Trophy', 'Minion Skull', 'Hellspawn Skull',
    'Overseer Skull', 'Succubus Skull', 'Bloodlord Skull'
  ]),

  'Gloves': new Set([
    // Normal
    'Leather Gloves', 'Heavy Gloves', 'Chain Gloves', 'Light Gauntlets', 'Gauntlets',
    // Exceptional
    'Demonhide Gloves', 'Sharkskin Gloves', 'Heavy Bracers', 'Battle Gauntlets', 'War Gauntlets',
    // Elite
    'Bramble Mitts', 'Vampirebone Gloves', 'Vambraces', 'Crusader Gauntlets', 'Ogre Gauntlets'
  ]),

  'Boots': new Set([
    // Normal
    'Boots', 'Heavy Boots', 'Chain Boots', 'Light Plated Boots', 'Greaves',
    // Exceptional
    'Demonhide Boots', 'Sharkskin Boots', 'Mesh Boots', 'Battle Boots', 'War Boots',
    // Elite
    'Wyrmhide Boots', 'Scarabshell Boots', 'Boneweave Boots', 'Mirrored Boots', 'Myrmidon Greaves'
  ]),

  'Belt': new Set([
    // Normal
    'Sash', 'Light Belt', 'Belt', 'Heavy Belt', 'Plated Belt',
    // Exceptional
    'Demonhide Sash', 'Sharkskin Belt', 'Mesh Belt', 'Battle Belt', 'War Belt',
    // Elite
    'Spiderweb Sash', 'Vampirefang Belt', 'Mithril Coil', 'Troll Belt', 'Colossus Girdle'
  ]),

  'Paladin Shield': new Set([
    'Targe', 'Rondache', 'Heraldic Shield', 'Aerin Shield', 'Crown Shield',
    'Akaran Targe', 'Akaran Rondache', 'Protector Shield', 'Gilded Shield',
    'Royal Shield', 'Sacred Targe', 'Sacred Rondache', 'Kurast Shield',
    'Zakarum Shield', 'Vortex Shield'
  ]),

  'Necromancer Shield': new Set([
    'Preserved Head', 'Zombie Head', 'Unraveller Head', 'Gargoyle Head',
    'Demon Head', 'Mummified Trophy', 'Fetish Trophy', 'Sexton Trophy',
    'Cantor Trophy', 'Hierophant Trophy', 'Minion Skull', 'Hellspawn Skull',
    'Overseer Skull', 'Succubus Skull', 'Bloodlord Skull'
  ]),

  'Non-Necromancer Shield': new Set([
    'Buckler', 'Small Shield', 'Large Shield', 'Kite Shield', 'Tower Shield', 'Gothic Shield', 'Bone Shield', 'Spiked Shield',
    'Defender', 'Round Shield', 'Scutum', 'Dragon Shield', 'Pavilion Shield',
    'Ancient Shield', 'Grim Shield', 'Barbed Shield', 'Blade Barrier',
    'Troll Nest', 'Ward', 'Aegis', 'Monarch',
    'Targe', 'Rondache', 'Heraldic Shield', 'Aerin Shield', 'Crown Shield',
    'Akaran Targe', 'Akaran Rondache', 'Protector Shield', 'Gilded Shield',
    'Royal Shield', 'Sacred Targe', 'Sacred Rondache', 'Kurast Shield',
    'Zakarum Shield', 'Vortex Shield'
  ]),

  'Non-Paladin Shield': new Set([
    'Buckler', 'Small Shield', 'Large Shield', 'Kite Shield', 'Tower Shield', 'Gothic Shield', 'Bone Shield', 'Spiked Shield',
    'Defender', 'Round Shield', 'Scutum', 'Dragon Shield', 'Pavilion Shield',
    'Ancient Shield', 'Grim Shield', 'Barbed Shield', 'Blade Barrier',
    'Troll Nest', 'Ward', 'Aegis', 'Monarch',
    'Preserved Head', 'Zombie Head', 'Unraveller Head', 'Gargoyle Head',
    'Demon Head', 'Mummified Trophy', 'Fetish Trophy', 'Sexton Trophy',
    'Cantor Trophy', 'Hierophant Trophy', 'Minion Skull', 'Hellspawn Skull',
    'Overseer Skull', 'Succubus Skull', 'Bloodlord Skull'
  ]),

  'ShieldNC': new Set([
    'Buckler', 'Small Shield', 'Large Shield', 'Kite Shield', 'Tower Shield', 'Gothic Shield', 'Bone Shield', 'Spiked Shield',
    'Defender', 'Round Shield', 'Scutum', 'Dragon Shield', 'Pavilion Shield',
    'Ancient Shield', 'Grim Shield', 'Barbed Shield', 'Blade Barrier',
    'Troll Nest', 'Ward', 'Aegis', 'Monarch'
  ]),

  'HelmNC': new Set([
    'Cap', 'Skull Cap', 'Helm', 'Full Helm', 'Great Helm', 'Crown', 'Mask', 'Bone Helm',
    'War Hat', 'Sallet', 'Casque', 'Basinet', 'Winged Helm', 'Grand Crown',
    'Death Mask', 'Grim Helm', 'Bone Visage', 'Shako', 'Hydraskull', 'Armet',
    'Giant Conch', 'Spired Helm', 'Corona', 'Demonhead',
    'Circlet', 'Coronet', 'Tiara', 'Diadem'
  ]),

  'Non-Druid Helm': new Set([
    'Cap', 'Skull Cap', 'Helm', 'Full Helm', 'Great Helm', 'Crown', 'Mask', 'Bone Helm',
    'War Hat', 'Sallet', 'Casque', 'Basinet', 'Winged Helm', 'Grand Crown',
    'Death Mask', 'Grim Helm', 'Bone Visage', 'Shako', 'Hydraskull', 'Armet',
    'Giant Conch', 'Spired Helm', 'Corona', 'Demonhead',
    'Circlet', 'Coronet', 'Tiara', 'Diadem',
    'Jawbone Visor', 'Lion Helm', 'Rage Mask', 'Carnage Helm', 'Fury Visor',
    'Destroyer Helm', 'Conqueror Crown', 'Targe Helm'
  ]),

  'Non-Barbarian Helm': new Set([
    'Cap', 'Skull Cap', 'Helm', 'Full Helm', 'Great Helm', 'Crown', 'Mask', 'Bone Helm',
    'War Hat', 'Sallet', 'Casque', 'Basinet', 'Winged Helm', 'Grand Crown',
    'Death Mask', 'Grim Helm', 'Bone Visage', 'Shako', 'Hydraskull', 'Armet',
    'Giant Conch', 'Spired Helm', 'Corona', 'Demonhead',
    'Circlet', 'Coronet', 'Tiara', 'Diadem',
    'Wolf Head', 'Hawk Helm', 'Antlers', 'Falcon Mask', 'Spirit Mask',
    'Jawbone Cap', 'Fanged Helm', 'Horned Helm', 'Assault Helmet', 'Avenger Guard',
    'Alpha Helm', 'Jaw Bone', 'Totemic Mask', 'Sky Spirit', 'Blood Spirit',
    'Sun Spirit', 'Earth Spirit', 'Slayer Guard', 'Guardian Crown', 'Sacred Mask'
  ]),

  'Barbarian Helm': new Set([
    'Jawbone Visor', 'Lion Helm', 'Rage Mask', 'Carnage Helm', 'Fury Visor',
    'Destroyer Helm', 'Conqueror Crown', 'Targe Helm'
  ]),

  'Druid Helm': new Set([
    'Wolf Head', 'Hawk Helm', 'Antlers', 'Falcon Mask', 'Spirit Mask',
    'Jawbone Cap', 'Fanged Helm', 'Horned Helm', 'Assault Helmet', 'Avenger Guard',
    'Alpha Helm', 'Jaw Bone', 'Totemic Mask', 'Sky Spirit', 'Blood Spirit',
    'Sun Spirit', 'Earth Spirit', 'Slayer Guard', 'Guardian Crown', 'Sacred Mask'
  ]),

  'Ring': new Set([]),
  'Amulet': new Set([]),
};

// Affix database - Prefixes only (suffixes to be added later)
const affixDatabase = {
  prefixes: {
    // === GROUP 101: Enhanced Defense ===
    'Sturdy': { stats: { edef: { min: 20, max: 30 } }, itemTypes: ['Armor'], reqLvl: 3, group: 101 },
    'Strong': { stats: { edef: { min: 31, max: 40 } }, itemTypes: ['Armor'], reqLvl: 6, group: 101 },
    'Glorious': { stats: { edef: { min: 41, max: 50 } }, itemTypes: ['Armor'], reqLvl: 14, group: 101 },
    'Blessed': { stats: { edef: { min: 51, max: 65 } }, itemTypes: ['Armor'], reqLvl: 18, group: 101 },
    'Saintly': { stats: { edef: { min: 66, max: 80 } }, itemTypes: ['Armor'], reqLvl: 23, group: 101 },
    'Holy': { stats: { edef: { min: 81, max: 100 } }, itemTypes: ['Armor'], reqLvl: 27, group: 101 },
    'Godly': { stats: { edef: { min: 101, max: 200 } }, itemTypes: ['Armor'], reqLvl: 38, group: 101 },
    'Faithful': { stats: { todef: { min: 0, max: 49 } }, itemTypes: ['Gloves', 'Boots', 'Belt', 'Shield'], reqLvl: 22, group: 101 },

    // === GROUP 103: Minimum Damage (Quiver) ===
    'Scarlet': { stats: { mindmg: { min: 1, max: 4 } }, itemTypes: ['Quiver'], reqLvl: 6, group: 103 },
    'Crimson': { stats: { mindmg: { min: 5, max: 8 } }, itemTypes: ['Quiver'], reqLvl: 30, group: 103 },
    'Cardinal': { stats: { mindmg: { min: 10, max: 14 } }, itemTypes: ['Quiver'], reqLvl: 30, group: 103 },

    // === GROUP 104: Maximum Damage (Quiver) ===
    'Carbuncle': { stats: { maxdmg: { min: 1, max: 5 } }, itemTypes: ['Quiver'], reqLvl: 9, group: 104 },
    'Carmine': { stats: { maxdmg: { min: 6, max: 9 } }, itemTypes: ['Quiver'], reqLvl: 27, group: 104 },
    'Vermillion': { stats: { maxdmg: { min: 11, max: 15 } }, itemTypes: ['Quiver'], reqLvl: 50, group: 104 },

    // === GROUP 105: Enhanced Damage ===
    'Jagged': { stats: { edmg: { min: 10, max: 20 } }, itemTypes: ['WeaponP', 'Circlet', 'Quiver'], reqLvl: 1, group: 105 },
    'Deadly': { stats: { edmg: { min: 21, max: 30 } }, itemTypes: ['WeaponP', 'Circlet', 'Quiver'], reqLvl: 3, group: 105 },
    'Vicious': { stats: { edmg: { min: 31, max: 40 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 6, group: 105 },
    'Brutal': { stats: { edmg: { min: 41, max: 50 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 10, group: 105 },
    'Massive': { stats: { edmg: { min: 51, max: 65 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 15, group: 105 },
    'Savage': { stats: { edmg: { min: 66, max: 80 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 19, group: 105 },
    'Merciless': { stats: { edmg: { min: 81, max: 100 } }, itemTypes: ['WeaponP'], reqLvl: 24, group: 105 },
    'Ferocious': { stats: { edmg: { min: 101, max: 200 } }, itemTypes: ['WeaponP'], reqLvl: 33, group: 105 },
    'Cruel': { stats: { edmg: { min: 201, max: 300 } }, itemTypes: ['WeaponP'], reqLvl: 43, group: 105 },
    'Gritty': { stats: { maxdmg: { min: 0, max: 74 } }, itemTypes: ['WeaponP'], reqLvl: 37, group: 105 },
    'Visceral': { stats: { edmg: { min: 301, max: 400 } }, itemTypes: ['Missile Weapon', 'Amazon Javelin', 'Knife', 'Club', 'Tipped Mace', 'Throwing Axe'], reqLvl: 69, group: 105 },
    'Supporting': { stats: { edmg: { min: 10, max: 20 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 18, group: 105 },
    'Reinforcing': { stats: { edmg: { min: 20, max: 40 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 28, group: 105 },
    'Empowering': { stats: { edmg: { min: 40, max: 60 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 38, group: 105 },
    'Bolstering': { stats: { edmg: { min: 60, max: 80 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 48, group: 105 },
    'Fortifying': { stats: { edmg: { min: 80, max: 120 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 58, group: 105 },
    'Embattled': { stats: { edmg: { min: 120, max: 160 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 68, group: 105 },
    'Rampaging': { stats: { edmg: { min: 160, max: 200 } }, itemTypes: ['Chest'], reqLvl: 78, group: 105 },

    // === GROUP 107: Damage Taken Gained as Mana ===
    'Vulpine': { stats: { dmgmana: { min: 7, max: 12 } }, itemTypes: ['Shield', 'Amulet', 'Orb', 'Staff'], reqLvl: 6, group: 107 },
    'Tricky': { stats: { dmgmana: { min: 13, max: 20 } }, itemTypes: ['Orb', 'Staff', 'Shield', 'Amulet'], reqLvl: 21, group: 107 },
    'Devious': { stats: { dmgmana: { min: 21, max: 30 } }, itemTypes: ['Orb', 'Staff', 'Shield', 'Amulet'], reqLvl: 41, group: 107 },

    // === GROUP 108: Heal Stamina ===
    'Tireless': { stats: { healstamina: { min: 10, max: 50 } }, itemTypes: ['Boots'], reqLvl: 1, group: 108 },

    // === GROUP 110: Attack Rating ===
    'Bronze': { stats: { toatt: { min: 10, max: 20 } }, itemTypes: ['WeaponP', 'Ring', 'Circlet', 'Helm', 'Chest', 'Gloves', 'Amulet'], reqLvl: 1, group: 110 },
    'Iron': { stats: { toatt: { min: 21, max: 40 } }, itemTypes: ['WeaponP', 'Ring', 'Circlet', 'Helm', 'Chest', 'Gloves'], reqLvl: 3, group: 110 },
    'Steel': { stats: { toatt: { min: 41, max: 60 } }, itemTypes: ['WeaponP', 'Ring', 'Circlet', 'Helm', 'Chest', 'Gloves'], reqLvl: 6, group: 110 },
    'Silver': { stats: { toatt: { min: 61, max: 80 } }, itemTypes: ['WeaponP', 'Ring', 'Circlet', 'Helm', 'Chest', 'Gloves', 'Quiver'], reqLvl: 9, group: 110 },
    'Gold': { stats: { toatt: { min: 81, max: 100 } }, itemTypes: ['WeaponP', 'Ring', 'Circlet', 'Helm', 'Chest', 'Gloves', 'Quiver'], reqLvl: 12, group: 110 },
    'Platinum': { stats: { toatt: { min: 101, max: 120 } }, itemTypes: ['WeaponP', 'Ring', 'Circlet', 'Helm', 'Chest', 'Gloves', 'Quiver'], reqLvl: 16, group: 110 },
    'Meteoric': { stats: { toatt: { min: 121, max: 150 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 20, group: 110 },
    'Strange': { stats: { toatt: { min: 151, max: 300 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 24, group: 110 },
    'Weird': { stats: { toatt: { min: 301, max: 450 } }, itemTypes: ['WeaponP'], reqLvl: 27, group: 110 },

    // === GROUP 111: Attack Rating + Enhanced Damage ===
    'Sharp': { stats: { toatt: { min: 10, max: 20 }, edmg: { min: 10, max: 20 } }, itemTypes: ['WeaponP'], reqLvl: 3, group: 111 },
    'Fine': { stats: { toatt: { min: 21, max: 40 }, edmg: { min: 21, max: 30 } }, itemTypes: ['WeaponP'], reqLvl: 9, group: 111 },
    "Warrior's": { stats: { toatt: { min: 41, max: 60 }, edmg: { min: 31, max: 40 } }, itemTypes: ['WeaponP'], reqLvl: 13, group: 111 },
    "Soldier's": { stats: { toatt: { min: 61, max: 80 }, edmg: { min: 41, max: 50 } }, itemTypes: ['WeaponP'], reqLvl: 19, group: 111 },
    "Knight's": { stats: { toatt: { min: 81, max: 100 }, edmg: { min: 51, max: 65 } }, itemTypes: ['WeaponP'], reqLvl: 30, group: 111 },
    "Lord's": { stats: { toatt: { min: 101, max: 120 }, edmg: { min: 66, max: 80 } }, itemTypes: ['WeaponP'], reqLvl: 39, group: 111 },
    "King's": { stats: { toatt: { min: 121, max: 150 }, edmg: { min: 81, max: 100 } }, itemTypes: ['WeaponP'], reqLvl: 48, group: 111 },
    "Master's": { stats: { toatt: { min: 151, max: 250 }, edmg: { min: 101, max: 150 } }, itemTypes: ['WeaponP'], reqLvl: 48, group: 111 },
    "Grandmaster's": { stats: { toatt: { min: 251, max: 300 }, edmg: { min: 151, max: 200 } }, itemTypes: ['WeaponP', 'Missile Weapon'], reqLvl: 61, group: 111 },
    'Fool\'s': { stats: { maxdmg: { min: 0, max: 49 }, toatt: { min: 16, max: 1633 } }, itemTypes: ['WeaponP'], reqLvl: 37, group: 111 },
    'Hawkeye': { stats: { toatt: { min: 6, max: 594 } }, itemTypes: ['WeaponP'], reqLvl: 26, group: 111 },
    'Visionary': { stats: { toattbonus: { min: 1, max: 99 } }, itemTypes: ['Helm', 'Missile Weapon'], reqLvl: 18, group: 111 },

    // === GROUP 112: Light Radius ===
    'Glimmering': { stats: { lightrad: { min: 1, max: 1 } }, itemTypes: ['Armor', 'Wand', 'Staff', 'Ring', 'Amulet', 'Orb'], reqLvl: 1, group: 112 },
    'Glowing': { stats: { lightrad: { min: 2, max: 2 } }, itemTypes: ['Armor', 'Wand', 'Staff', 'Ring', 'Amulet', 'Orb'], reqLvl: 4, group: 112 },

    // === GROUP 113: Monster Flee ===
    'Screaming': { stats: { monsterlee: { min: 12, max: 25 } }, itemTypes: ['Missile Weapon', 'Blunt Weapon', 'Knife', 'Claw', 'Orb'], reqLvl: 7, group: 113 },
    'Howling': { stats: { monsterlee: { min: 18, max: 50 } }, itemTypes: ['Missile Weapon', 'Blunt Weapon', 'Knife', 'Claw', 'Orb'], reqLvl: 12, group: 113 },
    'Wailing': { stats: { monsterlee: { min: 25, max: 100 } }, itemTypes: ['Missile Weapon', 'Blunt Weapon', 'Knife', 'Claw', 'Orb'], reqLvl: 13, group: 113 },

    // === GROUP 114: Magic Find ===
    'Felicitous': { stats: { magicfind: { min: 5, max: 10 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Helm'], reqLvl: 3, group: 114 },
    'Fortuitous': { stats: { magicfind: { min: 11, max: 15 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Helm'], reqLvl: 8, group: 114 },

    // === GROUP 115: Mana ===
    "Lizard's": { stats: { tomana: { min: 1, max: 5 } }, itemTypes: ['Chest', 'Helm', 'Shield', 'Belt', 'Ring', 'Amulet', 'Rod', 'Orb'], reqLvl: 1, group: 115 },
    "Snake's": { stats: { tomana: { min: 5, max: 20 } }, itemTypes: ['Shield', 'Rod', 'Belt', 'Ring', 'Amulet', 'Circlet', 'Chest', 'Gloves', 'Boots', 'Quiver'], reqLvl: 4, group: 115 },
    "Serpent's": { stats: { tomana: { min: 11, max: 20 } }, itemTypes: ['Shield', 'Rod', 'Circlet', 'Quiver', 'Belt', 'Ring', 'Amulet', 'Chest', 'Boots', 'Gloves'], reqLvl: 10, group: 115 },
    "Drake's": { stats: { tomana: { min: 21, max: 30 } }, itemTypes: ['Rod', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Quiver'], reqLvl: 15, group: 115 },
    "Dragon's": { stats: { tomana: { min: 31, max: 40 } }, itemTypes: ['Rod', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Chest', 'Boots', 'Gloves', 'Quiver'], reqLvl: 18, group: 115 },
    "Wyrm's": { stats: { tomana: { min: 41, max: 60 } }, itemTypes: ['Rod', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Chest', 'Shield'], reqLvl: 22, group: 115 },
    "Great Wyrm's": { stats: { tomana: { min: 61, max: 90 } }, itemTypes: ['Rod', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Chest', 'Shield'], reqLvl: 29, group: 115 },
    "Bahamut's": { stats: { tomana: { min: 91, max: 120 } }, itemTypes: ['Rod', 'Ring', 'Amulet', 'Orb', 'Circlet'], reqLvl: 37, group: 115 },
    'Mnemonic': { stats: { tomana: { min: 0, max: 74 } }, itemTypes: ['Helm'], reqLvl: 18, group: 115 },

    // === GROUP 116: All Resistances ===
    'Shimmering': { stats: { allres: { min: 3, max: 7 } }, itemTypes: ['Shield', 'Chest', 'Amulet', 'Circlet', 'Helm', 'Ring', 'Quiver'], reqLvl: 4, group: 116 },
    'Rainbow': { stats: { allres: { min: 8, max: 11 } }, itemTypes: ['Shield', 'Chest', 'Amulet', 'Circlet', 'Helm', 'Ring'], reqLvl: 13, group: 116 },
    'Scintillating': { stats: { allres: { min: 12, max: 15 } }, itemTypes: ['Shield', 'Chest', 'Amulet', 'Circlet', 'Helm', 'Ring', 'Quiver'], reqLvl: 21, group: 116 },
    'Prismatic': { stats: { allres: { min: 16, max: 20 } }, itemTypes: ['Shield', 'Chest', 'Amulet', 'Circlet', 'Helm'], reqLvl: 31, group: 116 },
    'Chromatic': { stats: { allres: { min: 21, max: 30 } }, itemTypes: ['Shield', 'Chest', 'Helm', 'Amulet', 'Circlet'], reqLvl: 42, group: 116 },

    // === GROUP 117: Cold Resistance ===
    'Azure': { stats: { coldres: { min: 5, max: 10 } }, itemTypes: ['Armor', 'Weapon', 'Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 3, group: 117 },
    'Lapis': { stats: { coldres: { min: 11, max: 20 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon', 'Quiver'], reqLvl: 9, group: 117 },
    'Cobalt': { stats: { coldres: { min: 21, max: 30 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon', 'Quiver'], reqLvl: 13, group: 117 },
    'Sapphire': { stats: { coldres: { min: 31, max: 40 } }, itemTypes: ['Rod', 'Boots', 'Amulet', 'Orb', 'Circlet', 'Chest', 'Helm', 'Shield'], reqLvl: 18, group: 117 },

    // === GROUP 118: Fire Resistance ===
    'Crimson': { stats: { firres: { min: 5, max: 10 } }, itemTypes: ['Armor', 'Weapon', 'Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 3, group: 118 },
    'Russet': { stats: { firres: { min: 11, max: 20 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon'], reqLvl: 9, group: 118 },
    'Garnet': { stats: { firres: { min: 21, max: 30 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon'], reqLvl: 13, group: 118 },
    'Ruby': { stats: { firres: { min: 31, max: 40 } }, itemTypes: ['Rod', 'Boots', 'Amulet', 'Orb', 'Circlet', 'Chest', 'Helm', 'Shield'], reqLvl: 18, group: 118 },

    // === GROUP 119: Lightning Resistance ===
    'Tangerine': { stats: { ligres: { min: 5, max: 10 } }, itemTypes: ['Armor', 'Weapon', 'Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 3, group: 119 },
    'Ocher': { stats: { ligres: { min: 11, max: 20 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon'], reqLvl: 9, group: 119 },
    'Coral': { stats: { ligres: { min: 21, max: 30 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon'], reqLvl: 13, group: 119 },
    'Amber': { stats: { ligres: { min: 31, max: 40 } }, itemTypes: ['Rod', 'Boots', 'Amulet', 'Orb', 'Circlet', 'Chest', 'Helm', 'Shield'], reqLvl: 18, group: 119 },

    // === GROUP 120: Poison Resistance ===
    'Beryl': { stats: { poisres: { min: 5, max: 10 } }, itemTypes: ['Armor', 'Weapon', 'Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 3, group: 120 },
    'Viridian': { stats: { poisres: { min: 11, max: 20 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon'], reqLvl: 9, group: 120 },
    'Jade': { stats: { poisres: { min: 21, max: 30 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Non-Orb Weapon'], reqLvl: 13, group: 120 },
    'Emerald': { stats: { poisres: { min: 31, max: 40 } }, itemTypes: ['Rod', 'Boots', 'Amulet', 'Orb', 'Circlet', 'Chest', 'Helm', 'Shield'], reqLvl: 18, group: 120 },

    // === GROUP 121: Mana After Each Kill ===
    'Triumphant': { stats: { manaafter: { min: 1, max: 1 } }, itemTypes: ['Weapon', 'Ring', 'Circlet', 'Chest', 'Helm', 'Shield', 'Quiver'], reqLvl: 2, group: 121 },
    'Aureolic': { stats: { manaafter: { min: 1, max: 3 } }, itemTypes: ['Chest', 'Helm', 'Shield', 'Quiver'], reqLvl: 9, group: 121 },
    'Victorious': { stats: { manaafter: { min: 2, max: 5 } }, itemTypes: ['Weapon', 'Circlet', 'Chest', 'Helm', 'Shield', 'Quiver'], reqLvl: 12, group: 121 },

    // === GROUP 122: Sockets ===
    "Mechanist's": { stats: { sockets: { min: 1, max: 2 } }, itemTypes: ['Weapon', 'Shield', 'Helm', 'Chest', 'Circlet'], reqLvl: 7, group: 122 },
    "Artisan's": { stats: { sockets: { min: 3, max: 3 } }, itemTypes: ['Weapon', 'Shield', 'Helm', 'Chest'], reqLvl: 25, group: 122 },
    "Jeweler's": { stats: { sockets: { min: 4, max: 4 } }, itemTypes: ['Weapon', 'Shield', 'Helm', 'Chest'], reqLvl: 47, group: 122 },

    // === GROUP 123: Demon Bonuses ===
    'Lunar': { stats: { dmgtodemon: { min: 10, max: 25 }, toattdemon: { min: 25, max: 50 } }, itemTypes: ['WeaponPS', 'Circlet', 'Quiver'], reqLvl: 1, group: 123 },
    'Arcadian': { stats: { dmgtodemon: { min: 26, max: 50 }, toattdemon: { min: 51, max: 100 } }, itemTypes: ['WeaponPS', 'Circlet', 'Helm', 'Quiver'], reqLvl: 11, group: 123 },
    'Unearthly': { stats: { dmgtodemon: { min: 51, max: 100 }, toattdemon: { min: 101, max: 150 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 18, group: 123 },
    'Astral': { stats: { dmgtodemon: { min: 101, max: 150 }, toattdemon: { min: 151, max: 200 } }, itemTypes: ['WeaponPS'], reqLvl: 26, group: 123 },
    'Elysian': { stats: { dmgtodemon: { min: 151, max: 200 }, toattdemon: { min: 201, max: 300 } }, itemTypes: ['WeaponPS'], reqLvl: 33, group: 123 },
    'Celestial': { stats: { dmgtodemon: { min: 201, max: 300 }, toattdemon: { min: 301, max: 400 } }, itemTypes: ['WeaponPS', 'Missile Weapon'], reqLvl: 41, group: 123 },

    // === GROUP 125: Class-Specific Skills ===
    "Maiden's": { stats: { amazonskills: { min: 1, max: 1 } }, itemTypes: ['Chest', 'ShieldNC', 'HelmNC', 'Amulet', 'Circlet', 'Missile Weapon', 'Spear'], reqLvl: 27, group: 125 },
    "Valkyrie's": { stats: { amazonskills: { min: 2, max: 2 } }, itemTypes: ['Missile Weapon', 'Spear', 'Amulet', 'Circlet'], reqLvl: 42, group: 125 },
    "Fletcher's": { stats: { bowskills: { min: 1, max: 1 } }, itemTypes: ['Missile Weapon', 'Gloves', 'Circlet', 'Quiver', 'Amulet'], reqLvl: 15, group: 125 },
    "Bowyer's": { stats: { bowskills: { min: 2, max: 2 } }, itemTypes: ['Missile Weapon', 'Gloves', 'Circlet', 'Quiver', 'Amulet'], reqLvl: 30, group: 125 },
    "Archer's": { stats: { bowskills: { min: 3, max: 3 } }, itemTypes: ['Missile Weapon', 'Gloves', 'Circlet', 'Quiver', 'Amulet', 'Missile WeaponNC'], reqLvl: 45, group: 125 },
    "Acrobat's": { stats: { amazonmagic: { min: 1, max: 1 } }, itemTypes: ['Gloves', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 15, group: 125 },
    "Gymnast's": { stats: { amazonmagic: { min: 2, max: 2 } }, itemTypes: ['Gloves', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 30, group: 125 },
    "Athlete's": { stats: { amazonmagic: { min: 3, max: 3 } }, itemTypes: ['Gloves', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 45, group: 125 },
    "Angel's": { stats: { firespells: { min: 1, max: 1 } }, itemTypes: ['Chest', 'ShieldNC', 'HelmNC', 'Amulet', 'Circlet', 'Staff', 'Orb'], reqLvl: 27, group: 125 },
    "Arch-Angel's": { stats: { firespells: { min: 2, max: 2 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 42, group: 125 },
    "Burning": { stats: { firespells: { min: 1, max: 1 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Blazing": { stats: { firespells: { min: 2, max: 2 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Volcanic": { stats: { firespells: { min: 3, max: 3 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Sparking": { stats: { lightspells: { min: 1, max: 1 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Charged": { stats: { lightspells: { min: 2, max: 2 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Powered": { stats: { lightspells: { min: 3, max: 3 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Chilling": { stats: { coldspells: { min: 1, max: 1 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Freezing": { stats: { coldspells: { min: 2, max: 2 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Glacial": { stats: { coldspells: { min: 3, max: 3 } }, itemTypes: ['Staff', 'Orb', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Summoner's": { stats: { necromancersummoning: { min: 1, max: 1 } }, itemTypes: ['Chest', 'Non-Paladin Shield', 'HelmNC', 'Amulet', 'Circlet', 'Wand', 'Dagger', 'Necromancer Shield'], reqLvl: 27, group: 125 },
    "Hexing": { stats: { curses: { min: 1, max: 1 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Blighting": { stats: { curses: { min: 2, max: 2 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Accursed": { stats: { curses: { min: 3, max: 3 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Fungal": { stats: { poisonandbone: { min: 1, max: 1 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Dagger', 'Circlet'], reqLvl: 15, group: 125 },
    "Noxious": { stats: { poisonandbone: { min: 2, max: 2 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Dagger', 'Circlet'], reqLvl: 30, group: 125 },
    "Venomous": { stats: { poisonandbone: { min: 3, max: 3 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Dagger', 'Circlet'], reqLvl: 45, group: 125 },
    "Graverobber's": { stats: { necromancersummoning: { min: 1, max: 1 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Vodoun": { stats: { necromancersummoning: { min: 2, max: 2 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Golemlord's": { stats: { necromancersummoning: { min: 3, max: 3 } }, itemTypes: ['Wand', 'Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Monk's": { stats: { paladincombat: { min: 1, max: 1 } }, itemTypes: ['Chest', 'Non-Necromancer Shield', 'HelmNC', 'Amulet', 'Circlet', 'Scepter', 'Paladin Shield', 'Sword', 'Tipped Mace', 'Hammer'], reqLvl: 27, group: 125 },
    "Priest's": { stats: { paladincombat: { min: 2, max: 2 } }, itemTypes: ['Scepter', 'Paladin Shield', 'Sword', 'Tipped Mace', 'Hammer', 'Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 42, group: 125 },
    "Lion Branded": { stats: { paladincombat: { min: 1, max: 1 } }, itemTypes: ['Scepter', 'Sword', 'Tipped Mace', 'Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Hawk Branded": { stats: { paladincombat: { min: 2, max: 2 } }, itemTypes: ['Scepter', 'Sword', 'Tipped Mace', 'Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Rose Branded": { stats: { paladincombat: { min: 3, max: 3 } }, itemTypes: ['Scepter', 'Sword', 'Tipped Mace', 'Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Captain's": { stats: { paladinoffensive: { min: 1, max: 1 } }, itemTypes: ['Scepter', 'Sword', 'Tipped Mace', 'Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Commander's": { stats: { paladinoffensive: { min: 2, max: 2 } }, itemTypes: ['Scepter', 'Sword', 'Tipped Mace', 'Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Marshal's": { stats: { paladinoffensive: { min: 3, max: 3 } }, itemTypes: ['Scepter', 'Sword', 'Tipped Mace', 'Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Preserver's": { stats: { paladindefensive: { min: 1, max: 1 } }, itemTypes: ['Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Warder's": { stats: { paladindefensive: { min: 2, max: 2 } }, itemTypes: ['Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Guardian's": { stats: { paladindefensive: { min: 3, max: 3 } }, itemTypes: ['Non-Necromancer Shield', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Slayer's": { stats: { barbariancombat: { min: 1, max: 1 } }, itemTypes: ['Chest', 'ShieldNC', 'Non-Druid Helm', 'Amulet', 'Circlet', 'Barbarian Helm', 'Axe', 'Any Mace', 'Sword', 'Throwing Knife', 'Two-Handed SpearNC'], reqLvl: 27, group: 125 },
    "Berserker's": { stats: { barbariancombat: { min: 2, max: 2 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Throwing Knife', 'Two-Handed SpearNC', 'Barbarian Helm', 'Amulet', 'Circlet'], reqLvl: 42, group: 125 },
    "Expert's": { stats: { barbariancombat: { min: 1, max: 1 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Non-Druid Helm'], reqLvl: 15, group: 125 },
    "Veteran's": { stats: { barbariancombat: { min: 2, max: 2 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Non-Druid Helm'], reqLvl: 30, group: 125 },
    "Fanatic": { stats: { barbarianmasteries: { min: 1, max: 1 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Barbarian Helm', 'Amulet'], reqLvl: 15, group: 125 },
    "Raging": { stats: { barbarianmasteries: { min: 2, max: 2 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Barbarian Helm', 'Amulet'], reqLvl: 30, group: 125 },
    "Furious": { stats: { barbarianmasteries: { min: 3, max: 3 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Barbarian Helm', 'Amulet'], reqLvl: 45, group: 125 },
    "Sounding": { stats: { warcries: { min: 1, max: 1 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Barbarian Helm', 'Amulet'], reqLvl: 15, group: 125 },
    "Resonant": { stats: { warcries: { min: 2, max: 2 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Barbarian Helm', 'Amulet'], reqLvl: 30, group: 125 },
    "Echoing": { stats: { warcries: { min: 3, max: 3 } }, itemTypes: ['Axe', 'Any Mace', 'Sword', 'Polearm', 'SpearNC', 'Barbarian Helm', 'Amulet'], reqLvl: 45, group: 125 },
    "Shaman's": { stats: { druidsummoning: { min: 1, max: 1 } }, itemTypes: ['Chest', 'ShieldNC', 'Non-Barbarian Helm', 'Amulet', 'Circlet', 'Club', 'Druid Helm'], reqLvl: 27, group: 125 },
    "Hierophant's": { stats: { druidsummoning: { min: 2, max: 2 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 42, group: 125 },
    "Trainer's": { stats: { druidsummoning: { min: 1, max: 1 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Caretaker's": { stats: { druidsummoning: { min: 2, max: 2 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Keeper's": { stats: { druidsummoning: { min: 3, max: 3 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Spiritual": { stats: { shapeshifting: { min: 1, max: 1 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Feral": { stats: { shapeshifting: { min: 2, max: 2 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Communal": { stats: { shapeshifting: { min: 3, max: 3 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Nature's": { stats: { druidelemental: { min: 1, max: 1 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Terra's": { stats: { druidelemental: { min: 2, max: 2 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Gaea's": { stats: { druidelemental: { min: 3, max: 3 } }, itemTypes: ['Club', 'Druid Helm', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Magekiller's": { stats: { traps: { min: 1, max: 1 } }, itemTypes: ['Chest', 'ShieldNC', 'HelmNC', 'Amulet', 'Circlet', 'Claw', 'Dagger'], reqLvl: 27, group: 125 },
    "Witch-hunter's": { stats: { traps: { min: 2, max: 2 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'Circlet'], reqLvl: 42, group: 125 },
    "Entrapping": { stats: { traps: { min: 1, max: 1 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'Circlet'], reqLvl: 15, group: 125 },
    "Trickster's": { stats: { traps: { min: 2, max: 2 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'Circlet'], reqLvl: 30, group: 125 },
    "Cunning": { stats: { traps: { min: 3, max: 3 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'Circlet'], reqLvl: 45, group: 125 },
    "Mentalist's": { stats: { shadowdisciplines: { min: 1, max: 1 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'HelmNC', 'Circlet'], reqLvl: 15, group: 125 },
    "Psychic": { stats: { shadowdisciplines: { min: 2, max: 2 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'HelmNC', 'Circlet'], reqLvl: 30, group: 125 },
    "Shadow": { stats: { shadowdisciplines: { min: 3, max: 3 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'HelmNC', 'Circlet'], reqLvl: 45, group: 125 },
    "Shogukusha's": { stats: { martialarts: { min: 1, max: 1 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'Gloves', 'Circlet'], reqLvl: 15, group: 125 },
    "Sensei's": { stats: { martialarts: { min: 2, max: 2 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'Gloves', 'Circlet'], reqLvl: 30, group: 125 },
    "Kenshi's": { stats: { martialarts: { min: 3, max: 3 } }, itemTypes: ['Claw', 'Dagger', 'Amulet', 'Gloves', 'Circlet'], reqLvl: 45, group: 125 },

    // === GROUP 137: Cold Damage ===
    'Snowy': { stats: { cold: { min: 20, max: 101 } }, itemTypes: ['Weapon', 'Circlet', 'Quiver'], reqLvl: 18, group: 137 },
    'Shivering': { stats: { cold: { min: 37, max: 166 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 26, group: 137 },
    'Boreal': { stats: { cold: { min: 46, max: 256 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 40, group: 137 },
    'Hibernal': { stats: { cold: { min: 60, max: 348 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 60, group: 137 },

    // === GROUP 138: Fire Damage ===
    'Fiery': { stats: { fire: { min: 28, max: 103 } }, itemTypes: ['Weapon', 'Circlet', 'Quiver'], reqLvl: 18, group: 138 },
    'Smoldering': { stats: { fire: { min: 47, max: 161 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 26, group: 138 },
    'Smoking': { stats: { fire: { min: 81, max: 208 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 37, group: 138 },
    'Flaming': { stats: { fire: { min: 138, max: 306 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 51, group: 138 },
    'Scorching': { stats: { fire: { min: 217, max: 432 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 67, group: 138 },

    // === GROUP 139: Lightning Damage ===
    'Static': { stats: { lightning: { min: 1, max: 120 } }, itemTypes: ['Weapon', 'Circlet', 'Quiver'], reqLvl: 18, group: 139 },
    'Glowing': { stats: { lightning: { min: 1, max: 180 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 25, group: 139 },
    'Buzzing': { stats: { lightning: { min: 1, max: 260 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 36, group: 139 },
    'Arcing': { stats: { lightning: { min: 1, max: 396 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 50, group: 139 },
    'Shocking': { stats: { lightning: { min: 1, max: 576 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 66, group: 139 },

    // === GROUP 140: Poison Damage ===
    'Septic': { stats: { poison: { min: 6, max: 6 } }, itemTypes: ['Weapon', 'Circlet', 'Quiver'], reqLvl: 1, group: 140 },
    'Foul': { stats: { poison: { min: 24, max: 24 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 7, group: 140 },
    'Corrosive': { stats: { poison: { min: 78, max: 78 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 15, group: 140 },
    'Toxic': { stats: { poison: { min: 226, max: 226 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 26, group: 140 },
    'Pestilent': { stats: { poison: { min: 384, max: 384 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 37, group: 140 },
    'Plague': { stats: { poison: { min: 366, max: 366 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 37, group: 140 },
    'Virulent': { stats: { poison: { min: 738, max: 738 } }, itemTypes: ['Weapon', 'Quiver'], reqLvl: 66, group: 140 },
    'Infectious': { stats: { poison: { min: 885, max: 885 } }, itemTypes: ['Dagger', 'Scythe'], reqLvl: 66, group: 140 },

    // === GROUP 142: Undead Bonuses ===
    'Consecrated': { stats: { dmgtoun: { min: 25, max: 75 }, toattun: { min: 25, max: 75 } }, itemTypes: ['WeaponPS'], reqLvl: 1, group: 142 },
    'Pure': { stats: { dmgtoun: { min: 76, max: 125 }, toattun: { min: 76, max: 175 } }, itemTypes: ['WeaponPS'], reqLvl: 11, group: 142 },
    'Sacred': { stats: { dmgtoun: { min: 126, max: 200 }, toattun: { min: 175, max: 250 } }, itemTypes: ['WeaponPS'], reqLvl: 18, group: 142 },
    'Hallowed': { stats: { dmgtoun: { min: 201, max: 275 }, toattun: { min: 251, max: 325 } }, itemTypes: ['WeaponPS'], reqLvl: 27, group: 142 },
    'Divine': { stats: { dmgtoun: { min: 276, max: 350 }, toattun: { min: 326, max: 450 } }, itemTypes: ['WeaponPS', 'Missile Weapon'], reqLvl: 37, group: 142 },

    // === GROUP 143: Pierce Chance (Quiver) ===
    'Penetrating': { stats: { pierce: { min: 5, max: 10 } }, itemTypes: ['Quiver'], reqLvl: 10, group: 143 },
    'Puncturing': { stats: { pierce: { min: 11, max: 20 } }, itemTypes: ['Quiver'], reqLvl: 25, group: 143 },
    'Piercing': { stats: { pierce: { min: 21, max: 30 } }, itemTypes: ['Quiver'], reqLvl: 40, group: 143 },
    'Impaling': { stats: { pierce: { min: 31, max: 40 } }, itemTypes: ['Quiver'], reqLvl: 55, group: 143 },

    // === GROUP 170: Open Wounds Damage ===
    "Cultist's": { stats: { openwounds: { min: 30, max: 40 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 25, group: 170 },
    "Bloodthirster's": { stats: { openwounds: { min: 204, max: 285 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 45, group: 170 },
    "Gorelust's": { stats: { openwounds: { min: 407, max: 563 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 65, group: 170 },

    // === GROUP 171: Resistance Lowering ===
    'Sizzling': { stats: { lowerfires: { min: 2, max: 6 } }, itemTypes: ['Missile Weapon', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Druid Helm', 'Staff'], reqLvl: 8, group: 171 },
    'Singeing': { stats: { lowerfires: { min: 4, max: 10 } }, itemTypes: ['Missile Weapon', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Druid Helm', 'Staff'], reqLvl: 26, group: 171 },
    'Infernal': { stats: { lowerfires: { min: 6, max: 15 } }, itemTypes: ['Missile Weapon', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Druid Helm', 'Staff'], reqLvl: 53, group: 171 },
    'Frigid': { stats: { lowercold: { min: 2, max: 6 } }, itemTypes: ['Missile Weapon', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Druid Helm', 'Staff'], reqLvl: 8, group: 171 },
    'Frostbitten': { stats: { lowercold: { min: 4, max: 10 } }, itemTypes: ['Missile Weapon', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Druid Helm', 'Staff'], reqLvl: 26, group: 171 },
    'Subzero': { stats: { lowercold: { min: 6, max: 15 } }, itemTypes: ['Missile Weapon', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Druid Helm', 'Staff'], reqLvl: 53, group: 171 },
    'Crackling': { stats: { lowerlightning: { min: 2, max: 6 } }, itemTypes: ['Amazon Javelin', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Staff', 'Amazon Spear'], reqLvl: 8, group: 171 },
    'Jolting': { stats: { lowerlightning: { min: 4, max: 10 } }, itemTypes: ['Amazon Javelin', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Staff', 'Amazon Spear'], reqLvl: 26, group: 171 },
    'Surging': { stats: { lowerlightning: { min: 6, max: 15 } }, itemTypes: ['Amazon Javelin', 'Scepter', 'Crystal Sword', 'Orb', 'Claw', 'Staff', 'Amazon Spear'], reqLvl: 53, group: 171 },
    'Decaying': { stats: { lowerpoison: { min: 2, max: 6 } }, itemTypes: ['Amazon Javelin', 'Wand', 'Claw'], reqLvl: 9, group: 171 },
    'Festering': { stats: { lowerpoison: { min: 4, max: 6 } }, itemTypes: ['Amazon Javelin', 'Wand', 'Claw'], reqLvl: 26, group: 171 },
    'Necrotic': { stats: { lowerpoison: { min: 6, max: 10 } }, itemTypes: ['Amazon Javelin', 'Wand', 'Claw'], reqLvl: 53, group: 171 },

    // === GROUP 200: Life After Kill ===
    'Blood Letting': { stats: { lifeafter: { min: 1, max: 1 } }, itemTypes: ['Weapon', 'Ring', 'Circlet', 'Chest', 'Helm', 'Shield', 'Quiver'], reqLvl: 12, group: 200 },
    'Murderous': { stats: { lifeafter: { min: 2, max: 5 } }, itemTypes: ['Weapon', 'Circlet', 'Chest', 'Helm', 'Shield', 'Quiver'], reqLvl: 44, group: 200 },
    'Blood Sucking': { stats: { lifeafter: { min: 1, max: 3 } }, itemTypes: ['Chest', 'Helm', 'Shield', 'Weapon', 'Ring', 'Quiver'], reqLvl: 26, group: 200 },
  },

  suffixes: {
    // === GROUP 1: Physical Damage Reduction ===
    'Protection': { stats: { pdmgred: { min: 1, max: 1 } }, itemTypes: ['Chest', 'Shield', 'Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 5, group: 1 },
    'Protection': { stats: { pdmgred: { min: 2, max: 2 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 13, group: 1 },
    'Protection': { stats: { pdmgred: { min: 2, max: 2 } }, itemTypes: ['Chest', 'Shield', 'Circlet'], reqLvl: 18, group: 1 },
    'Absorption': { stats: { pdmgred: { min: 3, max: 3 } }, itemTypes: ['Amulet', 'Circlet', 'Quiver'], reqLvl: 19, group: 1 },
    'Absorption': { stats: { pdmgred: { min: 3, max: 3 } }, itemTypes: ['Chest', 'Shield', 'Circlet', 'Ring'], reqLvl: 24, group: 1 },
    'Life': { stats: { pdmgred: { min: 4, max: 4 } }, itemTypes: ['Amulet', 'Circlet', 'Quiver'], reqLvl: 26, group: 1 },
    'Life': { stats: { pdmgred: { min: 4, max: 7 } }, itemTypes: ['Chest', 'Shield', 'Circlet', 'Ring'], reqLvl: 33, group: 1 },
    'Amicae': { stats: { pdmgred: { min: 8, max: 15 } }, itemTypes: ['Chest', 'Shield', 'Circlet', 'Amulet'], reqLvl: 43, group: 1 },
    'Life Everlasting': { stats: { pdmgred: { min: 10, max: 25 } }, itemTypes: ['Amulet', 'Circlet'], reqLvl: 37, group: 1 },
    'Life Everlasting': { stats: { pdmgred: { min: 10, max: 25 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 37, group: 1 },

    // === GROUP 2: Magic Damage Reduction ===
    'Warding': { stats: { mdmgred: { min: 1, max: 2 } }, itemTypes: ['Chest', 'Shield', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Quiver'], reqLvl: 5, group: 2 },
    'Sentinel': { stats: { mdmgred: { min: 2, max: 4 } }, itemTypes: ['Ring', 'Amulet', 'Orb', 'Circlet', 'Quiver'], reqLvl: 12, group: 2 },
    'Sentinel': { stats: { mdmgred: { min: 2, max: 4 } }, itemTypes: ['Chest', 'Shield', 'Circlet'], reqLvl: 18, group: 2 },
    'Guarding': { stats: { mdmgred: { min: 3, max: 6 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Quiver'], reqLvl: 19, group: 2 },
    'Guarding': { stats: { mdmgred: { min: 3, max: 6 } }, itemTypes: ['Chest', 'Shield', 'Circlet', 'Ring'], reqLvl: 24, group: 2 },
    'Negation': { stats: { mdmgred: { min: 8, max: 12 } }, itemTypes: ['Chest', 'Shield', 'Circlet'], reqLvl: 33, group: 2 },
    'Negation': { stats: { mdmgred: { min: 8, max: 12 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Quiver'], reqLvl: 35, group: 2 },
    'Fortification': { stats: { mdmgred: { min: 12, max: 16 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 53, group: 2 },

    // === GROUP 4: Ignore Target's Defense ===
    'Piercing': { stats: { itd: { min: 1, max: 1 } }, itemTypes: ['Rod', 'Knife', 'Claw'], reqLvl: 18, group: 4 },

    // === GROUP 6: Attacker Takes Damage (Thorns) ===
    'Thorns': { stats: { thorns: { min: 1, max: 1 } }, itemTypes: ['Chest', 'Belt', 'Shield'], reqLvl: 1, group: 6 },
    'Thorns': { stats: { thorns: { min: 3, max: 6 } }, itemTypes: ['Chest', 'Shield', 'Belt', 'Circlet'], reqLvl: 10, group: 6 },
    'Spikes': { stats: { thorns: { min: 8, max: 12 } }, itemTypes: ['Chest', 'Shield', 'Belt', 'Circlet'], reqLvl: 15, group: 6 },
    'Razors': { stats: { thorns: { min: 31, max: 40 } }, itemTypes: ['Chest', 'Shield', 'Circlet'], reqLvl: 26, group: 6 },
    'Swords': { stats: { thorns: { min: 80, max: 160 } }, itemTypes: ['Chest', 'Shield', 'Circlet'], reqLvl: 39, group: 6 },
    'Swords': { stats: { thorns: { min: 200, max: 400 } }, itemTypes: ['Chest', 'Shield', 'Circlet'], reqLvl: 50, group: 6 },

    // === GROUP 7: Increased Attack Speed ===
    'Readiness': { stats: { ias: { min: 10, max: 10 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 3, group: 7 },
    'Alacrity': { stats: { ias: { min: 20, max: 20 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 17, group: 7 },
    'Swiftness': { stats: { ias: { min: 30, max: 30 } }, itemTypes: ['WeaponP', 'Missile Weapon'], reqLvl: 26, group: 7 },
    'Quickness': { stats: { ias: { min: 40, max: 40 } }, itemTypes: ['WeaponP', 'Missile Weapon'], reqLvl: 38, group: 7 },

    // === GROUP 8: Blocking/Block Rate ===
    'Blocking': { stats: { blockcr: { min: 10, max: 10 } }, itemTypes: ['Shield'], reqLvl: 1, group: 8 },
    'Deflecting': { stats: { blockcr: { min: 20, max: 20 } }, itemTypes: ['Shield'], reqLvl: 8, group: 8 },

    // === GROUP 9: IAS/Faster Cast Rate ===
    'Readiness': { stats: { ias: { min: 10, max: 10 } }, itemTypes: ['Gloves'], reqLvl: 15, group: 9 },
    'Alacrity': { stats: { ias: { min: 20, max: 20 } }, itemTypes: ['Gloves'], reqLvl: 35, group: 9 },
    'Apprentice': { stats: { fcr: { min: 10, max: 10 } }, itemTypes: ['Rod', 'Ring', 'Amulet', 'Orb', 'Circlet', 'Club'], reqLvl: 3, group: 9 },
    'Apprentice': { stats: { fcr: { min: 10, max: 10 } }, itemTypes: ['Chest', 'Shield', 'Paladin Shield'], reqLvl: 20, group: 9 },
    'Apprentice': { stats: { fcr: { min: 10, max: 10 } }, itemTypes: ['Gloves', 'Belt'], reqLvl: 29, group: 9 },
    'Magus': { stats: { fcr: { min: 20, max: 20 } }, itemTypes: ['Rod', 'Orb', 'Circlet', 'Club'], reqLvl: 21, group: 9 },
    'Magus': { stats: { fcr: { min: 20, max: 20 } }, itemTypes: ['Chest', 'Shield', 'Paladin Shield'], reqLvl: 29, group: 9 },
    'Archmage': { stats: { fcr: { min: 30, max: 30 } }, itemTypes: ['Rod', 'Orb', 'Club'], reqLvl: 41, group: 9 },
    'Archmage': { stats: { fcr: { min: 40, max: 40 } }, itemTypes: ['Rod'], reqLvl: 41, group: 9 },

    // === GROUP 10: Cold Damage ===
    'Frost': { stats: { cold: { min: 1, max: 1 } }, itemTypes: ['WeaponP'], reqLvl: 1, group: 10 },
    'Frost': { stats: { cold: { min: 1, max: 2 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 3, group: 10 },
    'Frost': { stats: { cold: { min: 1, max: 6 } }, itemTypes: ['Belt', 'Amulet'], reqLvl: 37, group: 10 },
    'Icicle': { stats: { cold: { min: 3, max: 16 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 9, group: 10 },
    'Glacier': { stats: { cold: { min: 14, max: 71 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 20, group: 10 },
    'Winter': { stats: { cold: { min: 44, max: 246 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 37, group: 10 },
    'Hypothermia': { stats: { cold: { min: 63, max: 365 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 53, group: 10 },

    // === GROUP 11: Warmth (Half Freeze Duration) ===
    'Warmth': { stats: { warmth: { min: 1, max: 1 } }, itemTypes: ['Shield', 'Boots', 'Gloves', 'Ring', 'Amulet', 'Circlet', 'Orb'], reqLvl: 7, group: 11 },

    // === GROUP 12: Fire Damage ===
    'Flame': { stats: { fire: { min: 1, max: 2 } }, itemTypes: ['WeaponP'], reqLvl: 1, group: 12 },
    'Flame': { stats: { fire: { min: 1, max: 5 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 3, group: 12 },
    'Flame': { stats: { fire: { min: 1, max: 6 } }, itemTypes: ['Gloves', 'Ring', 'Amulet'], reqLvl: 30, group: 12 },
    'Fire': { stats: { fire: { min: 2, max: 22 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 11, group: 12 },
    'Burning': { stats: { fire: { min: 20, max: 72 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 18, group: 12 },
    'Incineration': { stats: { fire: { min: 57, max: 146 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 35, group: 12 },
    'Ashes': { stats: { fire: { min: 152, max: 302 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 53, group: 12 },

    // === GROUP 13: Lightning Damage ===
    'Shock': { stats: { lightning: { min: 1, max: 3 } }, itemTypes: ['WeaponP'], reqLvl: 1, group: 13 },
    'Shock': { stats: { lightning: { min: 1, max: 8 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 3, group: 13 },
    'Shock': { stats: { lightning: { min: 1, max: 23 } }, itemTypes: ['Boots', 'Ring', 'Amulet'], reqLvl: 37, group: 13 },
    'Lightning': { stats: { lightning: { min: 1, max: 24 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 11, group: 13 },
    'Thunder': { stats: { lightning: { min: 1, max: 84 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 18, group: 13 },
    'Storms': { stats: { lightning: { min: 1, max: 126 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 26, group: 13 },
    'Maelstrom': { stats: { lightning: { min: 1, max: 403 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 53, group: 13 },

    // === GROUP 14: Maximum Damage ===
    'Craftsmanship': { stats: { maxdmg: { min: 1, max: 1 } }, itemTypes: ['WeaponP', 'Ring', 'Amulet'], reqLvl: 1, group: 14 },
    'Craftsmanship': { stats: { maxdmg: { min: 1, max: 2 } }, itemTypes: ['Circlet', 'Helm'], reqLvl: 1, group: 14 },
    'Craftsmanship': { stats: { maxdmg: { min: 2, max: 3 } }, itemTypes: ['Circlet', 'Helm'], reqLvl: 6, group: 14 },
    'Craftsmanship': { stats: { maxdmg: { min: 4, max: 5 } }, itemTypes: ['Circlet', 'Helm'], reqLvl: 11, group: 14 },
    'Quality': { stats: { maxdmg: { min: 2, max: 2 } }, itemTypes: ['WeaponP'], reqLvl: 3, group: 14 },
    'Quality': { stats: { maxdmg: { min: 6, max: 7 } }, itemTypes: ['Circlet', 'Helm'], reqLvl: 17, group: 14 },
    'Quality': { stats: { maxdmg: { min: 7, max: 8 } }, itemTypes: ['Circlet', 'Helm'], reqLvl: 22, group: 14 },
    'Maiming': { stats: { maxdmg: { min: 3, max: 4 } }, itemTypes: ['WeaponP'], reqLvl: 5, group: 14 },
    'Maiming': { stats: { maxdmg: { min: 3, max: 4 } }, itemTypes: ['Shield', 'Ring', 'Amulet'], reqLvl: 34, group: 14 },
    'Maiming': { stats: { maxdmg: { min: 9, max: 10 } }, itemTypes: ['Circlet', 'Helm'], reqLvl: 29, group: 14 },
    'Maiming': { stats: { maxdmg: { min: 11, max: 12 } }, itemTypes: ['Circlet', 'Helm'], reqLvl: 37, group: 14 },
    'Slaying': { stats: { maxdmg: { min: 5, max: 7 } }, itemTypes: ['WeaponP'], reqLvl: 8, group: 14 },
    'Gore': { stats: { maxdmg: { min: 8, max: 10 } }, itemTypes: ['WeaponP'], reqLvl: 10, group: 14 },
    'Carnage': { stats: { maxdmg: { min: 11, max: 14 } }, itemTypes: ['WeaponP'], reqLvl: 14, group: 14 },
    'Carnage': { stats: { maxdmg: { min: 11, max: 14 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Helm'], reqLvl: 58, group: 14 },
    'Slaughter': { stats: { maxdmg: { min: 15, max: 20 } }, itemTypes: ['WeaponP'], reqLvl: 18, group: 14 },
    'Butchery': { stats: { maxdmg: { min: 21, max: 40 } }, itemTypes: ['WeaponP'], reqLvl: 27, group: 14 },
    'Evisceration': { stats: { maxdmg: { min: 41, max: 63 } }, itemTypes: ['WeaponP'], reqLvl: 37, group: 14 },
    'Evisceration': { stats: { maxdmg: { min: 41, max: 63 } }, itemTypes: ['Missile Weapon'], reqLvl: 37, group: 14 },

    // === GROUP 15: Minimum Damage ===
    'Worth': { stats: { mindmg: { min: 1, max: 2 } }, itemTypes: ['WeaponP'], reqLvl: 1, group: 15 },
    'Worth': { stats: { mindmg: { min: 2, max: 3 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Helm'], reqLvl: 11, group: 15 },
    'Measure': { stats: { mindmg: { min: 3, max: 4 } }, itemTypes: ['WeaponP'], reqLvl: 9, group: 15 },
    'Measure': { stats: { mindmg: { min: 4, max: 5 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Helm'], reqLvl: 29, group: 15 },
    'Excellence': { stats: { mindmg: { min: 5, max: 8 } }, itemTypes: ['WeaponP'], reqLvl: 18, group: 15 },
    'Excellence': { stats: { mindmg: { min: 6, max: 9 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Helm'], reqLvl: 51, group: 15 },
    'Performance': { stats: { mindmg: { min: 9, max: 14 } }, itemTypes: ['WeaponP'], reqLvl: 40, group: 15 },
    'Performance': { stats: { mindmg: { min: 10, max: 13 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Helm'], reqLvl: 63, group: 15 },
    'Transcendence': { stats: { mindmg: { min: 15, max: 20 } }, itemTypes: ['WeaponP'], reqLvl: 68, group: 15 },

    // === GROUP 16: Poison Damage ===
    'Blight': { stats: { poison: { min: 1, max: 1 } }, itemTypes: ['WeaponP', 'Wand'], reqLvl: 1, group: 16 },
    'Blight': { stats: { poison: { min: 7, max: 7 } }, itemTypes: ['WeaponP', 'Circlet', 'Quiver'], reqLvl: 3, group: 16 },
    'Blight': { stats: { poison: { min: 50, max: 50 } }, itemTypes: ['Ring', 'Amulet'], reqLvl: 33, group: 16 },
    'Venom': { stats: { poison: { min: 21, max: 21 } }, itemTypes: ['WeaponP', 'Circlet', 'Quiver'], reqLvl: 11, group: 16 },
    'Pestilence': { stats: { poison: { min: 50, max: 50 } }, itemTypes: ['WeaponP', 'Circlet', 'Quiver'], reqLvl: 18, group: 16 },
    'Anthrax': { stats: { poison: { min: 100, max: 100 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 25, group: 16 },

    // === GROUP 17: Dexterity ===
    'Dexterity': { stats: { dex: { min: 1, max: 1 } }, itemTypes: ['Boots', 'Gloves'], reqLvl: 1, group: 17 },
    'Dexterity': { stats: { dex: { min: 1, max: 1 } }, itemTypes: ['Ring'], reqLvl: 1, group: 17 },
    'Dexterity': { stats: { dex: { min: 1, max: 2 } }, itemTypes: ['Amulet', 'Missile Weapon', 'Circlet', 'Helm'], reqLvl: 1, group: 17 },
    'Dexterity': { stats: { dex: { min: 1, max: 2 } }, itemTypes: ['Ring', 'Gloves'], reqLvl: 4, group: 17 },
    'Dexterity': { stats: { dex: { min: 2, max: 3 } }, itemTypes: ['Chest', 'Boots'], reqLvl: 9, group: 17 },
    'Skill': { stats: { dex: { min: 3, max: 5 } }, itemTypes: ['Amulet', 'Missile Weapon', 'Circlet', 'Quiver', 'Helm'], reqLvl: 8, group: 17 },
    'Skill': { stats: { dex: { min: 3, max: 5 } }, itemTypes: ['Ring', 'Gloves', 'Boots'], reqLvl: 16, group: 17 },
    'Skill': { stats: { dex: { min: 4, max: 5 } }, itemTypes: ['Chest'], reqLvl: 26, group: 17 },
    'Accuracy': { stats: { dex: { min: 6, max: 9 } }, itemTypes: ['Amulet', 'Missile Weapon', 'Circlet', 'Quiver', 'Helm'], reqLvl: 20, group: 17 },
    'Accuracy': { stats: { dex: { min: 6, max: 9 } }, itemTypes: ['Ring', 'Gloves'], reqLvl: 31, group: 17 },
    'Accuracy': { stats: { dex: { min: 6, max: 9 } }, itemTypes: ['Chest', 'Boots'], reqLvl: 38, group: 17 },
    'Precision': { stats: { dex: { min: 10, max: 15 } }, itemTypes: ['Amulet', 'Missile Weapon', 'Circlet', 'Quiver', 'Helm'], reqLvl: 35, group: 17 },
    'Precision': { stats: { dex: { min: 10, max: 15 } }, itemTypes: ['Ring', 'Gloves'], reqLvl: 48, group: 17 },
    'Precision': { stats: { dex: { min: 10, max: 15 } }, itemTypes: ['Chest', 'Boots', 'Shield'], reqLvl: 52, group: 17 },
    'Perfection': { stats: { dex: { min: 16, max: 20 } }, itemTypes: ['Amulet', 'Missile Weapon', 'Circlet', 'Chest', 'Shield', 'Helm'], reqLvl: 51, group: 17 },
    'Perfection': { stats: { dex: { min: 16, max: 20 } }, itemTypes: ['Ring', 'Gloves'], reqLvl: 67, group: 17 },
    'Nirvana': { stats: { dex: { min: 21, max: 30 } }, itemTypes: ['Amulet', 'Missile Weapon', 'Circlet', 'Helm', 'Shield', 'Chest'], reqLvl: 64, group: 17 },

    // === GROUP 18: Faster Hit Recovery ===
    'Balance': { stats: { fhr: { min: 10, max: 10 } }, itemTypes: ['Armor', 'Helm', 'Shield'], reqLvl: 3, group: 18 },
    'Equilibrium': { stats: { fhr: { min: 17, max: 17 } }, itemTypes: ['Chest', 'Belt', 'Shield', 'Helm'], reqLvl: 6, group: 18 },
    'Stability': { stats: { fhr: { min: 24, max: 24 } }, itemTypes: ['Chest', 'Belt', 'Helm', 'Shield'], reqLvl: 13, group: 18 },

    // === GROUP 19: Life Replenish ===
    'Regeneration': { stats: { regen: { min: 4, max: 10 } }, itemTypes: ['Scepter', 'Belt', 'Ring', 'Amulet', 'Circlet'], reqLvl: 7, group: 19 },
    'Regeneration': { stats: { regen: { min: 6, max: 10 } }, itemTypes: ['Shield', 'Gloves'], reqLvl: 30, group: 19 },
    'Regeneration': { stats: { regen: { min: 6, max: 10 } }, itemTypes: ['Chest', 'WeaponP', 'Boots'], reqLvl: 52, group: 19 },
    'Regrowth': { stats: { regen: { min: 12, max: 20 } }, itemTypes: ['Scepter', 'Amulet', 'Circlet'], reqLvl: 12, group: 19 },
    'Regrowth': { stats: { regen: { min: 12, max: 18 } }, itemTypes: ['Belt', 'Ring'], reqLvl: 41, group: 19 },
    'Revivification': { stats: { regen: { min: 22, max: 30 } }, itemTypes: ['Scepter', 'Amulet', 'Circlet'], reqLvl: 30, group: 19 },

    // === GROUP 20: Prevent Monster Heal ===
    'Vileness': { stats: { preventheal: { min: 1, max: 1 } }, itemTypes: ['WeaponPS', 'Quiver'], reqLvl: 6, group: 20 },

    // === GROUP 21: Gold Find ===
    'Greed': { stats: { goldfind: { min: 25, max: 40 } }, itemTypes: ['Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 1, group: 21 },
    'Wealth': { stats: { goldfind: { min: 41, max: 80 } }, itemTypes: ['Boots', 'Gloves', 'Belt', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 12, group: 21 },

    // === GROUP 22: Magic Find ===
    'Chance': { stats: { magicfind: { min: 5, max: 15 } }, itemTypes: ['Boots', 'Gloves', 'Ring', 'Amulet', 'Circlet', 'Helm', 'Quiver'], reqLvl: 9, group: 22 },
    'Fortune': { stats: { magicfind: { min: 16, max: 25 } }, itemTypes: ['Boots', 'Gloves', 'Amulet', 'Circlet', 'Helm', 'Quiver'], reqLvl: 12, group: 22 },
    'Fortune': { stats: { magicfind: { min: 16, max: 25 } }, itemTypes: ['Ring'], reqLvl: 31, group: 22 },
    'Luck': { stats: { magicfind: { min: 26, max: 35 } }, itemTypes: ['Boots', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 19, group: 22 },

    // === GROUP 23: Energy ===
    'Energy': { stats: { energy: { min: 1, max: 1 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Wand', 'Staff', 'Helm', 'Ring'], reqLvl: 1, group: 23 },
    'Energy': { stats: { energy: { min: 1, max: 3 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Wand', 'Staff', 'Helm', 'Chest'], reqLvl: 1, group: 23 },
    'Energy': { stats: { energy: { min: 1, max: 3 } }, itemTypes: ['Shield'], reqLvl: 1, group: 23 },
    'Energy': { stats: { energy: { min: 1, max: 3 } }, itemTypes: ['Ring'], reqLvl: 5, group: 23 },
    'Energy': { stats: { energy: { min: 1, max: 3 } }, itemTypes: ['Helm', 'Scepter'], reqLvl: 3, group: 23 },
    'Mind': { stats: { energy: { min: 4, max: 6 } }, itemTypes: ['Orb', 'Circlet', 'Wand', 'Staff', 'Quiver', 'Helm', 'Chest'], reqLvl: 3, group: 23 },
    'Mind': { stats: { energy: { min: 4, max: 6 } }, itemTypes: ['Shield'], reqLvl: 3, group: 23 },
    'Mind': { stats: { energy: { min: 4, max: 6 } }, itemTypes: ['Ring', 'Amulet'], reqLvl: 9, group: 23 },
    'Mind': { stats: { energy: { min: 4, max: 6 } }, itemTypes: ['Helm', 'Scepter'], reqLvl: 7, group: 23 },
    'Brilliance': { stats: { energy: { min: 7, max: 10 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Wand', 'Staff', 'Quiver', 'Helm'], reqLvl: 9, group: 23 },
    'Brilliance': { stats: { energy: { min: 7, max: 10 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 9, group: 23 },
    'Brilliance': { stats: { energy: { min: 7, max: 10 } }, itemTypes: ['Ring'], reqLvl: 16, group: 23 },
    'Brilliance': { stats: { energy: { min: 7, max: 10 } }, itemTypes: ['Helm', 'Scepter'], reqLvl: 12, group: 23 },
    'Sorcery': { stats: { energy: { min: 11, max: 15 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Wand', 'Staff', 'Quiver', 'Helm'], reqLvl: 16, group: 23 },
    'Sorcery': { stats: { energy: { min: 11, max: 15 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 16, group: 23 },
    'Sorcery': { stats: { energy: { min: 11, max: 15 } }, itemTypes: ['Ring'], reqLvl: 23, group: 23 },
    'Sorcery': { stats: { energy: { min: 11, max: 15 } }, itemTypes: ['Helm', 'Scepter'], reqLvl: 21, group: 23 },
    'Wizardry': { stats: { energy: { min: 16, max: 20 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Wand', 'Staff', 'Helm', 'Chest'], reqLvl: 23, group: 23 },
    'Wizardry': { stats: { energy: { min: 16, max: 20 } }, itemTypes: ['Shield'], reqLvl: 23, group: 23 },
    'Wizardry': { stats: { energy: { min: 16, max: 20 } }, itemTypes: ['Ring'], reqLvl: 33, group: 23 },
    'Enlightenment': { stats: { energy: { min: 21, max: 30 } }, itemTypes: ['Amulet', 'Orb', 'Circlet', 'Wand', 'Staff', 'Helm', 'Chest'], reqLvl: 33, group: 23 },
    'Enlightenment': { stats: { energy: { min: 21, max: 30 } }, itemTypes: ['Shield'], reqLvl: 33, group: 23 },

    // === GROUP 24: Knockback ===
    'Bear': { stats: { knockback: { min: 1, max: 1 } }, itemTypes: ['Melee Weapon'], reqLvl: 6, group: 24 },
    'Bear': { stats: { knockback: { min: 1, max: 1 } }, itemTypes: ['Quiver'], reqLvl: 24, group: 24 },

    // === GROUP 25: Light Radius + Attack Rating ===
    'Light': { stats: { lightrad: { min: 1, max: 1 }, toatt: { min: 10, max: 10 } }, itemTypes: ['Ring', 'Amulet'], reqLvl: 1, group: 25 },
    'Light': { stats: { lightrad: { min: 1, max: 1 }, toatt: { min: 15, max: 30 } }, itemTypes: ['Armor', 'Rod', 'Ring', 'Amulet', 'Quiver'], reqLvl: 4, group: 25 },
    'Radiance': { stats: { lightrad: { min: 3, max: 3 }, toatt: { min: 30, max: 60 } }, itemTypes: ['Rod', 'Missile Weapon', 'Helm', 'Chest', 'Quiver'], reqLvl: 11, group: 25 },
    'Radiance': { stats: { lightrad: { min: 3, max: 3 }, toatt: { min: 30, max: 60 } }, itemTypes: ['Ring', 'Amulet'], reqLvl: 11, group: 25 },
    'Clarity': { stats: { lightrad: { min: 4, max: 4 }, toatt: { min: 60, max: 120 } }, itemTypes: ['Rod', 'Missile Weapon', 'Amulet', 'Helm', 'Chest', 'Ring'], reqLvl: 21, group: 25 },
    'Divinity': { stats: { lightrad: { min: 5, max: 5 }, toatt: { min: 120, max: 240 } }, itemTypes: ['Rod', 'Missile Weapon', 'Amulet', 'Chest'], reqLvl: 42, group: 25 },
    'Sun': { stats: { lightrad: { min: 5, max: 5 }, toatt: { min: 10, max: 20 } }, itemTypes: ['Rod', 'Missile Weapon', 'Gloves', 'Ring', 'Amulet', 'Helm', 'Chest'], reqLvl: 12, group: 25 },
    'Sunset': { stats: { lightrad: { min: 5, max: 5 }, toatt: { min: 10, max: 10 } }, itemTypes: ['Rod', 'Missile Weapon', 'Gloves', 'Ring', 'Amulet', 'Helm', 'Chest'], reqLvl: 22, group: 25 },
    'Sunset': { stats: { lightrad: { min: 5, max: 8 }, toatt: { min: 10, max: 10 } }, itemTypes: ['Rod', 'Missile Weapon', 'Gloves', 'Ring', 'Amulet', 'Helm', 'Chest'], reqLvl: 26, group: 25 },
    'Jackal': { stats: { tolife: { min: 1, max: 5 } }, itemTypes: ['Chest', 'Belt', 'Amulet', 'Barbarian Helm', 'Circlet'], reqLvl: 1, group: 26 },
    'Jackal': { stats: { tolife: { min: 1, max: 5 } }, itemTypes: ['Shield', 'Druid Helm'], reqLvl: 3, group: 26 },
    'Jackal': { stats: { tolife: { min: 1, max: 5 } }, itemTypes: ['Mace', 'Ring', 'Helm'], reqLvl: 6, group: 26 },

    // === GROUP 26: Life ===
    'Fox': { stats: { tolife: { min: 6, max: 10 } }, itemTypes: ['Chest', 'Belt', 'Amulet', 'Barbarian Helm', 'Circlet', 'Quiver'], reqLvl: 5, group: 26 },
    'Fox': { stats: { tolife: { min: 6, max: 10 } }, itemTypes: ['Shield', 'Druid Helm'], reqLvl: 8, group: 26 },
    'Fox': { stats: { tolife: { min: 6, max: 10 } }, itemTypes: ['Mace', 'Helm'], reqLvl: 13, group: 26 },
    'Fox': { stats: { tolife: { min: 6, max: 10 } }, itemTypes: ['Ring'], reqLvl: 13, group: 26 },
    'Wolf': { stats: { tolife: { min: 11, max: 20 } }, itemTypes: ['Chest', 'Barbarian Helm', 'Circlet', 'Quiver'], reqLvl: 11, group: 26 },
    'Wolf': { stats: { tolife: { min: 11, max: 20 } }, itemTypes: ['Amulet', 'Belt'], reqLvl: 11, group: 26 },
    'Wolf': { stats: { tolife: { min: 11, max: 20 } }, itemTypes: ['Shield', 'Druid Helm'], reqLvl: 20, group: 26 },
    'Wolf': { stats: { tolife: { min: 11, max: 20 } }, itemTypes: ['Mace', 'Helm'], reqLvl: 26, group: 26 },
    'Wolf': { stats: { tolife: { min: 11, max: 20 } }, itemTypes: ['Ring'], reqLvl: 26, group: 26 },
    'Tiger': { stats: { tolife: { min: 21, max: 30 } }, itemTypes: ['Chest', 'Belt', 'Amulet', 'Barbarian Helm', 'Circlet', 'Quiver'], reqLvl: 15, group: 26 },
    'Tiger': { stats: { tolife: { min: 21, max: 30 } }, itemTypes: ['Shield', 'Druid Helm'], reqLvl: 35, group: 26 },
    'Tiger': { stats: { tolife: { min: 21, max: 30 } }, itemTypes: ['Mace', 'Ring', 'Helm'], reqLvl: 43, group: 26 },
    'Mammoth': { stats: { tolife: { min: 31, max: 40 } }, itemTypes: ['Chest', 'Belt', 'Amulet', 'Barbarian Helm', 'Circlet', 'Quiver'], reqLvl: 18, group: 26 },
    'Mammoth': { stats: { tolife: { min: 31, max: 40 } }, itemTypes: ['Shield', 'Druid Helm'], reqLvl: 51, group: 26 },
    'Mammoth': { stats: { tolife: { min: 31, max: 40 } }, itemTypes: ['Mace', 'Ring', 'Helm'], reqLvl: 60, group: 26 },
    'Colossus': { stats: { tolife: { min: 41, max: 60 } }, itemTypes: ['Chest', 'Belt', 'Amulet', 'Barbarian Helm', 'Circlet'], reqLvl: 22, group: 26 },
    'Colossus': { stats: { tolife: { min: 41, max: 60 } }, itemTypes: ['Shield', 'Druid Helm'], reqLvl: 67, group: 26 },
    'Squid': { stats: { tolife: { min: 61, max: 80 } }, itemTypes: ['Chest', 'Belt', 'Barbarian Helm', 'Circlet', 'Shield'], reqLvl: 30, group: 26 },
    'Squid': { stats: { tolife: { min: 61, max: 80 } }, itemTypes: ['Amulet'], reqLvl: 30, group: 26 },
    'Whale': { stats: { tolife: { min: 81, max: 100 } }, itemTypes: ['Chest', 'Belt', 'Barbarian Helm', 'Circlet', 'Shield'], reqLvl: 37, group: 26 },
    'Whale': { stats: { tolife: { min: 81, max: 100 } }, itemTypes: ['Amulet'], reqLvl: 37, group: 26 },

    // === GROUP 27: Life Leech ===
    'Leech': { stats: { lifesteal: { min: 2, max: 3 } }, itemTypes: ['Amulet'], reqLvl: 20, group: 27 },
    'Leech': { stats: { lifesteal: { min: 3, max: 3 } }, itemTypes: ['Gloves'], reqLvl: 26, group: 27 },
    'Leech': { stats: { lifesteal: { min: 3, max: 4 } }, itemTypes: ['Ring', 'Circlet', 'Helm'], reqLvl: 10, group: 27 },
    'Leech': { stats: { lifesteal: { min: 4, max: 5 } }, itemTypes: ['Melee Weapon', 'Missile Weapon', 'Quiver'], reqLvl: 4, group: 27 },
    'Locust': { stats: { lifesteal: { min: 4, max: 5 } }, itemTypes: ['Amulet'], reqLvl: 45, group: 27 },
    'Locust': { stats: { lifesteal: { min: 5, max: 6 } }, itemTypes: ['Ring', 'Circlet', 'Helm'], reqLvl: 35, group: 27 },
    'Locust': { stats: { lifesteal: { min: 6, max: 7 } }, itemTypes: ['Melee Weapon', 'Quiver'], reqLvl: 15, group: 27 },
    'Lamprey': { stats: { lifesteal: { min: 6, max: 6 } }, itemTypes: ['Amulet'], reqLvl: 63, group: 27 },
    'Lamprey': { stats: { lifesteal: { min: 6, max: 9 } }, itemTypes: ['Quiver'], reqLvl: 43, group: 27 },
    'Lamprey': { stats: { lifesteal: { min: 7, max: 8 } }, itemTypes: ['Ring', 'Circlet'], reqLvl: 65, group: 27 },
    'Lamprey': { stats: { lifesteal: { min: 8, max: 9 } }, itemTypes: ['Melee Weapon'], reqLvl: 43, group: 27 },

    // === GROUP 28: Mana Leech ===
    'Bat': { stats: { manasteal: { min: 2, max: 3 } }, itemTypes: ['Ring'], reqLvl: 21, group: 28 },
    'Bat': { stats: { manasteal: { min: 3, max: 3 } }, itemTypes: ['Gloves'], reqLvl: 27, group: 28 },
    'Bat': { stats: { manasteal: { min: 3, max: 4 } }, itemTypes: ['Amulet', 'Circlet', 'Helm'], reqLvl: 11, group: 28 },
    'Bat': { stats: { manasteal: { min: 4, max: 5 } }, itemTypes: ['Melee Weapon', 'Missile Weapon', 'Quiver'], reqLvl: 4, group: 28 },
    'Wraith': { stats: { manasteal: { min: 4, max: 5 } }, itemTypes: ['Ring'], reqLvl: 46, group: 28 },
    'Wraith': { stats: { manasteal: { min: 5, max: 6 } }, itemTypes: ['Amulet', 'Circlet', 'Helm'], reqLvl: 40, group: 28 },
    'Wraith': { stats: { manasteal: { min: 6, max: 7 } }, itemTypes: ['Melee Weapon', 'Quiver'], reqLvl: 16, group: 28 },
    'Vampire': { stats: { manasteal: { min: 6, max: 6 } }, itemTypes: ['Ring'], reqLvl: 64, group: 28 },
    'Vampire': { stats: { manasteal: { min: 6, max: 9 } }, itemTypes: ['Quiver'], reqLvl: 48, group: 28 },
    'Vampire': { stats: { manasteal: { min: 7, max: 8 } }, itemTypes: ['Amulet', 'Circlet'], reqLvl: 66, group: 28 },
    'Vampire': { stats: { manasteal: { min: 8, max: 9 } }, itemTypes: ['Melee Weapon'], reqLvl: 48, group: 28 },

    // === GROUP 29: Poison Resist ===
    'Remedy': { stats: { poisonres: { min: 25, max: 25 } }, itemTypes: ['Armor', 'Ring', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 5, group: 29 },
    'Amelioration': { stats: { poisonres: { min: 50, max: 50 } }, itemTypes: ['Chest', 'Shield', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 13, group: 29 },
    'Defiance': { stats: { poisonres: { min: 75, max: 75 } }, itemTypes: ['Chest', 'Shield', 'Amulet', 'Circlet', 'Quiver'], reqLvl: 18, group: 29 },

    // === GROUP 30: Requirements ===
    'Ease': { stats: { reqred: { min: 20, max: 20 } }, itemTypes: ['Chest', 'WeaponPS', 'Shield'], reqLvl: 11, group: 30 },
    'Simplicity': { stats: { reqred: { min: 30, max: 30 } }, itemTypes: ['Chest', 'WeaponPS', 'Shield'], reqLvl: 18, group: 30 },

    // === GROUP 31: Strength ===
    'Strength': { stats: { str: { min: 1, max: 1 } }, itemTypes: ['Gloves'], reqLvl: 1, group: 31 },
    'Strength': { stats: { str: { min: 1, max: 1 } }, itemTypes: ['Ring'], reqLvl: 1, group: 31 },
    'Strength': { stats: { str: { min: 1, max: 2 } }, itemTypes: ['Amulet', 'Belt', 'Club', 'Hammer', 'Circlet', 'Helm'], reqLvl: 1, group: 31 },
    'Strength': { stats: { str: { min: 1, max: 2 } }, itemTypes: ['Ring', 'Scepter', 'Mace'], reqLvl: 3, group: 31 },
    'Strength': { stats: { str: { min: 1, max: 2 } }, itemTypes: ['WeaponP', 'Gloves', 'Shield', 'Chest'], reqLvl: 8, group: 31 },
    'Might': { stats: { str: { min: 3, max: 5 } }, itemTypes: ['Belt', 'Club', 'Hammer', 'Circlet', 'Quiver', 'Helm'], reqLvl: 8, group: 31 },
    'Might': { stats: { str: { min: 3, max: 5 } }, itemTypes: ['Amulet', 'Ring', 'Gloves'], reqLvl: 8, group: 31 },
    'Might': { stats: { str: { min: 3, max: 5 } }, itemTypes: ['Scepter', 'Mace', 'Chest'], reqLvl: 15, group: 31 },
    'Might': { stats: { str: { min: 3, max: 5 } }, itemTypes: ['WeaponP', 'Shield', 'Chest'], reqLvl: 25, group: 31 },
    'Ox': { stats: { str: { min: 6, max: 9 } }, itemTypes: ['Amulet', 'Belt', 'Club', 'Hammer', 'Circlet', 'Quiver', 'Helm'], reqLvl: 19, group: 31 },
    'Ox': { stats: { str: { min: 6, max: 9 } }, itemTypes: ['Ring', 'Scepter', 'Mace', 'Chest'], reqLvl: 30, group: 31 },
    'Ox': { stats: { str: { min: 6, max: 9 } }, itemTypes: ['WeaponP', 'Gloves', 'Shield', 'Chest'], reqLvl: 37, group: 31 },
    'Giant': { stats: { str: { min: 10, max: 15 } }, itemTypes: ['Amulet', 'Belt', 'Club', 'Hammer', 'Circlet', 'Quiver', 'Helm'], reqLvl: 34, group: 31 },
    'Giant': { stats: { str: { min: 10, max: 15 } }, itemTypes: ['Ring', 'Scepter', 'Mace', 'Chest', 'Shield'], reqLvl: 47, group: 31 },
    'Giant': { stats: { str: { min: 10, max: 15 } }, itemTypes: ['WeaponP', 'Gloves'], reqLvl: 51, group: 31 },
    'Titan': { stats: { str: { min: 16, max: 20 } }, itemTypes: ['Amulet', 'Belt', 'Club', 'Hammer', 'Circlet', 'Helm'], reqLvl: 50, group: 31 },
    'Titan': { stats: { str: { min: 16, max: 20 } }, itemTypes: ['Ring', 'Scepter', 'Mace', 'Chest', 'Shield'], reqLvl: 66, group: 31 },
    'Atlas': { stats: { str: { min: 21, max: 30 } }, itemTypes: ['Amulet', 'Belt', 'Club', 'Hammer', 'Circlet', 'Helmet', 'Shield'], reqLvl: 63, group: 31 },
    'Atlas': { stats: { str: { min: 21, max: 30 } }, itemTypes: ['Chest'], reqLvl: 63, group: 31 },

    // === GROUP 35: Run/Walk ===
    'Pacing': { stats: { frw: { min: 10, max: 10 } }, itemTypes: ['Boots', 'Circlet'], reqLvl: 8, group: 35 },
    'Pacing': { stats: { frw: { min: 10, max: 10 } }, itemTypes: ['Amazon Weapon', 'Quiver'], reqLvl: 8, group: 35 },
    'Haste': { stats: { frw: { min: 20, max: 20 } }, itemTypes: ['Boots', 'Circlet'], reqLvl: 16, group: 35 },
    'Haste': { stats: { frw: { min: 20, max: 20 } }, itemTypes: ['Amazon Weapon', 'Quiver'], reqLvl: 16, group: 35 },
    'Speed': { stats: { frw: { min: 30, max: 30 } }, itemTypes: ['Boots', 'Circlet'], reqLvl: 29, group: 35 },
    'Transportation': { stats: { frw: { min: 30, max: 30 }, stamdrainred: { min: 80, max: 90 } }, itemTypes: ['Boots'], reqLvl: 57, group: 35 },
    'Acceleration': { stats: { frw: { min: 40, max: 40 } }, itemTypes: ['Boots'], reqLvl: 43, group: 35 },

    // === GROUP 37: Durability ===
    'Self-Repair': { stats: { repair: { min: 1, max: 1 } }, itemTypes: ['WeaponP', 'Orb', 'Armor'], reqLvl: 1, group: 37 },
    'Fast Repair': { stats: { repair: { min: 1, max: 1 } }, itemTypes: ['WeaponP', 'Orb', 'Armor'], reqLvl: 12, group: 37 },
    'Ages': { stats: { indestructible: { min: 1, max: 1 } }, itemTypes: ['WeaponP', 'Orb', 'Armor'], reqLvl: 42, group: 39 },

    // === GROUP 41: Scaling Life/Mana ===
    'Centaur': { stats: { scalinglife: { min: 0, max: 74 } }, itemTypes: ['Chest', 'Druid Helm', 'Barbarian Helm', 'Shield'], reqLvl: 1, group: 41 },
    'Centaur': { stats: { scalinglife: { min: 0, max: 74 } }, itemTypes: ['Amulet'], reqLvl: 1, group: 41 },
    'Mnemonic': { stats: { scalingmana: { min: 0, max: 74 } }, itemTypes: ['Circlet', 'Amulet', 'Druid Helm'], reqLvl: 1, group: 41 },
    'Elephant': { stats: { scalinglife: { min: 0, max: 49 }, scalingmana: { min: 0, max: 24 } }, itemTypes: ['Circlet', 'Druid Helm'], reqLvl: 7, group: 41 },

    // === GROUP 251: Defending ===
    'Defending': { stats: { pdmgred: { min: 5, max: 10 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 20, group: 251 },
    'Defending': { stats: { pdmgred: { min: 5, max: 10 } }, itemTypes: ['Belt'], reqLvl: 40, group: 251 },
    'Protecting': { stats: { pdmgred: { min: 10, max: 15 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 40, group: 251 },
    'Guardianship': { stats: { pdmgred: { min: 15, max: 20 } }, itemTypes: ['Chest', 'Shield'], reqLvl: 60, group: 251 },

    // === GROUP 252: Deadly Strike / Open Wounds / Crushing Blow ===
    'Savagery': { stats: { deadlystrike: { min: 5, max: 10 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 15, group: 252 },
    'Devastation': { stats: { deadlystrike: { min: 10, max: 15 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 25, group: 252 },
    'Havoc': { stats: { deadlystrike: { min: 15, max: 20 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 35, group: 252 },
    'Destruction': { stats: { deadlystrike: { min: 20, max: 25 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 45, group: 252 },
    'Desolation': { stats: { deadlystrike: { min: 25, max: 30 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 55, group: 252 },
    'Bleeding': { stats: { openwounds: { min: 10, max: 10 }, owdps: { min: 8, max: 12 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 15, group: 252 },
    'Siphoning': { stats: { openwounds: { min: 10, max: 10 }, owdps: { min: 15, max: 20 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 25, group: 252 },
    'Gory': { stats: { openwounds: { min: 10, max: 10 }, owdps: { min: 33, max: 46 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 35, group: 252 },
    'Sanguinary': { stats: { openwounds: { min: 10, max: 10 }, owdps: { min: 122, max: 172 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 45, group: 252 },
    'Hematic': { stats: { openwounds: { min: 10, max: 10 }, owdps: { min: 235, max: 325 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 55, group: 252 },
    'Chipping': { stats: { crushblow: { min: 5, max: 10 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 15, group: 252 },
    'Crumbling': { stats: { crushblow: { min: 10, max: 15 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 25, group: 252 },
    'Breaking': { stats: { crushblow: { min: 15, max: 20 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 35, group: 252 },
    'Crushing': { stats: { crushblow: { min: 20, max: 25 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 45, group: 252 },
    'Pulverizing': { stats: { crushblow: { min: 25, max: 30 } }, itemTypes: ['WeaponP', 'Quiver'], reqLvl: 55, group: 252 }
  }
};

/**
 * Check if a base item type matches an item category
 * @param {string} baseType - The base item (e.g., "Ancient Axe")
 * @param {string} categories - Comma-separated categories (e.g., "WeaponP, Circlet")
 * @returns {boolean} True if the item matches any of the categories
 */
function itemMatchesCategories(baseType, categories) {
  if (!categories || !baseType) return false;

  // Handle both comma-separated strings and single category strings
  const categoryList = Array.isArray(categories)
    ? categories
    : categories.split(',').map(c => c.trim());

  for (const category of categoryList) {
    // Check if the category exists in our mapping
    if (itemTypeCategories[category]?.has(baseType)) {
      return true;
    }

    // Direct match (for specific item types not in categories)
    if (category === baseType) {
      return true;
    }
  }

  return false;
}

class CraftedItemsSystem {
  constructor() {
    this.craftedItems = []; // Array of crafted items
    this.nextId = 1;

    // Craft types with their fixed properties
    // IMPORTANT: Use the same property keys as regular items (edmg, lleech, tolife, etc.)
    this.craftTypes = {
      blood: {
        label: 'Blood Weapon',
        itemType: 'weapon',
        fixedProperties: {
          edmg: { min: 50, max: 80 },      // Enhanced Damage
          lleech: { min: 3, max: 6 },      // Life Stolen per Hit
          tolife: { min: 10, max: 20 }     // +Life
        },
        requiresAffixes: true
      },
      bloodarmor: {
        label: 'Blood Armor',
        itemType: 'armor',
        fixedProperties: {
          repl: { min: 3, max: 6 },        // Life after each Kill (Replenish Life)
          lleech: { min: 3, max: 6 },      // Life Stolen per Hit
          tolife: { min: 20, max: 40 }     // +Life
        },
        requiresAffixes: true
      },
      bloodhelm: {
        label: 'Blood Helm',
        itemType: 'helm',
        fixedProperties: {
          cb: { min: 10, max: 20 },        // Chance of Crushing Blow
          lleech: { min: 2, max: 4 },      // Life Stolen per Hit
          tolife: { min: 10, max: 20 }     // +Life
        },
        requiresAffixes: true
      }
      // More craft types can be added here later
    };
  }

  /**
   * Get available affixes for a base item type
   * @param {string} baseType - Base item (e.g., "Ancient Axe")
   * @param {string} affixType - 'prefixes' or 'suffixes'
   * @param {Array<number>} excludeGroups - Groups to exclude (already selected affixes)
   * @returns {Array} Available affixes with their data
   */
  getAvailableAffixes(baseType, affixType = 'prefixes', excludeGroups = []) {
    const affixes = [];
    const affixPool = affixDatabase[affixType];

    if (!affixPool) return affixes;

    for (const [name, data] of Object.entries(affixPool)) {
      // Skip if group is already used
      if (excludeGroups.includes(data.group)) continue;

      // Check if this affix can spawn on this base type
      const matchesType = data.itemTypes.some(category =>
        itemMatchesCategories(baseType, category)
      );

      if (matchesType) {
        affixes.push({
          name,
          ...data,
          // Add property keys for easy access
          propKeys: Object.keys(data.stats)
        });
      }
    }

    return affixes;
  }

  /**
   * Validate that selected affixes don't have duplicate groups
   * @param {Object} affixes - {prefixes: {name: value}, suffixes: {name: value}}
   * @returns {Object} {valid: boolean, error: string}
   */
  validateAffixGroups(affixes) {
    const usedGroups = new Set();

    // Check prefixes
    for (const name of Object.keys(affixes.prefixes || {})) {
      const affix = affixDatabase.prefixes[name];
      if (!affix) continue;

      if (usedGroups.has(affix.group)) {
        return { valid: false, error: `Cannot have multiple affixes from group ${affix.group}` };
      }
      usedGroups.add(affix.group);
    }

    // Check suffixes
    for (const name of Object.keys(affixes.suffixes || {})) {
      const affix = affixDatabase.suffixes[name];
      if (!affix) continue;

      if (usedGroups.has(affix.group)) {
        return { valid: false, error: `Cannot have multiple affixes from group ${affix.group}` };
      }
      usedGroups.add(affix.group);
    }

    return { valid: true };
  }

  /**
   * Roll affix values and convert to properties
   * @param {Object} affixSelection - {prefixes: {name: true/false}, suffixes: {name: true/false}}
   * @returns {Object} {prefixes: {propKey: value}, suffixes: {propKey: value}}
   */
  rollAffixValues(affixSelection) {
    const result = { prefixes: {}, suffixes: {} };

    // Roll prefix values
    for (const name of Object.keys(affixSelection.prefixes || {})) {
      const affix = affixDatabase.prefixes[name];
      if (!affix) continue;

      // Roll each stat in the affix
      for (const [propKey, range] of Object.entries(affix.stats)) {
        const value = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        // If propKey already exists, add to it (for multi-stat affixes)
        result.prefixes[propKey] = (result.prefixes[propKey] || 0) + value;
      }
    }

    // Roll suffix values
    for (const name of Object.keys(affixSelection.suffixes || {})) {
      const affix = affixDatabase.suffixes[name];
      if (!affix) continue;

      for (const [propKey, range] of Object.entries(affix.stats)) {
        const value = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        result.suffixes[propKey] = (result.suffixes[propKey] || 0) + value;
      }
    }

    return result;
  }

  /**
   * Create a new crafted item
   * @param {string} name - Item name (up to 21 chars, alphanumeric + space)
   * @param {string} baseType - Base item type (e.g., "War Pike", "Hand Axe")
   * @param {string} craftType - Craft type (blood, etc.)
   * @param {Object} affixes - Selected affixes {prefixes: {propKey: value}, suffixes: {propKey: value}}
   * @returns {Object} Created crafted item or null if validation fails
   */
  createCraftedItem(name, baseType, craftType, affixes = { prefixes: {}, suffixes: {} }, fixedProperties = {}) {
    // Validate name
    if (!name || name.length > 21) {
      console.error('Crafted item name must be 1-21 characters');
      return null;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
      console.error('Crafted item name can only contain letters, numbers, and spaces');
      return null;
    }

    // Validate craft type
    if (!this.craftTypes[craftType]) {
      console.error(`Invalid craft type: ${craftType}`);
      return null;
    }

    const craftConfig = this.craftTypes[craftType];

    // Validate base type based on craft type
    if (craftConfig.itemType === 'weapon') {
      // Weapons must have baseType in baseDamages
      if (!baseType || typeof baseDamages === 'undefined' || !baseDamages[baseType]) {
        console.error(`Invalid base weapon type: ${baseType}`);
        return null;
      }
    } else if (craftConfig.itemType === 'armor') {
      // Armor items must have baseType in armor category
      if (!baseType || !itemTypeCategories['Armor']?.has(baseType)) {
        console.error(`Invalid base armor type: ${baseType}`);
        return null;
      }
    } else if (craftConfig.itemType === 'helm') {
      // Helms must have baseType in helm category (checking base type categories from main.js)
      if (!baseType) {
        console.error(`Invalid base helm type: ${baseType}`);
        return null;
      }
      // For helms, we'll accept any helm-like type for now
    }

    // Validate affixes only if this craft type requires them
    if (craftConfig.requiresAffixes) {
      const prefixCount = Object.keys(affixes.prefixes || {}).length;
      const suffixCount = Object.keys(affixes.suffixes || {}).length;
      const totalAffixes = prefixCount + suffixCount;

      if (totalAffixes < 3 || totalAffixes > 6) {
        console.error(`Total affixes must be between 3-6 (got ${totalAffixes})`);
        return null;
      }

      if (prefixCount > 3 || suffixCount > 3) {
        console.error(`Maximum 3 prefixes and 3 suffixes (got ${prefixCount} prefixes, ${suffixCount} suffixes)`);
        return null;
      }
    }

    // Build properties object (same structure as regular items)
    const properties = {};

    // Add strength requirement from baseStrengths (if defined)
    if (typeof baseStrengths !== 'undefined' && baseStrengths[baseType]) {
      properties.reqstr = baseStrengths[baseType];
    }

    // Add required level from baseRequiredLevels lookup table
    if (typeof baseRequiredLevels !== 'undefined' && baseRequiredLevels[baseType]) {
      properties.reqlvl = baseRequiredLevels[baseType];
    }

    // Get fixed properties from craft type and use user-selected values or roll random ones
    for (const [propKey, propData] of Object.entries(craftConfig.fixedProperties)) {
      // Use user-selected value if provided, otherwise roll a random value
      let value;
      if (fixedProperties && fixedProperties[propKey] !== undefined) {
        value = fixedProperties[propKey];
      } else {
        // Roll a random value within the range if not provided
        value = Math.floor(Math.random() * (propData.max - propData.min + 1)) + propData.min;
      }
      // If property already exists, add to it; otherwise set it
      properties[propKey] = (properties[propKey] || 0) + value;
    }

    // Add affix properties using their correct property keys
    if (affixes.prefixes) {
      for (const [propKey, value] of Object.entries(affixes.prefixes)) {
        // If property already exists, add to it; otherwise set it
        properties[propKey] = (properties[propKey] || 0) + value;
      }
    }

    if (affixes.suffixes) {
      for (const [propKey, value] of Object.entries(affixes.suffixes)) {
        // If property already exists, add to it; otherwise set it
        properties[propKey] = (properties[propKey] || 0) + value;
      }
    }

    // Create crafted item as a complete item object
    const fullName = `${name} ${baseType}`;

    const craftedItem = {
      id: `craft_${this.nextId++}`,
      name: name, // Short name (e.g. "myTestWeapon")
      baseType: baseType, // Base type (e.g. "War Pike") - needed for dynamic generation
      baseItemName: baseType, // Reference to original base item name
      fullName: fullName, // Full display name (e.g. "myTestWeapon War Pike")
      isCrafted: true, // Flag to identify crafted items
      craftType: craftType,
      craftTypeLabel: craftConfig.label,
      itemType: craftConfig.itemType, // Item type from craft config (weapon, armor, helm)
      properties: properties, // Properties using same keys as regular items
      // NO description property - let generateItemDescription() handle it
      createdAt: new Date().toISOString()
    };

    this.craftedItems.push(craftedItem);
    return craftedItem;
  }

  /**
   * Get all crafted items of a specific type (weapon, armor, etc.)
   * @param {string} itemType - Item type (weapon, helm, armor, etc.)
   * @returns {Array} Array of crafted items for that type
   */
  getCraftedItemsByType(itemType) {
    return this.craftedItems.filter(item => item.itemType === itemType);
  }

  /**
   * Get all crafted items
   * @returns {Array} All crafted items
   */
  getAllCraftedItems() {
    return [...this.craftedItems];
  }

  /**
   * Get a crafted item by its full name
   * @param {string} fullName - The crafted item's full name (e.g. "myTestWeapon War Pike")
   * @returns {Object|null} The crafted item or null if not found
   */
  getCraftedItemByName(fullName) {
    return this.craftedItems.find(item => item.fullName === fullName) || null;
  }

  /**
   * Check if an item name refers to a crafted item
   * @param {string} itemName - Item name to check
   * @returns {boolean} True if it's a crafted item
   */
  isCraftedItem(itemName) {
    return this.craftedItems.some(item => item.fullName === itemName);
  }

  /**
   * Delete a crafted item by ID
   * @param {string} id - Crafted item ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteCraftedItem(id) {
    const index = this.craftedItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.craftedItems.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Load crafted items from saved data
   * @param {Array} data - Array of crafted items from backend or character_data
   */
  loadFromData(data) {
    if (!Array.isArray(data)) return;

    this.craftedItems = [...data];

    // Update nextId to ensure no conflicts
    if (data.length > 0) {
      const maxId = Math.max(...data.map(item => parseInt(item.id.split('_')[1]) || 0));
      this.nextId = maxId + 1;
    }
  }

  /**
   * Export crafted items for saving to character_data
   * @returns {Array} Serialized crafted items
   */
  exportToData() {
    return JSON.parse(JSON.stringify(this.craftedItems));
  }

  /**
   * Clear all crafted items
   */
  clear() {
    this.craftedItems = [];
    this.nextId = 1;
  }
}

// Initialize global crafted items system
window.craftedItemsSystem = new CraftedItemsSystem();

// Expose affix database and item type categories globally for UI access
window.affixDatabase = affixDatabase;
window.itemTypeCategories = itemTypeCategories;

// Debug: Confirm exposure
console.log('craftedItems.js loaded - affixDatabase exposed:', {
  hasPrefixes: !!window.affixDatabase?.prefixes,
  prefixCount: Object.keys(window.affixDatabase?.prefixes || {}).length,
  hasSuffixes: !!window.affixDatabase?.suffixes,
  suffixCount: Object.keys(window.affixDatabase?.suffixes || {}).length
});
