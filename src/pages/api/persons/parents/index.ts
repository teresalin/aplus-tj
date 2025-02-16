import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

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
          parent.id AS parent_id
        FROM
          parent
        JOIN
          person ON parent.person_id = person.id;
        `,
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows,
      message: "Parents retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving parents", error);
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
