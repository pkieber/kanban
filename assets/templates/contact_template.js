/**
 * Shows list of all contacts in alphabetical order.
 * @param {*} contact 
 * @param {*} i 
 * @returns 
 */
function generateContactList(contact, i) {
    return `
    <div id="highlight-${i}" onclick="showContactDetails(${i}); hightlightContact(${i})" class="contact-list-box" title="show contact details">
        <div id="contactColor" class="contact-letters small-letters" style="background-color: ${contact.color}">
                ${contact.lastName.charAt(0).toUpperCase()}${contact.firstName.charAt(0).toUpperCase()}
            </div>
            <div class="contact-details">
                <div class="contact-name">${contact.lastName} ${contact.firstName}</div>
                <div class="contact-email">${contact.email}</div>
            </div>
        </div>
    `;
}


/**
 * Shows headline of first letters sorted alphabetically.
 * @param {*} firstLetter 
 * @returns 
 */
function showContactFirstLettersHTML(firstLetter) {
    return `
            <h2 class="contact-index">${firstLetter.toUpperCase()}</h2>
            <div class="contact-underline"></div>
        `;
}


/**
 * Shows selected contact with all details. 
 * @param {*} selectedContact 
 * @param {*} i 
 * @param {*} userShort 
 * @returns 
 */
function showContactDetailsHTML(selectedContact, i, userShort) {
    return `
        <div onclick="closeContactOverlay()" class="close-btn close-btn-overlay">
            <img class="close-icon" title="back" src="./assets/img/arrow_left.svg" alt="#">
        </div>
        <div class="contact-selection">
            <div id="selectedContactColor" class="contact-letters big-letters" style="background-color: ${selectedContact.color}">${selectedContact.lastName.charAt(0)} ${selectedContact.firstName.charAt(0)}</div>
            <div>
                <div class="contact-information-name">${selectedContact.lastName} ${selectedContact.firstName}</div>
                <div title="add new task" onclick="addTaskContact('${userShort}')" class="contact-add-task">+ Add Task</div>
            </div>
        </div>
        <div class="contact-information-title">
            <p>Contact Information</p>
            <div title="edit contact info" onclick="editContact(${i})" class="contact-edit"><img class="contact-edit-icon" src="./assets/img/edit_icon.svg">Edit Contact</div>
        </div>
        <h4>Email</h4>
        <div class="contact-email">${selectedContact.email}</div>
        <h4>Phone</h4>
        <div class="contact-name">${selectedContact.phone}</div>
        <div class="contact-edit-tools">
            <div title="delete contact"><img onclick="deleteSelectedContact(${i})" class="contact-trash-icon" src="./assets/img/empty-trash-32.png"></div>
            <div class="icon-bottom-right" title="edit contact info" onclick="editContact(${i})"><img class="edit-pencil-icon" src="./assets/img/edit_pencil.svg"></div>
        </div>
    `;
}


/**
 * Shows contact form to edit contacts.
 * @param {*} selectedContact 
 * @returns 
 */
function openEditContactFormHTML(selectedContact) {
    return `
        <div id="contactForm" class="contact-form-overlay">
            <div class="contact-form-left">
                <img class="contact-form-logo" src="./assets/img/Logo-Join.png" alt="#">
                <span class="contact-form-heading">Edit Contact</span>
                <img class="contact-form-underline" src="assets/img/underline.svg" alt="">
            </div>
            <div class="contact-form-right">
            <div id="selectedContactColor" class="contact-letters big-letters margin-letters" style="background-color: ${selectedContact.color}">${selectedContact.lastName.charAt(0)} ${selectedContact.firstName.charAt(0)}</div>
            <div class="contact-input-container margin-top">
                <div onclick="closeFormById('contactForm')" class="icon-top-right" title="close form">
                    <img class="contact-cancel-icon" src="./assets/img/contact-cancel-icon.svg" alt="#">
                    <img class="contact-cancel-icon-mobile hide-content" src="assets/img/x_ixon.png" alt="">
                </div>
                <form onsubmit="updateContact(); return false;">
                    <div class="form-group">
                        <input class="contact-input-field input-name-img" type="text" placeholder="First Name" id="firstName" name="firstName" value="${selectedContact.firstName}" required>
                    </div>
                    <div class="form-group">
                        <input class="contact-input-field input-name-img" type="text" placeholder="Last Name" id="lastName" name="lastName" value="${selectedContact.lastName}" required>
                    </div>
                    <div class="form-group">
                        <input class="contact-input-field input-email-img" type="email" placeholder="Email" id="email" name="email" value="${selectedContact.email}" required>
                    </div>
                    <div class="form-group">
                        <input class="contact-input-field input-phone-img" type="tel" placeholder="Phone" id="phone" name="phone" value="${selectedContact.phone}" pattern="[+0-9\s]+" required>
                    </div>
                    <div class="form-group">
                        <input class="p-none"type="color" id="color" name="color" value="${selectedContact.color}" required>
                    </div>
                    <div class="form-group btn-centered">
                        <button type="submit" class="contact-add-btn">
                            <p>Save</p>
                            <img class="contact-create-icon" src="./assets/img/contact-create-icon.svg" alt="#">
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        
    `;
}


