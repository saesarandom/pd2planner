function isWeaponUsable() {
  var weaponDropdown = document.getElementById('weapons-dropdown');
  if (!weaponDropdown || !weaponDropdown.value || typeof itemList === 'undefined') {
    return true; // No weapon selected, so no restrictions
  }

  var weapon = itemList[weaponDropdown.value];
  if (!weapon || !weapon.properties) {
    return true; // Invalid weapon data
  }

  // Get current character level
  var levelInput = document.getElementById('lvlValue');
  var currentLevel = parseInt(levelInput && levelInput.value ? levelInput.value : '1') || 1;

  // Check level requirement
  var requiredLevel = weapon.properties.reqlvl || 1;
  
  // Also check if there are sockets that increase the level requirement
  var actualRequiredLevel = requiredLevel;
  var sockets = document.querySelectorAll('.socket-container[data-section="weapon"] .socket-slot.filled');
  sockets.forEach(function(socket) {
    var socketLevelReq = parseInt(socket.dataset.levelReq) || 1;
    if (socketLevelReq > actualRequiredLevel) {
      actualRequiredLevel = socketLevelReq;
    }
  });

  return currentLevel >= actualRequiredLevel;
}// skills-clean-fixed.js - Fixed Skills System



class SkillSystem {
  constructor() {
    this.currentClass = 'Amazon';
    this.currentLevel = 1;
    this.maxSkillPoints = 12;
    
    this.amazonSkills = {
      'javelinandspearskillscontainer': [
        { id: 'jabcontainer', name: 'Jab', level: 1 },
        { id: 'poisonjavelincontainer', name: 'Poison Javelin', level: 1 },
        { id: 'powerstrikecontainer', name: 'Power Strike', level: 6 },
        { id: 'javelinandspearmasterycontainer', name: 'Javelin Mastery', level: 1 },
        { id: 'lightningboltcontainer', name: 'Lightning Bolt', level: 12 },
        { id: 'lightningstrikecontainer', name: 'Lightning Strike', level: 18 },
        { id: 'plaguejavelincontainer', name: 'Plague Javelin', level: 18 },
        { id: 'fendcontainer', name: 'Fend', level: 24 },
        { id: 'lightningfurycontainer', name: 'Lightning Fury', level: 30 }
      ],
      'passiveskillscontainer': [
        { id: 'innercontainer', name: 'Inner Sight', level: 1 },
        { id: 'criticalstrikecontainer', name: 'Critical Strike', level: 1 },
        { id: 'dodgecontainer', name: 'Dodge', level: 6 },
        { id: 'slowmissilecontainer', name: 'Slow Missiles', level: 12 },
        { id: 'avoidcontainer', name: 'Avoid', level: 12 },
        { id: 'penetratecontainer', name: 'Penetrate', level: 18 },
        { id: 'decoycontainer', name: 'Decoy', level: 6 },
        { id: 'evadecontainer', name: 'Evade', level: 18 },
        { id: 'valkyriecontainer', name: 'Valkyrie', level: 30 }
      ],
      'bowandcrossbowskillscontainer': [
        { id: 'magicarrowcontainer', name: 'Magic Arrow', level: 1 },
        { id: 'firearrowcontainer', name: 'Fire Arrow', level: 1 },
        { id: 'coldarrowcontainer', name: 'Cold Arrow', level: 6 },
        { id: 'multipleshotcontainer', name: 'Multiple Shot', level: 6 },
        { id: 'explodingarrowcontainer', name: 'Exploding Arrow', level: 12 },
        { id: 'icearrowcontainer', name: 'Ice Arrow', level: 12 },
        { id: 'guidedarrowcontainer', name: 'Guided Arrow', level: 18 },
        { id: 'strafecontainer', name: 'Strafe', level: 24 },
        { id: 'immolationarrowcontainer', name: 'Immolation Arrow', level: 18 },
        { id: 'freezingarrowcontainer', name: 'Freezing Arrow', level: 30 }
      ]
    };

    this.skillData = {
      jabcontainer: {
        name: "Jab", type: "physical",
        damage: { base: 30, perLevel: 20 },
        attackRating: { base: 25, perLevel: 12 },
        manaCost: { base: 1.5, perLevel: 0.2 },
        synergies: [
          { skillId: 'fendcontainer', bonusPerLevel: 18, damageType: 'physical' }
        ]
      },
      fendcontainer: {
        name: "Fend", type: "physical",
        damage: { base: 45, perLevel: 25 },
        attackRating: { base: 40, perLevel: 15 },
        manaCost: { base: 3, perLevel: 0.3 }
      },
      poisonjavelincontainer: {
        name: "Poison Javelin", type: "poison",
        poisonDamage: {
          min: [2, 4, 6, 9, 11, 13, 16, 18, 25, 32, 39, 46, 53, 60, 67, 74, 88, 102, 116, 131],
          max: [5, 7, 10, 12, 15, 17, 19, 22, 29, 37, 44, 51, 58, 66, 73, 80, 95, 110, 124, 139]
        },
        manaCost: { base: 2, perLevel: 0.25 },
        synergies: [
          { skillId: 'plaguejavelincontainer', bonusPerLevel: 24, damageType: 'poison' },
          { skillId: 'javelinandspearmasterycontainer', bonusPerLevel: 24, damageType: 'poison' }
        ]
      },
      powerstrikecontainer: {
        name: "Power Strike", type: "lightning",
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [1, 4, 7, 10, 13, 16, 19, 22, 27, 32, 37, 42, 47, 52, 57, 62, 75, 88, 101, 114, 127, 140, 162, 184, 206, 228, 250, 272, 304, 336, 368, 400, 432, 464, 496, 528, 560, 592, 624, 656, 688, 720, 752, 784, 816, 848, 880, 912, 944, 976, 1008, 1040, 1072, 1104, 1136, 1168, 1200, 1232, 1264, 1296]
        },
        novaDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [3, 7, 11, 15, 19, 23, 27, 31, 39, 47, 55, 63, 71, 79, 87, 95, 123, 151, 179, 207, 235, 263, 308, 353, 398, 443, 488, 533, 595, 657, 719, 781, 843, 905, 967, 1029, 1091, 1153, 1215, 1277, 1339, 1401, 1463, 1525, 1587, 1649, 1711, 1773, 1835, 1897, 1959, 2021, 2083, 2145, 2207, 2269, 2331, 2393, 2455, 2517]
        },
        attackRating: { base: 20, perLevel: 12 },
        manaCost: [2, 2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5, 5.1, 5.3, 5.5, 5.7, 5.9, 6.1, 6.3, 6.5, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.1, 8.3, 8.5, 8.7, 8.9, 9.1, 9.3, 9.5, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1, 12.3, 12.5, 12.6, 12.8, 13],
        synergies: [
          { skillId: 'lightningstrikecontainer', bonusPerLevel: 20, damageType: 'lightning' },
          { skillId: 'lightningstrikecontainer', bonusPerLevel: 20, damageType: 'nova' },
          { skillId: 'lightningboltcontainer', bonusPerLevel: 20, damageType: 'lightning' },
          { skillId: 'lightningboltcontainer', bonusPerLevel: 20, damageType: 'nova' }
        ]
      },
      lightningstrikecontainer: {
        name: "Lightning Strike", type: "placeholder"
      },
      lightningboltcontainer: {
        name: "Lightning Bolt", type: "placeholder"
      },
      plaguejavelincontainer: {
        name: "Plague Javelin", type: "placeholder"
      },
      javelinandspearmasterycontainer: {
        name: "Javelin and Spear Mastery", type: "passive",
        damage: [40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925],
        criticalStrike: [5, 9, 12, 15, 17, 19, 20, 21, 23, 23, 24, 25, 26, 26, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35]
      }
    };

    this.init();
  }

  init() {
    this.createContainers();
    this.populateSkills();
    this.setupEvents();
    this.createPointsDisplay();
    this.createSkillCalculator();
    this.updateSkillMaxValues();  // Set initial max values based on starting level
    //('✅ Skills System ready');
  }

  createContainers() {
  var positions = [
    { id: 'javelinandspearskillscontainer', title: 'Javelin & Spear' },
    { id: 'passiveskillscontainer', title: 'Passive & Magic' },
    { id: 'bowandcrossbowskillscontainer', title: 'Bow & Crossbow' }
  ];

  for (var i = 0; i < positions.length; i++) {
    var pos = positions[i];
    var container = document.getElementById(pos.id);
    if (!container) {
      container = document.createElement('div');
      container.id = pos.id;
      container.className = 'skill-tree-container';
      
      var title = document.createElement('h3');
      title.textContent = pos.title;
      
      container.appendChild(title);
      document.body.appendChild(container);
      
      //('Created container:', pos.id);
    } else {
      container.className = 'skill-tree-container';
      //('Updated existing container:', pos.id);
    }
  }
}

  populateSkills() {
    var self = this;
    Object.keys(this.amazonSkills).forEach(function(containerId) {
      var skills = self.amazonSkills[containerId];
      var container = document.getElementById(containerId);
      if (!container) return;

      for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        var skillDiv = document.createElement('div');
        skillDiv.style.display = 'flex';
        skillDiv.style.alignItems = 'center';
        skillDiv.style.margin = '3px 0';
        skillDiv.style.padding = '4px';
        skillDiv.style.background = 'rgba(0,0,0,0.4)';
        skillDiv.style.borderRadius = '3px';
        skillDiv.style.border = '1px solid #444';

        var label = document.createElement('label');
        label.textContent = skill.name;
        label.style.flex = '1';
        label.style.color = 'white';
        label.style.marginRight = '8px';
        label.style.fontSize = '12px';

        if (skill.level > 1) {
          var levelSpan = document.createElement('span');
          levelSpan.textContent = ' (' + skill.level + ')';
          levelSpan.style.color = '#888';
          levelSpan.style.fontSize = '11px';
          label.appendChild(levelSpan);
        }

        var input = document.createElement('input');
        input.type = 'number';
        input.id = skill.id;
        input.min = 0;
        input.max = 20;
        input.value = 0;
        input.setAttribute('data-skill-level', skill.level);
        input.style.width = '45px';
        input.style.padding = '3px';
        input.style.border = '1px solid #666';
        input.style.background = '#333';
        input.style.color = 'white';
        input.style.borderRadius = '3px';
        input.style.textAlign = 'center';
        input.style.fontSize = '12px';

        skillDiv.appendChild(label);
        skillDiv.appendChild(input);
        container.appendChild(skillDiv);
      }
    });
  }

  createSkillCalculator() {
  var calcContainer = document.createElement('div');
  calcContainer.id = 'skill-calculator-container';
  calcContainer.className = 'skill-calculator-container';

  calcContainer.innerHTML = '<h5>Active Skill</h5>' +
    '<select id="active-skill-dropdown">' +
    '<option value="">Select Active Skill...</option></select>';

  var damageDisplay = document.createElement('div');
  damageDisplay.id = 'skill-damage-display';
  damageDisplay.className = 'skill-damage-display';

  damageDisplay.innerHTML = '<h5>Damage</h5>' +
    '<div id="damage-results">Select a skill to see damage calculations</div>';

  document.body.appendChild(calcContainer);
  document.body.appendChild(damageDisplay);
  
  //('Created skill calculator at top: 1350px');
}

  setupEvents() {
    var self = this;

    // Level changes
    var levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', function(e) {
        self.currentLevel = parseInt(e.target.value) || 1;
        self.maxSkillPoints = self.currentLevel + 11;
        self.updateSkillMaxValues();  // Update all skill input max attributes immediately
        self.validateAllSkillInputs(); // Validate and adjust existing values if needed
        self.updatePointsDisplay();
        self.scheduleCalculation();
      });
    }

    // Character stat changes (str, dex, vit, enr)
    var statInputs = ['str', 'dex', 'vit', 'enr'];
    for (var i = 0; i < statInputs.length; i++) {
      var statInput = document.getElementById(statInputs[i]);
      if (statInput) {
        statInput.addEventListener('input', function() {
          self.scheduleCalculation();
        });
      }
    }

    // Skill input changes
    document.addEventListener('input', function(e) {
      if (e.target && e.target.matches && e.target.matches('[id$="container"] input[type="number"]')) {
        self.handleSkillInput(e.target);
        setTimeout(function() { self.updateSkillDropdown(); }, 100);
        self.scheduleCalculation();
      }
    });

    // Keydown restriction
    document.addEventListener('keydown', function(e) {
      if (e.target && e.target.matches && e.target.matches('[id$="container"] input[type="number"]')) {
        self.restrictInput(e);
      }
    });

    // Dropdown changes
    document.addEventListener('change', function(e) {
      if (e.target && e.target.id === 'active-skill-dropdown') {
        self.calculateSkillDamage();
      }
      if (e.target && e.target.id === 'weapons-dropdown') {
        self.scheduleCalculation();
      }
      // Equipment dropdowns that affect damage
      var equipmentDropdowns = ['helms-dropdown', 'armors-dropdown', 'gloves-dropdown', 'belts-dropdown', 'boots-dropdown', 'ringsone-dropdown', 'ringstwo-dropdown', 'amulets-dropdown', 'offs-dropdown'];
      if (e.target && equipmentDropdowns.indexOf(e.target.id) !== -1) {
        self.scheduleCalculation();
      }
    });

    // Socket changes (if you have socket system)
    document.addEventListener('click', function(e) {
      if (e.target && (e.target.classList.contains('socket-slot') || e.target.classList.contains('socket-item'))) {
        self.scheduleCalculation();
      }
    });

    setTimeout(function() { self.updateSkillDropdown(); }, 500);
  }

  // Lightweight calculation scheduler to avoid spam
  scheduleCalculation() {
    var self = this;
    if (self.calculationTimer) {
      clearTimeout(self.calculationTimer);
    }
    self.calculationTimer = setTimeout(function() {
      self.calculateSkillDamage();
    }, 150);
  }

  updateSkillDropdown() {
    var dropdown = document.getElementById('active-skill-dropdown');
    if (!dropdown) return;

    var currentValue = dropdown.value;
    dropdown.innerHTML = '<option value="">Select Active Skill...</option>';

    var self = this;
    Object.keys(this.skillData).forEach(function(skillId) {
      var skillInput = document.getElementById(skillId);
      if (skillInput && parseInt(skillInput.value) > 0) {
        var skill = self.skillData[skillId];
        var option = document.createElement('option');
        option.value = skillId;
        option.textContent = skill.name + ' (' + skillInput.value + ')';
        dropdown.appendChild(option);
      }
    });

    if (currentValue && dropdown.querySelector('option[value="' + currentValue + '"]')) {
      dropdown.value = currentValue;
    }
  }

  calculateSkillDamage() {
    var dropdown = document.getElementById('active-skill-dropdown');
  var display = document.getElementById('damage-results');
  
  if (!dropdown || !display || !dropdown.value) {
    if (display) display.innerHTML = 'Select a skill to see damage calculations';
    return;
  }

  var skillId = dropdown.value;
  var skill = this.skillData[skillId];
  var skillInput = document.getElementById(skillId);
  var skillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;

  if (skillLevel === 0) {
    display.innerHTML = 'No points invested in this skill';
    return;
  }

  var dexInput = document.getElementById('dex');
  var dexterity = parseInt(dexInput && dexInput.value ? dexInput.value : '0') || 0;

  var weaponDamage = this.getWeaponDamage();
  
  var html = '<div style="margin-bottom: 10px;"><strong>' + skill.name + ' (Level ' + skillLevel + ')</strong></div>';

  // Check if weapon is usable before showing damage calculations
  var weaponUsable = isWeaponUsable();

  if (skill.type === 'physical') {
    var damageInfo = this.calculatePhysicalDamage(skill, skillLevel, weaponDamage, dexterity, skillId);

    html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

    // Display Attack Rating if available
    if (skill.attackRating) {
      var attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (skillLevel - 1));
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
    }

    html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
    html += '<div style="margin: 5px 0;">Skill Bonus: +' + damageInfo.skillBonus + '%</div>';
    if (damageInfo.synergyBonus > 0) {
      html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
    }
    if (damageInfo.masteryDamageBonus > 0) {
      html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + damageInfo.masteryDamageBonus + '%</div>';
    }

    // Show elemental damages if they exist
    var elem = damageInfo.elementalDamages;
    if (elem.fire.max > 0) {
      html += '<div style="margin: 5px 0; color: #ff6600;">Fire: ' + elem.fire.min + '-' + elem.fire.max + '</div>';
    }
    if (elem.cold.max > 0) {
      html += '<div style="margin: 5px 0; color: #6699ff;">Cold: ' + elem.cold.min + '-' + elem.cold.max + '</div>';
    }
    if (elem.lightning.max > 0) {
      html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + elem.lightning.min + '-' + elem.lightning.max + '</div>';
    }
    if (elem.poison.max > 0) {
      html += '<div style="margin: 5px 0; color: #00ff00;">Poison: ' + elem.poison.min + '-' + elem.poison.max + '/sec</div>';
    }
    
    // Only show Physical, Total, and Average damage if weapon is usable
    if (weaponUsable) {
      html += '<div style="margin: 5px 0; color: #ffaa00;">Physical: ' + damageInfo.physicalMin + '-' + damageInfo.physicalMax + '</div>';
      html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total: ' + damageInfo.min + '-' + damageInfo.max + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';
    } else {
      html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level requirement not met</div>';
    }
    
    var combinedCriticalStrike = damageInfo.criticalStrike + damageInfo.weaponMastery;
  if (combinedCriticalStrike > 0) {
    html += '<div style="margin: 5px 0; font-size: 12px;">Critical Strike: ' + combinedCriticalStrike + '%</div>';
  }
    if (damageInfo.deadlyStrike > 0) {
      html += '<div style="margin: 5px 0; font-size: 12px;">Deadly Strike: ' + damageInfo.deadlyStrike + '%</div>';
    }
  } else if (skill.type === 'poison') {
    var damageInfo = this.calculatePoisonDamage(skill, skillLevel, skillId);
    html += '<div style="margin: 5px 0; color: #00ff00;">Poison: ' + damageInfo.min + '-' + damageInfo.max + ' over 4s</div>';
    html += '<div style="margin: 5px 0;">Per Second: ' + damageInfo.average + '</div>';
    if (damageInfo.synergyBonus > 0) {
      html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
    }
  } else if (skill.type === 'lightning') {
    var damageInfo = this.calculateElementalDamage(skill, skillLevel, skillId);

    // Display Attack Rating if available
    if (skill.attackRating) {
      var attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (skillLevel - 1));
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
    }

    // Display physical damage bonus from mastery (for javelin skills like Power Strike)
    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();
    if (masteryDamageBonus > 0) {
      html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + masteryDamageBonus + '%</div>';
    }

    html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + damageInfo.lightningMin + '-' + damageInfo.lightningMax + '</div>';
    html += '<div style="margin: 5px 0; color: #ffff00;">Nova: ' + damageInfo.novaMin + '-' + damageInfo.novaMax + '</div>';
    html += '<div style="margin: 5px 0;">Average Lightning: ' + damageInfo.averageLightning + '</div>';
    html += '<div style="margin: 5px 0;">Average Nova: ' + damageInfo.averageNova + '</div>';
    if (damageInfo.synergyBonus > 0) {
      html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
    }
  }
  
  if (damageInfo && damageInfo.critMultiplier > 1) {
    html += '<div style="margin: 5px 0; font-size: 12px;">Crit Multiplier: ' + damageInfo.critMultiplier + 'x</div>';
  }
  
  display.innerHTML = html;
}

  getWeaponDamage() {
    var weaponDropdown = document.getElementById('weapons-dropdown');
    if (!weaponDropdown || !weaponDropdown.value || typeof itemList === 'undefined') {
      return { min: 1, max: 2 };
    }

    var weapon = itemList[weaponDropdown.value];
    if (!weapon || !weapon.properties) {
      return { min: 1, max: 2 };
    }

    var min = weapon.properties.onehandmin || weapon.properties.twohandmin || 1;
    var max = weapon.properties.onehandmax || weapon.properties.twohandmax || 2;

    return { min: min, max: max };
  }

 calculatePhysicalDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
  // Base skill damage bonus (just from the skill itself)
  var skillDamageBonus = skill.damage.base + (skill.damage.perLevel * (skillLevel - 1));

  // Get synergy bonus separately
  var synergyBonus = this.calculateSynergyBonus(skillId, 'physical');

  // Get mastery damage bonus (applies to all javelin/spear skills)
  var masteryDamageBonus = this.getWeaponMasteryDamageBonus();

  // Calculate total damage bonus (all bonuses are additive)
  var totalDamageBonus = skillDamageBonus + synergyBonus + masteryDamageBonus;

  // Dexterity bonus for Amazon (applies to damage directly)
  var statBonus = Math.floor(dexterity * 1);

  // Get weapon elemental damages
  var elementalDamages = this.getWeaponElementalDamages();

  // Calculate base physical damage with all bonuses
  var baseMinDamage = Math.floor((weaponDamage.min) * (1 + totalDamageBonus / 100 + statBonus / 100));
  var baseMaxDamage = Math.floor((weaponDamage.max) * (1 + totalDamageBonus / 100 + statBonus / 100));

  // Get individual critical chances (each capped at 75%)
  var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
  var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
  var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);



  // NEW CRIT SYSTEM: Calculate total crit chance using multiplicative formula
  // Total Crit Chance = 1 - ((1 - DS) * (1 - CS) * (1 - WM))
  var totalCritChance = 1 - ((1 - deadlyStrike/100) * (1 - criticalStrike/100) * (1 - weaponMastery/100));

  // Round down to nearest percent
  totalCritChance = Math.floor(totalCritChance * 100);

  // Cap at 95% maximum
  totalCritChance = Math.min(totalCritChance, 95);

  // NEW CRIT MULTIPLIER: All crits now multiply by 1.5x instead of 2x
  var critMultiplier = 1 + (totalCritChance / 100) * 0.5; // 50% more damage on crit

  // Apply crit multiplier to physical damage only
  var physicalMinWithCrits = Math.floor(baseMinDamage * critMultiplier);
  var physicalMaxWithCrits = Math.floor(baseMaxDamage * critMultiplier);

  // Add elemental damages (these don't get crit multiplier)
  var totalMinDamage = physicalMinWithCrits + elementalDamages.fire.min + elementalDamages.cold.min + elementalDamages.lightning.min + elementalDamages.poison.min;
  var totalMaxDamage = physicalMaxWithCrits + elementalDamages.fire.max + elementalDamages.cold.max + elementalDamages.lightning.max + elementalDamages.poison.max;

  // Calculate average
  var avgPhysicalDamage = (baseMinDamage + baseMaxDamage) / 2;
  var avgPhysicalWithCrits = Math.floor(avgPhysicalDamage * critMultiplier);

  // Total average includes elemental (which doesn't crit)
  var avgElemental = (elementalDamages.fire.min + elementalDamages.fire.max +
                     elementalDamages.cold.min + elementalDamages.cold.max +
                     elementalDamages.lightning.min + elementalDamages.lightning.max +
                     elementalDamages.poison.min + elementalDamages.poison.max) / 2;

  var totalAvgDamage = avgPhysicalWithCrits + avgElemental;

  return {
    min: totalMinDamage,
    max: totalMaxDamage,
    average: Math.floor((totalMinDamage + totalMaxDamage) / 2),
    skillBonus: skillDamageBonus,
    synergyBonus: synergyBonus,
    masteryDamageBonus: masteryDamageBonus,
    statBonus: statBonus,
    elementalDamages: elementalDamages,
    criticalStrike: criticalStrike,
    deadlyStrike: deadlyStrike,
    weaponMastery: weaponMastery,
    totalCritChance: totalCritChance, // Show the combined crit chance
    critMultiplier: critMultiplier.toFixed(2),
    physicalMin: physicalMinWithCrits,
    physicalMax: physicalMaxWithCrits


  };

}






