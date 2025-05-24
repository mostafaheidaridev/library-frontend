import { BASE_URL } from './info.js';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.querySelector('#signup_form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hent og trim alle inputværdier
    const firstName = e.target.txtFirstname.value.trim();
    const lastName = e.target.txtLastname.value.trim();
    const email = e.target.txtEmail.value.trim();
    const address = e.target.txtAdress.value.trim();
    const phone = e.target.txtPhone.value.trim();
    const password = e.target.txtPassword.value.trim();
    const repeatPassword = e.target.txtRepeatPassword.value.trim();
    const birthDate = e.target['txtBirth-date'].value.trim();

    if (birthDate) {
        const selectedDate = new Date(birthDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignorer klokkeslæt

        if (selectedDate > today) {
            alert('Birth date cannot be in the future.');
            return false;
        }

        const minDate = new Date('1900-01-01');
        if (selectedDate < minDate) {
            alert('Birth date must be after 1900.');
            return false;
        }
    }

    if (password !== repeatPassword) {
        alert('Passwords do not match.');
        return false;
    }

    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return false;
    }

    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('first_name', firstName);
    params.append('last_name', lastName);
    params.append('password', password);
    params.append('address', address);
    params.append('phone_number', phone);
    params.append('birth_date', birthDate);

    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            body: params
        });
        const data = await response.json();

        if (data.user_id) {
            window.location.href = 'login.html';
            console.log('New user Created');
        } else {
            throw new Error(data.error || 'Signup failed');
        }
    } catch (err) {
        alert(err.message || 'An error occurred during signup.');
    }
});
