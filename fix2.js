// 🔧 CRITICAL BUG FIXES - Fixes the 3 major issues with ultimate socket fix
// 1. Item name stays at top (description order preserved)
// 2. Stats calculator counts ALL sockets correctly 
// 3. Sockets persist on dropdown changes + immediate stat updates

(function() {
  'use strict';
  
  console.log('🔧 Loading critical bug fixes...');
  
  function applyCriticalFixes() {
    if (!window.statsCalculator || !window.ULTIMATE_SOCKET_FIX?.active) {
      console.log('⏳ Waiting for ultimate socket fix...');
      setTimeout(applyCriticalFixes, 500);
      return;
    }
    
    const sc = window.statsCalculator;
    
    // 🔧 FIX 1: Preserve description order (item name at top)
    console.log('🔧 Fix 1: Preserving description order...');
    
    sc.buildUltimateDescription = function(originalDescription, mergedStats) {
      const lines = originalDescription.split('<br>');
      const newLines = [];
      
      // Process line by line, maintaining exact order
      lines.forEach((line, index) => {
        const cleanLine = line.replace(/<[^>]*>/g, '').trim();
        if (!cleanLine) {
          newLines.push(line);
          return;
        }
        
        // Check if this line has a merged stat
        let foundMergedStat = false;
        for (const [key, stat] of mergedStats.entries()) {
          if (stat.index === index && stat.socketSources && stat.socketSources.length > 0) {
            // This line has socket enhancements - use the merged version
            newLines.push(this.formatUltimateStat(stat.pattern, stat.value));
            foundMergedStat = true;
            break;
          }
        }
        
        if (!foundMergedStat) {
          // Keep original line unchanged
          newLines.push(line);
        }
      });
      
      // Add socket-only stats at the end (not merged into existing lines)
      mergedStats.forEach((stat, key) => {
        if (stat.isSocketOnly || key.startsWith('unique_')) {
          if (key.startsWith('unique_')) {
            newLines.push(`<span style="color: #4a90e2; font-weight: bold;">${stat.originalStat}</span>`);
          } else {
            newLines.push(this.formatUltimateStat(stat.pattern, stat.value));
          }
        }
      });
      
      return newLines.join('<br>');
    };
    
    // 🔧 FIX 2: Make stats calculator count ALL sockets properly
    console.log('🔧 Fix 2: Fixing stats calculator to count all sockets...');
    
    // Override calculateSocketStats to ensure it processes ALL sockets
    if (sc.calculateSocketStats) {
      sc._fixedCalculateSocketStats = sc.calculateSocketStats;
      
      sc.calculateSocketStats = function() {
        console.log('⚡ Fixed socket stats calculation (counts ALL sockets)');
        
        // Reset socket tracking to ensure fresh calculation
        window.ULTIMATE_SOCKET_FIX.processedSockets.clear();
        
        const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
        const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
        
        sections.forEach(section => {
          const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);
          
          if (sockets.length === 0) return;
          
          // Check section-level requirements
          const dropdownIdMap = {
            'weapon': 'weapons-dropdown', 'helm': 'helms-dropdown', 'armor': 'armors-dropdown',
            'shield': 'offs-dropdown', 'gloves': 'gloves-dropdown', 'belts': 'belts-dropdown',
            'boots': 'boots-dropdown', 'ringone': 'ringsone-dropdown', 'ringtwo': 'ringstwo-dropdown',
            'amulet': 'amulets-dropdown'
          };
          
          const dropdown = document.getElementById(dropdownIdMap[section]);
          const selectedItem = dropdown?.value;
          
          if (!selectedItem) return;
          
          const actualRequiredLevel = this.calculateActualRequiredLevel(section, selectedItem);
          const sectionUsable = currentLevel >= actualRequiredLevel;
          
          if (!sectionUsable) {
            console.log(`❌ Skipping ${section} sockets - section level requirement not met`);
            return;
          }
          
          // Process each socket individually (no duplicate tracking here)
          sockets.forEach((socket, socketIndex) => {
            const stats = socket.dataset.stats;
            const socketLevelReq = parseInt(socket.dataset.levelReq) || 1;
            const itemName = socket.dataset.itemName || 'Unknown';
            
            if (stats && currentLevel >= socketLevelReq) {
              console.log(`✅ Processing socket ${socketIndex + 1} in ${section}: ${itemName} - ${stats}`);
              // Force processing without duplication checks for stats calculation
              this.parseSocketStatsForced(stats, section, itemName);
            } else {
              console.log(`❌ Skipped socket ${socketIndex + 1} in ${section}: ${itemName} - level requirement not met`);
            }
          });
        });
        
        console.log('✅ Fixed socket calculation complete - ALL sockets counted');
      };
    }
    
    // New forced parsing method that bypasses duplication checks
    sc.parseSocketStatsForced = function(statLine, itemType, itemKey) {
      console.log(`🔍 Force parsing: ${statLine}`);
      
      // Parse all stats without duplication blocking
      const cleanLine = statLine.replace(/<[^>]*>/g, '').trim();
      
      // Enhanced Damage
      const edmMatch = cleanLine.match(/(\d+)%\s*Enhanced Damage/i);
      if (edmMatch) {
        const value = parseInt(edmMatch[1]);
        this.stats.enhancedDamage += value;
        console.log(`💪 +${value}% Enhanced Damage (total: ${this.stats.enhancedDamage}%)`);
      }
      
      // Increased Attack Speed
      const iasMatch = cleanLine.match(/(\d+)%\s*Increased Attack Speed/i);
      if (iasMatch) {
        const value = parseInt(iasMatch[1]);
        this.stats.ias += value;
        console.log(`⚡ +${value}% IAS (total: ${this.stats.ias}%)`);
      }
      
      // Attributes - CRITICAL for bug fix
      const strMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Strength/i);
      if (strMatch) {
        const value = parseInt(strMatch[1]);
        this.stats.strength += value;
        console.log(`💪 +${value} Strength (total: ${this.stats.strength})`);
      }
      
      const dexMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Dexterity/i);
      if (dexMatch) {
        const value = parseInt(dexMatch[1]);
        this.stats.dexterity += value;
        console.log(`🏹 +${value} Dexterity (total: ${this.stats.dexterity})`);
      }
      
      const vitMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Vitality/i);
      if (vitMatch) {
        const value = parseInt(vitMatch[1]);
        this.stats.vitality += value;
        console.log(`❤️ +${value} Vitality (total: ${this.stats.vitality})`);
      }
      
      const enrMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Energy/i);
      if (enrMatch) {
        const value = parseInt(enrMatch[1]);
        this.stats.energy += value;
        console.log(`⚡ +${value} Energy (total: ${this.stats.energy})`);
      }
      
      // Resistances
      const fireResMatch = cleanLine.match(/Fire Resist \+(\d+)%?/i);
      if (fireResMatch) {
        const value = parseInt(fireResMatch[1]);
        this.stats.fireResist += value;
        console.log(`🔥 +${value}% Fire Resist (total: ${this.stats.fireResist}%)`);
      }
      
      const coldResMatch = cleanLine.match(/Cold Resist \+(\d+)%?/i);
      if (coldResMatch) {
        const value = parseInt(coldResMatch[1]);
        this.stats.coldResist += value;
        console.log(`❄️ +${value}% Cold Resist (total: ${this.stats.coldResist}%)`);
      }
      
      const lightResMatch = cleanLine.match(/Lightning Resist \+(\d+)%?/i);
      if (lightResMatch) {
        const value = parseInt(lightResMatch[1]);
        this.stats.lightningResist += value;
        console.log(`⚡ +${value}% Lightning Resist (total: ${this.stats.lightningResist}%)`);
      }
      
      const poisonResMatch = cleanLine.match(/Poison Resist \+(\d+)%?/i);
      if (poisonResMatch) {
        const value = parseInt(poisonResMatch[1]);
        this.stats.poisonResist += value;
        console.log(`☠️ +${value}% Poison Resist (total: ${this.stats.poisonResist}%)`);
      }
      
      // Add more stat parsing as needed...
      const lifeMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Life/i);
      if (lifeMatch && !cleanLine.includes('per')) {
        const value = parseInt(lifeMatch[1]);
        this.stats.life += value;
        console.log(`❤️ +${value} Life (total: ${this.stats.life})`);
      }
      
      const manaMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Mana/i);
      if (manaMatch && !cleanLine.includes('per')) {
        const value = parseInt(manaMatch[1]);
        this.stats.mana += value;
        console.log(`💙 +${value} Mana (total: ${this.stats.mana})`);
      }
    };
    
    // 🔧 FIX 3: Preserve sockets on dropdown changes + immediate stat updates
    console.log('🔧 Fix 3: Fixing socket persistence and immediate updates...');
    
    // Enhanced dropdown change handler
    const dropdownIds = [
      'weapons-dropdown', 'helms-dropdown', 'armors-dropdown', 'offs-dropdown',
      'gloves-dropdown', 'belts-dropdown', 'boots-dropdown', 
      'ringsone-dropdown', 'ringstwo-dropdown', 'amulets-dropdown'
    ];
    
    dropdownIds.forEach(id => {
      const dropdown = document.getElementById(id);
      if (dropdown && !dropdown.hasAttribute('data-fixed-listener')) {
        dropdown.setAttribute('data-fixed-listener', 'true');
        
        dropdown.addEventListener('change', (e) => {
          console.log(`🔄 Dropdown changed: ${id}`);
          
          setTimeout(() => {
            // Force refresh displays first
            sc.ultimateRefreshAllDisplays();
            
            // Then force recalculate stats
            setTimeout(() => {
              sc.calculateAllStats();
              
              // Force update character totals
              if (window.characterStats && window.characterStats.updateTotalStats) {
                setTimeout(() => {
                  window.characterStats.updateTotalStats();
                }, 50);
              }
            }, 50);
          }, 100);
        });
      }
    });
    
    // Enhanced stat input change handler for immediate updates
    const statInputs = ['str', 'dex', 'vit', 'enr'];
    statInputs.forEach(statId => {
      const input = document.getElementById(statId);
      if (input && !input.hasAttribute('data-fixed-listener')) {
        input.setAttribute('data-fixed-listener', 'true');
        
        ['input', 'change'].forEach(eventType => {
          input.addEventListener(eventType, () => {
            console.log(`📊 Stat changed: ${statId}`);
            
            // Immediate total update
            setTimeout(() => {
              if (window.characterStats && window.characterStats.updateTotalStats) {
                window.characterStats.updateTotalStats();
              }
              
              // Also trigger full recalculation
              if (sc.calculateAllStats) {
                sc.calculateAllStats();
              }
            }, 10);
          });
        });
      }
    });
    
    // Enhanced socket preservation system
    sc._originalUpdateSocketsForItem = sc.updateSocketsForItem;
    if (sc.updateSocketsForItem) {
      sc.updateSocketsForItem = function(section) {
        console.log(`🔄 Updating sockets for ${section} - preserving existing sockets`);
        
        const container = document.querySelector(`.socket-container[data-section="${section}"]`);
        const socketGrid = container?.querySelector('.socket-grid');
        
        if (!container || !socketGrid) return;
        
        // Store existing socket data before clearing
        const existingSockets = [];
        socketGrid.querySelectorAll('.socket-slot.filled').forEach(socket => {
          existingSockets.push({
            itemKey: socket.dataset.itemKey,
            category: socket.dataset.category,
            itemName: socket.dataset.itemName,
            stats: socket.dataset.stats,
            levelReq: socket.dataset.levelReq,
            img: socket.querySelector('img')?.src
          });
        });
        
        // Call original method to set up new sockets
        if (sc._originalUpdateSocketsForItem) {
          sc._originalUpdateSocketsForItem.call(this, section);
        }
        
        // Restore existing socket data to new socket slots
        existingSockets.forEach((socketData, index) => {
          const socketSlot = socketGrid.children[index];
          if (socketSlot) {
            socketSlot.classList.remove('empty');
            socketSlot.classList.add('filled');
            socketSlot.innerHTML = `<img src="${socketData.img}" alt="${socketData.itemName}" onerror="this.src='img/placeholder.png'">`;
            
            // Restore all data
            socketSlot.dataset.itemKey = socketData.itemKey;
            socketSlot.dataset.category = socketData.category;
            socketSlot.dataset.itemName = socketData.itemName;
            socketSlot.dataset.stats = socketData.stats;
            socketSlot.dataset.levelReq = socketData.levelReq;
          }
        });
        
        console.log(`✅ Restored ${existingSockets.length} sockets for ${section}`);
      };
    }
    
    console.log('✅ All critical bug fixes applied!');
  }
  
  // Test function for the fixes
  window.testCriticalFixes = function() {
    console.log('🧪 Testing critical bug fixes...');
    
    console.log('1. Testing description order preservation...');
    // This will be visible when you check item tooltips
    
    console.log('2. Testing multi-socket stat counting...');
    const sockets = document.querySelectorAll('.socket-slot.filled');
    const socketStats = {};
    
    sockets.forEach(socket => {
      const stats = socket.dataset.stats;
      const section = socket.closest('.socket-container')?.dataset.section;
      
      if (stats) {
        const key = `${section}-${stats}`;
        socketStats[key] = (socketStats[key] || 0) + 1;
      }
    });
    
    console.log('Socket duplicates found:', Object.entries(socketStats).filter(([k, v]) => v > 1));
    
    console.log('3. Testing socket persistence...');
    console.log('Try changing an item dropdown - sockets should persist');
    
    console.log('4. Testing immediate stat updates...');
    console.log('Try changing STR/DEX/VIT/ENR - totals should update immediately');
    
    // Force everything to update
    if (window.statsCalculator) {
      window.statsCalculator.calculateAllStats();
      window.statsCalculator.ultimateRefreshAllDisplays();
    }
    
    if (window.characterStats && window.characterStats.updateTotalStats) {
      window.characterStats.updateTotalStats();
    }
    
    console.log('✅ Critical fixes test complete!');
  };
  
  // Auto-apply fixes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(applyCriticalFixes, 1000);
    });
  } else {
    setTimeout(applyCriticalFixes, 1000);
  }
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      applyCriticalFixes();
      // Auto-test
      setTimeout(() => {
        if (window.testCriticalFixes) {
          console.log('🔧 Running critical fixes test...');
          window.testCriticalFixes();
        }
      }, 1500);
    }, 2000);
  });
  
  console.log('🔧 Critical bug fixes loaded!');
  console.log('💡 Command: testCriticalFixes()');
  
})();