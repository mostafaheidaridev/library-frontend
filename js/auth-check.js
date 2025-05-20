
(function() {
    const currentPagePath = window.location.pathname;
    const currentPageName = currentPagePath.split('/').pop();
    
    const publicAccessPages = ['login.html', 'signup.html'];
    
    const isCurrentPagePublic = publicAccessPages.some(page => currentPageName === page);
    
    const isUserAuthenticated = sessionStorage.getItem('user_id') && sessionStorage.getItem('user_token');
    
    if (!isUserAuthenticated && !isCurrentPagePublic) {
        sessionStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = 'login.html';
    }

    function updateNavigationMenu(userDetails) {
        const desktopAuthLinks = document.querySelector('.auth-links');
        const mobileAuthLinks = document.querySelector('.mobile-auth-links');
        const mobileNavLinks = document.querySelector('.mobile-nav-links');
        
        if (!desktopAuthLinks) return;
        
        desktopAuthLinks.innerHTML = '';
        
        if (mobileAuthLinks) {
            mobileAuthLinks.innerHTML = '';
        }
        
        if (userDetails) {

            if (userDetails.role === 'admin') {
                const adminNavItem = document.createElement('li');
                adminNavItem.innerHTML = '<a href="admin.html" title="Admin Page">Admin</a>';
                desktopAuthLinks.appendChild(adminNavItem);
                
                if (mobileNavLinks) {
                    let adminLinkExists = false;
                    mobileNavLinks.querySelectorAll('a').forEach(link => {
                        if (link.href.includes('admin.html')) adminLinkExists = true;
                    });
                    
                    if (!adminLinkExists) {
                        const mobileAdminItem = document.createElement('li');
                        mobileAdminItem.innerHTML = '<a href="admin.html" title="Admin Page">Admin</a>';
                        mobileNavLinks.appendChild(mobileAdminItem);
                    }
                }
            }
            
            const logoutNavItem = document.createElement('li');
            logoutNavItem.innerHTML = '<a href="#" id="logout-link" title="Logout">Logout</a>';
            desktopAuthLinks.appendChild(logoutNavItem);
            
            if (mobileAuthLinks) {
                const mobileLogoutItem = document.createElement('li');
                mobileLogoutItem.innerHTML = '<a href="#" id="logout-link-mobile" title="Logout">Logout</a>';
                mobileAuthLinks.appendChild(mobileLogoutItem);
            }
            
            
            document.getElementById('logout-link')?.addEventListener('click', handleLogout);
            document.getElementById('logout-link-mobile')?.addEventListener('click', handleLogout);
        } else {
            
            const signupNavItem = document.createElement('li');
            signupNavItem.innerHTML = '<a href="signup.html" title="Signup Page">Sign Up</a>';
            desktopAuthLinks.appendChild(signupNavItem);
            
            const loginNavItem = document.createElement('li');
            loginNavItem.innerHTML = '<a href="login.html" title="Login Page">Login</a>';
            desktopAuthLinks.appendChild(loginNavItem);
            
            
            if (mobileAuthLinks) {
                mobileAuthLinks.innerHTML = `
                    <li><a href="signup.html" title="Signup Page">Sign Up</a></li>
                    <li><a href="login.html" title="Login Page">Login</a></li>
                `;
            }
            
            
            if (mobileNavLinks) {
                mobileNavLinks.querySelectorAll('li').forEach(navItem => {
                    if (navItem.querySelector('a')?.href.includes('admin.html')) {
                        navItem.remove();
                    }
                });
            }
        }
    }
})();