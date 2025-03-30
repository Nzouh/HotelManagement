// roomsC.js

const apiUrl = "http://localhost:3002/api/rooms/available";
const hotelCapacityUrl = "http://localhost:3002/api/hotel-capacity";
const roomsPerAreaUrl = "http://localhost:3002/api/available-rooms-per-area";

const roomTableBody = document.querySelector("#room-table tbody");
const filterStart = document.getElementById("filter-start");
const filterEnd = document.getElementById("filter-end");
const filterCapacity = document.getElementById("filter-capacity");
const filterView = document.getElementById("filter-view");
const filterPrice = document.getElementById("filter-price");
const applyFiltersBtn = document.getElementById("apply-filters");
const clearFiltersBtn = document.getElementById("clear-filters");
const summaryContainer = document.getElementById("summary-container");

const urlParams = new URLSearchParams(window.location.search);
const hotelIdFromURL = urlParams.get("hotel_id");

async function fetchRooms() {
  const params = new URLSearchParams();

  if (hotelIdFromURL) params.append("hotel_id", hotelIdFromURL);
  if (filterStart && filterStart.value) params.append("start", filterStart.value);
  if (filterEnd && filterEnd.value) params.append("end", filterEnd.value);
  if (filterCapacity && filterCapacity.value) params.append("capacity", filterCapacity.value);
  if (filterView && filterView.value) params.append("area", filterView.value);
  if (filterPrice && filterPrice.value) params.append("price", filterPrice.value);

  try {
    const res = await fetch(`${apiUrl}?${params.toString()}`);
    const rooms = await res.json();
    renderTable(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
  }
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
      <td>${r.damages || "None"}</td>
      <td><button onclick="chooseRoom(${r.room_id})">Choose</button></td>
    `;
    roomTableBody.appendChild(row);
  });
}

function chooseRoom(roomId) {
  window.location.href = `bookingsC.html?room_ID=${roomId}`;
}

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

applyFiltersBtn.addEventListener("click", fetchRooms);

clearFiltersBtn.addEventListener("click", () => {
  filterStart.value = "";
  filterEnd.value = "";
  filterCapacity.value = "";
  filterView.value = "";
  filterPrice.value = "";
  fetchRooms();
});

fetchRooms();
fetchSummaryData();
