// character-data.js - Enhanced Load/Export logic
// Handles full character state including items, charms, skills, sockets and corruptions.

window.exportCharacterData = function () {
    const level = parseInt(document.getElementById('lvlValue')?.value) || 1;
    const characterClass = document.getElementById('selectClass')?.value || 'Amazon';
    const str = parseInt(document.getElementById('str')?.value) || 0;
    const dex = parseInt(document.getElementById('dex')?.value) || 0;
    const vit = parseInt(document.getElementById('vit')?.value) || 0;
    const enr = parseInt(document.getElementById('enr')?.value) || 0;
    const mode = document.querySelector('.modedropdown')?.value || 'pvm';

    const anyaBonuses = {
        n: document.querySelector('input[value="anya-n"]')?.checked || false,
        nm: document.querySelector('input[value="anya-nm"]')?.checked || false,
        h: document.querySelector('input[value="anya-h"]')?.checked || false
    };

    const mercClass = document.getElementById('mercclass')?.value || 'No Mercenary';
    const mercLevel = parseInt(document.getElementById('merclvlValue')?.value) || 1;

    const equipmentMap = {
        weapon: 'weapons-dropdown', helm: 'helms-dropdown', armor: 'armors-dropdown', shield: 'offs-dropdown',
        gloves: 'gloves-dropdown', belt: 'belts-dropdown', boots: 'boots-dropdown',
        ring1: 'ringsone-dropdown', ring2: 'ringstwo-dropdown', amulet: 'amulets-dropdown',
        mercWeapon: 'mercweapons-dropdown', mercHelm: 'merchelms-dropdown', mercArmor: 'mercarmors-dropdown',
        mercShield: 'mercoffs-dropdown', mercGloves: 'mercgloves-dropdown', mercBelt: 'mercbelts-dropdown', mercBoots: 'mercboots-dropdown'
    };

    const equipment = {};
    for (const [slot, id] of Object.entries(equipmentMap)) {
        equipment[slot] = document.getElementById(id)?.value || '';
    }

    const sockets = { data: window.unifiedSocketSystem?.exportSocketData?.() || {} };
    const corruptions = { data: JSON.parse(JSON.stringify(window.itemCorruptions || {})) };

    // Crucial for saving user modifications to variable stats
    const itemStates = JSON.parse(JSON.stringify(window.itemStates || {}));

    const charms = window.charmInventory?.getAllCharms ? window.charmInventory.getAllCharms() : [];

    const skills = {};
    const skillInputs = document.querySelectorAll('.skill-tree-container input[type="number"], .skills-container input[type="number"]');
    skillInputs.forEach(input => {
        const val = parseInt(input.value);
        if (val > 0 && input.id) skills[input.id] = val;
    });

    return {
        timestamp: new Date().toISOString(),
        character: { level, class: characterClass, stats: { str, dex, vit, enr } },
        mode, anya: anyaBonuses,
        mercenary: { class: mercClass, level: mercLevel },
        equipment, sockets, corruptions, itemStates, charms, skills,
        selectedSkill: document.getElementById('active-skill-dropdown')?.value || ''
    };
};

window.loadCharacterFromData = function (data, silent = false) {
    if (!data) return;

    try {
        window._isLoadingCharacterData = true;

        // Check if this is a party build (new format) or single character (old format/shared)
        if (data.isPartyBuild && data.party && Array.isArray(data.party)) {

            if (window.partyManager) {
                // Load all party data
                window.partyManager.partyData = data.party;

                // Set active index (default to 0 if not specified)
                const targetIndex = data.activeIndex || 0;
                window.partyManager.activeIndex = targetIndex;

                // Update UI to show correct active button
                window.partyManager.updateUI();

                // Load the active player's data
                const activePlayerData = data.party[targetIndex];
                if (activePlayerData) {
                    loadSingleCharacter(activePlayerData, silent);
                } else {
                    // No data for this slot, reset to default
                    window.partyManager.resetToDefault();
                }
            } else {
                console.warn('PartyManager not available, loading first character only');
                loadSingleCharacter(data.party[0] || {}, silent);
            }
        } else {
            // Loading a single character (old format or shared link)
            // This loads into the currently active slot
            loadSingleCharacter(data, silent);

            // If partyManager exists, update its current slot
            if (window.partyManager) {
                window.partyManager.saveCurrentSlot();
            }
        }

        window._isLoadingCharacterData = false;

        if (!silent && window.notificationSystem) {
            window.notificationSystem.success('Build Loaded', 'Character build successfully imported.');
        }
    } catch (e) {
        console.error('Load error:', e);
        window._isLoadingCharacterData = false;
        if (window.notificationSystem) {
            window.notificationSystem.error('Load Failed', 'Error importing build.');
        }
    }
};

