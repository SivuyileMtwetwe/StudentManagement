function addNotification(message) {
    Toast.fire({
        icon: "info", // You can change the icon based on the type of notification
        title: message
    });
}

// Remove the following functions as they are no longer needed:
// - removeNotification
// - displayNotifications

// Your notifications will now be displayed as toasts using SweetAlert2
