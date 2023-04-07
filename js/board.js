let tasks = [];
let users_color = loadContacts();
let onMobile = isMobileDevice();
let currentDraggedElement;
let splits = ['to_do', 'in_progress', 'awaiting_feedback', 'done'];

/**
 * Initializes the page by including the HTML, loading the notes,
 * and loading the board with the initial set of tasks.
 * @async
 * @function
 */
async function init() {
    includeHTML();
    await loadNotes();
    loadBoard(tasks);
    loadContacts();
}
/**
 * Loads the board with the specified set of tasks, cleaning out any
 * existing content and adding new content to the board.
 * @function
 * @param {array} choiceTasks - The set of tasks to load onto the board.
 */
function loadBoard(choiceTasks) {
    cleanOldBoard();
    loadNewBoard(choiceTasks);
    addDropArea();
}
/**
 * This function clean the old Kanban Board.
 * 
 */
function cleanOldBoard() {
    document.getElementById('to_do').innerHTML = '';
    document.getElementById('in_progress').innerHTML = '';
    document.getElementById('awaiting_feedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}
/**
 * Loads a new task board with the specified tasks.
 *
 * @param {Array} toLoadTasks - An array of tasks to load on the board.
 */
function loadNewBoard(toLoadTasks) {
    for (let i = 0; i < toLoadTasks.length; i++) {
        const task = toLoadTasks[i];
        let catgoryLow = task['category'].toLowerCase();
        document.getElementById(task['split']).innerHTML += loadCardBoardText(task, i, catgoryLow);
        loadUsersBoard(task, i);
        loadSubtasks(task, i);
    }
}
/**
 * Loads users into task card's user section.
 * @param {Object} task - The task object.
 * @param {number} i - The index of the task in the array of tasks.
 */
function loadUsersBoard(task, i) {
    for (let j = 0; j < task['users'].length; j++) {
        const user = task['users'][j];
        document.getElementById('users' + i).innerHTML += loadUserShortsTmp(user)
    }
}
/**
 * Loads subtasks into task card's subtask section.
 * @param {Object} task - The task object.
 * @param {number} i - The index of the task in the array of tasks.
 */
function loadSubtasks(task, i) {
    if (task['subtasks'].length > 0) {
        let doneTasks = 0;
        let sumTasks = task['subtasks'].length;
        for (let t = 0; t < task['subtasks'].length; t++) {
            const subtask = task['subtasks'][t];
            if (subtask['status'] == 'done') {
                doneTasks++;
            };
        }
        document.getElementById('progress' + i).innerHTML = loadSubtaskBoardtmp(doneTasks, sumTasks);
    }
}
/**
 * Adds a drop area to each split of the Kanban board.
 */
function addDropArea() {
    for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        document.getElementById(split).innerHTML += loadDropArea(split);
    }
}
/**
 * Opens the add task pop-up window.
 */
function openAddTask() {
    document.getElementById('popUp').innerHTML = loadAddTaskTmp();
    document.getElementById('board-section').classList.add('d-none');
    addAssignedToList();
    setDateToday();
}
/**
 * Sets the current dragged element.
 * @param {string} id - The id of the element being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}
/**
 * Allows elements to be dropped into the drop area.
 * @param {Object} ev - The event object.
 * @param {number} test - A test parameter.
 */
function allowDrop(ev, test) {
    ev.preventDefault();
    document.getElementById('dropArea_' + test).classList.add('borders');
}
/**
 * Disables drop of elements.
 * @param {string} ev - The event object.
 */
function diableDrop(ev) {
    document.getElementById('dropArea_' + ev).classList.remove('borders');
}
/**
 * Moves the dragged element to another category.
 * @param {string} category - The category to move the element to.
 */
async function moveTo(category) {
    tasks[currentDraggedElement]['split'] = category;
    loadBoard(tasks);
    await saveNotes();
}
/**
 * Ends dragging of an element.
 * @param {string} id - The id of the element being dragged.
 */
function endDragging(id) {
    document.getElementById('card' + id).style.transform = "rotate(0deg)";
}
/**
 * Loads the tasks from the server.
 */
async function loadNotes() {
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('allTasks')) || [];
}
/**
 * Saves the notes to the server.
 */
async function saveNotes() {
    let tasksAsJson = JSON.stringify(tasks);
    await backend.setItem('allTasks', tasksAsJson);
}
/**
 * Opens a full view of a task card.
 * @param {number} choiceTask - The index of the task in the array of tasks.
 */
function openTaskFull(choiceTask) {
    document.getElementById('popUp').innerHTML = loadCardFullText(tasks, choiceTask);
    loadSubtaksToFullTask(choiceTask);
    loadUsersToFullTask(choiceTask);
}
/**
 * Loads the subtasks to the full task view.
 * @param {number} choiceTask - The index of the task in the array of tasks.
 */
