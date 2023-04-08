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


async function loadNotes() {
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('allTasks')) || [];
}


async function saveNotes() {
    let tasksAsJson = JSON.stringify(tasks);
    await backend.setItem('allTasks', tasksAsJson);
}