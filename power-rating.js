// ===================================================================
// POWER RATING SYSTEM
// Calculates character offensive and defensive power against a standardized enemy
// ===================================================================

class PowerRatingCalculator {
    constructor() {
        // Standardized enemy for power calculations
        this.standardEnemy = {
            life: 1000000,              // 1 million HP
            physicalDamage: 1000,       // Average physical damage per hit
            elementalDamage: 1000,      // Average elemental damage per hit (split across elements)
            attackRating: 10000,         // Enemy attack rating
            defense: 5000,                 // Enemy defense rating
            allResistances: 50,          // Enemy resistances (%)
            physicalResistance: 50,      // Enemy physical resistance (%)
            blockChance: 0,             // Enemy block chance (%)
            attacksPerSecond: 2,        // Enemy attack speed
        };

        // Normalization constants for power scores (0-100 scale)
        this.normalization = {
            maxTimeToKill: 100,         // 100 seconds = score of 10
            maxHitsToSurvive: 1000,     // 1000 hits = score of 100
        };
    }

    // ===================================================================
    // OFFENSIVE POWER CALCULATION
    // ===================================================================

    /**
     * Calculate offensive power based on damage output
     * @returns {Object} { score, timeToKill, dps, details }
     */
    calculateOffensivePower() {
        try {
            // Get active skill average damage
            const avgDamage = this.getActiveSkillDamage();

            // Get attacks per second (based on weapon speed and IAS)
            const attacksPerSecond = this.getAttacksPerSecond();

            // Get hit chance (based on AR vs enemy defense)
            const hitChance = this.getHitChance();

            // Get critical multiplier (Deadly Strike, Critical Strike)
            const critMultiplier = this.getCriticalMultiplier();

            // Calculate effective DPS
            const baseDPS = avgDamage * attacksPerSecond;
            const effectiveDPS = baseDPS * (hitChance / 100) * critMultiplier;

            // Calculate time to kill
            const timeToKill = this.standardEnemy.life / effectiveDPS;

            // Calculate power score (0-100, higher is better)
            // Score of 100 = 10 second kill, Score of 10 = 100 second kill
            const score = Math.min(100, (this.normalization.maxTimeToKill / timeToKill) * 10);

            return {
                score: Math.round(score * 10) / 10,
                timeToKill: Math.round(timeToKill * 10) / 10,
                dps: Math.round(effectiveDPS),
                details: {
                    avgDamage,
                    attacksPerSecond,
                    hitChance,
                    critMultiplier,
                    baseDPS: Math.round(baseDPS)
                }
            };
        } catch (error) {
            console.error('Error calculating offensive power:', error);
            return {
                score: 0,
                timeToKill: Infinity,
                dps: 0,
                details: {}
            };
        }
    }

    /**
     * Get average damage from active skill
     * @returns {number} Average damage
     */
    getActiveSkillDamage() {
        // Try to read from damage-results div (skill tooltip)
        const damageResults = document.getElementById('damage-results');
        if (damageResults && damageResults.innerHTML) {
            // Parse the HTML to find "Average: XXXX"
            const avgMatch = damageResults.innerHTML.match(/Average:\s*(\d+)/i);
            if (avgMatch) {
                const avgDamage = parseInt(avgMatch[1]);
                console.log(`Found average damage: ${avgDamage}`);
                return avgDamage;
            }
        }

        // Fallback: Try to get from skill system
        if (window.skillSystem && typeof window.skillSystem.calculateSkillDamage === 'function') {
            // Try common skill containers
            const skillContainers = ['jabcontainer', 'guidedcontainer', 'multiplecontainer', 'strafcontainer'];
            for (const skillId of skillContainers) {
                const container = document.getElementById(skillId);
                if (container && parseInt(container.textContent) > 0) {
                    try {
                        const damageInfo = window.skillSystem.calculateSkillDamage(skillId);
                        if (damageInfo && damageInfo.average) {
                            console.log(`Using ${skillId} with ${damageInfo.average} average damage`);
                            return damageInfo.average;
                        }
                    } catch (e) {
                        // Skill might not have damage calculation
                    }
                }
            }
        }

        console.warn('No skill damage found - hover over a skill to see its damage');
        return 0;
    }

