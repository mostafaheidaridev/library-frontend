const hamburger = document.querySelector('.hamburger-menu');
const mobileMenuContainer = document.querySelector('.mobile-menu-container');
const overlay = document.querySelector('.menu-overlay');

function toggleMenu() {
    hamburger.classList.toggle('active');
    mobileMenuContainer.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

hamburger.addEventListener('click', toggleMenu);

if (closeButton) {
    closeButton.addEventListener('click', toggleMenu);
}

if (overlay) {
    overlay.addEventListener('click', toggleMenu);
}


const navItems = document.querySelectorAll('.mobile-menu-container a');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        if (hamburger.classList.contains('active')) {
            toggleMenu();
        }
    });
});

const logoutLinkMobile = document.getElementById('logout-link-mobile');
if (logoutLinkMobile) {
    logoutLinkMobile.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof handleLogout === 'function') {
            handleLogout();
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        }
    });
}