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

        initializeDropdowns();
        initializeEventHandlers();

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

// Level Requirement System for PD2 Planner
// Add this to your main-init.js or character.js

// FIXED Level Requirement System for PD2 Planner
// Replace your existing code with this corrected version

// Ultra Lightweight Level Requirement System - Only 150 lines!
// Replace your entire level requirement system with this clean version

class LevelRequirementSystem {
  constructor() {
    this.currentLevel = 1;
    this.equipmentMap = {
      'weapons-dropdown': 'weapon-info',
      'helms-dropdown': 'helm-info', 
      'armors-dropdown': 'armor-info',
      'offs-dropdown': 'off-info',
      'gloves-dropdown': 'glove-info',
      'belts-dropdown': 'belt-info',
      'boots-dropdown': 'boot-info',
      'ringsone-dropdown': 'ringsone-info',
      'ringstwo-dropdown': 'ringstwo-info',
      'amulets-dropdown': 'amulet-info'
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.overrideStatsSystems();
    console.log('📊 Level Requirement System initialized');
  }

  setupEventListeners() {
    // Level changes
    const levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', () => {
        this.currentLevel = parseInt(levelInput.value) || 1;
        this.updateAll();
      });
    }

    // Equipment changes
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.addEventListener('change', () => setTimeout(() => this.updateAll(), 100));
      }
    });

    // Socket changes
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('socket-slot') || e.target.closest('.socket-slot')) {
        setTimeout(() => this.updateCharacterStats(), 200);
      }
    });
  }

  updateAll() {
    this.checkAllItems();
    this.updateStatCalculations();
  }

  checkAllItems() {
    Object.entries(this.equipmentMap).forEach(([dropdownId, infoId]) => {
      this.checkItemRequirement(dropdownId, infoId);
    });
  }

  checkItemRequirement(dropdownId, infoId) {
    const dropdown = document.getElementById(dropdownId);
    const infoDiv = document.getElementById(infoId);
    
    if (!dropdown || !infoDiv || !dropdown.value || !itemList[dropdown.value]) return;

    const item = itemList[dropdown.value];
    const requiredLevel = item.properties?.reqlvl || 1;
    const isValid = this.currentLevel >= requiredLevel;

    this.updateItemDescription(infoDiv, item, requiredLevel, isValid);
    this.markDropdownValidity(dropdown, isValid);
  }

  updateItemDescription(infoDiv, item, requiredLevel, isValidLevel) {
    const currentContent = infoDiv.innerHTML;
    const hasSocketStats = currentContent.includes('socket-enhanced-stat') || 
                          (currentContent.includes('Adds ') && currentContent !== item.description);
    
    let description = hasSocketStats ? currentContent : item.description;
    
    // Update only the Required Level line color
    const levelRegex = /<span[^>]*>Required Level: (\d+)<\/span>|Required Level: (\d+)/;
    const match = description.match(levelRegex);
    
    if (match) {
      const levelColor = isValidLevel ? '#ffffff' : '#FF4444';
      const newLine = `<span style="color: ${levelColor}; font-weight: ${isValidLevel ? 'normal' : 'bold'};">Required Level: ${requiredLevel}</span>`;
      description = description.replace(match[0], newLine);
    }

    infoDiv.innerHTML = description;
  }

  markDropdownValidity(dropdown, isValid) {
    if (isValid) {
      dropdown.style.borderColor = '';
      dropdown.style.backgroundColor = '#000000';
    } else {
      dropdown.style.borderColor = '#FF4444';

    }
  }

  updateStatCalculations() {
    setTimeout(() => {
      if (window.statsCalculator) window.statsCalculator.calculateAllStats();
      this.updateCharacterStats();
    }, 50);
  }

  updateCharacterStats() {
    if (!window.characterStats) return;
    
    const baseStats = {
      str: parseInt(document.getElementById('str').value) || 0,
      dex: parseInt(document.getElementById('dex').value) || 0,
      vit: parseInt(document.getElementById('vit').value) || 0,
      enr: parseInt(document.getElementById('enr').value) || 0
    };

    const itemBonuses = this.getItemBonuses();
    const socketBonuses = this.getSocketBonuses();
    const charmBonuses = this.getCharmBonuses();
    
    const totalBonuses = {
      str: itemBonuses.str + socketBonuses.str + charmBonuses.str,
      dex: itemBonuses.dex + socketBonuses.dex + charmBonuses.dex,
      vit: itemBonuses.vit + socketBonuses.vit + charmBonuses.vit,
      enr: itemBonuses.enr + socketBonuses.enr + charmBonuses.enr
    };

    ['str', 'dex', 'vit', 'enr'].forEach(statId => {
      this.updateTotalDisplay(statId, baseStats[statId] + totalBonuses[statId], totalBonuses[statId]);
    });
  }

  getItemBonuses() {
    const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
    
    Object.keys(this.equipmentMap).forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown || !dropdown.value || !itemList[dropdown.value]) return;
      
      const item = itemList[dropdown.value];
      const requiredLevel = item.properties?.reqlvl || 1;
      
      if (this.currentLevel >= requiredLevel && item.properties) {
        bonuses.str += item.properties.str || 0;
        bonuses.dex += item.properties.dex || 0;
        bonuses.vit += item.properties.vit || 0;
        bonuses.enr += item.properties.enr || 0;
      }
    });
    
    return bonuses;
  }

  getSocketBonuses() {
    const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
    const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots'];
    
    sections.forEach(section => {
      const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
      sockets.forEach(socket => {
        const stats = socket.dataset.stats;
        if (stats) {
          const strengthMatch = stats.match(/\+(\d+) (?:to )?Strength/i);
          const dexterityMatch = stats.match(/\+(\d+) (?:to )?Dexterity/i);
          const vitalityMatch = stats.match(/\+(\d+) (?:to )?Vitality/i);
          const energyMatch = stats.match(/\+(\d+) (?:to )?Energy/i);
          
          if (strengthMatch) bonuses.str += parseInt(strengthMatch[1]);
          if (dexterityMatch) bonuses.dex += parseInt(dexterityMatch[1]);
          if (vitalityMatch) bonuses.vit += parseInt(vitalityMatch[1]);
          if (energyMatch) bonuses.enr += parseInt(energyMatch[1]);
        }
      });
    });
    
    return bonuses;
  }

  getCharmBonuses() {
    const bonuses = { str: 0, dex: 0, vit: 0, enr: 0 };
    if (window.statsCalculator && window.statsCalculator.stats) {
      const stats = window.statsCalculator.stats;
      bonuses.str = stats.str || 0;
      bonuses.dex = stats.dex || 0;
      bonuses.vit = stats.vit || 0;
      bonuses.enr = stats.enr || 0;
    }
    return bonuses;
  }

  updateTotalDisplay(statId, total, bonus) {
    let bonusDiv = document.getElementById(statId + 'Total');
    if (!bonusDiv) {
      bonusDiv = document.createElement('span');
      bonusDiv.id = statId + 'Total';
      bonusDiv.style.cssText = 'color: #00ff00; font-weight: bold; margin-left: 10px; font-size: 14px;';
      
      const statInput = document.getElementById(statId);
      if (statInput) {
        const statRow = statInput.closest('.stat-row') || statInput.parentElement;
        if (statRow) statRow.appendChild(bonusDiv);
      }
    }
    
    bonusDiv.textContent = bonus > 0 ? ` ${total}` : '';
    bonusDiv.style.display = bonus > 0 ? 'inline' : 'none';
  }

  overrideStatsSystems() {
    // Override socket system's equipment stats calculation
    setTimeout(() => {
      if (window.statsCalculator) {
        window.statsCalculator.calculateEquipmentStats = () => {
          Object.entries(window.statsCalculator.equipmentMap || {}).forEach(([dropdownId, itemType]) => {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown || !dropdown.value || !itemList[dropdown.value]) return;
            
            const item = itemList[dropdown.value];
            const requiredLevel = item.properties?.reqlvl || 1;
            
            if (this.currentLevel >= requiredLevel) {
              window.statsCalculator.parseItemStats(item);
            }
          });
        };
      }

      // Override character stats methods
      if (window.characterStats) {
        window.characterStats.getAllItemBonuses = () => this.getItemBonuses();
        window.characterStats.getSocketBonuses = () => this.getSocketBonuses();
        window.characterStats.getCharmBonuses = () => this.getCharmBonuses();
        window.characterStats.updateTotalStats = () => this.updateCharacterStats();
      }
    }, 800);
  }
}

