CREATE DATABASE HotelDB;
USE HotelDB;
-- SIN has 9 digits
-- Dates have 14 chars (YYYYMMDDHHMMSS)

CREATE TABLE HotelChain(
    chain_id INTEGER PRIMARY KEY CHECK(chain_id > 0),
    number_of_hotels INT CHECK(number_of_hotels >= 0),
    hq_address VARCHAR(200) NOT NULL,
    hq_email VARCHAR(100) UNIQUE
);

-- Multi-attribute for HotelChain (Headquarters Phone Numbers)
CREATE TABLE hq_phone_numbers(
    hq_pn_ID INTEGER PRIMARY KEY,
    chain_id INTEGER,
    FOREIGN KEY (chain_id) REFERENCES HotelChain(chain_id),
    hq_pn VARCHAR(20) UNIQUE
);

CREATE TABLE Hotel(
    hotel_id INTEGER PRIMARY KEY,
    chain_id INTEGER,
    FOREIGN KEY (chain_id) REFERENCES HotelChain(chain_id),
    h_address VARCHAR(200) NOT NULL,
    h_email VARCHAR(100) UNIQUE,
    number_rooms INTEGER CHECK(number_rooms >= 0),
    rating FLOAT CHECK (rating IN (0,1,2,3,4,5))
);

-- Multi-attribute for Hotel (Hotel Phone Numbers)
CREATE TABLE hotel_phone_numbers(
    hotel_pn_ID INTEGER PRIMARY KEY,
    hotel_id INTEGER NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id),
    hotel_pn VARCHAR(20) UNIQUE
);

CREATE TABLE Room(
    room_ID INTEGER PRIMARY KEY,
    hotel_id INTEGER,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id),
    room_number INTEGER CHECK (room_number >= 0),
    price FLOAT CHECK (price >= 0),
    capacity VARCHAR(15) CHECK (capacity IN ('Single', 'Full', 'Double', 'Queen', 'King')),
    views VARCHAR(100) CHECK (views IN ('Mountain', 'Sea', 'Other')),
    damages VARCHAR(200),
    extendable BOOLEAN
);

-- Multi-attribute for Room (Room Amenities)
CREATE TABLE Amenities(
    amen_id INTEGER PRIMARY KEY,
    room_ID INTEGER,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID),
    aments VARCHAR(100) CHECK (aments IN ('TV', 'Air Conditioner', 'Fridge'))
);

CREATE TABLE Customer(
    c_sin VARCHAR(9) PRIMARY KEY,
    c_name VARCHAR(100) NOT NULL,
    c_email VARCHAR(100) NOT NULL UNIQUE,
    c_address VARCHAR(200) NOT NULL,
    dor VARCHAR(14),
    CHECK (c_sin LIKE '_________')  -- 9 underscores for 9 chars
);

CREATE TABLE Employee(
    e_sin VARCHAR(9) PRIMARY KEY,
    e_name VARCHAR(100) NOT NULL,
    e_address VARCHAR(200) NOT NULL,
    pos VARCHAR(100) ,
    CHECK (e_sin LIKE '_________')  -- 9 underscores for 9 chars
);

-- Renting Table
CREATE TABLE Renting(
    rent_id INTEGER PRIMARY KEY,
    r_sdate VARCHAR(14), -- renting start date
    r_edate VARCHAR(14), -- renting end date
    e_sin VARCHAR(9),
    FOREIGN KEY (e_sin) REFERENCES Employee(e_sin),
    c_sin VARCHAR(9),
    FOREIGN KEY (c_sin) REFERENCES Customer(c_sin),
    room_ID INTEGER,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID),
    CHECK (e_sin LIKE '_________'),
    CHECK (c_sin LIKE '_________')
);

-- Booking Table
CREATE TABLE Booking(
    booking_id INTEGER PRIMARY KEY,
    dob VARCHAR(14), -- date of booking
    checkin VARCHAR(14),
    checkout VARCHAR(14),
    c_sin VARCHAR(9),
    room_ID INTEGER,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID),
    FOREIGN KEY (c_sin) REFERENCES Customer(c_sin),
    CHECK (c_sin LIKE '_________')
);

-- Archives Table
CREATE TABLE Archives(
    arch_id INTEGER PRIMARY KEY,
    rent_id INTEGER UNIQUE CHECK(rent_id >= 0),
    FOREIGN KEY (rent_id) REFERENCES Renting(rent_id),
    booking_id INTEGER,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    c_sin VARCHAR(9),
    FOREIGN KEY (c_sin) REFERENCES Customer(c_sin),
    e_sin VARCHAR(9),
    FOREIGN KEY (e_sin) REFERENCES Employee(e_sin),
    chain_id INTEGER,
    FOREIGN KEY (chain_id) REFERENCES HotelChain(chain_id),
    arch_date VARCHAR(14),
    CHECK (c_sin LIKE '_________'),
    CHECK (e_sin LIKE '_________')
);

-- Payment Table
CREATE TABLE Payment(
    dot VARCHAR(14) NOT NULL, -- date of transaction
    pay_info VARCHAR(300) NOT NULL,
    rent_ID INTEGER PRIMARY KEY,
    FOREIGN KEY (rent_ID) REFERENCES Renting(rent_ID)
);

