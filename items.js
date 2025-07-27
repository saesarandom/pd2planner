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
      edef: 0,
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
      "Duskeep<br>Full Helm<br>Defense: 60<br>Required Strength: 41<br>Required Level: 17<br>+15 to Maximum Damage<br>+50% Enhanced Defense<br>+20 Defense<br>All Resistances +15%<br>Physical Damage Taken Reduced by 7<br>+2 to Light Radius<br>",
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
      "Wormskull<br>Bone Helm<br>Base Maximum Sockets: 2 (3 for ilvl 41+ upgraded elite versions)<br>Defense: 36<br>Required Strength: 25<br>Required Level: 21<br>+1 to Poison and Bone Skills (Necromancer Only)<br>+1 to Necromancer Skill Levels<br> Adds 60-60 Poison Damage over 2 Seconds<br>5% Life Stolen per Hit<br>10 to Mana<br>Poison Resist +25%<br>",
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
      "Blackhorn's Face<br>Death Mask<br>Defense: 278<br>Required Strength: 55<br>Required Level: 41<br>Prevent Monster Heal<br>Slows Target by 20%<br> +220% Enhanced Defense<br>+5% to Maximum Lightning Resist<br>Lightning Resist +30%<br>+20 Lightning Absorb<br>Attacker Takes Lightning Damage of 325<br>",
    properties: {
      defense: 278,
      reqstr: 55,
      reqlvl: 41,
      edef: 220,
      maxlightres: 5,
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
      "Crown of Thieves<br>Grand Crown<br>Defense: 342<br>Required Strength: 103<br>Required Level: 49<br>10% Life Stolen per Hit<br>+200% Enhanced Defense<br>+25 to Dexterity<br>+50 to Life<br>Fire Resist +33%<br> 100% Extra Gold from Monsters<br> 65% Better Chance of Getting Magic Items<br>",
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
      reqstr: 50,
      reqlvl: 62,
      allsk: 2,
      allstats: 2,
      physdr: 5,
      magicfind: 50,
    },
  },

  "Steel Shade": {
    description:
      "Steel Shade<br>Armet<br>Defense: 345<br>Required Strength: 109<br>Required Level: 62<br>+2 to All Skills<br>+20% Faster Block Rate<br>20% Increased Chance of Blocking<br>8% Mana Stolen per Hit<br>+130% Enhanced Defense<br>Replenish Life +48<br>+6 Fire Absorb<br>80% Extra Gold from Monsters<br>",
    properties: {
      defense: 342,
      reqstr: 109,
      reqlvl: 62,
      lleech: 10,
      edef: 130,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      magicfind: 65,
    },
  },

  "Andariel's Visage": {
    description:
      "Andariel's Visage<br>Demonhead<br>Defense: 387<br>Required Strength: 102<br>Required Level: 83<br>15% Chance to Cast Level 30 Poison Nova when Struck<br>+2 to All Skills<br>+30% Increased Attack Speed<br>10% Life Stolen per Hit<br>+150% Enhanced Defense<br>+30 to Strength<br>+8% to Maximum Poison Resist<br>Fire Resist -20%<br>Poison Resist +70%<br>Level 3 Venom (20 Charges)<br>",
    properties: {
      defense: 342,
      reqstr: 102,
      reqlvl: 83,
      allsk: 2,
      poisonnovactc: 15 / 30,
      ias: 30,
      lleech: 10,
      edef: 150,
      str: 30,
      maxpoisonres: 8,
      firres: -20,
      poisres: 70,
      venomcharges: 3,
    },
  },

  "Giant Skull": {
    description:
      "Giant Skull<br>Bone Visage<br>Defense: 477<br>Required Strength: 106<br>Required Level: 65<br>+35% Chance to Pierce<br>+80% Enhanced Damage<br>25% Chance of Crushing Blow<br>Knockback<br>+320 Defense<br>+35 to Strength<br>",
    properties: {
      defense: 477,
      reqstr: 103,
      reqlvl: 49,
      lleech: 10,
      edmg: 200,
      dex: 25,
      tolife: 50,
      firres: 33,
      goldfind: 100,
      todef: 320,
    },
  },

  "Veil of Steel": {
    description:
      "Veil of Steel<br>Spired Helm<br>Defense: 652<br>Durability: 60<br>Required Strength: 192<br>Required Level: 73<br>+1 to All Skills<br>+80% Enhanced Damage<br>+220% Enhanced Defense<br>+140 Defense<br>+15 to Strength<br>+15 to Vitality<br>All Resistances +40<br>",
    properties: {
      defense: 652,
      reqstr: 192,
      reqlvl: 73,
      allsk: 1,
      edmg: 80,
      edef: 220,
      todef: 140,
      str: 15,
      vit: 15,
      allres: 40,
      dur: 20,
    },
  },

  "Nightwing's Veil": {
    description:
      "Nightwing's Veil<br>Spired Helm<br>Defense: 352<br>Required Strength: 96<br>Required Level: 67<br>+2 to All Skills<br>-10% to Enemy Cold Resistance<br>+15% to Cold Skill Damage<br>+120% Enhanced Defense<br>+20 to Dexterity<br>+9 Cold Absorb<br>Half Freeze Duration<br>Requirements -50%<br>",
    properties: {
      defense: 352,
      reqstr: 96,
      reqlvl: 67,
      allsk: 2,
      coldpierce: 10,
      coldsk: 15,
      edef: 120,
      dex: 20,
      coldabsorb: 9,
      freezedur: 0.5, //nevim tu
      req: -50,
    },
  },

  "Crown of Ages": {
    description:
      "Crown of Ages<br>Corona<br>Defense: 399<br>Required Strength: 174<br>Required Level: 82<br>Indestructible<br>+30% Faster Hit Recovery<br>50% Reduced Curse Duration<br>+50% Enhanced Defense<br>+150 Defense<br>All Resistances +30<br>Physical Damage Taken Reduced by 15%<br>Socketed [2-3]<br>",
    properties: {
      defense: 399,
      reqstr: 174,
      reqlvl: 82,
      indestructible: 1,
      fhr: 30,
      curselength: 50, //nevim
      edef: 50,
      todef: 150,
      allres: 30,
      physdr: 15,
      sock: 3,
    },
  },

  "Overlord's Helm": {
    description:
      "Overlord's Helm<br>Giant Conch<br>Defense: 834<br>Required Strength: 142<br>Required Level: 85<br>-10% to Enemy Physical Resistance<br>8% Life Stolen per Hit<br>+680 Defense<br>+30 to Strength<br>+15 to Dexterity<br>+15 to Vitality<br>-30 to Energy<br>Curse Resistance -30%<br>",
    properties: {
      defense: 834,
      reqstr: 142,
      reqlvl: 85,
      physpierce: 10,
      lleech: 8,
      todef: 680,
      str: 30,
      dex: 15,
      vit: 15,
      enr: -30,
      curseres: -30,
    },
  },

  "Kira's Guardian": {
    description:
      "Kira's Guardian<br>Tiara<br>Defense: 170<br>Required Level: 77<br>+20% Faster Hit Recovery<br>-15% to Enemy Cold Resistance<br>-15% to Enemy Lightning Resistance<br>-15% to Enemy Fire Resistance<br>+120 Defense<br>All Resistances +40<br>Cannot Be Frozen<br>",
    properties: {
      defense: 170,
      reqlvl: 77,
      fhr: 20,
      coldpierce: 15,
      lightpierce: 15,
      firepierce: 15,
      todef: 120,
      allres: 40,
      cbf: 1,
    },
  },

  "Griffon's Eye": {
    description:
      "Griffon's Eye<br>Diadem<br>Defense: 260<br>Required Level: 76<br>+1 to All Skills<br>+25% Faster Cast Rate<br>+15% to Lightning Skill Damage<br>-20% to Enemy Lightning Resistance<br>+200 Defense<br>",
    properties: {
      defense: 260,
      reqlvl: 76,
      allsk: 1,
      fcr: 25,
      lightskill: 15, //tu lightskilldmg nevim jak
      lightpierce: 20,
      todef: 200,
    },
  },

  "Cyclopean Roar": {
    description:
      "Cyclopean Roar<br>Jawbone Visor<br>(Barbarian Only)<br>Defense: 169<br>Required Strength: 58<br>Required Level: 28<br>8% Chance to Cast Level 6 Battle Cry on Striking<br>+3 to Warcries (Barbarian Only)<br>+20% Faster Run/Walk<br>+20% to Leap and Leap Attack Movement Speed<br>+145% Enhanced Defense<br>",
    properties: {
      defense: 169,
      reqstr: 58,
      reqlvl: 28,
      battlecryctc: (8 / 6),
      warcries: 3,
      frw: 20,
      // leapmov: 20,
      edef: 145,
    },
  },

  "Arreat's Face": {
    description:
      "Arreat's Face<br>Slayer Guard<br>Defense: 363<br>Required Strength: 118<br>Required Level: 42<br>(Barbarian Only)<br>+2 to Combat Skills (Barbarian Only)<br>+2 to Barbarian Skills<br>+30% Faster Hit Recovery<br>20% Bonus to Attack Rating<br>6% Life Stolen per Hit<br>+200% Enhanced Defense<br>+20 to Strength<br>+20 to Dexterity<br>All Resistances +20<br>",
    properties: {
      defense: 363,
      reqstr: 118,
      reqlvl: 42,
      lleech: 6,
      edef: 200,
      str: 20,
      dex: 20,
      allres: 20,
    },
  },

  Wolfhowl: {
    description:
      "Wolfhowl<br>Fury Visor<br>Defense: 377<br>Required Strength: 129<br>Required Level: 79<br>(Barbarian Only)<br>+3 to Warcries (Barbarian Only)<br>+6 to Feral Rage<br>+6 to Werewolf<br>+150% Enhanced Defense<br>+15 to Strength<br>+15 to Dexterity<br>+15 to Summon Dire Wolf<br>",
    properties: {
      defense: 377,
      reqstr: 129,
      reqlvl: 79,
      edef: 150,
      str: 15,
      dex: 15,
      warcries: 3,
      feralrageosk: 6,
      werewolfosk: 6,
      summondirewolfosk: 15,
    },
  },

  "Demonhorn's Edge": {
    description:
      "Demonhorn's Edge<br>Destroyer Helm<br>Defense: 408<br>Required Strength: 151<br>Required Level: 61<br>(Barbarian Only)<br>+3 to Warcries (Barbarian Only)<br>+3 to Masteries (Barbarian Only)<br>+3 to Combat Skills (Barbarian Only)<br>20% Chance of Open Wounds<br>+350 Open Wounds Damage per Second<br>+160% Enhanced Defense<br>Physical Damage Taken Reduced by 24<br>Attacker Takes Damage of 1050<br>",
    properties: {
      defense: 408,
      reqstr: 151,
      reqlvl: 61,
      openwounds: 20,
      owdmg: 350,
      edef: 160,
      pdr: 24,
      atdmg: 1050,
    },
  },

  "Halaberd's Reign": {
    description:
      "Halaberd's Reign<br>Conqueror Crown<br>Defense: 432<br>Required Strength: 174<br>Required Level: 77<br>(Barbarian Only)<br>+3 Masteries (Barbarian Only)<br>+2 to Barbarian Skills<br>+20% Faster Hit Recovery<br>+[4-445] to Attack Rating (+4.5 per Character Level)<br>+3 to Battle Orders (Barbarian Only)<br>+3 to Battle Cry (Barbarian Only)<br>+170% Enhanced Defense<br>Physical Damage Taken Reduced by 15%<br>",
    properties: {
      defense: 432,
      reqstr: 174,
      reqlvl: 77,
      masteries: 3,
      barsk: 2,
      fhr: 20,
      attperlevel: 4,
      battleorderssk: 3,
      battlecrysk: 3,
      edef: 170,
      physdr: 15,
    },
  },

  "Raekor's Virtue": {
    description:
      "Raekor's Virtue<br>Guardian Crown<br>Defense: 473<br>Required Strength: 196<br>Required Level: 78<br>Minimum Item Level: 87<br>(Barbarian Only)<br>You May Apply an Additional Curse<br>+2 to Barbarian Skills<br>8% Mana Stolen per Hit<br>+4 to Frenzy (Barbarian Only)<br>+4 to Double Swing (Barbarian Only)<br>+180% Enhanced Defense<br>+30 to Dexterity<br>Curse Resistance +20%<br>+4 to Light Radius<br>",
    properties: {
      defense: 473,
      reqstr: 196,
      reqlvl: 78,
      extracurse: 1,
      barsk: 2,
      mleech: 8,
      frenzysk: 4,
      doubleswingsk: 4,
      edef: 180,
      dex: 30,
      curseres: 20,
      ligrad: 4,
    },
  },

  Quetzalcoatl: {
    description:
      "Quetzalcoatl<br>Hawk Helm<br>Defense: 28<br>Required Strength: 20<br>Required Level: 29<br>(Druid Only)<br>+2 to Druid Skills<br>Gust's Cooldown is Reduced by 2 Seconds<br>+10% Faster Cast Rate<br>+80% Enhanced Defense<br>Cold Resist +25%<br>+4 Life after each Kill<br>Does not reduce Gust cooldown below 0.5 seconds<br>",
    properties: {
      defense: 28,
      reqstr: 20,
      reqlvl: 29,
      drusk: 2,
      gustcdr: 2,
      fcr: 10,
      edef: 80,
      coldres: 25,
      laek: 4,
    },
  },

  "Jalal's Mane": {
    description:
      "Jalal's Mane<br>Totemic Mask <br>Defense: 297<br>Required Strength: 65<br>Required Level: 42<br>(Druid Only)<br>+2 to Shape Shifting Skills (Druid Only)<br>+2 to Druid Skills<br>+30% Faster Hit Recovery<br>20% Bonus to Attack Rating<br>+200% Enhanced Defense<br>+20 to Strength<br>+20 to Energy<br>All Resistances +25<br>+5 to Mana after each Kill<br>",
    properties: {
      defense: 297,
      reqstr: 65,
      reqlvl: 42,
      shapeshift: 2,
      drusk: 2,
      fhr: 30,
      toattpercent: 20,
      edef: 200,
      str: 20,
      enr: 20,
      allres: 25,
      maek: 5,
    },
  },

  "Cerebus' Bite": {
    description:
      "Cerebus' Bite<br>Blood Spirit<br>Defense: 350<br>Required Strength: 86<br>Required Level: 63<br>(Druid Only)<br>+4 to Shape Shifting Skills (Druid Only)<br>120% Bonus to Attack Rating<br>33% Deadly Strike<br>33% Chance of Open Wounds<br>+360 Open Wounds Damage per Second<br>+2 to Feral Rage (Druid Only)<br>+2 to Hunger (Druid Only)<br>+140% Enhanced Defense<br>",
    properties: {
      defense: 350,
      reqstr: 86,
      reqlvl: 63,
      shapeshift: 4,
      toattpercent: 120,
      deadlystrike: 33,
      openwounds: 33,
      owdmg: 360,
      feralragesk: 2,
      hungersk: 2,
      edef: 140,
    },
  },

  Denmother: {
    description:
      "Denmother<br>Sun Spirit<br>Defense: 333<br>Required Strength: 95<br>Required Level: 58<br>(Druid Only)<br>+2 to Druid Skill Levels<br>You May Summon 2 Additional Grizzlies<br>You May No Longer Summon Wolves<br>+20% Faster Cast Rate<br>+3 to Summon Grizzly (Druid Only)<br>+3 to Maul (Druid Only)<br>+125% Enhanced Defense<br>Replenish Life +35<br>80% Extra Gold from Monsters<br>Socketed ([2-3])<br>",
    properties: {
      defense: 333,
      reqstr: 95,
      reqlvl: 58,
      drusk: 2,
      extragrizzly: 2,
      fcr: 20,
      sumongrizzlysk: 3,
      maulsk: 3,
      edef: 125,
      repl: 35,
      goldfind: 80,
      sock: 3,
    },
  },

  Ravenlore: {
    description:
      "Ravenlore<br>Sky Spirit<br>Defense: 390<br>Required Strength: 113<br>Required Level: 74<br>(Druid Only)<br>+3 to Elemental Skills (Druid Only)<br>+7 to Raven (Druid Only)<br>-20% to Enemy Fire Resistance<br>+150% Enhanced Defense<br>+30 to Energy<br>All Resistances +25<br>",
    properties: {
      defense: 390,
      reqstr: 113,
      reqlvl: 74,
      elemental: 3,
      ravensk: 7,
      firepierce: 20,
      edef: 150,
      enr: 30,
      allres: 25,
    },
  },

  "Spirit Keeper": {
    description:
      "Spirit Keeper<br>Earth Spirit<br>Defense: 443<br>Required Strength: 104<br>Required Level: 67<br>(Druid Only)<br>+2 to Druid Skills<br>+20% Faster Hit Recovery<br>+2 to Random Druid Skill* (Druid Only)<br>+190% Enhanced Defense<br>You May Now Summon 1 Additional Spirit<br>+8% to Maximum Poison Resist<br>Fire Resist +30%<br>+6 Lightning Absorb<br>Cold Absorb 5%<br>* Excludes Druid skills with new IDs (Gust)<br>",
    properties: {
      defense: 443,
      reqstr: 104,
      reqlvl: 67,
      drusk: 2,
      fhr: 20,
      randomdruidskill: 2,
      edef: 190,
      extraspirit: 1,
      maxpoisonres: 8,
      firres: 30,
      lightabsorb: 6,
      coldabsorbpercent: 5,
    },
  },

  "Ursa's Nightmare": {
    description:
      "Ursa's Nightmare<br>Dream Spirit<br>Base Durability: 20<br>Defense: 416<br>Required Strength: 118<br>Required Level: 66<br>(Druid Only)<br>You cannot life steal when above 60% maximum life<br>+[0-40]% Increased Splash Radius (based on missing life)<br>+3 to Shape Shifting Skills (Druid Only)<br>+40% Faster Hit Recovery<br>Prevent Monster Heal<br>+160% Enhanced Defense<br>Increase Maximum Life 35%<br>Drain Life -30<br>",
    properties: {
      defense: 416,
      reqstr: 118,
      reqlvl: 66,
      leechrestriction: 60,
      splashradius: 40,
      shapeshift: 3,
      fhr: 40,
      preventheal: 1,
      edef: 160,
      maxlife: 35,
      repl: -30,
    },
  },

  "Arcanna's Head": {
    description:
      "Arcanna's Head<br>Skull Cap<br>Defense: 11<br>Defense (2 Items): 11-308<br>Required Strength: 15<br>Required Level: 15<br>Replenish Life +14<br>+40 to Mana<br>Regenerate Mana 20%<br>Attacker Takes Damage of 12<br>+[3-297] Defense (+3 per Character Level) (2 Items)<br>Lightning Resist +25% (3 Items)<br>",
    properties: {
      defense: 11,
      reqstr: 15,
      reqlvl: 15,
      repl: 14,
      tomana: 40,
      regmana: 20,
      atdmg: 12,
    },
  },

  "Berserker's Headgear": {
    description:
      "Berserker's Headgear<br>Helm<br>Defense: 33<br>Required Strength: 26<br>Required Level: 3<br>+15 Defense<br>Fire Resist +25%<br>+[8-792] to Attack Rating (+8 per Character Level) (2 Items)<br>+1 to Barbarian Skills (Complete Set)<br>",
    properties: {
      defense: 33,
      reqstr: 26,
      reqlvl: 3,
      toattpercent: 15, //2 itemy atd
      firres: 25,
      attperlevel: 8,
      barsk: 1,
    },
  },

  "Infernal Cranium": {
    description:
      "Infernal Cranium<br>Cap<br>Defense: 5<br>Defense (2 Items): 7-401<br>Required Level: 3<br>All Resistances +10<br>20% Damage Taken Gained as Mana when Hit<br>+[4-396] Defense (+4 per Character Level) (2 Items)<br>",
    properties: {
      defense: 5,
      reqlvl: 3,
      allres: 10,
      dmgtomana: 20,
      todeflvl: 4, //2 itemy atd
    },
  },

  "Sigon's Visor": {
    description:
      "Sigon's Visor<br>Great Helm<br>Defense: 60<br>Required Strength: 63<br>Required Level: 6<br>+25 Defense<br>+30 to Mana<br>+[8-792] to Attack Rating (+8 per Character Level) (2 Items)<br>",
    properties: {
      defense: 60,
      reqstr: 63,
      reqlvl: 6,
      todef: 25,
      tomana: 30,
      toattpercent: 25, //2 itemy atd
    },
  },

  "Isenhart's Horns": {
    description:
      "Isenhart's Horns<br>Full Helm<br>Defense: 26<br>Required Strength: 41<br>Required Level: 8<br>+8 to Maximum Damage<br>+6 to Dexterity<br>Physical Damage Taken Reduced by 4<br>Lightning Resist +[1-99]% (+1% per Character Level) (3 Items)<br>",
    properties: {
      defense: 26,
      reqstr: 41,
      reqlvl: 8,
      maxdmg: 8,
      dex: 6,
      pdr: 4,
      ligresperlevel: 1, //3 itemy atd
    },
  },

  "Cathan's Visage": {
    description:
      "Cathan's Visage<br>Mask<br>Defense: 27<br>Defense (2 Items): 11-225<br>Required Strength: 23<br>Required Level: 11<br>5% Mana Stolen per Hit<br>+20 to Mana<br>Cold Resist +25%<br>+[2-198] Defense (+2 per Character Level) (2 Items)<br>",
    properties: {
      defense: 27,
      reqstr: 23,
      reqlvl: 11,
      mleech: 5,
      tomana: 20,
      coldres: 25,
    },
  },

  "Iratha's Coil": {
    description:
      "Iratha's Coil<br>Crown<br>Defense: 25-45<br>Defense (2 Items): 27-243<br>Required Strength: 55<br>Required Level: 15<br>Lightning Resist +30%<br>Fire Resist +30%<br>+[2-198] Defense (+2 per Character Level) (2 Items)<br>+1 to Amazon Skills (3 Items)<br>",
    properties: {
      defense: 25,
      reqstr: 55,
      reqlvl: 15,
      ligres: 30,
      firres: 30,
      todeflvl: 2, //2 itemy atd
      amask: 1, //3 itemy atd
    },
  },

  "Milabrega's Diadem": {
    description:
      "Milabrega's Diadem<br>Crown<br>Defense: 45<br>Required Strength: 55<br>Required Level: 17<br>Adds 25-35 Cold Damage<br>+15 to Life<br>+15 to Mana<br>Cold Resist +40% (2 Items)<br>",
    properties: {
      defense: 45,
      reqstr: 55,
      reqlvl: 17,
      coldmin: 25,
      coldmax: 35,
      tolife: 15,
      tomana: 15,
      coldres: 40, //2 itemy
    },
  },

  "Tancred's Skull": {
    description:
      "Tancred's Skull<br>Bone Helm<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 36<br>Required Strength: 25<br>Required Level: 20<br>+30% Enhanced Damage<br>+80 to Attack Rating<br>All Resistances +10 (2 Items)<br>",
    properties: {
      defense: 36,
      reqstr: 25,
      reqlvl: 20,
      edmg: 30,
      toatt: 80,
      allres: 10, //2 itemy
    },
  },

  "Cow King's Horns": {
    description:
      "Cow King's Horns<br>War Hat<br>Defense: 120-128<br>Required Strength: 20<br>Required Level: 25<br>+1 to All Skills<br>+75 Defense<br>Cannot Be Frozen<br>Attacker Takes Damage of 10<br>35% Damage Taken Gained as Mana when Hit<br>",
    properties: {
      defense: 120,
      reqstr: 20,
      reqlvl: 25,
      allsk: 1,
      todef: 75,
      cbf: 1,
      atdmg: 10,
      dmgtomana: 35,
    },
  },

  "Sander's Paragon": {
    description:
      "Sander's Paragon<br>Cap<br>Defense: 4-104<br>Required Level: 25<br>+[1-99] Defense (+1 per Character Level)<br>Attacker Takes Damage of 8<br>70% Better Chance of Getting Magic Items<br>",
    properties: {
      defense: 4,
      reqlvl: 25,
      todeflvl: 1, //2 itemy atd
      atdmg: 8,
      magicfind: 70,
    },
  },

  "Hwanin's Splendor": {
    description:
      "Hwanin's Splendor<br>Grand Crown<br>Defense: 285<br>Required Strength: 103<br>Required Level: 45<br>+350 to Attack Rating<br>+150% Enhanced Defense<br>Replenish Life +40<br>Cold Resist +37%<br>Magic Damage Taken Reduced by 10<br>",
    properties: {
      defense: 285,
      reqstr: 103,
      reqlvl: 45,
      toatt: 350,
      edef: 150,
      repl: 40,
      coldres: 37,
      mdr: 10,
    },
  },

  "Guillaume's Face": {
    description:
      "Guillaume's Face<br>Winged Helm<br>Defense: 217<br>Required Strength: 115<br>Required Level: 34<br>+30% Faster Hit Recovery<br>35% Chance of Crushing Blow<br>15% Deadly Strike<br>+120% Enhanced Defense<br>+15 to Strength<br>-20% Target Defense (3 Items)<br>",
    properties: {
      defense: 217,
      reqstr: 115,
      reqlvl: 34,
      fhr: 30,
      cb: 35,
      deadlystrike: 15,
      edef: 120,
      str: 15,
      targetdefpercent: -20, //3 itemy
    },
  },

  "Najs's Circlet": {
    description:
      "Naj's Circlet<br>Circlet<br>Base Maximum Sockets: 2 (3 for upgraded exceptional/elite versions)<br>Defense: 105<br>Required Level: 28<br>12% Chance to Cast Level 5 Chain Lightning when Struck<br>+20% Faster Cast Rate<br>Adds 25-35 Fire Damage<br>+75 Defense<br>+15 to Strength<br>+5 to Light Radius<br>+1 to All Skills (2 Items)<br>",
    properties: {
      defense: 105,
      reqlvl: 28,
      fcr: 20,
      firemin: 25,
      firemax: 35,
      todef: 75,
      str: 15,
      ligrad: 5,
      allsk: 1, //2 itemy
    },
  },

  "Sazabi's Mental Sheath": {
    description:
      "Sazabi's Mental Sheath<br>Basinet<br>Defense: 184<br>Required Strength: 82<br>Required Level: 43<br>+1 to All Skills<br>+100 Defense<br>Replenish Life +15<br>Lightning Resist +20%<br>Fire Resist +20%<br>",
    properties: {
      defense: 184,
      reqstr: 82,
      reqlvl: 43,
      allsk: 1,
      todef: 100,
      repl: 15,
      ligres: 20,
      firres: 20,
    },
  },

  "Ondal's Almighty": {
    description:
      "Ondal's Almighty<br>Spired Helm<br>Defense: 309<br>Required Strength: 164<br>Required Level: 69<br>10% Chance to Cast Level 13 Weaken on Striking<br>+2 to All Skills<br>+24% Faster Hit Recovery<br>+150 Defense<br>+15 to Strength<br>+20 to Dexterity<br>Requirements -15%<br>+20% Faster Cast Rate (2 Items)<br>",
    properties: {
      defense: 309,
      reqstr: 164,
      reqlvl: 69,
      weakenctc: 10, //bylo tu: 10, 13 ale nevim
      allsk: 2,
      fhr: 24,
      todef: 150,
      str: 15,
      dex: 20,
      req: -15,
      fcr: 20, //2 itemy
    },
  },

  "Aldur's Stony Gaze": {
    description:
      "Aldur's Stony Gaze<br>Hunter's Guise<br>Defense: 171<br>Required Strength: 56<br>Required Level: 36<br>(Druid Only)<br>+2 to Summoning Skills (Druid Only)<br>+2 to Druid Skills<br>+25% Faster Hit Recovery<br>+90 Defense<br>Regenerate Mana 17%<br>Cold Resist +50%<br>+5 to Light Radius<br>+15 to Energy (2 Items)<br>+15 to Energy (3 Items)<br>+15 to Energy (Complete Set)<br>",
    properties: {
      defense: 171,
      reqstr: 56,
      reqlvl: 36,
      summoning: 2,
      drusk: 2,
      fhr: 25,
      todef: 90,
      regmana: 17,
      coldres: 50,
      ligrad: 5,
      enr: 15, //2 itemy
    },
  },

  "Griswold's Valor": {
    description:
      "Griswold's Valor<br>Corona<br>Defense: 290<br>Required Strength: 105<br>Required Level: 69<br>+75% Enhanced Defense<br>All Resistances +25<br>+[0-24] Absorbs Cold Damage (0.25 per Character Level)<br>50% Better Chance of Getting Magic Items<br>Requirements -40%<br>Socketed [2-3]<br>+2 to Offensive Auras (Paladin Only) (2 Items)<br>",
    properties: {
      defense: 290,
      reqstr: 105,
      reqlvl: 69,
      edef: 75,
      allres: 25,
      coldabsorb: 24,
      magicfind: 50,
      req: -40,
      sock: 3,
      offensiveaurasskills: 2, //2 itemy
    },
  },

  "Immortal King's Will": {
    description:
      "Immortal King's Will<br>Avenger Guard<br>Defense: 175<br>Required Strength: 65<br>Required Level: 47<br>(Barbarian Only)<br>+2 to Warcries (Barbarian Only)<br>+125 Defense<br>67% Extra Gold from Monsters<br>40% Better Chance of Getting Magic Items<br>+4 to Light Radius<br>Socketed (2)<br>Physical Damage Taken Reduced by 8% (3 Items)<br>",
    properties: {
      defense: 175,
      reqstr: 65,
      reqlvl: 47,
      warcries: 2,
      todef: 125,
      goldfind: 67,
      magicfind: 40,
      ligrad: 4,
      sock: 2, //2 itemy
    },
  },

  "M'avina's True Sight": {
    description:
      "M'avina's True Sight<br>Diadem<br>Defense: 210<br>Required Level: 64<br>+30% Increased Attack Speed<br>+150 Defense<br>Replenish Life +15<br>+45 to Mana<br>+1 to All Skills (2 Items)<br>50% Bonus to Attack Rating (3 Items)<br>All Resistances +25 (4 Items)<br>+5% to Fire Skill Damage (Complete Set)<br>",
    properties: {
      defense: 210,
      reqlvl: 64,
      ias: 30,
      todef: 150,
      repl: 15,
      tomana: 45,
      allsk: 1,
      toattpercent: 50,
      allres: 25,
    },
  },

  "Natalya's Totem": {
    description:
      "Natalya's Totem<br>Grim Helm<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 300<br>Required Strength: 58<br>Required Level: 59<br>+175 Defense<br>+20 to Strength<br>+30 to Dexterity<br>All Resistances +20<br>Magic Damage Taken Reduced by 6<br>",
    properties: {
      defense: 300,
      reqstr: 58,
      reqlvl: 59,
      todef: 175,
      str: 20,
      dex: 30,
      allres: 20,
      mdr: 6,
    },
  },

  "Tal Rasha's Horadric Crest": {
    description:
      "Tal Rasha's Horadric Crest<br>Death Mask<br>Defense: 131<br>Required Strength: 55<br>Required Level: 66<br>10% Mana Stolen per Hit<br>10% Life Stolen per Hit<br>+45 Defense<br>+65 to Life<br>+35 to Mana<br>All Resistances +20<br>",
    properties: {
      defense: 131,
      reqstr: 55,
      reqlvl: 66,
      lleech: 10,
      mleech: 10,
      todef: 45,
      tolife: 65,
      tomana: 35,
      allres: 20,
    },
  },

  "Trang-Oul's Guise": {
    description:
      "Trang-Oul's Guise<br>Bone Visage<br>Defense: 257<br>Required Strength: 106<br>Required Level: 65<br>+25% Faster Hit Recovery<br>+100 Defense<br>Replenish Life +30<br>+150 to Mana<br>Attacker Takes Damage of 620<br>",
    properties: {
      defense: 257,
      reqstr: 106,
      reqlvl: 65,
      fhr: 25,
      todef: 100,
      repl: 30,
      tomana: 150,
      atdmg: 620,
    },
  },

  // UNIQUE ARMORS //

  Greyform: {
    description:
      "Greyform<br>Quilted Armor<br>Base Maximum Sockets: 2 (3)<br>Defense: 31<br>Required Strength: 12<br>Required Level: 7<br>5% Life Stolen per Hit<br>+20 Defense<br>+10 to Dexterity<br>Cold Resist +20%<br>Fire Resist +20%<br>Magic Damage Taken Reduced by 3<br>",
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
      "Blinkbat's Form<br>Leather Armor<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 42<br>Required Strength: 15<br>Required Level: 12<br>+20% Faster Run/Walk<br>+40% Faster Hit Recovery<br>Adds 10-15 Fire Damage<br>+25 Defense<br>+50 Defense vs. Missile<br>",
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
      "The Centurion<br>Hard Leather Armor<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 55<br>Required Strength: 20<br>Required Level: 14<br>20% Increased Chance of Blocking<br>+30% Enhanced Damage<br>+50 to Attack Rating<br>+30 Defense<br>+15 to Life<br>Replenish Life +15<br>+15 to Mana<br>Physical Damage Taken Reduced by 2<br>",
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
      "Twitchthroe<br>Studded Leather<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 62<br>Required Strength: 27<br>Required Level: 16<br>+40% Increased Attack Speed<br>+20% Faster Hit Recovery<br>25% Increased Chance of Blocking<br>+25 Defense<br>+10 to Strength<br>+10 to Dexterity<br>",
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
      "Darkglow<br>Ring Mail<br>Defense: 104<br>Required Strength: 36<br>Required Level: 14<br>+120 to Attack Rating<br>+100% Enhanced Defense<br>+50 Defense vs. Missile<br>+5% to Maximum Poison Resist<br>+5% to Maximum Cold Resist<br>+5% to Maximum Lightning Resist<br>+5% to Maximum Fire Resist<br>All Resistances +15<br>+3 to Light Radius<br>",
    properties: {
      defense: 104,
      reqstr: 36,
      reqlvl: 14,
      toatt: 120,
      edef: 100,
      todefmiss: 50,
      maxpoisonres: 5,
      maxcoldres: 5,
      maxlightres: 5,
      maxfirres: 5,
      allres: 15,
      tolightrad: 3,
    },
  },

  Hawkmail: {
    description:
      "Hawkmail<br>Scale Mail<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 128<br>Required Strength: 44<br>Required Level: 15<br>+25% Faster Run/Walk<br>+3 to Raven<br>+100% Enhanced Defense<br>+5% to Maximum Cold Resist<br>Cold Resist +30%<br>Cannot Be Frozen<br>",
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
      "Sparking Mail<br>Chain Mail<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 133<br>Required Strength: 48<br>Required Level: 17<br>Adds 1-45 Lightning Damage<br>+10% to Lightning Skill Damage<br>+85% Enhanced Defense<br>Lightning Resist +30%<br>Attacker Takes Lightning Damage of 28<br>",
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
      "Venom Ward<br>Breast Plate<br>Defense: 118<br>Required Strength: 30<br>Required Level: 20<br>-12% to Enemy Poison Resistance<br>+100% Enhanced Defense<br>+8% to Maximum Poison Resist<br>Poison Resist +60%<br>Poison Length Reduced by 50%<br>+2 to Light Radius<br>",
    properties: {
      defense: 118,
      reqstr: 30,
      reqlvl: 20,
      poisonpierce: 12,
      edef: 100,
      maxpoisonres: 8,
      poisres: 60,
      plr: 50,
      lightrad: 2,
    },
  },

  Iceblink: {
    description:
      "Iceblink<br>Splint Mail<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 153<br>Required Strength: 51<br>Required Level: 22<br>+2 to Cold Skills<br>Freezes Target<br>+80% Enhanced Defense<br>Cold Resist +35%<br>Magic Damage Taken Reduced by 6<br>+4 to Light Radius<br>",
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
      "Boneflesh<br>Plate Mail<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 239<br>Required Strength: 65<br>Required Level: 26<br>10% Chance to Cast Level 15 Bone Armor when Struck<br>+235 to Attack Rating<br>5% Life Stolen per Hit<br>25% Chance of Open Wounds<br>+32 Open Wounds Damage per Second<br>+120% Enhanced Defense<br>",
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
      "Rockfleece<br>Field Plate<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 236<br>Required Strength: 50<br>Required Level: 28<br>+130% Enhanced Defense<br>+15 to Strength<br>Physical Damage Taken Reduced by 15%<br>Physical Damage Taken Reduced by 10<br>Requirements -10%<br>",
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
      "Rattlecage<br>Gothic Plate<br>Defense: 328<br>Required Strength: 70<br>Required Level: 29<br>+90% Enhanced Damage<br>+145 to Attack Rating<br>25% Chance of Crushing Blow<br>Hit Causes Monster to Flee 10%??? <br>+200 Defense<br>",
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
      "Heavenly Garb<br>Light Plate<br>Defense: 200<br>Required Strength: 41<br>Required Level: 29<br>Level 4 Sanctuary Aura when Equipped<br>+1 to Magic Skills<br>+50% Damage to Undead<br>+100 to Attack Rating against Undead<br>+100% Enhanced Defense<br>+15 to Energy<br>Regenerate Mana 25%<br>All Resistances +20<br>",
    properties: {
      defense: 200,
      reqstr: 41,
      reqlvl: 29,
      sancaura: 4,
      magicsk: 1,
      dmgtoun: 50,
      atttoun: 100,
      edef: 100,
      enr: 15,
      regmana: 25,
      allres: 20,
    },
  },

  Goldskin: {
    description:
      "Goldskin<br>Full Plate Mail<br>Defense: 377<br>Required Strength: 80<br>Required Level: 28<br>+150% Enhanced Defense<br>All Resistances +35<br>Attacker Takes Damage of 10<br>200% Extra Gold from Monsters<br>+2 to Light Radius<br>",
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
      "Silks of the Victor<br>Ancient Armor<br>Defense: 409<br>Required Strength: 100<br>Required Level: 28<br>+1 to All Skills<br>+25% Faster Run/Walk<br>5% Mana Stolen per Hit<br>+120% Enhanced Defense<br>+4 Life after each Kill<br>+2 to Light Radius<br>",
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
      "Spirit Shroud<br>Ghost Armor<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 282<br>Required Strength: 38<br>Required Level: 28<br>+1 to All Skills<br>+30% Faster Cast Rate<br>+150% Enhanced Defense<br>Replenish Life +20<br>Curse Resistance +10%<br>Magic Damage Taken Reduced by 11<br>Cannot Be Frozen<br>",
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

  "Skin of the Vipermagi": {
    description:
      "Skin of the Vipermagi<br>Serpentskin Armor<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 270<br>Required Strength: 43<br>Required Level: 29<br>+1 to All Skills<br>+30% Faster Cast Rate<br>+120% Enhanced Defense<br>All Resistances +30<br>Magic Damaged Taken Reduced by 8<br>",
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

  "Skin of the Flayed One": {
    description:
      "Skin of the Flayed One<br>Demonhide Armor<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 391<br>Required Strength: 50<br>Required Level: 31<br>Adds 80-135 Fire Damage<br>7% Life Stolen per Hit<br>+190% Enhanced Defense<br>Replenish Life +25<br>Fire Resist +45%<br>Repairs 1 Durability in 4 Seconds<br>",
    properties: {
      defense: 391,
      reqstr: 50,
      reqlvl: 31,
      firedmgmin: 80,
      firedmgmax: 135,
      lleech: 7,
      edef: 190,
      repl: 25,
      firres: 45,
      repdur: 1,
    },
  },

  "Iron Pelt": {
    description:
      "Iron Pelt<br>Trellised Armor<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 611<br>Required Strength: 61<br>Required Level: 33<br>20% Increased Chance of Blocking<br>+100% Enhanced Defense<br>+[3-297] Defense (+3 per Character Level)<br>+100 to Life<br>Physical Damage Taken Reduced by 20<br>Magic Damage Taken Reduced by 16<br>",
    properties: {
      defense: 611,
      reqstr: 61,
      reqlvl: 33,
      block: 20,
      edef: 100,
      todeflvl: 3,
      tolife: 100,
      pdr: 20,
      mdr: 16,
    },
  },

  "Spirit Forge": {
    description:
      "Spirit Forge<br>Linked Mail<br>Defense: 470<br>Required Strength: 74<br>Required Level: 35<br>+2 to Fire Skills<br>Adds 20-65 Fire Damage<br>+160% Enhanced Defense<br>+15 to Strength<br>+[1-123] to Life (+1.25 per Character Level)<br>Fire Resist +30%<br>+4 to Light Radius<br>Socketed (2)<br",
    properties: {
      defense: 470,
      reqstr: 74,
      reqlvl: 35,
      fireskills: 2,
      firedmgmin: 20,
      firedmgmax: 65,
      edef: 160,
      str: 15,
      tolifeperlevel: 1.25,
      firres: 30,
      ligrad: 4,
    },
  },

  "Crow Caw": {
    description:
      "Crow Caw<br>Tigulated Mail<br>Defense: 568<br>Required Strength: 86<br>Required Level: 37<br>+20% Increased Attack Speed<br>+30% Chance to Pierce<br>+80% Enhanced Damage<br>35% Chance of Open Wounds<br>+70 Open Wounds Damage per Second<br>+180% Enhanced Defense<br>+30 to Dexterity<br>",
    properties: {
      defense: 568,
      reqstr: 86,
      reqlvl: 37,
      ias: 20,
      pierce: 30,
      edmg: 80,
      ow: 35,
      owdmg: 70,
      edef: 180,
      dex: 30,
    },
  },

  Shaftstop: {
    description:
      "Shaftstop<br>Mesh Armor<br>Defense: 694<br>Required Strength: 92<br>Required Level: 38<br>+220% Enhanced Defense<br>+250 Defense vs. Missile<br>+140 to Life<br>Physical Damage Taken Reduced by 30%<br>",
    properties: {
      defense: 694,
      reqstr: 92,
      reqlvl: 38,
      edef: 220,
      todefmiss: 250,
      tolife: 140,
      physdr: 30,
    },
  },

  "Duriel's Shell": {
    description:
      "Duriel's Shell<br>Cuirass<br>Defense: 654<br>Durability: 150<br>Required Strength: 65<br>Required Level: 41<br>+200% Enhanced Defense<br>+[1-123] Defense (+1.25 per Character Level)<br>+15 to Strength<br>+[1-149] to Life (+[1.0-1.5] per Character Level)<br>Cold Resist +50%<br>Lightning Resist +20%<br>Fire Resist +20%<br>Poison Resist +20%<br>Cannot Be Frozen<br>",
    properties: {
      defense: 654,
      reqstr: 65,
      reqlvl: 41,
      edef: 200,
      todeflvl: 1.25,
      str: 15,
      tolifeperlevel: 1.25,
      coldres: 50,
      ligres: 20,
      firres: 20,
      poisres: 20,
      cbf: 1,
    },
  },

  "Skullder's Ire": {
    description:
      "Skullder's Ire<br>Russet Armor<br>Defense: 702<br>Durability: 90<br>Required Strength: 97<br>Required Level: 42<br>+1 to All Skills<br>+200% Enhanced Defense<br>Magic Damage Taken Reduced by [10-15]<br>[1-148]% Better Chance of Getting Magic Items ([1-1.5]% per Character Level)<br>Repairs 1 Durability in 5 Seconds<br>",
    properties: {
      defense: 702,
      reqstr: 97,
      reqlvl: 42,
      allsk: 1,
      edef: 200,
      mdr: 10,
      mflvl: 1.5,
      repdur: 1,
    },
  },

  "Guardian Angel": {
    description:
      "Guardian Angel<br>Templar Coat<br>Defense: 837<br>Required Strength: 118<br>Required Level: 45<br>+1 to All Skills<br>+30% Faster Block Rate<br>20% Increased Chance of Blocking<br>+[14-1386] to Attack Rating against Demons (+14 per Character Level)<br>+200% Enhanced Defense<br>+6% to Maximum Poison Resist<br>+6% to Maximum Cold Resist<br>+6% to Maximum Lightning Resist<br>+6% to Maximum Fire Resist<br>+4 to Light Radius<br>",
    properties: {
      defense: 837,
      reqstr: 118,
      reqlvl: 45,
      allsk: 1,
      fbr: 30,
      block: 20,
      toattund: 14,
      edef: 200,
      maxpoisonres: 6,
      maxcoldres: 6,
      maxlightres: 6,
      maxfirres: 6,
      ligrad: 4,
    },
  },

  Toothrow: {
    description:
      "Toothrow<br>Sharktooth Armor<br>Defense: 879<br>Durability: 63<br>Required Strength: 103<br>Required Level: 48<br>25% Deadly Strike<br>40% Chance of Open Wounds<br>+350 Open Wounds Damage per Second<br>+220% Enhanced Defense<br>+60 Defense<br>+10 to Strength<br>Fire Resist +15%<br>",
    properties: {
      defense: 879,
      reqstr: 103,
      reqlvl: 48,
      deadly: 25,
      ow: 40,
      owdmg: 350,
      edef: 220,
      todef: 60,
      str: 10,
    },
  },

  "Atma's Wail": {
    description:
      "Atma's Wail<br>Embossed Plate<br>Defense: 991<br>Durability: 105<br>Required Strength: 125<br>Required Level: 41<br>+1 to All Skills<br>+20% Faster Cast Rate<br>+20% Faster Hit Recovery<br>+160% Enhanced Defense<br>+[2-198] Defense (+2 per Character Level)<br>+15 to Dexterity<br>Replenish Life +20<br>Increase Maximum Mana 30%<br>25% Better Chance of Getting Magic Items<br>",
    properties: {
      defense: 991,
      reqstr: 125,
      reqlvl: 41,
      allsk: 1,
      fcr: 20,
      fhr: 20,
      edef: 160,
      todeflvl: 2,
      dex: 15,
      repl: 20,
      maxmana: 30,
      magicfind: 25,
    },
  },

  "Que-Hegan's Wisdom": {
    description:
      "Que-Hegan's Wisdom<br>Mage Plate<br>Defense: 488<br>Required Strength: 55<br>Required Level: 51<br>+1 to All Skills<br>+20% Faster Cast Rate<br>+20% Faster Hit Recovery<br>+160% Enhanced Defense<br>+30 to Energy<br>Magic Damage Taken Reduced by 10<br>+5 to Mana after each Kill<br>",
    properties: {
      defense: 488,
      reqstr: 55,
      reqlvl: 51,
      allsk: 1,
      fcr: 20,
      fhr: 20,
      edef: 160,
      enr: 30,
      mdr: 10,
      maek: 5,
    },
  },

  "Black Hades": {
    description:
      "Black Hades<br>Chaos Armor<br>Defense: 1023<br>Required Strength: 140<br>Required Level: 53<br>+225% Damage to Demons<br>+450 to Attack Rating against Demons<br>+200% Enhanced Defense<br>Half Freeze Duration<br>-2 to Light Radius<br>Socketed [3-4]<br>",
    properties: {
      defense: 1023,
      reqstr: 140,
      reqlvl: 53,
      dmgtodemons: 225,
      attodem: 450,
      edef: 200,
      halffreeze: 1,
      lightrad: -2,
      sock: 3,
    },
  },

  Corpsemourn: {
    description:
      "Corpsemourn<br>Ornate Plate<br>Defense: 1246<br>Required Strength: 145<br>Required Level: 55<br>Adds 160-340 Fire Damage<br>+180% Enhanced Defense<br>+8 to Strength<br>+10 to Vitality<br>Cold Resist +35%<br>+40 to Corpse Explosion<br>5% Reanimate As: Returned<br>Requirements -15%<br>",
    properties: {
      defense: 1246,
      reqstr: 145,
      reqlvl: 55,
      firedmgmin: 160,
      firedmgmax: 340,
      edef: 180,
      str: 8,
      vit: 10,
      coldres: 35,
      corpseexplosionsk: 40,
      reanimate: 5, //Returned
      req: -15,
    },
  },

  "Arctic Furs": {
    description:
      "Arctic Furs<br>Quilted Armor<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 51<br>Defense (2 Items): 48-348<br>Required Strength: 12<br>Required Level: 2<br>+325% Enhanced Defense<br>All Resistances +10<br>+[3-297] Defense (+3 per Character Level) (2 Items)<br>Cold Resist +15% (3 Items)<br>",
    properties: {
      defense: 51,
      reqstr: 12,
      reqlvl: 2,
      edef: 325,
      allres: 10,
      todef: 3, //per level tu chyba!!
      coldres: 15,
    },
  },

  "Berserker's Hauberk": {
    description:
      "Berserker's Hauberk<br>Splint Mail<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 84<br>Defense (2 Items): 85-529<br>Required Strength: 51<br>Required Level: 3<br>+1 to Barbarian Skills<br>Magic Damage Taken Reduced by 2<br>+[4-445] Defense (+4.5 per Character Level) (2 Items)<br>+[3-297]% Enhanced Maximum Damage (+3% per Character Level) (Complete Set)<br>",
    properties: {
      defense: 84,
      reqstr: 51,
      reqlvl: 3,
      barsk: 1,
      mdr: 2,
      todef: 4.5, //per level¨
      maxdmg: 3, //per level¨
    },
  },

  "Sigon's Shelter": {
    description:
      "Sigon's Shelter<br>Gothic Plate<br>Defense: 161<br>Required Strength: 70<br>Required Level: 6<br>+25% Enhanced Defense<br>Lightning Resist +30%<br>Attacker Takes Damage of 20 (2 Items)<br>",
    properties: {
      defense: 161,
      reqstr: 70,
      reqlvl: 6,
      edef: 25,
      ligres: 30,
    },
  },

  "Isenhart's Case": {
    description:
      "Isenhart's Case<br>Breast Plate<br>Defense: 98<br>Defense (2 Items): 98-296 (was 107-306)<br>Required Strength: 30<br>Required Level: 8<br>+40 Defense<br>Magic Damage Taken Reduced by 4<br>+[2-198] Defense (+2 per Character Level) (2 Items)<br>Cold Resist +[1-99]% (+1% per Character Level) (3 Items)<br>",
    properties: {
      defense: 98,
      reqstr: 30,
      reqlvl: 8,
      todef: 2, //per level
      coldres: 1, //per level
    },
  },

  "Cathan's Mesh": {
    description:
      "Cathan's Mesh<br>Chain Mail<br>Base Maximum Sockets: 2 (3 for upgraded versions)<br>Defense: 86<br>Required Strength: 24<br>Required Level: 11<br>+20% Faster Run/Walk<br>+15 Defense<br>Requirements -50%<br>Attacker Takes Damage of [1-99] (1 per Character Level) (2 Items)<br>Fire Resist +30% (3 Items)<br>",
    properties: {
      defense: 86,
      reqstr: 24,
      reqlvl: 11,
      frw: 20,
      todef: 15,
      req: -50,
      atdmg: 1, //per level
      firres: 30,
    },
  },

  "Angelic Mantle": {
    description:
      "Angelic Mantle<br>Ring Mail<br>Defense: 72<br>Defense (2 Items): 222<br>Required Strength: 36<br>Required Level: 12<br>+[50-80]% Damage to Undead<br>+40% Enhanced Defense<br>Physical Damage Taken Reduced by 3<br>+150 Defense (2 Items)<br>Fire Resist +50% (3 Items)<br>",
    properties: {
      defense: 72,
      reqstr: 36,
      reqlvl: 12,
      dmgtoundead: 50,
      edef: 40,
      pdr: 3,
      todef: 150,
      firres: 50,
    },
  },

  "Vidala's Ambush": {
    description:
      "Vidala's Ambush<br>Leather Armor<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 67<br>Defense (3 Items): 67-314<br>Required Strength: 15<br>Required Level: 14<br>+50 Defense<br>+[15-25] to Dexterity<br>Fire Resist +24% (2 Items)<br>+[2-247] Defense (+2.5 per Character Level) (3 Items)<br>",
    properties: {
      defense: 67,
      reqstr: 15,
      reqlvl: 14,
      todef: 50,
      dex: 15,
      firres: 24,
      todeflvl: 2.5, //per level
    },
  },

  "Arcanna's Flesh": {
    description:
      "Arcanna's Flesh<br>Light Plate<br>Defense: 99<br>Defense (2 Items): 199<br>Required Strength: 41<br>Required Level: 15<br>+10% Faster Cast Rate<br>Physical Damage Taken Reduced by 6<br>+2 to Light Radius<br>+100 Defense (2 Items)<br>+20 to Energy (3 Items)<br>Regenerate Mana 20% (Complete Set)<br>",
    properties: {
      defense: 99,
      reqstr: 41,
      reqlvl: 15,
      fcr: 10,
      pdr: 6,
      ligrad: 2,
      todef: 100,
      enr: 20,
      regmana: 20, //fullset
    },
  },

  "Milabrega's Robe": {
    description:
      "Milabrega's Robe<br>Ancient Armor<br>Defense: 186<br>Defense (2 Items): 372 (was 468)<br>Required Strength: 100<br>Required Level: 17<br>Adds 25-35 Cold Damage<br>Physical Damage Taken Reduced by 2<br>Attacker Takes Damage of 13<br>+100% Enhanced Defense<br>14% Chance to Cast Level 5 Frost Nova on Striking (2 Items)<br>",
    properties: {
      defense: 99,
      reqstr: 41,
      reqlvl: 15,
      fcr: 10,
      pdr: 6,
      ligrad: 2,
      todef: 100,
      enr: 20,
      regmana: 20, //fullset
    },
  },

  "Tancred's Spine": {
    description:
      "Tancred's Spine<br>Full Plate Mail<br>Defense: 150<br>Defense (2 Items): 151-744<br>Required Strength: 80<br>Required Level: 20<br>+45% Enhanced Damage<br>+15 to Strength<br>+40 to Life<br>+[6-594] Defense (+6 per Character Level) (2 Items)<br>",
    properties: {
      defense: 99,
      reqstr: 41,
      reqlvl: 15,
      fcr: 10,
      pdr: 6,
      ligrad: 2,
      todef: 100,
      enr: 20,
      regmana: 20, //fullset
    },
  },

  "Cow King's Hide": {
    description:
      "Cow King's Hide<br>Studded Leather<br>Defense: 60<br>Required Strength: 27<br>Required Level: 18<br>18% Chance to Cast Level 5 Chain Lightning when Struck<br>+60% Enhanced Defense<br>+30 to Life<br>All Resistances +25<br>",
    properties: {
      defense: 99,
      reqstr: 41,
      reqlvl: 15,
      fcr: 10,
      pdr: 6,
      ligrad: 2,
      todef: 100,
      enr: 20,
      regmana: 20, //fullset
    },
  },

  "Hwanin's Refuge": {
    description:
      "Hwanin's Refuge<br>Tigulated Mail<br>Defense: 402<br>Required Strength: 86<br>Required Level: 30<br>20% Chance to Cast Level 9 Static Field when Struck<br>+200 Defense<br>+100 to Life<br>Poison Resist +27%<br>",
    properties: {
      defense: 99,
      reqstr: 41,
      reqlvl: 15,
      fcr: 10,
      pdr: 6,
      ligrad: 2,
      todef: 100,
      enr: 20,
      regmana: 20, //fullset
    },
  },

  "Haemosu's Adamant": {
    description:
      "Haemosu's Adamant<br>Cuirass<br>Defense: 676<br>Required Strength: 52<br>Required Level: 44<br>+1 to All Skills<br>+500 Defense<br>+250 Defense vs. Melee<br>+250 Defense vs. Missile<br>+100 to Life<br>Requirements -20%<br>+20% Faster Cast Rate (2 Items)<br>",
    properties: {
      defense: 99,
      reqstr: 41,
      reqlvl: 15,
      fcr: 10,
      pdr: 6,
      ligrad: 2,
      todef: 100,
      enr: 20,
      regmana: 20, //fullset
    },
  },

  "Dark Adherent": {
    description:
      "Dark Adherent<br>Dusk Shroud<br>Defense: 717<br>Required Strength: 77<br>Required Level: 49<br>25% Chance to Cast Level 23 Nova when Struck<br>+250% Damage to Undead<br>Adds 480-680 Poison Damage over 2 Seconds<br>+415 Defense<br>Fire Resist +55%<br>5% Chance to Cast Level 18 Bone Armor when Struck (3 Items)<br>",
    properties: {
      defense: 99,
      reqstr: 41,
      reqlvl: 15,
      fcr: 10,
      pdr: 6,
      ligrad: 2,
      todef: 100,
      enr: 20,
      regmana: 20, //fullset
    },
  },

  // UNIQUE WEAPONS AXES //

  "The Gnasher": {
    description:
      "The Gnasher<br>Hand Axe<br>Base Speed Modifier: 0<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 4 to 9, Avg 6.5<br> Required Level: 5<br> +50% Enhanced Damage<br> 20% Chance of Crushing Blow<br> 50% Chance of Open Wounds<br> +2 Open Wounds Damage per Second<br> +8 to Strength<br>",
    properties: {
      speed: 0,
      onehandmin: 4,
      onehandmax: 9,
      reqstr: "none",
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
      "Bladebone<br>Double Axe<br>Base Speed Modifier: 10<br> Base Melee Range: 2<br> One-Hand Damage: 7 to 19, Avg 13<br> Required Strength: 43<br> Required Level: 15<br> 40% Chance to Cast Level 8 Teeth on Striking<br> +20% Increased Attack Speed<br> +50% Enhanced Damage<br> +100% Damage to Undead<br> +40 to Attack Rating against Undead<br> +60 Defense<br>",
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
      "Skull Splitter<br>Military Pick<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> One-Hand Damage: 12 to 19, Avg 15.5<br> Required Strength: 49<br> Required Level: 21<br> +80% Enhanced Damage<br> +100 to Attack Rating<br> Adds 1-60 Lightning Damage<br> 15% Chance of Open Wounds<br> +16 Open Wounds Damage per Second<br> Hit Blinds Target +2<br> Regenerate Mana 20%<br>",
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
      "Rakescar<br>War Axe<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 30 to 50, Avg 40<br> Required Strength: 67<br> Required Level: 27<br> +30% Increased Attack Speed<br> +150% Enhanced Damage<br> +100 to Attack Rating<br> Adds 38-38 Poison Damage over 2 Seconds<br> Poison Resist +50%<br>",
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
      "Axe of Fechmar<br>Large Axe<br> Base Speed Modifier: -10<br> Base Melee Range: 3<br> Base Maximum Sockets: 4 (5 for ilvl 26+ upgraded versions)<br> Two-Hand Damage: 11 to 24, Avg 17.5<br> Required Strength: 35<br> Required Level: 8<br> +40% Increased Attack Speed<br> +90% Enhanced Damage<br> Freezes Target +3<br> Cold Resist +50%<br> +2 to Light Radius<br>",
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
      "Goreshovel<br>Broad Axe<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 15 to 36, Avg 25.5<br> Required Strength: 48<br> Required Level: 14<br> +30% Increased Attack Speed<br> +50% Enhanced Damage<br> +9 to Maximum Damage<br> 60% Chance of Open Wounds<br> +12 Open Wounds Damage per Second<br> +25 to Strength<br>",
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
      "The Chieftain<br>Battle Axe<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 33 to 89, Avg 61<br> Required Strength: 54<br> Required Level: 19<br> +40% Increased Attack Speed<br> +180% Enhanced Damage<br> Adds 1-40 Lightning Damage<br> All Resistances +20<br> +6 to Mana after each Kill<br>",
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
      "Brainhew<br>Great Axe<br>Base Speed Modifier: -10<br>Base Melee Range: 4<br>Two-Hand Damage: 41 to 90, Avg 65.5<br>Required Strength: 63<br>Required Level: 25<br>+40% Increased Attack Speed<br>+200% Enhanced Damage<br>+14 to Minimum Damage<br>Adds 15-35 Fire Damage<br>13% Mana Stolen per Hit<br>+25 to Mana<br>+4 to Light Radius<br>",
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
      "Humongous<br>Giant Axe<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 82 to 178, Avg 130<br> Required Strength: 84<br> Required Level: 29<br> Melee Splash Radius Increased by 20%<br> +20% Increased Attack Speed<br> +240% Enhanced Damage<br> Adds 8-25 Damage<br> 33% Chance of Crushing Blow<br> +30 to Strength<br> Requirements +20%<br>",
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
      "Felloak<br>Club<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upped)<br> One-Hand Damage: 1 to 10, Avg 5.5<br>Required Level: 3<br>80% Enhanced Damage<br>Adds 6-8 Fire Damage<br>+3 to Firestorm (Druid Only)<br> Knockback<br> Lightning Resist +50%<br> Fire Resist +30%<br> +50% Damage to Undead<br>",
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
      "Stoutnail<br>Spiked Club<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 10 to 16, Avg 13<br> Required Level: 5<br> +100% Enhanced Damage<br> +4 to Lycanthropy (Druid Only)<br> +14 to Vitality<br> Magic Damage Taken Reduced by 4<br> Attacker Takes Damage of 10<br> +50% Damage to Undead<br>",
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
      "Crushflange<br>Mace<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 6 to 20, Avg 13<br> Required Strength: 27<br> Required Level: 9<br> +100% Enhanced Damage<br> 33% Chance of Crushing Blow<br> +15 to Strength<br> Fire Resist +50%<br> +2 to Light Radius<br> +50% Damage to Undead<br>",
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
      "Bloodrise<br>Morning Star<br> Base Speed Modifier: 10<br> Base Melee Range: 2<br> One-Hand Damage: 14 to 32, Avg 23<br> Required Strength: 36<br> Required Level: 15<br> +30% Increased Attack Speed<br> +100% Enhanced Damage<br> 50% Bonus to Attack Rating<br> 6% Life Stolen per Hit<br> 25% Chance of Open Wounds<br> +8 Open Wounds Damage per Second<br> +3 to Sacrifice (Paladin Only)<br> +50% Damage to Undead<br>",
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
      "The General's Tan Do Li Ga<br>Flail<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br>One-Hand Damage: 2 to 78, Avg 40<br> Required Strength: 41<br> Required Dexterity: 35<br> Required Level: 21<br> +20% Increased Attack Speed<br> +60% Enhanced Damage<br> Adds 10 to 40 Damage<br> 5% Mana Stolen per Hit<br> Slows Target by 10%<br> +75 Defense<br> +50% Damage to Undead<br>",
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
      "Ironstone<br>War Hammer<br> Base Speed Modifier: 20<br> Base Melee Range: 2<br> One-Hand Damage: 55 to 80, Avg 67.5<br> Required Strength: 53<br> Required Level: 27<br> +20% Increased Attack Speed<br> +150% Enhanced Damage<br> +150 to Attack Rating<br> Adds 1-50 Lightning Damage<br> +10 to Strength<br> +50% Damage to Undead<br>",
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
      "Bonesnap<br>Maul<br> Base Speed Modifier: 10<br> Base Melee Range: 4<br> Two-Hand Damage: 120 to 172, Avg 146<br> Required Strength: 69<br> Required Level: 24<br> +300% Enhanced Damage<br> +100% Damage to Undead<br> 40% Chance of Crushing Blow<br> Cold Resist +30%<br> Fire Resist +30%<br>",
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
      "Upped Bonesnap<br>War Club<br> Base Speed Modifier: 10<br> Base Melee Range: 4<br> Two-Hand Damage: 276 to 452, Avg 364<br> Required Strength: 124<br> Required Level: 25<br> +300% Enhanced Damage<br> +100% Damage to Undead<br> 40% Chance of Crushing Blow<br> Cold Resist +30%<br> Fire Resist +30%<br>",
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
      "Steeldriver<br>Great Maul<br> Base Speed Modifier: 20<br> Base Melee Range: 3<br> Two-Hand Damage: 144 to 220, Avg 182<br> Required Strength: 50<br> Required Level: 29<br> +40% Increased Attack Speed<br> +280% Enhanced Damage<br> Heal Stamina Plus 25%<br> Requirements -50%<br> +50% Damage to Undead<br>",
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
      "Rixot's Keen<br>Short Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 9 to 14, Avg 11.5<br> Required Level: 2<br> +100% Enhanced Damage<br> +5 to Minimum Damage<br> 25% Chance of Crushing Blow<br> 20% Bonus to Attack Rating<br> +25 Defense<br> +2 to Light Radius<br>",
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
      "Blood Crescent<br>Scimitar<br> Base Speed Modifier: -20<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 3 to 9, Avg 6<br> Required Dexterity: 21<br> Required Level: 7<br> +15% Increased Attack Speed<br> +60% Enhanced Damage<br> 15% Life Stolen per Hit<br> 33% Chance of Open Wounds<br> +4 Open Wounds Damage per Second<br> All Resistances +15<br> +4 to Light Radius<br>",
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
      "Skewer of Krintiz<br>Sabre<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 10 to 23, Avg 16.5<br> Required Strength: 25<br> Required Dexterity: 25<br> Required Level: 10<br> +70% Enhanced Damage<br> Adds 5-10 Damage<br> Ignore Target's Defense<br> 7% Mana Stolen per Hit<br> +10 to Strength<br> +10 to Dexterity<br>",
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
      "Gleamscythe<br>Falchion<br> Base Speed Modifier: 20<br> Base Melee Range: 2 (was 0)<br> Base Maximum Sockets: 2 (3 for upgraded versions)<br> One-Hand Damage: 18 to 34, Avg 26<br> Required Strength: 33<br> Required Level: 13<br> +20% Increased Attack Speed<br> +100% Enhanced Damage<br> Adds 6-10 Cold Damage<br> +20 Defense<br> +30 to Mana<br> +3 to Light Radius<br>",
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
      "Griswold's Edge<br>Broad Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 15 to 30, Avg 22.5<br> Required Strength: 48<br> Required Level: 17<br> +30% Increased Attack Speed<br> +120% Enhanced Damage<br> +100 to Attack Rating<br> Adds 25-35 Fire Damage<br> +12 to Strength<br>",
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
      "Hellplague<br>Long Sword<br> Base Speed Modifier: -10<br> Base Melee Range: 2<br> One-Hand Damage: 5 to 34, Avg 19.5<br> Required Strength: 55<br> Required Dexterity: 39<br> Required Level: 22<br> +2 to Fire Skills<br> +80% Enhanced Damage<br> Adds 25-75 Fire Damage<br> Adds 28-56 Poison Damage over 6 Seconds<br> 5% Mana Stolen per Hit<br> 5% Life Stolen per Hit<br>",
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
      "Culwen's Point<br>War Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 2<br> One-Hand Damage: 20 to 50, Avg 35<br> Required Strength: 71<br> Required Dexterity: 45<br> Required Level: 29<br> +1 to All Skills<br> +20% Increased Attack Speed<br> +20% Faster Hit Recovery<br> +150% Enhanced Damage<br> +120 to Attack Rating<br> Poison Length Reduced by 50%<br>",
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
      "Shadowfang<br>Two-Handed Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 20 to 44, Avg 32<br> One-Hand Damage: 5 to 23, Avg 14<br> Required Strength: 35<br> Required Dexterity: 27<br> Required Level: 12<br> +20% Increased Attack Speed<br> +160% Enhanced Damage<br> Adds 10-30 Cold Damage<br> 9% Mana Stolen per Hit<br> 9% Life Stolen per Hit<br> Cold Resist +20%<br> -2 to Light Radius<br>",
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
      "Soulflay<br>Claymore<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 39 to 69, Avg 49<br> One-Hand Damage: 11 to 27, Avg 19<br> Required Strength: 47<br> Required Level: 19<br> +30% Increased Attack Speed<br> +130% Enhanced Damage<br> 10% Mana Stolen per Hit<br> 10% Life Stolen per Hit<br> All Resistances +15<br>",
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
      "Kinemil's Awl<br>Giant Sword<br> Base Speed Modifier: 0<br> Base Melee Range: 3<br> Two-Hand Damage: 26 to 60, Avg 43<br> One-Hand Damage: 6 to 32, Avg 19<br> Required Strength: 56<br> Required Dexterity: 34<br> Required Level: 23<br> +20% Increased Attack Speed<br> +100% Enhanced Damage<br> +150 to Attack Rating<br> Adds 16-40 Fire Damage<br> +6 to Holy Fire (Paladin Only)<br>",
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
      "Blacktongue<br>Bastard Sword<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 36 to 50, Avg 43<br> One-Hand Damage: 12 to 34, Avg 23<br> Required Strength: 62<br> Required Level: 26<br> +30% Increased Attack Speed<br> +80% Enhanced Damage<br> +100 to Attack Rating<br> Adds 300-360 Poison Damage over 3 Seconds<br> Prevent Monster Heal<br> Poison Resist +50%<br>",
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
      "Ripsaw<br>Flamberge<br> Base Speed Modifier: -10<br> Base Melee Range: 3<br> Two-Hand Damage: 33 to 82, Avg 57.5<br> One-Hand Damage: 23 to 35, Avg 29<br> Required Strength: 70<br> Required Dexterity: 49<br> Required Level: 26<br> +30% Increased Attack Speed<br> +160% Enhanced Damage<br> +15 to Maximum Damage<br> 6% Mana Stolen per Hit<br> 80% Chance of Open Wounds<br> +30 Open Wounds Damage per Second<br>",
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
      "The Patriarch<br>Great Sword<br> Base Speed Modifier: 10<br> Base Melee Range: 3<br> Two-Hand Damage: 105 to 176, Avg 140.5<br> One-Hand Damage: 50 to 84, Avg 67<br> Required Strength: 100<br> Required Dexterity: 60<br> Required Level: 29<br> -20% Increased Attack Speed<br> +290% Enhanced Damage<br> Hit Blinds Target<br> +10 to Strength<br> Physical Damage Taken Reduced by 5<br> Magic Damage Taken Reduced by 5<br> 100% Extra Gold from Monsters<br>",
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
      "Gull<br>Dagger<br>Base Speed Modifier: -20<br> Base Melee Range: 1<br> Base Maximum Sockets: 1 (2 for upgraded versions)<br> One-Hand Damage: 2 to 19, Avg 10.5<br> Required Level: 4<br> Adds 1-15 Damage<br> 20% Deadly Strike<br> -5 to Mana<br> 100% Better Chance of Getting Magic Items<br>",
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
      maxpoisonres: 10,
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
      "True Silver<br>Maiden Javelin<br>Base Speed Modifier: -10<br>One-Hand Damage: 17 to 252, Avg 141.5<br>Throw Damage: 13 to 270, Avg 134.5<br>Required Strength: 33<br>Required Dexterity: 47<br>Required Level: 20<br>+40% Increased Attack Speed<br>+120% Enhanced Damage<br>+[2-222] to Maximum Damage (+2.25 per Character Level)<br>15% Chance of Crushing Blow<br>45% Better Chance of Getting Magic Items<br>",
    properties: {
      javelin: 1,
      speed: -10,
      onehandmin: 17,
      onehandmax: 252,
      throwmin: 13,
      throwmax: 270,
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

  Coldkill: {
    description:
      "Coldkill<br>Base Melee Range: 2<br>Base Maximum Sockets: 3<br>One-Hand Damage: 43 to 87, Avg 65<br>Required Strength: 25<br>Required Dexterity: 25<br>Required Level: 36<br>14% Chance to Cast Level 18 Ice Blast on Striking<br>25% Chance to Cast Level 20 Frost Nova when Struck<br>+30% Increased Attack Speed<br>+190% Enhanced Damage<br>Adds 160-240 Cold Damage<br>+10% to Maximum Cold Resist<br>Cold Resist +15%<br>",
    properties: {
      onehandmin: 43, // One-Hand Damage Min
      onehandmax: 87, // One-Hand Damage Max
      reqstr: 25, // Required Strength
      reqdex: 25, // Required Dexterity
      reqlvl: 36, // Required Level
      ctciceblast: (14, 18), // Chance to Cast Ice Blast on Striking (14% chance, level 18)
      ctcfrostnovastruck: (25, 20), // Chance to Cast Frost Nova when Struck (25% chance, level 20)
      ias: 30, // Increased Attack Speed (30%)
      edmg: 150, // Enhanced Damage (150%)
      colddmgmin: 160, // Cold Damage Min (160)
      colddmgmax: 240, // Cold Damage Max (240)
      maxcoldres: 10, // Maximum Cold Resist (10%)
      coldres: 15, // Cold Resist (15%)
    },
  },
  "Butcher's Pupil": {
    description:
      "Butcher's Pupil<br>Cleaver<br>Base Melee Range: 2<br>One-Hand Damage: 62 to 171, Avg 116.5<br>Required Strength: 68<br>Required Level: 39<br>+30% Increased Attack Speed<br>+200% Enhanced Damage<br>Adds 20-30 Damage<br>35% Deadly Strike<br>25% Chance of Open Wounds<br>+120 Open Wounds Damage per Second<br>",
    properties: {
      onehandmin: 62, // One-Hand Damage Min
      onehandmax: 171, // One-Hand Damage Max
      reqstr: 68, // Required Strength
      reqlvl: 39, // Required Level
      ias: 30, // Increased Attack Speed (30%)
      edmg: 200, // Enhanced Damage (200%)
      tomindmg: 20, // Additional Damage Min (20)
      tomaxdmg: 30, // Additional Damage Max (30)
      deadlystrike: 35, // Deadly Strike Chance (35%)
      openwounds: 25, // Open Wounds Chance (25%)
      openwoundsdps: 120, // Open Wounds Damage per Second (120)
    },
  },

  Islestrike: {
    description:
      "Islestrike<br>Twin Axe<br>Base Melee Range: 2<br>One-Hand Damage: 52 to 156, Avg 104<br>Required Strength: 85<br>Required Level: 43<br>+2 to Druid Skills<br>+50% Increased Attack Speed<br>+190% Enhanced Damage<br>25% Chance of Crushing Blow<br>+4 to Fury (Druid Only)<br>+4 to Maul (Druid Only)<br>+10 to All Attributes<br>",
    properties: {
      onehandmin: 52, // One-Hand Damage Min
      onehandmax: 156, // One-Hand Damage Max
      reqstr: 85, // Required Strength
      reqlvl: 43, // Required Level
      druidskills: 2, // Druid Skills (+2)
      ias: 50, // Increased Attack Speed (50%)
      edmg: 190, // Enhanced Damage (190%)
      crushingblow: 25, // Crushing Blow Chance (25%)
      fury: 4, // Fury Skill (+4)
      maul: 4, // Maul Skill (+4)
      allattributes: 10, // All Attributes (+10)
    },
  },

  "Pompeii's Wrath": {
    description:
      "Pompeii's Wrath<br>Crowbill<br>Base Melee Range: 2<br>One-Hand Damage: 63 to 144, Avg 103.5<br>Required Strength: 94<br>Required Dexterity: 70<br>Required Level: 45<br>8% Chance to Cast Level 28 Molten Boulder on Striking<br>+40% Increased Attack Speed<br>+200% Enhanced Damage<br>Adds 60-175 Fire Damage<br>Slows Target by 10%<br>",
    properties: {
      onehandmin: 63, // One-Hand Damage Min
      onehandmax: 144, // One-Hand Damage Max
      reqstr: 94, // Required Strength
      reqdex: 70, // Required Dexterity
      reqlvl: 45, // Required Level
      ctcmoltenboulder: (8, 28), // Chance to Cast Molten Boulder on Striking (8% chance, level 28)
      ias: 40, // Increased Attack Speed (40%)
      edmg: 200, // Enhanced Damage (200%)
      tomindmg: 60, // Fire Damage Min (60)
      tomaxdmg: 175, // Fire Damage Max (175)
      slows: 10, // Slows Target by 10%
    },
  },

  "Guardian Naga": {
    description:
      "Guardian Naga<br>Naga<br>Base Melee Range: 2<br>One-Hand Damage: 64 to 199, Avg 131.5<br>Required Strength: 121<br>Required Level: 48<br>10% Chance to Cast Level 25 Poison Nova on Striking<br>+180% Enhanced Damage<br>+20 to Maximum Damage<br>+250 Poison Damage over 2 Seconds<br>Poison Resist +30%<br>Attacker Takes Damage of 150<br>",
    properties: {
      onehandmin: 64, // One-Hand Damage Min
      onehandmax: 199, // One-Hand Damage Max
      reqstr: 121, // Required Strength
      reqlvl: 48, // Required Level
      ctcpoisonnova: (10, 25), // Chance to Cast Poison Nova on Striking (10% chance, level 25)
      edmg: 180, // Enhanced Damage (180%)
      tomindmg: 20, // Additional Maximum Damage (20)
      poisondmgmin: 250, // Poison Damage Min (250)
      poisondmgmax: 250, // Poison Damage Max (250)
      poisontime: 2, // Poison Duration in seconds (2)
      poisres: 30, // Poison Resist (+30%)
      attackerdamagereduction: 150, // Attacker Takes Damage of 150
    },
  },

  "Warlord's Trust": {
    description:
      "Warlord's Trust<br>Military Axe<br>Base Melee Range: 3<br>Two-Hand Damage: 74 to 216, Avg 145<br>Required Strength: 73<br>Required Level: 35<br>+40% Increased Attack Speed<br>+255% Enhanced Damage<br>+75 Defense<br>Physical Damage Taken Reduced by 20%<br>+[0-49] to Vitality (+0.5 per Character Level)<br>Replenish Life +20<br>All Resistances +20<br>Repairs 1 Durability in 4 Seconds<br>",
    properties: {
      twohandmin: 74, // Two-Hand Damage Min
      twohandmax: 216, // Two-Hand Damage Max
      reqstr: 73, // Required Strength
      reqlvl: 35, // Required Level
      ias: 40, // Increased Attack Speed (40%)
      edmg: 255, // Enhanced Damage (255%)
      defense: 75, // Defense (+75)
      pdr: 20, // Physical Damage Taken Reduced by 20%
      vitalityperlvl: 0.5, // Vitality per Character Level (0.5)
      vitality: 49, // Vitality Range (0-49) based on character level
    },
  },

  Spellsteel: {
    description:
      "Spellsteel<br>Bearded Axe<br>Base Melee Range: 3<br>Two-Hand Damage: 103 to 241, Avg 172<br>Required Strength: 37<br>Required Level: 39<br>+30% Faster Cast Rate<br>+245% Enhanced Damage<br>+100 to Mana<br>Regenerate Mana 25%<br>Magic Damage Taken Reduced by 15<br>Level 18 Amplify Damage (60 Charges)<br>Level 1 Blink (60 Charges)<br>30% Chance to Cast Level 25 Firestorm on Striking<br>30% Chance to Cast Level 25 Holy Bolt on Striking<br>Requirements -60%<br>",
    properties: {
      twohandmin: 103, // Two-Hand Damage Min
      twohandmax: 241, // Two-Hand Damage Max
      reqstr: 37, // Required Strength
      reqlvl: 39, // Required Level
      fcr: 30, // Faster Cast Rate (30%)
      edmg: 245, // Enhanced Damage (245%)
      tomana: 100, // Mana (+100)
      regmana: 25, // Regenerate Mana (25%)
      mdr: 15, // Magic Damage Taken Reduced by 15
      amplifydamagecharges: 60, // Level 18 Amplify Damage Charges (60 Charges)
      blinkcharges: 60, // Level 1 Blink Charges (60 Charges)
      ctcfirestorm: (30, 25), // Chance to Cast Level 25 Firestorm on Striking (30% chance, level 25)
      ctcholydbolt: (30, 25), // Chance to Cast Level 25 Holy Bolt on Striking (30% chance, level 25)
      req: -60, // Requirements -60% (this is a flat reduction to the requirements of the item)
    },
  },

  Stormrider: {
    description:
      "Stormrider<br>Tabar<br>Base Melee Range: 3 (was 1)<br>Two-Hand Damage: 105 to 273, Avg 189<br>Required Strength: 101<br>Required Level: 41<br>14% Chance to Cast Level 25 Chain Lightning on Striking<br>30% Chance to Cast Level 27 Charged Bolt on Striking<br>25% Chance to Cast Level 25 Charged Bolt when Struck<br>+100% Enhanced Damage<br>Adds 35-75 Damage<br>Adds 1-200 Lightning Damage<br>Attacker Takes Lightning Damage of [75-150]<br>+50 Durability<br>",
    properties: {
      twohandmin: 105, // Two-Hand Damage Min
      twohandmax: 273, // Two-Hand Damage Max
      reqstr: 101, // Required Strength
      reqlvl: 41, // Required Level
      ctcchainlightning: (14, 25), // Chance to Cast Level 25 Chain Lightning on Striking (14% chance, level 25)
      ctcchargedboltstriking: (30, 27), // Chance to Cast Level 27 Charged Bolt on Striking (30% chance, level 27)
      ctcchargedboltstruck: (25, 25), // Chance to Cast Level 25 Charged Bolt when Struck (25% chance, level 25)
      edmg: 100, // Enhanced Damage (100%)
      tomin: 35, // Additional Damage Min (35)
      tomax: 75, // Additional Damage Max (75)
      lightdmgmin: 1, // Lightning Damage Min (1)
      lightdmgmax: 200, // Lightning Damage Max (200)
    },
  },
  "Boneslayer Blade": {
    description:
      "Boneslayer Blade<br>Gothic Axe<br>Base Melee Range: 4<br>Two-Hand Damage: 73 to 320, Avg 196.5<br>Required Strength: 115<br>Required Dexterity: 79<br>Required Level: 42<br>20% Chance to Cast Level 30 Holy Bolt on Striking<br>+40% Increased Attack Speed<br>+220% Enhanced Damage<br>35% Bonus to Attack Rating<br>+[2-247]% Damage to Undead (+2.5% per Character Level)<br>+[5-495] to Attack Rating against Undead (+5 per Character Level)<br>+12 to Zeal<br>+8 to Strength<br>",
    properties: {
      twohandmin: 73, // Two-Hand Damage Min
      twohandmax: 320, // Two-Hand Damage Max
      reqstr: 115, // Required Strength
      reqdex: 79, // Required Dexterity
      reqlvl: 42, // Required Level
      ctcholybolt: (20, 30), // Chance to Cast Level 30 Holy Bolt on Striking (20% chance, level 30)
      ias: 40, // Increased Attack Speed (40%)
      edmg: 220, // Enhanced Damage (220%)
      toattpercent: 35, // Bonus to Attack Rating (35%)
      dmgtound: 2.5, // Damage to Undead per Character Level (2.5%)
      maxdmgperlvl: 2.5, // Maximum Damage to Undead per Character Level (2.5%)
      toattundeadlvl: 5, // Additional Attack Rating against Undead per Character Level (5)
      zealosk: 12,
      str: 8,
    },
  },

  "The Minotaur": {
    description:
      "The Minotaur<br>Ancient Axe<br>Base Melee Range: 3<br>Two-Hand Damage: 263 to 489, Avg 376<br>Required Strength: 125<br>Required Level: 45<br>+260% Enhanced Damage<br>Adds 40-50 Damage<br>30% Chance of Crushing Blow<br>Hit Blinds Target +2<br>Slows Target by 10%<br>+20 to Strength<br>Cannot Be Frozen<br>",
    properties: {
      twohandmin: 263, // Two-Hand Damage Min
      twohandmax: 489, // Two-Hand Damage Max
      reqstr: 125, // Required Strength
      reqlvl: 45, // Required Level
      edmg: 260, // Enhanced Damage (260%)
      tomindmg: 40, // Additional Damage Min (40)
      tomaxdmg: 50, // Additional Damage Max (50)
      crushingblow: 30, // Crushing Blow Chance (30%)
      hitblinds: 2, // Hit Blinds Target (+2)
      slows: 10, // Slows Target by 10%
      str: 20, // Additional Strength (+20)
      cbf: 1,
    },
  },
  "Razor's Edge": {
    description:
      "Razor's Edge<br>Tomahawk<br>Base Melee Range: 2 (was 0)<br>Base Maximum Sockets: 3<br>One-Hand Damage: 176 to 300, Avg 238<br>Required Strength: 125<br>Required Dexterity: 67<br>Required Level: 67<br>+60% Increased Attack Speed<br>+300% Enhanced Damage<br>-25% Target Defense<br>40% Deadly Strike<br>60% Chance of Open Wounds<br>+340 Open Wounds Damage Per Second<br>",
    properties: {
      onehandmin: 176, // One-Hand Damage Min
      onehandmax: 300, // One-Hand Damage Max
      reqstr: 125, // Required Strength
      reqdex: 67, // Required Dexterity
      reqlvl: 67, // Required Level
      ias: 60, // Increased Attack Speed (60%)
    },
  },

  "Rune Master": {
    description:
      "Rune Master<br>Ettin Axe<br>Base Melee Range: 2<br>One-Hand Damage: 164 to 332, Avg 248<br>Required Strength: 145<br>Required Dexterity: 45<br>Required Level: 72<br>+40% Increased Attack Speed<br>+300% Enhanced Damage<br>+5% to Maximum Cold Resist<br>Curse Resistance +20%<br>Cannot Be Frozen<br>Socketed [5]<br>",
    properties: {
      onehandmin: 164, // One-Hand Damage Min
      onehandmax: 332, // One-Hand Damage Max
      reqstr: 145, // Required Strength
      reqdex: 45, // Required Dexterity
      reqlvl: 72, // Required Level
      ias: 40, // Increased Attack Speed (40%)
    },
  },

  Cranebeak: {
    description:
      "Cranebeak<br>War Spike<br>Base Melee Range: 2<br>One-Hand Damage: 152 to 240, Avg 196<br>Required Strength: 133<br>Required Dexterity: 54<br>Required Level: 63<br>+40% Increased Attack Speed<br>+300% Enhanced Damage<br>-25% Target Defense<br>Adds 1-450 Lightning Damage<br>60% Better Chance of Getting Magic Items<br>+6 to Raven (Druid Only)<br>",
    properties: {
      onehandmin: 152, // One-Hand Damage Min
      onehandmax: 240, // One-Hand Damage Max
      reqstr: 133, // Required Strength
      reqdex: 54, // Required Dexterity
      reqlvl: 63, // Required Level
      ias: 40, // Increased Attack Speed (40%)
      edmg: 300, // Enhanced Damage (300%)
    },
  },

  "Death Cleaver": {
    description:
      "Death Cleaver<br>Berserker Axe<br>Base Melee Range: 2<br>One-Hand Damage: 214 to 373, Avg 293.5<br>Required Strength: 138<br>Required Dexterity: 59<br>Required Level: 70<br>+40% Increased Attack Speed<br>+350% Enhanced Damage<br>+30 to Minimum Damage<br>-33% Target Defense<br>60% Deadly Strike<br>5% Maximum Deadly Strike<br>+9 Life after each Kill<br>",
    properties: {
      onehandmin: 214, // One-Hand Damage Min
      onehandmax: 373, // One-Hand Damage Max
      edmg: 350, // Enhanced Damage (350%)
      reqstr: 138, // Required Strength
      reqdex: 59, // Required Dexterity
      tomindmg: 30,
    },
  },

  "Ethereal Edge": {
    description:
      "Ethereal Edge<br>Silver-Edged Axe<br>Base Melee Range: 3<br>Two-Hand Damage (Ethereal): 271 to 481, Avg 376<br>Required Strength: 156<br>Required Dexterity: 55<br>Required Level: 74<br>Indestructible<br>+45% Increased Attack Speed<br>+180% Enhanced Damage<br>+350 to Attack Rating<br>+200% Damage to Demons<br>+12 Fire Absorb<br>+20 Life after each Demon Kill<br>Ethereal<br>",
    properties: {
      twohandmin: 271, // Two-Hand Damage Min (Ethereal)
      twohandmax: 481, // Two-Hand Damage Max (Ethereal)
      reqstr: 156, // Required Strength
      reqdex: 55, // Required Dexterity
    },
  },

  Hellslayer: {
    description:
      "Hellslayer<br>Decapitator<br>Base Melee Range: 3<br>Two-Hand Damage: 183 to [415-1020], Avg 280.5-601.5<br>Required Strength: 189<br>Required Dexterity: 33<br>Required Level: 66<br>30% Chance to Cast Level 30 Fire Ball on Striking<br>+40% Increased Attack Speed<br>+200% Enhanced Damage<br>+[3-297]% Enhanced Maximum Damage (+3% per Character Level)<br>Adds 600 Fire Damage<br>-35% to Enemy Fire Resistance<br>+[0-49] to Strength (+0.5 per Character Level)<br>+[0-49] to Vitality (+0.5 per Character Level)<br>",
    properties: {
      twohandmin: 183, // Two-Hand Damage Min
      twohandmax: 415, // Two-Hand Damage Max (lower bound)
    },
  },

  "Messerschmidt's Reaver": {
    description:
      "Messerschmidt's Reaver<br>Champion Axe<br>Base Melee Range: 4<br>Two-Hand Damage: 259 to 704, Avg 481.5<br>Required Strength: 167<br>Required Dexterity: 59<br>Required Level: 70<br>+20% Increased Attack Speed<br>+250% Enhanced Damage<br>+[2-247]% Enhanced Maximum Damage (+2.5% per Character Level)<br>100% Bonus to Attack Rating<br>20% Chance of Open Wounds<br>+850 Open Wounds Damage per Second<br>+20 to All Attributes<br>",
    properties: {
      twohandmin: 259, // Two-Hand Damage Min
      twohandmax: 704, // Two-Hand Damage Max
      reqstr: 167, // Required Strength
      reqdex: 59, // Required Dexterity
      reqlvl: 70, // Required Level
    },
  },

  "Executioner's Justice": {
    description:
      "Executioner's Justice<br>Glorious Axe<br>Base Melee Range: 3<br>Two-Hand Damage: 315 to 651, Avg 483<br>Required Strength: 164<br>Required Dexterity: 55<br>Required Level: 77<br>50% Chance to Cast Level 25 Decrepify when you Kill an Enemy<br>+30% Increased Attack Speed<br>+335% Enhanced Damage<br>-33% Target Defense<br>50% Chance of Crushing Blow<br>Curse Resistance +20%<br>",
    properties: {
      twohandmin: 315, // Two-Hand Damage Min
      twohandmax: 651, // Two-Hand Damage Max
      reqstr: 164, // Required Strength
      reqdex: 55, // Required Dexterity
    },
  },

  "Dark Clan Crusher": {
    description:
      "Dark Clan Crusher<br>Cudgel<br>Base Melee Range: 2<br>Base Maximum Sockets: 3<br>One-Hand Damage: 34 to 10, Avg 68<br>Required Strength: 25<br>Required Level: 34<br>+2 to Druid Skills<br>+40% Increased Attack Speed<br>+240% Enhanced Damage<br>25% Bonus to Attack Rating<br>+200% Damage to Demons<br>+200 to Attack Rating against Demons<br>+15 Life after each Demon Kill<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 34, // One-Hand Damage Min
      onehandmax: 10, // One-Hand Damage Max (this should be a positive number, but it seems to be a placeholder in the original text)
      reqstr: 25, // Required Strength
      reqlvl: 34, // Required Level
      ias: 40, // Increased Attack Speed (40%)
      edmg: 240, // Enhanced Damage (240%)
    },
  },

  Fleshrender: {
    description:
      "Fleshrender<br>Barbed Club<br>Base Speed Modifier: 0<br>Base Melee Range: 2<br>One-Hand Damage: 85 to 150, Avg 117.5<br>Required Strength: 30<br>Required Level: 38<br>+2 to Shape Shifting Skills (Druid Only)<br>+2 to Druid Skills<br>+40% Increased Attack Speed<br>+180% Enhanced Damage<br>Adds 35-50 Damage<br>20% Chance of Crushing Blow<br>20% Deadly Strike<br>25% Chance of Open Wounds<br>+50 Open Wounds Damage per Second<br>+50% Damage to Undead<br>+20 Durability<br>",
    properties: {
      onehandmin: 85, // One-Hand Damage Min
      onehandmax: 150, // One-Hand Damage Max
      reqstr: 30, // Required Strength
      reqlvl: 38, // Required Level
      shapeshiftingskills: 2, // Shape Shifting Skills (+2)
    },
  },

  "Sureshrill Frost": {
    description:
      "Sureshrill Frost<br>Flanged Mace<br>Base Melee Range: 2<br>Base Maximum Sockets: 3<br>One-Hand Damage: 76 to 122, Avg 99<br>Required Strength: 61<br>Required Level: 39<br>10% Chance to Cast Level 14 Frozen Orb on Striking<br>+3 to Cold Skills<br>+180% Enhanced Damage<br>Adds 15-30 Damage<br>Adds 63-112 Cold Damage<br>Freezes Target +3<br>Cannot Be Frozen<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 76, // One-Hand Damage Min
      onehandmax: 122, // One-Hand Damage Max
      reqstr: 61, // Required Strength
      reqlvl: 39, // Required Level
      ctcfrozenorb: (10, 14), // Chance to Cast Frozen Orb on Striking (10% chance, level 14)
      coldsks: 3, // Cold Skills (+3)
      ias: 0, // No IAS bonus in the original description
      edmg: 180, // Enhanced Damage (180%)
      tomin: 15, // Additional Damage Min (15)
      tomax: 30, // Additional Damage Max (30)
      colddmgmin: 63, // Cold Damage Min (63)
      colddmgmax: 112, // Cold Damage Max (112)
      freezestarget: 3, // Freezes Target (+3)
      cbf: 1, // Cannot Be Frozen
    },
  },

  Moonfall: {
    description:
      "Moonfall<br>Jagged Star<br>Base Melee Range: 2<br>One-Hand Damage: 88 to 136, Avg 112<br>Required Strength: 74<br>Required Level: 42<br>12% Chance to Cast Level 26 Meteor on Striking<br>+3 to Magic Skills<br>+170% Enhanced Damage<br>Adds 10-15 Damage<br>Adds 55-115 Fire Damage<br>Magic Damage Taken Reduced by [9-12]<br>+2 to Light Radius<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 88, // One-Hand Damage Min
      onehandmax: 136, // One-Hand Damage Max
      reqstr: 74, // Required Strength
      reqlvl: 42, // Required Level
      ctcmeteor: (12, 26), // Chance to Cast Meteor on Striking (12% chance, level 26)
    },
  },

  "Baezil's Vortex": {
    description:
      "Baezil's Vortex<br>Knout<br>Base Melee Range: 2<br>One-Hand Damage: 54 to 150, Avg 102<br>Required Strength: 82<br>Required Dexterity: 73<br>Required Level: 45<br>20% Chance to Cast Level 25 Nova on Striking<br>+20% Increased Attack Speed<br>+200% Enhanced Damage<br>Adds 1-150 Lightning Damage<br>+100 to Mana<br>Lightning Resist +25%<br>Level 25 Nova (80 Charges)<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 54, // One-Hand Damage Min
      onehandmax: 150, // One-Hand Damage Max
      reqstr: 82, // Required Strength
      reqdex: 73, // Required Dexterity
      reqlvl: 45, // Required Level
    },
  },

  Earthshaker: {
    description:
      "Earthshaker<br>Battle Hammer<br>Base Melee Range: 2<br>One-Hand Damage: 128 to 198, Avg 163<br>Required Strength: 100<br>Required Level: 43<br>14% Chance to Cast Level 24 Fissure on Striking<br>+4 to Elemental Skills (Druid Only)<br>+30% Increased Attack Speed<br>+20% Faster Cast Rate<br>+230% Enhanced Damage<br>Hit Blinds Target<br>+50% Damage to Undead<br>+50 Durability<br>",
    properties: {
      onehandmin: 128, // One-Hand Damage Min
      onehandmax: 198, // One-Hand Damage Max
    },
  },

  "Bloodtree Stump": {
    description:
      "Bloodtree Stump<br>War Club<br>Base Melee Range: 4<br>Two-Hand Damage: 248 to 406, Avg 327<br>Required Strength: 124<br>Required Level: 48<br>+2 to Masteries (Barbarian Only)<br>+260% Enhanced Damage<br>50% Chance of Crushing Blow<br>+3 to General Mastery (Barbarian Only)<br>+3 to Leap Attack (Barbarian Only)<br>+25 to Strength<br>All Resistances +20<br>+50% Damage to Undead<br>+40 Durability<br>",
    properties: {
      twohandmin: 248, // Two-Hand Damage Min
      twohandmax: 406, // Two-Hand Damage Max
    },
  },

  "The Gavel of Pain": {
    description:
      "The Gavel of Pain<br>Martel de Fer<br>Base Melee Range: 3<br>Two-Hand Damage: 274 to 481, Avg 377.5<br>Required Strength: 169<br>Required Level: 45<br>12% Chance to Cast Level 31 Amplify Damage on Striking<br>5% Chance to Cast Level 1 Iron Maiden when Struck<br>+245% Enhanced Damage<br>Adds 12-30 Damage<br>Curse Resistance +20%<br>Attacker Takes Damage of 260<br>Level 8 Amplify Damage (3 Charges)<br>Replenish 1 Charge in 3 Seconds<br>+50% Damage to Undead<br>",
    properties: {
      twohandmin: 274, // Two-Hand Damage Min
      twohandmax: 481, // Two-Hand Damage Max
    },
  },

  "Nord's Tenderizer": {
    description:
      "Nord's Tenderizer<br>Truncheon<br>Base Melee Range: 2<br>Base Maximum Socets: 3<br>One-Hand Damage: 189 to 232, Avg 210.5<br>Required Strength: 88<br>Required Dexterity: 43<br>Required Level: 68<br>18% Chance to Cast Level 32 Blizzard on Striking<br>+25% Increased Attack Speed<br>+330% Enhanced Damage<br>180% Bonus to Attack Rating<br>Adds 205-455 Cold Damage<br>Freezes Target +4<br>Cold Absorb 15%<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 189, // One-Hand Damage Min
      onehandmax: 232, // One-Hand Damage Max
      reqstr: 88, // Required Strength
      reqdex: 43, // Required Dexterity
    },
  },

  "Demon Limb": {
    description:
      "Demon Limb<br>Tyrant Club<br>Base Melee Range: 2<br>One-Hand Damage: 141 to 247, Avg 194<br>Required Strength: 133<br>Required Level: 63<br>+230% Enhanced Damage<br>+123% Damage to Demons<br>Adds 222-333 Fire Damage<br>13% Life Stolen per Hit<br>Fire Resist +20%<br>Level 23 Enchant Fire (20 Charges)<br>Replenish 1 Charge in 3 Seconds<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 141, // One-Hand Damage Min
      onehandmax: 247, // One-Hand Damage Max
    },
  },

  "Baranar's Star": {
    description:
      "Baranar's Star<br>Devil Star<br>Base Melee Range: 2<br>One-Hand Damage: 196 to 241, Avg 218.5<br>Required Strength: 153<br>Required Dexterity: 44<br>Required Level: 65<br>+50% Increased Attack Speed<br>+200% Enhanced Damage<br>200% Bonus to Attack Rating<br>Adds 50-300 Fire Damage<br>Adds 50-300 Lightning Damage<br>Adds 50-300 Cold Damage<br>+15 to Strength<br>+15 to Dexterity<br>+50% Damage to Undead<br>+100 Durability<br>",
    properties: {
      onehandmin: 196, // One-Hand Damage Min
      onehandmax: 241, // One-Hand Damage Max
    },
  },

  "Horizon's Tornado": {
    description:
      "Horizon's Tornado<br>Scourge<br>Base Melee Range: 2<br>One-Hand Damage: 56 to 400, Avg 228<br>Required Strength: 125<br>Required Dexterity: 77<br>Required Level: 64<br>25% Chance to Cast Level 28 Tornado on Striking<br>15% Chance to Cast Level 28 Twister on Casting<br>+50% Increased Attack Speed<br>+35% Faster Cast Rate<br>+300% Enhanced Damage<br>+6 to Tornado (Druid Only)<br>+6 to Twister (Druid Only)<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 56, // One-Hand Damage Min
      onehandmax: 400, // One-Hand Damage Max (this is a placeholder, it should be a positive number)
      reqstr: 125, // Required Strength
      reqdex: 77, // Required Dexterity
      reqlvl: 64, // Required Level
    },
  },

  Stormlash: {
    description:
      "Stormlash<br>Scourge<br>Base Melee Range: 2<br>One-Hand Damage: 61 to 440, Avg 250.5<br>Required Strength: 125<br>Required Dexterity: 77<br>Required Level: 82<br>30% Chance to Cast Level 28 Tornado on Striking<br>20% Chance to Cast Level 25 Static Field on Striking<br>+30% Increased Attack Speed<br>+340% Enhanced Damage<br>Adds 1-600 Lightning Damage<br>33% Chance of Crushing Blow<br>+9 Lightning Absorb<br>Attacker Takes Lightning Damage of 360<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 61, // One-Hand Damage Min
      onehandmax: 440, // One-Hand Damage Max (this is a placeholder, it should be a positive number)
      reqstr: 125, // Required Strength
      reqdex: 77, // Required Dexterity
      reqlvl: 82, // Required Level
    },
  },

  "Stone Crusher": {
    description:
      "Stone Crusher<br>Legendary Mallet<br>Base Melee Range: 2<br>One-Hand Damage: 226 to 273, Avg 249.5<br>Required Strength: 189<br>Required Level: 68<br>-10% to Enemy Physical Resistance<br>+260% Enhanced Damage<br>Removed<br>-25% Target Defense<br>40% Chance of Crushing Blow<br>-75 to Monster Defense per Hit<br>+30 to Strength<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 226, // One-Hand Damage Min
      onehandmax: 273, // One-Hand Damage Max
      reqstr: 189, // Required Strength
    },
  },

  "Schaefer's Hammer": {
    description:
      "Schaefer's Hammer<br>Legendary Mallet<br>Base Melee Range: 2<br>One-Hand Damage: 226 to 471, Avg 348.5<br>Required Strength: 189<br>Required Level: 79<br>20% Chance to Cast Level 25 Static Field on Striking<br>Repairs 1 Durability in 10 Seconds<br>+40% Increased Attack Speed<br>+260% Enhanced Damage<br>+[2-198] to Maximum Damage (+2 per Character Level)<br>+[8-792] to Attack Rating (+8 per Character Level)<br>Adds 75-585 Lightning Damage<br>+50 to Life<br>Lightning Resist +75%<br>+4-8 to Light Radius<br>+50% Damage to Undead<br>",
    properties: {
      onehandmin: 226, // One-Hand Damage Min
      onehandmax: 471, // One-Hand Damage Max
      reqstr: 189, // Required Strength
      reqlvl: 79, // Required Level
      ctcstaticfield: (20, 25), // Chance to Cast Level 25 Static Field on Striking (20% chance, level 25)
    },
  },

  Windhammer: {
    description:
      "Windhammer<br>Ogre Maul<br>Base Melee Range: 4<br>Two-Hand Damage: 364 to 501, Avg 432.5<br>Required Strength: 225<br>Required Level: 68<br>33% Chance to Cast Level 35 Twister on Striking<br>+40% Increased Attack Speed<br>+280% Enhanced Damage<br>50% Chance of Crushing Blow<br>+50% Damage to Undead<br>",
    properties: {
      twohandmin: 364, // Two-Hand Damage Min
      twohandmax: 501, // Two-Hand Damage Max
    },
  },

  "Earth Shifter": {
    description:
      "Earth Shifter<br>Thunder Maul<br>Base Melee Range: 3<br>Two-Hand Damage: 164 to 900, Avg 532<br>Required Strength: 190<br>Required Level: 69<br>8% Chance to Cast level 25 Volcano on Kill<br>25% Chance to Cast Level 28 Fissure on Striking<br>+4 to Fire Skills<br>+40% Increased Attack Speed<br>+60% Faster Cast Rate<br>+300% Enhanced Damage<br>33% Chance of Crushing Blow<br>+50% Damage to Undead<br>Requirements -25%<br>",
    properties: {
      twohandmin: 164, // Two-Hand Damage Min
      twohandmax: 900, // Two-Hand Damage Max (this is a placeholder, it should be a positive number)
      reqstr: 190, // Required Strength
      reqlvl: 69, // Required Level
      ctcvolcano: (8, 25), // Chance to Cast Level 25 Volcano on Kill (8% chance, level 25)
    },
  },

  "The Cranium Basher": {
    description:
      "The Cranium Basher<br>Thunder Maul<br>Base Melee Range: 3<br>Two-Hand Damage: 167 to 835, Avg 501<br>Required Strength: 253<br>Required Level: 87<br>8% Chance to Cast Level 33 Amplify Damage on Striking<br>+30% Increased Attack Speed<br>+260% Enhanced Damage<br>Adds 20-25 Damage<br>75% Chance of Crushing Blow<br>+25 to Strength<br>All Resistances +25<br>+50% Damage to Undead<br>",
    properties: {
      twohandmin: 167, // Two-Hand Damage Min
      twohandmax: 835, // Two-Hand Damage Max (this is a placeholder, it should be a positive number)
      reqstr: 253, // Required Strength
      reqlvl: 87, // Required Level
      ctcampdamage: (8, 33), // Chance to Cast Level 33 Amplify Damage on Striking (8% chance, level 33)
    },
  },

  Bloodletter: {
    description:
      "Bloodletter<br>Gladius<br>Base Melee Range: 2<br>Base Maximum Sockets: 3<br>One-Hand Damage: 64 to 185, Avg 124.5<br>Required Strength: 25<br>Required Level: 30<br>-20% Increased Attack Speed<br>+340% Enhanced Damage<br>Adds 12-45 Damage<br>+90 to Attack Rating<br>8% Life Stolen per Hit<br>+3 to Whirlwind (Barbarian Only)<br>+4 to General Mastery (Barbarian Only)<br>10% Slower Stamina Drain<br>+30 Durability<br>",
    properties: {
      onehandmin: 64, // One-Hand Damage Min
      onehandmax: 185, // One-Hand Damage Max
      reqstr: 25, // Required Strength
      reqlvl: 30, // Required Level
      ias: -20, // Decreased Attack Speed (-20%)
      edmg: 340, // Enhanced Damage (340%)
      tomindmg: 12, // Additional Damage Min (12)
      tomaxdmg: 45, // Additional Damage Max (45)
      toatt: 90, // Attack Rating Bonus (90)
      lleech: 8, // Life Stolen per Hit (8%)
      whirlwindosk: 3,
      generalmasteryosk: 4,
    },
  },

  "Coldsteel Eye": {
    description:
      "Coldsteel Eye<br>Cutlass<br>Base Melee Range: 2<br>Base Maximum Sockets: 3<br>One-Hand Damage: 45 to 112, Avg 78.5<br>Required Strength: 25<br>Required Dexterity: 52<br>Required Level: 31<br>+20% Increased Attack Speed<br>+275% Enhanced Damage<br>Adds 50-80 Cold Damage<br>6% Mana Stolen per Hit<br>50% Deadly Strike<br>Hit Blinds Target<br>Freezes Target<br>+50 Durability<br>",
    properties: {
      onehandmin: 45, // One-Hand Damage Min
      onehandmax: 112, // One-Hand Damage Max
      reqstr: 25, // Required Strength
      reqdex: 52, // Required Dexterity
      reqlvl: 31, // Required Level
      ias: 20, // Increased Attack Speed (20%)
      edmg: 275, // Enhanced Damage (275%)
      colddmgmin: 50, // Cold Damage Min (50)
      colddmgmax: 80, // Cold Damage Max (80)
      manasteal: 6, // Mana Stolen per Hit (6%)
    },
  },

  Hexfire: {
    description:
      "Hexfire<br>Shamshir<br>Base Melee Range: 2<br>Base Maximum Sockets: 3<br>One-Hand Damage: 77 to 145, Avg 111<br>Required Strength: 58<br>Required Dexterity: 58<br>Required Level: 33<br>+3 to Fire Skills<br>+25% Faster Cast Rate<br>+200% Enhanced Damage<br>Adds 35-40 Damage<br>Ignore Target's Defense<br>+5% to Maximum Fire Resist<br>Fire Resist +25%<br>",
    properties: {
      onehandmin: 77, // One-Hand Damage Min
      onehandmax: 145, // One-Hand Damage Max
      reqstr: 58, // Required Strength
      reqdex: 58, // Required Dexterity
      reqlvl: 33, // Required Level
      edmg: 200, // Enhanced Damage (200%)
      firemaxresist: 5, // Maximum Fire Resist (+5%)
      fireresist: 25, // Fire Resist (+25%)
    },
  },

  "Blade of Ali Baba": {
    description:
      "Blade of Ali Baba<br>Tulwar<br>Base Melee Range: 2<br>Base Maximum Sockets: 3<br>One-Hand Damage: 50 to 110, Avg 80<br>Required Strength: 70<br>Required Dexterity: 42<br>Required Level: 35<br>+120% Enhanced Damage<br>+15 to Dexterity<br>+15 to Mana<br>[2-247]% Extra Gold from Monsters (2.5% per Character Level)<br>[1-99]% Better Chance of Getting Magic Items (1% per Character Level)<br>Socketed (3)<br>",
    properties: {
      onehandmin: 50, // One-Hand Damage Min
      onehandmax: 110, // One-Hand Damage Max
      reqstr: 70, // Required Strength
      reqdex: 42, // Required Dexterity
      reqlvl: 35, // Required Level
      edmg: 120, // Enhanced Damage (120%)
      toatt: 15, // Attack Rating Bonus (15)
      tomana: 15, // Mana Bonus (15)
    },
  },

  "Ginther's Rift": {
    description:
      "Ginther's Rift<br>Dimensional Blade<br>Base Melee Range: 2<br>One-Hand Damage: 63 to 178, Avg 120.5<br>Required Strength: 85<br>Required Dexterity: 60<br>Required Level: 37<br>+30% Increased Attack Speed<br>+250% Enhanced Damage<br>Adds 75-180 Magic Damage<br>Magic Damage Taken Reduced by 12<br>Repairs 1 Durability in 5 Seconds<br>+40 Durability<br>",
    properties: {
      onehandmin: 63, // One-Hand Damage Min
      onehandmax: 178, // One-Hand Damage Max
      reqstr: 85, // Required Strength
      reqdex: 60, // Required Dexterity
      reqlvl: 37, // Required Level
      ias: 30, // Increased Attack Speed (30%)
      edmg: 250, // Enhanced Damage (250%)
    },
  },

  Headstriker: {
    description:
      "Headstriker<br>Battle Sword<br>Base Melee Range: 2<br>One-Hand Damage: 69 to 243, Avg 156<br>Required Strength: 92<br>Required Dexterity: 43<br>Required Level: 39<br>+20% Increased Attack Speed<br>+200% Enhanced Damage<br>+[1-99] to Maximum Damage (+1 per Character Level)<br>15% Maximum Deadly Strike<br>[0-74]% Deadly Strike (0.75% per Character Level)<br>Prevent Monster Heal<br>+15 to Strength<br>",
    properties: {
      onehandmin: 69, // One-Hand Damage Min
      onehandmax: 243, // One-Hand Damage Max
      reqstr: 92, // Required Strength
      reqdex: 43, // Required Dexterity
      reqlvl: 39, // Required Level
      ias: 20, // Increased Attack Speed (20%)
      edmg: 200, // Enhanced Damage (200%)
      tomaxdmg: 1, // Maximum Damage Bonus (+1 per Character Level)
      maxdeadlystrike: 15, // Maximum Deadly Strike (+15%)
    },
  },

  "Steel": {
  description:
    "Steel<br>Short Sword<br>One-Hand Damage: 5 to 11<br>Required Strength: 27<br>Required Dexterity: 28<br>Required Level: 13<br>+25% Increased Attack Speed<br>+20% Enhanced Damage<br>+3 to Minimum Damage<br>+3 to Maximum Damage<br>+50 to Attack Rating<br>+50% Chance of Open Wounds<br>+1 to Light Radius<br>Socketed (2)",
  properties: {
    onehandmin: 5,
    onehandmax: 11,
    reqstr: 27,
    reqdex: 28,
    reqlvl: 13,
    ias: 25,
    edmg: 20,
    mindmg: 3,
    maxdmg: 3,
    toatt: 50,
    openwounds: 50,
    socketed: true,
    socketCount: 2
  }
},

