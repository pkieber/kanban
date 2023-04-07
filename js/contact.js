let contacts = [];
let newContact = [];
let tasks = [];


/**
 * Loading the contacts from the server
 * @param {Array} contacts
 */
async function initContact() {
    await includeHTML();
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    loadContacts();
}


/**
 * Add contacts to array
 * Reload the contact list
 * Reset the input fields
 * @param {String} newContact
 */
function addContacts() {
    let id;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let color = document.getElementById('color').value;
    createContactCard(id, firstName, lastName, email, phone, color);
    newContact.id = contacts.length;
    contacts.push(newContact);
    backend.setItem('contacts', JSON.stringify(contacts));
    updateContactList();
    resetInputFields();
    closeAddContactForm();
}


/**
 * Create contact card
 * @param {*} id 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} color 
 */
function createContactCard(id, firstName, lastName, email, phone, color) {
    newContact = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        color: color
    };
}


/**
 * Load contacts from array and sort them by first letter
 * Array of unique first letters
 * Sorts the array alphabetically
 * @param {Array} contacts
 * @param {String} firstLetter
 * @param {String} contactFirstLetter
 * @param {String} contactList
 */
function loadContacts() {
    let firstLetters = [];
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let firstLetter = contact.lastName.charAt(0).toLowerCase();
        if (!firstLetters.includes(firstLetter)) {
            firstLetters.push(firstLetter);
        }
    }
    firstLetters.sort();
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    showContactList(contactList, firstLetters);
}


/**
 * Creates the contact list
 * @param {*} contactList 
 * @param {*} firstLetters 
 */
function showContactList(contactList, firstLetters) {
    for (let i = 0; i < firstLetters.length; i++) {
        const firstLetter = firstLetters[i];
        contactList.innerHTML += showContactFirstLettersHTML(firstLetter);
        for (let j = 0; j < contacts.length; j++) {
            const contact = contacts[j];
            let contactFirstLetter = contact.lastName.charAt(0).toLowerCase();
            if (contactFirstLetter === firstLetter) {
                contactList.innerHTML += generateContactList(contact, j);
            }
        }
    }
}


/**
 * Show contact details
 * @param {*} i 
 */
function showContactDetails(i) {
    let contactSelection = document.getElementById('contactSelection');
    contactSelection.innerHTML = '';
    let selectedContact = contacts[i];
    let userShort = selectedContact['firstName'].charAt(0).toLowerCase() + selectedContact['lastName'].charAt(0).toLowerCase()
    contactSelection.innerHTML += showContactDetailsHTML(selectedContact, i, userShort);
    document.getElementById('contactOverlay').classList.add('show-contact-selection-overlay');
}


/**
 * Close contact details
 */
function closeContactOverlay(){
    document.getElementById('contactOverlay').classList.remove('show-contact-selection-overlay');
}


/**
 * Update contact list and load contacts
 */
function updateContactList() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    loadContacts();
    closeContactOverlay();
}


/**
 * Update contact selection and load contacts
 */
function updateContactSelection() {
    let contactSelection = document.getElementById('contactSelection');
    contactSelection.innerHTML = '';
    loadContacts();
}


/**
 * Reset input fields
 */
function resetInputFields() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('color').value = '#29ABE2';
}


/**
 * Update contact in array, save to server and reload contact list
 * Close contact form
 */
function updateContact() {
    selectedContact.firstName = document.getElementById('firstName').value;
    selectedContact.lastName = document.getElementById('lastName').value;
    selectedContact.email = document.getElementById('email').value;
    selectedContact.phone = document.getElementById('phone').value;
    selectedContact.color = document.getElementById('color').value;
    backend.setItem('contacts', JSON.stringify(contacts));
    updateContactList();
    updateContactSelection();
    closeForm();
}


/**
 * Show contact form
 */
function showContactForm() {
    let contactForm = document.getElementById("contactForm");
    contactForm.classList.remove("d-none");
    document.getElementById('contact-add-btn').classList.add('d-none');
    document.getElementById('hide-contacts').classList.add('d-none');
}


/**
 * Open contact form to add new contact
 */
function openAddContactForm() {
    let contactForm = document.getElementById("contactForm");
    contactForm.classList.remove("d-none");
}


/**
 * Close contact form to add new contact
 */
function closeAddContactForm() {
    let contactForm = document.getElementById("contactForm");
    contactForm.classList.add("d-none");
    document.getElementById('contact-add-btn').classList.remove('d-none');
    document.getElementById('hide-contacts').classList.remove('d-none');
}


/**
 * Open contact form to edit contact
 * @param {*} i 
 */
function editContact(i) {
    selectedContact = contacts[i];
    const formEditContainer = document.getElementById("formContainer");
    formEditContainer.innerHTML += openEditContactFormHTML(selectedContact);
}


/**
 * Removes the selected contact from the array and updates the contact list
 * i < 7 to disable deleting of test data
 * @param {*} i 
 */
function deleteSelectedContact(i) {
    if (i < 7) {
        alert("Test data cannot be deleted. Thanks for testing.");
        return;
    }
    contacts.splice(i, 1);
    backend.setItem('contacts', JSON.stringify(contacts));
    updateContactList();
    updateContactSelection();
}


/**
 * Open contact form to add new task
 * @param {*} i 
 */
async function addTaskContact(userShort) {
    const formTaskContainer = document.getElementById("formContainer");
    formTaskContainer.innerHTML += openAddTaskContactFormHTML();
    addAssignedToList();
    await loadNotes();
    setDateToday();
    for (let i = 0; i < contacts.length; i++) {
        if(userShort == document.getElementById('assigned-to-' + i).value.toLowerCase()){
            document.getElementById('assigned-to-' + i).checked = true;
        }
    }
}


/**
 * Close contact form
 */
function closeForm() {
    const contactForm = document.getElementById("contactForm");
    contactForm.remove();
}


/**
 * Close contact form to add new task
 */
function closeAddTaskForm() {
    const contactForm = document.getElementById("formTaskContainer");
    contactForm.remove();
}


//////////////////////////////////
////////// Add Task - Popup //////////
let currentCategory = '';
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

    for (let i = 0; i < contacts.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            user = document.getElementById('assigned-to-' + i).value;
            let fullName = document.getElementById('assigned_name' + i).innerHTML;
            let userColor = contacts[i]['color'];
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
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent','Prio-urgent-white');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium','Prio-medium');
        document.getElementById('lowSection').innerHTML = loadPrioIMGWithText('Low','Prio-low');
    }
    if (priotity_medium) {
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent','Prio-urgent');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium','prio-medium-white');
        document.getElementById('lowSection').innerHTML = loadPrioIMGWithText('Low','Prio-low');
    }
    if (priotity_low) {
        document.getElementById('urgentSection').innerHTML = loadPrioIMGWithText('Urgent','Prio-urgent');
        document.getElementById('mediumSection').innerHTML = loadPrioIMGWithText('Medium','Prio-medium');
        document.getElementById('lowSection').innerHTML = loadPrioIMGWithText('Low','Prio-low-white');
    }
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
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
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
    for (let i = 0; i < contacts.length; i++) {
        if (document.getElementById('assigned-to-' + i).checked) {
            document.getElementById('assigned-to-' + i).checked = false;
        }

    }
    document.getElementById('date').value = '';
    document.getElementById('subtask-list').innerHTML = '';
}


function setDateToday() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("date").setAttribute('min', String(today));
}


async function loadNotes() {
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('allTasks')) || [];
}


async function saveNotes() {
    let tasksAsJson = JSON.stringify(tasks);
    await backend.setItem('allTasks', tasksAsJson);
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