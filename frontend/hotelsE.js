const apiUrl = "http://localhost:3002/api/hotels";

const hotelTableBody = document.querySelector("#hotel-table tbody");
const addHotelBtn = document.getElementById("add-hotel-btn");
const hotelModal = document.getElementById("hotel-modal");
const hotelForm = document.getElementById("hotel-form");
const modalTitle = document.getElementById("modal-title");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search-hotel");

let isEditing = false;
let editingHotelId = null;

async function fetchHotels() {
  const res = await fetch(apiUrl);
  const hotels = await res.json();
  renderTable(hotels);
}

function renderTable(hotels) {
  hotelTableBody.innerHTML = "";
  hotels.forEach((h) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${h.hotel_id}</td>
      <td>${h.chain_id}</td>
      <td>${h.h_address}</td>
      <td>${h.h_email}</td>
      <td>${h.number_rooms}</td>
      <td>${h.rating}</td>
      <td><button class="delete-btn" data-id="${h.hotel_id}">Delete</button></td>
    `;
    row.addEventListener("click", (event) => {
      if (!event.target.classList.contains("delete-btn")) {
        openEditModal(h);
      }
    });
    hotelTableBody.appendChild(row);
  });
}

addHotelBtn.addEventListener("click", () => {
  isEditing = false;
  editingHotelId = null;
  modalTitle.textContent = "Add Hotel";
  hotelForm.reset();
  hotelModal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  hotelModal.classList.add("hidden");
});

hotelForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(hotelForm);
  const hotelData = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(
      isEditing ? `${apiUrl}/${editingHotelId}` : apiUrl,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData),
      }
    );
    if (!res.ok) {
      const errorData = await res.json(); // Get the error message from server
      alert(errorData.error || "Failed to save Hotel");
      throw new Error(errorData.error || "Failed to save Hotel");
    }
        hotelModal.classList.add("hidden");
    await fetchHotels();
  } catch (err) {
    alert("Error saving hotel.");
    console.error(err);
  }
});

hotelTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    if (confirm("Delete this hotel?")) {
      try {
        const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        await fetchHotels();
      } catch (err) {
        alert("Error deleting hotel.");
      }
    }
  }
});

function openEditModal(hotel) {
  isEditing = true;
  editingHotelId = hotel.hotel_id;
  modalTitle.textContent = "Edit Hotel";
  document.getElementById("hotel_id").value = hotel.hotel_id;
  document.getElementById("chain_id").value = hotel.chain_id;
  document.getElementById("h_address").value = hotel.h_address;
  document.getElementById("h_email").value = hotel.h_email;
  document.getElementById("number_rooms").value = hotel.number_rooms;
  document.getElementById("rating").value = hotel.rating;
  hotelModal.classList.remove("hidden");
}

searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const res = await fetch(apiUrl);
  const hotels = await res.json();
  const filtered = hotels.filter(
    (h) =>
      h.h_address.toLowerCase().includes(searchTerm) ||
      h.h_email.toLowerCase().includes(searchTerm)
  );
  renderTable(filtered);
});

fetchHotels();
