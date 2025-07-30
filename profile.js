// Theme switching functionality
function switchTheme(theme) {
    // Handle 'system' theme by checking system preference
    if (theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply theme
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
    
    // Save theme preference
    localStorage.setItem('theme', theme);
}

// Function to load and display profile data
async function loadAndDisplayProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!res.ok) throw new Error('Failed to fetch profile');
        
        const data = await res.json();
        
        // Update the profile display with null checks
        const updateIfExists = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value || 'N/A';
        };

        updateIfExists('firstName', data.first_name);
        updateIfExists('lastName', data.last_name);
        updateIfExists('email', data.email);
        updateIfExists('dob', data.date_of_birth);
        updateIfExists('gender', data.gender);
        updateIfExists('mobileNumber', data.phone_number);
        updateIfExists('altPhone', data.alternative_phone_number);
        updateIfExists('emergencyContact', data.emergency_contact_name);
        updateIfExists('emergencyRelationship', data.relationship);
        updateIfExists('emergencyPhone', data.emergency_contact);
        updateIfExists('address', data.address);
        updateIfExists('city', data.city);
        updateIfExists('country', data.country);
        
        // Update the welcome message
        const welcomeName = document.querySelector('.user-info span span');
        if (welcomeName) {
            welcomeName.textContent = data.first_name || 'User';
        }
        
    } catch (err) {
        console.error('Failed to load profile content:', err);
    }
}

// Theme switching and modal functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load profile when the page loads
    loadAndDisplayProfile();
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'system';
    switchTheme(savedTheme);

    // Get DOM elements
    const modal = document.getElementById('editProfileModal');
    const editBtn = document.getElementById('editProfileBtn');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelEdit');
    const profileForm = document.getElementById('profileForm');

    // Validate required elements
    if (!modal || !editBtn || !closeBtn || !cancelBtn || !profileForm) {
        console.error('One or more modal elements not found');
        return;
    }

    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Open modal and load user data
    editBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        console.log('Edit button clicked');
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to edit your profile.');
            return;
        }

        try {
            // Fetch user profile data
            const res = await fetch('http://localhost:3000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!res.ok) {
                throw new Error('Failed to fetch profile data');
            }
            
            const data = await res.json();
            
            // Pre-fill modal fields with the fetched data
            document.getElementById('editFirstName').value = data.first_name || '';
            document.getElementById('editLastName').value = data.last_name || '';
            document.getElementById('editEmail').value = data.email || '';
            document.getElementById('editDob').value = data.date_of_birth || '';
            
            // Handle gender radio buttons
            const gender = data.gender || '';
            if (gender) {
                const genderRadio = document.querySelector(`input[name="gender"][value="${gender}"]`);
                if (genderRadio) {
                    genderRadio.checked = true;
                }
            }
            
            document.getElementById('editMobile').value = data.phone_number || '';
            document.getElementById('editAltPhone').value = data.alternative_phone_number || '';
            document.getElementById('editEmergencyName').value = data.emergency_contact_name || '';
            document.getElementById('editEmergencyRelationship').value = data.relationship || '';
            document.getElementById('editEmergencyPhone').value = data.emergency_contact || '';
            document.getElementById('editAddress').value = data.address || '';
            document.getElementById('editCity').value = data.city || '';
            document.getElementById('editCountry').value = data.country || '';
            
            // Show the modal after populating fields
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
        } catch (err) {
            console.error('Error loading profile data:', err);
            alert('Failed to load profile data. Please try again.');
        }
    });

    // Close modal when clicking close button or cancel button
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close when clicking outside the modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to update your profile.');
            return;
        }
        
        // Get the selected gender from radio buttons
        const genderInput = document.querySelector('input[name="gender"]:checked');
        const gender = genderInput ? genderInput.value : '';
        
        const payload = {
            first_name: document.getElementById('editFirstName').value,
            last_name: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
            date_of_birth: document.getElementById('editDob').value,
            gender: gender,
            phone_number: document.getElementById('editMobile').value,
            alternative_phone_number: document.getElementById('editAltPhone').value,
            emergency_contact_name: document.getElementById('editEmergencyName').value,
            relationship: document.getElementById('editEmergencyRelationship').value,
            emergency_contact: document.getElementById('editEmergencyPhone').value,
            address: document.getElementById('editAddress').value,
            city: document.getElementById('editCity').value,
            country: document.getElementById('editCountry').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Update failed');
            const updateResult = await response.json();
            if (updateResult.success) {
                alert('Profile updated successfully!');
                closeModal();
                // Refresh the profile data and UI
                await loadAndDisplayProfile();
            } else {
                throw new Error(updateResult.message || 'Update failed');
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Failed to update profile.');
        }
    });
});
