let contactsAddTask = loadContacts();
let subtasks = [];
let priotity_urgent = false;
let priotity_medium = false;
let priotity_low = true;
let currentCategory = '';
let currentColor = '';
let category;
let selectedColor;



/**
 * Adds a new task to the tasks array and saves it to storage when the "Add" button is clicked.
 * @returns {Promise<void>}
 */
async function addTask() {
    const title = document.getElementById('title_textfield').value;
    const description = document.getElementById('description_textfield').value;
    const assigned_to = getAssignedUsers();
    const due_date = document.getElementById('date').value;
    const currentSplit = checkStatus();

    if (!isCategoryValid(category)) {
        return;
    }

    new_task = createNewTaskJson(title, description, due_date, currentSplit, assigned_to);
    await addNewTask(new_task);
    await navigateToBoard();
}


/**
 * Retrieves the list of assigned users based on the checked checkboxes.
 * @returns {Array<Object>} An array of objects, each representing an assigned user.
 */
function getAssignedUsers() {
    const assigned_to = [];
    for (let i = 0; i < contactsAddTask.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            const user = document.getElementById('assigned-to-' + i).value;
            const fullName = document.getElementById('assigned_name' + i).innerHTML;
            const userColor = contactsAddTask[i]['color'];
            assigned_to.push({ 'userShort': user, 'userFullName': fullName, 'color': userColor });
        }
    }
    return assigned_to;
}


/**
 * Checks if the given category is valid, i.e. not undefined.
 * @param {string} category 
 * @returns 
 */
function isCategoryValid(category) {
    if (category === undefined) {
        document.getElementById('category-required').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('category-required').classList.add('d-none');
        }, 2000);
        return false;
    }
    return true;
}


/**
 * Creates a new task object.
 * @param {Object} new_task - The new task object to create.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} due_date - The due date of the task.
 * @param {string} currentSplit - The current split of the task.
 * @param {Array} assigned_to - An array of objects representing the users assigned to the task.
 * @returns {Object} - The new task object.
 */
function createNewTaskJson(title, description, due_date, currentSplit, assigned_to) {
    return {
        'split': currentSplit,
        'category': category,
        'color': selectedColor,
        'body_header': title,
        'body_content': description,
        'progress': '',
        'users': assigned_to,
        'priotity': checkPrioity(),
        'date': due_date,
        'subtasks': subtasks
    }
}


/**
 * Adds a new task to the task list, clears the subtasks list, and saves the updated task list to the storage.
 * @param {*} new_task - The new task to be added. 
 */
async function addNewTask(new_task) {
    tasks.push(new_task);
    subtasks = [];
    await saveNotes();
}


/**
 * Navigates to the board page, removes popup and unhides board section, and initializes the board
 */
async function navigateToBoard() {
    window.location.href = './board.html';
    document.getElementById('popUp').innerHTML = '';
    document.getElementById('board-section').classList.remove('d-none');
    await init();
}


/**
 * Checks the priority level selected and returns the corresponding image and string.
 * @returns {object[]} - An array with an object containing the priority image, string, and white image.
 */
function checkPrioity() {
    let prio;
    let priotity;
    if (priotity_low) {
        prio = "assets/img/low_priotity.png";
        priotity = 'low';
    }
    else if (priotity_medium) {
        prio = "assets/img/medium_priotity.png";
        priotity = 'medium';
    }
    else if (priotity_urgent) {
        prio = "assets/img/high_priotity.png";
        priotity = 'urgent';
    }
    return [{ 'img': prio, 'priotity': priotity, "img_white": "assets/img/Prio-" + priotity + "-white.png" }];
}


/**
 * Changes the color of the priority sections based on the selected priority radio button.
 */
function changeColor() {
    priotity_urgent = document.getElementById('urgentBtn').checked;
    priotity_medium = document.getElementById('mediumBtn').checked;
    priotity_low = document.getElementById('lowBtn').checked;

    checkChangedColor(priotity_urgent, priotity_medium, priotity_low);
}


/**
 * Updates the priority sections on the page based on which priority has been selected.
 * @param {*} priotity_urgentt - A boolean indicating whether the urgent priority has been selected. 
 * @param {*} priotity_medium - A boolean indicating whether the medium priority has been selected. 
 * @param {*} priotity_low - A boolean indicating whether the low priority has been selected. 
 */
function checkChangedColor(priotity_urgent, priotity_medium, priotity_low) {
    if (priotity_urgent) {
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent', 'Prio-urgent-white');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium', 'Prio-medium');
        document.getElementById('lowSection').innerHTML = loadPrioIMGWithText('Low', 'Prio-low');
    }
    if (priotity_medium) {
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent', 'Prio-urgent');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium', 'Prio-medium-white');
        document.getElementById('lowSection').innerHTML = loadPrioIMGWithText('Low', 'Prio-low');
    }
    if (priotity_low) {
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent', 'Prio-urgent');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium', 'Prio-medium');
        document.getElementById('lowSection').innerHTML = loadPrioIMGWithText('Low', 'Prio-low-white');
    }
}


