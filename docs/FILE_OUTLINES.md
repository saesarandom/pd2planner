# PD2 Planner — Master File Outlines
> **Purpose**: Antigravity uses this to navigate without reading large files whole.  
> Before ANY edit: check this file → find the target function line → `view_file` only that range.  
> Generated: 2026-04-15 | Update with `grep` after major refactors.

---

## HOW TO USE THIS FILE (Antigravity Workflow)

```
1. User asks to edit X
2. grep this file for function name → get line number
3. view_file(path, startLine-20, startLine+[function_length])
4. edit only the targeted range
5. Never read full files
```

**Token budget per file** (approximate lines):
- skills.js `9958 lines` | socket.js `6220+ lines` | itemUpgrade.js `6185+ lines`
- inventory.js `2869 lines` | corrupt.js `1953 lines` | main.js `2686 lines`
- craftedItems.js `1600+ lines` | character.js `1054 lines`

---

## socket.js (~6220 lines) — CENTRAL STAT ENGINE

```
class UnifiedSocketSystem                      L7
  constructor()                                L8
  init()                                      L290
  initializeSocketData()                      L317
  initializeJewelData()                       L911
  setInitialCharacterStats()                 L1306
  initializeSocketContainers()               L1330
  setupEventListeners()                      L1353
  clearAll()                                 L1501
  getMaxSocketsForSection(section)           L1541
  addSocket(section)                         L1591
  adjustSocketsForItem(section, ...)         L1637
  getSocketCount(section)                    L1787
  setSocketCount(section, targetCount)       L1801
  handleSocketClick(e)                       L1834
  clearSocket(socket)                        L1850
  fillSocket(itemKey, category)              L1871
  createSocketModal()                        L1912
  createJewelModal()                         L1944
  setupEnhancedJewelModalEvents()            L2008
  validateAffixLimit()                       L2052
  showSocketModal()                          L2098
  hideSocketModal()                          L2106
  showJewelModal()                           L2112
  hideJewelModal()                           L2120
  populateSocketItems(category)              L2136
  updatePrefixValueInput(num)                L2221
  updateSuffixValueInput(num)                L2281
  updateJewelPreview()                       L2341
  getJewelColor()                            L2408
  resetJewelModal()                          L2420
  resetJewelSelections()                     L2439
  createCustomJewel()                        L2473
  calculateActualRequiredLevel(...)          L2610
  isItemUsableByCharacterClass(itemName)     L2629
  doesCharacterMeetStatRequirements(...)     L2652
  getItemRequiredStats(itemName)             L2671
  updateAll()                               L2683  ← THE KEY METHOD
  updateAllItemDisplays()                   L2693
  cleanDuplicateCorruptionText(html)        L2703
  updateItemDisplay(section)                L2795
  generateStackedDescription(...)           L3047
  updateStatRequirementColors(...)          L3121
  addStackingStyles()                       L3155
  getSocketEnhancements(section)            L3185
  calculateAllStats()                       L3197  ← STAT COMPUTATION CORE
  calculateEquipmentStats(dropdownId, ...)  L3661
  calculateSocketStats()                    L3686
  calculateMercenaryStats()                 L3776
  parseMercenaryItemStats(item, section)    L3847
  parseMercenarySocketStats(statsText)      L3893
  parseMercenaryStatLine(line)              L3901
  parseItemStats(item, section)             L4045
  parseSocketStats(statsText, section)      L4138
  parseStatLine(line, hasBaseDefense)       L4159
  parseStatsToMap(statsText)               L4599
  addToStatsMap(statsMap, key, data)        L4998
  mergeStatsMaps(baseStats, socketStats)    L5024
  getStatPattern(key)                       L5175
  updateStatsDisplay()                      L5286  ← DOM UPDATES
  updateMercenaryStatsDisplay()             L5492
  updateElement(id, value)                  L5539
  getSectionInfoId(section)                 L5547
  getSectionDropdownId(section)             L5561
  addStyles()                               L5580
  createRainbowFacetModal()                 L5883
  selectRainbowFacetElement(element)        L5997
  updateRainbowFacetPreview()               L6030
  getRainbowFacetData(element)              L6065
  getRandomValue(min, max)                  L6104
  createRainbowFacet()                      L6113
  hideRainbowFacetModal()                   L6169
  exportSocketData()                        L6179
  importSocketData(socketData)              L6220
```

---

## character.js (~1054 lines) — CHARACTER MANAGER

