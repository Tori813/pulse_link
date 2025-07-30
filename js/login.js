document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const rememberMe = document.querySelector('.checkbox');

            // Add validation
            if (!email.value.trim()) {
                alert('Please enter your email');
                return;
            }
            if (!password.value.trim()) {
                alert('Please enter your password');
                return;
            }

            // Disable submit button while processing
            const submitButton = loginForm.querySelector('input[type="submit"]');
            submitButton.disabled = true;
            submitButton.value = 'Processing...';

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email.value.trim(), password: password.value.trim() })
                });

                const data = await response.json();
                console.log('Login response:', data);

                if (response.ok) {
                    // Store the token in localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user_id', data.userId);
                    localStorage.setItem('role', data.role);

                    // Remember me functionality
                    if (rememberMe.checked) {
                        localStorage.setItem('email', email.value.trim());
                    } else {
                        localStorage.removeItem('email');
                    }

                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    console.error('Login failed response:', data);
                    alert(data.message || 'Login failed: ' + JSON.stringify(data));
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login');
            } finally {
                submitButton.disabled = false;
                submitButton.value = 'LOG IN';
            }
        });
    }
});
