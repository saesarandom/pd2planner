// inventory.js - Seamless Spanning Charm System
class CharmInventory {
  constructor() {
    this.draggedCharm = null;
    this.selectedSlot = null;
    this.clickPosition = { x: 0, y: 0 };
    this.charmImages = {
  'small-charm': [
    'img/small1.png',
    'img/small2.png', 
    'img/small3.png',
    'img/small4.png'
  ],
  'large-charm': [
    'img/large1.png',
    'img/large2.png',
    'img/large3.png', 
    'img/large4.png'
  ],
  'grand-charm': [
    'img/grand1.png',
    'img/grand2.png',
    'img/grand3.png',
    'img/grand4.png'
  ]
};

    this.occupiedSlots = new Set(); // Track occupied slots
    this.charmElements = new Map(); // Track charm elements and their occupied slots
    this.initialized = false;
  }

  init() {
    setTimeout(() => {
      this.createInventoryGrid();
      this.createModal();
      this.setupEventListeners();
      this.initialized = true;
      console.log('✨ Seamless Spanning Charm System initialized');
    }, 100);
  }

  createInventoryGrid() {
    let container = document.querySelector('.inventorycontainer');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'inventorycontainer';
      document.body.appendChild(container);
    }

    container.innerHTML = '';
    
    // Seamless grid without gaps
    container.style.cssText = `
      position: absolute;
      margin-top: -120px;
      left: 335px;
      display: grid;
      padding: 0;
      background-color: rgb(0, 0, 0);
      grid-template-rows: repeat(4, 30px);
      grid-template-columns: repeat(10, 30px);
      width: 300px;
      height: 120px;
      border: 1px solid rgb(164, 19, 19);
      overflow: visible;
      box-sizing: border-box;
      user-select: none;
      gap: 0;
    `;

    // Create 40 slots
    for (let i = 0; i < 40; i++) {
      const slot = document.createElement('div');
      slot.className = 'charm1';
      slot.dataset.index = i;
      
      slot.style.cssText = `
        border: 1px solid rgb(164, 19, 19);
        background-color: transparent;
        width: 30px;
        height: 30px;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin: 0;
        padding: 0;
      `;
      
      container.appendChild(slot);
    }
  }

  // Replace the createModal and createCharm methods with these:

createModal() {
  const existing = document.getElementById('charmModal');
  if (existing) existing.remove();

  const modalHTML = `
    <div id="charmModal" class="modal" style="display: none; position: fixed; z-index: 10000;">
      <div class="modal-content" style="
        background: rgb(5, 5, 5);
        padding: 20px;
        border-radius: 5px;
        border: 2px solid rgb(164, 19, 19);
        color: white;
        font-family: overlock sc;
        font-size: 14px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
      ">
        <span class="close">&times;</span>
        <h3 style="margin: 0 0 20px 0; color: rgb(164, 19, 19);">Create Charm, right click and drag to duplicate on charm, left click to delete</h3>
        
        <!-- Charm Type Selection -->
        <div id="charmTypeSelection">
          <h4 style="color: rgb(164, 19, 19); margin: 10px 0;">Choose Charm Type:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
            <button data-type="small-charm" class="charm-type-btn">Small Charm (1x1)</button>
            <button data-type="large-charm" class="charm-type-btn">Large Charm (1x2)</button>
            <button data-type="grand-charm" class="charm-type-btn">Grand Charm (1x3)</button>
          </div>
        </div>

        <!-- Charm Configuration (hidden initially) -->
        <div id="charmConfiguration" style="display: none;">
          <div style="margin-bottom: 15px;">
            <h4 style="color: rgb(164, 19, 19); margin: 10px 0;">Prefix:</h4>
            <select id="prefixSelect" style="width: 80%; padding: 5px; background: rgb(20, 20, 20); color: white; border: 1px solid rgb(164, 19, 19);">
              <option value="">None</option>
            </select>
            <div id="prefixStats" style="margin-top: 10px; color: #87CEEB;"></div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="color: rgb(164, 19, 19); margin: 10px 0;">Suffix:</h4>
            <select id="suffixSelect" style="width: 80%; padding: 5px; background: rgb(20, 20, 20); color: white; border: 1px solid rgb(164, 19, 19);">
              <option value="">None</option>
            </select>
            <div id="suffixStats" style="margin-top: 10px; color: #87CEEB;"></div>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="color: rgb(164, 19, 19); margin: 10px 0;">Preview:</h4>
            <div id="charmPreview" style="
              background: rgba(42, 42, 78, 0.5);
              border: 1px solid rgb(164, 19, 19);
              border-radius: 4px;
              padding: 10px;
              min-height: 60px;
              color: #FFD700;
            ">Select charm type to begin</div>
          </div>

          <button id="createCharmBtn" style="
            background: rgb(164, 19, 19);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            height: auto;
            width: 60%;
            font-size: 14px;
          ">Create Charm</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  this.setupModalEvents();
}

setupModalEvents() {
  const modal = document.getElementById('charmModal');
  
  // Close modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close') || e.target.id === 'charmModal') {
      this.hideModal();
    }
  });

  // Charm type selection
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('charm-type-btn')) {
      this.selectCharmType(e.target.dataset.type);
    }
  });

  // Prefix/Suffix selection
  document.addEventListener('change', (e) => {
    if (e.target.id === 'prefixSelect' || e.target.id === 'suffixSelect') {
      this.updateCharmPreview();
    }
  });

  // Create charm button
  document.addEventListener('click', (e) => {
    if (e.target.id === 'createCharmBtn') {
      this.createManualCharm();
    }
  });
}

selectCharmType(type) {
  this.selectedCharmType = type;
  
  // Show configuration section
  document.getElementById('charmTypeSelection').style.display = 'none';
  document.getElementById('charmConfiguration').style.display = 'block';
  
  // Populate prefix and suffix options
  this.populateAffixOptions(type);
  this.updateCharmPreview();
}

populateAffixOptions(type) {
  const charmAffixes = this.getCharmAffixes();
  const data = charmAffixes[type];
  
  const prefixSelect = document.getElementById('prefixSelect');
  const suffixSelect = document.getElementById('suffixSelect');
  
  // Clear existing options
  prefixSelect.innerHTML = '<option value="">None</option>';
  suffixSelect.innerHTML = '<option value="">None</option>';
  
  // Populate prefixes
  data.prefixes.forEach(prefix => {
    const option = document.createElement('option');
    option.value = prefix;
    option.textContent = this.cleanAffixName(prefix);
    prefixSelect.appendChild(option);
  });
  
  // Populate suffixes
  data.suffixes.forEach(suffix => {
    const option = document.createElement('option');
    option.value = suffix;
    option.textContent = this.cleanAffixName(suffix);
    suffixSelect.appendChild(option);
  });
}

getRandomCharmImage(charmType) {
  const imageArray = this.charmImages[charmType];
  if (!imageArray || imageArray.length === 0) {
    return 'img/placeholder.png';
  }
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  return imageArray[randomIndex];
}


updateCharmPreview() {
  const prefixSelect = document.getElementById('prefixSelect');
  const suffixSelect = document.getElementById('suffixSelect');
  const preview = document.getElementById('charmPreview');
  const prefixStats = document.getElementById('prefixStats');
  const suffixStats = document.getElementById('suffixStats');
  
  const selectedPrefix = prefixSelect.value;
  const selectedSuffix = suffixSelect.value;
  
  // Build charm name with FULL charm type name
  const charmTypeNames = {
    'small-charm': 'Small Charm',
    'large-charm': 'Large Charm', 
    'grand-charm': 'Grand Charm'
  };
  
  let charmName = charmTypeNames[this.selectedCharmType];
  if (selectedPrefix) {
    charmName = `${this.cleanAffixName(selectedPrefix)} ${charmName}`;
  }
  if (selectedSuffix) {
    charmName += ` ${this.cleanAffixName(selectedSuffix)}`;
  }
  
  // Get stats
  const prefixStatInfo = selectedPrefix ? this.getStatForAffix(selectedPrefix) : null;
  const suffixStatInfo = selectedSuffix ? this.getStatForAffix(selectedSuffix) : null;
  
  // Store current slider values before updating
  const currentPrefixValue = document.getElementById('prefixSlider')?.value;
  const currentSuffixValue = document.getElementById('suffixSlider')?.value;
  
  // Update stat displays with sliders ONLY if they don't exist or affix changed
  const needsPrefixUpdate = !document.getElementById('prefixSlider') || prefixStats.dataset.currentAffix !== selectedPrefix;
  const needsSuffixUpdate = !document.getElementById('suffixSlider') || suffixStats.dataset.currentAffix !== selectedSuffix;
  
  if (prefixStatInfo && needsPrefixUpdate) {
    prefixStats.innerHTML = this.createStatSlider('prefix', prefixStatInfo);
    prefixStats.dataset.currentAffix = selectedPrefix;
    // Restore previous value if it was within range
    if (currentPrefixValue && currentPrefixValue >= prefixStatInfo.min && currentPrefixValue <= prefixStatInfo.max) {
      document.getElementById('prefixSlider').value = currentPrefixValue;
      document.getElementById('prefixValue').textContent = currentPrefixValue;
    }
  } else if (!prefixStatInfo) {
    prefixStats.innerHTML = '';
    prefixStats.dataset.currentAffix = '';
  }
  
  if (suffixStatInfo && needsSuffixUpdate) {
    suffixStats.innerHTML = this.createStatSlider('suffix', suffixStatInfo);
    suffixStats.dataset.currentAffix = selectedSuffix;
    // Restore previous value if it was within range
    if (currentSuffixValue && currentSuffixValue >= suffixStatInfo.min && currentSuffixValue <= suffixStatInfo.max) {
      document.getElementById('suffixSlider').value = currentSuffixValue;
      document.getElementById('suffixValue').textContent = currentSuffixValue;
    }
  } else if (!suffixStatInfo) {
    suffixStats.innerHTML = '';
    suffixStats.dataset.currentAffix = '';
  }
  
  // Update preview with current slider values
  let previewHTML = `<div style="color: #FFD700; font-weight: bold; margin-bottom: 5px;">${charmName}</div>`;
  
  if (prefixStatInfo) {
    const prefixValue = document.getElementById('prefixSlider')?.value || prefixStatInfo.min;
    previewHTML += `<div style="color: #87CEEB;">${prefixStatInfo.text.replace('{value}', prefixValue)}</div>`;
  }
  
  if (suffixStatInfo) {
    const suffixValue = document.getElementById('suffixSlider')?.value || suffixStatInfo.min;
    previewHTML += `<div style="color: #87CEEB;">${suffixStatInfo.text.replace('{value}', suffixValue)}</div>`;
  }
  
  preview.innerHTML = previewHTML;
}
createStatSlider(type, statInfo) {
  const sliderId = `${type}Slider`;
  const valueId = `${type}Value`;
  
  // Check if this is a range damage affix
  if (statInfo.minRange && statInfo.maxRange) {
    const minSliderId = `${type}MinSlider`;
    const maxSliderId = `${type}MaxSlider`;
    const minValueId = `${type}MinValue`;
    const maxValueId = `${type}MaxValue`;
    
    return `
      <div style="margin: 5px 0;">
        <div style="color: #FFD700; margin-bottom: 5px;">Damage Range</div>
        
        <div style="margin-bottom: 10px;">
          <label style="color: white; font-size: 11px;">Min Damage:</label>
          <input type="range" id="${minSliderId}" 
                 min="${statInfo.minRange.min}" 
                 max="${statInfo.minRange.max}" 
                 value="${statInfo.minRange.min}" 
                 style="width: 100%; margin: 2px 0;" 
                 oninput="window.charmInventory.updateRangeSliderValue('${type}'); window.charmInventory.updatePreviewOnly();">
          <div style="text-align: center; color: white; font-size: 11px;">
            <span id="${minValueId}">${statInfo.minRange.min}</span> / ${statInfo.minRange.max}
          </div>
        </div>
        
        <div style="margin-bottom: 5px;">
          <label style="color: white; font-size: 11px;">Max Damage:</label>
          <input type="range" id="${maxSliderId}" 
                 min="${statInfo.maxRange.min}" 
                 max="${statInfo.maxRange.max}" 
                 value="${statInfo.maxRange.min}" 
                 style="width: 100%; margin: 2px 0;" 
                 oninput="window.charmInventory.updateRangeSliderValue('${type}'); window.charmInventory.updatePreviewOnly();">
          <div style="text-align: center; color: white; font-size: 11px;">
            <span id="${maxValueId}">${statInfo.maxRange.min}</span> / ${statInfo.maxRange.max}
          </div>
        </div>
      </div>
    `;
  }
  
  // Check if this is a multi-stat affix
  if (statInfo.stats) {
    let html = '';
    statInfo.stats.forEach((stat, index) => {
      const subSliderId = `${type}Slider${index}`;
      const subValueId = `${type}Value${index}`;
      
      html += `
        <div style="margin: 5px 0;">
          <div style="color: #FFD700; margin-bottom: 5px;">${stat.text.replace('{value}', '')}</div>
          <input type="range" id="${subSliderId}" min="${stat.min}" max="${stat.max}" value="${stat.min}" 
                 style="width: 100%; margin-bottom: 5px;" 
                 oninput="window.charmInventory.updateSliderValue('${type}'); window.charmInventory.updatePreviewOnly();">
          <div style="text-align: center; color: white;">
            <span id="${subValueId}">${stat.min}</span> / ${stat.max}
          </div>
        </div>
      `;
    });
    return html;
  } else {
    // Single stat affix
    return `
      <div style="margin: 5px 0;">
        <div style="color: #FFD700; margin-bottom: 5px;">${statInfo.text.replace('{value}', '')}</div>
        <input type="range" id="${sliderId}" min="${statInfo.min}" max="${statInfo.max}" value="${statInfo.min}" 
               style="width: 100%; margin-bottom: 5px;" 
               oninput="window.charmInventory.updateSliderValue('${type}'); window.charmInventory.updatePreviewOnly();">
        <div style="text-align: center; color: white;">
          <span id="${valueId}">${statInfo.min}</span> / ${statInfo.max}
        </div>
      </div>
    `;
  }
}

// Update the updateSliderValue method to handle multiple stats:
updateSliderValue(type) {
  const statInfo = type === 'prefix' ? 
    this.getStatForAffix(document.getElementById('prefixSelect').value) :
    this.getStatForAffix(document.getElementById('suffixSelect').value);
  
  if (statInfo && statInfo.stats) {
    // Multi-stat affix
    statInfo.stats.forEach((stat, index) => {
      const slider = document.getElementById(`${type}Slider${index}`);
      const valueSpan = document.getElementById(`${type}Value${index}`);
      if (slider && valueSpan) {
        valueSpan.textContent = slider.value;
      }
    });
  } else {
    // Single stat affix
    const slider = document.getElementById(`${type}Slider`);
    const valueSpan = document.getElementById(`${type}Value`);
    if (slider && valueSpan) {
      valueSpan.textContent = slider.value;
    }
  }
}

updateRangeSliderValue(type) {
  const minSlider = document.getElementById(`${type}MinSlider`);
  const maxSlider = document.getElementById(`${type}MaxSlider`);
  const minValueSpan = document.getElementById(`${type}MinValue`);
  const maxValueSpan = document.getElementById(`${type}MaxValue`);
  
  if (minSlider && minValueSpan) {
    minValueSpan.textContent = minSlider.value;
  }
  if (maxSlider && maxValueSpan) {
    maxValueSpan.textContent = maxSlider.value;
  }
}


updatePreviewOnly() {
  const prefixSelect = document.getElementById('prefixSelect');
  const suffixSelect = document.getElementById('suffixSelect');
  const preview = document.getElementById('charmPreview');
  
  const selectedPrefix = prefixSelect.value;
  const selectedSuffix = suffixSelect.value;
  
  // Build charm name
  const charmTypeNames = {
    'small-charm': 'Small Charm',
    'large-charm': 'Large Charm', 
    'grand-charm': 'Grand Charm'
  };
  
  let charmName = charmTypeNames[this.selectedCharmType];
  if (selectedPrefix) {
    charmName = `${this.cleanAffixName(selectedPrefix)} ${charmName}`;
  }
  if (selectedSuffix) {
    charmName += ` ${this.cleanAffixName(selectedSuffix)}`;
  }
  
  let previewHTML = `<div style="color: #FFD700; font-weight: bold; margin-bottom: 5px;">${charmName}</div>`;
  
  // Handle prefix stats
  if (selectedPrefix) {
    const prefixStatInfo = this.getStatForAffix(selectedPrefix);
    previewHTML += this.generateStatPreview('prefix', prefixStatInfo);
  }
  
  // Handle suffix stats
  if (selectedSuffix) {
    const suffixStatInfo = this.getStatForAffix(selectedSuffix);
    previewHTML += this.generateStatPreview('suffix', suffixStatInfo);
  }
  
  preview.innerHTML = previewHTML;
}

generateStatPreview(type, statInfo) {
  if (!statInfo) return '';
  
  // Handle range damage
  if (statInfo.minRange && statInfo.maxRange) {
    const minSlider = document.getElementById(`${type}MinSlider`);
    const maxSlider = document.getElementById(`${type}MaxSlider`);
    
    if (minSlider && maxSlider) {
      const minValue = minSlider.value;
      const maxValue = maxSlider.value;
      const text = statInfo.text.replace('{minValue}', minValue).replace('{maxValue}', maxValue);
      return `<div style="color: #87CEEB;">${text}</div>`;
    }
    return '';
  }
  
  // Handle multi-stat affixes
  if (statInfo.stats) {
    let html = '';
    statInfo.stats.forEach((stat, index) => {
      const slider = document.getElementById(`${type}Slider${index}`);
      if (slider) {
        const value = slider.value;
        html += `<div style="color: #87CEEB;">${stat.text.replace('{value}', value)}</div>`;
      }
    });
    return html;
  }
  
  // Handle single stat affixes
  const slider = document.getElementById(`${type}Slider`);
  if (slider) {
    const value = slider.value;
    return `<div style="color: #87CEEB;">${statInfo.text.replace('{value}', value)}</div>`;
  }
  
  return '';
}

getStatForAffix(affix) {
  // Return stat info with min/max values and text template
  const statMap = {
    // Defense prefixes
    'Stout': { min: 1, max: 4, text: '+{value} Defense' },
    'Stout2': { min: 5, max: 8, text: '+{value} Defense' },
    'Burly': { min: 5, max: 8, text: '+{value} Defense' },
    'Stalwart': { min: 9, max: 12, text: '+{value} Defense' },
    
    // Damage prefixes
    'Red': { min: 1, max: 3, text: '+{value} to Maximum Damage' },
  'Jagged': { min: 1, max: 3, text: '+{value} to Maximum Damage' },
  'Fine': { 
      stats: [
        { min: 1, max: 3, text: '+{value} to Maximum Damage' },
        { min: 10, max: 20, text: '+{value} to Attack Rating' }
      ]
    },
    
    // LARGE CHARM Fine (different stats!)
    'Finelarge': { 
      stats: [
        { min: 1, max: 3, text: '+{value} to Maximum Damage' },
        { min: 10, max: 20, text: '+{value} to Attack Rating' }
      ]
    },

    'Sharplarge': { 
      stats: [
        { min: 4, max: 6, text: '+{value} to Maximum Damage' },
        { min: 21, max: 48, text: '+{value} to Attack Rating' }
      ]
    },
    
    // GRAND CHARM Fine (even better stats!)
    'Sharpgrand': { 
      stats: [
        { min: 7, max: 10, text: '+{value} to Maximum Damage' },
        { min: 49, max: 76, text: '+{value} to Attack Rating' }
      ]
    },

    'Fletchersgrand': { min: 1, max: 1, text: '+{value} to Bow and Crossbow Skills (Amazon Only)' },
    'Acrobatsgrand': { min: 1, max: 1, text: '+{value} to Passive and Magic Skills (Amazon Only)' },
    'Harpoonistsgrand': { min: 1, max: 1, text: '+{value} to Javelin and Spear Skills (Amazon Only)' },
    
'Burninggrand': { min: 1, max: 1, text: '+{value} to Fire Spells (Sorceress Only)' },
'Sparkinggrand': { min: 1, max: 1, text: '+{value} to Lightning Spells (Sorceress Only)' },
'Chillinggrand': { min: 1, max: 1, text: '+{value} to Cold Spells (Sorceress Only)' },

// NECROMANCER SKILLS (GRAND CHARMS ONLY)
'Hexinggrand': { min: 1, max: 1, text: '+{value} to Curses (Necromancer Only)' },
'Fungalgrand': { min: 1, max: 1, text: '+{value} to Poison and Bone Spells (Necromancer Only)' },
'Graverobbersgrand': { min: 1, max: 1, text: '+{value} to Summoning Spells (Necromancer Only)' },

// PALADIN SKILLS (GRAND CHARMS ONLY)
'Lionbrandedgrand': { min: 1, max: 1, text: '+{value} to Combat Skills (Paladin Only)' },
'Captainsgrand': { min: 1, max: 1, text: '+{value} to Offensive Auras (Paladin Only)' },
'Preserversgrand': { min: 1, max: 1, text: '+{value} to Defensive Auras (Paladin Only)' },

// BARBARIAN SKILLS (GRAND CHARMS ONLY)
'Expertsgrand': { min: 1, max: 1, text: '+{value} to Combat Skills (Barbarian Only)' },
'Fanaticgrand': { min: 1, max: 1, text: '+{value} to Combat Masteries (Barbarian Only)' },
'Soundinggrand': { min: 1, max: 1, text: '+{value} to Warcries (Barbarian Only)' },

// DRUID SKILLS (GRAND CHARMS ONLY)
'Trainersgrand': { min: 1, max: 1, text: '+{value} to Summoning Skills (Druid Only)' },
'Spiritualgrand': { min: 1, max: 1, text: '+{value} to Shape Shifting Skills (Druid Only)' },
'Naturesgrand': { min: 1, max: 1, text: '+{value} to Elemental Skills (Druid Only)' },

// ASSASSIN SKILLS (GRAND CHARMS ONLY)
'Entrappinggrand': { min: 1, max: 1, text: '+{value} to Traps (Assassin Only)' },
'Mentalistsgrand': { min: 1, max: 1, text: '+{value} to Shadow Disciplines (Assassin Only)' },
'Shogukushasgrand': { min: 1, max: 1, text: '+{value} to Martial Arts (Assassin Only)' },
    // Attack Rating
    'Bronze': { min: 7, max: 15, text: '+{value} to Attack Rating' },
    'Bronze2': { min: 16, max: 25, text: '+{value} to Attack Rating' },
    'Iron': { min: 16, max: 25, text: '+{value} to Attack Rating' },
    'Steel': { min: 26, max: 35, text: '+{value} to Attack Rating' },
    
    // Mana
    'Lizards': { min: 1, max: 5, text: '+{value} to Mana' },
    'Snakes': { min: 6, max: 10, text: '+{value} to Mana' },
    'Serpents': { min: 11, max: 15, text: '+{value} to Mana' },
    
    // Resistances
    'Shimmering': { min: 3, max: 5, text: 'All Resistances +{value}%' },
    'Azure': { min: 3, max: 5, text: 'Cold Resist +{value}%' },
    'Crimson': { min: 3, max: 5, text: 'Fire Resist +{value}%' },
    'Tangerine': { min: 3, max: 5, text: 'Lightning Resist +{value}%' },
    'Beryl': { min: 3, max: 5, text: 'Poison Resist +{value}%' },
    'Lapis': { min: 6, max: 7, text: 'Cold Resist +{value}%' },
    'Cobalt': { min: 8, max: 9, text: 'Cold Resist +{value}%' },
    'Sapphire': { min: 10, max: 11, text: 'Cold Resist +{value}%' },
    'Russet': { min: 6, max: 7, text: 'Fire Resist +{value}%' },
    'Garnet': { min: 8, max: 9, text: 'Fire Resist +{value}%' },
    'Ruby': { min: 10, max: 11, text: 'Fire Resist +{value}%' },
    'Viridian': { min: 6, max: 7, text: 'Poison Resist +{value}%' },
    'Jade': { min: 8, max: 9, text: 'Poison Resist +{value}%' },
    'Emerald': { min: 10, max: 11, text: 'Poison Resist +{value}%' },

    'Snowy': { 
    minRange: { min: 1, max: 2 }, 
    maxRange: { min: 2, max: 4 }, 
    text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)' 
  },
  'Shivering': { 
    minRange: { min: 3, max: 4 }, 
    maxRange: { min: 5, max: 8 }, 
    text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)' 
  },
  'Boreal': { 
    minRange: { min: 6, max: 8 }, 
    maxRange: { min: 10, max: 16 }, 
    text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)' 
  },
  'Hibernal': { 
    minRange: { min: 11, max: 13 }, 
    maxRange: { min: 20, max: 27 }, 
    text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)' 
  },
  
  // FIRE DAMAGE RANGES
  'Fiery': { 
    minRange: { min: 1, max: 1 }, 
    maxRange: { min: 2, max: 3 }, 
    text: 'Adds {minValue}-{maxValue} Fire Damage' 
  },
  'Smoldering': { 
    minRange: { min: 2, max: 3 }, 
    maxRange: { min: 4, max: 10 }, 
    text: 'Adds {minValue}-{maxValue} Fire Damage' 
  },
  'Smoking': { 
    minRange: { min: 4, max: 9 }, 
    maxRange: { min: 11, max: 19 }, 
    text: 'Adds {minValue}-{maxValue} Fire Damage' 
  },
  'Flaming': { 
    minRange: { min: 10, max: 19 }, 
    maxRange: { min: 20, max: 29 }, 
    text: 'Adds {minValue}-{maxValue} Fire Damage' 
  },
  
  // LIGHTNING DAMAGE RANGES
  'Static': { 
    minRange: { min: 1, max: 1 }, 
    maxRange: { min: 6, max: 11 }, 
    text: 'Adds {minValue}-{maxValue} Lightning Damage' 
  },
  'Glowing': { 
    minRange: { min: 1, max: 1 }, 
    maxRange: { min: 8, max: 17 }, 
    text: 'Adds {minValue}-{maxValue} Lightning Damage' 
  },
  'Arcing': { 
    minRange: { min: 1, max: 1 }, 
    maxRange: { min: 17, max: 30 }, 
    text: 'Adds {minValue}-{maxValue} Lightning Damage' 
  },
  'Shocking': { 
    minRange: { min: 1, max: 1 }, 
    maxRange: { min: 31, max: 50 }, 
    text: 'Adds {minValue}-{maxValue} Lightning Damage' 
  },
  
  // POISON DAMAGE RANGES
  'Septic': { 
    minRange: { min: 4, max: 4 }, 
    maxRange: { min: 4, max: 4 }, 
    text: '+{minValue} Poison Damage over 3 seconds' 
  },
  'Foul': { 
    minRange: { min: 13, max: 13 }, 
    maxRange: { min: 13, max: 13 }, 
    text: '+{minValue} Poison Damage over 2 seconds' 
  },
  'Toxic': { 
    minRange: { min: 25, max: 25 }, 
    maxRange: { min: 25, max: 25 }, 
    text: '+{minValue} Poison Damage over 2 seconds' 
  },
  'Pestilent': { 
    minRange: { min: 65, max: 65 }, 
    maxRange: { min: 65, max: 65 }, 
    text: '+{minValue} Poison Damage over 2 seconds' 
  },
  

    // Life suffixes
    'Oflife': { min: 1, max: 5, text: '+{value} to Life' },
    'Ofsustenance': { min: 1, max: 5, text: '+{value} to Life' },
    'Ofvita': { min: 6, max: 10, text: '+{value} to Life' },
    
    // Attribute suffixes
    'Ofstrength': { min: 1, max: 3, text: '+{value} to Strength' },
    'Ofdexterity': { min: 1, max: 3, text: '+{value} to Dexterity' },
    
    // Other suffixes
    'Ofinertia': { min: 3, max: 7, text: '+{value}% Faster Run/Walk' },
    'Ofgreed': { min: 10, max: 20, text: '+{value}% Extra Gold from Monsters' },
    'Offortune': { min: 5, max: 15, text: '+{value}% Better Chance of Getting Magic Items' },
    'Ofgoodluck': { min: 1, max: 3, text: '+{value}% Better Chance of Getting Magic Items' },
    'Ofbalance': { min: 5, max: 10, text: '+{value}% Faster Hit Recovery' },
    'Offrost': { 
  minRange: { min: 1, max: 1 }, 
  maxRange: { min: 2, max: 2 }, 
  text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)' 
},
'Oficicle': { 
  minRange: { min: 2, max: 2 }, 
  maxRange: { min: 3, max: 5 }, 
  text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)' 
},
'Ofglacier': { 
  minRange: { min: 4, max: 4 }, 
  maxRange: { min: 6, max: 8 }, 
  text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)' 
},
'Ofwinter': { 
  minRange: { min: 6, max: 7 }, 
  maxRange: { min: 10, max: 13 }, 
  text: 'Adds [{minValue}]-{maxValue} Cold Damage (1 second chill)' 
},

// FIRE DAMAGE SUFFIXES
'Offlame': { 
  minRange: { min: 1, max: 1 }, 
  maxRange: { min: 2, max: 2 }, 
  text: 'Adds {minValue}-{maxValue} Fire Damage' 
},
'Offire': { 
  minRange: { min: 2, max: 2 }, 
  maxRange: { min: 3, max: 5 }, 
  text: 'Adds {minValue}-{maxValue} Fire Damage' 
},
'Ofburning': { 
  minRange: { min: 3, max: 5 }, 
  maxRange: { min: 7, max: 9 }, 
  text: 'Adds {minValue}-{maxValue} Fire Damage' 
},
'Ofincineration': { 
  minRange: { min: 6, max: 8 }, 
  maxRange: { min: 10, max: 15 }, 
  text: 'Adds {minValue}-{maxValue} Fire Damage' 
},

// LIGHTNING DAMAGE SUFFIXES
'Ofshock': { 
  minRange: { min: 1, max: 1 }, 
  maxRange: { min: 3, max: 5 }, 
  text: 'Adds {minValue}-{maxValue} Lightning Damage' 
},
'Oflightning': { 
  minRange: { min: 1, max: 1 }, 
  maxRange: { min: 6, max: 9 }, 
  text: 'Adds {minValue}-{maxValue} Lightning Damage' 
},
'Ofthunder': { 
  minRange: { min: 1, max: 1 }, 
  maxRange: { min: 10, max: 16 }, 
  text: 'Adds {minValue}-{maxValue} Lightning Damage' 
},
'Ofstorms': { 
  minRange: { min: 1, max: 1 }, 
  maxRange: { min: 17, max: 25 }, 
  text: 'Adds {minValue}-{maxValue} Lightning Damage' 
},


'Ofcraftsmanship': { 
  min: 1, max: 1, 
  text: '+{value} to Maximum Damage' 
},


'Ofblight': { 
  min: 3, max: 3, 
  text: '+{value} Poison Damage over 2 seconds' 
},
'Ofvenom': { 
  min: 6, max: 6, 
  text: '+{value} Poison Damage over 2 seconds' 
},
'Ofpestilence': { 
  min: 12, max: 12, 
  text: '+{value} Poison Damage over 2 seconds' 
},
'Ofanthrax': { 
  min: 20, max: 20, 
  text: '+{value} Poison Damage over 2 seconds' 
},
  };
  
 if (statMap[affix]) {
    return statMap[affix];
  }
  
  // SECOND: If not found, try removing numbers only (keep "large"/"grand")
  const withoutNumbers = affix.replace(/\d+/g, '');
  if (statMap[withoutNumbers]) {
    return statMap[withoutNumbers];
  }
  
  // THIRD: Fall back to base affix (remove size suffixes)
  const baseAffix = affix.replace(/large|grand|\d+/g, '');
  return statMap[baseAffix] || { min: 1, max: 3, text: '+{value} to Maximum Damage' };
}

cleanAffixName(affix) {
  // First remove size suffixes and numbers
  let cleaned = affix.replace(/large|grand|\d+/g, '');
  
  // Handle "Of" prefixes properly
  if (cleaned.startsWith('Of')) {
    // Remove "Of" and get the remaining part
    let remaining = cleaned.substring(2);
    // Capitalize the first letter of the remaining part
    remaining = remaining.charAt(0).toUpperCase() + remaining.slice(1);
    cleaned = 'of ' + remaining;
  } else {
    // For regular prefixes, just capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned;
}

// Replace the createManualCharm method with this updated version:
createManualCharm() {
  if (!this.selectedSlot || !this.selectedCharmType) return;
  
  const position = parseInt(this.selectedSlot.dataset.index);
  const prefixSelect = document.getElementById('prefixSelect');
  const suffixSelect = document.getElementById('suffixSelect');
  
  if (!this.canPlaceCharm(position, this.selectedCharmType)) {
    alert('Not enough space!');
    return;
  }
  
  const charmTypeNames = {
    'small-charm': 'Small Charm',
    'large-charm': 'Large Charm', 
    'grand-charm': 'Grand Charm'
  };
  
  let charmName = charmTypeNames[this.selectedCharmType];
  let stats = [];
  
  // Handle prefix stats
  if (prefixSelect.value) {
    charmName = `${this.cleanAffixName(prefixSelect.value)} ${charmName}`;
    const prefixStat = this.getStatForAffix(prefixSelect.value);
    const prefixStatLine = this.generateStatLine('prefix', prefixStat);
    if (prefixStatLine) stats.push(prefixStatLine);
  }
  
  // Handle suffix stats
  if (suffixSelect.value) {
    charmName += ` ${this.cleanAffixName(suffixSelect.value)}`;
    const suffixStat = this.getStatForAffix(suffixSelect.value);
    const suffixStatLine = this.generateStatLine('suffix', suffixStat);
    if (suffixStatLine) stats.push(suffixStatLine);
  }
  
  const charmData = `${charmName}\n${stats.join('\n')}`;
  const backgroundImage = `url('${this.getRandomCharmImage(this.selectedCharmType)}')`;
  
  this.placeCharm(position, this.selectedCharmType, backgroundImage, charmData);
  this.hideModal();
}

generateStatLine(type, statInfo) {
  if (!statInfo) return '';
  
  // Handle range damage
  if (statInfo.minRange && statInfo.maxRange) {
    const minSlider = document.getElementById(`${type}MinSlider`);
    const maxSlider = document.getElementById(`${type}MaxSlider`);
    
    if (minSlider && maxSlider) {
      const minValue = minSlider.value;
      const maxValue = maxSlider.value;
      return statInfo.text.replace('{minValue}', minValue).replace('{maxValue}', maxValue);
    }
    return '';
  }
  
  // Handle multi-stat affixes
  if (statInfo.stats) {
    const lines = [];
    statInfo.stats.forEach((stat, index) => {
      const slider = document.getElementById(`${type}Slider${index}`);
      if (slider) {
        const value = slider.value;
        lines.push(stat.text.replace('{value}', value));
      }
    });
    return lines.join('\n');
  }
  
  // Handle single stat affixes
  const slider = document.getElementById(`${type}Slider`);
  if (slider) {
    const value = slider.value;
    return statInfo.text.replace('{value}', value);
  }
  
  return '';
}


// Add this method to get charm affixes
getCharmAffixes() {
  return {
    'small-charm': {
      prefixes: [
        'Stout', 'Stout2', 'Burly', 'Stalwart', 'Red', 'Jagged', 'Fine',
        'Bronze', 'Bronze2', 'Iron', 'Steel', 'Lizards', 'Lizards2', 
        'Snakes', 'Serpents', 'Shimmering', 'Azure', 'Lapis', 'Cobalt', 
        'Sapphire', 'Crimson', 'Russet', 'Garnet', 'Ruby', 'Tangerine', 
        'Ocher', 'Coral', 'Amber', 'Beryl', 'Viridian', 'Jade', 'Emerald',
         'Snowy', 'Shivering', 'Boreal', 'Hibernal', 'Fiery', 'Smoldering',
          'Smoking', 'Flaming', 'Static', 'Glowing', 'Arcing', 'Shocking',
           'Septic', 'Foul', 'Toxic', 'Pestilent'
      ],
      suffixes: [
        'Oflife', 'Ofsustenance', 'Ofvita', 'Ofstrength', 'Ofstrength2',
        'Ofdexterity', 'Ofdexterity2', 'Ofinertia', 'Ofgreed', 'Offortune', 'Ofgoodluck',
        'Ofbalance', 'Ofanthrax', 'Ofpestilence', 'Ofvenom', 'Ofblight', 'Ofcraftsmanship', 'Ofstorms', 'Ofthunder', 'Oflightning', 'Ofshock', 'Ofincineration', 'Ofburning', 'Offire', 'Offlame', 'Ofwinter', 'Ofglacier', 'Oficicle', 'Offrost'
      ]
    },
    'large-charm': {
      prefixes: [
        'Stoutlarge', 'Stout2large', 'Stout3large', 'Burlylarge', 'Burly2large',
        'Stalwartlarge', 'Redlarge', 'Jaggedlarge', 'Finelarge', 'Sharplarge', 'Bronzelarge'
      ],
      suffixes: [
        'Oflifelarge', 'Ofvitalarge', 'Ofstrengthlarge', 'Ofdexteritylarge',
        'Ofinertialarge', 'Ofgreedlarge', 'Ofbalancelarge'
      ]
    },
    'grand-charm': {
      prefixes: [
        'Stoutgrand', 'Stout2grand', 'Burlygrand', 'Stalwartgrand',
        'Redgrand', 'Jaggedgrand', 'Bronzegrand', 'Sharpgrand', 'Fletchersgrand', 'Acrobatsgrand', 'Harpoonistsgrand', 'Burninggrand', 'Sparkinggrand', 'Chillinggrand', 'Hexinggrand', 'Fungalgrand', 'Graverobbersgrand', 'Lionbrandedgrand', 'Captainsgrand', 'Preserversgrand', 'Expertsgrand', 'Fanaticgrand', 'Soundinggrand', 'Trainersgrand', 'Spiritualgrand', 'Naturesgrand', 'Entrappinggrand', 'Mentalistsgrand', 'Shogukushasgrand'
      ],
      suffixes: [
        'Oflifegrand', 'Ofvitagrand', 'Ofstrengthgrand', 'Ofdexteritygrand',
        'Ofineriagrand', 'Ofbalancegrand'
      ]
    }
  };
}

  // Replace the setupEventListeners method with this fixed version:
setupEventListeners() {
  const container = document.querySelector('.inventorycontainer');
  if (!container) return;

  container.addEventListener('contextmenu', e => e.preventDefault());

  // Right-click to drag - FIXED
  container.addEventListener('mousedown', (e) => {
  if (e.button === 2) {
    let targetElement = null;
    let position = null;
    
    if (e.target.classList.contains('charm-overlay')) {
      // Duplicating an overlay charm
      targetElement = e.target;
      position = parseInt(e.target.dataset.position);
    } else if (e.target.classList.contains('charm1') && e.target.style.backgroundImage) {
      // Duplicating a small charm
      targetElement = e.target;
      position = parseInt(e.target.dataset.index);
    }
    
    if (targetElement && !this.occupiedSlots.has(position)) {
      this.draggedCharm = {
        element: targetElement,
        position: position,
        backgroundImage: targetElement.style.backgroundImage,
        charmData: targetElement.dataset.charmData || '',
        charmType: this.getCharmType(targetElement)
      };
        
    
   
      }
    }
  });

  // Drop charm
  container.addEventListener('mouseup', (e) => {
  if (this.draggedCharm) {
    let targetPosition = null;
    
    // Check if clicking on an empty charm1 slot
    if (e.target.classList.contains('charm1') && 
        !e.target.style.backgroundImage && 
        !e.target.dataset.hasOverlay &&
        !this.occupiedSlots.has(parseInt(e.target.dataset.index))) {
      targetPosition = parseInt(e.target.dataset.index);
    }
    
    if (targetPosition !== null && this.canPlaceCharm(targetPosition, this.draggedCharm.charmType)) {
      this.placeCharm(targetPosition, this.draggedCharm.charmType, this.draggedCharm.backgroundImage, this.draggedCharm.charmData);
      console.log('Charm duplicated');
    } else {
      console.log('Cannot place charm here');
    }
  }
  this.draggedCharm = null;
});

  // Left-click to create
  // Left-click to create or delete
container.addEventListener('click', (e) => {
  // Check if clicking on an existing charm to delete it
  if (e.target.classList.contains('charm-overlay')) {
    // Delete overlay charm (large/grand)
    const position = parseInt(e.target.dataset.position);
    this.removeCharm(position);
  } else if (e.target.classList.contains('charm1') && e.target.style.backgroundImage) {
    // Delete small charm
    const position = parseInt(e.target.dataset.index);
    this.removeCharm(position);
  } else if (e.target.classList.contains('charm1') && !e.target.style.backgroundImage && !this.occupiedSlots.has(parseInt(e.target.dataset.index))) {
    // Create new charm on empty slot
    this.clickPosition.x = e.clientX;
    this.clickPosition.y = e.clientY;
    this.selectedSlot = e.target;
    this.showModal();
  }
});
  // Tooltips - FIXED to handle both overlays and regular charms
  container.addEventListener('mouseover', (e) => {
    let targetElement = null;
    let charmData = null;
    
    if (e.target.classList.contains('charm-overlay')) {
      // Hovering over overlay charm
      targetElement = e.target;
      charmData = e.target.dataset.charmData;
    } else if (e.target.classList.contains('charm1') && e.target.dataset.charmData && !this.occupiedSlots.has(parseInt(e.target.dataset.index))) {
      // Hovering over regular small charm
      targetElement = e.target;
      charmData = e.target.dataset.charmData;
    }
    
    if (targetElement && charmData) {
      this.showTooltip(e, charmData);
    }
  });

  container.addEventListener('mouseout', (e) => {
    this.hideTooltip();
  });

  // Modal events
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close') || e.target.id === 'charmModal') {
      this.hideModal();
    }
    
    if (e.target.matches('.charm-types button')) {
      this.createCharm(e.target.dataset.type);
    }
  });
}

  getCharmType(element) {
    if (element.classList.contains('small-charm')) return 'small-charm';
    if (element.classList.contains('large-charm')) return 'large-charm';
    if (element.classList.contains('grand-charm')) return 'grand-charm';
    return 'small-charm';
  }


// Add this missing placeCharm method:
placeCharm(position, charmType, backgroundImage, charmData) {
  const container = document.querySelector('.inventorycontainer');
  const mainSlot = container.children[position];
  
  // Calculate position
  const row = Math.floor(position / 10);
  const col = position % 10;
  const height = charmType === 'grand-charm' ? 3 : charmType === 'large-charm' ? 2 : 1;
  
  if (height === 1) {
    // Small charm - normal grid behavior
    mainSlot.style.backgroundImage = backgroundImage;
    mainSlot.classList.add(charmType);
    mainSlot.dataset.charmData = charmData;
  } else {
    // Large/Grand charm - create overlay element
    const charmOverlay = document.createElement('div');
    charmOverlay.style.cssText = `
      position: absolute;
      left: ${col * 30}px;
      top: ${row * 30}px;
      width: 30px;
      height: ${height * 30}px;
      background-image: ${backgroundImage};
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 10;
      pointer-events: auto;
      cursor: pointer;
      border: 1px solid rgb(164, 19, 19);
      box-sizing: border-box;
    `;
    
    charmOverlay.classList.add('charm-overlay', charmType);
    charmOverlay.dataset.charmData = charmData;
    charmOverlay.dataset.position = position;
    
    // Add to container
    container.appendChild(charmOverlay);
    
    // Mark main slot as occupied but invisible
    mainSlot.style.visibility = 'hidden';
    mainSlot.dataset.hasOverlay = 'true';
    
    // Mark other occupied slots
    for (let r = 1; r < height; r++) {
      const occupiedPos = position + (r * 10);
      if (occupiedPos < 40) {
        this.occupiedSlots.add(occupiedPos);
        const occupiedSlot = container.children[occupiedPos];
        occupiedSlot.style.visibility = 'hidden';
      }
    }
  }

  // Recalculate stats after placing ANY charm (moved outside the if/else and loop)
  if (window.statsCalculator) {
    setTimeout(() => window.statsCalculator.calculateAllStats(), 50);
  }
  if (window.characterStats) {
  setTimeout(() => window.characterStats.updateTotalStats(), 100);
}
}



  canPlaceCharm(position, charmType) {
  const container = document.querySelector('.inventorycontainer');
  const row = Math.floor(position / 10);
  const height = charmType === 'grand-charm' ? 3 : charmType === 'large-charm' ? 2 : 1;
  
  // Check if it fits in grid
  if (row + height > 4) return false;
  
  // Check if slots are free
  for (let r = 0; r < height; r++) {
    const checkPos = position + (r * 10);
    if (checkPos >= 40) return false;
    
    const slot = container.children[checkPos];
    // Check for regular charms, overlays, or occupied slots
    if (slot.style.backgroundImage || 
        slot.dataset.hasOverlay || 
        this.occupiedSlots.has(checkPos)) {
      return false;
    }
  }
  
  return true;
}

  // Replace the placeCharm method with this:


// Also update removeCharm method:
removeCharm(position) {
  const container = document.querySelector('.inventorycontainer');
  const mainSlot = container.children[position];
  
  // Check if this slot has an overlay
  if (mainSlot.dataset.hasOverlay) {
    // Find and remove the overlay
    const overlay = container.querySelector(`[data-position="${position}"]`);
    if (overlay) {
      const charmType = this.getCharmType(overlay);
      const height = charmType === 'grand-charm' ? 3 : charmType === 'large-charm' ? 2 : 1;
      
      overlay.remove();
      
      // Restore main slot
      mainSlot.style.visibility = 'visible';
      mainSlot.dataset.hasOverlay = '';
      
      // Restore occupied slots
      for (let r = 1; r < height; r++) {
        const occupiedPos = position + (r * 10);
        this.occupiedSlots.delete(occupiedPos);
        const occupiedSlot = container.children[occupiedPos];
        if (occupiedSlot) {
          occupiedSlot.style.visibility = 'visible';
        }
      }
    }
  } else {
    // Regular small charm
    mainSlot.style.backgroundImage = '';
    mainSlot.classList.remove('small-charm', 'large-charm', 'grand-charm');
    mainSlot.dataset.charmData = '';
  }

  // Recalculate stats after removing ANY charm (moved outside the if/else)
  if (window.statsCalculator) {
    setTimeout(() => window.statsCalculator.calculateAllStats(), 50);
  }
  if (window.characterStats) {
  setTimeout(() => window.characterStats.updateTotalStats(), 100);
}
}


// Update the drag detection in mousedown event:
// Replace the mousedown event with this:

  // Replace the generateRandomCharmName method with this:


  // Generate stats based on affix type
  
  

  showTooltip(e, charmData) {
  this.hideTooltip();
  
  const tooltip = document.createElement('div');
  tooltip.id = 'charmTooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px;
    border: 1px solid rgb(164, 19, 19);
    border-radius: 4px;
    font-family: overlock sc;
    font-size: 12px;
    z-index: 10001;
    pointer-events: none;
    white-space: pre-line;
    left: ${e.clientX + 10}px;
    top: ${e.clientY + 10}px;
  `;
  tooltip.textContent = charmData;
  
  document.body.appendChild(tooltip);
}

