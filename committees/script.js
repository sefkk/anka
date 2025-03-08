function toggleMenu() {
    document.body.classList.toggle("menu-active");
    document.querySelector(".menu-overlay").classList.toggle("active");

    // Hamburger menüyü animasyonlu hale getirmek için
    document.querySelectorAll(".hamburger div").forEach((bar, index) => {
        bar.style.transform = document.body.classList.contains("menu-active")
            ? `rotate(${index === 0 ? 45 : index === 2 ? -45 : 0}deg) translateY(${index === 1 ? -10 : 0}px)`
            : "none";
    });
}

// Sayfa dışına tıklanınca menüyü kapat
document.addEventListener("click", function (event) {
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuToggle = document.querySelector(".menu-toggle");
    if (!menuToggle.contains(event.target) && menuOverlay.classList.contains("active")) {
        document.body.classList.remove("menu-active");
        menuOverlay.classList.remove("active");

        // Menü ikonu eski haline döndürüyor
        document.querySelectorAll(".hamburger div").forEach((bar, index) => {
            bar.style.transform = document.body.classList.contains("menu")
                ? `rotate(${index === 0 ? -45 : index === 2 ? 45 : 0}deg) translateY(${index === 1 ? 10 : 0}px)`
                : "none";
        });
    }
});




document.addEventListener("DOMContentLoaded", function () {
    const contactLink = document.querySelector('a[href="#footer"]');

    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Sayfanın aniden atlamasını önler
        document.querySelector("#footer").scrollIntoView({ 
            behavior: "smooth" // Yumuşak kaydırma efekti
        });
    });
});