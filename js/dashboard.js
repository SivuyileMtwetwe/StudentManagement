document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const userRole = sessionStorage.getItem('userRole');

    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
        <h2>Welcome, ${loggedInUser} (${userRole})!</h2>
        <button id="logoutBtn">Logout</button>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('userRole');
        window.location.href = 'index.html';
    });

    const content = document.getElementById('content');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const viewStudentsBtn = document.getElementById('viewStudentsBtn');
    const viewStatsBtn = document.getElementById('viewStatsBtn');
    const groupStatsBtn = document.getElementById('groupStatsBtn');
    const advancedFilterBtn = document.getElementById('advancedFilterBtn');

    // Hide certain features based on user role
    if (userRole !== 'admin') {
        addStudentBtn.style.display = 'none';
        groupStatsBtn.style.display = 'none';
    }

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
                addNotification('Student added successfully!');
                displayStudents();
            } else {
                addNotification('Failed to add student. Please try again.');
            }
        });
    });

    viewStudentsBtn.addEventListener('click', () => displayStudents());
    viewStatsBtn.addEventListener('click', displayStats);
    groupStatsBtn.addEventListener('click', displayGroupStats);
    advancedFilterBtn.addEventListener('click', advancedFilterBtn);

    // Initially display the student list
    displayStudents();
});