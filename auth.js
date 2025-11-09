// Authentication system for PD2 Planner
// Handles login, register, and user session


const API_URL = 'https://pd2-planner-api.saesarandom.workers.dev'; // Replace with your Cloudflare Worker URL

class Auth {
    constructor() {
        this.user = null;
        this.token = null;
        this.loadUser();
    }

    loadUser() {
        const userData = localStorage.getItem('pd2_user');
        if (userData) {
            this.user = JSON.parse(userData);
        }
        const tokenData = localStorage.getItem('pd2_token');
        if (tokenData) {
            this.token = tokenData;
        }
    }

    saveUser(user, token = null) {
        this.user = user;
        localStorage.setItem('pd2_user', JSON.stringify(user));
        if (token) {
            this.token = token;
            localStorage.setItem('pd2_token', token);
        }
    }

    clearUser() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('pd2_user');
        localStorage.removeItem('pd2_token');
    }

    getToken() {
        return this.token;
    }

    isLoggedIn() {
        return this.user !== null;
    }

    async register(username, password, email = null) {
        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            this.saveUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login(username, password) {
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            this.saveUser(data.user, data.token);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.clearUser();
        window.location.reload();
    }

    async saveCharacter(characterName, characterData) {
        if (!this.isLoggedIn()) {
            throw new Error('Must be logged in to save characters');
        }

        try {
            const response = await fetch(`${API_URL}/api/characters/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.user.id,
                    characterName,
                    characterData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save character');
            }

            // Return both character and any newly unlocked achievements
            return {
                character: data.character,
                newAchievements: data.newAchievements || []
            };
        } catch (error) {
            throw error;
        }
    }

    async getCharacters() {
        if (!this.isLoggedIn()) {
            return [];
        }

        try {
            const response = await fetch(`${API_URL}/api/characters?userId=${this.user.id}`);
            const data = await response.json();
            return data.characters || [];
        } catch (error) {
            console.error('Failed to load characters:', error);
            return [];
        }
    }

    async updateCharacter(buildId, characterData) {
        if (!this.isLoggedIn()) {
            throw new Error('Must be logged in to update characters');
        }

        try {
            const response = await fetch(`${API_URL}/api/characters/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.user.id,
                    buildId,
                    characterData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update character');
            }

            return data.character;
        } catch (error) {
            throw error;
        }
    }

    async deleteCharacter(buildId) {
        if (!this.isLoggedIn()) {
            throw new Error('Must be logged in to delete characters');
        }

        try {
            const response = await fetch(`${API_URL}/api/characters/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.user.id,
                    buildId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete character');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    async getBuild(buildId) {
        try {
            const response = await fetch(`${API_URL}/api/build/${buildId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Build not found');
            }

            return data.build;
        } catch (error) {
            throw error;
        }
    }

    async unlockAchievement(achievementId, achievementData = {}) {
        if (!this.isLoggedIn()) return;

        try {
            await fetch(`${API_URL}/api/achievements/unlock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.user.id,
                    token: this.getToken(),
                    achievementId,
                    achievementData
                })
            });
        } catch (error) {
            console.error('Failed to unlock achievement:', error);
        }
    }

    async getAchievements() {
        if (!this.isLoggedIn()) return [];

        try {
            const response = await fetch(`${API_URL}/api/achievements?userId=${this.user.id}`);
            const data = await response.json();
            return data.achievements || [];
        } catch (error) {
            console.error('Failed to load achievements:', error);
            return [];
        }
    }

    async getSettings() {
        if (!this.isLoggedIn()) return {};

        try {
            const response = await fetch(`${API_URL}/api/settings?userId=${this.user.id}`);
            const data = await response.json();
            return data.settings || {};
        } catch (error) {
            console.error('Failed to load settings:', error);
            return {};
        }
    }

    async saveSettings(darkMode, settings = {}) {
        if (!this.isLoggedIn()) return;

        try {
            await fetch(`${API_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.user.id,
                    darkMode,
                    settings
                })
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }
}

// Initialize auth globally
window.auth = new Auth();
