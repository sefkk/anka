// login.js

// Select the login button
document.getElementById('loginBtn').addEventListener('click', onSubmit);
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    onSubmit();
  }
});

async function onSubmit(event) {
    event.preventDefault();

    // Get the values from the inputs
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const credentials = { username, password };

    try {
        // Send credentials to backend
        const response = await fetch('https://anka-vkrl.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            // This line is where the data from the server is processed
            const data = await response.json(); 

            // This line tries to get the name from the server response
            console.log(data.name); 
            
            // This line saves the name to sessionStorage
            sessionStorage.setItem('userName', data.name);
            
            sessionStorage.setItem('isLoggedIn', 'true'); // Store the value in sessionStorage 
            window.location.href = "loggedIn.html"; // Redirect after success

            // For the login message
            const dotIndex = username.indexOf('.');
            const namePart = username.slice(0, dotIndex);
            const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

            sessionStorage.setItem("name", capitalizedName);

            console.log(sessionStorage.getItem("name"));

        } else {
            const errorData = await response.json();
            alert(errorData.message || "Login failed. Please check your username and password.");
        }
    } catch (error) {
        console.error('Network error:', error);
        alert("An error occurred. Please try again later.");
    }
}


// Hover effect for .hidden elements
const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((element) => {
    const parent = element.parentElement;

    parent.addEventListener("mouseover", () => {
        element.classList.add("visible");
        element.classList.remove("hidden");
    });

    parent.addEventListener("mouseout", () => {
        element.classList.add("hidden");
        element.classList.remove("visible");
    });
});
