// Create this as a new file named "socket-fix.js"
// Then add: <script src="socket-fix.js"></script> before the closing </body> tag in your HTML

(function () {
  // Wait for page to be fully loaded
  window.addEventListener("load", function () {
    console.log("Socket fix script loaded");

    // Give time for all other scripts to initialize
    setTimeout(function () {
      applySocketFix();
    }, 1000);
  });

  function applySocketFix() {
    console.log("Applying socket fix...");

    // Fix for weapons dropdown
    const weaponsDropdown = document.getElementById("weapons-dropdown");
    if (weaponsDropdown) {
      // Create a new change handler that will run after all others
      weaponsDropdown.addEventListener("change", function (event) {
        // We use setTimeout to ensure our handler runs last
        setTimeout(function () {
          console.log("Socket fix running for weapons");
          const selectedWeapon = event.target.value;
          const baseType = getBaseWeaponType(selectedWeapon);

          // Get the maximum allowed sockets for this base item
          const maxAllowed = maxSockets[baseType] || 2;
          console.log(`Base type: ${baseType}, Max sockets: ${maxAllowed}`);

          // Check if we have a socket corruption
          const weaponInfo = document.getElementById("weapon-info");
          const corruptedMod = weaponInfo?.querySelector(".corrupted-mod");

          if (corruptedMod && corruptedMod.textContent.includes("Socketed")) {
            const socketMatch =
              corruptedMod.textContent.match(/Socketed \((\d+)\)/);
            if (socketMatch) {
              const currentSockets = parseInt(socketMatch[1]);
              console.log(`Found socket corruption: ${currentSockets}`);

              // Adjust based on max allowed for this item
              const adjustedSockets = Math.min(currentSockets, maxAllowed);
              console.log(
                `Adjusted sockets: ${adjustedSockets} (max: ${maxAllowed})`
              );

              if (adjustedSockets !== currentSockets) {
                // Update the corruption display and internal state
                typeCorruptions.weapon = `Socketed (${adjustedSockets})`;
                localStorage.setItem(
                  "typeCorruptions",
                  JSON.stringify(typeCorruptions)
                );

                // Force socket display update
                updateSocketCount("weapon", adjustedSockets);
                updateCorruptionDisplay(
                  "weapon",
                  `Socketed (${adjustedSockets})`
                );
              }
            }
          }
        }, 100);
      });
    }

    // Fix for helms dropdown
    const helmsDropdown = document.getElementById("helms-dropdown");
    if (helmsDropdown) {
      helmsDropdown.addEventListener("change", function (event) {
        setTimeout(function () {
          console.log("Socket fix running for helms");
          const selectedHelm = event.target.value;
          // Assuming getItemBaseType exists or using our own implementation
          const baseType = getItemBaseType
            ? getItemBaseType(selectedHelm)
            : selectedHelm.description?.split("<br>")[1].trim();

          // Get the maximum allowed sockets for this base item
          const maxAllowed = maxSockets[baseType] || 2;

          // Check if we have a socket corruption
          const helmInfo = document.getElementById("helm-info");
          const corruptedMod = helmInfo?.querySelector(".corrupted-mod");

          if (corruptedMod && corruptedMod.textContent.includes("Socketed")) {
            const socketMatch =
              corruptedMod.textContent.match(/Socketed \((\d+)\)/);
            if (socketMatch) {
              const currentSockets = parseInt(socketMatch[1]);

              // Adjust based on max allowed for this item
              const adjustedSockets = Math.min(currentSockets, maxAllowed);

              if (adjustedSockets !== currentSockets) {
                // Update the corruption display and internal state
                typeCorruptions.helm = `Socketed (${adjustedSockets})`;
                localStorage.setItem(
                  "typeCorruptions",
                  JSON.stringify(typeCorruptions)
                );

                // Force socket display update
                updateSocketCount("helm", adjustedSockets);
                updateCorruptionDisplay(
                  "helm",
                  `Socketed (${adjustedSockets})`
                );
              }
            }
          }
        }, 100);
      });
    }

    // Fix for armors dropdown
    const armorsDropdown = document.getElementById("armors-dropdown");
    if (armorsDropdown) {
      armorsDropdown.addEventListener("change", function (event) {
        setTimeout(function () {
          console.log("Socket fix running for armors");
          const selectedArmor = event.target.value;
          // Assuming getItemBaseType exists or using our own implementation
          const baseType = getItemBaseType
            ? getItemBaseType(selectedArmor)
            : selectedArmor.description?.split("<br>")[1].trim();

          // Get the maximum allowed sockets for this base item
          const maxAllowed = maxSockets[baseType] || 2;

          // Check if we have a socket corruption
          const armorInfo = document.getElementById("armor-info");
          const corruptedMod = armorInfo?.querySelector(".corrupted-mod");

          if (corruptedMod && corruptedMod.textContent.includes("Socketed")) {
            const socketMatch =
              corruptedMod.textContent.match(/Socketed \((\d+)\)/);
            if (socketMatch) {
              const currentSockets = parseInt(socketMatch[1]);

              // Adjust based on max allowed for this item
              const adjustedSockets = Math.min(currentSockets, maxAllowed);

              if (adjustedSockets !== currentSockets) {
                // Update the corruption display and internal state
                typeCorruptions.armor = `Socketed (${adjustedSockets})`;
                localStorage.setItem(
                  "typeCorruptions",
                  JSON.stringify(typeCorruptions)
                );

                // Force socket display update
                updateSocketCount("armor", adjustedSockets);
                updateCorruptionDisplay(
                  "armor",
                  `Socketed (${adjustedSockets})`
                );
              }
            }
          }
        }, 100);
      });
    }

    console.log("Socket fix applied!");
  }

  // Helper function in case getItemBaseType isn't available
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
})();
