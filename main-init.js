// main-init.js - Main initialization script for PD2 Planner

// Global state management
const PD2State = {
    currentSocket: null,
    selectedClass: 'Amazon',
    isLoggedIn: false,
    username: null,
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001' 
        : 'https://pd2planner-backend-517bf7cfa307.herokuapp.com'
};

// Wait for all dependencies to load
function waitForDependencies(callback) {
    const checkInterval = setInterval(() => {
        if (typeof itemList !== 'undefined' && 
            typeof updatePolyLife === 'function' &&
            typeof typeCorruptions !== 'undefined') {
            clearInterval(checkInterval);
            callback();
        }
    }, 100);
}

// Initialize all systems
document.addEventListener('DOMContentLoaded', function() {
    waitForDependencies(() => {
        console.log('All dependencies loaded, initializing PD2 Planner...');
        
        // Core initialization
        initializeInventory();
        initializeDropdowns();
        initializeEventHandlers();
        initializeSocketSystem();
        initializeCorruptionSystem();
        initializeSkillSystem();
        initializeMercenarySystem();
        
        // UI initialization
        initializeParticles();
        checkAuthenticationState();
        
        // Initial calculations
        updateAllCalculations();
        
        console.log('PD2 Planner initialization complete!');
    });
});

// Initialize inventory grid
function initializeInventory() {
    const inventory = document.querySelector('.inventorycontainer');
    if (!inventory) return;
    
    // Clear existing
    inventory.innerHTML = '';
    
    // Create 40 charm slots (4x10 grid)
    for (let i = 0; i < 40; i++) {
        const charm = document.createElement('div');
        charm.className = 'charm1';
        charm.dataset.slot = i;
        
        // Click handler for charm slots
        charm.addEventListener('click', function() {
            // Handle charm placement
            console.log('Charm slot clicked:', i);
        });
        
        inventory.appendChild(charm);
    }
}

// Initialize all dropdowns with items
function initializeDropdowns() {
    const dropdownMapping = {
        'weapons-dropdown': { types: ['weapon'], category: 'Weapons' },
        'helms-dropdown': { types: ['helm'], category: 'Helms' },
        'armors-dropdown': { types: ['armor'], category: 'Armors' },
        'offs-dropdown': { types: ['shield', 'off'], category: 'Shields/Off-hands' },
        'gloves-dropdown': { types: ['glove'], category: 'Gloves' },
        'belts-dropdown': { types: ['belt'], category: 'Belts' },
        'boots-dropdown': { types: ['boot'], category: 'Boots' },
        'ringsone-dropdown': { types: ['ring'], category: 'Rings' },
        'ringstwo-dropdown': { types: ['ring'], category: 'Rings' },
        'amulets-dropdown': { types: ['amulet'], category: 'Amulets' }
    };

    // Also initialize mercenary dropdowns
    const mercDropdowns = ['merchelms', 'mercarmors', 'mercweapons', 'mercoffs', 
                          'mercgloves', 'mercbelts', 'mercboots'];
    
    mercDropdowns.forEach(id => {
        const baseId = id.replace('merc', '');
        if (dropdownMapping[`${baseId}-dropdown`]) {
            dropdownMapping[`${id}-dropdown`] = dropdownMapping[`${baseId}-dropdown`];
        }
    });

    Object.entries(dropdownMapping).forEach(([dropdownId, config]) => {
        populateDropdown(dropdownId, config.types, config.category);
    });
}

// Populate a single dropdown
function populateDropdown(dropdownId, itemTypes, categoryName) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.warn(`Dropdown not found: ${dropdownId}`);
        return;
    }

    // Keep the "None" option
    const noneOption = dropdown.querySelector('option[value=""]');
    dropdown.innerHTML = '';
    if (noneOption) dropdown.appendChild(noneOption);

    // Group items by rarity
    const itemsByRarity = {
        normal: [],
        exceptional: [],
        elite: [],
        unique: [],
        set: [],
        runeword: []
    };

    // Sort items into groups
    Object.entries(itemList).forEach(([itemName, itemData]) => {
        const itemType = detectItemType(itemName, itemData.description);
        
        if (itemTypes.includes(itemType)) {
            const rarity = detectItemRarity(itemName, itemData.description);
            itemsByRarity[rarity].push(itemName);
        }
    });

    // Add items to dropdown by rarity group
    Object.entries(itemsByRarity).forEach(([rarity, items]) => {
        if (items.length === 0) return;

        const optgroup = document.createElement('optgroup');
        optgroup.label = rarity.charAt(0).toUpperCase() + rarity.slice(1);
        
        // Sort items alphabetically within each group
        items.sort().forEach(itemName => {
            const option = document.createElement('option');
            option.value = itemName;
            option.textContent = itemName;
            
            // Add color coding based on rarity
            if (rarity === 'unique') option.style.color = '#C7B377';
            if (rarity === 'set') option.style.color = '#00FF00';
            if (rarity === 'runeword') option.style.color = '#FFD700';
            
            optgroup.appendChild(option);
        });
        
        dropdown.appendChild(optgroup);
    });

    // Add custom crafted items if available
    if (typeof addCustomCraftedItems === 'function') {
        addCustomCraftedItems(dropdown, itemTypes);
    }
}

