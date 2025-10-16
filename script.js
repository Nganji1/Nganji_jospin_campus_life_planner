
document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const searchInput = document.getElementById("searchInput");
  const message = document.getElementById("message");
  const themeToggle = document.getElementById("themeToggle");

  let tasks = JSON.parse(localStorage.getItem("campusTasks")) || [];
  let darkMode = localStorage.getItem("darkMode") === "true";

  // saved theme
  if (darkMode) document.body.classList.add("dark");
  themeToggle.textContent = darkMode ? "Light Mode" : "Dark Mode";

  // Regex patterns
  const nameRegex = /^[A-Za-z0-9\s]{3,30}$/;
  const durationRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  renderTasks(tasks);

  // light and dark mode
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", dark);
    themeToggle.textContent = dark ? "Light Mode" : "Dark Mode";
  });

  // Adding  new tasks or events
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    message.textContent = "";

    const name = document.getElementById("taskName").value.trim();
    const duration = document.getElementById("taskDuration").value.trim();
    const date = document.getElementById("taskDate").value;

    if (!nameRegex.test(name)) {
      message.textContent = "Enter a valid event name (3–30 letters/numbers).";
      return;
    }

    if (!durationRegex.test(duration)) {
      message.textContent = "Enter duration in HH:MM format (e.g., 01:30).";
      return;
    }

    const alreadyExists = tasks.some(
      t => t.name.toLowerCase() === name.toLowerCase() && t.date === date
    );

    if (alreadyExists) {
      message.textContent = "Event already exists.";
      return;
    }

    const newTask = { id: Date.now(), name, duration, date };
    tasks.push(newTask);
    saveTasks();

    taskForm.reset();
    renderTasks(tasks);
    message.textContent = "";
  });

  // Search functionality bar
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = tasks.filter(t => t.name.toLowerCase().includes(term));
    renderTasks(filtered);
  });

  // Saves to localStorage
  function saveTasks() {
    localStorage.setItem("campusTasks", JSON.stringify(tasks));
  }

  function renderTasks(list) {
    taskList.innerHTML = "";
    if (list.length === 0) {
      taskList.innerHTML = "<p>No events added yet.</p>";
      return;
    }

    list.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.innerHTML = `
        <div>
          <span><strong>${task.name}</strong></span>
          <span> ${task.duration} |  ${task.date}</span>
        </div>
        <button data-id="${task.id}">✖</button>
      `;
      li.querySelector("button").addEventListener("click", () => deleteTask(task.id));
      taskList.appendChild(li);
    });
  }

  // Deleting an event or a task
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks(tasks);
  }
});
