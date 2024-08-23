document.addEventListener('DOMContentLoaded', () => {
    
    function showLoader() {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        setTimeout(() => {
            loader.style.display = 'none';
        }, 2000); 
    }

    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        showLoader(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        
        setTimeout(() => {
            const loader = document.getElementById('loader');
            loader.style.display = 'none';

            if (user) {
                
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
                    title: 'Signed in successfully'
                });

                sessionStorage.setItem('loggedInUser', username);
                sessionStorage.setItem('userRole', user.role);
                window.location.href = 'dashboard.html';
            } else {
                
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
                    title: 'Invalid credentials. Please try again.'
                });
            }
        }, 2000); 
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();

        
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
            icon: 'info',
            title: 'Password reset functionality would be implemented here.'
        });
    });
});
