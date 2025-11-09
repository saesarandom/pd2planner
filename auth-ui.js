// Auth UI Components for PD2 Planner

function createAuthUI() {
    // Create profile button (bright green, middle-right)
    const profileBtn = document.createElement('div');
    profileBtn.id = 'profile-btn';
    profileBtn.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span id="profile-username"></span>
    `;
    document.body.appendChild(profileBtn);

    // Create auth modal
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <span class="auth-close">&times;</span>

            <div id="auth-tabs">
                <button class="auth-tab active" data-tab="login">Login</button>
                <button class="auth-tab" data-tab="register">Register</button>
            </div>

            <!-- Login Form -->
            <div id="login-form" class="auth-form active">
                <h2>Login to PD2 Planner</h2>
                <input type="text" id="login-username" placeholder="Username" autocomplete="username">
                <input type="password" id="login-password" placeholder="Password" autocomplete="current-password">
                <div class="auth-error" id="login-error"></div>
                <button id="login-submit" class="auth-submit">Login</button>
            </div>

            <!-- Register Form -->
            <div id="register-form" class="auth-form">
                <h2>Create Account</h2>
                <input type="text" id="register-username" placeholder="Username" autocomplete="username">
                <input type="password" id="register-password" placeholder="Password" autocomplete="new-password">
                <input type="email" id="register-email" placeholder="Email (optional, for password recovery)">
                <div class="auth-error" id="register-error"></div>
                <button id="register-submit" class="auth-submit">Create Account</button>
            </div>

            <!-- Logged In View -->
            <div id="logged-in-view" class="auth-form">
                <h2>Welcome, <span id="user-display-name"></span>!</h2>
                <div class="auth-stats">
                    <p>Member since: <span id="user-created"></span></p>
                    <p>Saved builds: <span id="user-builds-count">0</span></p>
                </div>
                <button id="view-builds-btn" class="auth-button">My Builds</button>
                <button id="logout-btn" class="auth-button logout">Logout</button>
            </div>

            <!-- Builds List View -->
            <div id="builds-list-view" class="auth-form">
                <div class="builds-header">
                    <h2>My Builds</h2>
                    <button id="back-to-profile" class="auth-back">← Back</button>
                </div>
                <div id="builds-list"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Initialize event listeners
    setupAuthListeners();
    updateProfileButton();
}

function setupAuthListeners() {
    const modal = document.getElementById('auth-modal');
    const profileBtn = document.getElementById('profile-btn');
    const closeBtn = document.querySelector('.auth-close');

    // Open modal
    profileBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        if (auth.isLoggedIn()) {
            showLoggedInView();
        } else {
            showLoginForm();
        }
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.tab === 'login') {
                showLoginForm();
            } else {
                showRegisterForm();
            }
        });
    });

    // Login
    document.getElementById('login-submit').addEventListener('click', async () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        if (!username || !password) {
            errorEl.textContent = 'Please enter username and password';
            return;
        }

        const result = await auth.login(username, password);
        if (result.success) {
            updateProfileButton();
            showLoggedInView();
            errorEl.textContent = '';
        } else {
            errorEl.textContent = result.error;
        }
    });

    // Register
    document.getElementById('register-submit').addEventListener('click', async () => {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const email = document.getElementById('register-email').value.trim();
        const errorEl = document.getElementById('register-error');

        if (!username || !password) {
            errorEl.textContent = 'Please enter username and password';
            return;
        }

        if (username.length < 3) {
            errorEl.textContent = 'Username must be at least 3 characters';
            return;
        }

        if (password.length < 6) {
            errorEl.textContent = 'Password must be at least 6 characters';
            return;
        }

        const result = await auth.register(username, password, email || null);
        if (result.success) {
            updateProfileButton();
            showLoggedInView();
            errorEl.textContent = '';
        } else {
            errorEl.textContent = result.error;
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        auth.logout();
    });

    // View builds
    document.getElementById('view-builds-btn').addEventListener('click', async () => {
        await showBuildsView();
    });

    // Back to profile
    document.getElementById('back-to-profile').addEventListener('click', () => {
        showLoggedInView();
    });

    // Enter key support
    document.getElementById('login-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('login-submit').click();
    });
    document.getElementById('register-email').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('register-submit').click();
    });
}

function showLoginForm() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('login-form').classList.add('active');
    document.getElementById('login-error').textContent = '';
}

function showRegisterForm() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('register-form').classList.add('active');
    document.getElementById('register-error').textContent = '';
}

function showLoggedInView() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('logged-in-view').classList.add('active');

    if (auth.user) {
        document.getElementById('user-display-name').textContent = auth.user.username;
        const createdDate = new Date(auth.user.created_at);
        document.getElementById('user-created').textContent = createdDate.toLocaleDateString();

        // Load builds count
        auth.getCharacters().then(builds => {
            document.getElementById('user-builds-count').textContent = builds.length;
        });
    }
}

async function showBuildsView() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('builds-list-view').classList.add('active');

    const buildsList = document.getElementById('builds-list');
    buildsList.innerHTML = '<p class="loading">Loading builds...</p>';

    const builds = await auth.getCharacters();

    if (builds.length === 0) {
        buildsList.innerHTML = '<p class="no-builds">No saved builds yet. Create one to get started!</p>';
        return;
    }

    buildsList.innerHTML = builds.map(build => `
        <div class="build-item" data-build-id="${build.build_id}">
            <div class="build-info">
                <h3>${build.character_name}</h3>
                <p class="build-meta">
                    <span>👁 ${build.views} views</span>
                    <span>📅 ${new Date(build.created_at).toLocaleDateString()}</span>
                </p>
            </div>
            <div class="build-actions">
                <button class="build-load" data-build-id="${build.build_id}">Load</button>
                <button class="build-share" data-build-id="${build.build_id}">Share</button>
                <button class="build-delete" data-build-id="${build.build_id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Add event listeners for build actions
    document.querySelectorAll('.build-load').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const buildId = e.target.dataset.buildId;
            const build = builds.find(b => b.build_id === buildId);
            if (build) {
                loadCharacterData(build.character_data);
                document.getElementById('auth-modal').style.display = 'none';
            }
        });
    });

    document.querySelectorAll('.build-share').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buildId = e.target.dataset.buildId;
            const shareUrl = `https://pd2planner.net/?build=${buildId}`;
            navigator.clipboard.writeText(shareUrl);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Share', 2000);
        });
    });

    document.querySelectorAll('.build-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const buildId = e.target.dataset.buildId;
            if (confirm('Are you sure you want to delete this build?')) {
                await auth.deleteCharacter(buildId);
                await showBuildsView(); // Refresh list
            }
        });
    });
}

function updateProfileButton() {
    const profileBtn = document.getElementById('profile-btn');
    const usernameSpan = document.getElementById('profile-username');

    if (auth.isLoggedIn()) {
        profileBtn.classList.add('logged-in');
        usernameSpan.textContent = auth.user.username;
    } else {
        profileBtn.classList.remove('logged-in');
        usernameSpan.textContent = 'Login';
    }
}

// Function to load character data - will be implemented by integrating with existing CharacterManager
function loadCharacterData(characterData) {
    console.log('Loading character:', characterData);
    // This will be implemented in main.js integration
    if (typeof window.loadCharacterFromData === 'function') {
        window.loadCharacterFromData(characterData);
    } else {
        alert('Character loading functionality not yet integrated. Check console for data.');
        console.log('Character data to load:', characterData);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAuthUI);
} else {
    createAuthUI();
}
