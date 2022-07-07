const url = 'https://61d40a5c8df81200178a8a16.mockapi.io/api/getTodoList'

let ourToDoList;
let lastElem;
const getAllTasks = () => {
    fetch(url)
    .then(response => {
        return response.json()
    })
    .then(responseData => {
        // Sort our response data by position
        responseData.sort((a,b) => {
            const posA = a.position;
            const posB = b.position;
            if (posA > posB) {
                return 1;
            };
            if (posA < posB) {
                return -1;
            };
            return 0;
            
        })
        ourToDoList = responseData;
        let lastElem = ourToDoList.length
        let data = "";
        responseData.map((value) => {
             {
            data += `             
                <div class="task" id='${value.id}'>
                    <div class="content">
                        <input type="text" id="input-${value.id}" class="text" value='${value.taskName}' readonly="readonly"/>
                    </div>
                    <div class="actions">
                    <button id="arrowUp-${value.position}" onclick="buttonUP(${value.id},${value.position})"class="arrow">
                            ⇧   
                        </button>
                        <button id="arrowDown-${value.position}" onclick="buttonDown(${value.id},${value.position})" class="arrow">
                            ⇩
                        </button>
                        <button id="saveButton-${value.id}" onclick="saveNewTask(${value.id})" class="Save">
                            Save
                        </button>
                        <button id="editButton-${value.id}" onclick='editTasks("${value.id}")' class="edit">
                            Edit
                        </button>
                        <button onclick='showDeleteModal("${value.id}", "${value.taskName}", "${value.position}")' class="delete">
                            Delete
                        </button>
                    </div>
                    <div class="date">
                        ${value.date}
                    </div>
                </div>
            `;
            
            document.getElementById('tasks').innerHTML = data;
            
            }
            
        })
        console.log(ourToDoList)
        document.getElementById(`arrowDown-${lastElem}`).style.display = 'none'
        document.getElementById('new-todo-input').value = '';
        
    })
};
const addTask = async () => {
    const newTaskName = document.getElementById("new-todo-input").value;
   
    const date = new Date();
    
    const formatedDate = `${date.getHours()}:${date.getMinutes()} ---- ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
    
    // Incrementing each position by 1

                for (let i=0; i<ourToDoList.length; i++) {
                    const obj = ourToDoList[i];
                    obj.position = obj.position + 1
                    await editTaskByPosition(obj.id, obj.position)
                }
    
    const dataBody = {
        "taskName": newTaskName,
        "completed": false,
        "date": formatedDate,
        "position": 1
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
const editTaskByName = async (taskId, newTaskName) => {
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

const editTaskByPosition = async(taskId, position) => {
    const editUrl = `${url}/${taskId}`;
    
     await fetch(editUrl, {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            position: position
        })
    });
};


const editTaskByComplete = async (taskId, complete) => {
    const editUrl = `${url}/${taskId}`;
    
    await fetch(editUrl, {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            completed: complete
        })
    });
    getAllTasks();
};

let buttonID = {};

const showDeleteModal = (id, taskName,position) => {
    document.getElementById('modal').style.display = 'block';
    buttonID.id = id;
    buttonID.task = taskName;
    buttonID.position = position;
    document.getElementById('taskName').innerText = buttonID.task;
};

const confirmDelete = async() => {
    document.getElementById('modal').style.display = 'none';
    for (let i=0; i<ourToDoList.length; i++) {
        const obj = ourToDoList[i];
        if(buttonID.position < obj.position){
            obj.position = obj.position - 1
        }
        await editTaskByPosition(obj.id, obj.position)}
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
    editTaskByName(id, newTaskName);
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

const buttonDown = async(taskId, taskPos) => {
    const nextTask = ourToDoList[taskPos];
    
    await editTaskByPosition(taskId,taskPos+1)
    await editTaskByPosition(nextTask.id,taskPos)
    getAllTasks();
}

const buttonUP = async(taskId, taskPos) => {
    const prevTask = ourToDoList[taskPos-2];
    
    await editTaskByPosition(taskId,taskPos-1)
    await editTaskByPosition(prevTask.id,taskPos)
    getAllTasks();
}


