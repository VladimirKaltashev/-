let tasks = [];

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const remainingCount = document.getElementById('remainingCount');

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('input', checkInput);

function getRandomDelay() {
    return Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
}

function checkInput() {
    if (taskInput.disabled) return;
    if (taskInput.value.trim() === '') {
        addTaskBtn.disabled = true;
        addTaskBtn.style.opacity = '0.5';
        addTaskBtn.style.cursor = 'not-allowed';
    } else {
        addTaskBtn.disabled = false;
        addTaskBtn.style.opacity = '1';
        addTaskBtn.style.cursor = 'pointer';
    }
}

async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;  
    taskInput.disabled = true;
    taskInput.style.cursor = 'not-allowed';
    addTaskBtn.disabled = true;
    addTaskBtn.textContent = '';
    addTaskBtn.style.cursor = 'not-allowed';
    addTaskBtn.style.opacity = '0.5';
    addTaskBtn.classList.add('loading'); 
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    addTaskBtn.appendChild(spinner);  
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    tasks.push({
        text: taskText,
        completed: false,
        loading: null
    });

    taskInput.value = '';
    taskInput.disabled = false;
    taskInput.style.cursor = '';
    addTaskBtn.innerHTML = '+';
    addTaskBtn.style.opacity = '1';
    addTaskBtn.classList.remove('loading');

    checkInput();
    showTasks();
}

function showTasks() {
    taskList.innerHTML = '';
    let incompleteCount = 0;
    let filter = 'all';

    if (document.querySelector('input[name="filter"][value="completed"]:checked')) {
        filter = 'completed';
    } else if (document.querySelector('input[name="filter"][value="incomplete"]:checked')) {
        filter = 'incomplete';
    }

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (filter === 'all' || 
            (filter === 'completed' && task.completed) || 
            (filter === 'incomplete' && !task.completed)) {

            let li = document.createElement('li');
            li.className = 'task-item';

            if (task.loading === 'toggle') {
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                li.appendChild(spinner);
            } else {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.disabled = (task.loading === 'delete');
                if (checkbox.disabled) {
                    checkbox.style.cursor = 'not-allowed';
                } else {
                    checkbox.style.cursor = 'pointer';
                    checkbox.onclick = () => toggleTask(i);
                }
                li.appendChild(checkbox);
            }

            let span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;
            if (task.completed) {
                span.classList.add('completed');
            }

            li.appendChild(span);

            let deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-btn';

            if (task.loading === 'delete') {
                deleteBtn.innerHTML = '';
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                deleteBtn.appendChild(spinner);
                deleteBtn.style.pointerEvents = 'none';
                deleteBtn.style.opacity = '0.5';
                deleteBtn.style.cursor = 'not-allowed';
            } else {
                deleteBtn.textContent = '🗑️';
                deleteBtn.style.cursor = (task.loading === 'toggle') ? 'not-allowed' : 'pointer';
                deleteBtn.style.opacity = (task.loading === 'toggle') ? '0.5' : '1';
                if (task.loading !== 'toggle') {
                    deleteBtn.onclick = () => deleteTask(i);
                }
            }
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
            if (!task.deleting) {
                setTimeout(() => {
                    li.classList.add('visible');
                }, 10);
            }
        }
        if (!task.completed) {
            incompleteCount++;
        }
    }
    remainingCount.textContent = 'Осталось выполнить задач: ' + incompleteCount;
}

async function toggleTask(index) {
    tasks[index].loading = 'toggle';
    showTasks();

    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    tasks[index].completed = !tasks[index].completed;
    tasks[index].loading = null;
    showTasks();
}

async function deleteTask(index) {
    tasks[index].loading = 'delete';
    showTasks();

    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

    tasks[index].loading = null;
    tasks[index].deleting = true;
    showTasks();

    setTimeout(() => {
        tasks.splice(index, 1);
        showTasks();
    }, 500);
}

function filterTasks() {
    showTasks();
}

checkInput();
showTasks();