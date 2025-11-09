// Character Data Serialization/Deserialization
// Handles exporting and importing character builds

/**
 * Export current character state to a serializable object
 * @returns {Object} Character data object ready for JSON serialization
 */
window.exportCharacterData = function() {
    // Get basic character info
    const level = parseInt(document.getElementById('lvlValue')?.value) || 1;
    const characterClass = document.getElementById('selectClass')?.value || 'Amazon';

    // Get base stats
    const str = parseInt(document.getElementById('str')?.value) || 0;
    const dex = parseInt(document.getElementById('dex')?.value) || 0;
    const vit = parseInt(document.getElementById('vit')?.value) || 0;
    const enr = parseInt(document.getElementById('enr')?.value) || 0;

    // Get game mode
    const mode = document.querySelector('.modedropdown')?.value || 'pvm';

    // Get Anya resistance bonuses
    const anyaBonuses = {
        n: document.querySelector('input[value="anya-n"]')?.checked || false,
        nm: document.querySelector('input[value="anya-nm"]')?.checked || false,
        h: document.querySelector('input[value="anya-h"]')?.checked || false
    };

    // Get mercenary info
    const mercClass = document.getElementById('mercclass')?.value || 'No Mercenary';
    const mercLevel = parseInt(document.getElementById('merclvlValue')?.value) || 1;

    // Get all equipment
    const equipment = {
        // Player equipment
        weapon: document.getElementById('weapons-dropdown')?.value || '',
        helm: document.getElementById('helms-dropdown')?.value || '',
        armor: document.getElementById('armors-dropdown')?.value || '',
        shield: document.getElementById('offs-dropdown')?.value || '',
        gloves: document.getElementById('gloves-dropdown')?.value || '',
        belt: document.getElementById('belts-dropdown')?.value || '',
        boots: document.getElementById('boots-dropdown')?.value || '',
        ring1: document.getElementById('ringsone-dropdown')?.value || '',
        ring2: document.getElementById('ringstwo-dropdown')?.value || '',
        amulet: document.getElementById('amulets-dropdown')?.value || '',

        // Mercenary equipment
        mercWeapon: document.getElementById('mercweapons-dropdown')?.value || '',
        mercHelm: document.getElementById('merchelms-dropdown')?.value || '',
        mercArmor: document.getElementById('mercarmors-dropdown')?.value || '',
        mercShield: document.getElementById('mercoffs-dropdown')?.value || '',
        mercGloves: document.getElementById('mercgloves-dropdown')?.value || '',
        mercBelt: document.getElementById('mercbelts-dropdown')?.value || '',
        mercBoots: document.getElementById('mercboots-dropdown')?.value || ''
    };

    // Get socket data if available
    const sockets = {};
    if (window.unifiedSocketSystem) {
        // Export socket data from the unified socket system
        sockets.data = window.unifiedSocketSystem.exportSocketData?.() || {};
    }

    // Get item corruptions if available
    const corruptions = {};
    if (window.itemCorruptions) {
        corruptions.data = JSON.parse(JSON.stringify(window.itemCorruptions));
    }

    // Get variable item stats (for items with random ranges)
    const variableStats = {};
    for (const [slot, itemName] of Object.entries(equipment)) {
        if (itemName && window.itemList?.[itemName]) {
            const item = window.itemList[itemName];
            if (item.properties) {
                const varStats = {};
                for (const [propKey, propValue] of Object.entries(item.properties)) {
                    if (typeof propValue === 'object' && propValue !== null && 'current' in propValue) {
                        varStats[propKey] = propValue.current;
                    }
                }
                if (Object.keys(varStats).length > 0) {
                    variableStats[slot] = { itemName, stats: varStats };
                }
            }
        }
    }

    return {
        version: '1.0',
        timestamp: new Date().toISOString(),
        character: {
            level,
            class: characterClass,
            stats: { str, dex, vit, enr }
        },
        mode,
        anya: anyaBonuses,
        mercenary: {
            class: mercClass,
            level: mercLevel
        },
        equipment,
        sockets,
        corruptions,
        variableStats
    };
};

/**
 * Load character state from a data object
 * @param {Object} data - Character data object (from exportCharacterData)
 */
