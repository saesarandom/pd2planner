// socket-manager.js - Unified socket management system

const SocketManager = {
    // Current socket being edited
    currentSocket: null,
    
    // Socket data storage
    socketData: {
        weapon: [],
        helm: [],
        armor: [],
        shield: [],
        glove: [],
        belt: [],
        boot: []
    },
    
    // Maximum sockets per item type
    maxSockets: {
        'Normal': 2,
        'Exceptional': 3,
        'Elite': 4,
        'Javelin': 3,
        'Spear': 3,
        'Polearm': 4,
        'Bow': 3,
        'Crossbow': 3,
        'Staff': 4,
        'Wand': 1,
        'Scepter': 3,
        'Dagger': 1,
        'Sword': 3,
        'Axe': 4,
        'Mace': 3,
        'Hammer': 3,
        'Shield': 3,
        'Helm': 3,
        'Armor': 4,
        'default': 2
    },
    
    // Items that can only have 1 socket max
    singleSocketItems: [
        'Wand', 'Dagger', 'Throwing Knife', 'Orb'
    ],
    
    // Items that cannot have sockets
    noSocketItems: [
        'Ring', 'Amulet', 'Jewel', 'Charm'
    ]
};

// Initialize socket system
SocketManager.initialize = function() {
    console.log('Initializing Socket Manager...');
    
    // Setup socket containers
    this.setupSocketContainers();
    
    // Setup modal handlers
    this.setupModalHandlers();
    
    // Setup socket item handlers
    this.setupSocketItemHandlers();
    
    console.log('Socket Manager initialized');
};

// Setup socket containers for each equipment slot
SocketManager.setupSocketContainers = function() {
    const containers = {
        '.socketcontainer': 'weapon',
        '.socketcontainer2': 'armor', 
        '.socketcontainer3': 'shield',
        '.socketcontainer4': 'helm'
    };
    
    Object.entries(containers).forEach(([selector, section]) => {
        const container = document.querySelector(selector);
        if (!container) return;
        
        container.dataset.section = section;
        
        // Click handler for the container
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('socketz')) {
                this.handleSocketClick(e.target);
            }
        });
        
        // Right-click to clear socket
        container.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('socketz')) {
                e.preventDefault();
                this.clearSocket(e.target);
            }
        });
    });
};

// Handle socket click
SocketManager.handleSocketClick = function(socket) {
    this.currentSocket = socket;
    this.showSocketModal();
};

// Show socket selection modal
SocketManager.showSocketModal = function() {
    const modal = document.getElementById('itemModal');
    if (!modal) {
        console.error('Socket modal not found');
        return;
    }
    
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
};

// Hide socket modal
SocketManager.hideSocketModal = function() {
    const modal = document.getElementById('itemModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    this.currentSocket = null;
};

// Setup modal handlers
SocketManager.setupModalHandlers = function() {
    // Close button
    const closeBtn = document.querySelector('#itemModal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hideSocketModal());
    }
    
    // Category tabs
    const tabs = document.querySelectorAll('.socket-category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            this.switchCategory(e.target.dataset.category);
        });
    });
    
    // Click outside to close
    const modal = document.getElementById('itemModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideSocketModal();
            }
        });
    }
};

