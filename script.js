// initial js ...

function openFullscreen() {
    let elem = document.documentElement; 
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { 
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { 
        elem.msRequestFullscreen();
    }
}

// Event JS ...

document.querySelector('.addToggle').addEventListener('click', function() {
    document.querySelector(".addToggle").classList.toggle("active");
    document.querySelector(".addTask").classList.toggle("active");
    document.querySelector(".select-menu").classList.remove("active");
    document.querySelector(".dimDim").classList.toggle("active");
    document.getElementById('task-name').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
    document.querySelector('.select-menu .sBtn-text').innerText = "Select Subject ...";
});

document.getElementById("open").addEventListener("click", function() {
    document.querySelector(".open").classList.add("hide");
});

const optionMenu = document.querySelector(".select-menu"),
selectBtn = optionMenu.querySelector(".select-btn"),
options = optionMenu.querySelectorAll(".option"),
sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       

options.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;
    });
});


const optionMenu2 = document.querySelector(".select-menu-2"),
selectBtn2 = optionMenu2.querySelector(".select-btn-2"),
options2 = optionMenu2.querySelectorAll(".option_"),
sBtn_text2 = optionMenu2.querySelector(".sBtn-text-2");

selectBtn2.addEventListener("click", () => optionMenu2.classList.toggle("active"));       

options2.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text2.innerText = selectedOption;
    });
});

// Task Manager JS ...

let editIndex = null;

window.onload = function() {
    loadTasks();
};

document.getElementById('add-task').addEventListener('click', function() {
    let taskName = document.getElementById('task-name').value;
    let startTime = document.getElementById('start-time').value;
    let endTime = document.getElementById('end-time').value;
    let subject = document.querySelector('.select-menu .sBtn-text').innerText;

    if (taskName === "" || startTime === "" || endTime === "" || subject === "Select Subject ...") {
        alert("Please fill all the fields.");
        return;
    }

    if (!isValidTime(startTime, endTime) || isTimeConflict(startTime, endTime)) {
        alert("Invalid time input; the given time is either invalid or conflicting with other task. Keep in mind you can't schedule for the next day.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({
        taskName,
        startTime,
        endTime,
        subject,
        completed: false
    });

    tasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();

    document.getElementById('task-name').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
    document.querySelector('.select-menu .sBtn-text').innerText = "Select Subject ...";
});

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Sort tasks by completion status and then by start time
    tasks.sort((a, b) => {
        if (a.completed === b.completed) {
            return a.startTime.localeCompare(b.startTime);
        }
        return a.completed ? 1 : -1; // Move completed tasks to the bottom
    });
    
    let listed = document.getElementById('listed');
    let completedTasksContainer = document.getElementById('completedTask');
    listed.innerHTML = '';
    completedTasksContainer.innerHTML = '';

    tasks.forEach((task, index) => {
        let taskContainer = document.createElement('div');
        taskContainer.innerHTML = `
        <center>
            <div class="parent-task ${task.completed ? 'active' : ''}">
                <div class="tick ${task.completed ? 'active' : ''}" onclick="toggleComplete(${index})">
                    <span class="done"><ion-icon name="checkmark-done-circle"></ion-icon></span>
                    <span class="undone"><ion-icon name="checkmark-done-circle-outline"></ion-icon></span>
                </div>
                <div class="task ${task.subject.toLowerCase()} ${task.completed ? 'active' : ''}">
                    <div class="dim"></div>
                    <div class="task-details">
                        <p class="name">${task.taskName}</p>
                        <p class="time-brancing">
                            <span class="startTime">${formatTime(task.startTime)}</span> -- <span class="endTime">${formatTime(task.endTime)}</span>
                        </p>
                    </div>
                    <div class="edit" onclick="editTask(${index})"><ion-icon name="settings-outline"></ion-icon></div>
                </div>
            </div>
        </center>
        `;

        if (task.completed) {
            completedTasksContainer.appendChild(taskContainer);
        } else {
            listed.appendChild(taskContainer);
        }
    });
}

function formatTime(time) {
    let [hour, minute] = time.split(':');
    hour = parseInt(hour);
    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; 
    return `${hour}:${minute} ${ampm}`;
}

function toggleComplete(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    loadTasks();
    updateTaskLists();
}

