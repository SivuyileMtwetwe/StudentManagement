document.addEventListener("DOMContentLoaded", () => {
  function showLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "block";

    setTimeout(() => {
      loader.style.display = "none";
    }, 2000);
  }

  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const userRole = sessionStorage.getItem("userRole");

  if (!loggedInUser) {
    window.location.href = "index.html";
    return;
  }

  const userInfo = document.getElementById("userInfo");
  userInfo.innerHTML = `
        <h2>Welcome, ${loggedInUser} (${userRole})!</h2>
        <button id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i>  Logout</button>
    `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("userRole");
    window.location.href = "index.html";
  });

  const content = document.getElementById("content");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const viewStudentsBtn = document.getElementById("viewStudentsBtn");
  const viewStatsBtn = document.getElementById("viewStatsBtn");
  const groupStatsBtn = document.getElementById("groupStatsBtn");
  const advancedFilterBtn = document.getElementById("advancedFilterBtn");

  if (userRole !== "admin") {
    addStudentBtn.style.display = "none";
    groupStatsBtn.style.display = "none";
  }

  addStudentBtn.addEventListener("click", () => {
    showLoader();

    content.innerHTML = `
            <h2>Add New Student</h2>
            <form id="addStudentForm">
                <input type="text" id="studentName" placeholder="Student Name" required>
                <input type="number" id="studentAge" placeholder="Age" required>
                <input type="text" id="studentClass" placeholder="Class" required>
                <button type="submit"><i class="fa-solid fa-user-plus"></i>  Add Student</button>
            </form>
        `;

    document
      .getElementById("addStudentForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        showLoader();

        const name = document.getElementById("studentName").value;
        const age = parseInt(document.getElementById("studentAge").value);
        const className = document.getElementById("studentClass").value;

        const newStudent = addStudent(name, age, className);
        if (newStudent) {
          addNotification("Student added successfully!");
          displayStudents();
        } else {
          addNotification("Failed to add student. Please try again.");
        }
      });
  });

  viewStudentsBtn.addEventListener("click", () => {
    showLoader();
    displayStudents();
  });

  viewStatsBtn.addEventListener("click", () => {
    showLoader();
    displayStats();
  });

  groupStatsBtn.addEventListener("click", () => {
    showLoader();
    displayGroupStats();
  });

  advancedFilterBtn.addEventListener("click", () => {
    showLoader();
    advancedFilter();
  });

  displayStudents();
});

attendanceBtn.addEventListener("click", () => {
  content.innerHTML = `
     <h2>Mark Attendance</h2>
<table id="attendanceTable">
    <thead>
        <tr>
            <th>Student Name</th>
            <th>Present</th>
            <th>Absent</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
<button id="submitAttendanceBtn">Submit Attendance</button>

    `;
  document
    .getElementById("attendanceForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const studentName = document.getElementById("studentName").value;
      await fetch("http://localhost:5000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName }),
      });
      addNotification("Attendance signed successfully!");
    });
});

materialsBtn.addEventListener("click", async () => {
  const response = await fetch("http://localhost:5000/materials");
  const materials = await response.json();
  content.innerHTML = `
        <h2>Materials</h2>
        <ul>${materials
          .map(
            (material) =>
              `<li><a href="${material.link}">${material.name}</a></li>`
          )
          .join("")}</ul>

        <form id="uploadMaterialForm" enctype="multipart/form-data">
        <input type="file" id="materialFile" name="file" required>
        <button type="submit">Upload Material</button>

    

<div id="Bookcontent"></div>

    </form>
    `;
});

performanceBtn.addEventListener("click", async () => {
  const response = await fetch("http://localhost:5000/students/performance");
  const performance = await response.json();
  content.innerHTML = `
        <h2>Performance</h2>
        <ul>${performance
          .map((record) => `<li>${record.subject}: ${record.score}</li>`)
          .join("")}</ul>
    `;
});

setInterval(async () => {
  const response = await fetch("http://localhost:5000/notifications");
  const notifications = await response.json();

  notifications.forEach((notification) => {
    addNotification(notification.message, notification.icon);
  });
}, 30000);

document
  .getElementById("uploadMaterialForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", document.getElementById("materialFile").files[0]);
    formData.append("postedBy", "TeacherName");

    const response = await fetch("http://localhost:5000/materials/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.message === "Material uploaded successfully") {
      addNotification(result.message, "success");
    } else {
      addNotification(result.message, "error");
    }
  });

setInterval(async () => {
  const response = await fetch("http://localhost:5000/attandance");
  const notifications = await response.json();

  notifications.forEach((notification) => {
    addNotification(notificationsignAttendance, notification.icon);
  });
}, 30000);

document
  .getElementById("submitAttendanceBtn")
  .addEventListener("click", async () => {
    const attendanceData = [];

    document.querySelectorAll("tbody tr").forEach((row) => {
      const studentId = row
        .querySelector('input[name^="attendance_"]')
        .name.split("_")[1];
      const present =
        row.querySelector(`input[name="attendance_${studentId}"]:checked`)
          .value === "present";

      attendanceData.push({ studentId, present });
    });

    const response = await fetch("http://localhost:5000/attendance/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceData }),
    });

    const result = await response.json();
    if (result.message === "Attendance saved successfully") {
      addNotification("Attendance submitted successfully", "success");
    } else {
      addNotification("Failed to submit attendance", "error");
    }
  });

attendanceBtn.addEventListener("click", () => {
  fetchStudents().then((students) => {
    displayAttendanceForm(students);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const booksUrl = "https://freetestapi.com/api/v1/books";
  const contentDiv = document.getElementById("Bookcontent");

  function displayBooks(books) {
    contentDiv.innerHTML = "<h2>Books List</h2>";

    if (books.length === 0) {
      contentDiv.innerHTML += "<p>No books available at the moment.</p>";
      return;
    }

    const booksHTML = books
      .map(
        (book) => `
            <div class="book-item">
                <img src="${book.cover_image}" alt="${
          book.title
        }" class="book-cover">
                <div>
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Publication Year:</strong> ${
                      book.publication_year
                    }</p>
                    <p><strong>Description:</strong> ${book.description}</p>
                    <p><strong>Genre:</strong> ${book.genre.join(", ")}</p>
                </div>
            </div>
        `
      )
      .join("");

    contentDiv.innerHTML += booksHTML;
  }

  fetch(booksUrl)
    .then((response) => response.json())
    .then((data) => {
      const books = data.books;
      displayBooks(books);
    })
    .catch((error) => {
      contentDiv.innerHTML =
        "<p>Failed to load books. Please try again later.</p>";
      console.error("Error fetching books:", error);
    });
});
