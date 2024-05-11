import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  const { email } = req.query;

  const query = {
    text: `
      SELECT * FROM users WHERE users.email = $1;
    `,
    values: [email],
  };
  try {
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows[0],
      message: "User retrieved successfully.",
    });
  } catch (err) {
    console.error("Error retrieving user", err);
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
