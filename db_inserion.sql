
----Insertion

-- Inserting into HotelChain
INSERT INTO HotelChain (chain_id, number_of_hotels, hq_address, hq_email)
VALUES 
(1, 8, '123 Main St, ON', 'contact1@hotelchain.com'),
(2, 9, '456 Elm St, QC', 'contact2@hotelchain.com'),
(3, 10, '789 Oak St, BC', 'contact3@hotelchain.com'),
(4, 8, '101 Maple St, SK', 'contact4@hotelchain.com'),
(5, 8, '202 Pine St, MA', 'contact5@hotelchain.com');





-- Inserting into Hotel
INSERT INTO Hotel (hotel_id, chain_id, h_address, h_email, number_rooms, rating)
VALUES
--Ontario locations, 8 hotels
(1, 1, '1st Ave, ON', 'hotel1@chain1.com', 50, 4),
(2, 1, '2nd Ave, ON', 'hotel2@chain1.com', 60, 5),
(3, 1, '3rd Ave, ON', 'hotel3@chain1.com', 45, 3),
(4, 1, '4th Ave, ON', 'hotel4@chain1.com', 70, 5),
(5, 1, '5th Ave, ON', 'hotel5@chain1.com', 19, 2),

(6, 1, '6th Ave, ON', 'hotel6@chain1.com', 41, 4),
(7, 1, '7th Ave, ON', 'hotel7@chain1.com', 33, 5),
(8, 1, '8th Ave, ON', 'hotel8@chain1.com', 39, 4)

-- Quebec locations, 9 hotels
INSERT INTO Hotel (hotel_id, chain_id, h_address, h_email, number_rooms, rating)
VALUES
(9, 2, '1st St, QC', 'hotel1@chain2.com', 55, 4),
(10, 2, '2nd St, QC', 'hotel2@chain2.com', 62, 5),
(11, 2, '3rd St, QC', 'hotel3@chain2.com', 47, 3),
(12, 2, '4th St, QC', 'hotel4@chain2.com', 70, 5),
(13, 2, '5th St, QC', 'hotel5@chain2.com', 20, 2),
(14, 2, '6th St, QC', 'hotel6@chain2.com', 40, 4),
(15, 2, '7th St, QC', 'hotel7@chain2.com', 34, 5),
(16, 2, '8th St, QC', 'hotel8@chain2.com', 38, 4),
(17, 2, '9th St, QC', 'hotel9@chain2.com', 45, 3);

-- British Columbia locations, 10 hotels
INSERT INTO Hotel (hotel_id, chain_id, h_address, h_email, number_rooms, rating)
VALUES
(18, 3, '1st Ave, BC', 'hotel1@chain3.com', 52, 4),
(19, 3, '2nd Ave, BC', 'hotel2@chain3.com', 63, 5),
(20, 3, '3rd Ave, BC', 'hotel3@chain3.com', 44, 3),
(21, 3, '4th Ave, BC', 'hotel4@chain3.com', 71, 5),
(22, 3, '5th Ave, BC', 'hotel5@chain3.com', 25, 2),
(23, 3, '6th Ave, BC', 'hotel6@chain3.com', 43, 4),
(24, 3, '7th Ave, BC', 'hotel7@chain3.com', 31, 5),
(25, 3, '8th Ave, BC', 'hotel8@chain3.com', 38, 4),
(26, 3, '9th Ave, BC', 'hotel9@chain3.com', 49, 3),
(27, 3, '10th Ave, BC', 'hotel10@chain3.com', 60, 5);

-- Saskatchewan locations, 8 hotels
INSERT INTO Hotel (hotel_id, chain_id, h_address, h_email, number_rooms, rating)
VALUES
(28, 4, '1st St, SK', 'hotel1@chain4.com', 48, 4),
(29, 4, '2nd St, SK', 'hotel2@chain4.com', 67, 5),
(30, 4, '3rd St, SK', 'hotel3@chain4.com', 41, 3),
(31, 4, '4th St, SK', 'hotel4@chain4.com', 75, 5),
(32, 4, '5th St, SK', 'hotel5@chain4.com', 22, 2),
(33, 4, '6th St, SK', 'hotel6@chain4.com', 40, 4),
(34, 4, '7th St, SK', 'hotel7@chain4.com', 36, 5),
(35, 4, '8th St, SK', 'hotel8@chain4.com', 33, 4);

-- Manitoba locations, 8 hotels
INSERT INTO Hotel (hotel_id, chain_id, h_address, h_email, number_rooms, rating)
VALUES
(36, 5, '1st Ave, MA', 'hotel1@chain5.com', 51, 4),
(37, 5, '2nd Ave, MA', 'hotel2@chain5.com', 65, 5),
(38, 5, '3rd Ave, MA', 'hotel3@chain5.com', 42, 3),
(39, 5, '4th Ave, MA', 'hotel4@chain5.com', 72, 5),
(40, 5, '5th Ave, MA', 'hotel5@chain5.com', 28, 2),
(41, 5, '6th Ave, MA', 'hotel6@chain5.com', 39, 4),
(42, 5, '7th Ave, MA', 'hotel7@chain5.com', 34, 5),
(43, 5, '8th Ave, MA', 'hotel8@chain5.com', 37, 4);







