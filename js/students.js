
// async function fetchStudents() {
//     try {
//         const response = await fetch('https://student-management-api-hazel.vercel.app/students');
//         const students = await response.json();
//         displayStudents(students);
//     } catch (error) {
//         console.error('Error fetching students:', error);
//         addNotification('Failed to load students. Please try again.');
//     }
// }

// async function addStudent(name, age, className, performance = []) {
//     try {
//         const newStudent = { name, age, class: className, performance };
//         const response = await fetch('https://student-management-api-hazel.vercel.app/students', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(newStudent)
//         });
//         const savedStudent = await response.json();
//         fetchStudents(); // Refresh the student list
//         return savedStudent;
//     } catch (error) {
//         console.error('Error adding student:', error);
//         addNotification('Failed to add student. Please try again.');
//     }
// }

// async function updateStudent(id, updatedInfo) {
//     try {
//         const response = await fetch(`https://student-management-api-hazel.vercel.app/students/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(updatedInfo)
//         });
//         const updatedStudent = await response.json();
//         fetchStudents(); // Refresh the student list
//         return updatedStudent;
//     } catch (error) {
//         console.error('Error updating student:', error);
//         addNotification('Failed to update student. Please try again.');
//     }
// }

// async function deleteStudent(id) {
//     try {
//         await fetch(`https://student-management-api-hazel.vercel.app/students/${id}`, {
//             method: 'DELETE'
//         });
//         fetchStudents(); // Refresh the student list
//         addNotification('Student deleted successfully', 'success');
//     } catch (error) {
//         console.error('Error deleting student:', error);
//         addNotification('Failed to delete student. Please try again.');
//     }
// }

// async function deleteAllStudents() {
//     try {
//         await fetch('https://student-management-api-hazel.vercel.app/students', {
//             method: 'DELETE'
//         });
//         fetchStudents(); // Refresh the student list
//         addNotification('All students deleted successfully', 'success');
//     } catch (error) {
//         console.error('Error deleting all students:', error);
//         addNotification('Failed to delete all students. Please try again.');
//     }
// }

// function displayStudents(students, searchQuery = '', sortField = 'name', sortAscending = true, page = 1, pageSize = 10) {
//     let displayedStudents = searchQuery ? searchStudents(students, searchQuery) : students;
//     displayedStudents = sortStudents(displayedStudents, sortField, sortAscending);

//     const totalPages = Math.ceil(displayedStudents.length / pageSize);
//     const startIndex = (page - 1) * pageSize;
//     const paginatedStudents = displayedStudents.slice(startIndex, startIndex + pageSize);

//     const contentDiv = document.getElementById('content');
//     contentDiv.innerHTML = `
//         <h2>Student List</h2>
//         <input type="text" id="searchInput" placeholder="Search students..." value="${searchQuery}">
//         <select id="sortSelect">
//             <option value="name" ${sortField === 'name' ? 'selected' : ''}>Sort by Name</option>
//             <option value="age" ${sortField === 'age' ? 'selected' : ''}>Sort by Age</option>
//             <option value="class" ${sortField === 'class' ? 'selected' : ''}>Sort by Class</option>
//         </select>
//         <button id="exportBtn"><i class="fa-solid fa-download"></i> Export to CSV</button>
//         <button id="importBtn"><i class="fa-solid fa-upload"></i> Import Students from CSV</button>
//         <button id="deleteAllBtn"><i class="fa-solid fa-trash"> Delete All</i></button>
//         <table>
//             <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Age</th>
//                     <th>Class</th>
//                     <th>Subjects</th>
//                     <th>Scores</th>
//                     <th>Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${paginatedStudents.map(student => `
//                     <tr>
//                         <td>${student.name}</td>
//                         <td>${student.age}</td>
//                         <td>${student.class}</td>
//                         <td>${student.performance.map(p => p.subject).join(', ')}</td>
//                         <td>${student.performance.map(p => p.score).join(', ')}</td>
//                         <td>
//                             <button onclick="editStudent('${student._id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
//                             <button onclick="deleteStudent('${student._id}')"><i class="fa-solid fa-trash"></i> Delete</button>
//                         </td>
//                     </tr>
//                 `).join('')}
//             </tbody>
//         </table>
//         <div class="pagination">
//             ${Array.from({ length: totalPages }, (_, i) => i + 1).map(num => 
//                 `<button onclick="displayStudents('${searchQuery}', '${sortField}', ${sortAscending}, ${num})" ${num === page ? 'disabled' : ''}>${num}</button>`
//             ).join('')}
//         </div>
//     `;

//     document.getElementById('importBtn').addEventListener('click', importStudentsFromCSV);
//     document.getElementById('deleteAllBtn').addEventListener('click', deleteAllStudents);

//     document.getElementById('searchInput').addEventListener('input', (e) => {
//         displayStudents(students, e.target.value, sortField, sortAscending);
//     });

