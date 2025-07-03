// corruption.js - Complete rewrite with socket fixes
window.typeCorruptions = window.typeCorruptions || {};
window.typeCorruptions = {
    helm: null,
    armor: null,
    weapon: null,
    off: null,
    glove: null,
    belt: null,
    boot: null,
    ringOne: null,
    ringTwo: null,
    amulet: null,
    quiver: null,
};

console.log('typeCorruptions initialized at script start');

// Error handler to catch issues
window.addEventListener('error', function(e) {
    console.error('Script error:', e.message, 'at', e.filename, ':', e.lineno);
});

debugger; // #1 - Check if file loads
console.log('CORRUPTION.JS LOADED');


function waitForDependencies(callback) {
    const checkDependencies = () => {
        if (typeof itemList !== 'undefined' && 
            typeof calculateItemDamage === 'function' && 
            typeof showItemModal === 'function') {
            callback();
        } else {
            console.log('Waiting for dependencies...');
            setTimeout(checkDependencies, 100);
        }
    };
    checkDependencies();
}
// Error handler to catch issues
window.addEventListener('error', function (e) {
    console.error('Script error:', e.message, 'at', e.filename, ':', e.lineno);
});

// Global section mapping - single source of truth
const SECTION_MAP = {
    "weapons-dropdown": "weapon",
    "helms-dropdown": "helm",
    "armors-dropdown": "armor",
    "offs-dropdown": "shield",
    "belts-dropdown": "belt",
    "gloves-dropdown": "glove",
    "boots-dropdown": "boot",
    "ringsone-dropdown": "ringOne",
    "ringstwo-dropdown": "ringTwo",
    "amulets-dropdown": "amulet"
};
debugger;
// Enhanced stats merging function
function mergeNumericStats(stats) {
    if (!stats || !Array.isArray(stats)) return [];

    const statMap = new Map();
    const nonNumericStats = [];

    stats.forEach(stat => {
        if (!stat || typeof stat !== 'string') return;

        const trimmedStat = stat.trim();
        if (!trimmedStat) return;

        // Patterns for different stat types
        const patterns = [
            { regex: /^([+-]?\d+)%\s+Enhanced\s+Damage$/i, key: 'Enhanced Damage', format: (val) => `+${val}% Enhanced Damage` },
            { regex: /^(\w+)\s+Resist\s+\+(\d+)%?$/i, key: (match) => `${match[1]} Resist`, format: (val, match) => `${match[1]} Resist +${val}%` },
            { regex: /^(\d+)%\s+(Life|Mana)\s+Stolen\s+per\s+Hit$/i, key: (match) => `${match[2]} Stolen per Hit`, format: (val, match) => `${val}% ${match[2]} Stolen per Hit` },
            { regex: /^\+(\d+)\s+to\s+(.+)$/i, key: (match) => `to ${match[2]}`, format: (val, match) => `+${val} to ${match[2]}` },
            { regex: /^\+(\d+)\s+(Strength|Dexterity|Vitality|Energy|Life|Mana|Stamina|Defense)$/i, key: (match) => match[2], format: (val, match) => `+${val} ${match[2]}` },
            { regex: /^\+(\d+)\s+to\s+Attack\s+Rating$/i, key: 'Attack Rating', format: (val) => `+${val} to Attack Rating` },
            { regex: /^\+(\d+)%\s+(.+)$/i, key: (match) => `% ${match[2]}`, format: (val, match) => `+${val}% ${match[2]}` },
            { regex: /^(Regenerate\s+Mana)\s+(\d+)%$/i, key: (match) => match[1], format: (val, match) => `${match[1]} ${val}%` },
            { regex: /^(Replenish\s+Life)\s+\+(\d+)$/i, key: (match) => match[1], format: (val, match) => `${match[1]} +${val}` },
            { regex: /^\+(\d+)\s+(.+)$/i, key: (match) => match[2], format: (val, match) => `+${val} ${match[2]}` }
        ];

        let matched = false;

        for (const pattern of patterns) {
            const match = trimmedStat.match(pattern.regex);
            if (match) {
                matched = true;
                const value = parseInt(match[1]) || parseInt(match[2]);
                const key = typeof pattern.key === 'function' ? pattern.key(match) : pattern.key;
                statMap.set(key, (statMap.get(key) || 0) + value);
                break;
            }
        }

        if (!matched) {
            if (!nonNumericStats.includes(trimmedStat)) {
                nonNumericStats.push(trimmedStat);
            }
        }
    });

    // Convert back to formatted strings
    const result = [];

    statMap.forEach((value, key) => {
        const pattern = patterns.find(p => {
            const testKey = typeof p.key === 'function' ? 'test' : p.key;
            return testKey === key || key.includes(testKey) || testKey.includes(key);
        });

        if (pattern && pattern.format) {
            result.push(pattern.format(value, { 1: value, 2: key }));
        } else {
            if (key.includes('Resist')) {
                result.push(`${key} +${value}%`);
            } else if (key.includes('%')) {
                result.push(`+${value}${key}`);
            } else {
                result.push(`+${value} ${key}`);
            }
        }
    });

    result.push(...nonNumericStats);
    return result;
}


function getBaseWeaponType(selectedWeapon) {
    return getItemBaseType(selectedWeapon);
}

function getItemBaseType(selectedItem) {
    const itemData = itemList[selectedItem];
    if (!itemData) {
        console.error("No item data found for:", selectedItem);
        return null;
    }

    const descriptionParts = itemData.description.split("<br>");
    const baseType = descriptionParts[1].trim();

    return baseType;
}


// Initialize sockets on page load
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM Ready - starting detailed dropdown debug');
    
    // First, let's check if all dropdowns exist
    Object.keys(SECTION_MAP).forEach((dropdownId) => {
        const dropdown = document.getElementById(dropdownId);
        console.log(`Dropdown check - ${dropdownId}:`, {
            exists: !!dropdown,
            hasOptions: dropdown ? dropdown.options.length : 0,
            value: dropdown ? dropdown.value : 'N/A'
        });
    });
    
    // Now let's try to set up listeners with more error handling
    Object.keys(SECTION_MAP).forEach((dropdownId) => {
        try {
            const dropdown = document.getElementById(dropdownId);
            
            if (!dropdown) {
                console.warn(`❌ Dropdown ${dropdownId} not found`);
                return;
            }
            
            console.log(`✅ Setting up ${dropdownId}`);
            
            // Test if we can access the dropdown properties
            console.log(`${dropdownId} properties:`, {
                id: dropdown.id,
                tagName: dropdown.tagName,
                optionsCount: dropdown.options.length
            });
            
            dropdown.addEventListener("change", () => {
                console.log(`🔄 ${dropdownId} changed`);
                const section = SECTION_MAP[dropdownId];
                
                if (!section) {
                    console.error('No section found for dropdown:', dropdownId);
                    return;
                }

                if (['helm', 'armor', 'weapon', 'shield'].includes(section)) {
                    console.log(`🔧 Force updating sockets for ${section}`);
                    forceUpdateSockets(section);
                }

                setTimeout(() => {
                    console.log(`📊 Updating socket info for ${section}`);
                    updateSocketInfo(section);
                }, 100);
            });
            
            console.log(`✅ Successfully set up listener for ${dropdownId}`);
            
        } catch (error) {
            console.error(`❌ Error setting up ${dropdownId}:`, error);
        }
    });
    
    console.log('🏁 Dropdown initialization complete');
    
    // Continue with rest of initialization...
    console.log('Starting socket system initialization...');

// Add debugging for dependencies
console.log('Checking dependencies:');
console.log('- itemList:', typeof itemList !== 'undefined' ? 'EXISTS' : 'MISSING');
console.log('- calculateItemDamage:', typeof calculateItemDamage !== 'undefined' ? 'EXISTS' : 'MISSING');
console.log('- showItemModal:', typeof showItemModal !== 'undefined' ? 'EXISTS' : 'MISSING');
console.log('- maxSockets:', typeof maxSockets !== 'undefined' ? 'EXISTS' : 'MISSING');

// Try to access some specific functions
try {
    console.log('Testing forceUpdateSockets function...');
    if (typeof forceUpdateSockets === 'function') {
        console.log('✅ forceUpdateSockets is defined');
    } else {
        console.log('❌ forceUpdateSockets is NOT defined');
    }
} catch (e) {
    console.error('❌ Error accessing forceUpdateSockets:', e);
}

