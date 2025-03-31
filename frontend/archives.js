const apiUrl = "http://localhost:3002/api/archives";
const archivesTableBody = document.querySelector("#archives-table tbody");

async function fetchArchives() {
    try {
      const res = await fetch(apiUrl);
      const archives = await res.json();
      console.log("Fetched archives:", archives); // 👈 Add this
      renderTable(archives);
    } catch (err) {
      console.error("Failed to fetch archives:", err);
    }
  }
  

function renderTable(archives) {
  archivesTableBody.innerHTML = "";
  archives.forEach((a) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${a.arch_id}</td>
        <td>${a.booking_id ?? "—"}</td>
        <td>${a.rent_id ?? "—"}</td>
        <td>${a.c_sin}</td>
        <td>${a.e_sin}</td>
        <td>${a.chain_id}</td>
        <td>${a.arch_date}</td>
    </tr>`;

  
    archivesTableBody.appendChild(row);
  });
}

fetchArchives();
