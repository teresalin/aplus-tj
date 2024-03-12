CREATE TYPE gender AS ENUM ('Male', 'Female', 'Other');
CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  gender gender,
  phone VARCHAR(50),
  email VARCHAR(50),
  date_of_birth DATE,
  notes VARCHAR(256),
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP,

  -- Create a unique constraint on the combination of name, phone, and date_of_birth
  CONSTRAINT unique_person_details UNIQUE (name, phone, date_of_birth)
);

CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id) NOT NULL,
  role_id INT REFERENCES staff_role(id) NOT NULL,
  join_date DATE,
  leave_date DATE,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- allow DELETE
CREATE TABLE staff_role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE parent (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id) NOT NULL,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- TODO keep track of EZTalking ID
CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id) NOT NULL,
  english_name VARCHAR(50),
  current_school VARCHAR(50),
  textbook_publisher VARCHAR(50),
  grade_id INT REFERENCES grade(id) NOT NULL,
  join_date DATE,
  leave_date DATE,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE user_identifier (
  id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id) NOT NULL,
  identifier_type VARCHAR(50),
  identifier_value VARCHAR(50),
  is_social_media BOOLEAN,
  -- Add other relevant fields if needed
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);
INSERT INTO user_identifier (person_id, identifier_type, identifier_value, is_social_media, time_created, time_updated)
VALUES (1, 'Twitter', '@example', true, NOW(), NOW());
INSERT INTO user_identifier (person_id, identifier_type, identifier_value, is_social_media, time_created, time_updated)
VALUES (1, 'Account ID', '12345', false, NOW(), NOW());

CREATE TABLE class (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  teacher_id INT REFERENCES staff(id) NOT NULL,
  grade_id INT REFERENCES grade(id) NOT NULL,
  capacity INTEGER,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE class_cost (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES class(id) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL, -- Use the appropriate data type for currency
  currency VARCHAR(3), -- Store the currency code, e.g., USD, EUR, etc.
  effective_date DATE, -- Date when this cost becomes effective
  notes VARCHAR(256), -- Additional notes about the cost
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE grade (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE class_student (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES class(id) NOT NULL,
  student_id INT REFERENCES student(id) NOT NULL,
  start_date DATE,
  end_date DATE,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- TODO capture subjects and notes?
-- keep track of old session date
CREATE TABLE session (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES class(id) NOT NULL,
  session_date DATE,
  start_time TIME,
  end_time TIME,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  session_id INT REFERENCES session(id) NOT NULL,
  student_id INT REFERENCES student(id) NOT NULL,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- allow DELETE; auto delete any thing beyond 30 days
-- TODO move this to session level?
CREATE TABLE assignment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  description VARCHAR(255),
  due_date DATE,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- allow DELETE
CREATE TABLE class_assignment (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES class(id) NOT NULL,
  assignment_id INT REFERENCES assignment(id) NOT NULL,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TYPE day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
CREATE TABLE schedule (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES class(id) NOT NULL,
  day_of_week day_of_week,
  start_time TIME,
  end_time TIME,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- manual enter
CREATE TABLE holiday (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  holiday_date DATE UNIQUE,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- each record represents a billing statement for a specific period (e.g., a month)
-- create new records for each billing cycle (month) for each student.
-- when a student makes a payment, create a new record,
-- but use a negative value in the amount field to indicate a payment
-- bill beginning of month
-- calculate previous month bills
CREATE TABLE student_billing_record (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES student(id) NOT NULL,
  billing_date DATE,
  description VARCHAR(256),
  amount INT, -- Use the appropriate data type for currency
  payment_method VARCHAR(50), -- Method of payment, e.g., credit card, cash, check
  invoice_number VARCHAR(50),
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- one row per class session
CREATE TABLE student_billing_details (
  id SERIAL PRIMARY KEY,
  billing_record_id INT REFERENCES student_billing_record(id) NOT NULL,
  category_id INT REFERENCES billing_category(id),
  amount DECIMAL(10, 2), -- The amount for this specific category in the billing record
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE student_payment_method (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES student(id) NOT NULL,
  payment_method VARCHAR(50), -- e.g., credit card, bank account
  account_number VARCHAR(50), -- Account or card number
  expiration_date DATE, -- For credit cards
  billing_address VARCHAR(256), -- For the payment method
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE billing_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50), -- Name of the category, e.g., "Tuition," "Books," "Supplies"
  description VARCHAR(256), -- A brief description of the category
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);