```
getPropertyValue(prop)                         L8
getItemClassRestriction(itemName)              L30
isItemUsableByClass(itemName, class)           L58
doesCharacterMeetStatRequirements(...)         L68

class CharacterManager                         L80
  constructor()                                L81
  init()                                      L109
  setupEventListeners()                       L125
  setupSocketListeners()                      L171
  setupAchievementWatcher()                   L223
  calculateLifeAndMana()                      L266
  getDirectLifeManaFromItems()                L360
  updateElement(elementId, value)             L370
  getAvailableStatPoints()                    L377
  getTotalBaseStats()                         L381
  getCurrentStatTotal()                       L386
  getUsedStatPoints()                         L394
  getAllItemBonuses()                          L400
  getEquipmentClassSkills()                   L455  ← class skill bonuses from gear
  getEquipmentTreeSkills()                    L522
  getSocketBonuses()                          L611
  getCharmBonuses()                           L644
  getCharmLifeManaBonus()                     L659
  getActualRequiredLevel(section, itemName)   L685
  updateTotalDisplay(statId, total)           L705
  updateStatPointsDisplay()                   L734
  updateTotalStats()                          L768  ← CALLED BY updateAll()
  handleLevelChange()                         L795  ← HAS _isLoadingCharacterData guard
  handleClassChange()                         L821
  validateStats()                             L864  ← NEVER call during load
  reduceStatsProportionally(...)              L892
  handleStatChange(statId)                    L921
  getCharacterStats()                         L953

calculateAndDisplayBlock()                    L982
initCharacterManager()                       L1054
```

---

## skills.js (~9958 lines) — SKILL SYSTEM (7 classes)

```
isWeaponUsable()                               L1

class SkillSystem                              L34
  constructor()                                L35
  init()                                     L4550
  createContainers()                         L4561
  populateSkills()                           L4697
  createSkillCalculator()                    L4767
  setupEvents()                              L4789
  scheduleCalculation()                      L4871
  updateSkillDropdown()                      L4885  ← populates active skill dropdown
  getSkillTotalLevel(skillId)               L4965
  [damage getters L4990–L5190]
  calculateSkillDamage()                     L5191
  getWeaponDamage()                          L8329
  calculatePhysicalDamage(...)               L8356
  calculateMagicConversionDamage(...)        L8482
  calculateLightningConversionDamage(...)    L8613
  getWeaponMasteryChance()                   L8697
  getPassiveARBonus()                        L8786
  getActiveSkillARBonus()                    L8805
  getEnchantARBonus()                        L8830
  getWeaponElementalDamages()                L8854
  getCriticalStrikeChance()                  L8911
  getDeadlyStrikeChance()                    L8920
  calculatePoisonDamage(...)                 L8946
  calculateElementalDamage(...)              L9228
  calculateColdDamage(...)                   L9288
  calculateFireDamage(...)                   L9321
  restrictInput(e)                           L9466
  handleSkillInput(input)                    L9496  ← validates prerequisites
  removeDependentSkillPoints(skillId)       L9548
  checkPrerequisites(skillId)               L9571
  updateSkillVisuals()                       L9606  ← call after bulk skill load
  getMaxAllowed(skillLevel)                 L9638
  getTotalUsed()                            L9643
  createPointsDisplay()                     L9652
  updateSkillMaxValues()                    L9661
  validateAllSkillInputs()                  L9674
  updatePointsDisplay()                     L9728  ← call after setSkillValue
  showWarning(message)                      L9742
  getSkillValue(skillId)                    L9767
  setSkillValue(skillId, value)             L9772  ← programmatic skill set
  calculateSynergyBonus(skillId, dmgType)   L9781
  rebuildSkillTrees()                       L9801
  updateSkillBonuses(allSkills, classSk, treeSk, indivSk) L9821  ← fed by character.js
  updateSingleSkillBonus(skillId)           L9844

initSkillSystem()                           L9958
```

---

## main.js (~2686 lines) — APP INIT + DROPDOWNS + DISPLAY

```
getItemCategory(item)                         L254
detectItemType(itemName, item)                L279
populateItemDropdowns()                       L287
getPropertyValue(prop)                        L421
formatVariableStat(...)                       L964   ← used in propertyDisplay handlers
formatLevelScaledStat(...)                   L1024
handleVariableStatChange(...)                L1039
setupDropdownHandlers()                      L1556
setupSocketHandlers()                        L1573
updateCritDisplay()                          L1601
setupAnyaCheckboxes()                        L1620
setupCritListeners()                         L1635
saveCurrentBuild()                           L1655  ← saves all 8 party slots
quickSaveBuild()                             L1719
refreshItemDropdowns()                       L1749
populateBaseItemsByType(craftType)           L1756
populateFixedProperties(craftType)           L1836
openCraftingModal()                          L1931
refreshAffixesForBaseType(baseType)          L1986
populateCraftedItemsList()                   L2220
reloadCraftedItemsFromBackend()              L2250
deleteCraftedItemConfirm(craftId)            L2280
closeCraftingModal()                         L2319
setupCraftingModalHandlers()                 L2333
createCraftedItem()                          L2346
createCraftingButton()                       L2486
handleLogout()                               L2539
handleLogin()                                L2552
createSaveButton()                           L2569
loadBuildFromURL()                           L2627  ← loads P1 from shared URL
setupMercLevelValidation()                   L2686

NOTE: generateItemDescription() and propertyDisplay{}
      are inline in the init block — search for them within L421–L1555
```

