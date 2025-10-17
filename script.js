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

function addTask() {
    let taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push({
            text: taskText,
            completed: false
        });

        taskInput.value = '';
        
        checkInput();
        showTasks();
    }
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
            
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.onclick = () => toggleTask(i);
            
            let span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;
            if (task.completed) {
                span.classList.add('completed');
            }
            
            let deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.onclick = () => deleteTask(i);
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        }
        if (!task.completed) {
            incompleteCount++;
        }
    }
    remainingCount.textContent = 'Осталось выполнить задач: ' + incompleteCount;
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    showTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    showTasks();
}

function filterTasks() {
    showTasks();
}

checkInput();
showTasks();