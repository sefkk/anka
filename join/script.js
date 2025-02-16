document.addEventListener("DOMContentLoaded", function () {
    const ctaButtons = document.querySelectorAll(".cta-button");

    function checkScroll() {
        ctaButtons.forEach(button => {
            const rect = button.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                button.classList.add("visible");
                button.classList.remove("hidden");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);

    // Sayfa yüklendiğinde de kontrol et
    checkScroll();
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    dropdown.addEventListener("click", function (event) {
        event.stopPropagation(); // Başka tıklamaların etkisini engeller
        dropdownMenu.classList.toggle("visible");
    });

    document.addEventListener("click", function () {
        dropdownMenu.classList.remove("visible");
    });
});


/* CSS ile animasyon */
document.head.insertAdjacentHTML("beforeend", `
<style>
    .cta-button.visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
</style>
`);



document.addEventListener("DOMContentLoaded", function () {
    const contactLink = document.querySelector('a[href="#footer"]');

    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Sayfanın aniden atlamasını önler
        document.querySelector("#footer").scrollIntoView({ 
            behavior: "smooth" // Yumuşak kaydırma efekti
        });
    });
});



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
    }
});




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
    }
});
