export function updateAuthNavigation() {
    const authLinks = document.querySelector('.auth-links');
    const mobileAuthLinks = document.querySelector('.mobile-auth-links');
    const isLoggedIn = sessionStorage.getItem('user_id') && sessionStorage.getItem('user_token');
    const isAdmin = sessionStorage.getItem('user_id') === '2679';

    if (isLoggedIn) {
        let navItems = `
            <li><a href="user_profile.html">Profile</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
        `;

        let mobileNavItems = `
            <li><a href="user_profile.html">Profile</a></li>
            <li><a href="#" id="logout-link-mobile">Logout</a></li>
        `;

        if (isAdmin) {
            navItems = `
                <li><a href="admin.html">Admin</a></li>
                <li><a href="user_profile.html">Profile</a></li>
                <li><a href="#" id="logout-link">Logout</a></li>
            `;

            mobileNavItems = `
                <li><a href="user_profile.html">Profile</a></li>
                <li><a href="#" id="logout-link-mobile">Logout</a></li>
            `;
        }

        authLinks.innerHTML = navItems;
        if (mobileAuthLinks) {
            mobileAuthLinks.innerHTML = mobileNavItems;
        }

        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });

        const mobileLogoutLink = document.getElementById('logout-link-mobile');
        if (mobileLogoutLink) {
            mobileLogoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.clear();
                window.location.href = 'index.html';
            });
        }
    } else {
        authLinks.innerHTML = `
            <li><a href="signup.html">Sign Up</a></li>
            <li><a href="login.html">Login</a></li>
        `;

        if (mobileAuthLinks) {
            mobileAuthLinks.innerHTML = `
                <li><a href="signup.html">Sign Up</a></li>
                <li><a href="login.html">Login</a></li>
            `;
        }
    }
}

updateAuthNavigation();