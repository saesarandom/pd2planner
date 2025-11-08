// ===================================================================
// MAIN.JS - Core Application Logic
// Extracted and modernized from index2.html
// ===================================================================

// Global state
window.checkboxResistBonus = 0;

// Item dropdown data configuration
const itemDropdownData = {
  helm: [
    { name: "Biggin's Bonnet", quality: "unique" },
    { name: "Tarnhelm", quality: "unique" },
    { name: "Coif of Glory", quality: "unique" },
    { name: "Duskeep", quality: "unique" },
    { name: "The Face of Horror", quality: "unique" },
    { name: "Wormskull", quality: "unique" },
    { name: "Howltusk", quality: "unique" },
    { name: "Undead Crown", quality: "unique" },
    { name: "Peasant Crown", quality: "unique" },
    { name: "Rockstopper", quality: "unique" },
    { name: "Stealskull", quality: "unique" },
    { name: "Darksight Helm", quality: "unique" },
    { name: "Blackhorn's Face", quality: "unique" },
    { name: "Valkyrie Wing", quality: "unique" },
    { name: "Crown of Thieves", quality: "unique" },
    { name: "Harlequin Crest", quality: "unique" },
    { name: "Steel Shade", quality: "unique" },
    { name: "Andariel's Visage", quality: "unique" },
    { name: "Giant Skull", quality: "unique" },
    { name: "Veil of Steel", quality: "unique" },
    { name: "Nightwing's Veil", quality: "unique" },
    { name: "Crown of Ages", quality: "unique" },
    { name: "Overlord's Helm", quality: "unique" },
    { name: "Kira's Guardian", quality: "unique" },
    { name: "Griffon's Eye", quality: "unique" },
    { name: "Cyclopean Roar", quality: "unique" },
    { name: "Arreat's Face", quality: "unique" },
    { name: "Wolfhowl", quality: "unique" },
    { name: "Demonhorn's Edge", quality: "unique" },
    { name: "Halaberd's Reign", quality: "unique" },
    { name: "Raekor's Virtue", quality: "unique" },
    { name: "Quetzalcoatl", quality: "unique" },
    { name: "Jalal's Mane", quality: "unique" },
    { name: "Cerebus' Bite", quality: "unique" },
    { name: "Denmother", quality: "unique" },
    { name: "Ravenlore", quality: "unique" },
    { name: "Spirit Keeper", quality: "unique" },
    { name: "Ursa's Nightmare", quality: "unique" },
    { name: "Arcanna's Head", quality: "set" },
    { name: "Berserker's Headgear", quality: "set" },
    { name: "Infernal Cranium", quality: "set" },
    { name: "Sigon's Visor", quality: "set" },
    { name: "Isenhart's Horns", quality: "set" },
    { name: "Cathan's Visage", quality: "set" },
    { name: "Iratha's Coil", quality: "set" },
    { name: "Milabrega's Diadem", quality: "set" },
    { name: "Tancred's Skull", quality: "set" },
    { name: "Cow King's Horns", quality: "set" },
    { name: "Sander's Paragon", quality: "set" },
    { name: "Hwanin's Splendor", quality: "set" },
    { name: "Guillaume's Face", quality: "set" },
    { name: "Najs's Circlet", quality: "set" },
    { name: "Sazabi's Mental Sheath", quality: "set" },
    { name: "Ondal's Almighty", quality: "set" },
    { name: "Aldur's Stony Gaze", quality: "set" },
    { name: "Griswold's Valor", quality: "set" },
    { name: "Immortal King's Will", quality: "set" },
    { name: "M'avina's True Sight", quality: "set" },
    { name: "Natalya's Totem", quality: "set" },
    { name: "Tal Rasha's Horadric Crest", quality: "set" },
    { name: "Trang-Oul's Guise", quality: "set" },
    { name: "Nadir", quality: "runeword" }
  ],

  armor: [
    { name: "Greyform", quality: "unique" },
    { name: "Blinkbat's Form", quality: "unique" },
    { name: "The Centurion", quality: "unique" },
    { name: "Twitchthroe", quality: "unique" },
    { name: "Darkglow", quality: "unique" },
    { name: "Hawkmail", quality: "unique" },
    { name: "Sparking Mail", quality: "unique" },
    { name: "Venom Ward", quality: "unique" },
    { name: "Iceblink", quality: "unique" },
    { name: "Boneflesh", quality: "unique" },
    { name: "Rockfleece", quality: "unique" },
    { name: "Rattlecage", quality: "unique" },
    { name: "Heavenly Garb", quality: "unique" },
    { name: "Goldskin", quality: "unique" },
    { name: "Silks of the Victor", quality: "unique" },
    { name: "Spirit Shroud", quality: "unique" },
    { name: "Skin of the Vipermagi", quality: "unique" },
    { name: "Skin of the Flayed One", quality: "unique" },
    { name: "Iron Pelt", quality: "unique" },
    { name: "Crow Caw", quality: "unique" },
    { name: "Shaftstop", quality: "unique" },
    { name: "Skullder's Ire", quality: "unique" },
    { name: "Que-Hegan's Wisdom", quality: "unique" },
    { name: "Toothrow", quality: "unique" },
    { name: "Guardian Angel", quality: "unique" },
    { name: "Atma's Wail", quality: "unique" },
    { name: "Black Hades", quality: "unique" },
    { name: "Corpsemourn", quality: "unique" },
    { name: "Arctic Furs", quality: "set" },
    { name: "Berserker's Hauberk", quality: "set" },
    { name: "Sigon's Shelter", quality: "set" },
    { name: "Isenhart's Case", quality: "set" },
    { name: "Cathan's Mesh", quality: "set" },
    { name: "Angelic Mantle", quality: "set" },
    { name: "Vidala's Ambush", quality: "set" },
    { name: "Arcanna's Flesh", quality: "set" }
  ],

  weapon: [
    { name: "The Gnasher", quality: "unique" },
    { name: "Bladebone", quality: "unique" },
    { name: "Skull Splitter", quality: "unique" },
    { name: "Rakescar", quality: "unique" },
    { name: "Axe of Fechmar", quality: "unique" },
    { name: "Goreshovel", quality: "unique" },
    { name: "The Chieftain", quality: "unique" },
    { name: "Brainhew", quality: "unique" },
    { name: "Humongous", quality: "unique" },
    { name: "Felloak", quality: "unique" },
    { name: "Stoutnail", quality: "unique" },
    { name: "Crushflange", quality: "unique" },
    { name: "Bloodrise", quality: "unique" },
    { name: "The General's Tan Do Li Ga", quality: "unique" },
    { name: "Ironstone", quality: "unique" },
    { name: "Bonesnap", quality: "unique" },
    { name: "Upped Bonesnap", quality: "unique" },
    { name: "Steeldriver", quality: "unique" },
    { name: "Rixot's Keen", quality: "unique" },
    { name: "Blood Crescent", quality: "unique" },
    { name: "Skewer of Krintiz", quality: "unique" },
    { name: "Gleamscythe", quality: "unique" },
    { name: "Griswold's Edge", quality: "unique" },
    { name: "Hellplague", quality: "unique" },
    { name: "Culwen's Point", quality: "unique" },
    { name: "Shadowfang", quality: "unique" },
    { name: "Soulflay", quality: "unique" },
    { name: "Kinemil's Awl", quality: "unique" },
    { name: "Blacktongue", quality: "unique" },
    { name: "Ripsaw", quality: "unique" },
    { name: "The Patriarch", quality: "unique" },
    { name: "Gull", quality: "unique" },
    { name: "The Diggler", quality: "unique" },
    { name: "The Jade Tan Do", quality: "unique" },
    { name: "Spectral Shard", quality: "unique" },
    { name: "The Gidbinn", quality: "unique" },
    { name: "The Dragon Chang", quality: "unique" },
    { name: "Razortine", quality: "unique" },
    { name: "Bloodthief", quality: "unique" },
    { name: "Lance of Yaggai", quality: "unique" },
    { name: "The Tannr Gorerod", quality: "unique" },
    { name: "Dimoak's Hew", quality: "unique" },
    { name: "Steelgoad", quality: "unique" },
    { name: "The Battlebranch", quality: "unique" },
    { name: "Woestave", quality: "unique" },
    { name: "The Grim Reaper", quality: "unique" },
    { name: "Pluckeye", quality: "unique" },
    { name: "Witherstring", quality: "unique" },
    { name: "Raven Claw", quality: "unique" },
    { name: "Rogue's Bow", quality: "unique" },
    { name: "Stormstrike", quality: "unique" },
    { name: "Wizendraw", quality: "unique" },
    { name: "Hellclap", quality: "unique" },
    { name: "Blastbark", quality: "unique" },
    { name: "Skystrike", quality: "unique" },
    { name: "Riphook", quality: "unique" },
    { name: "Kuko Shakaku", quality: "unique" },
    { name: "Endlesshail", quality: "unique" },
    { name: "Witchwild String", quality: "unique" },
    { name: "Cliffkiller", quality: "unique" },
    { name: "Magewrath", quality: "unique" },
    { name: "Goldstrike Arch", quality: "unique" },
    { name: "Eaglehorn", quality: "unique" },
    { name: "Widowmaker", quality: "unique" },
    { name: "Windforce", quality: "unique" },
    { name: "Leadcrow", quality: "unique" },
    { name: "Ichorsting", quality: "unique" },
    { name: "Hellcast", quality: "unique" },
    { name: "Doomslinger", quality: "unique" },
    { name: "Bane Ash", quality: "unique" },
    { name: "Serpent Lord", quality: "unique" },
    { name: "Spire of Lazarus", quality: "unique" },
    { name: "The Salamander", quality: "unique" },
    { name: "The Iron Jang Bong", quality: "unique" },
    { name: "Knell Striker", quality: "unique" },
    { name: "Rust Handle", quality: "unique" },
    { name: "Stormeye", quality: "unique" },
    { name: "True Silver", quality: "unique" },
    { name: "Mage Slayer", quality: "unique" },
    { name: "Tempest", quality: "unique" },
    { name: "Coldkill", quality: "unique" },
    { name: "Butcher's Pupil", quality: "unique" },
    { name: "Islestrike", quality: "unique" },
    { name: "Pompeii's Wrath", quality: "unique" },
    { name: "Guardian Naga", quality: "unique" },
    { name: "Warlord's Trust", quality: "unique" },
    { name: "Spellsteel", quality: "unique" },
    { name: "Stormrider", quality: "unique" },
    { name: "Boneslayer Blade", quality: "unique" },
    { name: "The Minotaur", quality: "unique" },
    { name: "Razor's Edge", quality: "unique" },
    { name: "Rune Master", quality: "unique" },
    { name: "Cranebeak", quality: "unique" },
    { name: "Death Cleaver", quality: "unique" },
    { name: "Ethereal Edge", quality: "unique" },
    { name: "Hellslayer", quality: "unique" },
    { name: "Messerschmidt's Reaver", quality: "unique" },
    { name: "Executioner's Justice", quality: "unique" },
    { name: "Dark Clan Crusher", quality: "unique" },
    { name: "Fleshrender", quality: "unique" },
    { name: "Sureshrill Frost", quality: "unique" },
    { name: "Moonfall", quality: "unique" },
    { name: "Baezil's Vortex", quality: "unique" },
    { name: "Earthshaker", quality: "unique" },
    { name: "Bloodtree Stump", quality: "unique" },
    { name: "The Gavel of Pain", quality: "unique" },
    { name: "Nord's Tenderizer", quality: "unique" },
    { name: "Demon Limb", quality: "unique" },
    { name: "Baranar's Star", quality: "unique" },
    { name: "Horizon's Tornado", quality: "unique" },
    { name: "Stormlash", quality: "unique" },
    { name: "Stone Crusher", quality: "unique" },
    { name: "Schaefer's Hammer", quality: "unique" },
    { name: "Windhammer", quality: "unique" },
    { name: "Earth Shifter", quality: "unique" },
    { name: "The Cranium Basher", quality: "unique" },
    { name: "Steel", quality: "runeword" }
  ],

  shield: [
    { name: "Pelta Lunata", quality: "unique" },
    { name: "Umbral Disk", quality: "unique" },
    { name: "Swordback Hold", quality: "unique" },
    { name: "Steelclash", quality: "unique" },
    { name: "Wall of the Eyeless", quality: "unique" },
    { name: "Bverrit Keep", quality: "unique" },
    { name: "The Ward", quality: "unique" },
    { name: "Visceratuant", quality: "unique" }
  ],

  gloves: [
    { name: "The Hand of Broc", quality: "unique" },
    { name: "Bloodfist", quality: "unique" },
    { name: "Chance Guards", quality: "unique" },
    { name: "Magefist", quality: "unique" },
    { name: "Frostburn", quality: "unique" },
    { name: "Venom Grip", quality: "unique" },
    { name: "Gravepalm", quality: "unique" },
    { name: "Ghoulhide", quality: "unique" },
    { name: "Lava Gout", quality: "unique" },
    { name: "Hellmouth", quality: "unique" },
    { name: "Dracul's Grasp", quality: "unique" },
    { name: "Soul Drainer", quality: "unique" },
    { name: "Steelrend", quality: "unique" }
  ],

  belts: [
    { name: "Arachnid Mesh", quality: "unique" },
    { name: "Lenymo", quality: "unique" },
    { name: "Snakecord", quality: "unique" },
    { name: "Nightsmoke", quality: "unique" },
    { name: "Goldwrap", quality: "unique" },
    { name: "Bladebuckle", quality: "unique" },
    { name: "String of Ears", quality: "unique" },
    { name: "Razortail", quality: "unique" },
    { name: "Gloom's Trap", quality: "unique" },
    { name: "Snowclash", quality: "unique" },
    { name: "Thundergod's Vigor", quality: "unique" },
    { name: "Nosferatu's Coil", quality: "unique" },
    { name: "Verdungo's Hearty Cord", quality: "unique" },
    { name: "Band of Skulls", quality: "unique" }
  ],

  boots: [
    { name: "Hotspur", quality: "unique" },
    { name: "Gorefoot", quality: "unique" },
    { name: "Treads of Cthon", quality: "unique" },
    { name: "Goblin Toe", quality: "unique" },
    { name: "Tearhaunch", quality: "unique" },
    { name: "Infernostride", quality: "unique" },
    { name: "Waterwalk", quality: "unique" },
    { name: "Silkweave", quality: "unique" },
    { name: "War Traveler", quality: "unique" },
    { name: "Gore Rider", quality: "unique" },
    { name: "Sandstorm Trek", quality: "unique" },
    { name: "Marrowwalk", quality: "unique" },
    { name: "Shadow Dancer", quality: "unique" }
  ],

  ringsone: [
    { name: "Nagelring", quality: "unique" },
    { name: "Manald Heal", quality: "unique" },
    { name: "The Stone of Jordan", quality: "unique" },
    { name: "Dwarf Star", quality: "unique" },
    { name: "Raven Frost", quality: "unique" },
    { name: "Bul-Kathos' Wedding Band", quality: "unique" },
    { name: "Carrion Wind", quality: "unique" },
    { name: "Nature's Peace", quality: "unique" },
    { name: "Wisp Projector", quality: "unique" }
  ],

  ringstwo: [
    { name: "Nagelring", quality: "unique" },
    { name: "Manald Heal", quality: "unique" },
    { name: "The Stone of Jordan", quality: "unique" },
    { name: "Dwarf Star", quality: "unique" },
    { name: "Raven Frost", quality: "unique" },
    { name: "Bul-Kathos' Wedding Band", quality: "unique" },
    { name: "Carrion Wind", quality: "unique" },
    { name: "Nature's Peace", quality: "unique" },
    { name: "Wisp Projector", quality: "unique" }
  ],

  amulets: [
    { name: "Nokozan Relic", quality: "unique" },
    { name: "The Eye of Etlich", quality: "unique" },
    { name: "The Mahim-Oak Curio", quality: "unique" },
    { name: "Saracen's Chance", quality: "unique" },
    { name: "Crescent Moon", quality: "unique" },
    { name: "The Cat's Eye", quality: "unique" },
    { name: "Atma's Scarab", quality: "unique" },
    { name: "Highlord's Wrath", quality: "unique" },
    { name: "The Rising Sun", quality: "unique" },
    { name: "Seraph's Hymn", quality: "unique" },
    { name: "Mara's Kaleidoscope", quality: "unique" },
    { name: "Metalgrid", quality: "unique" },
    { name: "The Third Eye", quality: "unique" }
  ]
};