    /**
     * Calculate attacks per second based on weapon speed and IAS
     * @returns {number} Attacks per second
     */
    getAttacksPerSecond() {
        // Get IAS from stats
        const iasContainer = document.getElementById('iascontainer');
        const ias = iasContainer ? (parseInt(iasContainer.textContent) || 0) : 0;

        // Base weapon speed (frames per attack) - simplified
        // In D2, this varies by weapon type and attack skill
        // For now, assume average of 15 frames per attack at 0% IAS
        const baseFrames = 15;

        // IAS formula (simplified): frames = baseFrames / (1 + IAS/100)
        const framesPerAttack = baseFrames / (1 + ias / 100);

        // D2 runs at 25 frames per second
        const framesPerSecond = 25;
        const attacksPerSecond = framesPerSecond / framesPerAttack;

        return Math.max(0.5, attacksPerSecond); // Minimum 0.5 attacks/sec
    }

    /**
     * Calculate hit chance based on attack rating vs enemy defense
     * @returns {number} Hit chance percentage (0-95)
     */
    getHitChance() {
        // Get attack rating from stats
        const arContainer = document.getElementById('attackratingcontainer');
        const attackRating = arContainer ? (parseInt(arContainer.textContent) || 0) : 0;

        // Get character level
        const levelValue = document.getElementById('lvlValue');
        const charLevel = levelValue ? (parseInt(levelValue.value) || 1) : 1;

        // Enemy defense (assume same level as character)
        const enemyDefense = this.standardEnemy.defense || (charLevel * 50);

        // D2 hit chance formula (simplified)
        // Chance to Hit = (2 * AR / (AR + Defense)) * 100
        // Capped at 95% max, 5% min
        let hitChance;
        if (attackRating < enemyDefense) {
            hitChance = (2 * attackRating / (attackRating + enemyDefense)) * 100;
        } else {
            hitChance = (2 * attackRating / (attackRating + enemyDefense)) * 100;
        }

        return Math.min(95, Math.max(5, hitChance));
    }

    /**
     * Calculate critical hit multiplier
     * @returns {number} Damage multiplier from crits
     */
    getCriticalMultiplier() {
        // Get deadly strike
        const dsContainer = document.getElementById('deadlystrikecontainer');
        const deadlyStrike = dsContainer ? (parseInt(dsContainer.textContent) || 0) : 0;

        // Get critical strike (from skills)
        const csContainer = document.getElementById('criticalhitcontainer');
        const criticalStrike = csContainer ? (parseInt(csContainer.textContent) || 0) : 0;

        // Get weapon mastery crit (if available)
        // For now, assume it's included in criticalStrike

        // Total crit chance (multiplicative, capped at 95%)
        const totalCritChance = Math.min(95,
            100 - ((100 - deadlyStrike) * (100 - criticalStrike) / 100)
        );

        // Crit multiplier in PD2 is 1.5x (not 2x like vanilla D2)
        const critMultiplier = 1 + (totalCritChance / 100) * 0.5;

        return critMultiplier;
    }

    // ===================================================================
    // DEFENSIVE POWER CALCULATION
    // ===================================================================

