document.addEventListener("DOMContentLoaded", () => {
  // Initialize sockets for all socketed items when the page loads
  [
    "helms-dropdown",
    "armors-dropdown",
    "weapons-dropdown",
    "offs-dropdown",
  ].forEach((id) => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      // Add initial setup
      dropdown.addEventListener("change", () => {
        const sectionMap = {
          "weapons-dropdown": "weapon",
          "helms-dropdown": "helm",
          "armors-dropdown": "armor",
          "offs-dropdown": "shield",
        };
        const section = sectionMap[id];

        // Force socket UI update based on the selected item
        forceUpdateSockets(section);
      });

      // Trigger once on page load to initialize
      if (dropdown.value) {
        const sectionMap = {
          "weapons-dropdown": "weapon",
          "helms-dropdown": "helm",
          "armors-dropdown": "armor",
          "offs-dropdown": "shield",
        };
        const section = sectionMap[id];
        setTimeout(() => forceUpdateSockets(section), 500);
      }
    }
  });
});

function forceUpdateSockets(section) {
  // Get the selected item
  const dropdownId = `${section}s-dropdown`;
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown || !dropdown.value) return;

  const selectedItem = dropdown.value;

  // Get the base type
  let baseType;
  if (section === "weapon") {
    baseType = getBaseWeaponType(selectedItem);
  } else {
    try {
      const itemData = itemList[selectedItem];
      baseType = itemData.description.split("<br>")[1].trim();
    } catch (e) {
      console.error("Error getting base type:", e);
      baseType = "";
    }
  }

  // Get the maximum allowed sockets for this base type
  const maxBaseAllowed =
    maxSockets[baseType] !== undefined ? maxSockets[baseType] : 2;
  console.log(
    `[forceUpdateSockets] Item: ${selectedItem}, Base: ${baseType}, Max sockets: ${maxBaseAllowed}`
  );

  // Check if there's a socket corruption
  const containerClass =
    section === "weapon" ? "weaponsockets" : `${section}sockets`;
  const container = document.querySelector(`.${containerClass}`);

  // For items that can't have sockets, clear UI, data, and any gems
  if (
    maxBaseAllowed === 0 ||
    socketExceptions.noSockets.includes(selectedItem)
  ) {
    console.log(
      `[forceUpdateSockets] Item cannot have sockets, clearing everything`
    );

    // Clear any socket data
    if (container) {
      // Remove any socketed items
      const sockets = container.querySelectorAll(".socketz");
      sockets.forEach((socket) => {
        if (socket.dataset.itemName) {
          clearSocket(socket, true);
        }
      });

      // Then clear the container
      container.innerHTML = "";
    }

    // Check if we need to remove a socket corruption
    const type = section === "shield" ? "off" : section;
    if (typeCorruptions[type] && typeCorruptions[type].includes("Socketed")) {
      console.log(`[forceUpdateSockets] Removing socket corruption`);
      delete typeCorruptions[type];
      localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));

      // Also remove from the UI
      const infoContainerId = {
        helm: "helm-info",
        armor: "armor-info",
        weapon: "weapon-info",
        shield: "off-info",
      }[section];

      const infoContainer = document.getElementById(infoContainerId);
      if (infoContainer) {
        const corruptedMod = infoContainer.querySelector(".corrupted-mod");
        const corruptedText = infoContainer.querySelector(".corrupted-text");

        if (corruptedMod) corruptedMod.remove();
        if (corruptedText) corruptedText.remove();
      }
    }

    return;
  }

  // Check if we have a socket corruption
  const type = section === "shield" ? "off" : section;
  const socketCorruption = typeCorruptions[type]?.includes("Socketed");

  if (socketCorruption) {
    // If we have a socket corruption, make sure it respects the base item maximum
    const socketMatch = typeCorruptions[type].match(/\((\d+)\)/);
    if (socketMatch) {
      const currentSockets = parseInt(socketMatch[1]);
      const adjustedSockets = Math.min(currentSockets, maxBaseAllowed);

      if (adjustedSockets !== currentSockets) {
        console.log(
          `[forceUpdateSockets] Adjusting socket corruption from ${currentSockets} to ${adjustedSockets}`
        );
        typeCorruptions[type] = `Socketed (${adjustedSockets})`;
        localStorage.setItem(
          "typeCorruptions",
          JSON.stringify(typeCorruptions)
        );
        updateCorruptionDisplay(type, `Socketed (${adjustedSockets})`);
      }

      updateSocketCount(section, adjustedSockets);
    }
  } else {
    // No socket corruption, create the default number of sockets for this item type
    const maxAllowedSockets = socketExceptions.maxOneSocket.includes(
      selectedItem
    )
      ? 1
      : maxBaseAllowed;

    console.log(
      `[forceUpdateSockets] Setting uncorrupted socket count to ${maxAllowedSockets}`
    );
    updateSocketCount(section, maxAllowedSockets);
  }

  // Make sure socket stats display is refreshed
  refreshSocketProperties();
}

