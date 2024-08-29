let notifications = [];

function addNotification(message) {
    const id = Date.now();
    notifications.push({ id, message });
    displayNotifications();
    setTimeout(() => removeNotification(id), 5000); // Auto-remove after 5 seconds
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