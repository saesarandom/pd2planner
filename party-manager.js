/**
 * Party Manager for PD2 Character Planner
 * Handles multi-character builds (P1-P8)
 */
class PartyManager {
    constructor() {
        this.playerCount = 8;
        this.activeIndex = 0;
        this.partyData = new Array(this.playerCount).fill(null);

        // Initialize active slot with current build if we can
        // But we'll wait for DOMContentLoaded to set up listeners
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.createUI();
            this.updateUI();
        });
    }

    createUI() {
        const partyBar = document.createElement('div');
        partyBar.className = 'party-bar';
        partyBar.id = 'party-bar';

        const title = document.createElement('div');
        title.className = 'party-bar-title';
        title.textContent = 'PARTY SLOTS';
        partyBar.appendChild(title);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'party-buttons';

        for (let i = 0; i < this.playerCount; i++) {
            const btn = document.createElement('button');
            btn.className = 'party-btn' + (i === this.activeIndex ? ' active' : '');
            btn.id = `party-btn-${i}`;
            btn.textContent = i === 0 ? 'P1' : `P${i + 1}`;
            btn.onclick = () => this.switchPlayer(i);
            buttonsContainer.appendChild(btn);
        }

        partyBar.appendChild(buttonsContainer);
        document.body.appendChild(partyBar);
    }

    async switchPlayer(newIndex) {
        if (newIndex === this.activeIndex) return;
        if (window._isLoadingCharacterData) return;

        // 1. Save current slot's state
        this.saveCurrentSlot();

        // 2. Set new active index
        const oldIndex = this.activeIndex;
        this.activeIndex = newIndex;

        // 3. Update UI classes
        document.getElementById(`party-btn-${oldIndex}`)?.classList.remove('active');
        document.getElementById(`party-btn-${newIndex}`)?.classList.add('active');

        // 4. Load data for new slot
        const dataToLoad = this.partyData[newIndex];

        if (dataToLoad) {
            // Load existing build - it now clears its own state internally
            if (window.loadCharacterFromData) {
                window.loadCharacterFromData(dataToLoad, true); // true = silent
            }
        } else {
            // New/Empty slot - truly reset everything
            this.resetToDefault();
        }
    }

    saveCurrentSlot() {
        const currentData = window.exportCharacterData ? window.exportCharacterData() : null;
        if (currentData) {
            this.partyData[this.activeIndex] = currentData;
        }
    }

    resetToDefault() {
        // Clear all global states before loading default
        if (window.unifiedSocketSystem?.clearAll) window.unifiedSocketSystem.clearAll();
        if (window.charmInventory?.clearAll) window.charmInventory.clearAll();
        if (window.clearAllItemStates) window.clearAllItemStates();

        const defaultData = {
            character: { level: 1, class: 'Amazon', stats: { str: 20, dex: 25, vit: 20, enr: 15 } },
            equipment: {},
            skills: {},
            charms: [],
            sockets: { data: {} },
            corruptions: { data: {} },
            itemStates: {}
        };
        if (window.loadCharacterFromData) {
            window.loadCharacterFromData(defaultData, true); // true = silent
        }
    }

    updateUI() {
        // Redundant with switchPlayer but good for init
        for (let i = 0; i < this.playerCount; i++) {
            const btn = document.getElementById(`party-btn-${i}`);
            if (btn) {
                if (i === this.activeIndex) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }
    }
}

window.partyManager = new PartyManager();
