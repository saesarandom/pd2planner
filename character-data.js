// Character Data Serialization/Deserialization
// Handles exporting and importing character builds

/**
 * Export current character state to a serializable object
 * @returns {Object} Character data object ready for JSON serialization
 */
window.exportCharacterData = function () {
    const level = parseInt(document.getElementById('lvlValue')?.value) || 1;
    const mercLevel = parseInt(document.getElementById('merclvlValue')?.value) || 1;
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

    const charms = window.charmInventory?.exportCharms ? window.charmInventory.exportCharms() : [];
    const skills = {};
    // Broad search for any inputs that look like they belong to skills
    const skillSelectors = [
        '.skill-tree-container input[type="number"]',
        '.skills-container input[type="number"]',
        '[id$="container"] input[type="number"]',
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
window.loadCharacterFromData = function (data) {
    if (!data || !data.character) return;
    try {
        window._isLoadingCharacterData = true;

        // Reset global state
        window.itemCorruptions = {};
        window.slotItemCorruptions = {};
        window.itemBaseProperties = {};
        window.originalItemProperties = {};
        window.originalItemDescriptions = {};
        window.corruptedProperties = {};
        if (window.dropdownItemCache) window.dropdownItemCache = {};
        if (window.unifiedSocketSystem?.clearAll) window.unifiedSocketSystem.clearAll();

        const equipmentMap = {
            weapon: 'weapons-dropdown', helm: 'helms-dropdown', armor: 'armors-dropdown', shield: 'offs-dropdown',
            gloves: 'gloves-dropdown', belt: 'belts-dropdown', boots: 'boots-dropdown',
            ring1: 'ringsone-dropdown', ring2: 'ringstwo-dropdown', amulet: 'amulets-dropdown',
            mercWeapon: 'mercweapons-dropdown', mercHelm: 'merchelms-dropdown', mercArmor: 'mercarmors-dropdown',
            mercShield: 'mercoffs-dropdown', mercGloves: 'mercgloves-dropdown', mercBelt: 'mercbelts-dropdown', mercBoots: 'mercboots-dropdown'
        };

        // Restore basic info - SET VALUES FIRST, dispatch events LATER
        const lvlInput = document.getElementById('lvlValue');
        if (lvlInput) {
            lvlInput.value = data.character.level || 1;
            if (window.characterManager) window.characterManager.currentLevel = data.character.level || 1;
        }

        const classSelect = document.getElementById('selectClass');
        if (classSelect) {
            classSelect.value = data.character.class || 'Amazon';
            if (window.characterManager) window.characterManager.currentClass = data.character.class;
        }

        // Set all stat values
        ['str', 'dex', 'vit', 'enr'].forEach(s => {
            const input = document.getElementById(s);
            if (input) {
                input.value = data.character.stats[s] || 0;
            }
        });

        const modeDropdown = document.querySelector('.modedropdown');
        if (modeDropdown && data.mode) {
            modeDropdown.value = data.mode;
        }

        if (data.anya) {
            ['n', 'nm', 'h'].forEach(m => {
                const cb = document.querySelector(`input[value="anya-${m}"]`);
                if (cb) {
                    cb.checked = data.anya[m];
                }
            });
            window.checkboxResistBonus = (data.anya.n ? 10 : 0) + (data.anya.nm ? 10 : 0) + (data.anya.h ? 10 : 0);
        }

        if (data.mercenary) {
            // Set level first so aura/buff systems have the correct value when class change fires
            const ml = document.getElementById('merclvlValue');
            if (ml) {
                ml.value = data.mercenary.level || 1;
            }
            const mc = document.getElementById('mercclass');
            if (mc) {
                mc.value = data.mercenary.class || 'No Mercenary';
            }
        }

        // NOW dispatch all events after values are set
        if (lvlInput) {
            lvlInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (classSelect) {
            classSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        ['str', 'dex', 'vit', 'enr'].forEach(s => {
            const input = document.getElementById(s);
            if (input) {
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        if (modeDropdown) {
            modeDropdown.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (data.anya) {
            ['n', 'nm', 'h'].forEach(m => {
                const cb = document.querySelector(`input[value="anya-${m}"]`);
                if (cb) {
                    cb.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }
        if (data.mercenary) {
            const mc = document.getElementById('mercclass');
            const ml = document.getElementById('merclvlValue');
            if (mc) {
                mc.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (ml) {
                ml.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        // Restore Crafted Items
        if (data.crafted_items && window.craftedItemsSystem) {
            const eqNames = new Set(Object.values(data.equipment || {}));
            const eqCrafts = data.crafted_items.filter(item => eqNames.has(item.fullName));
            if (window.auth?.isLoggedIn()) {
                window.craftedItemsSystem.mergeBuildCraftedItems(eqCrafts);
            } else {
                window.craftedItemsSystem.loadFromData(eqCrafts);
            }
            eqCrafts.forEach(ci => {
                const types = {
                    weapon: ['weapons-dropdown', 'mercweapons-dropdown'], helm: ['helms-dropdown', 'merchelms-dropdown'],
                    armor: ['armors-dropdown', 'mercarmors-dropdown'], shield: ['offs-dropdown', 'mercoffs-dropdown'],
                    gloves: ['gloves-dropdown', 'mercgloves-dropdown'], belt: ['belts-dropdown', 'mercbelts-dropdown'],
                    boots: ['boots-dropdown', 'mercboots-dropdown'], ringsone: ['ringsone-dropdown', 'ringstwo-dropdown'],
                    amulets: ['amulets-dropdown']
                };
                (types[ci.itemType] || []).forEach(id => {
                    const dd = document.getElementById(id);
                    if (dd && !Array.from(dd.options).some(o => o.value === ci.fullName)) {
                        const opt = document.createElement('option');
                        opt.value = opt.textContent = ci.fullName;
                        dd.appendChild(opt);
                    }
                });
            });
        }

        // Pre-seed caches for stats and corruptions
        if (data.variableStats) {
            for (const [slot, varData] of Object.entries(data.variableStats)) {
                const itemName = varData.itemName;
                const ddId = equipmentMap[slot];
                const cacheKey = `${ddId}_${itemName}`;
                const source = (typeof itemList !== 'undefined' && itemList[itemName]) || window.craftedItemsSystem?.getCraftedItemByName(itemName);
                if (source) {
                    const item = JSON.parse(JSON.stringify(source));
                    if (varData.baseType) item.baseType = varData.baseType;
                    if (varData.allProperties) item.properties = varData.allProperties;
                    else if (varData.stats) {
                        for (const [k, v] of Object.entries(varData.stats)) {
                            if (item.properties[k]) item.properties[k].current = v;
                        }
                    }
                    if (!window.dropdownItemCache) window.dropdownItemCache = {};
                    window.dropdownItemCache[cacheKey] = item;
                    window.itemBaseProperties[cacheKey] = JSON.parse(JSON.stringify(item.properties || {}));
                    if (data.corruptions?.data?.[ddId]?.itemName === itemName) {
                        window.originalItemProperties[itemName] = JSON.parse(JSON.stringify(source.properties || {}));
                    }
                }
            }
        }

        // Restore Sockets & Corruptions
        if (data.sockets?.data && window.unifiedSocketSystem?.importSocketData) {
            window.unifiedSocketSystem.importSocketData(data.sockets.data);
        }

        if (data.corruptions?.data) {
            for (const [sid, corr] of Object.entries(data.corruptions.data)) {
                window.itemCorruptions[sid] = corr;
                if (!window.slotItemCorruptions[sid]) window.slotItemCorruptions[sid] = {};
                window.slotItemCorruptions[sid][corr.itemName] = corr;
                if (!window.originalItemProperties[corr.itemName] && itemList[corr.itemName]) {
                    window.originalItemProperties[corr.itemName] = JSON.parse(JSON.stringify(itemList[corr.itemName].properties || {}));
                }
                const itm = itemList[corr.itemName];
                if (itm) {
                    if (!window.originalItemDescriptions[corr.itemName]) window.originalItemDescriptions[corr.itemName] = itm.description;
                    const orig = window.originalItemDescriptions[corr.itemName];
                    if (corr.type === 'socket_corruption') {
                        itm.description = orig + `<span class="corruption-enhanced-stat">${corr.text}</span><br>`;
                        const sec = window.SECTION_MAP?.[sid];
                        if (sec && window.unifiedSocketSystem?.setSocketCount) window.unifiedSocketSystem.setSocketCount(sec, corr.socketCount);
                    } else {
                        itm.description = window.addCorruptionWithStacking ? window.addCorruptionWithStacking(orig, corr.text) : (orig + `<span class="corruption-enhanced-stat">${corr.text}</span><br>`);
                    }
                }
            }
        }

        // Restore Equipment
        if (data.equipment) {
            Object.values(equipmentMap).forEach(id => {
                const dd = document.getElementById(id);
                if (dd) dd.value = '';
            });
            for (const [slot, id] of Object.entries(equipmentMap)) {
                const dd = document.getElementById(id);
                if (dd) {
                    dd.value = data.equipment[slot] || '';
                    dd.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        // Async restoration
        setTimeout(() => {
            if (window.charmInventory?.initialized) {
                window.charmInventory.clearInventory();
                if (data.charms?.length) {
                    if (window.charmInventory.restoreAllCharms) window.charmInventory.restoreAllCharms(data.charms);
                    else data.charms.forEach(c => window.charmInventory.restoreCharm?.(c));
                }
            }
            if (data.skills) {
                for (const [id, val] of Object.entries(data.skills)) {
                    const input = document.getElementById(id);
                    if (input) {
                        input.value = val;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                if (window.skillSystem) {
                    window.skillSystem.updatePointsDisplay();
                    if (data.selectedSkill && document.getElementById('active-skill-dropdown')) {
                        document.getElementById('active-skill-dropdown').value = data.selectedSkill;
                        document.getElementById('active-skill-dropdown').dispatchEvent(new Event('change', { bubbles: true }));
                        window.skillSystem.calculateSkillDamage();
                    }
                }
            }
            if (window.characterManager) {
                window.characterManager.updateTotalStats();
                window.characterManager.calculateLifeAndMana();
            }
            if (window.unifiedSocketSystem?.updateAll) window.unifiedSocketSystem.updateAll();
        }, 500);

        setTimeout(() => {
            if (window.characterManager) window.characterManager.updateTotalStats();
            if (window.skillSystem && window.unifiedSocketSystem) {
                window.skillSystem.updateSkillBonuses(window.unifiedSocketSystem.stats?.allSkills || 0, window.unifiedSocketSystem.stats?.classSkills || 0);
                window.skillSystem.updateSkillDropdown();
            }
            window._isLoadingCharacterData = false;
        }, 1000);

        if (window.notificationSystem) window.notificationSystem.success('Build Loaded', 'Character build successfully imported.');
    } catch (e) {
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
