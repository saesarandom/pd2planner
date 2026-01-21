const StatFormats = {
  // === SKILLS ===
  allsk: '+{value} to All Skills',
  ironoskill: '+{value} to Iron Skin',

  // === ATTRIBUTES ===
  str: '+{value} to Strength',
  dex: '+{value} to Dexterity',
  vit: '+{value} to Vitality',
  enr: '+{value} to Energy',
  allstats: '+{value} to All Attributes',

  // === LIFE/MANA ===
  tolife: '+{value} to Life',
  tomana: '+{value} to Mana',
  maxlife: 'Increase Maximum Life {value}%',
  maxmana: 'Increase Maximum Mana {value}%',
  repl: 'Replenish Life +{value}',
  repldur: 'Repairs 1 Durability in {value} Seconds',

  // === SPEED STATS ===
  ias: '+{value}% Increased Attack Speed',
  fcr: '+{value}% Faster Cast Rate',
  fhr: '+{value}% Faster Hit Recovery',
  frw: '+{value}% Faster Run/Walk',
  fbr: '+{value}% Faster Block Rate',

  // === DAMAGE STATS ===
  edmg: '+{value}% Enhanced Damage',
  mindmg: '+{value} to Minimum Damage',
  maxdmg: '+{value} to Maximum Damage',
  tomindmg: '+{value} to Minimum Damage',

  // === DEFENSE STATS ===
  edef: '+{value}% Enhanced Defense',
  todef: '+{value} Defense',
  block: '{value}% Increased Chance of Blocking',

  // === RESISTANCES ===
  coldres: 'Cold Resist +{value}%',
  firres: 'Fire Resist +{value}%',
  ligres: 'Lightning Resist +{value}%',
  poisres: 'Poison Resist +{value}%',
  allres: 'All Resistances +{value}',

  // === LEECH ===
  lleech: '{value}% Life Stolen per Hit',
  mleech: '{value}% Mana Stolen per Hit',

  // === COMBAT ===
  toatt: '+{value} to Attack Rating',
  cb: '{value}% Chance of Crushing Blow',
  deadly: '{value}% Deadly Strike',
  maxdeadly: '{value}% Maximum Deadly Strike',
  ow: '{value}% Chance of Open Wounds',
  owdmg: '+{value} Open Wounds Damage per Second',
  targetdef: '{value}% Target Defense',

  // === MAGIC FIND ===
  magicfind: '{value}% Better Chance of Getting Magic Items',
  goldfind: '{value}% Extra Gold from Monsters',

  // === DAMAGE REDUCTION ===
  physdr: 'Physical Damage Taken Reduced by {value}%',
  pdr: 'Physical Damage Taken Reduced by {value}',
  mdr: 'Magic Damage Reduced by {value}',

  // === ENEMY RESISTANCE PIERCE ===
  coldpierce: '-{value}% to Enemy Cold Resistance',
  firepierce: '-{value}% to Enemy Fire Resistance',
  lightpierce: '-{value}% to Enemy Lightning Resistance',
  poisonpierce: '-{value}% to Enemy Poison Resistance',
  physpierce: '-{value}% to Enemy Physical Resistance',

  // === SKILL DAMAGE ===
  lightskilldmg: '+{value}% to Lightning Skill Damage',
  coldskilldmg: '+{value}% to Cold Skill Damage',
  fireskilldmg: '+{value}% to Fire Skill Damage',
  poisonskilldmg: '+{value}% to Poison Skill Damage',

  // === MISC ===
  curseres: 'Curse Resistance {value}%',
  ligrad: '+{value} to Light Radius'
};

/**
 * Regex patterns for matching stat descriptions
 * These should match the formats defined in StatFormats
 */