    /**
     * Calculate defensive power based on survivability
     * @returns {Object} { score, hitsToSurvive, effectiveLife, details }
     */
    calculateDefensivePower() {
        try {
            // Get raw life
            const rawLife = this.getTotalLife();

            // Get defensive stats
            const blockChance = this.getBlockChance();
            const defenseRating = this.getDefenseRating();
            const physicalDR = this.getPhysicalDR();
            const physicalPDR = this.getPhysicalPDR();
            const avgResistances = this.getAverageResistances();
            const avoidance = this.getAvoidance();

            // Calculate damage taken per hit
            const physicalDamageTaken = this.calculatePhysicalDamageTaken(physicalDR, physicalPDR);
            const elementalDamageTaken = this.calculateElementalDamageTaken(avgResistances);

            // Average damage per hit (assume 50% physical, 50% elemental)
            const avgDamagePerHit = (physicalDamageTaken + elementalDamageTaken) / 2;

            // Calculate effective life with block, avoidance, and resistance mitigation
            const blockMitigation = 1 / (1 - (blockChance / 100));
            const avoidanceMitigation = 1 / (1 - (avoidance / 100));

            // Get all resistances and cap them (75% max for elemental, 50% for DR, but allow negatives)
            const fireResist = Math.min(75, parseInt(document.getElementById('fireresistcontainer')?.textContent) || 0);
            const coldResist = Math.min(75, parseInt(document.getElementById('coldresistcontainer')?.textContent) || 0);
            const lightResist = Math.min(75, parseInt(document.getElementById('lightresistcontainer')?.textContent) || 0);
            const poisonResist = Math.min(75, parseInt(document.getElementById('poisonresistcontainer')?.textContent) || 0);
            const curseResist = Math.min(75, parseInt(document.getElementById('curseresistcontainer')?.textContent) || 0);
            const cappedDR = Math.min(50, physicalDR);

            // Separate positive and negative resistances for calculation
            const allResists = [fireResist, coldResist, lightResist, poisonResist, curseResist, cappedDR];
            const positiveResists = allResists.filter(r => r > 0);
            const negativeResists = allResists.filter(r => r < 0);

            // Calculate geometric mean of positive resistances only
            let geometricMeanResist = 0;
            if (positiveResists.length > 0) {
                const product = positiveResists.reduce((prod, resist) => prod * (resist + 1), 1);
                geometricMeanResist = Math.pow(product, 1 / positiveResists.length) - 1;
            }

            // Apply negative resistances as penalties (arithmetic mean of negatives)
            if (negativeResists.length > 0) {
                const negativeAvg = negativeResists.reduce((sum, r) => sum + r, 0) / negativeResists.length;
                geometricMeanResist += negativeAvg; // Subtract from the positive mean
            }

            // Resistance mitigation based on geometric mean (can be negative, which reduces effective life)
            const resistMitigation = 1 / (1 - (geometricMeanResist / 100));

            const effectiveLife = rawLife * blockMitigation * avoidanceMitigation * resistMitigation;

            // Calculate hits to survive
            const hitsToSurvive = effectiveLife / avgDamagePerHit;

            // Get average skill damage for score calculation
            const avgSkillDamage = this.getActiveSkillDamage();

            // Calculate power score using (effectiveLife * average skill dmg) / 1000
            const score = Math.floor(effectiveLife * avgSkillDamage) / 1000;

            return {
                score: Math.floor(score),
                hitsToSurvive: Math.round(hitsToSurvive * 10) / 10,
                effectiveLife: Math.round(effectiveLife),
                details: {
                    rawLife,
                    blockChance,
                    defenseRating,
                    physicalDR,
                    physicalPDR,
                    avgResistances,
                    avoidance,
                    physicalDamageTaken: Math.round(physicalDamageTaken),
                    elementalDamageTaken: Math.round(elementalDamageTaken),
                    avgDamagePerHit: Math.round(avgDamagePerHit)
                }
            };
        } catch (error) {
            console.error('Error calculating defensive power:', error);
            return {
                score: 0,
                hitsToSurvive: 0,
                effectiveLife: 0,
                details: {}
            };
        }
    }

