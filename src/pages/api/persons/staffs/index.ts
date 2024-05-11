import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseStaff } from "../../../../../utils/apiUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT
          person.id AS person_id,
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
    res.status(200).json({
      status: "Success",
      result: result.rows.map(parseStaff),
      message: "Staffs retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving staffs", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  } finally {
    if (client) {
      await releaseDBClient(client);
    }
  }
};
