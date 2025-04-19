// customCraftItems.js - Fixed version for displaying custom craft items

// Establish connection with the server
let serverConnection = null;
let currentUser = null;

// Initialize the custom craft items system
document.addEventListener("DOMContentLoaded", () => {
  // Check login status
  checkUserLoginStatus();

  // Listen for login events
  document.addEventListener("userLoggedIn", (event) => {
    currentUser = event.detail.userId;
    initializeCustomCraftSystem();
    setupCustomCraftUI();
  });

  // Listen for logout events
  document.addEventListener("userLoggedOut", () => {
    currentUser = null;
    hideCustomCraftUI();
  });
});

// Check if the user is logged in
function checkUserLoginStatus() {
  const token = localStorage.getItem("token");
  if (token) {
    // Verify token with server
    fetch("http://localhost:3001/verify-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          const loginEvent = new CustomEvent("userLoggedIn", {
            detail: {
              userId: data.userId,
              username: data.username,
            },
          });
          document.dispatchEvent(loginEvent);
        } else {
          // Token invalid, treat as logged out
          localStorage.removeItem("token");
          const logoutEvent = new CustomEvent("userLoggedOut");
          document.dispatchEvent(logoutEvent);
        }
      })
      .catch((error) => {
        console.error("Token verification error:", error);
        // On error, consider user logged out
        hideCustomCraftUI();
      });
  } else {
    // No token, definitely logged out
    const logoutEvent = new CustomEvent("userLoggedOut");
    document.dispatchEvent(logoutEvent);
  }
}

// Initialize the custom craft system
function initializeCustomCraftSystem() {
  console.log("Initializing custom craft system");
  // Load user's custom craft items
  loadCustomCraftItems();
  // Setup custom craft UI
  setupCustomCraftUI();
}

// Load custom items from the server and add to dropdowns
function loadCustomCraftItems() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found, user not logged in");
    return;
  }

  console.log("Loading custom craft items from server");

  fetch("http://localhost:3001/api/custom-crafts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(`Loaded ${data.items.length} custom items`);
        addCustomItemsToDropdowns(data.items);
      } else {
        console.error("Failed to load custom items:", data);
      }
    })
    .catch((error) => {
      console.error("Error loading custom craft items:", error);
    });
}

// Add custom items to the dropdowns
function addCustomItemsToDropdowns(items) {
  if (!items || items.length === 0) return;

  // Group items by type
  const groupedItems = {
    weapon: [],
    armor: [],
    helm: [],
    shield: [],
  };

  items.forEach((item) => {
    if (groupedItems[item.itemType]) {
      groupedItems[item.itemType].push(item);
    }
  });

  // Map item types to dropdown IDs
  const dropdownIds = {
    weapon: "weapons-dropdown",
    armor: "armors-dropdown",
    helm: "helms-dropdown",
    shield: "offs-dropdown",
  };

  // Add items to each dropdown
  Object.keys(groupedItems).forEach((type) => {
    const items = groupedItems[type];
    if (items.length === 0) return;

    const dropdownId = dropdownIds[type];
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown) {
      console.error(`Dropdown not found: ${dropdownId}`);
      return;
    }

    // Find or create the optgroup
    let optgroup = dropdown.querySelector(
      'optgroup[label="Custom Crafted Items"]'
    );
    if (!optgroup) {
      optgroup = document.createElement("optgroup");
      optgroup.label = "Custom Crafted Items";
      dropdown.appendChild(optgroup);
    } else {
      // Clear existing options to avoid duplicates
      while (optgroup.firstChild) {
        optgroup.removeChild(optgroup.firstChild);
      }
    }

    // Add items to the optgroup
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item._id;
      option.textContent = item.itemName;
      option.dataset.custom = "true";
      option.dataset.craftType = item.craftType;
      option.dataset.itemType = item.itemType;
      optgroup.appendChild(option);
    });

    console.log(`Added ${items.length} custom ${type} items to ${dropdownId}`);
  });

  // Setup event handlers for showing custom items in info divs
  setupDropdownEventHandlers();
}

// Set up event handlers for the dropdowns
function setupDropdownEventHandlers() {
  // Map dropdown IDs to info div IDs
  const dropdownInfoMap = {
    "weapons-dropdown": "weapon-info",
    "armors-dropdown": "armor-info",
    "helms-dropdown": "helm-info",
    "offs-dropdown": "off-info",
    "gloves-dropdown": "glove-info",
    "boots-dropdown": "boot-info",
    "belts-dropdown": "belt-info",
    "ringsone-dropdown": "ringsone-info",
    "ringstwo-dropdown": "ringstwo-info",
    "amulets-dropdown": "amulet-info",
  };

  // Add change event handler to each dropdown
  Object.entries(dropdownInfoMap).forEach(([dropdownId, infoDivId]) => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
      console.error(`Dropdown not found: ${dropdownId}`);
      return;
    }

    // Add change event handler without removing existing handlers
    dropdown.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      if (!selectedOption) return;

      // If this is a custom item, handle it
      if (selectedOption.dataset && selectedOption.dataset.custom === "true") {
        const infoDiv = document.getElementById(infoDivId);
        if (!infoDiv) {
          console.error(`Info div not found: ${infoDivId}`);
          return;
        }

        // Fetch and display custom item data
        fetch(
          `http://localhost:3001/api/custom-crafts/${selectedOption.value}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.success && data.item) {
              displayCustomItemInfo(data.item, infoDiv);
            } else {
              console.error("Failed to load custom item", data);
              infoDiv.innerHTML = "Error loading custom item data";
            }
          })
          .catch((error) => {
            console.error("Error fetching custom item:", error);
            infoDiv.innerHTML = "Error loading item details";
          });
      }
    });

    console.log(`Added custom item handler to ${dropdownId}`);
  });
}

// Display custom item info in the info div
function displayCustomItemInfo(item, infoDiv) {
  // Format the HTML for display
  let html = `
  <div style="color: #${getCraftTypeColor(item.craftType)};">
    <strong>${item.itemName}</strong>
  </div>
  <div>${item.baseType}</div>`;

  // Add strength requirement if available
  if (getStrengthRequirement(item.baseType) > 0) {
    html += `<div>Required Strength: ${getStrengthRequirement(
      item.baseType
    )}</div>`;
  }

  html += `<hr style="border-color: #666; margin: 5px 0;">`;

  // Add base properties
  const baseProps = item.affixes.filter((affix) => affix.type === "base");
  baseProps.forEach((prop) => {
    html += `<div>${formatCustomItemProperty(prop)}</div>`;
  });

  // Add prefixes
  const prefixes = item.affixes.filter((affix) => affix.type === "prefix");
  prefixes.forEach((prefix) => {
    html += `<div>${formatCustomItemProperty(prefix)}</div>`;
  });

  // Add suffixes
  const suffixes = item.affixes.filter((affix) => affix.type === "suffix");
  suffixes.forEach((suffix) => {
    html += `<div>${formatCustomItemProperty(suffix)}</div>`;
  });

  // Update the info div
  infoDiv.innerHTML = html;
  console.log(`Updated info div for ${item.itemName}`);
}

// Helper function to get the strength requirement for a base item
function getStrengthRequirement(baseItemName) {
  // Look through all categories
  for (const category in baseItems) {
    const item = baseItems[category].find((item) => item.name === baseItemName);
    if (item && item.strengthReq !== undefined) {
      return item.strengthReq;
    }
  }
  return 0; // Default to 0 if not found
}

// Update the item preview function to show strength requirements
function updateItemPreview() {
  const previewContainer = document.getElementById("item-preview");
  if (!previewContainer) return;

  const itemType = document.getElementById("item-type").value;
  const baseItem = document.getElementById("base-item").value;
  const craftType = document.getElementById("craft-type").value;
  const itemName =
    document.getElementById("item-name").value || `${craftType} ${baseItem}`;

  // Start building preview HTML
  let html = `<div style="color: #${getCraftTypeColor(
    craftType
  )};">${itemName}</div>`;
  html += `<div>${baseItem}</div>`;

  // Add strength requirement
  const strengthReq = getStrengthRequirement(baseItem);
  if (strengthReq > 0) {
    html += `<div>Required Strength: ${strengthReq}</div>`;
  }

  html += '<div style="margin-top: 10px;">';

  // Add base properties
  const basePropsSliders = document.querySelectorAll(".base-prop-slider");
  basePropsSliders.forEach((slider) => {
    const propName = slider.dataset.name;
    const propType = slider.dataset.type;
    const propValue = slider.value;

    if (propType === "percentage") {
      html += `<div>${propValue}% ${propName}</div>`;
    } else if (propName.includes("to All Skills")) {
      html += `<div>+${propValue} ${propName}</div>`;
    } else {
      html += `<div>+${propValue} ${propName}</div>`;
    }
  });

  // Add additional affixes
  const affixRows = document.querySelectorAll(".affix-row");
  let prefixCount = 0;
  let suffixCount = 0;

  affixRows.forEach((row) => {
    const affixType = row.querySelector(".affix-type").value;
    const affixSelect = row.querySelector(".affix-select");
    const affixValue = row.querySelector(".affix-value").value;

    if (affixSelect.selectedIndex === -1) return;

    const affixData = JSON.parse(
      affixSelect.options[affixSelect.selectedIndex].dataset.affixData || "{}"
    );

    // Skip counting if it's an automod
    if (!affixData.automod) {
      if (affixType === "prefix") {
        prefixCount++;
        if (prefixCount > 3) return; // Max 3 prefixes
      } else {
        suffixCount++;
        if (suffixCount > 3) return; // Max 3 suffixes
      }
    }

    // Format the display of the affix
    if (
      affixData.stat &&
      (affixData.stat.includes("Enhanced Damage") ||
        affixData.stat.includes("Deadly Strike") ||
        affixData.stat.includes("Rate") ||
        affixData.stat.includes("Find") ||
        affixData.stat.includes("Stolen") ||
        affixData.stat.includes("Resistances"))
    ) {
      html += `<div>${affixValue}% ${affixData.stat}</div>`;
    } else {
      html += `<div>+${affixValue} ${affixData.stat}</div>`;
    }
  });

  html += "</div>";

  // Update preview
  previewContainer.innerHTML = html;
}

