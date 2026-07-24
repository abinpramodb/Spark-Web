/**
 * DriveElite - Luxury Vehicle Rental Website Template Script
 * Standard client-side ES6 JavaScript for dynamic page interactions, booking flows and LocalStorage persistence.
 */

// ─── Data Definitions ────────────────────────────────────────────────────────

const VEHICLES = [
  {
    id: "bmw-m5",
    name: "BMW M5 Competition",
    brand: "BMW",
    category: "Sport",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 299,
    image: "https://images.unsplash.com/photo-1599912027611-484b9fc447af?w=800&h=500&fit=crop&auto=format",
    available: true,
    rating: 4.9,
    reviews: 142,
    year: 2024,
    mileage: "Unlimited",
    features: ["GPS Navigation", "Heated Seats", "360° Camera", "Harman Kardon Audio", "Head-Up Display"],
    description:
      "The BMW M5 Competition is the pinnacle of performance saloons. With 625hp and M xDrive, it delivers breathtaking acceleration while maintaining everyday usability."
  },
  {
    id: "mercedes-s",
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes-Benz",
    category: "Luxury",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 249,
    image: "https://images.unsplash.com/photo-1681167816895-940c56e0d2a5?w=800&h=500&fit=crop&auto=format",
    available: true,
    rating: 4.8,
    reviews: 98,
    year: 2024,
    mileage: "Unlimited",
    features: ["Rear Entertainment", "Burmester 4D Sound", "MBUX Hyperscreen", "Massage Seats", "Night Vision"],
    description:
      "The Mercedes-Benz S-Class defines automotive luxury. Its cabin is a sanctuary of the finest materials and most advanced technology available."
  },
  {
    id: "porsche-911",
    name: "Porsche 911 Carrera S",
    brand: "Porsche",
    category: "Sport",
    seats: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 399,
    image: "https://images.unsplash.com/photo-1532988633349-d3dfb28ee834?w=800&h=500&fit=crop&auto=format",
    available: true,
    rating: 5.0,
    reviews: 67,
    year: 2024,
    mileage: "Unlimited",
    features: ["Sport Chrono Package", "PASM", "PDK Gearbox", "Bose Sound", "Sport Seats Plus"],
    description:
      "Sixty years of refinement distilled into one icon. The 911 Carrera S delivers 450hp and razor-sharp handling that makes every road feel like a racing circuit."
  },
  {
    id: "audi-rs7",
    name: "Audi RS7 Sportback",
    brand: "Audi",
    category: "Premium",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 329,
    image: "https://images.unsplash.com/photo-1630165356623-266076eaceb6?w=800&h=500&fit=crop&auto=format",
    available: true,
    rating: 4.7,
    reviews: 89,
    year: 2023,
    mileage: "Unlimited",
    features: ["Virtual Cockpit Plus", "Bang & Olufsen Audio", "Air Suspension", "RS Exhaust", "Quattro AWD"],
    description:
      "The RS7 Sportback combines the aesthetics of a coupé with the practicality of a five-door. Its 600hp twin-turbo V8 makes it devastatingly fast."
  },
  {
    id: "range-rover",
    name: "Range Rover Autobiography",
    brand: "Land Rover",
    category: "SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 279,
    image: "https://images.unsplash.com/photo-1522255272218-7ac5249be344?w=800&h=500&fit=crop&auto=format",
    available: true,
    rating: 4.8,
    reviews: 113,
    year: 2024,
    mileage: "Unlimited",
    features: ["Meridian Sound", "Pivi Pro", "Terrain Response 2", "Four-Zone Climate", "Power Running Boards"],
    description:
      "The Range Rover Autobiography is the definitive luxury SUV. Its commanding presence, supreme off-road capability, and first-class interior are unmatched."
  },
  {
    id: "lambo-huracan",
    name: "Lamborghini Huracán EVO",
    brand: "Lamborghini",
    category: "Luxury",
    seats: 2,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 899,
    image: "https://images.unsplash.com/photo-1659671026913-b7e632f17395?w=800&h=500&fit=crop&auto=format",
    available: false,
    rating: 4.9,
    reviews: 34,
    year: 2023,
    mileage: "300 km/day",
    features: ["LDVI System", "ALA 2.0", "Carbon Ceramic Brakes", "Lamborghini Telemetry", "Lift System"],
    description:
      "The Huracán EVO is a supercar experience with no compromises. Its naturally aspirated V10 screams to 8,500 rpm and propels you to 100 km/h in 2.9 seconds."
  }
];

