
--View 1: the first view is the number of available rooms per area.
CREATE OR REPLACE VIEW AvailableRoomsPerArea AS
SELECT 
    h.h_address AS hotel_address,
    r.views AS area,
    COUNT(r.room_ID) AS available_rooms
FROM 
    Hotel h
JOIN 
    Room r ON h.hotel_id = r.hotel_id
LEFT JOIN 
    Renting rent ON r.room_ID = rent.room_ID
    AND (rent.r_edate IS NULL OR rent.r_edate ::DATE > CURRENT_DATE) -- excluding rented rooms
GROUP BY 
    h.h_address, r.views;