document.addEventListener("DOMContentLoaded", () => {
  const helmCorruptions = [
    { mod: "Socketed ([1-3])", type: "numeric", range: [1, 3] },
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    {
      mod: "Indestructible , +[50-80]% Enhanced Defense",
      type: "numeric",
      range: [50, 80],
    },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    {
      mod: "+[150-250] to Attack Rating, +[2-4] to Light Radius",
      type: "double",
      range: [
        [150, 250],
        [2, 4],
      ],
    },
    { mod: "+10% Curse Resistance", type: "fixed" },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "[3-5]% Life Stolen per Hit", type: "numeric", range: [3, 5] },
    { mod: "All Resistances +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "Replenish Life +[20-30]", type: "numeric", range: [20, 30] },
    { mod: "[3-5]% Mana Stolen per Hit", type: "numeric", range: [3, 5] },
    {
      mod: "Physical Damage Taken Reduced by [4-6]%",
      type: "numeric",
      range: [4, 6],
    },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    {
      mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "+[3-4] Life after each Kill", type: "numeric", range: [3, 4] },
    {
      mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    {
      mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    {
      mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
  ];

  const armorCorruptions = [
    { mod: "Socketed ([2-4])", type: "numeric", range: [2, 4] },
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [30, 30] },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+[30-40] Mana", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    {
      mod: "Indestructible, +[50-80]% Enhanced Defense",
      type: "numeric",
      range: [50, 80],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+20% Faster Run/Walk", type: "fixed" },
    {
      mod: "+10% Faster Block Rate, [10-20]% Increased Chance of Blocking",
      type: "numeric",
      range: [10, 20],
    },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    {
      mod: "Physical Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Magic Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)",
      type: "fixed",
    },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    {
      mod: "Physical Damage Taken Reduced by [6-8]%",
      type: "numeric",
      range: [6, 8],
    },
    {
      mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    {
      mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    {
      mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    {
      mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
  ];

  const weaponCorruptions = [
    { mod: "Socketed ([2-6])", type: "numeric", range: [2, 6] },
    { mod: "+[40-80]% Enhanced Damage", type: "numeric", range: [40, 80] },
    { mod: "+[150-250] to Attack Rating", type: "numeric", range: [150, 250] },
    {
      mod: "+[100-150]% Enhanced Damage to Demons",
      type: "numeric",
      range: [100, 150],
    },
    {
      mod: "+200 to Attack Rating against Demons",
      type: "numeric",
      range: [200, 200],
    },
    {
      mod: "+[100-150]% Enhanced Damage to Undead",
      type: "numeric",
      range: [100, 150],
    },
    {
      mod: "+200 to Attack Rating against Undead",
      type: "numeric",
      range: [200, 200],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[3-6] Life after each Hit", type: "numeric", range: [3, 6] },
    { mod: "+[3-6] Life after each Kill", type: "numeric", range: [3, 6] },
    { mod: "+[3-5] to Mana after each Kill", type: "numeric", range: [3, 5] },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "Requirements -[25-50]%", type: "numeric", range: [25, 50] },
    { mod: "+20% Faster Cast Rate", type: "fixed" },
    {
      mod: "+[30-40]% Increased Attack Speed",
      type: "numeric",
      range: [30, 40],
    },
    { mod: "+[40-60]% Enhanced Damage", type: "numeric", range: [40, 60] },
    { mod: "5% Life Stolen per Hit", type: "fixed" },
    {
      mod: "[-40-60] Target Defense per Hit",
      type: "numeric",
      range: [-40, -60],
    },
    {
      mod: "[20-30]% Chance of Crushing Blow",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "[20-30]% Deadly Strike", type: "numeric", range: [20, 30] },
    { mod: "+1 to All Skills", type: "fixed" },
    {
      mod: "+[30-40]% Increased Attack Speed",
      type: "numeric",
      range: [30, 40],
    },
    {
      mod: "[20-30]% Chance of Crushing Blow",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+[50-70]% Enhanced Damage", type: "numeric", range: [50, 70] },
    { mod: "25% Deadly Strike", type: "fixed" },
    { mod: "Ignores Target's Defense", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Fire Skill Damage", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Cold Skill Damage", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    {
      mod: "+[5-10] to Lightning Skill Damage",
      type: "numeric",
      range: [5, 10],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Poison Skill Damage", type: "numeric", range: [5, 10] },
  ];

  const offCorruptions = [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "+20% Faster Block Rate", type: "fixed" },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+[30-40] Life", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Cold Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Lightning Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Poison Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Block Rate", type: "fixed" },
    {
      mod: "[10-20]% Increased Chance of Blocking",
      type: "numeric",
      range: [10, 20],
    },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    {
      mod: "Physical Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Magic Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)",
      type: "fixed",
    },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    {
      mod: "Physical Damage Taken Reduced by [6-8]%",
      type: "numeric",
      range: [6, 8],
    },
    {
      mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
    {
      mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
    {
      mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
    {
      mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
  ];

  const gloveCorruptions = [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "Regenerate Mana [20-30]%", type: "numeric", range: [20, 30] },
    { mod: "+[10-20]% Faster Block Rate", type: "numeric", range: [10, 20] },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    {
      mod: "[50-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [50, 100],
    },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    {
      mod: "[10-25]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [10, 25],
    },
    { mod: "[2-3]% Life Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[2-3]% Mana Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "-[15-25]% Target Defense", type: "numeric", range: [-15, -25] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "10% Deadly Strike", type: "fixed" },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
  ];

  const beltCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    {
      mod: "Attacker Takes Damage of [2-396] ([2-4] per Level)",
      type: "fixed",
    },
    {
      mod: "[60-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [60, 100],
    },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    {
      mod: "Physical Damage Taken Reduced by [3-4]%",
      type: "numeric",
      range: [3, 4],
    },
  ];

  const bootCorruptions = [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "Regenerate Mana [10-15]%", type: "numeric", range: [10, 15] },
    {
      mod: "[50-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [50, 100],
    },
    {
      mod: "[10-25]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [10, 25],
    },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Indestructible", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Block Rate", type: "fixed" },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "Replenish Life +[15-25]", type: "numeric", range: [15, 25] },
    { mod: "+15% Faster Run/Walk", type: "fixed" },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    {
      mod: "Physical Damage Taken Reduced by [3-4]%",
      type: "numeric",
      range: [3, 4],
    },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    {
      mod: "+[2-3]% to Maximum Fire Resist, Fire Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
    {
      mod: "+[2-3]% to Maximum Cold Resist, Cold Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
    {
      mod: "+[2-3]% to Maximum Lightning Resist, Lightning Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
    {
      mod: "+[2-3]% to Maximum Poison Resist, Poison Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
  ];

  const ringOneCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    {
      mod: "Physical Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    {
      mod: "Magic Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    {
      mod: "[40-80]% Extra Gold from Monsters",
      type: "numeric",
      range: [40, 80],
    },
    {
      mod: "[15-20]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [15, 20],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "10% Reduced Curse Duration", type: "fixed" },
    { mod: "[3-4]% Mana Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "[3-4]% Life Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "+[4-6] to All Attributes", type: "numeric", range: [4, 6] },
    { mod: "All Resistances +[4-6]", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by 3%", type: "fixed" },
  ];

  const ringTwoCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    {
      mod: "Physical Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    {
      mod: "Magic Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    {
      mod: "[40-80]% Extra Gold from Monsters",
      type: "numeric",
      range: [40, 80],
    },
    {
      mod: "[15-20]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [15, 20],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "10% Reduced Curse Duration", type: "fixed" },
    { mod: "[3-4]% Mana Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "[3-4]% Life Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "+[4-6] to All Attributes", type: "numeric", range: [4, 6] },
    { mod: "All Resistances +[4-6]", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by 3%", type: "fixed" },
  ];

  const amuletCorruptions = [
    { mod: "+[6-12] to Strength", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Dexterity", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Vitality", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Energy", type: "numeric", range: [6, 12] },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "+[10-20]% Chance to Pierce", type: "numeric", range: [10, 20] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[6-8] to All Attributes", type: "numeric", range: [6, 8] },
    {
      mod: "[60-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [60, 100],
    },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "All Resistances +[7-10]", type: "numeric", range: [7, 10] },
  ];

  const quiverCorruptions = [
    { mod: "+20% Faster Hit Recovery", type: "fixed" },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    {
      mod: "[50-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [50, 100],
    },
    {
      mod: "[10-25]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [10, 25],
    },
    { mod: "Fire Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Cold Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Lightning Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Poison Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    {
      mod: "[-5-10]% to Enemy Fire Resistance",
      type: "numeric",
      range: [-5, -10],
    },
    { mod: "[-10-20]% Target Defense", type: "numeric", range: [-10, -20] },
    { mod: "+[50-100] to Attack Rating", type: "numeric", range: [50, 100] },
    { mod: "[2-4]% Mana Stolen per Hit", type: "numeric", range: [2, 4] },
    { mod: "[2-4]% Life Stolen per Hit", type: "numeric", range: [2, 4] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "+[10-15] to Minimum Damage", type: "numeric", range: [10, 15] },
    { mod: "+[10-15] to Maximum Damage", type: "numeric", range: [10, 15] },
    { mod: "Ignore Target's Defense", type: "fixed" },
    { mod: "All Resistances +[5-10]", type: "numeric", range: [5, 10] },
  ];

  localStorage.removeItem("typeCorruptions");

  const typeCorruptions = {
    helm: null,
    armor: null,
    weapon: null,
    off: null,
    glove: null,
    belt: null,
    boot: null,
    ringOne: null,
    ringTwo: null,
    amulet: null,
    quiver: null,
  };

  const corruptionsByType = {
    helm: helmCorruptions,
    armor: armorCorruptions,
    weapon: weaponCorruptions,
    off: offCorruptions,
    glove: gloveCorruptions,
    belt: beltCorruptions,
    boot: bootCorruptions,
    ringOne: ringOneCorruptions,
    ringTwo: ringTwoCorruptions,
    amulet: amuletCorruptions,
    quiver: quiverCorruptions,
  };

  function createCorruptionUI() {
    const buttonsHTML = `
        <div class="corruption-buttons" style="display: flex; gap: 10px; margin: 10px 0;">
          <button id="corruptHelm" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 28, 28);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Helm</button>
          <button id="corruptArmor" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Armor</button>
          <button id="corruptWeapon" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Weapon</button>
          <button id="corruptShield" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Shield</button>
            <button id="corruptGlove" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Gloves</button>
            <button id="corruptBelt" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Belt</button>
            <button id="corruptBoot" class="corrupt-button" style="
            
            margin-left: px; 
            margin-top:  0px; 
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            
            cursor: pointer;
            ">Corrupt Boots</button>
            <button id="corruptRingOne" class="corrupt-button" style="
            
            margin-left: 0px; 
            margin-top:  0px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            
            cursor: pointer;
            ">Corrupt Ring One</button>
            <button id="corruptRingTwo" class="corrupt-button" style="
            margin-left: 0px; 
            margin-top:  0px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            
            cursor: pointer;
            ">Corrupt Ring Two</button>
            <button id="corruptAmulet" class="corrupt-button" style="
            margin-left: 0px; 
            margin-top:  0px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            
            cursor: pointer;
            ">Corrupt Amulet</button>
            <button id="corruptQuiver" class="corrupt-button" style="
            margin-left: 300px; 
            margin-top:  0pxx;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            cursor: pointer;
            ">Corrupt Quiver NOT AVAILABLE YET</button>

        </div>
      `;

    const modalHTML = `
        <div id="corruptionModal" class="corruption-modal" style="
          position: absolute;
          left: 1500px;
          z-index: 2;
          
          top: 150px;
          width: 100%;
          height: 700px;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
          display: none;
        ">
          <div class="corruption-content" style="
            background-color:rgb(15, 14, 14);
            margin: 15% auto;
            padding: 10px;
            border: 1px solid #888;
            width: 80%;
            max-height: 800px;
            max-width: 500px;
            border-radius: 10px;
          ">
            <h2 style="color: white; margin-bottom: 15px;">Select Corruption Modifier</h2>
            <div id="corruptionOptions" class="corruption-options"></div>
          </div>
        </div>
      `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.body.insertAdjacentHTML("beforeend", buttonsHTML);
  }

  createCorruptionUI();

  function showModal(type) {
    const modal = document.getElementById("corruptionModal");
    const optionsContainer = document.getElementById("corruptionOptions");
    modal.style.display = "block";
    optionsContainer.innerHTML = "";

    const corruptions = corruptionsByType[type];

    corruptions.forEach((mod) => {
      const modContainer = document.createElement("div");
      modContainer.className = "corruption-option-container";

      const button = document.createElement("button");
      button.className = "corruption-option";

      if (mod.type === "numeric") {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "corruption-slider-container";
        sliderContainer.style.display = "none";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = mod.range[0];
        slider.max = mod.range[1];
        slider.value = mod.range[0];
        slider.className = "corruption-slider";

        const value = document.createElement("span");
        value.className = "corruption-slider-value";
        value.textContent = slider.value;

        slider.oninput = () => {
          value.textContent = slider.value;
          button.textContent = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
        };

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(value);

        button.onclick = () => {
          document
            .querySelectorAll(".corruption-slider-container")
            .forEach((container) => {
              container.style.display = "none";
            });
          sliderContainer.style.display = "block";
        };

        const confirm = document.createElement("button");
        confirm.className = "corruption-confirm";
        confirm.textContent = "Confirm";
        confirm.onclick = () => {
          const modWithValue = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
          selectMod({ ...mod, mod: modWithValue }, type);
        };
        sliderContainer.appendChild(confirm);

        modContainer.appendChild(button);
        modContainer.appendChild(sliderContainer);
      } else if (mod.type === "double") {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "corruption-slider-container";
        sliderContainer.style.display = "none";
        sliderContainer.style.padding = "10px";

        // Set initial button text
        button.textContent = mod.mod;

        // First value group
        const group1 = document.createElement("div");
        group1.style.marginBottom = "15px";

        const label1 = document.createElement("div");
        label1.textContent = "Attack Rating:";
        label1.style.marginBottom = "5px";
        label1.style.color = "white"; // Make label visible

        const slider1 = document.createElement("input");
        slider1.type = "range";
        slider1.min = mod.range[0][0];
        slider1.max = mod.range[0][1];
        slider1.value = mod.range[0][0];
        slider1.className = "corruption-slider";

        const value1 = document.createElement("span");
        value1.className = "corruption-slider-value";
        value1.textContent = slider1.value;
        value1.style.marginLeft = "10px";
        value1.style.color = "white"; // Make value visible

        group1.appendChild(label1);
        group1.appendChild(slider1);
        group1.appendChild(value1);

        // Second value group
        const group2 = document.createElement("div");
        group2.style.marginBottom = "15px";

        const label2 = document.createElement("div");
        label2.textContent = "Light Radius:";
        label2.style.marginBottom = "5px";
        label2.style.color = "white"; // Make label visible

        const slider2 = document.createElement("input");
        slider2.type = "range";
        slider2.min = mod.range[1][0];
        slider2.max = mod.range[1][1];
        slider2.value = mod.range[1][0];
        slider2.className = "corruption-slider";

        const value2 = document.createElement("span");
        value2.className = "corruption-slider-value";
        value2.textContent = slider2.value;
        value2.style.marginLeft = "10px";
        value2.style.color = "white"; // Make value visible

        group2.appendChild(label2);
        group2.appendChild(slider2);
        group2.appendChild(value2);

        // Create confirm button
        const confirm = document.createElement("button");
        confirm.className = "corruption-confirm";
        confirm.textContent = "Confirm";
        confirm.style.marginTop = "10px";
        confirm.style.padding = "5px 10px";
        confirm.onclick = () => {
          const modWithValues = mod.mod
            .replace(/\[\d+-\d+\]/, slider1.value)
            .replace(/\[\d+-\d+\]/, slider2.value);
          selectMod({ ...mod, mod: modWithValues }, type);
        };

        // Update button text when sliders change
        const updateButtonText = () => {
          button.textContent = mod.mod
            .replace(/\[\d+-\d+\]/, slider1.value)
            .replace(/\[\d+-\d+\]/, slider2.value);
        };

        slider1.oninput = () => {
          value1.textContent = slider1.value;
          updateButtonText();
        };

        slider2.oninput = () => {
          value2.textContent = slider2.value;
          updateButtonText();
        };

        button.onclick = () => {
          document
            .querySelectorAll(".corruption-slider-container")
            .forEach((container) => {
              container.style.display = "none";
            });
          sliderContainer.style.display = "block";
        };

        sliderContainer.appendChild(group1);
        sliderContainer.appendChild(group2);
        sliderContainer.appendChild(confirm);

        modContainer.appendChild(button);
        modContainer.appendChild(sliderContainer);

        // Remove the later button.textContent assignment for this case
        optionsContainer.appendChild(modContainer);
        return; // Skip the final button.textContent assignment
      }

      button.textContent = mod.mod;
      optionsContainer.appendChild(modContainer);
    });
  }

  function selectMod(mod, type) {
    if (mod.mod.includes("Socketed")) {
      const socketMatch = mod.mod.match(/\((\d+)\)/);
      if (!socketMatch) {
        return;
      }

      const requestedSocketCount = parseInt(socketMatch[1]);
      console.log(
        `Requested socket corruption: ${requestedSocketCount} sockets for ${type}`
      );

      // Get item data based on type
      let baseType, selectedItem;

      if (type === "weapon") {
        const weaponSelect = document.getElementById("weapons-dropdown");
        selectedItem = weaponSelect.value;
        baseType = getBaseWeaponType(selectedItem);
      } else if (type === "helm") {
        const helmSelect = document.getElementById("helms-dropdown");
        selectedItem = helmSelect.value;
        baseType = getItemBaseType(selectedItem);
      } else if (type === "armor") {
        const armorSelect = document.getElementById("armors-dropdown");
        selectedItem = armorSelect.value;
        baseType = getItemBaseType(selectedItem);
      } else if (type === "off") {
        const offSelect = document.getElementById("offs-dropdown");
        selectedItem = offSelect.value;
        baseType = getItemBaseType(selectedItem);
      }

      // Get the maximum allowed sockets for this base type
      const maxAllowed =
        maxSockets[baseType] !== undefined ? maxSockets[baseType] : 2;
      console.log(`Base type: ${baseType}, Max allowed: ${maxAllowed}`);

      // Prevent socketing for items with 0 max sockets
      if (maxAllowed === 0) {
        alert(`${selectedItem} (${baseType}) cannot have sockets.`);
        document.getElementById("corruptionModal").style.display = "none";
        return false;
      }

      // For normal items, limit to the maximum for this base type
      const actualSockets = Math.min(requestedSocketCount, maxAllowed);
      console.log(`Resulting sockets: ${actualSockets}`);

      // Update the corruption text and apply it
      const corruptionText = `Socketed (${actualSockets})`;
      typeCorruptions[type] = corruptionText;
      localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));

      // Update the display
      updateCorruptionDisplay(type, corruptionText);

      // Update the socket UI
      updateSocketCount(type, actualSockets);

      document.getElementById("corruptionModal").style.display = "none";
      return true;
    } else {
      // Store the corruption
      typeCorruptions[type] = mod.mod;
      localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));
      updateCorruptionDisplay(type, mod.mod);

      // Force update the weapon damage display if this is an enhanced damage corruption
      if (type === "weapon" && mod.mod.includes("Enhanced Damage")) {
        console.log("Updating weapon with Enhanced Damage corruption");

        const weaponSelect = document.getElementById("weapons-dropdown");
        if (weaponSelect) {
          const currentItem = weaponSelect.value;
          const currentItemData = itemList[currentItem];

          if (currentItemData) {
            const baseType = currentItemData.description.split("<br>")[1];
            const isTwoHanded =
              currentItemData.properties.twohandmin !== undefined;

            // Recalculate damage with the new corruption
            if (isTwoHanded) {
              const newMin = calculateItemDamage(
                currentItemData,
                baseType,
                false
              );
              const newMax = calculateItemDamage(
                currentItemData,
                baseType,
                true
              );

              console.log(`Two-hand damage updated: ${newMin}-${newMax}`);

              // Update properties
              currentItemData.properties.twohandmin = newMin;
              currentItemData.properties.twohandmax = newMax;

              // Update displayed values
              const minContainer = document.getElementById(
                "twohandmindmgcontainer"
              );
              const maxContainer = document.getElementById(
                "twohandmaxdmgcontainer"
              );
              if (minContainer) minContainer.textContent = newMin;
              if (maxContainer) maxContainer.textContent = newMax;
            } else {
              const newMin = calculateItemDamage(
                currentItemData,
                baseType,
                false
              );
              const newMax = calculateItemDamage(
                currentItemData,
                baseType,
                true
              );

              console.log(`One-hand damage updated: ${newMin}-${newMax}`);

              // Update properties
              currentItemData.properties.onehandmin = newMin;
              currentItemData.properties.onehandmax = newMax;

              // Update displayed values
              const minContainer = document.getElementById(
                "onehandmindmgcontainer"
              );
              const maxContainer = document.getElementById(
                "onehandmaxdmgcontainer"
              );
              if (minContainer) minContainer.textContent = newMin;
              if (maxContainer) maxContainer.textContent = newMax;
            }

            // Update the weapon description with new damage values
            const weaponInfo = document.getElementById("weapon-info");
            if (weaponInfo) {
              const lines = currentItemData.description.split("<br>");
              const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";
              const min = isTwoHanded
                ? currentItemData.properties.twohandmin
                : currentItemData.properties.onehandmin;
              const max = isTwoHanded
                ? currentItemData.properties.twohandmax
                : currentItemData.properties.onehandmax;

              // Find and update the damage line
              for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes("Damage:")) {
                  lines[i] = `${damageType} Damage: ${min}-${max}`;
                  break;
                }
              }

              // Save corruption info
              const corruptedMod = weaponInfo.querySelector(".corrupted-mod");
              const corruptedText = weaponInfo.querySelector(".corrupted-text");

              // Update description without losing corruption text
              currentItemData.description = lines.join("<br>");

              // Keep any existing socket stats
              const socketStats = weaponInfo.querySelector(".socket-stats");

              // Update the HTML
              weaponInfo.innerHTML = currentItemData.description;

              // Re-add socket stats if they existed
              if (socketStats) weaponInfo.appendChild(socketStats);

              // Re-add corruption text
              if (corruptedMod) weaponInfo.appendChild(corruptedMod);
              if (corruptedText) weaponInfo.appendChild(corruptedText);
            }
          }
        }
      }

      document.getElementById("corruptionModal").style.display = "none";
      return true;
    }
  }

  // Add generic function to get base type for any item
  function getItemBaseType(selectedItem) {
    const itemData = itemList[selectedItem];
    if (!itemData) {
      console.error("No item data found for:", selectedItem);
      return null;
    }

    const descriptionParts = itemData.description.split("<br>");
    const baseType = descriptionParts[1].trim();

    return baseType;
  }
  // Update the existing function to use the new generic one
  function getBaseWeaponType(selectedWeapon) {
    return getItemBaseType(selectedWeapon);
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
  }

  function restoreCorruptions() {
    const types = [
      { type: "helm", containerId: "helm-info" },
      { type: "armor", containerId: "armor-info" },
      { type: "weapon", containerId: "weapon-info" },
      { type: "off", containerId: "off-info" },
      { type: "glove", containerId: "glove-info" },
      { type: "belt", containerId: "belt-info" },
      { type: "boot", containerId: "boot-info" },
      { type: "ringOne", containerId: "ringsone-info" },
      { type: "ringTwo", containerId: "ringstwo-info" },
      { type: "amulet", containerId: "amulet-info" },
      { type: "quiver", containerId: "quiver-info" },
    ];

    types.forEach(({ type, containerId }) => {
      const corruption = typeCorruptions[type];
      if (!corruption) return;

      // Get the current item's base type
      const dropdownId = `${type}s-dropdown`;
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown) return;

      const selectedItem = dropdown.value;
      if (!selectedItem) return;

      // Special handling for socket corruptions
      if (corruption.includes("Socketed")) {
        const socketMatch = corruption.match(/\((\d+)\)/);
        if (socketMatch) {
          const currentSockets = parseInt(socketMatch[1]);

          let baseType;
          if (type === "weapon") {
            baseType = getBaseWeaponType(selectedItem);
          } else {
            try {
              const itemData = itemList[selectedItem];
              baseType = itemData.description.split("<br>")[1].trim();
            } catch (e) {
              console.error("Error getting base type:", e);
              baseType = "";
            }
          }

          // Calculate the max allowed sockets for this base type
          const maxAllowed = maxSockets[baseType] || 2;

          console.log(
            `Item: ${selectedItem}, Base: ${baseType}, Max allowed: ${maxAllowed}, Current: ${currentSockets}`
          );

          // Special case for items with 0 max sockets
          if (maxAllowed === 0) {
            console.log("Item cannot have sockets, removing socket corruption");

            // Remove socket corruption from display
            const container = document.getElementById(containerId);
            const corruptedMod = container.querySelector(".corrupted-mod");
            const corruptedText = container.querySelector(".corrupted-text");

            if (corruptedMod) corruptedMod.remove();
            if (corruptedText) corruptedText.remove();

            // Remove from state
            delete typeCorruptions[type];
            localStorage.setItem(
              "typeCorruptions",
              JSON.stringify(typeCorruptions)
            );

            // Clear any existing sockets UI
            updateSocketCount(type, 0);
            return;
          }

          // For items that can have sockets, adjust to respect max
          const adjustedSockets = Math.min(currentSockets, maxAllowed);

          // Update the corruption text if needed
          if (adjustedSockets !== currentSockets) {
            typeCorruptions[type] = `Socketed (${adjustedSockets})`;
            localStorage.setItem(
              "typeCorruptions",
              JSON.stringify(typeCorruptions)
            );
          }

          // Display the adjusted corruption
          updateCorruptionDisplay(type, `Socketed (${adjustedSockets})`);

          // Force the socket UI to update with the correct count
          setTimeout(() => updateSocketCount(type, adjustedSockets), 50);
          return;
        }
      }

      // Standard handling for non-socket corruptions
      updateCorruptionDisplay(type, corruption);
    });
  }

  const elementsToWatch = [
    "lvlValue",
    "str",
    "dex",
    "vit",
    "enr",
    "helms-dropdown",
    "armors-dropdown",
    "weapons-dropdown",
    "offs-dropdown",
    "gloves-dropdown",
    "belts-dropdown",
    "boots-dropdown",
    "ringsone-dropdown",
    "ringstwo-dropdown",
    "amulets-dropdown",
  ];

  elementsToWatch.forEach((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener("change", restoreCorruptions);
      element.addEventListener("input", restoreCorruptions);
    }
  });

  restoreCorruptions();

  document
    .getElementById("corruptHelm")
    .addEventListener("click", () => showModal("helm"));
  document
    .getElementById("corruptArmor")
    .addEventListener("click", () => showModal("armor"));
  document
    .getElementById("corruptWeapon")
    .addEventListener("click", () => showModal("weapon"));
  document
    .getElementById("corruptShield")
    .addEventListener("click", () => showModal("off"));
  document
    .getElementById("corruptGlove")
    .addEventListener("click", () => showModal("glove"));
  document
    .getElementById("corruptBelt")
    .addEventListener("click", () => showModal("belt"));
  document
    .getElementById("corruptBoot")
    .addEventListener("click", () => showModal("boot"));
  document
    .getElementById("corruptRingOne")
    .addEventListener("click", () => showModal("ringOne"));
  document
    .getElementById("corruptRingTwo")
    .addEventListener("click", () => showModal("ringTwo"));
  document
    .getElementById("corruptAmulet")
    .addEventListener("click", () => showModal("amulet"));
  document
    .getElementById("corruptQuiver")
    .addEventListener("click", () => showModal("quiver"));

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("corruptionModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

function getBaseWeaponType(selectedWeapon) {
  const itemData = itemList[selectedWeapon];
  if (!itemData) {
    console.error("No item data found for:", selectedWeapon);
    return null;
  }

  const descriptionParts = itemData.description.split("<br>");
  const baseType = descriptionParts[1].trim();

  return baseType;
}

const maxSockets = {
  "Hand Axe": 2,
  Axe: 4,
  "Double Axe": 5,
  "Military Pick": 6,
  "War Axe": 6,
  "Large Axe": 4,
  "Broad Axe": 5,
  "Battle Axe": 5,
  "Great Axe": 6,
  "Giant Axe": 6,
  Club: 2,
  "Spiked Club": 2,
  Mace: 2,
  "Morning Star": 3,
  Flail: 5,
  "War Hammer": 4,
  Maul: 6,
  "Great Maul": 6,
  "Short Sword": 2,
  Scimitar: 2,
  Sabre: 2,
  Falchion: 2,
  "Crystal Sword": 6,
  "Broad Sword": 4,
  "Long Sword": 4,
  "War Sword": 3,
  "Two-Handed Sword": 3,
  Claymore: 4,
  "Giant Sword": 4,
  "Bastard Sword": 4,
  "Great Sword": 6,
  "Executioner Sword": 6,
  "Colossus Blade": 6,
  Flamberge: 5,
  Dagger: 1,
  Dirk: 1,
  Kris: 3,
  Blade: 2,
  "Maiden Javelin": 0,
  Cap: 2,
  "Skull Cap": 2,
  Helm: 2,
  "Full Helm": 2,
  Mask: 3,
  "Bone Helm": 2,
  "Great Helm": 3,
  Crown: 3,
  "War Hat": 2,
  Sallet: 2,
  Casque: 2,
  Basinet: 2,
  "Death Mask": 3,
  "Grim Helm": 2,
  "Winged Helm": 3,
  "Grand Crown": 3,
  Shako: 2,
  Hydraskull: 2,
  Armet: 2,
  "Giant Conch": 2,
  Demonhead: 3,
  "Bone Visage": 3,
  "Spired Helm": 3,
  Corona: 3,
  Circlet: 2,
  Coronet: 2,
  Tiara: 3,
  Diadem: 3,
  "Wolf Head": 3,
  "Hawk Helm": 3,
  Antlers: 3,
  "Falcon Mask": 3,
  "Spirit Mask": 3,
  "Alpha Helm": 3,
  "Griffon Headress": 3,
  "Hunter's Guise": 3,
  "Sacred Feathers": 3,
  "Totemic Mask": 3,
  "Blood Spirit": 3,
  "Sun Spirit": 3,
  "Earth Spirit": 3,
  "Sky Spirit": 3,
  "Dream Spirit": 3,
  "Jawbone Cap": 3,
  "Fanged Helm": 3,
  "Horned Helm": 3,
  "Assault Helmet": 3,
  "Avenger Guard": 3,
  "Jawbone Visor": 3,
  "Lion Helm": 3,
  "Rage Mask": 3,
  "Savage Helmet": 3,
  "Slayer Guard": 3,
  "Carnage Helm": 3,
  "Fury Visor": 3,
  "Destroyer Helm": 3,
  "Conquerer Crown": 3,
  "Guardian Crown": 3,
  "Quilted Armor": 2,
  "Leather Armor": 2,
  "Hard Leather Armor": 2,
  "Studded Leather": 2,
  "Ring Mail": 3,
  "Scale Mail": 2,
  "Chain Mail": 2,
  "Breast Plate": 3,
  "Splint Mail": 2,
  "Plate Mail": 2,
  "Field Plate": 2,
  "Gothic Plate": 4,
  "Light Plate": 3,
  "Full Plate Mail": 4,
  "Ancient Armor": 4,
  "Ghost Armor": 2,
  "Serpentskin Armor": 2,
  "Demonhide Armor": 2,
  "Trellised Armor": 2,
  "Linked Mail": 3,
  "Tigulated Mail": 3,
  "Mesh Armor": 3,
  Cuirass: 3,
  "Russet Armor": 3,
  "Templar Coat": 3,
  "Sharktooth Armor": 3,
  "Embossed Plate": 4,
  "Mage Plate": 3,
  "Chaos Armor": 4,
  "Ornate Plate": 4,
  "Dusk Shroud": 4,
  Wyrmhide: 4,
  "Scarab Husk": 4,
  "Wire Fleece": 4,
  "Diamond Mail": 4,
  "Loricated Mail": 4,
  Boneweave: 4,
  "Great Hauberk": 4,
  "Balrog Skin": 4,
  "Hellforge Plate": 4,
  "Kraken Shell": 4,
  "Lacquered Plate": 4,
  "Archon Plate": 4,
  "Shadow Plate": 4,
  "Sacred Armor": 4,
};

function getMaxSocketsForWeapon(weaponName) {
  if (!itemList) {
    console.error("itemList is undefined!");
    return 2;
  }

  const itemData = itemList[weaponName];
  if (!itemData) {
    return 2;
  }

  const descriptionParts = itemData.description.split("<br>");

  if (descriptionParts.length < 2) {
    return 2;
  }

  const baseType = descriptionParts[1].trim();

  const maxSocket = maxSockets[baseType];

  return maxSocket || 2;
}
document
  .getElementById("weapons-dropdown")
  ?.addEventListener("change", (event) => {
    const selectedWeapon = event.target.value;
    const baseType = getBaseWeaponType(selectedWeapon);

    // Get the maximum allowed sockets for this base item
    const maxAllowed = maxSockets[baseType] || 2;

    // Get corruption info from typeCorruptions object first
    const weaponCorruption = typeCorruptions.weapon;
    const socketMatch = weaponCorruption?.match(/Socketed \((\d+)\)/);

    if (socketMatch) {
      const currentSockets = parseInt(socketMatch[1]);

      // Use the smaller of the corrupted count and the max allowed for THIS base item
      const adjustedSockets = Math.min(currentSockets, maxAllowed);

      // If the adjusted socket count is different, update the corruption display
      if (adjustedSockets !== currentSockets) {
        console.log(
          `Adjusting sockets from ${currentSockets} to ${adjustedSockets} based on ${baseType} max`
        );
        typeCorruptions.weapon = `Socketed (${adjustedSockets})`;
        localStorage.setItem(
          "typeCorruptions",
          JSON.stringify(typeCorruptions)
        );

        // Need to update the display after the item info is loaded
        setTimeout(() => {
          updateCorruptionDisplay("weapon", `Socketed (${adjustedSockets})`);
          updateSocketCount("weapon", adjustedSockets);
        }, 50);
      } else {
        // Socket count is valid, just update the sockets
        updateSocketCount("weapon", adjustedSockets);
      }
    } else {
      // No socket corruption, use default sockets for the item (0)
      updateSocketCount("weapon", 0);
    }

    // Update weapon description and other displays
    const itemData = itemList[selectedWeapon];
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

function updateSocketCount(section, socketCount) {
  const containerClass =
    section === "weapon" ? "weaponsockets" : `${section}sockets`;
  const container = document.querySelector(`.${containerClass}`);

  if (!container) {
    console.log(`Container not found for ${section}`);
    return;
  }

  // Get the current item
  const dropdownId = `${section}s-dropdown`;
  const dropdown = document.getElementById(dropdownId);
  const currentItem = dropdown.value;

  // Get the base type
  let baseType;
  if (section === "weapon") {
    baseType = getBaseWeaponType(currentItem);
  } else {
    try {
      const itemData = itemList[currentItem];
      baseType = itemData.description.split("<br>")[1].trim();
    } catch (e) {
      console.error("Error getting base type:", e);
      baseType = "";
    }
  }

  // Get the maximum allowed sockets for this base type
  const maxBaseAllowed =
    maxSockets[baseType] !== undefined ? maxSockets[baseType] : 2;

  // If item cannot have sockets, clear container and return
  if (
    maxBaseAllowed === 0 ||
    socketExceptions.noSockets.includes(currentItem)
  ) {
    // Remove any socketed items (clear their data first)
    const sockets = container.querySelectorAll(".socketz");
    sockets.forEach((socket) => {
      if (socket.dataset.itemName) {
        clearSocket(socket, true);
      }
    });

    // Then clear the container
    container.innerHTML = "";
    return;
  }

  // Determine how many sockets to display
  // (requested count or max for this item, whichever is lower)
  const maxAllowedSockets = socketExceptions.maxOneSocket.includes(currentItem)
    ? 1
    : Math.min(socketCount, maxBaseAllowed);

  console.log(
    `[updateSocketCount] Creating ${maxAllowedSockets} sockets for ${currentItem} (${baseType})`
  );

  // Save existing socket data for reuse
  const currentSockets = Array.from(container.querySelectorAll(".socketz"));
  const filledSocketsData = currentSockets
    .filter((socket) => socket.dataset.itemName)
    .slice(0, maxAllowedSockets)
    .map((socket) => ({
      itemName: socket.dataset.itemName,
      stats: socket.dataset.stats,
      html: socket.innerHTML,
    }));

  // Clear and rebuild the socket UI
  container.innerHTML = "";

  for (let i = 0; i < maxAllowedSockets; i++) {
    const socket = document.createElement("div");
    socket.className = "socketz empty";
    socket.dataset.section = section;
    socket.dataset.index = i;

    if (filledSocketsData[i]) {
      socket.className = "socketz filled";
      socket.dataset.itemName = filledSocketsData[i].itemName;
      socket.dataset.stats = filledSocketsData[i].stats;
      socket.innerHTML = filledSocketsData[i].html;
    }

    socket.addEventListener("click", (e) => {
      e.stopPropagation();
      currentSocket = socket;
      showItemModal();
    });

    socket.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      clearSocket(socket);
      refreshSocketProperties();
    });

    container.appendChild(socket);
  }

  refreshSocketProperties();
}

const socketExceptions = {
  noSockets: ["Maiden Javelin"],

  maxOneSocket: ["Pelta Lunata", "Buckler"],
};

function handleSocketCorruption(mod, type, value) {
  if (mod.includes("Socketed")) {
    const socketCount = parseInt(value);
    const section = type.toLowerCase();

    const weaponSelect = document.getElementById("weapons-dropdown");
    const selectedWeapon = weaponSelect?.value;
    const baseType = getBaseWeaponType(selectedWeapon);

    // Completely prevent socketing for items with 0 max sockets
    if (maxSockets[baseType] === 0) {
      return false;
    }

    // For normal items, use existing max socket logic
    const maxAllowed = maxSockets[baseType] || 2;
    const finalSocketCount = Math.min(socketCount, maxAllowed);

    const containerClass =
      section === "weapon" ? "weaponsockets" : `${section}sockets`;
    const container = document.querySelector(`.${containerClass}`);
    if (!container) {
      return false;
    }

    const existingSockets = Array.from(container.querySelectorAll(".socketz"))
      .map((socket) => ({
        itemName: socket.dataset.itemName,
        stats: socket.dataset.stats,
        html: socket.innerHTML,
      }))
      .slice(0, finalSocketCount);

    container.innerHTML = "";

    for (let i = 0; i < finalSocketCount; i++) {
      const socket = document.createElement("div");
      socket.className = "socketz empty";
      socket.dataset.section = section;
      socket.dataset.index = i;

      if (existingSockets[i]) {
        socket.className = "socketz filled";
        socket.dataset.itemName = existingSockets[i].itemName;
        socket.dataset.stats = existingSockets[i].stats;
        socket.innerHTML = existingSockets[i].html;
      }

      socket.addEventListener("click", (e) => {
        e.stopPropagation();
        currentSocket = socket;
        showItemModal();
      });

      socket.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        clearSocket(socket);
        updateAllDisplays();
      });

      container.appendChild(socket);
    }

    return true;
  }
  return true;
}

function clearSocket(socket, force = false) {
  socket.classList.remove("filled");
  socket.classList.add("empty");
  socket.innerHTML = "";
  delete socket.dataset.itemName;
  delete socket.dataset.stats;

  const section = socket.dataset.section;

  // Update stats display
  updateStatsDisplay(section);

  // If this is a weapon, update description and damage
  if (section === "weapon") {
    updateWeaponDescription();
    updateWeaponDamageDisplay();
  }

  // Force a complete stats display refresh
  updateAllStatsDisplays();

  const containerClass =
    section === "weapon" ? "weaponsockets" : `${section}sockets`;
  const statsContainer = document.querySelector(`.${containerClass}`);
  if (statsContainer) {
    statsContainer.innerHTML = "";
  }

  if (section === "weapon") {
    const weaponInfo = document.getElementById("weapon-info");
    if (weaponInfo) {
      const corruptionDiv = weaponInfo.querySelector(".corrupted-mod");
      const corruptedText = weaponInfo.querySelector(".corrupted-text");

      const weaponSelect = document.getElementById("weapons-dropdown");
      const currentItem = weaponSelect.value;
      const itemData = itemList[currentItem];

      if (itemData) {
        const descriptionLines = itemData.description.split("<br>");
        let formattedDescription = descriptionLines
          .map((line) => `<div>${line}</div>`)
          .join("");

        if (corruptionDiv && corruptedText) {
          formattedDescription +=
            corruptionDiv.outerHTML + corruptedText.outerHTML;
        }

        weaponInfo.innerHTML = formattedDescription;
      }
    }
  }

  updateAllStatsDisplays();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".socketz").forEach((socket) => {
    socket.addEventListener("click", (e) => {
      e.stopPropagation();
      currentSocket = socket;
      showItemModal();
    });

    socket.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearSocket(socket);
    });

    const observer = new MutationObserver(() => {
      updateStatsDisplay(socket.dataset.section);
      if (socket.dataset.section === "weapon") {
        updateWeaponDescription();
        updateWeaponDamageDisplay();
      }
    });

    observer.observe(socket, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
});

// document
//   .getElementById("weapons-dropdown")
//   ?.addEventListener("change", (event) => {
//     const selectedWeapon = event.target.value;
//     const baseType = getBaseWeaponType(selectedWeapon);
//     const maxAllowed = maxSockets[baseType] || 2;

//     // Get current socket corruption if any
//     const weaponInfo = document.getElementById("weapon-info");
//     const corruptedMod = weaponInfo?.querySelector(".corrupted-mod");

//     if (corruptedMod && corruptedMod.textContent.includes("Socketed")) {
//       const currentSockets = parseInt(
//         corruptedMod.textContent.match(/\((\d+)\)/)[1]
//       );
//       const adjustedSockets = Math.min(currentSockets, maxAllowed);

//       // Update socket count and visuals
//       updateSocketCount("weapon", adjustedSockets);

//       // Force a complete corruption display update
//       updateCorruptionDisplay("weapon", `Socketed (${adjustedSockets})`);

//       // Update stored corruption
//       typeCorruptions.weapon = `Socketed (${adjustedSockets})`;
//       localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));
//     }
//   });

document.addEventListener("DOMContentLoaded", () => {
  // List of all dropdown IDs
  const dropdowns = [
    "helms-dropdown",
    "armors-dropdown",
    "weapons-dropdown",
    "offs-dropdown",
    "belts-dropdown",
    "gloves-dropdown",
    "boots-dropdown",
    "ringsone-dropdown",
    "ringstwo-dropdown",
    "amulets-dropdown",
  ];

  // Add change event listener to each dropdown
  dropdowns.forEach((dropdownId) => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.addEventListener("change", () => {
        // Update all socket stats after dropdown change
        const sections = ["helm", "armor", "weapon", "shield"];
        sections.forEach((section) => {
          updateSocketInfo(section);
        });
      });
    }
  });

  // Add change event listeners to level and attribute inputs
  const inputs = ["lvlValue", "str", "dex", "vit", "enr"];
  inputs.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener("input", () => {
        const sections = ["helm", "armor", "weapon", "shield"];
        sections.forEach((section) => {
          updateSocketInfo(section);
        });
      });
    }
  });
});