try {
    console.log('Testing updateSocketInfo function...');
    if (typeof updateSocketInfo === 'function') {
        console.log('✅ updateSocketInfo is defined');
    } else {
        console.log('❌ updateSocketInfo is NOT defined');
    }
} catch (e) {
    console.error('❌ Error accessing updateSocketInfo:', e);
}

// Test if we can call forceUpdateSockets safely
try {
    console.log('Testing forceUpdateSockets call with "weapon"...');
    forceUpdateSockets('weapon');
    console.log('✅ forceUpdateSockets call succeeded');
} catch (e) {
    console.error('❌ forceUpdateSockets call failed:', e);
}

console.log('Socket system initialization debug complete');
});
// Try multiple times with delays


function forceUpdateSockets(section) {
    console.log('forceUpdateSockets called for section:', section);

    if (!section) {
        console.error('forceUpdateSockets called with undefined section');
        return;
    }

    // Get the selected item
    const dropdownId = `${section}s-dropdown`;
    console.log('Looking for dropdown:', dropdownId);
    
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value) {
        console.log('Dropdown not found or no value:', dropdown);
        return;
    }

    const selectedItem = dropdown.value;
    console.log('Selected item:', selectedItem);

    // Get the base type
    let baseType;
    try {
        if (section === "weapon") {
            console.log('Getting base weapon type...');
            baseType = getBaseWeaponType(selectedItem);
            console.log('Base weapon type result:', baseType);
        } else {
            console.log('Getting base item type for non-weapon...');
            const itemData = itemList[selectedItem];
            console.log('Item data:', itemData);
            baseType = itemData.description.split("<br>")[1].trim();
            console.log('Base type from description:', baseType);
        }
    } catch (e) {
        console.error("Error getting base type:", e);
        baseType = "";
    }

    console.log('Final base type:', baseType);

    // Get the maximum allowed sockets for this base type
    const maxBaseAllowed = maxSockets[baseType] !== undefined ? maxSockets[baseType] : 2;
    console.log(`[forceUpdateSockets] Item: ${selectedItem}, Base: ${baseType}, Max sockets: ${maxBaseAllowed}`);

    // Check if there's a socket corruption
    const containerClass = section === "weapon" ? "weaponsockets" : `${section}sockets`;
    console.log('Looking for container with class:', containerClass);
    
    const container = document.querySelector(`.${containerClass}`);
    console.log('Container found:', container);

    // Check typeCorruptions
    console.log('Checking typeCorruptions...');
    console.log('typeCorruptions object:', typeof typeCorruptions !== 'undefined' ? typeCorruptions : 'UNDEFINED');
    
    // Continue with rest of function...
    console.log('Continuing forceUpdateSockets...');
}

function refreshSocketProperties() {
    console.log('refreshSocketProperties called');

    const sections = ['helm', 'armor', 'weapon', 'shield'];

    sections.forEach(section => {
        updateSocketInfo(section);
    });

    // Update weapon specific displays if they exist
    if (document.querySelector('.socketz[data-section="weapon"]')) {
        if (typeof updateWeaponDamageDisplay === 'function') {
            updateWeaponDamageDisplay();
        }
        if (typeof updateWeaponDescription === 'function') {
            updateWeaponDescription();
        }
    }
}

function updateSocketInfo(section) {
    console.log('updateSocketInfo called with section:', section);

    // Validate section parameter
    if (!section) {
        console.error('Section parameter is undefined!');
        return;
    }

    const sockets = document.querySelectorAll(`.socketz[data-section="${section}"]`);

    // Update BOTH the main info container AND the separate stats container
    updateMainInfoContainer(section, sockets);
    updateSeparateStatsContainer(section, sockets);
}

function updateMainInfoContainer(section, sockets) {
    const infoContainerId = {
        helm: "helm-info",
        armor: "armor-info",
        weapon: "weapon-info",
        shield: "off-info",
        glove: "glove-info",
        belt: "belt-info",
        boot: "boot-info",
        ringOne: "ringsone-info",
        ringTwo: "ringstwo-info",
        amulet: "amulet-info"
    }[section];

    const infoContainer = document.getElementById(infoContainerId);
    if (!infoContainer) return;

    // Save corruption info
    const corruptedMod = infoContainer.querySelector(".corrupted-mod");
    const corruptedText = infoContainer.querySelector(".corrupted-text");

    // Remove existing socket stats from main container
    const existingStats = infoContainer.querySelector(".socket-stats");
    if (existingStats) {
        existingStats.remove();
    }

    // Build combined stats for main container (don't merge, show all individually)
    const combinedStats = [];
    sockets.forEach((socket) => {
        if (socket.dataset.itemName && socket.dataset.stats) {
            let socketStats = socket.dataset.stats;
            try {
                if (socket.dataset.itemName === "jewel") {
                    socketStats = JSON.parse(socket.dataset.stats);
                }
                if (Array.isArray(socketStats)) {
                    combinedStats.push(...socketStats);
                } else {
                    const statsArray = socketStats.split(/\n/).filter(s => s.trim());
                    combinedStats.push(...statsArray);
                }
            } catch (e) {
                combinedStats.push(socketStats);
            }
        }
    });

    // Add socket stats to main container (unmerged)
    if (combinedStats.length > 0) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'socket-stats';

        combinedStats.forEach(stat => {
            const statDiv = document.createElement('div');
            statDiv.textContent = stat;
            statDiv.style.color = '#7d49ff';
            statsContainer.appendChild(statDiv);
        });

        infoContainer.appendChild(statsContainer);
    }

    // Restore corruption info
    if (corruptedMod) infoContainer.appendChild(corruptedMod);
    if (corruptedText) infoContainer.appendChild(corruptedText);
}

function updateSeparateStatsContainer(section, sockets) {
    console.log('Updating separate stats container for section:', section);

    const separateStatsId = {
        helm: "helmsocketstats",
        weapon: "weaponsocketstats",
        armor: "armorsocketstats",
        shield: "shieldsocketstats"
    }[section];

    const separateStatsContainer = document.getElementById(separateStatsId);
    if (!separateStatsContainer) {
        console.log('No separate stats container found for', section);
        return;
    }

    // Collect all stats from sockets
    const allStats = [];
    sockets.forEach(socket => {
        if (socket.dataset.itemName && socket.dataset.stats) {
            let stats = socket.dataset.stats;

            if (socket.dataset.itemName === 'jewel') {
                try {
                    stats = JSON.parse(stats);
                    if (Array.isArray(stats)) {
                        allStats.push(...stats);
                    } else {
                        allStats.push(stats);
                    }
                } catch (e) {
                    const splitStats = stats.split('\n').filter(s => s.trim());
                    allStats.push(...splitStats);
                }
            } else {
                const splitStats = stats.split('\n').filter(s => s.trim());
                allStats.push(...splitStats);
            }
        }
    });

    // Clear and update container  
    separateStatsContainer.innerHTML = '';

    if (allStats.length === 0) {
        separateStatsContainer.innerHTML = '<div style="color: #666;">No socketables socketed</div>';
    } else {
        // Use mergeNumericStats to combine similar stats
        const mergedStats = mergeNumericStats(allStats);
        mergedStats.forEach(stat => {
            const statDiv = document.createElement('div');
            statDiv.textContent = stat;
            statDiv.style.color = '#7d49ff';
            separateStatsContainer.appendChild(statDiv);
        });
    }
}

