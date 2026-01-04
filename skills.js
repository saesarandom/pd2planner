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
  sockets.forEach(function (socket) {
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
    this.skillBonuses = {
      allSkills: 0,
      classSkills: 0,
      treeSkills: {} // Store tree-specific bonuses (e.g., {'bowandcrossbowskillscontainer': 3})
    };

    // Define all class skill trees
    this.classSkillTrees = {
      'Amazon': {
        'javelinandspearskillscontainer': [
          { id: 'jabcontainer', name: 'Jab', level: 1, prerequisites: [] },
          { id: 'poisonjavelincontainer', name: 'Poison Javelin', level: 1, prerequisites: [] },
          { id: 'powerstrikecontainer', name: 'Power Strike', level: 6, prerequisites: ['jabcontainer'] },
          { id: 'javelinandspearmasterycontainer', name: 'Javelin and Spear Mastery', level: 6, prerequisites: ['jabcontainer'] },
          { id: 'lightningboltcontainer', name: 'Lightning Bolt', level: 12, prerequisites: ['jabcontainer', 'poisonjavelincontainer', 'powerstrikecontainer'] },
          { id: 'fendcontainer', name: 'Fend', level: 18, prerequisites: ['jabcontainer', 'javelinandspearmasterycontainer'] },
          { id: 'chargedstrikecontainer', name: 'Charged Strike', level: 18, prerequisites: ['jabcontainer', 'powerstrikecontainer'] },
          { id: 'plaguejavelincontainer', name: 'Plague Javelin', level: 18, prerequisites: ['jabcontainer', 'poisonjavelincontainer', 'powerstrikecontainer', 'lightningboltcontainer'] },
          { id: 'lightningstrikecontainer', name: 'Lightning Strike', level: 30, prerequisites: ['jabcontainer', 'powerstrikecontainer', 'chargedstrikecontainer'] },
          { id: 'lightningfurycontainer', name: 'Lightning Fury', level: 30, prerequisites: ['jabcontainer', 'poisonjavelincontainer', 'powerstrikecontainer', 'lightningboltcontainer', 'plaguejavelincontainer'] }
        ],
        'passiveskillscontainer': [
          { id: 'innersightcontainer', name: 'Inner Sight', level: 1, prerequisites: [] },
          { id: 'criticalstrikecontainer', name: 'Critical Strike', level: 1, prerequisites: [] },
          { id: 'evadecontainer', name: 'Evade', level: 6, prerequisites: [] },
          { id: 'slowmovementcontainer', name: 'Slow Movement', level: 12, prerequisites: ['innersightcontainer'] },
          { id: 'piercecontainer', name: 'Pierce', level: 12, prerequisites: ['criticalstrikecontainer'] },
          { id: 'dodgecontainer', name: 'Dodge', level: 18, prerequisites: ['innersightcontainer', 'evadecontainer', 'slowmovementcontainer'] },
          { id: 'decoycontainer', name: 'Decoy', level: 18, prerequisites: ['innersightcontainer', 'slowmovementcontainer'] },
          { id: 'penetratecontainer', name: 'Penetrate', level: 24, prerequisites: ['criticalstrikecontainer', 'piercecontainer'] },
          { id: 'valkyriecontainer', name: 'Valkyrie', level: 30, prerequisites: ['innersightcontainer', 'slowmovementcontainer', 'decoycontainer'] }
        ],
        'bowandcrossbowskillscontainer': [
          { id: 'magicarrowcontainer', name: 'Magic Arrow', level: 1, prerequisites: [] },
          { id: 'multipleshotcontainer', name: 'Multiple Shot', level: 6, prerequisites: ['magicarrowcontainer'] },
          { id: 'firearrowcontainer', name: 'Fire Arrow', level: 1, prerequisites: ['magicarrowcontainer'] },
          { id: 'coldarrowcontainer', name: 'Cold Arrow', level: 6, prerequisites: ['magicarrowcontainer'] },
          { id: 'icearrowcontainer', name: 'Ice Arrow', level: 12, prerequisites: ['magicarrowcontainer', 'coldarrowcontainer'] },
          { id: 'guidedarrowcontainer', name: 'Guided Arrow', level: 18, prerequisites: ['magicarrowcontainer', 'multipleshotcontainer'] },
          { id: 'explodingarrowcontainer', name: 'Exploding Arrow', level: 18, prerequisites: ['magicarrowcontainer', 'firearrowcontainer'] },
          { id: 'strafecontainer', name: 'Strafe', level: 24, prerequisites: ['magicarrowcontainer', 'multipleshotcontainer', 'guidedarrowcontainer'] },
          { id: 'immolationarrowcontainer', name: 'Immolation Arrow', level: 18, prerequisites: ['magicarrowcontainer', 'firearrowcontainer', 'explodingarrowcontainer'] },
          { id: 'freezingarrowcontainer', name: 'Freezing Arrow', level: 30, prerequisites: ['magicarrowcontainer', 'coldarrowcontainer', 'icearrowcontainer'] }
        ]
      },
      'Assassin': {
        'martialartscontainer': [
          { id: 'tigerstrikecontainer', name: 'Tiger Strike', level: 1 },
          { id: 'dragonntaloncontainer', name: 'Dragon Talon', level: 1 },
          { id: 'dragonclawcontainer', name: 'Dragon Claw', level: 1 },
          { id: 'fistsoffirecontainer', name: 'Fists of Fire', level: 6 },
          { id: 'cobrastrikecontainer', name: 'Cobra Strike', level: 12 },
          { id: 'clawsofthundercontainer', name: 'Claws of Thunder', level: 18 },
          { id: 'dragontailcontainer', name: 'Dragon Tail', level: 18 },
          { id: 'dragonflightcontainer', name: 'Dragon Flight', level: 24 },
          { id: 'bladesoficecontainer', name: 'Blades of Ice', level: 24 },
          { id: 'phoenixstrikecontainer', name: 'Phoenix Strike', level: 30 }
        ],
        'shadowdisciplinescontainer': [
          { id: 'clawanddaggermasterycontainer', name: 'Claw and Dagger Mastery', level: 1 },
          { id: 'psychichammcontainer', name: 'Psychic Hammer', level: 1 },
          { id: 'burstofspeedcontainer', name: 'Burst of Speed', level: 6 },
          { id: 'weaponblockcontainer', name: 'Weapon Block', level: 12 },
          { id: 'cloakofshadowscontainer', name: 'Cloak of Shadows', level: 12 },
          { id: 'mindblastcontainer', name: 'Mind Blast', level: 12 },
          { id: 'fadecontainer', name: 'Fade', level: 18 },
          { id: 'shadowwarriorcontainer', name: 'Shadow Warrior', level: 18 },
          { id: 'shadowmastercontainer', name: 'Shadow Master', level: 30 },
          { id: 'venomcontainer', name: 'Venom', level: 12 }
        ],
        'trapscontainer': [
          { id: 'fireblastcontainer', name: 'Fire Blast', level: 1 },
          { id: 'shockwebcontainer', name: 'Shock Web', level: 6 },
          { id: 'bladesentinelcontainer', name: 'Blade Sentinel', level: 12 },
          { id: 'chargedboltsentrycontainer', name: 'Charged Bolt Sentry', level: 12 },
          { id: 'wakeoffirecontainer', name: 'Wake of Fire', level: 12 },
          { id: 'bladefurycontainer', name: 'Blade Fury', level: 18 },
          { id: 'bladeshieldcontainer', name: 'Blade Shield', level: 24 },
          { id: 'lightningsentrycontainer', name: 'Lightning Sentry', level: 24 },
          { id: 'wakeofinfernocontainer', name: 'Wake of Inferno', level: 24 },
          { id: 'chainlightningsentrycontainer', name: 'Chain Lightning Sentry', level: 30 },
          { id: 'deathsentrycontainer', name: 'Death Sentry', level: 30 }
        ]
      },
      'Barbarian': {
        'warcriescontainer': [
          { id: 'howlcontainer', name: 'Howl', level: 1 },
          { id: 'findpotioncontainer', name: 'Find Potion', level: 1 },
          { id: 'shoutcontainer', name: 'Shout', level: 6 },
          { id: 'warcrycontainer', name: 'War Cry', level: 6 },
          { id: 'finditemcontainer', name: 'Find Item', level: 12 },
          { id: 'tauncontainer', name: 'Taunt', level: 18 },
          { id: 'battleorderscontainer', name: 'Battle Orders', level: 24 },
          { id: 'grimwardcontainer', name: 'Grim Ward', level: 24 },
          { id: 'battlecommandcontainer', name: 'Battle Command', level: 30 },
          { id: 'battlecrycontainer', name: 'Battle Cry', level: 30 }
        ],
        'combatmasteriescontainer': [
          { id: 'generalmasterycontainer', name: 'General Mastery', level: 1 },
          { id: 'throwingmasterycontainer', name: 'Throwing Mastery', level: 1 },
          { id: 'polearmandspearmasterycontainer', name: 'Polearm and Spear Mastery', level: 6 },
          { id: 'combatreflexescontainer', name: 'Combat Reflexes', level: 12 },
          { id: 'ironskinscontainer', name: 'Iron Skin', level: 18 },
          { id: 'increasedspeedcontainer', name: 'Increased Speed', level: 24 },
          { id: 'naturalresistancecontainer', name: 'Natural Resistance', level: 30 },
          { id: 'deepwoundscontainer', name: 'Deep Wounds', level: 30 }
        ],
        'combatskillsbarcontainer': [
          { id: 'bashcontainer', name: 'Bash', level: 1 },
          { id: 'doubleswingcontainer', name: 'Double Swing', level: 1 },
          { id: 'frenzycontainer', name: 'Frenzy', level: 6 },
          { id: 'stuncontainer', name: 'Stun', level: 6 },
          { id: 'concentratecontainer', name: 'Concentrate', level: 12 },
          { id: 'doublethrowcontainer', name: 'Double Throw', level: 12 },
          { id: 'leapcontainer', name: 'Leap', level: 12 },
          { id: 'leapattackcontainer', name: 'Leap Attack', level: 24 },
          { id: 'berserkcontainer', name: 'Berserk', level: 30 },
          { id: 'whirlwindcontainer', name: 'Whirlwind', level: 30 }
        ]
      },
      'Druid': {
        'elementalskillscontainer': [
          { id: 'firestormcontainer', name: 'Firestorm', level: 1 },
          { id: 'moltenbouldcontainer', name: 'Molten Boulder', level: 6 },
          { id: 'arcticblastcontainer', name: 'Arctic Blast', level: 6 },
          { id: 'fissurecontainer', name: 'Fissure', level: 12 },
          { id: 'cyclonearmorcontainer', name: 'Cyclone Armor', level: 1 },
          { id: 'twistercontainer', name: 'Twister', level: 18 },
          { id: 'volcanocontainer', name: 'Volcano', level: 18 },
          { id: 'tornadocontainer', name: 'Tornado', level: 24 },
          { id: 'armageddoncontainer', name: 'Armageddon', level: 24 },
          { id: 'hurricanecontainer', name: 'Hurricane', level: 30 }
        ],
        'shapeshiftingskillscontainer': [
          { id: 'werewolfcontainer', name: 'Werewolf', level: 1 },
          { id: 'lycantropycontainer', name: 'Lycanthropy', level: 1 },
          { id: 'werebearcontainer', name: 'Werebear', level: 6 },
          { id: 'feralragecontainer', name: 'Feral Rage', level: 12 },
          { id: 'maulcontainer', name: 'Maul', level: 6 },
          { id: 'fireclawscontainer', name: 'Fire Claws', level: 18 },
          { id: 'rabiescontainer', name: 'Rabies', level: 18 },
          { id: 'shockwavecontainer', name: 'Shock Wave', level: 24 },
          { id: 'hungercontainer', name: 'Hunger', level: 24 },
          { id: 'furycontainer', name: 'Fury', level: 30 }
        ],
        'summoningskillscontainer': [
          { id: 'ravencontainer', name: 'Raven', level: 1 },
          { id: 'poisoncreepercontainer', name: 'Poison Creeper', level: 1 },
          { id: 'oaksagecontainer', name: 'Oak Sage', level: 6 },
          { id: 'summonspiritw wolfcontainer', name: 'Summon Spirit Wolf', level: 1 },
          { id: 'carrionvinecontainer', name: 'Carrion Vine', level: 12 },
          { id: 'heartofwolverinecontainer', name: 'Heart of Wolverine', level: 18 },
          { id: 'summondirewolfcontainer', name: 'Summon Dire Wolf', level: 18 },
          { id: 'solarcreepercontainer', name: 'Solar Creeper', level: 24 },
          { id: 'spiritofbarbscontainer', name: 'Spirit of Barbs', level: 30 },
          { id: 'summongrizzlycontainer', name: 'Summon Grizzly', level: 30 }
        ]
      },
      'Necromancer': {
        'summoningspellsneccontainer': [
          { id: 'skeletonmasterycontainer', name: 'Skeleton Mastery', level: 1 },
          { id: 'raiseskeletoncontainer', name: 'Raise Skeleton', level: 1 },
          { id: 'claygolemneccontainer', name: 'Clay Golem', level: 6 },
          { id: 'golemmasterneccontainer', name: 'Golem Mastery', level: 12 },
          { id: 'raiseskeletalmagecontainer', name: 'Raise Skeletal Mage', level: 12 },
          { id: 'bloodgolemneccontainer', name: 'Blood Golem', level: 18 },
          { id: 'summonnecroncontainer', name: 'Summon Resist', level: 24 },
          { id: 'irongolemneccontainer', name: 'Iron Golem', level: 24 },
          { id: 'firegolemneccontainer', name: 'Fire Golem', level: 30 },
          { id: 'revivecontainer', name: 'Revive', level: 30 }
        ],
        'poisonandbonespellscontainer': [
          { id: 'teethcontainer', name: 'Teeth', level: 1 },
          { id: 'bonearmorcontainer', name: 'Bone Armor', level: 1 },
          { id: 'poisondaggercontainer', name: 'Poison Dagger', level: 6 },
          { id: 'corpseexplosioncontainer', name: 'Corpse Explosion', level: 6 },
          { id: 'bonewallcontainer', name: 'Bone Wall', level: 12 },
          { id: 'poisonexplosioncontainer', name: 'Poison Explosion', level: 18 },
          { id: 'bonespearcontainer', name: 'Bone Spear', level: 18 },
          { id: 'boneprisoncontainer', name: 'Bone Prison', level: 24 },
          { id: 'poisonnovacontainer', name: 'Poison Nova', level: 24 },
          { id: 'bonespiritcontainer', name: 'Bone Spirit', level: 30 }
        ],
        'cursescontainer': [
          { id: 'amplifycontainer', name: 'Amplify Damage', level: 1 },
          { id: 'dimvisioncontainer', name: 'Dim Vision', level: 6 },
          { id: 'weakencontainer', name: 'Weaken', level: 6 },
          { id: 'ironmaidencontainer', name: 'Iron Maiden', level: 12 },
          { id: 'terrorcontainer', name: 'Terror', level: 12 },
          { id: 'confusecontainer', name: 'Confuse', level: 18 },
          { id: 'lifetapcontainer', name: 'Life Tap', level: 18 },
          { id: 'attractcontainer', name: 'Attract', level: 24 },
          { id: 'decrepifycontainer', name: 'Decrepify', level: 24 },
          { id: 'lowerresistcontainer', name: 'Lower Resist', level: 30 }
        ]
      },
      'Paladin': {
        'defensiveaurascontainer': [
          { id: 'prayercontainer', name: 'Prayer', level: 1 },
          { id: 'resistfirecontainer', name: 'Resist Fire', level: 1 },
          { id: 'defiancecontainer', name: 'Defiance', level: 6 },
          { id: 'resistcoldcontainer', name: 'Resist Cold', level: 6 },
          { id: 'cleansingcontainer', name: 'Cleansing', level: 12 },
          { id: 'resistlightningcontainer', name: 'Resist Lightning', level: 12 },
          { id: 'vigorcontainer', name: 'Vigor', level: 18 },
          { id: 'meditationcontainer', name: 'Meditation', level: 24 },
          { id: 'redemptioncontainer', name: 'Redemption', level: 30 },
          { id: 'salvationcontainer', name: 'Salvation', level: 30 }
        ],
        'offensiveaurascontainer': [
          { id: 'mightcontainer', name: 'Might', level: 1 },
          { id: 'holyfirecontainer', name: 'Holy Fire', level: 6 },
          { id: 'thornscontainer', name: 'Thorns', level: 6 },
          { id: 'blessedaimcontainer', name: 'Blessed Aim', level: 12 },
          { id: 'concentrationcontainer', name: 'Concentration', level: 18 },
          { id: 'holyfrostcontainer', name: 'Holy Freeze', level: 18 },
          { id: 'holyshockcontainer', name: 'Holy Shock', level: 24 },
          { id: 'sanctuarycontainer', name: 'Sanctuary', level: 24 },
          { id: 'fanatcontainer', name: 'Fanaticism', level: 30 },
          { id: 'convictioncontainer', name: 'Conviction', level: 30 }
        ],
        'combatskillspalcontainer': [
          { id: 'sacrificecontainer', name: 'Sacrifice', level: 1 },
          { id: 'smitecontainer', name: 'Smite', level: 1 },
          { id: 'holyboltcontainer', name: 'Holy Bolt', level: 6 },
          { id: 'zeal', name: 'Zeal', level: 12 },
          { id: 'chargecontainer', name: 'Charge', level: 12 },
          { id: 'vengeancecontainer', name: 'Vengeance', level: 18 },
          { id: 'blessedhammcontainer', name: 'Blessed Hammer', level: 18 },
          { id: 'conversioncontainer', name: 'Conversion', level: 24 },
          { id: 'holyshieldcontainer', name: 'Holy Shield', level: 24 },
          { id: 'focontainer', name: 'Fist of the Heavens', level: 30 }
        ]
      },
      'Sorceress': {
        'coldspellscontainer': [
          { id: 'iceboltcontainer', name: 'Ice Bolt', level: 1 },
          { id: 'frozenarmorcontainer', name: 'Frozen Armor', level: 1 },
          { id: 'frostnovacontainer', name: 'Frost Nova', level: 6 },
          { id: 'iceblastcontainer', name: 'Ice Blast', level: 6 },
          { id: 'shivercontainer', name: 'Shiver Armor', level: 12 },
          { id: 'glacialspikecontainer', name: 'Glacial Spike', level: 18 },
          { id: 'blizzardcontainer', name: 'Blizzard', level: 24 },
          { id: 'chillingarmorcontainer', name: 'Chilling Armor', level: 18 },
          { id: 'frozenorbcontainer', name: 'Frozen Orb', level: 30 },
          { id: 'coldmasterycontainer', name: 'Cold Mastery', level: 30 }
        ],
        'lightningspellscontainer': [
          { id: 'chargedboltcontainer', name: 'Charged Bolt', level: 1 },
          { id: 'staticfieldcontainer', name: 'Static Field', level: 6 },
          { id: 'telekinesicontainer', name: 'Telekinesis', level: 6 },
          { id: 'novcontainer', name: 'Nova', level: 12 },
          { id: 'lightningcontainer', name: 'Lightning', level: 12 },
          { id: 'chainlightningcontainer', name: 'Chain Lightning', level: 18 },
          { id: 'teleportcontainer', name: 'Teleport', level: 18 },
          { id: 'thunderstormcontainer', name: 'Thunder Storm', level: 24 },
          { id: 'energyshieldcontainer', name: 'Energy Shield', level: 24 },
          { id: 'lightningmasterycontainer', name: 'Lightning Mastery', level: 30 }
        ],
        'firespellscontainer': [
          { id: 'fireboltcontainer', name: 'Fire Bolt', level: 1 },
          { id: 'warmthcontainer', name: 'Warmth', level: 1 },
          { id: 'inferncontainer', name: 'Inferno', level: 6 },
          { id: 'blaze', name: 'Blaze', level: 12 },
          { id: 'fireballcontainer', name: 'Fire Ball', level: 12 },
          { id: 'firewallcontainer', name: 'Fire Wall', level: 18 },
          { id: 'enchantcontainer', name: 'Enchant', level: 18 },
          { id: 'meteorcontainer', name: 'Meteor', level: 24 },
          { id: 'firemasterycontainer', name: 'Fire Mastery', level: 30 },
          { id: 'hydracontainer', name: 'Hydra', level: 30 }
        ]
      }
    };

    // Backward compatibility - keep class-specific skill references
    this.amazonSkills = this.classSkillTrees['Amazon'];
    this.assassinSkills = this.classSkillTrees['Assassin'];
    this.barbarianSkills = this.classSkillTrees['Barbarian'];
    this.druidSkills = this.classSkillTrees['Druid'];
    this.necromancerSkills = this.classSkillTrees['Necromancer'];
    this.paladinSkills = this.classSkillTrees['Paladin'];
    this.sorceressSkills = this.classSkillTrees['Sorceress'];

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
        damage: [100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525, 1550, 1575],
        attackRating: [80, 86, 92, 98, 104, 110, 116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 266, 272, 278, 284, 290, 296, 302, 308, 314, 320, 326, 332, 338, 344, 350, 356, 362, 368, 374, 380, 386, 392, 398, 404, 410, 416, 422, 428, 434],
        manaCost: 5,
        synergies: [
          { skillId: 'jabcontainer', bonusPerLevel: 20, damageType: 'physical' }
        ]
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
      lightningboltcontainer: {
        name: "Lightning Bolt", type: "placeholder"

      },

      chargedstrikecontainer: {
        name: "Charged Strike", type: "lightning",
        chargedBolts: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [40, 52, 64, 76, 88, 100, 112, 124, 140, 156, 172, 188, 204, 220, 236, 252, 272, 292, 312, 332, 352, 372, 396, 420, 444, 468, 492, 516, 544, 572, 600, 628, 656, 684, 712, 740, 768, 796, 824, 852, 880, 908, 936, 964, 992, 1020, 1048, 1076, 1104, 1132, 1160, 1188, 1216, 1244, 1272, 1300, 1328, 1356, 1384, 1412]
        },
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        synergies: [
          { skillId: 'powerstrikecontainer', bonusPerLevel: 8, damageType: 'lightning' },
          { skillId: 'lightningstrikecontainer', bonusPerLevel: 8, damageType: 'lightning' },
        ]
      },
      lightningstrikecontainer: {
        name: "Lightning Strike", type: "lightning",
        hits: [4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [25, 35, 45, 55, 65, 75, 85, 95, 115, 135, 155, 175, 195, 215, 235, 255, 290, 325, 360, 395, 430, 465, 520, 575, 630, 685, 740, 795, 870, 945, 1020, 1095, 1170, 1245, 1320, 1395, 1470, 1545, 1620, 1695, 1770, 1845, 1920, 1995, 2070, 2145, 2220, 2295, 2370, 2445, 2520, 2595, 2670, 2745, 2820, 2895, 2970, 3045, 3120, 3195]
        },
        manaCost: [6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7],
        synergies: [
          { skillId: 'powerstrikecontainer', bonusPerLevel: 8, damageType: 'lightning' },
          { skillId: 'chargedstrikecontainer', bonusPerLevel: 8, damageType: 'lightning' }
        ]
      },
      lightningboltcontainer: {
        name: "Lightning Bolt", type: "lightning_conversion",
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [40, 52, 64, 76, 88, 100, 112, 124, 150, 176, 202, 228, 254, 280, 306, 332, 386, 440, 494, 548, 602, 656, 738, 820, 902, 984, 1066, 1148, 1258, 1368, 1478, 1588, 1698, 1808, 1918, 2028, 2138, 2248, 2358, 2468, 2578, 2688, 2798, 2908, 3018, 3128, 3238, 3348, 3458, 3568, 3678, 3788, 3898, 4008, 4118, 4228, 4338, 4448, 4558, 4668]
        },
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        convertsPhysical: true,
        synergies: [
          { skillId: 'powerstrikecontainer', bonusPerLevel: 15, damageType: 'lightning' },
          { skillId: 'lightningfurycontainer', bonusPerLevel: 15, damageType: 'lightning' }
        ]
      },
      plaguejavelincontainer: {
        name: "Plague Javelin", type: "poison",
        poisonDamage: {
          min: [23, 37, 51, 65, 79, 93, 107, 121, 150, 178, 206, 234, 262, 290, 318, 346, 393, 440, 487, 534, 581, 628, 721, 815, 909, 1003, 1096, 1190, 1378, 1565, 1753, 1940, 2128, 2315, 2503, 2690, 2878, 3065, 3253, 3440, 3628, 3815, 4003, 4190, 4378, 4565, 4753, 4940, 5128, 5315, 5503, 5690, 5878, 6065, 6253, 6440, 6628, 6815, 7003, 7190],
          max: [37, 51, 65, 79, 93, 107, 121, 135, 164, 192, 220, 248, 276, 304, 332, 360, 407, 454, 501, 548, 595, 642, 735, 829, 923, 1017, 1110, 1204, 1392, 1579, 1767, 1954, 2142, 2329, 2517, 2704, 2892, 3079, 3267, 3454, 3642, 3829, 4017, 4204, 4392, 4579, 4767, 4954, 5142, 5329, 5517, 5704, 5892, 6079, 6267, 6454, 6642, 6829, 7017, 7204]
        },
        attackRating: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640],
        manaCost: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5],
        synergies: [
          { skillId: 'poisonjavelincontainer', bonusPerLevel: 12, damageType: 'poison' },
          { skillId: 'javelinandspearmasterycontainer', bonusPerLevel: 6, damageType: 'poison' }
        ]
      },
      lightningfurycontainer: {
        name: "Lightning Fury", type: "lightning",
        bolts: [10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 22],
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [65, 73, 81, 89, 97, 105, 113, 121, 130, 139, 148, 157, 166, 175, 184, 193, 203, 213, 223, 233, 243, 253, 264, 275, 286, 297, 308, 319, 331, 343, 355, 367, 379, 391, 403, 415, 427, 439, 451, 463, 475, 487, 499, 511, 523, 535, 547, 559, 571, 583, 595, 607, 619, 631, 643, 655, 667, 679, 691, 703]
        },
        manaCost: [5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7],
        synergies: [
          { skillId: 'powerstrikecontainer', bonusPerLevel: 3, damageType: 'lightning' },
          { skillId: 'lightningboltcontainer', bonusPerLevel: 3, damageType: 'lightning' }
        ]
      },
      javelinandspearmasterycontainer: {
        name: "Javelin and Spear Mastery", type: "passive",
        damage: [40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925],
        criticalStrike: [5, 9, 12, 15, 17, 19, 20, 21, 23, 23, 24, 25, 26, 26, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35]
      },
      innersightcontainer: {
        name: "Inner Sight", type: "passive",
        duration: [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244],
        enemyAttackRating: [-10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
        enemyDefense: [-40, -65, -90, -115, -140, -165, -190, -215, -260, -305, -350, -395, -440, -485, -530, -575, -635, -695, -755, -815, -875, -935, -1015, -1095, -1175, -1255, -1335, -1415, -1515, -1615, -1715, -1815, -1915, -2015, -2115, -2215, -2315, -2415, -2515, -2615, -2715, -2815, -2915, -3015, -3115, -3215, -3315, -3415, -3515, -3615, -3715, -3815, -3915, -4015, -4115, -4215, -4315, -4415, -4515, -4615],
        radius: [6.6, 7.3, 8, 8.6, 9.3, 10, 10.6, 11.3, 12, 12.6, 13.3, 14, 14.6, 15.3, 16, 16.6, 17.3, 18, 18.6, 19.3, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
      },
      evadecontainer: {
        name: "Evade", type: "passive",
        dodgeChance: [6, 11, 15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 31, 32, 32, 32, 33, 33, 34, 34, 34, 35, 35, 36, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        movementSpeed: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65]
      },
      slowmovementcontainer: {
        name: "Slow Movement", type: "passive",
        enemyMovementSpeed: [-20, -22, -24, -26, -28, -30, -32, -34, -36, -38, -40, -42, -44, -46, -48, -50, -52, -54, -56, -58, -60, -62, -64, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65],
        enemyRangedAttacksSlowed: [75, 73, 71, 69, 67, 65, 63, 61, 59, 57, 55, 53, 51, 49, 47, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        radius: [12, 12.6, 13.3, 14, 14.6, 15.3, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
        duration: [10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8, 16, 16.2, 16.4, 16.6, 16.8, 17, 17.2, 17.4, 17.6, 17.8, 18, 18.2, 18.4, 18.6, 18.8, 19, 19.2, 19.4, 19.6, 19.8, 20, 20.2, 20.4, 20.6, 20.8, 21, 21.2, 21.4, 21.6, 21.8]
      },
      piercecontainer: {
        name: "Pierce", type: "passive",
        pierceChance: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
      },
      dodgecontainer: {
        name: "Dodge", type: "passive",
        dodgeChance: [6, 11, 15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 31, 32, 32, 32, 33, 33, 34, 34, 34, 35, 35, 36, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        fasterHitRecovery: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24]
      },
      decoycontainer: {
        name: "Decoy", type: "active",
        damage: {
          min: [35, 39, 43, 47, 51, 55, 59, 63, 69, 75, 81, 87, 93, 99, 105, 111, 120, 129, 138, 147, 156, 165, 177, 189, 201, 213, 225, 237, 252, 267, 282, 297, 312, 327, 342, 357, 372, 387, 402, 417, 432, 447, 462, 477, 492, 507, 522, 537, 552, 567, 582, 597, 612, 627, 642, 657, 672, 687, 702, 717],
          max: [50, 56, 62, 68, 74, 80, 86, 92, 100, 108, 116, 124, 132, 140, 148, 156, 167, 178, 189, 200, 211, 222, 236, 250, 264, 278, 292, 306, 323, 340, 357, 374, 391, 408, 425, 442, 459, 476, 493, 510, 527, 544, 561, 578, 595, 612, 629, 646, 663, 680, 697, 714, 731, 748, 765, 782, 799, 816, 833, 850]
        },
        life: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600],
        attackRating: [250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000, 3050, 3100, 3150, 3200],
        allResistances: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85],
        manaCost: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5],
        decoys: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
      },
      penetratecontainer: {
        name: "Penetrate", type: "passive",
        attackRatingPercent: [35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615, 625],
        enemyPhysicalResistance: [0, 0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7, -7, -8, -8, -9, -9, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10]
      },
      valkyriecontainer: {
        name: "Valkyrie", type: "active",
        life: {
          normal: [240, 256, 273, 290, 307, 324, 340, 357, 374, 391, 408, 424, 441, 458, 475, 492, 508, 525, 542, 559, 576, 592, 609, 626, 643, 660, 676, 693, 710, 727, 744, 760, 777, 794, 811, 828, 844, 861, 878, 895, 912, 928, 945, 962, 979, 996, 1012, 1029, 1046, 1063, 1080, 1096, 1113, 1130, 1147, 1164, 1180, 1197, 1214, 1231],
          nightmare: [340, 363, 387, 411, 435, 459, 482, 506, 530, 554, 578, 601, 625, 649, 673, 697, 720, 744, 768, 792, 816, 839, 863, 887, 911, 935, 958, 982, 1006, 1030, 1054, 1077, 1101, 1125, 1149, 1173, 1196, 1220, 1244, 1268, 1292, 1315, 1339, 1363, 1387, 1411, 1434, 1458, 1482, 1506, 1530, 1553, 1577, 1601, 1625, 1649, 1672, 1696, 1720, 1744],
          hell: [940, 1005, 1071, 1137, 1203, 1269, 1334, 1400, 1466, 1532, 1598, 1663, 1729, 1795, 1861, 1927, 1992, 2058, 2124, 2190, 2256, 2321, 2387, 2453, 2519, 2585, 2650, 2716, 2782, 2848, 2914, 2979, 3045, 3111, 3177, 3243, 3308, 3374, 3440, 3506, 3572, 3637, 3703, 3769, 3835, 3901, 3966, 4032, 4098, 4164, 4230, 4295, 4361, 4427, 4493, 4559, 4624, 4690, 4756, 4822]
        },
        powerStrikeLevel: [5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35],
        attackRating: [40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 840, 880, 920, 960, 1000, 1040, 1080, 1120, 1160, 1200, 1240, 1280, 1320, 1360, 1400, 1440, 1480, 1520, 1560, 1600, 1640, 1680, 1720, 1760, 1800, 1840, 1880, 1920, 1960, 2000, 2040, 2080, 2120, 2160, 2200, 2240, 2280, 2320, 2360, 2400],
        defense: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295],
        allResistances: [3, 6, 9, 12, 15, 18, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        manaCost: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
        cooldown: 1
      },
      magicarrowcontainer: {
        name: "Magic Arrow",
        type: "magic_conversion",
        attackRating: [10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100, 109, 118, 127, 136, 145, 154, 163, 172, 181, 190, 199, 208, 217, 226, 235, 244, 253, 262, 271, 280, 289, 298, 307, 316, 325, 334, 343, 352, 361, 370, 379, 388, 397, 406, 415, 424, 433, 442, 451, 460, 469, 478, 487, 496, 505, 514, 523, 532, 541],
        magicDamage: {
          min: [2, 3, 5, 6, 8, 9, 11, 12, 16, 20, 24, 27, 31, 35, 39, 42, 54, 65, 76, 87, 99, 110, 132, 154, 176, 198, 220, 242, 275, 308, 341, 374, 407, 440, 473, 506, 539, 572, 605, 638, 671, 704, 737, 770, 803, 836, 869, 902, 935, 968, 1001, 1034, 1067, 1100, 1133, 1166, 1199, 1232, 1265, 1298],
          max: [3, 6, 8, 10, 12, 15, 17, 19, 24, 30, 35, 40, 45, 51, 56, 61, 74, 87, 99, 112, 125, 138, 162, 186, 210, 234, 258, 282, 317, 352, 387, 422, 457, 492, 527, 562, 597, 632, 667, 702, 737, 772, 807, 842, 877, 912, 947, 982, 1017, 1052, 1087, 1122, 1157, 1192, 1227, 1262, 1297, 1332, 1367, 1402]
        },
        manaCost: [2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8, 9, 9.1, 9.2, 9.3],
        arrows: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5],
        pierceChance: 100,
        convertsPhysical: 75, // Converts 75% Physical Damage to Magic Damage
        synergies: [
          { skillId: 'innersightcontainer', bonusPerLevel: 20, damageType: 'magic' },
          { skillId: 'slowmovementcontainer', bonusPerLevel: 20, damageType: 'magic' },
          { skillId: 'guidedarrowcontainer', bonusPerLevel: 20, damageType: 'magic' }
        ],
        prerequisites: []
      },
      multipleshotcontainer: {
        name: "Multiple Shot",
        type: "physical",
        attackRating: [8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 266, 272, 278, 284, 290, 296, 302, 308, 314, 320, 326, 332, 338, 344, 350, 356, 362],
        damage: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335],
        arrows: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
        manaCost: [1.5, 1.6, 1.7, 1.8, 2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8],
        pierceReduction: 20, // 20% reduced damage per pierce
        synergies: []
      },
      firearrowcontainer: {
        name: "Fire Arrow",
        type: "fire_conversion",
        attackRating: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600],
        fireDamage: {
          min: [8, 12, 15, 19, 22, 26, 29, 33, 39, 45, 51, 57, 63, 69, 75, 81, 97, 113, 129, 145, 161, 177, 209, 241, 273, 305, 337, 369, 417, 465, 513, 561, 609, 657, 705, 753, 801, 849, 897, 945, 993, 1041, 1089, 1137, 1185, 1233, 1281, 1329, 1377, 1425, 1473, 1521, 1569, 1617, 1665, 1713, 1761, 1809, 1857, 1905],
          max: [12, 16, 21, 25, 30, 34, 39, 43, 61, 78, 96, 113, 131, 148, 166, 183, 201, 218, 236, 253, 271, 288, 323, 358, 393, 428, 463, 498, 551, 603, 656, 708, 761, 813, 866, 918, 971, 1023, 1076, 1128, 1181, 1233, 1286, 1338, 1391, 1443, 1496, 1548, 1601, 1653, 1706, 1758, 1811, 1863, 1916, 1968, 2021, 2073, 2126, 2178]
        },
        arrows: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
        manaCost: [1.5, 1.6, 1.7, 1.8, 2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8],
        convertsPhysical: 50, // Converts 50% Physical Damage to Fire Damage
        synergies: [
          { skillId: 'magicarrowcontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'immolationarrowcontainer', bonusPerLevel: 18, damageType: 'fire' }
        ],
        prerequisites: []
      },
      coldarrowcontainer: {
        name: "Cold Arrow",
        type: "cold_converted",
        attackRating: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600],
        coldDamage: {
          min: [7, 9, 11, 13, 15, 17, 19, 21, 26, 31, 36, 41, 46, 51, 56, 61, 76, 91, 106, 121, 136, 151, 181, 211, 241, 271, 301, 331, 376, 421, 466, 511, 556, 601, 646, 691, 736, 781, 826, 871, 916, 961, 1006, 1051, 1096, 1141, 1186, 1231, 1276, 1321, 1366, 1411, 1456, 1501, 1546, 1591, 1636, 1681, 1726, 1771],
          max: [10, 14, 18, 22, 26, 30, 34, 38, 44, 50, 56, 62, 68, 74, 80, 86, 102, 118, 134, 150, 166, 182, 214, 246, 278, 310, 342, 374, 422, 470, 518, 566, 614, 662, 710, 758, 806, 854, 902, 950, 998, 1046, 1094, 1142, 1190, 1238, 1286, 1334, 1382, 1430, 1478, 1526, 1574, 1622, 1670, 1718, 1766, 1814, 1862, 1910]
        },
        arrows: [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        manaCost: [1.5, 1.6, 1.7, 1.8, 2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8],
        convertsPhysical: 50, // Converts 50% Physical Damage to Cold Damage
        synergies: [
          { skillId: 'magicarrowcontainer', bonusPerLevel: 17, damageType: 'cold' },
          { skillId: 'icearrowcontainer', bonusPerLevel: 17, damageType: 'cold' }
        ],
        prerequisites: []
      },
      icearrowcontainer: {
        name: "Ice Arrow",
        type: "cold",
        attackRating: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610],
        coldDamage: {
          min: [22, 32, 42, 52, 62, 72, 82, 92, 106, 120, 134, 148, 162, 176, 190, 204, 228, 252, 276, 300, 324, 348, 382, 416, 450, 484, 518, 552, 596, 640, 684, 728, 772, 816, 860, 904, 948, 992, 1036, 1080, 1124, 1168, 1212, 1256, 1300, 1344, 1388, 1432, 1476, 1520, 1564, 1608, 1652, 1696, 1740, 1784, 1828, 1872, 1916, 1960],
          max: [36, 47, 58, 69, 80, 91, 102, 113, 129, 145, 161, 177, 193, 209, 225, 241, 267, 293, 319, 345, 371, 397, 433, 469, 505, 541, 577, 613, 659, 705, 751, 797, 843, 889, 935, 981, 1027, 1073, 1119, 1165, 1211, 1257, 1303, 1349, 1395, 1441, 1487, 1533, 1579, 1625, 1671, 1717, 1763, 1809, 1855, 1901, 1947, 1993, 2039, 2085]
        },
        manaCost: 3,
        synergies: [
          { skillId: 'magicarrowcontainer', bonusPerLevel: 16, damageType: 'cold' },
          { skillId: 'coldarrowcontainer', bonusPerLevel: 10, damageType: 'cold' },
          { skillId: 'freezingarrowcontainer', bonusPerLevel: 10, damageType: 'cold' }
        ],
        prerequisites: []
      },
      guidedarrowcontainer: {
        name: "Guided Arrow",
        type: "physical_magic_hybrid", // Physical with optional magic conversion based on Magic Arrow synergy
        damage: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295],
        manaCost: [8, 7.7, 7.5, 7.2, 7, 6.7, 6.5, 6.2, 6, 5.7, 5.5, 5.2, 5, 4.7, 4.5, 4.2, 4, 3.7, 3.5, 3.2, 3, 2.7, 2.5, 2.2, 2, 1.7, 1.5, 1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        synergies: [
          { skillId: 'magicarrowcontainer', bonusPerLevel: 0.5, damageType: 'magic_conversion' } // 1% conversion per 2 levels
        ],
        prerequisites: []
      },
      explodingarrowcontainer: {
        name: "Exploding Arrow",
        type: "fire",
        attackRating: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610],
        fireDamage: {
          min: [2, 7, 12, 17, 22, 27, 32, 37, 46, 55, 64, 73, 82, 91, 100, 109, 126, 143, 160, 177, 194, 211, 238, 265, 292, 319, 346, 373, 410, 447, 484, 521, 558, 595, 632, 669, 706, 743, 780, 817, 854, 891, 928, 965, 1002, 1039, 1076, 1113, 1150, 1187, 1224, 1261, 1298, 1335, 1372, 1409, 1446, 1483, 1520, 1557],
          max: [6, 12, 18, 24, 30, 36, 42, 48, 58, 68, 78, 88, 98, 108, 118, 128, 146, 164, 182, 200, 218, 236, 264, 292, 320, 348, 376, 404, 442, 480, 518, 556, 594, 632, 670, 708, 746, 784, 822, 860, 898, 936, 974, 1012, 1050, 1088, 1126, 1164, 1202, 1240, 1278, 1316, 1354, 1392, 1430, 1468, 1506, 1544, 1582, 1620]
        },
        radius: [2, 2, 2, 2, 2.6, 2.6, 2.6, 2.6, 3.3, 3.3, 3.3, 3.3, 4, 4, 4, 4, 4.6, 4.6, 4.6, 4.6, 5.3],
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        synergies: [
          { skillId: 'magicarrowcontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'immolationarrowcontainer', bonusPerLevel: 18, damageType: 'fire' }
        ],
        prerequisites: []
      },
      strafecontainer: {
        name: "Strafe",
        type: "physical",
        attackRating: [80, 86, 92, 98, 104, 110, 116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 266, 272, 278, 284, 290, 296, 302, 308, 314, 320, 326, 332, 338, 344, 350, 356, 362, 368, 374, 380, 386, 392, 398, 404, 410, 416, 422, 428, 434],
        damage: [100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925, 940, 955, 970, 985],
        targets: [3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        manaCost: 11,
        synergies: [
          { skillId: 'penetratecontainer', bonusPerLevel: 12, damageType: 'physical' }
        ],
        prerequisites: []
      },
      immolationarrowcontainer: {
        name: "Immolation Arrow",
        type: "fire",
        attackRating: [30, 39, 48, 57, 66, 75, 84, 93, 102, 111, 120, 129, 138, 147, 156, 165, 174, 183, 192, 201, 210, 219, 228, 237, 246, 255, 264, 273, 282, 291, 300, 309, 318, 327, 336, 345, 354, 363, 372, 381, 390, 399, 408, 417, 426, 435, 444, 453, 462, 471, 480, 489, 498, 507, 516, 525, 534, 543, 552, 561],
        fireDamage: {
          min: [11, 21, 31, 42, 52, 63, 73, 84, 102, 121, 140, 158, 177, 196, 215, 234, 262, 290, 318, 346, 375, 403, 434, 464, 494, 525, 555, 585, 616, 648, 679, 711, 742, 774, 805, 836, 867, 898, 930, 961, 992, 1024, 1055, 1086, 1118, 1149, 1180, 1211, 1243, 1274, 1305, 1337, 1368, 1399, 1431, 1462, 1493, 1524, 1556, 1587],
          max: [26, 34, 45, 55, 65, 75, 86, 96, 115, 135, 154, 172, 191, 210, 228, 247, 275, 304, 332, 360, 388, 416, 447, 477, 507, 538, 568, 598, 630, 661, 693, 724, 755, 786, 818, 850, 881, 912, 944, 975, 1007, 1038, 1070, 1101, 1132, 1164, 1195, 1227, 1258, 1290, 1321, 1352, 1384, 1415, 1447, 1478, 1510, 1541, 1572, 1604]
        },
        burningDamage: {
          min: [12, 17, 24, 29, 35, 42, 48, 54, 68, 82, 95, 108, 122, 135, 149, 162, 183, 205, 225, 245, 265, 287, 315, 344, 371, 400, 428, 455, 492, 527, 563, 598, 634, 670, 705, 740, 776, 811, 847, 882, 918, 954, 989, 1025, 1060, 1096, 1132, 1167, 1203, 1238, 1274, 1309, 1345, 1381, 1416, 1452, 1487, 1523, 1559, 1594],
          max: [12, 19, 26, 34, 41, 48, 55, 63, 77, 92, 107, 122, 136, 151, 165, 181, 202, 225, 246, 269, 290, 313, 343, 371, 401, 430, 460, 490, 525, 563, 599, 636, 673, 710, 746, 783, 820, 856, 893, 929, 966, 1003, 1039, 1076, 1113, 1149, 1186, 1222, 1259, 1296, 1332, 1369, 1406, 1442, 1479, 1515, 1552, 1589, 1625, 1662]
        },
        manaCost: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5],
        synergies: [
          { skillId: 'magicarrowcontainer', bonusPerLevel: 5, damageType: 'fire' },
          { skillId: 'explodingarrowcontainer', bonusPerLevel: 5, damageType: 'fire' },
          { skillId: 'firearrowcontainer', bonusPerLevel: 5, damageType: 'fire' }
        ],
        prerequisites: []
      },
      freezingarrowcontainer: {
        name: "Freezing Arrow",
        type: "cold",
        attackRating: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630],
        coldDamage: {
          min: [35, 43, 51, 59, 67, 75, 83, 91, 103, 115, 127, 139, 151, 163, 175, 187, 203, 219, 235, 251, 267, 283, 303, 323, 343, 363, 383, 403, 427, 451, 475, 499, 523, 547, 571, 595, 619, 643, 667, 691, 715, 739, 763, 787, 811, 835, 859, 883, 907, 931, 955, 979, 1003, 1027, 1051, 1075, 1099, 1123, 1147, 1171],
          max: [55, 65, 75, 85, 95, 105, 115, 125, 139, 153, 167, 181, 195, 209, 223, 237, 255, 273, 291, 309, 327, 345, 367, 389, 411, 433, 455, 477, 503, 529, 555, 581, 607, 633, 659, 685, 711, 737, 763, 789, 815, 841, 867, 893, 919, 945, 971, 997, 1023, 1049, 1075, 1101, 1127, 1153, 1179, 1205, 1231, 1257, 1283, 1309]
        },
        radius: [2.6, 2.6, 2.6, 2.6, 3.3, 3.3, 3.3, 3.3, 4, 4, 4, 4, 4.6, 4.6, 4.6, 4.6, 5.3, 5.3, 5.3, 5.3, 6],
        manaCost: [4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2],
        synergies: [
          { skillId: 'coldarrowcontainer', bonusPerLevel: 6, damageType: 'cold' },
          { skillId: 'icearrowcontainer', bonusPerLevel: 6, damageType: 'cold' }
        ],
        prerequisites: []
      },
      // Barbarian Skills
      bashcontainer: {
        name: "Bash",
        type: "physical",
        attackRating: [27, 39, 51, 63, 75, 87, 99, 111, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 267, 279, 291, 303, 315, 327, 339, 351, 363, 375, 387, 399, 411, 423, 435, 447, 459, 471, 483, 495, 507, 519, 531, 543, 555, 567, 579, 591, 603, 615, 627, 639, 651, 663, 675, 687, 699, 711, 723, 735],
        damage: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        flatDamage: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        manaCost: [2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7],
        synergies: [
          { skillId: 'stuncontainer', bonusPerLevel: 18, damageType: 'physical' },
          { skillId: 'concentratecontainer', bonusPerLevel: 18, damageType: 'physical' }
        ]
      },
      doubleswingcontainer: {
        name: "Double Swing",
        type: "physical",
        attackRating: [20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905],
        damage: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320, 1350, 1380, 1410, 1440, 1470, 1500, 1530, 1560, 1590, 1620, 1650, 1680, 1710, 1740, 1770, 1800],
        manaCost: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15],
        synergies: [
          { skillId: 'frenzycontainer', bonusPerLevel: 20, damageType: 'physical' },
          { skillId: 'stuncontainer', bonusPerLevel: 20, damageType: 'physical' }
        ]
      },
      frenzycontainer: {
        name: "Frenzy",
        type: "physical",
        attackRating: [30, 42, 54, 66, 78, 90, 102, 114, 126, 138, 150, 162, 174, 186, 198, 210, 222, 234, 246, 258, 270, 282, 294, 306, 318, 330, 342, 354, 366, 378, 390, 402, 414, 426, 438, 450, 462, 474, 486, 498, 510, 522, 534, 546, 558, 570, 582, 594, 606, 618, 630, 642, 654, 666, 678, 690, 702, 714, 726, 738],
        damage: [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500],
        attackSpeedMin: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        attackSpeedMax: [7, 13, 18, 22, 25, 27, 29, 31, 33, 34, 35, 36, 37, 38, 39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 46, 46, 47, 47, 47, 47, 47, 47, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 50],
        movementSpeedMin: [27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
        movementSpeedMax: [32, 34, 36, 38, 40, 42, 44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98],
        meleeSplashRadiusMin: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        meleeSplashRadiusMax: [6, 12, 16, 19, 22, 24, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36, 36, 36, 37, 37, 38, 38, 39, 39, 39, 40, 40, 40, 40, 40, 41, 41, 41, 41, 41, 42, 42, 42, 42, 42, 42, 43, 43, 43, 43, 43, 43, 43, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 45],
        manaCost: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31],
        duration: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        synergies: [
          { skillId: 'doubleswingcontainer', bonusPerLevel: 20, damageType: 'physical' },
          { skillId: 'stuncontainer', bonusPerLevel: 20, damageType: 'physical' }
        ]
      },
      stuncontainer: {
        name: "Stun",
        type: "physical",
        weaponDamageMultiplier: 0.25, // Only applies 1/4 of weapon damage
        physicalDamageMin: [2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 28, 31, 34, 37, 40, 43, 47, 51, 55, 59, 63, 67, 72, 77, 82, 87, 92, 97, 102, 107, 112, 117, 122, 127, 132, 137, 142, 147, 152, 157, 162, 167, 172, 177, 182, 187, 192, 197, 202, 207, 212, 217, 222, 227],
        physicalDamageMax: [4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 27, 30, 33, 36, 39, 42, 46, 50, 54, 58, 62, 66, 71, 76, 81, 86, 91, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264, 270, 276, 282, 288],
        attackRating: [55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925, 940],
        stunDuration: [1, 1.1, 1.3, 1.4, 1.6, 1.8, 1.9, 2.1, 2.2, 2.4, 2.6, 2.7, 2.9, 3, 3.2, 3.4, 3.4, 3.5, 3.6, 3.7, 3.8, 3.8, 3.9, 4, 4.1, 4.2, 4.2, 4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.8, 4.9, 5, 5, 5.1, 5.2, 5.3, 5.4, 5.4, 5.5, 5.6, 5.7, 5.8, 5.8, 5.9, 6, 6.1, 6.2, 6.2, 6.3, 6.4, 6.5, 6.6, 6.6, 6.7, 6.8, 6.9],
        manaCost: 2,
        synergies: [
          { skillId: 'concentratecontainer', bonusPerLevel: 10, damageType: 'attackRating' }
        ]
      },
      concentratecontainer: {
        name: "Concentrate",
        type: "magic_conversion",
        attackRating: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220],
        damage: [80, 105, 130, 155, 180, 205, 230, 255, 280, 305, 330, 355, 380, 405, 430, 455, 480, 505, 530, 555, 580, 605, 630, 655, 680, 705, 730, 755, 780, 805, 830, 855, 880, 905, 930, 955, 980, 1005, 1030, 1055, 1080, 1105, 1130, 1155, 1180, 1205, 1230, 1255, 1280, 1305, 1330, 1355, 1380, 1405, 1430, 1455, 1480, 1505, 1530, 1555],
        defenseBonus: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315],
        magicConversion: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70],
        manaCost: 2,
        synergies: [
          { skillId: 'bashcontainer', bonusPerLevel: 25, damageType: 'physical' },
          { skillId: 'battlecommandcontainer', bonusPerLevel: 25, damageType: 'physical' }
        ]
      },
      doublethrowcontainer: {
        name: "Double Throw",
        type: "physical",
        attackRating: [35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905, 920],
        damage: [45, 53, 61, 69, 77, 85, 93, 101, 109, 117, 125, 133, 141, 149, 157, 165, 173, 181, 189, 197, 205, 213, 221, 229, 237, 245, 253, 261, 269, 277, 285, 293, 301, 309, 317, 325, 333, 341, 349, 357, 365, 373, 381, 389, 397, 405, 413, 421, 429, 437, 445, 453, 461, 469, 477, 485, 493, 501, 509, 517],
        bounces: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        manaCost: [3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32],
        synergies: [
          { skillId: 'doubleswingcontainer', bonusPerLevel: 6, damageType: 'physical' },
          { skillId: 'frenzycontainer', bonusPerLevel: 6, damageType: 'physical' }
        ]
      },
      leapcontainer: {
        name: "Leap",
        type: "utility",
        leapDistance: [15.3, 16.6, 18, 18.6, 20, 20.6, 20.6, 21.3, 22, 22, 22.6, 22.6, 23.3, 23.3, 23.3, 24, 24, 24, 24, 24, 24.6, 24.6, 24.6, 24.6, 24.6, 24.6, 25.3, 25.3, 25.3, 25.3, 25.3, 25.3, 25.3, 25.3, 25.3, 25.3, 25.3, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26.6],
        knockbackRadius: [4.6, 5.3, 6, 6.6, 7.3, 8, 8.6, 9.3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        manaCost: 5
      },
      leapattackcontainer: {
        name: "Leap Attack",
        type: "physical",
        attackRating: [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915],
        damage: [80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905, 920, 935, 950, 965],
        manaCost: [7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7, 21, 21.2, 21.5, 21.7],
        synergies: [
          { skillId: 'leapcontainer', bonusPerLevel: 8, damageType: 'physical' },
          { skillId: 'bashcontainer', bonusPerLevel: 8, damageType: 'physical' }
        ]
      },
      berserkcontainer: {
        name: "Berserk",
        type: "physical",
        attackRating: [60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148, 156, 164, 172, 180, 188, 196, 204, 212, 220, 228, 236, 244, 252, 260, 268, 276, 284, 292, 300, 308, 316, 324, 332, 340, 348, 356, 364, 372, 380, 388, 396, 404, 412, 420, 428, 436, 444, 452, 460, 468, 476, 484, 492, 500, 508, 516, 524, 532],
        damage: [150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 350, 370, 390, 410, 430, 450, 470, 490, 510, 530, 550, 570, 590, 610, 630, 650, 670, 690, 710, 730, 750, 770, 790, 810, 830, 850, 870, 890, 910, 930, 950, 970, 990, 1010, 1030, 1050, 1070, 1090, 1110, 1130, 1150, 1170, 1190, 1210, 1230, 1250, 1270, 1290, 1310, 1330],
        enemyPhysicalResist: [-5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45],
        physicalResistPenalty: [-5, -6, -7, -8, -9, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10],
        defensePenalty: -25,
        duration: 0.5,
        manaCost: 4,
        synergies: [
          { skillId: 'tauntcontainer', bonusPerLevel: 12, damageType: 'physical' },
          { skillId: 'combatreflexescontainer', bonusPerLevel: 12, damageType: 'physical' }
        ]
      },
      whirlwindcontainer: {
        name: "Whirlwind",
        type: "physical",
        attackRating: [90, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264, 270, 276, 282, 288, 294, 300, 306, 312, 318, 324, 330, 336, 342, 348, 354, 360, 366, 372, 378, 384, 390, 396, 402, 408, 414, 420, 426, 432, 438, 444],
        damage: [30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82, 86, 90, 94, 98, 102, 106, 110, 114, 118, 122, 126, 130, 134, 138, 142, 146, 150, 154, 158, 162, 166, 170, 174, 178, 182, 186, 190, 194, 198, 202, 206, 210, 214, 218, 222, 226, 230, 234, 238, 242, 246, 250, 254, 258, 262, 266],
        velocity: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65],
        manaCost: [12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 37, 38, 38, 39, 39, 40, 40, 41, 41, 42],
        synergies: []
      },
      // Barbarian War Cries Skills
      findpotioncontainer: {
        name: "Find Potion",
        type: "utility",
        potionChance: [15, 27, 36, 44, 50, 55, 59, 62, 66, 68, 71, 73, 75, 77, 78, 80, 81, 82, 83, 84, 85, 86, 87, 88, 88, 89, 90, 90, 91, 91, 92, 92, 93, 93, 93, 94, 94, 95, 95, 95, 95, 96, 96, 96, 97, 97, 97, 97, 98, 98, 98, 98, 98, 99, 99, 99, 99, 99, 99, 100],
        manaCost: 2
      },
      shoutcontainer: {
        name: "Shout",
        type: "buff",
        defenseBonus: [25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615],
        duration: 300,
        manaCost: 6
      },
      warcrycontainer: {
        name: "War Cry",
        type: "physical_cry",
        physicalDamageMin: [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 21, 24, 27, 30, 33, 43, 53, 63, 73, 83, 93, 110, 127, 144, 161, 178, 195, 219, 243, 267, 291, 315, 339, 363, 387, 411, 435, 459, 483, 507, 531, 555, 579, 603, 627, 651, 675, 699, 723, 747, 771, 795, 819, 843, 867, 891, 915, 939, 963],
        physicalDamageMax: [4, 5, 6, 7, 8, 9, 10, 11, 14, 17, 20, 23, 26, 29, 32, 35, 45, 55, 65, 75, 85, 95, 112, 129, 146, 163, 180, 197, 221, 245, 269, 293, 317, 341, 365, 389, 413, 437, 461, 485, 509, 533, 557, 581, 605, 629, 653, 677, 701, 725, 749, 773, 797, 821, 845, 869, 893, 917, 941, 965],
        radius: [4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 8.6, 8.6, 8.6, 8.6, 8.6, 8.6, 8.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 11.6, 11.6, 11.6, 11.6, 11.6, 11.6, 11.6, 12.6, 12.6, 12.6, 12.6, 12.6],
        manaCost: [2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7],
        synergies: [
          { skillId: 'howlcontainer', bonusPerLevel: 16, damageType: 'physical' },
          { skillId: 'battlecrycontainer', bonusPerLevel: 16, damageType: 'physical' },
          { skillId: 'tauntcontainer', bonusPerLevel: 12, damageType: 'physical' },
          { skillId: 'shoutcontainer', bonusPerLevel: 12, damageType: 'physical' },
          { skillId: 'battlecommandcontainer', bonusPerLevel: 12, damageType: 'physical' },
          { skillId: 'battleorderscontainer', bonusPerLevel: 12, damageType: 'physical' }
        ]
      },
      finditemcontainer: {
        name: "Find Item",
        type: "utility",
        itemChance: [6, 10, 14, 17, 20, 22, 23, 24, 26, 27, 28, 29, 30, 30, 31, 32, 32, 32, 33, 33, 34, 34, 34, 35, 35, 35, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        manaCost: 7
      },
      tauntcontainer: {
        name: "Taunt",
        type: "debuff",
        enemyDamage: [-5, -7, -9, -11, -13, -15, -17, -19, -21, -23, -25, -27, -29, -31, -33, -35, -37, -39, -41, -43, -45, -47, -49, -51, -53, -55, -57, -59, -61, -63, -65, -67, -69, -71, -73, -75, -77, -79, -81, -83, -85, -87, -89, -91, -93, -95, -97, -99, -101, -103, -105, -107, -109, -111, -113, -115, -117, -119, -121, -123],
        enemyAttackRating: [-5, -7, -9, -11, -13, -15, -17, -19, -21, -23, -25, -27, -29, -31, -33, -35, -37, -39, -41, -43, -45, -47, -49, -51, -53, -55, -57, -59, -61, -63, -65, -67, -69, -71, -73, -75, -77, -79, -81, -83, -85, -87, -89, -91, -93, -95, -97, -99, -101, -103, -105, -107, -109, -111, -113, -115, -117, -119, -121, -123],
        duration: [2, 2.2, 2.4, 2.7, 3, 3.2, 3.4, 3.7, 4, 4.2, 4.4, 4.7, 5, 5.2, 5.4, 5.7, 6, 6.2, 6.4, 6.7, 7],
        radius: 8,
        manaCost: 3
      },
      battleorderscontainer: {
        name: "Battle Orders",
        type: "buff",
        lifeBonus: [50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905, 920, 935],
        manaBonus: [25, 32, 40, 47, 55, 62, 70, 77, 85, 92, 100, 107, 115, 122, 130, 137, 145, 152, 160, 167, 175, 182, 190, 197, 205, 212, 220, 227, 235, 242, 250, 257, 265, 272, 280, 287, 295, 302, 310, 317, 325, 332, 340, 347, 355, 362, 370, 377, 385, 392, 400, 407, 415, 422, 430, 437, 445, 452, 460, 467],
        duration: 300,
        manaCost: 7
      },
      grimwardcontainer: {
        name: "Grim Ward",
        type: "buff",
        attackRating: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710],
        damageBonus: [50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 805, 820, 835, 850, 865, 880, 895, 910, 925],
        radius: [10.6, 11.3, 12, 12.6, 13.3, 14, 14.6, 15.3, 16, 16.6, 17.3, 18, 18.6, 19.3, 20, 20.6, 21.3, 22, 22.6, 23.3, 24, 24.6, 25.3, 26, 26.6, 27.3, 28, 28.6, 29.3, 30, 30.6, 31.3, 32, 32.6, 33.3, 34, 34.6, 35.3, 36, 36.6, 37.3, 38, 38.6, 39.3, 40, 40.6, 41.3, 42, 42.6, 43.3, 44, 44.6, 45.3, 46, 46.6, 47.3, 48, 48.6, 49.3, 50],
        duration: 40
      },
      battlecommandcontainer: {
        name: "Battle Command",
        type: "buff",
        damageBonus: [20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110, 113, 116, 119, 122, 125, 128, 131, 134, 137, 140, 143, 146, 149, 152, 155, 158, 161, 164, 167, 170, 173, 176, 179, 182, 185, 188, 191, 194, 197],
        bonusSkills: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
        duration: 300,
        manaCost: 11
      },
      battlecrycontainer: {
        name: "Battle Cry",
        type: "debuff",
        enemyDefense: [-15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30],
        enemyPhysicalResist: [-5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -26, -27, -27, -28, -28, -29, -29, -30, -30, -31, -31, -32, -32, -33, -33, -34, -34, -35, -35, -36, -36, -37, -37, -38, -38, -39, -39, -40, -40, -41, -41, -42, -42, -43, -43, -44, -44, -45],
        duration: 12,
        manaCost: 5
      },
      // Assassin Skills
      tigerstrikecontainer: {
        name: "Tiger Strike",
        type: "charge_up",
        charge1Damage: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        charge2Damage: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000, 3050],
        charge3Damage: [150, 225, 300, 375, 450, 525, 600, 675, 750, 825, 900, 975, 1050, 1125, 1200, 1275, 1350, 1425, 1500, 1575, 1650, 1725, 1800, 1875, 1950, 2025, 2100, 2175, 2250, 2325, 2400, 2475, 2550, 2625, 2700, 2775, 2850, 2925, 3000, 3075, 3150, 3225, 3300, 3375, 3450, 3525, 3600, 3675, 3750, 3825, 3900, 3975, 4050, 4125, 4200, 4275, 4350, 4425, 4500, 4575],
        attackRating: [25, 40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910],
        meleeSplashBonus2: 20,
        meleeSplashBonus3: 40,
        duration: 300,
        manaCost: 1
      },
      dragontaloncontainer: {
        name: "Dragon Talon",
        type: "kick",
        kicks: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        damage: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        attackRating: [20, 45, 70, 95, 120, 145, 170, 195, 220, 245, 270, 295, 320, 345, 370, 395, 420, 445, 470, 495, 520, 545, 570, 595, 620, 645, 670, 695, 720, 745, 770, 795, 820, 845, 870, 895, 920, 945, 970, 995, 1020, 1045, 1070, 1095, 1120, 1145, 1170, 1195, 1220, 1245, 1270, 1295, 1320, 1345, 1370, 1395, 1420, 1445, 1470, 1495],
        manaCost: 6,
        synergies: [
          { skillId: 'dragontailcontainer', bonusPerLevel: 22, damageType: 'physical' },
          { skillId: 'dragonflightcontainer', bonusPerLevel: 22, damageType: 'physical' }
        ]
      },
      dragonclawcontainer: {
        name: "Dragon Claw",
        type: "physical",
        damage: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        attackRating: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220],
        hitsPerAttack: 2,
        manaCost: 2,
        synergies: [
          { skillId: 'clawanddaggermasterycontainer', bonusPerLevel: 20, damageType: 'physical' },
          { skillId: 'weaponblockcontainer', bonusPerLevel: 20, damageType: 'physical' }
        ]
      },
      fistsoffirecontainer: {
        name: "Fists of Fire",
        type: "charge_up",
        burningDamage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 34, 44, 54, 64, 74, 84, 102, 120, 138, 156, 174, 192, 218, 244, 270, 296, 322, 348, 374, 400, 426, 452, 478, 504, 530, 556, 582, 608, 634, 660, 686, 712, 738, 764, 790, 816, 842, 868, 894, 920, 946, 972, 998, 1024],
          max: [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 21, 24, 27, 30, 33, 48, 63, 78, 93, 108, 123, 150, 177, 204, 231, 258, 285, 324, 363, 402, 441, 480, 519, 558, 597, 636, 675, 714, 753, 792, 831, 870, 909, 948, 987, 1026, 1065, 1104, 1143, 1182, 1221, 1260, 1299, 1338, 1377, 1416, 1455, 1494, 1533]
        },
        novaFireDamage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 39, 54, 69, 84, 99, 114, 143, 172, 201, 230, 259, 288, 332, 376, 420, 464, 508, 552, 596, 640, 684, 728, 772, 816, 860, 904, 948, 992, 1036, 1080, 1124, 1168, 1212, 1256, 1300, 1344, 1388, 1432, 1476, 1520, 1564, 1608, 1652, 1696],
          max: [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 21, 24, 27, 30, 33, 51, 69, 87, 105, 123, 141, 175, 209, 243, 277, 311, 345, 396, 447, 498, 549, 600, 651, 702, 753, 804, 855, 906, 957, 1008, 1059, 1110, 1161, 1212, 1263, 1314, 1365, 1416, 1467, 1518, 1569, 1620, 1671, 1722, 1773, 1824, 1875, 1926, 1977]
        },
        meteorDamage: {
          min: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 50, 68, 86, 104, 122, 140, 176, 212, 248, 284, 320, 356, 412, 468, 524, 580, 636, 692, 748, 804, 860, 916, 972, 1028, 1084, 1140, 1196, 1252, 1308, 1364, 1420, 1476, 1532, 1588, 1644, 1700, 1756, 1812, 1868, 1924, 1980, 2036, 2092, 2148],
          max: [4, 6, 8, 10, 12, 14, 16, 18, 22, 26, 30, 34, 38, 42, 46, 50, 70, 90, 110, 130, 150, 170, 208, 246, 284, 322, 360, 398, 456, 514, 572, 630, 688, 746, 804, 862, 920, 978, 1036, 1094, 1152, 1210, 1268, 1326, 1384, 1442, 1500, 1558, 1616, 1674, 1732, 1790, 1848, 1906, 1964, 2022, 2080, 2138, 2196, 2254]
        },
        attackRating: [35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905, 920],
        manaCost: [3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8, 9, 9.1, 9.2, 9.3, 9.5, 9.6, 9.7, 9.8, 10, 10.1, 10.2, 10.3],
        synergies: [
          { skillId: 'tigerstrikecontainer', bonusPerLevel: 26, damageType: 'fire' },
          { skillId: 'dragonflightcontainer', bonusPerLevel: 26, damageType: 'fire' }
        ]
      },
      cobrastrikecontainer: {
        name: "Cobra Strike",
        type: "charge_up",
        poisonBoltDamage: {
          min: [3, 9, 15, 21, 28, 34, 40, 46, 65, 84, 103, 121, 140, 159, 178, 196, 228, 259, 290, 321, 353, 384, 462, 540, 618, 696, 775, 853, 1009, 1165, 1321, 1478, 1634, 1790, 1946, 2103, 2259, 2415, 2571, 2728, 2884, 3040, 3196, 3353, 3509, 3665, 3821, 3978, 4134, 4290, 4446, 4603, 4759, 4915, 5071, 5228, 5384, 5540, 5696, 5853],
          max: [12, 18, 25, 31, 37, 43, 50, 56, 75, 93, 112, 131, 150, 168, 187, 206, 237, 268, 300, 331, 362, 393, 471, 550, 628, 706, 784, 862, 1018, 1175, 1331, 1487, 1643, 1800, 1956, 2112, 2268, 2425, 2581, 2737, 2893, 3050, 3206, 3362, 3518, 3675, 3831, 3987, 4143, 4300, 4456, 4612, 4768, 4925, 5081, 5237, 5393, 5550, 5706, 5862]
        },
        enhancedDamage: [90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320, 1350, 1380, 1410, 1440, 1470, 1500, 1530, 1560, 1590, 1620, 1650, 1680, 1710, 1740, 1770, 1800, 1830, 1860],
        lifeManaSteal: [16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252],
        poisonCloudDamage: {
          min: [6, 15, 25, 34, 43, 53, 62, 71, 96, 121, 146, 171, 196, 221, 246, 271, 309, 346, 384, 421, 459, 496, 590, 684, 778, 871, 965, 1059, 1265, 1471, 1678, 1884, 2090, 2296, 2503, 2709, 2915, 3121, 3328, 3534, 3740, 3946, 4153, 4359, 4565, 4771, 4978, 5184, 5390, 5596, 5803, 6009, 6215, 6421, 6628, 6834, 7040, 7246, 7453, 7659],
          max: [18, 28, 37, 46, 56, 65, 75, 84, 109, 134, 159, 184, 209, 234, 259, 284, 321, 359, 396, 434, 471, 509, 603, 696, 790, 884, 978, 1071, 1278, 1484, 1690, 1896, 2103, 2309, 2515, 2721, 2928, 3134, 3340, 3546, 3753, 3959, 4165, 4371, 4578, 4784, 4990, 5196, 5403, 5609, 5815, 6021, 6228, 6434, 6640, 6846, 7053, 7259, 7465, 7671]
        },
        attackRating: [60, 74, 88, 102, 116, 130, 144, 158, 172, 186, 200, 214, 228, 242, 256, 270, 284, 298, 312, 326, 340, 354, 368, 382, 396, 410, 424, 438, 452, 466, 480, 494, 508, 522, 536, 550, 564, 578, 592, 606, 620, 634, 648, 662, 676, 690, 704, 718, 732, 746, 760, 774, 788, 802, 816, 830, 844, 858, 872, 886],
        poisonDuration: 1,
        manaCost: 2,
        synergies: [
          { skillId: 'venomcontainer', bonusPerLevel: 20, damageType: 'poison' }
        ]
      },
      clawsofthundercontainer: {
        name: "Claws of Thunder",
        type: "charge_up",
        lightningDamage: {
          min: new Array(60).fill(1),
          max: [80, 100, 120, 140, 160, 180, 200, 220, 260, 300, 340, 380, 420, 460, 500, 540, 600, 660, 720, 780, 840, 900, 980, 1060, 1140, 1220, 1300, 1380, 1480, 1580, 1680, 1780, 1880, 1980, 2080, 2180, 2280, 2380, 2480, 2580, 2680, 2780, 2880, 2980, 3080, 3180, 3280, 3380, 3480, 3580, 3680, 3780, 3880, 3980, 4080, 4180, 4280, 4380, 4480, 4580]
        },
        novaDamage: {
          min: [5, 10, 15, 20, 25, 30, 35, 40, 60, 80, 100, 120, 140, 160, 180, 200, 235, 270, 305, 340, 375, 410, 460, 510, 560, 610, 660, 710, 775, 840, 905, 970, 1035, 1100, 1165, 1230, 1295, 1360, 1425, 1490, 1555, 1620, 1685, 1750, 1815, 1880, 1945, 2010, 2075, 2140, 2205, 2270, 2335, 2400, 2465, 2530, 2595, 2660, 2725, 2790],
          max: [30, 40, 50, 60, 70, 80, 90, 100, 130, 160, 190, 220, 250, 280, 310, 340, 390, 440, 490, 540, 590, 640, 710, 780, 850, 920, 990, 1060, 1150, 1240, 1330, 1420, 1510, 1600, 1690, 1780, 1870, 1960, 2050, 2140, 2230, 2320, 2410, 2500, 2590, 2680, 2770, 2860, 2950, 3040, 3130, 3220, 3310, 3400, 3490, 3580, 3670, 3760, 3850, 3940]
        },
        chargedBoltDamage: {
          min: [10, 15, 20, 25, 30, 35, 40, 45, 55, 65, 75, 85, 95, 105, 115, 125, 140, 155, 170, 185, 200, 215, 235, 255, 275, 295, 315, 335, 360, 385, 410, 435, 460, 485, 510, 535, 560, 585, 610, 635, 660, 685, 710, 735, 760, 785, 810, 835, 860, 885, 910, 935, 960, 985, 1010, 1035, 1060, 1085, 1110, 1135],
          max: [40, 60, 80, 100, 120, 140, 160, 180, 220, 260, 300, 340, 380, 420, 460, 500, 560, 620, 680, 740, 800, 860, 940, 1020, 1100, 1180, 1260, 1340, 1440, 1540, 1640, 1740, 1840, 1940, 2040, 2140, 2240, 2340, 2440, 2540, 2640, 2740, 2840, 2940, 3040, 3140, 3240, 3340, 3440, 3540, 3640, 3740, 3840, 3940, 4040, 4140, 4240, 4340, 4440, 4540]
        },
        attackRating: [80, 92, 104, 116, 128, 140, 152, 164, 176, 188, 200, 212, 224, 236, 248, 260, 272, 284, 296, 308, 320, 332, 344, 356, 368, 380, 392, 404, 416, 428, 440, 452, 464, 476, 488, 500, 512, 524, 536, 548, 560, 572, 584, 596, 608, 620, 632, 644, 656, 668, 680, 692, 704, 716, 728, 740, 752, 764, 776, 788],
        manaCost: 4,
        synergies: [
          { skillId: 'dragonclawcontainer', bonusPerLevel: 16, damageType: 'lightning' }
        ]
      },
      dragontailcontainer: {
        name: "Dragon Tail",
        type: "kick",
        fireDamage: [40, 53, 66, 79, 92, 105, 118, 131, 144, 157, 170, 183, 196, 209, 222, 235, 248, 261, 274, 287, 300, 313, 326, 339, 352, 365, 378, 391, 404, 417, 430, 443, 456, 469, 482, 495, 508, 521, 534, 547, 560, 573, 586, 599, 612, 625, 638, 651, 664, 677, 690, 703, 716, 729, 742, 755, 768, 781, 794, 807],
        attackRating: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800],
        radius: 4,
        manaCost: 10,
        synergies: [
          { skillId: 'dragontaloncontainer', bonusPerLevel: 8, damageType: 'fire' },
          { skillId: 'dragonflightcontainer', bonusPerLevel: 8, damageType: 'fire' }
        ]
      },
      fireblastcontainer: {
        name: "Fire Blast",
        type: "fire",
        fireDamage: {
          min: [2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 29, 33, 37, 41, 45, 49, 58, 67, 76, 85, 94, 103, 114, 126, 137, 149, 160, 172, 183, 195, 206, 218, 229, 241, 252, 264, 275, 287, 298, 310, 321, 333, 344, 356, 367, 379, 390, 402, 413, 425, 436, 448, 459, 471],
          max: [3, 4, 6, 7, 9, 10, 12, 13, 16, 18, 21, 23, 26, 28, 31, 33, 38, 43, 48, 53, 58, 63, 73, 83, 93, 103, 113, 123, 136, 148, 161, 173, 186, 198, 211, 223, 236, 248, 261, 273, 286, 298, 311, 323, 336, 348, 361, 373, 386, 398, 411, 423, 436, 448, 461, 473, 486, 498, 511, 523]
        },
        bombs: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7],
        manaCost: [2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8, 9, 9.1, 9.2, 9.3],
        synergies: [
          { skillId: 'shockwebcontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'chargedboltsentrycontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'lightningsentrycontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'chainlightningsentrycontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'wakeoffirecontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'wakeofinfernocontainer', bonusPerLevel: 18, damageType: 'fire' }
        ]
      },
      shockwebcontainer: {
        name: "Shock Web",
        type: "lightning",
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [7, 14, 20, 26, 32, 39, 45, 51, 67, 82, 98, 114, 129, 145, 160, 176, 201, 226, 251, 276, 301, 326, 360, 395, 429, 464, 498, 532, 576, 620, 664, 707, 751, 795, 839, 882, 926, 970, 1014, 1057, 1101, 1145, 1189, 1232, 1276, 1320, 1364, 1407, 1451, 1495, 1539, 1582, 1626, 1670, 1714, 1757, 1801, 1845, 1889, 1932]
        },
        spikes: [4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24],
        duration: 3.6,
        manaCost: 6,
        cooldown: 1,
        synergies: [
          { skillId: 'chargedboltsentrycontainer', bonusPerLevel: 17, damageType: 'lightning' },
          { skillId: 'wakeoffirecontainer', bonusPerLevel: 17, damageType: 'lightning' },
          { skillId: 'chainlightningsentrycontainer', bonusPerLevel: 17, damageType: 'lightning' },
          { skillId: 'fireblastcontainer', bonusPerLevel: 17, damageType: 'lightning' },
          { skillId: 'lightningsentrycontainer', bonusPerLevel: 17, damageType: 'lightning' },
          { skillId: 'wakeofinfernocontainer', bonusPerLevel: 17, damageType: 'lightning' }
        ]
      },
      bladesentinelcontainer: {
        name: "Blade Sentinel",
        type: "physical",
        // Releases an aoe burst when changing directions (cannot happen more than once per 12 frames)
        damage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 42, 46, 50, 54, 58, 62, 66, 71, 76, 81, 86, 91, 96, 101, 106, 111, 116, 121, 126, 131, 136, 141, 146, 151, 156, 161, 166, 171, 176, 181, 186, 191, 196, 201, 206, 211, 216, 221, 226],
          max: [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 29, 32, 35, 38, 41, 44, 48, 52, 56, 60, 64, 68, 73, 78, 83, 88, 93, 98, 103, 108, 113, 118, 123, 128, 133, 138, 143, 148, 153, 158, 163, 168, 173, 178, 183, 188, 193, 198, 203, 208, 213, 218, 223, 228]
        },
        attackRating: [40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925],
        weaponDamageBonus: 75, // +75% weapon damage
        manaCost: 3.5,
        synergies: [
          { skillId: 'bladefurycontainer', bonusPerLevel: 15, damageType: 'physical' },
          { skillId: 'bladeshieldcontainer', bonusPerLevel: 15, damageType: 'physical' }
        ]
      },
      chargedboltsentrycontainer: {
        name: "Charged Bolt Sentry",
        type: "lightning",
        lightningDamage: {
          min: new Array(60).fill(1),
          max: [8, 13, 18, 23, 28, 33, 38, 43, 48, 54, 59, 65, 70, 76, 81, 87, 93, 99, 105, 111, 117, 123, 129, 136, 142, 149, 155, 162, 169, 176, 183, 190, 197, 204, 211, 218, 225, 232, 239, 246, 253, 260, 267, 274, 281, 288, 295, 302, 309, 316, 323, 330, 337, 344, 351, 358, 365, 372, 379, 386]
        },
        manaCost: [4, 4.125, 4.25, 4.375, 4.5, 4.625, 4.75, 4.875, 5, 5.125, 5.25, 5.375, 5.5, 5.625, 5.75, 5.875, 6, 6.125, 6.25, 6.375, 6.5, 6.625, 6.75, 6.875, 7, 7.125, 7.25, 7.375, 7.5, 7.625, 7.75, 7.875, 8, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875, 9, 9.125, 9.25, 9.375, 9.5, 9.625, 9.75, 9.875, 10, 10.125, 10.25, 10.375, 10.5, 10.625, 10.75, 10.875, 11, 11.125, 11.25, 11.375],
        bolts: [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9],
        synergies: [
          { skillId: 'fireblastcontainer', bonusPerLevel: 8, damageType: 'lightning' },
          { skillId: 'lightningsentrycontainer', bonusPerLevel: 8, damageType: 'lightning' },
          { skillId: 'chainlightningsentrycontainer', bonusPerLevel: 8, damageType: 'lightning' }
        ]
      },
      wakeoffirecontainer: {
        name: "Wake of Fire",
        type: "fire",
        fireDamage: {
          min: [2, 3, 4, 5, 6, 7, 8, 9, 13, 17, 21, 25, 29, 33, 37, 41, 54, 67, 80, 93, 106, 119, 141, 163, 185, 207, 229, 251, 273, 295, 317, 339, 361, 383, 405, 427, 449, 471, 493, 515, 537, 559, 581, 603, 625, 647, 669, 691, 713, 735, 757, 779, 801, 823, 845, 867, 889, 911, 933, 955],
          max: [4, 6, 8, 10, 12, 14, 16, 18, 24, 30, 36, 42, 48, 54, 60, 66, 82, 98, 114, 130, 146, 162, 188, 214, 240, 266, 292, 318, 344, 370, 396, 422, 448, 474, 500, 526, 552, 578, 604, 630, 656, 682, 708, 734, 760, 786, 812, 838, 864, 890, 916, 942, 968, 994, 1020, 1046, 1072, 1098, 1124, 1150]
        },
        manaCost: [5, 5.125, 5.25, 5.375, 5.5, 5.625, 5.75, 5.875, 6, 6.125, 6.25, 6.375, 6.5, 6.625, 6.75, 6.875, 7, 7.125, 7.25, 7.375, 7.5, 7.625, 7.75, 7.875, 8, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875, 9, 9.125, 9.25, 9.375, 9.5, 9.625, 9.75, 9.875, 10, 10.125, 10.25, 10.375, 10.5, 10.625, 10.75, 10.875, 11, 11.125, 11.25, 11.375, 11.5, 11.625, 11.75, 11.875, 12, 12.125, 12.25, 12.375],
        synergies: [
          { skillId: 'fireblastcontainer', bonusPerLevel: 8, damageType: 'fire' },
          { skillId: 'wakeofinfernocontainer', bonusPerLevel: 8, damageType: 'fire' }
        ]
      },
      bladefurycontainer: {
        name: "Blade Fury",
        type: "physical",
        damage: {
          min: [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 29, 32, 35, 38, 41, 44, 48, 52, 56, 60, 64, 68, 73, 78, 83, 88, 93, 98, 101, 106, 111, 116, 121, 126, 131, 136, 141, 146, 151, 156, 161, 166, 171, 176, 181, 186, 191, 196, 201, 206, 211, 216, 221, 223],
          max: [6, 8, 10, 12, 14, 16, 18, 20, 23, 26, 29, 32, 35, 38, 41, 44, 48, 52, 56, 60, 64, 68, 73, 78, 83, 88, 93, 98, 104, 110, 116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 266, 272, 278, 284, 290]
        },
        attackRating: [60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945],
        manaCost: [1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3],
        startupFrames: 3,
        minMana: 3,
        synergies: [
          { skillId: 'bladesentinelcontainer', bonusPerLevel: 15, damageType: 'physical' },
          { skillId: 'bladeshieldcontainer', bonusPerLevel: 15, damageType: 'physical' }
        ]
      },
      lightningsentrycontainer: {
        name: "Lightning Sentry",
        type: "lightning",
        lightningDamage: {
          min: new Array(60).fill(1),
          max: [30, 45, 60, 75, 90, 105, 120, 135, 156, 177, 198, 219, 240, 261, 282, 303, 330, 357, 384, 411, 438, 465, 498, 531, 564, 597, 630, 663, 702, 741, 780, 819, 858, 897, 936, 975, 1014, 1053, 1092, 1131, 1170, 1209, 1248, 1287, 1326, 1365, 1404, 1443, 1482, 1521, 1560, 1599, 1638, 1677, 1716, 1755, 1794, 1833, 1872, 1911]
        },
        manaCost: [7, 7.125, 7.25, 7.375, 7.5, 7.625, 7.75, 7.875, 8, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875, 9, 9.125, 9.25, 9.375, 9.5, 9.625, 9.75, 9.875, 10, 10.125, 10.25, 10.375, 10.5, 10.625, 10.75, 10.875, 11, 11.125, 11.25, 11.375, 11.5, 11.625, 11.75, 11.875, 12, 12.125, 12.25, 12.375, 12.5, 12.625, 12.75, 12.875, 13, 13.125, 13.25, 13.375, 13.5, 13.625, 13.75, 13.875, 14, 14.125, 14.25, 14.375],
        synergies: [
          { skillId: 'fireblastcontainer', bonusPerLevel: 16, damageType: 'lightning' },
          { skillId: 'chargedboltsentrycontainer', bonusPerLevel: 16, damageType: 'lightning' },
          { skillId: 'chainlightningsentrycontainer', bonusPerLevel: 16, damageType: 'lightning' }
        ]
      },
      wakeofinfernocontainer: {
        name: "Wake of Inferno",
        type: "fire",
        fireDamage: {
          min: [31, 48, 66, 84, 102, 119, 137, 155, 190, 226, 261, 296, 332, 367, 403, 438, 491, 544, 597, 651, 704, 757, 828, 898, 969, 1040, 1111, 1182, 1270, 1359, 1447, 1536, 1625, 1713, 1802, 1890, 1979, 2067, 2156, 2244, 2333, 2421, 2510, 2598, 2687, 2776, 2864, 2953, 3041, 3130, 3218, 3307, 3395, 3484, 3572, 3661, 3749, 3838, 3927, 4015],
          max: [52, 72, 93, 114, 135, 156, 177, 197, 239, 281, 322, 364, 406, 447, 489, 531, 593, 656, 718, 781, 843, 906, 989, 1072, 1156, 1239, 1322, 1406, 1510, 1614, 1718, 1822, 1927, 2031, 2135, 2239, 2343, 2447, 2552, 2656, 2760, 2864, 2968, 3072, 3177, 3281, 3385, 3489, 3593, 3697, 3802, 3906, 4010, 4114, 4218, 4322, 4427, 4531, 4635, 4739]
        },
        manaCost: [8, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875, 9, 9.125, 9.25, 9.375, 9.5, 9.625, 9.75, 9.875, 10, 10.125, 10.25, 10.375, 10.5, 10.625, 10.75, 10.875, 11, 11.125, 11.25, 11.375, 11.5, 11.625, 11.75, 11.875, 12, 12.125, 12.25, 12.375, 12.5, 12.625, 12.75, 12.875, 13, 13.125, 13.25, 13.375, 13.5, 13.625, 13.75, 13.875, 14, 14.125, 14.25, 14.375, 14.5, 14.625, 14.75, 14.875, 15, 15.125, 15.25, 15.375],
        synergies: [
          { skillId: 'fireblastcontainer', bonusPerLevel: 10, damageType: 'fire' },
          { skillId: 'wakeoffirecontainer', bonusPerLevel: 10, damageType: 'fire' }
        ]
      },
      chainlightningsentrycontainer: {
        name: "Chain Lightning Sentry",
        type: "lightning",
        lightningDamage: {
          min: new Array(60).fill(1),
          max: [50, 58, 66, 74, 82, 90, 98, 106, 118, 130, 142, 154, 166, 178, 190, 202, 220, 238, 256, 274, 292, 310, 336, 362, 388, 414, 440, 466, 502, 538, 574, 610, 646, 682, 718, 754, 790, 826, 862, 898, 934, 970, 1006, 1042, 1078, 1114, 1150, 1186, 1222, 1258, 1294, 1330, 1366, 1402, 1438, 1474, 1510, 1546, 1582, 1618]
        },
        manaCost: [7, 7.125, 7.25, 7.375, 7.5, 7.625, 7.75, 7.875, 8, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875, 9, 9.125, 9.25, 9.375, 9.5, 9.625, 9.75, 9.875, 10, 10.125, 10.25, 10.375, 10.5, 10.625, 10.75, 10.875, 11, 11.125, 11.25, 11.375, 11.5, 11.625, 11.75, 11.875, 12, 12.125, 12.25, 12.375, 12.5, 12.625, 12.75, 12.875, 13, 13.125, 13.25, 13.375, 13.5, 13.625, 13.75, 13.875, 14, 14.125, 14.25, 14.375],
        synergies: [
          { skillId: 'fireblastcontainer', bonusPerLevel: 13, damageType: 'lightning' },
          { skillId: 'chargedboltsentrycontainer', bonusPerLevel: 13, damageType: 'lightning' },
          { skillId: 'lightningsentrycontainer', bonusPerLevel: 13, damageType: 'lightning' }
        ]
      },
      deathsentrycontainer: {
        name: "Death Sentry",
        type: "death_sentry",
        lightningDamage: {
          min: [16, 21, 26, 31, 36, 41, 46, 51, 58, 65, 72, 79, 86, 93, 100, 107, 116, 125, 134, 143, 152, 161, 172, 183, 194, 205, 216, 227, 240, 253, 266, 279, 292, 305, 318, 331, 344, 357, 370, 383, 396, 409, 422, 435, 448, 461, 474, 487, 500, 513, 526, 539, 552, 565, 578, 591, 604, 617, 630, 643],
          max: [20, 26, 32, 38, 44, 50, 56, 62, 70, 78, 86, 94, 102, 110, 118, 126, 136, 146, 156, 166, 176, 186, 198, 210, 222, 234, 246, 258, 272, 286, 300, 314, 328, 342, 356, 370, 384, 398, 412, 426, 440, 454, 468, 482, 496, 510, 524, 538, 552, 566, 580, 594, 608, 622, 636, 650, 664, 678, 692, 706]
        },
        fireDamage: {
          min: [16, 21, 26, 31, 36, 41, 46, 51, 58, 65, 72, 79, 86, 93, 100, 107, 116, 125, 134, 143, 152, 161, 172, 183, 194, 205, 216, 227, 240, 253, 266, 279, 292, 305, 318, 331, 344, 357, 370, 383, 396, 409, 422, 435, 448, 461, 474, 487, 500, 513, 526, 539, 552, 565, 578, 591, 604, 617, 630, 643],
          max: [20, 26, 32, 38, 44, 50, 56, 62, 70, 78, 86, 94, 102, 110, 118, 126, 136, 146, 156, 166, 176, 186, 198, 210, 222, 234, 246, 258, 272, 286, 300, 314, 328, 342, 356, 370, 384, 398, 412, 426, 440, 454, 468, 482, 496, 510, 524, 538, 552, 566, 580, 594, 608, 622, 636, 650, 664, 678, 692, 706]
        },
        manaCost: [8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7, 21, 21.2, 21.5, 21.7, 22, 22.2, 22.5, 22.7],
        shots: [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11],
        corpseExplosionPercent: { min: 3, max: 5 },
        radius: 12,
        synergies: [
          { skillId: 'wakeofinfernocontainer', bonusPerLevel: 8, damageType: 'both' },
          { skillId: 'fireblastcontainer', bonusPerLevel: 8, damageType: 'both' }
        ]
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
    this.updateSkillVisuals();  // Set initial visual state based on prerequisites
    //('✅ Skills System ready');
  }

  createContainers() {
    // Define container titles for each class
    var classTitles = {
      'Amazon': [
        { id: 'javelinandspearskillscontainer', title: 'Javelin & Spear Skills' },
        { id: 'passiveskillscontainer', title: 'Passive & Magic Skills' },
        { id: 'bowandcrossbowskillscontainer', title: 'Bow & Crossbow Skills' }
      ],
      'Assassin': [
        { id: 'martialartscontainer', title: 'Martial Arts' },
        { id: 'shadowdisciplinescontainer', title: 'Shadow Disciplines' },
        { id: 'trapscontainer', title: 'Traps' }
      ],
      'Barbarian': [
        { id: 'warcriescontainer', title: 'Warcries' },
        { id: 'combatmasteriescontainer', title: 'Combat Masteries' },
        { id: 'combatskillsbarcontainer', title: 'Combat Skills' }
      ],
      'Druid': [
        { id: 'elementalskillscontainer', title: 'Elemental Skills' },
        { id: 'shapeshiftingskillscontainer', title: 'Shapeshifting Skills' },
        { id: 'summoningskillscontainer', title: 'Summoning Skills' }
      ],
      'Necromancer': [
        { id: 'summoningspellsneccontainer', title: 'Summoning Spells' },
        { id: 'poisonandbonespellscontainer', title: 'Poison & Bone Spells' },
        { id: 'cursescontainer', title: 'Curses' }
      ],
      'Paladin': [
        { id: 'defensiveaurascontainer', title: 'Defensive Auras' },
        { id: 'offensiveaurascontainer', title: 'Offensive Auras' },
        { id: 'combatskillspalcontainer', title: 'Combat Skills' }
      ],
      'Sorceress': [
        { id: 'coldspellscontainer', title: 'Cold Spells' },
        { id: 'lightningspellscontainer', title: 'Lightning Spells' },
        { id: 'firespellscontainer', title: 'Fire Spells' }
      ]
    };

    // Get current class from character selector
    var classSelect = document.getElementById('selectClass');
    var selectedClass = classSelect ? classSelect.value : 'Amazon';
    this.currentClass = selectedClass;

    // Get positions for current class
    var positions = classTitles[selectedClass] || classTitles['Amazon'];

    // Remove old skill containers first
    var oldContainers = document.querySelectorAll('.skill-tree-container');
    for (var i = 0; i < oldContainers.length; i++) {
      oldContainers[i].remove();
    }

    // Create new containers for current class
    // Position offsets: first column (right: 10px), second (-260px), third (-530px)
    var rightOffsets = [10, -260, -530];

    for (var i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var container = document.createElement('div');
      container.id = pos.id;
      container.className = 'skill-tree-container';

      // Set inline positioning to match Amazon layout
      container.style.position = 'absolute';
      container.style.top = '147px';
      container.style.right = rightOffsets[i] + 'px';
      container.style.width = '250px';
      container.style.height = '450px';
      container.style.overflowY = 'auto';

      var title = document.createElement('h3');
      title.textContent = pos.title;

      container.appendChild(title);
      document.body.appendChild(container);
    }
  }

  populateSkills() {
    var self = this;
    // Get current class skills
    var currentClassSkills = this.classSkillTrees[this.currentClass] || this.classSkillTrees['Amazon'];

    Object.keys(currentClassSkills).forEach(function (containerId) {
      var skills = currentClassSkills[containerId];
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

        // Create bonus span (green indicator)
        var bonusSpan = document.createElement('span');
        bonusSpan.id = skill.id + '_bonus';
        bonusSpan.style.color = '#00ff00';
        bonusSpan.style.fontWeight = 'bold';
        bonusSpan.style.marginRight = '5px';
        bonusSpan.style.minWidth = '20px';
        bonusSpan.style.fontSize = '12px';
        bonusSpan.textContent = ''; // Hidden initially

        skillDiv.appendChild(label);
        skillDiv.appendChild(bonusSpan);
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

    // Class changes - rebuild skill trees when class changes
    var classSelect = document.getElementById('selectClass');
    if (classSelect) {
      classSelect.addEventListener('change', function (e) {
        self.currentClass = e.target.value;
        self.rebuildSkillTrees();
      });
    }

    // Level changes
    var levelInput = document.getElementById('lvlValue');
    if (levelInput) {
      levelInput.addEventListener('input', function (e) {
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
        statInput.addEventListener('input', function () {
          self.scheduleCalculation();
        });
      }
    }

    // Skill input changes
    document.addEventListener('input', function (e) {
      if (e.target && e.target.matches && e.target.matches('[id$="container"] input[type="number"]')) {
        self.handleSkillInput(e.target);
        setTimeout(function () { self.updateSkillDropdown(); }, 100);
        self.scheduleCalculation();
      }
    });

    // Keydown restriction
    document.addEventListener('keydown', function (e) {
      if (e.target && e.target.matches && e.target.matches('[id$="container"] input[type="number"]')) {
        self.restrictInput(e);
      }
    });

    // Dropdown changes
    document.addEventListener('change', function (e) {
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
    document.addEventListener('click', function (e) {
      if (e.target && (e.target.classList.contains('socket-slot') || e.target.classList.contains('socket-item'))) {
        self.scheduleCalculation();
      }
    });

    setTimeout(function () { self.updateSkillDropdown(); }, 333);
  }

  // Lightweight calculation scheduler to avoid spam
  scheduleCalculation() {
    var self = this;
    if (self.calculationTimer) {
      clearTimeout(self.calculationTimer);
    }
    self.calculationTimer = setTimeout(function () {
      self.calculateSkillDamage();
    }, 150);
  }

  updateSkillDropdown() {
    var dropdown = document.getElementById('active-skill-dropdown');
    if (!dropdown) return;

    var currentValue = dropdown.value;
    dropdown.innerHTML = '<option value="">Select Active Skill...</option>';

    // Skills to exclude from dropdown display
    var excludedSkills = [
      'javelinandspearmasterycontainer', // Javelin and Spear Mastery (passive skill)
      'innersightcontainer', // Inner Sight
      'criticalstrikecontainer', // Critical Strike
      'evadecontainer', // Evade
      'slowmovementcontainer', // Slow Movement
      'piercecontainer', // Pierce
      'dodgecontainer', // Dodge
      'penetratecontainer' // Penetrate
    ];

    var self = this;
    Object.keys(this.skillData).forEach(function (skillId) {
      // Skip excluded skills
      if (excludedSkills.indexOf(skillId) !== -1) {
        return;
      }

      var skillInput = document.getElementById(skillId);
      if (skillInput && parseInt(skillInput.value) > 0) {
        var skill = self.skillData[skillId];
        var baseValue = parseInt(skillInput.value);

        // Combine All Skills, Class Skills, and Tree Skills for the dropdown display
        var allBonus = self.skillBonuses.allSkills || 0;
        var classBonus = self.skillBonuses.classSkills || 0;

        // Find if this skill belongs to a tree that has a bonus
        var treeBonus = 0;
        var currentClassSkills = self.classSkillTrees[self.currentClass] || self.classSkillTrees['Amazon'];

        Object.keys(currentClassSkills).forEach(function (containerId) {
          var skillsInTree = currentClassSkills[containerId];
          var isSkillInTree = skillsInTree.some(function (s) { return s.id === skillId; });
          if (isSkillInTree) {
            treeBonus = self.skillBonuses.treeSkills[containerId] || 0;
          }
        });

        var totalBonus = allBonus + classBonus + treeBonus;
        var totalValue = baseValue + totalBonus;

        var option = document.createElement('option');
        option.value = skillId;

        // Show total level with bonus, or just base level if no bonus
        if (totalBonus > 0) {
          option.textContent = skill.name + ' (' + totalValue + ')';
        } else {
          option.textContent = skill.name + ' (' + baseValue + ')';
        }
        dropdown.appendChild(option);
      }
    });

    if (currentValue && dropdown.querySelector('option[value="' + currentValue + '"]')) {
      dropdown.value = currentValue;
    } else {
      // If no previous selection, select the first available skill
      var options = dropdown.querySelectorAll('option');
      if (options.length > 1) {
        // options[0] is the "Select Active Skill..." placeholder
        dropdown.value = options[1].value;
      }
    }

    // Trigger skill damage calculation to show tooltip
    this.calculateSkillDamage();
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
    var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;

    if (baseSkillLevel === 0) {
      display.innerHTML = 'No points invested in this skill';
      return;
    }

    // Calculate total skill level including ALL bonuses (All Skills + Class Skills)
    var allBonus = this.skillBonuses.allSkills || 0;
    var classBonus = this.skillBonuses.classSkills || 0;
    var totalSkillLevel = baseSkillLevel + allBonus + classBonus;

    // NEW: Add tree-specific bonus
    var currentClassSkills = this.classSkillTrees[this.currentClass] || {};
    Object.keys(currentClassSkills).forEach((containerId) => {
      if (currentClassSkills[containerId].some(s => s.id === skillId)) {
        totalSkillLevel += (this.skillBonuses.treeSkills[containerId] || 0);
      }
    });

    var dexInput = document.getElementById('dex');
    var dexterity = parseInt(dexInput && dexInput.value ? dexInput.value : '0') || 0;

    var weaponDamage = this.getWeaponDamage();

    var html = '<div style="margin-bottom: 10px;"><strong>' + skill.name + ' (Level ' + totalSkillLevel + ')</strong></div>';

    // Check if weapon is usable before showing damage calculations
    var weaponUsable = isWeaponUsable();

    if (skill.type === 'physical') {
      // OPTION C: Show simple error message if weapon requirements not met
      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        // Weapon is usable - show full stats
        try {
          var damageInfo = this.calculatePhysicalDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);
        } catch (error) {
          console.error('Error calculating physical damage for ' + skillId + ':', error);
          html += '<div style="margin: 10px 0; color: #ff6666;">Error calculating damage</div>';
          display.innerHTML = html;
          return;
        }

        html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

        // Display Attack Rating if available
        if (skill.attackRating) {
          var attackRatingBonus;
          if (Array.isArray(skill.attackRating)) {
            var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
            attackRatingBonus = skill.attackRating[levelIndex] || 0;
          } else {
            attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (totalSkillLevel - 1));
          }
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

        var toMinDmgContainer = document.getElementById('tomindmgcontainer');
        var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
        var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
        var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

        if (toMinDmg > 0) {
          // Calculate the actual damage added (with bonuses)
          var toMinDmgActual = Math.floor(toMinDmg * (1 + damageInfo.skillBonus / 100 + damageInfo.synergyBonus / 100 + damageInfo.masteryDamageBonus / 100 + damageInfo.statBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffcc99;">to Min Dmg: +' + toMinDmgActual + ' (' + toMinDmg + ' base)</div>';
        }
        if (toMaxDmg > 0) {
          // Calculate the actual damage added (with bonuses)
          var toMaxDmgActual = Math.floor(toMaxDmg * (1 + damageInfo.skillBonus / 100 + damageInfo.synergyBonus / 100 + damageInfo.masteryDamageBonus / 100 + damageInfo.statBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffcc99;">to Max Dmg: +' + toMaxDmgActual + ' (' + toMaxDmg + ' base)</div>';
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

        // Display number of arrows if available (for Multishot, etc.)
        if (skill.arrows) {
          var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
          var arrowIndex = Math.min(baseSkillLevel - 1, skill.arrows.length - 1);
          var arrowCount = skill.arrows[arrowIndex] || 1;
          html += '<div style="margin: 5px 0; color: #cccccc;">Arrows: ' + arrowCount + '</div>';
        }

        // Display number of targets if available (for Strafe)
        if (skill.targets) {
          var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
          var targetIndex = Math.min(baseSkillLevel - 1, skill.targets.length - 1);
          var targetCount = skill.targets[targetIndex] || 1;
          html += '<div style="margin: 5px 0; color: #cccccc;">Targets: ' + targetCount + '</div>';
        }

        // Display pierce reduction if available (for Multishot)html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic;">Can summon additional Valkyrie at levels 20 and 30</div>';
        if (skill.pierceReduction) {
          html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic;">Deals ' + skill.pierceReduction + '% reduced damage every time they pierce</div>';
        }

        // Display mana cost if available
        if (skill.manaCost) {
          var manaCost;
          if (Array.isArray(skill.manaCost)) {
            var manaCostIndex = Math.min(totalSkillLevel - 1, skill.manaCost.length - 1);
            manaCost = skill.manaCost[manaCostIndex] || 0;
          } else if (typeof skill.manaCost === 'object') {
            manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
          } else {
            manaCost = skill.manaCost;
          }
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }

        // Special handling for Frenzy
        if (skillId === 'frenzycontainer' && skill.attackSpeedMin && skill.attackSpeedMax) {
          var levelIndex = Math.min(totalSkillLevel - 1, 59);
          var investedIndex = Math.min(baseSkillLevel, 20);

          // Attack Speed (stacking bonus)
          var attackSpeedMin = skill.attackSpeedMin[levelIndex] || 7;
          var attackSpeedMax = skill.attackSpeedMax[levelIndex] || 7;
          html += '<div style="margin: 5px 0; color: #ffaa66;">Attack Speed: +' + attackSpeedMin + '% to +' + attackSpeedMax + '% (stacking)</div>';

          // Movement Speed (stacking bonus)
          var movementSpeedMin = skill.movementSpeedMin[levelIndex] || 27;
          var movementSpeedMax = skill.movementSpeedMax[levelIndex] || 32;
          html += '<div style="margin: 5px 0; color: #66ff66;">Movement Speed: +' + movementSpeedMin + '% to +' + movementSpeedMax + '% (stacking)</div>';

          // Melee Splash Radius (stacking bonus)
          var splashMin = skill.meleeSplashRadiusMin[levelIndex] || 6;
          var splashMax = skill.meleeSplashRadiusMax[levelIndex] || 6;
          html += '<div style="margin: 5px 0; color: #ff9966;">Melee Splash Radius: +' + splashMin + '% to +' + splashMax + '% (stacking)</div>';

          // Duration
          var duration = skill.duration[investedIndex] || 15;
          html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + duration + ' seconds</div>';
        }

        // Special handling for Bash - flat damage bonus
        if (skillId === 'bashcontainer' && skill.flatDamage) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.flatDamage.length - 1);
          var flatDmg = skill.flatDamage[levelIndex] || 0;
          if (flatDmg > 0) {
            html += '<div style="margin: 5px 0; color: #ffcc99;">Adds +' + flatDmg + ' Flat Damage</div>';
          }
        }

        // Special handling for Stun - stun duration
        if (skillId === 'stuncontainer' && skill.stunDuration) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.stunDuration.length - 1);
          var stunDur = skill.stunDuration[levelIndex] || 1;
          html += '<div style="margin: 5px 0; color: #ffaa00;">Stun Duration: ' + stunDur + ' seconds</div>';
          html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic; color: #888;">Uses 1/4 of weapon damage</div>';
        }

        // Special handling for Double Throw - bounces
        if (skillId === 'doublethrowcontainer' && skill.bounces) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.bounces.length - 1);
          var bounceCount = skill.bounces[levelIndex] || 3;
          html += '<div style="margin: 5px 0; color: #cccccc;">Bounces: ' + bounceCount + '</div>';
        }

        // Special handling for Berserk
        if (skillId === 'berserkcontainer') {
          var levelIndex = Math.min(totalSkillLevel - 1, 59);

          // Enemy Physical Resistance reduction
          var enemyPhysResist = skill.enemyPhysicalResist[levelIndex] || -5;
          html += '<div style="margin: 5px 0; color: #ff6666;">Enemy Physical Resistance: ' + enemyPhysResist + '%</div>';

          // Self Physical Resistance penalty
          var selfPhysResist = skill.physicalResistPenalty[levelIndex] || -5;
          html += '<div style="margin: 5px 0; color: #ff9999;">Physical Resistance Penalty: ' + selfPhysResist + '%</div>';

          // Defense penalty
          html += '<div style="margin: 5px 0; color: #ff9999;">Defense Penalty: ' + skill.defensePenalty + '%</div>';

          // Duration
          html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + skill.duration + ' seconds</div>';
        }

        // Special handling for Whirlwind - velocity
        if (skillId === 'whirlwindcontainer' && skill.velocity) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.velocity.length - 1);
          var velocityPercent = skill.velocity[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #66ff66;">Velocity: +' + velocityPercent + '%</div>';
        }

        // Special handling for Blade Sentinel - weapon damage bonus
        if (skillId === 'bladesentinelcontainer' && skill.weaponDamageBonus) {
          html += '<div style="margin: 5px 0; color: #ffcc99;">+' + skill.weaponDamageBonus + '% Weapon Damage</div>';
        }

        // Special handling for Blade Fury - startup and min mana
        if (skillId === 'bladefurycontainer') {
          html += '<div style="margin: 5px 0; color: #cccccc;">Startup: ' + skill.startupFrames + ' frames</div>';
          html += '<div style="margin: 5px 0; color: #cccccc;">Min Mana required to cast: ' + skill.minMana + '</div>';
        }

        // Special handling for Dragon Talon - kicks
        if (skillId === 'dragontaloncontainer' && skill.kicks) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.kicks.length - 1);
          var kickCount = skill.kicks[levelIndex] || 1;
          html += '<div style="margin: 5px 0; color: #ffaa00;">Kicks: ' + kickCount + '</div>';
        }

        // Special handling for Dragon Claw - hits per attack
        if (skillId === 'dragonclawcontainer') {
          if (skill.hitsPerAttack) {
            html += '<div style="margin: 5px 0; color: #ffaa00;">Hits: ' + skill.hitsPerAttack + ' (once per claw)</div>';
          }
          html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic; color: #888;">Cannot be interrupted</div>';
        }

      } // End of weaponUsable check for physical skills
    } else if (skill.type === 'utility') {
      // Handle utility skills like Leap (no damage calculations)

      // Display Leap distance
      if (skillId === 'leapcontainer' && skill.leapDistance) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.leapDistance.length - 1);
        var distance = skill.leapDistance[levelIndex] || 15.3;
        html += '<div style="margin: 5px 0; color: #66ff66;">Leap Distance: ' + distance + ' yards</div>';
      }

      // Display knockback radius
      if (skillId === 'leapcontainer' && skill.knockbackRadius) {
        var investedIndex = Math.min(baseSkillLevel, skill.knockbackRadius.length - 1);
        var radius = skill.knockbackRadius[investedIndex] || 4.6;
        html += '<div style="margin: 5px 0; color: #ffaa66;">Knockback Radius: ' + radius + ' yards</div>';
      }

      // Display potion chance for Find Potion
      if (skillId === 'findpotioncontainer' && skill.potionChance) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.potionChance.length - 1);
        var chance = skill.potionChance[levelIndex] || 15;
        html += '<div style="margin: 5px 0; color: #00ff00;">Chance to Find Potion: ' + chance + '%</div>';
      }

      // Display item chance for Find Item
      if (skillId === 'finditemcontainer' && skill.itemChance) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.itemChance.length - 1);
        var chance = skill.itemChance[levelIndex] || 6;
        html += '<div style="margin: 5px 0; color: #00ff00;">Chance to Find Item: ' + chance + '%</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + skill.manaCost + '</div>';
      }
    } else if (skill.type === 'buff') {
      // Handle buff skills like Shout, Battle Orders, Grim Ward, Battle Command

      // Display defense bonus for Shout
      if (skillId === 'shoutcontainer' && skill.defenseBonus) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.defenseBonus.length - 1);
        var defBonus = skill.defenseBonus[levelIndex] || 25;
        html += '<div style="margin: 5px 0; color: #aaddff;">Defense: +' + defBonus + '%</div>';
      }

      // Display life and mana bonus for Battle Orders
      if (skillId === 'battleorderscontainer') {
        if (skill.lifeBonus) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.lifeBonus.length - 1);
          var lifeBonus = skill.lifeBonus[levelIndex] || 50;
          html += '<div style="margin: 5px 0; color: #ff6666;">Life: +' + lifeBonus + '</div>';
        }
        if (skill.manaBonus) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.manaBonus.length - 1);
          var manaBonus = skill.manaBonus[levelIndex] || 25;
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana: +' + manaBonus + '</div>';
        }
      }

      // Display attack rating, damage, and radius for Grim Ward
      if (skillId === 'grimwardcontainer') {
        if (skill.attackRating) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var ar = skill.attackRating[levelIndex] || 120;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '</div>';
        }
        if (skill.damageBonus) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.damageBonus.length - 1);
          var dmgBonus = skill.damageBonus[levelIndex] || 50;
          html += '<div style="margin: 5px 0; color: #ff9966;">Damage: +' + dmgBonus + '%</div>';
        }
        if (skill.radius) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.radius.length - 1);
          var radius = skill.radius[levelIndex] || 10.6;
          html += '<div style="margin: 5px 0; color: #cccccc;">Radius: ' + radius + ' yards</div>';
        }
      }

      // Display damage bonus and bonus skills for Battle Command
      if (skillId === 'battlecommandcontainer') {
        if (skill.damageBonus) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.damageBonus.length - 1);
          var dmgBonus = skill.damageBonus[levelIndex] || 20;
          html += '<div style="margin: 5px 0; color: #ff9966;">Damage: +' + dmgBonus + '% (Physical & Elemental)</div>';
        }
        if (skill.bonusSkills) {
          var investedIndex = Math.min(baseSkillLevel, skill.bonusSkills.length - 1);
          var bonusSkills = skill.bonusSkills[investedIndex] || 1;
          html += '<div style="margin: 5px 0; color: #00ff00;">Bonus to All Skills: +' + bonusSkills + '</div>';
        }
      }

      // Display duration
      if (skill.duration) {
        html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + skill.duration + ' seconds</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        } else if (typeof skill.manaCost === 'object') {
          manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
        } else {
          manaCost = skill.manaCost;
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'debuff') {
      // Handle debuff skills like Taunt

      // Display enemy damage reduction for Taunt
      if (skillId === 'tauntcontainer' && skill.enemyDamage) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.enemyDamage.length - 1);
        var enemyDmg = skill.enemyDamage[levelIndex] || -5;
        html += '<div style="margin: 5px 0; color: #ff6666;">Enemy Damage: ' + enemyDmg + '%</div>';
      }

      // Display enemy attack rating reduction for Taunt
      if (skillId === 'tauntcontainer' && skill.enemyAttackRating) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.enemyAttackRating.length - 1);
        var enemyAR = skill.enemyAttackRating[levelIndex] || -5;
        html += '<div style="margin: 5px 0; color: #ffaa66;">Enemy Attack Rating: ' + enemyAR + '%</div>';
      }

      // Display enemy defense reduction for Battle Cry
      if (skillId === 'battlecrycontainer' && skill.enemyDefense) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.enemyDefense.length - 1);
        var enemyDef = skill.enemyDefense[levelIndex] || -15;
        html += '<div style="margin: 5px 0; color: #aaddff;">Enemy Defense: ' + enemyDef + '%</div>';
      }

      // Display enemy physical resistance reduction for Battle Cry
      if (skillId === 'battlecrycontainer' && skill.enemyPhysicalResist) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.enemyPhysicalResist.length - 1);
        var enemyPhysRes = skill.enemyPhysicalResist[levelIndex] || -5;
        html += '<div style="margin: 5px 0; color: #ff9966;">Enemy Physical Resistance: ' + enemyPhysRes + '%</div>';
      }

      // Display duration (based on invested points for Taunt, fixed for Battle Cry)
      if (skill.duration) {
        if (Array.isArray(skill.duration)) {
          var investedIndex = Math.min(baseSkillLevel, skill.duration.length - 1);
          var duration = skill.duration[investedIndex] || 2;
          html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + duration + ' seconds</div>';
        } else {
          html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + skill.duration + ' seconds</div>';
        }
      }

      // Display radius
      if (skill.radius) {
        html += '<div style="margin: 5px 0; color: #cccccc;">Radius: ' + skill.radius + ' yards</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        } else if (typeof skill.manaCost === 'object') {
          manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
        } else {
          manaCost = skill.manaCost;
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'physical_cry') {
      // Handle War Cry - pure base damage skill (no weapon, no dex, no ED%)
      // Only affected by synergies

      var levelIndex = Math.min(totalSkillLevel - 1, skill.physicalDamageMin.length - 1);
      var baseDamageMin = skill.physicalDamageMin[levelIndex] || 0;
      var baseDamageMax = skill.physicalDamageMax[levelIndex] || 0;

      // Calculate synergy bonus
      var synergyBonus = this.calculateSynergyBonus(skillId, 'physical');

      // Apply synergies to base damage
      var damageMin = Math.floor(baseDamageMin * (1 + synergyBonus / 100));
      var damageMax = Math.floor(baseDamageMax * (1 + synergyBonus / 100));
      var averageDamage = Math.floor((damageMin + damageMax) / 2);

      // Display damage
      html += '<div style="margin: 5px 0; color: #ffaa00;">Physical Damage: ' + damageMin + '-' + damageMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + averageDamage + '</div>';

      if (synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
      }

      // Display radius
      if (skill.radius) {
        var radiusIndex = Math.min(totalSkillLevel - 1, skill.radius.length - 1);
        var radius = skill.radius[radiusIndex] || 4.6;
        html += '<div style="margin: 5px 0; color: #ffaa00;">Radius: ' + radius + ' yards</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        } else if (typeof skill.manaCost === 'object') {
          manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
        } else {
          manaCost = skill.manaCost;
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'charge_up') {
      // Handle charge-up skills like Tiger Strike
      // Show damage based on charge 3 only (as requested)

      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        // Use charge 3 damage for calculation
        var levelIndex = Math.min(totalSkillLevel - 1, skill.charge3Damage.length - 1);
        var charge3DamageBonus = skill.charge3Damage[levelIndex] || 150;

        // Create a temporary skill object with charge 3 damage for calculation
        var tempSkill = {
          damage: [charge3DamageBonus], // Use charge 3 damage as the skill bonus
          synergies: skill.synergies || []
        };

        var damageInfo = this.calculatePhysicalDamage(tempSkill, totalSkillLevel, weaponDamage, dexterity, skillId);

        html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

        // Display Attack Rating
        if (skill.attackRating) {
          var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var attackRatingBonus = skill.attackRating[arIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
        }

        html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
        html += '<div style="margin: 5px 0;">Charge 3 Damage: +' + charge3DamageBonus + '%</div>';

        if (damageInfo.synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
        }
        if (damageInfo.masteryDamageBonus > 0) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + damageInfo.masteryDamageBonus + '%</div>';
        }

        // Show elemental damages
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

        // Display melee splash bonuses
        if (skill.meleeSplashBonus2 || skill.meleeSplashBonus3) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Melee Splash: +' + skill.meleeSplashBonus2 + '% (2 charges), +' + skill.meleeSplashBonus3 + '% (3 charges)</div>';
        }

        // Display duration
        if (skill.duration) {
          html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + skill.duration + ' seconds</div>';
        }

        // Display mana cost
        if (skill.manaCost) {
          var manaCost;
          if (Array.isArray(skill.manaCost)) {
            manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
          } else {
            manaCost = skill.manaCost;
          }
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }
      }

      // Fists of Fire - fire damage charge-up
      if (skillId === 'fistsoffirecontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var synergyBonus = this.calculateSynergyBonus(skillId, 'fire');

        if (skill.attackRating) {
          var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var attackRatingBonus = skill.attackRating[arIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
        }

        if (skill.burningDamage) {
          var burnMin = skill.burningDamage.min[levelIndex] || 1;
          var burnMax = skill.burningDamage.max[levelIndex] || 2;
          burnMin = Math.floor(burnMin * (1 + synergyBonus / 100));
          burnMax = Math.floor(burnMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #ff6600;">Burning Damage: ' + burnMin + '-' + burnMax + '</div>';
        }
        if (skill.novaFireDamage) {
          var novaMin = skill.novaFireDamage.min[levelIndex] || 1;
          var novaMax = skill.novaFireDamage.max[levelIndex] || 2;
          novaMin = Math.floor(novaMin * (1 + synergyBonus / 100));
          novaMax = Math.floor(novaMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #ff9933;">Nova Fire Damage: ' + novaMin + '-' + novaMax + '</div>';
        }
        if (skill.meteorDamage) {
          var meteorMin = skill.meteorDamage.min[levelIndex] || 2;
          var meteorMax = skill.meteorDamage.max[levelIndex] || 4;
          meteorMin = Math.floor(meteorMin * (1 + synergyBonus / 100));
          meteorMax = Math.floor(meteorMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffaa00;">Meteor Damage: ' + meteorMin + '-' + meteorMax + '</div>';
        }
        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
        if (skill.manaCost) {
          var manaCost = Array.isArray(skill.manaCost) ? skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] : skill.manaCost;
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }
      }

      // Cobra Strike - poison damage charge-up
      if (skillId === 'cobrastrikecontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var synergyBonus = this.calculateSynergyBonus(skillId, 'poison');

        if (skill.attackRating) {
          var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var attackRatingBonus = skill.attackRating[arIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
        }

        if (skill.poisonBoltDamage) {
          var boltMin = skill.poisonBoltDamage.min[levelIndex] || 3;
          var boltMax = skill.poisonBoltDamage.max[levelIndex] || 12;
          boltMin = Math.floor(boltMin * (1 + synergyBonus / 100));
          boltMax = Math.floor(boltMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #00ff00;">Poison Bolt Damage: ' + boltMin + '-' + boltMax + '</div>';
        }
        if (skill.poisonCloudDamage) {
          var cloudMin = skill.poisonCloudDamage.min[levelIndex] || 6;
          var cloudMax = skill.poisonCloudDamage.max[levelIndex] || 18;
          cloudMin = Math.floor(cloudMin * (1 + synergyBonus / 100));
          cloudMax = Math.floor(cloudMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #66ff66;">Poison Cloud Damage: ' + cloudMin + '-' + cloudMax + '</div>';
        }
        if (skill.enhancedDamage) {
          var edBonus = skill.enhancedDamage[levelIndex] || 90;
          html += '<div style="margin: 5px 0; color: #ffaa00;">Enhanced Damage: +' + edBonus + '%</div>';
        }
        if (skill.lifeManaSteal) {
          var steal = skill.lifeManaSteal[levelIndex] || 16;
          html += '<div style="margin: 5px 0; color: #ff6666;">Life/Mana Steal: +' + steal + '%</div>';
        }
        if (skill.poisonDuration) {
          html += '<div style="margin: 5px 0; color: #cccccc;">Poison Duration: ' + skill.poisonDuration + ' second</div>';
        }
        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
        if (skill.manaCost) {
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + skill.manaCost + '</div>';
        }
      }

      // Claws of Thunder - lightning damage charge-up
      if (skillId === 'clawsofthundercontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var synergyBonus = this.calculateSynergyBonus(skillId, 'lightning');

        if (skill.attackRating) {
          var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var attackRatingBonus = skill.attackRating[arIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
        }

        if (skill.lightningDamage) {
          var lightMin = skill.lightningDamage.min[levelIndex] || 1;
          var lightMax = skill.lightningDamage.max[levelIndex] || 80;
          lightMin = Math.floor(lightMin * (1 + synergyBonus / 100));
          lightMax = Math.floor(lightMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffff00;">Lightning Damage: ' + lightMin + '-' + lightMax + '</div>';
        }
        if (skill.novaDamage) {
          var novaMin = skill.novaDamage.min[levelIndex] || 5;
          var novaMax = skill.novaDamage.max[levelIndex] || 30;
          novaMin = Math.floor(novaMin * (1 + synergyBonus / 100));
          novaMax = Math.floor(novaMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffee00;">Nova Damage: ' + novaMin + '-' + novaMax + '</div>';
        }
        if (skill.chargedBoltDamage) {
          var boltMin = skill.chargedBoltDamage.min[levelIndex] || 10;
          var boltMax = skill.chargedBoltDamage.max[levelIndex] || 40;
          boltMin = Math.floor(boltMin * (1 + synergyBonus / 100));
          boltMax = Math.floor(boltMax * (1 + synergyBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffdd00;">Charged Bolt Damage: ' + boltMin + '-' + boltMax + '</div>';
        }
        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
        if (skill.manaCost) {
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + skill.manaCost + '</div>';
        }
      }
    } else if (skill.type === 'kick') {
      // Handle kick skills like Dragon Talon and Dragon Tail
      // Dragon Talon uses physical damage, Dragon Tail uses fire damage

      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        // Check if this is Dragon Tail (fire damage) or Dragon Talon (physical)
        if (skillId === 'dragontailcontainer' && skill.fireDamage) {
          // Dragon Tail - fire damage kick
          var levelIndex = Math.min(totalSkillLevel - 1, skill.fireDamage.length - 1);
          var fireDamageBonus = skill.fireDamage[levelIndex] || 40;

          // Calculate synergy bonus for fire
          var synergyBonus = this.calculateSynergyBonus(skillId, 'fire');

          // Apply synergies to fire damage bonus
          var totalFireBonus = Math.floor(fireDamageBonus * (1 + synergyBonus / 100));

          html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

          // Display Attack Rating
          if (skill.attackRating) {
            var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
            var attackRatingBonus = skill.attackRating[arIndex] || 0;
            html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
          }

          html += '<div style="margin: 5px 0; color: #ff6600;">Fire Damage: +' + totalFireBonus + '%</div>';

          if (synergyBonus > 0) {
            html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
          }

          // Display radius
          if (skill.radius) {
            html += '<div style="margin: 5px 0; color: #cccccc;">Radius: ' + skill.radius + ' yards</div>';
          }
        } else {
          // Dragon Talon - physical damage kick
          var damageInfo = this.calculatePhysicalDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);

          html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

          // Display Attack Rating
          if (skill.attackRating) {
            var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
            var attackRatingBonus = skill.attackRating[arIndex] || 0;
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

          // Show elemental damages
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

          // Display number of kicks for Dragon Talon
          if (skillId === 'dragontaloncontainer' && skill.kicks) {
            var kickIndex = Math.min(totalSkillLevel - 1, skill.kicks.length - 1);
            var kickCount = skill.kicks[kickIndex] || 1;
            html += '<div style="margin: 5px 0; color: #ffaa00;">Kicks: ' + kickCount + '</div>';
          }
        }

        // Display mana cost
        if (skill.manaCost) {
          var manaCost;
          if (Array.isArray(skill.manaCost)) {
            manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
          } else {
            manaCost = skill.manaCost;
          }
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }
      }
    } else if (skill.type === 'poison') {
      var damageInfo = this.calculatePoisonDamage(skill, totalSkillLevel, skillId);

      // Display Attack Rating if available
      if (skill.attackRating) {
        var attackRatingBonus;
        if (Array.isArray(skill.attackRating)) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          attackRatingBonus = skill.attackRating[levelIndex] || 0;
        } else {
          attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (totalSkillLevel - 1));
        }
        html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
      }

      html += '<div style="margin: 5px 0; color: #00ff00;">Poison: ' + damageInfo.min + '-' + damageInfo.max + ' over 4s</div>';
      html += '<div style="margin: 5px 0;">Per Second: ' + damageInfo.average + '</div>';
      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }
    } else if (skill.type === 'lightning_conversion') {
      var damageInfo = this.calculateLightningConversionDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);

      // Display physical as 0-0 since it's converted
      html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';
      html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
      if (damageInfo.masteryDamageBonus > 0) {
        html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + damageInfo.masteryDamageBonus + '%</div>';
      }
      html += '<div style="margin: 5px 0; color: #ffaa00;">Physical: 0-0 (Converted to Lightning)</div>';
      html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + damageInfo.lightningMin + '-' + damageInfo.lightningMax + '</div>';
      html += '<div style="margin: 5px 0;">Average Lightning: ' + damageInfo.averageLightning + '</div>';
      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }
      html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total: ' + damageInfo.lightningMin + '-' + damageInfo.lightningMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.averageLightning + '</div>';

      var combinedCriticalStrike = damageInfo.criticalStrike + damageInfo.weaponMastery;
      if (combinedCriticalStrike > 0) {
        html += '<div style="margin: 5px 0; font-size: 12px;">Critical Strike: ' + combinedCriticalStrike + '%</div>';
      }
      if (damageInfo.deadlyStrike > 0) {
        html += '<div style="margin: 5px 0; font-size: 12px;">Deadly Strike: ' + damageInfo.deadlyStrike + '%</div>';
      }
      if (damageInfo.critMultiplier > 1) {
        html += '<div style="margin: 5px 0; font-size: 12px;">Crit Multiplier: ' + damageInfo.critMultiplier + 'x</div>';
      }
    } else if (skill.type === 'fire') {
      var damageInfo = this.calculateElementalDamage(skill, totalSkillLevel, skillId);

      html += '<div style="margin: 5px 0; color: #ff6600;">Fire: ' + damageInfo.fireMin + '-' + damageInfo.fireMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';
      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }

      // Special handling for Fire Blast - bombs
      if (skillId === 'fireblastcontainer' && skill.bombs) {
        var investedIndex = Math.min(baseSkillLevel, skill.bombs.length - 1);
        var bombCount = skill.bombs[investedIndex] || 1;
        html += '<div style="margin: 5px 0; color: #cccccc;">Bombs: ' + bombCount + '</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        } else if (typeof skill.manaCost === 'object') {
          manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
        } else {
          manaCost = skill.manaCost;
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'lightning') {
      var damageInfo = this.calculateElementalDamage(skill, totalSkillLevel, skillId);

      // Display Attack Rating if available
      if (skill.attackRating) {
        var attackRatingBonus;
        if (Array.isArray(skill.attackRating)) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          attackRatingBonus = skill.attackRating[levelIndex] || 0;
        } else {
          attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (totalSkillLevel - 1));
        }
        html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
      }

      html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + damageInfo.lightningMin + '-' + damageInfo.lightningMax + '</div>';
      if (damageInfo.novaMin !== undefined && damageInfo.novaMax !== undefined) {
        html += '<div style="margin: 5px 0; color: #ffff00;">Nova: ' + damageInfo.novaMin + '-' + damageInfo.novaMax + '</div>';
      }
      html += '<div style="margin: 5px 0;">Average: ' + damageInfo.average + '</div>';

      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }

      // Special handling for Shock Web - spikes, duration, cooldown
      if (skillId === 'shockwebcontainer') {
        if (skill.spikes) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.spikes.length - 1);
          var spikeCount = skill.spikes[levelIndex] || 4;
          html += '<div style="margin: 5px 0; color: #cccccc;">Spikes: ' + spikeCount + '</div>';
        }
        if (skill.duration) {
          html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + skill.duration + ' seconds</div>';
        }
        if (skill.cooldown) {
          html += '<div style="margin: 5px 0; color: #cccccc;">Cooldown: ' + skill.cooldown + ' second</div>';
        }
      }

      // Display bolts (Charged Bolt Sentry)
      if (damageInfo.bolts) {
        html += '<div style="margin: 5px 0; color: #cccccc;">Bolts Fired: ' + damageInfo.bolts + '</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        } else if (typeof skill.manaCost === 'object') {
          manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
        } else {
          manaCost = skill.manaCost;
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'death_sentry') {
      var damageInfo = this.calculateElementalDamage(skill, totalSkillLevel, skillId);

      // Display Lightning Damage
      html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + damageInfo.lightningMin + '-' + damageInfo.lightningMax + '</div>';

      // Display Fire Damage (from corpse explosion)
      html += '<div style="margin: 5px 0; color: #ff6600;">Fire: ' + damageInfo.fireMin + '-' + damageInfo.fireMax + '</div>';

      // Display average damage
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';

      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }

      // Display shots
      if (skill.shots) {
        var investedIndex = Math.min(baseSkillLevel, skill.shots.length - 1);
        var shotCount = skill.shots[investedIndex] || 5;
        html += '<div style="margin: 5px 0; color: #cccccc;">Shots: ' + shotCount + '</div>';
      }

      // Display corpse explosion percentage
      if (skill.corpseExplosionPercent) {
        html += '<div style="margin: 5px 0; color: #ff9966;">Corpse Explosion: ' + skill.corpseExplosionPercent.min + '-' + skill.corpseExplosionPercent.max + '% of corpse life</div>';
      }

      // Display radius
      if (skill.radius) {
        html += '<div style="margin: 5px 0; color: #cccccc;">Radius: ' + skill.radius + ' yards</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        } else if (typeof skill.manaCost === 'object') {
          manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
        } else {
          manaCost = skill.manaCost;
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'magic_conversion') {
      // OPTION C: Show simple error message if weapon requirements not met
      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        // Magic Arrow - converts 75% physical to magic
        try {
          var damageInfo = this.calculateMagicConversionDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);
        } catch (error) {
          console.error('Error calculating magic conversion damage for ' + skillId + ':', error);
          html += '<div style="margin: 10px 0; color: #ff6666;">Error calculating damage</div>';
          display.innerHTML = html;
          return;
        }

        // Display weapon and bonuses
        html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

        // Display Attack Rating if available
        if (skill.attackRating) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var attackRatingBonus = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
        }

        html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
        if (damageInfo.masteryDamageBonus > 0) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + damageInfo.masteryDamageBonus + '%</div>';
        }

        // Display conversion info
        var conversionPercent = skill.convertsPhysical || 75;
        html += '<div style="margin: 5px 0; color: #ffaa00;">Converts ' + conversionPercent + '% Physical to Magic</div>';

        // Display magic damage (converted + skill magic)
        html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage: ' + damageInfo.magicMin + '-' + damageInfo.magicMax + '</div>';

        // Display remaining physical damage (25%)
        if (damageInfo.physicalMin > 0 || damageInfo.physicalMax > 0) {
          html += '<div style="margin: 5px 0; color: #ffaa00;">Physical: ' + damageInfo.physicalMin + '-' + damageInfo.physicalMax + '</div>';
        }

        if (damageInfo.synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
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

        // Only show Total and Average damage if weapon is usable
        if (weaponUsable) {
          html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total: ' + damageInfo.min + '-' + damageInfo.max + '</div>';
          html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';
        } else {
          html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level requirement not met</div>';
        }

        // Display number of arrows if available
        if (skill.arrows) {
          // Use base invested skill level (hard points only), not total with +skills
          var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
          var arrowIndex = Math.min(baseSkillLevel, skill.arrows.length - 1);
          var arrowCount = skill.arrows[arrowIndex] || 1;
          html += '<div style="margin: 5px 0; color: #cccccc;">Arrows: ' + arrowCount + '</div>';
        }

        // Display pierce chance
        if (skill.pierceChance) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Pierce Chance: ' + skill.pierceChance + '%</div>';
        }

        // Display mana cost
        if (skill.manaCost) {
          var manaCost;
          if (Array.isArray(skill.manaCost)) {
            manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
          } else if (typeof skill.manaCost === 'object') {
            manaCost = skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1));
          } else {
            manaCost = skill.manaCost;
          }
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }

        // Display Concentrate's defense bonus
        if (skillId === 'concentratecontainer' && skill.defenseBonus) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.defenseBonus.length - 1);
          var defBonus = skill.defenseBonus[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #aaddff;">Defense: +' + defBonus + '%</div>';
        }

        // Display magic conversion percentage (for Concentrate)
        if (skill.magicConversion) {
          var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
          var investedIndex = Math.min(baseSkillLevel, skill.magicConversion.length - 1);
          var conversionPercent = skill.magicConversion[investedIndex] || 0;
          html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic; color: #9999ff;">' + conversionPercent + '% Physical Damage Converted to Magic</div>';
        }

        // Display critical strike info
        var combinedCriticalStrike = damageInfo.criticalStrike + damageInfo.weaponMastery;
        if (combinedCriticalStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Critical Strike: ' + combinedCriticalStrike + '%</div>';
        }
        if (damageInfo.deadlyStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Deadly Strike: ' + damageInfo.deadlyStrike + '%</div>';
        }
        if (damageInfo.critMultiplier > 1) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Crit Multiplier: ' + damageInfo.critMultiplier + 'x</div>';
        }
      } // End of weaponUsable check for magic_conversion skills
    } else if (skill.type === 'fire_conversion') {
      // OPTION C: Show simple error message if weapon requirements not met
      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        // Fire Arrow - converts 50% physical to fire
        var damageInfo = this.calculateFireConversionDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);

        html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

        if (skill.attackRating) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var attackRatingBonus = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
        }

        html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
        if (damageInfo.masteryDamageBonus > 0) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + damageInfo.masteryDamageBonus + '%</div>';
        }

        var conversionPercent = skill.convertsPhysical || 50;
        html += '<div style="margin: 5px 0; color: #ffaa00;">Converts ' + conversionPercent + '% Physical to Fire</div>';

        html += '<div style="margin: 5px 0; color: #ff6600;">Fire Damage: ' + damageInfo.fireMin + '-' + damageInfo.fireMax + '</div>';

        if (damageInfo.physicalMin > 0 || damageInfo.physicalMax > 0) {
          html += '<div style="margin: 5px 0; color: #ffaa00;">Physical: ' + damageInfo.physicalMin + '-' + damageInfo.physicalMax + '</div>';
        }

        if (damageInfo.synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
        }

        var elem = damageInfo.elementalDamages;
        if (elem.cold.max > 0) {
          html += '<div style="margin: 5px 0; color: #6699ff;">Cold: ' + elem.cold.min + '-' + elem.cold.max + '</div>';
        }
        if (elem.lightning.max > 0) {
          html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + elem.lightning.min + '-' + elem.lightning.max + '</div>';
        }
        if (elem.poison.max > 0) {
          html += '<div style="margin: 5px 0; color: #00ff00;">Poison: ' + elem.poison.min + '-' + elem.poison.max + '/sec</div>';
        }

        html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total: ' + damageInfo.totalMin + '-' + damageInfo.totalMax + '</div>';
        html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';

        if (skill.arrows) {
          var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
          var arrowIndex = Math.min(baseSkillLevel, skill.arrows.length - 1);
          var arrowCount = skill.arrows[arrowIndex] || 1;
          html += '<div style="margin: 5px 0; color: #cccccc;">Arrows: ' + arrowCount + '</div>';
        }

        if (skill.manaCost) {
          var manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }

        var combinedCriticalStrike = damageInfo.criticalStrike + damageInfo.weaponMastery;
        if (combinedCriticalStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Critical Strike: ' + combinedCriticalStrike + '%</div>';
        }
        if (damageInfo.deadlyStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Deadly Strike: ' + damageInfo.deadlyStrike + '%</div>';
        }
        if (damageInfo.critMultiplier > 1) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Crit Multiplier: ' + damageInfo.critMultiplier + 'x</div>';
        }
      } // End of weaponUsable check for fire_conversion skills
    } else if (skill.type === 'cold_converted') {
      // OPTION C: Show simple error message if weapon requirements not met
      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        // Cold Arrow - converts 50% physical to cold
        var damageInfo = this.calculateColdConversionDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);

        html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

        if (skill.attackRating) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
          var attackRatingBonus = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
        }

        html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
        if (damageInfo.masteryDamageBonus > 0) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + damageInfo.masteryDamageBonus + '%</div>';
        }

        var conversionPercent = skill.convertsPhysical || 50;
        html += '<div style="margin: 5px 0; color: #6699ff;">Converts ' + conversionPercent + '% Physical to Cold</div>';

        if (damageInfo.synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
        }

        // Display cold damage (converted + skill cold)
        html += '<div style="margin: 5px 0; color: #6699ff;">Cold Damage: ' + damageInfo.coldMin + '-' + damageInfo.coldMax + '</div>';

        // Display remaining physical damage (50%)
        if (damageInfo.physicalMin > 0 || damageInfo.physicalMax > 0) {
          html += '<div style="margin: 5px 0; color: #ffaa00;">Physical: ' + damageInfo.physicalMin + '-' + damageInfo.physicalMax + '</div>';
        }

        // Show elemental damages if they exist
        var elem = damageInfo.elementalDamages;
        if (elem.fire.max > 0) {
          html += '<div style="margin: 5px 0; color: #ff6600;">Fire: ' + elem.fire.min + '-' + elem.fire.max + '</div>';
        }
        if (elem.lightning.max > 0) {
          html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + elem.lightning.min + '-' + elem.lightning.max + '</div>';
        }
        if (elem.poison.max > 0) {
          html += '<div style="margin: 5px 0; color: #00ff00;">Poison: ' + elem.poison.min + '-' + elem.poison.max + '/sec</div>';
        }

        html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total: ' + damageInfo.totalMin + '-' + damageInfo.totalMax + '</div>';
        html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';

        if (skill.arrows) {
          var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
          var arrowIndex = Math.min(baseSkillLevel, skill.arrows.length - 1);
          var arrowCount = skill.arrows[arrowIndex] || 1;
          html += '<div style="margin: 5px 0; color: #cccccc;">Arrows: ' + arrowCount + '</div>';
        }

        if (skill.manaCost) {
          var manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }

        var combinedCriticalStrike = damageInfo.criticalStrike + damageInfo.weaponMastery;
        if (combinedCriticalStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Critical Strike: ' + combinedCriticalStrike + '%</div>';
        }
        if (damageInfo.deadlyStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Deadly Strike: ' + damageInfo.deadlyStrike + '%</div>';
        }
        if (damageInfo.critMultiplier > 1) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Crit Multiplier: ' + damageInfo.critMultiplier + 'x</div>';
        }
      } // End of weaponUsable check for cold_converted skills
    } else if (skill.type === 'cold') {
      // Pure cold damage skill (Ice Arrow, Freezing Arrow)
      var damageInfo = this.calculateColdDamage(skill, totalSkillLevel, skillId);

      // Display Attack Rating if available
      if (skill.attackRating) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
        var attackRatingBonus = skill.attackRating[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
      }

      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }

      html += '<div style="margin: 5px 0; color: #6699ff;">Cold Damage: ' + damageInfo.coldMin + '-' + damageInfo.coldMax + '</div>';
      html += '<div style="margin: 5px 0;">Average: ' + damageInfo.averageCold + '</div>';

      // Display explosion radius if available (Freezing Arrow)
      if (skill.radius) {
        var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
        var radiusIndex = Math.min(baseSkillLevel, skill.radius.length - 1);
        var radius = skill.radius[radiusIndex] || 0;
        html += '<div style="margin: 5px 0; color: #99ccff;">Freezing Radius: ' + radius + ' yards</div>';
      }

      if (skill.manaCost) {
        var manaCost = typeof skill.manaCost === 'number' ? skill.manaCost : skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'fire') {
      // Pure fire damage skill (Exploding Arrow, Immolation Arrow)
      var damageInfo = this.calculateFireDamage(skill, totalSkillLevel, skillId);

      // Display Attack Rating if available
      if (skill.attackRating) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
        var attackRatingBonus = skill.attackRating[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
      }

      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }

      html += '<div style="margin: 5px 0; color: #ff6600;">Fire Damage: ' + damageInfo.fireMin + '-' + damageInfo.fireMax + '</div>';

      // Display burning damage if available (Immolation Arrow)
      if (damageInfo.burningMin !== undefined && damageInfo.burningMax !== undefined) {
        html += '<div style="margin: 5px 0; color: #ff9933;">Burning Damage: ' + damageInfo.burningMin + '-' + damageInfo.burningMax + '/sec</div>';
      }

      html += '<div style="margin: 5px 0;">Average: ' + damageInfo.averageFire + '</div>';

      // Display explosion radius if available
      if (skill.radius) {
        var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
        var radiusIndex = Math.min(baseSkillLevel, skill.radius.length - 1);
        var radius = skill.radius[radiusIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffaa00;">Explosion Radius: ' + radius + ' yards</div>';
      }

      if (skill.manaCost) {
        var manaCost = typeof skill.manaCost === 'number' ? skill.manaCost : skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'physical_magic_hybrid') {
      // Guided Arrow - physical with optional magic conversion based on Magic Arrow synergy
      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        var damageInfo = this.calculatePhysicalMagicHybridDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);

        html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';

        html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
        html += '<div style="margin: 5px 0;">Skill Bonus: +' + damageInfo.skillBonus + '%</div>';
        if (damageInfo.masteryDamageBonus > 0) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + damageInfo.masteryDamageBonus + '%</div>';
        }

        var toMinDmgContainer = document.getElementById('tomindmgcontainer');
        var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
        var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
        var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

        if (toMinDmg > 0) {
          var toMinDmgActual = Math.floor(toMinDmg * (1 + damageInfo.skillBonus / 100 + damageInfo.masteryDamageBonus / 100 + damageInfo.statBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffcc99;">to Min Dmg: +' + toMinDmgActual + ' (' + toMinDmg + ' base)</div>';
        }
        if (toMaxDmg > 0) {
          var toMaxDmgActual = Math.floor(toMaxDmg * (1 + damageInfo.skillBonus / 100 + damageInfo.masteryDamageBonus / 100 + damageInfo.statBonus / 100));
          html += '<div style="margin: 5px 0; color: #ffcc99;">to Max Dmg: +' + toMaxDmgActual + ' (' + toMaxDmg + ' base)</div>';
        }

        // Show magic conversion if any
        if (damageInfo.conversionPercent > 0) {
          html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Conversion: ' + damageInfo.conversionPercent + '% (from Magic Arrow synergy)</div>';
          html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage: ' + damageInfo.magicMin + '-' + damageInfo.magicMax + '</div>';
        }

        // Show physical damage
        if (damageInfo.physicalMin > 0 || damageInfo.physicalMax > 0) {
          html += '<div style="margin: 5px 0; color: #ffaa00;">Physical: ' + damageInfo.physicalMin + '-' + damageInfo.physicalMax + '</div>';
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

        html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total: ' + damageInfo.totalMin + '-' + damageInfo.totalMax + '</div>';
        html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';

        if (skill.manaCost) {
          var manaCost = skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0;
          html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
        }

        var combinedCriticalStrike = damageInfo.criticalStrike + damageInfo.weaponMastery;
        if (combinedCriticalStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Critical Strike: ' + combinedCriticalStrike + '%</div>';
        }
        if (damageInfo.deadlyStrike > 0) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Deadly Strike: ' + damageInfo.deadlyStrike + '%</div>';
        }
        if (damageInfo.critMultiplier > 1) {
          html += '<div style="margin: 5px 0; font-size: 12px;">Crit Multiplier: ' + damageInfo.critMultiplier + 'x (physical only)</div>';
        }
      }
    } else if (skillId === 'decoycontainer') {
      // Display Decoy summon information
      var levelIndex = Math.min(totalSkillLevel - 1, skill.damage.min.length - 1);
      var damageMin = skill.damage.min[levelIndex] || 0;
      var damageMax = skill.damage.max[levelIndex] || 0;
      var life = skill.life[levelIndex] || 0;
      var attackRating = skill.attackRating[levelIndex] || 0;
      var allRes = skill.allResistances[levelIndex] || 0;
      var manaCost = skill.manaCost[levelIndex] || 0;
      var decoyCount = skill.decoys[Math.min(totalSkillLevel - 1, skill.decoys.length - 1)] || 1;

      html += '<div style="margin: 5px 0;">Damage: ' + damageMin + '-' + damageMax + '</div>';
      html += '<div style="margin: 5px 0;">Life: ' + life + '%</div>';
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: ' + attackRating + '</div>';
      html += '<div style="margin: 5px 0; color: #aaffaa;">All Resistances: +' + allRes + '%</div>';
      html += '<div style="margin: 5px 0;">Number of Decoys: ' + decoyCount + '</div>';
      html += '<div style="margin: 5px 0; color: #ffff00;">Mana Cost: ' + manaCost + '</div>';
    } else if (skillId === 'valkyriecontainer') {
      // Display Valkyrie summon information
      var levelIndex = Math.min(totalSkillLevel - 1, skill.powerStrikeLevel.length - 1);
      var lifeHell = skill.life.hell[levelIndex] || 0;
      var powerStrikeLevel = skill.powerStrikeLevel[levelIndex] || 0;
      var attackRating = skill.attackRating[levelIndex] || 0;
      var defense = skill.defense[levelIndex] || 0;
      var allRes = skill.allResistances[levelIndex] || 0;
      var manaCost = skill.manaCost[levelIndex] || 0;

      html += '<div style="margin: 5px 0;">Life (Hell): ' + lifeHell + '</div>';
      html += '<div style="margin: 5px 0; color: #cccccc;">Power Strike Level: ' + powerStrikeLevel + '</div>';
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRating + '%</div>';
      html += '<div style="margin: 5px 0;">Defense: +' + defense + '%</div>';
      html += '<div style="margin: 5px 0; color: #aaffaa;">All Resistances: +' + allRes + '%</div>';
      html += '<div style="margin: 5px 0; color: #ffff00;">Mana Cost: ' + manaCost + '</div>';
      html += '<div style="margin: 5px 0;">Cooldown: ' + skill.cooldown + 's</div>';
      html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic;">Can summon additional Valkyrie at levels 20 and 30</div>';
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

    // Use window.getItemData to support both regular and crafted items
    var weapon = window.getItemData ? window.getItemData(weaponDropdown.value) : itemList[weaponDropdown.value];
    if (!weapon || !weapon.properties) {
      return { min: 1, max: 2 };
    }

    var min = weapon.properties.onehandmin || weapon.properties.twohandmin || 1;
    var max = weapon.properties.onehandmax || weapon.properties.twohandmax || 2;

    return { min: min, max: max };
  }

  calculatePhysicalDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Base skill damage bonus (just from the skill itself)
    var skillDamageBonus;
    if (Array.isArray(skill.damage)) {
      var levelIndex = Math.min(skillLevel - 1, skill.damage.length - 1);
      skillDamageBonus = skill.damage[levelIndex] || 0;
    } else if (skill.damage && skill.damage.base !== undefined) {
      skillDamageBonus = skill.damage.base + (skill.damage.perLevel * (skillLevel - 1));
    } else {
      skillDamageBonus = 0;
    }

    // Get synergy bonus separately
    var synergyBonus = this.calculateSynergyBonus(skillId, 'physical');

    // Get mastery damage bonus (applies to all relevant weapon masteries)
    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();

    // Calculate total damage bonus percentage (all bonuses are additive)
    var totalDamageBonus = skillDamageBonus + synergyBonus + masteryDamageBonus;

    // Dexterity/Strength bonus (depends on weapon, simplified here for now)
    var statBonus = Math.floor(dexterity * 1);

    // Get weapon elemental damages
    var elementalDamages = this.getWeaponElementalDamages();

    // Get flat damage bonuses from socketed items (jewels, runes, gems)
    var toMinDmgContainer = document.getElementById('tomindmgcontainer');
    var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
    var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
    var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

    // Handle flat damage from the skill itself (adds to weapon base before ED)
    var skillFlatMin = 0;
    var skillFlatMax = 0;

    if (skillId === 'bashcontainer' && skill.flatDamage) {
      var levelIndex = Math.min(skillLevel - 1, skill.flatDamage.length - 1);
      skillFlatMin = skill.flatDamage[levelIndex] || 0;
      skillFlatMax = skill.flatDamage[levelIndex] || 0;
    } else if ((skillId === 'bladesentinelcontainer' || skillId === 'bladefurycontainer') && skill.damage && skill.damage.min) {
      var levelIndex = Math.min(skillLevel - 1, skill.damage.min.length - 1);
      skillFlatMin = skill.damage.min[levelIndex] || 0;
      skillFlatMax = skill.damage.max[levelIndex] || 0;
    } else if (skillId === 'stuncontainer' && skill.physicalDamageMin) {
      var levelIndex = Math.min(skillLevel - 1, skill.physicalDamageMin.length - 1);
      skillFlatMin = skill.physicalDamageMin[levelIndex] || 0;
      skillFlatMax = skill.physicalDamageMax[levelIndex] || 0;
    }

    // Apply weapon damage multiplier (e.g. Stun 25%, Blade Sentinel 75%)
    var weaponMultiplier = skill.weaponDamageMultiplier || (skill.weaponDamageBonus ? skill.weaponDamageBonus / 100 : 1);
    var effectiveWeaponMin = weaponDamage.min * weaponMultiplier;
    var effectiveWeaponMax = weaponDamage.max * weaponMultiplier;

    // Total multiplier (Skill ED + Mastery ED + Stat ED)
    var damageMultiplier = (1 + totalDamageBonus / 100 + statBonus / 100);

    // Calculate base physical damage with all bonuses
    // Total physical damage = (Base Weapon * Multiplier + Skill Flat) * Multiplier + Socket Flat * Multiplier
    var baseMinDamage = Math.floor((effectiveWeaponMin + skillFlatMin) * damageMultiplier) + Math.floor(toMinDmg * damageMultiplier);
    var baseMaxDamage = Math.floor((effectiveWeaponMax + skillFlatMax) * damageMultiplier) + Math.floor(toMaxDmg * damageMultiplier);

    // Get individual critical chances (each capped at 75%)
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);



    // NEW CRIT SYSTEM: Calculate total crit chance using multiplicative formula
    // Total Crit Chance = 1 - ((1 - DS) * (1 - CS) * (1 - WM))
    var totalCritChance = 1 - ((1 - deadlyStrike / 100) * (1 - criticalStrike / 100) * (1 - weaponMastery / 100));

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

  calculateMagicConversionDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Base skill damage bonus
    var skillDamageBonus;
    if (Array.isArray(skill.damage)) {
      var levelIndex = Math.min(skillLevel - 1, skill.damage.length - 1);
      skillDamageBonus = skill.damage[levelIndex] || 0;
    } else if (skill.damage) {
      skillDamageBonus = skill.damage.base + (skill.damage.perLevel * (skillLevel - 1));
    } else {
      skillDamageBonus = 0;
    }

    // Get synergy bonus
    var synergyBonus = this.calculateSynergyBonus(skillId, skill.magicDamage ? 'magic' : 'physical');

    // Get mastery damage bonus
    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();

    // Calculate total damage bonus
    var totalDamageBonus = skillDamageBonus + synergyBonus + masteryDamageBonus;

    // Dexterity bonus
    var statBonus = Math.floor(dexterity * 1);

    // Get weapon elemental damages
    var elementalDamages = this.getWeaponElementalDamages();

    // Get flat damage bonuses
    var toMinDmgContainer = document.getElementById('tomindmgcontainer');
    var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
    var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
    var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

    var magicMin, magicMax, physicalMin, physicalMax;

    // Check if this is Magic Arrow style (fixed magic damage) or Concentrate style (percentage conversion)
    if (skill.magicDamage) {
      // Magic Arrow style: has fixed magic damage values PLUS converts physical to magic
      var levelIndex = Math.min(skillLevel - 1, skill.magicDamage.min.length - 1);
      var baseMagicMin = skill.magicDamage.min[levelIndex] || 0;
      var baseMagicMax = skill.magicDamage.max[levelIndex] || 0;

      // Apply bonuses to the fixed magic damage
      var fixedMagicMin = Math.floor(baseMagicMin * (1 + totalDamageBonus / 100));
      var fixedMagicMax = Math.floor(baseMagicMax * (1 + totalDamageBonus / 100));

      // Calculate total physical damage first
      var toMinDmgWithBonuses = Math.floor(toMinDmg * (1 + totalDamageBonus / 100 + statBonus / 100));
      var toMaxDmgWithBonuses = Math.floor(toMaxDmg * (1 + totalDamageBonus / 100 + statBonus / 100));
      var totalPhysicalMin = Math.floor(weaponDamage.min * (1 + totalDamageBonus / 100 + statBonus / 100)) + toMinDmgWithBonuses;
      var totalPhysicalMax = Math.floor(weaponDamage.max * (1 + totalDamageBonus / 100 + statBonus / 100)) + toMaxDmgWithBonuses;

      // Convert percentage of physical to magic (e.g., 75% for Magic Arrow)
      var conversionPercent = skill.convertsPhysical || 0;
      var convertedMagicMin = Math.floor(totalPhysicalMin * (conversionPercent / 100));
      var convertedMagicMax = Math.floor(totalPhysicalMax * (conversionPercent / 100));

      // Total magic = fixed magic damage + converted physical damage
      magicMin = fixedMagicMin + convertedMagicMin;
      magicMax = fixedMagicMax + convertedMagicMax;

      // Remaining physical damage
      physicalMin = totalPhysicalMin - convertedMagicMin;
      physicalMax = totalPhysicalMax - convertedMagicMax;
    } else {
      // Concentrate style: converts percentage of physical damage to magic
      var toMinDmgWithBonuses = Math.floor(toMinDmg * (1 + totalDamageBonus / 100 + statBonus / 100));
      var toMaxDmgWithBonuses = Math.floor(toMaxDmg * (1 + totalDamageBonus / 100 + statBonus / 100));

      // Calculate base physical damage with all bonuses
      var totalPhysicalMin = Math.floor(weaponDamage.min * (1 + totalDamageBonus / 100 + statBonus / 100)) + toMinDmgWithBonuses;
      var totalPhysicalMax = Math.floor(weaponDamage.max * (1 + totalDamageBonus / 100 + statBonus / 100)) + toMaxDmgWithBonuses;

      // Get magic conversion percentage (based on invested points)
      var skillInput = document.getElementById(skillId);
      var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
      var conversionPercent = 0;
      if (skill.magicConversion) {
        var investedIndex = Math.min(baseSkillLevel, skill.magicConversion.length - 1);
        conversionPercent = skill.magicConversion[investedIndex] || 0;
      }

      // Split damage between physical and magic
      magicMin = Math.floor(totalPhysicalMin * (conversionPercent / 100));
      magicMax = Math.floor(totalPhysicalMax * (conversionPercent / 100));
      physicalMin = totalPhysicalMin - magicMin;
      physicalMax = totalPhysicalMax - magicMax;
    }

    // Get critical strike chances
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);

    // Calculate total crit chance
    var totalCritChance = 1 - ((1 - deadlyStrike / 100) * (1 - criticalStrike / 100) * (1 - weaponMastery / 100));
    totalCritChance = Math.floor(totalCritChance * 100);
    totalCritChance = Math.min(totalCritChance, 95);

    // Crit multiplier (1.5x on crit)
    var critMultiplier = 1 + (totalCritChance / 100) * 0.5;

    // Apply crit to physical portion only
    var physicalMinWithCrits = Math.floor(physicalMin * critMultiplier);
    var physicalMaxWithCrits = Math.floor(physicalMax * critMultiplier);

    // Total damage (physical with crits + magic + elemental)
    var totalMinDamage = physicalMinWithCrits + magicMin + elementalDamages.fire.min + elementalDamages.cold.min + elementalDamages.lightning.min + elementalDamages.poison.min;
    var totalMaxDamage = physicalMaxWithCrits + magicMax + elementalDamages.fire.max + elementalDamages.cold.max + elementalDamages.lightning.max + elementalDamages.poison.max;

    return {
      min: totalMinDamage,
      max: totalMaxDamage,
      average: Math.floor((totalMinDamage + totalMaxDamage) / 2),
      physicalMin: physicalMinWithCrits,
      physicalMax: physicalMaxWithCrits,
      magicMin: magicMin,
      magicMax: magicMax,
      skillBonus: skillDamageBonus,
      synergyBonus: synergyBonus,
      masteryDamageBonus: masteryDamageBonus,
      statBonus: statBonus,
      elementalDamages: elementalDamages,
      criticalStrike: criticalStrike,
      deadlyStrike: deadlyStrike,
      weaponMastery: weaponMastery,
      totalCritChance: totalCritChance,
      critMultiplier: critMultiplier.toFixed(2)
    };
  }

  calculateLightningConversionDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Base skill damage bonus
    var skillDamageBonus = 0;
    if (skill.damage) {
      if (Array.isArray(skill.damage)) {
        var levelIndex = Math.min(skillLevel - 1, skill.damage.length - 1);
        skillDamageBonus = skill.damage[levelIndex] || 0;
      } else {
        skillDamageBonus = skill.damage.base + (skill.damage.perLevel * (skillLevel - 1));
      }
    }

    // Get synergy bonus
    var synergyBonus = this.calculateSynergyBonus(skillId, 'lightning');

    // Get mastery damage bonus
    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();

    // Calculate total damage bonus
    var totalDamageBonus = skillDamageBonus + synergyBonus + masteryDamageBonus;

    // Dexterity bonus
    var statBonus = Math.floor(dexterity * 1);

    // Get flat damage bonuses
    var toMinDmgContainer = document.getElementById('tomindmgcontainer');
    var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
    var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
    var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

    // Apply percentage bonuses to flat damage
    var toMinDmgWithBonuses = Math.floor(toMinDmg * (1 + totalDamageBonus / 100 + statBonus / 100));
    var toMaxDmgWithBonuses = Math.floor(toMaxDmg * (1 + totalDamageBonus / 100 + statBonus / 100));

    // Calculate base physical damage with all bonuses
    var totalPhysicalMin = Math.floor(weaponDamage.min * (1 + totalDamageBonus / 100 + statBonus / 100)) + toMinDmgWithBonuses;
    var totalPhysicalMax = Math.floor(weaponDamage.max * (1 + totalDamageBonus / 100 + statBonus / 100)) + toMaxDmgWithBonuses;

    // Lightning Conversion: Bolts use lightningDamage properties
    var baseLightningMin = 0;
    var baseLightningMax = 0;
    if (skill.lightningDamage) {
      if (Array.isArray(skill.lightningDamage.min)) {
        var levelIndex = Math.min(skillLevel - 1, skill.lightningDamage.min.length - 1);
        baseLightningMin = skill.lightningDamage.min[levelIndex] || 0;
        baseLightningMax = skill.lightningDamage.max[levelIndex] || 0;
      } else {
        baseLightningMin = (skill.lightningDamage.min.base || 0) + ((skill.lightningDamage.min.perLevel || 0) * (skillLevel - 1));
        baseLightningMax = (skill.lightningDamage.max.base || 0) + ((skill.lightningDamage.max.perLevel || 0) * (skillLevel - 1));
      }
    }

    // Apply synergy bonus to lightning damage
    var lightningMin = Math.floor(baseLightningMin * (1 + synergyBonus / 100)) + totalPhysicalMin;
    var lightningMax = Math.floor(baseLightningMax * (1 + synergyBonus / 100)) + totalPhysicalMax;

    // Get critical strike chances
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);

    var totalCritChance = 1 - ((1 - deadlyStrike / 100) * (1 - criticalStrike / 100) * (1 - weaponMastery / 100));
    totalCritChance = Math.floor(totalCritChance * 100);
    totalCritChance = Math.min(totalCritChance, 95);

    var critMultiplier = 1 + (totalCritChance / 100) * 0.5;

    return {
      lightningMin: lightningMin,
      lightningMax: lightningMax,
      averageLightning: Math.floor((lightningMin + lightningMax) / 2),
      synergyBonus: synergyBonus,
      statBonus: statBonus,
      masteryDamageBonus: masteryDamageBonus,
      criticalStrike: criticalStrike,
      deadlyStrike: deadlyStrike,
      weaponMastery: weaponMastery,
      critMultiplier: critMultiplier.toFixed(2)
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
    // First, try to get deadly strike from socket system stats (works for both static and dynamic items)
    if (window.unifiedSocketSystem && window.unifiedSocketSystem.stats) {
      return Math.min(window.unifiedSocketSystem.stats.deadlyStrike || 0, 75);
    }

    // Fallback: Check weapon for deadly strike (for static items)
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

    // Return deadlyStrike, capped at 75%
    return Math.min(deadlyStrike, 75);
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

  calculateLightningConversionDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Calculate physical damage that will be converted
    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();
    var statBonus = Math.floor(dexterity * 1);

    // Get flat damage bonuses from socketed items (jewels, runes, gems)
    var toMinDmgContainer = document.getElementById('tomindmgcontainer');
    var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
    var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
    var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

    // Apply percentage bonuses to flat damage
    var toMinDmgWithBonuses = Math.floor(toMinDmg * (1 + masteryDamageBonus / 100 + statBonus / 100));
    var toMaxDmgWithBonuses = Math.floor(toMaxDmg * (1 + masteryDamageBonus / 100 + statBonus / 100));

    // Calculate base physical damage (weapon × bonuses + flat bonuses with bonuses applied)
    var convertedPhysicalMin = Math.floor((weaponDamage.min) * (1 + masteryDamageBonus / 100 + statBonus / 100)) + toMinDmgWithBonuses;
    var convertedPhysicalMax = Math.floor((weaponDamage.max) * (1 + masteryDamageBonus / 100 + statBonus / 100)) + toMaxDmgWithBonuses;

    // Get skill's base lightning damage
    var levelIndex = Math.min(skillLevel - 1, 59);
    var skillLightningMin = skill.lightningDamage.min[levelIndex] || 1;
    var skillLightningMax = skill.lightningDamage.max[levelIndex] || 1;

    // Apply synergies ONLY to skill's lightning damage, NOT to converted weapon damage
    var synergyBonus = this.calculateSynergyBonus(skillId, 'lightning');
    var skillLightningWithSynergiesMin = Math.floor(skillLightningMin * (1 + synergyBonus / 100));
    var skillLightningWithSynergiesMax = Math.floor(skillLightningMax * (1 + synergyBonus / 100));

    // Total lightning = converted physical (no synergies) + skill lightning (with synergies)
    var lightningMin = convertedPhysicalMin + skillLightningWithSynergiesMin;
    var lightningMax = convertedPhysicalMax + skillLightningWithSynergiesMax;

    // Get critical strike chances
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);

    // Calculate total crit chance
    var totalCritChance = 1 - ((1 - deadlyStrike / 100) * (1 - criticalStrike / 100) * (1 - weaponMastery / 100));
    totalCritChance = Math.floor(totalCritChance * 100);
    totalCritChance = Math.min(totalCritChance, 95);

    // Apply crit multiplier (1.5x on crit)
    var critMultiplier = 1 + (totalCritChance / 100) * 0.5;

    // CRITICAL STRIKES ONLY APPLY TO PHYSICAL DAMAGE (converted portion)
    // Apply crit to the converted physical damage BEFORE it becomes lightning
    var convertedPhysicalWithCritsMin = Math.floor(convertedPhysicalMin * critMultiplier);
    var convertedPhysicalWithCritsMax = Math.floor(convertedPhysicalMax * critMultiplier);

    // Total lightning = converted physical (with crits) + skill lightning (no crits)
    var finalLightningMin = convertedPhysicalWithCritsMin + skillLightningWithSynergiesMin;
    var finalLightningMax = convertedPhysicalWithCritsMax + skillLightningWithSynergiesMax;

    return {
      lightningMin: finalLightningMin,
      lightningMax: finalLightningMax,
      averageLightning: Math.floor((finalLightningMin + finalLightningMax) / 2),
      synergyBonus: synergyBonus,
      masteryDamageBonus: masteryDamageBonus,
      statBonus: statBonus,
      criticalStrike: criticalStrike,
      deadlyStrike: deadlyStrike,
      weaponMastery: weaponMastery,
      critMultiplier: critMultiplier.toFixed(2)
    };
  }


  calculateFireConversionDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Fire Arrow converts 50% of BASE weapon damage to fire
    // Then applies Dex/Mastery bonuses only to the remaining 50% physical

    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();
    var statBonus = Math.floor(dexterity * 1);

    // Get flat damage bonuses from socketed items
    var toMinDmgContainer = document.getElementById('tomindmgcontainer');
    var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
    var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
    var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

    // Convert 50% of BASE weapon damage to fire (no bonuses applied yet)
    var conversionPercent = skill.convertsPhysical || 50;
    var convertedFireMin = Math.floor(weaponDamage.min * (conversionPercent / 100));
    var convertedFireMax = Math.floor(weaponDamage.max * (conversionPercent / 100));

    // Remaining 50% stays as physical
    var remainingPhysicalMin = weaponDamage.min - convertedFireMin;
    var remainingPhysicalMax = weaponDamage.max - convertedFireMax;

    // Apply Dex/Mastery bonuses ONLY to the remaining physical damage
    var bonusedPhysicalMin = Math.floor(remainingPhysicalMin * (1 + masteryDamageBonus / 100 + statBonus / 100));
    var bonusedPhysicalMax = Math.floor(remainingPhysicalMax * (1 + masteryDamageBonus / 100 + statBonus / 100));

    // Apply bonuses to flat damage and add to physical
    var toMinDmgWithBonuses = Math.floor(toMinDmg * (1 + masteryDamageBonus / 100 + statBonus / 100));
    var toMaxDmgWithBonuses = Math.floor(toMaxDmg * (1 + masteryDamageBonus / 100 + statBonus / 100));
    bonusedPhysicalMin += toMinDmgWithBonuses;
    bonusedPhysicalMax += toMaxDmgWithBonuses;

    // Get skill's base fire damage
    var levelIndex = Math.min(skillLevel - 1, 59);
    var skillFireMin = skill.fireDamage.min[levelIndex] || 0;
    var skillFireMax = skill.fireDamage.max[levelIndex] || 0;

    // Apply synergies ONLY to skill's fire damage, NOT to converted weapon damage
    var synergyBonus = this.calculateSynergyBonus(skillId, 'fire');
    var skillFireWithSynergiesMin = Math.floor(skillFireMin * (1 + synergyBonus / 100));
    var skillFireWithSynergiesMax = Math.floor(skillFireMax * (1 + synergyBonus / 100));

    // Total fire = converted physical (no synergies) + skill fire (with synergies)
    var fireMin = convertedFireMin + skillFireWithSynergiesMin;
    var fireMax = convertedFireMax + skillFireWithSynergiesMax;

    // Get elemental damages from equipment
    var elementalDamages = this.getWeaponElementalDamages();

    // Get critical strike chances
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);

    // Calculate total crit chance
    var totalCritChance = 1 - ((1 - deadlyStrike / 100) * (1 - criticalStrike / 100) * (1 - weaponMastery / 100));
    totalCritChance = Math.floor(totalCritChance * 100);
    totalCritChance = Math.min(totalCritChance, 95);

    // Apply crit multiplier (1.5x on crit)
    var critMultiplier = 1 + (totalCritChance / 100) * 0.5;

    // CRITICAL STRIKES ONLY APPLY TO PHYSICAL DAMAGE
    // Apply crit to converted physical BEFORE it becomes fire, and to remaining physical
    var convertedFireWithCritsMin = Math.floor(convertedFireMin * critMultiplier);
    var convertedFireWithCritsMax = Math.floor(convertedFireMax * critMultiplier);
    var finalPhysicalMin = Math.floor(bonusedPhysicalMin * critMultiplier);
    var finalPhysicalMax = Math.floor(bonusedPhysicalMax * critMultiplier);

    // Total fire = converted physical (with crits) + skill fire (no crits)
    var finalFireMin = convertedFireWithCritsMin + skillFireWithSynergiesMin;
    var finalFireMax = convertedFireWithCritsMax + skillFireWithSynergiesMax;

    // Total damage = fire + remaining physical + other elemental
    var totalMin = finalFireMin + finalPhysicalMin + elementalDamages.cold.min + elementalDamages.lightning.min + elementalDamages.poison.min;
    var totalMax = finalFireMax + finalPhysicalMax + elementalDamages.cold.max + elementalDamages.lightning.max + elementalDamages.poison.max;

    return {
      fireMin: finalFireMin,
      fireMax: finalFireMax,
      physicalMin: finalPhysicalMin,
      physicalMax: finalPhysicalMax,
      totalMin: totalMin,
      totalMax: totalMax,
      average: Math.floor((totalMin + totalMax) / 2),
      synergyBonus: synergyBonus,
      masteryDamageBonus: masteryDamageBonus,
      statBonus: statBonus,
      criticalStrike: criticalStrike,
      deadlyStrike: deadlyStrike,
      weaponMastery: weaponMastery,
      critMultiplier: critMultiplier.toFixed(2),
      elementalDamages: elementalDamages
    };
  }

  calculateColdConversionDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Cold Arrow converts 50% of BASE weapon damage to cold
    // Then applies Dex/Mastery bonuses only to the remaining 50% physical

    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();
    var statBonus = Math.floor(dexterity * 1);

    // Get flat damage bonuses from socketed items
    var toMinDmgContainer = document.getElementById('tomindmgcontainer');
    var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
    var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
    var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

    // Convert 50% of BASE weapon damage to cold (no bonuses applied yet)
    var conversionPercent = skill.convertsPhysical || 50;
    var convertedColdMin = Math.floor(weaponDamage.min * (conversionPercent / 100));
    var convertedColdMax = Math.floor(weaponDamage.max * (conversionPercent / 100));

    // Remaining 50% stays as physical
    var remainingPhysicalMin = weaponDamage.min - convertedColdMin;
    var remainingPhysicalMax = weaponDamage.max - convertedColdMax;

    // Apply Dex/Mastery bonuses ONLY to the remaining physical damage
    var bonusedPhysicalMin = Math.floor(remainingPhysicalMin * (1 + masteryDamageBonus / 100 + statBonus / 100));
    var bonusedPhysicalMax = Math.floor(remainingPhysicalMax * (1 + masteryDamageBonus / 100 + statBonus / 100));

    // Apply bonuses to flat damage and add to physical
    var toMinDmgWithBonuses = Math.floor(toMinDmg * (1 + masteryDamageBonus / 100 + statBonus / 100));
    var toMaxDmgWithBonuses = Math.floor(toMaxDmg * (1 + masteryDamageBonus / 100 + statBonus / 100));
    bonusedPhysicalMin += toMinDmgWithBonuses;
    bonusedPhysicalMax += toMaxDmgWithBonuses;

    // Get skill's base cold damage
    var levelIndex = Math.min(skillLevel - 1, 59);
    var skillColdMin = skill.coldDamage.min[levelIndex] || 0;
    var skillColdMax = skill.coldDamage.max[levelIndex] || 0;

    // Apply synergies ONLY to skill's cold damage, NOT to converted weapon damage
    var synergyBonus = this.calculateSynergyBonus(skillId, 'cold');
    var skillColdWithSynergiesMin = Math.floor(skillColdMin * (1 + synergyBonus / 100));
    var skillColdWithSynergiesMax = Math.floor(skillColdMax * (1 + synergyBonus / 100));

    // Total cold = converted physical (no synergies) + skill cold (with synergies)
    var coldMin = convertedColdMin + skillColdWithSynergiesMin;
    var coldMax = convertedColdMax + skillColdWithSynergiesMax;

    // Get elemental damages from equipment
    var elementalDamages = this.getWeaponElementalDamages();

    // Get critical strike chances
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);

    // Calculate total crit chance
    var totalCritChance = 1 - ((1 - deadlyStrike / 100) * (1 - criticalStrike / 100) * (1 - weaponMastery / 100));
    totalCritChance = Math.floor(totalCritChance * 100);
    totalCritChance = Math.min(totalCritChance, 95);

    // Apply crit multiplier (1.5x on crit)
    var critMultiplier = 1 + (totalCritChance / 100) * 0.5;

    // CRITICAL STRIKES ONLY APPLY TO PHYSICAL DAMAGE
    // Apply crit to converted physical BEFORE it becomes cold, and to remaining physical
    var convertedColdWithCritsMin = Math.floor(convertedColdMin * critMultiplier);
    var convertedColdWithCritsMax = Math.floor(convertedColdMax * critMultiplier);
    var finalPhysicalMin = Math.floor(bonusedPhysicalMin * critMultiplier);
    var finalPhysicalMax = Math.floor(bonusedPhysicalMax * critMultiplier);

    // Total cold = converted physical (with crits) + skill cold (no crits)
    var finalColdMin = convertedColdWithCritsMin + skillColdWithSynergiesMin;
    var finalColdMax = convertedColdWithCritsMax + skillColdWithSynergiesMax;

    // Total damage = cold + remaining physical + other elemental
    var totalMin = finalColdMin + finalPhysicalMin + elementalDamages.fire.min + elementalDamages.lightning.min + elementalDamages.poison.min;
    var totalMax = finalColdMax + finalPhysicalMax + elementalDamages.fire.max + elementalDamages.lightning.max + elementalDamages.poison.max;

    return {
      coldMin: finalColdMin,
      coldMax: finalColdMax,
      physicalMin: finalPhysicalMin,
      physicalMax: finalPhysicalMax,
      totalMin: totalMin,
      totalMax: totalMax,
      average: Math.floor((totalMin + totalMax) / 2),
      synergyBonus: synergyBonus,
      masteryDamageBonus: masteryDamageBonus,
      statBonus: statBonus,
      criticalStrike: criticalStrike,
      deadlyStrike: deadlyStrike,
      weaponMastery: weaponMastery,
      critMultiplier: critMultiplier.toFixed(2),
      elementalDamages: elementalDamages
    };
  }

  calculateElementalDamage(skill, skillLevel, skillId) {
    // Get base damages from tables
    var levelIndex = Math.min(skillLevel - 1, 59);
    var baseLightningMin = skill.lightningDamage.min[levelIndex] || 1;
    var baseLightningMax = skill.lightningDamage.max[levelIndex] || 1;

    // Calculate synergy bonus for lightning
    var lightningSynergyBonus = this.calculateSynergyBonus(skillId, 'lightning');

    // Apply synergies to lightning damage
    var lightningMin = Math.floor(baseLightningMin * (1 + lightningSynergyBonus / 100));
    var lightningMax = Math.floor(baseLightningMax * (1 + lightningSynergyBonus / 100));

    var result = {
      lightningMin: lightningMin,
      lightningMax: lightningMax,
      averageLightning: Math.floor((lightningMin + lightningMax) / 2),
      synergyBonus: lightningSynergyBonus
    };

    // Check if this skill has nova damage (like Power Strike)
    if (skill.novaDamage) {
      var baseNovaMin = skill.novaDamage.min[levelIndex] || 1;
      var baseNovaMax = skill.novaDamage.max[levelIndex] || 1;
      var novaSynergyBonus = this.calculateSynergyBonus(skillId, 'nova');
      var novaMin = Math.floor(baseNovaMin * (1 + novaSynergyBonus / 100));
      var novaMax = Math.floor(baseNovaMax * (1 + novaSynergyBonus / 100));

      result.novaMin = novaMin;
      result.novaMax = novaMax;
      result.averageNova = Math.floor((novaMin + novaMax) / 2);
      result.synergyBonus = Math.max(lightningSynergyBonus, novaSynergyBonus);
    }

    // Check for bolts/hits (for display)
    if (skill.bolts) {
      result.bolts = skill.bolts[levelIndex] || 0;
    }
    if (skill.chargedBolts) {
      result.chargedBolts = skill.chargedBolts[levelIndex] || 0;
    }
    if (skill.hits) {
      result.hits = skill.hits[levelIndex] || 0;
    }

    return result;
  }

  calculateColdDamage(skill, skillLevel, skillId) {
    // Get base cold damages from tables
    var levelIndex = Math.min(skillLevel - 1, 59);
    var baseColdMin = skill.coldDamage.min[levelIndex] || 0;
    var baseColdMax = skill.coldDamage.max[levelIndex] || 0;

    // Calculate synergy bonus for cold
    var coldSynergyBonus = this.calculateSynergyBonus(skillId, 'cold');

    // Apply synergies to cold damage
    var coldMin = Math.floor(baseColdMin * (1 + coldSynergyBonus / 100));
    var coldMax = Math.floor(baseColdMax * (1 + coldSynergyBonus / 100));

    return {
      coldMin: coldMin,
      coldMax: coldMax,
      averageCold: Math.floor((coldMin + coldMax) / 2),
      synergyBonus: coldSynergyBonus
    };
  }

  calculateFireDamage(skill, skillLevel, skillId) {
    // Get base fire damages from tables
    var levelIndex = Math.min(skillLevel - 1, 59);
    var baseFireMin = skill.fireDamage.min[levelIndex] || 0;
    var baseFireMax = skill.fireDamage.max[levelIndex] || 0;

    // Calculate synergy bonus for fire
    var fireSynergyBonus = this.calculateSynergyBonus(skillId, 'fire');

    // Apply synergies to fire damage
    var fireMin = Math.floor(baseFireMin * (1 + fireSynergyBonus / 100));
    var fireMax = Math.floor(baseFireMax * (1 + fireSynergyBonus / 100));

    var result = {
      fireMin: fireMin,
      fireMax: fireMax,
      averageFire: Math.floor((fireMin + fireMax) / 2),
      synergyBonus: fireSynergyBonus
    };

    // Check if this skill has burning damage (Immolation Arrow)
    if (skill.burningDamage) {
      var baseBurningMin = skill.burningDamage.min[levelIndex] || 0;
      var baseBurningMax = skill.burningDamage.max[levelIndex] || 0;

      // Apply synergies to burning damage
      var burningMin = Math.floor(baseBurningMin * (1 + fireSynergyBonus / 100));
      var burningMax = Math.floor(baseBurningMax * (1 + fireSynergyBonus / 100));

      result.burningMin = burningMin;
      result.burningMax = burningMax;
      result.averageBurning = Math.floor((burningMin + burningMax) / 2);
    }

    return result;
  }

  calculatePhysicalMagicHybridDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Guided Arrow: Physical skill with optional magic conversion based on Magic Arrow synergy
    // Magic Arrow synergy: +1% magic conversion per 2 levels (0.5% per level)

    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();
    var statBonus = Math.floor(dexterity * 1);

    // Get flat damage bonuses from socketed items
    var toMinDmgContainer = document.getElementById('tomindmgcontainer');
    var toMaxDmgContainer = document.getElementById('tomaxdmgcontainer');
    var toMinDmg = toMinDmgContainer ? (parseInt(toMinDmgContainer.textContent) || 0) : 0;
    var toMaxDmg = toMaxDmgContainer ? (parseInt(toMaxDmgContainer.textContent) || 0) : 0;

    // Get skill damage bonus
    var levelIndex = Math.min(skillLevel - 1, 59);
    var skillBonus = skill.damage[levelIndex] || 0;

    // Calculate magic conversion percentage from Magic Arrow synergy
    var magicArrowInput = document.getElementById('magicarrowcontainer');
    var magicArrowLevel = magicArrowInput ? (parseInt(magicArrowInput.value) || 0) : 0;
    var conversionPercent = Math.floor(magicArrowLevel * 0.5); // 1% per 2 levels
    conversionPercent = Math.min(conversionPercent, 100); // Cap at 100%

    // Calculate base weapon damage with bonuses
    var baseMin = weaponDamage.min + toMinDmg;
    var baseMax = weaponDamage.max + toMaxDmg;

    // Apply skill bonus, dex bonus, and mastery to base damage
    var totalBonusPercent = skillBonus + statBonus + masteryDamageBonus;
    var bonusedMin = Math.floor(baseMin * (1 + totalBonusPercent / 100));
    var bonusedMax = Math.floor(baseMax * (1 + totalBonusPercent / 100));

    // Split into physical and magic based on conversion
    var convertedMagicMin = Math.floor(bonusedMin * (conversionPercent / 100));
    var convertedMagicMax = Math.floor(bonusedMax * (conversionPercent / 100));
    var remainingPhysicalMin = bonusedMin - convertedMagicMin;
    var remainingPhysicalMax = bonusedMax - convertedMagicMax;

    // Get elemental damages from equipment
    var elementalDamages = this.getWeaponElementalDamages();

    // Get critical strike chances
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);

    // Calculate total crit chance
    var totalCritChance = 1 - ((1 - deadlyStrike / 100) * (1 - criticalStrike / 100) * (1 - weaponMastery / 100));
    totalCritChance = Math.floor(totalCritChance * 100);
    totalCritChance = Math.min(totalCritChance, 95);

    // Apply crit multiplier (1.5x on crit) - only to physical portion
    var critMultiplier = 1 + (totalCritChance / 100) * 0.5;
    var finalPhysicalMin = Math.floor(remainingPhysicalMin * critMultiplier);
    var finalPhysicalMax = Math.floor(remainingPhysicalMax * critMultiplier);

    // Magic damage doesn't get crit
    var finalMagicMin = convertedMagicMin;
    var finalMagicMax = convertedMagicMax;

    // Total damage
    var totalMin = finalPhysicalMin + finalMagicMin + elementalDamages.fire.min + elementalDamages.cold.min + elementalDamages.lightning.min + elementalDamages.poison.min;
    var totalMax = finalPhysicalMax + finalMagicMax + elementalDamages.fire.max + elementalDamages.cold.max + elementalDamages.lightning.max + elementalDamages.poison.max;

    return {
      physicalMin: finalPhysicalMin,
      physicalMax: finalPhysicalMax,
      magicMin: finalMagicMin,
      magicMax: finalMagicMax,
      totalMin: totalMin,
      totalMax: totalMax,
      average: Math.floor((totalMin + totalMax) / 2),
      skillBonus: skillBonus,
      masteryDamageBonus: masteryDamageBonus,
      statBonus: statBonus,
      conversionPercent: conversionPercent,
      criticalStrike: criticalStrike,
      deadlyStrike: deadlyStrike,
      weaponMastery: weaponMastery,
      critMultiplier: critMultiplier.toFixed(2),
      elementalDamages: elementalDamages
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
    var oldValue = parseInt(input.getAttribute('data-old-value')) || 0;
    var skillLevel = parseInt(input.getAttribute('data-skill-level')) || 1;
    var maxAllowed = this.getMaxAllowed(skillLevel);

    // If removing points, check if any skills depend on this one
    if (newValue < oldValue && newValue === 0) {
      this.removeDependentSkillPoints(input.id);
    }

    // Check prerequisites if trying to add points
    if (newValue > 0 && !this.checkPrerequisites(input.id)) {
      input.value = 0;
      this.showWarning('Prerequisites not met for this skill');
      this.updatePointsDisplay();
      return;
    }

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

    // Store current value for next change detection
    input.setAttribute('data-old-value', input.value);

    this.updatePointsDisplay();
    this.updateSkillVisuals();

    // Update bonus indicator for this skill (uses existing item bonus)
    this.updateSingleSkillBonus(input.id);
  }

  // Remove points from skills that depend on this skill
  removeDependentSkillPoints(skillId) {
    var currentClassSkills = this.classSkillTrees[this.currentClass];
    if (!currentClassSkills) return;

    // Find all skills that have this skill as a prerequisite
    for (var treeName in currentClassSkills) {
      var skills = currentClassSkills[treeName];
      for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        if (skill.prerequisites && skill.prerequisites.indexOf(skillId) !== -1) {
          var dependentInput = document.getElementById(skill.id);
          if (dependentInput && parseInt(dependentInput.value) > 0) {
            dependentInput.value = 0;
            dependentInput.setAttribute('data-old-value', '0');
            // Recursively remove dependent skills
            this.removeDependentSkillPoints(skill.id);
          }
        }
      }
    }
  }

  // Check if a skill's prerequisites are met
  checkPrerequisites(skillId) {
    // Get current class skills
    var currentClassSkills = this.classSkillTrees[this.currentClass];
    if (!currentClassSkills) return true;

    // Find the skill definition
    var skillDef = null;
    for (var treeName in currentClassSkills) {
      var skills = currentClassSkills[treeName];
      for (var i = 0; i < skills.length; i++) {
        if (skills[i].id === skillId) {
          skillDef = skills[i];
          break;
        }
      }
      if (skillDef) break;
    }

    if (!skillDef || !skillDef.prerequisites || skillDef.prerequisites.length === 0) {
      return true; // No prerequisites
    }

    // Check if all prerequisites have at least 1 point
    for (var i = 0; i < skillDef.prerequisites.length; i++) {
      var prereqId = skillDef.prerequisites[i];
      var prereqInput = document.getElementById(prereqId);
      if (!prereqInput || parseInt(prereqInput.value) === 0) {
        return false;
      }
    }

    return true;
  }

  // Update visual styling of skills based on prerequisites
  updateSkillVisuals() {
    var currentClassSkills = this.classSkillTrees[this.currentClass];
    if (!currentClassSkills) return;

    // Iterate through all skills
    for (var treeName in currentClassSkills) {
      var skills = currentClassSkills[treeName];
      for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        var input = document.getElementById(skill.id);
        if (!input) continue;

        var canAllocate = this.checkPrerequisites(skill.id);
        var skillDiv = input.parentElement;

        if (canAllocate) {
          // Skill is available
          skillDiv.style.opacity = '1';
          input.disabled = false;
          input.style.cursor = 'text';
        } else {
          // Skill is locked
          skillDiv.style.opacity = '0.5';
          if (parseInt(input.value) === 0) {
            input.disabled = true;
            input.style.cursor = 'not-allowed';
          }
        }
      }
    }
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

    // First pass: Check individual skill level requirements
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var currentValue = parseInt(input.value) || 0;
      var skillLevel = parseInt(input.getAttribute('data-skill-level')) || 1;
      var maxAllowed = this.getMaxAllowed(skillLevel);

      // If value exceeds new max based on level requirement, reduce it
      if (currentValue > maxAllowed) {
        input.value = maxAllowed;
        anyChanged = true;
      }
    }

    // Second pass: Check if total points exceed available points
    var totalUsed = this.getTotalUsed();
    if (totalUsed > this.maxSkillPoints) {
      var excess = totalUsed - this.maxSkillPoints;

      // Reduce skills starting from highest values until we're within limit
      while (excess > 0) {
        var highestInput = null;
        var highestValue = 0;

        // Find skill with highest value > 0
        for (var i = 0; i < inputs.length; i++) {
          var val = parseInt(inputs[i].value) || 0;
          if (val > highestValue) {
            highestValue = val;
            highestInput = inputs[i];
          }
        }

        if (highestInput && highestValue > 0) {
          // Reduce this skill by 1
          highestInput.value = highestValue - 1;
          excess--;
          anyChanged = true;
        } else {
          // Safety break if we can't find any skills to reduce
          break;
        }
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
    setTimeout(function () { warning.style.display = 'none'; }, 3000);
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

  // Rebuild skill trees when class changes
  rebuildSkillTrees() {
    // Recreate containers for new class
    this.createContainers();

    // Populate skills for new class
    this.populateSkills();

    // Update points display
    this.updatePointsDisplay();

    // Update skill visuals based on prerequisites
    this.updateSkillVisuals();

    // Re-populate skill dropdown
    setTimeout(() => { this.updateSkillDropdown(); }, 100);
  }

  // Update skill bonuses from item equipment
  updateSkillBonuses(allSkillsBonus, classSkillsBonus, treeSkillsBonus) {
    // Store all types of bonuses separately
    this.skillBonuses.allSkills = allSkillsBonus || 0;
    this.skillBonuses.classSkills = classSkillsBonus || 0;
    this.skillBonuses.treeSkills = treeSkillsBonus || {};

    // Update all skill inputs' bonus indicators
    var currentClassSkills = this.classSkillTrees[this.currentClass] || this.classSkillTrees['Amazon'];

    Object.keys(currentClassSkills).forEach((containerId) => {
      var skills = currentClassSkills[containerId];

      skills.forEach((skill) => {
        this.updateSingleSkillBonus(skill.id);
      });
    });

    // Update the active skill dropdown to show new bonus values
    this.updateSkillDropdown();
  }

  // Update a single skill's bonus indicator
  updateSingleSkillBonus(skillId) {
    var bonusSpan = document.getElementById(skillId + '_bonus');
    var skillInput = document.getElementById(skillId);

    if (bonusSpan && skillInput) {
      // Combine all types of bonuses
      var allSkillsBonus = this.skillBonuses.allSkills || 0;
      var classSkillsBonus = this.skillBonuses.classSkills || 0;

      // Find if this skill belongs to a tree that has a bonus
      var treeBonus = 0;
      var currentClassSkills = this.classSkillTrees[this.currentClass] || this.classSkillTrees['Amazon'];

      Object.keys(currentClassSkills).forEach((containerId) => {
        var skillsInTree = currentClassSkills[containerId];
        var isSkillInTree = skillsInTree.some(s => s.id === skillId);
        if (isSkillInTree) {
          treeBonus = this.skillBonuses.treeSkills[containerId] || 0;
        }
      });

      var totalBonus = allSkillsBonus + classSkillsBonus + treeBonus;
      var baseValue = parseInt(skillInput.value) || 0;

      // Only show bonus if skill has actual points AND there's a bonus
      if (baseValue > 0 && totalBonus > 0) {
        var totalValue = baseValue + totalBonus;
        bonusSpan.textContent = totalValue;
        bonusSpan.style.color = '#00ff00';
      } else {
        bonusSpan.textContent = '';
      }
    }
  }

  calculateElementalDamage(skill, skillLevel, skillId) {
    var fireMin = 0;
    var fireMax = 0;
    var lightningMin = 0;
    var lightningMax = 0;
    var coldMin = 0;
    var coldMax = 0;

    if (skill.fireDamage) {
      if (Array.isArray(skill.fireDamage.min)) {
        var index = Math.min(skillLevel - 1, skill.fireDamage.min.length - 1);
        fireMin = skill.fireDamage.min[index] || 0;
        fireMax = skill.fireDamage.max[index] || 0;
      } else {
        fireMin = (skill.fireDamage.min.base || 0) + ((skill.fireDamage.min.perLevel || 0) * (skillLevel - 1));
        fireMax = (skill.fireDamage.max.base || 0) + ((skill.fireDamage.max.perLevel || 0) * (skillLevel - 1));
      }
    }
    if (skill.lightningDamage) {
      if (Array.isArray(skill.lightningDamage.min)) {
        var index = Math.min(skillLevel - 1, skill.lightningDamage.min.length - 1);
        lightningMin = skill.lightningDamage.min[index] || 0;
        lightningMax = skill.lightningDamage.max[index] || 0;
      } else {
        lightningMin = (skill.lightningDamage.min.base || 0) + ((skill.lightningDamage.min.perLevel || 0) * (skillLevel - 1));
        lightningMax = (skill.lightningDamage.max.base || 0) + ((skill.lightningDamage.max.perLevel || 0) * (skillLevel - 1));
      }
    }
    if (skill.coldDamage) {
      if (Array.isArray(skill.coldDamage.min)) {
        var index = Math.min(skillLevel - 1, skill.coldDamage.min.length - 1);
        coldMin = skill.coldDamage.min[index] || 0;
        coldMax = skill.coldDamage.max[index] || 0;
      } else {
        coldMin = (skill.coldDamage.min.base || 0) + ((skill.coldDamage.min.perLevel || 0) * (skillLevel - 1));
        coldMax = (skill.coldDamage.max.base || 0) + ((skill.coldDamage.max.perLevel || 0) * (skillLevel - 1));
      }
    }

    var synergyBonus = this.calculateSynergyBonus(skillId, skill.type);

    fireMin = Math.floor(fireMin * (1 + synergyBonus / 100));
    fireMax = Math.floor(fireMax * (1 + synergyBonus / 100));
    lightningMin = Math.floor(lightningMin * (1 + synergyBonus / 100));
    lightningMax = Math.floor(lightningMax * (1 + synergyBonus / 100));
    coldMin = Math.floor(coldMin * (1 + synergyBonus / 100));
    coldMax = Math.floor(coldMax * (1 + synergyBonus / 100));

    var bolts = 0;
    if (skill.bolts) {
      // Use hard points for bolts display if it's based on invested points
      var skillInput = document.getElementById(skillId.replace('container', ''));
      var baseLevel = parseInt(skillInput ? skillInput.value : '0') || 0;
      var boltIndex = Math.min(baseLevel, skill.bolts.length - 1);
      bolts = skill.bolts[boltIndex] || 0;
    }

    return {
      fireMin: fireMin,
      fireMax: fireMax,
      lightningMin: lightningMin,
      lightningMax: lightningMax,
      coldMin: coldMin,
      coldMax: coldMax,
      averageLightning: Math.floor((lightningMin + lightningMax) / 2),
      averageFire: Math.floor((fireMin + fireMax) / 2),
      average: Math.floor((fireMin + fireMax + lightningMin + lightningMax + coldMin + coldMax) / 2),
      synergyBonus: synergyBonus,
      bolts: bolts
    };
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

window.testSkillSystem = function () {
  //('🧪 Testing...');
  if (skillSystemInstance) {
    //('✅ Skills working:', skillSystemInstance.getTotalUsed(), 'points used');
  } else {
    //('❌ Not initialized');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initSkillSystem, 100);
  });
} else {
  setTimeout(initSkillSystem, 100);
}



window.initSkillSystem = initSkillSystem;
