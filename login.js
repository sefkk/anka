document.querySelector('.btn').addEventListener('click', onSubmit);

async function onSubmit(event) {
    event.preventDefault();

    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    const credentials = { username, password };

    try {
        // Send the username and password to your backend login endpoint
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        // Check if the response was successful (HTTP status 200)
        if (response.ok) {
            // Login successful, redirect the user
            window.location.href = "page.html"; // YONLENDIRILECEK LINK
        } else {
            // Login failed, show an error message
            const errorData = await response.json();
            alert(errorData.message || "Login failed. Please check your username and password.");
        }
    } catch (error) {
        // Handle any network errors
        console.error('Network error:', error);
        alert("An error occurred. Please try again later.");
    }
}

// Tüm .hidden sınıfındaki elementleri seçiyoruz
const hiddenElements = document.querySelectorAll(".hidden");

hiddenElements.forEach((element) => {
    const parent = element.parentElement; // Ebeveyn elementi seçiyoruz

    // Fareyle üzerine gelince visible sınıfını ekle
    parent.addEventListener("mouseover", () => {
        element.classList.add("visible");
        element.classList.remove("hidden");
    });

    // Fare ayrılınca tekrar hidden sınıfına dön
    parent.addEventListener("mouseout", () => {
        element.classList.add("hidden");
        element.classList.remove("visible");
    });
});
