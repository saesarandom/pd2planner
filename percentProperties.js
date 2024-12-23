class PercentPropertyHandler {
    static properties = ['coldres', 'firres', 'ligres', 'poisres', 'curres', 'physdr'];
    
    static calculateTotal(itemList, containers) {
        const totals = {};
        this.properties.forEach(prop => totals[prop] = 0);
        
        containers.forEach(containerId => {
            const select = document.getElementById(containerId);
            const itemData = itemList[select.value];
            if (itemData?.properties) {
                this.properties.forEach(prop => {
                    totals[prop] += itemData.properties[prop] || 0;
                    // Add allres if exists
                    if (itemData.properties.allres) {
                        totals[prop] += itemData.properties.allres;
                    }
                });
            }
        });
        return totals;
    }
}