document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("room_ID");
    const roomIdInput = document.getElementById("room-id");
    const dobInput = document.getElementById("dob");
  
    // Pre-fill hidden room ID and today's date as dob
    if (roomId) roomIdInput.value = roomId;
    dobInput.valueAsDate = new Date();
  
    const form = document.getElementById("booking-form");
    function generateRandomId() {
        return Math.floor(100000 + Math.random() * 900000); // 6-digit ID
      }
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
      
        const bookingData = {
          booking_id: generateRandomId(),
          room_ID: roomIdInput.value,
          dob: dobInput.value,
          checkin: document.getElementById("checkin").value,
          checkout: document.getElementById("checkout").value,
          c_sin: document.getElementById("c_sin").value,
        };
        
        console.log(bookingData);
      
        try {
          const response = await fetch("http://localhost:3002/api/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
          });
      
          if (!response.ok) {
            const error = await response.json();
            alert("Booking failed: " + (error.error || "Unknown error"));
          } else {
            alert("Booking successful!");
            window.location.href = "index.html";
          }
        } catch (err) {
          console.error("Error submitting booking:", err);
          alert("Booking failed due to server error.");
        }
      });
  });
  