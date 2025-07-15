// skills-clean-fixed.js - Fixed Skills System

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
        manaCost: { base: 1.5, perLevel: 0.2 }
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
        manaCost: { base: 2, perLevel: 0.25 }
      },
      powerstrikecontainer: {
        name: "Power Strike", type: "lightning",
        lightningDamage: { base: 1, perLevel: 8 },
        manaCost: { base: 2, perLevel: 0.2 }
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
    console.log('✅ Skills System ready');
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
      
      console.log('Created container:', pos.id);
    } else {
      container.className = 'skill-tree-container';
      console.log('Updated existing container:', pos.id);
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
  
  console.log('Created skill calculator at top: 1350px');
}

  setupEvents() {
    var self = this;
    
    // Level changes
    var levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', function(e) {
        self.currentLevel = parseInt(e.target.value) || 1;
        self.maxSkillPoints = self.currentLevel + 11;
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

    if (skill.type === 'physical') {
      var damageInfo = this.calculatePhysicalDamage(skill, skillLevel, weaponDamage, dexterity);
      
      html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';
      html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
      html += '<div style="margin: 5px 0;">Skill Bonus: +' + damageInfo.skillBonus + '%</div>';
      
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
      
      html += '<div style="margin: 5px 0; color: #ffaa00;">Physical: ' + damageInfo.physicalMin + '-' + damageInfo.physicalMax + '</div>';
      html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total: ' + damageInfo.min + '-' + damageInfo.max + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';
      
      if (damageInfo.criticalStrike > 0) {
        html += '<div style="margin: 5px 0; font-size: 12px;">Critical Strike: ' + damageInfo.criticalStrike + '%</div>';
      }
      if (damageInfo.deadlyStrike > 0) {
        html += '<div style="margin: 5px 0; font-size: 12px;">Deadly Strike: ' + damageInfo.deadlyStrike + '%</div>';
      }
    } else if (skill.type === 'poison') {
      var damageInfo = this.calculatePoisonDamage(skill, skillLevel);
      html += '<div style="margin: 5px 0; color: #00ff00;">Poison: ' + damageInfo.min + '-' + damageInfo.max + ' over 4s</div>';
      html += '<div style="margin: 5px 0;">Per Second: ' + damageInfo.average + '</div>';
    } else if (skill.type === 'lightning') {
      var damageInfo = this.calculateElementalDamage(skill, skillLevel);
      html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: 1-' + damageInfo.max + '</div>';
      html += '<div style="margin: 5px 0;">Average: ' + damageInfo.average + '</div>';
    }
    if (damageInfo.critMultiplier > 1) {
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

  calculatePhysicalDamage(skill, skillLevel, weaponDamage, dexterity) {
  // Base skill damage bonus
  var skillDamageBonus = skill.damage.base + (skill.damage.perLevel * (skillLevel - 1));
  
  // Dexterity bonus for Amazon (applies to damage directly)
  var statBonus = Math.floor(dexterity * 1);
  
  // Get weapon elemental damages
  var elementalDamages = this.getWeaponElementalDamages();
  
  // Calculate base physical damage with stat and skill bonuses
  var baseMinDamage = Math.floor((weaponDamage.min) * (1 + skillDamageBonus / 100 + statBonus / 100));
  var baseMaxDamage = Math.floor((weaponDamage.max) * (1 + skillDamageBonus / 100 + statBonus / 100));
  
  // Add elemental damages (these don't get multiplied by skill bonus, just added)
  var totalMinDamage = baseMinDamage + elementalDamages.fire.min + elementalDamages.cold.min + elementalDamages.lightning.min + elementalDamages.poison.min;
  var totalMaxDamage = baseMaxDamage + elementalDamages.fire.max + elementalDamages.cold.max + elementalDamages.lightning.max + elementalDamages.poison.max;
  
  // Get critical strike, deadly strike, and weapon mastery chances
  var criticalStrike = this.getCriticalStrikeChance();
  var deadlyStrike = this.getDeadlyStrikeChance();
  var weaponMastery = this.getWeaponMasteryChance();
  
  // Calculate proper critical hit multiplier
  var combinedCritChance = 1 - ((1 - criticalStrike/100) * (1 - deadlyStrike/100) * (1 - weaponMastery/100));
  var critMultiplier = 1 + (combinedCritChance * 0.5); // 50% more damage on crit
  
  // Apply crit multiplier directly to physical damage
  var physicalMinWithCrits = Math.floor(baseMinDamage * critMultiplier);
  var physicalMaxWithCrits = Math.floor(baseMaxDamage * critMultiplier);
  
  // Add elemental damages (these don't get crit multiplier)
  var totalMinDamage = physicalMinWithCrits + elementalDamages.fire.min + elementalDamages.cold.min + elementalDamages.lightning.min + elementalDamages.poison.min;
  var totalMaxDamage = physicalMaxWithCrits + elementalDamages.fire.max + elementalDamages.cold.max + elementalDamages.lightning.max + elementalDamages.poison.max;
  
  // Apply crit multiplier to physical damage only
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
    statBonus: statBonus,
    elementalDamages: elementalDamages,
    criticalStrike: criticalStrike,
    deadlyStrike: deadlyStrike,
    weaponMastery: weaponMastery,
    critMultiplier: critMultiplier.toFixed(2),
    physicalMin: physicalMinWithCrits,  // Now shows physical damage WITH crit multiplier
    physicalMax: physicalMaxWithCrits   // Now shows physical damage WITH crit multiplier
  };
}

getWeaponMasteryChance() {
  // Check for weapon mastery skill (javelin mastery, etc.)
  var masteryInput = document.getElementById('javelinandspearmasterycontainer');
  if (!masteryInput || parseInt(masteryInput.value) === 0) return 0;

  var level = parseInt(masteryInput.value);
  // Weapon mastery gives critical hit chance - adjust formula as needed
  return Math.min(5 + (level * 2), 50); // Example: 5% + 2% per level, max 50%
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

  console.log('Elemental damages from stats calculator:', elementalDamages);
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
    
    // Check for deadly strike from javelin mastery
    var masteryInput = document.getElementById('javelinandspearmasterycontainer');
    if (masteryInput && parseInt(masteryInput.value) > 0) {
      var level = parseInt(masteryInput.value);
      deadlyStrike += Math.min(5 + (level * 2), 50); // 5% + 2% per level, max 50%
    }

    return Math.min(deadlyStrike, 95); // Cap at 95%
  }

  calculatePoisonDamage(skill, skillLevel) {
    var levelIndex = Math.min(skillLevel - 1, skill.poisonDamage.min.length - 1);
    var min = skill.poisonDamage.min[levelIndex] || 0;
    var max = skill.poisonDamage.max[levelIndex] || 0;

    return {
      min: min,
      max: max,
      average: Math.floor((min + max) / 8)
    };
  }

  calculateElementalDamage(skill, skillLevel) {
    var damage = skill.lightningDamage.base + (skill.lightningDamage.perLevel * (skillLevel - 1));
    return {
      max: damage,
      average: Math.floor(damage / 2)
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

    if (newValue > maxAllowed) {
      input.value = maxAllowed;
      this.showWarning('Max ' + maxAllowed + ' points at level ' + this.currentLevel);
      return;
    }

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
  console.log('🧪 Testing...');
  if (skillSystemInstance) {
    console.log('✅ Skills working:', skillSystemInstance.getTotalUsed(), 'points used');
  } else {
    console.log('❌ Not initialized');
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