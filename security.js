const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
// If the user is not logged in, redirect them to the login page
if (isLoggedIn !== 'true') {
    window.location.href = 'login.html';
} else {
    // Get the user's name from sessionStorage
    const userName = sessionStorage.getItem('name');
    const welcomeElement = document.getElementById('welcomeMessage');

    // Display the welcome message
    if (userName) {
        welcomeElement.textContent = `Welcome ${userName}!`;
    } else {
        welcomeElement.textContent = "Welcome member!";
    }
}