// Detect item type from name and description
function detectItemType(itemName, description) {
    const desc = description.toLowerCase();
    
    // Weapons
    const weaponTypes = ['sword', 'axe', 'mace', 'hammer', 'spear', 'polearm', 
                        'bow', 'crossbow', 'dagger', 'wand', 'scepter', 'staff',
                        'claw', 'orb', 'javelin', 'throwing'];
    for (let type of weaponTypes) {
        if (desc.includes(type)) return 'weapon';
    }
    
    // Armor pieces
    if (desc.includes('helm') || desc.includes('crown') || desc.includes('cap') || 
        desc.includes('skull') || desc.includes('mask') || desc.includes('circlet')) {
        return 'helm';
    }
    
    if (desc.includes('armor') || desc.includes('mail') || desc.includes('plate') || 
        desc.includes('hide') || desc.includes('suit')) {
        return 'armor';
    }
    
    if (desc.includes('shield') || desc.includes('buckler') || desc.includes('defender') ||
        desc.includes('ward')) {
        return 'shield';
    }
    
    if (desc.includes('gloves') || desc.includes('gauntlets') || desc.includes('hands') ||
        desc.includes('fist')) {
        return 'glove';
    }
    
    if (desc.includes('belt') || desc.includes('sash') || desc.includes('cord') ||
        desc.includes('wrap')) {
        return 'belt';
    }
    
    if (desc.includes('boots') || desc.includes('greaves') || desc.includes('shoes') ||
        desc.includes('treads')) {
        return 'boot';
    }
    
    // Jewelry
    if (desc.includes('ring')) return 'ring';
    if (desc.includes('amulet')) return 'amulet';
    
    return 'misc';
}

// Detect item rarity
function detectItemRarity(itemName, description) {
    // Check for set items (green)
    const setPatterns = ['set:', 'set item', '(2 items)', '(3 items)', '(complete set)'];
    for (let pattern of setPatterns) {
        if (description.toLowerCase().includes(pattern)) return 'set';
    }
    
    // Check for runewords
    if (description.includes('Rune Word') || description.includes('RuneWord')) {
        return 'runeword';
    }
    
    // Check for uniques (usually have special names)
    const uniqueIndicators = ['Unique', 'Required Level:', 'Required Strength:'];
    let indicatorCount = 0;
    uniqueIndicators.forEach(indicator => {
        if (description.includes(indicator)) indicatorCount++;
    });
    if (indicatorCount >= 2) return 'unique';
    
    // Check item quality by name patterns
    if (itemName.includes('Superior') || itemName.includes('Exceptional')) {
        return 'exceptional';
    }
    
    if (itemName.includes('Elite')) return 'elite';
    
    return 'normal';
}

// Initialize all event handlers
function initializeEventHandlers() {
    // Equipment dropdown handlers
    const dropdowns = document.querySelectorAll('select[id$="-dropdown"]');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', handleEquipmentChange);
    });

    // Button handlers
    setupButtonHandlers();
    
    // Class selection handler
    const classSelect = document.getElementById('selectClass');
    if (classSelect) {
        classSelect.addEventListener('change', handleClassChange);
    }

    // Stat input handlers
    const statInputs = ['lvlValue', 'str', 'dex', 'vit', 'enr'];
    statInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateAllCalculations);
            input.addEventListener('change', updateAllCalculations);
        }
    });
}

