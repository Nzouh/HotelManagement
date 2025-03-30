// roomsC.js

const apiUrl = "http://localhost:3002/api/available-rooms"; // Fetch from your /available-rooms route

const roomTableBody = document.querySelector("#room-table tbody");
const filterCapacity = document.getElementById("filter-capacity");
const filterView = document.getElementById("filter-view");
const filterHotel = document.getElementById("filter-hotel");
const filterChain = document.getElementById("filter-chain");
const filterCategory = document.getElementById("filter-category");
const filterNumRooms = document.getElementById("filter-num-rooms");
const filterPrice = document.getElementById("filter-price");
const filterStartDate = document.getElementById("filter-start-date");
const filterEndDate = document.getElementById("filter-end-date");
const clearFiltersBtn = document.getElementById("clear-filters");

async function fetchAvailableRooms() {
  const params = new URLSearchParams();

  if (filterCapacity.value) params.append("capacity", filterCapacity.value);
  if (filterView.value) params.append("area", filterView.value); // area = views in this context
  if (filterHotel.value) params.append("hotel_id", filterHotel.value);
  if (filterChain.value) params.append("chain_id", filterChain.value);
  if (filterCategory.value) params.append("category", filterCategory.value);
  if (filterNumRooms.value) params.append("number_rooms", filterNumRooms.value);
  if (filterPrice.value) params.append("price", filterPrice.value);
  if (filterStartDate.value) params.append("start", filterStartDate.value);
  if (filterEndDate.value) params.append("end", filterEndDate.value);

  const res = await fetch(`${apiUrl}?${params.toString()}`);
  const rooms = await res.json();
  renderTable(rooms);
}

function renderTable(rooms) {
  rooms.sort((a, b) => a.hotel_id - b.hotel_id || a.room_number - b.room_number);
  roomTableBody.innerHTML = "";
  rooms.forEach((r) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.room_ID}</td>
      <td>${r.hotel_id}</td>
      <td>${r.room_number}</td>
      <td>${r.capacity}</td>
      <td>${r.views}</td>
      <td>${r.price}</td>
      <td>${r.extendable ? "Yes" : "No"}</td>
      <td>${r.damages || ""}</td>
      <td><button onclick="openBookingModal(${r.room_ID})">Book</button></td>
    `;
    roomTableBody.appendChild(row);
  });
}

[filterCapacity, filterView, filterHotel, filterChain, filterCategory, filterNumRooms, filterPrice, filterStartDate, filterEndDate].forEach(input => {
  input.addEventListener("input", fetchAvailableRooms);
});

clearFiltersBtn.addEventListener("click", () => {
  document.querySelectorAll(".filters input, .filters select").forEach((input) => (input.value = ""));
  fetchAvailableRooms();
});

function openBookingModal(roomId) {
  // Logic to open a modal where user can select start/end date and confirm booking
  alert(`Booking flow for room ${roomId} coming soon...`);
}

fetchAvailableRooms();
