// Logout functionality
function logout() {
    // Clear any session data
    localStorage.clear();
    
    // Redirect to login page
    window.location.href = 'Login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to all logout buttons
    const logoutButtons = document.querySelectorAll('.menu-item.logout a');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            logout();
        });
    });
});
