document.addEventListener("DOMContentLoaded", () => {
  const t = (key, fallback) =>
    (window.getI18nString ? window.getI18nString(key) : '') || fallback;

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
      jobResultsContainer.innerHTML = `<p class='no-results'>${t('tp.jobs.errors.fetch', 'Failed to fetch companies.')}</p>`;
    });

  // --- Display companies ---
  function displayCompanies(companies) {
    jobResultsContainer.innerHTML = "";

    if (!companies.length) {
      jobResultsContainer.innerHTML = `<p class='no-results'>${t('tp.jobs.errors.empty', 'No results found.')}</p>`;
      return;
    }

    companies.forEach((company, index) => {
      const hasApplied = Array.isArray(company.applicants) && company.applicants.includes(username);

      const card = document.createElement("div");
      card.classList.add("card");

      const overlayImages = {
        "Korvia": "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('../Images/korvia-bg.jpg')",
        "Aracı Payı": "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('../Images/araci-payi-bg.avif')",
      };

      card.style.setProperty(
        "--overlay-background",
        overlayImages[company.name] || "linear-gradient(90deg,#7a7a7a,#cfcfcf)"
      );

      const descriptionFallback = t('tp.jobs.description_empty', 'No description available.');
      const jobTypeLabel = t('tp.jobs.card.job_type', 'Job Type');
      const experienceLabel = t('tp.jobs.card.experience', 'Experience');
      const viewDetailsLabel = t('tp.jobs.card.view_details', 'View Details');

      card.innerHTML = `
        <div>
          <h4>${company.name}</h4>
          <p class="meta">${company.industry} | ${company.headquarters}</p>
        </div>
        <p>${company.description_short || descriptionFallback}</p>
        <p><strong>${jobTypeLabel}:</strong> ${company.jobtype || "N/A"}</p>
        <p><strong>${experienceLabel}:</strong> ${company.experience || "N/A"}</p>
        <button class="btn" id="details-btn-${index}">${viewDetailsLabel}</button>
      `;
      jobResultsContainer.appendChild(card);

      // --- View Details modal ---
      document.getElementById(`details-btn-${index}`).addEventListener("click", () => {
        const closeLabel = t('tp.jobs.modal.close', 'Close modal');
        const industryLabel = t('tp.jobs.modal.industry', 'Industry');
        const hqLabel = t('tp.jobs.modal.hq', 'Headquarters');
        const websiteLabel = t('tp.jobs.modal.website', 'Website');
        const descriptionLabel = t('tp.jobs.modal.description', 'Description');
        const applyLabel = t('tp.jobs.modal.apply', 'Apply');
        const appliedLabel = t('tp.jobs.modal.applied', 'Applied');

        modalContent.innerHTML = `
          <button class="close-btn-top" aria-label="${closeLabel}">×</button>
          <h4>${company.name}</h4>
          <p><strong>${industryLabel}:</strong> ${company.industry}</p>
          <p><strong>${hqLabel}:</strong> ${company.headquarters}</p>
          <p><strong>${websiteLabel}:</strong> <a href="${company.website}" target="_blank">${company.website}</a></p>
          <p><strong>${jobTypeLabel}:</strong> ${company.jobtype || "N/A"}</p>
          <p><strong>${experienceLabel}:</strong> ${company.experience || "N/A"}</p>
          <p><strong>${descriptionLabel}:</strong> ${company.description_long || company.description_short}</p>
          <div class="modal-buttons">
            <button class="btn apply-btn" id="apply-btn-${index}" ${hasApplied ? 'disabled' : ''}>
              ${hasApplied ? appliedLabel : applyLabel}
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
            alert(t('tp.jobs.apply.missing', 'Missing username or company name.'));
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
              applyBtn.textContent = appliedLabel;
              applyBtn.disabled = true;
              if (!Array.isArray(company.applicants)) company.applicants = [];
              company.applicants.push(username); // update local state
            } else {
              if (data.message.includes("already applied") || data.applicants?.includes(username)) {
                showAlreadyAppliedPopup();
                applyBtn.textContent = appliedLabel;
                applyBtn.disabled = true;
              } else {
                const errorPrefix = t('tp.jobs.apply.error_prefix', 'Error');
                alert(`${errorPrefix}: ${data.message}`);
              }
            }
          } catch (err) {
            console.error("Error applying:", err);
            alert(t('tp.jobs.apply.error_generic', 'An error occurred while applying.'));
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

const faqs = document.querySelectorAll(".faq");

faqs.forEach(faq => {
  const question = faq.querySelector(".question");
  const answer = faq.querySelector(".answer");

  faq.addEventListener("click", () => {
    faqs.forEach(f => {
      if (f !== faq) {
        f.classList.remove("active");
        f.querySelector(".answer").style.maxHeight = null;
      }
    });
    faq.classList.toggle("active");

    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

/*faqs.forEach((faq) => {
  faq.querySelector(".question").addEventListener("click", () => {
    const isActive = faq.classList.contains("active");
    faqs.forEach(f => f.classList.remove("active"));
      if (!isActive) faq.classList.add("active");
    });
  });
*/