/**
 * 	Loads the user contacts from a JSON file and sets them to the "contacts" variable.
*/
async function loadContacts() {
    await downloadFromServer();
    contactsAddTask = JSON.parse(backend.getItem('contacts')) || [];
}


/**
 * Adds the existing contacts to the "Assigned to" choices list.
 * First clears the current content of the list, then iterates over
 * the contacts array to generate a checkbox list of each contact's
 * first and last name, and assigns a value to each checkbox consisting
 * of the first initials of the first and last name concatenated.
 */
function addAssignedToList() {
    document.getElementById('assigned-to-choices').innerHTML = '';
    for (let i = 0; i < contactsAddTask.length; i++) {
        const contact = contactsAddTask[i];
        let firstName = contact['firstName'];
        let lastName = contact['lastName'];
        let acronym = firstName[0] + lastName[0];
        document.getElementById('assigned-to-choices').innerHTML += `<div class="assigned-to-line"><label for="assigned-to-${i}" id="assigned_name${i}">${firstName + ' ' + lastName}</label><input type="checkbox" id="assigned-to-${i}" value="${acronym}"></div>`
    }
}


/**
 * Toggles the visibility of a dropdown list.
 * @param {string} id - The id of the element to toggle.
 */
function openDropdown(id) {
    if (document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.remove('d-none');
    }
    else if (!document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.add('d-none');
    }
}


/**
 * Changes the text in the category header.
 * @param {string} name - The new category name.
 */
function changeCategoryHeader(name) {
    document.getElementById('category-header').innerHTML = name;
    category = name;
    currentCategory = category;

    categorySelected(name);
}


/**
 * Sets the selected color and category based on the given categoryId.
 * @param {*} categoryId - The ID of the category to be selected. 
 */
function categorySelected(categoryId) {
    if (categoryId === 'Marketing') {
        selectedColor = '#0038ff';
        category = 'Marketing';
    } else if (categoryId === 'Media') {
        selectedColor = '#ffc702';
        category = 'Media';
    } else if (categoryId === 'Backoffice') {
        selectedColor = '#1FD7C1';
        category = 'Backoffice';
    } else if (categoryId === 'Design') {
        selectedColor = '#ff7a00';
        category = 'Design';
    } else {
        selectedColor = '#fc71ff';
        category = 'Sales';
    }
    currentColor = selectedColor;
}


/**
 * Adds a new color category based on the values entered in the input fields.
 */
function addColorCategory() {
    if (!checkNewCategoryInput()) {
        return;
    }
    selectedColor = document.getElementById('category-color').value;
    category = document.getElementById('new-category-input').value;
    document.getElementById('new-category-input').classList.add('d-none');
    document.getElementById('category-added-cont').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('category-added-cont').classList.add('d-none');
        document.getElementById('new-category-input').classList.remove('d-none');
    }, 1500);
    currentCategory = category;
    currentColor = selectedColor;
}



/**
 * Checks if the input for adding a new category is not empty
 * @returns {boolean} Returns true if the input for adding a new category is not empty, otherwise false. 
 */
function checkNewCategoryInput() {
    let newCategoryInput = document.getElementById('new-category-input');

    if (newCategoryInput.value === '') {
        document.getElementById('category-required').classList.remove('d-none');
        document.getElementById('new-category-input').classList.add('d-none');
        setTimeout(() => {
            document.getElementById('category-required').classList.add('d-none');
            document.getElementById('new-category-input').classList.remove('d-none');
        }, 2000);
        return false;
    }
    return true;
}


/**
 * Changes the subtask icons to the "clear" and "add" icons when the subtask input field is clicked.
 */
function changeSubIcon() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}


/**
 * Changes the subtask icons to the "clear" and "add" icons when the input field is changed.
 */
function inputChangeSubIcons() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}


/**
 * Adds a subtask to the list and the subtasks array when the "Add" button is clicked.
 */
function addSubtask() {
    let subtask = document.getElementById('subtask').value;
    if (!subtask == '') {
        document.getElementById('subtask-list').innerHTML += `<li>${subtask}</li>`;
        document.getElementById('subtask').value = '';
        subtasks.push({
            'subtaskName': subtask,
            'status': 'undone'
        });
    }
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}


/**
 * Clears the subtask input field and changes the subtask icons back to the "plus" icon.
 */
function clearSubtask() {
    document.getElementById('subtask').value = "";
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}


/**
 * Clears all fields and checkboxes in the task form.
 */
function clearAll() {
    document.getElementById('title_textfield').value = '';
    document.getElementById('description_textfield').value = '';
    document.getElementById('category-header').innerHTML = 'Select your Category';
    for (let i = 0; i < contactsAddTask.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            document.getElementById('assigned-to-' + i).checked = false;
        }
    }
    document.getElementById('date').value = '';
    document.getElementById('subtask-list').innerHTML = '';
}


/**
 * Set the Current Date to today
 * @param {string} today - The new Date.
 */
function setDateToday() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("date").setAttribute('min', String(today));
}


