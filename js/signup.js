import { BASE_URL } from './info.js';


const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

document.querySelector('#signup_form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = e.target.txtPassword.value.trim();
    const repeatPassword = e.target.txtRepeatPassword.value.trim();

    const birthDate = e.target['txtBirth-date'].value.trim();

    // Prevent future birth dates
    if (birthDate) {
        const selectedDate = new Date(birthDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time part
        if (selectedDate > today) {
            alert('Birth date cannot be in the future.');
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

    
    const firstName = e.target.txtFirstname.value.trim();
    const lastName = e.target.txtLastname.value.trim();
    const email = e.target.txtEmail.value.trim();
    const address = e.target.txtAdress.value.trim();
    const phone = e.target.txtPhone.value.trim();
    

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