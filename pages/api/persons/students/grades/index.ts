import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../../lib/db-connector";

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
    res.status(200).json(result.rows as Grade[]);
  } catch (error) {
    console.error("Error retrieving grades", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