// Create mercenary references
itemDropdownData.merchelm = itemDropdownData.helm;
itemDropdownData.mercarmor = itemDropdownData.armor;
itemDropdownData.mercweapon = itemDropdownData.weapon;
itemDropdownData.mercoff = itemDropdownData.shield;
itemDropdownData.mercgloves = itemDropdownData.gloves;
itemDropdownData.mercbelts = itemDropdownData.belts;
itemDropdownData.mercboots = itemDropdownData.boots;

// Dropdown ID mapping
const DROPDOWN_MAP = {
  helm: 'helms-dropdown',
  merchelm: 'merchelms-dropdown',
  armor: 'armors-dropdown',
  mercarmor: 'mercarmors-dropdown',
  weapon: 'weapons-dropdown',
  mercweapon: 'mercweapons-dropdown',
  shield: 'offs-dropdown',
  mercoff: 'mercoffs-dropdown',
  gloves: 'gloves-dropdown',
  mercgloves: 'mercgloves-dropdown',
  belts: 'belts-dropdown',
  mercbelts: 'mercbelts-dropdown',
  boots: 'boots-dropdown',
  mercboots: 'mercboots-dropdown',
  ringsone: 'ringsone-dropdown',
  ringstwo: 'ringstwo-dropdown',
  amulets: 'amulets-dropdown'
};

