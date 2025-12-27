// Character Data Serialization/Deserialization
// Handles exporting and importing character builds

/**
 * Export current character state to a serializable object
 * @returns {Object} Character data object ready for JSON serialization
 */
window.exportCharacterData = function () {
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
            const allProperties = {}; // For items with baseType, save ALL properties (upgraded items)

            for (const [propKey, propValue] of Object.entries(item.properties)) {
                if (typeof propValue === 'object' && propValue !== null && 'current' in propValue) {
                    // Variable stat - save current value
                    varStats[propKey] = propValue.current;
                    allProperties[propKey] = propValue; // Save full object
                } else {
                    // Fixed property - only save for dynamic items (with baseType)
                    if (item.baseType) {
                        allProperties[propKey] = propValue;
                    }
                }
            }

            if (Object.keys(varStats).length > 0 || item.baseType) {
                const saveData = {
                    itemName,
                    stats: varStats,
                    // Save baseType if it exists (for upgraded items or crafted items)
                    ...(item.baseType && { baseType: item.baseType }),
                    // Save ALL properties for dynamic items (includes defense, reqstr, etc from upgrades)
                    ...(item.baseType && Object.keys(allProperties).length > 0 && { allProperties })
                };

                console.log(`Exporting ${itemName}:`, {
                    baseType: item.baseType,
                    allProperties: Object.keys(allProperties),
                    saveData
                });

                variableStats[slot] = saveData;
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
window.loadCharacterFromData = function (data) {
    if (!data || !data.character) {
        console.error('Invalid character data');
        return;
    }

    try {
        // Set loading flag to prevent class change from resetting stats
        window._isLoadingCharacterData = true;

        // Ensure global tracking objects are initialized
        if (!window.itemCorruptions) window.itemCorruptions = {};
        if (!window.slotItemCorruptions) window.slotItemCorruptions = {};
        if (!window.itemBaseProperties) window.itemBaseProperties = {};
        if (!window.originalItemProperties) window.originalItemProperties = {};
        if (!window.originalItemDescriptions) window.originalItemDescriptions = {};
        if (!window.corruptedProperties) window.corruptedProperties = {};

        // Mapping for equipment categories
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

        // Set basic character info
        const lvlInput = document.getElementById('lvlValue');
        if (lvlInput) {
            lvlInput.value = data.character.level || 1;
            lvlInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const classSelect = document.getElementById('selectClass');
        if (classSelect) {
            classSelect.value = data.character.class || 'Amazon';
            if (window.characterManager) {
                window.characterManager.currentClass = data.character.class || 'Amazon';
            }
        }

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

            window.checkboxResistBonus = (data.anya.n ? 10 : 0) + (data.anya.nm ? 10 : 0) + (data.anya.h ? 10 : 0);
        }

        // Set mercenary info
        if (data.mercenary) {
            const mercClassSelect = document.getElementById('mercclass');
            const mercLevelInput = document.getElementById('merclvlValue');

            if (mercClassSelect) mercClassSelect.value = data.mercenary.class || 'No Mercenary';
            if (mercLevelInput) mercLevelInput.value = data.mercenary.level || 1;
        }

        // Load crafted items
        if (data.crafted_items && window.craftedItemsSystem) {
            const equippedItemNames = new Set(Object.values(data.equipment || {}));
            const equippedCraftedItems = data.crafted_items.filter(item => equippedItemNames.has(item.fullName));

            if (window.auth?.isLoggedIn()) {
                window.craftedItemsSystem.mergeBuildCraftedItems(equippedCraftedItems);
            } else {
                window.craftedItemsSystem.loadFromData(equippedCraftedItems);
            }

            equippedCraftedItems.forEach(craftedItem => {
                const itemType = craftedItem.itemType;
                const dropdownIds = [];
                if (itemType === 'weapon') dropdownIds.push('weapons-dropdown', 'mercweapons-dropdown');
                else if (itemType === 'helm') dropdownIds.push('helms-dropdown', 'merchelms-dropdown');
                else if (itemType === 'armor') dropdownIds.push('armors-dropdown', 'mercarmors-dropdown');
                else if (itemType === 'shield') dropdownIds.push('offs-dropdown', 'mercoffs-dropdown');
                else if (itemType === 'gloves') dropdownIds.push('gloves-dropdown', 'mercgloves-dropdown');
                else if (itemType === 'belt') dropdownIds.push('belts-dropdown', 'mercbelts-dropdown');
                else if (itemType === 'boots') dropdownIds.push('boots-dropdown', 'mercboots-dropdown');
                else if (itemType === 'ringsone') dropdownIds.push('ringsone-dropdown', 'ringstwo-dropdown');
                else if (itemType === 'amulets') dropdownIds.push('amulets-dropdown');

                dropdownIds.forEach(dropdownId => {
                    const dropdown = document.getElementById(dropdownId);
                    if (dropdown) {
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

        // Restore variable item stats
        if (data.variableStats && typeof itemList !== 'undefined') {
            for (const [slot, varData] of Object.entries(data.variableStats)) {
                const itemName = varData.itemName;
                const dropdownId = equipmentMap[slot] || slot;
                const uniqueKey = `${dropdownId}_${itemName}`;

                // Seed originalItemProperties for corrupted items
                if (data.corruptions?.data && data.corruptions.data[dropdownId] &&
                    data.corruptions.data[dropdownId].itemName === itemName) {
                    if (!window.originalItemProperties[itemName]) {
                        window.originalItemProperties[itemName] = JSON.parse(JSON.stringify(itemList[itemName]?.properties || {}));
                    }
                }

                if (itemList[itemName]) {
                    const item = itemList[itemName];
                    if (varData.baseType) item.baseType = varData.baseType;
                    if (varData.allProperties && item.properties) {
                        item.properties = varData.allProperties;
                    } else if (item.properties && varData.stats) {
                        for (const [propKey, value] of Object.entries(varData.stats)) {
                            if (item.properties[propKey] && typeof item.properties[propKey] === 'object') {
                                item.properties[propKey].current = value;
                            }
                        }
                    }
                    window.itemBaseProperties[uniqueKey] = JSON.parse(JSON.stringify(item.properties || {}));
                } else if (window.craftedItemsSystem) {
                    const craftedItem = window.craftedItemsSystem.getCraftedItemByName(itemName);
                    if (craftedItem) {
                        if (varData.baseType) craftedItem.baseType = varData.baseType;
                        if (varData.allProperties && craftedItem.properties) {
                            craftedItem.properties = varData.allProperties;
                        } else if (craftedItem.properties && varData.stats) {
                            for (const [propKey, value] of Object.entries(varData.stats)) {
                                if (craftedItem.properties[propKey] && typeof craftedItem.properties[propKey] === 'object') {
                                    craftedItem.properties[propKey].current = value;
                                }
                            }
                        }
                        window.itemBaseProperties[uniqueKey] = JSON.parse(JSON.stringify(craftedItem.properties || {}));
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
            const restoredCorruptions = {};
            for (const [slotId, corruption] of Object.entries(data.corruptions.data)) {
                restoredCorruptions[slotId] = corruption;
                if (!window.slotItemCorruptions[slotId]) window.slotItemCorruptions[slotId] = {};
                window.slotItemCorruptions[slotId][corruption.itemName] = corruption;
            }
            window.itemCorruptions = restoredCorruptions;

            // Reapply descriptions for static items
            for (const [slotId, corruption] of Object.entries(restoredCorruptions)) {
                const itemName = corruption.itemName;
                if (itemName && itemList[itemName]) {
                    if (!window.originalItemDescriptions[itemName]) {
                        window.originalItemDescriptions[itemName] = itemList[itemName].description;
                    }
                    const originalDescription = window.originalItemDescriptions[itemName];
                    if (corruption.type === 'socket_corruption') {
                        itemList[itemName].description = originalDescription + `<span class="corruption-enhanced-stat">${corruption.text}</span><br>`;
                        const section = window.SECTION_MAP?.[slotId];
                        if (section && window.unifiedSocketSystem?.setSocketCount) {
                            window.unifiedSocketSystem.setSocketCount(section, corruption.socketCount);
                        }
                    } else if (window.addCorruptionWithStacking) {
                        itemList[itemName].description = window.addCorruptionWithStacking(originalDescription, corruption.text);
                    } else {
                        itemList[itemName].description = originalDescription + `<span class="corruption-enhanced-stat">${corruption.text}</span><br>`;
                    }
                }
            }
        }

        // Set equipment
        if (data.equipment) {
            for (const [slot, dropdownId] of Object.entries(equipmentMap)) {
                const dropdown = document.getElementById(dropdownId);
                if (dropdown && data.equipment[slot]) {
                    dropdown.value = data.equipment[slot];
                    dropdown.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        // Charms
        const clearCharmsWhenReady = (attempt = 1) => {
            if (window.charmInventory?.initialized) {
                const container = document.querySelector('.inventorycontainer');
                const charmSlots = container?.querySelectorAll('.charm1').length ?? 0;
                if (container && charmSlots >= 40) {
                    window.charmInventory.clearInventory();
                    if (data.charms?.length > 0) {
                        if (window.charmInventory.restoreAllCharms) {
                            window.charmInventory.restoreAllCharms(data.charms);
                        } else if (window.charmInventory.restoreCharm) {
                            data.charms.forEach(charm => window.charmInventory.restoreCharm(charm));
                        }
                    }
                } else if (attempt < 10) {
                    setTimeout(() => clearCharmsWhenReady(attempt + 1), 200);
                }
            } else if (attempt < 10) {
                setTimeout(() => clearCharmsWhenReady(attempt + 1), 200);
            }
        };
        setTimeout(clearCharmsWhenReady, 500);

        // Skills
        if (data.skills) {
            setTimeout(() => {
                for (const [inputId, points] of Object.entries(data.skills)) {
                    const input = document.getElementById(inputId);
                    if (input?.tagName === 'INPUT') input.value = points;
                }
                if (window.skillSystem) {
                    window.skillSystem.updatePointsDisplay();
                    if (data.selectedSkill) {
                        const skillDropdown = document.getElementById('active-skill-dropdown');
                        if (skillDropdown) {
                            skillDropdown.value = data.selectedSkill;
                            window.skillSystem.calculateSkillDamage();
                        }
                    }
                }
                if (window.characterManager) {
                    window.characterManager.updateTotalStats();
                    window.characterManager.calculateLifeAndMana();
                }
            }, 1000);
        }

        // Final updates
        if (window.characterManager) {
            window.characterManager.updateTotalStats();
            window.characterManager.calculateLifeAndMana();
        }
        if (window.unifiedSocketSystem?.updateAll) {
            window.unifiedSocketSystem.updateAll();
        }

        setTimeout(() => {
            if (window.characterManager) {
                window.characterManager.updateTotalStats();
                window.characterManager.calculateLifeAndMana();
            }
            if (window.skillSystem && window.unifiedSocketSystem) {
                window.skillSystem.updateSkillBonuses(
                    window.unifiedSocketSystem.stats?.allSkills || 0,
                    window.unifiedSocketSystem.stats?.classSkills || 0
                );
                window.skillSystem.updateSkillDropdown();
            }
            window._isLoadingCharacterData = false;
        }, 1500);

        if (window.notificationSystem) {
            window.notificationSystem.success('Success!', 'Character build loaded successfully!', { duration: 4000 });
        } else {
            alert('Character build loaded successfully!');
        }

    } catch (error) {
        console.error('Error loading character data:', error);
        window._isLoadingCharacterData = false;
        if (window.notificationSystem) {
            window.notificationSystem.error('Load Failed', 'Failed to load character build.', { duration: 6000 });
        } else {
            alert('Failed to load character build.');
        }
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
