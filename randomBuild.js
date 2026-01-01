// Random Build Generator - SHIFT+R
// Simple feature to randomize character build

(function () {
    'use strict';

    // Build templates
    const BUILD_TEMPLATES = {
        amazon_lightning_fury: {
            title: 'Light. Fury',
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
        },
        amazon_decoy: {
            title: 'Decoy',
            class: 'Amazon',
            skills: {
                'innersightcontainer': 1,
                'criticalstrikecontainer': 20,
                'evadecontainer': 1,
                'slowmovementcontainer': 1,
                'piercecontainer': 1,
                'dodgecontainer': 1,
                'decoycontainer': 20,
                'penetratecontainer': 1,
                'valkyriecontainer': 20
            },
            activeSkill: 'decoycontainer',
            stats: {
                str: 150,
                dex: 150,
                vit: 200,
                enr: 15
            }
        },
        amazon_multishot: {
            title: 'Multishot',
            class: 'Amazon',
            skills: {
                'magicarrowcontainer': 1,
                'firearrowcontainer': 1,
                'coldarrowcontainer': 1,
                'multipleshotcontainer': 20,
                'guidedarrowcontainer': 1,
                'strafecontainer': 20,
                'innersightcontainer': 1,
                'criticalstrikecontainer': 20,
                'evadecontainer': 1,
                'slowmovementcontainer': 1,
                'piercecontainer': 20,
                'dodgecontainer': 1,
                'decoycontainer': 1,
                'penetratecontainer': 1,
                'valkyriecontainer': 1
            },
            activeSkill: 'multipleshotcontainer',
            stats: {
                str: 100,
                dex: 180,
                vit: 100,
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

    // Display build title
    function displayBuildTitle(title) {
        console.log('Displaying build title:', title);

        // Get active player index
        const activeIndex = window.partyManager?.activeIndex || 0;

        // Remove existing title for this player if present
        const existingTitle = document.getElementById(`build-title-p${activeIndex + 1}`);
        if (existingTitle) {
            existingTitle.remove();
        }

        // Create new title element
        const titleElement = document.createElement('div');
        titleElement.id = `build-title-p${activeIndex + 1}`;
        titleElement.className = 'build-title-display';
        titleElement.textContent = title;

        // Find the active party button to position the title directly under it
        const activeButton = document.getElementById(`party-btn-${activeIndex}`);
        const partyBar = document.getElementById('party-bar');

        if (activeButton && partyBar) {
            // Get button and party bar positions
            const buttonRect = activeButton.getBoundingClientRect();
            const partyBarRect = partyBar.getBoundingClientRect();

            // Calculate bottom position: party bar height + small gap
            const bottomOffset = window.innerHeight - partyBarRect.bottom - 14; // 5px gap above party bar

            // Position title directly under the button
            titleElement.style.left = `${buttonRect.left + (buttonRect.width / 2)}px`;
            titleElement.style.bottom = `${bottomOffset}px`;

            console.log('Title positioned at:', {
                left: titleElement.style.left,
                bottom: titleElement.style.bottom,
                playerIndex: activeIndex + 1
            });

            document.body.appendChild(titleElement);
        } else {
            console.warn('Could not find party button or bar:', { activeButton, partyBar });
        }
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

        // Display build title
        if (build.title) {
            displayBuildTitle(build.title);
        }

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

    // Reposition all titles on window resize
    window.addEventListener('resize', function () {
        const partyBar = document.getElementById('party-bar');
        if (!partyBar) return;

        const partyBarRect = partyBar.getBoundingClientRect();
        const bottomOffset = window.innerHeight - partyBarRect.top + 5;

        // Reposition all existing titles
        for (let i = 0; i < 8; i++) {
            const titleElement = document.getElementById(`build-title-p${i + 1}`);
            if (titleElement) {
                const button = document.getElementById(`party-btn-${i}`);
                if (button) {
                    const buttonRect = button.getBoundingClientRect();
                    titleElement.style.left = `${buttonRect.left + (buttonRect.width / 2)}px`;
                    titleElement.style.bottom = `${bottomOffset}px`;
                }
            }
        }
    });

    // Expose displayBuildTitle globally for party manager
    window.displayBuildTitle = displayBuildTitle;

    console.log('Random Build Generator loaded. Press SHIFT+R to randomize!');
})();
