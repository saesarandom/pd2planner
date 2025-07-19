// corruption.js - Simple approach: modify item description directly
// Let the socket system handle everything else

// Corruption storage
window.itemCorruptions = window.itemCorruptions || {};
window.originalItemDescriptions = window.originalItemDescriptions || {};

// Corruption definitions by item type
const CORRUPTIONS = {
  helm: [
    { mod: "+[20-30] to Life", type: "numeric", range: [20, 30] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" }
  ],
  armor: [
    { mod: "+[40-60] to Life", type: "numeric", range: [40, 60] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" }
  ],
  weapon: [
    { mod: "+[40-80]% Enhanced Damage", type: "numeric", range: [40, 80] },
    { mod: "+[150-250] to Attack Rating", type: "numeric", range: [150, 250] },
    { mod: "+[100-150]% Enhanced Damage to Demons<br>+200 to Attack Rating against Demons", type: "numeric", range: [100, 150] },
    { mod: "+[100-150]% Enhanced Damage to Undead<br>+200 to Attack Rating against Undead", type: "numeric", range: [100, 150] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[3-6] Life after each Hit", type: "numeric", range: [3, 6] },
    { mod: "+[3-6] Life after each Kill", type: "numeric", range: [3, 6] },
    { mod: "+[3-5] to Mana after each Kill", type: "numeric", range: [3, 5] },
    { mod: "+[20-30]% Better Chance of Getting Magic Items", type: "fixed", range: [20, 30] },
    { mod: "Requirements -[25-50]%", type: "numeric", range: [25, 50] },
    { mod: "+20% Faster Cast Rate<br>+[30-40]% Increased Attack Speed", type: "numeric", range: [30, 40] },
    { mod: "+[40-60]% Enhanced Damage<br>5% Life Stolen per Hit", type: "numeric", range: [40, 60] },
    { mod: "-[40-60] Target Defense per Hit", type: "numeric", range: [40, 60] },
    { mod: "+[20-30]% Chance of Crushing Blow", type: "numeric", range: [20, 30] },
    { mod: "+[20-30]% Deadly Strike", type: "numeric", range: [20, 30] },
    { mod: "-[7-10]% to Enemy Fire Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Cold Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Lightning Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Poison Resistance", type: "numeric", range: [7, 10] },
    { mod: "+1 to All Skills<br>+30% Increased Attack Speed<br>+[20-30]% Chance of Crushing Blow", type: "numeric", range: [20, 30] },
    { mod: "+[80-120]% Enhanced Damage<br>+20% Increased Attack Speed", type: "numeric", range: [80, 120] },
    { mod: "+[80-120]% Enhanced Damage<br>+250 to Attack Rating", type: "numeric", range: [80, 120] },
    { mod: "+[50-70]% Enhanced Damage<br>25% Deadly Strike", type: "numeric", range: [50, 70] },
    { mod: "+[60-80]% Enhanced Damage<br>Ignores Target's Defense", type: "numeric", range: [60, 80] },
    { mod: "+10% Faster Cast Rate<br>+5% to Fire Skill Damage", type: "fixed" },
    { mod: "+10% Faster Cast Rate<br>+5% to Cold Skill Damage", type: "fixed" },
    { mod: "+10% Faster Cast Rate<br>+5% to Lightning Skill Damage", type: "fixed" },
    { mod: "+10% Faster Cast Rate<br>+5% to Poison Skill Damage", type: "fixed" }
  ],
  shield: [
    { mod: "+[30-50]% Enhanced Defense", type: "numeric", range: [30, 50] },
    { mod: "+1 to All Skills", type: "fixed" }
  ],
  gloves: [
    { mod: "+[20-30] to Life", type: "numeric", range: [20, 30] },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" }
  ],
  belt: [
    { mod: "+[30-50] to Life", type: "numeric", range: [30, 50] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" }
  ],
  boots: [
    { mod: "+[30-50] to Life", type: "numeric", range: [30, 50] },
    { mod: "+10% Faster Run/Walk", type: "fixed" }
  ],
  ring: [
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "+10% Faster Cast Rate", type: "fixed" }
  ],
  amulet: [
    { mod: "+[30-60] to Life", type: "numeric", range: [30, 60] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" }
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

// Global variables
let currentCorruptionSlot = null;

// Initialize corruption system
function initCorruptionSystem() {
  console.log('🚀 Initializing corruption system (description modification approach)...');
  
  addCorruptionCSS();
  createCorruptionModal();
  attachCorruptionButtons();
  
  console.log('✅ Corruption system initialized');
}

// Add CSS for corruption styling
function addCorruptionCSS() {
  if (document.getElementById('corruption-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'corruption-styles';
  style.textContent = `
    .corruption-enhanced-stat {
      color: #ff5555 !important;
      font-weight: bold !important;
      text-shadow: 0 0 3px #ff5555 !important;
    }
  `;
  document.head.appendChild(style);
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
  console.log('🔧 Attaching corruption buttons...');
  
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
      console.log(`✅ Attached handler to ${buttonId}`);
    }
  });
}

// Open corruption modal for specific item slot
function openCorruptionModal(dropdownId) {
  console.log(`🎯 Opening corruption modal for: ${dropdownId}`);
  
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
    } else {
      item.innerHTML = `
        <div style="color: #ff6b6b;">${corruption.mod}</div>
      `;
      
      item.onclick = () => applyCorruption(corruption.mod);
    }
    
    item.onmouseenter = () => item.style.backgroundColor = '#444';
    item.onmouseleave = () => item.style.backgroundColor = '#333';
    
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

// Generate corruption text with value
function generateCorruptionText(template, value) {
  return template.replace(/\[[\d\-]+\]/g, value.toString());
}

// Apply corruption to item - MODIFY ITEM DESCRIPTION DIRECTLY WITH PROPER STACKING
function applyCorruption(modTemplate, value = null) {
  const corruptionText = value !== null ? 
    generateCorruptionText(modTemplate, value) : 
    modTemplate;
    
  console.log(`🎯 Applying corruption: "${corruptionText}" to slot: ${currentCorruptionSlot}`);
    
  const dropdown = document.getElementById(currentCorruptionSlot);
  const itemName = dropdown.value;
  
  if (!itemName || !itemList[itemName]) {
    console.error('❌ Item not found:', itemName);
    return;
  }
  
  // Store original description if not already stored
  if (!window.originalItemDescriptions[itemName]) {
    window.originalItemDescriptions[itemName] = itemList[itemName].description;
    console.log(`💾 Stored original description for: ${itemName}`);
  }
  
  // Store corruption info
  window.itemCorruptions[currentCorruptionSlot] = {
    text: corruptionText,
    type: 'corruption',
    itemName: itemName
  };
  
  // Create enhanced description with stat stacking
  const originalDescription = window.originalItemDescriptions[itemName];
  const enhancedDescription = addCorruptionWithStacking(originalDescription, corruptionText);
  
  itemList[itemName].description = enhancedDescription;
  
  console.log(`✅ Modified description for ${itemName} with stat stacking`);
  console.log('💾 Corruption saved:', window.itemCorruptions[currentCorruptionSlot]);
  
  // Trigger item display update
  triggerItemUpdate(currentCorruptionSlot);
  
  closeCorruptionModal();
}

// Add corruption with proper stat stacking
function addCorruptionWithStacking(originalDescription, corruptionText) {
  let description = originalDescription;
  
  // Parse corruption stats
  const corruptionStats = parseCorruptionText(corruptionText);
  
  // Check for stackable stats and replace them
  corruptionStats.forEach(stat => {
    if (stat.stackable) {
      // Try to find and replace existing stat
      const replaced = replaceExistingStatWithCorruption(description, stat);
      if (replaced.found) {
        description = replaced.description;
        return; // Don't add at bottom if we replaced
      }
    }
    
    // If not stackable or not found, add at bottom with proper spacing
    description += `<br><span class="corruption-enhanced-stat">${stat.text}</span>`;
  });
  
  // Add line break after corruption for socket stats
  description += '<br>';
  
  return description;
}

// Parse corruption text into individual stats
function parseCorruptionText(corruptionText) {
  const stats = [];
  
  // Define stackable stat patterns - INCLUDING ALL SKILLS!
  const stackablePatterns = [
    { pattern: /(\+?\d+)%\s+(Increased Attack Speed)/i, type: 'ias' },
    { pattern: /(\+?\d+)%\s+(Enhanced Damage)/i, type: 'edmg' },
    { pattern: /(\+?\d+)%\s+(Faster Cast Rate)/i, type: 'fcr' },
    { pattern: /(\+?\d+)%\s+(Faster Hit Recovery)/i, type: 'fhr' },
    { pattern: /(\+?\d+)%\s+(Faster Run\/Walk)/i, type: 'frw' },
    { pattern: /(\+?\d+)%\s+(Enhanced Defense)/i, type: 'edef' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Life/i, type: 'life' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Mana/i, type: 'mana' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Strength/i, type: 'str' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Dexterity/i, type: 'dex' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?(?:Attack Rating)/i, type: 'ar' },
    { pattern: /(\+?\d+)\s+to\s+All\s+Skills/i, type: 'allskills' }
  ];
  
  // Check if corruption matches any stackable pattern
  let matched = false;
  for (const { pattern, type } of stackablePatterns) {
    const match = corruptionText.match(pattern);
    if (match) {
      stats.push({
        text: corruptionText,
        value: parseInt(match[1]),
        type: type,
        stackable: true,
        pattern: pattern
      });
      matched = true;
      break;
    }
  }
  
  // If no stackable stat found, treat as non-stackable
  if (!matched) {
    stats.push({
      text: corruptionText,
      stackable: false
    });
  }
  
  return stats;
}

// Replace existing stat with corruption (make it red and stack values)
function replaceExistingStatWithCorruption(description, corruptionStat) {
  // Define patterns to find existing stats in item description
  const searchPatterns = {
    'ias': /(\+?\d+)%\s+(Increased Attack Speed)/i,
    'edmg': /(\+?\d+)%\s+(Enhanced Damage)/i,
    'fcr': /(\+?\d+)%\s+(Faster Cast Rate)/i,
    'fhr': /(\+?\d+)%\s+(Faster Hit Recovery)/i,
    'frw': /(\+?\d+)%\s+(Faster Run\/Walk)/i,
    'edef': /(\+?\d+)%\s+(Enhanced Defense)/i,
    'life': /(\+?\d+)\s+(?:to\s+)?Life/i,
    'mana': /(\+?\d+)\s+(?:to\s+)?Mana/i,
    'str': /(\+?\d+)\s+(?:to\s+)?Strength/i,
    'dex': /(\+?\d+)\s+(?:to\s+)?Dexterity/i,
    'ar': /(\+?\d+)\s+(?:to\s+)?(?:Attack Rating)/i,
    'allskills': /(\+?\d+)\s+to\s+All\s+Skills/i
  };
  
  const searchPattern = searchPatterns[corruptionStat.type];
  if (!searchPattern) {
    return { found: false, description };
  }
  
  const match = description.match(searchPattern);
  if (match) {
    const originalValue = parseInt(match[1]);
    const newValue = originalValue + corruptionStat.value;
    
    // Replace the original stat with corrupted (red) version
    const newStatText = match[0].replace(match[1], `+${newValue}`);
    const redStatText = `<span class="corruption-enhanced-stat">${newStatText}</span>`;
    
    const newDescription = description.replace(match[0], redStatText);
    
    console.log(`🔄 Stacked ${corruptionStat.type}: ${originalValue} + ${corruptionStat.value} = ${newValue}`);
    
    return { found: true, description: newDescription };
  }
  
  return { found: false, description };
}

// Trigger item update
function triggerItemUpdate(dropdownId) {
  setTimeout(() => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      // Create fake event and call updateItemInfo
      const fakeEvent = { target: dropdown };
      if (typeof updateItemInfo === 'function') {
        updateItemInfo(fakeEvent);
      }
      
      // Also trigger change event
      dropdown.dispatchEvent(new Event('change'));
      
      // Update stats if available
      if (window.statsCalculator?.updateAll) {
        window.statsCalculator.updateAll();
      }
    }
  }, 100);
}

// Remove current corruption
function removeCurrentCorruption() {
  if (!currentCorruptionSlot) return;
  
  console.log(`🗑️ Removing corruption from: ${currentCorruptionSlot}`);
  
  const corruption = window.itemCorruptions[currentCorruptionSlot];
  if (corruption && corruption.itemName) {
    // Restore original description
    const originalDescription = window.originalItemDescriptions[corruption.itemName];
    if (originalDescription) {
      itemList[corruption.itemName].description = originalDescription;
      console.log(`✅ Restored original description for: ${corruption.itemName}`);
    }
  }
  
  // Remove corruption from storage
  delete window.itemCorruptions[currentCorruptionSlot];
  
  // Trigger item update
  triggerItemUpdate(currentCorruptionSlot);
  
  closeCorruptionModal();
}

// Close corruption modal
function closeCorruptionModal() {
  document.getElementById('corruptionModal').style.display = 'none';
  currentCorruptionSlot = null;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCorruptionSystem, 100);
});

// Also initialize if called directly
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCorruptionSystem, 100);
  });
} else {
  setTimeout(initCorruptionSystem, 100);
}

// Export for external use
window.CorruptionSystem = {
  init: initCorruptionSystem,
  openModal: openCorruptionModal,
  removeCorruption: removeCurrentCorruption,
  getCorruptions: () => window.itemCorruptions,
  getOriginalDescriptions: () => window.originalItemDescriptions
};

// Make global functions available
window.updateCorruptionPreview = updateCorruptionPreview;
window.generateCorruptionText = generateCorruptionText;

console.log('📦 Simple Corruption.js (description modification) loaded successfully');