---

## inventory.js (~2869 lines) — CHARM GRID

```
class CharmInventory                           L2
  constructor()                                L3
  init()                                      L88
  preloadCharmImages()                        L101
  createInventoryGrid()                       L117
  clearAll()                                  L185
  createModal()                               L204
  setupModalEvents()                          L351
  checkUniqueCharmAvailability()              L407
  selectUniqueCharm(uniqueCharmKey)           L467
  backToCharmSelection()                      L486
  populateUniqueCharmStats(uniqueCharm)       L496
  updateUniqueCharmPreview(uniqueCharm)       L539
  selectCharmType(type)                       L569
  populateAffixOptions(type)                  L587
  getRandomCharmImage(charmType)              L624
  updateCharmPreview()                        L634
  createStatSlider(type, statInfo)            L712
  updateSliderValue(type)                     L793
  updateRangeSliderValue(type)                L817
  updatePreviewOnly()                         L832
  generateStatPreview(type, statInfo)         L872
  getStatForAffix(affix)                      L912
  cleanAffixName(affix)                      L1255
  createUniqueCharm()                        L1274
  createManualCharm()                        L1364
  generateStatLine(type, statInfo)           L1443
  getCharmAffixes()                          L1484
  setupEventListeners()                      L1528
  getCharmType(element)                      L1690
  placeCharm(position, charmType, ...)       L1699
  canPlaceCharm(position, charmType)         L1787
  restoreCharm(charmData)                    L1816
  removeCharm(position)                      L1859
  showTooltip(e, charmData)                  L1923
  hideTooltip()                              L1968
  showModal()                                L1974
  hideModal()                                L2021
  fixCharmTitles()                           L2031
  getAllCharms()                             L2058  ← USE THIS for export (NOT exportCharms)
  restoreAllCharms(charmsArray)             L2112  ← USE THIS for import
  clearInventory()                           L2198

initCharmInventory()                        L2241
getCharmBonuses()                           L2283
captureCurrentBaseValues()                  L2552
updateCharmDisplay()                        L2612
getEquipmentSkillDamageBonuses()            L2682
onEquipmentOrSocketChange()                 L2829
onCharmChange()                             L2843
initializeCharmSystem()                     L2860
enhanceStatInputResponsiveness()            L2869
```

---

## itemUpgrade.js (~6185 lines) — UPGRADES + BASE DEFENSES

```
buildDescription(itemName, baseType, ...)    L3106
getSocketStats(socket)                       L3126
buildDescriptionWeapon(...)                  L3154
calculateItemDamage(item, baseType, isMax)   L3218
updateWeaponDescription()                    L3357
handleUpgrade()                              L3461
handleArmorUpgrade()                         L3642
handleWeaponUpgrade()                        L3803
handleWeaponUpgradeWithCorruption()          L4016
handleGloveUpgrade()                         L4154
handleBeltUpgrade()                          L4321
handleBootUpgrade()                          L4488
handleShieldUpgrade()                        L4654
updateDefense()                              L4820
makeEthereal()                               L4899
makeEtherealArmor()                          L4923
makeEtherealItem(category)                   L4947
makeEtherealWeapon(weaponName)               L5169
updateWeaponDamageDisplay()                  L5226
collectAllWeaponStats()                      L5531
updateWeaponDisplayWithCorruption()          L5613
updateCorruptionDisplay(type, corruptionMod) L5696
updateWeaponTooltip(...)                     L5729
updateWeaponDescription(itemData, ...)       L5797
updateWeaponDisplayWithPerLevelDamage()      L5853
makeEtherealShield()                         L6046
makeItemEthereal(dropdownId)                 L6185

NOTE: window.baseDefenses{} object is at the TOP of this file (L1–L3105)
      If adding baseType to items.js, add the key here too.
```

---

## corrupt.js (~1953 lines) — CORRUPTION SYSTEM

