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
        <button id="popoverTarget">Calculator</button>
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

    document.getElementById('importBtn').addEventListener('click', importStudentsFromCSV);

    document.getElementById('searchInput').addEventListener('input', (e) => {
        displayStudents(e.target.value, sortField, sortAscending);
    });

    document.getElementById('deleteAll').addEventListener('click', () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                students = [];
                saveStudents();
                displayStudents();
                addNotification('All students deleted successfully');

                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "All students have been deleted.",
                    icon: "success"
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "The students are safe :)",
                    icon: "error"
                });
            }
        });
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortField = e.target.value;
        displayStudents(searchQuery, sortField, sortAscending);
    });

    document.getElementById('exportBtn').addEventListener('click', exportToCSV);

    document.getElementById('popoverTarget').addEventListener('click', displayStats);
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
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            deleteStudent(id);
            displayStudents();
            addNotification('Student deleted successfully');

            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "The student has been deleted.",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "The student is safe :)",
                icon: "error"
            });
        }
    });
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
            const score = document.getElementById('newScore').value;
            if (subject && score) {
                student.performance.push({ subject, score, date: new Date().toISOString() });
                updateStudent(id, { performance: student.performance });
                displayStudents();
                addNotification('Performance record added.');
            }
        });
    }
}

function importStudentsFromCSV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;
                // Process CSV contents
                // Assuming CSV structure: name,age,class,subject1,score1,subject2,score2,...
                const rows = contents.split('\n');
                rows.forEach(row => {
                    const cells = row.split(',');
                    if (cells.length > 3) {
                        const [name, age, className, ...performance] = cells;
                        const studentPerformance = [];
                        for (let i = 0; i < performance.length; i += 2) {
                            if (performance[i] && performance[i + 1]) {
                                studentPerformance.push({ subject: performance[i], score: performance[i + 1], date: new Date().toISOString() });
                            }
                        }
                        addStudent(name, parseInt(age), className, studentPerformance);
                    }
                });
                displayStudents();
                addNotification('Students imported successfully.');
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8," + "Name,Age,Class,Subjects,Scores\n";
    students.forEach(student => {
        const subjects = student.performance.map(p => p.subject).join(';');
        const scores = student.performance.map(p => p.score).join(';');
        csvContent += `${student.name},${student.age},${student.class},${subjects},${scores}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
}

function displayStats() {
    const popover = document.getElementById('popover');
    const targetRect = document.getElementById('popoverTarget').getBoundingClientRect();
    popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
    popover.style.top = `${targetRect.bottom + window.scrollY}px`;
    popover.style.left = `${targetRect.left + window.scrollX}px`;
}

function appendNumber(number) {
    const display = document.getElementById('display');
    display.value += number;
}

function calculate() {
    const display = document.getElementById('display');
    try {
        display.value = eval(display.value);
    } catch {
        display.value = 'Error';
    }
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function addNotification(message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification';
    notificationDiv.innerText = message;
    document.body.appendChild(notificationDiv);
    setTimeout(() => {
        notificationDiv.remove();
    }, 3000);
}

// Initial call to display students when the page loads
displayStudents();

// Calculator functions
function appendNumber(number) {
    const display = document.getElementById('display');
    display.value += number;
}

function clearDisplay() {
    const display = document.getElementById('display');
    display.value = '';
}

function calculate() {
    const display = document.getElementById('display');
    try {
        display.value = eval(display.value); // Be cautious with eval
    } catch (error) {
        display.value = 'Error';
    }
}

// Popover display logic
document.getElementById('popoverTarget').addEventListener('click', (event) => {
    const popover = document.getElementById('popover');
    const rect = event.target.getBoundingClientRect();
    popover.style.left = `${rect.left}px`;
    popover.style.top = `${rect.bottom}px`;
    popover.style.display = 'block';
});

document.addEventListener('click', (event) => {
    const popover = document.getElementById('popover');
    if (!popover.contains(event.target) && !event.target.matches('#popoverTarget')) {
        popover.style.display = 'none';
    }
});
