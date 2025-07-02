/**
 * CustomCraftItems - Client-side management for Diablo 2 custom crafted items
 */

// Global state
let serverConnection = null;
let currentUser = null;
let characterLevel = 75; // Default character level

// Configuration & Data
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? `http://${window.location.hostname}:3001` 
  : 'http://localhost:3001';
const CRAFT_TYPES_COLORS = {
  Blood: "e74c3c",
  Caster: "3498db",
  Hitpower: "f39c12",
  Safety: "27ae60",
  Vampiric: "8e44ad",
  Bountiful: "f1c40f",
  Brilliant: "1abc9c",
};

// Cache for DOM elements
const DOM = {};

/**
 * Main initialization
 */
document.addEventListener("DOMContentLoaded", () => {
  // Check login status
  checkUserLoginStatus();

  // Listen for login/logout events
  document.addEventListener("userLoggedIn", onUserLoggedIn);
  document.addEventListener("userLoggedOut", onUserLoggedOut);

  // Initialize modal event handlers
  initializeModalHandlers();
});

// Auth Handlers
function checkUserLoginStatus() {
  const token = localStorage.getItem("token");
  if (!token) {
    dispatchLogoutEvent();
    return;
  }

  fetch(`${API_BASE_URL}/verify-token`, {
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
        localStorage.removeItem("token");
        dispatchLogoutEvent();
      }
    })
    .catch((error) => {
      console.error("Token verification error:", error);
    });
}

function onUserLoggedIn(event) {
  currentUser = event.detail.userId;
  initializeCustomCraftSystem();
}

function onUserLoggedOut() {
  currentUser = null;
}

function dispatchLogoutEvent() {
  const logoutEvent = new CustomEvent("userLoggedOut");
  document.dispatchEvent(logoutEvent);
}

/**
 * Craft Items System
 */
function initializeCustomCraftSystem() {
  console.log("Initializing custom craft system");
  loadCustomCraftItems();
}

