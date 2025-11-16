let isProcessingWeaponChange = false;

// Override the weapon dropdown event handling to prevent loops
document.addEventListener('DOMContentLoaded', function() {
    const weaponDropdown = document.getElementById('weapons-dropdown');
    if (weaponDropdown) {
        // Remove all existing event listeners by cloning the element
        const newWeaponDropdown = weaponDropdown.cloneNode(true);
        weaponDropdown.parentNode.replaceChild(newWeaponDropdown, weaponDropdown);
        
        // Add single, safe event listener
        newWeaponDropdown.addEventListener('change', function(event) {
            if (isProcessingWeaponChange) return; // Prevent loops
            isProcessingWeaponChange = true;
            
            try {
                const selectedItemName = event.target.value;
                
                // Update item info display
                const infoDiv = document.getElementById('weapon-info');
                if (infoDiv) {
                    if (selectedItemName && itemList[selectedItemName]) {
                        infoDiv.innerHTML = itemList[selectedItemName].description;
                    } else {
                        infoDiv.innerHTML = '';
                    }
                }
                
                // Call your existing weapon update functions safely
                if (typeof updateWeaponDamageDisplay === 'function') {
                    updateWeaponDamageDisplay();
                }
                
                // Calculate stats if function exists
                if (typeof calculateAllEquippedStats === 'function') {
                    calculateAllEquippedStats();
                }
                
            } catch (error) {
            } finally {
                setTimeout(() => { isProcessingWeaponChange = false; }, 100);
            }
        });
    }
});


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
          reqstr: 195,
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

// Make baseDefenses globally accessible for ethereal calculations in main.js
window.baseDefenses = {
  Cap: 5,
  "Skull Cap": 11,
  Helm: 18,
  "Full Helm": 26,
  Mask: 27,
  "Bone Helm": 36,
  "Great Helm": 35,
  Crown: 45,
  "War Hat": 53,
  Shako: 141,
  Sallet: 62,
  Hydraskull: 145,
  Casque: 72,
  Basinet: 84,
  "Giant Conch": 154,
  Armet: 149,
  "Death Mask": 86,
  Demonhead: 154,
  "Grim Helm": 125,
  "Bone Visage": 157,
  "Winged Helm": 98,
  "Spired Helm": 159,
  "Grand Crown": 113,
  Corona: 165,
  "Jawbone Visor": 68,
  "Carnage Helm": 147,
  "Quilted Armor": 11,
  "Leather Armor": 17,
  "Hard Leather Armor": 25,
  "Studded Leather": 37,
  "Ring Mail": 51,
  "Scale Mail": 63,
  "Chain Mail": 71,
  "Breast Plate": 58,
  "Splint Mail": 84,
  "Plate Mail": 108,
  "Field Plate": 102,
  "Gothic Plate": 128,
  "Ghost Armor": 112,
  "Light Plate": 99,
  "Full Plate Mail": 150,
  "Ancient Armor": 185,
  "Serpentskin Armor": 122,
  "Trellised Armor": 156,
  "Demonhide Armor": 134,
  "Linked Mail": 180,
  "Tigulated Mail": 202,
  "Mesh Armor": 216,
  Cuirass: 176,
  "Russet Armor": 233,
  "Templar Coat": 278,
  "Sharktooth Armor": 255,
  "Embossed Plate": 304,
  "Mage Plate": 187,
  "Chaos Armor": 340,
  "Ornate Plate": 444,
  "Dusk Shroud": 302,
  Wyrmhide: 322,
  "Scarab Husk": 349,
  "Wire Fleece": 391,
  "Diamond Mail": 445,
  "Loricated Mail": 495,
  Boneweave: 489,
  "Great Hauberk": 420,
  "Balrog Skin": 541,
  "Hellforge Plate": 625,
  "Kraken Shell": 576,
  "Lacquered Plate": 664,
  "Archon Plate": 407,
  "Shadow Plate": 696,
  "Sacred Armor": 730,
  Circlet: 30,
  Tiara: 50,
  Diadem: 60,
  Coronet: 40,
  "Wolf Head": 11,
  "Hawk Helm": 15,
  Antlers: 24,
  "Falcon Mask": 28,
  "Spirit Mask": 35,
  "Jawbone Cap": 15,
  "Fanged Helm": 20,
  "Horned Helm": 30,
  "Assault Helmet": 35,
  "Avenger Guard": 50,
  "Slayer Guard": 120,
  "Guardian Crown": 168,
  Buckler: 6, //nEW MAYBE BUG?
  "Small Shield": 10,
  "Large Shield": 14,
  "Spiked Shield": 25,
  "Kite Shield": 18,
  "Bone Shield": 30,
  "Tower Shield": 25,
  "Gothic Shield": 35,
  Defender: 49,
  "Leather Gloves": 3,
  "Demonhide Gloves": 35,
  "Bramble Mitts": 62,
  "Heavy Gloves": 6,
  "Chain Gloves": 9,
  "Light Gauntlets": 11,
  Gauntlets: 15,
  "Sharkskin Gloves": 39,
  "Heavy Bracers": 44,
  "Battle Gauntlets": 47,
  "War Gauntlets": 53,
  "Vampirebone Gloves": 65,
  Vambraces: 67,
  "Crusader Gauntlets": 68,
  "Ogre Gauntlets": 71,
  Sash: 2,
  "Light Belt": 3,
  Belt: 5,
  "Heavy Belt": 6,
  "Plated Belt": 11,
  "Demonhide Sash": 34,
  "Sharkskin Belt": 36,
  "Mesh Belt": 40,
  "Battle Belt": 42,
  "War Belt": 52,
  "Mithril Coil": 65,
  "Troll Belt": 66,
  "Colossus Girdle": 71,
  "Spiderweb Sash": 62,
  "Vampirefang Belt": 63,
};

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

// Base item required levels (for non-unique items)
const baseRequiredLevels = {
  // === ARMORS ===
  // Tier 2 Armors
  "Ghost Armor": 22,
  "Serpentskin Armor": 24,
  "Demonhide Armor": 25,
  "Trellised Armor": 25,
  "Linked Mail": 25,
  "Tigulated Mail": 25,
  "Mesh Armor": 25,
  "Cuirass": 25,
  "Russet Armor": 25,
  "Templar Coat": 25,
  "Sharktooth Armor": 25,
  "Embossed Plate": 25,
  "Mage Plate": 25,
  "Chaos Armor": 25,
  "Ornate Plate": 25,

  // Tier 3 Armors (Exceptional)
  "Dusk Shroud": 49,
  "Wyrmhide": 50,
  "Scarab Husk": 51,
  "Wire Fleece": 53,
  "Diamond Mail": 54,
  "Loricated Mail": 55,
  "Boneweave": 47,
  "Great Hauberk": 56,
  "Balrog Skin": 57,
  "Hellforge Plate": 59,
  "Kraken Shell": 61,
  "Lacquered Plate": 62,
  "Archon Plate": 63,
  "Shadow Plate": 64,
  "Sacred Armor": 66,

  // === SHIELDS & BUCKLERS ===
  // Tier 2 Shields
  "Defender": 22,
  "Round Shield": 25,
  "Scutum": 25,
  "Barbed Shield": 25,
  "Dragon Shield": 25,
  "Grim Shield": 25,
  "Pavise": 25,
  "Ancient Shield": 25,
  "Akaran Targe": 26,
  "Akaran Rondache": 30,
  "Protector Shield": 34,
  "Gilded Shield": 38,
  "Royal Shield": 41,

  // Tier 3 Shields (Exceptional)
  "Heater": 43,
  "Luna": 45,
  "Hyperion": 48,
  "Blade Barrier": 51,
  "Monarch": 54,
  "Troll Nest": 57,
  "Aegis": 59,
  "Ward": 63,
  "Sacred Targe": 47,
  "Sacred Rondache": 52,
  "Kurast Shield": 55,
  "Zakarum Shield": 61,
  "Vortex Shield": 66,

  // === NECROMANCER SHIELDS (HEADS) ===
  // Tier 1 Heads (non-zero base)
  "Preserved Head": 3,
  "Zombie Head": 6,
  "Unraveller Head": 12,
  "Gargoyle Head": 15,
  "Demon Head": 18,

  // Tier 2 Heads
  "Mummified Trophy": 24,
  "Fetish Trophy": 29,
  "Sexton Trophy": 33,
  "Cantor Trophy": 36,
  "Heirophant Trophy": 40,

  // Tier 3 Heads (Exceptional)
  "Minion Skull": 44,
  "Hellspawn Skull": 50,
  "Overseer Skull": 49,
  "Succubus Skull": 60,
  "Bloodlord Skull": 65,

  // === NORMAL HELMS ===
  // Tier 2 Helms
  "War Hat": 22,
  "Sallet": 25,
  "Casque": 25,
  "Basinet": 25,
  "Death Mask": 25,
  "Grim Helm": 25,
  "Winged Helm": 25,
  "Grand Crown": 25,

  // Tier 3 Helms (Exceptional)
  "Shako": 43,
  "Hydraskull": 47,
  "Armet": 51,
  "Giant Conch": 40,
  "Demonhead": 55,
  "Bone Visage": 63,
  "Spired Helm": 59,
  "Corona": 66,

  // === CIRCLETS ===
  "Tiara": 52,
  "Diadem": 64,

  // === DRUID HELMS ===
  // Tier 1 Druid Helms (non-zero base)
  "Wolf Head": 3,
  "Hawk Helm": 6,
  "Antlers": 12,
  "Falcon Mask": 15,
  "Spirit Mask": 18,

  // Tier 2 Druid Helms
  "Alpha Helm": 26,
  "Griffon Headress": 30,
  "Hunter's Guise": 29,
  "Sacred Feathers": 32,
  "Totemic Mask": 41,

  // Tier 3 Druid Helms (Exceptional)
  "Blood Spirit": 46,
  "Sun Spirit": 51,
  "Earth Spirit": 57,
  "Sky Spirit": 62,
  "Dream Spirit": 66,

  // === BARBARIAN HELMS ===
  // Tier 1 Barbarian Helms (non-zero base)
  "Jawbone Cap": 3,
  "Fanged Helm": 6,
  "Horned Helm": 12,
  "Assault Helmet": 15,
  "Avenger Guard": 18,

  // Tier 2 Barbarian Helms
  "Jawbone Visor": 25,
  "Lion Helm": 29,
  "Rage Mask": 29,
  "Savage Helmet": 32,
  "Slayer Guard": 40,

  // Tier 3 Barbarian Helms (Exceptional)
  "Carnage Helm": 45,
  "Fury Visor": 49,
  "Destroyer Helm": 54,
  "Conquerer Crown": 60,
  "Guardian Crown": 65,

  // === BELTS ===
  // Tier 2 Belts
  "Demonhide Sash": 24,
  "Sharkskin Belt": 25,
  "Mesh Belt": 25,
  "Battle Belt": 25,
  "War Belt": 25,

  // Tier 3 Belts (Exceptional)
  "Spiderweb Sash": 46,
  "Vampirefang Belt": 51,
  "Mithril Coil": 56,
  "Troll Belt": 62,
  "Colossus Girdle": 67,

  // === GLOVES ===
  // Tier 2 Gloves
  "Demonhide Gloves": 21,
  "Sharkskin Gloves": 25,
  "Heavy Bracers": 25,
  "Battle Gauntlets": 25,
  "War Gauntlets": 25,

  // Tier 3 Gloves (Exceptional)
  "Bramble Mitts": 42,
  "Vampirebone Gloves": 47,
  "Vambraces": 51,
  "Crusader Gauntlets": 57,
  "Ogre Gauntlets": 64,

  // === BOOTS ===
  // Tier 2 Boots
  "Demonhide Boots": 24,
  "Sharkskin Boots": 25,
  "Mesh Boots": 25,
  "Battle Boots": 25,
  "War Boots": 25,

  // Tier 3 Boots (Exceptional)
  "Wyrmhide Boots": 45,
  "Scarabshell Boots": 49,
  "Boneweave Boots": 54,
  "Mirrored Boots": 60,
  "Myrmidon Greaves": 65,
};