const LOCATIONS = [
  "London Heathrow Airport",
  "London City Centre",
  "Manchester Airport",
  "Edinburgh City Centre",
  "Birmingham Airport",
  "Bristol City Centre"
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const genId = () => Math.random().toString(36).slice(2, 11).toUpperCase();

const calcDays = (from, to) => {
  const diff = Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
  return diff > 0 ? diff : 1;
};

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const getTodayDateStr = () => new Date().toISOString().split("T")[0];
const getFutureDateStr = (daysAhead) => new Date(Date.now() + 86400000 * daysAhead).toISOString().split("T")[0];

const loadBookings = () => {
  try {
    return JSON.parse(localStorage.getItem("driveelite_bookings") || "[]");
  } catch {
    return [];
  }
};

const saveBookings = (b) => {
  localStorage.setItem("driveelite_bookings", JSON.stringify(b));
};

// ─── Application State ───────────────────────────────────────────────────────

let state = {
  view: "home",
  selectedVehicle: null,
  bookings: loadBookings(),
  filterCat: "All",
  confirmed: null,
  mobileMenu: false,
  form: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupLocation: LOCATIONS[0],
    dropoffLocation: LOCATIONS[0],
    pickupDate: getTodayDateStr(),
    dropoffDate: getFutureDateStr(3)
  },
  hero: {
    pickup: LOCATIONS[0],
    pickupDate: getTodayDateStr(),
    dropoffDate: getFutureDateStr(3)
  }
};

// ─── DOM Elements ────────────────────────────────────────────────────────────

const views = {
  home: document.getElementById("view-home"),
  fleet: document.getElementById("view-fleet"),
  booking: document.getElementById("view-booking"),
  confirmation: document.getElementById("view-confirmation"),
  myBookings: document.getElementById("view-my-bookings")
};

const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

// ─── Rendering Engine ────────────────────────────────────────────────────────

// Stars Component Helper
function getStarsHtml(rating) {
  const rounded = Math.round(rating);
  let html = `<span class="flex gap-px">`;
  for (let s = 1; s <= 5; s++) {
    const isFilled = s <= rounded;
    html += `<i data-lucide="star" class="w-[11px] h-[11px] ${
      isFilled ? "fill-primary text-primary" : "text-muted-foreground"
    }"></i>`;
  }
  html += `</span>`;
  return html;
}

// Badge Component Helper
function getBadgeHtml(text, variant = "gold") {
  const cls = {
    gold: "bg-primary/10 text-primary border-primary/30",
    red: "bg-red-500/10 text-red-400 border-red-500/30",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    muted: "bg-muted text-muted-foreground border-border"
  };
  return `<span class="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${cls[variant]}">
    ${text}
  </span>`;
}

// Render Vehicle Card HTML
function createVehicleCard(v) {
  return `
    <article class="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors flex flex-col">
      <div class="relative h-48 bg-zinc-950 overflow-hidden shrink-0 vehicle-card-img-container">
        <img
          src="${v.image}"
          alt="${v.name}"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute top-3 left-3 flex gap-1.5">
          ${getBadgeHtml(v.category)}
          ${!v.available ? getBadgeHtml("Unavailable", "red") : ""}
        </div>
        <div class="absolute bottom-3 right-3 text-right">
          <span class="text-white text-2xl font-bold font-playfair">
            £${v.pricePerDay}
          </span>
          <span class="text-white/60 text-xs block">per day</span>
        </div>
      </div>

      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-bold text-base mb-1 text-foreground">${v.name}</h3>
        <div class="flex items-center gap-2 mb-4">
          ${getStarsHtml(v.rating)}
          <span class="text-xs text-muted-foreground">
            ${v.rating} (${v.reviews} reviews)
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 mb-5 text-xs text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <i data-lucide="users" class="w-3 h-3 shrink-0"></i>
            ${v.seats} seats
          </span>
          <span class="flex items-center gap-1.5">
            <i data-lucide="settings-2" class="w-3 h-3 shrink-0"></i>
            ${v.transmission}
          </span>
          <span class="flex items-center gap-1.5">
            <i data-lucide="fuel" class="w-3 h-3 shrink-0"></i>
            ${v.fuel}
          </span>
        </div>

        <button
          onclick="handleOpenBooking('${v.id}')"
          ${!v.available ? "disabled" : ""}
          class="mt-auto w-full py-2.5 text-xs font-bold uppercase tracking-widest rounded transition-all disabled:opacity-35 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:opacity-90"
        >
          ${v.available ? "Book Now" : "Currently Unavailable"}
        </button>
      </div>
    </article>
  `;
}

