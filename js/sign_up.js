/**
 * Adds a user with the provided name, email, and password.
 */
function addUser() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    checkUser(name, email, password);   
}   


/**
 * Checks if a user with the given name or email already exists in the users array,
 * and either displays an error message if the user exists or pushes the new user to the array.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 */
function checkUser(name, email, password) {
    currentUser = users.find(u => u.email == email.toLowerCase() || u.name == name);
    if (currentUser) {
        let msgBox = document.getElementById('msg-box');
        let hideUnderline = document.getElementById('hide-underline');
        displayErrorMessage(msgBox, hideUnderline, 'This user already exists!');
    } else {
        pushUser(name, email, password);
    }
}


/**
 * Displays an error message for a specific period of time and then hides it again. *
 * @param {HTMLElement} messageElement - The HTML element that displays the error message.
 * @param {HTMLElement} hideElement - The HTML element to hide while the error message is displayed.
 * @param {string} messageText - The text of the error message to display.
 */
function displayErrorMessage(messageElement, hideElement, messageText) {
    hideElement.classList.add('d-none');
    messageElement.classList.remove('d-none');
    messageElement.innerHTML = messageText;
    setTimeout(function() {
        hideElement.classList.remove('d-none');
        messageElement.classList.add('d-none');
    }, 3000);
}

  


/**
 * Adds a new user to the users array and stores it in the backend. *
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {void}
 */
async function pushUser(name, email, password) {
    users.push({'name': name, 'email': email.toLowerCase(), 'password' : password});
    await backend.setItem('users', JSON.stringify(users));

    successfullyRegistration();
}


/**
 * Displays a success message upon successful user registration and redirects to the login page after a delay.
 */
function successfullyRegistration() {
    const msgBox = document.getElementById('msg-box');
    const hideUnderline = document.getElementById('hide-underline');
    
    hideUnderline.classList.add('d-none');
    msgBox.classList.remove('d-none');
    msgBox.innerHTML = 'Successfully registered!';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}