//     document.getElementById('sortSelect').addEventListener('change', (e) => {
//         sortField = e.target.value;
//         displayStudents(students, searchQuery, sortField, sortAscending);
//     });

//     document.getElementById('exportBtn').addEventListener('click', () => exportToCSV(students));
// }

// function searchStudents(students, query) {
//     return students.filter(student => 
//         student.name.toLowerCase().includes(query.toLowerCase()) ||
//         student.class.toLowerCase().includes(query.toLowerCase())
//     );
// }

// function sortStudents(studentsToSort, field, ascending = true) {
//     return [...studentsToSort].sort((a, b) => {
//         if (a[field] < b[field]) return ascending ? -1 : 1;
//         if (a[field] > b[field]) return ascending ? 1 : -1;
//         return 0;
//     });
// }

// function exportToCSV(students) {
//     const csvContent = "data:text/csv;charset=utf-8,Name,Age,Class,Subjects,Scores\n"
//         + students.map(s => `${s.name},${s.age},${s.class},${s.performance.map(p => p.subject).join('|')},${s.performance.map(p => p.score).join('|')}`).join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "students.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     addNotification('CSV file exported successfully');
// }

// function importStudentsFromCSV() {
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = '.csv';
//     fileInput.addEventListener('change', (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             Papa.parse(file, {
//                 download: true,
//                 header: true,
//                 skipEmptyLines: true,
//                 complete: (results) => {
//                     const newStudents = results.data.map((row) => {
//                         const subjects = row.Subjects.split('|');
//                         const scores = row.Scores.split('|');
//                         const performance = subjects.map((subject, index) => ({
//                             subject,
//                             score: parseInt(scores[index]),
//                             date: new Date().toISOString()
//                         }));
//                         return {
//                             name: row.Name,
//                             age: parseInt(row.Age),
//                             class: row.Class,
//                             performance
//                         };
//                     });
//                     newStudents.forEach(student => addStudent(student.name, student.age, student.class, student.performance));
//                 },
//             });
//         }
//     });
//     fileInput.click();
// }

// function editStudent(id) {
//     fetch(`https://student-management-api-hazel.vercel.app/students/${id}`)
//         .then(response => response.json())
//         .then(student => {
//             document.getElementById('studentName').value = student.name;
//             document.getElementById('studentAge').value = student.age;
//             document.getElementById('studentClass').value = student.class;
//             document.getElementById('studentId').value = student._id;

//             document.getElementById('formTitle').textContent = 'Edit Student';
//         })
//         .catch(error => addNotification('Failed to fetch student data', 'error'));
// }

// function addNotification(message, icon = 'success') {
//     const Toast = Swal.mixin({
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         didOpen: (toast) => {
//             toast.onmouseenter = Swal.stopTimer;
//             toast.onmouseleave = Swal.resumeTimer;
//         }
//     });
//     Toast.fire({
//         icon: icon,
//         title: message
//     });
// }

fetchStudents();



let students = [];


async function fetchStudents() {
    try {
        const response = await fetch('https://student-management-api-hazel.vercel.app/students');
        students = await response.json();
        displayStudents();
    } catch (error) {
        console.error('Error fetching students:', error);
        addNotification('Failed to load students. Please try again.', 'error');
    }
}


async function addPerformanceRecord(studentId, subject, score) {
    const student = students.find(s => s._id === studentId);
    if (student) {
        student.performance.push({ subject, score, date: new Date().toISOString() });
        
        try {
            const response = await fetch(`https://student-management-api-hazel.vercel.app/students/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update performance');
            }

            fetchStudents();  
            addNotification('Performance record added successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Error updating performance:', error);
            addNotification('Failed to update performance. Please try again.', 'error');
            return false;
        }
    }
    return false;
}

function exportToCSV() {
    const csvContent = "data:text/csv;charset=utf-8,Name,Age,Class,Subjects,Scores\n"
        + students.map(s => `${s.name},${s.age},${s.class},${s.performance.map(p => p.subject).join('|')},${s.performance.map(p => p.score).join('|')}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('CSV file exported successfully', 'success');
}

function importStudentsFromCSV() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
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

                    try {
                        for (const student of newStudents) {
                            const response = await fetch('https://student-management-api-hazel.vercel.app/students', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(student)
                            });

                            if (!response.ok) {
                                throw new Error('Failed to import student');
                            }
                        }
                        fetchStudents();
                        addNotification('Students imported successfully!', 'success');
                    } catch (error) {
                        console.error('Error importing students:', error);
                        addNotification('Failed to import students. Please try again.', 'error');
                    }
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

    const classPerformanceCtx = document.getElementById('classPerformanceChart').getContext('2d');
    new Chart(classPerformanceCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats.classDistribution),
            datasets: [
                {
                    label: 'Number of Students',
                    data: Object.values(stats.classDistribution),
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
                        text: 'Number of Students'
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

// Function for advanced filtering of students
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


fetchStudents();


function addNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

