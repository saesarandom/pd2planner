// 🎯 FIX INITIAL DOUBLING + MISSING STATS
// ✅ Fix base stats being doubled on page load
// ✅ Ensure all stats show in right-side calculator
// ✅ Proper initialization without conflicts

(function() {
  'use strict';
  
  console.log('🎯 Loading Initial Doubling + Missing Stats Fix...');
  
  function applyInitialFix() {
    if (!window.statsCalculator) {
      setTimeout(applyInitialFix, 200);
      return;
    }
    
    const sc = window.statsCalculator;
    console.log('🔧 Fixing initial doubling and missing stats...');
    
    // 🎯 FIX 1: Override resetAllStats to ensure clean start
    if (sc.resetAllStats) {
      sc.resetAllStats = function() {
        console.log('🧹 FIXED: resetAllStats - ensuring clean zero start...');
        
        // Reset ALL stats to exactly zero or false
        this.stats = {
          strength: 0, dexterity: 0, vitality: 0, energy: 0,
          life: 0, mana: 0, defense: 0, attackRating: 0, enhancedDamage: 0,
          magicFind: 0, goldFind: 0, ias: 0, fcr: 0, frw: 0, fhr: 0,
          fireResist: 0, coldResist: 0, lightResist: 0, poisonResist: 0,
          flatFireMin: 0, flatFireMax: 0, flatColdMin: 0, flatColdMax: 0,
          flatLightMin: 0, flatLightMax: 0, flatPoisonMin: 0, flatPoisonMax: 0,
          flatMagicMin: 0, flatMagicMax: 0,
          crushingBlow: 0, deadlyStrike: 0, openWounds: 0, criticalHit: 0,
          lifeSteal: 0, manaSteal: 0, allSkills: 0, blockChance: 0,
          dr: 0, pdr: 0, mdr: 0, plr: 0, cbf: false, critHitMultiplier: 2.0
        };
        
        console.log('🧹 FIXED: All stats reset to zero - no doubling possible');
      };
    }
    
    // 🎯 FIX 2: Enhanced calculateAllStats with complete stat handling
    sc.calculateAllStats = function() {
      if (this._isCalculating) {
        console.log('🚫 Already calculating, skipping...');
        return;
      }
      
      this._isCalculating = true;
      console.log('🔄 FIXED: Starting complete calculation cycle...');
      
      try {
        // Step 1: Complete reset
        this.resetAllStats();
        
        // Step 2: Set ONLY base character stats from input fields
        const baseStr = parseInt(document.getElementById('str')?.value) || 0;
        const baseDex = parseInt(document.getElementById('dex')?.value) || 0;
        const baseVit = parseInt(document.getElementById('vit')?.value) || 0;
        const baseEnr = parseInt(document.getElementById('enr')?.value) || 0;
        
        this.stats.strength = baseStr;
        this.stats.dexterity = baseDex;
        this.stats.vitality = baseVit;
        this.stats.energy = baseEnr;
        
        console.log(`📊 FIXED: PURE base stats - STR:${baseStr}, DEX:${baseDex}, VIT:${baseVit}, ENR:${baseEnr}`);
        
        // Step 3: Add ALL item stats from character.js
        if (window.characterStats && window.characterStats.calculateAllItemStats) {
          const itemStats = window.characterStats.calculateAllItemStats();
          
          // Add item attributes
          this.stats.strength += itemStats.strength || 0;
          this.stats.dexterity += itemStats.dexterity || 0;
          this.stats.vitality += itemStats.vitality || 0;
          this.stats.energy += itemStats.energy || 0;
          
          // Add ALL other item stats (this was missing!)
          this.stats.life += itemStats.life || 0;
          this.stats.mana += itemStats.mana || 0;
          this.stats.defense += itemStats.defense || 0;
          this.stats.attackRating += itemStats.attackRating || 0;
          this.stats.enhancedDamage += itemStats.enhancedDamage || 0;
          this.stats.magicFind += itemStats.magicFind || 0;
          this.stats.goldFind += itemStats.goldFind || 0;
          
          // 🎯 CRITICAL: Add speed stats (these were missing!)
          this.stats.ias += itemStats.ias || 0;
          this.stats.fcr += itemStats.fcr || 0;
          this.stats.frw += itemStats.frw || 0;
          this.stats.fhr += itemStats.fhr || 0;
          
          // Add resistances
          this.stats.fireResist += itemStats.fireResist || 0;
          this.stats.coldResist += itemStats.coldResist || 0;
          this.stats.lightResist += itemStats.lightResist || 0;
          this.stats.poisonResist += itemStats.poisonResist || 0;
          
          // Add elemental damage
          this.stats.flatFireMin += itemStats.flatFireMin || 0;
          this.stats.flatFireMax += itemStats.flatFireMax || 0;
          this.stats.flatColdMin += itemStats.flatColdMin || 0;
          this.stats.flatColdMax += itemStats.flatColdMax || 0;
          this.stats.flatLightMin += itemStats.flatLightMin || 0;
          this.stats.flatLightMax += itemStats.flatLightMax || 0;
          
          // Add combat stats
          this.stats.crushingBlow += itemStats.crushingBlow || 0;
          this.stats.deadlyStrike += itemStats.deadlyStrike || 0;
          this.stats.openWounds += itemStats.openWounds || 0;
          this.stats.lifeSteal += itemStats.lifeSteal || 0;
          this.stats.manaSteal += itemStats.manaSteal || 0;
          
          // Add other stats
          this.stats.allSkills += itemStats.allSkills || 0;
          this.stats.blockChance += itemStats.blockChance || 0;
          this.stats.dr += itemStats.dr || 0;
          this.stats.pdr += itemStats.pdr || 0;
          this.stats.mdr += itemStats.mdr || 0;
          
          if (itemStats.cbf) this.stats.cbf = true;
          
          console.log(`📦 FIXED: ALL item stats added - STR:${this.stats.strength}, IAS:${this.stats.ias}%, FRW:${this.stats.frw}%`);
        }
        
        // Step 4: Calculate life/mana/defense from total attributes
        const classSelect = document.getElementById('selectClass')?.value || 'Amazon';
        const classMultipliers = {
          'Amazon': { life: 2, mana: 1.5 },
          'Barbarian': { life: 4, mana: 1 },
          'Necromancer': { life: 1.5, mana: 2 },
          'Paladin': { life: 3, mana: 1.5 },
          'Sorceress': { life: 1, mana: 2 },
          'Druid': { life: 2, mana: 2 },
          'Assassin': { life: 2, mana: 1.75 }
        };
        
        const multiplier = classMultipliers[classSelect] || classMultipliers['Amazon'];
        
        // Calculate derived stats from total attributes
        const derivedLife = Math.floor(this.stats.vitality * multiplier.life) + 45;
        const derivedMana = Math.floor(this.stats.energy * multiplier.mana) + 15;
        const derivedDefense = Math.floor(this.stats.dexterity / 4);
        
        // Set life/mana/defense (base calculation + item bonuses)
        this.stats.life = derivedLife + (this.stats.life || 0);
        this.stats.mana = derivedMana + (this.stats.mana || 0);
        this.stats.defense = derivedDefense + (this.stats.defense || 0);
        
        console.log(`📊 FIXED: Derived stats - Life:${this.stats.life}, Mana:${this.stats.mana}, Defense:${this.stats.defense}`);
        
        // Step 5: Add socket bonuses
        const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
        const sections = ['weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet'];
        
        sections.forEach(section => {
          const container = document.querySelector(`.socket-container[data-section="${section}"]`);
          const sockets = container?.querySelectorAll('.socket-slot.filled') || [];
          
          sockets.forEach(socket => {
            const stats = socket.dataset.stats;
            const socketLevelReq = parseInt(socket.dataset.levelReq) || 1;
            
            if (stats && currentLevel >= socketLevelReq) {
              const cleanStats = stats.replace(/<[^>]*>/g, '').trim();
              
              // Parse ALL socket stats
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*(?:to\s+)?Strength/i, 'strength');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*(?:to\s+)?Dexterity/i, 'dexterity');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*(?:to\s+)?Vitality/i, 'vitality');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*(?:to\s+)?Energy/i, 'energy');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*(?:to\s+)?Life/i, 'life');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*(?:to\s+)?Mana/i, 'mana');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*Defense/i, 'defense');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*(?:to\s+)?Attack Rating/i, 'attackRating');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Enhanced Damage/i, 'enhancedDamage');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Better Chance of Getting Magic Items/i, 'magicFind');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Extra Gold from Monsters/i, 'goldFind');
              
              // 🎯 CRITICAL: Socket speed stats (these were working in sockets!)
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Increased Attack Speed/i, 'ias');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Faster Cast Rate/i, 'fcr');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Faster Run\/Walk/i, 'frw');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Faster Hit Recovery/i, 'fhr');
              
              // Socket resistances
              this.addSocketStatSafe(cleanStats, /Fire Resist \+(\d+)%?/i, 'fireResist');
              this.addSocketStatSafe(cleanStats, /Cold Resist \+(\d+)%?/i, 'coldResist');
              this.addSocketStatSafe(cleanStats, /Lightning Resist \+(\d+)%?/i, 'lightResist');
              this.addSocketStatSafe(cleanStats, /Poison Resist \+(\d+)%?/i, 'poisonResist');
              
              // All Resistances
              const allResMatch = cleanStats.match(/All Resistances \+(\d+)%?/i);
              if (allResMatch) {
                const value = parseInt(allResMatch[1]);
                this.stats.fireResist += value;
                this.stats.coldResist += value;
                this.stats.lightResist += value;
                this.stats.poisonResist += value;
              }
              
              // Socket combat stats
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Chance of Crushing Blow/i, 'crushingBlow');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Chance of Deadly Strike/i, 'deadlyStrike');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Chance of Open Wounds/i, 'openWounds');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Life Stolen per Hit/i, 'lifeSteal');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Mana Stolen per Hit/i, 'manaSteal');
              this.addSocketStatSafe(cleanStats, /\+(\d+)\s*to All Skills/i, 'allSkills');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Increased Chance of Blocking/i, 'blockChance');
              this.addSocketStatSafe(cleanStats, /(\d+)%\s*Damage Reduced/i, 'dr');
              this.addSocketStatSafe(cleanStats, /Physical Damage.*Reduced by (\d+)/i, 'pdr');
              this.addSocketStatSafe(cleanStats, /Magic Damage.*Reduced by (\d+)/i, 'mdr');
              
              // Socket elemental damage
              this.addSocketElementalDamageSafe(cleanStats, 'Fire', 'flatFireMin', 'flatFireMax');
              this.addSocketElementalDamageSafe(cleanStats, 'Cold', 'flatColdMin', 'flatColdMax');
              this.addSocketElementalDamageSafe(cleanStats, 'Lightning', 'flatLightMin', 'flatLightMax');
            }
          });
        });
        
        console.log(`💎 FIXED: Socket stats added - Final STR:${this.stats.strength}, IAS:${this.stats.ias}%, FRW:${this.stats.frw}%`);
        
        // Step 6: Force update ALL displays
        this.updateAllStatsDisplays();
        
        console.log('✅ FIXED: Complete calculation with ALL stats displayed');
        
      } catch (error) {
        console.error('❌ FIXED: Calculation error:', error);
      } finally {
        this._isCalculating = false;
      }
    };
    
    // 🎯 FIX 3: Ensure safe helper methods exist
    if (!sc.addSocketStatSafe) {
      sc.addSocketStatSafe = function(line, regex, statKey) {
        const match = line.match(regex);
        if (match) {
          const value = parseInt(match[1]);
          this.stats[statKey] = (this.stats[statKey] || 0) + value;
        }
      };
    }
    
    if (!sc.addSocketElementalDamageSafe) {
      sc.addSocketElementalDamageSafe = function(line, element, minStat, maxStat) {
        const patterns = [
          new RegExp(`Adds (\\d+)-(\\d+) ${element} Damage`, 'i'),
          new RegExp(`\\+(\\d+)-(\\d+) ${element} Damage`, 'i'),
          new RegExp(`(\\d+)-(\\d+) ${element} Damage`, 'i')
        ];
        
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            const min = parseInt(match[1]);
            const max = parseInt(match[2]);
            this.stats[minStat] = (this.stats[minStat] || 0) + min;
            this.stats[maxStat] = (this.stats[maxStat] || 0) + max;
            return;
          }
        }
      };
    }
    
    // 🎯 FIX 4: Prevent any other systems from interfering on load
    if (window.characterStats) {
      // Ensure character.js doesn't trigger extra calculations
      if (window.characterStats.updateTotalStats) {
        window.characterStats._safeUpdateTotalStats = window.characterStats.updateTotalStats;
        
        window.characterStats.updateTotalStats = function() {
          console.log('🔄 CHARACTER.JS: updateTotalStats redirected to manual trigger');
          // Don't auto-calculate, just trigger manual recalculation
          setTimeout(() => {
            if (window.manualRecalculate) {
              window.manualRecalculate();
            }
          }, 100);
        };
      }
    }
    
    // 🎯 MANUAL TRIGGER (no auto-refresh to prevent loops)
    window.manualRecalculate = function() {
      console.log('🔄 Manual recalculation triggered...');
      if (window.statsCalculator && !window.statsCalculator._isCalculating) {
        window.statsCalculator.calculateAllStats();
      }
    };
    
    console.log('🚀 Initial doubling + missing stats fix applied!');
    console.log('✅ Base stats should not be doubled on load');
    console.log('✅ All stats should show in calculator (IAS, FRW, Defense, etc.)');
    
    // 🎯 SAFE INITIAL CALCULATION (after short delay)
    setTimeout(() => {
      console.log('🔄 Initial calculation starting...');
      sc.calculateAllStats();
    }, 200);
  }
  
  // 🧪 Enhanced testing
  window.testFixedSystem = function() {
    console.log('🧪 Testing fixed system...');
    
    if (!window.statsCalculator) {
      console.log('❌ No statsCalculator found');
      return;
    }
    
    const baseStr = parseInt(document.getElementById('str')?.value) || 0;
    const stats = window.statsCalculator.stats;
    
    console.log('\n📊 FIXED SYSTEM RESULTS:');
    console.log(`  Base STR input: ${baseStr}`);
    console.log(`  Final STR total: ${stats.strength || 0} (should be close to base, not doubled)`);
    console.log(`  Magic Find: ${stats.magicFind || 0}%`);
    console.log(`  IAS: ${stats.ias || 0}% (should show if items have IAS)`);
    console.log(`  FRW: ${stats.frw || 0}% (should show if items have FRW)`);
    console.log(`  Defense: ${stats.defense || 0} (should show item defense)`);
    console.log(`  Life: ${stats.life || 0}`);
    console.log(`  Fire Resist: ${stats.fireResist || 0}%`);
    
    console.log('\n🔍 DOUBLING CHECK:');
    const expectedMinStr = baseStr;
    const expectedMaxStr = baseStr + 50; // allowing for reasonable item/socket bonuses
    console.log(`  STR should be between ${expectedMinStr} and ${expectedMaxStr}`);
    console.log(`  ${(stats.strength >= expectedMinStr && stats.strength <= expectedMaxStr) ? '✅ REASONABLE' : '❌ STILL WRONG'}`);
    
    console.log('\n📦 ITEM STATS CHECK:');
    if (window.characterStats && window.characterStats.calculateAllItemStats) {
      const itemStats = window.characterStats.calculateAllItemStats();
      console.log(`  Item IAS: ${itemStats.ias || 0}%`);
      console.log(`  Item FRW: ${itemStats.frw || 0}%`);
      console.log(`  Item Defense: ${itemStats.defense || 0}`);
    }
  };
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(applyInitialFix, 2000));
  } else {
    setTimeout(applyInitialFix, 2000);
  }
  
  setTimeout(applyInitialFix, 2600);
  
  console.log('🎯 Initial Doubling + Missing Stats Fix loaded! Test with testFixedSystem()');
  
})();