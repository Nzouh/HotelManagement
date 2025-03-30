const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db.js');

const roomRoutes = require('./routes/rooms.js');
const bookingRoutes = require('./routes/bookings.js');
const hotelRoutes = require('./routes/hotels.js');
const rentingRoutes = require('./routes/rentings.js');
const customerRoutes = require('./routes/customers.js');
const employeeRoutes = require('./routes/employees.js');
const archiveRoutes = require('./routes/archives.js');
const paymentRoutes = require('./routes/payments.js');
const hotelCapacityRoutes = require('./routes/hotelCapacity.js');
const availableRoomsPerAreaRoutes = require('./routes/availableRoomsPerArea');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Route handler for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// API routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rentings', rentingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/hotel-capacity', hotelCapacityRoutes);
app.use('/api/available-rooms-per-area', availableRoomsPerAreaRoutes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
