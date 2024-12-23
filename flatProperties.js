class FlatPropertyHandler {
    static properties = ['pdr', 'mdr', 'todef', 'tolife', 'tomana'];
    
    static calculateTotal(itemList, containers) {
        const totals = {};
        this.properties.forEach(prop => totals[prop] = 0);
        
        containers.forEach(containerId => {
            const select = document.getElementById(containerId);
            const itemData = itemList[select.value];
            if (itemData?.properties) {
                this.properties.forEach(prop => {
                    totals[prop] += itemData.properties[prop] || 0;
                });
            }
        });
        return totals;
    }
}