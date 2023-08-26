import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";
import { Person } from "../persons";

function parsePerson(row: any): Person {
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
          persons.id,
          persons.name,
          persons.gender,
          persons.phone,
          persons.email,
          persons.date_of_birth,
          persons.notes,
          persons.active,
          staffs.join_date,
          staffs.leave_date
      FROM
          staffs
      JOIN
          persons ON staffs.person_id = persons.id;
      `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parsePerson));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