function buildDescription(itemName, baseType, properties, magicalProps) {
  return [
    itemName,
    baseType,
    `Defense: ${properties.defense}`,
    `Required Strength: ${properties.reqstr}`,
    `Required Level: ${properties.reqlvl}`,
    ...magicalProps
      .split("<br>")
      .filter(
        (prop) =>
          !prop.includes("Required") &&
          !prop.includes("Defense:") &&
          prop.trim() !== itemName &&
          prop.trim() !== baseType
      ),
  ].join("<br>");
}


function getSocketStats(socket) {
  if (!socket.dataset.itemName || !socket.dataset.stats) {
    return [];
  }

  let stats = [];
  
  try {
    if (socket.dataset.itemName === "jewel") {
      stats = JSON.parse(socket.dataset.stats);
    } else {
      // Get stats from items object
      const itemStats = items[socket.dataset.itemName]?.weapon;
      if (itemStats) {
        // Handle multi-line stats properly
        stats = itemStats
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  } catch (e) {
  }

  return Array.isArray(stats) ? stats : [stats];
}


function buildDescriptionWeapon(itemName, baseType, properties, magicalProps) {
  const damageType =
    properties.twohandmin !== undefined ? "Two-Hand" : "One-Hand";
  const min = properties.twohandmin || properties.onehandmin;
  const max = properties.twohandmax || properties.onehandmax;

  const filteredMagicalProps = magicalProps
    .split("<br>")
    .filter(
      (prop) =>
        !prop.includes("Required") &&
        !prop.includes("Damage:") &&
        prop.trim() !== itemName &&
        prop.trim() !== baseType
    )
    .join("<br>");

  return [
    itemName,
    baseType,
    `${damageType} Damage: ${min}-${max}`,
    `Required Strength: ${properties.reqstr}`,
    `Required Level: ${properties.reqlvl}`,
    filteredMagicalProps,
  ].join("<br>");
}

// Expose globally for use by main.js when edef/todef changes
window.calculateItemDefense = function calculateItemDefense(item, baseType, category = "helm") {
  const baseDefense = baseDefenses[baseType] || 0;

  // Extract edef and todef, handling variable stats (objects with current property)
  let { edef, todef } = item.properties || {};
  if (typeof edef === 'object' && edef !== null && 'current' in edef) {
    edef = edef.current;
  }
  if (typeof todef === 'object' && todef !== null && 'current' in todef) {
    todef = todef.current;
  }

  const ethMult = (item.properties?.ethereal || (item.description && item.description.includes("Ethereal"))) ? 1.5 : 1;

  let socketsEDef = 0;
  document
    .querySelectorAll(`.socketz[data-section="${category}"]`)
    .forEach((socket) => {
      if (socket.dataset.itemName && socket.dataset.stats) {
        const edefMatch = socket.dataset.stats.match(
          /\+(\d+)% Enhanced Defense/
        );
        if (edefMatch) socketsEDef += parseInt(edefMatch[1]);
      }
    });

  const baseWithEth = Math.floor(baseDefense * ethMult);
  if (!edef && !todef) return Math.floor(baseWithEth * (1 + socketsEDef / 100));
  if (!edef && todef)
    return Math.floor(baseWithEth * (1 + socketsEDef / 100)) + todef;

  const totalEdef = (edef + socketsEDef) / 100;
  return todef
    ? Math.floor((baseWithEth + 1) * (1 + totalEdef)) + todef
    : Math.floor((baseWithEth + 1) * (1 + totalEdef));
}

function calculateItemDamage(item, baseType, isMax = false) {
  // Get base damage from the damage table
  const baseDamage = baseDamages[baseType.trim()] || { min: 0, max: 0 };

  // Get the base enhanced damage from the item (extract current value if it's an object)
  let itemEdmg = item.properties?.edmg || 0;
  if (typeof itemEdmg === 'object' && itemEdmg !== null && 'current' in itemEdmg) {
    itemEdmg = itemEdmg.current;
  }

  // Check if item is ethereal (check both properties and description)
  const isEthereal = item.properties?.ethereal || (item.description && item.description.includes("Ethereal"));
  const ethMult = isEthereal ? 1.5 : 1;

  // Calculate enhanced damage from socketed items (jewels AND runes)
  let socketEnhancedDamage = 0;
  const socketElements = document.querySelectorAll(
    '.socketz[data-section="weapon"]'
  );

  socketElements.forEach((socket, index) => {
    if (!socket.dataset.itemName) {
      return;
    }

    let stats = [];
    if (socket.dataset.itemName === "jewel") {
      try {
        stats = JSON.parse(socket.dataset.stats);
      } catch (e) {
        return;
      }
    } else {
      const itemStats = items[socket.dataset.itemName]?.weapon;
      if (itemStats) {
        stats = itemStats
          .split(/\n|,/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    stats.forEach((stat) => {
      // Look for enhanced damage percentages
      const enhancedDamageMatch = stat.match(/\+?(\d+)%\s*Enhanced\s*Damage/i);
      if (enhancedDamageMatch) {
        const value = parseInt(enhancedDamageMatch[1]);
        socketEnhancedDamage += value;
      }
    });
  });

  // Check for corruption enhanced damage
  let corruptionEnhancedDamage = 0;

  const alreadyIncludesCorruption =
    item.properties?.edmgIncludesCorruption === true;

  if (
    !alreadyIncludesCorruption &&
    typeof typeCorruptions !== "undefined" &&
    typeCorruptions.weapon
  ) {
    const corruptionStat = typeCorruptions.weapon;
    const enhancedDamageMatch = corruptionStat.match(
      /\+(\d+)%\s*Enhanced\s*Damage/i
    );
    if (enhancedDamageMatch) {
      corruptionEnhancedDamage = parseInt(enhancedDamageMatch[1]);
    }
  }

// Get flat damage bonuses from jewels FIRST (before ED% is applied)
  let flatDamageBonus = 0;
  socketElements.forEach((socket) => {
    if (!socket.dataset.itemName) return;
    
    let stats = [];
    if (socket.dataset.itemName === "jewel") {
      try {
        stats = JSON.parse(socket.dataset.stats);
      } catch (e) {
        return;
      }
    }
    
    stats.forEach((stat) => {
      // Look for +min or +max damage from jewels
      if (isMax) {
        const maxDmgMatch = stat.match(/\+(\d+) to (Maximum|Max) Damage/i);
        if (maxDmgMatch) {
          flatDamageBonus += parseInt(maxDmgMatch[1]);
        }
      } else {
        const minDmgMatch = stat.match(/\+(\d+) to (Minimum|Min) Damage/i);
        if (minDmgMatch) {
          flatDamageBonus += parseInt(minDmgMatch[1]);
        }
      }
    });
  });

  // Get base min or max damage value and add flat jewel damage to it
   // Get base min or max damage value
  // Get +min/max damage from OTHER EQUIPMENT sockets (NOT weapon sockets)
  // These should be added to base BEFORE ED% is applied
  let nonWeaponSocketFlatDmg = 0;
  const allSections = ['helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
  
  allSections.forEach(section => {
    const sectionSockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    
    sectionSockets.forEach(socket => {
      if (!socket.dataset.stats) return;
      
      let stats = [];
      if (socket.dataset.itemName === "jewel") {
        try {
          stats = JSON.parse(socket.dataset.stats);
        } catch (e) {
          return;
        }
      } else {
        // For runes/gems, parse the stats string
        stats = socket.dataset.stats.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      stats.forEach(stat => {
        if (isMax) {
          const maxDmgMatch = stat.match(/\+(\d+) to (Maximum|Max) Damage/i);
          if (maxDmgMatch) {
            nonWeaponSocketFlatDmg += parseInt(maxDmgMatch[1]);
          }
        } else {
          const minDmgMatch = stat.match(/\+(\d+) to (Minimum|Min) Damage/i);
          if (minDmgMatch) {
            nonWeaponSocketFlatDmg += parseInt(minDmgMatch[1]);
          }
        }
      });
    });
  });

  // Get base min or max damage value and add NON-weapon socket damage
  const base = isMax ? baseDamage.max : baseDamage.min;
  const baseWithOtherEquipmentFlat = base + nonWeaponSocketFlatDmg;

  // Apply ethereal bonus to base damage (including other equipment socket damage)
  const ethBase = Math.floor(baseWithOtherEquipmentFlat * ethMult);

  // Sum up all enhanced damage sources
  const totalEnhancedDamage = itemEdmg + socketEnhancedDamage;

  // Calculate final damage with all percentage bonuses (now other equipment sockets get multiplied!)
  let finalDamage = Math.floor(ethBase * (1 + totalEnhancedDamage / 100));

  // Add item's own tomindmg/tomaxdmg AFTER ED% (like "Adds 8-25 Damage" on items)
  if (isMax && item.properties.tomaxdmg) {
    finalDamage += item.properties.tomaxdmg;
  } else if (!isMax && item.properties.tomindmg) {
    finalDamage += item.properties.tomindmg;
  }


  // Add per-level damage bonus to max damage only as the LAST step
  if (isMax && item.properties.maxdmgperlvl) {
    // Get current character level
    const charLevel = parseInt(document.getElementById("lvlValue").value) || 1;
    // Calculate the per-level damage bonus and floor it
    const perLevelDamage = Math.floor(charLevel * item.properties.maxdmgperlvl);
    finalDamage += perLevelDamage;
  }

  return finalDamage;
}
if (typeof typeCorruptions !== "undefined" && typeCorruptions.weapon) {
  const corruptionStat = typeCorruptions.weapon;
  const enhancedDamageMatch = corruptionStat.match(
    /\+(\d+)%\s*Enhanced\s*Damage/i
  );
  if (enhancedDamageMatch) {
    corruptionEnhancedDamage = parseInt(enhancedDamageMatch[1]);
  }
} else {
}

// // Get base min or max damage value
// const base = isMax ? baseDamage.max : baseDamage.min;
// console.log("Selected base damage value:", base);

// // Apply ethereal bonus to base damage
// const ethBase = Math.floor(base * ethMult);
// console.log("Base damage after ethereal multiplier:", ethBase);

// // Sum up all enhanced damage sources
// const totalEnhancedDamage =
//   itemEdmg + socketEnhancedDamage + corruptionEnhancedDamage;
// console.log("Total enhanced damage calculation:");
// console.log(`- From item: ${itemEdmg}%`);
// console.log(`- From sockets: ${socketEnhancedDamage}%`);
// console.log(`- From corruption: ${corruptionEnhancedDamage}%`);
// console.log(`- Total: ${totalEnhancedDamage}%`);

// // Calculate final damage with all bonuses
// const finalDamage = Math.floor(ethBase * (1 + totalEnhancedDamage / 100));
// console.log(
//   `Final damage calculation: ${ethBase} * (1 + ${totalEnhancedDamage}/100) = ${finalDamage}`
// );

// console.log("=== END CALCULATE ITEM DAMAGE ===");
// return finalDamage;

// Helper function to update weapon description in the UI
function updateWeaponDescription() {
  const weaponSelect = document.getElementById("weapons-dropdown");
  if (!weaponSelect) return;

  const currentItem = weaponSelect.value;
  const currentItemData = itemList[currentItem];

  if (currentItemData) {
    // Get description (generate if dynamic item)
    let description = currentItemData.description;
    if (!description && currentItemData.baseType) {
      description = window.generateItemDescription(currentItem, currentItemData, 'weapons-dropdown');
    }
    if (!description) return;

    const baseType = description.split("<br>")[1];
    const descriptionContainer = document.getElementById("weapon-info");

    if (descriptionContainer) {
      // Save existing corruption and socket information
      const existingSocketStats =
        descriptionContainer.querySelector(".socket-stats");
      const existingCorruptedMod =
        descriptionContainer.querySelector(".corrupted-mod");
      const existingCorruptedText =
        descriptionContainer.querySelector(".corrupted-text");

      // Get the min/max damage values (recalculated with corruptions)
      const isTwoHanded = currentItemData.properties.twohandmin !== undefined;
      const min = isTwoHanded
        ? currentItemData.properties.twohandmin
        : currentItemData.properties.onehandmin;
      const max = isTwoHanded
        ? currentItemData.properties.twohandmax
        : currentItemData.properties.onehandmax;
      const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";

      // Get the description lines
      const lines = description.split("<br>");

      // Find and update the damage line
      const damageIndex = lines.findIndex((line) => line.includes("Damage:"));
      if (damageIndex !== -1) {
        lines[damageIndex] = `${damageType} Damage: ${min}-${max}, Avg ${(
          (min + max) /
          2
        ).toFixed(1)}`;
      }

      // Rebuild the description without socket stats and corruptions
      const mainDescription = lines
        .filter(
          (line) =>
            !line.includes("socket-stats") &&
            !line.includes("corrupted-mod") &&
            !line.includes("corrupted-text")
        )
        .join("<br>");

      // Set the container HTML with the main description
      descriptionContainer.innerHTML = mainDescription;

      // Add back socket stats and corruptions if they exist
      if (existingSocketStats)
        descriptionContainer.appendChild(existingSocketStats);
      if (existingCorruptedMod)
        descriptionContainer.appendChild(existingCorruptedMod);
      if (existingCorruptedText)
        descriptionContainer.appendChild(existingCorruptedText);
    }
  }
}

// Update the event handlers for corruption-related UI interactions
document.addEventListener("DOMContentLoaded", () => {
  // For the corruption modal
  document.querySelectorAll(".property-button").forEach((button) => {
    if (button.textContent.includes("Enhanced Damage")) {
      button.addEventListener("click", () => {
        // Add a listener to update damage when the corruption is applied
        const confirmButton = document.querySelector(".corruption-confirm");
        if (confirmButton) {
          confirmButton.addEventListener("click", () => {
            setTimeout(updateWeaponDisplayWithCorruption, 100);
          });
        }
      });
    }
  });

  // For socketing
  const socketModal = document.getElementById("socketModal");
  if (socketModal) {
    socketModal.querySelectorAll(".socket-item").forEach((item) => {
      const stats = item.querySelector(".sock-stats");
      if (stats && stats.textContent.includes("Enhanced Damage")) {
        item.addEventListener("click", () => {
          setTimeout(updateWeaponDisplayWithCorruption, 100);
        });
      }
    });
  }
});

function handleUpgrade() {
  const select = document.getElementById("helms-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.helms[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) return;

  const isDynamic = currentItemData.baseType && !currentItemData.description;

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(currentItem, currentItemData, 'helms-dropdown');
  }
  if (!description) return;

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;
  const baseType = description.split("<br>")[1];

  if (baseType === upgrades.elite.base) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  const magicalProperties = description
    .split("<br>")
    .slice(3)
    .filter((prop) => !prop.includes("Required") && !prop.includes("Defense:"))
    .join("<br>");

  if (baseType === upgrades.exceptional.base) {
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= baseStrengths[upgrades.elite.base]
    ) {
      const newProperties = {
        ...upgrades.elite.properties,
        defense: calculateItemDefense(currentItemData, upgrades.elite.base),
        reqstr: baseStrengths[upgrades.elite.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.elite.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.elite.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  } else {
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= baseStrengths[upgrades.exceptional.base]
    ) {
      const newProperties = {
        ...upgrades.exceptional.properties,
        defense: calculateItemDefense(
          currentItemData,
          upgrades.exceptional.base
        ),
        reqstr: baseStrengths[upgrades.exceptional.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.exceptional.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.exceptional.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  }

  alert("Character does not meet requirements for upgrade");
}

function handleArmorUpgrade() {
  const select = document.getElementById("armors-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.armors[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) return;

  const isDynamic = currentItemData.baseType && !currentItemData.description;

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(currentItem, currentItemData, 'armors-dropdown');
  }
  if (!description) return;

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;
  const baseType = description.split("<br>")[1];

  if (baseType === upgrades.elite.base) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  const magicalProperties = description
    .split("<br>")
    .slice(3)
    .filter((prop) => !prop.includes("Required") && !prop.includes("Defense:"))
    .join("<br>");

  if (baseType === upgrades.exceptional.base) {
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= baseStrengths[upgrades.elite.base]
    ) {
      const newProperties = {
        ...upgrades.elite.properties,
        defense: calculateItemDefense(currentItemData, upgrades.elite.base),
        reqstr: baseStrengths[upgrades.elite.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.elite.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.elite.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  } else {
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= baseStrengths[upgrades.exceptional.base]
    ) {
      const newProperties = {
        ...upgrades.exceptional.properties,
        defense: calculateItemDefense(
          currentItemData,
          upgrades.exceptional.base
        ),
        reqstr: baseStrengths[upgrades.exceptional.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.exceptional.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.exceptional.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  }

  alert("Character does not meet requirements for upgrade");
}

function handleWeaponUpgrade() {
  const select = document.getElementById("weapons-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.weapons[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) return;

  const isDynamic = currentItemData.baseType && !currentItemData.description;

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(currentItem, currentItemData, 'weapons-dropdown');
  }
  if (!description) return;

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;
  const baseType = description.split("<br>")[1];

  if (baseType === upgrades.elite.base) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  const magicalProperties = description
    .split("<br>")
    .slice(3)
    .filter((prop) => !prop.includes("Required") && !prop.includes("Damage:"))
    .join("<br>");

  const isTwoHanded = currentItemData.properties.twohandmin !== undefined;

  if (baseType === upgrades.exceptional.base) {
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= baseStrengths[upgrades.elite.base]
    ) {
      const newProperties = {
        ...upgrades.elite.properties,
        reqstr: baseStrengths[upgrades.elite.base],
      };

      if (isTwoHanded) {
        newProperties.twohandmin = calculateItemDamage(
          currentItemData,
          upgrades.elite.base,
          false
        );
        newProperties.twohandmax = calculateItemDamage(
          currentItemData,
          upgrades.elite.base,
          true
        );
      } else {
        newProperties.onehandmin = calculateItemDamage(
          currentItemData,
          upgrades.elite.base,
          false
        );
        newProperties.onehandmax = calculateItemDamage(
          currentItemData,
          upgrades.elite.base,
          true
        );
      }

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.elite.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        const newDescription = buildDescriptionWeapon(
          currentItem,
          upgrades.elite.base,
          newProperties,
          magicalProperties
        );

        itemList[currentItem] = {
          description: newDescription,
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  } else {
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= baseStrengths[upgrades.exceptional.base]
    ) {
      const newProperties = {
        ...upgrades.exceptional.properties,
        reqstr: baseStrengths[upgrades.exceptional.base],
      };

      if (isTwoHanded) {
        newProperties.twohandmin = calculateItemDamage(
          currentItemData,
          upgrades.exceptional.base,
          false
        );
        newProperties.twohandmax = calculateItemDamage(
          currentItemData,
          upgrades.exceptional.base,
          true
        );
      } else {
        newProperties.onehandmin = calculateItemDamage(
          currentItemData,
          upgrades.exceptional.base,
          false
        );
        newProperties.onehandmax = calculateItemDamage(
          currentItemData,
          upgrades.exceptional.base,
          true
        );
      }

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.exceptional.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        const newDescription = buildDescriptionWeapon(
          currentItem,
          upgrades.exceptional.base,
          newProperties,
          magicalProperties
        );

        itemList[currentItem] = {
          description: newDescription,
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

          select.dispatchEvent(new Event("change"));
    if (window.unifiedSocketSystem?.updateAll) window.unifiedSocketSystem.updateAll();
      return;
      
    }
  }

  alert("Character does not meet requirements for upgrade");
}

function handleWeaponUpgradeWithCorruption() {
  const select = document.getElementById("weapons-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.weapons[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) return;

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(currentItem, currentItemData, 'weapons-dropdown');
  }
  if (!description) return;

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;
  const baseType = description.split("<br>")[1];

  if (baseType === upgrades.elite.base) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  const magicalProperties = currentItemData.description
    .split("<br>")
    .slice(3)
    .filter((prop) => !prop.includes("Required") && !prop.includes("Damage:"))
    .join("<br>");

  const isTwoHanded = currentItemData.properties.twohandmin !== undefined;
  let targetBase, targetProps;

  if (baseType === upgrades.exceptional.base) {
    // Upgrade to elite
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= baseStrengths[upgrades.elite.base]
    ) {
      targetBase = upgrades.elite.base;
      targetProps = upgrades.elite.properties;
    } else {
      alert("Character does not meet requirements for upgrade");
      return;
    }
  } else {
    // Upgrade to exceptional
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= baseStrengths[upgrades.exceptional.base]
    ) {
      targetBase = upgrades.exceptional.base;
      targetProps = upgrades.exceptional.properties;
    } else {
      alert("Character does not meet requirements for upgrade");
      return;
    }
  }

  if (window.typeCorruptions && window.typeCorruptions[category]) {
    const socketMatch =
      window.typeCorruptions[category].match(/Socketed \((\d+)\)/);
    if (socketMatch) {
      const socketCount = parseInt(socketMatch[1]);
      window.typeCorruptions[category] = `Socketed (${socketCount})`;
      localStorage.setItem(
        "typeCorruptions",
        JSON.stringify(window.typeCorruptions)
      );
      updateCorruptionDisplay(category, `Socketed (${socketCount})`);
      updateSocketCount(category, socketCount);
    }
  }

  // Create new properties with the upgraded base
  const newProperties = {
    ...targetProps,
    reqstr: baseStrengths[targetBase],
  };

  // Create temporary item data with the new base for damage calculation
  const tempItemData = {
    ...currentItemData,
    description: currentItemData.description.replace(baseType, targetBase),
    properties: { ...currentItemData.properties },
  };

  // Calculate new damage with corruptions included
  if (isTwoHanded) {
    newProperties.twohandmin = calculateItemDamage(
      tempItemData,
      targetBase,
      false
    );
    newProperties.twohandmax = calculateItemDamage(
      tempItemData,
      targetBase,
      true
    );
  } else {
    newProperties.onehandmin = calculateItemDamage(
      tempItemData,
      targetBase,
      false
    );
    newProperties.onehandmax = calculateItemDamage(
      tempItemData,
      targetBase,
      true
    );
  }

  // Create a new description with updated damage
  const newDescription = buildDescriptionWeapon(
    currentItem,
    targetBase,
    newProperties,
    magicalProperties
  );

  // Update the item in itemList with new properties and description
  itemList[currentItem] = {
    description: newDescription,
    properties: { ...currentItemData.properties, ...newProperties },
  };

  // Trigger update
  select.dispatchEvent(new Event("change"));
if (window.unifiedSocketSystem?.updateAll) window.unifiedSocketSystem.updateAll();
      return;
  updateWeaponDamageDisplay();

  // Make sure corruptions are still displayed
  if (typeCorruptions.weapon) {
    updateCorruptionDisplay("weapon", typeCorruptions.weapon);
  }
}

function handleGloveUpgrade() {
  const select = document.getElementById("gloves-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.gloves[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) return;

  const isDynamic = currentItemData.baseType && !currentItemData.description;

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(currentItem, currentItemData, 'gloves-dropdown');
  }
  if (!description) return;

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;
  const baseType = description.split("<br>")[1];

  if (baseType === upgrades.elite.base) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  const magicalProperties = description
    .split("<br>")
    .slice(3)
    .filter((prop) => !prop.includes("Required") && !prop.includes("Defense:"))
    .join("<br>");

  if (baseType === upgrades.exceptional.base) {
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= baseStrengths[upgrades.elite.base]
    ) {
      const newProperties = {
        ...upgrades.elite.properties,
        defense: calculateItemDefense(
          currentItemData,
          upgrades.elite.base,
          "gloves"
        ),
        reqstr: baseStrengths[upgrades.elite.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.elite.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.elite.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  } else {
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= baseStrengths[upgrades.exceptional.base]
    ) {
      const newProperties = {
        ...upgrades.exceptional.properties,
        defense: calculateItemDefense(
          currentItemData,
          upgrades.exceptional.base,
          "gloves"
        ),
        reqstr: baseStrengths[upgrades.exceptional.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.exceptional.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.exceptional.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  }

  alert("Character does not meet requirements for upgrade");
}

function handleBeltUpgrade() {
  const select = document.getElementById("belts-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.belts[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) return;

  const isDynamic = currentItemData.baseType && !currentItemData.description;

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(currentItem, currentItemData, 'belts-dropdown');
  }
  if (!description) return;

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;
  const baseType = description.split("<br>")[1];

  if (baseType === upgrades.elite.base) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  const magicalProperties = description
    .split("<br>")
    .slice(3)
    .filter((prop) => !prop.includes("Required") && !prop.includes("Defense:"))
    .join("<br>");

  if (baseType === upgrades.exceptional.base) {
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= baseStrengths[upgrades.elite.base]
    ) {
      const newProperties = {
        ...upgrades.elite.properties,
        defense: calculateItemDefense(
          currentItemData,
          upgrades.elite.base,
          "belts"
        ),
        reqstr: baseStrengths[upgrades.elite.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.elite.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        const section = window.SECTION_MAP && window.SECTION_MAP['belts-dropdown'];
        if (section && window.unifiedSocketSystem) {
          window.unifiedSocketSystem.updateItemDisplay(section);
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.elite.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  } else {
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= baseStrengths[upgrades.exceptional.base]
    ) {
      const newProperties = {
        ...upgrades.exceptional.properties,
        defense: calculateItemDefense(
          currentItemData,
          upgrades.exceptional.base,
          "belts"
        ),
        reqstr: baseStrengths[upgrades.exceptional.base],
      };

      if (isDynamic) {
        // For dynamic items, update baseType and properties only (no description)
        itemList[currentItem] = {
          ...currentItemData,
          baseType: upgrades.exceptional.base,
          properties: { ...currentItemData.properties, ...newProperties },
        };

        // Trigger update manually via socket system to ensure input boxes work
        if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
          const config = window.unifiedSocketSystem.equipmentMap[select.id];
          if (config && config.section) {
            window.unifiedSocketSystem.updateItemDisplay(config.section);
          }
        }
      } else {
        // For static items, build new description
        itemList[currentItem] = {
          description: buildDescription(
            currentItem,
            upgrades.exceptional.base,
            newProperties,
            magicalProperties
          ),
          properties: { ...currentItemData.properties, ...newProperties },
        };
      }

      // For dynamic items, we already called updateItemDisplay above - skip dispatchEvent
      // For static items, dispatch change event to trigger full update
      if (!isDynamic) {
        select.dispatchEvent(new Event("change"));
        if (window.unifiedSocketSystem?.updateAll) {
          window.unifiedSocketSystem.updateAll();
        }
      }
      return;
    }
  }

  alert("Character does not meet requirements for upgrade");
}

function updateDefense() {
  const sections = [
    { id: "helms-dropdown", type: "helm" },
    { id: "armors-dropdown", type: "armor" },
    { id: "gloves-dropdown", type: "gloves" },
    { id: "boots-dropdown", type: "boots" },
    { id: "belts-dropdown", type: "belts" },
    { id: "offs-dropdown", type: "offs" },
  ];

  sections.forEach(({ id, type }) => {
    const select = document.getElementById(id);
    if (!select?.value) return;

    const item = itemList[select.value];
    if (!item) return;

    // Skip items without static descriptions (e.g., items with dynamic descriptions)
    if (!item.description) return;

    const baseType = item.description.split("<br>")[1];
    const newDefense = calculateItemDefense(item, baseType, type);

    // Get current defense value (handling variable stats)
    const currentDefense = (typeof item.properties.defense === 'object' && 'current' in item.properties.defense)
      ? item.properties.defense.current
      : item.properties.defense;

    if (newDefense !== currentDefense) {
      const lines = item.description.split("<br>");
      const defenseIndex = lines.findIndex((line) =>
        line.startsWith("Defense:")
      );
      lines[defenseIndex] = `Defense: ${newDefense}`;
      item.description = lines.join("<br>");

      // Update defense (handling variable stats)
      if (typeof item.properties.defense === 'object' && 'current' in item.properties.defense) {
        item.properties.defense.current = newDefense;
      } else {
        item.properties.defense = newDefense;
      }
      select.dispatchEvent(new Event("change"));
if (window.unifiedSocketSystem?.updateAll) window.unifiedSocketSystem.updateAll();
      return;
    }
  });
}

// Update event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".socketz").forEach((socket) => {
    new MutationObserver(() => requestAnimationFrame(updateDefense)).observe(
      socket,
      {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      }
    );
  });

  ["str", "dex", "vit", "enr", "lvlValue"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateDefense);
  });

  [
    "helms-dropdown",
    "armors-dropdown",
    "gloves-dropdown",
    "boots-dropdown",
    "belts-dropdown",
    "offs-dropdown",
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", updateDefense);
  });
});

function makeEthereal() {
  const select = document.getElementById("helms-dropdown");
  const currentItem = select.value;
  const currentItemData = itemList[currentItem];

  const isCurrentlyEthereal = currentItemData.properties?.ethereal ||
    (currentItemData.description && currentItemData.description.includes("Ethereal"));

  let lines = currentItemData.description.split("<br>");

  if (isCurrentlyEthereal) {
    // Remove ethereal
    currentItemData.properties.ethereal = false;
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*<span[^>]*>Ethereal<\/span>/i, '');
  } else {
    // Add ethereal
    currentItemData.properties.ethereal = true;
    lines[lines.length - 1] += ' <span style="color: #C0C0C0">Ethereal</span>';
  }

  currentItemData.description = lines.join("<br>");
  updateDefense();
}

function makeEtherealArmor() {
  const select = document.getElementById("armors-dropdown");
  const currentItem = select.value;
  const currentItemData = itemList[currentItem];

  const isCurrentlyEthereal = currentItemData.properties?.ethereal ||
    (currentItemData.description && currentItemData.description.includes("Ethereal"));

  let lines = currentItemData.description.split("<br>");

  if (isCurrentlyEthereal) {
    // Remove ethereal
    currentItemData.properties.ethereal = false;
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*<span[^>]*>Ethereal<\/span>/i, '');
  } else {
    // Add ethereal
    currentItemData.properties.ethereal = true;
    lines[lines.length - 1] += ' <span style="color: #C0C0C0">Ethereal</span>';
  }

  currentItemData.description = lines.join("<br>");
  updateDefense();
}

function makeEtherealItem(category) {
  const select = document.getElementById(`${category}-dropdown`);
  const currentItem = select.value;
  const currentItemData = itemList[currentItem];

  if (!currentItemData) return;

  // Ensure properties object exists
  if (!currentItemData.properties) {
    currentItemData.properties = {};
  }

  // Check if ethereal is currently applied
  const isCurrentlyEthereal = currentItemData.properties.ethereal ||
    (currentItemData.description && currentItemData.description.includes("Ethereal"));

  // Check if there's a socket corruption to preserve
  let socketCorruption = null;
  const categoryInfo = document.getElementById(`${category}-info`);
  const corruptedMod = categoryInfo?.querySelector(".corrupted-mod");

  if (corruptedMod && corruptedMod.textContent.includes("Socketed")) {
    socketCorruption = corruptedMod.textContent;
  }

  if (category === "weapons") {
    // Check if this is a dynamic item (has baseType)
    const isDynamic = currentItemData.baseType;

    if (isDynamic) {
      // For dynamic items: toggle ethereal property
      if (isCurrentlyEthereal) {
        // Remove ethereal
        currentItemData.properties.ethereal = false;
      } else {
        // Add ethereal
        currentItemData.properties.ethereal = true;
      }

      // Trigger update to regenerate description with/without ethereal
      if (window.unifiedSocketSystem && window.unifiedSocketSystem.updateAll) {
        window.unifiedSocketSystem.updateAll();
      }
    } else {
      // For static items
      let description = currentItemData.description;
      if (!description) return;

      const baseType = description.split("<br>")[1];
      const isTwoHanded = currentItemData.properties.twohandmin !== undefined;

      if (isCurrentlyEthereal) {
        // Remove ethereal
        currentItemData.properties.ethereal = false;

        // Remove ethereal text from description
        description = description.replace(/\s*<span[^>]*>Ethereal<\/span>/i, '');

        // Recalculate damage without ethereal
        const tempItem = {
          description: description,
          properties: currentItemData.properties,
        };

        const newProperties = {
          ...currentItemData.properties,
        };

        if (isTwoHanded) {
          newProperties.twohandmin = calculateItemDamage(tempItem, baseType, false);
          newProperties.twohandmax = calculateItemDamage(tempItem, baseType, true);
        } else {
          newProperties.onehandmin = calculateItemDamage(tempItem, baseType, false);
          newProperties.onehandmax = calculateItemDamage(tempItem, baseType, true);
        }

        itemList[currentItem] = {
          description: buildDescriptionWeapon(
            currentItem,
            baseType,
            newProperties,
            description
              .split("<br>")
              .slice(3)
              .filter(
                (prop) => !prop.includes("Required") && !prop.includes("Damage:")
              )
              .join("<br>")
          ),
          properties: newProperties,
        };

        if (isTwoHanded) {
          document.getElementById("twohandmindmgcontainer").textContent = newProperties.twohandmin;
          document.getElementById("twohandmaxdmgcontainer").textContent = newProperties.twohandmax;
        } else {
          document.getElementById("onehandmindmgcontainer").textContent = newProperties.onehandmin;
          document.getElementById("onehandmaxdmgcontainer").textContent = newProperties.onehandmax;
        }
      } else {
        // Add ethereal
        currentItemData.properties.ethereal = true;

        const etherealDesc = description + ' <span style="color: #C0C0C0">Ethereal</span>';

        const tempItem = {
          description: etherealDesc,
          properties: currentItemData.properties,
        };

        const newProperties = {
          ...currentItemData.properties,
        };

        if (isTwoHanded) {
          newProperties.twohandmin = calculateItemDamage(tempItem, baseType, false);
          newProperties.twohandmax = calculateItemDamage(tempItem, baseType, true);
        } else {
          newProperties.onehandmin = calculateItemDamage(tempItem, baseType, false);
          newProperties.onehandmax = calculateItemDamage(tempItem, baseType, true);
        }

        itemList[currentItem] = {
          description: buildDescriptionWeapon(
            currentItem,
            baseType,
            newProperties,
            currentItemData.description
              .split("<br>")
              .slice(3)
              .filter(
                (prop) => !prop.includes("Required") && !prop.includes("Damage:")
              )
              .join("<br>") + ' <span style="color: #C0C0C0">Ethereal</span>'
          ),
          properties: newProperties,
        };

        if (isTwoHanded) {
          document.getElementById("twohandmindmgcontainer").textContent = newProperties.twohandmin;
          document.getElementById("twohandmaxdmgcontainer").textContent = newProperties.twohandmax;
        } else {
          document.getElementById("onehandmindmgcontainer").textContent = newProperties.onehandmin;
          document.getElementById("onehandmaxdmgcontainer").textContent = newProperties.onehandmax;
        }
      }
    }
  } else {
    // Armor handling - check if dynamic
    const isDynamic = currentItemData.baseType;

    if (isDynamic) {
      // For dynamic items: toggle ethereal property
      if (isCurrentlyEthereal) {
        // Remove ethereal
        currentItemData.properties.ethereal = false;
      } else {
        // Add ethereal
        currentItemData.properties.ethereal = true;
      }

      // Trigger update to regenerate description with/without ethereal
      if (window.unifiedSocketSystem && window.unifiedSocketSystem.updateAll) {
        window.unifiedSocketSystem.updateAll();
      }
    } else {
      // For static items
      let lines = currentItemData.description.split("<br>");
      const baseType = lines[1];

      if (isCurrentlyEthereal) {
        // Remove ethereal
        currentItemData.properties.ethereal = false;

        // Remove ethereal text
        lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*<span[^>]*>Ethereal<\/span>/i, '');
      } else {
        // Add ethereal
        currentItemData.properties.ethereal = true;

        // Add ethereal text
        lines[lines.length - 1] += ' <span style="color: #C0C0C0">Ethereal</span>';
      }

      // Recalculate defense (with or without ethereal multiplier)
      const newDefense = calculateItemDefense(currentItemData, baseType, category);
      const defenseIndex = lines.findIndex((line) => line.startsWith("Defense:"));
      lines[defenseIndex] = `Defense: ${newDefense}`;
      currentItemData.description = lines.join("<br>");

      // Update defense (handling variable stats)
      if (typeof currentItemData.properties.defense === 'object' && 'current' in currentItemData.properties.defense) {
        currentItemData.properties.defense.current = newDefense;
      } else {
        currentItemData.properties.defense = newDefense;
      }
    }
  }

  // Reapply socket corruption if there was one
  if (socketCorruption) {
    const socketMatch = socketCorruption.match(/Socketed \((\d+)\)/);
    if (socketMatch) {
      const socketCount = parseInt(socketMatch[1]);
      typeCorruptions[category] = `Socketed (${socketCount})`;
      localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));
      updateCorruptionDisplay(category, `Socketed (${socketCount})`);
      updateSocketCount(category, socketCount);
    }
  }

  // Trigger change event to update display
  select.dispatchEvent(new Event("change"));
  if (window.unifiedSocketSystem?.updateAll) window.unifiedSocketSystem.updateAll();

  // Refresh saved state AFTER updateAll() completes (so description and properties are in sync)
  const dropdownId = `${category}-dropdown`;
  if (typeof window.refreshSavedState === 'function') {
    setTimeout(() => window.refreshSavedState(dropdownId, category), 100);
  }
}

function makeEtherealWeapon(weaponName) {
  const itemData = itemList[weaponName];
  if (!itemData) return;

  const isCurrentlyEthereal = itemData.properties?.ethereal ||
    (itemData.description && itemData.description.includes("Ethereal"));

  const baseType = itemData.description.split("<br>")[1];
  const isTwoHanded = itemData.properties.twohandmin !== undefined;

  let lines = itemData.description.split("<br>");

  if (isCurrentlyEthereal) {
    // Remove ethereal
    itemData.properties.ethereal = false;
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*<span[^>]*>Ethereal<\/span>/i, '');
  } else {
    // Add ethereal
    itemData.properties.ethereal = true;
    lines[lines.length - 1] += ' <span style="color: #C0C0C0">Ethereal</span>';
  }

  itemData.description = lines.join("<br>");

  // Recalculate damage (with or without ethereal multiplier)
  if (isTwoHanded) {
    itemData.properties.twohandmin = calculateItemDamage(
      itemData,
      baseType,
      false
    );
    itemData.properties.twohandmax = calculateItemDamage(
      itemData,
      baseType,
      true
    );
  } else {
    itemData.properties.onehandmin = calculateItemDamage(
      itemData,
      baseType,
      false
    );
    itemData.properties.onehandmax = calculateItemDamage(
      itemData,
      baseType,
      true
    );
  }

  // Update display elements
  document
    .getElementById("weapons-dropdown")
    .dispatchEvent(new Event("change"));
  updateWeaponDamageDisplay();
  updateWeaponDescription();
}

function updateWeaponDamageDisplay() {
  const weaponSelect = document.getElementById("weapons-dropdown");
  if (!weaponSelect) return;

  const currentItem = weaponSelect.value;
  const currentItemData = itemList[currentItem];

  if (currentItemData) {
    const isDynamic = currentItemData.baseType;
    let description;

    // For dynamic items, we need to get the base type from a generated description
    // But first we need to know if it's one-handed or two-handed to calculate damage
    const isTwoHanded = currentItemData.properties.twohandmin !== undefined;
    const isJavelin = currentItemData.properties.javelin === 1;

    // Generate a temporary description just to extract the base type
    if (isDynamic) {
      const tempDesc = window.generateItemDescription(currentItem, currentItemData, 'weapons-dropdown');
      description = tempDesc;
    } else {
      description = currentItemData.description;
    }

    if (!description) return;

    const baseType = description.split("<br>")[1];

    // Calculate new min/max damage values FIRST (before regenerating description)
    // This ensures the damage properties exist when generateItemDescription is called
    if (isTwoHanded) {
      currentItemData.properties.twohandmin = calculateItemDamage(
        currentItemData,
        baseType,
        false
      );
      currentItemData.properties.twohandmax = calculateItemDamage(
        currentItemData,
        baseType,
        true
      );

      // Update the UI displays
      const minDisplay = document.getElementById("twohandmindmgcontainer");
      const maxDisplay = document.getElementById("twohandmaxdmgcontainer");
      if (minDisplay)
        minDisplay.textContent = currentItemData.properties.twohandmin;
      if (maxDisplay)
        maxDisplay.textContent = currentItemData.properties.twohandmax;
    } else {
      currentItemData.properties.onehandmin = calculateItemDamage(
        currentItemData,
        baseType,
        false
      );
      currentItemData.properties.onehandmax = calculateItemDamage(
        currentItemData,
        baseType,
        true
      );

      // Update the UI displays
      const minDisplay = document.getElementById("onehandmindmgcontainer");
      const maxDisplay = document.getElementById("onehandmaxdmgcontainer");
      if (minDisplay)
        minDisplay.textContent = currentItemData.properties.onehandmin;
      if (maxDisplay)
        maxDisplay.textContent = currentItemData.properties.onehandmax;

      // For javelins, also calculate throw damage
      if (isJavelin) {
        const throwBaseType = baseType + " (throw)";
        currentItemData.properties.throwmin = calculateItemDamage(
          currentItemData,
          throwBaseType,
          false
        );
        currentItemData.properties.throwmax = calculateItemDamage(
          currentItemData,
          throwBaseType,
          true
        );
      }
    }

    // For dynamic items, let the socket system handle the display
    // (Don't set description property or call updateWeaponTooltip - that would destroy input boxes!)
    if (isDynamic) {
      // Just trigger a display update via socket system
      if (window.unifiedSocketSystem && window.unifiedSocketSystem.equipmentMap) {
        const config = window.unifiedSocketSystem.equipmentMap['weapons-dropdown'];
        if (config && config.section) {
          window.unifiedSocketSystem.updateItemDisplay(config.section);
        }
      }
    } else {
      // For static items, update the tooltip normally
      updateWeaponTooltip(currentItemData, baseType, isTwoHanded);

      // Re-attach event listeners to stat input boxes in the weapon info
      if (typeof window.attachStatInputListeners === 'function') {
        window.attachStatInputListeners();
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Add MutationObserver to weapon sockets
  const weaponSockets = document.querySelectorAll(
    '.socketz[data-section="weapon"]'
  );

  weaponSockets.forEach((socket) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" || mutation.type === "childList") {
          requestAnimationFrame(updateWeaponDamageDisplay);
        }
      });
    });

    observer.observe(socket, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  });

  // Additional event listeners for comprehensive updates
  document.querySelectorAll(".socketz").forEach((socket) => {
    socket.addEventListener("click", updateWeaponDamageDisplay);
    socket.addEventListener("contextmenu", updateWeaponDamageDisplay);
  });

  ["str", "dex", "vit", "enr", "lvlValue"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", updateWeaponDamageDisplay);
    }
  });

  document
    .getElementById("weapons-dropdown")
    ?.addEventListener("change", updateWeaponDamageDisplay);
});

document
  .getElementById("weapons-dropdown")
  ?.addEventListener("change", (event) => {
    const selectedItem = event.target.value;
    const itemData = itemList[selectedItem];

    if (itemData) {
      // Update description container
      const descriptionContainer = document.getElementById("weapon-info");
      if (descriptionContainer) {
        // Split the description into lines and create HTML
        const descriptionLines = itemData.description.split("<br>");
        const formattedDescription = descriptionLines
          .map((line) => `<div>${line}</div>`)
          .join("");
        descriptionContainer.innerHTML = formattedDescription;
      }

      // Update damage display
      updateWeaponDamageDisplay();
    }
  });

const weaponDropdown = document.getElementById("weapons-dropdown");
if (weaponDropdown) {
  weaponDropdown.addEventListener(
    "change",
    function () {
      // First check if the selected weapon has per-level damage
      const selectedWeapon = weaponDropdown.value;
      const itemData = itemList[selectedWeapon];

      if (itemData && itemData.properties.maxdmgperlvl) {
        // If it has per-level damage, update the display
        updateWeaponDisplayWithPerLevelDamage();
      }
    },
    100
  ); // Small delay to ensure other event handlers complete first

  const lvlInput = document.getElementById("lvlValue");
  if (lvlInput) {
    lvlInput.addEventListener("input", function () {
      const weaponDropdown = document.getElementById("weapons-dropdown");
      if (weaponDropdown) {
        const selectedWeapon = weaponDropdown.value;
        const itemData = itemList[selectedWeapon];

        if (itemData && itemData.properties.maxdmgperlvl) {
          // Update the display with the new level value
          updateWeaponDisplayWithPerLevelDamage();
        }
      }
    });
  }
}

const originalWeaponChangeHandler =
  document.getElementById("weapons-dropdown")?.onchange;
document
  .getElementById("weapons-dropdown")
  ?.addEventListener("change", function (event) {
    const selectedWeapon = event.target.value;
    const itemData = itemList[selectedWeapon];

    // Reset per-level damage to prevent accumulation when switching weapons
    if (itemData && itemData.properties.maxdmgperlvl) {
      // Store the original max damage value from the item data
      if (itemData.properties.onehandmax !== undefined) {
        // For one-handed weapons
        itemData._originalOneHandMax =
          itemData._originalOneHandMax || itemData.properties.onehandmax;
        itemData.properties.onehandmax = itemData._originalOneHandMax;
      } else if (itemData.properties.twohandmax !== undefined) {
        // For two-handed weapons
        itemData._originalTwoHandMax =
          itemData._originalTwoHandMax || itemData.properties.twohandmax;
        itemData.properties.twohandmax = itemData._originalTwoHandMax;
      }
    }

    // Then let the other handlers run
    if (originalWeaponChangeHandler) {
      originalWeaponChangeHandler.call(this, event);
    }
  });

function updateWeaponDescription() {
  const weaponSelect = document.getElementById("weapons-dropdown");
  if (!weaponSelect) return;

  const currentItem = weaponSelect.value;
  const currentItemData = itemList[currentItem];

  if (currentItemData) {
    // Get description (generate if dynamic item)
    let description = currentItemData.description;
    if (!description && currentItemData.baseType) {
      description = window.generateItemDescription(currentItem, currentItemData, 'weapons-dropdown');
    }
    if (!description) return;

    const baseType = description.split("<br>")[1];
    const descriptionContainer = document.getElementById("weapon-info");

    if (descriptionContainer) {
      // Save existing corruption and socket information
      const existingSocketStats =
        descriptionContainer.querySelector(".socket-stats");
      const existingCorruptedMod =
        descriptionContainer.querySelector(".corrupted-mod");
      const existingCorruptedText =
        descriptionContainer.querySelector(".corrupted-text");

      // Get the min/max damage values (recalculated with corruptions)
      const isTwoHanded = currentItemData.properties.twohandmin !== undefined;
      const min = isTwoHanded
        ? currentItemData.properties.twohandmin
        : currentItemData.properties.onehandmin;
      const max = isTwoHanded
        ? currentItemData.properties.twohandmax
        : currentItemData.properties.onehandmax;
      const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";

      // Get the description lines
      const lines = currentItemData.description.split("<br>");

      // Find and update the damage line
      const damageIndex = lines.findIndex((line) => line.includes("Damage:"));
      if (damageIndex !== -1) {
        lines[damageIndex] = `${damageType} Damage: ${min}-${max}`;
      }

      // Rebuild the description without socket stats and corruptions
      const mainDescription = lines
        .filter(
          (line) =>
            !line.includes("socket-stats") &&
            !line.includes("corrupted-mod") &&
            !line.includes("corrupted-text")
        )
        .join("<br>");

      // Set the container HTML with the main description
      descriptionContainer.innerHTML = mainDescription;

      // Add back socket stats and corruptions if they exist
      if (existingSocketStats)
        descriptionContainer.appendChild(existingSocketStats);
      if (existingCorruptedMod)
        descriptionContainer.appendChild(existingCorruptedMod);
      if (existingCorruptedText)
        descriptionContainer.appendChild(existingCorruptedText);
    }
  }
}

function collectAllWeaponStats() {
  const allStats = {
    enhancedDamage: 0,
    minDamage: 0,
    maxDamage: 0,
    attackRating: 0,
    // Add other stat types as needed
  };

  // 1. Process socketed items
  document
    .querySelectorAll('.socketz[data-section="weapon"]')
    .forEach((socket) => {
      if (!socket.dataset.itemName) return;

      let stats = [];
      if (socket.dataset.itemName === "jewel") {
        try {
          stats = JSON.parse(socket.dataset.stats);
        } catch (e) {
          return;
        }
      } else {
        const itemStats = items[socket.dataset.itemName]?.weapon;
        if (itemStats) {
          stats = itemStats
            .split(/\n|,/)
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }

      stats.forEach((stat) => {
        // Enhanced damage
        const edMatch = stat.match(/\+?(\d+)%\s*Enhanced\s*Damage/i);
        if (edMatch) {
          allStats.enhancedDamage += parseInt(edMatch[1]);
        }

        // Min damage bonus
        const minDmgMatch = stat.match(/\+(\d+) to (Minimum|Min) Damage/i);
        if (minDmgMatch) {
          allStats.minDamage += parseInt(minDmgMatch[1]);
        }

        // Max damage bonus
        const maxDmgMatch = stat.match(/\+(\d+) to (Maximum|Max) Damage/i);
        if (maxDmgMatch) {
          allStats.maxDamage += parseInt(maxDmgMatch[1]);
        }

        // Attack rating bonus
        const arMatch = stat.match(/\+(\d+) to Attack Rating/i);
        if (arMatch) {
          allStats.attackRating += parseInt(arMatch[1]);
        }
      });
    });

  // 2. Process corruption stats
  if (typeCorruptions && typeCorruptions.weapon) {
    const corruptionStat = typeCorruptions.weapon;

    // Enhanced damage from corruption
    const edMatch = corruptionStat.match(/\+(\d+)%\s*Enhanced\s*Damage/i);
    if (edMatch) {
      const edmg = parseInt(edMatch[1]);
      allStats.enhancedDamage += edmg;
    }

    // Attack rating from corruption
    const arMatch = corruptionStat.match(/\+(\d+) to Attack Rating/i);
    if (arMatch) {
      allStats.attackRating += parseInt(arMatch[1]);
    }

    // Other corruption stats can be added here
  }

  return allStats;
}

function updateWeaponDisplayWithCorruption() {
  // Get current weapon
  const weaponSelect = document.getElementById("weapons-dropdown");
  if (!weaponSelect || !weaponSelect.value) return;

  const selectedWeapon = weaponSelect.value;
  const currentItemData = itemList[selectedWeapon];

  if (!currentItemData) return;

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(selectedWeapon, currentItemData, 'weapons-dropdown');
  }
  if (!description) return;

  // Get base type for damage calculation
  const baseType = description.split("<br>")[1];
  const weaponInfo = document.getElementById("weapon-info");

  if (!weaponInfo) return;

  // Check if we need to apply the corruption to the item's edmg property
  if (typeCorruptions && typeCorruptions.weapon) {
    const corruptionStat = typeCorruptions.weapon;
    const edmgMatch = corruptionStat.match(/\+(\d+)%\s*Enhanced\s*Damage/i);

    if (edmgMatch && !currentItemData.properties.edmgIncludesCorruption) {
      const corruptionEdmg = parseInt(edmgMatch[1]);
      const baseEdmg = currentItemData.properties.edmg || 0;

      // Apply corruption Enhanced Damage to the item's properties
      currentItemData.properties.edmg = baseEdmg + corruptionEdmg;
      currentItemData.properties.edmgIncludesCorruption = true;
    }
  }

  // Calculate new damage with corruption
  const isTwoHanded = currentItemData.properties.twohandmin !== undefined;

  // Calculate new min/max damage including corruption bonuses
  if (isTwoHanded) {
    currentItemData.properties.twohandmin = calculateItemDamage(
      currentItemData,
      baseType,
      false
    );
    currentItemData.properties.twohandmax = calculateItemDamage(
      currentItemData,
      baseType,
      true
    );
  } else {
    currentItemData.properties.onehandmin = calculateItemDamage(
      currentItemData,
      baseType,
      false
    );
    currentItemData.properties.onehandmax = calculateItemDamage(
      currentItemData,
      baseType,
      true
    );
  }

  // Update damage display
  if (isTwoHanded) {
    document.getElementById("twohandmindmgcontainer").textContent =
      currentItemData.properties.twohandmin;
    document.getElementById("twohandmaxdmgcontainer").textContent =
      currentItemData.properties.twohandmax;
  } else {
    document.getElementById("onehandmindmgcontainer").textContent =
      currentItemData.properties.onehandmin;
    document.getElementById("onehandmaxdmgcontainer").textContent =
      currentItemData.properties.onehandmax;
  }

  // Update description
  updateWeaponDescription();
}

function updateCorruptionDisplay(type, corruptionMod) {
  const containerMap = {
    ringOne: "ringsone-info",
    ringTwo: "ringstwo-info",
  };

  const containerId = containerMap[type] || `${type}-info`;
  const container = document.getElementById(containerId);

  if (!container) return;

  const existingMod = container.querySelector(".corrupted-mod");
  const existingText = container.querySelector(".corrupted-text");
  if (existingMod) existingMod.remove();
  if (existingText) existingText.remove();

  const resultDiv = document.createElement("div");
  resultDiv.className = "corrupted-mod";
  resultDiv.textContent = corruptionMod;

  const corruptedText = document.createElement("div");
  corruptedText.className = "corrupted-text";
  corruptedText.textContent = "Corrupted";

  container.appendChild(resultDiv);
  container.appendChild(corruptedText);

  // If it's a weapon corruption with Enhanced Damage, update the damage display
  if (type === "weapon" && corruptionMod.includes("Enhanced Damage")) {
    updateWeaponDisplayWithCorruption();
  }
}

function updateWeaponTooltip(currentItemData, baseType, isTwoHanded) {
  const weaponInfo = document.getElementById("weapon-info");
  if (!weaponInfo) return;

  // Save existing socket stats and corruption information
  const socketStats = weaponInfo.querySelector(".socket-stats");
  const corruptedMod = weaponInfo.querySelector(".corrupted-mod");
  const corruptedText = weaponInfo.querySelector(".corrupted-text");

  // Get current min/max damage values
  const min = isTwoHanded
    ? currentItemData.properties.twohandmin
    : currentItemData.properties.onehandmin;
  const max = isTwoHanded
    ? currentItemData.properties.twohandmax
    : currentItemData.properties.onehandmax;
  const avg = ((min + max) / 2).toFixed(1);
  const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";

  // Ensure description exists before parsing
  if (!currentItemData.description) {
    console.warn("updateWeaponTooltip: description is undefined for item", currentItemData);
    return;
  }

  // Parse the current description
  const lines = currentItemData.description.split("<br>");

  // Find and update or insert the damage line
  const damageLineIndex = lines.findIndex((line) => line.includes("Damage:"));
  const damageLine = `${damageType} Damage: ${min} to ${max}, Avg ${avg}`;

  if (damageLineIndex !== -1) {
    // Update existing damage line
    lines[damageLineIndex] = damageLine;
  } else {
    // Insert damage line after base type (which is usually at index 1)
    // Look for where to insert - after the base type line
    let insertIndex = 2; // Default: after item name (0) and base type (1)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("Required")) {
        insertIndex = i;
        break;
      }
    }
    lines.splice(insertIndex, 0, damageLine);
  }

  // Rebuild the description
  const updatedDescription = lines.join("<br>");

  // Update the item object with new description
  currentItemData.description = updatedDescription;

  // Update the display
  weaponInfo.innerHTML = updatedDescription;

  // Re-add socket stats and corruption indicators
  if (socketStats) weaponInfo.appendChild(socketStats);
  if (corruptedMod) weaponInfo.appendChild(corruptedMod);
  if (corruptedText) weaponInfo.appendChild(corruptedText);

  // Update socket system to regenerate merged stats for dynamic items
  if (window.unifiedSocketSystem && typeof window.unifiedSocketSystem.updateAll === 'function') {
    window.unifiedSocketSystem.updateAll();
  }
}