// Format a custom item property for display
function formatCustomItemProperty(prop) {
  if (!prop) return "Unknown property";

  // Percentage-based properties
  if (
    (prop.stat &&
      (prop.stat.includes("Enhanced Damage") ||
        prop.stat.includes("Rate") ||
        prop.stat.includes("Deadly Strike") ||
        prop.stat.includes("Find") ||
        prop.stat.includes("Stolen") ||
        prop.stat.includes("Resistances"))) ||
    (prop.name &&
      (prop.name.includes("Deadly Strike") ||
        prop.name.includes("Stolen per Hit") ||
        prop.name.includes("Rate") ||
        prop.name.includes("Find") ||
        prop.name.includes("Resistances")))
  ) {
    // Use either stat or name depending on which one is present
    const displayName = prop.stat || prop.name;

    // Special handling for certain properties (adding + sign)
    if (
      displayName.includes("Gold") ||
      displayName.includes("Rate") ||
      displayName.includes("Better Chance")
    ) {
      return `+${prop.value || 0}% ${displayName}`;
    } else {
      // Regular percentage display for other properties
      return `${prop.value || 0}% ${displayName}`;
    }
  } else if (prop.name && prop.name.includes("to All Skills")) {
    return `+${prop.value || 0} ${prop.name}`;
  } else if (prop.name && prop.name.includes("Replenish Life")) {
    return `${prop.name || 0} +${prop.value}`;
  }

  // Default flat value properties
  else {
    return `+${prop.value || 0} ${prop.stat || prop.name || "Unknown"}`;
  }
}

// Get color for craft type display
function getCraftTypeColor(craftType) {
  switch (craftType) {
    case "Blood":
      return "e74c3c";
    case "Caster":
      return "3498db";
    case "Hitpower":
      return "f39c12";
    case "Safety":
      return "27ae60";
    case "Vampiric":
      return "8e44ad";
    case "Bountiful":
      return "f1c40f";
    case "Brilliant":
      return "1abc9c";
    default:
      return "ffffff";
  }
}

