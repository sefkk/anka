// ---------- Company Cards & Modal ----------
const jobResultsContainer = document.getElementById("job-results");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

// Clear previous results
jobResultsContainer.innerHTML = "";

// ---------- Fetch company data from backend ----------
fetch("https://anka-vkrl.onrender.com/api/companies")
  .then(res => res.json())
  .then(companies => {
    companies.forEach((company, index) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div>
          <img src="${company.logo_url || 'https://via.placeholder.com/80'}" alt="${company.name} Logo">
          <h4>${company.name}</h4>
          <p class="meta">${company.industry} | ${company.headquarters}</p>
        </div>
        <p>${company.description_short}</p>
        <button class="btn" id="details-btn-${index}">View Details</button>
      `;

      jobResultsContainer.appendChild(card);

      // Details button
      document.getElementById(`details-btn-${index}`).addEventListener("click", () => {
        modalContent.innerHTML = `
          <h4>${company.name}</h4>
          <p><strong>Industry:</strong> ${company.industry}</p>
          <p><strong>Headquarters:</strong> ${company.headquarters}</p>
          <p><strong>Description:</strong> ${company.description_long}</p>
          <p><strong>Website:</strong> <a href="${company.website}" target="_blank">${company.website}</a></p>
          <div class="modal-buttons">
            <a href="${company.apply_url}" target="_blank" class="btn apply-btn">Apply</a>
            <button class="close-btn">Close</button>
          </div>
        `;
        modal.classList.add("active");

        // Close button
        modalContent.querySelector(".close-btn").addEventListener("click", () => {
          modal.classList.remove("active");
        });
      });
    });
  })
  .catch(err => {
    jobResultsContainer.innerHTML = "<p class='no-results'>Failed to fetch companies.</p>";
    console.error(err);
  });

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

// ---------- Logged in check ----------
const isLoggedIn = sessionStorage.getItem('isLoggedIn');

if (isLoggedIn !== 'true') {
    window.location.href = '../login.html';
} else {
    const userName = sessionStorage.getItem('name');
    const welcomeElement = document.getElementById('welcomeMessage');

    if (userName) {
        welcomeElement.textContent = `Welcome ${userName}!`;
    } else {
        welcomeElement.textContent = "Welcome member!";
    }
}

// ---------- Navbar & Footer ----------
fetch('Partials/navbar.html')
  .then(res => res.text())
  .then(data => { document.getElementById('navbar').innerHTML = data; });

fetch('Partials/footer.html')
  .then(res => res.text())
  .then(data => { document.getElementById('footer').innerHTML = data; });
