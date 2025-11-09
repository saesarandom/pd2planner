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

    // Get charm inventory data
    const charms = [];
    if (window.charmInventory) {
        const container = document.querySelector('.inventorycontainer');
        if (container) {
            // Check regular charm slots (small charms)
            const slots = container.querySelectorAll('.charm1');
            slots.forEach((slot, index) => {
                if (slot.dataset.charmData && slot.style.backgroundImage && !slot.dataset.hasOverlay) {
                    const charmDataStr = slot.dataset.charmData;
                    let charmType = 'small-charm';
                    if (slot.classList.contains('large-charm')) charmType = 'large-charm';
                    if (slot.classList.contains('grand-charm')) charmType = 'grand-charm';

                    try {
                        const parsedData = JSON.parse(charmDataStr);
                        charms.push({
                            type: charmType,
                            position: index,
                            data: parsedData
                        });
                    } catch (e) {
                        console.error('Failed to parse charm data:', e);
                    }
                }
            });

            // Check overlay charms (large and grand charms)
            const overlays = container.querySelectorAll('.charm-overlay');
            overlays.forEach(overlay => {
                const charmDataStr = overlay.dataset.charmData;
                const position = parseInt(overlay.dataset.position);
                let charmType = 'large-charm';
                if (overlay.classList.contains('grand-charm')) charmType = 'grand-charm';

                try {
                    const parsedData = JSON.parse(charmDataStr);
                    charms.push({
                        type: charmType,
                        position: position,
                        data: parsedData
                    });
                } catch (e) {
                    console.error('Failed to parse charm data:', e);
                }
            });
        }
    }

    // Get skills allocation
    const skills = {};
    if (window.skillSystem) {
        // Get all skill inputs (they have IDs ending with "container")
        const skillInputs = document.querySelectorAll('input[id$="container"][type="number"]');
        skillInputs.forEach(input => {
            const points = parseInt(input.value);
            if (points > 0) {
                skills[input.id] = points;
            }
        });
    }

    return {
        version: '1.1',
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
        variableStats,
        charms,
        skills
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
        if (lvlInput) {
            lvlInput.value = data.character.level || 1;
            // Trigger input event to update stats calculations
            lvlInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const classSelect = document.getElementById('selectClass');
        if (classSelect) {
            classSelect.value = data.character.class || 'Amazon';
            // Trigger change event to update class-specific stats
            classSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Set base stats
        const strInput = document.getElementById('str');
        const dexInput = document.getElementById('dex');
        const vitInput = document.getElementById('vit');
        const enrInput = document.getElementById('enr');

        if (strInput) {
            strInput.value = data.character.stats.str || 0;
            strInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (dexInput) {
            dexInput.value = data.character.stats.dex || 0;
            dexInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (vitInput) {
            vitInput.value = data.character.stats.vit || 0;
            vitInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (enrInput) {
            enrInput.value = data.character.stats.enr || 0;
            enrInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Set game mode
        const modeDropdown = document.querySelector('.modedropdown');
        if (modeDropdown && data.mode) modeDropdown.value = data.mode;

        // Set Anya bonuses
        if (data.anya) {
            const anyaN = document.querySelector('input[value="anya-n"]');
            const anyaNM = document.querySelector('input[value="anya-nm"]');
            const anyaH = document.querySelector('input[value="anya-h"]');

            if (anyaN) {
                anyaN.checked = data.anya.n;
                anyaN.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (anyaNM) {
                anyaNM.checked = data.anya.nm;
                anyaNM.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (anyaH) {
                anyaH.checked = data.anya.h;
                anyaH.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // Set mercenary info
        if (data.mercenary) {
            const mercClassSelect = document.getElementById('mercclass');
            const mercLevelInput = document.getElementById('merclvlValue');

            if (mercClassSelect) {
                mercClassSelect.value = data.mercenary.class || 'No Mercenary';
                mercClassSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (mercLevelInput) {
                mercLevelInput.value = data.mercenary.level || 1;
                mercLevelInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
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

        // Restore variable item stats (needs to happen after equipment is loaded)
        setTimeout(() => {
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
                // Force update the display
                if (window.characterManager) {
                    window.characterManager.updateTotalStats();
                }
            }
        }, 500);

        // Restore socket data
        if (data.sockets?.data && window.unifiedSocketSystem?.importSocketData) {
            window.unifiedSocketSystem.importSocketData(data.sockets.data);
        }

        // Restore corruptions
        if (data.corruptions?.data) {
            window.itemCorruptions = data.corruptions.data;
        }

        // Restore charms
        if (data.charms && window.charmInventory) {
            setTimeout(() => {
                data.charms.forEach(charm => {
                    if (window.charmInventory.restoreCharm) {
                        window.charmInventory.restoreCharm(charm);
                    }
                });
            }, 1000);
        }

        // Restore skills
        if (data.skills) {
            setTimeout(() => {
                for (const [inputId, points] of Object.entries(data.skills)) {
                    const input = document.getElementById(inputId);
                    if (input && input.tagName === 'INPUT') {
                        input.value = points;
                        // Trigger change event to update skill calculations
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Final stats recalculation after all skills are loaded
                if (window.characterManager) {
                    window.characterManager.updateTotalStats();
                    window.characterManager.calculateLifeAndMana();
                }
            }, 1000);
        }

        // Trigger character manager update immediately
        if (window.characterManager) {
            window.characterManager.updateTotalStats();
            window.characterManager.calculateLifeAndMana();
        }

        // Final recalculation after all async operations (charms, skills, etc.)
        setTimeout(() => {
            if (window.characterManager) {
                window.characterManager.updateTotalStats();
                window.characterManager.calculateLifeAndMana();
            }
        }, 1500);

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
