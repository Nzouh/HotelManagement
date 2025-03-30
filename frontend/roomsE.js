// roomsE.js

const apiUrl = "http://localhost:3002/api/rooms";
const hotelCapacityUrl = "http://localhost:3002/api/hotel-capacity";
const roomsPerAreaUrl = "http://localhost:3002/api/available-rooms-per-area";

const roomTableBody = document.querySelector("#room-table tbody");
const addRoomBtn = document.getElementById("add-room-btn");
const roomModal = document.getElementById("room-modal");
const roomForm = document.getElementById("room-form");
const modalTitle = document.getElementById("modal-title");
const cancelBtn = document.getElementById("cancel-btn");

const filterStart = document.getElementById("filter-start");
const filterEnd = document.getElementById("filter-end");
const filterCapacity = document.getElementById("filter-capacity");
const filterView = document.getElementById("filter-view");
const filterHotel = document.getElementById("filter-hotel");
const filterPrice = document.getElementById("filter-price");
const clearFiltersBtn = document.getElementById("clear-filters");
const summaryContainer = document.getElementById("summary-container");

let isEditing = false;
let editingRoomId = null;

async function fetchRooms() {
  const res = await fetch(apiUrl);
  const rooms = await res.json();

  const filteredRooms = rooms.filter((room) => {
    const capacityMatch = !filterCapacity.value || room.capacity === filterCapacity.value;
    const viewMatch = !filterView.value || room.views === filterView.value;
    const hotelMatch = !filterHotel.value || room.hotel_id == filterHotel.value;
    const priceMatch = !filterPrice.value || room.price <= parseFloat(filterPrice.value);
    return capacityMatch && viewMatch && hotelMatch && priceMatch;
  });

  filteredRooms.sort((a, b) => a.hotel_id - b.hotel_id || a.room_number - b.room_number);
  renderTable(filteredRooms);
}

function renderTable(rooms) {
  roomTableBody.innerHTML = "";
  rooms.forEach((r) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.room_id}</td>
      <td>${r.hotel_id}</td>
      <td>${r.room_number}</td>
      <td>${r.capacity}</td>
      <td>${r.views}</td>
      <td>${r.price}</td>
      <td>${r.extendable ? "Yes" : "No"}</td>
      <td>${r.damages || ""}</td>
      <td><button class="delete-btn" data-id="${r.room_id}">Delete</button></td>
    `;
    row.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-btn")) {
        openEditModal(r);
      }
    });
    roomTableBody.appendChild(row);
  });
}

addRoomBtn.addEventListener("click", () => {
  isEditing = false;
  editingRoomId = null;
  modalTitle.textContent = "Add Room";
  roomForm.reset();
  roomModal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  roomModal.classList.add("hidden");
});

roomForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(roomForm);
  const roomData = Object.fromEntries(formData.entries());
  roomData.extendable = document.getElementById("extendable").checked;

  try {
    const res = await fetch(
      isEditing ? `${apiUrl}/${editingRoomId}` : apiUrl,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      }
    );
    if (!res.ok) throw new Error("Failed to save room");
    roomModal.classList.add("hidden");
    await fetchRooms();
  } catch (err) {
    alert("Error saving room.");
    console.error(err);
  }
});

roomTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    if (confirm("Delete this room?")) {
      try {
        const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        await fetchRooms();
      } catch (err) {
        alert("Error deleting room.");
      }
    }
  }
});

function openEditModal(room) {
  isEditing = true;
  editingRoomId = room.room_id;
  modalTitle.textContent = "Edit Room";
  document.getElementById("room_id").value = room.room_id;
  document.getElementById("hotel_id").value = room.hotel_id;
  document.getElementById("room_number").value = room.room_number;
  document.getElementById("capacity").value = room.capacity;
  document.getElementById("views").value = room.views;
  document.getElementById("price").value = room.price;
  document.getElementById("damages").value = room.damages || "";
  document.getElementById("extendable").checked = room.extendable;
  roomModal.classList.remove("hidden");
}

// Filters
[filterStart, filterEnd, filterCapacity, filterView, filterHotel, filterPrice].forEach(input => {
  input.addEventListener("input", fetchRooms);
});

clearFiltersBtn.addEventListener("click", () => {
  filterStart.value = "";
  filterEnd.value = "";
  filterCapacity.value = "";
  filterView.value = "";
  filterHotel.value = "";
  filterPrice.value = "";
  fetchRooms();
});

async function fetchSummaryData() {
  try {
    const [capacityRes, areaRes] = await Promise.all([
      fetch(hotelCapacityUrl),
      fetch(roomsPerAreaUrl)
    ]);

    const capacities = await capacityRes.json();
    const areas = await areaRes.json();

    summaryContainer.innerHTML = `
      <h3>Hotel Capacity Summary</h3>
      <ul>
        ${capacities.map(h => `<li>Hotel ${h.hotel_id} (${h.h_address}): ${h.total_capacity} people</li>`).join('')}
      </ul>
      <h3>Available Rooms Per Area</h3>
      <ul>
      ${areas.map(a => `<li>${a.area} (${a.hotel_address}): ${a.available_rooms} rooms</li>`).join('')}
      </ul>
    `;
  } catch (err) {
    console.error("Error fetching summary data:", err);
  }
}

fetchRooms();
fetchSummaryData();
