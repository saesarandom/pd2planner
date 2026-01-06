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
            // Update menu buttons after auth is loaded
            const checkAuth = () => {
                if (typeof auth !== 'undefined') {
                    this.updateMenuButtons();
                } else {
                    setTimeout(checkAuth, 200);
                }
            };
            setTimeout(checkAuth, 500);
        });
    }

    createUI() {
        const partyBar = document.createElement('div');
        partyBar.className = 'party-bar';
        partyBar.id = 'party-bar';

        // Login button
        const loginBtn = document.createElement('button');
        loginBtn.className = 'party-menu-btn';
        loginBtn.id = 'login-party-btn';
        loginBtn.setAttribute('data-tooltip', 'Login');
        const loginImg = document.createElement('img');
        loginImg.src = './img/login.png';
        loginImg.alt = 'Login';
        loginBtn.appendChild(loginImg);
        loginBtn.onclick = () => {
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                authModal.style.display = 'flex';
                if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
                    if (typeof showLoggedInView === 'function') showLoggedInView();
                } else {
                    if (typeof showLoginForm === 'function') showLoginForm();
                }
                // Update user count when modal opens
                if (typeof updateUserCount === 'function') updateUserCount();
            }
        };
        partyBar.appendChild(loginBtn);

        // Craft button
        const craftBtn = document.createElement('button');
        craftBtn.className = 'party-menu-btn disabled';
        craftBtn.id = 'craft-party-btn';
        craftBtn.setAttribute('data-tooltip', 'Craft Item');
        const craftImg = document.createElement('img');
        craftImg.src = './img/crafted.png';
        craftImg.alt = 'Craft';
        craftBtn.appendChild(craftImg);
        craftBtn.onclick = () => {
            if (typeof auth !== 'undefined' && auth.isLoggedIn() && typeof openCraftingModal === 'function') {
                openCraftingModal();
            }
        };
        partyBar.appendChild(craftBtn);

        // Save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'party-menu-btn disabled';
        saveBtn.id = 'save-party-btn';
        saveBtn.setAttribute('data-tooltip', 'Save Build');
        const saveImg = document.createElement('img');
        saveImg.src = './img/save.png';
        saveImg.alt = 'Save';
        saveBtn.appendChild(saveImg);
        saveBtn.onclick = async () => {
            if (typeof auth !== 'undefined' && auth.isLoggedIn() && typeof saveCurrentBuild === 'function') {
                await saveCurrentBuild();
            }
        };
        partyBar.appendChild(saveBtn);

        // Settings button - opens profile (only when logged in)
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'party-menu-btn disabled';
        settingsBtn.id = 'settings-party-btn';
        settingsBtn.setAttribute('data-tooltip', 'Profile');
        const settingsImg = document.createElement('img');
        settingsImg.src = './img/settings.png';
        settingsImg.alt = 'Settings';
        settingsBtn.appendChild(settingsImg);
        settingsBtn.onclick = () => {
            if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.style.display = 'flex';
                    if (typeof showLoggedInView === 'function') showLoggedInView();
                    // Update user count when modal opens
                    if (typeof updateUserCount === 'function') updateUserCount();
                }
            }
        };
        partyBar.appendChild(settingsBtn);

        // Buttons container
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

    updateMenuButtons() {
        const craftBtn = document.getElementById('craft-party-btn');
        const saveBtn = document.getElementById('save-party-btn');
        const settingsBtn = document.getElementById('settings-party-btn');
        const loginBtn = document.getElementById('login-party-btn');

        if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
            // Enable craft, save, and settings buttons when logged in
            if (craftBtn) craftBtn.classList.remove('disabled');
            if (saveBtn) saveBtn.classList.remove('disabled');
            if (settingsBtn) settingsBtn.classList.remove('disabled');
            if (loginBtn) loginBtn.setAttribute('data-tooltip', auth.user.username);
        } else {
            // Disable craft, save, and settings buttons when not logged in
            if (craftBtn) craftBtn.classList.add('disabled');
            if (saveBtn) saveBtn.classList.add('disabled');
            if (settingsBtn) settingsBtn.classList.add('disabled');
            if (loginBtn) loginBtn.setAttribute('data-tooltip', 'Login / Profile');
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
