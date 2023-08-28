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
  person_id int REFERENCES person(id) NOT NULL,
  role_id int REFERENCES staff_role(id) NOT NULL,
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
  person_id int REFERENCES person(id) NOT NULL,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  person_id int REFERENCES person(id) NOT NULL,
  english_name VARCHAR(50),
  current_school VARCHAR(50),
  textbook_publisher VARCHAR(50),
  grade_id int REFERENCES grade(id) NOT NULL,
  join_date DATE,
  leave_date DATE,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE class (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  teacher_id int REFERENCES staff(id) NOT NULL,
  grade_id int REFERENCES grade(id) NOT NULL,
  capacity INTEGER,
  active BOOLEAN,
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
  class_id int REFERENCES class(id) NOT NULL,
  student_id int REFERENCES student(id) NOT NULL,
  start_date DATE,
  end_date DATE,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- TODO capture subjects and notes?
CREATE TABLE session (
  id SERIAL PRIMARY KEY,
  class_id int REFERENCES class(id) NOT NULL,
  session_date DATE,
  start_time TIME,
  end_time TIME,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  session_id int REFERENCES session(id) NOT NULL,
  student_id int REFERENCES student(id) NOT NULL,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

-- allow DELETE; auto delete any thing beyond 30 days
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
  class_id int REFERENCES class(id) NOT NULL,
  assignment_id int REFERENCES assignment(id) NOT NULL,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TYPE day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
CREATE TABLE schedule (
  id SERIAL PRIMARY KEY,
  class_id int REFERENCES class(id) NOT NULL,
  day_of_week day_of_week,
  start_time TIME,
  end_time TIME,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE holiday (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  holiday_date DATE UNIQUE,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);
