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
        <button id="exportBtn"><i class="fa-solid fa-download"></i> Export to CSV</button>
        <button id="importBtn"><i class="fa-solid fa-upload"></i> Import Students from CSV</button>
        <button id='deleteAll'><i class="fa-solid fa-trash"> Delete All</i></button>
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
                        <td>
                            ${student.performance.map(p => p.subject).join(', ')}
                        </td>
                        <td>
                            ${student.performance.map(p => p.score).join(', ')}
                        </td>
                        <td>
                            <button onclick="editStudent(${student.id})"><i class="fa-solid fa-pen-to-square"></i>  Edit</button>
                            <button onclick="deleteStudentHandler(${student.id})"><i class="fa-solid fa-trash"></i>  Delete</button>
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
    document.getElementById('importBtn').addEventListener('click', importStudentsFromCSV)

    document.getElementById('searchInput').addEventListener('input', (e) => {
        displayStudents(e.target.value, sortField, sortAscending);

    });
    document.getElementById('deleteAll').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all students?')) {
            students = [];
            saveStudents();
            displayStudents();
            addNotification('All students deleted successfully');
        }
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
                <button type="button" id="addPerformanceBtn"><i class="fa-solid fa-circle-plus"></i>  Add Performance</button>
                <button type="submit"><i class="fa-solid fa-file-pen"></i>  Update Student</button>
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
        + students.map(s => `${s.name},${s.age},${s.class}`,${s.subjects.join(', ')},${s.scores.join(', ')}).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('CSV file exported successfully');
}

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
                    const newStudents = results.data.map((row) => ({
                        id: Date.now() + Math.random(),
                        name: row.Name,
                        age: parseInt(row.Age),
                        class: row.Class,
                        performance: [],
                    }));
                    students.push(...newStudents);
                    saveStudents();
                    displayStudents();
                    addNotification('Students imported successfully!');
                },
            });
        }
    });
    fileInput.click();
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
                <canvas id="performanceDistributionChart"></canvas>
            </div>
            <div style="width: 300px; height: 300px;">
                <canvas id="classPerformanceChart"></canvas>
            </div>
        </div>
        <p>Total Students: ${stats.totalStudents}</p>
        <p>Average Age: ${stats.averageAge}</p>
    `;

    // Performance distribution chart
    const performanceCtx = document.getElementById('performanceDistributionChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: ['0-50', '51-70', '71-80', '81-90', '91-100'],
            datasets: [{
                label: 'Performance Distribution',
                data: [
                    students.filter(s => s.performance.some(p => p.score >= 0 && p.score <= 50)).length,
                    students.filter(s => s.performance.some(p => p.score >= 51 && p.score <= 70)).length,
                    students.filter(s => s.performance.some(p => p.score >= 71 && p.score <= 80)).length,
                    students.filter(s => s.performance.some(p => p.score >= 81 && p.score <= 90)).length,
                    students.filter(s => s.performance.some(p => p.score >= 91 && p.score <= 100)).length
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

    // Class performance chart
    const classPerformanceCtx = document.getElementById('classPerformanceChart').getContext('2d');
    new Chart(classPerformanceCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats.classPerformanceDistribution),
            datasets: [
                {
                    label: 'Average Performance',
                    data: Object.values(stats.classPerformanceDistribution).map(c => c.averageScore.toFixed(2)),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                },
                {
                    label: 'Number of Students',
                    data: Object.values(stats.classPerformanceDistribution).map(c => c.count),
                    backgroundColor: 'rgba(255, 206, 86, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Performance Score / Number of Students'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function calculateStats() {
    const totalStudents = students.length;
    const averageAge = students.reduce((sum, student) => sum + student.age, 0) / totalStudents || 0;

    const classPerformanceDistribution = students.reduce((dist, student) => {
        const { class: studentClass } = student;
        const studentPerformance = student.performance.map(p => p.score);
        const averageScore = studentPerformance.length > 0 ? studentPerformance.reduce((sum, score) => sum + score, 0) / studentPerformance.length : 0;

        if (dist[studentClass]) {
            dist[studentClass].count += 1;
            dist[studentClass].averageScore = ((dist[studentClass].averageScore * (dist[studentClass].count - 1)) + averageScore) / dist[studentClass].count;
        } else {
            dist[studentClass] = {
                count: 1,
                averageScore
            };
        }

        return dist;
    }, {});

    return {
        totalStudents,
        averageAge: averageAge.toFixed(2),
        classPerformanceDistribution
    };
}