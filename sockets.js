const SocketManager = {
    init() {
      // Create stat containers
      const containers = ["helm", "weapon", "armor", "shield"];
      containers.forEach((type, index) => {
        const statsContainer = document.createElement("div");
        statsContainer.id = `${type}socketstats`;
        statsContainer.className = `${type}-socket-stats`;
        document.body.appendChild(statsContainer);
      });
  
      // Store DOM elements
      this.elements = {
        modal: document.getElementById("socketModal"),
        closeBtn: document.querySelector(".socket-close"),
        socketItems: document.querySelectorAll(".socket-item"),
        categoryTabs: document.querySelectorAll(".socket-category-tab"),
        categoryContents: document.querySelectorAll(".socket-content"),
        helmDropdown: document.getElementById("helms-dropdown"),
        armorDropdown: document.getElementById("armors-dropdown"),
        weaponDropdown: document.getElementById("weapons-dropdown"),
        offDropdown: document.getElementById("offs-dropdown"),
        socketContainers: {
          container1: document.querySelector(".socketcontainer"),
          container2: document.querySelector(".socketcontainer2"),
          container3: document.querySelector(".socketcontainer3"),
          container4: document.querySelector(".socketcontainer4"),
        },
      };
  
      this.currentSocket = null;
      this.socketStates = {
        container1: [],
        container2: [],
        container3: [],
        container4: [],
      };
  
      this.setupEventListeners();
      this.updateSockets();
    },
  
    // Your existing methods go here
    setupEventListeners() {
        function attachSocketListeners(socket, containerKey, socketIndex) {
            socket.addEventListener('click', (e) => {
              modal.style.display = 'block';
              currentSocket = {
                element: socket,
                containerKey: containerKey,
                index: socketIndex
              };
            });
          
            socket.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              socket.classList.add('empty');
              const socketImg = socket.querySelector('.socket-sock-img');
              socketImg.src = '';
              socketImg.style.display = 'none';
              
              socketStates[containerKey][socketIndex] = {
                gemType: '',
                gemImg: '',
                gemStats: null
              };
    },
  
    handleSocketItemSelection() {
      // ... your existing handleSocketItemSelection code ...
    },
  
    getGemStats(gemType) {
        function getGemStats(gemType) {
            const statsMap = {
              'chipped-sapphire': {
                helm: '+10 to Mana',
                weapon: '+1-3 Cold Damage',
                armor: '+10 to Mana',
                shield: 'Cold Resist +12%'
              },
              'flawed-sapphire': {
                helm: '+17 to Mana',
                weapon: '+3-5 Cold Damage', 
                armor: '+17 to Mana',
                shield: 'Cold Resist +16%'
              },
              'sapphire': {
                helm: '+24 to Mana',
                weapon: '+4-7 Cold Damage',
                armor: '+24 to Mana', 
                shield: 'Cold Resist +22%'
              },
              'flawless-sapphire': {
                helm: '+31 to Mana',
                weapon: '+4-7 Cold Damage',
                armor: '+31 to Mana',
                shield: 'Cold Resist +28%'
              },
              'perfect-sapphire': {
                helm: '+38 to Mana',
                weapon: '+4-7 Cold Damage',
                armor: '+38 to Mana',
                shield: 'Cold Resist +40%'
              },
              'chipped-emerald': {
                helm: '+3 to Dexterity',
                weapon: '+10 Poison Damage over 3 Seconds',
                armor: '+3 to Dexterity',
                shield: 'Poison Resist +12%'
              },
              'flawed-emerald': {
                helm: '+4 to Dexterity',
                weapon: '+20 Poison Damage over 4 Seconds',
                armor: '+4 to Dexterity',
                shield: 'Poison Resist +16%'
              },
              'emerald': {
                helm: '+6 to Dexterity',
                weapon: '+40 Poison Damage over 5 Seconds',
                armor: '+6 to Dexterity',
                shield: 'Poison Resist +22%'
              },
              'flawless-emerald': {
                helm: '+8 to Dexterity',
                weapon: '+60 Poison Damage over 6 Seconds',
                armor: '+8 to Dexterity',
                shield: 'Poison Resist +28%'
              },
              'perfect-emerald': {
                helm: '+10 to Dexterity',
                weapon: '+100 Poison Damage over 7 Seconds',
                armor: '+10 to Dexterity',
                shield: 'Poison Resist +40%'
              },
              'chipped-topaz': {
                helm: '9% Better Chance of Getting Magic Items',
                weapon: 'Adds 1-8 Lightning Damage',
                armor: '9% Better Chance of Getting Magic Items',
                shield: 'Lightning Resist +12%'
              },
              'flawed-topaz': {
                helm: '13% Better Chance of Getting Magic Items',
                weapon: 'Adds 1-14 Lightning Damage',
                armor: '13% Better Chance of Getting Magic Items',
                shield: 'Lightning Resist +16%'
              },
              'topaz': {
                helm: '16% Better Chance of Getting Magic Items',
                weapon: 'Adds 1-22 Lightning Damage',
                armor: '16% Better Chance of Getting Magic Items',
                shield: 'Lightning Resist +22%'
              },
              'flawless-topaz': {
                helm: '20% Better Chance of Getting Magic Items',
                weapon: 'Adds 1-30 Lightning Damage',
                armor: '20% Better Chance of Getting Magic Items',
                shield: 'Lightning Resist +28%'
              },
              'perfect-topaz': {
                helm: '24% Better Chance of Getting Magic Items',
                weapon: 'Adds 1-40 Lightning Damage',
                armor: '24% Better Chance of Getting Magic Items',
                shield: 'Lightning Resist +40%'
              },
              'chipped-ruby': {
                helm: '+10 to Life',
                weapon: 'Adds 3-4 Fire Damage',
                armor: '+10 to Life',
                shield: 'Fire Resist +12%'
              },
              'flawed-ruby': {
                helm: '+17 to Life',
                weapon: 'Adds 5-8 Fire Damage',
                armor: '+17 to Life',
                shield: 'Fire Resist +16%'
              },
              'ruby': {
                helm: '+24 to Life',
                weapon: 'Adds 8-12 Fire Damage',
                armor: '+24 to Life',
                shield: 'Fire Resist +22%'
              },
              'flawless-ruby': {
                helm: '+31 to Life',
                weapon: 'Adds 10-16 Fire Damage',
                armor: '+31 to Life',
                shield: 'Fire Resist +28%'
              },
              'perfect-ruby': {
                helm: '+40 to Life',
                weapon: 'Adds 15-20 Fire Damage',
                armor: '+40 to Life',
                shield: 'Fire Resist +40%'
              },
              'chipped-amethyst': {
                helm: '+3 to Strength',
                weapon: '+40 to Attack Rating',
                armor: '+3 to Strength',
                shield: '+8 Defense'
              },
              'flawed-amethyst': {
                helm: '+4 to Strength',
                weapon: '+60 to Attack Rating',
                armor: '+4 to Strength',
                shield: '+12 Defense'
              },
              'amethyst': {
                helm: '+6 to Strength',
                weapon: '+80 to Attack Rating',
                armor: '+6 to Strength',
                shield: '+18 Defense'
              },
              'flawless-amethyst': {
                helm: '+8 to Strength',
                weapon: '+100 to Attack Rating',
                armor: '+8 to Strength',
                shield: '+24 Defense'
              },
              'perfect-amethyst': {
                helm: '+10 to Strength',
                weapon: '150 to Attack Rating',
                armor: '+10 to Strength',
                shield: '+30 Defense'
              },
              'chipped-diamond': {
                helm: '+20 to Attack Rating',
                weapon: '+28% Damage to Undead',
                armor: '+20 to Attack Rating',
                shield: 'All Resistances +6'
              },
              'flawed-diamond': {
                helm: '+40 to Attack Rating',
                weapon: '+34% Damage to Undead',
                armor: '+40 to Attack Rating',
                shield: 'All Resistances +8'
              },
              'diamond': {
                helm: '+60 to Attack Rating',
                weapon: '+44% Damage to Undead',
                armor: '+60 to Attack Rating',
                shield: 'All Resistances +11'
              },
              'flawless-diamond': {
                helm: '+80 to Attack Rating',
                weapon: '+54% Damage to Undead',
                armor: '+80 to Attack Rating',
                shield: 'All Resistances +14'
              },
              'perfect-diamond': {
                helm: '+100 to Attack Rating',
                weapon: '+68% Damage to Undead',
                armor: '+100 to Attack Rating',
                shield: 'All Resistances +19'
              },
              'chipped-skull': {
                helm: 'Regenerate Mana 8%, Replenish Life +2',
                weapon: '2% Life Stolen per Hit, 1% Mana Stolen per Hit',
                armor: 'Regenerate Mana 8%, Replenish Life +2',
                shield: 'Attacker Takes Damage of 4'
              },
              'flawed-skull': {
                helm: 'Regenerate Mana 8%, Replenish Life +3',
                weapon: '2% Life Stolen per Hit, 2% Mana Stolen per Hit',
                armor: 'Regenerate Mana 8%, Replenish Life +3',
                shield: 'Attacker Takes Damage of 8'
              },
              'skull': {
                helm: 'Regenerate Mana 12%, Replenish Life +3',
                weapon: '3% Life Stolen per Hit, 2% Mana Stolen per Hit',
                armor: 'Regenerate Mana 12%, Replenish Life +3',
                shield: 'Attacker Takes Damage of 12'
              },
              'flawless-skull': {
                helm: 'Regenerate Mana 12%, Replenish Life +4',
                weapon: '3% Life Stolen per Hit, 3% Mana Stolen per Hit',
                armor: 'Regenerate Mana 12%, Replenish Life +4',
                shield: 'Attacker Takes Damage of 16'
              },
              'perfect-skull': {
                helm: 'Regenerate Mana 19%, Replenish Life +5',
                weapon: '4% Life Stolen per Hit, 3% Mana Stolen per Hit',
                armor: 'Regenerate Mana 19%, Replenish Life +5',
                shield: 'Attacker Takes Damage of 20'
              },
              'el': {
                helm: '+15 Defense, +1 Light Radius',
                weapon: '+50 AR, +1 Light Radius',
                armor: '+15 Defense, +1 Light Radius',
                shield: '+15 Defense, +1 Light Radius'
              },
              'eld': {
                helm: '15% Slower Stamina Drain',
                weapon: '+75% Damage to Undead, +50 to Attack Rating against Undead',
                armor: '15% Slower Stamina Drain',
                shield: '7% Increased Chance of Blocking'
              },
              'tir': {
                helm: '+2 to Mana after each Kill',
                weapon: '+2 to Mana after each Kill',
                armor: '+2 to Mana after each Kill',
                shield: '+2 to Mana after each Kill'
              },
              'nef': {
                helm: '+30 Defense vs. Missile',
                weapon: 'Knockback',
                armor: '+30 Defense vs. Missile',
                shield: '+30 Defense vs. Missile'
              },
              'eth': {
                helm: 'Regenerate Mana 15%',
                weapon: '-25% Target Defense',
                armor: 'Regenerate Mana 15%',
                shield: 'Regenerate Mana 15%'
              },
              'ith': {
                helm: '15% Damage Taken Gained as Mana when Hit',
                weapon: '+9 to Maximum Damage',
                armor: '15% Damage Taken Gained as Mana when Hit',
                shield: '15% Damage Taken Gained as Mana when Hit'
              },
              'tal': {
                helm: 'Poison Resist +30%',
                weapon: '+75 Poison Damage over 5 Seconds',
                armor: 'Poison Resist +30%',
                shield: 'Poison Resist +35%'
              },
              'ral': {
                helm: 'Fire Resist +30%',
                weapon: 'Adds 5-30 Fire Damage',
                armor: 'Fire Resist +30%',
                shield: 'Fire Resist +35%'
              },
              'ort': {
                helm: 'Lightning Resist +30%',
                weapon: 'Adds 1-50 Lightning Damage',
                armor: 'Lightning Resist +30%',
                shield: 'Lightning Resist +35%'
              },
              'thul': {
                helm: 'Cold Resist +30%',
                weapon: 'Adds 3-14 Cold Damage',
                armor: 'Cold Resist +30%',
                shield: 'Cold Resist +35%'
              },
              'amn': {
                helm: 'Attacker Takes Damage of 14',
                weapon: '7% Life Stolen per Hit',
                armor: 'Attacker Takes Damage of 14',
                shield: 'Attacker Takes Damage of 14'
              },
              'sol': {
                helm: 'Physical Damage Taken Reduced by 7',
                weapon: '+9 to Minimum Damage',
                armor: 'Physical Damage Taken Reduced by 7',
                shield: 'Physical Damage Taken Reduced by 7'
              },
              'shael': {
                helm: '+20% Faster Hit Recovery',
                weapon: '+20% Increased Attack Speed',
                armor: '+20% Faster Hit Recovery',
                shield: '+20% Faster Block Rate'
              },
              'dol': {
                helm: 'Replenish Life +10',
                weapon: '20% Enhanced Damage',
                armor: 'Replenish Life +10',
                shield: 'Replenish Life +10'
              },
              'hel': {
                helm: 'Requirements -20%',
                weapon: 'Requirements -20%',
                armor: 'Requirements -20%',
                shield: 'Requirements -20%'
              },
              'io': {
                helm: '+10 to Vitality',
                weapon: '+10 to Vitality',
                armor: '+10 to Vitality',
                shield: '+10 to Vitality'
              },
              'lum': {
                helm: '+10 to Energy',
                weapon: '+10 to Energy',
                armor: '+10 to Energy',
                shield: '+10 to Energy'
              },
              'ko': {
                helm: '+10 to Dexterity',
                weapon: '+10 to Dexterity',
                armor: '+10 to Dexterity',
                shield: '+10 to Dexterity'
              },
              'fal': {
                helm: '+10 to Strength',
                weapon: '+10 to Strength',
                armor: '+10 to Strength',
                shield: '+10 to Strength'
              },
              'lem': {
                helm: '50% Extra Gold From Monsters',
                weapon: '75% Extra Gold From Monsters',
                armor: '50% Extra Gold From Monsters',
                shield: '50% Extra Gold From Monsters'
              },
              'pul': {
                helm: '+30% Enhanced Defense',
                weapon: '+75% Damage to Demons, +100 to Attack Rating against Demons',
                armor: '+30% Enhanced Defense',
                shield: '+30% Enhanced Defense'
              },
              'um': {
                helm: 'All Resistances +15',
                weapon: '10% Chance of Open Wounds, +120 Open Wounds Damage per Second',
                armor: 'All Resistances +15',
                shield: 'All Resistances +22'
              },
              'mal': {
                helm: 'Magic Damage Taken Reduced by 7',
                weapon: 'Prevent Monster Heal',
                armor: 'Magic Damage Taken Reduced by 7',
                shield: 'Magic Damage Taken Reduced by 7'
              },
              'ist': {
                helm: '30% Better Chance of Getting Magic Items',
                weapon: '30% Better Chance of Getting Magic Items',
                armor: '30% Better Chance of Getting Magic Items',
                shield: '30% Better Chance of Getting Magic Items'
              },
              'gul': {
                helm: '+4% to Maximum Poison Resist',
                weapon: '20% Bonus to Attack Rating',
                armor: '+4% to Maximum Poison Resist',
                shield: '+4% to Maximum Poison Resist'
              },
              'vex': {
                helm: '+4% to Maximum Fire Resist',
                weapon: '7% Mana Stolen per Hit',
                armor: '+4% to Maximum Fire Resist',
                shield: '+4% to Maximum Fire Resist'
              },
              'ohm': {
                helm: '+4% to Maximum Cold Resist',
                weapon: '+45% Enhanced Damage',
                armor: '+4% to Maximum Cold Resist',
                shield: '+4% to Maximum Cold Resist'
              },
              'lo': {
                helm: '+4% to Maximum Lightning Resist',
                weapon: '20% Deadly Strike',
                armor: '+4% to Maximum Lightning Resist',
                shield: '+4% to Maximum Lightning Resist'
              },
              'sur': {
                helm: 'Increase Maximum Mana 5%',
                weapon: '+4 Life after each Kill',
                armor: 'Increase Maximum Mana 5%',
                shield: '50 to Mana'
              },
              'ber': {
                helm: 'Physical Damage Taken Reduced by 5%',
                weapon: '20% Chance of Crushing Blow',
                armor: 'Physical Damage Taken Reduced by 5%',
                shield: 'Physical Damage Taken Reduced by 5%'
              },
              'jah': {
                helm: 'Increase Maximum Life 5%',
                weapon: 'Ignore Target\'s Defense',
                armor: 'Increase Maximum Life 5%',
                shield: '+75 to Life'
              },
              'cham': {
                helm: 'Cannot Be Frozen',
                weapon: 'Freezes Target +3',
                armor: 'Cannot Be Frozen',
                shield: 'Cannot Be Frozen'
              },
              'zod': {
                helm: 'Indestructible',
                weapon: 'Indestructible',
                armor: 'Indestructible',
                shield: 'Indestructible'
              }
            };
            return statsMap[gemType] || { helm: '', weapon: '', armor: '', shield: '' };
          }
          
        },
    splitStats(stat) {
      //function splitStats(stat) {
  // Split stats that are separated by commas or contain multiple properties
  if (stat.includes(',')) {
    return stat.split(',').map(s => s.trim());
  }
  
  // Handle compound stats with 'and'
  if (stat.includes(' and ')) {
    return stat.split(' and ').map(s => s.trim());
  }
  
  // For stats with multiple properties but no explicit separator
  if (stat.includes('Regenerate') && stat.includes('after')) {
    const parts = stat.match(/(Regenerate.*?)(\+\d+ to.*)/);
    if (parts) {
      return [parts[1].trim(), parts[2].trim()];
    }
  }
  
  return [stat];
} 
    },
  
    formatStat(stat) {
        function formatStat(stat) {
            // Clean up the stat
            stat = stat.trim();
            
            // Handle resist cases
            const resistMatch = stat.match(/(\w+)\s*Resist\s*\+?(\d+)%/);
            if (resistMatch) {
              return `${resistMatch[1]} Resist +${resistMatch[2]}%`;
            }
          
            // Handle "to Mana after each Kill" cases
            if (stat.includes('to Mana after each Kill')) {
              if (!stat.startsWith('+')) {
                return '+' + stat;
              }
            }
          
            // Handle special prefixed stats that shouldn't start with +
            if (stat.startsWith('Regenerate') ||
                stat.startsWith('Replenish') ||
                stat.startsWith('Increase') ||
                stat.includes('Damage Taken') ||
                stat === 'Cannot Be Frozen' ||
                stat === 'Indestructible' ||
                stat === 'Prevent Monster Heal' ||
                stat === 'Knockback' ||
                stat === 'Ignore Target\'s Defense') {
              return stat;
            }
          
            // Add + to numeric stats if missing
            if (stat.match(/^\d/)) {
              return '+' + stat;
            }
          
            return stat;
          }

  },
    
        function combineStats(stats) {
            const statMap = new Map();
            
            stats.forEach(stat => {
              if (!stat) return;
              
              // Split multiple stats separated by commas or 'and'
              const individualStats = stat.split(/,\s*|\s+and\s+/);
              
              individualStats.forEach(singleStat => {
                // Clean up the stat
                singleStat = singleStat.trim();
                
                // Special cases
                if (singleStat.startsWith('Regenerate') || 
                    singleStat.startsWith('Replenish') ||
                    singleStat.startsWith('Increase') ||
                    singleStat.includes('Damage Taken')) {
                  // Keep these stats as is, they're properly formatted
                  if (statMap.has(singleStat)) {
                    // If it's a percentage stat, add the numbers
                    const percentMatch = singleStat.match(/(\d+)%/);
                    if (percentMatch) {
                      const currentValue = parseInt(statMap.get(singleStat).match(/(\d+)%/)[1]);
                      const newValue = currentValue + parseInt(percentMatch[1]);
                      const newStat = singleStat.replace(/\d+%/, `${newValue}%`);
                      statMap.set(singleStat, { type: 'text', value: newStat });
                    }
                  } else {
                    statMap.set(singleStat, { type: 'text', value: singleStat });
                  }
                  return;
                }
          
                // Handle "Resist +X%" cases
                if (singleStat.match(/\w+ Resist \+\d+%/)) {
                  const [type, value] = singleStat.split('Resist ');
                  const numValue = parseInt(value.match(/\d+/)[0]);
                  
                  if (statMap.has(type + 'Resist')) {
                    const currentValue = statMap.get(type + 'Resist');
                    statMap.set(type + 'Resist', {
                      type: 'resist',
                      value: currentValue.value + numValue
                    });
                  } else {
                    statMap.set(type + 'Resist', {
                      type: 'resist',
                      value: numValue
                    });
                  }
                  return;
                }
          
                // Handle all other cases
                if (!statMap.has(singleStat)) {
                  statMap.set(singleStat, { type: 'text', value: singleStat });
                }
              });
            });
          
            // Convert map back to array of strings
            return Array.from(statMap.values()).map(stat => {
              if (stat.type === 'resist') {
                return `${stat.key} Resist +${stat.value}%`;
              }
              return stat.value;
          
              const splitStatArray = splitStats(stat);
              
              // Format each individual stat
              splitStatArray.forEach(singleStat => {
                const formattedStat = formatStat(singleStat);
                if (formattedStat && !allStats.includes(formattedStat)) {
                  allStats.push(formattedStat);
                }
              });
            });
            
            return allStats;
          }
            
          
    },
    function updateStatsDisplay() {
    const helmStats = document.getElementById('helmsocketstats');
  const weaponStats = document.getElementById('weaponsocketstats');
  const armorStats = document.getElementById('armorsocketstats');
  const shieldStats = document.getElementById('shieldsocketstats');

  // Get the current number of visible sockets for each container
  const visibleSockets = {
    container1: document.querySelector('.socketcontainer')?.childElementCount || 0,
    container2: document.querySelector('.socketcontainer2')?.childElementCount || 0,
    container3: document.querySelector('.socketcontainer3')?.childElementCount || 0,
    container4: document.querySelector('.socketcontainer4')?.childElementCount || 0
  };

  function processContainerStats(container, statType) {
    // Only process stats for currently visible sockets
    const stats = socketStates[container]
      .slice(0, visibleSockets[container]) // Only take stats from visible sockets
      .map(socket => socket.gemStats?.[statType] || '')
      .filter(stat => stat !== '');
    
    return combineStats(stats).join('<br>') || 'No socketables socketed';
  }

  // Update all stat displays
  helmStats.innerHTML = processContainerStats('container1', 'helm');
  weaponStats.innerHTML = processContainerStats('container3', 'weapon');
  armorStats.innerHTML = processContainerStats('container2', 'armor');
  shieldStats.innerHTML = processContainerStats('container4', 'shield');
}