window.loadCharacterFromData = function(data) {
    if (!data || !data.character) {
        console.error('Invalid character data');
        return;
    }

    try {
        // Set basic character info
        const lvlInput = document.getElementById('lvlValue');
        if (lvlInput) lvlInput.value = data.character.level || 1;

        const classSelect = document.getElementById('selectClass');
        if (classSelect) classSelect.value = data.character.class || 'Amazon';

        // Set base stats
        const strInput = document.getElementById('str');
        const dexInput = document.getElementById('dex');
        const vitInput = document.getElementById('vit');
        const enrInput = document.getElementById('enr');

        if (strInput) strInput.value = data.character.stats.str || 0;
        if (dexInput) dexInput.value = data.character.stats.dex || 0;
        if (vitInput) vitInput.value = data.character.stats.vit || 0;
        if (enrInput) enrInput.value = data.character.stats.enr || 0;

        // Set game mode
        const modeDropdown = document.querySelector('.modedropdown');
        if (modeDropdown && data.mode) modeDropdown.value = data.mode;

        // Set Anya bonuses
        if (data.anya) {
            const anyaN = document.querySelector('input[value="anya-n"]');
            const anyaNM = document.querySelector('input[value="anya-nm"]');
            const anyaH = document.querySelector('input[value="anya-h"]');

            if (anyaN) anyaN.checked = data.anya.n;
            if (anyaNM) anyaNM.checked = data.anya.nm;
            if (anyaH) anyaH.checked = data.anya.h;
        }

        // Set mercenary info
        if (data.mercenary) {
            const mercClassSelect = document.getElementById('mercclass');
            const mercLevelInput = document.getElementById('merclvlValue');

            if (mercClassSelect) mercClassSelect.value = data.mercenary.class || 'No Mercenary';
            if (mercLevelInput) mercLevelInput.value = data.mercenary.level || 1;
        }

        // Set equipment
        if (data.equipment) {
            const equipmentMap = {
                weapon: 'weapons-dropdown',
                helm: 'helms-dropdown',
                armor: 'armors-dropdown',
                shield: 'offs-dropdown',
                gloves: 'gloves-dropdown',
                belt: 'belts-dropdown',
                boots: 'boots-dropdown',
                ring1: 'ringsone-dropdown',
                ring2: 'ringstwo-dropdown',
                amulet: 'amulets-dropdown',
                mercWeapon: 'mercweapons-dropdown',
                mercHelm: 'merchelms-dropdown',
                mercArmor: 'mercarmors-dropdown',
                mercShield: 'mercoffs-dropdown',
                mercGloves: 'mercgloves-dropdown',
                mercBelt: 'mercbelts-dropdown',
                mercBoots: 'mercboots-dropdown'
            };

            for (const [slot, dropdownId] of Object.entries(equipmentMap)) {
                const dropdown = document.getElementById(dropdownId);
                if (dropdown && data.equipment[slot]) {
                    dropdown.value = data.equipment[slot];
                    // Trigger change event to update UI
                    dropdown.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        // Restore variable item stats
        if (data.variableStats) {
            for (const [slot, varData] of Object.entries(data.variableStats)) {
                const itemName = varData.itemName;
                if (window.itemList?.[itemName]) {
                    const item = window.itemList[itemName];
                    if (item.properties) {
                        for (const [propKey, value] of Object.entries(varData.stats)) {
                            if (item.properties[propKey] && typeof item.properties[propKey] === 'object') {
                                item.properties[propKey].current = value;
                            }
                        }
                    }
                }
            }
        }

        // Restore socket data
        if (data.sockets?.data && window.unifiedSocketSystem?.importSocketData) {
            window.unifiedSocketSystem.importSocketData(data.sockets.data);
        }

        // Restore corruptions
        if (data.corruptions?.data) {
            window.itemCorruptions = data.corruptions.data;
        }

        // Trigger character manager update
        if (window.characterManager) {
            window.characterManager.handleClassChange();
            window.characterManager.updateTotalStats();
            window.characterManager.calculateLifeAndMana();
        }

        console.log('Character loaded successfully!');

        // Show success message
        alert('Character build loaded successfully!');

    } catch (error) {
        console.error('Error loading character data:', error);
        alert('Failed to load character build. See console for details.');
    }
};

/**
 * Create a shareable URL-safe build code (optional feature)
 * @param {Object} data - Character data object
 * @returns {string} Base64-encoded build code
 */
window.createBuildCode = function(data) {
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
window.decodeBuildCode = function(code) {
    try {
        const json = atob(code);
        return JSON.parse(json);
    } catch (error) {
        console.error('Error decoding build code:', error);
        return null;
    }
};
