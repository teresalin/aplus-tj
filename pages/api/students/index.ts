import { NextApiRequest, NextApiResponse } from "next";

import { getDBClient } from "../../../lib/db-connector";
import { Grade } from "./grades";
import { Person } from "../persons";

export interface Student extends Person {
  studentId: number;
  englishName: string;
  currentSchool: string;
  textbookPublisher: string;
  grade: Grade;
  joinDate: Date;
  leaveDate: Date;
}

function parseStudent(row: any): Student {
  return {
    id: row.id,
    studentId: row.student_id,
    name: row.name,
    englishName: row.english_name,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    currentSchool: row.current_school,
    textbookPublisher: row.textbook_publisher,
    grade: {
      id: row.grade_id,
      name: row.grade_name,
    },
    joinDate: row.join_date,
    leaveDate: row.leave_date,
    notes: row.notes,
    active: row.active,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const query = {
      text: `
        SELECT 
          person.id,
          person.name,
          person.gender,
          person.phone,
          person.email,
          person.date_of_birth,
          person.notes,
          person.active,
          student.id AS student_id,
          student.english_name,
          student.current_school,
          student.textbook_publisher,
          student.join_date, 
          student.leave_date, 
          grade.id AS grade_id,
          grade.name AS grade_name
        FROM student
        INNER JOIN person ON student.person_id = person.id
        INNER JOIN grade ON student.grade_id = grade.id;
      `,
    };
    const result = await client.query(query);
    res.status(200).json(result.rows.map(parseStudent));
  } catch (error) {
    console.error("Error retrieving students", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
