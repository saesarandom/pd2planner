// upgrade.js - Complete standalone upgrade system

// All upgrade definitions from itemupgrade.js
const upgradeDefinitions = {
  helms: {
    "Biggin's Bonnet": {
      exceptional: {
        name: "Biggin's Bonnet",
        base: "War Hat",
        properties: {
          defense: 53,
          reqstr: 20,
          reqlvl: 22,
        },
      },
      elite: {
        name: "Biggin's Bonnet",
        base: "Shako",
        properties: {
          defense: 141,
          reqstr: 50,
          reqlvl: 43,
        },
      },
    },
    Tarnhelm: {
      exceptional: {
        name: "Tarnhelm",
        base: "Sallet",
        properties: {
          defense: 62,
          reqstr: 43,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Tarnhelm",
        base: "Hydraskull",
        properties: {
          defense: 145,
          reqstr: 84,
          reqlvl: 47,
        },
      },
    },
    "Coif of Glory": {
      exceptional: {
        name: "Coif of Glory",
        base: "Casque",
        properties: {
          defense: 82,
          reqstr: 59,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Coif of Glory",
        base: "Armet",
        properties: {
          defense: 159,
          reqstr: 109,
          reqlvl: 51,
        },
      },
    },
    Duskeep: {
      exceptional: {
        name: "Duskeep",
        base: "Basinet",
        properties: {
          defense: 147,
          reqstr: 59,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Duskeep",
        base: "Giant Conch",
        properties: {
          defense: 252,
          reqstr: 109,
          reqlvl: 40,
        },
      },
    },
    "The Face of Horror": {
      exceptional: {
        name: "The Face of Horror",
        base: "Death Mask",
        properties: {
          defense: 111,
          reqstr: 55,
          reqlvl: 25,
        },
      },
      elite: {
        name: "The Face of Horror",
        base: "Demonhead",
        properties: {
          defense: 179,
          reqstr: 102,
          reqlvl: 55,
        },
      },
    },
    "The Face of Horror": {
      exceptional: {
        name: "The Face of Horror",
        base: "Death Mask",
        properties: {
          defense: 111,
          reqstr: 55,
          reqlvl: 25,
        },
      },
      elite: {
        name: "The Face of Horror",
        base: "Demonhead",
        properties: {
          defense: 179,
          reqstr: 102,
          reqlvl: 55,
        },
      },
    },
    Wormskull: {
      exceptional: {
        name: "Wormskull",
        base: "Grim Helm",
        properties: {
          defense: 125,
          reqstr: 55,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Wormskull",
        base: "Bone Visage",
        properties: {
          defense: 157,
          reqstr: 102,
          reqlvl: 63,
        },
      },
    },
    Howltusk: {
      exceptional: {
        name: "Howltusk",
        base: "Winged Helm",
        properties: {
          defense: 177,
          reqstr: 115,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Howltusk",
        base: "Spired Helm",
        properties: {
          defense: 287,
          reqstr: 192,
          reqlvl: 59,
        },
      },
    },
    "Undead Crown": {
      exceptional: {
        name: "Undead Crown",
        base: "Grand Crown",
        properties: {
          defense: 153,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Undead Crown",
        base: "Corona",
        properties: {
          defense: 195,
          reqstr: 174,
          reqlvl: 66,
        },
      },
    },
    "Peasant Crown": {
      exceptional: {
        name: "Peasant Crown",
        base: "War Hat",
        properties: {
          defense: 108,
          reqstr: 20,
          reqlvl: 28,
        },
      },
      elite: {
        name: "Peasant Crown",
        base: "Shako",
        properties: {
          defense: 100,
          reqstr: 150,
          reqlvl: 43,
        },
      },
    },
    Rockstopper: {
      exceptional: {
        name: "Rockstopper",
        base: "Sallet",
        properties: {
          defense: 84,
          reqstr: 20,
          reqlvl: 31,
        },
      },
      elite: {
        name: "Rockstopper",
        base: "Hydraskull",
        properties: {
          defense: 100,
          reqstr: 150,
          reqlvl: 47,
        },
      },
    },
    Stealskull: {
      exceptional: {
        name: "Stealskull",
        base: "Casque",
        properties: {
          defense: 244,
          reqstr: 59,
          reqlvl: 35,
        },
      },
      elite: {
        name: "Stealskull",
        base: "Armet",
        properties: {
          defense: 250,
          reqstr: 109,
          reqlvl: 51,
        },
      },
    },
    "Darksight Helm": {
      exceptional: {
        name: "Darksight Helm",
        base: "Basinet",
        properties: {
          defense: 84,
          reqstr: 82,
          reqlvl: 38,
        },
      },
      elite: {
        name: "Darksight Helm",
        base: "Giant Conch",
        properties: {
          defense: 154,
          reqstr: 142,
          reqlvl: 40,
        },
      },
    },
    "Blackhorn's Face": {
      exceptional: {
        name: "Blackhorn's Face",
        base: "Death Mask",
        properties: {
          defense: 278,
          reqstr: 55,
          reqlvl: 41,
        },
      },
      elite: {
        name: "Blackhorn's Face",
        base: "Bone Visage",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 63,
        },
      },
    },
    "Valkyrie Wing": {
      exceptional: {
        name: "Valkyrie Wing",
        base: "Winged Helm",
        properties: {
          defense: 278,
          reqstr: 115,
          reqlvl: 44,
        },
      },
      elite: {
        name: "Valkyrie Wing",
        base: "Spired Helm",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 59,
        },
      },
    },
    "Crown of Thieves": {
      exceptional: {
        name: "Crown of Thieves",
        base: "Grand Crown",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 49,
        },
      },
      elite: {
        name: "Crown of Thieves",
        base: "Corona",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 66,
        },
      },
    },
    "Cyclopean Roar": {
      exceptional: {
        name: "Cyclopean Roar",
        base: "Jawbone Visor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 28,
        },
      },
      elite: {
        name: "Cyclopean Roar",
        base: "Carnage Helm",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 43,
        },
      },
    },
    "Arreat's Face": {
      exceptional: {
        name: "Arreat's Face",
        base: "Slayer Guard",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 42,
        },
      },
      elite: {
        name: "Arreat's Face",
        base: "Guardian Crown",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 65,
        },
      },
    },
  },
  armors: {
    Greyform: {
      exceptional: {
        name: "Greyform",
        base: "Ghost Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 22,
        },
      },
      elite: {
        name: "Greyform",
        base: "Dusk Shroud",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 49,
        },
      },
    },
    "Blinkbat's Form": {
      exceptional: {
        name: "Blinkbat's Form",
        base: "Serpentskin Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 24,
        },
      },
      elite: {
        name: "Blinkbat's Form",
        base: "Wyrmhide",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 50,
        },
      },
    },
    "The Centurion": {
      exceptional: {
        name: "The Centurion",
        base: "Demonhide Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "The Centurion",
        base: "Scarab Husk",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 51,
        },
      },
    },
    Twitchthroe: {
      exceptional: {
        name: "Twitchthroe",
        base: "Trellised Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Twitchthroe",
        base: "Wire Fleece",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 53,
        },
      },
    },
    Darkglow: {
      exceptional: {
        name: "Darkglow",
        base: "Linked Mail",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Darkglow",
        base: "Diamond Mail",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 54,
        },
      },
    },
    Hawkmail: {
      exceptional: {
        name: "Hawkmail",
        base: "Tigulated Mail",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Hawkmail",
        base: "Loricated Mail",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 55,
        },
      },
    },
    "Sparking Mail": {
      exceptional: {
        name: "Sparking Mail",
        base: "Mesh Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Sparking Mail",
        base: "Boneweave",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 47,
        },
      },
    },
    "Venom Ward": {
      exceptional: {
        name: "Venom Ward",
        base: "Cuirass",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Venom Ward",
        base: "Great Hauberk",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 56,
        },
      },
    },
    Iceblink: {
      exceptional: {
        name: "Iceblink",
        base: "Russet Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Iceblink",
        base: "Balrog Skin",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 57,
        },
      },
    },
    Boneflesh: {
      exceptional: {
        name: "Boneflesh",
        base: "Templar Coat",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Boneflesh",
        base: "Hellforge Plate",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 59,
        },
      },
    },
    Rockfleece: {
      exceptional: {
        name: "Rockfleece",
        base: "Sharktooth Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Rockfleece",
        base: "Kraken Shell",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 61,
        },
      },
    },
    Rattlecage: {
      exceptional: {
        name: "Rattlecage",
        base: "Embossed Plate",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Rattlecage",
        base: "Lacquered Plate",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 62,
        },
      },
    },
    "Heavenly Garb": {
      exceptional: {
        name: "Heavenly Garb",
        base: "Mage Plate",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Heavenly Garb",
        base: "Archon Plate",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 63,
        },
      },
    },
    Goldskin: {
      exceptional: {
        name: "Goldskin",
        base: "Chaos Armor",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Goldskin",
        base: "Shadow Plate",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 64,
        },
      },
    },
    "Silks of the Victor": {
      exceptional: {
        name: "Silks of the Victor",
        base: "Ornate Plate",
        properties: {
          defense: 278,
          reqstr: 103,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Silks of the Victor",
        base: "Sacred Armor",
        properties: {
          defense: 100,
          reqstr: 106,
          reqlvl: 66,
        },
      },
    },
  },
  weapons: {
    "The Gnasher": {
      exceptional: {
        name: "The Gnasher",
        base: "Hatchet",
        properties: {
          reqstr: 25,
          reqlvl: 19,
        },
      },
      elite: {
        name: "The Gnasher",
        base: "Tomahawk",
        properties: {
          reqstr: 125,
          reqlvl: 40,
        },
      },
    },
    Bladebone: {
      exceptional: {
        name: "Bladebone",
        base: "Twin Axe",
        properties: {
          reqstr: 25,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Bladebone",
        base: "Ettin Axe",
        properties: {
          reqstr: 125,
          reqlvl: 52,
        },
      },
    },
    "Skull Splitter": {
      exceptional: {
        name: "Skull Splitter",
        base: "Crowbill",
        properties: {
          reqstr: 125,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Skull Splitter",
        base: "War Spike",
        properties: {
          reqstr: 125,
          reqlvl: 59,
        },
      },
    },
    Rakescar: {
      exceptional: {
        name: "Rakescar",
        base: "Naga",
        properties: {
          reqstr: 125,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Rakescar",
        base: "Berserker Axe",
        properties: {
          reqstr: 125,
          reqlvl: 64,
        },
      },
    },
    "Axe of Fechmar": {
      exceptional: {
        name: "Axe of Fechmar",
        base: "Military Axe",
        properties: {
          reqstr: 125,
          reqlvl: 22,
        },
      },
      elite: {
        name: "Axe of Fechmar",
        base: "Feral Axe",
        properties: {
          reqstr: 125,
          reqlvl: 42,
        },
      },
    },
    Goreshovel: {
      exceptional: {
        name: "Goreshovel",
        base: "Bearded Axe",
        properties: {
          reqstr: 93,
          reqlvl: 41,
        },
      },
      elite: {
        name: "Goreshovel",
        base: "Silver-Edged Axe",
        properties: {
          reqstr: 125,
          reqlvl: 25,
        },
      },
    },
    "The Chieftain": {
      exceptional: {
        name: "The Chieftain",
        base: "Tabar",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "The Chieftain",
        base: "Decapitator",
        properties: {
          reqstr: 195,
          reqlvl: 54,
        },
      },
    },
    Brainhew: {
      exceptional: {
        name: "Brainhew",
        base: "Gothic Axe",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Brainhew",
        base: "Champion Axe",
        properties: {
          reqstr: 195,
          reqlvl: 61,
        },
      },
    },
    Humongous: {
      exceptional: {
        name: "Humongous",
        base: "Ancient Axe",
        properties: {
          reqstr: 195,
          reqlvl: 29,
        },
      },
      elite: {
        name: "Humongous",
        base: "Glorious Axe",
        properties: {
          reqstr: 195,
          reqlvl: 66,
        },
      },
    },
    Felloak: {
      exceptional: {
        name: "Felloak",
        base: "Cudgel",
        properties: {
          reqstr: 195,
          reqlvl: 18,
        },
      },
      elite: {
        name: "Felloak",
        base: "Truncheon",
        properties: {
          reqstr: 195,
          reqlvl: 39,
        },
      },
    },
    Stoutnail: {
      exceptional: {
        name: "Stoutnail",
        base: "Barbed Club",
        properties: {
          reqstr: 195,
          reqlvl: 20,
        },
      },
      elite: {
        name: "Stoutnail",
        base: "Tyrant Club",
        properties: {
          reqstr: 195,
          reqlvl: 42,
        },
      },
    },
    Crushflange: {
      exceptional: {
        name: "Crushflange",
        base: "Flanged Mace",
        properties: {
          reqstr: 195,
          reqlvl: 23,
        },
      },
      elite: {
        name: "Crushflange",
        base: "Reinforced Mace",
        properties: {
          reqstr: 195,
          reqlvl: 47,
        },
      },
    },
    Bloodrise: {
      exceptional: {
        name: "Bloodrise",
        base: "Jagged Star",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Bloodrise",
        base: "Devil Star",
        properties: {
          reqstr: 195,
          reqlvl: 52,
        },
      },
    },
    "The General's Tan Do Li Ga": {
      exceptional: {
        name: "The General's Tan Do Li Ga",
        base: "Knout",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "The General's Tan Do Li Ga",
        base: "Scourge",
        properties: {
          reqstr: 195,
          reqlvl: 57,
        },
      },
    },
    Ironstone: {
      exceptional: {
        name: "Ironstone",
        base: "Battle Hammer",
        properties: {
          reqstr: 195,
          reqlvl: 27,
        },
      },
      elite: {
        name: "Ironstone",
        base: "Legendary Hammer",
        properties: {
          reqstr: 195,
          reqlvl: 61,
        },
      },
    },
    Bonesnap: {
      exceptional: {
        name: "Bonesnap",
        base: "War Club",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Bonesnap",
        base: "Ogre Maul",
        properties: {
          reqstr: 195,
          reqlvl: 51,
        },
      },
    },
    Steeldriver: {
      exceptional: {
        name: "Steeldriver",
        base: "Martel de Fer",
        properties: {
          reqstr: 195,
          reqlvl: 29,
        },
      },
      elite: {
        name: "Steeldriver",
        base: "Thunder Maul",
        properties: {
          reqstr: 195,
          reqlvl: 65,
        },
      },
    },
    "Rixot's Keen": {
      exceptional: {
        name: "Rixot's Keen",
        base: "Gladius",
        properties: {
          reqstr: 195,
          reqlvl: 18,
        },
      },
      elite: {
        name: "Rixot's Keen",
        base: "Falcata",
        properties: {
          reqstr: 195,
          reqlvl: 42,
        },
      },
    },
    "Blood Crescent": {
      exceptional: {
        name: "Blood Crescent",
        base: "Cutlass",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Blood Crescent",
        base: "Ataghan",
        properties: {
          reqstr: 195,
          reqlvl: 45,
        },
      },
    },
    "Skewer of Krintiz": {
      exceptional: {
        name: "Skewer of Krintiz",
        base: "Shamsir",
        properties: {
          reqstr: 195,
          reqlvl: 23,
        },
      },
      elite: {
        name: "Skewer of Krintiz",
        base: "Elegant Blade",
        properties: {
          reqstr: 195,
          reqlvl: 47,
        },
      },
    },
    Gleamscythe: {
      exceptional: {
        name: "Gleamscythe",
        base: "Tulwar",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Gleamscythe",
        base: "Hydra Edge",
        properties: {
          reqstr: 195,
          reqlvl: 51,
        },
      },
    },
    "Griswold's Edge": {
      exceptional: {
        name: "Griswold's Edge",
        base: "Battle Sword",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Griswold's Edge",
        base: "Conquest Sword",
        properties: {
          reqstr: 195,
          reqlvl: 58,
        },
      },
    },
    Hellplague: {
      exceptional: {
        name: "Hellplague",
        base: "Rune Sword",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Hellplague",
        base: "Cryptic Sword",
        properties: {
          reqstr: 195,
          reqlvl: 61,
        },
      },
    },
    "Culwen's Point": {
      exceptional: {
        name: "Culwen's Point",
        base: "Ancient Sword",
        properties: {
          reqstr: 195,
          reqlvl: 29,
        },
      },
      elite: {
        name: "Culwen's Point",
        base: "Mythical Sword",
        properties: {
          reqstr: 195,
          reqlvl: 65,
        },
      },
    },
    Shadowfang: {
      exceptional: {
        name: "Shadowfang",
        base: "Espandon",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Shadowfang",
        base: "Legend Sword",
        properties: {
          reqstr: 195,
          reqlvl: 44,
        },
      },
    },
    Soulflay: {
      exceptional: {
        name: "Soulflay",
        base: "Dacian Falx",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Soulflay",
        base: "Highland Blade",
        properties: {
          reqstr: 195,
          reqlvl: 49,
        },
      },
    },
    "Kinemil's Awl": {
      exceptional: {
        name: "Kinemil's Awl",
        base: "Tusk Sword",
        properties: {
          reqstr: 195,
          reqlvl: 29,
        },
      },
      elite: {
        name: "Kinemil's Awl",
        base: "Balrog Blade",
        properties: {
          reqstr: 195,
          reqlvl: 65,
        },
      },
    },
    Blacktongue: {
      exceptional: {
        name: "Blacktongue",
        base: "Gothic Sword",
        properties: {
          reqstr: 195,
          reqlvl: 26,
        },
      },
      elite: {
        name: "Blacktongue",
        base: "Champion Sword",
        properties: {
          reqstr: 195,
          reqlvl: 57,
        },
      },
    },
    Ripsaw: {
      exceptional: {
        name: "Ripsaw",
        base: "Zweihander",
        properties: {
          reqstr: 195,
          reqlvl: 26,
        },
      },
      elite: {
        name: "Ripsaw",
        base: "Colossus Sword",
        properties: {
          reqstr: 195,
          reqlvl: 60,
        },
      },
    },
    "The Patriarch": {
      exceptional: {
        name: "The Patriarch",
        base: "Executioner Sword",
        properties: {
          reqstr: 195,
          reqlvl: 29,
        },
      },
      elite: {
        name: "The Patriarch",
        base: "Colossus Blade",
        properties: {
          reqstr: 195,
          reqlvl: 63,
        },
      },
    },
    Gull: {
      exceptional: {
        name: "Gull",
        base: "Poignard",
        properties: {
          reqstr: 195,
          reqlvl: 19,
        },
      },
      elite: {
        name: "Gull",
        base: "Bone Knife",
        properties: {
          reqstr: 195,
          reqlvl: 43,
        },
      },
    },
    "The Diggler": {
      exceptional: {
        name: "The Diggler",
        base: "Rondel",
        properties: {
          reqstr: 195,
          reqlvl: 24,
        },
      },
      elite: {
        name: "The Diggler",
        base: "Mithril Point",
        properties: {
          reqstr: 195,
          reqlvl: 52,
        },
      },
    },
    "The Jade Tan Do": {
      exceptional: {
        name: "The Jade Tan Do",
        base: "Cinquedeas",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "The Jade Tan Do",
        base: "Fanged Knife",
        properties: {
          reqstr: 195,
          reqlvl: 62,
        },
      },
    },
    "Spectral Shard": {
      exceptional: {
        name: "Spectral Shard",
        base: "Stiletto",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Spectral Shard",
        base: "Legend Spike",
        properties: {
          reqstr: 195,
          reqlvl: 66,
        },
      },
    },
    // "The Gidbinn": {
    //   exceptional: {
    //     name: "The Gidbinn",
    //     base: "Dagger",
    //     properties: {
    //       reqstr: 195,
    //       reqlvl: 0,
    //     },
    //   },
    //   elite: {
    //     name: "The Gidbinn",
    //     base: "Dagger",
    //     properties: {
    //       reqstr: 195,
    //       reqlvl: 0,
    //     },
    //   },
    // },
    "The Dragon Chang": {
      exceptional: {
        name: "The Dragon Chang",
        base: "War Spear",
        properties: {
          reqstr: 195,
          reqlvl: 21,
        },
      },
      elite: {
        name: "The Dragon Chang",
        base: "Hyperion Spear",
        properties: {
          reqstr: 195,
          reqlvl: 43,
        },
      },
    },
    Razortine: {
      exceptional: {
        name: "Razortine",
        base: "Fuscina",
        properties: {
          reqstr: 195,
          reqlvl: 24,
        },
      },
      elite: {
        name: "Razortine",
        base: "Stygian Pike",
        properties: {
          reqstr: 195,
          reqlvl: 49,
        },
      },
    },
    Bloodthief: {
      exceptional: {
        name: "Bloodthief",
        base: "War Fork",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Bloodthief",
        base: "Mancatcher",
        properties: {
          reqstr: 195,
          reqlvl: 55,
        },
      },
    },
    "Lance of Yaggai": {
      exceptional: {
        name: "Lance of Yaggai",
        base: "Yari",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Lance of Yaggai",
        base: "Ghost Spear",
        properties: {
          reqstr: 195,
          reqlvl: 62,
        },
      },
    },
    "The Tannr Gorerod": {
      exceptional: {
        name: "The Tannr Gorerod",
        base: "Lance",
        properties: {
          reqstr: 195,
          reqlvl: 27,
        },
      },
      elite: {
        name: "The Tannr Gorerod",
        base: "War Pike",
        properties: {
          reqstr: 195,
          reqlvl: 66,
        },
      },
    },
    "Dimoak's Hew": {
      exceptional: {
        name: "Dimoak's Hew",
        base: "Lochaber Axe",
        properties: {
          reqstr: 195,
          reqlvl: 21,
        },
      },
      elite: {
        name: "Dimoak's Hew",
        base: "Ogre Axe",
        properties: {
          reqstr: 195,
          reqlvl: 45,
        },
      },
    },
    Steelgoad: {
      exceptional: {
        name: "Steelgoad",
        base: "Bill",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Steelgoad",
        base: "Colossus Voulge",
        properties: {
          reqstr: 195,
          reqlvl: 48,
        },
      },
    },
    "The Battlebranch": {
      exceptional: {
        name: "The Battlebranch",
        base: "Partizan",
        properties: {
          reqstr: 195,
          reqlvl: 25,
        },
      },
      elite: {
        name: "The Battlebranch",
        base: "Cryptic Axe",
        properties: {
          reqstr: 195,
          reqlvl: 59,
        },
      },
    },
    Woestave: {
      exceptional: {
        name: "Woestave",
        base: "Bec-de-Corbin",
        properties: {
          reqstr: 195,
          reqlvl: 28,
        },
      },
      elite: {
        name: "Woestave",
        base: "Great Poleaxe",
        properties: {
          reqstr: 195,
          reqlvl: 63,
        },
      },
    },
    "The Grim Reaper": {
      exceptional: {
        name: "The Grim Reaper",
        base: "Grim Scythe",
        properties: {
          reqstr: 195,
          reqlvl: 29,
        },
      },
      elite: {
        name: "The Grim Reaper",
        base: "Giant Thresher",
        properties: {
          reqstr: 195,
          reqlvl: 66,
        },
      },
    },
    "True Silver": {
      exceptional: {
        name: "True Silver",
        base: "Ceremonial Javelin",
        properties: {
          reqstr: 25,
          reqlvl: 26,
        },
      },
      elite: {
        name: "True Silver",
        base: "Matriarchal Javelin",
        properties: {
          reqstr: 195,
          reqlvl: 48,
        },
      },
    },
  },
  gloves: {
    "The Hand of Broc": {
      exceptional: {
        name: "The Hand of Broc",
        base: "Demonhide Gloves",
        properties: {
          defense: 22,
          reqstr: 25,
          reqlvl: 21,
        },
      },
      elite: {
        name: "The Hand of Broc",
        base: "Bramble Mitts",
        properties: {
          defense: 44,
          reqstr: 125,
          reqlvl: 42,
        },
      },
    },
    Bloodfist: {
      exceptional: {
        name: "Bloodfist",
        base: "Sharkskin Gloves",
        properties: {
          defense: 35,
          reqstr: 25,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Bloodfist",
        base: "Vampirebone Gloves",
        properties: {
          defense: 62,
          reqstr: 50,
          reqlvl: 47,
        },
      },
    },
    "Chance Guards": {
      exceptional: {
        name: "Chance Guards",
        base: "Heavy Bracers",
        properties: {
          defense: 42,
          reqstr: 25,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Chance Guards",
        base: "Vambraces",
        properties: {
          defense: 68,
          reqstr: 50,
          reqlvl: 51,
        },
      },
    },
    Magefist: {
      exceptional: {
        name: "Magefist",
        base: "Battle Gauntlets",
        properties: {
          defense: 42,
          reqstr: 45,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Magefist",
        base: "Crusader Gauntlets",
        properties: {
          defense: 68,
          reqstr: 88,
          reqlvl: 57,
        },
      },
    },
    Frostburn: {
      exceptional: {
        name: "Frostburn",
        base: "Heavy Bracers",
        properties: {
          defense: 52,
          reqstr: 58,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Frostburn",
        base: "Ogre Gauntlets",
        properties: {
          defense: 78,
          reqstr: 96,
          reqlvl: 64,
        },
      },
    },
  },
  belts: {
    Lenymo: {
      exceptional: {
        name: "Lenymo",
        base: "Demonhide Sash",
        properties: {
          defense: 2,
          reqstr: 20,
          reqlvl: 24,
        },
      },
      elite: {
        name: "Lenymo",
        base: "Spiderweb Sash",
        properties: {
          defense: 34,
          reqstr: 125,
          reqlvl: 46,
        },
      },
    },
    Snakecord: {
      exceptional: {
        name: "Snakecord",
        base: "Sharkskin Belt",
        properties: {
          defense: 42,
          reqstr: 20,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Snakecord",
        base: "Vampirefang Belt",
        properties: {
          defense: 72,
          reqstr: 50,
          reqlvl: 51,
        },
      },
    },
    Nightsmoke: {
      exceptional: {
        name: "Nightsmoke",
        base: "Mesh Belt",
        properties: {
          defense: 49,
          reqstr: 58,
          reqlvl: 25,
        },
      },
      elite: {
        name: "Nightsmoke",
        base: "Mithril Coil",
        properties: {
          defense: 82,
          reqstr: 88,
          reqlvl: 56,
        },
      },
    },
    Goldwrap: {
      exceptional: {
        name: "Goldwrap",
        base: "Battle Belt",
        properties: {
          defense: 45,
          reqstr: 45,
          reqlvl: 27,
        },
      },
      elite: {
        name: "Goldwrap",
        base: "War Belt",
        properties: {
          defense: 75,
          reqstr: 88,
          reqlvl: 62,
        },
      },
    },
    Bladebuckle: {
      exceptional: {
        name: "Bladebuckle",
        base: "War Belt",
        properties: {
          defense: 52,
          reqstr: 60,
          reqlvl: 39,
        },
      },
      elite: {
        name: "Bladebuckle",
        base: "Colossus Girdle",
        properties: {
          defense: 90,
          reqstr: 106,
          reqlvl: 67,
        },
      },
    },
    "String of Ears": {
      exceptional: {
        name: "String of Ears",
        base: "Demonhide Sash",
        properties: {
          defense: 42,
          reqstr: 20,
          reqlvl: 29,
        },
      },
      elite: {
        name: "String of Ears",
        base: "Spiderweb Sash",
        properties: {
          defense: 66,
          reqstr: 47,
          reqlvl: 46,
        },
      },
    },
  },
};

// Base strength requirements from itemupgrade.js
const baseStrengths = {
  Cap: 0,
  "Skull Cap": 15,
  Helm: 26,
  "Full Helm": 41,
  Mask: 23,
  "Bone Helm": 25,
  "Great Helm": 63,
  Crown: 55,
  "War Hat": 20,
  Shako: 50,
  Sallet: 43,
  Hydraskull: 84,
  Casque: 59,
  Basinet: 82,
  "Giant Conch": 142,
  Armet: 109,
  "Death Mask": 55,
  Demonhead: 102,
  "Grim Helm": 58,
  "Bone Visage": 106,
  "Winged Helm": 115,
  "Spired Helm": 192,
  "Grand Crown": 103,
  Corona: 174,
  "Jawbone Visor": 58,
  "Carnage Helm": 106,
  "Quilted Armor": 12,
  "Leather Armor": 15,
  "Hard Leather Armor": 20,
  "Studded Leather": 27,
  "Ring Mail": 36,
  "Scale Mail": 44,
  "Chain Mail": 48,
  "Breast Plate": 30,
  "Splint Mail": 51,
  "Plate Mail": 65,
  "Field Plate": 55,
  "Gothic Plate": 70,
  "Light Plate": 41,
  "Full Plate Mail": 80,
  "Ancient Armor": 100,
  "Ghost Armor": 38,
  "Serpentskin Armor": 43,
  "Demonhide Armor": 50,
  "Trellised Armor": 61,
  "Linked Mail": 74,
  "Tigulated Mail": 86,
  "Mesh Armor": 92,
  Cuirass: 65,
  "Russet Armor": 97,
  "Templar Coat": 118,
  "Sharktooth Armor": 103,
  "Embossed Plate": 125,
  "Mage Plate": 55,
  "Chaos Armor": 140,
  "Ornate Plate": 170,
  "Dusk Shroud": 77,
  Wyrmhide: 84,
  "Scarab Husk": 95,
  "Wire Fleece": 111,
  "Diamond Mail": 131,
  "Loricated Mail": 149,
  Boneweave: 158,
  "Great Hauberk": 118,
  "Balrog Skin": 165,
  "Hellforge Plate": 196,
  "Kraken Shell": 174,
  "Lacquered Plate": 208,
  "Archon Plate": 103,
  "Shadow Plate": 220,
  "Sacred Armor": 232,
  Circlet: 0,
  Tiara: 0,
  Diadem: 0,
  Coronet: 0,
  "Wolf Head": 16,
  "Hawk Helm": 20,
  Antlers: 24,
  "Falcon Mask": 28,
  "Spirit Mask": 30,
  "Jawbone Cap": 25,
  "Fanged Helm": 35,
  "Horned Helm": 45,
  "Assault Helmet": 55,
  "Avenger Guard": 65,
  "Slayer Guard": 118,
  "Guardian Crown": 196,
  Tomahawk: 125,
  Hatchet: 25,
  "Hand Axe": 0,
  Axe: 32,
  "Double Axe": 43,
  "Military Pick": 49,
  "War Axe": 67,
  "Large Axe": 35,
  "Broad Axe": 48,
  "Battle Axe": 54,
  "Great Axe": 63,
  "Giant Axe": 70,
  Buckler: 12,
  "Small Shield": 22,
  "Large Shield": 34,
  "Spiked Shield": 30,
  "Kite Shield": 47,
  "Bone Shield": 25,
  "Tower Shield": 75,
  "Gothic Shield": 60,
  Defender: 38,
  "Leather Gloves": 0,
  "Demonhide Gloves": 20,
  "Bramble Mitts": 50,
  "Heavy Gloves": 0,
  "Chain Gloves": 25,
  "Light Gauntlets": 45,
  Gauntlets: 60,
  "Sharkskin Gloves": 20,
  "Heavy Bracers": 58,
  "Battle Gauntlets": 88,
  "War Gauntlets": 110,
  "Vampirebone Gloves": 50,
  Vambraces: 106,
  "Crusader Gauntlets": 151,
  "Ogre Gauntlets": 185,
  Sash: 0,
  "Light Belt": 0,
  Belt: 25,
  "Heavy Belt": 45,
  "Plated Belt": 60,
  "Demonhide Sash": 20,
  "Sharkskin Belt": 20,
  "Mesh Belt": 58,
  "Battle Belt": 88,
  "War Belt": 110,
  "Mithril Coil": 106,
  "Troll Belt": 151,
  "Colossus Girdle": 185,
  "Spiderweb Sash": 50,
  "Vampirefang Belt": 50,

  // Maces
  Club: 0, // No value provided, defaulting to 0
  "Spiked Club": 0, // No value provided, defaulting to 0
  Mace: 27,
  "Morning Star": 36,
  Flail: 41,
  "War Hammer": 53,
  Maul: 69,
  "Great Maul": 99,

  // Swords
  "Short Sword": 0, // No value provided, defaulting to 0
  Scimitar: 0, // No value provided, defaulting to 0
  Sabre: 25,
  Falchion: 33,
  "Crystal Sword": 43,
  "Broad Sword": 48,
  "Long Sword": 55,
  "War Sword": 71,
  "Two-Handed Sword": 35,
  Claymore: 47,
  "Giant Sword": 56,
  "Bastard Sword": 62,
  Flamberge: 70,
  "Great Sword": 100,
  "Two-Handed Sword (1h)": 35,
  "Claymore (1h)": 47,
  "Giant Sword (1h)": 56,
  "Bastard Sword (1h)": 62,
  "Flamberge (1h)": 70,
  "Great Sword (1h)": 100,

  // Daggers
  Dagger: 0, // No value provided, defaulting to 0
  Dirk: 0, // No value provided, defaulting to 0
  Kris: 0, // No value provided, defaulting to 0
  Blade: 35,

  // Throwing
  "Throwing Knife": 0, // No value provided, defaulting to 0
  "Balanced Knife": 0, // No value provided, defaulting to 0
  "Throwing Knife (melee)": 0, // No value provided, defaulting to 0
  "Balanced Knife (melee)": 0, // No value provided, defaulting to 0
  "Throwing Axe": 0, // No value provided, defaulting to 0
  "Balanced Axe": 0, // No value provided, defaulting to 0
  "Throwing Axe (melee)": 0, // No value provided, defaulting to 0
  "Balanced Axe (melee)": 0, // No value provided, defaulting to 0

  // Javelins
  Javelin: 0, // No value provided, defaulting to 0
  Pilum: 0, // No value provided, defaulting to 0
  "Short Spear": 40,
  Glaive: 52,
  "Throwing Spear": 0, // No value provided, defaulting to 0
  "Javelin (melee)": 0, // No value provided, defaulting to 0
  "Pilum (melee)": 0, // No value provided, defaulting to 0
  "Short Spear (melee)": 40,
  "Glaive (melee)": 52,
  "Throwing Spear (melee)": 0, // No value provided, defaulting to 0
  "Maiden Javelin": 33,
  "Maiden Javelin (melee)": 33,

  // Spears and Polearms
  "Maiden Spear": 54,
  "Maiden Pike": 63,
  Spear: 0, // No value provided, defaulting to 0
  Trident: 38,
  Brandistock: 40,
  Spetum: 54,
  Pike: 60,
  Bardiche: 40,
  Voulge: 50,
  Scythe: 41,
  Poleaxe: 62,
  Halberd: 75,
  "War Scythe": 80,

  // Bows and Crossbows
  "Short Bow": 0, // No value provided, defaulting to 0
  "Hunter's Bow": 0, // No value provided, defaulting to 0
  "Long Bow": 22,
  "Composite Bow": 25,
  "Short Battle Bow": 30,
  "Long Battle Bow": 40,
  "Short War Bow": 35,
  "Long War Bow": 50,
  "Stag Bow": 30,
  "Reflex Bow": 35,
  "Light Crossbow": 21,
  Crossbow: 40,
  "Heavy Crossbow": 60,
  "Repeating Crossbow": 40,

  // Katar
  Katar: 20,
  "Wrist Blade": 33,
  "Hatchet Hands": 37,
  Cestus: 42,
  Claws: 46,
  "Blade Talons": 50,
  "Scissors Katar": 55,

  // Scepters
  Scepter: 25,
  "Grand Scepter": 37,
  "War Scepter": 55,

  // Staves
  "Short Staff": 0, // No value provided, defaulting to 0
  "Long Staff": 0, // No value provided, defaulting to 0
  "Gnarled Staff": 0, // No value provided, defaulting to 0
  "Battle Staff": 0, // No value provided, defaulting to 0
  "War Staff": 0, // No value provided, defaulting to 0

  // Wands
  Wand: 0, // No value provided, defaulting to 0
  "Yew Wand": 0, // No value provided, defaulting to 0
  "Bone Wand": 0, // No value provided, defaulting to 0
  "Grim Wand": 0, // No value provided, defaulting to 0

  // Orbs
  "Eagle Orb": 0, // No value provided, defaulting to 0
  "Sacred Globe": 0, // No value provided, defaulting to 0
  "Smoked Sphere": 0, // No value provided, defaulting to 0
  "Clasped Orb": 0, // No value provided, defaulting to 0
  "Jared's Stone": 0, // No value provided, defaulting to 0
  Cleaver: 68,
  "Twin Axe": 85,
  Crowbill: 94,
  Naga: 121,
  "Military Axe": 73,
  "Bearded Axe": 92,
  Tabar: 101,
  "Gothic Axe": 115,
  "Ancient Axe": 125,

  // Maces
  Cudgel: 25,
  "Barbed Club": 30,
  "Flanged Mace": 61,
  "Jagged Star": 74,
  Knout: 82,
  "Battle Hammer": 100,
  "War Club": 124,
  "Martel de Fer": 169,

  // Swords
  Gladius: 25,
  Cutlass: 25,
  Shamshir: 58,
  Tulwar: 70,
  "Dimensional Blade": 85,
  "Battle Sword": 92,
  "Rune Sword": 103,
  "Ancient Sword": 127,
  Espandon: 73,
  "Dacian Falx": 91,
  "Tusk Sword": 104,
  "Gothic Sword": 113,
  Zweihander: 125,
  "Executioner Sword": 170,
  "Espandon (1h)": 73,
  "Dacian Falx (1h)": 91,
  "Tusk Sword (1h)": 104,
  "Gothic Sword (1h)": 113,
  "Zweihander (1h)": 125,
  "Executioner Sword (1h)": 170,

  // Daggers
  Poignard: 25,
  Rondel: 25,
  Cinquedeas: 25,
  Stiletto: 47,

  // Throwing
  "Battle Dart": 25,
  "War Dart": 25,
  "Battle Dart (melee)": 25,
  "War Dart (melee)": 25,
  Francisca: 25,
  Hurlbat: 25,
  "Francisca (melee)": 25,
  "Hurlbat (melee)": 25,

  // Javelins
  "War Javelin": 25,
  "Great Pilum": 25,
  Simbilan: 80,
  Spiculum: 98,
  Harpoon: 25,
  "War Javelin (melee)": 25,
  "Great Pilum (melee)": 25,
  "Simbilan (melee)": 80,
  "Spiculum (melee)": 98,
  "Harpoon (melee)": 25,
  "Ceremonial Javelin": 25,
  "Ceremonial Javelin (melee)": 25,

  // Spears and Polearms
  "Ceremonial Spear": 101,
  "Ceremonial Pike": 115,
  "War Spear": 25,
  Fuscina: 77,
  "War Fork": 80,
  Yari: 101,
  Lance: 110,
  "Lochaber Axe": 80,
  Bill: 95,
  "Battle Scythe": 82,
  Partizan: 113,
  "Bec-de-Corbin": 133,
  "Grim Scythe": 140,

  // Bows and Crossbows
  "Edge Bow": 25,
  "Razor Bow": 25,
  "Cedar Bow": 53,
  "Double Bow": 58,
  "Short Siege Bow": 65,
  "Large Siege Bow": 80,
  "Rune Bow": 73,
  "Gothic Bow": 95,
  "Ashwood Bow": 56,
  "Ceremonial Bow": 73,
  Arbalest: 52,
  "Siege Crossbow": 80,
  Ballista: 110,
  "Chu-Ko-Nu": 80,

  // Katar
  Quhab: 57,
  "Wrist Spike": 66,
  Fascia: 69,
  "Hand Scythe": 73,
  "Greater Claws": 76,
  "Greater Talons": 79,
  "Scissors Quhab": 82,

  // Scepters
  "Rune Scepter": 58,

  // Staves
  "Holy Water Sprinkler": 76,
  "Divine Scepter": 103,
  "Jo Staff": 25,
  Quarterstaff: 25,
  "Cedar Staff": 25,
  "Gothic Staff": 25,
  "Rune Staff": 25,

  // Wands
  "Burnt Wand": 25,
  "Petrified Wand": 25,
  "Tomb Wand": 25,
  "Grave Wand": 25,

  // Orbs
  "Glowing Orb": 0, // No value provided, defaulting to 0
  "Crystalline Globe": 0, // No value provided, defaulting to 0
  "Cloudy Sphere": 0, // No value provided, defaulting to 0
  "Sparkling Ball": 0, // No value provided, defaulting to 0
  "Swirling Crystal": 0, // No value provided, defaulting to 0
  "Small Crescent": 115,
  "Ettin Axe": 145,
  "War Spike": 133,
  "Berserker Axe": 138,
  "Feral Axe": 196,
  "Silver-Edged Axe": 166,
  Decapitator: 189,
  "Champion Axe": 167,
  "Glorious Axe": 164,

  // Maces
  Truncheon: 88,
  "Tyrant Club": 133,
  "Reinforced Mace": 145,
  "Devil Star": 153,
  Scourge: 125,
  "Legendary Mallet": 189,
  "Ogre Maul": 225,
  "Thunder Maul": 253,

  // Swords
  Falcata: 150,
  Ataghan: 138,
  "Elegant Blade": 109,
  "Hydra Edge": 142,
  "Phase Blade": 25,
  "Conquest Sword": 142,
  "Cryptic Sword": 99,
  "Mythical Sword": 147,
  "Legend Sword": 175,
  "Highland Blade": 171,
  "Balrog Blade": 185,
  "Champion Sword": 163,
  "Colossus Sword": 182,
  "Colossus Blade": 189,
  "Legend Sword (1h)": 175,
  "Highland Blade (1h)": 171,
  "Balrog Blade (1h)": 185,
  "Champion Sword (1h)": 163,
  "Colossus Sword (1h)": 182,
  "Colossus Blade (1h)": 189,

  // Daggers
  "Bone Knife": 38,
  "Mithril Point": 55,
  "Fanged Knife": 42,
  "Legend Spike": 65,

  // Throwing
  "Flying Knife": 48,
  "Winged Knife": 45,
  "Flying Knife (melee)": 48,
  "Winged Knife (melee)": 45,
  "Flying Axe": 88,
  "Winged Axe": 96,
  "Flying Axe (melee)": 88,
  "Winged Axe (melee)": 96,

  // Javelins
  "Hyperion Javelin": 98,
  "Stygian Pilum": 118,
  "Balrog Spear": 127,
  "Ghost Glaive": 89,
  "Winged Harpoon": 76,
  "Hyperion Javelin (melee)": 98,
  "Stygian Pilum (melee)": 118,
  "Balrog Spear (melee)": 127,
  "Ghost Glaive (melee)": 89,
  "Winged Harpoon (melee)": 76,
  "Matriarchal Javelin": 107,
  "Matriarchal Javelin (melee)": 107,

  // Spears and Polearms
  "Matriarchal Spear": 114,
  "Matriarchal Pike": 132,
  "Hyperion Spear": 155,
  "Stygian Pike": 168,
  Mancatcher: 132,
  "Ghost Spear": 122,
  "War Pike": 165,
  "Ogre Axe": 195,
  "Colossus Voulge": 210,
  Thresher: 152,
  "Cryptic Axe": 165,
  "Great Poleaxe": 179,
  "Giant Thresher": 188,

  // Bows and Crossbows
  "Spider Bow": 64,
  "Blade Bow": 76,
  "Shadow Bow": 52,
  "Great Bow": 121,
  "Diamond Bow": 89,
  "Crusader Bow": 97,
  "Ward Bow": 72,
  "Hydra Bow": 134,
  "Matriarchal Bow": 87,
  "Grand Matron Bow": 108,
  "Pellet Bow": 83,
  "Gorgon Crossbow": 117,
  "Colossus Crossbow": 163,
  "Demon Crossbow": 141,
  Suwayyah: 99,

  // Katar
  "Wrist Sword": 105,
  "War Fist": 108,
  "Battle Cestus": 110,
  "Feral Claws": 113,
  "Runic Talons": 115,
  "Scissors Suwayyah": 118,

  // Scepters
  "Mighty Scepter": 125,

  // Staves
  "Seraph Rod": 108,
  Caduceus: 97,
  "Walking Stick": 25,
  Stalagmite: 63,
  "Elder Staff": 44,
  Shillelagh: 52,
  "Archon Staff": 34,

  // Wands
  "Polished Wand": 25,
  "Ghost Wand": 25,
  "Lich Wand": 25,
  "Unearthed Wand": 25,

  // Orbs
  "Heavenly Stone": 0, // No value provided, defaulting to 0
  "Eldritch Orb": 0, // No value provided, defaulting to 0
  "Demon Heart": 0, // No value provided, defaulting to 0
  "Vortex Orb": 0, // No value provided, defaulting to 0
  "Dimensional Shard": 0, // No value provided, defaulting to 0
};

const baseDamages = {
  "Hand Axe": { min: 3, max: 6 },
  Hatchet: { min: 15, max: 30 },
  Tomahawk: { min: 35, max: 70 },
  Axe: { min: 3, max: 6 },
  "Double Axe": { min: 4, max: 11 },
  "Military Pick": { min: 7, max: 11 },
  "War Axe": { min: 12, max: 20 },
  "Large Axe": { min: 6, max: 13 },
  "Broad Axe": { min: 10, max: 18 },
  "Battle Axe": { min: 12, max: 32 },
  "Great Axe": { min: 9, max: 30 },
  "Giant Axe": { min: 22, max: 45 },

  // Maces
  Club: { min: 1, max: 6 },
  "Spiked Club": { min: 5, max: 8 },
  Mace: { min: 3, max: 10 },
  "Morning Star": { min: 7, max: 16 },
  Flail: { min: 1, max: 24 },
  "War Hammer": { min: 22, max: 32 },
  Maul: { min: 30, max: 43 },
  "Great Maul": { min: 38, max: 58 },

  // Swords
  "Short Sword": { min: 2, max: 7 },
  Scimitar: { min: 2, max: 6 },
  Sabre: { min: 3, max: 8 },
  Falchion: { min: 9, max: 17 },
  "Crystal Sword": { min: 5, max: 15 },
  "Broad Sword": { min: 7, max: 14 },
  "Long Sword": { min: 3, max: 19 },
  "War Sword": { min: 8, max: 20 },
  "Two-Handed Sword": { min: 8, max: 17 },
  Claymore: { min: 13, max: 30 },
  "Giant Sword": { min: 9, max: 28 },
  "Bastard Sword": { min: 20, max: 28 },
  Flamberge: { min: 13, max: 26 },
  "Great Sword": { min: 25, max: 42 },
  "Two-Handed Sword (1h)": { min: 2, max: 9 }, // Assuming this is meant to be different from the two-handed version above
  "Claymore (1h)": { min: 5, max: 12 },
  "Giant Sword (1h)": { min: 3, max: 16 },
  "Bastard Sword (1h)": { min: 7, max: 19 },
  "Flamberge (1h)": { min: 9, max: 15 },
  "Great Sword (1h)": { min: 12, max: 20 },

  // Daggers
  Dagger: { min: 1, max: 4 },
  Dirk: { min: 3, max: 9 },
  Kris: { min: 2, max: 11 },
  Blade: { min: 4, max: 15 },

  // Throwing
  "Throwing Knife": { min: 4, max: 5 },
  "Balanced Knife": { min: 6, max: 11 },
  "Throwing Knife (melee)": { min: 2, max: 3 },
  "Balanced Knife (melee)": { min: 1, max: 8 },
  "Throwing Axe": { min: 7, max: 8 },
  "Balanced Axe": { min: 12, max: 15 },
  "Throwing Axe (melee)": { min: 4, max: 7 },
  "Balanced Axe (melee)": { min: 5, max: 10 },

  // Javelins
  Javelin: { min: 6, max: 10 },
  Pilum: { min: 7, max: 20 },
  "Short Spear": { min: 10, max: 22 },
  Glaive: { min: 16, max: 22 },
  "Throwing Spear": { min: 12, max: 30 },
  "Javelin (melee)": { min: 1, max: 5 },
  "Pilum (melee)": { min: 4, max: 9 },
  "Short Spear (melee)": { min: 2, max: 13 },
  "Glaive (melee)": { min: 5, max: 17 },
  "Throwing Spear (melee)": { min: 5, max: 15 },
  "Maiden Javelin": { min: 8, max: 14 },
  "Maiden Javelin (throw)": { min: 6, max: 22 },

  // Spears and Polearms
  "Maiden Spear": { min: 20, max: 26 },
  "Maiden Pike": { min: 25, max: 60 },
  Spear: { min: 3, max: 15 },
  Trident: { min: 9, max: 15 },
  Brandistock: { min: 7, max: 17 },
  Spetum: { min: 15, max: 23 },
  Pike: { min: 14, max: 63 },
  Bardiche: { min: 1, max: 27 },
  Voulge: { min: 6, max: 21 },
  Scythe: { min: 8, max: 20 },
  Poleaxe: { min: 18, max: 39 },
  Halberd: { min: 12, max: 45 },
  "War Scythe": { min: 15, max: 36 },

  // Bows and Crossbows
  "Short Bow": { min: 1, max: 4 },
  "Hunter's Bow": { min: 2, max: 6 },
  "Long Bow": { min: 5, max: 10 },
  "Composite Bow": { min: 5, max: 9 },
  "Short Battle Bow": { min: 6, max: 12 },
  "Long Battle Bow": { min: 7, max: 18 },
  "Short War Bow": { min: 6, max: 14 },
  "Long War Bow": { min: 3, max: 23 },
  "Stag Bow": { min: 8, max: 14 },
  "Reflex Bow": { min: 10, max: 21 },
  "Light Crossbow": { min: 8, max: 11 },
  Crossbow: { min: 11, max: 19 },
  "Heavy Crossbow": { min: 20, max: 33 },
  "Repeating Crossbow": { min: 9, max: 18 },

  // Katar
  Katar: { min: 5, max: 8 },
  "Wrist Blade": { min: 6, max: 10 },
  "Hatchet Hands": { min: 3, max: 17 },
  Cestus: { min: 8, max: 17 },
  Claws: { min: 9, max: 16 },
  "Blade Talons": { min: 11, max: 15 },
  "Scissors Katar": { min: 10, max: 19 },

  // Scepters
  Scepter: { min: 6, max: 11 },
  "Grand Scepter": { min: 8, max: 18 },
  "War Scepter": { min: 12, max: 19 },

  // Staves
  "Short Staff": { min: 1, max: 5 },
  "Long Staff": { min: 2, max: 8 },
  "Gnarled Staff": { min: 4, max: 12 },
  "Battle Staff": { min: 6, max: 13 },
  "War Staff": { min: 12, max: 28 },

  // Wands
  Wand: { min: 2, max: 4 },
  "Yew Wand": { min: 2, max: 8 },
  "Bone Wand": { min: 3, max: 7 },
  "Grim Wand": { min: 5, max: 11 },

  // Orbs
  "Eagle Orb": { min: 2, max: 5 },
  "Sacred Globe": { min: 3, max: 8 },
  "Smoked Sphere": { min: 4, max: 10 },
  "Clasped Orb": { min: 5, max: 12 },
  "Jared's Stone": { min: 8, max: 18 },
  Cleaver: { min: 14, max: 47 },
  "Twin Axe": { min: 18, max: 54 },
  Crowbill: { min: 21, max: 48 },
  Naga: { min: 23, max: 64 },
  "Military Axe": { min: 21, max: 61 },
  "Bearded Axe": { min: 30, max: 70 },
  Tabar: { min: 35, max: 99 },
  "Gothic Axe": { min: 23, max: 100 },
  "Ancient Axe": { min: 62, max: 122 },

  // Maces
  Cudgel: { min: 10, max: 30 },
  "Barbed Club": { min: 18, max: 36 },
  "Flanged Mace": { min: 22, max: 33 },
  "Jagged Star": { min: 29, max: 45 },
  Knout: { min: 18, max: 50 },
  "Battle Hammer": { min: 39, max: 60 },
  "War Club": { min: 69, max: 113 },
  "Martel de Fer": { min: 76, max: 131 },

  // Swords
  Gladius: { min: 12, max: 32 },
  Cutlass: { min: 12, max: 30 },
  Shamshir: { min: 14, max: 35 },
  Tulwar: { min: 23, max: 50 },
  "Dimensional Blade": { min: 18, max: 51 },
  "Battle Sword": { min: 23, max: 48 },
  "Rune Sword": { min: 14, max: 60 },
  "Ancient Sword": { min: 25, max: 55 },
  Espandon: { min: 32, max: 58 },
  "Dacian Falx": { min: 38, max: 87 },
  "Tusk Sword": { min: 28, max: 83 },
  "Gothic Sword": { min: 58, max: 86 },
  Zweihander: { min: 41, max: 77 },
  "Executioner Sword": { min: 68, max: 115 },
  "Espandon (1h)": { min: 12, max: 37 },
  "Dacian Falx (1h)": { min: 18, max: 43 },
  "Tusk Sword (1h)": { min: 14, max: 53 },
  "Gothic Sword (1h)": { min: 22, max: 58 },
  "Zweihander (1h)": { min: 28, max: 51 },
  "Executioner Sword (1h)": { min: 28, max: 58 },

  // Daggers
  Poignard: { min: 9, max: 26 },
  Rondel: { min: 14, max: 38 },
  Cinquedeas: { min: 17, max: 45 },
  Stiletto: { min: 28, max: 52 },

  // Throwing
  "Battle Dart": { min: 14, max: 30 },
  "War Dart": { min: 17, max: 34 },
  "Battle Dart (melee)": { min: 12, max: 20 },
  "War Dart (melee)": { min: 8, max: 30 },
  Francisca: { min: 22, max: 41 },
  Hurlbat: { min: 24, max: 34 },
  "Francisca (melee)": { min: 13, max: 27 },
  "Hurlbat (melee)": { min: 19, max: 34 },

  // Javelins
  "War Javelin": { min: 18, max: 40 },
  "Great Pilum": { min: 17, max: 52 },
  Simbilan: { min: 34, max: 58 },
  Spiculum: { min: 32, max: 65 },
  Harpoon: { min: 23, max: 59 },
  "War Javelin (melee)": { min: 7, max: 24 },
  "Great Pilum (melee)": { min: 13, max: 33 },
  "Simbilan (melee)": { min: 10, max: 40 },
  "Spiculum (melee)": { min: 16, max: 48 },
  "Harpoon (melee)": { min: 16, max: 44 },
  "Ceremonial Javelin": { min: 26, max: 51 },
  "Ceremonial Javelin (throw)": { min: 25, max: 69 },

  // Spears and Polearms
  "Ceremonial Spear": { min: 49, max: 74 },
  "Ceremonial Pike": { min: 60, max: 140 },
  "War Spear": { min: 15, max: 54 },
  Fuscina: { min: 24, max: 53 },
  "War Fork": { min: 23, max: 58 },
  Yari: { min: 41, max: 85 },
  Lance: { min: 33, max: 163 },
  "Lochaber Axe": { min: 9, max: 83 },
  Bill: { min: 20, max: 76 },
  "Battle Scythe": { min: 25, max: 64 },
  Partizan: { min: 49, max: 108 },
  "Bec-de-Corbin": { min: 18, max: 122 },
  "Grim Scythe": { min: 44, max: 100 },

  // Bows and Crossbows
  "Edge Bow": { min: 8, max: 25 },
  "Razor Bow": { min: 11, max: 29 },
  "Cedar Bow": { min: 13, max: 38 },
  "Double Bow": { min: 14, max: 35 },
  "Short Siege Bow": { min: 17, max: 40 },
  "Large Siege Bow": { min: 13, max: 56 },
  "Rune Bow": { min: 19, max: 46 },
  "Gothic Bow": { min: 8, max: 63 },
  "Ashwood Bow": { min: 19, max: 38 },
  "Ceremonial Bow": { min: 22, max: 53 },
  Arbalest: { min: 20, max: 38 },
  "Siege Crossbow": { min: 28, max: 60 },
  Ballista: { min: 47, max: 78 },
  "Chu-Ko-Nu": { min: 22, max: 50 },

  // Katar
  Quhab: { min: 15, max: 35 },
  "Wrist Spike": { min: 20, max: 46 },
  Fascia: { min: 12, max: 53 },
  "Hand Scythe": { min: 23, max: 46 },
  "Greater Claws": { min: 23, max: 53 },
  "Greater Talons": { min: 25, max: 45 },
  "Scissors Quhab": { min: 28, max: 58 },

  // Scepters
  "Rune Scepter": { min: 18, max: 35 },

  // Staves
  "Holy Water Sprinkler": { min: 20, max: 52 },
  "Divine Scepter": { min: 24, max: 46 },
  "Jo Staff": { min: 9, max: 30 },
  Quarterstaff: { min: 12, max: 38 },
  "Cedar Staff": { min: 15, max: 46 },
  "Gothic Staff": { min: 21, max: 48 },
  "Rune Staff": { min: 35, max: 84 },

  // Wands
  "Burnt Wand": { min: 8, max: 18 },
  "Petrified Wand": { min: 8, max: 24 },
  "Tomb Wand": { min: 10, max: 22 },
  "Grave Wand": { min: 13, max: 29 },

  // Orbs
  "Glowing Orb": { min: 8, max: 21 },
  "Crystalline Globe": { min: 10, max: 26 },
  "Cloudy Sphere": { min: 11, max: 29 },
  "Sparkling Ball": { min: 13, max: 32 },
  "Swirling Crystal": { min: 18, max: 42 },
  "Small Crescent": { min: 47, max: 75 },
  "Ettin Axe": { min: 41, max: 83 },
  "War Spike": { min: 38, max: 60 },
  "Berserker Axe": { min: 30, max: 89 },
  "Feral Axe": { min: 31, max: 154 },
  "Silver-Edged Axe": { min: 78, max: 138 },
  Decapitator: { min: 61, max: 171 },
  "Champion Axe": { min: 74, max: 118 },
  "Glorious Axe": { min: 75, max: 155 },

  // Maces
  Truncheon: { min: 44, max: 54 },
  "Tyrant Club": { min: 43, max: 75 },
  "Reinforced Mace": { min: 56, max: 66 },
  "Devil Star": { min: 56, max: 69 },
  Scourge: { min: 14, max: 100 },
  "Legendary Mallet": { min: 63, max: 76 },
  "Ogre Maul": { min: 96, max: 132 },
  "Thunder Maul": { min: 41, max: 225 },

  // Swords
  Falcata: { min: 39, max: 74 },
  Ataghan: { min: 33, max: 58 },
  "Elegant Blade": { min: 41, max: 56 },
  "Hydra Edge": { min: 35, max: 85 },
  "Phase Blade": { min: 39, max: 44 },
  "Conquest Sword": { min: 46, max: 66 },
  "Cryptic Sword": { min: 6, max: 96 }, // Assuming this is correct - very low min damage
  "Mythical Sword": { min: 50, max: 63 },
  "Legend Sword": { min: 63, max: 118 },
  "Highland Blade": { min: 84, max: 120 },
  "Balrog Blade": { min: 69, max: 149 },
  "Champion Sword": { min: 89, max: 104 },
  "Colossus Sword": { min: 76, max: 151 },
  "Colossus Blade": { min: 73, max: 144 },
  "Legend Sword (1h)": { min: 28, max: 70 },
  "Highland Blade (1h)": { min: 28, max: 78 },
  "Balrog Blade (1h)": { min: 19, max: 94 },
  "Champion Sword (1h)": { min: 30, max: 68 },
  "Colossus Sword (1h)": { min: 33, max: 88 },
  "Colossus Blade (1h)": { min: 31, max: 81 },

  // Daggers
  "Bone Knife": { min: 28, max: 56 },
  "Mithril Point": { min: 43, max: 61 },
  "Fanged Knife": { min: 19, max: 65 },
  "Legend Spike": { min: 36, max: 64 },

  // Throwing
  "Flying Knife": { min: 23, max: 54 },
  "Winged Knife": { min: 23, max: 39 },
  "Flying Knife (melee)": { min: 23, max: 54 }, // Assuming this is meant to be different from the throwing version
  "Winged Knife (melee)": { min: 27, max: 35 },
  "Flying Axe": { min: 15, max: 66 },
  "Winged Axe": { min: 7, max: 60 },
  "Flying Axe (melee)": { min: 17, max: 65 },
  "Winged Axe (melee)": { min: 11, max: 56 },

  // Javelins
  "Hyperion Javelin": { min: 28, max: 55 },
  "Stygian Pilum": { min: 21, max: 75 },
  "Balrog Spear": { min: 40, max: 62 },
  "Ghost Glaive": { min: 30, max: 78 },
  "Winged Harpoon": { min: 11, max: 77 },
  "Hyperion Javelin (melee)": { min: 21, max: 57 },
  "Stygian Pilum (melee)": { min: 14, max: 64 },
  "Balrog Spear (melee)": { min: 33, max: 63 },
  "Ghost Glaive (melee)": { min: 19, max: 60 },
  "Winged Harpoon (melee)": { min: 27, max: 35 },
  "Matriarchal Javelin": { min: 44, max: 83 },
  "Matriarchal Javelin (melee)": { min: 38, max: 68 },

  // Spears and Polearms
  "Matriarchal Spear": { min: 79, max: 116 },
  "Matriarchal Pike": { min: 44, max: 185 },
  "Hyperion Spear": { min: 44, max: 149 },
  "Stygian Pike": { min: 36, max: 180 },
  Mancatcher: { min: 52, max: 115 },
  "Ghost Spear": { min: 23, max: 194 },
  "War Pike": { min: 41, max: 223 },
  "Ogre Axe": { min: 35, max: 181 },
  "Colossus Voulge": { min: 21, max: 206 },
  Thresher: { min: 15, max: 176 },
  "Cryptic Axe": { min: 41, max: 188 },
  "Great Poleaxe": { min: 58, max: 159 },
  "Giant Thresher": { min: 50, max: 142 },

  // Bows and Crossbows
  "Spider Bow": { min: 28, max: 61 },
  "Blade Bow": { min: 25, max: 50 },
  "Shadow Bow": { min: 18, max: 72 },
  "Great Bow": { min: 14, max: 63 },
  "Diamond Bow": { min: 40, max: 48 },
  "Crusader Bow": { min: 19, max: 76 },
  "Ward Bow": { min: 24, max: 64 },
  "Hydra Bow": { min: 12, max: 83 },
  "Matriarchal Bow": { min: 24, max: 57 },
  "Grand Matron Bow": { min: 17, max: 87 },
  "Pellet Bow": { min: 40, max: 99 },
  "Gorgon Crossbow": { min: 39, max: 120 },
  "Colossus Crossbow": { min: 47, max: 125 },
  "Demon Crossbow": { min: 43, max: 66 },
  Suwayyah: { min: 54, max: 71 },

  // Katar
  "Wrist Sword": { min: 46, max: 63 },
  "War Fist": { min: 60, max: 73 },
  "Battle Cestus": { min: 45, max: 53 },
  "Feral Claws": { min: 30, max: 73 },
  "Runic Talons": { min: 33, max: 60 },
  "Scissors Suwayyah": { min: 55, max: 70 },

  // Scepters
  "Mighty Scepter": { min: 50, max: 65 },

  // Staves
  "Seraph Rod": { min: 56, max: 68 },
  Caduceus: { min: 46, max: 54 },
  "Walking Stick": { min: 8, max: 61 },
  Stalagmite: { min: 9, max: 41 },
  "Elder Staff": { min: 100, max: 116 },
  Shillelagh: { min: 81, max: 135 },
  "Archon Staff": { min: 104, max: 124 },

  // Wands
  "Polished Wand": { min: 18, max: 33 },
  "Ghost Wand": { min: 20, max: 40 },
  "Lich Wand": { min: 10, max: 31 },
  "Unearthed Wand": { min: 22, max: 28 },

  // Orbs
  "Heavenly Stone": { min: 21, max: 46 },
  "Eldritch Orb": { min: 18, max: 50 },
  "Demon Heart": { min: 23, max: 55 },
  "Vortex Orb": { min: 12, max: 66 },
  "Dimensional Shard": { min: 30, max: 53 },
};


// Main upgrade function
function upgradeSelectedItem() {
  const activeDropdown = findActiveDropdown();
  if (!activeDropdown) {
    alert("No item selected for upgrade");
    return;
  }

  const itemType = getItemTypeFromDropdown(activeDropdown.id);
  const currentItem = activeDropdown.value;
  
  if (!currentItem || !itemList[currentItem]) {
    alert("No valid item selected");
    return;
  }

  const upgrades = upgradeDefinitions[itemType]?.[currentItem];
  if (!upgrades) {
    alert("This item cannot be upgraded");
    return;
  }

  const success = performUpgrade(currentItem, upgrades, itemType);
  if (success) {
    activeDropdown.dispatchEvent(new Event("change"));
  }
}

function findActiveDropdown() {
  const dropdowns = [
    'weapons-dropdown', 'helms-dropdown', 'armors-dropdown', 
    'offs-dropdown', 'gloves-dropdown', 'belts-dropdown', 'boots-dropdown'
  ];
  
  for (const id of dropdowns) {
    const dropdown = document.getElementById(id);
    if (dropdown?.value) return dropdown;
  }
  return null;
}

function getItemTypeFromDropdown(dropdownId) {
  const typeMap = {
    'weapons-dropdown': 'weapons',
    'helms-dropdown': 'helms', 
    'armors-dropdown': 'armors',
    'offs-dropdown': 'offs',
    'gloves-dropdown': 'gloves',
    'belts-dropdown': 'belts',
    'boots-dropdown': 'boots'
  };
  return typeMap[dropdownId];
}

function performUpgrade(currentItem, upgrades, itemType) {
  const currentItemData = itemList[currentItem];
  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;
  const baseType = currentItemData.description.split("<br>")[1];

  // Check if already at max level
  if (baseType === upgrades.elite.base) {
    alert("Item is already at maximum upgrade level");
    return false;
  }

  // Extract magical properties (skip name, base type, and requirements)
  const magicalProperties = currentItemData.description
    .split("<br>")
    .slice(3)
    .filter(prop => !prop.includes("Required") && !prop.includes("Defense:") && !prop.includes("Damage:"))
    .join("<br>");

  let targetBase, targetProps;

  // Determine upgrade path
  if (baseType === upgrades.exceptional.base) {
    // Upgrade to elite
    if (level >= upgrades.elite.properties.reqlvl && str >= baseStrengths[upgrades.elite.base]) {
      targetBase = upgrades.elite.base;
      targetProps = upgrades.elite.properties;
    } else {
      alert(`Character does not meet requirements for upgrade to ${upgrades.elite.base} (Level ${upgrades.elite.properties.reqlvl}, Strength ${baseStrengths[upgrades.elite.base]})`);
      return false;
    }
  } else {
    // Upgrade to exceptional
    if (level >= upgrades.exceptional.properties.reqlvl && str >= baseStrengths[upgrades.exceptional.base]) {
      targetBase = upgrades.exceptional.base;
      targetProps = upgrades.exceptional.properties;
    } else {
      alert(`Character does not meet requirements for upgrade to ${upgrades.exceptional.base} (Level ${upgrades.exceptional.properties.reqlvl}, Strength ${baseStrengths[upgrades.exceptional.base]})`);
      return false;
    }
  }

  // Perform upgrade based on item type
  if (itemType === 'weapons') {
    upgradeWeapon(currentItem, currentItemData, targetBase, targetProps, magicalProperties);
  } else {
    upgradeDefensiveItem(currentItem, currentItemData, targetBase, targetProps, magicalProperties, itemType);
  }

  return true;
}

function upgradeWeapon(currentItem, currentItemData, targetBase, targetProps, magicalProperties) {
  const newProperties = {
    ...targetProps,
    reqstr: baseStrengths[targetBase]
  };

  const isTwoHanded = currentItemData.properties.twohandmin !== undefined;
  
  // Calculate new damage using the new base type
  if (isTwoHanded) {
    newProperties.twohandmin = calculateItemDamage(currentItemData, targetBase, false);
    newProperties.twohandmax = calculateItemDamage(currentItemData, targetBase, true);
  } else {
    newProperties.onehandmin = calculateItemDamage(currentItemData, targetBase, false);
    newProperties.onehandmax = calculateItemDamage(currentItemData, targetBase, true);
  }

  // Build new weapon description
  const newDescription = buildWeaponDescription(currentItem, targetBase, newProperties, magicalProperties);

  // Update the item
  itemList[currentItem] = {
    description: newDescription,
    properties: { ...currentItemData.properties, ...newProperties }
  };
}

function upgradeDefensiveItem(currentItem, currentItemData, targetBase, targetProps, magicalProperties, itemType) {
  const newProperties = {
    ...targetProps,
    reqstr: baseStrengths[targetBase]
  };

  // Calculate new defense
  newProperties.defense = calculateItemDefense(currentItemData, targetBase, itemType);

  // Build new description
  const newDescription = buildDefensiveDescription(currentItem, targetBase, newProperties, magicalProperties);

  // Update the item
  itemList[currentItem] = {
    description: newDescription,
    properties: { ...currentItemData.properties, ...newProperties }
  };
}

function calculateItemDamage(item, baseType, isMax = false) {
  // Get base damage from the damage table
  const baseDamage = baseDamages[baseType.trim()] || { min: 0, max: 0 };
  
  // Get the base enhanced damage from the item
  const itemEdmg = item.properties?.edmg || 0;
  
  // Check if item is ethereal
  const isEthereal = item.description.includes("Ethereal");
  const ethMult = isEthereal ? 1.5 : 1;
  
  // Get base min or max damage value
  const base = isMax ? baseDamage.max : baseDamage.min;
  
  // Apply ethereal bonus to base damage
  const ethBase = Math.floor(base * ethMult);
  
  // Calculate final damage with enhanced damage bonus
  let finalDamage = Math.floor(ethBase * (1 + itemEdmg / 100));
  
  // Add flat damage bonuses
  if (isMax && item.properties.tomaxdmg) {
    finalDamage += item.properties.tomaxdmg;
  } else if (!isMax && item.properties.tomindmg) {
    finalDamage += item.properties.tomindmg;
  }
  
  // Add per-level damage bonus to max damage only
  if (isMax && item.properties.maxdmgperlvl) {
    const charLevel = parseInt(document.getElementById("lvlValue").value) || 1;
    const perLevelDamage = Math.floor(charLevel * item.properties.maxdmgperlvl);
    finalDamage += perLevelDamage;
  }
  
  return finalDamage;
}

function calculateItemDefense(item, baseType, category = "helm") {
  const baseDefense = baseDefenses[baseType] || 0;
  const { edef, todef } = item.properties || {};
  const ethMult = item.description.includes("Ethereal") ? 1.5 : 1;

  const baseWithEth = Math.floor(baseDefense * ethMult);
  if (!edef && !todef) return baseWithEth;
  if (!edef && todef) return baseWithEth + todef;

  const totalEdef = edef / 100;
  return todef
    ? Math.floor((baseWithEth + 1) * (1 + totalEdef)) + todef
    : Math.floor((baseWithEth + 1) * (1 + totalEdef));
}

function buildWeaponDescription(itemName, newBase, newProps, magicalProperties) {
  const damageType = newProps.twohandmin !== undefined ? "Two-Hand" : "One-Hand";
  const min = newProps.twohandmin || newProps.onehandmin;
  const max = newProps.twohandmax || newProps.onehandmax;
  
  let description = `${itemName}<br>${newBase}<br>`;
  description += `${damageType} Damage: ${min}-${max}<br>`;
  
  if (newProps.reqstr && newProps.reqstr > 0) {
    description += `Required Strength: ${newProps.reqstr}<br>`;
  }
  if (newProps.reqlvl && newProps.reqlvl > 1) {
    description += `Required Level: ${newProps.reqlvl}<br>`;
  }
  
  if (magicalProperties) {
    description += magicalProperties;
  }
  
  return description;
}

function buildDefensiveDescription(itemName, newBase, newProps, magicalProperties) {
  let description = `${itemName}<br>${newBase}<br>`;
  
  if (newProps.defense) {
    description += `Defense: ${newProps.defense}<br>`;
  }
  
  if (newProps.reqstr && newProps.reqstr > 0) {
    description += `Required Strength: ${newProps.reqstr}<br>`;
  }
  if (newProps.reqlvl && newProps.reqlvl > 1) {
    description += `Required Level: ${newProps.reqlvl}<br>`;
  }
  
  if (magicalProperties) {
    description += magicalProperties;
  }
  
  return description;
}

// Track last level to avoid unnecessary recalculations
let lastCharacterLevel = null;

// Dynamic damage recalculation for per-level weapons (only when level changes)
function updateWeaponDamageOnLevelChange() {
  const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
  
  // Only recalculate if level actually changed
  if (currentLevel === lastCharacterLevel) return;
  lastCharacterLevel = currentLevel;
  
  const weaponDropdown = document.getElementById('weapons-dropdown');
  if (!weaponDropdown || !weaponDropdown.value) return;
  
  const selectedWeapon = weaponDropdown.value;
  const weaponData = itemList[selectedWeapon];
  
  if (weaponData && weaponData.properties.maxdmgperlvl) {
    // Recalculate damage with new level
    const baseType = weaponData.description.split("<br>")[1];
    const isTwoHanded = weaponData.properties.twohandmin !== undefined;
    
    if (isTwoHanded) {
      weaponData.properties.twohandmin = calculateItemDamage(weaponData, baseType, false);
      weaponData.properties.twohandmax = calculateItemDamage(weaponData, baseType, true);
    } else {
      weaponData.properties.onehandmin = calculateItemDamage(weaponData, baseType, false);
      weaponData.properties.onehandmax = calculateItemDamage(weaponData, baseType, true);
    }
    
    // Update the description
    updateWeaponDescription(weaponData, baseType, isTwoHanded);
    
    // Update display without triggering other event handlers
    const weaponInfo = document.getElementById('weapon-info');
    if (weaponInfo) {
      weaponInfo.innerHTML = weaponData.description;
    }
  }
}

function updateWeaponDescription(weaponData, baseType, isTwoHanded) {
  const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";
  const min = isTwoHanded ? weaponData.properties.twohandmin : weaponData.properties.onehandmin;
  const max = isTwoHanded ? weaponData.properties.twohandmax : weaponData.properties.onehandmax;
  
  // Update the damage line in description
  const lines = weaponData.description.split("<br>");
  const damageLineIndex = lines.findIndex(line => line.includes("Damage:"));
  
  if (damageLineIndex !== -1) {
    lines[damageLineIndex] = `${damageType} Damage: ${min}-${max}`;
    weaponData.description = lines.join("<br>");
  }
}

// Auto-attach to upgrade buttons and level input
document.addEventListener('DOMContentLoaded', function() {
  // Attach upgrade functionality
  const upgradeButtons = document.querySelectorAll('button');
  upgradeButtons.forEach(button => {
    if (button.textContent.trim().toLowerCase() === 'upgrade') {
      button.addEventListener('click', upgradeSelectedItem);
    }
  });
  
  // Attach damage updates ONLY to level input changes
  const levelInput = document.getElementById('lvlValue');
  if (levelInput) {
    levelInput.addEventListener('input', updateWeaponDamageOnLevelChange);
    levelInput.addEventListener('change', updateWeaponDamageOnLevelChange);
  }
  
  // Initialize last level tracking
  lastCharacterLevel = parseInt(levelInput?.value) || 1;
});