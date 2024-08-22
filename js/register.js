document.addEventListener('DOMContentLoaded', () => {
    // Loader Function
    function showLoader() {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        setTimeout(() => {
            loader.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }

    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        showLoader(); // Show the loader when the form is submitted

        const validationRules = {
            username: [
                { required: true },
                { minLength: 3 },
                { maxLength: 20 },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
            ],
            email: [
                { required: true },
                { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
            ],
            password: [
                { required: true },
                { minLength: 8 },
                { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }
            ],
            confirmPassword: [
                { required: true },
                { customValidation: (value) => value === document.getElementById('password').value, message: 'Passwords do not match' }
            ],
            role: [{ required: true }]
        };

        const errors = validateForm('registerForm', validationRules);

        if (Object.keys(errors).length === 0) {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
            if (existingUsers.some(user => user.username === username)) {
                // Hide loader if there's an error
                setTimeout(() => {
                    const loader = document.getElementById('loader');
                    loader.style.display = 'none';
                }, 2000);

                // Toast for existing username
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });

                Toast.fire({
                    icon: 'error',
                    title: 'Username already exists. Please choose a different one.'
                });

                return;
            }

            const newUser = { username, email, password, role };
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));

            // Toast for successful registration
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });

            Toast.fire({
                icon: 'success',
                title: 'Registration successful! You can now log in.'
            });

            // Redirect after successful registration
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000); // Ensure loader finishes before redirecting
        } else {
            // Hide loader if there are errors
            setTimeout(() => {
                const loader = document.getElementById('loader');
                loader.style.display = 'none';
            }, 2000);

            displayErrors(errors);
        }
    });
});