// Handle equipment changes
function handleEquipmentChange(event) {
    const dropdown = event.target;
    const itemName = dropdown.value;
    
    // Get corresponding info container
    const infoId = dropdown.id.replace('-dropdown', '-info');
    const infoContainer = document.getElementById(infoId);
    
    if (!infoContainer) return;
    
    if (!itemName || !itemList[itemName]) {
        infoContainer.innerHTML = '';
        updateAllCalculations();
        return;
    }
    
    // Display item info
    const item = itemList[itemName];
    infoContainer.innerHTML = formatItemDescription(item.description);
    
    // Handle sockets if applicable
    const section = dropdown.id.replace('-dropdown', '').replace('s', '');
    if (typeof updateSocketCount === 'function') {
        updateSocketCount(section);
    }
    
    // Update all calculations
    updateAllCalculations();
}

// Format item description for display
function formatItemDescription(description) {
    // Convert line breaks to divs for better display
    return description.split('<br>')
        .map(line => `<div>${line}</div>`)
        .join('');
}

// Handle class change
function handleClassChange(event) {
    PD2State.selectedClass = event.target.value;
    
    // Update skill containers visibility
    updateSkillContainerVisibility();
    
    // Update any class-specific calculations
    updateAllCalculations();
}

// Update skill container visibility based on class
function updateSkillContainerVisibility() {
    // Hide all skill containers
    document.querySelectorAll('.skill-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Show containers for selected class
    const classContainers = {
        'Amazon': ['javelinandspearskillscontainer', 'passiveskillscontainer', 'bowandcrossbowskillscontainer'],
        'Assassin': ['martialartskillscontainer', 'shadowskillscontainer', 'trapskillscontainer'],
        'Barbarian': ['warcriesskillscontainer', 'combatmasteriesskillscontainer', 'combatskillsskillscontainer'],
        'Druid': ['elementalskillsskillscontainer', 'shapeshiftingskillsskillscontainer', 'summoningskillsskillscontainer'],
        'Necromancer': ['summoningspellsskillscontainer', 'poisonandbonespellsskillscontainer', 'cursesskillscontainer'],
        'Paladin': ['defensiveaurasskillscontainer', 'offensiveaurasskillscontainer', 'combatpalaskillsskillscontainer'],
        'Sorceress': ['coldspellsskillscontainer', 'lightningspellsskillscontainer', 'firespellsskillscontainer']
    };
    
    const containers = classContainers[PD2State.selectedClass] || [];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) container.style.display = 'block';
    });
}

// Setup button handlers
function setupButtonHandlers() {
    // Upgrade buttons
    const upgradeButtons = {
        'upgradeHelmButton': () => handleUpgrade('helm'),
        'upgradeArmorButton': () => handleUpgrade('armor'),
        'upgradeWeaponButton': () => handleUpgrade('weapon'),
        'upgradeShieldButton': () => handleUpgrade('shield'),
        'upgradeGloveButton': () => handleUpgrade('glove'),
        'upgradeBeltButton': () => handleUpgrade('belt'),
        'upgradeBootButton': () => handleUpgrade('boot')
    };
    
    Object.entries(upgradeButtons).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) button.addEventListener('click', handler);
    });
    
    // Ethereal buttons
    const etherealButtons = {
        'makeethereal': 'helm',
        'makeetherealarmor': 'armor',
        'makeetherealweapon': 'weapon',
        'makeetherealshield': 'shield',
        'makeetherealglove': 'glove',
        'makeetherealbelt': 'belt',
        'makeetherealboot': 'boot'
    };
    
    Object.entries(etherealButtons).forEach(([id, type]) => {
        const button = document.getElementById(id);
        if (button && typeof makeEtherealItem === 'function') {
            button.addEventListener('click', () => makeEtherealItem(type));
        }
    });
    
    // Corruption buttons
    const corruptButtons = {
        'corruptHelm': 'helm',
        'corruptArmor': 'armor',
        'corruptWeapon': 'weapon',
        'corruptShield': 'shield',
        'corruptGlove': 'glove',
        'corruptBelt': 'belt',
        'corruptBoot': 'boot',
        'corruptRingOne': 'ringOne',
        'corruptRingTwo': 'ringTwo',
        'corruptAmulet': 'amulet'
    };
    
    Object.entries(corruptButtons).forEach(([id, type]) => {
        const button = document.getElementById(id);
        if (button && typeof showModal === 'function') {
            button.addEventListener('click', () => showModal(type));
        }
    });
    
    // Save/Load buttons
    const saveBtn = document.getElementById('saveCharacterButton');
    if (saveBtn) saveBtn.addEventListener('click', saveCharacter);
    
    const loadBtn = document.getElementById('loadCharacterButton');
    if (loadBtn) loadBtn.addEventListener('click', loadCharacter);
    
    // Custom craft button
    const craftBtn = document.getElementById('create-craft-button');
    if (craftBtn) craftBtn.addEventListener('click', showCraftModal);
}

