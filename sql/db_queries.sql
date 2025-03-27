-- Rooms with no damages
SELECT room_ID, room_number, price, capacity
FROM Room
WHERE damages = 'None';

-- Rooms with Sea view
SELECT room_ID, room_number, price, capacity
FROM Room 
WHERE views = 'Sea';

-- Rooms with a King or Queen bed
SELECT room_ID, room_number, price, capacity, views
FROM Room 
WHERE capacity = 'King' OR capacity = 'Queen';


-- Hotels only in Ontario
SELECT hotel_id, chain_id, h_address, h_email, number_rooms, rating
From hotel
WHERE h_address LIKE '%ON%';


-- Hotels with a rating above average compartivaly to all the other hotels
--Nested Query
SELECT hotel_id, h_address, rating
FROM Hotel
WHERE rating > (
    SELECT AVG(rating) 
    FROM Hotel
);

-- The amount of money a hotel can return through renting
--Aggregation through SUM
SELECT h.hotel_id, h.h_address, SUM(rm.price) AS total_revenue
FROM Hotel h
JOIN Room rm ON h.hotel_id = rm.hotel_id
JOIN Renting rt ON rm.room_ID = rt.room_ID
GROUP BY h.hotel_id, h.h_address
ORDER BY total_revenue DESC;