// Load custom item data when selected
function loadCustomItemData(itemId) {
  fetch(`http://localhost:3001/api/custom-crafts/${itemId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update the item display with the custom item data
        updateItemDisplay(data.item);
      }
    })
    .catch((error) => {
      console.error("Error loading custom item data:", error);
    });
}

// Update the item display with custom item data
function updateItemDisplay(item) {
  // Find the item display element
  const itemDisplay = document.getElementById("item-display");
  if (!itemDisplay) return;

  // Create HTML for the item description
  let html = `<div class="item-name">${item.itemName}</div>`;
  html += `<div class="item-type">${item.baseType}</div>`;

  // Add properties
  html += '<div class="item-properties">';

  // Add base properties from the craft type
  item.affixes.forEach((affix) => {
    if (affix.type === "base") {
      // Format based on property type
      if (
        affix.name.includes("Enhanced Damage") ||
        affix.name.includes("Rate") ||
        affix.name.includes("Deadly Strike")
      ) {
        html += `<div class="property">${affix.value}% ${affix.name}</div>`;
      } else if (affix.name.includes("to All Skills")) {
        html += `<div class="property">+${affix.value} ${affix.name}</div>`;
      } else {
        html += `<div class="property">+${affix.value} ${affix.name}</div>`;
      }
    }
  });

  // Add additional affixes
  const prefixes = item.affixes.filter((affix) => affix.type === "prefix");
  const suffixes = item.affixes.filter((affix) => affix.type === "suffix");

  prefixes.forEach((prefix) => {
    html += `<div class="property">${formatAffixProperty(prefix)}</div>`;
  });

  suffixes.forEach((suffix) => {
    html += `<div class="property">${formatAffixProperty(suffix)}</div>`;
  });

  html += "</div>";

  // Update the display
  itemDisplay.innerHTML = html;

  // Update item color based on craft type
  updateItemColor(item.craftType);
}

// Format an affix property for display
function formatAffixProperty(affix) {
  // Format based on property type
  if (
    affix.stat.includes("Enhanced Damage") ||
    affix.stat.includes("Deadly Strike") ||
    affix.stat.includes("Rate") ||
    affix.stat.includes("Find") ||
    affix.stat.includes("Resistances")
  ) {
    return `${affix.value}% ${affix.stat}`;
  } else {
    return `+${affix.value} ${affix.stat}`;
  }
}

// Update the item color based on craft type
function updateItemColor(craftType) {
  const itemDisplay = document.getElementById("item-display");
  if (!itemDisplay) return;

  // Set color based on craft type
  switch (craftType) {
    case "Blood":
      itemDisplay.style.color = "#e74c3c";
      break;
    case "Caster":
      itemDisplay.style.color = "#3498db";
      break;
    case "Hitpower":
      itemDisplay.style.color = "#f39c12";
      break;
    case "Safety":
      itemDisplay.style.color = "#27ae60";
      break;
    case "Vampiric":
      itemDisplay.style.color = "#8e44ad";
      break;
    case "Bountiful":
      itemDisplay.style.color = "#f1c40f";
      break;
    case "Brilliant":
      itemDisplay.style.color = "#1abc9c";
      break;
    default:
      itemDisplay.style.color = "#ffffff";
  }
}

// Setup UI components for custom crafting
function setupCustomCraftUI() {
  // Check if the button already exists
  const existingButton = document.getElementById("create-craft-button");
  if (existingButton) {
    existingButton.parentElement.style.display = "block";
    return;
  }
  // Create button container
  const container = document.createElement("div");
  container.id = "create-craft-container";
  container.style.position = "fixed";
  container.style.bottom = "80px";
  container.style.right = "20px";
  container.style.zIndex = "2"; // Lower z-index to avoid conflicts

  // Create button
  const button = document.createElement("button");
  button.id = "create-craft-button";
  button.textContent = "Create Custom Item";
  button.style.padding = "10px 15px";
  button.style.backgroundColor = "#e74c3c";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

  // Add event listener
  button.addEventListener("click", openCraftModal);

  // Add to container
  container.appendChild(button);

  // Add to document
  document.body.appendChild(container);

  // Create the craft modal if it doesn't exist
  if (!document.getElementById("craft-modal")) {
    createCraftModal();
  }
}

// Hide custom craft UI components
function hideCustomCraftUI() {
  const container = document.getElementById("create-craft-container");
  if (container) {
    container.style.display = "none";
  }
}

// Open the craft modal
function openCraftModal() {
  const modal = document.getElementById("craft-modal");
  if (modal) {
    // Close any existing modals to prevent conflicts
    document
      .querySelectorAll(".modalz:not(.hidden)")
      .forEach((existingModal) => {
        existingModal.classList.add("hidden");
        existingModal.style.display = "none";
      });

    modal.style.display = "block";

    // Reset form fields
    resetCraftForm();

    // Update initial preview
    updateItemPreview();
  }
}

// Create the crafting modal
function createCraftModal() {
  // Create modal container
  const modal = document.createElement("div");
  modal.id = "craft-modal";
  modal.className = "modalcraft"; // Use your existing CSS class
  modal.style.display = "none";

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "modalcraft-content"; // Use your existing CSS class

  // Create close button
  const closeButton = document.createElement("span");
  closeButton.className = "close";
  closeButton.innerHTML = "&times;";

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Create title
  const title = document.createElement("h2");
  title.textContent = "Create Custom Craft Item";
  title.style.marginTop = "0";

  // Create form
  const form = document.createElement("form");
  form.id = "craft-form";

  // Item Type Selection
  const itemTypeDiv = document.createElement("div");
  itemTypeDiv.className = "form-group";

  const itemTypeLabel = document.createElement("label");
  itemTypeLabel.htmlFor = "item-type";
  itemTypeLabel.textContent = "Item Type:";

  const itemTypeSelect = document.createElement("select");
  itemTypeSelect.id = "item-type";
  itemTypeSelect.style.width = "100%";
  itemTypeSelect.style.padding = "8px";
  itemTypeSelect.style.backgroundColor = "#333";
  itemTypeSelect.style.color = "#eee";
  itemTypeSelect.style.border = "1px solid #555";
  itemTypeSelect.style.borderRadius = "4px";

  // Add options
  const itemTypes = ["weapon", "armor", "helm", "shield"];
  itemTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    itemTypeSelect.appendChild(option);
  });

  itemTypeDiv.appendChild(itemTypeLabel);
  itemTypeDiv.appendChild(itemTypeSelect);

  // Base Item Selection
  const baseItemDiv = document.createElement("div");
  baseItemDiv.className = "form-group";

  const baseItemLabel = document.createElement("label");
  baseItemLabel.htmlFor = "base-item";
  baseItemLabel.textContent = "Base Item:";

  const baseItemSelect = document.createElement("select");
  baseItemSelect.id = "base-item";
  baseItemSelect.style.width = "100%";
  baseItemSelect.style.padding = "8px";
  baseItemSelect.style.backgroundColor = "#333";
  baseItemSelect.style.color = "#eee";
  baseItemSelect.style.border = "1px solid #555";
  baseItemSelect.style.borderRadius = "4px";

  baseItemDiv.appendChild(baseItemLabel);
  baseItemDiv.appendChild(baseItemSelect);

  // Craft Type Selection
  const craftTypeDiv = document.createElement("div");
  craftTypeDiv.className = "form-group";

  const craftTypeLabel = document.createElement("label");
  craftTypeLabel.htmlFor = "craft-type";
  craftTypeLabel.textContent = "Craft Type:";

  const craftTypeSelect = document.createElement("select");
  craftTypeSelect.id = "craft-type";
  craftTypeSelect.style.width = "100%";
  craftTypeSelect.style.padding = "8px";
  craftTypeSelect.style.backgroundColor = "#333";
  craftTypeSelect.style.color = "#eee";
  craftTypeSelect.style.border = "1px solid #555";
  craftTypeSelect.style.borderRadius = "4px";

  craftTypeDiv.appendChild(craftTypeLabel);
  craftTypeDiv.appendChild(craftTypeSelect);

  // Base Properties Section
  const basePropsDiv = document.createElement("div");
  basePropsDiv.className = "form-group";

  const basePropsTitle = document.createElement("h3");
  basePropsTitle.textContent = "Base Properties:";
  basePropsTitle.style.marginBottom = "10px";

  const basePropsContainer = document.createElement("div");
  basePropsContainer.id = "base-properties";

  basePropsDiv.appendChild(basePropsTitle);
  basePropsDiv.appendChild(basePropsContainer);

  // Additional Affixes Section
  const affixesDiv = document.createElement("div");
  affixesDiv.className = "form-group";

  const affixesTitle = document.createElement("h3");
  affixesTitle.textContent = "Additional Affixes:";
  affixesTitle.style.marginBottom = "10px";

  const addAffixButton = document.createElement("button");
  addAffixButton.type = "button";
  addAffixButton.id = "add-affix-button";
  addAffixButton.textContent = "Add Affix";
  addAffixButton.style.padding = "5px 10px";
  addAffixButton.style.backgroundColor = "#4CAF50";
  addAffixButton.style.color = "white";
  addAffixButton.style.border = "none";
  addAffixButton.style.borderRadius = "4px";
  addAffixButton.style.cursor = "pointer";
  addAffixButton.style.marginBottom = "10px";

  const affixesContainer = document.createElement("div");
  affixesContainer.id = "additional-affixes";

  affixesDiv.appendChild(affixesTitle);
  affixesDiv.appendChild(addAffixButton);
  affixesDiv.appendChild(affixesContainer);

  // Item Name
  const nameDiv = document.createElement("div");
  nameDiv.className = "form-group";

  const nameLabel = document.createElement("label");
  nameLabel.htmlFor = "item-name";
  nameLabel.textContent = "Item Name:";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "item-name";
  nameInput.placeholder = "Enter custom item name";
  nameInput.style.width = "100%";
  nameInput.style.padding = "8px";
  nameInput.style.backgroundColor = "#333";
  nameInput.style.color = "#eee";
  nameInput.style.border = "1px solid #555";
  nameInput.style.borderRadius = "4px";

  nameDiv.appendChild(nameLabel);
  nameDiv.appendChild(nameInput);

  // Preview Section
  const previewDiv = document.createElement("div");
  previewDiv.className = "form-group";

  const previewTitle = document.createElement("h3");
  previewTitle.textContent = "Item Preview:";
  previewTitle.style.marginBottom = "10px";

  const previewContainer = document.createElement("div");
  previewContainer.id = "item-preview";

  previewDiv.appendChild(previewTitle);
  previewDiv.appendChild(previewContainer);

  // Create button
  const createButton = document.createElement("button");
  createButton.type = "button";
  createButton.id = "submit-craft";
  createButton.textContent = "Create Custom Item";
  createButton.style.padding = "10px 15px";
  createButton.style.backgroundColor = "#3498db";
  createButton.style.color = "white";
  createButton.style.border = "none";
  createButton.style.borderRadius = "5px";
  createButton.style.cursor = "pointer";
  createButton.style.width = "100%";
  createButton.style.marginTop = "20px";

  // Add form groups to form
  form.appendChild(itemTypeDiv);
  form.appendChild(baseItemDiv);
  form.appendChild(craftTypeDiv);
  form.appendChild(basePropsDiv);
  form.appendChild(affixesDiv);
  form.appendChild(nameDiv);
  form.appendChild(previewDiv);
  form.appendChild(createButton);

  // Add form to modal content
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(form);

  // Add modal content to modal
  modal.appendChild(modalContent);

  // Add modal to document
  document.body.appendChild(modal);

  // Event listeners
  itemTypeSelect.addEventListener("change", () => {
    populateBaseItems(itemTypeSelect.value);
    populateCraftTypes(itemTypeSelect.value);
    updateItemPreview();
  });

  baseItemSelect.addEventListener("change", () => {
    updateItemPreview();
  });

  craftTypeSelect.addEventListener("change", () => {
    updateBaseProperties(itemTypeSelect.value, craftTypeSelect.value);
    updateItemPreview();
  });

  addAffixButton.addEventListener("click", () => {
    addAffixToForm(itemTypeSelect.value);
  });

  nameInput.addEventListener("input", () => {
    updateItemPreview();
  });

  createButton.addEventListener("click", () => {
    createCustomItem();
  });

  // Add event handler to close craft modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  populateBaseItems("weapon");
  populateCraftTypes("weapon");
  updateBaseProperties("weapon", "Blood");
}

// Populate base items select based on item type
function populateBaseItems(itemType) {
  const baseItemSelect = document.getElementById("base-item");
  baseItemSelect.innerHTML = "";

  if (baseItems[itemType]) {
    baseItems[itemType].forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      baseItemSelect.appendChild(option);
    });
  }
}

// Populate craft types select based on item type
function populateCraftTypes(itemType) {
  const craftTypeSelect = document.getElementById("craft-type");
  craftTypeSelect.innerHTML = "";

  // Add item-specific craft types
  if (craftDefinitions[itemType]) {
    Object.values(craftDefinitions[itemType]).forEach((craftType) => {
      const option = document.createElement("option");
      option.value = craftType.name;
      option.textContent = craftType.name;
      craftTypeSelect.appendChild(option);
    });
  }

  // Add general craft types
  if (craftDefinitions.all) {
    Object.values(craftDefinitions.all).forEach((craftType) => {
      const option = document.createElement("option");
      option.value = craftType.name;
      option.textContent = craftType.name;
      craftTypeSelect.appendChild(option);
    });
  }

  // Update base properties after populating
  updateBaseProperties(itemType, craftTypeSelect.value);
}

// Update base properties based on item type and craft type
function updateBaseProperties(itemType, craftType) {
  const basePropsContainer = document.getElementById("base-properties");
  basePropsContainer.innerHTML = "";

  let craftTypeDefinition = null;

  // Check if it's an item-specific craft type
  if (craftDefinitions[itemType] && craftDefinitions[itemType][craftType]) {
    craftTypeDefinition = craftDefinitions[itemType][craftType];
  }
  // Otherwise check if it's a general craft type
  else if (craftDefinitions.all && craftDefinitions.all[craftType]) {
    craftTypeDefinition = craftDefinitions.all[craftType];
  }

  if (craftTypeDefinition) {
    craftTypeDefinition.baseProperties.forEach((prop, index) => {
      const propDiv = document.createElement("div");
      propDiv.className = "property-row";
      propDiv.style.display = "flex";
      propDiv.style.alignItems = "center";
      propDiv.style.marginBottom = "10px";

      const propName = document.createElement("span");
      propName.style.flex = "1";

      if (prop.type === "percentage") {
        propName.textContent = `${prop.name}: `;
      } else {
        propName.textContent = `+${prop.name}: `;
      }

      const propSlider = document.createElement("input");
      propSlider.type = "range";
      propSlider.min = prop.min;
      propSlider.max = prop.max;
      propSlider.value = Math.floor((prop.min + prop.max) / 2); // Default to middle value
      propSlider.className = "base-prop-slider";
      propSlider.dataset.index = index;
      propSlider.dataset.name = prop.name;
      propSlider.dataset.type = prop.type;
      propSlider.style.flex = "1";
      propSlider.style.marginRight = "10px";

      const propValue = document.createElement("span");
      propValue.className = "prop-value";
      propValue.textContent = propSlider.value;
      if (prop.type === "percentage") {
        propValue.textContent += "%";
      }
      propValue.style.width = "40px";
      propValue.style.textAlign = "right";

      propSlider.addEventListener("input", () => {
        propValue.textContent = propSlider.value;
        if (prop.type === "percentage") {
          propValue.textContent += "%";
        }
        updateItemPreview();
      });

      propDiv.appendChild(propName);
      propDiv.appendChild(propSlider);
      propDiv.appendChild(propValue);

      basePropsContainer.appendChild(propDiv);
    });
  }
}

// Add an affix field to the form
function addAffixToForm(itemType) {
  const affixesContainer = document.getElementById("additional-affixes");
  const affixCount = affixesContainer.childElementCount;

  // Limit to 6 affixes total (including automods)
  if (affixCount >= 4) {
    alert("Maximum of 6 affixes allowed (including automods)");
    return;
  }

  // Create affix row
  const affixRow = document.createElement("div");
  affixRow.className = "affix-row";
  affixRow.style.display = "flex";
  affixRow.style.alignItems = "center";
  affixRow.style.marginBottom = "10px";

  // Create affix type select
  const affixTypeSelect = document.createElement("select");
  affixTypeSelect.className = "affix-type";
  affixTypeSelect.style.flex = "0 0 100px";
  affixTypeSelect.style.marginRight = "10px";
  affixTypeSelect.style.padding = "5px";
  affixTypeSelect.style.backgroundColor = "#333";
  affixTypeSelect.style.color = "#eee";
  affixTypeSelect.style.border = "1px solid #555";
  affixTypeSelect.style.borderRadius = "4px";

  // Add prefix/suffix options
  const prefixOption = document.createElement("option");
  prefixOption.value = "prefix";
  prefixOption.textContent = "Prefix";
  affixTypeSelect.appendChild(prefixOption);

  const suffixOption = document.createElement("option");
  suffixOption.value = "suffix";
  suffixOption.textContent = "Suffix";
  affixTypeSelect.appendChild(suffixOption);

  // Create affix select
  const affixSelect = document.createElement("select");
  affixSelect.className = "affix-select";
  affixSelect.style.flex = "1";
  affixSelect.style.marginRight = "10px";
  affixSelect.style.padding = "5px";
  affixSelect.style.backgroundColor = "#333";
  affixSelect.style.color = "#eee";
  affixSelect.style.border = "1px solid #555";
  affixSelect.style.borderRadius = "4px";

  // Create automod indicator
  const automodIndicator = document.createElement("div");
  automodIndicator.className = "automod-indicator";
  automodIndicator.style.flex = "0 0 80px";
  automodIndicator.style.marginRight = "10px";
  automodIndicator.style.padding = "5px";
  automodIndicator.style.textAlign = "center";
  automodIndicator.style.borderRadius = "4px";
  automodIndicator.style.display = "none";
  automodIndicator.style.fontSize = "0.8em";
  automodIndicator.style.fontWeight = "bold";

  // Create value slider
  const valueSlider = document.createElement("input");
  valueSlider.type = "range";
  valueSlider.className = "affix-value";
  valueSlider.style.flex = "1";
  valueSlider.style.marginRight = "10px";

  // Create value display
  const valueDisplay = document.createElement("span");
  valueDisplay.className = "affix-display";
  valueDisplay.style.width = "40px";
  valueDisplay.style.textAlign = "right";

  // Create remove button
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-affix";
  removeButton.textContent = "X";
  removeButton.style.padding = "5px 10px";
  removeButton.style.backgroundColor = "#e74c3c";
  removeButton.style.color = "white";
  removeButton.style.border = "none";
  removeButton.style.borderRadius = "4px";
  removeButton.style.marginLeft = "10px";
  removeButton.style.cursor = "pointer";

  // Add event listeners
  affixTypeSelect.addEventListener("change", () => {
    populateAffixes(affixSelect, itemType, affixTypeSelect.value);
    updateSliderRange(
      affixSelect,
      valueSlider,
      valueDisplay,
      affixTypeSelect.value,
      automodIndicator
    );
    updateItemPreview();
  });

  affixSelect.addEventListener("change", () => {
    updateSliderRange(
      affixSelect,
      valueSlider,
      valueDisplay,
      affixTypeSelect.value,
      automodIndicator
    );
    updateItemPreview();
  });

  valueSlider.addEventListener("input", () => {
    valueDisplay.textContent = valueSlider.value;
    if (affixSelect.options[affixSelect.selectedIndex]) {
      const affixData = JSON.parse(
        affixSelect.options[affixSelect.selectedIndex].dataset.affixData || "{}"
      );
      if (
        affixData.stat &&
        (affixData.stat.includes("Enhanced Damage") ||
          affixData.stat.includes("Deadly Strike") ||
          affixData.stat.includes("Rate") ||
          affixData.stat.includes("Find") ||
          affixData.stat.includes("Resistances"))
      ) {
        valueDisplay.textContent += "%";
      }
    }
    updateItemPreview();
  });

  removeButton.addEventListener("click", () => {
    affixesContainer.removeChild(affixRow);
    updateItemPreview();
  });

  // Add elements to row
  affixRow.appendChild(affixTypeSelect);
  affixRow.appendChild(affixSelect);
  affixRow.appendChild(automodIndicator);
  affixRow.appendChild(valueSlider);
  affixRow.appendChild(valueDisplay);
  affixRow.appendChild(removeButton);

  // Add row to container
  affixesContainer.appendChild(affixRow);

  // Populate initial affixes and update slider range
  populateAffixes(affixSelect, itemType, "prefix");
  updateSliderRange(
    affixSelect,
    valueSlider,
    valueDisplay,
    "prefix",
    automodIndicator
  );
}

// Populate affix select with options based on item type and affix type
function populateAffixes(affixSelect, itemType, affixType) {
  affixSelect.innerHTML = "";

  // Get all affixes for the item type
  let affixes = [];

  // Add type-specific affixes
  if (affixPool[affixType][itemType]) {
    affixes = affixes.concat(affixPool[affixType][itemType]);
  }

  // Add general affixes
  if (affixPool[affixType].all) {
    affixes = affixes.concat(affixPool[affixType].all);
  }

  // Group affixes by regular and automod
  const regularAffixes = affixes.filter((affix) => !affix.automod);
  const automodAffixes = affixes.filter((affix) => affix.automod);

  // Add regular affixes first
  if (regularAffixes.length > 0) {
    const regularGroup = document.createElement("optgroup");
    regularGroup.label = "Regular Affixes";

    regularAffixes.forEach((affix) => {
      const option = document.createElement("option");
      option.value = affix.name;
      option.textContent = `${affix.name} (${affix.stat})`;
      option.dataset.affixData = JSON.stringify(affix);
      regularGroup.appendChild(option);
    });

    affixSelect.appendChild(regularGroup);
  }

  // Add automods in a separate group
  if (automodAffixes.length > 0) {
    // Group automods by class
    const automodsByClass = {};

    automodAffixes.forEach((affix) => {
      if (!automodsByClass[affix.automod]) {
        automodsByClass[affix.automod] = [];
      }
      automodsByClass[affix.automod].push(affix);
    });

    // Add each class group
    const classNames = {
      ass: "Assassin Skills",
      sor: "Sorceress Skills",
      nec: "Necromancer Skills",
      pal: "Paladin Skills",
      bar: "Barbarian Skills",
      dru: "Druid Skills",
      ama: "Amazon Skills",
    };

    Object.keys(automodsByClass).forEach((classKey) => {
      const classGroup = document.createElement("optgroup");
      classGroup.label = classNames[classKey] || "Class Skills";

      automodsByClass[classKey].forEach((affix) => {
        const option = document.createElement("option");
        option.value = affix.name;
        option.textContent = `${affix.name} (${affix.stat})`;
        option.dataset.affixData = JSON.stringify(affix);
        classGroup.appendChild(option);
      });

      affixSelect.appendChild(classGroup);
    });
  }
}

// Update slider range based on selected affix
function updateSliderRange(
  affixSelect,
  valueSlider,
  valueDisplay,
  affixType,
  automodIndicator
) {
  if (affixSelect.options.length === 0) return;

  const selectedOption = affixSelect.options[affixSelect.selectedIndex];
  if (!selectedOption) return;

  const affixData = JSON.parse(selectedOption.dataset.affixData || "{}");

  if (affixData.min !== undefined && affixData.max !== undefined) {
    valueSlider.min = affixData.min;
    valueSlider.max = affixData.max;
    valueSlider.value = Math.floor((affixData.min + affixData.max) / 2);

    valueDisplay.textContent = valueSlider.value;
    if (
      affixData.stat &&
      (affixData.stat.includes("Enhanced Damage") ||
        affixData.stat.includes("Deadly Strike") ||
        affixData.stat.includes("Rate") ||
        affixData.stat.includes("Find") ||
        affixData.stat.includes("Resistances"))
    ) {
      valueDisplay.textContent += "%";
    }
  }

  // Show automod indicator if it's an automod
  if (automodIndicator) {
    if (affixData.automod) {
      automodIndicator.style.display = "block";
      automodIndicator.textContent = "AUTOMOD";

      // Set color based on class
      switch (affixData.automod) {
        case "ass":
          automodIndicator.style.backgroundColor = "#8e44ad"; // Purple for Assassin
          break;
        case "sor":
          automodIndicator.style.backgroundColor = "#3498db"; // Blue for Sorceress
          break;
        case "nec":
          automodIndicator.style.backgroundColor = "#2c3e50"; // Dark Blue for Necromancer
          break;
        case "pal":
          automodIndicator.style.backgroundColor = "#f1c40f"; // Yellow for Paladin
          break;
        case "bar":
          automodIndicator.style.backgroundColor = "#e74c3c"; // Red for Barbarian
          break;
        case "dru":
          automodIndicator.style.backgroundColor = "#27ae60"; // Green for Druid
          break;
        case "ama":
          automodIndicator.style.backgroundColor = "#f39c12"; // Orange for Amazon
          break;
        default:
          automodIndicator.style.backgroundColor = "#7f8c8d"; // Gray default
      }
    } else {
      automodIndicator.style.display = "none";
    }
  }
}

// Update item preview
function updateItemPreview() {
  const previewContainer = document.getElementById("item-preview");
  if (!previewContainer) return;

  const itemType = document.getElementById("item-type").value;
  const baseItem = document.getElementById("base-item").value;
  const craftType = document.getElementById("craft-type").value;
  const itemName =
    document.getElementById("item-name").value || `${craftType} ${baseItem}`;

  // Start building preview HTML
  let html = `<div style="color: #${getCraftTypeColor(
    craftType
  )};">${itemName}</div>`;
  html += `<div>${baseItem}</div>`;
  html += '<div style="margin-top: 10px;">';

  // Add base properties
  const basePropsSliders = document.querySelectorAll(".base-prop-slider");
  basePropsSliders.forEach((slider) => {
    const propName = slider.dataset.name;
    const propType = slider.dataset.type;
    const propValue = slider.value;

    if (propType === "percentage") {
      html += `<div>${propValue}% ${propName}</div>`;
    } else if (propName.includes("to All Skills")) {
      html += `<div>+${propValue} ${propName}</div>`;
    } else {
      html += `<div>+${propValue} ${propName}</div>`;
    }
  });

  // Add additional affixes
  const affixRows = document.querySelectorAll(".affix-row");
  let prefixCount = 0;
  let suffixCount = 0;

  affixRows.forEach((row) => {
    const affixType = row.querySelector(".affix-type").value;
    const affixSelect = row.querySelector(".affix-select");
    const affixValue = row.querySelector(".affix-value").value;

    if (affixSelect.selectedIndex === -1) return;

    const affixData = JSON.parse(
      affixSelect.options[affixSelect.selectedIndex].dataset.affixData || "{}"
    );

    if (affixType === "prefix") {
      prefixCount++;
      if (prefixCount > 3) return; // Max 3 prefixes
    } else {
      suffixCount++;
      if (suffixCount > 3) return; // Max 3 suffixes
    }

    // Format the display of the affix
    if (
      affixData.stat &&
      (affixData.stat.includes("Enhanced Damage") ||
        affixData.stat.includes("Deadly Strike") ||
        affixData.stat.includes("Rate") ||
        affixData.stat.includes("Find") ||
        affixData.stat.includes("Stolen") ||
        affixData.stat.includes("Resistances"))
    ) {
      html += `<div>${affixValue}% ${affixData.stat}</div>`;
    } else {
      html += `<div>+${affixValue} ${affixData.stat}</div>`;
    }
  });

  html += "</div>";

  // Update preview
  previewContainer.innerHTML = html;
}