function updateSocketInfo(section) {
  const sockets = document.querySelectorAll(
    `.socketz[data-section="${section}"]`
  );
  const infoContainerId = {
    helm: "helm-info",
    armor: "armor-info",
    weapon: "weapon-info",
    shield: "off-info",
  }[section];

  const infoContainer = document.getElementById(infoContainerId);
  if (!infoContainer) return;

  // Save corruption info
  const corruptedMod = infoContainer.querySelector(".corrupted-mod");
  const corruptedText = infoContainer.querySelector(".corrupted-text");

  // Build combined stats
  const combinedStats = [];
  sockets.forEach((socket) => {
    if (socket.dataset.itemName && socket.dataset.stats) {
      let socketStats = socket.dataset.stats;
      try {
        if (socket.dataset.itemName === "jewel") {
          socketStats = JSON.parse(socket.dataset.stats);
        }
        if (Array.isArray(socketStats)) {
          combinedStats.push(...socketStats);
        } else {
          combinedStats.push(socketStats);
        }
      } catch (e) {
        combinedStats.push(socketStats);
      }
    }
  });

  // Remove existing socket stats
  const existingStats = infoContainer.querySelector(".socket-stats");
  if (existingStats) {
    existingStats.remove();
  }

  // Create new stats container if we have stats
  if (combinedStats.length > 0) {
    const statsContainer = document.createElement("div");
    statsContainer.className = "socket-stats";

    combinedStats.forEach((stat) => {
      const statDiv = document.createElement("div");
      statDiv.textContent = stat;
      statsContainer.appendChild(statDiv);
    });

    // Insert stats before corruption info if it exists
    if (corruptedMod) {
      infoContainer.insertBefore(statsContainer, corruptedMod);
    } else {
      infoContainer.appendChild(statsContainer);
    }
  }

  // Restore corruption info
  if (corruptedMod && !infoContainer.contains(corruptedMod)) {
    infoContainer.appendChild(corruptedMod);
  }
  if (corruptedText && !infoContainer.contains(corruptedText)) {
    infoContainer.appendChild(corruptedText);
  }

  // Update separate stats container
  const separateStatsId = {
    helm: "helmsocketstats",
    weapon: "weaponsocketstats",
    armor: "armorsocketstats",
    shield: "shieldsocketstats",
  }[section];

  const separateStatsContainer = document.getElementById(separateStatsId);
  if (separateStatsContainer) {
    separateStatsContainer.innerHTML = "";

    // Use the merged stats function for the separate container
    const mergedStats = mergeNumericStats(combinedStats);
    mergedStats.forEach((stat) => {
      const statDiv = document.createElement("div");
      statDiv.textContent = stat;
      separateStatsContainer.appendChild(statDiv);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Ensure sockets update when we change items
  [
    "weapons-dropdown",
    "helms-dropdown",
    "armors-dropdown",
    "offs-dropdown",
  ].forEach((id) => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      dropdown.addEventListener("change", () => {
        setTimeout(() => {
          const sectionMap = {
            "weapons-dropdown": "weapon",
            "helms-dropdown": "helm",
            "armors-dropdown": "armor",
            "offs-dropdown": "shield",
          };
          const section = sectionMap[id];
          const isSocketCorruption =
            typeCorruptions[section]?.includes("Socketed");

          if (isSocketCorruption) {
            // If there's a socket corruption, let restoreCorruptions handle it
            restoreCorruptions();
          } else {
            // For uncorrupted items, update socket display to match base type maximum
            updateSocketCount(section, 0);
          }
        }, 50);
      });
    }
  });
});
