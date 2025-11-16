// Simple in-memory item state storage
// Remembers item modifications (corruption, sockets, ethereal, variable stats)
// Only clears when requirements not met

// Global storage for item states
window.itemStates = {};

// Save current item state before switching
window.saveItemState = function(dropdownId, itemName, section) {
  if (!itemName) return;

  const stateKey = `${dropdownId}_${itemName}`;
  const item = window.getItemData(itemName);
  if (!item) return;

  // Get socket data
  const socketData = [];
  const socketSlots = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
  socketSlots.forEach((slot, index) => {
    socketData.push({
      itemName: slot.dataset.itemName,
      stats: slot.dataset.stats,
      levelReq: slot.dataset.levelReq,
      index: index
    });
  });

  // Save complete state
  window.itemStates[stateKey] = {
    corruption: window.itemCorruptions ? window.itemCorruptions[dropdownId] : null,
    sockets: socketData,
    socketCount: socketSlots.length,
    ethereal: item.properties?.ethereal || false,
    properties: item.properties ? JSON.parse(JSON.stringify(item.properties)) : null
  };

  console.log('Saved state for', itemName, window.itemStates[stateKey]);
};

// Restore item state after switching
window.restoreItemState = function(dropdownId, itemName, section) {
  if (!itemName) return;

  const stateKey = `${dropdownId}_${itemName}`;
  const savedState = window.itemStates[stateKey];

  if (!savedState) {
    console.log('No saved state for', itemName);
    return;
  }

  console.log('Restoring state for', itemName, savedState);

  const item = window.getItemData(itemName);
  if (!item) return;

  // Restore properties (including ethereal and variable stats)
  if (savedState.properties) {
    item.properties = JSON.parse(JSON.stringify(savedState.properties));
  }

  // Restore corruption
  if (savedState.corruption && window.itemCorruptions) {
    window.itemCorruptions[dropdownId] = savedState.corruption;

    // Reapply corruption to properties
    if (savedState.corruption.text && typeof applyCorruptionToProperties === 'function') {
      applyCorruptionToProperties(itemName, savedState.corruption.text);
    }
  }

  // Don't call updateAll() here - we'll call it after sockets are restored (or let socket.js handle it)

  // Update ethereal button state based on restored ethereal flag
  const category = section; // helm, armor, weapon, shield, etc.
  const etherealBtn = document.querySelector(`button[onclick*="makeEtherealItem('${category}')"]`);
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
  const hasSockets = savedState.sockets && savedState.sockets.length > 0;

  if (hasSockets && window.unifiedSocketSystem) {
    // Set socket count first
    if (savedState.socketCount) {
      window.unifiedSocketSystem.setSocketCount(section, savedState.socketCount);
    }

    // Restore socket items at the very end after all other updates complete
    setTimeout(() => {
      savedState.sockets.forEach(socketInfo => {
        const socketSlot = document.querySelector(
          `.socket-container[data-section="${section}"] .socket-slot:nth-child(${socketInfo.index + 1})`
        );

        if (socketSlot) {
          socketSlot.classList.add('filled');
          socketSlot.dataset.itemName = socketInfo.itemName;
          socketSlot.dataset.stats = socketInfo.stats;
          socketSlot.dataset.levelReq = socketInfo.levelReq;

          // Add image - load at the very end
          socketSlot.innerHTML = `<img src="images/${socketInfo.itemName}.jpg" alt="${socketInfo.itemName}">`;
        }
      });

      // CRITICAL: Call updateAll() AFTER sockets are restored to merge their stats into description
      if (window.unifiedSocketSystem.updateAll) {
        window.unifiedSocketSystem.updateAll();
      }
    }, 100);
  } else {
    // No sockets to restore - call updateAll() immediately to update ethereal/corruption
    if (window.unifiedSocketSystem && window.unifiedSocketSystem.updateAll) {
      window.unifiedSocketSystem.updateAll();
    }
  }
};

// Clear item state if requirements not met
window.clearItemStateIfRequirementsNotMet = function(dropdownId, itemName) {
  if (!itemName) return;

  const item = window.getItemData(itemName);
  if (!item || !item.properties) return;

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
    console.log('Cleared state for', itemName, '(requirements not met)');
    return true;
  }

  return false;
};