/**
 * Fills the task popup form with task data, given the task ID
 * @param {*} id - The ID of the task to be filled in the form 
 */
function fillTheTasks(id) {
    let title = tasks[id]['body_header'];
    let text = tasks[id]['body_content'];
    let category = tasks[id]['category'];
    let date = tasks[id]['date'];
    let prio = tasks[id]['priotity'][0]['priotity'];
    let thisSubtasks = tasks[id]['subtasks'];

    checkPrioButton(prio);
    changeColor();
    getValueFromTaskInputs(title, text, category, date);
    loopThroughUsers(id);
    loopThroughSubtasks(thisSubtasks);
}


/**
 * Updates the priority buttons according to the selected priority.
 * @param {*} prio - The selected priority ('urgent' or 'medium'). 
 */
function checkPrioButton(prio) {
    if (prio == 'urgent') {
        priotity_urgent = document.getElementById('urgentBtn').checked = true;
        priotity_medium = document.getElementById('mediumBtn').checked = false;
        priotity_low = document.getElementById('lowBtn').checked = false;
    }
    else if (prio == 'medium') {
        priotity_urgent = document.getElementById('urgentBtn').checked = false;
        priotity_medium = document.getElementById('mediumBtn').checked = true;
        priotity_low = document.getElementById('lowBtn').checked = false;
    }
}


/**
 * Sets the values of the task inputs based on the provided parameters.
 * @param {*} title - The title of the task to set in the title textfield. 
 * @param {*} text - The description of the task to set in the description textfield. 
 * @param {*} category - The category of the task to set as the category header. 
 * @param {*} date - The date of the task to set in the date input field. 
 */
function getValueFromTaskInputs(title, text, category, date) {
    document.getElementById('title_textfield').value = title;
    document.getElementById('description_textfield').value = text;
    document.getElementById('category-header').innerHTML = category;
    document.getElementById('date').value = date;
}


/**
 * Iterates through the users assigned to a task and checks the corresponding checkboxes
 * @param {*} id - The ID of the task to loop through users for 
 */
function loopThroughUsers(id) {
    for (let j = 0; j < tasks[id]['users'].length; j++) {
        const user = tasks[id]['users'][j];
        for (let i = 0; i < contactsAddTask.length; i++) {
            if (document.getElementById('assigned-to-' + i).value == user['userShort']) {
                document.getElementById('assigned-to-' + i).checked = true;
            }
        }
    }
}


/**
 * Loops through an array of subtasks and appends each subtask name to an HTML unordered list element with the ID 'subtask-list'.
 * @param {*} thisSubtasks - An array of subtasks to loop through. 
 */
function loopThroughSubtasks(thisSubtasks) {
    for (let s = 0; s < thisSubtasks.length; s++) {
        const subtask = thisSubtasks[s];
        document.getElementById('subtask-list').innerHTML += `<li>${subtask['subtaskName']}</li>`;
    }
}


/**
 * Edits an existing task by updating its properties and saves the changes to local storage.
 * @param {*} id - The id of the task to be edited. 
 */
async function editAddTask(id) {
    let title = document.getElementById('title_textfield').value;
    let description = document.getElementById('description_textfield').value;
    category = currentCategory || tasks[id]['category'];
    selectedColor = currentColor || tasks[id]['color'];
    let assigned_to = getAssignedUsers();
    let due_date = document.getElementById('date').value;

    if (!isCategoryValid(category)) return;

    new_task = createEditedTaskJson(id, title, description, assigned_to, due_date);
    tasks[id] = new_task;
    await saveNotes();
    subtasks = [];
    window.location.href = './board.html';
}


/**
 * Creates a JSON object representing the edited task.
 * @param {*} id - The ID of the task being edited. 
 * @param {*} title - The title of the task. 
 * @param {*} description - The description of the task. 
 * @param {*} assigned_to - An array of users assigned to the task 
 * @param {*} due_date - The due date of the task. 
 * @returns {object} - A JSON object representing the edited task. 
 */
function createEditedTaskJson(id, title, description, assigned_to, due_date) {
    return {
        'split': tasks[id]['split'],
        'category': category,
        'color': selectedColor,
        'body_header': title,
        'body_content': description,
        'progress': '',
        'users': assigned_to,
        'priotity': checkPrioity(),
        'date': due_date,
        'subtasks': subtasks
    }
}


/**
 * Opens a new category input field.
 */
function openAddNewCategory() {
    document.getElementById('select-wrapper').classList.add('d-none');
    document.getElementById('new-category').classList.remove('d-none');
}


/**
 * Closes the new category input field.
 */
function closeNewCategory() {
    document.getElementById('select-wrapper').classList.remove('d-none');
    document.getElementById('new-category').classList.add('d-none');
}


/**
 * Ads a new category.
 */
function addNewCategory() {
    let newCat = document.getElementById('new-category-input').value;
    currentCategory = newCat;

    document.getElementById('category-header').innerHTML = newCat;
    document.getElementById('select-wrapper').classList.remove('d-none');
    document.getElementById('new-category').classList.add('d-none');
}