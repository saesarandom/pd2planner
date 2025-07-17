// 🎯 FINAL SOCKET FIXES - Fixes remaining socket and stat counting issues
// 1. Ensures ALL sockets update properly (first, second, third, etc.)
// 2. Prevents double-counting of base item.properties stats

(function() {
  'use strict';
  
  console.log('🎯 Loading final socket fixes...');
  
  function applyFinalFixes() {
    if (!window.statsCalculator) {
      console.log('⏳ Waiting for statsCalculator...');
      setTimeout(applyFinalFixes, 500);
      return;
    }
    
    const sc = window.statsCalculator;
    
    // 🔧 FIX 1: Completely replace calculateAllStats to ensure clean processing
    console.log('🔧 Fix 1: Replacing calculateAllStats for clean socket processing...');
    
    if (sc.calculateAllStats) {
      sc._originalCalculateAllStats = sc.calculateAllStats;
      
      sc.calculateAllStats = function() {
        if (this.isInitializing) {
          console.log('🚫 Skipping calculation during initialization...');
          return;
        }
        
        console.log('🔄 === FINAL FIXED CALCULATION START ===');
        
        // 1. Complete reset - clear everything
        this.resetAllStats();
        
        // 2. Calculate base character stats (no equipment)
        this.calculateBaseStats();
        
        // 3. Calculate equipment stats (base item properties only)
        this.calculateEquipmentStatsFixed();
        
        // 4. Calculate socket stats (all sockets, no duplication issues)
        this.calculateSocketStatsFixed();
        
        // 5. Update all displays
        this.updateAllStatsDisplays();
        
        // 6. Update character totals
        this.updateCharacterAttributeTotals();
        
        console.log('✅ === FINAL FIXED CALCULATION COMPLETE ===');
        console.log('Final stats:', {
          strength: this.stats.strength,
          dexterity: this.stats.dexterity,
          vitality: this.stats.vitality,
          energy: this.stats.energy,
          fireResist: this.stats.fireResist
        });
      };
    }
    
    // 🔧 FIX 2: Fixed equipment stats calculation (no double-counting)
    sc.calculateEquipmentStatsFixed = function() {
      console.log('🔧 === FIXED EQUIPMENT STATS (no double-counting) ===');
      
      const equipmentIds = {
        'weapon': 'weapons-dropdown',
        'helm': 'helms-dropdown',
        'armor': 'armors-dropdown',
        'shield': 'offs-dropdown',
        'gloves': 'gloves-dropdown',
        'belts': 'belts-dropdown',
        'boots': 'boots-dropdown',
        'ringone': 'ringsone-dropdown',
        'ringtwo': 'ringstwo-dropdown',
        'amulet': 'amulets-dropdown'
      };
      
      const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
      
      Object.entries(equipmentIds).forEach(([section, dropdownId]) => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown || !dropdown.value) return;
        
        const item = itemList[dropdown.value];
        if (!item) return;
        
        // Calculate actual required level (including sockets)
        const actualRequiredLevel = this.calculateActualRequiredLevel(section, dropdown.value);
        const meetsRequirement = currentLevel >= actualRequiredLevel;
        
        if (!meetsRequirement) {
          console.log(`❌ ${section}: Level ${currentLevel}/${actualRequiredLevel} - BLOCKED`);
          return;
        }
        
        console.log(`✅ ${section}: Level requirement met - processing base item stats`);
        
        // Process ONLY base item properties (not description stats)
        if (item.properties) {
          if (item.properties.str) {
            this.stats.strength += item.properties.str;
            console.log(`💪 Base item +${item.properties.str} Strength`);
          }
          if (item.properties.dex) {
            this.stats.dexterity += item.properties.dex;
            console.log(`🏹 Base item +${item.properties.dex} Dexterity`);
          }
          if (item.properties.vit) {
            this.stats.vitality += item.properties.vit;
            console.log(`❤️ Base item +${item.properties.vit} Vitality`);
          }
          if (item.properties.enr) {
            this.stats.energy += item.properties.enr;
            console.log(`⚡ Base item +${item.properties.enr} Energy`);
          }
          
          // Other base properties
          if (item.properties.enhanceddmg) {
            this.stats.enhancedDamage += item.properties.enhanceddmg;
          }
          if (item.properties.ias) {
            this.stats.ias += item.properties.ias;
          }
          // Add other properties as needed...
        }
        
        // Process description stats ONLY if they don't duplicate properties
        if (item.description) {
          this.parseDescriptionStatsFixed(item.description, item.properties || {});
        }
      });
      
      console.log('🔧 === EQUIPMENT STATS COMPLETE ===');
    };
    
    // Parse description stats while avoiding duplication with properties
    sc.parseDescriptionStatsFixed = function(description, properties) {
      const lines = description.split('<br>');
      
      lines.forEach(line => {
        const cleanLine = line.replace(/<[^>]*>/g, '').trim();
        if (!cleanLine) return;
        
        // Skip attribute lines if they're already in properties
        if (cleanLine.includes('to Strength') && properties.str) return;
        if (cleanLine.includes('to Dexterity') && properties.dex) return;
        if (cleanLine.includes('to Vitality') && properties.vit) return;
        if (cleanLine.includes('to Energy') && properties.enr) return;
        
        // Process other stats that aren't in properties
        if (cleanLine.includes('Enhanced Damage') && !properties.enhanceddmg) {
          const match = cleanLine.match(/(\d+)%\s*Enhanced Damage/i);
          if (match) {
            this.stats.enhancedDamage += parseInt(match[1]);
          }
        }
        
        if (cleanLine.includes('Increased Attack Speed') && !properties.ias) {
          const match = cleanLine.match(/(\d+)%\s*Increased Attack Speed/i);
          if (match) {
            this.stats.ias += parseInt(match[1]);
          }
        }
        
        // Add other non-attribute stats...
      });
    };
    
    // 🔧 FIX 3: Completely new socket stats calculation (no duplication blocking)
    sc.calculateSocketStatsFixed = function() {
      console.log('💎 === FIXED SOCKET STATS (all sockets counted) ===');
      
      const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
      const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
      
      let totalSocketsProcessed = 0;
      
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
          console.log(`❌ Skipping all ${section} sockets - section level ${actualRequiredLevel} not met`);
          return;
        }
        
        console.log(`✅ Processing ${sockets.length} sockets in ${section}:`);
        
        // Process EVERY socket individually - no deduplication!
        sockets.forEach((socket, index) => {
          const stats = socket.dataset.stats;
          const socketLevelReq = parseInt(socket.dataset.levelReq) || 1;
          const itemName = socket.dataset.itemName || 'Unknown';
          
          if (!stats) return;
          
          if (currentLevel >= socketLevelReq) {
            totalSocketsProcessed++;
            console.log(`  ${index + 1}. ${itemName}: "${stats}"`);
            this.parseIndividualSocketStat(stats, itemName, totalSocketsProcessed);
          } else {
            console.log(`  ${index + 1}. ${itemName}: BLOCKED (need level ${socketLevelReq})`);
          }
        });
      });
      
      console.log(`💎 === SOCKET STATS COMPLETE - Processed ${totalSocketsProcessed} individual sockets ===`);
    };
    
    // Parse individual socket stats without any blocking
    sc.parseIndividualSocketStat = function(statLine, itemName, socketNumber) {
      const cleanLine = statLine.replace(/<[^>]*>/g, '').trim();
      
      console.log(`    Socket ${socketNumber}: Parsing "${cleanLine}"`);
      
      // Strength
      const strMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Strength/i);
      if (strMatch) {
        const value = parseInt(strMatch[1]);
        this.stats.strength += value;
        console.log(`      💪 +${value} Strength (total now: ${this.stats.strength})`);
      }
      
      // Dexterity
      const dexMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Dexterity/i);
      if (dexMatch) {
        const value = parseInt(dexMatch[1]);
        this.stats.dexterity += value;
        console.log(`      🏹 +${value} Dexterity (total now: ${this.stats.dexterity})`);
      }
      
      // Vitality
      const vitMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Vitality/i);
      if (vitMatch) {
        const value = parseInt(vitMatch[1]);
        this.stats.vitality += value;
        console.log(`      ❤️ +${value} Vitality (total now: ${this.stats.vitality})`);
      }
      
      // Energy
      const enrMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Energy/i);
      if (enrMatch) {
        const value = parseInt(enrMatch[1]);
        this.stats.energy += value;
        console.log(`      ⚡ +${value} Energy (total now: ${this.stats.energy})`);
      }
      
      // Enhanced Damage
      const edmMatch = cleanLine.match(/(\d+)%\s*Enhanced Damage/i);
      if (edmMatch) {
        const value = parseInt(edmMatch[1]);
        this.stats.enhancedDamage += value;
        console.log(`      💥 +${value}% Enhanced Damage (total now: ${this.stats.enhancedDamage}%)`);
      }
      
      // Increased Attack Speed
      const iasMatch = cleanLine.match(/(\d+)%\s*Increased Attack Speed/i);
      if (iasMatch) {
        const value = parseInt(iasMatch[1]);
        this.stats.ias += value;
        console.log(`      ⚡ +${value}% IAS (total now: ${this.stats.ias}%)`);
      }
      
      // Fire Resist
      const fireResMatch = cleanLine.match(/Fire Resist \+(\d+)%?/i);
      if (fireResMatch) {
        const value = parseInt(fireResMatch[1]);
        this.stats.fireResist += value;
        console.log(`      🔥 +${value}% Fire Resist (total now: ${this.stats.fireResist}%)`);
      }
      
      // Cold Resist
      const coldResMatch = cleanLine.match(/Cold Resist \+(\d+)%?/i);
      if (coldResMatch) {
        const value = parseInt(coldResMatch[1]);
        this.stats.coldResist += value;
        console.log(`      ❄️ +${value}% Cold Resist (total now: ${this.stats.coldResist}%)`);
      }
      
      // Lightning Resist
      const lightResMatch = cleanLine.match(/Lightning Resist \+(\d+)%?/i);
      if (lightResMatch) {
        const value = parseInt(lightResMatch[1]);
        this.stats.lightningResist += value;
        console.log(`      ⚡ +${value}% Lightning Resist (total now: ${this.stats.lightningResist}%)`);
      }
      
      // Poison Resist
      const poisonResMatch = cleanLine.match(/Poison Resist \+(\d+)%?/i);
      if (poisonResMatch) {
        const value = parseInt(poisonResMatch[1]);
        this.stats.poisonResist += value;
        console.log(`      ☠️ +${value}% Poison Resist (total now: ${this.stats.poisonResist}%)`);
      }
      
      // Life
      const lifeMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Life/i);
      if (lifeMatch && !cleanLine.includes('per')) {
        const value = parseInt(lifeMatch[1]);
        this.stats.life += value;
        console.log(`      ❤️ +${value} Life (total now: ${this.stats.life})`);
      }
      
      // Mana
      const manaMatch = cleanLine.match(/\+(\d+)\s*(?:to\s+)?Mana/i);
      if (manaMatch && !cleanLine.includes('per')) {
        const value = parseInt(manaMatch[1]);
        this.stats.mana += value;
        console.log(`      💙 +${value} Mana (total now: ${this.stats.mana})`);
      }
      
      // Add more stats as needed...
    };
    
    // 🔧 FIX 4: Enhanced socket change detection
    console.log('🔧 Fix 4: Enhanced socket change detection...');
    
    // Override socketItem to trigger immediate updates
    if (sc.socketItem) {
      sc._originalSocketItem = sc.socketItem;
      
      sc.socketItem = function(itemKey, category) {
        console.log(`🔌 Socketing ${itemKey} (${category})`);
        
        // Call original method
        const result = sc._originalSocketItem.call(this, itemKey, category);
        
        // Force immediate complete recalculation
        setTimeout(() => {
          console.log('🔄 Triggering immediate recalculation after socketing...');
          this.calculateAllStats();
          
          // Also update character totals
          if (window.characterStats && window.characterStats.updateTotalStats) {
            window.characterStats.updateTotalStats();
          }
        }, 100);
        
        return result;
      };
    }
    
    console.log('✅ All final fixes applied!');
  }
  
  // Test function for final fixes
  window.testFinalFixes = function() {
    console.log('🧪 Testing final socket fixes...');
    
    console.log('1. Testing multiple socket counting...');
    const allSockets = document.querySelectorAll('.socket-slot.filled');
    console.log(`Found ${allSockets.length} total sockets`);
    
    // Count by stat type
    const statCounts = {};
    allSockets.forEach(socket => {
      const stats = socket.dataset.stats;
      if (stats) {
        const clean = stats.replace(/<[^>]*>/g, '').trim();
        if (clean.includes('to Strength')) statCounts.STR = (statCounts.STR || 0) + 1;
        if (clean.includes('to Dexterity')) statCounts.DEX = (statCounts.DEX || 0) + 1;
        if (clean.includes('Fire Resist')) statCounts.FireRes = (statCounts.FireRes || 0) + 1;
        if (clean.includes('Enhanced Damage')) statCounts.ED = (statCounts.ED || 0) + 1;
      }
    });
    console.log('Socket counts by stat:', statCounts);
    
    console.log('2. Testing base item double-counting...');
    // This will be visible in the calculation logs
    
    console.log('3. Force triggering complete recalculation...');
    if (window.statsCalculator) {
      window.statsCalculator.calculateAllStats();
    }
    
    if (window.characterStats && window.characterStats.updateTotalStats) {
      window.characterStats.updateTotalStats();
    }
    
    console.log('✅ Final fixes test complete!');
    console.log('💡 Try socketing multiple Fal runes - each should add +10 STR');
    console.log('💡 Check green totals - should show correct base item bonuses');
  };
  
  // Auto-apply
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(applyFinalFixes, 1200);
    });
  } else {
    setTimeout(applyFinalFixes, 1200);
  }
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      applyFinalFixes();
      setTimeout(() => {
        if (window.testFinalFixes) {
          console.log('🎯 Running final fixes test...');
          window.testFinalFixes();
        }
      }, 2000);
    }, 2500);
  });
  
  console.log('🎯 Final socket fixes loaded!');
  console.log('💡 Command: testFinalFixes()');
  
})();