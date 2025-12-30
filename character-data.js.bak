// Character Data Serialization/Deserialization
// Handles exporting and importing character builds

/**
 * Export current character state to a serializable object
 * @returns {Object} Character data object ready for JSON serialization
 */
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

    const variableStats = {};
    for (const [slot, itemName] of Object.entries(equipment)) {
        if (!itemName) continue;
        const dropdownId = equipmentMap[slot];
        let item = (window.dropdownItemCache && window.dropdownItemCache[`${dropdownId}_${itemName}`]) ||
            (typeof itemList !== 'undefined' && itemList[itemName]) ||
            window.craftedItemsSystem?.getCraftedItemByName(itemName);

        if (item && item.properties) {
            const stats = {};
            const allProps = {};
            for (const [k, v] of Object.entries(item.properties)) {
                if (typeof v === 'object' && v !== null && ('current' in v || 'max' in v)) {
                    stats[k] = v.current !== undefined ? v.current : v.max;
                    allProps[k] = JSON.parse(JSON.stringify(v));
                } else if (item.baseType) {
                    allProps[k] = v;
                }
            }
            variableStats[slot] = {
                itemName,
                stats,
                ...(item.baseType && { baseType: item.baseType, allProperties: allProps })
            };
        }
    }

    const charms = window.charmInventory?.getAllCharms ? window.charmInventory.getAllCharms() : [];
    const skills = {};
    // Broad search for skill inputs
    const skillSelectors = [
        '.skill-tree-container input[type="number"]',
        '.skills-container input[type="number"]',
        '[id$="skillscontainer"] input[type="number"]'
    ];
    skillSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(input => {
            const val = parseInt(input.value);
            if (val > 0 && input.id) skills[input.id] = val;
        });
    });

    return {
        character: { level, class: characterClass, stats: { str, dex, vit, enr } },
        mode, anya: anyaBonuses,
        mercenary: { class: mercClass, level: mercLevel },
        equipment, sockets, corruptions, variableStats, charms, skills,
        selectedSkill: document.getElementById('active-skill-dropdown')?.value || '',
        crafted_items: window.craftedItemsSystem?.exportToData() || []
    };
};

/**
 * Load character state from a data object
 * @param {Object} data - Character data object (from exportCharacterData)
 */
window.loadCharacterFromData = function (data, silent = false) {
    if (!data || !data.character) return;
    try {
        window._isLoadingCharacterData = true;
        // ... (middle content remains same)
        setTimeout(() => {
            if (window.characterManager) window.characterManager.updateTotalStats();
            if (window.skillSystem && window.unifiedSocketSystem) {
                window.skillSystem.updateSkillBonuses(window.unifiedSocketSystem.stats?.allSkills || 0, window.unifiedSocketSystem.stats?.classSkills || 0);
                window.skillSystem.updateSkillDropdown();
            }
            window._isLoadingCharacterData = false;

            // Re-set level inputs to ensure they display correctly
            if (data.character.level) {
                const lvlInput = document.getElementById('lvlValue');
                if (lvlInput) lvlInput.value = data.character.level;
                if (window.characterManager) {
                    window.characterManager.currentLevel = data.character.level;
                    window.characterManager.level = data.character.level;
                }
            }
            if (data.mercenary?.level) {
                const mercLvlInput = document.getElementById('merclvlValue');
                if (mercLvlInput) mercLvlInput.value = data.mercenary.level;
            }

            // Final recalculation to update item requirements
            if (window.unifiedSocketSystem?.updateAll) {
                window.unifiedSocketSystem.updateAll();
            }
        }, 1000);

        if (!silent && window.notificationSystem) window.notificationSystem.success('Build Loaded', 'Character build successfully imported.');
    } catch (e) {
        // ...
        console.error('Load error:', e);
        window._isLoadingCharacterData = false;
    }
};

/**
 * Create a shareable URL-safe build code (optional feature)
 * @param {Object} data - Character data object
 * @returns {string} Base64-encoded build code
 */
window.createBuildCode = function (data) {
    try {
        const json = JSON.stringify(data);
        return btoa(json);
    } catch (error) {
        console.error('Error creating build code:', error);
        return null;
    }
};

/**
 * Decode a build code back to character data
 * @param {string} code - Base64-encoded build code
 * @returns {Object} Character data object
 */
window.decodeBuildCode = function (code) {
    try {
        const json = atob(code);
        return JSON.parse(json);
    } catch (error) {
        console.error('Error decoding build code:', error);
        return null;
    }
};
