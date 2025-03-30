const apiUrl = "http://localhost:3002/api/rentings";
const rentingsTableBody = document.querySelector("#rentings-table tbody");
const addRentingBtn = document.getElementById("add-renting-btn");
const rentingModal = document.getElementById("renting-modal");
const rentingForm = document.getElementById("renting-form");
const cancelBtn = document.getElementById("cancel-btn");

let isEditing = false;
let editingRentingId = null;

async function fetchRentings() {
  try {
    const res = await fetch(apiUrl);
    const rentings = await res.json();
    renderTable(rentings);
  } catch (err) {
    console.error("Failed to fetch rentings:", err);
  }
}

function renderTable(rentings) {
  rentingsTableBody.innerHTML = "";
  rentings.forEach((r) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.rent_id}</td>
      <td>${r.room_id}</td>
      <td>${r.c_sin}</td>
      <td>${r.e_sin}</td>
      <td>${r.r_sdate}</td>
      <td>${r.r_edate}</td>
      <td><button onclick="deleteRenting(${r.rent_id})">Delete</button></td>
    `;
    row.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        openEditModal(r);
      }
    });
    rentingsTableBody.appendChild(row);
  });
}

function openEditModal(renting) {
  isEditing = true;
  editingRentingId = renting.rent_id;
  document.getElementById("rent_id").value = renting.rent_id;
  document.getElementById("room_ID").value = renting.room_id;
  document.getElementById("c_sin").value = renting.c_sin;
  document.getElementById("e_sin").value = renting.e_sin;
  document.getElementById("r_sdate").value = renting.r_sdate;
  document.getElementById("r_edate").value = renting.r_edate;
  rentingModal.classList.remove("hidden");
}

async function deleteRenting(id) {
  if (!confirm("Are you sure you want to delete this renting?")) return;
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await fetchRentings();
  } catch (err) {
    alert("Error deleting renting.");
    console.error(err);
  }
}

addRentingBtn.addEventListener("click", () => {
  isEditing = false;
  editingRentingId = null;
  rentingForm.reset();
  document.getElementById("rent_id").removeAttribute("readonly");
  document.getElementById("rent_id").value = "";
  rentingModal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  rentingModal.classList.add("hidden");
});

rentingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const rentIdInput = document.getElementById("rent_id");
  const rentData = {
    rent_id: rentIdInput.value,
    room_ID: document.getElementById("room_ID").value,
    c_sin: document.getElementById("c_sin").value,
    e_sin: document.getElementById("e_sin").value,
    r_sdate: document.getElementById("r_sdate").value,
    r_edate: document.getElementById("r_edate").value,
  };

  try {
    const res = await fetch(
      isEditing ? `${apiUrl}/${editingRentingId}` : apiUrl,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rentData),
      }
    );
    if (!res.ok) throw new Error("Failed to save renting");
    rentingModal.classList.add("hidden");
    await fetchRentings();
  } catch (err) {
    alert("Error saving renting.");
    console.error(err);
  }
});

fetchRentings();
