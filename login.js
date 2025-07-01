async function login(email, password) {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (data.token) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Make authenticated requests
async function makeAuthenticatedRequest(url) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Logout function
function logout() {
    localStorage.removeItem('token');
}

// Example usage:
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const success = await login(email, password);
    if (success) {
        console.log('Logged in successfully');
        // Redirect or update UI
    }
});