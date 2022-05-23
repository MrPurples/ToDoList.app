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
                        <input type="text", class="text", value='${value.taskName}'/>
                    </div>
                    <div class="actions">
                        <button class="edit">Edit</button>
                        <button onclick='deleteTask(${value.id})' class="delete">Delete</button>
                    </div>
                </div>
            `
        })
        document.getElementById('tasks').innerHTML = data;
    })
};

const addTask = async () => {
    const newTaskName = document.getElementById("new-todo-input").value;
    const data = {
        "taskName": newTaskName,
        "completed": false
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

// TODO 
/* 
* Confirmation modal on delete
* Input field validation (No special chars allowed!!!)
* The New task should be the first one in the list
* Add edit functionality
* Create completed task design and functionality
*/