function updateSocketCount(section, socketCount) {
    console.log('updateSocketCount called for section:', section, 'count:', socketCount);

    if (!section) {
        console.error('updateSocketCount called with undefined section');
        return;
    }

    const containerClass = section === "weapon" ? "weaponsockets" : `${section}sockets`;
    const container = document.querySelector(`.${containerClass}`);

    if (!container) {
        console.log(`Container not found for ${section}`);
        return;
    }

    // Get the current item
    const dropdownId = `${section}s-dropdown`;
    const dropdown = document.getElementById(dropdownId);
    const currentItem = dropdown.value;

    // Get the base type
    let baseType;
    if (section === "weapon") {
        baseType = getBaseWeaponType(currentItem);
    } else {
        try {
            const itemData = itemList[currentItem];
            baseType = itemData.description.split("<br>")[1].trim();
        } catch (e) {
            console.error("Error getting base type:", e);
            baseType = "";
        }
    }

    // Get the maximum allowed sockets for this base type
    const maxBaseAllowed = maxSockets[baseType] !== undefined ? maxSockets[baseType] : 2;

    // If item cannot have sockets, clear container and return
    if (maxBaseAllowed === 0 || socketExceptions.noSockets.includes(currentItem)) {
        // Remove any socketed items (clear their data first)
        const sockets = container.querySelectorAll(".socketz");
        sockets.forEach((socket) => {
            if (socket.dataset.itemName) {
                clearSocket(socket, true);
            }
        });

        // Then clear the container
        container.innerHTML = "";
        return;
    }

    // Save existing socket data for reuse
    const currentSockets = Array.from(container.querySelectorAll(".socketz"));
    const filledSocketsData = currentSockets
        .filter((socket) => socket.dataset.itemName)
        .slice(0, socketCount)
        .map((socket) => ({
            itemName: socket.dataset.itemName,
            stats: socket.dataset.stats,
            html: socket.innerHTML,
        }));

    // Determine how many sockets to display
    const maxAllowedSockets = socketExceptions.maxOneSocket.includes(currentItem) ? 1 : Math.min(socketCount, maxBaseAllowed);

    console.log(`[updateSocketCount] Creating ${maxAllowedSockets} sockets for ${currentItem} (${baseType})`);

    // Clear and rebuild the socket UI
    container.innerHTML = "";

    for (let i = 0; i < maxAllowedSockets; i++) {
        const socket = document.createElement("div");
        socket.className = "socketz empty";
        socket.dataset.section = section;
        socket.dataset.index = i;

        if (filledSocketsData[i]) {
            socket.className = "socketz filled";
            socket.dataset.itemName = filledSocketsData[i].itemName;
            socket.dataset.stats = filledSocketsData[i].stats;
            socket.innerHTML = filledSocketsData[i].html;
        }

        socket.addEventListener("click", (e) => {
            e.stopPropagation();
            currentSocket = socket;
            showItemModal();
        });

        socket.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            clearSocket(socket);
            refreshSocketProperties();
        });

        container.appendChild(socket);
    }

    refreshSocketProperties();
}

function clearSocket(socket, force = false) {
    console.log('clearSocket called');

    socket.classList.remove("filled");
    socket.classList.add("empty");
    socket.innerHTML = "";
    delete socket.dataset.itemName;
    delete socket.dataset.stats;

    const section = socket.dataset.section;
    console.log('clearSocket called for section:', section);

    if (!section) {
        console.error('Socket has no section data attribute!');
        return;
    }

    // Update socket info
    updateSocketInfo(section);

    // If this is a weapon, update description and damage
    if (section === "weapon") {
        if (typeof updateWeaponDescription === 'function') {
            updateWeaponDescription();
        }
        if (typeof updateWeaponDamageDisplay === 'function') {
            updateWeaponDamageDisplay();
        }
    }
}

