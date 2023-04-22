/**
 * Generates the HTML code for a full view of a task card.
 * @param {Object} task_name - The object containing the information for the task card.
 * @param {number} choiceTask - The index of the task card to be displayed.
 * @returns {string} The HTML code for the full view of the task card.
 */
function loadCardFullText(task_name, choiceTask) {
    return `
    <div class="popUp-background" id="close-popup${choiceTask}" onclick="closePopup(${choiceTask})">
            <div class="popUp-content" onclick="event.stopPropagation()">
                <div class="popUp-close" id="close-task"><img class="popup-img" src="./assets/img/xicon.png" onclick="closePopUp(${choiceTask})"></div>
                <div class="card-head" style="background-color: ${task_name[choiceTask]['color']};">${task_name[choiceTask]['category']}</div>
                <h2>${task_name[choiceTask]['body_header']}</h2>
                <p>${task_name[choiceTask]['body_content']}</p>                
                <div id=subtaskSectionCheck>
                <label><b>Subtasks</b></label>
                <section class="subtaskSection" id="subtaskSection">
                </section></div>
                <div class="makeRow"><b class="margin10">Due Date: </b><p>${task_name[choiceTask]['date']}</p></div>
                <div class="makeRow"><b class="margin10">Priority: </b><p class="prio-${task_name[choiceTask]['priotity'][0]['priotity']}-popUp">${task_name[choiceTask]['priotity'][0]['priotity']} <img src="${tasks[choiceTask]['priotity'][0]['img_white']}"></p></div>
                <div class="makeRow"><b class="margin10">Assigned To: </b></div>
                <div class="users makeColumn" id="userSection"></div>
                <div class="space"><img class="changeIcon" onclick="editTask(${choiceTask})" src="./assets/img/edit_pencil.svg"<div class="put_it_right"><img class="trash-icon" src="./assets/img/empty-trash-32.png" onclick=delCard(${choiceTask})></div></div>
            </div>
        </div>    
    `
}


/**
 * Generates the HTML code for a task card in a board view.
 * @param {Object} tasks_name - The object containing the information for the task card.
 * @param {number} id - The id of the task card.
 * @param {string} catgoryLow - The lowercase string representation of the category of the task card.
 * @returns {string} The HTML code for the task card in a board view.
 */
function loadCardBoardText(tasks_name, id) {
    return `
    <div>
    <div id="card-head-${id}" class="card" id=card${id} draggable="true" ondragstart="startDragging(${id})" onclick="checkWhichMenu(${id}); event.stopPropagation();">
        
            <div class="card-content">                                      
            <div id="card-head-color" class="card-head" style="background-color: ${tasks_name['color']}">
                    ${(tasks_name['category'])}
                </div>
                <div class="card-body">
                    <h4>${tasks_name['body_header']}</h4>
                    <p>${tasks_name['body_content']}</p>
                </div>
                <div id="progress${id}">
                </div>
                <div class="priotity_users">
                    <div class="users" id="users${id}">
                    </div>
                    <div class="priotity">
                        <img src="${tasks_name['priotity'][0]['img']}" alt="">
                    </div>
                </div>
            </div>
    
            <div>
                <div class="popUpWish d-none" id="contextMenu${id}">
                    <div class="headContextMenu"><h3>Choose your wish</h3><img onclick="closeHeadContextMenu(${id}); event.stopPropagation(); " src="./assets/img/xicon.png"></div>
                    <img src="./assets/img/summary_underline.svg">
                    <div onclick="changeSplit('to_do',${id})">
                        <p>Change to <b>To Do</b></p>
                    </div>
                    <div onclick="changeSplit('in_progress',${id})">
                        <p>Change to <b>In Progress</b></p>
                    </div>
                    <div onclick="changeSplit('awaiting_feedback',${id})">
                        <p>Change to <b>Awaiting Feedback</b></p>
                    </div>
                    <div onclick="changeSplit('done',${id})">
                        <p>Change to <b>Done</b></p>
                    </div>
                    <div onclick="openTaskFull(${id})">
                        <p>Open <b>Full Task</b></p>
                    </div>
                </div>
            </div>
    </div>
    </div>
    
    `
}


/**
 * Generates the HTML code for the popup that appears when adding a new task.
 * @returns {string} The HTML code for the popup for adding a new task.
 */
