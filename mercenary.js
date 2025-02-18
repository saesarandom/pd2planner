// mercenary.js - Handles mercenary mechanics, buff system, and equipment

class MercenarySystem {
  constructor() {
    this.mercClass = document.getElementById("mercclass");
    this.buffs = document.querySelectorAll('[id^="buff"]');
    this.mercLevel = document.getElementById("merclvlValue");
    this.mercDifficulty = document.getElementById("mercdiff");

    // Mercenary equipment slots
    this.equipmentSlots = {
      helm: document.getElementById("merchelms-dropdown"),
      armor: document.getElementById("mercarmors-dropdown"),
      weapon: document.getElementById("mercweapons-dropdown"),
      off: document.getElementById("mercoffs-dropdown"),
      glove: document.getElementById("mercgloves-dropdown"),
      belt: document.getElementById("mercbelts-dropdown"),
      boot: document.getElementById("mercboots-dropdown"),
    };

    // Equipment info containers
    this.equipmentInfo = {
      helm: document.getElementById("merchelm-info"),
      armor: document.getElementById("mercarmor-info"),
      weapon: document.getElementById("mercweapon-info"),
      off: document.getElementById("mercoff-info"),
      glove: document.getElementById("mercglove-info"),
      belt: document.getElementById("mercbelt-info"),
      boot: document.getElementById("mercboot-info"),
    };

    this.initializeListeners();
    this.initializeEquipmentSystem();
  }

  getNextFreeBuffSlot() {
    for (let i = 0; i < this.buffs.length; i++) {
      if (!this.buffs[i].style.backgroundImage) {
        return this.buffs[i];
      }
    }
    return null;
  }

  clearAllBuffs() {
    this.buffs.forEach((buff) => (buff.style.backgroundImage = ""));
  }

  applyMercenaryBuff(selectedValue) {
    const buffMap = {
      "A1 Fire (Vigor)": "vigor2.png",
      "A1 Cold (Meditation)": "meditation2.png",
      "A1 Magic (Slow Movement)": "slowmovement2.png",
      "A2 Defensive (Defiance)": "defiance2.png",
      "A2 Offensive (Blessed Aim)": "blessedaim2.png",
      "A2 Combat (Thorns)": "thorns2.png",
      "A3 Fire (Cleansing)": "cleansing2.png",
      "A3 Cold (Prayer)": "prayer2.png",
      "A3 Lightning (Holy Shock)": "holyshock2.png",
      "A4 Light (Sanctuary)": "sanctuary2.png",
      "A4 Dark (Amplify Damage)": "amplifydamage2.png",
      "A5 Combat (Might)": "might2.png",
      "A5 Warcries (Battle Orders)": "battleorders2.png",
    };

    const buffImage = buffMap[selectedValue];
    if (buffImage) {
      let slot = this.getNextFreeBuffSlot();
      if (slot) {
        slot.style.backgroundImage = `url("img/${buffImage}")`;
      }
    }
  }

  handleMercenaryChange(event) {
    this.clearAllBuffs();
    const selectedValue = event.target.value;

    if (selectedValue !== "No Mercenary") {
      this.applyMercenaryBuff(selectedValue);
      this.updateEquipmentAvailability(selectedValue);

      if (parseInt(this.mercLevel.value) > 10) {
        let slot = this.getNextFreeBuffSlot();
        if (slot) {
          slot.style.backgroundImage = 'url("img/holyshock2.png")';
        }
      }
    }
  }

  updateEquipmentAvailability(mercType) {
    // Hide/show equipment slots based on mercenary type
    const rogueSlots = [
      "weapon",
      "armor",
      "helm",
      "off",
      "glove",
      "belt",
      "boot",
    ];
    const desert2hSlots = ["weapon", "armor", "helm"];
    const ironWolfSlots = ["weapon", "armor", "helm"];
    const darkNecroSlots = ["weapon", "armor", "helm"];
    const barbarianSlots = ["weapon", "off", "armor", "helm"];

    let availableSlots;
    switch (mercType.substring(0, 2)) {
      case "A1": // Rogue
        availableSlots = rogueSlots;
        break;
      case "A2": // Desert Mercenary
        availableSlots = desert2hSlots;
        break;
      case "A3": // Iron Wolf
        availableSlots = ironWolfSlots;
        break;
      case "A4": // Iron Wolf
        availableSlots = darkNecroSlots;
        break;
      case "A5": // Barbarian
        availableSlots = barbarianSlots;
        break;
      default:
        availableSlots = [];
    }

    // Show/hide equipment slots
    Object.entries(this.equipmentSlots).forEach(([slot, element]) => {
      if (element) {
        element.style.display = availableSlots.includes(slot)
          ? "block"
          : "none";
      }
    });
  }

  handleEquipmentChange(slotName, event) {
    const selectedItem = event.target.value;

    const infoElements = {
      helm: "merchelm-info",
      armor: "mercarmor-info",
      weapon: "mercweapon-info",
      off: "mercoff-info",
      glove: "mercglove-info",
      belt: "mercbelt-info",
      boot: "mercboot-info",
    };

    const infoId = infoElements[slotName];
    if (infoId && itemList[selectedItem]) {
      document.getElementById(infoId).innerHTML =
        itemList[selectedItem].description;
    }
  }
  updateEquipmentInfo(slotName, itemName) {
    // TODO: Update to show item stats and properties
    if (this.equipmentInfo[slotName]) {
      this.equipmentInfo[slotName].textContent = itemName;
    }
  }

  initializeEquipmentSystem() {
    // Show initial info for all equipment slots
    Object.entries(this.equipmentSlots).forEach(([slotName, element]) => {
      if (element) {
        // Add change listener
        element.addEventListener("change", (e) =>
          this.handleEquipmentChange(slotName, e)
        );

        // Show initial info for default selected item
        const selectedItem = element.value;
        const infoContainer = this.equipmentInfo[slotName];

        if (selectedItem && infoContainer && itemList[selectedItem]) {
          infoContainer.innerHTML = itemList[selectedItem].description;
          infoContainer.style.display = "block";
          infoContainer.style.visibility = "visible";
          infoContainer.style.zIndex = "1000";
        }
      }
    });
  }

  calculateMercenaryDamage() {
    // Calculate damage based on equipment and level
    let baseDamage = this.getMercenaryBaseDamage();
    let weaponDamage = this.calculateWeaponDamage();
    return baseDamage + weaponDamage;
  }

  getMercenaryBaseDamage() {
    // Base damage calculation based on merc type and level
    const level = parseInt(this.mercLevel.value) || 1;
    const mercType = this.mercClass.value;
    // TODO: Implement proper base damage formulas
    return level * 5;
  }

  calculateWeaponDamage() {
    // Calculate damage from equipped weapon
    const weapon = this.equipmentSlots.weapon;
    if (!weapon || !weapon.value) return 0;
    // TODO: Implement weapon damage calculation
    return 0;
  }

  initializeListeners() {
    this.mercClass.addEventListener("change", (e) =>
      this.handleMercenaryChange(e)
    );
    this.mercLevel.addEventListener("input", () => this.handleLevelChange());
  }
}

// Initialize the mercenary system when the document loads
document.addEventListener("DOMContentLoaded", () => {
  window.mercenarySystem = new MercenarySystem();
});

export default MercenarySystem;
