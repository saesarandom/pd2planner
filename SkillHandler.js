class SkillHandler {
    constructor() {
      this.skillData = {

"amazon": {
      "javelinAndSpear": {
"jab": {
          "name": "Jab",
          "description": "Attacks with a series of rapid thrusts using a javelin or spear class weapon",
          "maxLevel": 99,
          "levelData": {
            "attackRating": {
              "base": 25,
              "perLevel": 12,
              "formula": "base + (perLevel * (level - 1))"
            },
            "damage": {
              "base": 30,
              "perLevel": 20,
              "formula": "base + (perLevel * (level - 1))"
            },
            "manaCost": {
              "base": 1.5,
              "perLevel": 0.2,
              "formula": "base + (perLevel * (level - 1))"
            }
          },
          "prerequisites": [],
          "synergies": ["fend"]
        },

        
"poisonJavelin": {
    "name": "Poison Javelin",
    "description": "Poison dmg enhanced attack over time",
    "maxLevel": 99,
    "levelData": {
        
      "poisonDamage": {
        "min": [2, 4, 6, 9, 11, 13, 16, 18, 25, 32,
        39, 46, 53, 60, 67, 74, 88, 102, 116, 131, 
        145, 159, 187, 215, 143, 271, 299, 327, 384, 440,
        496, 552, 609, 665, 721, 777, 834, 890, 946, 1002,
        1059, 1115, 1171, 1227, 1284, 1340, 1396, 1452, 1509, 1565, 
        1621, 1677, 1734, 1790, 1846, 1902, 1959, 2015, 2071, 2127],
        "max": [5,	7,	10,	12,	15,	17,	19,	22,	29,	37,
        44,	51,	58,	66,	73,	80,	95,	110,	124,	139,
        154,	168,	198,	227,	256,	286,	315,	344,	403,	461,
        520,	579,	637,	696,	754,	813,	871,	930,	989,	1047,
        1106,	1164,	1223,	1282,	1340,	1399,	1457,	1516,	1575,	1633,
        1692,	1750,	1809,	1868,	1926,	1985,	2043,	2102,	2161,	2219]
        
      },
      "manaCost": {
        "base": 2,
        "perLevel": 0.25,
        "formula": "base + (perLevel * (level - 1))"
      }
    },
    "prerequisites": [],
    "synergies": ["plagueJavelin", "javelinAndSpearMastery"]
},

"javelinAndSpearMastery": {
    "name": "Javelin and Spear Mastery",
    "description": "Increases damage and critical hit chance with javelin and spear class weapons",
    "maxLevel": 99,
    "levelData": {
      "damage": {
        "base": 40,
        "perLevel": 15,
        "formula": "base + (perLevel * (level - 1))"
      },
      "criticalChance": [5,	9,	12,	15,	17,	19,	20,	21,	23,	23,	24,	25,	26,	26,	27,	28,	28,	28,	29,	29,	29,	30,	30,	30,	30,	31,	31,	31,	31,	31,	32,	32,	32,	32,	32,	32,	32,	33,	33,	33,	33,	33,	33,	33,	33,	33,	33,	33,	34,	34,	34,	34,	34,	34,	34,	34,	34,	34,	34,	35]
    },
      "prerequisites": ["jab"]
},

"powerStrike": {
          "name": "Power Strike",
          "description": "Lightning enhanced massive attack",
          "maxLevel": 60,
          "levelData": {
            "attackRating": {
              "base": 20,
              "perLevel": 12,
              "formula": "base + (perLevel * (level - 1))"
            },
            "novaDamage": {
              "min": 1,
              "max": [3, 7, 11, 15, 19, 23,	27,	31,	39,	47,	55,	
              63,	71,	79,	87,	95,	123, 151, 179, 207, 235, 263, 308,
              	353,	398,	443,	488,	533,	595,	657,	719,	781,
                	843,	905,	967,	1029,	1091,	1153,	1215,	1277,	1339,
                  	1401,	1463,	1525,	1587,	1649,	1711,	1773,	1835,	1897,
                    	1959,	2021,	2083,	2145,	2207,	2269,	2331,	2393,	2455,	2517]

            },
            "lightningDamage": {
              "min": 1,
              "max": [1, 4, 7, 10,	13,	16,	19,	22,	27,	32,	37,	42,	47,
              	52,	57,	62,	75,	88,	101, 114,	127, 140, 162, 184,	206,
                	228,	250,	272,	304,	336,	368,	400,	432,	464,	
                  496,	528,	560,	592,	624,	656,	688,	720,	752,	
                  784,	816,	848,	880,	912,	944,	976,	1008,	1040,	
                  1072,	1104,	1136,	1168,	1200,	1232,	1264,	1296]
              
            },
            "manaCost": {
              "base": 2,
              "perLevel": 0.25,
              "formula": "base + (perLevel * (level - 1))"
            }
          },
          "prerequisites": ["jab"],
          "synergies": ["lightningBolt", "lightningStrike"]
},


"lightningBolt": {
          "name": "Lightning Bolt",
          "description": "Magically converts your javelin into a bolt of lightning, converts 100% of physical damage into lightning damage",
          "maxLevel": 99,
          "levelData": {

            "lightningDamage": {
              "min": 1,
              "max": [40,	52,	64,	76,	88,	100,	112,	124,	150,	176,	202,	
              228,	254,	280,	306,	332,	386,	440,	494,	548,	602,	656,	
              738,	820,	902,	984,	1066,	1148,	1258,	1368,	1478,	1588,	1698,	
              1808,	1918,	2028,	2138,	2248,	2358,	2468,	2578,	2688,	2798,	2908,	
              3018,	3128,	3238,	3348,	3458,	3568,	3678,	3788,	3898,	4008,	4118,	4228,	4338,	4448,	4558]
             },

            "manaCost": {
              "base": 4,
              "perLevel": 0.25,
              "formula": "base + (perLevel * (level - 1))"
            },
            "prerequisites": ["jab", "poisonJavelin", "powerStrike"],
          "synergies": ["powerStrike", "lightningFury"]
            
      },

 "fend": {
          "name": "Fend",
          "description": "Fending with javelins",
          "maxLevel": 99,
          "levelData": {
            "attackRating": {
              "base": 80,
              "perLevel": 6,
              "formula": "base + (perLevel * (level - 1))"
            },
            "damage": {
              "base": 100,
              "perLevel": 25,
              "formula": "base + (perLevel * (level - 1))"
            },
            "manaCost": {
              "base": 5,
              "perLevel": 0,
              "formula": "base + (perLevel * (level - 1))"
            }
          },
          "prerequisites": ["jab", "javelinAndSpearMastery"],
          "synergies": ["jab"]
   },
}
}
}
}
 






    }
  
    async loadSkillData() {
        // No need to fetch, data is already loaded in constructor
        return Promise.resolve();
    }

  
    getSkillInfo(className, treeName, skillName, level) {
        if (!this.skillData || level < 1 || level > 99) {
            return null;
        }
    
        const skill = this.skillData[className]?.[treeName]?.[skillName];
        if (!skill) {
            return null;
        }
    
        if (skillName === 'poisonJavelin') {
          return {
              level,
              name: skill.name,
              description: skill.description,
              damage: {
                  min: skill.levelData.poisonDamage.min[level - 1] || 0,
                  max: skill.levelData.poisonDamage.max[level - 1] || 0
              },
              manaCost: skill.levelData.manaCost.base + (skill.levelData.manaCost.perLevel * (level - 1))
          };
      }
    
        // For other skills that use the base/perLevel format
        const calculateValue = (data) => {
            if (!data || typeof data.base === 'undefined' || typeof data.perLevel === 'undefined') {
                return 0;
            }
            return data.base + (data.perLevel * (level - 1));
        };
    
        return {
            level,
            name: skill.name,
            description: skill.description,
            attackRating: calculateValue(skill.levelData.attackRating),
            damage: skill.levelData.damage ? calculateValue(skill.levelData.damage) : 0,
            manaCost: calculateValue(skill.levelData.manaCost),
            ...(skill.levelData.lightningDamage && {
                lightningDamage: skill.levelData.lightningDamage.max[level - 1] || 0
            })
        };
    }
  }