// Render homepage featured fleet (First 3 items)
function renderFeaturedVehicles() {
  const container = document.getElementById("featured-vehicles-grid");
  if (!container) return;
  const featured = VEHICLES.slice(0, 3);
  container.innerHTML = featured.map(createVehicleCard).join("");
  lucide.createIcons();
}

// Render fleet catalog list
function renderFleet() {
  const container = document.getElementById("fleet-grid");
  if (!container) return;

  const filtered = VEHICLES.filter((v) => state.filterCat === "All" || v.category === state.filterCat);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-24 text-center text-muted-foreground text-sm">
        No vehicles found in this category.
      </div>
    `;
  } else {
    container.innerHTML = filtered.map(createVehicleCard).join("");
  }
  
  // Render filters active styles
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    const cat = btn.getAttribute("data-category");
    if (cat === state.filterCat) {
      btn.className = "filter-btn px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-colors bg-primary text-primary-foreground border-primary";
    } else {
      btn.className = "filter-btn px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-colors border-border text-muted-foreground hover:border-primary/50 hover:text-foreground";
    }
  });

  lucide.createIcons();
}

// Render dynamic sidebar and calculations on Booking Form page
function updateBookingDetails() {
  const v = state.selectedVehicle;
  if (!v) return;

  // Render vehicle sidebar preview details
  document.getElementById("booking-sidebar-img").src = v.image;
  document.getElementById("booking-sidebar-name").innerText = v.name;
  document.getElementById("booking-sidebar-rating-text").innerText = v.rating;
  document.getElementById("booking-sidebar-stars").innerHTML = getStarsHtml(v.rating);
  document.getElementById("booking-sidebar-desc").innerText = v.description;
  document.getElementById("booking-sidebar-meta").innerHTML = `
    <span><i data-lucide="calendar" class="w-3 h-3 inline mr-1"></i>${v.year} model</span>
    <span>${v.mileage} mileage</span>
  `;

  // Render features list
  const featuresList = document.getElementById("booking-sidebar-features");
  featuresList.innerHTML = v.features.map(f => `
    <div class="flex items-center gap-2 text-muted-foreground">
      <i data-lucide="check" class="text-primary w-3 h-3 shrink-0"></i>
      ${f}
    </div>
  `).join("");

  // Recalculate duration and prices
  const days = calcDays(state.form.pickupDate, state.form.dropoffDate);
  const total = v.pricePerDay * days;

  document.getElementById("calc-rate").innerText = `£${v.pricePerDay} / day`;
  document.getElementById("calc-duration").innerText = `${days} day${days !== 1 ? "s" : ""}`;
  document.getElementById("calc-total").innerText = `£${total.toLocaleString()}`;
  document.getElementById("submit-booking-btn").innerText = `Confirm Reservation — £${total.toLocaleString()}`;

  lucide.createIcons();
}

// Render dynamic Booking Confirmation page
function renderConfirmation() {
  const b = state.confirmed;
  if (!b) return;

  document.getElementById("conf-vehicle-name").innerText = b.vehicleName;
  document.getElementById("conf-email").innerText = b.email;
  document.getElementById("conf-ref-id").innerText = `#${b.id}`;

  const summaryGrid = document.getElementById("conf-summary-grid");
  const days = b.totalDays;
  
  summaryGrid.innerHTML = `
    <div>
      <div class="text-xs text-muted-foreground mb-0.5">Pick-up</div>
      <div class="font-semibold text-xs leading-relaxed">${fmt(b.pickupDate)}<br><span class="text-muted-foreground font-normal">${b.pickupLocation}</span></div>
    </div>
    <div>
      <div class="text-xs text-muted-foreground mb-0.5">Drop-off</div>
      <div class="font-semibold text-xs leading-relaxed">${fmt(b.dropoffDate)}<br><span class="text-muted-foreground font-normal">${b.dropoffLocation}</span></div>
    </div>
    <div>
      <div class="text-xs text-muted-foreground mb-0.5">Duration</div>
      <div class="font-semibold text-xs leading-relaxed">${days} day${days !== 1 ? "s" : ""}</div>
    </div>
    <div>
      <div class="text-xs text-muted-foreground mb-0.5 font-semibold text-primary">Total Paid</div>
      <div class="font-bold text-primary text-base">£${b.totalPrice.toLocaleString()}</div>
    </div>
  `;
}