getWeaponMasteryChance() {
  // Check for weapon mastery from javelin mastery
  var masteryInput = document.getElementById('javelinandspearmasterycontainer');
  if (!masteryInput || parseInt(masteryInput.value) === 0) return 0;

  var level = parseInt(masteryInput.value);
  var masteryData = this.skillData.javelinandspearmasterycontainer;
  if (masteryData && masteryData.criticalStrike) {
    var levelIndex = Math.min(level - 1, masteryData.criticalStrike.length - 1);
    return masteryData.criticalStrike[levelIndex] || 0;
  }
  return 0;
}

getWeaponMasteryDamageBonus() {
  // Check for weapon mastery from javelin mastery
  var masteryInput = document.getElementById('javelinandspearmasterycontainer');
  if (!masteryInput || parseInt(masteryInput.value) === 0) return 0;

  var level = parseInt(masteryInput.value);
  var masteryData = this.skillData.javelinandspearmasterycontainer;
  if (masteryData && masteryData.damage) {
    var levelIndex = Math.min(level - 1, masteryData.damage.length - 1);
    return masteryData.damage[levelIndex] || 0;
  }
  return 0;
}

  getWeaponElementalDamages() {
  var elementalDamages = {
    fire: { min: 0, max: 0 },
    cold: { min: 0, max: 0 },
    lightning: { min: 0, max: 0 },
    poison: { min: 0, max: 0 }
  };
  
  // Fire damage
  var fireMinContainer = document.getElementById('flatfiremincontainer');
  var fireMaxContainer = document.getElementById('flatfiremaxcontainer');
  if (fireMinContainer && fireMaxContainer) {
    elementalDamages.fire.min = parseInt(fireMinContainer.textContent) || 0;
    elementalDamages.fire.max = parseInt(fireMaxContainer.textContent) || 0;
  }
  
  // Cold damage
  var coldMinContainer = document.getElementById('flatcoldmincontainer');
  var coldMaxContainer = document.getElementById('flatcoldmaxcontainer');
  if (coldMinContainer && coldMaxContainer) {
    elementalDamages.cold.min = parseInt(coldMinContainer.textContent) || 0;
    elementalDamages.cold.max = parseInt(coldMaxContainer.textContent) || 0;
  }
  
  // Lightning damage (assuming similar pattern)
  var lightningMinContainer = document.getElementById('flatlightmincontainer');
  var lightningMaxContainer = document.getElementById('flatlightmaxcontainer');
  if (lightningMinContainer && lightningMaxContainer) {
    elementalDamages.lightning.min = parseInt(lightningMinContainer.textContent) || 0;
    elementalDamages.lightning.max = parseInt(lightningMaxContainer.textContent) || 0;
  }
  
  // Poison damage (assuming similar pattern)
  var poisonMinContainer = document.getElementById('flatpoisonmincontainer');
  var poisonMaxContainer = document.getElementById('flatpoisonmaxcontainer');
  if (poisonMinContainer && poisonMaxContainer) {
    elementalDamages.poison.min = parseInt(poisonMinContainer.textContent) || 0;
    elementalDamages.poison.max = parseInt(poisonMaxContainer.textContent) || 0;
  }

  //('Elemental damages from stats calculator:', elementalDamages);
  return elementalDamages;
}


 getCriticalStrikeChance() {
  var criticalInput = document.getElementById('criticalstrikecontainer');
  if (!criticalInput || parseInt(criticalInput.value) === 0) return 0;

  var level = parseInt(criticalInput.value);
  // Critical Strike chance formula: 15% + 3% per level, max 75%
  return Math.min(15 + (level * 3), 75);
}