// Corruption definitions (unchanged from original)
const helmCorruptions = [
    { mod: "Socketed ([1-3])", type: "numeric", range: [1, 3] },
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "Indestructible , +[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+[150-250] to Attack Rating, +[2-4] to Light Radius", type: "double", range: [[150, 250], [2, 4]] },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "[3-5]% Life Stolen per Hit", type: "numeric", range: [3, 5] },
    { mod: "All Resistances +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "Replenish Life +[20-30]", type: "numeric", range: [20, 30] },
    { mod: "[3-5]% Mana Stolen per Hit", type: "numeric", range: [3, 5] },
    { mod: "Physical Damage Taken Reduced by [4-6]%", type: "numeric", range: [4, 6] },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    { mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +15%", type: "numeric", range: [4, 5] },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "+[3-4] Life after each Kill", type: "numeric", range: [3, 4] },
    { mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +15%", type: "numeric", range: [4, 5] },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    { mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +15%", type: "numeric", range: [4, 5] },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +15%", type: "numeric", range: [4, 5] },
];

const armorCorruptions = [
    { mod: "Socketed ([2-4])", type: "numeric", range: [2, 4] },
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [30, 30] },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "+[30-40] Mana", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Indestructible, +[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+20% Faster Run/Walk", type: "fixed" },
    { mod: "+10% Faster Block Rate, [10-20]% Increased Chance of Blocking", type: "numeric", range: [10, 20] },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Magic Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)", type: "fixed" },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    { mod: "Physical Damage Taken Reduced by [6-8]%", type: "numeric", range: [6, 8] },
    { mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +15%", type: "numeric", range: [4, 5] },
    { mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +15%", type: "numeric", range: [4, 5] },
    { mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +15%", type: "numeric", range: [4, 5] },
    { mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +15%", type: "numeric", range: [4, 5] },
];

const weaponCorruptions = [
    { mod: "Socketed ([2-6])", type: "numeric", range: [2, 6] },
    { mod: "+[40-80]% Enhanced Damage", type: "numeric", range: [40, 80] },
    { mod: "+[150-250] to Attack Rating", type: "numeric", range: [150, 250] },
    { mod: "+[100-150]% Enhanced Damage to Demons", type: "numeric", range: [100, 150] },
    { mod: "+200 to Attack Rating against Demons", type: "numeric", range: [200, 200] },
    { mod: "+[100-150]% Enhanced Damage to Undead", type: "numeric", range: [100, 150] },
    { mod: "+200 to Attack Rating against Undead", type: "numeric", range: [200, 200] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[3-6] Life after each Hit", type: "numeric", range: [3, 6] },
    { mod: "+[3-6] Life after each Kill", type: "numeric", range: [3, 6] },
    { mod: "+[3-5] to Mana after each Kill", type: "numeric", range: [3, 5] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "Requirements -[25-50]%", type: "numeric", range: [25, 50] },
    { mod: "+20% Faster Cast Rate", type: "fixed" },
    { mod: "+[30-40]% Increased Attack Speed", type: "numeric", range: [30, 40] },
    { mod: "+[40-60]% Enhanced Damage", type: "numeric", range: [40, 60] },
    { mod: "5% Life Stolen per Hit", type: "fixed" },
    { mod: "[-40-60] Target Defense per Hit", type: "numeric", range: [-40, -60] },
    { mod: "[20-30]% Chance of Crushing Blow", type: "numeric", range: [20, 30] },
    { mod: "[20-30]% Deadly Strike", type: "numeric", range: [20, 30] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+[30-40]% Increased Attack Speed", type: "numeric", range: [30, 40] },
    { mod: "+[20-20]% Increased Attack Speed, +[80-120]% Enhanced Damage", type: "double", range: [[20, 20], [80, 120]] },
    { mod: "[20-30]% Chance of Crushing Blow", type: "numeric", range: [20, 30] },
    { mod: "+[50-70]% Enhanced Damage", type: "numeric", range: [50, 70] },
    { mod: "25% Deadly Strike", type: "fixed" },
    { mod: "Ignores Target's Defense", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Fire Skill Damage", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Cold Skill Damage", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Lightning Skill Damage", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Poison Skill Damage", type: "numeric", range: [5, 10] },
];

const offCorruptions = [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "+20% Faster Block Rate", type: "fixed" },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "+[30-40] Life", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Cold Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Lightning Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Poison Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Block Rate", type: "fixed" },
    { mod: "[10-20]% Increased Chance of Blocking", type: "numeric", range: [10, 20] },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Magic Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)", type: "fixed" },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    { mod: "Physical Damage Taken Reduced by [6-8]%", type: "numeric", range: [6, 8] },
    { mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +[15-20]%", type: "double", range: [[4, 5], [15, 20]] },
    { mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +[15-20]%", type: "double", range: [[4, 5], [15, 20]] },
    { mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +[15-20]%", type: "double", range: [[4, 5], [15, 20]] },
    { mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +[15-20]%", type: "double", range: [[4, 5], [15, 20]] },
];

const gloveCorruptions = [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "Regenerate Mana [20-30]%", type: "numeric", range: [20, 30] },
    { mod: "+[10-20]% Faster Block Rate", type: "numeric", range: [10, 20] },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "[50-100]% Extra Gold from Monsters", type: "numeric", range: [50, 100] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "[10-25]% Better Chance of Getting Magic Items", type: "numeric", range: [10, 25] },
    { mod: "[2-3]% Life Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[2-3]% Mana Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "-[15-25]% Target Defense", type: "numeric", range: [-15, -25] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "10% Deadly Strike", type: "fixed" },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
];

const beltCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "Attacker Takes Damage of [2-396] ([2-4] per Level)", type: "fixed" },
    { mod: "[60-100]% Extra Gold from Monsters", type: "numeric", range: [60, 100] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    { mod: "Physical Damage Taken Reduced by [3-4]%", type: "numeric", range: [3, 4] },
];

const bootCorruptions = [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "Regenerate Mana [10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[50-100]% Extra Gold from Monsters", type: "numeric", range: [50, 100] },
    { mod: "[10-25]% Better Chance of Getting Magic Items", type: "numeric", range: [10, 25] },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Indestructible", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Block Rate", type: "fixed" },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "Replenish Life +[15-25]", type: "numeric", range: [15, 25] },
    { mod: "+15% Faster Run/Walk", type: "fixed" },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    { mod: "Physical Damage Taken Reduced by [3-4]%", type: "numeric", range: [3, 4] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+[2-3]% to Maximum Fire Resist, Fire Resist +10%", type: "numeric", range: [2, 3] },
    { mod: "+[2-3]% to Maximum Cold Resist, Cold Resist +10%", type: "numeric", range: [2, 3] },
    { mod: "+[2-3]% to Maximum Lightning Resist, Lightning Resist +10%", type: "numeric", range: [2, 3] },
    { mod: "+[2-3]% to Maximum Poison Resist, Poison Resist +10%", type: "numeric", range: [2, 3] },
];

const ringOneCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "Physical Damage Taken Reduced by [4-6]", type: "numeric", range: [4, 6] },
    { mod: "Magic Damage Taken Reduced by [4-6]", type: "numeric", range: [4, 6] },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    { mod: "[40-80]% Extra Gold from Monsters", type: "numeric", range: [40, 80] },
    { mod: "[15-20]% Better Chance of Getting Magic Items", type: "numeric", range: [15, 20] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "10% Reduced Curse Duration", type: "fixed" },
    { mod: "[3-4]% Mana Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "[3-4]% Life Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "+[4-6] to All Attributes", type: "numeric", range: [4, 6] },
    { mod: "All Resistances +[4-6]", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by 3%", type: "fixed" },
];

const ringTwoCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "Physical Damage Taken Reduced by [4-6]", type: "numeric", range: [4, 6] },
    { mod: "Magic Damage Taken Reduced by [4-6]", type: "numeric", range: [4, 6] },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    { mod: "[40-80]% Extra Gold from Monsters", type: "numeric", range: [40, 80] },
    { mod: "[15-20]% Better Chance of Getting Magic Items", type: "numeric", range: [15, 20] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "10% Reduced Curse Duration", type: "fixed" },
    { mod: "[3-4]% Mana Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "[3-4]% Life Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "+[4-6] to All Attributes", type: "numeric", range: [4, 6] },
    { mod: "All Resistances +[4-6]", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by 3%", type: "fixed" },
];

const amuletCorruptions = [
    { mod: "+[6-12] to Strength", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Dexterity", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Vitality", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Energy", type: "numeric", range: [6, 12] },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "+[10-20]% Chance to Pierce", type: "numeric", range: [10, 20] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[6-8] to All Attributes", type: "numeric", range: [6, 8] },
    { mod: "[60-100]% Extra Gold from Monsters", type: "numeric", range: [60, 100] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "All Resistances +[7-10]", type: "numeric", range: [7, 10] },
];

const quiverCorruptions = [
    { mod: "+20% Faster Hit Recovery", type: "fixed" },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    { mod: "[50-100]% Extra Gold from Monsters", type: "numeric", range: [50, 100] },
    { mod: "[10-25]% Better Chance of Getting Magic Items", type: "numeric", range: [10, 25] },
    { mod: "Fire Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Cold Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Lightning Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Poison Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "[-5-10]% to Enemy Fire Resistance", type: "numeric", range: [-5, -10] },
    { mod: "[-10-20]% Target Defense", type: "numeric", range: [-10, -20] },
    { mod: "+[50-100] to Attack Rating", type: "numeric", range: [50, 100] },
    { mod: "[2-4]% Mana Stolen per Hit", type: "numeric", range: [2, 4] },
    { mod: "[2-4]% Life Stolen per Hit", type: "numeric", range: [2, 4] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "+[10-15] to Minimum Damage", type: "numeric", range: [10, 15] },
    { mod: "+[10-15] to Maximum Damage", type: "numeric", range: [10, 15] },
    { mod: "Ignore Target's Defense", type: "fixed" },
    { mod: "All Resistances +[5-10]", type: "numeric", range: [5, 10] },
];

// Initialize corruption system


// Initialize corruption system
document.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem("typeCorruptions");

    const corruptionsByType = {
        helm: helmCorruptions,
        armor: armorCorruptions,
        weapon: weaponCorruptions,
        off: offCorruptions,
        glove: gloveCorruptions,
        belt: beltCorruptions,
        boot: bootCorruptions,
        ringOne: ringOneCorruptions,
        ringTwo: ringTwoCorruptions,
        amulet: amuletCorruptions,
        quiver: quiverCorruptions,
    };

    function createCorruptionUI() {
        const buttonsHTML = `
        <div class="corruption-buttons" style="display: flex; gap: 10px; margin: 10px 0;">
          <button id="corruptHelm" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 28, 28);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Helm</button>
          <button id="corruptArmor" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Armor</button>
          <button id="corruptWeapon" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Weapon</button>
          <button id="corruptShield" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Shield</button>
            <button id="corruptGlove" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Gloves</button>
            <button id="corruptBelt" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Belt</button>
            <button id="corruptBoot" class="corrupt-button" style="
            margin-left: px; 
            margin-top:  0px; 
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            cursor: pointer;
            ">Corrupt Boots</button>
            <button id="corruptRingOne" class="corrupt-button" style="
            margin-left: 0px; 
            margin-top:  0px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            cursor: pointer;
            ">Corrupt Ring One</button>
            <button id="corruptRingTwo" class="corrupt-button" style="
            margin-left: 0px; 
            margin-top:  0px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            cursor: pointer;
            ">Corrupt Ring Two</button>
            <button id="corruptAmulet" class="corrupt-button" style="
            margin-left: 0px; 
            margin-top:  0px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            cursor: pointer;
            ">Corrupt Amulet</button>
            <button id="corruptQuiver" class="corrupt-button" style="
            margin-left: 300px; 
            margin-top:  0pxx;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            cursor: pointer;
            ">Corrupt Quiver NOT AVAILABLE YET</button>
        </div>
      `;

        const modalHTML = `
        <div id="corruptionModal" class="corruption-modal" style="
          position: absolute;
          left: 1500px;
          z-index: 2;
          top: 150px;
          width: 100%;
          height: 700px;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
          display: none;
        ">
          <div class="corruption-content" style="
            background-color:rgb(15, 14, 14);
            margin: 15% auto;
            padding: 10px;
            border: 1px solid #888;
            width: 80%;
            max-height: 800px;
            max-width: 500px;
            border-radius: 10px;
          ">
            <h2 style="color: white; margin-bottom: 15px;">Select Corruption Modifier</h2>
            <div id="corruptionOptions" class="corruption-options"></div>
          </div>
        </div>
      `;

        document.body.insertAdjacentHTML("beforeend", modalHTML);
        document.body.insertAdjacentHTML("beforeend", buttonsHTML);
    }

    createCorruptionUI();

    function showModal(type) {
        const modal = document.getElementById("corruptionModal");
        const optionsContainer = document.getElementById("corruptionOptions");
        modal.style.display = "block";
        optionsContainer.innerHTML = "";

        const corruptions = corruptionsByType[type];

        corruptions.forEach((mod) => {
            const modContainer = document.createElement("div");
            modContainer.className = "corruption-option-container";

            const button = document.createElement("button");
            button.className = "corruption-option";

            if (mod.type === "numeric") {
                const sliderContainer = document.createElement("div");
                sliderContainer.className = "corruption-slider-container";
                sliderContainer.style.display = "none";

                const slider = document.createElement("input");
                slider.type = "range";
                slider.min = mod.range[0];
                slider.max = mod.range[1];
                slider.value = mod.range[0];
                slider.className = "corruption-slider";

                const value = document.createElement("span");
                value.className = "corruption-slider-value";
                value.textContent = slider.value;

                slider.oninput = () => {
                    value.textContent = slider.value;
                    button.textContent = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
                };

                sliderContainer.appendChild(slider);
                sliderContainer.appendChild(value);

                button.onclick = () => {
                    document
                        .querySelectorAll(".corruption-slider-container")
                        .forEach((container) => {
                            container.style.display = "none";
                        });
                    sliderContainer.style.display = "block";
                };

                const confirm = document.createElement("button");
                confirm.className = "corruption-confirm";
                confirm.textContent = "Confirm";
                confirm.onclick = () => {
                    const modWithValue = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
                    selectMod({ ...mod, mod: modWithValue }, type);
                };
                sliderContainer.appendChild(confirm);

                modContainer.appendChild(button);
                modContainer.appendChild(sliderContainer);
            } else if (mod.type === "double") {
                const sliderContainer = document.createElement("div");
                sliderContainer.className = "corruption-slider-container";
                sliderContainer.style.display = "none";
                sliderContainer.style.padding = "10px";

                button.textContent = mod.mod;

                const group1 = document.createElement("div");
                group1.style.marginBottom = "15px";

                const label1 = document.createElement("div");
                label1.textContent = "Attack Rating:";
                label1.style.marginBottom = "5px";
                label1.style.color = "white";

                const slider1 = document.createElement("input");
                slider1.type = "range";
                slider1.min = mod.range[0][0];
                slider1.max = mod.range[0][1];
                slider1.value = mod.range[0][0];
                slider1.className = "corruption-slider";

                const value1 = document.createElement("span");
                value1.className = "corruption-slider-value";
                value1.textContent = slider1.value;
                value1.style.marginLeft = "10px";
                value1.style.color = "white";

                group1.appendChild(label1);
                group1.appendChild(slider1);
                group1.appendChild(value1);

                const group2 = document.createElement("div");
                group2.style.marginBottom = "15px";

                const label2 = document.createElement("div");
                label2.textContent = "Light Radius:";
                label2.style.marginBottom = "5px";
                label2.style.color = "white";

                const slider2 = document.createElement("input");
                slider2.type = "range";
                slider2.min = mod.range[1][0];
                slider2.max = mod.range[1][1];
                slider2.value = mod.range[1][0];
                slider2.className = "corruption-slider";

                const value2 = document.createElement("span");
                value2.className = "corruption-slider-value";
                value2.textContent = slider2.value;
                value2.style.marginLeft = "10px";
                value2.style.color = "white";

                group2.appendChild(label2);
                group2.appendChild(slider2);
                group2.appendChild(value2);

                const confirm = document.createElement("button");
                confirm.className = "corruption-confirm";
                confirm.textContent = "Confirm";
                confirm.style.marginTop = "10px";
                confirm.style.padding = "5px 10px";
                confirm.onclick = () => {
                    const modWithValues = mod.mod
                        .replace(/\[\d+-\d+\]/, slider1.value)
                        .replace(/\[\d+-\d+\]/, slider2.value);
                    selectMod({ ...mod, mod: modWithValues }, type);
                };

                const updateButtonText = () => {
                    button.textContent = mod.mod
                        .replace(/\[\d+-\d+\]/, slider1.value)
                        .replace(/\[\d+-\d+\]/, slider2.value);
                };

                slider1.oninput = () => {
                    value1.textContent = slider1.value;
                    updateButtonText();
                };

                slider2.oninput = () => {
                    value2.textContent = slider2.value;
                    updateButtonText();
                };

                button.onclick = () => {
                    document
                        .querySelectorAll(".corruption-slider-container")
                        .forEach((container) => {
                            container.style.display = "none";
                        });
                    sliderContainer.style.display = "block";
                };

                sliderContainer.appendChild(group1);
                sliderContainer.appendChild(group2);
                sliderContainer.appendChild(confirm);

                modContainer.appendChild(button);
                modContainer.appendChild(sliderContainer);

                optionsContainer.appendChild(modContainer);
                return;
            }

            button.textContent = mod.mod;
            optionsContainer.appendChild(modContainer);
        });
    }

    function selectMod(mod, type) {
        if (mod.mod.includes("Socketed")) {
            const socketMatch = mod.mod.match(/\((\d+)\)/);
            if (!socketMatch) {
                return;
            }

            const requestedSocketCount = parseInt(socketMatch[1]);
            console.log(`Requested socket corruption: ${requestedSocketCount} sockets for ${type}`);

            let baseType, selectedItem;

            if (type === "weapon") {
                const weaponSelect = document.getElementById("weapons-dropdown");
                selectedItem = weaponSelect.value;
                baseType = getBaseWeaponType(selectedItem);
            } else if (type === "helm") {
                const helmSelect = document.getElementById("helms-dropdown");
                selectedItem = helmSelect.value;
                baseType = getItemBaseType(selectedItem);
            } else if (type === "armor") {
                const armorSelect = document.getElementById("armors-dropdown");
                selectedItem = armorSelect.value;
                baseType = getItemBaseType(selectedItem);
            } else if (type === "off") {
                const offSelect = document.getElementById("offs-dropdown");
                selectedItem = offSelect.value;
                baseType = getItemBaseType(selectedItem);
            } else {
                typeCorruptions[type] = mod.mod;
                localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));
                updateCorruptionDisplay(type, mod.mod);

                if (type === "weapon") {
                    applyWeaponCorruption(mod.mod);
                }

                return true;
            }

            const maxAllowed = maxSockets[baseType] !== undefined ? maxSockets[baseType] : 2;
            console.log(`Base type: ${baseType}, Max allowed: ${maxAllowed}`);

            if (maxAllowed === 0) {
                alert(`${selectedItem} (${baseType}) cannot have sockets.`);
                document.getElementById("corruptionModal").style.display = "none";
                return false;
            }

            const actualSockets = Math.min(requestedSocketCount, maxAllowed);
            console.log(`Resulting sockets: ${actualSockets}`);

            const corruptionText = `Socketed (${actualSockets})`;
            typeCorruptions[type] = corruptionText;
            localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));

            updateCorruptionDisplay(type, corruptionText);
            updateSocketCount(type, actualSockets);

            document.getElementById("corruptionModal").style.display = "none";
            return true;
        } else {
            if (type === "weapon") {
                const weaponSelect = document.getElementById("weapons-dropdown");
                if (weaponSelect) {
                    const currentItem = weaponSelect.value;
                    const currentItemData = itemList[currentItem];

                    if (currentItemData) {
                        resetCorruptionEnhancedDamage(currentItemData);

                        if (mod.mod.includes("Enhanced Damage")) {
                            const edmgMatch = mod.mod.match(/\+(\d+)%\s*Enhanced\s*Damage/i);
                            if (edmgMatch) {
                                const corruptionEdmg = parseInt(edmgMatch[1]);
                                currentItemData.properties.edmgFromCorruption = corruptionEdmg;
                                currentItemData.properties.edmg = (currentItemData.properties.edmg || 0) + corruptionEdmg;
                            }
                        }
                    }
                }
            }

            typeCorruptions[type] = mod.mod;
            localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));
            updateCorruptionDisplay(type, mod.mod);

            if (type === "weapon") {
                const weaponSelect = document.getElementById("weapons-dropdown");
                if (weaponSelect) {
                    const currentItem = weaponSelect.value;
                    const currentItemData = itemList[currentItem];

                    if (currentItemData) {
                        const baseType = currentItemData.description.split("<br>")[1];
                        const isTwoHanded = currentItemData.properties.twohandmin !== undefined;

                        if (isTwoHanded) {
                            const newMin = calculateItemDamage(currentItemData, baseType, false);
                            const newMax = calculateItemDamage(currentItemData, baseType, true);

                            currentItemData.properties.twohandmin = newMin;
                            currentItemData.properties.twohandmax = newMax;

                            const minContainer = document.getElementById("twohandmindmgcontainer");
                            const maxContainer = document.getElementById("twohandmaxdmgcontainer");
                            if (minContainer) minContainer.textContent = newMin;
                            if (maxContainer) maxContainer.textContent = newMax;
                        } else {
                            const newMin = calculateItemDamage(currentItemData, baseType, false);
                            const newMax = calculateItemDamage(currentItemData, baseType, true);

                            currentItemData.properties.onehandmin = newMin;
                            currentItemData.properties.onehandmax = newMax;

                            const minContainer = document.getElementById("onehandmindmgcontainer");
                            const maxContainer = document.getElementById("onehandmaxdmgcontainer");
                            if (minContainer) minContainer.textContent = newMin;
                            if (maxContainer) maxContainer.textContent = newMax;
                        }

                        const weaponInfo = document.getElementById("weapon-info");
                        if (weaponInfo) {
                            const lines = currentItemData.description.split("<br>");
                            const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";
                            const min = isTwoHanded ? currentItemData.properties.twohandmin : currentItemData.properties.onehandmin;
                            const max = isTwoHanded ? currentItemData.properties.twohandmax : currentItemData.properties.onehandmax;

                            for (let i = 0; i < lines.length; i++) {
                                if (lines[i].includes("Damage:")) {
                                    lines[i] = `${damageType} Damage: ${min}-${max}`;
                                    break;
                                }
                            }

                            const corruptedMod = weaponInfo.querySelector(".corrupted-mod");
                            const corruptedText = weaponInfo.querySelector(".corrupted-text");
                            const socketStats = weaponInfo.querySelector(".socket-stats");

                            currentItemData.description = lines.join("<br>");
                            weaponInfo.innerHTML = currentItemData.description;

                            if (socketStats) weaponInfo.appendChild(socketStats);
                            if (corruptedMod) weaponInfo.appendChild(corruptedMod);
                            if (corruptedText) weaponInfo.appendChild(corruptedText);
                        }
                    }
                }
            }

            document.getElementById("corruptionModal").style.display = "none";
            return true;
        }
    }

    function getItemBaseType(selectedItem) {
        const itemData = itemList[selectedItem];
        if (!itemData) {
            console.error("No item data found for:", selectedItem);
            return null;
        }

        const descriptionParts = itemData.description.split("<br>");
        const baseType = descriptionParts[1].trim();

        return baseType;
    }

    function getBaseWeaponType(selectedWeapon) {
        return getItemBaseType(selectedWeapon);
    }

    function updateCorruptionDisplay(type, corruptionMod) {
        const containerMap = {
            ringOne: "ringsone-info",
            ringTwo: "ringstwo-info",
        };

        const containerId = containerMap[type] || `${type}-info`;
        const container = document.getElementById(containerId);

        if (!container) return;

        const existingMod = container.querySelector(".corrupted-mod");
        const existingText = container.querySelector(".corrupted-text");
        if (existingMod) existingMod.remove();
        if (existingText) existingText.remove();

        const resultDiv = document.createElement("div");
        resultDiv.className = "corrupted-mod";
        resultDiv.style.color = "#ff5555";
        resultDiv.textContent = corruptionMod;

        const corruptedText = document.createElement("div");
        corruptedText.className = "corrupted-text";
        corruptedText.style.color = "#ff5555";
        corruptedText.textContent = "Corrupted";

        container.appendChild(resultDiv);
        container.appendChild(corruptedText);
    }

    function restoreCorruptions() {
        const types = [
            { type: "helm", containerId: "helm-info" },
            { type: "armor", containerId: "armor-info" },
            { type: "weapon", containerId: "weapon-info" },
            { type: "off", containerId: "off-info" },
            { type: "glove", containerId: "glove-info" },
            { type: "belt", containerId: "belt-info" },
            { type: "boot", containerId: "boot-info" },
            { type: "ringOne", containerId: "ringsone-info" },
            { type: "ringTwo", containerId: "ringstwo-info" },
            { type: "amulet", containerId: "amulet-info" },
            { type: "quiver", containerId: "quiver-info" },
        ];

        types.forEach(({ type, containerId }) => {
            const corruption = typeCorruptions[type];
            if (!corruption) return;

            const dropdownId = `${type}s-dropdown`;
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;

            const selectedItem = dropdown.value;
            if (!selectedItem) return;

            if (corruption.includes("Socketed")) {
                const socketMatch = corruption.match(/\((\d+)\)/);
                if (socketMatch) {
                    const currentSockets = parseInt(socketMatch[1]);

                    let baseType;
                    if (type === "weapon") {
                        baseType = getBaseWeaponType(selectedItem);
                    } else {
                        try {
                            const itemData = itemList[selectedItem];
                            baseType = itemData.description.split("<br>")[1].trim();
                        } catch (e) {
                            console.error("Error getting base type:", e);
                            baseType = "";
                        }
                    }

                    const maxAllowed = maxSockets[baseType] || 2;

                    console.log(`Item: ${selectedItem}, Base: ${baseType}, Max allowed: ${maxAllowed}, Current: ${currentSockets}`);

                    if (maxAllowed === 0) {
                        console.log("Item cannot have sockets, removing socket corruption");

                        const container = document.getElementById(containerId);
                        const corruptedMod = container.querySelector(".corrupted-mod");
                        const corruptedText = container.querySelector(".corrupted-text");

                        if (corruptedMod) corruptedMod.remove();
                        if (corruptedText) corruptedText.remove();

                        delete typeCorruptions[type];
                        localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));

                        updateSocketCount(type, 0);
                        return;
                    }

                    const adjustedSockets = Math.min(currentSockets, maxAllowed);

                    if (adjustedSockets !== currentSockets) {
                        typeCorruptions[type] = `Socketed (${adjustedSockets})`;
                        localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));
                    }

                    updateCorruptionDisplay(type, `Socketed (${adjustedSockets})`);
                    setTimeout(() => updateSocketCount(type, adjustedSockets), 50);
                    return;
                }
            }

            updateCorruptionDisplay(type, corruption);
            if (type === "weapon" && corruption.includes("Enhanced Damage")) {
                setTimeout(() => {
                    applyWeaponCorruption(corruption);
                }, 100);
            }
        });
    }

    const elementsToWatch = [
        "lvlValue",
        "str",
        "dex",
        "vit",
        "enr",
        "helms-dropdown",
        "armors-dropdown",
        "weapons-dropdown",
        "offs-dropdown",
        "gloves-dropdown",
        "belts-dropdown",
        "boots-dropdown",
        "ringsone-dropdown",
        "ringstwo-dropdown",
        "amulets-dropdown",
    ];

    elementsToWatch.forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener("change", restoreCorruptions);
            element.addEventListener("input", restoreCorruptions);
        }
    });

    restoreCorruptions();

    document.getElementById("corruptHelm").addEventListener("click", () => showModal("helm"));
    document.getElementById("corruptArmor").addEventListener("click", () => showModal("armor"));
    document.getElementById("corruptWeapon").addEventListener("click", () => showModal("weapon"));
    document.getElementById("corruptShield").addEventListener("click", () => showModal("off"));
    document.getElementById("corruptGlove").addEventListener("click", () => showModal("glove"));
    document.getElementById("corruptBelt").addEventListener("click", () => showModal("belt"));
    document.getElementById("corruptBoot").addEventListener("click", () => showModal("boot"));
    document.getElementById("corruptRingOne").addEventListener("click", () => showModal("ringOne"));
    document.getElementById("corruptRingTwo").addEventListener("click", () => showModal("ringTwo"));
    document.getElementById("corruptAmulet").addEventListener("click", () => showModal("amulet"));
    document.getElementById("corruptQuiver").addEventListener("click", () => showModal("quiver"));

    window.addEventListener("click", (event) => {
        const modal = document.getElementById("corruptionModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Expose globals
    window.typeCorruptions = typeCorruptions;
});

// Remaining socket and corruption functions
const maxSockets = {
    "Hand Axe": 2,
    Axe: 4,
    "Double Axe": 5,
    "Military Pick": 6,
    "War Axe": 6,
    "Large Axe": 4,
    "Broad Axe": 5,
    "Battle Axe": 5,
    "Great Axe": 6,
    "Giant Axe": 6,
    Club: 2,
    "Spiked Club": 2,
    Mace: 2,
    "Morning Star": 3,
    Flail: 5,
    "War Hammer": 4,
    Maul: 6,
    "Great Maul": 6,
    "Short Sword": 2,
    Scimitar: 2,
    Sabre: 2,
    Falchion: 2,
    "Crystal Sword": 6,
    "Broad Sword": 4,
    "Long Sword": 4,
    "War Sword": 3,
    "Two-Handed Sword": 3,
    Claymore: 4,
    "Giant Sword": 4,
    "Bastard Sword": 4,
    "Great Sword": 6,
    "Executioner Sword": 6,
    "Colossus Blade": 6,
    Flamberge: 5,
    Dagger: 1,
    Poignard: 1,
    "Bone Knife": 1,
    Rondel: 1,
    "Mithril Point": 1,
    Cinquedeas: 1,
    "Fanged Knife": 1,
    Stiletto: 1,
    "Legend Spike": 1,
    Dirk: 1,
    Kris: 3,
    Blade: 2,
    "Maiden Javelin": 0,
    "Ceremonial Javelin": 0,
    "Matriarchal Javelin": 0,
    Cap: 2,
    "Skull Cap": 2,
    Helm: 2,
    "Full Helm": 2,
    Mask: 3,
    "Bone Helm": 2,
    "Great Helm": 3,
    Crown: 3,
    "War Hat": 2,
    Sallet: 2,
    Casque: 2,
    Basinet: 2,
    "Death Mask": 3,
    "Grim Helm": 2,
    "Winged Helm": 3,
    "Grand Crown": 3,
    Shako: 2,
    Hydraskull: 2,
    Armet: 2,
    "Giant Conch": 2,
    Demonhead: 3,
    "Bone Visage": 3,
    "Spired Helm": 3,
    Corona: 3,
    Circlet: 2,
    Coronet: 2,
    Tiara: 3,
    Diadem: 3,
    "Wolf Head": 3,
    "Hawk Helm": 3,
    Antlers: 3,
    "Falcon Mask": 3,
    "Spirit Mask": 3,
    "Alpha Helm": 3,
    "Griffon Headress": 3,
    "Hunter's Guise": 3,
    "Sacred Feathers": 3,
    "Totemic Mask": 3,
    "Blood Spirit": 3,
    "Sun Spirit": 3,
    "Earth Spirit": 3,
    "Sky Spirit": 3,
    "Dream Spirit": 3,
    "Jawbone Cap": 3,
    "Fanged Helm": 3,
    "Horned Helm": 3,
    "Assault Helmet": 3,
    "Avenger Guard": 3,
    "Jawbone Visor": 3,
    "Lion Helm": 3,
    "Rage Mask": 3,
    "Savage Helmet": 3,
    "Slayer Guard": 3,
    "Carnage Helm": 3,
    "Fury Visor": 3,
    "Destroyer Helm": 3,
    "Conquerer Crown": 3,
    "Guardian Crown": 3,
    "Quilted Armor": 2,
    "Leather Armor": 2,
    "Hard Leather Armor": 2,
    "Studded Leather": 2,
    "Ring Mail": 3,
    "Scale Mail": 2,
    "Chain Mail": 2,
    "Breast Plate": 3,
    "Splint Mail": 2,
    "Plate Mail": 2,
    "Field Plate": 2,
    "Gothic Plate": 4,
    "Light Plate": 3,
    "Full Plate Mail": 4,
    "Ancient Armor": 4,
    "Ghost Armor": 2,
    "Serpentskin Armor": 2,
    "Demonhide Armor": 2,
    "Trellised Armor": 2,
    "Linked Mail": 3,
    "Tigulated Mail": 3,
    "Mesh Armor": 3,
    Cuirass: 3,
    "Russet Armor": 3,
    "Templar Coat": 3,
    "Sharktooth Armor": 3,
    "Embossed Plate": 4,
    "Mage Plate": 3,
    "Chaos Armor": 4,
    "Ornate Plate": 4,
    "Dusk Shroud": 4,
    Wyrmhide: 4,
    "Scarab Husk": 4,
    "Wire Fleece": 4,
    "Diamond Mail": 4,
    "Loricated Mail": 4,
    Boneweave: 4,
    "Great Hauberk": 4,
    "Balrog Skin": 4,
    "Hellforge Plate": 4,
    "Kraken Shell": 4,
    "Lacquered Plate": 4,
    "Archon Plate": 4,
    "Shadow Plate": 4,
    "Sacred Armor": 4,
};

const socketExceptions = {
    noSockets: ["Maiden Javelin"],
    maxOneSocket: ["Pelta Lunata", "Buckler"],
};

function getMaxSocketsForWeapon(weaponName) {
    if (!itemList) {
        console.error("itemList is undefined!");
        return 2;
    }

    const itemData = itemList[weaponName];
    if (!itemData) {
        return 2;
    }

    const descriptionParts = itemData.description.split("<br>");

    if (descriptionParts.length < 2) {
        return 2;
    }

    const baseType = descriptionParts[1].trim();
    const maxSocket = maxSockets[baseType];

    return maxSocket || 2;
}

function handleSocketCorruption(mod, type, value) {
    if (mod.includes("Socketed")) {
        const socketCount = parseInt(value);
        const section = type.toLowerCase();

        const weaponSelect = document.getElementById("weapons-dropdown");
        const selectedWeapon = weaponSelect?.value;
        const baseType = getBaseWeaponType(selectedWeapon);

        if (maxSockets[baseType] === 0) {
            return false;
        }

        const maxAllowed = maxSockets[baseType] || 2;
        const finalSocketCount = Math.min(socketCount, maxAllowed);

        const containerClass = section === "weapon" ? "weaponsockets" : `${section}sockets`;
        const container = document.querySelector(`.${containerClass}`);
        if (!container) {
            return false;
        }

        const existingSockets = Array.from(container.querySelectorAll(".socketz"))
            .map((socket) => ({
                itemName: socket.dataset.itemName,
                stats: socket.dataset.stats,
                html: socket.innerHTML,
            }))
            .slice(0, finalSocketCount);

        container.innerHTML = "";

        for (let i = 0; i < finalSocketCount; i++) {
            const socket = document.createElement("div");
            socket.className = "socketz empty";
            socket.dataset.section = section;
            socket.dataset.index = i;

            if (existingSockets[i]) {
                socket.className = "socketz filled";
                socket.dataset.itemName = existingSockets[i].itemName;
                socket.dataset.stats = existingSockets[i].stats;
                socket.innerHTML = existingSockets[i].html;
            }

            socket.addEventListener("click", (e) => {
                e.stopPropagation();
                currentSocket = socket;
                showItemModal();
            });

            socket.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                clearSocket(socket);
                updateAllDisplays();
            });

            container.appendChild(socket);
        }

        return true;
    }
    return true;
}