// Info div ID mapping
const INFO_DIV_MAP = {
  'weapons-dropdown': 'weapon-info',
  'helms-dropdown': 'helm-info',
  'merchelms-dropdown': 'merc-helm-info',
  'mercarmors-dropdown': 'merc-armor-info',
  'mercweapons-dropdown': 'merc-weapon-info',
  'armors-dropdown': 'armor-info',
  'offs-dropdown': 'off-info',
  'mercoffs-dropdown': 'merc-off-info',
  'gloves-dropdown': 'glove-info',
  'mercgloves-dropdown': 'merc-glove-info',
  'belts-dropdown': 'belt-info',
  'mercbelts-dropdown': 'merc-belt-info',
  'boots-dropdown': 'boot-info',
  'mercboots-dropdown': 'merc-boot-info',
  'ringsone-dropdown': 'ringsone-info',
  'ringstwo-dropdown': 'ringstwo-info',
  'amulets-dropdown': 'amulet-info'
};

// Section mapping
const SECTION_MAP = {
  'weapons-dropdown': 'weapon',
  'merchelms-dropdown': 'merchelm',
  'mercweapons-dropdown': 'mercweapon',
  'mercarmors-dropdown': 'mercarmor',
  'mercoffs-dropdown': 'mercoff',
  'mercgloves-dropdown': 'mercgloves',
  'mercbelts-dropdown': 'mercbelts',
  'mercboots-dropdown': 'mercboots',
  'helms-dropdown': 'helm',
  'armors-dropdown': 'armor',
  'offs-dropdown': 'shield',
  'gloves-dropdown': 'gloves',
  'belts-dropdown': 'belts',
  'boots-dropdown': 'boots',
  'ringsone-dropdown': 'ringone',
  'ringstwo-dropdown': 'ringtwo',
  'amulets-dropdown': 'amulet'
};

