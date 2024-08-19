document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // Redirect to login page if not logged in
        window.location.href = 'index.html';
        return;
    }

    // Display welcome message
    const welcomeMessage = document.createElement('h2');
    welcomeMessage.textContent = `Welcome, ${loggedInUser}!`;
    document.body.insertBefore(welcomeMessage, document.body.firstChild);

    // Add logout button
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });
    document.body.insertBefore(logoutButton, document.body.firstChild);

    
    // ... rest of the dashboard.js code ...
});

// Add this to the existing event listeners in dashboard.js
addStudentBtn.addEventListener('click', () => {
    content.innerHTML = `
        <h2>Add New Student</h2>
        <form id="addStudentForm">
            <input type="text" id="studentName" placeholder="Student Name" required>
            <input type="number" id="studentAge" placeholder="Age" required>
            <input type="text" id="studentClass" placeholder="Class" required>
            <button type="submit">Add Student</button>
        </form>
    `;
    
    document.getElementById('addStudentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const age = parseInt(document.getElementById('studentAge').value);
        const className = document.getElementById('studentClass').value;
        
        const newStudent = addStudent(name, age, className);
        if (newStudent) {
            alert('Student added successfully!');
            displayStudents();
        } else {
            alert('Failed to add student. Please try again.');
        }
    });
});