function updateWeaponDescription(itemData, isTwoHanded) {
  const weaponInfo = document.getElementById("weapon-info");
  if (!weaponInfo) return;

  const min = isTwoHanded
    ? itemData.properties.twohandmin
    : itemData.properties.onehandmin;
  const max = isTwoHanded
    ? itemData.properties.twohandmax
    : itemData.properties.onehandmax;
  const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";

  const lines = itemData.description.split("<br>");
  const damageLine = `${damageType} Damage: ${min}-${max}`;

  // Find and update or insert the damage line
  let damageLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Damage:")) {
      damageLineIndex = i;
      break;
    }
  }

  if (damageLineIndex !== -1) {
    // Update existing damage line
    lines[damageLineIndex] = damageLine;
  } else {
    // Insert damage line before first "Required" line or at index 2
    let insertIndex = 2;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("Required")) {
        insertIndex = i;
        break;
      }
    }
    lines.splice(insertIndex, 0, damageLine);
  }

  // Save corruption and socket info
  const corruptedMod = weaponInfo.querySelector(".corrupted-mod");
  const corruptedText = weaponInfo.querySelector(".corrupted-text");
  const socketStats = weaponInfo.querySelector(".socket-stats");

  // Update description
  itemData.description = lines.join("<br>");

  // Update the HTML
  weaponInfo.innerHTML = itemData.description;

  // Re-add socket stats and corruption text
  if (socketStats) weaponInfo.appendChild(socketStats);
  if (corruptedMod) weaponInfo.appendChild(corruptedMod);
  if (corruptedText) weaponInfo.appendChild(corruptedText);
}

