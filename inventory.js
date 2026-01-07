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
        'img/small4.png',
        'img/corrannihilus.png',
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
        'img/grand3.png'
      ]
    };

    // Unique charms with fixed stats and customizable ranges
    this.uniqueCharms = {
      'annihilus': {
        name: 'Annihilus',
        type: 'small-charm',
        imagePath: 'img/annihilus.png',
        stats: [
          { label: '+1 to All Skills', key: 'skills', fixed: 1 },
          { label: '+{value} to Vitality', key: 'vitality', min: 30, max: 60, value: 30 },
          { label: '+{value} to Energy', key: 'energy', min: 10, max: 20, value: 10 },
          { label: 'All Resistances +{value}%', key: 'allres', min: 10, max: 20, value: 10 },
          { label: '+{value}% to Experience Gained', key: 'expgain', min: 5, max: 10, value: 5 }
        ]
      },
      'hellfire-torch': {
        name: 'Hellfire Torch',
        type: 'large-charm',
        imagePath: 'img/hellfiretorch.png',
        stats: [
          { label: '+2 to [Random Class] Skills', key: 'classskills', fixed: 2 },
          { label: '+{value} to Vitality', key: 'vitality', min: 30, max: 60, value: 30 },
          { label: '+{value} to Energy', key: 'energy', min: 10, max: 20, value: 10 },
          { label: 'All Resistances +{value}%', key: 'allres', min: 10, max: 20, value: 10 },
          { label: '+{value} to Light Radius', key: 'lightradius', min: 4, max: 8, value: 4 }
        ]
      },
      'gheeds-fortune': {
        name: "Gheed's Fortune",
        type: 'grand-charm',
        imagePath: 'img/gheedsfortune.png',
        stats: [
          { label: '+{value}% Extra Gold from Monsters', key: 'gold', min: 80, max: 160, value: 80 },
          { label: '+{value}% Better Chance of Getting Magic Items', key: 'mf', min: 20, max: 40, value: 20 },
          { label: 'Reduces All Vendor Prices {value}%', key: 'vendorprice', min: 10, max: 15, value: 10 }
        ]
      },
      'corrupted-annihilus': {
        name: 'Annihilus',
        type: 'small-charm',
        imagePath: 'img/corrannihilus.png',
        stats: [
          { label: '+2 to All Skills', key: 'skills', fixed: 2 },
          { label: '+{value} to Vitality', key: 'vitality', min: 30, max: 60, value: 30 },
          { label: '+{value} to Energy', key: 'energy', min: 10, max: 20, value: 10 },
          { label: 'All Resistances +{value}%', key: 'allres', min: 10, max: 20, value: 10 },
          { label: '+{value}% to Experience Gained', key: 'expgain', min: 5, max: 10, value: 5 }
        ]
      },
    };

    this.occupiedSlots = new Set(); // Track occupied slots
    this.charmElements = new Map(); // Track charm elements and their occupied slots
    this.selectedUniqueCharm = null; // Track selected unique charm
    this.initialized = false;
  }

  init() {
    setTimeout(() => {
      this.createInventoryGrid();
      this.createModal();
      this.setupEventListeners();
      this.preloadCharmImages();  // Preload all charm images
      this.initialized = true;
      // Fix any existing charms' titles
      this.fixCharmTitles();

    }, 100);
  }

  preloadCharmImages() {
    // Preload all charm images to avoid delays when placing charms
    Object.values(this.charmImages).forEach(imageArray => {
      imageArray.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
      });
    });

    // Preload unique charm images
    Object.values(this.uniqueCharms).forEach(charm => {
      const img = new Image();
      img.src = charm.imagePath;
    });
  }

  createInventoryGrid() {
    let container = document.querySelector('.inventorycontainer');

    if (!container) {
      container = document.createElement('div');
      container.className = 'inventorycontainer';
      document.body.appendChild(container);
    }

    // If grid already exists with 40 slots, don't recreate it
    // This prevents clearing charms that were already placed
    if (container.children.length === 40) {

      return;
    }

    // Only clear and recreate if needed
    if (container.children.length > 0 && container.children.length !== 40) {
      console.warn('Charm inventory has wrong number of slots, recreating');
      container.innerHTML = '';
    }

    // Seamless grid without gaps
    container.style.cssText = `
      position: absolute;
      margin-top: -120px;
      left: 60vw;
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

  clearAll() {
    const container = document.querySelector('.inventorycontainer');
    if (container) {
      // Remove all overlays (charms) while keeping the grid slots
      const overlays = container.querySelectorAll('.charm-overlay');
      overlays.forEach(overlay => overlay.remove());
    }
    this.occupiedSlots.clear();
    this.charmElements.clear();
    this.checkUniqueCharmAvailability();

    // Trigger stat update if needed
    if (window.unifiedSocketSystem) {
      window.unifiedSocketSystem.updateAll();
    }
  }

  // Replace the createModal and createCharm methods with these:

  createModal() {
    // RESET STATE before anything else
    this.selectedUniqueCharm = null;
    this.selectedCharmType = null;

    const existing = document.getElementById('charmModal');
    if (existing) {
      // Remove old modal AND all its event listeners by cloning and replacing
      const newModal = existing.cloneNode(true);
      existing.parentNode.replaceChild(newModal, existing);
      newModal.remove();
    }

    // Create fresh modal
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
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
      ">
        <span class="close">&times;</span>
        <h3 style="margin: 0 0 20px 0; color: rgb(164, 19, 19);">Create Charm</h3>

        <!-- Selection View: UNIFIED, shown at start -->
        <div id="charmSelectionView">
          <h4 style="color: rgb(164, 19, 19); margin: 10px 0;">Unique Charms:</h4>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px;">
            <button data-unique="annihilus" class="unique-charm-btn" style="cursor: pointer !important; padding: 10px; background: rgba(164, 19, 19, 0.3); border: 1px solid rgb(164, 19, 19); color: #FFD700; border-radius: 3px; transition: all 0.2s ease; font-family: overlock sc; font-size: 14px;" onmouseover="this.style.background='rgba(164, 19, 19, 0.6)'; this.style.cursor='pointer';" onmouseout="this.style.background='rgba(164, 19, 19, 0.3)'; this.style.cursor='pointer';">Annihilus</span> (Small)</button>
            <button data-unique="corrupted-annihilus" class="unique-charm-btn" style="cursor: pointer !important; padding: 10px; background: rgba(164, 19, 19, 0.3); border: 1px solid rgb(164, 19, 19); color: #FFD700; border-radius: 3px; transition: all 0.2s ease; font-family: overlock sc; font-size: 14px;" onmouseover="this.style.background='rgba(164, 19, 19, 0.6)'; this.style.cursor='pointer';" onmouseout="this.style.background='rgba(164, 19, 19, 0.3)'; this.style.cursor='pointer';">Annihilus (Corrupted)</span> (Small)</button>
            <button data-unique="hellfire-torch" class="unique-charm-btn" style="cursor: pointer !important; padding: 10px; background: rgba(164, 19, 19, 0.3); border: 1px solid rgb(164, 19, 19); color: #FFD700; border-radius: 3px; transition: all 0.2s ease; font-family: overlock sc; font-size: 14px;" onmouseover="this.style.background='rgba(164, 19, 19, 0.6)'; this.style.cursor='pointer';" onmouseout="this.style.background='rgba(164, 19, 19, 0.3)'; this.style.cursor='pointer';">Hellfire Torch</span> (Large)</button>
            <button data-unique="gheeds-fortune" class="unique-charm-btn" style="cursor: pointer !important; padding: 10px; background: rgba(164, 19, 19, 0.3); border: 1px solid rgb(164, 19, 19); color: #FFD700; border-radius: 3px; transition: all 0.2s ease; font-family: overlock sc; font-size: 14px;" onmouseover="this.style.background='rgba(164, 19, 19, 0.6)'; this.style.cursor='pointer';" onmouseout="this.style.background='rgba(164, 19, 19, 0.3)'; this.style.cursor='pointer';">Gheed's Fortune</span> (Grand)</button>
          </div>
          <div style="text-align: center; color: #888; font-size: 12px; margin: 15px 0; border-top: 1px solid rgb(80, 80, 80); border-bottom: 1px solid rgb(80, 80, 80); padding: 10px 0;">Regular Charms</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button data-type="small-charm" class="charm-type-btn" style="cursor: pointer !important; padding: 10px; background: rgba(164, 19, 19, 0.3); border: 1px solid rgb(164, 19, 19); color: #FFD700; border-radius: 3px; transition: all 0.2s ease; font-family: overlock sc; font-size: 14px;" onmouseover="this.style.background='rgba(164, 19, 19, 0.6)'; this.style.cursor='pointer';" onmouseout="this.style.background='rgba(164, 19, 19, 0.3)'; this.style.cursor='pointer';">Small Charm (1x1)</button>
            <button data-type="large-charm" class="charm-type-btn" style="cursor: pointer !important; padding: 10px; background: rgba(164, 19, 19, 0.3); border: 1px solid rgb(164, 19, 19); color: #FFD700; border-radius: 3px; transition: all 0.2s ease; font-family: overlock sc; font-size: 14px;" onmouseover="this.style.background='rgba(164, 19, 19, 0.6)'; this.style.cursor='pointer';" onmouseout="this.style.background='rgba(164, 19, 19, 0.3)'; this.style.cursor='pointer';">Large Charm (1x2)</button>
            <button data-type="grand-charm" class="charm-type-btn" style="cursor: pointer !important; padding: 10px; background: rgba(164, 19, 19, 0.3); border: 1px solid rgb(164, 19, 19); color: #FFD700; border-radius: 3px; transition: all 0.2s ease; font-family: overlock sc; font-size: 14px;" onmouseover="this.style.background='rgba(164, 19, 19, 0.6)'; this.style.cursor='pointer';" onmouseout="this.style.background='rgba(164, 19, 19, 0.3)'; this.style.cursor='pointer';">Grand Charm (1x3)</button>
          </div>
        </div>

        <!-- Customization View: hidden initially -->
        <div id="charmCustomizationView" style="display: none; flex: 1; display: flex; flex-direction: column;">
          <div style="flex: 1; overflow-y: auto; padding-right: 10px;">
            <!-- Unique charm customization -->
            <div id="uniqueCharmCustomization" style="display: none;">
              <div id="uniqueCharmStats" style="margin-bottom: 15px;"></div>
              <div id="uniqueCharmPreview" style="
                background: rgba(42, 42, 78, 0.5);
                border: 1px solid rgb(164, 19, 19);
                border-radius: 4px;
                padding: 10px;
                min-height: 80px;
                color: #FFD700;
              "></div>
            </div>

            <!-- Regular charm customization -->
            <div id="regularCharmCustomization" style="display: none;">
              <div style="margin-bottom: 15px;">
                <h4 style="color: rgb(164, 19, 19); margin: 10px 0;">Prefix:</h4>
                <select id="prefixSelect" style="width: 80%; padding: 5px; background: rgb(20, 20, 20); color: white; border: 1px solid rgb(164, 19, 19); cursor: pointer !important;">
                  <option value="">None</option>
                </select>
                <div id="prefixStats" style="margin-top: 10px; color: #87CEEB;"></div>
              </div>

              <div style="margin-bottom: 15px;">
                <h4 style="color: rgb(164, 19, 19); margin: 10px 0;">Suffix:</h4>
                <select id="suffixSelect" style="width: 80%; padding: 5px; background: rgb(20, 20, 20); color: white; border: 1px solid rgb(164, 19, 19); cursor: pointer !important;">
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
            </div>
          </div>

          <!-- Fixed button container at bottom -->
          <div style="
            position: sticky;
            bottom: 0;
            background: rgb(5, 5, 5);
            padding: 15px 0 0 0;
            border-top: 1px solid rgb(164, 19, 19);
            margin-top: 10px;
          ">
            <button id="createCharmBtn" style="
              background: rgb(164, 19, 19);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 4px;
              cursor: pointer !important;
              width: 100%;
              font-size: 16px;
              font-weight: bold;
              transition: all 0.2s ease;
            " onmouseover="this.style.background='rgb(200, 30, 30)'; this.style.cursor='pointer';"
               onmouseout="this.style.background='rgb(164, 20, 19)'; this.style.cursor='pointer';">Create Charm</button>
            <button id="backCharmBtn" style="
              background: rgb(60, 60, 60);
              color: white;
              border: none;
              padding: 10px 24px;
              border-radius: 4px;
              cursor: pointer !important;
              width: 100%;
              font-size: 14px;
              margin-top: 8px;
              transition: all 0.2s ease;
              display: none;
            " onmouseover="this.style.background='rgb(80, 80, 80)'; this.style.cursor='pointer';"
               onmouseout="this.style.background='rgb(60, 60, 60)'; this.style.cursor='pointer';">Back</button>
          </div>
        </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.setupModalEvents();
    this.checkUniqueCharmAvailability();
  }

  setupModalEvents() {
    const modal = document.getElementById('charmModal');

    // Close modal
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('close') || e.target.id === 'charmModal') {
        e.stopPropagation();
        this.hideModal();
      }
    });

    // Unique charm selection
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('unique-charm-btn') && !e.target.disabled) {
        e.stopPropagation();
        this.selectUniqueCharm(e.target.dataset.unique);
      }
    });

    // Charm type selection
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('charm-type-btn')) {
        e.stopPropagation();
        this.selectCharmType(e.target.dataset.type);
      }
    });

    // Back button
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'backCharmBtn') {
        e.stopPropagation();
        this.backToCharmSelection();
      }
    });

    // Prefix/Suffix selection
    modal.addEventListener('change', (e) => {
      if (e.target.id === 'prefixSelect' || e.target.id === 'suffixSelect') {
        e.stopPropagation();
        this.updateCharmPreview();
      }
    });

    // Create charm button
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'createCharmBtn') {
        e.stopPropagation();
        if (this.selectedUniqueCharm) {
          this.createUniqueCharm();
        } else {
          this.createManualCharm();
        }
      }
    });
  }

  checkUniqueCharmAvailability() {
    const uniqueCharmNames = {
      'annihilus': "Annihilus",
      'hellfire-torch': "Hellfire Torch",
      'gheeds-fortune': "Gheed's Fortune",
      'corrupted-annihilus': "Annihilus"
    };
    const container = document.querySelector('.inventorycontainer');
    if (!container) return;

    // Check which unique charms are already in inventory
    const existingCharms = {};
    for (const [key, name] of Object.entries(uniqueCharmNames)) {
      existingCharms[key] = false;
    }

    // Search ALL elements with data-charm-data attribute (both slots and overlays)
    const allCharmElements = container.querySelectorAll('[data-charm-data]');
    allCharmElements.forEach(element => {
      try {
        const charmDataStr = element.dataset.charmData;
        if (!charmDataStr) return;

        const data = JSON.parse(charmDataStr);
        if (!data || !data.name) return;

        // Check if this charm matches any unique charm
        for (const [key, uniqueName] of Object.entries(uniqueCharmNames)) {
          if (data.name.trim() === uniqueName.trim()) {
            existingCharms[key] = true;
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    });

    // Disable buttons for already-existing unique charms
    Object.entries(existingCharms).forEach(([key, exists]) => {
      const btn = document.querySelector(`.unique-charm-btn[data-unique="${key}"]`);
      if (btn) {
        if (exists) {
          btn.disabled = true;
          btn.style.opacity = '0.5';
          btn.style.cursor = 'not-allowed';
          btn.style.background = 'rgba(100, 100, 100, 0.3)';
          btn.style.color = '#999';
          btn.title = 'Already in inventory (max 1 per charm)';
        } else {
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
          btn.style.background = 'rgba(164, 19, 19, 0.3)';
          btn.style.color = '#FFD700';
          btn.title = '';
        }
      }
    });
  }

  selectUniqueCharm(uniqueCharmKey) {
    this.selectedUniqueCharm = uniqueCharmKey;
    this.selectedCharmType = null;
    const uniqueCharm = this.uniqueCharms[uniqueCharmKey];

    // Switch to customization view
    document.getElementById('charmSelectionView').style.display = 'none';
    document.getElementById('charmCustomizationView').style.display = 'flex';
    document.getElementById('backCharmBtn').style.display = 'block';

    // Show only unique charm customization
    document.getElementById('uniqueCharmCustomization').style.display = 'block';
    document.getElementById('regularCharmCustomization').style.display = 'none';

    // Populate and show stats
    this.populateUniqueCharmStats(uniqueCharm);
    this.updateUniqueCharmPreview(uniqueCharm);
  }

  backToCharmSelection() {
    this.selectedUniqueCharm = null;
    this.selectedCharmType = null;
    document.getElementById('charmSelectionView').style.display = 'block';
    document.getElementById('charmCustomizationView').style.display = 'none';
    document.getElementById('backCharmBtn').style.display = 'none';
    // Re-check availability when going back to selection
    this.checkUniqueCharmAvailability();
  }

  populateUniqueCharmStats(uniqueCharm) {
    const statsContainer = document.getElementById('uniqueCharmStats');
    let html = '';

    // Get the current selected class for stat labels
    const classSelect = document.getElementById('selectClass');
    const currentClass = classSelect ? classSelect.value : 'Amazon';

    uniqueCharm.stats.forEach((stat, index) => {
      if (stat.fixed !== undefined) {
        // Fixed value - no slider
        let statLabel = stat.label;
        // Replace [Random Class] with actual class name for Hellfire Torch
        if (statLabel.includes('[Random Class]')) {
          statLabel = statLabel.replace('[Random Class]', currentClass);
        }
        html += `
        <div style="margin-bottom: 10px;">
          <div style="color: #FFD700; margin-bottom: 3px;">${statLabel}</div>
          <div style="color: #999; font-size: 12px;">${stat.fixed}</div>
        </div>
      `;
      } else {
        // Variable value - add slider
        const sliderId = `uniqueStat${index}`;
        const valueId = `uniqueStatValue${index}`;
        html += `
        <div style="margin-bottom: 10px;">
          <div style="color: #FFD700; margin-bottom: 3px;">${stat.label.replace('{value}', '')}</div>
          <input type="range" id="${sliderId}" min="${stat.min}" max="${stat.max}" value="${stat.value}"
                 style="width: 100%; margin-bottom: 5px; cursor: pointer !important;"
                 oninput="window.charmInventory.updateUniqueCharmPreview(); document.getElementById('${valueId}').textContent = this.value;">
          <div style="text-align: center; color: white; font-size: 12px;">
            <span id="${valueId}">${stat.value}</span> / ${stat.max}
          </div>
        </div>
      `;
      }
    });

    statsContainer.innerHTML = html;
  }

  updateUniqueCharmPreview(uniqueCharm = null) {
    if (!uniqueCharm) {
      uniqueCharm = this.uniqueCharms[this.selectedUniqueCharm];
    }

    // Get the current selected class for preview
    const classSelect = document.getElementById('selectClass');
    const currentClass = classSelect ? classSelect.value : 'Amazon';

    const preview = document.getElementById('uniqueCharmPreview');
    let previewHTML = `<div style="color: #FFD700; font-weight: bold; margin-bottom: 8px;">${uniqueCharm.name}</div>`;

    uniqueCharm.stats.forEach((stat, index) => {
      if (stat.fixed !== undefined) {
        let statLabel = stat.label;
        // Replace [Random Class] with actual class name for Hellfire Torch preview
        if (statLabel.includes('[Random Class]')) {
          statLabel = statLabel.replace('[Random Class]', currentClass);
        }
        previewHTML += `<div style="color: #87CEEB;">${statLabel}</div>`;
      } else {
        const slider = document.getElementById(`uniqueStat${index}`);
        const value = slider ? slider.value : stat.value;
        previewHTML += `<div style="color: #87CEEB;">${stat.label.replace('{value}', value)}</div>`;
      }
    });

    preview.innerHTML = previewHTML;
  }

  selectCharmType(type) {
    this.selectedUniqueCharm = null;
    this.selectedCharmType = type;

    // Switch to customization view
    document.getElementById('charmSelectionView').style.display = 'none';
    document.getElementById('charmCustomizationView').style.display = 'flex';
    document.getElementById('backCharmBtn').style.display = 'block';

    // Show only regular charm customization
    document.getElementById('uniqueCharmCustomization').style.display = 'none';
    document.getElementById('regularCharmCustomization').style.display = 'block';

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
      'Bronze': { min: 2, max: 4, text: '+{value} to Attack Rating' },
      'Bronze2': { min: 6, max: 12, text: '+{value} to Attack Rating' },
      'Iron': { min: 13, max: 24, text: '+{value} to Attack Rating' },
      'Steel': { min: 25, max: 36, text: '+{value} to Attack Rating' },

      // Mana and rest
      'Lizards': { min: 1, max: 2, text: '+{value} to Mana' },
      'Lizards2': { min: 3, max: 7, text: '+{value} to Mana' },
      'Snakes': { min: 8, max: 12, text: '+{value} to Mana' },
      'Serpents': { min: 13, max: 17, text: '+{value} to Mana' },
      'Serpentslarge': { min: 30, max: 34, text: '+{value} to Mana' },
      'Discharginglarge': { min: 2, max: 3, text: '+{value}% to Lightning Skill Damage' },
      'Frigidlarge': { min: 2, max: 3, text: '+{value}% to Cold Skill Damage' },
      'Wildfirelarge': { min: 2, max: 3, text: '+{value}% to Fire Skill Damage' },
      'Maliciouslarge': { min: 2, max: 3, text: '+{value}% to Poison Skill Damage' },
      'Effervescentlarge': { min: 2, max: 3, text: '+{value}% to Magic Skill Damage' },
      // 'Conduitlarge' : { min: 3, max: 4, text: '+{value}% to Lightning Skill Damage' },
      // 'Numbinglarge' : { min: 3, max: 4, text: '+{value}% to Cold Skill Damage' },
      // 'Infernolarge' : { min: 3, max: 4, text: '+{value}% to Fire Skill Damage' },
      // 'Infectiouslarge' : { min: 3, max: 4, text: '+{value}% to Poison Skill Damage' },
      // 'Scintillatinglarge': { min: 3, max: 4, text: '+{value}% to Magic Skill Damage' },

      // Resistances
      'Shimmering': { min: 3, max: 5, text: 'All Resistances +{value}' },
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
      'Oflife': { min: 5, max: 10, text: '+{value} to Life' },
      'Ofsustenance': { min: 11, max: 15, text: '+{value} to Life' },
      'Ofvita': { min: 16, max: 20, text: '+{value} to Life' },
      'Oflifegrand': { min: 21, max: 25, text: '+{value} to Life' },
      'Ofvitagrand': { min: 41, max: 45, text: '+{value} to Life' },

      // Attribute suffixes
      'Ofstrength': { min: 1, max: 1, text: '+{value} to Strength' },
      'Ofstrength2': { min: 2, max: 2, text: '+{value} to Strength' },
      'Ofdexterity': { min: 1, max: 1, text: '+{value} to Dexterity' },
      'Ofdexterity2': { min: 2, max: 2, text: '+{value} to Dexterity' },
      'Ofstrengthlarge': { min: 2, max: 3, text: '+{value} to Strength' },
      'Ofstrength2large': { min: 4, max: 5, text: '+{value} to Strength' },
      'Ofdexteritylarge': { min: 2, max: 3, text: '+{value} to Dexterity' },
      'Ofdexterity2large': { min: 4, max: 5, text: '+{value} to Dexterity' },
      'Ofsustenancelarge': { min: 16, max: 20, text: '+{value} to Life' },


      // Other suffixes
      'Ofinertia': { min: 3, max: 3, text: '+{value}% Faster Run/Walk' },
      'Ofinertiagrand': { min: 7, max: 7, text: '+{value}% Faster Run/Walk' },
      'Ofgreed': { min: 5, max: 10, text: '+{value}% Extra Gold from Monsters' },
      'Offortune': { min: 3, max: 5, text: '+{value}% Better Chance of Getting Magic Items' },
      'Ofgoodluck': { min: 6, max: 73, text: '+{value}% Better Chance of Getting Magic Items' },
      'Ofbalance': { min: 5, max: 5, text: '+{value}% Faster Hit Recovery' },
      'Ofbalancegrand': { min: 12, max: 12, text: '+{value}% Faster Hit Recovery' },
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
        text: 'Adds {minValue}-{maxValue} Cold Damage (1 second chill)'
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

  createUniqueCharm() {
    if (!this.selectedSlot || !this.selectedUniqueCharm) return;

    const position = parseInt(this.selectedSlot.dataset.index);
    const uniqueCharm = this.uniqueCharms[this.selectedUniqueCharm];
    const charmType = uniqueCharm.type;

    // VALIDATION: Check if this unique charm already exists in inventory
    const container = document.querySelector('.inventorycontainer');
    if (container) {
      const allCharmElements = container.querySelectorAll('[data-charm-data]');
      for (const element of allCharmElements) {
        const charmDataStr = element.dataset.charmData;
        let charmName = '';
        try {
          const jsonData = JSON.parse(charmDataStr);
          charmName = jsonData.name;
        } catch (e) {
          // Fallback for malformed data
          continue;
        }
        if (charmName && charmName.trim() === uniqueCharm.name.trim()) {
          alert(`${uniqueCharm.name} is already in inventory! Max 1 per charm.`);
          return;
        }
      }
    }

    if (!this.canPlaceCharm(position, charmType)) {
      alert('Not enough space!');
      return;
    }

    let stats = [];

    // Get the current selected class for Hellfire Torch
    const classSelect = document.getElementById('selectClass');
    const currentClass = classSelect ? classSelect.value : 'Amazon';

    // Build stats from unique charm definition with current slider values
    uniqueCharm.stats.forEach((stat, index) => {
      if (stat.fixed !== undefined) {
        // Fixed value
        let statLabel = stat.label;
        // Replace [Random Class] with actual class name for Hellfire Torch
        if (statLabel.includes('[Random Class]')) {
          statLabel = statLabel.replace('[Random Class]', currentClass);
        }
        stats.push(statLabel);
      } else {
        // Variable value - get from slider
        const slider = document.getElementById(`uniqueStat${index}`);
        const value = slider ? slider.value : stat.value;
        stats.push(stat.label.replace('{value}', value));
      }
    });

    // Create charm data as JSON (consistent with regular charms for URL sharing)
    const displayText = `${uniqueCharm.name}\n${stats.join('\n')}`;
    const charmData = JSON.stringify({
      name: uniqueCharm.name,
      stats: stats,
      displayText: displayText,
      imagePath: uniqueCharm.imagePath,
      isUnique: true  // Mark as unique charm for easier identification
    });

    const backgroundImage = `url('${uniqueCharm.imagePath}')`;
    this.placeCharm(position, charmType, backgroundImage, charmData, displayText);

    // Store the image path in a separate data attribute so we can restore it
    const mainSlot = container.children[position];
    if (mainSlot) mainSlot.dataset.imagePath = uniqueCharm.imagePath;

    // Also set on overlays if it's a large/grand charm
    const overlay = container.querySelector(`.charm-overlay[data-position="${position}"]`);
    if (overlay) overlay.dataset.imagePath = uniqueCharm.imagePath;

    this.hideModal();
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

    // Store charm data as JSON object instead of formatted string
    const imagePath = this.getRandomCharmImage(this.selectedCharmType);
    const charmData = JSON.stringify({
      name: charmName,
      stats: stats,
      displayText: `${charmName}\n${stats.join('\n')}`,
      imagePath: imagePath  // Store the exact image path so it can be restored
    });

    // Create clean hover text (charm name on first line, then each stat on its own line)
    const hoverText = stats.length > 0 ? `${charmName}\n${stats.join('\n')}` : charmName;

    const backgroundImage = `url('${imagePath}')`;
    this.placeCharm(position, this.selectedCharmType, backgroundImage, charmData, hoverText);
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
          'Stalwartlarge', 'Redlarge', 'Jaggedlarge', 'Finelarge', 'Sharplarge', 'Bronzelarge', 'Serpentslarge', 'Discharginglarge', 'Frigidlarge', 'Wildfirelarge', 'Maliciouslarge', 'Effervescentlarge'
          //  'Conduitlarge', 'Numbinglarge', 'Infernolarge', 'Infectiouslarge', 'Scintillatinglarge'
        ],
        suffixes: [
          'Oflifelarge', 'Ofvitalarge', 'Ofstrengthlarge', 'Ofstrength2large', 'Ofdexteritylarge', 'Ofdexterity2large',
          'Ofinertialarge', 'Ofgreedlarge', 'Ofbalancelarge', 'Ofsustenancelarge'
        ]
      },
      'grand-charm': {
        prefixes: [
          'Stoutgrand', 'Stout2grand', 'Burlygrand', 'Stalwartgrand',
          'Redgrand', 'Jaggedgrand', 'Bronzegrand', 'Sharpgrand', 'Fletchersgrand', 'Acrobatsgrand', 'Harpoonistsgrand', 'Burninggrand', 'Sparkinggrand', 'Chillinggrand', 'Hexinggrand', 'Fungalgrand', 'Graverobbersgrand', 'Lionbrandedgrand', 'Captainsgrand', 'Preserversgrand', 'Expertsgrand', 'Fanaticgrand', 'Soundinggrand', 'Trainersgrand', 'Spiritualgrand', 'Naturesgrand', 'Entrappinggrand', 'Mentalistsgrand', 'Shogukushasgrand'
        ],
        suffixes: [
          'Oflifegrand', 'Ofvitagrand', 'Ofstrengthgrand', 'Ofdexteritygrand',
          'Ofinertiagrand', 'Ofbalancegrand'
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
          // VALIDATION: Prevent duplicating unique charms via right-click drag
          const charmDataStr = this.draggedCharm.charmData;
          if (charmDataStr) {
            const uniqueCharmNames = {
              'Annihilus': true,
              'Hellfire Torch': true,
              "Gheed's Fortune": true
            };

            let charmName = '';
            try {
              const jsonData = JSON.parse(charmDataStr);
              charmName = jsonData.name;
            } catch (e) {
              // Text format - get first line as name
              charmName = charmDataStr.split('\n')[0];
            }

            // Check if this is a unique charm being dragged
            if (charmName && uniqueCharmNames[charmName.trim()]) {
              // Check if it already exists in inventory
              const allCharmElements = container.querySelectorAll('[data-charm-data]');
              let countExisting = 0;
              for (const element of allCharmElements) {
                const elementDataStr = element.dataset.charmData;
                let elementName = '';
                try {
                  const jsonData = JSON.parse(elementDataStr);
                  elementName = jsonData.name;
                } catch (e) {
                  elementName = elementDataStr.split('\n')[0];
                }
                if (elementName && elementName.trim() === charmName.trim()) {
                  countExisting++;
                }
              }

              // If already exists (countExisting >= 1 means it already exists once), prevent duplication
              if (countExisting >= 1) {
                alert(`${charmName} is already in inventory! Max 1 per charm.`);
                this.draggedCharm = null;
                return;
              }
            }
          }

          this.placeCharm(targetPosition, this.draggedCharm.charmType, this.draggedCharm.backgroundImage, this.draggedCharm.charmData);

        } else {

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
  placeCharm(position, charmType, backgroundImage, charmData, hoverText = null, silent = false) {
    const container = document.querySelector('.inventorycontainer');
    const mainSlot = container.children[position];

    // Use provided hoverText, or extract from charm data
    let displayText = hoverText || '';
    if (!displayText) {
      try {
        const data = JSON.parse(charmData);
        displayText = data.name || '';
      } catch (e) {
        // If it's old format or plain text, just use the name part
        displayText = charmData;
      }
    }

    // Calculate position
    const row = Math.floor(position / 10);
    const col = position % 10;
    const height = charmType === 'grand-charm' ? 3 : charmType === 'large-charm' ? 2 : 1;

    if (height === 1) {
      // Small charm - normal grid behavior
      mainSlot.style.backgroundImage = backgroundImage;
      mainSlot.classList.add(charmType);
      mainSlot.dataset.charmData = charmData;
      // Don't set title - we use custom tooltip via showTooltip() instead
      // Remove any hover attributes
      mainSlot.removeAttribute('title');
      mainSlot.removeAttribute('data-title');
      mainSlot.removeAttribute('data-tooltip');
      mainSlot.removeAttribute('alt');
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
      // Don't set title - we use custom tooltip via showTooltip() instead
      // Remove any hover attributes
      charmOverlay.removeAttribute('title');
      charmOverlay.removeAttribute('data-title');
      charmOverlay.removeAttribute('data-tooltip');
      charmOverlay.removeAttribute('alt');

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

    // Trigger charm change recalculation (skip if silent mode during bulk restore)
    if (!silent && typeof window.onCharmChange === 'function') {
      window.onCharmChange();
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


  // Restore a charm from saved data
  restoreCharm(charmData) {
    if (!charmData || !charmData.type || charmData.position === undefined) {
      console.error('Invalid charm data:', charmData);
      return;
    }

    // Use saved image path if available, otherwise generate random
    let imagePath;
    try {
      const data = typeof charmData.data === 'string' ? JSON.parse(charmData.data) : charmData.data;
      imagePath = data.imagePath;
    } catch (e) {
      // If we can't extract saved image, use random
    }

    // Fall back to random image if no saved path
    if (!imagePath) {
      const images = this.charmImages[charmData.type];
      if (!images) {
        console.error('Unknown charm type:', charmData.type);
        return;
      }
      imagePath = images[Math.floor(Math.random() * images.length)];
    }

    const backgroundImage = `url('${imagePath}')`;

    // Check if we can place the charm at this position
    if (!this.canPlaceCharm(charmData.position, charmData.type)) {
      console.warn(`Cannot place ${charmData.type} at position ${charmData.position} - space occupied or invalid`);
      return;
    }

    // Place the charm at the saved position with saved data
    this.placeCharm(
      charmData.position,
      charmData.type,
      backgroundImage,
      JSON.stringify(charmData.data)
    );
  }

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

    // Recalculate stats after removing ANY charm
    if (window.statsCalculator?.updateAll) {
      setTimeout(() => window.statsCalculator.updateAll(), 50);
    }
    if (window.characterStats?.updateTotalStats) {
      setTimeout(() => window.characterStats.updateTotalStats(), 100);
    }
    // Trigger charm change which handles stat recalculation
    if (typeof window.onCharmChange === 'function') {
      setTimeout(() => window.onCharmChange(), 150);
    }
    // CRITICAL: Update everything (stats + display) after charm removal
    // Delay needs to be longer than onCharmChange to ensure DOM is updated
    if (window.unifiedSocketSystem?.updateAll) {
      setTimeout(() => window.unifiedSocketSystem.updateAll(), 250);
    }
  }


  // Update the drag detection in mousedown event:
  // Replace the mousedown event with this:

  // Replace the generateRandomCharmName method with this:


  // Generate stats based on affix type



  showTooltip(e, charmData) {
    this.hideTooltip();

    // Extract clean display text from JSON charm data
    let displayText = '';
    try {
      const data = JSON.parse(charmData);
      displayText = data.name || '';
      // Add stats if available - each on a new line
      if (data.stats && Array.isArray(data.stats) && data.stats.length > 0) {
        displayText += '\n' + data.stats.join('\n');
      }
    } catch (err) {
      // If not JSON, just show as-is
      displayText = charmData;
    }

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
    tooltip.textContent = displayText;

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
      this.selectedUniqueCharm = null;

      // Show selection view, hide customization view
      document.getElementById('charmSelectionView').style.display = 'block';
      document.getElementById('charmCustomizationView').style.display = 'none';
      document.getElementById('backCharmBtn').style.display = 'none';

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

      // Re-check unique charm availability
      this.checkUniqueCharmAvailability();

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

  /**
   * Fix titles on all existing charms in the DOM
   * Ensures charms placed before the fix have proper hover text
   */
  fixCharmTitles() {
    const container = document.querySelector('.inventorycontainer');
    if (!container) return;

    // Fix small charms in regular slots
    container.querySelectorAll('.charm1[data-charm-data]').forEach(slot => {
      // Remove all tooltip attributes since we use custom tooltip via showTooltip()
      slot.removeAttribute('title');
      slot.removeAttribute('data-title');
      slot.removeAttribute('data-tooltip');
      slot.removeAttribute('alt');
    });

    // Fix large/grand charms in overlay elements
    container.querySelectorAll('.charm-overlay[data-charm-data]').forEach(overlay => {
      // Remove all tooltip attributes since we use custom tooltip via showTooltip()
      overlay.removeAttribute('title');
      overlay.removeAttribute('data-title');
      overlay.removeAttribute('data-tooltip');
      overlay.removeAttribute('alt');
    });
  }

  /**
   * Get all charms currently in inventory as a serializable array
   * Scans the DOM for all placed charms
   */
  getAllCharms() {
    const charms = [];
    const container = document.querySelector('.inventorycontainer');
    if (!container) {
      console.warn('getAllCharms: No charm container found');
      return charms;
    }

    // Get small charms from regular slots
    const smallCharmSlots = container.querySelectorAll('.charm1:not([data-has-overlay])');

    smallCharmSlots.forEach((slot, i) => {
      if (slot.dataset.charmData && slot.style.backgroundImage) {
        try {
          // Parse JSON format (all charms are now JSON)
          const charmData = JSON.parse(slot.dataset.charmData);
          const position = parseInt(slot.dataset.index);

          let type = 'small-charm';
          if (slot.classList.contains('large-charm')) type = 'large-charm';
          if (slot.classList.contains('grand-charm')) type = 'grand-charm';

          charms.push({ type, position, data: charmData, imagePath: charmData.imagePath });
        } catch (e) {
          console.error('Failed to parse charm in slot', slot.dataset.index, e);
        }
      }
    });

    // Get large/grand charms from overlay elements
    const overlays = container.querySelectorAll('.charm-overlay');

    overlays.forEach((overlay, i) => {
      try {
        // Parse JSON format (all charms are now JSON)
        const charmData = JSON.parse(overlay.dataset.charmData);
        const position = parseInt(overlay.dataset.position);

        let type = 'large-charm';
        if (overlay.classList.contains('grand-charm')) type = 'grand-charm';

        charms.push({ type, position, data: charmData, imagePath: charmData.imagePath });
      } catch (e) {
        console.error('Failed to parse charm in overlay', overlay.dataset.position, e);
      }
    });

    return charms;
  }

  /**
   * Restore all charms from an array (the inverse of getAllCharms)
   * Clears existing charms and places the provided ones
   */
  restoreAllCharms(charmsArray) {
    if (!Array.isArray(charmsArray)) {
      console.error('Invalid charms array:', charmsArray);
      return;
    }

    // Clear existing charms first
    this.clearInventory();
    this.occupiedSlots.clear();

    // Place each charm
    charmsArray.forEach((charm, idx) => {
      if (!charm || !charm.type || charm.position === undefined) {
        console.error(`Invalid charm at index ${idx}:`, charm);
        return;
      }

      try {
        // Convert charm.data to string if it's an object
        let charmDataStr;
        if (typeof charm.data === 'string') {
          charmDataStr = charm.data;
        } else if (typeof charm.data === 'object') {
          charmDataStr = JSON.stringify(charm.data);
        } else {
          console.error(`Invalid charm data format at index ${idx}`);
          return;
        }

        // Parse to get imagePath and displayText
        const charmData = JSON.parse(charmDataStr);
        const imagePath = charmData.imagePath || charm.imagePath;
        const displayText = charmData.displayText;

        // Fall back to random image if no saved path
        let finalImagePath = imagePath;
        if (!finalImagePath) {
          const images = this.charmImages[charm.type];
          if (!images) {
            console.error(`Unknown charm type: ${charm.type}`);
            return;
          }
          finalImagePath = images[Math.floor(Math.random() * images.length)];
        }

        const backgroundImage = `url('${finalImagePath}')`;

        // Check if we can place it
        if (!this.canPlaceCharm(charm.position, charm.type)) {
          console.warn(`Cannot place ${charm.type} at position ${charm.position}`);
          return;
        }

        // Place the charm
        this.placeCharm(
          charm.position,
          charm.type,
          backgroundImage,
          charmDataStr,
          displayText,
          true // SILENT = true to prevent O(N^2) timeouts during restoration
        );

        // Store the imagePath for later restoration
        const container = document.querySelector('.inventorycontainer');
        if (container) {
          const mainSlot = container.children[charm.position];
          if (mainSlot) mainSlot.dataset.imagePath = finalImagePath;

          const overlay = container.querySelector(`.charm-overlay[data-position="${charm.position}"]`);
          if (overlay) overlay.dataset.imagePath = finalImagePath;
        }
      } catch (e) {
        console.error(`Failed to restore charm at index ${idx}:`, e);
      }
    });

    // Fix titles on all restored charms
    setTimeout(() => this.fixCharmTitles(), 50);

    // CRITICAL: Trigger a SINGLE recalculation after all charms are in place
    if (typeof window.onCharmChange === 'function') {
      window.onCharmChange();
    }
  }

  clearInventory() {
    const container = document.querySelector('.inventorycontainer');
    if (!container) return;

    this.occupiedSlots.clear();
    this.charmElements.clear();

    // First pass: clear all existing charm slots
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
      // Clear the hasOverlay flag so canPlaceCharm doesn't think there's an overlay
      delete slot.dataset.hasOverlay;
      slot.removeAttribute('data-has-overlay');
    });

    // Second pass: remove ALL overlay elements (both direct and nested)
    const overlays = container.querySelectorAll('.charm-overlay');
    overlays.forEach(overlay => {
      overlay.remove();
    });

    // Log what we've cleared
    const childCount = container.children.length;
    const overlayCount = container.querySelectorAll('.charm-overlay').length;

  }
}





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

// === FIXED CHARM STATS - NO DOUBLE ADDING ===
// Paste this at the very end of inventory.js

// === SUPER SIMPLE CHARM STATS - MANUAL TRIGGER ONLY ===
// Paste this at the very end of inventory.js

// === PROPER CHARM SYSTEM - FRESH CALCULATION ===
// Paste this at the very end of inventory.js

// === SMART CHARM SYSTEM - PRESERVES SOCKET BONUSES ===
// Paste this at the very end of inventory.js

let charmSystem = {
  baseValues: {}, // Store equipment + socket values (without charm bonuses)
  currentCharmBonuses: {}, // Track current charm bonuses
  initialized: false
};

function getCharmBonuses() {
  const bonuses = {};
  const charms = document.querySelectorAll('[data-charm-data]');

  charms.forEach(charm => {
    const data = charm.dataset.charmData;
    // Skip if no data or empty/whitespace only
    if (!data || !data.trim()) return;

    // Parse charm data - handle both JSON and plain text formats
    let linesToParse = [];
    try {
      const jsonData = JSON.parse(data);
      // If JSON, use displayText field which contains the parsed stat strings
      linesToParse = jsonData.displayText ? jsonData.displayText.split('\n') : [];
    } catch (e) {
      // If not JSON, treat as plain text (legacy format)
      linesToParse = data.split('\n');
    }

    linesToParse.forEach(line => {
      let match;

      // Defense
      if (match = line.match(/\+(\d+)\s+Defense/i)) {
        bonuses.defense = (bonuses.defense || 0) + parseInt(match[1]);
      }


      if (match = line.match(/(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i)) {
        bonuses.magicFind = (bonuses.magicFind || 0) + parseInt(match[1]);
      }

      if (match = line.match(/(\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i)) {
        bonuses.goldFind = (bonuses.goldFind || 0) + parseInt(match[1]);
      }

      if (match = line.match(/(\d+)%\s+Faster\s+Run\/Walk/i)) {
        bonuses.frw = (bonuses.frw || 0) + parseInt(match[1]);
      }

      if (match = line.match(/(\d+)%\s+Faster\s+Hit\s+Recovery/i)) {
        bonuses.fhr = (bonuses.fhr || 0) + parseInt(match[1]);
      }

      if (match = line.match(/Adds\s+(\d+)(?:-(\d+))?\s+Lightning\s+Damage/i)) {
        bonuses.lightDmgMin = (bonuses.lightDmgMin || 0) + parseInt(match[1]);
        bonuses.lightDmgMax = (bonuses.lightDmgMax || 0) + (match[2] ? parseInt(match[2]) : parseInt(match[1]));
      }
      if (match = line.match(/Adds\s+(\d+)(?:-(\d+))?\s+Cold\s+Damage/i)) {
        bonuses.coldDmgMin = (bonuses.coldDmgMin || 0) + parseInt(match[1]);
        bonuses.coldDmgMax = (bonuses.coldDmgMax || 0) + (match[2] ? parseInt(match[2]) : parseInt(match[1]));
      }

      if (match = line.match(/Adds\s+(\d+)(?:-(\d+))?\s+Fire\s+Damage/i)) {
        bonuses.fireDmgMin = (bonuses.fireDmgMin || 0) + parseInt(match[1]);
        bonuses.fireDmgMax = (bonuses.fireDmgMax || 0) + (match[2] ? parseInt(match[2]) : parseInt(match[1]));
      }

      if (match = line.match(/Adds\s+(\d+)(?:-(\d+))?\s+Poison\s+Damage/i)) {
        bonuses.poisonDmgMin = (bonuses.poisonDmgMin || 0) + parseInt(match[1]);
        bonuses.poisonDmgMax = (bonuses.poisonDmgMax || 0) + (match[2] ? parseInt(match[2]) : parseInt(match[1]));
      }

      // FIXED: Add \+ to match the plus sign in charm text
      if (match = line.match(/\+?(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i)) {
        bonuses.poisonSkillDmg = (bonuses.poisonSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = line.match(/\+?(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i)) {
        bonuses.coldSkillDmg = (bonuses.coldSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = line.match(/\+?(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i)) {
        bonuses.fireSkillDmg = (bonuses.fireSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = line.match(/\+?(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i)) {
        bonuses.lightningSkillDmg = (bonuses.lightningSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = line.match(/\+?(\d+)%\s+to\s+Magic\s+Skill\s+Damage/i)) {
        bonuses.magicSkillDmg = (bonuses.magicSkillDmg || 0) + parseInt(match[1]);
      }
      // Cold Resist
      if (match = line.match(/Cold\s+Resist\s+(?:\+)?(\d+)%?/i)) {
        bonuses.coldResist = (bonuses.coldResist || 0) + parseInt(match[1]);
      }

      // Fire Resist
      if (match = line.match(/Fire\s+Resist\s+(?:\+)?(\d+)%?/i)) {
        bonuses.fireResist = (bonuses.fireResist || 0) + parseInt(match[1]);
      }

      // Lightning Resist
      if (match = line.match(/Lightning\s+Resist\s+\+(\d+)%/i)) {
        bonuses.lightResist = (bonuses.lightResist || 0) + parseInt(match[1]);
      }

      // Poison Resist
      if (match = line.match(/Poison\s+Resist\s+\+(\d+)%/i)) {
        bonuses.poisonResist = (bonuses.poisonResist || 0) + parseInt(match[1]);
      }

      // All Resistances
      if (match = line.match(/All\s+Resistances\s+\+(\d+)/i)) {
        const val = parseInt(match[1]);
        bonuses.coldResist = (bonuses.coldResist || 0) + val;
        bonuses.fireResist = (bonuses.fireResist || 0) + val;
        bonuses.lightResist = (bonuses.lightResist || 0) + val;
        bonuses.poisonResist = (bonuses.poisonResist || 0) + val;
      }

      // All Skills (for unique charms like Annihilus)
      if (match = line.match(/\+(\d+)\s+to\s+All\s+Skills/i)) {
        bonuses.allSkills = (bonuses.allSkills || 0) + parseInt(match[1]);
      }

      // Tree-specific Skills (e.g., "+1 to Javelin and Spear Skills (Amazon Only)")
      // Handles both "Skills" and "Spells" as used in D2
      if (match = line.match(/\+(\d+)\s+to\s+([\w\s&]+?)(?:\s+Skills|\s+Spells)?\s+\((Amazon|Sorceress|Necromancer|Druid|Paladin|Barbarian|Assassin)\s+Only\)/i)) {
        const bonus = parseInt(match[1]);
        const treeName = match[2].trim();
        const charmClass = match[3];
        const currentClass = document.getElementById('selectClass')?.value || 'Amazon';

        if (charmClass === currentClass) {
          // Comprehensive mapping of tree names (partial match)
          const treeMapping = {
            // Amazon
            'Javelin and Spear': 'javelinandspearskillscontainer',
            'Passive and Magic': 'passiveskillscontainer',
            'Bow and Crossbow': 'bowandcrossbowskillscontainer',
            // Sorceress
            'Fire': 'firespellscontainer',
            'Lightning': 'lightningspellscontainer',
            'Cold': 'coldspellscontainer',
            // Necromancer
            'Summoning': 'summoningspellsneccontainer',
            'Poison and Bone': 'poisonandbonespellscontainer',
            'Curses': 'cursescontainer',
            // Paladin
            'Combat': 'combatskillspalcontainer',
            'Offensive Auras': 'offensiveaurascontainer',
            'Defensive Auras': 'defensiveaurascontainer',
            // Barbarian
            'Combat': 'combatskillsbarcontainer', // D2 Barb Combat Skills -> combatskillsbarcontainer
            'Combat Masteries': 'combatmasteriescontainer',
            'Warcries': 'warcriescontainer',
            // Druid
            'Elemental': 'elementalskillscontainer',
            'Shape Shifting': 'shapeshiftingskillscontainer',
            'Shapeshifting': 'shapeshiftingskillscontainer',
            'Summoning': 'summoningskillscontainer',
            // Assassin
            'Martial Arts': 'martialartscontainer',
            'Shadow Disciplines': 'shadowdisciplinescontainer',
            'Traps': 'trapscontainer'
          };

          // Special case for Barbarian Combat vs Paladin Combat
          let containerId = treeMapping[treeName];
          if (treeName === 'Combat') {
            containerId = (charmClass === 'Paladin') ? 'combatskillspalcontainer' : 'combatskillsbarcontainer';
          } else if (treeName === 'Summoning') {
            containerId = (charmClass === 'Necromancer') ? 'summoningspellsneccontainer' : 'summoningskillscontainer';
          }

          if (containerId) {
            bonuses.treeSkills = bonuses.treeSkills || {};
            bonuses.treeSkills[containerId] = (bonuses.treeSkills[containerId] || 0) + bonus;
          }
        }
      }

      // Class-specific Skills (for Hellfire Torch: "+2 to Amazon Skills", "+2 to Sorceress Skills", etc.)
      // CRITICAL: Only count if the charm's class matches the current character class
      if (match = line.match(/\+(\d+)\s+to\s+(Amazon|Sorceress|Necromancer|Druid|Paladin|Barbarian|Assassin)\s+Skills/i)) {
        const charmClass = match[2];
        const currentClass = document.getElementById('selectClass')?.value || 'Amazon';
        // Only add the bonus if the charm's class matches the current character class
        if (charmClass === currentClass) {
          bonuses.classSkills = (bonuses.classSkills || 0) + parseInt(match[1]);
        }
      }

      // Life
      if (match = line.match(/\+(\d+)\s+to\s+Life/i)) {
        bonuses.life = (bonuses.life || 0) + parseInt(match[1]);
      }

      // Mana
      if (match = line.match(/\+(\d+)\s+to\s+Mana/i)) {
        bonuses.mana = (bonuses.mana || 0) + parseInt(match[1]);
      }

      // Strength - FIXED: use 'str' key to match character.js
      if (match = line.match(/\+(\d+)\s+to\s+Strength/i)) {
        bonuses.str = (bonuses.str || 0) + parseInt(match[1]);
      }

      // Dexterity - FIXED: use 'dex' key to match character.js
      if (match = line.match(/\+(\d+)\s+to\s+Dexterity/i)) {
        bonuses.dex = (bonuses.dex || 0) + parseInt(match[1]);
      }

      // Vitality - ADD: missing from your current code
      if (match = line.match(/\+(\d+)\s+to\s+Vitality/i)) {
        bonuses.vit = (bonuses.vit || 0) + parseInt(match[1]);
      }

      // Energy - ADD: missing from your current code
      if (match = line.match(/\+(\d+)\s+to\s+Energy/i)) {
        bonuses.enr = (bonuses.enr || 0) + parseInt(match[1]);
      }

      // Attack Rating
      if (match = line.match(/\+(\d+)\s+to\s+Attack\s+Rating/i)) {
        bonuses.attackrating = (bonuses.attackrating || 0) + parseInt(match[1]);
      }
    });
  });

  return bonuses;
}

function captureCurrentBaseValues() {
  const containers = {
    defense: 'defensecontainer',
    coldResist: 'coldresistcontainer',
    fireResist: 'fireresistcontainer',
    lightResist: 'lightresistcontainer', //instead of lightningresist
    poisonResist: 'poisonresistcontainer',
    life: 'lifecontainer',
    mana: 'manacontainer',
    str: 'str',
    dex: 'dex',
    attackrating: 'attackratingcontainer',
    allResistances: ['coldresistcontainer', 'fireresistcontainer', 'lightresistcontainer', 'poisonresistcontainer'], // Assuming all resistances are shown in their respective containers
    magicFind: 'magicfindcontainer',
    goldFind: 'goldfindcontainer',
    frw: 'frwcontainer',
    fhr: 'fhrcontainer',
    lightDmgMin: 'flatlightmincontainer',
    lightDmgMax: 'flatlightmaxcontainer',
    coldDmgMin: 'flatcoldmincontainer',
    coldDmgMax: 'flatcoldmaxcontainer',
    fireDmgMin: 'flatfiremincontainer',
    fireDmgMax: 'flatfiremaxcontainer',
    poisonDmgMin: 'flatpoisonmincontainer',
    poisonDmgMax: 'flatpoisonmaxcontainer',
    magicDmgMin: 'flatmagicmincontainer',
    magicDmgMax: 'flatmagicmaxcontainer'
  };



  Object.keys(containers).forEach(stat => {
    const containerId = containers[stat];
    const container = document.getElementById(containerId);

    if (container) {
      const currentDisplayValue = parseInt(container.textContent) || 0;
      const currentCharmBonus = charmSystem.currentCharmBonuses[stat] || 0;

      // Base value = current display - current charm bonuses
      const baseValue = currentDisplayValue - currentCharmBonus;
      charmSystem.baseValues[stat] = baseValue;


    }
  });

  // SPECIAL: Handle skill damage stats separately
  const equipmentSkillBonuses = getEquipmentSkillDamageBonuses();

  // For skill damage, base = equipment bonuses (not current display)
  charmSystem.baseValues.poisonSkillDmg = equipmentSkillBonuses.poisonSkillDmg || 0;
  charmSystem.baseValues.coldSkillDmg = equipmentSkillBonuses.coldSkillDmg || 0;
  charmSystem.baseValues.fireSkillDmg = equipmentSkillBonuses.fireSkillDmg || 0;
  charmSystem.baseValues.lightningSkillDmg = equipmentSkillBonuses.lightningSkillDmg || 0;
  charmSystem.baseValues.magicSkillDmg = equipmentSkillBonuses.magicSkillDmg || 0;

  charmSystem.initialized = true;
}

function updateCharmDisplay() {
  if (!charmSystem.initialized) {

    return;
  }

  const newCharmBonuses = getCharmBonuses();
  const containers = {
    defense: 'defensecontainer',
    coldResist: 'coldresistcontainer',
    fireResist: 'fireresistcontainer',
    lightResist: 'lightresistcontainer',
    poisonResist: 'poisonresistcontainer',
    // life: 'lifecontainer',
    // mana: 'manacontainer',
    str: 'str',
    dex: 'dex',
    attackrating: 'attackratingcontainer',
    allResistances: ['coldresistcontainer', 'fireresistcontainer', 'lightresistcontainer', 'poisonresistcontainer'], // Assuming all resistances are shown in their respective containers
    magicFind: 'magicfindcontainer',
    goldFind: 'goldfindcontainer',
    frw: 'frwcontainer',
    fhr: 'fhrcontainer',
    lightDmgMin: 'flatlightmincontainer',
    lightDmgMax: 'flatlightmaxcontainer',
    coldDmgMin: 'flatcoldmincontainer',
    coldDmgMax: 'flatcoldmaxcontainer',
    fireDmgMin: 'flatfiremincontainer',
    fireDmgMax: 'flatfiremaxcontainer',
    poisonDmgMin: 'flatpoisonmincontainer',
    poisonDmgMax: 'flatpoisonmaxcontainer',
    magicDmgMin: 'flatmagicmincontainer',
    magicDmgMax: 'flatmagicmaxcontainer',
    poisonSkillDmg: 'poisonskilldmgcontainer',
    coldSkillDmg: 'coldskilldmgcontainer',
    fireSkillDmg: 'fireskilldmgcontainer',
    lightningSkillDmg: 'lightningskilldmgcontainer',
    magicSkillDmg: 'magicskilldmgcontainer'
  };



  Object.keys(containers).forEach(stat => {
    const containerId = containers[stat];
    const container = document.getElementById(containerId);

    if (container) {
      const baseValue = charmSystem.baseValues[stat] || 0;
      const newCharmBonus = newCharmBonuses[stat] || 0;
      const totalValue = baseValue + newCharmBonus;

      container.textContent = totalValue;

      if (newCharmBonus > 0) {
        container.style.color = '#d0d007ff'; // Green when has charm bonus

      } else {
        container.style.color = ''; // Normal when no charm bonus
      }
    }
  });

  // Update tracked charm bonuses
  charmSystem.currentCharmBonuses = { ...newCharmBonuses };
}





function getEquipmentSkillDamageBonuses() {
  const bonuses = {};
  const equipmentSections = [
    { dropdown: 'weapons-dropdown', section: 'weapon' },
    { dropdown: 'helms-dropdown', section: 'helm' },
    { dropdown: 'armors-dropdown', section: 'armor' },
    { dropdown: 'offs-dropdown', section: 'shield' },
    { dropdown: 'gloves-dropdown', section: 'gloves' },
    { dropdown: 'belts-dropdown', section: 'belts' },
    { dropdown: 'boots-dropdown', section: 'boots' },
    { dropdown: 'ringsone-dropdown', section: 'ringone' },
    { dropdown: 'ringstwo-dropdown', section: 'ringtwo' },
    { dropdown: 'amulets-dropdown', section: 'amulet' }
  ];

  equipmentSections.forEach(({ dropdown, section }) => {
    const dropdownElement = document.getElementById(dropdown);
    if (!dropdownElement || !dropdownElement.value) return;

    // CRITICAL FIX: Check dropdown-specific cache first to get user-modified values
    // This ensures poisondamage.current (and other variable stats) are read correctly
    const cacheKey = `${dropdown}_${dropdownElement.value}`;
    let item = window.dropdownItemCache && window.dropdownItemCache[cacheKey];

    // Fallback to itemList if not in cache
    if (!item) {
      const itemData = window.itemList || itemList;
      item = itemData?.[dropdownElement.value];
    }
    if (!item) return;

    // CRITICAL: Check if character meets item requirements
    // Don't count bonuses from items the character can't use!
    const socketSystem = window.unifiedSocketSystem;
    if (socketSystem) {
      // Get actual level requirement (considering -lvl req from items)
      const baseReqLvl = item.reqlvl || item.properties?.reqlvl || 0;
      const levelReqReduction = socketSystem.stats?.levelReqReduction || 0;
      const actualLevel = Math.max(1, baseReqLvl - levelReqReduction);

      // Check level requirement
      const currentLevel = socketSystem.currentLevel || 1;
      if (currentLevel < actualLevel) return;

      // Check stat requirements (str, dex)
      const meetsStatRequirements = socketSystem.doesCharacterMeetStatRequirements?.(dropdownElement.value);
      if (meetsStatRequirements === false) return;
    }


    // Check equipment description for skill damage bonuses
    if (item.description) {
      const desc = item.description;

      let match;
      if (match = desc.match(/(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i)) {
        bonuses.poisonSkillDmg = (bonuses.poisonSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = desc.match(/(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i)) {
        bonuses.coldSkillDmg = (bonuses.coldSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = desc.match(/(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i)) {
        bonuses.fireSkillDmg = (bonuses.fireSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = desc.match(/(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i)) {
        bonuses.lightningSkillDmg = (bonuses.lightningSkillDmg || 0) + parseInt(match[1]);
      }
      if (match = desc.match(/(\d+)%\s+to\s+Magic\s+Skill\s+Damage/i)) {
        bonuses.magicSkillDmg = (bonuses.magicSkillDmg || 0) + parseInt(match[1]);
      }
    }

    // Also check properties - BUT ONLY for dynamic items (items without description)
    // Static items already have skill damage in their description, so checking properties would double-count
    // CRITICAL FIX: Property names in items are lowercase (poisondamage, firedamage, etc.)
    // not camelCase (poisonSkillDmg), so we need to check both


    //     Perfect! The skill damage reset bug is completely fixed! 🎉

    // Summary
    // The bug was caused by a property name mismatch in 
    // getEquipmentSkillDamageBonuses()
    //  which was looking for camelCase names (poisonSkillDmg) instead of the actual lowercase names (
    // poisondamage
    // ) used in items.

    // The complete solution involved three fixes:

    // Corrected property names - Changed from camelCase to lowercase to match actual item properties
    // Prevented double-counting - Only check properties for dynamic items (not static items with descriptions)
    // Added requirement checks - Only count skill damage when character meets item requirements

    if (item.properties && !item.description) {
      const getPropValue = (prop) => {
        if (typeof prop === 'object' && prop !== null) {
          return prop.current !== undefined ? prop.current : (prop.max !== undefined ? prop.max : 0);
        }
        return prop || 0;
      };

      bonuses.poisonSkillDmg = (bonuses.poisonSkillDmg || 0) + getPropValue(item.properties.poisondamage);
      bonuses.coldSkillDmg = (bonuses.coldSkillDmg || 0) + getPropValue(item.properties.colddamage);
      bonuses.fireSkillDmg = (bonuses.fireSkillDmg || 0) + getPropValue(item.properties.firedamage);
      bonuses.lightningSkillDmg = (bonuses.lightningSkillDmg || 0) + getPropValue(item.properties.lightdamage);
      bonuses.magicSkillDmg = (bonuses.magicSkillDmg || 0) + getPropValue(item.properties.magicdamage);
    }
  });

  // Add socket bonuses
  const socketSections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];

  socketSections.forEach(section => {
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);

    sockets.forEach(socket => {
      const stats = socket.dataset.stats;
      if (stats) {
        let match;
        if (match = stats.match(/(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i)) {
          bonuses.poisonSkillDmg = (bonuses.poisonSkillDmg || 0) + parseInt(match[1]);
        }
        if (match = stats.match(/(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i)) {
          bonuses.coldSkillDmg = (bonuses.coldSkillDmg || 0) + parseInt(match[1]);
        }
        if (match = stats.match(/(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i)) {
          bonuses.fireSkillDmg = (bonuses.fireSkillDmg || 0) + parseInt(match[1]);
        }
        if (match = stats.match(/(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i)) {
          bonuses.lightningSkillDmg = (bonuses.lightningSkillDmg || 0) + parseInt(match[1]);
        }
        if (match = stats.match(/(\d+)%\s+to\s+Magic\s+Skill\s+Damage/i)) {
          bonuses.magicSkillDmg = (bonuses.magicSkillDmg || 0) + parseInt(match[1]);
        }
      }
    });
  });

  return bonuses;
}






// Call this when equipment OR sockets change (recaptures base including socket bonuses)
function onEquipmentOrSocketChange() {


  // First, reset charm bonuses to 0 so we capture clean base
  charmSystem.currentCharmBonuses = {};

  // Give other systems a moment to update containers
  setTimeout(() => {
    captureCurrentBaseValues();
    updateCharmDisplay();
  }, 100);
}

// Call this when ONLY charms are added/removed
function onCharmChange() {
  // Trigger a full recalculation when charms change
  // Call methods directly to bypass isInitializing check
  if (window.unifiedSocketSystem) {
    window.unifiedSocketSystem.calculateAllStats();
    window.unifiedSocketSystem.updateStatsDisplay();
  }
}

//   captureCurrentBaseValues();
// updateCharmDisplay();
// }

// Recapture base values to account for the charm change


// Call this to do initial setup (captures whatever is currently displayed as base)
function initializeCharmSystem() {


  // Start fresh - assume current containers have no charm bonuses
  charmSystem.currentCharmBonuses = {};
  captureCurrentBaseValues();
  updateCharmDisplay();
}

function enhanceStatInputResponsiveness() {
  ['str', 'dex', 'vit', 'enr'].forEach(statId => {
    const input = document.getElementById(statId);
    if (input) {
      // Add immediate update on input change
      input.addEventListener('input', () => {
        setTimeout(() => {
          if (window.characterManager) {
            window.characterManager.updateTotalStats();
          }
        }, 5);
      });
    }
  });
}

setTimeout(() => {
  enhanceStatInputResponsiveness();
}, 2100);

// Public functions
window.onEquipmentOrSocketChange = onEquipmentOrSocketChange;
window.onCharmChange = onCharmChange;
window.initializeCharmSystem = initializeCharmSystem;

// Initialize after other systems are ready
setTimeout(initializeCharmSystem, 500);