-- Inserting Rooms for Ontario (Hotel 1 and Hotel 2)
INSERT INTO Room (room_ID, hotel_id, room_number, price, capacity, views, damages, extendable)
VALUES
-- Hotel 1
(1, 1, 101, 100.00, 'Single', 'Mountain', 'None', TRUE),
(2, 1, 102, 150.00, 'Double', 'Sea', 'None', FALSE),
(3, 1, 103, 200.00, 'Queen', 'Other', 'Minor scratches', TRUE),
(4, 1, 104, 250.00, 'King', 'Mountain', 'None', FALSE),
(5, 1, 105, 300.00, 'Full', 'Sea', 'None', TRUE),

-- Hotel 2
(6, 2, 201, 110.00, 'Single', 'Sea', 'None', TRUE),
(7, 2, 202, 160.00, 'Double', 'Mountain', 'None', TRUE),
(8, 2, 203, 210.00, 'Queen', 'Other', 'None', FALSE),
(9, 2, 204, 260.00, 'King', 'Sea', 'Minor cracks', TRUE),
(10, 2, 205, 310.00, 'Full', 'Mountain', 'None', FALSE);

-- Quebec (Hotel 9 and Hotel 10)
INSERT INTO Room (room_ID, hotel_id, room_number, price, capacity, views, damages, extendable)
VALUES
-- Hotel 9
(11, 9, 301, 120.00, 'Single', 'Mountain', 'None', TRUE),
(12, 9, 302, 170.00, 'Double', 'Sea', 'None', TRUE),
(13, 9, 303, 220.00, 'Queen', 'Other', 'None', FALSE),
(14, 9, 304, 270.00, 'King', 'Mountain', 'None', TRUE),
(15, 9, 305, 320.00, 'Full', 'Sea', 'Minor stains', FALSE),

-- Hotel 10
(16, 10, 401, 130.00, 'Single', 'Other', 'None', FALSE),
(17, 10, 402, 180.00, 'Double', 'Mountain', 'None', TRUE),
(18, 10, 403, 230.00, 'Queen', 'Sea', 'None', TRUE),
(19, 10, 404, 280.00, 'King', 'Other', 'Minor scratches', FALSE),
(20, 10, 405, 330.00, 'Full', 'Mountain', 'None', TRUE);

-- British Columbia (Hotel 17 and Hotel 18)
INSERT INTO Room (room_ID, hotel_id, room_number, price, capacity, views, damages, extendable)
VALUES
-- Hotel 17
(21, 17, 501, 140.00, 'Single', 'Sea', 'None', TRUE),
(22, 17, 502, 190.00, 'Double', 'Mountain', 'None', FALSE),
(23, 17, 503, 240.00, 'Queen', 'Other', 'Minor cracks', TRUE),
(24, 17, 504, 290.00, 'King', 'Sea', 'None', TRUE),
(25, 17, 505, 340.00, 'Full', 'Mountain', 'None', FALSE),

-- Hotel 18
(26, 18, 601, 150.00, 'Single', 'Mountain', 'None', TRUE),
(27, 18, 602, 200.00, 'Double', 'Sea', 'Minor stains', TRUE),
(28, 18, 603, 250.00, 'Queen', 'Other', 'None', FALSE),
(29, 18, 604, 300.00, 'King', 'Mountain', 'Minor cracks', TRUE),
(30, 18, 605, 350.00, 'Full', 'Sea', 'None', FALSE);

-- Saskatchewan (Hotel 25 and Hotel 26)
INSERT INTO Room (room_ID, hotel_id, room_number, price, capacity, views, damages, extendable)
VALUES
-- Hotel 25
(31, 25, 701, 160.00, 'Single', 'Sea', 'None', FALSE),
(32, 25, 702, 210.00, 'Double', 'Mountain', 'Minor scratches', TRUE),
(33, 25, 703, 260.00, 'Queen', 'Other', 'None', TRUE),
(34, 25, 704, 310.00, 'King', 'Sea', 'Minor stains', FALSE),
(35, 25, 705, 360.00, 'Full', 'Mountain', 'None', TRUE),

-- Hotel 26
(36, 26, 801, 170.00, 'Single', 'Other', 'None', TRUE),
(37, 26, 802, 220.00, 'Double', 'Mountain', 'Minor cracks', FALSE),
(38, 26, 803, 270.00, 'Queen', 'Sea', 'None', TRUE),
(39, 26, 804, 320.00, 'King', 'Other', 'None', FALSE),
(40, 26, 805, 370.00, 'Full', 'Mountain', 'Minor stains', TRUE);

-- Manitoba (Hotel 33 and Hotel 34)
INSERT INTO Room (room_ID, hotel_id, room_number, price, capacity, views, damages, extendable)
VALUES
-- Hotel 33
(41, 33, 901, 180.00, 'Single', 'Mountain', 'None', FALSE),
(42, 33, 902, 230.00, 'Double', 'Sea', 'None', TRUE),
(43, 33, 903, 280.00, 'Queen', 'Other', 'Minor scratches', TRUE),
(44, 33, 904, 330.00, 'King', 'Mountain', 'None', FALSE),
(45, 33, 905, 380.00, 'Full', 'Sea', 'Minor cracks', TRUE),

-- Hotel 34
(46, 34, 1001, 190.00, 'Single', 'Sea', 'None', TRUE),
(47, 34, 1002, 240.00, 'Double', 'Mountain', 'Minor stains', TRUE),
(48, 34, 1003, 290.00, 'Queen', 'Other', 'None', FALSE),
(49, 34, 1004, 340.00, 'King', 'Sea', 'None', TRUE),
(50, 34, 1005, 390.00, 'Full', 'Mountain', 'Minor scratches', FALSE);





