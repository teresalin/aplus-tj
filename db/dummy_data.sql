INSERT INTO staff_roles (name, time_created, time_updated)
VALUES ('Admin', NOW(), NOW());
INSERT INTO staff_roles (name, time_created, time_updated)
VALUES ('Teacher', NOW(), NOW());
INSERT INTO staff_roles (name, time_created, time_updated)
VALUES ('Assistant', NOW(), NOW());

INSERT INTO classes (name, teacher_id, capacity, active, time_created, time_updated)
VALUES ('3rd Grade English', 3, 10, 't', NOW(), NOW());
INSERT INTO classes (name, teacher_id, capacity, active, time_created, time_updated)
VALUES ('4th Grade English', 3, 10, 't', NOW(), NOW());

INSERT INTO class_students (class_id, student_id, start_date, active, time_created, time_updated)
VALUES (3, 1, NOW(), 't', NOW(), NOW());
INSERT INTO class_students (class_id, student_id, start_date, active, time_created, time_updated)
VALUES (3, 2, NOW(), 't', NOW(), NOW());

CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  class_id int REFERENCES classes(id) NOT NULL,
  day_of_week day_of_week,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  time_created TIMESTAMP,
  time_updated TIMESTAMP
);

INSERT INTO schedules (class_id, day_of_week, start_time, end_time, time_created, time_updated)
VALUES (3, 'Monday', '00:00:00', '00:00:00', NOW(), NOW());
ALTER TABLE schedules 
ALTER COLUMN end_time TYPE TIME;