```
initCorruptionSystem()                        L449
addCorruptionCSS()                            L460
createCorruptionModal()                       L535
attachCorruptionButtons()                     L614
openCorruptionModal(dropdownId)               L644
populateCorruptionList(corruptions)           L676
createDoubleModSliders(corruption, index)     L752
createSingleModSlider(corruption, index)      L804
updateDoubleModPreview(index)                 L833
updateSingleModPreview(index, modTemplate)    L865
getCurrentCorruptionByIndex(index)            L878
generateDoubleModText(template, values)       L885
generateCorruptionText(template, value)       L900
applyDoubleCorruption(corruption, index)      L905
applyCorruption(modTemplate, value)           L926
applySocketCorruptionFromModal(corruption)    L937
applyCorruptionToProperties(...)             L1009
addStatToProp(key, value)                    L1043
applyCorruptionToItem(corruptionText)        L1309
addCorruptionWithStacking(...)               L1519
parseCorruptionText(corruptionText)          L1579
replaceExistingStatWithCorruption(...)       L1685
triggerItemUpdate(dropdownId)                L1755
removeCurrentCorruption()                    L1790
closeCorruptionModal()                       L1846
```

---

## character-data.js (~15KB) — SAVE/LOAD

```
loadSingleCharacter(data, silent)             L119  ← main load entry point
```
Note: Full export/import orchestration — see AGENTS.md for load order protocol.

---

## craftedItems.js — CRAFTED ITEMS SYSTEM

```
itemMatchesCategories(baseType, categories)   L1045
class CraftedItemsSystem                      L1068
  constructor()                               L1069
  getAvailableAffixes(baseType, type, ...)   L1207
  validateAffixGroups(affixes)               L1240
  rollAffixValues(affixSelection)            L1273
  getCraftedItemsByType(itemType)            L1501
  getAllCraftedItems()                        L1509
  getCraftedItemByName(fullName)             L1518
  isCraftedItem(itemName)                    L1527
  deleteCraftedItem(id)                      L1536
  loadFromData(data)                         L1549
  mergeBuildCraftedItems(buildItems)         L1566
  exportToData()                             L1593
  clear()                                    L1600
```

---

## Smaller Files (read fully — under 500 lines)

### randomBuild.js
```
getAllItemsFromDropdown(dropdownId)            L94
getRandomItem(array)                          L107
setDropdownValue(dropdownId, value)           L113
setSkillValue(skillId, value)                 L127  ← wrapper around skillSystemInstance
setStatValue(statId, value)                   L151
displayBuildTitle(title)                      L165
randomizeBuild()                              L212  ← main entry (SHIFT+R)
```

### buffs.js
```
class BuffSystem                               L1
  handleMercenaryChange(mercValue)             L29
  refreshPartyBuffs()                         L122
  addBuff(buff)                               L316
  renderBuff(buff)                            L346
  addCustomBuff(id, name, ...)               L410
  clearAllBuffs()                             L434
```

### setTracker.js
```
class SetTracker                               L4
  extractSetName(itemName)                    L141
  isSetItem(item, itemName)                   L165
  parseSetBonuses(item)                       L188
  updateSetTracking()                         L520
  getActiveBonuses()                          L638
  updateBuffDisplay()                         L686
  applySetBonuses()                           L772
```

### party-manager.js
```
class PartyManager                             L5
  init()                                      L19
  createUI()                                  L35
  saveCurrentSlot()                          L164
  resetToDefault()                           L171
  updateUI()                                  L212
  getBestBuff(buffId)                         L243
```

### power-rating.js
```
class PowerRatingCalculator                    L6
  calculateOffensivePower()                   L36
  calculateDefensivePower()                  L213
  calculateOverallPower()                    L464
  updatePowerDisplay()                        L483
setupPowerRatingAutoUpdate()                  L505
```

### weapon-swap.js
```
init()   L11 | swap()  L34 | updateVisuals() L84
export() L98 | load()  L106 | updateCachedBuffs() L151
```

### items.js (~200KB)
**DATA ONLY** — `window.itemList = { itemName: { properties } }` object.  
No functions. Use `grep_search` to find specific item names.  
Structure: `itemName → { name, type, props: { statKey: value|[min,max] }, baseType?, sockets? }`

---

## Quick Reference — "I need to edit X" lookup

| Task | File | Line |
|:---|:---|:---|
| Add new stat calculation | socket.js | L3197 `calculateAllStats()` |
| Add stat to character display | character.js | L768 `updateTotalStats()` |
| Fix item property display | main.js | ~L421 `propertyDisplay{}` |
| Fix charm export/import | inventory.js | L2058/L2112 |
| Add new item | items.js | (grep for similar item) |
| Add base defense for item | itemUpgrade.js | L1–L50 `window.baseDefenses` |
| Fix skill prereqs | skills.js | L9571 `checkPrerequisites()` |
| Fix skill dropdown | skills.js | L4885 `updateSkillDropdown()` |
| Fix save/load | character-data.js | L119 `loadSingleCharacter()` |
| Add new equipment slot | socket.js | L290 `init()`, L1330 `initializeSocketContainers()` |
| Change corruption logic | corrupt.js | L1009 `applyCorruptionToProperties()` |
| Update party build save | main.js | L1655 `saveCurrentBuild()` |