// All dropdown IDs
const ALL_DROPDOWNS = [
  'helms-dropdown', 'merchelms-dropdown', 'armors-dropdown', 'mercarmors-dropdown',
  'mercweapons-dropdown', 'weapons-dropdown', 'offs-dropdown', 'mercoffs-dropdown',
  'gloves-dropdown', 'mercgloves-dropdown', 'belts-dropdown', 'mercbelts-dropdown',
  'boots-dropdown', 'mercboots-dropdown', 'ringsone-dropdown', 'ringstwo-dropdown',
  'amulets-dropdown'
];

/**
 * Populate all item dropdowns with their respective items
 */
function populateItemDropdowns() {
  // Check if itemList is available
  if (typeof itemList === 'undefined') {
    console.warn('itemList not available yet, retrying in 100ms');
    setTimeout(populateItemDropdowns, 100);
    return;
  }

  // Clear all dropdowns first
  Object.values(DROPDOWN_MAP).forEach(id => {
    const dropdown = document.getElementById(id);
    if (dropdown) dropdown.innerHTML = '<option value="">None</option>';
  });

  // Populate with new structure
  for (const category in itemDropdownData) {
    const items = itemDropdownData[category];
    const dropdownId = DROPDOWN_MAP[category];

    if (dropdownId && items) {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        items.forEach(item => {
          // Add all items from itemDropdownData (they're pre-validated)
          const option = document.createElement('option');
          option.value = item.name;
          option.textContent = item.name;
          option.setAttribute('data-quality', item.quality);

          // Add CSS class for styling based on quality
          if (item.quality === 'unique') {
            option.className = 'unique-item';
            option.style.color = '#C7B377'; // Gold for unique
          } else if (item.quality === 'set') {
            option.className = 'set-item';
            option.style.color = '#00FF00'; // Green for set
          } else if (item.quality === 'runeword') {
            option.style.color = '#D2691E'; // Brown/tan for runeword
            option.style.fontWeight = 'bold';
          }

          dropdown.appendChild(option);
        });
      }
    }
  }
}

