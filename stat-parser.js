/**
 * PD2 Planner - Stat Parser Module
 * Handles all logic for parsing text descriptions into numeric stats.
 */

window.StatParser = {
  // === CORE PARSING ENTRY POINTS ===

  parseItemStats(system, item, section) {
    let description = item.description;

    // 1. For dynamic items without a static description (or has baseType), generate it FIRST
    if (!description || item.baseType) {
      const dropdownId = Object.entries(system.equipmentMap).find(
        ([_, config]) => config.section === section
      )?.[0];

      if (dropdownId) {
        const itemName = document.getElementById(dropdownId)?.value;
        if (itemName) {
          description = window.generateItemDescription(itemName, item, dropdownId);
        }
      }
    }

    // 2. Safely append corruption text for parsing (ONLY for static items)
    const dropdownId = Object.entries(system.equipmentMap).find(
      ([_, config]) => config.section === section
    )?.[0];

    if (!item.baseType && dropdownId && window.itemCorruptions && window.itemCorruptions[dropdownId]) {
      const corruption = window.itemCorruptions[dropdownId];
      if (corruption.text && corruption.itemName) {
        const currentName = document.getElementById(dropdownId)?.value;
        if (currentName === corruption.itemName) {
          // CRITICAL FIX: Always append corruption text for static items
          description = (description ? description + '<br>' : '') + corruption.text;
        }
      }
    }

    if (!description) return;

    const hasBaseDefense = /Defense:\s*\d+/i.test(description);
    const lines = description.split('<br>');
    lines.forEach(line => this.parseStatLine(system, line.trim(), hasBaseDefense));
  },

  parseSocketStats(system, statsText, section) {
    if (!statsText) return;

    const statLines = statsText.split(',').map(line => line.trim()).filter(line => line);
    statLines.forEach(line => {
      try {
        this.parseStatLine(system, line);
      } catch (error) {
        // Silent error
      }
    });
  },

  /**
   * Complex regex-based parser for a single line of text.
   * Modifies system.stats or system.mercenaryStats directly.
   */
  parseStatLine(system, line, hasBaseDefense = false) {
    if (!line) return;

    const cleanLine = line.replace(/<[^>]*>/g, '').trim();
    if (!cleanLine) return;

    // IMPORTANT: Skip set bonus lines - these are handled by setTracker.js
    if (/\(\d+\s+Items?\)|\(Complete Set\)/i.test(cleanLine)) {
      return;
    }

    const stats = system.isMercenaryParsing ? system.mercenaryStats : system.stats;

    try {
      // === RAINBOW FACET PATTERNS FIRST ===
      
      // Skill damage bonuses
      if (cleanLine.match(/\+\d+%\s+to\s+Fire\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i);
        if (match) { stats.fireSkillDamage = (stats.fireSkillDamage || 0) + parseInt(match[1]); return; }
      }
      if (cleanLine.match(/\+\d+%\s+to\s+Cold\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i);
        if (match) { stats.coldSkillDamage = (stats.coldSkillDamage || 0) + parseInt(match[1]); return; }
      }
      if (cleanLine.match(/\+\d+%\s+to\s+Lightning\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i);
        if (match) { stats.lightningSkillDamage = (stats.lightningSkillDamage || 0) + parseInt(match[1]); return; }
      }
      if (cleanLine.match(/\+\d+%\s+to\s+Poison\s+Skill\s+Damage/i)) {
        const match = cleanLine.match(/\+(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i);
        if (match) { stats.poisonSkillDamage = (stats.poisonSkillDamage || 0) + parseInt(match[1]); return; }
      }

      // Enemy resistance pierce
      const piercePatterns = [
        { regex: /-(\d+)%\s+to\s+Enemy\s+Fire\s+Resistance/i, key: 'pierceFire' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Cold\s+Resistance/i, key: 'pierceCold' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Lightning\s+Resistance/i, key: 'pierceLightning' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Poison\s+Resistance/i, key: 'piercePoison' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Physical\s+Resistance/i, key: 'piercePhysical' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Magic\s+Resistance/i, key: 'pierceMagic' }
      ];
      for (const pattern of piercePatterns) {
        const match = cleanLine.match(pattern.regex);
        if (match) { stats[pattern.key] = (stats[pattern.key] || 0) + parseInt(match[1]); return; }
      }

      // === ELEMENTAL DAMAGE PATTERNS ===
      const elemDmgPatterns = [
        { regex: /(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Fire\s+Damage/i, minKey: 'fireDmgMin', maxKey: 'fireDmgMax' },
        { regex: /(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Lightning\s+Damage/i, minKey: 'lightDmgMin', maxKey: 'lightDmgMax' },
        { regex: /(?:Adds\s+)?(\d+)(?:-(\d+))?\s+Cold\s+Damage/i, minKey: 'coldDmgMin', maxKey: 'coldDmgMax' },
        { regex: /(?:Adds\s+|\+)?(\d+)(?:-(\d+))?\s+Poison\s+Damage/i, minKey: 'poisonDmgMin', maxKey: 'poisonDmgMax' }
      ];
      for (const pattern of elemDmgPatterns) {
        const match = cleanLine.match(pattern.regex);
        if (match) {
          stats[pattern.minKey] += parseInt(match[1]);
          stats[pattern.maxKey] += parseInt(match[2] || match[1]);
          return;
        }
      }

      // === PROCS ===
      const levelUpProcMatch = cleanLine.match(/(\d+)%\s+Chance\s+to\s+Cast\s+Level\s+(\d+)\s+(.+?)\s+when\s+you\s+Level[- ]Up/i);
      if (levelUpProcMatch) {
        stats.levelUpProcs.push({ chance: parseInt(levelUpProcMatch[1]), level: parseInt(levelUpProcMatch[2]), skill: levelUpProcMatch[3] });
        return;
      }
      const deathProcMatch = cleanLine.match(/(\d+)%\s+Chance\s+to\s+Cast\s+Level\s+(\d+)\s+(.+?)\s+when\s+you\s+Die/i);
      if (deathProcMatch) {
        stats.deathProcs.push({ chance: parseInt(deathProcMatch[1]), level: parseInt(deathProcMatch[2]), skill: deathProcMatch[3] });
        return;
      }

      // === DEFENSE ===
      const baseDefMatch = cleanLine.match(/^Defense:\s*(\d+)/i);
      if (baseDefMatch) { stats.defense += parseInt(baseDefMatch[1]); return; }
      
      if (!hasBaseDefense) {
        const toDefMatch = cleanLine.match(/^\+(\d+)\s+Defense(?!\s+vs)/i);
        if (toDefMatch) { stats.defense += parseInt(toDefMatch[1]); return; }
      }

      // === ATTRIBUTES ===
      const allAttrsMatch = cleanLine.match(/([+-]?\d+)\s+(?:to\s+)?All\s+Attributes/i);
      if (allAttrsMatch) {
        const val = parseInt(allAttrsMatch[1]);
        stats.strength += val; stats.dexterity += val; stats.vitality += val; stats.energy += val;
        return;
      }

      const attrPatterns = [
        { regex: /([+-]?\d+)\s+(?:to\s+)?(?:Strength|STR)/i, key: 'strength' },
        { regex: /([+-]?\d+)\s+(?:to\s+)?(?:Dexterity|DEX)/i, key: 'dexterity' },
        { regex: /([+-]?\d+)\s+(?:to\s+)?(?:Vitality|VIT)/i, key: 'vitality' },
        { regex: /([+-]?\d+)\s+(?:to\s+)?(?:Energy|ENR)/i, key: 'energy' },
        { regex: /([+-]?\d+)\s+(?:to\s+)?Life/i, key: 'life' },
        { regex: /([+-]?\d+)\s+(?:to\s+)?Mana(?!\s*[a-zA-Z])/i, key: 'mana' }
      ];
      for (const pattern of attrPatterns) {
        const match = cleanLine.match(pattern.regex);
        if (match) { stats[pattern.key] += parseInt(match[1]); return; }
      }

      // === PER LEVEL STATS ===
      const perLvlMatch = cleanLine.match(/\(\+([0-9.]+)\s+per\s+Character\s+Level\)/i);
      if (perLvlMatch) {
        const value = Math.floor(parseFloat(perLvlMatch[1]) * system.currentLevel);
        if (cleanLine.includes('Attack Rating')) stats.toatt += value;
        else if (cleanLine.includes('Maximum Damage')) stats.toMaxDmg += value;
        else if (cleanLine.includes('Defense')) stats.defense += value;
        else if (cleanLine.includes('Life')) stats.life += value;
        else if (cleanLine.includes('Mana')) stats.mana += value;
        return;
      }

      // === SKILLS ===
      const allSkillsMatch = cleanLine.match(/(?:\+)?(\d+)\s+(?:to\s+)?All\s+Skills/i);
      if (allSkillsMatch) { stats.allSkills += parseInt(allSkillsMatch[1]); return; }
      
      const skillBonusMatch = cleanLine.match(/\+(\d+)\s+to\s+([A-Za-z\s\'\-]+?)(?=\s+\(|$)/i);
      if (skillBonusMatch && window.skillSystem?.classSkillTrees) {
        const bonus = parseInt(skillBonusMatch[1]);
        const skillName = skillBonusMatch[2].trim().toLowerCase();
        for (const className in window.skillSystem.classSkillTrees) {
          for (const treeId in window.skillSystem.classSkillTrees[className]) {
            for (const skill of window.skillSystem.classSkillTrees[className][treeId]) {
              if (skill.name.toLowerCase() === skillName) {
                if (!stats.individualSkillBonuses) stats.individualSkillBonuses = {};
                stats.individualSkillBonuses[skill.id] = (stats.individualSkillBonuses[skill.id] || 0) + bonus;
                return;
              }
            }
          }
        }
      }

      // === RESISTANCES ===
      const allResMatch = cleanLine.match(/All\s+Resistances?\s+([+-]?\d+)%?/i);
      if (allResMatch) {
        const val = parseInt(allResMatch[1]);
        stats.fireResist += val; stats.coldResist += val; stats.lightResist += val; stats.poisonResist += val;
        stats.allResistances += val;
        return;
      }
      
      const resPatterns = [
        { regex: /Fire\s+Resist\s+([+-]?\d+)%?/i, key: 'fireResist' },
        { regex: /Cold\s+Resist\s+([+-]?\d+)%?/i, key: 'coldResist' },
        { regex: /Lightning\s+Resist\s+([+-]?\d+)%?/i, key: 'lightResist' },
        { regex: /Poison\s+Resist\s+([+-]?\d+)%?/i, key: 'poisonResist' },
        { regex: /Curse\s+Resist(?:ance)?\s+([+-]?\d+)%?/i, key: 'curseResist' }
      ];
      for (const pattern of resPatterns) {
        const match = cleanLine.match(pattern.regex);
        if (match) { stats[pattern.key] += parseInt(match[1]); return; }
      }

      // === SPEED AND SPECIAL ===
      const speedPatterns = [
        { regex: /(\d+)%\s+Increased\s+Attack\s+Speed/i, key: 'ias' },
        { regex: /(\d+)%\s+Faster\s+Cast\s+Rate/i, key: 'fcr' },
        { regex: /(\d+)%\s+Faster\s+Run\/Walk/i, key: 'frw' },
        { regex: /(\d+)%\s+Faster\s+Hit\s+Recovery/i, key: 'fhr' },
        { regex: /(\d+)%\s+Faster\s+Block\s+Rate/i, key: 'faster_block_rate' }
      ];
      for (const pattern of speedPatterns) {
        const match = cleanLine.match(pattern.regex);
        if (match) { stats[pattern.key] += parseInt(match[1]); return; }
      }

      if (cleanLine.match(/Cannot\s+Be\s+Frozen/i)) { stats.cbf = true; return; }

      // === COMBAT ===
      const combatPatterns = [
        { regex: /(\d+)%\s+Chance\s+of\s+Crushing\s+Blow/i, key: 'crushingBlow' },
        { regex: /(\d+)%\s+Deadly\s+Strike/i, key: 'deadlyStrike' },
        { regex: /(\d+)%\s+Maximum\s+Deadly\s+Strike/i, key: 'maxDeadlyStrike' },
        { regex: /(\d+)%\s+Chance\s+of\s+Open\s+Wounds/i, key: 'openWounds' },
        { regex: /(\d+)\s+Open\s+Wounds\s+Damage\s+per\s+Second/i, key: 'openWoundsDamage' }
      ];
      for (const pattern of combatPatterns) {
        const match = cleanLine.match(pattern.regex);
        if (match) { stats[pattern.key] += parseInt(match[1]); return; }
      }

      // === MISC ===
      const miscPatterns = [
        { regex: /([+-]?\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i, key: 'goldFind' },
        { regex: /(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i, key: 'magicFind' },
        { regex: /(\d+)%\s+Damage\s+Taken\s+Gained\s+as\s+Mana\s+when\s+Hit/i, key: 'dmgtomana' },
        { regex: /(\d+)%\s+Life\s+Stolen\s+per\s+Hit/i, key: 'lifeSteal' },
        { regex: /(\d+)%\s+Mana\s+Stolen\s+per\s+Hit/i, key: 'manaSteal' },
        { regex: /(\d+)%\s+Target\s+Defense/i, key: 'targetDefense' },
        { regex: /\+(\d+)\s+to\s+Minimum\s+Damage/i, key: 'toMinDmg' },
        { regex: /\+(\d+)\s+to\s+Maximum\s+Damage/i, key: 'toMaxDmg' },
        { regex: /\+(\d+)%?\s+Damage\s+(?:to|vs)\s+Undead/i, key: 'dmgtoundead' },
        { regex: /\+(\d+)%?\s+Damage\s+(?:to|vs)\s+Demons/i, key: 'dmgtodemon' },
        { regex: /Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)\s*%/i, key: 'dr' },
        { regex: /Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)\b(?!\s*%)/i, key: 'pdr' },
        { regex: /Magic\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+(\d+)/i, key: 'mdr' },
        { regex: /Replenish\s+Life\s+\+?([+-]?\d+)/i, key: 'regenLife' },
        { regex: /\+(\d+)\s+to\s+Mana\s+after\s+each\s+Kill/i, key: 'regenMana' }, // Tir rune etc
        { regex: /(?:\+)?(\d+)\s+(?:to\s+)?Light\s+Radius/i, key: 'lightRadius' }
      ];
      for (const pattern of miscPatterns) {
        const match = cleanLine.match(pattern.regex);
        if (match) { stats[pattern.key] += parseInt(match[1]); return; }
      }

    } catch (error) {
      // Silently skip
    }
  },

  // === STACKING STATS SYSTEM ===

  parseStatsToMap(statsText) {
    const statsMap = new Map();
    const lines = (statsText.includes('<br>') ? statsText.split('<br>') : statsText.split(',')).filter(line => line.trim());

    lines.forEach(line => {
      const cleanLine = line.replace(/<[^>]*>/g, '').trim();
      if (!cleanLine) return;

      // Handle specific stackable patterns
      const patterns = [
        { regex: /\+(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i, key: 'fire_skill_damage' },
        { regex: /\+(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i, key: 'cold_skill_damage' },
        { regex: /\+(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i, key: 'lightning_skill_damage' },
        { regex: /\+(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i, key: 'poison_skill_damage' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Fire\s+Resistance/i, key: 'fire_resist_pierce' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Cold\s+Resistance/i, key: 'cold_resist_pierce' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Lightning\s+Resistance/i, key: 'lightning_resist_pierce' },
        { regex: /-(\d+)%\s+to\s+Enemy\s+Poison\s+Resistance/i, key: 'poison_resist_pierce' },
        { regex: /(?:Adds\s+)?(\d+)-(\d+)\s+Lightning\s+Damage/i, key: 'lightning_damage', isRange: true },
        { regex: /(?:Adds\s+)?(\d+)-(\d+)\s+Fire\s+Damage/i, key: 'fire_damage', isRange: true },
        { regex: /(?:Adds\s+)?(\d+)-(\d+)\s+Cold\s+Damage/i, key: 'cold_damage', isRange: true },
        { regex: /(?:\+)?(\d+)\s+(?:to\s+)?(Strength|Dexterity|Vitality|Energy)/i, isAttr: true },
        { regex: /([+-]?\d+)%?\s+(Fire|Cold|Lightning|Poison)\s+Resist/i, isRes: true }
      ];

      for (const p of patterns) {
        const match = cleanLine.match(p.regex);
        if (match) {
          if (p.isRange) {
            this.addToStatsMap(statsMap, p.key, { min: parseInt(match[1]), max: parseInt(match[2]) });
          } else if (p.isAttr) {
            this.addToStatsMap(statsMap, match[2].toLowerCase(), { value: parseInt(match[1]) });
          } else if (p.isRes) {
            this.addToStatsMap(statsMap, `${match[2].toLowerCase()}_resist`, { value: parseInt(match[1]) });
          } else {
            this.addToStatsMap(statsMap, p.key, { value: parseInt(match[1]) });
          }
          return;
        }
      }

      // Store other stats as non-stackable
      statsMap.set(`other_${Date.now()}_${Math.random()}`, { text: cleanLine, stackable: false });
    });

    return statsMap;
  },

  addToStatsMap(statsMap, key, data) {
    if (statsMap.has(key)) {
      const existing = statsMap.get(key);
      if (data.min !== undefined && data.max !== undefined) {
        existing.min = (existing.min || 0) + data.min;
        existing.max = (existing.max || 0) + data.max;
        existing.stacked = true;
      } else if (data.value !== undefined) {
        existing.value = (existing.value || 0) + data.value;
        existing.stacked = true;
      } else if (data.chance !== undefined && key.includes('_proc_')) {
        // Proc chances - stack them
        existing.chance = (existing.chance || 0) + data.chance;
        existing.stacked = true;
        if (!existing.skill) existing.skill = data.skill;
        if (!existing.level) existing.level = data.level;
      }
    } else {
      statsMap.set(key, { ...data, stacked: false });
    }
  },

  mergeStatsMaps(baseStats, socketStats) {
    socketStats.forEach((socketData, key) => {
      if (baseStats.has(key)) {
        const baseData = baseStats.get(key);
        if (socketData.min !== undefined && socketData.max !== undefined) {
          baseData.min = (baseData.min || 0) + socketData.min;
          baseData.max = (baseData.max || 0) + socketData.max;
          baseData.stacked = true;
        } else if (socketData.value !== undefined) {
          baseData.value = (baseData.value || 0) + socketData.value;
          baseData.stacked = true;
        }
        if (socketData.isCorrupted) baseData.isCorrupted = true;
      } else {
        baseStats.set(key, { ...socketData, fromSocket: true });
      }
    });
  },

  formatStackedStat(key, data, isCorrupted) {
    const color = (isCorrupted || data.isCorrupted) ? '#ff5555' : '#4a90e2';
    const shadow = (isCorrupted || data.isCorrupted) ? 'text-shadow: 0 0 3px #ff5555;' : 'text-shadow: 0 0 3px rgba(74, 144, 226, 0.5);';

    const formats = {
      'lightning_damage': `Adds ${data.min}-${data.max} Lightning Damage`,
      'fire_damage': `Adds ${data.min}-${data.max} Fire Damage`,
      'cold_damage': `Adds ${data.min}-${data.max} Cold Damage`,
      'poison_damage': `Adds ${data.min}-${data.max} Poison Damage`,
      'fire_resist': `Fire Resist +${data.value}%`,
      'cold_resist': `Cold Resist +${data.value}%`,
      'lightning_resist': `Lightning Resist +${data.value}%`,
      'poison_resist': `Poison Resist +${data.value}%`,
      'strength': `+${data.value} to Strength`,
      'dexterity': `+${data.value} to Dexterity`,
      'vitality': `+${data.value} to Vitality`,
      'energy': `+${data.value} to Energy`,
      'fire_skill_damage': `+${data.value}% to Fire Skill Damage`,
      'cold_skill_damage': `+${data.value}% to Cold Skill Damage`,
      'lightning_skill_damage': `+${data.value}% to Lightning Skill Damage`,
      'poison_skill_damage': `+${data.value}% to Poison Skill Damage`,
      'fire_resist_pierce': `-${data.value}% to Enemy Fire Resistance`,
      'cold_resist_pierce': `-${data.value}% to Enemy Cold Resistance`,
      'lightning_resist_pierce': `-${data.value}% to Enemy Lightning Resistance`,
      'poison_resist_pierce': `-${data.value}% to Enemy Poison Resistance`
    };

    const text = formats[key] || data.text || '';
    return `<span style="color: ${color}; font-weight: bold; ${shadow}">${text}</span>`;
  },

  getStatPattern(key) {
    const patterns = {
      'lightning_damage': /(?:Adds\s+)?\d+-\d+\s+Lightning\s+Damage/gi,
      'fire_damage': /(?:Adds\s+)?\d+-\d+\s+Fire\s+Damage/gi,
      'cold_damage': /(?:Adds\s+)?\d+-\d+\s+Cold\s+Damage/gi,
      'poison_damage': /(?:Adds\s+)?\d+-\d+\s+Poison\s+Damage/gi,
      'fire_resist': /Fire\s+Resist\s+\+?\d+%?/gi,
      'cold_resist': /Cold\s+Resist\s+\+?\d+%?/gi,
      'lightning_resist': /Lightning\s+Resist\s+\+?\d+%?/gi,
      'poison_resist': /Poison\s+Resist\s+\+?\d+%?/gi,
      'max_fire_resist': /\+?\d+%\s+to\s+Maximum\s+Fire\s+Resist/gi,
      'max_cold_resist': /\+?\d+%\s+to\s+Maximum\s+Cold\s+Resist/gi,
      'max_lightning_resist': /\+?\d+%\s+to\s+Maximum\s+Lightning\s+Resist/gi,
      'max_poison_resist': /\+?\d+%\s+to\s+Maximum\s+Poison\s+Resist/gi,
      'strength': /(?:\+)?\d+\s+(?:to\s+)?Strength/gi,
      'dexterity': /(?:\+)?\d+\s+(?:to\s+)?Dexterity/gi,
      'vitality': /(?:\+)?\d+\s+(?:to\s+)?Vitality/gi,
      'energy': /(?:\+)?\d+\s+(?:to\s+)?Energy/gi,
      'attack_rating': /(?:\+)?\d+\s+(?:to\s+)?Attack\s+Rating/gi,
      'attack_rating_percent': /\d+%\s+(?:Bonus\s+)?to\s+Attack\s+Rating/gi,
      'faster_hit_recovery': /(?:\+)?\d+%?\s+Faster\s+Hit\s+Recovery/gi,
      'faster_block_rate': /(?:\+)?\d+%?\s+Faster\s+Block\s+Rate/gi,
      'faster_cast_rate': /(?:\+)?\d+%?\s+Faster\s+Cast\s+Rate/gi,
      'increased_attack_speed': /(?:\+)?\d+%?\s+Increased\s+Attack\s+Speed/gi,
      'faster_run_walk': /(?:\+)?\d+%?\s+Faster\s+Run\/Walk/gi,
      'magic_find': /\d+%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/gi,
      'gold_find': /\d+%\s+Extra\s+Gold\s+from\s+Monsters/gi,
      'life': /(?:\+)?\d+\s+(?:to\s+)?Life/gi,
      'mana': /(?:\+)?\d+\s+(?:to\s+)?Mana/gi,
      'all_skills': /(?:\+)?\d+\s+(?:to\s+)?All\s+Skills/gi,
      'crushing_blow': /\d+%\s+Chance\s+of\s+Crushing\s+Blow/gi,
      'deadly_strike': /\d+%\s+Deadly\s+Strike/gi,
      'open_wounds': /\d+%\s+Chance\s+of\s+Open\s+Wounds/gi,
      'minimum_damage': /\+\d+\s+to\s+Minimum\s+Damage/gi,
      'maximum_damage': /\+\d+\s+to\s+Maximum\s+Damage/gi,
      'mana_after_kill': /\+\d+\s+to\s+Mana\s+after\s+each\s+Kill/gi,
      'replenish_life': /Replenish\s+Life\s+[+-]?\d+/gi,
      'damage_vs_undead': /\+\d+%\s+Damage\s+(?:vs|to)\s+Undead/gi,
      'ar_vs_undead': /\+\d+\s+Attack\s+Rating\s+(?:vs|to)\s+Undead/gi,
      'physical_damage_reduced_percent': /Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+\d+\s*%/gi,
      'physical_damage_reduced': /Physical\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+\d+\b(?!\s*%)/gi,
      'magic_damage_reduced': /Magic\s+Damage\s+(?:Taken\s+)?Reduced\s+by\s+\d+\b/gi,
      'fire_skill_damage': /\+(\d+)%\s+to\s+Fire\s+Skill\s+Damage/gi,
      'cold_skill_damage': /\+(\d+)%\s+to\s+Cold\s+Skill\s+Damage/gi,
      'lightning_skill_damage': /\+(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/gi,
      'poison_skill_damage': /\+(\d+)%\s+to\s+Poison\s+Skill\s+Damage/gi,
      'fire_resist_pierce': /-(\d+)%\s+to\s+Enemy\s+Fire\s+Resistance/gi,
      'cold_resist_pierce': /-(\d+)%\s+to\s+Enemy\s+Cold\s+Resistance/gi,
      'lightning_resist_pierce': /-(\d+)%\s+to\s+Enemy\s+Lightning\s+Resistance/gi,
      'poison_resist_pierce': /-(\d+)%\s+to\s+Enemy\s+Poison\s+Resistance/gi,
      'lightRadius': /(?:\+)?\d+\s+(?:to\s+)?Light\s+Radius/gi
    };
    return patterns[key] || null;
  }
};