// Render dynamic Dashboard (My Bookings)
function renderBookingsList() {
  const container = document.getElementById("my-bookings-list");
  const countBadge = document.getElementById("bookings-count-badge");
  if (!container) return;

  const bookingsList = state.bookings;
  countBadge.innerText = `${bookingsList.length} reservation${bookingsList.length !== 1 ? "s" : ""} on file`;

  if (bookingsList.length === 0) {
    container.innerHTML = `
      <div class="py-24 text-center bg-card border border-border rounded-lg">
        <i data-lucide="car" class="w-9 h-9 text-muted-foreground mx-auto mb-4"></i>
        <h3 class="font-bold text-base mb-2 text-foreground">No bookings yet</h3>
        <p class="text-xs text-muted-foreground">Your reservations will appear here once made.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const statusStyles = {
    confirmed: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30",
    pending: "text-amber-400 bg-amber-400/10 border-amber-500/30",
    cancelled: "text-red-400 bg-red-400/10 border-red-500/30",
    completed: "text-blue-400 bg-blue-400/10 border-blue-500/30"
  };

  container.innerHTML = bookingsList.map((b) => {
    return `
      <article class="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/25 transition-colors">
        <div class="flex flex-col sm:flex-row">
          <div class="sm:w-44 h-36 sm:h-auto bg-zinc-950 shrink-0">
            <img
              src="${b.vehicleImage}"
              alt="${b.vehicleName}"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 p-5 min-w-0">
            <div class="flex items-start justify-between flex-wrap gap-3 mb-3">
              <div>
                <h3 class="font-bold text-base text-foreground font-playfair">${b.vehicleName}</h3>
                <span class="text-xs text-muted-foreground font-mono">#${b.id}</span>
              </div>
              <span class="px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${statusStyles[b.status]}">
                ${b.status}
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3 text-foreground">
              <div>
                <div class="text-muted-foreground mb-0.5">Pick-up</div>
                <div class="font-semibold">${fmt(b.pickupDate)}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-0.5">Drop-off</div>
                <div class="font-semibold">${fmt(b.dropoffDate)}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-0.5">Duration</div>
                <div class="font-semibold">${b.totalDays} days</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-0.5">Total</div>
                <div class="font-bold text-primary text-sm">£${b.totalPrice.toLocaleString()}</div>
              </div>
            </div>
            <p class="text-xs text-muted-foreground truncate">
              ${b.pickupLocation} &rarr; ${b.dropoffLocation}
            </p>
          </div>
          ${
            b.status === "confirmed"
              ? `
              <div class="sm:w-28 border-t sm:border-t-0 sm:border-l border-border flex items-center justify-center p-4">
                <button
                  onclick="handleCancelBooking('${b.id}')"
                  class="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            `
              : ""
          }
        </div>
      </article>
    `;
  }).join("");

  lucide.createIcons();
}

// ─── Routing & View Changes ──────────────────────────────────────────────────

function go(viewName) {
  state.view = viewName;

  // Toggle visible sections
  Object.keys(views).forEach((v) => {
    if (v === viewName || (viewName === "myBookings" && v === "myBookings")) {
      views[v].classList.remove("hidden");
    } else {
      views[v].classList.add("hidden");
    }
  });

  // Highlight active nav links
  const targetView = (viewName === "myBookings") ? "my-bookings" : viewName;
  navLinks.forEach((link) => {
    const val = link.getAttribute("data-view");
    if (val === targetView) {
      link.classList.add("text-primary");
      link.classList.remove("text-muted-foreground", "hover:text-foreground");
    } else {
      link.classList.remove("text-primary");
      link.classList.add("text-muted-foreground", "hover:text-foreground");
    }
  });

  // Highlight mobile nav links
  mobileNavLinks.forEach((link) => {
    const val = link.getAttribute("data-view");
    if (val === targetView) {
      link.classList.add("bg-muted", "text-primary");
    } else {
      link.classList.remove("bg-muted", "text-primary");
    }
  });

  // Action view renders
  if (viewName === "home") {
    renderFeaturedVehicles();
  } else if (viewName === "fleet") {
    renderFleet();
  } else if (viewName === "booking") {
    updateBookingDetails();
  } else if (viewName === "confirmation") {
    renderConfirmation();
  } else if (viewName === "myBookings") {
    renderBookingsList();
  }

  // Close mobile menu
  closeMobileMenu();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mobile Menu helpers
function toggleMobileMenu() {
  state.mobileMenu = !state.mobileMenu;
  if (state.mobileMenu) {
    mobileMenu.classList.remove("hidden");
    mobileMenuBtn.innerHTML = `<i data-lucide="x" class="w-5 h-5"></i>`;
  } else {
    mobileMenu.classList.add("hidden");
    mobileMenuBtn.innerHTML = `<i data-lucide="menu" class="w-5 h-5"></i>`;
  }
  lucide.createIcons();
}

function closeMobileMenu() {
  state.mobileMenu = false;
  if (mobileMenu) mobileMenu.classList.add("hidden");
  if (mobileMenuBtn) {
    mobileMenuBtn.innerHTML = `<i data-lucide="menu" class="w-5 h-5"></i>`;
    lucide.createIcons();
  }
}

// ─── Handlers & Event Listeners ──────────────────────────────────────────────

// Open booking view for specific car
window.handleOpenBooking = (vehicleId) => {
  const vehicle = VEHICLES.find((v) => v.id === vehicleId);
  if (!vehicle) return;

  state.selectedVehicle = vehicle;
  
  // Set default form values matching the selected locations & dates from hero if user searched
  state.form.pickupLocation = state.hero.pickup;
  state.form.pickupDate = state.hero.pickupDate;
  state.form.dropoffDate = state.hero.dropoffDate;

  // Sync state values with form inputs
  document.getElementById("form-firstname").value = state.form.firstName;
  document.getElementById("form-lastname").value = state.form.lastName;
  document.getElementById("form-email").value = state.form.email;
  document.getElementById("form-phone").value = state.form.phone;
  document.getElementById("form-pickup-loc").value = state.form.pickupLocation;
  document.getElementById("form-dropoff-loc").value = state.form.dropoffLocation;
  document.getElementById("form-pickup-date").value = state.form.pickupDate;
  document.getElementById("form-dropoff-date").value = state.form.dropoffDate;
  
  // Configure dates min attribute
  document.getElementById("form-pickup-date").min = getTodayDateStr();
  document.getElementById("form-dropoff-date").min = state.form.pickupDate;

  go("booking");
};

// Cancel dynamic booking from My Bookings Dashboard
window.handleCancelBooking = (bookingId) => {
  const confirmed = confirm("Are you sure you want to cancel this reservation?");
  if (!confirmed) return;
  
  state.bookings = state.bookings.map((b) =>
    b.id === bookingId ? { ...b, status: "cancelled" } : b
  );
  saveBookings(state.bookings);
  renderBookingsList();
};

// Set dynamic categories on Fleet catalog page
window.handleSetFilter = (cat) => {
  state.filterCat = cat;
  renderFleet();
};

// Search trigger from Home Page Widget
function handleHeroSearch() {
  // Sync search settings to state
  state.hero.pickup = document.getElementById("hero-pickup-loc").value;
  state.hero.pickupDate = document.getElementById("hero-pickup-date").value;
  state.hero.dropoffDate = document.getElementById("hero-dropoff-date").value;

  // Automatically pass these to form details in case user books immediately
  state.form.pickupLocation = state.hero.pickup;
  state.form.pickupDate = state.hero.pickupDate;
  state.form.dropoffDate = state.hero.dropoffDate;

  // Navigate to fleet page
  go("fleet");
}

// ─── Setup Event Listeners ───────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Init view rendering
  renderFeaturedVehicles();
  lucide.createIcons();

  // Navigation click listeners
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const v = link.getAttribute("data-view");
      if (v === "home") go("home");
      else if (v === "fleet") go("fleet");
      else if (v === "my-bookings") go("myBookings");
    });
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const v = link.getAttribute("data-view");
      if (v === "home") go("home");
      else if (v === "fleet") go("fleet");
      else if (v === "my-bookings") go("myBookings");
    });
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  // Hero Search Widget actions
  const heroSearchBtn = document.getElementById("hero-search-btn");
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", handleHeroSearch);
  }

  // Date constraints configuration for search widget on index load
  const heroPickupDate = document.getElementById("hero-pickup-date");
  const heroDropoffDate = document.getElementById("hero-dropoff-date");
  
  if (heroPickupDate && heroDropoffDate) {
    heroPickupDate.min = getTodayDateStr();
    heroPickupDate.value = state.hero.pickupDate;
    
    heroDropoffDate.min = state.hero.pickupDate;
    heroDropoffDate.value = state.hero.dropoffDate;

    heroPickupDate.addEventListener("change", (e) => {
      state.hero.pickupDate = e.target.value;
      heroDropoffDate.min = e.target.value;
      if (heroDropoffDate.value < e.target.value) {
        heroDropoffDate.value = e.target.value;
        state.hero.dropoffDate = e.target.value;
      }
    });

    heroDropoffDate.addEventListener("change", (e) => {
      state.hero.dropoffDate = e.target.value;
    });
  }

  // Booking Form event bindings
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const v = state.selectedVehicle;
      if (!v) return;

      // Extract form input values
      state.form.firstName = document.getElementById("form-firstname").value;
      state.form.lastName = document.getElementById("form-lastname").value;
      state.form.email = document.getElementById("form-email").value;
      state.form.phone = document.getElementById("form-phone").value;
      state.form.pickupLocation = document.getElementById("form-pickup-loc").value;
      state.form.dropoffLocation = document.getElementById("form-dropoff-loc").value;
      state.form.pickupDate = document.getElementById("form-pickup-date").value;
      state.form.dropoffDate = document.getElementById("form-dropoff-date").value;

      const days = calcDays(state.form.pickupDate, state.form.dropoffDate);
      
      const newBooking = {
        id: genId(),
        vehicleId: v.id,
        vehicleName: v.name,
        vehicleImage: v.image,
        firstName: state.form.firstName,
        lastName: state.form.lastName,
        email: state.form.email,
        phone: state.form.phone,
        pickupLocation: state.form.pickupLocation,
        dropoffLocation: state.form.dropoffLocation,
        pickupDate: state.form.pickupDate,
        dropoffDate: state.form.dropoffDate,
        totalDays: days,
        totalPrice: v.pricePerDay * days,
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      state.bookings = [newBooking, ...state.bookings];
      saveBookings(state.bookings);
      state.confirmed = newBooking;

      // Clear personal details after success
      state.form.firstName = "";
      state.form.lastName = "";
      state.form.email = "";
      state.form.phone = "";

      go("confirmation");
    });
  }

  // Booking form dynamic pricing recalculations on date updates
  const formPickupDate = document.getElementById("form-pickup-date");
  const formDropoffDate = document.getElementById("form-dropoff-date");

  if (formPickupDate && formDropoffDate) {
    formPickupDate.addEventListener("change", (e) => {
      state.form.pickupDate = e.target.value;
      formDropoffDate.min = e.target.value;
      if (formDropoffDate.value < e.target.value) {
        formDropoffDate.value = e.target.value;
        state.form.dropoffDate = e.target.value;
      }
      updateBookingDetails();
    });

    formDropoffDate.addEventListener("change", (e) => {
      state.form.dropoffDate = e.target.value;
      updateBookingDetails();
    });
  }
});
