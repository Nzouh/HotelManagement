--This index will be used to check if there's a an existing renting for a
--specific room at a hotel
CREATE INDEX idx__room_occupancy ON Renting(r_sdate, r_edate, room_ID);

--This index will be used to search different price ranges for rooms
CREATE INDEX idx_price_range ON Room(hotel_id ,price)

--To see if this email/client already exists in our system
CREATE INDEX idx_client ON Customer(c_email)
