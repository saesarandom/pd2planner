// corruption.js - Lightweight PD2-inspired Corruption System
// Clean, efficient implementation with no heavy loops or CPU cycles

// Corruption storage
window.itemCorruptions = window.itemCorruptions || {};

// Corruption definitions by item type
const CORRUPTIONS = {
  helm: [
    { mod: "+[20-30] to Life", type: "numeric", range: [20, 30] },
    { mod: "+[15-25] to Mana", type: "numeric", range: [15, 25] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "All Resistances +[5-10]", type: "numeric", range: [5, 10] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "Socketed ([1-2])", type: "socket", range: [1, 2] }
  ],
  armor: [
    { mod: "+[40-60] to Life", type: "numeric", range: [40, 60] },
    { mod: "+[30-50]% Enhanced Defense", type: "numeric", range: [30, 50] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "All Resistances +[7-12]", type: "numeric", range: [7, 12] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "Physical Damage Taken Reduced by [3-5]%", type: "numeric", range: [3, 5] },
    { mod: "Socketed ([1-3])", type: "socket", range: [1, 3] }
  ],
  weapon: [
    { mod: "+[30-50]% Enhanced Damage", type: "numeric", range: [30, 50] },
    { mod: "+[150-250] to Attack Rating", type: "numeric", range: [150, 250] },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "Ignore Target's Defense", type: "fixed" },
    { mod: "[3-6]% Life Stolen per Hit", type: "numeric", range: [3, 6] },
    { mod: "[3-6]% Mana Stolen per Hit", type: "numeric", range: [3, 6] },
    { mod: "Socketed ([1-2])", type: "socket", range: [1, 2] }
  ],
  shield: [
    { mod: "+[30-50]% Enhanced Defense", type: "numeric", range: [30, 50] },
    { mod: "+20% Faster Block Rate", type: "fixed" },
    { mod: "All Resistances +[8-15]", type: "numeric", range: [8, 15] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "Socketed ([1-2])", type: "socket", range: [1, 2] }
  ],
  gloves: [
    { mod: "+[20-30] to Life", type: "numeric", range: [20, 30] },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "All Resistances +[5-10]", type: "numeric", range: [5, 10] },
    { mod: "+[50-100] to Attack Rating", type: "numeric", range: [50, 100] },
    { mod: "[2-4]% Life Stolen per Hit", type: "numeric", range: [2, 4] },
    { mod: "[2-4]% Mana Stolen per Hit", type: "numeric", range: [2, 4] }
  ],
  belt: [
    { mod: "+[30-50] to Life", type: "numeric", range: [30, 50] },
    { mod: "All Resistances +[5-10]", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+[60-100]% Extra Gold from Monsters", type: "numeric", range: [60, 100] },
    { mod: "+[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "Replenish Life +[10-20]", type: "numeric", range: [10, 20] }
  ],
  boots: [
    { mod: "+[30-50] to Life", type: "numeric", range: [30, 50] },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "All Resistances +[8-15]", type: "numeric", range: [8, 15] },
    { mod: "+[30-50]% Enhanced Defense", type: "numeric", range: [30, 50] },
    { mod: "Indestructible", type: "fixed" }
  ],
  ring: [
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "+[15-30] to Mana", type: "numeric", range: [15, 30] },
    { mod: "All Resistances +[5-12]", type: "numeric", range: [5, 12] },
    { mod: "+[50-100] to Attack Rating", type: "numeric", range: [50, 100] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "[2-4]% Life Stolen per Hit", type: "numeric", range: [2, 4] }
  ],
  amulet: [
    { mod: "+[30-60] to Life", type: "numeric", range: [30, 60] },
    { mod: "+[20-40] to Mana", type: "numeric", range: [20, 40] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "All Resistances +[8-15]", type: "numeric", range: [8, 15] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "[3-6]% Life Stolen per Hit", type: "numeric", range: [3, 6] }
  ]
};

// Section mapping for dropdowns to item types
const SECTION_MAP = {
  'helms-dropdown': 'helm',
  'armors-dropdown': 'armor', 
  'weapons-dropdown': 'weapon',
  'offs-dropdown': 'shield',
  'gloves-dropdown': 'gloves',
  'belts-dropdown': 'belt',
  'boots-dropdown': 'boots',
  'ringsone-dropdown': 'ring',
  'ringstwo-dropdown': 'ring',
  'amulets-dropdown': 'amulet'
};

