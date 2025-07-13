const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");
const showCompletedBtn = document.getElementById("showCompleted");

let tasks = [];
let showOnlyCompleted = false;

const translations = {
  en: {
    title: "Task Manager",
    taskTitle: "Task Title *",
    taskDescription: "Description (Optional)",
    low: "Low",
    medium: "Medium",
    high: "High",
    add: "Add",
    showCompleted: "Show Only Completed",
    showAll: "Show All",
    emptyTitle: "Title cannot be empty!",
    emptyPriority: "Please select a priority!"
  },
  tr: {
    title: "Görev Yöneticisi",
    taskTitle: "Görev Başlığı *",
    taskDescription: "Açıklama (İsteğe Bağlı)",
    low: "Düşük",
    medium: "Orta",
    high: "Yüksek",
    add: "Ekle",
    showCompleted: "Sadece Tamamlananları Göster",
    showAll: "Tümünü Göster",
    emptyTitle: "Başlık boş olamaz!",
    emptyPriority: "Lütfen bir öncelik seçin!"
  }
};

let currentLang = localStorage.getItem("lang") || "en";

function translatePage() {
  const t = translations[currentLang];

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t[key] || el.textContent;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t[key] || el.placeholder;
  });

  showCompletedBtn.textContent = showOnlyCompleted
    ? t.showAll
    : t.showCompleted;

  if (errorMessage.textContent === translations.en.emptyTitle || errorMessage.textContent === translations.tr.emptyTitle) {
    errorMessage.textContent = t.emptyTitle;
  }
  if (errorMessage.textContent === translations.en.emptyPriority || errorMessage.textContent === translations.tr.emptyPriority) {
    errorMessage.textContent = t.emptyPriority;
  }

  document.getElementById("languageToggle").textContent = currentLang === "en" ? "Türkçe" : "English";
}

document.getElementById("languageToggle").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "tr" : "en";
  localStorage.setItem("lang", currentLang);
  translatePage();
  displayTasks();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  errorMessage.textContent = "";

  try {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const selectedPriority = document.querySelector("input[name='priority']:checked");

    if (!title) {
      errorMessage.textContent = translations[currentLang].emptyTitle;
      return;
    }

    if (!selectedPriority) {
      errorMessage.textContent = translations[currentLang].emptyPriority;
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      priority: selectedPriority.value,
      completed: false
    };

    tasks.push(newTask);
    form.reset();
    displayTasks();

  } catch (error) {
    console.error("Unexpected error occurred:", error);
    errorMessage.textContent = "An error occurred.";
  }
});

function displayTasks() {
  taskList.innerHTML = "";

  let tasksToShow = tasks;
  if (showOnlyCompleted) {
    tasksToShow = tasks.filter(task => task.completed);
  }

  tasksToShow.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div>
        <strong>${task.title}</strong> - ${translations[currentLang][task.priority.toLowerCase()] || task.priority}
        ${task.description ? `<p>${task.description}</p>` : ""}
      </div>
      <div>
        <button class="completeBtn" data-id="${task.id}">✓</button>
        <button class="deleteBtn" data-id="${task.id}">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

taskList.addEventListener("click", function (e) {
  e.stopPropagation();
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("deleteBtn")) {
    tasks = tasks.filter(task => task.id !== id);
  }

  if (e.target.classList.contains("completeBtn")) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
  }

  displayTasks();
});

showCompletedBtn.addEventListener("click", function () {
  showOnlyCompleted = !showOnlyCompleted;
  displayTasks();
  translatePage();
});

translatePage();
