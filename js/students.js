// Fetch and display students
async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:5000/students'); // Correct API call
        const students = await response.json(); // Parse response as JSON
        displayStudents(students); // Display students for "View Students"
        return students;  // Return the students for other functions like attendance
    } catch (error) {
        console.error('Error fetching students:', error);
        addNotification('Failed to load students. Please try again.');
        return [];  // Return an empty array in case of error
    }
}

// Add new student
async function addStudent(name, age, className, performance = []) {
    try {
        const newStudent = { name, age, class: className, performance };
        const response = await fetch('http://localhost:5000/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });
        const savedStudent = await response.json();
        fetchStudents(); // Refresh the student list
        return savedStudent;
    } catch (error) {
        console.error('Error adding student:', error);
        addNotification('Failed to add student. Please try again.');
    }
}

// Update existing student
async function updateStudent(id, updatedInfo) {
    try {
        const response = await fetch(`http://localhost:5000/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedInfo)
        });
        const updatedStudent = await response.json();
        fetchStudents(); // Refresh the student list
        return updatedStudent;
    } catch (error) {
        console.error('Error updating student:', error);
        addNotification('Failed to update student. Please try again.');
    }
}

// Delete a student
async function deleteStudent(id) {
    try {
        await fetch(`http://localhost:5000/students/${id}`, {
            method: 'DELETE'
        });
        fetchStudents(); // Refresh the student list
        addNotification('Student deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting student:', error);
        addNotification('Failed to delete student. Please try again.');
    }
}

// Delete all students
async function deleteAllStudents() {
    try {
        await fetch('http://localhost:5000/students', {
            method: 'DELETE'
        });
        fetchStudents(); // Refresh the student list
        addNotification('All students deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting all students:', error);
        addNotification('Failed to delete all students. Please try again.');
    }
}

// Display students list
function displayStudents(students, searchQuery = '', sortField = 'name', sortAscending = true, page = 1, pageSize = 10) {
    let displayedStudents = searchQuery ? searchStudents(students, searchQuery) : students;
    displayedStudents = sortStudents(displayedStudents, sortField, sortAscending);

    const totalPages = Math.ceil(displayedStudents.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedStudents = displayedStudents.slice(startIndex, startIndex + pageSize);

    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Student List</h2>
        <input type="text" id="searchInput" placeholder="Search students..." value="${searchQuery}">
        <select id="sortSelect">
            <option value="name" ${sortField === 'name' ? 'selected' : ''}>Sort by Name</option>
            <option value="age" ${sortField === 'age' ? 'selected' : ''}>Sort by Age</option>
            <option value="class" ${sortField === 'class' ? 'selected' : ''}>Sort by Class</option>
        </select>
        <button id="exportBtn"><i class="fa-solid fa-download"></i> Export to CSV</button>
        <button id="importBtn"><i class="fa-solid fa-upload"></i> Import Students from CSV</button>
        <button id="deleteAllBtn"><i class="fa-solid fa-trash"> Delete All</i></button>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Class</th>
                    <th>Subjects</th>
                    <th>Scores</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedStudents.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.age}</td>
                        <td>${student.class}</td>
                        <td>${student.performance.map(p => p.subject).join(', ')}</td>
                        <td>${student.performance.map(p => p.score).join(', ')}</td>
                        <td>
                            <button onclick="editStudent('${student._id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                            <button onclick="deleteStudent('${student._id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="pagination">
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(num => 
                `<button onclick="displayStudents(students, '${searchQuery}', '${sortField}', ${sortAscending}, ${num})" ${num === page ? 'disabled' : ''}>${num}</button>`
            ).join('')}
        </div>
    `;

    // Add event listeners for filtering, sorting, importing/exporting
    document.getElementById('importBtn').addEventListener('click', importStudentsFromCSV);
    document.getElementById('deleteAllBtn').addEventListener('click', deleteAllStudents);
    document.getElementById('searchInput').addEventListener('input', (e) => {
        displayStudents(students, e.target.value, sortField, sortAscending);
    });
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortField = e.target.value;
        displayStudents(students, searchQuery, sortField, sortAscending);
    });
    document.getElementById('exportBtn').addEventListener('click', () => exportToCSV(students));
}

// Search students
function searchStudents(students, query) {
    return students.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.class.toLowerCase().includes(query.toLowerCase())
    );
}

// Sort students by field
function sortStudents(studentsToSort, field, ascending = true) {
    return [...studentsToSort].sort((a, b) => {
        if (a[field] < b[field]) return ascending ? -1 : 1;
        if (a[field] > b[field]) return ascending ? 1 : -1;
        return 0;
    });
}

// Export to CSV
function exportToCSV(students) {
    const csvContent = "data:text/csv;charset=utf-8,Name,Age,Class,Subjects,Scores\n"
        + students.map(s => `${s.name},${s.age},${s.class},${s.performance.map(p => p.subject).join('|')},${s.performance.map(p => p.score).join('|')}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('CSV file exported successfully');
}

// Import students from CSV
function importStudentsFromCSV() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const newStudents = results.data.map((row) => {
                        const subjects = row.Subjects.split('|');
                        const scores = row.Scores.split('|');
                        const performance = subjects.map((subject, index) => ({
                            subject,
                            score: parseInt(scores[index]),
                            date: new Date().toISOString()
                        }));
                        return {
                            name: row.Name,
                            age: parseInt(row.Age),
                            class: row.Class,
                            performance
                        };
                    });
                    newStudents.forEach(student => addStudent(student.name, student.age, student.class, student.performance));
                },
            });
        }
    });
    fileInput.click();
}

// Edit a student
function editStudent(id) {
    fetch(`http://localhost:5000/students/${id}`)
        .then(response => response.json())
        .then(student => {
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentAge').value = student.age;
            document.getElementById('studentClass').value = student.class;
            document.getElementById('studentId').value = student._id;

            document.getElementById('formTitle').textContent = 'Edit Student';
        })
        .catch(error => addNotification('Failed to fetch student data', 'error'));
}

// Attendance functionality
attendanceBtn.addEventListener('click', async () => {
    const students = await fetchStudents();  // Fetch students list
    content.innerHTML = `
        <h2>Mark Attendance</h2>
        <form id="attendanceForm">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Present</th>
                        <th>Absent</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr>
                            <td>${student.name}</td>
                            <td><input type="radio" name="attendance_${student._id}" value="present"></td>
                            <td><input type="radio" name="attendance_${student._id}" value="absent"></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button type="submit">Submit Attendance</button>
        </form>
    `;

    // Handle form submission
    document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const attendanceData = [];

        document.querySelectorAll('tbody tr').forEach(row => {
            const studentId = row.querySelector('input[name^="attendance_"]').name.split('_')[1];
            const present = row.querySelector(`input[name="attendance_${studentId}"]:checked`).value === 'present';
            attendanceData.push({ studentId, present });
        });

        await fetch('http://localhost:5000/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attendanceData })
        });

        addNotification('Attendance submitted successfully', 'success');
    });
});

// Notifications
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

// Fetch students on page load
fetchStudents();