hideTooltip() {
  const tooltip = document.getElementById('charmTooltip');
  if (tooltip) tooltip.remove();
}


  showModal() {
  const modal = document.getElementById('charmModal');
  if (modal) {
    // RESET MODAL STATE
    this.selectedCharmType = null;
    
    // Show charm type selection, hide configuration
    document.getElementById('charmTypeSelection').style.display = 'block';
    document.getElementById('charmConfiguration').style.display = 'none';
    
    // Reset all form elements
    const prefixSelect = document.getElementById('prefixSelect');
    const suffixSelect = document.getElementById('suffixSelect');
    const preview = document.getElementById('charmPreview');
    const prefixStats = document.getElementById('prefixStats');
    const suffixStats = document.getElementById('suffixStats');
    
    if (prefixSelect) prefixSelect.innerHTML = '<option value="">None</option>';
    if (suffixSelect) suffixSelect.innerHTML = '<option value="">None</option>';
    if (preview) preview.innerHTML = 'Select charm type to begin';
    if (prefixStats) prefixStats.innerHTML = '';
    if (suffixStats) suffixStats.innerHTML = '';
    
    // Remove selected state from charm type buttons
    document.querySelectorAll('.charm-type-btn').forEach(btn => {
      btn.classList.remove('selected');
      btn.style.backgroundColor = '';
    });
    
    // Position and show modal
    let left = this.clickPosition.x + 10;
    let top = this.clickPosition.y + 10;
    
    left = Math.max(10, Math.min(left, window.innerWidth - 420));
    top = Math.max(10, Math.min(top, window.innerHeight - 300));
    
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
    modal.style.display = 'block';
  }
}

