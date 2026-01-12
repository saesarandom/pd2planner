// Weapon Swap System
// Manages swapping between two weapon sets (like D2's W key)

window.weaponSwapSystem = {
    currentSet: 1, // 1 or 2
    weaponSets: {
        1: { weapon: '', shield: '' },
        2: { weapon: '', shield: '' }
    },

    init() {
        const swapBtn = document.getElementById('weapon-swap-btn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swap());
        }

        // Save current selections when dropdowns change
        const weaponDropdown = document.getElementById('weapons-dropdown');
        const shieldDropdown = document.getElementById('offs-dropdown');

        if (weaponDropdown) {
            weaponDropdown.addEventListener('change', () => {
                this.weaponSets[this.currentSet].weapon = weaponDropdown.value;
            });
        }

        if (shieldDropdown) {
            shieldDropdown.addEventListener('change', () => {
                this.weaponSets[this.currentSet].shield = shieldDropdown.value;
            });
        }
    },

    swap() {
        // Set flag to indicate we're swapping (so cache update knows to ignore equipment deltas)
        this._justSwapped = true;

        // Save current set
        const weaponDropdown = document.getElementById('weapons-dropdown');
        const shieldDropdown = document.getElementById('offs-dropdown');

        this.weaponSets[this.currentSet].weapon = weaponDropdown.value;
        this.weaponSets[this.currentSet].shield = shieldDropdown.value;

        // Switch to other set
        this.currentSet = this.currentSet === 1 ? 2 : 1;

        // Load other set
        weaponDropdown.value = this.weaponSets[this.currentSet].weapon || '';
        shieldDropdown.value = this.weaponSets[this.currentSet].shield || '';

        // Trigger change events to update stats
        weaponDropdown.dispatchEvent(new Event('change', { bubbles: true }));
        shieldDropdown.dispatchEvent(new Event('change', { bubbles: true }));

        // Update visual feedback
        this.updateVisuals();
    },

    updateVisuals() {
        const weaponGroup = document.querySelector('.groupweapons');
        const shieldGroup = document.querySelector('.groupoffhand');

        if (this.currentSet === 2) {
            weaponGroup?.classList.add('weapon-set-2');
            shieldGroup?.classList.add('weapon-set-2');
        } else {
            weaponGroup?.classList.remove('weapon-set-2');
            shieldGroup?.classList.remove('weapon-set-2');
        }
    },

    // Export for character data
    export() {
        return {
            currentSet: this.currentSet,
            sets: this.weaponSets
        };
    },

    // Import from character data
    load(data) {
        if (!data) return;

        this.currentSet = data.currentSet || 1;
        this.weaponSets = data.sets || { 1: { weapon: '', shield: '' }, 2: { weapon: '', shield: '' } };

        // Load current set into dropdowns
        const weaponDropdown = document.getElementById('weapons-dropdown');
        const shieldDropdown = document.getElementById('offs-dropdown');

        if (weaponDropdown) weaponDropdown.value = this.weaponSets[this.currentSet].weapon || '';
        if (shieldDropdown) shieldDropdown.value = this.weaponSets[this.currentSet].shield || '';

        this.updateVisuals();
    },

    // Cache for buff levels from each weapon set
    cachedBuffLevels: {
        1: {},
        2: {}
    },

    // Flag to track if a swap just occurred, to prevent equipment-based deltas from affecting other set
    _justSwapped: false,

    // Update cached buff levels for current set
    updateCachedBuffs() {
        if (!window.skillSystem) return;

        const currentBuffs = {
            bo: window.skillSystem.getSkillTotalLevel?.('battleorderscontainer') || 0,
            bc: window.skillSystem.getSkillTotalLevel?.('battlecommandcontainer') || 0,
            shout: window.skillSystem.getSkillTotalLevel?.('shoutcontainer') || 0,
            grimWard: window.skillSystem.getSkillTotalLevel?.('grimwardcontainer') || 0,
            how: window.skillSystem.getSkillTotalLevel?.('heartofwolverinecontainer') || 0,
            oak: window.skillSystem.getSkillTotalLevel?.('oaksagecontainer') || 0,
            sob: window.skillSystem.getSkillTotalLevel?.('spiritofbarbscontainer') || 0,
            fireEnchant: window.skillSystem.getSkillTotalLevel?.('enchantfirecontainer') || 0,
            coldEnchant: window.skillSystem.getSkillTotalLevel?.('coldenchantcontainer') || 0,
            amplifyDamage: window.skillSystem.getSkillTotalLevel?.('amplifydamagecontainer') || 0,
            lowerResist: window.skillSystem.getSkillTotalLevel?.('lowerresistcontainer') || 0,
            curseMastery: window.skillSystem.getSkillTotalLevel?.('cursemasterycontainer') || 0
        };

        // Calculate the delta (change) for each buff
        const otherSet = this.currentSet === 1 ? 2 : 1;

        for (const buffName in currentBuffs) {
            const newValue = currentBuffs[buffName];
            const oldValue = this.cachedBuffLevels[this.currentSet]?.[buffName] || 0;
            const delta = newValue - oldValue;

            // Update current set
            this.cachedBuffLevels[this.currentSet][buffName] = newValue;

            // Only apply delta to other set if we DIDN'T just swap
            // (if we just swapped, the delta is from equipment change, not skill points)
            if (delta !== 0 && !this._justSwapped) {
                const otherSetOldValue = this.cachedBuffLevels[otherSet]?.[buffName] || 0;
                const otherSetNewValue = otherSetOldValue + delta;
                this.cachedBuffLevels[otherSet][buffName] = otherSetNewValue;
            }
        }

        // Clear the swap flag
        this._justSwapped = false;
    },

    // Helper to get skill container ID from buff name
    getSkillId(buffName) {
        const map = {
            bo: 'battleorderscontainer',
            bc: 'battlecommandcontainer',
            shout: 'shoutcontainer',
            grimWard: 'grimwardcontainer',
            how: 'heartofwolverinecontainer',
            oak: 'oaksagecontainer',
            sob: 'spiritofbarbscontainer',
            fireEnchant: 'enchantfirecontainer',
            coldEnchant: 'coldenchantcontainer',
            amplifyDamage: 'amplifydamagecontainer',
            lowerResist: 'lowerresistcontainer',
            curseMastery: 'cursemasterycontainer'
        };
        return map[buffName];
    },

    // Get the maximum buff level from both sets
    getMaxBuffLevel(buffName) {
        const set1Level = this.cachedBuffLevels[1][buffName] || 0;
        const set2Level = this.cachedBuffLevels[2][buffName] || 0;
        return Math.max(set1Level, set2Level);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.weaponSwapSystem.init();
});
