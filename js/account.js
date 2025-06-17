document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const submitBtn = form.querySelector('input[type="submit"]');
    const termsCheckbox = document.querySelector('.checkbox');
    const termsPopup = document.querySelector('.terms-popup');
    const termsLink = document.querySelector('.terms-link');

    // Add click event for terms and conditions
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsPopup.style.display = 'block';
    });

    // Close terms popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!termsPopup.contains(e.target)) {
            termsPopup.style.display = 'none';
        }
    });

    // Disable submit button until terms are accepted
    submitBtn.disabled = true;
    termsCheckbox.addEventListener('change', () => {
        submitBtn.disabled = !termsCheckbox.checked;
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('create-password').value,
            phoneNumber: document.getElementById('phone-number').value,
            username: document.getElementById('email').value.split('@')[0], // Use email username as username
            role: 'patient'
        };

        // Validate passwords match
        const confirmPassword = document.getElementById('confirm-password').value;
        if (formData.password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Make the account creation request
            const response = await fetch('http://localhost:3001/api/create-account', {
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
                throw new Error(error.message || 'Failed to create account');
            }

            const data = await response.json();

            if (response.ok) {
                alert('Account created successfully!');
                window.location.href = 'Login.html';
            } else {
                alert(data.message || 'Failed to create account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while creating your account');
        }
    });
});