function updateSocketsForContainer(container, numberOfSockets, containerKey) {
  // Add new empty sockets if needed
  while (socketStates[containerKey].length < numberOfSockets) {
    socketStates[containerKey].push({
      gemType: '',
      gemImg: '',
      gemStats: null
    });
  }
  
  // Clear and rebuild the container's DOM
  container.innerHTML = '';

  // Only display up to numberOfSockets, but don't delete excess sockets from state
  for (let i = 0; i < numberOfSockets; i++) {
    const socket = document.createElement('div');
    socket.classList.add('socket');
    
    const img = document.createElement('img');
    img.classList.add('socket-sock-img');
    
    const state = socketStates[containerKey][i];
    if (state.gemImg) {
      img.src = state.gemImg;
      img.style.display = 'block';
      socket.classList.remove('empty');
    } else {
      img.src = '';
      img.style.display = 'none';
      socket.classList.add('empty');
    }
    
    socket.appendChild(img);
    container.appendChild(socket);
    
    attachSocketListeners(socket, containerKey, i);
  }
  
  // Update stats display to show only active socket stats
  updateStatsDisplay();

   
    },
  
    updateSocketsForContainer(container, numberOfSockets, containerKey) {
      // Add new empty sockets if needed
      while (this.socketStates[containerKey].length < numberOfSockets) {
        this.socketStates[containerKey].push({
          gemType: '',
          gemImg: '',
          gemStats: null
        });
      }
      
      // Clear and rebuild the container's DOM
      container.innerHTML = '';
  
      // Only display up to numberOfSockets
      for (let i = 0; i < numberOfSockets; i++) {
        const socket = document.createElement('div');
        socket.classList.add('socket');
        
        const img = document.createElement('img');
        img.classList.add('socket-sock-img');
        
        const state = this.socketStates[containerKey][i];
        if (state.gemImg) {
          img.src = state.gemImg;
          img.style.display = 'block';
          socket.classList.remove('empty');
        } else {
          img.src = '';
          img.style.display = 'none';
          socket.classList.add('empty');
        }
        
        socket.appendChild(img);
        container.appendChild(socket);
        
        this.attachSocketListeners(socket, containerKey, i);
      }
      
      this.updateStatsDisplay();
    },
  
    attachSocketListeners(socket, containerKey, socketIndex) {
      socket.addEventListener('click', (e) => {
        this.elements.modal.style.display = 'block';
        this.currentSocket = {
          element: socket,
          containerKey: containerKey,
          index: socketIndex
        };
      });
  
      socket.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        socket.classList.add('empty');
        const socketImg = socket.querySelector('.socket-sock-img');
        socketImg.src = '';
        socketImg.style.display = 'none';
        
        this.socketStates[containerKey][socketIndex] = {
          gemType: '',
          gemImg: '',
          gemStats: null
        };
        
        this.updateStatsDisplay();
      });
    },
  
    updateSockets() {
        const specialCases = {
          helms: ["Biggin's Bonnet", "Tarnhelm", "Coif of Glory" /* ... */],
          armors: ["Greyform", "Blinkbat's Form" /* ... */],
          weapons: ["The Gnasher", "Deathspade" /* ... */],
          shields: ["Pelta Lunata", "Umbral Disk" /* ... */]
        };
    
        const getSocketCount = (itemName, defaultCount, specialList) => {
          return specialList.includes(itemName.trim()) ? 2 : defaultCount;
        };
    
        const counts = {
          container1: getSocketCount(this.elements.helmDropdown.value, 3, specialCases.helms),
          container2: getSocketCount(this.elements.armorDropdown.value, 6, specialCases.armors),
          container3: getSocketCount(this.elements.weaponDropdown.value, 6, specialCases.weapons),
          container4: getSocketCount(this.elements.offDropdown.value, 6, specialCases.shields)
        };
    
        Object.entries(counts).forEach(([key, count]) => {
          this.updateSocketsForContainer(this.elements.socketContainers[key], count, key);
        });
      }
    };
    
    // Initialize when DOM is ready
    document.addEventListener("DOMContentLoaded", () => SocketManager.init());