function loadCustomCraftItems() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found, user not logged in");
    return;
  }

  console.log("Loading custom craft items from server");

  fetch(`${API_BASE_URL}/api/custom-crafts`, {
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

/**
 * UI Management
 */

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

function initializeModalHandlers() {
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

  // Make sure our modal doesn't affect other modals
  window.addEventListener("click", (e) => {
    const craftModal = document.getElementById("craft-modal");
    // If the craft modal is open and user clicks outside the content
    if (craftModal && e.target === craftModal) {
      craftModal.style.display = "none";
    }
  });

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
}

/**
 * Dropdown & Item Display
 */
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
        fetch(`${API_BASE_URL}/api/custom-crafts/${selectedOption.value}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
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

function displayCustomItemInfo(item, infoDiv) {
  const itemColor = getCraftTypeColor(item.craftType);
  // Format the HTML for display
  let html = `
  <div style="color: #${itemColor};">
    <strong>${item.itemName}</strong>
  </div>
  <div style="color: #${itemColor};">${item.baseType}</div>`;

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

/**
 * Craft Modal Creation
 */
function createCraftModal() {
  // Create modal container
  const modal = document.createElement("div");
  modal.id = "craft-modal";
  modal.className = "modalcraft";
  modal.style.display = "none";

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "modalcraft-content";

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
  const form = createCraftForm();

  // Add components to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);

  // Add modal to document
  document.body.appendChild(modal);

  // Add event handling for craft operations
  initializeCraftFormHandlers();

  // Populate initial values
  populateBaseItems("weapon");
  populateCraftTypes("weapon");
  updateBaseProperties("weapon", "Blood");

  // Add styles for automod indicators
  addAutomodStyles();
}

function createCraftForm() {
  const form = document.createElement("form");
  form.id = "craft-form";

  // Item Type Selection
  const itemTypeDiv = createFormGroup(
    "item-type",
    "Item Type:",
    createItemTypeSelector()
  );

  // Base Item Selection
  const baseItemDiv = createFormGroup(
    "base-item",
    "Base Item:",
    createBaseItemSelector()
  );

  // Craft Type Selection
  const craftTypeDiv = createFormGroup(
    "craft-type",
    "Craft Type:",
    createCraftTypeSelector()
  );

  // Base Properties Section
  const basePropsDiv = createBasePropertiesSection();

  // Additional Affixes Section
  const affixesDiv = createAffixesSection();

  // Item Name
  const nameDiv = createFormGroup(
    "item-name",
    "Item Name:",
    createItemNameInput()
  );

  // Preview Section
  const previewDiv = createPreviewSection();

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

  return form;
}

function createFormGroup(id, labelText, inputElement) {
  const formGroup = document.createElement("div");
  formGroup.className = "form-group";

  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = labelText;

  formGroup.appendChild(label);
  formGroup.appendChild(inputElement);

  return formGroup;
}

function createItemTypeSelector() {
  const select = createStyledSelect("item-type");

  // Add options
  const itemTypes = ["weapon", "armor", "helm", "shield"];
  itemTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    select.appendChild(option);
  });

  return select;
}

function createBaseItemSelector() {
  return createStyledSelect("base-item");
}

function createCraftTypeSelector() {
  return createStyledSelect("craft-type");
}

function createStyledSelect(id) {
  const select = document.createElement("select");
  select.id = id;
  select.style.width = "100%";
  select.style.padding = "8px";
  select.style.backgroundColor = "#333";
  select.style.color = "#eee";
  select.style.border = "1px solid #555";
  select.style.borderRadius = "4px";

  return select;
}

function createItemNameInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.id = "item-name";
  input.placeholder = "Enter custom item name";
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.backgroundColor = "#333";
  input.style.color = "#eee";
  input.style.border = "1px solid #555";
  input.style.borderRadius = "4px";

  return input;
}

function createBasePropertiesSection() {
  const section = document.createElement("div");
  section.className = "form-group";

  const title = document.createElement("h3");
  title.textContent = "Base Properties:";
  title.style.marginBottom = "10px";

  const container = document.createElement("div");
  container.id = "base-properties";

  section.appendChild(title);
  section.appendChild(container);

  return section;
}

function createAffixesSection() {
  const section = document.createElement("div");
  section.className = "form-group";

  const title = document.createElement("h3");
  title.textContent = "Additional Affixes:";
  title.style.marginBottom = "10px";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.id = "add-affix-button";
  addButton.textContent = "Add Affix";
  addButton.style.padding = "5px 10px";
  addButton.style.backgroundColor = "#4CAF50";
  addButton.style.color = "white";
  addButton.style.border = "none";
  addButton.style.borderRadius = "4px";
  addButton.style.cursor = "pointer";
  addButton.style.marginBottom = "10px";

  const container = document.createElement("div");
  container.id = "additional-affixes";

  section.appendChild(title);
  section.appendChild(addButton);
  section.appendChild(container);

  return section;
}

function createPreviewSection() {
  const section = document.createElement("div");
  section.className = "form-group";

  const title = document.createElement("h3");
  title.textContent = "Item Preview:";
  title.style.marginBottom = "10px";

  const container = document.createElement("div");
  container.id = "item-preview";

  section.appendChild(title);
  section.appendChild(container);

  return section;
}

function addAutomodStyles() {
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
}

/**
 * Form Handlers
 */
function initializeCraftFormHandlers() {
  const itemTypeSelect = document.getElementById("item-type");
  const baseItemSelect = document.getElementById("base-item");
  const craftTypeSelect = document.getElementById("craft-type");
  const addAffixButton = document.getElementById("add-affix-button");
  const nameInput = document.getElementById("item-name");
  const createButton = document.getElementById("submit-craft");

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
}

/**
 * Form Population
 */
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
      const propDiv = createPropertyRow(prop, index);
      basePropsContainer.appendChild(propDiv);
    });
  }
}

function createPropertyRow(prop, index) {
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
  propSlider.dataset.levelReq = prop.levelReq || 1; // Store level requirement if present
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

  // Add level requirement if present
  if (prop.levelReq && prop.levelReq > 1) {
    addLevelRequirement(propValue, prop.levelReq);
  }

  propSlider.addEventListener("input", () => {
    propValue.textContent = propSlider.value;
    if (prop.type === "percentage") {
      propValue.textContent += "%";
    }

    // Re-add level requirement if present
    if (prop.levelReq && prop.levelReq > 1) {
      addLevelRequirement(propValue, prop.levelReq);
    }

    updateItemPreview();
  });

  propDiv.appendChild(propName);
  propDiv.appendChild(propSlider);
  propDiv.appendChild(propValue);

  return propDiv;
}

function addLevelRequirement(element, levelReq) {
  const levelReqSpan = document.createElement("span");
  levelReqSpan.className = "level-req";
  levelReqSpan.textContent = `[Lvl ${levelReq}]`;
  levelReqSpan.style.marginLeft = "5px";
  levelReqSpan.style.fontSize = "0.8em";
  levelReqSpan.style.color = characterLevel >= levelReq ? "#66cc66" : "#cc6666";
  element.appendChild(levelReqSpan);
}

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
  const affixTypeSelect = createAffixTypeSelect();

  // Create affix select
  const affixSelect = createAffixSelect();

  // Create automod indicator
  const automodIndicator = createAutomodIndicator();

  // Create value slider
  const valueSlider = createValueSlider();

  // Create value display
  const valueDisplay = createValueDisplay();

  // Create remove button
  const removeButton = createRemoveButton(affixRow, affixesContainer);

  // Add event listeners
  setupAffixRowEventListeners(
    affixTypeSelect,
    affixSelect,
    valueSlider,
    valueDisplay,
    automodIndicator,
    itemType
  );

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

function createAffixTypeSelect() {
  const select = document.createElement("select");
  select.className = "affix-type";
  select.style.flex = "0 0 100px";
  select.style.marginRight = "10px";
  select.style.padding = "5px";
  select.style.backgroundColor = "#333";
  select.style.color = "#eee";
  select.style.border = "1px solid #555";
  select.style.borderRadius = "4px";

  // Add prefix/suffix options
  const prefixOption = document.createElement("option");
  prefixOption.value = "prefix";
  prefixOption.textContent = "Prefix";
  select.appendChild(prefixOption);

  const suffixOption = document.createElement("option");
  suffixOption.value = "suffix";
  suffixOption.textContent = "Suffix";
  select.appendChild(suffixOption);

  return select;
}

function createAffixSelect() {
  const select = document.createElement("select");
  select.className = "affix-select";
  select.style.flex = "1";
  select.style.marginRight = "10px";
  select.style.padding = "5px";
  select.style.backgroundColor = "#333";
  select.style.color = "#eee";
  select.style.border = "1px solid #555";
  select.style.borderRadius = "4px";

  return select;
}

function createAutomodIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "automod-indicator";
  indicator.style.flex = "0 0 80px";
  indicator.style.marginRight = "10px";
  indicator.style.padding = "5px";
  indicator.style.textAlign = "center";
  indicator.style.borderRadius = "4px";
  indicator.style.display = "none";
  indicator.style.fontSize = "0.8em";
  indicator.style.fontWeight = "bold";

  return indicator;
}

function createValueSlider() {
  const slider = document.createElement("input");
  slider.type = "range";
  slider.className = "affix-value";
  slider.style.flex = "1";
  slider.style.marginRight = "10px";

  return slider;
}

function createValueDisplay() {
  const display = document.createElement("span");
  display.className = "affix-display";
  display.style.width = "40px";
  display.style.textAlign = "right";

  return display;
}

function createRemoveButton(row, container) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "remove-affix";
  button.textContent = "X";
  button.style.padding = "5px 10px";
  button.style.backgroundColor = "#e74c3c";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.marginLeft = "10px";
  button.style.cursor = "pointer";

  button.addEventListener("click", () => {
    container.removeChild(row);
    updateItemPreview();
  });

  return button;
}

function setupAffixRowEventListeners(
  affixTypeSelect,
  affixSelect,
  valueSlider,
  valueDisplay,
  automodIndicator,
  itemType
) {
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
}

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

/**
 * Item Preview & Creation
 */
function updateItemPreview() {
  const previewContainer = document.getElementById("item-preview");
  if (!previewContainer) return;

  const itemType = document.getElementById("item-type").value;
  const baseItem = document.getElementById("base-item").value;
  const craftType = document.getElementById("craft-type").value;
  const itemName =
    document.getElementById("item-name").value || `${craftType} ${baseItem}`;

  // Get color for craft type
  const itemColor = getCraftTypeColor(craftType);

  // Start building preview HTML with both divs having the same color
  let html = `<div style="color: #${itemColor};">${itemName}</div>`;
  html += `<div style="color: #${itemColor};">${baseItem}</div>`;

  // Add strength requirement
  const strengthReq = getStrengthRequirement(baseItem);
  if (strengthReq > 0) {
    html += `<div>Required Strength: ${strengthReq}</div>`;
  }

  // Create a margin instead of a horizontal line
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

function saveCraftedItem(item) {
  console.log("Saving craft item:", item);

  fetch(`${API_BASE_URL}/api/custom-crafts`, {
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

/**
 * Utility Functions
 */
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

function getCraftTypeColor(craftType) {
  return CRAFT_TYPES_COLORS[craftType] || "ffffff";
}

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

function formatAffixProperty(prop) {
  // Skip if we don't have valid prop data
  if (!prop) return "Unknown property";

  // Prepare automod class prefix if applicable
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

  // Handle the level requirement note if present
  let levelNote = prop.note ? ` ${prop.note}` : "";

  // Handle primary stat
  let primaryDisplay = formatSingleStat(prop.stat, prop.value, prop);

  // Handle secondary stat if present
  let secondaryDisplay = "";
  if (prop.stat2) {
    secondaryDisplay = `, ${formatSingleStat(
      prop.stat2,
      prop.value2 || prop.value,
      prop
    )}`;
  }

  return `${automodPrefix}${primaryDisplay}${secondaryDisplay}${levelNote} [Lvl ${prop.levelReq}]`;
}

function formatSingleStat(statName, statValue, prop) {
  if (!statName) return "Unknown";

  // Enhanced Damage/Defense and other percentage-based stats
  if (
    statName.includes("Enhanced Damage") ||
    statName.includes("Enhanced Defense") ||
    statName.includes("Deadly Strike") ||
    statName.includes("Rate") ||
    statName.includes("Find") ||
    statName.includes("Stolen") ||
    statName.includes("Pierce") ||
    statName.includes("Resist") ||
    statName.includes("Resistances") ||
    statName.includes("Chance")
  ) {
    return `+${statValue}% ${statName}`;
  }

  // Skill bonuses
  else if (statName.includes("to ") && statName.includes("Only")) {
    return `+${statValue} ${statName}`;
  }

  // Attribute bonuses
  else if (
    statName.includes("to Strength") ||
    statName.includes("to Dexterity") ||
    statName.includes("to Vitality") ||
    statName.includes("to Energy") ||
    statName.includes("to Life") ||
    statName.includes("to Mana") ||
    statName.includes("to Light Radius") ||
    statName.includes("to Attack Rating")
  ) {
    return `+${statValue} ${statName}`;
  }

  // Replenish Life
  else if (statName.includes("Replenish Life")) {
    return `${statName} +${statValue}`;
  }

  // Default case: add a plus sign
  else {
    return `+${statValue} ${statName}`;
  }
}

// Export functions that need to be accessed globally
window.loadCustomCraftItems = loadCustomCraftItems;
window.saveCraftedItem = saveCraftedItem;

// Import baseItems, craftDefinitions, and affixPool from data file
// Normally these would be in a separate module, but they're included here for the refactor
// baseItems, craftDefinitions, and affixPool are defined in the original code

const affixPool = {
  prefix: {
    armor: [
      // Defense Enhancement Prefixes (Group 101)
      {
        name: "Sturdy",
        stat: "Enhanced Defense",
        min: 10,
        max: 20,
        levelReq: 1,
        group: 101,
      },
      {
        name: "Sturdy",
        stat: "Enhanced Defense",
        min: 21,
        max: 30,
        levelReq: 3,
        group: 101,
      },
      {
        name: "Strong",
        stat: "Enhanced Defense",
        min: 31,
        max: 40,
        levelReq: 6,
        group: 101,
      },
      {
        name: "Glorious",
        stat: "Enhanced Defense",
        min: 41,
        max: 50,
        levelReq: 14,
        group: 101,
      },
      {
        name: "Blessed",
        stat: "Enhanced Defense",
        min: 51,
        max: 65,
        levelReq: 18,
        group: 101,
      },
      {
        name: "Saintly",
        stat: "Enhanced Defense",
        min: 66,
        max: 80,
        levelReq: 23,
        group: 101,
      },
      {
        name: "Holy",
        stat: "Enhanced Defense",
        min: 81,
        max: 100,
        levelReq: 27,
        group: 101,
      },
      {
        name: "Godly",
        stat: "Enhanced Defense",
        min: 101,
        max: 200,
        levelReq: 38,
        group: 101,
      },
    ],

    // Specialized flat defense prefixes by item type
    shield: [
      {
        name: "Faithful",
        stat: "Defense",
        min: 0,
        max: 49,
        note: "(+0.5 per Level)",
        levelReq: 22,
        group: 101,
      },
    ],
    gloves: [
      {
        name: "Faithful",
        stat: "Defense",
        min: 0,
        max: 49,
        note: "(+0.5 per Level)",
        levelReq: 22,
        group: 101,
      },
    ],
    boots: [
      {
        name: "Faithful",
        stat: "Defense",
        min: 0,
        max: 49,
        note: "(+0.5 per Level)",
        levelReq: 22,
        group: 101,
      },
    ],
    belt: [
      {
        name: "Faithful",
        stat: "Defense",
        min: 0,
        max: 49,
        note: "(+0.5 per Level)",
        levelReq: 22,
        group: 101,
      },
    ],
    chest: [
      {
        name: "Faithful",
        stat: "Defense",
        min: 3,
        max: 297,
        note: "(+3 per Level)",
        levelReq: 22,
        group: 101,
      },
    ],

    weapon: [
      // Enhanced Damage Prefixes (Group 105)
      {
        name: "Jagged",
        stat: "Enhanced Damage",
        min: 10,
        max: 20,
        levelReq: 1,
        group: 105,
      },
      {
        name: "Deadly",
        stat: "Enhanced Damage",
        min: 21,
        max: 30,
        levelReq: 3,
        group: 105,
      },
      {
        name: "Vicious",
        stat: "Enhanced Damage",
        min: 31,
        max: 40,
        levelReq: 6,
        group: 105,
      },
      {
        name: "Brutal",
        stat: "Enhanced Damage",
        min: 41,
        max: 50,
        levelReq: 10,
        group: 105,
      },
      {
        name: "Massive",
        stat: "Enhanced Damage",
        min: 51,
        max: 65,
        levelReq: 15,
        group: 105,
      },
      {
        name: "Savage",
        stat: "Enhanced Damage",
        min: 66,
        max: 80,
        levelReq: 19,
        group: 105,
      },
      {
        name: "Merciless",
        stat: "Enhanced Damage",
        min: 81,
        max: 100,
        levelReq: 24,
        group: 105,
      },
      {
        name: "Ferocious",
        stat: "Enhanced Damage",
        min: 101,
        max: 200,
        levelReq: 33,
        group: 105,
      },
      {
        name: "Cruel",
        stat: "Enhanced Damage",
        min: 201,
        max: 300,
        levelReq: 43,
        group: 105,
      },
      {
        name: "Visceral",
        stat: "Enhanced Damage",
        min: 301,
        max: 400,
        levelReq: 69,
        group: 105,
        itemTypes: [
          "Missile Weapon",
          "Amazon Javelin",
          "Knife",
          "Club",
          "Tipped Mace",
          "Throwing Axe",
        ],
      },

      // Attack Rating + Enhanced Damage (Group 111)
      {
        name: "Sharp",
        stat: "Attack Rating",
        min: 10,
        max: 20,
        stat2: "Enhanced Damage",
        min2: 10,
        max2: 20,
        levelReq: 3,
        group: 111,
      },
      {
        name: "Fine",
        stat: "Attack Rating",
        min: 21,
        max: 40,
        stat2: "Enhanced Damage",
        min2: 21,
        max2: 30,
        levelReq: 9,
        group: 111,
      },
      {
        name: "Warrior's",
        stat: "Attack Rating",
        min: 41,
        max: 60,
        stat2: "Enhanced Damage",
        min2: 31,
        max2: 40,
        levelReq: 13,
        group: 111,
      },
      {
        name: "Soldier's",
        stat: "Attack Rating",
        min: 61,
        max: 80,
        stat2: "Enhanced Damage",
        min2: 41,
        max2: 50,
        levelReq: 19,
        group: 111,
      },
      {
        name: "Knight's",
        stat: "Attack Rating",
        min: 81,
        max: 100,
        stat2: "Enhanced Damage",
        min2: 51,
        max2: 65,
        levelReq: 30,
        group: 111,
      },
      {
        name: "Lord's",
        stat: "Attack Rating",
        min: 101,
        max: 120,
        stat2: "Enhanced Damage",
        min2: 66,
        max2: 80,
        levelReq: 39,
        group: 111,
      },
      {
        name: "King's",
        stat: "Attack Rating",
        min: 121,
        max: 150,
        stat2: "Enhanced Damage",
        min2: 81,
        max2: 100,
        levelReq: 48,
        group: 111,
      },
      {
        name: "Master's",
        stat: "Attack Rating",
        min: 151,
        max: 250,
        stat2: "Enhanced Damage",
        min2: 101,
        max2: 150,
        levelReq: 48,
        group: 111,
      },
      {
        name: "Grandmaster's",
        stat: "Attack Rating",
        min: 251,
        max: 300,
        stat2: "Enhanced Damage",
        min2: 151,
        max2: 200,
        levelReq: 61,
        group: 111,
      },
    ],

    quiver: [
      // Quiver-specific prefixes
      {
        name: "Jagged",
        stat: "Enhanced Damage",
        min: 10,
        max: 20,
        levelReq: 1,
        group: 105,
      },
      {
        name: "Deadly",
        stat: "Enhanced Damage",
        min: 21,
        max: 30,
        levelReq: 3,
        group: 105,
      },
      {
        name: "Vicious",
        stat: "Enhanced Damage",
        min: 31,
        max: 40,
        levelReq: 6,
        group: 105,
      },
      {
        name: "Brutal",
        stat: "Enhanced Damage",
        min: 41,
        max: 50,
        levelReq: 10,
        group: 105,
      },
      {
        name: "Massive",
        stat: "Enhanced Damage",
        min: 51,
        max: 65,
        levelReq: 15,
        group: 105,
      },
      {
        name: "Savage",
        stat: "Enhanced Damage",
        min: 66,
        max: 80,
        levelReq: 19,
        group: 105,
      },

      // Quiver damage bonuses
      {
        name: "Scarlet",
        stat: "to Minimum Damage",
        min: 1,
        max: 4,
        levelReq: 6,
        group: 103,
      },
      {
        name: "Crimson",
        stat: "to Minimum Damage",
        min: 5,
        max: 8,
        levelReq: 30,
        group: 103,
      },
      {
        name: "Cardinal",
        stat: "to Minimum Damage",
        min: 10,
        max: 14,
        levelReq: 30,
        group: 103,
      },
      {
        name: "Carbuncle",
        stat: "to Maximum Damage",
        min: 1,
        max: 5,
        levelReq: 9,
        group: 104,
      },
      {
        name: "Carmine",
        stat: "to Maximum Damage",
        min: 6,
        max: 9,
        levelReq: 27,
        group: 104,
      },
      {
        name: "Vermillion",
        stat: "to Maximum Damage",
        min: 11,
        max: 15,
        levelReq: 50,
        group: 104,
      },

      // Pierce chance for quivers (Group 143)
      {
        name: "Penetrating",
        stat: "Chance to Pierce",
        min: 5,
        max: 10,
        levelReq: 10,
        group: 143,
      },
      {
        name: "Puncturing",
        stat: "Chance to Pierce",
        min: 11,
        max: 20,
        levelReq: 25,
        group: 143,
      },
      {
        name: "Piercing",
        stat: "Chance to Pierce",
        min: 21,
        max: 30,
        levelReq: 40,
        group: 143,
      },
      {
        name: "Impaling",
        stat: "Chance to Pierce",
        min: 31,
        max: 40,
        levelReq: 55,
        group: 143,
      },
    ],

    circlet: [
      // Circlet-specific prefixes
      {
        name: "Jagged",
        stat: "Enhanced Damage",
        min: 10,
        max: 20,
        levelReq: 1,
        group: 105,
      },
      {
        name: "Visionary",
        stat: "Bonus to Attack Rating",
        min: 1,
        max: 99,
        note: "(1% per Level)",
        levelReq: 18,
        group: 111,
      },
    ],

    all: [
      // Attack Rating prefixes (Group 110)
      {
        name: "Bronze",
        stat: "to Attack Rating",
        min: 10,
        max: 20,
        levelReq: 1,
        group: 110,
      },
      {
        name: "Iron",
        stat: "to Attack Rating",
        min: 21,
        max: 40,
        levelReq: 3,
        group: 110,
      },
      {
        name: "Steel",
        stat: "to Attack Rating",
        min: 41,
        max: 60,
        levelReq: 6,
        group: 110,
      },
      {
        name: "Silver",
        stat: "to Attack Rating",
        min: 61,
        max: 80,
        levelReq: 9,
        group: 110,
      },
      {
        name: "Gold",
        stat: "to Attack Rating",
        min: 81,
        max: 100,
        levelReq: 12,
        group: 110,
      },
      {
        name: "Platinum",
        stat: "to Attack Rating",
        min: 101,
        max: 120,
        levelReq: 16,
        group: 110,
      },

      // Light Radius prefixes (Group 112)
      {
        name: "Glimmering",
        stat: "to Light Radius",
        min: 1,
        max: 1,
        levelReq: 1,
        group: 112,
      },
      {
        name: "Glowing",
        stat: "to Light Radius",
        min: 2,
        max: 2,
        levelReq: 4,
        group: 112,
      },

      // MF prefixes (Group 114)
      {
        name: "Felicitous",
        stat: "Better Chance of Getting Magic Items",
        min: 5,
        max: 10,
        levelReq: 3,
        group: 114,
      },
      {
        name: "Fortuitous",
        stat: "Better Chance of Getting Magic Items",
        min: 11,
        max: 15,
        levelReq: 8,
        group: 114,
      },

      // Elemental Resistance prefixes - Cold (Group 117)
      {
        name: "Azure",
        stat: "Cold Resist",
        min: 5,
        max: 10,
        levelReq: 3,
        group: 117,
      },
      {
        name: "Lapis",
        stat: "Cold Resist",
        min: 11,
        max: 20,
        levelReq: 9,
        group: 117,
      },
      {
        name: "Cobalt",
        stat: "Cold Resist",
        min: 21,
        max: 30,
        levelReq: 13,
        group: 117,
      },
      {
        name: "Sapphire",
        stat: "Cold Resist",
        min: 31,
        max: 40,
        levelReq: 18,
        group: 117,
      },

      // Elemental Resistance prefixes - Fire (Group 118)
      {
        name: "Crimson",
        stat: "Fire Resist",
        min: 5,
        max: 10,
        levelReq: 3,
        group: 118,
      },
      {
        name: "Russet",
        stat: "Fire Resist",
        min: 11,
        max: 20,
        levelReq: 9,
        group: 118,
      },
      {
        name: "Garnet",
        stat: "Fire Resist",
        min: 21,
        max: 30,
        levelReq: 13,
        group: 118,
      },
      {
        name: "Ruby",
        stat: "Fire Resist",
        min: 31,
        max: 40,
        levelReq: 18,
        group: 118,
      },

      // Elemental Resistance prefixes - Lightning (Group 119)
      {
        name: "Tangerine",
        stat: "Lightning Resist",
        min: 5,
        max: 10,
        levelReq: 3,
        group: 119,
      },
      {
        name: "Ocher",
        stat: "Lightning Resist",
        min: 11,
        max: 20,
        levelReq: 9,
        group: 119,
      },
      {
        name: "Coral",
        stat: "Lightning Resist",
        min: 21,
        max: 30,
        levelReq: 13,
        group: 119,
      },
      {
        name: "Amber",
        stat: "Lightning Resist",
        min: 31,
        max: 40,
        levelReq: 18,
        group: 119,
      },

      // Elemental Resistance prefixes - Poison (Group 120)
      {
        name: "Beryl",
        stat: "Poison Resist",
        min: 5,
        max: 10,
        levelReq: 3,
        group: 120,
      },
      {
        name: "Viridian",
        stat: "Poison Resist",
        min: 11,
        max: 20,
        levelReq: 9,
        group: 120,
      },
      {
        name: "Jade",
        stat: "Poison Resist",
        min: 21,
        max: 30,
        levelReq: 13,
        group: 120,
      },
      {
        name: "Emerald",
        stat: "Poison Resist",
        min: 31,
        max: 40,
        levelReq: 18,
        group: 120,
      },

      // All Resistance prefixes (Group 116)
      {
        name: "Shimmering",
        stat: "All Resistances",
        min: 3,
        max: 7,
        levelReq: 6,
        group: 116,
      },
      {
        name: "Rainbow",
        stat: "All Resistances",
        min: 8,
        max: 11,
        levelReq: 15,
        group: 116,
      },
      {
        name: "Scintillating",
        stat: "All Resistances",
        min: 12,
        max: 15,
        levelReq: 25,
        group: 116,
      },
      {
        name: "Prismatic",
        stat: "All Resistances",
        min: 16,
        max: 20,
        levelReq: 31,
        group: 116,
      },
      {
        name: "Chromatic",
        stat: "All Resistances",
        min: 21,
        max: 30,
        levelReq: 41,
        group: 116,
      },
    ],
  },

  suffix: {
    weapon: [
      // Weapon suffixes
      {
        name: "of Slaying",
        stat: "Damage to Demons",
        min: 51,
        max: 100,
        levelReq: 18,
        group: 123,
      },
      {
        name: "of Maiming",
        stat: "Damage to Undead",
        min: 51,
        max: 100,
        levelReq: 18,
        group: 142,
      },
      {
        name: "of Swiftness",
        stat: "Increased Attack Speed",
        min: 10,
        max: 20,
        levelReq: 15,
        group: 135,
      },
      {
        name: "of Quickness",
        stat: "Faster Cast Rate",
        min: 10,
        max: 15,
        levelReq: 15,
        group: 136,
      },
      {
        name: "of Flames",
        stat: "to Fire Damage",
        min: 21,
        max: 40,
        levelReq: 18,
        group: 138,
      },
      {
        name: "of Frost",
        stat: "to Cold Damage",
        min: 11,
        max: 20,
        levelReq: 18,
        group: 137,
      },
      {
        name: "of Shock",
        stat: "to Lightning Damage",
        min: 41,
        max: 80,
        levelReq: 25,
        group: 139,
      },
      {
        name: "of Life Stolen",
        stat: "Life Stolen per Hit",
        min: 1,
        max: 4,
        levelReq: 15,
        group: 131,
      },

      // Open Wounds suffixes (Group 170)
      {
        name: "of Cultist's",
        stat: "Chance of Open Wounds",
        min: 20,
        max: 20,
        stat2: "Open Wounds Damage per Second",
        min2: 30,
        max2: 40,
        levelReq: 25,
        group: 170,
      },
      {
        name: "of Bloodthirster's",
        stat: "Chance of Open Wounds",
        min: 20,
        max: 20,
        stat2: "Open Wounds Damage per Second",
        min2: 136,
        max2: 190,
        levelReq: 45,
        group: 170,
      },
      {
        name: "of Gorelust's",
        stat: "Chance of Open Wounds",
        min: 20,
        max: 20,
        stat2: "Open Wounds Damage per Second",
        min2: 224,
        max2: 310,
        levelReq: 65,
        group: 170,
      },

      // Assassin skill automods
      {
        name: "of WoF",
        stat: "to Wake of Fire (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
        levelReq: 30,
        group: 125,
      },
      {
        name: "of Traps",
        stat: "to Traps (Assassin Only)",
        min: 1,
        max: 2,
        automod: "ass",
        levelReq: 15,
        group: 125,
      },
      {
        name: "of LS",
        stat: "to Lightning Sentry (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
        levelReq: 30,
        group: 125,
      },
      {
        name: "of DS",
        stat: "to Death Sentry (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
        levelReq: 30,
        group: 125,
      },
      {
        name: "of Fire Blast",
        stat: "to Fire Blast (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
        levelReq: 24,
        group: 125,
      },
      {
        name: "of Inferno",
        stat: "to Wake of Inferno (Assassin Only)",
        min: 1,
        max: 3,
        automod: "ass",
        levelReq: 30,
        group: 125,
      },

      // Sorceress skill automods
      {
        name: "of Nova",
        stat: "to Nova (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
        levelReq: 30,
        group: 125,
      },
      {
        name: "of Lightning",
        stat: "to Lightning (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
        levelReq: 12,
        group: 125,
      },
      {
        name: "of Fire Ball",
        stat: "to Fire Ball (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
        levelReq: 12,
        group: 125,
      },
      {
        name: "of Blizzard",
        stat: "to Blizzard (Sorceress Only)",
        min: 1,
        max: 3,
        automod: "sor",
        levelReq: 24,
        group: 125,
      },
    ],

    armor: [
      {
        name: "of the Whale",
        stat: "to Life",
        min: 41,
        max: 80,
        levelReq: 30,
        group: 113,
      },
      {
        name: "of Health",
        stat: "to Life",
        min: 21,
        max: 40,
        levelReq: 20,
        group: 113,
      },
      {
        name: "of Warding",
        stat: "All Resistances",
        min: 11,
        max: 15,
        levelReq: 30,
        group: 116,
      },
      {
        name: "of Deflection",
        stat: "Faster Block Rate",
        min: 10,
        max: 20,
        levelReq: 18,
        group: 152,
      },
      {
        name: "of Absorption",
        stat: "Magic Damage Reduction",
        min: 1,
        max: 2,
        levelReq: 25,
        group: 128,
      },
    ],

    helmet: [
      {
        name: "of the Mind",
        stat: "Energy",
        min: 6,
        max: 9,
        levelReq: 20,
        group: 126,
      },
      {
        name: "of Clarity",
        stat: "Mana",
        min: 21,
        max: 40,
        levelReq: 22,
        group: 115,
      },
      {
        name: "of Light",
        stat: "Light Radius",
        min: 1,
        max: 3,
        levelReq: 5,
        group: 112,
      },
    ],

    all: [
      // Gold and MF suffixes
      {
        name: "of Worth",
        stat: "Extra Gold from Monsters",
        min: 81,
        max: 120,
        levelReq: 35,
        group: 122,
      },
      {
        name: "of Fortune",
        stat: "Better Chance of Getting Magic Items",
        min: 26,
        max: 40,
        levelReq: 40,
        group: 114,
      },

      // Stat bonuses
      {
        name: "of Vita",
        stat: "to Vitality",
        min: 6,
        max: 9,
        levelReq: 25,
        group: 127,
      },
      {
        name: "of the Mind",
        stat: "to Energy",
        min: 6,
        max: 9,
        levelReq: 20,
        group: 126,
      },
      {
        name: "of Dexterity",
        stat: "to Dexterity",
        min: 6,
        max: 9,
        levelReq: 20,
        group: 124,
      },
      {
        name: "of Strength",
        stat: "to Strength",
        min: 6,
        max: 9,
        levelReq: 20,
        group: 123,
      },

      // Life and Mana leech/replenish
      {
        name: "of Life",
        stat: "Life after each Kill",
        min: 1,
        max: 3,
        levelReq: 12,
        group: 200,
      },
      {
        name: "of Regeneration",
        stat: "Replenish Life",
        min: 5,
        max: 10,
        levelReq: 15,
        group: 130,
      },
      {
        name: "of Regrowth",
        stat: "Replenish Life",
        min: 11,
        max: 18,
        levelReq: 30,
        group: 130,
      },
    ],
  },
};

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
    { name: "Quilted Armor", itemClass: "Chest", strengthReq: 12 },
    { name: "Leather Armor", itemClass: "Chest", strengthReq: 15 },
    { name: "Hard Leather Armor", itemClass: "Chest", strengthReq: 20 },
    { name: "Studded Leather", itemClass: "Chest", strengthReq: 27 },
    { name: "Ring Mail", itemClass: "Chest", strengthReq: 36 },
    { name: "Scale Mail", itemClass: "Chest", strengthReq: 44 },
    { name: "Chain Mail", itemClass: "Chest", strengthReq: 48 },
    { name: "Breast Plate", itemClass: "Chest", strengthReq: 30 },
    { name: "Splint Mail", itemClass: "Chest", strengthReq: 51 },
    { name: "Plate Mail", itemClass: "Chest", strengthReq: 65 },
    { name: "Field Plate", itemClass: "Chest", strengthReq: 55 },
    { name: "Gothic Plate", itemClass: "Chest", strengthReq: 70 },
    { name: "Full Plate Mail", itemClass: "Chest", strengthReq: 80 },
    { name: "Ancient Armor", itemClass: "Chest", strengthReq: 100 },
    { name: "Light Plate", itemClass: "Chest", strengthReq: 41 },
    { name: "Ghost Armor", itemClass: "Chest", strengthReq: 38 },
    { name: "Serpentskin Armor", itemClass: "Chest", strengthReq: 43 },
    { name: "Demonhide Armor", itemClass: "Chest", strengthReq: 50 },
    { name: "Trellised Armor", itemClass: "Chest", strengthReq: 61 },
    { name: "Linked Mail", itemClass: "Chest", strengthReq: 74 },
    { name: "Tigulated Mail", itemClass: "Chest", strengthReq: 86 },
    { name: "Mesh Armor", itemClass: "Chest", strengthReq: 92 },
    { name: "Cuirass", itemClass: "Chest", strengthReq: 65 },
    { name: "Russet Armor", itemClass: "Chest", strengthReq: 97 },
    { name: "Templar Coat", itemClass: "Chest", strengthReq: 118 },
    { name: "Sharktooth Armor", itemClass: "Chest", strengthReq: 103 },
    { name: "Embossed Plate", itemClass: "Chest", strengthReq: 125 },
    { name: "Chaos Armor", itemClass: "Chest", strengthReq: 140 },
    { name: "Ornate Plate", itemClass: "Chest", strengthReq: 170 },
    { name: "Mage Plate", itemClass: "Chest", strengthReq: 55 },
    { name: "Dusk Shroud", itemClass: "Chest", strengthReq: 77 },
    { name: "Wyrmhide", itemClass: "Chest", strengthReq: 84 },
    { name: "Scarab Husk", itemClass: "Chest", strengthReq: 95 },
    { name: "Wire Fleece", itemClass: "Chest", strengthReq: 111 },
    { name: "Diamond Mail", itemClass: "Chest", strengthReq: 131 },
    { name: "Loricated Mail", itemClass: "Chest", strengthReq: 149 },
    { name: "Boneweave", itemClass: "Chest", strengthReq: 158 },
    { name: "Great Hauberk", itemClass: "Chest", strengthReq: 118 },
    { name: "Balrog Skin", itemClass: "Chest", strengthReq: 165 },
    { name: "Hellforge Plate", itemClass: "Chest", strengthReq: 196 },
    { name: "Kraken Shell", itemClass: "Chest", strengthReq: 174 },
    { name: "Lacquered Plate", itemClass: "Chest", strengthReq: 208 },
    { name: "Archon Plate", itemClass: "Chest", strengthReq: 103 },
    { name: "Shadow Plate", itemClass: "Chest", strengthReq: 220 },
    { name: "Sacred Armor", itemClass: "Chest", strengthReq: 232 },
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
    { name: "Buckler", itemClass: "Shield", strengthReq: 12 },
    { name: "Small Shield", itemClass: "Shield", strengthReq: 22 },
    { name: "Large Shield", itemClass: "Shield", strengthReq: 34 },
    { name: "Kite Shield", itemClass: "Shield", strengthReq: 47 },
    { name: "Tower Shield", itemClass: "Shield", strengthReq: 75 },
    { name: "Gothic Shield", itemClass: "Shield", strengthReq: 60 },
    { name: "Bone Shield", itemClass: "Shield", strengthReq: 25 },
    { name: "Spiked Shield", itemClass: "Shield", strengthReq: 30 },
    { name: "Defender", itemClass: "Shield", strengthReq: 38 },
  ],
  gloves: [
    { name: "Leather Gloves", itemClass: "Gloves", strengthReq: 0 },
    { name: "Heavy Gloves", itemClass: "Gloves", strengthReq: 0 },
    { name: "Chain Gloves", itemClass: "Gloves", strengthReq: 25 },
    { name: "Gauntlets", itemClass: "Gloves", strengthReq: 45 },
    { name: "Gauntlets", itemClass: "Gloves", strengthReq: 60 },
    { name: "Demonhide Gloves", itemClass: "Gloves", strengthReq: 20 },
    { name: "Sharkskin Gloves", itemClass: "Gloves", strengthReq: 20 },
    { name: "Heavy Bracers", itemClass: "Gloves", strengthReq: 58 },
    { name: "Battle Gauntlets", itemClass: "Gloves", strengthReq: 88 },
    { name: "War Gauntlets", itemClass: "Gloves", strengthReq: 110 },
    { name: "Bramble Mitts", itemClass: "Gloves", strengthReq: 50 },
    { name: "Vampirebone Gloves", itemClass: "Gloves", strengthReq: 50 },
    { name: "Vambraces", itemClass: "Gloves", strengthReq: 106 },
    { name: "Crusader Gauntlets", itemClass: "Gloves", strengthReq: 151 },
    { name: "Ogre Gauntlets", itemClass: "Gloves", strengthReq: 185 },
  ],
  belt: [
    { name: "Sash", itemClass: "Belt", strengthReq: 0 },
    { name: "Light Belt", itemClass: "Belt", strengthReq: 0 },
    { name: "Belt", itemClass: "Belt", strengthReq: 25 },
    { name: "Heavy Belt", itemClass: "Belt", strengthReq: 45 },
    { name: "Plated Belt", itemClass: "Belt", strengthReq: 60 },
    { name: "Demonhide Sash", itemClass: "Belt", strengthReq: 20 },
    { name: "Sharkskin Belt", itemClass: "Belt", strengthReq: 20 },
    { name: "Mesh Belt", itemClass: "Belt", strengthReq: 58 },
    { name: "Battle Belt", itemClass: "Belt", strengthReq: 88 },
    { name: "War Belt", itemClass: "Belt", strengthReq: 110 },
    { name: "Spiderweb Sash", itemClass: "Belt", strengthReq: 50 },
    { name: "Vampirefang Belt", itemClass: "Belt", strengthReq: 50 },
    { name: "Mithril Coil", itemClass: "Belt", strengthReq: 106 },
    { name: "Troll Belt", itemClass: "Belt", strengthReq: 151 },
    { name: "Colossus Girdle", itemClass: "Belt", strengthReq: 185 },
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

function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all tab buttons
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show the selected tab
  document.getElementById(tabName + "Tab").classList.add("active");

  // Add active class to the clicked button
  document
    .querySelector(`.tab[onclick="showTab('${tabName}')"]`)
    .classList.add("active");
}

// Update the onUserLoggedIn function to also initialize the craft system
function onUserLoggedIn(event) {
  currentUser = event.detail.userId;

  // Initialize custom craft system
  initializeCustomCraftSystem();

  // In the original code, this would show the floating button
  // Instead of showing the floating button, we'll make sure our tab is ready
  setupCustomItemsTab();
}

// Set up the Custom Items tab content
function setupCustomItemsTab() {
  // Check if the craft modal already exists, if not, create it
  if (!document.getElementById("craft-modal")) {
    createCraftModal();
  }

  // Load custom items for the user
  loadCustomCraftItems();

  // Add items to the Custom Items tab list
  updateCustomItemsList();
}

// Update the custom items list in the tab
function updateCustomItemsList() {
  const craftItemsList = document.getElementById("craft-items-list");

  // Clear existing content except for the first paragraph
  const firstParagraph = craftItemsList.querySelector("p:first-child");
  craftItemsList.innerHTML = "";
  if (firstParagraph) {
    craftItemsList.appendChild(firstParagraph);
  }

  // Fetch custom items for the user
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found, user not logged in");
    return;
  }

  fetch(`${API_BASE_URL}/api/custom-crafts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.items && data.items.length > 0) {
        // Create a list of items
        const itemList = document.createElement("ul");
        itemList.className = "custom-items-list";

        data.items.forEach((item) => {
          const listItem = document.createElement("li");
          const itemColor = getCraftTypeColor(item.craftType);

          listItem.innerHTML = `
                    <span style="color: #${itemColor};">${item.itemName}</span>
                    <span class="item-type">(${item.itemType})</span>
                `;

          itemList.appendChild(listItem);
        });

        craftItemsList.appendChild(itemList);
      } else {
        // No items found
        const noItems = document.createElement("p");
        noItems.textContent =
          "You have no custom items yet. Create one to get started!";
        craftItemsList.appendChild(noItems);
      }
    })
    .catch((error) => {
      console.error("Error loading custom craft items:", error);
      craftItemsList.innerHTML +=
        "<p>Error loading your custom items. Please try again.</p>";
    });
}

// Update the saveCraftedItem function to refresh the items list
function saveCraftedItem(item) {
  console.log("Saving craft item:", item);

  fetch(`${API_BASE_URL}/api/custom-crafts`, {
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

        // Update the items list in the Custom Items tab
        updateCustomItemsList();
      } else {
        alert("Error creating item: " + (data.message || "Unknown error"));
      }
    })
    .catch((error) => {
      console.error("Error saving custom craft item:", error);
      alert("Error saving item: " + error.message);
    });
}

// Add styles for the Custom Items tab
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
        .craft-items-container {
            padding: 10px;
        }
        
        #modal-create-craft-button {
            padding: 10px 15px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 15px;
        }
        
        .custom-items-list {
            list-style: none;
            padding: 0;
        }
        
        .custom-items-list li {
            padding: 8px;
            margin-bottom: 5px;
            background-color: #2c2c2c;
            border-radius: 4px;
        }
        
        .item-type {
            color: #888;
            font-size: 0.9em;
            margin-left: 5px;
        }
    `;
  document.head.appendChild(style);
});
