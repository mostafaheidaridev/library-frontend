export function updateAuthNavigation() {
    const authLinks = document.querySelector('.auth-links');
    const isLoggedIn = sessionStorage.getItem('user_id') && sessionStorage.getItem('user_token');
    const isAdmin = sessionStorage.getItem('user_id') === '2679';

    if (isLoggedIn) {
        let navItems = `
            <li><a href="user_profile.html">Profile</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
        `;
        
        if (isAdmin) {
            navItems = `
                <li><a href="admin.html">Admin</a></li>
                <li><a href="user_profile.html">Profile</a></li>
                <li><a href="#" id="logout-link">Logout</a></li>
            `;
        }
        
        authLinks.innerHTML = navItems;

        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear(); 
            window.location.href = 'index.html';
        });
    } else {
        authLinks.innerHTML = `
            <li><a href="signup.html">Sign Up</a></li>
            <li><a href="login.html">Login</a></li>
        `;
    }
}

updateAuthNavigation();