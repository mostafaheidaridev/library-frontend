import { BASE_URL } from './info.js';
import { updateAuthNavigation } from './main.js';

const loginForm = document.getElementById('login_form');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.style.display = 'none';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }

    const submitBtn = loginForm.querySelector('button');
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
        const loginData = new URLSearchParams();
        loginData.append('email', email);
        loginData.append('password', password);

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            body: loginData
        });

        const data = await response.json();

        if (data.user_id && data.auth_token) {
            sessionStorage.setItem('user_id', data.user_id);
            sessionStorage.setItem('user_token', data.auth_token);

            updateAuthNavigation();

            setTimeout(() => {
                window.location.href = data.user_id === 2679 ? "admin.html" : "user_profile.html";
            }, 100);
        } else {
            showError(data.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        showError('Connection error. Please try again later.');
        console.error('Login error:', error);
    } finally {
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}