function restoreSocketData(section, socketData, count) {
    const containerClass = section === "weapon" ? "weaponsockets" : `${section}sockets`;
    const container = document.querySelector(`.${containerClass}`);

    if (!container) return;

    const sockets = container.querySelectorAll(".socketz");

    for (let i = 0; i < Math.min(count, socketData.length, sockets.length); i++) {
        if (socketData[i] && socketData[i].itemName) {
            const socket = sockets[i];
            socket.dataset.itemName = socketData[i].itemName;
            socket.dataset.stats = socketData[i].stats;
            socket.innerHTML = socketData[i].html;
            socket.classList.remove("empty");
            socket.classList.add("filled");
        }
    }

    refreshSocketProperties();
}

function applyWeaponCorruption(corruptionMod) {
    const weaponSelect = document.getElementById("weapons-dropdown");
    if (!weaponSelect || !weaponSelect.value) return;

    const weaponName = weaponSelect.value;
    const itemData = itemList[weaponName];
    if (!itemData) return;

    resetCorruptionEnhancedDamage(itemData);

    const edmgMatch = corruptionMod.match(/\+(\d+)%\s*Enhanced\s*Damage/i);
    if (edmgMatch) {
        const corruptionEdmg = parseInt(edmgMatch[1]);
        itemData.properties.edmgFromCorruption = corruptionEdmg;
        itemData.properties.edmg = (itemData.properties.edmg || 0) + corruptionEdmg;
    }

    const baseType = itemData.description.split("<br>")[1];
    const isTwoHanded = itemData.properties.twohandmin !== undefined;

    if (isTwoHanded) {
        itemData.properties.twohandmin = calculateItemDamage(itemData, baseType, false);
        itemData.properties.twohandmax = calculateItemDamage(itemData, baseType, true);
    } else {
        itemData.properties.onehandmin = calculateItemDamage(itemData, baseType, false);
        itemData.properties.onehandmax = calculateItemDamage(itemData, baseType, true);
    }

    updateWeaponDescription(itemData, isTwoHanded);
    updateDamageDisplays(itemData, isTwoHanded);

    return true;
}

