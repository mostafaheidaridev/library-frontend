
(function() {
    
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();
    
    
    const publicPages = ['login.html', 'signup.html'];
    
    
    const isPublicPage = publicPages.some(page => fileName === page);
    
    
    const isLoggedIn = sessionStorage.getItem('user_id') && sessionStorage.getItem('user_token');
    
    
    if (!isLoggedIn && !isPublicPage) {
        // Store the current URL to redirect back after login
        sessionStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = 'login.html';
    }
})();