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
            },
      innerSight: {
            name: "Inner Sight",
            description: "Illuminates nearby enemies",
            maxLevel: 99,
            levelData: {
              enemyAr: {
                base: [10,	11,	12,	13,	14,	15,	16,	17,	18,	19,	20,	21,	22,	23,	24,	25,	26,	27,	28,	29,	30,	31,	32,	33,	34,	35,	36,	37,	38,	39,	40,	40,	40],
              },
              enemyDefense: {
                base: [-40,	-65,	-90,	-115,	-140,	-165,	-190,	-215,	-260,	-305,	-350,	-395,	-440,	-485,	-530,	-575,	-635,	-695,	-755,	-815,	-875,	-935,	-1015,	-1095,	-1175,	-1255,	-1335,	-1415,	-1515,	-1615,	-1715,	-1815,	-1915,	-2015,	-2115,	-2215,	-2315,	-2415,	-2515,	-2615,	-2715,	-2815,	-2915,	-3015,	-3115,	-3215,	-3315,	-3415,	-3515,	-3615,	-3715,	-3815,	-3915,	-4015,	-4115,	-4215,	-4315,	-4415,	-4515,	-4615],
              },
              manaCost: {
                base: 5,
                perLevel: 0,
                formula: "base + (perLevel * (level - 1))"
              }
            },
            prerequisites: [],
            synergies: []
            },
      criticalStrike: {
              name: "Critical Strike",
              description: "Chance to 1.5x damage to enemy",
              maxLevel: 99,
              levelData: {
                criticalChance: {
                  base: [15,	23,	30,	35,	40,	43,	46,	48,	51,	52,	54,	56,	57,	58,	59,	61,	61,	62,	63,	63,	64,	65,	65,	66,	66,	67,	68,	68,	68,	68,	69,	69,	70,	70,	70,	70,	70,	71,	71,	71,	71,	72,	72,	72,	72,	72,	72,	72,	73,	73,	73,	73,	73,	74,	74,	74,	74,	74,	74,	75],
             }
            },
      },
      evade: {
            name: "Evade",
            description: "Moving faster, chance to evade enemy attack",
            maxLevel: 99,
            levelData: {
              evadeChance: {
                base: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 40, 40],
              },
              movementSpeed: {
                base: [-40, -65, -90, -115, -140, -165, -190, -215, -260, -305, -350, -395, -440, -485, -530, -575, -635, -695, -755, -815, -875, -935, -1015, -1095, -1175, -1255, -1335, -1415, -1515, -1615, -1715, -1815, -1915, -2015, -2115, -2215, -2315, -2415, -2515, -2615, -2715, -2815, -2915, -3015, -3115, -3215, -3315, -3415, -3515, -3615, -3715, -3815, -3915, -4015, -4115, -4215, -4315, -4415, -4515, -4615],
              }
      },
      slowMovement: {
            name: "Slow Movement",
            description: "Slowing enemy attack speed to value and their movement speed",
            maxLevel: 99,
            levelData: {
              movementSpeed: {
                  base: [-20,	-22,	-24,	-26,	-28,	-30,	-32,	-34,	-36,	-38,	-40,	-42,	-44,	-46,	-48,	-50,	-52,	-54,	-56,	-58,	-60,	-62,	-64,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65,	-65],
                },
              rangedSpeed: {
                  base: [75,	73,	71,	69,	67,	65,	63,	61,	59,	57,	55,	53,	51,	49,	47,	45,	44,	43,	42,	41,	40,	39,	38,	37,	36,	35,	34,	33,	32,	31,	30,	29,	28,	27,	26,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25,	25]
                }
            },
            prerequisites: ["innerSight"],
            synergies: []
      },
      pierce: {
            name: "Pierce",
            description: "Chance for attacks to pierce through",
            maxLevel: 99,
            levelData: {
              pierceChance: {
                  base: [30,	33,	36,	39,	42,	45,	48,	51,	53,	55,	57,	59,	61,	63,	65,	67,	69,	71,	73,	75,	77,	79,	80,	81,	82,	83,	84,	85,	86,	87,	88,	89,	90,	91,	92,	93,	94,	95,	96,	97,	98,	99,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100,	100]
                }
              },
              prerequisites: ["criticalStrike"],
              synergies: []
            
      },
      dodge: {
            name: "Dodge",
            description: "Chance to dodge enemies attacks when attacking or standing still",
            maxLevel: 99,
            levelData: {
              dodgeChance: {
                base: [6,	11,	15,	18,	20,	22,	24,	25,	26,	27,	28,	29,	30,	31,	31,	32,	32,	32,	33,	33,	34,	34,	34,	35,	35,	36,	36,	36,	36,	36,	36,	36,	37,	37,	37,	37,	37,	38,	38,	38,	38,	38,	38,	38,	38,	38,	38,	38,	39,	39,	39,	39,	39,	39,	39,	39,	39,	39,	39,	40],
              },
              cooldown: {
                  base: 0.16
              }
          },
          prerequisites: ["innerSight", "avoid", "slowMovement"],
          synergies: []
      },
      decoy: {
            name: "Decoy",
            description: "Summon attacking decoys",
            maxLevel: 99,
            levelData: {
              damage: {
                min: [35,	39,	43,	47,	51,	55,	59,	63,	69,	75,	81,	87,	93,	99,	105,	111,	120,	129,	138,	147,	156,	165,	177,	189,	201,	213,	225,	237,	252,	267,	282,	297,	312,	327,	342,	357,	372,	387,	402,	417,	432,	447,	462,	477,	492,	507,	522,	537,	552,	567,	582,	597,	612,	627,	642,	657,	672,	687,	702,	717],
                max: [50,	56,	62,	68,	74,	80,	86,	92,	100,	108,	116,	124,	132,	140,	148,	156,	167,	178,	189,	200,	211,	222,	236,	250,	264,	278,	292,	306,	323,	340,	357,	374,	391,	408,	425,	442,	459,	476,	493,	510,	527,	544,	561,	578,	595,	612,	629,	646,	663,	680,	697,	714,	731,	748,	765,	782,	799,	816,	833,	850]
              },
              decoys: {
                base: 1,
                formula: "base + level/10"
              }
              },
              prerequisites: ["innerSight", "slowMovement"],
              synergies: ["strafe,10", "valkyrie,10", "criticalStrike", "pierce", "penetrate"]
            
      },
      penetrate: {
            name: "Penetrate",
            description: "Increases your attack rating and lowers enemy def",
            maxLevel: 99,
            levelData: {
              attackRating: {
                base: [35,	39,	43,	47,	51,	55,	59,	63,	69,	75,	81,	87,	93,	99,	105,	111,	120,	129,	138,	147,	156,	165,	177,	189,	201,	213,	225,	237,	252,	267,	282,	297,	312,	327,	342,	357,	372,	387,	402,	417,	432,	447,	462,	477,	492,	507,	522,	537,	552,	567,	582,	597,	612,	627,	642,	657,	672,	687,	702,	717],   
              },
              enemyDefensePercent: {
                base: -5,
                perLevel: -2,
                formula: "base + (perLevel * (level - 1))"
              },
              prerequisites: ["criticalStrike", "pierce"]
            }
      },
      valkyrie: {
            name: "Valkyrie",
            description: "Summon attacking valkyrie companion",
            maxLevel: 99,
            levelData: {
              lifeHell: {
                min: [940,	1005,	1071,	1137,	1203,	1269,	1334,	1400,	1466,	1532,	1598,	1663,	1729,	1795,	1861,	1927,	1992,	2058,	2124,	2190,	2256,	2321,	2387,	2453,	2519,	2585,	2650,	2716,	2782,	2848,	2914,	2979,	3045,	3111,	3177,	3243,	3308,	3374,	3440,	3506,	3572,	3637,	3703,	3769,	3835,	3901,	3966,	4032,	4098,	4164,	4230,	4295,	4361,	4427,	4493,	4559,	4624,	4690,	4756,	4822],              
              },
              powerStrikeLevel: {
                base: 5,
                perLevel: 1,
                formula: "base + (perLevel * (level/2))"
              },
              prerequisites: ["innerSight", "slowMovement", "decoy"],
              synergies: ["decoy,20", "pierce,2", "penetrate,40", "powerStrike,20", "criticalStrike"]
            }
      },
      magicArrow: {
            name: "Magic Arrow",
            description: "Creates a magical arrow or bolt that does extra damage",
            maxLevel: 99,
            levelData: {
              damage: {
                min: [2,	3,	5,	6,	8,	9,	11,	12,	16,	20,	24,	27,	31,	35,	39,	42,	54,	65,	76,	87,	99,	110,	132,	154,	176,	198,	220,	242,	275,	308,	341,	374,	407,	440,	473,	506,	539,	572,	605,	638,	671,	704,	737,	770,	803,	836,	869,	902,	935,	968,	1001,	1034,	1067,	1100,	1133,	1166,	1199,	1232,	1265,	1298],              
                max: [3,	6,	8,	10,	12,	15,	17,	19,	24,	30,	35,	40,	45,	51,	56,	61,	74,	87,	99,	112,	125,	138,	162,	186,	210,	234,	258,	282,	317,	352,	387,	422,	457,	492,	527,	562,	597,	632,	667,	702,	737,	772,	807,	842,	877,	912,	947,	982,	1017,	1052,	1087,	1122,	1157,	1192,	1227,	1262,	1297,	1332,	1367,	1402]
              },
              manaCost: {
                base: 2,
                perLevel: 0.1,
                formula: "base + (perLevel * (level - 1))"
               }
              },
              prerequisites: [],
              synergies: ["innerSight,20", "slowMovement,20", "guidedArrow,20"]
            
            },
    }  
  }; 
 }


 
  async loadSkillData() {
    return Promise.resolve();
  }

  

  // getSkillInfo(skillName, level) {
  //   if (!this.skillData || level < 0 || level > 99) {
  //       return null;
  //   }

  //   const skill = this.skillData[skillName];
  //   if (!skill) {
  //       return null;
  //   }

  getSkillInfo(skillName, level) {
    console.log('getSkillInfo called with:', {
        skillName,
        level,
        skillExists: !!this.skillData[skillName],
        availableSkills: Object.keys(this.skillData)
    });

    if (!this.skillData || level < 0 || level > 99) {
        console.log('Validation failed:', {
            hasSkillData: !!this.skillData,
            levelValid: level >= 0 && level <= 99
        });
        return null;
    }

    const skill = this.skillData[skillName];
    if (!skill) {
        console.log('Skill not found:', skillName);
        return null;
    }

    console.log('Found skill data:', skill);



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

    if (skillName === "javelinAndSpearMastery") {
      return {
          level,
          name: skill.name,
          description: skill.description,
          criticalChance: skill.levelData.criticalChance[level - 1] || 0    
      };
  }

  if (skill.levelData.damage?.min && Array.isArray(skill.levelData.damage.min)) {
    return {
        level,
        name: skill.name,
        description: skill.description,
        damage: {
            min: skill.levelData.damage.min[level - 1] || 0,
            max: skill.levelData.damage.max[level - 1] || 0
        },
        decoys: Math.floor(skill.levelData.decoys.base + level/10)  // Special handling for decoy count
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