function updateItemDescription(itemData, isTwoHanded) {
    const min = isTwoHanded ? itemData.properties.twohandmin : itemData.properties.onehandmin;
    const max = isTwoHanded ? itemData.properties.twohandmax : itemData.properties.onehandmax;
    const avg = ((min + max) / 2).toFixed(1);
    const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";

    const lines = itemData.description.split("<br>");

    const damageIndex = lines.findIndex((line) => line.includes("Damage:"));
    if (damageIndex !== -1) {
        lines[damageIndex] = `${damageType} Damage: ${min} to ${max}, Avg ${avg}`;
    }

    const edmgIndex = lines.findIndex((line) => line.includes("Enhanced Damage"));
    if (edmgIndex !== -1) {
        lines[edmgIndex] = `+${itemData.properties.edmg}% Enhanced Damage`;
    }

    itemData.description = lines.join("<br>");

    const weaponInfo = document.getElementById("weapon-info");
    if (weaponInfo) {
        const corruptModElem = weaponInfo.querySelector(".corrupted-mod");
        const corruptTextElem = weaponInfo.querySelector(".corrupted-text");

        weaponInfo.innerHTML = itemData.description;

        if (corruptModElem) weaponInfo.appendChild(corruptModElem);
        if (corruptTextElem) weaponInfo.appendChild(corruptTextElem);
    }
}