/**
 * Shows contact form to add new tasks.
 * @returns 
 */
function openAddTaskContactFormHTML() {
    return `
    <div>
    <form id="formTaskContainer" class="contact-form-overlay" onsubmit="addTask(); return false;">
        <div class="add-form-left">
            <span class="contact-form-heading">Add Task</span>
            <div>
                <div class="selection-container">
                    <label>Title</label>
                    <input placeholder="Enter a title" id="title_textfield" required>
                </div>
                <div class="selection-container">
                    <label>Description</label>
                    <textarea placeholder="Enter a description" id="description_textfield" required></textarea>
                </div>
                <div class="selection-container prevent-select">
                    <label>Category</label>
                    <div id="new-category" class="new-cat input-new-cat d-none">
                    <input id="new-category-input" type="name" placeholder="Category Name ...">
                    <div id="category-added-cont" class="category-added-cont d-none" >New Category added!</div>
                    <div id="category-required" class="category-added-cont d-none">Please enter a category!</div>
                    <div class="new-category-icons">
                    <input id="category-color" type="color" value="#2a3647">
                    <img src="./assets/img/checkmark.png" alt="#" onclick="addColorCategory()">
                    <img src="./assets/img/cancel.png" alt="#" onclick="closeNewCategory()">
                </div>
                </div>
                    <div class="select-wrapper"  id="select-wrapper"  onclick="openDropdown('category-choices')">
                        <div class="sector_top">
                            <p id="category-header">Select your Category</p><img src="./assets/img/arrow_down.png">
                        </div>
                        <div class="category-choices d-none" id="category-choices">
                        <div class="category" onclick="openAddNewCategory('category-choices')">New Category<img class="new-category-img" src="assets/img/add_task_mob.svg"></div>
                            <div class="category" onclick="changeCategoryHeader('Marketing')">
                                <div id="marketing">Marketing </div>
                                <div class="circle" style="background: #0038ff;"></div>
                            </div>
                            <div class="category" onclick="changeCategoryHeader('Media')">
                                <div>Media </div>
                                <div class="circle" style="background: #ffc702;"></div>
                            </div>
                            <div class="category" onclick="changeCategoryHeader('Backoffice')">
                                <div>Backoffice </div>
                                <div class="circle" style="background: #1FD7C1;"></div>
                            </div>
                            <div class="category" onclick="changeCategoryHeader('Design')">
                                <div>Design </div>
                                <div class="circle" style="background:  #ff7a00;"></div>
                            </div>
                            <div class="category" onclick="changeCategoryHeader('Sales')">
                                <div>Sales </div>
                                <div class="circle" style="background: #fc71ff;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="selection-container prevent-select">
                    <label>Assigned To</label>
                    <div class="select-wrapper assigned-to-wrapper">
                        <div class="sector_top" onclick="openDropdown('assigned-to-choices')">
                            <p id="assigned-to-header">Select your Members</p><img
                                src="./assets/img/arrow_down.png">
                        </div>
                        <div class="assigned-to-choices d-none" id="assigned-to-choices">
                            <div class="assigned-to" onclick="changeCategoryHeader('Marketing')">
                                <div id="marketing">Marketing </div>
                                <div class="circle" style="background: #0038ff;"></div>
                            </div>
                            <div class="assigned-to" onclick="changeCategoryHeader('Media')">
                                <div>Media </div>
                                <div class="circle" style="background: #ffc702;"></div>
                            </div>
                            <div class="assigned-to" onclick="changeCategoryHeader('Backoffice')">
                                <div>Backoffice </div>
                                <div class="circle" style="background: #1FD7C1;"></div>
                            </div>
                            <div class="assigned-to" onclick="changeCategoryHeader('Design')">
                                <div>Design </div>
                                <div class="circle" style="background:  #ff7a00;"></div>
                            </div>
                            <div class="assigned-to" onclick="changeCategoryHeader('Sales')">
                                <div>Sales </div>
                                <div class="circle" style="background: #fc71ff;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="seperator-line-container">
            <div class="separator-line"></div>
        </div>
        <div class="add-form-right">
            <div class="contact-input-container">
                <div onclick="closeFormById('formTaskContainer')" class="icon-top-right" title="close form">
                    <img class="contact-cancel-icon-mobile" src="./assets/img/contact-cancel-icon.svg" alt="#">
                </div>
                <div>
                    <div class="features-container">
                        <label for="date">Due Date</label>
                        <input class="date" type="date" id="date" name="date" min="" required>
                    </div>
                    <div class="features-container">
                        <label>Prio</label>
                        <div onchange="changeColor(); return false" class="prio-btn-container">
                            <input type="radio" class="checkbox_urgen" id="urgentBtn" name="radio">
                            <label for="urgentBtn" class="prio-btn prio-urgent urgentSection" for="checkbox_urgen"
                                id="urgentSection">
                                Urgent<img id="prioUrgentWhite" src="assets/img/Prio-urgent.png">
                            </label>
                            <input type="radio" class="checkbox_medium" id="mediumBtn" name="radio">
                            <label for="mediumBtn" class="prio-btn prio-urgent mediumSection" for="checkbox_urgen"
                                id="mediumSection">
                                Medium<img id="prioUrgentWhite" src="assets/img/Prio-medium.png">
                            </label>
                            <input type="radio" class="checkbox_low" id="lowBtn" name="radio" checked>
                            <label for="lowBtn" class="prio-btn prio-urgent lowSection" for="checkbox_urgen"
                                id="lowSection">
                                Low<img id="prioUrgentWhite" src="assets/img/Prio-low-white.png">
                            </label>
                        </div>
                        <div class="features-container">
                            <label>Subtasks</label>
                            <div class="subtask-container">
                                <input class="subtask-input" onclick="inputChangeSubIcons()"placeholder="Add new subtask" id="subtask">
                                <img id="plusSubtaskImg" class="plus-icon" src="assets/img/plus-icon.png" onclick="changeSubIcon()">
                                <div class="subtask-img-container">
                                <img id="clearSubtaskImg" src="assets/img/icon_cancel_subtask.svg" onclick="clearSubtask()" class="subtask-icons d-none">
                                <div class="gap-img-subtask"></div>
                                <img id="addSubtaskImg" src="assets/img/icon_check_subtask.svg" onclick="addSubtask()" class="subtask-icons d-none">
                                </div>
                            </div>
                            <div>
                                <ul id="subtask-list">
                                </ul>
                            </div>
                        </div>
                </div>
                <div class="contact-form-buttons btn-centered">
                    <button type="button" onclick="closeFormById('formTaskContainer')" class="contact-cancel-btn" title="close form">
                        <p>Cancel</p>
                        <img class="contact-create-icon" src="assets/img/iconoir_cancel.svg" alt="#">
                    </button>
                    <button type="submit" class="contact-add-btn" title="add new task">
                        <p>Create Task</p>
                        <img class="contact-create-icon" src="./assets/img/contact-create-icon.svg" alt="#">
                    </button>
                </div>
            </div>
        </div>
    </form>
    </div>
    `;
}