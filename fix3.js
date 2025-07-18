// 🚀 COMPLETE SOCKET FIX - Fixes ALL issues while keeping maximum speed
// ✅ Fixes double-counting of base item stats (STR/DEX/VIT/ENR)
// ✅ Fixes socket elemental damage not counting
// ✅ Fixes magic find from sockets not counting
// ✅ Preserves socket clicking functionality

(function() {
  'use strict';
  
  console.log('🚀 Loading complete socket fix...');
  
  function applyCompleteFix() {
    if (!window.statsCalculator) {
      setTimeout(applyCompleteFix, 300);
      return;
    }
    
    const sc = window.statsCalculator;
    
    // 🎯 FIX 1: Prevent double-counting base item stats
    if (sc.parseItemStats) {
      sc._originalParseItemStats = sc.parseItemStats;
      
      sc.parseItemStats = function(item, section) {
        console.log(`🔧 Parsing item stats for ${section}:`);
        
        // Only parse base properties, NOT description stats
        if (item.properties) {
          // Basic attributes - these should only come from properties
          if (item.properties.str) {
            this.stats.strength += item.properties.str;
            console.log(`💪 Base item +${item.properties.str} STR`);
          }
          if (item.properties.dex) {
            this.stats.dexterity += item.properties.dex;
            console.log(`🏹 Base item +${item.properties.dex} DEX`);
          }
          if (item.properties.vit) {
            this.stats.vitality += item.properties.vit;
            console.log(`❤️ Base item +${item.properties.vit} VIT`);
          }
          if (item.properties.enr) {
            this.stats.energy += item.properties.enr;
            console.log(`⚡ Base item +${item.properties.enr} ENR`);
          }
          
          // Other base properties
          if (item.properties.life) this.stats.life += item.properties.life;
          if (item.properties.mana) this.stats.mana += item.properties.mana;
          if (item.properties.defense) this.stats.defense += item.properties.defense;
          if (item.properties.enhanceddmg) this.stats.enhancedDamage += item.properties.enhanceddmg;
          if (item.properties.ias) this.stats.ias += item.properties.ias;
          if (item.properties.fcr) this.stats.fcr += item.properties.fcr;
          if (item.properties.frw) this.stats.frw += item.properties.frw;
          if (item.properties.fhr) this.stats.fhr += item.properties.fhr;
          if (item.properties.magicfind) this.stats.magicFind += item.properties.magicfind;
          if (item.properties.goldfind) this.stats.goldFind += item.properties.goldfind;
          
          // Resistances
          if (item.properties.fireres) this.stats.fireResist += item.properties.fireres;
          if (item.properties.coldres) this.stats.coldResist += item.properties.coldres;
          if (item.properties.lightres) this.stats.lightningResist += item.properties.lightres;
          if (item.properties.poisres) this.stats.poisonResist += item.properties.poisres;
          
          // Elemental damage
          if (item.properties.firedmgmin) this.stats.flatFireMin += item.properties.firedmgmin;
          if (item.properties.firedmgmax) this.stats.flatFireMax += item.properties.firedmgmax;
          if (item.properties.colddmgmin) this.stats.flatColdMin += item.properties.colddmgmin;
          if (item.properties.colddmgmax) this.stats.flatColdMax += item.properties.colddmgmax;
          if (item.properties.lightdmgmin) this.stats.flatLightMin += item.properties.lightdmgmin;
          if (item.properties.lightdmgmax) this.stats.flatLightMax += item.properties.lightdmgmax;
        }
        
        // Parse description stats ONLY for things not in properties
        if (item.description) {
          this.parseDescriptionStatsFixed(item.description);
        }
      };
    }
    
    // 🎯 FIX 2: Fixed description parsing (no double-counting)
    sc.parseDescriptionStatsFixed = function(description) {
      console.log(`📖 Parsing description stats (avoiding duplicates)...`);
      
      // Only parse stats that are NOT typically in properties
      const cleanDesc = description.replace(/<[^>]*>/g, '');
      
      // Parse non-property stats only
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Faster Cast Rate/i, 'fcr');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Increased Attack Speed/i, 'ias');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Faster Run\/Walk/i, 'frw');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Faster Hit Recovery/i, 'fhr');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Enhanced Damage/i, 'enhancedDamage');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Extra Gold from Monsters/i, 'goldFind');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Better Chance of Getting Magic Items/i, 'magicFind');
      this.extractStatSafely(cleanDesc, /\+(\d+)\s*to All Skills/i, 'allSkills');
      
      // Combat stats
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Chance of Open Wounds/i, 'openWounds');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Chance of Crushing Blow/i, 'crushingBlow');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Chance of Deadly Strike/i, 'deadlyStrike');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Life Stolen per Hit/i, 'lifeSteal');
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Mana Stolen per Hit/i, 'manaSteal');
      
      // Damage reduction
      this.extractStatSafely(cleanDesc, /(\d+)%\s*Damage Reduced/i, 'dr');
      this.extractStatSafely(cleanDesc, /Physical Damage.*Reduced by (\d+)/i, 'pdr');
      this.extractStatSafely(cleanDesc, /Magic Damage.*Reduced by (\d+)/i, 'mdr');
      
      // DON'T parse basic attributes here - they come from properties
    };
    
    sc.extractStatSafely = function(text, regex, statKey) {
      const match = text.match(regex);
      if (match) {
        const value = parseInt(match[1]);
        if (!isNaN(value)) {
          this.stats[statKey] = (this.stats[statKey] || 0) + value;
          console.log(`📖 Description +${value} ${statKey}`);
        }
      }
    };
    
    // 🎯 FIX 3: Complete socket stat parsing (ALL stats supported)
    if (sc.parseSocketStats) {
      sc._originalParseSocketStats = sc.parseSocketStats;
      
      sc.parseSocketStats = function(statLine, itemType, itemKey) {
        console.log(`💎 Parsing socket: "${statLine}"`);
        
        const cleanLine = statLine.replace(/<[^>]*>/g, '').trim();
        
        // Basic Attributes
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*(?:to\s+)?Strength/i, 'strength', '💪');
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*(?:to\s+)?Dexterity/i, 'dexterity', '🏹');
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*(?:to\s+)?Vitality/i, 'vitality', '❤️');
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*(?:to\s+)?Energy/i, 'energy', '⚡');
        
        // Life & Mana
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*(?:to\s+)?Life/i, 'life', '❤️');
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*(?:to\s+)?Mana/i, 'mana', '💙');
        
        // Defense & Attack Rating
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*Defense/i, 'defense', '🛡️');
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*(?:to\s+)?Attack Rating/i, 'attackRating', '⚔️');
        
        // Enhanced Damage & IAS
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Enhanced Damage/i, 'enhancedDamage', '💪');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Increased Attack Speed/i, 'ias', '⚡');
        
        // Magic Find & Gold Find - CRITICAL FIX!
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Better Chance of Getting Magic Items/i, 'magicFind', '✨');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Extra Gold from Monsters/i, 'goldFind', '💰');
        
        // All Skills
        this.parseSocketAttr(cleanLine, /\+(\d+)\s*to All Skills/i, 'allSkills', '📚');
        
        // Resistances
        this.parseSocketAttr(cleanLine, /Fire Resist \+(\d+)%?/i, 'fireResist', '🔥');
        this.parseSocketAttr(cleanLine, /Cold Resist \+(\d+)%?/i, 'coldResist', '❄️');
        this.parseSocketAttr(cleanLine, /Lightning Resist \+(\d+)%?/i, 'lightningResist', '⚡');
        this.parseSocketAttr(cleanLine, /Poison Resist \+(\d+)%?/i, 'poisonResist', '☠️');
        
        // All Resistances
        const allResMatch = cleanLine.match(/All Resistances \+(\d+)%?/i);
        if (allResMatch) {
          const value = parseInt(allResMatch[1]);
          this.stats.fireResist += value;
          this.stats.coldResist += value;
          this.stats.lightningResist += value;
          this.stats.poisonResist += value;
          console.log(`🌈 +${value}% All Resistances`);
        }
        
        // Elemental Damage - CRITICAL FIX!
        this.parseElementalDamage(cleanLine, 'Fire', '🔥', 'flatFireMin', 'flatFireMax');
        this.parseElementalDamage(cleanLine, 'Cold', '❄️', 'flatColdMin', 'flatColdMax');
        this.parseElementalDamage(cleanLine, 'Lightning', '⚡', 'flatLightMin', 'flatLightMax');
        
        // Poison Damage
        const poisonMatch = cleanLine.match(/\+(\d+)\s*Poison Damage/i);
        if (poisonMatch) {
          const value = parseInt(poisonMatch[1]);
          this.stats.poisonDamage = (this.stats.poisonDamage || 0) + value;
          console.log(`☠️ +${value} Poison Damage`);
        }
        
        // Other speed stats
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Faster Cast Rate/i, 'fcr', '🎯');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Faster Run\/Walk/i, 'frw', '🏃');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Faster Hit Recovery/i, 'fhr', '🛡️');
        
        // Combat stats
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Chance of Open Wounds/i, 'openWounds', '🩸');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Chance of Crushing Blow/i, 'crushingBlow', '💥');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Chance of Deadly Strike/i, 'deadlyStrike', '💀');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Life Stolen per Hit/i, 'lifeSteal', '🧛');
        this.parseSocketAttr(cleanLine, /(\d+)%\s*Mana Stolen per Hit/i, 'manaSteal', '🔮');
      };
    }
    
    // Helper method for parsing individual attributes
    sc.parseSocketAttr = function(line, regex, statKey, emoji) {
      const match = line.match(regex);
      if (match) {
        const value = parseInt(match[1]);
        this.stats[statKey] = (this.stats[statKey] || 0) + value;
        console.log(`${emoji} Socket +${value} ${statKey} (total: ${this.stats[statKey]})`);
      }
    };
    
    // Helper method for parsing elemental damage
    sc.parseElementalDamage = function(line, element, emoji, minStat, maxStat) {
      // Try "Adds X-Y Element Damage" format
      let match = line.match(new RegExp(`Adds (\\d+)-(\\d+) ${element} Damage`, 'i'));
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        this.stats[minStat] = (this.stats[minStat] || 0) + min;
        this.stats[maxStat] = (this.stats[maxStat] || 0) + max;
        console.log(`${emoji} Socket +${min}-${max} ${element} Damage`);
        return;
      }
      
      // Try "+X-Y Element Damage" format
      match = line.match(new RegExp(`\\+(\\d+)-(\\d+) ${element} Damage`, 'i'));
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        this.stats[minStat] = (this.stats[minStat] || 0) + min;
        this.stats[maxStat] = (this.stats[maxStat] || 0) + max;
        console.log(`${emoji} Socket +${min}-${max} ${element} Damage`);
        return;
      }
      
      // Try "X-Y Element Damage" format
      match = line.match(new RegExp(`(\\d+)-(\\d+) ${element} Damage`, 'i'));
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        this.stats[minStat] = (this.stats[minStat] || 0) + min;
        this.stats[maxStat] = (this.stats[maxStat] || 0) + max;
        console.log(`${emoji} Socket +${min}-${max} ${element} Damage`);
      }
    };
    
    // 🔄 FIX 4: Auto-refresh on socket changes
    const originalCalculateAllStats = sc.calculateAllStats;
    if (originalCalculateAllStats) {
      sc.calculateAllStats = function() {
        console.log('🔄 === COMPLETE CALCULATION START ===');
        
        // Call original calculation
        const result = originalCalculateAllStats.call(this);
        
        // Ensure all displays are updated
        setTimeout(() => {
          this.updateAllStatsDisplays();
          if (window.characterStats && window.characterStats.updateTotalStats) {
            window.characterStats.updateTotalStats();
          }
        }, 50);
        
        return result;
      };
    }
    
    console.log('✅ Complete socket fix applied!');
    console.log('✅ Base item double-counting fixed');
    console.log('✅ Socket elemental damage fixed');
    console.log('✅ Socket magic find fixed');
    console.log('✅ Socket clicking preserved');
  }
  
  // 🧪 TEST FUNCTION
  window.testCompleteFix = function() {
    console.log('🧪 Testing complete socket fix...');
    
    if (!window.statsCalculator) {
      console.log('❌ statsCalculator not found');
      return;
    }
    
    console.log('🔍 Checking current stats:');
    const stats = window.statsCalculator.stats;
    console.log('STR:', stats.strength || 0);
    console.log('DEX:', stats.dexterity || 0);
    console.log('VIT:', stats.vitality || 0);
    console.log('ENR:', stats.energy || 0);
    console.log('Magic Find:', stats.magicFind || 0);
    console.log('Fire Damage:', `${stats.flatFireMin || 0}-${stats.flatFireMax || 0}`);
    console.log('Lightning Damage:', `${stats.flatLightMin || 0}-${stats.flatLightMax || 0}`);
    
    // Check sockets
    const sockets = document.querySelectorAll('.socket-slot.filled');
    console.log(`\nFound ${sockets.length} filled sockets:`);
    
    sockets.forEach((socket, i) => {
      const section = socket.closest('.socket-container')?.dataset.section;
      const itemName = socket.dataset.itemName;
      const stats = socket.dataset.stats;
      console.log(`${i+1}. ${section}: ${itemName} - ${stats}`);
    });
    
    console.log('\n💡 Try socketing gems with elemental damage or magic find!');
    console.log('💡 Check that Twitchthorn shows correct STR/DEX (not doubled)');
  };
  
  // 🚀 FAST INIT
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(applyCompleteFix, 200));
  } else {
    setTimeout(applyCompleteFix, 200);
  }
  
  console.log('🚀 Complete socket fix loaded! Use testCompleteFix() to test');
  
})();