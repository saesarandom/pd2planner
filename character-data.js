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
        console.log('Exported socket data:', sockets.data);
    } else {
        console.warn('No unified socket system found during export');
    }

    // Get item corruptions if available
    const corruptions = {};
    if (window.itemCorruptions) {
        corruptions.data = JSON.parse(JSON.stringify(window.itemCorruptions));
    }

    // Get variable item stats (for items with random ranges)
    const variableStats = {};
    console.log('===== EXPORTING VARIABLE STATS =====');
    console.log('Equipment to check:', equipment);
    for (const [slot, itemName] of Object.entries(equipment)) {
        console.log(`Checking slot "${slot}" with item "${itemName}"`);
        if (itemName) {
            if (window.itemList?.[itemName]) {
                const item = window.itemList[itemName];
                console.log(`  Item found in itemList:`, item);
                if (item.properties) {
                    const varStats = {};
                    console.log(`  Item has properties:`, item.properties);
                    for (const [propKey, propValue] of Object.entries(item.properties)) {
                        console.log(`    Checking property "${propKey}":`, propValue, `is object? ${typeof propValue === 'object'}, has current? ${'current' in propValue}`);
                        if (typeof propValue === 'object' && propValue !== null && 'current' in propValue) {
                            varStats[propKey] = propValue.current;
                            console.log(`      -> Exporting ${propKey}=${propValue.current}`);
                        }
                    }
                    if (Object.keys(varStats).length > 0) {
                        variableStats[slot] = { itemName, stats: varStats };
                        console.log(`  Result for ${slot}:`, variableStats[slot]);
                    } else {
                        console.log(`  No variable stats found for ${slot}`);
                    }
                } else {
                    console.log(`  Item has no properties!`);
                }
            } else {
                console.log(`  Item "${itemName}" NOT found in itemList`);
                console.log(`  Available items (sample):`, Object.keys(window.itemList || {}).slice(0, 10));
            }
        } else {
            console.log(`  No item equipped in ${slot}`);
        }
    }
    console.log('===== EXPORT COMPLETE =====');
    console.log('Final variableStats:', variableStats);

    // Get charm inventory data using the new getAllCharms method
    // This is simpler and more reliable than parsing the DOM manually
    const charms = window.charmInventory?.getAllCharms?.() || [];
    if (charms.length > 0) {
        console.log('Exported charms:', charms.length, charms);
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
        // Set loading flag to prevent class change from resetting stats
        window._isLoadingCharacterData = true;

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
            // Update character manager class but don't reset stats
            if (window.characterManager) {
                window.characterManager.currentClass = data.character.class || 'Amazon';
            }
        }

        // Set base stats (without triggering recalculations yet)
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

        // Set Anya bonuses (just set values, recalculation happens at end)
        if (data.anya) {
            const anyaN = document.querySelector('input[value="anya-n"]');
            const anyaNM = document.querySelector('input[value="anya-nm"]');
            const anyaH = document.querySelector('input[value="anya-h"]');

            if (anyaN) anyaN.checked = data.anya.n;
            if (anyaNM) anyaNM.checked = data.anya.nm;
            if (anyaH) anyaH.checked = data.anya.h;

            // Update the global checkbox resistance bonus
            window.checkboxResistBonus = (data.anya.n ? 10 : 0) + (data.anya.nm ? 10 : 0) + (data.anya.h ? 10 : 0);
        }

        // Set mercenary info (just set values, recalculation happens at end)
        if (data.mercenary) {
            const mercClassSelect = document.getElementById('mercclass');
            const mercLevelInput = document.getElementById('merclvlValue');

            if (mercClassSelect) mercClassSelect.value = data.mercenary.class || 'No Mercenary';
            if (mercLevelInput) mercLevelInput.value = data.mercenary.level || 1;
        }

        // IMPORTANT: Restore variable item stats BEFORE setting equipment
        // This ensures that when equipment dropdowns trigger regeneration of descriptions,
        // the saved variable stat values are already in place
        if (data.variableStats) {
            console.log('Pre-restoring variable stats before equipment changes:', data.variableStats);
            for (const [slot, varData] of Object.entries(data.variableStats)) {
                const itemName = varData.itemName;
                console.log(`Pre-restoring variable stats for ${slot} (${itemName}):`, varData.stats);
                if (window.itemList?.[itemName]) {
                    const item = window.itemList[itemName];
                    console.log(`  Item found in itemList:`, item);
                    if (item.properties) {
                        for (const [propKey, value] of Object.entries(varData.stats)) {
                            const oldValue = item.properties[propKey]?.current;
                            if (item.properties[propKey] && typeof item.properties[propKey] === 'object') {
                                console.log(`  Setting ${propKey} from ${oldValue} to ${value}`);
                                item.properties[propKey].current = value;
                                console.log(`  Verified: ${propKey}.current is now ${item.properties[propKey].current}`);
                            } else {
                                console.warn(`  ${propKey} is not a variable property:`, item.properties[propKey]);
                            }
                        }
                    } else {
                        console.warn(`  Item has no properties!`, item);
                    }
                } else {
                    console.warn(`  Item NOT found in itemList! Available items:`, Object.keys(window.itemList || {}).slice(0, 5), '...');
                }
            }
            console.log('Pre-restoration of variable stats complete');
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

        // Log variable stats AFTER equipment is set to verify they're still correct
        if (data.variableStats) {
            console.log('Verifying variable stats after equipment set:');
            for (const [slot, varData] of Object.entries(data.variableStats)) {
                const itemName = varData.itemName;
                if (window.itemList?.[itemName]) {
                    const item = window.itemList[itemName];
                    for (const [propKey, expectedValue] of Object.entries(varData.stats)) {
                        const actualValue = item.properties?.[propKey]?.current;
                        console.log(`  ${slot} ${propKey}: expected=${expectedValue}, actual=${actualValue}, match=${expectedValue === actualValue}`);
                    }
                }
            }
        }

        // Restore socket data
        if (data.sockets?.data && window.unifiedSocketSystem?.importSocketData) {
            console.log('Restoring socket data:', data.sockets.data);
            window.unifiedSocketSystem.importSocketData(data.sockets.data);
            console.log('Socket data restored');
        } else {
            console.warn('Socket data not available or socket system not ready', {
                hasData: !!data.sockets?.data,
                hasSystem: !!window.unifiedSocketSystem,
                hasImport: !!window.unifiedSocketSystem?.importSocketData
            });
        }

        // Restore corruptions
        if (data.corruptions?.data) {
            window.itemCorruptions = data.corruptions.data;
        }

        // Clear and restore charms - always clear inventory when loading a character
        // This ensures empty builds have empty charm inventory
        const clearCharmsWhenReady = (attempt = 1) => {
            if (window.charmInventory && window.charmInventory.initialized) {
                const container = document.querySelector('.inventorycontainer');
                const charmSlots = container?.querySelectorAll('.charm1').length ?? 0;
                if (container && charmSlots >= 40) {
                    console.log('Clearing charm inventory before restoring...');
                    window.charmInventory.clearInventory();

                    // Now restore charms if there are any
                    if (data.charms && data.charms.length > 0) {
                        console.log('Starting charm restoration process, need to restore:', data.charms.length, 'charms');
                        if (window.charmInventory.restoreAllCharms) {
                            window.charmInventory.restoreAllCharms(data.charms);
                        } else {
                            console.warn('restoreAllCharms not available, using individual charm restoration');
                            data.charms.forEach((charm, idx) => {
                                console.log(`Restoring charm ${idx + 1}/${data.charms.length}:`, charm);
                                if (window.charmInventory.restoreCharm) {
                                    window.charmInventory.restoreCharm(charm);
                                }
                            });
                        }
                    } else {
                        console.log('No charms to restore - inventory cleared');
                    }
                } else {
                    console.warn('Charm inventory grid not ready, retrying...', {
                        containerExists: !!container,
                        charmSlots: charmSlots
                    });
                    setTimeout(() => clearCharmsWhenReady(attempt + 1), 200);
                }
            } else {
                console.warn('Charm inventory not initialized, retrying...');
                setTimeout(() => clearCharmsWhenReady(attempt + 1), 200);
            }
        };

        setTimeout(clearCharmsWhenReady, 500);

        // Restore skills (just set values without triggering validation)
        if (data.skills) {
            setTimeout(() => {
                for (const [inputId, points] of Object.entries(data.skills)) {
                    const input = document.getElementById(inputId);
                    if (input && input.tagName === 'INPUT') {
                        input.value = points;
                    }
                }

                // Update skill display after skills are loaded
                if (window.skillSystem) {
                    window.skillSystem.updatePointsDisplay();
                }

                // Final stats recalculation after all skills are loaded
                if (window.characterManager) {
                    window.characterManager.updateTotalStats();
                    window.characterManager.calculateLifeAndMana();
                }
            }, 1000);
        }

        // Trigger character manager update immediately after all values are set
        if (window.characterManager) {
            window.characterManager.updateTotalStats();
            window.characterManager.calculateLifeAndMana();
        }

        // Update socket system to show all bonuses
        if (window.unifiedSocketSystem?.updateAll) {
            window.unifiedSocketSystem.updateAll();
        }

        // Final recalculation after all async operations (charms, skills, etc.)
        setTimeout(() => {
            if (window.characterManager) {
                window.characterManager.updateTotalStats();
                window.characterManager.calculateLifeAndMana();
            }

            // Clear loading flag
            window._isLoadingCharacterData = false;
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
