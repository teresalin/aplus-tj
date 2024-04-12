import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export interface Grade {
  id: number;
  name: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();

  try {
    const query = {
      text: `
          SELECT id, name FROM grade;
        `,
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows as Grade[],
      message: "Grades retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving grades", error);
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
