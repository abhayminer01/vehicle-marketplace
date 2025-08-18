const currentUser = null;

const guestButtons = document.getElementById("guest-buttons");
const userDropdown = document.getElementById("user-dropdown");
const userMenu = document.getElementById("user-menu");
const usernameSpan = document.getElementById("username");

function toggleUserMenu() {
  userMenu.classList.toggle("hidden");
}

function logout() {
  alert("User logged out");
  userDropdown.classList.add("hidden");
  guestButtons.classList.remove("hidden");
}

function goToDashboard() {
  alert("Navigate to dashboard");
}

document.getElementById("search-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("search-input").value;
  alert("Searching for: " + query);
});

function ensureVehiclesExist() {
  let existing = JSON.parse(localStorage.getItem("vehicles"));
  if (!existing || existing.length === 0) {
    existing = [
      {
        id: Date.now(),
        year: 2020,
        make: "Honda",
        model: "Civic",
        mileage: 45000,
        fuelType: "Petrol",
        transmission: "Automatic",
        condition: "Excellent",
        price: 12000,
        image: "rolls-royce-phantom-v-1.jpg",
        description: "Reliable and fuel-efficient compact car.",
        location: "New York, NY",
        sellerName: "Admin"
      }
    ];
    localStorage.setItem("vehicles", JSON.stringify(existing));
  }
}

function renderVehicleCard(vehicle) {
  return `
    <div onclick="viewVehicleDetails(${vehicle.id})" class="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transform hover:scale-105 duration-200 overflow-hidden">
      <div class="relative h-48 bg-gray-200">
        <img src="${vehicle.image}"  class="w-full h-full object-cover" />
        <div class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
          $${vehicle.price}
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-xl font-semibold">${vehicle.title}</h3>
        <p class="text-sm text-gray-600 mb-2">${vehicle.description}</p>
        <div class="text-sm text-gray-500 flex justify-between">
          <span>${vehicle.location}</span>
          <span>by ${vehicle.owner}</span>
        </div>
      </div>
    </div>`;
}

function viewVehicleDetails(vehicleId) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  if (selectedVehicle) {
    localStorage.setItem("selectedVehicle", JSON.stringify(selectedVehicle));
    window.location.href = "VehicleDetails.html";
  }
}

if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/")) {
  ensureVehiclesExist();

  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("vehicle-grid");
    const resultCount = document.getElementById("result-count");

    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

    if (grid && resultCount) {
      grid.innerHTML = vehicles.map(renderVehicleCard).join("");
      resultCount.textContent = `${vehicles.length} vehicle${vehicles.length !== 1 ? "s" : ""} found`;
    }
  });
}

if (window.location.pathname.includes("admin.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("vehicle-form");
    const list = document.getElementById("vehicle-list");

    function getVehicles() {
      return JSON.parse(localStorage.getItem("vehicles")) || [];
    }

    function saveVehicles(vehicles) {
      localStorage.setItem("vehicles", JSON.stringify(vehicles));
    }

    function renderVehicles() {
      const vehicles = getVehicles();
      list.innerHTML = "";
      vehicles.forEach((v, index) => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow flex justify-between items-start";
        card.innerHTML = `
          <div>
            <h3 class="text-lg font-semibold">${v.title || 'Untitled Vehicle'}</h3>
            <p><strong>Owner:</strong> ${v.owner}</p>
            <p><strong>Price:</strong> ${v.price}</p>
            <p><strong>Fuel:</strong> ${v.fuel || v.fuelType}</p>
            <p><strong>Location:</strong> ${v.location}</p>
            <p><strong>Description:</strong> ${v.description}</p>
          </div>
          <div class="space-y-2">
            <button onclick="editVehicle(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
            <button onclick="deleteVehicle(${index})" class="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
          </div>`;
        list.appendChild(card);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const owner = document.getElementById("owner").value;
      const price = document.getElementById("price").value;
      const fuel = document.getElementById("fuel").value;
      const speed = document.getElementById("speed").value;
      const location = document.getElementById("location").value;
      const description = document.getElementById("description").value;
      const imageInput = document.getElementById("image");
      const imageFile = imageInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        const newVehicle = {
          id: Date.now(),
          title,
          owner,
          price,
          fuel,
          speed,
          location,
          description,
          image: imageData,
          sellerName: "Admin"
        };

        const vehicles = getVehicles();
        vehicles.push(newVehicle);
        saveVehicles(vehicles);
        form.reset();
        renderVehicles();
      };

      if (imageFile) {
        reader.readAsDataURL(imageFile);
      } else {
        alert("Please upload an image");
      }
    });

    window.editVehicle = function (index) {
      const vehicles = getVehicles();
      const v = vehicles[index];
      document.getElementById("title").value = v.title;
      document.getElementById("price").value = v.price;
      document.getElementById("fuel").value = v.fuel;
      document.getElementById("speed").value = v.speed;
      document.getElementById("location").value = v.location;
      document.getElementById("description").value = v.description;

      vehicles.splice(index, 1);
      saveVehicles(vehicles);
      renderVehicles();
    };

    window.deleteVehicle = function (index) {
      const vehicles = getVehicles();
      vehicles.splice(index, 1);
      saveVehicles(vehicles);
      renderVehicles();
    };

    renderVehicles();
  });
}
