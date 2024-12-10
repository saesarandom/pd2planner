class SkillHandler {
  constructor() {
    this.skillData = {
      jab: { name: "Jab" },
      poisonJavelin: { name: "Poison Javelin" },
      plagueJavelin: { name: "Plague Javelin" }
    };
    console.log(Object.keys(this.skillData));
  
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

    if (skillName === "poisonJavelin") {
      return {
        level,
        name: skill.name,
        description: skill.description,
        damage: {
          min: skill.levelData.poisonDamage.min[level - 1] || 0,
          max: skill.levelData.poisonDamage.max[level - 1] || 0
        },
        manaCost: skill.levelData.manaCost.base + skill.levelData.manaCost.perLevel * (level - 1)
      };
    }

    const calculateValue = (data) => {
      if (!data || typeof data.base === "undefined" || typeof data.perLevel === "undefined") {
        return 0;
      }
      return data.base + data.perLevel * (level - 1);
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

