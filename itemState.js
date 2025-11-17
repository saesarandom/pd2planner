/**
 * Item State Management System
 *
 * Provides a unified approach to managing item states across:
 * - Regular items (static descriptions)
 * - Dynamic items (generated descriptions with input boxes)
 * - Set items (both types)
 * - All modifier types (corruption, sockets, set bonuses, upgrades)
 *
 * Core principle: Base properties are NEVER modified.
 * All modifications are stored separately and computed on-demand.
 */

// Global item state storage
window.itemState = window.itemState || {};

/**
 * Deep clone an object to prevent reference issues
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Array) return obj.map(item => deepClone(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Initialize item state for a slot
 */
function initializeItemState(slotId, itemName) {
  const item = window.getItemData(itemName);
  if (!item) return null;

  window.itemState[slotId] = {
    itemName: itemName,
    baseProperties: deepClone(item.properties || {}),
    originalDescription: item.description || null,
    modifiers: {
      corruption: null,
      sockets: [],
      setBonus: null,
      upgrade: null
    },
    computedProperties: null
  };

  // Initial computation
  return computeFinalProperties(slotId);
}

/**
 * Get base (unmodified) properties for an item
 */
function getBaseProperties(slotId) {
  if (!window.itemState[slotId]) return null;
  return deepClone(window.itemState[slotId].baseProperties);
}

/**
 * Get all modifiers for a slot
 */
function getModifiers(slotId) {
  if (!window.itemState[slotId]) return null;
  return window.itemState[slotId].modifiers;
}

/**
 * Apply a single stat modifier to properties
 * @param {object} props - Properties object to modify
 * @param {object} stat - {type, value, subtype} stat to apply
 */
function applyStatModifier(props, stat) {
  switch (stat.type) {
    case 'ias':
      props.ias = (props.ias || 0) + stat.value;
      break;
    case 'fcr':
      props.fcr = (props.fcr || 0) + stat.value;
      break;
    case 'fhr':
      props.fhr = (props.fhr || 0) + stat.value;
      break;
    case 'frw':
      props.frw = (props.frw || 0) + stat.value;
      break;
    case 'fbr':
      props.fbr = (props.fbr || 0) + stat.value;
      break;
    case 'block':
      props.block = (props.block || 0) + stat.value;
      break;
    case 'str':
      props.str = (props.str || 0) + stat.value;
      break;
    case 'dex':
      props.dex = (props.dex || 0) + stat.value;
      break;
    case 'vit':
      props.vit = (props.vit || 0) + stat.value;
      break;
    case 'enr':
      props.enr = (props.enr || 0) + stat.value;
      break;
    case 'allattributes':
      props.str = (props.str || 0) + stat.value;
      props.dex = (props.dex || 0) + stat.value;
      props.vit = (props.vit || 0) + stat.value;
      props.enr = (props.enr || 0) + stat.value;
      break;
    case 'life':
      // Handle both 'tolife' and 'life' properties
      if ('tolife' in props) {
        props.tolife = (props.tolife || 0) + stat.value;
      } else {
        props.life = (props.life || 0) + stat.value;
      }
      break;
    case 'mana':
      // Handle both 'tomana' and 'mana' properties
      if ('tomana' in props) {
        props.tomana = (props.tomana || 0) + stat.value;
      } else {
        props.mana = (props.mana || 0) + stat.value;
      }
      break;
    case 'ar':
      props.tohitrating = (props.tohitrating || 0) + stat.value;
      break;
    case 'edmg':
      // Enhanced damage - add to edmg property
      // For dynamic items with variable edmg, update the current value
      if (typeof props.edmg === 'object' && 'current' in props.edmg) {
        props.edmg.current = (props.edmg.current || props.edmg.min || 0) + stat.value;
      } else {
        props.edmg = (props.edmg || 0) + stat.value;
      }
      break;
    case 'edef':
      // Enhanced defense - add to edef property
      if (typeof props.edef === 'object' && 'current' in props.edef) {
        props.edef.current = (props.edef.current || props.edef.min || 0) + stat.value;
      } else {
        props.edef = (props.edef || 0) + stat.value;
      }
      break;
    case 'allskills':
      props.allsk = (props.allsk || 0) + stat.value;
      break;
    case 'resist':
      // Fire, Cold, Lightning, Poison resist
      const resistProp = stat.subtype + 'res';
      props[resistProp] = (props[resistProp] || 0) + stat.value;
      break;
    case 'maxres':
      // Maximum resistances
      const maxResProp = 'max' + stat.subtype + 'res';
      props[maxResProp] = (props[maxResProp] || 0) + stat.value;
      break;
    case 'allres':
      props.fireres = (props.fireres || 0) + stat.value;
      props.coldres = (props.coldres || 0) + stat.value;
      props.lightres = (props.lightres || 0) + stat.value;
      props.poisonres = (props.poisonres || 0) + stat.value;
      break;
    case 'pdr':
      props.pdr = (props.pdr || 0) + stat.value;
      break;
    case 'mdr':
      props.mdr = (props.mdr || 0) + stat.value;
      break;
    case 'cb':
      props.cb = (props.cb || 0) + stat.value;
      break;
    // Add more stat types as needed
  }
}

