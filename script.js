const uname = document.getElementById('username');
const password = document.getElementById('password');
const logIn = document.getElementById('logIn');
const register = document.getElementById('register');
const logInPage = document.getElementById('logInPage');
const app = document.getElementById('app');
const logout = document.getElementById('logout');
const themeLogin = document.getElementById("theme-login");
const themeApp = document.getElementById("theme-app");
const themeLabels = document.querySelectorAll(".themeText");

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        themeLabels.forEach(label => label.textContent = "Light Mode");
    } else {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        themeLabels.forEach(label => label.textContent = "Dark Mode");
    }

    if (themeLogin) themeLogin.checked = isDark;
    if (themeApp) themeApp.checked = isDark;

    localStorage.setItem("theme", isDark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "dark");

themeLogin?.addEventListener("change", () => applyTheme(themeLogin.checked));
themeApp?.addEventListener("change", () => applyTheme(themeApp.checked));

logIn.addEventListener('click', (e) => {
    e.preventDefault();
    const username = uname.value.trim();
    const pwd = password.value.trim();
    const storedUser = localStorage.getItem('username');
    const storedPass = localStorage.getItem('password');

    if (!username || !pwd) {
        alert("Please enter both username and password.");
        return;
    }

    if (username === storedUser && pwd === storedPass) {
        logInPage.style.display = "none";
        app.style.display = "block";
    } else {
        alert("Incorrect username or password.");
    }
});

register.addEventListener('click', (e) => {
    e.preventDefault();
    const username = prompt("Set a username:");
    const pwd = prompt("Set a password:");
    if (username && pwd) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', pwd);
        alert("Account created! You can now log in.");
    } else {
        alert("Registration cancelled.");
    }
});

logout.addEventListener('click', () => {
    app.style.display = "none";
    logInPage.style.display = "block";
    uname.value = "";
    password.value = "";
});

const taskInput = document.getElementById('task');
const addBtn = document.getElementById('add');
const list = document.getElementById('list');
const searchInput = document.getElementById('search');
const filterForm = document.getElementById('statusView');

let tasks = [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let saved = localStorage.getItem('tasks');
    if (saved) tasks = JSON.parse(saved);
}

function getFilters() {
    const searchTxt = searchInput.value.trim().toLowerCase();
    const statusFilter = filterForm.value;
    return { searchTxt, statusFilter };
}

function renderTask(task) {
    const index = tasks.indexOf(task);
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.id = `task-${index}`;

    const span = document.createElement('span');
    const statusSpan = document.createElement('span');
    statusSpan.textContent = task.status.charAt(0).toUpperCase() + task.status.slice(1);
    statusSpan.classList.add('status-indicator');
    statusSpan.classList.add(`${task.status}-status`);

    span.textContent = task.text;
    span.appendChild(statusSpan);

    if (task.completed) {
        li.classList.add('completed');
        span.style.textDecoration = 'line-through';
    }

    li.classList.add(`priority-${task.status}`);

    const del = document.createElement('button');
    del.textContent = 'Delete';

    checkbox.addEventListener('click', () => {
        tasks[index].completed = checkbox.checked;
        saveTasks();
        refreshList();
    });

    span.addEventListener('click', () => {
        const newText = prompt("Edit task:", task.text);
        const newStatus = prompt("Edit status (High, Medium, Low):", task.status);
        if (newText && ['high', 'medium', 'low'].includes(newStatus?.toLowerCase())) {
            tasks[index].text = newText.trim();
            tasks[index].status = newStatus.toLowerCase();
            saveTasks();
            refreshList();
        } else if (newText) {
            alert("Invalid status. Must be high, medium, or low.");
        }
    });

    del.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        refreshList();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
}

function refreshList() {
    list.textContent = '';
    const { searchTxt, statusFilter } = getFilters();

    const statusPriority = {
        high: 1,
        medium: 2,
        low: 3
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return (statusPriority[a.status] || 4) - (statusPriority[b.status] || 4);
    });

    sortedTasks.forEach((task) => {
        if (
            (statusFilter === 'all' || task.status === statusFilter) &&
            task.text.toLowerCase().includes(searchTxt)
        ) {
            renderTask(task);
        }
    });
}

addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const selectedStatus = document.querySelector('input[name="status"]:checked');
    if (!text || !selectedStatus) {
        alert('Please enter a task and select a status');
        return;
    }
    const newTask = {
        text,
        status: selectedStatus.value,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    refreshList();
    taskInput.value = '';
    document.querySelectorAll('input[name="status"]').forEach(radio => radio.checked = false);
});

searchInput.addEventListener('input', refreshList);
filterForm.addEventListener('change', refreshList);

loadTasks();
refreshList();
