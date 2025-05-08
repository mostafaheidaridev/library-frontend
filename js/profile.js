import { BASE_URL } from './info.js';
import { getAuthHeaders } from './auth.js';

const userId = sessionStorage.getItem('user_id');
const token = sessionStorage.getItem('user_token');
const profileSection = document.getElementById('profile-section');
const editTemplate = document.getElementById('profile-template');
const readonlyTemplate = document.getElementById('profile-readonly-template');

if (!userId || !token) {
    profileSection.innerHTML = '<p class="error-message">You must be logged in to view your profile.</p>';
} else {
    loadUserProfile();
}

async function loadUserProfile() {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const user = await res.json();

        // Use readonly template and fragment
        const fragment = document.createDocumentFragment();
        const profileNode = readonlyTemplate.content.cloneNode(true);

        profileNode.querySelector('.first_name').textContent = user.first_name || '';
        profileNode.querySelector('.last_name').textContent = user.last_name || '';
        profileNode.querySelector('.email').textContent = user.email || '';
        profileNode.querySelector('.address').textContent = user.address || '';
        profileNode.querySelector('.phone_number').textContent = user.phone_number || '';
        profileNode.querySelector('.birth_date').textContent = user.birth_date ? user.birth_date.split('T')[0] : '';

        profileNode.getElementById('edit-profile-btn').addEventListener('click', () => {
            showEditProfileForm(user);
        });

        fragment.appendChild(profileNode);
        profileSection.innerHTML = '';
        profileSection.appendChild(fragment);
    } catch (err) {
        profileSection.innerHTML = `<p class="error-message">${err.message}</p>`;
    }
}

function showEditProfileForm(user) {
    const fragment = document.createDocumentFragment();
    const profileNode = editTemplate.content.cloneNode(true);

    const form = profileNode.getElementById('profile-form');
    form.elements.first_name.value = user.first_name || '';
    form.elements.last_name.value = user.last_name || '';
    form.elements.email.value = user.email || '';
    form.elements.address.value = user.address || '';
    form.elements.phone_number.value = user.phone_number || '';
    form.elements.birth_date.value = user.birth_date ? user.birth_date.split('T')[0] : '';

    // // Prevent future dates
    // const today = new Date().toISOString().split('T')[0];
    // form.elements.birth_date.max = today;

    form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const birthDate = form.elements.birth_date.value;
    if (birthDate) {
        const selectedDate = new Date(birthDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
            alert('Birth date cannot be in the future.');
            return;
        }
    }
    await updateUserProfile(new FormData(form));
});

    fragment.appendChild(profileNode);
    profileSection.innerHTML = '';
    profileSection.appendChild(fragment);
}

async function updateUserProfile(formData) {
    try {
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            params.append(key, value.trim());
        }
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: params
        });
        const data = await res.json();
        if (res.ok) {
            profileSection.innerHTML = '<p class="success-message">Profile updated successfully!</p>';
            setTimeout(() => {
                loadUserProfile();
            }, 1200);
        } else {
            profileSection.innerHTML = `<p class="error-message">${data.error || 'Failed to update profile'}</p>`;
        }
    } catch (err) {
        profileSection.innerHTML = `<p class="error-message">${err.message || 'An error occurred.'}</p>`;
    }
}