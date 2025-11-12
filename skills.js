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
    
    // Define all class skill trees
    this.classSkillTrees = {
      'Amazon': {
        'javelinandspearskillscontainer': [
          { id: 'jabcontainer', name: 'Jab', level: 1 },
          { id: 'poisonjavelincontainer', name: 'Poison Javelin', level: 1 },
          { id: 'powerstrikecontainer', name: 'Power Strike', level: 6 },
          { id: 'javelinandspearmasterycontainer', name: 'Javelin and Spear Mastery', level: 1 },
          { id: 'lightningboltcontainer', name: 'Lightning Bolt', level: 12 },
          { id: 'chargedstrikecontainer', name: 'Charged Strike', level: 12 },
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
      },
      'Assassin': {
        'martialartscontainer': [
          { id: 'tigerstrikecontainer', name: 'Tiger Strike', level: 1 },
          { id: 'dragontailcontainer', name: 'Dragon Tail', level: 1 },
          { id: 'fistsoffirecontainer', name: 'Fists of Fire', level: 6 },
          { id: 'dragonclawcontainer', name: 'Dragon Claw', level: 1 },
          { id: 'cobrastrikecontainer', name: 'Cobra Strike', level: 12 },
          { id: 'cloakofflamescontainer', name: 'Cloak of Flames', level: 24 },
          { id: 'phoenixstrikecontainer', name: 'Phoenix Strike', level: 30 }
        ],
        'shadowdisciplinescontainer': [
          { id: 'burstofspeedcontainer', name: 'Burst of Speed', level: 6 },
          { id: 'fadecontainer', name: 'Fade', level: 18 },
          { id: 'shadowwarriorcontainer', name: 'Shadow Warrior', level: 18 },
          { id: 'shadowmastercontainer', name: 'Shadow Master', level: 30 },
          { id: 'cloakofshadowscontainer', name: 'Cloak of Shadows', level: 12 },
          { id: 'weaponblockcontainer', name: 'Weapon Block', level: 1 },
          { id: 'psychichammcontainer', name: 'Psychic Hammer', level: 6 },
          { id: 'mindblastcontainer', name: 'Mind Blast', level: 24 }
        ],
        'trapscontainer': [
          { id: 'fireblastcontainer', name: 'Fire Blast', level: 1 },
          { id: 'shockwebcontainer', name: 'Shock Web', level: 6 },
          { id: 'chargedboltssentrycontainer', name: 'Charged Bolt Sentry', level: 12 },
          { id: 'wakeoffirecontainer', name: 'Wake of Fire', level: 12 },
          { id: 'lightningsentrycontainer', name: 'Lightning Sentry', level: 24 },
          { id: 'wakeofinferncontainer', name: 'Wake of Inferno', level: 18 },
          { id: 'deathsentrycontainer', name: 'Death Sentry', level: 30 }
        ]
      },
      'Barbarian': {
        'warcriescontainer': [
          { id: 'howlcontainer', name: 'Howl', level: 1 },
          { id: 'findpotioncontainer', name: 'Find Potion', level: 1 },
          { id: 'tauncontainer', name: 'Taunt', level: 6 },
          { id: 'shoutcontainer', name: 'Shout', level: 6 },
          { id: 'finditemcontainer', name: 'Find Item', level: 12 },
          { id: 'battlecrycontainer', name: 'Battle Cry', level: 18 },
          { id: 'battleorderscontainer', name: 'Battle Orders', level: 24 },
          { id: 'warcryskilcontainer', name: 'War Cry', level: 30 }
        ],
        'combatmasteriescontainer': [
          { id: 'swordmasterycontainer', name: 'Sword Mastery', level: 1 },
          { id: 'axemasterycontainer', name: 'Axe Mastery', level: 1 },
          { id: 'macemasterycontainer', name: 'Mace Mastery', level: 1 },
          { id: 'polemarmasterycontainer', name: 'Polearm Mastery', level: 6 },
          { id: 'throwingmasterycontainer', name: 'Throwing Mastery', level: 6 },
          { id: 'spearmasterycontainer', name: 'Spear Mastery', level: 12 },
          { id: 'increasedstaminacontainer', name: 'Increased Stamina', level: 1 },
          { id: 'ironskinscontainer', name: 'Iron Skin', level: 18 },
          { id: 'increasedspeedcontainer', name: 'Increased Speed', level: 12 },
          { id: 'naturalresistancecontainer', name: 'Natural Resistance', level: 24 }
        ],
        'combatskillsbarcontainer': [
          { id: 'bashcontainer', name: 'Bash', level: 1 },
          { id: 'leapcontainer', name: 'Leap', level: 6 },
          { id: 'doubleswingcontainer', name: 'Double Swing', level: 6 },
          { id: 'stuncontainer', name: 'Stun', level: 12 },
          { id: 'doublethrowcontainer', name: 'Double Throw', level: 12 },
          { id: 'leapattackcontainer', name: 'Leap Attack', level: 18 },
          { id: 'concentratecontainer', name: 'Concentrate', level: 18 },
          { id: 'frenzycontainer', name: 'Frenzy', level: 24 },
          { id: 'whirlwindcontainer', name: 'Whirlwind', level: 30 },
          { id: 'berserkcontainer', name: 'Berserk', level: 30 }
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

    // Backward compatibility - keep amazonSkills as reference to Amazon tree
    this.amazonSkills = this.classSkillTrees['Amazon'];

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
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7]
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
  // Define container titles for each class
  var classTitles = {
    'Amazon': [
      { id: 'javelinandspearskillscontainer', title: 'Javelin & Spear' },
      { id: 'passiveskillscontainer', title: 'Passive & Magic' },
      { id: 'bowandcrossbowskillscontainer', title: 'Bow & Crossbow' }
    ],
    'Assassin': [
      { id: 'martialartscontainer', title: 'Martial Arts' },
      { id: 'shadowdisciplinescontainer', title: 'Shadow Disciplines' },
      { id: 'trapscontainer', title: 'Traps' }
    ],
    'Barbarian': [
      { id: 'warcriescontainer', title: 'War Cries' },
      { id: 'combatmasteriescontainer', title: 'Combat Masteries' },
      { id: 'combatskillsbarcontainer', title: 'Combat Skills' }
    ],
    'Druid': [
      { id: 'elementalskillscontainer', title: 'Elemental' },
      { id: 'shapeshiftingskillscontainer', title: 'Shapeshifting' },
      { id: 'summoningskillscontainer', title: 'Summoning' }
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
    container.style.top = '1300px';
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

    Object.keys(currentClassSkills).forEach(function(containerId) {
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

    // Class changes - rebuild skill trees when class changes
    var classSelect = document.getElementById('selectClass');
    if (classSelect) {
      classSelect.addEventListener('change', function(e) {
        self.currentClass = e.target.value;
        self.rebuildSkillTrees();
      });
    }

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
      var attackRatingBonus;
      if (Array.isArray(skill.attackRating)) {
        var levelIndex = Math.min(skillLevel - 1, skill.attackRating.length - 1);
        attackRatingBonus = skill.attackRating[levelIndex] || 0;
      } else {
        attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (skillLevel - 1));
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

    // Display Attack Rating if available
    if (skill.attackRating) {
      var attackRatingBonus;
      if (Array.isArray(skill.attackRating)) {
        var levelIndex = Math.min(skillLevel - 1, skill.attackRating.length - 1);
        attackRatingBonus = skill.attackRating[levelIndex] || 0;
      } else {
        attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (skillLevel - 1));
      }
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
    }

    html += '<div style="margin: 5px 0; color: #00ff00;">Poison: ' + damageInfo.min + '-' + damageInfo.max + ' over 4s</div>';
    html += '<div style="margin: 5px 0;">Per Second: ' + damageInfo.average + '</div>';
    if (damageInfo.synergyBonus > 0) {
      html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
    }
  } else if (skill.type === 'lightning_conversion') {
    var damageInfo = this.calculateLightningConversionDamage(skill, skillLevel, weaponDamage, dexterity, skillId);

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
  } else if (skill.type === 'lightning') {
    var damageInfo = this.calculateElementalDamage(skill, skillLevel, skillId);

    // Display Attack Rating if available
    if (skill.attackRating) {
      var attackRatingBonus;
      if (Array.isArray(skill.attackRating)) {
        var levelIndex = Math.min(skillLevel - 1, skill.attackRating.length - 1);
        attackRatingBonus = skill.attackRating[levelIndex] || 0;
      } else {
        attackRatingBonus = skill.attackRating.base + (skill.attackRating.perLevel * (skillLevel - 1));
      }
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
    }

    // Display physical damage bonus from mastery (for javelin skills like Power Strike)
    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();
    if (masteryDamageBonus > 0) {
      html += '<div style="margin: 5px 0; color: #ff9966;">Physical Damage: +' + masteryDamageBonus + '%</div>';
    }

    html += '<div style="margin: 5px 0; color: #ffff00;">Lightning: ' + damageInfo.lightningMin + '-' + damageInfo.lightningMax + '</div>';
    if (damageInfo.novaMin !== undefined && damageInfo.novaMax !== undefined) {
      html += '<div style="margin: 5px 0; color: #ffff00;">Nova: ' + damageInfo.novaMin + '-' + damageInfo.novaMax + '</div>';
    }
    html += '<div style="margin: 5px 0;">Average Lightning: ' + damageInfo.averageLightning + '</div>';
    if (damageInfo.averageNova !== undefined) {
      html += '<div style="margin: 5px 0;">Average Nova: ' + damageInfo.averageNova + '</div>';
    }
    if (damageInfo.synergyBonus > 0) {
      html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
    }

    // Display bolts, charged bolts, or hits if available
    if (damageInfo.bolts) {
      html += '<div style="margin: 5px 0; color: #cccccc;">Bolts: ' + damageInfo.bolts + '</div>';
    }
    if (damageInfo.chargedBolts) {
      html += '<div style="margin: 5px 0; color: #cccccc;">Bolts: ' + damageInfo.chargedBolts + '</div>';
    }
    if (damageInfo.hits) {
      html += '<div style="margin: 5px 0; color: #cccccc;">Hits: ' + damageInfo.hits + '</div>';
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
  // Handle both array format and object format
  var skillDamageBonus;
  if (Array.isArray(skill.damage)) {
    var levelIndex = Math.min(skillLevel - 1, skill.damage.length - 1);
    skillDamageBonus = skill.damage[levelIndex] || 0;
  } else {
    skillDamageBonus = skill.damage.base + (skill.damage.perLevel * (skillLevel - 1));
  }

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

  calculateLightningConversionDamage(skill, skillLevel, weaponDamage, dexterity, skillId) {
    // Calculate physical damage that will be converted
    var masteryDamageBonus = this.getWeaponMasteryDamageBonus();
    var statBonus = Math.floor(dexterity * 1);

    // Calculate base physical damage (weapon × bonuses)
    var convertedPhysicalMin = Math.floor((weaponDamage.min) * (1 + masteryDamageBonus / 100 + statBonus / 100));
    var convertedPhysicalMax = Math.floor((weaponDamage.max) * (1 + masteryDamageBonus / 100 + statBonus / 100));

    // Get skill's base lightning damage
    var levelIndex = Math.min(skillLevel - 1, 59);
    var skillLightningMin = skill.lightningDamage.min[levelIndex] || 1;
    var skillLightningMax = skill.lightningDamage.max[levelIndex] || 1;

    // Total base lightning = converted physical + skill lightning
    var baseLightningMin = convertedPhysicalMin + skillLightningMin;
    var baseLightningMax = convertedPhysicalMax + skillLightningMax;

    // Apply synergies to total lightning damage
    var synergyBonus = this.calculateSynergyBonus(skillId, 'lightning');
    var lightningMin = Math.floor(baseLightningMin * (1 + synergyBonus / 100));
    var lightningMax = Math.floor(baseLightningMax * (1 + synergyBonus / 100));

    // Get critical strike chances
    var criticalStrike = Math.min(this.getCriticalStrikeChance(), 75);
    var deadlyStrike = Math.min(this.getDeadlyStrikeChance(), 75);
    var weaponMastery = Math.min(this.getWeaponMasteryChance(), 75);

    // Calculate total crit chance
    var totalCritChance = 1 - ((1 - deadlyStrike/100) * (1 - criticalStrike/100) * (1 - weaponMastery/100));
    totalCritChance = Math.floor(totalCritChance * 100);
    totalCritChance = Math.min(totalCritChance, 95);

    // Apply crit multiplier (1.5x on crit)
    var critMultiplier = 1 + (totalCritChance / 100) * 0.5;

    // Apply crit to lightning damage
    var finalLightningMin = Math.floor(lightningMin * critMultiplier);
    var finalLightningMax = Math.floor(lightningMax * critMultiplier);

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

  // Rebuild skill trees when class changes
  rebuildSkillTrees() {
    // Recreate containers for new class
    this.createContainers();

    // Populate skills for new class
    this.populateSkills();

    // Update points display
    this.updatePointsDisplay();

    // Re-populate skill dropdown
    setTimeout(() => { this.updateSkillDropdown(); }, 100);
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
