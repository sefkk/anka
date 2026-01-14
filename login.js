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
    console.log("isAdmin from backend:", data.isAdmin, "Type:", typeof data.isAdmin);

    // Backend yanıtında kullanıcı nesnesi varsa onu al
    // Örneğin { user: { username: "alice.smith", name: "Alice" } }
    const user = data.user || data;

    // Session storage'a kullanıcı bilgilerini kaydet
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("username", user.username || username);
    sessionStorage.setItem("name", user.name || username.split(".")[0]); // fallback olarak username'den isim çıkar
    
    // isAdmin değerini doğru şekilde kaydet
    const isAdminValue = data.isAdmin === true ? 'true' : 'false';
    sessionStorage.setItem("isAdmin", isAdminValue);
    
    // isMaster değerini doğru şekilde kaydet
    const isMasterValue = data.isMaster === true ? 'true' : 'false';
    sessionStorage.setItem("isMaster", isMasterValue);
  
    const permissionKeys = [
      'canTalentPool',
      'canStartups',
      'canNews',
      'canLegacy',
      'canUsers',
      'canLogs'
    ];
    permissionKeys.forEach((key) => {
      const value = data[key] === true ? 'true' : 'false';
      sessionStorage.setItem(key, value);
    });

    console.log("Stored username:", sessionStorage.getItem("username"));
    console.log("Stored name:", sessionStorage.getItem("name"));
    console.log("Stored isAdmin:", sessionStorage.getItem("isAdmin"));
    console.log("Stored isMaster:", sessionStorage.getItem("isMaster"));
    console.log("Stored permissions:", permissionKeys.reduce((acc, key) => {
      acc[key] = sessionStorage.getItem(key);
      return acc;
    }, {}));
    console.log("isAdmin check:", sessionStorage.getItem("isAdmin") === 'true');
    console.log("isMaster check:", sessionStorage.getItem("isMaster") === 'true');

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
