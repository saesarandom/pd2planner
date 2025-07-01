class LevelPropertyHandler {
    static calculatePerLevel(itemList, containers, charLevel) {
        const totals = {
            deadlyStrike: 0,
            damagePerLevel: 0
        };
        
        containers.forEach(containerId => {
            const select = document.getElementById(containerId);
            const itemData = itemList[select.value];
            if (itemData?.properties) {
                if (itemData.properties.deadlyperlvl) {
                    totals.deadlyStrike += itemData.properties.deadlyperlvl * charLevel;
                }
                if (itemData.properties.dmgperlvl) {
                    totals.damagePerLevel += itemData.properties.maxdmgperlvl * charLevel;
                }
            }
        });
        return totals;
    }
}

mark