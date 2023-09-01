INSERT INTO staff_role (name, time_created, time_updated)
VALUES ('Admin', NOW(), NOW());
INSERT INTO staff_role (name, time_created, time_updated)
VALUES ('Teacher', NOW(), NOW());
INSERT INTO staff_role (name, time_created, time_updated)
VALUES ('Assistant', NOW(), NOW());

INSERT INTO grade (name, time_created, time_updated)
VALUES ('1st Grade', NOW(), NOW());
INSERT INTO grade (name, time_created, time_updated)
VALUES ('2nd Grade', NOW(), NOW());
INSERT INTO grade (name, time_created, time_updated)
VALUES ('3rd Grade', NOW(), NOW());
INSERT INTO grade (name, time_created, time_updated)
VALUES ('4rd Grade', NOW(), NOW());

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

INSERT INTO person (name, gender, phone, email, date_of_birth, notes, active, time_created, time_updated)
VALUES ('Michael Scott', 'Male', '0928777362', 'michaelscott@test.com', '1989-12-24', 'Hates Toby', 't', NOW(), NOW());
INSERT INTO person (name, gender, phone, email, date_of_birth, notes, active, time_created, time_updated)
VALUES ('Holy Flax', 'Female', '0928777363', 'hollyflax@test.com', '1990-11-09', 'Hates Toby', 't', NOW(), NOW());
INSERT INTO person (name, gender, phone, email, date_of_birth, notes, active, time_created, time_updated)
VALUES ('John Doe', 'Male', '0932097363', 'johndoe@test.com', '2010-11-09', 'Plays the violin and guitar', 't', NOW(), NOW());
INSERT INTO person (name, gender, phone, email, date_of_birth, active, time_created, time_updated)
VALUES ('Jane Doe', 'Female', '0918477260', 'janedoe@test.com', '2013-07-16', 't', NOW(), NOW());

INSERT INTO student (person_id, english_name, current_school, textbook_publisher, grade_id, join_date, time_created, time_updated)
VALUES (4, 'Jane Doe', 'American School of Taichung', 'Pearon', 3, '2022-09-08', NOW(), NOW());
INSERT INTO student (person_id, english_name, current_school, textbook_publisher, grade_id, join_date, time_created, time_updated)
VALUES (3, 'John Doe', 'American School of Taichung', 'McGraw Hill Education', 3, '2022-10-22', NOW(), NOW());

INSERT INTO staff (person_id, role_id, join_date, time_created, time_updated)
VALUES (1, 2, '2022-10-27', NOW(), NOW());
INSERT INTO staff (person_id, role_id, join_date, time_created, time_updated)
VALUES (2, 2, '2023-01-27', NOW(), NOW());

INSERT INTO class (name, teacher_id, grade_id, capacity, active, time_created, time_updated)
VALUES ('3rd Grade English', 1, 3, 10, 't', NOW(), NOW());
INSERT INTO class (name, teacher_id, grade_id, capacity, active, time_created, time_updated)
VALUES ('4th Grade English', 1, 4, 10, 't', NOW(), NOW());

INSERT INTO session (class_id, session_date, start_time, end_time, time_created, time_updated)
VALUES (3, '2023-08-14', '18:00:00', '19:30:00', NOW(), NOW());
INSERT INTO session (class_id, session_date, start_time, end_time, time_created, time_updated)
VALUES (3, '2023-08-16', '18:00:00', '19:30:00', NOW(), NOW());
INSERT INTO session (class_id, session_date, start_time, end_time, time_created, time_updated)
VALUES (3, '2023-08-21', '18:00:00', '19:30:00', NOW(), NOW());
INSERT INTO session (class_id, session_date, start_time, end_time, time_created, time_updated)
VALUES (3, '2023-08-23', '18:00:00', '19:30:00', NOW(), NOW());

INSERT INTO class_student (class_id, student_id, start_date, active, time_created, time_updated)
VALUES (3, 1, NOW(), 't', NOW(), NOW());
INSERT INTO class_student (class_id, student_id, start_date, active, time_created, time_updated)
VALUES (3, 2, NOW(), 't', NOW(), NOW());

INSERT INTO schedule (class_id, day_of_week, start_time, end_time, time_created, time_updated)
VALUES (3, 'Monday', '18:00:00', '19:30:00', NOW(), NOW());
INSERT INTO schedule (class_id, day_of_week, start_time, end_time, time_created, time_updated)
VALUES (3, 'Wednesday', '18:00:00', '19:30:00', NOW(), NOW());
ALTER TABLE schedule 
ALTER COLUMN end_time TYPE TIME;

INSERT INTO assignment (name, description, due_date, time_created, time_updated)
VALUES ('English Composition 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2023-11-01', NOW(), NOW());
INSERT INTO assignment (name, description, due_date, time_created, time_updated)
VALUES ('ESL Mock Essay', 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '2023-12-14', NOW(), NOW());

INSERT INTO class_assignment (class_id, assignment_id, time_created, time_updated)
VALUES (3, 1, NOW(), NOW());
INSERT INTO class_assignment (class_id, assignment_id, time_created, time_updated)
VALUES (3, 2, NOW(), NOW());