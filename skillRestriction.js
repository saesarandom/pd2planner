function showWarning(message, isError = false) {
    const warningDiv = document.getElementById('warningMessage') || createWarningDiv();
    warningDiv.textContent = message;
    warningDiv.style.color = isError ? 'red' : 'orange';
    warningDiv.style.display = 'block';
    
    setTimeout(() => {
        warningDiv.style.display = 'none';
    }, 3000);
}

function createWarningDiv() {
    const div = document.createElement('div');
    div.id = 'warningMessage';
    div.style.position = 'fixed';
    div.style.top = '50px';
    div.style.right = '20px';
    div.style.padding = '10px';
    div.style.backgroundColor = '#fff';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '4px';
    div.style.zIndex = '2';
    document.body.appendChild(div);
    return div;
}







function getMaxAllowedPoints(currentLevel, skillAvailabilityLevel) {
    if (currentLevel < skillAvailabilityLevel) {
        return 0;
    }
    
    if (skillAvailabilityLevel === 1) {
        return currentLevel;
    }
    
    const levelsAfterUnlock = currentLevel - skillAvailabilityLevel + 1;
    return levelsAfterUnlock;
    
}


document.addEventListener('DOMContentLoaded', function() {
    const skillInputs = document.querySelectorAll('[id$="skillscontainer"] input[type="number"]');
    
    skillInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const newValue = parseInt(this.value) || 0;
            const currentLevel = parseInt(document.getElementById('lvlValue').value) || 1;
            const skillAvailabilityLevel = getSkillAvailabilityLevel(this);
            const maxAllowedPoints = getMaxAllowedPoints(currentLevel, skillAvailabilityLevel);

            console.log('Input changed:', {
                skill: this.id,
                newValue,
                currentLevel,
                skillAvailabilityLevel,
                maxAllowedPoints
            });

            // If trying to put too many points
            if (newValue > maxAllowedPoints) {
                console.log('Restricting points:', {maxAllowedPoints});
                this.value = maxAllowedPoints;
                showWarning(`Cannot exceed ${maxAllowedPoints} point${maxAllowedPoints !== 1 ? 's' : ''} in this skill at level ${currentLevel}!`, true);
                e.preventDefault();
                return;
            }

            // Check total points
            const totalPoints = Array.from(skillInputs)
                .reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
            const maxTotalPoints = currentLevel + 11;

            if (totalPoints > maxTotalPoints) {
                this.value = this.dataset.lastValue || 0;
                showWarning(`Cannot exceed ${maxTotalPoints} total skill points at level ${currentLevel}!`, true);
                e.preventDefault();
                return;
            }

            // Store last valid value
            this.dataset.lastValue = this.value;
        });
    });

    // Level change handler
    document.getElementById('lvlValue').addEventListener('input', function() {
        const currentLevel = parseInt(this.value) || 1;

        
    updateVisibility();

        skillInputs.forEach(input => {
            const skillAvailabilityLevel = getSkillAvailabilityLevel(input);
            const maxAllowedPoints = getMaxAllowedPoints(currentLevel, skillAvailabilityLevel);
            const currentValue = parseInt(input.value) || 0;

            console.log('Level changed:', {
                skill: input.id,
                currentValue,
                currentLevel,
                skillAvailabilityLevel,
                maxAllowedPoints
            });

            if (currentValue > maxAllowedPoints) {
                input.value = maxAllowedPoints;
                showWarning(`Reduced points in skill due to level change!`, true);
            }
        });
    });
});

function getSkillAvailabilityLevel(skillElement) {
    // First try to get the level from data attribute
    const dataLevel = skillElement.getAttribute('data-skill-level');
    if (dataLevel) return parseInt(dataLevel);

    // Fallback to checking classes
    if (skillElement.classList.contains('hiddenSkill6')) return 6;
    if (skillElement.classList.contains('hiddenSkill12')) return 12;
    if (skillElement.classList.contains('hiddenSkill18')) return 18;
    if (skillElement.classList.contains('hiddenSkill24')) return 24;
    if (skillElement.classList.contains('hiddenSkill30')) return 30;
    return 1;
}

function updateVisibility() {
    const level = parseInt(document.getElementById('lvlValue').value) || 1;
    
    // Don't remove hiddenSkill classes, just handle display
    document.querySelectorAll('[id$="skillscontainer"] input[type="number"]').forEach(input => {
        const skillLevel = getSkillAvailabilityLevel(input);
        const container = input.closest('[id$="skillscontainer"]');
        
        // Update max points without removing classes
        const maxPoints = getMaxAllowedPoints(level, skillLevel);
        input.max = maxPoints;
        
        if (parseInt(input.value) > maxPoints) {
            input.value = maxPoints;
        }
    });
}






updateVisibility();



