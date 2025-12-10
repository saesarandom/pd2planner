// corruption.js - Simple approach: modify item description directly
// Let the socket system handle everything else

// Corruption storage
window.itemCorruptions = window.itemCorruptions || {};
window.originalItemDescriptions = window.originalItemDescriptions || {};

// Corruption definitions by item type
const CORRUPTIONS = {
  helm: [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "Replenish Life +[20-30]", type: "numeric", range: [20, 30] },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "[3-5]% Life Stolen per Hit", type: "numeric", range: [3, 5] },
    { mod: "[3-5]% Mana Stolen per Hit", type: "numeric", range: [3, 5] },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    { mod: "+[3-4] to Life after each Kill", type: "numeric", range: [3, 4] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "Physical Damage Taken Reduced by [4-6]%", type: "numeric", range: [4, 6] },
    {
      mod: "Indestructible<br>+[50-80]% Enhanced Defense",
      type: "double",
      ranges: [
        { label: "Indestructible", type: "fixed" },
        { label: "Enhanced Defense", range: [50, 80], type: "numeric" }
      ]
    },
    {
      mod: "+[150-250] to Attack Rating<br>+[2-4] to Light Radius",
      type: "double",
      ranges: [
        { label: "Attack Rating", range: [150, 250], type: "numeric" },
        { label: "Light Radius", range: [2, 4], type: "numeric" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Fire Resist<br>Fire Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Fire Resist", range: [4, 5], type: "numeric" },
        { label: "Fire Resist", value: 15, type: "fixed" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Cold Resist<br>Cold Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Cold Resist", range: [4, 5], type: "numeric" },
        { label: "Cold Resist", value: 15, type: "fixed" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Lightning Resist<br>Lightning Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Lightning Resist", range: [4, 5], type: "numeric" },
        { label: "Lightning Resist", value: 15, type: "fixed" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Poison Resist<br>Poison Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Poison Resist", range: [4, 5], type: "numeric" },
        { label: "Poison Resist", value: 15, type: "fixed" }
      ]
    },
    { mod: "Socketed (1)", type: "socket", sockets: 1 },
    { mod: "Socketed (2)", type: "socket", sockets: 2 },
    { mod: "Socketed (3)", type: "socket", sockets: 3 }
  ],
  armor: [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "+[30-40] Mana", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Cold Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Lightning Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "Poison Resist +[30-35]%", type: "numeric", range: [30, 35] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+20% Faster Run/Walk", type: "fixed" },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Magic Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)", type: "numeric", range: [4, 594] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    { mod: "Physical Damage Taken Reduced by [6-8]%", type: "numeric", range: [6, 8] },
    {
      mod: "Indestructible<br>+[50-80]% Enhanced Defense",
      type: "double",
      ranges: [
        { label: "Indestructible", type: "fixed" },
        { label: "Enhanced Defense", range: [50, 80], type: "numeric" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Fire Resist<br>Fire Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Fire Resist", range: [4, 5], type: "numeric" },
        { label: "Fire Resist", value: 15, type: "fixed" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Cold Resist<br>Cold Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Cold Resist", range: [4, 5], type: "numeric" },
        { label: "Cold Resist", value: 15, type: "fixed" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Lightning Resist<br>Lightning Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Lightning Resist", range: [4, 5], type: "numeric" },
        { label: "Lightning Resist", value: 15, type: "fixed" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Poison Resist<br>Poison Resist +15%",
      type: "double",
      ranges: [
        { label: "Maximum Poison Resist", range: [4, 5], type: "numeric" },
        { label: "Poison Resist", value: 15, type: "fixed" }
      ]
    },
    { mod: "Socketed (1)", type: "socket", sockets: 1 },
    { mod: "Socketed (2)", type: "socket", sockets: 2 },
    { mod: "Socketed (3)", type: "socket", sockets: 3 }
  ],
  weapon: [
    { mod: "+[40-80]% Enhanced Damage", type: "numeric", range: [40, 80] },
    { mod: "+[150-250] to Attack Rating", type: "numeric", range: [150, 250] },
    { mod: "+[100-150]% Enhanced Damage to Demons<br>+200 to Attack Rating against Demons", type: "numeric", range: [100, 150] },
    { mod: "+[100-150]% Enhanced Damage to Undead<br>+200 to Attack Rating against Undead", type: "numeric", range: [100, 150] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[3-6] Life after each Hit", type: "numeric", range: [3, 6] },
    { mod: "+[3-6] Life after each Kill", type: "numeric", range: [3, 6] },
    { mod: "+[3-5] to Mana after each Kill", type: "numeric", range: [3, 5] },
    { mod: "+[20-30]% Better Chance of Getting Magic Items", type: "fixed", range: [20, 30] },
    { mod: "Requirements -[25-50]%", type: "numeric", range: [25, 50] },
    { mod: "+20% Faster Cast Rate", type: "fixed" },
    { mod: "+[30-40]% Increased Attack Speed", type: "numeric", range: [30, 40] },
    { mod: "+[40-60]% Enhanced Damage<br>5% Life Stolen per Hit", type: "numeric", range: [40, 60] },
    { mod: "-[40-60] Target Defense per Hit", type: "numeric", range: [40, 60] },
    { mod: "[20-30]% Chance of Crushing Blow", type: "numeric", range: [20, 30] },
    { mod: "+[20-30]% Deadly Strike", type: "numeric", range: [20, 30] },
    { mod: "-[7-10]% to Enemy Fire Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Cold Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Lightning Resistance", type: "numeric", range: [7, 10] },
    { mod: "-[7-10]% to Enemy Poison Resistance", type: "numeric", range: [7, 10] },
    { mod: "+1 to All Skills", type: "fixed" },
    {
      mod: "+30% Increased Attack Speed<br>[20-30]% Chance of Crushing Blow",
      type: "double",
      ranges: [
        { label: "Increased Attack Speed", value: 30, type: "fixed" },
        { label: "Chance of Crushing Blow", range: [20, 30], type: "numeric" }
      ]
    },

    { mod: "+[80-120]% Enhanced Damage<br>+20% Increased Attack Speed", type: "numeric", range: [80, 120] },
    { mod: "+[80-120]% Enhanced Damage<br>+250 to Attack Rating", type: "numeric", range: [80, 120] },
    { mod: "+[50-70]% Enhanced Damage<br>25% Deadly Strike", type: "numeric", range: [50, 70] },
    { mod: "+[60-80]% Enhanced Damage<br>Ignores Target's Defense", type: "numeric", range: [60, 80] },
    { mod: "+10% Faster Cast Rate<br>+5% to Fire Skill Damage", type: "fixed" },
    { mod: "+10% Faster Cast Rate<br>+5% to Cold Skill Damage", type: "fixed" },
    { mod: "+10% Faster Cast Rate<br>+5% to Lightning Skill Damage", type: "fixed" },
    { mod: "+10% Faster Cast Rate<br>+5% to Poison Skill Damage", type: "fixed" }
  ],
  shield: [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    { mod: "+20% Faster Block Rate", type: "fixed" },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "+[30-40] Life", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Cold Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Lightning Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "Poison Resist +[35-40]%", type: "numeric", range: [35, 40] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "Increase Maximum Life [4-6]%", type: "numeric", range: [4, 6] },
    { mod: "Physical Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Magic Damage Taken Reduced by [6-10]", type: "numeric", range: [6, 10] },
    { mod: "Attacker Takes Damage of [4-594] ([4-6] per Level)", type: "numeric", range: [4, 594] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "All Resistances +[20-25]", type: "numeric", range: [20, 25] },
    { mod: "Physical Damage Taken Reduced by [6-8]%", type: "numeric", range: [6, 8] },
    {
      mod: "Indestructible<br>+[50-80]% Enhanced Defense",
      type: "double",
      ranges: [
        { label: "Indestructible", type: "fixed" },
        { label: "Enhanced Defense", range: [50, 80], type: "numeric" }
      ]
    },
    {
      mod: "+10% Faster Block Rate<br>[10-20]% Increased Chance of Blocking",
      type: "double",
      ranges: [
        { label: "Faster Block Rate", value: 10, type: "fixed" },
        { label: "Increased Chance of Blocking", range: [10, 20], type: "numeric" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Fire Resist<br>Fire Resist +[15-20]%",
      type: "double",
      ranges: [
        { label: "Maximum Fire Resist", range: [4, 5], type: "numeric" },
        { label: "Fire Resist", range: [15, 20], type: "numeric" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Cold Resist<br>Cold Resist +[15-20]%",
      type: "double",
      ranges: [
        { label: "Maximum Cold Resist", range: [4, 5], type: "numeric" },
        { label: "Cold Resist", range: [15, 20], type: "numeric" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Lightning Resist<br>Lightning Resist +[15-20]%",
      type: "double",
      ranges: [
        { label: "Maximum Lightning Resist", range: [4, 5], type: "numeric" },
        { label: "Lightning Resist", range: [15, 20], type: "numeric" }
      ]
    },
    {
      mod: "+[4-5]% to Maximum Poison Resist<br>Poison Resist +[15-20]%",
      type: "double",
      ranges: [
        { label: "Maximum Poison Resist", range: [4, 5], type: "numeric" },
        { label: "Poison Resist", range: [15, 20], type: "numeric" }
      ]
    },
    { mod: "Socketed (1)", type: "socket", sockets: 1 },
    { mod: "Socketed (2)", type: "socket", sockets: 2 },
    { mod: "Socketed (3)", type: "socket", sockets: 3 }
  ],
  gloves: [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "Regenerate Mana [20-30]%", type: "numeric", range: [20, 30] },
    { mod: "+[10-20]% Faster Block Rate", type: "numeric", range: [10, 20] },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "[50-100]% Extra Gold from Monsters", type: "numeric", range: [50, 100] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "[10-25]% Better Chance of Getting Magic Items", type: "numeric", range: [10, 25] },
    { mod: "[2-3]% Life Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[2-3]% Mana Stolen per Hit", type: "numeric", range: [2, 3] },
    { mod: "-[15-25]% Target Defense", type: "numeric", range: [15, 25] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "10% Deadly Strike", type: "fixed" },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "+[3-4] to Mana after each Kill", type: "numeric", range: [3, 4] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] }
  ],
  belt: [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[10-15]% Chance to Pierce", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+10% Increased Attack Speed", type: "fixed" },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[3-6] to All Attributes", type: "numeric", range: [3, 6] },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Replenish Life +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Attacker Takes Damage of [2-396] ([2-4] per Level)", type: "numeric", range: [2, 396] },
    { mod: "+2% to All Maximum Resistances", type: "fixed" },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[60-100]% Extra Gold from Monsters", type: "numeric", range: [60, 100] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "Physical Damage Taken Reduced by [3-4]%", type: "numeric", range: [3, 4] }
  ],
  boots: [
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    { mod: "+15% Faster Run/Walk", type: "fixed" },
    { mod: "Regenerate Mana [10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+10% Faster Block Rate", type: "fixed" },
    { mod: "20% Reduced Curse Duration", type: "fixed" },
    { mod: "[50-100]% Extra Gold from Monsters", type: "numeric", range: [50, 100] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "Physical Damage Taken Reduced by [3-4]%", type: "numeric", range: [3, 4] },
    { mod: "[10-25]% Better Chance of Getting Magic Items", type: "numeric", range: [10, 25] },
    { mod: "+[20-40] to Life", type: "numeric", range: [20, 40] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "All Resistances +[5-8]", type: "numeric", range: [5, 8] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "Replenish Life +[15-25]", type: "numeric", range: [15, 25] },
    {
      mod: "+[50-80]% Enhanced Defense<br>Indestructible",
      type: "double",
      ranges: [
        { label: "Enhanced Defense", range: [50, 80], type: "numeric" },
        { label: "Indestructible", type: "fixed" }
      ]
    },
    {
      mod: "+[2-3]% to Maximum Fire Resist<br>Fire Resist +10%",
      type: "double",
      ranges: [
        { label: "Maximum Fire Resist", range: [2, 3], type: "numeric" },
        { label: "Fire Resist", value: 10, type: "fixed" }
      ]
    },
    {
      mod: "+[2-3]% to Maximum Cold Resist<br>Cold Resist +10%",
      type: "double",
      ranges: [
        { label: "Maximum Cold Resist", range: [2, 3], type: "numeric" },
        { label: "Cold Resist", value: 10, type: "fixed" }
      ]
    },
    {
      mod: "+[2-3]% to Maximum Lightning Resist<br>Lightning Resist +10%",
      type: "double",
      ranges: [
        { label: "Maximum Lightning Resist", range: [2, 3], type: "numeric" },
        { label: "Lightning Resist", value: 10, type: "fixed" }
      ]
    },
    {
      mod: "+[2-3]% to Maximum Poison Resist<br>Poison Resist +10%",
      type: "double",
      ranges: [
        { label: "Maximum Poison Resist", range: [2, 3], type: "numeric" },
        { label: "Poison Resist", value: 10, type: "fixed" }
      ]
    }
  ],
  ring: [
    { mod: "+[7-10] to Strength", type: "numeric", range: [7, 10] },
    { mod: "+[100-150] to Attack Rating", type: "numeric", range: [100, 150] },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[7-10] to Dexterity", type: "numeric", range: [7, 10] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+[7-10] to Vitality", type: "numeric", range: [7, 10] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "10% Reduced Curse Duration", type: "fixed" },
    { mod: "+[7-10] to Energy", type: "numeric", range: [7, 10] },
    { mod: "Physical Damage Taken Reduced by [4-6]", type: "numeric", range: [4, 6] },
    { mod: "[3-4]% Mana Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "Fire Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "Magic Damage Taken Reduced by [4-6]", type: "numeric", range: [4, 6] },
    { mod: "[3-4]% Life Stolen per Hit", type: "numeric", range: [3, 4] },
    { mod: "Cold Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "+[30-40] to Life", type: "numeric", range: [30, 40] },
    { mod: "+[4-6] to All Attributes", type: "numeric", range: [4, 6] },
    { mod: "Lightning Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[40-80]% Extra Gold from Monsters", type: "numeric", range: [40, 80] },
    { mod: "All Resistances +[4-6]", type: "numeric", range: [4, 6] },
    { mod: "Poison Resist +[10-15]%", type: "numeric", range: [10, 15] },
    { mod: "[15-20]% Better Chance of Getting Magic Items", type: "numeric", range: [15, 20] },
    { mod: "Physical Damage Taken Reduced by 3%", type: "fixed" }
  ],
  amulet: [
    { mod: "+[6-12] to Strength", type: "numeric", range: [6, 12] },
    { mod: "+[10-20]% Chance to Pierce", type: "numeric", range: [10, 20] },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+[6-12] to Dexterity", type: "numeric", range: [6, 12] },
    { mod: "+10% Faster Hit Recovery", type: "fixed" },
    { mod: "+10% Faster Cast Rate", type: "fixed" },
    { mod: "+[6-12] to Vitality", type: "numeric", range: [6, 12] },
    { mod: "10% Increased Chance of Blocking", type: "fixed" },
    { mod: "+10% Faster Run/Walk", type: "fixed" },
    { mod: "+[6-12] to Energy", type: "numeric", range: [6, 12] },
    { mod: "+[2-3] Life after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+10% Curse Resistance", type: "fixed" },
    { mod: "Fire Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "+[2-3] to Mana after each Kill", type: "numeric", range: [2, 3] },
    { mod: "+[30-40]% Enhanced Damage", type: "numeric", range: [30, 40] },
    { mod: "Cold Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "+[6-8] to All Attributes", type: "numeric", range: [6, 8] },
    { mod: "Cannot Be Frozen", type: "fixed" },
    { mod: "Lightning Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "[60-100]% Extra Gold from Monsters", type: "numeric", range: [60, 100] },
    { mod: "+2% to All Maximum Resistances", type: "fixed" },
    { mod: "Poison Resist +[15-20]%", type: "numeric", range: [15, 20] },
    { mod: "[20-30]% Better Chance of Getting Magic Items", type: "numeric", range: [20, 30] },
    { mod: "All Resistances +[7-10]", type: "numeric", range: [7, 10] }
  ]
};

// Section mapping for dropdowns to item types
const SECTION_MAP = {

  'helms-dropdown': 'helm',
  'armors-dropdown': 'armor',
  'weapons-dropdown': 'weapon',
  'offs-dropdown': 'shield',
  'gloves-dropdown': 'gloves',
  'belts-dropdown': 'belt',
  'boots-dropdown': 'boots',
  'ringsone-dropdown': 'ring',
  'ringstwo-dropdown': 'ring',
  'amulets-dropdown': 'amulet',
  // Mercenary equipment
  'merchelms-dropdown': 'merchelm',
  'mercarmors-dropdown': 'mercarmor',
  'mercweapons-dropdown': 'mercweapon',
  'mercoffs-dropdown': 'mercoff',
  'mercgloves-dropdown': 'mercgloves',
  'mercbelts-dropdown': 'mercbelts',
  'mercboots-dropdown': 'mercboots'
};
window.SECTION_MAP = SECTION_MAP;
// Global variables
let currentCorruptionSlot = null;

// Initialize corruption system
function initCorruptionSystem() {


  addCorruptionCSS();
  createCorruptionModal();
  attachCorruptionButtons();


}

// Enhanced CSS for corruption styling
function addCorruptionCSS() {
  if (document.getElementById('corruption-styles')) return;

  const style = document.createElement('style');
  style.id = 'corruption-styles';
  style.textContent = `
    .corruption-enhanced-stat {
      color: #ff5555 !important;
      font-weight: bold !important;
      text-shadow: 0 0 3px #ff5555 !important;
    }
    
    .corruption-slider-container {
      background: #3a3a3a;
      border: 1px solid #555;
      border-radius: 4px;
      padding: 12px;
      margin: 8px 0;
    }
    
    .corruption-slider-label {
      color: #ffd700;
      font-size: 12px;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .corruption-slider-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 6px 0;
    }
    
    .corruption-slider {
      flex: 1;
      height: 6px;
      background: #555;
      outline: none;
      border-radius: 3px;
    }
    
    .corruption-slider::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
      background: #ff6b6b;
      border-radius: 50%;
      cursor: pointer;
    }
    
    .corruption-value-display {
      min-width: 40px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      background: #2a2a2a;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
    }
    
    .corruption-preview {
      margin-top: 12px;
      color: #ffd700;
      font-style: italic;
      background: #2a2a2a;
      padding: 8px;
      border-radius: 4px;
      border-left: 3px solid #ff6b6b;
    }
  `;
  document.head.appendChild(style);
}

// Create enhanced corruption modal
function createCorruptionModal() {
  if (document.getElementById('corruptionModal')) return;

  const modalHTML = `
    <div id="corruptionModal" class="modal" style="
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.8);
    ">
      <div class="modal-content" style="
        background-color: #2b2b2b;
        margin: 3% auto;
        padding: 20px;
        border: 2px solid #444;
        border-radius: 8px;
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
        font-family: Oswald, sans-serif;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ff6b6b;">Corruption Options</h2>
          <button id="closeCorruptionModal" style="
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">×</button>
        </div>
        <div id="corruptionList"></div>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
          <button id="removeCorruption" style="
            background-color: #666;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Remove Corruption</button>
          <button id="cancelCorruption" style="
            background-color: #444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Attach modal event listeners
  document.getElementById('closeCorruptionModal').onclick = closeCorruptionModal;
  document.getElementById('cancelCorruption').onclick = closeCorruptionModal;
  document.getElementById('removeCorruption').onclick = removeCurrentCorruption;

  // Close on background click
  document.getElementById('corruptionModal').onclick = (e) => {
    if (e.target.id === 'corruptionModal') closeCorruptionModal();
  };
}

// Attach corruption buttons to existing corrupt buttons
function attachCorruptionButtons() {


  const buttonMap = {
    'corruptHelm': 'helms-dropdown',
    'corruptArmor': 'armors-dropdown',
    'corruptWeapon': 'weapons-dropdown',
    'corruptShield': 'offs-dropdown',
    'corruptGlove': 'gloves-dropdown',
    'corruptBelt': 'belts-dropdown',
    'corruptBoot': 'boots-dropdown',
    'corruptRingOne': 'ringsone-dropdown',
    'corruptRingTwo': 'ringstwo-dropdown',
    'corruptAmulet': 'amulets-dropdown'
  };

  Object.entries(buttonMap).forEach(([buttonId, dropdownId]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.onclick = () => openCorruptionModal(dropdownId);

    }
  });
}

// Open corruption modal for specific item slot
function openCorruptionModal(dropdownId) {


  const dropdown = document.getElementById(dropdownId);
  if (!dropdown || !dropdown.value) {
    alert('Please select an item first!');
    return;
  }

  const itemType = SECTION_MAP[dropdownId];
  const corruptions = CORRUPTIONS[itemType];
  if (!corruptions) {
    alert('No corruptions available for this item type.');
    return;
  }

  currentCorruptionSlot = dropdownId;
  populateCorruptionList(corruptions);
  document.getElementById('corruptionModal').style.display = 'block';
}

// Enhanced populate corruption options with independent sliders
function populateCorruptionList(corruptions) {
  const listContainer = document.getElementById('corruptionList');
  listContainer.innerHTML = '';

  corruptions.forEach((corruption, index) => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 12px;
      margin: 8px 0;
      background-color: #333;
      border: 1px solid #555;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    if (corruption.type === 'double' && corruption.ranges) {
      // Handle double mods with independent sliders
      item.innerHTML = createDoubleModSliders(corruption, index);

      item.onclick = (e) => {
        if (!e.target.classList.contains('corruption-slider')) {
          applyDoubleCorruption(corruption, index);
        }
      };
    } else if (corruption.type === 'numeric') {
      // Handle single numeric mods
      item.innerHTML = createSingleModSlider(corruption, index);

      item.onclick = (e) => {
        if (!e.target.classList.contains('corruption-slider')) {
          const slider = item.querySelector('.corruption-slider');
          applyCorruption(corruption.mod, parseInt(slider.value));
        }
      };
    } else if (corruption.type === 'socket') {
      // Handle socket corruptions - these need to create actual sockets
      item.innerHTML = `
        <div style="color: #ff6b6b; font-weight: bold;">${corruption.mod}</div>
      `;

      item.onclick = () => applySocketCorruptionFromModal(corruption);
    } else {
      // Handle fixed mods
      item.innerHTML = `
        <div style="color: #ff6b6b; font-weight: bold;">${corruption.mod}</div>
      `;

      item.onclick = () => applyCorruption(corruption.mod);
    }

    item.onmouseenter = () => item.style.backgroundColor = '#444';
    item.onmouseleave = () => item.style.backgroundColor = '#333';

    listContainer.appendChild(item);
  });
}

// Create sliders for double mods with independent ranges
function createDoubleModSliders(corruption, index) {
  let html = `
    <div class="corruption-slider-container">
      <div class="corruption-slider-label">${corruption.mod.replace(/<br>/g, ' + ').replace(/\[.*?\]/g, '[Range]')}</div>
  `;

  corruption.ranges.forEach((range, rangeIndex) => {
    const sliderId = `corruption_${index}_${rangeIndex}`;
    const valueId = `value_${index}_${rangeIndex}`;

    if (range.type === 'numeric') {
      const minVal = range.range[0];
      const maxVal = range.range[1];

      html += `
        <div class="corruption-slider-row">
          <span style="min-width: 120px; color: #ccc; font-size: 11px;">${range.label}:</span>
          <input type="range" 
                 class="corruption-slider"
                 id="${sliderId}"
                 min="${minVal}" 
                 max="${maxVal}" 
                 value="${minVal}"
                 oninput="updateDoubleModPreview(${index})"
                 onchange="updateDoubleModPreview(${index})">
          <span class="corruption-value-display" id="${valueId}">${minVal}</span>
        </div>
      `;
    } else {
      // Fixed value
      html += `
        <div class="corruption-slider-row">
          <span style="width: 70px; color: #ccc; font-size: 11px;">${range.label}:</span>
          <span style="flex: 1; color: #ffd700; text-align: center;">+${range.value}%</span>
          <span class="corruption-value-display">Fixed</span>
        </div>
      `;
    }
  });

  html += `
      <div class="corruption-preview" id="preview_${index}"></div>
    </div>
  `;

  // Update preview after creating HTML
  setTimeout(() => updateDoubleModPreview(index), 10);

  return html;
}

// Create slider for single numeric mods
function createSingleModSlider(corruption, index) {
  const sliderId = `corruption_single_${index}`;
  const valueId = `value_single_${index}`;
  const previewId = `preview_single_${index}`;

  const minVal = corruption.range[0];
  const maxVal = corruption.range[1];

  return `
    <div class="corruption-slider-container">
      <div class="corruption-slider-label">${corruption.mod.replace(/\[.*?\]/g, '[Range]')}</div>
      <div class="corruption-slider-row">
        <span style="min-width: 60px; color: #ccc;">Value:</span>
        <input type="range" 
               class="corruption-slider"
               id="${sliderId}"
               min="${minVal}" 
               max="${maxVal}" 
               value="${minVal}"
               oninput="updateSingleModPreview(${index}, '${corruption.mod}')"
               onchange="updateSingleModPreview(${index}, '${corruption.mod}')">
        <span class="corruption-value-display" id="${valueId}">${minVal}</span>
      </div>
      <div class="corruption-preview" id="${previewId}">${generateCorruptionText(corruption.mod, minVal)}</div>
    </div>
  `;
}

// Update preview for double mods with independent sliders
function updateDoubleModPreview(index) {
  const preview = document.getElementById(`preview_${index}`);
  if (!preview) return;

  // Find the corruption data
  const corruption = getCurrentCorruptionByIndex(index);
  if (!corruption || !corruption.ranges) return;

  let previewText = '';
  let values = [];

  corruption.ranges.forEach((range, rangeIndex) => {
    if (range.type === 'numeric') {
      const slider = document.getElementById(`corruption_${index}_${rangeIndex}`);
      const valueDisplay = document.getElementById(`value_${index}_${rangeIndex}`);

      if (slider && valueDisplay) {
        const value = parseInt(slider.value);
        valueDisplay.textContent = value;
        values.push(value);
      }
    } else {
      values.push(range.value);
    }
  });

  // Generate preview text by replacing placeholders
  previewText = generateDoubleModText(corruption.mod, values);
  preview.innerHTML = previewText;
}

// Update preview for single mods
function updateSingleModPreview(index, modTemplate) {
  const slider = document.getElementById(`corruption_single_${index}`);
  const valueDisplay = document.getElementById(`value_single_${index}`);
  const preview = document.getElementById(`preview_single_${index}`);

  if (slider && valueDisplay && preview) {
    const value = parseInt(slider.value);
    valueDisplay.textContent = value;
    preview.innerHTML = generateCorruptionText(modTemplate, value);
  }
}

// Get corruption data by index
function getCurrentCorruptionByIndex(index) {
  const itemType = SECTION_MAP[currentCorruptionSlot];
  const corruptions = CORRUPTIONS[itemType];
  return corruptions ? corruptions[index] : null;
}

// Generate text for double mods with multiple values
function generateDoubleModText(template, values) {
  let result = template;
  let valueIndex = 0;

  // Replace placeholders with actual values in order
  result = result.replace(/\[[\d\-]+\]/g, () => {
    const value = values[valueIndex] || 0;
    valueIndex++;
    return value.toString();
  });

  return result;
}

// Generate corruption text with single value
function generateCorruptionText(template, value) {
  return template.replace(/\[[\d\-]+\]/g, value.toString());
}

// Apply double corruption with multiple values
function applyDoubleCorruption(corruption, index) {
  let values = [];

  // Collect values from sliders
  corruption.ranges.forEach((range, rangeIndex) => {
    if (range.type === 'numeric') {
      const slider = document.getElementById(`corruption_${index}_${rangeIndex}`);
      values.push(slider ? parseInt(slider.value) : range.range[0]);
    } else {
      values.push(range.value);
    }
  });

  const corruptionText = generateDoubleModText(corruption.mod, values);



  applyCorruptionToItem(corruptionText);
}

// Apply single corruption
function applyCorruption(modTemplate, value = null) {
  const corruptionText = value !== null ?
    generateCorruptionText(modTemplate, value) :
    modTemplate;



  applyCorruptionToItem(corruptionText);
}

// Apply socket corruption from modal (creates actual sockets)
function applySocketCorruptionFromModal(corruption) {
  const dropdown = document.getElementById(currentCorruptionSlot);
  if (!dropdown) {
    return;
  }

  const itemName = dropdown.value;
  // Use global item lookup to support both regular and crafted items
  const item = window.getItemData(itemName);
  if (!itemName || !item) {
    return;
  }

  const socketCount = corruption.sockets;
  const section = SECTION_MAP[currentCorruptionSlot];

  if (!section) {
    return;
  }

  // Store original description if not already stored
  if (!window.originalItemDescriptions[itemName]) {
    window.originalItemDescriptions[itemName] = item.description;
  }

  // Get and store the original socket count before changing it
  let originalSocketCount = 0;
  if (window.unifiedSocketSystem && typeof window.unifiedSocketSystem.getSocketCount === 'function') {
    originalSocketCount = window.unifiedSocketSystem.getSocketCount(section) || 0;
  }

  // Store corruption info
  window.itemCorruptions[currentCorruptionSlot] = {
    text: corruption.mod,
    type: 'socket_corruption',
    itemName: itemName,
    socketCount: socketCount,
    originalSocketCount: originalSocketCount
  };

  // CRITICAL FIX: Persist Socket Corruption to Memory
  if (!window.slotItemCorruptions) {
    window.slotItemCorruptions = {};
  }
  if (!window.slotItemCorruptions[currentCorruptionSlot]) {
    window.slotItemCorruptions[currentCorruptionSlot] = {};
  }
  window.slotItemCorruptions[currentCorruptionSlot][itemName] = window.itemCorruptions[currentCorruptionSlot];

  // Add corruption text to item description
  const originalDescription = window.originalItemDescriptions[itemName];
  const enhancedDescription = originalDescription + `<span class="corruption-enhanced-stat">${corruption.mod}</span><br>`;
  item.description = enhancedDescription;

  // Set the socket count to the specified number
  if (window.unifiedSocketSystem && typeof window.unifiedSocketSystem.setSocketCount === 'function') {
    window.unifiedSocketSystem.setSocketCount(section, socketCount);
  }

  // Trigger item display update
  triggerItemUpdate(currentCorruptionSlot);

  // Refresh saved state AFTER triggerItemUpdate completes (so description and properties are in sync)
  if (section && typeof window.refreshSavedState === 'function') {
    setTimeout(() => window.refreshSavedState(currentCorruptionSlot, section), 150);
  }

  closeCorruptionModal();
}

// Apply corruption stats to item properties for character stat calculations
// Apply corruption stats to item properties for character stat calculations
function applyCorruptionToProperties(itemOrName, corruptionText) {
  // CRITICAL FIX: Handle both Item Object (from main.js) and Item Name String
  let item = itemOrName;
  if (typeof itemOrName === 'string') {
    item = window.getItemData(itemOrName);
  }

  if (!item) return;

  // Ensure properties object exists
  if (!item.properties) {
    item.properties = {};
  }

  // NOTE: We REMOVED the "Restore original properties" block here.
  // The caller (applyCorruptionToItem OR updateItemInfo in main.js) 
  // is responsible for providing the Clean Base (User persistent state or Factory).
  // Doing it here wipes User Edits and causes "Returns to default" bug.


  // Parse corruption text to extract stat bonuses
  const stats = parseCorruptionText(corruptionText);

  // Apply each stat to the properties object
  stats.forEach(stat => {
    if (!stat.stackable || !stat.value) return;

    const props = item.properties;

    // Map corruption stat types to item property names
    switch (stat.type) {
      case 'str':
        props.str = (props.str || 0) + stat.value;
        break;
      case 'dex':
        props.dex = (props.dex || 0) + stat.value;
        break;
      case 'vit':
        props.vit = (props.vit || 0) + stat.value;
        break;
      case 'enr':
        props.enr = (props.enr || 0) + stat.value;
        break;
      case 'allattributes':
        // Add to all four attributes
        props.str = (props.str || 0) + stat.value;
        props.dex = (props.dex || 0) + stat.value;
        props.vit = (props.vit || 0) + stat.value;
        props.enr = (props.enr || 0) + stat.value;
        break;
      case 'life':
        // Handle both 'tolife' and 'life' properties
        if ('tolife' in props) {
          props.tolife = (props.tolife || 0) + stat.value;
        } else {
          props.life = (props.life || 0) + stat.value;
        }
        break;
      case 'mana':
        // Handle both 'tomana' and 'mana' properties
        if ('tomana' in props) {
          props.tomana = (props.tomana || 0) + stat.value;
        } else {
          props.mana = (props.mana || 0) + stat.value;
        }
        break;
      // Add other stat types as needed
      case 'ar':
        props.tohitrating = (props.tohitrating || 0) + stat.value;
        break;
      case 'edmg':
        // Enhanced damage - add to edmg property
        // For dynamic items with variable edmg, update the current value
        if (typeof props.edmg === 'object' && 'current' in props.edmg) {
          props.edmg.current = (props.edmg.current || 0) + stat.value;
        } else {
          props.edmg = (props.edmg || 0) + stat.value;
        }
        break;
      case 'edef':
        // Enhanced defense - add to edef property
        if (typeof props.edef === 'object' && 'current' in props.edef) {
          props.edef.current = (props.edef.current || 0) + stat.value;
        } else {
          props.edef = (props.edef || 0) + stat.value;
        }
        break;
      case 'laek':
        props.laek = (props.laek || 0) + stat.value;
        break;
      case 'maek':
        props.maek = (props.maek || 0) + stat.value;
        break;
      case 'replenish':
        props.replenish = (props.replenish || 0) + stat.value; // map to 'replenish' or 'repl'? propDisplay uses 'repl' typically?
        // Checking propDisplay, 'repl' is key. But let's check parseCorruptionText type 'replenish'.
        // Let's use 'repl' as key just in case main.js expects it.
        props.repl = (props.repl || 0) + stat.value;
        break;
      case 'manarecovery':
        props.manarecovery = (props.manarecovery || 0) + stat.value;
        break;
      case 'magicfind':
        props.magicfind = (props.magicfind || 0) + stat.value;
        break;
      case 'goldfind':
        props.goldfind = (props.goldfind || 0) + stat.value;
        break;
      // Resists (Note: key mapping to main.js properties)
      case 'fireresist':
        props.firres = (props.firres || 0) + stat.value;
        break;
      case 'coldresist':
        props.coldres = (props.coldres || 0) + stat.value;
        break;
      case 'lightresist':
        props.ligres = (props.ligres || 0) + stat.value;
        break;
      case 'poisonresist':
        props.poisres = (props.poisres || 0) + stat.value;
        break;
      case 'allres':
        props.allres = (props.allres || 0) + stat.value;
        // Also update individual resists if they exist as properties? 
        // Typically allres is a separate property in display, so just updating allres is enough.
        break;

      case 'physdr':
        props.physdr = (props.physdr || 0) + stat.value;
        break;

      // CRITICAL FIX: Handle generic 'resist' and 'maxres' types from parser
      case 'resist':
        if (stat.subtype === 'fire') props.firres = (props.firres || 0) + stat.value;
        if (stat.subtype === 'cold') props.coldres = (props.coldres || 0) + stat.value;
        if (stat.subtype === 'lightning') props.ligres = (props.ligres || 0) + stat.value;
        if (stat.subtype === 'poison') props.poisres = (props.poisres || 0) + stat.value;
        break;

      case 'indestructible':
        props.indestructible = 1;
        break;

      case 'maxlife':
        // Check if using 'maxlife' or 'lifepercent' property convention, usually maxlife for % increase is rare on items except Jah etc.
        // items.js uses 'maxlife' mostly?
        props.maxlife = (props.maxlife || 0) + stat.value;
        break;

      case 'maxmana':
        props.maxmana = (props.maxmana || 0) + stat.value;
        break;

      case 'lleech':
        props.lleech = (props.lleech || 0) + stat.value;
        break;

      case 'mleech':
        props.mleech = (props.mleech || 0) + stat.value;
        break;

      case 'maxres':
        if (stat.subtype === 'fire') props.maxfirres = (props.maxfirres || 0) + stat.value;
        if (stat.subtype === 'cold') props.maxcoldres = (props.maxcoldres || 0) + stat.value;
        if (stat.subtype === 'lightning') props.maxligres = (props.maxligres || 0) + stat.value;
        if (stat.subtype === 'poison') props.maxpoisres = (props.maxpoisres || 0) + stat.value;
        break;

      // Legacy specific cases (keep just in case)
      case 'ias':
        props.ias = (props.ias || 0) + stat.value;
        break;
      case 'frw':
        props.frw = (props.frw || 0) + stat.value;
        break;
      case 'fhr':
        props.fhr = (props.fhr || 0) + stat.value;
        break;
      // Combat Stats
      case 'cb': // Crushing Blow
        props.cb = (props.cb || 0) + stat.value;
        break;
      case 'ds': // Deadly Strike
      case 'deadly':
        props.deadly = (props.deadly || 0) + stat.value;
        break;
      case 'ow': // Open Wounds
        props.ow = (props.ow || 0) + stat.value;
        break;
      case 'block':
        props.block = (props.block || 0) + stat.value;
        break;
      case 'cbf':
        props.cbf = 1;
        break;
      case 'curseres':
        props.curseres = (props.curseres || 0) + stat.value;
        break;
      // Skills
      case 'allsk':
      case 'allskills':
        props.allsk = (props.allsk || 0) + stat.value;
        break;
      // Damage
      case 'maxdmg':
        props.tomaxdmg = (props.tomaxdmg || 0) + stat.value;
        break;
      case 'mindmg':
        props.tomindmg = (props.tomindmg || 0) + stat.value;
        break;
    }
  });
}

// Make available globally
window.applyCorruptionToProperties = applyCorruptionToProperties;

// Common function to apply corruption to item
function applyCorruptionToItem(corruptionText) {
  const dropdown = document.getElementById(currentCorruptionSlot);
  const itemName = dropdown.value;

  // Use global item lookup to support both regular and crafted items
  const item = window.getItemData(itemName);
  if (!itemName || !item) {
    return;
  }

  // Check if there was a previous socket corruption, and restore original socket count
  const previousCorruption = window.itemCorruptions[currentCorruptionSlot];
  if (previousCorruption && previousCorruption.type === 'socket_corruption' && previousCorruption.originalSocketCount !== undefined) {
    const section = SECTION_MAP[currentCorruptionSlot];
    if (section && window.unifiedSocketSystem && typeof window.unifiedSocketSystem.setSocketCount === 'function') {
      window.unifiedSocketSystem.setSocketCount(section, previousCorruption.originalSocketCount);
    }
  }

  // Store original description if not already stored
  if (!window.originalItemDescriptions[itemName]) {
    let description = item.description;

    // For dynamic items without a static description, generate it
    if (!description) {
      description = window.generateItemDescription(itemName, item, currentCorruptionSlot);
    }

    window.originalItemDescriptions[itemName] = description;
  }

  // Store original properties if not already stored
  if (!window.originalItemProperties) {
    window.originalItemProperties = {};
  }
  if (!window.originalItemProperties[itemName]) {
    // Deep clone the properties object to preserve originals
    window.originalItemProperties[itemName] = JSON.parse(JSON.stringify(item.properties || {}));
  } else {
    // CRITICAL FIX: Always reset properties to original state before applying new corruption
    // This prevents "stacking" previous corruptions or leaking values if the global item object was mutated
    if (item.properties) {
      // Restore from original
      item.properties = JSON.parse(JSON.stringify(window.originalItemProperties[itemName]));
    }
  }

  // Store corruption info
  window.itemCorruptions[currentCorruptionSlot] = {
    text: corruptionText,
    type: 'corruption',
    itemName: itemName
  };

  // NEW: Store corruption in persistent per-slot per-item memory
  if (!window.slotItemCorruptions) {
    window.slotItemCorruptions = {};
  }
  if (!window.slotItemCorruptions[currentCorruptionSlot]) {
    window.slotItemCorruptions[currentCorruptionSlot] = {};
  }
  window.slotItemCorruptions[currentCorruptionSlot][itemName] = window.itemCorruptions[currentCorruptionSlot];

  // Create enhanced description with stat stacking
  const originalDescription = window.originalItemDescriptions[itemName];
  const enhancedDescription = addCorruptionWithStacking(originalDescription, corruptionText);

  // For dynamic items (has baseType), DON'T set static description - it breaks input boxes
  // The socket system will regenerate the description with input boxes intact
  if (!item.baseType) {
    // Only set description for static items
    item.description = enhancedDescription;
  }

  // Apply corruption stats to item properties (this is what matters for dynamic items)
  applyCorruptionToProperties(itemName, corruptionText);

  // For static weapons with edmg corruption, recalculate damage
  if (!item.baseType && currentCorruptionSlot === 'weapons-dropdown') {
    const stats = parseCorruptionText(corruptionText);
    const hasEdmg = stats.some(stat => stat.type === 'edmg');

    if (hasEdmg) {
      // Get the base type from description
      const lines = enhancedDescription.split('<br>');
      const baseType = lines.length > 1 ? lines[1].trim() : null;

      if (baseType && typeof calculateItemDamage === 'function') {
        const isTwoHanded = item.properties.twohandmin !== undefined;

        // Recalculate damage with corruption edmg
        if (isTwoHanded) {
          item.properties.twohandmin = calculateItemDamage(item, baseType, false);
          item.properties.twohandmax = calculateItemDamage(item, baseType, true);
        } else {
          item.properties.onehandmin = calculateItemDamage(item, baseType, false);
          item.properties.onehandmax = calculateItemDamage(item, baseType, true);
        }

        // Update the damage line in the description
        const damageLine = isTwoHanded
          ? `Two-Hand Damage: ${item.properties.twohandmin} to ${item.properties.twohandmax}, Avg ${Math.round((item.properties.twohandmin + item.properties.twohandmax) / 2 * 10) / 10}`
          : `One-Hand Damage: ${item.properties.onehandmin} to ${item.properties.onehandmax}, Avg ${Math.round((item.properties.onehandmin + item.properties.onehandmax) / 2 * 10) / 10}`;

        // Find and replace the damage line
        const updatedLines = lines.map(line => {
          if (line.includes('Damage:')) {
            return damageLine;
          }
          return line;
        });

        item.description = updatedLines.join('<br>');
      }
    }
  }

  // Trigger item display update
  triggerItemUpdate(currentCorruptionSlot);

  // Refresh saved state AFTER triggerItemUpdate completes (so description and properties are in sync)
  const section = SECTION_MAP[currentCorruptionSlot];
  if (section && typeof window.refreshSavedState === 'function') {
    setTimeout(() => window.refreshSavedState(currentCorruptionSlot, section), 150);
  }

  closeCorruptionModal();
}

// Add corruption with proper stat stacking (same as before)
function addCorruptionWithStacking(originalDescription, corruptionText) {
  let description = originalDescription || '';

  // Safety check - make sure description is a string
  if (typeof description !== 'string') {
    description = String(description || '');
  }

  // Parse corruption stats
  const corruptionStats = parseCorruptionText(corruptionText);

  // Track what gets stacked vs what needs to be added
  const stackedLines = new Set();
  const processedStatTypes = new Set();

  // Process stackable stats
  corruptionStats.forEach((stat, index) => {
    if (stat.stackable) {
      const statKey = stat.subtype ? `${stat.type}_${stat.subtype}` : stat.type;

      // Only process each stat type once
      if (processedStatTypes.has(statKey)) return;
      processedStatTypes.add(statKey);

      // Try to stack with existing stat
      const replaced = replaceExistingStatWithCorruption(description, stat);
      if (replaced.found) {
        description = replaced.description;
        stackedLines.add(stat.lineIndex); // Mark this line as handled

      }
    }
  });

  // Reconstruct remaining corruption text from non-stacked lines
  if (corruptionText.includes('<br>')) {
    const lines = corruptionText.split('<br>').map(line => line.trim());
    const remainingLines = lines.filter((line, index) => !stackedLines.has(index));

    if (remainingLines.length > 0) {
      const remainingText = remainingLines.join('<br>');
      description += `<span class="corruption-enhanced-stat">${remainingText}</span><br>`;
    }
  } else {
    // Single line - add if nothing was stacked
    if (stackedLines.size === 0) {
      description += `<span class="corruption-enhanced-stat">${corruptionText}</span><br>`;
    }
  }

  description += '';
  return description;
}

// Make corruption function available globally
window.addCorruptionWithStacking = addCorruptionWithStacking;


// Parse corruption text into individual stats (same as before)
// Enhanced parseCorruptionText to handle double mods properly
function parseCorruptionText(corruptionText) {
  const stats = [];

  // Define stackable stat patterns
  const stackablePatterns = [
    { pattern: /(\+?\d+)%\s+(Increased Attack Speed)/i, type: 'ias' },
    { pattern: /(\+?\d+)%\s+(Enhanced Damage)/i, type: 'edmg' },
    { pattern: /(\+?\d+)%\s+(Faster Cast Rate)/i, type: 'fcr' },
    { pattern: /(\+?\d+)%\s+(Faster Hit Recovery)/i, type: 'fhr' },
    { pattern: /(\+?\d+)%\s+(Faster Run\/Walk)/i, type: 'frw' },
    { pattern: /(\+?\d+)%\s+(Enhanced Defense)/i, type: 'edef' },
    { pattern: /(\+?\d+)%\s+(Faster Block Rate)/i, type: 'fbr' },
    { pattern: /(\+?\d+)%\s+(Increased Chance of Blocking)/i, type: 'block' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Life\s+after\s+each\s+Kill/i, type: 'laek' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Mana\s+after\s+each\s+Kill/i, type: 'maek' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Life/i, type: 'life' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Mana/i, type: 'mana' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Vitality/i, type: 'vit' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Energy/i, type: 'enr' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?All\s+Attributes/i, type: 'allattributes' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Strength/i, type: 'str' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?Dexterity/i, type: 'dex' },
    { pattern: /(\+?\d+)\s+(?:to\s+)?(?:Attack Rating)/i, type: 'ar' },
    { pattern: /(\+?\d+)\s+to\s+All\s+Skills/i, type: 'allskills' },
    { pattern: /(\+?\d+)%\s+(?:to\s+)?Maximum\s+(\w+)\s+Resist/i, type: 'maxres' },
    { pattern: /(\w+)\s+Resist\s+\+(\d+)%/i, type: 'resist' },
    { pattern: /All\s+Resistances\s+\+(\d+)/i, type: 'allres' },
    { pattern: /Physical\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)%/i, type: 'physdr' },
    { pattern: /Physical\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i, type: 'pdr' },
    { pattern: /Magic\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i, type: 'mdr' },
    { pattern: /(\+?\d+)%\s+(Chance of Crushing Blow)/i, type: 'cb' },
    { pattern: /(\+?\d+)%\s+(Deadly Strike)/i, type: 'deadly' },
    { pattern: /(\+?\d+)%\s+(Chance of Open Wounds)/i, type: 'ow' },
    { pattern: /Replenish\s+Life\s+\+(\d+)/i, type: 'replenish' },
    { pattern: /Regenerate\s+Mana\s+(\d+)%/i, type: 'manarecovery' },
    { pattern: /Cannot\s+Be\s+Frozen/i, type: 'cbf' },
    { pattern: /(\+?\d+)%\s+(Curse Resistance)/i, type: 'curseres' },
    { pattern: /(\+?\d+)%\s+(Better Chance of Getting Magic Items)/i, type: 'magicfind' },
    { pattern: /(\+?\d+)%\s+(Extra Gold from Monsters)/i, type: 'goldfind' },
    { pattern: /(\+?\d+)%\s+(Life Stolen per Hit)/i, type: 'lleech' },
    { pattern: /(\+?\d+)%\s+(Mana Stolen per Hit)/i, type: 'mleech' },
    { pattern: /Increase\s+Maximum\s+Life\s+(\d+)%/i, type: 'maxlife' },
    { pattern: /Increase\s+Maximum\s+Mana\s+(\d+)%/i, type: 'maxmana' },
    { pattern: /Indestructible/i, type: 'indestructible' }
  ];

  // Split corruption text by <br> to handle multi-line mods
  const lines = corruptionText.split('<br>').map(line => line.trim()).filter(line => line);

  // Process each line separately
  lines.forEach((line, lineIndex) => {
    let matched = false;

    // Check if line matches any stackable pattern
    for (const { pattern, type } of stackablePatterns) {
      const match = line.match(pattern);
      if (match) {
        let value;
        let subtype = '';

        // Handle special cases
        if (type === 'maxres') {
          value = parseInt(match[1]);
          subtype = match[2].toLowerCase();
        } else if (type === 'resist') {
          value = parseInt(match[2]);
          subtype = match[1].toLowerCase();
        } else if (type === 'cbf') {
          value = 1;
        } else {
          value = parseInt(match[1]);
        }

        stats.push({
          text: line,
          fullText: corruptionText,
          lineIndex: lineIndex,
          value: value,
          type: type,
          subtype: subtype,
          stackable: true,
          pattern: pattern
        });
        matched = true;
        break;
      }
    }


    if (!matched) {
      stats.push({
        text: line,
        fullText: corruptionText,
        lineIndex: lineIndex,
        stackable: false
      });
    }
  });

  return stats;
}


function replaceExistingStatWithCorruption(description, corruptionStat) {
  // Safety check - ensure description is a valid string
  if (!description || typeof description !== 'string') {
    return { found: false, description: description || '' };
  }

  const searchPatterns = {
    'ias': /(\+?\d+)%\s+(Increased Attack Speed)/i,
    'edmg': /(\+?\d+)%\s+(Enhanced Damage)/i,
    'fcr': /(\+?\d+)%\s+(Faster Cast Rate)/i,
    'fhr': /(\+?\d+)%\s+(Faster Hit Recovery)/i,
    'frw': /(\+?\d+)%\s+(Faster Run\/Walk)/i,
    'edef': /(\+?\d+)%\s+(Enhanced Defense)/i,
    'fbr': /(\+?\d+)%\s+(Faster Block Rate)/i,
    'block': /(\+?\d+)%\s+(Increased Chance of Blocking)/i,
    'life': /(\+?\d+)\s+(?:to\s+)?Life/i,
    'mana': /(\+?\d+)\s+(?:to\s+)?Mana/i,
    'str': /(\+?\d+)\s+(?:to\s+)?Strength/i,
    'dex': /(\+?\d+)\s+(?:to\s+)?Dexterity/i,
    'ar': /(\+?\d+)\s+(?:to\s+)?(?:Attack Rating)/i,
    'allskills': /(\+?\d+)\s+to\s+All\s+Skills/i,
    'allres': /All\s+Resistances\s+\+(\d+)/i,
    'pdr': /Physical\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i,
    'mdr': /Magic\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)/i,
    'cb': /(\+?\d+)%\s+(Chance of Crushing Blow)/i,
    'magicfind': /(\+?\d+)%\s+(Better Chance of Getting Magic Items)/i,
    'goldfind': /(\+?\d+)%\s+(Extra Gold from Monsters)/i
  };


  if (corruptionStat.type === 'maxres') {
    const pattern = new RegExp(`(\\+?\\d+)%\\s+(?:to\\s+)?Maximum\\s+${corruptionStat.subtype}\\s+Resist`, 'i');
    searchPatterns['maxres'] = pattern;
  } else if (corruptionStat.type === 'resist') {
    const pattern = new RegExp(`${corruptionStat.subtype}\\s+Resist\\s+\\+(\\d+)%`, 'i');
    searchPatterns['resist'] = pattern;
  }

  const searchPattern = searchPatterns[corruptionStat.type];
  if (!searchPattern) {
    return { found: false, description };
  }

  const match = description.match(searchPattern);
  if (match) {
    const originalValue = parseInt(match[1]);
    const newValue = originalValue + corruptionStat.value;

    // Replace the old value with new value
    // The sign is already in the pattern, so we just replace the number
    const newStatText = match[0].replace(match[1], newValue.toString());
    const redStatText = `<span class="corruption-enhanced-stat">${newStatText}</span>`;

    const newDescription = description.replace(match[0], redStatText);

    return {
      found: true,
      description: newDescription,
      originalValue: originalValue,
      newValue: newValue
    };
  }

  return { found: false, description };
}


function triggerItemUpdate(dropdownId) {
  setTimeout(() => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {

      const fakeEvent = { target: dropdown };
      if (typeof updateItemInfo === 'function') {
        updateItemInfo(fakeEvent);
      }


      dropdown.dispatchEvent(new Event('change'));


      // Update socket system to re-add socket stats to description
      if (window.unifiedSocketSystem?.updateAll) {
        window.unifiedSocketSystem.updateAll();
      }

      if (window.statsCalculator?.updateAll) {
        window.statsCalculator.updateAll();
      }
    }
  }, 100);
}


function removeCurrentCorruption() {
  if (!currentCorruptionSlot) return;


  const corruption = window.itemCorruptions[currentCorruptionSlot];
  if (corruption && corruption.itemName) {
    // If this was a socket corruption, restore the original socket count
    if (corruption.type === 'socket_corruption' && corruption.originalSocketCount !== undefined) {
      const section = SECTION_MAP[currentCorruptionSlot];
      if (section && window.unifiedSocketSystem && typeof window.unifiedSocketSystem.setSocketCount === 'function') {
        window.unifiedSocketSystem.setSocketCount(section, corruption.originalSocketCount);
      }
    }

    // Restore original properties
    if (window.originalItemProperties && window.originalItemProperties[corruption.itemName]) {
      itemList[corruption.itemName].properties = JSON.parse(JSON.stringify(window.originalItemProperties[corruption.itemName]));
    }

    // Check if item is dynamic (has baseType)
    const isDynamic = itemList[corruption.itemName].baseType;

    if (isDynamic) {
      // For dynamic items, delete the description so it regenerates dynamically
      delete itemList[corruption.itemName].description;
    } else {
      // For static items, restore the original description
      const originalDescription = window.originalItemDescriptions[corruption.itemName];
      if (originalDescription) {
        itemList[corruption.itemName].description = originalDescription;
      }
    }
  }


  delete window.itemCorruptions[currentCorruptionSlot];


  triggerItemUpdate(currentCorruptionSlot);

  closeCorruptionModal();
}


function closeCorruptionModal() {
  document.getElementById('corruptionModal').style.display = 'none';
  currentCorruptionSlot = null;
}

// Programmatically apply socket corruption (called from socket system)
window.applySocketCorruption = function (dropdownId, socketCount) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) {
    return;
  }

  const itemName = dropdown.value;
  // Use global item lookup to support both regular and crafted items
  const item = window.getItemData(itemName);
  if (!itemName || !item) {
    return;
  }

  // Store original description if not already stored
  if (!window.originalItemDescriptions[itemName]) {
    window.originalItemDescriptions[itemName] = item.description;
  }

  // Create corruption text based on socket count
  const corruptionText = socketCount === 1 ? 'Socketed (1)' : `Socketed (${socketCount})`;

  // Store corruption info
  window.itemCorruptions[dropdownId] = {
    text: corruptionText,
    type: 'socket_corruption',
    itemName: itemName,
    socketCount: socketCount
  };


  // Add corruption text to item description
  const originalDescription = window.originalItemDescriptions[itemName];
  const enhancedDescription = originalDescription + `<span class="corruption-enhanced-stat">${corruptionText}</span><br>`;
  item.description = enhancedDescription;

  // Trigger item display update
  triggerItemUpdate(dropdownId);
};


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCorruptionSystem, 100);
});


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCorruptionSystem, 100);
  });
} else {
  setTimeout(initCorruptionSystem, 100);
}


window.CorruptionSystem = {
  init: initCorruptionSystem,
  openModal: openCorruptionModal,
  removeCorruption: removeCurrentCorruption,
  getCorruptions: () => window.itemCorruptions,
  getOriginalDescriptions: () => window.originalItemDescriptions
};


window.updateDoubleModPreview = updateDoubleModPreview;
window.updateSingleModPreview = updateSingleModPreview;
window.generateCorruptionText = generateCorruptionText;
window.generateDoubleModText = generateDoubleModText;

function exampleCorruptionParsing() {
  // Parse corruption text to find stats
  const stats = [];
  const corruptionLines = corruptionText.split('<br>');

  for (const line of corruptionLines) {
    // Try each known stat pattern
    for (const [formatKey, pattern] of Object.entries(StatPatterns)) {
      const match = line.match(pattern);
      if (match) {
        stats.push({
          formatKey: formatKey,
          value: parseInt(match[1]),
          pattern: pattern
        });
        break;
      }
    }
  }

  return stats;
}

/**
 * Example: How to stack corruption with existing stat
 */
function exampleStackCorruption(description, corruptionFormatKey, corruptionValue) {
  // Parse current value from description
  const currentValue = parseStatValue(description, corruptionFormatKey);

  if (currentValue !== null) {
    // Stack the values
    const newValue = currentValue + corruptionValue;

    // Replace in description with styled text
    const result = replaceStatInDescription(
      description,
      corruptionFormatKey,
      newValue,
      'corruption-enhanced-stat'
    );

    return result;
  }

  // Stat not found, add it as new line
  const newStatText = formatStat(corruptionFormatKey, corruptionValue);
  return {
    found: false,
    description: description + `<span class="corruption-enhanced-stat">${newStatText}</span><br>`
  };
}