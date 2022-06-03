const url = 'https://61d40a5c8df81200178a8a16.mockapi.io/api/getTodoList'

const getAllTasks = () => {
    fetch(url)
    .then(response => {
        return response.json()
    })
    .then(responseData => {
        let data = "";
        responseData.map((value) => {
            data += `
                <div class="task">
                    <div class="content">
                        <input type="text" id="input-${value.id}" class="text" value='${value.taskName}' readonly="readonly"/>
                    </div>
                    <div class="actions">
                        <button id="saveButton-${value.id}" onclick="saveNewTask(${value.id})" class="Save">
                            Save
                        </button>
                        <button id="editButton-${value.id}" onclick='editTasks("${value.id}")' class="edit">
                            Edit
                        </button>
                        <button onclick='showDeleteModal("${value.id}", "${value.taskName}")' class="delete">
                            Delete
                        </button>
                    </div>
                    <div class="date">
                        ${value.date}
                    </div>
                </div>
            `;
        })
        document.getElementById('tasks').innerHTML = data;
        document.getElementById('new-todo-input').value = '';
    })
};

const addTask = async () => {
    const newTaskName = document.getElementById("new-todo-input").value;

    const date = new Date();
    
    const formatedDate = `${date.getHours()}:${date.getMinutes()} ---- ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;

    const dataBody = {
        "taskName": newTaskName,
        "completed": false,
        "date": formatedDate
    };

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataBody)
    })
    
    getAllTasks();
};

const deleteTask = async (taskId) => {
    const deleteUrl = `${url}/${taskId}`;

    await fetch(deleteUrl, {
        method:'DELETE'
    })

    getAllTasks();
};

const editTask = async (taskId, newTaskName) => {
    const editUrl = `${url}/${taskId}`;

    await fetch(editUrl, {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            taskName: newTaskName
        })
    });

    getAllTasks();
};

let buttonID = {};

const showDeleteModal = (id, taskName) => {
    document.getElementById('modal').style.display = 'block';
    buttonID.id = id;
    buttonID.task = taskName;
    document.getElementById('taskName').innerText = buttonID.task;
};

const confirmDelete = () => {
    document.getElementById('modal').style.display = 'none';
    deleteTask(buttonID.id);
};


const hideDeleteModal = () => {
    document.getElementById('modal').style.display = 'none';
};

const editTasks = (id) => {
    document.getElementById(`saveButton-${id}`).style.display = "block";
    document.getElementById(`editButton-${id}`).style.display = "none";

    const currentTask = document.getElementById(`input-${id}`);
    currentTask.removeAttribute("readonly");
    currentTask.focus();
};

const saveNewTask = (id) => {
    const currentTask = document.getElementById(`input-${id}`);
    currentTask.setAttribute("readonly", "");

    document.getElementById(`saveButton-${id}`).style.display = "none";
    document.getElementById(`editButton-${id}`).style.display = "block";

    const newTaskName = currentTask.value;
    editTask(id, newTaskName);
    getAllTasks();
};

const noSpecialChars = (event) => {
    if (event.key === '<' || event.key === '>'
        || event.key === '/') {
        event.preventDefault();
        return;
    }
    return event.key;
};