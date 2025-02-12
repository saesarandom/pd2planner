document.addEventListener("DOMContentLoaded", () => {
  // Define corruption modifiers for each item type
  const helmCorruptions = [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    {
      mod: "Indestructible , +[50-80]% Enhanced Defense",
      type: "numeric",
      range: [50, 80],
    },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    {
      mod: "+[150-250] to Attack Rating, +[2-4] to Light Radius",
      type: "double",
      range: [
        [150, 250],
        [2, 4],
      ],
    },
    { mod: "+10% Curse Resistance", type: "fixed" },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "[3-5]% Life Stolen per Hit", type: "numeric", range: [3, 5] },
    { mod: "All Resistances +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "Replenish Life +[20-30]", type: "numeric", range: [20, 30] },
    { mod: "[3-5]% Mana Stolen per Hit", type: "numeric", range: [3, 5] },
    {
      mod: "Physical Damage Taken Reduced by [4-6]%",
      type: "numeric",
      range: [4, 6],
    },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    {
      mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "+[3-4] Life after each Kill", type: "numeric", range: [3, 4] },
    {
      mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    {
      mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    {
      mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
  ];

  const armorCorruptions = [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [30, 30] },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+[30-40] Mana", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    {
      mod: "Indestructible, +[50-80]% Enhanced Defense",
      type: "numeric",
      range: [50, 80],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+20% Faster Run/Walk", type: "fixed" },
    {
      mod: "+10% Faster Block Rate, [10-20]% Increased Chance of Blocking",
      type: "numeric",
      range: [10, 20],
    },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    {
      mod: "Physical Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Magic Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)",
      type: "fixed",
    },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    {
      mod: "Physical Damage Taken Reduced by [6-8]%",
      type: "numeric",
      range: [6, 8],
    },
    {
      mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    {
      mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    {
      mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
    {
      mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +15%",
      type: "numeric",
      range: [4, 5],
    },
  ];

  const weaponCorruptions = [
    { mod: "+[40-80]% Enhanced Damage", type: "numeric", range: [40, 80] },
    { mod: "+[150-250] to Attack Rating", type: "numeric", range: [150, 250] },
    {
      mod: "+[100-150]% Enhanced Damage to Demons",
      type: "numeric",
      range: [100, 150],
    },
    {
      mod: "+200 to Attack Rating against Demons",
      type: "numeric",
      range: [200, 200],
    },
    {
      mod: "+[100-150]% Enhanced Damage to Undead",
      type: "numeric",
      range: [100, 150],
    },
    {
      mod: "+200 to Attack Rating against Undead",
      type: "numeric",
      range: [200, 200],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[3-6] Life after each Hit", type: "numeric", range: [3, 6] },
    { mod: "+[3-6] Life after each Kill", type: "numeric", range: [3, 6] },
    { mod: "+[3-5] to Mana after each Kill", type: "numeric", range: [3, 5] },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "Requirements -[25-50]%", type: "numeric", range: [25, 50] },
    { mod: "+20% Faster Cast Rate", type: "fixed" },
    {
      mod: "+[30-40]% Increased Attack Speed",
      type: "numeric",
      range: [30, 40],
    },
    { mod: "+[40-60]% Enhanced Damage", type: "numeric", range: [40, 60] },
    { mod: "5% Life Stolen per Hit", type: "fixed" },
    {
      mod: "[-40-60] Target Defense per Hit",
      type: "numeric",
      range: [-40, -60],
    },
    {
      mod: "[20-30]% Chance of Crushing Blow",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "[20-30]% Deadly Strike", type: "numeric", range: [20, 30] },
    { mod: "+1 to All Skills", type: "fixed" },
    {
      mod: "+[30-40]% Increased Attack Speed",
      type: "numeric",
      range: [30, 40],
    },
    {
      mod: "[20-30]% Chance of Crushing Blow",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+[50-70]% Enhanced Damage", type: "numeric", range: [50, 70] },
    { mod: "25% Deadly Strike", type: "fixed" },
    { mod: "Ignores Target's Defense", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Fire Skill Damage", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Cold Skill Damage", type: "numeric", range: [5, 10] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    {
      mod: "+[5-10] to Lightning Skill Damage",
      type: "numeric",
      range: [5, 10],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[5-10] to Poison Skill Damage", type: "numeric", range: [5, 10] },
  ];

  const offCorruptions = [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "+20% Faster Block Rate", type: "fixed" },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+[30-40] Life", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Cold Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Lightning Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Poison Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Block Rate", type: "fixed" },
    {
      mod: "[10-20]% Increased Chance of Blocking",
      type: "numeric",
      range: [10, 20],
    },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    {
      mod: "Physical Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Magic Damage Taken Reduced by [6-10]",
      type: "numeric",
      range: [6, 10],
    },
    {
      mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)",
      type: "fixed",
    },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    {
      mod: "Physical Damage Taken Reduced by [6-8]%",
      type: "numeric",
      range: [6, 8],
    },
    {
      mod: "+[4-5]% to Maximum Fire Resist, Fire Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
    {
      mod: "+[4-5]% to Maximum Cold Resist, Cold Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
    {
      mod: "+[4-5]% to Maximum Lightning Resist, Lightning Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
    {
      mod: "+[4-5]% to Maximum Poison Resist, Poison Resist +[15-20]%",
      type: "double",
      range: [
        [4, 5],
        [15, 20],
      ],
    },
  ];

  const gloveCorruptions = [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "Regenerate Mana [20-30]%", type: "numeric", range: [20, 30] },
    { mod: "+[10-20]% Faster Block Rate", type: "numeric", range: [10, 20] },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    {
      mod: "[50-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [50, 100],
    },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    {
      mod: "[10-25]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [10, 25],
    },
    { mod: "[2-3]% Life Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[2-3]% Mana Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "-[15-25]% Target Defense", type: "numeric", range: [-15, -25] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "10% Deadly Strike", type: "fixed" },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
  ];

  const beltCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    {
      mod: "Attacker Takes Damage of [2-396] ([2-4] per Level)",
      type: "fixed",
    },
    {
      mod: "[60-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [60, 100],
    },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    {
      mod: "Physical Damage Taken Reduced by [3-4]%",
      type: "numeric",
      range: [3, 4],
    },
  ];

  const bootCorruptions = [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "Regenerate Mana [10-15]%", type: "numeric", range: [10, 15] },
    {
      mod: "[50-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [50, 100],
    },
    {
      mod: "[10-25]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [10, 25],
    },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Indestructible", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+10% Faster Block Rate", type: "fixed" },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "Replenish Life +[15-25]", type: "numeric", range: [15, 25] },
    { mod: "+15% Faster Run/Walk", type: "fixed" },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    {
      mod: "Physical Damage Taken Reduced by [3-4]%",
      type: "numeric",
      range: [3, 4],
    },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    {
      mod: "+[2-3]% to Maximum Fire Resist, Fire Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
    {
      mod: "+[2-3]% to Maximum Cold Resist, Cold Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
    {
      mod: "+[2-3]% to Maximum Lightning Resist, Lightning Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
    {
      mod: "+[2-3]% to Maximum Poison Resist, Poison Resist +10%",
      type: "numeric",
      range: [2, 3],
    },
  ];

  const ringOneCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    {
      mod: "Physical Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    {
      mod: "Magic Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    {
      mod: "[40-80]% Extra Gold from Monsters",
      type: "numeric",
      range: [40, 80],
    },
    {
      mod: "[15-20]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [15, 20],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "10% Reduced Curse Duration", type: "fixed" },
    { mod: "[3-4]% Mana Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "[3-4]% Life Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "+[4-6] to All Attributes", type: "numeric", range: [4, 6] },
    { mod: "All Resistances +[4-6]", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by 3%", type: "fixed" },
  ];

  const ringTwoCorruptions = [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    {
      mod: "Physical Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    {
      mod: "Magic Damage Taken Reduced by [4-6]",
      type: "numeric",
      range: [4, 6],
    },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    {
      mod: "[40-80]% Extra Gold from Monsters",
      type: "numeric",
      range: [40, 80],
    },
    {
      mod: "[15-20]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [15, 20],
    },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "10% Reduced Curse Duration", type: "fixed" },
    { mod: "[3-4]% Mana Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "[3-4]% Life Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "+[4-6] to All Attributes", type: "numeric", range: [4, 6] },
    { mod: "All Resistances +[4-6]", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by 3%", type: "fixed" },
  ];

  const amuletCorruptions = [
    { mod: "+[6-12] to Strength", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Dexterity", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Vitality", type: "numeric", range: [6, 12] },
    { mod: "+[6-12] to Energy", type: "numeric", range: [6, 12] },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "+[10-20]% Chance to Pierce", type: "numeric", range: [10, 20] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[6-8] to All Attributes", type: "numeric", range: [6, 8] },
    {
      mod: "[60-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [60, 100],
    },
    {
      mod: "[20-30]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [20, 30],
    },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+2% to ALL Maximum Resistances", type: "fixed" },
    { mod: "All Resistances +[7-10]", type: "numeric", range: [7, 10] },
  ];

  const quiverCorruptions = [
    { mod: "+20% Faster Hit Recovery", type: "fixed" },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    {
      mod: "[50-100]% Extra Gold from Monsters",
      type: "numeric",
      range: [50, 100],
    },
    {
      mod: "[10-25]% Better Chance of Getting Magic Items",
      type: "numeric",
      range: [10, 25],
    },
    { mod: "Fire Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Cold Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Lightning Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "Poison Resist +[10-20]%", type: "numeric", range: [10, 20] },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    {
      mod: "[-5-10]% to Enemy Fire Resistance",
      type: "numeric",
      range: [-5, -10],
    },
    { mod: "[-10-20]% Target Defense", type: "numeric", range: [-10, -20] },
    { mod: "+[50-100] to Attack Rating", type: "numeric", range: [50, 100] },
    { mod: "[2-4]% Mana Stolen per Hit", type: "numeric", range: [2, 4] },
    { mod: "[2-4]% Life Stolen per Hit", type: "numeric", range: [2, 4] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "+[10-15] to Minimum Damage", type: "numeric", range: [10, 15] },
    { mod: "+[10-15] to Maximum Damage", type: "numeric", range: [10, 15] },
    { mod: "Ignore Target's Defense", type: "fixed" },
    { mod: "All Resistances +[5-10]", type: "numeric", range: [5, 10] },
  ];

  // Map item types to their corruption options
  const corruptionsByType = {
    helm: helmCorruptions,
    armor: armorCorruptions,
    weapon: weaponCorruptions,
    off: offCorruptions,
    glove: gloveCorruptions,
    belt: beltCorruptions,
    boot: bootCorruptions,
    ringOne: ringOneCorruptions,
    ringTwo: ringTwoCorruptions,
    amulet: amuletCorruptions,
    quiver: quiverCorruptions,
  };

  //   const typeCorruptions = JSON.parse(
  //     localStorage.getItem("typeCorruptions") || "{}"
  //   ) || {
  //     helm: null,
  //     armor: null,
  //     weapon: null,
  //     off: null,
  //     ringOne: null,
  //     ringTwo: null,
  //   };

  localStorage.removeItem("typeCorruptions");

  const typeCorruptions = {
    helm: null,
    armor: null,
    weapon: null,
    off: null,
    glove: null,
    belt: null,
    boot: null,
    ringOne: null,
    ringTwo: null,
    amulet: null,
    quiver: null,
  };

  // Create and add buttons and modal to the page
  function createCorruptionUI() {
    // Add buttons HTML
    const buttonsHTML = `
        <div class="corruption-buttons" style="display: flex; gap: 10px; margin: 10px 0;">
          <button id="corruptHelm" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 28, 28);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Helm</button>
          <button id="corruptArmor" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Armor</button>
          <button id="corruptWeapon" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Weapon</button>
          <button id="corruptShield" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Corrupt Shield</button>
            <button id="corruptGlove" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Gloves</button>
            <button id="corruptBelt" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Belt</button>
            <button id="corruptBoot" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Boots</button>
            <button id="corruptRingOne" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Ring One</button>
            <button id="corruptRingTwo" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Ring Two</button>
            <button id="corruptAmulet" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Amulet</button>
            <button id="corruptQuiver" class="corrupt-button" style="
            padding: 8px 15px;
            background-color:rgb(28, 27, 27);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            ">Corrupt Quiver NOT AVAILABLE</button>

        </div>
      `;

    // Add modal HTML
    const modalHTML = `
        <div id="corruptionModal" class="corruption-modal" style="
          position: absolute;
          left: 1500px;
          z-index: 2;
          
          top: 150px;
          width: 100%;
          height: 700px;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
          display: none;
        ">
          <div class="corruption-content" style="
            background-color:rgb(15, 14, 14);
            margin: 15% auto;
            padding: 10px;
            border: 1px solid #888;
            width: 80%;
            max-height: 800px;
            max-width: 500px;
            border-radius: 10px;
          ">
            <h2 style="color: white; margin-bottom: 15px;">Select Corruption Modifier</h2>
            <div id="corruptionOptions" class="corruption-options"></div>
          </div>
        </div>
      `;

    // Insert the HTML into the document
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.body.insertAdjacentHTML("beforeend", buttonsHTML);
  }

  // Call this to set up the UI
  createCorruptionUI();

  function generateValue(range) {
    if (Array.isArray(range)) {
      const [min, max] = range;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return range;
  }

  function showModal(type) {
    const modal = document.getElementById("corruptionModal");
    const optionsContainer = document.getElementById("corruptionOptions");
    modal.style.display = "block";
    optionsContainer.innerHTML = "";

    const corruptions = corruptionsByType[type];
    corruptions.forEach((mod) => {
      const modContainer = document.createElement("div");
      modContainer.className = "corruption-option-container";

      const button = document.createElement("button");
      button.className = "corruption-option";

      if (mod.type === "numeric") {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "corruption-slider-container";
        sliderContainer.style.display = "none";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = mod.range[0];
        slider.max = mod.range[1];
        slider.value = mod.range[0];
        slider.className = "corruption-slider";

        const value = document.createElement("span");
        value.className = "corruption-slider-value";
        value.textContent = slider.value;

        slider.oninput = () => {
          value.textContent = slider.value;
          button.textContent = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
        };

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(value);

        button.onclick = () => {
          document
            .querySelectorAll(".corruption-slider-container")
            .forEach((container) => {
              container.style.display = "none";
            });
          sliderContainer.style.display = "block";
        };

        const confirm = document.createElement("button");
        confirm.className = "corruption-confirm";
        confirm.textContent = "Confirm";
        confirm.onclick = () => {
          const modWithValue = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
          selectMod({ ...mod, mod: modWithValue }, type);
        };
        sliderContainer.appendChild(confirm);

        modContainer.appendChild(button);
        modContainer.appendChild(sliderContainer);
      } else if (mod.type === "double") {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "corruption-slider-container";
        sliderContainer.style.display = "none";

        const slider1 = document.createElement("input");
        slider1.type = "range";
        slider1.min = mod.range[0][0];
        slider1.max = mod.range[0][1];
        slider1.value = mod.range[0][0];
        slider1.className = "corruption-slider";

        const slider2 = document.createElement("input");
        slider2.type = "range";
        slider2.min = mod.range[1][0];
        slider2.max = mod.range[1][1];
        slider2.value = mod.range[1][0];
        slider2.className = "corruption-slider";

        const value1 = document.createElement("span");
        const value2 = document.createElement("span");
        value1.className = "corruption-slider-value";
        value2.className = "corruption-slider-value";
        value1.textContent = slider1.value;
        value2.textContent = slider2.value;

        const updateButtonText = () => {
          button.textContent = mod.mod
            .replace(/\[\d+-\d+\]/, slider1.value)
            .replace(/\[\d+-\d+\]/, slider2.value);
        };

        slider1.oninput = () => {
          value1.textContent = slider1.value;
          updateButtonText();
        };

        slider2.oninput = () => {
          value2.textContent = slider2.value;
          updateButtonText();
        };

        sliderContainer.appendChild(slider1);
        sliderContainer.appendChild(value1);
        sliderContainer.appendChild(slider2);
        sliderContainer.appendChild(value2);

        button.onclick = () => {
          document
            .querySelectorAll(".corruption-slider-container")
            .forEach((container) => {
              container.style.display = "none";
            });
          sliderContainer.style.display = "block";
        };

        const confirm = document.createElement("button");
        confirm.className = "corruption-confirm";
        confirm.textContent = "Confirm";
        confirm.onclick = () => {
          const modWithValues = mod.mod
            .replace(/\[\d+-\d+\]/, slider1.value)
            .replace(/\[\d+-\d+\]/, slider2.value);
          selectMod({ ...mod, mod: modWithValues }, type);
        };
        sliderContainer.appendChild(confirm);

        modContainer.appendChild(button);
        modContainer.appendChild(sliderContainer);
      } else {
        button.onclick = () => selectMod(mod, type);
        modContainer.appendChild(button);
      }

      button.textContent = mod.mod;
      optionsContainer.appendChild(modContainer);
    });
  }

  function selectMod(mod, type) {
    let formattedMod;
    if (mod.type === "numeric") {
      formattedMod = mod.mod;
    } else if (mod.type === "double") {
      const value1 = generateValue(mod.range[0]);
      const value2 = generateValue(mod.range[1]);
      formattedMod = mod.mod
        .replace(/\[\d+-\d+\]/, value1)
        .replace(/\[\d+-\d+\]/, value2);
    } else {
      formattedMod = mod.mod;
    }

    // Store corruption for the specific type
    typeCorruptions[type] = formattedMod;
    localStorage.setItem("typeCorruptions", JSON.stringify(typeCorruptions));

    // Update display for the current type
    updateCorruptionDisplay(type, formattedMod);

    document.getElementById("corruptionModal").style.display = "none";
  }

  function updateCorruptionDisplay(type, corruptionMod) {
    console.log(`Updating corruption for type: ${type}, mod: ${corruptionMod}`);

    // Mapping to handle special cases for rings
    const containerMap = {
      ringOne: "ringsone-info",
      ringTwo: "ringstwo-info",
    };

    const containerId = containerMap[type] || `${type}-info`;
    const container = document.getElementById(containerId);

    // const container = document.getElementById(`${type}-info`);
    if (!container) return;

    // Clear existing corruption display
    const existingMod = container.querySelector(".corrupted-mod");
    const existingText = container.querySelector(".corrupted-text");
    if (existingMod) existingMod.remove();
    if (existingText) existingText.remove();

    const resultDiv = document.createElement("div");
    resultDiv.className = "corrupted-mod";
    resultDiv.textContent = corruptionMod;

    const corruptedText = document.createElement("div");
    corruptedText.className = "corrupted-text";
    corruptedText.textContent = "Corrupted";

    container.appendChild(resultDiv);
    container.appendChild(corruptedText);
  }

  // Function to restore corruptions on page interactions
  function restoreCorruptions() {
    const types = [
      { type: "helm", containerId: "helm-info" },
      { type: "armor", containerId: "armor-info" },
      { type: "weapon", containerId: "weapon-info" },
      { type: "off", containerId: "off-info" },
      { type: "glove", containerId: "glove-info" },
      { type: "belt", containerId: "belt-info" },
      { type: "boot", containerId: "boot-info" },
      { type: "ringOne", containerId: "ringsone-info" },
      { type: "ringTwo", containerId: "ringstwo-info" },
      { type: "amulet", containerId: "amulet-info" },
      { type: "quiver", containerId: "quiver-info" },
    ];

    types.forEach(({ type, containerId }) => {
      const corruption = typeCorruptions[type];

      if (corruption) {
        updateCorruptionDisplay(type, corruption);
      }
    });
  }

  // Attach restoration to various change events
  const elementsToWatch = [
    "lvlValue",
    "str",
    "dex",
    "vit",
    "enr",
    "helms-dropdown",
    "armors-dropdown",
    "weapons-dropdown",
    "offs-dropdown",
    "gloves-dropdown",
    "belts-dropdown",
    "boots-dropdown",
    "ringsone-dropdown",
    "ringstwo-dropdown",
    "amulets-dropdown",
  ];

  elementsToWatch.forEach((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener("change", restoreCorruptions);
      element.addEventListener("input", restoreCorruptions);
    }
  });

  // Initial restoration on page load
  restoreCorruptions();

  // Corruption buttons setup
  document
    .getElementById("corruptHelm")
    .addEventListener("click", () => showModal("helm"));
  document
    .getElementById("corruptArmor")
    .addEventListener("click", () => showModal("armor"));
  document
    .getElementById("corruptWeapon")
    .addEventListener("click", () => showModal("weapon"));
  document
    .getElementById("corruptShield")
    .addEventListener("click", () => showModal("off"));
  document
    .getElementById("corruptGlove")
    .addEventListener("click", () => showModal("glove"));
  document
    .getElementById("corruptBelt")
    .addEventListener("click", () => showModal("belt"));
  document
    .getElementById("corruptBoot")
    .addEventListener("click", () => showModal("boot"));
  document
    .getElementById("corruptRingOne")
    .addEventListener("click", () => showModal("ringOne"));
  document
    .getElementById("corruptRingTwo")
    .addEventListener("click", () => showModal("ringTwo"));
  document
    .getElementById("corruptAmulet")
    .addEventListener("click", () => showModal("amulet"));
  document
    .getElementById("corruptQuiver")
    .addEventListener("click", () => showModal("quiver"));

  console.log("Initial typeCorruptions:", typeCorruptions);
  console.log(
    "Loaded from localStorage:",
    JSON.parse(localStorage.getItem("typeCorruptions"))
  );

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("corruptionModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
