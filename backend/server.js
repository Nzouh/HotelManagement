// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db.js'); 

const roomRoutes = require('./routes/rooms.js');
const bookingRoutes = require('./routes/bookings.js');
const availableRoomsRoutes = require('./routes/availableRooms.js');
const hotelRoutes = require('./routes/hotels.js');
const rentingRoutes = require('./routes/rentings.js');
const customerRoutes = require('./routes/customers.js');
const employeeRoutes = require('./routes/employees.js');
const archiveRoutes = require('./routes/archives.js');
const paymentRoutes = require('./routes/payments.js');
const hotelCapacityRoutes = require('./routes/hotelCapacity.js');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/available-rooms', availableRoomsRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rentings', rentingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/hotel-capacity', hotelCapacityRoutes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
