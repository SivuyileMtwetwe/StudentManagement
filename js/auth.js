document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            Toast.fire({
                icon: "success",
                title: "Login successful!"
            }).then(() => {
                sessionStorage.setItem('loggedInUser', username);
                sessionStorage.setItem('userRole', user.role);
                window.location.href = 'dashboard.html';
            });
        } else {
            Toast.fire({
                icon: "error",
                title: "Invalid credentials. Please try again."
            });
        }
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        Toast.fire({
            icon: "info",
            title: "Password reset functionality would be implemented here."
        });
    });
});