    /**
     * Get total life
     * @returns {number} Total life
     */
    getTotalLife() {
        // Get base vitality
        const vitValue = document.getElementById('vit');
        const baseVit = vitValue ? (parseInt(vitValue.value) || 0) : 0;

        // Get total vitality (with bonuses)
        const totalVitContainer = document.getElementById('total-vit');
        const totalVit = totalVitContainer ? (parseInt(totalVitContainer.textContent) || baseVit) : baseVit;

        // Get character class for life per vitality
        const classSelect = document.getElementById('selectClass');
        const charClass = classSelect ? classSelect.value : 'Amazon';

        // Life per vitality by class
        const lifePerVit = {
            'Amazon': 3,
            'Sorceress': 2,
            'Necromancer': 2,
            'Paladin': 3,
            'Barbarian': 4,
            'Druid': 2,
            'Assassin': 3
        };

        const vitMultiplier = lifePerVit[charClass] || 3;

        // Base life from vitality
        const baseLife = totalVit * vitMultiplier;

        // Get +life from gear
        const lifeContainer = document.getElementById('lifecontainer');
        const bonusLife = lifeContainer ? (parseInt(lifeContainer.textContent) || 0) : 0;

        // Get character level
        const levelValue = document.getElementById('lvlValue');
        const charLevel = levelValue ? (parseInt(levelValue.value) || 1) : 1;

        // Base life from level (all classes start with some base life)
        const levelLife = charLevel * 2; // Simplified

        return Math.max(100, baseLife + bonusLife + levelLife);
    }

    /**
     * Get block chance
     * @returns {number} Block chance percentage
     */
    getBlockChance() {
        // Read from the realblockcontainer which calculates:
        // 15 + ceil(150 * clvl / (Shield block rate + Increased Block Rate))
        // This includes shield base block, dex, holy shield, and other bonuses
        const blockContainer = document.getElementById('realblockcontainer');
        const blockChance = blockContainer ? (parseInt(blockContainer.textContent) || 0) : 0;

        // Cap at 75% max block
        return Math.min(75, Math.max(0, blockChance));
    }

    /**
     * Get defense rating
     * @returns {number} Defense rating
     */
    getDefenseRating() {
        const defenseContainer = document.getElementById('defensecontainer');
        return defenseContainer ? (parseInt(defenseContainer.textContent) || 0) : 0;
    }

    /**
     * Get physical damage reduction percentage
     * @returns {number} Physical DR percentage
     */
    getPhysicalDR() {
        const drContainer = document.getElementById('drcontainer');
        return drContainer ? (parseInt(drContainer.textContent) || 0) : 0;
    }

    /**
     * Get physical damage reduction flat
     * @returns {number} Physical PDR flat
     */
    getPhysicalPDR() {
        const pdrContainer = document.getElementById('pdrcontainer');
        return pdrContainer ? (parseInt(pdrContainer.textContent) || 0) : 0;
    }

    /**
     * Get average resistances
     * @returns {number} Average resistance percentage
     */
    getAverageResistances() {
        const fireResContainer = document.getElementById('fireresistcontainer');
        const coldResContainer = document.getElementById('coldresistcontainer');
        const lightResContainer = document.getElementById('lightresistcontainer');
        const poisonResContainer = document.getElementById('poisonresistcontainer');

        const fireRes = fireResContainer ? (parseInt(fireResContainer.textContent) || 0) : 0;
        const coldRes = coldResContainer ? (parseInt(coldResContainer.textContent) || 0) : 0;
        const lightRes = lightResContainer ? (parseInt(lightResContainer.textContent) || 0) : 0;
        const poisonRes = poisonResContainer ? (parseInt(poisonResContainer.textContent) || 0) : 0;

        // Cap at 75% (or 95% with max res)
        const cappedFire = Math.min(75, fireRes);
        const cappedCold = Math.min(75, coldRes);
        const cappedLight = Math.min(75, lightRes);
        const cappedPoison = Math.min(75, poisonRes);

        return (cappedFire + cappedCold + cappedLight + cappedPoison) / 4;
    }

    /**
     * Get avoidance (chance to not get hit)
     * @returns {number} Avoidance percentage
     */
    getAvoidance() {
        // Based on defense rating vs enemy attack rating
        // Simplified formula
        const defense = this.getDefenseRating();
        const enemyAR = this.standardEnemy.attackRating;

        if (defense === 0) return 0;

        // Chance to be hit = 2 * AR / (AR + Def)
        // Avoidance = 100 - chance to be hit
        const chanceToBeHit = (2 * enemyAR / (enemyAR + defense)) * 100;
        const avoidance = 100 - chanceToBeHit;

        return Math.max(0, Math.min(75, avoidance)); // Cap at 75%
    }

