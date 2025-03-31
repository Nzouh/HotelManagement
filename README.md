Hotel Management System group 11

A. Technologies Used

DBMS

PostgreSQLThe database system used for storing all data related to customers, employees, hotels, rooms, bookings, rentings, and archive history.

Programming Languages

Frontend: HTML, CSS, JavaScript Used for building the user interface and client-side interactivity.

Backend: Node.js (JavaScript) with Express.jsHandles routing, API endpoints, and communication with the PostgreSQL database using the pg module.

B. Installation Instructions

1. Clone the Repository

git clone https://github.com/Nzouh/HotelManagement
cd HotelManagement

2. Install Required Dependencies

npm install express pg cors dotenv

3. Configure the Environment

Create a .env file in the project root and add your PostgreSQL credentials:

DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_database_name

4. Set Up the Database

Open your PostgreSQL client (e.g., pgAdmin or psql) and execute the following script to create all necessary tables.

C. DDL Statements – Database Setup

CREATE TABLE Customer (
    c_sin VARCHAR(9) PRIMARY KEY,
    c_name VARCHAR(50),
    c_email VARCHAR(50),
    c_phone VARCHAR(15),
    CHECK (c_sin LIKE '_________')
);

CREATE TABLE Employee (
    e_sin VARCHAR(9) PRIMARY KEY,
    e_name VARCHAR(50),
    e_email VARCHAR(50),
    e_phone VARCHAR(15),
    CHECK (e_sin LIKE '_________')
);

CREATE TABLE HotelChain (
    chain_id INTEGER PRIMARY KEY,
    chain_name VARCHAR(50),
    headquarters VARCHAR(100),
    phone VARCHAR(15)
);

CREATE TABLE Hotel (
    hotel_id INTEGER PRIMARY KEY,
    chain_id INTEGER,
    hotel_name VARCHAR(50),
    area VARCHAR(100),
    phone VARCHAR(15),
    FOREIGN KEY (chain_id) REFERENCES HotelChain(chain_id)
);

CREATE TABLE Room (
    room_id INTEGER PRIMARY KEY,
    hotel_id INTEGER,
    room_type VARCHAR(20),
    price NUMERIC(10, 2),
    capacity INTEGER,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
);

CREATE TABLE Booking (
    booking_id INTEGER PRIMARY KEY,
    dob VARCHAR(14),
    checkin VARCHAR(14),
    checkout VARCHAR(14),
    c_sin VARCHAR(9),
    room_ID INTEGER,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID),
    FOREIGN KEY (c_sin) REFERENCES Customer(c_sin),
    CHECK (c_sin LIKE '_________')
);

CREATE TABLE Renting (
    rent_id INTEGER PRIMARY KEY,
    r_sdate VARCHAR(14),
    r_edate VARCHAR(14),
    e_sin VARCHAR(9),
    FOREIGN KEY (e_sin) REFERENCES Employee(e_sin),
    c_sin VARCHAR(9),
    FOREIGN KEY (c_sin) REFERENCES Customer(c_sin),
    room_ID INTEGER,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID),
    CHECK (e_sin LIKE '_________'),
    CHECK (c_sin LIKE '_________')
);

CREATE TABLE Archives (
    arch_id INTEGER PRIMARY KEY,
    rent_id INTEGER,
    booking_id INTEGER,
    c_sin VARCHAR(9),
    e_sin VARCHAR(9),
    chain_id INTEGER,
    arch_date VARCHAR(14),
    FOREIGN KEY (rent_id) REFERENCES Renting(rent_id),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (c_sin) REFERENCES Customer(c_sin),
    FOREIGN KEY (e_sin) REFERENCES Employee(e_sin),
    FOREIGN KEY (chain_id) REFERENCES HotelChain(chain_id),
    CHECK (c_sin LIKE '_________'),
    CHECK (e_sin LIKE '_________')
);

✅ Note: Make sure to create the database itself before running the above script. For example:

CREATE DATABASE hotel_db;

D. Running the Application

Start the Backend Server

node index.js

Server runs at: http://localhost:3002

Launch the Frontend

Open index.html in your browser manually or serve it via an HTTP server.

Use the role buttons (Administrator, Employee, Customer) to navigate through different views of the system.