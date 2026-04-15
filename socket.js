// ===================================================================
// ULTRA-LIGHTWEIGHT UNIFIED SOCKET SYSTEM v3.0
// Combines main-init.js, socket-system.js, and character.js
// Everything works from the start - no recursions needed!
// ===================================================================

class UnifiedSocketSystem {
  constructor() {
    this.isInitializing = true;
    this.currentLevel = 1;
    this.currentSocket = null;
    this.targetSocket = null;

    // Load static data from global module
    const data = window.UnifiedSocketData;
    this.openWoundsBaseDamage = data.openWoundsBaseDamage;
    this.classStats = data.classStats;
    this.equipmentMap = data.equipmentMap;
    this.baseTypeSocketLimits = data.baseTypeSocketLimits;
    this.socketData = data.socketData;
    this.jewelPrefixes = data.jewelPrefixes;
    this.jewelSuffixes = data.jewelSuffixes;

    // Fast stats tracking
    this.stats = {
      strength: 0, dexterity: 0, vitality: 0, energy: 0,
      allSkills: 0, classSkills: 0, magicFind: 0, goldFind: 0, defense: 0,
      ias: 0, fcr: 0, frw: 0, fhr: 0, plr: 0,
      fireResist: 0, coldResist: 0, lightResist: 0, poisonResist: 0, curseResist: 0,
      allResistances: 0, crushingBlow: 0, deadlyStrike: 0, maxDeadlyStrike: 0, openWounds: 0, openWoundsDamage: 0,
      life: 0, mana: 0, lifePercent: 0, manaPercent: 0, lifeSteal: 0, manaSteal: 0, dr: 0, pdr: 0, mdr: 0, cbf: false,
      dmgtomana: 0,
      regenMana: 0, regenLife: 0,
      toatt: 0, toattPercent: 0, targetDefense: 0, lightRadius: 0,
      toMinDmg: 0, toMaxDmg: 0,
      dmgtoundead: 0, dmgtodemon: 0,
      lightDmgMin: 0, lightDmgMax: 0, fireDmgMin: 0, fireDmgMax: 0,
      coldDmgMin: 0, coldDmgMax: 0, poisonDmgMin: 0, poisonDmgMax: 0, fireSkillDamage: 0,
      coldSkillDamage: 0,
      lightningSkillDamage: 0,
      poisonSkillDamage: 0,
      magicSkillDamage: 0,
      pierceFire: 0, pierceCold: 0, pierceLightning: 0,
      piercePoison: 0, piercePhysical: 0, pierceMagic: 0,
      levelUpProcs: [], deathProcs: []
    };

    this.mercenaryStats = {
      allSkills: 0, magicFind: 0, goldFind: 0, defense: 0,
      ias: 0, fcr: 0, frw: 0, fhr: 0,
      fireResist: 0, coldResist: 0, lightResist: 0, poisonResist: 0, curseResist: 0,
      dr: 0, pdr: 0, mdr: 0, plr: 0, cbf: false
    };

    this.init();
  }

  init() {
    try {
      if (window.SocketUI) {
        window.SocketUI.addStyles();
        window.SocketUI.createSocketModal(this);
      }
      this.initializeSocketContainers();
      this.setupEventListeners();
      this.setInitialCharacterStats();
      window.addSocket = (section) => this.addSocket(section);
      setTimeout(() => {
        this.isInitializing = false;
        this.updateAll();
      }, 100);
    } catch (error) {
      console.error("UnifiedSocketSystem init error:", error);
    }
  }

  setInitialCharacterStats() {
    const classDropdown = document.getElementById('selectClass');
    if (!classDropdown) return;
    
    // Check if stats are already set (not 0)
    const strVal = parseInt(document.getElementById('str')?.value) || 0;
    if (strVal > 0) return; // Stats already initialized, don't reset

    const currentClass = classDropdown.value || 'Amazon';
    const baseStats = this.classStats[currentClass];
    if (baseStats) {
      ['str', 'dex', 'vit', 'enr'].forEach(s => {
        const el = document.getElementById(s);
        if (el) el.value = baseStats[s];
      });
      const lvl = document.getElementById('lvlValue');
      if (lvl) lvl.value = 1;
      this.currentLevel = 1;
    }
  }

  // === SOCKET CONTAINER INITIALIZATION ===
  initializeSocketContainers() {
    // Only weapons, helms, armors, and shields can have sockets
    const sections = ['weapon', 'helm', 'armor', 'shield'];

    sections.forEach(section => {
      // Check if it already exists anywhere in the DOM for this section
      if (document.querySelector(`.socket-container[data-section="${section}"]`)) {
        return;
      }

      const infoId = this.getSectionInfoId(section);
      const infoDiv = document.getElementById(infoId);

      if (infoDiv) {
        const socketContainer = document.createElement('div');
        socketContainer.className = 'socket-container';
        socketContainer.dataset.section = section;
        socketContainer.innerHTML = `
            <div class="socket-grid sockets-0"></div>
            <button class="add-socket-btn" onclick="addSocket('${section}')">+</button>
          `;
        // Append as sibling after infoDiv
        infoDiv.parentNode.insertBefore(socketContainer, infoDiv.nextSibling);
      }
    });
  }

