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
        mercShield: 'mercoffs-dropdown', mercGloves: 'mercgloves-dropdown', mercBelt: 'mercbelt-dropdown', mercBoots: 'mercboots-dropdown'
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

        // 5. Restore Item States (corruptions, sockets, variable stats) -> do this BEFORE loading items
        if (data.itemStates) {
            window.itemStates = JSON.parse(JSON.stringify(data.itemStates));
        }
        if (data.corruptions?.data) {
            window.itemCorruptions = JSON.parse(JSON.stringify(data.corruptions.data));
        }

        // 6. Set Equipment
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
            }
        }

        // Clear the item cache so calculateAllStats reads fresh item data with restored properties
        if (window.dropdownItemCache) {
            window.dropdownItemCache = {};
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

        // 8. Load Skills
        if (data.skills) {
            for (const [skillId, value] of Object.entries(data.skills)) {
                const input = document.getElementById(skillId);
                if (input) {
                    input.value = value;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }

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

            // Skill selection
            if (data.selectedSkill && document.getElementById('active-skill-dropdown')) {
                document.getElementById('active-skill-dropdown').value = data.selectedSkill;
                document.getElementById('active-skill-dropdown').dispatchEvent(new Event('change', { bubbles: true }));
            }

            window._isLoadingCharacterData = false;
        }, 10);

        if (!silent && window.notificationSystem) window.notificationSystem.success('Build Loaded', 'Character build successfully imported.');
    } catch (e) {
        console.error('Load error:', e);
        window._isLoadingCharacterData = false;
        if (window.notificationSystem) window.notificationSystem.error('Load Failed', 'Error importing build.');
    }
};
