import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Student {
  id: number;
  name: string;
  englishName: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  currentSchool: string;
  textbookPublisher: string;
  grade: string;
  notes: string;
  joinDate: Date;
  leaveDate: Date;
  active: boolean;
}

function parseStudent(row: any): Student {
  return {
    id: row.id,
    name: row.name,
    englishName: row.english_name,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    currentSchool: row.current_school,
    textbookPublisher: row.textbook_publisher,
    grade: row.grade_name,
    notes: row.notes,
    joinDate: row.join_date,
    leaveDate: row.leave_date,
    active: row.active,
  };
}

// TODO join grade table to get grade
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT 
          s.id,
          s.english_name,
          s.current_school,
          s.textbook_publisher,
          s.join_date, 
          s.leave_date, 
          p.*,
          g.name AS grade_name
        FROM student s
        INNER JOIN person p ON s.person_id = p.id
        INNER JOIN grade g ON s.grade_id = g.id;
      `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseStudent));
  } catch (error) {
    console.error("Error retrieving students", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
