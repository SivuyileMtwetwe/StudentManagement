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

function displayGroupStats() {
    const stats = calculateStats();
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Group Statistics</h2>
        <p>Total Students: ${stats.totalStudents}</p>
        <p>Number of Classes: ${Object.keys(stats.classPerformanceDistribution).length}</p>
        <h3>Students per Class:</h3>
        <ul>
            ${Object.entries(stats.classPerformanceDistribution).map(([className, count]) => 
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