  // === EVENT LISTENERS ===
  setupEventListeners() {
    // Class change
    const classDropdown = document.getElementById('selectClass');
    if (classDropdown) {
      classDropdown.addEventListener('change', () => this.setInitialCharacterStats());
    }

    // Level change
    const levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', () => {
        this.currentLevel = parseInt(levelInput.value) || 1;
        this.updateAll();
      });
    }

    // Mercenary class change - recalculate when switching between mercenary types or "No Mercenary"
    const mercClassDropdown = document.getElementById('mercclass');
    if (mercClassDropdown) {
      mercClassDropdown.addEventListener('change', () => {
        this.updateAll(); // Recalculate all stats when mercenary class changes
      });
    }

    // Mercenary level change
    const mercLevelInput = document.getElementById('merclvlValue');
    if (mercLevelInput) {
      mercLevelInput.addEventListener('input', () => {
        this.updateAll(); // Recalculate when mercenary level changes
      });
    }

    // Equipment changes
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => {
          const section = this.equipmentMap[dropdownId].section;
          const oldItemName = dropdown.dataset.previousValue;
          const newItemName = dropdown.value;

          // Only save/restore if actually switching to a different item
          if (oldItemName === newItemName) {
            // Same item - just update display, don't save/restore
            this.calculateAllStats();
            this.updateStatsDisplay();
            // BUGFIX: Removed setTimeout updateAll - was causing skill damage to reset
            // setTimeout(() => this.updateAll(), 50);
            return;
          }

          // SAVE current item state BEFORE switching
          if (oldItemName && typeof window.saveItemState === 'function') {
            window.saveItemState(dropdownId, oldItemName, section);
          }

          // Store current value for next change
          dropdown.dataset.previousValue = newItemName;

          // Check if we should clear state due to requirements
          if (newItemName && typeof window.clearItemStateIfRequirementsNotMet === 'function') {
            const shouldClear = window.clearItemStateIfRequirementsNotMet(dropdownId, newItemName);
            if (shouldClear) {
              // Requirements not met - clear corruptions and sockets
              if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
                delete window.itemCorruptions[dropdownId];
              }
              const socketableSections = ['weapon', 'helm', 'armor', 'shield'];
              if (socketableSections.includes(section)) {
                this.adjustSocketsForItem(section);
              }
              this.calculateAllStats();
              this.updateStatsDisplay();
              // BUGFIX: Removed setTimeout updateAll - was causing skill damage to reset
              // setTimeout(() => this.updateAll(), 50);
              return;
            }
          }

          // RESTORE item state AFTER switching (or clear if no saved state)
          if (newItemName) {
            const stateKey = `${dropdownId}_${newItemName}`;
            const hasSavedState = window.itemStates && window.itemStates[stateKey];

            if (hasSavedState && typeof window.restoreItemState === 'function') {
              // Restore saved state
              window.restoreItemState(dropdownId, newItemName, section);
            } else {
              // No saved state - clear corruption and reset to default
              if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
                delete window.itemCorruptions[dropdownId];
              }

              // Reset ethereal button to default state
              const category = section;
              const etherealBtn = document.querySelector(`button[onclick*="makeEtherealItem('${category}')"]`);
              if (etherealBtn) {
                etherealBtn.classList.remove('active');
                etherealBtn.textContent = 'Make Ethereal';
              }

              // Adjust sockets for new item
              const socketableSections = ['weapon', 'helm', 'armor', 'shield'];
              if (socketableSections.includes(section)) {
                this.adjustSocketsForItem(section);
              }
            }
          }

          // Immediately recalculate stats when item changes
          this.calculateAllStats();
          this.updateStatsDisplay();
          // BUGFIX: Removed setTimeout updateAll - was causing skill damage to reset
          // setTimeout(() => this.updateAll(), 50);
        });
      }
    });

    // Socket clicks (delegated)
    // Socket slot clicks - THE KEY FEATURE YOU WANTED
    document.addEventListener('click', (e) => {
      // Check if we clicked a socket slot OR anything inside it (like the img)
      const socketSlot = e.target.closest('.socket-slot');

      if (socketSlot) {
        this.currentSocket = socketSlot; // Always get the socket container
        this.showSocketModal();          // Open modal to change/add item
      }
    });

    // Stat changes
    ['str', 'dex', 'vit', 'enr'].forEach(stat => {
      const input = document.getElementById(stat);
      if (input) {
        input.addEventListener('input', () => this.updateStatsDisplay());
      }
    });

    // Mode change (PvM/PvP)
    const modeDropdown = document.querySelector('.modedropdown');
    if (modeDropdown) {
      modeDropdown.addEventListener('change', () => {
        this.updateAll();
      });
    }
  }

  // === UI CLEARING ===
  clearAll() {
    // 1. Reset all equipment dropdowns to "None"
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.value = '';
        dropdown.dataset.previousValue = '';
        // If there's an active item icon in the UI, we might need to hide it
        // but usually the next steps handle the socket grids.
      }
    });

    // 2. Clear all socket slots
    const socketContainers = document.querySelectorAll('.socket-container');
    socketContainers.forEach(container => {
      const socketGrid = container.querySelector('.socket-grid');
      if (socketGrid) {
        socketGrid.innerHTML = '';
        socketGrid.className = 'socket-grid sockets-0';
      }
    });

    // 3. Reset ethereal buttons
    document.querySelectorAll('button[onclick*="makeEtherealItem"]').forEach(btn => {
      btn.classList.remove('active');
      btn.textContent = 'Make Ethereal';
    });

    // 4. Clear item corruptions (visual and data)
    window.itemCorruptions = {};
    document.querySelectorAll('.corruption-text').forEach(el => el.remove());

    // 5. Reset internal state
    this.calculateAllStats();
    this.updateStatsDisplay();
  }

  // === SOCKET MANAGEMENT ===

  // Get max sockets for current item in a section
  getMaxSocketsForSection(section) {
    // Get the dropdown for this section
    const dropdownId = this.getSectionDropdownId(section);
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown || !dropdown.value) {
      return 1; // Default to 1 socket if no item selected
    }

    const itemName = dropdown.value;
    // Use window.getItemData to support both regular and crafted items
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];

    if (!item) {
      return 1; // Default to 1 socket if item not found
    }

    // Check if item has custom maxSockets property
    if (item.properties && item.properties.maxSockets !== undefined) {
      return item.properties.maxSockets;
    }

    // Try to get base type from item.baseType or parse from description
    let baseType = item.baseType;

    if (!baseType && item.description) {
      // Parse base type from description (it's usually the second line)
      const lines = item.description.split('<br>');
      if (lines.length >= 2) {
        baseType = lines[1].trim();
      }
    }

    // Lookup socket limit by base type
    if (baseType) {
      let limit = this.baseTypeSocketLimits[baseType];
      if (limit !== undefined) {
        // For armor section, cap at 3 for unique/set items (even if base allows 4)
        // 3rd socket requires corruption
        if (section === 'armor' && limit > 3) {
          limit = 3;
        }
        return limit;
      }
    }

    // Default to 1 socket for any unspecified items
    return 1;
  }

  addSocket(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return;
    }

    // Prevent adding sockets to items with fixed socket count
    if (container.dataset.fixedSockets === 'true') {
      alert('This item has a fixed number of sockets and cannot be modified.');
      return;
    }

    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      return;
    }

    const existingSockets = socketGrid.children.length;
    const maxSockets = this.getMaxSocketsForSection(section);

    if (existingSockets >= maxSockets) {
      alert(`Maximum ${maxSockets} sockets allowed for this item`);
      return;
    }

    const newSocket = document.createElement('div');
    newSocket.className = 'socket-slot empty';
    newSocket.dataset.index = existingSockets.toString();

    socketGrid.appendChild(newSocket);

    const newSocketCount = existingSockets + 1;
    socketGrid.className = `socket-grid sockets-${newSocketCount}`;

    // Auto-apply socket corruption when adding 3rd socket to armor, helm, or shield
    if ((section === 'armor' || section === 'helm' || section === 'shield') && newSocketCount === 3) {
      const dropdownId = this.getSectionDropdownId(section);
      if (dropdownId && typeof window.applySocketCorruption === 'function') {
        window.applySocketCorruption(dropdownId, 3);
      }
    }

  }

  // Adjust socket count when item changes to ensure it doesn't exceed new item's max
  // savedSocketCount: optional parameter used when restoring item state
  adjustSocketsForItem(section, savedSocketCount = null) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return;
    }

    const socketGrid = container.querySelector('.socket-grid');
    const addSocketBtn = container.querySelector('.add-socket-btn');
    if (!socketGrid) {
      return;
    }

    // Get the dropdown for this section to check item properties
    const dropdownId = this.getSectionDropdownId(section);
    const dropdown = document.getElementById(dropdownId);
    const itemName = dropdown?.value;

    // Check if item has fixed sockets (sock property)
    if (itemName) {
      const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];

      if (item && item.properties && item.properties.sock !== undefined) {
        // Item has fixed sockets - set exact count and hide Add Socket button
        const fixedSocketCount = item.properties.sock;

        // CRITICAL: Save current socket contents before clearing
        const currentSockets = [];
        const existingSlots = socketGrid.querySelectorAll('.socket-slot');
        existingSlots.forEach((slot, index) => {
          if (slot.classList.contains('filled')) {
            const imgElement = slot.querySelector('img');
            currentSockets.push({
              itemName: slot.dataset.itemName,
              stats: slot.dataset.stats,
              levelReq: slot.dataset.levelReq,
              itemKey: slot.dataset.itemKey,
              category: slot.dataset.category,
              imgSrc: imgElement ? imgElement.src : null,
              index: index
            });
          }
        });

        // Clear all existing sockets
        while (socketGrid.firstChild) {
          socketGrid.removeChild(socketGrid.firstChild);
        }

        // Add the exact number of fixed sockets
        for (let i = 0; i < fixedSocketCount; i++) {
          const socket = document.createElement('div');
          socket.className = 'socket-slot empty';
          socket.dataset.index = i.toString();
          socketGrid.appendChild(socket);
        }

        // CRITICAL: Restore socket contents
        currentSockets.forEach(socketInfo => {
          if (socketInfo.index < fixedSocketCount) {
            const socketSlot = socketGrid.children[socketInfo.index];
            if (socketSlot && socketInfo.imgSrc) {
              socketSlot.classList.remove('empty');
              socketSlot.classList.add('filled');
              socketSlot.dataset.itemName = socketInfo.itemName;
              socketSlot.dataset.stats = socketInfo.stats;
              socketSlot.dataset.levelReq = socketInfo.levelReq;
              if (socketInfo.itemKey) socketSlot.dataset.itemKey = socketInfo.itemKey;
              if (socketInfo.category) socketSlot.dataset.category = socketInfo.category;
              socketSlot.innerHTML = `<img src="${socketInfo.imgSrc}" alt="${socketInfo.itemName}">`;
            }
          }
        });

        // Update grid class
        socketGrid.className = `socket-grid sockets-${fixedSocketCount}`;

        // Hide the Add Socket button for fixed socket items
        if (addSocketBtn) {
          addSocketBtn.style.display = 'none';
        }

        // Mark container as having fixed sockets
        container.dataset.fixedSockets = 'true';

        this.updateAll();
        return;
      }
    }

    // Not a fixed socket item - show Add Socket button and remove fixed flag
    if (addSocketBtn) {
      addSocketBtn.style.display = '';
    }
    delete container.dataset.fixedSockets;

    const currentSocketCount = socketGrid.children.length;
    const maxSockets = this.getMaxSocketsForSection(section);

    // Check if there's an active socket corruption for this item
    const hasSocketCorruption = window.itemCorruptions &&
      window.itemCorruptions[dropdownId] &&
      window.itemCorruptions[dropdownId].type === 'socket_corruption';

    let safeMaxSockets;
    if (savedSocketCount !== null) {
      // PRIORITY 1: If restoring from saved state (direct argument), use it
      safeMaxSockets = savedSocketCount;
    } else if (hasSocketCorruption) {
      // PRIORITY 2: If there's a socket corruption, respect its socket count
      safeMaxSockets = window.itemCorruptions[dropdownId].socketCount;
    } else if (window.itemStates && itemName) {
      // PRIORITY 3: Check simple item state storage (remembers manual sockets)
      const stateKey = `${dropdownId}_${itemName}`;
      const savedState = window.itemStates[stateKey];
      if (savedState && savedState.socketCount !== undefined) {
        safeMaxSockets = savedState.socketCount;
      } else {
        safeMaxSockets = 0;
      }
    } else {
      // PRIORITY 4: New item without any history or corruption starts with 0
      safeMaxSockets = 0;
    }

    // If current socket count exceeds safe max for new item, remove excess sockets
    if (currentSocketCount > safeMaxSockets) {

      // Remove sockets from the end (highest indices first)
      while (socketGrid.children.length > safeMaxSockets) {
        const lastSocket = socketGrid.lastElementChild;
        socketGrid.removeChild(lastSocket);
      }

      // Update grid class to reflect new socket count
      const newSocketCount = socketGrid.children.length;
      socketGrid.className = `socket-grid sockets-${newSocketCount}`;

      // Update stats after removing sockets
      this.updateAll();
    } else if (currentSocketCount < safeMaxSockets) {
      // If socket corruption requires more sockets than we have, add them
      while (socketGrid.children.length < safeMaxSockets) {
        const newSocket = document.createElement('div');
        newSocket.className = 'socket-slot empty';
        newSocket.dataset.index = socketGrid.children.length.toString();
        socketGrid.appendChild(newSocket);
      }

      // Update grid class to reflect new socket count
      const newSocketCount = socketGrid.children.length;
      socketGrid.className = `socket-grid sockets-${newSocketCount}`;

      // Update stats after adding sockets
      this.updateAll();
    }
  }

  // Set socket count to exact number (for corruption system)
  getSocketCount(section) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return 0;
    }

    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      return 0;
    }

    return socketGrid.children.length;
  }

  setSocketCount(section, targetCount) {
    const container = document.querySelector(`.socket-container[data-section="${section}"]`);
    if (!container) {
      return;
    }

    const socketGrid = container.querySelector('.socket-grid');
    if (!socketGrid) {
      return;
    }

    const currentCount = socketGrid.children.length;

    // Remove all existing sockets first
    while (socketGrid.firstChild) {
      socketGrid.removeChild(socketGrid.firstChild);
    }

    // Add the target number of sockets
    for (let i = 0; i < targetCount; i++) {
      const socket = document.createElement('div');
      socket.className = 'socket-slot empty';
      socket.dataset.index = i.toString();
      socketGrid.appendChild(socket);
    }

    // Update grid class
    socketGrid.className = `socket-grid sockets-${targetCount}`;

    // Update stats
    this.updateAll();
  }

  handleSocketClick(e) {
    const socket = e.target;

    if (socket.classList.contains('filled')) {
      if (e.shiftKey || e.ctrlKey) {
        this.clearSocket(socket);
      } else {
        this.currentSocket = socket;
        this.showSocketModal();
      }
    } else {
      this.currentSocket = socket;
      this.showSocketModal();
    }
  }

  clearSocket(socket) {
    socket.className = 'socket-slot empty';
    socket.innerHTML = '';

    ['itemKey', 'category', 'itemName', 'stats', 'levelReq'].forEach(attr => {
      delete socket.dataset[attr];
    });

    this.updateAll();

    // Refresh saved state AFTER updateAll completes
    const container = socket.closest('.socket-container');
    const section = container?.dataset.section;
    if (section && typeof window.refreshSavedState === 'function') {
      const dropdownId = this.getSectionDropdownId(section);
      if (dropdownId) {
        setTimeout(() => window.refreshSavedState(dropdownId, section), 100);
      }
    }
  }

  fillSocket(itemKey, category) {
    if (!this.currentSocket) return;

    const item = this.socketData[category]?.[itemKey];
    if (!item) return;

    // Clear old data first (in case it was filled)
    ['itemKey', 'category', 'itemName', 'stats', 'levelReq'].forEach(attr => {
      delete this.currentSocket.dataset[attr];
    });

    // Fill with new item (replaces old one)
    this.currentSocket.className = 'socket-slot filled';
    this.currentSocket.innerHTML = `<img src="${item.img}" alt="${item.name}">`;

    // Store new socket data
    this.currentSocket.dataset.itemKey = itemKey;
    this.currentSocket.dataset.category = category;
    this.currentSocket.dataset.itemName = item.name;
    this.currentSocket.dataset.levelReq = item.levelReq || 1;

    const section = this.currentSocket.closest('.socket-container')?.dataset.section;
    const stats = typeof item.stats === 'object' ? item.stats[section] : item.stats;

    if (stats) {
      this.currentSocket.dataset.stats = stats;
    }

    this.hideSocketModal();
    this.currentSocket = null;
    this.updateAll();

    // Refresh saved state AFTER updateAll completes
    if (section && typeof window.refreshSavedState === 'function') {
      const dropdownId = this.getSectionDropdownId(section);
      if (dropdownId) {
        setTimeout(() => window.refreshSavedState(dropdownId, section), 100);
      }
    }
  }
  // === MODAL CREATION ===
  createSocketModal() {
    if (document.getElementById('socketModal')) return;

    const modal = document.createElement('div');
    modal.id = 'socketModal';
    modal.className = 'socket-modal';
    modal.innerHTML = `
        <div class="socket-modal-content">
          <span class="socket-close">&times;</span>
          <h3>Select Socket Item</h3>
          <div class="socket-tabs">
            <button class="socket-tab active" data-category="gems">Gems</button>
            <button class="socket-tab" data-category="runes">Runes</button>
            <button class="socket-tab" data-category="jewels">Jewels</button>
          </div>
          <div id="socketItemGrid" class="socket-item-grid"></div>
        </div>
      `;

    document.body.appendChild(modal);

    // Event handlers
    modal.querySelector('.socket-close').onclick = () => this.hideSocketModal();
    modal.onclick = (e) => {
      if (e.target === modal) this.hideSocketModal();
    };

    modal.querySelectorAll('.socket-tab').forEach(tab => {
      tab.onclick = () => this.switchSocketTab(tab.dataset.category);
    });
  }

  createJewelModal() {
    if (document.getElementById('jewelModal')) return;

    const modal = document.createElement('div');
    modal.id = 'jewelModal';
    modal.className = 'socket-modal';

    modal.innerHTML = `
        <div class="socket-modal-content jewel-modal-content">
          <span class="socket-close">&times;</span>
          <h3>Create Custom Jewel</h3>
          <div class="jewel-creation-section">
            
            <h4>1. Select Color</h4>
            <div class="jewel-color-grid">
              ${['white', 'blue', 'yellow', 'green', 'purple', 'red'].map(color => `
                <div class="color-option ${color === 'white' ? 'selected' : ''}" data-color="${color}" 
                    style="background: ${color}; border: 2px solid ${color === 'white' ? '#000' : color};">
                  ${color.charAt(0).toUpperCase() + color.slice(1)}
                </div>
              `).join('')}
            </div>
            
            <h4>2. Select Prefixes (up to 3)</h4>
            ${[1, 2, 3].map(num => `
              <div style="margin-bottom: 15px;">
                <label>Prefix ${num}:</label>
                <select id="jewelPrefix${num}Select">
                  <option value="">No Prefix</option>
                  ${Object.entries(this.jewelPrefixes).map(([key, prefix]) =>
      `<option value="${key}">${prefix.effect} (Req Level: ${prefix.reqLevel || 1})</option>`
    ).join('')}
                </select>
                <div id="prefix${num}ValueContainer" style="display: none;"></div>
              </div>
            `).join('')}
            
            <h4>3. Select Suffixes (up to 3)</h4>
            ${[1, 2, 3].map(num => `
              <div style="margin-bottom: 15px;">
                <label>Suffix ${num}:</label>
                <select id="jewelSuffix${num}Select">
                  <option value="">No Suffix</option>
                  ${Object.entries(this.jewelSuffixes).map(([key, suffix]) =>
      `<option value="${key}">${suffix.effect} (Req Level: ${suffix.reqLevel || 1})</option>`
    ).join('')}
                </select>
                <div id="suffix${num}ValueContainer" style="display: none;"></div>
              </div>
            `).join('')}
            
            <div id="jewelPreview" class="jewel-preview">
              White Jewel<br>
              <span style="color: #888; font-size: 12px;">Required Level: 1</span>
            </div>
            
            <button id="createJewelBtn" class="create-jewel-btn">Create Jewel</button>
          </div>
        </div>
      `;

    document.body.appendChild(modal);
    this.setupEnhancedJewelModalEvents();
  }
  setupEnhancedJewelModalEvents() {
    const modal = document.getElementById('jewelModal');

    // Close handlers
    modal.querySelector('.socket-close').onclick = () => this.hideJewelModal();
    modal.onclick = (e) => {
      if (e.target === modal) this.hideJewelModal();
    };

    // Color selection
    modal.querySelectorAll('.color-option').forEach(option => {
      option.onclick = () => {
        modal.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedJewelColor = option.dataset.color;
        this.updateJewelPreview();
      };
    });

    // Prefix selections with validation
    [1, 2, 3].forEach(num => {
      modal.querySelector(`#jewelPrefix${num}Select`).onchange = (e) => {
        this[`selectedJewelPrefix${num}`] = e.target.value;
        this.validateAffixLimit();
        this.updatePrefixValueInput(num);
        this.updateJewelPreview();
      };
    });

    // Suffix selections with validation
    [1, 2, 3].forEach(num => {
      modal.querySelector(`#jewelSuffix${num}Select`).onchange = (e) => {
        this[`selectedJewelSuffix${num}`] = e.target.value;
        this.validateAffixLimit();
        this.updateSuffixValueInput(num);
        this.updateJewelPreview();
      };
    });

    // Create jewel button
    modal.querySelector('#createJewelBtn').onclick = () => this.createCustomJewel();
  }

  // Validate affix limit and disable selectors when needed
  validateAffixLimit() {
    const prefixCount = [this.selectedJewelPrefix1, this.selectedJewelPrefix2, this.selectedJewelPrefix3].filter(p => p).length;
    const suffixCount = [this.selectedJewelSuffix1, this.selectedJewelSuffix2, this.selectedJewelSuffix3].filter(s => s).length;
    const totalAffixes = prefixCount + suffixCount;

    // Disable/enable selectors based on current count
    const modal = document.getElementById('jewelModal');
    if (modal) {
      // If we have 4 affixes, disable empty selectors
      if (totalAffixes >= 4) {
        [1, 2, 3].forEach(num => {
          const select = modal.querySelector(`#jewelPrefix${num}Select`);
          if (select && !this[`selectedJewelPrefix${num}`]) {
            select.disabled = true;
            select.style.opacity = '0.5';
          }
        });

        [1, 2, 3].forEach(num => {
          const select = modal.querySelector(`#jewelSuffix${num}Select`);
          if (select && !this[`selectedJewelSuffix${num}`]) {
            select.disabled = true;
            select.style.opacity = '0.5';
          }
        });
      } else {
        // Re-enable all selectors
        [1, 2, 3].forEach(num => {
          const select = modal.querySelector(`#jewelPrefix${num}Select`);
          if (select) {
            select.disabled = false;
            select.style.opacity = '1';
          }
        });

        [1, 2].forEach(num => {
          const select = modal.querySelector(`#jewelSuffix${num}Select`);
          if (select) {
            select.disabled = false;
            select.style.opacity = '1';
          }
        });
      }
    }
  }
  // === MODAL MANAGEMENT ===
  showSocketModal() {
    const modal = document.getElementById('socketModal');
    if (modal) {
      modal.style.display = 'flex';
      this.switchSocketTab('gems'); // Default to gems
    }
  }

  hideSocketModal() {
    const modal = document.getElementById('socketModal');
    if (modal) modal.style.display = 'none';
    this.currentSocket = null;
  }

  showJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) {
      modal.style.display = 'flex';
      this.resetJewelModal();
    }
  }

  hideJewelModal() {
    const modal = document.getElementById('jewelModal');
    if (modal) modal.style.display = 'none';
    this.targetSocket = null;
  }

  switchSocketTab(category) {
    const tabs = document.querySelectorAll('.socket-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    this.populateSocketItems(category);
  }

  // Replace your populateSocketItems method with this:

  populateSocketItems(category) {
    const grid = document.getElementById('socketItemGrid');

    if (!grid) {
      return;
    }

    grid.innerHTML = '';

    const items = this.socketData[category] || {};

    // Add regular items (skip rainbow-facet to avoid duplicates)
    Object.entries(items).forEach(([itemKey, item]) => {
      if (itemKey === 'rainbow-facet') {
        return; // Skip basic rainbow-facet
      }

      const itemDiv = document.createElement('div');
      itemDiv.className = 'socket-item';

      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}" style="width: 32px; height: 32px;">
        <div class="socket-item-name">${item.name}</div>
        <div class="socket-item-level">Level ${item.levelReq}</div>
      `;

      itemDiv.onclick = () => {
        this.fillSocket(itemKey, category);
      };

      grid.appendChild(itemDiv);
    });

    // Add special jewel options ONLY for jewels category
    if (category === 'jewels') {
      // Add Rainbow Facet option
      const rainbowDiv = document.createElement('div');
      rainbowDiv.className = 'socket-item rainbow-facet-item';
      rainbowDiv.style.border = '2px solid gold';
      rainbowDiv.innerHTML = `
        <img src="img/jewelgreen.png" alt="Rainbow Facet" style="width: 32px; height: 32px;">
        <div class="socket-item-name">Rainbow Facet</div>
        <div class="socket-item-level">Level 49</div>
      `;

      rainbowDiv.onclick = () => {


        if (!this.currentSocket) {
          alert('Please click on a socket first, then try again.');
          this.hideSocketModal();
          return;
        }

        // CRITICAL FIX: Store the socket reference in a way that won't get lost
        this.rainbowFacetTargetSocket = this.currentSocket;

        this.hideSocketModal();
        this.createRainbowFacetModal();
      };
      grid.appendChild(rainbowDiv);

      // Add Custom Jewel option
      const customJewelDiv = document.createElement('div');
      customJewelDiv.className = 'socket-item custom-jewel-item';
      customJewelDiv.style.border = '2px solid purple';
      customJewelDiv.innerHTML = `
        <img src="img/jewel1.png" alt="Custom Jewel" style="width: 32px; height: 32px;">
        <div class="socket-item-name">Create Custom Jewel</div>
        <div class="socket-item-level">Custom</div>
      `;
      customJewelDiv.onclick = () => {
        if (!this.currentSocket) {
          alert('Please click on a socket first, then try again.');
          this.hideSocketModal();
          return;
        }
        this.targetSocket = this.currentSocket;
        this.hideSocketModal();
        this.showJewelModal();
      };
      grid.appendChild(customJewelDiv);
    }
  }
  // === JEWEL CREATION ===
  updatePrefixValueInput(num) {
    const container = document.getElementById(`prefix${num}ValueContainer`);
    const selectedPrefix = this[`selectedJewelPrefix${num}`];

    if (selectedPrefix && this.jewelPrefixes[selectedPrefix]) {
      const prefixData = this.jewelPrefixes[selectedPrefix];

      if (prefixData.minRange && prefixData.maxRange) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Min: <span id="prefix${num}MinValueDisplay">${prefixData.minRange[0]}</span></label>
                    <input type="range" id="prefix${num}MinValue" min="${prefixData.minRange[0]}" max="${prefixData.minRange[1]}" value="${prefixData.minRange[0]}">
                </div>
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Max: <span id="prefix${num}MaxValueDisplay">${prefixData.maxRange[0]}</span></label>
                    <input type="range" id="prefix${num}MaxValue" min="${prefixData.maxRange[0]}" max="${prefixData.maxRange[1]}" value="${prefixData.maxRange[0]}">
                </div>
            `;

        this[`selectedJewelPrefix${num}MinValue`] = prefixData.minRange[0];
        this[`selectedJewelPrefix${num}MaxValue`] = prefixData.maxRange[0];

        document.getElementById(`prefix${num}MinValue`).oninput = (e) => {
          this[`selectedJewelPrefix${num}MinValue`] = e.target.value;
          document.getElementById(`prefix${num}MinValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

        document.getElementById(`prefix${num}MaxValue`).oninput = (e) => {
          this[`selectedJewelPrefix${num}MaxValue`] = e.target.value;
          document.getElementById(`prefix${num}MaxValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

      } else if (prefixData.range) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Value: <span id="prefix${num}ValueDisplay">${prefixData.range[0]}</span></label>
                    <input type="range" id="prefix${num}Value" min="${prefixData.range[0]}" max="${prefixData.range[1]}" value="${prefixData.range[0]}">
                </div>
            `;

        this[`selectedJewelPrefix${num}Value`] = prefixData.range[0];

        document.getElementById(`prefix${num}Value`).oninput = (e) => {
          this[`selectedJewelPrefix${num}Value`] = e.target.value;
          document.getElementById(`prefix${num}ValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };
      }

      container.style.display = 'block';
    } else {
      container.style.display = 'none';
      this[`selectedJewelPrefix${num}Value`] = null;
      this[`selectedJewelPrefix${num}MinValue`] = null;
      this[`selectedJewelPrefix${num}MaxValue`] = null;
    }
  }

  updateSuffixValueInput(num) {
    const container = document.getElementById(`suffix${num}ValueContainer`);
    const selectedSuffix = this[`selectedJewelSuffix${num}`];

    if (selectedSuffix && this.jewelSuffixes[selectedSuffix]) {
      const suffixData = this.jewelSuffixes[selectedSuffix];

      if (suffixData.minRange && suffixData.maxRange) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Min: <span id="suffix${num}MinValueDisplay">${suffixData.minRange[0]}</span></label>
                    <input type="range" id="suffix${num}MinValue" min="${suffixData.minRange[0]}" max="${suffixData.minRange[1]}" value="${suffixData.minRange[0]}">
                </div>
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Max: <span id="suffix${num}MaxValueDisplay">${suffixData.maxRange[0]}</span></label>
                    <input type="range" id="suffix${num}MaxValue" min="${suffixData.maxRange[0]}" max="${suffixData.maxRange[1]}" value="${suffixData.maxRange[0]}">
                </div>
            `;

        this[`selectedJewelSuffix${num}MinValue`] = suffixData.minRange[0];
        this[`selectedJewelSuffix${num}MaxValue`] = suffixData.maxRange[0];

        document.getElementById(`suffix${num}MinValue`).oninput = (e) => {
          this[`selectedJewelSuffix${num}MinValue`] = e.target.value;
          document.getElementById(`suffix${num}MinValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

        document.getElementById(`suffix${num}MaxValue`).oninput = (e) => {
          this[`selectedJewelSuffix${num}MaxValue`] = e.target.value;
          document.getElementById(`suffix${num}MaxValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };

      } else if (suffixData.range) {
        container.innerHTML = `
                <div style="margin: 10px 0;">
                    <label style="color: #FFD700;">Value: <span id="suffix${num}ValueDisplay">${suffixData.range[0]}</span></label>
                    <input type="range" id="suffix${num}Value" min="${suffixData.range[0]}" max="${suffixData.range[1]}" value="${suffixData.range[0]}">
                </div>
            `;

        this[`selectedJewelSuffix${num}Value`] = suffixData.range[0];

        document.getElementById(`suffix${num}Value`).oninput = (e) => {
          this[`selectedJewelSuffix${num}Value`] = e.target.value;
          document.getElementById(`suffix${num}ValueDisplay`).textContent = e.target.value;
          this.updateJewelPreview();
        };
      }

      container.style.display = 'block';
    } else {
      container.style.display = 'none';
      this[`selectedJewelSuffix${num}Value`] = null;
      this[`selectedJewelSuffix${num}MinValue`] = null;
      this[`selectedJewelSuffix${num}MaxValue`] = null;
    }
  }

  updateJewelPreview() {
    const preview = document.getElementById('jewelPreview');
    if (!preview) return;

    let jewelName = `${this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1)} Jewel`;
    let stats = [];
    let maxRequiredLevel = 1;

    // Handle all prefixes
    [1, 2, 3].forEach(num => {
      const selectedPrefix = this[`selectedJewelPrefix${num}`];
      if (selectedPrefix) {
        const prefix = this.jewelPrefixes[selectedPrefix];
        let effect = prefix.effect;

        const minVal = this[`selectedJewelPrefix${num}MinValue`];
        const maxVal = this[`selectedJewelPrefix${num}MaxValue`];
        const singleVal = this[`selectedJewelPrefix${num}Value`];

        if (minVal && maxVal) {
          effect = effect.replace(/\[\d+-\d+\]/g, (match, offset) => {
            const beforeMatch = effect.substring(0, offset);
            const minRangeCount = (beforeMatch.match(/\[\d+-\d+\]/g) || []).length;
            return minRangeCount === 0 ? minVal : maxVal;
          });
        } else if (singleVal) {
          effect = effect.replace(/\[\d+-\d+\]/, singleVal);
        }

        stats.push(`<span style="color: #8888ff;">${effect}</span>`);
        maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
      }
    });

    // Handle all suffixes
    [1, 2, 3].forEach(num => {
      const selectedSuffix = this[`selectedJewelSuffix${num}`];
      if (selectedSuffix) {
        const suffix = this.jewelSuffixes[selectedSuffix];
        let effect = suffix.effect;

        const minVal = this[`selectedJewelSuffix${num}MinValue`];
        const maxVal = this[`selectedJewelSuffix${num}MaxValue`];
        const singleVal = this[`selectedJewelSuffix${num}Value`];

        if (minVal && maxVal) {
          effect = effect.replace(/\[\d+-\d+\]/g, (match, offset) => {
            const beforeMatch = effect.substring(0, offset);
            const minRangeCount = (beforeMatch.match(/\[\d+-\d+\]/g) || []).length;
            return minRangeCount === 0 ? minVal : maxVal;
          });
        } else if (singleVal) {
          effect = effect.replace(/\[\d+-\d+\]/, singleVal);
        }

        stats.push(`<span style="color: #8888ff;">${effect}</span>`);
        maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
      }
    });

    preview.innerHTML = `
        <div style="color: ${this.getJewelColor()}; font-weight: bold;">${jewelName}</div>
        <div style="color: #888; font-size: 12px;">Required Level: ${maxRequiredLevel}</div>
        ${stats.length > 0 ? stats.join('<br>') : '<span style="color: #888;">No special properties</span>'}
    `;
  }

  getJewelColor() {
    const colors = {
      white: '#ffffff',
      blue: '#6666ff',
      yellow: '#ffff66',
      green: '#66ff66',
      purple: '#c412caff',
      red: '#ff6666'
    };
    return colors[this.selectedJewelColor] || '#ffffff';
  }

  resetJewelModal() {
    this.selectedJewelColor = 'white';
    this.selectedJewelPrefix = null;
    this.selectedJewelSuffix = null;
    this.selectedJewelPrefixValue = null;
    this.selectedJewelSuffixValue = null;

    // Reset UI
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.color-option[data-color="white"]').classList.add('selected');
    document.getElementById('jewelPrefixSelect').value = '';
    document.getElementById('jewelSuffixSelect').value = '';
    document.getElementById('prefixValueContainer').style.display = 'none';
    document.getElementById('suffixValueContainer').style.display = 'none';

    this.updateJewelPreview();
  }


  resetJewelSelections() {
    this.selectedJewelColor = 'white';

    // Reset all prefixes
    this.selectedJewelPrefix1 = null;
    this.selectedJewelPrefix2 = null;
    this.selectedJewelPrefix3 = null;
    this.selectedJewelPrefix1Value = null;
    this.selectedJewelPrefix2Value = null;
    this.selectedJewelPrefix3Value = null;
    this.selectedJewelPrefix1MinValue = null;
    this.selectedJewelPrefix2MinValue = null;
    this.selectedJewelPrefix3MinValue = null;
    this.selectedJewelPrefix1MaxValue = null;
    this.selectedJewelPrefix2MaxValue = null;
    this.selectedJewelPrefix3MaxValue = null;

    // Reset all suffixes
    this.selectedJewelSuffix1 = null;
    this.selectedJewelSuffix2 = null;
    this.selectedJewelSuffix3 = null;
    this.selectedJewelSuffix3Value = null;
    this.selectedJewelSuffix3MinValue = null;
    this.selectedJewelSuffix3MaxValue = null;
    this.selectedJewelSuffix1Value = null;
    this.selectedJewelSuffix2Value = null;
    this.selectedJewelSuffix1MinValue = null;
    this.selectedJewelSuffix2MinValue = null;
    this.selectedJewelSuffix1MaxValue = null;
    this.selectedJewelSuffix2MaxValue = null;
  }



  createCustomJewel() {
    const socketToUse = this.targetSocket || this.currentSocket;
    if (!socketToUse) {
      alert('No socket selected!');
      return;
    }

    // Collect all selected affixes
    let stats = [];
    let maxRequiredLevel = 1;

    // Handle prefix 1
    if (this.selectedJewelPrefix1) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix1];
      let effect = prefix.effect;

      if (this.selectedJewelPrefix1MinValue && this.selectedJewelPrefix1MaxValue) {
        effect = `Adds ${this.selectedJewelPrefix1MinValue}-${this.selectedJewelPrefix1MaxValue} ${prefix.effect.includes('Cold') ? 'Cold' : prefix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelPrefix1Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefix1Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
    }

    // Handle prefix 2
    if (this.selectedJewelPrefix2) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix2];
      let effect = prefix.effect;

      if (this.selectedJewelPrefix2MinValue && this.selectedJewelPrefix2MaxValue) {
        effect = `Adds ${this.selectedJewelPrefix2MinValue}-${this.selectedJewelPrefix2MaxValue} ${prefix.effect.includes('Cold') ? 'Cold' : prefix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelPrefix2Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefix2Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
    }

    // Handle prefix 3
    if (this.selectedJewelPrefix3) {
      const prefix = this.jewelPrefixes[this.selectedJewelPrefix3];
      let effect = prefix.effect;

      if (this.selectedJewelPrefix3MinValue && this.selectedJewelPrefix3MaxValue) {
        effect = `Adds ${this.selectedJewelPrefix3MinValue}-${this.selectedJewelPrefix3MaxValue} ${prefix.effect.includes('Cold') ? 'Cold' : prefix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelPrefix3Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelPrefix3Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, prefix.reqLevel || 1);
    }

    // Handle suffix 1
    if (this.selectedJewelSuffix1) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix1];
      let effect = suffix.effect;

      if (this.selectedJewelSuffix1MinValue && this.selectedJewelSuffix1MaxValue) {
        effect = `Adds ${this.selectedJewelSuffix1MinValue}-${this.selectedJewelSuffix1MaxValue} ${suffix.effect.includes('Cold') ? 'Cold' : suffix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelSuffix1Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffix1Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
    }

    // Handle suffix 2
    if (this.selectedJewelSuffix2) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix2];
      let effect = suffix.effect;

      if (this.selectedJewelSuffix2MinValue && this.selectedJewelSuffix2MaxValue) {
        effect = `Adds ${this.selectedJewelSuffix2MinValue}-${this.selectedJewelSuffix2MaxValue} ${suffix.effect.includes('Cold') ? 'Cold' : suffix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelSuffix2Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffix2Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
    }

    if (this.selectedJewelSuffix3) {
      const suffix = this.jewelSuffixes[this.selectedJewelSuffix3];
      let effect = suffix.effect;

      if (this.selectedJewelSuffix3MinValue && this.selectedJewelSuffix3MaxValue) {
        effect = `Adds ${this.selectedJewelSuffix3MinValue}-${this.selectedJewelSuffix3MaxValue} ${suffix.effect.includes('Cold') ? 'Cold' : suffix.effect.includes('Fire') ? 'Fire' : 'Lightning'} Damage`;
      } else if (this.selectedJewelSuffix3Value) {
        effect = effect.replace(/\[\d+-\d+\]/, this.selectedJewelSuffix3Value);
      }

      stats.push(effect);
      maxRequiredLevel = Math.max(maxRequiredLevel, suffix.reqLevel || 1);
    }

    // Validate affix requirements
    const prefixCount = [this.selectedJewelPrefix1, this.selectedJewelPrefix2, this.selectedJewelPrefix3].filter(p => p).length;
    const suffixCount = [this.selectedJewelSuffix1, this.selectedJewelSuffix2, this.selectedJewelSuffix3].filter(s => s).length;
    const totalAffixes = prefixCount + suffixCount;

    if (prefixCount === 0 || suffixCount === 0) {
      alert('You must select at least 1 prefix and 1 suffix!');
      return;
    }

    if (totalAffixes > 4) {
      alert('Maximum 4 affixes allowed! You have selected ' + totalAffixes + ' affixes.');
      return;
    }

    const jewelStats = stats.join(', ');
    const jewelName = `${this.selectedJewelColor.charAt(0).toUpperCase() + this.selectedJewelColor.slice(1)} Jewel`;

    // Get the correct colored jewel image
    const jewelImage = `img/jewel${this.selectedJewelColor}.png`;

    // Fill the socket
    socketToUse.className = 'socket-slot filled';
    socketToUse.innerHTML = `<img src="${jewelImage}" alt="${jewelName}">`;
    socketToUse.dataset.itemKey = 'custom-jewel';
    socketToUse.dataset.category = 'jewels';
    socketToUse.dataset.itemName = jewelName;
    socketToUse.dataset.stats = jewelStats;
    socketToUse.dataset.levelReq = maxRequiredLevel.toString();

    this.hideJewelModal();
    this.updateAll();

    // Reset selections
    this.resetJewelSelections();
  }
  // === STATS CALCULATION ===
  calculateActualRequiredLevel(section, itemName) {
    // Use window.getItemData to support both regular and crafted items
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];
    if (!item) return 1;

    let actualLevel = item.properties?.reqlvl || 1;

    // Check socket requirements
    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
    sockets.forEach(socket => {
      const socketLevel = parseInt(socket.dataset.levelReq) || 1;
      if (socketLevel > actualLevel) {
        actualLevel = socketLevel;
      }
    });

    return actualLevel;
  }

  getItemRequiredStats(itemName) {
    const item = window.getItemData ? window.getItemData(itemName) : itemList[itemName];
    if (!item?.properties) return { str: 0, dex: 0 };
    return {
      str: item.properties.reqstr || 0,
      dex: item.properties.reqdex || 0
    };
  }

  updateStatsDisplay() {
    if (window.SocketUI) {
      window.SocketUI.updateStatsDisplay(this);
    }
  }

  updateAll() {
    if (this.isInitializing) return;
    if (window.SocketUI) {
      window.SocketUI.updateAllItemDisplays(this);
      this.calculateAllStats();
      window.SocketUI.updateStatsDisplay(this);
    } else {
      this.calculateAllStats();
    }
  }

  // Note: Mercenary stats display is handled by SocketUI

  calculateAllStats() {
    // Reset stats
    Object.keys(this.stats).forEach(key => {
      if (Array.isArray(this.stats[key])) {
        this.stats[key] = [];
      } else {
        this.stats[key] = typeof this.stats[key] === 'boolean' ? false : 0;
      }
    });

    // Explicitly reset Rainbow Facet stats to be sure
    this.stats.fireSkillDamage = 0;
    this.stats.coldSkillDamage = 0;
    this.stats.lightningSkillDamage = 0;
    this.stats.poisonSkillDamage = 0;
    this.stats.magicSkillDamage = 0;
    this.stats.pierceFire = 0;
    this.stats.pierceCold = 0;
    this.stats.pierceLightning = 0;
    this.stats.piercePoison = 0;
    this.stats.piercePhysical = 0;
    this.stats.pierceMagic = 0;

    // CRITICAL: Reset treeSkills object (not in initial stats, so Object.keys won't reset it)
    this.stats.treeSkills = {};
    this.stats.individualSkillBonuses = {};

    // Reset mercenary stats
    Object.keys(this.mercenaryStats).forEach(key => {
      this.mercenaryStats[key] = typeof this.mercenaryStats[key] === 'boolean' ? false : 0;
    });

    // Calculate equipment stats (ONLY player equipment, exclude mercenary)
    Object.entries(this.equipmentMap).forEach(([dropdownId, config]) => {
      // Skip mercenary equipment for player stats
      if (config.section.startsWith('merc')) return;
      this.calculateEquipmentStats(dropdownId, config.section);
    });

    // Calculate socket stats
    this.calculateSocketStats();

    // Calculate mercenary equipment stats separately
    this.calculateMercenaryStats();

    // Update mercenary stats display
    this.updateMercenaryStatsDisplay();

    // INTEGRATION: Add charm and equipment class bonuses
    // ALL charm bonuses are read from DOM via getCharmBonuses() - single source of truth
    if (typeof getCharmBonuses === 'function') {
      const charmBonuses = getCharmBonuses();

      // Merge charm bonuses into socket stats
      this.stats.allSkills = (this.stats.allSkills || 0) + (charmBonuses.allSkills || 0);
      this.stats.classSkills = (this.stats.classSkills || 0) + (charmBonuses.classSkills || 0);

      // ALSO add equipment class-specific skills (e.g. amask: 2 from Blastbark)
      if (window.characterManager && typeof window.characterManager.getEquipmentClassSkills === 'function') {
        this.stats.classSkills += window.characterManager.getEquipmentClassSkills();
      }

      // Add tree-specific skill bonuses (e.g. +3 to Javelin and Spear Skills)
      this.stats.treeSkills = charmBonuses.treeSkills || {};
      if (window.characterManager && typeof window.characterManager.getEquipmentTreeSkills === 'function') {
        const equipTreeBonuses = window.characterManager.getEquipmentTreeSkills();
        Object.keys(equipTreeBonuses).forEach(treeId => {
          this.stats.treeSkills[treeId] = (this.stats.treeSkills[treeId] || 0) + equipTreeBonuses[treeId];
        });
      }

      // Add charm bonuses 
      this.stats.strength = (this.stats.strength || 0) + (charmBonuses.str || 0);
      this.stats.dexterity = (this.stats.dexterity || 0) + (charmBonuses.dex || 0);
      this.stats.vitality = (this.stats.vitality || 0) + (charmBonuses.vit || 0);
      this.stats.energy = (this.stats.energy || 0) + (charmBonuses.enr || 0);

      this.stats.life = (this.stats.life || 0) + (charmBonuses.life || 0);
      this.stats.mana = (this.stats.mana || 0) + (charmBonuses.mana || 0);
      this.stats.defense = (this.stats.defense || 0) + (charmBonuses.defense || 0);
      this.stats.magicFind = (this.stats.magicFind || 0) + (charmBonuses.magicFind || 0);
      this.stats.goldFind = (this.stats.goldFind || 0) + (charmBonuses.goldFind || 0);
      this.stats.frw = (this.stats.frw || 0) + (charmBonuses.frw || 0);
      this.stats.fhr = (this.stats.fhr || 0) + (charmBonuses.fhr || 0);
      this.stats.coldResist = (this.stats.coldResist || 0) + (charmBonuses.coldResist || 0);
      this.stats.fireResist = (this.stats.fireResist || 0) + (charmBonuses.fireResist || 0);
      this.stats.lightResist = (this.stats.lightResist || 0) + (charmBonuses.lightResist || 0);
      this.stats.poisonResist = (this.stats.poisonResist || 0) + (charmBonuses.poisonResist || 0);

      // Add flat AR from charms
      this.stats.toatt = (this.stats.toatt || 0) + (charmBonuses.attackrating || 0);

      // Add physical damage from charms (preserve equipment/socket values)
      const equipmentMinDmg = this.stats.toMinDmg || 0;
      const equipmentMaxDmg = this.stats.toMaxDmg || 0;
      this.stats.toMinDmg = equipmentMinDmg + (charmBonuses.toMinDmg || 0);
      this.stats.toMaxDmg = equipmentMaxDmg + (charmBonuses.toMaxDmg || 0);

      // Add damage bonuses from charms
      this.stats.lightDmgMin = (this.stats.lightDmgMin || 0) + (charmBonuses.lightDmgMin || 0);
      this.stats.lightDmgMax = (this.stats.lightDmgMax || 0) + (charmBonuses.lightDmgMax || 0);
      this.stats.fireDmgMin = (this.stats.fireDmgMin || 0) + (charmBonuses.fireDmgMin || 0);
      this.stats.fireDmgMax = (this.stats.fireDmgMax || 0) + (charmBonuses.fireDmgMax || 0);
      this.stats.coldDmgMin = (this.stats.coldDmgMin || 0) + (charmBonuses.coldDmgMin || 0);
      this.stats.coldDmgMax = (this.stats.coldDmgMax || 0) + (charmBonuses.coldDmgMax || 0);
      this.stats.poisonDmgMin = (this.stats.poisonDmgMin || 0) + (charmBonuses.poisonDmgMin || 0);
      this.stats.poisonDmgMax = (this.stats.poisonDmgMax || 0) + (charmBonuses.poisonDmgMax || 0);

      // Add skill damage bonuses from charms
      this.stats.fireSkillDamage = (this.stats.fireSkillDamage || 0) + (charmBonuses.fireSkillDamage || 0);
      this.stats.coldSkillDamage = (this.stats.coldSkillDamage || 0) + (charmBonuses.coldSkillDamage || 0);
      this.stats.lightningSkillDamage = (this.stats.lightningSkillDamage || 0) + (charmBonuses.lightningSkillDamage || 0);
      this.stats.poisonSkillDamage = (this.stats.poisonSkillDamage || 0) + (charmBonuses.poisonSkillDamage || 0);
      this.stats.magicSkillDamage = (this.stats.magicSkillDamage || 0) + (charmBonuses.magicSkillDamage || 0);
    }

    // INTEGRATION: Add bonuses from passive skills (Barbarian masteries, etc.)
    if (window.skillSystem) {
      // 1. Initial update with gear/charms only (needed for BC itself to calculate its level)
      const gearAllSkills = this.stats.allSkills || 0;
      window.skillSystem.skillBonuses.allSkills = gearAllSkills;
      window.skillSystem.skillBonuses.classSkills = this.stats.classSkills || 0;
      window.skillSystem.skillBonuses.treeSkills = this.stats.treeSkills || {};
      window.skillSystem.skillBonuses.individualSkills = this.stats.individualSkillBonuses || {};

      // 2. Battle Command integration (adds to allSkills)
      // Check party for better BC
      const partyBC = window.partyManager?.getBestBuff('battle-command');
      const partyBCSkills = partyBC ? partyBC.allSkills : 0;

      let ownBCSkills = window.skillSystem.getBattleCommandSkills?.() || 0;
      let bcSkills = Math.max(ownBCSkills, partyBCSkills);
      this.stats.allSkills = gearAllSkills + bcSkills;

      // Update SkillSystem with the first-pass total and check if BC bonus increased
      window.skillSystem.skillBonuses.allSkills = this.stats.allSkills;
      ownBCSkills = window.skillSystem.getBattleCommandSkills?.() || 0;
      bcSkills = Math.max(ownBCSkills, partyBCSkills);

      // Final allSkills total (Gear + BC bonus)
      this.stats.allSkills = gearAllSkills + bcSkills;

      const partyBCDamage = partyBC ? partyBC.damage : 0;
      this.stats.enhancedPhysicalDamage = (this.stats.enhancedPhysicalDamage || 0) + Math.max(partyBCDamage, window.skillSystem.getBattleCommandDamageBonus?.() || 0);

      // 3. Update SkillSystem one last time with the absolute total allSkills
      // This ensures skills like Natural Resistance or Battle Orders use the latest level
      window.skillSystem.skillBonuses.allSkills = this.stats.allSkills || 0;

      // Natural Resistance (All Res)
      const natRes = window.skillSystem.getNaturalResistanceBonus?.() || 0;
      this.stats.fireResist += natRes;
      this.stats.coldResist += natRes;
      this.stats.lightResist += natRes;
      this.stats.poisonResist += natRes;

      // Defense bonuses (Iron Skin) - Skill-based %Def multipliers are applied in updateStatsDisplay to include Dex bonus
      const ironSkinBonus = window.skillSystem.getIronSkinDefenseBonus?.() || 0;
      this.stats.dr += (window.skillSystem.getIronSkinPDRBonus?.() || 0);

      // Increased Speed (FRW and IAS)
      this.stats.frw += (window.skillSystem.getIncreasedSpeedFRW?.() || 0);
      this.stats.ias += (window.skillSystem.getIncreasedSpeedIAS?.() || 0);

      // Skill-based AR bonuses (Passives, Active Skill, Enchant)
      this.stats.toattPercent = (this.stats.toattPercent || 0) +
        (window.skillSystem.getPassiveARBonus?.() || 0) +
        (window.skillSystem.getActiveSkillARBonus?.() || 0) +
        (window.skillSystem.getEnchantARBonus?.() || 0);

      // Combat Reflexes (FHR, Life, Stamina)
      this.stats.fhr += (window.skillSystem.getCombatReflexesFHR?.() || 0);
      this.stats.life += (window.skillSystem.getCombatReflexesLifeBonus?.() || 0);

      // Deep Wounds / Hunger / Thorns Open Wounds
      this.stats.openWounds = (this.stats.openWounds || 0) + (window.skillSystem.getDeepWoundsChance?.() || 0) + (window.skillSystem.getHungerChance?.() || 0) + (window.skillSystem.getThornsOpenWoundsChance?.() || 0);

      // PD2 Open Wounds damage Calculation: Base(from Level) + Skills + Items
      const baseOWDamage = this.openWoundsBaseDamage[Math.min(this.currentLevel - 1, 98)] || 0;
      this.stats.openWoundsDamage = baseOWDamage + (this.stats.openWoundsDamage || 0) + (window.skillSystem.getDeepWoundsDamage?.() || 0) + (window.skillSystem.getHungerDamage?.() || 0) + (window.skillSystem.getThornsOpenWoundsDamage?.() || 0);

      // Druid Spirit Buffs (Party Aware)
      const partyHOW = window.partyManager?.getBestBuff('heart-of-wolverine');
      const howDmg = Math.max(partyHOW?.damageBonus || 0, window.skillSystem.getHeartOfWolverineDamageBonus?.() || 0);
      const howAR = Math.max(partyHOW?.arBonus || 0, window.skillSystem.getHeartOfWolverineARBonus?.() || 0);

      this.stats.enhancedPhysicalDamage = (this.stats.enhancedPhysicalDamage || 0) + howDmg;
      this.stats.toattPercent = (this.stats.toattPercent || 0) + howAR;

      const partyOak = window.partyManager?.getBestBuff('oak-sage');
      const oakLife = Math.max(partyOak?.lifeBonus || 0, window.skillSystem.getOakSageLifeBonus?.() || 0);
      const oakReplenish = Math.max(partyOak?.lifeReplenish || 0, window.skillSystem.getOakSageLifeReplenish?.() || 0);

      this.stats.life = (this.stats.life || 0) + oakLife;
      this.stats.replenishLife = (this.stats.replenishLife || 0) + oakReplenish;

      const partySOB = window.partyManager?.getBestBuff('spirit-of-barbs');
      this.stats.damageReturn = (this.stats.damageReturn || 0) + Math.max(partySOB?.damageReturn || 0, window.skillSystem.getSpiritOfBarbsReturn?.() || 0);

      // Battle Orders / Buffs (Party Aware)
      const partyBO = window.partyManager?.getBestBuff('battle-orders');
      const boLife = Math.max(partyBO?.life || 0, window.skillSystem.getBattleOrdersLifeBonus?.() || 0);
      const boMana = Math.max(partyBO?.mana || 0, window.skillSystem.getBattleOrdersManaBonus?.() || 0);

      this.stats.life = (this.stats.life || 0) + boLife;
      this.stats.mana = (this.stats.mana || 0) + boMana;

      // Sorceress Mastery Skills (Fire, Cold, Lightning)
      // Fire Mastery - adds to fire skill damage and enemy fire resistance pierce
      const fireMasteryLevel = window.skillSystem?.getSkillTotalLevel?.('firemasterycontainer') || 0;
      if (fireMasteryLevel > 0 && window.skillSystem?.skillData?.firemasterycontainer) {
        const fireMasteryData = window.skillSystem.skillData.firemasterycontainer;
        if (fireMasteryData.fireDamage && fireMasteryData.fireDamage[fireMasteryLevel - 1] !== undefined) {
          this.stats.fireSkillDamage = (this.stats.fireSkillDamage || 0) + fireMasteryData.fireDamage[fireMasteryLevel - 1];
        }
        if (fireMasteryData.enemyFireResist && fireMasteryData.enemyFireResist[fireMasteryLevel - 1] !== undefined) {
          this.stats.pierceFire = (this.stats.pierceFire || 0) + Math.abs(fireMasteryData.enemyFireResist[fireMasteryLevel - 1]);
        }
      }

      // Cold Mastery - adds to cold skill damage and enemy cold resistance pierce
      const coldMasteryLevel = window.skillSystem?.getSkillTotalLevel?.('coldmasterycontainer') || 0;
      if (coldMasteryLevel > 0 && window.skillSystem?.skillData?.coldmasterycontainer) {
        const coldMasteryData = window.skillSystem.skillData.coldmasterycontainer;
        if (coldMasteryData.coldDamage && coldMasteryData.coldDamage[coldMasteryLevel - 1] !== undefined) {
          this.stats.coldSkillDamage = (this.stats.coldSkillDamage || 0) + coldMasteryData.coldDamage[coldMasteryLevel - 1];
        }
        if (coldMasteryData.enemyColdResist && coldMasteryData.enemyColdResist[coldMasteryLevel - 1] !== undefined) {
          this.stats.pierceCold = (this.stats.pierceCold || 0) + Math.abs(coldMasteryData.enemyColdResist[coldMasteryLevel - 1]);
        }
      }

      // Lightning Mastery - adds to lightning skill damage (no pierce in the data)
      const lightningMasteryLevel = window.skillSystem?.getSkillTotalLevel?.('lightningmasterycontainer') || 0;
      if (lightningMasteryLevel > 0 && window.skillSystem?.skillData?.lightningmasterycontainer) {
        const lightningMasteryData = window.skillSystem.skillData.lightningmasterycontainer;
        if (lightningMasteryData.lightningDamage && lightningMasteryData.lightningDamage[lightningMasteryLevel - 1] !== undefined) {
          this.stats.lightningSkillDamage = (this.stats.lightningSkillDamage || 0) + lightningMasteryData.lightningDamage[lightningMasteryLevel - 1];
        }
      }

      // Update weapon swap buff cache BEFORE reporting (so we have current data)
      if (window.weaponSwapSystem) {
        window.weaponSwapSystem.updateCachedBuffs();
      }

      // REPORT BUFFS TO PARTY MANAGER - Only if not currently loading a character to prevent inconsistencies
      if (window.partyManager && !window._isLoadingCharacterData) {
        const idx = window.partyManager.activeIndex;
        const pkBuffs = {};

        // BO - use max level from both weapon sets
        let boLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('battleorderscontainer') : 0;
        if (window.weaponSwapSystem) {
          boLevel = window.weaponSwapSystem.getMaxBuffLevel('bo');
        }
        if (boLevel > 0) {
          pkBuffs['battle-orders'] = {
            level: boLevel,
            life: typeof window.skillSystem.getBattleOrdersLifeBonus === 'function' ? window.skillSystem.getBattleOrdersLifeBonus() : 0,
            mana: typeof window.skillSystem.getBattleOrdersManaBonus === 'function' ? window.skillSystem.getBattleOrdersManaBonus() : 0
          };
        }

        // BC - use max level from both weapon sets
        let bcLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('battlecommandcontainer') : 0;
        if (window.weaponSwapSystem) {
          bcLevel = window.weaponSwapSystem.getMaxBuffLevel('bc');
        }
        if (bcLevel > 0) {
          pkBuffs['battle-command'] = {
            level: bcLevel,
            allSkills: typeof window.skillSystem.getBattleCommandSkills === 'function' ? window.skillSystem.getBattleCommandSkills() : 0,
            damage: typeof window.skillSystem.getBattleCommandDamageBonus === 'function' ? window.skillSystem.getBattleCommandDamageBonus() : 0
          };
        }

        // Shout - use max level from both weapon sets
        let shoutLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('shoutcontainer') : 0;
        if (window.weaponSwapSystem) {
          shoutLevel = window.weaponSwapSystem.getMaxBuffLevel('shout');
        }
        if (shoutLevel > 0) {
          pkBuffs['shout'] = {
            level: shoutLevel,
            defenseBonus: typeof window.skillSystem.getShoutDefenseBonus === 'function' ? window.skillSystem.getShoutDefenseBonus() : 0
          };
        }

        // Grim Ward - use max level from both weapon sets
        let grimWardLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('grimwardcontainer') : 0;
        if (window.weaponSwapSystem) {
          grimWardLevel = window.weaponSwapSystem.getMaxBuffLevel('grimWard');
        }
        if (grimWardLevel > 0) {
          const levelIndex = Math.min(grimWardLevel - 1, 59);
          const skill = window.skillSystem.skillData.grimwardcontainer;
          pkBuffs['grim-ward'] = {
            level: grimWardLevel,
            attackRating: skill.attackRating[levelIndex] || 0,
            damageBonus: skill.damageBonus[levelIndex] || 0
          };
        }

        // Heart of Wolverine - use max level from both weapon sets
        let howLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('heartofwolverinecontainer') : 0;
        if (window.weaponSwapSystem) {
          howLevel = window.weaponSwapSystem.getMaxBuffLevel('how');
        }
        if (howLevel > 0) {
          pkBuffs['heart-of-wolverine'] = {
            level: howLevel,
            damageBonus: typeof window.skillSystem.getHeartOfWolverineDamageBonus === 'function' ? window.skillSystem.getHeartOfWolverineDamageBonus() : 0,
            arBonus: typeof window.skillSystem.getHeartOfWolverineARBonus === 'function' ? window.skillSystem.getHeartOfWolverineARBonus() : 0
          };
        }

        // Oak Sage - use max level from both weapon sets
        let oakLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('oaksagecontainer') : 0;
        if (window.weaponSwapSystem) {
          oakLevel = window.weaponSwapSystem.getMaxBuffLevel('oak');
        }
        if (oakLevel > 0) {
          pkBuffs['oak-sage'] = {
            level: oakLevel,
            lifeBonus: typeof window.skillSystem.getOakSageLifeBonus === 'function' ? window.skillSystem.getOakSageLifeBonus() : 0,
            lifeReplenish: typeof window.skillSystem.getOakSageLifeReplenish === 'function' ? window.skillSystem.getOakSageLifeReplenish() : 0
          };
        }

        // Spirit of Barbs - use max level from both weapon sets
        let sobLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('spiritofbarbscontainer') : 0;
        if (window.weaponSwapSystem) {
          sobLevel = window.weaponSwapSystem.getMaxBuffLevel('sob');
        }
        if (sobLevel > 0) {
          pkBuffs['spirit-of-barbs'] = {
            level: sobLevel,
            damageReturn: typeof window.skillSystem.getSpiritOfBarbsReturn === 'function' ? window.skillSystem.getSpiritOfBarbsReturn() : 0
          };
        }

        // Fire Enchant - use max level from both weapon sets
        let fireEnchantLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('enchantfirecontainer') : 0;
        if (window.weaponSwapSystem) {
          fireEnchantLevel = window.weaponSwapSystem.getMaxBuffLevel('fireEnchant');
        }
        if (fireEnchantLevel > 0) {
          const levelIndex = Math.min(fireEnchantLevel - 1, 59);
          const skill = window.skillSystem.skillData.enchantfirecontainer;
          const baseFireMin = skill.fireDamageMin[levelIndex] || 0;
          const baseFireMax = skill.fireDamageMax[levelIndex] || 0;
          const synergyBonus = typeof window.skillSystem.calculateSynergyBonus === 'function' ? window.skillSystem.calculateSynergyBonus('enchantfirecontainer', 'fire') : 0;

          // Get Fire Mastery bonus
          let fireMasteryBonus = 0;
          const fireMasteryLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('firemasterycontainer') : 0;
          if (fireMasteryLevel > 0 && window.skillSystem.skillData.firemasterycontainer && window.skillSystem.skillData.firemasterycontainer.fireDamage) {
            fireMasteryBonus = window.skillSystem.skillData.firemasterycontainer.fireDamage[Math.min(fireMasteryLevel - 1, 59)] || 0;
          }

          pkBuffs['fire-enchant'] = {
            level: fireEnchantLevel,
            fireMin: Math.floor(baseFireMin * (1 + (synergyBonus + fireMasteryBonus) / 100)),
            fireMax: Math.floor(baseFireMax * (1 + (synergyBonus + fireMasteryBonus) / 100)),
            attackRating: skill.attackRating[levelIndex] || 0
          };
        }

        // Cold Enchant - use max level from both weapon sets
        let coldEnchantLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('coldenchantcontainer') : 0;
        if (window.weaponSwapSystem) {
          coldEnchantLevel = window.weaponSwapSystem.getMaxBuffLevel('coldEnchant');
        }
        if (coldEnchantLevel > 0) {
          const levelIndex = Math.min(coldEnchantLevel - 1, 59);
          const skill = window.skillSystem.skillData.coldenchantcontainer;
          const baseColdMin = skill.coldDamageMin[levelIndex] || 0;
          const baseColdMax = skill.coldDamageMax[levelIndex] || 0;
          const synergyBonus = typeof window.skillSystem.calculateSynergyBonus === 'function' ? window.skillSystem.calculateSynergyBonus('coldenchantcontainer', 'cold') : 0;

          // Get Cold Mastery bonus
          let coldMasteryBonus = 0;
          const coldMasteryLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('coldmasterycontainer') : 0;
          if (coldMasteryLevel > 0 && window.skillSystem.skillData.coldmasterycontainer && window.skillSystem.skillData.coldmasterycontainer.coldDamage) {
            coldMasteryBonus = window.skillSystem.skillData.coldmasterycontainer.coldDamage[Math.min(coldMasteryLevel - 1, 59)] || 0;
          }

          pkBuffs['cold-enchant'] = {
            level: coldEnchantLevel,
            coldMin: Math.floor(baseColdMin * (1 + (synergyBonus + coldMasteryBonus) / 100)),
            coldMax: Math.floor(baseColdMax * (1 + (synergyBonus + coldMasteryBonus) / 100)),
            attackRating: skill.attackRating[levelIndex] || 0
          };
        }

        // Amplify Damage
        let ampLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('amplifydamagecontainer') : 0;
        if (window.weaponSwapSystem) {
          ampLevel = window.weaponSwapSystem.getMaxBuffLevel('amplifyDamage');
        }
        if (ampLevel > 0) {
          const levelIndex = Math.min(ampLevel - 1, 59);
          const skill = window.skillSystem.skillData.amplifydamagecontainer;
          pkBuffs['amplify-damage'] = {
            level: ampLevel,
            physicalDamage: Math.abs(skill?.enemyPhysicalResist?.[levelIndex] || 20),
            duration: skill?.duration?.[levelIndex] || 20
          };
        }

        // Lower Resist
        let lrLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('lowerresistcontainer') : 0;
        if (window.weaponSwapSystem) {
          lrLevel = window.weaponSwapSystem.getMaxBuffLevel('lowerResist');
        }
        if (lrLevel > 0) {
          const levelIndex = Math.min(lrLevel - 1, 59);
          const skill = window.skillSystem.skillData.lowerresistcontainer;
          pkBuffs['lower-resist'] = {
            level: lrLevel,
            resistReduction: Math.abs(skill?.enemyElementalResist?.[levelIndex] || 31),
            duration: skill?.duration?.[levelIndex] || 40
          };
        }

        // Curse Mastery
        let cmLevel = typeof window.skillSystem.getSkillTotalLevel === 'function' ? window.skillSystem.getSkillTotalLevel('cursemasterycontainer') : 0;
        if (window.weaponSwapSystem) {
          cmLevel = window.weaponSwapSystem.getMaxBuffLevel('curseMastery');
        }
        if (cmLevel > 0) {
          const levelIndex = Math.min(cmLevel - 1, 59);
          const skill = window.skillSystem.skillData.cursemasterycontainer;
          pkBuffs['curse-mastery'] = {
            level: cmLevel,
            maxCurses: skill?.maxCurses?.[levelIndex] || 1
          };
        }

        window.partyManager.updatePlayerBuffs(idx, pkBuffs);
      }

      // Add Fire Enchant damage from party (after buff reporting so we get updated values)
      const partyFireEnchant = window.partyManager?.getBestBuff('fire-enchant');
      if (partyFireEnchant) {
        this.stats.fireDmgMin = (this.stats.fireDmgMin || 0) + partyFireEnchant.fireMin;
        this.stats.fireDmgMax = (this.stats.fireDmgMax || 0) + partyFireEnchant.fireMax;
      }

      // Add Cold Enchant damage from party (after buff reporting so we get updated values)
      const partyColdEnchant = window.partyManager?.getBestBuff('cold-enchant');
      if (partyColdEnchant) {
        this.stats.coldDmgMin = (this.stats.coldDmgMin || 0) + partyColdEnchant.coldMin;
        this.stats.coldDmgMax = (this.stats.coldDmgMax || 0) + partyColdEnchant.coldMax;
      }

      // Re-calculate Final Basic Stats (Life, Mana, etc.) incorporating Skill Bonuses
      if (window.characterManager) {
        window.characterManager.updateTotalStats();
      }
    }
  }

  calculateEquipmentStats(dropdownId, section) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value) return;

    let item = window.dropdownItemCache && window.dropdownItemCache[`${dropdownId}_${dropdown.value}`];
    if (!item) {
      item = window.getItemData ? window.getItemData(dropdown.value) : itemList[dropdown.value];
    }
    if (!item) return;

    const actualLevel = window.SocketUI ? window.SocketUI.calculateActualRequiredLevel(this, section, dropdown.value) : 1;
    const meetsStats = window.SocketUI ? window.SocketUI.doesCharacterMeetStatRequirements(dropdown.value) : true;

    if (this.currentLevel >= actualLevel && meetsStats) {
      if (window.StatParser) {
        window.StatParser.parseItemStats(this, item, section);
      }
    }
  }

  calculateSocketStats() {
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];



    sections.forEach(section => {
      const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);

      sockets.forEach((socket) => {
        const levelReq = parseInt(socket.dataset.levelReq) || 1;
        const stats = socket.dataset.stats;

        if (this.currentLevel >= levelReq && stats && window.StatParser) {
          window.StatParser.parseSocketStats(this, stats, section);
        }
      });
    });


    // Add checkbox bonus ONCE at the end (Anya quest - does NOT apply to curse resistance)
    this.stats.fireResist += window.checkboxResistBonus || 0;
    this.stats.coldResist += window.checkboxResistBonus || 0;
    this.stats.lightResist += window.checkboxResistBonus || 0;
    this.stats.poisonResist += window.checkboxResistBonus || 0;
    // Curse resistance is NOT affected by Anya checkbox bonus

    // Add set bonuses if setTracker is available
    if (window.setTracker) {
      const setBonuses = window.setTracker.getAllSetBonuses();

      // Apply set bonuses to stats
      if (setBonuses.defense) this.stats.defense += setBonuses.defense;
      if (setBonuses.defensePerLevel) {
        // Defense per level needs character level
        const charLevel = this.currentLevel || 1;
        this.stats.defense += setBonuses.defensePerLevel * charLevel;
      }
      if (setBonuses.strength) this.stats.strength += setBonuses.strength;
      if (setBonuses.dexterity) this.stats.dexterity += setBonuses.dexterity;
      if (setBonuses.vitality) this.stats.vitality += setBonuses.vitality;
      if (setBonuses.energy) this.stats.energy += setBonuses.energy;
      if (setBonuses.life) this.stats.life += setBonuses.life;
      if (setBonuses.mana) this.stats.mana += setBonuses.mana;
      if (setBonuses.lightningResist) this.stats.lightResist += setBonuses.lightningResist;
      if (setBonuses.fireResist) this.stats.fireResist += setBonuses.fireResist;
      if (setBonuses.coldResist) this.stats.coldResist += setBonuses.coldResist;
      if (setBonuses.poisonResist) this.stats.poisonResist += setBonuses.poisonResist;
      if (setBonuses.allResist) {
        this.stats.fireResist += setBonuses.allResist;
        this.stats.coldResist += setBonuses.allResist;
        this.stats.lightResist += setBonuses.allResist;
        this.stats.poisonResist += setBonuses.allResist;
      }
      if (setBonuses.fcr) this.stats.fcr += setBonuses.fcr;
      if (setBonuses.ias) this.stats.ias += setBonuses.ias;
      if (setBonuses.fhr) this.stats.fhr += setBonuses.fhr;
      if (setBonuses.frw) this.stats.frw += setBonuses.frw;
      if (setBonuses.allSkills) this.stats.allSkills += setBonuses.allSkills;
      if (setBonuses.magicFind) this.stats.magicFind += setBonuses.magicFind;
      if (setBonuses.manaSteal) this.stats.manaLeech += setBonuses.manaSteal;
      if (setBonuses.lifeSteal) this.stats.lifeLeech += setBonuses.lifeSteal;
      if (setBonuses.dr) this.stats.dr += setBonuses.dr;
      if (setBonuses.regenMana) this.stats.regenMana += setBonuses.regenMana;
      if (setBonuses.regenLife) this.stats.regenLife += setBonuses.regenLife;
      if (setBonuses.firePierce) this.stats.pierceFire = (this.stats.pierceFire || 0) + setBonuses.firePierce;
      if (setBonuses.coldPierce) this.stats.pierceCold = (this.stats.pierceCold || 0) + setBonuses.coldPierce;
      if (setBonuses.lightPierce) this.stats.pierceLightning = (this.stats.pierceLightning || 0) + setBonuses.lightPierce;
      if (setBonuses.poisonPierce) this.stats.piercePoison = (this.stats.piercePoison || 0) + setBonuses.poisonPierce;
      if (setBonuses.classSkills) this.stats.classSkills = (this.stats.classSkills || 0) + setBonuses.classSkills;
      if (setBonuses.toatt) this.stats.toatt += setBonuses.toatt;
      if (setBonuses.toattPerLevel) {
        const charLevel = this.currentLevel || 1;
        this.stats.toatt += setBonuses.toattPerLevel * charLevel;
      }
      if (setBonuses.cbf) this.stats.cbf = true;
      if (setBonuses.individualSkills) {
        Object.entries(setBonuses.individualSkills).forEach(([skillId, value]) => {
          this.stats.individualSkillBonuses[skillId] = (this.stats.individualSkillBonuses[skillId] || 0) + value;
        });
      }
    }
  }

  // Calculate mercenary equipment stats separately from player stats
  calculateMercenaryStats() {
    const mercClass = document.getElementById('mercclass')?.value;
    if (!mercClass || mercClass === 'No Mercenary') return;

    const mercLevel = parseInt(document.getElementById('merclvlValue')?.value) || 1;
    this.isMercenaryParsing = true;

    try {
      Object.entries(this.equipmentMap).forEach(([dropdownId, config]) => {
        if (!config.section.startsWith('merc')) return;

        const dropdown = document.getElementById(dropdownId);
        if (!dropdown || !dropdown.value) return;

        let item = window.dropdownItemCache && window.dropdownItemCache[`${dropdownId}_${dropdown.value}`];
        if (!item) item = window.getItemData ? window.getItemData(dropdown.value) : itemList[dropdown.value];
        if (!item) return;

        const actualLevel = window.SocketUI ? window.SocketUI.calculateActualRequiredLevel(this, config.section, dropdown.value) : 1;
        if (mercLevel >= actualLevel && window.StatParser) {
          window.StatParser.parseItemStats(this, item, config.section);
        }
      });

      // Mercenary Socket Stats
      const mercSections = ['mercweapon', 'merchelm', 'mercarmor', 'mercoff', 'mercgloves', 'mercbelts', 'mercboots'];
      mercSections.forEach(section => {
        const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
        sockets.forEach(socket => {
          const levelReq = parseInt(socket.dataset.levelReq) || 1;
          const stats = socket.dataset.stats;
          if (mercLevel >= levelReq && stats && window.StatParser) {
            window.StatParser.parseSocketStats(this, stats, section);
          }
        });
      });
    } finally {
      this.isMercenaryParsing = false;
    }
  }

  // Legacy parsing methods removed - now using window.StatParser

  parseItemStats(item, section) {
    return window.StatParser.parseItemStats(this, item, section);
  }

  // parseSocketStats(statsText, section) {
  //   if (!statsText) return;

  //   const lines = statsText.split(',');
  //   lines.forEach(line => this.parseStatLine(line.trim()));
  // }

  parseSocketStats(statsText, section) {
    return window.StatParser.parseSocketStats(this, statsText, section);
  }


  parseStatLine(line, hasBaseDefense = false) {
    return window.StatParser.parseStatLine(this, line, hasBaseDefense);
  }

  // Add these methods to your existing socket.js class

  // Enhanced stat parsing with stacking support
  parseStatsToMap(statsText) {
    return window.StatParser.parseStatsToMap(statsText);
  }

  addToStatsMap(statsMap, key, data) {
    return window.StatParser.addToStatsMap(statsMap, key, data);
  }

  mergeStatsMaps(baseStats, socketStats) {
    return window.StatParser.mergeStatsMaps(baseStats, socketStats);
  }

  formatStackedStat(key, data, isCorrupted) {
    return window.StatParser.formatStackedStat(key, data, isCorrupted);
  }

  getStatPattern(key) {
    return window.StatParser.getStatPattern(key);
  }

  // Replace the updateStatsDisplay method with this CRAZY DEBUG version:

  updateStatsDisplay() {
    // Get base character stats
    const charClass = document.getElementById('selectClass')?.value || 'Amazon';
    const baseStr = parseInt(document.getElementById('str')?.value) || 0;
    const baseDex = parseInt(document.getElementById('dex')?.value) || 0;
    const baseVit = parseInt(document.getElementById('vit')?.value) || 0;
    const baseEnr = parseInt(document.getElementById('enr')?.value) || 0;

    // Calculate totals
    const totalStr = baseStr + this.stats.strength;
    const totalDex = baseDex + this.stats.dexterity;
    const totalVit = baseVit + this.stats.vitality;
    const totalEnr = baseEnr + this.stats.energy;

    // Update attribute totals (next to base stats)
    this.updateElement('total-str', totalStr);
    this.updateElement('total-dex', totalDex);
    this.updateElement('total-vit', totalVit);
    this.updateElement('total-enr', totalEnr);

    // Update the actual stat containers with correct IDs from HTML
    this.updateElement('strengthcontainer', this.stats.strength);
    this.updateElement('dexteritycontainer', this.stats.dexterity);
    this.updateElement('vitalitycontainer', this.stats.vitality);
    this.updateElement('energycontainer', this.stats.energy);

    // Resistances - using correct HTML IDs
    const checkboxBonus = (document.querySelectorAll('.checkbox:checked').length * 10);
    this.updateElement('fireresistcontainer', this.stats.fireResist);
    this.updateElement('coldresistcontainer', this.stats.coldResist);
    this.updateElement('lightresistcontainer', this.stats.lightResist);
    this.updateElement('poisonresistcontainer', this.stats.poisonResist);
    this.updateElement('curseresistcontainer', this.stats.curseResist || 0);

    // Speed stats - using correct HTML IDs
    this.updateElement('iascontainer', this.stats.ias);
    this.updateElement('fcrcontainer', this.stats.fcr);
    this.updateElement('frwcontainer', this.stats.frw);
    this.updateElement('fhrcontainer', this.stats.fhr);

    // Combat stats - using correct HTML IDs
    this.updateElement('owcontainer', this.stats.openWounds);

    // Attack Rating calculation
    const classConstant = this.classStats[charClass]?.arConstant || 0;
    const baseAR = (totalDex - 7) * 5 + classConstant;
    const gearAR = this.stats.toatt;
    const arBonus = 1 + (this.stats.toattPercent / 100);
    const totalAR = Math.floor((baseAR + gearAR) * arBonus);
    this.updateElement('attackratingcontainer', totalAR);

    // PD2 Open Wounds damage: Display only if chance > 0
    const finalOWDamage = this.stats.openWounds > 0 ? this.stats.openWoundsDamage : 0;
    this.updateElement('owdmgcontainer', finalOWDamage);
    this.updateElement('cbcontainer', this.stats.crushingBlow);
    this.updateElement('cbdmgcontainer', this.stats.crushingBlow);
    this.updateElement('deadlystrikecontainer', this.stats.deadlyStrike);
    this.updateElement('criticalhitcontainer', this.stats.criticalHit || 0);
    this.updateElement('lifestealcontainer', this.stats.lifeSteal);
    this.updateElement('manastealcontainer', this.stats.manaSteal);
    this.updateElement('damagetodemoncontainer', this.stats.dmgtodemon);
    this.updateElement('damagetoundeadcontainer', this.stats.dmgtoundead);

    // Defensive stats - using correct HTML IDs
    this.updateElement('drcontainer', this.stats.dr);
    this.updateElement('pdrcontainer', this.stats.pdr);
    this.updateElement('mdrcontainer', this.stats.mdr);
    this.updateElement('plrcontainer', this.stats.plr || 0);
    this.updateElement('blockchancecontainer', this.stats.blockChance || 0);

    // Calculate real block chance: min(floor((block1 + Holy Shield bonus) × (Dexterity - 15) / (clvl × 2)), 75)
    let realBlockChance = 0;
    const shieldDropdown = document.getElementById('offs-dropdown');
    const charLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;

    if (shieldDropdown && shieldDropdown.value) {
      const shieldItem = window.getItemData ? window.getItemData(shieldDropdown.value) : itemList[shieldDropdown.value];

      if (shieldItem && shieldItem.properties && shieldItem.properties.block1) {
        // Shield's base block value
        const block1 = shieldItem.properties.block1 || 0;

        // Holy Shield bonus (if available)
        const holyShieldLevel = window.skillSystem?.getSkillTotalLevel?.('holyshieldcontainer') || 0;
        const holyShieldBlockBonus = holyShieldLevel > 0 ? (holyShieldLevel * 15) : 0; // +15% per level

        // Apply D2 block formula: min(floor((block1 + holyShieldBonus) * (totalDex - 15) / (clvl * 2)), 75)
        const dexFactor = Math.max(0, totalDex - 15);
        const levelDivisor = charLevel * 2;

        if (levelDivisor > 0) {
          realBlockChance = Math.min(75, Math.floor((block1 + holyShieldBlockBonus) * dexFactor / levelDivisor));
        }
      }
    }

    this.updateElement('realblockcontainer', realBlockChance);


    // Calculate total defense including dexterity bonus (totalDex / 4)
    const dexDefenseBonus = Math.floor(totalDex / 4);
    let totalDefense = this.stats.defense + dexDefenseBonus;

    // Apply Shout, Iron Skin, and Cloak of Shadows bonuses to the total defense
    const ownShoutBonus = window.skillSystem?.getShoutDefenseBonus?.() || 0;
    const partyShout = window.partyManager?.getBestBuff('shout');
    const shoutBonus = Math.max(ownShoutBonus, partyShout?.defenseBonus || 0);

    const ironSkinBonus = window.skillSystem?.getIronSkinDefenseBonus?.() || 0;
    const cloakBonus = window.skillSystem?.getCloakOfShadowsDefenseBonus?.() || 0;

    const totalDefPercent = shoutBonus + ironSkinBonus + cloakBonus;

    if (totalDefPercent > 0) {
      totalDefense = Math.floor(totalDefense * (1 + totalDefPercent / 100));
    }

    const defenseContainer = document.getElementById('defensecontainer');
    if (defenseContainer) {
      defenseContainer.textContent = totalDefense;
      defenseContainer.style.color = (totalDefPercent > 0) ? '#d0d007ff' : '';
    }

    // Core stats
    const ownBCSkills = window.skillSystem?.getBattleCommandSkills?.() || 0;
    const partyBC = window.partyManager?.getBestBuff('battle-command');
    const partyBCSkills = partyBC ? partyBC.allSkills : 0;
    const bestBC = Math.max(ownBCSkills, partyBCSkills);

    const allSkillsContainer = document.getElementById('allskillscontainer');
    if (allSkillsContainer) {
      allSkillsContainer.textContent = this.stats.allSkills;
      allSkillsContainer.style.color = bestBC > 0 ? '#d0d007ff' : '';
    }

    // Update skill bonus indicators if skill system is available (include both all skills and class skills)
    if (window.skillSystem) {
      window.skillSystem.updateSkillBonuses(this.stats.allSkills, this.stats.classSkills, this.stats.treeSkills, this.stats.individualSkillBonuses);
    }

    this.updateElement('magicfindcontainer', this.stats.magicFind);
    this.updateElement('goldfindcontainer', this.stats.goldFind);

    // Boolean stats
    this.updateElement('cbfcontainer', this.stats.cbf ? 'Yes' : 'No');

    // Damage ranges - Apply skill damage % bonuses to flat elemental damage
    // This makes flat damage from items/gems/jewels benefit from Fire/Cold/Lightning Mastery
    const fireSkillDmgBonus = this.stats.fireSkillDamage || 0;
    const coldSkillDmgBonus = this.stats.coldSkillDamage || 0;
    const lightningSkillDmgBonus = this.stats.lightningSkillDamage || 0;
    const poisonSkillDmgBonus = this.stats.poisonSkillDamage || 0;

    this.updateElement('flatfiremincontainer', Math.floor(this.stats.fireDmgMin * (1 + fireSkillDmgBonus / 100)));
    this.updateElement('flatfiremaxcontainer', Math.floor(this.stats.fireDmgMax * (1 + fireSkillDmgBonus / 100)));
    this.updateElement('flatcoldmincontainer', Math.floor(this.stats.coldDmgMin * (1 + coldSkillDmgBonus / 100)));
    this.updateElement('flatcoldmaxcontainer', Math.floor(this.stats.coldDmgMax * (1 + coldSkillDmgBonus / 100)));
    this.updateElement('flatlightmincontainer', Math.floor(this.stats.lightDmgMin * (1 + lightningSkillDmgBonus / 100)));
    this.updateElement('flatlightmaxcontainer', Math.floor(this.stats.lightDmgMax * (1 + lightningSkillDmgBonus / 100)));
    this.updateElement('flatpoisonmincontainer', Math.floor(this.stats.poisonDmgMin * (1 + poisonSkillDmgBonus / 100)));
    this.updateElement('flatpoisonmaxcontainer', Math.floor(this.stats.poisonDmgMax * (1 + poisonSkillDmgBonus / 100)));

    // Physical damage bonuses (for skill tooltips)
    this.updateElement('tomindmgcontainer', this.stats.toMinDmg);
    this.updateElement('tomaxdmgcontainer', this.stats.toMaxDmg);

    this.updateElement('fireskilldmgcontainer', this.stats.fireSkillDamage);
    this.updateElement('coldskilldmgcontainer', this.stats.coldSkillDamage);
    this.updateElement('lightningskilldmgcontainer', this.stats.lightningSkillDamage);
    this.updateElement('poisonskilldmgcontainer', this.stats.poisonSkillDamage);
    this.updateElement('magicskilldmgcontainer', this.stats.magicSkillDamage);

    // Enemy resistance pierce
    this.updateElement('piercefirecontainer', this.stats.pierceFire);
    this.updateElement('piercecoldcontainer', this.stats.pierceCold);
    this.updateElement('piercelightningcontainer', this.stats.pierceLightning);
    this.updateElement('piercepoisoncontainer', this.stats.piercePoison);
    this.updateElement('piercephyscontainer', this.stats.piercePhysical);
    this.updateElement('piercemagiccontainer', this.stats.pierceMagic);

    // Update crit multiplier when stats change (including deadly strike)
    if (typeof window.updateCritDisplay === 'function') {
      window.updateCritDisplay();
    }

    // NOTE: We do NOT call onEquipmentOrSocketChange here because it triggers updateCharmDisplay
    // which calls getCharmBonuses() again, causing double-counting.
    // Charm bonuses are already read by calculateAllStats() above.

    // BUT we DO need to update character stats to show green bonus numbers for str/dex/vit/enr
    if (window.characterManager && typeof window.characterManager.updateTotalStats === 'function') {
      window.characterManager.updateTotalStats();
    }

    // CRITICAL: Update character total stats display (green bonus numbers)
    // This ensures str/dex/vit/enr show correct totals after equipment/corruption changes
    if (window.characterManager && typeof window.characterManager.updateTotalStats === 'function') {
      window.characterManager.updateTotalStats();
    }

    // Recalculate skill damage whenever stats change (including when jewels are inserted)
    if (window.skillSystem && typeof window.skillSystem.calculateSkillDamage === 'function') {
      window.skillSystem.calculateSkillDamage();
    }
  }

  // UI Utility methods moved to SocketUI





  // === STYLES ===
  addStyles() {
    if (document.getElementById('unified-socket-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'unified-socket-styles';
    styles.textContent = `
        /* Socket Container Styles */
        .socket-container {
          margin-top: 10px;
          padding: 10px;
          background: rgba(0,0,0,0.3);
          border: 1px solid #333;
          border-radius: 4px;
        }
        
        .socket-grid {
          display: grid;
          gap: 5px;
          margin-bottom: 10px;
          justify-content: center;
          align-items: center;
        }
        
        .socket-grid.sockets-0 { display: none; }
        
        /* 1 socket - center */
        .socket-grid.sockets-1 { 
          grid-template-columns: 30px;
        }
        
        /* 2 sockets - vertical line */
        .socket-grid.sockets-2 { 
          grid-template-columns: 30px;
          grid-template-rows: repeat(2, 30px);
        }
        
        .socket-grid.sockets-3 {
    grid-template-columns: repeat(2, 25px);
    grid-template-rows: repeat(2, 25px);
    gap: 8px;
  }
  .socket-grid.sockets-3 .socket-slot:nth-child(1) { grid-column: 1; grid-row: 1; }
  .socket-grid.sockets-3 .socket-slot:nth-child(2) { grid-column: 2; grid-row: 1; }
  .socket-grid.sockets-3 .socket-slot:nth-child(3) { grid-column: 1 / span 2; grid-row: 2; justify-self: center; }

  /* 4 sockets - 2x2 square */
  .socket-grid.sockets-4 {
    grid-template-columns: repeat(2, 25px);
    grid-template-rows: repeat(2, 25px);
    gap: 8px;
  }

  .socket-grid.sockets-5 {
    grid-template-columns: repeat(3, 22px);
    grid-template-rows: repeat(3, 22px);
    gap: 4px;
  }
  .socket-grid.sockets-5 .socket-slot:nth-child(1) { grid-column: 1; grid-row: 1; }
  .socket-grid.sockets-5 .socket-slot:nth-child(2) { grid-column: 3; grid-row: 1; }
  .socket-grid.sockets-5 .socket-slot:nth-child(3) { grid-column: 2; grid-row: 2; }
  .socket-grid.sockets-5 .socket-slot:nth-child(4) { grid-column: 1; grid-row: 3; }
  .socket-grid.sockets-5 .socket-slot:nth-child(5) { grid-column: 3; grid-row: 3; }
        
        /* 6 sockets - 2 columns x 3 rows */
        .socket-grid.sockets-6 { 
          grid-template-columns: repeat(2, 30px);
          grid-template-rows: repeat(3, 30px);
        }
        
        .socket-slot {
          width: 30px;
          height: 30px;
          border: 2px solid #666;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .socket-slot.empty:hover {
          border-color: #999;
          background: #111;
        }
        
        .socket-slot.filled {
          border-color: #00ff00;
          background: #001100;
        }
        
        .socket-slot img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }
        
        .add-socket-btn {
          padding: 5px 15px;
          background: #333;
          color: #fff;
          border: 1px solid #666;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          width: 100%;
        }
        
        .add-socket-btn:hover {
          background: #444;
          border-color: #888;
        }
        
        /* Socket Modal */
        .socket-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          z-index: 10000;
          align-items: center;
          justify-content: center;
        }
        
        .socket-modal-content {
          background: #1a1a1a;
          border: 2px solid #444;
          border-radius: 8px;
          padding: 20px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          color: #fff;
        }
        
        .socket-close {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          color: #999;
        }
        
        .socket-close:hover {
          color: #fff;
        }
        
        .socket-tabs {
          display: flex;
          margin: 20px 0;
          border-bottom: 1px solid #444;
        }
        
        .socket-tab {
          background: #333;
          border: none;
          color: #ccc;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 4px 4px 0 0;
          margin-right: 2px;
        }
        
        .socket-tab.active {
          background: #555;
          color: #fff;
        }
        
        .socket-item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .socket-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          background: rgba(14, 11, 11, 0.86);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        
        .socket-item:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.5);
        }
        
        .socket-item img {
          width: 32px;
          height: 32px;
          margin-bottom: 5px;
        }
        
        .socket-item-name {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .socket-item-level {
          font-size: 10px;
          color: #ccc;
        }
        
        .custom-jewel-item {
          border: 2px solid #ffd700;
        }
        
        /* Jewel Creation Styles */
        .jewel-creation-section h4 {
          margin: 15px 0 10px 0;
          color: #ffd700;
        }
        
        .jewel-color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .color-option {
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          transition: all 0.2s;
        }
        
        .color-option.selected {
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
          transform: scale(1.05);
        }
        
        .jewel-creation-section select {
          width: 100%;
          background: #333;
          color: #fff;
          border: 1px solid #666;
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .jewel-creation-section input[type="range"] {
          width: 100%;
          margin: 10px 0;
        }
        
        .jewel-preview {
          background: #2a2a2a;
          border: 2px solid #666;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
          text-align: center;
          min-height: 60px;
        }
        
        .create-jewel-btn {
          background: #007700;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          width: 100%;
          margin-top: 10px;
        }
        
        .create-jewel-btn:hover {
          background: #009900;
        }
        
        /* Enhanced item descriptions */
        .socket-enhanced-stat {
          color: #8888ff !important;
        }
      `;

    document.head.appendChild(styles);

  }



  createRainbowFacetModal() {

    // Remove existing modal first
    const existingModal = document.getElementById('rainbowFacetModal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'rainbowFacetModal';
    modal.className = 'socket-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="socket-modal-content">
        <span class="socket-close">&times;</span>
        <h3>Create Rainbow Facet</h3>
        
        <div class="jewel-creation-section">
          <h4>Choose Element Type:</h4>
          <div class="element-selection" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
            <div class="element-option" data-element="fire" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">🔥</div>
              <div style="color: #ff4500;">Fire</div>
            </div>
            <div class="element-option" data-element="cold" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">❄️</div>
              <div style="color: #4169e1;">Cold</div>
            </div>
            <div class="element-option" data-element="lightning" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">⚡</div>
              <div style="color: #ffd700;">Lightning</div>
            </div>
            <div class="element-option" data-element="poison" style="padding: 15px; border: 2px solid #333; border-radius: 8px; cursor: pointer; text-align: center;">
              <div style="font-size: 32px;">☠️</div>
              <div style="color: #32cd32;">Poison</div>
            </div>
          </div>
          
          <div id="facetPreview" class="jewel-preview">Select an element type</div>
          
          <div style="margin-top: 20px;">
            <button id="createRainbowFacetBtn" style="
              background-color: #666; 
              color: white; 
              border: none; 
              padding: 15px 30px; 
              border-radius: 6px; 
              font-size: 16px; 
              width: 100%; 
              cursor: not-allowed;
              pointer-events: none;
            ">
              Select an element first
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.socket-close');
    if (closeBtn) closeBtn.onclick = () => modal.remove();

    const elementOptions = modal.querySelectorAll('.element-option');
    elementOptions.forEach(opt => {
      opt.onclick = () => {
        elementOptions.forEach(o => o.style.borderColor = '#333');
        opt.style.borderColor = '#ffd700';
        const element = opt.dataset.element;
        this.updateFacetPreview(element);
      };
    });
  }

  updateFacetPreview(element) {
    const preview = document.getElementById('facetPreview');
    const btn = document.getElementById('createRainbowFacetBtn');
    if (!preview || !btn) return;

    const stats = this.getFacetStats(element);
    preview.innerHTML = `<div style="color: #ffd700; font-weight: bold;">Rainbow Facet (Jewel)</div><div style="color: #8888ff;">${stats}</div>`;
    
    btn.style.backgroundColor = '#006400';
    btn.style.cursor = 'pointer';
    btn.style.pointerEvents = 'auto';
    btn.textContent = 'Create Facet';
    btn.onclick = () => {
      if (window.SocketUI) {
        // Add jewel to current socket
        const item = {
          name: 'Rainbow Facet',
          img: 'img/jewel_unique.png',
          levelReq: 49,
          stats: stats
        };
        
        if (this.currentSocket) {
             const slot = this.currentSocket;
             slot.className = 'socket-slot filled';
             slot.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
             slot.dataset.itemKey = 'rainbowfacet_' + element;
             slot.dataset.category = 'jewels';
             slot.dataset.itemName = item.name;
             slot.dataset.levelReq = item.levelReq;
             const section = slot.closest('.socket-container')?.dataset.section || 'weapon';
             slot.dataset.stats = stats;
             
             this.hideSocketModal();
             document.getElementById('rainbowFacetModal')?.remove();
             this.updateAll();
        } else {
            alert('No active socket slot selected!');
        }
      }
    };
  }

  getFacetStats(element) {
    const p = { fire: 'Fire', cold: 'Cold', lightning: 'Lightning', poison: 'Poison' }[element];
    return `+100% to ${p} Skill Damage<br>-100% to Enemy ${p} Resistance`;
  }

  showSocketModal() {
    if (window.SocketUI) {
      window.SocketUI.createSocketModal(this);
      const modal = document.getElementById('socketModal');
      if (modal) modal.style.display = 'flex';
    }
  }

  hideSocketModal() {
    const modal = document.getElementById('socketModal');
    if (modal) modal.style.display = 'none';
  }

  switchSocketTab(category, btn) {
    document.querySelectorAll('.socket-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderSocketItems(category);
  }

  renderSocketItems(category) {
    const grid = document.getElementById('socketItemGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const items = this.socketData[category];
    if (!items) return;

    Object.entries(items).forEach(([key, item]) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'socket-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="socket-item-name">${item.name}</div>
        <div class="socket-item-level">Lvl: ${item.levelReq}</div>
      `;
      itemEl.onclick = () => {
        if (window.SocketUI) window.SocketUI.selectSocketItem(this, category, key);
      };
      grid.appendChild(itemEl);
    });
  }

  filterSocketItems(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.socket-item').forEach(el => {
      const name = el.querySelector('.socket-item-name')?.textContent.toLowerCase() || '';
      el.style.display = name.includes(q) ? 'flex' : 'none';
    });
  }

  // Core system methods used by others
  getSectionInfoId(section) {
    return window.SocketUI ? window.SocketUI.getSectionInfoId(section) : '';
  }

  getSectionDropdownId(section) {
    return window.SocketUI ? window.SocketUI.getSectionDropdownId(section) : '';
  }

  calculateActualRequiredLevel(section, itemKey) {
    return window.SocketUI ? window.SocketUI.calculateActualRequiredLevel(this, section, itemKey) : 1;
  }

  isItemUsableByCharacterClass(itemKey) {
    return window.SocketUI ? window.SocketUI.isItemUsableByCharacterClass(itemKey) : true;
  }

  doesCharacterMeetStatRequirements(itemKey) {
    return window.SocketUI ? window.SocketUI.doesCharacterMeetStatRequirements(itemKey) : true;
  }

  // Export/Import (keep these for now as they are core to state)
  exportSocketData() {
    const data = {};
    document.querySelectorAll('.socket-container').forEach(c => {
      const section = c.dataset.section;
      if (!section) return;
      data[section] = [];
      c.querySelectorAll('.socket-slot.filled').forEach(s => {
        data[section].push({
          itemKey: s.dataset.itemKey,
          category: s.dataset.category,
          itemName: s.dataset.itemName,
          stats: s.dataset.stats,
          levelReq: s.dataset.levelReq
        });
      });
    });
    return data;
  }

  importSocketData(data) {
    if (!data) return;
    Object.entries(data).forEach(([section, sockets]) => {
      const container = document.querySelector(`.socket-container[data-section="${section}"]`);
      if (!container) return;
      if (window.SocketUI) window.SocketUI.updateSocketVisuals(this, container, sockets.length);
      const slots = container.querySelectorAll('.socket-slot');
      sockets.forEach((sData, i) => {
        if (i < slots.length) {
          const slot = slots[i];
          const item = this.socketData[sData.category]?.[sData.itemKey];
          if (item) {
            slot.className = 'socket-slot filled';
            slot.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
            Object.assign(slot.dataset, sData);
          }
        }
      });
    });
    this.updateAll();
  }
}

document.addEventListener('DOMContentLoaded', function () {

  window.unifiedSocketSystem = new UnifiedSocketSystem();

  // Legacy function for compatibility
  window.validateAllItems = () => {
    if (window.unifiedSocketSystem) {
      window.unifiedSocketSystem.updateAll();
    }
  };
});

// === FALLBACK FOR IMMEDIATE AVAILABILITY ===
window.addSocket = function (section) {


  if (window.unifiedSocketSystem) {
    window.unifiedSocketSystem.addSocket(section);
    return;
  }

  // Simple fallback if system not ready yet
  const container = document.querySelector(`.socket-container[data-section="${section}"]`);
  if (!container) {
    return;
  }

  const socketGrid = container.querySelector('.socket-grid');
  if (!socketGrid) {
    return;
  }

  const existingSockets = socketGrid.children.length;
  const maxSockets = 6;

  if (existingSockets >= maxSockets) {
    alert(`Maximum ${maxSockets} sockets allowed`);
    return;
  }

  const newSocket = document.createElement('div');
  newSocket.className = 'socket-slot empty';
  newSocket.dataset.index = existingSockets.toString();

  socketGrid.appendChild(newSocket);

  const newSocketCount = existingSockets + 1;
  socketGrid.className = `socket-grid sockets-${newSocketCount}`;


};