// Switch socket category
SocketManager.switchCategory = function(category) {
    // Update active tab
    document.querySelectorAll('.socket-category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // Update visible content
    document.querySelectorAll('.socket-content').forEach(content => {
        content.classList.toggle('active', content.dataset.category === category);
    });
};

// Setup socket item handlers
SocketManager.setupSocketItemHandlers = function() {
    // This will be called after items are populated
    // We'll add handlers dynamically when items are created
};

// Add item to socket
SocketManager.addItemToSocket = function(itemData) {
    if (!this.currentSocket) return;
    
    // Clear existing content
    this.currentSocket.innerHTML = '';
    this.currentSocket.classList.remove('empty');
    this.currentSocket.classList.add('filled');
    
    // Store item data
    this.currentSocket.dataset.itemName = itemData.name;
    this.currentSocket.dataset.itemType = itemData.type;
    
    if (itemData.stats) {
        this.currentSocket.dataset.stats = JSON.stringify(itemData.stats);
    }
    
    // Create visual representation
    const itemElement = document.createElement('div');
    itemElement.className = 'socket-item-display';
    
    if (itemData.image) {
        const img = document.createElement('img');
        img.src = itemData.image;
        img.alt = itemData.name;
        itemElement.appendChild(img);
    } else {
        itemElement.textContent = itemData.name.substring(0, 3).toUpperCase();
    }
    
    this.currentSocket.appendChild(itemElement);
    
    // Update displays
    this.updateSocketDisplay();
    this.hideSocketModal();
    
    // Trigger update calculations
    if (typeof updateAllCalculations === 'function') {
        updateAllCalculations();
    }
};

// Clear socket
SocketManager.clearSocket = function(socket) {
    socket.innerHTML = '';
    socket.classList.remove('filled');
    socket.classList.add('empty');
    
    // Clear data attributes
    delete socket.dataset.itemName;
    delete socket.dataset.itemType;
    delete socket.dataset.stats;
    
    // Update displays
    this.updateSocketDisplay();
    
    // Trigger update calculations
    if (typeof updateAllCalculations === 'function') {
        updateAllCalculations();
    }
};

// Update socket count for an item
SocketManager.updateSocketCount = function(section, count = null) {
    const dropdownId = `${section}s-dropdown`;
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const selectedItem = dropdown.value;
    if (!selectedItem) {
        this.clearSocketContainer(section);
        return;
    }
    
    // Determine socket count
    let socketCount = count;
    if (socketCount === null) {
        // Get from item properties or corruption
        const itemData = itemList[selectedItem];
        if (itemData && itemData.properties && itemData.properties.sockets) {
            socketCount = itemData.properties.sockets;
        } else {
            // Check corruption
            const corruption = typeCorruptions[section];
            if (corruption && corruption.includes('Socketed')) {
                const match = corruption.match(/Socketed \((\d+)\)/);
                if (match) socketCount = parseInt(match[1]);
            }
        }
    }
    
    // Get max allowed sockets for this item
    const maxAllowed = this.getMaxSockets(selectedItem, itemData);
    socketCount = Math.min(socketCount || 0, maxAllowed);
    
    // Update socket UI
    this.renderSockets(section, socketCount);
};

// Get maximum sockets for an item
SocketManager.getMaxSockets = function(itemName, itemData) {
    if (!itemData) return 0;
    
    // Check if item can't have sockets
    const itemType = this.getItemBaseType(itemData.description);
    if (this.noSocketItems.includes(itemType)) return 0;
    
    // Check single socket items
    if (this.singleSocketItems.includes(itemType)) return 1;
    
    // Get max from item type
    return this.maxSockets[itemType] || this.maxSockets.default;
};

// Get item base type from description
SocketManager.getItemBaseType = function(description) {
    const lines = description.split('<br>');
    if (lines.length > 1) {
        // Second line usually contains the base type
        return lines[1].trim();
    }
    return 'default';
};

// Clear socket container
SocketManager.clearSocketContainer = function(section) {
    const container = this.getSocketContainer(section);
    if (container) {
        container.innerHTML = '';
    }
};

// Get socket container for a section
SocketManager.getSocketContainer = function(section) {
    const containerMap = {
        'weapon': '.socketcontainer',
        'helm': '.socketcontainer4',
        'armor': '.socketcontainer2',
        'shield': '.socketcontainer3',
        'off': '.socketcontainer3'
    };
    
    const selector = containerMap[section];
    return selector ? document.querySelector(selector) : null;
};

// Render sockets for a section
SocketManager.renderSockets = function(section, count) {
    const container = this.getSocketContainer(section);
    if (!container) return;
    
    // Save existing socket data
    const existingSockets = container.querySelectorAll('.socketz');
    const socketData = [];
    
    existingSockets.forEach(socket => {
        if (socket.dataset.itemName) {
            socketData.push({
                name: socket.dataset.itemName,
                type: socket.dataset.itemType,
                stats: socket.dataset.stats
            });
        }
    });
    
    // Clear and rebuild
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const socket = document.createElement('div');
        socket.className = 'socketz empty';
        socket.dataset.section = section;
        socket.dataset.index = i;
        
        // Restore data if available
        if (socketData[i]) {
            socket.classList.remove('empty');
            socket.classList.add('filled');
            socket.dataset.itemName = socketData[i].name;
            socket.dataset.itemType = socketData[i].type;
            if (socketData[i].stats) {
                socket.dataset.stats = socketData[i].stats;
            }
            
            // Add visual representation
            const itemElement = document.createElement('div');
            itemElement.className = 'socket-item-display';
            itemElement.textContent = socketData[i].name.substring(0, 3).toUpperCase();
            socket.appendChild(itemElement);
        }
        
        container.appendChild(socket);
    }
    
    // Re-attach event handlers
    container.querySelectorAll('.socketz').forEach(socket => {
        socket.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSocketClick(socket);
        });
        
        socket.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.clearSocket(socket);
        });
    });
};