// Helper function to load a single character's data into the current UI
function loadSingleCharacter(data, silent = false) {
    if (!data || !data.character) return;
    try {
        window._isLoadingCharacterData = true;

        // 1. CLEAR EVERYTHING - Ensure clean slate
        if (window.unifiedSocketSystem?.clearAll) window.unifiedSocketSystem.clearAll();
        if (window.charmInventory?.clearAll) window.charmInventory.clearAll();
        if (window.clearAllItemStates) window.clearAllItemStates();

        // 2. Set Basic Info
        const classSelect = document.getElementById('selectClass');
        if (classSelect) {
            classSelect.value = data.character.class || 'Amazon';
            // Trigger class change logic (resets trees etc)
            classSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const lvlInput = document.getElementById('lvlValue');
        if (lvlInput) {
            lvlInput.value = data.character.level || 1;
            // CRITICAL: Also update the socket system's currentLevel so level checks work
            if (window.unifiedSocketSystem) {
                window.unifiedSocketSystem.currentLevel = parseInt(lvlInput.value) || 1;
            }
            // CRITICAL: Trigger input event so skill system updates
            lvlInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 3. Set Stats
        const statsMap = { str: 'str', dex: 'dex', vit: 'vit', enr: 'enr' };
        for (const [key, id] of Object.entries(statsMap)) {
            const input = document.getElementById(id);
            if (input) input.value = data.character.stats[key] || 0;
        }

        // 4. Set Anya & Mode
        if (data.anya) {
            if (document.querySelector('input[value="anya-n"]')) document.querySelector('input[value="anya-n"]').checked = !!data.anya.n;
            if (document.querySelector('input[value="anya-nm"]')) document.querySelector('input[value="anya-nm"]').checked = !!data.anya.nm;
            if (document.querySelector('input[value="anya-h"]')) document.querySelector('input[value="anya-h"]').checked = !!data.anya.h;
        }
        const modeDropdown = document.querySelector('.modedropdown');
        if (modeDropdown && data.mode) modeDropdown.value = data.mode;

        // 5. CRITICAL: Clear item cache FIRST to prevent double-application of corruptions
        // Do NOT clear corruptedProperties as it's needed for styling
        if (window.dropdownItemCache) {
            window.dropdownItemCache = {};
        }

        // 6. Restore Item States (corruptions, sockets, variable stats) -> do this BEFORE loading items
        if (data.itemStates) {
            window.itemStates = JSON.parse(JSON.stringify(data.itemStates));

            // CRITICAL FIX: Also populate main.js internal trackers to prevent reset to max stats
            if (!window.itemBaseProperties) window.itemBaseProperties = {};
            if (!window.originalItemProperties) window.originalItemProperties = {};

            for (const [key, state] of Object.entries(data.itemStates)) {
                // key is dropdownId_itemName
                // CRITICAL FIX: Use originalProperties (uncorrupted) if available
                // This prevents double-stacking when main.js re-applies corruption
                if (state.originalProperties) {
                    window.itemBaseProperties[key] = JSON.parse(JSON.stringify(state.originalProperties));
                } else if (state.properties) {
                    window.itemBaseProperties[key] = JSON.parse(JSON.stringify(state.properties));
                }

                // Get item name from key (everything after the first underscore)
                const firstUnderscore = key.indexOf('_');
                const itemName = firstUnderscore !== -1 ? key.substring(firstUnderscore + 1) : key;

                if (state.originalProperties) {
                    window.originalItemProperties[itemName] = JSON.parse(JSON.stringify(state.originalProperties));
                }
            }
        }
        if (data.corruptions?.data) {
            window.itemCorruptions = JSON.parse(JSON.stringify(data.corruptions.data));
        }

        // 7. Set Equipment
        const equipmentMap = {
            weapon: 'weapons-dropdown', helm: 'helms-dropdown', armor: 'armors-dropdown', shield: 'offs-dropdown',
            gloves: 'gloves-dropdown', belt: 'belts-dropdown', boots: 'boots-dropdown',
            ring1: 'ringsone-dropdown', ring2: 'ringstwo-dropdown', amulet: 'amulets-dropdown',
            mercWeapon: 'mercweapons-dropdown', mercHelm: 'merchelms-dropdown', mercArmor: 'mercarmors-dropdown',
            mercShield: 'mercoffs-dropdown', mercGloves: 'mercgloves-dropdown', mercBelt: 'mercbelts-dropdown', mercBoots: 'mercboots-dropdown'
        };

        for (const [slot, id] of Object.entries(equipmentMap)) {
            const dropdown = document.getElementById(id);
            if (dropdown && data.equipment[slot]) {
                dropdown.value = data.equipment[slot];
                dropdown.dataset.previousValue = data.equipment[slot];
                // Use the restore logic from itemState.js if available
                if (window.restoreItemState) {
                    window.restoreItemState(id, data.equipment[slot], slot.replace('merc', '').toLowerCase());
                }
                // Trigger change event to sync UI in main.js
                dropdown.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }



        // NOTE: We don't call updateAllItemDisplays here - we'll do it in the setTimeout
        // after charms are loaded to ensure everything is ready

        // 7. Load Charms (this will trigger onCharmChange internally)
        if (data.charms && window.charmInventory?.restoreAllCharms) {
            window.charmInventory.restoreAllCharms(data.charms);
            // NOTE: restoreAllCharms now calls onCharmChange internally, no need to call it again
        }

        // 7b. Load Sockets
        if (data.sockets && data.sockets.data && window.unifiedSocketSystem?.importSocketData) {
            window.unifiedSocketSystem.importSocketData(data.sockets.data);
        }

        // 8. Load Skills - DELAYED to ensure skill tree is rendered
        // Skills are loaded in the setTimeout below after everything else is ready

        // 9. Recalculate everything AFTER charms are loaded
        // Small delay to ensure DOM updates from equipment/charm loading are complete
        setTimeout(() => {
            // IMPORTANT: Calculate equipment/charm stats FIRST, then character stats
            // This ensures stat point calculations have correct equipment bonuses
            if (window.unifiedSocketSystem) {
                window.unifiedSocketSystem.updateAllItemDisplays(); // Refresh item displays
                window.unifiedSocketSystem.calculateAllStats();      // Calculate equipment + charm stats
                window.unifiedSocketSystem.updateStatsDisplay();     // Update stat displays
            }

            // Load Skills - NOW that skill tree is rendered
            // Use retry logic to handle prerequisite dependencies
            if (data.skills) {
                const maxRetries = 3;
                let remainingSkills = { ...data.skills };

                for (let retry = 0; retry < maxRetries && Object.keys(remainingSkills).length > 0; retry++) {
                    const failedSkills = {};

                    for (const [skillId, value] of Object.entries(remainingSkills)) {
                        const input = document.getElementById(skillId);
                        if (input) {
                            const oldValue = input.value;
                            input.value = value;
                            input.dispatchEvent(new Event('input', { bubbles: true }));

                            // Check if skill was actually set (might fail due to prerequisites)
                            if (parseInt(input.value) !== parseInt(value)) {
                                failedSkills[skillId] = value;
                            }
                        }
                    }

                    remainingSkills = failedSkills;
                }
            }

            // Skill selection
            if (data.selectedSkill && document.getElementById('active-skill-dropdown')) {
                document.getElementById('active-skill-dropdown').value = data.selectedSkill;
                document.getElementById('active-skill-dropdown').dispatchEvent(new Event('change', { bubbles: true }));
            }

            window._isLoadingCharacterData = false;
        }, 10);
    } catch (e) {
        console.error('Load error in loadSingleCharacter:', e);
        window._isLoadingCharacterData = false;
        throw e; // Re-throw to be caught by parent function
    }
};
