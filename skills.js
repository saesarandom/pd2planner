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
} // skills-clean-fixed.js - Fixed Skills System



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
        'javelinandspearskillscontainer': [{
          id: 'jabcontainer',
          name: 'Jab',
          level: 1,
          prerequisites: []
        },
        {
          id: 'poisonjavelincontainer',
          name: 'Poison Javelin',
          level: 1,
          prerequisites: []
        },
        {
          id: 'powerstrikecontainer',
          name: 'Power Strike',
          level: 6,
          prerequisites: ['jabcontainer']
        },
        {
          id: 'javelinandspearmasterycontainer',
          name: 'Javelin and Spear Mastery',
          level: 6,
          prerequisites: ['jabcontainer']
        },
        {
          id: 'lightningboltcontainer',
          name: 'Lightning Bolt',
          level: 12,
          prerequisites: ['jabcontainer', 'poisonjavelincontainer', 'powerstrikecontainer']
        },
        {
          id: 'fendcontainer',
          name: 'Fend',
          level: 18,
          prerequisites: ['jabcontainer', 'javelinandspearmasterycontainer']
        },
        {
          id: 'chargedstrikecontainer',
          name: 'Charged Strike',
          level: 18,
          prerequisites: ['jabcontainer', 'powerstrikecontainer']
        },
        {
          id: 'plaguejavelincontainer',
          name: 'Plague Javelin',
          level: 18,
          prerequisites: ['jabcontainer', 'poisonjavelincontainer', 'powerstrikecontainer', 'lightningboltcontainer']
        },
        {
          id: 'lightningstrikecontainer',
          name: 'Lightning Strike',
          level: 30,
          prerequisites: ['jabcontainer', 'powerstrikecontainer', 'chargedstrikecontainer']
        },
        {
          id: 'lightningfurycontainer',
          name: 'Lightning Fury',
          level: 30,
          prerequisites: ['jabcontainer', 'poisonjavelincontainer', 'powerstrikecontainer', 'lightningboltcontainer', 'plaguejavelincontainer']
        }
        ],
        'passiveskillscontainer': [{
          id: 'innersightcontainer',
          name: 'Inner Sight',
          level: 1,
          prerequisites: []
        },
        {
          id: 'criticalstrikecontainer',
          name: 'Critical Strike',
          level: 1,
          prerequisites: []
        },
        {
          id: 'evadecontainer',
          name: 'Evade',
          level: 6,
          prerequisites: []
        },
        {
          id: 'slowmovementcontainer',
          name: 'Slow Movement',
          level: 12,
          prerequisites: ['innersightcontainer']
        },
        {
          id: 'piercecontainer',
          name: 'Pierce',
          level: 12,
          prerequisites: ['criticalstrikecontainer']
        },
        {
          id: 'dodgecontainer',
          name: 'Dodge',
          level: 18,
          prerequisites: ['innersightcontainer', 'evadecontainer', 'slowmovementcontainer']
        },
        {
          id: 'decoycontainer',
          name: 'Decoy',
          level: 18,
          prerequisites: ['innersightcontainer', 'slowmovementcontainer']
        },
        {
          id: 'penetratecontainer',
          name: 'Penetrate',
          level: 24,
          prerequisites: ['criticalstrikecontainer', 'piercecontainer']
        },
        {
          id: 'valkyriecontainer',
          name: 'Valkyrie',
          level: 30,
          prerequisites: ['innersightcontainer', 'slowmovementcontainer', 'decoycontainer']
        }
        ],
        'bowandcrossbowskillscontainer': [{
          id: 'magicarrowcontainer',
          name: 'Magic Arrow',
          level: 1,
          prerequisites: []
        },
        {
          id: 'multipleshotcontainer',
          name: 'Multiple Shot',
          level: 6,
          prerequisites: ['magicarrowcontainer']
        },
        {
          id: 'firearrowcontainer',
          name: 'Fire Arrow',
          level: 1,
          prerequisites: ['magicarrowcontainer']
        },
        {
          id: 'coldarrowcontainer',
          name: 'Cold Arrow',
          level: 6,
          prerequisites: ['magicarrowcontainer']
        },
        {
          id: 'icearrowcontainer',
          name: 'Ice Arrow',
          level: 12,
          prerequisites: ['magicarrowcontainer', 'coldarrowcontainer']
        },
        {
          id: 'guidedarrowcontainer',
          name: 'Guided Arrow',
          level: 18,
          prerequisites: ['magicarrowcontainer', 'multipleshotcontainer']
        },
        {
          id: 'explodingarrowcontainer',
          name: 'Exploding Arrow',
          level: 18,
          prerequisites: ['magicarrowcontainer', 'firearrowcontainer']
        },
        {
          id: 'strafecontainer',
          name: 'Strafe',
          level: 24,
          prerequisites: ['magicarrowcontainer', 'multipleshotcontainer', 'guidedarrowcontainer']
        },
        {
          id: 'immolationarrowcontainer',
          name: 'Immolation Arrow',
          level: 18,
          prerequisites: ['magicarrowcontainer', 'firearrowcontainer', 'explodingarrowcontainer']
        },
        {
          id: 'freezingarrowcontainer',
          name: 'Freezing Arrow',
          level: 30,
          prerequisites: ['magicarrowcontainer', 'coldarrowcontainer', 'icearrowcontainer']
        }
        ]
      },
      'Assassin': {
        'martialartscontainer': [{
          id: 'tigerstrikecontainer',
          name: 'Tiger Strike',
          level: 1,
          prerequisites: []
        },
        {
          id: 'dragontaloncontainer',
          name: 'Dragon Talon',
          level: 1,
          prerequisites: []
        },
        {
          id: 'dragonclawcontainer',
          name: 'Dragon Claw',
          level: 1,
          prerequisites: ['dragontaloncontainer']
        },
        {
          id: 'fistsoffirecontainer',
          name: 'Fists of Fire',
          level: 6,
          prerequisites: []
        },
        {
          id: 'cobrastrikecontainer',
          name: 'Cobra Strike',
          level: 12,
          prerequisites: ['tigerstrikecontainer']
        },
        {
          id: 'clawsofthundercontainer',
          name: 'Claws of Thunder',
          level: 18,
          prerequisites: ['fistsoffirecontainer']
        },
        {
          id: 'dragontailcontainer',
          name: 'Dragon Tail',
          level: 18,
          prerequisites: ['dragontaloncontainer', 'dragonclawcontainer']
        },
        {
          id: 'dragonflightcontainer',
          name: 'Dragon Flight',
          level: 24,
          prerequisites: ['dragontaloncontainer', 'dragonclawcontainer', 'dragontailcontainer']
        },
        {
          id: 'bladesoficecontainer',
          name: 'Blades of Ice',
          level: 24,
          prerequisites: ['fistsoffirecontainer', 'clawsofthundercontainer']
        },
        {
          id: 'phoenixstrikecontainer',
          name: 'Phoenix Strike',
          level: 30,
          prerequisites: ['tigerstrikecontainer', 'fistsoffirecontainer', 'cobrastrikecontainer', 'clawsofthundercontainer', 'bladesoficecontainer']
        }
        ],
        'shadowdisciplinescontainer': [{
          id: 'clawanddaggermasterycontainer',
          name: 'Claw and Dagger Mastery',
          level: 1,
          prerequisites: []
        },
        {
          id: 'psychichammercontainer',
          name: 'Psychic Hammer',
          level: 1,
          prerequisites: []
        },
        {
          id: 'burstofspeedcontainer',
          name: 'Burst of Speed',
          level: 6,
          prerequisites: ['clawanddaggermasterycontainer']
        },
        {
          id: 'weaponblockcontainer',
          name: 'Weapon Block',
          level: 12,
          prerequisites: ['clawanddaggermasterycontainer']
        },
        {
          id: 'cloakofshadowscontainer',
          name: 'Cloak of Shadows',
          level: 12,
          prerequisites: ['psychichammercontainer']
        },
        {
          id: 'mindblastcontainer',
          name: 'Mind Blast',
          level: 12,
          prerequisites: ['psychichammercontainer', 'cloakofshadowscontainer']
        },
        {
          id: 'fadecontainer',
          name: 'Fade',
          level: 18,
          prerequisites: ['clawanddaggermasterycontainer', 'burstofspeedcontainer']
        },
        {
          id: 'shadowwarriorcontainer',
          name: 'Shadow Warrior',
          level: 18,
          prerequisites: ['clawanddaggermasterycontainer', 'psychichammercontainer', 'weaponblockcontainer', 'cloakofshadowscontainer']
        },
        {
          id: 'shadowmastercontainer',
          name: 'Shadow Master',
          level: 30,
          prerequisites: ['clawanddaggermasterycontainer', 'psychichammercontainer', 'weaponblockcontainer', 'cloakofshadowscontainer', 'shadowwarriorcontainer']
        },
        {
          id: 'venomcontainer',
          name: 'Venom',
          level: 12,
          prerequisites: ['clawanddaggermasterycontainer', 'burstofspeedcontainer', 'fadecontainer']
        }
        ],
        'trapscontainer': [{
          id: 'fireblastcontainer',
          name: 'Fire Blast',
          level: 1,
          prerequisites: []
        },
        {
          id: 'shockwebcontainer',
          name: 'Shock Web',
          level: 6,
          prerequisites: ['fireblastcontainer']
        },
        {
          id: 'bladesentinelcontainer',
          name: 'Blade Sentinel',
          level: 12,
          prerequisites: []
        },
        {
          id: 'chargedboltsentrycontainer',
          name: 'Charged Bolt Sentry',
          level: 12,
          prerequisites: ['fireblastcontainer', 'shockwebcontainer']
        },
        {
          id: 'wakeoffirecontainer',
          name: 'Wake of Fire',
          level: 12,
          prerequisites: ['fireblastcontainer']
        },
        {
          id: 'bladefurycontainer',
          name: 'Blade Fury',
          level: 18,
          prerequisites: ['bladesentinelcontainer']
        },
        {
          id: 'bladeshieldcontainer',
          name: 'Blade Shield',
          level: 24,
          prerequisites: ['bladesentinelcontainer', 'bladefurycontainer']
        },
        {
          id: 'lightningsentrycontainer',
          name: 'Lightning Sentry',
          level: 24,
          prerequisites: ['fireblastcontainer', 'shockwebcontainer', 'chargedboltsentrycontainer']
        },
        {
          id: 'wakeofinfernocontainer',
          name: 'Wake of Inferno',
          level: 24,
          prerequisites: ['fireblastcontainer', 'wakeoffirecontainer']
        },
        {
          id: 'chainlightningsentrycontainer',
          name: 'Chain Lightning Sentry',
          level: 30,
          prerequisites: ['fireblastcontainer', 'shockwebcontainer', 'chargedboltsentrycontainer', 'lightningsentrycontainer']
        },
        {
          id: 'deathsentrycontainer',
          name: 'Death Sentry',
          level: 30,
          prerequisites: ['fireblastcontainer', 'shockwebcontainer', 'chargedboltsentrycontainer', 'wakeoffirecontainer', 'lightningsentrycontainer', 'wakeofinfernocontainer']
        }
        ]
      },
      'Barbarian': {
        'warcriescontainer': [{
          id: 'howlcontainer',
          name: 'Howl',
          level: 1,
          prerequisites: []
        },
        {
          id: 'findpotioncontainer',
          name: 'Find Potion',
          level: 1,
          prerequisites: []
        },
        {
          id: 'shoutcontainer',
          name: 'Shout',
          level: 6,
          prerequisites: ['howlcontainer']
        },
        {
          id: 'warcrycontainer',
          name: 'War Cry',
          level: 6,
          prerequisites: ['howlcontainer']
        },
        {
          id: 'finditemcontainer',
          name: 'Find Item',
          level: 12,
          prerequisites: ['findpotioncontainer']
        },
        {
          id: 'tauncontainer',
          name: 'Taunt',
          level: 18,
          prerequisites: ['howlcontainer', 'warcrycontainer']
        },
        {
          id: 'battleorderscontainer',
          name: 'Battle Orders',
          level: 24,
          prerequisites: ['howlcontainer', 'shoutcontainer']
        },
        {
          id: 'grimwardcontainer',
          name: 'Grim Ward',
          level: 24,
          prerequisites: ['howlcontainer', 'warcrycontainer', 'tauncontainer']
        },
        {
          id: 'battlecommandcontainer',
          name: 'Battle Command',
          level: 30,
          prerequisites: ['howlcontainer', 'shoutcontainer', 'battleorderscontainer']
        },
        {
          id: 'battlecrycontainer',
          name: 'Battle Cry',
          level: 30,
          prerequisites: ['howlcontainer', 'shoutcontainer', 'warcrycontainer', 'tauncontainer', 'battleorderscontainer']
        }
        ],
        'combatmasteriescontainer': [{
          id: 'generalmasterycontainer',
          name: 'General Mastery',
          level: 1,
          prerequisites: []
        },
        {
          id: 'throwingmasterycontainer',
          name: 'Throwing Mastery',
          level: 1,
          prerequisites: []
        },
        {
          id: 'polearmandspearmasterycontainer',
          name: 'Polearm and Spear Mastery',
          level: 6,
          prerequisites: []
        },
        {
          id: 'combatreflexescontainer',
          name: 'Combat Reflexes',
          level: 12,
          prerequisites: []
        },
        {
          id: 'ironskinscontainer',
          name: 'Iron Skin',
          level: 18,
          prerequisites: []
        },
        {
          id: 'increasedspeedcontainer',
          name: 'Increased Speed',
          level: 24,
          prerequisites: ['combatreflexescontainer']
        },
        {
          id: 'naturalresistancecontainer',
          name: 'Natural Resistance',
          level: 30,
          prerequisites: ['ironskinscontainer']
        },
        {
          id: 'deepwoundscontainer',
          name: 'Deep Wounds',
          level: 30,
          prerequisites: ['combatreflexescontainer', 'ironskinscontainer', 'increasedspeedcontainer']
        }
        ],
        'combatskillsbarcontainer': [{
          id: 'bashcontainer',
          name: 'Bash',
          level: 1,
          prerequisites: []
        },
        {
          id: 'doubleswingcontainer',
          name: 'Double Swing',
          level: 1,
          prerequisites: []
        },
        {
          id: 'frenzycontainer',
          name: 'Frenzy',
          level: 6,
          prerequisites: ['doubleswingcontainer']
        },
        {
          id: 'stuncontainer',
          name: 'Stun',
          level: 6,
          prerequisites: ['bashcontainer']
        },
        {
          id: 'concentratecontainer',
          name: 'Concentrate',
          level: 12,
          prerequisites: ['doubleswingcontainer']
        },
        {
          id: 'doublethrowcontainer',
          name: 'Double Throw',
          level: 12,
          prerequisites: ['doubleswingcontainer', 'frenzycontainer']
        },
        {
          id: 'leapcontainer',
          name: 'Leap',
          level: 12,
          prerequisites: ['bashcontainer', 'stuncontainer']
        },
        {
          id: 'leapattackcontainer',
          name: 'Leap Attack',
          level: 24,
          prerequisites: ['bashcontainer', 'doubleswingcontainer', 'stuncontainer', 'leapcontainer', 'concentratecontainer']
        },
        {
          id: 'berserkcontainer',
          name: 'Berserk',
          level: 24,
          prerequisites: ['doubleswingcontainer', 'concentratecontainer']
        },
        {
          id: 'whirlwindcontainer',
          name: 'Whirlwind',
          level: 30,
          prerequisites: ['doubleswingcontainer', 'concentratecontainer', 'berserkcontainer']
        }
        ]
      },
      'Druid': {
        'elementalskillscontainer': [{
          id: 'firestormcontainer',
          name: 'Firestorm',
          level: 1,
          prerequisites: []
        },
        {
          id: 'moltenbouldcontainer',
          name: 'Molten Boulder',
          level: 6,
          prerequisites: ['firestormcontainer']
        },
        {
          id: 'arcticblastcontainer',
          name: 'Arctic Blast',
          level: 1,
          prerequisites: []
        },
        {
          id: 'fissurecontainer',
          name: 'Fissure',
          level: 12,
          prerequisites: ['firestormcontainer', 'moltenbouldcontainer']
        },
        {
          id: 'cyclonearmorcontainer',
          name: 'Cyclone Armor',
          level: 6,
          prerequisites: ['arcticblastcontainer']
        },
        {
          id: 'twistercontainer',
          name: 'Twister',
          level: 12,
          prerequisites: ['arcticblastcontainer', 'cyclonearmorcontainer']
        },
        {
          id: 'gustcontainer',
          name: 'Gust',
          level: 18,
          prerequisites: ['arcticblastcontainer', 'cyclonearmorcontainer']
        },
        {
          id: 'volcanocontainer',
          name: 'Volcano',
          level: 24,
          prerequisites: ['firestormcontainer', 'moltenbouldcontainer', 'fissurecontainer']
        },
        {
          id: 'tornadocontainer',
          name: 'Tornado',
          level: 24,
          prerequisites: ['arcticblastcontainer', 'cyclonearmorcontainer', 'twistercontainer']
        },
        {
          id: 'armageddoncontainer',
          name: 'Armageddon',
          level: 30,
          prerequisites: ['firestormcontainer', 'moltenbouldcontainer', 'fissurecontainer', 'volcanocontainer']
        },
        {
          id: 'hurricanecontainer',
          name: 'Hurricane',
          level: 30,
          prerequisites: ['arcticblastcontainer', 'cyclonearmorcontainer', 'twistercontainer', 'tornadocontainer']
        }
        ],
        'shapeshiftingskillscontainer': [{
          id: 'werewolfcontainer',
          name: 'Werewolf',
          level: 1,
          prerequisites: []
        },
        {
          id: 'werebearcontainer',
          name: 'Werebear',
          level: 6,
          prerequisites: []
        },
        {
          id: 'lycantropycontainer',
          name: 'Lycanthropy',
          level: 1,
          prerequisites: []
        },
        {
          id: 'feralragecontainer',
          name: 'Feral Rage',
          level: 6,
          prerequisites: ['werewolfcontainer']
        },
        {
          id: 'maulcontainer',
          name: 'Maul',
          level: 6,
          prerequisites: ['werebearcontainer']
        },
        {
          id: 'hungercontainer',
          name: 'Hunger',
          level: 12,
          prerequisites: ['werebearcontainer', 'maulcontainer']
        },
        {
          id: 'rabiescontainer',
          name: 'Rabies',
          level: 18,
          prerequisites: ['werewolfcontainer', 'feralragecontainer']
        },
        {
          id: 'shockwavecontainer',
          name: 'Shock Wave',
          level: 18,
          prerequisites: ['werebearcontainer', 'maulcontainer']
        },
        {
          id: 'fireclawscontainer',
          name: 'Fire Claws',
          level: 24,
          prerequisites: []
        },
        {
          id: 'furycontainer',
          name: 'Fury',
          level: 30,
          prerequisites: ['werewolfcontainer', 'feralragecontainer', 'rabiescontainer']
        }
        ],
        'summoningskillscontainer': [{
          id: 'ravencontainer',
          name: 'Raven',
          level: 1,
          prerequisites: []
        },
        {
          id: 'poisoncreepercontainer',
          name: 'Poison Creeper',
          level: 1,
          prerequisites: []
        },
        {
          id: 'heartofwolverinecontainer',
          name: 'Heart of Wolverine',
          level: 18,
          prerequisites: []
        },
        {
          id: 'summonspiritwolfcontainer',
          name: 'Summon Spirit Wolf',
          level: 18,
          prerequisites: ['ravencontainer', 'heartofwolverinecontainer']
        },
        {
          id: 'carrionvinecontainer',
          name: 'Carrion Vine',
          level: 12,
          prerequisites: ['poisoncreepercontainer']
        },
        {
          id: 'spiritofbarbscontainer',
          name: 'Spirit of Barbs',
          level: 24,
          prerequisites: ['heartofwolverinecontainer']
        },
        {
          id: 'summondirewolfcontainer',
          name: 'Summon Dire Wolf',
          level: 24,
          prerequisites: ['ravencontainer', 'heartofwolverinecontainer', 'summonspiritwolfcontainer']
        },
        {
          id: 'solarcreepercontainer',
          name: 'Solar Creeper',
          level: 24,
          prerequisites: ['poisoncreepercontainer', 'carrionvinecontainer']
        },
        {
          id: 'oaksagecontainer',
          name: 'Oak Sage',
          level: 30,
          prerequisites: ['heartofwolverinecontainer', 'spiritofbarbscontainer']
        },
        {
          id: 'summongrizzlycontainer',
          name: 'Summon Grizzly',
          level: 30,
          prerequisites: ['ravencontainer', 'heartofwolverinecontainer', 'summonspiritwolfcontainer', 'summondirewolfcontainer']
        }
        ]
      },
      'Necromancer': {
        'summoningspellsneccontainer': [
          {
            id: 'raiseskeletonwarriorcontainer',
            name: 'Raise Skeleton Warrior',
            level: 1,
            prerequisites: []
          },
          {
            id: 'skeletonmasterycontainer',
            name: 'Skeleton Mastery',
            level: 1,
            prerequisites: ['raiseskeletonwarriorcontainer']
          },
          {
            id: 'claygolemneccontainer',
            name: 'Clay Golem',
            level: 6,
            prerequisites: []
          },
          {
            id: 'golemmasterneccontainer',
            name: 'Golem Mastery',
            level: 12,
            prerequisites: ['claygolemneccontainer']
          },
          {
            id: 'raiseskeletalmagecontainer',
            name: 'Raise Skeletal Mage',
            level: 12,
            prerequisites: ['raiseskeletonwarriorcontainer']
          },
          {
            id: 'bloodgolemneccontainer',
            name: 'Blood Golem',
            level: 18,
            prerequisites: ['claygolemneccontainer']
          },
          {
            id: 'bloodwarpcontainer',
            name: 'Blood Warp',
            level: 24,
            prerequisites: ['claygolemneccontainer', 'bloodgolemneccontainer']
          },
          {
            id: 'raiseskeletonarchercontainer',
            name: 'Raise Skeleton Archer',
            level: 24,
            prerequisites: ['raiseskeletonwarriorcontainer', 'raiseskeletalmagecontainer']
          },
          {
            id: 'irongolemneccontainer',
            name: 'Iron Golem',
            level: 24,
            prerequisites: ['claygolemneccontainer', 'bloodgolemneccontainer']
          },
          {
            id: 'firegolemneccontainer',
            name: 'Fire Golem',
            level: 30,
            prerequisites: ['claygolemneccontainer', 'bloodgolemneccontainer', 'irongolemneccontainer']
          },
          {
            id: 'revivecontainer',
            name: 'Revive',
            level: 30,
            prerequisites: ['raiseskeletonwarriorcontainer', 'raiseskeletalmagecontainer', 'raiseskeletonarchercontainer']
          }
        ],
        'poisonandbonespellscontainer': [{
          id: 'teethcontainer',
          name: 'Teeth',
          level: 1,
          prerequisites: []
        },
        {
          id: 'bonearmorcontainer',
          name: 'Bone Armor',
          level: 1,
          prerequisites: ['teethcontainer']
        },
        {
          id: 'poisonstrikecontainer',
          name: 'Poison Strike',
          level: 6,
          prerequisites: []
        },
        {
          id: 'corpseexplosioncontainer',
          name: 'Corpse Explosion',
          level: 6,
          prerequisites: ['poisonstrikecontainer']
        },
        {
          id: 'bonewallcontainer',
          name: 'Bone Wall',
          level: 12,
          prerequisites: ['teethcontainer', 'bonearmorcontainer']
        },
        {
          id: 'desecratecontainer',
          name: 'Desecrate',
          level: 12,
          prerequisites: ['poisonstrikecontainer', 'corpseexplosioncontainer']
        },
        {
          id: 'poisonexplosioncontainer',
          name: 'Poison Explosion',
          level: 18,
          prerequisites: []
        },
        {
          id: 'bonespearcontainer',
          name: 'Bone Spear',
          level: 18,
          prerequisites: ['teethcontainer']
        },
        {
          id: 'boneprisoncontainer',
          name: 'Bone Prison',
          level: 24,
          prerequisites: ['teethcontainer', 'bonearmorcontainer', 'bonewallcontainer', 'bonespearcontainer']
        },
        {
          id: 'poisonnovacontainer',
          name: 'Poison Nova',
          level: 24,
          prerequisites: ['poisonstrikecontainer', 'corpseexplosioncontainer', 'desecratecontainer']
        },
        {
          id: 'bonespiritcontainer',
          name: 'Bone Spirit',
          level: 30,
          prerequisites: ['teethcontainer', 'bonespearcontainer']
        }
        ],
        'cursescontainer': [{
          id: 'amplifydamagecontainer',
          name: 'Amplify Damage',
          level: 1,
          prerequisites: []
        },
        {
          id: 'cursemasterycontainer',
          name: 'Curse Mastery',
          level: 1,
          prerequisites: []
        },
        {
          id: 'dimvisioncontainer',
          name: 'Dim Vision',
          level: 6,
          prerequisites: []
        },
        {
          id: 'darkpactcontainer',
          name: 'Dark Pact',
          level: 6,
          prerequisites: ['amplifydamagecontainer']
        },
        {
          id: 'weakencontainer',
          name: 'Weaken',
          level: 6,
          prerequisites: ['amplifydamagecontainer', 'lifetapcontainer']
        },
        {
          id: 'ironmaidencontainer',
          name: 'Iron Maiden',
          level: 12,
          prerequisites: ['amplifydamagecontainer', 'darkpactcontainer']
        },
        {
          id: 'terrorcontainer',
          name: 'Terror',
          level: 12,
          prerequisites: ['dimvisioncontainer']
        },
        {
          id: 'confusecontainer',
          name: 'Confuse',
          level: 18,
          prerequisites: ['dimvisioncontainer', 'terrorcontainer']
        },
        {
          id: 'lifetapcontainer',
          name: 'Life Tap',
          level: 18,
          prerequisites: ['amplifydamagecontainer']
        },
        {
          id: 'attractcontainer',
          name: 'Attract',
          level: 24,
          prerequisites: ['dimvisioncontainer', 'terrorcontainer', 'confusecontainer']
        },
        {
          id: 'decrepifycontainer',
          name: 'Decrepify',
          level: 24,
          prerequisites: ['amplifydamagecontainer', 'lifetapcontainer', 'weakencontainer']
        },
        {
          id: 'lowerresistcontainer',
          name: 'Lower Resist',
          level: 30,
          prerequisites: ['amplifydamagecontainer', 'lifetapcontainer', 'weakencontainer']
        }
        ]
      },
      'Paladin': {
        'defensiveaurascontainer': [{
          id: 'prayercontainer',
          name: 'Prayer',
          level: 1,
          prerequisites: []
        },
        {
          id: 'resistfirecontainer',
          name: 'Resist Fire',
          level: 1,
          prerequisites: []
        },
        {
          id: 'defiancecontainer',
          name: 'Defiance',
          level: 6,
          prerequisites: ['prayercontainer']
        },
        {
          id: 'resistcoldcontainer',
          name: 'Resist Cold',
          level: 6,
          prerequisites: []
        },
        {
          id: 'cleansingcontainer',
          name: 'Cleansing',
          level: 12,
          prerequisites: ['prayercontainer']
        },
        {
          id: 'resistlightningcontainer',
          name: 'Resist Lightning',
          level: 12,
          prerequisites: []
        },
        {
          id: 'vigorcontainer',
          name: 'Vigor',
          level: 18,
          prerequisites: ['prayercontainer', 'defiancecontainer']
        },
        {
          id: 'meditationcontainer',
          name: 'Meditation',
          level: 24,
          prerequisites: ['prayercontainer', 'cleansingcontainer']
        },
        {
          id: 'redemptioncontainer',
          name: 'Redemption',
          level: 30,
          prerequisites: ['prayercontainer', 'defiancecontainer', 'vigorcontainer']
        },
        {
          id: 'salvationcontainer',
          name: 'Salvation',
          level: 30,
          prerequisites: []
        }
        ],
        'offensiveaurascontainer': [{
          id: 'mightcontainer',
          name: 'Might',
          level: 1,
          prerequisites: []
        },
        {
          id: 'holyfirecontainer',
          name: 'Holy Fire',
          level: 6,
          prerequisites: ['mightcontainer']
        },
        {
          id: 'thornscontainer',
          name: 'Thorns',
          level: 6,
          prerequisites: []
        },
        {
          id: 'blessedaimcontainer',
          name: 'Blessed Aim',
          level: 12,
          prerequisites: ['mightcontainer']
        },
        {
          id: 'concentrationcontainer',
          name: 'Concentration',
          level: 18,
          prerequisites: ['mightcontainer', 'blessedaimcontainer']
        },
        {
          id: 'holyfrostcontainer',
          name: 'Holy Freeze',
          level: 18,
          prerequisites: ['mightcontainer', 'holyfirecontainer']
        },
        {
          id: 'holyshockcontainer',
          name: 'Holy Shock',
          level: 24,
          prerequisites: ['mightcontainer', 'holyfirecontainer', 'holyfrostcontainer']
        },
        {
          id: 'sanctuarycontainer',
          name: 'Sanctuary',
          level: 24,
          prerequisites: ['mightcontainer', 'holyfirecontainer', 'thornscontainer', 'holyfrostcontainer']
        },
        {
          id: 'fanatcontainer',
          name: 'Fanaticism',
          level: 30,
          prerequisites: ['mightcontainer', 'blessedaimcontainer', 'concentrationcontainer']
        },
        {
          id: 'convictioncontainer',
          name: 'Conviction',
          level: 30,
          prerequisites: ['mightcontainer', 'thornscontainer', 'holyfirecontainer', 'holyfrostcontainer', 'sanctuarycontainer']
        }
        ],
        'combatskillspalcontainer': [{
          id: 'smitecontainer',
          name: 'Smite',
          level: 1,
          prerequisites: []
        },
        {
          id: 'holyboltcontainer',
          name: 'Holy Bolt',
          level: 1,
          prerequisites: []
        },
        {
          id: 'zeal',
          name: 'Zeal',
          level: 1,
          prerequisites: []
        },
        {
          id: 'sacrificecontainer',
          name: 'Sacrifice',
          level: 6,
          prerequisites: ['zeal']
        },
        {
          id: 'holylightcontainer',
          name: 'Holy Light',
          level: 12,
          prerequisites: ['holyboltcontainer']
        },
        {
          id: 'chargecontainer',
          name: 'Charge',
          level: 12,
          prerequisites: ['smitecontainer']
        },
        {
          id: 'vengeancecontainer',
          name: 'Vengeance',
          level: 18,
          prerequisites: ['sacrificecontainer', 'zeal']
        },
        {
          id: 'blessedhammcontainer',
          name: 'Blessed Hammer',
          level: 18,
          prerequisites: ['holyboltcontainer', 'holylightcontainer']
        },
        {
          id: 'joustcontainer',
          name: 'Joust',
          level: 24,
          prerequisites: ['sacrificecontainer', 'zeal', 'vengeancecontainer']
        },
        {
          id: 'holyshieldcontainer',
          name: 'Holy Shield',
          level: 24,
          prerequisites: ['smitecontainer', 'chargecontainer']
        },
        {
          id: 'fistoftheheavenscontainer',
          name: 'Fist of the Heavens',
          level: 24,
          prerequisites: ['holyboltcontainer', 'holylightcontainer', 'blessedhammcontainer']
        },
        {
          id: 'holyswordcontainer',
          name: 'Holy Sword',
          level: 30,
          prerequisites: ['smitecontainer', 'chargecontainer']
        },
        {
          id: 'holynovacontainer',
          name: 'Holy Nova',
          level: 30,
          prerequisites: ['holyboltcontainer', 'smitecontainer', 'holylightcontainer', 'chargecontainer', 'blessedhammcontainer', 'holyshieldcontainer', 'fistoftheheavenscontainer', 'holyswordcontainer']
        }
        ]
      },
      'Sorceress': {
        'coldspellscontainer': [{
          id: 'iceboltcontainer',
          name: 'Ice Bolt',
          level: 1,
          prerequisites: []
        },
        {
          id: 'coldenchantcontainer',
          name: 'Cold Enchant',
          level: 1,
          prerequisites: []
        },
        {
          id: 'frostnovacontainer',
          name: 'Frost Nova',
          level: 6,
          prerequisites: []
        },
        {
          id: 'iceblastcontainer',
          name: 'Ice Blast',
          level: 6,
          prerequisites: ['iceboltcontainer']
        },
        {
          id: 'shiverarmorcontainer',
          name: 'Shiver Armor',
          level: 12,
          prerequisites: ['coldenchantcontainer', 'iceboltcontainer', 'iceblastcontainer']
        },
        {
          id: 'glacialspikecontainer',
          name: 'Glacial Spike',
          level: 18,
          prerequisites: ['iceboltcontainer', 'iceblastcontainer']
        },
        {
          id: 'blizzardcontainer',
          name: 'Blizzard',
          level: 24,
          prerequisites: ['iceboltcontainer', 'iceblastcontainer', 'frostnovacontainer', 'glacialspikecontainer']
        },
        {
          id: 'chillingarmorcontainer',
          name: 'Chilling Armor',
          level: 24,
          prerequisites: ['coldenchantcontainer', 'iceboltcontainer', 'iceblastcontainer', 'shiverarmorcontainer']
        },
        {
          id: 'icebarragecontainer',
          name: 'Ice Barrage',
          level: 24,
          prerequisites: ['iceboltcontainer', 'iceblastcontainer', 'glacialspikecontainer']
        },
        {
          id: 'frozenorbcontainer',
          name: 'Frozen Orb',
          level: 30,
          prerequisites: ['iceboltcontainer', 'iceblastcontainer', 'frostnovacontainer', 'glacialspikecontainer', 'blizzardcontainer']
        },
        {
          id: 'coldmasterycontainer',
          name: 'Cold Mastery',
          level: 30,
          prerequisites: []
        }
        ],
        'lightningspellscontainer': [{
          id: 'chargedboltcontainer',
          name: 'Charged Bolt',
          level: 1,
          prerequisites: []
        },
        {
          id: 'staticfieldcontainer',
          name: 'Static Field',
          level: 6,
          prerequisites: []
        },
        {
          id: 'telekinesicontainer',
          name: 'Telekinesis',
          level: 6,
          prerequisites: []
        },
        {
          id: 'novacontainer',
          name: 'Nova',
          level: 12,
          prerequisites: ['chargedboltcontainer']
        },
        {
          id: 'lightningcontainer',
          name: 'Lightning',
          level: 12,
          prerequisites: ['chargedboltcontainer']
        },
        {
          id: 'chainlightningcontainer',
          name: 'Chain Lightning',
          level: 18,
          prerequisites: ['chargedboltcontainer', 'lightningcontainer']
        },
        {
          id: 'teleportcontainer',
          name: 'Teleport',
          level: 18,
          prerequisites: ['telekinesicontainer']
        },
        {
          id: 'thunderstormcontainer',
          name: 'Thunder Storm',
          level: 24,
          prerequisites: ['chargedboltcontainer', 'lightningcontainer', 'novacontainer']
        },
        {
          id: 'energyshieldcontainer',
          name: 'Energy Shield',
          level: 24,
          prerequisites: ['chargedboltcontainer', 'telekinesicontainer', 'lightningcontainer', 'teleportcontainer', 'chainlightningcontainer']
        },
        {
          id: 'lightningmasterycontainer',
          name: 'Lightning Mastery',
          level: 30,
          prerequisites: []
        }
        ],
        'firespellscontainer': [{
          id: 'fireboltcontainer',
          name: 'Fire Bolt',
          level: 1,
          prerequisites: []
        },
        {
          id: 'warmthcontainer',
          name: 'Warmth',
          level: 1,
          prerequisites: []
        },
        {
          id: 'infernocontainer',
          name: 'Inferno',
          level: 1,
          prerequisites: []
        },
        {
          id: 'blazecontainer',
          name: 'Blaze',
          level: 6,
          prerequisites: ['infernocontainer']
        },
        {
          id: 'fireballcontainer',
          name: 'Fire Ball',
          level: 12,
          prerequisites: ['fireboltcontainer']
        },
        {
          id: 'lesserhydracontainer',
          name: 'Lesser Hydra',
          level: 12,
          prerequisites: ['warmthcontainer']
        },
        {
          id: 'firewallcontainer',
          name: 'Fire Wall',
          level: 12,
          prerequisites: ['infernocontainer', 'blazecontainer']
        },
        {
          id: 'enchantfirecontainer',
          name: 'Enchant Fire',
          level: 18,
          prerequisites: ['fireboltcontainer', 'warmthcontainer', 'fireballcontainer']
        },
        {
          id: 'meteorcontainer',
          name: 'Meteor',
          level: 24,
          prerequisites: ['fireboltcontainer', 'infernocontainer', 'blazecontainer', 'firewallcontainer', 'fireballcontainer']
        },
        {
          id: 'combustioncontainer',
          name: 'Combustion',
          level: 24,
          prerequisites: ['fireboltcontainer', 'warmthcontainer', 'fireballcontainer', 'lesserhydracontainer', 'enchantfirecontainer']
        },
        {
          id: 'hydracontainer',
          name: 'Hydra',
          level: 30,
          prerequisites: ['fireboltcontainer', 'warmthcontainer', 'fireballcontainer', 'enchantfirecontainer']
        },
        {
          id: 'firemasterycontainer',
          name: 'Fire Mastery',
          level: 30,
          prerequisites: []
        }
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
        name: "Jab",
        type: "physical",
        damage: {
          base: 30,
          perLevel: 20
        },
        attackRating: {
          base: 25,
          perLevel: 12
        },
        manaCost: {
          base: 1.5,
          perLevel: 0.2
        },
        synergies: [{
          skillId: 'fendcontainer',
          bonusPerLevel: 18,
          damageType: 'physical'
        }]
      },
      fendcontainer: {
        name: "Fend",
        type: "physical",
        damage: [100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525, 1550, 1575],
        attackRating: [80, 86, 92, 98, 104, 110, 116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 266, 272, 278, 284, 290, 296, 302, 308, 314, 320, 326, 332, 338, 344, 350, 356, 362, 368, 374, 380, 386, 392, 398, 404, 410, 416, 422, 428, 434],
        manaCost: 5,
        synergies: [{
          skillId: 'jabcontainer',
          bonusPerLevel: 20,
          damageType: 'physical'
        }]
      },
      poisonjavelincontainer: {
        name: "Poison Javelin",
        type: "poison",
        poisonDamage: {
          min: [2, 4, 6, 9, 11, 13, 16, 18, 25, 32, 39, 46, 53, 60, 67, 74, 88, 102, 116, 131, 145, 159, 187, 215, 243, 271, 299, 327, 384, 440, 496, 552, 609, 665, 721, 777, 834, 890, 946, 1002, 1059, 1115, 1171, 1227, 1284, 1340, 1396, 1452, 1509, 1565, 1621, 1677, 1734, 1790, 1846, 1902, 1959, 2015, 2071, 2127],
          max: [5, 7, 10, 12, 15, 17, 19, 22, 29, 37, 44, 51, 58, 66, 73, 80, 95, 110, 124, 139, 154, 168, 198, 227, 256, 286, 315, 344, 403, 461, 520, 579, 637, 696, 754, 813, 871, 930, 989, 1047, 1106, 1164, 1223, 1282, 1340, 1399, 1457, 1516, 1575, 1633, 1692, 1750, 1809, 1868, 1926, 1985, 2043, 2102, 2161, 2219]
        },
        manaCost: {
          base: 2,
          perLevel: 0.25
        },
        synergies: [{
          skillId: 'plaguejavelincontainer',
          bonusPerLevel: 24,
          damageType: 'poison'
        },
        {
          skillId: 'javelinandspearmasterycontainer',
          bonusPerLevel: 24,
          damageType: 'poison'
        }
        ]
      },
      powerstrikecontainer: {
        name: "Power Strike",
        type: "lightning",
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [1, 4, 7, 10, 13, 16, 19, 22, 27, 32, 37, 42, 47, 52, 57, 62, 75, 88, 101, 114, 127, 140, 162, 184, 206, 228, 250, 272, 304, 336, 368, 400, 432, 464, 496, 528, 560, 592, 624, 656, 688, 720, 752, 784, 816, 848, 880, 912, 944, 976, 1008, 1040, 1072, 1104, 1136, 1168, 1200, 1232, 1264, 1296]
        },
        novaDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [3, 7, 11, 15, 19, 23, 27, 31, 39, 47, 55, 63, 71, 79, 87, 95, 123, 151, 179, 207, 235, 263, 308, 353, 398, 443, 488, 533, 595, 657, 719, 781, 843, 905, 967, 1029, 1091, 1153, 1215, 1277, 1339, 1401, 1463, 1525, 1587, 1649, 1711, 1773, 1835, 1897, 1959, 2021, 2083, 2145, 2207, 2269, 2331, 2393, 2455, 2517]
        },
        attackRating: {
          base: 20,
          perLevel: 12
        },
        manaCost: [2, 2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5, 5.1, 5.3, 5.5, 5.7, 5.9, 6.1, 6.3, 6.5, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.1, 8.3, 8.5, 8.7, 8.9, 9.1, 9.3, 9.5, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1, 12.3, 12.5, 12.6, 12.8, 13],
        synergies: [{
          skillId: 'lightningstrikecontainer',
          bonusPerLevel: 20,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningstrikecontainer',
          bonusPerLevel: 20,
          damageType: 'nova'
        },
        {
          skillId: 'lightningboltcontainer',
          bonusPerLevel: 20,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningboltcontainer',
          bonusPerLevel: 20,
          damageType: 'nova'
        }
        ]
      },
      lightningboltcontainer: {
        name: "Lightning Bolt",
        type: "placeholder"

      },

      chargedstrikecontainer: {
        name: "Charged Strike",
        type: "lightning",
        chargedBolts: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [40, 52, 64, 76, 88, 100, 112, 124, 140, 156, 172, 188, 204, 220, 236, 252, 272, 292, 312, 332, 352, 372, 396, 420, 444, 468, 492, 516, 544, 572, 600, 628, 656, 684, 712, 740, 768, 796, 824, 852, 880, 908, 936, 964, 992, 1020, 1048, 1076, 1104, 1132, 1160, 1188, 1216, 1244, 1272, 1300, 1328, 1356, 1384, 1412]
        },
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        synergies: [{
          skillId: 'powerstrikecontainer',
          bonusPerLevel: 8,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningstrikecontainer',
          bonusPerLevel: 8,
          damageType: 'lightning'
        },
        ]
      },
      lightningstrikecontainer: {
        name: "Lightning Strike",
        type: "lightning",
        hits: [4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [25, 35, 45, 55, 65, 75, 85, 95, 115, 135, 155, 175, 195, 215, 235, 255, 290, 325, 360, 395, 430, 465, 520, 575, 630, 685, 740, 795, 870, 945, 1020, 1095, 1170, 1245, 1320, 1395, 1470, 1545, 1620, 1695, 1770, 1845, 1920, 1995, 2070, 2145, 2220, 2295, 2370, 2445, 2520, 2595, 2670, 2745, 2820, 2895, 2970, 3045, 3120, 3195]
        },
        manaCost: [6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7],
        synergies: [{
          skillId: 'powerstrikecontainer',
          bonusPerLevel: 8,
          damageType: 'lightning'
        },
        {
          skillId: 'chargedstrikecontainer',
          bonusPerLevel: 8,
          damageType: 'lightning'
        }
        ]
      },
      lightningboltcontainer: {
        name: "Lightning Bolt",
        type: "lightning_conversion",
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [40, 52, 64, 76, 88, 100, 112, 124, 150, 176, 202, 228, 254, 280, 306, 332, 386, 440, 494, 548, 602, 656, 738, 820, 902, 984, 1066, 1148, 1258, 1368, 1478, 1588, 1698, 1808, 1918, 2028, 2138, 2248, 2358, 2468, 2578, 2688, 2798, 2908, 3018, 3128, 3238, 3348, 3458, 3568, 3678, 3788, 3898, 4008, 4118, 4228, 4338, 4448, 4558, 4668]
        },
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        convertsPhysical: true,
        synergies: [{
          skillId: 'powerstrikecontainer',
          bonusPerLevel: 15,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningfurycontainer',
          bonusPerLevel: 15,
          damageType: 'lightning'
        }
        ]
      },
      plaguejavelincontainer: {
        name: "Plague Javelin",
        type: "poison",
        poisonDamage: {
          min: [23, 37, 51, 65, 79, 93, 107, 121, 150, 178, 206, 234, 262, 290, 318, 346, 393, 440, 487, 534, 581, 628, 721, 815, 909, 1003, 1096, 1190, 1378, 1565, 1753, 1940, 2128, 2315, 2503, 2690, 2878, 3065, 3253, 3440, 3628, 3815, 4003, 4190, 4378, 4565, 4753, 4940, 5128, 5315, 5503, 5690, 5878, 6065, 6253, 6440, 6628, 6815, 7003, 7190],
          max: [37, 51, 65, 79, 93, 107, 121, 135, 164, 192, 220, 248, 276, 304, 332, 360, 407, 454, 501, 548, 595, 642, 735, 829, 923, 1017, 1110, 1204, 1392, 1579, 1767, 1954, 2142, 2329, 2517, 2704, 2892, 3079, 3267, 3454, 3642, 3829, 4017, 4204, 4392, 4579, 4767, 4954, 5142, 5329, 5517, 5704, 5892, 6079, 6267, 6454, 6642, 6829, 7017, 7204]
        },
        attackRating: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640],
        manaCost: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5],
        synergies: [{
          skillId: 'poisonjavelincontainer',
          bonusPerLevel: 12,
          damageType: 'poison'
        },
        {
          skillId: 'javelinandspearmasterycontainer',
          bonusPerLevel: 6,
          damageType: 'poison'
        }
        ]
      },
      lightningfurycontainer: {
        name: "Lightning Fury",
        type: "lightning",
        bolts: [10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 22],
        lightningDamage: {
          min: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          max: [65, 73, 81, 89, 97, 105, 113, 121, 130, 139, 148, 157, 166, 175, 184, 193, 203, 213, 223, 233, 243, 253, 264, 275, 286, 297, 308, 319, 331, 343, 355, 367, 379, 391, 403, 415, 427, 439, 451, 463, 475, 487, 499, 511, 523, 535, 547, 559, 571, 583, 595, 607, 619, 631, 643, 655, 667, 679, 691, 703]
        },
        manaCost: [5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7],
        synergies: [{
          skillId: 'powerstrikecontainer',
          bonusPerLevel: 3,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningboltcontainer',
          bonusPerLevel: 3,
          damageType: 'lightning'
        }
        ]
      },
      javelinandspearmasterycontainer: {
        name: "Javelin and Spear Mastery",
        type: "passive",
        damage: [40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925],
        criticalStrike: [5, 9, 12, 15, 17, 19, 20, 21, 23, 23, 24, 25, 26, 26, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35]
      },
      innersightcontainer: {
        name: "Inner Sight",
        type: "passive",
        duration: [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244],
        enemyAttackRating: [-10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
        enemyDefense: [-40, -65, -90, -115, -140, -165, -190, -215, -260, -305, -350, -395, -440, -485, -530, -575, -635, -695, -755, -815, -875, -935, -1015, -1095, -1175, -1255, -1335, -1415, -1515, -1615, -1715, -1815, -1915, -2015, -2115, -2215, -2315, -2415, -2515, -2615, -2715, -2815, -2915, -3015, -3115, -3215, -3315, -3415, -3515, -3615, -3715, -3815, -3915, -4015, -4115, -4215, -4315, -4415, -4515, -4615],
        radius: [6.6, 7.3, 8, 8.6, 9.3, 10, 10.6, 11.3, 12, 12.6, 13.3, 14, 14.6, 15.3, 16, 16.6, 17.3, 18, 18.6, 19.3, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
      },
      evadecontainer: {
        name: "Evade",
        type: "passive",
        dodgeChance: [6, 11, 15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 31, 32, 32, 32, 33, 33, 34, 34, 34, 35, 35, 36, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        movementSpeed: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65]
      },
      slowmovementcontainer: {
        name: "Slow Movement",
        type: "passive",
        enemyMovementSpeed: [-20, -22, -24, -26, -28, -30, -32, -34, -36, -38, -40, -42, -44, -46, -48, -50, -52, -54, -56, -58, -60, -62, -64, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65, -65],
        enemyRangedAttacksSlowed: [75, 73, 71, 69, 67, 65, 63, 61, 59, 57, 55, 53, 51, 49, 47, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        radius: [12, 12.6, 13.3, 14, 14.6, 15.3, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
        duration: [10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8, 16, 16.2, 16.4, 16.6, 16.8, 17, 17.2, 17.4, 17.6, 17.8, 18, 18.2, 18.4, 18.6, 18.8, 19, 19.2, 19.4, 19.6, 19.8, 20, 20.2, 20.4, 20.6, 20.8, 21, 21.2, 21.4, 21.6, 21.8]
      },
      piercecontainer: {
        name: "Pierce",
        type: "passive",
        pierceChance: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
      },
      dodgecontainer: {
        name: "Dodge",
        type: "passive",
        dodgeChance: [6, 11, 15, 18, 20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 31, 32, 32, 32, 33, 33, 34, 34, 34, 35, 35, 36, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        fasterHitRecovery: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24]
      },
      decoycontainer: {
        name: "Decoy",
        type: "summon",
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
        name: "Penetrate",
        type: "passive",
        attackRatingPercent: [35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615, 625],
        enemyPhysicalResistance: [0, 0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7, -7, -8, -8, -9, -9, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10]
      },
      valkyriecontainer: {
        name: "Valkyrie",
        type: "summon",
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
        synergies: [{
          skillId: 'innersightcontainer',
          bonusPerLevel: 20,
          damageType: 'magic'
        },
        {
          skillId: 'slowmovementcontainer',
          bonusPerLevel: 20,
          damageType: 'magic'
        },
        {
          skillId: 'guidedarrowcontainer',
          bonusPerLevel: 20,
          damageType: 'magic'
        }
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
        synergies: [{
          skillId: 'magicarrowcontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        },
        {
          skillId: 'immolationarrowcontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        }
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
        synergies: [{
          skillId: 'magicarrowcontainer',
          bonusPerLevel: 17,
          damageType: 'cold'
        },
        {
          skillId: 'icearrowcontainer',
          bonusPerLevel: 17,
          damageType: 'cold'
        }
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
        synergies: [{
          skillId: 'magicarrowcontainer',
          bonusPerLevel: 16,
          damageType: 'cold'
        },
        {
          skillId: 'coldarrowcontainer',
          bonusPerLevel: 10,
          damageType: 'cold'
        },
        {
          skillId: 'freezingarrowcontainer',
          bonusPerLevel: 10,
          damageType: 'cold'
        }
        ],
        prerequisites: []
      },
      guidedarrowcontainer: {
        name: "Guided Arrow",
        type: "physical_magic_hybrid", // Physical with optional magic conversion based on Magic Arrow synergy
        damage: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295],
        manaCost: [8, 7.7, 7.5, 7.2, 7, 6.7, 6.5, 6.2, 6, 5.7, 5.5, 5.2, 5, 4.7, 4.5, 4.2, 4, 3.7, 3.5, 3.2, 3, 2.7, 2.5, 2.2, 2, 1.7, 1.5, 1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        synergies: [{
          skillId: 'magicarrowcontainer',
          bonusPerLevel: 0.5,
          damageType: 'magic_conversion'
        } // 1% conversion per 2 levels
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
        synergies: [{
          skillId: 'magicarrowcontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        },
        {
          skillId: 'immolationarrowcontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        }
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
        synergies: [{
          skillId: 'penetratecontainer',
          bonusPerLevel: 12,
          damageType: 'physical'
        }],
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
        synergies: [{
          skillId: 'magicarrowcontainer',
          bonusPerLevel: 5,
          damageType: 'fire'
        },
        {
          skillId: 'explodingarrowcontainer',
          bonusPerLevel: 5,
          damageType: 'fire'
        },
        {
          skillId: 'firearrowcontainer',
          bonusPerLevel: 5,
          damageType: 'fire'
        }
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
        synergies: [{
          skillId: 'coldarrowcontainer',
          bonusPerLevel: 6,
          damageType: 'cold'
        },
        {
          skillId: 'icearrowcontainer',
          bonusPerLevel: 6,
          damageType: 'cold'
        }
        ],
        prerequisites: []
      },
      // Barbarian Skills
      generalmasterycontainer: {
        name: "General Mastery",
        type: "passive",
        damage: [30, 38, 46, 54, 62, 70, 78, 86, 94, 102, 110, 118, 126, 134, 142, 150, 158, 166, 174, 182, 190, 198, 206, 214, 222, 230, 238, 246, 254, 262, 270, 278, 286, 294, 302, 310, 318, 326, 334, 342, 350, 358, 366, 374, 382, 390, 398, 406, 414, 422, 430, 438, 446, 454, 462, 470, 478, 486, 494, 502],
        attackRating: [28, 38, 48, 58, 68, 78, 88, 98, 108, 118, 128, 138, 148, 158, 168, 178, 188, 198, 208, 218, 228, 238, 248, 258, 268, 278, 288, 298, 308, 318, 328, 338, 348, 358, 368, 378, 388, 398, 408, 418, 428, 438, 448, 458, 468, 478, 488, 498, 508, 518, 528, 538, 548, 558, 568, 578, 588, 598, 608, 618],
        criticalStrike: [5, 9, 12, 15, 17, 19, 20, 21, 23, 23, 24, 25, 26, 26, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35]
      },
      throwingmasterycontainer: {
        name: "Throwing Mastery",
        type: "passive",
        pierceChance: [15, 17, 19, 21, 23, 25, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
        damage: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325],
        attackRating: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620],
        criticalStrike: [5, 9, 12, 15, 17, 19, 20, 21, 23, 23, 24, 25, 26, 26, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35]
      },
      polearmandspearmasterycontainer: {
        name: "Polearm and Spear Mastery",
        type: "passive",
        damage: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620],
        attackRating: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620],
        criticalStrike: [5, 9, 12, 15, 17, 19, 20, 21, 23, 23, 24, 25, 26, 26, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35]
      },
      combatreflexescontainer: {
        name: "Combat Reflexes",
        type: "passive",
        life: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620],
        stamina: [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915],
        fasterHitRecovery: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40]
      },
      ironskinscontainer: {
        name: "Iron Skin",
        type: "passive",
        defense: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620],
        physicalDamageReduction: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
      },
      increasedspeedcontainer: {
        name: "Increased Speed",
        type: "passive",
        movementSpeed: [13, 18, 22, 25, 28, 30, 32, 33, 35, 36, 37, 38, 39, 40, 40, 41, 41, 42, 42, 43, 43, 43, 44, 44, 44, 45, 45, 45, 46, 46, 46, 46, 46, 46, 46, 47, 47, 47, 47, 47, 47, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 50],
        increasedAttackSpeed: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40]
      },
      naturalresistancecontainer: {
        name: "Natural Resistance",
        type: "passive",
        allResistances: [11, 20, 27, 33, 37, 41, 44, 46, 49, 51, 53, 54, 56, 57, 58, 60, 60, 61, 62, 63, 63, 64, 65, 66, 66, 66, 67, 67, 68, 68, 69, 69, 69, 69, 69, 70, 70, 71, 71, 71, 71, 72, 72, 72, 72, 72, 72, 72, 73, 73, 73, 73, 73, 74, 74, 74, 74, 74, 74, 75]
      },
      deepwoundscontainer: {
        name: "Deep Wounds",
        type: "passive",
        openWoundsDamage: [80, 100, 120, 140, 160, 180, 200, 220, 248, 276, 304, 332, 360, 388, 416, 444, 480, 516, 552, 588, 624, 660, 704, 748, 792, 836, 880, 924, 976, 1028, 1080, 1132, 1184, 1236, 1288, 1340, 1392, 1444, 1496, 1548, 1600, 1652, 1704, 1756, 1808, 1860, 1912, 1964, 2016, 2068, 2120, 2172, 2224, 2276, 2328, 2380, 2432, 2484, 2536, 2588],
        openWoundsChance: [5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35],
        synergies: [{
          skillId: 'grimwardcontainer',
          bonusPerLevel: 4,
          damageType: 'owdmg'
        }]
      },
      bashcontainer: {
        name: "Bash",
        type: "physical",
        attackRating: [27, 39, 51, 63, 75, 87, 99, 111, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 267, 279, 291, 303, 315, 327, 339, 351, 363, 375, 387, 399, 411, 423, 435, 447, 459, 471, 483, 495, 507, 519, 531, 543, 555, 567, 579, 591, 603, 615, 627, 639, 651, 663, 675, 687, 699, 711, 723, 735],
        damage: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        flatDamage: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        manaCost: [2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7],
        synergies: [{
          skillId: 'stuncontainer',
          bonusPerLevel: 18,
          damageType: 'physical'
        },
        {
          skillId: 'concentratecontainer',
          bonusPerLevel: 18,
          damageType: 'physical'
        }
        ]
      },
      doubleswingcontainer: {
        name: "Double Swing",
        type: "physical",
        attackRating: [20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905],
        damage: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320, 1350, 1380, 1410, 1440, 1470, 1500, 1530, 1560, 1590, 1620, 1650, 1680, 1710, 1740, 1770, 1800],
        manaCost: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15],
        synergies: [{
          skillId: 'frenzycontainer',
          bonusPerLevel: 20,
          damageType: 'physical'
        },
        {
          skillId: 'stuncontainer',
          bonusPerLevel: 20,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'doubleswingcontainer',
          bonusPerLevel: 20,
          damageType: 'physical'
        },
        {
          skillId: 'stuncontainer',
          bonusPerLevel: 20,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'concentratecontainer',
          bonusPerLevel: 10,
          damageType: 'attackRating'
        }]
      },
      concentratecontainer: {
        name: "Concentrate",
        type: "magic_conversion",
        attackRating: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220],
        damage: [80, 105, 130, 155, 180, 205, 230, 255, 280, 305, 330, 355, 380, 405, 430, 455, 480, 505, 530, 555, 580, 605, 630, 655, 680, 705, 730, 755, 780, 805, 830, 855, 880, 905, 930, 955, 980, 1005, 1030, 1055, 1080, 1105, 1130, 1155, 1180, 1205, 1230, 1255, 1280, 1305, 1330, 1355, 1380, 1405, 1430, 1455, 1480, 1505, 1530, 1555],
        defenseBonus: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315],
        magicConversion: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70],
        manaCost: 2,
        synergies: [{
          skillId: 'bashcontainer',
          bonusPerLevel: 25,
          damageType: 'physical'
        },
        {
          skillId: 'battlecommandcontainer',
          bonusPerLevel: 25,
          damageType: 'physical'
        }
        ]
      },
      doublethrowcontainer: {
        name: "Double Throw",
        type: "physical",
        attackRating: [35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905, 920],
        damage: [45, 53, 61, 69, 77, 85, 93, 101, 109, 117, 125, 133, 141, 149, 157, 165, 173, 181, 189, 197, 205, 213, 221, 229, 237, 245, 253, 261, 269, 277, 285, 293, 301, 309, 317, 325, 333, 341, 349, 357, 365, 373, 381, 389, 397, 405, 413, 421, 429, 437, 445, 453, 461, 469, 477, 485, 493, 501, 509, 517],
        bounces: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        manaCost: [3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32],
        synergies: [{
          skillId: 'doubleswingcontainer',
          bonusPerLevel: 6,
          damageType: 'physical'
        },
        {
          skillId: 'frenzycontainer',
          bonusPerLevel: 6,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'leapcontainer',
          bonusPerLevel: 8,
          damageType: 'physical'
        },
        {
          skillId: 'bashcontainer',
          bonusPerLevel: 8,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'tauntcontainer',
          bonusPerLevel: 12,
          damageType: 'physical'
        },
        {
          skillId: 'combatreflexescontainer',
          bonusPerLevel: 12,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'howlcontainer',
          bonusPerLevel: 16,
          damageType: 'physical'
        },
        {
          skillId: 'battlecrycontainer',
          bonusPerLevel: 16,
          damageType: 'physical'
        },
        {
          skillId: 'tauntcontainer',
          bonusPerLevel: 12,
          damageType: 'physical'
        },
        {
          skillId: 'shoutcontainer',
          bonusPerLevel: 12,
          damageType: 'physical'
        },
        {
          skillId: 'battlecommandcontainer',
          bonusPerLevel: 12,
          damageType: 'physical'
        },
        {
          skillId: 'battleorderscontainer',
          bonusPerLevel: 12,
          damageType: 'physical'
        }
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
        bonusSkills: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
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
      clawanddaggermasterycontainer: {
        name: "Claw and Dagger Mastery",
        type: "passive",
        damage: [40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925],
        attackRating: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620],
        criticalStrike: [3, 6, 9, 11, 12, 13, 14, 15, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25]
      },
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
        synergies: [{
          skillId: 'dragontailcontainer',
          bonusPerLevel: 22,
          damageType: 'physical'
        },
        {
          skillId: 'dragonflightcontainer',
          bonusPerLevel: 22,
          damageType: 'physical'
        }
        ]
      },
      dragonclawcontainer: {
        name: "Dragon Claw",
        type: "physical",
        damage: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        attackRating: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220],
        hitsPerAttack: 2,
        manaCost: 2,
        synergies: [{
          skillId: 'clawanddaggermasterycontainer',
          bonusPerLevel: 20,
          damageType: 'physical'
        },
        {
          skillId: 'weaponblockcontainer',
          bonusPerLevel: 20,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'tigerstrikecontainer',
          bonusPerLevel: 26,
          damageType: 'fire'
        },
        {
          skillId: 'dragonflightcontainer',
          bonusPerLevel: 26,
          damageType: 'fire'
        }
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
        synergies: [{
          skillId: 'venomcontainer',
          bonusPerLevel: 20,
          damageType: 'poison'
        }]
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
        synergies: [{
          skillId: 'dragonclawcontainer',
          bonusPerLevel: 16,
          damageType: 'lightning'
        }]
      },
      dragontailcontainer: {
        name: "Dragon Tail",
        type: "kick",
        fireDamage: [40, 53, 66, 79, 92, 105, 118, 131, 144, 157, 170, 183, 196, 209, 222, 235, 248, 261, 274, 287, 300, 313, 326, 339, 352, 365, 378, 391, 404, 417, 430, 443, 456, 469, 482, 495, 508, 521, 534, 547, 560, 573, 586, 599, 612, 625, 638, 651, 664, 677, 690, 703, 716, 729, 742, 755, 768, 781, 794, 807],
        attackRating: [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800],
        radius: 4,
        manaCost: 10,
        synergies: [{
          skillId: 'dragontaloncontainer',
          bonusPerLevel: 8,
          damageType: 'fire'
        },
        {
          skillId: 'dragonflightcontainer',
          bonusPerLevel: 8,
          damageType: 'fire'
        }
        ]
      },
      dragonflightcontainer: {
        name: "Dragon Flight",
        type: "physical",
        damage: [100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525, 1550, 1575],
        attackRating: [180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945, 960, 975, 990, 1005, 1020, 1035, 1050, 1065],
        manaCost: 15,
        cooldown: 2
      },
      bladesoficecontainer: {
        name: "Blades of Ice",
        type: "charge_up",
        charge1IceDamage: {
          min: [13, 20, 27, 34, 41, 48, 55, 62, 72, 82, 92, 102, 112, 122, 132, 142, 165, 188, 211, 234, 257, 280, 317, 354, 391, 428, 465, 502, 551, 600, 649, 698, 747, 796, 845, 894, 943, 992, 1041, 1090, 1139, 1188, 1237, 1286, 1335, 1384, 1433, 1482, 1531, 1580, 1629, 1678, 1727, 1776, 1825, 1874, 1923, 1972, 2021, 2070],
          max: [30, 39, 48, 57, 66, 75, 84, 93, 105, 117, 129, 141, 153, 165, 177, 189, 214, 239, 264, 289, 314, 339, 376, 413, 450, 487, 524, 561, 611, 661, 711, 761, 811, 861, 911, 961, 1011, 1061, 1111, 1161, 1211, 1261, 1311, 1361, 1411, 1461, 1511, 1561, 1611, 1661, 1711, 1761, 1811, 1861, 1911, 1961, 2011, 2061, 2111, 2161]
        },
        charge2WaveDamage: {
          min: [15, 23, 31, 39, 47, 55, 63, 71, 82, 95, 107, 119, 131, 143, 155, 167, 194, 221, 248, 275, 302, 329, 372, 415, 458, 501, 544, 587, 645, 703, 761, 819, 877, 935, 993, 1051, 1109, 1167, 1225, 1283, 1341, 1399, 1457, 1515, 1573, 1631, 1689, 1747, 1805, 1863, 1921, 1979, 2037, 2095, 2153, 2211, 2269, 2327, 2385, 2443],
          max: [35, 45, 55, 65, 75, 85, 95, 105, 119, 133, 147, 161, 175, 189, 203, 217, 246, 275, 304, 333, 362, 391, 435, 479, 523, 567, 611, 655, 714, 773, 832, 891, 950, 1009, 1068, 1127, 1186, 1245, 1304, 1363, 1422, 1481, 1540, 1599, 1658, 1717, 1776, 1835, 1894, 1953, 2012, 2071, 2130, 2189, 2248, 2307, 2366, 2425, 2484, 2543]
        },
        charge3BoltDamage: {
          min: [11, 17, 23, 29, 35, 41, 47, 53, 62, 71, 80, 89, 98, 107, 116, 125, 145, 165, 185, 205, 225, 245, 277, 309, 341, 373, 405, 437, 481, 525, 569, 613, 657, 701, 745, 789, 833, 877, 921, 965, 1009, 1053, 1097, 1141, 1185, 1229, 1273, 1317, 1361, 1405, 1449, 1493, 1537, 1581, 1625, 1669, 1713, 1757, 1801, 1845],
          max: [26, 34, 42, 50, 58, 66, 74, 82, 93, 104, 115, 126, 137, 148, 159, 170, 192, 214, 236, 258, 280, 302, 335, 368, 401, 434, 467, 500, 544, 588, 632, 676, 720, 764, 808, 852, 896, 940, 984, 1028, 1072, 1116, 1160, 1204, 1248, 1292, 1336, 1380, 1424, 1468, 1512, 1556, 1600, 1644, 1688, 1732, 1776, 1820, 1864, 1908]
        },
        attackRating: [160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750],
        manaCost: 3
      },
      phoenixstrikecontainer: {
        name: "Phoenix Strike",
        type: "charge_up",
        meteorDamage: {
          min: [20, 30, 40, 50, 60, 70, 80, 90, 109, 128, 147, 166, 185, 204, 223, 242, 271, 300, 329, 358, 387, 416, 454, 492, 530, 568, 606, 644, 690, 736, 782, 828, 874, 920, 966, 1012, 1058, 1104, 1150, 1196, 1242, 1288, 1334, 1380, 1426, 1472, 1518, 1564, 1610, 1656, 1702, 1748, 1794, 1840, 1886, 1932, 1978, 2024, 2070, 2116],
          max: [40, 50, 60, 70, 80, 90, 100, 110, 131, 152, 173, 194, 215, 236, 257, 278, 311, 344, 377, 410, 443, 476, 518, 560, 602, 644, 686, 728, 778, 828, 878, 928, 978, 1028, 1078, 1128, 1178, 1228, 1278, 1328, 1378, 1428, 1478, 1528, 1578, 1628, 1678, 1728, 1778, 1828, 1878, 1928, 1978, 2028, 2078, 2128, 2178, 2228, 2278, 2328]
        },
        burningDamage: {
          min: [14, 25, 37, 49, 60, 72, 84, 96, 119, 142, 166, 189, 213, 236, 260, 283, 321, 358, 396, 433, 471, 508, 560, 611, 663, 714, 766, 817, 888, 958, 1028, 1099, 1169, 1239, 1310, 1380, 1450, 1521, 1591, 1661, 1732, 1802, 1872, 1943, 2013, 2083, 2154, 2224, 2294, 2365, 2435, 2505, 2576, 2646, 2716, 2787, 2857, 2927, 2998, 3068],
          max: [23, 35, 46, 58, 70, 82, 93, 105, 128, 152, 175, 199, 222, 246, 269, 292, 332, 372, 412, 452, 492, 532, 588, 644, 700, 757, 813, 869, 944, 1019, 1094, 1169, 1244, 1319, 1394, 1469, 1544, 1619, 1694, 1769, 1844, 1919, 1994, 2069, 2144, 2219, 2294, 2369, 2444, 2519, 2594, 2669, 2744, 2819, 2894, 2969, 3044, 3119, 3194, 3269]
        },
        lightningDamage: {
          min: new Array(60).fill(1),
          max: [40, 60, 80, 100, 120, 140, 160, 180, 220, 260, 300, 340, 380, 420, 460, 500, 560, 620, 680, 740, 800, 860, 940, 1020, 1100, 1180, 1260, 1340, 1440, 1540, 1640, 1740, 1840, 1940, 2040, 2140, 2240, 2340, 2440, 2540, 2640, 2740, 2840, 2940, 3040, 3140, 3240, 3340, 3440, 3540, 3640, 3740, 3840, 3940, 4040, 4140, 4240, 4340, 4440, 4540]
        },
        coldDamage: {
          min: [16, 20, 24, 28, 32, 36, 40, 44, 52, 60, 68, 76, 84, 92, 100, 108, 120, 132, 144, 156, 168, 180, 200, 220, 240, 260, 280, 300, 328, 356, 384, 412, 440, 468, 496, 524, 552, 580, 608, 636, 664, 692, 720, 748, 776, 804, 832, 860, 888, 916, 944, 972, 1000, 1028, 1056, 1084, 1112, 1140, 1168, 1196],
          max: [32, 36, 40, 44, 48, 52, 56, 60, 68, 76, 84, 92, 100, 108, 116, 124, 137, 150, 163, 176, 189, 202, 223, 244, 265, 286, 307, 328, 357, 386, 415, 444, 473, 502, 531, 560, 589, 618, 647, 676, 705, 734, 763, 792, 821, 850, 879, 908, 937, 966, 995, 1024, 1053, 1082, 1111, 1140, 1169, 1198, 1227, 1256]
        },
        attackRating: [160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750],
        manaCost: 4,
        synergies: [{
          skillId: 'fistsoffirecontainer',
          bonusPerLevel: 14,
          damageType: 'fire'
        }, // Meteor damage
        {
          skillId: 'fistsoffirecontainer',
          bonusPerLevel: 10,
          damageType: 'fire'
        }, // Fire damage per second
        {
          skillId: 'clawsofthundercontainer',
          bonusPerLevel: 10,
          damageType: 'lightning'
        },
        {
          skillId: 'bladesoficecontainer',
          bonusPerLevel: 14,
          damageType: 'cold'
        }
        ]
      },
      psychichammercontainer: {
        name: "Psychic Hammer",
        type: "magic",
        magicDamage: {
          min: [4, 7, 10, 13, 16, 19, 22, 25, 31, 37, 43, 49, 55, 61, 67, 73, 85, 97, 109, 121, 133, 145, 169, 193, 217, 241, 265, 289, 325, 361, 397, 433, 469, 505, 541, 577, 613, 649, 685, 721, 757, 793, 829, 865, 901, 937, 973, 1009, 1045, 1081, 1117, 1153, 1189, 1225, 1261, 1297, 1333, 1369, 1405, 1441],
          max: [6, 10, 14, 18, 22, 26, 30, 34, 42, 50, 58, 66, 74, 82, 90, 98, 112, 126, 140, 154, 168, 182, 208, 234, 260, 286, 312, 338, 376, 414, 452, 490, 528, 566, 604, 642, 680, 718, 756, 794, 832, 870, 908, 946, 984, 1022, 1060, 1098, 1136, 1174, 1212, 1250, 1288, 1326, 1364, 1402, 1440, 1478, 1516, 1554]
        },
        bounces: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        manaCost: [1.5, 1.7, 2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2],
        synergies: [{
          skillId: 'mindblastcontainer',
          bonusPerLevel: 20,
          damageType: 'magic'
        },
        {
          skillId: 'cloakofshadowscontainer',
          bonusPerLevel: 20,
          damageType: 'magic'
        },
        {
          skillId: 'shadowwarriorcontainer',
          bonusPerLevel: 20,
          damageType: 'magic'
        }
        ]
      },
      burstofspeedcontainer: {
        name: "Burst of Speed",
        type: "buff",
        movementSpeed: [20, 22, 24, 26, 28, 30, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
        attackSpeed: [15, 22, 27, 31, 34, 37, 39, 41, 43, 44, 45, 47, 48, 48, 49, 50, 51, 51, 52, 52, 53],
        duration: [300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595],
        manaCost: 10
      },
      cloakofshadowscontainer: {
        name: "Cloak of Shadows",
        type: "buffdebuff",
        defenseBonus: [5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 30, 32, 33, 35, 36, 38, 39, 41, 42, 44, 45, 47, 48, 50, 51, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 68, 69, 71, 72, 74, 75, 77, 78, 80, 81, 83, 84, 86, 87, 89, 90, 92, 93],
        enemyDefenseBonus: [-15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63, -64, -65, -66, -67, -68, -69, -70, -71, -72, -73, -74],
        range: 20,
        manaCost: 13,
        duration: 5,
        cooldown: 5
      },
      mindblastcontainer: {
        name: "Mind Blast",
        type: "pure_physical",
        physicalDamage: {
          min: [10, 13, 16, 19, 22, 25, 28, 31, 38, 45, 52, 59, 66, 73, 80, 87, 104, 121, 138, 155, 172, 189, 223, 257, 291, 325, 359, 393, 444, 495, 546, 597, 648, 699, 750, 801, 852, 903, 954, 1005, 1056, 1107, 1158, 1209, 1260, 1311, 1362, 1413, 1464, 1515, 1566, 1617, 1668, 1719, 1770, 1821, 1872, 1923, 1974, 2025],
          max: [20, 23, 26, 29, 32, 35, 38, 41, 48, 55, 62, 69, 76, 83, 90, 97, 114, 131, 148, 165, 182, 199, 233, 267, 301, 335, 369, 403, 454, 505, 556, 607, 658, 709, 760, 811, 862, 913, 964, 1015, 1066, 1117, 1168, 1219, 1270, 1321, 1372, 1423, 1474, 1525, 1576, 1627, 1678, 1729, 1780, 1831, 1882, 1933, 1984, 2035]
        },
        radius: [2.6, 2.6, 3.3, 3.3, 4, 4, 4.6, 4.6, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3],
        stunLength: [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        manaCost: 9,
        synergies: [{
          skillId: 'psychichammercontainer',
          bonusPerLevel: 13,
          damageType: 'physical'
        },
        {
          skillId: 'cloakofshadowscontainer',
          bonusPerLevel: 13,
          damageType: 'physical'
        },
        {
          skillId: 'shadowwarriorcontainer',
          bonusPerLevel: 13,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'shockwebcontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        },
        {
          skillId: 'chargedboltsentrycontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        },
        {
          skillId: 'lightningsentrycontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        },
        {
          skillId: 'chainlightningsentrycontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        },
        {
          skillId: 'wakeoffirecontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        },
        {
          skillId: 'wakeofinfernocontainer',
          bonusPerLevel: 18,
          damageType: 'fire'
        }
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
        synergies: [{
          skillId: 'chargedboltsentrycontainer',
          bonusPerLevel: 17,
          damageType: 'lightning'
        },
        {
          skillId: 'wakeoffirecontainer',
          bonusPerLevel: 17,
          damageType: 'lightning'
        },
        {
          skillId: 'chainlightningsentrycontainer',
          bonusPerLevel: 17,
          damageType: 'lightning'
        },
        {
          skillId: 'fireblastcontainer',
          bonusPerLevel: 17,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningsentrycontainer',
          bonusPerLevel: 17,
          damageType: 'lightning'
        },
        {
          skillId: 'wakeofinfernocontainer',
          bonusPerLevel: 17,
          damageType: 'lightning'
        }
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
        synergies: [{
          skillId: 'bladefurycontainer',
          bonusPerLevel: 15,
          damageType: 'physical'
        },
        {
          skillId: 'bladeshieldcontainer',
          bonusPerLevel: 15,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'fireblastcontainer',
          bonusPerLevel: 8,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningsentrycontainer',
          bonusPerLevel: 8,
          damageType: 'lightning'
        },
        {
          skillId: 'chainlightningsentrycontainer',
          bonusPerLevel: 8,
          damageType: 'lightning'
        }
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
        synergies: [{
          skillId: 'fireblastcontainer',
          bonusPerLevel: 8,
          damageType: 'fire'
        },
        {
          skillId: 'wakeofinfernocontainer',
          bonusPerLevel: 8,
          damageType: 'fire'
        }
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
        synergies: [{
          skillId: 'bladesentinelcontainer',
          bonusPerLevel: 15,
          damageType: 'physical'
        },
        {
          skillId: 'bladeshieldcontainer',
          bonusPerLevel: 15,
          damageType: 'physical'
        }
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
        synergies: [{
          skillId: 'fireblastcontainer',
          bonusPerLevel: 16,
          damageType: 'lightning'
        },
        {
          skillId: 'chargedboltsentrycontainer',
          bonusPerLevel: 16,
          damageType: 'lightning'
        },
        {
          skillId: 'chainlightningsentrycontainer',
          bonusPerLevel: 16,
          damageType: 'lightning'
        }
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
        synergies: [{
          skillId: 'fireblastcontainer',
          bonusPerLevel: 10,
          damageType: 'fire'
        },
        {
          skillId: 'wakeoffirecontainer',
          bonusPerLevel: 10,
          damageType: 'fire'
        }
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
        synergies: [{
          skillId: 'fireblastcontainer',
          bonusPerLevel: 13,
          damageType: 'lightning'
        },
        {
          skillId: 'chargedboltsentrycontainer',
          bonusPerLevel: 13,
          damageType: 'lightning'
        },
        {
          skillId: 'lightningsentrycontainer',
          bonusPerLevel: 13,
          damageType: 'lightning'
        }
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
        corpseExplosionPercent: {
          min: 3,
          max: 5
        },
        radius: 12,
        synergies: [{
          skillId: 'wakeofinfernocontainer',
          bonusPerLevel: 8,
          damageType: 'both'
        },
        {
          skillId: 'fireblastcontainer',
          bonusPerLevel: 8,
          damageType: 'both'
        }
        ]
      },

      // Druid Skills
      ravencontainer: {
        name: "Raven",
        type: "summon",
        physicalDamage: {
          min: [2, 2, 3, 3, 4, 4, 5, 5, 7, 7, 8, 9, 10, 11, 12, 13, 20, 27, 34, 41, 48, 55, 66, 76, 87, 97, 108, 118, 132, 146, 160, 174, 188, 202, 216, 230, 244, 258, 272, 286, 300, 314, 328, 342, 356, 370, 384, 398, 412, 426, 440, 454, 468, 482, 496, 510, 524, 538, 552, 566],
          max: [3, 3, 4, 4, 5, 5, 6, 6, 9, 9, 11, 12, 14, 15, 17, 18, 26, 33, 41, 48, 56, 63, 74, 85, 96, 107, 118, 129, 144, 158, 173, 187, 202, 216, 231, 245, 260, 274, 289, 303, 318, 332, 347, 361, 376, 390, 405, 419, 434, 448, 463, 477, 492, 506, 521, 535, 550, 564, 579, 593]
        },
        coldDamage: {
          min: [2, 2, 3, 3, 4, 4, 5, 5, 7, 7, 8, 9, 10, 11, 12, 13, 20, 27, 34, 41, 48, 55, 66, 76, 87, 97, 108, 118, 132, 146, 160, 174, 188, 202, 216, 230, 244, 258, 272, 286, 300, 314, 328, 342, 356, 370, 384, 398, 412, 426, 440, 454, 468, 482, 496, 510, 524, 538, 552, 566],
          max: [3, 3, 4, 4, 5, 5, 6, 6, 9, 9, 11, 12, 14, 15, 17, 18, 26, 33, 41, 48, 56, 63, 74, 85, 96, 107, 118, 129, 144, 158, 173, 187, 202, 216, 231, 245, 260, 274, 289, 303, 318, 332, 347, 361, 376, 390, 405, 419, 434, 448, 463, 477, 492, 506, 521, 535, 550, 564, 579, 593]
        },
        totalSummons: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
        summonsPerCast: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
        manaCost: [1.5, 1.7, 2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2],
        synergies: [
          { skillId: 'summonspiritwolfcontainer', bonusPerLevel: 10, damageType: 'both' },
          { skillId: 'summondirewolfcontainer', bonusPerLevel: 10, damageType: 'both' },
          { skillId: 'summongrizzlycontainer', bonusPerLevel: 10, damageType: 'both' }
        ]
      },
      poisoncreepercontainer: {
        name: "Poison Creeper",
        type: "summon",
        poisonDamage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 63, 78, 93, 108, 123, 138, 168, 198, 228, 258, 288, 318, 348, 378, 408, 438, 468, 498, 528, 558, 588, 618, 648, 678, 708, 738, 768, 798, 828, 858, 888, 918, 948, 978, 1008, 1038, 1068, 1098],
          max: [2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 29, 33, 37, 41, 45, 49, 64, 79, 94, 109, 124, 139, 169, 199, 229, 259, 289, 319, 349, 379, 409, 439, 469, 499, 529, 559, 589, 619, 649, 679, 709, 739, 769, 799, 829, 859, 889, 919, 949, 979, 1009, 1039, 1069, 1099]
        },
        enemyPoisonResist: [-5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
        totalSummons: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
        poisonDuration: 4,
        manaCost: 8,
        cooldown: 1,
        synergies: [
          { skillId: 'carrionvinecontainer', bonusPerLevel: 14, damageType: 'poison' },
          { skillId: 'solarcreepercontainer', bonusPerLevel: 14, damageType: 'poison' },
          { skillId: 'rabiescontainer', bonusPerLevel: 14, damageType: 'poison' }
        ]
      },
      heartofwolverinecontainer: {
        name: "Heart of Wolverine",
        type: "buff",
        damageBonus: [25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615],
        attackRatingBonus: [25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615],
        radius: [20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92, 93.3, 94.6, 96, 97.3, 98.6],
        manaCost: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69]
      },
      summonspiritwolfcontainer: {
        name: "Summon Spirit Wolf",
        type: "summon",
        life: {
          normal: [113, 134, 156, 177, 198, 220, 241, 262, 284, 305, 326, 348, 369, 390, 412, 433, 454, 476, 497, 518, 539, 560, 581, 603, 624, 645, 667, 688, 709, 731, 752, 773, 795, 816, 837, 859, 880, 901, 923, 944, 965, 986, 1007, 1028, 1050, 1071, 1092, 1114, 1135, 1156, 1178, 1199, 1220, 1242, 1263, 1284, 1306, 1327, 1348, 1370],
          nightmare: [185, 220, 255, 290, 324, 359, 394, 429, 464, 498, 533, 568, 603, 638, 672, 707, 742, 777, 812, 846, 881, 916, 951, 986, 1020, 1055, 1090, 1125, 1160, 1194, 1229, 1264, 1299, 1334, 1368, 1403, 1438, 1473, 1508, 1542, 1577, 1612, 1647, 1682, 1716, 1751, 1786, 1821, 1856, 1890, 1925, 1960, 1995, 2030, 2064, 2099, 2134, 2169, 2204, 2238],
          hell: [219, 260, 301, 342, 383, 424, 465, 506, 548, 589, 630, 671, 712, 753, 794, 835, 876, 917, 959, 1000, 1041, 1082, 1123, 1164, 1205, 1246, 1287, 1328, 1370, 1411, 1452, 1493, 1534, 1575, 1616, 1657, 1698, 1739, 1781, 1822, 1863, 1904, 1945, 1986, 2027, 2068, 2109, 2150, 2192, 2233, 2274, 2315, 2356, 2397, 2438, 2479, 2520, 2561, 2603, 2644]
        },
        damage: {
          min: [12, 14, 16, 18, 20, 22, 24, 26, 29, 32, 35, 38, 41, 44, 47, 50, 54, 58, 62, 66, 70, 74, 79, 84, 89, 94, 99, 104, 110, 116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 266, 272, 278, 284, 290, 296],
          max: [18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 41, 44, 47, 50, 53, 56, 60, 64, 68, 72, 76, 80, 85, 90, 95, 100, 105, 110, 116, 122, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 254, 260, 266, 272, 278, 284, 290, 296, 302]
        },
        totalSummons: [1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        attackRating: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        defense: [57, 74, 91, 108, 125, 142, 159, 176, 193, 210, 227, 244, 261, 278, 295, 312, 329, 346, 363, 380, 397, 414, 431, 448, 465, 482, 499, 516, 533, 550, 567, 584, 601, 618, 635, 652, 669, 686, 703, 720, 737, 754, 771, 788, 805, 822, 839, 856, 873, 890, 907, 924, 941, 958, 975, 992, 1009, 1026, 1043, 1060],
        allResist: [20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
        manaCost: 15,
        synergies: [
          { skillId: 'ravencontainer', bonusPerLevel: 8, damageType: 'physical' },
          { skillId: 'summondirewolfcontainer', bonusPerLevel: 8, damageType: 'physical' }
        ]
      },
      carrionvinecontainer: {
        name: "Carrion Vine",
        type: "utility",
        heals: {
          min: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256, 260],
          max: [44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256, 260, 264, 268, 272, 276, 280]
        },
        manaCost: 10,
        cooldown: 1,
        synergies: [
          { skillId: 'oaksagecontainer', bonusPerLevel: 3, damageType: 'healing' }, // Using 3 as average of 2-4
          { skillId: 'solarcreepercontainer', bonusPerLevel: 3, damageType: 'healing' }
        ]
      },
      spiritofbarbscontainer: {
        name: "Spirit of Barbs",
        type: "buff",
        damageReturned: [15, 23, 31, 39, 47, 55, 63, 71, 87, 103, 119, 135, 151, 167, 183, 199, 231, 263, 295, 327, 359, 391, 439, 487, 535, 583, 631, 679, 743, 807, 871, 935, 999, 1063, 1127, 1191, 1255, 1319, 1383, 1447, 1511, 1575, 1639, 1703, 1767, 1831, 1895, 1959, 2023, 2087, 2151, 2215, 2279, 2343, 2407, 2471, 2535, 2599, 2663, 2727],
        radius: [20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92, 93.3, 94.6, 96, 97.3, 98.6],
        manaCost: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
        synergies: [
          { skillId: 'carrionvinecontainer', bonusPerLevel: 7, damageType: 'return' }
        ]
      },
      summondirewolfcontainer: {
        name: "Summon Dire Wolf",
        type: "summon",
        defenseBonus: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300],
        life: {
          normal: [171, 216, 262, 307, 353, 399, 444, 490, 535, 581, 627, 672, 718, 763, 809, 855, 900, 946, 991, 1037, 1083, 1128, 1174, 1219, 1265, 1311, 1356, 1402, 1447, 1493, 1539, 1584, 1630, 1675, 1721, 1767, 1812, 1858, 1903, 1949, 1995, 2040, 2086, 2131, 2177, 2223, 2268, 2314, 2359, 2405, 2451, 2496, 2542, 2587, 2633, 2679, 2724, 2770, 2815, 2861],
          nightmare: [193, 245, 296, 348, 399, 451, 503, 555, 606, 657, 709, 761, 812, 864, 915, 967, 1019, 1070, 1122, 1173, 1225, 1277, 1328, 1380, 1431, 1483, 1535, 1586, 1638, 1689, 1741, 1793, 1844, 1896, 1947, 1999, 2051, 2102, 2154, 2205, 2257, 2309, 2360, 2412, 2463, 2515, 2567, 2618, 2670, 2721, 2773, 2825, 2876, 2928, 2979, 3031, 3083, 3134, 3186, 3237],
          hell: [216, 273, 331, 388, 446, 504, 562, 619, 677, 734, 792, 849, 907, 964, 1022, 1080, 1138, 1195, 1253, 1310, 1368, 1425, 1483, 1540, 1598, 1656, 1714, 1771, 1829, 1886, 1944, 2001, 2059, 2116, 2174, 2232, 2290, 2347, 2405, 2462, 2520, 2577, 2635, 2692, 2750, 2808, 2866, 2923, 2981, 3038, 3096, 3153, 3211, 3268, 3326, 3384, 3442, 3499, 3557, 3614]
        },
        damage: {
          min: [33, 36, 39, 42, 45, 48, 51, 54, 58, 62, 66, 70, 74, 78, 82, 86, 91, 96, 101, 106, 111, 116, 122, 128, 134, 140, 146, 152, 160, 168, 176, 184, 192, 200, 208, 216, 224, 232, 240, 248, 256, 264, 272, 280, 288, 296, 304, 312, 320, 328, 336, 344, 352, 360, 368, 376, 384, 392, 400, 408],
          max: [38, 42, 46, 50, 54, 58, 62, 66, 71, 76, 81, 86, 91, 96, 101, 106, 112, 118, 124, 130, 136, 142, 149, 156, 163, 170, 177, 184, 192, 200, 208, 216, 224, 232, 240, 248, 256, 264, 272, 280, 288, 296, 304, 312, 320, 328, 336, 344, 352, 360, 368, 376, 384, 400, 408, 416, 424, 432, 440]
        },
        totalDireWolves: [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        lifeBonus: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000],
        allResist: [20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
        manaCost: 20,
        baseAttackRatingBonus: 25,
        synergies: [
          { skillId: 'ravencontainer', bonusPerLevel: 7, damageType: 'physical' },
          { skillId: 'summonspiritwolfcontainer', bonusPerLevel: 7, damageType: 'physical' },
          { skillId: 'summonspiritwolfcontainer', bonusPerLevel: 25, damageType: 'attackRating' }
        ]
      },
      solarcreepercontainer: {
        name: "Solar Creeper",
        type: "utility",
        manaRecovered: {
          min: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147, 150, 153, 156, 159, 162, 165, 168, 171, 174, 177, 180, 183, 186, 189, 192, 195],
          max: [28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88, 91, 94, 97, 100, 103, 106, 109, 112, 115, 118, 121, 124, 127, 130, 133, 136, 139, 142, 145, 148, 151, 154, 157, 160, 163, 166, 169, 172, 175, 178, 181, 184, 187, 190, 193, 196, 199, 202, 205]
        },
        manaCost: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
        cooldown: 1,
        synergies: [
          { skillId: 'oaksagecontainer', bonusPerLevel: 2, damageType: 'manaRecovered' }, // 1-3 mana recovered, using 2
          { skillId: 'carrionvinecontainer', bonusPerLevel: 2, damageType: 'manaRecovered' }
        ]
      },
      oaksagecontainer: {
        name: "Oak Sage",
        type: "buff",
        lifeReplenish: [12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 77, 82, 87, 92, 97, 102, 107, 112, 117, 122, 127, 132, 137, 142, 147, 152, 157, 162, 167, 172, 177, 182, 187, 192, 197, 202, 207, 212, 217, 222, 227, 232, 237, 242, 247, 252, 257, 262, 267, 272, 277, 282, 287, 292],
        lifeBonus: [50, 62, 74, 86, 98, 110, 122, 134, 148, 162, 176, 190, 204, 218, 232, 246, 262, 278, 294, 310, 326, 342, 360, 378, 396, 414, 432, 450, 470, 490, 510, 530, 550, 570, 590, 610, 630, 650, 670, 690, 710, 730, 750, 770, 790, 810, 830, 850, 870, 890, 910, 930, 950, 970, 990, 1010, 1030, 1050, 1070, 1090],
        radius: [20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92, 93.3, 94.6, 96, 97.3, 98.6],
        manaCost: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74],
        synergies: [
          { skillId: 'carrionvinecontainer', bonusPerLevel: 12, damageType: 'healing' },
          { skillId: 'solarcreepercontainer', bonusPerLevel: 12, damageType: 'healing' }
        ]
      },
      summongrizzlycontainer: {
        name: "Summon Grizzly",
        type: "summon",
        life: {
          normal: [676, 730, 784, 838, 892, 946, 1000, 1055, 1109, 1163, 1217, 1271, 1325, 1379, 1433, 1487, 1541, 1595, 1649, 1704, 1758, 1812, 1866, 1920, 1974, 2028, 2082, 2136, 2190, 2244, 2298, 2352, 2407, 2461, 2515, 2569, 2623, 2677, 2731, 2785, 2839, 2893, 2947, 3001, 3056, 3110, 3164, 3218, 3272, 3326, 3380, 3434, 3488, 3542, 3596, 3650, 3704, 3759, 3813, 3867],
          nightmare: [1352, 1460, 1568, 1676, 1785, 1893, 2001, 2109, 2217, 2325, 2434, 2542, 2650, 2758, 2866, 2974, 3083, 3191, 3299, 3407, 3515, 3623, 3732, 3840, 3948, 4056, 4164, 4272, 4380, 4489, 4597, 4705, 4813, 4921, 5029, 5138, 5246, 5354, 5462, 5570, 5678, 5787, 5895, 6003, 6111, 6219, 6327, 6436, 6544, 6652, 6760, 6868, 6976, 7084, 7193, 7301, 7409, 7517, 7625, 7733],
          hell: [2027, 2189, 2352, 2515, 2677, 2839, 3001, 3164, 3326, 3488, 3650, 3813, 3975, 4137, 4299, 4462, 4624, 4786, 4946, 5111, 5273, 5435, 5597, 5760, 5922, 6084, 6246, 6408, 6571, 6733, 6895, 7057, 7220, 7382, 7544, 7706, 7869, 8031, 8193, 8355, 8518, 8680, 8842, 9004, 9167, 9329, 9491, 9653, 9816, 9978, 10140, 10302, 10464, 10627, 10789, 10951, 11113, 11276, 11438, 11600]
        },
        defenseBonus: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300],
        allResist: [20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
        damage: {
          min: [20, 27, 34, 41, 48, 55, 62, 69, 78, 87, 96, 105, 114, 123, 132, 141, 152, 163, 174, 185, 196, 207, 221, 235, 249, 263, 277, 291, 308, 325, 342, 359, 376, 393, 410, 427, 444, 461, 478, 495, 512, 529, 546, 563, 580, 597, 614, 631, 648, 665, 682, 699, 716, 733, 750, 767, 784, 801, 818, 835],
          max: [30, 37, 44, 51, 58, 65, 72, 79, 88, 97, 106, 115, 124, 133, 142, 151, 162, 173, 184, 195, 206, 217, 231, 245, 259, 273, 287, 301, 318, 335, 352, 369, 386, 403, 420, 437, 454, 471, 488, 505, 522, 539, 556, 573, 590, 607, 624, 641, 658, 675, 692, 709, 726, 743, 760, 777, 794, 811, 828, 845]
        },
        damageBonus: [25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615],
        totalGrizzlyBears: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // Scales based on hard points
        manaCost: 40,
        cooldown: 2,
        baseAttackRatingBonus: 25,
        synergies: [
          { skillId: 'ravencontainer', bonusPerLevel: 4, damageType: 'physical' },
          { skillId: 'summonspiritwolfcontainer', bonusPerLevel: 25, damageType: 'attackRating' },
          { skillId: 'summonspiritwolfcontainer', bonusPerLevel: 4, damageType: 'physical' }
        ]
      },


      firestormcontainer: {
        name: "Firestorm",
        type: "fire",
        burningDamage: {
          min: [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 22, 24, 26, 29, 31, 33, 38, 43, 48, 52, 57, 62, 70, 78, 86, 94, 103, 111, 119, 127, 135, 144, 152, 160, 168, 176, 185, 193, 201, 209, 217, 226, 234, 242, 250, 258, 267, 275, 283, 291, 300, 308, 316, 324],
          max: [4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30, 32, 35, 37, 39, 43, 46, 50, 53, 57, 60, 66, 72, 78, 84, 90, 96, 105, 114, 124, 133, 142, 152, 161, 171, 180, 189, 199, 208, 217, 227, 236, 246, 255, 264, 274, 283, 292, 302, 311, 321, 330, 339, 349, 358, 367, 377, 386, 396]
        },
        fireTendrils: [3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7],
        manaCost: 4,
        synergies: [
          { skillId: 'moltenbouldcontainer', bonusPerLevel: 26, damageType: 'fire' },
          { skillId: 'fissurecontainer', bonusPerLevel: 26, damageType: 'fire' }
        ]
      },
      arcticblastcontainer: {
        name: "Arctic Blast",
        type: "cold",
        coldDamage: {
          min: [6, 12, 17, 23, 29, 35, 41, 47, 58, 70, 82, 94, 105, 117, 129, 141, 164, 187, 211, 234, 258, 281, 322, 363, 404, 445, 486, 527, 592, 656, 721, 785, 850, 914, 978, 1043, 1107, 1172, 1236, 1301, 1365, 1430, 1494, 1558, 1623, 1687, 1752, 1816, 1881, 1945, 2010, 2074, 2139, 2203, 2267, 2332, 2396, 2461, 2525, 2590],
          max: [11, 17, 23, 29, 35, 41, 46, 52, 64, 76, 87, 99, 111, 123, 134, 146, 169, 193, 216, 240, 263, 287, 328, 369, 410, 451, 492, 533, 597, 662, 726, 791, 855, 919, 984, 1048, 1113, 1177, 1242, 1306, 1371, 1435, 1500, 1564, 1628, 1693, 1757, 1822, 1886, 1951, 2015, 2080, 2144, 2208, 2273, 2337, 2402, 2466, 2531, 2595]
        },
        enemyColdResist: [-6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50],
        coldLength: [4, 4.6, 5.2, 5.8, 6.4, 7, 7.6, 8.2, 8.8, 9.4, 10, 10.6, 11.2, 11.8, 12.4, 13, 13.6, 14.2, 14.8, 15.4, 16, 16.6, 17.2, 17.8, 18.4, 19, 19.6, 20.2, 20.8, 21.4, 22, 22.6, 23.2, 23.8, 24.4, 25, 25.6, 26.2, 26.8, 27.4, 28, 28.6, 29.2, 29.8, 30.4, 31, 31.6, 32.2, 32.8, 33.4, 34, 34.6, 35.2, 35.8, 36.4, 37, 37.6, 38.2, 38.8, 39.4],
        range: [3.3, 3.3, 3.3, 3.3, 4, 4, 4, 4, 4.6, 4.6, 4.6, 4.6, 5.3, 5.3, 5.3, 5.3, 6, 6, 6, 6, 6.6, 6.6, 6.6, 6.6, 7.3, 7.3, 7.3, 7.3, 8, 8, 8, 8, 8.6, 8.6, 8.6, 8.6, 9.3, 9.3, 9.3, 9.3, 10, 10, 10, 10, 10.6, 10.6, 10.6, 10.6, 11.3, 11.3, 11.3, 11.3, 12, 12, 12, 12, 12.6, 12.6, 12.6, 12.6],
        manaCost: [1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 14, 15, 15, 16, 16, 16, 17, 17, 18, 18, 18, 19, 19, 20, 20, 20, 21, 21, 22, 22, 22, 23, 23, 24, 24, 24],
        synergies: [
          { skillId: 'hurricanecontainer', bonusPerLevel: 16, damageType: 'cold' },
          { skillId: 'tornadocontainer', bonusPerLevel: 10, damageType: 'cold' },
          { skillId: 'cyclonearmorcontainer', bonusPerLevel: 10, damageType: 'cold' }
        ]
      },
      moltenbouldcontainer: {
        name: "Molten Boulder",
        type: "fire",
        physicalDamage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 36, 42, 48, 54, 60, 70, 80, 90, 100, 110, 120, 134, 148, 162, 176, 190, 204, 218, 232, 246, 260, 274, 288, 302, 316, 330, 344, 358, 372, 386, 400, 414, 428, 442, 456, 470, 484, 498, 512, 526, 540, 554, 568],
          max: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 31, 38, 45, 52, 59, 66, 79, 92, 105, 118, 131, 144, 163, 182, 201, 220, 239, 258, 277, 296, 315, 334, 353, 372, 391, 410, 429, 448, 467, 486, 505, 524, 543, 562, 581, 600, 619, 638, 657, 676, 695, 714, 733, 752]
        },
        fireDamage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 36, 42, 48, 54, 60, 70, 80, 90, 100, 110, 120, 134, 148, 162, 176, 190, 204, 218, 232, 246, 260, 274, 288, 302, 316, 330, 344, 358, 372, 386, 400, 414, 428, 442, 456, 470, 484, 498, 512, 526, 540, 554, 568],
          max: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 31, 38, 45, 52, 59, 66, 79, 92, 105, 118, 131, 144, 163, 182, 201, 220, 239, 258, 277, 296, 315, 334, 353, 372, 391, 410, 429, 448, 467, 486, 505, 524, 543, 562, 581, 600, 619, 638, 657, 676, 695, 714, 733, 752]
        },
        burningDamage: {
          min: [2, 3, 4, 5, 7, 8, 9, 10, 12, 15, 17, 19, 22, 24, 26, 29, 36, 43, 50, 57, 64, 71, 83, 94, 106, 118, 130, 141, 155, 169, 183, 198, 212, 226, 240, 254, 268, 282, 296, 310, 324, 338, 352, 366, 380, 394, 408, 423, 437, 451, 465, 479, 493, 507, 521, 535, 549, 563, 577, 591],
          max: [4, 5, 7, 8, 9, 10, 11, 12, 15, 17, 19, 22, 24, 26, 29, 31, 38, 45, 52, 59, 66, 73, 85, 97, 108, 120, 132, 144, 158, 172, 186, 200, 214, 228, 242, 256, 270, 284, 298, 312, 326, 341, 355, 369, 383, 397, 411, 425, 439, 453, 467, 481, 495, 509, 523, 537, 551, 566, 580, 594]
        },
        manaCost: [5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8, 9, 9.1, 9.2, 9.3, 9.5, 9.6, 9.7, 9.8, 10, 10.1, 10.2, 10.3, 10.5, 10.6, 10.7, 10.8, 11, 11.1, 11.2, 11.3, 11.5, 11.6, 11.7, 11.8, 12, 12.1, 12.2, 12.3],
        synergies: [
          { skillId: 'fissurecontainer', bonusPerLevel: 12, damageType: 'both' },
          { skillId: 'volcanocontainer', bonusPerLevel: 12, damageType: 'both' },
          { skillId: 'armageddoncontainer', bonusPerLevel: 12, damageType: 'both' }
        ]
      },
      cyclonearmorcontainer: {
        name: "Cyclone Armor",
        type: "buff",
        elementalAbsorb: [15, 31, 47, 63, 79, 95, 111, 127, 144, 161, 178, 195, 212, 229, 246, 263, 281, 299, 317, 335, 353, 371, 390, 409, 428, 447, 466, 485, 505, 525, 545, 565, 585, 605, 625, 645, 665, 685, 705, 725, 745, 765, 785, 805, 825, 845, 865, 885, 905, 925, 945, 965, 985, 1005, 1025, 1045, 1065, 1085, 1105, 1125],
        manaCost: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
        cooldown: 2,
        // TODO: Implement Energy-based synergy - Gains +3 Additional Absorb per Energy point
        synergies: []
      },
      fissurecontainer: {
        name: "Fissure",
        type: "fire",
        fireDamage: {
          min: [15, 19, 23, 27, 31, 35, 39, 43, 51, 59, 67, 75, 83, 91, 99, 107, 119, 131, 143, 155, 167, 179, 199, 219, 239, 259, 279, 299, 331, 363, 395, 427, 459, 491, 523, 555, 587, 619, 651, 683, 715, 747, 779, 811, 843, 875, 907, 939, 971, 1003, 1035, 1067, 1099, 1131, 1163, 1195, 1227, 1259, 1291, 1323],
          max: [25, 31, 37, 43, 49, 55, 61, 67, 77, 87, 97, 107, 117, 127, 137, 147, 161, 175, 189, 203, 217, 231, 253, 275, 297, 319, 341, 363, 397, 431, 465, 499, 533, 567, 601, 635, 669, 703, 737, 771, 805, 839, 873, 907, 941, 975, 1009, 1043, 1077, 1111, 1145, 1179, 1213, 1247, 1281, 1315, 1349, 1383, 1417, 1451]
        },
        duration: 2.2,
        cooldown: 0.5,
        manaCost: 10,
        synergies: [
          { skillId: 'firestormcontainer', bonusPerLevel: 10, damageType: 'fire' },
          { skillId: 'moltenbouldcontainer', bonusPerLevel: 10, damageType: 'fire' }
        ]
      },
      twistercontainer: {
        name: "Twister",
        type: "physical",
        physicalDamage: {
          min: [6, 8, 10, 12, 14, 16, 18, 20, 23.5, 27, 30.5, 34, 37.5, 41, 44.5, 48, 57.5, 67, 76.5, 86, 95.5, 105, 122.5, 140, 157.5, 175, 192.5, 210, 240.5, 271, 301.5, 332, 362.5, 393, 423.5, 454, 484.5, 515, 545.5, 576, 606.5, 637, 667.5, 698, 728.5, 759, 789.5, 820, 850.5, 881, 911.5, 942, 972.5, 1003, 1033.5, 1064, 1094.5, 1125, 1155.5, 1186],
          max: [8, 11, 14, 17, 20, 23, 26, 29, 33.5, 38, 42.5, 47, 51.5, 56, 60.5, 65, 75.5, 86, 96.5, 107, 117.5, 128, 146.5, 165, 183.5, 202, 220.5, 239, 270.5, 302, 333.5, 365, 396.5, 428, 459.5, 491, 522.5, 554, 585.5, 617, 648.5, 680, 711.5, 743, 774.5, 806, 837.5, 869, 900.5, 932, 963.5, 995, 1026.5, 1058, 1089.5, 1121, 1152.5, 1184, 1215.5, 1247]
        },
        twisters: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
        manaCost: [2, 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.9, 3, 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 3.9, 4, 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.9, 5, 5.1, 5.2, 5.4, 5.5, 5.6, 5.7, 5.9, 6, 6.1, 6.2, 6.4, 6.5, 6.6, 6.7, 6.9, 7, 7.1, 7.2, 7.4, 7.5, 7.6, 7.7, 7.9, 8, 8.1, 8.2, 8.4, 8.5, 8.6, 8.7, 8.9, 9, 9.1, 9.2, 9.4],
        synergies: [
          { skillId: 'hurricanecontainer', bonusPerLevel: 24, damageType: 'physical' },
          { skillId: 'tornadocontainer', bonusPerLevel: 24, damageType: 'physical' },
          { skillId: 'arcticblastcontainer', bonusPerLevel: 24, damageType: 'physical' }
        ]
      },
      gustcontainer: {
        name: "Gust",
        type: "utility",
        cooldown: [6.3, 6.1, 5.9, 5.7, 5.5, 5.3, 5.1, 4.9, 4.7, 4.5, 4.3, 4.1, 3.9, 3.7, 3.5, 3.3, 3.1, 2.9, 2.7, 2.5, 2.3, 2.1, 1.9, 1.7, 1.5, 1.3, 1.1, 0.9, 0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        manaCost: 20
      },
      volcanocontainer: {
        name: "Volcano",
        type: "fire",
        physicalDamage: {
          min: [8, 11, 14, 17, 20, 23, 26, 29, 34, 39, 44, 49, 54, 59, 64, 69, 76, 83, 90, 97, 104, 111, 119, 127, 135, 143, 151, 159, 168, 177, 186, 195, 204, 213, 222, 231, 240, 249, 258, 267, 276, 285, 294, 303, 312, 321, 330, 339, 348, 357, 366, 375, 384, 393, 402, 411, 420, 429, 438, 447],
          max: [10, 13, 16, 19, 22, 25, 28, 31, 36, 41, 46, 51, 56, 61, 66, 71, 78, 85, 92, 99, 106, 113, 121, 129, 137, 145, 153, 161, 170, 179, 188, 197, 206, 215, 224, 233, 242, 251, 260, 269, 278, 287, 296, 305, 314, 323, 332, 341, 350, 359, 368, 377, 386, 395, 404, 413, 422, 431, 440, 449]
        },
        fireDamage: {
          min: [8, 11, 14, 17, 20, 23, 26, 29, 34, 39, 44, 49, 54, 59, 64, 69, 76, 83, 90, 97, 104, 111, 119, 127, 135, 143, 151, 159, 168, 177, 186, 195, 204, 213, 222, 231, 240, 249, 258, 267, 276, 285, 294, 303, 312, 321, 330, 339, 348, 357, 366, 375, 384, 393, 402, 411, 420, 429, 438, 447],
          max: [10, 13, 16, 19, 22, 25, 28, 31, 36, 41, 46, 51, 56, 61, 66, 71, 78, 85, 92, 99, 106, 113, 121, 129, 137, 145, 153, 161, 170, 179, 188, 197, 206, 215, 224, 233, 242, 251, 260, 269, 278, 287, 296, 305, 314, 323, 332, 341, 350, 359, 368, 377, 386, 395, 404, 413, 422, 431, 440, 449]
        },
        cooldown: 0.5,
        manaCost: 12,
        synergies: [
          { skillId: 'moltenbouldcontainer', bonusPerLevel: 10, damageType: 'both' },
          { skillId: 'fissurecontainer', bonusPerLevel: 10, damageType: 'both' },
          { skillId: 'armageddoncontainer', bonusPerLevel: 10, damageType: 'both' }
        ]
      },
      tornadocontainer: {
        name: "Tornado",
        type: "physical",
        physicalDamage: {
          min: [32, 38, 44, 50, 56, 62, 68, 74, 88, 102, 116, 130, 144, 158, 172, 186, 208, 230, 252, 274, 296, 318, 346, 374, 402, 430, 458, 486, 520, 554, 588, 622, 656, 690, 724, 758, 792, 826, 860, 894, 928, 962, 996, 1030, 1064, 1098, 1132, 1166, 1200, 1234, 1268, 1302, 1336, 1370, 1404, 1438, 1472, 1506, 1540, 1574],
          max: [35, 43, 51, 59, 67, 75, 83, 91, 107, 123, 139, 155, 171, 187, 203, 219, 243, 267, 291, 315, 339, 363, 393, 423, 453, 483, 513, 543, 579, 615, 651, 687, 723, 759, 795, 831, 867, 903, 939, 975, 1011, 1047, 1083, 1119, 1155, 1191, 1227, 1263, 1299, 1335, 1371, 1407, 1443, 1479, 1515, 1551, 1587, 1623, 1659, 1695]
        },
        manaCost: [2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8, 9, 9.1, 9.2, 9.3],
        synergies: [
          { skillId: 'arcticblastcontainer', bonusPerLevel: 16, damageType: 'physical' },
          { skillId: 'twistercontainer', bonusPerLevel: 16, damageType: 'physical' },
          { skillId: 'hurricanecontainer', bonusPerLevel: 16, damageType: 'physical' }
        ]
      },
      hurricanecontainer: {
        name: "Hurricane",
        type: "cold",
        coldDamage: {
          min: [25, 29, 33, 37, 41, 45, 49, 53, 61, 69, 77, 85, 93, 101, 109, 117, 129, 141, 153, 165, 177, 189, 205, 221, 237, 253, 269, 285, 305, 325, 345, 365, 385, 405, 425, 445, 465, 485, 505, 525, 545, 565, 585, 605, 625, 645, 665, 685, 705, 725, 745, 765, 785, 805, 825, 845, 865, 885, 905, 925],
          max: [50, 54, 58, 62, 66, 70, 74, 78, 86, 94, 102, 110, 118, 126, 134, 142, 154, 166, 178, 190, 202, 214, 230, 246, 262, 278, 294, 310, 330, 350, 370, 390, 410, 430, 450, 470, 490, 510, 530, 550, 570, 590, 610, 630, 650, 670, 690, 710, 730, 750, 770, 790, 810, 830, 850, 870, 890, 910, 930, 950]
        },
        duration: [60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147, 150, 153, 156, 159, 162, 165, 168, 171, 174, 177, 180, 183, 186, 189, 192, 195, 198, 201, 204, 207, 210, 213, 216, 219, 222, 225, 228, 231, 234, 237],
        radius: 6,
        coldLength: 8,
        manaCost: 30,
        synergies: [
          { skillId: 'arcticblastcontainer', bonusPerLevel: 12, damageType: 'cold' },
          { skillId: 'tornadocontainer', bonusPerLevel: 12, damageType: 'cold' }
        ]
      },
      armageddoncontainer: {
        name: "Armageddon",
        type: "fire",
        physicalDamage: {
          min: [15, 25, 35, 45, 55, 65, 75, 85, 98, 111, 124, 137, 150, 163, 176, 189, 206, 223, 240, 257, 274, 291, 312, 333, 354, 375, 396, 417, 442, 467, 492, 517, 542, 567, 592, 617, 642, 667, 692, 717, 742, 767, 792, 817, 842, 867, 892, 917, 942, 967, 992, 1017, 1042, 1067, 1092, 1117, 1142, 1167, 1192, 1217],
          max: [45, 56, 67, 78, 89, 100, 111, 122, 137, 152, 167, 182, 197, 212, 227, 242, 261, 280, 299, 318, 337, 356, 379, 402, 425, 448, 471, 494, 521, 548, 575, 602, 629, 656, 683, 710, 737, 764, 791, 818, 845, 872, 899, 926, 953, 980, 1007, 1034, 1061, 1088, 1115, 1142, 1169, 1196, 1223, 1250, 1277, 1304, 1331, 1358]
        },
        fireDamage: {
          min: [15, 25, 35, 45, 55, 65, 75, 85, 98, 111, 124, 137, 150, 163, 176, 189, 206, 223, 240, 257, 274, 291, 312, 333, 354, 375, 396, 417, 442, 467, 492, 517, 542, 567, 592, 617, 642, 667, 692, 717, 742, 767, 792, 817, 842, 867, 892, 917, 942, 967, 992, 1017, 1042, 1067, 1092, 1117, 1142, 1167, 1192, 1217],
          max: [45, 56, 67, 78, 89, 100, 111, 122, 137, 152, 167, 182, 197, 212, 227, 242, 261, 280, 299, 318, 337, 356, 379, 402, 425, 448, 471, 494, 521, 548, 575, 602, 629, 656, 683, 710, 737, 764, 791, 818, 845, 872, 899, 926, 953, 980, 1007, 1034, 1061, 1088, 1115, 1142, 1169, 1196, 1223, 1250, 1277, 1304, 1331, 1358]
        },
        burningDamage: {
          min: [11, 18, 25, 32, 39, 46, 53, 60, 69, 77, 85, 93, 101, 110, 118, 126, 135, 145, 154, 164, 173, 182, 193, 203, 214, 225, 235, 246, 257, 269, 281, 292, 304, 316, 328, 339, 351, 363, 375, 386, 398, 410, 421, 433, 445, 457, 468, 480, 492, 503, 515, 527, 539, 550, 562, 574, 585, 597, 609, 621],
          max: [16, 23, 30, 37, 44, 51, 58, 65, 73, 82, 90, 98, 106, 114, 123, 131, 140, 150, 159, 168, 178, 187, 198, 208, 219, 229, 240, 250, 262, 274, 285, 297, 309, 321, 332, 344, 356, 367, 379, 391, 403, 414, 426, 438, 450, 461, 473, 485, 496, 508, 520, 532, 543, 555, 567, 578, 590, 602, 614, 625]
        },
        duration: [60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147, 150, 153, 156, 159, 162, 165, 168, 171, 174, 177, 180, 183, 186, 189, 192, 195, 198, 201, 204, 207, 210, 213, 216, 219, 222, 225, 228, 231, 234, 237],
        radius: 6,
        manaCost: 35,
        synergies: [
          { skillId: 'moltenbouldcontainer', bonusPerLevel: 12, damageType: 'both' },
          { skillId: 'volcanocontainer', bonusPerLevel: 12, damageType: 'both' }
        ]
      },
      werewolfcontainer: {
        name: "Werewolf",
        type: "utility",
        magicDamageReduction: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21],
        physicalDamageReduction: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21],
        damageBonus: [20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256],
        attackSpeed: [20, 28, 35, 40, 45, 48, 51, 53, 56, 57, 59, 61, 62, 63, 64, 66, 66, 67, 68, 68, 69, 70, 70, 71, 71, 72, 73, 73, 73, 73, 74, 74, 75, 75, 75, 75, 75, 76, 76, 76, 76, 77, 77, 77, 77, 77, 77, 77, 78, 78, 78, 78, 78, 79, 79, 79, 79, 79, 79, 80],
        cooldown: 0.5,
        manaCost: 15,
        // TODO: Display Lycanthropy bonuses (Life% and Attack Rating) in tooltip when invested
        synergies: []
      },
      werebearcontainer: {
        name: "Werebear",
        type: "utility",
        damageBonus: [55, 75, 95, 115, 135, 155, 175, 195, 215, 235, 255, 275, 295, 315, 335, 355, 375, 395, 415, 435, 455, 475, 495, 515, 535, 555, 575, 595, 615, 635, 655, 675, 695, 715, 735, 755, 775, 795, 815, 835, 855, 875, 895, 915, 935, 955, 975, 995, 1015, 1035, 1055, 1075, 1095, 1115, 1135, 1155, 1175, 1195, 1215, 1235],
        defenseBonus: [75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615, 625, 635, 645, 655, 665],
        uninterruptedAttack: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
        lifeBonus: 10,
        meleeSplashBonus: 20,
        manaCost: 15,
        // TODO: Display Lycanthropy bonuses (Life% and Attack Rating) in tooltip when invested
        synergies: []
      },
      lycantropycontainer: {
        name: "Lycanthropy",
        type: "passive",
        lifeBonus: [5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85],
        attackRatingBonus: [50, 62, 74, 86, 98, 110, 122, 134, 146, 158, 170, 182, 194, 206, 218, 230, 242, 254, 266, 278, 290, 302, 314, 326, 338, 350, 362, 374, 386, 398, 410, 422, 434, 446, 458, 470, 482, 494, 506, 518, 530, 542, 554, 566, 578, 590, 602, 614, 626, 638, 650, 662, 674, 686, 698, 710, 722, 734, 746, 758]
      },
      feralragecontainer: {
        name: "Feral Rage",
        type: "physical",
        damage: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640],
        attackRating: [25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113, 121, 129, 137, 145, 153, 161, 169, 177, 185, 193, 201, 209, 217, 225, 233, 241, 249, 257, 265, 273, 281, 289, 297, 305, 313, 321, 329, 337, 345, 353, 361, 369, 377, 385, 393, 401, 409, 417, 425, 433, 441, 449, 457, 465, 473, 481, 489, 497],
        movementSpeedMin: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        movementSpeedMax: [35, 47, 56, 64, 70, 75, 79, 82, 86, 88, 91, 93, 95, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107, 108, 108, 109, 110, 110, 111, 111, 112, 112, 113, 113, 113, 114, 114, 115, 115, 115, 115, 116, 116, 116, 117, 117, 117, 118, 118, 118, 119, 119, 119, 120, 120, 120, 120, 120, 120, 120],
        lifeStealMin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lifeStealMax: [4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        duration: 30,
        manaCost: 3,
        synergies: [
          { skillId: 'furycontainer', bonusPerLevel: 6, damageType: 'physical' }
        ]
      },
      maulcontainer: {
        name: "Maul",
        type: "physical",
        // TODO: Implement Maul skill damage calculation and display logic
        manaCost: 3
      },
      hungercontainer: {
        name: "Hunger",
        type: "physical",
        duration: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
        movementSpeed: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
        openWoundsChance: [24, 28, 31, 34, 37, 38, 40, 41, 42, 43, 44, 45, 46, 46, 47, 47, 48, 48, 48, 49, 49, 49, 50, 50, 50, 50, 51, 51, 51, 51, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 54, 54, 54, 54, 54, 54, 55, 55, 55, 55, 55, 55, 56, 56, 56, 56, 56, 56, 56, 56],
        openWoundsDamage: [40, 50, 60, 70, 80, 90, 101, 110, 127, 143, 159, 175, 191, 207, 223, 240, 263, 288, 312, 337, 361, 385, 419, 454, 488, 522, 557, 590, 637, 683, 730, 777, 824, 871, 918, 965, 1012, 1059, 1106, 1153, 1200, 1247, 1294, 1341, 1388, 1435, 1482, 1529, 1576, 1623, 1670, 1717, 1763, 1810, 1857, 1904, 1951, 1998, 2045, 2092],
        lifeSteal: [3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8],
        manaCost: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
        synergies: [
          { skillId: 'maulcontainer', bonusPerLevel: 16, damageType: 'physical' }
        ]
      },
      raiseskeletonwarriorcontainer: {
        name: "Raise Skeleton Warrior",
        type: "summon",
        life: {
          normal: [21, 21, 21, 31, 42, 52, 63, 73, 84, 94, 105, 115, 126, 136, 147, 157, 168, 178, 189, 199, 210, 220, 231, 241, 252, 262, 273, 283, 294, 304, 315, 325, 336, 346, 357, 367, 378, 388, 399, 409, 420, 430, 441, 451, 462, 472, 483, 493, 504, 514, 525, 535, 546, 556, 567, 577, 588, 598, 609, 619],
          nightmare: [30, 30, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885],
          hell: [42, 42, 42, 63, 84, 105, 126, 147, 168, 189, 210, 231, 252, 273, 294, 315, 336, 357, 378, 399, 420, 441, 462, 483, 504, 525, 546, 567, 588, 609, 630, 651, 672, 693, 714, 735, 756, 777, 798, 819, 840, 861, 882, 903, 924, 945, 966, 987, 1008, 1029, 1050, 1071, 1092, 1113, 1134, 1155, 1176, 1197, 1218, 1239]
        },
        damage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 42, 46, 50, 54, 58, 62, 66, 71, 76, 81, 86, 91, 96, 101, 106, 111, 116, 121, 126, 131, 136, 141, 146, 151, 156, 161, 166, 171, 176, 181, 186, 191, 196, 201, 206, 211, 216, 221, 226],
          max: [2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 28, 31, 34, 37, 40, 43, 47, 51, 55, 59, 63, 67, 72, 77, 82, 87, 92, 97, 102, 107, 112, 117, 122, 127, 132, 137, 142, 147, 152, 157, 162, 167, 172, 177, 182, 187, 192, 197, 202, 207, 212, 217, 222, 227],
          damageBonus: [0, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570]
        },
        attackRating: [50, 60, 70, 80, 90, 100, 110, 120, 135, 150, 165, 180, 195, 210, 225, 240, 260, 280, 300, 320, 340, 360, 385, 410, 435, 460, 485, 510, 545, 580, 615, 650, 685, 720, 755, 790, 825, 860, 895, 930, 965, 1000, 1035, 1070, 1105, 1140, 1175, 1210, 1245, 1280, 1315, 1350, 1385, 1420, 1455, 1490, 1525, 1560, 1595, 1630],
        totalSummons: [1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        manaCost: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5],
        synergies: [
          { skillId: 'skeletonmasterycontainer', bonusPerLevel: 6, damageType: 'all' },
          { skillId: 'raiseskeletalmagecontainer', bonusPerLevel: 2, damageType: 'all' }
        ]
      },
      skeletonmasterycontainer: {
        name: "Skeleton Mastery",
        type: "passive",
        skeletonVelocity: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        skeletonLife: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900],
        physicalDamageBonus: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120],
        elementalDamageBonus: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120]
      },
      claygolemcontainer: {
        name: "Clay Golem",
        type: "summon",
        attackRating: [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260],
        life: {
          normal: [115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925, 940, 955, 970, 985, 1000],
          nightmare: [345, 390, 435, 480, 525, 570, 615, 660, 705, 750, 795, 840, 885, 930, 975, 1020, 1065, 1110, 1155, 1200, 1245, 1290, 1335, 1380, 1425, 1470, 1515, 1560, 1605, 1650, 1695, 1740, 1785, 1830, 1875, 1920, 1965, 2010, 2055, 2100, 2145, 2190, 2235, 2280, 2325, 2370, 2415, 2460, 2505, 2550, 2595, 2640, 2685, 2730, 2775, 2820, 2865, 2910, 2955, 3000],
          hell: [575, 650, 725, 800, 875, 950, 1025, 1100, 1175, 1250, 1325, 1400, 1475, 1550, 1625, 1700, 1775, 1850, 1925, 2000, 2075, 2150, 2225, 2300, 2375, 2450, 2525, 2600, 2675, 2750, 2825, 2900, 2975, 3050, 3125, 3200, 3275, 3350, 3425, 3500, 3575, 3650, 3725, 3800, 3875, 3950, 4025, 4100, 4175, 4250, 4325, 4400, 4475, 4550, 4625, 4700, 4775, 4850, 4925, 5000]
        },
        damage: {
          min: {
            normal: [11, 22, 33, 44, 55, 66, 77, 88, 99, 110, 121, 132, 143, 154, 165, 176, 187, 198, 209, 220, 231, 242, 253, 264, 275, 286, 297, 308, 319, 330, 341, 352, 363, 374, 385, 396, 407, 418, 429, 440, 451, 462, 473, 484, 495, 506, 517, 528, 539, 550, 561, 572, 583, 594, 605, 616, 627, 638, 649, 660],
            nightmare: [42, 84, 126, 168, 210, 252, 294, 336, 378, 420, 462, 504, 546, 588, 630, 672, 714, 756, 798, 840, 882, 924, 966, 1008, 1050, 1092, 1134, 1176, 1218, 1260, 1302, 1344, 1386, 1428, 1470, 1512, 1554, 1596, 1638, 1680, 1722, 1764, 1806, 1848, 1890, 1932, 1974, 2016, 2058, 2100, 2142, 2184, 2226, 2268, 2310, 2352, 2394, 2436, 2478, 2520],
            hell: [84, 168, 252, 336, 420, 504, 588, 672, 756, 840, 924, 1008, 1092, 1176, 1260, 1344, 1428, 1512, 1596, 1680, 1764, 1848, 1932, 2016, 2100, 2184, 2268, 2352, 2436, 2520, 2604, 2688, 2772, 2856, 2940, 3024, 3108, 3192, 3276, 3360, 3444, 3528, 3612, 3696, 3780, 3864, 3948, 4032, 4116, 4200, 4284, 4368, 4452, 4536, 4620, 4704, 4788, 4872, 4956, 5040]
          },
          max: {
            normal: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900],
            nightmare: [60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440, 1500, 1560, 1620, 1680, 1740, 1800, 1860, 1920, 1980, 2040, 2100, 2160, 2220, 2280, 2340, 2400, 2460, 2520, 2580, 2640, 2700, 2760, 2820, 2880, 2940, 3000, 3060, 3120, 3180, 3240, 3300, 3360, 3420, 3480, 3540, 3600],
            hell: [120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320, 1440, 1560, 1680, 1800, 1920, 2040, 2160, 2280, 2400, 2520, 2640, 2760, 2880, 3000, 3120, 3240, 3360, 3480, 3600, 3720, 3840, 3960, 4080, 4200, 4320, 4440, 4560, 4680, 4800, 4920, 5040, 5160, 5280, 5400, 5520, 5640, 5760, 5880, 6000, 6120, 6240, 6360, 6480, 6600, 6720, 6840, 6960, 7080, 7200]
          }
        },
        slowEnemies: [3, 6, 9, 11, 12, 13, 14, 15, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25],
        manaCost: [7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37],
        crushingBlow: 20, // 20% chance
        defense: 100,
        cooldown: 1,
        // NOTE: Damage synergies currently only apply to the level 1 damage
        // Fixed increase: +33.6 to +48 (Hell) per invested point of synergy
        // Synergies provide +40% damage per level, but calculated as fixed increase
        synergies: [
          { skillId: 'golemmasterycontainer', bonusPerLevel: 40, damageType: 'physical' },
          { skillId: 'bloodgolemcontainer', bonusPerLevel: 40, damageType: 'physical' },
          { skillId: 'irongolemcontainer', bonusPerLevel: 40, damageType: 'physical' },
          { skillId: 'irongolemcontainer', bonusPerLevel: 35, damageType: 'defense' },
          { skillId: 'firegolemcontainer', bonusPerLevel: 40, damageType: 'physical' }
        ]
      },
      raiseskeletalmagecontainer: {
        name: "Raise Skeletal Mage",
        type: "summon",
        // Base Life: 61 (Normal), 88 (Nightmare), 123 (Hell)
        // Life formula: {[(Skill Level - 3) * 0.07) + 1] * Base Life}
        baseLife: {
          normal: 61,
          nightmare: 88,
          hell: 123
        },
        poisonDamage: {
          min: [6, 9, 12, 15, 18, 21, 24, 27, 32, 37, 42, 47, 52, 57, 62, 67, 75, 83, 91, 99, 107, 115, 126, 137, 148, 159, 170, 181, 195, 209, 223, 237, 251, 265, 279, 293, 307, 321, 335, 349, 363, 377, 391, 405, 419, 433, 447, 461, 475, 489, 503, 517, 531, 545, 559, 573, 587, 601, 615, 629],
          max: [6, 9, 12, 15, 18, 21, 24, 27, 32, 37, 42, 47, 52, 57, 62, 67, 75, 83, 91, 99, 107, 115, 126, 137, 148, 159, 170, 181, 195, 209, 223, 237, 251, 265, 279, 293, 307, 321, 335, 349, 363, 377, 391, 405, 419, 433, 447, 461, 475, 489, 503, 517, 531, 545, 559, 573, 587, 601, 615, 629]
        },
        lightningDamage: {
          min: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
          max: [12, 19, 26, 33, 40, 47, 54, 61, 71, 81, 91, 101, 111, 121, 131, 141, 155, 169, 183, 197, 211, 225, 244, 263, 282, 301, 320, 339, 362, 385, 408, 431, 454, 477, 500, 523, 546, 569, 592, 615, 638, 661, 684, 707, 730, 753, 776, 799, 822, 845, 868, 891, 914, 937, 960, 983, 1006, 1029, 1052, 1075]
        },
        coldDamage: {
          min: [4, 7, 10, 13, 16, 19, 22, 25, 29, 33, 37, 41, 45, 49, 53, 57, 64, 71, 78, 85, 92, 99, 109, 119, 129, 139, 149, 159, 171, 183, 195, 207, 219, 231, 243, 255, 267, 279, 291, 303, 315, 327, 339, 351, 363, 375, 387, 399, 411, 423, 435, 447, 459, 471, 483, 495, 507, 519, 531, 543],
          max: [7, 10, 13, 16, 19, 22, 25, 28, 33, 38, 43, 48, 53, 58, 63, 68, 76, 84, 92, 100, 108, 116, 127, 138, 149, 160, 171, 182, 196, 210, 224, 238, 252, 266, 280, 294, 308, 322, 336, 350, 364, 378, 392, 406, 420, 434, 448, 462, 476, 490, 504, 518, 532, 546, 560, 574, 588, 602, 616, 630]
        },
        fireDamage: {
          min: [4, 8, 12, 16, 20, 24, 28, 32, 37, 42, 47, 52, 57, 62, 67, 72, 80, 88, 96, 104, 112, 120, 131, 142, 153, 164, 175, 186, 200, 214, 228, 242, 256, 270, 284, 298, 312, 326, 340, 354, 368, 382, 396, 410, 424, 438, 452, 466, 480, 494, 508, 522, 536, 550, 564, 578, 592, 606, 620, 634],
          max: [10, 14, 18, 22, 26, 30, 34, 38, 44, 50, 56, 62, 68, 74, 80, 86, 93, 100, 107, 114, 121, 128, 138, 148, 158, 168, 178, 188, 201, 214, 227, 240, 253, 266, 279, 292, 305, 318, 331, 344, 357, 370, 383, 396, 409, 422, 435, 448, 461, 474, 487, 500, 513, 526, 539, 552, 565, 578, 591, 604]
        },
        totalSummons: [1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        manaCost: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5],
        synergies: [
          { skillId: 'skeletonmasterycontainer', bonusPerLevel: 10, damageType: 'all' }
        ]
      },
      golemmasterycontainer: {
        name: "Golem Mastery",
        type: "passive",
        lifeBonus: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600],
        attackRating: [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500],
        movementSpeed: [6, 10, 14, 17, 20, 22, 23, 24, 26, 27, 28, 29, 30, 30, 31, 32, 32, 32, 33, 33, 34, 34, 34, 35, 35, 35, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        totalGolems: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
      },
      bloodgolemcontainer: {
        name: "Blood Golem",
        type: "summon",
        life: {
          normal: [231, 261, 291, 321, 351, 381, 412, 442, 472, 502, 532, 562, 592, 623, 653, 683, 713, 743, 773, 804, 834, 864, 894, 924, 954, 984, 1015, 1045, 1075, 1105, 1135, 1165, 1196, 1226, 1256, 1286, 1316, 1346, 1376, 1407, 1437, 1467, 1497, 1527, 1557, 1587, 1618, 1648, 1678, 1708, 1738, 1768, 1798, 1829, 1859, 1889, 1919, 1949, 1979, 2010],
          nightmare: [446, 504, 562, 620, 679, 737, 795, 853, 911, 970, 1028, 1086, 1144, 1202, 1261, 1319, 1377, 1435, 1493, 1552, 1610, 1668, 1726, 1784, 1843, 1901, 1959, 2017, 2075, 2134, 2192, 2250, 2308, 2366, 2425, 2483, 2541, 2599, 2657, 2716, 2774, 2832, 2890, 2948, 3007, 3065, 3123, 3181, 3239, 3298, 3356, 3414, 3472, 3530, 3589, 3647, 3705, 3763, 3821, 3880],
          hell: [732, 828, 923, 1019, 1114, 1210, 1305, 1401, 1496, 1592, 1687, 1783, 1878, 1974, 2069, 2165, 2260, 2356, 2452, 2548, 2643, 2739, 2834, 2930, 3025, 3121, 3216, 3312, 3407, 3503, 3598, 3694, 3789, 3885, 3980, 4076, 4171, 4267, 4363, 4459, 4554, 4650, 4745, 4841, 4936, 5032, 5127, 5223, 5318, 5414, 5509, 5605, 5700, 5796, 5891, 5987, 6082, 6178, 6274, 6370]
        },
        lifeOnHit: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67],
        damage: {
          min: {
            normal: [27, 47, 67, 87, 108, 128, 148, 168, 189, 209, 229, 249, 270, 290, 310, 330, 351, 371, 391, 411, 432, 452, 472, 492, 513, 533, 553, 573, 594, 614, 634, 654, 675, 695, 715, 735, 756, 776, 796, 816, 837, 857, 877, 897, 918, 938, 958, 978, 999, 1019, 1039, 1059, 1080, 1100, 1120, 1140, 1161, 1181, 1201, 1221],
            nightmare: [27, 47, 67, 87, 108, 128, 148, 168, 189, 209, 229, 249, 270, 290, 310, 330, 351, 371, 391, 411, 432, 452, 472, 492, 513, 533, 553, 573, 594, 614, 634, 654, 675, 695, 715, 735, 756, 776, 796, 816, 837, 857, 877, 897, 918, 938, 958, 978, 999, 1019, 1039, 1059, 1080, 1100, 1120, 1140, 1161, 1181, 1201, 1221],
            hell: [60, 105, 150, 195, 240, 285, 330, 375, 420, 465, 510, 555, 600, 645, 690, 735, 780, 825, 870, 915, 960, 1005, 1050, 1095, 1140, 1185, 1230, 1275, 1320, 1365, 1410, 1455, 1500, 1545, 1590, 1635, 1680, 1725, 1770, 1815, 1860, 1905, 1950, 1995, 2040, 2085, 2130, 2175, 2220, 2265, 2310, 2355, 2400, 2445, 2490, 2535, 2580, 2625, 2670, 2715]
          },
          max: {
            normal: [48, 84, 120, 156, 192, 228, 264, 300, 336, 372, 408, 444, 480, 516, 552, 588, 624, 660, 696, 732, 768, 804, 840, 876, 912, 948, 984, 1020, 1056, 1092, 1128, 1164, 1200, 1236, 1272, 1308, 1344, 1380, 1416, 1452, 1488, 1524, 1560, 1596, 1632, 1668, 1704, 1740, 1776, 1812, 1848, 1884, 1920, 1956, 1992, 2028, 2064, 2100, 2136, 2172],
            nightmare: [96, 168, 240, 312, 384, 456, 528, 600, 672, 744, 816, 888, 960, 1032, 1104, 1176, 1248, 1320, 1392, 1464, 1536, 1608, 1680, 1752, 1824, 1896, 1968, 2040, 2112, 2184, 2256, 2328, 2400, 2472, 2544, 2616, 2688, 2760, 2832, 2904, 2976, 3048, 3120, 3192, 3264, 3336, 3408, 3480, 3552, 3624, 3696, 3768, 3840, 3912, 3984, 4056, 4128, 4200, 4272, 4344],
            hell: [188, 329, 470, 611, 752, 893, 1034, 1175, 1316, 1457, 1598, 1739, 1880, 2021, 2162, 2303, 2444, 2585, 2726, 2867, 3008, 3149, 3290, 3431, 3572, 3713, 3854, 3995, 4136, 4277, 4418, 4559, 4700, 4841, 4982, 5123, 5264, 5405, 5546, 5687, 5828, 5969, 6110, 6251, 6392, 6533, 6674, 6815, 6956, 7097, 7238, 7379, 7520, 7661, 7802, 7943, 8084, 8225, 8366, 8507]
          }
        },
        attackRating: 60,
        defense: 120,
        cooldown: 1,
        manaCost: [12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42],
        // NOTE: Damage synergies currently only apply to the level 1 damage
        // Fixed increase: +5.4 to +9.6 (Normal), +5.4 to +19.2 (Nightmare), or +12 to +37.6 (Hell) per level
        // Synergies provide +12% damage per level, but calculated as fixed increase
        synergies: [
          { skillId: 'golemmasterycontainer', bonusPerLevel: 12, damageType: 'physical' },
          { skillId: 'claygolemcontainer', bonusPerLevel: 12, damageType: 'physical' },
          { skillId: 'claygolemcontainer', bonusPerLevel: 20, damageType: 'attackRating' },
          { skillId: 'irongolemcontainer', bonusPerLevel: 12, damageType: 'physical' },
          { skillId: 'irongolemcontainer', bonusPerLevel: 35, damageType: 'defense' },
          { skillId: 'firegolemcontainer', bonusPerLevel: 12, damageType: 'physical' }
        ]
      },
      bloodwarpcontainer: {
        name: "Blood Warp",
        type: "utility",
        cooldown: [5.8, 5.6, 5.4, 5.2, 5, 4.8, 4.6, 4.4, 4.2, 4, 3.8, 3.6, 3.4, 3.2, 3, 2.8, 2.6, 2.4, 2.2, 2, 1.8, 1.6, 1.4, 1.2, 1, 0.8, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        minimumLifeCost: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        lifeCostPercent: 12, // 12% of current life (bounded by Minimum Life Cost)
        manaCost: 10
      },
      irongolemcontainer: {
        name: "Iron Golem",
        type: "summon",
        defense: [210, 245, 280, 315, 350, 385, 420, 455, 490, 525, 560, 595, 630, 665, 700, 735, 770, 805, 840, 875, 910, 945, 980, 1015, 1050, 1085, 1120, 1155, 1190, 1225, 1260, 1295, 1330, 1365, 1400, 1435, 1470, 1505, 1540, 1575, 1610, 1645, 1680, 1715, 1750, 1785, 1820, 1855, 1890, 1925, 1960, 1995, 2030, 2065, 2100, 2135, 2170, 2205, 2240, 2275],
        life: {
          normal: [321, 336, 351, 367, 382, 397, 413, 428, 443, 459, 474, 489, 504, 520, 535, 550, 566, 581, 596, 612, 627, 642, 657, 673, 688, 703, 719, 734, 749, 765, 780, 795, 811, 826, 841, 856, 872, 887, 902, 918, 933, 948, 964, 979, 994, 1010, 1025, 1040, 1055, 1071, 1086, 1101, 1117, 1132, 1147, 1163, 1178, 1193, 1209, 1224],
          nightmare: [624, 654, 684, 714, 743, 773, 803, 833, 862, 892, 922, 952, 981, 1011, 1041, 1071, 1100, 1130, 1160, 1190, 1219, 1249, 1279, 1309, 1338, 1368, 1398, 1428, 1457, 1487, 1517, 1547, 1576, 1606, 1636, 1666, 1695, 1725, 1755, 1785, 1814, 1844, 1874, 1904, 1933, 1963, 1993, 2023, 2052, 2082, 2112, 2142, 2171, 2201, 2231, 2261, 2290, 2320, 2350, 2380],
          hell: [1029, 1078, 1127, 1176, 1225, 1274, 1323, 1372, 1421, 1470, 1519, 1568, 1617, 1666, 1715, 1764, 1813, 1862, 1911, 1960, 2009, 2058, 2107, 2156, 2205, 2254, 2303, 2352, 2401, 2450, 2499, 2548, 2597, 2646, 2695, 2744, 2793, 2842, 2891, 2940, 2989, 3038, 3087, 3136, 3185, 3234, 3283, 3332, 3381, 3430, 3479, 3528, 3577, 3626, 3675, 3724, 3773, 3822, 3871, 3920]
        },
        damageReturned: [150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945, 960, 975, 990, 1005, 1020, 1035],
        damage: {
          min: {
            normal: 7,
            nightmare: 11,
            hell: 12
          },
          max: {
            normal: 19,
            nightmare: 30,
            hell: 33
          }
        },
        attackRating: 80,
        manaCost: 35,
        cooldown: 1,
        synergies: [
          { skillId: 'golemmasterycontainer', bonusPerLevel: 20, damageType: 'physical' },
          { skillId: 'claygolemcontainer', bonusPerLevel: 20, damageType: 'physical' },
          { skillId: 'claygolemcontainer', bonusPerLevel: 20, damageType: 'attackRating' },
          { skillId: 'bloodgolemcontainer', bonusPerLevel: 20, damageType: 'physical' },
          { skillId: 'firegolemcontainer', bonusPerLevel: 20, damageType: 'physical' }
        ]
      },
      raiseskeletonarchercontainer: {
        name: "Raise Skeleton Archer",
        type: "summon",
        baseLife: 40,
        damage: {
          min: [15, 19, 23, 27, 31, 35, 39, 43, 51, 59, 67, 75, 83, 91, 99, 107, 125, 143, 161, 179, 197, 215, 243, 271, 299, 327, 355, 383, 421, 459, 497, 535, 573, 611, 649, 687, 725, 763, 801, 839, 877, 915, 953, 991, 1029, 1067, 1105, 1143, 1181, 1219, 1257, 1295, 1333, 1371, 1409, 1447, 1485, 1523, 1561, 1599],
          max: [20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 88, 96, 104, 112, 130, 148, 166, 184, 202, 220, 248, 276, 304, 332, 360, 388, 426, 464, 502, 540, 578, 616, 654, 692, 730, 768, 806, 844, 882, 920, 958, 996, 1034, 1072, 1110, 1148, 1186, 1224, 1262, 1300, 1338, 1376, 1414, 1452, 1490, 1528, 1566, 1604]
        },
        attackRating: [95, 185, 275, 365, 455, 545, 635, 725, 815, 905, 995, 1085, 1175, 1265, 1355, 1445, 1535, 1625, 1715, 1805, 1895, 1985, 2075, 2165, 2255, 2345, 2435, 2525, 2615, 2705, 2795, 2885, 2975, 3065, 3155, 3245, 3335, 3425, 3515, 3605, 3695, 3785, 3875, 3965, 4055, 4145, 4235, 4325, 4415, 4505, 4595, 4685, 4775, 4865, 4955, 5045, 5135, 5225, 5315, 5405],
        defense: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620],
        totalSummons: [1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        manaCost: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5],
        synergies: [
          { skillId: 'skeletonmasterycontainer', bonusPerLevel: 6, damageType: 'physical' },
          { skillId: 'raiseskeletonwarriorcontainer', bonusPerLevel: 2, damageType: 'physical' }
        ]
      },
      firegolemcontainer: {
        name: "Fire Golem",
        type: "summon",
        life: {
          normal: [180, 204, 227, 251, 274, 298, 321, 345, 368, 392, 415, 439, 462, 486, 509, 533, 556, 580, 603, 627, 650, 674, 697, 721, 744, 768, 791, 815, 838, 862, 885, 909, 932, 956, 979, 1003, 1026, 1050, 1073, 1097, 1120, 1144, 1167, 1191, 1214, 1238, 1261, 1285, 1308, 1332, 1355, 1379, 1402, 1426, 1449, 1473, 1496, 1520, 1543, 1567],
          nightmare: [295, 334, 372, 411, 449, 488, 526, 565, 603, 642, 681, 719, 758, 796, 835, 873, 912, 950, 989, 1027, 1066, 1105, 1143, 1182, 1220, 1259, 1297, 1336, 1374, 1413, 1452, 1490, 1529, 1567, 1606, 1644, 1683, 1721, 1760, 1798, 1837, 1875, 1914, 1953, 1991, 2030, 2068, 2107, 2145, 2184, 2222, 2261, 2299, 2338, 2377, 2415, 2454, 2492, 2531, 2569],
          hell: [468, 529, 590, 651, 712, 773, 834, 895, 956, 1017, 1078, 1139, 1200, 1261, 1322, 1383, 1444, 1505, 1566, 1628, 1689, 1750, 1811, 1872, 1933, 1994, 2055, 2116, 2177, 2238, 2299, 2360, 2421, 2482, 2543, 2604, 2665, 2726, 2787, 2849, 2910, 2971, 3032, 3093, 3154, 3215, 3276, 3337, 3398, 3459, 3520, 3581, 3642, 3703, 3764, 3825, 3886, 3947, 4008, 4070]
        },
        fireDamage: {
          min: [7, 9, 11, 13, 15, 17, 19, 21, 24, 27, 30, 33, 36, 39, 42, 45, 49, 53, 57, 61, 65, 69, 74, 79, 84, 89, 94, 99, 105, 111, 117, 123, 129, 135, 141, 147, 153, 159, 165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231, 237, 243, 249, 255, 261, 267, 273, 279, 285, 291],
          max: [9, 12, 15, 18, 21, 24, 27, 30, 34, 38, 42, 46, 50, 54, 58, 62, 67, 72, 77, 82, 87, 92, 98, 104, 110, 116, 122, 128, 135, 142, 149, 156, 163, 170, 177, 184, 191, 198, 205, 212, 219, 226, 233, 240, 247, 254, 261, 268, 275, 282, 289, 296, 303, 310, 317, 324, 331, 338, 345, 352]
        },
        holyFireDamage: {
          min: [9, 12, 15, 18, 21, 24, 27, 30, 34, 38, 42, 46, 50, 54, 58, 62, 68, 74, 80, 86, 92, 98, 105, 112, 119, 126, 133, 140, 148, 156, 164, 172, 180, 188, 196, 204, 212, 220, 228, 236, 244, 252, 260, 268, 276, 284, 292, 300, 308, 316, 324, 332, 340, 348, 356, 364, 372, 380, 388, 396],
          max: [13, 17, 21, 25, 29, 33, 37, 41, 47, 53, 59, 65, 71, 77, 83, 89, 97, 105, 113, 121, 129, 137, 147, 157, 167, 177, 187, 197, 208, 219, 230, 241, 252, 263, 274, 285, 296, 307, 318, 329, 340, 351, 362, 373, 384, 395, 406, 417, 428, 439, 450, 461, 472, 483, 494, 505, 516, 527, 538, 549]
        },
        attackRating: 80,
        defense: 210,
        cooldown: 1,
        manaCost: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5],
        synergies: [
          { skillId: 'golemmasterycontainer', bonusPerLevel: 5, damageType: 'fire' },
          { skillId: 'claygolemcontainer', bonusPerLevel: 5, damageType: 'fire' },
          { skillId: 'claygolemcontainer', bonusPerLevel: 20, damageType: 'attackRating' },
          { skillId: 'bloodgolemcontainer', bonusPerLevel: 5, damageType: 'fire' },
          { skillId: 'irongolemcontainer', bonusPerLevel: 5, damageType: 'fire' },
          { skillId: 'irongolemcontainer', bonusPerLevel: 35, damageType: 'defense' }
        ]
      },
      revivecontainer: {
        name: "Revive",
        type: "summon",
        elementalDamageBonus: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200],
        physicalDamageBonus: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320, 1350, 1380, 1410, 1440, 1470, 1500, 1530, 1560, 1590, 1620, 1650, 1680, 1710, 1740, 1770, 1800],
        duration: [300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890],
        monsterSkillLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        totalMonsters: [3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        manaCost: 45,
        synergies: [
          { skillId: 'desecratecontainer', bonusPerLevel: 20, damageType: 'physical' },
          { skillId: 'desecratecontainer', bonusPerLevel: 10, damageType: 'elemental' }
        ]
      },
      teethcontainer: {
        name: "Teeth",
        type: "magic",
        teeth: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
        magicDamage: {
          min: [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 30, 34, 38, 42, 46, 50, 57.5, 65, 72.5, 80, 87.5, 95, 106, 117, 128, 139, 150, 161, 172, 183, 194, 205, 216, 227, 238, 249, 260, 271, 282, 293, 304, 315, 326, 337, 348, 359, 370, 381, 392, 403, 414, 425, 436, 447],
          max: [5, 7, 9, 11, 13, 15, 17, 19, 22, 25, 28, 31, 34, 37, 40, 43, 48, 53, 58, 63, 68, 73, 81.5, 90, 98.5, 107, 115.5, 124, 136.5, 149, 161.5, 174, 186.5, 199, 211.5, 224, 236.5, 249, 261.5, 274, 286.5, 299, 311.5, 324, 336.5, 349, 361.5, 374, 386.5, 399, 411.5, 424, 436.5, 449, 461.5, 474, 486.5, 499, 511.5, 524]
        },
        manaCost: [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5],
        synergies: [
          { skillId: 'bonearmorcontainer', bonusPerLevel: 24, damageType: 'magic' },
          { skillId: 'bonespearcontainer', bonusPerLevel: 24, damageType: 'magic' },
          { skillId: 'bonespiritcontainer', bonusPerLevel: 24, damageType: 'magic' }
        ]
      },
      poisonstrikecontainer: {
        name: "Poison Strike",
        type: "poison",
        enemyPoisonResist: [-5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50],
        poisonDamage: {
          min: [3, 6, 9, 12, 15, 18, 21, 25, 37, 50, 62, 75, 87, 100, 112, 125, 162, 200, 237, 275, 312, 350, 412, 475, 537, 600, 662, 725, 812, 900, 987, 1075, 1162, 1250, 1337, 1425, 1512, 1600, 1687, 1775, 1862, 1950, 2037, 2125, 2212, 2300, 2387, 2475, 2562, 2650, 2737, 2825, 2912, 3000, 3087, 3175, 3262, 3350, 3437, 3525],
          max: [6, 9, 12, 15, 18, 21, 25, 28, 40, 53, 65, 78, 90, 103, 115, 128, 165, 203, 240, 278, 315, 353, 415, 478, 540, 603, 665, 728, 815, 903, 990, 1078, 1165, 1253, 1340, 1428, 1515, 1603, 1690, 1778, 1865, 1953, 2040, 2128, 2215, 2303, 2390, 2478, 2565, 2653, 2740, 2828, 2915, 3003, 3090, 3178, 3265, 3353, 3440, 3528]
        },
        attackRating: [50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380, 410, 440, 470, 500, 530, 560, 590, 620, 650, 680, 710, 740, 770, 800, 830, 860, 890, 920, 950, 980, 1010, 1040, 1070, 1100, 1130, 1160, 1190, 1220, 1250, 1280, 1310, 1340, 1370, 1400, 1430, 1460, 1490, 1520, 1550, 1580, 1610, 1640, 1670, 1700, 1730, 1760, 1790, 1820],
        poisonDuration: 2,
        manaCost: [1.5, 1.6, 1.7, 1.8, 2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8],
        synergies: [
          { skillId: 'desecratecontainer', bonusPerLevel: 25, damageType: 'poison' },
          { skillId: 'bonearmorcontainer', bonusPerLevel: 25, damageType: 'poison' }
        ]
      },
      bonearmorcontainer: {
        name: "Bone Armor",
        type: "buff",
        physicalDamageAbsorbed: [0, 10, 20, 30, 40, 50, 60, 70, 81, 92, 103, 114, 125, 136, 147, 158, 170, 182, 194, 206, 218, 230, 243, 256, 269, 282, 295, 308, 322, 336, 350, 364, 378, 392, 406, 420, 434, 448, 462, 476, 490, 504, 518, 532, 546, 560, 574, 588, 602, 616, 630, 644, 658, 672, 686, 700, 714, 728, 742, 756],
        defenseBonus: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
        manaCost: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
        cooldown: 2,
        // TODO: Implement Energy-based synergy - Gains +3 Additional Absorb per Energy point
        synergies: [
          { skillId: 'bonewallcontainer', bonusPerLevel: 15, damageType: 'absorption' },
          { skillId: 'boneprisoncontainer', bonusPerLevel: 15, damageType: 'absorption' }
        ]
      },
      corpseexplosioncontainer: {
        name: "Corpse Explosion",
        // NOTE: This skill deals both Physical and Fire damage (similar to Death Sentry)
        // Currently marked as "fire" type for general categorization
        // TODO: Future implementation should handle dual damage types (physical + fire)
        type: "fire",
        physicalDamage: {
          min: [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 21, 24, 27, 30, 33, 39, 45, 51, 57, 63, 69, 81, 93, 105, 117, 129, 141, 156, 171, 186, 201, 216, 231, 246, 261, 276, 291, 306, 321, 336, 351, 366, 381, 396, 411, 426, 441, 456, 471, 486, 501, 516, 531, 546, 561, 576, 591, 606, 621],
          max: [5, 7, 9, 11, 13, 15, 17, 19, 24, 29, 34, 39, 44, 49, 54, 59, 69, 79, 89, 99, 109, 119, 133, 147, 161, 175, 189, 203, 221, 239, 257, 275, 293, 311, 329, 347, 365, 383, 401, 419, 437, 455, 473, 491, 509, 527, 545, 563, 581, 599, 617, 635, 653, 671, 689, 707, 725, 743, 761, 779]
        },
        fireDamage: {
          min: [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 21, 24, 27, 30, 33, 39, 45, 51, 57, 63, 69, 81, 93, 105, 117, 129, 141, 156, 171, 186, 201, 216, 231, 246, 261, 276, 291, 306, 321, 336, 351, 366, 381, 396, 411, 426, 441, 456, 471, 486, 501, 516, 531, 546, 561, 576, 591, 606, 621],
          max: [5, 7, 9, 11, 13, 15, 17, 19, 24, 29, 34, 39, 44, 49, 54, 59, 69, 79, 89, 99, 109, 119, 133, 147, 161, 175, 189, 203, 221, 239, 257, 275, 293, 311, 329, 347, 365, 383, 401, 419, 437, 455, 473, 491, 509, 527, 545, 563, 581, 599, 617, 635, 653, 671, 689, 707, 725, 743, 761, 779]
        },
        radius: [5, 5, 5.6, 5.6, 6.3, 6.3, 7, 7, 7.6, 7.6, 8.3, 8.3, 9, 9, 9.6, 9.6, 10.3, 10.3, 11, 11, 11.6, 11.6, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        manaCost: [5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20],
        corpseLifePercent: { min: 5, max: 10 }, // Additional damage: 5-10% of corpse life
        synergies: [
          { skillId: 'amplifydamagecontainer', bonusPerLevel: 10, damageType: 'both' },
          { skillId: 'desecratecontainer', bonusPerLevel: 10, damageType: 'both' },
          { skillId: 'revivecontainer', bonusPerLevel: 10, damageType: 'both' }
        ]
      },
      bonewallcontainer: {
        name: "Bone Wall",
        // NOTE: This is a summon skill but marked as "magic" for general categorization
        // Unlike typical summons, it only has life and damage return (no offensive damage)
        type: "summon",
        life: {
          normal: [147, 183, 220, 257, 294, 330, 367, 404, 441, 477, 514, 551, 588, 624, 661, 698, 735, 771, 808, 845, 882, 918, 955, 992, 1029, 1065, 1102, 1139, 1176, 1212, 1249, 1286, 1323, 1359, 1396, 1433, 1470, 1506, 1543, 1580, 1617, 1653, 1690, 1727, 1764, 1800, 1837, 1874, 1911, 1947, 1984, 2021, 2058, 2094, 2131, 2168, 2205, 2241, 2278, 2315],
          nightmare: [147, 183, 220, 257, 294, 330, 367, 404, 441, 477, 514, 551, 588, 624, 661, 698, 735, 771, 808, 845, 882, 918, 955, 992, 1029, 1065, 1102, 1139, 1176, 1212, 1249, 1286, 1323, 1359, 1396, 1433, 1470, 1506, 1543, 1580, 1617, 1653, 1690, 1727, 1764, 1800, 1837, 1874, 1911, 1947, 1984, 2021, 2058, 2094, 2131, 2168, 2205, 2241, 2278, 2315],
          hell: [431, 538, 646, 754, 862, 970, 1077, 1185, 1293, 1401, 1509, 1616, 1724, 1831, 1939, 2047, 2154, 2262, 2370, 2478, 2586, 2693, 2801, 2909, 3017, 3124, 3232, 3340, 3448, 3555, 3663, 3771, 3879, 3986, 4094, 4202, 4310, 4417, 4525, 4633, 4741, 4848, 4956, 5064, 5172, 5279, 5387, 5495, 5603, 5710, 5818, 5926, 6034, 6141, 6249, 6357, 6465, 6572, 6680, 6788]
        },
        damageReturned: [15, 23, 31, 39, 47, 55, 63, 71, 87, 103, 119, 135, 151, 167, 183, 199, 231, 263, 295, 327, 359, 391, 439, 487, 535, 583, 631, 679, 743, 807, 871, 935, 999, 1063, 1127, 1191, 1255, 1319, 1383, 1447, 1511, 1575, 1639, 1703, 1767, 1831, 1895, 1959, 2023, 2087, 2151, 2215, 2279, 2343, 2407, 2471, 2535, 2599, 2663, 2727],
        duration: 24,
        manaCost: 17,
        cooldown: 1,
        synergies: [
          { skillId: 'bonearmorcontainer', bonusPerLevel: 5, damageType: 'life' },
          { skillId: 'boneprisoncontainer', bonusPerLevel: 5, damageType: 'life' }
        ]
      },
      desecratecontainer: {
        name: "Desecrate",
        type: "poison",
        poisonDamage: {
          min: [14, 18, 23, 28, 32, 37, 42, 46, 65, 84, 103, 121, 140, 159, 178, 196, 262, 328, 393, 459, 525, 590, 679, 768, 857, 946, 1035, 1125, 1237, 1350, 1462, 1575, 1687, 1800, 1912, 2025, 2137, 2250, 2362, 2475, 2587, 2700, 2812, 2925, 3037, 3150, 3262, 3375, 3487, 3600, 3712, 3825, 3937, 4050, 4162, 4275, 4387, 4500, 4612, 4725],
          max: [18, 23, 28, 32, 37, 42, 46, 51, 70, 89, 107, 126, 145, 164, 182, 201, 267, 332, 398, 464, 529, 595, 684, 773, 862, 951, 1040, 1129, 1242, 1354, 1467, 1579, 1692, 1804, 1917, 2029, 2142, 2254, 2367, 2479, 2592, 2704, 2817, 2929, 3042, 3154, 3267, 3379, 3492, 3604, 3717, 3829, 3942, 4054, 4167, 4279, 4392, 4504, 4617, 4729]
        },
        poisonDuration: 3,
        manaCost: [12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5],
        synergies: [
          { skillId: 'poisondaggercontainer', bonusPerLevel: 20, damageType: 'poison' },
          { skillId: 'poisonnovacontainer', bonusPerLevel: 20, damageType: 'poison' }
        ]
      },
      bonespearcontainer: {
        name: "Bone Spear",
        type: "magic",
        boneSpears: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        magicDamage: {
          min: [12, 19, 26, 33, 40, 47, 54, 61, 70, 79, 88, 97, 106, 115, 124, 133, 145, 157, 169, 181, 193, 205, 231, 257, 283, 309, 335, 361, 407, 453, 499, 545, 591, 637, 683, 729, 775, 821, 867, 913, 959, 1005, 1051, 1097, 1143, 1189, 1235, 1281, 1327, 1373, 1419, 1465, 1511, 1557, 1603, 1649, 1695, 1741, 1787, 1833],
          max: [18, 25, 32, 39, 46, 53, 60, 67, 76, 85, 94, 103, 112, 121, 130, 139, 152, 165, 178, 191, 204, 217, 245, 273, 301, 329, 357, 385, 435, 485, 535, 585, 635, 685, 735, 785, 835, 885, 935, 985, 1035, 1085, 1135, 1185, 1235, 1285, 1335, 1385, 1435, 1485, 1535, 1585, 1635, 1685, 1735, 1785, 1835, 1885, 1935, 1985]
        },
        manaCost: [7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7, 21, 21.2, 21.5, 21.7],
        synergies: [
          { skillId: 'teethcontainer', bonusPerLevel: 15, damageType: 'magic' },
          { skillId: 'bonespiritcontainer', bonusPerLevel: 15, damageType: 'magic' },
          { skillId: 'bonearmorcontainer', bonusPerLevel: 15, damageType: 'magic' }
        ]
      },
      boneprisoncontainer: {
        name: "Bone Prison",
        // NOTE: This is a summon skill (similar to Bone Wall)
        // It only has life and damage return (no offensive damage)
        type: "summon",
        life: {
          normal: [147, 183, 220, 257, 294, 330, 367, 404, 441, 477, 514, 551, 588, 624, 661, 698, 735, 771, 808, 845, 882, 918, 955, 992, 1029, 1065, 1102, 1139, 1176, 1212, 1249, 1286, 1323, 1359, 1396, 1433, 1470, 1506, 1543, 1580, 1617, 1653, 1690, 1727, 1764, 1800, 1837, 1874, 1911, 1947, 1984, 2021, 2058, 2094, 2131, 2168, 2205, 2241, 2278, 2315],
          nightmare: [147, 183, 220, 257, 294, 330, 367, 404, 441, 477, 514, 551, 588, 624, 661, 698, 735, 771, 808, 845, 882, 918, 955, 992, 1029, 1065, 1102, 1139, 1176, 1212, 1249, 1286, 1323, 1359, 1396, 1433, 1470, 1506, 1543, 1580, 1617, 1653, 1690, 1727, 1764, 1800, 1837, 1874, 1911, 1947, 1984, 2021, 2058, 2094, 2131, 2168, 2205, 2241, 2278, 2315],
          hell: [431, 538, 646, 754, 862, 970, 1077, 1185, 1293, 1401, 1509, 1616, 1724, 1831, 1939, 2047, 2154, 2262, 2370, 2478, 2586, 2693, 2801, 2909, 3017, 3124, 3232, 3340, 3448, 3555, 3663, 3771, 3879, 3986, 4094, 4202, 4310, 4417, 4525, 4633, 4741, 4848, 4956, 5064, 5172, 5279, 5387, 5495, 5603, 5710, 5818, 5926, 6034, 6141, 6249, 6357, 6465, 6572, 6680, 6788]
        },
        damageReturned: [30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 220, 240, 260, 300, 340, 380, 420, 460, 500, 560, 620, 680, 740, 800, 860, 940, 1020, 1100, 1180, 1260, 1340, 1420, 1500, 1580, 1660, 1740, 1820, 1900, 1980, 2060, 2140, 2220, 2300, 2380, 2460, 2540, 2620, 2700, 2780, 2860, 2940, 3020, 3100, 3180, 3260, 3340, 3420],
        duration: 24,
        manaCost: [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        cooldown: 5,
        synergies: [
          { skillId: 'bonearmorcontainer', bonusPerLevel: 5, damageType: 'life' },
          { skillId: 'bonewallcontainer', bonusPerLevel: 5, damageType: 'life' }
        ]
      },
      poisonnovacontainer: {
        name: "Poison Nova",
        type: "poison",
        poisonDamage: {
          min: [50, 68, 87, 106, 125, 143, 162, 181, 203, 225, 246, 268, 290, 312, 334, 356, 381, 406, 431, 456, 481, 506, 534, 562, 590, 618, 646, 675, 706, 737, 768, 800, 831, 862, 893, 925, 956, 987, 1018, 1050, 1081, 1112, 1143, 1175, 1206, 1237, 1268, 1300, 1331, 1362, 1393, 1425, 1456, 1487, 1518, 1550, 1581, 1612, 1643, 1675],
          max: [90, 109, 128, 146, 165, 184, 203, 221, 243, 265, 287, 309, 331, 353, 375, 396, 421, 446, 471, 496, 521, 546, 575, 603, 631, 659, 687, 715, 746, 778, 809, 840, 871, 903, 934, 965, 996, 1028, 1059, 1090, 1121, 1153, 1184, 1215, 1246, 1278, 1309, 1340, 1371, 1403, 1434, 1465, 1496, 1528, 1559, 1590, 1621, 1653, 1684, 1715]
        },
        poisonDuration: 2,
        manaCost: 20,
        synergies: [
          { skillId: 'poisonstrikecontainer', bonusPerLevel: 10, damageType: 'poison' },
          { skillId: 'desecratecontainer', bonusPerLevel: 10, damageType: 'poison' }
        ]
      },
      bonespiritcontainer: {
        name: "Bone Spirit",
        type: "magic",
        magicDamage: {
          min: [20, 36, 52, 68, 84, 100, 116, 132, 149, 166, 183, 200, 217, 234, 251, 268, 286, 304, 322, 340, 358, 376, 406, 436, 466, 496, 526, 556, 616, 676, 736, 796, 856, 916, 976, 1036, 1096, 1156, 1216, 1276, 1336, 1396, 1456, 1516, 1576, 1636, 1696, 1756, 1816, 1876, 1936, 1996, 2056, 2116, 2176, 2236, 2296, 2356, 2416, 2476],
          max: [30, 47, 64, 81, 98, 115, 132, 149, 167, 185, 203, 221, 239, 257, 275, 293, 312, 331, 350, 369, 388, 407, 438, 469, 500, 531, 562, 593, 655, 717, 779, 841, 903, 965, 1027, 1089, 1151, 1213, 1275, 1337, 1399, 1461, 1523, 1585, 1647, 1709, 1771, 1833, 1895, 1957, 2019, 2081, 2143, 2205, 2267, 2329, 2391, 2453, 2515, 2577]
        },
        manaCost: [12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5],
        synergies: [
          { skillId: 'teethcontainer', bonusPerLevel: 15, damageType: 'magic' },
          { skillId: 'bonespearcontainer', bonusPerLevel: 15, damageType: 'magic' },
          { skillId: 'bonearmorcontainer', bonusPerLevel: 15, damageType: 'magic' }
        ]
      },
      amplifydamagecontainer: {
        name: "Amplify Damage",
        type: "curse",
        enemyPhysicalResist: [-11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
        duration: [4, 4.2, 4.4, 4.6, 4.8, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8],
        manaCost: [2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7],
        radius: [6, 6, 6, 6.6, 6.6, 6.6, 7.3, 7.3, 7.3, 8, 8, 8, 8.6, 8.6, 8.6, 9.3, 9.3, 9.3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        // Curse Mastery bonuses:
        // - Reduces enemy physical resistance by additional 1% per 2 hard points
        // - Increases radius by 0.6 per 3 hard points
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.5, damageType: 'physicalResist' }, // 1% per 2 levels
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.2, damageType: 'radius' } // 0.6 per 3 levels
        ]
      },
      cursemasterycontainer: {
        name: "Curse Mastery",
        type: "passive",
        // Maximum number of curses that can be active on targets
        maxCurses: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
        // This passive skill enhances other curse skills
        // Bonuses are applied through synergies in individual curse skills
      },
      dimvisioncontainer: {
        name: "Dim Vision",
        type: "curse",
        enemyAttackRating: [-50, -65, -80, -95, -110, -125, -140, -155, -170, -185, -200, -215, -230, -245, -260, -275, -290, -305, -320, -335, -350, -365, -380, -395, -410, -425, -440, -455, -470, -485, -500, -515, -530, -545, -560, -575, -590, -605, -620, -635, -650, -665, -680, -695, -710, -725, -740, -755, -770, -785, -800, -815, -830, -845, -860, -875, -890, -905, -920, -935],
        duration: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65],
        // NOTE: Duration is 1/2 in Nightmare, and 1/4 in Hell
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        // Curse Mastery bonus: +10 Reduced Attack Rating per Level
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 10, damageType: 'attackRating' }
        ]
      },
      darkpactcontainer: {
        name: "Dark Pact",
        type: "magic",
        magicDamage: {
          min: [3, 5, 7, 9, 11, 13, 15, 17, 20, 23, 26, 29, 32, 35, 38, 41, 45, 49, 53, 57, 61, 65, 71, 77, 83, 89, 95, 101, 109, 117, 125, 133, 141, 149, 157, 165, 173, 181, 189, 197, 205, 213, 221, 229, 237, 245, 253, 261, 269, 277, 285, 293, 301, 309, 317, 325, 333, 341, 349, 357],
          max: [4, 7, 10, 13, 16, 19, 22, 25, 29, 33, 37, 41, 45, 49, 53, 57, 63, 69, 75, 81, 87, 93, 101, 109, 117, 125, 133, 141, 151, 161, 171, 181, 191, 201, 211, 221, 231, 241, 251, 261, 271, 281, 291, 301, 311, 321, 331, 341, 351, 361, 371, 381, 391, 401, 411, 421, 431, 441, 451, 461]
        },
        manaCost: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.25, 6.5, 6.75, 7, 7.25, 7.5, 7.75, 8, 8.25, 8.5, 8.75, 9, 9.25, 9.5, 9.75, 10, 10.25, 10.5, 10.75, 11, 11.25, 11.5, 11.75, 12, 12.25, 12.5, 12.75, 13, 13.25, 13.5, 13.75, 14, 14.25, 14.5, 14.75, 15, 15.25, 15.5, 15.75],
        baseRadius: 4,
        explosionRadiusBonusPerCurse: 33, // +33% radius per curse consumed
        damageBonusPerCurse: 10, // +10% damage per curse consumed
        // Curse Mastery bonuses:
        // - +16% Magic Damage per Level
        // - +0.6 Radius per 3 Levels
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 16, damageType: 'magic' },
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.2, damageType: 'radius' }, // 0.6 per 3 levels
          { skillId: 'ironmaidencontainer', bonusPerLevel: 16, damageType: 'magic' }
          // TODO: Add synergies for "All Other Curses: +12% Magic Damage per Level"
          // This would require dynamically detecting all curse-type skills
        ]
      },
      ironmaidencontainer: {
        name: "Iron Maiden",
        type: "curse",
        damageReturned: [200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525, 1550, 1575, 1600, 1625, 1650, 1675],
        duration: [6, 7.2, 8.4, 9.6, 10.8, 12, 13.2, 14.4, 15.6, 16.8, 18, 19.2, 20.4, 21.6, 22.8, 24, 25.2, 26.4, 27.6, 28.8, 30, 31.2, 32.4, 33.6, 34.8, 36, 37.2, 38.4, 39.6, 40.8, 42, 43.2, 44.4, 45.6, 46.8, 48, 49.2, 50.4, 51.6, 52.8, 54, 55.2, 56.4, 57.6, 58.8, 60, 61.2, 62.4, 63.6, 64.8, 66, 67.2, 68.4, 69.6, 70.8, 72, 73.2, 74.4, 75.6, 76.8],
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        radius: [8, 8, 8, 8.6, 8.6, 8.6, 9.3, 9.3, 9.3, 10, 10, 10, 10.6, 10.6, 10.6, 11.3, 11.3, 11.3, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        // Curse Mastery bonuses:
        // - +6% Increased Damage Returned per Level
        // - +0.6 Radius per 3 Levels
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 6, damageType: 'damageReturn' },
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.2, damageType: 'radius' } // 0.6 per 3 levels
        ]
      },
      lifetapcontainer: {
        name: "Life Tap",
        type: "curse",
        lifeSteal: [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48],
        duration: [7, 8.4, 9.8, 11.2, 12.6, 14, 15.4, 16.8, 18.2, 19.6, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        manaCost: [5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7],
        radius: [4, 4, 4, 4.6, 4.6, 4.6, 5.3, 5.3, 5.3, 6, 6, 6, 6.6, 6.6, 6.6, 7.3, 7.3, 7.3, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        // Curse Mastery bonuses:
        // - +1% Increased Life Steal per 2 Levels
        // - +0.6 Radius per 3 Levels
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.5, damageType: 'lifeSteal' }, // 1% per 2 levels
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.2, damageType: 'radius' } // 0.6 per 3 levels
        ]
      },
      terrorcontainer: {
        name: "Terror",
        type: "curse",
        enemyMovementSpeed: [-10, -12, -14, -16, -18, -20, -22, -24, -26, -28, -30, -32, -34, -36, -38, -40, -42, -44, -46, -48, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50],
        duration: 3,
        radius: 6,
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        // Curse Mastery bonus: +1% Reduced Movement Speed per Level
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 1, damageType: 'movementSpeed' }
        ]
      },
      weakencontainer: {
        name: "Weaken",
        type: "curse",
        enemyDefense: [-10, -12, -14, -16, -18, -20, -22, -24, -26, -28, -30, -32, -34, -36, -38, -40, -42, -44, -46, -48, -50, -52, -54, -56, -58, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
        enemyDamage: [-10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63, -64, -65, -66, -67, -68, -69],
        duration: [10, 11.4, 12.8, 14.2, 15.6, 17, 18.4, 19.8, 21.2, 22.6, 24, 25.4, 26.8, 28.2, 29.6, 31, 32.4, 33.8, 35.2, 36.6, 38, 39.4, 40.8, 42.2, 43.6, 45, 46.4, 47.8, 49.2, 50.6, 52, 53.4, 54.8, 56.2, 57.6, 59, 60.4, 61.8, 63.2, 64.6, 66, 67.4, 68.8, 70.2, 71.6, 73, 74.4, 75.8, 77.2, 78.6, 80, 81.4, 82.8, 84.2, 85.6, 87, 88.4, 89.8, 91.2, 92.6],
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        radius: [8, 8, 8, 8.6, 8.6, 8.6, 9.3, 9.3, 9.3, 10, 10, 10, 10.6, 10.6, 10.6, 11.3, 11.3, 11.3, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        // Curse Mastery bonuses:
        // - +1% Reduced Damage Per Two Levels
        // - +0.6 Radius Per Three Levels
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.5, damageType: 'enemyDamage' }, // 1% per 2 levels
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.2, damageType: 'radius' } // 0.6 per 3 levels
        ]
      },
      confusecontainer: {
        name: "Confuse",
        type: "curse",
        enemyAttackSpeed: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210, 210],
        duration: 5,
        radius: [6, 6, 6, 6.6, 6.6, 6.6, 7.3, 7.3, 7.3, 8, 8, 8, 8.6, 8.6, 8.6, 9.3, 9.3, 9.3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        // Curse Mastery bonus: +5% Increased Attack Speed per Level
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 5, damageType: 'attackSpeed' }
        ]
      },
      attractcontainer: {
        name: "Attract",
        type: "curse",
        enemyDefense: [-120, -130, -140, -150, -160, -170, -180, -190, -200, -210, -220, -230, -240, -250, -260, -270, -280, -290, -300, -310, -320, -330, -340, -350, -360, -370, -380, -390, -400, -410, -420, -430, -440, -450, -460, -470, -480, -490, -500, -510, -520, -530, -540, -550, -560, -570, -580, -590, -600, -610, -620, -630, -640, -650, -660, -670, -680, -690, -700, -710],
        duration: [8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
        manaCost: 10,
        radius: [2.6, 2.6, 2.6, 3.3, 3.3, 3.3, 4, 4, 4, 4.6, 4.6, 4.6, 5.3, 5.3, 5.3, 6, 6, 6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6],
        // Curse Mastery bonus: +5 Reduced Enemy Defense per Level
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 5, damageType: 'enemyDefense' }
        ]
      },
      decrepifycontainer: {
        name: "Decrepify",
        type: "curse",
        enemyPhysicalResist: [-10, -10, -11, -11, -11, -12, -12, -12, -13, -13, -13, -14, -14, -14, -15, -15, -15, -16, -16, -16, -17, -17, -17, -18, -18, -18, -19, -19, -19, -20, -20, -20, -21, -21, -21, -22, -22, -22, -23, -23, -23, -24, -24, -24, -25, -25, -25, -26, -26, -26, -27, -27, -27, -28, -28, -28, -29, -29, -29, -30],
        enemyMovementSpeed: [-11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63, -64, -65, -66, -67, -68, -69, -70],
        enemyAttackCastSpeed: [-10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -60, -60, -60, -60, -60, -60, -60, -60, -60],
        duration: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.2, 9.6, 10, 10.4, 10.8, 11.2, 11.6, 12, 12.4, 12.8, 13.2, 13.6, 14, 14.4, 14.8, 15.2, 15.6, 16, 16.4, 16.8, 17.2, 17.6, 18, 18.4, 18.8, 19.2, 19.6, 20, 20.4, 20.8, 21.2, 21.6, 22, 22.4, 22.8, 23.2, 23.6, 24, 24.4, 24.8, 25.2, 25.6, 26, 26.4, 26.8, 27.2, 27.6],
        manaCost: [5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7],
        radius: [8, 8, 8, 8.6, 8.6, 8.6, 9.3, 9.3, 9.3, 10, 10, 10, 10.6, 10.6, 10.6, 11.3, 11.3, 11.3, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        // Curse Mastery bonuses:
        // - +1% Reduced Attack and Cast Rate per Level
        // - +0.6 Radius Per Three Levels
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 1, damageType: 'attackCastSpeed' },
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.2, damageType: 'radius' } // 0.6 per 3 levels
        ]
      },
      lowerresistcontainer: {
        name: "Lower Resist",
        type: "curse",
        // NOTE: Lower Resist, including Curse Mastery synergy, is capped at -65%
        enemyElementalResist: [-11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, -60, -61, -62, -63, -64, -65, -65, -65, -65, -65, -65],
        duration: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67],
        manaCost: [5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7],
        radius: [6, 6, 6, 6.6, 6.6, 6.6, 7.3, 7.3, 7.3, 8, 8, 8, 8.6, 8.6, 8.6, 9.3, 9.3, 9.3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        // Curse Mastery bonuses:
        // - +1% Lowered Resistances Per Two Levels
        // - +0.6 Radius Per Three Levels
        synergies: [
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.5, damageType: 'elementalResist' }, // 1% per 2 levels
          { skillId: 'cursemasterycontainer', bonusPerLevel: 0.2, damageType: 'radius' } // 0.6 per 3 levels
        ]
      },
      // Paladin Aura Skills
      mightcontainer: {
        name: "Might",
        type: "aura",
        radius: [13.3, 16, 18.6, 21.3, 24, 26.6, 29.3, 32, 34.6, 37.3, 40, 42.6, 45.3, 48, 50.6, 53.3, 56, 58.6, 61.3, 64, 66.6, 69.3, 72, 74.6, 77.3, 80, 82.6, 85.3, 88, 90.6, 93.3, 96, 98.6, 101.3, 104, 106.6, 109.3, 112, 114.6, 117.3, 120, 122.6, 125.3, 128, 130.6, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3],
        partyDamage: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610],
        yourDamage: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220],
        manaCost: 4
      },
      holyfirecontainer: {
        name: "Holy Fire",
        type: "aura",
        fireAttackMin: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124],
        fireAttackMax: [10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82, 86, 90, 94, 98, 102, 106, 110, 114, 118, 122, 126, 130, 134, 138, 142, 146, 150, 154, 158, 162, 166, 170, 174, 178, 182, 186, 190, 194, 198, 202, 206, 210, 214, 218, 222, 226, 230, 234, 238, 242, 246],
        attackRating: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345],
        fireAuraMin: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121],
        fireAuraMax: [7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95, 99, 103, 107, 111, 115, 119, 123, 127, 131, 135, 139, 143, 147, 151, 155, 159, 163, 167, 171, 175, 179, 183, 187, 191, 195, 199, 203, 207, 211, 215, 219, 223, 227, 231, 235, 239, 243],
        radius: [4, 4, 4, 4.6, 4.6, 4.6, 5.3, 5.3, 5.3, 6, 6, 6, 6.6, 6.6, 6.6, 7.3, 7.3, 7.3, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        manaCost: 12,
        synergies: [
          { skillId: 'resistfirecontainer', bonusPerLevel: 16, damageType: 'fire' },
          { skillId: 'salvationcontainer', bonusPerLevel: 16, damageType: 'fire' },
          { skillId: 'blessedaimcontainer', bonusPerLevel: 16, damageType: 'fire' }
        ]
      },
      thornscontainer: {
        name: "Thorns",
        type: "aura",
        radius: [13.3, 16, 18.6, 21.3, 24, 26.6, 29.3, 32, 34.6, 37.3, 40, 42.6, 45.3, 48, 50.6, 53.3, 56, 58.6, 61.3, 64, 66.6, 69.3, 72, 74.6, 77.3, 80, 82.6, 85.3, 88, 90.6, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92],
        damageReturned: [3, 19, 35, 51, 67, 83, 99, 115, 131, 147, 163, 179, 195, 211, 227, 243, 259, 275, 291, 307, 323, 339, 355, 371, 387, 403, 419, 435, 451, 467, 483, 499, 515, 531, 547, 563, 579, 595, 611, 627, 643, 659, 675, 691, 707, 723, 739, 755, 771, 787, 803, 819, 835, 851, 867, 883, 899, 915, 931, 938],
        openWoundsChance: [15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 25, 25, 25, 26, 26, 26, 27, 27, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 31, 31, 31, 32, 32, 32, 33, 33, 33, 34, 34, 35],
        yourOpenWoundsDamage: [1, 12, 23, 34, 45, 56, 67, 78, 89, 100, 111, 122, 133, 144, 155, 166, 177, 188, 199, 210, 221, 232, 243, 254, 265, 276, 287, 298, 309, 320, 331, 342, 353, 364, 375, 386, 397, 408, 419, 430, 441, 452, 463, 474, 485, 496, 507, 518, 529, 540, 551, 562, 573, 584, 595, 606, 617, 628, 629, 629],
        partyOpenWoundsDamage: [1, 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113, 121, 129, 137, 145, 153, 161, 169, 177, 185, 193, 201, 209, 217, 225, 233, 241, 249, 257, 265, 273, 281, 289, 297, 305, 313, 321, 329, 337, 345, 353, 361, 369, 377, 385, 393, 401, 409, 417, 425, 433, 441, 449, 457, 465, 472],
        manaCost: 4,
        synergies: [
          { skillId: 'mightcontainer', bonusPerLevel: 20, damageType: 'damage' },
          { skillId: 'defiancecontainer', bonusPerLevel: 20, damageType: 'damage' }
        ]
      },
      blessedaimcontainer: {
        name: "Blessed Aim",
        type: "aura",
        radius: [13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92],
        deadlyStrike: [5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35],
        attackRating: [60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945],
        passiveTargetDefense: [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20],
        manaCost: 4
      },
      concentrationcontainer: {
        name: "Concentration",
        type: "aura",
        radius: [13.3, 15.3, 17.3, 19.3, 21.3, 23.3, 25.3, 27.3, 29.3, 31.3, 33.3, 35.3, 37.3, 39.3, 41.3, 43.3, 45.3, 47.3, 49.3, 51.3, 53.3, 55.3, 57.3, 59.3, 61.3, 63.3, 65.3, 67.3, 69.3, 71.3, 73.3, 75.3, 77.3, 79.3, 81.3, 83.3, 85.3, 87.3, 89.3, 91.3, 93.3, 95.3, 97.3, 99.3, 101.3, 103.3, 105.3, 107.3, 109.3, 111.3, 113.3, 115.3, 117.3, 119.3, 121.3, 123.3, 125.3, 127.3, 129.3, 131.3],
        attackRating: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640],
        partyDamage: [30, 37, 45, 52, 60, 67, 75, 82, 90, 97, 105, 112, 120, 127, 135, 142, 150, 157, 165, 172, 180, 187, 195, 202, 210, 217, 225, 232, 240, 247, 255, 262, 270, 277, 285, 292, 300, 307, 315, 322, 330, 337, 345, 352, 360, 367, 375, 382, 390, 397, 405, 412, 420, 427, 435, 442, 450, 457, 465, 472],
        yourDamage: [60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945],
        blessedHammerDamage: [30, 37, 45, 52, 60, 67, 75, 82, 90, 97, 105, 112, 120, 127, 135, 142, 150, 157, 165, 172, 180, 187, 195, 202, 210, 217, 225, 232, 240, 247, 255, 262, 270, 277, 285, 292, 300, 307, 315, 322, 330, 337, 345, 352, 360, 367, 375, 382, 390, 397, 405, 412, 420, 427, 435, 442, 450, 457, 465, 472],
        uninterruptedAttack: 20,
        manaCost: 4
      },
      holyfreezecontainer: {
        name: "Holy Freeze",
        type: "aura",
        radius: 8,
        coldAttackMin: [10, 15, 20, 25, 30, 35, 40, 45, 52, 60, 67, 75, 82, 90, 97, 105, 117, 130, 142, 155, 167, 180, 200, 220, 240, 260, 280, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260],
        coldAttackMax: [15, 22, 30, 37, 45, 52, 60, 67, 77, 87, 97, 107, 117, 127, 137, 147, 162, 177, 192, 207, 222, 237, 262, 287, 312, 337, 362, 387, 422, 457, 492, 527, 562, 597, 632, 667, 702, 737, 772, 807, 842, 877, 912, 947, 982, 1017, 1052, 1087, 1122, 1157, 1192, 1227, 1262, 1297, 1332, 1367, 1402, 1437, 1472, 1507],
        attackRating: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345],
        coldAuraMin: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 18, 19, 21, 23, 26, 28, 31, 33, 36, 40, 44, 48, 52, 56, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252],
        coldAuraMax: [3, 4, 6, 7, 9, 10, 12, 13, 15, 17, 19, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 47, 52, 57, 62, 67, 72, 77, 84, 91, 98, 105, 112, 119, 126, 133, 140, 147, 154, 161, 168, 175, 182, 189, 196, 203, 210, 217, 224, 231, 238, 245, 252, 259, 266, 273, 280, 287, 294, 301],
        enemySpeed: [-30, -34, -37, -40, -42, -44, -45, -46, -48, -48, -49, -50, -51, -51, -52, -53, -53, -53, -54, -54, -54, -55, -55, -55, -55, -56, -56, -56, -56, -56, -57, -57, -57, -57, -57, -57, -57, -58, -58, -58, -58, -58, -58, -58, -58, -58, -58, -58, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -60],
        manaCost: 12,
        synergies: [
          { skillId: 'resistcoldcontainer', bonusPerLevel: 11, damageType: 'cold' },
          { skillId: 'salvationcontainer', bonusPerLevel: 11, damageType: 'cold' },
          { skillId: 'blessedaimcontainer', bonusPerLevel: 11, damageType: 'cold' }
        ]
      },
      holyshockcontainer: {
        name: "Holy Shock",
        type: "aura",
        radius: 9.3,
        lightningAttackMin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lightningAttackMax: [80, 112, 144, 176, 208, 240, 272, 304, 348, 392, 436, 480, 524, 568, 612, 656, 716, 776, 836, 896, 956, 1016, 1096, 1176, 1256, 1336, 1416, 1496, 1600, 1704, 1808, 1912, 2016, 2120, 2224, 2328, 2432, 2536, 2640, 2744, 2848, 2952, 3056, 3160, 3264, 3368, 3472, 3576, 3680, 3784, 3888, 3992, 4096, 4200, 4304, 4408, 4512, 4616, 4720, 4824],
        attackRating: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345],
        lightningAuraMin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lightningAuraMax: [10, 14, 18, 22, 26, 30, 34, 38, 43, 49, 54, 60, 65, 71, 76, 82, 89, 97, 104, 112, 119, 127, 137, 147, 157, 167, 177, 187, 200, 213, 226, 239, 252, 265, 278, 291, 304, 317, 330, 343, 356, 369, 382, 395, 408, 421, 434, 447, 460, 473, 486, 499, 512, 525, 538, 551, 564, 577, 590, 603],
        manaCost: 12,
        synergies: [
          { skillId: 'resistlightningcontainer', bonusPerLevel: 9, damageType: 'lightning' },
          { skillId: 'salvationcontainer', bonusPerLevel: 9, damageType: 'lightning' },
          { skillId: 'blessedaimcontainer', bonusPerLevel: 9, damageType: 'lightning' }
        ]
      },
      sanctuarycontainer: {
        name: "Sanctuary",
        type: "aura",
        radius: 12,
        magicAttackMin: [25, 33, 41, 49, 57, 65, 73, 81, 91, 101, 111, 121, 131, 141, 151, 161, 176, 191, 206, 221, 236, 251, 274, 297, 320, 343, 366, 389, 423, 457, 491, 525, 559, 593, 627, 661, 695, 729, 763, 797, 831, 865, 899, 933, 967, 1001, 1035, 1069, 1103, 1137, 1171, 1205, 1239, 1273, 1307, 1341, 1375, 1409, 1443, 1477],
        magicAttackMax: [40, 48, 56, 64, 72, 80, 88, 96, 106, 116, 126, 136, 146, 156, 166, 176, 191, 206, 221, 236, 251, 266, 289, 312, 335, 358, 381, 404, 438, 472, 506, 540, 574, 608, 642, 676, 710, 744, 778, 812, 846, 880, 914, 948, 982, 1016, 1050, 1084, 1118, 1152, 1186, 1220, 1254, 1288, 1322, 1356, 1390, 1424, 1458, 1492],
        attackRating: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345],
        magicAuraMin: [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 27, 30, 32, 35, 37, 40, 44, 47, 51, 55, 59, 62, 68, 74, 80, 85, 91, 97, 105, 114, 122, 131, 139, 148, 156, 165, 173, 182, 190, 199, 207, 216, 224, 233, 241, 250, 258, 267, 275, 284, 292, 301, 309, 318, 326, 335, 343, 352, 360, 369],
        magicAuraMax: [10, 12, 14, 16, 18, 20, 22, 24, 26, 29, 31, 34, 36, 39, 41, 44, 47, 51, 55, 59, 62, 66, 72, 78, 83, 89, 95, 101, 109, 118, 126, 135, 143, 152, 160, 169, 177, 186, 194, 203, 211, 220, 228, 237, 245, 254, 262, 271, 279, 288, 296, 305, 313, 322, 330, 339, 347, 356, 364, 373],
        enemyMagicResist: [-5, -6, -6, -7, -7, -8, -8, -9, -9, -10, -10, -11, -11, -12, -12, -13, -13, -14, -14, -15, -15, -16, -16, -17, -17, -18, -18, -19, -19, -20, -20, -21, -21, -22, -22, -23, -23, -24, -24, -25, -25, -26, -26, -27, -27, -28, -28, -29, -29, -30, -30, -31, -31, -32, -32, -33, -33, -34, -34, -35],
        manaCost: 12,
        synergies: [
          { skillId: 'mightcontainer', bonusPerLevel: 10, damageType: 'magic' },
          { skillId: 'blessedaimcontainer', bonusPerLevel: 10, damageType: 'magic' },
          { skillId: 'holyswordcontainer', bonusPerLevel: 10, damageType: 'magic' }
        ]
      },
      fanaticismcontainer: {
        name: "Fanaticism",
        type: "aura",
        radius: [13.3, 15.3, 17.3, 19.3, 21.3, 23.3, 25.3, 27.3, 29.3, 31.3, 33.3, 35.3, 37.3, 39.3, 41.3, 43.3, 45.3, 47.3, 49.3, 51.3, 53.3, 55.3, 57.3, 59.3, 61.3, 63.3, 65.3, 67.3, 69.3, 71.3, 73.3, 75.3, 77.3, 79.3, 81.3, 83.3, 85.3, 87.3, 89.3, 91.3, 93.3, 95.3, 97.3, 99.3, 101.3, 103.3, 105.3, 107.3, 109.3, 111.3, 113.3, 115.3, 117.3, 119.3, 121.3, 123.3, 125.3, 127.3, 129.3, 131.3],
        partyDamage: [25, 32, 40, 47, 55, 62, 70, 77, 85, 92, 100, 107, 115, 122, 130, 137, 145, 152, 160, 167, 175, 182, 190, 197, 205, 212, 220, 227, 235, 242, 250, 257, 265, 272, 280, 287, 295, 302, 310, 317, 325, 332, 340, 347, 355, 362, 370, 377, 385, 392, 400, 407, 415, 422, 430, 437, 445, 452, 460, 467],
        yourDamage: [50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 530, 545, 560, 575, 590, 605, 620, 635, 650, 665, 680, 695, 710, 725, 740, 755, 770, 785, 800, 815, 830, 845, 860, 875, 890, 905, 920, 935],
        attackSpeed: [14, 18, 20, 23, 25, 26, 27, 28, 29, 30, 31, 31, 32, 33, 33, 34, 34, 34, 34, 35, 35, 35, 36, 36, 36, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        attackRating: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335],
        manaCost: 4
      },
      convictioncontainer: {
        name: "Conviction",
        type: "aura",
        radius: [14.67, 15.33, 16, 16.67, 17.33, 18, 18.67, 19.33, 20, 20.67, 21.33, 22, 22.67, 23.33, 24, 24.67, 25.33, 26, 26.67, 27.33, 28, 28.67, 29.33, 30, 30.67, 31.33, 32, 32.67, 33.33, 34, 34.67, 35.33, 36, 36.67, 37.33, 38, 38.67, 39.33, 40, 40.67, 41.33, 42, 42.67, 43.33, 44, 44.67, 45.33, 46, 46.67, 47.33, 48, 48.67, 49.33, 50, 50.67, 51.33, 52, 52.67, 53.33, 54],
        enemyDefense: [-19, -27, -33, -38, -42, -45, -48, -50, -52, -54, -56, -57, -58, -60, -60, -62, -62, -63, -63, -64, -65, -65, -66, -67, -67, -67, -68, -68, -69, -69, -69, -69, -70, -70, -70, -71, -71, -71, -71, -71, -71, -72, -72, -72, -73, -73, -73, -73, -73, -73, -73, -73, -73, -74, -74, -74, -74, -74, -74, -75],
        enemyElementalResist: [-12, -14, -16, -18, -20, -22, -24, -26, -28, -30, -32, -34, -36, -38, -40, -42, -44, -46, -48, -50, -52, -54, -56, -58, -60, -62, -64, -66, -68, -70, -72, -74, -76, -78, -80, -82, -84, -86, -88, -90, -92, -94, -96, -98, -100, -102, -104, -106, -108, -110, -112, -114, -116, -118, -120, -122, -124, -126, -128, -130],
        manaCost: 12
      },
      // Paladin Combat Skills
      zealcontainer: {
        name: "Zeal",
        type: "physical",
        attackRating: [35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235, 255, 275, 295, 315, 335, 355, 375, 395, 415, 435, 455, 475, 495, 515, 535, 555, 575, 595, 615, 635, 655, 675, 695, 715, 735, 755, 775, 795, 815, 835, 855, 875, 895, 915, 935, 955, 975, 995, 1015, 1035, 1055, 1075, 1095, 1115, 1135, 1155, 1175, 1195, 1215],
        damage: [30, 55, 80, 105, 130, 155, 180, 205, 230, 255, 280, 305, 330, 355, 380, 405, 430, 455, 480, 505, 530, 555, 580, 605, 630, 655, 680, 705, 730, 755, 780, 805, 830, 855, 880, 905, 930, 955, 980, 1005, 1030, 1055, 1080, 1105, 1130, 1155, 1180, 1205, 1230, 1255, 1280, 1305, 1330, 1355, 1380, 1405, 1430, 1455, 1480, 1505],
        manaCost: 2,
        synergies: [
          { skillId: 'sacrificecontainer', bonusPerLevel: 20, damageType: 'physical' }
        ]
      },
      holyboltcontainer: {
        name: "Holy Bolt",
        type: "magic",
        damageMin: [3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 62, 74, 86, 98, 110, 122, 141, 160, 179, 198, 217, 236, 262, 288, 314, 340, 366, 392, 418, 444, 470, 496, 522, 548, 574, 600, 626, 652, 678, 704, 730, 756, 782, 808, 834, 860, 886, 912, 938, 964, 990, 1016, 1042, 1068],
        damageMax: [5, 7, 9, 11, 13, 15, 17, 19, 26, 33, 40, 47, 54, 61, 68, 75, 89, 103, 117, 131, 145, 159, 180, 201, 222, 243, 264, 285, 313, 341, 369, 397, 425, 453, 481, 509, 537, 565, 593, 621, 649, 677, 705, 733, 761, 789, 817, 845, 873, 901, 929, 957, 985, 1013, 1041, 1069, 1097, 1125, 1153, 1181],
        healsMin: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30],
        healsMax: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31],
        manaCost: [2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7],
        synergies: [
          { skillId: 'holylightcontainer', bonusPerLevel: 11, damageType: 'magic' },
          { skillId: 'fistoftheheavenscontainer', bonusPerLevel: 11, damageType: 'magic' },
          { skillId: 'holynovacontainer', bonusPerLevel: 11, damageType: 'magic' },
          { skillId: 'prayercontainer', bonusPerLevel: 5, damageType: 'heal' }
        ]
      },
      smitecontainer: {
        name: "Smite",
        type: "smite",
        damage: [75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525, 1550],
        stunLength: [0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        crushingBlowEffectiveness: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
        crushingBlowChance: [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        manaCost: 2
      },
      sacrificecontainer: {
        name: "Sacrifice",
        type: "physical",
        radius: [1.3, 1.3, 1.3, 1.3, 1.6, 1.6, 1.6, 1.6, 1.6, 2, 2, 2, 2, 2, 2.3, 2.3, 2.3, 2.3, 2.3, 2.6, 2.6, 2.6, 2.6, 2.6, 3, 3, 3, 3, 3, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33, 3.33],
        damageToSelf: [8, 7, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // Damage to Self is reduced by Physical Damage Reduction
        attackRating: [20, 36, 52, 68, 84, 100, 116, 132, 148, 164, 180, 196, 212, 228, 244, 260, 276, 292, 308, 324, 340, 356, 372, 388, 404, 420, 436, 452, 468, 484, 500, 516, 532, 548, 564, 580, 596, 612, 628, 644, 660, 676, 692, 708, 724, 740, 756, 772, 788, 804, 820, 836, 852, 868, 884, 900, 916, 932, 948, 964],
        damage: [180, 205, 230, 255, 280, 305, 330, 355, 380, 405, 430, 455, 480, 505, 530, 555, 580, 605, 630, 655, 680, 705, 730, 755, 780, 805, 830, 855, 880, 905, 930, 955, 980, 1005, 1030, 1055, 1080, 1105, 1130, 1155, 1180, 1205, 1230, 1255, 1280, 1305, 1330, 1355, 1380, 1405, 1430, 1455, 1480, 1505, 1530, 1555, 1580, 1605, 1630, 1655],
        manaCost: 0,
        synergies: [
          { skillId: 'redemptioncontainer', bonusPerLevel: 25, damageType: 'physical' },
          { skillId: 'fanaticismcontainer', bonusPerLevel: 25, damageType: 'physical' }
        ]
      },
      holylightcontainer: {
        name: "Holy Light",
        type: "magic",
        damageMin: [7, 9, 11, 13, 15, 17, 19, 21, 27, 33, 39, 45, 51, 57, 63, 69, 82, 95, 108, 121, 134, 147, 168, 189, 210, 231, 252, 273, 303, 333, 363, 393, 423, 453, 483, 513, 543, 573, 603, 633, 663, 693, 723, 753, 783, 813, 843, 873, 903, 933, 963, 993, 1023, 1053, 1083, 1113, 1143, 1173, 1203, 1233],
        damageMax: [9, 12, 15, 18, 21, 24, 27, 30, 38, 46, 54, 62, 70, 78, 86, 94, 109, 124, 139, 154, 169, 184, 207, 230, 253, 276, 299, 322, 358, 394, 430, 466, 502, 538, 574, 610, 646, 682, 718, 754, 790, 826, 862, 898, 934, 970, 1006, 1042, 1078, 1114, 1150, 1186, 1222, 1258, 1294, 1330, 1366, 1402, 1438, 1474],
        healsMin: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325],
        healsMax: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640],
        manaCost: [5, 5.25, 5.5, 5.75, 6, 6.25, 6.5, 6.75, 7, 7.25, 7.5, 7.75, 8, 8.25, 8.5, 8.75, 9, 9.25, 9.5, 9.75, 10, 10.25, 10.5, 10.75, 11, 11.25, 11.5, 11.75, 12, 12.25, 12.5, 12.75, 13, 13.25, 13.5, 13.75, 14, 14.25, 14.5, 14.75, 15, 15.25, 15.5, 15.75, 16, 16.25, 16.5, 16.75, 17, 17.25, 17.5, 17.75, 18, 18.25, 18.5, 18.75, 19, 19.25, 19.5, 19.75],
        synergies: [
          { skillId: 'holyboltcontainer', bonusPerLevel: 10, damageType: 'magic' },
          { skillId: 'fistoftheheavenscontainer', bonusPerLevel: 10, damageType: 'magic' },
          { skillId: 'prayercontainer', bonusPerLevel: 7.5, damageType: 'heal' } // Average of 5-10 per level
        ]
      },
      chargecontainer: {
        name: "Charge",
        type: "physical",
        damage: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260, 1280],
        attackRating: [75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435, 450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 600, 615, 630, 645, 660, 675, 690, 705, 720, 735, 750, 765, 780, 795, 810, 825, 840, 855, 870, 885, 900, 915, 930, 945, 960],
        manaCost: 9,
        synergies: [
          { skillId: 'vigorcontainer', bonusPerLevel: 15, damageType: 'physical' },
          { skillId: 'mightcontainer', bonusPerLevel: 15, damageType: 'physical' }
        ]
      },
      vengeancecontainer: {
        name: "Vengeance",
        type: "elemental_hybrid",
        chainChance: [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95],
        attackRating: [120, 138, 156, 174, 192, 210, 228, 246, 264, 282, 300, 318, 336, 354, 372, 390, 408, 426, 444, 462, 480, 498, 516, 534, 552, 570, 588, 606, 624, 642, 660, 678, 696, 714, 732, 750, 768, 786, 804, 822, 840, 858, 876, 894, 912, 930, 948, 966, 984, 1002, 1020, 1038, 1056, 1074, 1092, 1110, 1128, 1146, 1164, 1182],
        elementalDamage: [5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121, 123],
        fireDamageMin: [6, 7, 8, 9, 10, 11, 12, 13, 16, 19, 22, 25, 28, 31, 34, 37, 42, 47, 52, 57, 62, 67, 73, 79, 85, 91, 97, 103, 110, 117, 124, 131, 138, 145, 152, 159, 166, 173, 180, 187, 194, 201, 208, 215, 222, 229, 236, 243, 250, 257, 264, 271, 278, 285, 292, 299, 306, 313, 320, 327],
        fireDamageMax: [8, 10, 12, 14, 16, 18, 20, 22, 26, 30, 34, 38, 42, 46, 50, 54, 60, 66, 72, 78, 84, 90, 97, 104, 111, 118, 125, 132, 140, 148, 156, 164, 172, 180, 188, 196, 204, 212, 220, 228, 236, 244, 252, 260, 268, 276, 284, 292, 300, 308, 316, 324, 332, 340, 348, 356, 364, 372, 380, 388],
        coldDamageMin: [6, 7, 8, 9, 10, 11, 12, 13, 16, 19, 22, 25, 28, 31, 34, 37, 42, 47, 52, 57, 62, 67, 73, 79, 85, 91, 97, 103, 110, 117, 124, 131, 138, 145, 152, 159, 166, 173, 180, 187, 194, 201, 208, 215, 222, 229, 236, 243, 250, 257, 264, 271, 278, 285, 292, 299, 306, 313, 320, 327],
        coldDamageMax: [8, 10, 12, 14, 16, 18, 20, 22, 26, 30, 34, 38, 42, 46, 50, 54, 60, 66, 72, 78, 84, 90, 97, 104, 111, 118, 125, 132, 140, 148, 156, 164, 172, 180, 188, 196, 204, 212, 220, 228, 236, 244, 252, 260, 268, 276, 284, 292, 300, 308, 316, 324, 332, 340, 348, 356, 364, 372, 380, 388],
        lightningDamageMin: [6, 7, 8, 9, 10, 11, 12, 13, 16, 19, 22, 25, 28, 31, 34, 37, 42, 47, 52, 57, 62, 67, 73, 79, 85, 91, 97, 103, 110, 117, 124, 131, 138, 145, 152, 159, 166, 173, 180, 187, 194, 201, 208, 215, 222, 229, 236, 243, 250, 257, 264, 271, 278, 285, 292, 299, 306, 313, 320, 327],
        lightningDamageMax: [8, 10, 12, 14, 16, 18, 20, 22, 26, 30, 34, 38, 42, 46, 50, 54, 60, 66, 72, 78, 84, 90, 97, 104, 111, 118, 125, 132, 140, 148, 156, 164, 172, 180, 188, 196, 204, 212, 220, 228, 236, 244, 252, 260, 268, 276, 284, 292, 300, 308, 316, 324, 332, 340, 348, 356, 364, 372, 380, 388],
        coldLength: 3.2,
        manaCost: [2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 6, 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, 7, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 8, 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.8, 9, 9.1, 9.2, 9.3],
        synergies: [
          { skillId: 'holyfirecontainer', bonusPerLevel: 2, damageType: 'elemental' },
          { skillId: 'holyfreezecontainer', bonusPerLevel: 2, damageType: 'elemental' },
          { skillId: 'holyshockcontainer', bonusPerLevel: 2, damageType: 'elemental' },
          { skillId: 'convictioncontainer', bonusPerLevel: 2, damageType: 'elemental' }
        ]
      },
      blessedhammercontainer: {
        name: "Blessed Hammer",
        type: "magic",
        damageMin: [12, 20, 28, 36, 44, 52, 60, 68, 78, 88, 98, 108, 118, 128, 138, 148, 160, 172, 184, 196, 208, 220, 233, 246, 259, 272, 285, 298, 312, 326, 340, 354, 368, 382, 396, 410, 424, 438, 452, 466, 480, 494, 508, 522, 536, 550, 564, 578, 592, 606, 620, 634, 648, 662, 676, 690, 704, 718, 732, 746],
        damageMax: [16, 24, 32, 40, 48, 56, 64, 72, 82, 92, 102, 112, 122, 132, 142, 152, 164, 176, 188, 200, 212, 224, 237, 250, 263, 276, 289, 302, 316, 330, 344, 358, 372, 386, 400, 414, 428, 442, 456, 470, 484, 498, 512, 526, 540, 554, 568, 582, 596, 610, 624, 638, 652, 666, 680, 694, 708, 722, 736, 750],
        manaCost: [5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7],
        synergies: [
          { skillId: 'blessedaimcontainer', bonusPerLevel: 12, damageType: 'magic' },
          { skillId: 'vigorcontainer', bonusPerLevel: 12, damageType: 'magic' }
        ]
      },
      holyshieldcontainer: {
        name: "Holy Shield",
        type: "buff",
        smiteDamageMin: [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 29, 32, 35, 38, 41, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196],
        smiteDamageMax: [6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 19, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95, 99, 103, 107, 111, 115, 119, 123, 127, 131, 135, 139, 143, 147, 151, 155, 159, 163, 167, 171, 175, 179, 183, 187, 191, 195, 199],
        duration: [300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595],
        defenseBonus: [25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515, 525, 535, 545, 555, 565, 575, 585, 595, 605, 615],
        blockChance: [10, 14, 17, 20, 22, 24, 25, 26, 28, 28, 29, 30, 31, 31, 32, 33, 33, 33, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 40],
        manaCost: 35,
        synergies: [
          { skillId: 'smitecontainer', bonusPerLevel: 5, damageType: 'smite' },
          { skillId: 'defiancecontainer', bonusPerLevel: 5, damageType: 'smite' },
          { skillId: 'defiancecontainer', bonusPerLevel: 15, damageType: 'defense' }
        ]
      },
      joustcontainer: {
        name: "Joust",
        type: "utility",
        movementSpeed: [5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65],
        damage: [40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192, 200, 208, 216, 224, 232, 240, 248, 256, 264, 272, 280, 288, 296, 304, 312, 320, 328, 336, 344, 352, 360, 368, 376, 384, 392, 400, 408, 416, 424, 432, 440, 448, 456, 464, 472, 480, 488, 496, 504, 512],
        attackRating: [120, 136, 152, 168, 184, 200, 216, 232, 248, 264, 280, 296, 312, 328, 344, 360, 376, 392, 408, 424, 440, 456, 472, 488, 504, 520, 536, 552, 568, 584, 600, 616, 632, 648, 664, 680, 696, 712, 728, 744, 760, 776, 792, 808, 824, 840, 856, 872, 888, 904, 920, 936, 952, 968, 984, 1000, 1016, 1032, 1048, 1064],
        criticalStrike: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
        cooldown: [3.5, 3.4, 3.3, 3.2, 3.1, 3, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
        duration: 2,
        manaCost: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64]
      },
      fistoftheheavenscontainer: {
        name: "Fist of the Heavens",
        type: "magic_lightning_hybrid",
        magicDamageMin: [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 52, 56, 65, 74, 83, 92, 101, 110, 124, 138, 152, 166, 180, 194, 214, 234, 254, 274, 294, 314, 334, 354, 374, 394, 414, 434, 454, 474, 494, 514, 534, 554, 574, 594, 614, 634, 654, 674, 694, 714, 734, 754, 774, 794, 814, 834],
        magicDamageMax: [12, 15, 18, 21, 24, 27, 30, 33, 38, 43, 48, 53, 58, 63, 68, 73, 83, 93, 103, 113, 123, 133, 148, 163, 178, 193, 208, 223, 244, 265, 286, 307, 328, 349, 370, 391, 412, 433, 454, 475, 496, 517, 538, 559, 580, 601, 622, 643, 664, 685, 706, 727, 748, 769, 790, 811, 832, 853, 874, 895],
        lightningDamageMin: [100, 102, 104, 106, 108, 110, 112, 114, 119, 124, 129, 134, 139, 144, 149, 154, 162, 170, 178, 186, 194, 202, 213, 224, 235, 246, 257, 268, 283, 298, 313, 328, 343, 358, 373, 388, 403, 418, 433, 448, 463, 478, 493, 508, 523, 538, 553, 568, 583, 598, 613, 628, 643, 658, 673, 688, 703, 718, 733, 748],
        lightningDamageMax: [150, 155, 160, 165, 170, 175, 180, 185, 196, 207, 218, 229, 240, 251, 262, 273, 290, 307, 324, 341, 358, 375, 398, 421, 444, 467, 490, 513, 543, 573, 603, 633, 663, 693, 723, 753, 783, 813, 843, 873, 903, 933, 963, 993, 1023, 1053, 1083, 1113, 1143, 1173, 1203, 1233, 1263, 1293, 1323, 1353, 1383, 1413, 1443, 1473],
        manaCost: [10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7, 21, 21.2, 21.5, 21.7, 22, 22.2, 22.5, 22.7, 23, 23.2, 23.5, 23.7, 24, 24.2, 24.5, 24.7],
        synergies: [
          { skillId: 'holyboltcontainer', bonusPerLevel: 11, damageType: 'magic' },
          { skillId: 'holylightcontainer', bonusPerLevel: 11, damageType: 'magic' },
          { skillId: 'holynovacontainer', bonusPerLevel: 11, damageType: 'magic' }
        ]
      },
      holyswordcontainer: {
        name: "Holy Sword",
        type: "buff",
        parryChance: [8, 14, 19, 24, 27, 30, 32, 34, 36, 37, 39, 40, 41, 42, 42, 44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 48, 49, 49, 50, 50, 50, 50, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 54, 54, 55], // Affected by "Increased Chance of Blocking" at a 5:1 ratio (5% icb = 1% parry chance). Dexterity has no effect on parry chance. Parry chance has a hard cap of 75%.
        damageToDemonsUndead: [25, 32, 39, 46, 53, 60, 67, 74, 81, 88, 95, 102, 109, 116, 123, 130, 137, 144, 151, 158, 165, 172, 179, 186, 193, 200, 207, 214, 221, 228, 235, 242, 249, 256, 263, 270, 277, 284, 291, 298, 305, 312, 319, 326, 333, 340, 347, 354, 361, 368, 375, 382, 389, 396, 403, 410, 417, 424, 431, 438],
        duration: [300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595],
        manaCost: 35
      },
      holynovacontainer: {
        name: "Holy Nova",
        type: "magic",
        damageMin: [8, 16, 24, 32, 40, 48, 56, 64, 74, 84, 94, 104, 114, 124, 134, 144, 157, 170, 183, 196, 209, 222, 238, 254, 270, 286, 302, 318, 338, 358, 378, 398, 418, 438, 458, 478, 498, 518, 538, 558, 578, 598, 618, 638, 658, 678, 698, 718, 738, 758, 778, 798, 818, 838, 858, 878, 898, 918, 938, 958],
        damageMax: [16, 24, 32, 40, 48, 56, 64, 72, 83, 94, 105, 116, 127, 138, 149, 160, 175, 190, 205, 220, 235, 250, 268, 286, 304, 322, 340, 358, 381, 404, 427, 450, 473, 496, 519, 542, 565, 588, 611, 634, 657, 680, 703, 726, 749, 772, 795, 818, 841, 864, 887, 910, 933, 956, 979, 1002, 1025, 1048, 1071, 1094],
        heals: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260, 1280],
        cooldown: 4,
        manaCost: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
        synergies: [
          { skillId: 'prayercontainer', bonusPerLevel: 10, damageType: 'heal' },
          { skillId: 'holylightcontainer', bonusPerLevel: 10, damageType: 'heal' },
          { skillId: 'holyboltcontainer', bonusPerLevel: 15, damageType: 'magic' },
          { skillId: 'fistoftheheavenscontainer', bonusPerLevel: 15, damageType: 'magic' }
        ]
      },
      prayercontainer: {
        name: "Prayer",
        type: "aura",
        radius: [13.3, 15.3, 17.3, 19.3, 21.3, 23.3, 25.3, 27.3, 29.3, 31.3, 33.3, 35.3, 37.3, 39.3, 41.3, 43.3, 45.3, 47.3, 49.3, 51.3, 53.3, 55.3, 57.3, 59.3, 61.3, 63.3, 65.3, 67.3, 69.3, 71.3, 73.3, 75.3, 77.3, 79.3, 81.3, 83.3, 85.3, 87.3, 89.3, 91.3, 93.3, 95.3, 97.3, 99.3, 101.3, 103.3, 105.3, 107.3, 109.3, 111.3, 113.3, 115.3, 117.3, 119.3, 121.3, 123.3, 125.3, 127.3, 129.3, 131.3],
        lifePerHit: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31],
        lifeReplenish: [4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 27, 30, 33, 36, 39, 42, 46, 50, 54, 58, 62, 66, 71, 76, 81, 86, 91, 96, 101, 106, 111, 116, 121, 126, 131, 136, 141, 146, 151, 156, 161, 166, 171, 176, 181, 186, 191, 196, 201, 206, 211, 216, 221, 226, 231, 236, 241, 246, 251, 256],
        manaCost: [2, 2, 2, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30],
        passiveLifeReplenish: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
      },
      resistfirecontainer: {
        name: "Resist Fire",
        type: "aura",
        radius: [13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92],
        fireDamage: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
        resistFire: [25, 29, 33, 37, 41, 45, 49, 53, 56, 59, 62, 65, 68, 71, 74, 77, 79, 81, 83, 85, 87, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        passiveMaxFireResist: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        manaCost: 4
      },
      resistcoldcontainer: {
        name: "Resist Cold",
        type: "aura",
        radius: [13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92],
        coldDamage: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
        resistCold: [25, 29, 33, 37, 41, 45, 49, 53, 56, 59, 62, 65, 68, 71, 74, 77, 79, 81, 83, 85, 87, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        passiveMaxColdResist: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        manaCost: 4
      },
      resistlightningcontainer: {
        name: "Resist Lightning",
        type: "aura",
        radius: [13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92],
        lightningDamage: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
        resistLightning: [25, 29, 33, 37, 41, 45, 49, 53, 56, 59, 62, 65, 68, 71, 74, 77, 79, 81, 83, 85, 87, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        passiveMaxLightningResist: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        manaCost: 4
      },
      defiancecontainer: {
        name: "Defiance",
        type: "aura",
        radius: [13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92],
        defenseBonus: [70, 74, 78, 82, 86, 90, 94, 98, 104, 110, 116, 122, 128, 134, 140, 146, 154, 162, 170, 178, 186, 194, 204, 214, 224, 234, 244, 254, 266, 278, 290, 302, 314, 326, 338, 350, 362, 374, 386, 398, 410, 422, 434, 446, 458, 470, 482, 494, 506, 518, 530, 542, 554, 566, 578, 590, 602, 614, 626, 638],
        physicalDamageReduction: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30],
        physicalDamageTakenReduced: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30],
        manaCost: 4
      },
      cleansingcontainer: {
        name: "Cleansing",
        type: "aura",
        radius: [13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92],
        curseResistance: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34],
        reducedCursePoisonDuration: [25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
        passiveReducedCursePoisonDuration: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        manaCost: 4
      },
      vigorcontainer: {
        name: "Vigor",
        type: "aura",
        radius: [17.3, 19.3, 21.3, 23.3, 25.3, 27.3, 29.3, 31.3, 33.3, 35.3, 37.3, 39.3, 41.3, 43.3, 45.3, 47.3, 49.3, 51.3, 53.3, 55.3, 57.3, 59.3, 61.3, 63.3, 65.3, 67.3, 69.3, 71.3, 73.3, 75.3, 77.3, 79.3, 81.3, 83.3, 85.3, 87.3, 89.3, 91.3, 93.3, 95.3, 97.3, 99.3, 101.3, 103.3, 105.3, 107.3, 109.3, 111.3, 113.3, 115.3, 117.3, 119.3, 121.3, 123.3, 125.3, 127.3, 129.3, 131.3, 133.3, 135.3],
        movementSpeed: [13, 18, 22, 25, 28, 30, 32, 33, 35, 36, 37, 38, 39, 40, 40, 41, 41, 42, 42, 43, 43, 43, 44, 44, 44, 45, 45, 45, 46, 46, 46, 46, 46, 46, 46, 47, 47, 47, 47, 47, 47, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 50],
        stamina: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        staminaRecoveryRate: [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525],
        passiveFasterRunWalk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        manaCost: 4
      },
      meditationcontainer: {
        name: "Meditation",
        type: "aura",
        radius: [13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3, 90.6, 92],
        manaRecovery: [150, 162, 174, 186, 198, 210, 222, 234, 246, 258, 270, 282, 294, 306, 318, 330, 342, 354, 366, 378, 390, 402, 414, 426, 438, 450, 462, 474, 486, 498, 510, 522, 534, 546, 558, 570, 582, 594, 606, 618, 630, 642, 654, 666, 678, 690, 702, 714, 726, 738, 750, 762, 774, 786, 798, 810, 822, 834, 846, 858],
        passiveManaAfterEachKill: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        manaCost: 4
      },
      redemptioncontainer: {
        name: "Redemption",
        type: "aura",
        radius: 10.6,
        chanceToRedeemSoul: [23, 34, 42, 49, 55, 59, 63, 65, 69, 71, 73, 75, 77, 79, 80, 82, 82, 83, 84, 85, 86, 87, 88, 89, 89, 90, 91, 91, 91, 91, 92, 92, 93, 93, 93, 94, 94, 95, 95, 95, 95, 96, 96, 96, 97, 97, 97, 97, 98, 98, 98, 98, 98, 99, 99, 99, 99, 99, 99, 100],
        lifeRecovered: [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121, 123, 125],
        manaRecovered: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320],
        manaCost: 4
      },
      salvationcontainer: {
        name: "Salvation",
        type: "aura",
        radius: [10.6, 12, 13.3, 14.6, 16, 17.3, 18.6, 20, 21.3, 22.6, 24, 25.3, 26.6, 28, 29.3, 30.6, 32, 33.3, 34.6, 36, 37.3, 38.6, 40, 41.3, 42.6, 44, 45.3, 46.6, 48, 49.3, 50.6, 52, 53.3, 54.6, 56, 57.3, 58.6, 60, 61.3, 62.6, 64, 65.3, 66.6, 68, 69.3, 70.6, 72, 73.3, 74.6, 76, 77.3, 78.6, 80, 81.3, 82.6, 84, 85.3, 86.6, 88, 89.3],
        elementalDamage: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31],
        resistAll: [20, 24, 28, 32, 36, 40, 44, 47, 51, 54, 57, 60, 63, 66, 69, 72, 74, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
        manaCost: 4
      },
      // Sorceress Lightning Skills
      chargedboltcontainer: {
        name: "Charged Bolt",
        type: "lightning",
        lightningDamageMin: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 11, 12, 13, 14, 15, 17, 18, 20, 21, 23, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88],
        lightningDamageMax: [4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 23, 25, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90],
        bolts: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
        manaCost: [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5],
        synergies: [
          { skillId: 'telekinesiscontainer', bonusPerLevel: 7, damageType: 'lightning' },
          { skillId: 'lightningcontainer', bonusPerLevel: 7, damageType: 'lightning' }
        ]
      },
      telekinesiscontainer: {
        name: "Telekinesis",
        type: "lightning",
        lightningDamageMin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lightningDamageMax: [7, 10, 13, 16, 19, 22, 25, 28, 34, 40, 46, 52, 58, 64, 70, 76, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 208, 220, 232, 244, 256, 268, 280, 292, 304, 316, 328, 340, 352, 364, 376, 388, 400, 412, 424, 436, 448, 460, 472, 484, 496, 508, 520, 532, 544, 556, 568, 580, 592, 604],
        manaCost: 7,
        synergies: [
          { skillId: 'chargedboltcontainer', bonusPerLevel: 15, damageType: 'lightning' },
          { skillId: 'novacontainer', bonusPerLevel: 15, damageType: 'lightning' }
        ]
      },
      staticfieldcontainer: {
        name: "Static Field",
        type: "utility",
        enemyLightningResist: [-2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -23, -24, -24, -25, -25, -26, -26, -27, -27, -28, -28, -29, -29, -30, -30, -31, -31, -32, -32, -33, -33, -34, -34, -35, -35, -36, -36, -37, -37, -38, -38, -39, -39, -40, -40, -41, -41, -42],
        radius: [2.6, 2.6, 3.3, 3.3, 4, 4, 4.6, 4.6, 5.3, 5.3, 6, 6, 6.6, 6.6, 7.3, 7.3, 8, 8, 8.6, 8.6, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3],
        baseDuration: 5,
        manaCost: 9,
        synergies: [
          { skillId: 'lightningmasterycontainer', bonusPerLevel: 0.2, damageType: 'duration' }
        ]
      },
      novacontainer: {
        name: "Nova",
        type: "lightning",
        lightningDamageMin: [1, 7, 13, 19, 25, 31, 37, 43, 50, 57, 64, 71, 78, 85, 92, 99, 107, 115, 123, 131, 139, 147, 155, 163, 171, 179, 187, 195, 201, 207, 213, 219, 225, 231, 237, 243, 249, 255, 261, 267, 273, 279, 285, 291, 297, 303, 309, 315, 321, 327, 333, 339, 345, 351, 357, 363, 369, 375, 381, 387],
        lightningDamageMax: [22, 30, 38, 46, 54, 62, 70, 78, 88, 98, 108, 118, 128, 138, 148, 158, 169, 180, 191, 202, 213, 224, 235, 246, 257, 268, 279, 290, 299, 308, 317, 326, 335, 344, 353, 362, 371, 380, 389, 398, 407, 416, 425, 434, 443, 452, 461, 470, 479, 488, 497, 506, 515, 524, 533, 542, 551, 560, 569, 578],
        manaCost: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5],
        range: 12,
        synergies: [
          { skillId: 'chargedboltcontainer', bonusPerLevel: 4, damageType: 'lightning' },
          { skillId: 'telekinesiscontainer', bonusPerLevel: 4, damageType: 'lightning' }
        ]
      },
      lightningcontainer: {
        name: "Lightning",
        type: "lightning",
        lightningDamageMin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lightningDamageMax: [30, 40, 50, 60, 70, 80, 90, 100, 113, 126, 139, 152, 165, 178, 191, 204, 220, 236, 252, 268, 284, 300, 319, 338, 357, 376, 395, 414, 436, 458, 480, 502, 524, 546, 568, 590, 612, 634, 656, 678, 700, 722, 744, 766, 788, 810, 832, 854, 876, 898, 920, 942, 964, 986, 1008, 1030, 1052, 1074, 1096, 1118],
        manaCost: [4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7],
        synergies: [
          { skillId: 'chargedboltcontainer', bonusPerLevel: 6, damageType: 'lightning' },
          { skillId: 'chainlightningcontainer', bonusPerLevel: 6, damageType: 'lightning' }
        ]
      },
      teleportcontainer: {
        name: "Teleport",
        type: "utility",
        manaCost: [24, 23.5, 23, 22.5, 22, 21.5, 21, 20.5, 20, 19.5, 19, 18.5, 18, 17.5, 17, 16.5, 16, 15.5, 15, 14.5, 14, 13.5, 13, 12.5, 12, 11.5, 11, 10.5, 10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        spellDamagePenalty: [50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        penaltyDuration: 1
      },
      chainlightningcontainer: {
        name: "Chain Lightning",
        type: "lightning",
        hits: [5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
        lightningDamageMin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        lightningDamageMax: [40, 53, 66, 79, 92, 105, 118, 131, 147, 163, 179, 195, 211, 227, 243, 259, 278, 297, 316, 335, 354, 373, 395, 417, 439, 461, 483, 505, 530, 555, 580, 605, 630, 655, 680, 705, 730, 755, 780, 805, 830, 855, 880, 905, 930, 955, 980, 1005, 1030, 1055, 1080, 1105, 1130, 1155, 1180, 1205, 1230, 1255, 1280, 1305],
        manaCost: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5],
        synergies: [
          { skillId: 'chargedboltcontainer', bonusPerLevel: 6, damageType: 'lightning' },
          { skillId: 'lightningcontainer', bonusPerLevel: 6, damageType: 'lightning' }
        ]
      },
      thunderstormcontainer: {
        name: "Thunder Storm",
        type: "buff",
        duration: [32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192, 200, 208, 216, 224, 232, 240, 248, 256, 264, 272, 280, 288, 296, 304, 312, 320, 328, 336, 344, 352, 360, 368, 376, 384, 392, 400, 408, 416, 424, 432, 440, 448, 456, 464, 472, 480, 488, 496, 504],
        lightningDamageMin: [1, 3, 5, 7, 9, 11, 13, 15, 18, 21, 24, 27, 30, 33, 36, 39, 43, 47, 51, 55, 59, 63, 68, 73, 78, 83, 88, 93, 99, 105, 111, 117, 123, 129, 135, 141, 147, 153, 159, 165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231, 237, 243, 249, 255, 261, 267, 273, 279, 285],
        lightningDamageMax: [100, 104, 108, 112, 116, 120, 124, 128, 133, 138, 143, 148, 153, 158, 163, 168, 174, 180, 186, 192, 198, 204, 211, 218, 225, 232, 239, 246, 254, 262, 270, 278, 286, 294, 302, 310, 318, 326, 334, 342, 350, 358, 366, 374, 382, 390, 398, 406, 414, 422, 430, 438, 446, 454, 462, 470, 478, 486, 494, 502],
        delayBetweenHits: [2, 1.9, 1.9, 1.8, 1.8, 1.7, 1.7, 1.6, 1.6, 1.5, 1.5, 1.4, 1.4, 1.3, 1.3, 1.2, 1.2, 1.1, 1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        manaCost: 19,
        synergies: [
          { skillId: 'chargedboltcontainer', bonusPerLevel: 8, damageType: 'lightning' },
          { skillId: 'novacontainer', bonusPerLevel: 8, damageType: 'lightning' }
        ]
      },
      energyshieldcontainer: {
        name: "Energy Shield",
        type: "buff",
        duration: [144, 204, 264, 324, 384, 444, 504, 564, 624, 684, 744, 804, 864, 924, 984, 1044, 1104, 1164, 1224, 1284, 1344, 1404, 1464, 1524, 1584, 1644, 1704, 1764, 1824, 1884, 1944, 2004, 2064, 2124, 2184, 2244, 2304, 2364, 2424, 2484, 2544, 2604, 2664, 2724, 2784, 2844, 2904, 2964, 3024, 3084, 3144, 3204, 3264, 3324, 3384, 3444, 3504, 3564, 3624, 3684],
        absorbsDamage: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90],
        manaLossMultiplier: [212, 206, 200, 193, 187, 181, 175, 168, 162, 156, 150, 143, 137, 131, 125, 118, 112, 106, 100, 93, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87],
        manaCost: 5
      },
      lightningmasterycontainer: {
        name: "Lightning Mastery",
        type: "passive",
        lightningDamage: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640]
      },
      // Sorceress Fire Skills
      fireboltcontainer: {
        name: "Fire Bolt",
        type: "fire",
        fireDamageMin: [3, 5, 7, 9, 11, 13, 15, 17, 25, 33, 41, 49, 57, 65, 73, 81, 96, 111, 126, 141, 156, 171, 194, 217, 240, 263, 286, 309, 332, 355, 378, 401, 424, 447, 470, 493, 516, 539, 562, 585, 608, 631, 654, 677, 700, 723, 746, 769, 792, 815, 838, 861, 884, 907, 930, 953, 976, 999, 1022, 1045],
        fireDamageMax: [6, 9, 12, 15, 18, 21, 24, 27, 36, 45, 54, 63, 72, 81, 90, 99, 115, 131, 147, 163, 179, 195, 219, 243, 267, 291, 315, 339, 363, 387, 411, 435, 459, 483, 507, 531, 555, 579, 603, 627, 651, 675, 699, 723, 747, 771, 795, 819, 843, 867, 891, 915, 939, 963, 987, 1011, 1035, 1059, 1083, 1107],
        manaCost: [2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17],
        synergies: [
          { skillId: 'fireballcontainer', bonusPerLevel: 18, damageType: 'fire' },
          { skillId: 'combustioncontainer', bonusPerLevel: 18, damageType: 'fire' }
        ]
      },
      warmthcontainer: {
        name: "Warmth",
        type: "passive",
        manaRecovery: [30, 42, 54, 66, 78, 90, 102, 114, 126, 138, 150, 162, 174, 186, 198, 210, 222, 234, 246, 258, 270, 282, 294, 306, 318, 330, 342, 354, 366, 378, 390, 402, 414, 426, 438, 450, 462, 474, 486, 498, 510, 522, 534, 546, 558, 570, 582, 594, 606, 618, 630, 642, 654, 666, 678, 690, 702, 714, 726, 738],
        attackRating: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610]
      },
      infernocontainer: {
        name: "Inferno",
        type: "fire",
        fireDamageMin: [2, 4, 6, 8, 10, 12, 14, 16, 19, 22, 25, 28, 31, 34, 37, 40, 53, 66, 79, 92, 105, 118, 141, 164, 187, 210, 233, 256, 279, 302, 325, 348, 371, 394, 417, 440, 463, 486, 509, 532, 555, 578, 601, 624, 647, 670, 693, 716, 739, 762, 785, 808, 831, 854, 877, 900, 923, 946, 969, 992],
        fireDamageMax: [3, 6, 9, 12, 15, 18, 21, 24, 29, 34, 39, 44, 49, 54, 59, 64, 79, 94, 109, 124, 139, 154, 179, 204, 229, 254, 279, 304, 329, 354, 379, 404, 429, 454, 479, 504, 529, 554, 579, 604, 629, 654, 679, 704, 729, 754, 779, 804, 829, 854, 879, 904, 929, 954, 979, 1004, 1029, 1054, 1079, 1104],
        enemyFireResist: [-2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -23, -24, -24, -25, -25, -26, -26, -27, -27, -28, -28, -29, -29, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30],
        range: [2, 2, 2.6, 3.3, 4, 4, 4.6, 5.3, 6, 6, 6.6, 7.3, 8, 8, 8.6, 9.3, 10, 10, 10.6, 11.3, 12, 12, 12.6, 13.3, 14, 14, 14.6, 15.3, 16, 16, 16.6, 17.3, 18, 18, 18.6, 19.3, 20, 20, 20.6, 21.3, 22, 22, 22.6, 23.3, 24, 24, 24.6, 25.3, 26, 26, 26.6, 27.3, 28, 28, 28.6, 29.3, 30, 30, 30.6, 31.3],
        manaCost: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30],
        synergies: [
          { skillId: 'blazecontainer', bonusPerLevel: 5, damageType: 'fire' },
          { skillId: 'firewallcontainer', bonusPerLevel: 5, damageType: 'fire' }
        ]
      },
      blazecontainer: {
        name: "Blaze",
        type: "buff",
        fireDamageMin: [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 7, 8, 8, 9, 12, 15, 18, 21, 24, 27, 32, 36, 41, 46, 50, 55, 60, 65, 69, 74, 79, 84, 88, 93, 98, 103, 107, 112, 117, 122, 126, 131, 136, 141, 145, 150, 155, 160, 164, 169, 174, 179, 183, 188, 193, 198, 202, 207],
        fireDamageMax: [1, 1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 18, 21, 25, 29, 32, 36, 41, 46, 52, 57, 62, 68, 73, 78, 84, 89, 94, 100, 105, 110, 116, 121, 126, 132, 137, 142, 148, 153, 158, 164, 169, 174, 180, 185, 190, 196, 201, 206, 212, 217, 222, 228, 233, 238],
        burningDamageMin: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 24, 30, 36, 42, 48, 53, 63, 72, 82, 91, 100, 110, 119, 128, 138, 147, 157, 166, 175, 185, 194, 203, 213, 222, 232, 241, 250, 260, 269, 278, 288, 297, 307, 316, 325, 335, 344, 353, 363, 372, 382, 391, 400, 410],
        burningDamageMax: [2, 3, 4, 5, 7, 8, 9, 10, 12, 15, 17, 19, 22, 24, 26, 29, 36, 43, 50, 57, 64, 71, 82, 92, 103, 113, 124, 134, 145, 155, 166, 176, 187, 198, 208, 219, 229, 240, 250, 261, 271, 282, 292, 303, 314, 324, 335, 345, 356, 366, 377, 387, 398, 408, 419, 430, 440, 451, 461, 472],
        velocity: [33, 35, 37, 38, 40, 41, 41, 42, 43, 43, 44, 44, 45, 45, 45, 46, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 50],
        duration: [3, 3.2, 3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        manaCost: [11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5],
        cooldown: 2,
        cannotBeFrozen: true, // Player is granted Cannot be Frozen during the duration of blaze
        synergies: [
          { skillId: 'firewallcontainer', bonusPerLevel: 6, damageType: 'fire' }
        ]
      },
      firewallcontainer: {
        name: "Fire Wall",
        type: "fire",
        fireDamageMin: [187, 257, 328, 398, 468, 539, 609, 679, 754, 829, 904, 979, 1054, 1129, 1204, 1279, 1359, 1439, 1518, 1598, 1678, 1757, 1842, 1926, 2010, 2095, 2179, 2264, 2353, 2442, 2531, 2620, 2709, 2798, 2887, 2976, 3065, 3154, 3243, 3332, 3421, 3510, 3600, 3689, 3778, 3867, 3956, 4045, 4134, 4223, 4312, 4401, 4490, 4579, 4668, 4757, 4846, 4935, 5025, 5114],
        fireDamageMax: [304, 375, 445, 515, 585, 656, 726, 796, 871, 946, 1021, 1096, 1171, 1246, 1321, 1396, 1476, 1556, 1635, 1715, 1795, 1875, 1959, 2043, 2128, 2212, 2296, 2381, 2470, 2559, 2648, 2737, 2826, 2915, 3004, 3093, 3182, 3271, 3360, 3450, 3539, 3628, 3717, 3806, 3895, 3984, 4073, 4162, 4251, 4340, 4429, 4518, 4607, 4696, 4785, 4875, 4964, 5053, 5142, 5231],
        wallLength: [4, 6, 7, 8, 10, 11, 12, 14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 43, 44, 46, 47, 48, 50, 51, 52, 54, 55, 56, 58, 59, 60, 62, 63, 64, 66, 67, 68, 70, 71, 72, 74, 75, 76, 78, 79, 80, 82, 83],
        manaCost: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
        fireDuration: 3,
        cooldown: 1.5,
        synergies: [
          { skillId: 'blazecontainer', bonusPerLevel: 4, damageType: 'fire' }
        ]
      },
      fireballcontainer: {
        name: "Fire Ball",
        type: "fire",
        fireDamageMin: [6, 12, 19, 25, 32, 38, 45, 51, 63, 74, 86, 97, 109, 120, 132, 143, 157, 171, 185, 199, 213, 227, 244, 260, 277, 293, 310, 326, 345, 364, 383, 402, 421, 440, 459, 478, 497, 516, 535, 554, 573, 592, 611, 630, 649, 668, 687, 706, 725, 744, 763, 782, 801, 820, 839, 858, 877, 896, 915, 934],
        fireDamageMax: [14, 21, 29, 36, 44, 51, 59, 66, 79, 91, 104, 116, 129, 141, 154, 166, 181, 196, 211, 226, 241, 256, 274, 291, 309, 326, 344, 361, 381, 401, 421, 441, 461, 481, 501, 521, 541, 561, 581, 601, 621, 641, 661, 681, 701, 721, 741, 761, 781, 801, 821, 841, 861, 881, 901, 921, 941, 961, 981, 1001],
        manaCost: [5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7],
        radius: [2.6, 2.6, 2.6, 2.6, 2.6, 3.3, 3.3, 3.3, 3.3, 3.3, 4, 4, 4, 4, 4, 4.6, 4.6, 4.6, 4.6, 4.6, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3],
        synergies: [
          { skillId: 'fireboltcontainer', bonusPerLevel: 15, damageType: 'fire' },
          { skillId: 'combustioncontainer', bonusPerLevel: 15, damageType: 'fire' }
        ]
      },
      lesserhydracontainer: {
        name: "Lesser Hydra",
        type: "fire",
        fireDamageMin: [3, 6, 9, 12, 15, 18, 21, 24, 31, 38, 45, 52, 59, 66, 73, 80, 92, 104, 116, 128, 140, 152, 169, 186, 203, 220, 237, 254, 271, 288, 305, 322, 339, 356, 373, 390, 407, 424, 441, 458, 475, 492, 509, 526, 543, 560, 577, 594, 611, 628, 645, 662, 679, 696, 713, 730, 747, 764, 781, 798],
        fireDamageMax: [6, 10, 14, 18, 22, 26, 30, 34, 42, 50, 58, 66, 74, 82, 90, 98, 111, 124, 137, 150, 163, 176, 194, 212, 230, 248, 266, 284, 302, 320, 338, 356, 374, 392, 410, 428, 446, 464, 482, 500, 518, 536, 554, 572, 590, 608, 626, 644, 662, 680, 698, 716, 734, 752, 770, 788, 806, 824, 842, 860],
        manaCost: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5],
        duration: 6,
        synergies: [
          { skillId: 'fireboltcontainer', bonusPerLevel: 12, damageType: 'fire' },
          { skillId: 'hydracontainer', bonusPerLevel: 12, damageType: 'fire' }
        ]
      },
      enchantfirecontainer: {
        name: "Enchant Fire",
        type: "buff",
        fireDamageMin: [12, 15, 18, 21, 24, 27, 30, 33, 39, 45, 51, 57, 63, 69, 75, 81, 91, 101, 111, 121, 131, 141, 158, 175, 192, 209, 226, 243, 268, 293, 318, 343, 368, 393, 418, 443, 468, 493, 518, 543, 568, 593, 618, 643, 668, 693, 718, 743, 768, 793, 818, 843, 868, 893, 918, 943, 968, 993, 1018, 1043],
        fireDamageMax: [17, 21, 25, 29, 33, 37, 41, 45, 52, 59, 66, 73, 80, 87, 94, 101, 112, 123, 134, 145, 156, 167, 185, 203, 221, 239, 257, 275, 301, 327, 353, 379, 405, 431, 457, 483, 509, 535, 561, 587, 613, 639, 665, 691, 717, 743, 769, 795, 821, 847, 873, 899, 925, 951, 977, 1003, 1029, 1055, 1081, 1107],
        attackRating: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315],
        manaCost: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
        duration: 300,
        synergies: [
          { skillId: 'warmthcontainer', bonusPerLevel: 20, damageType: 'fire' }
        ]
      },
      meteorcontainer: {
        name: "Meteor",
        type: "fire",
        damageMin: [25, 32, 39, 46, 53, 60, 67, 74, 84, 94, 104, 114, 124, 134, 144, 154, 167, 180, 193, 206, 219, 232, 247, 262, 277, 292, 307, 322, 339, 356, 373, 390, 407, 424, 441, 458, 475, 492, 509, 526, 543, 560, 577, 594, 611, 628, 645, 662, 679, 696, 713, 730, 747, 764, 781, 798, 815, 832, 849, 866],
        damageMax: [30, 39, 48, 57, 66, 75, 84, 93, 105, 117, 129, 141, 153, 165, 177, 189, 204, 219, 234, 249, 264, 279, 297, 315, 333, 351, 369, 387, 408, 429, 450, 471, 492, 513, 534, 555, 576, 597, 618, 639, 660, 681, 702, 723, 744, 765, 786, 807, 828, 849, 870, 891, 912, 933, 954, 975, 996, 1017, 1038, 1059],
        fireDamageMin: [25, 32, 39, 46, 53, 60, 67, 74, 84, 94, 104, 114, 124, 134, 144, 154, 167, 180, 193, 206, 219, 232, 247, 262, 277, 292, 307, 322, 339, 356, 373, 390, 407, 424, 441, 458, 475, 492, 509, 526, 543, 560, 577, 594, 611, 628, 645, 662, 679, 696, 713, 730, 747, 764, 781, 798, 815, 832, 849, 866],
        fireDamageMax: [30, 39, 48, 57, 66, 75, 84, 93, 105, 117, 129, 141, 153, 165, 177, 189, 204, 219, 234, 249, 264, 279, 297, 315, 333, 351, 369, 387, 408, 429, 450, 471, 492, 513, 534, 555, 576, 597, 618, 639, 660, 681, 702, 723, 744, 765, 786, 807, 828, 849, 870, 891, 912, 933, 954, 975, 996, 1017, 1038, 1059],
        burningDamageMin: [17, 19, 22, 24, 26, 29, 31, 33, 37, 41, 44, 48, 51, 55, 58, 62, 66, 71, 76, 80, 85, 90, 96, 101, 107, 113, 119, 125, 132, 139, 146, 153, 160, 167, 174, 181, 188, 195, 202, 209, 216, 223, 230, 237, 244, 251, 258, 266, 273, 280, 287, 294, 301, 308, 315, 322, 329, 336, 343, 350],
        burningDamageMax: [23, 25, 28, 30, 32, 35, 37, 39, 43, 46, 50, 53, 57, 60, 64, 67, 72, 77, 82, 86, 91, 96, 101, 107, 113, 119, 125, 131, 138, 145, 152, 159, 166, 173, 180, 187, 194, 201, 208, 215, 222, 229, 236, 243, 250, 257, 264, 271, 278, 285, 292, 300, 307, 314, 321, 328, 335, 342, 349, 356],
        manaCost: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5],
        cooldown: 0.5,
        radius: 6.66,
        synergies: [
          { skillId: 'fireballcontainer', bonusPerLevel: 6, damageType: 'damage' },
          { skillId: 'blazecontainer', bonusPerLevel: 6, damageType: 'damage' },
          { skillId: 'infernocontainer', bonusPerLevel: 6, damageType: 'damage' }
        ]
      },
      combustioncontainer: {
        name: "Combustion",
        type: "fire",
        fireDamageMin: [12, 18, 24, 30, 36, 42, 48, 54, 62, 70, 78, 86, 94, 102, 110, 118, 128, 138, 148, 158, 168, 178, 190, 202, 214, 226, 238, 250, 264, 278, 292, 306, 320, 334, 348, 362, 376, 390, 404, 418, 432, 446, 460, 474, 488, 502, 516, 530, 544, 558, 572, 586, 600, 614, 628, 642, 656, 670, 684, 698],
        fireDamageMax: [28, 35, 42, 49, 56, 63, 70, 77, 86, 95, 104, 113, 122, 131, 140, 149, 160, 171, 182, 193, 204, 215, 228, 241, 254, 267, 280, 293, 308, 323, 338, 353, 368, 383, 398, 413, 428, 443, 458, 473, 488, 503, 518, 533, 548, 563, 578, 593, 608, 623, 638, 653, 668, 683, 698, 713, 728, 743, 758, 773],
        manaCost: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
        cooldown: 3,
        synergies: [
          { skillId: 'fireboltcontainer', bonusPerLevel: 12, damageType: 'fire' },
          { skillId: 'fireballcontainer', bonusPerLevel: 12, damageType: 'fire' }
        ]
      },
      hydracontainer: {
        name: "Hydra",
        type: "fire",
        fireDamageMin: [42, 50, 58, 66, 74, 82, 90, 98, 109, 121, 132, 144, 155, 167, 178, 190, 205, 221, 236, 252, 267, 283, 302, 321, 340, 359, 378, 397, 419, 441, 463, 485, 507, 529, 551, 573, 595, 617, 639, 661, 683, 705, 727, 749, 771, 793, 815, 837, 859, 881, 903, 925, 947, 969, 991, 1013, 1035, 1057, 1079, 1101],
        fireDamageMax: [58, 68, 78, 88, 98, 108, 118, 128, 141, 153, 166, 178, 191, 203, 216, 228, 246, 263, 281, 298, 316, 333, 354, 374, 395, 415, 436, 456, 480, 503, 527, 550, 574, 597, 621, 644, 668, 691, 715, 738, 762, 785, 809, 832, 856, 879, 903, 926, 950, 973, 997, 1020, 1044, 1067, 1091, 1114, 1138, 1161, 1185, 1208],
        manaCost: [20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45, 45.5, 46, 46.5, 47, 47.5, 48, 48.5, 49, 49.5],
        duration: 6,
        synergies: [
          { skillId: 'fireboltcontainer', bonusPerLevel: 6, damageType: 'fire' },
          { skillId: 'lesserhydracontainer', bonusPerLevel: 6, damageType: 'fire' }
        ]
      },
      firemasterycontainer: {
        name: "Fire Mastery",
        type: "passive",
        fireDamage: [20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256],
        enemyFireResist: [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30, -30]
      },
      // Sorceress Cold Skills
      iceboltcontainer: {
        name: "Ice Bolt",
        type: "cold",
        coldDamageMin: [3, 5, 7, 9, 11, 13, 15, 17, 22, 28, 33, 39, 44, 50, 55, 61, 74, 87, 100, 113, 126, 139, 125, 145, 166, 186, 207, 227, 255, 283, 311, 339, 367, 395, 423, 451, 479, 507, 535, 563, 591, 619, 647, 675, 703, 731, 759, 787, 815, 843, 871, 899, 927, 955, 983, 1011, 1039, 1067, 1095, 1123],
        coldDamageMax: [5, 8, 11, 14, 17, 20, 23, 26, 33, 40, 47, 54, 61, 68, 75, 82, 100, 118, 136, 154, 172, 190, 213, 241, 269, 297, 325, 353, 391, 430, 468, 507, 545, 584, 622, 661, 699, 738, 776, 815, 853, 892, 930, 969, 1007, 1046, 1084, 1123, 1161, 1200, 1238, 1277, 1315, 1354, 1392, 1431, 1469, 1508, 1546, 1585],
        coldLength: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.2, 9.6, 10, 10.4, 10.8, 11.2, 11.6, 12, 12.4, 12.8, 13.2, 13.6, 14, 14.4, 14.8, 15.2, 15.6, 16, 16.4, 16.8, 17.2, 17.6, 18, 18.4, 18.8, 19.2, 19.6, 20, 20.4, 20.8, 21.2, 21.6, 22, 22.4, 22.8, 23.2, 23.6, 24, 24.4, 24.8, 25.2, 25.6, 26, 26.4, 26.8, 27.2, 27.6, 28, 28.4, 28.8, 29.2, 29.6],
        manaCost: [2, 2.2, 2.5, 2.7, 3, 3.2, 3.5, 3.7, 4, 4.2, 4.5, 4.7, 5, 5.2, 5.5, 5.7, 6, 6.2, 6.5, 6.7, 7, 7.2, 7.5, 7.7, 8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7],
        synergies: [
          { skillId: 'iceblastcontainer', bonusPerLevel: 20, damageType: 'cold' },
          { skillId: 'glacialspikecontainer', bonusPerLevel: 20, damageType: 'cold' }
        ]
      },
      coldenchantcontainer: {
        name: "Cold Enchant",
        type: "buff",
        coldDamageMin: [3, 4, 6, 7, 9, 10, 12, 13, 18, 22, 27, 31, 36, 40, 45, 49, 59, 70, 80, 91, 101, 112, 131, 151, 170, 190, 209, 229, 258, 286, 315, 343, 372, 400, 429, 457, 486, 514, 543, 571, 600, 628, 657, 685, 714, 742, 771, 799, 828, 856, 885, 913, 942, 970, 999, 1027, 1056, 1084, 1113, 1141],
        coldDamageMax: [4, 6, 9, 11, 14, 16, 19, 21, 27, 32, 38, 43, 49, 54, 60, 65, 76, 88, 99, 111, 122, 134, 154, 175, 195, 216, 236, 257, 287, 316, 346, 375, 405, 434, 464, 493, 523, 552, 582, 611, 641, 670, 700, 729, 759, 788, 818, 847, 877, 906, 936, 965, 995, 1024, 1054, 1083, 1113, 1142, 1172, 1201],
        attackRating: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610],
        manaCost: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
        duration: 300,
        synergies: [
          { skillId: 'chillingarmorcontainer', bonusPerLevel: 26, damageType: 'cold' }
        ]
      },
      frostnovacontainer: {
        name: "Frost Nova",
        type: "cold",
        coldDamageMin: [4, 6, 8, 10, 12, 14, 16, 18, 25, 32, 39, 46, 53, 60, 67, 74, 86, 98, 110, 122, 134, 146, 161, 176, 191, 206, 221, 236, 253.5, 271, 288.5, 306, 323.5, 341, 358.5, 376, 393.5, 411, 428.5, 446, 463.5, 481, 498.5, 516, 533.5, 551, 568.5, 586, 603.5, 621, 638.5, 656, 673.5, 691, 708.5, 726, 743.5, 761, 778.5, 796],
        coldDamageMax: [5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 30, 37.5, 45, 52.5, 60, 67.5, 75, 82.5, 95, 107.5, 120, 132.5, 145, 157.5, 173, 188.5, 204, 219.5, 235, 250.5, 268.5, 286.5, 304.5, 322.5, 340.5, 358.5, 376.5, 394.5, 412.5, 430.5, 448.5, 466.5, 484.5, 502.5, 520.5, 538.5, 556.5, 574.5, 592.5, 610.5, 628.5, 646.5, 664.5, 682.5, 700.5, 718.5, 736.5, 754.5, 772.5, 790.5, 808.5, 826.5],
        coldLength: [8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8, 16, 16.2, 16.4, 16.6, 16.8, 17, 17.2, 17.4, 17.6, 17.8, 18, 18.2, 18.4, 18.6, 18.8, 19, 19.2, 19.4, 19.6, 19.8],
        manaCost: [8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7, 21, 21.2, 21.5, 21.7, 22, 22.2, 22.5, 22.7],
        synergies: [
          { skillId: 'iceboltcontainer', bonusPerLevel: 6, damageType: 'cold' },
          { skillId: 'shiverarmorcontainer', bonusPerLevel: 6, damageType: 'cold' }
        ]
      },
      iceblastcontainer: {
        name: "Ice Blast",
        type: "cold",
        coldDamageMin: [5, 11, 17, 23, 29, 35, 41, 47, 59, 71, 83, 95, 107, 119, 131, 143, 164, 185, 206, 227, 248, 269, 297, 325, 353, 381, 409, 439, 472, 507, 542, 577, 612, 647, 682, 717, 752, 787, 822, 857, 892, 927, 962, 997, 1032, 1067, 1102, 1137, 1172, 1207, 1242, 1277, 1312, 1347, 1382, 1417, 1452, 1487, 1522, 1557],
        coldDamageMax: [8, 15, 22, 29, 36, 43, 50, 57, 71, 85, 99, 113, 127, 141, 155, 169, 190, 212, 233, 255, 276, 298, 326, 355, 383, 412, 440, 469, 504, 540, 575, 611, 646, 682, 717, 753, 788, 824, 859, 895, 930, 966, 1001, 1037, 1072, 1108, 1143, 1179, 1214, 1250, 1285, 1321, 1356, 1392, 1427, 1463, 1498, 1534, 1569, 1605],
        freezeDuration: [2, 2, 2.1, 2.2, 2.3, 2.4, 2.4, 2.5, 2.6, 2.7, 2.8, 2.8, 2.9, 3, 3.1, 3.2, 3.2, 3.3, 3.4, 3.5, 3.6, 3.6, 3.7, 3.8, 3.9, 4, 4, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 5, 5.1, 5.2, 5.2, 5.3, 5.4, 5.5, 5.6, 5.6, 5.7, 5.8, 5.9, 6, 6, 6.1, 6.2, 6.3, 6.4, 6.4, 6.5, 6.6, 6.7],
        manaCost: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5],
        synergies: [
          { skillId: 'iceboltcontainer', bonusPerLevel: 6, damageType: 'cold' },
          { skillId: 'glacialspikecontainer', bonusPerLevel: 6, damageType: 'cold' }
        ]
      },
      chillingarmorcontainer: {
        name: "Chilling Armor",
        type: "cold",
        defenseBonus: [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340],
        duration: [240, 243, 246, 249, 252, 255, 258, 261, 264, 267, 270, 273, 276, 279, 282, 285, 288, 291, 294, 297, 300, 303, 306, 309, 312, 315, 318, 321, 324, 327, 330, 333, 336, 339, 342, 345, 348, 351, 354, 357, 360, 363, 366, 369, 372, 375, 378, 381, 384, 387, 390, 393, 396, 399, 402, 405, 408, 411, 414, 417],
        coldDamageMin: [5, 6, 8, 9, 11, 12, 14, 15, 18, 21, 24, 27, 30, 33, 36, 39, 44, 48, 53, 57, 62, 66, 72, 78, 84, 90, 96, 102, 110, 117, 125, 132, 140, 147, 155, 162, 170, 177, 185, 192, 200, 207, 215, 222, 230, 237, 245, 252, 260, 267, 275, 282, 290, 297, 305, 312, 320, 327, 335, 342],
        coldDamageMax: [7, 9, 11, 13, 15, 17, 19, 21, 25, 28, 32, 35, 39, 42, 46, 49, 54, 59, 64, 69, 74, 79, 86, 92, 99, 105, 112, 118, 126, 134, 142, 150, 158, 166, 174, 182, 190, 198, 206, 214, 222, 230, 238, 246, 254, 262, 270, 278, 286, 294, 302, 310, 318, 326, 334, 342, 350, 358, 366, 374],
        coldLength: [4, 4.2, 4.4, 4.6, 4.8, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8],
        manaCost: 17,
        synergies: [
          { skillId: 'coldenchantcontainer', bonusPerLevel: 20, damageType: 'cold' }
        ]
      },
      shiverarmorcontainer: {
        name: "Shiver Armor",
        type: "buff",
        duration: [180, 183, 186, 189, 192, 195, 198, 201, 204, 207, 210, 213, 216, 219, 222, 225, 228, 231, 234, 237, 240, 243, 246, 249, 252, 255, 258, 261, 264, 267, 270, 273, 276, 279, 282, 285, 288, 291, 294, 297, 300, 303, 306, 309, 312, 315, 318, 321, 324, 327, 330, 333, 336, 339, 342, 345, 348, 351, 354, 357],
        defenseBonus: [45, 51, 57, 63, 69, 75, 81, 87, 93, 99, 105, 111, 117, 123, 129, 135, 141, 147, 153, 159, 165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231, 237, 243, 249, 255, 261, 267, 273, 279, 285, 291, 297, 303, 309, 315, 321, 327, 333, 339, 345, 351, 357, 363, 369, 375, 381, 387, 393, 399],
        coldDamageMin: [8, 10, 13, 15, 18, 20, 23, 25, 29, 33, 37, 41, 45, 49, 53, 57, 63, 68, 74, 79, 85, 90, 97, 104, 111, 118, 125, 132, 141, 149, 158, 166, 175, 183, 192, 200, 209, 217, 226, 234, 243, 251, 260, 268, 277, 285, 294, 302, 311, 319, 328, 336, 345, 353, 362, 370, 379, 387, 396, 404],
        coldDamageMax: [10, 13, 16, 19, 22, 25, 28, 31, 35, 40, 44, 49, 53, 58, 62, 67, 73, 79, 85, 91, 97, 103, 111, 118, 126, 133, 141, 148, 157, 166, 175, 184, 193, 202, 211, 220, 229, 238, 247, 256, 265, 274, 283, 292, 301, 310, 319, 328, 337, 346, 355, 364, 373, 382, 391, 400, 409, 418, 427, 436],
        coldLength: [4, 4.2, 4.4, 4.6, 4.8, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8],
        manaCost: 11,
        synergies: [
          { skillId: 'coldenchantcontainer', bonusPerLevel: 20, damageType: 'cold' }
        ]
      },
      glacialspikecontainer: {
        name: "Glacial Spike",
        type: "cold",
        coldDamageMin: [20, 27, 34, 41, 48, 55, 62, 69, 82, 95, 108, 121, 134, 147, 160, 173, 187, 201, 215, 229, 243, 257, 272, 287, 302, 317, 332, 347, 363, 379, 395, 411, 427, 443, 459, 475, 491, 507, 523, 539, 555, 571, 587, 603, 619, 635, 651, 667, 683, 699, 715, 731, 747, 763, 779, 795, 811, 827, 843, 859],
        coldDamageMax: [28, 35, 43, 50, 58, 65, 73, 80, 94, 107, 121, 134, 148, 161, 175, 188, 203, 217, 232, 246, 261, 275, 291, 306, 322, 337, 353, 368, 385, 401, 418, 434, 451, 467, 484, 500, 517, 533, 550, 566, 583, 599, 616, 632, 649, 665, 682, 698, 715, 731, 748, 764, 781, 797, 814, 830, 847, 863, 880, 896],
        manaCost: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5],
        synergies: [
          { skillId: 'iceboltcontainer', bonusPerLevel: 8, damageType: 'cold' },
          { skillId: 'iceblastcontainer', bonusPerLevel: 8, damageType: 'cold' },
          { skillId: 'blizzardcontainer', bonusPerLevel: 8, damageType: 'freezeLength' }
        ]
      },
      icebarragecontainer: {
        name: "Ice Barrage",
        type: "cold",
        coldDamageMin: [16, 18, 21, 23, 26, 28, 31, 33, 38, 42, 47, 51, 56, 60, 65, 69, 76, 82, 89, 95, 102, 108, 117, 125, 134, 142, 151, 159, 170, 180, 191, 201, 212, 222, 233, 243, 254, 264, 275, 285, 296, 306, 317, 327, 338, 348, 359, 369, 380, 390, 401, 411, 422, 432, 443, 453, 464, 474, 485, 495],
        coldDamageMax: [23, 26, 29, 32, 35, 38, 41, 44, 49, 54, 59, 64, 69, 74, 79, 84, 91, 98, 105, 112, 119, 126, 135, 144, 153, 162, 171, 180, 191, 202, 213, 224, 235, 246, 257, 268, 279, 290, 301, 312, 323, 334, 345, 356, 367, 378, 389, 400, 411, 422, 433, 444, 455, 466, 477, 488, 499, 510, 521, 532],
        manaCost: [8, 8.2, 8.5, 8.7, 9, 9.2, 9.5, 9.7, 10, 10.2, 10.5, 10.7, 11, 11.2, 11.5, 11.7, 12, 12.2, 12.5, 12.7, 13, 13.2, 13.5, 13.7, 14, 14.2, 14.5, 14.7, 15, 15.2, 15.5, 15.7, 16, 16.2, 16.5, 16.7, 17, 17.2, 17.5, 17.7, 18, 18.2, 18.5, 18.7, 19, 19.2, 19.5, 19.7, 20, 20.2, 20.5, 20.7, 21, 21.2, 21.5, 21.7, 22, 22.2, 22.5, 22.7],
        iceLances: [3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
      },
      blizzardcontainer: {
        name: "Blizzard",
        type: "cold",
        coldDamageMin: [17, 22, 27, 32, 37, 42, 47, 52, 58, 64, 70, 76, 82, 88, 94, 100, 108, 116, 124, 132, 140, 148, 158, 168, 178, 188, 198, 208, 222, 236, 250, 264, 278, 292, 306, 320, 334, 348, 362, 376, 390, 404, 418, 432, 446, 460, 474, 488, 502, 516, 530, 544, 558, 572, 586, 600, 614, 628, 642, 656],
        coldDamageMax: [24, 31, 38, 45, 52, 59, 66, 73, 81, 89, 97, 105, 113, 121, 129, 137, 148, 159, 170, 181, 192, 203, 217, 231, 245, 259, 273, 287, 306, 325, 344, 363, 382, 401, 420, 439, 458, 477, 496, 515, 534, 553, 572, 591, 610, 629, 648, 667, 686, 705, 724, 743, 762, 781, 800, 819, 838, 857, 876, 895],
        manaCost: [13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5],
        radius: 5.33,
        duration: 2,
        cooldown: 0.9,
        synergies: [
          { skillId: 'iceboltcontainer', bonusPerLevel: 12, damageType: 'cold' },
          { skillId: 'iceblastcontainer', bonusPerLevel: 12, damageType: 'cold' }
        ]
      },
      frozenorbcontainer: {
        name: "Frozen Orb",
        type: "cold",
        coldDamageMin: [40, 41, 43, 44, 46, 47, 49, 50, 55, 59, 64, 68, 73, 77, 82, 86, 94, 101, 109, 116, 124, 131, 142, 152, 163, 173, 184, 194, 208, 222, 236, 250, 264, 278, 292, 306, 320, 334, 348, 362, 376, 390, 404, 418, 432, 446, 460, 474, 488, 502, 516, 530, 544, 558, 572, 586, 600, 614, 628, 642],
        coldDamageMax: [45, 47, 50, 52, 55, 57, 60, 62, 68, 73, 79, 84, 90, 95, 101, 106, 115, 123, 132, 140, 149, 157, 169, 180, 192, 203, 215, 226, 241, 256, 271, 286, 301, 316, 331, 346, 361, 376, 391, 406, 421, 436, 451, 466, 481, 496, 511, 526, 541, 556, 571, 586, 601, 616, 631, 646, 661, 676, 691, 706],
        coldLength: [8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11, 11.2, 11.4, 11.6, 11.8, 12, 12.2, 12.4, 12.6, 12.8, 13, 13.2, 13.4, 13.6, 13.8, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.4, 15.6, 15.8, 16, 16.2, 16.4, 16.6, 16.8, 17, 17.2, 17.4, 17.6, 17.8, 18, 18.2, 18.4, 18.6, 18.8, 19, 19.2, 19.4, 19.6, 19.8],
        manaCost: [14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5],
        synergies: [
          { skillId: 'iceboltcontainer', bonusPerLevel: 4, damageType: 'cold' },
          { skillId: 'frostnovacontainer', bonusPerLevel: 4, damageType: 'cold' }
        ]
      },
      coldmasterycontainer: {
        name: "Cold Mastery",
        type: "passive",
        coldDamage: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128],
        enemyColdResist: [-5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, -40, -41, -42, -43, -44, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45]
      },
    };

    this.init();
  }

  init() {
    this.createContainers();
    this.populateSkills();
    this.setupEvents();
    this.createPointsDisplay();
    this.createSkillCalculator();
    this.updateSkillMaxValues(); // Set initial max values based on starting level
    this.updateSkillVisuals(); // Set initial visual state based on prerequisites
    //('✅ Skills System ready');
  }

  createContainers() {
    // Define container titles for each class
    var classTitles = {
      'Amazon': [{
        id: 'javelinandspearskillscontainer',
        title: 'Javelin & Spear Skills'
      },
      {
        id: 'passiveskillscontainer',
        title: 'Passive & Magic Skills'
      },
      {
        id: 'bowandcrossbowskillscontainer',
        title: 'Bow & Crossbow Skills'
      }
      ],
      'Assassin': [{
        id: 'martialartscontainer',
        title: 'Martial Arts'
      },
      {
        id: 'shadowdisciplinescontainer',
        title: 'Shadow Disciplines'
      },
      {
        id: 'trapscontainer',
        title: 'Traps'
      }
      ],
      'Barbarian': [{
        id: 'warcriescontainer',
        title: 'Warcries'
      },
      {
        id: 'combatmasteriescontainer',
        title: 'Combat Masteries'
      },
      {
        id: 'combatskillsbarcontainer',
        title: 'Combat Skills'
      }
      ],
      'Druid': [{
        id: 'elementalskillscontainer',
        title: 'Elemental Skills'
      },
      {
        id: 'shapeshiftingskillscontainer',
        title: 'Shapeshifting Skills'
      },
      {
        id: 'summoningskillscontainer',
        title: 'Summoning Skills'
      }
      ],
      'Necromancer': [{
        id: 'summoningspellsneccontainer',
        title: 'Summoning Spells'
      },
      {
        id: 'poisonandbonespellscontainer',
        title: 'Poison & Bone Spells'
      },
      {
        id: 'cursescontainer',
        title: 'Curses'
      }
      ],
      'Paladin': [{
        id: 'defensiveaurascontainer',
        title: 'Defensive Auras'
      },
      {
        id: 'offensiveaurascontainer',
        title: 'Offensive Auras'
      },
      {
        id: 'combatskillspalcontainer',
        title: 'Combat Skills'
      }
      ],
      'Sorceress': [{
        id: 'coldspellscontainer',
        title: 'Cold Spells'
      },
      {
        id: 'lightningspellscontainer',
        title: 'Lightning Spells'
      },
      {
        id: 'firespellscontainer',
        title: 'Fire Spells'
      }
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
        self.updateSkillMaxValues(); // Update all skill input max attributes immediately
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
        setTimeout(function () {
          self.updateSkillDropdown();
        }, 100);
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
        self.scheduleCalculation();
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

    setTimeout(function () {
      self.updateSkillDropdown();
    }, 333);
  }

  // Lightweight calculation scheduler to avoid spam
  scheduleCalculation() {
    var self = this;
    if (self.calculationTimer) {
      clearTimeout(self.calculationTimer);
    }
    self.calculationTimer = setTimeout(function () {
      self.calculateSkillDamage();
      if (window.unifiedSocketSystem && typeof window.unifiedSocketSystem.calculateAllStats === 'function') {
        window.unifiedSocketSystem.calculateAllStats();
        window.unifiedSocketSystem.updateStatsDisplay();
      }
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
      'penetratecontainer', // Penetrate
      'clawanddaggermasterycontainer', // Claw and Dagger Mastery
      'generalmasterycontainer', // General Mastery
      'throwingmasterycontainer', // Throwing Mastery
      'polearmandspearmasterycontainer', // Polearm and Spear Mastery
      'combatreflexescontainer', // Combat Reflexes
      'ironskinscontainer', // Iron Skin
      'increasedspeedcontainer', // Increased Speed
      'naturalresistancecontainer', // Natural Resistance
      'deepwoundscontainer', // Deep Wounds
      'lycantropycontainer', // Lycanthropy
      'skeletonmasterycontainer', // Skeleton Mastery
      'cursemasterycontainer', // Curse Mastery (passive skill)
      'golemmasterycontainer', // Golem Mastery (passive skill)
      'lightningmasterycontainer', // Lightning Mastery (passive skill)
      'warmthcontainer', // Warmth (passive skill)
      'firemasterycontainer', // Fire Mastery (passive skill)
      'coldmasterycontainer' // Cold Mastery (passive skill)
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
          var isSkillInTree = skillsInTree.some(function (s) {
            return s.id === skillId;
          });
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

  getSkillTotalLevel(skillId) {
    const input = document.getElementById(skillId);
    if (!input || parseInt(input.value) === 0) return 0;

    let total = parseInt(input.value);
    total += (this.skillBonuses.allSkills || 0);
    total += (this.skillBonuses.classSkills || 0);

    const currentClassSkills = this.classSkillTrees[this.currentClass] || {};
    Object.keys(currentClassSkills).forEach(containerId => {
      if (currentClassSkills[containerId].some(s => s.id === skillId)) {
        total += (this.skillBonuses.treeSkills[containerId] || 0);
      }
    });

    return total;
  }

  getDeepWoundsChance() {
    var level = this.getSkillTotalLevel('deepwoundscontainer');
    if (level === 0) return 0;
    var data = this.skillData.deepwoundscontainer.openWoundsChance;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getDeepWoundsDamage() {
    var level = this.getSkillTotalLevel('deepwoundscontainer');
    if (level === 0) return 0;
    var data = this.skillData.deepwoundscontainer.openWoundsDamage;
    var baseDamage = data[Math.min(level - 1, data.length - 1)] || 0;

    // Apply synergies (e.g. Grim Ward +4% per level)
    var synergyBonus = this.calculateSynergyBonus('deepwoundscontainer', 'owdmg');
    return Math.floor(baseDamage * (1 + synergyBonus / 100));
  }

  getHungerChance() {
    var level = this.getSkillTotalLevel('hungercontainer');
    if (level === 0) return 0;
    var data = this.skillData.hungercontainer.openWoundsChance;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }
  getHungerDamage() {
    var level = this.getSkillTotalLevel('hungercontainer');
    if (level === 0) return 0;
    var data = this.skillData.hungercontainer.openWoundsDamage;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getThornsOpenWoundsChance() {
    var level = this.getSkillTotalLevel('thornscontainer');
    if (level === 0) return 0;
    var data = this.skillData.thornscontainer.openWoundsChance;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getThornsOpenWoundsDamage() {
    var level = this.getSkillTotalLevel('thornscontainer');
    if (level === 0) return 0;
    var data = this.skillData.thornscontainer.yourOpenWoundsDamage;
    var baseDamage = data[Math.min(level - 1, data.length - 1)] || 0;

    // Apply synergies (Might and Defiance +20% per level)
    var synergyBonus = this.calculateSynergyBonus('thornscontainer', 'damage');
    return Math.floor(baseDamage * (1 + synergyBonus / 100));
  }

  getNaturalResistanceBonus() {
    var level = this.getSkillTotalLevel('naturalresistancecontainer');
    if (level === 0) return 0;
    var data = this.skillData.naturalresistancecontainer.allResistances;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getIronSkinDefenseBonus() {
    var level = this.getSkillTotalLevel('ironskinscontainer');
    if (level === 0) return 0;
    var data = this.skillData.ironskinscontainer.defense;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getShoutDefenseBonus() {
    var level = this.getSkillTotalLevel('shoutcontainer');
    if (level === 0) return 0;
    var data = this.skillData.shoutcontainer.defenseBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getBoneArmorDefenseBonus() {
    var level = this.getSkillTotalLevel('bonearmorcontainer');
    if (level === 0) return 0;
    var data = this.skillData.bonearmorcontainer.defenseBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getCloakOfShadowsDefenseBonus() {
    var level = this.getSkillTotalLevel('cloakofshadowscontainer');
    if (level === 0) return 0;
    var data = this.skillData.cloakofshadowscontainer.defenseBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getIronSkinPDRBonus() {
    var level = this.getSkillTotalLevel('ironskinscontainer');
    if (level === 0) return 0;
    var data = this.skillData.ironskinscontainer.physicalDamageReduction;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getBoneArmorAbsorption() {
    var level = this.getSkillTotalLevel('bonearmorcontainer');
    if (level === 0) return 0;
    var data = this.skillData.bonearmorcontainer.physicalDamageAbsorbed;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }


  getIncreasedSpeedFRW() {
    var level = this.getSkillTotalLevel('increasedspeedcontainer');
    if (level === 0) return 0;
    var data = this.skillData.increasedspeedcontainer.movementSpeed;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getIncreasedSpeedIAS() {
    var level = this.getSkillTotalLevel('increasedspeedcontainer');
    if (level === 0) return 0;
    var data = this.skillData.increasedspeedcontainer.increasedAttackSpeed;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getCombatReflexesFHR() {
    var level = this.getSkillTotalLevel('combatreflexescontainer');
    if (level === 0) return 0;
    var data = this.skillData.combatreflexescontainer.fasterHitRecovery;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getCombatReflexesLifeBonus() {
    var level = this.getSkillTotalLevel('combatreflexescontainer');
    if (level === 0) return 0;
    var data = this.skillData.combatreflexescontainer.life;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getOakSageLifeBonus() {
    var level = this.getSkillTotalLevel('oaksagecontainer');
    if (level === 0) return 0;
    var data = this.skillData.oaksagecontainer.lifeBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getOakSageLifeReplenish() {
    var level = this.getSkillTotalLevel('oaksagecontainer');
    if (level === 0) return 0;
    var base = this.skillData.oaksagecontainer.lifeReplenish[Math.min(level - 1, 59)] || 0;
    var synergy = this.calculateSynergyBonus('oaksagecontainer', 'healing') || 0;
    return base + synergy;
  }

  getBattleOrdersLifeBonus() {
    var level = this.getSkillTotalLevel('battleorderscontainer');
    if (level === 0) return 0;
    var data = this.skillData.battleorderscontainer.lifeBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getBattleOrdersManaBonus() {
    var level = this.getSkillTotalLevel('battleorderscontainer');
    if (level === 0) return 0;
    var data = this.skillData.battleorderscontainer.manaBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getBattleCommandSkills() {
    var totalLevel = this.getSkillTotalLevel('battlecommandcontainer');
    if (totalLevel === 0) return 0;

    var levelInput = document.getElementById('battlecommandcontainer');
    var baseLevel = levelInput ? (parseInt(levelInput.value) || 0) : 0;
    var data = this.skillData.battlecommandcontainer.bonusSkills;

    // PD2 Battle Command bonus depends strictly on base points: 
    // - Always +1 if skill is active (even from Oskills)
    // - +2 at level 10 base
    // - +3 at level 20 base
    var effectiveLookupLevel = Math.max(1, baseLevel);
    return data[Math.min(effectiveLookupLevel - 1, data.length - 1)] || 1;
  }

  getBattleCommandDamageBonus() {
    var level = this.getSkillTotalLevel('battlecommandcontainer');
    if (level === 0) return 0;
    var data = this.skillData.battlecommandcontainer.damageBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getHeartOfWolverineDamageBonus() {
    var level = this.getSkillTotalLevel('heartofwolverinecontainer');
    if (level === 0) return 0;
    var data = this.skillData.heartofwolverinecontainer.damageBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getHeartOfWolverineARBonus() {
    var level = this.getSkillTotalLevel('heartofwolverinecontainer');
    if (level === 0) return 0;
    var data = this.skillData.heartofwolverinecontainer.attackRatingBonus;
    return data[Math.min(level - 1, data.length - 1)] || 0;
  }

  getSpiritOfBarbsReturn() {
    var level = this.getSkillTotalLevel('spiritofbarbscontainer');
    if (level === 0) return 0;
    var base = this.skillData.spiritofbarbscontainer.damageReturned[Math.min(level - 1, 59)] || 0;
    var synergy = this.calculateSynergyBonus('spiritofbarbscontainer', 'return') || 0;
    return Math.floor(base * (1 + synergy / 100));
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

          // Add mastery AR bonus
          var masteryARBonus = this.getWeaponMasteryARBonus();
          var totalARBonus = attackRatingBonus + masteryARBonus;

          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + totalARBonus + '%';
          if (masteryARBonus > 0) {
            html += ' (' + attackRatingBonus + '% + ' + masteryARBonus + '% Mastery)';
          }
          html += '</div>';
        }

        html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
        html += '<div style="margin: 5px 0;">Skill Bonus: +' + damageInfo.skillBonus + '%</div>';
        if (damageInfo.synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
        }
        if (damageInfo.masteryDamageBonus > 0) {
          var masteryName = this.getWeaponMasteryName();
          html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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
            manaCost = parseFloat((skill.manaCost[manaCostIndex] || 0).toFixed(1));
          } else if (typeof skill.manaCost === 'object') {
            manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
          } else {
            manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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

        // Special handling for Dragon Flight - cooldown
        if (skillId === 'dragonflightcontainer' && skill.cooldown) {
          html += '<div style="margin: 5px 0; color: #cccccc;">Cooldown: ' + skill.cooldown + ' seconds</div>';
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

      // Handle Carrion Vine Heals
      if (skillId === 'carrionvinecontainer' && skill.heals) {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var bMin = skill.heals.min[levelIndex] || 0;
        var bMax = skill.heals.max[levelIndex] || 0;

        // Calculate synergies for healing
        var synergyPoints = 0;
        if (skill.synergies) {
          skill.synergies.forEach(function (syn) {
            var synInput = document.getElementById(syn.skillId);
            if (synInput) {
              var synLevel = parseInt(synInput.value) || 0;
              synergyPoints += (synLevel * syn.bonusPerLevel);
            }
          });
        }

        var healMin = bMin + synergyPoints;
        var healMax = bMax + synergyPoints;

        html += '<div style="margin: 5px 0; color: #aaffaa;">Heals: ' + healMin + '-' + healMax + ' Life</div>';
        if (synergyPoints > 0) {
          html += '<div style="margin: 5px 0; color: #88ff88;">Synergy Bonus: +' + synergyPoints + ' Life</div>';
        }
      }

      // Handle Solar Creeper Mana Recovered
      if (skillId === 'solarcreepercontainer' && skill.manaRecovered) {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var baseMana = skill.manaRecovered.min[levelIndex] || 0;
        var synergyMana = this.calculateSynergyBonus(skillId, 'manaRecovered') || 0;
        var totalMana = baseMana + synergyMana;

        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Recovered: +' + totalMana + '</div>';
        if (synergyMana > 0) {
          html += '<div style="margin: 5px 0; color: #88ccff; font-size: 11px;">(Base: ' + baseMana + ' + Synergy: ' + synergyMana + ')</div>';
        }
      }

      // Range handling
      if (skill.range) {
        html += '<div style="margin: 5px 0; color: #cccccc;">Range: ' + skill.range + ' yards</div>';
      }

      // Special handling for Blood Warp - life cost
      if (skillId === 'bloodwarpcontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);

        // Life cost percentage
        if (skill.lifeCostPercent) {
          html += '<div style="margin: 5px 0; color: #ff6666;">Life Cost: ' + skill.lifeCostPercent + '% of Current Life</div>';
        }

        // Minimum life cost
        if (skill.minimumLifeCost) {
          var minLifeCost = skill.minimumLifeCost[levelIndex] || 2;
          html += '<div style="margin: 5px 0; color: #ff9999; font-size: 11px;">(Minimum: ' + minLifeCost + ' Life)</div>';
        }

        // Cooldown (array-based for Blood Warp)
        if (skill.cooldown && Array.isArray(skill.cooldown)) {
          var cooldownValue = skill.cooldown[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffaa66;">Cooldown: ' + cooldownValue + 's</div>';
        }
      }

      // Cooldown handling (for non-Blood Warp skills)
      if (skill.cooldown && skillId !== 'bloodwarpcontainer') {
        html += '<div style="margin: 5px 0; color: #ff6666;">Cooldown: ' + skill.cooldown + 's</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost = Array.isArray(skill.manaCost) ? parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1)) : parseFloat((skill.manaCost || 0).toFixed(1));
        html += '<div style="font-size: 14px; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'buff' || skill.type === 'buffdebuff') {
      // Handle buff and hybrid buff/debuff skills (Shout, Battle Orders, Cloak of Shadows, etc.)

      // Generic defense bonus handling
      if (skill.defenseBonus && skillId !== 'grimwardcontainer') { // Grim Ward handled separately if needed, but defense is usually Shout/Cloak
        var levelIndex = Math.min(totalSkillLevel - 1, skill.defenseBonus.length - 1);
        var defBonus = skill.defenseBonus[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #aaddff;">Defense: +' + defBonus + '%</div>';
      }

      // Enemy defense bonus (debuff part)
      if (skill.enemyDefenseBonus) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.enemyDefenseBonus.length - 1);
        var enemyDefBonus = skill.enemyDefenseBonus[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ff6666;">Enemy Defense: ' + enemyDefBonus + '%</div>';
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

      // Display damage and AR bonus for Heart of Wolverine
      if (skillId === 'heartofwolverinecontainer') {
        if (skill.damageBonus) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.damageBonus.length - 1);
          var dmgBonus = skill.damageBonus[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff9966;">Damage: +' + dmgBonus + '%</div>';
        }
        if (skill.attackRatingBonus) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.attackRatingBonus.length - 1);
          var arBonus = skill.attackRatingBonus[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + arBonus + '%</div>';
        }
      }

      // Special handling for Spirit of Barbs
      if (skillId === 'spiritofbarbscontainer' && skill.damageReturned) {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var bRet = skill.damageReturned[levelIndex] || 0;
        var synergyBonus = this.calculateSynergyBonus(skillId, 'return') || 0;
        var totalRet = Math.floor(bRet * (1 + synergyBonus / 100));

        html += '<div style="margin: 5px 0; color: #ff9966;">Damage Returned: ' + totalRet + '</div>';
        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
      }

      // Special handling for Oak Sage
      if (skillId === 'oaksagecontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.lifeReplenish.length - 1);
        var baseReplenish = skill.lifeReplenish[levelIndex] || 0;
        var synergyHeal = this.calculateSynergyBonus(skillId, 'healing') || 0;
        var totalReplenish = baseReplenish + synergyHeal;

        html += '<div style="margin: 5px 0; color: #aaffaa;">Life Replenish: +' + totalReplenish + '</div>';
        if (synergyHeal > 0) {
          html += '<div style="margin: 5px 0; color: #88ff88; font-size: 11px;">(Base: ' + baseReplenish + ' + Synergy: ' + synergyHeal + ')</div>';
        }

        var lifeBonus = skill.lifeBonus[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ff6666;">Life: +' + lifeBonus + '</div>';
      }

      // Display movement speed if available
      if (skill.movementSpeed) {
        var levelIndex = Math.min(totalSkillLevel - 1, skill.movementSpeed.length - 1);
        var moveSpeed = skill.movementSpeed[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffffff;">Movement Speed: +' + moveSpeed + '%</div>';
      }

      // Display attack speed if available
      if (skill.attackSpeed) {
        var asIndex = Math.min(baseSkillLevel, skill.attackSpeed.length - 1);
        if (skill.attackSpeed.length > 30) {
          asIndex = Math.min(totalSkillLevel - 1, skill.attackSpeed.length - 1);
        }
        var attackSpeed = skill.attackSpeed[asIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffffff;">Attack Speed: +' + attackSpeed + '%</div>';
      }

      // Range handling
      if (skill.range) {
        html += '<div style="margin: 5px 0; color: #cccccc;">Range: ' + skill.range + ' yards</div>';
      }

      // Cooldown handling
      if (skill.cooldown) {
        html += '<div style="margin: 5px 0; color: #ff6666;">Cooldown: ' + skill.cooldown + ' seconds</div>';
      }

      // Display Holy Shield specific properties
      if (skillId === 'holyshieldcontainer') {
        var smiteSynergyBonus = 0;
        var defenseSynergyBonus = 0;
        if (skill.synergies) {
          skill.synergies.forEach(function (synergy) {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            if (synergy.damageType === 'smite') {
              smiteSynergyBonus += synergyLevel * synergy.bonusPerLevel;
            } else if (synergy.damageType === 'defense') {
              defenseSynergyBonus += synergyLevel * synergy.bonusPerLevel;
            }
          });
        }

        if (skill.smiteDamageMin && skill.smiteDamageMax) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.smiteDamageMin.length - 1);
          var smiteMin = skill.smiteDamageMin[levelIndex] || 0;
          var smiteMax = skill.smiteDamageMax[levelIndex] || 0;
          if (smiteSynergyBonus > 0) {
            smiteMin = Math.floor(smiteMin * (1 + smiteSynergyBonus / 100));
            smiteMax = Math.floor(smiteMax * (1 + smiteSynergyBonus / 100));
          }
          html += '<div style="margin: 5px 0; color: #ffaa66;">Smite Damage: ' + smiteMin + '-' + smiteMax + '</div>';
        }

        if (defenseSynergyBonus > 0) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.defenseBonus.length - 1);
          var baseDefBonus = skill.defenseBonus[levelIndex] || 0;
          var totalDefBonus = baseDefBonus + defenseSynergyBonus;
          html += '<div style="margin: 5px 0; color: #aaddff;">Total Defense: +' + totalDefBonus + '%</div>';
        }

        if (skill.blockChance) {
          var levelIndex = Math.min(totalSkillLevel - 1, skill.blockChance.length - 1);
          var blockChance = skill.blockChance[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #99ccff;">Block Chance: +' + blockChance + '%</div>';
        }

        if (smiteSynergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Smite Damage Synergy: +' + smiteSynergyBonus + '%</div>';
        }
        if (defenseSynergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Defense Synergy: +' + defenseSynergyBonus + '%</div>';
        }
      }

      // Display Joust specific properties
      if (skillId === 'joustcontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);

        if (skill.damage) {
          var dmgBonus = skill.damage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff9966;">Damage: +' + dmgBonus + '%</div>';
        }

        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        if (skill.criticalStrike) {
          var crit = skill.criticalStrike[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffdd66;">Critical Strike Chance: +' + crit + '%</div>';
        }

        if (skill.movementSpeed) {
          var moveSpeed = skill.movementSpeed[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffffff;">Movement Speed: +' + moveSpeed + '%</div>';
        }

        if (skill.cooldown) {
          var cooldown = skill.cooldown[Math.min(baseSkillLevel, skill.cooldown.length - 1)] || 0;
          html += '<div style="margin: 5px 0; color: #ff6666;">Cooldown: ' + cooldown.toFixed(1) + ' seconds</div>';
        }
      }

      // Display Fire Enchant specific properties
      if (skillId === 'enchantfirecontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var baseFireMin = skill.fireDamageMin[levelIndex] || 0;
        var baseFireMax = skill.fireDamageMax[levelIndex] || 0;
        var synergyBonus = this.calculateSynergyBonus(skillId, 'fire') || 0;

        // Get Fire Mastery bonus
        var fireMasteryBonus = 0;
        var fireMasteryInput = document.getElementById('firemasterycontainer');
        if (fireMasteryInput) {
          var fireMasteryLevel = this.getSkillTotalLevel('firemasterycontainer');
          if (fireMasteryLevel > 0 && this.skillData.firemasterycontainer && this.skillData.firemasterycontainer.fireDamage) {
            fireMasteryBonus = this.skillData.firemasterycontainer.fireDamage[Math.min(fireMasteryLevel - 1, 59)] || 0;
          }
        }

        var fireMin = Math.floor(baseFireMin * (1 + (synergyBonus + fireMasteryBonus) / 100));
        var fireMax = Math.floor(baseFireMax * (1 + (synergyBonus + fireMasteryBonus) / 100));

        html += '<div style="margin: 5px 0; color: #ff6600;">Fire Damage: ' + fireMin + '-' + fireMax + '</div>';

        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
        if (fireMasteryBonus > 0) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Fire Mastery: +' + fireMasteryBonus + '%</div>';
        }
      }

      // Display Cold Enchant specific properties
      if (skillId === 'coldenchantcontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var baseColdMin = skill.coldDamageMin[levelIndex] || 0;
        var baseColdMax = skill.coldDamageMax[levelIndex] || 0;
        var synergyBonus = this.calculateSynergyBonus(skillId, 'cold') || 0;

        // Get Cold Mastery bonus
        var coldMasteryBonus = 0;
        var coldMasteryInput = document.getElementById('coldmasterycontainer');
        if (coldMasteryInput) {
          var coldMasteryLevel = this.getSkillTotalLevel('coldmasterycontainer');
          if (coldMasteryLevel > 0 && this.skillData.coldmasterycontainer && this.skillData.coldmasterycontainer.coldDamage) {
            coldMasteryBonus = this.skillData.coldmasterycontainer.coldDamage[Math.min(coldMasteryLevel - 1, 59)] || 0;
          }
        }

        var coldMin = Math.floor(baseColdMin * (1 + (synergyBonus + coldMasteryBonus) / 100));
        var coldMax = Math.floor(baseColdMax * (1 + (synergyBonus + coldMasteryBonus) / 100));

        html += '<div style="margin: 5px 0; color: #6699ff;">Cold Damage: ' + coldMin + '-' + coldMax + '</div>';

        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
        if (coldMasteryBonus > 0) {
          html += '<div style="margin: 5px 0; color: #99ccff;">Cold Mastery: +' + coldMasteryBonus + '%</div>';
        }
      }

      // Display Fire Enchant specific properties
      if (skillId === 'enchantfirecontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var baseFireMin = skill.fireDamageMin[levelIndex] || 0;
        var baseFireMax = skill.fireDamageMax[levelIndex] || 0;
        var synergyBonus = this.calculateSynergyBonus(skillId, 'fire') || 0;

        // Get Fire Mastery bonus
        var fireMasteryBonus = 0;
        var fireMasteryInput = document.getElementById('firemasterycontainer');
        if (fireMasteryInput) {
          var fireMasteryLevel = this.getSkillTotalLevel('firemasterycontainer');
          if (fireMasteryLevel > 0 && this.skillData.firemasterycontainer && this.skillData.firemasterycontainer.fireDamage) {
            fireMasteryBonus = this.skillData.firemasterycontainer.fireDamage[Math.min(fireMasteryLevel - 1, 59)] || 0;
          }
        }

        var fireMin = Math.floor(baseFireMin * (1 + (synergyBonus + fireMasteryBonus) / 100));
        var fireMax = Math.floor(baseFireMax * (1 + (synergyBonus + fireMasteryBonus) / 100));

        html += '<div style="margin: 5px 0; color: #ff6600;">Fire Damage: ' + fireMin + '-' + fireMax + '</div>';

        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
        if (fireMasteryBonus > 0) {
          html += '<div style="margin: 5px 0; color: #ff9966;">Fire Mastery: +' + fireMasteryBonus + '%</div>';
        }
      }

      // Display Cold Enchant specific properties
      if (skillId === 'coldenchantcontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);
        var baseColdMin = skill.coldDamageMin[levelIndex] || 0;
        var baseColdMax = skill.coldDamageMax[levelIndex] || 0;
        var synergyBonus = this.calculateSynergyBonus(skillId, 'cold') || 0;

        var coldMin = Math.floor(baseColdMin * (1 + synergyBonus / 100));
        var coldMax = Math.floor(baseColdMax * (1 + synergyBonus / 100));

        html += '<div style="margin: 5px 0; color: #6699ff;">Cold Damage: ' + coldMin + '-' + coldMax + '</div>';

        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
      }

      // Display Holy Sword specific properties
      if (skillId === 'holyswordcontainer') {
        var levelIndex = Math.min(totalSkillLevel - 1, 59);

        if (skill.parryChance) {
          var parry = skill.parryChance[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #99ccff;">Parry Chance: ' + parry + '%</div>';
          html += '<div style="margin: 5px 0; color: #888; font-style: italic; font-size: 11px;">Affected by "Increased Chance of Blocking" at 5:1 ratio. Dex has no effect. Hard cap: 75%</div>';
        }

        if (skill.damageToDemonsUndead) {
          var demonDmg = skill.damageToDemonsUndead[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffaa66;">Damage to Demons/Undead: +' + demonDmg + '%</div>';
        }
      }

      // Display duration
      if (skill.duration) {
        var duration;
        if (Array.isArray(skill.duration)) {
          duration = skill.duration[Math.min(totalSkillLevel - 1, skill.duration.length - 1)] || 0;
        } else {
          duration = skill.duration;
        }
        html += '<div style="margin: 5px 0; color: #cccccc;">Duration: ' + duration + ' seconds</div>';
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'smite') {
      // Handle Smite skill (shield-based damage)
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Damage bonus (shield damage will be added later when shield integration is implemented)
      if (skill.damage) {
        var damageBonus = skill.damage[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffaa66;">Damage: +' + damageBonus + '%</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">(Based on shield damage)</div>';
      }

      // Stun Length
      if (skill.stunLength) {
        var stunLength = skill.stunLength[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffcc99;">Stun Length: ' + stunLength.toFixed(1) + ' seconds</div>';
      }

      // Crushing Blow Effectiveness
      if (skill.crushingBlowEffectiveness) {
        var cbEff = skill.crushingBlowEffectiveness[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ff9966;">Crushing Blow Effectiveness: ' + cbEff + '%</div>';
      }

      // Crushing Blow Chance (based on invested points, not total level)
      if (skill.crushingBlowChance) {
        var skillInput = document.getElementById(skillId);
        var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
        var cbChance = skill.crushingBlowChance[Math.min(baseSkillLevel, skill.crushingBlowChance.length - 1)] || 0;
        if (cbChance > 0) {
          html += '<div style="margin: 5px 0; color: #ff6666;">Chance of Crushing Blow: ' + cbChance + '%</div>';
        }
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = typeof skill.manaCost === 'number' ? skill.manaCost : (skill.manaCost[levelIndex] || 0);
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana + '</div>';
      }
    } else if (skillId === 'holyboltcontainer') {
      // Handle Holy Bolt - magic damage with healing
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Calculate magic damage synergy bonus
      var magicSynergyBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'magic') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            magicSynergyBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Magic Damage
      var magicMin = skill.damageMin[levelIndex] || 0;
      var magicMax = skill.damageMax[levelIndex] || 0;
      if (magicSynergyBonus > 0) {
        magicMin = Math.floor(magicMin * (1 + magicSynergyBonus / 100));
        magicMax = Math.floor(magicMax * (1 + magicSynergyBonus / 100));
      }
      var avgMagic = Math.floor((magicMin + magicMax) / 2);
      html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage: ' + magicMin + '-' + magicMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + avgMagic + '</div>';

      // Calculate healing synergy bonus
      var healSynergyBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'heal') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            healSynergyBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Healing
      var healMin = skill.healsMin[levelIndex] || 0;
      var healMax = skill.healsMax[levelIndex] || 0;
      if (healSynergyBonus > 0) {
        healMin = Math.floor(healMin * (1 + healSynergyBonus / 100));
        healMax = Math.floor(healMax * (1 + healSynergyBonus / 100));
      }
      html += '<div style="margin: 5px 0; color: #66ff66;">Heals: ' + healMin + '-' + healMax + '</div>';

      // Display synergy bonuses
      if (magicSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Magic Damage Synergy Bonus: +' + magicSynergyBonus + '%</div>';
      }
      if (healSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Healing Synergy Bonus: +' + healSynergyBonus + '%</div>';
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = skill.manaCost[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana.toFixed(1) + '</div>';
      }
    } else if (skillId === 'holylightcontainer') {
      // Handle Holy Light - magic damage with healing (similar to Holy Bolt)
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Calculate magic damage synergy bonus
      var magicSynergyBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'magic') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            magicSynergyBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Magic Damage
      var magicMin = skill.damageMin[levelIndex] || 0;
      var magicMax = skill.damageMax[levelIndex] || 0;
      if (magicSynergyBonus > 0) {
        magicMin = Math.floor(magicMin * (1 + magicSynergyBonus / 100));
        magicMax = Math.floor(magicMax * (1 + magicSynergyBonus / 100));
      }
      var avgMagic = Math.floor((magicMin + magicMax) / 2);
      html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage: ' + magicMin + '-' + magicMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + avgMagic + '</div>';

      // Calculate healing synergy bonus (Prayer gives flat bonus, not percentage)
      var healFlatBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'heal') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            healFlatBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Healing
      var healMin = skill.healsMin[levelIndex] || 0;
      var healMax = skill.healsMax[levelIndex] || 0;
      healMin += healFlatBonus;
      healMax += healFlatBonus;
      html += '<div style="margin: 5px 0; color: #66ff66;">Heals: ' + healMin + '-' + healMax + '</div>';

      // Display synergy bonuses
      if (magicSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Magic Damage Synergy Bonus: +' + magicSynergyBonus + '%</div>';
      }
      if (healFlatBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Healing Synergy Bonus: +' + Math.floor(healFlatBonus) + '</div>';
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = skill.manaCost[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana.toFixed(2) + '</div>';
      }
    } else if (skill.type === 'magic_lightning_hybrid') {
      // Handle Fist of the Heavens - magic + lightning damage
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Calculate synergy bonus (applies to magic damage only)
      var magicSynergyBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'magic') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            magicSynergyBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Magic Damage
      var magicMin = skill.magicDamageMin[levelIndex] || 0;
      var magicMax = skill.magicDamageMax[levelIndex] || 0;
      if (magicSynergyBonus > 0) {
        magicMin = Math.floor(magicMin * (1 + magicSynergyBonus / 100));
        magicMax = Math.floor(magicMax * (1 + magicSynergyBonus / 100));
      }
      var avgMagic = Math.floor((magicMin + magicMax) / 2);
      html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage: ' + magicMin + '-' + magicMax + '</div>';

      // Lightning Damage (not affected by synergies)
      var lightMin = skill.lightningDamageMin[levelIndex] || 0;
      var lightMax = skill.lightningDamageMax[levelIndex] || 0;
      var avgLight = Math.floor((lightMin + lightMax) / 2);
      html += '<div style="margin: 5px 0; color: #ffff00;">Lightning Damage: ' + lightMin + '-' + lightMax + '</div>';

      // Total Average
      var totalAvg = avgMagic + avgLight;
      html += '<div style="margin: 5px 0; color: #00ff00;">Total Average: ' + totalAvg + '</div>';

      // Display synergy bonus
      if (magicSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Magic Damage Synergy Bonus: +' + magicSynergyBonus + '%</div>';
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = skill.manaCost[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana.toFixed(1) + '</div>';
      }
    } else if (skillId === 'holynovacontainer') {
      // Handle Holy Nova - magic damage with healing and cooldown
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Calculate magic damage synergy bonus
      var magicSynergyBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'magic') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            magicSynergyBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Magic Damage
      var magicMin = skill.damageMin[levelIndex] || 0;
      var magicMax = skill.damageMax[levelIndex] || 0;
      if (magicSynergyBonus > 0) {
        magicMin = Math.floor(magicMin * (1 + magicSynergyBonus / 100));
        magicMax = Math.floor(magicMax * (1 + magicSynergyBonus / 100));
      }
      var avgMagic = Math.floor((magicMin + magicMax) / 2);
      html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage: ' + magicMin + '-' + magicMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + avgMagic + '</div>';

      // Calculate healing synergy bonus (flat bonus)
      var healFlatBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'heal') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            healFlatBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Healing
      var heals = skill.heals[levelIndex] || 0;
      heals += healFlatBonus;
      html += '<div style="margin: 5px 0; color: #66ff66;">Heals: ' + heals + '</div>';

      // Cooldown
      if (skill.cooldown) {
        html += '<div style="margin: 5px 0; color: #ff6666;">Cooldown: ' + skill.cooldown + ' seconds</div>';
      }

      // Display synergy bonuses
      if (magicSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Magic Damage Synergy Bonus: +' + magicSynergyBonus + '%</div>';
      }
      if (healFlatBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Healing Synergy Bonus: +' + Math.floor(healFlatBonus) + '</div>';
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = skill.manaCost[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana + '</div>';
      }
    } else if (skill.type === 'elemental_hybrid') {
      // Handle Vengeance - elemental hybrid attack
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Calculate elemental synergy bonus
      var elementalSynergyBonus = 0;
      if (skill.synergies) {
        skill.synergies.forEach(function (synergy) {
          if (synergy.damageType === 'elemental') {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            elementalSynergyBonus += synergyLevel * synergy.bonusPerLevel;
          }
        });
      }

      // Base elemental damage bonus
      var elemDmgBonus = skill.elementalDamage[levelIndex] || 0;
      var totalElemBonus = elemDmgBonus + elementalSynergyBonus;

      // Fire Damage
      var fireMin = skill.fireDamageMin[levelIndex] || 0;
      var fireMax = skill.fireDamageMax[levelIndex] || 0;
      if (totalElemBonus > 0) {
        fireMin = Math.floor(fireMin * (1 + totalElemBonus / 100));
        fireMax = Math.floor(fireMax * (1 + totalElemBonus / 100));
      }
      html += '<div style="margin: 5px 0; color: #ff6600;">Fire Damage: ' + fireMin + '-' + fireMax + '</div>';

      // Cold Damage
      var coldMin = skill.coldDamageMin[levelIndex] || 0;
      var coldMax = skill.coldDamageMax[levelIndex] || 0;
      if (totalElemBonus > 0) {
        coldMin = Math.floor(coldMin * (1 + totalElemBonus / 100));
        coldMax = Math.floor(coldMax * (1 + totalElemBonus / 100));
      }
      html += '<div style="margin: 5px 0; color: #6699ff;">Cold Damage: ' + coldMin + '-' + coldMax + '</div>';
      if (skill.coldLength) {
        html += '<div style="margin: 5px 0; color: #99ccff;">Cold Length: ' + skill.coldLength + ' seconds</div>';
      }

      // Lightning Damage
      var lightMin = skill.lightningDamageMin[levelIndex] || 0;
      var lightMax = skill.lightningDamageMax[levelIndex] || 0;
      if (totalElemBonus > 0) {
        lightMin = Math.floor(lightMin * (1 + totalElemBonus / 100));
        lightMax = Math.floor(lightMax * (1 + totalElemBonus / 100));
      }
      html += '<div style="margin: 5px 0; color: #ffff00;">Lightning Damage: ' + lightMin + '-' + lightMax + '</div>';

      // Attack Rating
      if (skill.attackRating) {
        var ar = skill.attackRating[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
      }

      // Chain Chance
      if (skill.chainChance) {
        var chainChance = skill.chainChance[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffaa99;">Chance to Chain to Nearby Enemies: ' + chainChance + '%</div>';
      }

      // Display synergy bonus
      if (elementalSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Elemental Damage Synergy Bonus: +' + elementalSynergyBonus + '%</div>';
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = skill.manaCost[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana.toFixed(1) + '</div>';
      }
    } else if (skill.type === 'charge_up') {
      // Handle charge-up skills like Tiger Strike
      // Show damage based on charge 3 only (as requested)

      if (!weaponUsable) {
        html += '<div style="margin: 10px 0; color: #ff6666; font-weight: bold;">Cannot use this skill</div>';
        html += '<div style="margin: 5px 0; color: #888; font-style: italic;">Weapon level, strength, or dexterity requirement not met</div>';
      } else {
        // Use charge 3 damage for calculation (Tiger Strike only)
        if (skill.charge3Damage) {
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
            var masteryName = this.getWeaponMasteryName();
            html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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

    // Blades of Ice - cold damage charge-up
    if (skillId === 'bladesoficecontainer') {
      var levelIndex = Math.min(totalSkillLevel - 1, 59);
      // Note: Blades of Ice doesn't have synergies in the data provided

      if (skill.attackRating) {
        var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
        var attackRatingBonus = skill.attackRating[arIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
      }

      if (skill.charge1IceDamage) {
        var iceMin = skill.charge1IceDamage.min[levelIndex] || 13;
        var iceMax = skill.charge1IceDamage.max[levelIndex] || 30;
        html += '<div style="margin: 5px 0; color: #6699ff;">Charge 1 Ice Damage: ' + iceMin + '-' + iceMax + '</div>';
      }
      if (skill.charge2WaveDamage) {
        var waveMin = skill.charge2WaveDamage.min[levelIndex] || 15;
        var waveMax = skill.charge2WaveDamage.max[levelIndex] || 35;
        html += '<div style="margin: 5px 0; color: #99ccff;">Charge 2 Wave Damage: ' + waveMin + '-' + waveMax + '</div>';
      }
      if (skill.charge3BoltDamage) {
        var boltMin = skill.charge3BoltDamage.min[levelIndex] || 11;
        var boltMax = skill.charge3BoltDamage.max[levelIndex] || 26;
        html += '<div style="margin: 5px 0; color: #aaddff;">Charge 3 Bolt Damage: ' + boltMin + '-' + boltMax + '</div>';
      }
      if (skill.manaCost) {
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + skill.manaCost + '</div>';
      }
    }

    // Phoenix Strike - multi-element charge-up
    if (skillId === 'phoenixstrikecontainer') {
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      if (skill.attackRating) {
        var arIndex = Math.min(totalSkillLevel - 1, skill.attackRating.length - 1);
        var attackRatingBonus = skill.attackRating[arIndex] || 0;
        html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRatingBonus + '%</div>';
      }

      // Calculate synergies for each element
      var fireSynergyBonus = this.calculateSynergyBonus(skillId, 'fire');
      var lightningSynergyBonus = this.calculateSynergyBonus(skillId, 'lightning');
      var coldSynergyBonus = this.calculateSynergyBonus(skillId, 'cold');

      if (skill.meteorDamage) {
        var meteorMin = skill.meteorDamage.min[levelIndex] || 20;
        var meteorMax = skill.meteorDamage.max[levelIndex] || 40;
        meteorMin = Math.floor(meteorMin * (1 + fireSynergyBonus / 100));
        meteorMax = Math.floor(meteorMax * (1 + fireSynergyBonus / 100));
        html += '<div style="margin: 5px 0; color: #ffaa00;">Meteor Damage: ' + meteorMin + '-' + meteorMax + '</div>';
      }
      if (skill.burningDamage) {
        var burnMin = skill.burningDamage.min[levelIndex] || 14;
        var burnMax = skill.burningDamage.max[levelIndex] || 23;
        burnMin = Math.floor(burnMin * (1 + fireSynergyBonus / 100));
        burnMax = Math.floor(burnMax * (1 + fireSynergyBonus / 100));
        html += '<div style="margin: 5px 0; color: #ff6600;">Burning Damage: ' + burnMin + '-' + burnMax + '</div>';
      }
      if (skill.lightningDamage) {
        var lightMin = skill.lightningDamage.min[levelIndex] || 1;
        var lightMax = skill.lightningDamage.max[levelIndex] || 40;
        lightMin = Math.floor(lightMin * (1 + lightningSynergyBonus / 100));
        lightMax = Math.floor(lightMax * (1 + lightningSynergyBonus / 100));
        html += '<div style="margin: 5px 0; color: #ffff00;">Lightning Damage: ' + lightMin + '-' + lightMax + '</div>';
      }
      if (skill.coldDamage) {
        var coldMin = skill.coldDamage.min[levelIndex] || 16;
        var coldMax = skill.coldDamage.max[levelIndex] || 32;
        coldMin = Math.floor(coldMin * (1 + coldSynergyBonus / 100));
        coldMax = Math.floor(coldMax * (1 + coldSynergyBonus / 100));
        html += '<div style="margin: 5px 0; color: #6699ff;">Cold Damage: ' + coldMin + '-' + coldMax + '</div>';
      }

      // Show synergy bonuses if any
      if (fireSynergyBonus > 0 || lightningSynergyBonus > 0 || coldSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonuses Applied</div>';
      }

      if (skill.manaCost) {
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + skill.manaCost + '</div>';
      }
    } else if (skill.type === 'magic') {
      // Handle pure magic damage skills like Psychic Hammer
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Get base magic damage
      var baseMagicMin = skill.magicDamage.min[levelIndex] || 0;
      var baseMagicMax = skill.magicDamage.max[levelIndex] || 0;

      // Calculate synergy bonus for magic
      var magicSynergyBonus = this.calculateSynergyBonus(skillId, 'magic');

      // Apply synergies to magic damage
      var magicMin = Math.floor(baseMagicMin * (1 + magicSynergyBonus / 100));
      var magicMax = Math.floor(baseMagicMax * (1 + magicSynergyBonus / 100));

      html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage: ' + magicMin + '-' + magicMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + Math.floor((magicMin + magicMax) / 2) + '</div>';

      if (magicSynergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + magicSynergyBonus + '%</div>';
      }

      // Display bounces if available
      if (skill.bounces) {
        var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
        var bounceIndex = Math.min(baseSkillLevel, skill.bounces.length - 1);
        var bounceCount = skill.bounces[bounceIndex] || 1;
        html += '<div style="margin: 5px 0; color: #cccccc;">Bounces: ' + bounceCount + '</div>';
        html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic; color: #999;">Deals 20% less damage per bounce</div>';
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
    } else if (skill.type === 'pure_physical') {
      // Handle non-weapon based physical skills like Mind Blast or War Cry
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Get base physical damage
      var basePhysMin = skill.physicalDamage.min[levelIndex] || 0;
      var basePhysMax = skill.physicalDamage.max[levelIndex] || 0;

      // Calculate synergy bonus (using 'physical' as damageType for synergy calculation)
      var synergyBonus = this.calculateSynergyBonus(skillId, 'physical');

      // Apply synergies
      var physMin = Math.floor(basePhysMin * (1 + synergyBonus / 100));
      var physMax = Math.floor(basePhysMax * (1 + synergyBonus / 100));

      html += '<div style="margin: 5px 0; color: #ffcc99;">Physical Damage: ' + physMin + '-' + physMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + Math.floor((physMin + physMax) / 2) + '</div>';

      if (synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
      }

      // Radius handling (often scales with hard points in PD2)
      if (skill.radius) {
        var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
        var rIndex = Math.min(baseSkillLevel, skill.radius.length - 1);
        var radius = skill.radius[rIndex] || 0;
        html += '<div style="margin: 5px 0; color: #cccccc;">Radius: ' + radius + ' yards</div>';
      }

      // Stun length handling
      if (skill.stunLength) {
        var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
        var sIndex = Math.min(baseSkillLevel, skill.stunLength.length - 1);
        var stun = skill.stunLength[sIndex] || 0;
        if (stun > 0) {
          html += '<div style="margin: 5px 0; color: #cccccc;">Stun Length: ' + stun + ' seconds</div>';
        }
      }

      // Display mana cost
      if (skill.manaCost) {
        var manaCost = Array.isArray(skill.manaCost) ? (skill.manaCost[levelIndex] || 0) : skill.manaCost;
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    }
    else if (skill.type === 'kick') {
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
            var masteryName = this.getWeaponMasteryName();
            html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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
            manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
          } else if (skill.manaCost && typeof skill.manaCost === 'object') {
            manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
          } else {
            manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'lightning_conversion') {
      var damageInfo = this.calculateLightningConversionDamage(skill, totalSkillLevel, weaponDamage, dexterity, skillId);

      // Display physical as 0-0 since it's converted
      html += '<div style="margin: 5px 0;">Weapon: ' + weaponDamage.min + '-' + weaponDamage.max + '</div>';
      html += '<div style="margin: 5px 0;">Dex Bonus: +' + damageInfo.statBonus + '%</div>';
      if (damageInfo.masteryDamageBonus > 0) {
        var masteryName = this.getWeaponMasteryName();
        html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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

      // Display mana cost
      if (skill.manaCost) {
        var manaCost;
        if (Array.isArray(skill.manaCost)) {
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
        }
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      }
    } else if (skill.type === 'fire') {
      var damageInfo = this.calculateFireDamage(skill, totalSkillLevel, skillId);

      html += '<div style="margin: 5px 0; color: #ff6600;">Fire: ' + damageInfo.fireMin + '-' + damageInfo.fireMax + '</div>';
      html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + damageInfo.average + '</div>';
      if (damageInfo.synergyBonus > 0) {
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + damageInfo.synergyBonus + '%</div>';
      }
      if (damageInfo.masteryBonus > 0) {
        html += '<div style="margin: 5px 0; color: #ff9966;">Fire Mastery: +' + damageInfo.masteryBonus + '%</div>';
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
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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
      if (damageInfo.masteryBonus > 0) {
        html += '<div style="margin: 5px 0; color: #ffff99;">Lightning Mastery: +' + damageInfo.masteryBonus + '%</div>';
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
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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
          manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
        } else if (typeof skill.manaCost === 'object') {
          manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
        } else {
          manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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
          var masteryName = this.getWeaponMasteryName();
          html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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
            manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
          } else if (typeof skill.manaCost === 'object') {
            manaCost = parseFloat((skill.manaCost.base + (skill.manaCost.perLevel * (totalSkillLevel - 1))).toFixed(1));
          } else {
            manaCost = parseFloat((skill.manaCost || 0).toFixed(1));
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
          var masteryName = this.getWeaponMasteryName();
          html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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
          var manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
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
          var masteryName = this.getWeaponMasteryName();
          html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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
          var manaCost = parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
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
      if (damageInfo.masteryBonus > 0) {
        html += '<div style="margin: 5px 0; color: #99ccff;">Cold Mastery: +' + damageInfo.masteryBonus + '%</div>';
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
        var manaCost = typeof skill.manaCost === 'number' ? parseFloat(skill.manaCost.toFixed(1)) : parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
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
        var manaCost = typeof skill.manaCost === 'number' ? parseFloat(skill.manaCost.toFixed(1)) : parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1));
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
          var masteryName = this.getWeaponMasteryName();
          html += '<div style="margin: 5px 0; color: #ff9966;">' + masteryName + ': +' + damageInfo.masteryDamageBonus + '%</div>';
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
          var manaCost = Array.isArray(skill.manaCost) ? parseFloat((skill.manaCost[Math.min(totalSkillLevel - 1, skill.manaCost.length - 1)] || 0).toFixed(1)) : parseFloat((skill.manaCost || 0).toFixed(1));
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
    } else if (skill.type === 'summon') {
      // Generic summon handling (Ravens, Poison Creeper, Spirit Wolf, Valkyrie, Decoy, etc.)
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // --- Start Skeleton Mastery Integration ---
      var masteryLevel = 0;
      var masteryData = null;
      var masteryVelocity = 0;
      var masteryLife = 0;
      var masteryPhysDmg = 0;
      var masteryElemDmg = 0;

      if (skillId === 'raiseskeletonwarriorcontainer' || skillId === 'raiseskeletalmagecontainer') {
        var smInput = document.getElementById('skeletonmasterycontainer');
        var smBonus = document.getElementById('skeletonmasterycontainer_bonus');
        if (smBonus && smBonus.textContent.trim() !== '') {
          masteryLevel = parseInt(smBonus.textContent) || 0;
        } else if (smInput) {
          masteryLevel = parseInt(smInput.value) || 0;
        }
        masteryData = this.skillData['skeletonmasterycontainer'];
        if (masteryLevel > 0 && masteryData) {
          var mIdx = Math.min(masteryLevel - 1, 59);
          masteryVelocity = masteryData.skeletonVelocity[mIdx] || 0;
          masteryLife = masteryData.skeletonLife[mIdx] || 0;
          masteryPhysDmg = masteryData.physicalDamageBonus[mIdx] || 0;
          masteryElemDmg = masteryData.elementalDamageBonus[mIdx] || 0;
        }
      }
      // --- End Skeleton Mastery Integration ---

      // 1. Damage Handling
      // Physical + Cold (e.g., Raven, Spirit Wolf)
      var bPhysMin = 0, bPhysMax = 0, bColdMin = 0, bColdMax = 0, bPoiMin = 0, bPoiMax = 0;

      if (skill.physicalDamage) {
        bPhysMin = skill.physicalDamage.min[levelIndex] || 0;
        bPhysMax = skill.physicalDamage.max[levelIndex] || 0;
      } else if (skill.damage) { // Standard damage fallback
        bPhysMin = skill.damage.min ? (skill.damage.min[levelIndex] || 0) : 0;
        bPhysMax = skill.damage.max ? (skill.damage.max[levelIndex] || 0) : 0;
      }

      if (skill.coldDamage) {
        bColdMin = skill.coldDamage.min[levelIndex] || 0;
        bColdMax = skill.coldDamage.max[levelIndex] || 0;
      }

      if (skill.poisonDamage) {
        bPoiMin = skill.poisonDamage.min[levelIndex] || 0;
        bPoiMax = skill.poisonDamage.max[levelIndex] || 0;
      }

      // Calculate synergies
      var synergyBoth = this.calculateSynergyBonus(skillId, 'both') || 0;
      var synergyPhys = this.calculateSynergyBonus(skillId, 'physical') || 0;
      var synergyPoi = this.calculateSynergyBonus(skillId, 'poison') || 0;
      var synergyAll = this.calculateSynergyBonus(skillId, 'all') || 0;

      var physBonus = (synergyBoth || synergyPhys || 0) + synergyAll;
      if (skill.damage && skill.damage.damageBonus) {
        physBonus += (skill.damage.damageBonus[levelIndex] || 0);
      }
      var coldBonus = synergyBoth + synergyAll;
      if (skillId === 'raiseskeletonwarriorcontainer' || skillId === 'raiseskeletalmagecontainer') coldBonus += masteryElemDmg;

      var poiBonus = synergyPoi + synergyAll;
      if (skillId === 'raiseskeletonwarriorcontainer' || skillId === 'raiseskeletalmagecontainer') poiBonus += masteryElemDmg;

      var physSumED = (synergyBoth || synergyPhys || 0) + synergyAll + masteryPhysDmg;
      var inherentED = 0;
      if (skill.damage && skill.damage.damageBonus) {
        inherentED = (skill.damage.damageBonus[levelIndex] || 0);
      }

      var physMin = Math.floor(bPhysMin * (1 + inherentED / 100));
      physMin = Math.floor(physMin * (1 + physSumED / 100));

      var physMax = Math.floor(bPhysMax * (1 + inherentED / 100));
      physMax = Math.floor(physMax * (1 + physSumED / 100));

      var coldSumED = coldBonus;
      var coldMin = Math.floor(bColdMin * (1 + coldSumED / 100));
      var coldMax = Math.floor(bColdMax * (1 + coldSumED / 100));

      var poiSumED = poiBonus;
      var poiMin = Math.floor(bPoiMin * (1 + poiSumED / 100));
      var poiMax = Math.floor(bPoiMax * (1 + poiSumED / 100));

      if (masteryVelocity > 0) {
        html += '<div style="margin: 5px 0; color: #ffffff;">Skeleton Velocity: +' + masteryVelocity + '%</div>';
      }

      // Display Damage
      if (physMax > 0) html += '<div style="margin: 5px 0; color: #ffcc99;">Physical Damage: ' + physMin + '-' + physMax + '</div>';
      if (coldMax > 0) html += '<div style="margin: 5px 0; color: #6699ff;">Cold Damage: ' + coldMin + '-' + coldMax + '</div>';
      if (poiMax > 0) {
        html += '<div style="margin: 5px 0; color: #00ff00;">Poison Damage: ' + poiMin + '-' + poiMax + ' over ' + (skill.poisonDuration || 4) + 's</div>';
        html += '<div style="margin: 5px 0;">Average per Second: ' + Math.floor(((poiMin + poiMax) / 2) / (skill.poisonDuration || 4)) + '</div>';
      }

      if (physMax > 0 && coldMax > 0) {
        html += '<div style="margin: 5px 0; color: #ffffff; font-weight: bold;">Total Damage: ' + (physMin + coldMin) + '-' + (physMax + coldMax) + '</div>';
        html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + Math.floor((physMin + physMax + coldMin + coldMax) / 2) + '</div>';
      } else if (physMax > 0 && !poiMax) {
        html += '<div style="margin: 5px 0; color: #00ff00;">Average: ' + Math.floor((physMin + physMax) / 2) + '</div>';
      }

      // Display Synergies
      var totalSyn = Math.max(synergyBoth, synergyPhys, synergyPoi, synergyAll);
      if (totalSyn > 0) {
        // If 'all' is the primary or added to others, we should reflect the total physical bonus or max synergy
        var displayBonus = synergyAll + Math.max(synergyBoth, synergyPhys, synergyPoi);
        html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + displayBonus + '%</div>';
      }

      // 2. Stats Handling
      if (skill.enemyPoisonResist) {
        var res = skill.enemyPoisonResist[Math.min(totalSkillLevel - 1, skill.enemyPoisonResist.length - 1)];
        html += '<div style="margin: 5px 0; color: #ff6666;">Enemy Poison Resistance: ' + res + '%</div>';
      }

      if (skill.attackRating) {
        var ar = Array.isArray(skill.attackRating) ? (skill.attackRating[levelIndex] || 0) : 0;
        if (ar > 0) html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
      }

      if (skill.defense) {
        var def = Array.isArray(skill.defense) ? (skill.defense[levelIndex] || 0) : 0;
        if (def > 0) html += '<div style="margin: 5px 0; color: #aaddff;">Defense: +' + def + '%</div>';
      }

      if (skill.allResistances || skill.allResist || skill.allRes) {
        var resArr = skill.allResistances || skill.allResist || skill.allRes;
        var res = Array.isArray(resArr) ? (resArr[levelIndex] || 0) : (resArr || 0);
        if (res > 0) html += '<div style="margin: 5px 0; color: #aaffaa;">All Resistances: +' + res + '</div>';
      }

      // 3. Life Handling
      if (skill.life) {
        var lifeValue = 0;
        if (typeof skill.life === 'object' && skill.life.hell) {
          lifeValue = (skill.life.hell[levelIndex] || 0) + masteryLife;
          html += '<div style="margin: 5px 0; color: #ff6666;">Life (Hell): ' + lifeValue + '</div>';
        } else if (Array.isArray(skill.life)) {
          lifeValue = skill.life[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff6666;">Life Bonus: +' + lifeValue + '%</div>';
        }
      }

      // 4. Summon Count / Info
      if (skill.totalSummons) {
        var summonCount = Array.isArray(skill.totalSummons) ? (skill.totalSummons[levelIndex] || 0) : skill.totalSummons;
        var label = skillId === 'ravencontainer' ? 'Total Ravens' : (skillId === 'poisoncreepercontainer' ? 'Total Creeper Vines' : 'Total Summons');
        html += '<div style="margin: 5px 0; color: #cccccc;">' + label + ': ' + summonCount + '</div>';
      }

      if (skill.summonsPerCast) {
        var perCast = skill.summonsPerCast[Math.min(baseSkillLevel, skill.summonsPerCast.length - 1)];
        html += '<div style="margin: 5px 0; color: #cccccc;">Ravens per Cast: ' + perCast + '</div>';
      }

      if (skill.decoys) {
        var decoyCount = skill.decoys[Math.min(totalSkillLevel - 1, skill.decoys.length - 1)] || 1;
        html += '<div style="margin: 5px 0;">Number of Decoys: ' + decoyCount + '</div>';
      }

      if (skill.powerStrikeLevel) {
        var psLevel = skill.powerStrikeLevel[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #cccccc;">Power Strike Level: ' + psLevel + '</div>';
      }

      if (skillId === 'valkyriecontainer') {
        html += '<div style="margin: 5px 0; font-size: 11px; font-style: italic;">Can summon additional Valkyrie at levels 20 and 30</div>';
      }

      // Special handling for Dire Wolf and Grizzly defense/AR
      if (skill.defenseBonus) {
        var defBonus = skill.defenseBonus[levelIndex] || 0;
        html += '<div style="margin: 5px 0; color: #aaddff;">Defense: +' + defBonus + '%</div>';
      }
      if (skill.baseAttackRatingBonus) {
        html += '<div style="margin: 5px 0; color: #ffcc66;">Base Attack Rating: +' + skill.baseAttackRatingBonus + '%</div>';
      }
      if (skill.damageBonus) {
        var dmgBonusArr = skill.damageBonus;
        var dBonus = Array.isArray(dmgBonusArr) ? (dmgBonusArr[levelIndex] || 0) : dmgBonusArr;
        html += '<div style="margin: 5px 0; color: #ffaa66;">Damage: +' + dBonus + '%</div>';
      }
      if (skill.totalGrizzlyBears) {
        // Use hard points for grizzly bear count
        var grizzlyInput = document.getElementById('summongrizzlycontainer');
        var grizzlyHardPoints = parseInt(grizzlyInput ? grizzlyInput.value : '0') || 0;
        var grizzlyCount = skill.totalGrizzlyBears[Math.min(grizzlyHardPoints, skill.totalGrizzlyBears.length - 1)] || 1;
        html += '<div style="margin: 5px 0; color: #cccccc;">Total Grizzly Bears: ' + grizzlyCount + '</div>';
      }

      // 5. Meta Info
      if (skill.manaCost) {
        var mana = Array.isArray(skill.manaCost) ? parseFloat((skill.manaCost[levelIndex] || 0).toFixed(1)) : parseFloat((skill.manaCost || 0).toFixed(1));
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana + '</div>';
      }
      if (skill.cooldown) {
        html += '<div style="margin: 5px 0; color: #ff6666;">Cooldown: ' + skill.cooldown + 's</div>';
      }
      if (skill.cooldown) {
        html += '<div style="margin: 5px 0; color: #ff6666;">Cooldown: ' + skill.cooldown + 's</div>';
      }

      // Handle Werewolf and Werebear transformations
      if (skillId === 'werewolfcontainer' || skillId === 'werebearcontainer') {
        var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;

        // Get Lycanthropy bonuses
        var lycanthropyBonusElement = document.getElementById('lycantropycontainer_bonus');
        var lycanthropySkillInput = document.getElementById('lycantropycontainer');
        var lycanthropyLevel = 0;
        if (lycanthropyBonusElement && lycanthropyBonusElement.textContent.trim() !== '') {
          // If _bonus element exists AND has content, it contains the TOTAL level (invested + bonuses)
          lycanthropyLevel = parseInt(lycanthropyBonusElement.textContent) || 0;
        } else if (lycanthropySkillInput) {
          // Otherwise, fall back to reading just the invested points
          lycanthropyLevel = parseInt(lycanthropySkillInput.value) || 0;
        }
        var lycanthropyData = this.skillData['lycantropycontainer'];

        if (skillId === 'werewolfcontainer') {
          // Display Werewolf bonuses
          if (skill.magicDamageReduction) {
            var magicDR = skill.magicDamageReduction[levelIndex] || 0;
            html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Damage Reduction: ' + magicDR + '</div>';
          }
          if (skill.physicalDamageReduction) {
            var physDR = skill.physicalDamageReduction[levelIndex] || 0;
            html += '<div style="margin: 5px 0; color: #ffcc99;">Physical Damage Reduction: ' + physDR + '</div>';
          }
          if (skill.damageBonus) {
            var dmgBonus = skill.damageBonus[levelIndex] || 0;
            html += '<div style="margin: 5px 0; color: #ff9966;">Damage: +' + dmgBonus + '%</div>';
          }
          if (skill.attackSpeed) {
            var atkSpeed = skill.attackSpeed[levelIndex] || 0;
            html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Speed: +' + atkSpeed + '%</div>';
          }
        } else if (skillId === 'werebearcontainer') {
          // Display Werebear bonuses
          if (skill.damageBonus) {
            var dmgBonus = skill.damageBonus[levelIndex] || 0;
            html += '<div style="margin: 5px 0; color: #ff9966;">Damage: +' + dmgBonus + '%</div>';
          }
          if (skill.defenseBonus) {
            var defBonus = skill.defenseBonus[levelIndex] || 0;
            html += '<div style="margin: 5px 0; color: #aaddff;">Defense: +' + defBonus + '%</div>';
          }
          if (skill.uninterruptedAttack) {
            var unint = skill.uninterruptedAttack[levelIndex] || 0;
            html += '<div style="margin: 5px 0; color: #cccccc;">Uninterrupted Attack: ' + unint + '%</div>';
          }

          // Combine Life bonus from Werebear + Lycanthropy
          var totalLifeBonus = skill.lifeBonus || 0;
          if (lycanthropyLevel > 0 && lycanthropyData) {
            var lycIndex = Math.min(lycanthropyLevel - 1, 59);
            var lycLifeBonus = lycanthropyData.lifeBonus[lycIndex] || 0;
            totalLifeBonus += lycLifeBonus;
          }
          if (totalLifeBonus > 0) {
            html += '<div style="margin: 5px 0; color: #ff6666;">Life: +' + totalLifeBonus + '%</div>';
          }

          if (skill.meleeSplashBonus) {
            html += '<div style="margin: 5px 0; color: #ff9966;">Increased Melee Splash Radius: +' + skill.meleeSplashBonus + '%</div>';
          }
        }

        // Display Lycanthropy bonuses if invested
        if (lycanthropyLevel > 0 && lycanthropyData) {
          var lycIndex = Math.min(lycanthropyLevel - 1, 59);
          var arBonus = lycanthropyData.attackRatingBonus[lycIndex] || 0;

          html += '<div style="margin: 10px 0; border-top: 1px solid #666; padding-top: 5px;"></div>';
          html += '<div style="margin: 5px 0; color: #88ff88; font-style: italic;">From Lycanthropy (Level ' + lycanthropyLevel + '):</div>';

          // For Werewolf, show Life bonus from Lycanthropy
          if (skillId === 'werewolfcontainer') {
            var lifeBonus = lycanthropyData.lifeBonus[lycIndex] || 0;
            html += '<div style="margin: 5px 0; color: #ff6666;">Life: +' + lifeBonus + '%</div>';
          }

          // Show Attack Rating for both forms
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + arBonus + '%</div>';
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
      var manaCost = parseFloat((skill.manaCost[levelIndex] || 0).toFixed(1));
      var decoyCount = skill.decoys[Math.min(totalSkillLevel - 1, skill.decoys.length - 1)] || 1;

      html += '<div style="margin: 5px 0;">Damage: ' + damageMin + '-' + damageMax + '</div>';
      html += '<div style="margin: 5px 0;">Life: ' + life + '%</div>';
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: ' + attackRating + '</div>';
      html += '<div style="margin: 5px 0; color: #aaffaa;">All Resistances: +' + allRes + '%</div>';
      html += '<div style="margin: 5px 0;">Number of Decoys: ' + decoyCount + '</div>';
      html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
    } else if (skillId === 'valkyriecontainer') {
      // Display Valkyrie summon information
      var levelIndex = Math.min(totalSkillLevel - 1, skill.powerStrikeLevel.length - 1);
      var lifeHell = skill.life.hell[levelIndex] || 0;
      var powerStrikeLevel = skill.powerStrikeLevel[levelIndex] || 0;
      var attackRating = skill.attackRating[levelIndex] || 0;
      var defense = skill.defense[levelIndex] || 0;
      var allRes = skill.allResistances[levelIndex] || 0;
      var manaCost = parseFloat((skill.manaCost[levelIndex] || 0).toFixed(1));

      html += '<div style="margin: 5px 0;">Life (Hell): ' + lifeHell + '</div>';
      html += '<div style="margin: 5px 0; color: #cccccc;">Power Strike Level: ' + powerStrikeLevel + '</div>';
      html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + attackRating + '%</div>';
      html += '<div style="margin: 5px 0;">Defense: +' + defense + '%</div>';
      html += '<div style="margin: 5px 0; color: #aaffaa;">All Resistances: +' + allRes + '</div>';
      html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + manaCost + '</div>';
      html += '<div style="margin: 5px 0;">Cooldown: ' + skill.cooldown + 's</div>';
      html += '\u003cdiv style=\"margin: 5px 0; font-size: 11px; font-style: italic;\"\u003eCan summon additional Valkyrie at levels 20 and 30\u003c/div\u003e';
    }

    // Handle Curse skills
    if (skill.type === 'curse') {
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Enemy Physical Resistance Reduction
      if (skill.enemyPhysicalResist) {
        var physResist = skill.enemyPhysicalResist[levelIndex] || 0;

        // Add Curse Mastery bonus if applicable
        var curseMasteryInput = document.getElementById('cursemasterycontainer');
        var curseMasteryLevel = parseInt(curseMasteryInput && curseMasteryInput.value ? curseMasteryInput.value : '0') || 0;

        if (curseMasteryLevel > 0 && skill.synergies) {
          var physResistSynergy = skill.synergies.find(s => s.skillId === 'cursemasterycontainer' && s.damageType === 'physicalResist');
          if (physResistSynergy) {
            var bonus = curseMasteryLevel * physResistSynergy.bonusPerLevel;
            physResist -= bonus; // More negative = more reduction
            html += '\u003cdiv style=\"margin: 5px 0; color: #ff6666;\"\u003eEnemy Physical Resistance: ' + Math.floor(physResist) + '% (' + (skill.enemyPhysicalResist[levelIndex] || 0) + '% + ' + Math.floor(bonus) + '% Curse Mastery)\u003c/div\u003e';
          } else {
            html += '\u003cdiv style=\"margin: 5px 0; color: #ff6666;\"\u003eEnemy Physical Resistance: ' + physResist + '%\u003c/div\u003e';
          }
        } else {
          html += '\u003cdiv style=\"margin: 5px 0; color: #ff6666;\"\u003eEnemy Physical Resistance: ' + physResist + '%\u003c/div\u003e';
        }
      }

      // Enemy Attack Rating Reduction
      if (skill.enemyAttackRating) {
        var attackRating = skill.enemyAttackRating[levelIndex] || 0;

        // Add Curse Mastery bonus if applicable
        var curseMasteryInput = document.getElementById('cursemasterycontainer');
        var curseMasteryLevel = parseInt(curseMasteryInput && curseMasteryInput.value ? curseMasteryInput.value : '0') || 0;

        if (curseMasteryLevel > 0 && skill.synergies) {
          var arSynergy = skill.synergies.find(s => s.skillId === 'cursemasterycontainer' && s.damageType === 'attackRating');
          if (arSynergy) {
            var bonus = curseMasteryLevel * arSynergy.bonusPerLevel;
            attackRating -= bonus; // More negative = more reduction
            html += '\u003cdiv style=\"margin: 5px 0; color: #ffcc66;\"\u003eEnemy Attack Rating: ' + Math.floor(attackRating) + ' (' + (skill.enemyAttackRating[levelIndex] || 0) + ' + ' + Math.floor(bonus) + ' Curse Mastery)\u003c/div\u003e';
          } else {
            html += '\u003cdiv style=\"margin: 5px 0; color: #ffcc66;\"\u003eEnemy Attack Rating: ' + attackRating + '\u003c/div\u003e';
          }
        } else {
          html += '\u003cdiv style=\"margin: 5px 0; color: #ffcc66;\"\u003eEnemy Attack Rating: ' + attackRating + '\u003c/div\u003e';
        }
      }


      // Damage Returned (Iron Maiden)
      if (skill.damageReturned) {
        var damageReturn = skill.damageReturned[levelIndex] || 0;

        // Add Curse Mastery bonus if applicable
        var curseMasteryInput = document.getElementById('cursemasterycontainer');
        var curseMasteryLevel = parseInt(curseMasteryInput && curseMasteryInput.value ? curseMasteryInput.value : '0') || 0;

        if (curseMasteryLevel > 0 && skill.synergies) {
          var damageReturnSynergy = skill.synergies.find(s => s.skillId === 'cursemasterycontainer' && s.damageType === 'damageReturn');
          if (damageReturnSynergy) {
            var bonus = curseMasteryLevel * damageReturnSynergy.bonusPerLevel;
            var totalReturn = damageReturn + bonus;
            html += '\u003cdiv style=\"margin: 5px 0; color: #ff9966;\"\u003eDamage Returned: ' + Math.floor(totalReturn) + '% (' + damageReturn + '% + ' + Math.floor(bonus) + '% Curse Mastery)\u003c/div\u003e';
          } else {
            html += '\u003cdiv style=\"margin: 5px 0; color: #ff9966;\"\u003eDamage Returned: ' + damageReturn + '%\u003c/div\u003e';
          }
        } else {
          html += '\u003cdiv style=\"margin: 5px 0; color: #ff9966;\"\u003eDamage Returned: ' + damageReturn + '%\u003c/div\u003e';
        }
      }

      // Life Steal (Life Tap)
      if (skill.lifeSteal) {
        var lifeSteal = skill.lifeSteal[levelIndex] || 0;

        // Add Curse Mastery bonus if applicable
        var curseMasteryInput = document.getElementById('cursemasterycontainer');
        var curseMasteryLevel = parseInt(curseMasteryInput && curseMasteryInput.value ? curseMasteryInput.value : '0') || 0;

        if (curseMasteryLevel > 0 && skill.synergies) {
          var lifeStealSynergy = skill.synergies.find(s => s.skillId === 'cursemasterycontainer' && s.damageType === 'lifeSteal');
          if (lifeStealSynergy) {
            var bonus = curseMasteryLevel * lifeStealSynergy.bonusPerLevel;
            var totalSteal = lifeSteal + bonus;
            html += '\u003cdiv style=\"margin: 5px 0; color: #ff6699;\"\u003eLife Steal: +' + Math.floor(totalSteal) + '% (' + lifeSteal + '% + ' + Math.floor(bonus) + '% Curse Mastery)\u003c/div\u003e';
          } else {
            html += '\u003cdiv style=\"margin: 5px 0; color: #ff6699;\"\u003eLife Steal: +' + lifeSteal + '%\u003c/div\u003e';
          }
        } else {
          html += '\u003cdiv style=\"margin: 5px 0; color: #ff6699;\"\u003eLife Steal: +' + lifeSteal + '%\u003c/div\u003e';
        }
      }

      // Duration
      if (skill.duration) {
        var duration = Array.isArray(skill.duration) ? (skill.duration[levelIndex] || 0) : skill.duration;
        html += '\u003cdiv style=\"margin: 5px 0; color: #aaffaa;\"\u003eDuration: ' + duration + ' seconds\u003c/div\u003e';
      }

      // Radius
      if (skill.radius) {
        var radius = Array.isArray(skill.radius) ? (skill.radius[levelIndex] || 0) : skill.radius;

        // Add Curse Mastery radius bonus if applicable
        var curseMasteryInput = document.getElementById('cursemasterycontainer');
        var curseMasteryLevel = parseInt(curseMasteryInput && curseMasteryInput.value ? curseMasteryInput.value : '0') || 0;

        if (curseMasteryLevel > 0 && skill.synergies) {
          var radiusSynergy = skill.synergies.find(s => s.skillId === 'cursemasterycontainer' && s.damageType === 'radius');
          if (radiusSynergy) {
            var bonus = curseMasteryLevel * radiusSynergy.bonusPerLevel;
            html += '\u003cdiv style=\"margin: 5px 0; color: #aaddff;\"\u003eRadius: ' + (radius + bonus).toFixed(1) + ' yards (' + radius + ' + ' + bonus.toFixed(1) + ' Curse Mastery)\u003c/div\u003e';
          } else {
            html += '\u003cdiv style=\"margin: 5px 0; color: #aaddff;\"\u003eRadius: ' + radius + ' yards\u003c/div\u003e';
          }
        } else {
          html += '\u003cdiv style=\"margin: 5px 0; color: #aaddff;\"\u003eRadius: ' + radius + ' yards\u003c/div\u003e';
        }
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = Array.isArray(skill.manaCost) ? parseFloat((skill.manaCost[levelIndex] || 0).toFixed(1)) : parseFloat((skill.manaCost || 0).toFixed(1));
        html += '\u003cdiv style=\"margin: 5px 0; color: #6699ff;\"\u003eMana Cost: ' + mana + '\u003c/div\u003e';
      }
    }

    // Handle Aura skills
    if (skill.type === 'aura') {
      var levelIndex = Math.min(totalSkillLevel - 1, 59);

      // Radius
      if (skill.radius) {
        var radius = Array.isArray(skill.radius) ? (skill.radius[levelIndex] || 0) : skill.radius;
        html += '<div style="margin: 5px 0; color: #aaddff;">Radius: ' + radius.toFixed(1) + ' yards</div>';
      }

      // Might Aura - Party and Your Damage
      if (skillId === 'mightcontainer') {
        if (skill.partyDamage) {
          var partyDmg = skill.partyDamage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffaa66;">Party Damage: +' + partyDmg + '%</div>';
        }
        if (skill.yourDamage) {
          var yourDmg = skill.yourDamage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff9966;">Your Damage: +' + yourDmg + '%</div>';
        }
      }

      // Holy Fire Aura
      if (skillId === 'holyfirecontainer') {
        // Calculate synergy bonus for Holy Fire
        var synergyBonus = 0;
        if (skill.synergies) {
          skill.synergies.forEach(function (synergy) {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            if (synergyLevel > 0 && synergy.damageType === 'fire') {
              synergyBonus += synergyLevel * synergy.bonusPerLevel;
            }
          });
        }

        // Fire Attack Damage
        if (skill.fireAttackMin && skill.fireAttackMax) {
          var fireAttackMin = skill.fireAttackMin[levelIndex] || 0;
          var fireAttackMax = skill.fireAttackMax[levelIndex] || 0;

          if (synergyBonus > 0) {
            fireAttackMin = Math.floor(fireAttackMin * (1 + synergyBonus / 100));
            fireAttackMax = Math.floor(fireAttackMax * (1 + synergyBonus / 100));
          }

          html += '<div style="margin: 5px 0; color: #ff6600;">Fire Attack Damage: ' + fireAttackMin + '-' + fireAttackMax + '</div>';
        }

        // Attack Rating
        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        // Fire Aura Damage
        if (skill.fireAuraMin && skill.fireAuraMax) {
          var fireAuraMin = skill.fireAuraMin[levelIndex] || 0;
          var fireAuraMax = skill.fireAuraMax[levelIndex] || 0;

          if (synergyBonus > 0) {
            fireAuraMin = Math.floor(fireAuraMin * (1 + synergyBonus / 100));
            fireAuraMax = Math.floor(fireAuraMax * (1 + synergyBonus / 100));
          }

          html += '<div style="margin: 5px 0; color: #ff9933;">Fire Aura Damage: ' + fireAuraMin + '-' + fireAuraMax + '</div>';
        }

        // Display synergy bonus if any
        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
      }

      // Thorns Aura
      if (skillId === 'thornscontainer') {
        // Calculate synergy bonus for Thorns
        var synergyBonus = 0;
        if (skill.synergies) {
          skill.synergies.forEach(function (synergy) {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            if (synergyLevel > 0 && synergy.damageType === 'damage') {
              synergyBonus += synergyLevel * synergy.bonusPerLevel;
            }
          });
        }

        // Damage Returned
        if (skill.damageReturned) {
          var damageReturned = skill.damageReturned[levelIndex] || 0;

          if (synergyBonus > 0) {
            damageReturned = Math.floor(damageReturned * (1 + synergyBonus / 100));
          }

          html += '<div style="margin: 5px 0; color: #ff9966;">Damage Returned: ' + damageReturned + '</div>';
        }

        // Open Wounds Chance
        if (skill.openWoundsChance) {
          var owChance = skill.openWoundsChance[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffaa66;">Percent Chance Open Wounds: ' + owChance + '%</div>';
        }

        // Your Open Wounds Damage
        if (skill.yourOpenWoundsDamage) {
          var yourOWDmg = skill.yourOpenWoundsDamage[levelIndex] || 0;

          if (synergyBonus > 0) {
            yourOWDmg = Math.floor(yourOWDmg * (1 + synergyBonus / 100));
          }

          html += '<div style="margin: 5px 0; color: #ff6699;">Your Open Wounds Damage: ' + yourOWDmg + '</div>';
        }

        // Party Open Wounds Damage
        if (skill.partyOpenWoundsDamage) {
          var partyOWDmg = skill.partyOpenWoundsDamage[levelIndex] || 0;

          if (synergyBonus > 0) {
            partyOWDmg = Math.floor(partyOWDmg * (1 + synergyBonus / 100));
          }

          html += '<div style="margin: 5px 0; color: #ff99cc;">Party Open Wounds Damage: ' + partyOWDmg + '</div>';
        }

        // Display synergy bonus if any
        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
      }


      // Blessed Aim Aura
      if (skillId === 'blessedaimcontainer') {
        // Deadly Strike
        if (skill.deadlyStrike) {
          var ds = skill.deadlyStrike[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Deadly Strike: +' + ds + '%</div>';
        }

        // Attack Rating
        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        // Passive Target Defense (based on invested points, not total level)
        if (skill.passiveTargetDefense) {
          var skillInput = document.getElementById(skillId);
          var baseSkillLevel = parseInt(skillInput && skillInput.value ? skillInput.value : '0') || 0;
          var ptd = skill.passiveTargetDefense[Math.min(baseSkillLevel, skill.passiveTargetDefense.length - 1)] || 0;
          if (ptd !== 0) {
            html += '<div style="margin: 5px 0; color: #ff9966;">Passive Target Defense: ' + ptd + '%</div>';
          }
        }
      }

      // Concentration Aura
      if (skillId === 'concentrationcontainer') {
        // Attack Rating
        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        // Party Damage
        if (skill.partyDamage) {
          var partyDmg = skill.partyDamage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffaa66;">Party Damage: +' + partyDmg + '%</div>';
        }

        // Your Damage
        if (skill.yourDamage) {
          var yourDmg = skill.yourDamage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff9966;">Your Damage: +' + yourDmg + '%</div>';
        }

        // Blessed Hammer Damage
        if (skill.blessedHammerDamage) {
          var hammerDmg = skill.blessedHammerDamage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffdd66;">Your Blessed Hammer Skill Damage: +' + hammerDmg + '%</div>';
        }

        // Uninterrupted Attack
        if (skill.uninterruptedAttack) {
          html += '<div style="margin: 5px 0; color: #aaddff;">Chance for Uninterrupted Attack: +' + skill.uninterruptedAttack + '%</div>';
        }
      }

      // Holy Freeze Aura
      if (skillId === 'holyfreezecontainer') {
        // Calculate synergy bonus for Holy Freeze
        var synergyBonus = 0;
        if (skill.synergies) {
          skill.synergies.forEach(function (synergy) {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            if (synergyLevel > 0 && synergy.damageType === 'cold') {
              synergyBonus += synergyLevel * synergy.bonusPerLevel;
            }
          });
        }

        // Cold Attack Damage
        if (skill.coldAttackMin && skill.coldAttackMax) {
          var coldAttackMin = skill.coldAttackMin[levelIndex] || 0;
          var coldAttackMax = skill.coldAttackMax[levelIndex] || 0;

          if (synergyBonus > 0) {
            coldAttackMin = Math.floor(coldAttackMin * (1 + synergyBonus / 100));
            coldAttackMax = Math.floor(coldAttackMax * (1 + synergyBonus / 100));
          }

          html += '<div style="margin: 5px 0; color: #6699ff;">Cold Attack Damage: ' + coldAttackMin + '-' + coldAttackMax + '</div>';
        }

        // Attack Rating
        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        // Cold Aura Damage
        if (skill.coldAuraMin && skill.coldAuraMax) {
          var coldAuraMin = skill.coldAuraMin[levelIndex] || 0;
          var coldAuraMax = skill.coldAuraMax[levelIndex] || 0;

          if (synergyBonus > 0) {
            coldAuraMin = Math.floor(coldAuraMin * (1 + synergyBonus / 100));
            coldAuraMax = Math.floor(coldAuraMax * (1 + synergyBonus / 100));
          }

          html += '<div style="margin: 5px 0; color: #99ccff;">Cold Aura Damage: ' + coldAuraMin + '-' + coldAuraMax + '</div>';
        }

        // Enemy Speed
        if (skill.enemySpeed) {
          var enemySpeed = skill.enemySpeed[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #aaddff;">Enemy Speed: ' + enemySpeed + '%</div>';
        }

        // Display synergy bonus if any
        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
      }

      // Holy Shock Aura
      if (skillId === 'holyshockcontainer') {
        var synergyBonus = 0;
        if (skill.synergies) {
          skill.synergies.forEach(function (synergy) {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            if (synergyLevel > 0 && synergy.damageType === 'lightning') {
              synergyBonus += synergyLevel * synergy.bonusPerLevel;
            }
          });
        }

        if (skill.lightningAttackMin && skill.lightningAttackMax) {
          var lightningAttackMin = skill.lightningAttackMin[levelIndex] || 0;
          var lightningAttackMax = skill.lightningAttackMax[levelIndex] || 0;
          if (synergyBonus > 0) {
            lightningAttackMin = Math.floor(lightningAttackMin * (1 + synergyBonus / 100));
            lightningAttackMax = Math.floor(lightningAttackMax * (1 + synergyBonus / 100));
          }
          html += '<div style="margin: 5px 0; color: #ffff00;">Lightning Attack Damage: ' + lightningAttackMin + '-' + lightningAttackMax + '</div>';
        }

        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        if (skill.lightningAuraMin && skill.lightningAuraMax) {
          var lightningAuraMin = skill.lightningAuraMin[levelIndex] || 0;
          var lightningAuraMax = skill.lightningAuraMax[levelIndex] || 0;
          if (synergyBonus > 0) {
            lightningAuraMin = Math.floor(lightningAuraMin * (1 + synergyBonus / 100));
            lightningAuraMax = Math.floor(lightningAuraMax * (1 + synergyBonus / 100));
          }
          html += '<div style="margin: 5px 0; color: #ffff99;">Lightning Aura Damage: ' + lightningAuraMin + '-' + lightningAuraMax + '</div>';
        }

        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
      }

      // Sanctuary Aura
      if (skillId === 'sanctuarycontainer') {
        var synergyBonus = 0;
        if (skill.synergies) {
          skill.synergies.forEach(function (synergy) {
            var synergyInput = document.getElementById(synergy.skillId);
            var synergyLevel = parseInt(synergyInput && synergyInput.value ? synergyInput.value : '0') || 0;
            if (synergyLevel > 0 && synergy.damageType === 'magic') {
              synergyBonus += synergyLevel * synergy.bonusPerLevel;
            }
          });
        }

        if (skill.magicAttackMin && skill.magicAttackMax) {
          var magicAttackMin = skill.magicAttackMin[levelIndex] || 0;
          var magicAttackMax = skill.magicAttackMax[levelIndex] || 0;
          if (synergyBonus > 0) {
            magicAttackMin = Math.floor(magicAttackMin * (1 + synergyBonus / 100));
            magicAttackMax = Math.floor(magicAttackMax * (1 + synergyBonus / 100));
          }
          html += '<div style="margin: 5px 0; color: #ff66ff;">Magic Attack Damage: ' + magicAttackMin + '-' + magicAttackMax + '</div>';
        }

        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }

        if (skill.magicAuraMin && skill.magicAuraMax) {
          var magicAuraMin = skill.magicAuraMin[levelIndex] || 0;
          var magicAuraMax = skill.magicAuraMax[levelIndex] || 0;
          if (synergyBonus > 0) {
            magicAuraMin = Math.floor(magicAuraMin * (1 + synergyBonus / 100));
            magicAuraMax = Math.floor(magicAuraMax * (1 + synergyBonus / 100));
          }
          html += '<div style="margin: 5px 0; color: #ff99ff;">Magic Aura Damage: ' + magicAuraMin + '-' + magicAuraMax + '</div>';
        }

        if (skill.enemyMagicResist) {
          var enemyMagicRes = skill.enemyMagicResist[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff6666;">Enemy Magic Resistance: ' + enemyMagicRes + '%</div>';
        }

        if (synergyBonus > 0) {
          html += '<div style="margin: 5px 0; color: #aaffaa;">Synergy Bonus: +' + synergyBonus + '%</div>';
        }
      }

      // Fanaticism Aura
      if (skillId === 'fanaticismcontainer') {
        if (skill.attackRating) {
          var ar = skill.attackRating[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffcc66;">Attack Rating: +' + ar + '%</div>';
        }
        if (skill.partyDamage) {
          var partyDmg = skill.partyDamage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffaa66;">Party Damage: +' + partyDmg + '%</div>';
        }
        if (skill.yourDamage) {
          var yourDmg = skill.yourDamage[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff9966;">Your Damage: +' + yourDmg + '%</div>';
        }
        if (skill.attackSpeed) {
          var atkSpeed = skill.attackSpeed[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ffdd66;">Attack Speed: +' + atkSpeed + '%</div>';
        }
      }

      // Conviction Aura
      if (skillId === 'convictioncontainer') {
        if (skill.enemyDefense) {
          var enemyDef = skill.enemyDefense[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff6666;">Enemy Defense: ' + enemyDef + '%</div>';
        }
        if (skill.enemyElementalResist) {
          var enemyElemRes = skill.enemyElementalResist[levelIndex] || 0;
          html += '<div style="margin: 5px 0; color: #ff9966;">Enemy Fire/Cold/Lightning Resistances: ' + enemyElemRes + '%</div>';
        }
      }

      // Mana Cost
      if (skill.manaCost) {
        var mana = typeof skill.manaCost === 'number' ? skill.manaCost : (skill.manaCost[levelIndex] || 0);
        html += '<div style="margin: 5px 0; color: #6699ff;">Mana Cost: ' + mana + '</div>';
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
      return {
        min: 1,
        max: 2
      };
    }

    // Use window.getItemData to support both regular and crafted items
    var weapon = window.getItemData ? window.getItemData(weaponDropdown.value) : itemList[weaponDropdown.value];
    if (!weapon || !weapon.properties) {
      return {
        min: 1,
        max: 2
      };
    }

    var min = weapon.properties.onehandmin || weapon.properties.twohandmin || 1;
    var max = weapon.properties.onehandmax || weapon.properties.twohandmax || 2;

    return {
      min: min,
      max: max
    };
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
    const masteries = [
      'javelinandspearmasterycontainer',
      'clawanddaggermasterycontainer',
      'generalmasterycontainer',
      'throwingmasterycontainer',
      'polearmandspearmasterycontainer'
    ];
    let maxChance = 0;
    masteries.forEach(id => {
      const level = this.getSkillTotalLevel(id);
      if (level > 0) {
        const data = this.skillData[id]?.criticalStrike;
        if (data) {
          maxChance = Math.max(maxChance, data[Math.min(level - 1, data.length - 1)] || 0);
        }
      }
    });
    return maxChance;
  }

  getWeaponMasteryDamageBonus() {
    const masteries = [
      'javelinandspearmasterycontainer',
      'clawanddaggermasterycontainer',
      'generalmasterycontainer',
      'throwingmasterycontainer',
      'polearmandspearmasterycontainer'
    ];
    let maxBonus = 0;
    masteries.forEach(id => {
      const level = this.getSkillTotalLevel(id);
      if (level > 0) {
        const data = this.skillData[id]?.damage;
        if (data) {
          maxBonus = Math.max(maxBonus, data[Math.min(level - 1, data.length - 1)] || 0);
        }
      }
    });
    return maxBonus;
  }

  getWeaponMasteryName() {
    const masteries = [
      { id: 'javelinandspearmasterycontainer', name: 'Javelin Mastery' },
      { id: 'clawanddaggermasterycontainer', name: 'Claw Mastery' },
      { id: 'polearmandspearmasterycontainer', name: 'Spear Mastery' },
      { id: 'throwingmasterycontainer', name: 'Throwing Mastery' },
      { id: 'generalmasterycontainer', name: 'General Mastery' }
    ];
    let maxBonus = -1;
    let bestName = 'Weapon Mastery';
    masteries.forEach(m => {
      const level = this.getSkillTotalLevel(m.id);
      if (level > 0) {
        const data = this.skillData[m.id]?.damage;
        if (data && Array.isArray(data)) {
          const bonus = data[Math.min(level - 1, data.length - 1)] || 0;
          if (bonus > maxBonus) {
            maxBonus = bonus;
            bestName = m.name;
          }
        }
      }
    });
    return bestName;
  }

  getWeaponMasteryARBonus() {
    const masteries = [
      'javelinandspearmasterycontainer',
      'clawanddaggermasterycontainer',
      'generalmasterycontainer',
      'throwingmasterycontainer',
      'polearmandspearmasterycontainer'
    ];
    let maxBonus = 0;
    masteries.forEach(id => {
      const level = this.getSkillTotalLevel(id);
      if (level > 0) {
        const data = this.skillData[id]?.attackRating;
        if (data) {
          maxBonus = Math.max(maxBonus, data[Math.min(level - 1, data.length - 1)] || 0);
        }
      }
    });
    return maxBonus;
  }

  getPassiveARBonus() {
    let totalBonus = 0;

    // Penetrate (Amazon)
    const penetrateLevel = this.getSkillTotalLevel('penetratecontainer');
    if (penetrateLevel > 0) {
      const skill = this.skillData.penetratecontainer;
      const data = skill.attackRatingPercent || skill.attackRating;
      if (data) {
        totalBonus += data[Math.min(penetrateLevel - 1, data.length - 1)] || 0;
      }
    }

    // Weapon Masteries (Barbarian/Assassin/Amazon)
    totalBonus += this.getWeaponMasteryARBonus();

    return totalBonus;
  }

  getActiveSkillARBonus() {
    const dropdown = document.getElementById('active-skill-dropdown');
    if (!dropdown || !dropdown.value) return 0;

    const skillId = dropdown.value;
    const skill = this.skillData[skillId];
    if (!skill) return 0;

    // Some skills have AR%, some have flat AR (which is treated as % bonus in the formula for skill bonuses)
    const data = skill.attackRatingPercent || skill.attackRating;
    if (!data) return 0;

    const totalLevel = this.getSkillTotalLevel(skillId);
    if (totalLevel <= 0) return 0;

    let bonus = 0;
    if (Array.isArray(data)) {
      bonus = data[Math.min(totalLevel - 1, data.length - 1)] || 0;
    } else if (typeof data === 'object') {
      bonus = (data.base || 0) + ((data.perLevel || 0) * (totalLevel - 1));
    }

    return bonus;
  }

  getEnchantARBonus() {
    let totalBonus = 0;

    // Fire Enchant (Sorceress)
    const enchantFireLevel = this.getSkillTotalLevel('enchantfirecontainer');
    if (enchantFireLevel > 0) {
      const data = this.skillData.enchantfirecontainer.attackRating;
      if (data) {
        totalBonus += data[Math.min(enchantFireLevel - 1, data.length - 1)] || 0;
      }
    }

    // Cold Enchant (Sorceress)
    const coldenchantLevel = this.getSkillTotalLevel('coldenchantcontainer');
    if (coldenchantLevel > 0) {
      const data = this.skillData.coldenchantcontainer.attackRating;
      if (data) {
        totalBonus += data[Math.min(coldenchantLevel - 1, data.length - 1)] || 0;
      }
    }

    return totalBonus;
  }

  getWeaponElementalDamages() {
    var elementalDamages = {
      fire: {
        min: 0,
        max: 0
      },
      cold: {
        min: 0,
        max: 0
      },
      lightning: {
        min: 0,
        max: 0
      },
      poison: {
        min: 0,
        max: 0
      }
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
    // Get base damages from tables, supporting multiple data formats
    var levelIndex = Math.min(skillLevel - 1, 59);
    var baseLightningMin = (skill.lightningDamage ? skill.lightningDamage.min[levelIndex] : (skill.lightningDamageMin ? skill.lightningDamageMin[levelIndex] : (skill.damage ? skill.damage.min[levelIndex] : 0))) || 1;
    var baseLightningMax = (skill.lightningDamage ? skill.lightningDamage.max[levelIndex] : (skill.lightningDamageMax ? skill.lightningDamageMax[levelIndex] : (skill.damage ? skill.damage.max[levelIndex] : 0))) || 1;

    // Calculate synergy bonus for lightning
    var lightningSynergyBonus = this.calculateSynergyBonus(skillId, 'lightning');

    // Get Lightning Mastery bonus
    var lightningMasteryBonus = 0;
    var lightningMasteryInput = document.getElementById('lightningmasterycontainer');
    if (lightningMasteryInput) {
      var lightningMasteryLevel = this.getSkillTotalLevel('lightningmasterycontainer');
      if (lightningMasteryLevel > 0 && this.skillData.lightningmasterycontainer && this.skillData.lightningmasterycontainer.lightningDamage) {
        lightningMasteryBonus = this.skillData.lightningmasterycontainer.lightningDamage[Math.min(lightningMasteryLevel - 1, 59)] || 0;
      }
    }

    // Apply synergies and mastery to lightning damage
    var lightningMin = Math.floor(baseLightningMin * (1 + (lightningSynergyBonus + lightningMasteryBonus) / 100));
    var lightningMax = Math.floor(baseLightningMax * (1 + (lightningSynergyBonus + lightningMasteryBonus) / 100));

    var result = {
      lightningMin: lightningMin,
      lightningMax: lightningMax,
      average: Math.floor((lightningMin + lightningMax) / 2),
      averageLightning: Math.floor((lightningMin + lightningMax) / 2),
      synergyBonus: lightningSynergyBonus,
      masteryBonus: lightningMasteryBonus
    };

    // Check if this skill has nova damage (like Power Strike)
    if (skill.novaDamage || skill.novaDamageMin) {
      var baseNovaMin = (skill.novaDamage ? skill.novaDamage.min[levelIndex] : (skill.novaDamageMin ? skill.novaDamageMin[levelIndex] : 0)) || 1;
      var baseNovaMax = (skill.novaDamage ? skill.novaDamage.max[levelIndex] : (skill.novaDamageMax ? skill.novaDamageMax[levelIndex] : 0)) || 1;
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
    // Get base cold damages from tables, supporting multiple data formats
    var levelIndex = Math.min(skillLevel - 1, 59);
    var baseColdMin = (skill.coldDamage ? skill.coldDamage.min[levelIndex] : (skill.coldDamageMin ? skill.coldDamageMin[levelIndex] : (skill.damage ? skill.damage.min[levelIndex] : 0))) || 0;
    var baseColdMax = (skill.coldDamage ? skill.coldDamage.max[levelIndex] : (skill.coldDamageMax ? skill.coldDamageMax[levelIndex] : (skill.damage ? skill.damage.max[levelIndex] : 0))) || 0;

    // Calculate synergy bonus for cold
    var coldSynergyBonus = this.calculateSynergyBonus(skillId, 'cold');

    // Get Cold Mastery bonus
    var coldMasteryBonus = 0;
    var coldMasteryInput = document.getElementById('coldmasterycontainer');
    if (coldMasteryInput) {
      var coldMasteryLevel = this.getSkillTotalLevel('coldmasterycontainer');
      if (coldMasteryLevel > 0 && this.skillData.coldmasterycontainer && this.skillData.coldmasterycontainer.coldDamage) {
        coldMasteryBonus = this.skillData.coldmasterycontainer.coldDamage[Math.min(coldMasteryLevel - 1, 59)] || 0;
      }
    }

    // Apply synergies and mastery to cold damage
    var coldMin = Math.floor(baseColdMin * (1 + (coldSynergyBonus + coldMasteryBonus) / 100));
    var coldMax = Math.floor(baseColdMax * (1 + (coldSynergyBonus + coldMasteryBonus) / 100));

    return {
      coldMin: coldMin,
      coldMax: coldMax,
      average: Math.floor((coldMin + coldMax) / 2),
      averageCold: Math.floor((coldMin + coldMax) / 2),
      synergyBonus: coldSynergyBonus,
      masteryBonus: coldMasteryBonus
    };
  }

  calculateFireDamage(skill, skillLevel, skillId) {
    // Get base fire damages from tables, supporting multiple data formats
    var levelIndex = Math.min(skillLevel - 1, 59);
    var baseFireMin = (skill.fireDamage ? skill.fireDamage.min[levelIndex] : (skill.fireDamageMin ? skill.fireDamageMin[levelIndex] : (skill.damage ? skill.damage.min[levelIndex] : 0))) || 0;
    var baseFireMax = (skill.fireDamage ? skill.fireDamage.max[levelIndex] : (skill.fireDamageMax ? skill.fireDamageMax[levelIndex] : (skill.damage ? skill.damage.max[levelIndex] : 0))) || 0;

    // Calculate synergy bonus for fire
    var fireSynergyBonus = this.calculateSynergyBonus(skillId, 'fire');

    // Get Fire Mastery bonus
    var fireMasteryBonus = 0;
    var fireMasteryInput = document.getElementById('firemasterycontainer');
    if (fireMasteryInput) {
      var fireMasteryLevel = this.getSkillTotalLevel('firemasterycontainer');
      if (fireMasteryLevel > 0 && this.skillData.firemasterycontainer && this.skillData.firemasterycontainer.fireDamage) {
        fireMasteryBonus = this.skillData.firemasterycontainer.fireDamage[Math.min(fireMasteryLevel - 1, 59)] || 0;
      }
    }

    // Apply synergies and mastery to fire damage
    var fireMin = Math.floor(baseFireMin * (1 + (fireSynergyBonus + fireMasteryBonus) / 100));
    var fireMax = Math.floor(baseFireMax * (1 + (fireSynergyBonus + fireMasteryBonus) / 100));

    var result = {
      fireMin: fireMin,
      fireMax: fireMax,
      average: Math.floor((fireMin + fireMax) / 2),
      averageFire: Math.floor((fireMin + fireMax) / 2),
      synergyBonus: fireSynergyBonus,
      masteryBonus: fireMasteryBonus
    };

    // Check if this skill has burning damage (Immolation Arrow, Blaze, Meteor)
    if (skill.burningDamage || skill.burningDamageMin) {
      var baseBurningMin = (skill.burningDamage ? skill.burningDamage.min[levelIndex] : (skill.burningDamageMin ? skill.burningDamageMin[levelIndex] : 0)) || 0;
      var baseBurningMax = (skill.burningDamage ? skill.burningDamage.max[levelIndex] : (skill.burningDamageMax ? skill.burningDamageMax[levelIndex] : 0)) || 0;

      // Apply synergies and mastery to burning damage
      var burningMin = Math.floor(baseBurningMin * (1 + (fireSynergyBonus + fireMasteryBonus) / 100));
      var burningMax = Math.floor(baseBurningMax * (1 + (fireSynergyBonus + fireMasteryBonus) / 100));

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
      input.max = maxAllowed; // Update the HTML max attribute for instant visual feedback
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
    setTimeout(function () {
      warning.style.display = 'none';
    }, 3000);
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
    setTimeout(() => {
      this.updateSkillDropdown();
    }, 100);
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