// Update socket display information
SocketManager.updateSocketDisplay = function() {
    const sections = ['weapon', 'helm', 'armor', 'shield'];
    
    sections.forEach(section => {
        this.updateSectionSocketInfo(section);
    });
};

// Update socket info for a specific section
SocketManager.updateSectionSocketInfo = function(section) {
    const container = this.getSocketContainer(section);
    if (!container) return;
    
    const sockets = container.querySelectorAll('.socketz');
    const socketStats = [];
    
    sockets.forEach(socket => {
        if (socket.dataset.itemName && socket.dataset.stats) {
            try {
                const stats = JSON.parse(socket.dataset.stats);
                socketStats.push(...stats);
            } catch (e) {
                console.error('Error parsing socket stats:', e);
            }
        }
    });
    
    // Update info display
    const infoContainerId = `${section}-socket-stats`;
    let infoContainer = document.getElementById(infoContainerId);
    
    if (!infoContainer && socketStats.length > 0) {
        // Create info container if it doesn't exist
        const mainInfoContainer = document.getElementById(`${section}-info`);
        if (mainInfoContainer) {
            infoContainer = document.createElement('div');
            infoContainer.id = infoContainerId;
            infoContainer.className = 'socket-stats';
            mainInfoContainer.appendChild(infoContainer);
        }
    }
    
    if (infoContainer) {
        if (socketStats.length > 0) {
            infoContainer.innerHTML = '<div class="socket-stats-header">Socketed:</div>' +
                socketStats.map(stat => `<div class="socket-stat">${stat}</div>`).join('');
        } else {
            infoContainer.innerHTML = '';
        }
    }
};

// Get all socket data for saving
SocketManager.getSocketData = function() {
    const data = {};
    
    Object.keys(this.socketData).forEach(section => {
        const container = this.getSocketContainer(section);
        if (!container) return;
        
        const sockets = container.querySelectorAll('.socketz[data-item-name]');
        if (sockets.length > 0) {
            data[section] = Array.from(sockets).map(socket => ({
                name: socket.dataset.itemName,
                type: socket.dataset.itemType,
                stats: socket.dataset.stats ? JSON.parse(socket.dataset.stats) : []
            }));
        }
    });
    
    return data;
};

