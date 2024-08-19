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
        <input type="text" id="searchInput" placeholder="Search students..." value="${