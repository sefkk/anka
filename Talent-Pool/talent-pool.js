document.addEventListener("DOMContentLoaded", () => {
  const jobResultsContainer = document.getElementById("job-results");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const searchButton = document.querySelector(".job-filters button.btn.primary");

  const jobTypeSelect = document.getElementById("jobType");
  const experienceSelect = document.getElementById("experienceLevel");
  const locationInput = document.getElementById("location");

  let allCompanies = [];

  // --- Şirket verilerini API'den çek ---
  fetch("https://anka-vkrl.onrender.com/api/companies")
    .then(res => res.json())
    .then(companies => {
      allCompanies = companies;
      displayCompanies(allCompanies);
    })
    .catch(err => {
      console.error(err);
      jobResultsContainer.innerHTML = "<p class='no-results'>Failed to fetch companies.</p>";
    });

  // --- Şirketleri ekrana bas ---
  function displayCompanies(companies) {
    jobResultsContainer.innerHTML = "";

    if (!companies.length) {
      jobResultsContainer.innerHTML = "<p class='no-results'>No results found.</p>";
      return;
    }

    companies.forEach((company, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div>
          <img src="${company.logo_url || 'https://via.placeholder.com/80'}" alt="${company.name} Logo">
          <h4>${company.name}</h4>
          <p class="meta">${company.industry} | ${company.headquarters}</p>
        </div>
        <p>${company.description_short || "No description available."}</p>
        <p><strong>Job Type:</strong> ${company.jobtype || "N/A"}</p>
        <p><strong>Experience:</strong> ${company.experience || "N/A"}</p>
        <button class="btn" id="details-btn-${index}">View Details</button>
      `;
      jobResultsContainer.appendChild(card);

      document.getElementById(`details-btn-${index}`).addEventListener("click", () => {
        modalContent.innerHTML = `
          <h4>${company.name}</h4>
          <p><strong>Industry:</strong> ${company.industry}</p>
          <p><strong>Headquarters:</strong> ${company.headquarters}</p>
          <p><strong>Description:</strong> ${company.description_long || company.description_short || "No detailed description."}</p>
          <p><strong>Website:</strong> <a href="${company.website}" target="_blank">${company.website}</a></p>
          <p><strong>Job Type:</strong> ${company.jobtype}</p>
          <p><strong>Experience Level:</strong> ${company.experience}</p>
          <div class="modal-buttons">
            <a href="${company.apply_url || '#'}" target="_blank" class="btn apply-btn">Apply</a>
            <button class="close-btn">Close</button>
          </div>
        `;
        modal.classList.add("active");
        modalContent.querySelector(".close-btn").addEventListener("click", () => {
          modal.classList.remove("active");
        });
      });
    });
  }

  // --- Filtreleme fonksiyonu ---
  function applyFilters() {
    const jobType = jobTypeSelect.value.toLowerCase();
    const experience = experienceSelect.value.toLowerCase();
    const location = locationInput.value.toLowerCase();

    const filtered = allCompanies.filter(company => {
      const matchJobType = jobType ? (company.jobtype?.toLowerCase() === jobType) : true;
      const matchExperience = experience ? (company.experience?.toLowerCase() === experience) : true;
      const matchLocation = location ? (company.headquarters?.toLowerCase().includes(location)) : true;
      return matchJobType && matchExperience && matchLocation;
    });

    displayCompanies(filtered);
  }

  // --- Arama butonu tıklanınca filtre uygula ---
  searchButton.addEventListener("click", applyFilters);
  // --- Enter tuşuna basılınca filtre uygula ---
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // form submit gibi davranmasın
      applyFilters();
    }
  });

  // Modal dışına tıklanınca kapat
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
});
