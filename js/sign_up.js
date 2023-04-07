// Fetch datas value from input-fields and execute checkUser function 
function addUser() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    checkUser(name, email, password);   
}   


// Check if user is already signed in. If yes it triggers a message, else execute function pushUser 
function checkUser(name, email, password) {
    let msgBox = document.getElementById('msg-box');
    let hideUnderline = document.getElementById('hide-underline');
    currentUser = users.find(u => u.email == email.toLowerCase() || u.name == name);
    
    if (currentUser) {
        hideUnderline.classList.add('d-none');
        msgBox.classList.remove('d-none');
        setTimeout(function() {
            hideUnderline.classList.remove('d-none');
            msgBox.classList.add('d-none');
        }, 3000);
        msgBox.innerHTML = 'This user does already exists!';
    } else {
        pushUser(name, email, password);
    }
}


// Push user into JSON Array and save his datas into backend
async function pushUser(name, email, password) {
    users.push({'name': name, 'email': email.toLowerCase(), 'password' : password});
    await backend.setItem('users', JSON.stringify(users));

    successfullyRegistration();
}


// Finally after successfull registration a message is shown for 3 seconds
function successfullyRegistration() {
    let msgBox = document.getElementById('msg-box');
    let hideUnderline = document.getElementById('hide-underline');
    hideUnderline.classList.add('d-none')
    msgBox.classList.remove('d-none');
    msgBox.innerHTML = 'Successfully registered!';

    setTimeout(function() {
        window.location.href = 'index.html';
    }, 3000);
} 