// Late Loading Stats Calculator - Works with your existing setup
(function() {
    'use strict';
    
    let stats = {};
    let isCalculating = false;
    
    function resetStats() {
        stats = {
            allSkills: 0,
            magicFind: 0,
            goldFind: 0,
            defense: 0,
            ias: 0,
            fcr: 0,
            frw: 0,
            fhr: 0,
            cbf: false,
            fireResist: 0,
            coldResist: 0,
            lightResist: 0,
            poisonResist: 0,
            openWounds: 0,
            crushingBlow: 0,
            criticalHit: 0,
            deadlyStrike: 0
        };
    }
    
    function addItemProperties(props, itemName) {
        if (!props) return;
        
        // All Skills
        if (props.allsk) stats.allSkills += props.allsk;
        if (props.allskills) stats.allSkills += props.allskills;
        
        // Magic Find and Gold Find
        if (props.magicfind) stats.magicFind += props.magicfind;
        if (props.goldfind) stats.goldFind += props.goldfind;
        
        // Defense
        if (props.defense) stats.defense += props.defense;
        if (props.edef) stats.defense += props.edef;
        if (props.todef) stats.defense += props.todef;
        
        // Resistances
        if (props.firres) stats.fireResist += props.firres;
        if (props.coldres) stats.coldResist += props.coldres;
        if (props.ligres) stats.lightResist += props.ligres;
        if (props.poisres) stats.poisonResist += props.poisres;
        if (props.allres) {
            stats.fireResist += props.allres;
            stats.coldResist += props.allres;
            stats.lightResist += props.allres;
            stats.poisonResist += props.allres;
        }
        
        // Speed stats
        if (props.ias) stats.ias += props.ias;
        if (props.fcr) stats.fcr += props.fcr;
        if (props.fhr) stats.fhr += props.fhr;
        if (props.frw) stats.frw += props.frw;
        
        // Combat stats
        if (props.openwounds) stats.openWounds += props.openwounds;
        if (props.crushingblow) stats.crushingBlow += props.crushingblow;
        if (props.criticalstrike) stats.criticalHit += props.criticalstrike;
        if (props.deadlystrike) stats.deadlyStrike += props.deadlystrike;
        
        // Cannot Be Frozen
        if (props.cbf || props.freezedur) stats.cbf = true;
    }
    
    function parseDescription(desc, itemName) {
        if (!desc) return;
        
        const lines = desc.split('<br>');
        
        lines.forEach(line => {
            const cleanLine = line.trim();
            
            // All Skills
            let match = cleanLine.match(/\+(\d+) to All Skills/);
            if (match) stats.allSkills += parseInt(match[1]);
            
            // Magic Find
            match = cleanLine.match(/(\d+)%.*Better Chance of Getting Magic Items/);
            if (match) stats.magicFind += parseInt(match[1]);
            
            // Gold Find
            match = cleanLine.match(/(\d+)%.*Extra Gold/);
            if (match) stats.goldFind += parseInt(match[1]);
        });
    }
    
    function updateDisplay(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    function calculateStats() {
        if (isCalculating) return;
        isCalculating = true;
        
        try {
            resetStats();
            
            const dropdowns = [
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
            
            dropdowns.forEach(function(id) {
                const dropdown = document.getElementById(id);
                if (dropdown && dropdown.value && window.itemList && window.itemList[dropdown.value]) {
                    const item = window.itemList[dropdown.value];
                    
                    // Add properties
                    if (item.properties) {
                        addItemProperties(item.properties, dropdown.value);
                    }
                    
                    // Parse description
                    if (item.description) {
                        parseDescription(item.description, dropdown.value);
                    }
                }
            });
            
            // Update displays
            updateDisplay('allskillscontainer', stats.allSkills);
            updateDisplay('magicfindcontainer', stats.magicFind);
            updateDisplay('goldfindcontainer', stats.goldFind);
            updateDisplay('defensecontainer', stats.defense);
            updateDisplay('iascontainer', stats.ias);
            updateDisplay('fcrcontainer', stats.fcr);
            updateDisplay('frwcontainer', stats.frw);
            updateDisplay('fhrcontainer', stats.fhr);
            updateDisplay('cbfcontainer', stats.cbf ? 'Yes' : 'No');
            updateDisplay('fireresistcontainer', stats.fireResist);
            updateDisplay('coldresistcontainer', stats.coldResist);
            updateDisplay('lightresistcontainer', stats.lightResist);
            updateDisplay('poisonresistcontainer', stats.poisonResist);
            updateDisplay('owcontainer', stats.openWounds);
            updateDisplay('cbcontainer', stats.crushingBlow);
            updateDisplay('criticalhitcontainer', stats.criticalHit);
            updateDisplay('deadlystrikecontainer', stats.deadlyStrike);
            
            // Calculate derived stats
            const level = parseInt(document.getElementById('lvlValue')?.value || 1);
            updateDisplay('owdmgcontainer', Math.floor(stats.openWounds * level * 0.5));
            updateDisplay('cbdmgcontainer', stats.crushingBlow > 0 ? 25 : 0);
            
            // Fixed crit multiplier
            const critMultiplier = (1.0 + (stats.criticalHit / 100)).toFixed(2);
            updateDisplay('crithitmultipliercontainer', critMultiplier);
            
        } catch (error) {
            console.error('Stats calculation error:', error);
        } finally {
            isCalculating = false;
        }
    }
    
    function waitForEverything() {
        // Check if itemList exists
        if (typeof window.itemList === 'undefined') {
            setTimeout(waitForEverything, 200);
            return;
        }
        
        // Check if dropdowns exist and are populated
        const helmsDropdown = document.getElementById('helms-dropdown');
        if (!helmsDropdown || helmsDropdown.children.length <= 1) {
            setTimeout(waitForEverything, 200);
            return;
        }
        
        // Check if stat containers exist
        const allSkillsContainer = document.getElementById('allskillscontainer');
        if (!allSkillsContainer) {
            setTimeout(waitForEverything, 200);
            return;
        }
        
        // Everything is ready, set up listeners
        setupListeners();
    }
    
    function setupListeners() {
        console.log('📊 Setting up stats calculator listeners...');
        
        const dropdowns = [
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
        
        dropdowns.forEach(function(id) {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                dropdown.addEventListener('change', function() {
                    setTimeout(calculateStats, 50); // Delay to avoid conflicts
                });
            }
        });
        
        // Listen to character stats
        const statInputs = ['lvlValue', 'str', 'dex', 'vit', 'enr'];
        statInputs.forEach(function(id) {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function() {
                    setTimeout(calculateStats, 50);
                });
            }
        });
        
        console.log('✅ Stats calculator ready!');
        
        // Force initial calculation
        setTimeout(calculateStats, 100);
    }
    
    // Expose global function
    window.recalculateStats = calculateStats;
    
    // Wait for everything to be ready
    setTimeout(waitForEverything, 1000); // Start checking after 1 second
    
})();