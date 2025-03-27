CREATE TRIGGER validate_customer_data
BEFORE INSERT ON Customer
FOR EACH ROW
BEGIN
    IF NEW.c_sin NOT REGEXP '^[0-9]{9}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'SIN must be 9 digits.';
    END IF;

    IF NEW.c_email NOT LIKE '%@%.%' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format.';
    END IF;

    IF LENGTH(TRIM(NEW.c_name)) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer name cannot be empty.';
    END IF;

    IF LENGTH(TRIM(NEW.c_address)) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Address cannot be empty.';
    END IF;
END;


CREATE TRIGGER prevent_double_renting
BEFORE INSERT ON Renting
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Renting
        WHERE room_ID = NEW.room_ID
        AND (
            (NEW.r_sdate BETWEEN r_sdate AND r_edate)
            OR
            (NEW.r_edate BETWEEN r_sdate AND r_edate)
            OR
            (r_sdate BETWEEN NEW.r_sdate AND NEW.r_edate)
        )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Room is already rented during the specified dates.';
    END IF;
END;


CREATE TRIGGER prevent_duplicate_room_number
BEFORE INSERT ON Room
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Room
        WHERE hotel_id = NEW.hotel_id
        AND room_number = NEW.room_number
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Duplicate room number in the same hotel.';
    END IF;
END;


CREATE TRIGGER validate_employee_email
BEFORE INSERT ON Employee
FOR EACH ROW
BEGIN
    IF NEW.e_sin NOT REGEXP '^[0-9]{9}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid SIN for employee. Must be 9 digits.';
    END IF;

    IF LENGTH(TRIM(NEW.e_name)) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee name cannot be empty.';
    END IF;

    IF LENGTH(TRIM(NEW.e_address)) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee address cannot be empty.';
    END IF;
END;
