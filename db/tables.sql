CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  phone VARCHAR(30) UNIQUE,
  email VARCHAR(256) UNIQUE,
  teacher BOOLEAN,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE classes(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  teacher int REFERENCES users(id) NOT NULL,
  capacity INTEGER,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE sessions(
  id SERIAL PRIMARY KEY,
  class_id int REFERENCES classes(id) NOT NULL,
  session_date DATE,
  start_time TIME,
  end_time TIME,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE assignments(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  description VARCHAR(256),
  due_date DATE,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE class_assignments(
  id SERIAL PRIMARY KEY,
  class_id int REFERENCES classes(id) NOT NULL,
  assignment_id int REFERENCES assignments(id) NOT NULL,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE parents(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  phone VARCHAR(30) UNIQUE,
  email VARCHAR(256) UNIQUE,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE students(
  id SERIAL PRIMARY KEY,
  parent_id int REFERENCES parents(id) NOT NULL,
  name VARCHAR(50),
  phone VARCHAR(30) UNIQUE,
  email VARCHAR(256) UNIQUE,
  birthday DATE,
  join_date DATE,
  leave_date DATE,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TABLE class_students(
  id SERIAL PRIMARY KEY,
  class_id int REFERENCES classes(id) NOT NULL,
  student_id int REFERENCES students(id) NOT NULL,
  start_date DATE,
  end_date DATE,
  active BOOLEAN,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

CREATE TYPE day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
CREATE TABLE schedules(
  id SERIAL PRIMARY KEY,
  class_id int REFERENCES classes(id) NOT NULL,
  day_of_week day_of_week,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);