/**
 * Update item info display when dropdown selection changes
 */
function updateItemInfo(event) {
  const dropdown = event.target;
  const selectedItemName = dropdown.value;

  const infoDivId = INFO_DIV_MAP[dropdown.id];
  if (!infoDivId) return;

  const infoDiv = document.getElementById(infoDivId);
  if (!infoDiv) return;

  if (!selectedItemName) {
    infoDiv.innerHTML = '';
    return;
  }

  // Try to get item info from itemList
  const item = itemList && itemList[selectedItemName];

  if (item && item.description) {
    infoDiv.innerHTML = item.description;
  } else {
    // If not in itemList, try to show a basic placeholder
    infoDiv.innerHTML = selectedItemName;
  }

  // Trigger unified socket system update if available
  const section = SECTION_MAP[dropdown.id];
  if (section && window.unifiedSocketSystem && typeof window.unifiedSocketSystem.updateAll === 'function') {
    try {
      window.unifiedSocketSystem.updateAll();
    } catch (error) {
      console.error('Error updating socket system:', error);
    }
  }
}

/**
 * Set up event handlers for all dropdowns
 */
function setupDropdownHandlers() {
  ALL_DROPDOWNS.forEach(dropdownId => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.addEventListener('change', updateItemInfo);
    }
  });
}

