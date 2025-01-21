// itemUpgrade.js

const upgradeDefinitions = {
  helms: {
    "Biggin's Bonnet": {
      exceptional: {
        name: "Biggin's Bonnet",
        base: "War Hat",
        properties: {
          defense: 108,
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
  },
};

function handleUpgrade() {
  const select = document.getElementById("helms-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.helms[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) {
    alert("This item cannot be upgraded");
    return;
  }

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;

  // Get current item properties
  const currentProperties = currentItemData.properties;

  // Check if item is already elite version
  if (currentProperties.defense === upgrades.elite.properties.defense) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  function buildDescription(itemName, baseType, properties, magicalProps) {
    return `${itemName}\n${baseType}\nDefense: ${properties.defense}\nRequired Strength: ${properties.reqstr}\nRequired Level: ${properties.reqlvl}${magicalProps}`;
  }

  // Extract magical properties by removing the base item info
  const magicalProperties = currentItemData.description
    .split("<br>")
    .slice(3)
    .join("<br>");

  // Check if item is exceptional version
  if (currentProperties.defense === upgrades.exceptional.properties.defense) {
    // Try elite upgrade
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= upgrades.elite.properties.reqstr
    ) {
      // Update item properties while preserving all original magical properties
      itemList[currentItem] = {
        description: buildDescription(
          currentItem,
          upgrades.elite.base,
          upgrades.elite.properties,
          "<br>" + magicalProperties
        ),
        properties: {
          ...currentProperties,
          ...upgrades.elite.properties,
        },
      };

      select.dispatchEvent(new Event("change"));
      alert("Item upgraded to elite version!");
      return;
    }
  } else {
    // Try exceptional upgrade
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= upgrades.exceptional.properties.reqstr
    ) {
      // Update item properties while preserving all original magical properties
      itemList[currentItem] = {
        description: buildDescription(
          currentItem,
          upgrades.exceptional.base,
          upgrades.exceptional.properties,
          "<br>" + magicalProperties
        ),
        properties: {
          ...currentProperties,
          ...upgrades.exceptional.properties,
        },
      };

      select.dispatchEvent(new Event("change"));
      alert("Item upgraded to exceptional version!");
      return;
    }
  }

  alert("Character does not meet requirements for upgrade");
}

// Add button when document loads
// document.addEventListener("DOMContentLoaded", () => {
//   const helmsDropdown = document.getElementById("helms-dropdown");
//   const upgradeButton = document.createElement("button");
//   upgradeButton.textContent = "Upgrade Item";
//   upgradeButton.onclick = handleUpgrade;
//   if (helmsDropdown) {
//     helmsDropdown.parentNode.insertBefore(
//       upgradeButton,
//       helmsDropdown.nextSibling
//     );
//   }
// });

function buildDescription(itemName, baseType, properties, magicalProps) {
  return [
    `${itemName}`,
    `${baseType}`, // Show base type on its own line
    `Defense: ${properties.defense}`,
    `Required Strength: ${properties.reqstr}`,
    `Required Level: ${properties.reqlvl}`,
    // Filter out any old requirements from magical properties
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

function handleUpgrade() {
  const select = document.getElementById("helms-dropdown");
  const currentItem = select.value;
  const upgrades = upgradeDefinitions.helms[currentItem];
  const currentItemData = itemList[currentItem];

  if (!upgrades) {
    alert("This item cannot be upgraded");
    return;
  }

  const level = parseInt(document.getElementById("lvlValue").value) || 0;
  const str = parseInt(document.getElementById("str").value) || 0;

  // Get current item properties
  const currentProperties = currentItemData.properties;

  // Check if item is already elite version
  if (currentProperties.defense === upgrades.elite.properties.defense) {
    alert("Item is already at maximum upgrade level");
    return;
  }

  // Extract magical properties, filtering out the header information
  const magicalProperties = currentItemData.description
    .split("<br>")
    .slice(3)
    .filter((prop) => !prop.includes("Required") && !prop.includes("Defense:"))
    .join("<br>");

  // Check if item is exceptional version
  if (currentProperties.defense === upgrades.exceptional.properties.defense) {
    // Try elite upgrade
    if (
      level >= upgrades.elite.properties.reqlvl &&
      str >= upgrades.elite.properties.reqstr
    ) {
      itemList[currentItem] = {
        description: buildDescription(
          currentItem,
          upgrades.elite.base,
          upgrades.elite.properties,
          magicalProperties
        ),
        properties: {
          ...currentProperties,
          ...upgrades.elite.properties,
        },
      };

      select.dispatchEvent(new Event("change"));
      alert("Item upgraded to elite version!");
      return;
    }
  } else {
    // Try exceptional upgrade
    if (
      level >= upgrades.exceptional.properties.reqlvl &&
      str >= upgrades.exceptional.properties.reqstr
    ) {
      itemList[currentItem] = {
        description: buildDescription(
          currentItem,
          upgrades.exceptional.base,
          upgrades.exceptional.properties,
          magicalProperties
        ),
        properties: {
          ...currentProperties,
          ...upgrades.exceptional.properties,
        },
      };

      select.dispatchEvent(new Event("change"));
      alert("Item upgraded to exceptional version!");
      return;
    }
  }

  alert("Character does not meet requirements for upgrade");
}
