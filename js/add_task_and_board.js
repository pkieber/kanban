let currentCategory = '';
let contactsAddTask = loadContacts();
let subtasks = [];
let priotity_urgent = false;
let priotity_medium = false;
let priotity_low = true;

/**
 * Adds a new task to the tasks array and saves it to storage when the "Add" button is clicked.
 * @function
 * @returns {Promise<void>}
 */
async function addTask() {
    let title = document.getElementById('title_textfield').value;
    let description = document.getElementById('description_textfield').value;
    let category = currentCategory;
    let assigned_to = [];
    let due_date = document.getElementById('date').value;
    let new_task;

    for (let i = 0; i < contactsAddTask.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            user = document.getElementById('assigned-to-' + i).value;
            let fullName = document.getElementById('assigned_name' + i).innerHTML;
            let userColor = contactsAddTask[i]['color'];
            assigned_to.push({ 'userShort': user, 'userFullName': fullName, 'color': userColor });
        }

    }
    new_task = {
        'split': 'to_do',
        'category': category,
        'body_header': title,
        'body_content': description,
        'progress': '',
        'users': assigned_to,
        'priotity': checkPrioity(),
        'date': due_date,
        'subtasks': subtasks
    }
    tasks.push(new_task);
    await saveNotes();
    subtasks = [];
    window.location.href = './board.html'
}

/**
 * Checks the priority level selected and returns the corresponding image and string.
 * @function
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

    if (priotity_urgent) {
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent', 'Prio-urgent-white');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium', 'Prio-medium');
        document.getElementById('lowSection').innerHTML = loadPrioIMGWithText('Low', 'Prio-low');
    }
    if (priotity_medium) {
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent', 'Prio-urgent');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium', 'prio-medium-white');
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
 * 	
 * @async
 * @function
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
    currentCategory = name;
}

/**
 * Changes the subtask icons to the "clear" and "add" icons when the subtask input field is clicked.
 * @function
 * 
 */
function changeSubIcon() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

/**
 * Changes the subtask icons to the "clear" and "add" icons when the input field is changed.
 * @function
 * 
 */
function inputChangeSubIcons() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

/**
 * Adds a subtask to the list and the subtasks array when the "Add" button is clicked.
 * @function
 * 
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
 * @function
 * 
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
 * 
 * @param {string} today - The new Date.
 */
function setDateToday() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("date").setAttribute('min', String(today));
}

function fillTheTasks(id) {
    let title = tasks[id]['body_header'];
    let text = tasks[id]['body_content'];
    let category = tasks[id]['category'];
    let date = tasks[id]['date'];
    let prio = tasks[id]['priotity'][0]['priotity'];
    let thisSubtasks = tasks[id]['subtasks'];
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
    changeColor();
    document.getElementById('title_textfield').value = title;
    document.getElementById('description_textfield').value = text;
    document.getElementById('category-header').innerHTML = category;
    document.getElementById('date').value = date;

    for (let j = 0; j < tasks[id]['users'].length; j++) {
        const user = tasks[id]['users'][j];
        for (let i = 0; i < contactsAddTask.length; i++) {
            if (document.getElementById('assigned-to-' + i).value == user['userShort']) {
                document.getElementById('assigned-to-' + i).checked = true;
            }

        }
    }
    for (let s = 0; s < thisSubtasks.length; s++) {
        const subtask = thisSubtasks[s];
        document.getElementById('subtask-list').innerHTML += `<li>${subtask['subtaskName']}</li>`;        
    }
}

async function editAddTask(id){
    let title = document.getElementById('title_textfield').value;
    let description = document.getElementById('description_textfield').value;
    let category = currentCategory || tasks[id]['category'];
    let assigned_to = [];
    let due_date = document.getElementById('date').value;
    let new_task;

    for (let i = 0; i < contactsAddTask.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            user = document.getElementById('assigned-to-' + i).value;
            let fullName = document.getElementById('assigned_name' + i).innerHTML;
            let userColor = contactsAddTask[i]['color'];
            assigned_to.push({ 'userShort': user, 'userFullName': fullName, 'color': userColor });
        }

    }
    new_task = {
        'split': tasks[id]['split'],
        'category': category,
        'body_header': title,
        'body_content': description,
        'progress': '',
        'users': assigned_to,
        'priotity': checkPrioity(),
        'date': due_date,
        'subtasks': subtasks
    }
    tasks[id] = new_task;
    await saveNotes();
    subtasks = [];
    window.location.href = './board.html'
}