function updateWeaponDisplayWithPerLevelDamage() {
  const weaponSelect = document.getElementById("weapons-dropdown");
  if (!weaponSelect || !weaponSelect.value) return;

  const selectedWeapon = weaponSelect.value;
  const currentItemData = itemList[selectedWeapon];

  if (!currentItemData) return;

  // Get description - for dynamic items always regenerate to reflect current property values
  let description;
  const isDynamic = currentItemData.baseType;

  if (isDynamic) {
    // Dynamic items (with baseType) must always regenerate to show current values
    description = window.generateItemDescription(selectedWeapon, currentItemData, 'weapons-dropdown');
  } else {
    // Static items can use cached description
    description = currentItemData.description;
  }

  if (!description) return;

  // Get base type for damage calculation
  const baseType = description.split("<br>")[1];

  // If baseType is invalid or calculation returns NaN, just display the static values
  if (!baseType || !baseType.trim()) {
    return;
  }
  const weaponInfo = document.getElementById("weapon-info");

  if (!weaponInfo) return;

  // Determine if it's one-handed or two-handed
  const isTwoHanded = currentItemData.properties.twohandmin !== undefined;

  // Calculate the base enhanced damage values first
  let minDamage, maxDamage;
  if (isTwoHanded) {
    // For two-handed weapons
    let baseMinDamage = calculateItemDamage(currentItemData, baseType, false);

    // For max damage, first calculate without per-level bonus
    let baseMaxDamage = calculateItemDamage(
      {
        ...currentItemData,
        properties: { ...currentItemData.properties, maxdmgperlvl: 0 },
      },
      baseType,
      true
    );

    // Get flat damage bonuses from tomindmg and tomaxdmg properties
    const toMinDamage = currentItemData.properties.tomindmg || 0;
    const toMaxDamage = currentItemData.properties.tomaxdmg || 0;


    // Add flat min damage bonus
    minDamage = baseMinDamage + toMinDamage;

    // Get current character level for per-level damage calculation
    const charLevel = parseInt(document.getElementById("lvlValue").value) || 1;

    // Calculate the per-level damage bonus if present
    let perLevelDamage = 0;
    if (currentItemData.properties.maxdmgperlvl) {
      perLevelDamage = Math.floor(
        charLevel * currentItemData.properties.maxdmgperlvl
      );
    }

    // Add per-level bonus and flat max damage bonus
    maxDamage = baseMaxDamage + perLevelDamage + toMaxDamage;
  } else {
    // For one-handed weapons
    let baseMinDamage = calculateItemDamage(currentItemData, baseType, false);

    // For max damage, first calculate without per-level bonus
    let baseMaxDamage = calculateItemDamage(
      {
        ...currentItemData,
        properties: { ...currentItemData.properties, maxdmgperlvl: 0 },
      },
      baseType,
      true
    );

    // Get flat damage bonuses from tomindmg and tomaxdmg properties
    const toMinDamage = currentItemData.properties.tomindmg || 0;
    const toMaxDamage = currentItemData.properties.tomaxdmg || 0;


    // Add flat min damage bonus
    minDamage = baseMinDamage + toMinDamage;

    // Get current character level for per-level damage calculation
    const charLevel = parseInt(document.getElementById("lvlValue").value) || 1;

    // Calculate the per-level damage bonus if present
    let perLevelDamage = 0;
    if (currentItemData.properties.maxdmgperlvl) {
      perLevelDamage = Math.floor(
        charLevel * currentItemData.properties.maxdmgperlvl
      );
    }

    // Add per-level bonus and flat max damage bonus
    maxDamage = baseMaxDamage + perLevelDamage + toMaxDamage;
  }

  // Store the calculated damage values on the item for display and further calculations
  if (isTwoHanded) {
    currentItemData.properties.twohandmin = minDamage;
    currentItemData.properties.twohandmax = maxDamage;
  } else {
    currentItemData.properties.onehandmin = minDamage;
    currentItemData.properties.onehandmax = maxDamage;
  }

  // Update the UI to show the damage with per-level bonus added
  const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";
  const min = isTwoHanded
    ? currentItemData.properties.twohandmin
    : currentItemData.properties.onehandmin;
  const max = isTwoHanded
    ? currentItemData.properties.twohandmax
    : currentItemData.properties.onehandmax;

  // Update description
  const lines = currentItemData.description.split("<br>");
  const damageLine = `${damageType} Damage: ${min}-${max}`;

  // Find and update or insert the damage line
  let damageLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Damage:")) {
      damageLineIndex = i;
      break;
    }
  }

  if (damageLineIndex !== -1) {
    // Update existing damage line
    lines[damageLineIndex] = damageLine;
  } else {
    // Insert damage line before first "Required" line or at index 2
    let insertIndex = 2;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("Required")) {
        insertIndex = i;
        break;
      }
    }
    lines.splice(insertIndex, 0, damageLine);
  }

  // Save corruption and socket info
  const corruptedMod = weaponInfo.querySelector(".corrupted-mod");
  const corruptedText = weaponInfo.querySelector(".corrupted-text");
  const socketStats = weaponInfo.querySelector(".socket-stats");

  // Update description
  currentItemData.description = lines.join("<br>");

  // Update the HTML
  weaponInfo.innerHTML = currentItemData.description;

  // Re-add socket stats and corruption text
  if (socketStats) weaponInfo.appendChild(socketStats);
  if (corruptedMod) weaponInfo.appendChild(corruptedMod);
  if (corruptedText) weaponInfo.appendChild(corruptedText);

  // Update damage display containers
  if (isTwoHanded) {
    const minContainer = document.getElementById("twohandmindmgcontainer");
    const maxContainer = document.getElementById("twohandmaxdmgcontainer");
    if (minContainer) minContainer.textContent = min;
    if (maxContainer) maxContainer.textContent = max;
  } else {
    const minContainer = document.getElementById("onehandmindmgcontainer");
    const maxContainer = document.getElementById("onehandmaxdmgcontainer");
    if (minContainer) minContainer.textContent = min;
    if (maxContainer) maxContainer.textContent = max;
  }

  // Re-attach event listeners to stat input boxes in the weapon info
  if (typeof window.attachStatInputListeners === 'function') {
    window.attachStatInputListeners();
  }
}

