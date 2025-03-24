--View 2: the second view is the aggregated capacity of all the rooms of a specific hotel.
CREATE VIEW HotelRoomCapacity AS
SELECT 
    h.hotel_id,
    h.h_address,
    SUM(CASE 
        WHEN r.capacity = 'Single' THEN 1
        WHEN r.capacity = 'Double' THEN 2
        WHEN r.capacity = 'Queen' THEN 3
        WHEN r.capacity = 'King' THEN 4
        WHEN r.capacity = 'Full' THEN 5
        ELSE 0 
    END) AS total_capacity
FROM 
    Hotel h
JOIN 
    Room r ON h.hotel_id = r.hotel_id
GROUP BY 
    h.hotel_id, h.h_address;
