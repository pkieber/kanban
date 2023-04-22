/**
 *  This function appears to perform a user login by getting the email and password values and then passing two elements (invalidLogin and hideUnderline) to the checkUser() function.
 *  CurrentUser is a global variable. This line of code searches the users array for a user object that has an email property matching the entered email and a password property matching the entered password. If such a user object is found, it assigns it to the currentUser variable.
 */
function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    currentUser = users.find(u => u.email == email.toLowerCase() && u.password == password);
    let invalidLogin = document.getElementById('invalid-login');
    let hideUnderline = document.getElementById('hide-underline');

    checkUser(invalidLogin, hideUnderline);
}


/**
 * Checks the validity of the current user's login data and redirects to the summary page if valid. 
 * @param {HTMLElement} invalidLogin - The HTML element to display an error message if login is invalid.
 * @param {HTMLElement} hideUnderline - The HTML element to hide if login is invalid.
 */
 async function checkUser(invalidLogin, hideUnderline) {
    if (currentUser) {
        await backend.setItem('current-user', JSON.stringify(currentUser));
        checkRememberMe(currentUser);
        window.location.href = 'summary.html';
    } else {
        returnInvalidLogin(invalidLogin, hideUnderline);
    }
}


/**
 * If the login data are invalid then show text information.
 * @param {*} invalidLogin - The error message element to display if the login is invalid.
 * @param {*} hideUnderline - The element to hide when displaying the error message.
 */
function returnInvalidLogin(invalidLogin, hideUnderline) {
    hideUnderline.classList.add('d-none');
        invalidLogin.classList.remove('d-none');
        setTimeout(function() {
            invalidLogin.classList.add('d-none');
            hideUnderline.classList.remove('d-none');
        }, 3000);
}


/**
 * Handles the submission of the email address for password reset. 
 * The variable currentUser finds the user with the submitted email and stores it locally. 
 * If the user is found, the showSentEmailMessage() function is called.
 */
function emailSent() {
    let email = document.getElementById('email-forgot-password').value;
    currentUser = users.find(u => u.email == email.toLowerCase());

    if (currentUser) {
        setUserLocal(currentUser);
        showSentEmailMessage();
    } else {
        showFailMessage();
    }
}


/**
 * Logs in a guest user by setting the current user as a guest and redirecting to the summary page.
 */
  async function guestLogin() {
    currentUser = {'name': 'Guest'};
    await backend.setItem('current-user', JSON.stringify(currentUser));
    window.location.href = 'summary.html';
}


/**
 * This function displays a success message to the user after they have requested a password reset email. 
 * It then redirects the user to the password reset page after a 2-second delay.
 */
function showSentEmailMessage() {
    let showMessage = document.getElementById('email-sent-text');
    showMessage.classList.remove('d-none');

    setTimeout(function() {window.location.href = 'reset_password.html';
    }, 2000);
}


/**
 * Sets the email of the current user in local storage
 * @param {object} currentUser -  The user object containing the email
 */
function setUserLocal(currentUser) {
    localStorage.setItem('user-email', currentUser.email);
}


/**
 * Displays a fail message when the email entered is not associated with any account.
 * 
 */
function showFailMessage() {
    let showMessage = document.getElementById('fail-message');
    let hideSpan = document.getElementById('forgot-pw-span');

    hideSpan.classList.add('d-none');
    showMessage.classList.remove('d-none'); 
    setTimeout(function() {
        hideSpan.classList.remove('d-none');
        showMessage.classList.add('d-none'); 
    }, 3000);
} 


/**
 * Sets a new password for the user whose email was used to request a password reset.
 * Gets the new password and confirmation password from the input fields, checks if they match,
 * and updates the user's password in the `users` array if they do match.
 */
async function setNewPassword() {
    let newPassword = document.getElementById('new-password').value;
    let confirmPassword = document.getElementById('repeat-new-password').value;
    let hideSpan = document.getElementById('reset-pw-span');
    let showMessage = document.getElementById('reset-pw-message');
    let userEmail = localStorage.getItem('user-email');
    let index = users.findIndex(u => u.email == userEmail);

    if (newPassword == confirmPassword) {
        users[index]['password'] = newPassword;
        await backend.setItem('users', JSON.stringify(users));
    } else {
        invalidNewPasswordDatas(hideSpan, showMessage);
    }
}


/**
 * Shows the information that the entered data was invalid.
 * @param {*} hideSpan - Hides the main text
 * @param {*} showMessage - Shows the information that the data is invlaid
 */
function invalidNewPasswordDatas(hideSpan, showMessage) {
    hideSpan.classList.add('d-none');
        showMessage.classList.remove('d-none');
        setTimeout(function() {
        hideSpan.classList.remove('d-none');
        showMessage.classList.add('d-none');
        }, 3000);
}


/**
 * This ifunction stops the join logo animation in responsive mode after 2.5 seconds.
 */
function animationMobileStop() {
    let animationMob = document.getElementById('animation-mobile');    

    setTimeout(function() {
        animationMob.classList.add('animation-stop');
    }, 2500);
}