// This is a standalone function that only handles shield ethereal conversion
function makeEtherealShield() {
  const select = document.getElementById("offs-dropdown");
  const currentItem = select.value;
  const currentItemData = itemList[currentItem];

  if (!currentItemData) return;

  // Check if ethereal is currently applied
  const isCurrentlyEthereal = currentItemData.properties?.ethereal ||
    (currentItemData.description && currentItemData.description.includes("Ethereal"));

  // Get description (generate if dynamic item)
  let description = currentItemData.description;
  if (!description && currentItemData.baseType) {
    description = window.generateItemDescription(currentItem, currentItemData, 'offs-dropdown');
  }
  if (!description) return;

  // Get base type from description
  const baseType = description.split("<br>")[1];

  // Get base defense from your table
  const baseDefense = baseDefenses[baseType] || 0;

  // Get item's enhanced defense and other properties
  const edef = currentItemData.properties.edef || 0;
  const todef = currentItemData.properties.todef || 0;

  let lines = currentItemData.description.split("<br>");

  if (isCurrentlyEthereal) {
    // Remove ethereal
    currentItemData.properties.ethereal = false;
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*<span[^>]*>Ethereal<\/span>/i, '');

    // Calculate defense without ethereal multiplier
    let newDefense;
    if (edef > 0) {
      newDefense = Math.floor(baseDefense * (1 + edef / 100));
      if (todef > 0) {
        newDefense += todef;
      }
    } else if (todef > 0) {
      newDefense = baseDefense + todef;
    } else {
      newDefense = baseDefense;
    }

    currentItemData.properties.defense = newDefense;

    const defenseIndex = lines.findIndex((line) => line.startsWith("Defense:"));
    if (defenseIndex !== -1) {
      lines[defenseIndex] = `Defense: ${newDefense}`;
    }
  } else {
    // Add ethereal
    currentItemData.properties.ethereal = true;
    lines[lines.length - 1] += ' <span style="color: #C0C0C0">Ethereal</span>';

    // Calculate defense with ethereal multiplier (1.5x)
    const baseWithEth = Math.floor(baseDefense * 1.5);

    let newDefense;
    if (edef > 0) {
      newDefense = Math.floor(baseWithEth * (1 + edef / 100));
      if (todef > 0) {
        newDefense += todef;
      }
    } else if (todef > 0) {
      newDefense = baseWithEth + todef;
    } else {
      newDefense = baseWithEth;
    }

    currentItemData.properties.defense = newDefense;

    const defenseIndex = lines.findIndex((line) => line.startsWith("Defense:"));
    if (defenseIndex !== -1) {
      lines[defenseIndex] = `Defense: ${newDefense}`;
    }
  }

  // Update description
  currentItemData.description = lines.join("<br>");

  // Trigger display update
  select.dispatchEvent(new Event("change"));
  if (window.unifiedSocketSystem?.updateAll) window.unifiedSocketSystem.updateAll();
}
// Add this line to your event listeners


