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
            this.loadPartyFromStorage();
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

        // 1. Export current character to current slot
        const currentData = window.exportCharacterData ? window.exportCharacterData() : null;
        if (currentData) {
            this.partyData[this.activeIndex] = currentData;
        }

        // 2. Set new active index
        const oldIndex = this.activeIndex;
        this.activeIndex = newIndex;

        // 3. Update UI classes
        document.getElementById(`party-btn-${oldIndex}`)?.classList.remove('active');
        document.getElementById(`party-btn-${newIndex}`)?.classList.add('active');

        // 4. Load data for new slot
        const dataToLoad = this.partyData[newIndex];

        if (dataToLoad) {
            // Load existing build
            if (window.loadCharacterFromData) {
                window.loadCharacterFromData(dataToLoad, true); // true = silent
            }
        } else {
            // New/Empty slot - we could either reset or keep current but switched
            // Usually best to start with a "Fresh" character of same class or reset
            // For now, let's just keep it as is but mark it as active
            // Actually, let's just save the current character into the new slot if it was empty?
            // User said: "it will just go to P2's window where everything is customizable like from scratch"
            // So we should probably reset the UI for P2.

            this.resetToDefault();
        }

        this.savePartyToStorage();
    }

    resetToDefault() {
        // Simple way to reset: load a minimal default object
        const defaultData = {
            character: { level: 1, class: 'Amazon', stats: { str: 0, dex: 0, vit: 0, enr: 0 } },
            equipment: {},
            skills: {},
            charms: [],
            sockets: { data: {} },
            corruptions: { data: {} }
        };
        if (window.loadCharacterFromData) {
            window.loadCharacterFromData(defaultData, true); // true = silent
        }
    }

    savePartyToStorage() {
        // Save to current character/build in local storage
        try {
            const currentData = window.exportCharacterData ? window.exportCharacterData() : null;
            if (currentData) {
                this.partyData[this.activeIndex] = currentData;
            }
            localStorage.setItem('pd2_party_data', JSON.stringify({
                activeIndex: this.activeIndex,
                partyData: this.partyData
            }));
        } catch (e) {
            console.error('Failed to save party data', e);
        }
    }

    loadPartyFromStorage() {
        try {
            const stored = localStorage.getItem('pd2_party_data');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.partyData && Array.isArray(parsed.partyData)) {
                    this.partyData = parsed.partyData;

                    // Check if we should restore the active index
                    // Only do this if there's no build in the URL to avoid conflicts
                    const urlParams = new URLSearchParams(window.location.search);
                    const buildId = urlParams.get('build') || urlParams.get('id');

                    if (!buildId && parsed.activeIndex !== undefined) {
                        this.activeIndex = parsed.activeIndex;

                        // Load the data for this slot after a small delay to ensure systems are ready
                        setTimeout(() => {
                            if (this.partyData[this.activeIndex] && window.loadCharacterFromData) {
                                window.loadCharacterFromData(this.partyData[this.activeIndex], true); // true = silent
                            }
                        }, 800);
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to load party data', e);
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
