// Simple in-memory item state storage
// Remembers item modifications (corruption, sockets, ethereal, variable stats)
// Only clears when requirements not met

// Global storage for item states
window.itemStates = {};

// Refresh saved state for current item (call after any modification)
window.refreshSavedState = function (dropdownId, section) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  const itemName = dropdown.value;
  if (!itemName) return;

  const item = window.getItemData(itemName);
  if (!item) return;

  const stateKey = `${dropdownId}_${itemName}`;

  // Get socket data
  const socketData = [];
  const socketSlots = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
  socketSlots.forEach((slot, index) => {
    const imgElement = slot.querySelector('img');
    socketData.push({
      itemName: slot.dataset.itemName,
      stats: slot.dataset.stats,
      levelReq: slot.dataset.levelReq,
      imgSrc: imgElement ? imgElement.src : null,
      index: index
    });
  });

  // Save complete current state - ethereal is always last/most current
  window.itemStates[stateKey] = {
    corruption: window.itemCorruptions ? window.itemCorruptions[dropdownId] : null,
    sockets: socketData,
    ethereal: item.properties?.ethereal || false,
    properties: item.properties ? JSON.parse(JSON.stringify(item.properties)) : null
  };
};

// Save current item state before switching (just calls refresh)
window.saveItemState = function (dropdownId, itemName, section) {
  if (!itemName) return;
  window.refreshSavedState(dropdownId, section);
};

// Restore item state after switching
window.restoreItemState = function (dropdownId, itemName, section) {
  if (!itemName) return;

  const stateKey = `${dropdownId}_${itemName}`;
  const savedState = window.itemStates[stateKey];
  if (!savedState) return;

  const item = window.getItemData(itemName);
  if (!item) return;

  // Restore properties (including ethereal and variable stats)
  if (savedState.properties) {
    item.properties = JSON.parse(JSON.stringify(savedState.properties));
  }

  // Restore corruption
  if (savedState.corruption && window.itemCorruptions) {
    // CRITICAL FIX: Only restore if corruption matches this item
    if (savedState.corruption.itemName === itemName) {
      window.itemCorruptions[dropdownId] = savedState.corruption;
      if (savedState.corruption.text && typeof applyCorruptionToProperties === 'function') {
        applyCorruptionToProperties(itemName, savedState.corruption.text);
      }
    }
  }

  // Update ethereal button state
  const etherealBtn = document.querySelector(`button[onclick*="makeEtherealItem('${section}')"]`);
  if (etherealBtn) {
    const isEthereal = savedState.ethereal || (savedState.properties && savedState.properties.ethereal);
    if (isEthereal) {
      etherealBtn.classList.add('active');
      etherealBtn.textContent = 'Remove Ethereal';
    } else {
      etherealBtn.classList.remove('active');
      etherealBtn.textContent = 'Make Ethereal';
    }
  }

  // Restore sockets
  if (savedState.sockets && savedState.sockets.length > 0) {
    savedState.sockets.forEach(socketInfo => {
      const socketSlot = document.querySelector(
        `.socket-container[data-section="${section}"] .socket-slot:nth-child(${socketInfo.index + 1})`
      );

      if (socketSlot && socketInfo.imgSrc) {
        socketSlot.classList.remove('empty');
        socketSlot.classList.add('filled');
        socketSlot.dataset.itemName = socketInfo.itemName;
        socketSlot.dataset.stats = socketInfo.stats;
        socketSlot.dataset.levelReq = socketInfo.levelReq;
        socketSlot.innerHTML = `<img src="${socketInfo.imgSrc}" alt="${socketInfo.itemName}">`;
      }
    });
  }

  // Update display to show restored state
  if (window.unifiedSocketSystem && window.unifiedSocketSystem.updateAll) {
    window.unifiedSocketSystem.updateAll();
  }
};

// Clear item state if requirements not met
window.clearItemStateIfRequirementsNotMet = function (dropdownId, itemName) {
  if (!itemName) return false;

  const item = window.getItemData(itemName);
  if (!item || !item.properties) return false;

  const charLevel = window.unifiedSocketSystem?.currentLevel || 1;
  const charStr = parseInt(document.getElementById('str')?.value) || 0;
  const charDex = parseInt(document.getElementById('dex')?.value) || 0;

  const reqLevel = item.properties.reqlvl || 0;
  const reqStr = item.properties.reqstr || 0;
  const reqDex = item.properties.reqdex || 0;

  // Clear state if requirements not met
  if (charLevel < reqLevel || charStr < reqStr || charDex < reqDex) {
    const stateKey = `${dropdownId}_${itemName}`;
    delete window.itemStates[stateKey];
    return true;
  }

  return false;
};