function updateTaskLists() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let listed = document.getElementById('listed');
    let completedTasksContainer = document.getElementById('completedTask');
    
    listed.innerHTML = '';
    completedTasksContainer.innerHTML = '';

    tasks.forEach((task, index) => {
        let taskContainer = document.createElement('div');
        taskContainer.innerHTML = `
        <center>
            <div class="parent-task ${task.completed ? 'active' : ''}">
                <div class="tick ${task.completed ? 'active' : ''}" onclick="toggleComplete(${index})">
                    <span class="done"><ion-icon name="checkmark-done-circle"></ion-icon></span>
                    <span class="undone"><ion-icon name="checkmark-done-circle-outline"></ion-icon></span>
                </div>
                <div class="task ${task.subject.toLowerCase()} ${task.completed ? 'active' : ''}">
                    <div class="dim"></div>
                    <div class="task-details">
                        <p class="name">${task.taskName}</p>
                        <p class="time-brancing">
                            <span class="startTime">${formatTime(task.startTime)}</span> -- <span class="endTime">${formatTime(task.endTime)}</span>
                        </p>
                    </div>
                    <div class="edit" onclick="editTask(${index})"><ion-icon name="settings-outline"></ion-icon></div>
                </div>
            </div>
        </center>
        `;

        if (task.completed) {
            completedTasksContainer.appendChild(taskContainer);
        } else {
            listed.appendChild(taskContainer);
        }
    });
}

function isValidTime(startTime, endTime) {
    return new Date(`1970-01-01T${startTime}:00`).getTime() < new Date(`1970-01-01T${endTime}:00`).getTime();
}

function isTimeConflict(startTime, endTime, currentIndex = -1) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Filter to only include non-completed tasks
    let nonCompletedTasks = tasks.filter(task => !task.completed);

    let newStart = new Date(`1970-01-01T${startTime}:00`).getTime();
    let newEnd = new Date(`1970-01-01T${endTime}:00`).getTime();

    return nonCompletedTasks.some((task, index) => {
        if (index === currentIndex) return false;

        let taskStart = new Date(`1970-01-01T${task.startTime}:00`).getTime();
        let taskEnd = new Date(`1970-01-01T${task.endTime}:00`).getTime();

        return (newStart < taskEnd && newEnd > taskStart);
    });
}

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let task = tasks[index];

    document.getElementById('editTask').classList.add("active");
    document.querySelector(".dimDim").classList.add("active");

    document.getElementById('edit-task-name').value = task.taskName;
    document.getElementById('edit-start-time').value = task.startTime;
    document.getElementById('edit-end-time').value = task.endTime;

    document.querySelector('.sBtn-text-2').innerText = task.subject;

    editIndex = index; 
}

document.getElementById('save-task').addEventListener('click', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let taskName = document.getElementById('edit-task-name').value;
    let startTime = document.getElementById('edit-start-time').value;
    let endTime = document.getElementById('edit-end-time').value;
    let subject = document.querySelector('.sBtn-text-2').innerText; 

    if (taskName === "" || startTime === "" || endTime === "" || subject === "Select Subject ...") {
        alert("Please fill all the fields.");
        return;
    }
    
    if (!isValidTime(startTime, endTime) || isTimeConflict(startTime, endTime, editIndex)) {
        alert("Invalid time input; the given time is either invalid or conflicting with other task. Keep in mind you can't schedule for the next day.");
        return;
    }

    tasks[editIndex] = { taskName, startTime, endTime, subject, completed: tasks[editIndex].completed };
    localStorage.setItem('tasks', JSON.stringify(tasks));
 
    tasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    loadTasks();
    document.getElementById('editTask').classList.remove("active");
    document.querySelector(".dimDim").classList.remove("active");
});

document.getElementById('delete-task').addEventListener('click', function() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(editIndex, 1); 
    localStorage.setItem('tasks', JSON.stringify(tasks));

    loadTasks();
    
    document.getElementById('editTask').classList.remove('active');
    document.querySelector(".dimDim").classList.remove("active");
});

document.getElementById('clear-all').addEventListener('click', function() {
    if (confirm("Are you sure you want to delete all tasks? This action cannot be undone.")) {
        localStorage.removeItem('tasks');
        loadTasks();
    }
});