// Reset craft form to default values
function resetCraftForm() {
  // Reset item type to weapon
  const itemTypeSelect = document.getElementById("item-type");
  if (itemTypeSelect) itemTypeSelect.value = "weapon";

  // Repopulate base items and craft types
  populateBaseItems("weapon");
  populateCraftTypes("weapon");

  // Reset base properties
  updateBaseProperties("weapon", "Blood");

  // Clear additional affixes
  const affixesContainer = document.getElementById("additional-affixes");
  if (affixesContainer) affixesContainer.innerHTML = "";

  // Clear item name
  const nameInput = document.getElementById("item-name");
  if (nameInput) nameInput.value = "";

  // Update preview
  updateItemPreview();
}

// Create a custom crafted item
function createCustomItem() {
  // Validate form fields
  if (!validateCraftForm()) return;

  // Get form values
  const itemType = document.getElementById("item-type").value;
  const baseItem = document.getElementById("base-item").value;
  const craftType = document.getElementById("craft-type").value;
  let itemName = document.getElementById("item-name").value;

  // If no name was provided, generate one
  if (!itemName) {
    itemName = `${craftType} ${baseItem}`;
  }

  // Collect base properties
  const baseProps = [];
  const basePropsSliders = document.querySelectorAll(".base-prop-slider");

  basePropsSliders.forEach((slider) => {
    baseProps.push({
      name: slider.dataset.name,
      type: "base",
      value: parseInt(slider.value),
      min: parseInt(slider.min),
      max: parseInt(slider.max),
    });
  });

  // Collect additional affixes
  const additionalAffixes = [];
  const affixRows = document.querySelectorAll(".affix-row");
  let prefixCount = 0;
  let suffixCount = 0;

  affixRows.forEach((row) => {
    const affixType = row.querySelector(".affix-type").value;
    const affixSelect = row.querySelector(".affix-select");
    const affixValue = parseInt(row.querySelector(".affix-value").value);

    if (affixSelect.selectedIndex === -1) return;

    // Parse affix data from selected option
    const affixData = JSON.parse(
      affixSelect.options[affixSelect.selectedIndex].dataset.affixData || "{}"
    );

    // Check limits on prefixes and suffixes (excluding automods)
    if (!affixData.automod) {
      if (affixType === "prefix") {
        prefixCount++;
        if (prefixCount > 3) return; // Max 3 prefixes
      } else {
        suffixCount++;
        if (suffixCount > 3) return; // Max 3 suffixes
      }
    }

    // Build the affix object
    const affix = {
      name: affixData.name,
      type: affixType,
      stat: affixData.stat,
      value: affixValue,
      min: affixData.min,
      max: affixData.max,
    };

    // Add automod flag if it exists
    if (affixData.automod) {
      affix.automod = affixData.automod;
    }

    additionalAffixes.push(affix);
  });

  // Create item object
  const craftedItem = {
    userId: currentUser,
    itemName: itemName,
    itemType: itemType,
    baseType: baseItem,
    craftType: craftType,
    affixes: [...baseProps, ...additionalAffixes],
  };

  // Save to server
  saveCraftedItem(craftedItem);
}