function loadSubtaksToFullTask(choiceTask) {
    if (tasks[choiceTask]['subtasks'].length > 0) {
        let subtasks = tasks[choiceTask]['subtasks']
        for (let i = 0; i < subtasks.length; i++) {
            taskDone = 'checked'
            if (tasks[choiceTask]['subtasks'][i]['status'] == 'undone') {
                taskDone = '';
            }
            document.getElementById('subtaskSection').innerHTML += `
            <label for="subtask_${i}">${tasks[choiceTask]['subtasks'][i]['subtaskName']}<input type="checkbox" ${taskDone} id="subtask_${i}"></label>
            `
        }
    }
    else {
        document.getElementById('subtaskSectionCheck').innerHTML = '';
    }
}
/**
 * Loads the users to the full task view.
 * @param {number} choiceTask - The index of the task in the array of tasks.
 */
function loadUsersToFullTask(choiceTask) {
    if (tasks[choiceTask]['users'].length > 0) {
        let users = tasks[choiceTask]['users']
        for (let u = 0; u < users.length; u++) {
            document.getElementById('userSection').innerHTML += loadTextUsersForFullTask(users, u);
        }
    }
}
/**
 * Closes the task pop-up window.
 * @param {number} currentCard - The index of the task in the array of tasks.
 */
async function closePopUp(currentCard) {
    checkSubtaskDone(currentCard)
    await saveNotes();
    document.getElementById('popUp').innerHTML = '';
    loadBoard(tasks);
}
/**
 * Checks if a subtask is done and updates the task accordingly.
 * @param {number} currentCard - The index of the task in the array of tasks.
 */
function checkSubtaskDone(currentCard) {
    for (let i = 0; i < tasks[currentCard]['subtasks'].length; i++) {
        let isDone = false;
        isDone = document.getElementById('subtask_' + i).checked;
        if (isDone) {
            tasks[currentCard]['subtasks'][i]['status'] = 'done';
        }
        else {
            tasks[currentCard]['subtasks'][i]['status'] = 'undone';
        }
    }
}
/**
 * Deletes a task from the array of tasks.
 * @param {number} choicCard - The index of the task in the array of tasks.
 */
async function delCard(choicCard) {
    tasks.splice(choicCard, 1);
    await saveNotes();
    document.getElementById('popUp').innerHTML = '';
    loadBoard(tasks);
}
/**
 * Closes the pop-up for adding a task.
 * @function
 * 
 */
function closePopUpAddTask() {
    document.getElementById('popUp').innerHTML = '';
    document.getElementById('board-section').classList.remove('d-none');
}
/**
 * Searches the kanban board for tasks that match the given search query.
 * @param {Array} kanbanBoard - The array of tasks to search.
 * @param {string} searchQuery - The search query string.
 * @returns {Array} - An array of tasks that match the search query.
 */
function searchKanbanBoard(kanbanBoard, searchQuery) {
    const results = [];
    for (const card of kanbanBoard) {
        if (card.body_header.toLowerCase().includes(searchQuery) || card.body_content.toLowerCase().includes(searchQuery)) {
            results.push(card);
        }
    }
    return results;
}
/**
 * Finds tasks that match the search query and loads them onto the kanban board.
 */
function findTasks() {
    let searchQuery = document.getElementById('findTask').value;
    searchQuery = searchQuery.toLowerCase()
    let searchedTasks = searchKanbanBoard(tasks, searchQuery);
    loadBoard(searchedTasks);
}
/**
 * Checks if the device is a mobile device.
 * @returns {boolean} - true if the device is a mobile device, false otherwise.
 */
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
/**
 * Determines which menu to open based on the device type.
 * @param {string} id - The task ID.
 */
function checkWhichMenu(id) {
    if (onMobile) {
        openContextMenu(id);
    }
    else {
        openTaskFull(id)
    }
}
/**
 * Opens the context menu for the given task ID.
 * @param {string} id - The task ID.
 */
function openContextMenu(id) {
    if (document.getElementById('contextMenu' + id).classList.contains('d-none')) {
        document.getElementById('contextMenu' + id).classList.remove('d-none');
    }
    else {
        document.getElementById('contextMenu' + id).classList.add('d-none');
    }
}
/**
 * Changes the split value of the given task.
 * @param {string} split - The new split value.
 * @param {string} id - The task ID.
 */
async function changeSplit(split, id) {
    tasks[id]['split'] = split;
    await saveNotes();
    cleanOldBoard();
    loadNewBoard(tasks);
}

function closeContextMenu(id) {
    document.getElementById('contextMenu' + id).classList.add('d-none');
}

function editTask(id) {
    document.getElementById('popUp').innerHTML = loadEditAddTaskTmp(id);
    addAssignedToList();
    setDateToday();
    fillTheTasks(id)
}