/**
 * Compute final properties by applying all modifiers to base properties
 * @param {string} slotId - The slot identifier (e.g., "helm-dropdown")
 * @returns {object} - Computed properties
 */
function computeFinalProperties(slotId) {
  const state = window.itemState[slotId];
  if (!state) return null;

  // Start with a deep clone of base properties
  const finalProps = deepClone(state.baseProperties);

  // Apply modifiers in order: corruption -> sockets -> set bonus -> upgrade
  const mods = state.modifiers;

  // 1. Apply corruption
  if (mods.corruption && mods.corruption.stats) {
    mods.corruption.stats.forEach(stat => applyStatModifier(finalProps, stat));
  }

  // 2. Apply socket bonuses
  if (mods.sockets && mods.sockets.length > 0) {
    mods.sockets.forEach(socket => {
      if (socket.stats && socket.stats.length > 0) {
        socket.stats.forEach(stat => applyStatModifier(finalProps, stat));
      }
    });
  }

  // 3. Apply set bonus
  if (mods.setBonus && mods.setBonus.stats) {
    mods.setBonus.stats.forEach(stat => applyStatModifier(finalProps, stat));
  }

  // 4. Apply upgrade bonuses
  if (mods.upgrade && mods.upgrade.stats) {
    mods.upgrade.stats.forEach(stat => applyStatModifier(finalProps, stat));
  }

  // Cache and return
  state.computedProperties = finalProps;
  return finalProps;
}

/**
 * Set corruption modifier for a slot
 * @param {string} slotId - The slot identifier
 * @param {string} corruptionText - The corruption text to display
 * @param {Array} corruptionStats - Parsed stats from corruption [{type, value, subtype}]
 */
function setCorruptionModifier(slotId, corruptionText, corruptionStats) {
  if (!window.itemState[slotId]) return;

  window.itemState[slotId].modifiers.corruption = {
    text: corruptionText,
    stats: corruptionStats
  };

  // Recompute properties
  computeFinalProperties(slotId);
}

/**
 * Clear corruption modifier for a slot
 */
function clearCorruptionModifier(slotId) {
  if (!window.itemState[slotId]) return;
  window.itemState[slotId].modifiers.corruption = null;
  computeFinalProperties(slotId);
}

/**
 * Add socket modifier
 */
function addSocketModifier(slotId, socketItemName, socketStats) {
  if (!window.itemState[slotId]) return;

  window.itemState[slotId].modifiers.sockets.push({
    itemName: socketItemName,
    stats: socketStats
  });

  computeFinalProperties(slotId);
}

/**
 * Clear all socket modifiers
 */
function clearSocketModifiers(slotId) {
  if (!window.itemState[slotId]) return;
  window.itemState[slotId].modifiers.sockets = [];
  computeFinalProperties(slotId);
}

/**
 * Get computed (final) properties for a slot
 */
function getComputedProperties(slotId) {
  if (!window.itemState[slotId]) return null;

  // Return cached computed properties, or compute if not cached
  if (!window.itemState[slotId].computedProperties) {
    return computeFinalProperties(slotId);
  }

  return window.itemState[slotId].computedProperties;
}

/**
 * Check if a slot has item state initialized
 */
function hasItemState(slotId) {
  return window.itemState[slotId] !== undefined;
}

/**
 * Clear all item state for a slot (when item is unequipped)
 */
function clearItemState(slotId) {
  delete window.itemState[slotId];
}

// Export functions to global scope
window.itemStateManager = {
  initializeItemState,
  getBaseProperties,
  getModifiers,
  getComputedProperties,
  computeFinalProperties,
  setCorruptionModifier,
  clearCorruptionModifier,
  addSocketModifier,
  clearSocketModifiers,
  hasItemState,
  clearItemState,
  applyStatModifier  // Expose for external use if needed
};
