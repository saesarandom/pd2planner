class SkillPropertyHandler {
    static calculateSkillBonuses(itemList, containers) {
        const totals = {
            allSkills: 0,
            classSkills: {},
            oskills: {},
            charges: []
        };
        
        containers.forEach(containerId => {
            const select = document.getElementById(containerId);
            const itemData = itemList[select.value];
            if (itemData?.properties) {
                totals.allSkills += itemData.properties.allsk || 0;
                // Add class skills, oskills, charges
                // ... handle specific skill properties
            }
        });
        return totals;
    }
}