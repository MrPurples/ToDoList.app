const url = 'https://61d40a5c8df81200178a8a16.mockapi.io/api/getTodoList'
const modal = document.getElementById('modal');
const deleteButton = document.getElementById("delete-confirm");
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
                        <input type="text", id="yes${value.id}" class="text", value='${value.taskName}', readonly="readonly"/>
                    </div>
                    <div class="actions">
                        <button id="save${value.id}" onclick="saveNewTask(${value.id})" class="Save">Save</button>
                        <button id="edit${value.id}" onclick='editTasks("${value.id}")' class="edit">Edit</button>
                        <button onclick='deleteModal("${value.id}", "${value.taskName}")' class="delete">Delete</button>
                    </div>
                    <div class="date">
                        ${value.date}
                    </div>
                </div>
            `;
        })
        const task = document.getElementsByClassName("task")
        document.getElementById('tasks').innerHTML = data;
        document.getElementById('new-todo-input').value =''
        
    })
    
};

const addTask = async () => {
    const newTaskName = document.getElementById("new-todo-input").value;
    const date = new Date();
    const formatedDate = date.getDay()+"-"+ date.getMonth()+"-"+ date.getFullYear();
    const data = {
        "taskName": newTaskName,
        "completed": false,
        "date": formatedDate

    };
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    getAllTasks();
};

const deleteTask = async (taskId) => {
    const deleteUrl = `${url}/${taskId}`
    await fetch(deleteUrl, {
        method:'DELETE'
    })
    getAllTasks();
}

const editTask = async (taskId,newTaskName) => {
    const editUrl = `${url}/${taskId}`
    await fetch(editUrl, {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            taskName: newTaskName
        })
    });
    getAllTasks();
};




var buttonID = {};
function deleteModal(id, taskName) {
    document.getElementById('modal').style.display = 'block'
    buttonID.id=id;
    buttonID.task=taskName;
    document.getElementById('taskName').innerText=buttonID.task
};

function confirmDelete() {
    document.getElementById('modal').style.display = 'none'
    deleteTask(buttonID.id)
    
    
}


function cancelConfirm() {
    document.getElementById('modal').style.display = 'none'
}

function editTasks(id) {
document.getElementById('save' + id).style.display="block"
document.getElementById('edit'+ id).style.display="none"
let taskmunicipal = document.getElementById('yes'+id)
        taskmunicipal.removeAttribute("readonly");
        taskmunicipal.focus();
}

function saveNewTask(id) {
    let taskmunicipal = document.getElementById('yes'+id);
    taskmunicipal.setAttribute("readonly","");
    document.getElementById('save' + id).style.display="none"
    document.getElementById('edit'+ id).style.display="block"
    let newTaskName = taskmunicipal.value;
    editTask(id,newTaskName)
    getAllTasks()
}
