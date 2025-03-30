document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:3002/api/customers";
    const customerTableBody = document.querySelector("#customer-table tbody");
    const addCustomerBtn = document.getElementById("add-customer-btn");
    const customerFormModal = document.getElementById("customer-form-modal");
    const customerForm = document.getElementById("customer-form");
    const cancelBtn = document.getElementById("cancel-btn");
    const formTitle = document.getElementById("form-title");
    const searchInput = document.getElementById("search-customer");
  
    let isEditing = false;
    let editingSIN = null;
  
    async function fetchCustomers() {
      const res = await fetch(apiUrl);
      const customers = await res.json();
      renderTable(customers);
    }
  
    function renderTable(customers) {
      customerTableBody.innerHTML = "";
      customers.forEach((c) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${c.c_sin}</td>
          <td>${c.c_name}</td>
          <td>${c.c_email}</td>
          <td>${c.c_address}</td>
          <td>${c.dor || ""}</td>
          <td><button class="delete-btn" data-id="${c.c_sin}">Delete</button></td>
        `;
        row.addEventListener("click", (e) => {
          if (!e.target.classList.contains("delete-btn")) {
            openEditModal(c);
          }
        });
        customerTableBody.appendChild(row);
      });
    }
  
    addCustomerBtn.addEventListener("click", () => {
      isEditing = false;
      editingSIN = null;
      formTitle.textContent = "Add Customer";
      customerForm.reset();
      customerFormModal.classList.remove("hidden");
    });
  
    cancelBtn.addEventListener("click", () => {
      customerFormModal.classList.add("hidden");
    });
  
    customerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(customerForm);
      const customerData = Object.fromEntries(formData.entries());
  
      try {
        const res = await fetch(
          isEditing ? `${apiUrl}/${editingSIN}` : apiUrl,
          {
            method: isEditing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
          }
        );
        if (!res.ok) {
            const errorData = await res.json(); // Get the error message from server
            alert(errorData.error || "Failed to save customer");
            throw new Error(errorData.error || "Failed to save customer");
          }
          
        customerFormModal.classList.add("hidden");
        await fetchCustomers();
      } catch (err) {
        alert("Error saving customer.");
        console.error(err);
      }
    });
  
    customerTableBody.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const sin = e.target.dataset.id;
        if (confirm("Delete this customer?")) {
          try {
            const res = await fetch(`${apiUrl}/${sin}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            await fetchCustomers();
          } catch (err) {
            alert("Error deleting customer.");
          }
        }
      }
    });
  
    function openEditModal(customer) {
      isEditing = true;
      editingSIN = customer.c_sin;
      formTitle.textContent = "Edit Customer";
      document.getElementById("c_sin").value = customer.c_sin;
      document.getElementById("c_name").value = customer.c_name;
      document.getElementById("c_email").value = customer.c_email;
      document.getElementById("c_address").value = customer.c_address;
      document.getElementById("dor").value = customer.dor || "";
      customerFormModal.classList.remove("hidden");
    }
  
    searchInput.addEventListener("input", async (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const res = await fetch(apiUrl);
      const customers = await res.json();
      const filtered = customers.filter(
        (c) =>
          c.c_name.toLowerCase().includes(searchTerm) ||
          c.c_email.toLowerCase().includes(searchTerm)
      );
      renderTable(filtered);
    });
  
    fetchCustomers();
  });
  