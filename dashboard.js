// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
        return;
    }

    // Add event listeners and initialize dashboard components
    initializeDashboard();
});

function initializeDashboard() {
    // Add any dashboard-specific initialization code here
    console.log('Dashboard initialized');
    
    // Example: Add click handler for hospital cards
    const hospitalCards = document.querySelectorAll('.hospital-card');
    hospitalCards.forEach(card => {
        card.addEventListener('click', () => {
            const hospitalName = card.querySelector('h3')?.textContent || 'this hospital';
            alert(`You selected ${hospitalName}. This would navigate to more details in a real application.`);
        });
    });

    // Add any other dashboard functionality here
}

// Handle logout
function handleLogout() {
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Clear local storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        } else {
            console.error('Logout failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        // Still clear local storage and redirect even if the request fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });
}

// Make handleLogout available globally if needed
window.handleLogout = handleLogout;
