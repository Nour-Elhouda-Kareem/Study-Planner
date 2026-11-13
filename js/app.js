
const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const prioritySelect = document.querySelector("#priority");
const progressBar = document.querySelector("#progress-bar");
const progressText = document.querySelector("#progress-text");
const taskList = document.querySelector("#task-list");
const searchInput = document.querySelector("#search-tasks");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = [];
let currentFilter = "all";

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // 1. Read user input
    const title = taskTitleInput.value.trim();
    const priority = prioritySelect.value;

    if (title === "") {
    return;
    }

    // 2. Create a task object
    const task = {
        title: title,
        priority: priority,
        completed: false
    };

    // 3. Add the task to the array
    tasks.push(task);

    saveTasks();

    applyFilters();

    updateProgress();

    taskTitleInput.value = "";

});

function renderTask(task) {
    const newTask = document.createElement("article");
    newTask.classList.add("task-card");
    newTask.classList.toggle("completed", task.completed);

    const title = document.createElement("h3");
    title.textContent = task.title;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";

    checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;
        saveTasks();
        updateProgress();
        applyFilters();

    });


    const priority = document.createElement("span");
    priority.classList.add("priority", task.priority);
    priority.textContent = task.priority;

    newTask.append(checkbox, title, priority, editButton, deleteButton);

    deleteButton.addEventListener("click", function () {
        tasks = tasks.filter(function (item) {
            return item !== task;
        });

        saveTasks();

        applyFilters();

        updateProgress();
    });

    editButton.addEventListener("click", function () {
        const newTitle = prompt("Enter the new task title:");

        if (newTitle !== null && newTitle.trim() !== "") {
            task.title = newTitle.trim();
            saveTasks();
            applyFilters();
        }
    });
    taskList.appendChild(newTask);
}


function updateProgress() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed === true;
    }).length;

    const percentage = totalTasks === 0
        ? 0
        : (completedTasks / totalTasks) * 100;

    progressBar.value = percentage;

    progressText.textContent =
        `${completedTasks} of ${totalTasks} tasks completed`;
}

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("studyTasks");
    return JSON.parse(savedTasks) || [];
}


tasks = loadTasks();

applyFilters();

updateProgress();

searchInput.addEventListener("input", applyFilters);

function renderTasks(tasksToRender) {
    taskList.innerHTML = "";

    if (tasksToRender.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.textContent = "No tasks found.";

        taskList.appendChild(emptyMessage);
        return;
    }

    tasksToRender.forEach(function (task) {
        renderTask(task);
    });
}

function applyFilters() {
    const search = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(function (task) {
        const matchesSearch = task.title.toLowerCase().includes(search);
        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && task.completed === false) ||
            (currentFilter === "completed" && task.completed === true);

        return matchesSearch && matchesFilter;
    });

    renderTasks(filteredTasks);
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;
        applyFilters();
    });
});





// JSON.stringify() لتحويل Array إلى String.
// JSON.parse() لإرجاع String إلى بيانات JavaScript.