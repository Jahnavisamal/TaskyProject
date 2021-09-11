// to store the class_name of the html card container element
const taskContainer = document.querySelector(".task-container");

// stores the task card data in the array
let globalStore = [];

// function to create a new card by taking taskData as input
const newCard = ({ id, imageUrl, taskTitle, taskType, taskDescription }) => `
<!-- Open Task Modal  -->
<div class="modal" id="openModal" tabindex="-3" style="display: none;" aria-hidden="true">
    <div class="modal-dialog ">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Task View</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card shadow-sm task__card ">
                    <div class="card-body">
                        <img src=${imageUrl} alt="Card image cap" id="openImage" class="card-img-top rounded"
                            width="height=200rem">
                        <h1 class="task__card__title" id="openTitle">
                            ${taskTitle}
                        </h1>
                        <p class="description trim-3-lines font-large " id="openDesc">
                            ${taskDescription}
                        </p>
                        <div class="tags text-white d-flex flex-wrap">
                            <h3>
                                <span class="badge h1 bg-primary m-1" id="openType">
                                    ${taskType}
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
            
            </div>
    </div>
</div>
<div class="col-md-6 col-lg-4 mb-4" id=${id}>
    <div class="card">
        <div class=" card-header d-flex justify-content-end gap-2 m-0">
            <button type="button" class="btn btn-outline-success" id=${id} onclick="editCard.apply(this, arguments)">
                <i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this, arguments)" ></i>
            </button>
            <button type="button" class="btn btn-outline-danger" id=${id} onclick="deleteCard.apply(this, arguments)">
                <i class="fas fa-trash" id=${id} onclick="deleteCard.apply(this, arguments)"></i>
            </button>
        </div>
        <img src=${imageUrl} class="card-img-top" alt="Card Image" id="templateImage"/>
        <div class="card-body">
            <h5 class="card-title" id="templateTitle">
                ${taskTitle}
            </h5>
            <p class="card-text mb-0" id="templateDescription">
                ${taskDescription}
            </p>
            <span class="badge bg-primary" id="templateType">
                ${taskType}
            </span>
        </div>
        <div class="card-footer text-muted">
            <button type="button" class="btn btn-outline-primary float-end" id=${id} onclick="openModal()" data-bs-target="#openModal"
                data-bs-toggle="modal">
                Open Task
            </button>
        </div>
    </div>
</div>`;

const updateLocalStorage = () => {
    localStorage.setItem("taskify", JSON.stringify({ taskCards: globalStore }));
};

// function to reload the cards and display them on screen
const reloadTaskCards = () => {
    const reloadTaskData = localStorage.getItem("taskify");
    if (!reloadTaskData) return;

    const { taskCards } = JSON.parse(reloadTaskData);

    taskCards.map((individualCardData) => {
        const createNewCard = newCard(individualCardData);

        taskContainer.insertAdjacentHTML("beforeend", createNewCard);

        globalStore.push(individualCardData);
    });
};

// function to save the card on clicking save changes button
const saveChanges = () => {
    // storing task card data inside this object
    const taskData = {
        id: `${Date.now()}`,
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };

    // passing the taskData as arguments to create new task card & storing it in a variable
    const createNewCard = newCard(taskData);

    // to generate html card and inject it into DOM
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);

    globalStore.push(taskData);

    updateLocalStorage();
};

// function to delete the card on clicking delete card button
const deleteCard = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    globalStore = globalStore.filter(
        (individualCardData) => individualCardData.id !== targetID
    );

    updateLocalStorage();

    if (tagname === "BUTTON") {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode
        );
    } else {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode.parentNode
        );
    }
};

const editCard = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    // setAttribute
    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute(
        "onclick",
        "saveEditCardChanges.apply(this, arguments)"
    );

    submitButton.innerHTML = "Save";
};

const saveEditCardChanges = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if (tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    globalStore = globalStore.map((task) => {
        if (task.id === targetID) {
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }

        return task;
    });

    updateLocalStorage();
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");

    submitButton.removeAttribute("onclick");
    submitButton.innerHTML = "Open Task";
};