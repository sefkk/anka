// login.js

document.getElementById('loginBtn').addEventListener('click', onSubmit);
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    onSubmit(event);
  }
});

async function onSubmit(event) {
  if (event) event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert("Please fill in both username and password.");
    return;
  }

  const credentials = { username, password };

  try {
    const response = await fetch('https://anka-vkrl.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Login failed. Please check your username and password.");
      return;
    }

    // ✅ Yanıtı al
    const data = await response.json();
    console.log("Login response:", data);

    // Backend yanıtında kullanıcı nesnesi varsa onu al
    // Örneğin { user: { username: "alice.smith", name: "Alice" } }
    const user = data.user || data;

    // Session storage’a kullanıcı bilgilerini kaydet
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("username", user.username || username);
    sessionStorage.setItem("name", user.name || username.split(".")[0]); // fallback olarak username'den isim çıkar

    console.log("Stored username:", sessionStorage.getItem("username"));
    console.log("Stored name:", sessionStorage.getItem("name"));

    // Başarılı girişte yönlendir
    window.location.href = "loggedIn.html";

  } catch (error) {
    console.error("Network error:", error);
    alert("An error occurred. Please try again later.");
  }
}

// Hover efekti (opsiyonel)
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