function checkEmptyTasks() {
    let listed = document.getElementById('listed');
    let completedTasksContainer = document.getElementById('completedTask');

    if (listed.children.length < 1) {
        if (!listed.querySelector('.emptyText')) {
            let emptyText = document.createElement('div');
            emptyText.className = 'emptyText';
            emptyText.innerText = "no remaining tasks";
            listed.appendChild(emptyText);
        }
    } else if (listed.children.length === 1) {
        if (listed.children[0].classList.contains('emptyText')) {
        } else {
            let emptyText = listed.querySelector('.emptyText');
            if (emptyText) {
                emptyText.remove();
            }
        }
    } else {
        let emptyText = listed.querySelector('.emptyText');
        if (emptyText) {
            emptyText.remove();
        }
    }

    if (completedTasksContainer.children.length < 1) {
        if (!completedTasksContainer.querySelector('.emptyText')) {
            let emptyText = document.createElement('div');
            emptyText.className = 'emptyText';
            emptyText.innerText = "no completed tasks";
            completedTasksContainer.appendChild(emptyText);
        }
    } else if (completedTasksContainer.children.length === 1) {
        if (completedTasksContainer.children[0].classList.contains('emptyText')) {
        } else {
            let emptyText = completedTasksContainer.querySelector('.emptyText');
            if (emptyText) {
                emptyText.remove();
            }
        }
    } else {
        let emptyText = completedTasksContainer.querySelector('.emptyText');
        if (emptyText) {
            emptyText.remove();
        }
    }
}
setInterval(checkEmptyTasks, 1000);
loadTasks();
checkEmptyTasks();

// Task Running JS ...

let runningTaskInterval = null;
let countdownInterval = null;
let taskRunning = false;
let currentTask = null;  

function updateRunningTask() {
    const currentTime = new Date();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const runningTaskCont = document.querySelector('.runningTaskCont');
    const randi = document.querySelector(".randi");

    document.getElementById('emptyTextOne')?.remove();

    currentTask = tasks.find(task => {
        if (!task.completed) {
            const [startHour, startMinute] = task.startTime.split(':').map(Number);
            const [endHour, endMinute] = task.endTime.split(':').map(Number);
            const taskStartTime = new Date();
            const taskEndTime = new Date();
            taskStartTime.setHours(startHour, startMinute, 0);
            taskEndTime.setHours(endHour, endMinute, 0);

            return currentTime >= taskStartTime && currentTime < taskEndTime;
        }
        return false;
    });

    if (currentTask) {
        taskRunning = true;
        updateTaskUI(currentTask);
        startCountdown(currentTask);
    } else {
        showNoTaskMessage(randi);
        runningTaskCont.style.display = 'none';
        clearInterval(countdownInterval);
    }
}

function updateTaskUI(task) {
    const runningTaskCont = document.querySelector('.runningTaskCont');
    document.getElementById('running-task-subject').innerText = task.subject;
    document.getElementById('running-task-name').innerText = task.taskName;
    document.getElementById('initialTime').innerText = formatTime(task.startTime);
    document.getElementById('finalTime').innerText = formatTime(task.endTime);
    runningTaskCont.style.display = 'block';
}

function startCountdown(task) {
    const taskStartTime = new Date();
    const taskEndTime = new Date();
    const [startHour, startMinute] = task.startTime.split(':').map(Number);
    const [endHour, endMinute] = task.endTime.split(':').map(Number);
    taskStartTime.setHours(startHour, startMinute, 0);
    taskEndTime.setHours(endHour, endMinute, 0);

    const totalTime = taskEndTime - taskStartTime;

    clearInterval(countdownInterval);

    countdownInterval = requestAnimationFrame(() => updateProgressBarAndCountdown(taskEndTime, totalTime));
}

function updateProgressBarAndCountdown(taskEndTime, totalTime) {
    const currentTime = new Date();
    const remainingTime = taskEndTime - currentTime;

    const progressBar = document.getElementById('progressBar');
    const progress = Math.max(((totalTime - remainingTime) / totalTime) * 100, 0);
    progressBar.style.width = `${progress}%`;

    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    document.getElementById('hour').innerText = String(hours).padStart(2, '0');
    document.getElementById('min').innerText = String(minutes).padStart(2, '0');
    document.getElementById('sec').innerText = String(seconds).padStart(2, '0');

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        taskRunning = false;
        console.log("Task time ended. Reloading task list...");
        updateRunningTask();
    } else {
        countdownInterval = requestAnimationFrame(() => updateProgressBarAndCountdown(taskEndTime, totalTime));
    }
}