// Restore socket data from saved state
SocketManager.restoreSocketData = function(data) {
    if (!data) return;
    
    Object.entries(data).forEach(([section, sockets]) => {
        const container = this.getSocketContainer(section);
        if (!container) return;
        
        const socketElements = container.querySelectorAll('.socketz');
        
        sockets.forEach((socketData, index) => {
            if (socketElements[index]) {
                const socket = socketElements[index];
                socket.classList.remove('empty');
                socket.classList.add('filled');
                socket.dataset.itemName = socketData.name;
                socket.dataset.itemType = socketData.type;
                if (socketData.stats) {
                    socket.dataset.stats = JSON.stringify(socketData.stats);
                }
                
                // Add visual representation
                socket.innerHTML = '';
                const itemElement = document.createElement('div');
                itemElement.className = 'socket-item-display';
                itemElement.textContent = socketData.name.substring(0, 3).toUpperCase();
                socket.appendChild(itemElement);
            }
        });
    });
    
    this.updateSocketDisplay();
};

// Initialize socket items (gems, jewels, runes)
SocketManager.initializeSocketItems = function() {
    // Populate gems
    this.populateGems();
    
    // Populate runes
    this.populateRunes();
    
    // Setup jewel crafting
    this.setupJewelCrafting();
};

// Populate gem options
SocketManager.populateGems = function() {
    const gemsContent = document.querySelector('.socket-content[data-category="gems"]');
    if (!gemsContent) return;
    
    const gems = [
        { name: 'Chipped Ruby', stats: ['+[8-10] to Life'], image: 'img/chippedruby.png' },
        { name: 'Chipped Sapphire', stats: ['+[8-10] to Mana'], image: 'img/chippedsapphire.png' },
        { name: 'Chipped Topaz', stats: ['9% Chance to Find Magic Items'], image: 'img/chippedtopaz.png' },
        { name: 'Chipped Emerald', stats: ['+3 to Dexterity'], image: 'img/chippedemerald.png' },
        { name: 'Chipped Diamond', stats: ['+[20-25] to Attack Rating'], image: 'img/chippeddiamond.png' },
        { name: 'Chipped Amethyst', stats: ['+3 to Strength'], image: 'img/chippedamethyst.png' },
        { name: 'Chipped Skull', stats: ['Attacker Takes Damage of 2'], image: 'img/chippedskull.png' }
    ];
    
    gemsContent.innerHTML = '<div class="socket-options">' +
        gems.map(gem => `
            <div class="socket-item" data-gem="${gem.name}">
                <img src="${gem.image}" class="sock-img" alt="${gem.name}">
                <div class="sock-info">
                    <div class="sock-name">${gem.name}</div>
                    <div class="sock-stats">${gem.stats.join('<br>')}</div>
                </div>
            </div>
        `).join('') +
        '</div>';
    
    // Add click handlers
    gemsContent.querySelectorAll('.socket-item').forEach(item => {
        item.addEventListener('click', () => {
            const gemName = item.dataset.gem;
            const gem = gems.find(g => g.name === gemName);
            if (gem) {
                this.addItemToSocket({
                    name: gem.name,
                    type: 'gem',
                    stats: gem.stats,
                    image: gem.image
                });
            }
        });
    });
};

// Populate rune options
SocketManager.populateRunes = function() {
    const runesContent = document.querySelector('.socket-content[data-category="runes"]');
    if (!runesContent) return;
    
    const runes = [
        { name: 'El', stats: ['+1 to Light Radius', '+50 to Attack Rating'], image: 'img/el.png' },
        { name: 'Eld', stats: ['75% Damage to Undead', '+50 Attack Rating vs Undead'], image: 'img/eld.png' },
        { name: 'Tir', stats: ['+2 to Mana after each Kill'], image: 'img/tir.png' },
        { name: 'Nef', stats: ['Knockback'], image: 'img/nef.png' },
        { name: 'Eth', stats: ['-25% Target Defense'], image: 'img/eth.png' },
        { name: 'Ith', stats: ['+9 to Maximum Damage'], image: 'img/ith.png' }
        // Add more runes...
    ];
    
    runesContent.innerHTML = '<div class="socket-options">' +
        runes.map(rune => `
            <div class="socket-item" data-rune="${rune.name}">
                <img src="${rune.image}" class="sock-img" alt="${rune.name}">
                <div class="sock-info">
                    <div class="sock-name">${rune.name}</div>
                    <div class="sock-stats">${rune.stats.join('<br>')}</div>
                </div>
            </div>
        `).join('') +
        '</div>';
    
    // Add click handlers
    runesContent.querySelectorAll('.socket-item').forEach(item => {
        item.addEventListener('click', () => {
            const runeName = item.dataset.rune;
            const rune = runes.find(r => r.name === runeName);
            if (rune) {
                this.addItemToSocket({
                    name: rune.name,
                    type: 'rune',
                    stats: rune.stats,
                    image: rune.image
                });
            }
        });
    });
};

