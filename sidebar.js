document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar on mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const logoutButton = document.getElementById('logoutLink') || document.querySelector('.menu-item.logout a');
    
    // Add overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Add collapse button to the sidebar
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'collapse-btn';
    collapseBtn.innerHTML = '<i class="fas fa-chevron-double-left"></i>';
    collapseBtn.setAttribute('title', 'Collapse Sidebar');
    collapseBtn.setAttribute('aria-label', 'Toggle Sidebar');
    collapseBtn.setAttribute('aria-expanded', 'false');
    sidebar.insertBefore(collapseBtn, sidebar.firstChild);
    
    // Toggle sidebar when overlay is clicked
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
        menuToggle.setAttribute('aria-expanded', 'false');
    });
    
    // Toggle sidebar when menu button is clicked
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        sidebar.classList.toggle('active');
        overlay.style.display = isExpanded ? 'none' : 'block';
    });
    
    // Handle logout
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            
            try {
                // Make logout request first while we still have the token
                if (token) {
                    try {
                        await fetch('http://localhost:3000/api/logout', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                    } catch (err) {
                        console.error('Logout API error (non-critical):', err);
                        // Continue with client-side cleanup even if API call fails
                    }
                }
                
                // Clear localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                
                console.log('User logged out successfully');
                
                // Ensure we're using the correct path for login page
                const loginPath = window.location.href.includes('profile.html') ? '../Login.html' : 'Login.html';
                window.location.href = loginPath;
            } catch (error) {
                console.error('Logout error:', error);
                alert('An error occurred while logging out');
            }
        });
    }
    
    // Set active menu item based on current page
    function setActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const menuItems = document.querySelectorAll('.menu-item a');
        
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPage.includes(href.replace('.html', ''))) {
                // Remove active class from all items
                menuItems.forEach(i => i.parentElement.classList.remove('active'));
                // Add active class to current item
                item.parentElement.classList.add('active');
            }
        });
    }
    
    // Check for saved state in localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        collapseBtn.innerHTML = '<i class="fas fa-chevron-double-right"></i>';
        collapseBtn.setAttribute('title', 'Expand Sidebar');
    }

    // Function to close sidebar (for mobile)
    function closeSidebar() {
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('active');
        }
    }


    // Toggle sidebar when menu button is clicked (for backward compatibility)
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            sidebar.classList.toggle('active');
            overlay.style.display = isExpanded ? 'none' : 'block';
        });
    }
    
    // Toggle sidebar collapse
    collapseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isCollapsing = !sidebar.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            mainContent.classList.add('expanded');
            collapseBtn.innerHTML = '<i class="fas fa-chevron-double-right"></i>';
            collapseBtn.setAttribute('title', 'Expand Sidebar');
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            mainContent.classList.remove('expanded');
            collapseBtn.innerHTML = '<i class="fas fa-chevron-double-left"></i>';
            collapseBtn.setAttribute('title', 'Collapse Sidebar');
            localStorage.setItem('sidebarCollapsed', 'false');
        }
    });

    // Close sidebar when clicking on a menu item (for mobile)
    const menuItems = document.querySelectorAll('.menu-item a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeSidebar();
            }
        });
    });

    // Close mobile menu when clicking outside (for non-overlay clicks)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Update active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    menuItems.forEach(link => {
        // Remove active class from all links
        link.parentElement.classList.remove('active');
        
        // Add active class to current page link
        const linkHref = link.getAttribute('href');
        if (linkHref && currentPage.includes(linkHref.replace('./', ''))) {
            link.parentElement.classList.add('active');
        }
    });

    // Handle logout
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your logout logic here
            console.log('Logging out...');
            // window.location.href = 'login.html';
        });
    }


    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 992) {
            sidebar.style.transform = '';
            overlay.style.display = 'none';
        } else if (!sidebar.classList.contains('active')) {
            sidebar.style.transform = 'translateX(-100%)';
        }
    }

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Initialize
    handleResize();
    setActiveMenuItem();
    
    // Close mobile menu when clicking on a menu item
    const menuLinks = document.querySelectorAll('.menu-item a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
            // Add active class to clicked item
            menuLinks.forEach(i => i.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
        });
    });
});