function updateDamageDisplays(itemData, isTwoHanded) {
    if (isTwoHanded) {
        const minElem = document.getElementById("twohandmindmgcontainer");
        const maxElem = document.getElementById("twohandmaxdmgcontainer");
        if (minElem) minElem.textContent = itemData.properties.twohandmin;
        if (maxElem) maxElem.textContent = itemData.properties.twohandmax;
    } else {
        const minElem = document.getElementById("onehandmindmgcontainer");
        const maxElem = document.getElementById("onehandmaxdmgcontainer");
        if (minElem) minElem.textContent = itemData.properties.onehandmin;
        if (maxElem) maxElem.textContent = itemData.properties.onehandmax;
    }
}

function resetCorruptionEnhancedDamage(itemData) {
    if (itemData.properties.edmgFromCorruption) {
        itemData.properties.edmg -= itemData.properties.edmgFromCorruption;
        itemData.properties.edmgFromCorruption = 0;
    }
}

function enforceDaggerSocketLimits() {
    const weaponDropdown = document.getElementById("weapons-dropdown");
    if (!weaponDropdown || !weaponDropdown.value) return;

    const selectedWeapon = weaponDropdown.value;
    const baseType = getBaseWeaponType(selectedWeapon);

    const daggerTypes = [
        "Dagger",
        "Dirk",
        "Kris",
        "Blade",
        "Poignard",
        "Rondel",
        "Cinquedeas",
        "Stiletto",
        "Bone Knife",
        "Mithril Point",
        "Fanged Knife",
        "Legend Spike",
    ];

    if (daggerTypes.includes(baseType)) {
        console.log(`DOM ENFORCER: Limiting ${selectedWeapon} (${baseType}) to 1 socket`);

        const socketContainer = document.querySelector(".weaponsockets");
        if (!socketContainer) return;

        const sockets = socketContainer.querySelectorAll(".socketz");

        if (sockets.length > 1) {
            for (let i = 1; i < sockets.length; i++) {
                sockets[i].remove();
            }
        }
    }
}

