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
        
        console.warn('No unified socket system found during export');
    }

    // Get item corruptions if available
    const corruptions = {};
    if (window.itemCorruptions) {
        corruptions.data = JSON.parse(JSON.stringify(window.itemCorruptions));
    }

    // Get variable item stats (for items with random ranges)
    // Check both regular items (itemList) and crafted items (craftedItemsSystem)
    const variableStats = {};
    for (const [slot, itemName] of Object.entries(equipment)) {
        if (!itemName) continue;

        let item = null;

        // Check regular items first
        if (typeof itemList !== 'undefined' && itemList[itemName]) {
            item = itemList[itemName];
        }
        // Also check crafted items
        else if (window.craftedItemsSystem) {
            item = window.craftedItemsSystem.getCraftedItemByName(itemName);
        }

        // If we found the item, export its variable stats and baseType (if changed by upgrade)
        if (item && item.properties) {
            const varStats = {};
            for (const [propKey, propValue] of Object.entries(item.properties)) {
                if (typeof propValue === 'object' && propValue !== null && 'current' in propValue) {
                    varStats[propKey] = propValue.current;
                }
            }
            if (Object.keys(varStats).length > 0 || item.baseType) {
                variableStats[slot] = {
                    itemName,
                    stats: varStats,
                    // Save baseType if it exists (for upgraded items or crafted items)
                    ...(item.baseType && { baseType: item.baseType })
                };
            }
        }
    }

    // Get charm inventory data using the new getAllCharms method
    // This is simpler and more reliable than parsing the DOM manually
    const charms = window.charmInventory?.getAllCharms?.() || [];
    if (charms.length > 0) {
       
    }

    // Get skills allocation
    const skills = {};
    let selectedSkill = null;
    if (window.skillSystem) {
        // Get all skill inputs (they have IDs ending with "container")
        const skillInputs = document.querySelectorAll('input[id$="container"][type="number"]');
        skillInputs.forEach(input => {
            const points = parseInt(input.value);
            if (points > 0) {
                skills[input.id] = points;
            }
        });

        // Get the currently selected skill from the dropdown
        const skillDropdown = document.getElementById('active-skill-dropdown');
        if (skillDropdown && skillDropdown.value) {
            selectedSkill = skillDropdown.value;
        }
    }


    // Get resistances from displayed values
    const resistances = {
        fire: parseInt(document.getElementById('fireresistcontainer')?.textContent) || 0,
        cold: parseInt(document.getElementById('coldresistcontainer')?.textContent) || 0,
        lightning: parseInt(document.getElementById('lightresistcontainer')?.textContent) || 0,
        poison: parseInt(document.getElementById('poisonresistcontainer')?.textContent) || 0
    };

    // Get crafted items if available
    const craftedItems = window.craftedItemsSystem ? window.craftedItemsSystem.exportToData() : [];

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
        skills,
        selectedSkill,
        resistances,
        crafted_items: craftedItems
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

        // IMPORTANT: Load crafted items FIRST, before restoring variable stats
        // This ensures crafted items exist in the system when we try to restore their variable stats
        if (data.crafted_items && window.craftedItemsSystem) {
            // Filter to only include crafted items that are actually equipped in this build
            const equippedItemNames = new Set(Object.values(data.equipment || {}));
            const equippedCraftedItems = data.crafted_items.filter(item =>
                equippedItemNames.has(item.fullName)
            );

            if (window.auth?.isLoggedIn()) {
                // For logged-in users: Merge the build's crafted items with existing ones
                // This preserves their other crafted items while adding the build's items
                window.craftedItemsSystem.mergeBuildCraftedItems(equippedCraftedItems);
            } else {
                // For non-logged-in users: Replace with build's crafted items only
                window.craftedItemsSystem.loadFromData(equippedCraftedItems);
            }

            // Add the crafted items to dropdowns WITHOUT clearing existing selections
            // We manually add options instead of calling populateItemDropdowns() which clears everything
            equippedCraftedItems.forEach(craftedItem => {
                // Determine which dropdown(s) this item belongs to
                const itemType = craftedItem.itemType;
                const dropdownIds = [];

                // Map item type to dropdown IDs
                if (itemType === 'weapon') dropdownIds.push('weapons-dropdown', 'mercweapons-dropdown');
                else if (itemType === 'helm') dropdownIds.push('helms-dropdown', 'merchelms-dropdown');
                else if (itemType === 'armor') dropdownIds.push('armors-dropdown', 'mercarmors-dropdown');
                else if (itemType === 'shield') dropdownIds.push('offs-dropdown', 'mercoffs-dropdown');
                else if (itemType === 'gloves') dropdownIds.push('gloves-dropdown', 'mercgloves-dropdown');
                else if (itemType === 'belt') dropdownIds.push('belts-dropdown', 'mercbelts-dropdown');
                else if (itemType === 'boots') dropdownIds.push('boots-dropdown', 'mercboots-dropdown');
                else if (itemType === 'ringsone') dropdownIds.push('ringsone-dropdown', 'ringstwo-dropdown');
                else if (itemType === 'amulets') dropdownIds.push('amulets-dropdown');

                // Add option to each relevant dropdown if it doesn't already exist
                dropdownIds.forEach(dropdownId => {
                    const dropdown = document.getElementById(dropdownId);
                    if (dropdown) {
                        // Check if option already exists
                        const existingOption = Array.from(dropdown.options).find(opt => opt.value === craftedItem.fullName);
                        if (!existingOption) {
                            const option = document.createElement('option');
                            option.value = craftedItem.fullName;
                            option.textContent = craftedItem.fullName;
                            dropdown.appendChild(option);
                        }
                    }
                });
            });
        }

        // IMPORTANT: Restore variable item stats AFTER loading crafted items
        // This ensures that when equipment dropdowns trigger regeneration of descriptions,
        // the saved variable stat values are already in place (for both regular and crafted items)
        if (data.variableStats && typeof itemList !== 'undefined') {

            for (const [slot, varData] of Object.entries(data.variableStats)) {
                const itemName = varData.itemName;

                // Check regular items first
                if (itemList[itemName]) {
                    const item = itemList[itemName];

                    // Restore baseType if it was saved (for upgraded items)
                    if (varData.baseType && item.baseType !== undefined) {
                        item.baseType = varData.baseType;
                    }

                    // Restore variable stat values
                    if (item.properties && varData.stats) {
                        for (const [propKey, value] of Object.entries(varData.stats)) {
                            if (item.properties[propKey] && typeof item.properties[propKey] === 'object') {
                                item.properties[propKey].current = value;
                            }
                        }
                    }
                }
                // Also check crafted items
                else if (window.craftedItemsSystem) {
                    const craftedItem = window.craftedItemsSystem.getCraftedItemByName(itemName);
                    if (craftedItem) {
                        // Restore baseType if it was saved
                        if (varData.baseType && craftedItem.baseType !== undefined) {
                            craftedItem.baseType = varData.baseType;
                        }

                        // Restore variable stat values
                        if (craftedItem.properties && varData.stats) {
                            for (const [propKey, value] of Object.entries(varData.stats)) {
                                if (craftedItem.properties[propKey] && typeof craftedItem.properties[propKey] === 'object') {
                                    craftedItem.properties[propKey].current = value;
                                }
                            }
                        }
                    }
                }
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

        // Log variable stats AFTER equipment is set to verify they're still correct
        if (data.variableStats && typeof itemList !== 'undefined') {

            for (const [slot, varData] of Object.entries(data.variableStats)) {
                const itemName = varData.itemName;
                // Check regular items
                if (itemList[itemName]) {
                    const item = itemList[itemName];
                    for (const [propKey, expectedValue] of Object.entries(varData.stats)) {
                        const actualValue = item.properties?.[propKey]?.current;

                    }
                }
                // Also check crafted items
                else if (window.craftedItemsSystem) {
                    const craftedItem = window.craftedItemsSystem.getCraftedItemByName(itemName);
                    if (craftedItem) {
                        for (const [propKey, expectedValue] of Object.entries(varData.stats)) {
                            const actualValue = craftedItem.properties?.[propKey]?.current;

                        }
                    }
                }
            }
        }

        // Restore socket data
        if (data.sockets?.data && window.unifiedSocketSystem?.importSocketData) {
            
            window.unifiedSocketSystem.importSocketData(data.sockets.data);
            
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

            // Reapply corruptions to item descriptions
            for (const [slotId, corruption] of Object.entries(data.corruptions.data)) {
                const itemName = corruption.itemName;
                if (itemName && typeof itemList !== 'undefined' && itemList[itemName]) {
                    // Store original description if not already stored
                    if (!window.originalItemDescriptions[itemName]) {
                        window.originalItemDescriptions[itemName] = itemList[itemName].description;
                    }

                    const originalDescription = window.originalItemDescriptions[itemName];

                    if (corruption.type === 'socket_corruption') {
                        // Reapply socket corruption description
                        const enhancedDescription = originalDescription + `<span class="corruption-enhanced-stat">${corruption.text}</span><br>`;
                        itemList[itemName].description = enhancedDescription;

                        // Restore socket count
                        const section = window.SECTION_MAP?.[slotId];
                        if (section && window.unifiedSocketSystem && typeof window.unifiedSocketSystem.setSocketCount === 'function') {
                            window.unifiedSocketSystem.setSocketCount(section, corruption.socketCount);
                        }
                    } else {
                        // Reapply regular corruption with stacking
                        if (window.addCorruptionWithStacking) {
                            const enhancedDescription = window.addCorruptionWithStacking(originalDescription, corruption.text);
                            itemList[itemName].description = enhancedDescription;
                        } else {
                            // Fallback if stacking function not available
                            const enhancedDescription = originalDescription + `<span class="corruption-enhanced-stat">${corruption.text}</span><br>`;
                            itemList[itemName].description = enhancedDescription;
                        }
                    }
                }
            }
        }

        // Clear and restore charms - always clear inventory when loading a character
        // This ensures empty builds have empty charm inventory
        const clearCharmsWhenReady = (attempt = 1) => {
            if (window.charmInventory && window.charmInventory.initialized) {
                const container = document.querySelector('.inventorycontainer');
                const charmSlots = container?.querySelectorAll('.charm1').length ?? 0;
                if (container && charmSlots >= 40) {
                    
                    window.charmInventory.clearInventory();

                    // Now restore charms if there are any
                    if (data.charms && data.charms.length > 0) {
                        
                        if (window.charmInventory.restoreAllCharms) {
                            window.charmInventory.restoreAllCharms(data.charms);
                        } else {
                            console.warn('restoreAllCharms not available, using individual charm restoration');
                            data.charms.forEach((charm, idx) => {
                                
                                if (window.charmInventory.restoreCharm) {
                                    window.charmInventory.restoreCharm(charm);
                                }
                            });
                        }
                    } else {
                        
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

                    // Restore the previously selected skill if available
                    if (data.selectedSkill) {
                        const skillDropdown = document.getElementById('active-skill-dropdown');
                        if (skillDropdown) {
                            // Set the selected skill
                            skillDropdown.value = data.selectedSkill;
                            // Trigger calculation to show the tooltip
                            window.skillSystem.calculateSkillDamage();
                        }
                    }
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

            // Ensure skill bonus indicators are updated with current All Skills and Class Skills bonuses
            if (window.skillSystem && window.unifiedSocketSystem) {
                window.skillSystem.updateSkillBonuses(
                    window.unifiedSocketSystem.stats?.allSkills || 0,
                    window.unifiedSocketSystem.stats?.classSkills || 0
                );
                window.skillSystem.updateSkillDropdown();
            }

            // Clear loading flag
            window._isLoadingCharacterData = false;
        }, 1500);

        

        // Show success message
        if (window.notificationSystem) {
            window.notificationSystem.success('Success!', 'Character build loaded successfully!', { duration: 4000 });
        } else {
            alert('Character build loaded successfully!');
        }

    } catch (error) {
        console.error('Error loading character data:', error);
        if (window.notificationSystem) {
            window.notificationSystem.error('Load Failed', 'Failed to load character build. See console for details.', { duration: 6000 });
        } else {
            alert('Failed to load character build. See console for details.');
        }
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
