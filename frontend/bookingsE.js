// bookingsE.js

const apiUrl = "http://localhost:3002/api/bookings";
const bookingsTableBody = document.querySelector("#bookings-table tbody");
const addBookingBtn = document.getElementById("add-booking-btn");
const bookingModal = document.getElementById("booking-modal");
const bookingForm = document.getElementById("booking-form");
const modalTitle = document.getElementById("modal-title");
const cancelBtn = document.getElementById("cancel-btn");

let isEditing = false;
let editingBookingId = null;

async function fetchBookings() {
  try {
    const res = await fetch(apiUrl);
    const bookings = await res.json();
    console.log("Received bookings:", bookings);
    renderTable(bookings);
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
  }
}

function renderTable(bookings) {
  bookingsTableBody.innerHTML = "";
  bookings.forEach((b) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.booking_id}</td>
      <td>${b.c_sin}</td>
      <td>${b.room_id}</td>
      <td>${b.dob}</td>
      <td>${b.checkin}</td>
      <td>${b.checkout}</td>
      <td>
        <button onclick="deleteBooking(${b.booking_id})">Delete</button>
        <button onclick="sendToRenting(${b.booking_id})">Send to Renting</button>
      </td>
    `;
    row.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        openEditModal(b);
      }
    });
    bookingsTableBody.appendChild(row);
  });
}

function openEditModal(booking) {
  isEditing = true;
  editingBookingId = booking.booking_id;
  modalTitle.textContent = "Edit Booking";
  bookingModal.classList.remove("hidden");
  const bookingIdInput = document.getElementById("booking-id");
  if (bookingIdInput) bookingIdInput.value = booking.booking_id;
  document.getElementById("room_ID").value = booking.room_id;
  document.getElementById("c_sin").value = booking.c_sin;
  document.getElementById("dob").value = booking.dob;
  document.getElementById("checkin").value = booking.checkin;
  document.getElementById("checkout").value = booking.checkout;
}

addBookingBtn.addEventListener("click", () => {
  isEditing = false;
  editingBookingId = null;
  modalTitle.textContent = "Add Booking";
  bookingForm.reset();
  bookingModal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  bookingModal.classList.add("hidden");
});

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const bookingIdInput = document.getElementById("booking-id");
  const bookingData = {
    booking_id: bookingIdInput ? bookingIdInput.value : undefined,
    room_ID: document.getElementById("room_ID").value,
    c_sin: document.getElementById("c_sin").value,
    dob: document.getElementById("dob").value,
    checkin: document.getElementById("checkin").value,
    checkout: document.getElementById("checkout").value,
  };

  try {
    const res = await fetch(
      isEditing ? `${apiUrl}/${editingBookingId}` : apiUrl,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      }
    );
    if (!res.ok) throw new Error("Failed to save booking");
    bookingModal.classList.add("hidden");
    await fetchBookings();
  } catch (err) {
    alert("Error saving booking.");
    console.error(err);
  }
});

async function deleteBooking(bookingId) {
  if (confirm("Delete this booking?")) {
    try {
      const res = await fetch(`${apiUrl}/${bookingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchBookings();
    } catch (err) {
      alert("Error deleting booking.");
    }
  }
}

async function sendToRenting(bookingId) {
    const e_sin = prompt("Enter your employee SIN (9 digits):");
    if (!e_sin || e_sin.length !== 9 || !/^\d{9}$/.test(e_sin)) {
      alert("Invalid SIN. It must be 9 digits.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3002/api/rentings/from-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id: bookingId, e_sin }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to send booking to renting");
      }
  
      alert("Booking successfully transferred to Renting!");
      await fetchBookings(); // Refresh the bookings table
    } catch (err) {
      console.error("Error sending to renting:", err);
      alert("Error transferring booking to renting.");
    }
  }
  

fetchBookings();
