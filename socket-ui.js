/**
 * PD2 Planner - Socket UI Module
 * Handles all UI rendering, tooltips, modals, and event handling for the socket system.
 */

window.SocketUI = {
  /**
   * Updates multiple UI components at once.
   */
  updateAllItemDisplays(system) {
    const sections = [
      'weapon', 'helm', 'armor', 'shield', 'gloves', 'belts', 'boots', 'ringone', 'ringtwo', 'amulet',
      'mercweapon', 'merchelm', 'mercarmor', 'mercoff', 'mercgloves', 'mercbelts', 'mercboots'
    ];
    sections.forEach(section => this.updateItemDisplay(system, section));
  },

  /**
   * Updates the main stats tab with current calculated values
   */
  updateStatsDisplay(system) {
    const charClass = document.getElementById('selectClass')?.value || 'Amazon';
    const baseStr = parseInt(document.getElementById('str')?.value) || 0;
    const baseDex = parseInt(document.getElementById('dex')?.value) || 0;
    const baseVit = parseInt(document.getElementById('vit')?.value) || 0;
    const baseEnr = parseInt(document.getElementById('enr')?.value) || 0;

    const totalStr = baseStr + system.stats.strength;
    const totalDex = baseDex + system.stats.dexterity;
    const totalVit = baseVit + system.stats.vitality;
    const totalEnr = baseEnr + system.stats.energy;

    this.updateElement('total-str', totalStr);
    this.updateElement('total-dex', totalDex);
    this.updateElement('total-vit', totalVit);
    this.updateElement('total-enr', totalEnr);

    this.updateElement('strengthcontainer', system.stats.strength);
    this.updateElement('dexteritycontainer', system.stats.dexterity);
    this.updateElement('vitalitycontainer', system.stats.vitality);
    this.updateElement('energycontainer', system.stats.energy);

    this.updateElement('fireresistcontainer', system.stats.fireResist);
    this.updateElement('coldresistcontainer', system.stats.coldResist);
    this.updateElement('lightresistcontainer', system.stats.lightResist);
    this.updateElement('poisonresistcontainer', system.stats.poisonResist);
    this.updateElement('curseresistcontainer', system.stats.curseResist || 0);

    this.updateElement('iascontainer', system.stats.ias);
    this.updateElement('fcrcontainer', system.stats.fcr);
    this.updateElement('frwcontainer', system.stats.frw);
    this.updateElement('fhrcontainer', system.stats.fhr);

    this.updateElement('owcontainer', system.stats.openWounds);
    
    const classStats = window.UnifiedSocketData.classStats;
    const classConstant = classStats[charClass]?.arConstant || 0;
    const baseAR = (totalDex - 7) * 5 + classConstant;
    const gearAR = system.stats.toatt;
    const arBonus = 1 + (system.stats.toattPercent / 100);
    const totalAR = Math.floor((baseAR + gearAR) * arBonus);
    this.updateElement('attackratingcontainer', totalAR);

    this.updateElement('owdmgcontainer', system.stats.openWounds > 0 ? system.stats.openWoundsDamage : 0);
    this.updateElement('cbcontainer', system.stats.crushingBlow);
    this.updateElement('cbdmgcontainer', system.stats.crushingBlow);
    this.updateElement('deadlystrikecontainer', system.stats.deadlyStrike);
    this.updateElement('criticalhitcontainer', system.stats.criticalHit || 0);
    this.updateElement('lifestealcontainer', system.stats.lifeSteal);
    this.updateElement('manastealcontainer', system.stats.manaSteal);
    this.updateElement('damagetodemoncontainer', system.stats.dmgtodemon);
    this.updateElement('damagetoundeadcontainer', system.stats.dmgtoundead);

    this.updateElement('drcontainer', system.stats.dr);
    this.updateElement('pdrcontainer', system.stats.pdr);
    this.updateElement('mdrcontainer', system.stats.mdr);
    this.updateElement('plrcontainer', system.stats.plr || 0);
    this.updateElement('blockchancecontainer', system.stats.blockChance || 0);

    const realBlock = this.calculateRealBlock(system, totalDex);
    this.updateElement('realblockcontainer', realBlock);

    this.updateDefenseDisplay(system, totalDex);

    const allSkillsContainer = document.getElementById('allskillscontainer');
    if (allSkillsContainer) {
      allSkillsContainer.textContent = system.stats.allSkills;
    }

    if (window.skillSystem) {
      window.skillSystem.updateSkillBonuses(system.stats.allSkills, system.stats.classSkills, system.stats.treeSkills, system.stats.individualSkillBonuses);
    }

    this.updateElement('magicfindcontainer', system.stats.magicFind);
    this.updateElement('goldfindcontainer', system.stats.goldFind);
    this.updateElement('cbfcontainer', system.stats.cbf ? 'Yes' : 'No');

    this.updateElementalDamageDisplay(system);

    this.updateElement('tomindmgcontainer', system.stats.toMinDmg);
    this.updateElement('tomaxdmgcontainer', system.stats.toMaxDmg);

    this.updateElement('fireskilldmgcontainer', system.stats.fireSkillDamage);
    this.updateElement('coldskilldmgcontainer', system.stats.coldSkillDamage);
    this.updateElement('lightningskilldmgcontainer', system.stats.lightningSkillDamage);
    this.updateElement('poisonskilldmgcontainer', system.stats.poisonSkillDamage);
    this.updateElement('magicskilldmgcontainer', system.stats.magicSkillDamage);

    this.updateElement('piercefirecontainer', system.stats.pierceFire);
    this.updateElement('piercecoldcontainer', system.stats.pierceCold);
    this.updateElement('piercelightningcontainer', system.stats.pierceLightning);
    this.updateElement('piercepoisoncontainer', system.stats.piercePoison);
    this.updateElement('piercephyscontainer', system.stats.piercePhysical);
    this.updateElement('piercemagiccontainer', system.stats.pierceMagic);

    if (typeof window.updateCritDisplay === 'function') window.updateCritDisplay();
    if (window.characterManager) window.characterManager.updateTotalStats();
    if (window.skillSystem?.calculateSkillDamage) window.skillSystem.calculateSkillDamage();
  },

  calculateRealBlock(system, totalDex) {
    const shieldDropdown = document.getElementById('offs-dropdown');
    const charLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
    if (!shieldDropdown?.value) return 0;

    const shieldItem = window.getItemData ? window.getItemData(shieldDropdown.value) : null;
    if (!shieldItem?.properties?.block1) return 0;

    const block1 = shieldItem.properties.block1 || 0;
    const holyShieldLevel = window.skillSystem?.getSkillTotalLevel?.('holyshieldcontainer') || 0;
    const holyShieldBonus = holyShieldLevel > 0 ? (holyShieldLevel * 15) : 0;

    const dexFactor = Math.max(0, totalDex - 15);
    const levelDivisor = charLevel * 2;
    return levelDivisor > 0 ? Math.min(75, Math.floor((block1 + holyShieldBonus) * dexFactor / levelDivisor)) : 0;
  },

  updateDefenseDisplay(system, totalDex) {
    const dexDefenseBonus = Math.floor(totalDex / 4);
    let totalDefense = system.stats.defense + dexDefenseBonus;

    const ownShout = window.skillSystem?.getShoutDefenseBonus?.() || 0;
    const partyShout = window.partyManager?.getBestBuff('shout')?.defenseBonus || 0;
    const ironSkin = window.skillSystem?.getIronSkinDefenseBonus?.() || 0;
    const cloak = window.skillSystem?.getCloakOfShadowsDefenseBonus?.() || 0;

    const totalDefPercent = Math.max(ownShout, partyShout) + ironSkin + cloak;
    if (totalDefPercent > 0) {
      totalDefense = Math.floor(totalDefense * (1 + totalDefPercent / 100));
    }

    const defenseContainer = document.getElementById('defensecontainer');
    if (defenseContainer) {
      defenseContainer.textContent = totalDefense;
      defenseContainer.style.color = (totalDefPercent > 0) ? '#d0d007ff' : '';
    }
  },

  updateElementalDamageDisplay(system) {
    const bonuses = { fire: system.stats.fireSkillDamage || 0, cold: system.stats.coldSkillDamage || 0, light: system.stats.lightningSkillDamage || 0, poison: system.stats.poisonSkillDamage || 0 };
    const types = ['fire', 'cold', 'light', 'poison'];
    const keys = { fire: 'fireDmg', cold: 'coldDmg', light: 'lightDmg', poison: 'poisonDmg' };

    types.forEach(t => {
      const minKey = keys[t] + 'Min';
      const maxKey = keys[t] + 'Max';
      const bonus = 1 + (bonuses[t] / 100);
      this.updateElement(`flat${t}mincontainer`, Math.floor(system.stats[minKey] * bonus));
      this.updateElement(`flat${t}maxcontainer`, Math.floor(system.stats[maxKey] * bonus));
    });
  },

  updateMercenaryStatsDisplay(system) {
    const stats = system.mercenaryStats;
    if (!stats) return;

    const shout = Math.max(window.skillSystem?.getShoutDefenseBonus?.() || 0, window.partyManager?.getBestBuff('shout')?.defenseBonus || 0);
    const cloak = window.skillSystem?.getCloakOfShadowsDefenseBonus?.() || 0;
    const defBonus = shout + cloak;
    let finalDef = stats.defense;
    if (defBonus > 0) finalDef = Math.floor(finalDef * (1 + defBonus / 100));

    const bc = Math.max(window.skillSystem?.getBattleCommandSkills?.() || 0, window.partyManager?.getBestBuff('battle-command')?.allSkills || 0);

    this.updateElement('merc-allskills', stats.allSkills + bc);
    const bcElem = document.getElementById('merc-allskills');
    if (bcElem) bcElem.style.color = bc > 0 ? '#d0d007ff' : '';

    this.updateElement('merc-mf', stats.magicFind);
    this.updateElement('merc-gf', stats.goldFind);
    this.updateElement('merc-defense', finalDef);
    const defElem = document.getElementById('merc-defense');
    if (defElem) defElem.style.color = defBonus > 0 ? '#d0d007ff' : '';

    const simpleStats = ['dr', 'pdr', 'mdr', 'plr', 'ias', 'fcr', 'frw', 'fhr', 'fireResist', 'coldResist', 'lightResist', 'poisonResist', 'curseResist'];
    simpleStats.forEach(s => {
      const id = 'merc-' + s.replace('Resist', '-res').toLowerCase();
      this.updateElement(id, stats[s]);
    });
    this.updateElement('merc-cbf', stats.cbf ? 'Yes' : 'No');
  },

  updateItemDisplay(system, section) {
    const infoId = this.getSectionInfoId(section);
    const infoDiv = document.getElementById(infoId);
    if (!infoDiv) return;

    const dropdownId = this.getSectionDropdownId(section);
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown || !dropdown.value) {
      infoDiv.innerHTML = '';
      return;
    }

    const cacheKey = `${dropdownId}_${dropdown.value}`;
    let item = window.dropdownItemCache?.[cacheKey] || (window.getItemData ? window.getItemData(dropdown.value) : null);
    if (!item) {
      infoDiv.innerHTML = '';
      return;
    }

    const currentLevel = parseInt(document.getElementById('lvlValue')?.value) || 1;
    const actualRequiredLevel = this.calculateActualRequiredLevel(system, section, dropdown.value);
    const meetsRequirement = currentLevel >= actualRequiredLevel;
    const isUsableByClass = this.isItemUsableByCharacterClass(dropdown.value);
    const meetsStatRequirements = this.doesCharacterMeetStatRequirements(dropdown.value);

    const sockets = document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`);

    if (!item.description || item.baseType) {
      let baseDescription = window.generateItemDescription ? window.generateItemDescription(dropdown.value, item, dropdownId) : '';
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = baseDescription;
      tempDiv.querySelectorAll('.stat-input').forEach(input => input.remove());
      const cleanBaseDescription = tempDiv.innerHTML;

      const baseStats = window.StatParser.parseStatsToMap(cleanBaseDescription);
      
      // Handle corruption for dynamic items
      let corruptionMerged = false;
      if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
        const corruption = window.itemCorruptions[dropdownId];
        if (corruption.text && corruption.itemName === dropdown.value && typeof window.addCorruptionWithStacking === 'function') {
          // Add corruption to description and update baseStats map
          baseDescription = window.addCorruptionWithStacking(baseDescription, corruption.text, baseStats);
          corruptionMerged = true;
        }
      }

      const socketItems = [];
      sockets.forEach(socket => {
        if (socket.dataset.stats && socket.dataset.itemName) {
          const lReq = parseInt(socket.dataset.levelReq) || 1;
          const usable = currentLevel >= lReq && meetsRequirement && isUsableByClass && meetsStatRequirements;
          socketItems.push({ name: socket.dataset.itemName, stats: socket.dataset.stats, levelReq: lReq, usable });
          if (usable) {
            window.StatParser.mergeStatsMaps(baseStats, window.StatParser.parseStatsToMap(socket.dataset.stats));
          }
        }
      });

      let finalDescription = this.generateStackedDescription(system, baseDescription, baseStats, socketItems, dropdownId, corruptionMerged);
      finalDescription = this.updateStatRequirementsInDescription(finalDescription, actualRequiredLevel, meetsRequirement, dropdown.value);
      finalDescription = this.cleanDuplicateCorruptionText(finalDescription);

      infoDiv.innerHTML = finalDescription;
      if (window.attachStatInputListeners) window.attachStatInputListeners();
      this.applyItemUsabilityStyling(infoDiv, meetsRequirement, isUsableByClass, meetsStatRequirements, actualRequiredLevel);
      return;
    }

    let baseDescription = (window.originalItemDescriptions && window.originalItemDescriptions[dropdown.value]) || item.description;
    const baseStats = window.StatParser.parseStatsToMap(baseDescription);
    const socketItems = [];

    sockets.forEach(socket => {
      if (socket.dataset.stats && socket.dataset.itemName) {
        const lReq = parseInt(socket.dataset.levelReq) || 1;
        const usable = currentLevel >= lReq && meetsRequirement && isUsableByClass && meetsStatRequirements;
        socketItems.push({ name: socket.dataset.itemName, stats: socket.dataset.stats, levelReq: lReq, usable });
        if (usable) {
          window.StatParser.mergeStatsMaps(baseStats, window.StatParser.parseStatsToMap(socket.dataset.stats));
        }
      }
    });

    let corruptionMerged = false;
    if (window.itemCorruptions && window.itemCorruptions[dropdownId]) {
      const corruption = window.itemCorruptions[dropdownId];
      if (corruption.text && corruption.itemName === dropdown.value && typeof window.addCorruptionWithStacking === 'function') {
        baseDescription = window.addCorruptionWithStacking(baseDescription, corruption.text, baseStats);
        corruptionMerged = true;
      }
    }

    let finalDescription = this.generateStackedDescription(system, baseDescription, baseStats, socketItems, dropdownId, corruptionMerged);
    finalDescription = this.updateStatRequirementsInDescription(finalDescription, actualRequiredLevel, meetsRequirement, dropdown.value);
    finalDescription = this.cleanDuplicateCorruptionText(finalDescription);

    infoDiv.innerHTML = finalDescription;
    this.applyItemUsabilityStyling(infoDiv, meetsRequirement, isUsableByClass, meetsStatRequirements, actualRequiredLevel);
  },

  updateStatRequirementsInDescription(description, reqLevel, meetsLevel, itemKey) {
    const levelColor = meetsLevel ? '#00ff00' : '#ff5555';
    const newLevelLine = `<span style="color: ${levelColor}; font-weight: bold;">Required Level: ${reqLevel}</span>`;
    
    // Improved pattern to match various formats of Required Level
    const levelPattern = /(?:<span[^>]*>)?Required Level:?\s*\d+(?:<\/span>)?/gi;
    
    let finalDesc = description;
    if (finalDesc.match(levelPattern)) {
      finalDesc = finalDesc.replace(levelPattern, newLevelLine);
    } else {
      // If not found, try to append it after common base props
      const defensePattern = /(Defense: \d+)/i;
      if (finalDesc.match(defensePattern)) {
        finalDesc = finalDesc.replace(defensePattern, `$1<br>${newLevelLine}`);
      }
    }

    finalDesc = this.updateStatRequirementColors(finalDesc, itemKey);
    return finalDesc;
  },

  applyItemUsabilityStyling(infoDiv, meetsLevel, isUsableByClass, meetsStats, reqLevel) {
    if (!meetsLevel || !isUsableByClass || !meetsStats) {
      infoDiv.style.opacity = '0.6';
      infoDiv.style.filter = 'grayscale(50%)';
      if (!meetsLevel) infoDiv.title = `You need level ${reqLevel} to use this item`;
      else if (!isUsableByClass) infoDiv.title = `This item is restricted to a different class`;
      else infoDiv.title = `You don't have the required strength or dexterity to use this item`;
    } else {
      infoDiv.style.opacity = '1';
      infoDiv.style.filter = 'none';
      infoDiv.title = '';
    }
  },

  generateStackedDescription(system, description, statsMap, tooltipItems, dropdownId, corruptionMerged) {
    const etherealMatch = description.match(/\s*<span[^>]*>Ethereal<\/span>/i);
    const etherealText = etherealMatch ? etherealMatch[0] : '';
    let finalHtml = etherealText ? description.replace(etherealText, '') : description;

    const buttonMatch = finalHtml.match(/<button[^>]*openCorruptionModal[^>]*>.*?<\/button>/i);
    const buttonText = buttonMatch ? buttonMatch[0] : '';
    if (buttonText) finalHtml = finalHtml.replace(buttonText, '');

    const hasCorruption = !!(window.itemCorruptions && window.itemCorruptions[dropdownId]);

    const keys = Array.from(statsMap.keys());
    keys.forEach(key => {
      const data = statsMap.get(key);
      const pattern = window.StatParser.getStatPattern(key);
      if (!pattern) return;

      const formatted = window.StatParser.formatStackedStat(key, data);
      if (finalHtml.match(pattern)) {
        finalHtml = finalHtml.replace(pattern, (match) => {
          if (match.includes('stat-input')) return match;
          // Use red color if corruption is involved, otherwise blue for socketed
          const colorClass = hasCorruption ? 'corruption-enhanced-stat' : 'socket-enhanced-stat';
          return `<span class="${colorClass}">${formatted}</span>`;
        });
      } else if (key === 'corruption' && !corruptionMerged) {
        finalHtml += `<br><span class="corruption-enhanced-stat">${formatted}</span>`;
      }
    });

    if (tooltipItems.length > 0) {
      finalHtml += `<br><br><span style="color: #8888ff; font-weight: bold; text-decoration: underline;">Socketed with:</span>`;
      tooltipItems.forEach(item => {
        const color = item.usable ? '#00ff00' : '#ff5555';
        finalHtml += `<br><span style="color: ${color}; font-size: 0.9em;">- ${item.name}</span>`;
      });
    }

    if (etherealText) finalHtml += `<br>${etherealText}`;
    if (buttonText) finalHtml += `<br>${buttonText}`;

    return finalHtml;
  },

  updateStatRequirementColors(description, itemKey) {
    const item = window.getItemData ? window.getItemData(itemKey) : null;
    if (!item?.properties) return description;

    const charStr = parseInt(document.getElementById('str')?.value) || 0;
    const charDex = parseInt(document.getElementById('dex')?.value) || 0;
    const totalStr = charStr + (window.unifiedSocketSystem?.stats?.strength || 0);
    const totalDex = charDex + (window.unifiedSocketSystem?.stats?.dexterity || 0);

    let finalDesc = description;
    if (item.properties.reqstr) {
      const color = totalStr >= item.properties.reqstr ? '#00ff00' : '#ff5555';
      finalDesc = finalDesc.replace(/(?:<span[^>]*>)?Required Strength: \d+(?:<\/span>)?/gi, `<span style="color: ${color}; font-weight: bold;">Required Strength: ${item.properties.reqstr}</span>`);
    }
    if (item.properties.reqdex) {
      const color = totalDex >= item.properties.reqdex ? '#00ff00' : '#ff5555';
      finalDesc = finalDesc.replace(/(?:<span[^>]*>)?Required Dexterity: \d+(?:<\/span>)?/gi, `<span style="color: ${color}; font-weight: bold;">Required Dexterity: ${item.properties.reqdex}</span>`);
    }
    return finalDesc;
  },

  calculateActualRequiredLevel(system, section, itemKey) {
    const item = window.getItemData ? window.getItemData(itemKey) : null;
    let base = item?.properties?.reqlvl || item?.properties?.lvl || 1;
    const dropdownId = this.getSectionDropdownId(section);
    if (window.itemCorruptions?.[dropdownId]) base = Math.max(base, window.itemCorruptions[dropdownId].lvlReq || 0);
    
    document.querySelectorAll(`.socket-container[data-section="${section}"] .socket-slot.filled`).forEach(s => {
      base = Math.max(base, parseInt(s.dataset.levelReq) || 1);
    });
    return base;
  },

  isItemUsableByCharacterClass(itemKey) {
    const item = window.getItemData ? window.getItemData(itemKey) : null;
    if (!item?.properties?.class) return true;
    return item.properties.class === (document.getElementById('selectClass')?.value || 'Amazon');
  },

  doesCharacterMeetStatRequirements(itemKey) {
    const item = window.getItemData ? window.getItemData(itemKey) : null;
    if (!item?.properties) return true;
    const s = (parseInt(document.getElementById('str')?.value) || 0) + (window.unifiedSocketSystem?.stats?.strength || 0);
    const d = (parseInt(document.getElementById('dex')?.value) || 0) + (window.unifiedSocketSystem?.stats?.dexterity || 0);
    return s >= (item.properties.reqstr || 0) && d >= (item.properties.reqdex || 0);
  },

  updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  getSectionInfoId(section) {
    const map = { 'weapon': 'weapon-info', 'helm': 'helm-info', 'armor': 'armor-info', 'shield': 'off-info', 'gloves': 'glove-info', 'belts': 'belt-info', 'boots': 'boot-info', 'ringone': 'ringsone-info', 'ringtwo': 'ringstwo-info', 'amulet': 'amulet-info' };
    return map[section] || (section.startsWith('merc') ? `merc-${section.slice(4)}-info` : `${section}-info`);
  },

  getSectionDropdownId(section) {
    const map = { 'weapon': 'weapons-dropdown', 'helm': 'helms-dropdown', 'armor': 'armors-dropdown', 'shield': 'offs-dropdown', 'gloves': 'gloves-dropdown', 'belts': 'belts-dropdown', 'boots': 'boots-dropdown', 'ringone': 'ringsone-dropdown', 'ringtwo': 'ringstwo-dropdown', 'amulet': 'amulets-dropdown' };
    return map[section] || (section.startsWith('merc') ? `merc${section.slice(4)}s-dropdown` : `${section}s-dropdown`);
  },

  cleanDuplicateCorruptionText(html) {
    if (!html || !html.includes('corruption-enhanced-stat')) return html;
    let cleaned = html;
    const redPattern = /<div class="corruption-enhanced-stat">([^<]+)<\/div>/gi;
    const matches = Array.from(cleaned.matchAll(redPattern));
    const seen = new Set();
    matches.forEach(m => {
      const text = m[1].toLowerCase().trim();
      if (seen.has(text)) cleaned = cleaned.replace(m[0], '');
      else seen.add(text);
    });
    return cleaned;
  },

  addStyles() {
    // Redundant - styles are now in style.css or handled by premium themes
  },

  createSocketModal(system) {
    let modal = document.getElementById('socketModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'socketModal';
    modal.className = 'socket-modal';
    modal.innerHTML = `
      <div class="socket-modal-content diablo-theme">
        <span class="socket-close" onclick="window.unifiedSocketSystem.hideSocketModal()">&times;</span>
        <h2 id="modalTitle" style="color: #ffd700; text-align: center; margin-bottom: 15px; text-shadow: 0 0 5px #ff4500;">Insert Socket Item</h2>
        <div class="socket-categories" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 15px;">
          <button class="socket-category-tab active" onclick="window.unifiedSocketSystem.switchSocketTab('gems', this)">Gems</button>
          <button class="socket-category-tab" onclick="window.unifiedSocketSystem.switchSocketTab('runes', this)">Runes</button>
          <button class="socket-category-tab" onclick="window.unifiedSocketSystem.switchSocketTab('jewels', this)">Jewels</button>
        </div>
        <div style="margin-bottom: 15px;">
          <input type="text" id="socketSearch" placeholder="Search items..." style="width: 100%; background: rgba(0,0,0,0.6); border: 1px solid #e00808; color: #fff; padding: 10px; border-radius: 4px; font-family: inherit;">
          <button onclick="window.unifiedSocketSystem.createRainbowFacetModal()" style="width: 100%; margin-top: 5px; background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%); color: white; border: none; padding: 8px; border-radius: 4px; font-weight: bold; cursor: pointer;">[CRAFT] Rainbow Facet</button>
        </div>
        <div id="socketItemGrid" class="socket-item-grid"></div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('socketSearch')?.addEventListener('input', (e) => system.filterSocketItems(e.target.value));
  },

  handleSocketSlotClick(system, slot) {
    if (slot.classList.contains('filled')) {
      if (confirm('Remove this item from socket?')) {
        this.removeSocket(system, slot);
      }
    } else {
      system.showSocketModal(slot);
    }
  },

  removeSocket(system, slot) {
    slot.className = 'socket-slot empty';
    slot.innerHTML = '';
    ['itemKey', 'category', 'itemName', 'stats', 'levelReq'].forEach(a => delete slot.dataset[a]);
    system.updateAll();
  },

  selectSocketItem(system, category, key) {
    const item = window.UnifiedSocketData.socketData[category][key];
    if (!item || !system.currentSocket) return;
    const slot = system.currentSocket;
    slot.className = 'socket-slot filled';
    slot.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
    slot.dataset.itemKey = key;
    slot.dataset.category = category;
    slot.dataset.itemName = item.name;
    slot.dataset.levelReq = item.levelReq || 1;
    const section = slot.closest('.socket-container')?.dataset.section || 'weapon';
    slot.dataset.stats = typeof item.stats === 'object' ? (item.stats[section] || '') : item.stats;
    system.hideSocketModal();
    system.updateAll();
  },

  updateSocketVisuals(system, container, count) {
    const grid = container.querySelector('.socket-grid');
    if (!grid) return;
    grid.className = `socket-grid sockets-${count}`;
    while (grid.children.length < count) {
      const slot = document.createElement('div');
      slot.className = 'socket-slot empty';
      slot.onclick = () => this.handleSocketSlotClick(system, slot);
      grid.appendChild(slot);
    }
    while (grid.children.length > count) grid.lastChild.remove();
  }
};