// Setup jewel crafting
SocketManager.setupJewelCrafting = function() {
    const jewelsContent = document.querySelector('.socket-content[data-category="jewels"]');
    if (!jewelsContent) return;
    
    jewelsContent.innerHTML = `
        <div class="jewel-crafting">
            <h3>Craft a Jewel</h3>
            <div class="jewel-affixes">
                <div class="prefix-section">
                    <h4>Prefixes</h4>
                    <select id="jewel-prefix" multiple size="5">
                        <option value="Ruby">Ruby (+[20-40]% Enhanced Damage)</option>
                        <option value="Fervent">Fervent (+1-3 to Minimum Damage)</option>
                        <option value="Garnet">Garnet (+10-20 to Maximum Damage)</option>
                    </select>
                </div>
                <div class="suffix-section">
                    <h4>Suffixes</h4>
                    <select id="jewel-suffix" multiple size="5">
                        <option value="Fervor">of Fervor (+5% Increased Attack Speed)</option>
                        <option value="Bliss">of Bliss (+1-3 to Mana after each Kill)</option>
                        <option value="Joy">of Joy (+1 to All Skills)</option>
                    </select>
                </div>
            </div>
            <button id="create-jewel-btn">Create Jewel</button>
            <div id="jewel-preview"></div>
        </div>
    `;
    
    // Handle jewel creation
    const createBtn = jewelsContent.querySelector('#create-jewel-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => this.createJewel());
    }
};

// Create custom jewel
SocketManager.createJewel = function() {
    const prefixSelect = document.getElementById('jewel-prefix');
    const suffixSelect = document.getElementById('jewel-suffix');
    
    const selectedPrefixes = Array.from(prefixSelect.selectedOptions);
    const selectedSuffixes = Array.from(suffixSelect.selectedOptions);
    
    if (selectedPrefixes.length === 0 && selectedSuffixes.length === 0) {
        alert('Please select at least one affix for your jewel');
        return;
    }
    
    const stats = [];
    let jewelName = '';
    
    // Add prefix stats
    if (selectedPrefixes.length > 0) {
        jewelName += selectedPrefixes[0].value + ' ';
        selectedPrefixes.forEach(option => {
            const stat = option.text.match(/\(([^)]+)\)/);
            if (stat) stats.push(stat[1]);
        });
    }
    
    jewelName += 'Jewel';
    
    // Add suffix stats
    if (selectedSuffixes.length > 0) {
        jewelName += ' ' + selectedSuffixes[0].value;
        selectedSuffixes.forEach(option => {
            const stat = option.text.match(/\(([^)]+)\)/);
            if (stat) stats.push(stat[1]);
        });
    }
    
    // Add jewel to socket
    this.addItemToSocket({
        name: jewelName,
        type: 'jewel',
        stats: stats
    });
    
    // Clear selections
    prefixSelect.selectedIndex = -1;
    suffixSelect.selectedIndex = -1;
};

// Export for global access
window.SocketManager = SocketManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SocketManager.initialize());
} else {
    SocketManager.initialize();
}