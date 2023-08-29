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
    englishName: row.englishName,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    currentSchool: row.current_school,
    textbookPublisher: row.textbook_publisher,
    grade: row.grade,
    notes: row.notes,
    joinDate: row.join_date,
    leaveDate: row.leave_date,
    active: row.active,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT 
          s.id,
          s.join_date, 
          s.leave_date, 
          p.*
        FROM student s
        INNER JOIN person p ON s.person_id = p.id;
      `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseStudent));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
