import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Staff {
  id: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes: string;
  joinDate: Date;
  leaveDate: Date;
  active: boolean;
}

function parseStaff(row: any): Staff {
  return {
    id: row.id,
    name: row.name,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    notes: row.notes,
    joinDate: row.join_date,
    leaveDate: row.leaveDate,
    active: row.active,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
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
          staff.join_date,
          staff.leave_date
      FROM
          staff
      JOIN
          person ON staff.person_id = person.id;
      `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseStaff));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
