let studentData = [
    { id: 1, name: "Ahmet Yılmaz", class: "10-A" },
    { id: 2, name: "Mehmet Demir", class: "9-B" },
    { id: 3, name: "Ayşe Kaya", class: "11-C" },
    { id: 4, name: "Fatma Şahin", class: "12-A" },
    { id: 5, name: "Zeynep Arslan", class: "10-B" },
    { id: 6, name: "Emre Koç", class: "9-C" },
    { id: 7, name: "Burak Yıldız", class: "11-A" },
    { id: 8, name: "Selin Öztürk", class: "12-B" },
    { id: 9, name: "Canan Erdem", class: "10-C" },
    { id: 10, name: "Deniz Aydın", class: "9-A" }
];

$(document).ready(function() {
    loadStudentTable();
    
    $("#studentForm").submit(function(e) {
        e.preventDefault();
        addNewStudent();
    });
    //renk degisimi
    $(document).on("click", "#studentTable tbody tr", function() {
        $(this).toggleClass("selected");
    });
    //sil
    $(document).on("click", ".delete-btn", function(e) {
        e.stopPropagation(); // Satır tıklamasını engelle
        const studentId = $(this).data("id");
        deleteStudent(studentId);
    });
});

function loadStudentTable() {
    const tbody = $("#studentTable tbody");
    tbody.empty();
    
    studentData.forEach(student => {
        const row = `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td><button class="delete-btn" data-id="${student.id}">Sil</button></td>
            </tr>
        `;
        tbody.append(row);
    });
}

//ogrenci ekleme
function addNewStudent() {
    const name = $("#name").val().trim();
    const className = $("#class").val().trim();
    
    if (name && className) {
        const newId = studentData.length > 0 ? Math.max(...studentData.map(s => s.id)) + 1 : 1;
        
        const newStudent = {
            id: newId,
            name: name,
            class: className
        };
        
        studentData.push(newStudent);
        
        loadStudentTable();
        
        $("#studentForm")[0].reset();
    }
}

//ogrenciyi silme 
function deleteStudent(id) {
    if (confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) {
        studentData = studentData.filter(student => student.id !== id);
        
        loadStudentTable();
    }
}