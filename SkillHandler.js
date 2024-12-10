class SkillHandler {
  constructor() {
    this.skillData = {
      jab: {
        name: "Jab",
        description: "Attacks with a series of rapid thrusts using a javelin or spear class weapon",
        maxLevel: 99,
        levelData: {
          attackRating: {
            base: 25,
            perLevel: 12,
            formula: "base + (perLevel * (level - 1))"
          },
          damage: {
            base: 30,
            perLevel: 20,
            formula: "base + (perLevel * (level - 1))"
          },
          manaCost: {
            base: 1.5,
            perLevel: 0.2,
            formula: "base + (perLevel * (level - 1))"
          }
        },
        prerequisites: [],
        synergies: ["fend"]
      },
      poisonJavelin: {
        name: "Poison Javelin",
        description: "Poison dmg enhanced attack over time",
        maxLevel: 99,
        levelData: {
          poisonDamage: {
            min: [2, 4, 6, 9, 11, 13, 16, 18, 25, 32, 39, 46, 53, 60, 67, 74, 88, 102, 116, 131, 145, 159, 187, 215, 143, 271, 299, 327, 384, 440, 496, 552, 609, 665, 721, 777, 834, 890, 946, 1002, 1059, 1115, 1171, 1227, 1284, 1340, 1396, 1452, 1509, 1565, 1621, 1677, 1734, 1790, 1846, 1902, 1959, 2015, 2071, 2127],
            max: [5, 7, 10, 12, 15, 17, 19, 22, 29, 37, 44, 51, 58, 66, 73, 80, 95, 110, 124, 139, 154, 168, 198, 227, 256, 286, 315, 344, 403, 461, 520, 579, 637, 696, 754, 813, 871, 930, 989, 1047, 1106, 1164, 1223, 1282, 1340, 1399, 1457, 1516, 1575, 1633, 1692, 1750, 1809, 1868, 1926, 1985, 2043, 2102, 2161, 2219]
          },
          manaCost: {
            base: 2,
            perLevel: 0.25,
            formula: "base + (perLevel * (level - 1))"
          }
        },
        prerequisites: [],
        synergies: ["plagueJavelin", "javelinAndSpearMastery"]
      },
      lightningBolt: {
        name: "Lightning Bolt",
        description: "Magically converts your javelin into a bolt of lightning, converts 100% of physical damage into lightning damage",
        maxLevel: 99,
        levelData: {
          lightningDamage: {
            min: 1,
            max: [40, 52, 64, 76, 88, 100, 112, 124, 150, 176, 202, 228, 254, 280, 306, 332, 386, 440, 494, 548, 602, 656, 738, 820, 902, 984, 1066, 1148, 1258, 1368, 1478, 1588, 1698, 1808, 1918, 2028, 2138, 2248, 2358, 2468, 2578, 2688, 2798, 2908, 3018, 3128, 3238, 3348, 3458, 3568, 3678, 3788, 3898, 4008, 4118, 4228, 4338, 4448, 4558]
          },
          manaCost: {
            base: 4,
            perLevel: 0.25,
            formula: "base + (perLevel * (level - 1))"
          }
        },
        prerequisites: ["jab", "poisonJavelin", "powerStrike"],
        synergies: ["powerStrike", "lightningFury"]
      },
      chargedStrike: {
        name: "Charged Strike",
        description: "Charged javelin attack",
        maxLevel: 99,
        levelData: {
          attackRating: {
            base: 30,
            perLevel: 3,
            formula: "base + (perLevel * (level - 1))"
          },
          damage: {
            base: 400,
            perLevel: 25,
            formula: "base + (perLevel * (level - 1))"
          },
          manaCost: {
            base: 6,
            perLevel: 0,
            formula: "base + (perLevel * (level - 1))"
          }
        },
        prerequisites: ["jab", "powerStrike"],
        synergies: ["powerStrike", "lightningStrike"]
      },
      plagueJavelin: {
        name: "Plague Javelin",
        description: "Charged javelin attack",
        maxLevel: 99,
        levelData: {
          attackRating: {
            base: 50,
            perLevel: 10,
            formula: "base + (perLevel * (level - 1))"
          },
          damage: {
            base: 100,
            perLevel: 25,
            formula: "base + (perLevel * (level - 1))"
          },
          manaCost: {
            base: 7,
            perLevel: 0.5,
            formula: "base + (perLevel * (level - 1))"
          }
        },
        prerequisites: ["jab", "powerStrike"],
        synergies: ["powerStrike", "lightningStrike"]
      }
    };
  }

  async loadSkillData() {
    return Promise.resolve();
  }

  getSkillInfo(skillName, level) {
    if (!this.skillData || level < 1 || level > 99) {
        return null;
    }

    const skill = this.skillData[skillName];
    if (!skill) {
        return null;
    }

    const calculateValue = (data) => {
        if (!data || typeof data.base === "undefined" || typeof data.perLevel === "undefined") {
            return 0;
        }
        return data.base + data.perLevel * (level - 1);
    };

    // Base info for all skills
    const result = {
        level,
        name: skill.name,
        description: skill.description,
        attackRating: calculateValue(skill.levelData.attackRating),
        manaCost: calculateValue(skill.levelData.manaCost)
    };

    // Handle different damage types
    if (skillName === "poisonJavelin") {
        result.damage = {
            min: skill.levelData.poisonDamage.min[level - 1] || 0,
            max: skill.levelData.poisonDamage.max[level - 1] || 0
        };
    } else if (skillName === "lightningBolt" || skillName === "powerStrike") {
        result.damage = {
            min: 1,
            max: skill.levelData.lightningDamage.max[level - 1] || 0
        };
    } else if (skill.levelData.damage) {
        result.damage = calculateValue(skill.levelData.damage);
    }

    return result;
}}