// Initialize socket system
function initializeSocketSystem() {
    // Set up socket containers
    const socketContainers = document.querySelectorAll('[class^="socketcontainer"]');
    
    socketContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            if (e.target.classList.contains('socketz')) {
                PD2State.currentSocket = e.target;
                showItemModal();
            }
        });
        
        container.addEventListener('contextmenu', function(e) {
            if (e.target.classList.contains('socketz')) {
                e.preventDefault();
                if (typeof clearSocket === 'function') {
                    clearSocket(e.target);
                    updateAllCalculations();
                }
            }
        });
    });
}

// Initialize corruption system
function initializeCorruptionSystem() {
    // This will be handled by corruption.js
    console.log('Corruption system initialized');
}

// Initialize skill system
function initializeSkillSystem() {
    // Initial skill container visibility
    updateSkillContainerVisibility();
    
    // This will be handled by SkillHandler.js
    console.log('Skill system initialized');
}

// Initialize mercenary system
function initializeMercenarySystem() {
    // This will be handled by mercenary.js
    console.log('Mercenary system initialized');
}

// Initialize particle effects
function initializeParticles() {
    createParticles();
}

// Create particle effects
function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    function spawnParticle() {
        if (!document.body.classList.contains('moody')) return;
        
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const randomType = Math.floor(Math.random() * 3) + 1;
        particle.classList.add('type' + randomType);
        
        const size = Math.random() * 60 + 12;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        particle.style.animation = `float ${Math.random() * 3 + 2}s ease-out`;
        
        container.appendChild(particle);
        
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
    
    setInterval(spawnParticle, 35);
}

// Check authentication state
function checkAuthenticationState() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        PD2State.isLoggedIn = true;
        PD2State.username = username;
        updateUIState(username);
    }
}

// Update UI based on login state
function updateUIState(username = null) {
    const loginForm = document.getElementById('loginForm');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const signupForm = document.getElementById('signupForm');
    
    if (username) {
        if (loginForm) loginForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'none';
        if (welcomeMsg) {
            welcomeMsg.style.display = 'block';
            welcomeMsg.textContent = `Welcome, ${username}! Build your character and unlock achievements!`;
        }
    } else {
        if (loginForm) loginForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'block';
        if (welcomeMsg) welcomeMsg.style.display = 'none';
    }
}

// Update all calculations
function updateAllCalculations() {
    // Update life
    if (typeof updatePolyLife === 'function') {
        updatePolyLife();
    }
    
    // Update damage
    if (typeof updateWeaponDamageDisplay === 'function') {
        updateWeaponDamageDisplay();
    }
    
    // Update resistances
    updateResistances();
    
    // Update other stats
    updateOtherStats();
    
    // Update skill bonuses
    if (typeof showAllSkillsBonus === 'function') {
        showAllSkillsBonus();
    }
}

// Update resistances display
function updateResistances() {
    // This would be implemented based on equipment and other bonuses
    console.log('Updating resistances...');
}

// Update other stats display
function updateOtherStats() {
    // This would be implemented based on equipment and other bonuses
    console.log('Updating other stats...');
}

// Save character
async function saveCharacter() {
    if (!PD2State.isLoggedIn) {
        alert('Please login to save characters');
        return;
    }
    
    const characterData = gatherCharacterData();
    
    try {
        const response = await fetch(`${PD2State.baseUrl}/character`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(characterData)
        });
        
        if (response.ok) {
            alert('Character saved successfully!');
        } else {
            alert('Failed to save character');
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Failed to save character');
    }
}

// Load character
async function loadCharacter() {
    if (!PD2State.isLoggedIn) {
        alert('Please login to load characters');
        return;
    }
    
    try {
        const response = await fetch(`${PD2State.baseUrl}/characters`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const characters = await response.json();
            displayCharacterList(characters);
        } else {
            alert('Failed to load characters');
        }
    } catch (error) {
        console.error('Load error:', error);
        alert('Failed to load characters');
    }
}

