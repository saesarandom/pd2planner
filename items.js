const itemList = {
  "Biggin's Bonnet": {
    description:
      "Biggin's Bonnet<br>Cap<br>Defense: 19<br>Required Level: 3<br>+50% Enhanced Damage<br>50 to Attack Rating<br>+14 Defense<br>+15 to Life<br>+15 to Mana<br>",
    properties: {
      defense: 19,
      reqlvl: 3,
      edmg: 50,
      toatt: 50,
      todef: 14,
      tolife: 15,
      tomana: 15,
    },
  },
  Tarnhelm: {
    description:
      "Tarnhelm<br>Skull Cap<br>Defense: 11<br>Required Strength: 15<br>Required Level: 15<br>+1 to All Skills<br>+3 to Mana after each Kill<br>75% Extra Gold from Monsters<br>50% Better Chance of Getting Magic Items<br>",
    properties: {
      defense: 11,
      reqstr: 15,
      reqlvl: 15,
      allsk: 1,
      maek: 3,
      goldfind: 75,
      magicfind: 50,
    },
  },
  "Coif of Glory": {
    description:
      "Coif of Glory<br>Helm<br>Defense: 28<br>Required Strength: 26<br>Required Level: 14<br>Hit Blinds Target<br>+10 Defense<br>+100 Defense vs. Missile<br>Lightning Resist +15%<br>+3 Life after each Kill<br>Attacker Takes Lightning Damage of 17<br>",
    properties: {
      defense: 28,
      reqstr: 26,
      reqlvl: 14,
      blind: 1,
      todef: 10,
      tomissdef: 100,
      ligres: 15,
      laek: 3,
      atligdmg: 17,
    },
  },
  Duskeep: {
    description:
      "Duskeep<br>Full Helm<br> Defense: 60<br>Required Strength: 41<br>Required Level: 17<br>+15 to Maximum Damage<br>+50% Enhanced Defense<br>+20 Defense<br>All Resistances +15%<br>Physical Damage Taken Reduced by 7<br>+2 to Light Radius<br>",
    properties: {
      defense: 60,
      reqstr: 41,
      reqlvl: 17,
      tomaxdam: 15,
      edef: 50,
      todef: 20,
      allres: 15,
      pdr: 7,
      ligrad: 2,
    },
  },
  "The Face of Horror": {
    description:
      "The Face of Horror<br>Mask<br>Defense: 52<br>Required Strength: 23<br>Required Level: 20<br>+50% Damage to Undead<br>Hit Causes Monster to Flee 50%<br>+25 Defense<br>+20 to Strength<br>All Resistances +20%<br>",
    properties: {
      defense: 52,
      reqstr: 23,
      reqlvl: 20,
      dmgtoun: 50,
      fear: 50,
      todef: 25,
      str: 20,
      allres: 20,
    },
  },

  Wormskull: {
    description:
      "Wormskull<br>Bone Helm<br>Base Maximum Sockets: 2 (3 for ilvl 41+ upgraded elite versions)<br>Defense: 36<br>Required Strength: 25<br>Required Level: 21<br>+1 to Poison and Bone Skills (Necromancer Only)<br>+1 to Necromancer Skill Levels<br>+60 Poison Damage over 2 Seconds<br>5% Life Stolen per Hit<br>10 to Mana<br>Poison Resist +25%<br>",
    properties: {
      defense: 36,
      reqstr: 25,
      reqlvl: 21,
      pnbsk: 1,
      necsk: 1,
      poisondmg: 60,
      poisontime: 2,
      lleech: 5,
      tomana: 10,
      poisres: 25,
    },
  },

  Howltusk: {
    description:
      "Howltusk<br>Great Helm<br>Defense: 64<br>Required Strength: 63<br>Required Level: 25<br>10% Chance to Cast Level 5 Howl on Striking<br>+20% Increased Attack Speed<br>+80% Enhanced Defense<br>Magic Damage Taken Reduced by 2<br>Attacker Takes Damage of 30<br>35% Damage Taken Gained as Mana when Hit<br>",
    properties: {
      defense: 64,
      reqstr: 63,
      reqlvl: 25,
      howlctc: 10 / 5,
      ias: 20,
      edef: 80,
      mdr: 2,
      atdmg: 30,
      dmgtomana: 35,
    },
  },

  "Undead Crown": {
    description:
      "Undead Crown<br>Crown<br>Defense: 85<br>Required Strength: 55<br>Required Level: 29<br>+50% Damage to Undead<br>+100 to Attack Rating against Undead<br>5% Life Stolen per Hit<br>+3 to Skeleton Mastery (Necromancer Only)<br>+3 to Raise Skeleton Warrior (Necromancer Only)<br>+40 Defense<br>Poison Resist +50%<br>Half Freeze Duration<br>",
    properties: {
      defense: 85,
      reqstr: 55,
      reqlvl: 29,
      dmgtoun: 50,
      toattun: 100,
      lleech: 5,
      skmastery: 3,
      raiseskwarrior: 3,
      todef: 40,
      poisres: 50,
      freezedur: 0.5,
    },
  },

  "Peasant Crown": {
    description:
      "Peasant Crown<br>War Hat<br>Defense: 108<br>Required Strength: 20<br>Required Level: 28<br>+1 to All Skills<br>+20% Faster Run/Walk<br>+100% Enhanced Defense<br>+20 to Vitality<br>+20 to Energy<br>Replenish Life +12<br>",
    properties: {
      defense: 108,
      reqstr: 20,
      reqlvl: 28,
      allsk: 1,
      frw: 20,
      edef: 100,
      vit: 20,
      enr: 20,
      repl: 12,
    },
  },

  Rockstopper: {
    description:
      "Rockstopper<br>Sallet<br>Defense: 201<br>Required Strength: 43<br>Required Level: 31<br>+30% Faster Hit Recovery<br>+220% Enhanced Defense<br>+15 to Vitality<br>Cold Resist +40%<br>Lightning Resist +40%<br>Fire Resist +50%<br>Physical Damage Taken Reduced by 10%<br>",
    properties: {
      defense: 201,
      reqstr: 43,
      reqlvl: 31,
      fhr: 30,
      edef: 220,
      coldres: 40,
      ligres: 40,
      firres: 50,
      physdr: 10,
    },
  },

  Stealskull: {
    description:
      "Stealskull<br>Casque<br>Defense: 248<br>Required Strength: 59<br>Required Level: 35<br>+20% Increased Attack Speed<br>20% Faster Hit Recovery<br>5% Mana Stolen per Hit<br>5% Life Stolen per Hit<br>+240% Enhanced Defense<br>50% Better Chance of Getting Magic Items<br>",
    properties: {
      defense: 248,
      reqstr: 59,
      reqlvl: 35,
      ias: 20,
      fhr: 20,
      mleech: 5,
      lleech: 5,
      edef: 240,
      magicfind: 50,
    },
  },

  "Darksight Helm": {
    description:
      "Darksight Helm<br>Basinet<br>Defense: 84<br>Required Strength: 82<br>Required Level: 38<br>16% Chance to Cast Level 3 Dim Vision when Struck<br>5% Mana Stolen per Hit<br>Hit Blinds Target<br>+[3-297] Defense (+3 per Character Level)<br>Fire Resist +40%<br>Cannot Be Frozen<br>-4 to Light Radius<br>+1 to Cloak of Shadows<br>",
    properties: {
      defense: 84,
      reqstr: 82,
      reqlvl: 38,
      dimctcstruck: [16, 3],
      mleech: 5,
      blind: 1,
      todeflvl: 3,
      firres: 40,
      cbf: 1,
      ligrad: -4,
      cloakoskill: 1,
    },
  },

  "Blackhorn's Face": {
    description:
      "Blackhorn's Face<br>Death Mask<br>Defense: 278<br>Required Strength: 55<br>Required Level: 41<br>Prevent Monster Heal<br> Slows Target by 20%<br> +220% Enhanced Defense<br> +5% to Maximum Lightning Resist<br> Lightning Resist +30%<br> +20 Lightning Absorb<br> Attacker Takes Lightning Damage of 325<br>",
    properties: {
      defense: 278,
      reqstr: 55,
      reqlvl: 41,
      edef: 220,
      maxligres: 5,
      ligres: 30,
      lightabsorb: 20,
      atligdmg: 325,
    },
  },

  "Valkyrie Wing": {
    description:
      "Valkyrie Wing<br>Winged Helm<br>Defense: 297<br>Required Strength: 115<br>Required Level: 44<br>+2 to Amazon Skills<br> +30% Faster Run/Walk<br> +30% Faster Hit Recovery<br> +60% Enhanced Damage<br> +200% Enhanced Defense<br> +6 to Mana after each Kill<br>",
    properties: {
      defense: 297,
      reqstr: 115,
      reqlvl: 44,
      amask: 2,
      frw: 30,
      fhr: 30,
      edmg: 60,
      edef: 200,
      tomana: 6,
    },
  },

  "Crown of Thieves": {
    description:
      "Crown of Thieves<br>Grand Crown<br>Defense: 342<br>Required Strength: 103<br>Required Level: 49<br>10% Life Stolen per Hit<br> +200% Enhanced Defense<br> +25 to Dexterity<br> +50 to Life<br> Fire Resist +33%<br> 100% Extra Gold from Monsters<br> 65% Better Chance of Getting Magic Items<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edef: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Harlequin Crest": {
    description:
      "Harlequin Crest<br>Shako<br>Defense: 141<br>Required Strength: 50<br>Required Level: 62<br>+2 to All Skills<br> +2 to All Attributes<br> +[1-99] to Life (+1 per Character Level)<br> +[1-99] to Mana (+1 per Character Level)<br> Physical Damage Taken Reduced by 5%<br> 50% Better Chance of Getting Magic Items<br>",
    properties: {
      defense: 141,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Steel Shade": {
    description:
      "Steel Shade<br> Armet<br> Defense: 345<br> Required Strength: 109<br> Required Level: 62<br> +2 to All Skills<br> +20% Faster Block Rate<br> 20% Increased Chance of Blocking<br> 8% Mana Stolen per Hit<br> +130% Enhanced Defense<br> Replenish Life +48<br> +6 Fire Absorb<br> 80% Extra Gold from Monsters<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Andariel's Visage": {
    description:
      "Andariel's Visage<br> Demonhead<br> Defense: 387<br> Required Strength: 102<br> Required Level: 83<br> 15% Chance to Cast Level 30 Poison Nova when Struck<br> +2 to All Skills<br> +30% Increased Attack Speed<br> 10% Life Stolen per Hit<br> +150% Enhanced Defense<br> +30 to Strength<br> +8% to Maximum Poison Resist<br> Fire Resist -20%<br> Poison Resist +70%<br> Level 3 Venom (20 Charges)<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Giant Skull": {
    description:
      "Giant Skull<br> Bone Visage<br> Defense: 477<br> Required Strength: 106<br> Required Level: 65<br> +35% Chance to Pierce<br> +80% Enhanced Damage<br> 25% Chance of Crushing Blow<br> Knockback<br> +320 Defense<br> +35 to Strength<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Veil of Steel": {
    description:
      "Veil of Steel<br> Spired Helm<br> Defense: 652<br> Durability: 60<br> Required Strength: 192<br> Required Level: 73<br> +1 to All Skills<br> +80% Enhanced Damage<br> +220% Enhanced Defense<br> +140 Defense<br> +15 to Strength<br> +15 to Vitality<br> All Resistances +40<br> +20 Durability<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Nightwing's Veil": {
    description:
      "Nightwing's Veil<br> Spired Helm<br> Defense: 352<br> Required Strength: 96<br> Required Level: 67<br> +2 to All Skills<br> -10% to Enemy Cold Resistance<br> +15% to Cold Skill Damage<br> +120% Enhanced Defense<br> +20 to Dexterity<br> +9 Cold Absorb<br> Half Freeze Duration<br> Requirements -50%<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Crown of Ages": {
    description:
      "Crown of Ages<br> Corona<br> Defense: 399<br> Required Strength: 174<br> Required Level: 82<br> Indestructible<br> +30% Faster Hit Recovery<br> 50% Reduced Curse Duration<br> +50% Enhanced Defense<br> +150 Defense<br> All Resistances +30<br> Physical Damage Taken Reduced by 15%<br> Socketed [2-3]<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Overlord's Helm": {
    description:
      "Overlord's Helm<br> Giant Conch<br> Defense: 834<br> Required Strength: 142<br> Required Level: 85<br> -10% to Enemy Physical Resistance<br> 8% Life Stolen per Hit<br> +680 Defense<br> +30 to Strength<br> +15 to Dexterity<br> +15 to Vitality<br> -30 to Energy<br> Curse Resistance -30%<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Kira's Guardian": {
    description:
      "Kira's Guardian<br> Tiara<br> Defense: 170<br> Required Level: 77<br> +20% Faster Hit Recovery<br> -15% to Enemy Cold Resistance<br> -15% to Enemy Lightning Resistance<br> -15% to Enemy Fire Resistance<br> +120 Defense<br> All Resistances +40<br> Cannot Be Frozen<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Griffon's Eye": {
    description:
      "Griffon's Eye<br> Diadem<br> Defense: 260<br> Required Level: 76<br> +1 to All Skills<br> +25% Faster Cast Rate<br> +15% to Lightning Skill Damage<br> -20% to Enemy Lightning Resistance<br> +200 Defense<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Cyclopean Roar": {
    description:
      "Cyclopean Roar<br> Jawbone Visor<br> Defense: 169<br> Required Strength: 58<br> Required Level: 28<br> (Barbarian Only)<br> 8% Chance to Cast Level 6 Battle Cry on Striking<br> or<br> 8% Chance to Cast Level 6 Battle Cry on Casting<br> +3 to Warcries (Barbarian Only)<br> +20% Faster Run/Walk<br> +20% to Leap and Leap Attack Movement Speed<br> +145% Enhanced Defense<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Arreat's Face": {
    description:
      "Arreat's Face<br> Slayer Guard<br> Defense: 363<br> Required Strength: 118<br> Required Level: 42<br> (Barbarian Only)<br> +2 to Combat Skills (Barbarian Only)<br> +2 to Barbarian Skills<br> +30% Faster Hit Recovery<br> 20% Bonus to Attack Rating<br> 6% Life Stolen per Hit<br> +200% Enhanced Defense<br> +20 to Strength<br> +20 to Dexterity<br> All Resistances +20<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  Wolfhowl: {
    description:
      "Wolfhowl<br> Fury Visor<br> Defense: 377<br> Required Strength: 129<br> Required Level: 79<br> (Barbarian Only)<br> +3 to Warcries (Barbarian Only)<br> Removed<br> +6 to Feral Rage<br> +6 to Werewolf<br> +150% Enhanced Defense<br> +15 to Strength<br> +15 to Dexterity<br> +15 to Summon Dire Wolf<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Demonhorn's Edge": {
    description:
      "Demonhorn's Edge<br> Destroyer Helm<br> Defense: 408<br> Required Strength: 151<br> Required Level: 61<br> (Barbarian Only)<br> +3 to Warcries (Barbarian Only)<br> +3 to Masteries (Barbarian Only)<br> +3 to Combat Skills (Barbarian Only)<br> 20% Chance of Open Wounds<br> +350 Open Wounds Damage per Second<br> +160% Enhanced Defense<br> Physical Damage Taken Reduced by 24<br> Attacker Takes Damage of 1050<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Halaberd's Reign": {
    description:
      "Halaberd's Reign<br> Conqueror Crown<br> Defense: 432<br> Required Strength: 174<br> Required Level: 77<br> (Barbarian Only)<br> +3 Masteries (Barbarian Only)<br> +2 to Barbarian Skills<br> +20% Faster Hit Recovery<br> +[4-445] to Attack Rating (+4.5 per Character Level)<br> +3 to Battle Orders (Barbarian Only)<br> +3 to Battle Cry (Barbarian Only)<br> +170% Enhanced Defense<br> Physical Damage Taken Reduced by 15%<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Raekor's Virtue": {
    description:
      "Raekor's Virtue<br> Guardian Crown<br> Defense: 473<br> Required Strength: 196<br> Required Level: 78<br> Minimum Item Level: 87<br> (Barbarian Only)<br> You May Apply an Additional Curse<br> +2 to Barbarian Skills<br> 8% Mana Stolen per Hit<br> +4 to Frenzy (Barbarian Only)<br> +4 to Double Swing (Barbarian Only)<br> +180% Enhanced Defense<br> +30 to Dexterity<br> Curse Resistance +20%<br> +4 to Light Radius<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  Quetzalcoatl: {
    description:
      "Quetzalcoatl<br> Hawk Helm<br> Defense: 28<br> Required Strength: 20<br> Required Level: 29<br> (Druid Only)<br> +2 to Druid Skills<br> Gust's Cooldown is Reduced by 2 Seconds<br> +10% Faster Cast Rate<br> +80% Enhanced Defense<br> Cold Resist +25%<br> +4 Life after each Kill<br> Does not reduce Gust cooldown below 0.5 seconds<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Jalal's Mane": {
    description:
      "Jalal's Mane<br> Totemic Mask <br> Defense: 297<br> Required Strength: 65<br> Required Level: 42<br> (Druid Only)<br> +2 to Shape Shifting Skills (Druid Only)<br> +2 to Druid Skills<br> +30% Faster Hit Recovery<br> 20% Bonus to Attack Rating<br> +200% Enhanced Defense<br> +2] to Strength<br> +20 to Energy<br> All Resistances +25<br> +5 to Mana after each Kill<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Cerebus' Bite": {
    description:
      "Cerebus' Bite<br> Blood Spirit<br> Defense: 350<br> Required Strength: 86<br> Required Level: 63<br> (Druid Only)<br> +4 to Shape Shifting Skills (Druid Only)<br> 120% Bonus to Attack Rating<br> 33% Deadly Strike<br> 33% Chance of Open Wounds<br> +360 Open Wounds Damage per Second<br> +2 to Feral Rage (Druid Only)<br> +2 to Hunger (Druid Only)<br> +140% Enhanced Defense<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  Denmother: {
    description:
      "Denmother<br> Sun Spirit<br> Defense: 333<br> Required Strength: 95<br> Required Level: 58<br> (Druid Only)<br> +2 to Druid Skill Levels<br> You May Summon 2 Additional Grizzlies<br> You May No Longer Summon Wolves<br> +20% Faster Cast Rate<br> +3 to Summon Grizzly (Druid Only)<br> +3 to Maul (Druid Only)<br> +125% Enhanced Defense<br> Replenish Life +35<br> 80% Extra Gold from Monsters<br> Socketed ([2-3])<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  Ravenlore: {
    description:
      "Ravenlore<br> Sky Spirit<br> Defense: 390<br> Required Strength: 113<br> Required Level: 74<br> (Druid Only)<br> +3 to Elemental Skills (Druid Only)<br> +7 to Raven (Druid Only)<br> -20% to Enemy Fire Resistance<br> +150% Enhanced Defense<br> +30 to Energy<br> All Resistances +25<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Spirit Keeper": {
    description:
      "Spirit Keeper<br> Earth Spirit<br> Defense: 443<br> Required Strength: 104<br> Required Level: 67<br> (Druid Only)<br> +2 to Druid Skills<br> +20% Faster Hit Recovery<br> +2 to Random Druid Skill* (Druid Only)<br> +190% Enhanced Defense<br> You May Now Summon 1 Additional Spirit<br> +8% to Maximum Poison Resist<br> Fire Resist +30%<br> +6 Lightning Absorb<br> Cold Absorb 5%<br> * Excludes Druid skills with new IDs (Gust)<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Ursa's Nightmare": {
    description:
      "Ursa's Nightmare<br> Dream Spirit<br> Base Durability: 20<br> Defense: 416<br> Required Strength: 118<br> Required Level: 66<br> (Druid Only)<br> You cannot life steal when above 60% maximum life<br> +[0-40]% Increased Splash Radius (based on missing life)<br> +3 to Shape Shifting Skills (Druid Only)<br> +40% Faster Hit Recovery<br> Prevent Monster Heal<br> +160% Enhanced Defense<br> Increase Maximum Life 35%<br> Drain Life -30<br>",
    properties: {
      defense: 342,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Arcanna's Head": {
    description:
      "Arcanna's Head<br> Skull Cap<br> Defense: 11<br> Defense (2 Items): 11-308<br> Required Strength: 15<br> Required Level: 15<br> Replenish Life +14<br> +40 to Mana<br> Regenerate Mana 20%<br> Attacker Takes Damage of 12<br> +[3-297] Defense (+3 per Character Level) (2 Items)<br> Lightning Resist +25% (3 Items)<br>",
    properties: {
      defense: 11,
      reqstr: 15,
      reqlvl: 15,
      tomana: 40,
      regmana: 20,
      atdmg: 12,
    },
  },

  // UNIQUE ARMORS //

  Greyform: {
    description:
      "Greyform<br>Quilted Armor<br>Base Maximum Sockets: 2 (3)<br>Defense: 31<br>Required Strength: 12<br>Required Level: 7<br>5% Life Stolen per Hit<br>20 Defense<br>+10 to Dexterity<br>Cold Resist +20%<br>Fire Resist +20%<br>Magic Damage Taken Reduced by 3<br>",
    properties: {
      defense: 31,
      reqstr: 12,
      reqlvl: 7,
      lleech: 5,
      todef: 20,
      dex: 10,
      coldres: 20,
      firres: 20,
      mdr: 3,
    },
  },

  "Blinkbat's Form": {
    description:
      "Blinkbat's Form<br> Leather Armor<br> Base Maximum Sockets: 2 (3 for upgraded elite versions)<br> Defense: 42<br> Required Strength: 15<br> Required Level: 12<br> +20% Faster Run/Walk<br> +40% Faster Hit Recovery<br> Adds 10-15 Fire Damage<br> +25 Defense<br> +50 Defense vs. Missile<br>",
    properties: {
      defense: 42,
      reqstr: 15,
      reqlvl: 12,
      frw: 20,
      fhr: 40,
      firedmgmin: 10,
      firedmgmax: 15, // Fire damage range can be averaged or left empty
      todef: 25,
      todefmiss: 50,
    },
  },

  "The Centurion": {
    description:
      "The Centurion<br> Hard Leather Armor<br> Base Maximum Sockets: 2 (3 for upgraded elite versions)<br> Defense: 55<br> Required Strength: 20<br> Required Level: 14<br> 20% Increased Chance of Blocking<br> +30% Enhanced Damage<br> +50 to Attack Rating<br> +30 Defense<br> +15 to Life<br> Replenish Life +15<br> +15 to Mana<br> Physical Damage Taken Reduced by 2<br>",
    properties: {
      defense: 55,
      reqstr: 20,
      reqlvl: 14,
      block: 20,
      edmg: 30,
      toatt: 50,
      todef: 30,
      tolife: 15,
      tomana: 15,
      pdr: 2,
    },
  },

  Twitchthroe: {
    description:
      "Twitchthroe<br> Studded Leather<br> Base Maximum Sockets: 2 (3 for upgraded elite versions)<br> Defense: 62<br> Required Strength: 27<br> Required Level: 16<br> +40% Increased Attack Speed<br> +20% Faster Hit Recovery<br> 25% Increased Chance of Blocking<br> +25 Defense<br> +10 to Strength<br> +10 to Dexterity<br>",
    properties: {
      defense: 62,
      reqstr: 27,
      reqlvl: 16,
      ias: 40,
      fhr: 20,
      block: 25,
      todef: 25,
      str: 10,
      dex: 10,
    },
  },

  Darkglow: {
    description:
      "Darkglow<br> Ring Mail<br> Defense: 104<br> Required Strength: 36<br> Required Level: 14<br> +120 to Attack Rating<br> +100% Enhanced Defense<br> +50 Defense vs. Missile<br> +5% to Maximum Poison Resist<br> +5% to Maximum Cold Resist<br> +5% to Maximum Lightning Resist<br> +5% to Maximum Fire Resist<br> All Resistances +15<br> +3 to Light Radius<br>",
    properties: {
      defense: 104,
      reqstr: 36,
      reqlvl: 14,
      toatt: 120,
      edmg: 100,
      todefmiss: 50,
      maxpoisres: 5,
      maxcoldres: 5,
      maxligres: 5,
      maxfirres: 5,
      allres: 15,
      tolightrad: 3,
    },
  },

  Hawkmail: {
    description:
      "Hawkmail<br> Scale Mail<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Defense: 128<br> Required Strength: 44<br> Required Level: 15<br> +25% Faster Run/Walk<br> +3 to Raven<br> +100% Enhanced Defense<br> +5% to Maximum Cold Resist<br> Cold Resist +30%<br> Cannot Be Frozen<br>",
    properties: {
      defense: 128,
      reqstr: 44,
      reqlvl: 15,
      frw: 25,
      ravenoskill: 3,
      edef: 100,
      maxcoldres: 5,
      coldres: 30,
      cbf: 1,
    },
  },

  "Sparking Mail": {
    description:
      "Sparking Mail<br> Chain Mail<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Defense: 133<br> Required Strength: 48<br> Required Level: 17<br> Adds 1-45 Lightning Damage<br> +10% to Lightning Skill Damage<br> +85% Enhanced Defense<br> Lightning Resist +30%<br> Attacker Takes Lightning Damage of 28<br>",
    properties: {
      defense: 133,
      reqstr: 48,
      reqlvl: 17,
      lightdmgmin: 1,
      lightdmgmax: 45,
      edef: 85,
      lightdamage: 10,
      ligres: 30,
      atligdmg: 28,
    },
  },

  "Venom Ward": {
    description:
      "Venom Ward<br> Breast Plate<br> Defense: 118<br> Required Strength: 30<br> Required Level: 20<br> -12% to Enemy Poison Resistance<br> +100% Enhanced Defense<br> +8% to Maximum Poison Resist<br> Poison Resist +60%<br> Poison Length Reduced by 50%<br> +2 to Light Radius<br>",
    properties: {
      defense: 118,
      reqstr: 30,
      reqlvl: 20,
      poisonpierce: 12,
      edef: 100,
      maxpoisres: 8,
      poisres: 60,
      plr: 50,
      lightrad: 2,
    },
  },

  Iceblink: {
    description:
      "Iceblink<br> Splint Mail<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Defense: 153<br> Required Strength: 51<br> Required Level: 22<br> +2 to Cold Skills<br> Freezes Target<br> +80% Enhanced Defense<br> Cold Resist +35%<br> Magic Damage Taken Reduced by 6<br> +4 to Light Radius<br>",
    properties: {
      defense: 153,
      reqstr: 51,
      reqlvl: 22,
      coldskills: 2,
      freeze: 1,
      edef: 80,
      coldres: 35,
      mdr: 6,
      ligrad: 4,
    },
  },

  Boneflesh: {
    description:
      "Boneflesh<br> Plate Mail<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Defense: 239<br> Required Strength: 65<br> Required Level: 26<br> 10% Chance to Cast Level 15 Bone Armor when Struck<br> +235 to Attack Rating<br> 5% Life Stolen per Hit<br> 25% Chance of Open Wounds<br> +32 Open Wounds Damage per Second<br> +120% Enhanced Defense<br>",
    properties: {
      defense: 239,
      reqstr: 65,
      reqlvl: 26,
      bonearmorctcstruck: 10 - 15,
      toatt: 235,
      lleech: 5,
      ow: 25,
      owdmg: 32,
      edef: 120,
    },
  },

  Rockfleece: {
    description:
      "Rockfleece<br> Field Plate<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Defense: 236<br> Required Strength: 50<br> Required Level: 28<br> +130% Enhanced Defense<br> +15 to Strength<br> Physical Damage Taken Reduced by 15%<br> Physical Damage Taken Reduced by 10<br> Requirements -10%<br>",
    properties: {
      defense: 236,
      reqstr: 50,
      reqlvl: 28,
      edef: 130,
      str: 15,
      physdr: 15,
      pdr: 10,
      req: -10,
    },
  },

  Rattlecage: {
    description:
      "Rattlecage<br> Gothic Plate<br> Defense: 328<br> Required Strength: 70<br> Required Level: 29<br> +90% Enhanced Damage<br> +145 to Attack Rating<br> 25% Chance of Crushing Blow<br> Hit Causes Monster to Flee 10%??? <br> +200 Defense<br>",
    properties: {
      defense: 328,
      reqstr: 70,
      reqlvl: 29,
      edmg: 90,
      toatt: 145,
      cb: 25,
      fear: 10,
      todef: 200,
    },
  },

  "Heavenly Garb": {
    description:
      "Heavenly Garb<br> Light Plate<br> Defense: 200<br> Required Strength: 41<br> Required Level: 29<br> Level 4 Sanctuary Aura when Equipped<br> +1 to Magic Skills<br> +50% Damage to Undead<br> +100 to Attack Rating against Undead<br> +100% Enhanced Defense<br> +15 to Energy<br> Regenerate Mana 25%<br> All Resistances +20<br>",
    properties: {
      defense: 200,
      reqstr: 41,
      reqlvl: 29,
      sancaura: 4,
      magicsk: 1,
      dmgtoun: 50,
      atttoun: 100,
      enr: 15,
      regmana: 25,
      allres: 20,
    },
  },

  Goldskin: {
    description:
      "Goldskin<br> Full Plate Mail<br> Defense: 377<br> Required Strength: 80<br> Required Level: 28<br> +150% Enhanced Defense<br> All Resistances +35<br> Attacker Takes Damage of 10<br> 200% Extra Gold from Monsters<br> +2 to Light Radius<br>",
    properties: {
      defense: 377,
      reqstr: 80,
      reqlvl: 28,
      edef: 150,
      allres: 35,
      atdmg: 10,
      goldfind: 200,
      ligrad: 2,
    },
  },

  "Silks of the Victor": {
    description:
      "Silks of the Victor<br> Ancient Armor<br> Defense: 409<br> Required Strength: 100<br> Required Level: 28<br> +1 to All Skills<br> +25% Faster Run/Walk<br> 5% Mana Stolen per Hit<br> +120% Enhanced Defense<br> +4 Life after each Kill<br> +2 to Light Radius<br>",
    properties: {
      defense: 409,
      reqstr: 100,
      reqlvl: 28,
      allsk: 1,
      frw: 25,
      mleech: 5,
      edef: 120,
      laek: 4,
      ligrad: 2,
    },
  },

  "Spirit Shroud": {
    description:
      "Spirit Shroud<br> Ghost Armor<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Defense: 282<br> Required Strength: 38<br> Required Level: 28<br> +1 to All Skills<br> +30% Faster Cast Rate<br> +150% Enhanced Defense<br> Replenish Life +20<br> Curse Resistance +10%<br> Magic Damage Taken Reduced by 11<br> Cannot Be Frozen<br>",
    properties: {
      defense: 282,
      reqstr: 38,
      reqlvl: 28,
      allsk: 1,
      fcr: 30,
      edef: 150,
      repl: 20,
      curres: 10,
      mdr: 11,
      cbf: 1,
    },
  },

  Vipermagi: {
    description:
      "Skin of the Vipermagi<br> Serpentskin Armor<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Defense: 270<br> Required Strength: 43<br> Required Level: 29<br> +1 to All Skills<br> +30% Faster Cast Rate<br> +120% Enhanced Defense<br> All Resistances +30<br> Magic Damaged Taken Reduced by 8<br>",
    properties: {
      defense: 270,
      reqstr: 43,
      reqlvl: 29,
      allsk: 1,
      fcr: 30,
      edef: 120,
      allres: 30,
      mdr: 8,
    },
  },

  // UNIQUE WEAPONS AXES //

  "The Gnasher": {
    description:
      "The Gnasher<br> Hand Axe<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 4 to 9, Avg 6.5<br> Required Level: 5<br> +50% Enhanced Damage<br> 20% Chance of Crushing Blow<br> 50% Chance of Open Wounds<br> +2 Open Wounds Damage per Second<br> +8 to Strength<br>",
    properties: {
      speed: 0,
      onehandmin: 4,
      onehandmax: 9,
      reqlvl: 5,
      edmg: 50,
      cb: 20,
      ow: 50,
      owdmg: 2,
      str: 8,
    },
  },

  Bladebone: {
    description:
      "Bladebone<br> Double Axe<br> Base Speed Modifier: 10<br> Base Melee Range: 2<br> One-Hand Damage: 7 to 19, Avg 13<br> Required Strength: 43<br> Required Level: 15<br> 40% Chance to Cast Level 8 Teeth on Striking<br> +20% Increased Attack Speed<br> +50% Enhanced Damage<br> +100% Damage to Undead<br> +40 to Attack Rating against Undead<br> +60 Defense<br>",
    properties: {
      speed: 10,
      onehandmin: 7,
      onehandmax: 19,
      reqstr: 43,
      reqlvl: 15,
      teethctc: 40 - 8,
      ias: 20,
      edmg: 50,
      dmgtoun: 100,
      atttoun: 40,
      todef: 60,
    },
  },

  "Skull Splitter": {
    description:
      "Skull Splitter<br> Military Pick<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> One-Hand Damage: 12 to 19, Avg 15.5<br> Required Strength: 49<br> Required Level: 21<br> +80% Enhanced Damage<br> +100 to Attack Rating<br> Adds 1-60 Lightning Damage<br> 15% Chance of Open Wounds<br> +16 Open Wounds Damage per Second<br> Hit Blinds Target +2<br> Regenerate Mana 20%<br>",
    properties: {
      speed: -10,
      onehandmin: 12,
      onehandmax: 19,
      reqstr: 49,
      reqlvl: 21,
      edmg: 80,
      toatt: 100,
      lightdmgmin: 1,
      lightdmgmax: 60,
      ow: 15,
      owdmg: 16,
      blind: 2,
      regmana: 20,
    },
  },

  Rakescar: {
    description:
      "Rakescar<br> War Axe<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 30 to 50, Avg 40<br> Required Strength: 67<br> Required Level: 27<br> +30% Increased Attack Speed<br> +150% Enhanced Damage<br> +100 to Attack Rating<br> +38 Poison Damage over 2 Seconds<br> Poison Resist +50%<br>",
    properties: {
      speed: 0,
      onehandmin: 30,
      onehandmax: 50,
      reqstr: 67,
      reqlvl: 27,
      ias: 30,
      edmg: 150,
      toatt: 100,
      poisondmg: 38,
      poisontime: 2,
      poires: 50,
    },
  },

  "Axe of Fechmar": {
    description:
      "Axe of Fechmar<br> Large Axe<br> Base Speed Modifier: -10<br> Base Melee Range: 3<br> Base Maximum Sockets: 4 (5 for ilvl 26+ upgraded versions)<br> Two-Hand Damage: 11 to 24, Avg 17.5<br> Required Strength: 35<br> Required Level: 8<br> +40% Increased Attack Speed<br> +90% Enhanced Damage<br> Freezes Target +3<br> Cold Resist +50%<br> +2 to Light Radius<br>",
    properties: {
      speed: -10,
      twohandmin: 11,
      twohandmax: 24,
      reqstr: 35,
      reqlvl: 8,
      ias: 40,
      edmg: 90,
      freeze: 3,
      coldres: 50,
      ligrad: 2,
    },
  },

  Goreshovel: {
    description:
      "Goreshovel<br> Broad Axe<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 15 to 36, Avg 25.5<br> Required Strength: 48<br> Required Level: 14<br> +30% Increased Attack Speed<br> +50% Enhanced Damage<br> +9 to Maximum Damage<br> 60% Chance of Open Wounds<br> +12 Open Wounds Damage per Second<br> +25 to Strength<br>",
    properties: {
      speed: 0,
      twohandmin: 15,
      twohandmax: 36,
      reqstr: 48,
      reqlvl: 14,
      ias: 30,
      edmg: 50,
      tomaxdmg: 9,
      ow: 60,
      owdmg: 12,
      str: 25,
    },
  },

  "The Chieftain": {
    description:
      "The Chieftain<br> Battle Axe<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 33 to 89, Avg 61<br> Required Strength: 54<br> Required Level: 19<br> +40% Increased Attack Speed<br> +180% Enhanced Damage<br> Adds 1-40 Lightning Damage<br> All Resistances +20<br> +6 to Mana after each Kill<br>",
    properties: {
      speed: 10,
      twohandmin: 33,
      twohandmax: 89,
      reqstr: 54,
      reqlvl: 19,
      ias: 40,
      edmg: 180,
      lightdmgmin: 1,
      lightdmgmax: 40,
      allres: 20,
      maek: 6,
    },
  },

  Brainhew: {
    description:
      "Brainhew<br> Great Axe<br> Base Speed Modifier: -10<br> Base Melee Range: 4<br> Two-Hand Damage: 41 to 90, Avg 65.5<br> Required Strength: 63<br> Required Level: 25<br> +40% Increased Attack Speed<br> +200% Enhanced Damage<br> +14 to Minimum Damage<br> Adds 15-35 Fire Damage<br> 13% Mana Stolen per Hit<br> +25 to Mana<br> +4 to Light Radius<br>",
    properties: {
      speed: -10,
      twohandmin: 41,
      twohandmax: 90,
      reqstr: 63,
      reqlvl: 25,
      ias: 40,
      edmg: 200,
      tomindmg: 14,
      firedmgmin: 15,
      firedmgmax: 35,
      mleech: 13,
      tomana: 25,
      ligrad: 4,
    },
  },

  Humongous: {
    description:
      "Humongous<br> Giant Axe<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 82 to 178, Avg 130<br> Required Strength: 84<br> Required Level: 29<br> Melee Splash Radius Increased by 20%<br> +20% Increased Attack Speed<br> +240% Enhanced Damage<br> Adds 8-25 Damage<br> 33% Chance of Crushing Blow<br> +30 to Strength<br> Requirements +20%<br>",
    properties: {
      speed: 10,
      twohandmin: 82,
      twohandmax: 178,
      reqstr: 84,
      reqlvl: 29,
      splash: 20,
      ias: 20,
      edmg: 240,
      tomindmg: 8,
      tomaxdmg: 25,
      cb: 33,
      str: 30,
      req: 20,
    },
  },

  Felloak: {
    description:
      "Felloak<br> Club<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 1 to 10, Avg 5.5<br> Required Level: 3<br> After<br> 80% Enhanced Damage<br> Adds 6-8 Fire Damage<br> +3 to Firestorm (Druid Only)<br> Knockback<br> Lightning Resist +50%<br> Fire Resist +30%<br> +50% Damage to Undead<br>",
    properties: {
      speed: -10,
      onehandmin: 1,
      onehandmax: 10,
      reqlvl: 3,
      edmg: 80,
      firedmgmin: 6,
      firedmgmax: 8,
      firestormsk: 3,
      knock: 1,
      ligres: 50,
      dmgtoun: 50,
    },
  },

  Stoutnail: {
    description:
      "Stoutnail<br> Spiked Club<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 10 to 16, Avg 13<br> Required Level: 5<br> +100% Enhanced Damage<br> +4 to Lycanthropy (Druid Only)<br> +14 to Vitality<br> Magic Damage Taken Reduced by 4<br> Attacker Takes Damage of 10<br> +50% Damage to Undead<br>",
    properties: {
      speed: 0,
      onehandmin: 10,
      onehandmax: 16,
      reqlvl: 5,
      edmg: 100,
      lycanthrophysk: 4,
      vit: 14,
      mdr: 4,
      atdmg: 10,
      dmgtoun: 50,
    },
  },

  Crushflange: {
    description:
      "Crushflange<br> Mace<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 6 to 20, Avg 13<br> Required Strength: 27<br> Required Level: 9<br> +100% Enhanced Damage<br> 33% Chance of Crushing Blow<br> +15 to Strength<br> Fire Resist +50%<br> +2 to Light Radius<br> +50% Damage to Undead<br>",
    properties: {
      speed: 0,
      onehandmin: 6,
      onehandmax: 20,
      reqstr: 27,
      reqlvl: 9,
      edmg: 100,
      cb: 33,
      str: 15,
      firres: 50,
      ligrad: 2,
      dmgtoun: 50,
    },
  },

  Bloodrise: {
    description:
      "Bloodrise<br> Morning Star<br> Base Speed Modifier: 10<br> Base Melee Range: 2<br> One-Hand Damage: 14 to 32, Avg 23<br> Required Strength: 36<br> Required Level: 15<br> +30% Increased Attack Speed<br> +100% Enhanced Damage<br> 50% Bonus to Attack Rating<br> 6% Life Stolen per Hit<br> 25% Chance of Open Wounds<br> +8 Open Wounds Damage per Second<br> +3 to Sacrifice (Paladin Only)<br> +50% Damage to Undead<br>",
    properties: {
      speed: 10,
      onehandmin: 14,
      onehandmax: 32,
      reqstr: 36,
      reqlvl: 15,
      ias: 30,
      edmg: 100,
      toattpercent: 50,
      lleech: 6,
      ow: 25,
      owdmg: 8,
      sacrificesk: 3,
      dmgtoun: 50,
    },
  },

  "The General's Tan Do Li Ga": {
    description:
      "The General's Tan Do Li Ga<br> Flail<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> One-Hand Damage: 2 to 78, Avg 40<br> Required Strength: 41<br> Required Dexterity: 35<br> Required Level: 21<br> +20% Increased Attack Speed<br> +60% Enhanced Damage<br> Adds 10 to 40 Damage<br> 5% Mana Stolen per Hit<br> Slows Target by 10%<br> +75 Defense<br> +50% Damage to Undead<br>",
    properties: {
      speed: -10,
      onehandmin: 2,
      onehandmax: 78,
      reqstr: 41,
      reqdex: 35,
      reqlvl: 21,
      ias: 20,
      edmg: 60,
      tomindmg: 10,
      tomaxdmg: 40,
      mleech: 5,
      slow: 10,
      todef: 75,
      dmgtoun: 50,
    },
  },

  Ironstone: {
    description:
      "Ironstone<br> War Hammer<br> Base Speed Modifier: 20<br> Base Melee Range: 2<br> One-Hand Damage: 55 to 80, Avg 67.5<br> Required Strength: 53<br> Required Level: 27<br> +20% Increased Attack Speed<br> +150% Enhanced Damage<br> +150 to Attack Rating<br> Adds 1-50 Lightning Damage<br> +10 to Strength<br> +50% Damage to Undead<br>",
    properties: {
      speed: 20,
      onehandmin: 55,
      onehandmax: 80,
      reqstr: 53,
      reqlvl: 27,
      ias: 20,
      edmg: 150,
      toatt: 150,
      lightdmgmin: 1,
      lightdmgmax: 50,
      str: 10,
      dmgtoun: 50,
    },
  },

  Bonesnap: {
    description:
      "Bonesnap<br> Maul<br> Base Speed Modifier: 10<br> Base Melee Range: 4<br> Two-Hand Damage: 120 to 172, Avg 146<br> Required Strength: 69<br> Required Level: 24<br> +300% Enhanced Damage<br> +100% Damage to Undead<br> 40% Chance of Crushing Blow<br> Cold Resist +30%<br> Fire Resist +30%<br>",
    properties: {
      speed: 10,
      twohandmin: 120,
      twohandmax: 172,
      reqstr: 69,
      reqlvl: 24,
      edmg: 300,
      dmgtoun: 100,
      cb: 40,
      colres: 30,
      firres: 30,
    },
  },

  "Upped Bonesnap": {
    description:
      "Upped Bonesnap<br> War Club<br> Base Speed Modifier: 10<br> Base Melee Range: 4<br> Two-Hand Damage: 276 to 452, Avg 364<br> Required Strength: 124<br> Required Level: 25<br> +300% Enhanced Damage<br> +100% Damage to Undead<br> 40% Chance of Crushing Blow<br> Cold Resist +30%<br> Fire Resist +30%<br>",
    properties: {
      speed: 10,
      twohandmin: 276,
      twohandmax: 452,
      reqstr: 124,
      reqlvl: 25,
      edmg: 300,
      dmgtoun: 100,
      cb: 40,
      colres: 30,
      firres: 30,
    },
  },

  Steeldriver: {
    description:
      "Steeldriver<br> Great Maul<br> Base Speed Modifier: 20<br> Base Melee Range: 3<br> Two-Hand Damage: 144 to 220, Avg 182<br> Required Strength: 50<br> Required Level: 29<br> +40% Increased Attack Speed<br> +280% Enhanced Damage<br> Heal Stamina Plus 25%<br> Requirements -50%<br> +50% Damage to Undead<br>",
    properties: {
      speed: 20,
      twohandmin: 144,
      twohandmax: 220,
      reqstr: 50,
      reqlvl: 29,
      ias: 40,
      edmg: 280,
      healstam: 25,
      req: -50,
      dmgtoun: 50,
    },
  },

  "Rixot's Keen": {
    description:
      "Rixot's Keen<br> Short Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 9 to 14, Avg 11.5<br> Required Level: 2<br> +100% Enhanced Damage<br> +5 to Minimum Damage<br> 25% Chance of Crushing Blow<br> 20% Bonus to Attack Rating<br> +25 Defense<br> +2 to Light Radius<br>",
    properties: {
      speed: 0,
      onehandmin: 9,
      onehandmax: 14,
      reqlvl: 2,
      edmg: 100,
      tomindmg: 5,
      cb: 25,
      toattpercent: 20,
      todef: 25,
      ligrad: 2,
    },
  },

  "Blood Crescent": {
    description:
      "Blood Crescent<br> Scimitar<br> Base Speed Modifier: -20<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 3 to 9, Avg 6<br> Required Dexterity: 21<br> Required Level: 7<br> +15% Increased Attack Speed<br> +60% Enhanced Damage<br> 15% Life Stolen per Hit<br> 33% Chance of Open Wounds<br> +4 Open Wounds Damage per Second<br> All Resistances +15<br> +4 to Light Radius<br>",
    properties: {
      speed: -20,
      onehandmin: 3,
      onehandmax: 9,
      reqdex: 21,
      reqlvl: 7,
      ias: 15,
      edmg: 60,
      lleech: 15,
      ow: 33,
      owdmg: 4,
      allres: 15,
      ligrad: 4,
    },
  },

  "Skewer of Krintiz": {
    description:
      "Skewer of Krintiz<br> Sabre<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 10 to 23, Avg 16.5<br> Required Strength: 25<br> Required Dexterity: 25<br> Required Level: 10<br> +70% Enhanced Damage<br> Adds 5-10 Damage<br> Ignore Target's Defense<br> 7% Mana Stolen per Hit<br> +10 to Strength<br> +10 to Dexterity<br>",
    properties: {
      speed: -10,
      onehandmin: 10,
      onehandmax: 23,
      reqstr: 25,
      reqdex: 25,
      reqlvl: 10,
      edmg: 70,
      tomindmg: 5,
      tomaxdmg: 10,
      itd: 1,
      mleech: 7,
      str: 10,
      dex: 10,
    },
  },

  Gleamscythe: {
    description:
      "Gleamscythe<br> Falchion<br> Base Speed Modifier: 20<br> Base Melee Range: 2 (was 0)<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 18 to 34, Avg 26<br> Required Strength: 33<br> Required Level: 13<br> +20% Increased Attack Speed<br> +100% Enhanced Damage<br> Adds 6-10 Cold Damage<br> +20 Defense<br> +30 to Mana<br> +3 to Light Radius<br>",
    properties: {
      speed: 20,
      onehandmin: 18,
      onehandmax: 34,
      reqstr: 33,
      reqlvl: 13,
      ias: 20,
      edmg: 100,
      colddmgmin: 6,
      colddmgmax: 10,
      todef: 20,
      tomana: 30,
      ligrad: 3,
    },
  },

  "Griswold's Edge": {
    description:
      "Griswold's Edge<br> Broad Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 15 to 30, Avg 22.5<br> Required Strength: 48<br> Required Level: 17<br> +30% Increased Attack Speed<br> +120% Enhanced Damage<br> +100 to Attack Rating<br> Adds 25-35 Fire Damage<br> +12 to Strength<br>",
    properties: {
      speed: 0,
      onehandmin: 15,
      onehandmax: 30,
      reqstr: 48,
      reqlvl: 17,
      ias: 30,
      edmg: 120,
      toatt: 100,
      firedmgmin: 25,
      firedmgmax: 35,
      str: 12,
    },
  },

  Hellplague: {
    description:
      "Hellplague<br> Long Sword<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> One-Hand Damage: 5 to 34, Avg 19.5<br> Required Strength: 55<br> Required Dexterity: 39<br> Required Level: 22<br> +2 to Fire Skills<br> +80% Enhanced Damage<br> Adds 25-75 Fire Damage<br> Adds 28-56 Poison Damage over 6 Seconds<br> 5% Mana Stolen per Hit<br> 5% Life Stolen per Hit<br>",
    properties: {
      speed: 0,
      onehandmin: 5,
      onehandmax: 34,
      reqstr: 55,
      reqdex: 39,
      reqlvl: 22,
      fireskills: 2,
      edmg: 80,
      firedmgmin: 25,
      firedmgmax: 75,
      poisondmg: (28, 56),
      poisontime: 6,
      mleech: 5,
      lleech: 5,
    },
  },

  "Culwen's Point": {
    description:
      "Culwen's Point<br> War Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 20 to 50, Avg 35<br> Required Strength: 71<br> Required Dexterity: 45<br> Required Level: 29<br> +1 to All Skills<br> +20% Increased Attack Speed<br> +20% Faster Hit Recovery<br> +150% Enhanced Damage<br> +120 to Attack Rating<br> Poison Length Reduced by 50%<br>",
    properties: {
      speed: 0,
      onehandmin: 20,
      onehandmax: 50,
      reqstr: 71,
      reqdex: 45,
      reqlvl: 29,
      allsk: 1,
      ias: 20,
      fhr: 20,
      edmg: 150,
      toatt: 120,
      plr: 50,
    },
  },

  Shadowfang: {
    description:
      "Shadowfang<br> Two-Handed Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 20 to 44, Avg 32<br> One-Hand Damage: 5 to 23, Avg 14<br> Required Strength: 35<br> Required Dexterity: 27<br> Required Level: 12<br> +20% Increased Attack Speed<br> +160% Enhanced Damage<br> Adds 10-30 Cold Damage<br> 9% Mana Stolen per Hit<br> 9% Life Stolen per Hit<br> Cold Resist +20%<br> -2 to Light Radius<br>",
    properties: {
      speed: 0,
      onehandmin: 20,
      onehandmax: 44,
      reqstr: 35,
      reqdex: 27,
      reqlvl: 12,
      ias: 20,
      edmg: 160,
      colddmgmin: 10,
      colddmgmax: 30,
      mleech: 9,
      lleech: 9,
      coldres: 20,
      ligrad: -2,
    },
  },

  Soulflay: {
    description:
      "Soulflay<br> Claymore<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 39 to 69, Avg 49<br> One-Hand Damage: 11 to 27, Avg 19<br> Required Strength: 47<br> Required Level: 19<br> +30% Increased Attack Speed<br> +130% Enhanced Damage<br> 10% Mana Stolen per Hit<br> 10% Life Stolen per Hit<br> All Resistances +15<br>",
    properties: {
      speed: 0,
      onehandmin: 39,
      onehandmax: 69,
      reqstr: 47,
      reqlvl: 19,
      ias: 30,
      edmg: 130,
      mleech: 10,
      lleech: 10,
      allres: 15,
    },
  },

  "Kinemil's Awl": {
    description:
      "Kinemil's Awl<br> Giant Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 26 to 60, Avg 43<br> One-Hand Damage: 6 to 32, Avg 19<br> Required Strength: 56<br> Required Dexterity: 34<br> Required Level: 23<br> +20% Increased Attack Speed<br> +100% Enhanced Damage<br> +150 to Attack Rating<br> Adds 16-40 Fire Damage<br> +6 to Holy Fire (Paladin Only)<br>",
    properties: {
      speed: 0,
      onehandmin: 26,
      onehandmax: 60,
      reqstr: 56,
      reqdex: 34,
      reqlvl: 23,
      ias: 20,
      edmg: 100,
      toatt: 150,
      firedmgmin: 16,
      firedmgmax: 40,
      holyfiresk: 6,
    },
  },

  Blacktongue: {
    description:
      "Blacktongue<br> Bastard Sword<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 36 to 50, Avg 43<br> One-Hand Damage: 12 to 34, Avg 23<br> Required Strength: 62<br> Required Level: 26<br> +30% Increased Attack Speed<br> +80% Enhanced Damage<br> +100 to Attack Rating<br> Adds 300-360 Poison Damage over 3 Seconds<br> Prevent Monster Heal<br> Poison Resist +50%<br>",
    properties: {
      speed: 0,
      onehandmin: 36,
      onehandmax: 50,
      reqstr: 62,
      reqlvl: 26,
      ias: 30,
      edmg: 80,
      toatt: 100,
      poisondmg: (300, 360),
      poisontime: 3,
      prevent: 1,
      poisres: 50,
    },
  },

  Ripsaw: {
    description:
      "Ripsaw<br> Flamberge<br> Base Speed Modifier: -10<br> Base Melee Range: 3<br> Two-Hand Damage: 33 to 82, Avg 57.5<br> One-Hand Damage: 23 to 35, Avg 29<br> Required Strength: 70<br> Required Dexterity: 49<br> Required Level: 26<br> +30% Increased Attack Speed<br> +160% Enhanced Damage<br> +15 to Maximum Damage<br> 6% Mana Stolen per Hit<br> 80% Chance of Open Wounds<br> +30 Open Wounds Damage per Second<br>",
    properties: {
      speed: 0,
      onehandmin: 33,
      onehandmax: 82,
      reqstr: 70,
      reqdex: 49,
      reqlvl: 26,
      ias: 30,
      edmg: 160,
      tomaxdmg: 15,
      mleech: 6,
      ow: 80,
      owdmg: 30,
    },
  },

  "The Patriarch": {
    description:
      "The Patriarch<br> Great Sword<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 105 to 176, Avg 140.5<br> One-Hand Damage: 50 to 84, Avg 67<br> Required Strength: 100<br> Required Dexterity: 60<br> Required Level: 29<br> -20% Increased Attack Speed<br> +290% Enhanced Damage<br> Hit Blinds Target<br> +10 to Strength<br> Physical Damage Taken Reduced by 5<br> Magic Damage Taken Reduced by 5<br> 100% Extra Gold from Monsters<br>",
    properties: {
      speed: 0,
      twohandmin: 105,
      twohandmax: 176,
      onehandmin: 50,
      onehandmax: 84,
      reqstr: 100,
      reqdex: 60,
      reqlvl: 29,
      ias: -20,
      edmg: 290,
      blind: 1,
      str: 10,
      pdr: 5,
      mdr: 5,
      goldfind: 100,
    },
  },

  Gull: {
    description:
      "Gull<br> Dagger<br> Base Speed Modifier: -20<br> Base Melee Range: 1<br> Base Maximum Sockets: 1 (2 for upgraded versions)<br> One-Hand Damage: 2 to 19, Avg 10.5<br> Required Level: 4<br> Adds 1-15 Damage<br> 20% Deadly Strike<br> -5 to Mana<br> 100% Better Chance of Getting Magic Items<br>",
    properties: {
      speed: -20,
      onehandmin: 2,
      onehandmax: 19,
      reqlvl: 4,
      tomindmg: 1,
      tomaxdmg: 15,
      deadly: 20,
      tomana: -5,
      magicfind: 100,
    },
  },

  "The Diggler": {
    description:
      "The Diggler<br> Dirk<br> Base Speed Modifier: 0<br> Base Melee Range: 1<br> Base Maximum Sockets: 1 (2 for upgraded versions)<br> One-Hand Damage: 5 to 17, Avg 1<br> Required Dexterity: 25<br> Required Level: 11<br> +30% Increased Attack Speed<br> +90% Enhanced Damage<br> Ignore Target's Defense<br> 20% Deadly Strike<br> +10 to Dexterity<br> Cold Resist +25%<br> Fire Resist +25%<br>",
    properties: {
      speed: 0,
      onehandmin: 5,
      onehandmax: 17,
      reqdex: 25,
      reqlvl: 11,
      ias: 30,
      edmg: 90,
      itd: 1,
      deadly: 20,
      dex: 10,
      coldres: 25,
      firres: 25,
    },
  },

  "The Jade Tan Do": {
    description:
      "The Jade Tan Do<br> Kris<br> Base Speed Modifier: -20<br> Base Melee Range: 1<br> One-Hand Damage: 2 to 11, Avg 6.5<br> Required Dexterity: 45<br> Required Level: 19<br> +2 to Poison Skills<br> +150 to Attack Rating<br> +90 Poison Damage over 2 Seconds<br> 20% Deadly Strike<br> +2 to Poison Strike (Necromancer Only)<br> +10% to Maximum Poison Resist<br> Poison Resist +75%<br> Cannot Be Frozen<br>",
    properties: {
      speed: -20,
      onehandmin: 2,
      onehandmax: 11,
      reqdex: 45,
      reqlvl: 19,
      poisonsk: 2,
      toatt: 150,
      poisondmg: 90,
      poisontime: 2,
      deadly: 20,
      poisonstrikesk: 2,
      maxpoisres: 10,
      poisres: 75,
      cbf: 1,
    },
  },

  "Spectral Shard": {
    description:
      "Spectral Shard<br> Blade<br> Base Speed Modifier: -10<br> Base Melee Range: 1<br> One-Hand Damage: 4 to 15, Avg 9.5<br> Required Strength: 35<br> Required Dexterity: 51<br> Required Level: 25<br> +50% Faster Cast Rate<br> +55 to Attack Rating<br> 20% Deadly Strike<br> +50 to Mana<br> All Resistances +20<br>",
    properties: {
      speed: -10,
      onehandmin: 4,
      onehandmax: 15,
      reqstr: 35,
      reqdex: 51,
      reqlvl: 25,
      fcr: 50,
      toatt: 55,
      deadly: 20,
      tomana: 50,
      allres: 20,
    },
  },

  "The Gidbinn": {
    description:
      "The Gidbinn<br>One-Hand Damage: 3 to 7, Avg 5<br>Speed Modifier: -20<br>Maximum Sockets: 0<br>Required Strength: 15<br>Required Dexterity: 25<br>Required Level: None<br>",
    properties: {
      onehandmin: 3,
      onehandmax: 7,
      speed: -20,
      reqstr: 15,
      reqdex: 25,
    },
  },

  "The Dragon Chang": {
    description:
      "The Dragon Chang<br> Spear<br> Base Speed Modifier: -10<br> Base Melee Range: 4<br> Two-Hand Damage: 13 to 15, Avg 14<br> Required Dexterity: 20<br> Required Level: 8<br> +10 to Minimum Damage<br> +35 to Attack Rating<br> +100% Damage to Undead<br> Adds 3-6 Fire Damage<br> +6 to Javelin and Spear Mastery (Amazon Only)<br> +2 to Light Radius<br>",
    properties: {
      speed: -10,
      twohandmin: 13,
      twohandmax: 15,
      reqdex: 20,
      reqlvl: 8,
      tomindmg: 10,
      toatt: 35,
      dmgtoun: 100,
      firedmgmin: 3,
      firedmgmax: 6,
      javelinandspearmasterysk: 6,
      ligrad: 2,
    },
  },

  Razortine: {
    description:
      "Razortine<br> Trident<br> Base Speed Modifier: 0<br> Base Melee Range: 4<br> Two-Hand Damage: 13 to 22, Avg 17.5<br> Required Strength: 38<br> Required Dexterity: 24<br> Required Level: 12<br> +30% Increased Attack Speed<br> +50% Enhanced Damage<br> -50% Target Defense<br> Slows Target by 25%<br> +15 to Strength<br> +8 to Dexterity<br>",
    properties: {
      speed: 0,
      twohandmin: 13,
      twohandmax: 22,
      reqstr: 38,
      reqdex: 24,
      reqlvl: 12,
      ias: 30,
      edmg: 50,
      targetdefpercent: -50,
      slow: 25,
      str: 15,
      dex: 8,
    },
  },

  Bloodthief: {
    description:
      "Bloodthief<br> Brandistock<br> Base Speed Modifier: -20<br> Base Melee Range: 4<br> Two-Hand Damage: 14 to 35, Avg 24.5<br> Required Strength: 40<br> Required Dexterity: 50<br> Required Level: 17<br> +110% Enhanced Damage<br> 12% Life Stolen per Hit<br> 35% Chance of Open Wounds<br> +10 Open Wounds Damage per Second<br> +10 to Strength<br> +26 to Life<br>",
    properties: {
      speed: -20,
      twohandmin: 14,
      twohandmax: 35,
      reqstr: 40,
      reqdex: 50,
      reqlvl: 17,
      edmg: 110,
      lleech: 12,
      ow: 35,
      owdmg: 10,
      tolife: 26,
    },
  },

  "Lance of Yaggai": {
    description:
      "Lance of Yaggai<br> Spetum<br> Base Speed Modifier: 0<br> Base Melee Range: 4<br> Two-Hand Damage: 9 to 16, Avg 12.5<br> Required Strength: 54<br> Required Dexterity: 35<br> Required Level: 22<br> +40% Increased Attack Speed<br> Adds 1-60 Lightning Damage<br> +2 to Charged Strike (Amazon Only)<br> +3 to Power Strike (Amazon Only)<br> All Resistances +15<br> Attacker Takes Damage of 24<br>",
    properties: {
      speed: 0,
      twohandmin: 9,
      twohandmax: 16,
      reqstr: 54,
      reqdex: 35,
      reqlvl: 22,
      ias: 40,
      lightdmgmin: 1,
      lightdmgmax: 60,
      chargedstrikesk: 2,
      powerstrikesk: 3,
      allres: 15,
      atdmg: 24,
    },
  },

  "The Tannr Gorerod": {
    description:
      "The Tannr Gorerod<br> Pike<br> Base Speed Modifier: 20<br> Base Melee Range: 4<br> Two-Hand Damage: 39 to 176, Avg 107.5<br> Required Strength: 60<br> Required Dexterity: 45<br> Required Level: 27<br> +180% Enhanced Damage<br> +160 to Attack Rating<br> Adds 23-54 Fire Damage<br> +30 to Life<br> +10% to Maximum Fire Resist<br> Fire Resist +15%<br> +3 to Light Radius<br>",
    properties: {
      speed: 20,
      twohandmin: 39,
      twohandmax: 176,
      reqstr: 60,
      reqdex: 45,
      reqlvl: 27,
      edmg: 180,
      toatt: 160,
      firedmgmin: 23,
      firedmgmax: 54,
      tolife: 30,
      maxfirres: 10,
      firres: 15,
      ligrad: 3,
    },
  },

  "Dimoak's Hew": {
    description:
      "Dimoak's Hew<br> Bardiche<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Base Maximum Sockets: 3 (4 for upgraded versions)<br> Two-Hand Damage: 2 to 54, Avg 28<br> Required Strength: 40<br> Required Level: 8<br> +40% Increased Attack Speed<br> +100% Enhanced Damage<br> -8 Defense<br> +15 to Dexterity<br>",
    properties: {
      speed: 10,
      twohandmin: 2,
      twohandmax: 54,
      reqstr: 40,
      reqlvl: 8,
      ias: 40,
      edmg: 100,
      todef: -8,
      dex: 15,
    },
  },

  Steelgoad: {
    description:
      "Steelgoad<br> Voulge<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 10 to 37, Avg 23.5<br> Required Strength: 50<br> Required Level: 14<br> +80% Enhanced Damage<br> +30 to Attack Rating<br> 50% Deadly Strike<br> Hit Causes Monster to Flee 10%<br> All Resistances +5<br> +40 Durability<br>",
    properties: {
      speed: 0,
      twohandmin: 10,
      twohandmax: 37,
      reqstr: 50,
      reqlvl: 14,
      edmg: 80,
      toatt: 30,
      deadly: 50,
      flee: 10,
      allres: 5,
      dur: 40,
    },
  },

  "Soul Harvest": {
    description:
      "Soul Harvest<br> Scythe<br> Base Speed Modifier: -10<br> Base Melee Range: 3<br> Two-Hand Damage: 14 to 36, Avg 25<br> Required Strength: 41<br> Required Dexterity: 41<br> Required Level: 19<br> +40% Faster Cast Rate<br> +80% Enhanced Damage<br> +45 to Attack Rating<br> +160 Poison Damage over 2 Seconds<br> 10% Mana Stolen per Hit<br> +6 to Dark Pact (Necromancer Only)<br> All Resistances +20<br>",
    properties: {
      speed: -10,
      twohandmin: 14,
      twohandmax: 36,
      reqstr: 41,
      reqdex: 41,
      reqlvl: 19,
      fcr: 40,
      edmg: 80,
      toatt: 45,
      poisondmg: 160,
      poisontime: 2,
      mleech: 10,
      darkpactsk: 6,
      allres: 20,
    },
  },

  "The Battlebranch": {
    description:
      "The Battlebranch<br> Poleaxe<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 41 to 89, Avg 65<br> Required Strength: 62<br> Required Level: 25<br> +30% Increased Attack Speed<br> +130% Enhanced Damage<br> +100 to Attack Rating<br> 7% Life Stolen per Hit<br> +10 to Dexterity<br>",
    properties: {
      speed: 10,
      twohandmin: 41,
      twohandmax: 89,
      reqstr: 62,
      reqlvl: 25,
      ias: 30,
      edmg: 130,
      toatt: 100,
      lleech: 7,
      dex: 10,
    },
  },

  Woestave: {
    description:
      "Woestave<br> Halberd<br> Base Speed Modifier: 0<br> Base Melee Range: 4<br> Two-Hand Damage: 21 to 38, Avg 29.5<br> Required Strength: 75<br> Required Dexterity: 47<br> Required Level: 28<br> +80% Enhanced Damage<br> 50% Chance of Open Wounds<br> +40 Open Wounds Damage per Second<br> Hit Blinds Target +3<br> Freezes Target<br> Slows Target by 20%<br> -50 to Monster Defense per Hit<br> -3 to Light Radius<br>",
    properties: {
      speed: 0,
      twohandmin: 21,
      twohandmax: 38,
      reqstr: 75,
      reqdex: 47,
      reqlvl: 28,
      edmg: 80,
      ow: 50,
      owdmg: 40,
      blinds: 3,
      freeze: 1,
      slow: -20,
      targetdef: -50,
      ligrad: -3,
    },
  },

  "The Grim Reaper": {
    description:
      "The Grim Reaper<br> War Scythe<br> Base Speed Modifier: -10<br> Base Melee Range: 4<br> Two-Hand Damage: 51 to 86, Avg 68.5<br> Required Strength: 80<br> Required Dexterity: 80<br> Required Level: 29<br> +20% Increased Attack Speed<br> +140% Enhanced Damage<br> +15 to Minimum Damage<br> 5% Mana Stolen per Hit<br> +20% to Poison Skill Damage<br> 75% Deadly Strike<br>",
    properties: {
      speed: -10,
      twohandmin: 51,
      twohandmax: 86,
      reqstr: 80,
      reqdex: 80,
      reqlvl: 29,
      ias: 20,
      edmg: 140,
      tomindmg: 15,
      mleech: 5,
      poisondamage: 20,
      deadly: 75,
    },
  },

  Pluckeye: {
    description:
      "Pluckeye<br> Short Bow<br> Base Speed Modifier: 5<br> Base Maximum Sockets: 3 (4 for ilvl 26+ upgraded versions)<br> Two-Hand Damage: 2 to 8, Avg 5<br> Required Dexterity: 15<br> Required Level: 7<br> +100% Enhanced Damage<br> +28 to Attack Rating<br> 3% Mana Stolen per Hit<br> +3 to Cold Arrow<br> +10 to Life<br> +2 to Mana after each Kill<br> +2 to Light Radius<br>",
    properties: {
      speed: 5,
      twohandminbow: 2,
      twohandmaxbow: 8,
      reqdex: 15,
      reqlvl: 7,
      edmg: 100,
      toatt: 28,
      mleech: 3,
      coldarrowosk: 3,
      tolife: 10,
      maek: 2,
      ligrad: 2,
    },
  },

  Witherstring: {
    description:
      "Witherstring<br> Hunter's Bow<br> Base Speed Modifier: -10<br> Two-Hand Damage: 6 to 15, Avg 10.5<br> Required Dexterity: 28<br> Required Level: 13<br> +30% Increased Attack Speed<br> Fires Magic Arrows (Level 6)<br> +50% Enhanced Damage<br> Adds 3-6 Damage<br> +50 to Attack Rating<br>",
    properties: {
      speed: -10,
      twohandminbow: 13,
      twohandmaxbow: 15,
      reqdex: 28,
      reqlvl: 13,
      ias: 30,
      firesmagicarrow: 1,
      edmg: 50,
      tomindmg: 3,
      tomaxdmg: 6,
      toatt: 50,
    },
  },

  "Raven Claw": {
    description:
      "Raven Claw<br> Long Bow<br> Base Speed Modifier: 0<br> Base Maximum Sockets: 5 for ilvl 41+ versions (6 for ilvl 41+ upgraded elite versions)<br> Two-Hand Damage: 8 to 17, Avg 12.5<br> Required Strength: 22<br> Required Dexterity: 19<br> Required Level: 15<br> Fires Explosive Arrows or Bolts (Level 3)<br> +70% Enhanced Damage<br> 50% Bonus to Attack Rating<br> +3 to Strength<br> +3 to Dexterity<br>",
    properties: {
      speed: 0,
      twohandminbow: 8,
      twohandmaxbow: 17,
      reqstr: 22,
      reqdex: 19,
      reqlvl: 15,
      firesexplosivearrow: 1,
      edmg: 70,
      toattpercent: 50,
      str: 3,
      dex: 3,
    },
  },

  "Rogue's Bow": {
    description:
      "Rogue's Bow<br> Composite Bow<br> Base Speed Modifier: -10<br> Two-Hand Damage: 11 to 19, Avg 15<br> Required Strength: 25<br> Required Dexterity: 35<br> Required Level: 20<br> +20% Increased Attack Speed<br> +120% Enhanced Damage<br> +60 to Attack Rating<br> +100% Damage to Undead<br> 30% Deadly Strike<br> +3 to Guided Arrow (Amazon Only)<br> All Resistances +10<br>",
    properties: {
      speed: -10,
      twohandminbow: 11,
      twohandmaxbow: 19,
      reqstr: 25,
      reqdex: 35,
      reqlvl: 20,
      ias: 20,
      edmg: 120,
      toatt: 60,
      dmgtoun: 100,
      deadly: 30,
      guidedarrowsk: 3,
      allres: 10,
    },
  },

  Stormstrike: {
    description:
      "Stormstrike<br> Short Battle Bow<br> Base Speed Modifier: 0<br> Two-Hand Damage: 15 to 31, Avg 23<br> Required Strength: 30<br> Required Dexterity: 40<br> Required Level: 25<br> +50% Chance to Pierce<br> +170% Enhanced Damage<br> +84 to Attack Rating<br> Adds 1-60 Lightning Damage<br> +8 to Strength<br> Lightning Resist +25%<br>",
    properties: {
      speed: 0,
      twohandminbow: 15,
      twohandmaxbow: 31,
      reqstr: 30,
      reqdex: 40,
      reqlvl: 25,
      pierce: 50,
      edmg: 170,
      toatt: 84,
      lightdmgmin: 1,
      lightdmgmax: 60,
      str: 8,
      ligres: 25,
    },
  },

  Wizendraw: {
    description:
      "Wizendraw<br> Long Battle Bow<br> Base Speed Modifier: 10<br> Two-Hand Damage: 12 to 32, Avg 22<br> Required Strength: 40<br> Required Dexterity: 50<br> Required Level: 26<br> +30% Increased Attack Speed<br> Fires Magic Arrows (Level 5)<br> +80% Enhanced Damage<br> +100 to Attack Rating<br> -35% to Enemy Cold Resistance<br> +15 to Energy<br> +30 to Mana<br> Cold Resist +26%<br>",
    properties: {
      speed: 10,
      twohandminbow: 12,
      twohandmaxbow: 32,
    },
  },

  Hellclap: {
    description:
      "Hellclap<br> Short War Bow<br> Base Speed Modifier: 0<br> Two-Hand Damage: 15 to 36, Avg 25.5<br> Required Strength: 35<br> Required Dexterity: 55<br> Required Level: 27<br> +3 to Fire Skills<br> +20% Increased Attack Speed<br> +20% Chance to Pierce<br> +160% Enhanced Damage<br> +75 to Attack Rating<br> Adds 15 to 50 Fire Damage<br> +12 to Dexterity<br> Fire Resist +40%<br>",
    properties: {
      speed: 0,
      twohandminbow: 15,
      twohandmaxbow: 36,
      reqstr: 35,
      reqdex: 55,
      reqlvl: 27,
      fireskills: 3,
      ias: 20,
      pierce: 20,
      edmg: 160,
      toatt: 75,
      firedmgmin: 15,
      firedmgmax: 50,
      dex: 12,
      firres: 40,
    },
  },

  Blastbark: {
    description:
      "Blastbark<br> Long War Bow<br> Base Speed Modifier: 10<br> Two-Hand Damage: 7 to 57, Avg 32<br> Required Strength: 50<br> Required Dexterity: 65<br> Required Level: 28<br> +2 to Amazon Skills<br> +20% Chance to Pierce<br> +150% Enhanced Damage<br> 3% Mana Stolen per Hit<br> +3 to Exploding Arrow<br> Knockback<br> +5 to Strength<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Skystrike: {
    description:
      "Skystrike<br> Edge Bow<br> Base Speed Modifier: 5<br> Base Maximum Sockets: 4 (was 3)<br> Two-Hand Damage: 24 to 75, Avg 49.5<br> Required Strength: 25<br> Required Dexterity: 43<br> Required Level: 28<br> 30% Chance to Cast Level 8 Meteor on Striking<br> +2 to Amazon Skills<br> +30% Increased Attack Speed<br> +200% Enhanced Damage<br> +100 to Attack Rating<br> Adds 1-250 Lightning Damage<br> +10 to Energy<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Riphook: {
    description:
      "Riphook<br> Razor Bow<br> Base Speed Modifier: -10<br> Two-Hand Damage: 39 to 104, Avg 71.5<br> Required Strength: 25<br> Required Dexterity: 62<br> Required Level: 31<br> +50% Increased Attack Speed<br> +260% Enhanced Damage<br> 10% Life Stolen per Hit<br> 30% Chance of Open Wounds<br> +50 Open Wounds Damage per Second<br> Slows Target by 10%<br> +35 to Mana<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  "Kuko Shakaku": {
    description:
      "Kuko Shakaku<br> Cedar Bow<br> Base Speed Modifier: 0<br> Base Maximum Sockets: 5 for ilvl 41+ versions (6 for ilvl 41+ upgraded versions)<br> Two-Hand Damage: 36 to 106, Avg 71<br> Required Strength: 53<br> Required Dexterity: 49<br> Required Level: 33<br> +3 to Bow and Crossbow Skills (Amazon Only)<br> Fires Explosive Arrows or Bolts (Level 7)<br> +50% Chance to Pierce<br> +180% Enhanced Damage<br> Adds 40-180 Fire Damage<br> +2 to Mana after each Kill<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Endlesshail: {
    description:
      "Endlesshail<br> Double Bow<br> Base Speed Modifier: -10<br> Two-Hand Damage: 44 to 112, Avg 78<br> Required Strength: 58<br> Required Dexterity: 73<br> Required Level: 36<br> 6% Chance to Cast Level 24 Blizzard on Striking<br> +220% Enhanced Damage<br> Adds 15-30 Cold Damage<br> +5 to Strafe<br> Cold Resist +35%<br> +40 to Mana<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  "Witchwild String": {
    description:
      "Witchwild String<br> Short Siege Bow<br> Base Speed Modifier: 0<br> Two-Hand Damage: 49 to 116, Avg 82.5<br> Required Strength: 65<br> Required Dexterity: 80<br> Required Level: 39<br> 14% Chance to Cast Level 31 Amplify Damage on Striking<br> Fires Magic Arrows (Level 20)<br> +190% Enhanced Damage<br> [0-49]% Deadly Strike (0.5% per Character Level)<br> All Resistances +40<br> Socketed [4]<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Cliffkiller: {
    description:
      "Cliffkiller<br> Large Siege Bow<br> Base Speed Modifier: 10<br> Two-Hand Damage: 52 to 214, Avg 133<br> Required Strength: 80<br> Required Dexterity: 95<br> Required Level: 41<br> +2 to Amazon Skills<br> +80% Increased Attack Speed<br> +30% Chance to Pierce<br> +230% Enhanced Damage<br> Adds 10 to 30 Damage<br> Knockback<br> +80 Defense vs. Missile<br> +50 to Life<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Magewrath: {
    description:
      "Magewrath<br> Rune Bow<br> Base Speed Modifier: 0<br> Two-Hand Damage: 83 to 192, Avg 137.5<br> Required Strength: 73<br> Required Dexterity: 103<br> Required Level: 43<br> +2 to Amazon Skills<br> +210% Enhanced Damage<br> Adds 25-50 Damage<br> +250 to Attack Rating<br> 15% Mana Stolen per Hit<br> +4 to Guided Arrow (Amazon Only)<br> +4 to Magic Arrow (Amazon Only)<br> Hit Blinds Target<br> +10 to Dexterity<br> Magic Damage Taken Reduced by 13<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  "Goldstrike Arch": {
    description:
      "Goldstrike Arch<br> Gothic Bow<br> Base Speed Modifier: 10<br> Two-Hand Damage: 28 to 220, Avg 124<br> Required Strength: 95<br> Required Dexterity: 118<br> Required Level: 46<br> 20% Chance to Cast Level 20 Fist of the Heavens on Striking<br> +50% Increased Attack Speed<br> +250% Enhanced Damage<br> 150% Bonus to Attack Rating<br> +300% Damage to Demons<br> +300% Damage to Undead<br> Replenish Life +24<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Eaglehorn: {
    description:
      "Eaglehorn<br> Crusader Bow<br> Base Speed Modifier: 10<br> Two-Hand Damage: 66 to 416, Avg 241<br> Required Strength: 97<br> Required Dexterity: 121<br> Required Level: 69<br> 12% Chance to Cast Level 30 Raven on Striking<br> +10 to Raven (only +3 to Raven if worn by Druid)<br> Your Ravens deal an additional 500 Cold Damage<br> +2 to Amazon Skills<br> +250% Enhanced Damage<br> +[2-198]% Enhanced Maximum Damage (+2% per Character Level)<br> Ignore Target's Defense<br> +[6-594] to Attack Rating (+6 per Character Level)<br> +100 to Dexterity<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Widowmaker: {
    description:
      "Widowmaker<br> Ward Bow<br> Base Speed Modifier: 0<br> Two-Hand Damage: 108 to 288, Avg 198<br> Required Strength: 72<br> Required Dexterity: 146<br> Required Level: 65<br> Fires Magic Arrows (Level 11)<br> +350% Enhanced Damage<br> Ignore Target's Defense<br> 33% Deadly Strike<br> +5 to Guided Arrow<br> +5 to Multiple Shot<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Windforce: {
    description:
      "Windforce<br> Hydra Bow<br> Base Speed Modifier: 10<br> Two-Hand Damage:  51 to 512, Avg 281.5<br> Required Strength: 134<br> Required Dexterity: 167<br> Required Level: 73<br> After<br> 12% Chance to Cast Level 35 Twister on Striking<br> +20% Increased Attack Speed<br> +325% Enhanced Damage<br> +[2-198] to Maximum Damage (+2 per Character Level)<br> 8% Mana Stolen per Hit<br> Knockback<br> +10 to Strength<br> +20 to Dexterity<br>",
    properties: {
      speed: 10,
      twohandminbow: 7,
      twohandmaxbow: 57,
      reqstr: 50,
      reqdex: 65,
      reqlvl: 28,
      amask: 2,
      pierce: 20,
      edmg: 150,
      mleech: 3,
      explodingarrowoskill: 3,
      knock: 1,
      str: 5,
    },
  },

  Leadcrow: {
    description:
      "Leadcrow<br> Light Crossbow<br> Base Speed Modifier: -10<br> Base Maximum Sockets: 3 (4 for ilvl 26+ upgraded versions)<br> Two-Hand Damage: 13 to 18, Avg 15.5<br> Required Strength: 21<br> Required Dexterity: 27<br> Required Level: 9<br> -10% to Enemy Physical Resistance<br> +20% Increased Attack Speed<br> +70% Enhanced Damage<br> +40 to Attack Rating<br> 25% Deadly Strike<br> +10 to Dexterity<br> +10 to Life<br> Poison Resist +30%<br>",
    properties: {
      speed: -10,
      twohandminbow: 13,
      twohandmaxbow: 18,
      reqstr: 21,
      reqdex: 27,
      reqlvl: 9,
      physpierce: 10,
      ias: 20,
      edmg: 70,
      toatt: 40,
      deadly: 25,
      dex: 10,
      tolife: 10,
      poisres: 30,
    },
  },

  Ichorsting: {
    description:
      "Ichorsting<br> Crossbow<br> Base Speed Modifier: 0<br> Two-Hand Damage: 19 to 34, Avg 26.5<br> Required Strength: 40<br> Required Dexterity: 33<br> Required Level: 18<br> -10% to Enemy Physical Resistance<br> +20% Increased Attack Speed<br> +50% Chance to Pierce<br> +80% Enhanced Damage<br> +50 to Attack Rating<br> +100 Poison Damage over 3 Seconds<br> +20 to Dexterity<br>",
    properties: {
      speed: 0,
      twohandminbow: 19,
      twohandmaxbow: 34,
      reqstr: 40,
      reqdex: 33,
      reqlvl: 18,
      physpierce: 10,
      ias: 20,
      pierce: 50,
      edmg: 80,
      toatt: 50,
      poisondmg: 100,
      poisontime: 3,
      dex: 20,
    },
  },

  Hellcast: {
    description:
      "Hellcast<br> Heavy Crossbow<br> Base Speed Modifier: 10<br> Two-Hand Damage: 36 to 59, Avg 47.5<br> Required Strength: 60<br> Required Dexterity: 40<br> Required Level: 27<br> -10% to Enemy Physical Resistance<br> +40% Increased Attack Speed<br> Fires Explosive Arrows or Bolts (Level 5)<br> +80% Enhanced Damage<br> +70 to Attack Rating<br> Adds 35-50 Fire Damage<br> +15% to Maximum Fire Resist<br> Fire Resist +15%<br>",
    properties: {
      speed: 10,
      twohandminbow: 36,
      twohandmaxbow: 59,
      reqstr: 60,
      reqdex: 40,
      reqlvl: 27,
      physpierce: 10,
      ias: 40,
      firesexplosivearrow: 1,
      edmg: 80,
      toatt: 70,
      firedmgmin: 35,
      firedmgmax: 50,
      maxfirres: 15,
      firres: 15,
    },
  },

  Doomslinger: {
    description:
      "Doomslinger<br> Repeating Crossbow<br> Base Speed Modifier: -40<br> Two-Hand Damage: 21 to 43, Avg 32<br> Required Strength: 40<br> Required Dexterity: 50<br> Required Level: 28<br> -10% to Enemy Physical Resistance<br> 45% Chance to Cast Level 12 Fire Ball on Striking<br> +2 to Amazon Skills<br> +30% Increased Attack Speed<br> +35% Chance to Pierce<br> +140% Enhanced Damage<br> +40 to Life<br>",
    properties: {
      speed: -40,
      twohandminbow: 21,
      twohandmaxbow: 43,
      reqstr: 40,
      reqdex: 50,
      reqlvl: 28,
      physpierce: 10,
      ctcfireball: (45, 12),
      amask: 2,
      ias: 30,
      pierce: 35,
      edmg: 140,
      tolife: 40,
    },
  },

  "Bane Ash": {
    description:
      "Bane Ash<br> Short Staff<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> Two-Hand Damage: 1 to 8, Avg 4.5<br> Required Level: 5<br> 20% Chance to Cast Level 8 Fire Bolt on Casting<br> +2 to Fire Skills<br> +20% Increased Attack Speed<br> +10% Faster Cast Rate<br> +60% Enhanced Damage<br> +3 to Fire Bolt (Sorceress Only)<br> +30 to Mana<br> Fire Resist +50%<br> +50% Damage to Undead<br>",
    properties: {
      speed: -10,
      twohandmin: 1,
      twohandmax: 8,
      reqlvl: 5,
      ctcfireboltcast: (20, 8),
      fireskills: 2,
      ias: 20,
      fcr: 10,
      edmg: 60,
      fireboltsk: 3,
      tomana: 30,
      firres: 50,
      dmgtoun: 50,
    },
  },

  "Serpent Lord": {
    description:
      "Serpent Lord<br> Long Staff<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 2 to 11, Avg 6-6.5<br> Required Level: 9<br> 30% Chance to Cast Level 15 Firestorm on Casting<br> 5% Chance to Cast Level 3 Cyclone Armor on Casting<br> +20% Faster Cast Rate<br> +40% Enhanced Damage<br> -50% Target Defense<br> +12 Poison Damage over 3 Seconds<br> 100% Mana Stolen per Hit<br> +10 to Mana<br> Poison Resist +50%<br> +50% Damage to Undead<br>",
    properties: {
      speed: 0,
      twohandmin: 2,
      twohandmax: 11,
      reqlvl: 9,
      ctcfirestormcast: (30, 15),
      ctccyclonearmorcast: (5, 3),
      fcr: 20,
      edmg: 40,
      targetdef: -50, //tu nevim
      poisdmg: 12,
      poisontime: 3,
      mleech: 100,
      tomana: 10,
      poisres: 50,
      dmgtoun: 50,
    },
  },

  "Spire of Lazarus": {
    description:
      "Spire of Lazarus<br> Gnarled Staff<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 4 to 12, Avg 8<br> Required Level: 18<br> 30% Chance to Cast Level 15 Static Field on Casting<br> +3 to All Skills<br> +40% Faster Cast Rate<br> Adds 1-280 Lightning Damage<br> +2 to Chain Lightning (Sorceress Only)<br> +2 to Lightning (Sorceress Only)<br> +15 to Energy<br> Regenerate Mana +45%<br> Lightning Resist +75%<br> Physical Damage Taken Reduced by 5<br> +50% Damage to Undead<br>",
    properties: {
      speed: 10,
      twohandmin: 4,
      twohandmax: 12,
      reqlvl: 18,
      ctcstaticfieldcast: (30, 15),
      allskills: 3,
      fcr: 40,
      lightdmgmin: 1,
      lightdmgmax: 280,
      chainlightningsk: 2,
      lightningsk: 2,
      enr: 15,
      regmana: 45,
      ligres: 75,
      pdr: 5,
      dmgtoun: 50,
    },
  },

  "The Salamander": {
    description:
      "The Salamander<br> Battle Staff<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 6 to 13, Avg 9.5<br> Required Level: 21<br> 20% Chance to Cast Level 14 Lesser Hydra on Casting<br> +3 to Fire Skills<br> +10% Faster Cast Rate<br> Adds 15-32 Fire Damage<br> +3 to Fire Wall (Sorceress Only)<br> +2 to Fire Ball (Sorceress Only)<br> +2 to Warmth (Sorceress Only)<br> Fire Resist +30%<br> +50% Damage to Undead<br>",
    properties: {
      speed: 0,
      twohandmin: 6,
      twohandmax: 13,
      reqlvl: 21,
      ctclesserhydracast: (20, 14),
      fireskills: 3,
      fcr: 10,
      firedmgmin: 15,
      firedmgmax: 32,
      firewallsk: 3,
      fireballsk: 2,
      warmthsk: 2,
      firres: 30,
      dmgtoun: 50,
    },
  },

  "The Iron Jang Bong": {
    description:
      "The Iron Jang Bong<br> War Staff<br> Base Speed Modifier: 20<br> Base Melee Range: 3<br> Two-Hand Damage: 25 to 56, Avg 40.5<br> Required Level: 28<br> 15% Chance to Cast Level 20 Nova on Casting<br> 15% Chance to Cast Level 24 Blaze on Casting<br> 15% Chance to Cast Level 24 Frost Nova on Casting<br> +2 to All Skills<br> +60% Faster Cast Rate<br> +100% Enhanced Damage<br> 50% Bonus to Attack Rating<br> +30 Defense<br> +50% Damage to Undead<br>",
    properties: {
      speed: 20,
      twohandmin: 25,
      twohandmax: 56,
      reqlvl: 28,
      ctcnovacast: (15, 20),
      ctcblazecast: (15, 24),
      ctcfrostnova: (15, 24),
      allskills: 2,
      fcr: 60,
      edmg: 100,
      toattpercent: 50,
      todef: 30,
      dmgtoun: 50,
    },
  },

  "Knell Striker": {
    description:
      "Knell Striker<br> Scepter<br> Base Damage: 6 to 11<br> Base Speed Modifier: 0<br> Base Maximum Sockets: 2<br> One-Hand Damage: 10 to 19, Avg 14.5<br> Required Strength: 25<br> Required Level: 5<br> +80% Enhanced Damage<br> +35 to Attack Rating<br> 25% Chance of Crushing Blow<br> +15 to Mana<br> Fire Resist +20%<br> Poison Resist +20%<br> +50% Damage to Undead<br>",
    properties: {
      speed: 0,
      onehandmin: 6,
      onehandmax: 11,
      reqstr: 25,
      reqlvl: 5,
      edmg: 80,
      toatt: 35,
      crushingblow: 25,
      tomana: 15,
      firres: 20,
      poisres: 20,
      dmgtoun: 50,
    },
  },

  "Rust Handle": {
    description:
      "Rusthandle<br> Grand Scepter<br> Base Damage: 8 to 18<br> Base Speed Modifier: 10<br> One-Hand Damage: 15 to 35, Avg 25<br> Required Strength: 37<br> Required Level: 18<br> +1 to Paladin Skills<br> +60% Enhanced Damage<br> Adds 3-7 Damage<br> +110% Damage to Undead<br> 8% Life Stolen per Hit<br> +3 to Vengeance (Paladin Only)<br> +3 to Thorns (Paladin Only)<br> Magic Damage Taken Reduced by 1<br>",
    properties: {
      speed: 10,
      onehandmin: 8,
      onehandmax: 18,
      reqstr: 37,
      reqlvl: 18,
      palask: 1,
      edmg: 60,
      tomindmg: 3,
      tomaxdmg: 7,
      dmgtoun: 110,
      lleech: 8,
      vengeancesk: 3,
      thornssk: 3,
      mdr: 1,
    },
  },

  Stormeye: {
    description:
      "Stormeye<br> War Scepter<br> Base Damage: 12 to 19<br> Base Speed Modifier: -10<br> Base Maximum Sockets: 3<br> One-Hand Damage: 26 to 41, Avg 33.5<br> Required Strength: 55<br> Required Level: 30<br> +120% Enhanced Damage<br> Adds 1-30 Lightning Damage<br> Adds 17-25 Cold Damage<br> +3 to Fist of the Heavens (Paladin Only)<br> +3 to Holy Shock (Paladin Only)<br> +5 to Resist Lightning (Paladin Only)<br> Replenish Life +10<br> +50% Damage to Undead<br>",
    properties: {
      speed: -10,
      onehandmin: 12,
      onehandmax: 19,
      reqstr: 55,
      reqlvl: 30,
      edmg: 120,
      lightdmgmin: 1,
      lightdmgmax: 30,
      colddmgmin: 17,
      colddmgmax: 25,
      fistoftheheavensk: 3,
      holyshocksk: 3,
      resistlightningsk: 5,
      repl: 10,
      dmgtoun: 50,
    },
  },

  "True Silver": {
    description:
      "True Silver<br>Maiden Javelin<br>Base Speed Modifier: -10<br>Throw Damage: 13 to 270, Avg 141.5<br>Melee Damage: 17 to 252, Avg 134.5<br>Required Strength: 33<br>Required Dexterity: 47<br>Required Level: 20<br>+40% Increased Attack Speed<br>+120% Enhanced Damage<br>+[2-222] to Maximum Damage (+2.25 per Character Level)<br>15% Chance of Crushing Blow<br>45% Better Chance of Getting Magic Items<br>",
    properties: {
      speed: -10,
      throwmin: 13,
      throwmax: 270,
      onehandmin: 17,
      onehandmax: 252,
      reqstr: 33,
      reqdex: 47,
      reqlvl: 20,
      ias: 40,
      edmg: 120,
      maxdmgperlvl: 2.25, //asi tu nevim jestli to jde
      cb: 15,
      magicfind: 45,
    },
  },

  "Mage Slayer": {
    description:
      "Mage Slayer<br>Quhab<br>Base Speed Modifier: 0<br>One-Hand Damage: 15 to 121, Avg 68<br>Required Strength: 57<br>Required Dexterity: 57<br>Required Level: 27<br>+20% Faster Hit Recovery<br>+[2-247]% Enhanced Maximum Damage (+2.5% per Character Level)<br>Adds 10-25 Damage<br>+2 to Dragon Flight (Assassin Only)<br>+15 to Strength<br>Physical Damage Taken Reduced by 15%<br>+6 to Light Radius<br>",
    properties: {
      speed: 0,
      onehandmin: 15,
      onehandmax: 121,
      reqstr: 57,
      reqdex: 57,
      reqlvl: 27,
      fhr: 20,
      edmg: 247,
      maxdmgperlvl: 2.5,
      tomindmg: 10,
      tomaxdmg: 25,
      dragonflightsk: 2,
      str: 15,
      pdr: 15,
      ligrad: 6,
    },
  },

  Tempest: {
    description:
      "Tempest<br>Glowing Orb<br>Base Speed Modifier: -10<br>One-Hand Damage: 8 to 21, Avg 14.5<br>Required Level: 25<br>Level 16 Energy Shield When Equipped*<br>8% Chance to Cast Level 12 Frost Nova when Struck<br>+2 to All Skills<br>+30% Faster Cast Rate<br>+145 to Mana<br>Increase Maximum Mana 20%<br>Regenerate Mana 30%<br>",
    properties: {
      speed: -10,
      onehandmin: 8,
      onehandmax: 21,
      reqlvl: 25,
      energyshield: 16,
      ctcfrostnovacast: (8, 12),
      allskills: 2,
      fcr: 30,
      mana: 145,
      maxmana: 20,
      regmana: 30,
    },
  },
  //shields/

  "Spraynard Trash Eth True Silver": {
    description: "Bad True Silver",
    properties: {
      speed: -10,
      onehandmin: 106,
      onehandmax: 210,
    },
  },

  "Pelta Lunata": {
    description:
      "Pelta Lunata<br> Buckler<br> Base Smite Damage: 1 to 3, Avg 2<br> Base Maximum Sockets: 1 (2 for upgraded elite versions)<br> Defense: 39<br> Block: 40% (Dru/Nec/Sor), 45% (Ama/Ass/Bar), 50% (Pal)<br> Required Strength: 12<br> Required Level: 2<br> +40% Faster Block Rate<br> 20% Increased Chance of Blocking<br> +40% Enhanced Defense<br> +30 Defense<br> +2 to Strength<br> +10 to Vitality<br> +10 to Energy<br> +12 Durability<br>",
    properties: {
      smitedmgmin: 1,
      smitedmgmax: 3,
      defense: 39,
      block1: 40,
      fbr: 40,
      block: 20,
      edef: 40,
      str: 2,
      vit: 10,
      enr: 10,
      dur: 12,
    },
  },

  "Umbral Disk": {
    description:
      "Umbral Disk<br> Small Shield<br> Base Smite Damage: 2 to 3, Avg 2.5<br> Defense: 46<br> Block: 55% (Dru/Nec/Sor), 60% (Ama/Ass/Bar), 65% (Pal)<br> Required Strength: 22<br> Required Level: 9<br> 30% Increased Chance of Blocking<br> Adds 4-8 Damage<br> Hit Blinds Target<br> +50% Enhanced Defense<br> +30 Defense<br> +10 to Dexterity<br> +20 to Life<br> +15 Durability<br>",
    properties: {
      smitedmgmin: 2,
      smitedmgmax: 3,
      defense: 46,
      block1: 55,
      block: 30,
      mindmg: 4,
      maxdmg: 8,
      blind: 1,
      edef: 50,
      dex: 10,
      tolife: 20,
      dur: 15, //nev im, jestli tohle je gg
    },
  },

  "Swordback Hold": {
    description:
      "Swordback Hold<br> Spiked Shield<br> Base Smite Damage: 9 to 16, Avg 12.5<br> Base Maximum Sockets: 2 (3 for upgraded elite versions)<br> Defense: 51<br> Block: 50% (Dru/Nec/Sor), 55% (Ama/Ass/Bar), 60% (Pal)<br> Required Strength: 30<br> Required Level: 15<br> 20% Increased Chance of Blocking<br> 50% Chance of Open Wounds<br> +8 Open Wounds Damage per Second<br> +60% Enhanced Defense<br> +10 Defense<br> Attacker Takes Damage of 32<br>",
    properties: {
      smitedmgmin: 9,
      smitedmgmax: 16,
      defense: 51,
      block1: 50,
      block: 20,
      openwounds: 50,
      owdmg: 8,
      edef: 60,
      thorns: 32,
    },
  },

  Steelclash: {
    description:
      "Steelclash<br> Kite Shield<br> Base Smite Damage: 4 to 11, Avg 7.5<br> Defense: 58<br> Block: 53% (Dru/Nec/Sor), 58% (Ama/Ass/Bar), 63% (Pal)<br> Required Strength: 47<br> Required Level: 17<br> +1 to All Skills<br> +20% Faster Block Rate<br> 25% Increased Chance of Blocking<br> +100% Enhanced Defense<br> +20 Defense<br> All Resistances +10<br> +3 to Light Radius<br> +20 Durability<br>",
    properties: {
      smitedmgmin: 4,
      smitedmgmax: 11,
    },
  },

  "Wall of the Eyeless": {
    description:
      "Wall of the Eyeless<br> Bone Shield<br> Base Smite Damage: 5 to 10, Avg 7.5<br> Base Maximum Sockets: 2 (3 for upgraded elite versions)<br> Defense: 53<br> Block: 40% (Dru/Nec/Sor), 45% (Ama/Ass/Bar), 50% (Pal)<br> Required Strength: 25<br> Required Level: 20<br> +20% Faster Cast Rate<br> 3% Mana Stolen per Hit<br> +40% Enhanced Defense<br> +10 Defense<br> Cold Resist +20%<br> Fire Resist +20%<br> Poison Resist +20%<br> +5 to Mana after each Kill<br>",
    properties: {
      smitedmgmin: 5,
      smitedmgmax: 10,
      defense: 53,
    },
  },

  "Bverrit Keep": {
    description:
      "Bverrit Keep<br> Tower Shield<br> Base Smite Damage: 5 to 23, Avg 14<br> Defense: 87<br> Block: 54% (Dru/Nec/Sor), 59% (Ama/Ass/Bar), 64% (Pal)<br> Required Strength: 75<br> Required Level: 19<br> 10% Increased Chance of Blocking<br> +120% Enhanced Defense<br> +30 Defense<br> +15 to Strength<br> Fire Resist +50%<br> Physical Damage Taken Reduced by 10%<br> Magic Damage Taken Reduced by 5<br> +100 Durability<br>",
    properties: {
      smitedmgmin: 2,
      smitedmgmax: 3,
      defense: 46,
      block1: 55,
    },
  },

  "The Ward": {
    description:
      "The Ward<br> Gothic Shield<br> Base Smite Damage: 4 to 11, Avg 7.5<br> Defense: 112<br> Block: 46% (Dru/Nec/Sor), 51% (Ama/Ass/Bar), 56% (Pal)<br> Required Strength: 60<br> Required Level: 26<br> 10% Increased Chance of Blocking<br> +100% Enhanced Defense<br> +40 Defense<br> +10 to Strength<br> All Resistances +50<br> Magic Damage Taken Reduced by 2<br>",
    properties: {
      smitedmgmin: 4,
      smitedmgmax: 11,
      defense: 112,
      block1: 46,
    },
  },

  Visceratuant: {
    description:
      "Visceratuant<br> Defender<br> Base Smite Damage: 10 to 15, Avg 12.5<br> Base Maximum Sockets: 1 (2 for upgraded versions)<br> Defense: 125<br> Block: 60% (Dru/Nec/Sor), 65% (Ama/Ass/Bar), 70% (Pal)<br> Required Strength: 38<br> Required Level: 28<br> +1 to Sorceress Skills<br> +30% Faster Block Rate<br> 30% Increased Chance of Blocking<br> +10% to Lightning Skill Damage<br> +150% Enhanced Defense<br> Attacker Takes Lightning Damage of 50<br>",
    properties: {
      smitedmgmin: 10,
      smitedmgmax: 15,
      defense: 125,
      block1: 60,
      fbr: 30,
      block: 30,
      lightskill: 10,
      edef: 150,
      atligdmg: 50, //who knows if these are correct
      allsk: 1,
      reqstr: 38,
      reqlvl: 28,
    },
  },

  "Some other claw": {
    description:
      "Some other clawcga<br> Smalls Shielgdsd<br>tady je to nejvic cool claw ever a taky jeste neco navic<br>",
    properties: {
      defense: 142,
    },
  },

  //gloovs//
  "The Hand of Broc": {
    description:
      "The Hand of Broc<br> Leather Gloves<br> Defense: 14<br> Required Level: 5<br> Melee Attacks Deal Splash Damage<br> +30% Enhanced Damage<br> 3% Mana Stolen per Hit<br> 3% Life Stolen per Hit<br> +20% Enhanced Defense<br> +10 Defense<br> +20 to Mana<br> Poison Resist +10%<br>",
    properties: {
      defense: 14,
      reqlvl: 5,
      splash: 1,
      edmg: 30,
      lleech: 3,
      mleech: 3,
      edef: 20,
      todef: 10,
      tomana: 20,
      poisres: 10,
    },
  },

  Bloodfist: {
    description:
      "Bloodfist<br> Heavy Gloves<br> Defense: 18<br> Required Level: 9<br> Melee Attacks Deal Splash Damage<br> +10% Increased Attack Speed<br> +30% Faster Hit Recovery<br> +10 to Maximum Damage<br> +20% Enhanced Defense<br> +10 Defense<br> +40 to Life<br>",
    properties: {
      defense: 18,
      reqlvl: 9,
      splash: 1,
      ias: 10,
      fhr: 30,
      tomaxdmg: 10,
      edef: 20,
      todef: 10,
      tolife: 40,
    },
  },

  "Chance Guards": {
    description:
      "Chance Guards<br> Chain Gloves<br> Defense: 28<br> Required Strength: 25<br> Required Level: 15<br> +25 to Attack Rating<br> +30% Enhanced Defense<br> +15 Defense<br> +2 to Mana after each Kill<br> 200% Extra Gold from Monsters<br> 40% Better Chance of Getting Magic Items<br> +2 to Light Radius<br>",
    properties: {
      defense: 28,
      reqstr: 25,
      reqlvl: 15,
      toatt: 25,
      edef: 30,
      todef: 15,
      maek: 2,
      goldfind: 200,
      magicfind: 40,
      ligrad: 2,
    },
  },

  Magefist: {
    description:
      "Magefist<br> Light Gauntlets<br> Defense: 25<br> Required Strength: 45<br> Required Level: 23<br> +1 to Fire Skills<br> +20% Faster Cast Rate<br> Adds 6-36 Fire Damage<br> +30% Enhanced Defense<br> +10 Defense<br> Regenerate Mana 25%<br>",
    properties: {
      defense: 25,
      reqstr: 45,
      reqlvl: 23,
      firesk: 1,
      fcr: 20,
      firedmgmin: 6,
      firedmgmax: 36,
      edef: 30,
      todef: 10,
      regmana: 25,
    },
  },

  Frostburn: {
    description:
      "Frostburn<br> Gauntlets<br> Defense: 62<br> Required Strength: 60<br> Required Level: 29<br> Adds 14-28 Fire Damage<br> Adds 6-22 Cold Damage<br> -10% to Enemy Fire Resistance<br> -10% to Enemy Cold Resistance<br> +40% Enhanced Defense<br> +40 Defense<br> Increase Maximum Mana 25%<br>",
    properties: {
      defense: 62,
      reqstr: 60,
      reqlvl: 29,
      firedmgmin: 14,
      firedmgmin: 28,
      colddmgmin: 6,
      colddmgmax: 22,
      firepierce: 10,
      coldpierce: 10,
      edef: 40,
      todef: 40,
      maxmana: 25,
    },
  },
  // blts

  Lenymo: {
    description:
      "<br>Lenymo<br> Sash<br> Defense: 2<br> Required Level: 7<br> +10% Faster Cast Rate<br> +15 to Mana<br> Regenerate Mana 30%<br> All Resistances +5<br> +1 to Light Radius",
    properties: {
      defense: 2,
      reqlvl: 7,
      fcr: 10,
      tomana: 15,
      regmana: 30,
      allres: 5,
      ligrad: 1,
    },
  },

  Snakecord: {
    description:
      "Snakecord<br> Light Belt<br> Defense: 15<br> Required Level: 12<br> +6% to Poison Skill Damage<br> +30% Enhanced Defense<br> +10 Defense<br> Replenish Life +15<br> Poison Resist +25%<br> Poison Length Reduced by 50%<br>",
    properties: {
      defense: 15,
      reqlvl: 12,
      poisondamage: 6,
      edef: 30,
      todef: 10,
      repl: 15,
      poisres: 25,
      plr: 50,
    },
  },

  Nightsmoke: {
    description:
      "Nightsmoke<br> Belt<br> Defense: 24<br> Required Strength: 25<br> Required Level: 20<br> +50% Enhanced Defense<br> +15 Defense<br> +20 to Mana<br> All Resistances +10<br> Physical Damage Taken Reduced by 2<br> 50% Damage Taken Gained as Mana when Hit<br>",
    properties: {
      defense: 24,
      reqstr: 25,
      reqlvl: 20,
      edef: 50,
      todef: 15,
      tomana: 20,
      allres: 10,
      pdr: 2,
      dmgtomana: 50,
    },
  },

  Goldwrap: {
    description:
      "Goldwrap<br> Heavy Belt<br> Defense: 36<br> Required Strength: 45<br> Required Level: 27<br> +20% Increased Attack Speed<br> +60% Enhanced Defense<br> +25 Defense<br> 80% Extra Gold from Monsters<br> 40% Better Chance of Getting Magic Items<br> +2 to Light Radius<br>",
    properties: {
      defense: 36,
      reqstr: 45,
      reqlvl: 27,
      ias: 20,
      edef: 60,
      todef: 25,
      goldfind: 80,
      magicfind: 40,
      ligrad: 2,
    },
  },

  Bladebuckle: {
    description:
      "Bladebuckle<br> Plated Belt<br> Defense: 54<br> Required Strength: 60<br> Required Level: 39<br> +30% Faster Hit Recovery<br> +100% Enhanced Defense<br> +30 Defense<br> +5 to Strength<br> +10 to Dexterity<br> Physical Damage Taken Reduced by 7<br> Attacker Takes Damage of 480<br>",
    properties: {
      defense: 54,
      reqstr: 60,
      reqlvl: 39,
      fhr: 30,
      edef: 100,
      todef: 30,
      str: 5,
      dex: 10,
      pdr: 7,
      atdmg: 480,
    },
  },

  "String of Ears": {
    description:
      "String of Ears<br> Demonhide Sash<br> Defense: 113<br> Required Strength: 20<br> Required Level: 29<br> 8% Life Stolen per Hit<br> +180% Enhanced Defense<br> +15 Defense<br> Physical Damage Taken Reduced by 15%<br> Magic Damage Taken Reduced by 15<br> +10 Durability<br>",
    properties: {
      defense: 113,
      reqstr: 20,
      reqlvl: 29,
      lleech: 8,
      edef: 180,
      todef: 15,
      physdr: 15,
      mdr: 15,
      dur: 10,
    },
  },

  //boots

  Hotspur: {
    description:
      "Hotspur<br> Boots<br> Base Kick Damage: 3 to 8, Avg 5.5<br> Defense: 10<br> Required Level: 5<br> Adds 3-6 Fire Damage<br> +20% Enhanced Defense<br> +6 Defense<br> +15 to Life<br> +6% to Maximum Fire Resist<br> Fire Resist +30%<br>",
    properties: {
      kickmin: 3,
      kickmax: 8,
      defense: 10,
      reqlvl: 5,
      firedmgmin: 3,
      firedmgmax: 6,
      edef: 20,
      todef: 6,
      tolife: 15,
      maxfirres: 6,
      firres: 30,
    },
  },

  Gorefoot: {
    description:
      "Gorefoot<br> Heavy Boots<br> Base Kick Damage: 4 to 12, Avg 8<br> Defense: 9<br> Required Strength: 18<br> Required Level: 12<br> +25% Faster Run/Walk<br> +30% Leap and Leap Attack Movement Speed<br> +2 to Leap (Barbarian Only)<br> 4% Mana Stolen per Hit<br> +30% Enhanced Defense<br>",
    properties: {
      defense: 9,
      kickmin: 4,
      kickmax: 12,
      reqstr: 18,
      reqlvl: 12,
      frw: 25,
      leapspeed: 30,
      leapsk: 2,
      mleech: 4,
      edef: 30,
    },
  },

  "Treads of Cthon": {
    description:
      "Treads of Cthon<br> Chain Boots<br> Base Kick Damage: 6 to 14, Avg 10 (was 6 to 12, Avg 9)<br> Defense: 26<br> Required Strength: 30<br> Required Level: 15<br> +30% Faster Run/Walk<br> +20% Chance to Pierce<br> +40% Enhanced Defense<br> +12 Defense<br> +50 Defense vs. Missile<br> +30 to Life<br> 50% Slower Stamina Drain<br>",
    properties: {
      kickmin: 6,
      kickmax: 14,
      defense: 26,
      reqstr: 30,
      reqlvl: 15,
      frw: 30,
      pierce: 20,
      edef: 40,
      todef: 12,
      tomissdef: 50,
      tolife: 30,
      stamdrain: 50,
    },
  },

  "Goblin Toe": {
    description:
      "Goblin Toe<br> Light Plated Boots<br> Base Kick Damage: 8 to 18, Avg 13<br> Defense: 34<br> Required Strength: 50<br> Required Level: 22<br> +20% Faster Run/Walk<br> +30% Enhanced Damage<br> 25% Chance of Crushing Blow<br> +60% Enhanced Defense<br> +15 Defense<br> Physical Damage Taken Reduced by 5<br> Magic Damage Taken Reduced by 5<br>",
    properties: {
      kickmin: 8,
      kickmax: 18,
      defense: 34,
      reqstr: 50,
      reqlvl: 22,
      frw: 20,
      edmg: 30,
      cb: 25,
      edef: 60,
      todef: 15,
      pdr: 5,
      mdr: 5,
    },
  },

  Tearhaunch: {
    description:
      "Tearhaunch<br> Greaves<br> Base Kick Damage: 10 to 20, Avg 15<br> Defense: 63<br> Required Strength: 70<br> Required Level: 29<br> +2 to Defensive Auras (Paladin Only)<br> +20% Faster Run/Walk<br> +2 to Vigor (Paladin Only)<br> +80% Enhanced Defense<br> +35 Defense<br> +10 to Strength<br> +10 to Dexterity<br> All Resistances +10<br>",
    properties: {
      kickmin: 10,
      kickmax: 20,
      defense: 63,
      reqstr: 70,
      reqlvl: 29,
      defensivetree: 2,
      frw: 20,
      vigorsk: 2,
      edef: 80,
      todef: 35,
      str: 10,
      dex: 10,
      allres: 10,
    },
  },

  Infernostride: {
    description:
      "Infernostride<br> Demonhide Boots<br> Base Kick Damage: 30 to 64, Avg 47<br> Defense: 105<br> Required Strength: 20<br> Required Level: 29<br> 18% Chance to Cast Level 16 Blaze when Struck<br> +30% Faster Run/Walk<br> Adds 24-66 Fire Damage<br> +150% Enhanced Defense<br> +15 Defense<br> +5% to Maximum Fire Resist<br> Fire Resist +30%<br> 70 Extra Gold from Monsters<br> +2 to Light Radius<br>",
    properties: {
      kickmin: 30,
      kickmax: 64,
      defense: 105,
      reqstr: 20,
      reqlvl: 29,
      blazectcstruck: (18, 16),
      frw: 30,
      firedmgmin: 24,
      firedmgmax: 66,
      edef: 150,
      todef: 15,
      maxfirres: 5,
      firres: 30,
      goldfind: 70,
      ligrad: 2,
    },
  },
  // rings

  Nagelring: {
    description:
      "Nagelring<br> Ring<br> Required Level: 7<br> +75 to Attack Rating<br> Magic Damage Taken Reduced by 3<br> +1 to Mana after each Kill<br> Attacker Takes Damage of 3<br> 40% Better Chance of Getting Magic Items<br>",
    properties: {
      reqlvl: 7,
      toatt: 75,
      mdr: 3,
      maek: 1,
      atdmg: 3,
      magicfind: 40,
    },
  },

  "Manald Heal": {
    description:
      "Manald Heal<br> Ring<br> Required Level: 15<br> 7% Mana Stolen per Hit<br> +20 to Life<br> Replenish Life +8<br> Regenerate Mana 20%<br>",
    properties: {
      reqlvl: 15,
      mleech: 7,
      tolife: 20,
      repl: 8,
      regmana: 20,
    },
  },

  "The Stone of Jordan": {
    description:
      "The Stone of Jordan<br> Ring<br> Required Level: 29<br> +1 to All Skills<br> Adds 1-120 Lightning Damage<br> +40 to Mana<br> Increase Maximum Mana 20%<br>",
    properties: {
      reqlvl: 29,
      allsk: 1,
      lightdmgmin: 1,
      lightdmgmax: 120,
      tomana: 40,
      maxmana: 20,
    },
  },

  "Dwarf Star": {
    description:
      "Dwarf Star<br> Ring<br> Required Level: 45<br> 5% Increased Chance of Blocking<br> +5 to Life<br> +50 Maximum Stamina<br> Fire Absorb 6%<br> Magic Damage Taken Reduced by 15<br> 100% Extra Gold from Monsters<br>",
    properties: {
      reqlvl: 45,
      block1: 5,
      tolife: 5,
      maxstamina: 50,
      fireabs: 6,
      mdr: 15,
      goldfind: 100,
    },
  },

  "Raven Frost": {
    description:
      "Raven Frost<br> Ring<br> Required Level: 45<br> +250 to Attack Rating<br> Adds 15-45 Cold Damage<br> +20 to Dexterity<br> +40 to Mana<br> Cold Absorb 5%<br> Cannot Be Frozen<br>",
    properties: {
      reqlvl: 45,
      toatt: 250,
      colddmgmin: 15,
      colddmgmax: 45,
      dex: 20,
      tomana: 40,
      coldabs: 5,
    },
  },

  "Bul-Kathos' Wedding Band": {
    description:
      "Bul-Kathos' Wedding Band<br> Ring<br> Required Level: 58<br> +1 to All Skills<br> 5% Life Stolen per Hit<br> +[0-49] to Life (+0.5 per Character Level)<br> +50 Maximum Stamina<br>",
    properties: {
      reqlvl: 58,
      allsk: 1,
      lleech: 5,
      tolifeperlevel: 0.5,
      maxstamina: 50,
    },
  },

  "Carrion Wind": {
    description:
      "Carrion Wind<br> Ring<br> Required Level: 60<br> 8% Chance to Cast Level 30 Twister on Striking<br> 6% Life Stolen per Hit<br> +160 Defense vs. Missile<br> Poison Resist +55%<br> Attacker Takes Damage of 300<br> Level 11 Poison Creeper (35 Charges)<br>",
    properties: {
      reqlvl: 60,
      twisterctcstruck: (8, 30),
      lleech: 6,
      defvsmiss: 160,
      poisres: 55,
      atdmg: 300, //poison creeper charged not implementd!
    },
  },

  "Nature's Peace": {
    description:
      "Nature's Peace<br> Ring<br> Required Level: 69<br> Prevent Monster Heal<br> Slain Monsters Rest in Peace<br> +3% to Maximum Poison Resist<br> +3% to Maximum Cold Resist<br> +3% to Maximum Lightning Resist<br> +3% to Maximum Fire Resist<br> Physical Damage Taken Reduced by 11<br> Level 5 Oak Sage (27 Charges)<br>",
    properties: {
      reqlvl: 69,
      monheal: 1,
      slainmonstersrip: 1,
      maxpoisonres: 3,
      maxcoldres: 3,
      maxlightres: 3,
      maxfireres: 3,
      pdr: 11,
      oaksagesk: 5, //charges not implemented
    },
  },

  "Wisp Projector": {
    description:
      "Wisp Projector<br> Ring<br> Required Level: 76<br> +1 to All Skills<br> Lightning Absorb 6%<br> 20% Better Chance of Getting Magic Items<br> Level 7 Spirit of Barbs (11 Charges)<br> Level 5 Heart of Wolverine (13 Charges)<br>",
    properties: {
      reqlvl: 76,
      allsk: 1,
      lightabs: 6,
      magicfind: 20,
      spiritofbarbssk: 7, //charges not implemented
      heartofwolverinesk: 5, //charges not implemented
    },
  },

  "Kadala's Heirloom": {
    description:
      "Kadala's Heirloom<br> Ring<br> Required Level: 75<br> +1 to Fire Skills<br> Cold Resist -20%<br> Fire Resist +40%<br> or<br> +1 to Cold Skills<br> Fire Resist -20%<br> Cold Resist +40%<br> or<br> +1 to Lightning Skills<br> Poison Resist -20%<br> Lightning Resist +40%<br> or<br> +1 to Poison Skills<br> Lightning Resist -20%<br> Poison Resist +40%<br> or<br> +1 to Magic Skills<br> All Resistances -5%<br> Magic Damage Taken Reduced by 10<br> or<br> +30% Enhanced Damage<br> All Resistances -5%<br> Physical Damage Taken Reduced by 10<br> 60% Extra Gold from Monsters<br> 25% Better Chance of Getting Magic Items<br> Reduces all Vendor Prices 10%<br>",
    properties: {
      reqlvl: 75,
      firesk: 1,
      coldres: -20,
      firres: 40,
      coldsk: 1,
      firres: -20,
      coldres: 40,
      lightningsk: 1,
      poisres: -20,
      lightres: 40,
      poisonsk: 1,
      lightres: -20,
      poisres: 40,
      magicsk: 1,
      allres: -5,
      mdr: 10,
      edmg: 30,
      allres: -5,
      pdr: 10,
      goldfind: 60,
      magicfind: 25,
      vendor: 10, //this ring not implemented, needd to come with 3 versions to fix
    },
  },
  //amulets

  "Nokozan Relic": {
    description:
      "Nokozan Relic<br> Amulet<br> Required Level: 10<br> +30% Faster Hit Recovery<br> Adds 6 to 12 Fire Damage<br> +8% to Maximum Fire Resist<br> Fire Resist +35%<br> +3 to Light Radius<br>",
    properties: {
      reqlvl: 10,
      fhr: 30,
      firedmgmin: 6,
      firedmgmax: 12,
      maxfirres: 8,
      firres: 35,
      ligrad: 3,
    },
  },

  "The Eye of Etlich": {
    description:
      "The Eye of Etlich<br> Amulet<br> Required Level: 15<br> +1 to All Skills<br> Adds 6 to 20 Cold Damage (Cold Duration: 10 Seconds)<br> 7% Life Stolen per Hit<br> +40 Defense vs. Missile<br> +5 to Light Radius<br>",
    properties: {
      reqlvl: 15,
      allsk: 1,
      coldmindmg: 6,
      coldmaxdmg: 20,
      lleech: 7,
      tomissdef: 40,
      ligrad: 5,
    },
  },

  "The Mahim-Oak Curio": {
    description:
      "The Mahim-Oak Curio<br> Amulet<br> Required Level: 25<br> +10% Faster Cast Rate<br> 50% Bonus to Attack Rating<br> +10% Enhanced Defense<br> +10 Defense<br> +10 to All Attributes<br> All Resistances +10<br>",
    properties: {
      reqlvl: 25,
      fcr: 10,
      attpercent: 50,
      edef: 10,
      todef: 10,
      allstats: 10,
      allres: 10,
    },
  },

  "Saracen's Chance": {
    description:
      "Saracen's Chance<br> Amulet<br> Required Level: 47<br> 10% Chance to Cast Level 12 Iron Maiden when Struck<br> +50% Enhanced Damage<br> +12 to All Attributes<br> Curse Resistance +10%<br> All Resistances +25<br>",
    properties: {
      reqlvl: 47,
      maidenctcstruck: (10, 12),
      edmg: 50,
      allstats: 12,
      curres: 10,
      allres: 25,
    },
  },

  "Crescent Moon": {
    description:
      "Crescent Moon<br> Amulet<br> Required Level: 50<br> +2 to Cold Skills<br> +10% Increased Attack Speed<br> +10% Faster Cast Rate<br> 8% Mana Stolen per Hit<br> 6% Life Stolen per Hit<br> +45 to Mana<br> Magic Damage Taken Reduced by 10<br>",
    properties: {
      reqlvl: 50,
      coldsk: 2,
      ias: 10,
      fcr: 10,
      mleech: 8,
      lleech: 6,
      tomana: 45,
      mdr: 10,
    },
  },

  "The Cat's Eye": {
    description:
      "The Cat's Eye<br> Amulet<br> Required Level: 50<br> +30% Faster Run/Walk<br> +30% Increased Attack Speed<br> +100 Defense<br> +100 Defense vs. Missile<br> +35 to Dexterity<br>",
    properties: {
      reqlvl: 50,
      frw: 30,
      ias: 30,
      todef: 100,
      tomissdef: 100,
      dex: 35,
    },
  },

  "Atma's Scarab": {
    description:
      "Atma's Scarab<br> Amulet<br> Required Level: 60<br> 8% Chance to Cast Level 15 Amplify Damage on Striking<br> 60% Bonus to Attack Rating<br> 10% Chance of Open Wounds<br> +300 Open Wounds Damage per Second<br> Poison Resist +60%<br> Attacker Takes Damage of 450<br> +3 to Light Radius<br>",
    properties: {
      reqlvl: 60,
      ampctc: (8, 16),
      toattpercent: 66,
      ow: 10,
      owdmg: 300,
      poisres: 60,
      atdmg: 450,
      ligrad: 3,
    },
  },

  "Highlord's Wrath": {
    description:
      "Highlord's Wrath<br> Amulet<br> Required Level: 65<br> +1 to All Skills<br> +20% Increased Attack Speed<br> Adds 1-300 Lightning Damage<br> [0-24]% Deadly Strike (0.25 per Character Level)<br> Lightning Resist +40%<br> Attacker Takes Lightning Damage of 150<br>",
    properties: {
      reqlvl: 65,
      allsk: 1,
      ias: 20,
      lightdmgmin: 1,
      lightdmgmax: 300,
      deadlyperlvl: 0.25,
      ligres: 40,
      atligdmg: 450,
    },
  },

  "The Rising Sun": {
    description:
      "The Rising Sun<br> Amulet<br> Required Level: 65<br> 4% Chance to Cast Level 23 Meteor when Struck<br> +2 to Fire Skills<br> Adds 124 to 248 Fire Damage<br> -8% to Enemy Fire Resistance<br> Replenish Life +10<br> +4 to Light Radius<br>",
    properties: {
      reqlvl: 65,
      meteorctcstruck: (4, 23),
      firesk: 2,
      firedmgmin: 124,
      firedmgmax: 248,
      firepierce: 8,
      repl: 10,
      ligrad: 4,
    },
  },

  "Seraph's Hymn": {
    description:
      "Seraph's Hymn<br> Amulet<br> Required Level: 65<br> +2 to All Skills<br> +2 to Defensive Auras (Paladin Only)<br> +80% Damage to Demons<br> +250 to Attack Rating against Demons<br> +80% Damage to Undead<br> +250 to Attack Rating against Undead<br> +2 to Light Radius<br>",
    properties: {
      reqlvl: 65,
      allsk: 2,
      defensivetree: 2,
      dmgtodem: 80,
      attodem: 250,
      dmgtoun: 80,
      attoun: 250,
      ligrad: 2,
    },
  },

  "Mara's Caleidoscope": {
    description:
      "Mara's Kaleidoscope<br> Amulet<br> Required Level: 67<br> +2 to All Skills<br> +8 to All Attributes<br> All Resistances +30<br>",
    properties: {
      reqlvl: 67,
      allsk: 2,
      allstats: 8,
      allres: 30,
    },
  },

  Metalgrid: {
    description:
      "Metalgrid<br> Amulet<br> Required Level: 81<br> +450 to Attack Rating<br> +350 Defense<br> All Resistances +35<br> Attacker Takes Damage of 1000<br> Level 12 Iron Maiden (20 Charges)<br> +25 to Iron Golem<br> +20 to Golem Mastery<br>",
    properties: {
      reqlvl: 81,
      toatt: 450,
      todef: 350,
      allres: 35,
      atdmg: 1000,
      maidencharges: (12, 20),
      irongolemoskill: 25,
      golemmasteryoskill: 20,
    },
  },

  "The Third Eye": {
    description:
      "The Third Eye<br> Amulet<br> Required Level: 90<br> 10% Chance to Cast Level 25 Bone Nova on Casting<br> +1 to All skills<br> +20% Faster Cast Rate<br> +30 to Energy<br> Cannot Be Frozen<br> -4 to Light Radius<br> Socketed (1)<br>",
    properties: {
      reqlvl: 90,
      bonenovacast: (10, 25),
      allsk: 1,
      fcr: 20,
      enr: 30,
      cbf: 1,
      ligrad: -4,
      sock: 1,
    },
  },

  "Amulet of the Viper": {
    description:
      "Amulet of the Viper<br> Required Level: None<br> +10 to Life<br> +10 to Mana<br> Poison Resist +25%<br>",
    properties: {
      tolife: 10,
      tomana: 10,
      poisres: 25,
    },
  },
};