hideModal() {
  const modal = document.getElementById('charmModal');
  if (modal) modal.style.display = 'none';
  this.selectedSlot = null;
}

  clearInventory() {
    const container = document.querySelector('.inventorycontainer');
    if (!container) return;

    this.occupiedSlots.clear();
    this.charmElements.clear();
    
    Array.from(container.children).forEach(slot => {
      slot.className = 'charm1';
      slot.textContent = '';
      slot.style.backgroundImage = '';
      slot.style.backgroundColor = 'transparent';
      slot.style.color = '';
      slot.style.fontSize = '';
      slot.style.gridRow = '';
      slot.style.zIndex = '';
      slot.style.visibility = 'visible';
      slot.dataset.charmData = '';
    });
  }
}

// Initialize
let charmInventory;

function initCharmInventory() {
  if (charmInventory && charmInventory.initialized) return;
  
  charmInventory = new CharmInventory();
  charmInventory.init();
  
  window.charmInventory = charmInventory;
  window.clearCharmInventory = () => charmInventory.clearInventory();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharmInventory);
} else {
  initCharmInventory();
}

window.addEventListener('load', () => {
  if (!charmInventory || !charmInventory.initialized) {
    setTimeout(initCharmInventory, 200);
  }
});

window.forceInitCharmInventory = initCharmInventory;