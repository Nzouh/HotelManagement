CREATE OR REPLACE FUNCTION validate_customer_data_fn()
RETURNS trigger AS $$
BEGIN
    IF NEW.c_sin !~ '^[0-9]{9}$' THEN
        RAISE EXCEPTION 'SIN must be 9 digits.';
    END IF;

    IF POSITION('@' IN NEW.c_email) = 0 OR POSITION('.' IN NEW.c_email) = 0 THEN
        RAISE EXCEPTION 'Invalid email format.';
    END IF;

    IF LENGTH(TRIM(NEW.c_name)) = 0 THEN
        RAISE EXCEPTION 'Customer name cannot be empty.';
    END IF;

    IF LENGTH(TRIM(NEW.c_address)) = 0 THEN
        RAISE EXCEPTION 'Address cannot be empty.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_customer_data ON Customer;

CREATE TRIGGER validate_customer_data
BEFORE INSERT ON Customer
FOR EACH ROW
EXECUTE FUNCTION validate_customer_data_fn();


CREATE OR REPLACE FUNCTION prevent_double_renting_fn()
RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM Renting
        WHERE room_ID = NEW.room_ID
        AND (
            (NEW.r_sdate BETWEEN r_sdate AND r_edate)
            OR (NEW.r_edate BETWEEN r_sdate AND r_edate)
            OR (r_sdate BETWEEN NEW.r_sdate AND NEW.r_edate)
        )
    ) THEN
        RAISE EXCEPTION 'Room is already rented during the specified dates.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_double_renting ON Renting;

CREATE TRIGGER prevent_double_renting
BEFORE INSERT ON Renting
FOR EACH ROW
EXECUTE FUNCTION prevent_double_renting_fn();


CREATE OR REPLACE FUNCTION prevent_duplicate_room_number_fn()
RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM Room
        WHERE hotel_id = NEW.hotel_id
        AND room_number = NEW.room_number
    ) THEN
        RAISE EXCEPTION 'Duplicate room number in the same hotel.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_duplicate_room_number ON Room;

CREATE TRIGGER prevent_duplicate_room_number
BEFORE INSERT OR UPDATE ON Room
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_room_number_fn();



CREATE OR REPLACE FUNCTION validate_employee_data_fn()
RETURNS trigger AS $$
BEGIN
    IF NEW.e_sin !~ '^[0-9]{9}$' THEN
        RAISE EXCEPTION 'Invalid SIN for employee. Must be 9 digits.';
    END IF;

    IF LENGTH(TRIM(NEW.e_name)) = 0 THEN
        RAISE EXCEPTION 'Employee name cannot be empty.';
    END IF;

    IF LENGTH(TRIM(NEW.e_address)) = 0 THEN
        RAISE EXCEPTION 'Employee address cannot be empty.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_employee_data ON Employee;

CREATE TRIGGER validate_employee_data
BEFORE INSERT ON Employee
FOR EACH ROW
EXECUTE FUNCTION validate_employee_data_fn();