function showNoTaskMessage(container) {
    const emptyTextOne = document.createElement('div');
    emptyTextOne.id = 'emptyTextOne';
    emptyTextOne.innerText = "no running task";
    container.appendChild(emptyTextOne);
}

function formatTime(time) {
    let [hour, minute] = time.split(':');
    hour = parseInt(hour);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
}

function syncToRealMinute() {
    document.querySelector(".runningTaskCont").style.display = 'none';
    const randi = document.querySelector('.randi');
    const now = new Date();
    const millisecondsTillNextMinute = (60 - now.getSeconds()) * 1000;

    console.log(`Syncing to the next minute in ${millisecondsTillNextMinute / 1000} seconds...`);

    const emptyTextOne = document.createElement('div');
    emptyTextOne.id = 'emptyTextOne';
    emptyTextOne.innerText = "Synchronising ...";
    randi.appendChild(emptyTextOne);

    const countdownDisplay = document.createElement('span');
    countdownDisplay.id = 'countdownDisplay';
    emptyTextOne.appendChild(countdownDisplay);

    let countdownSeconds = Math.floor(millisecondsTillNextMinute / 1000);

    const countdownInterval = setInterval(() => {
        countdownDisplay.innerText = `  ${countdownSeconds}`;
        countdownSeconds--;

        if (countdownSeconds < 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(countdownInterval);
        document.getElementById('emptyTextOne')?.remove();
        updateRunningTask();
        runningTaskInterval = setInterval(updateRunningTask, 5000);
    }, millisecondsTillNextMinute);
}

syncToRealMinute();

// expert task js

function formatTime24to12(time24) {
    const [hours24, minutes] = time24.split(':').map(Number);
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = ((hours24 + 11) % 12 + 1);
    return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

function exportTasks() {
    const exportedDataContainer = document.getElementById("exportedData");
    exportedDataContainer.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "Today's Goal ...";
    exportedDataContainer.appendChild(title);

    const mainExportDiv = document.createElement("div");
    mainExportDiv.className = "exported";

    const subjects = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === "tasks") {
            const taskArray = JSON.parse(localStorage.getItem(key));
            taskArray.forEach(task => {
                if (task && task.subject && task.startTime && task.endTime) {
                    if (!subjects[task.subject]) {
                        subjects[task.subject] = [];
                    }
                    subjects[task.subject].push(task);
                }
            });
        }
    }

    Object.keys(subjects).forEach(subject => {
        subjects[subject].sort((a, b) => {
            const [aHours, aMinutes] = a.startTime.split(':').map(Number);
            const [bHours, bMinutes] = b.startTime.split(':').map(Number);
            return aHours - bHours || aMinutes - bMinutes;
        });

        const subjectDiv = document.createElement("div");
        subjectDiv.className = "subject";

        const subjectTitle = document.createElement("h2");
        subjectTitle.textContent = subject;
        subjectDiv.appendChild(subjectTitle);

        subjects[subject].forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "exp-Task";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.className = "task-checkbox";
            
            const checkboxDiv = document.createElement("div");
            checkboxDiv.className = "checkboxDiv";
            checkboxDiv.appendChild(checkbox);

            const taskLabelDiv = document.createElement("div");
            taskLabelDiv.className = "task-label";

            const taskNameDiv = document.createElement("div");
            taskNameDiv.className = "exp-name";
            taskNameDiv.textContent = task.taskName;

            const timeStampDiv = document.createElement("div");
            timeStampDiv.className = "exp-Time-stamp";
            timeStampDiv.innerHTML = `<span><span id="exp-start-time">${formatTime24to12(task.startTime)}</span> - <span id="exp-end-time">${formatTime24to12(task.endTime)}</span></span>`;

            taskLabelDiv.appendChild(taskNameDiv);
            taskLabelDiv.appendChild(timeStampDiv);

            taskDiv.appendChild(checkboxDiv);
            taskDiv.appendChild(taskLabelDiv);
            subjectDiv.appendChild(taskDiv);      
        });

        mainExportDiv.appendChild(subjectDiv);
    });

    exportedDataContainer.appendChild(mainExportDiv);
}

document.getElementById("export").addEventListener("click", exportTasks);