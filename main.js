// ===== NAVIGATION =====
function navigate(pageId) {
  // Hide all pages
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  // Show target page
  const target = document.getElementById("page-" + pageId);
  if (target) target.classList.add("active");

  // Update nav active state
  document.querySelectorAll(".nav-links li a").forEach((a) => {
    a.classList.remove("active");
    if (a.dataset.page === pageId) a.classList.add("active");
  });

  // Close mobile nav
  document.getElementById("nav-links-list").classList.remove("open");

  // Scroll to top
  window.scrollTo(0, 0);
}

// Nav links
document.querySelectorAll("[data-page]").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    navigate(this.dataset.page);
  });
});

// Hamburger
document.getElementById("hamburger-btn").addEventListener("click", function () {
  document.getElementById("nav-links-list").classList.toggle("open");
});

// ===== DONATION FLOW =====
let donorType = null;
let selectedAmount = null;
let customAmount = null;

// Step 1: Donor type selection
document.querySelectorAll(".donor-type-card").forEach((card) => {
  card.addEventListener("click", function () {
    document
      .querySelectorAll(".donor-type-card")
      .forEach((c) => c.classList.remove("selected"));
    this.classList.add("selected");
    donorType = this.dataset.type;
    updateCurrencyDisplay();
  });
});

function updateCurrencyDisplay() {
  const isIndian = donorType === "indian";
  const symbol = isIndian ? "INR" : "USD";
  const amounts = isIndian
    ? ["1,000", "2,000", "5,000", "10,000", "25,000", "50,000"]
    : ["10", "25", "50", "100", "250", "500"];

  document.querySelectorAll(".amount-btn").forEach((btn, i) => {
    btn.textContent = symbol + " " + amounts[i];
    btn.dataset.value = amounts[i].replace(",", "");
    btn.classList.remove("selected");
  });

  selectedAmount = null;
  document.getElementById("custom-amount").placeholder = isIndian
    ? "Custom amount in INR"
    : "Custom amount in USD";
  document.getElementById("currency-symbol").textContent = symbol;
}

// Amount buttons
document.querySelectorAll(".amount-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".amount-btn")
      .forEach((b) => b.classList.remove("selected"));
    this.classList.add("selected");
    selectedAmount = this.dataset.value;
    document.getElementById("custom-amount").value = "";
  });
});

document.getElementById("custom-amount").addEventListener("input", function () {
  document
    .querySelectorAll(".amount-btn")
    .forEach((b) => b.classList.remove("selected"));
  selectedAmount = null;
  customAmount = this.value;
});

function getSelectedAmount() {
  const custom = document.getElementById("custom-amount").value;
  return custom || selectedAmount;
}

function getCurrencySymbol() {
  return donorType === "indian" ? "INR" : "USD";
}

// Step 1 → Step 2
document
  .getElementById("btn-step1-next")
  .addEventListener("click", function () {
    const name = document.getElementById("step1-name").value.trim();
    const email = document.getElementById("step1-email").value.trim();
    const amount = getSelectedAmount();

    if (!name) {
      showFieldError("step1-name", "Please enter your name");
      return;
    }
    if (!email || !email.includes("@")) {
      showFieldError("step1-email", "Please enter a valid email");
      return;
    }
    if (!donorType) {
      alert("Please select whether you are an Indian or Foreign donor.");
      return;
    }
    if (!amount) {
      alert("Please select or enter a donation amount.");
      return;
    }

    // Pre-fill step 2
    document.getElementById("billing-name").value = name;
    document.getElementById("billing-email").value = email;

    // Update summary
    const sym = getCurrencySymbol();
    const fmt = parseFloat(amount).toLocaleString("en-IN");
    document.getElementById("summary-amount").textContent = sym + " " + fmt;
    document.getElementById("final-amount-display").textContent =
      sym + " " + fmt;

    // Set country default
    if (donorType === "indian") {
      document.getElementById("billing-country").value = "India";
    }

    goToStep(2);
  });

// Step 2 → Submit
document.getElementById("btn-pay").addEventListener("click", function () {
  const name = document.getElementById("billing-name").value.trim();
  const email = document.getElementById("billing-email").value.trim();
  const phone = document.getElementById("billing-phone").value.trim();
  const addr = document.getElementById("billing-addr1").value.trim();
  const city = document.getElementById("billing-city").value.trim();

  if (!name) {
    showFieldError("billing-name", "Full name is required");
    return;
  }
  if (!email) {
    showFieldError("billing-email", "Email is required");
    return;
  }
  if (!phone) {
    showFieldError("billing-phone", "Contact number is required");
    return;
  }
  if (!addr) {
    showFieldError("billing-addr1", "Address is required");
    return;
  }
  if (!city) {
    showFieldError("billing-city", "City is required");
    return;
  }

  // Show success
  goToStep(3);
});

document
  .getElementById("btn-back-to-step1")
  .addEventListener("click", function () {
    goToStep(1);
  });

document
  .getElementById("btn-donate-again")
  .addEventListener("click", function () {
    // Reset form
    donorType = null;
    selectedAmount = null;
    document
      .querySelectorAll(".donor-type-card")
      .forEach((c) => c.classList.remove("selected"));
    document
      .querySelectorAll(".amount-btn")
      .forEach((b) => b.classList.remove("selected"));
    document.getElementById("step1-name").value = "";
    document.getElementById("step1-email").value = "";
    document.getElementById("custom-amount").value = "";
    document.getElementById("billing-phone").value = "";
    document.getElementById("billing-addr1").value = "";
    document.getElementById("billing-addr2").value = "";
    document.getElementById("billing-city").value = "";
    document.getElementById("billing-state").value = "";
    document.getElementById("billing-zip").value = "";
    document.getElementById("billing-pan").value = "";
    goToStep(1);
  });

function goToStep(n) {
  document
    .querySelectorAll(".donation-step")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("donation-step-" + n).classList.add("active");

  document.querySelectorAll(".step-tab").forEach((tab, i) => {
    tab.classList.remove("active", "done");
    if (i + 1 < n) tab.classList.add("done");
    if (i + 1 === n) tab.classList.add("active");
  });

  window.scrollTo(0, 0);
}

function showFieldError(id, msg) {
  const field = document.getElementById(id);
  field.style.borderColor = "#e53935";
  field.focus();
  setTimeout(() => {
    field.style.borderColor = "";
  }, 2500);
}

// Initialize
navigate("home");
