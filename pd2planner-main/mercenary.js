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
      gloves: document.getElementById("mercgloves-dropdown"),
      belt: document.getElementById("mercbelts-dropdown"),
      boots: document.getElementById("mercboots-dropdown"),
    };

    // Equipment info containers
    this.equipmentInfo = {
      helm: document.getElementById("merchelm-info"),
      armor: document.getElementById("mercarmor-info"),
      weapon: document.getElementById("mercweapon-info"),
      off: document.getElementById("mercoff-info"),
      gloves: document.getElementById("mercglove-info"),
      belt: document.getElementById("mercbelt-info"),
      boots: document.getElementById("mercboot-info"),
    };

    // Initialize stats
    this.stats = {
      ias: 0,
      fcr: 0,
      frw: 0,
      fhr: 0,
      cbf: 0,
      plr: 0,
      dr: 0,
      pdr: 0,
      mdr: 0,
      fireResist: 0,
      coldResist: 0,
      lightResist: 0,
      poisonResist: 0,
      curseResist: 0,
      allSkills: 0,
      magicFind: 0,
      goldFind: 0,
      ow: 0,
      owDmg: 0,
      cb: 0,
      cbDmg: 0,
      enhancedDamage: 0,
      attackRating: 0,
      defense: 0,
      life: 0,
    };

    this.initializeStatContainers();
    this.initializeListeners();
    this.initializeEquipmentSystem();
    this.updateInitialStats();
  }

  updateInitialStats() {
    // Clear stats first
    this.clearStats();

    // Update stats for each equipped item
    Object.entries(this.equipmentSlots).forEach(([slot, element]) => {
      if (element && element.value) {
        const selectedItem = element.value;
        if (itemList[selectedItem]?.properties) {
          this.updateStats(selectedItem);
        }
      }
    });

    // Make sure stats are displayed
    this.displayStats();
  }

  initializeStatContainers() {
    // Initialize stat containers
    this.statContainers = {
      ias: document.getElementById("merciascontainer"),
      fcr: document.getElementById("mercfcrcontainer"),
      frw: document.getElementById("mercfrwcontainer"),
      fhr: document.getElementById("mercfhrcontainer"),
      cbf: document.getElementById("merccbfcontainer"),
      plr: document.getElementById("mercplrcontainer"),
      dr: document.getElementById("mercdrcontainer"),
      pdr: document.getElementById("mercpdrcontainer"),
      mdr: document.getElementById("mercmdrcontainer"),
      fireResist: document.getElementById("mercfireresistcontainer"),
      coldResist: document.getElementById("merccoldresistcontainer"),
      lightResist: document.getElementById("merclightresistcontainer"),
      poisonResist: document.getElementById("mercpoisonresistcontainer"),
      curseResist: document.getElementById("merccurseresistcontainer"),
      allSkills: document.getElementById("mercallskillscontainer"),
      magicFind: document.getElementById("mercmagicfindcontainer"),
      goldFind: document.getElementById("mercgoldfindcontainer"),
      ow: document.getElementById("mercowcontainer"),
      owDmg: document.getElementById("mercowdmgcontainer"),
      cb: document.getElementById("merccbcontainer"),
      cbDmg: document.getElementById("merccbdmgcontainer"),
      enhancedDamage: document.getElementById("mercenhancedDamagecontainer"),
      attackRating: document.getElementById("mercattackRatingcontainer"),
      defense: document.getElementById("mercdefensecontainer"),
      life: document.getElementById("merclifecontainer"),
      mana: document.getElementById("mercmanacontainer"),
    };
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
    const infoContainer = this.equipmentInfo[slotName];

    const infoElements = {
      helm: "merchelm-info",
      armor: "mercarmor-info",
      weapon: "mercweapon-info",
      off: "mercoff-info",
      glove: "mercglove-info",
      belt: "mercbelt-info",
      boot: "mercboot-info",
    };

    if (selectedItem && infoContainer && itemList[selectedItem]) {
      // Update item description
      infoContainer.innerHTML = itemList[selectedItem].description;
      infoContainer.style.display = "block";
      infoContainer.style.visibility = "visible";

      // Clear and recalculate all stats
      this.clearStats();
      Object.values(this.equipmentSlots).forEach((slot) => {
        if (slot && slot.value) {
          this.updateStats(slot.value);
        }
      });
    }
  }

  clearStats() {
    Object.keys(this.stats).forEach((stat) => {
      this.stats[stat] = 0;
    });
    this.displayStats();
  }

  displayStats() {
    // Display stat values in their respective containers
    document.getElementById("merciascontainer").innerHTML =
      this.stats.ias.toFixed(0);
    document.getElementById("mercfcrcontainer").innerHTML =
      this.stats.fcr.toFixed(0);
    document.getElementById("mercfrwcontainer").innerHTML =
      this.stats.frw.toFixed(0);
    document.getElementById("mercfhrcontainer").innerHTML =
      this.stats.fhr.toFixed(0);
    document.getElementById("merccbfcontainer").innerHTML =
      this.stats.cbf.toFixed(0);
    document.getElementById("mercplrcontainer").innerHTML =
      this.stats.plr.toFixed(0);
    document.getElementById("mercdrcontainer").innerHTML =
      this.stats.dr.toFixed(0);
    document.getElementById("mercpdrcontainer").innerHTML =
      this.stats.pdr.toFixed(0);
    document.getElementById("mercmdrcontainer").innerHTML =
      this.stats.mdr.toFixed(0);
    document.getElementById("mercfireresistcontainer").innerHTML =
      this.stats.fireResist.toFixed(0);
    document.getElementById("merccoldresistcontainer").innerHTML =
      this.stats.coldResist.toFixed(0);
    document.getElementById("merclightresistcontainer").innerHTML =
      this.stats.lightResist.toFixed(0);
    document.getElementById("mercpoisonresistcontainer").innerHTML =
      this.stats.poisonResist.toFixed(0);
    document.getElementById("merccurseresistcontainer").innerHTML =
      this.stats.curseResist.toFixed(0);
    document.getElementById("mercallskillscontainer").innerHTML =
      this.stats.allSkills.toFixed(0);
    document.getElementById("mercmagicfindcontainer").innerHTML =
      this.stats.magicFind.toFixed(0);
    document.getElementById("mercgoldfindcontainer").innerHTML =
      this.stats.goldFind.toFixed(0);
    document.getElementById("mercowcontainer").innerHTML =
      this.stats.ow.toFixed(0);
    document.getElementById("mercowdmgcontainer").innerHTML =
      this.stats.owDmg.toFixed(0);
    document.getElementById("merccbcontainer").innerHTML =
      this.stats.cb.toFixed(0);
    document.getElementById("merccbdmgcontainer").innerHTML =
      this.stats.cbDmg.toFixed(0);
  }

  updateStats(selectedItem) {
    if (itemList[selectedItem]?.properties) {
      const props = itemList[selectedItem].properties;

      // Update stats based on equipped item's properties
      this.stats.ias += props.ias || 0;
      this.stats.fcr += props.fcr || 0;
      this.stats.frw += props.frw || 0;
      this.stats.fhr += props.fhr || 0;
      this.stats.cbf += (props.cbf || 0) + (props.freezedur || 0);
      this.stats.plr += props.plr || 0;
      this.stats.dr += props.physdr || 0;
      this.stats.pdr += props.pdr || 0;
      this.stats.mdr += props.mdr || 0;
      this.stats.fireResist += (props.firres || 0) + (props.allres || 0);
      this.stats.coldResist += (props.coldres || 0) + (props.allres || 0);
      this.stats.lightResist += (props.ligres || 0) + (props.allres || 0);
      this.stats.poisonResist += (props.poisres || 0) + (props.allres || 0);
      this.stats.curseResist += props.curres || 0;
      this.stats.allSkills += props.allsk || 0;
      this.stats.magicFind += props.magicfind || 0;
      this.stats.goldFind += props.goldfind || 0;
      this.stats.ow += props.ow || 0;
      this.stats.owDmg += props.owdmg || 0;
      this.stats.cb += props.cb || 0;
      this.stats.cbDmg += props.cbdmg || 0;

      this.displayStats();
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

document.addEventListener("DOMContentLoaded", () => {
  window.mercenarySystem = new MercenarySystem();
});