const StatPatterns = {
  allsk: /(\+?\d+)\s+(?:to\s+)?All\s+Skills/i,
  ironoskill: /(\+?\d+)\s+(?:to\s+)?Iron\s+Skin/i,
  str: /(\+?\d+)\s+(?:to\s+)?Strength/i,
  dex: /(\+?\d+)\s+(?:to\s+)?Dexterity/i,
  vit: /(\+?\d+)\s+(?:to\s+)?Vitality/i,
  enr: /(\+?\d+)\s+(?:to\s+)?Energy/i,
  allstats: /(\+?\d+)\s+(?:to\s+)?All\s+Attributes/i,

  tolife: /(\+?\d+)\s+(?:to\s+)?Life/i,
  tomana: /(\+?\d+)\s+(?:to\s+)?Mana/i,
  repl: /Replenish\s+Life\s+\+(\d+)/i,
  repldur: /Repairs\s+1\s+Durability\s+in\s+(\d+)\s+Seconds/i,

  ias: /(\+?\d+)%\s+Increased\s+Attack\s+Speed/i,
  fcr: /(\+?\d+)%\s+Faster\s+Cast\s+Rate/i,
  fhr: /(\+?\d+)%\s+Faster\s+Hit\s+Recovery/i,
  frw: /(\+?\d+)%\s+Faster\s+Run\/Walk/i,
  fbr: /(\+?\d+)%\s+Faster\s+Block\s+Rate/i,

  edmg: /(\+?\d+)%\s+Enhanced\s+Damage/i,
  tomindmg: /(\+?\d+)\s+to\s+Minimum\s+Damage/i,
  edef: /(\+?\d+)%\s+Enhanced\s+Defense/i,
  block: /(\+?\d+)%\s+Increased\s+Chance\s+of\s+Blocking/i,

  coldres: /Cold\s+Resist\s+\+(\d+)%/i,
  firres: /Fire\s+Resist\s+\+(\d+)%/i,
  ligres: /Lightning\s+Resist\s+\+(\d+)%/i,
  poisres: /Poison\s+Resist\s+\+(\d+)%/i,
  allres: /All\s+Resistances\s+\+(\d+)/i,

  lleech: /(\d+)%\s+Life\s+Stolen\s+per\s+Hit/i,
  mleech: /(\d+)%\s+Mana\s+Stolen\s+per\s+Hit/i,

  toatt: /\+(\d+)\s+(?:to\s+)?Attack\s+Rating/i,
  cb: /(\d+)%\s+Chance\s+of\s+Crushing\s+Blow/i,
  deadly: /(\d+)%\s+Deadly\s+Strike/i,
  maxdeadly: /(\d+)%\s+Maximum\s+Deadly\s+Strike/i,
  ow: /(\d+)%\s+Chance\s+of\s+Open\s+Wounds/i,
  owdmg: /(\+?\d+)\s+Open\s+Wounds\s+Damage\s+per\s+Second/i,
  targetdef: /([+-]?\d+)%\s+Target\s+Defense/i,

  magicfind: /(\d+)%\s+Better\s+Chance\s+of\s+Getting\s+Magic\s+Items/i,
  goldfind: /(\d+)%\s+Extra\s+Gold\s+from\s+Monsters/i,

  physdr: /Physical\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)%/i,
  pdr: /Physical\s+Damage\s+Taken\s+Reduced\s+by\s+(\d+)(?!%)/i,
  mdr: /Magic\s+Damage\s+Reduced\s+by\s+(\d+)/i,

  coldpierce: /-(\d+)%\s+to\s+Enemy\s+Cold\s+Resistance/i,
  firepierce: /-(\d+)%\s+to\s+Enemy\s+Fire\s+Resistance/i,
  lightpierce: /-(\d+)%\s+to\s+Enemy\s+Lightning\s+Resistance/i,
  poisonpierce: /-(\d+)%\s+to\s+Enemy\s+Poison\s+Resistance/i,
  physpierce: /-(\d+)%\s+to\s+Enemy\s+Physical\s+Resistance/i,

  lightskilldmg: /\+(\d+)%\s+to\s+Lightning\s+Skill\s+Damage/i,
  coldskilldmg: /\+(\d+)%\s+to\s+Cold\s+Skill\s+Damage/i,
  fireskilldmg: /\+(\d+)%\s+to\s+Fire\s+Skill\s+Damage/i,
  poisonskilldmg: /\+(\d+)%\s+to\s+Poison\s+Skill\s+Damage/i
};

/**
 * Property key to display format mapping
 * Maps item property keys to their StatFormat keys
 */
const PropertyMapping = {
  allsk: 'allsk',
  ironoskill: 'ironoskill',
  str: 'str',
  dex: 'dex',
  vit: 'vit',
  enr: 'enr',
  allstats: 'allstats',
  tolife: 'tolife',
  tomana: 'tomana',
  repl: 'repl',
  repldur: 'repldur',
  ias: 'ias',
  fcr: 'fcr',
  fhr: 'fhr',
  frw: 'frw',
  fbr: 'fbr',
  edmg: 'edmg',
  tomindmg: 'tomindmg',
  edef: 'edef',
  block: 'block',
  coldres: 'coldres',
  firres: 'firres',
  ligres: 'ligres',
  poisres: 'poisres',
  allres: 'allres',
  lleech: 'lleech',
  mleech: 'mleech',
  toatt: 'toatt',
  cb: 'cb',
  deadly: 'deadly',
  maxdeadly: 'maxdeadly',
  ow: 'ow',
  owdmg: 'owdmg',
  targetdef: 'targetdef',
  magicfind: 'magicfind',
  goldfind: 'goldfind',
  physdr: 'physdr',
  pdr: 'pdr',
  mdr: 'mdr',
  coldpierce: 'coldpierce',
  firepierce: 'firepierce',
  lightpierce: 'lightpierce',
  poisonpierce: 'poisonpierce',
  physpierce: 'physpierce',
  lightskilldmg: 'lightskilldmg',
  coldskilldmg: 'coldskilldmg',
  fireskilldmg: 'fireskilldmg',
  poisonskilldmg: 'poisonskilldmg',
  curseres: 'curseres',
  ligrad: 'ligrad'
};