function loadAddTaskTmp() {
    return /*html*/ `
    <div class="popUp-background"  id="popUp-background" onclick="closePopupAddTask()">
        <div class="popUp-content_add_task" id="popup-add-task"  onclick="event.stopPropagation()">
            <div class="headerPopUp"><h2>Add Task</h2>
                <img class="close-header-popup" src="./assets/img/xicon.png" onclick="closePopUpAddTask()">
            </div>
            <form onsubmit="addTask();return false">
                <div class="content-container">
                    <div class="left-container">
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
                                    <input id="category-color" type="color" value="#2a3647" required>
                                    <img src="./assets/img/checkmark.png" alt="#" onclick="addColorCategory()">
                                    <img src="./assets/img/cancel.png" alt="#" onclick="closeNewCategory()">
                                </div>
                            </div>
                                <div class="select-wrapper" id="select-wrapper" onclick="openDropdown('category-choices')">
                                    <div class="sector_top" id="sector-top">
                                        <p id="category-header">Select your Category</p>
                                        <img src="./assets/img/arrow_down.png">
                                    </div>
                                    <div class="category-choices d-none" id="category-choices">
                                        <div class="category" onclick="openAddNewCategory('category-choices')">New Category<img class="new-category-img" src="assets/img/add_task_mob.svg">
                                    </div>
                                    <div class="category" onclick="changeCategoryHeader('Marketing')">
                                        <div id="marketing">Marketing </div>
                                        <div class="circle" style="background: #0038ff;"></div>
                                    </div>
                                    <div class="category" onclick="changeCategoryHeader('Media')">
                                        <div id="media">Media </div>
                                        <div class="circle" style="background: #ffc702;"></div>
                                    </div>
                                    <div class="category" onclick="changeCategoryHeader('Backoffice')">
                                        <div id="backoffice">Backoffice </div>
                                        <div class="circle" style="background: #1FD7C1;"></div>
                                    </div>
                                    <div class="category" onclick="changeCategoryHeader('Design')">
                                        <div id="design">Design </div>
                                        <div class="circle" style="background:  #ff7a00;"></div>
                                    </div>
                                    <div class="category" onclick="changeCategoryHeader('Sales')">
                                        <div id="sales">Sales </div>
                                        <div class="circle" style="background: #fc71ff;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="selection-container prevent-select">
                            <label>Assigned To</label>
                            <div class="select-wrapper assigned-to-wrapper">
                                <div class="sector_top" onclick="openDropdown('assigned-to-choices')">
                                    <p id="assigned-to-header">Select your Members</p><img src="./assets/img/arrow_down.png">
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
            <div class="middle-gap"></div>
            <div class="right-container">
                <div class="features-container">
                    <label for="date">Due Date</label>
                    <input class="date" type="date" id="date" name="date" min="" required>
                </div>
                <div class="features-container">
                    <label>Prio</label>
                    <div onchange="changeColor(); return false" class="prio-btn-container">
                        <input type="radio" class="checkbox_urgen" id="urgentBtn" name="radio">
                        <label for="urgentBtn" class="prio-btn prio-urgent urgentSection" for="checkbox_urgen" id="urgentSection">Urgent<img id="prioUrgentWhite" src="assets/img/Prio-urgent.png"></label>
                        <input type="radio" class="checkbox_medium" id="mediumBtn" name="radio">
                        <label for="mediumBtn" class="prio-btn prio-urgent mediumSection" for="checkbox_urgen" id="mediumSection">Medium<img id="prioUrgentWhite" src="assets/img/Prio-medium.png"></label>
                        <input type="radio" class="checkbox_low" id="lowBtn" name="radio" checked><label for="lowBtn" class="prio-btn prio-urgent lowSection" for="checkbox_urgen" id="lowSection">Low<img id="prioUrgentWhite" src="assets/img/Prio-low-white.png"></label>
                    </div>
                    <div class="features-container">
                        <label>Subtasks</label>
                        <div class="subtask-container">
                            <input class="subtask-input" onclick="inputChangeSubIcons()"placeholder="Add new subtask" id="subtask"><img id="plusSubtaskImg" class="plus-icon" src="assets/img/plus-icon.png" onclick="changeSubIcon()">
                            <div class="subtask-img-container">
                                <img id="clearSubtaskImg" src="assets/img/icon_cancel_subtask.svg" onclick="clearSubtask()" class="subtask-icons d-none">
                                <div class="gap-img-subtask"></div>
                                <img id="addSubtaskImg" src="assets/img/icon_check_subtask.svg" onclick="addSubtask()" class="subtask-icons d-none">
                            </div>
                        </div>
                    <div>
                <ul id="subtask-list"></ul>
                </div>
            </div>
        </div>
        <div class="submit-and-clear" id="submit-and-clear">
            <div class="btn-clear" onclick="clearAll()">Clear<img class="clear-img" src ="assets/img/iconoir_cancel.svg"></div>
            <div><Button class="btn-createTask">Create Task<img src ="assets/img/akar-icons_check.svg"></Button></div>
        </div>
    </div>
</div>
</form>
</div>
</div>
<script>setDateToday();</script>
`
}


/**
 * Generates HTML code for a progress bar indicating the percentage of completed subtasks
 * @param {number} doneTasks - The number of subtasks that have been complete
 * @param {number} sumTasks - The total number of subtasks that need to be completed
 * @returns {string} - The HTML code for the progress bar
 */
function loadSubtaskBoardtmp(doneTasks, sumTasks) {
    return `
    <div class="progress_bar">
        <div style="width: 70%; background-color: lightgrey; border-radius: 3px;">
            <div style="background: #0D99FF; height:12px;width:${doneTasks / sumTasks * 100}%; border-radius: 3px;">
            </div>
        </div>
        <div>
            ${doneTasks}/${sumTasks} Done
        </div>
    </div>`
}


