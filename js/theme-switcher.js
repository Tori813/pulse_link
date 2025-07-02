// Theme switching functionality for facility pages
function switchTheme(theme) {
    // Handle 'system' theme by checking system preference
    if (theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Get all elements that need theme classes (excluding sidebar and hospital cards)
    const elementsToTheme = [
        document.documentElement, // html element
        document.body,
        document.querySelector('.container'),
        document.querySelector('.header'),
        document.querySelector('.row'),
        document.querySelector('.modal'),
        document.querySelector('.modal-content')
    ];
    
    // Get all hospital cards and explicitly ensure they stay in light mode
    const hospitalCards = document.querySelectorAll('.hospital-card, .facility-card');
    hospitalCards.forEach(card => {
        card.classList.remove('dark-mode');
        card.classList.add('light-mode');
        
        // Also remove dark mode from all child elements
        const cardElements = card.querySelectorAll('*');
        cardElements.forEach(el => {
            el.classList.remove('dark-mode');
            el.style.backgroundColor = '';
            el.style.color = '';
            el.style.borderColor = '';
        });
    });
    
    // Function to apply theme to an element
    const applyTheme = (element) => {
        if (element) {
            // Remove existing theme classes
            element.classList.remove('light-mode', 'dark-mode');
            
            // Add the new theme class
            element.classList.add(theme + '-mode');
        }
    };
    
    // Apply theme to all elements
    elementsToTheme.forEach(applyTheme);
    
    // Apply theme to body for general theming
    document.body.className = '';
    document.body.classList.add(theme + '-mode');
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Apply the saved theme
    switchTheme(savedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'system') {
            switchTheme('system');
        }
    });
});
