document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    if (!form) {
        console.error('Form not found');
        return;
    }

    const submitButton = form.querySelector('input[type="submit"]');
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const createPassword = document.getElementById('create-password');
    const confirmPassword = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms-checkbox');

    // Add validation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic validation
        if (!firstName.value.trim()) {
            alert('Please enter your first name');
            return;
        }
        if (!lastName.value.trim()) {
            alert('Please enter your last name');
            return;
        }
        if (!email.value.trim()) {
            alert('Please enter your email');
            return;
        }
        if (createPassword.value !== confirmPassword.value) {
            alert('Passwords do not match');
            return;
        }
        if (!termsCheckbox || !termsCheckbox.checked) {
            alert('Please accept the terms and conditions');
            return;
        }

        // Disable submit button while processing
        submitButton.disabled = true;
        submitButton.value = 'Processing...';

        try {
            // Logging
            console.log('Sending registration request to:', 'http://localhost:3000/api/register');
            console.log('Request body:', {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                password: '*****' // Do not log actual password
            });

            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: firstName.value.trim(),
                    lastName: lastName.value.trim(),
                    email: email.value.trim(),
                    password: createPassword.value
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const error = await response.json();
                console.error('Registration error:', error);
                alert(error.message || 'Registration failed');
                return;
            }

            const data = await response.json();
            console.log('Successful registration data:', data);

            // Store user info in localStorage
            localStorage.setItem('user_id', data.userId);
            localStorage.setItem('email', data.email);
            localStorage.setItem('firstName', firstName.value.trim());
            localStorage.setItem('lastName', lastName.value.trim());
            localStorage.setItem('role', 'user'); // Assuming default role

            form.reset();

            alert('Registration successful! Please log in.');

            setTimeout(() => {
                try {
                    window.location.href = 'http://localhost:3000/login.html';
                } catch (e) {
                    console.error('Redirect error:', e);
                    alert('Redirect failed. Please navigate to http://localhost:3000/login.html manually');
                }
            }, 1000);
        } catch (error) {
            console.error('Registration error details:', {
                error: error,
                message: error.message,
                stack: error.stack,
                name: error.name,
                type: typeof error,
                url: 'http://localhost:3000/api/register'
            });

            if (error instanceof SyntaxError) {
                alert('Invalid response from server. Please try again.');
            } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                alert('Could not connect to the server. Please make sure the server is running and try again.');
            } else if (error instanceof Error) {
                alert(`Error: ${error.name} - ${error.message}`);
            } else if (typeof error === 'object' && error !== null) {
                alert(`Server error: ${error.message || error.error || 'Unknown error'}`);
            } else {
                alert('An unexpected error occurred during registration. Please try again.');
            }
        } finally {
            submitButton.disabled = false;
            submitButton.value = 'SUBMIT';
        }
    });
});
