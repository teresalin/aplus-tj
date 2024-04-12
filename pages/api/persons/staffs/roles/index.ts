import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export interface Role {
  id: number;
  name: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
          SELECT id, name FROM staff_role;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json({
      status: "Success",
      result: result.rows as Role[],
      message: "Roles retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving staff roles", error);
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