// CSS and initialization
const styles = `
<style id="level-requirement-styles">
.invalid-level {
  border: 2px solid #FF4444 !important;
  background-color: rgba(255, 68, 68, 0.1) !important;
}
select.invalid-level:focus {
  box-shadow: 0 0 5px rgba(255, 68, 68, 0.5);
}
</style>
`;

if (!document.getElementById('level-requirement-styles')) {
  document.head.insertAdjacentHTML('beforeend', styles);
}

// Initialize
let levelRequirementSystem;
setTimeout(() => {
  if (!levelRequirementSystem) {
    levelRequirementSystem = new LevelRequirementSystem();
    window.levelRequirementSystem = levelRequirementSystem;
    console.log('✅ Ultra Lightweight Level System initialized');
  }
}, 1000);

// Test function
window.testLevelSystem = function() {
  console.log('🧪 Testing lightweight level system...');
  const currentLevel = parseInt(document.getElementById('lvlValue').value) || 1;
  console.log('Current level:', currentLevel);
  
  if (levelRequirementSystem) {
    const itemBonuses = levelRequirementSystem.getItemBonuses();
    const socketBonuses = levelRequirementSystem.getSocketBonuses();
    const charmBonuses = levelRequirementSystem.getCharmBonuses();
    
    console.log('📦 Item bonuses:', itemBonuses);
    console.log('🔌 Socket bonuses:', socketBonuses);
    console.log('💎 Charm bonuses:', charmBonuses);
    
    levelRequirementSystem.updateCharacterStats();
    console.log('✅ System working perfectly!');
  }
};