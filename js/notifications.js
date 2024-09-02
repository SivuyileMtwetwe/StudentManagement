let notifications = [];

function addNotification(message, icon = 'success') {
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
    Toast.fire({
        icon: icon,
        title: message
    });
}

function removeNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    displayNotifications();
}

function displayNotifications() {
    const notificationArea = document.getElementById('notificationArea');
    notificationArea.innerHTML = notifications.map(n => `
        <div class="notification" onclick="removeNotification(${n.id})">
            ${n.message}
        </div>
    `).join('');
}