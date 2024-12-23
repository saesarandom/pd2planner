class EnhancedDamageCalculator {
    constructor(itemList) {
        this.itemList = itemList;
        this.containers = [
            'helms-dropdown',
            'armors-dropdown', 
            // 'weapons-dropdown',
            // 'offs-dropdown',
            'gloves-dropdown',
            'belts-dropdown',
            'boots-dropdown',
            'ringsone-dropdown',
            'ringstwo-dropdown',
            'amulets-dropdown'
        ];
    }

    calculateTotal() {
        return this.containers.reduce((total, containerId) => {
            const select = document.getElementById(containerId);
            const itemData = this.itemList[select.value];
            return total + (itemData?.properties?.edmg || 0);
        }, 0) / 100;
    }

    applyToDamage(baseDamage, skillModifier) {
        const enhancedDamage = this.calculateTotal();
        return baseDamage * (1 + skillModifier/100  + enhancedDamage);
    }
}

window.damageCalculator = new EnhancedDamageCalculator(itemList);