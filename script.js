

document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".news-track");
    const newsItems = document.querySelectorAll(".news-item");
    const dotsContainer = document.querySelector(".news-dots");
    const prevButton = document.querySelector(".news-prev");
    const nextButton = document.querySelector(".news-next");
    let index = 0;

    // Her bir haberin genişliğini hesapla
    let newsWidth = newsItems[0].offsetWidth; // Genişliği tam olarak hesapla

    // Noktaları Dinamik Olarak Oluştur
    for (let i = 0; i < newsItems.length - 2; i++) {
        const dot = document.createElement("div");
        dot.classList.add("news-dot");
        if (i === 0) dot.classList.add("active");
        dot.setAttribute("data-index", i);
        dotsContainer.appendChild(dot);
    }

    function updateSlider() {
        track.style.transform = `translateX(-${index * newsWidth}px)`;

        // Noktaları Güncelle
        document.querySelectorAll(".news-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    function nextNews() {
        if (index < newsItems.length - 3) {
            index++;
        } else {
            index = 0;
        }
        updateSlider();
    }

    function prevNews() {
        if (index > 0) {
            index--;
        } else {
            index = newsItems.length - 3;
        }
        updateSlider();
    }

    // Ok Butonlarına Event Listener Ekle
    prevButton.addEventListener("click", prevNews);
    nextButton.addEventListener("click", nextNews);

    // // Otomatik Kaydırma
    // setInterval(nextNews, 5000);

    // Noktalar Tıklandığında Slider Güncelle
    document.querySelectorAll(".news-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
            index = parseInt(dot.getAttribute("data-index"));
            updateSlider();
        });
    });

    updateSlider();
});




document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".partners-track");
    const slides = Array.from(track.children);
    
    // Slider genişliğini dolduracak kadar klon ekleyelim
    let cloneCount = Math.ceil(window.innerWidth / track.offsetWidth) + 2;
    for (let i = 0; i < cloneCount; i++) {
        slides.forEach(slide => {
            let clone = slide.cloneNode(true);
            track.appendChild(clone);
        });
    }

    let speed = 0.8; // Kayma hızı (daha yumuşak ve sürekli akış için)
    let position = 0; // Başlangıç konumu

    function moveSlider() {
        position -= speed; // Soldan sağa kaydır
        track.style.transform = `translateX(${position}px)`;

        // Eğer ilk orijinal logoların tamamı geçtiyse, en başa sar
        if (Math.abs(position) >= track.scrollWidth / 2) {
            position = 0;
        }

        requestAnimationFrame(moveSlider);
    }

    moveSlider(); // Animasyonu başlat
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

document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper(".haberler-slider", {
        slidesPerView: window.innerWidth < 768 ? 1 : 3, // Mobilde 1, masaüstünde 3 içerik
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    window.addEventListener("resize", function () {
        swiper.params.slidesPerView = window.innerWidth < 768 ? 1 : 3;
        swiper.update();
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".haberler-slider");
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.querySelector(".swiper-button-prev");
    const nextButton = document.querySelector(".swiper-button-next");

    let index = 0;
    let slideWidth = slides[0].offsetWidth; // Kart genişliğini al

    function updateSlider() {
        slider.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    nextButton.addEventListener("click", function () {
        if (index < slides.length - (window.innerWidth < 768 ? 1 : 3)) {
            index++;
        } else {
            index = 0; // Son slide'a gelince başa dön
        }
        updateSlider();
    });

    prevButton.addEventListener("click", function () {
        if (index > 0) {
            index--;
        } else {
            index = slides.length - (window.innerWidth < 768 ? 1 : 3); // Baştayken sona git
        }
        updateSlider();
    });

    // Ekran boyutu değiştiğinde slide genişliğini güncelle
    window.addEventListener("resize", function () {
        slideWidth = slides[0].offsetWidth;
        updateSlider();
    });

    // Dokunmatik kaydırma desteği
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            nextButton.click(); // Sağa kaydırınca ileri git
        } else if (touchStartX - touchEndX < -50) {
            prevButton.click(); // Sola kaydırınca geri git
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    dropdown.addEventListener("click", function (event) {
        event.stopPropagation(); // Başka tıklamaların etkisini engeller
        dropdownMenu.classList.toggle("visible");

        // Eğer mobildeyse ekranın genişliğini kontrol et
        if (window.innerWidth < 768) {
            dropdownMenu.style.width = "90%"; // Mobilde genişliği artır
            dropdownMenu.style.maxHeight = "250px"; // Maksimum yükseklik ayarla
        }
    });

    document.addEventListener("click", function () {
        dropdownMenu.classList.remove("visible");
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
