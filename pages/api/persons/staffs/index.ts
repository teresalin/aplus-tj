import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Person } from "..";
import { Role } from "./roles";
import { parseStaff } from "../../../../utils/apiUtils";

export interface Staff extends Person {
  staffId: number;
  role: Role;
  joinDate: Date;
  leaveDate: Date;
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
          staff.id AS staff_id,
          staff.join_date,
          staff.leave_date
        FROM
          staff
        JOIN
          person ON staff.person_id = person.id;
      `,
    };
    const result = await client.query(query);
    res.status(200).json(result.rows.map(parseStaff));
  } catch (error) {
    console.error("Error retrieving staffs", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
