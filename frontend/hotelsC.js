// hotelsC.js

const apiUrl = "http://localhost:3002/api/hotels";

const hotelTableBody = document.querySelector("#hotel-table tbody");
const searchInput = document.getElementById("search-hotel");

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
      <td>${h.h_address}</td>
      <td>${h.h_email}</td>
      <td>${h.number_rooms}</td>
      <td>${h.rating}</td>
      <td><button class="choose-btn" data-id="${h.hotel_id}">Choose</button></td>
    `;
    row.querySelector(".choose-btn").addEventListener("click", () => {
      window.location.href = `roomsC.html?hotel_id=${h.hotel_id}`;
    });
    hotelTableBody.appendChild(row);
  });
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
