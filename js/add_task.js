let tasks = [];


/**
 * Initializes the application by calling the includeHTML function, loading notes, and adding assigned tasks to the list.
 * 
 */
async function init() {
    includeHTML();
    await loadNotes();
    await loadContacts();
    addAssignedToList();
    setDateToday();
}


/**
 * Saves the current tasks object as a JSON string to local storage using the backend object.
 * 
 */
async function saveNotes() {
    await popupTaskAdded();
    await new Promise(resolve => setTimeout(resolve, 2000));
    let tasksAsJson = JSON.stringify(tasks);
    await backend.setItem('allTasks', tasksAsJson);
}


/**
 * Shows popup with a message after adding a task successfully.
 */
function popupTaskAdded(){
    const popup = document.createElement('div');
    popup.classList.add('popup-task-added');
    popup.innerHTML = `<p>task added to board</p>`;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 2000);
}


/**
 * Downloads data from the server, parses the saved tasks JSON string from local storage, and assigns the resulting array to the global variable tasks.
 * 
 */
async function loadNotes() {
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('allTasks')) || [];
}