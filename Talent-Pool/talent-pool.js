document.addEventListener("DOMContentLoaded", () => {
  const jobResultsContainer = document.getElementById("job-results");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const searchButton = document.querySelector(".job-filters button.btn.primary");

  const jobTypeSelect = document.getElementById("jobType");
  const experienceSelect = document.getElementById("experienceLevel");
  const locationInput = document.getElementById("location");

  let allCompanies = [];
  const username = sessionStorage.getItem("username");

  // --- Fetch companies ---
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

  // --- Display companies ---
  function displayCompanies(companies) {
    jobResultsContainer.innerHTML = "";

    if (!companies.length) {
      jobResultsContainer.innerHTML = "<p class='no-results'>No results found.</p>";
      return;
    }

    companies.forEach((company, index) => {
      const hasApplied = Array.isArray(company.applicants) && company.applicants.includes(username);

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

      // --- View Details modal ---
      document.getElementById(`details-btn-${index}`).addEventListener("click", () => {
        modalContent.innerHTML = `
          <button class="close-btn-top" aria-label="Close modal">×</button>
          <h4>${company.name}</h4>
          <p><strong>Industry:</strong> ${company.industry}</p>
          <p><strong>Headquarters:</strong> ${company.headquarters}</p>
          <p><strong>Website:</strong> <a href="${company.website}" target="_blank">${company.website}</a></p>
          <p><strong>Job Type:</strong> ${company.jobtype || "N/A"}</p>
          <p><strong>Experience:</strong> ${company.experience || "N/A"}</p>
          <p><strong>Description:</strong> ${company.description_long || company.description_short}</p>
          <div class="modal-buttons">
            <button class="btn apply-btn" id="apply-btn-${index}" ${hasApplied ? 'disabled' : ''}>
              ${hasApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
        `;

        modal.classList.add("active");

        // Close modal
        modalContent.querySelector(".close-btn-top").addEventListener("click", () => {
          modal.classList.remove("active");
        });

        const applyBtn = modalContent.querySelector(".apply-btn");

        applyBtn.addEventListener("click", async () => {
          if (hasApplied || applyBtn.disabled) {
            showAlreadyAppliedPopup();
            return;
          }

          if (!username || !company.name) {
            alert("Missing username or company name.");
            return;
          }

          try {
            const response = await fetch("https://anka-vkrl.onrender.com/api/apply", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, companyName: company.name })
            });

            const data = await response.json();

            if (response.ok) {
              applyBtn.textContent = "Applied";
              applyBtn.disabled = true;
              if (!Array.isArray(company.applicants)) company.applicants = [];
              company.applicants.push(username); // update local state
            } else {
              if (data.message.includes("already applied") || data.applicants?.includes(username)) {
                showAlreadyAppliedPopup();
                applyBtn.textContent = "Applied";
                applyBtn.disabled = true;
              } else {
                alert(`Error: ${data.message}`);
              }
            }
          } catch (err) {
            console.error("Error applying:", err);
            alert("An error occurred while applying.");
          }
        });
      });
    });
  }

  // --- Already Applied Popup ---
  function showAlreadyAppliedPopup() {
    const popup = document.getElementById("already-applied-popup");
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000);
  }

  // --- Filter companies ---
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

  searchButton.addEventListener("click", applyFilters);

  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
});