getDeadlyStrikeChance() {
  // Check weapon for deadly strike
  var weaponDropdown = document.getElementById('weapons-dropdown');
  var deadlyStrike = 0;
  
  if (weaponDropdown && weaponDropdown.value && typeof itemList !== 'undefined') {
    var weapon = itemList[weaponDropdown.value];
    if (weapon && weapon.description) {
      var deadlyMatch = weapon.description.match(/(\d+)% Deadly Strike/i);
      if (deadlyMatch) {
        deadlyStrike += parseInt(deadlyMatch[1]);
      }
    }
  }

  // FIXED: Return deadlyStrike, not weaponMastery
  return Math.min(deadlyStrike, 75); // Cap at 75%
}



  calculatePoisonDamage(skill, skillLevel, skillId) {
    var levelIndex = Math.min(skillLevel - 1, skill.poisonDamage.min.length - 1);
    var baseMin = skill.poisonDamage.min[levelIndex] || 0;
    var baseMax = skill.poisonDamage.max[levelIndex] || 0;

    // Calculate synergy bonus
    var synergyBonus = this.calculateSynergyBonus(skillId, 'poison');

    // Apply synergy bonus as percentage increase
    var min = Math.floor(baseMin * (1 + synergyBonus / 100));
    var max = Math.floor(baseMax * (1 + synergyBonus / 100));

    return {
      min: min,
      max: max,
      average: Math.floor((min + max) / 8),
      synergyBonus: synergyBonus
    };
  }

  calculateElementalDamage(skill, skillLevel, skillId) {
    // Get base damages from tables
    var levelIndex = Math.min(skillLevel - 1, 59);
    var baseLightningMin = skill.lightningDamage.min[levelIndex] || 1;
    var baseLightningMax = skill.lightningDamage.max[levelIndex] || 1;
    var baseNovaMin = skill.novaDamage.min[levelIndex] || 1;
    var baseNovaMax = skill.novaDamage.max[levelIndex] || 1;

    // Calculate synergy bonuses (separate for lightning and nova)
    var lightningSynergyBonus = this.calculateSynergyBonus(skillId, 'lightning');
    var novaSynergyBonus = this.calculateSynergyBonus(skillId, 'nova');

    // Apply synergies
    var lightningMin = Math.floor(baseLightningMin * (1 + lightningSynergyBonus / 100));
    var lightningMax = Math.floor(baseLightningMax * (1 + lightningSynergyBonus / 100));
    var novaMin = Math.floor(baseNovaMin * (1 + novaSynergyBonus / 100));
    var novaMax = Math.floor(baseNovaMax * (1 + novaSynergyBonus / 100));

    return {
      lightningMin: lightningMin,
      lightningMax: lightningMax,
      novaMin: novaMin,
      novaMax: novaMax,
      averageLightning: Math.floor((lightningMin + lightningMax) / 2),
      averageNova: Math.floor((novaMin + novaMax) / 2),
      synergyBonus: Math.max(lightningSynergyBonus, novaSynergyBonus)
    };
  }

  restrictInput(e) {
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].indexOf(e.key) !== -1) {
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    var input = e.target;
    var currentValue = parseInt(input.value) || 0;
    var newValue = parseInt(input.value + e.key);
    var skillLevel = parseInt(input.getAttribute('data-skill-level')) || 1;
    var maxAllowed = this.getMaxAllowed(skillLevel);
    
    if (newValue > maxAllowed) {
      e.preventDefault();
      return;
    }

    var totalUsed = this.getTotalUsed();
    var remainingPoints = this.maxSkillPoints - totalUsed + currentValue;
    
    if (newValue > remainingPoints) {
      e.preventDefault();
      return;
    }
  }

  handleSkillInput(input) {
    var newValue = parseInt(input.value) || 0;
    var skillLevel = parseInt(input.getAttribute('data-skill-level')) || 1;
    var maxAllowed = this.getMaxAllowed(skillLevel);

    // Enforce absolute maximum of 20 points per skill
    if (newValue > 20) {
      input.value = 20;
      this.showWarning('Maximum 20 points per skill');
      newValue = 20;
    }

    // Enforce character level-based maximum
    if (newValue > maxAllowed) {
      input.value = maxAllowed;
      this.showWarning('Max ' + maxAllowed + ' points at level ' + this.currentLevel);
      return;
    }

    // Enforce total skill points available
    var totalUsed = this.getTotalUsed();
    if (totalUsed > this.maxSkillPoints) {
      var excess = totalUsed - this.maxSkillPoints;
      input.value = Math.max(0, newValue - excess);
      this.showWarning('Only ' + this.maxSkillPoints + ' total points available');
    }

    this.updatePointsDisplay();
  }

  getMaxAllowed(skillLevel) {
    if (this.currentLevel < skillLevel) return 0;
    return skillLevel === 1 ? this.currentLevel : this.currentLevel - skillLevel + 1;
  }

  getTotalUsed() {
    var inputs = document.querySelectorAll('[id$="container"] input[type="number"]');
    var total = 0;
    for (var i = 0; i < inputs.length; i++) {
      total += parseInt(inputs[i].value) || 0;
    }
    return total;
  }

 createPointsDisplay() {
  var display = document.createElement('div');
  display.id = 'skill-points-display';
  display.className = 'skill-points-display';
  
  document.body.appendChild(display);
  this.updatePointsDisplay();
}

  updateSkillMaxValues() {
    // Update max attribute on all skill container inputs based on character level
    var inputs = document.querySelectorAll('[id$="container"] input[type="number"]');
    var self = this;

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var skillLevel = parseInt(input.getAttribute('data-skill-level')) || 1;
      var maxAllowed = this.getMaxAllowed(skillLevel);
      input.max = maxAllowed;  // Update the HTML max attribute for instant visual feedback
    }
  }

  validateAllSkillInputs() {
    // Check all skill inputs and adjust values if they exceed the new maximum
    var inputs = document.querySelectorAll('[id$="container"] input[type="number"]');
    var self = this;
    var anyChanged = false;

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var currentValue = parseInt(input.value) || 0;
      var skillLevel = parseInt(input.getAttribute('data-skill-level')) || 1;
      var maxAllowed = this.getMaxAllowed(skillLevel);

      // If value exceeds new max, reduce it
      if (currentValue > maxAllowed) {
        input.value = maxAllowed;
        anyChanged = true;
      }
    }

    // No need to call handleSkillInput - updatePointsDisplay is already called in setupEvents
  }

  updatePointsDisplay() {
    var display = document.getElementById('skill-points-display');
    if (!display) return;

    var used = this.getTotalUsed();
    var remaining = this.maxSkillPoints - used;
    var color = remaining <= 0 ? '#ff4444' : remaining <= 5 ? '#ffaa00' : '#00ff00';

    display.innerHTML = '<div style="font-weight: bold; margin-bottom: 8px;">Skill Points</div>' +
      '<div>Used: ' + used + '</div>' +
      '<div style="color: ' + color + '">Remaining: ' + remaining + '</div>' +
      '<div style="border-top: 1px solid #666; margin-top: 5px; padding-top: 5px;">Total: ' + this.maxSkillPoints + '</div>';
  }

  showWarning(message) {
    var warning = document.getElementById('skill-warning');
    if (!warning) {
      warning = document.createElement('div');
      warning.id = 'skill-warning';
      warning.style.position = 'fixed';
      warning.style.top = '80px';
      warning.style.right = '20px';
      warning.style.background = '#ff4444';
      warning.style.color = 'white';
      warning.style.padding = '12px';
      warning.style.borderRadius = '6px';
      warning.style.zIndex = '20000';
      warning.style.maxWidth = '300px';
      warning.style.fontWeight = 'bold';
      document.body.appendChild(warning);
    }

    warning.textContent = message;
    warning.style.display = 'block';
    setTimeout(function() { warning.style.display = 'none'; }, 3000);
  }

  getSkillValue(skillId) {
    var input = document.getElementById(skillId);
    return input ? parseInt(input.value) || 0 : 0;
  }

  setSkillValue(skillId, value) {
    var input = document.getElementById(skillId);
    if (input) {
      input.value = value;
      this.updatePointsDisplay();
    }
  }

  // Calculate synergy bonus for a skill
  calculateSynergyBonus(skillId, damageType) {
    var skill = this.skillData[skillId];
    if (!skill || !skill.synergies) {
      return 0;
    }

    var totalBonus = 0;
    for (var i = 0; i < skill.synergies.length; i++) {
      var synergy = skill.synergies[i];
      // Only apply synergies that match the damage type
      if (synergy.damageType === damageType) {
        var synergySkillLevel = this.getSkillValue(synergy.skillId);
        totalBonus += synergySkillLevel * synergy.bonusPerLevel;
      }
    }

    return totalBonus;
  }




}

// Initialize
var skillSystemInstance;

function initSkillSystem() {
  if (!skillSystemInstance) {
    skillSystemInstance = new SkillSystem();
    window.skillSystem = skillSystemInstance;
  }
}

window.testSkillSystem = function() {
  //('🧪 Testing...');
  if (skillSystemInstance) {
    //('✅ Skills working:', skillSystemInstance.getTotalUsed(), 'points used');
  } else {
    //('❌ Not initialized');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initSkillSystem, 100);
  });
} else {
  setTimeout(initSkillSystem, 100);
}



window.initSkillSystem = initSkillSystem;