/**
 * Generates HTML code for a circle containing a user's short name
 * @param {Object} user - The user object containing the short name
 * @returns {string} - The HTML code for the circle
 */
function loadUserShortsTmp(user) {
    return `<p class="circle" style="background-color: ${user['color'] || 'blue'} ;">${user['userShort']}</p>`
}


/**
 * Generates HTML code for a row containing a user's short and full name for a full task
 * @param {Object[]} users - An array of user objects
 * @param {number} u - The index of the user object to display
 * @returns {string} - The HTML code for the row
 */
function loadTextUsersForFullTask(users, u) {
    return `<div class="makeRow">
    <p class="circle" style="background-color: ${users[u]['color'] || 'blue'}; margin-right: 20px;">${users[u]['userShort']}</p><p>${users[u]['userFullName']}</p>
    </div>`
}


/**
 * Generates HTML code for a drop area for a particular split
 * @param {string} split - The name of the split for the drop area
 * @returns {string} - The HTML code for the drop area
 */
function loadDropArea(split) {
    return `<div class="dropArea" id="dropArea_${split}" ondrop="moveTo('${split}')" ondragover="allowDrop(event, '${split}')" ondragleave="diableDrop('${split}')"></div>`
}


/**
 * Generates HTML code for a priority icon and text
 * @param {string} pri - The priority level
 * @param {string} prioIMG - The name of the priority icon image file
 * @returns {string} - The HTML code for the priority icon and text
 */
function loadPrioIMGWithText(pri, prioIMG) {
    return `${pri}<img src="assets/img/${prioIMG}.png">`;
}


function loadEditAddTaskTmp(id) {
  return `<div class="popUp-background" id="close-add-task" onclick="closeAddtask()">
    <div class="popUp-content_add_task" id="popup-add-task" onclick="event.stopPropagation()">
    <div class="headerPopUp"><h2>Add Task</h2><img src="./assets/img/xicon.png" onclick="closePopUpAddTask()"></div>
    <form onsubmit="editAddTask(${id});return false">
        <div class="content-container">
            <div class="left-container">
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
                    <input id="category-color" type="color" value="#2a3647" required>
                    <img src="./assets/img/checkmark.png" alt="#" onclick="addColorCategory()">
                    <img src="./assets/img/cancel.png" alt="#" onclick="closeNewCategory()">
                </div>
            </div>
            <div class="d-none" id="select-color">
                <div class="select-color" style="background: #0038ff;" onclick="selectColor(1)"></div>
                <div class="select-color" style="background: #ffc702;" onclick="selectColor(2)"></div>
                <div class="select-color" style="background: #1FD7C1;" onclick="selectColor(3)"></div>
                <div class="select-color" style="background:  #ff7a00;" onclick="selectColor(4)"></div>
                <div class="select-color" style="background: #fc71ff;" onclick="selectColor(5)"></div>
            </div>
            <div class="select-wrapper" id="select-wrapper" onclick="openDropdown('category-choices')">
                <div class="sector_top">
                    <p id="category-header">Select your Category</p><img src="./assets/img/arrow_down.png">
                </div>
                <div class="category-choices d-none" id="category-choices">
                    <div class="category" onclick="openAddNewCategory('category-choices')">New Category<img class="new-category-img" src="assets/img/add_task_mob.svg">
                    </div>
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
    <div class="middle-gap"></div>
    <div class="right-container">
        <div class="features-container">
            <label for="date">Due Date</label>
            <input class="date" type="date" id="date" name="date" min="" required>
        </div>
        <div class="features-container">
            <label>Prio</label>
            <div onchange="changeColor(); return false" class="prio-btn-container">
                <input type="radio" class="checkbox_urgen" id="urgentBtn" name="radio">
                <label for="urgentBtn" class="prio-btn prio-urgent urgentSection" for="checkbox_urgen" id="urgentSection">Urgent<img id="prioUrgentWhite" src="assets/img/Prio-urgent.png"></label>
                <input type="radio" class="checkbox_medium" id="mediumBtn" name="radio">
                <label for="mediumBtn" class="prio-btn prio-urgent mediumSection" for="checkbox_urgen" id="mediumSection">Medium<img id="prioUrgentWhite" src="assets/img/Prio-medium.png"></label>
                <input type="radio" class="checkbox_low" id="lowBtn" name="radio" checked>
                <label for="lowBtn" class="prio-btn prio-urgent lowSection" for="checkbox_urgen" id="lowSection">Low<img id="prioUrgentWhite" src="assets/img/Prio-low-white.png"></label>
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
                    <ul id="subtask-list"></ul>
                </div>
            </div>
        </div>
        <div class="submit-and-clear" id="submit-and-clear">
            <div class="btn-clear" onclick="clearAll()">Clear<img class="clear-img" src ="assets/img/iconoir_cancel.svg"></div>
            <div><Button class="btn-createTask">Save Task<img src ="assets/img/akar-icons_check.svg"></Button></div>
        </div>
    </div>
</div>
</form>
</div>
</div>
<script>setDateToday();</script>
`
}



