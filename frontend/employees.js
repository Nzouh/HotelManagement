// employees.js

const apiUrl = "http://localhost:3002/api/employees";

const employeeTableBody = document.querySelector("#employee-table tbody");
const addEmployeeBtn = document.getElementById("add-employee-btn");
const employeeModal = document.getElementById("employee-modal");
const employeeForm = document.getElementById("employee-form");
const modalTitle = document.getElementById("modal-title");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search-employee");

let isEditing = false;
let editingSIN = null;

async function fetchEmployees() {
  const res = await fetch(apiUrl);
  const employees = await res.json();
  renderTable(employees);
}

function renderTable(employees) {
  employeeTableBody.innerHTML = "";
  employees.forEach((e) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.e_sin}</td>
      <td>${e.e_name}</td>
      <td>${e.e_address}</td>
      <td>${e.pos || ""}</td>
      <td><button class="delete-btn" data-id="${e.e_sin}">Delete</button></td>
    `;
    row.addEventListener("click", (event) => {
      if (!event.target.classList.contains("delete-btn")) {
        openEditModal(e);
      }
    });
    employeeTableBody.appendChild(row);
  });
}

addEmployeeBtn.addEventListener("click", () => {
  isEditing = false;
  editingSIN = null;
  modalTitle.textContent = "Add Employee";
  employeeForm.reset();
  employeeModal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  employeeModal.classList.add("hidden");
});

employeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(employeeForm);
  const employeeData = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(
      isEditing ? `${apiUrl}/${editingSIN}` : apiUrl,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      }
    );
    if (!res.ok) {
        const errorData = await res.json(); // Get the error message from server
        alert(errorData.error || "Failed to save Employee");
        throw new Error(errorData.error || "Failed to save Employee");
      }
          employeeModal.classList.add("hidden");
    await fetchEmployees();
  } catch (err) {
    alert("Error saving employee.");
    console.error(err);
  }
});

employeeTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const sin = e.target.dataset.id;
    if (confirm("Delete this employee?")) {
      try {
        const res = await fetch(`${apiUrl}/${sin}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        await fetchEmployees();
      } catch (err) {
        alert("Error deleting employee.");
      }
    }
  }
});

function openEditModal(employee) {
  isEditing = true;
  editingSIN = employee.e_sin;
  modalTitle.textContent = "Edit Employee";
  document.getElementById("e_sin").value = employee.e_sin;
  document.getElementById("e_name").value = employee.e_name;
  document.getElementById("e_address").value = employee.e_address;
  document.getElementById("pos").value = employee.pos || "";
  employeeModal.classList.remove("hidden");
}

searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const res = await fetch(apiUrl);
  const employees = await res.json();
  const filtered = employees.filter(
    (e) =>
      e.e_name.toLowerCase().includes(searchTerm) ||
      e.e_address.toLowerCase().includes(searchTerm)
  );
  renderTable(filtered);
});

fetchEmployees();