    /**
     * Calculate physical damage taken per hit
     * @param {number} dr - Damage reduction percentage
     * @param {number} pdr - Damage reduction flat
     * @returns {number} Damage taken
     */
    calculatePhysicalDamageTaken(dr, pdr) {
        const baseDamage = this.standardEnemy.physicalDamage;

        // Apply percentage reduction first
        const afterDR = baseDamage * (1 - dr / 100);

        // Apply flat reduction
        const finalDamage = Math.max(0, afterDR - pdr);

        return finalDamage;
    }

    /**
     * Calculate elemental damage taken per hit
     * @param {number} avgRes - Average resistance
     * @returns {number} Damage taken
     */
    calculateElementalDamageTaken(avgRes) {
        const baseDamage = this.standardEnemy.elementalDamage;

        // Apply resistance
        const finalDamage = baseDamage * (1 - avgRes / 100);

        return Math.max(0, finalDamage);
    }

    // ===================================================================
    // OVERALL POWER CALCULATION
    // ===================================================================

    /**
     * Calculate overall power rating
     * @returns {Object} { score, offensive, defensive }
     */
    calculateOverallPower() {
        const offensive = this.calculateOffensivePower();
        const defensive = this.calculateDefensivePower();

        // Use defensive score directly: (effectiveLife * avgSkillDamage) / 1000
        return {
            score: defensive.score,
            offensive,
            defensive
        };
    }

    // ===================================================================
    // UI UPDATE METHODS
    // ===================================================================

    /**
     * Update power rating display in UI
     */
    updatePowerDisplay() {
        const power = this.calculateOverallPower();



        // Update DOM elements if they exist
        const offensiveElement = document.getElementById('offensive-power');
        const defensiveElement = document.getElementById('defensive-power');
        const overallElement = document.getElementById('overall-power');

        if (offensiveElement) offensiveElement.textContent = power.offensive.score;
        if (defensiveElement) defensiveElement.textContent = power.defensive.score;
        if (overallElement) overallElement.textContent = power.score;

        return power;
    }
}

// Create global instance
window.powerRatingCalculator = new PowerRatingCalculator();

// Auto-update when stats change
function setupPowerRatingAutoUpdate() {
    let hooked = false;

    // Hook into unified socket system
    if (window.unifiedSocketSystem && typeof window.unifiedSocketSystem.updateAll === 'function') {
        const originalUpdateAll = window.unifiedSocketSystem.updateAll;
        window.unifiedSocketSystem.updateAll = function () {
            originalUpdateAll.call(this);
            // Update power rating after stats are recalculated
            if (window.powerRatingCalculator) {
                setTimeout(() => window.powerRatingCalculator.updatePowerDisplay(), 100);
            }
        };
        hooked = true;
    }

    // Hook into skill system's calculateSkillDamage
    if (window.skillSystem && typeof window.skillSystem.calculateSkillDamage === 'function') {
        const originalCalculateSkillDamage = window.skillSystem.calculateSkillDamage;
        window.skillSystem.calculateSkillDamage = function () {
            const result = originalCalculateSkillDamage.call(this);
            // Update power rating after skill damage is calculated
            if (window.powerRatingCalculator) {
                setTimeout(() => window.powerRatingCalculator.updatePowerDisplay(), 150);
            }
            return result;
        };
        hooked = true;
    }


}

// Try to set up auto-update when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPowerRatingAutoUpdate);
} else {
    // DOM already loaded
    setupPowerRatingAutoUpdate();
}

// Also try again after delays to catch late-loading systems
setTimeout(setupPowerRatingAutoUpdate, 500);
setTimeout(setupPowerRatingAutoUpdate, 1000);


