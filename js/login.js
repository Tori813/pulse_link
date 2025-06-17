document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page loaded and script initialized');
    
    // Verify DOM elements exist
    const form = document.getElementById('login-form');
    if (!form) {
        console.error('Login form not found');
        return;
    }

    const submitBtn = form.querySelector('input[type="submit"]');
    const rememberMe = document.querySelector('.checkbox');
    const forgotPassword = document.querySelector('.forgot-password');
    const errorMessage = document.getElementById('error-message');

    // Debug log form elements
    console.log('Form elements:', {
        form: !!form,
        submitBtn: !!submitBtn,
        rememberMe: !!rememberMe,
        forgotPassword: !!forgotPassword,
        errorMessage: !!errorMessage
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.value = 'Logging in...';

        // Get form values
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            console.log('Attempting login with:', {
                email: formData.email,
                password: '***' // Mask password for security
            });

            // Make login request
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to login');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            if (response.ok) {
                // Save remember me state if checked
                if (rememberMe.checked) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('email', formData.email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('email');
                }

                // Show success message and redirect
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Login successful! Redirecting...';
                
                // Small delay before redirect for better UX
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Failed to login';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.value = 'LOG IN';
        }
    });

    // Handle remember me functionality
    if (localStorage.getItem('rememberMe') === 'true') {
        console.log('Loading remember me state');
        rememberMe.checked = true;
        document.getElementById('email').value = localStorage.getItem('email');
    }

    // Handle forgot password click
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password recovery functionality coming soon!');
    });
});
