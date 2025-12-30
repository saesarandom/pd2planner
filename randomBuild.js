// Random Build Generator - SHIFT+R
// Simple feature to randomize character build

(function () {
    'use strict';

    // Build templates
    const BUILD_TEMPLATES = {
        amazon_lightning_fury: {
            class: 'Amazon',
            skills: {
                'lightningfurycontainer': 20,
                'powerstrikecontainer': 20,
                'lightningboltcontainer': 20,
                'jabcontainer': 1,
                'poisonjavelincontainer': 1,
                'javelinandspearmasterycontainer': 1,
                'fendcontainer': 1,
                'chargedstrikecontainer': 1,
                'plaguejavelincontainer': 1,
                'lightningstrikecontainer': 1,
                'innersightcontainer': 1,
                'criticalstrikecontainer': 20,
                'evadecontainer': 4,
                'slowmovementcontainer': 1,
                'piercecontainer': 1,
                'dodgecontainer': 4,
                'decoycontainer': 1,
                'penetratecontainer': 1,
                'valkyriecontainer': 1
            },
            activeSkill: 'lightningfurycontainer',
            stats: {
                str: 200,
                dex: 125,
                vit: 200,
                enr: 15
            }
        }
    };

    // Get all items from a dropdown
    function getAllItemsFromDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return [];

        const items = [];
        for (let i = 1; i < dropdown.options.length; i++) { // Skip "None" option
            const value = dropdown.options[i].value;
            if (value) items.push(value);
        }
        return items;
    }

    // Get random item from array
    function getRandomItem(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    }

    // Set dropdown value and trigger change event
    function setDropdownValue(dropdownId, value) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return false;

        dropdown.value = value || '';

        // Trigger change event
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);

        return true;
    }

    // Set skill value
    function setSkillValue(skillId, value) {
        // Use the global skillSystemInstance if available
        if (window.skillSystemInstance) {
            window.skillSystemInstance.setSkillValue(skillId, value);
            return true;
        }

        // Fallback: direct DOM manipulation
        const skillInput = document.getElementById(skillId);
        if (!skillInput) {
            console.warn(`Skill input not found: ${skillId}`);
            return false;
        }

        skillInput.value = value;

        // Trigger input event
        const event = new Event('input', { bubbles: true });
        skillInput.dispatchEvent(event);

        return true;
    }

    // Set stat value
    function setStatValue(statId, value) {
        const statInput = document.getElementById(statId);
        if (!statInput) return false;

        statInput.value = value;

        // Trigger input event
        const event = new Event('input', { bubbles: true });
        statInput.dispatchEvent(event);

        return true;
    }

    // Main randomize function
    function randomizeBuild() {
        if (window._isLoadingCharacterData) return;
        console.log('Randomizing build...');

        // Pick a random build template
        const buildKeys = Object.keys(BUILD_TEMPLATES);
        const randomBuildKey = buildKeys[Math.floor(Math.random() * buildKeys.length)];
        const build = BUILD_TEMPLATES[randomBuildKey];

        console.log(`Selected build: ${randomBuildKey}`);

        // Set class
        const classDropdown = document.getElementById('selectClass');
        if (classDropdown) {
            classDropdown.value = build.class;
            const event = new Event('change', { bubbles: true });
            classDropdown.dispatchEvent(event);
        }

        // Set level to 90
        setStatValue('lvlValue', 90);

        // Set stats
        setStatValue('str', build.stats.str);
        setStatValue('dex', build.stats.dex);
        setStatValue('vit', build.stats.vit);
        setStatValue('enr', build.stats.enr);

        // Wait a bit for class change to process, then set skills
        setTimeout(() => {
            // Set skills
            for (const [skillId, value] of Object.entries(build.skills)) {
                setSkillValue(skillId, value);
            }

            // After all skills are set, trigger the SkillSystem updates
            if (window.skillSystemInstance) {
                // Update all skill visuals to remove gray state
                window.skillSystemInstance.updateSkillVisuals();
                window.skillSystemInstance.updatePointsDisplay();

                // Trigger handleSkillInput for each skill to validate prerequisites
                for (const [skillId, value] of Object.entries(build.skills)) {
                    const skillInput = document.getElementById(skillId);
                    if (skillInput) {
                        skillInput.setAttribute('data-old-value', value);
                        window.skillSystemInstance.handleSkillInput(skillInput);
                    }
                }

                // Final update to ensure everything is synced
                window.skillSystemInstance.updateSkillVisuals();
                window.skillSystemInstance.scheduleCalculation();

                // Update the skill dropdown to populate it with available skills
                window.skillSystemInstance.updateSkillDropdown();
            }

            // Set the active skill dropdown after it's been populated
            if (build.activeSkill) {
                setTimeout(() => {
                    const activeSkillDropdown = document.getElementById('active-skill-dropdown');
                    if (activeSkillDropdown) {
                        activeSkillDropdown.value = build.activeSkill;
                        const event = new Event('change', { bubbles: true });
                        activeSkillDropdown.dispatchEvent(event);

                        // Trigger skill damage calculation
                        if (window.skillSystemInstance) {
                            window.skillSystemInstance.calculateSkillDamage();
                        }
                    }
                }, 200);
            }
        }, 500);

        // Randomize equipment
        const equipmentDropdowns = [
            'weapons-dropdown',
            'helms-dropdown',
            'armors-dropdown',
            'offs-dropdown',
            'gloves-dropdown',
            'belts-dropdown',
            'boots-dropdown',
            'ringsone-dropdown',
            'ringstwo-dropdown',
            'amulets-dropdown'
        ];

        equipmentDropdowns.forEach(dropdownId => {
            const items = getAllItemsFromDropdown(dropdownId);
            const randomItem = getRandomItem(items);
            if (randomItem) {
                setDropdownValue(dropdownId, randomItem);
            }
        });

        console.log('Build randomized!');
    }

    // Listen for SHIFT+R
    document.addEventListener('keydown', function (e) {
        // Check if SHIFT+R is pressed
        if (e.shiftKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            randomizeBuild();
        }
    });

    console.log('Random Build Generator loaded. Press SHIFT+R to randomize!');
})();
