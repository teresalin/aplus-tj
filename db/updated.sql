CREATE TABLE persons (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES persons(id),
  student_id VARCHAR(20) UNIQUE,
  grade VARCHAR(10),
  enrollment_date DATE
);

CREATE TABLE staff (
  id UUID PRIMARY KEY REFERENCES persons(id),
  staff_id VARCHAR(20) UNIQUE,
  position VARCHAR(50),
  department VARCHAR(50),
  hire_date DATE
);

CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES persons(id),
  parent_id VARCHAR(20) UNIQUE,
  occupation VARCHAR(50)
);
