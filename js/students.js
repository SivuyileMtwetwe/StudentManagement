let students = JSON.parse(localStorage.getItem('students')) || [];

function addStudent(name, age, className, performance = []) {
    const newStudent = { id: Date.now(), name, age, class: className, performance };
    students.push(newStudent);
    saveStudents();
    return newStudent;
}

function getStudents() {
    return students;
}

function updateStudent(id, updatedInfo) {
    const index = students.findIndex(student => student.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...updatedInfo };
        saveStudents();
        return true;
    }
    return false;
}

function deleteStudent(id) {
    students = students.filter(student => student.id !== id);
    saveStudents();
}

function saveStudents() {
    try {
        localStorage.setItem('students', JSON.stringify(students));
    } catch (error) {
        console.error('Error saving students:', error);
        addNotification('Failed to save student data. Please try again.');
    }
}

function displayStudents(searchQuery = '', sortField = 'name', sortAscending = true, page = 1, pageSize = 10) {
    let displayedStudents = searchQuery ? searchStudents(searchQuery) : getStudents();
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
        <button id="exportBtn">Export to CSV</button>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Class</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedStudents.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.age}</td>
                        <td>${student.class}</td>
                        <td>
                            <button onclick="editStudent(${student.id})">Edit</button>
                            <button onclick="deleteStudentHandler(${student.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="pagination">
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(num => 
                `<button onclick="displayStudents('${searchQuery}', '${sortField}', ${sortAscending}, ${num})" ${num === page ? 'disabled' : ''}>${num}</button>`
            ).join('')}
        </div>
    `;

    document.getElementById('searchInput').addEventListener('input', (e) => {
        displayStudents(e.target.value, sortField, sortAscending);
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortField = e.target.value;
        displayStudents(searchQuery, sortField, sortAscending);
    });

    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
}

function searchStudents(query) {
    return students.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.class.toLowerCase().includes(query.toLowerCase())
    );
}

function sortStudents(studentsToSort, field, ascending = true) {
    return [...studentsToSort].sort((a, b) => {
        if (a[field] < b[field]) return ascending ? -1 : 1;
        if (a[field] > b[field]) return ascending ? 1 : -1;
        return 0;
    });
}

function deleteStudentHandler(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        deleteStudent(id);
        displayStudents();
        addNotification('Student deleted successfully');
    }
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (student) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `
            <h2>Edit Student</h2>
            <form id="editStudentForm">
                <input type="text" id="editName" value="${student.name}" required>
                <input type="number" id="editAge" value="${student.age}" required>
                <input type="text" id="editClass" value="${student.class}" required>
                <h3>Performance Records</h3>
                <ul>
                    ${student.performance.map(p => `<li>${p.subject}: ${p.score} (${new Date(p.date).toLocaleDateString()})</li>`).join('')}
                </ul>
                <h3>Add Performance Record</h3>
                <input type="text" id="newSubject" placeholder="Subject">
                <input type="number" id="newScore" placeholder="Score">
                <button type="button" id="addPerformanceBtn">Add Performance</button>
                <button type="submit">Update Student</button>
            </form>
        `;
        
        document.getElementById('editStudentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedInfo = {
                name: document.getElementById('editName').value,
                age: parseInt(document.getElementById('editAge').value),
                class: document.getElementById('editClass').value
            };
            if (updateStudent(id, updatedInfo)) {
                addNotification('Student updated successfully!');
                displayStudents();
            } else {
                addNotification('Failed to update student.');
            }
        });

        document.getElementById('addPerformanceBtn').addEventListener('click', () => {
            const subject = document.getElementById('newSubject').value;
            const score = parseInt(document.getElementById('newScore').value);
            if (subject && score) {
                if (addPerformanceRecord(id, subject, score)) {
                    addNotification('Performance record added successfully!');
                    editStudent(id); // Refresh the edit form
                } else {
                    addNotification('Failed to add performance record.');
                }
            } else {
                addNotification('Please enter both subject and score.');
            }
        });
    }
}

function addPerformanceRecord(studentId, subject, score) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.performance.push({ subject, score, date: new Date().toISOString() });
        saveStudents();
        return true;
    }
    return false;
}

function exportToCSV() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Age,Class\n"
        + students.map(s => `${s.name},${s.age},${s.class}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('CSV file exported successfully');
}

function calculateStats() {
    const totalStudents = students.length;
    const averageAge = students.reduce((sum, student) => sum + student.age, 0) / totalStudents || 0;
    const classDistribution = students.reduce((dist, student) => {
        dist[student.class] = (dist[student.class] || 0) + 1;
        return dist;
    }, {});

    return {
        totalStudents,
        averageAge: averageAge.toFixed(2),
        classDistribution
    };
}

function displayStats() {
    const stats = calculateStats();
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Student Statistics</h2>
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
            <div style="width: 300px; height: 300px;">
                <canvas id="ageDistributionChart"></canvas>
            </div>
            <div style="width: 300px; height: 300px;">
                <canvas id="classDistributionChart"></canvas>
            </div>
        </div>
        <p>Total Students: ${stats.totalStudents}</p>
        <p>Average Age: ${stats.averageAge}</p>
    `;

    // Age distribution chart
    const ageCtx = document.getElementById('ageDistributionChart').getContext('2d');
    new Chart(ageCtx, {
        type: 'bar',
        data: {
            labels: ['<18', '18-21', '22-25', '26+'],
            datasets: [{
                label: 'Age Distribution',
                data: [
                    students.filter(s => s.age < 18).length,
                    students.filter(s => s.age >= 18 && s.age <= 21).length,
                    students.filter(s => s.age >= 22 && s.age <= 25).length,
                    students.filter(s => s.age > 25).length
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                }
            }
        }
    });

    // Class distribution chart
    const classCtx = document.getElementById('classDistributionChart').getContext('2d');
    new Chart(classCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(stats.classDistribution),
            datasets: [{
                data: Object.values(stats.classDistribution),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function displayGroupStats() {
    const stats = calculateStats();
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Group Statistics</h2>
        <p>Total Students: ${stats.totalStudents}</p>
        <p>Number of Classes: ${Object.keys(stats.classDistribution).length}</p>
        <h3>Students per Class:</h3>
        <ul>
            ${Object.entries(stats.classDistribution).map(([className, count]) => 
                `<li>${className}: ${count} student(s)</li>`
            ).join('')}
        </ul>
    `;
}

function advancedFilter() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Advanced Filter</h2>
        <form id="advancedFilterForm">
            <label>
                Age Range:
                <input type="number" id="minAge" placeholder="Min Age">
                <input type="number" id="maxAge" placeholder="Max Age">
            </label>
            <label>
                Class:
                <select id="classFilter">
                    <option value="">All Classes</option>
                    ${[...new Set(students.map(s => s.class))].map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </label>
            <button type="submit">Apply Filter</button>
        </form>
        <div id="filterResults"></div>
    `;

    document.getElementById('advancedFilterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const minAge = document.getElementById('minAge').value;
        const maxAge = document.getElementById('maxAge').value;
        const classFilter = document.getElementById('classFilter').value;

        const filteredStudents = students.filter(student => 
            (!minAge || student.age >= minAge) &&
            (!maxAge || student.age <= maxAge) &&
            (!classFilter || student.class === classFilter)
        );

        document.getElementById('filterResults').innerHTML = `
            <h3>Filtered Results (${filteredStudents.length} students)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Class</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredStudents.map(student => `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.age}</td>
                            <td>${student.class}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
}