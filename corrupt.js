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
    { mod: "+20% Faster Cast Rate", type: "fixed" },
    { mod: "+[30-40]% Increased Attack Speed", type: "numeric", range: [30, 40] },
    { mod: "+[40-60]% Enhanced Damage<br>5% Life Stolen per Hit", type: "numeric", range: [40, 60] },
    { mod: "-[40-60] Target Defense per Hit", type: "numeric", range: [40, 60] },
    { mod: "[20-30]% Chance of Crushing Blow", type: "numeric", range: [20, 30] },
    { mod: "+[20-30]% Deadly Strike", type: "numeric", range: [20, 30] },
    { mod: "-[7-10]% to Enemy Fire Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Cold Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Lightning Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Poison Resistance", type: "numeric", range: [7, 10] },
    { mod: "+1 to All Skills", type: "fixed" },
    { 
      mod: "+30% Increased Attack Speed<br>[20-30]% Chance of Crushing Blow", 
      type: "double", 
      ranges: [
        { label: "Increased Attack Speed", value: 30, type: "fixed" },
        { label: "Chance of Crushing Blow", range: [20, 30], type: "numeric" }
      ]
    },
    
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
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "+20% Faster Block Rate", type: "fixed" },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "+[30-40] Life", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Cold Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Lightning Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Poison Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Indestructible", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    
     { mod: "+[80-120]% Enhanced Damage<br>+20% Increased Attack Speed", type: "double", 
      ranges: [
        { label: "Enhanced Damage", range: [80, 120], type: "numeric" },
        { label: "Increased Attack Speed", value: 20, type: "fixed" }
      ]
    },

    { 
      mod: "+10% Faster Block Rate<br>[10-20]% Increased Chance of Blocking", 
      type: "double", 
      ranges: [
        { label: "Faster Block Rate", value: 10, type: "fixed" },
        { label: "Increased Chance of Blocking", range: [10, 20], type: "numeric" }
      ]
    },
    { 
      mod: "Increase Maximum Life [4-6]%", 
      type: "numeric", 
      range: [4, 6] 
    },
    { 
      mod: "Physical Damage Taken Reduced by [6-10]<br>Magic Damage Taken Reduced by [6-10]", 
      type: "double", 
      ranges: [
        { label: "Physical Damage Reduced", range: [6, 10], type: "numeric" },
        { label: "Magic Damage Reduced", range: [6, 10], type: "numeric" }
      ]
    },
    { 
      mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)", 
      type: "numeric", 
      range: [4, 594] 
    },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    { mod: "Physical Damage Taken Reduced by [6-8]%", type: "numeric", range: [6, 8] },
    
    // Complex double mods with two independent ranges
    { 
      mod: "+[4-5]% to Maximum Fire Resist<br>Fire Resist +[15-20]%", 
      type: "double", 
      ranges: [
        { label: "Maximum Fire Resist", range: [4, 5], type: "numeric" },
        { label: "Fire Resist", range: [15, 20], type: "numeric" }
      ]
    },
    { 
      mod: "+[4-5]% to Maximum Cold Resist<br>Cold Resist +[15-20]%", 
      type: "double", 
      ranges: [
        { label: "Maximum Cold Resist", range: [4, 5], type: "numeric" },
        { label: "Cold Resist", range: [15, 20], type: "numeric" }
      ]
    },
    { 
      mod: "+[4-5]% to Maximum Lightning Resist<br>Lightning Resist +[15-20]%", 
      type: "double", 
      ranges: [
        { label: "Maximum Lightning Resist", range: [4, 5], type: "numeric" },
        { label: "Lightning Resist", range: [15, 20], type: "numeric" }
      ]
    },
    { 
      mod: "+[4-5]% to Maximum Poison Resist<br>Poison Resist +[15-20]%", 
      type: "double", 
      ranges: [
        { label: "Maximum Poison Resist", range: [4, 5], type: "numeric" },
        { label: "Poison Resist", range: [15, 20], type: "numeric" }
      ]
    }
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

  
  addCorruptionCSS();
  createCorruptionModal();
  attachCorruptionButtons();
  

}