function updateWeaponDescription() {
    const weaponSelect = document.getElementById("weapons-dropdown");
    if (!weaponSelect) return;

    const currentItem = weaponSelect.value;
    const currentItemData = itemList[currentItem];

    if (currentItemData) {
        const baseType = currentItemData.description.split("<br>")[1];
        const descriptionContainer = document.getElementById("weapon-info");

        if (descriptionContainer) {
            const existingSocketStats = descriptionContainer.querySelector(".socket-stats");
            const existingCorruptedMod = descriptionContainer.querySelector(".corrupted-mod");
            const existingCorruptedText = descriptionContainer.querySelector(".corrupted-text");

            const isTwoHanded = currentItemData.properties.twohandmin !== undefined;
            const min = isTwoHanded ? currentItemData.properties.twohandmin : currentItemData.properties.onehandmin;
            const max = isTwoHanded ? currentItemData.properties.twohandmax : currentItemData.properties.onehandmax;
            const damageType = isTwoHanded ? "Two-Hand" : "One-Hand";

            const lines = currentItemData.description.split("<br>");

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes("Damage:")) {
                    lines[i] = `${damageType} Damage: ${min}-${max}`;
                    break;
                }
            }

            currentItemData.description = lines.join("<br>");
            descriptionContainer.innerHTML = currentItemData.description;

            if (existingSocketStats) descriptionContainer.appendChild(existingSocketStats);
            if (existingCorruptedMod) descriptionContainer.appendChild(existingCorruptedMod);
            if (existingCorruptedText) descriptionContainer.appendChild(existingCorruptedText);
        }
    }
}

// Additional socket event handlers
document.addEventListener("DOMContentLoaded", function () {
    const weaponDropdown = document.getElementById("weapons-dropdown");
    if (weaponDropdown) {
        weaponDropdown.addEventListener("change", function () {
            setTimeout(enforceDaggerSocketLimits, 100);
        });
    }

    setTimeout(enforceDaggerSocketLimits, 200);
});

// Socket click handlers setup
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".socketz").forEach((socket) => {
        socket.addEventListener("click", (e) => {
            e.stopPropagation();
            currentSocket = socket;
            showItemModal();
        });

        socket.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearSocket(socket);
        });

        const observer = new MutationObserver(() => {
            const section = socket.dataset.section;
            if (section) {
                updateSocketInfo(section);
                if (section === "weapon") {
                    if (typeof updateWeaponDescription === 'function') {
                        updateWeaponDescription();
                    }
                    if (typeof updateWeaponDamageDisplay === 'function') {
                        updateWeaponDamageDisplay();
                    }
                }
            }
        });

        observer.observe(socket, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,
        });
    });
});

// Weapon dropdown enhancement for corruptions
document.getElementById("weapons-dropdown")?.addEventListener("change", (event) => {
    const selectedWeapon = event.target.value;
    const baseType = getBaseWeaponType(selectedWeapon);
    const maxAllowed = maxSockets[baseType] || 2;

    const weaponCorruption = window.typeCorruptions?.weapon;
    const socketMatch = weaponCorruption?.match(/Socketed \((\d+)\)/);

    let socketData = [];
    const container = document.querySelector(`.weaponsockets`);
    if (container) {
        const sockets = container.querySelectorAll(".socketz");
        socketData = Array.from(sockets).map((socket) => ({
            itemName: socket.dataset.itemName,
            stats: socket.dataset.stats,
            html: socket.innerHTML,
        }));
    }

    if (socketMatch) {
        const currentSockets = parseInt(socketMatch[1]);
        const adjustedSockets = Math.min(currentSockets, maxAllowed);

        if (adjustedSockets !== currentSockets) {
            console.log(`Adjusting sockets from ${currentSockets} to ${adjustedSockets} based on ${baseType} max`);
            window.typeCorruptions.weapon = `Socketed (${adjustedSockets})`;
            localStorage.setItem("typeCorruptions", JSON.stringify(window.typeCorruptions));

            setTimeout(() => {
                updateCorruptionDisplay("weapon", `Socketed (${adjustedSockets})`);
                updateSocketCount("weapon", adjustedSockets);
                restoreSocketData("weapon", socketData, adjustedSockets);
            }, 100);
        } else {
            setTimeout(() => {
                updateSocketCount("weapon", adjustedSockets);
                restoreSocketData("weapon", socketData, adjustedSockets);
            }, 100);
        }
    } else {
        setTimeout(() => {
            updateSocketCount("weapon", 0);
        }, 100);
    }

    const itemData = itemList[selectedWeapon];
    if (itemData) {
        const descriptionContainer = document.getElementById("weapon-info");
        if (descriptionContainer) {
            const corruptionDiv = descriptionContainer.querySelector(".corrupted-mod");
            const corruptedText = descriptionContainer.querySelector(".corrupted-text");

            const descriptionLines = itemData.description.split("<br>");
            const formattedDescription = descriptionLines.map((line) => `<div>${line}</div>`).join("");
            descriptionContainer.innerHTML = formattedDescription;

            if (corruptionDiv) descriptionContainer.appendChild(corruptionDiv);
            if (corruptedText) descriptionContainer.appendChild(corruptedText);
        }

        if (typeof updateWeaponDamageDisplay === 'function') {
            updateWeaponDamageDisplay();
        }
    }
});

// Expose functions to global scope
window.updateSocketInfo = updateSocketInfo;
window.refreshSocketProperties = refreshSocketProperties;
window.clearSocket = clearSocket;
window.mergeNumericStats = mergeNumericStats;
window.forceUpdateSockets = forceUpdateSockets;
window.updateSocketCount = updateSocketCount;
window.applyWeaponCorruption = applyWeaponCorruption;
window.resetCorruptionEnhancedDamage = resetCorruptionEnhancedDamage;
window.getBaseWeaponType = getBaseWeaponType;
window.updateWeaponDescription = updateWeaponDescription;
window.maxSockets = maxSockets;
window.socketExceptions = socketExceptions;
window.typeCorruptions = typeCorruptions;