// ===================================================================
// EVENT LISTENERS - Connect upgrade buttons to their functions
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
  // Setup upgrade button event listeners
  const upgradeButtons = {
    'upgradeHelmButton': handleUpgrade,
    'upgradeArmorButton': handleArmorUpgrade,
    'upgradeWeaponButton': handleWeaponUpgrade,
    'upgradeShieldButton': () => {},
    'upgradeGloveButton': handleGloveUpgrade,
    'upgradeBeltButton': handleBeltUpgrade,
    'upgradeBootButton': () => {}
  };

  Object.entries(upgradeButtons).forEach(([buttonId, handler]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', handler);
    }
  });

  // Setup ethereal button event listeners
  const etherealButtons = {
    'makeetherealweapon': 'weapons-dropdown',
    'makeethereal': 'helms-dropdown',
    'makeetherealarmor': 'armors-dropdown',
    'makeetherealshield': 'offs-dropdown',
    'makeetherealglove': 'gloves-dropdown',
    'makeetherealbelt': 'belts-dropdown',
    'makeetherealboot': 'boots-dropdown'
  };

  Object.entries(etherealButtons).forEach(([buttonId, dropdownId]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => makeItemEthereal(dropdownId));
    }
  });

});

/**
 * Universal function to make any item ethereal
 * Works for both regular items and crafted items
 * @param {string} dropdownId - The ID of the dropdown (e.g., 'weapons-dropdown')
 */