// Gather current character data
function gatherCharacterData() {
    const data = {
        name: document.getElementById('character-name')?.value || 'Unnamed',
        class: PD2State.selectedClass,
        level: parseInt(document.getElementById('lvlValue')?.value) || 1,
        stats: {
            strength: parseInt(document.getElementById('str')?.value) || 0,
            dexterity: parseInt(document.getElementById('dex')?.value) || 0,
            vitality: parseInt(document.getElementById('vit')?.value) || 0,
            energy: parseInt(document.getElementById('enr')?.value) || 0
        },
        equipment: {}
    };
    
    // Gather equipment
    const equipmentSlots = ['weapons', 'helms', 'armors', 'offs', 'gloves', 
                           'belts', 'boots', 'ringsone', 'ringstwo', 'amulets'];
    
    equipmentSlots.forEach(slot => {
        const dropdown = document.getElementById(`${slot}-dropdown`);
        if (dropdown && dropdown.value) {
            data.equipment[slot] = dropdown.value;
        }
    });
    
    return data;
}

// Display character list for loading
function displayCharacterList(characters) {
    const listContainer = document.getElementById('charactersList');
    if (!listContainer) return;
    
    listContainer.innerHTML = '<h3>Select a character to load:</h3>';
    
    characters.forEach(char => {
        const charDiv = document.createElement('div');
        charDiv.className = 'character-item';
        charDiv.innerHTML = `
            <span>${char.name} - Level ${char.level} ${char.class}</span>
            <button onclick="loadCharacterData('${char._id}')">Load</button>
        `;
        listContainer.appendChild(charDiv);
    });
}

// Load specific character data
window.loadCharacterData = async function(characterId) {
    try {
        const response = await fetch(`${PD2State.baseUrl}/character/${characterId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const character = await response.json();
            applyCharacterData(character);
        } else {
            alert('Failed to load character data');
        }
    } catch (error) {
        console.error('Load character error:', error);
        alert('Failed to load character data');
    }
};

// Apply loaded character data
function applyCharacterData(character) {
    // Set basic info
    document.getElementById('character-name').value = character.name || '';
    document.getElementById('selectClass').value = character.class || 'Amazon';
    document.getElementById('lvlValue').value = character.level || 1;
    
    // Set stats
    if (character.stats) {
        document.getElementById('str').value = character.stats.strength || 0;
        document.getElementById('dex').value = character.stats.dexterity || 0;
        document.getElementById('vit').value = character.stats.vitality || 0;
        document.getElementById('enr').value = character.stats.energy || 0;
    }
    
    // Set equipment
    if (character.equipment) {
        Object.entries(character.equipment).forEach(([slot, item]) => {
            const dropdown = document.getElementById(`${slot}-dropdown`);
            if (dropdown) dropdown.value = item;
        });
    }
    
    // Update displays
    handleClassChange({ target: { value: character.class } });
    updateAllCalculations();
    
    alert('Character loaded successfully!');
}

// Show craft modal
function showCraftModal() {
    const modal = document.getElementById('craftModal');
    if (modal) modal.style.display = 'block';
}

// Modal handlers
window.showItemModal = function() {
    const modal = document.getElementById('itemModal');
    if (modal) modal.classList.remove('hidden');
};

window.hideItemModal = function() {
    const modal = document.getElementById('itemModal');
    if (modal) modal.classList.add('hidden');
};

window.showCorruptionModal = function() {
    const modal = document.getElementById('corruptionModal');
    if (modal) modal.classList.remove('hidden');
};

window.hideCorruptionModal = function() {
    const modal = document.getElementById('corruptionModal');
    if (modal) modal.classList.add('hidden');
};

// Handle login
window.handleLogin = async function(event) {
    event.preventDefault();
    
    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;
    
    try {
        const response = await fetch(`${PD2State.baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });
        
        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            PD2State.isLoggedIn = true;
            PD2State.username = data.username;
            updateUIState(data.username);
            
            // Trigger login event for other systems
            document.dispatchEvent(new CustomEvent('userLoggedIn', { 
                detail: { userId: data.userId, username: data.username } 
            }));
            
            alert('Login successful!');
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your connection.');
    }
};

// Handle signup
window.handleSignup = async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    
    // Validate password
    if (password.length < 10 || !/\d/.test(password)) {
        alert('Password must be at least 10 characters and contain at least one number');
        return;
    }
    
    try {
        const response = await fetch(`${PD2State.baseUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Signup successful! Please login.');
            document.getElementById('signupForm').reset();
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please check your connection.');
    }
};

// Export for global access
window.PD2State = PD2State;
window.updateAllCalculations = updateAllCalculations;
window.recalculateStats = function() {
  console.log('Stats calculation called - but no stats calculator loaded');
};