// Initialize corruption system
function initCorruptionSystem() {
  createCorruptionModal();
  attachCorruptionButtons();
  hookIntoItemUpdates();
  
  // Listen for ALL changes that might affect items
  const elementsToWatch = [
    'lvlValue', 'str', 'dex', 'vit', 'enr',
    ...Object.keys(SECTION_MAP)
  ];
  
  elementsToWatch.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener('change', () => {
        setTimeout(() => restoreAllCorruptions(), 100);
      });
      element.addEventListener('input', () => {
        setTimeout(() => restoreAllCorruptions(), 100);
      });
    }
  });
}

// Add this helper function:
function restoreAllCorruptions() {
  Object.keys(SECTION_MAP).forEach(dropdownId => {
    const corruption = window.itemCorruptions[dropdownId];
    if (corruption) {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown && dropdown.value) {
        displayCorruption(dropdownId, corruption.text);
      }
    }
  });
}

// Create corruption modal
function createCorruptionModal() {
  if (document.getElementById('corruptionModal')) return;

  const modalHTML = `
    <div id="corruptionModal" class="modal" style="
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.8);
    ">
      <div class="modal-content" style="
        background-color: #2b2b2b;
        margin: 5% auto;
        padding: 20px;
        border: 2px solid #444;
        border-radius: 8px;
        width: 500px;
        max-height: 70vh;
        overflow-y: auto;
        color: white;
        font-family: Arial, sans-serif;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ff6b6b;">Corruption Options</h2>
          <button id="closeCorruptionModal" style="
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">×</button>
        </div>
        <div id="corruptionList"></div>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
          <button id="removeCorruption" style="
            background-color: #666;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Remove Corruption</button>
          <button id="cancelCorruption" style="
            background-color: #444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Attach modal event listeners
  document.getElementById('closeCorruptionModal').onclick = closeCorruptionModal;
  document.getElementById('cancelCorruption').onclick = closeCorruptionModal;
  document.getElementById('removeCorruption').onclick = removeCurrentCorruption;
  
  // Close on background click
  document.getElementById('corruptionModal').onclick = (e) => {
    if (e.target.id === 'corruptionModal') closeCorruptionModal();
  };
}

// Attach corruption buttons to existing corrupt buttons
function attachCorruptionButtons() {
  const buttonMap = {
    'corruptHelm': 'helms-dropdown',
    'corruptArmor': 'armors-dropdown', 
    'corruptWeapon': 'weapons-dropdown',
    'corruptShield': 'offs-dropdown',
    'corruptGlove': 'gloves-dropdown',
    'corruptBelt': 'belts-dropdown',
    'corruptBoot': 'boots-dropdown',
    'corruptRingOne': 'ringsone-dropdown',
    'corruptRingTwo': 'ringstwo-dropdown',
    'corruptAmulet': 'amulets-dropdown'
  };
  
  Object.entries(buttonMap).forEach(([buttonId, dropdownId]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.onclick = () => openCorruptionModal(dropdownId);
    }
  });
}

// Open corruption modal for specific item slot
function openCorruptionModal(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown || !dropdown.value) {
    alert('Please select an item first!');
    return;
  }
  
  const itemType = SECTION_MAP[dropdownId];
  const corruptions = CORRUPTIONS[itemType];
  if (!corruptions) {
    alert('No corruptions available for this item type.');
    return;
  }
  
  currentCorruptionSlot = dropdownId;
  populateCorruptionList(corruptions);
  document.getElementById('corruptionModal').style.display = 'block';
}

// Populate corruption options in modal
function populateCorruptionList(corruptions) {
  const listContainer = document.getElementById('corruptionList');
  listContainer.innerHTML = '';
  
  corruptions.forEach(corruption => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 12px;
      margin: 8px 0;
      background-color: #333;
      border: 1px solid #555;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    if (corruption.type === 'numeric') {
      item.innerHTML = `
        <div style="margin-bottom: 8px; color: #ff6b6b;">${corruption.mod.replace(/\[.*?\]/g, '[Range]')}</div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="min-width: 60px;">Value:</span>
          <input type="range" 
                 min="${corruption.range[0]}" 
                 max="${corruption.range[1]}" 
                 value="${corruption.range[0]}" 
                 style="flex: 1;"
                 onchange="updateCorruptionPreview(this, '${corruption.mod}')"
                 oninput="updateCorruptionPreview(this, '${corruption.mod}')">
          <span class="value-display" style="min-width: 30px; text-align: center;">${corruption.range[0]}</span>
        </div>
        <div class="preview" style="margin-top: 8px; color: #ffd700; font-style: italic;">${generateCorruptionText(corruption.mod, corruption.range[0])}</div>
      `;
      
      item.onclick = (e) => {
        if (e.target.type !== 'range') {
          const slider = item.querySelector('input[type="range"]');
          applyCorruption(corruption.mod, parseInt(slider.value));
        }
      };
    } else if (corruption.type === 'socket') {
      item.innerHTML = `
        <div style="margin-bottom: 8px; color: #ff6b6b;">Add Sockets</div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="min-width: 60px;">Sockets:</span>
          <input type="range" 
                 min="${corruption.range[0]}" 
                 max="${corruption.range[1]}" 
                 value="${corruption.range[0]}" 
                 style="flex: 1;"
                 onchange="updateSocketPreview(this)"
                 oninput="updateSocketPreview(this)">
          <span class="value-display" style="min-width: 30px; text-align: center;">${corruption.range[0]}</span>
        </div>
        <div class="preview" style="margin-top: 8px; color: #ffd700; font-style: italic;">Socketed (${corruption.range[0]})</div>
      `;
      
      item.onclick = (e) => {
        if (e.target.type !== 'range') {
          const slider = item.querySelector('input[type="range"]');
          applySocketCorruption(parseInt(slider.value));
        }
      };
    } else {
      item.innerHTML = `
        <div style="color: #ff6b6b;">${corruption.mod}</div>
      `;
      
      item.onclick = () => applyCorruption(corruption.mod);
    }
    
    item.onmouseenter = () => {
      item.style.backgroundColor = '#444';
    };
    
    item.onmouseleave = () => {
      item.style.backgroundColor = '#333';
    };
    
    listContainer.appendChild(item);
  });
}

// Update corruption preview for numeric mods
function updateCorruptionPreview(slider, modTemplate) {
  const value = parseInt(slider.value);
  const valueDisplay = slider.parentElement.querySelector('.value-display');
  const preview = slider.parentElement.parentElement.querySelector('.preview');
  
  valueDisplay.textContent = value;
  preview.textContent = generateCorruptionText(modTemplate, value);
}

// Update socket preview
function updateSocketPreview(slider) {
  const value = parseInt(slider.value);
  const valueDisplay = slider.parentElement.querySelector('.value-display');
  const preview = slider.parentElement.parentElement.querySelector('.preview');
  
  valueDisplay.textContent = value;
  preview.textContent = `Socketed (${value})`;
}

// Generate corruption text with value
function generateCorruptionText(template, value) {
  return template.replace(/\[[\d\-]+\]/g, value.toString());
}

// Apply corruption to item
function applyCorruption(modTemplate, value = null) {
  const corruptionText = value !== null ? 
    generateCorruptionText(modTemplate, value) : 
    modTemplate;
    
  window.itemCorruptions[currentCorruptionSlot] = {
    text: corruptionText,
    type: 'corruption'
  };
  
  displayCorruption(currentCorruptionSlot, corruptionText);
  closeCorruptionModal();
}

// Apply socket corruption
function applySocketCorruption(socketCount) {
  window.itemCorruptions[currentCorruptionSlot] = {
    text: `Socketed (${socketCount})`,
    type: 'socket',
    sockets: socketCount
  };
  
  displayCorruption(currentCorruptionSlot, `Socketed (${socketCount})`);
  
  // Add sockets to item if socket system exists
  if (typeof addSocketsToItem === 'function') {
    const itemType = SECTION_MAP[currentCorruptionSlot];
    addSocketsToItem(itemType, socketCount);
  }
  
  closeCorruptionModal();
}

// Display corruption on item
function displayCorruption(dropdownId, corruptionText) {
  const infoId = getInfoContainerId(dropdownId);
  const container = document.getElementById(infoId);
  if (!container) return;
  
  // Remove only existing corruption elements
  const existing = container.querySelectorAll('.corruption-mod, .corrupted-label');
  existing.forEach(el => el.remove());
  
  // Only add corruption if container has content (item is valid)
  if (container.innerHTML.trim()) {
    const corruptionDiv = document.createElement('div');
    corruptionDiv.className = 'corruption-mod';
    corruptionDiv.style.cssText = `
      color: #ff5555;
      font-weight: bold;
      margin-top: 5px;
      text-shadow: 0 0 3px #ff5555;
    `;
    corruptionDiv.textContent = corruptionText;
  
  // Add corrupted indicator

  
  container.appendChild(corruptionDiv);
}
}

// Get info container ID from dropdown ID
function getInfoContainerId(dropdownId) {
  const mapping = {
    'helms-dropdown': 'helm-info',
    'armors-dropdown': 'armor-info',
    'weapons-dropdown': 'weapon-info', 
    'offs-dropdown': 'off-info',
    'gloves-dropdown': 'glove-info',
    'belts-dropdown': 'belt-info',
    'boots-dropdown': 'boot-info',
    'ringsone-dropdown': 'ringsone-info',
    'ringstwo-dropdown': 'ringstwo-info',
    'amulets-dropdown': 'amulet-info'
  };
  return mapping[dropdownId];
}

// Restore corruption when item changes
function restoreCorruption(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown || !dropdown.value) {
    // Clear corruption if no item selected
    delete window.itemCorruptions[dropdownId];
    const infoId = getInfoContainerId(dropdownId);
    const container = document.getElementById(infoId);
    if (container) {
      const existing = container.querySelectorAll('.corruption-mod, .corrupted-label');
      existing.forEach(el => el.remove());
    }
    return;
  }
  
  const corruption = window.itemCorruptions[dropdownId];
  if (corruption) {
    // Use longer delay and multiple attempts to ensure item info is ready
    setTimeout(() => {
      const infoId = getInfoContainerId(dropdownId);
      const container = document.getElementById(infoId);
      if (container && container.innerHTML.trim()) {
        displayCorruption(dropdownId, corruption.text);
      } else {
        // Try again if container isn't ready
        setTimeout(() => displayCorruption(dropdownId, corruption.text), 200);
      }
    }, 150);
  }
}
// Remove current corruption
function removeCurrentCorruption() {
  if (!currentCorruptionSlot) return;
  
  delete window.itemCorruptions[currentCorruptionSlot];
  
  const infoId = getInfoContainerId(currentCorruptionSlot);
  const container = document.getElementById(infoId);
  if (container) {
    const existing = container.querySelectorAll('.corruption-mod, .corrupted-label');
    existing.forEach(el => el.remove());
  }
  
  closeCorruptionModal();
}


function hookIntoItemUpdates() {
  // Hook into existing updateItemInfo if it exists
  if (typeof updateItemInfo === 'function') {
    const originalUpdate = updateItemInfo;
    window.updateItemInfo = function(...args) {
      const result = originalUpdate.apply(this, args);
      
      // Restore corruptions after item info updates
      setTimeout(() => {
        Object.keys(SECTION_MAP).forEach(dropdownId => {
          const corruption = window.itemCorruptions[dropdownId];
          if (corruption) {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown && dropdown.value) {
              displayCorruption(dropdownId, corruption.text);
            }
          }
        });
      }, 50);
      
      return result;
    };
  }
}


// Close corruption modal
function closeCorruptionModal() {
  document.getElementById('corruptionModal').style.display = 'none';
  currentCorruptionSlot = null;
}

// Global variables
let currentCorruptionSlot = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all other scripts are loaded
  setTimeout(initCorruptionSystem, 100);
});

// Export for potential external use
window.CorruptionSystem = {
  init: initCorruptionSystem,
  openModal: openCorruptionModal,
  removeCorruption: removeCurrentCorruption
};