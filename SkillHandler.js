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
        synergies: ["fend,18"]
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
        synergies: ["plaguejavelin,24", "javelinandspearmastery,24"]
      },
      javelinAndSpearMastery: {
      name: "Javelin and Spear Mastery",
              description:
                "Increases damage and critical hit chance with javelin and spear class weapons",
              maxLevel: 99,
              levelData: {
                damage: {
                  base: 40,
                  perLevel: 15,
                  formula: "base + (perLevel * (level - 1))",
                },
                criticalChance: [
                  5, 9, 12, 15, 17, 19, 20, 21, 23, 23, 24, 25, 26, 26, 27, 28,
                  28, 28, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32,
                  32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33,
                  34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35]
              },
              prerequisites: ["jab"],
              synergies: []
      },
      powerStrike: {
              name: "Power Strike",
              description: "Lightning enhanced massive attack",
              maxLevel: 99,
              levelData: {
                attackRating: {
                  base: 20,
                  perLevel: 12,
                  formula: "base + (perLevel * (level - 1))"
                },
                // novaDamage: {
                //   min: 1,
                //   max: [
                //     3, 7, 11, 15, 19, 23, 27, 31, 39, 47, 55, 63, 71, 79, 87, 95,
                //     123, 151, 179, 207, 235, 263, 308, 353, 398, 443, 488, 533,
                //     595, 657, 719, 781, 843, 905, 967, 1029, 1091, 1153, 1215,
                //     1277, 1339, 1401, 1463, 1525, 1587, 1649, 1711, 1773, 1835,
                //     1897, 1959, 2021, 2083, 2145, 2207, 2269, 2331, 2393, 2455,
                //     2517]
                // },
                lightningDamage: {
                  min: 1,
                  max: [
                    1, 4, 7, 10, 13, 16, 19, 22, 27, 32, 37, 42, 47, 52, 57, 62,
                    75, 88, 101, 114, 127, 140, 162, 184, 206, 228, 250, 272, 304,
                    336, 368, 400, 432, 464, 496, 528, 560, 592, 624, 656, 688,
                    720, 752, 784, 816, 848, 880, 912, 944, 976, 1008, 1040, 1072,
                    1104, 1136, 1168, 1200, 1232, 1264, 1296]
                },
                manaCost: {
                  base: 2,
                  perLevel: 0.25,
                  formula: "base + (perLevel * (level - 1))"
                 }
                },
                 prerequisites: ["jab"],
                 synergies: ["lightningstrike,20", "lightningbolt,20"]
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
        synergies: ["powerstrike,14", "lightningfury,14"]
      },
      fend: {
        name: "Fend",
        description: "Fending with javelins",
        maxLevel: 99,
        levelData: {
          attackRating: {
              base: 80,
              perLevel: 6,
              formula: "base + (perLevel * (level - 1))"
            },
            damage: {
              base: 100,
              perLevel: 25,
              formula: "base + (perLevel * (level - 1))"
            },
            manaCost: {
              base: 5,
              perLevel: 0,
              formula: "base + (perLevel * (level - 1))"
            }
          },
          prerequisites: ["jab", "javelinAndSpearMastery"],
          synergies: ["jab,20"]
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
        synergies: ["powerstrike,8", "lightningstrike,8"]
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
          poisonDamage: {
            min: [23,	37,	51,	65,	79,	93,	107,	121,	150,	178,	206,	234,	262,	290,	318,	346,	393,	440,	487,	534,	581,	628,	721,	815,	909,	1003,	1096,	1190,	1378,	1565,	1753,	1940,	2128,	2315,	2503,	2690,	2878,	3065,	3253,	3440,	3628,	3815,	4003,	4190,	4378,	4565,	4753,	4940,	5128,	5315,	5503,	5690,	5878,	6065,	6253,	6440,	6628,	6815,	7003,	7190],
            max: [37,	51,	65,	79,	93,	107,	121,	135,	164,	192,	220,	248,	276,	304,	332,	360,	407,	454,	501,	548,	595,	642,	735,	829,	923,	1017,	1110,	1204,	1392,	1579,	1767,	1954,	2142,	2329,	2517,	2704,	2892,	3079,	3267,	3454,	3642,	3829,	4017,	4204,	4392,	4579,	4767,	4954,	5142,	5329,	5517,	5704,	5892,	6079,	6267,	6454,	6642,	6829,	7017,	7204]
          },
          manaCost: {
            base: 7,
            perLevel: 0.5,
            formula: "base + (perLevel * (level - 1))"
          }
        },
        prerequisites: ["jab", "poisonJavelin", "powerStrike", "lightningBolt"],
        synergies: ["poisonjavelin,12", "javelinandspearmastery,6"]
        },
        lightningStrike: {
          name: "Lightning Strike",
          description: "Chargedlightning javelin attack",
          maxLevel: 99,
          levelData: {
            lightningDamage: {
              min: 1,
              max: [25,	35,	45,	55,	65,	75,	85,	95,	115,	135,	155,	175,	195,	215,	235,	255,	290,	325,	360,	395,	430,	465,	520,	575,	630,	685,	740,	795,	870,	945,	1020,	1095,	1170,	1245,	1320,	1395,	1470,	1545,	1620,	1695,	1770,	1845,	1920,	1995,	2070,	2145,	2220,	2295,	2370,	2445,	2520,	2595,	2670,	2745,	2820,	2895,	2970,	3045,	3120]
            },
            manaCost: {
              base: 6,
              perLevel: 0.25,
              formula: "base + (perLevel * (level - 1))"
            }
          },
          prerequisites: ["jab", "powerStrike", "chargedStrike"],
          synergies: ["powerstrike,8", "chargedstrike,8"]
          },
          lightningFury: {
            name: "Lightning Fury",
            description: "Furious light attack",
            maxLevel: 99,
            levelData: {
              lightningDamage: {
                min: 1,
                max: [65,	73,	81,	89,	97,	105,	113,	121,	130,	139,	148,	157,	166,	175,	184,	193,	203,	213,	223,	233,	243,	253,	264,	275,	286,	297,	308,	319,	331,	343,	355,	367,	379,	391,	403,	415,	427,	439,	451,	463,	475,	487,	499,	511,	523,	535,	547,	559,	571,	583,	595,	607,	619,	631,	643,	655,	667,	679,	691,	703]
              },
              manaCost: {
                base: 5,
                perLevel: 0.25,
                formula: "base + (perLevel * (level - 1))"
              }
            },
            prerequisites: ["jab", "powerStrike", "poisonJavelin", "lightningBolt", "plagueJavelin"],
            synergies: ["powerstrike,3", "lightningbolt,3"]
            }

    };
    
  
 }


 
  async loadSkillData() {
    return Promise.resolve();
  }

  

  getSkillInfo(skillName, level) {
    if (!this.skillData || level < 0 || level > 99) {
        return null;
    }

    const skill = this.skillData[skillName];
    if (!skill) {
        return null;
    }

    const calculateSynergyBonus = (mainSkill) => {
        let synergyBonus = 0;
        if (mainSkill.synergies?.length > 0) {
            mainSkill.synergies.forEach(synergy => {
                if (typeof synergy === 'string') {
                    const [synergySkillName, synergyPercent] = synergy.split(',').map(s => s.trim());
                    const elementId = synergySkillName.toLowerCase() + 'container';
                    const synergyLevel = parseInt(document.getElementById(elementId)?.value || 0);
                    
                    if (synergyLevel > 0 && !isNaN(parseInt(synergyPercent))) {
                        synergyBonus += synergyLevel * parseInt(synergyPercent);
                    }
                }
            });
        }
        return 1 + (synergyBonus / 100);
    };

    const calculateValue = (data) => {
        if (!data?.base || !data?.perLevel) return 0;
        return data.base + data.perLevel * (level - 1);
    };

    const synergyMultiplier = calculateSynergyBonus(skill);

    // Handle poison type skills
    if ((skillName === "poisonJavelin" || skillName === "plagueJavelin")) {
        return {
            level,
            name: skill.name,
            description: skill.description,
            damage: {
                min: Math.floor((skill.levelData.poisonDamage.min[level - 1] || 0) * synergyMultiplier),
                max: Math.floor((skill.levelData.poisonDamage.max[level - 1] || 0) * synergyMultiplier)
            },
            manaCost: calculateValue(skill.levelData.manaCost)
        };
    }

    // Handle regular skills
    const baseDamage = skill.levelData.damage ? calculateValue(skill.levelData.damage) : 0;

    return {
        level,
        name: skill.name,
        description: skill.description,
        attackRating: Math.floor(calculateValue(skill.levelData.attackRating)),
        damage: Math.floor(baseDamage * synergyMultiplier),
        manaCost: calculateValue(skill.levelData.manaCost),
        ...(skill.levelData.lightningDamage && {
            lightningDamage: Math.floor(skill.levelData.lightningDamage.max[level - 1] * synergyMultiplier) || 0
        })
    };
}}
