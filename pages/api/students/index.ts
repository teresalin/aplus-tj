import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  joinDate: Date;
  leaveDate: Date;
  notes: string;
  active: boolean;
}

function parseStudent(row: any): Student {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    joinDate: row.join_date,
    leaveDate: row.leave_date,
    notes: row.notes,
    active: row.active,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT s.id, s.join_date, s.leave_date, p.*
        FROM students s
        INNER JOIN persons p ON s.person_id = p.id;
      `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseStudent));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