"Nadir": {
  description:
    "Nadir<br>Cap<br>Defense: 5<br>Required Strength: 0<br>Required Dexterity: 0<br>Required Level: 13<br>+5 to Strength<br>-33% Extra Gold from Monsters<br>+6 to Mana after each Kill<br>-3 to Light Radius<br>Socketed (2)",
  properties: {
    defense: 5,
    reqlvl: 13,
    goldfind: -33,
    str: 5,
    socketed: true,
    socketCount: 2
    }
},
  //shields/

  "Pelta Lunata": {
    description:
      "Pelta Lunata<br>Buckler<br>Base Smite Damage: 1 to 3, Avg 2<br>Base Maximum Sockets: 1 (2 for upgraded elite versions)<br>Defense: 39<br>Block: 40% (Dru/Nec/Sor), 45% (Ama/Ass/Bar), 50% (Pal)<br>Required Strength: 12<br>Required Level: 2<br>+40% Faster Block Rate<br>20% Increased Chance of Blocking<br>+40% Enhanced Defense<br>+30 Defense<br>+2 to Strength<br>+10 to Vitality<br>+10 to Energy<br>",
    properties: {
      smitedmgmin: 1,
      smitedmgmax: 3,
      defense: 39,
      reqstr: 12,
      reqlvl: 2,
      block1: 40,
      fbr: 40,
      block: 20,
      edef: 40,
      todef: 30,
      str: 2,
      vit: 10,
      enr: 10,
      dur: 12,
    },
  },

  "Umbral Disk": {
    description:
      "Umbral Disk<br>Small Shield<br>Base Smite Damage: 2 to 3, Avg 2.5<br>Defense: 46<br>Block: 55% (Dru/Nec/Sor), 60% (Ama/Ass/Bar), 65% (Pal)<br>Required Strength: 22<br>Required Level: 9<br>30% Increased Chance of Blocking<br>Adds 4-8 Damage<br>Hit Blinds Target<br>+50% Enhanced Defense<br>+30 Defense<br>+10 to Dexterity<br>+20 to Life<br>",
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
      "Swordback Hold<br>Spiked Shield<br>Base Smite Damage: 9 to 16, Avg 12.5<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 51<br>Block: 50% (Dru/Nec/Sor), 55% (Ama/Ass/Bar), 60% (Pal)<br>Required Strength: 30<br>Required Level: 15<br>20% Increased Chance of Blocking<br>50% Chance of Open Wounds<br>+8 Open Wounds Damage per Second<br>+60% Enhanced Defense<br>+10 Defense<br>Attacker Takes Damage of 32<br>",
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
      "Steelclash<br>Kite Shield<br>Base Smite Damage: 4 to 11, Avg 7.5<br>Defense: 58<br>Block: 53% (Dru/Nec/Sor), 58% (Ama/Ass/Bar), 63% (Pal)<br>Required Strength: 47<br>Required Level: 17<br>+1 to All Skills<br>+20% Faster Block Rate<br>25% Increased Chance of Blocking<br>+100% Enhanced Defense<br>+20 Defense<br>All Resistances +10<br>+3 to Light Radius<br>+20 Durability<br>",
    properties: {
      smitedmgmin: 4,
      smitedmgmax: 11,
    },
  },

  "Wall of the Eyeless": {
    description:
      "Wall of the Eyeless<br>Bone Shield<br>Base Smite Damage: 5 to 10, Avg 7.5<br>Base Maximum Sockets: 2 (3 for upgraded elite versions)<br>Defense: 53<br>Block: 40% (Dru/Nec/Sor), 45% (Ama/Ass/Bar), 50% (Pal)<br>Required Strength: 25<br>Required Level: 20<br>+20% Faster Cast Rate<br>3% Mana Stolen per Hit<br>+40% Enhanced Defense<br>+10 Defense<br>Cold Resist +20%<br>Fire Resist +20%<br>Poison Resist +20%<br>+5 to Mana after each Kill<br>",
    properties: {
      smitedmgmin: 5,
      smitedmgmax: 10,
      defense: 53,
    },
  },

  "Bverrit Keep": {
    description:
      "Bverrit Keep<br>Tower Shield<br>Base Smite Damage: 5 to 23, Avg 14<br>Defense: 87<br>Block: 54% (Dru/Nec/Sor), 59% (Ama/Ass/Bar), 64% (Pal)<br>Required Strength: 75<br>Required Level: 19<br>10% Increased Chance of Blocking<br>+120% Enhanced Defense<br>+30 Defense<br>+15 to Strength<br>Fire Resist +50%<br>Physical Damage Taken Reduced by 10%<br>Magic Damage Taken Reduced by 5<br>+100 Durability<br>",
    properties: {
      smitedmgmin: 2,
      smitedmgmax: 3,
      defense: 46,
      block1: 55,
    },
  },

  "The Ward": {
    description:
      "The Ward<br>Gothic Shield<br>Base Smite Damage: 4 to 11, Avg 7.5<br>Defense: 112<br>Block: 46% (Dru/Nec/Sor), 51% (Ama/Ass/Bar), 56% (Pal)<br>Required Strength: 60<br>Required Level: 26<br>10% Increased Chance of Blocking<br>+100% Enhanced Defense<br>+40 Defense<br>+10 to Strength<br>All Resistances +50<br>Magic Damage Taken Reduced by 2<br>",
    properties: {
      smitedmgmin: 4,
      smitedmgmax: 11,
      defense: 112,
      block1: 46,
    },
  },

  Visceratuant: {
    description:
      "Visceratuant<br>Defender<br>Base Smite Damage: 10 to 15, Avg 12.5<br>Base Maximum Sockets: 1 (2 for upgraded versions)<br>Defense: 125<br>Block: 60% (Dru/Nec/Sor), 65% (Ama/Ass/Bar), 70% (Pal)<br>Required Strength: 38<br>Required Level: 28<br>+1 to Sorceress Skills<br>+30% Faster Block Rate<br>30% Increased Chance of Blocking<br>+10% to Lightning Skill Damage<br>+150% Enhanced Defense<br>Attacker Takes Lightning Damage of 50<br>",
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
      "The Hand of Broc<br>Leather Gloves<br>Defense: 14<br>Required Level: 5<br>Melee Attacks Deal Splash Damage<br>+30% Enhanced Damage<br>3% Mana Stolen per Hit<br>3% Life Stolen per Hit<br>+20% Enhanced Defense<br>+10 Defense<br>+20 to Mana<br>Poison Resist +10%<br>",
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
      "Bloodfist<br>Heavy Gloves<br>Defense: 18<br>Required Level: 9<br>Melee Attacks Deal Splash Damage<br>+10% Increased Attack Speed<br>+30% Faster Hit Recovery<br>+10 to Maximum Damage<br>+20% Enhanced Defense<br>+10 Defense<br>+40 to Life<br>",
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
      "Chance Guards<br>Chain Gloves<br>Defense: 28<br>Required Strength: 25<br>Required Level: 15<br>+25 to Attack Rating<br>+30% Enhanced Defense<br>+15 Defense<br>+2 to Mana after each Kill<br>200% Extra Gold from Monsters<br>40% Better Chance of Getting Magic Items<br>+2 to Light Radius<br>",
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
      "Magefist<br>Light Gauntlets<br>Defense: 25<br>Required Strength: 45<br>Required Level: 23<br>+1 to Fire Skills<br>+20% Faster Cast Rate<br>Adds 6-36 Fire Damage<br>+30% Enhanced Defense<br>+10 Defense<br>Regenerate Mana 25%<br>",
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
      "Frostburn<br>Gauntlets<br>Defense: 62<br>Required Strength: 60<br>Required Level: 29<br>Adds 14-28 Fire Damage<br>Adds 6-22 Cold Damage<br>-10% to Enemy Fire Resistance<br>-10% to Enemy Cold Resistance<br>+40% Enhanced Defense<br>+40 Defense<br>Increase Maximum Mana 25%<br>",
    properties: {
      defense: 62,
      reqstr: 60,
      reqlvl: 29,
      firedmgmin: 14,
      firedmgmax: 28,
      colddmgmin: 6,
      colddmgmax: 22,
      firepierce: 10,
      coldpierce: 10,
      edef: 40,
      todef: 40,
      maxmana: 25,
    },
  },

  "Venom Grip": {
    description:
      "Venom Grip<br> Demonhide Gloves<br> Defense: 118<br> Required Strength: 20<br> Required Level: 29<br> 4% Life Stolen per Hit<br> +15% to Poison Skill Damage<br> 10% Chance of Crushing Blow<br> +160% Enhanced Defense<br> +25 Defense<br> +5% to Maximum Poison Resist<br> Poison Resist +30%<br>",
    properties: {
      defense: 118,
      reqstr: 20,
      reqlvl: 29,
      lleech: 4,
      poisondamage: 15,
      crushingblow: 10,
      edef: 160,
      todef: 25,
      maxpoisres: 5,
      poisres: 30,
    },
  },

  Gravepalm: {
    description:
      "Gravepalm<br> Sharkskin Gloves<br> Defense: 112<br> Required Strength: 20<br> Required Level: 32<br> +1 to Summoning Skills (Necromancer Only)<br> +200% Damage to Undead<br> +200 to Attack Rating against Undead<br> 15% Deadly Strike<br> +180% Enhanced Defense<br> +10 to Strength<br> +10 to Energy<br>",
    properties: {
      defense: 112,
      reqstr: 20,
      reqlvl: 32,
      summoningsk: 1,
      dmgtoun: 200,
      toatt: 200,
      deadlystrike: 15,
      edef: 180,
    },
  },

  Ghoulhide: {
    description:
      "Ghoulhide<br> Heavy Bracers<br> Defense: 130<br> Required Strength: 58<br> Required Level: 36<br> +20% Increased Attack Speed<br> +[2-198]% Damage to Undead (+2% per Character Level)<br> +[8-792] to Attack Rating against Undead (+8 per Character Level)<br> 5% Mana Stolen per Hit<br> +190% Enhanced Defense<br> +40 to Life<br>",
    properties: {
      defense: 130,
      reqstr: 58,
      reqlvl: 36,
      ias: 20,
      dmgtoun: 198,
      toatt: 792,
      mleech: 5,
      edef: 190,
      tolife: 40,
    },
  },

  "Lava Gout": {
    description:
      "Lava Gout<br> Battle Gauntlets<br> Defense: 144<br> Durability: 38<br> Required Strength: 88<br> Required Level: 42<br> 2% Chance to Cast Level 10 Enchant Fire on Striking<br> +20% Increased Attack Speed<br> Adds 26-92 Fire Damage<br> +200% Enhanced Defense<br> +5% to Maximum Fire Resist<br> Fire Resist +36%<br> Half Freeze Duration<br>",
    properties: {
      defense: 144,
      reqstr: 88,
      reqlvl: 42,
      ctcfireenchant: (2, 10), //nevim asi zle
      ias: 20,
      firedmgmin: 26,
      firedmgmax: 92,
      edef: 200,
      maxfireres: 5,
      firres: 36,
    },
  },

  Hellmouth: {
    description:
      "Hellmouth<br> War Gauntlets<br> Defense: 162<br> Durability: 39<br> Required Strength: 110<br> Required Level: 47<br> 8% Chance to Cast level 22 Molten Boulder on Striking<br> 4% Chance to Cast level 34 Meteor on Striking<br> Adds 30-144 Fire Damage<br> -10% to Enemy Fire Resistance<br> +200% Enhanced Defense<br> Attacker Takes Damage of 400<br>",
    properties: {
      defense: 162,
      reqstr: 110,
      reqlvl: 47,
      ctcmb: (8, 22), //nevim jak to tu delat
      ctcmeteor: (4, 34), //nevim jak to tu delat
      firedmgmin: 30,
      firedmgmax: 144,
      firepierce: 10,
      edef: 200,
      atdmg: 400,
    },
  },

  "Titan's Grip": {
    description:
      "Titan's Grip<br> Bramble Mitts<br> Defense: 176<br> Required Strength: 50<br> Required Level: 42<br> +20% Faster Block Rate<br> 20% Increased Chance of Blocking<br> +185% Enhanced Defense<br> +120 Defense vs. Missile<br> Lightning Resist +35%<br> Half Freeze Duration<br>",
    properties: {
      defense: 176,
      reqstr: 50,
      reqlvl: 42,
      fbr: 20,
      block: 20,
      edef: 185,
      todefmissile: 120,
      ligres: 35,
    },
  },

  "Dracul's Grasp": {
    description:
      "Dracul's Grasp<br> Vampirebone Gloves<br> Defense: 145<br> Required Strength: 50<br> Required Level: 76<br> 10% Increased Attack Speed<br> 12% Life Stolen per Hit<br> 25% Chance of Open Wounds<br> +320 Open Wounds Damage per Second<br> +120% Enhanced Defense<br> +30 to Strength<br> +10 Life after each Kill<br>",
    properties: {
      defense: 145,
      reqstr: 50,
      reqlvl: 76,
      ias: 10,
      lleech: 12,
      openwounds: 25,
      owdmg: 320,
      edef: 120,
      str: 30,
      laek: 10,
    },
  },

  "Soul Drainer": {
    description:
      "Soul Drainer<br>Vambraces<br>Defense: 149<br>Required Strength: 106<br>Required Level: 74<br>-5% to Enemy Physical Resistance<br>3% Mana Stolen per Hit<br>3% Life Stolen per Hit<br>-50 to Monster Defense per Hit<br>+120% Enhanced Defense<br>Drain Life -30<br>",
    properties: {
      defense: 149,
      reqstr: 106,
      reqlvl: 74,
      physpierce: 5,
      mleech: 3,
      lleech: 3,
      mondef: 50,
      edef: 120,
      repl: -30,
    },
  },

  Occultist: {
    description:
      "Occultist<br> Crusader Gauntlets<br> Defense: 138<br> Required Strength: 151<br> Required Level: 70<br> +20% Faster Cast Rate<br> 35% Reduced Curse Duration<br> Hit Blinds Target<br> 100% Enhanced Defense<br> Increase Maximum Mana 35%<br> ",
    properties: {
      defense: 138,
      reqstr: 151,
      reqlvl: 70,
      fcr: 20,
      cursedur: 35,
      blind: 1,
      edef: 100,
      maxmana: 35,
    },
  },

  Steelrend: {
    description:
      "Steelrend<br> Ogre Gauntlets<br> Defense: 281<br> Required Strength: 185<br> Required Level: 70<br> Melee Attacks Deal Splash Damage<br> +80% Enhanced Damage<br> 20% Chance of Crushing Blow<br> +210 Defense<br> +20 to Strength<br> Attacker Takes Damage of 250<br> ",
    properties: {
      defense: 281,
      reqstr: 185,
      reqlvl: 70,
      splash: 1,
      edmg: 80,
      cb: 20,
      todef: 210,
      str: 20,
      atdmg: 250,
    },
  },

  "Arctic Mitts": {
    description:
      "Arctic Mitts<br>Light Gauntlets<br>Defense: 11<br>Required Strength: 45<br>Required Level: 2<br>+10% Increased Attack Speed<br>+20 to Life<br>+50 to Attack Rating (2 Items)<br>+25% Chance to Pierce (2 Items)<br>+10 to Dexterity (3 Items)<br>",
    properties: {
      defense: 11,
      reqstr: 45,
      reqlvl: 2,
      ias: 10,
      tolife: 20,
      toatt: 50, //zase 2 items or so
      pierce: 25,
    },
  },

  "Cleglaw's Pincers": {
    description:
      "Cleglaw's Pincers<br>Chain Gloves<br>Defense: 9<br>Required Strength: 25<br>Required Level: 4<br>+15 Poison Damage over 3 Seconds<br>Slows Target by 25%<br>Knockback<br>+[10-990] to Attack Rating (+10 per Character Level) (2 Items)<br>",
    properties: {
      defense: 9,
      reqstr: 25,
      reqlvl: 4,
      poismin: 15,
      poismax: 15,
      slow: 25, //zase items 2
      knockback: 1,
    },
  },

  "Death's Hand": {
    description:
      "Death's Hand<br>Leather Gloves<br>Defense: 3<br>Required Level: 6<br>Poison Resist +50%<br>Poison Length Reduced by 45%<br>+30% Increased Attack Speed (2 Items)<br>+[0-49] to Maximum Damage (+0.5 per Character Level) (Complete Set)<br>",
    properties: {
      defense: 3,
      reqlvl: 6,
      poisres: 50,
      poislen: 45, //2 items tu je to asi blbe.. poislen???
      tomaxdmg: 49,
    },
  },

  "Sigon's Gage": {
    description:
      "Sigon's Gage<br>Gauntlets<br>Defense: 15<br>Required Strength: 60<br>Required Level: 6<br>+20 to Attack Rating<br>+10 to Strength<br>+30% Increased Attack Speed (2 Items)<br>",
    properties: {
      defense: 15,
      reqstr: 60,
      reqlvl: 6,
      toatt: 20, //2 items?
      str: 10,
    },
  },

  "Iratha's Cuff": {
    description:
      "Iratha's Cuff<br>Light Gauntlets<br>Defense: 11<br>Required Strength: 45<br>Required Level: 15<br>+20% Chance to Pierce<br>Cold Resist +20%<br>Half Freeze Duration<br>+20% Increased Attack Speed (2 Items)<br>",
    properties: {
      defense: 11,
      reqstr: 45,
      reqlvl: 15,
      pierce: 20,
      coldres: 20,
      coldlen: 1, //tu je halffreeze  a zas 3 items nebo tak
    },
  },

  "Sander's Taboo": {
    description:
      "Sander's Taboo<br>Heavy Gloves<br>Defense: 31<br>Required Level: 28<br>+20% Increased Attack Speed<br>Adds 27-33 Poison Damage over 3 Seconds<br>+25 Defense<br>+40 to Life<br>",
    properties: {
      defense: 31,
      reqlvl: 28,
      ias: 20,
      tomindmg: 27,
      tomaxdmg: 33,
      todef: 25, //zas 2 items
      tolife: 40,
    },
  },

  "Magnus' Skin": {
    description:
      "Magnus' Skin<br>Sharkskin Gloves<br>Defense: 60<br>Required Strength: 20<br>Required Level: 37<br>+20% Increased Attack Speed<br>+20% Chance to Pierce<br>+100 to Attack Rating<br>+50% Enhanced Defense<br>Fire Resist +15%<br>+3 to Light Radius<br>+150% Damage to Undead (3 Items)<br>",
    properties: {
      defense: 60,
      reqstr: 20,
      reqlvl: 37,
      ias: 20,
      pierce: 20,
      toatt: 100,
      edef: 50,
      firres: 15, //uzas 2i tems
    },
  },

  "Laying of Hands": {
    description:
      "Laying of Hands<br>Bramble Mitts<br>Defense: 112<br>Required Strength: 50<br>Required Level: 63<br>10% Chance to Cast Level 13 Holy Bolt on Striking<br>+20% Increased Attack Speed<br>+200% Damage to Demons<br>+50 Defense<br>Fire Resist +50%<br>+220 Poison Damage over 2 Seconds (2 Items)<br>",
    properties: {
      defense: 112,
      reqstr: 50,
      reqlvl: 63,
      ctcholybolt: (10, 13), //nevim jak to tu delat
      ias: 20,
      edmg: 200,
      todef: 50,
      firres: 50,
    },
  },

  "Immortal King's Forge": {
    description:
      "Immortal King's Forge<br>War Gauntlets<br>Defense: 143<br>Defense (3 Items): 263<br>Required Strength: 110<br>Required Level: 30<br>12% Chance to Cast Level 24 Charged Bolt when Struck<br>+90 Defense<br>+20 to Strength<br>+20 to Dexterity<br>+25% Increased Attack Speed (2 Items)<br>+120 Defense (3 Items)<br>10% Life Stolen per Hit (4 Items)<br>10% Mana Stolen per Hit (5 Items)<br>Freezes Target +2 (Complete Set)<br>",
    properties: {
      defense: 143,
      reqstr: 110,
      reqlvl: 30,
      ctccbolt: (12, 24), //nevim jak to tu delat
      todef: 90,
      str: 20,
      dex: 20,
    },
  },

  "M'avina's Icy Clutch": {
    description:
      "M'avina's Icy Clutch<br>Battle Gauntlets<br>Defense: 97<br>Required Strength: 88<br>Required Level: 32<br>Adds 12-36 Cold Damage<br>+50 Defense<br>+12 to Strength<br>+20 to Dexterity<br>Cannot Be Frozen<br>56% Extra Gold from Monsters<br>Adds 131-252 Cold Damage (4 Items)<br>+5% to Cold Skill Damage (Complete Set)<br>",
    properties: {
      defense: 97,
      reqstr: 88,
      reqlvl: 32,
      tomindmg: 12,
      tomaxdmg: 36,
      todef: 50,
      str: 12,
      dex: 20,
    },
  },

  "Trang-Oul's Claws": {
    description:
      "Trang-Oul's Claws<br>Heavy Bracers<br>Defense: 74<br>Required Strength: 58<br>Required Level: 45<br>+2 to Curses (Necromancer Only)<br>+20% Faster Cast Rate<br>+15% to Poison Skill Damage<br>+30 Defense<br>Cold Resist +30%<br>+20 to Meteor (4 Items)<br>",
    properties: {
      defense: 74,
      reqstr: 58,
      reqlvl: 45,
      curseskills: 1,
      cb: 20,
      todef: 210,
      str: 20,
      atdmg: 250, //vse checkuj, tyhle gloves uplne WRONG
      meteorosk: 20,
    },
  },
  //belts

  Lenymo: {
    description:
      "Lenymo<br>Sash<br>Defense: 2<br>Required Level: 7<br>+10% Faster Cast Rate<br>+15 to Mana<br>Regenerate Mana 30%<br>All Resistances +5<br>+1 to Light Radius<br>",
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
      "Snakecord<br>Light Belt<br>Defense: 15<br>Required Level: 12<br>+6% to Poison Skill Damage<br>+30% Enhanced Defense<br>+10 Defense<br>Replenish Life +15<br>Poison Resist +25%<br>Poison Length Reduced by 50%<br>",
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
      "Nightsmoke<br>Belt<br>Defense: 24<br>Required Strength: 25<br>Required Level: 20<br>+50% Enhanced Defense<br>+15 Defense<br>+20 to Mana<br>All Resistances +10<br>Physical Damage Taken Reduced by 2<br>50% Damage Taken Gained as Mana when Hit<br>",
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
      "Goldwrap<br>Heavy Belt<br>Defense: 36<br>Required Strength: 45<br>Required Level: 27<br>+20% Increased Attack Speed<br>+60% Enhanced Defense<br>+25 Defense<br>80% Extra Gold from Monsters<br>40% Better Chance of Getting Magic Items<br>+2 to Light Radius<br>",
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
      "String of Ears<br>Demonhide Sash<br>Defense: 113<br>Required Strength: 20<br>Required Level: 29<br>8% Life Stolen per Hit<br>+180% Enhanced Defense<br>+15 Defense<br>Physical Damage Taken Reduced by 15%<br>Magic Damage Taken Reduced by 15<br>+10 Durability<br>",
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

  Razortail: {
    description:
      "Razortail<br> Sharkskin Belt<br> Defense: 107<br> Required Strength: 20<br> Required Level: 32<br> +33% Chance to Pierce<br> +20 to Maximum Damage<br> +150% Enhance Defense<br> +50 Defense<br> +20 to Dexterity<br> Attacker Takes Damage of [1-99] (1 per Character Level)<br>",
    properties: {
      defense: 107,
      reqstr: 20,
      reqlvl: 32,
      pierce: 33,
      tomaxdmg: 20,
      edef: 150,
      todef: 50,
      dex: 20,
      atdmg: 99,
    },
  },

  "Gloom's Trap": {
    description:
      "Gloom's Trap<br> Mesh Belt<br> Defense: 102<br> Required Strength: 58<br> Required Level: 36<br> +20% Faster Cast Rate<br> 5% Mana Stolen per Hit<br> +150% Enhanced Defense<br> +15 to Vitality<br> Increase Maximum Mana 15%<br> Regenerate Mana 15%<br> -3 to Light Radius<br>",
    properties: {
      defense: 102,
      reqstr: 58,
      reqlvl: 36,
      fcr: 20,
      mleech: 5,
      edef: 150,
      vit: 15,
      maxmana: 15,
      regmana: 15,
      ligrad: 3,
    },
  },

  Snowclash: {
    description:
      "Snowclash<br> Battle Belt<br> Defense: 116<br> Required Strength: 88<br> Required Level: 42<br> 5% Chance to Cast Level 20 Blizzard when Struck<br> +2 to Cold Skills<br> Adds 39-63 Cold Damage<br> +170% Enhanced Defense<br> +8% to Maximum Cold Resist<br> Cold Resist +45%<br> Half Freeze Duration<br>",
    properties: {
      defense: 116,
      reqstr: 88,
      reqlvl: 42,
      ctcblizzard: (5, 20), //zase zle
      coldsk: 2,
      colddmgmin: 39,
      colddmgmax: 63,
      edef: 170,
      maxcoldres: 8,
      coldres: 45,
    },
  },

  "Thundergod's Vigor": {
    description:
      "Thundergod's Vigor<br>War Belt<br>Defense: 159<br>Required Strength: 110<br>Required Level:47<br>5% Chance to Cast Level 17 Fist of the Heavens when Struck<br>+2 to Lightning Skills<br>Adds 1 to 250 Lightning Damage<br>+200% Enhanced Defense<br>+15 to Strength<br> +15 to Vitality<br>+8% to Maximum Lightning Resist<br>",
    properties: {
      defense: 159,
      reqstr: 110,
      reqlvl: 47,
      ctcfist: (5, 17), //tu vse zle
      lightsk: 2,
      lightdmgmin: 1,
      lightdmgmax: 250,
      edef: 200,
      str: 15,
      vit: 15,
      maxlightres: 8,
    },
  },

  "Arachnid Mesh": {
    description:
      "Arachnid Mesh<br>Spiderweb Sash<br>Defense: 138<br>Required Strength: 50<br>Required Level: 80<br>+1 to All Skills<br>+20% Faster Cast Rate<br>Slows Target by 20%<br>+120% Enhanced Defense<br>Increase Maximum Mana 10%<br>Level 3 Venom (31 Charges)<br>",
    properties: {
      defense: 138,
      reqstr: 50,
      reqlvl: 80,
      allskills: 1,
      fcr: 20,
      slow: 20,
      edef: 120,
      maxmana: 10,
      venomcharges: 3,
    },
  },

  "Nosferatu's Coil": {
    description:
      "Nosferatu's Coil<br>Vampirefang Belt<br>Defense: 63<br>Required Strength: 50<br>Required Level: 51<br>+20% Increased Attack Speed<br>6% Life Stolen per Hit<br>10% Deadly Strike<br>Slows Target by 10%<br>+15 to Strength<br>+2 to Mana after each Kill<br>",
    properties: {
      defense: 63,
      reqstr: 50,
      reqlvl: 51,
      ias: 20,
      lleech: 6,
      deadlystrike: 10,
      slow: 10,
      str: 15,
      maek: 2,
    },
  },

  "Verdungo's Hearty Cord": {
    description:
      "Verdungo's Hearty Cord<br>Mithril Coil<br>Defense: 158<br>Required Strength: 106<br>Required Level: 63<br>+10% Faster Hit Recovery<br>+140% Enhanced Defense<br>+40 to Vitality<br>Replenish Life +13<br>+120 Maximum Stamina<br>Physical Damage Taken Reduced by 15%<br>",
    properties: {
      defense: 158,
      reqstr: 106,
      reqlvl: 63,
      fhr: 10,
      edef: 140,
      vit: 40,
      repl: 13,
      maxstamina: 120,
      pdr: 15,
    },
  },

  "Band of Skulls": {
    description:
      "Band of Skulls<br>Troll Belt<br>Defense: 167<br>Required Strength: 151<br>Required Level: 90<br>6% Chance to Cast Level 28 Bone Armor when Struck<br>+150% Enhanced Defense<br>Physical Damage Taken Reduced by 10%<br>+30% Better Chance of Getting Magic Items<br>-4 to Light Radius<br>Socketed (1)<br>",
    properties: {
      defense: 138,
      reqstr: 50,
      reqlvl: 80,
      allskills: 1,
      fcr: 20,
      slow: 20,
      edef: 120,
      maxmana: 10,
      venomcharges: 3,
    },
  },

  "Arctic Binding": {
    description:
      "Arctic Binding<br>Light Belt<br>Defense: 33<br>Required Level: 2<br>+30 Defense<br>Cold Resist +40%<br>40% Better Chance of Getting Magic Items (2 Items)<br>Cold Resist +10% (3 Items)<br>",
    properties: {
      defense: 33,
      reqlvl: 2,
      todef: 30,
      coldres: 40,
      magicfindx: 40,
      coldresx: 10,
    },
  },

  "Hsarus' Iron Stay": {
    description:
      "Hsarus' Iron Stay<br>Belt<br>Defense: 5<br>Defense (2 Items): 7-252<br>Required Strength: 25<br>Required Level: 3<br>+20 to Life<br>Cold Resist +20%<br>+[2-247] Defense (+2.5 per Character Level) (2 Items)<br>",
    properties: {
      defense: 5,
      defensex: 252,
      reqstr: 25,
      reqlvl: 3,
      tolife: 20,
      coldres: 20,
      defensex: 247,
    },
  },

  "Infernal Sign": {
    description:
      "Infernal Sign<br>Heavy Belt<br>Defense: 31<br>Required Strength: 45<br>Required Level: 5<br>+25 Defense<br>+20 to Life<br>Poison Resist +45% (2 Items)<br>Cannot Be Frozen (Complete Set)<br>",
    properties: {
      defense: 31,
      reqstr: 45,
      reqlvl: 5,
      todef: 25,
      tolife: 20,
      poisres: 45, //tu jeste něcochybi
    },
  },

  "Death's Guard": {
    description:
      "Death's Guard<br>Sash<br>Defense: 22<br>Required Level: 6<br>+20 Defense<br>Cannot Be Frozen<br>All Resistances +15 (2 Items)<br>",
    properties: {
      defense: 22,
      reqlvl: 6,
      todef: 20,
      allres: 15, //2 items zase
    },
  },

  "Sigon's Wrap": {
    description:
      "Sigon's Wrap<br>Plated Belt<br>Defense: 8-11<br>Defense (2 Items): 10-209<br>Required Strength: 60<br>Required Level: 6<br>+20 to Life<br>Fire Resist +20%<br>+[2-198] Defense (+2 per Character Level) (2 Items)<br>",
    properties: {
      defense: 8,
      defensex: 11,
      reqstr: 60,
      reqlvl: 6,
      tolife: 20,
      fireres: 20,
      defensex: 198, //checkitout
    },
  },

  "Iratha's Cord": {
    description:
      "Iratha's Cord<br>Heavy Belt<br>Defense: 31<br>Required Strength: 45<br>Required Level: 15<br>+5 to Minimum Damage<br>+25 Defense<br>+10 to Dexterity (2 Items)<br>+10 to Maximum Damage (3 Items)<br>",
    properties: {
      defense: 31,
      reqstr: 45,
      reqlvl: 15,
      tomindmg: 5,
      todef: 25,
      dex: 10, //2 items
      tomaxdmg: 10, //3 items
    },
  },

  "Hwanin's Blessing": {
    description:
      "Hwanin's Blessing<br>Belt<br>Defense: 6-153<br>Required Strength: 25<br>Required Level: 35<br>Adds 3-330 Lightning Damage<br>Prevent Monster Heal<br>+[1-148] Defense (+1.5 per Character Level)<br>Lightning Absorb 6%<br>12% Damage Taken Gained as Mana when Hit<br>",
    properties: {
      defense: 6,
      defensex: 153,
      reqstr: 25,
      reqlvl: 35,
      lightdmgmin: 3,
      lightdmgmax: 330,
      edef: 0, //nevim tady je to spatně
      preventheal: 1,
      lightningabsorb: 6,
      dmgtomana: 12,
    },
  },

  "Wilhelm's Pride": {
    description:
      "Wilhelm's Pride<br>Battle Belt<br>Defense: 75<br>Required Strength: 88<br>Required Level: 42<br>6% Mana Stolen per Hit<br>6% Life Stolen per Hit<br>+75% Enhanced Defense<br>Cold Resist +20%<br>+150% Damage to Demons (3 Items)<br>",
    properties: {
      defense: 75,
      reqstr: 88,
      reqlvl: 42,
      lleech: 6,
      edef: 75,
      coldres: 20,
      dmgtodem: 150, //3 items
    },
  },

  Credendum: {
    description:
      "Credendum<br>Mithril Coil<br>Defense: 115<br>Required Strength: 106<br>Required Level: 65<br>+50 Defense<br>+10 to Strength<br>+10 to Dexterity<br>All Resistances +15<br>+20% Faster Hit Recovery (3 Items)<br>",
    properties: {
      defense: 115,
      reqstr: 106,
      reqlvl: 65,
      todef: 50,
      str: 10,
      dex: 10,
      allres: 15,
    },
  },

  "Immortal King's Detail": {
    description:
      "Immortal King's Detail<br>War Belt<br>Defense: 109<br>Defense (2 Items): 186-214<br>Defense (4 Items): 239-267<br>Required Strength: 110<br>Required Level: 29<br>+56 Defense<br>+25 to Strength<br>Lightning Resist +33%<br>Fire Resist +28%<br>+105 Defense (2 Items)<br>+25% Faster Hit Recovery (3 Items)<br>+100% Enhanced Defense (4 Items)<br>Physical Damage Taken Reduced by 20% (5 Items)<br>+2 to Masteries (Barbarian Only) (Complete Set)<br>",
    properties: {
      defense: 109,
      defensex: 186,
      reqstr: 110,
      reqlvl: 29,
      todef: 56,
      str: 25,
      lightres: 33,
      fireres: 28,
      defensex2: 105, //2 items
      fhr3: 25, //3 items
      edef4: 100, //4 items
      pdr5: 20, //5 items
    },
  },
  //boots

  Hotspur: {
    description:
      "Hotspur<br>Boots<br>Base Kick Damage: 3 to 8, Avg 5.5<br>Defense: 10<br>Required Level: 5<br>Adds 3-6 Fire Damage<br>+20% Enhanced Defense<br>+6 Defense<br>+15 to Life<br>+6% to Maximum Fire Resist<br>Fire Resist +30%<br>",
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
      "Gorefoot<br>Heavy Boots<br>Base Kick Damage: 4 to 12, Avg 8<br>Defense: 9<br>Required Strength: 18<br>Required Level: 12<br>+25% Faster Run/Walk<br>+30% Leap and Leap Attack Movement Speed<br>+2 to Leap (Barbarian Only)<br>4% Mana Stolen per Hit<br>+30% Enhanced Defense<br>",
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
      "Treads of Cthon<br>Chain Boots<br>Base Kick Damage: 6 to 14, Avg 10 (was 6 to 12, Avg 9)<br>Defense: 26<br>Required Strength: 30<br>Required Level: 15<br>+30% Faster Run/Walk<br>+20% Chance to Pierce<br>+40% Enhanced Defense<br>+12 Defense<br>+50 Defense vs. Missile<br>+30 to Life<br>50% Slower Stamina Drain<br>",
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
      "Goblin Toe<br>Light Plated Boots<br>Base Kick Damage: 8 to 18, Avg 13<br>Defense: 34<br>Required Strength: 50<br>Required Level: 22<br>+20% Faster Run/Walk<br>+30% Enhanced Damage<br>25% Chance of Crushing Blow<br>+60% Enhanced Defense<br>+15 Defense<br>Physical Damage Taken Reduced by 5<br>Magic Damage Taken Reduced by 5<br>",
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
      "Tearhaunch<br>Greaves<br>Base Kick Damage: 10 to 20, Avg 15<br>Defense: 63<br>Required Strength: 70<br>Required Level: 29<br>+2 to Defensive Auras (Paladin Only)<br>+20% Faster Run/Walk<br>+2 to Vigor (Paladin Only)<br>+80% Enhanced Defense<br>+35 Defense<br>+10 to Strength<br>+10 to Dexterity<br>All Resistances +10<br>",
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
      "Infernostride<br>Demonhide Boots<br>Base Kick Damage: 30 to 64, Avg 47<br>Defense: 105<br>Required Strength: 20<br>Required Level: 29<br>18% Chance to Cast Level 16 Blaze when Struck<br>+30% Faster Run/Walk<br>Adds 24-66 Fire Damage<br>+150% Enhanced Defense<br>+15 Defense<br>+5% to Maximum Fire Resist<br> Fire Resist +30%<br>70 Extra Gold from Monsters<br>+2 to Light Radius<br>",
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

  Waterwalk: {
    description:
      "Waterwalk<br>Sharkskin Boots<br>Base Kick Damage: 32 to 72, Avg 52<br>Defense: 124<br>Required Strength: 47<br>Required Level: 32<br>+30% Faster Run/Walk<br>+20% Faster Block Rate<br>+210% Enhanced Defense<br>+15 to Dexterity<br>+65 to Life<br>+40 Maximum Stamina<br>Heal Stamina Plus 50%<br>+5% to Maximum Fire Resist<br>",
    properties: {
      kickmin: 32,
      kickmax: 72,
      defense: 124,
      reqstr: 47,
      reqlvl: 32,
      frw: 30,
      fbr: 20,
      edef: 210,
      dex: 15,
      tolife: 65,
      maxstamina: 40,
      healstamina: 50,
      maxfirres: 5,
    },
  },

  Silkweave: {
    description:
      "Silkweave<br>Mesh Boots<br>Base Kick Damage: 35 to 78, Avg 56.5<br>Defense: 130<br>Required Strength: 65<br>Required Level: 36<br>+30% Faster Run/Walk<br>+190% Enhanced Defense<br>+200 Defense vs. Missile<br>Increase Maximum Mana 20%<br>+5 to Mana after each Kill<br>",
    properties: {
      kickmin: 35,
      kickmax: 78,
      defense: 130,
      reqstr: 65,
      reqlvl: 36,
      frw: 30,
      edef: 190,
      todefmissile: 200,
      maxmana: 20,
      maek: 5,
    },
  },

  "War Traveler": {
    description:
      "War Traveler<br>Battle Boots<br>Base Kick Damage: 42 to 84, Avg 63<br>Defense: 139<br>Durability: 48<br>Required Strength: 95<br>Required Level: 42<br>+25% Faster Run/Walk<br>Adds 15-25 Damage<br>+190% Enhanced Defense<br>+10 to Strength<br>+10 to Vitality<br>40% Slower Stamina Drain<br>Attacker Takes Damage of 10<br>50% Better Chance of Getting Magic Items<br>",
    properties: {
      kickmin: 42,
      kickmax: 84,
      defense: 139,
      reqstr: 95,
      reqlvl: 42,
      frw: 25,
      edmgmin: 15,
      edmgmax: 25,
      edef: 190,
      str: 10,
      vit: 10,
      stamdrain: 40,
      atdmg: 10,
      magicfind: 50,
    },
  },

  "Gore Rider": {
    description:
      "Gore Rider<br>War Boots<br>Base Kick Damage: 45 to 90, Avg 67.5<br>Defense: 162<br>Durability: 34<br>Required Strength: 94<br>Required Level: 47<br>+30% Faster Run/Walk<br>15% Chance of Crushing Blow<br>+20% Deadly Strike<br>10% Chance of Open Wounds<br>+200 Open Wounds Damage per Second<br>+200% Enhanced Defense<br>Requirements -25%<br>",
    properties: {
      kickmin: 45,
      kickmax: 90,
      defense: 162,
      reqstr: 94,
      reqlvl: 47,
      frw: 30,
      cb: 15,
      deadlystrike: 20,
      openwounds: 10,
      owdmg: 200,
      edef: 200,
      reqreduced: 25,
    },
  },

  "Merman's Sprocket": {
    description:
      "Merman's Sprocket<br>Wyrmhide Boots<br>Base Kick Damage: 75 to 100, Avg 87.5<br>Defense: 162<br>Required Strength: 50<br>Required Level: 45<br>Minimum Item Level: 60<br>+60% Faster Run/Walk<br>Adds 40-80 Cold Damage<br>+100 Defense<br>Regenerate Mana 20%<br>+100 Maximum Stamina<br>50% Slower Stamina Drain<br>",
    properties: {
      kickmin: 75,
      kickmax: 100,
      defense: 162,
      reqstr: 50,
      reqlvl: 45,
      minlvl: 60,
      frw: 60,
      colddmgmin: 40,
      colddmgmax: 80,
      todef: 100,
      regmana: 20,
      maxstamina: 100,
      stamdrain: 50,
    },
  },

  "Sandstorm Trek": {
    description:
      "Sandstorm Trek<br>Scarabshell Boots<br>Base Kick Damage: 70 to 110, Avg 90<br>Defense: 178<br>Required Strength: 91<br>Required Level: 64<br>+30% Faster Run/Walk<br>+20% Faster Hit Recovery<br>+170% Enhanced Defense<br>+15 to Strength<br>+15 to Vitality<br>+[1-99] Maximum Stamina (+1 per Character Level)<br>50% Slower Stamina Drain<br>Poison Resist +70%<br>Attacker Takes Damage of 540<br>Repairs 1 Durability in 10 Seconds<br>",
    properties: {
      kickmin: 70,
      kickmax: 110,
      defense: 178,
      reqstr: 91,
      reqlvl: 64,
      frw: 30,
      fhr: 20,
      edef: 170,
      str: 15,
      vit: 15,
      maxstamina: 99,
      stamdrain: 50,
      poisres: 70,
      atdmg: 540,
      repdur: 10,
    },
  },

  Marrowwalk: {
    description:
      "Marrowwalk<br>Boneweave Boots<br>Base Kick Damage: 80 to 125, Avg 102.5<br>Defense: 204<br>Required Strength: 118<br>Required Level: 66<br>+20% Faster Run/Walk<br>+2 to Skeleton Mastery (Necromancer Only)<br>+200% Enhanced Defense<br>+20 to Strength<br>+17 to Dexterity<br>Regenerate Mana 20%<br>Heal Stamina Plus 10%<br>Cannot Be Frozen<br>",
    properties: {
      kickmin: 80,
      kickmax: 125,
      defense: 204,
      reqstr: 118,
      reqlvl: 66,
      frw: 20,
      skeletonmasterysk: 2,
      edef: 200,
      str: 20,
      dex: 17,
      regmana: 20,
      healstamina: 10,
      cbf: 1,
    },
  },

  "Shadow Dancer": {
    description:
      "Shadow Dancer<br>Myrmidon Greaves<br>Base Kick Damage: 83 to 155, Avg 119<br>Defense: 144<br>Required Strength: 167<br>Required Level: 71<br>+2 to Shadow Disciplines<br>+30% Faster Run/Walk<br>+30% Faster Hit Recovery<br>+100% Enhanced Defense<br>+30 to Dexterity<br>Curse Resistance +10%<br>Requirements -25%<br>",
    properties: {
      kickmin: 83,
      kickmax: 155,
      defense: 144,
      reqstr: 167,
      reqlvl: 71,
      shadowdisciplineskills: 2,
      frw: 30,
      fhr: 30,
      edef: 100,
      dex: 30,
      cursres: 10,
      req: -25,
    },
  },

  "Itherael's Path": {
    description:
      "Itherael's Path<br>Mirrored Boots<br>Base Kick Damage: 69 to 147, Avg 108<br>Defense: 128<br>Required Strength: 163<br>Required Level: 85<br>+20% Faster Run/Walk<br>+20% Faster Cast Rate<br>+20% Faster Hit Recovery<br>+60 Defense<br>+15 to Dexterity<br>+15 to Vitality<br>",
    properties: {
      kickmin: 69,
      kickmax: 147,
      defense: 128,
      reqstr: 163,
      reqlvl: 85,
      frw: 20,
      fcr: 20,
      fhr: 20,
      todef: 60,
      dex: 15,
      vit: 15,
    },
  },

  "Hsarus' Iron Heel": {
    description:
      "Hsarus' Iron Heel<br>Chain Boots<br>Base Kick Damage: 6 to 14, Avg 10 (was 6 to 12, Avg 9)<br>Defense: 9<br>Required Strength: 30<br>Required Level: 3<br>+20% Faster Run/Walk<br>Fire Resist +25%<br>+[10-990] to Attack Rating (+10 per Character Level) (2 Items)<br>",
    properties: {
      kickmin: 6,
      kickmax: 14,
      defense: 9,
      reqstr: 30,
      reqlvl: 3,
      frw: 20,
      firres: 25,
    },
  },

  "Sigon's Sabot": {
    description:
      "Sigon's Sabot<br>Greaves<br>Base Kick Damage: 10 to 20, Avg 15<br>Defense: 15<br>Required Strength: 70<br>Required Level: 6<br>+20% Faster Run/Walk<br>Cold Resist +40%<br>+50 to Attack Rating (2 Items)<br>50% Better Chance of Getting Magic Items (3 Item)<br>",
    properties: {
      kickmin: 10,
      kickmax: 20,
      defense: 15,
      reqstr: 70,
      reqlvl: 6,
      frw: 20,
      coldres: 40,
    },
  },

  "Vidala's Fetlock": {
    description:
      "Vidala's Fetlock<br>Light Plated Boots<br>Base Kick Damage: 8 to 18, Avg 13<br>Defense: 11<br>Required Strength: 50<br>Required Level: 14<br>+30% Faster Run/Walk<br>+150 Maximum Stamina<br>All Resistances +8 (2 Items)<br>",
    properties: {
      kickmin: 8,
      kickmax: 18,
      defense: 11,
      reqstr: 50,
      reqlvl: 14,
      frw: 30,
      maxstamina: 150,
    },
  },

  "Tancred's Hobnails": {
    description:
      "Tancred's Hobnails<br>Boots<br>Base Kick Damage: 3 to 8, Avg 5.5<br>Defense: 3<br>Required Level: 20<br>+20 to Dexterity<br>Heal Stamina Plus 25%<br>Physical Damage Taken Reduced by 10%<br>+30% Faster Run/Walk (2 Items)<br>+10 to Strength (3 Items)<br>",
    properties: {
      kickmin: 3,
      kickmax: 8,
      defense: 3,
      reqstr: 50,
      reqlvl: 14,
      frw: 30,
      maxstamina: 150,
      physdr: 10,
    },
  },

  "Cow King's Hooves": {
    description:
      "Cow King's Hooves<br>Heavy Boots<br>Base Defense: 6<br>Base Kick Damage: 4 to 12, Avg 8<br>Defense: 41<br>Required Strength: 18<br>Required Level: 13<br>+30% Faster Run/Walk<br>Adds 25-35 Fire Damage<br>+35 Defense<br>+20 to Dexterity<br>25% Better Chance of Getting Magic Items<br>",
    properties: {
      kickmin: 4,
      kickmax: 12,
      defense: 41,
      reqstr: 18,
      reqlvl: 13,
      frw: 30,
      firedmgmin: 25,
      firedmgmax: 35,
      todef: 35,
      dex: 20,
      magicfind: 25,
    },
  },

  "Sander's Riprap": {
    description:
      "Sander's Riprap<br>Heavy Boots<br>Base Kick Damage: 4 to 12, Avg 8<br>Defense: 6<br>Required Strength: 18<br>Required Level: 20<br>Minimum Item Level: 20<br>+40% Faster Run/Walk<br>+100 to Attack Rating<br>+5 to Strength<br>+10 to Dexterity<br>",
    properties: {
      kickmin: 4,
      kickmax: 12,
      defense: 6,
      reqstr: 18,
      reqlvl: 20,
      frw: 40,
      toatt: 100,
      str: 5,
      dex: 10,
    },
  },

  "Rite of Passage": {
    description:
      "Rite of Passage<br>Demonhide Boots<br>Base Defense: 35<br>Base Kick Damage: 30 to 64, Avg 47<br>Defense: 60<br>Required Strength: 20<br>Required Level: 29<br>+30% Faster Run/Walk<br>+25 Defense<br>+25 Maximum Stamina<br>Cannot Be Frozen<br>",
    properties: {
      kickmin: 30,
      kickmax: 64,
      defense: 60,
      reqstr: 20,
      reqlvl: 29,
      frw: 30,
      todef: 25,
      maxstamina: 25,
      cbf: 1,
    },
  },

  "Natalya's Soul": {
    description:
      "Natalya's Soul<br>Mesh Boots<br>Base Kick Damage: 35 to 78, Avg 56.5<br>Defense: 169<br>Durability: 66<br>Required Strength: 65<br>Required Level: 25<br>+40% Faster Run/Walk<br>+125 Defense<br>Heal Stamina Plus [0-24]% (0.25% per Character Level)<br>Cold Resist +25%<br>Lightning Resist +25%<br>+50 Durability<br>+30 Kick Damage (3 Items)<br>",
    properties: {
      kickmin: 35,
      kickmax: 78,
      defense: 169,
      reqstr: 65,
      reqlvl: 25,
      frw: 40,
      todef: 125,
      healstamina: 24,
      coldres: 25,
      lightres: 25,
    },
  },

  "Immortal King's Pillar": {
    description:
      "Immortal King's Pillar<br>War Boots<br>Base Kick Damage: 45 to 90, Avg 67.5<br>Defense: 138<br>Defense (4 Items): 298<br>Required Strength: 125<br>Required Level: 31<br>+40% Faster Run/Walk<br>+140 to Attack Rating<br>+85 Defense<br>+54 to Life<br>25% Better Chance of Getting Magic Items (2 Items)<br>+2 to Combat Skills (Barbarian Only) (3 Items)<br>+160 Defense (4 Items)<br>Half Freeze Duration (5 Items)<br>",
    properties: {
      kickmin: 45,
      kickmax: 90,
      defense: 138,
      reqstr: 125,
      reqlvl: 31,
      frw: 40,
      toatt: 140,
      todef: 85,
      tolife: 54,
      magicfind: 25,
    },
  },

  "Aldur's Advance": {
    description:
      "Aldur's Advance<br>Battle Boots<br>Base Kick Damage: 42 to 84, Avg 63<br>Defense: 47<br>Required Strength: 95<br>Required Level: 45<br>Indestructible<br>+40% Faster Run/Walk<br>+180 Maximum Stamina<br>10% Damage Taken Gained as Mana when Hit<br>Heal Stamina Plus 32%<br>+50 to Life<br>Fire Resist +50%<br>+15 to Dexterity (2 Items)<br>+15 to Dexterity (3 Items)<br>+15 to Dexterity (Complete Set)<br>",
    properties: {
      kickmin: 42,
      kickmax: 84,
      defense: 47,
      reqstr: 95,
      reqlvl: 45,
      frw: 40,
      maxstamina: 180,
      damagemanaperhit: 10,
      healstamina: 32,
      tolife: 50,
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
      coldabsorbpercent: 5,
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
      maxfirres: 3,
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
      "Highlord's Wrath<br>Amulet<br> Required Level: 65<br> +1 to All Skills<br> +20% Increased Attack Speed<br> Adds 1-300 Lightning Damage<br> [0-24]% Deadly Strike (0.25 per Character Level)<br> Lightning Resist +40%<br> Attacker Takes Lightning Damage of 150<br>",
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