/**
 * Initialize socket click handlers
 */
function setupSocketHandlers() {
  let currentSocket = null;

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('socketz')) {
      currentSocket = e.target;
      showItemModal();
    }
  });

  // Socket category tabs
  document.querySelectorAll('.socket-category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.socket-category-tab').forEach(t =>
        t.classList.remove('active'));
      document.querySelectorAll('.socket-content').forEach(c =>
        c.classList.remove('active'));

      this.classList.add('active');
      document.querySelector(`.socket-content[data-category="${this.dataset.category}"]`)
        ?.classList.add('active');
    });
  });
}

/**
 * Update critical hit display
 */
function updateCritDisplay() {
  if (window.skillSystemInstance) {
    const criticalStrike = skillSystemInstance.getCriticalStrikeChance();
    const deadlyStrike = skillSystemInstance.getDeadlyStrikeChance();
    const weaponMastery = skillSystemInstance.getWeaponMasteryChance();

    const combinedCritChance = 1 - ((1 - criticalStrike / 100) * (1 - deadlyStrike / 100) * (1 - weaponMastery / 100));
    const critMultiplier = 1 + (combinedCritChance * 0.5);

    const critElement = document.getElementById('crithitmultipliercontainer');
    if (critElement) {
      critElement.textContent = critMultiplier.toFixed(2);
    }
  }
}

/**
 * Setup checkbox listeners for Anya resistance bonuses
 */
function setupAnyaCheckboxes() {
  document.querySelectorAll('.checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      window.checkboxResistBonus = document.querySelectorAll('.checkbox:checked').length * 10;

      if (window.unifiedSocketSystem?.updateAll) {
        window.unifiedSocketSystem.updateAll();
      }
    });
  });
}

/**
 * Setup event listeners for crit-related changes
 */
function setupCritListeners() {
  // Critical Strike skill input
  document.addEventListener('input', (e) => {
    if (e.target?.id === 'criticalstrikecontainer' || e.target?.id === 'javelinandspearmasterycontainer') {
      updateCritDisplay();
    }
  });

  // Weapon changes (affects deadly strike)
  document.addEventListener('change', (e) => {
    if (e.target?.id === 'weapons-dropdown') {
      updateCritDisplay();
    }
  });
}

/**
 * Main initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log("🎯 Initializing PD2 Planner...");

  // 1. Populate dropdowns first
  populateItemDropdowns();

  // 2. Setup dropdown event listeners
  setupDropdownHandlers();

  // 3. Setup socket handlers
  setupSocketHandlers();

  // 4. Setup Anya checkbox listeners (delayed to ensure DOM is ready)
  setTimeout(setupAnyaCheckboxes, 100);

  // 5. Setup crit display listeners
  setupCritListeners();

  // 6. Initialize crit display
  setTimeout(updateCritDisplay, 500);

  // 7. Initialize other systems if available
  if (typeof updatePolyLife === 'function') updatePolyLife();

  // 8. Check login state
  const username = localStorage.getItem('username');
  if (username && typeof updateUIState === 'function') {
    updateUIState(username);
  }

  console.log("✅ PD2 Planner initialized successfully!");
});