// Enhanced CSS for corruption styling
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
    
    .corruption-slider-container {
      background: #3a3a3a;
      border: 1px solid #555;
      border-radius: 4px;
      padding: 12px;
      margin: 8px 0;
    }
    
    .corruption-slider-label {
      color: #ffd700;
      font-size: 12px;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .corruption-slider-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 6px 0;
    }
    
    .corruption-slider {
      flex: 1;
      height: 6px;
      background: #555;
      outline: none;
      border-radius: 3px;
    }
    
    .corruption-slider::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
      background: #ff6b6b;
      border-radius: 50%;
      cursor: pointer;
    }
    
    .corruption-value-display {
      min-width: 40px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      background: #2a2a2a;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
    }
    
    .corruption-preview {
      margin-top: 12px;
      color: #ffd700;
      font-style: italic;
      background: #2a2a2a;
      padding: 8px;
      border-radius: 4px;
      border-left: 3px solid #ff6b6b;
    }
  `;
  document.head.appendChild(style);
}

// Create enhanced corruption modal
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
        margin: 3% auto;
        padding: 20px;
        border: 2px solid #444;
        border-radius: 8px;
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
        font-family: Oswald, sans-serif;
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

// Enhanced populate corruption options with independent sliders
function populateCorruptionList(corruptions) {
  const listContainer = document.getElementById('corruptionList');
  listContainer.innerHTML = '';
  
  corruptions.forEach((corruption, index) => {
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
    
    if (corruption.type === 'double' && corruption.ranges) {
      // Handle double mods with independent sliders
      item.innerHTML = createDoubleModSliders(corruption, index);
      
      item.onclick = (e) => {
        if (!e.target.classList.contains('corruption-slider')) {
          applyDoubleCorruption(corruption, index);
        }
      };
    } else if (corruption.type === 'numeric') {
      // Handle single numeric mods
      item.innerHTML = createSingleModSlider(corruption, index);
      
      item.onclick = (e) => {
        if (!e.target.classList.contains('corruption-slider')) {
          const slider = item.querySelector('.corruption-slider');
          applyCorruption(corruption.mod, parseInt(slider.value));
        }
      };
    } else {
      // Handle fixed mods
      item.innerHTML = `
        <div style="color: #ff6b6b; font-weight: bold;">${corruption.mod}</div>
      `;
      
      item.onclick = () => applyCorruption(corruption.mod);
    }
    
    item.onmouseenter = () => item.style.backgroundColor = '#444';
    item.onmouseleave = () => item.style.backgroundColor = '#333';
    
    listContainer.appendChild(item);
  });
}

// Create sliders for double mods with independent ranges
function createDoubleModSliders(corruption, index) {
  let html = `
    <div class="corruption-slider-container">
      <div class="corruption-slider-label">${corruption.mod.replace(/<br>/g, ' + ').replace(/\[.*?\]/g, '[Range]')}</div>
  `;
  
  corruption.ranges.forEach((range, rangeIndex) => {
    const sliderId = `corruption_${index}_${rangeIndex}`;
    const valueId = `value_${index}_${rangeIndex}`;
    
    if (range.type === 'numeric') {
      const minVal = range.range[0];
      const maxVal = range.range[1];
      
      html += `
        <div class="corruption-slider-row">
          <span style="min-width: 120px; color: #ccc; font-size: 11px;">${range.label}:</span>
          <input type="range" 
                 class="corruption-slider"
                 id="${sliderId}"
                 min="${minVal}" 
                 max="${maxVal}" 
                 value="${minVal}"
                 oninput="updateDoubleModPreview(${index})"
                 onchange="updateDoubleModPreview(${index})">
          <span class="corruption-value-display" id="${valueId}">${minVal}</span>
        </div>
      `;
    } else {
      // Fixed value
      html += `
        <div class="corruption-slider-row">
          <span style="width: 70px; color: #ccc; font-size: 11px;">${range.label}:</span>
          <span style="flex: 1; color: #ffd700; text-align: center;">+${range.value}%</span>
          <span class="corruption-value-display">Fixed</span>
        </div>
      `;
    }
  });
  
  html += `
      <div class="corruption-preview" id="preview_${index}"></div>
    </div>
  `;
  
  // Update preview after creating HTML
  setTimeout(() => updateDoubleModPreview(index), 10);
  
  return html;
}

// Create slider for single numeric mods
function createSingleModSlider(corruption, index) {
  const sliderId = `corruption_single_${index}`;
  const valueId = `value_single_${index}`;
  const previewId = `preview_single_${index}`;
  
  const minVal = corruption.range[0];
  const maxVal = corruption.range[1];
  
  return `
    <div class="corruption-slider-container">
      <div class="corruption-slider-label">${corruption.mod.replace(/\[.*?\]/g, '[Range]')}</div>
      <div class="corruption-slider-row">
        <span style="min-width: 60px; color: #ccc;">Value:</span>
        <input type="range" 
               class="corruption-slider"
               id="${sliderId}"
               min="${minVal}" 
               max="${maxVal}" 
               value="${minVal}"
               oninput="updateSingleModPreview(${index}, '${corruption.mod}')"
               onchange="updateSingleModPreview(${index}, '${corruption.mod}')">
        <span class="corruption-value-display" id="${valueId}">${minVal}</span>
      </div>
      <div class="corruption-preview" id="${previewId}">${generateCorruptionText(corruption.mod, minVal)}</div>
    </div>
  `;
}

// Update preview for double mods with independent sliders
function updateDoubleModPreview(index) {
  const preview = document.getElementById(`preview_${index}`);
  if (!preview) return;
  
  // Find the corruption data
  const corruption = getCurrentCorruptionByIndex(index);
  if (!corruption || !corruption.ranges) return;
  
  let previewText = '';
  let values = [];
  
  corruption.ranges.forEach((range, rangeIndex) => {
    if (range.type === 'numeric') {
      const slider = document.getElementById(`corruption_${index}_${rangeIndex}`);
      const valueDisplay = document.getElementById(`value_${index}_${rangeIndex}`);
      
      if (slider && valueDisplay) {
        const value = parseInt(slider.value);
        valueDisplay.textContent = value;
        values.push(value);
      }
    } else {
      values.push(range.value);
    }
  });
  
  // Generate preview text by replacing placeholders
  previewText = generateDoubleModText(corruption.mod, values);
  preview.innerHTML = previewText;
}

// Update preview for single mods
function updateSingleModPreview(index, modTemplate) {
  const slider = document.getElementById(`corruption_single_${index}`);
  const valueDisplay = document.getElementById(`value_single_${index}`);
  const preview = document.getElementById(`preview_single_${index}`);
  
  if (slider && valueDisplay && preview) {
    const value = parseInt(slider.value);
    valueDisplay.textContent = value;
    preview.innerHTML = generateCorruptionText(modTemplate, value);
  }
}

// Get corruption data by index
function getCurrentCorruptionByIndex(index) {
  const itemType = SECTION_MAP[currentCorruptionSlot];
  const corruptions = CORRUPTIONS[itemType];
  return corruptions ? corruptions[index] : null;
}

// Generate text for double mods with multiple values
function generateDoubleModText(template, values) {
  let result = template;
  let valueIndex = 0;
  
  // Replace placeholders with actual values in order
  result = result.replace(/\[[\d\-]+\]/g, () => {
    const value = values[valueIndex] || 0;
    valueIndex++;
    return value.toString();
  });
  
  return result;
}


// Generate corruption text with single value
function generateCorruptionText(template, value) {
  return template.replace(/\[[\d\-]+\]/g, value.toString());
}

// Apply double corruption with multiple values
function applyDoubleCorruption(corruption, index) {
  let values = [];
  
  // Collect values from sliders
  corruption.ranges.forEach((range, rangeIndex) => {
    if (range.type === 'numeric') {
      const slider = document.getElementById(`corruption_${index}_${rangeIndex}`);
      values.push(slider ? parseInt(slider.value) : range.range[0]);
    } else {
      values.push(range.value);
    }
  });
  
  const corruptionText = generateDoubleModText(corruption.mod, values);
  
  
  
  applyCorruptionToItem(corruptionText);
}

// Apply single corruption
function applyCorruption(modTemplate, value = null) {
  const corruptionText = value !== null ? 
    generateCorruptionText(modTemplate, value) : 
    modTemplate;
    

    
  applyCorruptionToItem(corruptionText);
}

// Common function to apply corruption to item
function applyCorruptionToItem(corruptionText) {
  const dropdown = document.getElementById(currentCorruptionSlot);
  const itemName = dropdown.value;
  
  if (!itemName || !itemList[itemName]) {
    console.error('❌ Item not found:', itemName);
    return;
  }
  
  // Store original description if not already stored
  if (!window.originalItemDescriptions[itemName]) {
    window.originalItemDescriptions[itemName] = itemList[itemName].description;
  
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
  

  
  // Trigger item display update
  triggerItemUpdate(currentCorruptionSlot);
  
  closeCorruptionModal();
}

// Add corruption with proper stat stacking (same as before)
function addCorruptionWithStacking(originalDescription, corruptionText) {
  let description = originalDescription;
  
  // Parse corruption stats
  const corruptionStats = parseCorruptionText(corruptionText);
  
  // Track what gets stacked vs what needs to be added
  const stackedLines = new Set();
  const processedStatTypes = new Set();
  
  // Process stackable stats
  corruptionStats.forEach((stat, index) => {
    if (stat.stackable) {
      const statKey = stat.subtype ? `${stat.type}_${stat.subtype}` : stat.type;
      
      // Only process each stat type once
      if (processedStatTypes.has(statKey)) return;
      processedStatTypes.add(statKey);
      
      // Try to stack with existing stat
      const replaced = replaceExistingStatWithCorruption(description, stat);
      if (replaced.found) {
        description = replaced.description;
        stackedLines.add(stat.lineIndex); // Mark this line as handled
       
      }
    }
  });
  
  // Reconstruct remaining corruption text from non-stacked lines
  if (corruptionText.includes('<br>')) {
    const lines = corruptionText.split('<br>').map(line => line.trim());
    const remainingLines = lines.filter((line, index) => !stackedLines.has(index));
    
    if (remainingLines.length > 0) {
      const remainingText = remainingLines.join('<br>');
      description += `<span class="corruption-enhanced-stat">${remainingText}</span><br>`;
    }
  } else {
    // Single line - add if nothing was stacked
    if (stackedLines.size === 0) {
      description += `<span class="corruption-enhanced-stat">${corruptionText}</span><br>`;
    }
  }
  
  description += '';
  return description;
}


// Parse corruption text into individual stats (same as before)
// Enhanced parseCorruptionText to handle double mods properly
function parseCorruptionText(corruptionText) {
  const stats = [];
  
  // Define stackable stat patterns
  const stackablePatterns = [
    { pattern: /(\+?\d+)%\s+(Increased Attack Speed)/i, type: 'ias' },
    { pattern: /(\+?\d+)%\s+(Enhanced Damage)/i, type: 'edmg' },
    { pattern: /(\+?\d+)%\s+(Faster Cast Rate)/i, type: 'fcr' },
    { pattern: /(\+?\d+)%\s+(Faster Hit Recovery)/i, type: 'fhr' },
    { pattern: /(\+?\d+)%\s+(Faster Run\/Walk)/i, type: 'frw' },
    { pattern: /(\+?\d+)%\s+(Enhanced Defense)/i, type: 'edef' },
    { pattern: /(\+?\d+)%\s+(Faster Block Rate)/i, type: 'fbr' },
    { pattern: /(\+?\d+)%\s+(Increased Chance of Blocking)/i, type: 'block' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Life/i, type: 'life' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Mana/i, type: 'mana' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Strength/i, type: 'str' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Dexterity/i, type: 'dex' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?(?:Attack Rating)/i, type: 'ar' },
    { pattern: /(\+?\d+)\s+to\s+All\s+Skills/i, type: 'allskills' },
    { pattern: /(\+?\d+)%\s+(?:to\s+)?Maximum\s+(\w+)\s+Resist/i, type: 'maxres' },
    { pattern: /(\w+)\s+Resist\s+\+(\d+)%/i, type: 'resist' },
    { pattern: /All\s+Resistances\s+\+(\d+)/i, type: 'allres' },
    { pattern: /Physical\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i, type: 'pdr' },
    { pattern: /Magic\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i, type: 'mdr' },
    { pattern: /(\+?\d+)%\s+(Chance of Crushing Blow)/i, type: 'cb' }
  ];
  
  // Split corruption text by <br> to handle multi-line mods
  const lines = corruptionText.split('<br>').map(line => line.trim()).filter(line => line);
  
  // Process each line separately
  lines.forEach((line, lineIndex) => {
    let matched = false;
    
    // Check if line matches any stackable pattern
    for (const { pattern, type } of stackablePatterns) {
      const match = line.match(pattern);
      if (match) {
        let value;
        let subtype = '';
        
        // Handle special cases
        if (type === 'maxres') {
          value = parseInt(match[1]);
          subtype = match[2].toLowerCase(); 
        } else if (type === 'resist') {
          value = parseInt(match[2]);
          subtype = match[1].toLowerCase(); 
        } else {
          value = parseInt(match[1]);
        }
        
        stats.push({
          text: line,
          fullText: corruptionText,
          lineIndex: lineIndex, 
          value: value,
          type: type,
          subtype: subtype,
          stackable: true,
          pattern: pattern
        });
        matched = true;
        break;
      }
    }
    

    if (!matched) {
      stats.push({
        text: line,
        fullText: corruptionText,
        lineIndex: lineIndex,
        stackable: false
      });
    }
  });
  
  return stats;
}


function replaceExistingStatWithCorruption(description, corruptionStat) {
  
  const searchPatterns = {
    'ias': /(\+?\d+)%\s+(Increased Attack Speed)/i,
    'edmg': /(\+?\d+)%\s+(Enhanced Damage)/i,
    'fcr': /(\+?\d+)%\s+(Faster Cast Rate)/i,
    'fhr': /(\+?\d+)%\s+(Faster Hit Recovery)/i,
    'frw': /(\+?\d+)%\s+(Faster Run\/Walk)/i,
    'edef': /(\+?\d+)%\s+(Enhanced Defense)/i,
    'fbr': /(\+?\d+)%\s+(Faster Block Rate)/i,
    'block': /(\+?\d+)%\s+(Increased Chance of Blocking)/i,
    'life': /(\+?\d+)\s+(?:to\s+)?Life/i,
    'mana': /(\+?\d+)\s+(?:to\s+)?Mana/i,
    'str': /(\+?\d+)\s+(?:to\s+)?Strength/i,
    'dex': /(\+?\d+)\s+(?:to\s+)?Dexterity/i,
    'ar': /(\+?\d+)\s+(?:to\s+)?(?:Attack Rating)/i,
    'allskills': /(\+?\d+)\s+to\s+All\s+Skills/i,
    'allres': /All\s+Resistances\s+\+(\d+)/i,
    'pdr': /Physical\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i,
    'mdr': /Magic\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i,
    'cb': /(\+?\d+)%\s+(Chance of Crushing Blow)/i
  };
  
 
  if (corruptionStat.type === 'maxres') {
    const pattern = new RegExp(`(\\+?\\d+)%\\s+(?:to\\s+)?Maximum\\s+${corruptionStat.subtype}\\s+Resist`, 'i');
    searchPatterns['maxres'] = pattern;
  } else if (corruptionStat.type === 'resist') {
    const pattern = new RegExp(`${corruptionStat.subtype}\\s+Resist\\s+\\+(\\d+)%`, 'i');
    searchPatterns['resist'] = pattern;
  }
  
  const searchPattern = searchPatterns[corruptionStat.type];
  if (!searchPattern) {
    return { found: false, description };
  }
  
  const match = description.match(searchPattern);
  if (match) {
    const originalValue = parseInt(match[1]);
    const newValue = originalValue + corruptionStat.value;
    

    const newStatText = match[0].replace(match[1], `+${newValue}`);
    const redStatText = `<span class="corruption-enhanced-stat">${newStatText}</span>`;
    
    const newDescription = description.replace(match[0], redStatText);
    
    return { 
      found: true, 
      description: newDescription,
      originalValue: originalValue,
      newValue: newValue
    };
  }
  
  return { found: false, description };
}


function triggerItemUpdate(dropdownId) {
  setTimeout(() => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {

      const fakeEvent = { target: dropdown };
      if (typeof updateItemInfo === 'function') {
        updateItemInfo(fakeEvent);
      }
      

      dropdown.dispatchEvent(new Event('change'));
      

      if (window.statsCalculator?.updateAll) {
        window.statsCalculator.updateAll();
      }
    }
  }, 100);
}


function removeCurrentCorruption() {
  if (!currentCorruptionSlot) return;
  

  
  const corruption = window.itemCorruptions[currentCorruptionSlot];
  if (corruption && corruption.itemName) {
    // Restore original description
    const originalDescription = window.originalItemDescriptions[corruption.itemName];
    if (originalDescription) {
      itemList[corruption.itemName].description = originalDescription;

    }
  }
  

  delete window.itemCorruptions[currentCorruptionSlot];
  

  triggerItemUpdate(currentCorruptionSlot);
  
  closeCorruptionModal();
}


function closeCorruptionModal() {
  document.getElementById('corruptionModal').style.display = 'none';
  currentCorruptionSlot = null;
}


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCorruptionSystem, 100);
});


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCorruptionSystem, 100);
  });
} else {
  setTimeout(initCorruptionSystem, 100);
}


window.CorruptionSystem = {
  init: initCorruptionSystem,
  openModal: openCorruptionModal,
  removeCorruption: removeCurrentCorruption,
  getCorruptions: () => window.itemCorruptions,
  getOriginalDescriptions: () => window.originalItemDescriptions
};


window.updateDoubleModPreview = updateDoubleModPreview;
window.updateSingleModPreview = updateSingleModPreview;
window.generateCorruptionText = generateCorruptionText;
window.generateDoubleModText = generateDoubleModText;