// Validate the craft form
function validateCraftForm() {
  const itemName = document.getElementById("item-name").value;
  const affixRows = document.querySelectorAll(".affix-row");

  // Check prefixes and suffixes count (excluding automods)
  let prefixCount = 0;
  let suffixCount = 0;

  affixRows.forEach((row) => {
    const type = row.querySelector(".affix-type").value;
    const affixSelect = row.querySelector(".affix-select");

    if (affixSelect.selectedIndex === -1) return;

    const affixData = JSON.parse(
      affixSelect.options[affixSelect.selectedIndex].dataset.affixData || "{}"
    );

    // Skip counting if it's an automod
    if (affixData.automod) return;

    if (type === "prefix") prefixCount++;
    else suffixCount++;
  });

  if (prefixCount > 3) {
    alert("Maximum of 3 prefixes allowed (automods excluded)");
    return false;
  }

  if (suffixCount > 3) {
    alert("Maximum of 3 suffixes allowed (automods excluded)");
    return false;
  }

  return true;
}
// Save the crafted item to the server
function saveCraftedItem(item) {
  console.log("Saving craft item:", item);

  fetch("http://localhost:3001/api/custom-crafts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          console.error("Server error response:", text);
          throw new Error(`Server returned ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert("Item created successfully!");

        // Close the modal
        const modal = document.getElementById("craft-modal");
        if (modal) modal.style.display = "none";

        // Reload all custom items to update dropdowns
        loadCustomCraftItems();
      } else {
        alert("Error creating item: " + (data.message || "Unknown error"));
      }
    })
    .catch((error) => {
      console.error("Error saving custom craft item:", error);
      alert("Error saving item: " + error.message);
    });
}

// External variables needed from craftItems.js
const baseItems = {
  weapon: [
    { name: "Hand Axe", itemClass: "Axe", twoHanded: false, strengthReq: 0 },
    { name: "Axe", itemClass: "Axe", twoHanded: false, strengthReq: 32 },
    { name: "Double Axe", itemClass: "Axe", twoHanded: false, strengthReq: 43 },
    {
      name: "Military Pick",
      itemClass: "Axe",
      twoHanded: false,
      strengthReq: 49,
    },
    { name: "War Axe", itemClass: "Axe", twoHanded: false, strengthReq: 67 },
    { name: "Large Axe", itemClass: "Axe", twoHanded: true, strengthReq: 35 },
    { name: "Broad Axe", itemClass: "Axe", twoHanded: true, strengthReq: 48 },
    { name: "Battle Axe", itemClass: "Axe", twoHanded: true, strengthReq: 54 },
    { name: "Great Axe", itemClass: "Axe", twoHanded: true, strengthReq: 63 },
    { name: "Giant Axe", itemClass: "Axe", twoHanded: true, strengthReq: 70 },
    {
      name: "Two-Handed Sword",
      itemClass: "Sword",
      twoHanded: true,
      strengthReq: 35,
    },
    { name: "Claymore", itemClass: "Sword", twoHanded: true, strengthReq: 47 },
    {
      name: "Giant Sword",
      itemClass: "Sword",
      twoHanded: true,
      strengthReq: 56,
    },
    {
      name: "Bastard Sword",
      itemClass: "Sword",
      twoHanded: true,
      strengthReq: 62,
    },
    { name: "Flamberge", itemClass: "Sword", twoHanded: true, strengthReq: 70 },
    {
      name: "Great Sword",
      itemClass: "Sword",
      twoHanded: true,
      strengthReq: 100,
    },
    {
      name: "Short Sword",
      itemClass: "Sword",
      twoHanded: false,
      strengthReq: 0,
    },
    { name: "Scimitar", itemClass: "Sword", twoHanded: false, strengthReq: 0 },
    { name: "Sabre", itemClass: "Sword", twoHanded: false, strengthReq: 25 },
    { name: "Falchion", itemClass: "Sword", twoHanded: false, strengthReq: 33 },
    {
      name: "Crystal Sword",
      itemClass: "Sword",
      twoHanded: false,
      strengthReq: 43,
    },
    {
      name: "Broad Sword",
      itemClass: "Sword",
      twoHanded: false,
      strengthReq: 48,
    },
    {
      name: "Long Sword",
      itemClass: "Sword",
      twoHanded: false,
      strengthReq: 55,
    },
    {
      name: "War Sword",
      itemClass: "Sword",
      twoHanded: false,
      strengthReq: 71,
    },
    { name: "Dagger", itemClass: "Dagger", twoHanded: false, strengthReq: 0 },
    { name: "Dirk", itemClass: "Dagger", twoHanded: false, strengthReq: 0 },
    { name: "Kris", itemClass: "Dagger", twoHanded: false, strengthReq: 0 },
    { name: "Blade", itemClass: "Dagger", twoHanded: false, strengthReq: 35 },
    { name: "Club", itemClass: "Mace", twoHanded: false, strengthReq: 0 },
    {
      name: "Spiked Club",
      itemClass: "Mace",
      twoHanded: false,
      strengthReq: 0,
    },
    { name: "Mace", itemClass: "Mace", twoHanded: false, strengthReq: 27 },
    {
      name: "Morning Star",
      itemClass: "Mace",
      twoHanded: false,
      strengthReq: 36,
    },
    { name: "Flail", itemClass: "Mace", twoHanded: false, strengthReq: 41 },
    {
      name: "War Hammer",
      itemClass: "Mace",
      twoHanded: false,
      strengthReq: 53,
    },
    { name: "Maul", itemClass: "Mace", twoHanded: true, strengthReq: 69 },
    { name: "Great Maul", itemClass: "Mace", twoHanded: true, strengthReq: 99 },
    {
      name: "Blade Talons",
      itemClass: "Claw",
      twoHanded: false,
      strengthReq: 0,
    },
  ],
  armor: [
    { name: "Quilted Armor", itemClass: "Light Armor", strengthReq: 12 },
    { name: "Leather Armor", itemClass: "Light Armor", strengthReq: 15 },
    { name: "Hard Leather Armor", itemClass: "Light Armor", strengthReq: 20 },
    { name: "Studded Leather", itemClass: "Light Armor", strengthReq: 27 },
    { name: "Ring Mail", itemClass: "Medium Armor", strengthReq: 36 },
    { name: "Scale Mail", itemClass: "Medium Armor", strengthReq: 44 },
    { name: "Chain Mail", itemClass: "Medium Armor", strengthReq: 48 },
    { name: "Breast Plate", itemClass: "Heavy Armor", strengthReq: 30 },
    { name: "Splint Mail", itemClass: "Heavy Armor", strengthReq: 51 },
    { name: "Plate Mail", itemClass: "Heavy Armor", strengthReq: 65 },
    { name: "Field Plate", itemClass: "Heavy Armor", strengthReq: 55 },
    { name: "Gothic Plate", itemClass: "Heavy Armor", strengthReq: 70 },
    { name: "Full Plate Mail", itemClass: "Heavy Armor", strengthReq: 80 },
    { name: "Ancient Armor", itemClass: "Heavy Armor", strengthReq: 100 },
    { name: "Light Plate", itemClass: "Heavy Armor", strengthReq: 41 },
    { name: "Ghost Armor", itemClass: "Light Armor", strengthReq: 38 },
    { name: "Serpentskin Armor", itemClass: "Light Armor", strengthReq: 43 },
    { name: "Demonhide Armor", itemClass: "Light Armor", strengthReq: 50 },
    { name: "Trellised Armor", itemClass: "Light Armor", strengthReq: 61 },
    { name: "Linked Mail", itemClass: "Medium Armor", strengthReq: 74 },
    { name: "Tigulated Mail", itemClass: "Medium Armor", strengthReq: 86 },
    { name: "Mesh Armor", itemClass: "Medium Armor", strengthReq: 92 },
    { name: "Cuirass", itemClass: "Heavy Armor", strengthReq: 65 },
    { name: "Russet Armor", itemClass: "Heavy Armor", strengthReq: 97 },
    { name: "Templar Coat", itemClass: "Heavy Armor", strengthReq: 118 },
    { name: "Sharktooth Armor", itemClass: "Heavy Armor", strengthReq: 103 },
    { name: "Embossed Plate", itemClass: "Heavy Armor", strengthReq: 125 },
    { name: "Chaos Armor", itemClass: "Heavy Armor", strengthReq: 140 },
    { name: "Ornate Plate", itemClass: "Heavy Armor", strengthReq: 170 },
    { name: "Mage Plate", itemClass: "Light Armor", strengthReq: 55 },
    { name: "Dusk Shroud", itemClass: "Light Armor", strengthReq: 77 },
    { name: "Wyrmhide", itemClass: "Light Armor", strengthReq: 84 },
    { name: "Scarab Husk", itemClass: "Light Armor", strengthReq: 95 },
    { name: "Wire Fleece", itemClass: "Light Armor", strengthReq: 111 },
    { name: "Diamond Mail", itemClass: "Medium Armor", strengthReq: 131 },
    { name: "Loricated Mail", itemClass: "Medium Armor", strengthReq: 149 },
    { name: "Boneweave", itemClass: "Medium Armor", strengthReq: 158 },
    { name: "Great Hauberk", itemClass: "Medium Armor", strengthReq: 118 },
    { name: "Balrog Skin", itemClass: "Heavy Armor", strengthReq: 165 },
    { name: "Hellforge Plate", itemClass: "Heavy Armor", strengthReq: 196 },
    { name: "Kraken Shell", itemClass: "Heavy Armor", strengthReq: 174 },
    { name: "Lacquered Plate", itemClass: "Heavy Armor", strengthReq: 208 },
    { name: "Archon Plate", itemClass: "Heavy Armor", strengthReq: 103 },
    { name: "Shadow Plate", itemClass: "Heavy Armor", strengthReq: 220 },
    { name: "Sacred Armor", itemClass: "Heavy Armor", strengthReq: 232 },
  ],
  helm: [
    { name: "Cap", itemClass: "Light Helm", strengthReq: 0 },
    { name: "Skull Cap", itemClass: "Light Helm", strengthReq: 15 },
    { name: "Helm", itemClass: "Medium Helm", strengthReq: 26 },
    { name: "Full Helm", itemClass: "Medium Helm", strengthReq: 41 },
    { name: "Great Helm", itemClass: "Heavy Helm", strengthReq: 63 },
    { name: "Crown", itemClass: "Heavy Helm", strengthReq: 55 },
    { name: "Mask", itemClass: "Light Helm", strengthReq: 23 },
    { name: "Bone Helm", itemClass: "Light Helm", strengthReq: 25 },
    { name: "War Hat", itemClass: "Light Helm", strengthReq: 20 },
    { name: "Shako", itemClass: "Light Helm", strengthReq: 50 },
    { name: "Sallet", itemClass: "Medium Helm", strengthReq: 43 },
    { name: "Hydraskull", itemClass: "Medium Helm", strengthReq: 84 },
    { name: "Casque", itemClass: "Medium Helm", strengthReq: 59 },
    { name: "Basinet", itemClass: "Medium Helm", strengthReq: 82 },
    { name: "Giant Conch", itemClass: "Heavy Helm", strengthReq: 142 },
    { name: "Armet", itemClass: "Heavy Helm", strengthReq: 109 },
    { name: "Death Mask", itemClass: "Light Helm", strengthReq: 55 },
    { name: "Demonhead", itemClass: "Light Helm", strengthReq: 102 },
    { name: "Grim Helm", itemClass: "Light Helm", strengthReq: 58 },
    { name: "Bone Visage", itemClass: "Light Helm", strengthReq: 106 },
    { name: "Winged Helm", itemClass: "Heavy Helm", strengthReq: 115 },
    { name: "Spired Helm", itemClass: "Heavy Helm", strengthReq: 192 },
    { name: "Grand Crown", itemClass: "Heavy Helm", strengthReq: 103 },
    { name: "Corona", itemClass: "Heavy Helm", strengthReq: 174 },
    { name: "Circlet", itemClass: "Circlet", strengthReq: 0 },
    { name: "Coronet", itemClass: "Circlet", strengthReq: 0 },
    { name: "Tiara", itemClass: "Circlet", strengthReq: 0 },
    { name: "Diadem", itemClass: "Circlet", strengthReq: 0 },
    { name: "Wolf Head", itemClass: "Druid Helm", strengthReq: 16 },
    { name: "Hawk Helm", itemClass: "Druid Helm", strengthReq: 20 },
    { name: "Antlers", itemClass: "Druid Helm", strengthReq: 24 },
    { name: "Falcon Mask", itemClass: "Druid Helm", strengthReq: 28 },
    { name: "Spirit Mask", itemClass: "Druid Helm", strengthReq: 30 },
    { name: "Jawbone Cap", itemClass: "Barbarian Helm", strengthReq: 25 },
    { name: "Fanged Helm", itemClass: "Barbarian Helm", strengthReq: 35 },
    { name: "Horned Helm", itemClass: "Barbarian Helm", strengthReq: 45 },
    { name: "Assault Helmet", itemClass: "Barbarian Helm", strengthReq: 55 },
    { name: "Avenger Guard", itemClass: "Barbarian Helm", strengthReq: 65 },
    { name: "Jawbone Visor", itemClass: "Barbarian Helm", strengthReq: 58 },
    { name: "Carnage Helm", itemClass: "Barbarian Helm", strengthReq: 106 },
    { name: "Slayer Guard", itemClass: "Barbarian Helm", strengthReq: 118 },
    { name: "Guardian Crown", itemClass: "Barbarian Helm", strengthReq: 196 },
  ],
  shield: [
    { name: "Buckler", itemClass: "Light Shield", strengthReq: 12 },
    { name: "Small Shield", itemClass: "Light Shield", strengthReq: 22 },
    { name: "Large Shield", itemClass: "Medium Shield", strengthReq: 34 },
    { name: "Kite Shield", itemClass: "Medium Shield", strengthReq: 47 },
    { name: "Tower Shield", itemClass: "Heavy Shield", strengthReq: 75 },
    { name: "Gothic Shield", itemClass: "Heavy Shield", strengthReq: 60 },
    { name: "Bone Shield", itemClass: "Light Shield", strengthReq: 25 },
    { name: "Spiked Shield", itemClass: "Medium Shield", strengthReq: 30 },
    { name: "Defender", itemClass: "Medium Shield", strengthReq: 38 },
  ],
  gloves: [
    { name: "Leather Gloves", itemClass: "Light Gloves", strengthReq: 0 },
    { name: "Heavy Gloves", itemClass: "Medium Gloves", strengthReq: 0 },
    { name: "Chain Gloves", itemClass: "Medium Gloves", strengthReq: 25 },
    { name: "Light Gauntlets", itemClass: "Heavy Gloves", strengthReq: 45 },
    { name: "Gauntlets", itemClass: "Heavy Gloves", strengthReq: 60 },
    { name: "Demonhide Gloves", itemClass: "Light Gloves", strengthReq: 20 },
    { name: "Sharkskin Gloves", itemClass: "Light Gloves", strengthReq: 20 },
    { name: "Heavy Bracers", itemClass: "Medium Gloves", strengthReq: 58 },
    { name: "Battle Gauntlets", itemClass: "Heavy Gloves", strengthReq: 88 },
    { name: "War Gauntlets", itemClass: "Heavy Gloves", strengthReq: 110 },
    { name: "Bramble Mitts", itemClass: "Light Gloves", strengthReq: 50 },
    { name: "Vampirebone Gloves", itemClass: "Light Gloves", strengthReq: 50 },
    { name: "Vambraces", itemClass: "Medium Gloves", strengthReq: 106 },
    { name: "Crusader Gauntlets", itemClass: "Heavy Gloves", strengthReq: 151 },
    { name: "Ogre Gauntlets", itemClass: "Heavy Gloves", strengthReq: 185 },
  ],
  belt: [
    { name: "Sash", itemClass: "Light Belt", strengthReq: 0 },
    { name: "Light Belt", itemClass: "Light Belt", strengthReq: 0 },
    { name: "Belt", itemClass: "Medium Belt", strengthReq: 25 },
    { name: "Heavy Belt", itemClass: "Medium Belt", strengthReq: 45 },
    { name: "Plated Belt", itemClass: "Heavy Belt", strengthReq: 60 },
    { name: "Demonhide Sash", itemClass: "Light Belt", strengthReq: 20 },
    { name: "Sharkskin Belt", itemClass: "Light Belt", strengthReq: 20 },
    { name: "Mesh Belt", itemClass: "Medium Belt", strengthReq: 58 },
    { name: "Battle Belt", itemClass: "Medium Belt", strengthReq: 88 },
    { name: "War Belt", itemClass: "Heavy Belt", strengthReq: 110 },
    { name: "Spiderweb Sash", itemClass: "Light Belt", strengthReq: 50 },
    { name: "Vampirefang Belt", itemClass: "Light Belt", strengthReq: 50 },
    { name: "Mithril Coil", itemClass: "Medium Belt", strengthReq: 106 },
    { name: "Troll Belt", itemClass: "Medium Belt", strengthReq: 151 },
    { name: "Colossus Girdle", itemClass: "Heavy Belt", strengthReq: 185 },
  ],
};

// Craft definitions
const craftDefinitions = {
  weapon: {
    Blood: {
      name: "Blood",
      baseProperties: [
        { name: "Enhanced Damage", type: "percentage", min: 50, max: 80 },
        { name: "Life Stolen per Hit", type: "percentage", min: 3, max: 6 },
        { name: "to Life", type: "flat", min: 10, max: 20 },
      ],
    },
    Caster: {
      name: "Caster",
      baseProperties: [
        { name: "to All Skills", type: "flat", min: 1, max: 1 },
        { name: "Faster Cast Rate", type: "percentage", min: 10, max: 20 },
        { name: "to Mana", type: "flat", min: 10, max: 20 },
      ],
    },
    Hitpower: {
      name: "Hitpower",
      baseProperties: [
        {
          name: "Increased Attack Speed",
          type: "percentage",
          min: 20,
          max: 40,
        },
        { name: "Crushing Blow", type: "percentage", min: 15, max: 25 },
        { name: "Deadly Strike", type: "percentage", min: 15, max: 25 },
      ],
    },
  },
  armor: {
    Safety: {
      name: "Safety",
      baseProperties: [
        { name: "Enhanced Defense", type: "percentage", min: 50, max: 100 },
        { name: "Faster Hit Recovery", type: "percentage", min: 10, max: 20 },
        {
          name: "Physical Damage Reduction",
          type: "percentage",
          min: 3,
          max: 7,
        },
      ],
    },
  },
  helm: {
    Vampiric: {
      name: "Vampiric",
      baseProperties: [
        { name: "Deadly Strike", type: "percentage", min: 10, max: 20 },
        { name: "Mana Stolen per Hit", type: "percentage", min: 2, max: 4 },
        { name: "Replenish Life", type: "flat", min: 5, max: 10 },
      ],
    },
  },
  all: {
    Bountiful: {
      name: "Bountiful",
      baseProperties: [
        {
          name: "Better Chance of Getting Magic Items",
          type: "percentage",
          min: 15,
          max: 30,
        },
        {
          name: "Extra Gold from Monsters",
          type: "percentage",
          min: 30,
          max: 60,
        },
        { name: "to All Attributes", type: "flat", min: 5, max: 10 },
      ],
    },
    Brilliant: {
      name: "Brilliant",
      baseProperties: [
        { name: "to All Skills", type: "flat", min: 1, max: 2 },
        { name: "Faster Cast Rate", type: "percentage", min: 10, max: 20 },
        { name: "to Mana", type: "percentage", min: 10, max: 20 },
      ],
    },
  },
};

// Affix pool for prefixes and suffixes
const affixPool = {
  prefix: {
    weapon: [
      { name: "Cruel", stat: "Enhanced Damage", min: 151, max: 200 },
      { name: "Master's", stat: "Attack Rating", min: 121, max: 150 },
      { name: "Accurate", stat: "Attack Rating", min: 81, max: 120 },
      { name: "Sharp", stat: "Maximum Damage", min: 7, max: 15 },
      { name: "Fine", stat: "Maximum Damage", min: 4, max: 6 },
      { name: "Fiery", stat: "Fire Damage", min: 11, max: 20 },
      { name: "Shocking", stat: "Lightning Damage", min: 1, max: 40 },
      { name: "Freezing", stat: "Cold Damage", min: 6, max: 10 },
    ],
    armor: [
      { name: "Sturdy", stat: "Enhanced Defense", min: 31, max: 65 },
      { name: "Strong", stat: "Enhanced Defense", min: 66, max: 100 },
      { name: "Glorious", stat: "Enhanced Defense", min: 101, max: 150 },
      { name: "Blessed", stat: "All Resistances", min: 5, max: 10 },
      { name: "Crimson", stat: "to Fire Resistance", min: 11, max: 20 },
      { name: "Azure", stat: "to Cold Resistance", min: 11, max: 20 },
      { name: "Amber", stat: "to Lightning Resistance", min: 11, max: 20 },
    ],
    helm: [
      { name: "Stout", stat: "to Life", min: 21, max: 40 },
      { name: "Lizard's", stat: "to Mana", min: 11, max: 20 },
      { name: "Jade", stat: "Poison Resistance", min: 11, max: 20 },
    ],
    all: [
      {
        name: "Lucky",
        stat: "Better Chance of Getting Magic Items",
        min: 11,
        max: 25,
      },
      {
        name: "Fortuitous",
        stat: "Extra Gold from Monsters",
        min: 31,
        max: 80,
      },
      { name: "Hawk's", stat: "to Dexterity", min: 6, max: 9 },
      { name: "Granite", stat: "to Strength", min: 6, max: 9 },
    ],
  },
  suffix: {
    weapon: [
      { name: "of Slaying", stat: "Damage to Demons", min: 51, max: 100 },
      { name: "of Maiming", stat: "Damage to Undead", min: 51, max: 100 },
      {
        name: "of Swiftness",
        stat: "Increased Attack Speed",
        min: 10,
        max: 20,
      },
      { name: "of Quickness", stat: "Faster Cast Rate", min: 10, max: 15 },
      { name: "of Flames", stat: "to Fire Damage", min: 21, max: 40 },
      { name: "of Frost", stat: "to Cold Damage", min: 11, max: 20 },
      { name: "of Shock", stat: "to Lightning Damage", min: 41, max: 80 },
      { name: "of Life Stolen", stat: "Life Stolen per Hit", min: 1, max: 4 },
      // Assassin skill automods
      {
        name: "of WoF",
        stat: "to Wake of Fire (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
      },
      {
        name: "of Traps",
        stat: "to Traps (Assassin Only)",
        min: 1,
        max: 2,
        automod: "ass",
      },
      {
        name: "of LS",
        stat: "to Lightning Sentry (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
      },
      {
        name: "of DS",
        stat: "to Death Sentry (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
      },
      {
        name: "of Fire Blast",
        stat: "to Fire Blast (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
      },
      {
        name: "of Inferno",
        stat: "to Wake of Inferno (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
      },
      // Sorceress skill automods
      {
        name: "of Nova",
        stat: "to Nova (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
      },
      {
        name: "of Lightning",
        stat: "to Lightning (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
      },
      {
        name: "of Fire Ball",
        stat: "to Fire Ball (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
      },
      {
        name: "of Blizzard",
        stat: "to Blizzard (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
      },
      // Necromancer skill automods
      {
        name: "of Bone",
        stat: "to Bone Spear (Necromancer Only)",
        min: 1,
        max: 3,
        automod: "nec",
      },
      {
        name: "of Poison",
        stat: "to Poison Nova (Necromancer Only)",
        min: 1,
        max: 3,
        automod: "nec",
      },
      // Paladin skill automods
      {
        name: "of Blessed Hammer",
        stat: "to Blessed Hammer (Paladin Only)",
        min: 1,
        max: 3,
        automod: "pal",
      },
      {
        name: "of Holy Shield",
        stat: "to Holy Shield (Paladin Only)",
        min: 1,
        max: 3,
        automod: "pal",
      },
      // Barbarian skill automods
      {
        name: "of Battle Orders",
        stat: "to Battle Orders (Barbarian Only)",
        min: 1,
        max: 3,
        automod: "bar",
      },
      {
        name: "of Whirlwind",
        stat: "to Whirlwind (Barbarian Only)",
        min: 1,
        max: 3,
        automod: "bar",
      },
      // Druid skill automods
      {
        name: "of Tornado",
        stat: "to Tornado (Druid Only)",
        min: 1,
        max: 3,
        automod: "dru",
      },
      {
        name: "of Hurricane",
        stat: "to Hurricane (Druid Only)",
        min: 1,
        max: 3,
        automod: "dru",
      },
      // Amazon skill automods
      {
        name: "of Lightning Fury",
        stat: "to Lightning Fury (Amazon Only)",
        min: 1,
        max: 3,
        automod: "ama",
      },
      {
        name: "of Strafe",
        stat: "to Strafe (Amazon Only)",
        min: 1,
        max: 3,
        automod: "ama",
      },
    ],
    armor: [
      { name: "of the Whale", stat: "to Life", min: 41, max: 80 },
      { name: "of Health", stat: "to Life", min: 21, max: 40 },
      { name: "of Warding", stat: "All Resistances", min: 11, max: 15 },
      { name: "of Deflection", stat: "Faster Block Rate", min: 10, max: 20 },
      { name: "of Absorption", stat: "Magic Damage Reduction", min: 1, max: 2 },
    ],
    helm: [
      { name: "of the Mind", stat: "Energy", min: 6, max: 9 },
      { name: "of Clarity", stat: "Mana", min: 21, max: 40 },
      { name: "of Light", stat: "Light Radius", min: 1, max: 3 },
    ],
    all: [
      { name: "of Worth", stat: "Extra Gold from Monsters", min: 81, max: 120 },
      {
        name: "of Fortune",
        stat: "Better Chance of Getting Magic Items",
        min: 26,
        max: 40,
      },
      { name: "of Vita", stat: "to Vitality", min: 6, max: 9 },
    ],
  },
};

// Initialize close button for any existing modals that might interfere
document.addEventListener("DOMContentLoaded", () => {
  // Close craft modal when clicking the close button on other modals
  document
    .querySelectorAll(".close, .modalz .cancel, .socket-close")
    .forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        const craftModal = document.getElementById("craft-modal");
        if (craftModal) {
          craftModal.style.display = "none";
        }
      });
    });

  // Close inventory modal when opening craft modal
  document
    .getElementById("create-craft-button")
    ?.addEventListener("click", () => {
      // Hide any open inventory modals
      document.querySelectorAll(".modalz").forEach((modal) => {
        modal.classList.add("hidden");
        modal.style.display = "none";
      });
    });

  // Make sure our modal doesn't affect other modals
  window.addEventListener("click", (e) => {
    const craftModal = document.getElementById("craft-modal");

    // If the craft modal is open and user clicks outside the content
    if (craftModal && e.target === craftModal) {
      craftModal.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Close craft modal when item modal opens
  document
    .querySelectorAll(".modalz, #itemModal, #jewelModal")
    .forEach((otherModal) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === "style" ||
            mutation.attributeName === "class"
          ) {
            const isVisible =
              otherModal.style.display === "block" ||
              !otherModal.classList.contains("hidden");

            if (isVisible) {
              const craftModal = document.getElementById("craft-modal");
              if (craftModal && craftModal.style.display === "block") {
                craftModal.style.display = "none";
              }
            }
          }
        });
      });

      observer.observe(otherModal, { attributes: true });
    });

  // Make sure clicking outside closes the modal
  window.addEventListener("click", (e) => {
    const craftModal = document.getElementById("craft-modal");
    if (craftModal && e.target === craftModal) {
      craftModal.style.display = "none";
    }
  });
});

// Format a custom item property for display
function formatCustomItemProperty(prop) {
  if (!prop) return "Unknown property";

  // Add a class-specific indicator for automods
  let automodPrefix = "";
  if (prop.automod) {
    switch (prop.automod) {
      case "ass":
        automodPrefix = "[Assassin] ";
        break;
      case "sor":
        automodPrefix = "[Sorceress] ";
        break;
      case "nec":
        automodPrefix = "[Necromancer] ";
        break;
      case "pal":
        automodPrefix = "[Paladin] ";
        break;
      case "bar":
        automodPrefix = "[Barbarian] ";
        break;
      case "dru":
        automodPrefix = "[Druid] ";
        break;
      case "ama":
        automodPrefix = "[Amazon] ";
        break;
    }
  }

  // Special handling for Gold from Monsters
  if (
    (prop.stat && prop.stat.includes("Gold from Monsters")) ||
    (prop.name && prop.name.includes("Gold from Monsters"))
  ) {
    return `${automodPrefix}+${prop.value || 0}% ${prop.stat || prop.name}`;
  }

  if (
    (prop.stat && prop.stat.includes("Better Chance")) ||
    (prop.name && prop.name.includes("Better Chance"))
  ) {
    return `${automodPrefix}+${prop.value || 0}% ${prop.stat || prop.name}`;
  }

  if (
    (prop.stat && prop.stat.includes("Enhanced Damage")) ||
    (prop.name && prop.name.includes("Enhanced Damage"))
  ) {
    return `${automodPrefix}+${prop.value || 0}% ${prop.stat || prop.name}`;
  }

  if (
    (prop.stat && prop.stat.includes("Damage to Demons")) ||
    (prop.name && prop.name.includes("Damage to Demons"))
  ) {
    return `${automodPrefix}+${prop.value || 0}% ${prop.stat || prop.name}`;
  }

  // Check if it's a percentage-based property - checking both stat and name fields
  if (
    (prop.stat &&
      (prop.stat.includes("Rate") ||
        prop.stat.includes("Deadly Strike") ||
        prop.stat.includes("Find") ||
        prop.stat.includes("Stolen") ||
        prop.stat.includes("Resistance"))) ||
    (prop.name &&
      (prop.name.includes("Deadly Strike") ||
        prop.name.includes("Stolen per Hit") ||
        prop.name.includes("Rate") ||
        prop.name.includes("Find") ||
        prop.name.includes("Resistance")))
  ) {
    // Use either stat or name depending on which one is present
    const displayName = prop.stat || prop.name;

    // Special handling for certain properties (adding + sign)
    if (displayName.includes("Rate") || displayName.includes("Find")) {
      return `${automodPrefix}+${prop.value || 0}% ${displayName}`;
    } else {
      // Regular percentage display for other properties
      return `${automodPrefix}${prop.value || 0}% ${displayName}`;
    }
  }

  // Skills-related properties
  else if (prop.name && prop.name.includes("to All Skills")) {
    return `${automodPrefix}+${prop.value || 0} ${prop.name}`;
  } else if (prop.name && prop.name.includes("Replenish Life")) {
    return `${automodPrefix}${prop.name || 0} +${prop.value}`;
  }
  // Class-specific skills (typically automods)
  else if (
    prop.stat &&
    (prop.stat.includes("Only") ||
      prop.stat.includes("Skill") ||
      prop.stat.includes("to "))
  ) {
    return `${automodPrefix}+${prop.value || 0} ${
      prop.stat || prop.name || "Unknown"
    }`;
  }

  // Default flat value properties
  else {
    return `${automodPrefix}+${prop.value || 0} ${
      prop.stat || prop.name || "Unknown"
    }`;
  }
}

// Apply these style improvements to the automods
document.addEventListener("DOMContentLoaded", () => {
  // Add a style for autmod indicators
  const style = document.createElement("style");
  style.textContent = `
    .automod-indicator {
      background-color: #7f8c8d;
      color: white;
      font-size: 0.8em;
      padding: 3px 5px;
      border-radius: 3px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
    }
    
    .affix-row[data-automod="true"] .affix-select {
      border-left: 3px solid #e74c3c;
    }
  `;
  document.head.appendChild(style);
});

// Expose our functions to the global scope
window.loadCustomCraftItems = loadCustomCraftItems;
window.saveCraftedItem = saveCraftedItem;