function makeItemEthereal(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  const itemName = dropdown.value;
  if (!itemName) return;

  // Use window.getItemData to support both regular and crafted items
  const itemData = window.getItemData(itemName);
  if (!itemData) return;

  // Ensure properties object exists
  if (!itemData.properties) {
    itemData.properties = {};
  }

  // For dynamic items (has baseType), just toggle the ethereal flag
  // and let the socket system regenerate everything
  if (itemData.baseType) {
    console.log('makeItemEthereal: toggling ethereal for dynamic item', itemName);

    // For dynamic items, ONLY check properties.ethereal (not description)
    // because description is regenerated each time
    if (itemData.properties.ethereal) {
      console.log('Removing ethereal');
      itemData.properties.ethereal = false;
    } else {
      console.log('Adding ethereal');
      itemData.properties.ethereal = true;
    }

    // Trigger regeneration
    dropdown.dispatchEvent(new Event("change"));
    if (window.unifiedSocketSystem?.updateAll) {
      window.unifiedSocketSystem.updateAll();
    }
    return;
  }

  // For static items, check both
  const isCurrentlyEthereal = itemData.properties.ethereal ||
    (itemData.description && itemData.description.includes("Ethereal"));

  // For static items, use the old method
  // Get or generate description
  let description = itemData.description;
  if (!description) return;

  let lines = description.split("<br>");

  if (isCurrentlyEthereal) {
    // REMOVE ethereal
    console.log('makeItemEthereal: removing ethereal from static item', itemName);
    itemData.properties.ethereal = false;

    // Remove ethereal text from description
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*<span[^>]*>Ethereal<\/span>/i, '');
    itemData.description = lines.join("<br>");

    // Determine item category to recalculate stats WITHOUT ethereal
    const isWeapon = dropdownId === 'weapons-dropdown';
    const isShield = dropdownId === 'offs-dropdown';
    const isArmor = ['armors-dropdown', 'helms-dropdown', 'gloves-dropdown', 'belts-dropdown', 'boots-dropdown'].includes(dropdownId);

    if (isWeapon) {
      // Recalculate weapon damage WITHOUT ethereal
      const baseType = description.split("<br>")[1];
      const isTwoHanded = itemData.properties.twohandmin !== undefined;

      if (isTwoHanded) {
        itemData.properties.twohandmin = calculateItemDamage(itemData, baseType, false);
        itemData.properties.twohandmax = calculateItemDamage(itemData, baseType, true);
      } else {
        itemData.properties.onehandmin = calculateItemDamage(itemData, baseType, false);
        itemData.properties.onehandmax = calculateItemDamage(itemData, baseType, true);
      }

      dropdown.dispatchEvent(new Event("change"));
    } else if (isShield || isArmor) {
      // Recalculate defense WITHOUT ethereal
      const baseType = description.split("<br>")[1];
      const baseDefense = baseDefenses[baseType] || 0;
      const edef = itemData.properties.edef || 0;
      const todef = itemData.properties.todef || 0;

      // Calculate defense WITHOUT ethereal (no 1.5x multiplier)
      let newDefense;
      if (edef > 0) {
        newDefense = Math.floor(baseDefense * (1 + edef / 100));
        if (todef > 0) {
          newDefense += todef;
        }
      } else if (todef > 0) {
        newDefense = baseDefense + todef;
      } else {
        newDefense = baseDefense;
      }

      itemData.properties.defense = newDefense;
      const defenseIndex = lines.findIndex(line => line.startsWith("Defense:"));
      if (defenseIndex !== -1) {
        lines[defenseIndex] = `Defense: ${newDefense}`;
        itemData.description = lines.join("<br>");
      }

      dropdown.dispatchEvent(new Event("change"));
      if (typeof updateDefense === 'function') {
        updateDefense();
      }
    }
  } else {
    // ADD ethereal
    console.log('makeItemEthereal: adding ethereal to static item', itemName);
    itemData.properties.ethereal = true;

    // Add ethereal text to description
    lines[lines.length - 1] += ' <span style="color: #C0C0C0">Ethereal</span>';
    itemData.description = lines.join("<br>");

    // Determine item category and apply appropriate bonuses
    const isWeapon = dropdownId === 'weapons-dropdown';
    const isShield = dropdownId === 'offs-dropdown';
    const isArmor = ['armors-dropdown', 'helms-dropdown', 'gloves-dropdown', 'belts-dropdown', 'boots-dropdown'].includes(dropdownId);

    if (isWeapon) {
      // Handle weapon ethereal (50% damage bonus)
      const baseType = description.split("<br>")[1];
      const isTwoHanded = itemData.properties.twohandmin !== undefined;

      if (isTwoHanded) {
        itemData.properties.twohandmin = calculateItemDamage(itemData, baseType, false);
        itemData.properties.twohandmax = calculateItemDamage(itemData, baseType, true);
      } else {
        itemData.properties.onehandmin = calculateItemDamage(itemData, baseType, false);
        itemData.properties.onehandmax = calculateItemDamage(itemData, baseType, true);
      }

      // Update weapon display
      dropdown.dispatchEvent(new Event("change"));
    } else if (isShield || isArmor) {
    // Handle armor/shield ethereal (50% defense bonus)
    const baseType = description.split("<br>")[1];
    const baseDefense = baseDefenses[baseType] || 0;
    const edef = itemData.properties.edef || 0;
    const todef = itemData.properties.todef || 0;

    // Apply 50% ethereal bonus to base defense
    const baseWithEth = Math.floor(baseDefense * 1.5);

    // Calculate final defense
    let newDefense;
    if (edef > 0) {
      newDefense = Math.floor(baseWithEth * (1 + edef / 100));
      if (todef > 0) {
        newDefense += todef;
      }
    } else if (todef > 0) {
      newDefense = baseWithEth + todef;
    } else {
      newDefense = baseWithEth;
    }

    // Update defense in properties and description
    itemData.properties.defense = newDefense;
    const defenseIndex = lines.findIndex(line => line.startsWith("Defense:"));
    if (defenseIndex !== -1) {
      lines[defenseIndex] = `Defense: ${newDefense}`;
      itemData.description = lines.join("<br>");
    }

      // Update display
      dropdown.dispatchEvent(new Event("change"));
      if (typeof updateDefense === 'function') {
        updateDefense();
      }
    }
  }

  // Update stats display
  if (window.unifiedSocketSystem?.updateAll) {
    window.unifiedSocketSystem.updateAll();
  }
}