/**
 * Corruption type to property key mapping
 * Maps corruption system type names to property keys
 */
const CorruptionTypeMapping = {
  'allskills': 'allsk',
  'str': 'str',
  'dex': 'dex',
  'vit': 'vit',
  'enr': 'enr',
  'allattributes': 'allstats',
  'life': 'tolife',
  'mana': 'tomana',
  'ar': 'toatt',
  'ias': 'ias',
  'fcr': 'fcr',
  'fhr': 'fhr',
  'frw': 'frw',
  'fbr': 'fbr',
  'block': 'block',
  'edmg': 'edmg',
  'edef': 'edef',
  'cb': 'cb',
  'allres': 'allres',
  'pdr': 'pdr',
  'mdr': 'mdr'
};

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

/**
 * Format a stat value using the centralized format
 * @param {string} formatKey - Key from StatFormats
 * @param {number|object} value - The stat value (or object with min/max/current)
 * @returns {string} Formatted stat text
 */
function formatStat(formatKey, value) {
  const format = StatFormats[formatKey];
  if (!format) {
    console.warn(`No format defined for key: ${formatKey}`);
    return '';
  }

  // Get actual value (handle objects with current/max)
  const actualValue = getPropertyValue(value);
  return format.replace('{value}', actualValue);
}

/**
 * Format a stat with variable indicator if it has a range
 * @param {string} formatKey - Key from StatFormats
 * @param {number|object} prop - The property value/object
 * @param {string} itemName - Item name (for input binding)
 * @param {string} propKey - Property key (for input binding)
 * @param {string} dropdownId - Dropdown ID (for input binding)
 * @returns {string} Formatted stat with optional range indicator and input
 */
function formatVariableStatCentralized(formatKey, prop, itemName, propKey, dropdownId) {
  const baseText = formatStat(formatKey, prop);

  if (typeof prop === 'object' && prop !== null && 'min' in prop && 'max' in prop) {
    const value = getPropertyValue(prop);
    return `${baseText} <span style="color: #888;">[${prop.min}-${prop.max}]</span> ` +
      `<input type="number" class="stat-input" data-item="${itemName}" ` +
      `data-prop="${propKey}" data-dropdown="${dropdownId}" ` +
      `min="${prop.min}" max="${prop.max}" value="${value}" ` +
      `style="width: 45px; padding: 2px; background: #1a1a2e; color: #fff; ` +
      `border: 1px solid #0f3460; border-radius: 3px;">`;
  }

  return baseText;
}

/**
 * Get the pattern to match a stat in text
 * @param {string} formatKey - Key from StatFormats
 * @returns {RegExp|null} Regular expression to match this stat
 */
function getStatPattern(formatKey) {
  return StatPatterns[formatKey] || null;
}

/**
 * Parse a stat description to extract its value
 * @param {string} text - The stat description text
 * @param {string} formatKey - Key from StatFormats to use for matching
 * @returns {number|null} Extracted value or null if no match
 */
function parseStatValue(text, formatKey) {
  const pattern = getStatPattern(formatKey);
  if (!pattern) return null;

  const match = text.match(pattern);
  return match ? parseInt(match[1]) : null;
}

/**
 * Replace a stat in description text with a new value
 * @param {string} description - The full description text
 * @param {string} formatKey - Key from StatFormats
 * @param {number} newValue - The new value to use
 * @param {string} styleClass - Optional CSS class to wrap the replacement
 * @returns {object} { found: boolean, description: string }
 */
function replaceStatInDescription(description, formatKey, newValue, styleClass = '') {
  const pattern = getStatPattern(formatKey);
  if (!pattern) return { found: false, description };

  const match = description.match(pattern);
  if (!match) return { found: false, description };

  const newText = formatStat(formatKey, newValue);
  const styledText = styleClass ? `<span class="${styleClass}">${newText}</span>` : newText;

  return {
    found: true,
    description: description.replace(pattern, styledText)
  };
}
